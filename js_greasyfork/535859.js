// ==UserScript==
// @name        Civitai Larger Thumbnails + Arrow Key Navigation
// @namespace   Violentmonkey Scripts
// @match       *://*.civitai.com/*
// @grant       GM_addStyle
// @version     1.21
// @author      rainlizard
// @license     MIT
// @description Enlarges thumbnails to take up the whole screen and adds Up/Down arrow key navigation to instantly go to the next thumbnail. No more tired eyes from constantly moving your eyes from thumbnail to thumbnail.
// @downloadURL https://update.greasyfork.org/scripts/535859/Civitai%20Larger%20Thumbnails%20%2B%20Arrow%20Key%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/535859/Civitai%20Larger%20Thumbnails%20%2B%20Arrow%20Key%20Navigation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let currentIndex = 0;
    let thumbnails = [];
    let isInitialized = false;

    // Function to wait for elements to appear
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Function to calculate optimal thumbnail height
    function calculateThumbnailHeight() {
        const viewportHeight = window.innerHeight;

        // Check for header height
        const headerSelectors = [
            'header',
            '[role="banner"]',
            '.header',
            '.navbar',
            'nav:first-of-type'
        ];

        let headerHeight = 0;
        for (const selector of headerSelectors) {
            const header = document.querySelector(selector);
            if (header) {
                const rect = header.getBoundingClientRect();
                if (rect.top >= -10 && rect.height > 0) {
                    headerHeight = Math.max(headerHeight, rect.height);
                }
            }
        }

        // Use full viewport height minus header
        return viewportHeight - headerHeight;
    }

    // Function to find all thumbnail cards directly
    function findThumbnails() {
        // Look for thumbnails by their specific structure
        const thumbnailElements = document.querySelectorAll('.AspectRatioImageCard_content__IGj_A');

        // Get the parent containers (the actual thumbnail divs)
        const thumbnailContainers = Array.from(thumbnailElements).map(content => {
            // The parent should be the thumbnail container
            let parent = content.parentElement;
            // Look for the container with the aspect-ratio style or class structure
            while (parent && !parent.style.aspectRatio && !parent.classList.contains('relative')) {
                parent = parent.parentElement;
            }
            return parent;
        }).filter(Boolean);

        console.log(`Found ${thumbnailContainers.length} thumbnail containers`);
        return thumbnailContainers;
    }

    // Update thumbnail list
    function updateThumbnailList() {
        thumbnails = findThumbnails();
        if (currentIndex >= thumbnails.length && thumbnails.length > 0) {
            currentIndex = thumbnails.length - 1;
        } else if (thumbnails.length === 0) {
            currentIndex = 0;
        }
    }

    // Function to update all thumbnail heights
    function updateThumbnailHeights() {
        const newHeight = calculateThumbnailHeight();
        const heightValue = `${newHeight}px`;

        // Update CSS custom property
        document.documentElement.style.setProperty('--civitai-thumbnail-height', heightValue);

        // Update existing thumbnails
        thumbnails.forEach(thumbnail => {
            if (thumbnail.classList.contains('civitai-large-thumbnail')) {
                thumbnail.style.height = heightValue;
                thumbnail.style.minHeight = heightValue;
            }
        });
    }

    // Apply CSS for large thumbnails
    GM_addStyle(`
        html, body {
            scroll-behavior: smooth !important;
        }

        body {
            overflow-x: hidden !important;
        }

        /* Container for thumbnails */
        .civitai-thumbnail-container {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
            gap: 0px !important;
        }

        /* Large thumbnail styling */
        .civitai-large-thumbnail {
            width: 100vw !important;
            max-width: 100% !important;
            height: var(--civitai-thumbnail-height, 100vh) !important;
            min-height: var(--civitai-thumbnail-height, 100vh) !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
            padding: 20px !important;
            box-sizing: border-box !important;
            background-color: #1A1B1E !important;
            position: relative !important;
            margin: 0 !important;
            aspect-ratio: auto !important;
            border-radius: 0 !important;
        }

        /* Style the content area */
        .civitai-large-thumbnail .AspectRatioImageCard_content__IGj_A {
            width: 100% !important;
            height: 100% !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: center !important;
            align-items: center !important;
        }

        /* Style the link */
        .civitai-large-thumbnail .AspectRatioImageCard_linkOrClick__d_K_4 {
            width: 90% !important;
            height: 80% !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        /* Style images within large thumbnails */
        .civitai-large-thumbnail .AspectRatioImageCard_image__1xNTQ {
            max-width: 100vw !important;
            max-height: 100vh !important;
            width: auto !important;
            height: auto !important;
            object-fit: contain !important;
            border-radius: 8px !important;
        }

        /* Style the footer with no background */
        .civitai-large-thumbnail .AspectRatioImageCard_footer__FOU7a {
            position: absolute !important;
            bottom: 20px !important;
            left: 20px !important;
            right: 20px !important;
            background: rgba(0, 0, 0, 0) !important;
            padding: 20px !important;
            border-radius: 10px !important;
            color: white !important;
        }

        /* Style the header with no background */
        .civitai-large-thumbnail .AspectRatioImageCard_header__Mmd__ {
            position: absolute !important;
            top: 20px !important;
            right: 20px !important;
            background: rgba(0, 0, 0, 0) !important;
            padding: 10px !important;
            border-radius: 10px !important;
        }

        /* Navigation indicator */
        .civitai-nav-indicator {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: rgba(0, 0, 0, 0.8) !important;
            color: white !important;
            padding: 10px 15px !important;
            border-radius: 5px !important;
            font-size: 14px !important;
            z-index: 1000 !important;
            font-family: Arial, sans-serif !important;
            opacity: 0.8 !important;
        }
    `);

    // Scroll to specific thumbnail
    function scrollToThumbnail(index) {
        updateThumbnailList();
        if (index >= 0 && index < thumbnails.length) {
            currentIndex = index;
            const targetThumbnail = thumbnails[currentIndex];
            if (targetThumbnail) {
                targetThumbnail.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });

                // Update navigation indicator
                const indicator = document.querySelector('.civitai-nav-indicator');
                if (indicator) {
                    indicator.textContent = `${currentIndex + 1} / ${thumbnails.length} - ↑↓ Navigate`;
                }
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        updateThumbnailList();
        if (thumbnails.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (currentIndex < thumbnails.length - 1) {
                scrollToThumbnail(currentIndex + 1);
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (currentIndex > 0) {
                scrollToThumbnail(currentIndex - 1);
            }
        }
    });

    // Apply large thumbnail styling to all thumbnails
    function applyLargeThumbnailStyling() {
        updateThumbnailList();

        if (thumbnails.length === 0) return;

        // Find the parent container and modify its layout
        const firstThumbnail = thumbnails[0];
        const parentContainer = firstThumbnail.parentElement;

        if (parentContainer) {
            parentContainer.classList.add('civitai-thumbnail-container');
        }

        // Apply styling to each thumbnail
        thumbnails.forEach(thumbnail => {
            thumbnail.classList.add('civitai-large-thumbnail');
        });

        // Update heights
        updateThumbnailHeights();

        console.log(`Applied large styling to ${thumbnails.length} thumbnails`);
    }

    // Function to periodically check for new content
    function checkForUpdates() {
        const newThumbnails = findThumbnails();
        if (newThumbnails.length !== thumbnails.length) {
            console.log(`Updated: Now have ${newThumbnails.length} thumbnails`);

            // Apply styling to new thumbnails
            newThumbnails.forEach(thumbnail => {
                if (!thumbnail.classList.contains('civitai-large-thumbnail')) {
                    thumbnail.classList.add('civitai-large-thumbnail');
                }
            });

            thumbnails = newThumbnails;
            updateThumbnailHeights();
        }
    }

    // Function to observe viewport changes
    function observeViewportChanges() {
        // Listen for window resize
        window.addEventListener('resize', () => {
            updateThumbnailHeights();
        });

        // Listen for scroll to detect header changes
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                updateThumbnailHeights();
            }, 100);
        });
    }

    // Initialize the script
    function init() {
        console.log('Civitai Larger Thumbnails script loaded');

        // Calculate initial height
        const initialHeight = calculateThumbnailHeight();
        document.documentElement.style.setProperty('--civitai-thumbnail-height', `${initialHeight}px`);

        // Wait for the main content area to load
        waitForElement('#main')
            .then(() => {
                setTimeout(() => {
                    applyLargeThumbnailStyling();

                    if (thumbnails.length > 0) {
                        console.log(`Applied large styling to ${thumbnails.length} thumbnails`);

                        // Add navigation indicator
                        const indicator = document.createElement('div');
                        indicator.className = 'civitai-nav-indicator';
                        indicator.textContent = `1 / ${thumbnails.length} - ↑↓ Navigate`;
                        document.body.appendChild(indicator);

                        // Set up viewport observation
                        observeViewportChanges();

                        isInitialized = true;
                    }

                    // Set up periodic checks for new content
                    setInterval(checkForUpdates, 2000);
                }, 2000);
            })
            .catch(error => {
                console.error('Civitai script: Failed to find main content area', error);
            });
    }

    // Start initialization after a delay to ensure page is ready
    setTimeout(init, 1000);

})();