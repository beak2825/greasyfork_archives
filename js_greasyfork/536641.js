// ==UserScript==
// @name        Studyforge Playback Speed
// @namespace   studyforge-playback-speed
// @match       https://tool.studyforge.net/lesson/*
// @grant       none
// @version     1.3
// @author      InterstellarOne
// @license     MIT
// @description Adds a video speed slider to lesson pages
// @downloadURL https://update.greasyfork.org/scripts/536641/Studyforge%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/536641/Studyforge%20Playback%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Slider
    const sizeMultiplier = 1.30;

    const sliderContainer = document.createElement('div');
    sliderContainer.id = 'video-speed-slider-container';
    sliderContainer.style.position = 'fixed';
    sliderContainer.style.bottom = '-4px';
    sliderContainer.style.right = '0px';
    sliderContainer.style.zIndex = '9999';
    sliderContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    sliderContainer.style.padding = `${4 * sizeMultiplier}px`; // Apply multiplier to padding
    sliderContainer.style.color = 'white';
    sliderContainer.style.fontFamily = 'sans-serif';
    sliderContainer.style.fontSize = `${12 * sizeMultiplier}px`; // Apply multiplier to font size
    sliderContainer.style.borderRadius = `${4 * sizeMultiplier}px`; // Apply multiplier to border radius

    const sliderLabel = document.createElement('label');
    sliderLabel.style.padding = `${4 * sizeMultiplier}px`; // Apply multiplier to padding
    sliderLabel.textContent = 'Speed: ';
    sliderLabel.htmlFor = 'video-speed-slider';

    const sliderValueSpan = document.createElement('span');
    sliderValueSpan.id = 'video-speed-value';
    sliderValueSpan.textContent = '1.0'; // Initial display value

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = 'video-speed-slider';
    slider.min = '0.5';
    slider.max = '2.5';
    slider.step = '0.05';
    slider.value = '1.0'; // Default value

    sliderContainer.appendChild(sliderLabel);
    sliderContainer.appendChild(sliderValueSpan);
    sliderContainer.appendChild(document.createElement('br')); // Add a line break
    sliderContainer.appendChild(slider);

    document.body.appendChild(sliderContainer);

    // Function to update playback rate
    function updatePlaybackRate(speed) {
        document.querySelectorAll("video").forEach(video => {
            // Check if the video is ready to have its playbackRate set
            if (video.readyState > 0) {
                video.playbackRate = speed;
            } else {
                // If not ready, wait for the 'loadedmetadata' or 'canplay' event
                const setSpeed = () => {
                    video.playbackRate = speed;
                };
                video.addEventListener('loadedmetadata', setSpeed, {
                    once: true
                }); // Used to remove the listener after it fires
                video.addEventListener('canplay', setSpeed, {
                    once: true
                });
            }
        });
    }

    // Listener for slider values
    slider.addEventListener('input', function() {
        const speed = parseFloat(this.value);
        sliderValueSpan.textContent = speed.toFixed(2); // Update displayed value with 2 decimal places
        updatePlaybackRate(speed);
    });

    // Initial setup: apply default speed to existing videos
    updatePlaybackRate(parseFloat(slider.value));

    // Function to check the display state of the question-fullscreen element
    function checkSliderVisibility() {
        const questionFullscreen = document.querySelector('.question-fullscreen');

        if (!questionFullscreen || window.getComputedStyle(questionFullscreen).display === 'none') {
            sliderContainer.style.display = 'block'; // Show the slider
        } else {
            sliderContainer.style.display = 'none'; // Hide the slider
        }
    }

    // Initial check on page load
    checkSliderVisibility();

    // Use a MutationObserver to watch for changes to the DOM,
    // specifically the style attribute of the question-fullscreen element
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                checkSliderVisibility();
            }
            // Also check for added nodes, in case the question-fullscreen element
            // is added to the DOM dynamically
            if (mutation.type === 'childList') {
                 mutation.addedNodes.forEach(node => {
                     if (node.nodeType === Node.ELEMENT_NODE && node.classList && node.classList.contains('question-fullscreen')) {
                         checkSliderVisibility();
                     }
                 });
            }
        });
    });

    // Start observing the body for attribute and childList changes.
    observer.observe(document.body, {
        attributes: true,
        subtree: true, // Also observe children
        attributeFilter: ['style'], // Only observe changes to the 'style' attribute
        childList: true // Observe addition/removal of nodes
    });

})();
