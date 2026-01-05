// ==UserScript==
// @name        Github Recently Updated
// @namespace   http://github.com
// @description Makes Recently Updated default sort in Github
// @include     /^https?://github\.com/.*$/
// @exclude     /^https?://github\.com/.*/.*/issues/.*$/
// @exclude     /^https?://github\.com/.*/.*/pulls/.*$/
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/18721/Github%20Recently%20Updated.user.js
// @updateURL https://update.greasyfork.org/scripts/18721/Github%20Recently%20Updated.meta.js
// ==/UserScript==

function checkSetting(dest) {
	var newurl = new URL(dest);
	if (newurl.pathname.split("/").length != 4 || newurl.host != "github.com") {
		return dest;
	}
	
	var index = window.location.href.indexOf("?");
	var searchParams = "";
	if (index == -1) {
		searchParams = "sort:updated-desc";
	}
	else {
		searchParams = window.location.href.substring(index+3);
		
		var existing = window.location.href.match(/sort(:|%3A)(\w|-|%22)*/);
		if (existing !== null) {
			searchParams.replace(/sort(:|%3A)(\w|-|%22)*/, existing[0]);
		}
		else {	
			searchParams.replace(/sort(:|%3A)(\w|-|%22)*/, "sort:updated-desc");
		}
	}

	newurl.href = [newurl.protocol, '//', newurl.host, newurl.pathname].join('') + "?q=" + searchParams;
	return newurl.href;
}

function clickCB() {
	var hreff = window.location.href;
	
	//set callbacks again after page change, github uses websocket and normal page change doesn't happen when clicking links
	setTimeout(function() {
		if (hreff != window.location.href) {
			jQuery('a').click(clickCB);
			jQuery('a').hover(hoverCB);
		}
	}, 1000);
}

function hoverCB() {
	this.href = checkSetting(this.href);
}

jQuery('a').click(clickCB);
jQuery('a').hover(hoverCB);

var initial = checkSetting(window.location.href);
if (window.location.href != initial)
	window.location.href = initial;