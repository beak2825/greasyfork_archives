// ==UserScript==
// @name         SubtitleEase: One-Click Video Subtitle Downloader
// @name:zh-CN   字幕助手: 一键视频字幕下载器
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Easily download subtitles from various video platforms with one click
// @description:zh-CN 一键从多个视频平台轻松下载字幕
// @author       RoyWU
// @license      MIT
// @match        *://*.youtube.com/*
// @match        *://*.viki.com/*
// @match        *://*.viu.com/*
// @match        *://*.kocowa.com/*
// @match        *://*.wetv.vip/*
// @match        *://*.bilibili.com/*
// @match        *://*.facebook.com/*
// @match        *://*.ted.com/*
// @match        *://*.altbalaji.com/*
// @match        *://*.brightcove.com/*
// @match        *://*.dailymotion.com/*
// @match        *://*.dimsum.my/*
// @match        *://*.ondemandchina.com/*
// @match        *://*.erosnow.com/*
// @match        *://*.drive.google.com/*
// @match        *://*.hotstar.com/*
// @match        *://*.iq.com/*
// @match        *://*.iflix.com/*
// @match        *://*.metopera.org/*
// @match        *://*.mgtv.com/*
// @match        *://*.ondemandkorea.com/*
// @match        *://*.tv.naver.com/*
// @match        *://*.tv.nrk.no/*
// @match        *://*.line.me/*
// @match        *://*.tubitv.com/*
// @match        *://*.vk.com/*
// @match        *://*.vlive.tv/*
// @match        *://*.vimeo.com/*
// @match        *://*.voot.com/*
// @match        *://*.weverse.io/*
// @match        *://*.zee5.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=downsub.com
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/509133/SubtitleEase%3A%20One-Click%20Video%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/509133/SubtitleEase%3A%20One-Click%20Video%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DOWNSUB_URL = 'https://downsub.com/';

    // 获取当前标签页的真实URL
    function getCurrentTabUrl() {
        // 检查是否在主框架中
        if (window.self !== window.top) {
            return null;  // 如果不是主框架，返回 null
        }
        // 返回地址栏中的 URL
        return window.top.location.href;
    }

    // 打开 DownSub 标签页
    function openDownSubTab() {
        const currentURL = getCurrentTabUrl();
        // 只有在获取到有效URL时才继续
        if (currentURL) {
            const downsubURL = `${DOWNSUB_URL}?url=${encodeURIComponent(currentURL)}`;
            GM_openInTab(downsubURL, { active: true });
        }
    }

    // 注册菜单命令
    GM_registerMenuCommand("下载字幕", openDownSubTab);

})();