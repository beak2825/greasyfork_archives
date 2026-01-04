// ==UserScript==
// @name         Open in TrackerHub
// @namespace    https://trackerhub.vercel.app
// @version      1.0
// @license MIT
// @description  Converts Google Spreadsheets and Docs links to TrackerHub links
// @match        *://docs.google.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/478024/Open%20in%20TrackerHub.user.js
// @updateURL https://update.greasyfork.org/scripts/478024/Open%20in%20TrackerHub.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to convert Google Spreadsheets and Docs links to TrackerHub links
    function convertToTrackerHubLink() {
        var currentURL = window.location.href;
        var regex = /https:\/\/docs\.google\.com\/(spreadsheets|document)\/d\/([a-zA-Z0-9-_]+)\/edit.*/;
        var match = currentURL.match(regex);

        if (match) {
            var fileId = match[2];
            var trackerHubLink = "https://trackerhub.vercel.app/s/" + fileId;

            // Create the button element
            var button = document.createElement('a');
            button.href = trackerHubLink;
            button.textContent = 'Open in TrackerHub';

            // Apply styles to the button
            button.style.position = 'fixed';
            button.style.top = '0';
            button.style.left = '50%';
            button.style.transform = 'translateX(-50%)';
            button.style.padding = '10px 20px';
            button.style.background = 'green';
            button.style.color = 'white';
            button.style.borderRadius = '5px';
            button.style.zIndex = '9999';

            // Append the button to the body
            document.body.appendChild(button);
        }
    }

    // Call the conversion function when the page finishes loading
    window.addEventListener('load', convertToTrackerHubLink);

    // Add custom styles
    GM_addStyle(`
        /* Adjust the body margin to prevent the button from overlapping content */
        body {
            margin-top: 40px;
        }
    `);
})();
