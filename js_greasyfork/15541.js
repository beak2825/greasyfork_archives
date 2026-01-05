// ==UserScript==
// @name          La Boîte Verte Dark
// @namespace     http://userstyles.org
// @description	  LA Boîte VERTE dark / THE green BOX sombre
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122184
// @include       http://www.laboiteverte.fr/*
// @include       https://www.laboiteverte.fr/*
// @include       http://*.www.laboiteverte.fr/*
// @include       https://*.www.laboiteverte.fr/*
// @run-at        document-start
// @version       0.20151221182000
// @downloadURL https://update.greasyfork.org/scripts/15541/La%20Bo%C3%AEte%20Verte%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/15541/La%20Bo%C3%AEte%20Verte%20Dark.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: #1e1e1e !important;",
	"    color: #fff !important;",
	"  }",
	"",
	"  /* defaults for all links */",
	"  a:link, a:visited, .link { color: #1e1e1e !important; }",
	"  a:active, .link:active { color: #1e1e1e !important; }",
	"",
	"  div,td {",
	"    background-color: #1e1e1e !important;",
	"    color: #03a52e !important;",
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
