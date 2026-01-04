// ==UserScript==
// @name         OQEE TV - Enable Video Seek Bar
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Enable the seek bar for the Shaka Player in OQEE TV
// @author       SchubmannM
// @match        https://oqee.tv/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oqee.tv
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471587/OQEE%20TV%20-%20Enable%20Video%20Seek%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/471587/OQEE%20TV%20-%20Enable%20Video%20Seek%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set the interval time (in milliseconds)
    const INTERVAL_TIME = 500;

    // This function configures the Shaka Player UI
    function configureShakaPlayerUI(videoElement) {
        // Access the 'ui' property of the video player
        const videoUI = videoElement.ui;

        // Configuration object for the Shaka Player UI
        const config = {
            addSeekBar: true, // Add the seek bar to the UI
        };

        // Configure the Shaka Player UI with the config object
        videoUI.configure(config);
    }

    // This function will be executed every INTERVAL_TIME milliseconds until the video player and its UI are fully loaded
    function checkVideoAndUI() {
        // Try to find the video player element in the DOM
        const videoElement = document.getElementById('PlayerVideoElement');

        // Check if the video player element and its 'ui' property both exist
        if (videoElement && videoElement.ui) {
            // If they do, clear the interval to stop executing this function
            clearInterval(intervalId);

            // Then, configure the Shaka Player UI using the video element
            configureShakaPlayerUI(videoElement);
        }
    }

    // Start the interval, storing its ID in 'intervalId'
    const intervalId = setInterval(checkVideoAndUI, INTERVAL_TIME);

})();
