// ==UserScript==
// @name         IXL Hack
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  this prob wont work dont get angry if it doesnt. if your good at coding lmk what i can do to fix this script.
// @author       patrickahhh
// @match        https://www.ixl.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494331/IXL%20Hack.user.js
// @updateURL https://update.greasyfork.org/scripts/494331/IXL%20Hack.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to override the pause timer functionality
    function overridePauseTimer() {
        // Overwrite the function that handles pausing the timer
        window.$x_pauseTimer = function() {
            // Do nothing to prevent pausing
        };
    }

    // Call the function to override the pause timer
    overridePauseTimer();

    // Display a confirmation message in the console
    console.log("IXL No Pause userscript activated: IXL timer will now continue uninterrupted.");

    // Track the time spent on IXL
    let startTime = Date.now(); // Get the current time when the script is executed
    let totalElapsedTime = 0; // Initialize total elapsed time

    // Function to log the total time spent on IXL
    function logTotalTimeSpent() {
        let currentTime = Date.now(); // Get the current time
        let elapsedTime = currentTime - startTime; // Calculate the elapsed time since the script started
        totalElapsedTime += elapsedTime; // Add the elapsed time to the total elapsed time
        console.log("Total time spent on IXL: " + (totalElapsedTime / 1000) + " seconds"); // Log the total time spent on IXL in seconds
        startTime = currentTime; // Update the start time for the next interval
    }

    // Call the function to log the total time spent on IXL
    logTotalTimeSpent();

    // Set an interval to log the time every 60 seconds
    setInterval(logTotalTimeSpent, 60000); // Log the time every minute

    // Function to display a message when the user interacts with IXL
    function displayInteractionMessage() {
        console.log("You are interacting with IXL. Time is being tracked."); // Log a message to indicate interaction with IXL
    }

    // Listen for mouse and keyboard events to detect user interaction
    document.addEventListener("keydown", displayInteractionMessage); // Listen for keydown events
    document.addEventListener("mousemove", displayInteractionMessage); // Listen for mousemove events
    document.addEventListener("mousedown", displayInteractionMessage); // Listen for mousedown events
})();
