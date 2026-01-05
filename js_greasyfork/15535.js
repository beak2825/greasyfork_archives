// ==UserScript==
// @name          Sciences et Avenir Dark
// @namespace     http://userstyles.org
// @description	  Sciences et Avenir Dark/Bleu/Sombre/Lisible
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122227
// @include       http://www.sciencesetavenir.fr/*
// @include       https://www.sciencesetavenir.fr/*
// @include       http://*.www.sciencesetavenir.fr/*
// @include       https://*.www.sciencesetavenir.fr/*
// @run-at        document-start
// @version       0.20151222132715
// @downloadURL https://update.greasyfork.org/scripts/15535/Sciences%20et%20Avenir%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/15535/Sciences%20et%20Avenir%20Dark.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: #1e1e1e !important;",
	"    color: #fff !important;",
	"  }",
	"",
	"  /* defaults for all links */",
	"  a:link, a:visited, .link { color: #11357c !important; }",
	"  a:active, .link:active { color: #92CDFF !important; }",
	"",
	"  div,td {",
	"    background-color: #1e1e1e !important;",
	"    color: #82BDFF !important;",
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
