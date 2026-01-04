// ==UserScript==
// @name         网络请求插件
// @namespace    http://tampermonkey.net/
// @version      2024.5.23
// @description  将GM_xmlhttpRequest注入网页，解决跨域问题
// @author       GreenBoy0526
// @match        *://liben.online/site-navigation/*
// @icon         https://greenboy0526.gitee.io/site-navigation/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      baidu.com
// @connect      cikeee.cc
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492044/%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/492044/%E7%BD%91%E7%BB%9C%E8%AF%B7%E6%B1%82%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    unsafeWindow._GM_xmlhttpRequest=GM_xmlhttpRequest
})();