// ==UserScript==
// @name          Le Monde (lemonde.fr) - Sombre/Dark
// @namespace     http://userstyles.org
// @description	  Zen.
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122137
// @include       http://www.lemonde.fr/*
// @include       https://www.lemonde.fr/*
// @include       http://*.www.lemonde.fr/*
// @include       https://*.www.lemonde.fr/*
// @run-at        document-start
// @version       0.20151222154019
// @downloadURL https://update.greasyfork.org/scripts/15542/Le%20Monde%20%28lemondefr%29%20-%20SombreDark.user.js
// @updateURL https://update.greasyfork.org/scripts/15542/Le%20Monde%20%28lemondefr%29%20-%20SombreDark.meta.js
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
