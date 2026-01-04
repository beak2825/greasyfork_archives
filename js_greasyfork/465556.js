// ==UserScript==
// @name           LOFTER阅读助手
// @version        0.1.6
// @author         Supernova
// @description    美化LOFTER文章阅读界面
// @match          http*://*.lofter.com/*
// @run-at         document-idle
// @grant          unsafeWindow
// @icon           https://www.lofter.com/favicon.ico
// @namespace      https://github.com/supernovaZhangJiaXing/Tampermonkey/
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/465556/LOFTER%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/465556/LOFTER%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


'use strict';
var $ = unsafeWindow.jQuery;

$(document).ready(function () {
    // 调整主文本界面字号
    $(".text").css("font-size", 18).css("line-height", 1.8);
    $(".txtcont").css("font-size", 18).css("line-height", 1.8);

    // 调整主文本宽度
    $(".box.wid700").css("width", $(window).width() * 0.618);
    $(".box.block.article").eq(0).css($(window).width() * 0.618);

    // 热度栏宽度不变
    $("#comment_frame").css("width", $(".content").width());
    $(".main.comment").css("width", 530);
});
