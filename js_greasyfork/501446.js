// ==UserScript==
// @name         Pornhub Playlists Relocate
// @description  Relocates the recommended playlists from the bottom of the page to under the video
// @version      1.0
// @namespace    AceDOne
// @author       AceDOne
// @match        *://www.pornhub.com/*
// @grant        None
// @downloadURL https://update.greasyfork.org/scripts/501446/Pornhub%20Playlists%20Relocate.user.js
// @updateURL https://update.greasyfork.org/scripts/501446/Pornhub%20Playlists%20Relocate.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to move an element above another element and resize it
    function moveAndResizeElement(targetSelector, destinationSelector) {
        var targetElement = document.querySelector(targetSelector);
        var destinationElement = document.querySelector(destinationSelector);

        if (targetElement && destinationElement) {
            // Move the target element above the destination element
            destinationElement.parentNode.insertBefore(targetElement, destinationElement);

            // Adjust styles to ensure the target element is visible
            targetElement.style.position = 'relative';
            targetElement.style.zIndex = '9999'; // Ensure it's above other elements if needed
            targetElement.style.marginBottom = '20px'; // Adjust margin as needed
        }
    }

    // Wait for the document to be fully loaded
    window.addEventListener('load', function() {
        // Define the selectors
        var targetSelector = '.playlist-listingSmall.user-playlist.videos';
        var destinationSelector = '.video-actions-container';

        // Move and resize the target element
        moveAndResizeElement(targetSelector, destinationSelector);
    });

    // Add custom styles for the resized element
    GM_addStyle(`
        .playlist-listingSmall.user-playlist.videos {
            width: 90% !important; /* Adjust width as needed */
            max-width: 600px !important; /* Adjust max width as needed */
            background-color: #f9f9f9; /* Example: set background color for visibility */
            padding: 10px; /* Example: add padding for spacing */
        }
    `);
})();
