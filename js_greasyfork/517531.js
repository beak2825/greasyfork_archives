// ==UserScript==
// @name         Scribd Show Full Document Button
// @namespace    http://tampermonkey.net/
// @version      1.2
// @license      MIT
// @description  Adds a button to show full Scribd document content in a new window By chatgpt :)
// @match        *://www.scribd.com/document/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517531/Scribd%20Show%20Full%20Document%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/517531/Scribd%20Show%20Full%20Document%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Retrieve the document ID from the URL
    const docIdMatch = window.location.href.match(/document\/(\d+)/);
    if (!docIdMatch) return;

    const docId = docIdMatch[1];

    // Find the Report button to insert the custom button nearby
    const referenceButton = document.querySelector("button.ButtonCore-module_wrapper_MkTb9s[data-e2e='report-content-button-sticky_metadata_column']");

    if (referenceButton) {
        // Create the custom button
        const showFullButton = document.createElement("button");
        showFullButton.innerText = "Full Doc.";
        showFullButton.style.padding = "10px 15px";
        showFullButton.style.marginLeft = "10px"; // Add some space between buttons
        showFullButton.style.backgroundColor = "#4CAF50";
        showFullButton.style.color = "white";
        showFullButton.style.border = "none";
        showFullButton.style.borderRadius = "5px";
        showFullButton.style.cursor = "pointer";

        // Add click event to open Scribd links in new windows
        showFullButton.onclick = function() {
            // Open the main Scribd document link
            window.open(`https://www.scribd.com/document/${docId}/All-My-Roblox-Ids`, '_blank');

            // Open the embed content link
            window.open(`https://www.scribd.com/embeds/${docId}/content`, '_blank');
        };

        // Insert the custom button after the Report button
        referenceButton.parentNode.insertBefore(showFullButton, referenceButton.nextSibling);
    }
})();