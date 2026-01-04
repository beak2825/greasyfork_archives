// ==UserScript==
// @name         思想家公社助手
// @version      0.1.4
// @description  美化思想家公社文章阅读界面
// @author       Supernova
// @match        http://sobereva.com/*
// @icon         http://sobereva.com/favicon.ico
// @namespace    https://github.com/supernovaZhangJiaXing/Tampermonkey/
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473845/%E6%80%9D%E6%83%B3%E5%AE%B6%E5%85%AC%E7%A4%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/473845/%E6%80%9D%E6%83%B3%E5%AE%B6%E5%85%AC%E7%A4%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

'use strict';
var $ = unsafeWindow.jQuery;

$(document).ready(function () {
    $(".row").css("width", 1450);
    $(".post-content").css("font-size", 20).css("font-family", "微软雅黑");
    $(".post-content").find('p').css("font-size", 20).css("font-family", "微软雅黑");
    $(".post-content").find('span').css("font-size", 20).css("font-family", "微软雅黑");
    $(".post-content").find('h2').css("font-size", 24).css("font-family", "微软雅黑");
    $(".post-content").find('h2').find('span').css("font-size", 24).css("font-family", "微软雅黑");
    $(".post-content").find('h3').css("font-size", 22).css("font-family", "微软雅黑");
    $(".post-content").find('h3').find('span').css("font-size", 22).css("font-family", "微软雅黑");
});
