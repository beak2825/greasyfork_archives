// ==UserScript==
// @name         csdn 代码块自由复制
// @description  真受不了CSDN每一次都能推陈出新，用来恶心用户的新功能。
// @match        *://blog.csdn.net/*/article/details/*
// @match        *://*.blog.csdn.net/article/details/*
// @version 0.0.1.20210914083258
// @namespace https://greasyfork.org/users/815277
// @downloadURL https://update.greasyfork.org/scripts/432393/csdn%20%E4%BB%A3%E7%A0%81%E5%9D%97%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/432393/csdn%20%E4%BB%A3%E7%A0%81%E5%9D%97%E8%87%AA%E7%94%B1%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(() => document.querySelectorAll("#content_views pre code").forEach(v => v.style.userSelect = 'text'))()