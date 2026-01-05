// ==UserScript==
// @name          Mr Mondialisation Dark
// @namespace     http://userstyles.org
// @description	  Mr Mondialisation Dark...
// @author        Jean-Lol Kikou
// @homepage      https://userstyles.org/styles/122224
// @include       http://mrmondialisation.org/*
// @include       https://mrmondialisation.org/*
// @include       http://*.mrmondialisation.org/*
// @include       https://*.mrmondialisation.org/*
// @run-at        document-start
// @version       0.20151222124228
// @downloadURL https://update.greasyfork.org/scripts/15539/Mr%20Mondialisation%20Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/15539/Mr%20Mondialisation%20Dark.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background: #1e1e1e !important;",
	"    color: #fff !important;",
	"  }",
	"",
	"  /* defaults for all links */",
	"  a:link, a:visited, .link { color: #286b30 !important; }",
	"  a:active, .link:active { color: #16631f !important; }",
	"",
	"  div,td {",
	"    background-color: #1e1e1e !important;",
	"    color: #92CDFF !important;",
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
