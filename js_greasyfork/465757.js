// ==UserScript==
// @name         wuyou.net Domain Redirect
// @name:zh-CN   无忧启动论坛 wuyou.net 子域名重定向
// @author       ttimasdf
// @namespace    https://rabit.pw/
// @license      Apache License 2.0
// @version      1.0
// @description  Redirects duplicated wuyou.net subdomains for a consistent experience and login status.
// @description:zh-CN 对 wuyou.net 子域名进行重定向（如搜索引擎收录的 bbs.c3.wuyou.net）以保持一致的体验。
// @match        http://bbs.c3.wuyou.net/*
// @match        http://wuyou.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465757/wuyounet%20Domain%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/465757/wuyounet%20Domain%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Redirect to the desired URL
    window.location.href = "http://bbs.wuyou.net" + window.location.pathname + window.location.search;
})();
