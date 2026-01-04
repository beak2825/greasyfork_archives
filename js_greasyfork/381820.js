// ==UserScript==
// @name          iKnow! Study Streak be gone!
// @namespace     http://userstyles.org
// @description	  It's quite demotivating when you break a study streak. This hides the display of study streak on iKnow (SRS).
// @author        LetItGoal
// @homepage      https://userstyles.org/styles/104659
// @include       http://iknow.jp/*
// @include       https://iknow.jp/*
// @run-at        document-start
// @version       0.20140825084001
// @downloadURL https://update.greasyfork.org/scripts/381820/iKnow%21%20Study%20Streak%20be%20gone%21.user.js
// @updateURL https://update.greasyfork.org/scripts/381820/iKnow%21%20Study%20Streak%20be%20gone%21.meta.js
// ==/UserScript==
(function() {var css = [
	".study-streak {",
	"    display: none;",
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
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();
