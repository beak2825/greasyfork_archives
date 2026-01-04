// ==UserScript==
// @name         Airtable Add Class to "Track Time" checkbox
// @version      0.2
// @description  Adds a class to the "Track Time" checkbox when a record is expanded - lightbox view. Function runs when the page initially loads and when the URL changes in Airtable.
// @author       Black Anvil Creative
// @match        https://*.airtable.com/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/1230556
// @downloadURL https://update.greasyfork.org/scripts/481710/Airtable%20Add%20Class%20to%20%22Track%20Time%22%20checkbox.user.js
// @updateURL https://update.greasyfork.org/scripts/481710/Airtable%20Add%20Class%20to%20%22Track%20Time%22%20checkbox.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Custom function to add class
    function addTrackTimeClass() {
        // Get all elements with the class "labelCellPair"
        var labelCellPairs = document.querySelectorAll('.labelCellPair');

        // Iterate through each labelCellPair
        labelCellPairs.forEach(function(labelCellPair) {
            // Find the fieldLabel element within the current labelCellPair
            var fieldLabel = labelCellPair.querySelector('.fieldLabel');

            // Check if the fieldLabel has a value of "Track Time"
            if (fieldLabel && fieldLabel.textContent.trim() === 'Track Time') {
                // Find the cellContainer element within the current labelCellPair
                var cellContainer = labelCellPair.querySelector('.cellContainer');

                // Add the "track-time" class to the cellContainer
                if (cellContainer) {
                    cellContainer.classList.add('track-time');
                }
            }
        });
    }

    // Function to run when the document is loaded
    function onDocumentLoad() {
        addTrackTimeClass();
    }

    // Wait for the DOM to be ready and run the function onDocumentLoad
    window.addEventListener('load', onDocumentLoad);

    // Get the initial URL
    var previousURL = window.location.href;

    // Check for URL changes every 500 milliseconds (adjust as needed)
    setInterval(function() {
        // Get the current URL
        var currentURL = window.location.href;

        // Check if the URL has changed
        if (currentURL !== previousURL) {
            // Run your custom function on URL change
            addTrackTimeClass();

            // Update the previousURL variable
            previousURL = currentURL;
        }
    }, 500); // Adjust the interval as needed
})();