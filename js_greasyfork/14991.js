// ==UserScript==
// @name        Kinja -- Two Column Comment Layout
// @namespace   two-column-kinja
// @description Two Column Comments Display
// @version     1
// @grant       none
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
// @downloadURL https://update.greasyfork.org/scripts/14991/Kinja%20--%20Two%20Column%20Comment%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/14991/Kinja%20--%20Two%20Column%20Comment%20Layout.meta.js
// ==/UserScript==
(function() {var css = [
"ul.commentlist--depth-0 {",
  "columns: 2;",
"-webkit-columns: 2;",
"-moz-columns: 2;",
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