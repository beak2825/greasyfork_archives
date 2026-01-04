// ==UserScript==
// @name         Controls for Skroutz Short Videos
// @namespace    http://tampermonkey.net/
// @version      1.3
// @author       sfortis
// @description  Enable native video controls for Skroutz short videos
// @match        https://www.skroutz.gr/short_videos/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505546/Controls%20for%20Skroutz%20Short%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/505546/Controls%20for%20Skroutz%20Short%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function enableNativeControlsAndFixAlignment() {
        const videoContainers = document.querySelectorAll('.video-js');

        videoContainers.forEach(container => {
            if (container.dataset.controlsEnabled) return; // Skip if already processed

            const video = container.querySelector('video');
            if (video) {
                // Enable native controls
                video.controls = true;

                // Create a wrapper for the video
                const videoWrapper = document.createElement('div');
                videoWrapper.style.cssText = `
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    position: relative;
                `;

                // Set video styles
                video.style.cssText = `
                    width: auto;
                    height: 100%;
                    max-width: none;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                `;

                // Wrap the video
                video.parentNode.insertBefore(videoWrapper, video);
                videoWrapper.appendChild(video);

                // Adjust container styles
                container.style.cssText = `
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                `;

                // Remove any overlays that might interfere
                const overlays = container.querySelectorAll('.short-video-overlay, .js-short-video-overlay');
                overlays.forEach(overlay => {
                    overlay.style.pointerEvents = 'none';
                    overlay.style.background = 'transparent';
                });

                // Mark this container as processed
                container.dataset.controlsEnabled = 'true';

                // Remove any custom control bars if they exist
                const customControls = container.querySelector('.custom-video-controls');
                if (customControls) {
                    customControls.remove();
                }

                // Ensure the video is not hidden
                video.style.opacity = '1';
                video.style.visibility = 'visible';

                // Remove any click event listeners that might interfere
                container.onclick = null;
                video.onclick = null;
            }
        });
    }

    // Run initially
    enableNativeControlsAndFixAlignment();

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                setTimeout(enableNativeControlsAndFixAlignment, 500);
            }
        });
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add a periodic check to ensure controls are enabled and alignment is fixed for all videos
    setInterval(enableNativeControlsAndFixAlignment, 2000);
})();
