// ==UserScript==
// @name         fun.autoblow.com Video CSS Modifier
// @version      1.1
// @description  Modifies CSS of video elements, setting object-fit to 'contain' which automatically fits videos in the player and fullscreen mode. 
// @match        https://fun.autoblow.com/*
// @grant        none
// @namespace https://greasyfork.org/users/1371886
// @downloadURL https://update.greasyfork.org/scripts/509788/funautoblowcom%20Video%20CSS%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/509788/funautoblowcom%20Video%20CSS%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to modify the CSS
    function modifyVideoCSS(videoElement) {
        if (videoElement) {
            // Get the parent element of the video
            const parentElement = videoElement.parentElement;

            if (parentElement) {
                // Set object-fit to contain in the CSS
                parentElement.style.objectFit = 'contain';
                videoElement.style.objectFit = 'contain';

                console.log('Video CSS updated successfully');
            } else {
                console.log('Video parent element not found');
            }
        }
    }

    // Function to check for video element
    function checkForVideo() {
        const videoElement = document.querySelector('video');
        if (videoElement) {
            modifyVideoCSS(videoElement);
        }
    }

    // Set up a MutationObserver to watch for changes in the DOM
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                checkForVideo();
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true });

    // Run the check immediately in case the video is already present
    checkForVideo();

    // Add event listener for possible video source changes
    document.addEventListener('loadeddata', (event) => {
        if (event.target.tagName.toLowerCase() === 'video') {
            modifyVideoCSS(event.target);
        }
    }, true);
})();