// ==UserScript==
// @name         SNR团队官方网站 背景替换脚本
// @namespace    https://snrstudio.github.io/
// @version      1.0.0
// @description  用来替换SNR官方网站的背景
// @author       还给我六个币
// @match        https://snrstudio.github.io/*
// @icon         none
// @grant        GM_addStyle
// @license      CC0
// @downloadURL https://update.greasyfork.org/scripts/455120/SNR%E5%9B%A2%E9%98%9F%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99%20%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455120/SNR%E5%9B%A2%E9%98%9F%E5%AE%98%E6%96%B9%E7%BD%91%E7%AB%99%20%E8%83%8C%E6%99%AF%E6%9B%BF%E6%8D%A2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        body {
            background: url(../images/background2.png) fixed center;
            background-size: cover;
        }
    `)
})();