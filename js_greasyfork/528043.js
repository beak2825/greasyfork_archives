// ==UserScript==
// @name         UC网盘自动跳转下载
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动把网址中的drive改为fast
// @author       月月小射
// @match        https://drive.uc.cn/s/*
// @icon         https://www.google.com/s2/favicons?domain=uc.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528043/UC%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528043/UC%E7%BD%91%E7%9B%98%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const currentPath = window.location.pathname;
    const idMatch = currentPath.match(/\/s\/([a-zA-Z0-9]+)/);
    if (idMatch && idMatch[1]) {
        const newUrl = `https://fast.uc.cn/s/${idMatch[1]}`;
        window.location.replace(newUrl);
    }
})();