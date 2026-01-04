// ==UserScript==
// @name         Youtube Volume Scroll with Volume Percentage Only
// @namespace    https://example.com/
// @version      1.9
// @description  Control volume on YouTube, synchronize the volume slider, and display only the volume percentage inside the video player.
// @author       Shadynasty
// @match        https://www.youtube.com/*
// @match        https://music.youtube.com/*
// @match        https://www.youtube-nocookie.com/embed/*
// @grant        none
 // @license MIT
// @downloadURL https://update.greasyfork.org/scripts/520943/Youtube%20Volume%20Scroll%20with%20Volume%20Percentage%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/520943/Youtube%20Volume%20Scroll%20with%20Volume%20Percentage%20Only.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Block "Are you still there?" popup
    setInterval(() => (window._lact = Date.now()), 9e5);

    let observer, volumeDisplay;

    // Function to initialize everything
    function initialize() {
        console.log('Initializing script...');

        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            const video = document.querySelector('video');
            if (video && !video.dataset.volumeScroll) {
                video.dataset.volumeScroll = "true"; // Mark video as handled
                attachVolumeControl(video);
                createVolumeDisplay(video);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        const video = document.querySelector('video');
        if (video && !video.dataset.volumeScroll) {
            video.dataset.volumeScroll = "true";
            attachVolumeControl(video);
            createVolumeDisplay(video);
        }
    }

    // Create the volume display element inside the video
    function createVolumeDisplay(video) {
        if (volumeDisplay) return; // Avoid duplicating the display

        volumeDisplay = document.createElement('div');
        volumeDisplay.style.position = 'absolute';
        volumeDisplay.style.top = '10px';
        volumeDisplay.style.left = '50%';
        volumeDisplay.style.transform = 'translateX(-50%)';
        volumeDisplay.style.background = 'rgba(0, 0, 0, 0.7)';
        volumeDisplay.style.color = 'white';
        volumeDisplay.style.padding = '10px 20px';
        volumeDisplay.style.borderRadius = '5px';
        volumeDisplay.style.fontSize = '20px';
        volumeDisplay.style.fontFamily = 'Arial, sans-serif';
        volumeDisplay.style.zIndex = '9999';
        volumeDisplay.style.display = 'none';

        video.parentElement.style.position = 'relative'; // Ensure parent has position for absolute positioning
        video.parentElement.appendChild(volumeDisplay);
    }

    function showVolumeDisplay(volume) {
        if (!volumeDisplay) return;

        volumeDisplay.textContent = `${volume}%`;
        volumeDisplay.style.display = 'block';

        clearTimeout(volumeDisplay._hideTimeout);
        volumeDisplay._hideTimeout = setTimeout(() => {
            volumeDisplay.style.display = 'none';
        }, 1000);
    }

    function attachVolumeControl(video) {
        video.addEventListener(
            'wheel',
            (event) => {
                if (event.ctrlKey || event.altKey) return;

                event.preventDefault();

                const player = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
                if (!player) return;

                let currentVolume = player.getVolume ? player.getVolume() : 100;

                const newVolume = Math.min(
                    100,
                    Math.max(0, currentVolume + (event.deltaY < 0 ? 5 : -5))
                );

                if (player.setVolume) {
                    player.setVolume(newVolume);
                }

                showVolumeDisplay(newVolume);

                console.log(`Volume set to: ${newVolume}%`);
            },
            { passive: false }
        );
        console.log('Volume scroll enabled for video element.');
    }

    // Reinitialize script on visibility change
    window.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('Tab reactivated, reinitializing script...');
            initialize();
        }
    });

    // Initialize on script load
    initialize();

    console.log('Youtube Volume Scroll with Volume Percentage Only script loaded!');
})();
