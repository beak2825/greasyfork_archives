// ==UserScript==
// @name         1024下载助手
// @namespace    
// @version      1.1
// @description  简化 rmdown.com 下载链接的下载步骤，点击一次连接，直接下载
// @author       Riiiii
// @match        *://t66y.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498376/1024%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/498376/1024%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var link = document.getElementById('rmlink');
var reg = /http.*hash=\w{3}/gm;

link.href = link.href.replace(reg,"magnet:?xt=urn:btih:");