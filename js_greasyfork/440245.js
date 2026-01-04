// ==UserScript==
// @name         隐藏微博分类侧边栏红点
// @version      0.1.2
// @description  隐藏新浪微博网页版的左侧分类标签处恼人的红点
// @author       CWBeta
// @include      *weibo.com*
// @icon         https://www.google.com/s2/favicons?domain=weibo.com
// @namespace    https://greasyfork.org/users/670174
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440245/%E9%9A%90%E8%97%8F%E5%BE%AE%E5%8D%9A%E5%88%86%E7%B1%BB%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%BA%A2%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/440245/%E9%9A%90%E8%97%8F%E5%BE%AE%E5%8D%9A%E5%88%86%E7%B1%BB%E4%BE%A7%E8%BE%B9%E6%A0%8F%E7%BA%A2%E7%82%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("【隐藏微博分类侧边栏红点】运行中！")
    var style = document.createElement("style");
    style.type = "text/css";
    var cssString = ".NavItem_main_2hs9r .woo-badge-box{display:none !important}"
    try
    {
        style.appendChild(document.createTextNode(cssString));
    }
    catch(ex)
    {
        style.styleSheet.cssText = cssString;//针对IE
    }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
})();