// ==UserScript==
// @name         No more inactive tabs
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a hidden audio file from 13MB that plays silence to the pages you visit. This will not work on mobile
// @author       Don
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472538/No%20more%20inactive%20tabs.user.js
// @updateURL https://update.greasyfork.org/scripts/472538/No%20more%20inactive%20tabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the audio element
    var audioElement = document.createElement('audio');
    audioElement.src = 'https://raw.githubusercontent.com/KoboldAI/KoboldAI-Client/main/colab/silence.m4a';
    audioElement.controls = false;
    audioElement.autoplay = true; // Autoplay the audio

    // Listen for the "canplay" event before playing
    audioElement.addEventListener('canplay', function() {
        audioElement.play(); // Attempt to play the audio
    });

    // Append the audio element to the body of the page
    document.body.appendChild(audioElement);
})();
