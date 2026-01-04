// ==UserScript==
// @name         Bilibili 清晰度自动(最高)(4K)
// @namespace    https://github.com/nov30th
// @version      1.0
// @description  bilibili 视频清晰度切换
// @author       Nov30th
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com//favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477199/Bilibili%20%E6%B8%85%E6%99%B0%E5%BA%A6%E8%87%AA%E5%8A%A8%28%E6%9C%80%E9%AB%98%29%284K%29.user.js
// @updateURL https://update.greasyfork.org/scripts/477199/Bilibili%20%E6%B8%85%E6%99%B0%E5%BA%A6%E8%87%AA%E5%8A%A8%28%E6%9C%80%E9%AB%98%29%284K%29.meta.js
// ==/UserScript==

(function() {
    //无脑最高清
    var auto4k = setInterval(() => {
        document.getElementsByClassName("bpx-player-ctrl-quality-menu-item")[0].click();
        clearInterval(auto4k);
    }, 2000);
})();