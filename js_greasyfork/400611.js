// ==UserScript==
// @name           no baners.aion.mmotop
// @namespace      http://userstyles.org
// @description:en Lock some advertising
// @author         ANDRAON
// @homepage       https://greasyfork.org/ru/scripts/400611-no-baners-aion-mmotop
// @include        http://aion.mmotop.ru/*
// @include        https://aion.mmotop.ru/*
// @include        http://*.aion.mmotop.ru/*
// @include        https://*.aion.mmotop.ru/*
// @run-at         document-start
// @version        0.20200408164233
// @description Lock some advertising
// @downloadURL https://update.greasyfork.org/scripts/400611/no%20banersaionmmotop.user.js
// @updateURL https://update.greasyfork.org/scripts/400611/no%20banersaionmmotop.meta.js
// ==/UserScript==
(function() {var css = "[id*=oyy],[href*=mya]{display:none!important;}.fon-ref{background: url(https://img2.goodfon.ru/original/2560x1024/e/45/aion-tower-of-eternity-krylya.jpg)no-repeat;background-size:cover}[class*=\"1 js-menu-m\"],[class*=\"ar n\"]{opacity:0.8;}";
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