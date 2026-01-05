// ==UserScript==
// @name           Comment Separator Fix
// @author         Cameron Bernhardt (AstroCB)
// @version        3.1.0
// @namespace https://github.com/AstroCB
// @description  Fixes new SE comment separator to fit the existing style
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
// @downloadURL https://update.greasyfork.org/scripts/3642/Comment%20Separator%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/3642/Comment%20Separator%20Fix.meta.js
// ==/UserScript==

function fix() {
	var separators = document.getElementsByClassName("js-link-separator");
	for (var i = 0; i < separators.length; i++) {
		if (separators[i].className === "js-link-separator dno") {
			separators[i].style.visibility = "hidden";
		} else {
			separators[i].style.visiblity = "visible";
		}
		separators[i].className += "lsep ";
		separators[i].innerHTML = "|";
	}
}

fix();

var observer = new MutationObserver(fix);
observer.observe(document.getElementsByTagName("body")[0], {
	attributes: true,
	childList: true,
	characterData: true
});