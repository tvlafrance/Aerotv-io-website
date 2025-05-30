// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!navToggle.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all FAQ items
            faqItems.forEach(faqItem => {
                faqItem.classList.remove('active');
            });
            
            // Open clicked item if it wasn't active
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .pricing-card, .step, .stat-item, .app-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });

    // Counter animation for stats
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const animateCounter = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            
            // Format number with commas and + sign
            const formattedNumber = Math.floor(current).toLocaleString();
            if (element.textContent.includes('+')) {
                element.textContent = formattedNumber + '+';
            } else if (element.textContent.includes('%')) {
                element.textContent = current.toFixed(1) + '%';
            } else if (element.textContent.includes('/')) {
                element.textContent = Math.floor(current) + '/7';
            } else {
                element.textContent = formattedNumber;
            }
        }, 16);
    };

    // Observe stats section for counter animation
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const text = stat.textContent;
                    let targetNumber;
                    
                    if (text.includes('60,000')) {
                        targetNumber = 60000;
                    } else if (text.includes('66,000')) {
                        targetNumber = 66000;
                    } else if (text.includes('99.9')) {
                        targetNumber = 99.9;
                    } else if (text.includes('24')) {
                        targetNumber = 24;
                    }
                    
                    if (targetNumber) {
                        animateCounter(stat, targetNumber);
                    }
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Lazy loading for images (if any are added later)
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Form validation (if contact form is added)
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const email = formData.get('email');
            const message = formData.get('message');
            
            // Basic validation
            if (!email || !message) {
                showNotification('Please fill in all required fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4ade80' : type === 'error' ? '#ef4444' : '#667eea'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }

    // Pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            if (this.classList.contains('popular')) {
                this.style.transform = 'scale(1.05)';
            } else {
                this.style.transform = 'translateY(0) scale(1)';
            }
        });
    });

    // Interactive TV content tiles
    const contentTiles = document.querySelectorAll('.content-tile');
    
    if (contentTiles.length > 0) {
        let currentTile = 0;
        
        setInterval(() => {
            contentTiles.forEach(tile => tile.classList.remove('active'));
            contentTiles[currentTile].classList.add('active');
            currentTile = (currentTile + 1) % contentTiles.length;
        }, 3000);
        
        // Add active state styles
        const style = document.createElement('style');
        style.textContent = `
            .content-tile.active {
                transform: scale(1.1) !important;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }

    // Device selector tabs functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const pricingContainers = document.querySelectorAll('.pricing-container');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            // Get device count
            const deviceCount = button.dataset.devices;
            
            // Show/hide pricing containers (for now just show the first one)
            // In a real implementation, you'd have different pricing for different device counts
            console.log(`Selected ${deviceCount} device(s)`);
        });
    });

    // Channel logos animation
    const channelLogos = document.querySelectorAll('.channel-logo');
    
    if (channelLogos.length > 0) {
        let currentLogo = 0;
        
        setInterval(() => {
            channelLogos.forEach(logo => logo.classList.remove('highlight'));
            channelLogos[currentLogo].classList.add('highlight');
            currentLogo = (currentLogo + 1) % channelLogos.length;
        }, 2000);
        
        // Add highlight styles
        const logoStyle = document.createElement('style');
        logoStyle.textContent = `
            .channel-logo.highlight {
                background: rgba(255, 255, 255, 0.4) !important;
                transform: scale(1.1) !important;
                box-shadow: 0 5px 15px rgba(255, 255, 255, 0.3);
            }
        `;
        document.head.appendChild(logoStyle);
    }

    // Movie posters hover effect
    const moviePosters = document.querySelectorAll('.movie-poster');
    
    moviePosters.forEach(poster => {
        poster.addEventListener('mouseenter', () => {
            poster.style.transform = 'scale(1.1) rotateY(10deg)';
        });
        
        poster.addEventListener('mouseleave', () => {
            poster.style.transform = 'scale(1) rotateY(0deg)';
        });
    });

    // Quality indicators animation
    const qualityIndicators = document.querySelectorAll('.quality-indicator');
    
    if (qualityIndicators.length > 0) {
        let currentQuality = 0;
        
        setInterval(() => {
            qualityIndicators.forEach(indicator => indicator.classList.remove('active'));
            qualityIndicators[currentQuality].classList.add('active');
            currentQuality = (currentQuality + 1) % qualityIndicators.length;
        }, 4000);
    }

    // Device Compatibility Slider
    const devicesSlider = document.querySelector('.devices-slider');
    const deviceSlides = document.querySelectorAll('.device-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (devicesSlider && deviceSlides.length > 0) {
        let currentSlide = 0;
        const slidesToShow = window.innerWidth >= 768 ? 4 : 2; // Show 4 on desktop, 2 on mobile
        const maxSlide = Math.max(0, deviceSlides.length - slidesToShow);
        
        function updateSlider() {
            const slideWidth = deviceSlides[0].offsetWidth + 32; // 32px for gap
            const translateX = -currentSlide * slideWidth;
            devicesSlider.style.transform = `translateX(${translateX}px)`;
            
            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(currentSlide / slidesToShow));
            });
            
            // Update button states
            if (prevBtn && nextBtn) {
                prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
                nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
            }
        }
        
        function nextSlide() {
            if (currentSlide < maxSlide) {
                currentSlide++;
                updateSlider();
            }
        }
        
        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            }
        }
        
        // Event listeners for manual navigation
        if (nextBtn) {
            nextBtn.addEventListener('click', nextSlide);
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', prevSlide);
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index * slidesToShow;
                if (currentSlide > maxSlide) currentSlide = maxSlide;
                updateSlider();
            });
        });
        
        // Touch/swipe support for mobile
        let startX = 0;
        let isDragging = false;
        
        devicesSlider.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            isDragging = true;
        });
        
        devicesSlider.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        devicesSlider.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            isDragging = false;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;
            
            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        });
        
        // Initialize slider
        updateSlider();
        
        // Update on window resize
        window.addEventListener('resize', () => {
            updateSlider();
        });
    }

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Optimized scroll handler
    const optimizedScrollHandler = debounce(function() {
        const scrolled = window.scrollY > 100;
        navbar.classList.toggle('scrolled', scrolled);
    }, 10);

    window.addEventListener('scroll', optimizedScrollHandler);

    // Preload critical resources
    function preloadCriticalResources() {
        const criticalLinks = [
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
            'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
        ];
        
        criticalLinks.forEach(href => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'style';
            link.href = href;
            document.head.appendChild(link);
        });
    }

    // Initialize preloading
    preloadCriticalResources();

    // Add loading states for buttons
    const ctaButtons = document.querySelectorAll('.btn');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.href && this.href.includes('#')) {
                return; // Let anchor links work normally
            }
            
            // Add loading state for external links
            const originalText = this.textContent;
            this.textContent = 'Loading...';
            this.style.pointerEvents = 'none';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.pointerEvents = 'auto';
            }, 2000);
        });
    });

    // Initialize tooltips for feature icons
    const featureIcons = document.querySelectorAll('.feature-icon');
    
    featureIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = 'Premium Feature';
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 12px;
                top: -35px;
                left: 50%;
                transform: translateX(-50%);
                white-space: nowrap;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
            }, 100);
        });
        
        icon.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });

    // Movies Slider Functionality
    const moviesSlider = document.querySelector('.movies-slider');
    const movieSlides = document.querySelectorAll('.movie-slide');
    const moviesNextBtn = document.querySelector('.movies-next-btn');
    const moviesPrevBtn = document.querySelector('.movies-prev-btn');
    const moviesDots = document.querySelectorAll('.movies-dot');

    if (moviesSlider && movieSlides.length > 0) {
        let moviesCurrentSlide = 0;
        const moviesSlidesToShow = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
        const moviesMaxSlide = Math.max(0, movieSlides.length - moviesSlidesToShow);

        function updateMoviesSlider() {
            const slideWidth = movieSlides[0].offsetWidth + 32; // 32px for gap
            const translateX = -moviesCurrentSlide * slideWidth;
            moviesSlider.style.transform = `translateX(${translateX}px)`;

            // Update dots
            moviesDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(moviesCurrentSlide / moviesSlidesToShow));
            });
        }

        function moviesNextSlide() {
            if (moviesCurrentSlide < moviesMaxSlide) {
                moviesCurrentSlide++;
                updateMoviesSlider();
            }
        }

        function moviesPrevSlide() {
            if (moviesCurrentSlide > 0) {
                moviesCurrentSlide--;
                updateMoviesSlider();
            }
        }

        // Event listeners for manual navigation
        if (moviesNextBtn) {
            moviesNextBtn.addEventListener('click', moviesNextSlide);
        }

        if (moviesPrevBtn) {
            moviesPrevBtn.addEventListener('click', moviesPrevSlide);
        }

        // Dot navigation
        moviesDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                moviesCurrentSlide = index * moviesSlidesToShow;
                if (moviesCurrentSlide > moviesMaxSlide) moviesCurrentSlide = moviesMaxSlide;
                updateMoviesSlider();
            });
        });

        // Touch/swipe support for mobile
        let moviesStartX = 0;
        let moviesIsDragging = false;

        moviesSlider.addEventListener('touchstart', (e) => {
            moviesStartX = e.touches[0].clientX;
            moviesIsDragging = true;
        });

        moviesSlider.addEventListener('touchmove', (e) => {
            if (!moviesIsDragging) return;
            e.preventDefault();
        });

        moviesSlider.addEventListener('touchend', (e) => {
            if (!moviesIsDragging) return;
            moviesIsDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diffX = moviesStartX - endX;

            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    moviesNextSlide();
                } else {
                    moviesPrevSlide();
                }
            }
        });

        // Initialize slider
        updateMoviesSlider();

        // Update on window resize
        window.addEventListener('resize', () => {
            updateMoviesSlider();
        });
    }

    // Canals Slider Functionality
    const canalsSlider = document.querySelector('.canals-slider');
    const canalSlides = document.querySelectorAll('.canal-slide');
    const canalsNextBtn = document.querySelector('.canals-next-btn');
    const canalsPrevBtn = document.querySelector('.canals-prev-btn');
    const canalsDots = document.querySelectorAll('.canals-dot');

    if (canalsSlider && canalSlides.length > 0) {
        let canalsCurrentSlide = 0;
        const canalsSlidesToShow = window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
        const canalsMaxSlide = Math.max(0, canalSlides.length - canalsSlidesToShow);

        function updateCanalsSlider() {
            const slideWidth = canalSlides[0].offsetWidth + 32; // 32px for gap
            const translateX = -canalsCurrentSlide * slideWidth;
            canalsSlider.style.transform = `translateX(${translateX}px)`;

            // Update dots
            canalsDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === Math.floor(canalsCurrentSlide / canalsSlidesToShow));
            });
        }

        function canalsNextSlide() {
            if (canalsCurrentSlide < canalsMaxSlide) {
                canalsCurrentSlide++;
                updateCanalsSlider();
            }
        }

        function canalsPrevSlide() {
            if (canalsCurrentSlide > 0) {
                canalsCurrentSlide--;
                updateCanalsSlider();
            }
        }

        // Event listeners for manual navigation
        if (canalsNextBtn) {
            canalsNextBtn.addEventListener('click', canalsNextSlide);
        }

        if (canalsPrevBtn) {
            canalsPrevBtn.addEventListener('click', canalsPrevSlide);
        }

        // Dot navigation
        canalsDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                canalsCurrentSlide = index * canalsSlidesToShow;
                if (canalsCurrentSlide > canalsMaxSlide) canalsCurrentSlide = canalsMaxSlide;
                updateCanalsSlider();
            });
        });

        // Touch/swipe support for mobile
        let canalsStartX = 0;
        let canalsIsDragging = false;

        canalsSlider.addEventListener('touchstart', (e) => {
            canalsStartX = e.touches[0].clientX;
            canalsIsDragging = true;
        });

        canalsSlider.addEventListener('touchmove', (e) => {
            if (!canalsIsDragging) return;
            e.preventDefault();
        });

        canalsSlider.addEventListener('touchend', (e) => {
            if (!canalsIsDragging) return;
            canalsIsDragging = false;

            const endX = e.changedTouches[0].clientX;
            const diffX = canalsStartX - endX;

            if (Math.abs(diffX) > 50) { // Minimum swipe distance
                if (diffX > 0) {
                    canalsNextSlide();
                } else {
                    canalsPrevSlide();
                }
            }
        });

        // Initialize slider
        updateCanalsSlider();

        // Update on window resize
        window.addEventListener('resize', () => {
            updateCanalsSlider();
        });
    }

    // Console welcome message
    console.log('%c🚀 IPTV Premium Landing Page Loaded Successfully!', 'color: #22c55e; font-size: 16px; font-weight: bold;');
    console.log('%cBuilt with modern web technologies for optimal performance', 'color: #666; font-size: 12px;');
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// Error handling for missing elements
window.addEventListener('error', function(e) {
    console.warn('Non-critical error caught:', e.message);
});

// Performance monitoring
window.addEventListener('load', function() {
    setTimeout(function() {
        const perfData = performance.getEntriesByType('navigation')[0];
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        
        if (loadTime > 3000) {
            console.warn('Page load time is slower than expected:', loadTime + 'ms');
        } else {
            console.log('✅ Page loaded in:', loadTime + 'ms');
        }
    }, 0);
}); 