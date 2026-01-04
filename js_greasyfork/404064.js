// ==UserScript==
// @name         csdn去除多余工具栏
// @namespace    1286476669@qq.com
// @version      0.1
// @description  csdn去除创作中心弹出框登陆注册评论工具栏、自动展开、免登陆
// @author       baiguangan
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404064/csdn%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99%E5%B7%A5%E5%85%B7%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/404064/csdn%E5%8E%BB%E9%99%A4%E5%A4%9A%E4%BD%99%E5%B7%A5%E5%85%B7%E6%A0%8F.meta.js
// ==/UserScript==

jQuery.noConflict();
(function( $ ) {
    csdn.copyright.init("", "", "");
    localStorage.setItem("anonymousUserLimit", "");
    $("#content_views").unbind("click");
    try{
        const btn = $('.btn-readmore');
        if (btn[0])btn[0].click();
    }catch(e) {
    }
    try{
        const btn = $('.comment-list-box');
        if (btn[0])btn[0].click();
    }catch(e) {
    }
    try{
        $("#csdn-toolbar").attr("style","display:none;");
    }catch(e) {}
    try{
        $("#toolBarBox").attr("style","display:none;");
    }catch(e) {}
    try{
        $("#commentBox").attr("style","display:none;");
    }catch(e) {}
    try{
        $('.comment-box').attr("style","display:none;");
    }catch(e) {}
})( jQuery );