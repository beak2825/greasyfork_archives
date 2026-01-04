// ==UserScript==
// @name         Restore Middle-Click on YouTube Thumbnails
// @version      1.0
// @description  Restores the middle-click functionality on YouTube's thumbnails.
// @author       puncia
// @match        https://www.youtube.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1100557
// @downloadURL https://update.greasyfork.org/scripts/468746/Restore%20Middle-Click%20on%20YouTube%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/468746/Restore%20Middle-Click%20on%20YouTube%20Thumbnails.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the middle-click event
    function handleMiddleClick(event) {
        // Check if the middle mouse button was clicked
        if (event.button === 1) {
            // Prevent the default behavior (scrolling)
            event.preventDefault();

            // Open the video in a new tab
            window.open(this.href, '_blank');
        }
    }

    // Get all the thumbnail elements
    var thumbnails = document.querySelectorAll('.yt-simple-endpoint.inline-block.style-scope.ytd-thumbnail');

    // Attach the middle-click event listener to each thumbnail
    thumbnails.forEach(function(thumbnail) {
        thumbnail.addEventListener('auxclick', handleMiddleClick);
    });
})();