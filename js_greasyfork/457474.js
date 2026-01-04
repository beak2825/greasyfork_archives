// ==UserScript==
// @name          cf-no-snowflakes
// @namespace     https://codeforces.com
// @homepage      https://greasyfork.org/scripts/457474-cf-no-snowflakes
// @description	  codeforces no snowflakes
// @author        Davidasx
// @include       https://codeforces.com/*
// @run-at        document-start
// @version       1.2.3
// @downloadURL https://update.greasyfork.org/scripts/457474/cf-no-snowflakes.user.js
// @updateURL https://update.greasyfork.org/scripts/457474/cf-no-snowflakes.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    background:url(..) !important;",
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
