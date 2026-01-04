// ==UserScript==
// @name         QQ页面自动跳转
// @namespace    spectop.tech
// @version      0.1
// @description  QQ中打开链接提示非官方页面时，自动跳转到目标链接
// @match        https://c.pc.qq.com/*
// @author       spectop
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464660/QQ%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/464660/QQ%E9%A1%B5%E9%9D%A2%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取URL中的pfurl参数
    var url = new URL(window.location.href);
    var pfurl = url.searchParams.get("pfurl");

    // 如果存在pfurl参数，解码并跳转
    if (pfurl) {
        var target = decodeURIComponent(pfurl);
        window.location.href = target;
    }
})();