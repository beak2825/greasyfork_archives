// ==UserScript==
// @name         Auto Follow on Bluesky
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically follows users on the Bluesky follows list page with a confirmation prompt whenever a new follows page is opened, and dynamically follows users as they load on the page after confirmation.
// @author       Your Name
// @match        https://bsky.app/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509734/Auto%20Follow%20on%20Bluesky.user.js
// @updateURL https://update.greasyfork.org/scripts/509734/Auto%20Follow%20on%20Bluesky.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let userConfirmed = false;  // To track if the user has confirmed following on the current page
    let currentUrl = window.location.href;  // Store the current URL to detect page changes

    // Function to check if the user is on a "follows" list page
    function isOnFollowsPage() {
        return window.location.href.includes('/follows');  // Check if the URL contains '/follows'
    }

    // Function to simulate clicking follow buttons
    function followUsers() {
        if (!isOnFollowsPage()) {
            console.log('Not on a follows page. Skipping follow functionality.');
            return;  // Exit if not on a follows page
        }

        // Replace this selector with the actual follow button selector (inspect the element to find it)
        const followButtons = document.querySelectorAll('button');  // Adjust selector based on Bluesky page structure

        // Filter buttons that have the text "Follow"
        const filteredButtons = Array.from(followButtons).filter(btn => {
            return btn.textContent.trim().toLowerCase() === 'follow';
        });

        if (filteredButtons.length > 0 && !userConfirmed) {
            // Ask the user once per page if they want to follow all users
            const userConfirmation = confirm(`Would you like to follow all ${filteredButtons.length} users on this page?`);

            if (userConfirmation) {
                userConfirmed = true;  // Set flag to true to avoid future prompts on this page
                filteredButtons.forEach(button => {
                    button.click();  // Simulate the follow button click
                    console.log('Followed a user!');
                });
            } else {
                console.log('User opted not to follow users.');
                return;  // Exit function if the user cancels
            }
        } else if (filteredButtons.length > 0 && userConfirmed) {
            // Follow new users automatically after confirmation
            filteredButtons.forEach(button => {
                button.click();  // Simulate follow button click
                console.log('Followed a user!');
            });
        }
    }

    // Function to detect URL changes (for SPA navigation)
    function detectUrlChange() {
        if (window.location.href !== currentUrl) {
            currentUrl = window.location.href;  // Update the stored URL
            userConfirmed = false;  // Reset the confirmation flag for the new page
            console.log('Navigated to a new page. Checking if it is a follows list page...');
            followUsers();  // Check for follow buttons on the new page
        }
    }

    // MutationObserver to monitor DOM changes and retry finding follow buttons
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                followUsers();  // Try to find and click follow buttons when changes are detected
            }
        }
    });

    // Start observing the document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the function initially in case buttons are already loaded
    followUsers();

    // Check for URL changes every 500ms (polling method)
    setInterval(detectUrlChange, 500);  // You can adjust the interval as needed
})();