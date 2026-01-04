// ==UserScript==
// @name          dA: Rainbow Llama
// @namespace     http://userstyles.org
// @description	  Adds an extra badge to every profile and group you see. <p>Credit to ginkgografix for the original code. <p>This has been made with permission from her. <p>Find the original userscript here: http://fav.me/d2mw8a8 <p>See it on dA here: http://wintercool612.deviantart.com/art/Screenshot-badges-of-deviantart-deviantart-com-201-694256112
// @author        Kaius Coolman
// @homepage      https://userstyles.org/styles/144379
// @include       http://deviantart.com/*
// @include       https://deviantart.com/*
// @include       http://*.deviantart.com/*
// @include       https://*.deviantart.com/*
// @run-at        document-start
// @version       0.20170813052911
// @downloadURL https://update.greasyfork.org/scripts/370376/dA%3A%20Rainbow%20Llama.user.js
// @updateURL https://update.greasyfork.org/scripts/370376/dA%3A%20Rainbow%20Llama.meta.js
// ==/UserScript==
(function() {var css = [
	"@namespace url(http://www.w3.org/1999/xhtml);",
	".gruz-badgeholder",
	"  {",
	"    margin: 3px 0 0 0;",
	"    padding: 2px 19px 0 0!important;",
	"    background: url(https://orig03.deviantart.net/a760/f/2017/173/0/9/llama_proud_by_wintercool612-dbdo8ip.gif) top right no-repeat !important;",
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
