// ==UserScript==
// @name         YouTube Shorts Auto-Scroller
// @namespace    ytautoscroll
// @version      1.1
// @description  Enhance your YouTube Shorts experience by automatically switch to next video after current video is over.
// @author       FrozzDay
// @license      MIT
// @match        https://www.youtube.com/shorts/*
// @grant         none
// @run-at        document-end
// @downloadURL https://update.greasyfork.org/scripts/497220/YouTube%20Shorts%20Auto-Scroller.user.js
// @updateURL https://update.greasyfork.org/scripts/497220/YouTube%20Shorts%20Auto-Scroller.meta.js
// ==/UserScript==
(function() {
    'use strict';

    let vid = null;

    function setupVideoPlayer() {
        const videoContainer = document.querySelector("#shorts-player > div.html5-video-container > video");
        if (videoContainer) {
            vid = videoContainer;
            vid.removeAttribute('loop');
            vid.addEventListener('ended', () => {
                document.querySelector('#navigation-button-down button').click();
            });
        }
    }

    function setupKeyControls() {
        window.addEventListener("keydown", (e) => {
            const key = e.key.toUpperCase();
            if (key === "ARROWLEFT" || key === "A") {
                vid.currentTime -= 2;
            }
            if (key === "ARROWRIGHT" || key === "D") {
                vid.currentTime += 2;
            }
        });
    }

    function removeExtraVideos() {
        const reelVideoRenderers = document.querySelectorAll('ytd-reel-video-renderer');
        console.log("Current reel renderer length: ", reelVideoRenderers.length)
        if (reelVideoRenderers.length >= 28) {
            reelVideoRenderers.slice(0, 9).forEach(video => video.remove());
        }
    }

    setupVideoPlayer();
    setupKeyControls();
    setInterval(removeExtraVideos, 500);

})();
