// ==UserScript==
// @name         YouTube Ad Speedup
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Speed up YouTube ads to play in 1 second, and ensure normal speed after ads, with a toggle button that hides in fullscreen.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/508760/YouTube%20Ad%20Speedup.user.js
// @updateURL https://update.greasyfork.org/scripts/508760/YouTube%20Ad%20Speedup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let adSpeedUpEnabled = true;
    let isAdPlaying = false;

    // Function to speed up video ads and reset speed after ad ends
    function speedUpAds() {
        if (!adSpeedUpEnabled) return;

        // Check if the video is currently showing an ad
        const player = document.querySelector('.ad-showing video');

        if (player && !isAdPlaying) {
            // Ad is playing, so speed it up
            player.playbackRate = 16; // Set ad speed to 16x
            isAdPlaying = true;
        } else if (!player && isAdPlaying) {
            // Ad has finished, so reset the playback rate to normal
            resetVideoSpeed();
            isAdPlaying = false;
        }
    }

    // Reset video playback rate to normal after ad finishes
    function resetVideoSpeed() {
        const mainVideo = document.querySelector('video');
        if (mainVideo) {
            mainVideo.playbackRate = 1; // Reset to normal speed
        }
    }

    // Toggle ad speedup
    function toggleAdSpeedup() {
        adSpeedUpEnabled = !adSpeedUpEnabled;
        if (adSpeedUpEnabled) {
            toggleButton.innerText = 'Disable Ad Speedup';
            observer.observe(document, observerConfig); // Start observing for ads
        } else {
            toggleButton.innerText = 'Enable Ad Speedup';
            observer.disconnect(); // Stop observing when ad speedup is off
            resetVideoSpeed(); // Ensure the main video isn't sped up when ad speedup is disabled
        }
    }

    // Create a toggle button
    const toggleButton = document.createElement('button');
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.style.padding = '10px';
    toggleButton.style.backgroundColor = '#f00';
    toggleButton.style.color = '#fff';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.innerText = 'Disable Ad Speedup';
    toggleButton.addEventListener('click', toggleAdSpeedup);
    document.body.appendChild(toggleButton);

    // Hide the toggle button when in fullscreen mode
    function handleFullscreenChange() {
        if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
            // User is in fullscreen mode, hide the button
            toggleButton.style.display = 'none';
        } else {
            // User is not in fullscreen mode, show the button
            toggleButton.style.display = 'block';
        }
    }

    // Add event listeners for fullscreen changes
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    // MutationObserver to detect and apply speedup to new ads
    const observerConfig = { childList: true, subtree: true };
    const observer = new MutationObserver(() => {
        if (adSpeedUpEnabled) {
            speedUpAds();
        }
    });

    // Observe changes in the DOM to speed up dynamic ads
    observer.observe(document, observerConfig);

    // Run the ad speedup function initially
    speedUpAds();
})();
