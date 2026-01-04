// ==UserScript==
// @name         SouthPlus域名跳转
// @namespace    http://tampermonkey.net/
// @version      2025-02-14
// @description  域名跳转到可以直连的地址，且很多插件都要适配一个域名就可以了
// @author       biolxy
// @match        *://*.east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imoutolove.me
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526835/SouthPlus%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/526835/SouthPlus%E5%9F%9F%E5%90%8D%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetDomain = "bbs.imoutolove.me"; // 目标域名
    const currentDomain = window.location.hostname;

    if (currentDomain !== targetDomain) {
        let newUrl = window.location.href.replace(currentDomain, targetDomain);
        window.location.href = newUrl;
    }
})();