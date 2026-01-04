// ==UserScript==
// @name         YouTube Ultra Volume Booster with Password
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Boost YouTube video volume beyond the standard limit using the Web Audio API, with password protection.
// @author       Saria Hmz
// @match        *://www.youtube.com/*
// @grant        none
// @license      Private
// @downloadURL https://update.greasyfork.org/scripts/532169/YouTube%20Ultra%20Volume%20Booster%20with%20Password.user.js
// @updateURL https://update.greasyfork.org/scripts/532169/YouTube%20Ultra%20Volume%20Booster%20with%20Password.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let audioContext;
    let gainNode;
    let videoElement;

    function setupAudioBoost() {
        // Check if the video element exists
        videoElement = document.querySelector('video');
        if (!videoElement) return;

        // Create a new AudioContext and connect the video to it
        if (!audioContext) {
            audioContext = new AudioContext();
            const source = audioContext.createMediaElementSource(videoElement);
            gainNode = audioContext.createGain();
            gainNode.gain.value = 1; // Default gain
            source.connect(gainNode).connect(audioContext.destination);
        }

        // Add the volume slider with password protection
        addVolumeSliderWithPassword();
    }

    function addVolumeSliderWithPassword() {
        // Check if the slider already exists
        if (document.querySelector('#ultra-volume-container')) return;

        // Create the container for the slider and password input
        const container = document.createElement('div');
        container.id = 'ultra-volume-container';
        container.style.position = 'absolute';
        container.style.bottom = '50px';
        container.style.right = '10px';
        container.style.zIndex = 10000;
        container.style.padding = '10px';
        container.style.background = 'rgba(0, 0, 0, 0.8)';
        container.style.borderRadius = '8px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.alignItems = 'center';
        container.style.color = 'white';
        container.style.opacity = '0'; // Initially hidden
        container.style.transition = 'opacity 0.3s';

        // Show on hover
        container.addEventListener('mouseenter', () => {
            container.style.opacity = '1';
        });

        // Hide when not hovering
        container.addEventListener('mouseleave', () => {
            container.style.opacity = '0';
        });

        // Create the password input field
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.placeholder = 'Enter Password';
        passwordInput.style.marginBottom = '10px';
        passwordInput.style.padding = '5px';
        passwordInput.style.borderRadius = '4px';
        passwordInput.style.border = '1px solid #ccc';

        // Create the volume slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = 'ultra-volume-slider';
        slider.min = 1; // Normal volume
        slider.max = 5; // 5x boost
        slider.step = 0.1;
        slider.value = 1;
        slider.style.width = '150px';
        slider.style.display = 'none'; // Hidden until the password is correct

        // Match YouTube slider style
        slider.style.appearance = 'none';
        slider.style.background = '#ff0000';
        slider.style.height = '4px';
        slider.style.borderRadius = '2px';
        slider.style.outline = 'none';
        slider.style.transition = 'background 0.3s';

        slider.addEventListener('input', (e) => {
            const volumeBoost = parseFloat(e.target.value);
            gainNode.gain.value = volumeBoost;
        });

        slider.addEventListener('mouseover', () => {
            slider.style.background = '#ff4d4d';
        });

        slider.addEventListener('mouseout', () => {
            slider.style.background = '#ff0000';
        });

        // Handle password input
        passwordInput.addEventListener('change', (e) => {
            if (e.target.value === '////') {
                slider.style.display = 'block';
                passwordInput.style.display = 'none';
            } else {
                alert('Incorrect password. Try again.');
                e.target.value = '';
            }
        });

        // Append elements to the container
        container.appendChild(passwordInput);
        container.appendChild(slider);

        // Add the container to the video frame
        const player = document.querySelector('.html5-video-player');
        if (player) {
            player.appendChild(container);
        }
    }

    // Monitor for new videos and setup the audio boost
    const observer = new MutationObserver(() => {
        setupAudioBoost();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Initial setup
    setupAudioBoost();
})();
