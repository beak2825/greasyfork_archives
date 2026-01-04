// ==UserScript==
// @name         百度纯净版
// @namespace    com.baidui.clean
// @version      0.4
// @description  去除baidu多余功能，只保留搜索与登录
// @author       SYSTEM-DEV-LPL
// @match        *://www.baidu.com/*
// @grant         none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473672/%E7%99%BE%E5%BA%A6%E7%BA%AF%E5%87%80%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/473672/%E7%99%BE%E5%BA%A6%E7%BA%AF%E5%87%80%E7%89%88.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    $("div[id^='s_main']").remove();
    $("div[id^='content_right']").remove();
 
})();