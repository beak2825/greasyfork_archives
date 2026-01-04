// ==UserScript==
// @name        nga 自动重定向
// @namespace   Violentmonkey Scripts
// @match       https://bbs.nga.cn/*
// @match       https://ngabbs.com/*
// @grant       none
// @version     1.01
// @author      -
// @description 9/15/2022, 6:12:18 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451554/nga%20%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/451554/nga%20%E8%87%AA%E5%8A%A8%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

window.location.href = 'https://nga.178.com' + window.location.pathname + window.location.search;