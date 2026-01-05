// ==UserScript==
// @name        sis.link.sortByPostTime
// @namespace   zhang
// @description sort threads by post time
// @include     http://www.sexinsex.net/*
// @include     http://www.sis001.com/*
// @version     1
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/10655/sislinksortByPostTime.user.js
// @updateURL https://update.greasyfork.org/scripts/10655/sislinksortByPostTime.meta.js
// ==/UserScript==

var links = document.getElementsByTagName('A')
for (var i = 0; i < links.length; i++) {
	var link = links[i];
	var href = link.href;
	if (href.indexOf('/forumdisplay.php?') >= 0) {
		if (href.indexOf('&orderby=') < 0) {
			href += '&orderby=dateline';
		}
		if (href.indexOf('&ascdesc=') < 0) {
			href += '&ascdesc=DESC';
		}
		if (link.href!=href) {
			link.href = href;
		}
	} else if (href.indexOf('/forum-') >= 0) {
		href = href.replace(/\/forum-(\d+)-(\d+)\.html/, "/forumdisplay.php?fid=$1&filter=0&orderby=dateline&ascdesc=DESC&page=$2")
		link.href = href;
	}
}