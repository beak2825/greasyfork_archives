// ==UserScript==
// @name         Skip Ads by 10 Seconds 
// @namespace    http://tampermonkey.net/
// @version      2.5 
// @description  Skip video ads forward by 5 seconds using the right arrow key
// @author       Tommy Doan
// @license MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508959/Skip%20Ads%20by%2010%20Seconds.user.js
// @updateURL https://update.greasyfork.org/scripts/508959/Skip%20Ads%20by%2010%20Seconds.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(e) {
        // Check if the pressed key is the right arrow key (keyCode 39)
        if (e.keyCode === 39) {
            // Get all video elements on the page
            let videos = document.querySelectorAll('video');

            // Loop through all the videos
            videos.forEach(function(video) {
                // Skip forward by 10 seconds 
                if (!video.paused && !video.ended) {
                    video.currentTime += 10; 
                }
            });
        }
    });
})();
