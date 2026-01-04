// ==UserScript==
// @name         Unmute YouTube Video if muted on page load
// @namespace    Violentmonkey Scripts
// @version      0.2
// @description  Automatically unmutes YouTube videos on page load if muted based, but after full page load
// @author       ChatGPT lmao
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-start  // Execute as soon as possible when the document starts loading
// @license     WTF
// @downloadURL https://update.greasyfork.org/scripts/516694/Unmute%20YouTube%20Video%20if%20muted%20on%20page%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/516694/Unmute%20YouTube%20Video%20if%20muted%20on%20page%20load.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //
    // Dear lord this whole thing was written by ChatGPT, just why
    //

    // Function to check if the video is muted based on the .muted class and unmute it
    function unmuteVideo() {
        const muteButton = document.querySelector('.ytp-mute-button'); // The mute button
        const video = document.querySelector('video');

        if (video.muted || muteButton) {
            muteButton.click(); // Toggle the mute button to unmute
            console.log('Video was muted, unmuting...');
          if (video.muted){video.muted=false;}
        }
    }

    // Create a MutationObserver to watch for changes in the document body
    const observer = new MutationObserver((mutationsList, observer) => {
        // Check if the mute button is added to the DOM
        const muteButton = document.querySelector('.ytp-mute-button');

        if (muteButton) {
            // Once we find the mute button, we can unmute the video after the page is fully loaded
            window.addEventListener('load', () => {
                unmuteVideo();
                // Stop observing once we've executed the action
                observer.disconnect();
            });
        }
    });

    // Start observing the document body for child nodes being added (new elements)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial check for the mute button and video on page load, if available
    window.addEventListener('load', () => {
        unmuteVideo();
        setTimeout(unmuteVideo,2000);
    });

})();
