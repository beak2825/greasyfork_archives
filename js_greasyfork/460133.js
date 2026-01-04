// ==UserScript==
// @name         禁止打开某音网页版
// @namespace    sydney
// @version      3.0
// @description  阻止用户访问抖音网页版   
// @match        https://www.douyin.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460133/%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%9F%90%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460133/%E7%A6%81%E6%AD%A2%E6%89%93%E5%BC%80%E6%9F%90%E9%9F%B3%E7%BD%91%E9%A1%B5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网址
    var url = window.location.href;

    // 如果网址包含抖音的域名，就跳转到一个提示页面
    if (url.includes("douyin.com")) {
        window.location.replace("https://so.gushiwen.cn/mingju/juv_0ff8969519ac.aspx");
    }
})();