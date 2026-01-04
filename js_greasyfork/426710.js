// ==UserScript==
// @name         NGA网址重定向
// @namespace https://greasyfork.org/zh-CN/users/217333-%E7%A7%8B%E6%9C%88
// @version      1.0.1
// @description  原来的脚本太老，有些域名无法匹配，顺手更新了一下
// @include      *://*.ngacn.cc/*
// @include      *://nga*com/*
// @author       秋月
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/426710/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/426710/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

document.location.href = document.location.href.replace(/nga.+.com/i, 'bbs.nga.cn').replace('ngacn.cc', 'nga.cn');
