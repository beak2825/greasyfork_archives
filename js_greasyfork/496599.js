// ==UserScript==
// @name         YouTube 10x Speed Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Play YouTube videos at 10x speed with the 'L' key shortcut
// @author       You
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496599/YouTube%2010x%20Speed%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/496599/YouTube%2010x%20Speed%20Shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to set playback rate to 10x
    function setPlaybackRate() {
        let player = document.querySelector('video');
        if (player) {
            player.playbackRate = 10;
        }
    }

    // Event listener for key press
    document.addEventListener('keydown', function(event) {
        // Check if 'L' key is pressed
        if (event.key === 'l' || event.key === 'L') {
            setPlaybackRate();
        }
    });
})();
