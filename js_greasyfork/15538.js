// ==UserScript==
// @name          Courrier International Dark
// @namespace     http://userstyles.org
// @description	  Courrier International Dark...
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122225
// @include       http://www.courrierinternational.com/*
// @include       https://www.courrierinternational.com/*
// @include       http://*.www.courrierinternational.com/*
// @include       https://*.www.courrierinternational.com/*
// @run-at        document-start
// @version       0.20151222125649
// @downloadURL https://update.greasyfork.org/scripts/15538/Courrier%20International%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/15538/Courrier%20International%20Dark.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: #1e1e1e !important;",
	"    color: #008C7D !important;",
	"  }",
	"",
	"  /* defaults for all links */",
	"  a:link, a:visited, .link { color: #82BDFF !important; }",
	"  a:active, .link:active { color: #92CDFF !important; }",
	"",
	"  div,td {",
	"    background-color: #1e1e1e !important;",
	"    color: #008C7D !important;",
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
