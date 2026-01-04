// ==UserScript==
// @name         Soundcloud - stop autoplay tracks
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  when track goes into last seconds, it will stop
// @author       https://puvox.software
// @match        https://*.soundcloud.com/*
// @icon         https://www.google.com/s2/favicons?domain=soundcloud.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486752/Soundcloud%20-%20stop%20autoplay%20tracks.user.js
// @updateURL https://update.greasyfork.org/scripts/486752/Soundcloud%20-%20stop%20autoplay%20tracks.meta.js
// ==/UserScript==

(function() {
    'use strict';
     const stopWithinSecondsLast = 3;

    function hmsToSecondsOnly(str) {
        var p = str.split(':'),
            s = 0, m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }

    const intervalCheck = setInterval ( ()=> {
        const playingState = document.querySelector('.playControls__play.playing');
        if (playingState) {
            const currentTimeElement = document.querySelector('.playbackTimeline__timePassed [aria-hidden="true"]');
            const currentTimeSeconds = hmsToSecondsOnly(currentTimeElement.textContent);
            const fullDurationElement = document.querySelector('.playbackTimeline__duration [aria-hidden="true"]');
            const fullTimeSeconds = hmsToSecondsOnly(fullDurationElement.textContent);
            if (fullTimeSeconds-currentTimeSeconds < stopWithinSecondsLast) {
                try {
                    playingState.click();
                } catch(e){}
            }
        }
    }, 1000);
})();