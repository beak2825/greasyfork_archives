// ==UserScript==
// @name         YouTube - Auto Expand Subscriptions
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically expands the "Show more" button in YouTube's subscription sidebar, keeping your subscriptions list fully expanded.
// @author       sharmanhall
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @copyright    2024, sharmanhall
// @supportURL   https://github.com/sharmanhall/youtube-auto-expand/issues
// @homepageURL  https://github.com/sharmanhall/youtube-auto-expand
// @downloadURL https://update.greasyfork.org/scripts/516926/YouTube%20-%20Auto%20Expand%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/516926/YouTube%20-%20Auto%20Expand%20Subscriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG = true;
    function log(...args) {
        if (DEBUG) console.log('[YT-Auto-Expand]', ...args);
    }

    function findShowMoreButton() {
        log('Starting button search...');
        // Try various selectors
        const buttonSelectors = [
            'ytd-guide-collapsible-entry-renderer ytd-guide-entry-renderer#expander-item',
            '#items ytd-guide-collapsible-entry-renderer #expander-item',
            '#items ytd-guide-section-renderer ytd-guide-collapsible-entry-renderer'
        ];

        for (const selector of buttonSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                const endpoint = element.querySelector('a#endpoint');
                if (endpoint) {
                    const paperItem = endpoint.querySelector('tp-yt-paper-item');
                    if (paperItem && element.textContent.trim().includes('Show more')) {
                        log('Found Show more button');
                        return endpoint;
                    }
                }
            }
        }
        return null;
    }

    function expandSubscriptions() {
        const button = findShowMoreButton();
        if (button) {
            log('Clicking button...');
            button.click();
            return true;
        }
        return false;
    }

    // Function to handle retries with delay
    function attemptExpansionWithRetry(retriesLeft = 10) {
        if (retriesLeft <= 0) {
            log('Max retries reached');
            return;
        }

        if (!expandSubscriptions()) {
            setTimeout(() => {
                attemptExpansionWithRetry(retriesLeft - 1);
            }, 1000);
        }
    }

    // Wait specifically for the guide section to be ready
    function waitForGuide() {
        log('Setting up guide observer');
        
        // First try to find the guide container
        const guideContainer = document.querySelector('tp-yt-app-drawer');
        if (!guideContainer) {
            // If no container yet, watch for it
            const bodyObserver = new MutationObserver((mutations, obs) => {
                const container = document.querySelector('tp-yt-app-drawer');
                if (container) {
                    obs.disconnect();
                    observeGuide(container);
                }
            });
            
            bodyObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            observeGuide(guideContainer);
        }
    }

    function observeGuide(container) {
        log('Guide container found, watching for changes');
        
        // Only watch the guide container for changes
        const observer = new MutationObserver((mutations) => {
            // Only proceed if we see the section renderer
            if (document.querySelector('ytd-guide-section-renderer')) {
                // Check if button exists and isn't already clicked
                const button = findShowMoreButton();
                if (button && button.textContent.includes('Show more')) {
                    attemptExpansionWithRetry();
                }
            }
        });

        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: false, // Don't watch for attribute changes
            characterData: false // Don't watch for text changes
        });
        
        // Make initial attempt
        attemptExpansionWithRetry();
    }

    // Start observing as soon as possible
    waitForGuide();
    
    // Also try when the window loads
    window.addEventListener('load', () => {
        log('Window loaded, making attempt...');
        attemptExpansionWithRetry();
    });

})();