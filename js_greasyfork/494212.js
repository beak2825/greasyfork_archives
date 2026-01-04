// ==UserScript==
// @name         Double Stop YouTube Video with Delay
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Apply double stop to YouTube video on refresh with delay
// @author       AFKHAISE
// @match        https://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494212/Double%20Stop%20YouTube%20Video%20with%20Delay.user.js
// @updateURL https://update.greasyfork.org/scripts/494212/Double%20Stop%20YouTube%20Video%20with%20Delay.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function doublePauseWithDelay() {
        setTimeout(() => {
            let videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (!video.paused) {
                    video.pause();
                    setTimeout(() => {
                        if (!video.paused) {
                            video.pause();
                        }
                    }, 1000);
                }
            });
        }, 3000);
    }

    window.addEventListener('load', doublePauseWithDelay);
})();
