// ==UserScript==
// @name         B站专栏去除版权信息
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  B站专栏去除版权信息，每次复制网址的时候血压急剧升高。使用本脚本的同时也请尊重版权
// @author       LikeJson<
// @match        https://www.bilibili.com/read/*
// @icon         https://www.bilibili.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450333/B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/450333/B%E7%AB%99%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E7%89%88%E6%9D%83%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("copy", function(event) {
        event.stopPropagation();
    }, true);
})();