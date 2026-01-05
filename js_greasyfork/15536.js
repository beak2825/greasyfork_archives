// ==UserScript==
// @name          Firefox Marketplace Dark
// @namespace     http://userstyles.org
// @description	  Firefox Marketplace Dark/Sombre/purple
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122229
// @include       http://marketplace.firefox.com/*
// @include       https://marketplace.firefox.com/*
// @include       http://*.marketplace.firefox.com/*
// @include       https://*.marketplace.firefox.com/*
// @run-at        document-start
// @version       0.20151222134358
// @downloadURL https://update.greasyfork.org/scripts/15536/Firefox%20Marketplace%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/15536/Firefox%20Marketplace%20Dark.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: #253960 !important;",
	"    color: #7A3675 !important;",
	"  }",
	"",
	"  /* defaults for all links */",
	"  a:link, a:visited, .link { color: #471e70 !important; }",
	"  a:active, .link:active { color: #7A3675 !important; }",
	"",
	"  div,td {",
	"    background-color: #3f3f3f !important;",
	"    color: #471e70 !important;",
	"  }"
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
