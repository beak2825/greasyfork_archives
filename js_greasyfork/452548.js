// ==UserScript==
// @name         获取微信公众号文章封面
// @name:en      Wechat media platform article cover
// @namespace    https://penghh.fun/
// @version      0.1
// @description  获取微信公众号文章封面的油猴脚本
// @description:en    A script to get wechat media platform article cover
// @author       penghh
// @match        https://mp.weixin.qq.com/*
// @icon         https://mp.weixin.qq.com/favicon.ico
// @grant        GM_registerMenuCommand
// @license      MIT license
// @downloadURL https://update.greasyfork.org/scripts/452548/%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%B0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/452548/%E8%8E%B7%E5%8F%96%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E5%B0%81%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    window.open(document.querySelector('meta[property="og:image"]').content);
    //GM_registerMenuCommand("获取封面", window.open(document.querySelector('meta[property="og:image"]').content), "c");
})();