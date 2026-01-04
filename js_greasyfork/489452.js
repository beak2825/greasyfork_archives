// ==UserScript==
// @name         YouTube Shorts Controls
// @namespace    https://www.example.com
// @version      1.0
// @description  Adds rewind and fast forward controls to YouTube Shorts videos
// @author       Your Name
// @match        https://www.youtube.com/shorts/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489452/YouTube%20Shorts%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/489452/YouTube%20Shorts%20Controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the rewind button
    const rewindButton = document.createElement('button');
    rewindButton.innerText = '<<';
    rewindButton.style.position = 'fixed';
    rewindButton.style.top = '50%';
    rewindButton.style.left = 'calc(50% - 130px)';
    rewindButton.style.transform = 'translateY(-50%)';
    rewindButton.style.zIndex = '9999';
    rewindButton.addEventListener('click', () => {
        rewindShortsVideo(2); // Rewind by 2 seconds
    });
    document.body.appendChild(rewindButton);

    // Create the fast forward button
    const fastForwardButton = document.createElement('button');
    fastForwardButton.innerText = '>>';
    fastForwardButton.style.position = 'fixed';
    fastForwardButton.style.top = '50%';
    fastForwardButton.style.left = 'calc(50% - 70px)';
    fastForwardButton.style.transform = 'translateY(-50%)';
    fastForwardButton.style.zIndex = '9999';
    fastForwardButton.addEventListener('click', () => {
        fastForwardShortsVideo(2); // Fast forward by 2 seconds
    });
    document.body.appendChild(fastForwardButton);

    // Function to rewind the Shorts video
    function rewindShortsVideo(seconds) {
        const player = document.querySelector('video');
        if (player) {
            player.currentTime -= seconds;
        }
    }

    // Function to fast forward the Shorts video
    function fastForwardShortsVideo(seconds) {
        const player = document.querySelector('video');
        if (player) {
            player.currentTime += seconds;
        }
    }
})();