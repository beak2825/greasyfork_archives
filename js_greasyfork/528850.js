// ==UserScript==
// @name         Auto-Rotate Video Fullscreen
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically rotate device to landscape when a fullscreen video is in landscape orientation only
// @match        *://*/*
// @grant        window.orientation
// @grant        window.screen
// @run-at       document-start
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/528850/Auto-Rotate%20Video%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/528850/Auto-Rotate%20Video%20Fullscreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if an element is in full screen
    function isFullScreen(element) {
        return (
            document.fullscreenElement === element ||
            document.webkitFullscreenElement === element ||
            document.mozFullScreenElement === element ||
            document.msFullscreenElement === element ||
            element.webkitDisplayingFullscreen ||
            element.fullscreen
        );
    }

    // Attempt screen rotation
    function rotateScreen(landscape) {
        try {
            // Method 1: Screen Orientation API
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.lock(landscape ? 'landscape-primary' : 'portrait-primary')
                    .catch(() => {});
            }

            // Method 2: Explicit window.orientation manipulation
            if (window.orientation !== undefined) {
                window.orientation = landscape ? 90 : 0;
            }
        } catch (error) {
            // Silently handle rotation errors
        }
    }

    // Fullscreen change handler with landscape video check
    function handleFullscreenChange(event) {
        // Get the current fullscreen element (if any)
        let fullscreenElement = document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;

        if (fullscreenElement) {
            // We're entering fullscreen. Try to get a video element.
            let videoElement = null;
            if (fullscreenElement.tagName.toLowerCase() === 'video') {
                videoElement = fullscreenElement;
            } else {
                videoElement = fullscreenElement.querySelector('video');
            }

            // Only rotate if a video element exists and it's landscape (width > height)
            if (videoElement && videoElement.videoWidth > videoElement.videoHeight) {
                // Store that we rotated because of a landscape video
                window.__isLandscapeVideoFullscreen = true;
                rotateScreen(true);
            } else {
                // Do nothing for portrait videos or if no video found
                window.__isLandscapeVideoFullscreen = false;
            }
        } else {
            // Exiting fullscreen: if we had rotated for a landscape video, revert to portrait.
            if (window.__isLandscapeVideoFullscreen) {
                rotateScreen(false);
                window.__isLandscapeVideoFullscreen = false;
            }
        }
    }

    // Add fullscreen listeners to an element
    function addFullscreenListeners(element) {
        element.addEventListener('fullscreenchange', handleFullscreenChange);
        element.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        element.addEventListener('mozfullscreenchange', handleFullscreenChange);
        element.addEventListener('MSFullscreenChange', handleFullscreenChange);
    }

    // Initial setup function
    function init() {
        // Add global fullscreen listeners
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        // Find and add listeners to existing video and iframe elements
        const videoElements = document.querySelectorAll('video, iframe');
        videoElements.forEach(video => {
            addFullscreenListeners(video);
        });

        // Observe for dynamically added video elements
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const videos = node.querySelectorAll('video, iframe');
                            if (videos.length > 0) {
                                videos.forEach(video => {
                                    addFullscreenListeners(video);
                                });
                            }
                        }
                    });
                }
            });
        });

        // Start observing the entire document
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // Run initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
