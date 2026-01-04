// ==UserScript==
// @name         AntiRickRoll
// @version      1.2
// @description  Blocks rickroll videos on YT
// @author       stijnb1234
// @license      GNU GPLv3; https://choosealicense.com/licenses/gpl-3.0/
// @match        *://www.youtube.com/watch?v=iik25wqIuFo*
// @match        *://www.youtube.com/watch?v=oHg5SJYRHA0*
// @match        *://www.youtube.com/watch?v=dQw4w9WgXcQ*
// @match        *://www.youtube.com/watch?v=xvFZjo5PgG0*
// @match        *://www.youtube.com/watch?v=ERdv8aKaDiU*
// @match        *://www.youtube.com/watch?v=ZXpThNX9IRc*
// @grant        none
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1307578
// @downloadURL https://update.greasyfork.org/scripts/496157/AntiRickRoll.user.js
// @updateURL https://update.greasyfork.org/scripts/496157/AntiRickRoll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to block video before it starts playing
    function blockVideoBeforeStart() {
        var loadCheckInterval = setInterval(function() {
            var video = document.querySelector('video');
            if (video && video.readyState === 4) {
                clearInterval(loadCheckInterval);
                // Remove the video container and its parent
                var videoContainer = document.querySelector('.html5-video-container');
                if (videoContainer && videoContainer.parentNode) {
                    videoContainer.parentNode.removeChild(videoContainer);
                    if (videoContainer.parentNode.parentNode) {
                        videoContainer.parentNode.parentNode.removeChild(videoContainer.parentNode);
                    }
                }
                // Mute the audio associated with the video
                var audio = document.querySelector('audio');
                if (audio) {
                    audio.muted = true;
                }
            }
        }, 100);
    }

    blockVideoBeforeStart();

    // Function to display message after a delay
    function displayMessage() {
        // Hide page after delay
        setTimeout(function() {
            document.body.innerHTML = '';
        }, 250);
        // Show a custom message on the page after delay
        setTimeout(function() {
            alert('RICKROLL BLOCKED\nDisable this script to continue');
        }, 500);
    }

    displayMessage();
})();