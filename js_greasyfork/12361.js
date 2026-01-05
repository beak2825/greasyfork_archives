// ==UserScript==
// @name         Limegreen external links
// @description  Highlight all external links in lime green, works on dynamically added content too.
// @include      *
// @namespace    wOxxOm.scripts
// @author       wOxxOm
// @version      1.0.2
// @license      MIT License
// @grant        GM_addStyle
// @run-at       document-start
// @require      https://greasyfork.org/scripts/12228/code/setMutationHandler.js
// @downloadURL https://update.greasyfork.org/scripts/12361/Limegreen%20external%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/12361/Limegreen%20external%20links.meta.js
// ==/UserScript==

GM_addStyle(
	'a.external_link_wOxxOm:link {background-color: rgba(133,255,0,0.7) !important; color:black!important}'+
	'a.external_link_wOxxOm:visited {background-color: rgba(191,255,0,0.7) !important; color:black!important}'
);
setMutationHandler(document, 'a[href*="//"]', function(nodes) {
	var hostname = new URL(location.href).hostname;
	nodes.forEach(function(n) {
		if (new URL(n.href).hostname != hostname)
			n.classList.add('external_link_wOxxOm');
	});
	return true;
});
