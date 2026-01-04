// ==UserScript==
// @name          Keep your text-selection color the same on all websites.
// @description   Changes the background highlight color that is displayed, whenever you highlight text on any Web page.
// @author        dhaden, modifying an old Stylish userstyle from Ashish Bachavala
// @match         *://*/*
// @version       1.0
// @namespace https://greasyfork.org/users/186630
// @downloadURL https://update.greasyfork.org/scripts/427457/Keep%20your%20text-selection%20color%20the%20same%20on%20all%20websites.user.js
// @updateURL https://update.greasyfork.org/scripts/427457/Keep%20your%20text-selection%20color%20the%20same%20on%20all%20websites.meta.js
// ==/UserScript==
(function() {var css = [
	"::selection {",
	"    background: #0073e6;",
	"    color: #ffffff;",
	"    text-decoration: none;",
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