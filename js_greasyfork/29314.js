// ==UserScript==
// @name          Chrome new Tab borderless
// @namespace     https://greasyfork.org
// @description	  Chrome new Tab borderless Theme
// @author        kirnbauer
// @include       /^https?:\/\/www\.google\.(com|[a-z]{2})(\.[a-z]{2})?/_/chrome/newtab.*/
// @run-at        document-start
// @version       0.20160229081006
// @downloadURL https://update.greasyfork.org/scripts/29314/Chrome%20new%20Tab%20borderless.user.js
// @updateURL https://update.greasyfork.org/scripts/29314/Chrome%20new%20Tab%20borderless.meta.js
// ==/UserScript==
(function() {var css = "";

	css += [
		"#most-visited { display: none !important; }"
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