// ==UserScript==
// @name         New Window Opener With Website
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Opens a new window with a specified website in full-screen mode when the ` key is pressed.
// @author       helpful101
// @license      MIT
// @match        *
// @downloadURL https://update.greasyfork.org/scripts/494995/New%20Window%20Opener%20With%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/494995/New%20Window%20Opener%20With%20Website.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the key press event
    function handleKeyPress(event) {
        // Check if the pressed key is the backtick (`) key (keyCode: 192)
        if (event.keyCode === 192 || event.key === "`") {
            // Specify the URL of the website you want to open
            var websiteURL = "https://example.com/"; // Replace "https://example.com/" with the desired URL

            // Open a new window with the specified website
            var newWindow = window.open(websiteURL, "_blank", "noopener,noreferrer,width=" + screen.availWidth + ",height=" + screen.availHeight);

            // Check if the new window opened successfully
            if (!newWindow) {
                // Handle if the new window failed to open
                console.error("Failed to open the new window.");
            }
        }
    }

    // Add event listener for key press events
    document.addEventListener('keydown', handleKeyPress);
})();
