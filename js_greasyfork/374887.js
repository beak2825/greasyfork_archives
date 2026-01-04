// ==UserScript==
// @name         自动展开csdn博客全文,无需登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动展开csdn博客全文,无需登录.
// @author       RozwelGustab
// @match        http://blog.csdn.net/*/article/details/*
// @match        https://blog.csdn.net/*/article/details/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374887/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80csdn%E5%8D%9A%E5%AE%A2%E5%85%A8%E6%96%87%2C%E6%97%A0%E9%9C%80%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/374887/%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80csdn%E5%8D%9A%E5%AE%A2%E5%85%A8%E6%96%87%2C%E6%97%A0%E9%9C%80%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector('div.article_content').style='';
    var readmore=document.getElementById("btn-readmore").parentNode;
    readmore.parentNode.removeChild(readmore);
})();