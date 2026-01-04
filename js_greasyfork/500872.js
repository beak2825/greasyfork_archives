// ==UserScript==
// @name          FF - focus outline
// @namespace     http://userstyles.org
// @version       2024.07.23.0412
// @description	  slight modification of Bright Focus (for buttons, links, and textboxes)
// @author        hg42
// @license       MIT
// @match         *://*/*
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/500872/FF%20-%20focus%20outline.user.js
// @updateURL https://update.greasyfork.org/scripts/500872/FF%20-%20focus%20outline.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"",
	"body a:hover:active",
	"  {",
	"  color: #9999FF66;",
	"  }",
	"",
	"body *:focus",
	"  {",
	"  outline: 2px solid #9999FF66 !important;",
	"  outline-offset: -2px !important;",
	"  -moz-outline-radius: 4px !important;",
	"  }",
	"",
	"body a:focus",
	"  {",
	"  outline-offset: -2px !important;",
	"  }",
	"",
	"body button:focus,",
	"body input[type=reset]:focus,",
	"body input[type=button]:focus,",
	"body input[type=submit]:focus",
	"  {",
	"  -moz-outline-radius: 4px !important;",
	"  }",
	"",
	"body textarea:focus,",
	"body button:focus,",
	"body select:focus,",
	"body input:focus",
	"  {",
	"  outline-offset: -2px !important;",
	"  }",
	"",
	"/* ::-moz-focus:inner {} */"
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