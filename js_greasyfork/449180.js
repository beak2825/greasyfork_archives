// ==UserScript==
// @name          Youtube Logo Changer Gift/Png/Webp
// @description	  customize Your Youtube Logo To Something Cool
// @author        LGJA
// @license       MIT
// @match        https://*.youtube.com/*
// @match        https://*.youtube.com/watch?v=*
// @match        https://www.youtube.com/embed/*
// @match        *://www.youtube.com/watch?v=*
// @match        *://www.youtube.com
// @match        *://www.youtube.com/
// @match        *://www.youtube.com/watch*
// @match        /^http(s?)://[^/]*\.youtube(\.com)?(\.[a-z][a-z])?/.*$/
// @match        /^http(s?)://youtube(\.com)?(\.[a-z][a-z])?/.*$/
// @match        http://youtube.com/*
// @match        https://youtube.com/*
// @match        http://*.youtube.com/*
// @match        https://*.youtube.com/*
// @match        *://*.youtube.com/*
// @run-at        document-start
// @version       1
// @namespace https://greasyfork.org/users/915881
// @downloadURL https://update.greasyfork.org/scripts/449180/Youtube%20Logo%20Changer%20GiftPngWebp.user.js
// @updateURL https://update.greasyfork.org/scripts/449180/Youtube%20Logo%20Changer%20GiftPngWebp.meta.js
// ==/UserScript==

/*  NOTE, READ THIS !!!!!!!!!!!!!!!!!
there is two option light and dark theme
size is width and height,
Content: url(\"*\")   --- change the star to ur url, remember not to delete the \ and "
*/
(function() {var css = [
	"#logo-container .logo,",
	"	.footer-logo-icon,",
	"	#logo-icon,",
	"	#logo-icon-container {",
	"        width: 100px !important;",
	"        height: 44px !important;",
	"        margin-left: 0px;",
	"        margin-right: 0px;",
	"		content: url(\"https://www.gstatic.com/youtube/img/promos/growth/e627e007b3838086012608ef9370c211889f46b95b2335af722b53a2e49a0cd6_122x56.webp\") !important;",
	"	}",
	"	html[dark] #logo-icon,",
	"	html[dark] #logo-icon-container {",
	"        width: 100px !important;",
	"        height: 44px !important;",
	"		content: url(\"https://www.gstatic.com/youtube/img/promos/growth/e627e007b3838086012608ef9370c211889f46b95b2335af722b53a2e49a0cd6_122x56.webp\") !important;",
	"	}"
	].join("\n");
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	}
}
)();