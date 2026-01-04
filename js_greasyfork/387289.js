// ==UserScript==
// @name         CSDN默认展开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  CSDN默认展开隐藏的内容，去除展示所有按钮
// @author       You
// @match        https://blog.csdn.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387289/CSDN%E9%BB%98%E8%AE%A4%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/387289/CSDN%E9%BB%98%E8%AE%A4%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var _showContext = document.createElement("style");
    _showContext.textContent = "#article_content {height:auto!important} .hide-article-box{display:none!important}";
    document.body.append(_showContext);
    // Your code here...
})();