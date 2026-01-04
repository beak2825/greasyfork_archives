// ==UserScript==
// @name          Facebook Mobile - Fixed Header
// @namespace     https://facebook.com/bremaya2
// @description	  Facebook Mobile With Fixed Header
// @author        bremaya
// @homepage      https://greasyfork.org/pt-BR/users/186203-bremaya
// @include       http://m.facebook.com/*
// @include       https://m.facebook.com/*
// @include       http://*.m.facebook.com/*
// @include       https://*.m.facebook.com/*
// @include       http://touch.facebook.com/*
// @include       https://touch.facebook.com/*
// @include       http://mobile.facebook.com/*
// @include       https://mobile.facebook.com/*
// @icon          https://brandlogos.net/wp-content/uploads/2021/04/facebook-icon-768x768.png


//
// @run-at        document-start
// @version       0.20220518020400
// @downloadURL https://update.greasyfork.org/scripts/443878/Facebook%20Mobile%20-%20Fixed%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/443878/Facebook%20Mobile%20-%20Fixed%20Header.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	"#header {",
	"   position: fixed !important;",
	"   margin-top: -2px !important;",
    "   z-index: 99;",
	"}",
	"",
	"#root {",
	"   margin-top: 78px !important;",
	"}"
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
