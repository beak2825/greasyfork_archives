// ==UserScript==
// @name         Bwin Live URL Generator
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Generates buttons with live URLs for Bwin sports events
// @author       LM
// @match        https://sports.bwin.com/en/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517410/Bwin%20Live%20URL%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/517410/Bwin%20Live%20URL%20Generator.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const processedIds = new Set(); // Set to store processed event IDs

    // Function to create the live URL button
    function createLiveButton(eventId) {
        const liveUrl = `https://example.com/#https://sports.bwin.com/${eventId}`;
        const button = document.createElement('a');
        button.href = liveUrl;
        button.target = "_blank";
        button.textContent = "Open Live URL";
        button.style.marginLeft = "15px";
        button.style.padding = "20px";
        button.style.backgroundColor = "#FFA500";
        button.style.color = "black";
        button.style.borderRadius = "10px";
        button.style.textDecoration = "bold";
        button.style.fontWeight = "bold"

        // Add custom attribute to identify buttons created by the script
        button.setAttribute("data-generated-by-script", "true");
        return button;
    }

    // Function to search for links and add buttons
    function addButtons() {
        const links = document.querySelectorAll('a[href*="/en/sports/events/"]');
        console.log(`[SCRIPT] Found ${links.length} event links.`);

        links.forEach(link => {
            const href = link.getAttribute('href');
            const match = href.match(/-([\d:]+)$/); // Capture the ID after the last hyphen
            if (match) {
                const eventId = match[1];

                // Check if a button for this event ID already exists in the DOM
                const parent = link.parentNode;
                const existingButton = parent.querySelector(`a[data-generated-by-script][href$="${eventId}"]`);
                if (!existingButton) {
                    console.log(`[SCRIPT] Adding button for event ID: ${eventId}`);
                    const button = createLiveButton(eventId);
                    parent.appendChild(button); // Append button to the parent container
                } else {
                    console.log(`[SCRIPT] Button for event ID ${eventId} already exists.`);
                }

                // Add to processed set to ensure it's tracked
                if (!processedIds.has(eventId)) {
                    processedIds.add(eventId);
                }
            } else {
                console.log(`[SCRIPT] No event ID found in link: ${href}`);
            }
        });
    }

    // Periodically check for new links to add buttons
    setInterval(() => {
        console.log(`[SCRIPT] Running periodic check.`);
        addButtons();
    }, 2000);
})();