// ==UserScript==
// @name        Gmail - Add Row Highlights
// @namespace   http://tampermonkey.net/
// @description	Highlights the letter rows in the new Gmail when you hover over them with the mouse cursor.
// @author      you
// @run-at      document-start
// @include     https://mail.google.com/mail/u/*
// @version 0.0.1.20170201131936
// @downloadURL https://update.greasyfork.org/scripts/26980/Gmail%20-%20Add%20Row%20Highlights.user.js
// @updateURL https://update.greasyfork.org/scripts/26980/Gmail%20-%20Add%20Row%20Highlights.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml); ",
	"table.zt tr.yO:hover { background-color: rgb(255,235,134) !important;} ",
	"table.zt tr.zE:hover { background-color: rgb(205,243,159) !important;}"
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