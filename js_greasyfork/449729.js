// ==UserScript==
// @name         Restore old Library icon
// @version      1.0
// @description  Replaces the library icon with the old folder icon from 2019
// @author       Cat Bot
// @match        *://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @grant        none
// @license MIT
// @namespace    https://www.reddit.com/user/Cat_Bot4
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/449729/Restore%20old%20Library%20icon.user.js
// @updateURL https://update.greasyfork.org/scripts/449729/Restore%20old%20Library%20icon.meta.js
// ==/UserScript==
(function() {var css = [
	"/*right column*/",
	"  [d*=\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\"] {",
	"    d: path(\"M12,6.75 L10.2,5 L4.8,5 C3.81,5 3,5.7875 3,6.75 L3,17.25 C3,18.2125 3.81,19 4.8,19 L19.2,19 C20.19,19 21,18.2125 21,17.25 L21,8.5 C21,7.5375 20.19,6.75 19.2,6.75 L12,6.75 Z\")",
	"  }",
    "  [d*=\"M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z\"] {",
	"    d: path(\"M12,6.75 L10.2,5 L4.8,5 C3.81,5 3,5.7875 3,6.75 L3,17.25 C3,18.2125 3.81,19 4.8,19 L19.2,19 C20.19,19 21,18.2125 21,17.25 L21,8.5 C21,7.5375 20.19,6.75 19.2,6.75 L12,6.75 Z\")",
	"  }",
	"  [d*=\"M4,20h14v1H3V6h1V20z M21,3v15H6V3H21z M17,10.5L11,7v7L17,10.5z\"] {",
	"    d: path(\"M10,5l2,2h10v12H2V5H10\")",
	"  }",
    "  [d*=\"M11,7l6,3.5L11,14V7L11,7z M18,20H4V6H3v15h15V20z M21,18H6V3h15V18z M7,17h13V4H7V17z\"] {",
	"    d: path(\"M9.59,6l1.71,1.71L11.59,8H12h9v10H3V6H9.59 M10,5H2v14h20V7H12L10,5L10,5z\")",
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
		//
		document.documentElement.appendChild(node);
	}
}
})();