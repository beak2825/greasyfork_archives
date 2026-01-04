// ==UserScript==
// @name        B站自动点赞脚本
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      -Anubis
// @description 2022/12/15 17:30:39
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/456620/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/456620/B%E7%AB%99%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
(function () {
    'use strict';
    setTimeout(function() {
        document.getElementsByClassName("like")[0].click();

    }, 60000);
})(); //(function(){})() 表示该函数立即执行
