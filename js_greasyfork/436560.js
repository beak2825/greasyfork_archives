// ==UserScript==
// @name         Combat Drops Only Complog
// @namespace    melvor_hcco
// @version      0.1.1
// @description  Adds a button to filter completion log to only show combat drop-exclusive items
// @author       mazunki
// @match	 https://*.melvoridle.com/*
// @exclude	 https://wiki.melvoridle.com*
// @grant        none
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/436560/Combat%20Drops%20Only%20Complog.user.js
// @updateURL https://update.greasyfork.org/scripts/436560/Combat%20Drops%20Only%20Complog.meta.js
// ==/UserScript==

// Made for version 1.0

window.melvor_hcco_is_monster_loot = function (id) {
	for (let i=0; i<MONSTERS.length; i++) {
		monster_loot = MONSTERS[i].lootTable;
		for (let j=0; j<monster_loot.length; j++) {
			if (monster_loot[j][0] === id) return true;
		}
	}
	return false;
}
window.melvor_hcco_is_cdo_available = function (id) {
	return melvor_hcco_is_monster_loot(id);
}

window.complog_filter_cdo = function (all=true) {
	clearItemLogSearch();
	let found_items = [];
	for (let i=0; i<items.length;i++) {
		$(`#item-log-img-${i}`).addClass("d-none");
		if (melvor_hcco_is_monster_loot(i)) {
			if (found_items.find( (v) => { v == i }) === undefined) {
				found_items[found_items.length] = i;
			}
		}
	}
	if (all) {
		// opening all chests
		for (let i=0; i<found_items.length; i++) {
			if (items[found_items[i]].canOpen) {
				let dt = items[found_items[i]].dropTable;
				for (let j=0; j<dt.length; j++) {
					if (found_items.find( (v) => { v == dt[j][0] }) === undefined) {
						found_items[found_items.length] = dt[j][0];
					}
				}
			}
		}
		// going through all craftable items
		for (let i=0; i<items.length; i++) {
			if (items[i].itemsRequired !== undefined) {
				let qualified = true;
				for (let j=0; (j<items[i].itemsRequired.length) && (qualified); j++) {
					if (found_items.find( (v) => { v == items[i].itemsRequired[j] } ) === undefined)
						qualified = false;
				}
				if (qualified) {
					found_items[found_items.length] = i;
				}
			}
		}
	}
	for (let i=0;i<found_items.length;i++) {
		$(`#item-log-img-${found_items[i]}`).removeClass("d-none");
	}
	return found_items;
}

var add_filter_button = () => {
	if ($("#completion-log-2")) {
		itemlog = $("#completion-log-2");
		buttonRow = itemlog.find(".col-12")[4];
		monsterLootButton = $("<button>", {
			id: "complog_monster_loot",
		 	class: "btn btn-sm btn-info m-1",
		 	role: "button",
		 	onclick: "complog_filter_cdo(false);",
		 	text: "Monster loot"
		});
		cdoButton = $("<button>", {
			id: "complog_cdo",
		 	class: "btn btn-sm btn-info m-1",
		 	role: "button",
		 	onclick: "complog_filter_cdo(true);",
		 	text: "All Combat Drops"
		});
		if ($("#complog_cdo").length === 0) {
			monsterLootButton.appendTo(buttonRow);
			cdoButton.appendTo(buttonRow);
			let cdo_counter = complog_filter_cdo(true).length;
			$("#item-log-comp-count").append(' / <span id="item-log-cdo-count">' + cdo_counter + '</span>');
		}
	}
};

setTimeout( () => setInterval(add_filter_button, 1000), 1000 );

