// ==UserScript==
// @name         Github 时间显示24H格式
// @namespace    https://h3110w0r1d.com/
// @version      2025-02-16
// @description  将 Github 的时间转换为24H格式
// @author       h3110w0r1d
// @license MIT
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526956/Github%20%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA24H%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/526956/Github%20%E6%97%B6%E9%97%B4%E6%98%BE%E7%A4%BA24H%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
    'use strict';
    setInterval(function(){
        document.querySelectorAll('relative-time').forEach((item) => {
            item.setAttribute("format", "datetime");
            item.setAttribute("weekday", "");
            item.setAttribute("lang", "zh");
            item.setAttribute("month", "numeric");
            item.setAttribute("second", "2-digit");
            item.setAttribute("minute", "2-digit");
            item.setAttribute("hour", "2-digit");
        });
    }, 1000);
})();