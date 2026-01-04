// ==UserScript==
// @name        Dead Frontier - Scrapping
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @grant       none
// @version     0.0.19
// @author      Shrike00
// @description Alternate scrapping method.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481827/Dead%20Frontier%20-%20Scrapping.user.js
// @updateURL https://update.greasyfork.org/scripts/481827/Dead%20Frontier%20-%20Scrapping.meta.js
// ==/UserScript==

// Changelog
// 0.0.4 - March 15, 2023
// - Feature: Bulk scrap window.
// - Improvement: No longer searches market for non-transferable items and locked slots, availability check is more aggressive.
// 0.0.3 - October 26, 2022
// - Bugfix: Properly warns if no market entries are available.
// 0.0.2 - September 30, 2022
// - Change: Warns if no market entries are available.
// 0.0.1 - June 4, 2022
// - Initial release

// Changelog
// 0.0.19 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.18 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.17 - February 21, 2025
// - Bugfix: Now properly handles nothing on market case.
//           Reported by kik0001 on Discord.
// 0.0.16 - November 17, 2024
// - Bugfix: Now should be working on Tampermonkey.
// 0.0.15 - October 30, 2024
// - Bugfix: Regular click-and-drag scrapping now works after exiting scrap window.
// 0.0.14 - October 25, 2024
// - Bugfix: Improved compatibility with official feature. MutationObserver is now only active when scrap window is open,
//           and removes pageLock added by official click event listener (for the agreement that no longer appears).
// 0.0.13 - October 25, 2024
// - Bugfix: Added support for renamed items.
// 0.0.12 - October 24, 2024
// - Bugfix: Added case for when a modifier (MC/cooked) is on the item to be scrapped, but is not present in the market.
//           Reported and fix suggested by hotrods20.
// 0.0.11 - October 24, 2024
// - Change: Compatibility update to avoid conflicting with official fast scrap feature.
// 0.0.10 - May 2, 2024
// - Change: Updated Dead Frontier API, new tradezone ids.
// 0.0.9 - March 12, 2024
// - Change: Items are added to scrap whitelist if confirmed.
// 0.0.8 - February 24, 2024
// - Change: Updated backpack filters.
// 0.0.7 - February 20, 2024
// - Change: Added treasure items.
// 0.0.6 - February 17, 2024
// - Change: Loosened restrictions, market prices can now be higher and still allow scrapping.
// 0.0.5 - August 10, 2023
// - Change: Now confirms pop-up with enter key.
// 0.0.4 - April 9, 2023
// - Change: Added flag to optionally not do the market search.
// 0.0.3 - October 26, 2022
// - Bugfix: Properly warns if no market entries are available.
// 0.0.2 - September 30, 2022
// - Change: Warns if no market entries are available.
// 0.0.1 - June 4, 2022
// - Initial release

