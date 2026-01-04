// ==UserScript==
// @name         Steam Link Filter Bypass - 2026 SE
// @icon         https://store.steampowered.com/favicon.ico
// @author       Axer128
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.3
// @description  Bypasses Steam client / webstore external link filter
// @match        https://steamcommunity.com/linkfilter/*
// @match        https://steamcommunity-com.translate.goog/linkfilter/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/504316/Steam%20Link%20Filter%20Bypass%20-%202026%20SE.user.js
// @updateURL https://update.greasyfork.org/scripts/504316/Steam%20Link%20Filter%20Bypass%20-%202026%20SE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function extractURL() {
        // Get all the text from the webpage
        const pageText = document.body.textContent;

        // Regular expression to match URLs starting with "https://" or "http://"
        const regex = /(https?|http):\/\/[^\s]+/;

        // Extract the first URL that matches the regular expression
        const match = pageText.match(regex);

        // Check if a match is found
        if (match && match.length > 0) {
            // Store the matched URL in the extractedURL variable
            const extractedURL = match[0];
            // Check if the extracted URL is not on steamcommunity.com
            if (!extractedURL.includes('steamcommunity.com')) {
                window.location.replace(extractedURL); // Redirect to the extracted URL
            } else {
                // If the extracted URL is on steamcommunity.com, re-run the script
                setTimeout(extractURL, 1000); // 1000 milliseconds = 1 seconds
            }
        }
    }

    // Use the window.onload event to run the script after the page has fully loaded
    window.onload = function() {
        // Add a delay before calling the extractURL function (optional)
        setTimeout(extractURL, 750); // 1000 milliseconds = 1 seconds
    };
})();
