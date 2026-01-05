// ==UserScript==
// @name        CG Modify Links
// @version 	1.1
// @namespace	https://greasyfork.org/en/users/8534-shellc55
// @author	    ShellC55
// @description	Adds &pp= at the end of links on carigold.com
// @include 	*://www.carigold.com/*
// @include 	*://carigold.com/*
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/19164/CG%20Modify%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/19164/CG%20Modify%20Links.meta.js
// ==/UserScript==
/************************************************
Source:	http://userscripts-mirror.org/posts5676.html?kind=forum&page=1955
This version does not rewrite the links - it changes the address in the address bar.

wont work if view from feed, i.e. read to last post
2018-11-15 fix url
************************************************/
// 	\d+ means 1 or more digits - in other words - numbers
// 	location.href is the address in the address bar
// 	+= means stick it on the end
if (/^https?:\/\/www\.carigold\.com\/portal\/forums\/showthread\.php\?t=\d+/.test(location.href) && (!(/&pp=40/.test(location.href)))) {
	location.href += "&pp=40";
}
//	num of thread on 1 page
// 	normal 20 thread |pp=60  will show 6- threads in 1 page
if (/^https:\/\/www\.carigold\.com\/portal\/forums\/forumdisplay\.php\?f=\d+/.test(location.href) && (!(/&pp=60/.test(location.href)))) {
	location.href += "&pp=60";
}
//01-04-16     add daysprune
if (/^https:\/\/www\.carigold\.com\/portal\/forums\/forumdisplay\.php\?s=&daysprune=\d+&f=\d+/.test(location.href) && (!(/&pp=60/.test(location.href)))) {
	location.href += "&pp=60";
}