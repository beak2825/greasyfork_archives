// ==UserScript==
// @name        Literotica Fixer
// @namespace   hell@hell.hell
// @description depaginates literotica stories and removes CSS
// @include     https://www.literotica.com/s/*
// @include     https://literotica.com/s/*
// @version     1
// @grant       none
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/374316/Literotica%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/374316/Literotica%20Fixer.meta.js
// ==/UserScript==

var divCount = 1;
var pages = Number($(".b-pager-caption-t").text().split(" ")[0]);
var i = pages - 1;
function litFix() {
	if (window.location.toString().includes("?") === false) {
	window.location = window.location + "?page=" + pages;
	}
	if (pages > 1) {
		$(".b-story-body-x").prepend("<br>");
		$(".b-story-body-x").prepend("<div></div>");
		$(".b-story-body-x > div:nth-child("+divCount+")").load(window.location.toString().split("=")[0] + "=" + i +" .b-story-body-x");
		i--;
		while (i > 0) {
			litFix();
		}
	}
	$(".b-pager").remove();
}

function removeCSS() {
	for (var i = document.styleSheets.length - 1; i >= 0; i--) {
		document.styleSheets[i].disabled = true;
	}
}

litFix();
removeCSS();
