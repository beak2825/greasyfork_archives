// ==UserScript==
// @name         CSDN免登陆复制
// @namespace   ss
// @version      1.2
// @description   CSDN免登陆代码复制
// @author       松鼠实验室
// @match        https://blog.csdn.net/*/article/details/*
// @icon         https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451864/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/451864/CSDN%E5%85%8D%E7%99%BB%E9%99%86%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll("code").forEach(c => {
        c.contentEditable = "true";
    });
})();