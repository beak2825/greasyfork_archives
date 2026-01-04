// ==UserScript==
// @name         youtube shorts redirect
// @namespace    http://www.youtube.com/joshclark756
// @version      0.1
// @description  simple code
// @license MIT
// @author       joshclark756
// @match        https://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489690/youtube%20shorts%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/489690/youtube%20shorts%20redirect.meta.js
// ==/UserScript==
// Function to check and modify the URL
function modifyURL() {
    // Get the current URL
    var currentURL = window.location.href;

    // Check if the URL contains a certain word
    if (currentURL.includes('shorts')) {
        // Replace the word with a different one
        var modifiedURL = currentURL.replace('shorts', 'watch');

        // Display a popup message
        // alert('URL modified successfully!');

        // Redirect to the modified URL
        window.location.href = modifiedURL;
    } else {
        // If the word is not found, wait for 1 second and check again
        setTimeout(modifyURL, 1000);
    }
}

// Call the function when the page loads
window.onload = modifyURL;