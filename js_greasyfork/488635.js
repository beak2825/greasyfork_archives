// ==UserScript==
// @name         Twitter Auto Unmute Videos
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically unmutes all videos on Twitter
// @author       Your Name
// @match        https://twitter.com/*
// @match        https://x.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488635/Twitter%20Auto%20Unmute%20Videos.user.js
// @updateURL https://update.greasyfork.org/scripts/488635/Twitter%20Auto%20Unmute%20Videos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unmuteVideos() {
        let videos = document.querySelectorAll('video');
        videos.forEach(video => {
            video.muted = false;
        });
    }

    // Check for video elements every second and unmute them
    setInterval(unmuteVideos, 1000);
})();
