// ==UserScript==
// @name         TikTok Video Source Opener
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Open TikTok video source in a new tab with Alt + Left Click on the video, works with infinite scrolling.
// @author       LukysGaming
// @match        https://www.tiktok.com/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/512378/TikTok%20Video%20Source%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/512378/TikTok%20Video%20Source%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to handle the Alt + Left Click event
    const handleAltClick = (event) => {
        if (event.altKey && event.button === 0) {
            const videoElement = event.target.closest('video'); // Find the video element clicked on

            if (videoElement) {
                const sourceURL = videoElement.querySelector('source')?.src || videoElement.src;

                if (sourceURL) {
                    // Open the video source URL in a new tab
                    window.open(sourceURL, '_blank');
                } else {
                    alert('Unable to find video source.');
                }
            }
        }
    };

    // Add event listener to the entire document
    document.addEventListener('click', handleAltClick);

})();
