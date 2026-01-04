// ==UserScript==
// @name         NGA网址重定向至ngabbs
// @version      0.7
// @description  重定向NGA玩家社区的各种不同域名到ngabbs避免重复登录。修改自 https://greasyfork.org/users/73441
// @match        *://g.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://bbs.nga.cn/*
// @match        *://ngacn.cc/*
// @match        *://yues.org/*
// @author       org30h & acbetter
// @grant        none
// @run-at       document-start
// @license      MIT

// @namespace    https://greasyfork.org/zh-CN/scripts/451089
// @downloadURL https://update.greasyfork.org/scripts/451089/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3ngabbs.user.js
// @updateURL https://update.greasyfork.org/scripts/451089/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E8%87%B3ngabbs.meta.js
// ==/UserScript==

window.location.replace(location.href.replace(location.hostname, "ngabbs.com"));