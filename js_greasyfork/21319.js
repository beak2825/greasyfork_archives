// ==UserScript==
// @name         Youtube - Auto-expand Subscriptions
// @version      0.1.1
// @description  Auto expands your subscriptions, when using grid view, so that you do not miss out of any new videos because you forgot about the "show more" button.
// @author       Luxocracy
// @match        https://www.youtube.com/feed/subscriptions*
// @grant        none
// @namespace https://greasyfork.org/users/30239
// @downloadURL https://update.greasyfork.org/scripts/21319/Youtube%20-%20Auto-expand%20Subscriptions.user.js
// @updateURL https://update.greasyfork.org/scripts/21319/Youtube%20-%20Auto-expand%20Subscriptions.meta.js
// ==/UserScript==

(function() {
    'use strict';
	
    var sections = document.querySelectorAll('.item-section .yt-uix-expander-collapsed');
	for(var i=0; i < sections.length; i++) {
		sections[i].attributes.class.value = sections[i].attributes.class.value.replace('yt-uix-expander-collapsed', '');
	}
})();