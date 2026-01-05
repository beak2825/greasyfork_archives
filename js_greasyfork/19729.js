// ==UserScript==
// @name         btg
// @namespace    https://bingkubei.cn/
// @version      0.1
// @description  自动将百度跳转到google
// @author       flowfire
// @include      http://www.baidu.com/*
// @include      https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19729/btg.user.js
// @updateURL https://update.greasyfork.org/scripts/19729/btg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.search;
    var kw = url.match(/wd=([^&]+)/);
    var redirect;
    if(kw===null)
        kw = url.match(/word=([^&]+)/);
    if(kw===null)
        redirect="https://www.google.com";
    else
        redirect="https://www.google.com/#q="+kw[1];
    location.href=redirect;
})();