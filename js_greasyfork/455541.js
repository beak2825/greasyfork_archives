// ==UserScript==
// @name         Youtube予告ミュート
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Youtubeの配信待機画面の予告動画をミュートし、動画再生後のアスペクト比を16:9にする。
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455541/Youtube%E4%BA%88%E5%91%8A%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/455541/Youtube%E4%BA%88%E5%91%8A%E3%83%9F%E3%83%A5%E3%83%BC%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('yt-navigate-finish', () => {
        const yos = document.querySelector(".ytp-offline-slate");
        if(yos && yos.offsetParent) {
            const v = document.querySelector("video");
            if(v) {
                const vol = v.volume;
                v.volume = 0;
                v.addEventListener('ended', () => {
                    v.volume = vol;
                });
            }
        }
    }, false);

    const head = document.getElementsByTagName('head')[0];
    if (head) {
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = `
.html5-video-player.ended-mode {
  aspect-ratio: 16 / 9;
  height: auto !important;
}
`;
        head.appendChild(style);
    }

})();