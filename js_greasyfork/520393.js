// ==UserScript==
// @name         xianwei
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  auto-play
// @author       XianweiCao
// @match        *://*.yuketang.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520393/xianwei.user.js
// @updateURL https://update.greasyfork.org/scripts/520393/xianwei.meta.js
// ==/UserScript==


(function() {
    'use strict';
    (async function waitForPageLoad() {
        const video = await new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const videoElement = document.querySelector('video');
                if (videoElement) {
                    clearInterval(checkInterval);
                    resolve(videoElement);
                }
            }, 500);
        });
        setInterval(() => {
            // video.playbackRate = 2;
            if (video.paused) {
                video.play();
                console.log('曹显伟');
            }
        }, 1000);
    })();
})();