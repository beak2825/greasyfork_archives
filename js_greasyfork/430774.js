
// ==UserScript==
// @name         Eric全自动网站登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bilibili/CSDN/Github/无需点击,全自动登录
// @author       Eric
// @match        *://*.bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430774/Eric%E5%85%A8%E8%87%AA%E5%8A%A8%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/430774/Eric%E5%85%A8%E8%87%AA%E5%8A%A8%E7%BD%91%E7%AB%99%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    document.cookie = "SESSDATA=[换成你自己的SESSDATA值]; Domain=.bilibili.com;";
 
})();