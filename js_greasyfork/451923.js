// ==UserScript==
// @name		Hostloc网址重定向91ai
// @version		0.1
// @description	Hostloc网址重定向到91ai.net 
// @author		撒旦和数据发送方
// @match		*://hostloc.com/*
// @license		MIT
// @grant		none
// @run-at		document-start
// @namespace https://greasyfork.org/users/962738
// @downloadURL https://update.greasyfork.org/scripts/451923/Hostloc%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%9191ai.user.js
// @updateURL https://update.greasyfork.org/scripts/451923/Hostloc%E7%BD%91%E5%9D%80%E9%87%8D%E5%AE%9A%E5%90%9191ai.meta.js
// ==/UserScript==

window.location.replace(location.href.replace(location.hostname, "91ai.net"));