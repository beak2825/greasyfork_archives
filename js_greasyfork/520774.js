// ==UserScript==
// @name        PW Live Speed Controller
// @namespace   pw-live-speed
// @description Sets video speed to 3x on PW Live
// @include     https://www.pw.live/watch/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/520774/PW%20Live%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/520774/PW%20Live%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Simple function to set video speed
    function setSpeed() {
        let videos = document.getElementsByTagName('video');
        for (let video of videos) {
            video.defaultPlaybackRate = 3.0;
            video.playbackRate = 3.0;
            
            // Lock the playback rate
            Object.defineProperty(video, 'playbackRate', {
                get: () => 3.0,
                set: function() { return; }
            });
        }
    }

    // Run initially
    setSpeed();
    
    // Simple periodic check for dynamically loaded videos
    setInterval(setSpeed, 1000);
})();