// ==UserScript==
// @name           E-H Colour Conversion
// @description    Gives E-Hentai the Exhentai colour scheme.
// @author         Hen Tie
// @homepage       https://hen-tie.tumblr.com/
// @namespace      https://greasyfork.org/en/users/8336
// @include        /https://(.*\.)?e-hentai.org.*/
// @exclude        https://forums.e-hentai.org/*
// @grant          none
// @icon           https://i.imgur.com/pMMVGRx.png
// @version        1.6
// @downloadURL https://update.greasyfork.org/scripts/375031/E-H%20Colour%20Conversion.user.js
// @updateURL https://update.greasyfork.org/scripts/375031/E-H%20Colour%20Conversion.meta.js
// ==/UserScript==

var ehCss = 'https://e-hentai.org/z/0347/g.css';
var exCss = 'https://exhentai.org/z/0347/x.css';

var addStyle = (function() {
	var style = document.createElement("style");
	style.setAttribute('data-jqstyle','ehColourConversion');
	style.appendChild(document.createTextNode("")); // WebKit hack
	document.head.appendChild(style);
	return style.sheet;
})();
function addLink(url, name) {
	var link = document.createElement('link');
	link.type = 'text/css';
	link.rel = 'stylesheet';
	link.href = url;
	if (name !== "undefined") {
		link.setAttribute('data-jqlink', name);
	}
	document.head.appendChild(link);
}
function removeLink(url) {
	if (document.querySelector('link[href="' + url + '"]')) {
		document.querySelectorAll('link[href="' + url + '"]')[0].disabled = true;
	}
}
function inlineStyle(selector, css) {
	if (document.querySelector(selector)) {
		document.querySelector(selector).style.cssText += ';' + css;
	}
}

addLink(exCss, "ehColourConversion");
removeLink(ehCss);

// bounty pages
addStyle.insertRule('.stuffbox #x {background: none; border-color: #000;}');
// events
addStyle.insertRule('#eventpane {background: #4f535b !important; border-color: #000 !important;}');
// E-H MiniMenu script compatibility
addStyle.insertRule('.nav-submenu {background: #34353b !important; border: 2px solid #8d8d8d !important;}');