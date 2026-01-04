// ==UserScript==
// @name           RES: Remove Reddit Gallery Link from RES Expando
// @namespace      https://github.com/w4tchdoge
// @version        1.0.1-20240824_162813
// @description    Removes the `https://www.reddit.com/gallery/*` link that is on images for the redditgallery expando
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://www.reddit.com/r/*/comments/*
// @match          *://old.reddit.com/r/*/comments/*
// @license        AGPL-3.0-or-later
// @history        1.0.1 — Fix userscript not working because the expando needs to be opened first before it can do it's thing
// @history        1.0.0 — initial commit
// @downloadURL https://update.greasyfork.org/scripts/504953/RES%3A%20Remove%20Reddit%20Gallery%20Link%20from%20RES%20Expando.user.js
// @updateURL https://update.greasyfork.org/scripts/504953/RES%3A%20Remove%20Reddit%20Gallery%20Link%20from%20RES%20Expando.meta.js
// ==/UserScript==

(async function () {
	`use strict`;

	// from https://stackoverflow.com/a/61511955/11750206
	function waitForElm(selector, search_root = document) {
		return new Promise(resolve => {
			if (search_root.querySelector(selector)) {
				return resolve(search_root.querySelector(selector));
			}

			const observer = new MutationObserver(mutations => {
				if (search_root.querySelector(selector)) {
					observer.disconnect();
					resolve(search_root.querySelector(selector));
				}
			});

			// If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
			observer.observe(document.documentElement, {
				childList: true,
				subtree: true
			});
		});
	}

	const expando_box = await waitForElm(`div.res-expando-box[data-host="redditgallery"]`);

	const MutationObserverConfig = { attributes: false, childList: true, subtree: true };
	const MutationObserverCallback = (mutationList, observer) => {

		Array.from(expando_box.querySelectorAll(`div.res-gallery > div.res-gallery-pieces div.res-media-independent > div > a.res-expando-link`)).forEach((element) => {
			// console.log(element.getAttribute(`href`));
			element.removeAttribute(`href`);
		});

		observer.disconnect();
	};

	const expando_observer = new MutationObserver(MutationObserverCallback);
	expando_observer.observe(expando_box, MutationObserverConfig);

})();