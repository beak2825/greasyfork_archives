// ==UserScript==
// @name         【今日头条】禁止导航栏跟随
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  禁止“今日头条”的导航栏跟随功能！
// @author       abevol
// @match        https://www.toutiao.com/*
// @icon         https://www.google.com/s2/favicons?domain=toutiao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433206/%E3%80%90%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E3%80%91%E7%A6%81%E6%AD%A2%E5%AF%BC%E8%88%AA%E6%A0%8F%E8%B7%9F%E9%9A%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/433206/%E3%80%90%E4%BB%8A%E6%97%A5%E5%A4%B4%E6%9D%A1%E3%80%91%E7%A6%81%E6%AD%A2%E5%AF%BC%E8%88%AA%E6%A0%8F%E8%B7%9F%E9%9A%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bar = document.querySelector("#root > div.ttp-sticky-container");
    if (bar) {
        bar.style.position="unset";
    }

    bar = document.querySelector("#root > div > div.fix-header.common-component-wrapper");
    if (bar) {
        bar.style.position="unset";
    }

})();