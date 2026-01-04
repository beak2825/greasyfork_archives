// ==UserScript==
// @name        Ao3 - Stats
// @namespace   Ao3
// @match       *://archiveofourown.org/*
// @grant       none
// @version     0.0.1
// @author      Matthew Chai
// @description Adds stats to title cards.
// @downloadURL https://update.greasyfork.org/scripts/541264/Ao3%20-%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/541264/Ao3%20-%20Stats.meta.js
// ==/UserScript==

(function() {

	'use strict';

	function dataFromStats(s) {
		const output = {};
		const size = s.children.length/2;
		const children = Array.from(s.children);
		for (let i = 0; i < size; i++) {
			const key = children[i*2].className;
			const value_element = children[i*2 + 1];
			const sub_element = value_element.querySelector("a");
			const contains_sub_element = sub_element !== null;
			const value = contains_sub_element ? sub_element.innerHTML : value_element.innerHTML;
			output[key] = value;
		}
		return output;
	}

	function main() {
		const main_div = document.getElementById("main");
		const card_list = main_div.querySelector("ol.work.index.group");
		const formatter = Intl.NumberFormat(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2});
		for (const card of card_list.children) {
			const stats = card.querySelector("dl.stats");
			const data = dataFromStats(stats);
			if ("kudos" in data && "hits" in data) {
				const kudos = parseFloat(data.kudos.replaceAll(",", ""));
				const hits = parseFloat(data.hits.replaceAll(",", ""));
				const kudos_per_thousand_hits = (kudos*1000)/hits;
				const title = document.createElement("dt");
				title.className = "kudos-per-thousand-hits";
				title.innerHTML = "Kudos per 1000 Hits:";
				stats.appendChild(title);
				const li = document.createElement("dl");
				li.className = "kudos-per-thousand-hits";
				li.innerHTML = formatter.format(kudos_per_thousand_hits);
				stats.appendChild(li);
			}
		}
	}
	main();
})();
