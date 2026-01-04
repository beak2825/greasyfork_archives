// ==UserScript==
// @name        GOG Don't Giveaway Consent - Marketing, Promotions
// @namespace   https://greasyfork.org/en/users/12605-alja%C5%BE-kozina
// @author      12605-alja%C5%BE-kozina
// @originalAuthor      TheDcoder@protonmail.com
// @license     GPLv3
// @match       *://www.gog.com/*
// @run-at      document-start
// @grant       GM_notification
// @grant       GM_openInTab
// @version     1.3
// @description Revoke consent for sharing data with third-parties when claiming a giveaway
// @downloadURL https://update.greasyfork.org/scripts/506642/GOG%20Don%27t%20Giveaway%20Consent%20-%20Marketing%2C%20Promotions.user.js
// @updateURL https://update.greasyfork.org/scripts/506642/GOG%20Don%27t%20Giveaway%20Consent%20-%20Marketing%2C%20Promotions.meta.js
// ==/UserScript==

main();

function main() {
	// Check if it is the front-page
	if(!['', 'en', 'de', 'fr', 'pl', 'ru', 'zh'].some(x => '/' + x == window.location.pathname)) return;

	// Inform the user if a giveaway is present
	window.addEventListener('load', inform_user);

	// Monkey-patch to intercept the claim request
	const RealXMLHttpRequest = {open: unsafeWindow.XMLHttpRequest.prototype.open};
	unsafeWindow.XMLHttpRequest.prototype.open = function monkey(method, url, ...args) {
		// Hook onto the result if's for a claim
		var path = new URL(url, window.location.href).pathname.slice(1).split('/');
		if (path.every((x, i) => x == ['giveaway', 'claim'][i])) {
			this.addEventListener("load", revoke);
			// Remove the monkey as we don't need it anymore
			unsafeWindow.XMLHttpRequest.prototype.open = RealXMLHttpRequest.open;
		}

		// Perform the real call
		return RealXMLHttpRequest.open.call(this, method, url, ...args);
	}

	function revoke() {
		revoke_consent().then(x => {
			GM_notification({
				title: "GOG Giveaway Consent - Marketing communications through Trusted Partners’ services",
				text: "A request to revoke your consent to sharing data has been sent! Click to check settings.",
				onclick: () => GM_openInTab('https://www.gog.com/en/account/settings/subscriptions', false),
			});
		}).catch(e => {
			GM_notification({
				title: "GOG Giveaway Consent - Marketing communications through Trusted Partners’ services",
				text: "Failed to revoke consent, please revoke it manually in your subscription settings! Error: " + e,
			});
		});
		revoke_consent2().then(x => {
			GM_notification({
				title: "GOG Giveaway Consent - Promotions and hot deals",
				text: "A request to revoke your consent to sharing data has been sent! Click to check settings.",
				onclick: () => GM_openInTab('https://www.gog.com/en/account/settings/subscriptions', false),
			});
		}).catch(e => {
			GM_notification({
				title: "GOG Giveaway Consent - Promotions and hot deals",
				text: "Failed to revoke consent, please revoke it manually in your subscription settings! Error: " + e,
			});
		});
	}
}

function inform_user() {
	var button = document.querySelector('.giveaway-banner__button');
	if (!button) return;
	GM_notification({
		title: "GOG Giveaway Consent",
		text: "Giveaway detected! GOG wants your consent to share data if you claim the game, but this script will revoke it almost immediately.",
	});
}

async function revoke_consent() {
	var result = await fetch(
		"/account/save_newsletter_subscription/5353f0f4-3c06-11ee-b0fc-fa163ec9fc5f/0", {
		"credentials": "include",
		"referrer": "https://www.gog.com/en/account/settings/subscriptions",
		"method": "POST",
		"mode": "cors",
	});
	result = await result.json();
	if (result.status === true) {
		return true;
	} else {
		throw result;
	}
}

async function revoke_consent2() {
	var result = await fetch(
		"/account/save_newsletter_subscription/6c689b94-18f1-11ea-9c45-00163e4e09cc/0", {
		"credentials": "include",
		"referrer": "https://www.gog.com/en/account/settings/subscriptions",
		"method": "POST",
		"mode": "cors",
	});
	result = await result.json();
	if (result.status === true) {
		return true;
	} else {
		throw result;
	}
}
