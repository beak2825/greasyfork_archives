// ==UserScript==
// @name            blogtruyen.com clear ads
// @icon            http://fs5.directupload.net/images/170509/d2i6dsu7.png
// @description	    Clear ads
// @homepage        userstyles.org/styles/137625
// @author          David Roland
// @include         http*://blogtruyen.com/*
// @include         http*://*.blogtruyen.com/*
// @run-at          document-start
// @namespace       https://greasyfork.org/users/112442

// @version 0.0.1.20170509053058
// @downloadURL https://update.greasyfork.org/scripts/29527/blogtruyencom%20clear%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/29527/blogtruyencom%20clear%20ads.meta.js
// ==/UserScript==
(function() {var css = [
	"body {background: url(http://fs5.directupload.net/images/170411/9shdtbtn.png) fixed center !important; cursor: default; }",
	"  #banner,",
	"  #mbtfloat,",
	"  #__admvnlb_modal_container,",
	"  #topbanner,",
	"  #wrapper > section.main-content > div > div.col-md-8 > section > center,",
	"	#wrapper > section.main-content > div > div > section > div.detail > em > center,",
	"  .qc-css {",
	"      display: none !important;",
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
