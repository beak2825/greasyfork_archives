// ==UserScript==
// @name         台州技师学院网课助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可实现麦能网NEP自考专升本、台州技师学院网课自动挂机操作。目前第一版功能简陋，仅支持刷课，暂不支持答题。
// @author       徐小宝
// @match        http://tzjsxy.cjnep.net/*
// @grant        none
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/397713/%E5%8F%B0%E5%B7%9E%E6%8A%80%E5%B8%88%E5%AD%A6%E9%99%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/397713/%E5%8F%B0%E5%B7%9E%E6%8A%80%E5%B8%88%E5%AD%A6%E9%99%A2%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function () {$('#job_nextvideo_btn').click(); },800);
    setInterval(function () {$('.job-nextvideo-btn job-text-btn').click(); },800)
})();