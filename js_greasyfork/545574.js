// ==UserScript==
// @name         PMV Heaven: Auto Play Next Video
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Auto plays the next recommended video at the end, instead of looping the video.
// @author       wompi72
// @match        https://pmvhaven.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545574/PMV%20Heaven%3A%20Auto%20Play%20Next%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/545574/PMV%20Heaven%3A%20Auto%20Play%20Next%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let redirectHref = null;

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            console.log(`[UserScript] Found element: ${selector}`);
            callback(el);
        } else {
            setTimeout(() => waitForElement(selector, callback), 500);
        }
    }

    waitForElement('.v-application .v-col-md-2.v-col-lg-3.v-col-12 .v-row a', (link) => {
        redirectHref = link.href;
    });

    waitForElement('#VideoPlayer', (video) => {
        video.loop = false;
        video.removeAttribute('loop');

        function tryPlay() {
            if (video.paused) {
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            }
        }

        tryPlay();
        ['click', 'touchstart', 'mousemove', 'keydown'].forEach(evt => {
            window.addEventListener(evt, tryPlay, { once: true });
        });
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                tryPlay();
            }
        });

        function onVideoEnd() {
            if (redirectHref) {
                // Stop the video before navigating to prevent background playback
                video.pause();
                video.src = '';
                video.load();
                window.location.replace(redirectHref);
            }
        }

        video.addEventListener('ended', onVideoEnd);

        let lastTime = 0;
        video.addEventListener('timeupdate', () => {
            if (video.duration && video.duration - video.currentTime <= 0.25 && video.currentTime > lastTime) {
                lastTime = video.currentTime;
                if (!video.ended) {
                    onVideoEnd();
                }
            }
        });
    });
})();
