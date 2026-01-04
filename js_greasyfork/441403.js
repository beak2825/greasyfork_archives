// ==UserScript==
// @name               Bilibili 解鎖杜比全景聲 & 8K & 開啟 HDR & 直播畫質PRO
// @name:zh-CN         Bilibili 解锁杜比全景声 & 8K & 开启 HDR & 直播画质PRO
// @version            2.7.1.0.7
// @description        為 B站 Windows 平台 解鎖杜比全景聲 & 8K &開啟 HDR &直播畫質PRO
// @description:zh-CN  为 B站 Windows 平台 解锁杜比全景声 & 8K &开启 HDR &直播画质PRO
// @author             AlexLI(tkp206093)
// @namespace          https://greasyfork.org/zh-TW/users/150638-tkp206093
// @homepageURL        https://greasyfork.org/zh-TW/scripts/441403
// @supportURL         https://greasyfork.org/zh-TW/scripts/441403/feedback
// @match              *://www.bilibili.com/blackboard/html5playerhelp*
// @match              *://www.bilibili.com/video*
// @match              *://www.bilibili.com/list*
// @match              *://www.bilibili.com/blackboard*
// @match              *://www.bilibili.com/watchlater*
// @match              *://www.bilibili.com/bangumi*
// @match              *://www.bilibili.com/watchroom*
// @match              *://www.bilibili.com/medialist*
// @match              *://bangumi.bilibili.com*
// @match              *://live.bilibili.com/*
// @icon               https://www.google.com/s2/favicons?domain=bilibili.com
// @license            MIT
// @run-at             document-start
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/441403/Bilibili%20%E8%A7%A3%E9%8E%96%E6%9D%9C%E6%AF%94%E5%85%A8%E6%99%AF%E8%81%B2%20%208K%20%20%E9%96%8B%E5%95%9F%20HDR%20%20%E7%9B%B4%E6%92%AD%E7%95%AB%E8%B3%AAPRO.user.js
// @updateURL https://update.greasyfork.org/scripts/441403/Bilibili%20%E8%A7%A3%E9%8E%96%E6%9D%9C%E6%AF%94%E5%85%A8%E6%99%AF%E8%81%B2%20%208K%20%20%E9%96%8B%E5%95%9F%20HDR%20%20%E7%9B%B4%E6%92%AD%E7%95%AB%E8%B3%AAPRO.meta.js
// ==/UserScript==
(function() {
    window.localStorage['bilibili_player_force_DolbyAtmos&8K&HDR'] = 1;
    // B站內置強制開關
    window.localStorage.bilibili_player_force_hdr = 1;
    'use strict'
    const originalSetItem = sessionStorage.getItem;
    sessionStorage.getItem = function(key) {
        // 部分視頻解碼錯誤後會強制全局回退，禁用所有HEVC內容
        // 此hook禁用對應邏輯
        if (key === 'enableHEVCError') {
            return undefined;
        }
        return originalSetItem.apply(this,arguments);
    };
    Object.defineProperty(navigator, 'userAgent', {
        value: "Mozilla/5.0 (Macintosh; Intel Mac OS X 15_7_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15"
    });
})();