(function() {
	'use strict';

	// User Options
	const use_market_data = true;

	function isEquipment(item) {
		const weapon = item.category === ItemCategory.WEAPON;
		const armour = item.category === ItemCategory.ARMOUR;
		const equippable_item = item.category === ItemCategory.ITEM && (item.subcategory === ItemSubcategory.IMPLANT || item.subcategory === ItemSubcategory.CLOTHING);
		return weapon || armour || equippable_item;
	}

	function isConsumable(item) {
		const medicine = item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.MEDICINE;
		const food = item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.FOOD;
		const barricading = item.full_type === "woodenplanks" || item.full_type === "nails";
		return medicine || food || barricading;
	}

	function isAmmo(item) {
		const ammo = item.category === ItemCategory.AMMO;
		return ammo;
	}

	const scrap_categories = [
		{name: "Equipment", predicate: isEquipment},
		{name: "Consumables", predicate: isConsumable},
		{name: "Ammo", predicate: isAmmo},
		{name: "Other", predicate: (item) => true}
	];

	const bulk_checkboxes_default = {
		// Categories
		weapons: true,
		armour: true,
		implants: false,
		clothing: false,
		medicine: false,
		food: false,
		ammo: false,
		barricade: false,
		other: false,
		// Filters
		max_level_equipment: false,
		godcrafted: false
	}

	function treasureTypes() {
		const globaldata = globalData;
		const treasure_types = new Set();
		for (let key in globaldata) {
			const value = globaldata[key];
			if ("description" in value && value.description.indexOf("Scrap at The Yard") !== -1) {
				treasure_types.add(key);
			}
		}
		return treasure_types;
	}

	// Add in item types that are non-lootable or non-transferable but commonly scrapped here.
	const whitelist_types = new Set(["easterimplant", "halloweenimplant", "christmasimplant", "childsbody"]);
	const treasure_types = treasureTypes();
	function scrapItemPredicate(item) {
		const globaldata = globalData;
		const data = globaldata[item.base_type];
		const transferable = !("no_transfer" in data) || data.no_transfer !== "1";
		const lootable = !("noloot" in data) || data.noloot !== "1";
		return (transferable && lootable) || whitelist_types.has(item.base_type) || treasure_types.has(item.base_type);
	}

	function bulkScrapItemPredicate(item) {
		const transferable = item.properties.get("transferable");
		const lootable = item.properties.get("lootable");
		const is_weapon = item.category === ItemCategory.WEAPON;
		const is_armour = item.category === ItemCategory.ARMOUR;
		return (transferable && lootable) || whitelist_types.has(item.base_type) || treasure_types.has(item.base_type);
	}

	function warnMarketPrice(scrap_price, market_price) {
		const flat_difference = 20000;
		const percentage_threshold = 0.50;
		const minimum_difference = 500;
		const warn = ((market_price - scrap_price > flat_difference) || (market_price*percentage_threshold > scrap_price)) && (market_price - scrap_price > minimum_difference);
		return warn;
	}

	function preventMarketPrice(scrap_price, market_price) {
		const flat_difference = 350000;
		const prevent = market_price - scrap_price > flat_difference;
		return prevent;
	}

	function bulkPreventMarketPrice(scrap_price, market_price) {
		const flat_difference = 150000;
		const prevent = market_price - scrap_price > flat_difference;
		return prevent;
	}

	// Imports

	const ItemCategory = DeadFrontier.ItemCategory;
	const ItemSubcategory = DeadFrontier.ItemSubcategory;
	const UiUpdate = DeadFrontier.UiUpdate;

	// Helpers

	function promiseWait(dt) {
		const promise = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve();
			}, dt);
		});
		return promise;
	}

	function promiseInventoryAvailable(items, dt = 500) {
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				if (items.inventoryAvailable()) {
					clearInterval(check);
					resolve();
				}
			}, dt);
		});
		return promise;
	}

	function isStackable(item) {
		const ammo = item.category === ItemCategory.AMMO;
		return ammo;
	}

	function marketFilter(item) {
		if (DeadFrontier.ItemFilters.Cooked(item)) {
			return DeadFrontier.MarketFilters.Cooked;
		} else if (DeadFrontier.ItemFilters.Godcrafted(item)) {
			return DeadFrontier.MarketFilters.Godcrafted;
		} else if (DeadFrontier.ItemFilters.Mastercrafted(item)) {
			return DeadFrontier.MarketFilters.Mastercrafted;
		} else {
			return (market_entry) => true;
		}
	}

	function updateCacheFromInventory(market_cache, player_items) {
		// Requests all items from inventory.
		return promiseInventoryAvailable(player_items, 100)
		.then(function() {
			const types_to_request = [];
			for (const [slot, item] of player_items.inventoryItems()) {
				const transferable = item.properties.get("transferable");
				const locked_slot = player_items.isLockedSlot(slot);
				const passes_predicate = scrapItemPredicate(item);
				const is_renamed = item.properties.has("rename");
				if (transferable && passes_predicate && !locked_slot && !is_renamed) {
					types_to_request.push(item.base_type);
				}
			}
			return market_cache.requestMultipleItemMarketEntriesByType(types_to_request);
		})
		.then(function() {
			const renames_to_request = [];
			for (const [slot, item] of player_items.inventoryItems()) {
				const transferable = item.properties.get("transferable");
				const locked_slot = player_items.isLockedSlot(slot);
				const passes_predicate = scrapItemPredicate(item);
				const is_renamed = item.properties.has("rename");
				if (transferable && passes_predicate && !locked_slot && is_renamed) {
					renames_to_request.push(item.properties.get("rename"));
				}
			}
			return market_cache.requestMultipleItemMarketEntriesByRename(renames_to_request);
		});
	}

	function updateMissingCacheFromInventory(market_cache, player_items) {
		// Only requests missing items from cache.
		return promiseInventoryAvailable(player_items, 100)
		.then(function() {
			const types_to_request = [];
			for (const [slot, item] of player_items.inventoryItems()) {
				const transferable = item.properties.get("transferable");
				const locked_slot = player_items.isLockedSlot(slot);
				const passes_predicate = scrapItemPredicate(item);
				const cache_contains_type = market_cache.hasItemType(item.base_type);
				const is_renamed = item.properties.has("rename");
				if (transferable && passes_predicate && !locked_slot && !cache_contains_type && !is_renamed) {
					types_to_request.push(item.base_type);
				}
			}
			return market_cache.requestMultipleItemMarketEntriesByType(types_to_request);
		})
		.then(function() {
			const renames_to_request = [];
			for (const [slot, item] of player_items.inventoryItems()) {
				const transferable = item.properties.get("transferable");
				const locked_slot = player_items.isLockedSlot(slot);
				const passes_predicate = scrapItemPredicate(item);
				const is_renamed = item.properties.has("rename");
				if (transferable && passes_predicate && !locked_slot && is_renamed) {
					const cache_contains_rename = market_cache.hasRename(item.properties.get("rename"));
					if (cache_contains_rename) {
						renames_to_request.push(item.properties.get("rename"));
					}
				}
			}
			return market_cache.requestMultipleItemMarketEntriesByRename(types_to_request);
		})
	}

	function getMarketData(item, market_cache) {
		// Renames corresponding data from market cache. If not present, returns empty array.
		const renamed = item.properties.has("rename");
		if (renamed) {
			const rename = item.properties.get("rename");
			if (!market_cache.hasRename(rename)) {
				return [];
			}
			return market_cache.getItemMarketEntriesByRename(rename).filter((market_entry) => market_entry.item.full_type === item.full_type);
		} else {
			if (!market_cache.hasItemType(item.base_type)) {
				return [];
			}
			return market_cache.getItemMarketEntriesByType(item.base_type);
		}
	}

	// UI

	function scrappingContainer() {
		const box = document.createElement("div");
		box.style.setProperty("position", "absolute");
		box.style.setProperty("display", "none");
		box.style.setProperty("width", "99%");
		box.style.setProperty("height", "100%");
		box.style.setProperty("top", "0px");
		box.style.setProperty("left", "0px");
		box.style.setProperty("margin", "0 auto");
		box.style.setProperty("justify-content", "center");
		box.style.setProperty("z-index", 20);
		box.style.setProperty("background-color", "rgba(0, 0, 0, 1)")
		box.style.setProperty("border", "1px solid red");
		return box;
	}

	function cancelButton() {
		const button = document.createElement("button");
		button.innerHTML = "Cancel";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("left", "0px");
		button.style.setProperty("right", "0px");
		button.style.setProperty("bottom", "5px");
		button.style.setProperty("margin", "auto");
		button.style.setProperty("font-size", "16px");
		button.style.setProperty("font-family", "Courier New, Arial");
		return button;
	}

	function scrapIcon() {
		const inventory_holder = document.getElementById("inventoryholder");
		for (let i = 0; inventory_holder.children.length; i++) {
			const child = inventory_holder.children[i];
			if (child.dataset.action === "scrap") {
				return child;
			}
		}
		return undefined;
	}

	function scrapTitle() {
		const title = document.createElement("div");
		title.style.setProperty("font-size", "18px");
		title.style.setProperty("margin-top", "5px");
		title.style.setProperty("margin-bottom", "-30px");
		title.style.setProperty("font-weight", "bold");
		title.style.setProperty("color", "#D0D0D0");
		title.style.setProperty("text-shadow", "0 0 5px red");
		title.style.setProperty("font-family", "Courier New, Arial");
		title.innerHTML = "Scrapping";
		return title;
	}

	function setWarningHidden() {
		// Hides pop-up warning.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		prompt.removeAttribute("style");
		gamecontent.removeAttribute("class");
		gamecontent.style.setProperty("display", "none");
	}

	function setWarningVisible(text, yesCallback, noCallback) {
		// Shows pop-up warning/prompt.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		// Warning message
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
		gamecontent.className = "warning";
		gamecontent.style.setProperty("font-family", "\"Courier New CE\", Arial");
		gamecontent.style.setProperty("font-weight", "bold");
		gamecontent.style.setProperty("color", "white");
		gamecontent.style.setProperty("text-align", "center");
		gamecontent.innerHTML = text;
		// Buttons
		const noButton = document.createElement("button");
		noButton.style.position = "absolute";
		noButton.style.top = "72px";
		noButton.style.left = "151px";
		noButton.innerHTML = "No";
		noButton.addEventListener("click", noCallback);
		gamecontent.appendChild(noButton);
		const yesButton = document.createElement("button");
		yesButton.style.position = "absolute";
		yesButton.style.left = "86px";
		yesButton.style.top = "72px";
		yesButton.innerHTML = "Yes";
		yesButton.addEventListener("click", yesCallback);
		gamecontent.appendChild(yesButton);
		// Enter hotkey for confirming.
		gamecontent.focus();
		let debounce = true; // Avoid sending request if one has already been sent.
		gamecontent.onkeydown = function(e) {
			const enter_pressed = e.code === "Enter" || e.code === "NumpadEnter";
			if (debounce && enter_pressed) {
				debounce = false;
				Promise.resolve(yesCallback())
				.then(function() {
					debounce = true;
				});
			}
		}
	}

	function setLoadingHidden() {
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		prompt.style.setProperty("display", "none");
		gamecontent.style.setProperty("display", "none");
	}

	function setLoadingVisible() {
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.setProperty("text-align", "center");
		gamecontent.innerHTML = "Loading...";
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
	}

	function setLoadingText(text) {
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = text;
	}

	function scrapScrollingFrame() {
		const frame = document.createElement("div");
		frame.style.setProperty("overflow-y", "scroll");
		frame.style.setProperty("border", "1px solid #990000");
		frame.style.setProperty("position", "relative");
		frame.style.setProperty("height", "450px");
		frame.style.setProperty("width", "640px");
		frame.style.setProperty("bottom", "5px");
		return frame;
	}

	function headerElement(name) {
		const header = document.createElement("tr");
		header.innerHTML = name;
		header.style.setProperty("font-weight", "bold");
		header.style.setProperty("font-size", "14px");
		return header;
	}

	function displayName(item) {
		const is_renamed = item.properties.has("rename");
		const base = is_renamed ? item.properties.get("rename") : item.base_name;
		if (item.category === DeadFrontier.ItemCategory.WEAPON && DeadFrontier.ItemFilters.Mastercrafted(item)) {
			const accuracy = item.properties.get("accuracy").toString();
			const reloading = item.properties.get("reloading").toString();
			const critical_hit = item.properties.get("critical_hit").toString();
			return base + " (" + accuracy + "/" + reloading + "/" + critical_hit + ")";
		} else if (item.category === DeadFrontier.ItemCategory.ARMOUR && DeadFrontier.ItemFilters.Mastercrafted(item)) {
			const agility = item.properties.get("agility").toString();
			const endurance = item.properties.get("endurance").toString();
			return base + " (" + agility + "/" + endurance + ")";
		} else if (isStackable(item)) {
			const quantity = item.quantity.toString();
			return base + " (" + quantity  + ")";
		} else {
			return base;
		}
	}

	function itemNameDatum(item_name) {
		const name = document.createElement("td");
		name.innerHTML = item_name;
		name.style.setProperty("padding-left", "4px");
		name.style.setProperty("padding-top", "4px");
		name.style.setProperty("padding-bottom", "4px");
		name.style.setProperty("width", "250px");
		return name;
	}

	function scrapPriceDatum(text) {
		const scrap_price = document.createElement("td");
		scrap_price.innerHTML = text;
		scrap_price.style.setProperty("text-align", "right");
		scrap_price.style.setProperty("padding-left", "10px");
		scrap_price.style.setProperty("padding-top", "4px");
		scrap_price.style.setProperty("padding-bottom", "4px");
		scrap_price.style.setProperty("width", "100px");
		return scrap_price;
	}

	function marketPriceDatum(text) {
		const market_price = document.createElement("td");
		market_price.innerHTML = text;
		market_price.style.setProperty("text-align", "right");
		market_price.style.setProperty("padding-left", "10px");
		market_price.style.setProperty("padding-top", "4px");
		market_price.style.setProperty("padding-bottom", "4px");
		market_price.style.setProperty("width", "100px");
		return market_price;
	}

	function scrapButton() {
		const scrap_button = document.createElement("button");
		scrap_button.innerHTML = "Scrap";
		scrap_button.style.setProperty("margin-left", "60px");
		scrap_button.style.setProperty("margin-top", "4px");
		scrap_button.style.setProperty("margin-bottom", "4px");
		scrap_button.style.setProperty("margin-right", "4px");
		return scrap_button;
	}

	function bulkScrapNavigation() {
		const navigation_button = document.createElement("button");
		navigation_button.innerHTML = "Bulk Scrap >>";
		navigation_button.style.setProperty("position", "absolute");
		navigation_button.style.setProperty("margin-left", "600px");
		navigation_button.style.setProperty("margin-top", "4px");
		navigation_button.style.setProperty("margin-bottom", "4px");
		navigation_button.style.setProperty("margin-right", "4px");
		return navigation_button;
	}

	function mainScrapNavigation() {
		const navigation_button = document.createElement("button");
		navigation_button.innerHTML = "<< Scrapping";
		navigation_button.style.setProperty("position", "absolute");
		navigation_button.style.setProperty("margin-left", "10px");
		navigation_button.style.setProperty("margin-top", "4px");
		navigation_button.style.setProperty("margin-bottom", "4px");
		navigation_button.style.setProperty("margin-right", "4px");
		return navigation_button;
	}

	function checkboxDiv(text, value, checked = false) {
		const div = document.createElement("div");
		const checkbox = document.createElement("input");
		checkbox.setAttribute("type", "checkbox");
		checkbox.setAttribute("value", value);
		if (checked) {
			checkbox.setAttribute("checked", "");
		}
		checkbox.style.setProperty("float", "left");
		checkbox.style.setProperty("margin-left", "10px");
		div.appendChild(checkbox);
		const label = document.createElement("label");
		label.setAttribute("for", value);
		label.innerHTML = text;
		label.style.setProperty("float", "left");
		label.style.setProperty("margin-left", "5px");
		div.appendChild(label);
		return [div, checkbox];
	}

	function bulkScrapHeader(text) {
		const header = document.createElement("div");
		header.style.setProperty("color", "#D0D0D0");
		header.style.setProperty("text-shadow", "0 0 5px red");
		header.style.setProperty("font-family", "Arial");
		header.style.setProperty("text-align", "left");
		header.style.setProperty("font-weight", "bold");
		header.style.setProperty("margin-top", "5px");
		header.style.setProperty("margin-bottom", "5px");
		header.style.setProperty("margin-left", "2px");
		header.innerHTML = text;
		return header;
	}

	function bulkScrapUi() {
		const div = document.createElement("div");
		div.style.setProperty("border", "1px solid #990000");
		div.style.setProperty("display", "flex");
		div.style.setProperty("flex-direction", "column");
		div.style.setProperty("position", "relative");
		div.style.setProperty("height", "450px");
		div.style.setProperty("width", "240px");
		div.style.setProperty("bottom", "5px");
		const categories_header = bulkScrapHeader("Categories");
		div.appendChild(categories_header);
		const [weapons_div, weapons_checkbox] = checkboxDiv("Weapons", "weapons", bulk_checkboxes_default.weapons);
		div.appendChild(weapons_div);
		const [armour_div, armour_checkbox] = checkboxDiv("Armour", "armour", bulk_checkboxes_default.armour);
		div.appendChild(armour_div);
		const [implants_div, implants_checkbox] = checkboxDiv("Implants", "implants", bulk_checkboxes_default.implants);
		div.appendChild(implants_div);
		const [clothing_div, clothing_checkbox] = checkboxDiv("Clothing", "clothing", bulk_checkboxes_default.clothing);
		div.appendChild(clothing_div);
		const [medicine_div, medicine_checkbox] = checkboxDiv("Medicine", "medicine", bulk_checkboxes_default.medicine);
		div.appendChild(medicine_div);
		const [food_div, food_checkbox] = checkboxDiv("Food", "food", bulk_checkboxes_default.food);
		div.appendChild(food_div);
		const [ammo_div, ammo_checkbox] = checkboxDiv("Ammo", "ammo", bulk_checkboxes_default.ammo);
		div.appendChild(ammo_div);
		const [barricade_div, barricade_checkbox] = checkboxDiv("Barricade", "barricade", bulk_checkboxes_default.barricade);
		div.appendChild(barricade_div);
		const [other_div, other_checkbox] = checkboxDiv("Other", "other", bulk_checkboxes_default.other);
		div.appendChild(other_div);
		const filters_header = bulkScrapHeader("Filters (Include)");
		div.appendChild(filters_header);
		const [max_level_equipment_div, max_level_equipment_checkbox] = checkboxDiv("Max Level Equipment", "maxlevelequipment", bulk_checkboxes_default.max_level_equipment);
		div.appendChild(max_level_equipment_div);
		const [godcrafted_div, godcrafted_checkbox] = checkboxDiv("Godcrafted", "godcrafted", bulk_checkboxes_default.godcrafted);
		div.appendChild(godcrafted_div);
		const submit_div = document.createElement("div");
		submit_div.style.setProperty("border", "1px solid #990000");
		//submit_div.style.setProperty("height", "10px");
		submit_div.style.setProperty("width", "240px");
		submit_div.style.setProperty("display", "flex");
		submit_div.style.setProperty("flex-direction", "column");
		submit_div.style.setProperty("position", "absolute");
		submit_div.style.setProperty("bottom", "0");
		submit_div.style.setProperty("float", "bottom");
		const preview_button = document.createElement("button");
		preview_button.innerHTML = "Preview >>";
		preview_button.style.setProperty("margin-bottom", "20px");
		submit_div.appendChild(preview_button);
		const total_scrap_div = document.createElement("div");
		total_scrap_div.style.setProperty("height", "20px");
		submit_div.appendChild(total_scrap_div);
		const bulk_scrap_button = document.createElement("button");
		bulk_scrap_button.setAttribute("disabled", true);
		bulk_scrap_button.innerHTML = "Bulk Scrap";
		submit_div.appendChild(bulk_scrap_button);
		div.appendChild(submit_div);
		const ui_elements = {
			checkboxes: {
				weapons: weapons_checkbox,
				armour: armour_checkbox,
				implants: implants_checkbox,
				clothing: clothing_checkbox,
				medicine: medicine_checkbox,
				food: food_checkbox,
				ammo: ammo_checkbox,
				barricade: barricade_checkbox,
				other: other_checkbox,
				max_level_equipment: max_level_equipment_checkbox,
				godcrafted: godcrafted_checkbox
			},
			buttons: {
				preview: preview_button,
				bulk_scrap: bulk_scrap_button
			},
			info: {
				total_scrap: total_scrap_div
			}
		}
		return [div, ui_elements];
	}

	function updateScrapItems(table, player_items, market_cache) {
		table.replaceChildren(); // Remove children
		// Create header elements
		const headers = scrap_categories.map((category) => headerElement(category.name));
		headers.forEach((header) => table.appendChild(header));
		// Stores information about each table row
		const item_category_data = new Map();
		scrap_categories.forEach((category) => item_category_data.set(category.name, []));
		for (const [slot, item] of player_items.inventoryItems()) {
			// Skip if item is in locked slot or does not pass predicate (by default, ignores non-transferable and non-lootable items).
			if (lockedSlots.includes(slot.toString())) {
				continue;
			}
			if (!scrapItemPredicate(item)) {
				continue;
			}
			// Creates row element
			const tr = document.createElement("tr");
			tr.style.setProperty("font-size", "12px");
			// Item name
			const name = itemNameDatum(displayName(item));
			// Item scrap price
			const scrap_value = scrapValue(item.full_type, item.quantity);
			const scrap_price = scrapPriceDatum("$" + scrap_value.toLocaleString())
			// Item market price
			let market_price = null;
			let cheapest_market_price = null;
			const is_renamed = item.properties.has("rename");
			if (market_cache.hasItemType(item.base_type) || (is_renamed && market_cache.hasRename(item.properties.get("rename")))) {
				const item_market_data = getMarketData(item, market_cache);
				const filtered_data = item_market_data.filter(marketFilter(item));
				if (filtered_data.length === 0) {
					const cheapest_market_entry = item_market_data[0];
					const cheapest_market_item = cheapest_market_entry.item;
					cheapest_market_price = isStackable(item) ? Math.floor((cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity) : cheapest_market_entry.price;
					market_price = marketPriceDatum("$" + cheapest_market_price.toLocaleString() + "?");
				} else {
					const cheapest_market_entry = filtered_data[0];
					const cheapest_market_item = cheapest_market_entry.item;
					cheapest_market_price = isStackable(item) ? Math.floor((cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity) : cheapest_market_entry.price;
					market_price = marketPriceDatum("$" + cheapest_market_price.toLocaleString());
				}
			} else {
				cheapest_market_price = 0;
				market_price = marketPriceDatum("N/A");
			}
			// Item scrap button
			const scrap_button = scrapButton();
			scrap_button.addEventListener("mouseenter", function(e) {
				tr.style.setProperty("font-weight", "bold");
				tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
			});
			scrap_button.addEventListener("mouseleave", function(e) {
				tr.style.removeProperty("font-weight");
				tr.style.removeProperty("box-shadow");
			})
			// Scrap Button Event Listeners
			const prevent_scrap = preventMarketPrice(scrap_value, cheapest_market_price);
			const warn_scrap = warnMarketPrice(scrap_value, cheapest_market_price);
			const no_market_entries_available = !market_cache.hasItemType(item.base_type) && !(is_renamed && market_cache.hasRename(item.properties.get("rename")));
			const need_market_check = !(whitelist_types.has(item.base_type) || treasure_types.has(item.base_type));
			const force_allow = whitelist_types.has(item.base_type);
			if (prevent_scrap) {
				tr.style.setProperty("color", "red");
				scrap_button.style.setProperty("display", "none");
			} else if (warn_scrap && !no_market_entries_available && !force_allow) {
				tr.style.setProperty("color", "red");
				scrap_button.addEventListener("click", function(e) {
					const text = "This item sells for <span style=\"color: red;\">$" + cheapest_market_price.toLocaleString() + "</span> and scraps for <span style=\"color: red;\">$" + scrap_value.toLocaleString() + "</span>.<br>Are you sure you want to scrap this item?";
					setWarningVisible(text, function() {
						player_items.scrapInventoryItem(slot, item)
						.then(function() {
							whitelist_types.add(item.base_type);
							updateScrapItems(table, player_items, market_cache);
							playSound("shop_buysell");
							setWarningHidden();
						});
					}, setWarningHidden);
				});
			} else if (no_market_entries_available && need_market_check && use_market_data && !force_allow) {
				tr.style.setProperty("color", "red");
				scrap_button.addEventListener("click", function(e) {
					const text = "No market data for this item is available.<br>Are you sure you want to scrap this item?";
					setWarningVisible(text, function() {
						player_items.scrapInventoryItem(slot, item)
						.then(function() {
							whitelist_types.add(item.base_type);
							updateScrapItems(table, player_items, market_cache);
							playSound("shop_buysell");
							setWarningHidden();
						});
					}, setWarningHidden);
				});
			} else {
				scrap_button.addEventListener("click", function(e) {
					setLoadingVisible();
					player_items.scrapInventoryItem(slot, item)
					.then(function() {
						setLoadingHidden();
						updateScrapItems(table, player_items, market_cache);
						playSound("shop_buysell");
					});
				});
			}
			// Adding to arrays (to be sorted and added to table).
			tr.appendChild(name);
			tr.appendChild(market_price);
			tr.appendChild(scrap_price);
			tr.appendChild(scrap_button);
			// Adds data about each table row to map
			const data = {element: tr, full_type: item.full_type, quantity: item.quantity};
			for (let i = 0; i < scrap_categories.length; i++) {
				const category = scrap_categories[i];
				if (category.predicate(item)) {
					item_category_data.get(category.name).push(data);
					break;
				}
			}
		}
		// Sort item table rows and add to table.
		function sortingFunction(a, b) {
			const scrap_a = scrapValue(a.full_type, a.quantity);
			const scrap_b = scrapValue(b.full_type, b.quantity);
			if (scrap_a === scrap_b) {
				return a.full_type > b.full_type;
			} else {
				return scrap_a > scrap_b;
			}
		}
		// Hides header rows if there are no items under them
		headers.forEach((header) => header.style.setProperty("display", item_category_data.get(header.innerHTML).length === 0 ? "none" : "block"));
		// Sorts category data/table rows
		for (const [category_name, category_data] of item_category_data.entries()) {
			category_data.sort(sortingFunction);
		}
		// Puts table row elements after each header
		headers.forEach((header) => header.after(...item_category_data.get(header.innerHTML).map((data) => data.element)));
	}

	function bulkUiFilter(ui_elements) {
		// Returns function that filters out items based on state of UI elements.
		const filter_out_categories = {};
		const filter_out_subcategories = {};
		const checkboxes = ui_elements.checkboxes;
		if (!checkboxes.weapons.checked) {filter_out_categories[ItemCategory.WEAPON] = true;}
		if (!checkboxes.armour.checked) {filter_out_categories[ItemCategory.ARMOUR] = true;}
		if (!checkboxes.implants.checked) {filter_out_subcategories[ItemSubcategory.IMPLANT] = true;}
		if (!checkboxes.ammo.checked) {filter_out_categories[ItemCategory.AMMO] = true;}
		if (!checkboxes.clothing.checked) {filter_out_subcategories[ItemSubcategory.CLOTHING] = true;}
		if (!checkboxes.medicine.checked) {filter_out_subcategories[ItemSubcategory.MEDICINE] = true;}
		if (!checkboxes.food.checked) {filter_out_subcategories[ItemSubcategory.FOOD] = true;}
		if (!checkboxes.barricade.checked) {filter_out_subcategories[ItemSubcategory.BARRICADE] = true;}
		if (!checkboxes.other.checked) {
			filter_out_categories[ItemCategory.OTHER] = true;
			filter_out_subcategories[ItemSubcategory.OTHER] = true;
		}
		const keep_max_level_equipment = checkboxes.max_level_equipment.checked;
		const keep_godcrafted_equipment = checkboxes.godcrafted.checked;
		function predicate(item) {
			// Filter out max level equipment checkbox.
			const is_weapon = item.category === ItemCategory.WEAPON;
			const is_armour = item.category === ItemCategory.ARMOUR;
			const max_level_equipment = (is_weapon && item.properties.get("proficiency_level") >= 120) || (is_armour && item.properties.get("engineer_level") >= 75);
			if (!keep_max_level_equipment && max_level_equipment) {
				return false;
			}
			// Filter out godcrafted equipment.
			const godcrafted = DeadFrontier.ItemFilters.Godcrafted(item);
			if (!keep_godcrafted_equipment && godcrafted) {
				return false;
			}
			// Filter out categories and subcategories.
			if (item.category !== ItemCategory.ITEM) {
				if (item.category in filter_out_categories) {
					return false;
				}
			} else {
				if (item.subcategory in filter_out_subcategories) {
					return false;
				}
			}
			return true;
		}
		return predicate;
	}

	function updateBulkScrapPreview(table, player_items, market_cache, ui_elements) {
		table.replaceChildren(); // Remove children
		// Create header elements
		const headers = scrap_categories.map((category) => headerElement(category.name));
		headers.forEach((header) => table.appendChild(header));
		// Stores information about each table row
		const item_category_data = new Map();
		scrap_categories.forEach((category) => item_category_data.set(category.name, []));
		const ui_filter_predicate = bulkUiFilter(ui_elements);
		const slot_items_to_be_scrapped = [];
		let total_scrap_value = 0;
		for (const [slot, item] of player_items.inventoryItems()) {
			if (player_items.isLockedSlot(slot)) {
				continue;
			}
			if (!bulkScrapItemPredicate(item)) {
				continue;
			}
			if (!ui_filter_predicate(item)) {
				continue;
			}
			// Check market for prices, block if difference is too large or no market entries available.
			const is_renamed = item.properties.has("rename");
			const item_on_market = market_cache.hasItemType(item.base_type) || (is_renamed && market_cache.hasRename(item.properties.get("rename")));
			const need_market_check = !(whitelist_types.has(item.base_type) || treasure_types.has(item.base_type));
			if (!item_on_market && need_market_check) {
				continue;
			}
			let cheapest_market_price;
			const item_market_data = getMarketData(item, market_cache);
			const filtered_data = item_market_data.filter(marketFilter(item));
			if (filtered_data.length === 0) {
				const cheapest_market_entry = item_market_data[0];
				const cheapest_market_item = cheapest_market_entry.item;
				cheapest_market_price = isStackable(item) ? Math.floor((cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity) : cheapest_market_entry.price;
			} else {
				const cheapest_market_entry = filtered_data[0];
				const cheapest_market_item = cheapest_market_entry.item;
				cheapest_market_price = isStackable(item) ? Math.floor((cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity) : cheapest_market_entry.price;
			}
			const scrap_value = scrapValue(item.full_type, item.quantity);
			if (bulkPreventMarketPrice(scrap_value, cheapest_market_price)) {
				continue;
			}
			// Push item to be scrapped if it passes all of the above checks.
			slot_items_to_be_scrapped.push([slot, item]);
			// Creates row element
			const tr = document.createElement("tr");
			tr.style.setProperty("font-size", "12px");
			// Item name
			const name = itemNameDatum(displayName(item));
			// Item scrap price
			const scrap_price = scrapPriceDatum("$" + scrap_value.toLocaleString())
			// Adding to arrays (to be sorted and added to table).
			tr.appendChild(name);
			tr.appendChild(scrap_price);
			// Adds data about each table row to map
			const data = {element: tr, full_type: item.full_type, quantity: item.quantity};
			for (let i = 0; i < scrap_categories.length; i++) {
				const category = scrap_categories[i];
				if (category.predicate(item)) {
					item_category_data.get(category.name).push(data);
					break;
				}
			}
		}
		// Sort item table rows and add to table.
		function sortingFunction(a, b) {
			const scrap_a = scrapValue(a.full_type, a.quantity);
			const scrap_b = scrapValue(b.full_type, b.quantity);
			if (scrap_a === scrap_b) {
				return a.full_type > b.full_type;
			} else {
				return scrap_a > scrap_b;
			}
		}
		// Hides header rows if there are no items under them
		headers.forEach((header) => header.style.setProperty("display", item_category_data.get(header.innerHTML).length === 0 ? "none" : "block"));
		// Sorts category data/table rows
		for (const [category_name, category_data] of item_category_data.entries()) {
			category_data.sort(sortingFunction);
		}
		// Puts table row elements after each header
		headers.forEach((header) => header.after(...item_category_data.get(header.innerHTML).map((data) => data.element)));
		// Return array of [slot, item] elements to be bulk scrapped.
		return slot_items_to_be_scrapped;
	}

	function tableKeys() {
		const keys = document.createElement("div");
		keys.style.setProperty("margin-top", "10px");
		keys.style.setProperty("margin-bottom", "-15px");
		keys.style.setProperty("font-size", "14px");
		keys.style.setProperty("font-weight", "bold");
		keys.style.setProperty("font-family", "Courier New, monospace");
		const name = document.createElement("span");
		name.style.setProperty("position", "absolute");
		name.style.setProperty("top", "23px");
		name.style.setProperty("left", "53px");
		name.innerHTML = "Item Name";
		keys.appendChild(name);
		const market_price = document.createElement("span");
		market_price.style.setProperty("position", "absolute");
		market_price.style.setProperty("top", "23px");
		market_price.style.setProperty("left", "322px");
		market_price.innerHTML = "Market Price";
		keys.appendChild(market_price);
		const scrap_price = document.createElement("span");
		scrap_price.style.setProperty("position", "absolute");
		scrap_price.style.setProperty("top", "23px");
		scrap_price.style.setProperty("left", "443px");
		scrap_price.innerHTML = "Scrap Price";
		keys.appendChild(scrap_price);
		return keys;
	}

	function bulkTableKeys() {
		const keys = document.createElement("div");
		keys.style.setProperty("margin-top", "10px");
		keys.style.setProperty("margin-bottom", "-15px");
		keys.style.setProperty("font-size", "14px");
		keys.style.setProperty("font-weight", "bold");
		keys.style.setProperty("font-family", "Courier New, monospace");
		const name = document.createElement("span");
		name.style.setProperty("position", "absolute");
		name.style.setProperty("top", "23px");
		name.style.setProperty("left", "278px");
		name.innerHTML = "Item Name";
		keys.appendChild(name);
		const scrap_price = document.createElement("span");
		scrap_price.style.setProperty("position", "absolute");
		scrap_price.style.setProperty("top", "23px");
		scrap_price.style.setProperty("left", "554px");
		scrap_price.innerHTML = "Scrap Price";
		keys.appendChild(scrap_price);
		return keys;
	}

	function removeActionBox(prompt) {
		const nodes_to_remove = [];
		for (const child of prompt.children) {
			const is_generic_action_box = child.className === "genericActionBox opElem";
			if (is_generic_action_box) {
				child.style.display = "none";
				nodes_to_remove.push(child);
			}
		}
		for (const child of nodes_to_remove) {
			prompt.removeChild(child);
		}
	}

	// Main

	function main() {
		const player_items = new DeadFrontier.PlayerItems();
		const market_cache = new DeadFrontier.MarketCache(parseInt(userVars.DFSTATS_df_tradezone));
		const flash_replace = document.getElementById("inventoryholder").parentNode;
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		let prompt_observer;
		// Create main scrapping window
		const container = scrappingContainer();
		flash_replace.appendChild(container);
		const title = scrapTitle();
		container.appendChild(title);
		container.appendChild(tableKeys());
		const scrapping_frame = scrapScrollingFrame();
		container.appendChild(scrapping_frame);
		const cancel_button = cancelButton();
		container.appendChild(cancel_button);
		const bulk_navigation_button = bulkScrapNavigation();
		container.appendChild(bulk_navigation_button);
		const table = document.createElement("table");
		table.style.setProperty("margin-bottom", "4px");
		let last_request_time = null;
		scrapping_frame.appendChild(table);
		cancel_button.addEventListener("click", function(e) {
			prompt_observer.disconnect();
			gamecontent.style.removeProperty("display");
			container.style.setProperty("display", "none");
			prompt.style.setProperty("display", "none");
			pageLock = false;
		});
		// Create bulk scrapping window.
		const bulk_window = scrappingContainer();
		bulk_window.style.setProperty("grid-template-areas", '"head head" "left right"');
		flash_replace.appendChild(bulk_window);
		const bulk_title = scrapTitle();
		bulk_title.innerHTML = "Bulk Scrap";
		bulk_title.style.setProperty("margin-bottom", "14px");
		bulk_title.style.setProperty("grid-area", "head");
		bulk_window.appendChild(bulk_title);
		const bulk_keys = bulkTableKeys();
		bulk_window.appendChild(bulk_keys);
		const [bulk_ui, bulk_ui_elements] = bulkScrapUi();
		bulk_ui.style.setProperty("grid-area", "left");
		bulk_window.append(bulk_ui);
		const bulk_scrapping_frame = scrapScrollingFrame();
		bulk_scrapping_frame.style.setProperty("width", "400px");
		bulk_scrapping_frame.style.setProperty("grid-area", "right");
		const bulk_table = document.createElement("table");
		bulk_table.style.setProperty("margin-bottom", "4px");
		bulk_scrapping_frame.appendChild(bulk_table);
		bulk_window.append(bulk_scrapping_frame);
		const bulk_cancel_button = cancelButton();
		bulk_window.appendChild(bulk_cancel_button);
		const main_navigation_button = mainScrapNavigation();
		bulk_window.appendChild(main_navigation_button);
		let bulk_scrap_list = [];
		function resetBulkScrapWindow() {
			bulk_scrap_list = [];
			bulk_table.replaceChildren();
			bulk_ui_elements.buttons.bulk_scrap.setAttribute("disabled", true);
			bulk_ui_elements.info.total_scrap.innerHTML = "";
		}
		bulk_cancel_button.addEventListener("click", function(e) {
			prompt_observer.disconnect();
			gamecontent.style.removeProperty("display");
			bulk_window.style.setProperty("display", "none");
			prompt.style.setProperty("display", "none");
			pageLock = false;
		});
		// Preview button.
		bulk_ui_elements.buttons.preview.addEventListener("click", function(e){
			bulk_scrap_list = updateBulkScrapPreview(bulk_table, player_items, market_cache, bulk_ui_elements);
			if (bulk_scrap_list.length > 0) {
				bulk_ui_elements.buttons.bulk_scrap.removeAttribute("disabled");
				const items_to_scrap = bulk_scrap_list.map((e) => e[1]);
				const scrap_values = items_to_scrap.map((item) => scrapValue(item.full_type, item.quantity));
				const total_scrap_value = scrap_values.reduce((a, b) => a + b, 0);
				const formatted_total_scrap_value = "$" + total_scrap_value.toLocaleString()
				bulk_ui_elements.info.total_scrap.innerHTML = formatted_total_scrap_value;
			} else {
				resetBulkScrapWindow();
			}
		});
		// Bulk scrap button.
		bulk_ui_elements.buttons.bulk_scrap.addEventListener("click", function(e) {
			setLoadingVisible();
			let current_promise = Promise.resolve();
			setLoadingVisible();
			for (let i = 0; i < bulk_scrap_list.length; i++) {
				const [slot, item] = bulk_scrap_list[i];
				const is_last_item = i === bulk_scrap_list.length - 1;
				const update = is_last_item ? UiUpdate.YES : UiUpdate.NO;
				current_promise = current_promise.then(function() {
					return promiseWait(0).then(function() { // Can add fixed delay between each scrap.
						setLoadingText("Loading...<br>(Scrapping " + (i + 1).toString() + " of "+ bulk_scrap_list.length.toString() + ")");
						return player_items.scrapInventoryItem(slot, item, update);
					});
				});
			}
			current_promise.then(function() {
				setLoadingHidden();
				playSound("shop_buysell");
				resetBulkScrapWindow();
			});
		});
		// Navigation Buttons
		bulk_navigation_button.addEventListener("click", function(e) {
			resetBulkScrapWindow();
			container.style.setProperty("display", "none");
			bulk_window.style.setProperty("display", "grid");
		});
		main_navigation_button.addEventListener("click", function(e) {
			updateScrapItems(table, player_items, market_cache);
			container.style.setProperty("display", "grid");
			bulk_window.style.setProperty("display", "none");
		});
		// Opens main scrap window on clicking the scrap icon.
		scrapIcon().addEventListener("click", function(e) {
			removeActionBox(prompt);
			prompt_observer.observe(prompt, {childList: true});
			setLoadingVisible();
			const now = performance.now();
			if (use_market_data) {
				updateCacheFromInventory(market_cache, player_items)
				.then(function() {
					last_request_time = now;
					updateScrapItems(table, player_items, market_cache);
					promiseWait(100) // Wait for DOM to update.
					.then(function() {
						container.style.setProperty("display", "grid");
						setLoadingHidden();
					});
				});
			} else {
				last_request_time = now;
				updateScrapItems(table, player_items, market_cache);
				promiseWait(100) // Wait for DOM to update.
				.then(function() {
					container.style.setProperty("display", "grid");
					setLoadingHidden();
				});
			}
		});
		// Observer to hide genericActionBox that pops up the liability/responsibility agreement for official quick scrapping.
		function prompt_callback(mutation_list, observer) {
			for (const mutation of mutation_list) {
				const added_elements = mutation.addedNodes;
				const is_generic_action_box = added_elements.length == 1 && added_elements[0].className == "genericActionBox opElem"
				if (is_generic_action_box) {
					const action_box = added_elements[0];
					action_box.style.display = "none";
					const nodes_to_remove = [];
					const parent = action_box.parentNode;
					for (const child of parent.children) {
						if (child.className === "genericActionBox opElem") {
							nodes_to_remove.push(child);
						}
					}
					for (const child of nodes_to_remove) {
						parent.removeChild(child);
					}
				}
			}
		}
		prompt_observer = new MutationObserver(prompt_callback);
	};
	main();
})();
