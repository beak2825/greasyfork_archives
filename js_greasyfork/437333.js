// ==UserScript==
// @name                BiliBili Redirector
// @name:en-US          BiliBili Redirector
// @name:zh-CN          哔哩哔哩重定向
// @description  去除 /s/ 路径部分
// @namespace           bilibili-redirector
// @version             2021.12.20.2
// @author              Akatsuki Rui
// @license             MIT License
// @run-at              document-start
// @match               https://www.bilibili.com/s/*
// @downloadURL https://update.greasyfork.org/scripts/437333/BiliBili%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/437333/BiliBili%20Redirector.meta.js
// ==/UserScript==

"use strict";

 window.location.replace( location.href.replace(location.pathname, location.pathname.slice(2) ));