// ==UserScript==
// @name         Club250 Steam Link Opener
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Opens Steam links instantly on Club250 pages
// @author       Alper Alkan
// @match        *://club.steam250.com/app/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500908/Club250%20Steam%20Link%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/500908/Club250%20Steam%20Link%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract and open the Steam link
    function openSteamLink() {
        // Query the DOM to find any link elements with the desired URL pattern
        const linkElements = document.querySelectorAll('a[href*="https://store.steampowered.com/app/"]');

        // Check if any link elements exist
        if (linkElements.length > 0) {
            // Extract the first matching href attribute
            const linkToOpen = linkElements[0].href;
            console.log("Redirecting to " + linkToOpen);

            // Open the link in the same tab
            window.location.href = linkToOpen;
        } else {
            console.error('Steam link not found');
        }
    }

    // Run the function to open the link
    openSteamLink();
})();
