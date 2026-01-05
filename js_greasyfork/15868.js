// ==UserScript==
// @name           Single Line Scrollbars
// @author         Cameron Bernhardt (AstroCB)
// @description Fixes appearance of single-line code blocks so that OS X's scrollbars don't block the text within
// @namespace http://github.com/AstroCB
// @version        1.0
// @include        http://*.stackexchange.com/*
// @include        http://stackoverflow.com/*
// @include        http://meta.stackoverflow.com/*
// @include        http://serverfault.com/*
// @include        http://meta.serverfault.com/*
// @include        http://superuser.com/*
// @include        http://meta.superuser.com/*
// @include        http://askubuntu.com/*
// @include        http://meta.askubuntu.com/*
// @include        http://stackapps.com/*
// @downloadURL https://update.greasyfork.org/scripts/15868/Single%20Line%20Scrollbars.user.js
// @updateURL https://update.greasyfork.org/scripts/15868/Single%20Line%20Scrollbars.meta.js
// ==/UserScript==
var codeBlocks = document.getElementsByTagName("code");

for (var i = 0; i < codeBlocks.length; i++) {
	console.log(codeBlocks[i].textContent.split("\n"));
	if (codeBlocks[i].textContent.split("\n").length < 3) { // No newlines
		codeBlocks[i].setAttribute("style", "line-height: 35px;");
	}
}