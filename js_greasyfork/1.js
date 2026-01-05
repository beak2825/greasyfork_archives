// ==UserScript==
// @name          Greasemonkey/Tampermonkey/Violentmonkey test style
// @namespace     http://userstyles.org
// @description	  If you install this and all text turns red, then things are working.
// @author        JasonBarnabe
// @homepage      http://greasyfork.org/scripts/1
// @run-at        document-start
// @version       20231121.2
// @include       *
// @downloadURL https://update.greasyfork.org/scripts/1/GreasemonkeyTampermonkeyViolentmonkey%20test%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/1/GreasemonkeyTampermonkeyViolentmonkey%20test%20style.meta.js
// ==/UserScript==
(function() {
var css = "*{ color: #F00 !important; }";
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