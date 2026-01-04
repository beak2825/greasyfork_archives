// ==UserScript==
// @name         NGA网址重定向助手
// @version      0.3
// @description  重定向NGA玩家社区的各种不同域名，避免重复登录。
// @match        *://g.nga.cn/*
// @match        *://ngabbs.com/*
// @match        *://ngacn.cc/*
// @match        *://bbs.nga.cn/*
// @match        *://nga.178.com/*
// @match        *://yues.org/*
// @author       WaterEast
// @namespace https://greasyfork.org/users/73441
// @grant        none
// @run-at       document-start
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/453395/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453395/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

const NGA_destination = "ngabbs.com"

if (location.hostname!=NGA_destination) {
window.location.replace(location.href.replace(location.hostname, NGA_destination));
}
