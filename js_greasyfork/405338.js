// ==UserScript==
// @name         PangziForwarder
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Keyboard Control at PangziTV.com
// @author       yxb
// @match        https://www.pangzitv.com/*
// @match        https://pangzitv.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405338/PangziForwarder.user.js
// @updateURL https://update.greasyfork.org/scripts/405338/PangziForwarder.meta.js
// ==/UserScript==





(function() {
    'use strict';
    if (window.location.href.includes("h5pzplayer")) {
        var myPlayer = videojs('my_video_1');

        document.onkeydown = function(e) {
            switch(e.which) {
                case 39:
                    myPlayer.controlBar.progressControl.seekBar.stepForward();
                    break;
                case 37:
                    myPlayer.controlBar.progressControl.seekBar.stepBack();
                    break;
                case 32:
                    if (myPlayer.paused()) {
                        myPlayer.play()
                    } else {
                        myPlayer.pause();
                    }
                    break;
                default:
                    break;
            }
        }
        var v = document.querySelector("#my_video_1_html5_api");
    } else {
        const videoFrame = document.getElementById("videohtml");
        window.onload = function(e) {
            document.addEventListener('keydown', e => {
                // dispatch a new event
                if (e.which == 39 || e.which == 37 || e.which == 32) {
                    videoFrame.contentDocument.dispatchEvent(
                        new KeyboardEvent('keydown', e)
                    );
                    e.preventDefault();
                }
            })
};}
})();