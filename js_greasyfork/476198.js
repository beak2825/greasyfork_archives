// ==UserScript==
// @name         Video Skip 90s
// @namespace    http://yourwebsite.com
// @version      1.0
// @description  Skip forward by 90 seconds on online video players using the "K" key
// @author       LordElite
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476198/Video%20Skip%2090s.user.js
// @updateURL https://update.greasyfork.org/scripts/476198/Video%20Skip%2090s.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.key === 'k' || event.key === 'K') {
            var videoPlayer = document.querySelector('video'); // Adjust the selector if necessary
            if (videoPlayer) {
                videoPlayer.currentTime += 90; // Skip forward by 90 seconds
            }
        }
    });
})();