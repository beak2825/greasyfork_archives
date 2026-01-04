// ==UserScript==
// @name         Trade Chat Spammer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Taking over Trade Chat. If you make a big deal, do send Microbes a gift!
// @author       Microbes
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485652/Trade%20Chat%20Spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/485652/Trade%20Chat%20Spammer.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let msg = "";
	startWaiting();

	function startWaiting() {
		waitForElementToExist('#chatRoot div[role="button"] svg path[fill="url(#public_trade-default)"]').then((elm) => {
			$('textarea[placeholder="Type your message here..."]').last().text(getLastMessage());

			$('textarea[placeholder="Type your message here..."]').last().keyup(function(e) {
				if (e.keyCode == 13 && msg) {
					localStorage.setItem(`tspammer_lastchat`, msg);
				} else {
					msg = $(e.currentTarget).val();
				}
			});

			$(elm).parent().parent().parent().parent().click(() => {
				startWaiting();
			});
		});
	}

	function getLastMessage() {
		return localStorage.getItem(`tspammer_lastchat`) || 'Trade Spammer Activaited! Send Microbes gifts!';
	}
})();

/* HELPERS */
function waitForElementToExist(selector) {
	return new Promise(resolve => {
		if (document.querySelector(selector)) {
			return resolve(document.querySelector(selector));
		}

		const observer = new MutationObserver(() => {
			if (document.querySelector(selector)) {
				resolve(document.querySelector(selector));
				observer.disconnect();
			}
		});

		observer.observe(document.body, {
			subtree: true,
			childList: true,
		});
	});
}