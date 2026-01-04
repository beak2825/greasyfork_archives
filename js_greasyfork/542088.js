// ==UserScript==
// @name         Youtube auto picture in picture
// @namespace    https://www.youtube.com
// @version      2025-07-09
// @description  Auto opens picture in picture when youtube is hidden
// @author       pooiod7
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542088/Youtube%20auto%20picture%20in%20picture.user.js
// @updateURL https://update.greasyfork.org/scripts/542088/Youtube%20auto%20picture%20in%20picture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('visibilitychange', async () => {
        const video = document.querySelector('video');
        if (!video) return;
        if (document.hidden) {
            if (!video.paused && document.pictureInPictureEnabled && !document.pictureInPictureElement) {
                await video.requestPictureInPicture();
            }
        } else {
            if (document.pictureInPictureElement) {
                await document.exitPictureInPicture();
            }
        }
    });
})();
