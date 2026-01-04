// ==UserScript==
// @name         90 Second Skip Button with Auto-hide
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a 90 second skip button to video players that hides when inactive
// @author       You
// @match        *://*/*
// @exclude      https://www.twitch.tv/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528480/90%20Second%20Skip%20Button%20with%20Auto-hide.user.js
// @updateURL https://update.greasyfork.org/scripts/528480/90%20Second%20Skip%20Button%20with%20Auto-hide.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let timeout;

    function showControls(buttonContainer) {
        buttonContainer.style.opacity = '1';
    }

    function hideControls(buttonContainer) {
        buttonContainer.style.opacity = '0';
    }

    // Function to create and add the skip button
    function addSkipButton(video) {
        // Create button container
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            position: absolute;
            z-index: 9999;
            padding: 5px;
            background: rgba(0, 0, 0, 0.7);
            border-radius: 5px;
            bottom: 70px;
            right: 20px;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        // Create the skip button
        const skipButton = document.createElement('button');
        skipButton.innerHTML = 'Skip 80s';
        skipButton.style.cssText = `
            background: #040720;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        `;

        // Add click event
        skipButton.addEventListener('click', () => {
            video.currentTime += 80;
        });

        // Add button to container
        buttonContainer.appendChild(skipButton);

        // Add container next to video
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(buttonContainer);

        // Add mousemove event listener to video container
        video.parentElement.addEventListener('mousemove', () => {
            showControls(buttonContainer);
            clearTimeout(timeout);
            timeout = setTimeout(() => hideControls(buttonContainer), 2000); // Hide after 2 seconds of inactivity
        });

        // Show controls initially when mouse enters video area
        video.parentElement.addEventListener('mouseenter', () => {
            showControls(buttonContainer);
            clearTimeout(timeout);
            timeout = setTimeout(() => hideControls(buttonContainer), 2000);
        });

        // Hide controls when mouse leaves video area
        video.parentElement.addEventListener('mouseleave', () => {
            hideControls(buttonContainer);
            clearTimeout(timeout);
        });
    }

    // Function to find and process video elements
    function findAndProcessVideos() {
        const videos = document.getElementsByTagName('video');
        for (let video of videos) {
            if (!video.dataset.skipButtonAdded) {
                addSkipButton(video);
                video.dataset.skipButtonAdded = 'true';
            }
        }
    }

    // Initial check for videos
    findAndProcessVideos();

    // Watch for new video elements being added
    const observer = new MutationObserver(findAndProcessVideos);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();