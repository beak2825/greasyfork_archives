// ==UserScript==
// @name         SpeedeKey: Control HTML5 Video Speed with a Tap
// @author       cemiu
// @license      MIT
// @namespace    https://cemiu.net/
// @homepage     https://gist.github.com/cemiu/db9f64b9d199b75ab218bb7a23b68734
// @homepage     https://cemiu.net/
// @version      1
// @description  Change HTML5 video playback speed right from your keyboard. ("[" to decrease, "]" to increase, Backspace to reset)
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/478227/SpeedeKey%3A%20Control%20HTML5%20Video%20Speed%20with%20a%20Tap.user.js
// @updateURL https://update.greasyfork.org/scripts/478227/SpeedeKey%3A%20Control%20HTML5%20Video%20Speed%20with%20a%20Tap.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Change keybindings for speed modification
    const KEY_SPEED_DECREASE = '[';       // decrease playback speed by 0.25x
    const KEY_SPEED_INCREASE = ']';       // increase playback speed by 0.25x
    const KEY_SPEED_RESET = 'Backspace';  //    reset backback speed to 1x
  
    const SPEED_INCREMENT = 0.25;

    let playbackSpeed = 1.0;
    let displayTimeout;
    let displayVisible = false; // Track if display is visible

    // Create a display element for current speed
    const displayElement = document.createElement('div');
    displayElement.style.position = 'fixed';
    displayElement.style.top = '10px';
    displayElement.style.left = '10px';
    displayElement.style.padding = '5px';
    displayElement.style.background = 'rgba(128, 128, 128, 0.9)';
    displayElement.style.color = 'white';
    displayElement.style.zIndex = '9999';
    displayElement.style.fontFamily = 'Arial, sans-serif';
    displayElement.style.transition = 'opacity 0.2s';
    displayElement.style.opacity = '0';
    displayElement.style.fontSize = '14px';

    // Append the display element to the body
    document.body.appendChild(displayElement);

    // Function to update the display with current speed
    function updateSpeedDisplay() {
        if (displayVisible) {
            displayElement.textContent = `Speed: ${playbackSpeed.toFixed(2)}x`;
            displayElement.style.opacity = '1';
        }

        clearTimeout(displayTimeout);
        displayTimeout = setTimeout(() => {
            displayElement.style.opacity = '0';
        }, 600);
    }

    // Function to change the playback speed of the video
    function changePlaybackSpeed(speed) {
        playbackSpeed += speed;
        if (playbackSpeed < SPEED_INCREMENT) { // Don't let speed stop to 0x
            playbackSpeed = SPEED_INCREMENT;
        }
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            videos.forEach(video => {
                video.playbackRate = playbackSpeed;
            });
            displayVisible = true; // Show display if speed changed on a video page
            updateSpeedDisplay();
        }
    }

    // Event listener for key presses
    document.addEventListener('keydown', event => {
        if (event.key === KEY_SPEED_DECREASE) {
            changePlaybackSpeed(-SPEED_INCREMENT);
        } else if (event.key === KEY_SPEED_INCREASE) {
            changePlaybackSpeed(SPEED_INCREMENT);
        } else if (event.key === KEY_SPEED_RESET) {
            playbackSpeed = 1.0;
            const videos = document.querySelectorAll('video');
            if (videos.length > 0) {
                videos.forEach(video => {
                    video.playbackRate = playbackSpeed;
                });
                displayVisible = true; // Show display if speed reset on a video page
                updateSpeedDisplay();
            }
        }
    });

    // Initialize the speed display
    updateSpeedDisplay();
})();
