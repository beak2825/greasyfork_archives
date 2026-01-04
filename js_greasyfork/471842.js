// ==UserScript==
// @name         B站正式版主页UI + 播放页旧UI
// @namespace    Admasy
// @supportURL   NULL
// @version      0.13
// @description  脚本
// @author       Admasy
// @match        *://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471842/B%E7%AB%99%E6%AD%A3%E5%BC%8F%E7%89%88%E4%B8%BB%E9%A1%B5UI%20%2B%20%E6%92%AD%E6%94%BE%E9%A1%B5%E6%97%A7UI.user.js
// @updateURL https://update.greasyfork.org/scripts/471842/B%E7%AB%99%E6%AD%A3%E5%BC%8F%E7%89%88%E4%B8%BB%E9%A1%B5UI%20%2B%20%E6%92%AD%E6%94%BE%E9%A1%B5%E6%97%A7UI.meta.js
// ==/UserScript==


(function() {
    'use strict';
    document.cookie = "i-wanna-go-back=-1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "i-wanna-go-feeds=-1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "go_old_video=1; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";
    document.cookie = "buvid3=63157D91-941E-CDCB-50D2-7B349A60374708542infoc; domain=.bilibili.com; expires=Fri, 31 Dec 2099 23:59:59 GMT; path=/";

})();
