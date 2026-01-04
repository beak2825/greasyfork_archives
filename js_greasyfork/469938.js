// ==UserScript==
// @name        speexx视频连播
// @namespace   http://tampermonkey.net/
// @version     1.0
// @description A script to customize the user experience on https://portal.speexx.cn/articles/*/video/
// @author      Ran
// @match       https://portal.speexx.cn/articles/*/video/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/469938/speexx%E8%A7%86%E9%A2%91%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/469938/speexx%E8%A7%86%E9%A2%91%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the play button and click it
        var playButton = document.querySelector('.vjs-big-play-button');
        if (playButton) {
            playButton.click();
        }

        // Function to click the overlay
        function clickOverlay() {
            var overlay = document.querySelector('.library-box-overlay');
            if (overlay) {
                overlay.click();
            }
        }

        // Wait for 5 minutes, then click the overlay, and repeat every 5 minutes
        setInterval(clickOverlay, 5 * 1000 * 60 );
    });

})();
