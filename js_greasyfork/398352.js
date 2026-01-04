// ==UserScript==
// @name         大力盘助手
// @namespace    https://greasyfork.org/zh-CN/scripts/398352
// @version      1.0.3
// @description  解除大力盘需要扫码，直接显示百度网盘地址
// @author       yue9223
// @match        *://www.dalipan.com/detail/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.4.0/jquery.min.js
// @grant        none
// @run-at       document-ready
// @downloadURL https://update.greasyfork.org/scripts/398352/%E5%A4%A7%E5%8A%9B%E7%9B%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/398352/%E5%A4%A7%E5%8A%9B%E7%9B%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var btn = $('.button-inner');
    if (btn) btn.click(function(event) {
        var dialog = $('.pc-dialog-inner');
        if (dialog) {
            if (__NUXT__.data.length)
                dialog.append("<a href="+__NUXT__.data[0].url+" target='_blank'>点击进入百度网盘</a>");
            else
                dialog.append("<p>未从页面中发现百度网盘的链接</p>");
        }
    });
})();