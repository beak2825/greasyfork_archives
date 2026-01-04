// ==UserScript==
// @name          Google Contacts - Remove Sticky Headers in Contact Details
// @version       1.0.0
// @description   Reverts the header portion of a contact details' page to 'static' so that it scrolls away
// @namespace     http://userscripts.org/users/377329
// @author        Jonathan Brochu (http://userscripts.org/users/377329)
// @license       GPLv3 or later (http://www.gnu.org/licenses/gpl-3.0.en.html)
// @match         https://contacts.google.com/person/*
// @include       /^https:\/\/contacts\.google\.com\/u\/[1-9][0-9]*\/person\/.+$/
// @icon          https://ssl.gstatic.com/images/branding/product/2x/contacts_2022_64dp.png
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/484179/Google%20Contacts%20-%20Remove%20Sticky%20Headers%20in%20Contact%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/484179/Google%20Contacts%20-%20Remove%20Sticky%20Headers%20in%20Contact%20Details.meta.js
// ==/UserScript==

/***
 * History:
 *
 * 1.0.0  First public release. (2024-01-07)
 *
 */

(function() {
	'use strict';

	// constants
	var USERSCRIPT_NAME = 'Google Contacts - Remove Sticky Headers in Contact Details';

/*
 * The Tools
 */

	// reference some outside objects
	var console = window.console || (function() {
		if (typeof(unsafeWindow) == 'undefined') return { 'log': function() {} };
		return unsafeWindow.console;
	})();

	// self-explanatory
	document.addStyle = function(css /*, media */) {
		var media = (arguments.length > 1 ? arguments[1] : false);
		if (typeof(GM_addStyle) != 'undefined' && !media) {
			GM_addStyle(css);
			return true;
		} else {
			if (!media) { media = 'all'; }
			var heads = this.getElementsByTagName('head');
			if (heads.length > 0) {
				var node = this.createElement('style');
				node.type = 'text/css';
				if (media) node.media = media;
				if (node.appendChild(this.createTextNode(css))) {
					return (typeof heads[0].appendChild(node) != 'undefined');
				}
			}
			return false;
		}
	};

/*
 * The Payload
 */

	// css definitions
	var css_allmedia =
			'@namespace url(http://www.w3.org/1999/xhtml);\n' +
		'/* Contact Details */\n' +
			// 2024-01-07: Revert contact detail headers to 'static' instead of 'sticky'
			'.FGgXHc {\n' +
			'    position: static !important;\n' +
			'}\n' +
			// <<end>>
			'';

/*
 * The Action
 */

	// css injection
	document.addStyle(css_allmedia);

/*
 * The End
 */

	console.info('User script "' + USERSCRIPT_NAME + '" has completed on page "' + location.href + '".');
})();