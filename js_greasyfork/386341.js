// ==UserScript==
// @name         去你大爷的暂停背景
// @namespace    gqqnbig.me
// @version      0.1
// @description  删除Twitch播放器暂停时的灰色背景
// @author       gqqnbig
// @match        https://www.twitch.tv/videos/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/386341/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E6%9A%82%E5%81%9C%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/386341/%E5%8E%BB%E4%BD%A0%E5%A4%A7%E7%88%B7%E7%9A%84%E6%9A%82%E5%81%9C%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.player-play-overlay {
    background-color: unset !important;
}`);
})();