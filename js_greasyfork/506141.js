// ==UserScript==
// @name           Discord Uncompressed Stickers Redirect
// @namespace      https://github.com/w4tchdoge
// @version        1.0.0-20240901_025615
// @description    Redirects sticker URLs to the uncompressed cdn.discordapp.com PNG URL
// @author         w4tchdoge
// @homepage       https://github.com/w4tchdoge/MISC-UserScripts
// @match          *://media.discordapp.net/*
// @run-at         document-start
// @license        AGPL-3.0-or-later
// @history        1.0.0 — initial commit
// @downloadURL https://update.greasyfork.org/scripts/506141/Discord%20Uncompressed%20Stickers%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/506141/Discord%20Uncompressed%20Stickers%20Redirect.meta.js
// ==/UserScript==

(function () {
	`use strict`;

	const current_url = new URL(window.location);

	let params = new URLSearchParams(current_url.search);
	const media_type = current_url.pathname.split(`/`).filter(n => n.length > 0).at(0);

	const sticker_params = {
		size: `4096`,
		quality: `lossless`
	};

	if (media_type == `stickers`) {

		const URLPath = (new URL(current_url.pathname, `https://cdn.discordapp.com`)).toString().replace(/\.webp/i, `.png`);

		// console.log(sticker_params, URLPath);

		Object.entries(sticker_params).forEach(([key, value], index, array) => {
			// console.log(`Key #${index} is ${key}\nValue #${index} is ${value}`);
			params.set(key, value);
			return;
			if (params.has(key, value)) {
				// console.log(`URLSearchParams object contains key-val pair ${index + 1}`);
				return;
			} else {
				// console.log(`URLSearchParams object DOES NOT contains key-val pair ${index + 1}`);
				return;
			}
		});

		let new_URL = new URL(`${URLPath}?${params}`);

		// console.log(new_URL.href);

		window.open(new_URL, `_self`);

	}

})();
