// ==UserScript==
// @name         Simple Youtube Ad-blocker (Working)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Speed up YouTube ads to play in 1 second, and ensure normal speed after ads, with a toggle button, targeting ads only.
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508046/Simple%20Youtube%20Ad-blocker%20%28Working%29.user.js
// @updateURL https://update.greasyfork.org/scripts/508046/Simple%20Youtube%20Ad-blocker%20%28Working%29.meta.js
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
