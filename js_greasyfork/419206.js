// ==UserScript==
// @name          Spinning 4chan Party Hats
// @description   This enhances party hats on 4chan by making party hats spin around.
// @author        iralakaelah
// @include       http*://*.4chan.org/*
// @include       http*://*.4channel.org/*
// @include       http*://4chan.org/*
// @include       http*://4channel.org/*
// @run-at        document-start
// @version       1.20
// @namespace     S4CPH
// @homepage      https://greasyfork.org/en/scripts/
// @downloadURL https://update.greasyfork.org/scripts/419206/Spinning%204chan%20Party%20Hats.user.js
// @updateURL https://update.greasyfork.org/scripts/419206/Spinning%204chan%20Party%20Hats.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (document.domain == "4chan.org" || document.domain.substring(document.domain.indexOf(".4chan.org") + 1) == "4chan.org") || (document.domain == "4channel.org" || document.domain.substring(document.domain.indexOf(".4channel.org") + 1) == "4channel.org"))
	css += [
		"@keyframes rotation {",
		" from {",
		"  transform: rotate(0deg) }",
		" to {",
		"  transform: rotate(359deg) }",
		"}"
		].join("\n");
	css += [
	"img[class=\"party-hat\"] {",
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
