// ==UserScript==
// @name         Bilibili 视频默认选择最高清晰度
// @namespace    https://github.com/FeiZhaixiage
// @version      0.1
// @description  之前哔哩哔哩切换视频，清晰度会默认调成自动。
// @author       FeizhaiXiage
// @match        *://www.bilibili.com/video/*
// @match        *://www.bilibili.com/bangumi/play/*
// @icon         https://www.bilibili.com//favicon.ico
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458076/Bilibili%20%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/458076/Bilibili%20%E8%A7%86%E9%A2%91%E9%BB%98%E8%AE%A4%E9%80%89%E6%8B%A9%E6%9C%80%E9%AB%98%E6%B8%85%E6%99%B0%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    const video = document.getElementsByTagName("video")[0];
    video.onplay = (event) => {
        document.getElementsByClassName("bpx-player-ctrl-quality-menu-item")[0].click();
    };
})();