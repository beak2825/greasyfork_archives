// ==UserScript==
// @name         bigfun恢复彩色脚本
// @namespace    http://tampermonkey.net/
// @license MIT
// @version      1.2
// @description  恢复bigfun灰色的主页
// @author       小夏酱丶萌比
// @match        https://www.bigfun.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455962/bigfun%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455962/bigfun%E6%81%A2%E5%A4%8D%E5%BD%A9%E8%89%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    var newx = document.createElement('style');
    newx.type = 'text/css';
    document.getElementsByTagName('body')[0].appendChild(newx);
    newx.appendChild(document.createTextNode("body.home-body{filter: none}"));
})();