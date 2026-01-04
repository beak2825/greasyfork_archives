// ==UserScript==
// @name        Tinder Deblur
// @namespace   Violentmonkey Scripts
// @match       https://tinder.com/*
// @grant       none
// @version     1.4
// @author      Tajnymag
// @license MIT
// @description Simple script using the official Tinder API to get clean photos of the users who liked you
// @downloadURL https://update.greasyfork.org/scripts/472841/Tinder%20Deblur.user.js
// @updateURL https://update.greasyfork.org/scripts/472841/Tinder%20Deblur.meta.js
// ==/UserScript==

async function unblur() {
	const teasers = await fetch('https://api.gotinder.com/v2/fast-match/teasers', {
		headers: { 'X-Auth-Token': localStorage.getItem('TinderWeb/APIToken') },
	})
		.then((res) => res.json())
		.then((res) => res.data.results);
	const teaserEls = document.querySelectorAll('.Expand.enterAnimationContainer > div:nth-child(1)');

	for (let i = 0; i < teaserEls.length; ++i) {
		const teaser = teasers[i];
		const teaserEl = teaserEls[i];

		const teaserImage = teaser.user.photos[0].url;

		teaserEl.style.backgroundImage = `url(${teaserImage})`;
	}
}

if (typeof GM_info === 'undefined') {
	console.warn(
		'[TINDER DEBLUR]: The only supported way of running this script is through a userscript management browser addons like Violentmonkey, Tampermonkey or Greasemonkey!'
	);
	console.warn(
		'[TINDER DEBLUR]: Script was not terminated, but you should really look into the correct way of running it.'
	);
}

console.warn('[TINDER DEBLUR]: This version has been deprecated. Please see https://github.com/tajnymag/tinder-deblur');

setInterval(() => {
	if (['/app/likes-you', '/app/gold-home'].includes(location.pathname)) {
		unblur();
	}
}, 5000);