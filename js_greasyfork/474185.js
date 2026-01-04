// ==UserScript==
// @name         wxno卫星在线去头部尾部
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  头部尾部太烦人了，直接去掉。!
// @author       qufudj
// @match        http://www.wxno.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474185/wxno%E5%8D%AB%E6%98%9F%E5%9C%A8%E7%BA%BF%E5%8E%BB%E5%A4%B4%E9%83%A8%E5%B0%BE%E9%83%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/474185/wxno%E5%8D%AB%E6%98%9F%E5%9C%A8%E7%BA%BF%E5%8E%BB%E5%A4%B4%E9%83%A8%E5%B0%BE%E9%83%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $("#header").remove();
    $("#footer").remove();
    $("#info").remove();
})();