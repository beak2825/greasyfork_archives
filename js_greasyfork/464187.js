// ==UserScript==
// @name         Bilibili 视频默认选择1080P
// @namespace    https://github.com/lrkkr
// @version      0.1
// @description  哔哩哔哩清晰度默认1080P
// @author       Xianliang GE
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com//favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464187/Bilibili%20%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A91080P.user.js
// @updateURL https://update.greasyfork.org/scripts/464187/Bilibili%20%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A91080P.meta.js
// ==/UserScript==

(function() {
    const video = document.getElementsByTagName("video")[0];
    video.onplay = (event) => {
        const items = Array.from(document.getElementsByClassName("bpx-player-ctrl-quality-menu-item")).filter(item => parseInt(item.getAttribute('data-value')) <= 80);
        items[0].click();
    };
})();