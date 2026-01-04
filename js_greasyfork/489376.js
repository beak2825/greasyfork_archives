// ==UserScript==
// @name         OTT Platforms Video Forward/Rewind with Arrow Keys
// @version      1.2
// @description  Take back the control to forward and rewind video playback on OTT platforms like Jiocinema, SonyLiv, etc with keyboard arrow keys
// @author       pb
// @grant        none
// @match https://www.jiocinema.com/*
// @match https://www.sonyliv.com/*
// @namespace https://gist.github.com/prashantbaid/314139311b151964f81bceb2c48fec50
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489376/OTT%20Platforms%20Video%20ForwardRewind%20with%20Arrow%20Keys.user.js
// @updateURL https://update.greasyfork.org/scripts/489376/OTT%20Platforms%20Video%20ForwardRewind%20with%20Arrow%20Keys.meta.js
// ==/UserScript==

(function() {
  document.body.onkeydown = e => {
        //do not interfere with navigating jio in-video slider
        if (isJioSlickSlider(e)) {
            return;
        }

        const videos = document.getElementsByTagName('video');

        if (videos.length > 0) {
            const video = videos[0];

            const seek = time => {
                e.stopImmediatePropagation();
                video.currentTime += time;
            }

            switch (e.key) {
                case 'ArrowRight':
                    seek(10);
                    break;
                case 'ArrowLeft':
                    seek(-10);
                    break;
                default:
                    break;
            }
        }
    }
})();

const isJioSlickSlider = e => {
    return e.target.className.toLowerCase().includes('slick-');
}
