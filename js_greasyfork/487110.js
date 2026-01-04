// ==UserScript==
// @name         B站直播遮罩去除
// @namespace    http://live.bilibili.com/8719999
// @version      2025
// @description  哔哩哔哩去除直播网页上的遮罩
// @author       月仟龙琰
// @match      *://live.bilibili.com/*
// @match      *.live.bilibili.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487110/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%81%AE%E7%BD%A9%E5%8E%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/487110/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%81%AE%E7%BD%A9%E5%8E%BB%E9%99%A4.meta.js
// ==/UserScript==
(function() {
    'use strict';
    setTimeout(function () {
        const mask = document.querySelector("#web-player-module-area-mask-panel")
        console.log(mask)
        if(mask) mask.style.display = "none"
    }, 5000)
})();