// ==UserScript==
// @name            赚吧问题修复
// @description     赚吧问题修复插件
// @include         *://*.zuanke8.com/*
// @version         1.0.1
// @namespace       zuanke8
// @run-at          document-start
// @require         http://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/40849/%E8%B5%9A%E5%90%A7%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/40849/%E8%B5%9A%E5%90%A7%E9%97%AE%E9%A2%98%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==

$(function() {
    $("a[href*='zuanke8.com:8080']").each(function(){
        this.href = this.href.replace("zuanke8.com:8080", "zuanke8.com");
    });
});