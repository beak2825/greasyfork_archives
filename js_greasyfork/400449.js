// ==UserScript==
// @name         C语言中文网美化
// @namespace    http://tampermonkey.net/
// @version      0.2.2
// @description  去掉QQ群和编程辅导班链接
// @author       AN drew
// @match        http://c.biancheng.net/*
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400449/C%E8%AF%AD%E8%A8%80%E4%B8%AD%E6%96%87%E7%BD%91%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/400449/C%E8%AF%AD%E8%A8%80%E4%B8%AD%E6%96%87%E7%BD%91%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("#ad-link-top").hide();
    $(".bubble").hide();
    $("#ad-arc-top-diy").hide()
    $("#ad-arc-bottom-diy").hide()
    $(".follow-us").hide();
    $("#qq-qun-float").hide()
    $(".ad-art-body-top").hide();
    $("#ad-sidebar-top").hide()
    $("#ad-bottom-weixin").hide()
    $(".sticker-sidebar").hide();
    $("#weixin-sidebar").hide()
    $("#main > div:nth-child(1) > a").hide()
    $("#ad-arc-top").hide()
    $("#ad-arc-bottom").hide()
    $("#ad-page-top-left").hide()
    $("#all-course").hide();
    $("#nice-arcs").hide();

    $('#top-banner').hide();
    $('#arc-append').hide();

})();