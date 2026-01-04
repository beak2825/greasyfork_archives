// ==UserScript==
// @name         去除B站充电鸣谢
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  I WANT FIND A GIRLFRIEND
// @author       You
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449592/%E5%8E%BB%E9%99%A4B%E7%AB%99%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/449592/%E5%8E%BB%E9%99%A4B%E7%AB%99%E5%85%85%E7%94%B5%E9%B8%A3%E8%B0%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const videoWrap = document.querySelector('.bpx-player-video-wrap');

    const video = videoWrap.querySelector('video');

    video.addEventListener('ended', (event) => {
        const electricWrap = document.querySelector('.bpx-player-electric-wrap');


    if (electricWrap) {
        const children = electricWrap.children;

        for (const ele of children) {
            electricWrap.removeChild(ele);
        }

        electricWrap.style.display = 'none';
    }
});




})();