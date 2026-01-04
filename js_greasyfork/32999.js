// ==UserScript==
// @name          Picarto Resize following thumbnails
// @namespace     http://userstyles.org
// @description	  Resizes thumbnails in the following sidebar on Picarto.tv.
// @author        JezuzX
// @homepage      https://userstyles.org/styles/147438
// @include       https://picarto.tv/explore/stream*
// @run-at        document-start
// @version       0.20210323175147
// @downloadURL https://update.greasyfork.org/scripts/32999/Picarto%20Resize%20following%20thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/32999/Picarto%20Resize%20following%20thumbnails.meta.js
// ==/UserScript==
(function() {var css = ".ant-tooltip-inner {width:440px !important; height:250px !important; padding: 3px 3px !important;}";
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