// ==UserScript==
// @name         YouTube Auto Turn on Subtitles
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically enables subtitles on YouTube videos if available
// @author       Henry Suen
// @match        https://www.youtube.com/watch*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532385/YouTube%20Auto%20Turn%20on%20Subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/532385/YouTube%20Auto%20Turn%20on%20Subtitles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Main function to enable subtitles if available
    function enableSubtitlesIfAvailable() {
        console.log('YouTube Auto-Subtitles: Checking for subtitles...');

        // Wait for video player to load
        waitForElement('.html5-video-player').then((videoPlayer) => {
            console.log('YouTube Auto-Subtitles: Video player found.');

            // Check if subtitles are available but not enabled
            checkSubtitlesStatus();
        }).catch((error) => {
            console.error('YouTube Auto-Subtitles: Error finding video player:', error);
        });
    }

    // Function to wait for an element to appear in the DOM
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);

            if (element) {
                return resolve(element);
            }

            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // Set timeout to avoid waiting forever
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }

    // Check if subtitles are available and enable them if they're not already on
    function checkSubtitlesStatus() {
        // First, check if there's a subtitle button (indicating subtitles are available)
        waitForElement('.ytp-subtitles-button').then((subtitleButton) => {
            console.log('YouTube Auto-Subtitles: Subtitles button found.');

            // Check if subtitles are already enabled (button is toggled on)
            const isSubtitlesEnabled = subtitleButton.getAttribute('aria-pressed') === 'true';

            if (!isSubtitlesEnabled) {
                console.log('YouTube Auto-Subtitles: Enabling subtitles...');
                subtitleButton.click();
                console.log('YouTube Auto-Subtitles: Subtitles enabled.');
            } else {
                console.log('YouTube Auto-Subtitles: Subtitles are already enabled.');
            }
        }).catch((error) => {
            console.log('YouTube Auto-Subtitles: Subtitles button not found, likely no subtitles available for this video.');
        });
    }

    // Listen for page navigation events (YouTube is a SPA)
    function setupNavigationListener() {
        // Create an observer instance to detect URL changes
        let lastUrl = location.href;
        new MutationObserver(() => {
            const currentUrl = location.href;
            if (currentUrl !== lastUrl) {
                lastUrl = currentUrl;
                if (currentUrl.includes('youtube.com/watch')) {
                    console.log('YouTube Auto-Subtitles: URL changed, checking subtitles...');
                    setTimeout(enableSubtitlesIfAvailable, 1500); // Delay to ensure video player is loaded
                }
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // Initial execution
    setTimeout(enableSubtitlesIfAvailable, 1500); // Initial delay to ensure video player is loaded
    setupNavigationListener();

    console.log('YouTube Auto-Subtitles: Script initialized.');
})();