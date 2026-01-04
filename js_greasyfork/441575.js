// ==UserScript==
// @name         linxb_edge_read
// @description  调用edge的阅读模式将网页转化为阅读模式，本来想直接打开的，结果发现打不开，所以只好在URL前加了个read:然后复制到剪贴板。
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @namespace    https://greasyfork.org/zh-CN/users/884732-linxb
// @version      1.0
// @author       linxb
// @license      MIT
// @match        *://*/*
// @exclude      *://www.baidu.com/
// @exclude      *://*.baidu.com/s?*
// @exclude      *://*.so.com/s?*
// @exclude      *://*.sogou.com/sogou*
// @exclude      *://www.sogou.com/
// @exclude      *://*.bing.com*
// @exclude      *://*.google.com.*
// @exclude      *://*.dogedoge.com*
// @exclude      *://*bilibili*/*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @downloadURL https://update.greasyfork.org/scripts/441575/linxb_edge_read.user.js
// @updateURL https://update.greasyfork.org/scripts/441575/linxb_edge_read.meta.js
// ==/UserScript==

(function() {
    /* global $ */
    'use strict';

    // Your code here...
    var CurrentUrl = window.location.href;
    var NewUrl = "read:" + CurrentUrl;
    GM_setClipboard(NewUrl);


})();