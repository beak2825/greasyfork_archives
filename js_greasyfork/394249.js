// ==UserScript==
// @name          no baners.aionlegend
// @namespace     http://userstyles.org
// @description	  Lock some advertising
// @author        ANDRAON
// @homepage      https://greasyfork.org/ru/scripts/394249-no-baners-aionlegend
// @include       http://aionlegend.im/*
// @include       https://aionlegend.im/*
// @include       http://*.aionlegend.im/*
// @include       https://*.aionlegend.im/*
// @run-at        document-start
// @version       0.20200105085456
// @downloadURL https://update.greasyfork.org/scripts/394249/no%20banersaionlegend.user.js
// @updateURL https://update.greasyfork.org/scripts/394249/no%20banersaionlegend.meta.js
// ==/UserScript==
(function() {var css = "#notes,#advertur,#promo_wh,[id^=main_],[id*=ads]{display:none!important;}";
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
