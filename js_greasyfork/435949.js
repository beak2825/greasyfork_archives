// ==UserScript==
// @name         国际版 B 站回家
// @namespace    https://github.com/the-eric-kwok/my_userscripts
// @version      0.2
// @description  外国搜索引擎（如Google）上抓取到的B站视频链接为国际版，不展示评论区等内容，使用此脚本将为你自动跳转回国内版本的B站
// @author       EricKwok
// @supportURL   https://github.com/the-eric-kwok/my_userscripts/issues
// @match        *://www.bilibili.com/s/video/*
// @icon         https://www.bilibili.com/favicon.ico
// @run-at       document-start
// @license      GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435949/%E5%9B%BD%E9%99%85%E7%89%88%20B%20%E7%AB%99%E5%9B%9E%E5%AE%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/435949/%E5%9B%BD%E9%99%85%E7%89%88%20B%20%E7%AB%99%E5%9B%9E%E5%AE%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    location.href = location.href.replace(/bilibili\.com\/s/g, "bilibili.com");
})();