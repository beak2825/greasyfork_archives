// ==UserScript==
// @name         Bilibili 自动打开字幕
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  自动打开B站视频的字幕
// @author       神明佑我.
// @author       as AAZl3l4
// @blogs       https://github.com/AAZl3l4
// @thank       kcxin(https://greasyfork.org/en/users/1246814-kcxin)反馈的B站更新后的逻辑
// @license MIT
// @match              *://www.bilibili.com/video*
// @match              *://www.bilibili.com/list*
// @match              *://www.bilibili.com/blackboard*
// @match              *://www.bilibili.com/watchlater*
// @match              *://www.bilibili.com/bangumi*
// @match              *://www.bilibili.com/watchroom*
// @match              *://www.bilibili.com/medialist*
// @match              *://bangumi.bilibili.com*
// @match              *://live.bilibili.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/525595/Bilibili%20%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/525595/Bilibili%20%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==
// ==/UserScript==

(function() {
    'use strict';

    let isSubtitleEnabled = GM_getValue('isSubtitleEnabled', false);

    let menuText = !isSubtitleEnabled ? "开启自动字幕" : "关闭自动字幕"
    GM_registerMenuCommand(menuText, toggleSubtitle);

    function toggleSubtitle() {
        isSubtitleEnabled = !isSubtitleEnabled;
        GM_setValue('isSubtitleEnabled', isSubtitleEnabled);
        window.location.reload();
    }

    function enableSubtitles() {
        const video = document.querySelector("video");
        if (video) {
            video.addEventListener("loadeddata", (event) => {
//                const timer = setInterval(() => {
//                    if (document.querySelector(".bpx-player-control-bottom-right:has(*)")) {
//                        document.querySelector("[aria-label='字幕'] span")?.click();
//                        clearInterval(timer);
//                    }
//                }, 500);
                const timer = setInterval(() => {
                    if (document.querySelector(".bpx-player-ctrl-subtitle-language-item")) {
                        document.querySelector(".bpx-player-ctrl-subtitle-language-item").click();
                        clearInterval(timer);
                    }
                }, 200);
            });
        }
    }
    function closeSubtitles() {
        const video = document.querySelector("video");
        if (video) {
            video.addEventListener("loadeddata", (event) => {
                const timer = setInterval(() => {
                    if (document.querySelector(".bpx-player-ctrl-subtitle-close-switch")) {
                        document.querySelector(".bpx-player-ctrl-subtitle-close-switch").click();
                        clearInterval(timer);
                    }
                }, 200);
            });
        }
    }

    if (isSubtitleEnabled) {
        enableSubtitles();
    }else{
        closeSubtitles();
    }
})();