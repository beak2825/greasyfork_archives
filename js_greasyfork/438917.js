// ==UserScript==
// @name        Twitter - Silence CryptoBros
// @namespace   https://github.com/jerone/UserScripts
// @description Hide CryptoBros messages from twitter
// @author       ATAlgaba
// @copyright   2022+, IhToN(https://github.com/ihton)
// @license     CC-BY-NC-SA-4.0; https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
// @license     GPL-3.0-or-later; http://www.gnu.org/licenses/gpl-3.0.txt
// @homepage    https://github.com/ihton
// @homepageURL https://github.com/ihton
// @contributionURL https://www.paypal.me/IhToN
// @include     *://twitter.com/*
// @version     0.1.0
// @esversion   6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/438917/Twitter%20-%20Silence%20CryptoBros.user.js
// @updateURL https://update.greasyfork.org/scripts/438917/Twitter%20-%20Silence%20CryptoBros.meta.js
// ==/UserScript==


/* jshint esversion: 6 */

(function() {
	var settingsKey = "us_twitter_silence_cryptobros";
	var dataAttribute = "data-crytpbro-hidden";
	
	function silenceCryptoBros() {
		// tweets timeline;
		var timeline = document.querySelectorAll('[role="region"] > div > div')[0];
		// console.log("Timeline:", timeline);
		if (!timeline) return;
		
		var settingSaved = !!~~localStorage.getItem(settingsKey, +true);

		// toggle visibility;
		var toggle = function(hide, init) {
			window.setTimeout(function() {
				Array.from(document.querySelectorAll('article div'))
				.filter(div => !div.getAttribute(dataAttribute) && div.style.clipPath && div.style.clipPath.includes('#hex-hw-shapeclip-clipconfig'))
				.forEach(div => {
					div.setAttribute(dataAttribute, true);
					div.closest('article').style.display = 'none';
				})
			});
		};


		// new tweets are loaded, handle accourdanly;
		new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				toggle(!!~~localStorage.getItem(settingsKey, +true));
			});
		}).observe(timeline, { childList: true });

		// load previous state;
		toggle(settingSaved, true);
	}
	
	function observePrimaryColumnChanges() {
		// console.log("Observe:", document.querySelectorAll('[data-testid="primaryColumn"]')[0]);
		new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				silenceCryptoBros()
			});
		}).observe(document.querySelectorAll('[data-testid="primaryColumn"]')[0], { childList: true });
	}

	// todo: use observers to automagically remove this shit
	window.setTimeout(function() {
		console.log("Time to shut the hell up from CryptoBros!");
		silenceCryptoBros();
		// observePrimaryColumnChanges();
		
		setInterval(() => {
			silenceCryptoBros();
		}, 10000);
	}, 5000);

	console.log("Silence CryptoBros has been loaded!");

})();