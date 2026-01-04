// ==UserScript==
// @name         WaniKani Homophone Explorer
// @namespace    waniKaniHomophoneExplorer
// @version      0.19
// @description  For every vocabulary item, it lists all other vocabulary items with the same reading.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @match        https://preview.wanikani.com/*
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1673042
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445376/WaniKani%20Homophone%20Explorer.user.js
// @updateURL https://update.greasyfork.org/scripts/445376/WaniKani%20Homophone%20Explorer.meta.js
// ==/UserScript==

(async function() {
    'use strict';
	/* global wkof, wkItemInfo */

	wkof.include(`ItemData`);
	await wkof.ready(`ItemData`);
	let items = await wkof.ItemData.get_items({wk_items: {filters: {item_type: `voc`}}});
	let byReading = wkof.ItemData.get_index(items, `reading`);
	wkItemInfo.forType(`vocabulary`).under(`reading`).appendSideInfo(`Homophones`, o => {
		return o.reading.flatMap(r => byReading[r] ?? []).filter(i => i.id !== o.id).flatMap((i, idx) => {
			let result = [];
			if (idx !== 0) result.push(`, `);
			let link = document.createElement(`a`);
			link.href = i.data.document_url;
			link.target = `_blank`;
			link.textContent = i.data.characters;
			result.push(link);
			return result;
		});
	});
})();
