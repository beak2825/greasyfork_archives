// ==UserScript==
// @name         YouTube Video Brightness and Volume
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Control YouTube video brightness and volume (up to 200%) with sliders and a reset button
// @author       You
// @match        *://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513099/YouTube%20Video%20Brightness%20and%20Volume.user.js
// @updateURL https://update.greasyfork.org/scripts/513099/YouTube%20Video%20Brightness%20and%20Volume.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let brightnessValue = localStorage.getItem('yt_brightness') || 1;  // Load saved brightness or default to 1
    let volumeValue = localStorage.getItem('yt_volume') || 1;  // Load saved volume or default to 1 (100%)

    // Function to create the brightness and volume sliders with reset button
    function createControlPanel() {
        // Create slider container
        const sliderContainer = document.createElement('div');
        sliderContainer.style.position = 'fixed';
        sliderContainer.style.bottom = '10px';
        sliderContainer.style.left = '10px';
        sliderContainer.style.zIndex = '9999';
        sliderContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        sliderContainer.style.padding = '10px';
        sliderContainer.style.borderRadius = '5px';
        sliderContainer.style.color = 'white';
        sliderContainer.style.display = 'flex';
        sliderContainer.style.flexDirection = 'column';
        sliderContainer.style.alignItems = 'center';

        // Create reset button
        const resetButton = document.createElement('button');
        resetButton.innerText = 'Reset to Default';
        resetButton.style.marginBottom = '10px';
        resetButton.style.backgroundColor = '#ff4d4d';
        resetButton.style.border = 'none';
        resetButton.style.padding = '5px 10px';
        resetButton.style.borderRadius = '3px';
        resetButton.style.cursor = 'pointer';
        resetButton.style.color = 'white';

        // Reset brightness and volume when reset button is clicked
        resetButton.addEventListener('click', function() {
            brightnessValue = 1;  // Reset brightness to default (100%)
            volumeValue = 1;  // Reset volume to default (100%)
            localStorage.setItem('yt_brightness', brightnessValue);
            localStorage.setItem('yt_volume', volumeValue);
            brightnessSlider.value = brightnessValue;
            volumeSlider.value = volumeValue;
            updateVideoBrightness();
            updateVideoVolume();
        });

        // Create brightness slider label
        const brightnessLabel = document.createElement('span');
        brightnessLabel.innerText = 'Brightness: ';
        brightnessLabel.style.marginRight = '10px';

        // Create brightness slider
        const brightnessSlider = document.createElement('input');
        brightnessSlider.type = 'range';
        brightnessSlider.min = '0.5';
        brightnessSlider.max = '2.0';
        brightnessSlider.step = '0.1';
        brightnessSlider.value = brightnessValue;
        brightnessSlider.style.cursor = 'pointer';

        // Update brightness on slider input change
        brightnessSlider.addEventListener('input', function() {
            brightnessValue = this.value;
            localStorage.setItem('yt_brightness', brightnessValue);  // Save brightness to localStorage
            updateVideoBrightness();
        });

        // Create volume slider label
        const volumeLabel = document.createElement('span');
        volumeLabel.innerText = 'Volume: ';
        volumeLabel.style.marginTop = '10px';
        volumeLabel.style.marginRight = '10px';

        // Create volume slider
        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = '0';
        volumeSlider.max = '2.0';  // Set max to 2.0 for 200%
        volumeSlider.step = '0.1';
        volumeSlider.value = volumeValue;
        volumeSlider.style.cursor = 'pointer';

        // Update volume on slider input change
        volumeSlider.addEventListener('input', function() {
            volumeValue = this.value;
            localStorage.setItem('yt_volume', volumeValue);  // Save volume to localStorage
            updateVideoVolume();
        });

        // Add reset button, brightness slider, and volume slider to the container
        sliderContainer.appendChild(resetButton);
        sliderContainer.appendChild(brightnessLabel);
        sliderContainer.appendChild(brightnessSlider);
        sliderContainer.appendChild(volumeLabel);
        sliderContainer.appendChild(volumeSlider);

        // Add slider container to the body
        document.body.appendChild(sliderContainer);
    }

    // Function to update the video brightness
    function updateVideoBrightness() {
        const video = document.querySelector('video');
        if (video) {
            video.style.filter = `brightness(${brightnessValue})`;
        }
    }

    // Function to update the video volume
    function updateVideoVolume() {
        const video = document.querySelector('video');
        if (video) {
            video.volume = Math.min(volumeValue, 1);  // Limit actual volume to 1 (100%) for the video element
        }
    }

    // Function to initialize the script
    function initialize() {
        createControlPanel();
        const observer = new MutationObserver(function() {
            updateVideoBrightness();
            updateVideoVolume();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        updateVideoBrightness();  // Apply brightness immediately
        updateVideoVolume();  // Apply volume immediately
    }

    // Run the script when the window loads
    window.addEventListener('load', initialize);
})();
