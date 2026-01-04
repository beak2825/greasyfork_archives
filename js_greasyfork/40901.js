// ==UserScript==
// @name          WaniKani Hide Stats During Review
// @namespace     http://alsanchez.es/
// @description	  Hides all stats except correct rate during a review session
// @include       https://www.wanikani.com/review/session
// @run-at        document-start
// @version       1
// @downloadURL https://update.greasyfork.org/scripts/40901/WaniKani%20Hide%20Stats%20During%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/40901/WaniKani%20Hide%20Stats%20During%20Review.meta.js
// ==/UserScript==
(function() {var css = [
	"div#stats span#available-count,",
	"div#stats .icon-inbox,",
	"div#stats .icon-ok,",
	"div#stats #completed-count,",
    "#wrap-up-countdown,",
	"div#reviews #progress-bar {",
	"    display: none !important;}"
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