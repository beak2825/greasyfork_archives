// ==UserScript==
// @name          Politics and War - Arial Font & 14px Font Size
// @namespace     http://userstyles.org
// @description	  Changes the font from Roboto to Arial.
// @author        Empiur
// @homepage      https://userstyles.org/styles/194115
// @include       http://politicsandwar.com/*
// @include       https://politicsandwar.com/*
// @include       http://*.politicsandwar.com/*
// @include       https://*.politicsandwar.com/*
// @run-at        document-start
// @version       0.20201210041843
// @downloadURL https://update.greasyfork.org/scripts/419634/Politics%20and%20War%20-%20Arial%20Font%20%2014px%20Font%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/419634/Politics%20and%20War%20-%20Arial%20Font%20%2014px%20Font%20Size.meta.js
// ==/UserScript==
(function() {var css = [
	"body {",
	"    font-family:Arial, sans-serif;",
	"    font-size:14px;",
	"    line-height:1.42857143;",
	"    color:#333;",
	"    background-color:#fff",
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
