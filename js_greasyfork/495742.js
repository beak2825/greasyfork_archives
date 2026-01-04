// ==UserScript==
// @name         YouTube Music Smooth (Lazy Loader)
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Lazy loader for Youtube Music, making it work smoothly. No lag :D
// @author       Emree.el on Instagram :)
// @match        https://music.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495742/YouTube%20Music%20Smooth%20%28Lazy%20Loader%29.user.js
// @updateURL https://update.greasyfork.org/scripts/495742/YouTube%20Music%20Smooth%20%28Lazy%20Loader%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create YouTube Music item
    function createMusicItem(videoId) {
        return `<div class="placeholder" data-video-id="${videoId}"></div>`;
    }

    // Function to load YouTube Music items
    function loadMusicItems() {
        // Simulated list of YouTube video IDs
        const videoIds = [
            'VIDEO_ID_1',
            'VIDEO_ID_2',
            'VIDEO_ID_3',
            // Add more video IDs as needed
        ];

        // Create and append placeholder elements
        videoIds.forEach(videoId => {
            const item = createMusicItem(videoId);
            document.getElementById('contents').innerHTML += item;
        });

        // Create an intersection observer
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Load YouTube video when the placeholder is in view
                    const videoId = entry.target.getAttribute('data-video-id');
                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.width = '560'; // Set iframe width
                    iframe.height = '315'; // Set iframe height
                    iframe.allowFullscreen = true; // Enable fullscreen
                    entry.target.appendChild(iframe);
                    // Stop observing once loaded
                    observer.unobserve(entry.target);
                }
            });
        });

        // Observe each placeholder element
        const placeholders = document.querySelectorAll('.placeholder');
        placeholders.forEach(placeholder => {
            observer.observe(placeholder);
        });
    }

    // Call the function to initially load music items
    loadMusicItems();
})();
