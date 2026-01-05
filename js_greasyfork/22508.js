// ==UserScript==
// @name		NGA网址重定向
// @namespace	https://greasyfork.org/zh-CN/scripts/22508
// @version		0.1.2
// @description	重定向NGA玩家社区的各种不同域名的网址到bbs.nga.cn，避免重复登录。
// @author		咕德 @ WoW-玛洛加尔-<蓝丨图>
// @match		*://nga.178.com/*
// @match		*://nga.178.com/*
// @match		*://ngabbs.com/*
// @match		*://*.ngacn.cc/*
// @match		*://ngacn.cc/*
// @match		*://g.nga.cn/*
// @match		*://yues.org/*
// @license		MIT
// @grant		none
// @run-at		document-start
// @downloadURL https://update.greasyfork.org/scripts/22508/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/22508/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

window.location.replace(location.href.replace(location.hostname, "bbs.nga.cn"));
