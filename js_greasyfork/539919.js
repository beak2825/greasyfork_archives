// ==UserScript==
// @name         Danbooru Click Navigation
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds intuitive click navigation and keyboard shortcuts to Danbooru image pages
// @author       You
// @match        https://danbooru.donmai.us/posts/*
// @match        https://*.danbooru.donmai.us/posts/*
// @grant        none
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539919/Danbooru%20Click%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/539919/Danbooru%20Click%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const CLICK_ZONE_PERCENTAGE = 0.3; // 30% on each side
    
    // State variables
    let navigationEnabled = false;
    let imageElement = null;
    let prevButton = null;
    let nextButton = null;
    
    /**
     * Initialize the script when the page loads
     */
    function init() {
        // Check if we're on a Danbooru post page
        if (!isPostPage()) {
            return;
        }
        
        // Wait for the image to load
        waitForImage();
    }
    
    /**
     * Check if current page is a Danbooru post page
     */
    function isPostPage() {
        return window.location.pathname.match(/^\/posts\/\d+/);
    }
    
    /**
     * Wait for the main image element to be available
     */
    function waitForImage() {
        const checkImage = () => {
            // Try multiple selectors to find the main image
            imageElement = document.querySelector('#image') || 
                          document.querySelector('.image-container img') ||
                          document.querySelector('#post-content img') ||
                          document.querySelector('img[src*="danbooru"]');
            
            if (imageElement) {
                setupNavigation();
            } else {
                // Retry after a short delay
                setTimeout(checkImage, 100);
            }
        };
        
        checkImage();
    }
    
    /**
     * Setup navigation elements and event listeners
     */
    function setupNavigation() {
        findNavigationButtons();
        addClickZones();
        addKeyboardNavigation();
        navigationEnabled = true;
        console.log('Danbooru Click Navigation: Initialized successfully');
    }
    
    /**
     * Find the previous and next navigation buttons
     */
    function findNavigationButtons() {
        // Common selectors for Danbooru navigation
        const selectors = [
            'a[rel="prev"]',
            'a[href*="page=a"]', // Previous page link
            '.paginator a:first-child',
            '#nav-links a:first-child'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.toLowerCase().includes('prev')) {
                prevButton = element;
                break;
            }
        }
        
        const nextSelectors = [
            'a[rel="next"]',
            'a[href*="page=b"]', // Next page link
            '.paginator a:last-child',
            '#nav-links a:last-child'
        ];
        
        for (const selector of nextSelectors) {
            const element = document.querySelector(selector);
            if (element && element.textContent.toLowerCase().includes('next')) {
                nextButton = element;
                break;
            }
        }
        
        // Alternative approach: look for navigation in post navigation area
        const postNav = document.querySelector('#post-nav, .post-navigation, .sequential-navigation');
        if (postNav) {
            const links = postNav.querySelectorAll('a');
            links.forEach(link => {
                const text = link.textContent.toLowerCase();
                const href = link.href;
                
                if (text.includes('prev') || text.includes('←') || href.includes('page=a')) {
                    prevButton = link;
                } else if (text.includes('next') || text.includes('→') || href.includes('page=b')) {
                    nextButton = link;
                }
            });
        }
        
        console.log('Navigation buttons found:', {
            prev: !!prevButton,
            next: !!nextButton
        });
    }
    
    /**
     * Add click zones to the image
     */
    function addClickZones() {
        if (!imageElement) {
            return;
        }
        
        // Create overlay container
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1000;
        `;
        
        // Create left click zone
        const leftZone = document.createElement('div');
        leftZone.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: ${CLICK_ZONE_PERCENTAGE * 100}%;
            height: 100%;
            pointer-events: auto;
            cursor: pointer;
            background: rgba(0, 0, 0, 0);
            transition: background 0.2s;
        `;
        
        // Create right click zone
        const rightZone = document.createElement('div');
        rightZone.style.cssText = `
            position: absolute;
            top: 0;
            right: 0;
            width: ${CLICK_ZONE_PERCENTAGE * 100}%;
            height: 100%;
            pointer-events: auto;
            cursor: pointer;
            background: rgba(0, 0, 0, 0);
            transition: background 0.2s;
        `;
        
        // Add hover effects
        leftZone.addEventListener('mouseenter', () => {
            if (prevButton) {
                leftZone.style.background = 'rgba(0, 0, 0, 0.1)';
            }
        });
        
        leftZone.addEventListener('mouseleave', () => {
            leftZone.style.background = 'rgba(0, 0, 0, 0)';
        });
        
        rightZone.addEventListener('mouseenter', () => {
            if (nextButton) {
                rightZone.style.background = 'rgba(0, 0, 0, 0.1)';
            }
        });
        
        rightZone.addEventListener('mouseleave', () => {
            rightZone.style.background = 'rgba(0, 0, 0, 0)';
        });
        
        // Add click handlers
        leftZone.addEventListener('click', handlePreviousNavigation);
        rightZone.addEventListener('click', handleNextNavigation);
        
        // Append zones to overlay
        overlay.appendChild(leftZone);
        overlay.appendChild(rightZone);
        
        // Make image container relative positioned
        const imageContainer = imageElement.parentElement;
        if (imageContainer) {
            const computedStyle = window.getComputedStyle(imageContainer);
            if (computedStyle.position === 'static') {
                imageContainer.style.position = 'relative';
            }
            imageContainer.appendChild(overlay);
        }
    }
    
    /**
     * Add keyboard navigation
     */
    function addKeyboardNavigation() {
        document.addEventListener('keydown', handleKeydown);
    }
    
    /**
     * Handle keydown events for arrow keys
     */
    function handleKeydown(event) {
        if (!navigationEnabled) {
            return;
        }
        
        // Ignore if user is typing in an input field
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true'
        )) {
            return;
        }
        
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                handlePreviousNavigation();
                break;
            case 'ArrowRight':
                event.preventDefault();
                handleNextNavigation();
                break;
        }
    }
    
    /**
     * Handle navigation to previous image
     */
    function handlePreviousNavigation() {
        if (prevButton && prevButton.href) {
            console.log('Navigating to previous image');
            window.location.href = prevButton.href;
        } else {
            console.log('No previous image available');
        }
    }
    
    /**
     * Handle navigation to next image
     */
    function handleNextNavigation() {
        if (nextButton && nextButton.href) {
            console.log('Navigating to next image');
            window.location.href = nextButton.href;
        } else {
            console.log('No next image available');
        }
    }
    
    /**
     * Cleanup function for navigation
     */
    function cleanup() {
        document.removeEventListener('keydown', handleKeydown);
        navigationEnabled = false;
    }
    
    // Handle page unload
    window.addEventListener('beforeunload', cleanup);
    
    // Initialize the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();