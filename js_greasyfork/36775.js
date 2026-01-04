// ==UserScript==
// @name          Remove Stories from Instagram
// @namespace     http://instagram.com
// @description	  Just removes the recently added stories from desktop Instagram
// @homepage      https://greasyfork.org/fr/scripts/36775-remove-stories-from-instagram
// @homepageURL   https://gist.github.com/Okaido53/0bb3ddfc9150a138378c6be334974294
// @supportURL    https://help.instagram.com/
// @contributionURL https://www.paypal.com/
// @icon          https://icons.duckduckgo.com/ip3/www.instagram.com.ico
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include       http://instagram.com/*
// @include       https://instagram.com/*
// @include       http://*.instagram.com/*
// @include       https://*.instagram.com/*
// @run-at        document-start
// @version       1
// @grant         none
// @grant         unsafeWindow
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_addStyle
// @grant         GM_getResourceText
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @noframes
// @copyright     Okaïdo53
// @author        Okaïdo53
// @Secure        Okaïdo53
// @compatible    firefox
// @compatible    chrome
// @compatible    opera
// @compatible    Safari
// @license       GPL v3
// @downloadURL https://update.greasyfork.org/scripts/36775/Remove%20Stories%20from%20Instagram.user.js
// @updateURL https://update.greasyfork.org/scripts/36775/Remove%20Stories%20from%20Instagram.meta.js
// ==/UserScript==

(function() {var css = [
	"._11dqz{",
	"        display:none;",
	"    }",
	"    ._d4oao{",
	"        float:none;",
	" 	margin:0 auto;   ",
	"    }"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();

(function() {var css = [
	"video::-webkit-media-controls-panel {",
	"	opacity: 0 !important;",
	"	display: -webkit-flex !important;",
	"	z-index: 10000 !important;",
	"}",
	"video::-webkit-media-controls-panel:hover {",
	"	opacity: 1 !important;",
	"}"
].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();