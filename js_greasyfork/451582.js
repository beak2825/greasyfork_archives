// ==UserScript==
// @name               为firefox修复B站播放的问题
// @version            2.001
// @description        为firefox修复B站播放卡顿、资源占用异常等问题
// @author             SuSpoiled
// @match              *://www.bilibili.com/bangumi/play/ep*
// @match              *://www.bilibili.com/bangumi/play/ss*
// @match              *://bangumi.bilibili.com/anime/*
// @match              *://bangumi.bilibili.com/movie/*
// @match              *://www.bilibili.com/bangumi/media/md*
// @match              *://www.bilibili.com/watchroom/*
// @match              *://www.bilibili.com/video/BV*
// @match              *://www.bilibili.com/video/Bv*
// @match              *://www.bilibili.com/video/bv*
// @match              *://www.bilibili.com/video/AV*
// @match              *://www.bilibili.com/video/Av*
// @match              *://www.bilibili.com/video/av*
// @match              *://www.bilibili.com/medialist/play/*
// @match              *://www.bilibili.com/blackboard/html5player.html*
// @match              *://www.bilibili.com/watchlater/*
// @match              *://www.bilibili.com/list/watchlater*
// @run-at             document-start
// @grant              none
// @license MIT
// @namespace https://greasyfork.org/users/960770
// @downloadURL https://update.greasyfork.org/scripts/451582/%E4%B8%BAfirefox%E4%BF%AE%E5%A4%8DB%E7%AB%99%E6%92%AD%E6%94%BE%E7%9A%84%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/451582/%E4%B8%BAfirefox%E4%BF%AE%E5%A4%8DB%E7%AB%99%E6%92%AD%E6%94%BE%E7%9A%84%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==
(function() {
    'use strict';Object.defineProperty(navigator, 'userAgent', {
        value: "Mozilla/5.0 (Windows NT 10.0; WOW64; Win64; x64; Trident/8.0; rv:12.0) AppleWebKit, like Gecko"
    });
})();