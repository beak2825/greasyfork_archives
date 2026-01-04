// ==UserScript==
// @name         Battledudes.io Menu Music Toggle
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Add custom menu music to Battledudes.io with a toggle button
// @author       trịnh HƯng
// @match        https://battledudes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483594/Battledudesio%20Menu%20Music%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/483594/Battledudesio%20Menu%20Music%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Replace 'YOUR_AUDIO_FILE_URL' with the actual URL of your audio file
    var audioFileUrl = 'https://surviv-halloween.pro/audio/ambient/menu_music_01.mp3';

    // Create an audio element
    var audioElement = document.createElement('audio');
    audioElement.src = audioFileUrl;
    audioElement.loop = true;

    // Append the audio element to the body
    document.body.appendChild(audioElement);

    // Play the audio when the script runs
    audioElement.play();

    // Function to toggle the audio on and off
    function toggleAudio() {
        if (audioElement.paused) {
            // If paused, play the audio
            audioElement.play();
        } else {
            // If playing, pause the audio
            audioElement.pause();
        }
    }

    // Create a toggle button
    var toggleButton = document.createElement('button');
    toggleButton.innerHTML = 'Toggle Music';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.zIndex = '9999';
    toggleButton.addEventListener('click', toggleAudio);

    // Append the button to the body
    document.body.appendChild(toggleButton);
})();
