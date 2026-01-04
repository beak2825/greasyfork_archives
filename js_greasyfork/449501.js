// ==UserScript==
// @name         WaniKani Open Framework Item Filter
// @namespace    waniKaniOpenFrameworkItemFilter
// @version      1.0
// @description  Companion script for the Item Filter script: registers an Open Framework filter that filters the items you selected with the Item Filter script.
// @author       Sinyaven
// @license      MIT-0
// @match        https://www.wanikani.com/*
// @grant        none
// @homepageURL  https://community.wanikani.com/t/54668
// @downloadURL https://update.greasyfork.org/scripts/449501/WaniKani%20Open%20Framework%20Item%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/449501/WaniKani%20Open%20Framework%20Item%20Filter.meta.js
// ==/UserScript==

(function() {
	"use strict";
	/* global wkof */
	/* eslint no-multi-spaces: off */

	if (!window.wkof) return;
	let filter = JSON.parse(localStorage.waniKaniItemFilter || `[]`);
	init();

	function init() {
		addEventListener(`storage`, e => {
			if (e.key === `waniKaniItemFilter`) filter = JSON.parse(e.newValue);
		});
		registerOpenFrameworkFilter();
	}

	async function registerOpenFrameworkFilter() {
		await wkof.ready(`ItemData.registry`);
		wkof.ItemData.registry.sources.wk_items.filters.itemFilter = {
			type: `checkbox`,
			label: `Item Filter`,
			default: true,
			filter_func: openFrameworkFilter,
			hover_tip: `The items you have marked with the Item Filter script for skipping during reviews`
		};
	}

	function openFrameworkFilter(filterValue, item) {
		return filterValue === filter.includes(item.id);
	}
})();
