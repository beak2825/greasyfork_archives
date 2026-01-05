// ==UserScript==
// @name          LA CASSE MYSTERIEUSE sombre et bleu
// @namespace     http://userstyles.org
// @description	  De Nicolas Fürstenberger
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122238
// @include       http://www.nicolasfurstenberger.net/*
// @include       https://www.nicolasfurstenberger.net/*
// @include       http://*.www.nicolasfurstenberger.net/*
// @include       https://*.www.nicolasfurstenberger.net/*
// @run-at        document-start
// @version       0.20151222170549
// @downloadURL https://update.greasyfork.org/scripts/15537/LA%20CASSE%20MYSTERIEUSE%20sombre%20et%20bleu.user.js
// @updateURL https://update.greasyfork.org/scripts/15537/LA%20CASSE%20MYSTERIEUSE%20sombre%20et%20bleu.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: #1e1e1e !important;",
	"    color: #fff !important;",
	"  }",
	"",
	"  /* defaults for all links */",
	"  a:link, a:visited, .link { color: #00b1ed !important; }",
	"  a:active, .link:active { color: #00b1ed !important; }",
	"",
	"  div,td {",
	"    background-color: #1e1e1e !important;",
	"    color: #00b1ed !important;",
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
