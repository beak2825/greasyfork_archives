// ==UserScript==
// @name          Better Rutor UI
// @namespace     http://userstyles.org
// @description	  Some UI improvements for Rutor
// @author        al3xantr
// @homepage      https://userstyles.org/styles/160017
// @include       http://rutor.info/*
// @include       https://rutor.info/*
// @include       http://*.rutor.info/*
// @include       https://*.rutor.info/*
// @include       http://rutor.is/*
// @include       https://rutor.is/*
// @include       http://*.rutor.is/*
// @include       https://*.rutor.is/*
// @run-at        document-start
// @version       0.20180516091434
// @downloadURL https://update.greasyfork.org/scripts/439671/Better%20Rutor%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/439671/Better%20Rutor%20UI.meta.js
// ==/UserScript==
(function() {var css = [
	"#content > center > h1 {",
	"    color: gray !important;",
	"    font-size: 12px !important;",
	"}",
	"#download a {",
	"    text-decoration: none !important;",
	"}",
	"#download a.d_small, #download a:hover {",
	"    text-decoration: underline !important;",
	"}",
	"a:visited {",
	"    color: gray !important;",
	"}",
	"h1 {",
	"    color: black !important;",
	"    font-size: 20pt !important;",
	"    margin-left: 15px !important;",
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
