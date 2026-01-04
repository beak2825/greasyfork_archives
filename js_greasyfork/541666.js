// ==UserScript==
// @name         Rumble Auto Theater Mode
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically enable theater mode on Rumble videos
// @author       You
// @match        https://rumble.com/v*
// @match        https://www.rumble.com/v*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541666/Rumble%20Auto%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/541666/Rumble%20Auto%20Theater%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let theaterModeEnabled = false;
    let lastToggleTime = 0;
    let isProcessing = false;

    // Function to enable theater mode
    function enableTheaterMode() {
        if (isProcessing) return false;

        const theaterButton = document.querySelector('[data-js="theater-mode-toggle"]') ||
                            document.querySelector('[title*="theater" i]') ||
                            document.querySelector('[aria-label*="theater" i]') ||
                            document.querySelector('button[class*="theater" i]');

        if (theaterButton) {
            // Check if theater mode is already active
            const isActive = theaterButton.classList.contains('active') ||
                           theaterButton.classList.contains('theater-active') ||
                           theaterButton.getAttribute('aria-pressed') === 'true' ||
                           theaterButton.getAttribute('data-theater-active') === 'true' ||
                           document.body.classList.contains('theater-mode') ||
                           document.documentElement.classList.contains('theater-mode');

            if (!isActive && !theaterModeEnabled) {
                const now = Date.now();
                // Prevent rapid toggling by enforcing a minimum delay
                if (now - lastToggleTime > 2000) {
                    console.log('Rumble Auto Theater Mode: Enabling theater mode');
                    isProcessing = true;
                    theaterButton.click();
                    theaterModeEnabled = true;
                    lastToggleTime = now;

                    // Reset processing flag after a short delay
                    setTimeout(() => {
                        isProcessing = false;
                    }, 1000);

                    return true;
                }
            } else if (isActive) {
                theaterModeEnabled = true;
                console.log('Rumble Auto Theater Mode: Theater mode already active');
                return true;
            }
        }
        return false;
    }

    // Function to check if we should activate theater mode
    function shouldActivateTheaterMode() {
        // Don't activate if we've already successfully enabled it
        if (theaterModeEnabled) return false;

        // Don't activate if we recently tried
        if (Date.now() - lastToggleTime < 2000) return false;

        // Check if video is playing (indicating player is fully loaded)
        const video = document.querySelector('video');
        if (video && !video.paused && video.currentTime > 0) {
            return true;
        }

        // Also activate after a reasonable delay even if we can't detect video state
        return Date.now() - pageLoadTime > 5000;
    }

    // Function to wait for elements to load
    function waitForElement(callback, maxAttempts = 10) {
        let attempts = 0;

        const checkForElement = () => {
            attempts++;

            if (callback()) {
                return; // Success
            }

            if (attempts < maxAttempts) {
                setTimeout(checkForElement, 1000); // Wait 1 second between attempts
            } else {
                console.log('Rumble Auto Theater Mode: Could not find theater mode button after maximum attempts');
            }
        };

        checkForElement();
    }

    let pageLoadTime = Date.now();

    // Initialize when page loads
    function init() {
        pageLoadTime = Date.now();
        theaterModeEnabled = false;
        lastToggleTime = 0;

        // Wait for the video player to load, then wait a bit more for it to stabilize
        setTimeout(() => {
            waitForElement(() => {
                if (shouldActivateTheaterMode()) {
                    return enableTheaterMode();
                }
                return false;
            });
        }, 3000);

        // One more attempt after video should be playing
        setTimeout(() => {
            if (!theaterModeEnabled && shouldActivateTheaterMode()) {
                enableTheaterMode();
            }
        }, 8000);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Handle navigation changes (for single-page app behavior)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            if (url.includes('/v')) {
                setTimeout(init, 1000); // Delay for new page to load
            }
        }
    }).observe(document, { subtree: true, childList: true });

})();