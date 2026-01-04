// ==UserScript==
// @name         2345天气跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  2345简版天气自动跳转详情页面
// @author       廖文杰
// @match        *://tianqi.2345.com/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383516/2345%E5%A4%A9%E6%B0%94%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/383516/2345%E5%A4%A9%E6%B0%94%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
            let url = window.location.href;
            url = url.replace('tianqi.2345.com/s/','tianqi.2345.com/');
             window.location.href=url;
   /* alert(url);*/
})();