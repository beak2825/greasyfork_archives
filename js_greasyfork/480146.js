// ==UserScript==
// @name         V2EX 域名重定向
// @namespace    https://greasyfork.org/users/1204387
// @version      0.1.0
// @description  将 V2EX 的其他域名重定向至“www.v2ex.com”。
// @author       Gentry Deng
// @match        http*://v2ex.com/*
// @match        http*://cn.v2ex.com/*
// @match        http*://de.v2ex.com/*
// @match        http*://fast.v2ex.com/*
// @match        http*://global.v2ex.com/*
// @match        http*://hk.v2ex.com/*
// @match        http*://jp.v2ex.com/*
// @match        http*://origin.v2ex.com/*
// @match        http*://s.v2ex.com/*
// @match        http*://staging.v2ex.com/*
// @match        http*://us.v2ex.com/*
// @icon         https://www.v2ex.com/static/icon-192.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480146/V2EX%20%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/480146/V2EX%20%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    if (location.hostname != "www.v2ex.com") {
        window.location.hostname = "www.v2ex.com";
    }
})();