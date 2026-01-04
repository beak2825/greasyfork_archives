// ==UserScript==
// @name         百度搜索网页旁边的热门新闻删除
// @version      1.0.1
// @description  在工作环境中使用百度时，删除右边的热门新闻注意力被带走。
// @author       ZDH
// @license      MIT
// @date         2018-03-28
// @modified     2018-03-28
// @include      https://www.baidu.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @icon         https://www.baidu.com/favicon.ico
// @namespace    undefined
// @downloadURL https://update.greasyfork.org/scripts/386543/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BD%91%E9%A1%B5%E6%97%81%E8%BE%B9%E7%9A%84%E7%83%AD%E9%97%A8%E6%96%B0%E9%97%BB%E5%88%A0%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/386543/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E7%BD%91%E9%A1%B5%E6%97%81%E8%BE%B9%E7%9A%84%E7%83%AD%E9%97%A8%E6%96%B0%E9%97%BB%E5%88%A0%E9%99%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.type = "text/css";

    var html = "";

    html += "#content_right .FYB_RD,#content_right .cr-content {display:none;} .container_s #content_right{border: none;} .container_l #content_right{border: none;}";
    html += ".hint_right_middle,.chunwan-wrapper{display: none;}";//2019-01-29 增加春晚app屏蔽

    style.innerHTML = html;
    window.document.head.appendChild(style);

})();