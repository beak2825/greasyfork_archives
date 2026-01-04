// ==UserScript==
// @name         NOC教师资格认证平台助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  可实现NOC教师资格认证平台自动挂机操作。目前第一版功能简陋，仅支持刷课，暂不支持答题。
// @author       徐小宝
// @match        http://ccp.noc.net.cn/*
// @grant        none
// @license MIT
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/459693/NOC%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%AE%A4%E8%AF%81%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/459693/NOC%E6%95%99%E5%B8%88%E8%B5%84%E6%A0%BC%E8%AE%A4%E8%AF%81%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    setInterval(function () {$('#btnPlay').click(); },800);
})();