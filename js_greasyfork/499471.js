// ==UserScript==
// @name         YouTube Fullscreen Exit on Video End
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Exits fullscreen mode when a YouTube video ends by directly using the fullscreen API.
// @author       SlySnake96 & ChatGPT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        *://*.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499471/YouTube%20Fullscreen%20Exit%20on%20Video%20End.user.js
// @updateURL https://update.greasyfork.org/scripts/499471/YouTube%20Fullscreen%20Exit%20on%20Video%20End.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("Tampermonkey script initialized.");

    // Function to detect if an element is in fullscreen mode
    function isFullscreen() {
        return document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement;
    }

    // Function to exit fullscreen mode
    function exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
            document.msExitFullscreen();
        }
    }

    // Function to check if the video has ended
    function checkVideoEnd() {
        let video = document.querySelector('video');
        if (video) {
            video.addEventListener('ended', () => {
                console.log("Video ended.");
                if (isFullscreen()) {
                    console.log("Exiting fullscreen.");
                    exitFullscreen();
                }
            });
        }
    }

    // Monitor fullscreen changes and video state
    function monitorFullscreen() {
        document.addEventListener('fullscreenchange', () => {
            if (isFullscreen()) {
                console.log("Entered fullscreen mode.");
                checkVideoEnd();
            } else {
                console.log("Exited fullscreen mode.");
            }
        });
        document.addEventListener('webkitfullscreenchange', () => {
            if (isFullscreen()) {
                console.log("Entered fullscreen mode.");
                checkVideoEnd();
            } else {
                console.log("Exited fullscreen mode.");
            }
        });
        document.addEventListener('mozfullscreenchange', () => {
            if (isFullscreen()) {
                console.log("Entered fullscreen mode.");
                checkVideoEnd();
            } else {
                console.log("Exited fullscreen mode.");
            }
        });
        document.addEventListener('MSFullscreenChange', () => {
            if (isFullscreen()) {
                console.log("Entered fullscreen mode.");
                checkVideoEnd();
            } else {
                console.log("Exited fullscreen mode.");
            }
        });
    }

    // Initialize the script
    function init() {
        console.log("Initializing script.");
        monitorFullscreen();
        checkVideoEnd();
    }

    init();

})();