// ==UserScript==
// @name		NGA网址重定向178
// @version		0.1
// @description	应急重定向nga到178域名。
// @author		SkywalkerJi
// @match		*://ngabbs.com/*
// @match		*://*.ngacn.cc/*
// @match		*://ngacn.cc/*
// @match		*://bbs.nga.cn/*
// @match		*://g.nga.cn/*
// @match		*://yues.org/*
// @license		MIT
// @grant		none
// @run-at		document-start
// @namespace https://greasyfork.org/users/100154
// @downloadURL https://update.greasyfork.org/scripts/450225/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91178.user.js
// @updateURL https://update.greasyfork.org/scripts/450225/NGA%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%91178.meta.js
// ==/UserScript==
 
window.location.replace(location.href.replace(location.hostname, "nga.178.com"));