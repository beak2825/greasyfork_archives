// ==UserScript==
// @name         去除360极速扩展中心限制
// @namespace    undefined
// @version      0.0.1
// @description  让其他基于chromium的浏览器可以直接从360极速扩展中心下载扩展
// @match        http://ext.chrome.360.cn/*
// @match        https://ext.chrome.360.cn/*
// @run-at       body-start
// @compatible   chrome
// @grant        none
// @license      GPL v3
// @downloadURL https://update.greasyfork.org/scripts/423279/%E5%8E%BB%E9%99%A4360%E6%9E%81%E9%80%9F%E6%89%A9%E5%B1%95%E4%B8%AD%E5%BF%83%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423279/%E5%8E%BB%E9%99%A4360%E6%9E%81%E9%80%9F%E6%89%A9%E5%B1%95%E4%B8%AD%E5%BF%83%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

Object.defineProperty(navigator,"userAgent",{value:"Mozilla/5.0 (Windows NT 6.1 AppleWebKit/535.19 KHTML, like Gecko) Chrome/48.0.1025.168 Safari/535.19 QIHU 360EE",writable:false,configurable:false,enumerable:true});
document.getElementById('yellowtip').remove();