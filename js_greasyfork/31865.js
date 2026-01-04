// ==UserScript==
// @name Better Standalone Image
// @version 0.1.1
// @description Make standalone image display better
// @license MIT
// @author eight04 <eight04@gmail.com>
// @homepageURL https://github.com/eight04/better-standalone-image
// @supportURL https://github.com/eight04/better-standalone-image/issues
// @namespace eight04.blogspot.com
// @include *
// @run-at document-start
// @grant GM_getResourceURL
// @grant GM_getResourceText
// @grant GM_addStyle
// @resource style https://rawgit.com/eight04/better-standalone-image/5097ca904ed82b7342afc68272e072d3218a96da/better-standalone-image.user.css
// @compatible firefox Greasemonkey 3
// @compatible chrome Tampermonkey
// @downloadURL https://update.greasyfork.org/scripts/31865/Better%20Standalone%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/31865/Better%20Standalone%20Image.meta.js
// ==/UserScript==

(function() {
	if (!document.contentType.startsWith("image")) return;
	
	if (document.contentType == "image/svg+xml") {
		const s = document.documentElement.style;
		s.background = `
			linear-gradient(
				45deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .25) 25%,
				transparent 25%, transparent 75%, rgba(0, 0, 0, .25) 75%
			),
			linear-gradient(
				45deg, rgba(0, 0, 0, .25), rgba(0, 0, 0, .25) 25%,
				transparent 25%, transparent 75%, rgba(0, 0, 0, .25) 75%
			),
			#222
		`;
		s.backgroundPosition = "0 0, 8px 8px";
		s.backgroundSize = "16px 16px";
		
		s.position = "absolute";
		s.top = "0";
		s.right = "0";
		s.bottom = "0";
		s.left = "0";
		s.margin = "auto";
		
		s.boxShadow = "0 0 10px 10px rgba(0, 0, 0, .4)";
	} else {
		if (GM_info.scriptHandler == "Tampermonkey") {
			// Use GM_addStyle to bypass CSP in tampermonkey
			GM_addStyle(GM_getResourceText("style"));
		} else {
			// Use extension protocol to bypass CSP in greasemonkey
			const link = document.createElement("link");
			link.href = GM_getResourceURL("style");
			link.rel = "stylesheet";
			document.documentElement.appendChild(link);
		}
	}
})();
