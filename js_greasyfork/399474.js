// ==UserScript==
// @name         蓝奏云转换助手
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  从www.lanzous.com转换成lanzou.com解决一部分蓝奏云用户无法打开蓝奏云网站的问题！
// @AuThor       袁煜914 by TanXin
// @match        *://www.lanzous.com/*
// @match        *://www.lanzoui.com/*
// @match        *://www.lanzoux.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399474/%E8%93%9D%E5%A5%8F%E4%BA%91%E8%BD%AC%E6%8D%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/399474/%E8%93%9D%E5%A5%8F%E4%BA%91%E8%BD%AC%E6%8D%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.location.href = window.location.href.replace(window.location.origin,"https://lanzous.com");
})();