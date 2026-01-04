// ==UserScript==
// @name         RSS: FreshRSS Gestures and Auto-Scroll
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Gesture controls (swipe/double-tap) for FreshRSS: double-tap top half to close articles; double-tap bottom half and edge swipe to jump to article end
// @author       Your Name
// @homepage     https://greasyfork.org/en/scripts/525912
// @match        http://192.168.1.2:1030/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525912/RSS%3A%20FreshRSS%20Gestures%20and%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/525912/RSS%3A%20FreshRSS%20Gestures%20and%20Auto-Scroll.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Debug mode
    const DEBUG = false;

    // Swipe detection configuration
    const EDGE_THRESHOLD = 10;    // Distance from edge to start swipe
    const SWIPE_THRESHOLD = 50;   // Minimum distance for a swipe

    let touchStartX = 0;
    let touchStartY = 0;

    function debugLog(message) {
        if (DEBUG) {
            console.log(`[FreshRSS Script]: ${message}`);
        }
    }

    debugLog('Script loaded');

    // Function to scroll to element
    function scrollToElement(element) {
        if (element) {
            const header = document.querySelector('header');
            const headerHeight = header ? header.offsetHeight : 0;
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
            const scrollTarget = elementPosition - headerHeight - 20; // 20px padding from header

            window.scrollTo({
                top: scrollTarget,
                behavior: 'smooth'
            });
            debugLog('Scrolling element near top: ' + element.id);
        }
    }

    // Function to scroll to next element with peek
    function scrollToNextElement(element) {
        if (element) {
            const nextElement = element.nextElementSibling;
            if (nextElement) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 0;
                const nextElementPosition = nextElement.getBoundingClientRect().top + window.pageYOffset;
                const scrollTarget = nextElementPosition - headerHeight - 200; // px padding from header

                window.scrollTo({
                    top: scrollTarget,
                    behavior: 'smooth'
                });
                debugLog('Scrolled to show next element near top');
            }
        }
    }

    // Function to close active article
    function closeActiveArticle(element) {
        if (element) {
            element.classList.remove('active');
            debugLog('Closed article');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    // Handle double-tap to close or jump to end
    document.addEventListener('dblclick', function(event) {
        // Check if the device is a mobile device
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isSmallScreen = window.innerWidth <= 768; // Adjust the screen width threshold as needed
        if (!isMobile || !isSmallScreen) {
            return; // Exit if not on a mobile device or if the screen is too large
        }

        const interactiveElements = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
        if (interactiveElements.includes(event.target.tagName)) {
            debugLog('Ignored double-tap on interactive element');
            return;
        }

        const activeElement = event.target.closest('.flux.active');
        if (activeElement) {
            const screenMidpoint = window.innerHeight / 2; // Vertical midpoint of the screen
            const tapY = event.clientY; // Y-coordinate of the double-tap

            if (tapY < screenMidpoint) {
                // Double-tap on the top half: close the article
                event.preventDefault();
                closeActiveArticle(activeElement);
                debugLog('Double-tap on top half: closed article');
            } else {
                // Double-tap on the bottom half: jump to the end of the article
                event.preventDefault();
                scrollToNextElement(activeElement);
                debugLog('Double-tap on bottom half: jumped to end of article');
            }
        }
    });

    // Touch event handlers for swipe detection
    document.addEventListener('touchstart', function(event) {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;

        // If touch starts from near either edge, prevent default
        if (touchStartX <= EDGE_THRESHOLD ||
            touchStartX >= window.innerWidth - EDGE_THRESHOLD) {
            event.preventDefault();
            debugLog('Touch started near edge');
        }
    }, { passive: false });

    document.addEventListener('touchmove', function(event) {
        const currentX = event.touches[0].clientX;
        const deltaX = currentX - touchStartX;

        // Prevent default during edge swipes
        if ((touchStartX <= EDGE_THRESHOLD && deltaX > 0) ||
            (touchStartX >= window.innerWidth - EDGE_THRESHOLD && deltaX < 0)) {
            event.preventDefault();
            debugLog('Preventing default during edge swipe');
        }
    }, { passive: false });

    document.addEventListener('touchend', function(event) {
        if (!touchStartX) return;

        const touchEndX = event.changedTouches[0].clientX;
        const deltaX = touchEndX - touchStartX;

        const activeElement = document.querySelector('.flux.active');

        if (activeElement) {
            // Left-to-right swipe from left edge
            if (touchStartX <= EDGE_THRESHOLD && deltaX >= SWIPE_THRESHOLD) {
                event.preventDefault();
                scrollToNextElement(activeElement);
                debugLog('Left edge swipe detected');
            }
            // Right-to-left swipe from right edge
            else if (touchStartX >= window.innerWidth - EDGE_THRESHOLD &&
                    deltaX <= -SWIPE_THRESHOLD) {
                event.preventDefault();
                scrollToNextElement(activeElement);
                debugLog('Right edge swipe detected');
            }
        }

        // Reset touch tracking
        touchStartX = 0;
        touchStartY = 0;
    }, { passive: false });

    let lastSpacePressTime = 0;
    const doublePressThreshold = 300; // Time in milliseconds (adjust as needed)
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is ' ' (space) and not in an input field or similar
        if (event.key === ' ' && !isInputField(event.target)) {
            const currentTime = Date.now();

            // Check if the time between two spacebar presses is within the threshold
            if (currentTime - lastSpacePressTime <= doublePressThreshold) {
                event.preventDefault(); // Prevent the default spacebar behavior
                const activeElement = document.querySelector('.flux.active');
                if (activeElement) {
                    scrollToNextElement(activeElement);
                    debugLog('Double spacebar shortcut triggered scroll to next element');
                }
            }

            // Update the last spacebar press time
            lastSpacePressTime = currentTime;
        }
    });

    // Add keyboard shortcut key to scroll to next element with peek
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is 'v' and not in an input field or similar
        if (event.key === 'b' && !isInputField(event.target)) {
            const activeElement = document.querySelector('.flux.active');
            if (activeElement) {
                event.preventDefault();
                scrollToNextElement(activeElement);
                debugLog('Keyboard shortcut "v" triggered scroll to next element');
            }
        }
    });

    // Function to check if the target element is an input field or similar
    function isInputField(element) {
        const inputTypes = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON'];
        return inputTypes.includes(element.tagName) || element.isContentEditable;
    }

    // Mutation observer to catch programmatic changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.target.classList && mutation.target.classList.contains('flux')) {
                if (mutation.target.classList.contains('active')) {
                    debugLog('Article became active via mutation');
                    scrollToElement(mutation.target);
                }
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
    });
})();