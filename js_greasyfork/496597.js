// ==UserScript==
// @name         YouTube 10x Speed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play YouTube videos at 10x speed
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496597/YouTube%2010x%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/496597/YouTube%2010x%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Check if the video player exists
    function checkPlayer() {
        let player = document.querySelector('video');
        if (player) {
            // Set playback rate to 10x
            player.playbackRate = 10;
        } else {
            // If player doesn't exist yet, check again in 500 milliseconds
            setTimeout(checkPlayer, 500);
        }
    }

    // Check for the video player every 500 milliseconds
    checkPlayer();
})();
