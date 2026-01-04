// ==UserScript==
// @name         safari 默认google搜索重定向
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description google cn 2 google hk
// @author       青青
// @include      http://www.google.com.hk/*
// @include      https://www.google.hk/*
// @include      http://www.google.cn/*
// @include      https://www.google.cn/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/444707/safari%20%E9%BB%98%E8%AE%A4google%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/444707/safari%20%E9%BB%98%E8%AE%A4google%E6%90%9C%E7%B4%A2%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==
document.location.href = document.location.href.replace('www.google.cn','www.google.com.hk/');