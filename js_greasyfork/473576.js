// ==UserScript==
// @name        Hide played Episodes
// @namespace   Violentmonkey Scripts
// @match       https://podcasts.google.com/*
// @grant       none
// @version     1.0.1
// @author      Alehaaa
// @license     MIT
// @description This script modifies the display of played podcast links and the adjacent separator elements.
// @downloadURL https://update.greasyfork.org/scripts/473576/Hide%20played%20Episodes.user.js
// @updateURL https://update.greasyfork.org/scripts/473576/Hide%20played%20Episodes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Delay execution for a short period (in milliseconds) to allow the page to settle
    setTimeout(function() {
        // Select all <a> elements with the specified href
        const feedLinks = document.querySelectorAll('a[href^="./feed/"]');

        // Loop through each feed link
        feedLinks.forEach(link => {
            // Check if the link's content contains the comment <!-- Draw the green tick. -->
            if (link.innerHTML.includes("<!-- Draw the green tick. -->")) {
                // Set the opacity of the <a> element and its next sibling <div> to 50%
                link.style.display = "none";
                const siblingDiv = link.nextElementSibling;
                if (siblingDiv && siblingDiv.classList.contains("GdsSec")) {
                    siblingDiv.style.display = "none";
                }
            }
        });
    }, 1000); // Delay for 1 second (adjust as needed)
})();
