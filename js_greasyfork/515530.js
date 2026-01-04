// ==UserScript==
// @name         YouTube Player Layout Modifier
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Move the top of the progress bar to the bottom of the YouTube player and keep buttons at the top
// @author       Your Name
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/515530/YouTube%20Player%20Layout%20Modifier.user.js
// @updateURL https://update.greasyfork.org/scripts/515530/YouTube%20Player%20Layout%20Modifier.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to rearrange player elements
    function rearrangePlayerElements() {
        const player = document.querySelector('.html5-video-player');
        const progressBar = document.querySelector('.ytp-progress-bar-container');
        const controls = document.querySelector('.ytp-chrome-bottom');

        if (player && progressBar && controls) {
            // Move controls (buttons) to the top of the player
            player.insertBefore(controls, player.firstChild);
            // Move progress bar to the bottom of the player
            player.appendChild(progressBar);
        }
    }

    // Mutation observer to rearrange elements when player is loaded or changed
    const observer = new MutationObserver(rearrangePlayerElements);
    
    // Observe changes in the body, specifically to the video player
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Call the function initially to rearrange elements if the player is already present
    rearrangePlayerElements();
})();
