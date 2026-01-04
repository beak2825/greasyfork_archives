// ==UserScript==
// @name         萌娘百科网址重定向
// @namespace    https://github.com/Kennnnnnji/Moegirl-Redirect
// @version      0.12
// @description  重定向萌娘移动版的网址到桌面版
// @include      *://mzh.moegirl.org.cn/*
// @include      *://zh.moegirl.org.cn/zh-tw*
// @author       created by Kennnnnnji
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/410244/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/410244/%E8%90%8C%E5%A8%98%E7%99%BE%E7%A7%91%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

document.location.href = document.location.href.replace('mzh.moegirl.org.cn.cc', 'zh.moegirl.org.cn').replace('mzh.moegirl.org.cn', 'zh.moegirl.org.cn').replace('zh-tw', 'zh-cn');
