// ==UserScript==
// @name          Flashback Reklamfilter
// @namespace     http://userstyles.org
// @description	  Tar bort reklam på Flashback
// @author        epost72
// @homepage      http://userstyles.org/styles/31115
// @include	  http://www.flashback.org*
// @include	  http://flashback.org*
// @include	  https://www.flashback.org*
// @include	  https://flashback.org*
// @version 0.0.1.20140604193039
// @downloadURL https://update.greasyfork.org/scripts/2097/Flashback%20Reklamfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/2097/Flashback%20Reklamfilter.meta.js
// ==/UserScript==
(function() {
var css = "@namespace url(http://www.w3.org/1999/xhtml);.banner_text { \n    visibility: hidden !important; \n    width: 0 !important; \n    height: 0 !important; \n} \ndiv#top-news,\ndiv#top-banner, \ndiv#top-banner-container,\ndiv.fb_adsys_wrapper_TextAds, \ndiv#bottom-banner-container,\ndiv#site-right > a,\ndiv#site-right > div.banner-scroll,\ndiv#site-right > div.break,\ndiv#site-right > break,\ndiv#site-right > div { \n    display: none !important; \n} \n\ndiv#site-right > div.box-right:first-child { \n    display: block !important; \n}";
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		var node = document.createElement("style");
		node.type = "text/css";
		node.appendChild(document.createTextNode(css));
		heads[0].appendChild(node); 
	}
}
})();