// ==UserScript==
// @name         B站直播间网页全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  真正的B站直播网页全屏，隐藏右侧的弹幕和下面的礼物栏
// @author       You
// @match        https://live.bilibili.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475795/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/475795/B%E7%AB%99%E7%9B%B4%E6%92%AD%E9%97%B4%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    GM_addStyle('#web-player__bottom-bar__container{display:none !important;}');
    GM_addStyle('.aside-area{display:none !important;}');
    GM_addStyle('.player-full-win .player-section{width:100% !important;}');
})();