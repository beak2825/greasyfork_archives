// ==UserScript==
// @name         nga重定向看评论
// @namespace    https://greasyfork.org/zh-CN/scripts/450199
// @version      0.0.2
// @description  nga看不到评论，暂时重定向至178.com域名
// @author       友则
// @match       *://bbs.nga.cn/*
// @license		MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450199/nga%E9%87%8D%E5%AE%9A%E5%90%91%E7%9C%8B%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/450199/nga%E9%87%8D%E5%AE%9A%E5%90%91%E7%9C%8B%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

window.location.replace(location.href.replace(location.hostname, "nga.178.com"));
