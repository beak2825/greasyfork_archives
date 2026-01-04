// ==UserScript==
// @name         豆瓣阅读网页背景色修改
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description Set the background color to be white
// @description:zh-cn 让豆瓣阅读的书在E-ink显示器上能好好显示
// @author       Linfeng
// @match        https://read.douban.com/reader/ebook/*
// @icon         https://www.google.com/s2/favicons?domain=douban.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434230/%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%89%B2%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/434230/%E8%B1%86%E7%93%A3%E9%98%85%E8%AF%BB%E7%BD%91%E9%A1%B5%E8%83%8C%E6%99%AF%E8%89%B2%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add_css(str) {
        var style = document.createElement("style");
        // style.type = "text/css";
        style.innerHTML = str;
        document.getElementsByTagName("HEAD").item(0).appendChild(style);
    }

    add_css("html,.page,.aside{ background-color:#FFFFFF !important; } .page .hd { border-bottom: 3px solid #000000; }");
    // add_css(".article {width: 604px;}.page {width: 520px;}.content p {font-size: 20px!important}");
    add_css(".content p {font-size: 22px!important;}");
    //add_css(".page {width: 520px;}"); // Don't touch article/page objects


})();