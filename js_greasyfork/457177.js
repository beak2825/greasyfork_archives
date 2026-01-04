// ==UserScript==
// @name         Reuters Video Unmute (Obsolete)
// @namespace    https://greasyfork.org/users/28298
// @version      1.2
// @description  Auto unmute Reuters Video!
// @author       Jerry
// @match        *://www.reuters.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reuters.com
// @noframes
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/457177/Reuters%20Video%20Unmute%20%28Obsolete%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457177/Reuters%20Video%20Unmute%20%28Obsolete%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Delay before starting the interval (in milliseconds)
    const delay = 3000; // 3 seconds delay

    setTimeout(() => {
        const interval = setInterval(() => {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                videoElement.muted = false; // Unmute video
                // videoElement.play();        // Attempt to autoplay
                clearInterval(interval);    // Stop checking once the video is found
            }
        }, 500); // Check every 500ms
    }, delay);
})();