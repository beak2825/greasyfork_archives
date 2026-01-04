// ==UserScript==
// @name         Top/Bottom Navigation Buttons
// @namespace    https://openuserjs.org/
// @version      1.0.0
// @description  Adds sleek top and bottom navigation buttons with hover scrolling functionality for all websites
// @author       r3dhack3r
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538108/TopBottom%20Navigation%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/538108/TopBottom%20Navigation%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create CSS styles
    const style = document.createElement('style');
    style.textContent = `
        .nav-button {
            position: fixed;
            right: 20px;
            top: 50%;
            width: 36px;
            height: 36px;
            background: rgba(255, 255, 255, 0.95);
            border: 1px solid rgba(0, 0, 0, 0.1);
            border-radius: 6px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(8px);
        }
        
        .nav-button:hover {
            background: rgba(255, 255, 255, 1);
            border-color: rgba(0, 0, 0, 0.15);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
            transform: scale(1.05);
        }
        
        .nav-button:active {
            transform: scale(0.95);
            transition: all 0.1s ease;
        }
        
        .nav-button svg {
            width: 16px;
            height: 16px;
            fill: #374151;
            transition: all 0.25s ease;
        }
        
        .nav-button:hover svg {
            fill: #1f2937;
        }
        
        .nav-button.top {
            transform: translateY(-24px);
            opacity: 0;
            visibility: hidden;
        }
        
        .nav-button.bottom {
            transform: translateY(24px);
            opacity: 0;
            visibility: hidden;
        }
        
        .nav-button.visible {
            opacity: 1;
            visibility: visible;
        }
        
        .nav-button.scrolling {
            background: rgba(249, 250, 251, 1);
            border-color: rgba(0, 0, 0, 0.2);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
        }
    `;
    document.head.appendChild(style);

    // Create top button
    const topButton = document.createElement('button');
    topButton.className = 'nav-button top';
    topButton.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/>
        </svg>
    `;

    // Create bottom button
    const bottomButton = document.createElement('button');
    bottomButton.className = 'nav-button bottom';
    bottomButton.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
        </svg>
    `;

    // Add buttons to page
    document.body.appendChild(topButton);
    document.body.appendChild(bottomButton);

    // Scroll variables
    let scrollInterval;
    let isScrolling = false;

    // Smooth scroll function
    function smoothScroll(targetY, duration = 800) {
        const startY = window.pageYOffset;
        const distance = targetY - startY;
        const startTime = performance.now();
        
        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
        }
        
        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);
            
            window.scrollTo(0, startY + distance * easedProgress);
            
            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        
        requestAnimationFrame(step);
    }

    // Continuous scroll function
    function startContinuousScroll(direction) {
        if (isScrolling) return;
        
        isScrolling = true;
        const button = direction === 'up' ? topButton : bottomButton;
        button.classList.add('scrolling');
        
        scrollInterval = setInterval(() => {
            const scrollAmount = direction === 'up' ? -15 : 15;
            window.scrollBy(0, scrollAmount);
            
            // Stop if reached limits
            if (direction === 'up' && window.pageYOffset <= 0) {
                stopContinuousScroll();
            } else if (direction === 'down') {
                const documentHeight = Math.max(
                    document.body.scrollHeight,
                    document.body.offsetHeight,
                    document.documentElement.clientHeight,
                    document.documentElement.scrollHeight,
                    document.documentElement.offsetHeight
                );
                if ((window.innerHeight + window.pageYOffset) >= documentHeight - 10) {
                    stopContinuousScroll();
                }
            }
        }, 20);
    }

    function stopContinuousScroll() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
        isScrolling = false;
        topButton.classList.remove('scrolling');
        bottomButton.classList.remove('scrolling');
    }

    // Button event listeners
    topButton.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScroll(0);
    });

    bottomButton.addEventListener('click', (e) => {
        e.preventDefault();
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        smoothScroll(documentHeight - window.innerHeight);
    });

    // Hover events for continuous scrolling
    topButton.addEventListener('mouseenter', () => {
        setTimeout(() => {
            if (topButton.matches(':hover')) {
                startContinuousScroll('up');
            }
        }, 500); // Delay before starting continuous scroll
    });

    topButton.addEventListener('mouseleave', stopContinuousScroll);

    bottomButton.addEventListener('mouseenter', () => {
        setTimeout(() => {
            if (bottomButton.matches(':hover')) {
                startContinuousScroll('down');
            }
        }, 500); // Delay before starting continuous scroll
    });

    bottomButton.addEventListener('mouseleave', stopContinuousScroll);

    // Show/hide buttons based on scroll position
    function updateButtonVisibility() {
        const scrollTop = window.pageYOffset;
        const documentHeight = Math.max(
            document.body.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.clientHeight,
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight
        );
        const windowHeight = window.innerHeight;
        
        // Show top button if scrolled down
        if (scrollTop > 200) {
            topButton.classList.add('visible');
        } else {
            topButton.classList.remove('visible');
        }
        
        // Show bottom button if not at bottom
        if (scrollTop + windowHeight + 100 < documentHeight) {
            bottomButton.classList.add('visible');
        } else {
            bottomButton.classList.remove('visible');
        }
    }

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateButtonVisibility, 10);
    });

    // Initial visibility check
    setTimeout(updateButtonVisibility, 100);

    // Keyboard shortcuts (optional)
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            if (e.key === 'Home') {
                e.preventDefault();
                smoothScroll(0);
            } else if (e.key === 'End') {
                e.preventDefault();
                smoothScroll(document.body.scrollHeight - window.innerHeight);
            }
        }
    });

})();