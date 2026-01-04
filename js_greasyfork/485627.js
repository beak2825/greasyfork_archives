// ==UserScript==
// @name         移除高德地图色弱
// @namespace    https://greasyfork.org/zh-CN/users/314234
// @version      1.1.0
// @description  移除高德地图规划路线时的色弱
// @author       Yong_Hu_Ming
// @license      MIT License
// @match        *://www.amap.com/*
// @match        *://amap.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/485627/%E7%A7%BB%E9%99%A4%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E8%89%B2%E5%BC%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/485627/%E7%A7%BB%E9%99%A4%E9%AB%98%E5%BE%B7%E5%9C%B0%E5%9B%BE%E8%89%B2%E5%BC%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`.amap-layer.saturate-filter {
        filter: unset !important;
        }`)
})();