// ==UserScript==
// @name         哔哩哔哩不打开新窗口
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  本脚本禁止了QQ以新窗口方式打开超链接，而在本窗口打开。至于意义何在，这样你就可以使用浏览器的WebK功能
// @author       MannixWu QQ：3068758340
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.0/dist/jquery.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/434753/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%8D%E6%89%93%E5%BC%80%E6%96%B0%E7%AA%97%E5%8F%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/434753/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%8D%E6%89%93%E5%BC%80%E6%96%B0%E7%AA%97%E5%8F%A3.meta.js
// ==/UserScript==

$(document).ready(function(){
    'use strict';
    $("a").attr("target","_self");
    setInterval('$("a").attr("target","_self");',500);
    // Your code here...
});