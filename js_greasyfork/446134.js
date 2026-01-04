// ==UserScript==
// @name         Combat Drops Only Complog
// @namespace    melvor_hcco
// @version      0.1.1
// @description  Adds a button to filter completion log to only show combat drop-exclusive items
// @author       mazunki
// @match	https://*.melvoridle.com/*
// @exclude	https://wiki.melvoridle.com*
// @grant       none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/446134/Combat%20Drops%20Only%20Complog.user.js
// @updateURL https://update.greasyfork.org/scripts/446134/Combat%20Drops%20Only%20Complog.meta.js
// ==/UserScript==

// Made for version 1.0

window.melvor_hcco_is_monster_loot = function (id) {
	if(items[id].ignoreCompletion === true) return false; // Ignore non-completion items
//	if(id === 524 || id === 525 || id == 526) return true // Manually adding in Pigtayle, Poraxx and Barrantoe herbs, as these come from Lucky Herb potions.
	if(items.filter(x => x.type === 'Seeds' && x.tier === 'Herb').map(x => x["grownItemID"]).includes(id)) return true; // Programmatically search for any herb seeds and map them to their corresponding herb, then check those
	if(id === 646) return true // Signet ring half b

	for (let i=0; i<MONSTERS.length; i++) {
		if(id === MONSTERS[i].bones) return true; // Check for bone drops
		let monster_loot = MONSTERS[i].lootTable;
		for (let j=0; j<monster_loot.length; j++) {
			if (monster_loot[j][0] === id) return true;
		}
	}
	// Check dungeon specific loot, e.g. fire cape, air shard etc.
	for (let i=0; i<DUNGEONS.length; i++) {
		let dungeon_loot = DUNGEONS[i].rewards;
		for (let j=0; j<dungeon_loot.length; j++) {
			if (dungeon_loot[j] === id) return true;
		}
	}

	return false;
}

window.melvor_hcco_get_monster_drops = function () {
	let found_items = [];
	for (let i=0; i<items.length; i++) {
		if (found_items.indexOf(i) == -1) { // avoid dupes
			if (window.melvor_hcco_is_monster_loot(i)) {
				found_items[found_items.length] = i;
			}
		}
	}
	return found_items;
}

