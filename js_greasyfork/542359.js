// ==UserScript==
// @name        小鹅通视频速刷插件Beta
// @namespace   Violentmonkey Scripts
// @match       *://appibxs98ig9955.xet.citv.cn/*
// @grant       none
// @version     1.0
// @author      ollie
// @description 2025/7/11 19:25:26
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542359/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%A7%86%E9%A2%91%E9%80%9F%E5%88%B7%E6%8F%92%E4%BB%B6Beta.user.js
// @updateURL https://update.greasyfork.org/scripts/542359/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%A7%86%E9%A2%91%E9%80%9F%E5%88%B7%E6%8F%92%E4%BB%B6Beta.meta.js
// ==/UserScript==
"use strict";

let video = null;
let jumpTime = 5;
document.addEventListener('keydown', function(eveNnt) {
    if (!video) {
        video = document.querySelector('video');
        if (!video) {
            return;
        }
    }
    if (event.code === 'KeyN') {
        event.stopImmediatePropagation();
        video.currentTime = Math.max(0, video.currentTime - jumpTime);
    }
    else if (event.code === 'KeyM') {
        event.stopImmediatePropagation();
        video.currentTime = Math.min(video.duration, video.currentTime + jumpTime);
    }
});
