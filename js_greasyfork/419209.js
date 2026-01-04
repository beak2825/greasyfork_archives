// ==UserScript==
// @name          Spinning 420chan Thumbnails & Icons
// @description   This enhances 420chan by making thumbnails and some other elements spin around.
// @author        iralakaelah
// @include       http*://*.420chan.org/*
// @include       http*://420chan.org/*
// @run-at        document-start
// @version       1.20
// @namespace     S4CTN
// @homepage      https://greasyfork.org/en/scripts/
// @downloadURL https://update.greasyfork.org/scripts/419209/Spinning%20420chan%20Thumbnails%20%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/419209/Spinning%20420chan%20Thumbnails%20%20Icons.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (document.domain == "boards.420chan.org" || document.domain.substring(document.domain.indexOf(".boards.420chan.org") + 1) == "boards.420chan.org") || (document.domain == "420chan.org" || document.domain.substring(document.domain.indexOf(".420chan.org") + 1) == "420chan.org"))
	css += [
		"@keyframes rotation {",
		" from {",
		"  transform: rotate(0deg) }",
		" to {",
		"  transform: rotate(359deg) }",
		"}"
		].join("\n");
	css += [
	"img[class=\"thumb\"], img[id=\"nj\"], img[class=\"board_icon\"], img[alt=\"Home\"], img[class=\"boardicon\"] {",
	" animation: rotation 0.5s infinite linear;",
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
