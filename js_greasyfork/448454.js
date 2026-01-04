// ==UserScript==
// @name         z-plugin
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  自己的随便使用
// @author       zsw
// @match        *.csdn.net/*
// @grant unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448454/z-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/448454/z-plugin.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 复制功能
    $("#content_views pre").css("user-select","text");
    $("#content_views pre code").css("user-select","text");
    $("#content_views pre code").css("background","darksalmon");
    $("#content_views pre div").attr("data-title","随便复制 ~ 😘");


    //拦截功能

    //

})();