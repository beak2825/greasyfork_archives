// ==UserScript==
// @name         允许复制和粘贴
// @namespace    https://greasyfork.org/zh-CN/users/904778-blueccoffee
// @version      0.1
// @description  尝试绕过禁止复制和粘贴的限制
// @author       BluecCoffee
// @match        https://*.*/*
// @match        https://*.*/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472414/%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E5%92%8C%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/472414/%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E5%92%8C%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 取消右键菜单限制
    document.oncontextmenu = null;

    // 取消选择限制
    document.onselectstart = null;

    // 取消复制限制
    document.oncopy = null;

    // 取消剪切限制
    document.oncut = null;

    // 取消粘贴限制
    document.onpaste = null;

    // 如果网站使用了addEventListener来添加事件，你可能还需要更复杂的方法来移除它们
})();
