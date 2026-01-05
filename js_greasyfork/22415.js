// ==UserScript==
// @name         Remove outbound-url and href-url from reddit links
// @namespace    https://greasyfork.org/users/649
// @version      1.0.1
// @description  Probably useless for most people, but it was causing me a bunch of issues
// @author       Adrien Pyke
// @match        *://*.reddit.com/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22415/Remove%20outbound-url%20and%20href-url%20from%20reddit%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/22415/Remove%20outbound-url%20and%20href-url%20from%20reddit%20links.meta.js
// ==/UserScript==

(function() {
	'use strict';

	waitForElems('a', function(link) {
		if (link.dataset.hrefUrl) {
			link.dataset.hrefUrl = link.href;
		}
		if (link.dataset.outboundUrl) {
			link.dataset.outboundUrl = link.href;
		}
	});
})();