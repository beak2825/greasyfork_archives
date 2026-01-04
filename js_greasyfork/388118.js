// ==UserScript==
// @name          Google Search in columns
// @namespace     http://userstyles.org
// @description	  This is a CSS that transform Google Search into multiple columns.
// @author        Crend King & Roxz
// @homepage      https://userstyles.org/styles/123849
// @include	http*://www.google.*.*/webhp?*
// @include	http*://www.google.*.*/search?*
// @include	http*://www.google.*.*/ig?*
// @include	http*://www.google.*.*/
// @include	http*://www.google.*.*/#*
// @include	http*://www.google.*/webhp?*
// @include	http*://www.google.*/search?*
// @include	http*://www.google.*/ig?*
// @include	http*://www.google.*/
// @include	http*://www.google.*/#*
// @include	https://encrypted.google.*/webhp?*
// @include	https://encrypted.google.*/search?*
// @include	https://encrypted.google.*/ig?*
// @include	https://encrypted.google.*/
// @include	https://encrypted.google.*/#*
// @run-at        document-start
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/388118/Google%20Search%20in%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/388118/Google%20Search%20in%20columns.meta.js
// ==/UserScript==
(function() {var css = [
	"/* columns  */",
	"",
	".big .mw,",
	".s {",
	"    max-width: unset !important;",
	"}",
	"",
	".col {   ",
	"    width: 100% !important;",
	"}",
	"",
	"#cnt .mw #center_col,",
	"#cnt .mw #foot {",
	"    width: 100% !important;",
	"}",
	"",
	"#center_col {",
	"    margin: auto !important;",
	"    padding: inherit !important;",
	"}",
	"",
	"/* entries */",
	"",
	".g {",
	"    padding: 0.667em !important;",
	"}",
	"",
	".srg {",
	"    display: flex !important;",
	"    flex-wrap: wrap !important;",
	"}",
    "",
	".mw {",
	"    width: 990em !important;",
    "    max-width: 130em !important;",
	"}",
	"",
	".srg > .g {",
	"    width: calc(100% / 3 - 2.333em) !important;",
	"    margin-left: 0.5em !important;",
	"    margin-right: 0.5em !important;",
	"    overflow: hidden !important;",
	"}",
	"",
	".rgsep {",
	"    display: none !important;",
	"}",
	"",
	"/* info box */",
	"",
	".vk_c,",
	".kp-blk {",
	"    margin: auto !important;",
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