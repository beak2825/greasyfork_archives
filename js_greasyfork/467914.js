// ==UserScript==
// @name            屏蔽B站大会员彩色弹幕
// @description     屏蔽大会员发送的专属彩色弹幕
// @author          WorldlineChanger
// @namespace       https://github.com/WorldlineChanger/DinnerDanmakuBlockScript
// @homepageURL     https://greasyfork.org/zh-CN/scripts/467914-%E5%B1%8F%E8%94%BDb%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95
// @license         MIT
// @match           *://www.bilibili.com/video/av*
// @match           *://www.bilibili.com/video/BV*
// @match           *://www.bilibili.com/bangumi/play/ep*
// @match           *://www.bilibili.com/bangumi/play/ss*
// @match           *://m.bilibili.com/bangumi/play/ep*
// @match           *://m.bilibili.com/bangumi/play/ss*
// @match           *://bangumi.bilibili.com/anime/*
// @match           *://bangumi.bilibili.com/movie/*
// @match           *://www.bilibili.com/bangumi/media/md*
// @match           *://www.bilibili.com/blackboard/html5player.html*
// @match           *://www.bilibili.com/watchroom/*
// @match           *://space.bilibili.com/*
// @match           https://www.bilibili.com/
// @match           https://www.bilibili.com/?*
// @grant           none
// @icon            https://www.bilibili.com/favicon.ico
// @version         1.2

// @downloadURL https://update.greasyfork.org/scripts/467914/%E5%B1%8F%E8%94%BDB%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/467914/%E5%B1%8F%E8%94%BDB%E7%AB%99%E5%A4%A7%E4%BC%9A%E5%91%98%E5%BD%A9%E8%89%B2%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var StyleElement = document.createElement('style');
    StyleElement.innerText = '.bili-dm-vip{display:none !important; }';
    StyleElement.innerText = '.bili-danmaku-x-dm-vip{display:none !important; }';
    document.body.appendChild(StyleElement);
})();
