// ==UserScript==
// @name         摸鱼奎恩直播间网页版隐藏右侧广告
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  隐藏右侧的广告栏
// @author       ryuumoe
// @match        https://live.douyin.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488666/%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E7%BD%91%E9%A1%B5%E7%89%88%E9%9A%90%E8%97%8F%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/488666/%E6%91%B8%E9%B1%BC%E5%A5%8E%E6%81%A9%E7%9B%B4%E6%92%AD%E9%97%B4%E7%BD%91%E9%A1%B5%E7%89%88%E9%9A%90%E8%97%8F%E5%8F%B3%E4%BE%A7%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('.GxR5iRzU{display:none !important;}');
    GM_addStyle('.xrnYRWXb{margin-right: 0px !important;}');
})();