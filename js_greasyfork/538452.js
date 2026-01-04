// ==UserScript==
// @name         抖音直播自动点击
// @namespace    http://tampermonkey.net/
// @version      2025-06-10
// @description  通过每30秒点击一次来阻止抖音网页版自动暂停及其弹窗
// @author       Ginghalo
// @match        https://live.douyin.com/*
// @match        https://www.douyin.com/follow/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538452/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/538452/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==


(function() {
    'use strict';
    setInterval(()=>{document.getElementById("root").click();},30000); // 30秒点击一次
})();