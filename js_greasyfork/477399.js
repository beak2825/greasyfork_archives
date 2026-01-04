// ==UserScript==
// @name         yblock
// @namespace    snowkitten.com
// @version      1.0
// @description  youtube ab blocker
// @author       You
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        window.onurlchange
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477399/yblock.user.js
// @updateURL https://update.greasyfork.org/scripts/477399/yblock.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let id = (setInterval(() => {
        let elements = document.getElementsByClassName("ytp-ad-player-overlay-skip-or-preview");
        if (elements.length) {
            /**
         * @type {HTMLVideoElement}
         */
            let videoElement = document.getElementsByClassName('video-stream html5-main-video').item(0);
            if (videoElement !== null) {
                let end = videoElement.seekable.end(0);
                videoElement.currentTime = end;
                if (videoElement.paused)
                    videoElement.play();

                let element = document.querySelector(".ytp-ad-skip-button-modern, .ytp-ad-skip-modern");
                if (element !== null)
                    element.click();
            }
        }
    }, 1000));
})();