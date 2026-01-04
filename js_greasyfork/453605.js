// ==UserScript==
// @name          90's Kid and Scene Kid Banner
// @namespace     https://greasyfork.org/en
// @description	  a banner featuring two of my favorite ADs, 90's Kid and Scene Kid!
// @author        mxpercy
// @match       http://www.goatlings.com/*
// @match       https://www.goatlings.com/*
// @match       http://*.www.goatlings.com/*
// @match       https://*.www.goatlings.com/*
// @run-at        document-start
// @version       1.01
// @downloadURL https://update.greasyfork.org/scripts/453605/90%27s%20Kid%20and%20Scene%20Kid%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/453605/90%27s%20Kid%20and%20Scene%20Kid%20Banner.meta.js
// ==/UserScript==
(function() {var css = [
	"body",
	"  #header img[src*=\"GoatlingsHeader.jpg\"]",
	"  {",
	"    width: 0px;",
	"    height: 0px;",
	"    padding-left: 940px;",
	"    padding-top: 125px;",
	"    background: url(\"https://i.imgur.com/uWvenTz.png\") top left no-repeat !important;",
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
