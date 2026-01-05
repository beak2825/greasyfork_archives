    // ==UserScript==
    // @namespace     http://userstyles.org
// @name          lash's Improved Kinja Layout Script
// @version       2015.11.7.1
// @description	  Works on Gawker, Jezebel, Jalopnik, Kotaku, io9, Gizmodo, Lifehacker and Deadspin
// @author        Austin "lash" Williamson
// @homepage      http://19B4.kinja.com/
// @include       http://gawker.com/*
// @include       https://gawker.com/*
// @include       http://*.gawker.com/*
// @include       https://*.gawker.com/*
// @include       http://jezebel.com/*
// @include       https://jezebel.com/*
// @include       http://*.jezebel.com/*
// @include       https://*.jezebel.com/*
// @include       http://jalopnik.com/*
// @include       https://jalopnik.com/*
// @include       http://*.jalopnik.com/*
// @include       https://*.jalopnik.com/*
// @include       http://kotaku.com/*
// @include       https://kotaku.com/*
// @include       http://*.kotaku.com/*
// @include       https://*.kotaku.com/*
// @include       http://io9.com/*
// @include       https://io9.com/*
// @include       http://*.io9.com/*
// @include       https://*.io9.com/*
// @include       http://gizmodo.kinja.com/*
// @include       https://gizmodo.kinja.com/*
// @include       http://*.gizmodo.kinja.com/*
// @include       https://*.gizmodo.kinja.com/*
// @include       http://gizmodo.com/*
// @include       https://gizmodo.com/*
// @include       http://*.gizmodo.com/*
// @include       https://*.gizmodo.com/*
// @include       http://lifehacker.com/*
// @include       https://lifehacker.com/*
// @include       http://*.lifehacker.com/*
// @include       https://*.lifehacker.com/*
// @include       http://deadspin.com/*
// @include       https://deadspin.com/*
// @include       http://*.deadspin.com/*
// @include       https://*.deadspin.com/*
// @include       http://kinja.com/*
// @include       https://kinja.com/*
// @include       http://*.kinja.com/*
// @include       https://*.kinja.com/*
// @run-at        document-start
// @grant					 none
// @downloadURL https://update.greasyfork.org/scripts/12214/lash%27s%20Improved%20Kinja%20Layout%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12214/lash%27s%20Improved%20Kinja%20Layout%20Script.meta.js
// ==/UserScript==
(function() {var css = [
"head, body {",
"font-size: 10pt !important;",
"}",
"",
".pe_newlayout .post .marquee-asset img {",
"height: auto !important;",
"width: 25% !important;",
"clear: both;",
"float: left;",
"}",
"",
"",
".large-12, .medium-9, .medium-6 {",
"width: 70% !important;",
"float:left;",
"}",
"",
".ad-unit, .site-footer {",
"display:none;",
"}",
"",
".playIcon, .video-thumb-play .play-icon {",
"width: 74px;",
"height: 74px;",
"float: left;",
"clear: both;",
"top: 30px;",
"left: 60px;",
"}",
"",
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
}
)();