// ==UserScript==
// @name         CSDN免登录复制
// @namespace    zhangsan1008611
// @version      0.1
// @description  monkey hello world!
// @author       zhangsan1008611
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451932/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/451932/CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==
(function() {
    'use strict';
    document.querySelectorAll("code").forEach(c => { c.contentEditable = "true" });
})();