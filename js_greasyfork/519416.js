// ==UserScript==
// @name         YouTube Speed Control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds speed control buttons to YouTube videos
// @author       Barthazar
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519416/YouTube%20Speed%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/519416/YouTube%20Speed%20Control.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function createSpeedControls() {
        // Check if controls already exist
        if (document.getElementById('custom-speed-controls')) return;

        // Create container
        const container = document.createElement('div');
        container.id = 'custom-speed-controls';
        container.style.cssText = `
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 08px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            border-radius: 4px;
            position: absolute;
            top: 20px;
            right: 20px;
            z-index: 1000;
            font-family: Arial, sans-serif;
            opacity: 0.3;
            transition: opacity 0.2s;
        `;

        // Add hover effect
        container.addEventListener('mouseenter', () => {
            container.style.opacity = '1';
        });
        container.addEventListener('mouseleave', () => {
            container.style.opacity = '0.3';
        });

        // Create decrease button
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '<';
        decreaseBtn.style.cssText = `
            padding: 2px 5px;
            cursor: pointer;
            background: transparent;
            border: 1px solid white;
            color: white;
            border-radius: 3px;
        `;

        // Create speed display
        const speedDisplay = document.createElement('span');
        speedDisplay.style.cssText = 'min-width: 35px; text-align: center;';

        // Create increase button
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '>';
        increaseBtn.style.cssText = `
            padding: 02px 5px;
            cursor: pointer;
            background: transparent;
            border: 1px solid white;
            color: white;
            border-radius: 3px;
        `;

        // Function to update speed display
        function updateSpeedDisplay() {
            const video = document.getElementsByClassName('html5-main-video')[0];
            if (video) {
                speedDisplay.textContent = `${video.playbackRate}x`;
            }
        }

        // Initial speed display update
        updateSpeedDisplay();

        // Add click handlers
        decreaseBtn.addEventListener('click', () => {
            const video = document.getElementsByClassName('html5-main-video')[0];
            if (video) {
                video.playbackRate = Math.max(0.25, video.playbackRate - 0.25);
                updateSpeedDisplay();
            }
        });

        increaseBtn.addEventListener('click', () => {
            const video = document.getElementsByClassName('html5-main-video')[0];
            if (video) {
                video.playbackRate = Math.min(4, video.playbackRate + 0.25);
                updateSpeedDisplay();
            }
        });

        // Add rate change listener to update display when speed changes through other means
        const video = document.getElementsByClassName('html5-main-video')[0];
        if (video) {
            video.addEventListener('ratechange', updateSpeedDisplay);
        }

        // Assemble controls
        container.appendChild(decreaseBtn);
        container.appendChild(speedDisplay);
        container.appendChild(increaseBtn);

        // Insert controls over video
        const videoContainer = document.getElementsByClassName('html5-video-player')[0];
        if (videoContainer) {
            videoContainer.appendChild(container);
        }
    }

    // Create controls when page loads
    window.addEventListener('load', createSpeedControls);

    // Create controls when navigating between videos (for single-page app behavior)
    const observer = new MutationObserver(() => {
        setTimeout(createSpeedControls, 1000);
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();