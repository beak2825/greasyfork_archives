// ==UserScript==
// @name         FreeTube Button
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add an option to open YouTube videos in FreeTube
// @author       devilrajat
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500276/FreeTube%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/500276/FreeTube%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and add the FreeTube button
    function addFreeTubeButton(videoLink) {
        // Check if the FreeTube button is already added
        if (videoLink.nextElementSibling && videoLink.nextElementSibling.classList.contains('freetube-button')) {
            return;
        }

        // Create the FreeTube button
        let freeTubeButton = document.createElement('a');
        freeTubeButton.href = 'freetube://' + videoLink.href;
        freeTubeButton.textContent = 'Open in FreeTube';
        freeTubeButton.style.marginLeft = '10px';
        freeTubeButton.style.color = '#ff0000';
        freeTubeButton.classList.add('freetube-button');

        // Insert the button after the video link
        videoLink.parentNode.insertBefore(freeTubeButton, videoLink.nextSibling);
    }

    // Add event listeners to all video links on the home page
    function addListeners() {
        let videoLinks = document.querySelectorAll('a#video-title, a#thumbnail, a[href^="/watch"]');
        videoLinks.forEach(link => {
            addFreeTubeButton(link);
        });
    }

    // Initial run and re-run when new content is loaded dynamically
    new MutationObserver(addListeners).observe(document.body, { childList: true, subtree: true });

    // Initial call to addListeners
    addListeners();
})();
