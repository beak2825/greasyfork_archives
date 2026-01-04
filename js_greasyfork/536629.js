// ==UserScript==
// @name         OPPO天气详情去信息流
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  访问OPPO天气详情网址时自动添加或修改 infoEnable=false 参数以屏蔽信息流
// @author       橘子Jun
// @match        https://news.heytapdownload.com/weather/*
// @grant        none
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536629/OPPO%E5%A4%A9%E6%B0%94%E8%AF%A6%E6%83%85%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.user.js
// @updateURL https://update.greasyfork.org/scripts/536629/OPPO%E5%A4%A9%E6%B0%94%E8%AF%A6%E6%83%85%E5%8E%BB%E4%BF%A1%E6%81%AF%E6%B5%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateURLParameter(url, param, value) {
        const urlObj = new URL(url);
        urlObj.searchParams.set(param, value);
        return urlObj.toString();
    }

    const currentURL = window.location.href;
    const updatedURL = updateURLParameter(currentURL, 'infoEnable', 'false');
    window.location.replace(updatedURL);
})();