// ==UserScript==
// @name         [INSTAGRAM] WORKING PROGRESS BAR
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a progress bar to all videos (Reels included) on Instagram and lets you skip thru the video
// @author       Emree.el on instagram
// @match        *://*.instagram.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521062/%5BINSTAGRAM%5D%20WORKING%20PROGRESS%20BAR.user.js
// @updateURL https://update.greasyfork.org/scripts/521062/%5BINSTAGRAM%5D%20WORKING%20PROGRESS%20BAR.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create a progress bar for video
    function createProgressBar(video) {
        // Check if progress bar already exists
        if (video.parentElement.querySelector('.custom-progress-bar')) return;

        // Create progress bar container
        const progressBar = document.createElement('div');
        progressBar.style.position = 'absolute';
        progressBar.style.bottom = '5px';
        progressBar.style.left = '0';
        progressBar.style.width = '100%';
        progressBar.style.height = '5px';
        progressBar.style.background = 'rgba(0, 0, 0, 0.5)';
        progressBar.style.cursor = 'pointer';
        progressBar.style.zIndex = '9999';
        progressBar.classList.add('custom-progress-bar');

        // Create progress indicator
        const progressIndicator = document.createElement('div');
        progressIndicator.style.height = '100%';
        progressIndicator.style.width = '0%';
        progressIndicator.style.background = '#ff0000';
        progressBar.appendChild(progressIndicator);

        // Add progress bar to the video container
        video.parentElement.style.position = 'relative';
        video.parentElement.appendChild(progressBar);

        // Update progress bar on video time update
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressIndicator.style.width = `${progress}%`;
        });

        // Allow seeking by clicking on the progress bar
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const clickPosition = (e.clientX - rect.left) / rect.width;
            video.currentTime = video.duration * clickPosition;
        });
    }

    // Observe DOM changes to add progress bars dynamically
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach((node) => {
                    if (node.tagName === 'VIDEO' && node.src) {
                        createProgressBar(node);
                    } else if (node.querySelectorAll) {
                        const videos = node.querySelectorAll('video');
                        videos.forEach(createProgressBar);
                    }
                });
            }
        });
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Add progress bars to already loaded videos
    document.querySelectorAll('video').forEach(createProgressBar);
})();