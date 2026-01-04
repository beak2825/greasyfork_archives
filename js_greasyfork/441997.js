// ==UserScript==
// @name         Anti-4399免登录
// @namespace    https://greasyfork.org/zh-CN/users/820861
// @version      0.3
// @description  拒绝移除4399的强制登录, 切实保护未成年身心健康
// @author       迷你牛逼
// @icon         https://www.4399.com/favicon.ico
// @grant        none
// @license      MIT
// @match        *://greasyfork.org/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/441997/Anti-4399%E5%85%8D%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/441997/Anti-4399%E5%85%8D%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.includes("/scripts/442309-")){
        location.href = "about:blank";
    }
})();