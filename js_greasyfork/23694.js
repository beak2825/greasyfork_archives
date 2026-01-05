// ==UserScript==
// @name          Inoreader (no ADs)
// @description	  Remove AD containers from Inoreader.
// @author        hellbiz
// @homepage      https://userstyles.org/styles/126319
// @include       http://inoreader.com/*
// @include       https://inoreader.com/*
// @include       http://*.inoreader.com/*
// @include       https://*.inoreader.com/*
// @run-at        document-start
// @version       1.0
// @namespace http://userstyles.org
// @downloadURL https://update.greasyfork.org/scripts/23694/Inoreader%20%28no%20ADs%29.user.js
// @updateURL https://update.greasyfork.org/scripts/23694/Inoreader%20%28no%20ADs%29.meta.js
// ==/UserScript==
(function() {var css = [
	".block_article_ad,",
	"  .ad_title,",
	"  .avs_iframe,",
	"  #sinner_container,",
	"  #all_gad_6125 {",
	"    display: none !important;",
	"  }",
	"  ",
	"  .reader_pane_sinner {",
	"    padding-right: 0 !important;",
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