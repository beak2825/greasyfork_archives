// ==UserScript==
// @name         修正dy2018的电影下载链接为普通链接
// @version      0.1
// @description  dy2018的下载链接添加了javascript，删除这些javascript并把链接转换成普通链接
// @author       Zheng Gu (zhenzegu@gmail.com)
// @match        *://www.dy2018.com/*
// @namespace https://greasyfork.org/users/195174
// @downloadURL https://update.greasyfork.org/scripts/370123/%E4%BF%AE%E6%AD%A3dy2018%E7%9A%84%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%B8%BA%E6%99%AE%E9%80%9A%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/370123/%E4%BF%AE%E6%AD%A3dy2018%E7%9A%84%E7%94%B5%E5%BD%B1%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E4%B8%BA%E6%99%AE%E9%80%9A%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var links = document.querySelectorAll('[title="迅雷专用高速下载"]');
    for (var i in links) {
        var link = links[i];
        link.removeAttribute("title");
        link.removeAttribute("thunderpid");
        link.removeAttribute("thundertype");
        link.removeAttribute("thunderrestitle");
        link.removeAttribute("onclick");
        link.removeAttribute("oncontextmenu");
        link.href = link.text;
    }
})();