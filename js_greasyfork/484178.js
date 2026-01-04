// ==UserScript==
// @name          No More Collapsed Google Contacts Details
// @version       1.0.2
// @description   Stop hiding Google Contacts details under collapsed sections
// @namespace     http://userscripts.org/users/377329
// @author        Jonathan Brochu (http://userscripts.org/users/377329)
// @license       GPLv3 or later (http://www.gnu.org/licenses/gpl-3.0.en.html)
// @match         https://contacts.google.com/person/*
// @include       /^https:\/\/contacts\.google\.com\/u\/[1-9][0-9]*\/person\/.+$/
// @icon          https://ssl.gstatic.com/images/branding/product/2x/contacts_2022_64dp.png
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/484178/No%20More%20Collapsed%20Google%20Contacts%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/484178/No%20More%20Collapsed%20Google%20Contacts%20Details.meta.js
// ==/UserScript==

/***
 * History:
 *
 * 1.0.2  Change made:
 *        - Added an @include rule to also match contact detail pages on
 *          secondary Google account sessions.
 *        NOTE: For now, only targets English locales. Feel free to suggest
 *              additional ones, or else you can always fork this script to
 *              include new ones.
 *        (2024-01-07)
 * 1.0.1  Changes made:
 *        - Simplified payload code.
 *        - Now keeping the DOM listener live instead of disabling it.
 *        (2023-08-20)
 * 1.0.0  First release. (2023-08-19)
 *
 */

(function() {
	'use strict';

	// constants
	var USERSCRIPT_NAME = 'Don\'t Collapse Google Contacts Details',
		// Change values below to reflect your active Google Contacts UI language
		L_EXPAND_MORE = 'More',
		L_COLLAPSE_LESS = 'Less';

	// reference some outside objects
	var console = window.console || (function() {
		if (typeof(unsafeWindow) == 'undefined') return { 'log': function() {} };
		return unsafeWindow.console;
	})();

	// Polyfills, just in case
	// - document.getElementById()
	document.getElementById||(document.getElementById=function(a){for(var b=1<arguments.length?arguments[1]:document.documentElement,c=[b];c.length;){var d=c.shift();if(d.id===a)return d;d.children.length&&(c=c.concat(Array.prototype.slice.call(d.children)))}});
	// - document.querySelectorAll()
	//     eslint-disable-next-line
	document.querySelectorAll||(document.querySelectorAll=function(e){var t,n=document.createElement("style"),o=[];for(document.documentElement.firstChild.appendChild(n),document._qsa=[],n.styleSheet.cssText=e+"{x-qsa:expression(document._qsa && document._qsa.push(this))}",window.scrollBy(0,0),n.parentNode.removeChild(n);document._qsa.length;)(t=document._qsa.shift()).style.removeAttribute("x-qsa"),o.push(t);return document._qsa=null,o}),document.querySelector||(document.querySelector=function(e){e=document.querySelectorAll(e);return e.length?e[0]:null});

	// DOM helpers: $(), $$() & $1st()
	var $ = function(id) {
		return document.getElementById(id);
	}, $$ = function(selector /*, rootEl */) {
		return (arguments.length > 1 && arguments[1] && arguments[1].nodeType == 1
				? arguments[1]
				: document
			).querySelectorAll(selector);
	}, $1st = function(selector /*, rootEl */) {
		return (arguments.length > 1 && arguments[1] && arguments[1].nodeType == 1
				? arguments[1]
				: document
			).querySelector(selector);
	};
	// Shorthand to delete an element
	var deleteElem = function(el) {
		if (el instanceof HTMLElement && el.parentNode) {
			el.parentNode.removeChild(el);
			return true;
		}
		return false;
	};

	// DOM changes listener
	// Source: https://stackoverflow.com/a/14570614/3865919
	var observeDOM = (function() {

		var EVT_DOM_INSERT = 'DOMNodeInserted',
			EVT_DOM_REMOVED = 'DOMNodeRemoved',
			MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

		return function(callback /*, rootElement */) {
			if (typeof callback !== 'function') return;
			var rootElement =
				(arguments.length > 1 && arguments[1] && arguments[1].nodeType == 1
				 ? arguments[1]
				 : document.documentElement);
			if (MutationObserver) {
				// Define a new observer
				var muObserver = new MutationObserver(callback);
				// Start observing changes
				muObserver.observe(rootElement, { childList: true, subtree: true });
				return muObserver.disconnect;
			} else if (window.addEventListener) { // Fallback
				rootElement.addEventListener(EVT_DOM_INSERT, callback, false);
				rootElement.addEventListener(EVT_DOM_REMOVED, callback, false);
				return function() {
					rootElement.removeEventListener(EVT_DOM_INSERT, callback, false);
					rootElement.removeEventListener(EVT_DOM_REMOVED, callback, false);
				};
			} else throw new Error('[' + USERSCRIPT_NAME + '] Creating of a DOM listener failed');
		}
	})();

	var payloadFn,
		cancelFn,
		timeoutID,
		timeoutDelay = 500,
		loaded;

	console.log('[' + USERSCRIPT_NAME + '] Installing listener for DOM updates, waiting until they cease.');

	// Install a DOM listener, since contact details are loaded asynchronously,
	//  to notify us once DOM changes have ceased
	cancelFn = observeDOM(function(muLst) {
		if (timeoutID) {
			clearTimeout(timeoutID);
		}
		timeoutID = setTimeout(payloadFn, timeoutDelay);
	});

	// Our page mods
	payloadFn = function() {
		// Check if we have [More]/[Less] link containers, indicating collapsed sections
		var elCtnr,
			elBtn;
		while (elCtnr = $1st('div.iy8V6c')) {
			elBtn = $1st('button', elCtnr);
			if (elBtn.textContent == L_EXPAND_MORE) {
				if (!(loaded=(loaded !== undefined))) console.log('[' + USERSCRIPT_NAME + '] Page has finished loading, applying mods.');
				// Activate the [More] link and delete its container
				elBtn.click();
				deleteElem(elCtnr);
			} else if (elBtn.textContent == L_COLLAPSE_LESS) {
				// Remove the [Less] link and its container
				deleteElem(elCtnr);
				// Stop observing DOM change events
				///cancelFn();
				// ... or not
			}
		}
	};
})();