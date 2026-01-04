// ==UserScript==
// @name         BiliBili 推荐阻拦
// @namespace    https://www.adyingdeath.com/
// @version      v1.0
// @description  去除bilibili中各种位置的推荐内容，包括首页推荐、视频播放器旁的推荐、搜索框里的推荐内容等
// @author       adyingdeath
// @match        *://www.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528994/BiliBili%20%E6%8E%A8%E8%8D%90%E9%98%BB%E6%8B%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/528994/BiliBili%20%E6%8E%A8%E8%8D%90%E9%98%BB%E6%8B%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let blackList = [
        // 首页
        ".bili-feed4-layout",
        ".bili-video-card",
        ".bili-live-card",
        ".floor-single-card",
        // 视频播放页
        ".recommend-list-v1",
        ".right-bottom-banner",
        ".ad-report",
        ".search-panel .trending",
        ".bpx-player-ending-related",
        // 搜索框推荐词去除
        () => {
            const input = $("#nav-searchform .nav-search-input");
            if (input.length > 0 && input[0].getAttribute("placeholder") && input[0].getAttribute("placeholder").length > 0) {
                input[0].setAttribute("placeholder", "");
                return false;
            }
            return true;
        }
    ];

    const $ = (tar) => document.querySelectorAll(tar);

    function removeBlacklisted() {
        let styleElement = [];
        blackList = blackList.filter((i) => {
            if (typeof i === "string") {
                styleElement.push(`${i} {height:0 !important;opacity:0 !important;overflow:hidden;}`);
                return false;
            }
            return i();
        });
        if(styleElement.length > 0) {
            const styleDOM = document.createElement("style");
            styleDOM.innerHTML = styleElement.join("\n");
            document.body.appendChild(styleDOM);
        }
        if(blackList.length > 0) setTimeout(removeBlacklisted, 50);
    }

    // 清理
    removeBlacklisted();
})();
