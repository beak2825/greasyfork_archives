// ==UserScript==
// @name DealabsLinks
// @author noname120
// @namespace HandyUserscripts
// @description Liens sur Dealabs en clair
// @version 0.0.3
// @license Creative Commons BY-NC-SA

// @include http*://*dealabs.com/*

// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/18320/DealabsLinks.user.js
// @updateURL https://update.greasyfork.org/scripts/18320/DealabsLinks.meta.js
// ==/UserScript==


var links = document.getElementsByClassName('link_a_reduce');
for (var i=0, max=links.length; i < max; i++) {
		var target = links[i].getAttribute('title');
		// Si ce n'est pas un lien, alors le lien est le texte lui-même (lien trop court donc non réduit)
		if (!/http/.test(target)) {
				target = links[i].innerHTML;
		}
		links[i].setAttribute('href', target);
}