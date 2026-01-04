// ==UserScript==
// @name        Hides YouTube Shorts
// version     1.0
// @description Hides YouTube Shorts on the youtube.com homepage
// @author      Aiden Lyons
// @match       https://www.youtube.com/*
// @grant       none
// @run-at      document-start
// @license MIT
// @version 0.0.1.20250619174803
// @namespace https://greasyfork.org/users/1485861
// @downloadURL https://update.greasyfork.org/scripts/540040/Hides%20YouTube%20Shorts.user.js
// @updateURL https://update.greasyfork.org/scripts/540040/Hides%20YouTube%20Shorts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS to hide YouTube Shorts on homepage
    const HIDE_SHORTS_CSS = `
        /* Hide main Shorts shelf on homepage */
        ytd-rich-shelf-renderer[is-shorts],
        ytd-reel-shelf-renderer,
        ytd-shorts-shelf-renderer {
            display: none !important;
            visibility: hidden !important;
        }

        /* Hide individual Shorts videos */
        ytd-reel-video-renderer,
        ytd-video-renderer[is-shorts] {
            display: none !important;
        }

        /* Hide Shorts sections */
        ytd-rich-section-renderer:has(ytd-reel-shelf-renderer),
        ytd-item-section-renderer:has(ytd-reel-shelf-renderer) {
            display: none !important;
        }

        /* Hide Shorts containers */
        div[aria-label*="Shorts"],
        [data-target-id*="shorts"] {
            display: none !important;
        }

        /* Hide Shorts navigation button in sidebar */
        ytd-guide-entry-renderer a[href="/shorts"],
        ytd-mini-guide-entry-renderer a[href="/shorts"] {
            display: none !important;
        }
    `;

    // Function to inject CSS
    function injectCSS() {
        if (document.getElementById('hide-shorts-css')) {
            return; // Already injected
        }

        const style = document.createElement('style');
        style.id = 'hide-shorts-css';
        style.textContent = HIDE_SHORTS_CSS;

        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                document.head.appendChild(style);
            });
        }
    }

    // Function to remove Shorts elements from DOM
    function removeShortsElements() {
        // Only run on homepage
        if (window.location.pathname !== '/') {
            return;
        }

        const shortsSelectors = [
            'ytd-rich-shelf-renderer[is-shorts]',
            'ytd-reel-shelf-renderer',
            'ytd-shorts-shelf-renderer',
            'ytd-reel-video-renderer'
        ];

        let removedCount = 0;
        shortsSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                // Remove the entire section container if it's a shelf
                if (selector.includes('shelf')) {
                    const section = element.closest('ytd-rich-section-renderer, ytd-item-section-renderer');
                    if (section) {
                        section.remove();
                        removedCount++;
                    } else if (element.parentNode) {
                        element.remove();
                        removedCount++;
                    }
                } else if (element.parentNode) {
                    element.remove();
                    removedCount++;
                }
            });
        });

        if (removedCount > 0) {
            console.log(`Hid ${removedCount} YouTube Shorts elements`);
        }
    }

    // Function to check if we're on the homepage
    function isHomepage() {
        return window.location.pathname === '/' ||
               window.location.pathname === '/feed/trending' ||
               window.location.pathname.startsWith('/feed/');
    }

    // Set up mutation observer to handle dynamically loaded content
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            if (!isHomepage()) {
                return;
            }

            let shouldCheck = false;
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node contains Shorts
                        const hasShorts = node.tagName && (
                            node.tagName.toLowerCase().includes('reel') ||
                            node.hasAttribute('is-shorts') ||
                            (node.querySelector && node.querySelector('ytd-reel-shelf-renderer, ytd-reel-video-renderer, [is-shorts]'))
                        );

                        if (hasShorts) {
                            shouldCheck = true;
                        }
                    }
                });
            });

            if (shouldCheck) {
                setTimeout(removeShortsElements, 100);
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            });
        }
    }

    // Main initialization function
    function init() {
        console.log('Hide YouTube Shorts userscript loaded');

        // Inject CSS for immediate hiding
        injectCSS();

        // Remove existing Shorts elements
        if (isHomepage()) {
            removeShortsElements();
        }

        // Set up observer for dynamic content
        setupObserver();

        // Handle navigation in YouTube's single-page app
        let currentUrl = location.href;
        setInterval(() => {
            if (location.href !== currentUrl) {
                currentUrl = location.href;
                if (isHomepage()) {
                    setTimeout(removeShortsElements, 500);
                }
            }
        }, 1000);

        // Periodic cleanup for homepage
        setInterval(() => {
            if (isHomepage()) {
                removeShortsElements();
            }
        }, 3000);
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Immediate execution for early blocking
    setTimeout(init, 50);

})();