// ==UserScript==
// @name          addition to "no baners.aionlegend.im"
// @namespace     http://userstyles.org
// @description	  an additional lock is unnecessary for <a href="https://userstyles.org/styles/163648/no-baners-aionlegend">no baners.aionlegend.im</a>
// @author        ANDRAON
// @homepage      https://greasyfork.org/ru/scripts/394250-addition-to-no-baners-aionlegend-im
// @include       http://aionlegend.im/*
// @include       https://aionlegend.im/*
// @include       http://*.aionlegend.im/*
// @include       https://*.aionlegend.im/*
// @run-at        document-start
// @version       0.20200105082239
// @downloadURL https://update.greasyfork.org/scripts/394250/addition%20to%20%22no%20banersaionlegendim%22.user.js
// @updateURL https://update.greasyfork.org/scripts/394250/addition%20to%20%22no%20banersaionlegendim%22.meta.js
// ==/UserScript==
(function() {var css = "[id^=dodi],[id^=dosu],[src*=cord],[id*=am_w],[id*=vk_],[src*=vk_],[class*=en-s]{display:none!important;}";
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