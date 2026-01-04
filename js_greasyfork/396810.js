// ==UserScript==
// @name          Fix code + use browser fonts
// @description	  The default skin on the Beyonwiz forums results in text being rendered with fonts that are hard to read. This style fixes this problem by using the fonts defined in browser preferences. It also fixes an issue with [code] blocks not being formatted correctly.
// @namespace     https://greasyfork.org
// @author        peteru
// @include       http://beyonwiz.com.au/*
// @include       https://beyonwiz.com.au/*
// @include       http://*.beyonwiz.com.au/*
// @include       https://*.beyonwiz.com.au/*
// @run-at        document-start
// @version       2020.02.24.1456
// @downloadURL https://update.greasyfork.org/scripts/396810/Fix%20code%20%2B%20use%20browser%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/396810/Fix%20code%20%2B%20use%20browser%20fonts.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	".content, .content p { font-family: sans-serif ! important }",
	"code { font-family: monospace ! important; white-space: pre ! important; max-height: unset ! important; }",
	".codebox, .inputbox { font-family: monospace ! important; max-height: unset ! important; }",
	".wrap { font-family: sans-serif ! important ; max-width: 128em ! important; width: 98%; }"
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
