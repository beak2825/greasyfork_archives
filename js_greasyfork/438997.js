// ==UserScript==
// @name         SouthPlus 重定向
// @description  SouthPlus 各个域名重定向到 www.south-plus.net
// @version      1.3
// @namespace    http://tampermonkey.net/
// @author       azuki
// @license      MIT
// @match        *://*.white-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.imoutolove.me/*
// @match        *://*.north-plus.net/*
// @match        *://south-plus.net/*
// @match        *://bbs.south-plus.net/*
// @match        *://*.east-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438997/SouthPlus%20%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/438997/SouthPlus%20%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.location.replace(location.href.replace(location.hostname, "www.south-plus.net"));
})();