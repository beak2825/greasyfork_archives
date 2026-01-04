// ==UserScript==
// @name         Facebook Reel Creation Date
// @namespace    http://tampermonkey.net/
// @version      0.1.2024-09-16
// @description  Display the creation date of Facebook reels on the page.
// @author       k127_
// @license      MIT
// @match        https://www.facebook.com/reel/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=facebook.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508751/Facebook%20Reel%20Creation%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/508751/Facebook%20Reel%20Creation%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert UNIX timestamp to readable date format
    function formatUnixTimestamp(timestamp) {
        const date = new Date(timestamp * 1000); // Convert from seconds to milliseconds
        return date.toLocaleString(); // Return date and time as a readable string
    }

    // Function to extract the creation time by parsing JSON and finding matching video ID
    function extractCreationTime(videoId) {
        console.log(`Looking for creation time for video ID: ${videoId}`);

        // Get all script tags with the correct type
        const scriptTags = document.querySelectorAll("script[type='application/json']");
        let creationTime = null;

        // Iterate through all script tags
        scriptTags.forEach(script => {
            // Try to parse the content of each script as JSON
            try {
                const jsonData = JSON.parse(script.innerHTML); // Parse the JSON

                // Recursively search the JSON for the video ID and creation_time
                function searchJson(obj) {
                    if (typeof obj !== 'object' || obj === null) return;

                    // Check if this object contains both "creation_time" and "video"
                    if ('creation_time' in obj && obj.video && obj.video.id === videoId) {
                        creationTime = obj.creation_time;
                        console.log(`Found creation time: ${creationTime} (Unix timestamp) => ${formatUnixTimestamp(creationTime)}`);
                    }

                    // Recursively search the object if it has nested objects
                    for (const key in obj) {
                        if (typeof obj[key] === 'object') {
                            searchJson(obj[key]);
                        }
                    }
                }

                searchJson(jsonData); // Start searching in the parsed JSON object

            } catch (error) {
                // If JSON parsing fails, ignore this script tag
                console.log("Skipping non-JSON script tag.");
            }
        });

        if (!creationTime) {
            console.log("No creation_time found for the matched video.");
        }

        return creationTime;
    }

    // Function to display the creation time on the page
    function displayCreationTime(creationTime) {
        // Purge any existing creation time display
        const existingDiv = document.getElementById('creationTimeDisplay');
        if (existingDiv) {
            existingDiv.remove();
        }

        if (creationTime) {
            const readableDate = formatUnixTimestamp(creationTime);
            console.log(`Displaying readable creation date: ${readableDate}`);

            // Create a new div element to display the creation time
            const creationTimeDiv = document.createElement('div');
            creationTimeDiv.id = 'creationTimeDisplay'; // Assign an ID to the div for later reference
            creationTimeDiv.style.position = 'fixed';
            creationTimeDiv.style.bottom = '10px';
            creationTimeDiv.style.right = '10px';
            creationTimeDiv.style.backgroundColor = '#f1f1f1';
            creationTimeDiv.style.padding = '10px';
            creationTimeDiv.style.border = '1px solid #ccc';
            creationTimeDiv.style.zIndex = '9999';
            creationTimeDiv.style.fontSize = '14px';
            creationTimeDiv.style.color = '#333';
            creationTimeDiv.textContent = `Video Creation Time: ${readableDate}`;

            // Append the div to the body
            document.body.appendChild(creationTimeDiv);
            console.log("Creation time displayed on the page.");
        } else {
            console.log("No creation time to display.");
        }
    }

    // Function to handle URL changes and re-run the script
    function handleReelChange() {
        console.log("Reel changed, re-running script...");

        // Extract the video ID from the URL (assuming the ID is at the end of the URL)
        const videoId = window.location.href.split('/').pop();
        console.log(`Extracted video ID from URL: ${videoId}`);

        // Extract the creation time based on the video ID
        const creationTime = extractCreationTime(videoId);
        displayCreationTime(creationTime);
    }

    // Monitor URL changes by checking periodically
    let lastUrl = window.location.href;
    setInterval(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            console.log(`URL changed from ${lastUrl} to ${currentUrl}`);
            lastUrl = currentUrl;
            handleReelChange();
        }
    }, 1000); // Check for URL changes every 1 second

    // Initial run to get the creation time on page load
    handleReelChange();

})();
