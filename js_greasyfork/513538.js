// ==UserScript==
// @name         IDriveSafely.com auto skip
// @namespace    auto clicker 
// @version      1.0
// @description  Bypass the timer on IDriveSafely.com
// @author       John Dow
// @match        https://app.idrivesafely.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513538/IDriveSafelycom%20auto%20skip.user.js
// @updateURL https://update.greasyfork.org/scripts/513538/IDriveSafelycom%20auto%20skip.meta.js
// ==/UserScript==

(function() {
    'use strict';
                console.log("started");


    let videoPlayed = false;  // Flag to track if the video has been played
    let continueLearningButton=false;

    // Function to handle the button clicks
    function clickButtons() {
        console.log("running");

        // Check for the "continue Learning Button" button and click it once
        if (!continueLearningButton) {
            var mainContinueButton = document.querySelector('[data-test="continueLearningButton"]');
            if (mainContinueButton) {
                console.log("main continue button pressed");
                mainContinueButton.click();
                continueLearningButton = true;  // Set flag to true after clicking
            }
        }
        // Check for the "Play Video" button and click it once
        if (!videoPlayed) {
            var playVideoButton = document.querySelector('[title="Play Video"]');
            if (playVideoButton) {
                console.log("video played");
                playVideoButton.click();
                videoPlayed = true;  // Set flag to true after clicking
            }
        }

        // Auto-click the right arrow every 5 seconds
        var arrowButton = document.querySelector('#arrow-next');
        if (arrowButton) {
            arrowButton.click();
            videoPlayed = false;  // Reset the flag after clicking the arrow button
            continueLearningButton=false;
        }
    }

    // Run the function every 5 seconds
    setInterval(clickButtons, 5000); 

})();