window.melvor_hcco_get_co_available = function () {
	let found_items = window.melvor_hcco_get_monster_drops();
	let new_stuff = true;

	if (SHOP.Materials.length === undefined) return;
	for (let i=0; i<SHOP.Materials.length; i++) {
		if(SHOP.Materials[i].name === "Weird Gloop") continue; // Ignore weird gloop as we cannot get rune essence to buy it.
		let grocery = SHOP.Materials[i];
		for (let j=0; j<grocery.contains.items.length; j++) {
			if (found_items.indexOf(grocery.contains.items[j][0]) == -1) { // avoid dupes
				found_items[found_items.length] = grocery.contains.items[j][0];
			}
		}

	}

	if (SHOP.Slayer.length === undefined) return;
	for (let i=0; i<SHOP.Slayer.length; i++) {
		if(SHOP.Slayer[i].name === "Necromancer Hat") continue;
		if(SHOP.Slayer[i].name === "Necromancer Boots") continue;
		if(SHOP.Slayer[i].name === "Necromancer Bottoms") continue;
		if(SHOP.Slayer[i].name === "Necromancer Robes") continue; // These all have a Summoning requirement

		let grocery = SHOP.Slayer[i];
		for (let j=0; j<grocery.contains.items.length; j++) {
			if (found_items.indexOf(grocery.contains.items[j][0]) == -1) { // avoid dupes
				found_items[found_items.length] = grocery.contains.items[j][0];
			}
		}
	}


	if (SHOP.Gloves.length === undefined) return;
	for (let i=0; i<SHOP.Gloves.length; i++) {
		let grocery = SHOP.Gloves[i];
		for (let j=0; j<grocery.contains.items.length; j++) {
			if (found_items.indexOf(grocery.contains.items[j][0]) == -1) { // avoid dupes
				found_items[found_items.length] = grocery.contains.items[j][0];
			}
		}
	}
	if (SHOP.Skillcapes.length === undefined) return;
	for (let i=0; i<SHOP.Skillcapes.length; i++) {
		let cape = SHOP.Skillcapes[i];
		let skillreqs = cape.unlockRequirements.skillLevel;
		if (skillreqs === undefined) {
			continue;  // completion cape has no skillLevel, but completionPercentage=100
		}
		let ok_skills = [ "Attack", "Strength", "Defence", "Hitpoints", "Ranged", "Magic", "Prayer", "Slayer" ];
		let qualified = true;
		for (let j=0; j<skillreqs.length; j++) {
			if (ok_skills.indexOf(Skills[skillreqs[j][0]]) == -1) {
				qualified = false;
			}
		}
		if (!(qualified)) {
			continue;
		}

		for (let j=0; j<cape.contains.items.length; j++) {
			if (found_items.indexOf(cape.contains.items[j][0]) == -1) { // avoid dupes
				found_items[found_items.length] = cape.contains.items[j][0];
			}
		}
	}


	while (new_stuff) { // this will recursively open and craft chests
		new_stuff = false;
		// buying stuff from shop
		// opening all chests
		for (let i=0; i<found_items.length; i++) {
			if (items[found_items[i]].canOpen) {
				let dt = items[found_items[i]].dropTable;
				for (let j=0; j<dt.length; j++) {
					if (found_items.indexOf(dt[j][0]) == -1) { // avoid dupes
						found_items[found_items.length] = dt[j][0];
						new_stuff = true;
					}
				}
			}
		}

		// going through all craftable items
		for (let i=0; i<items.length; i++) {
			if (items[i].itemsRequired !== undefined) {
				let qualified = true;
				let ingredients = items[i].itemsRequired;
				for (let j=0; (j<ingredients.length) && (qualified); j++) {
					if (found_items.indexOf(ingredients[j][0]) == -1)
						qualified = false;  // missing an ingredient
				}
				if (qualified) {
					if (found_items.indexOf(i) == -1) { // avoid dupes
						found_items[found_items.length] = i;
						new_stuff = true;
					}
				}
			}
		}
	}

	return found_items;
}

window.complog_filter_monster_loot = function () {
	clearItemLogSearch();
	for (let i=0; i<items.length;i++) {
		$(`#item-log-img-${i}`).addClass("d-none");
	}

	let found_items = window.melvor_hcco_get_monster_drops();
	for (let i=0;i<found_items.length;i++) {
		$(`#item-log-img-${found_items[i]}`).removeClass("d-none");
	}
	return found_items;
}

window.complog_filter_co_available = function () {
	clearItemLogSearch();
	for (let i=0; i<items.length;i++) {
		$(`#item-log-img-${i}`).addClass("d-none");
	}

	let found_items = window.melvor_hcco_get_co_available();
	for (let i=0;i<found_items.length;i++) {
		$(`#item-log-img-${found_items[i]}`).removeClass("d-none");
	}
	return found_items;
}

var add_filter_button = () => {
	if ($("#completion-log-2") && $("#completion-log-2").find(".col-12")[4]) {
		itemlog = $("#completion-log-2");
		buttonRow = itemlog.find(".col-12")[4];
		monsterLootButton = $("<button>", {
			id: "complog_monster_loot",
		 	class: "btn btn-sm btn-info m-1",
		 	role: "button",
		 	onclick: "complog_filter_monster_loot();",
		 	text: "Monster loot"
		});
		cdoButton = $("<button>", {
			id: "complog_cdo",
		 	class: "btn btn-sm btn-info m-1",
		 	role: "button",
		 	onclick: "complog_filter_co_available();",
		 	text: "All Combat Drops"
		});
		if ($("#complog_cdo").length === 0) {
			monsterLootButton.appendTo(buttonRow);
			cdoButton.appendTo(buttonRow);
			let cdo_counter = complog_filter_co_available().length;
			$("#item-log-comp-count").append(' / <span id="item-log-cdo-count">' + cdo_counter + '</span>');
		}
	}
};

console.log("[melvor_hcco/combat_drops_only_complog] Loading...");
setTimeout( () => setInterval(add_filter_button, 1000), 1000 );
console.log("[melvor_hcco/combat_drops_only_complog] Done!");
