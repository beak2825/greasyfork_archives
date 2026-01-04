// ==UserScript==
// @name         Youtube Play/Pause Instead of Changing Playback Speed
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Pressing space pauses or plays the video without affecting playback speed.
// @author       RDJ
// @match        *://www.youtube.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511880/Youtube%20PlayPause%20Instead%20of%20Changing%20Playback%20Speed.user.js
// @updateURL https://update.greasyfork.org/scripts/511880/Youtube%20PlayPause%20Instead%20of%20Changing%20Playback%20Speed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Space' && !event.ctrlKey && !event.altKey && !event.shiftKey) {

            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA' || event.target.isContentEditable) {
                return;
            }

            event.preventDefault();
            event.stopPropagation();

            let video = document.querySelector('video');

            if (video) {
                if (video.paused) {
                    video.play();
                } else {
                    video.pause();
                }
            }
        }
    }, true);
})();