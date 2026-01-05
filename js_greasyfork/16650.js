// ==UserScript==
// @name          Remove Facebook Distractions
// @namespace     http://boris.joff3.com
// @description	  Remove Facebook news eed, trending topics, and activity ticker
// @author        borisjoffe
// @include       https://facebook.com/*
// @include       https://*.facebook.com/*
// @include       http://facebook.com/*
// @include       http://*.facebook.com/*
// @run-at        document-start
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/16650/Remove%20Facebook%20Distractions.user.js
// @updateURL https://update.greasyfork.org/scripts/16650/Remove%20Facebook%20Distractions.meta.js
// ==/UserScript==
(function() {var css = [
    '#stream_pagelet, #pagelet_trending_tags_and_topics, #pagelet_rhc_ticker { display: none }',
    '#pagelet_megaphone{ display: block }'
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
