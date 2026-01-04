// ==UserScript==
// @name         隐藏B站直播虚化遮罩
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  动态修改页面样式表以隐藏虚化遮罩层
// @author       Tyuwwe
// @match        *://live.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527441/%E9%9A%90%E8%97%8FB%E7%AB%99%E7%9B%B4%E6%92%AD%E8%99%9A%E5%8C%96%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/527441/%E9%9A%90%E8%97%8FB%E7%AB%99%E7%9B%B4%E6%92%AD%E8%99%9A%E5%8C%96%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    Array.from(document.styleSheets).forEach(sheet => {
        try {
            sheet.insertRule('.web-player-module-area-mask { backdrop-filter: blur(0px) !important; }', sheet.cssRules.length);
        } catch (e) {
            console.log(e)
        }
    });
})();
