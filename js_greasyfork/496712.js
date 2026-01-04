// ==UserScript==
// @name         Stretch Plex Video to Full Screen
// @name:es      Stretch Plex video a pantalla completa
// @name:de      Plex-Video auf Vollbild strecken
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Stretch video to fit the screen width and/or height on Plex
// @description:es Stretch video ocupará una pantalla completa alto y/o ancho con plex
// @description:de Streckt das Video auf die Höhe und/oder Breite des Bildschirms auf Plex
// @author       Melechtna Antelecht
// @license      MIT
// @match        https://app.plex.tv/desktop/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496712/Stretch%20Plex%20Video%20to%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/496712/Stretch%20Plex%20Video%20to%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isStretched = false; // Flag to track if the video is currently stretched

    // Wait for the element to be available
    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    // Apply the desired CSS styles to stretch the video
    function stretchVideo(element) {
        element.style.width = '100vw';
        element.style.height = '100vh';
        element.style.objectFit = 'fill';
    }

    // Apply the desired CSS styles to revert the video to its original size
    function revertVideo(element) {
        element.style.width = '100%';
        element.style.height = '100%';
        element.style.objectFit = '';
    }

    // Toggle between stretching and reverting the video size
    function toggleStretch(element) {
        if (isStretched) {
            revertVideo(element);
        } else {
            stretchVideo(element);
        }
        isStretched = !isStretched; // Toggle the flag
    }

    // Wait for the video element and then apply styles
    waitForElement('.HTMLMedia-mediaElement-u17S9P', (container) => {
        waitForElement('video', (video) => {
            // Initially set the video to its original size
            revertVideo(video);
            // Listen for 's' key press to toggle video size
            document.addEventListener('keydown', function(event) {
                if (event.key === 's' || event.key === 'S') {
                    toggleStretch(video);
                }
            });
        });
    });
})();