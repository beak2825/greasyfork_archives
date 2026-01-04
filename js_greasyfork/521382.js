// ==UserScript==
// @name         Universal Video Sharpener (CSS Filter)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Applies video sharpening using CSS filters across websites
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521382/Universal%20Video%20Sharpener%20%28CSS%20Filter%29.user.js
// @updateURL https://update.greasyfork.org/scripts/521382/Universal%20Video%20Sharpener%20%28CSS%20Filter%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Configuration
    const CONFIG = {
        contrast: 1.1,
        brightness: 1.2,
        saturate: 1.1,
        debugMode: false
    };

    // Logging function
    function log(message) {
        if (CONFIG.debugMode) {
            console.log(`[Video Sharpener] ${message}`);
        }
    }

    // Detect if an element is likely a video
    function isVideoElement(element) {
        return element instanceof HTMLVideoElement &&
               element.videoWidth > 0 &&
               element.videoHeight > 0;
    }

    // Apply CSS sharpness filter
    function applySharpnessFilter(video, isEnabled) {
        if (!video) return;
        try {
            if (isEnabled) {
                const { contrast, brightness, saturate } = CONFIG;
                video.style.filter = `
                    contrast(${contrast})
                    brightness(${brightness})
                    saturate(${saturate})
                `;
                video.dataset.sharpened = 'true';
                log('CSS Sharpness filter applied');
            } else {
                video.style.filter = 'none';
                delete video.dataset.sharpened;
                log('Sharpness filter removed');
            }
        } catch (error) {
            console.error('Error applying sharpness filter:', error);
        }
    }

    // Update all videos on the page
    function updateAllVideos(isEnabled) {
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (isVideoElement(video)) {
                applySharpnessFilter(video, isEnabled);
            }
        });
    }

    // Main processing function
    function processVideos() {
        const isScriptEnabled = GM_getValue('universalSharpenerEnabled', false);
        const videos = document.querySelectorAll('video:not([data-sharpened])');
        videos.forEach(video => {
            if (isVideoElement(video)) {
                applySharpnessFilter(video, isScriptEnabled);
            }
        });
    }

    // Toggle function with notification
    function toggleSharpener() {
        const currentState = GM_getValue('universalSharpenerEnabled', false);
        const newState = !currentState;
        GM_setValue('universalSharpenerEnabled', newState);

        // Update all existing videos
        updateAllVideos(newState);

        // Show notification
        GM_notification({
            text: `Video Sharpener: ${newState ? 'Enabled' : 'Disabled'}`,
            timeout: 2000,
            title: 'Video Sharpener'
        });
    }

    // Initialize script
    function initScript() {
        // Get initial state
        const isEnabled = GM_getValue('universalSharpenerEnabled', false);

        // Register menu command with state indicator
        GM_registerMenuCommand(
            `${isEnabled ? '✓' : '✗'} Toggle Video Sharpener`,
            toggleSharpener
        );

        // Use MutationObserver for dynamic content
        const observer = new MutationObserver(() => {
            processVideos();
        });

        // Observe the entire document for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Initial processing and periodic check
        processVideos();
        setInterval(processVideos, 3000);
    }

    // Start script
    initScript();
})();