// ==UserScript==
// @name         Kick.com Mouse audio controls
// @namespace    Sky3
// @version      1.0
// @description  Kick.com Mouse audio controls (middle click: mute | scroll: adjust volume)
// @author       Sky3
// @match        https://kick.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517263/Kickcom%20Mouse%20audio%20controls.user.js
// @updateURL https://update.greasyfork.org/scripts/517263/Kickcom%20Mouse%20audio%20controls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let prevScrollDate = 0;

    function addHandlers() {
        const videoElement = document.getElementById('video-player');
        videoElement.addEventListener('mousedown', (event) => {
          if (event.button == 1) {
              videoElement.muted = !videoElement.muted;
              event.preventDefault();
              event.stopPropagation();
          }
        });

        videoElement.addEventListener('wheel', (event) => {
            if (videoElement.muted) return;

            event.preventDefault();
            event.stopPropagation();

            const shouldIncrease = event.deltaY < 0;
            const volume = videoElement.volume;

            if ((volume == 0 && !shouldIncrease) || (volume == 1 && shouldIncrease)) return;

            const now = Date.now(), since = now - prevScrollDate
            const step = (shouldIncrease ? 1 : -1) * (since < 50 ? 4 : 1) * .01

            videoElement.volume += step;

            prevScrollDate = now
        });
    }

    setTimeout(() => {
        addHandlers();
    }, 2000);
})();
