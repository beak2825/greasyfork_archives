// ==UserScript==
// @name         Youtube Link Fix for addons/scripts
// @namespace    http://www.youtube.com/
// @version      0.7
// @description  [Works in FF and Chrome!] changes youtube links to refresh whole page, so other scripts will work.
// @author       William H
// @include      *youtube.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/11576/Youtube%20Link%20Fix%20for%20addonsscripts.user.js
// @updateURL https://update.greasyfork.org/scripts/11576/Youtube%20Link%20Fix%20for%20addonsscripts.meta.js
// ==/UserScript==


window.addEventListener("load", convertMyLinks($('a[class*="spf-link"]')), false);
if(document.readyState == "complete"){
	convertMyLinks($('a[class*="spf-link"]'));
}

function convertMyLinks(elemArray) {
	for (i = 0; i < elemArray.length; i += 1) {
		$(elemArray[i]).attr("href", elemArray[i].href).removeAttr('data-sessionlink').removeAttr('rel').attr('class', $(elemArray[i]).attr('class').split(" spf-link ")[0]);
	}
}