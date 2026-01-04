// ==UserScript==
// @name         pr0gramm pause/play
// @namespace    benj
// @version      0.2
// @description  pause / play videos on pr0gramm
// @author       Benj
// @match        http*://pr0gramm.com/*
// @downloadURL https://update.greasyfork.org/scripts/371654/pr0gramm%20pauseplay.user.js
// @updateURL https://update.greasyfork.org/scripts/371654/pr0gramm%20pauseplay.meta.js
// ==/UserScript==

var KEY_CODE = 114; // Key R

(function() {
    'use strict';

    document.addEventListener("keypress", function( event ) {
        if(event.keyCode == KEY_CODE){
            var video = document.querySelector('video');

            if(video && !(video.paused)){
                video.pause();
            } else if(video && video.paused ) {
                video.play();
            }
        }
    });
})();