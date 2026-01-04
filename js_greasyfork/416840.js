// ==UserScript==
// @name         舰娘百科网址重定向
// @version      0.1
// @description  重定向萌娘移动版的网址到桌面版
// @include      *://m.kcwiki.cn/wiki/*
// @include      *://m.kcwiki.org/wiki/*
// @author       created by 细细米
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/130315
// @downloadURL https://update.greasyfork.org/scripts/416840/%E8%88%B0%E5%A8%98%E7%99%BE%E7%A7%91%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/416840/%E8%88%B0%E5%A8%98%E7%99%BE%E7%A7%91%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

document.location.href = document.location.href.replace('m.kcwiki.cn', 'zh.kcwiki.cn').replace('m.kcwiki.org', 'zh.kcwiki.org').replace('/wiki/', '/index.php?title=');