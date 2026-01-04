// ==UserScript==
// @name        Hentai login unlocker
// @namespace   https://sleazyfork.org/users/581142
// @license     agpl-3.0-only
// @include     /^https?:\/{2}(?:(?:(?:im|n)hentai|comicporn)\.x{3}|hentai(?:e(?:ra|nvy)|zap|rox)\.com)\//
// @grant       none
// @version     1.0.3
// @description Bypasses login requirements for commonly indexed hentai/nsfw comic sites.
// @downloadURL https://update.greasyfork.org/scripts/530046/Hentai%20login%20unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/530046/Hentai%20login%20unlocker.meta.js
// ==/UserScript==
// jshint esversion: 11

const split = globalThis.String.prototype.split
globalThis.String.prototype.split = function (separator, limit) {
	const out = split.call(this, separator, limit)

	if (out[0] === 'not_logged')
		out[0] = 'success'

	return out
}

for (const filter of globalThis.document.querySelectorAll('.filtered, .a_filtered, .filtered_reader, .blacklisted, .blacklisted_reader')) {
	filter.className = undefined
	filter.classList = globalThis.document.body.classList

	if (globalThis.location.hostname === 'nhentai.xxx')
		for (const child of filter.children)
			if (child.nodeName === 'IMG')
				child.src = child.attributes.getNamedItem('data-src').value
}

if (globalThis.location.hostname === 'hentairox.com')
	(async () => {
		await $.ready
		const keydowns = $._data(document, 'events').keydown.filter(i => i.guid !== 21)
		$(document).off('keydown')
		for (const keydown of keydowns)
			$(document).keydown(keydown.handler)
	})()