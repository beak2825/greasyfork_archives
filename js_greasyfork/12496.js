// ==UserScript==
// @name          19B4's Sidebar Replacement Script
// @version       2015.09.16
// @namespace     http://19B4.kinja.com/sidechat
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
// @grant					none
// @downloadURL https://update.greasyfork.org/scripts/12496/19B4%27s%20Sidebar%20Replacement%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/12496/19B4%27s%20Sidebar%20Replacement%20Script.meta.js
// ==/UserScript==
var elmExtra = document.getElementById('js_leftrailmodule--trending');
elmExtra.innerHTML = 'HTML CODE GOES HERE';
(function() {var css = [
	".pe_newlayout .sidebar {",
	"padding: 0px !important;",
	"}",
	".pe_newlayout .sidebar__content {",
	"max-width:100% !important;",
	"}",
	".sidebar-module, .leftrailmodule {",
	"padding-top: 80px !important;",
	"}",
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