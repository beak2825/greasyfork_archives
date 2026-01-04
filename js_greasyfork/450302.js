// ==UserScript==
// @name         Table Text Wrap
// @namespace    https://greasyfork.org/users/946844
// @version      0.1
// @description  Force Text Wrap on Wikipedia Episode Guide Tables.
// @author       S. O'Neill
// @match        *://*/*
// @license	 no license
// @downloadURL https://update.greasyfork.org/scripts/450302/Table%20Text%20Wrap.user.js
// @updateURL https://update.greasyfork.org/scripts/450302/Table%20Text%20Wrap.meta.js
// ==/UserScript==
(function() {var css = [
	"/* Wrapable cell",
	" * Add this class to make sure the text in a cell will wrap.",
        " * By default, data_table tds do not wrap.",
	" */",
	"",
	"@namespace html url(http://www.w3.org/1999/xhtml);",
	".content {word-break: break-word;}"
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