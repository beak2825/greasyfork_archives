// ==UserScript==
// @name         hub_navigator
// @namespace    http://your.homepage/
// @version      1.0
// @description Website Navigator With Arrow Key Press
// @match      https://*.*/*
// @downloadURL https://update.greasyfork.org/scripts/21362/hub_navigator.user.js
// @updateURL https://update.greasyfork.org/scripts/21362/hub_navigator.meta.js
// ==/UserScript==
function updatePageNumber(increment) {
    const url = window.location.href;

    // Use regex to find the last numeric sequence in the URL
    const regex = /(\d+)(?!.*\d)/;
    const match = url.match(regex);

    if (match) {
        // Extract the matched number
        let number = parseInt(match[0]);

        // Adjust the number based on the increment (positive for next, negative for previous)
        number += increment;

        // Replace the old number in the URL with the updated number
        const updatedUrl = url.replace(regex, number.toString());

        // Log the updated URL to the console
        console.log('Updated URL:', updatedUrl);

        // Navigate to the updated URL
        window.open(updatedUrl, "_self");
    } else {
        console.log("No number found in the URL to increment/decrement.");
    }
}

function checkKeyPressed(e) {
    // Right arrow key for increment
    if (e.keyCode === 39) {
        updatePageNumber(1); // Increment page number
    }
    // Left arrow key for decrement
    if (e.keyCode === 37) {
        updatePageNumber(-1); // Decrement page number
    }
}

// Listen for keydown events
window.addEventListener("keydown", checkKeyPressed, false);

