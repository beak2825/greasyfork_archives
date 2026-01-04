// ==UserScript==
// @name        Dead Frontier - Inventory Information
// @namespace   Dead Frontier - Shrike00
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant       none
// @version     0.2.6
// @author      Shrike00
// @description Adds information to inventory, including scrap and market prices, summary of estimated value, and more. Check the script for user-configurable options.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/434231/Dead%20Frontier%20-%20Inventory%20Information.user.js
// @updateURL https://update.greasyfork.org/scripts/434231/Dead%20Frontier%20-%20Inventory%20Information.meta.js
// ==/UserScript==

// Add to header block to add script to yard.
// @match        *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24

// Changelog
// 0.2.6 - July 18, 2025
// - Change: Moved tradezone select dropdown to avoid conflicting with implant preset feature.
// 0.2.5 - April 20, 2025
// - Change: Improved infobox div spacing for oversized ammo stacks.
// 0.2.4 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.2.3 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.2.2 - February 21, 2025
// Bugfix: Should now work properly for renames over 20 characters.
//         Fixed in relation to bug reported by kik0001 on Discord.
// 0.2.1 - November 19, 2024
// Feature: Added in color gradient to distinguish between value of highlighted items.
// Feature: Added in categorical outlining when hovering over scrap and market summaries.
// Change: Now immediately starts market search if mousing over inventory or backpack.
// Change: Added percentages to scrap and market summaries.
// Bugfix: Collection book status now waits to be loaded before displaying.
// 0.2.0 - November 10, 2024
// Completely rewritten to use API and less aggressive request scheduling, more caching for fewer necessary requests
// Now works with backpacks
// More features available, and can be configured in script
// Now mostly uses setInterval instead of event listeners for UI events
// Disabled in yard by default


(function() {
	'use strict';

	// User Options

	// Tradezone options
	const SHOW_TRADEZONE_DROPDOWN = true;
	// Tradezone to display by default. If override is false, uses the current tradezone.
	const USE_TRADEZONE_OVERRIDE = false;
	const TRADEZONE_OVERRIDE = DeadFrontier.Tradezone.CAMP_VALCREST; // Other valid options are OUTPOST, N, CENTRAL, WASTELANDS, etc.

	// Infobox options
	const PLACES = [1, 5, 10, 20];
	const SHOW_COLLECTION_BOOK_STATUS = false;

	// Total options
	const SHOW_SCRAP_TOTAL = true;
	const SHOW_ESTIMATED_MARKET_TOTAL = true;

	// Highlight options
	const HIGHLIGHT_SLOTS = false;
	const HIGHLIGHT_THRESHOLD = 0.20; // Proportion to highlight, e.g. 0.2 highlights the bottom 20% of items based on estimated value.
	// Color 1 is displayed when far away from the lowest value item, color 2 is displayed when very close to the lowest value.
	const HIGHLIGHT_COLOR1 = {r: 255, g: 255, b: 255, a: 0.7};
	const HIGHLIGHT_COLOR2 = {r: 255, g: 64, b: 64, a: 0.9};

	// Request scheduling options
	// Milliseconds between batches of market requests. Lower is faster, higher is safer (and less likely to be rate limited).
	const MS_BETWEEN_REQUESTS = 200;
	// Number of requests to send in each batch. Higher is faster, lower is safer.
	const REQUEST_BATCH_SIZE = 2;

	// Item filtering options
	function scrapTotalBackpackFilter(player_items, slot, item) {
		return !player_items.isLockedBackpackSlot(slot);
	}

	function scrapTotalInventoryFilter(player_items, slot, item) {
		return !player_items.isLockedSlot(slot);
	}

	function marketTotalBackpackFilter(player_items, slot, item) {
		// return false; // Don't consider any backpack items in estimated market total.
		return !player_items.isLockedBackpackSlot(slot) && SHOW_ESTIMATED_MARKET_TOTAL;
	}

	function marketTotalInventoryFilter(player_items, slot, item) {
		// return false; // Don't consider any inventory items in estimated market total.
		return !player_items.isLockedSlot(slot) && SHOW_ESTIMATED_MARKET_TOTAL;
	}

	function highlightBackpackFilter(player_items, slot, item) {
		return !player_items.isLockedBackpackSlot(slot);
	}

	function highlightInventoryFilter(player_items, slot, item) {
		return !player_items.isLockedSlot(slot);
	}

	function requestMarketBackpackFilter(player_items, slot, item) {
		// return false; // Don't request any market data on backpack items.
		return item.properties.get("transferable");
	}

	function requestMarketInventoryFilter(player_items, slot, item) {
		// return false; // Don't request any market data on inventory items.
		return item.properties.get("transferable");
	}

	// Breakdown options
	function isEquipment(item) {
		const weapon = item.category === DeadFrontier.ItemCategory.WEAPON;
		const armour = item.category === DeadFrontier.ItemCategory.ARMOUR;
		const backpack = item.category === DeadFrontier.ItemCategory.BACKPACK;
		const clothing = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.CLOTHING;
		const implant = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.IMPLANT;
		return weapon || armour || backpack || clothing || implant;
	}

	function isAmmo(item) {
		return item.category === DeadFrontier.ItemCategory.AMMO;
	}

	function isConsumable(item) {
		const food = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.FOOD;
		const medicine = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.MEDICINE;
		return food || medicine;
	}

	function isMisc(item) {
		return !isEquipment(item) && !isAmmo(item) && !isConsumable(item);
	}

	const SCRAP_SUMMARY_BREAKDOWN = {
		"Equipment": isEquipment,
		"Ammo": isAmmo,
		"Consumables": isConsumable,
		"Misc.": isMisc
	};

	const MARKET_SUMMARY_BREAKDOWN = {
		"Equipment": isEquipment,
		"Ammo": isAmmo,
		"Consumables": isConsumable,
		"Misc.": isMisc
	};

	// Enums

	const SlotType = {
		INVENTORY: "inventory",
		BACKPACK: "backpackdisplay",
		IMPLANTS: "implants",
		CHARACTER: "character"
	};

	// Constants

	function isWebpage(url) {
		return window.location.href.indexOf(url) !== -1;
	}

	const INNERCITY_INVENTORY = isWebpage("https://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31");
	const OUTPOST_INVENTORY = isWebpage("https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25");
	const MARKETPLACE = isWebpage("https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35");
	const THE_YARD = isWebpage("https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24");

	// Imports


	// Helpers

	function nearest(n, pivot) {
		// Rounds to closest pivot value. nearest(154.29, 0.2) == 154.20, for example. Format using toFixed(n) if
		// displaying or converting to string.
		return Math.round(n/pivot)*pivot;
	}

	function numberToPlace(n) {
		// Converts number to place. 1 -> "1st", etc.
		const base = n.toString();
		const ends_with_one = base.substring(base.length - 1) == "1";
		const ends_with_eleven = base.substring(base.length - 2) == "11";
		const ends_with_two = base.substring(base.length - 1) == "2";
		const ends_with_twelve = base.substring(base.length - 2) == "12";
		const ends_with_three = base.substring(base.length - 1) == "3";
		const ends_with_thirteen = base.substring(base.length - 2) == "13";
		if (ends_with_one && !ends_with_eleven) {
			return base + "st";
		} else if (ends_with_two && !ends_with_twelve) {
			return base + "nd";
		} else if (ends_with_three && !ends_with_thirteen) {
			return base + "rd";
		} else {
			return base + "th";
		}
	}

	function promiseWait(dt) {
		const promise = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve();
			}, dt);
		});
		return promise;
	}

	function promiseWaitForElementId(id, timeout) {
		const start = performance.now();
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				const e = document.getElementById(id);
				if (e !== null) {
					clearInterval(check);
					resolve(e);
				}
				// Does not invoke callback if timeout is passed.
				if (performance.now() - start > timeout) {
					clearInterval(check);
					reject();
				}
			}, 50);
		});
		return promise;
	}

	function promiseWaitForInfobox(infobox, timeout) {
		// Wait for infobox to be ready and for the number of its children to be stable before resolving.
		// Timeout is in milliseconds.
		let nchildren = -1;
		const start = performance.now();
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				if (nchildren === infobox.children.length) {
					clearInterval(check);
					resolve();
				} else {
					nchildren = infobox.children.length;
				}
				// Does not invoke callback if timeout is passed.
				if (performance.now() - start > timeout) {
					clearInterval(check);
					reject();
				}
			}, 10);
		});
		return promise;
	}

	function promiseMouseenterElement(element, timeout) {
		// Promise that resolves if the mouse enters the given element.
		const promise = new Promise(function(resolve, reject) {
			function onMouseenter(e) {
				element.removeEventListener("mouseenter", onMouseenter);
				resolve(element);
			}
			element.addEventListener("mouseenter", onMouseenter);
			setTimeout(function() {
				element.removeEventListener("mouseenter", onMouseenter);
				reject();
			}, timeout);
		});
		return promise;
	}

	function chunk(array, subarray_length) {
		// Divides an array into subarrays of the given length.
		const output = [];
		for (let i = 0; i < array.length; i += subarray_length) {
			output.push(array.slice(i, i + subarray_length));
		}
		return output;
	}

	const InterpType = {
		MIDDLE: "middle",
		LINEAR: "linear"
	};

	function percentile(array, proportion, interp_type) {
		array.sort((a, b) => a - b);
		const position = (array.length - 1)*proportion;
		const upper = Math.ceil(position);
		const lower = Math.floor(position);
		const alpha = interp_type === InterpType.LINEAR ? upper - position : 0.5;
		return array[lower]*alpha + array[upper]*(1 - alpha);
	}

	function interpColor(color1, color2, alpha) {
		return {
			r: Math.round(color1.r*(1 - alpha) + color2.r*alpha),
			g: Math.round(color1.g*(1 - alpha) + color2.g*alpha),
			b: Math.round(color1.b*(1 - alpha) + color2.b*alpha),
			a: color1.a*(1 - alpha) + color2.a*alpha
		};
	}

	function filteredBackpackItems(player_items, predicate) {
		// Returns array of backpack items that pass predicate.
		const filtered_backpack_items = [];
		for (const [slot, item] of player_items.backpackItems()) {
			if (predicate(player_items, slot, item)) {
				filtered_backpack_items.push(item);
			}
		}
		return filtered_backpack_items;
	}

	function filteredInventoryItems(player_items, predicate) {
		// Returns array of inventory items that pass predicate.
		const filtered_inventory_items = [];
		for (const [slot, item] of player_items.inventoryItems()) {
			if (predicate(player_items, slot, item)) {
				filtered_inventory_items.push(item);
			}
		}
		return filtered_inventory_items;
	}

	function categoriesToRequest(player_items) {
		// Returns array of unique categories to request from backpack and inventory.
		if (INNERCITY_INVENTORY || OUTPOST_INVENTORY) {
			const filtered_backpack_items = filteredBackpackItems(player_items, requestMarketBackpackFilter);
			const filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
			const filtered_items = filtered_inventory_items.concat(filtered_backpack_items);
			const categories = filtered_items.map((item) => DeadFrontier.MarketCache.itemToCategorical(item));
			const unique_categories = Array.from(new Set(categories));
			return unique_categories;
		} else {
			const filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
			const categories = filtered_inventory_items.map((item) => DeadFrontier.MarketCache.itemToCategorical(item));
			const unique_categories = Array.from(new Set(categories));
			return unique_categories;
		}
	}

	function typesToRequest(player_items) {
		// Returns array of unique types to request from backpack and inventory.
		if (INNERCITY_INVENTORY || OUTPOST_INVENTORY) {
			const filtered_backpack_items = filteredBackpackItems(player_items, requestMarketBackpackFilter);
			const filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
			const filtered_items = filtered_inventory_items.concat(filtered_backpack_items);
			const types = filtered_items.filter((item) => !item.properties.has("rename")).map((item) => item.base_type);
			const unique_types = Array.from(new Set(types));
			return unique_types;
		} else {
			const filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
			const types = filtered_inventory_items.filter((item) => !item.properties.has("rename")).map((item) => item.base_type);
			const unique_types = Array.from(new Set(types));
			return unique_types;
		}
	}

	function renamesToRequest(player_items) {
		// Returns array of unique renames to request from backpack and inventory.
		if (INNERCITY_INVENTORY || OUTPOST_INVENTORY) {
			const filtered_backpack_items = filteredBackpackItems(player_items, requestMarketBackpackFilter);
			const filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
			const filtered_items = filtered_inventory_items.concat(filtered_backpack_items).filter((item) => item.properties.has("rename"));
			const renames = filtered_items.map((item) => item.properties.get("rename"));
			const unique_renames = Array.from(new Set(renames));
			return unique_renames;
		} else {
			const filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
			const renames = filtered_inventory_items.map((item) => item.properties.get("rename"));
			const unique_renames = Array.from(new Set(renames));
			return unique_renames;
		}
	}

	function currentSlot(cur_info_item) {
		// Returns current slot displayed by infobox.
		if (cur_info_item === undefined || cur_info_item.parentNode === null) {
			return undefined;
		}
		return parseInt(cur_info_item.parentNode.dataset.slot);
	}

	function currentSlotType(cur_info_item) {
		// Returns type of slot that target item is in.
		if (cur_info_item === undefined || cur_info_item.parentNode === null) {
			return undefined;
		}
		const grandparent = cur_info_item.parentNode.parentNode;
		if (grandparent === null) {
			return undefined;
		}
		const great_grandparent = cur_info_item.parentNode.parentNode.parentNode;
		if (great_grandparent === null) {
			return undefined;
		}
		if (great_grandparent.id === "inventory") {
			return SlotType.INVENTORY;
		} else if (great_grandparent.id === "backpackdisplay") {
			return SlotType.BACKPACK;
		} else if (great_grandparent.id === "implants") {
			return SlotType.IMPLANTS;
		} else if (great_grandparent.id === "character") {
			return SlotType.CHARACTER;
		} else {
			return undefined;
		}
	}

	function isInfoboxVisible(infobox) {
		return infobox.style.visibility !== "hidden";
	}

	function ammoPriceFormat(item, market_entry) {
		// Formats ammo item into format: total_price(price_per_unit, stack_size) -> price_of_this_stack
		const price_total = market_entry.price.toLocaleString();
		const price_per_unit = market_entry.price/market_entry.item.quantity;
		const font_size = INNERCITY_INVENTORY ? 10 : 14;
		const text = "$" + price_total + "($" + nearest(price_per_unit, 0.01).toFixed(2) + ", " + market_entry.item.quantity + ") <span style=\"font-size:" +  font_size.toString() +"px;\">⇒</span> $" + Math.floor(item.quantity*price_per_unit).toLocaleString();
		return text;
	}

	function itemFromSlotAndSlotType(player_items, slot, slot_type) {
		// Returns item from slot number and slot type.
		if (slot_type === SlotType.INVENTORY) {
			return player_items.itemFromInventorySlot(slot);
		} else if (slot_type === SlotType.BACKPACK) {
			return player_items.itemFromBackpackSlot(slot);
		} else {
			return undefined;
		}
	}


	// UI

	function scrapCounter() {
		// Creates element for displaying total scrap value.
		const div = document.createElement("div");
		const inventory_holder = document.getElementById("inventoryholder");
		div.innerHTML = "";
		div.style.setProperty("position", "absolute");
		div.style.setProperty("top", "400px");
		div.style.setProperty("left", "20px");
		inventory_holder.appendChild(div);
		return div;
	}

	function marketCounter() {
		// Creates element for displaying total market estimate.
		const div = document.createElement("div");
		const inventory_holder = document.getElementById("inventoryholder");
		div.innerHTML = "";
		div.style.setProperty("position", "absolute");
		div.style.setProperty("text-align", "right");
		div.style.setProperty("top", "415px");
		div.style.setProperty("right", "14px");
		inventory_holder.appendChild(div);
		return div;
	}

	function removeAddedElementsFromInfobox(infobox) {
		// Removes all elements from infobox that has the attribute "dfmp".
		const children = Array.from(infobox.children);
		const to_remove = children.filter((e) => e.hasAttribute("dfmp"));
		to_remove.forEach((child) => infobox.removeChild(child));
	}

	let collection_book_loaded = false;
	function makeElementForInfobox(item, market_cache, collection_book) {
		// Creates element to be added to infobox for on-hover scrap and price checking. Intended to regenerated on
		// mousing over a new item.
		const parent_div = document.createElement("div");
		parent_div.setAttribute("dfmp", "");
		// Scrap value
		const scrap_div = document.createElement("div");
		scrap_div.innerHTML = "Scrap: $" + scrapValue(item.full_type, item.quantity).toLocaleString();
		scrap_div.style.setProperty("text-align", "left");
		scrap_div.style.setProperty("font-size", "12px");
		parent_div.appendChild(scrap_div);
		// Market values
		const normal_item_in_cache = item.properties.get("transferable") && market_cache.hasItemType(item.base_type);
		const renamed_item_in_cache = item.properties.get("transferable") && item.properties.has("rename") && market_cache.hasRename(item.properties.get("rename"));
		if (normal_item_in_cache || renamed_item_in_cache) {
			const market_data = getMarketData(item, market_cache);
			const itemSpecificMarketFilter = marketFilter(item);
			const filtered_market_data = market_data.filter((market_entry) => itemSpecificMarketFilter(market_entry));
			const highest_index = filtered_market_data.length - 1;
			const indices = PLACES.map((p) => p - 1);
			const available_indices = indices.filter((i) => i <= highest_index);
			for (const index of available_indices) {
				const market_price_div = document.createElement("div");
				market_price_div.style.setProperty("text-align", "left");
				market_price_div.style.setProperty("font-size", "12px");
				const place = index + 1;
				const market_entry = filtered_market_data[index];
				if (market_entry.item.category === DeadFrontier.ItemCategory.AMMO) {
					market_price_div.innerHTML = numberToPlace(place) + ": " + ammoPriceFormat(item, market_entry);
				} else {
					market_price_div.innerHTML = numberToPlace(place) + ": $" + market_entry.price.toLocaleString();
				}
				parent_div.appendChild(market_price_div);
			}
		}
		// Collection book
		if (SHOW_COLLECTION_BOOK_STATUS && collection_book_loaded) {
			const cb_div = document.createElement("div");
			cb_div.style.setProperty("text-align", "left");
			cb_div.style.setProperty("font-size", "12px");
			if (collection_book.hasType(item.base_type)) {
				cb_div.style.setProperty("color", "#00FF00");
				cb_div.innerHTML = "In collection book";
				parent_div.appendChild(cb_div);
			} else {
				cb_div.style.setProperty("color", "firebrick");
				cb_div.innerHTML = "Not in collection book";
				parent_div.appendChild(cb_div);
			}
		}
		return parent_div;
	}

	function repositionInfobox(infobox) {
		// Copy-pasted from inventory.js to put infobox in correct place.
		const inventoryHolder = document.getElementById("inventoryholder");
		const invHoldOffsets = inventoryHolder.getBoundingClientRect();
		let specialPlacement = false;
		try {
			if (mousePos[1] - 30 - infoBox.offsetHeight < invHoldOffsets.top)
			{
				//infoBox.style.top = (mousePos[1] + 30 - invHoldOffsets.top) + "px";
				if (target.parentNode.parentNode.id === "venditron")
				{
					infoBox.style.top = "17px";
				} else
				{
					infoBox.style.top = "0px";
				}
				specialPlacement = true;
			} else
			{
				infoBox.style.top = (mousePos[1] - 30 - infoBox.offsetHeight - invHoldOffsets.top) + "px";
			}

			if (mousePos[0] + 20 + infoBox.offsetWidth > invHoldOffsets.right)
			{
				if (specialPlacement)
				{
					infoBox.style.left = (mousePos[0] - 20 - infoBox.offsetWidth - invHoldOffsets.left) + "px";
				} else
				{
					// original
					infoBox.style.left = (inventoryHolder.offsetWidth - infoBox.offsetWidth) + "px";
				}
			} else
			{
				infoBox.style.left = (mousePos[0] + 20 - invHoldOffsets.left) + "px";
			}
		} catch {
			// Do nothing if target is undefined.
		}
		// if (mousePos[1] - 30 - infobox.offsetHeight < invHoldOffsets.top)
		// {
		// 	infobox.style.top = (mousePos[1] + 30 - invHoldOffsets.top) + "px";
		// } else
		// {
		// 	infobox.style.top = (mousePos[1] - 30 - infobox.offsetHeight - invHoldOffsets.top) + "px";
		// }
		//
		// if (mousePos[0] + 20 + infobox.offsetWidth > invHoldOffsets.right)
		// {
		// 	infobox.style.left = (inventoryHolder.offsetWidth - infobox.offsetWidth) + "px";
		// } else
		// {
		// 	infobox.style.left = (mousePos[0] + 20 - invHoldOffsets.left) + "px";
		// }
	}

	function selectTradezone() {
		// Creates tradezone selection dropdown element.
		const dropdown = document.createElement("select");
		dropdown.className = "opElem";
		dropdown.style.setProperty("text-align", "left");
		dropdown.style.setProperty("left", "510px");
		dropdown.style.setProperty("top", "10px");
		dropdown.style.setProperty("width", "20%");
		dropdown.setAttribute("dfmp", "");
		const outpost_option = document.createElement("option");
		outpost_option.innerHTML = "Outpost";
		outpost_option.setAttribute("value", DeadFrontier.Tradezone.OUTPOST);
		dropdown.appendChild(outpost_option);
		const camp_valcrest_option = document.createElement("option");
		camp_valcrest_option.innerHTML = "Camp Valcrest";
		camp_valcrest_option.setAttribute("value", DeadFrontier.Tradezone.CAMP_VALCREST);
		dropdown.appendChild(camp_valcrest_option);
		const wastelands_option = document.createElement("option");
		wastelands_option.innerHTML = "Wastelands";
		wastelands_option.setAttribute("value", DeadFrontier.Tradezone.WASTELANDS);
		dropdown.appendChild(wastelands_option);
		const northwest_option = document.createElement("option");
		northwest_option.innerHTML = "NW";
		northwest_option.setAttribute("value", DeadFrontier.Tradezone.NW);
		dropdown.appendChild(northwest_option);
		const north_option = document.createElement("option");
		north_option.innerHTML = "N";
		north_option.setAttribute("value", DeadFrontier.Tradezone.N);
		dropdown.appendChild(north_option);
		const northeast_option = document.createElement("option");
		northeast_option.innerHTML = "NE";
		northeast_option.setAttribute("value", DeadFrontier.Tradezone.NE);
		dropdown.appendChild(northeast_option);
		const central_option = document.createElement("option");
		central_option.innerHTML = "Central";
		central_option.setAttribute("value", DeadFrontier.Tradezone.CENTRAL);
		dropdown.appendChild(central_option);
		const east_option = document.createElement("option");
		east_option.innerHTML = "E";
		east_option.setAttribute("value", DeadFrontier.Tradezone.E);
		dropdown.appendChild(east_option);
		const southwest_option = document.createElement("option");
		southwest_option.innerHTML = "SW";
		southwest_option.setAttribute("value", DeadFrontier.Tradezone.SW);
		dropdown.appendChild(southwest_option);
		const south_option = document.createElement("option");
		south_option.innerHTML = "S";
		south_option.setAttribute("value", DeadFrontier.Tradezone.S);
		dropdown.appendChild(south_option);
		const southeast_option = document.createElement("option");
		southeast_option.innerHTML = "SE";
		southeast_option.setAttribute("value", DeadFrontier.Tradezone.SE);
		dropdown.appendChild(southeast_option);
		return dropdown;
	}

	function elementFromSlotAndSlotType(slot, slot_type) {
		if (slot_type === SlotType.INVENTORY) {
			const inventory = document.getElementById("inventory");
			const slot_elements = inventory.querySelectorAll("td");
			for (const element of slot_elements) {
				if (parseInt(element.dataset.slot) === slot) {
					return element;
				}
			}
		} else if (slot_type === SlotType.BACKPACK) {
			const backpack = document.getElementById("backpackdisplay");
			const slot_elements = backpack.querySelectorAll("td");
			for (const element of slot_elements) {
				if (parseInt(element.dataset.slot) === slot) {
					return element;
				}
			}
		}
		throw new RangeError("Unable to find slot: " + slot + " in slot type: " + slot_type);
	}

	function summaryTable(summary_entries) {
		const table = document.createElement("table");
		table.style.setProperty("font-family", "Courier New, Arial");
		table.style.setProperty("color", "white");
		table.style.setProperty("font-size", "14px");
		table.style.setProperty("padding", "5px");
		const body = document.createElement("tbody");
		table.appendChild(body);
		for (const [name, predicate] of Object.entries(summary_entries)) {
			const row = document.createElement("tr");
			row.dataset.name = name;
			body.appendChild(row);
			const row_header = document.createElement("th");
			row_header.setAttribute("scope", "row");
			row_header.style.setProperty("text-align", "left");
			row_header.style.setProperty("padding", "3px");
			row_header.style.setProperty("padding-right", "20px");
			row_header.style.setProperty("margin", "0px");
			row_header.style.setProperty("background-color", "rgba(0,0,0,0)");
			row_header.style.setProperty("background-image", "url()");
			row_header.style.setProperty("border-top", "0px solid white");
			row_header.style.setProperty("border-left", "0px solid white");
			row_header.style.setProperty("border-bottom", "0px solid white");
			row_header.style.setProperty("border-right", "0px solid white");
			row_header.style.setProperty("height", "15px");
			row_header.innerHTML = name;
			row.appendChild(row_header);
			const currency = document.createElement("td");
			currency.dataset.type = "currency";
			currency.innerHTML = "$";
			row.appendChild(currency);
			const datum = document.createElement("td");
			datum.dataset.type = "value";
			datum.style.setProperty("text-align", "right");
			datum.style.setProperty("padding", "3px");
			datum.style.setProperty("padding-left", "10px");
			datum.style.setProperty("margin", "0px");
			row.appendChild(datum);
			const percent_datum = document.createElement("td");
			percent_datum.dataset.type = "percentage";
			percent_datum.style.setProperty("text-align", "right");
			percent_datum.style.setProperty("padding", "3px");
			percent_datum.style.setProperty("padding-left", "25px");
			percent_datum.style.setProperty("margin", "0px");
			row.appendChild(percent_datum);
			const percent_sign = document.createElement("td");
			percent_sign.dataset.type = "percent-sign";
			percent_sign.style.setProperty("padding-left", "3px");
			percent_sign.innerHTML = "%";
			row.appendChild(percent_sign);
		}
		const footer = document.createElement("tfoot");
		footer.style.setProperty("border-top", "2px solid white");
		table.appendChild(footer);
		const row = document.createElement("tr");
		row.dataset.name = "Total";
		footer.appendChild(row);
		const header = document.createElement("th");
		header.setAttribute("scope", "row");
		header.style.setProperty("text-align", "left");
		header.style.setProperty("padding", "3px");
		header.style.setProperty("padding-right", "20px");
		header.style.setProperty("margin", "0px");
		header.style.setProperty("background-color", "rgba(0,0,0,0)");
		header.style.setProperty("background-image", "url()");
		header.style.setProperty("border-top", "1px solid white");
		header.style.setProperty("border-left", "0px solid white");
		header.style.setProperty("height", "15px");
		header.innerHTML = "Total";
		row.appendChild(header);
		const currency = document.createElement("td");
		currency.dataset.type = "currency";
		currency.innerHTML = "$";
		row.appendChild(currency);
		const datum = document.createElement("td");
		datum.dataset.type = "value";
		datum.style.setProperty("text-align", "right");
		datum.style.setProperty("padding", "3px");
		datum.style.setProperty("padding-left", "20px");
		datum.style.setProperty("margin", "0px");
		row.appendChild(datum);
		const percent_datum = document.createElement("td");
		percent_datum.dataset.type = "percentage";
		percent_datum.style.setProperty("text-align", "right");
		percent_datum.style.setProperty("padding", "3px");
		percent_datum.style.setProperty("padding-left", "25px");
		percent_datum.style.setProperty("margin", "0px");
		row.appendChild(percent_datum);
		const percent_sign = document.createElement("td");
		percent_sign.dataset.type = "percent-sign";
		percent_sign.style.setProperty("padding-left", "3px");
		percent_sign.innerHTML = "%";
		row.appendChild(percent_sign);
		return table;
	}

	function scrapSummary(infobox) {
		const summary = infobox.cloneNode();
		summary.id = "dfmp-summary";
		summary.innerHTML = "";
		summary.style.removeProperty("visibility");
		// summary.style.visibility = "hidden";
		// summary.style.bottom = "120px";
		// summary.style.left = "15px";
		summary.style.display = "flex";
		summary.style.position = "relative";
		summary.style.setProperty("z-index", 50);
		summary.style.setProperty("background-color", "rgba(0,0,0,0.8)");
		summary.style.setProperty("min-height", "100px");
		summary.style.border = "rgba(64,64,64,0.8) 1px solid";
		summary.style.setProperty("background-repeat", "no-repeat");
		summary.style.setProperty("background-position", "top 20px right 10px");
		summary.style.padding = "5px";
		summary.style.cursor = "grab";
		summary.style.setProperty("margin-bottom", "20px");
		const table = summaryTable(SCRAP_SUMMARY_BREAKDOWN);
		summary.appendChild(table);
		const container = document.createElement("div");
		container.style.visibility = "hidden";
		container.style.position = "absolute";
		container.style.bottom = "100px";
		container.style.left = "15px";
		container.appendChild(summary);
		return container;
	}

	function marketSummary(infobox) {
		const summary = infobox.cloneNode();
		summary.id = "dfmp-summary";
		summary.innerHTML = "";
		summary.style.removeProperty("visibility");
		// summary.style.visibility = "hidden";
		// summary.style.bottom = "105px";
		// summary.style.right = "15px";
		summary.style.display = "flex";
		summary.style.position = "absolute";
		summary.style.setProperty("z-index", 50);
		summary.style.setProperty("background-color", "rgba(0,0,0,0.8)");
		summary.style.setProperty("min-height", "100px");
		summary.style.border = "rgba(64,64,64,0.8) 1px solid";
		summary.style.setProperty("background-repeat", "no-repeat");
		summary.style.setProperty("background-position", "top 20px right 10px");
		summary.style.padding = "5px";
		summary.style.cursor = "grab";
		summary.style.setProperty("margin-bottom", "20px");
		summary.style.setProperty("transform", "translate(-100%,-100%)");
		const table = summaryTable(MARKET_SUMMARY_BREAKDOWN);
		summary.appendChild(table);
		const container = document.createElement("div");
		container.style.visibility = "hidden";
		container.style.position = "absolute";
		container.style.bottom = "105px";
		container.style.right = "12px";
		container.appendChild(summary);
		return container;
	}


	// Main

	function updateScrapTotal(player_items, display) {
		// Updates scrap total.
		const filtered_backpack_items = filteredBackpackItems(player_items, scrapTotalBackpackFilter);
		const filtered_inventory_items = filteredInventoryItems(player_items, scrapTotalInventoryFilter);
		const filtered_items = filtered_backpack_items.concat(filtered_inventory_items);
		const scrap_values = filtered_items.map((e) => scrapValue(e.full_type, e.quantity));
		const total_scrap = scrap_values.reduce((a, b) => a + b, 0);
		display.innerHTML = "Scrap: $" + parseInt(total_scrap).toLocaleString();
	}

	function updateScrapSummary(player_items, summary) {
		const filtered_backpack_items = filteredBackpackItems(player_items, scrapTotalBackpackFilter);
		const filtered_inventory_items = filteredInventoryItems(player_items, scrapTotalInventoryFilter);
		const filtered_items = filtered_backpack_items.concat(filtered_inventory_items);
		const scrap_values = filtered_items.map((e) => scrapValue(e.full_type, e.quantity));
		const total_scrap = scrap_values.reduce((a, b) => a + b, 0);
		const total = Array.from(summary.querySelector("tfoot").querySelector("tr").querySelectorAll("td")).find((e) => e.dataset.type === "value");
		total.innerHTML = total_scrap.toLocaleString();
		const total_percentage = Array.from(summary.querySelector("tfoot").querySelector("tr").querySelectorAll("td")).find((e) => e.dataset.type === "percentage");
		total_percentage.innerHTML = (100.00).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
		const rows = summary.querySelector("tbody").querySelectorAll("tr");
		for (const row of rows) {
			const name = row.dataset.name;
			const predicate = SCRAP_SUMMARY_BREAKDOWN[name];
			const scraps = filtered_items.filter((item) => predicate(item)).map((item) => scrapValue(item.full_type, item.quantity));
			const category_total_scrap = scraps.reduce((a, b) => a + b, 0);
			const datum = Array.from(row.querySelectorAll("td")).find((e) => e.dataset.type === "value");
			datum.innerHTML = category_total_scrap.toLocaleString();
			const percentage = Array.from(row.querySelectorAll("td")).find((e) => e.dataset.type === "percentage");
			const proportion = category_total_scrap !== 0 ? category_total_scrap/total_scrap : 0.0;
			percentage.innerHTML = (proportion*100).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
		}
	}

	function requestMarketDataSequence(market_cache, market_categories, item_types, renames, types_requested, renames_requested) {
		// First requests categories, then slowly requests all item_types and renames.
		// console.debug(market_categories, item_types, renames);
		let active_promise = Promise.resolve();
		// Request items by category.
		let categorical_start_time = performance.now();
		let item_start_time;
		const category_chunks = chunk(market_categories, REQUEST_BATCH_SIZE);
		for (const chunk of category_chunks) {
			active_promise = active_promise.then(function() {
				return market_cache.requestMultipleItemMarketEntriesByCategory(chunk);
			})
			.then(function() {
				return promiseWait(MS_BETWEEN_REQUESTS);
			});
		}
		active_promise = active_promise
		.then(function() {
			// console.debug("Categorical search: " + (performance.now() - categorical_start_time).toLocaleString() + "ms");
			// console.debug("Average category: " + ((performance.now() - categorical_start_time)/market_categories.length).toLocaleString() + "ms");
			// console.debug("Categories: " + market_categories.length);
			item_start_time = performance.now();
		});
		// Request individual items.
		const type_chunks = chunk(item_types, REQUEST_BATCH_SIZE);
		for (const chunk of type_chunks) {
			active_promise = active_promise.then(function() {
				return market_cache.requestMultipleItemMarketEntriesByType(chunk);
			})
			.then(function() {
				// Track which types and renames have been requested and responded to (this is needed in case no
				// items were found, otherwise the market total calculation will hang).
				chunk.forEach((type) => types_requested.add(type));
				return promiseWait(MS_BETWEEN_REQUESTS);
			});
		}
		active_promise = active_promise
		.then(function() {
			// console.debug("Item search: " + (performance.now() - item_start_time).toLocaleString() + "ms");
			// console.debug("Average item: " + ((performance.now() - item_start_time)/item_types.length).toLocaleString() + "ms");
			// console.debug("Items: " + item_types.length);
		});
		// Request renames.
		const rename_chunks = chunk(renames, REQUEST_BATCH_SIZE);
		for (const chunk of rename_chunks) {
			active_promise = active_promise.then(function() {
				return market_cache.requestMultipleItemMarketEntriesByRename(chunk);
			})
			.then(function() {
				chunk.forEach((rename) => renames_requested.add(rename));
				return promiseWait(MS_BETWEEN_REQUESTS);
			});
		}
		// console.debug(category_chunks, type_chunks, rename_chunks);
		return active_promise;
	}

	function attemptedMarketData(item, types_requested, renames_requested) {
		// Returns true if the item is part of the types requested or renames requested Sets.
		// MarketCache doesn't track if it has attempted to get a specific item, only if it actually has it, so for
		// requests that return zero market entries, there is no distinguishable difference from not searching at all.
		// So we need to tell it that is has been searched and there were no entries.
		const transferable = item.properties.get("transferable");
		const renamed = item.properties.has("rename");
		// console.debug(item, renamed, renames_requested.has(item.properties.get("rename")));
		if (!transferable) {
			return true;
		} else if (renamed) {
			const rename = item.properties.get("rename");
			return renames_requested.has(rename);
		} else {
			return types_requested.has(item.base_type);
		}
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

	function estimateValue(item, market_cache) {
		// Estimates market value of item by taking the higher of its scrap value or cheapest market entry.
		let market_value;
		const normal_item_in_cache = item.properties.get("transferable") && market_cache.hasItemType(item.base_type);
		const renamed_item_in_cache = item.properties.get("transferable") && item.properties.has("rename") && market_cache.hasRename(item.properties.get("rename"));
		if (normal_item_in_cache || renamed_item_in_cache) {
			const market_data = getMarketData(item, market_cache);
			const itemSpecificMarketFilter = marketFilter(item);
			const filtered_market_data = market_data.filter((market_entry) => itemSpecificMarketFilter(market_entry));
			if (market_data.length === 0) { // No market entries at all.
				market_value = 0;
			} else if (filtered_market_data.length === 0) { // No market entries matching filter (GC'd, MC'd, cooked, etc.)
				const cheapest = market_data[0];
				const quantity = cheapest.item.quantity === 0 ? 1 : cheapest.item.quantity;
				const per_unit_market_value = cheapest.price/quantity;
				market_value = per_unit_market_value*item.quantity;
			} else {
				const cheapest = filtered_market_data[0];
				const quantity = cheapest.item.quantity === 0 ? 1 : cheapest.item.quantity;
				const per_unit_market_value = cheapest.price/quantity;
				market_value = per_unit_market_value*item.quantity;
			}
		} else {
			market_value = 0;
		}
		const scrap_value = scrapValue(item.full_type, item.quantity);
		const estimated_value = Math.max(scrap_value, market_value);
		return estimated_value;
	}

	function updateMarketEstimate(player_items, market_cache, display, types_requested, renames_requested) {
		// Update total estimate of market by valuing each item by the higher of its scrap value or cheapest market
		// entry. Checks that every type and rename has a recorded attempt at searching the market before displaying.
		// const market_filtered_backpack_items = filteredBackpackItems(player_items, requestMarketBackpackFilter);
		// const market_filtered_inventory_items = filteredInventoryItems(player_items, requestMarketInventoryFilter);
		// const market_filtered_items = market_filtered_inventory_items.concat(market_filtered_backpack_items);
		const total_filtered_backpack_items = filteredBackpackItems(player_items, marketTotalBackpackFilter);
		const total_filtered_inventory_items = filteredInventoryItems(player_items, marketTotalInventoryFilter);
		const total_filtered_items = total_filtered_backpack_items.concat(total_filtered_inventory_items);
		const unique_types = new Set();
		const unique_renames = new Set();
		const unique_items = [];
		for (const item of total_filtered_items) {
			const renamed = item.properties.has("rename");
			if (renamed && !unique_renames.has(item.properties.get("rename"))) {
				unique_renames.add(item.properties.get("rename"));
				unique_items.push(item);
			} else if (!unique_types.has(item.base_type)) {
				unique_types.add(item.base_type);
				unique_items.push(item);
			}
		}
		const total_to_request = unique_items.length;
		const number_market_data_available = unique_items.filter((item) => attemptedMarketData(item, types_requested, renames_requested)).length;
		const has_all_market_data = unique_items.every((item) => attemptedMarketData(item, types_requested, renames_requested));
		if (!has_all_market_data) {
			display.innerHTML = "Loading: (" + number_market_data_available + "/" + total_to_request + ")";
			return;
		}
		let total_market_estimate = 0;
		for (const item of total_filtered_items) {
			total_market_estimate += estimateValue(item, market_cache);
		}
		display.innerHTML = "Est. Market: $" + parseInt(total_market_estimate).toLocaleString();
	}

	function updateMarketSummary(player_items, market_cache, summary) {
		const filtered_backpack_items = filteredBackpackItems(player_items, marketTotalBackpackFilter);
		const filtered_inventory_items = filteredInventoryItems(player_items, marketTotalInventoryFilter);
		const filtered_items = filtered_backpack_items.concat(filtered_inventory_items);
		const values = filtered_items.map((item) => estimateValue(item, market_cache));
		const total_value = values.reduce((a, b) => a + b, 0);
		const total = Array.from(summary.querySelector("tfoot").querySelector("tr").querySelectorAll("td")).find((e) => e.dataset.type === "value");
		total.innerHTML = Math.floor(total_value).toLocaleString();
		const percentage_datum = Array.from(summary.querySelector("tfoot").querySelector("tr").querySelectorAll("td")).find((e) => e.dataset.type === "percentage");
		percentage_datum.innerHTML = (100).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
		const rows = summary.querySelector("tbody").querySelectorAll("tr");
		for (const row of rows) {
			const name = row.dataset.name;
			const predicate = MARKET_SUMMARY_BREAKDOWN[name];
			const values = filtered_items.filter((item) => predicate(item)).map((item) => estimateValue(item, market_cache));
			const category_total_value = values.reduce((a, b) => a + b, 0);
			const datum = Array.from(row.querySelectorAll("td")).find((e) => e.dataset.type === "value");
			datum.innerHTML = Math.floor(category_total_value).toLocaleString();
			const percentage_datum = Array.from(row.querySelectorAll("td")).find((e) => e.dataset.type === "percentage");
			const proportion = total_value !== 0 ? category_total_value/total_value : 0;
			percentage_datum.innerHTML = (proportion*100).toLocaleString(undefined, {maximumFractionDigits: 2, minimumFractionDigits: 2});
		}
	}

	let last_frame_dragging_item = false;
	let drag_end_time = performance.now();
	function highlightSlots(player_items, market_cache, types_requested, renames_requested) {
		const filtered_backpack_pairs = Array.from(player_items.backpackItems()).filter((pair) => highlightBackpackFilter(player_items, pair[0], pair[1]));
		const filtered_inventory_pairs = Array.from(player_items.inventoryItems()).filter((pair) => highlightInventoryFilter(player_items, pair[0], pair[1]));
		const filtered_pairs = filtered_inventory_pairs.concat(filtered_backpack_pairs);
		const backpack_valuations = filtered_backpack_pairs.map((pair) => estimateValue(pair[1], market_cache));
		const inventory_valuations = filtered_inventory_pairs.map((pair) => estimateValue(pair[1], market_cache));
		const valuations = inventory_valuations.concat(backpack_valuations);
		const threshold = percentile(valuations, HIGHLIGHT_THRESHOLD, InterpType.LINEAR);
		const smallest = Math.min(...valuations);
		function addHighlight(e, alpha = 0) {
			e.setAttribute("dfmp", "highlight");
			// e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			// Taken from inventory.css
			const color_obj = interpColor(HIGHLIGHT_COLOR1, HIGHLIGHT_COLOR2, alpha);
			// const color = "rgba(255,255,255,0.5)";
			const color = `rgba(${color_obj.r},${color_obj.g},${color_obj.b},${color_obj.a})`;
			e.querySelector("div").style.setProperty("filter", `drop-shadow(1px 1px 1px ${color}) drop-shadow(-1px -1px 1px ${color}) drop-shadow(-1px 1px 1px ${color}) drop-shadow(1px -1px 1px ${color})`);
		}
		function removeHighlight(e) {
			e.removeAttribute("dfmp");
			if (e.querySelector("div")) {
				e.querySelector("div").style.removeProperty("filter");
			}
		}
		const this_frame_dragging_item = currentItem !== undefined && currentItem !== null;
		const has_all_backpack_data = filtered_backpack_pairs.map((pair) => pair[1]).every((item) => attemptedMarketData(item, types_requested, renames_requested));
		const has_all_inventory_data = filtered_inventory_pairs.map((pair) => pair[1]).every((item) => attemptedMarketData(item, types_requested, renames_requested));
		const has_all_data = has_all_backpack_data && has_all_inventory_data;
		const current_time = performance.now();
		if (last_frame_dragging_item && !this_frame_dragging_item) {
			drag_end_time = current_time;
		}
		last_frame_dragging_item = this_frame_dragging_item;
		if (has_all_data) {
			for (let i = 0; i < filtered_backpack_pairs.length; i++) {
				const [slot, item] = filtered_backpack_pairs[i];
				const valuation = backpack_valuations[i];
				const element = elementFromSlotAndSlotType(slot, SlotType.BACKPACK);
				const is_highlighted = element.hasAttribute("dfmp") && element.getAttribute("dfmp") === "highlight";
				if (this_frame_dragging_item) {
					removeHighlight(element);
				} else if (valuation <= threshold && (current_time - drag_end_time) > 100) {
					const alpha = threshold === smallest ? 1 : 1 - (valuation - smallest)/(threshold - smallest);
					addHighlight(element, alpha);
				} else if (is_highlighted) {
					removeHighlight(element);
				}
			}
			for (let i = 0; i < filtered_inventory_pairs.length; i++) {
				const [slot, item] = filtered_inventory_pairs[i];
				const valuation = inventory_valuations[i];
				const element = elementFromSlotAndSlotType(slot, SlotType.INVENTORY);
				const is_highlighted = element.hasAttribute("dfmp") && element.getAttribute("dfmp") === "highlight";
				if (this_frame_dragging_item) {
					removeHighlight(element);
				}else if (valuation <= threshold  && (current_time - drag_end_time) > 100) {
					const alpha = threshold === smallest ? 1 : 1 - (valuation - smallest)/(threshold - smallest);
					addHighlight(element, alpha);
				} else if (is_highlighted) {
					removeHighlight(element);
				}
			}
		}
		// Remove highlights from irrelevant elements.
		const unfiltered_backpack_pairs = Array.from(player_items.backpackItems()).filter((pair) => !highlightBackpackFilter(player_items, pair[0], pair[1]));
		const unfiltered_inventory_pairs = Array.from(player_items.inventoryItems()).filter((pair) => !highlightInventoryFilter(player_items, pair[0], pair[1]));
		const empty_backpack_pairs = Array.from(player_items.backpackSlots()).filter((pair) => pair[1] === undefined);
		const empty_inventory_pairs = Array.from(player_items.inventorySlots()).filter((pair) => pair[1] === undefined);
		const irrelevant_backpack_slots = unfiltered_backpack_pairs.concat(empty_backpack_pairs).map((pair) => pair[0]);
		const irrelevant_inventory_slots = unfiltered_inventory_pairs.concat(empty_inventory_pairs).map((pair) => pair[0]);
		irrelevant_backpack_slots.map((slot) => elementFromSlotAndSlotType(slot, SlotType.BACKPACK)).forEach((e) => removeHighlight(e));
		irrelevant_inventory_slots.map((slot) => elementFromSlotAndSlotType(slot, SlotType.INVENTORY)).forEach((e) => removeHighlight(e));
	}

	function outlineSlots(player_items, backpack_filter_predicate, inventory_filter_predicate, outline_predicate) {
		const filtered_backpack_pairs = Array.from(player_items.backpackItems()).filter((pair) => backpack_filter_predicate(player_items, pair[0], pair[1]));
		const filtered_inventory_pairs = Array.from(player_items.inventoryItems()).filter((pair) => inventory_filter_predicate(player_items, pair[0], pair[1]));
		function addOutline(e) {
			e.style.setProperty("box-shadow", "0 0 0 1px inset white");
		}
		function removeOutline(e) {
			e.style.removeProperty("box-shadow");
		}
		for (const pair of filtered_backpack_pairs) {
			const [slot, item] = pair;
			const element = elementFromSlotAndSlotType(slot, SlotType.BACKPACK);
			if (outline_predicate(item)) {
				addOutline(element);
			} else {
				removeOutline(element);
			}
		}
		for (const pair of filtered_inventory_pairs) {
			const [slot, item] = pair;
			const element = elementFromSlotAndSlotType(slot, SlotType.INVENTORY);
			if (outline_predicate(item)) {
				addOutline(element);
			} else {
				removeOutline(element);
			}
		}
	}

	function main() {
		const player_items = new DeadFrontier.PlayerItems();
		const collection_book = new DeadFrontier.CollectionBook();
		const all_tradezones = Object.values(DeadFrontier.Tradezone);
		const tradezone_cache_pairs = Array.from(all_tradezones, (tradezone) => [tradezone, new DeadFrontier.MarketCache(tradezone)]);
		const caches = new Map(tradezone_cache_pairs); // MarketCache for each tradezone.
		// Sets containing types and renames requested for each tradezone.
		const types_requested = new Map(Array.from(all_tradezones, (tradezone) => [tradezone, new Set()]));
		const renames_requested = new Map(Array.from(all_tradezones, (tradezone) => [tradezone, new Set()]));
		const search_sequences_out = new Map(Array.from(all_tradezones, (tradezone) => [tradezone, false]));
		let current_tradezone = USE_TRADEZONE_OVERRIDE ? TRADEZONE_OVERRIDE : parseInt(userVars.DFSTATS_df_tradezone);
		// Tradezone selector.
		const tradezone_selector = selectTradezone();
		if (SHOW_TRADEZONE_DROPDOWN && (INNERCITY_INVENTORY || OUTPOST_INVENTORY)) {
			tradezone_selector.addEventListener("change", function(e) {
				current_tradezone = parseInt(e.target.value);
			});
			setTimeout(function() {
				const inventory_holder = document.getElementById("inventoryholder");
				inventory_holder.appendChild(tradezone_selector);
			}, 300);
		}
		// Request from market.
		const initial_wait_before_request = INNERCITY_INVENTORY ? 300 : 1800;
		const relevant_slots_available = ["inventory", "backpackdisplay"].map((e) => promiseWaitForElementId(e, 500));
		Promise.allSettled(relevant_slots_available)
		.then(function() {
			const mouseover_relevant_slots_promises = ["inventory", "backpackdisplay"].map((e) => promiseMouseenterElement(document.getElementById(e), initial_wait_before_request));
			return Promise.race(mouseover_relevant_slots_promises);
		})
		.catch(function() {
			// Do nothing if promises timeout.
		})
		.finally(function() {
			const categories = new Map(Array.from(all_tradezones, (tradezone) => [tradezone, []]));
			const types = new Map(Array.from(all_tradezones, (tradezone) => [tradezone, []]));
			const renames = new Map(Array.from(all_tradezones, (tradezone) => [tradezone, []]));
			let promise = Promise.resolve();
			// Scan for new items and request them.
			setInterval(function() {
				const tradezone_to_get = current_tradezone;
				const current_cache = caches.get(tradezone_to_get);
				// Check for new items and the categories, types, and renames they correspond to, then add them to the
				// next group of requests and note them as being requested.
				const new_categories = categoriesToRequest(player_items).filter((category) => !categories.get(tradezone_to_get).includes(category));
				categories.set(tradezone_to_get, categories.get(tradezone_to_get).concat(new_categories));
				const new_types = typesToRequest(player_items).filter((type) => !types.get(tradezone_to_get).includes(type));
				types.set(tradezone_to_get, types.get(tradezone_to_get).concat(new_types));
				const new_renames = renamesToRequest(player_items).filter((rename) => !renames.get(tradezone_to_get).includes(rename));
				renames.set(tradezone_to_get, renames.get(tradezone_to_get).concat(new_renames));
				const categories_for_search = new_types.length >= new_categories.length*4 ? new_categories : [];
				// NOTE: November 5, 2024: In practice, a full categorical search takes about 2 to 3 times longer to
				// resolve compared to an individual item search. So there needs to be more than three times as many types
				// as there are categories to justify searching by category first, as opposed to just searching items
				// individually (practically, let's say four times).
				const searches_required = new_categories.length > 0 || new_types.length > 0 || new_renames.length > 0;
				promise = promise
				.then(function() {
					if (searches_required) {
						search_sequences_out.set(tradezone_to_get, true);
						tradezone_selector.setAttribute("disabled", "");
						return requestMarketDataSequence(current_cache, categories_for_search, new_types, new_renames, types_requested.get(tradezone_to_get), renames_requested.get(tradezone_to_get));
					}
					return Promise.reject();
				})
				.catch(function() {
					// Do nothing if request errors or there is nothing to request.
				})
				.finally(function() {
					search_sequences_out.set(tradezone_to_get, false);
					tradezone_selector.removeAttribute("disabled");
				});
			}, 1000);
		});
		// setTimeout(function() {
		//
		// }, initial_wait_before_request);
		// Scrap Total.
		const infobox = document.getElementById("infoBox");
		const inventory_holder = document.getElementById("inventoryholder");
		const inventory = document.getElementById("inventory");
		const scrap_summary_container = scrapSummary(infobox);
		inventory_holder.appendChild(scrap_summary_container);
		if (SHOW_SCRAP_TOTAL && (INNERCITY_INVENTORY || OUTPOST_INVENTORY)) {
			const scrap_display = scrapCounter();
			const scrap_summary = scrap_summary_container.querySelector("div#dfmp-summary");
			setTimeout(function() {
				setInterval(function() {
					updateScrapTotal(player_items, scrap_display);
				}, 200);
				// Show/hide scrap summary on mouseover/mouseleave.
				scrap_display.addEventListener("mouseover", function(e) {
					if (!last_frame_dragging_item) {
						updateScrapSummary(player_items, scrap_summary);
						scrap_summary_container.style.visibility = "visible";
					}
				});
				const scrap_summary_rows = scrap_summary.querySelectorAll("table > tbody > tr");
				function hideScrapSummary(e) {
					scrap_summary_container.style.visibility = "hidden";
				}
				scrap_summary_container.addEventListener("mouseleave", hideScrapSummary);
				scrap_summary_container.addEventListener("mouseleave", function() {
					outlineSlots(player_items, scrapTotalBackpackFilter, scrapTotalInventoryFilter, (item) => false);
					scrap_summary_rows.forEach((row) => row.style.removeProperty("box-shadow"));
				});
				// Keeps the scrap summary up or removes it on click.
				let force_show_scrap_summary = false;
				scrap_summary_container.addEventListener("click", function(e) {
					if (!force_show_scrap_summary) {
						scrap_summary_container.removeEventListener("mouseleave", hideScrapSummary);
					} else {
						scrap_summary_container.addEventListener("mouseleave", hideScrapSummary);
						hideScrapSummary();
					}
					force_show_scrap_summary = !force_show_scrap_summary;
				});
				inventory.addEventListener("mouseenter", function(e) {
					if (!force_show_scrap_summary) {
						hideScrapSummary();
					}
				});
				// Highlights relevant categories when moused over.
				for (const row of scrap_summary_rows) {
					row.addEventListener("mouseenter", function(e) {
						const name = row.dataset.name;
						const predicate = SCRAP_SUMMARY_BREAKDOWN[name];
						outlineSlots(player_items, scrapTotalBackpackFilter, scrapTotalInventoryFilter, predicate);
						row.style.setProperty("box-shadow", "0 0 0 1px inset white");
					});
					row.addEventListener("mouseleave", function(e) {
						row.style.removeProperty("box-shadow");
					});
				}
				const total_row = scrap_summary.querySelector("table > tfoot > tr");
				total_row.addEventListener("mouseenter", function(e) {
					outlineSlots(player_items, scrapTotalBackpackFilter, scrapTotalInventoryFilter, (item) => false);
				});
			}, 300);
		}
		// Market Estimate.
		const market_summary_container = marketSummary(infobox);
		inventory_holder.appendChild(market_summary_container);
		if (SHOW_ESTIMATED_MARKET_TOTAL && (INNERCITY_INVENTORY || OUTPOST_INVENTORY)) {
			const market_display = marketCounter();
			const market_summary = market_summary_container.querySelector("div#dfmp-summary");
			setTimeout(function() {
				setInterval(function() {
					updateMarketEstimate(player_items, caches.get(current_tradezone), market_display, types_requested.get(current_tradezone), renames_requested.get(current_tradezone));
				}, 200);
				// Show/hide market summary on mouseover/mouseleave.
				market_display.addEventListener("mouseover", function(e) {
					const filtered_backpack_items = filteredBackpackItems(player_items, marketTotalBackpackFilter);
					const filtered_inventory_items = filteredInventoryItems(player_items, marketTotalInventoryFilter);
					const filtered_items = filtered_backpack_items.concat(filtered_inventory_items);
					const has_all_market_data = filtered_items.every((item) => attemptedMarketData(item, types_requested.get(current_tradezone), renames_requested.get(current_tradezone)));
					if (has_all_market_data && !last_frame_dragging_item) {
						updateMarketSummary(player_items, caches.get(current_tradezone), market_summary);
						market_summary_container.style.visibility = "visible";
					}
				});
				const market_summary_rows = market_summary.querySelectorAll("table > tbody > tr");
				function hideMarketSummary() {
					market_summary_container.style.visibility = "hidden";
				}
				market_summary_container.addEventListener("mouseleave", hideMarketSummary);
				market_summary_container.addEventListener("mouseleave", function() {
					outlineSlots(player_items, marketTotalBackpackFilter, marketTotalInventoryFilter, (item) => false);
					market_summary_rows.forEach((row) => row.style.removeProperty("box-shadow"));
				});
				// Keep the market summary up or remove it on click.
				let force_show_market_summary = false;
				market_summary_container.addEventListener("click", function(e) {
					if (!force_show_market_summary) {
						market_summary_container.removeEventListener("mouseleave", hideMarketSummary);
					} else {
						market_summary_container.addEventListener("mouseleave", hideMarketSummary);
						hideMarketSummary();
					}
					force_show_market_summary = !force_show_market_summary;
				});
				inventory.addEventListener("mouseenter", function(e) {
					if (!force_show_market_summary) {
						hideMarketSummary();
					}
				});
				// Highlight relevant categories when moused over.
				for (const row of market_summary_rows) {
					row.addEventListener("mouseenter", function(e) {
						const name = row.dataset.name;
						const predicate = MARKET_SUMMARY_BREAKDOWN[name];
						outlineSlots(player_items, marketTotalBackpackFilter, marketTotalInventoryFilter, predicate);
						row.style.setProperty("box-shadow", "0 0 0 1px inset white");
					});
					row.addEventListener("mouseleave", function(e) {
						row.style.removeProperty("box-shadow");
					});
				}
				const total_row = market_summary.querySelector("table > tfoot > tr");
				total_row.addEventListener("mouseenter", function(e) {
					outlineSlots(player_items, marketTotalBackpackFilter, marketTotalInventoryFilter, (item) => false);
				});
			}, 300);
		}
		// Highlight slots.
		if (HIGHLIGHT_SLOTS && (INNERCITY_INVENTORY || OUTPOST_INVENTORY)) {
			setTimeout(function() {
				setInterval(function() {
					highlightSlots(player_items, caches.get(current_tradezone), types_requested.get(current_tradezone), renames_requested.get(current_tradezone));
				}, 100);
			}, 300);
		}
		// Update infobox.
		const current_data_displayed = {item: undefined, market_data: undefined};
		let most_recent_start_time = performance.now();
		if (SHOW_COLLECTION_BOOK_STATUS) {
			collection_book.requestCollectionBookData()
			.then(function() {
				collection_book_loaded = true;
			});
		}
		setTimeout(function() {
			setInterval(function() {
				const current_slot = currentSlot(curInfoItem);
				const current_slot_type = currentSlotType(curInfoItem);
				const is_visible = isInfoboxVisible(infobox);
				if (!is_visible) {
					current_data_displayed.item = undefined;
					current_data_displayed.market_data = undefined;
					removeAddedElementsFromInfobox(infobox);
					return;
				}
				const valid_slot_type = [SlotType.INVENTORY, SlotType.BACKPACK].includes(current_slot_type);
				if (!valid_slot_type) {
					current_data_displayed.item = undefined;
					current_data_displayed.market_data = undefined;
					removeAddedElementsFromInfobox(infobox);
					return;
				}
				const current_item = itemFromSlotAndSlotType(player_items, current_slot, current_slot_type);
				const current_cache = caches.get(current_tradezone);
				const market_data = getMarketData(current_item, current_cache);
				const same_item = current_data_displayed.item !== undefined && current_data_displayed.item.full_type === current_item.full_type;
				const same_market_data = current_data_displayed.market_data !== undefined && current_data_displayed.market_data.length === market_data.length;
				const same_information = same_item && same_market_data;
				const elements_already_present = Array.from(infobox.children).filter((e) => e.hasAttribute("dfmp")).length > 0;
				if (same_information && elements_already_present) {
					return;
				}
				current_data_displayed.item = current_item;
				current_data_displayed.market_data = market_data;
				removeAddedElementsFromInfobox(infobox);
				most_recent_start_time = performance.now();
				const this_start_time = most_recent_start_time;
				promiseWaitForInfobox(infobox, 1000)
				.then(function() {
					if (this_start_time === most_recent_start_time) {
						const element = makeElementForInfobox(current_item, current_cache, collection_book);
						function absolute_info_element(e) {
							return e.style.getPropertyValue("position") === "absolute" && e.style.getPropertyValue("bottom") === "2px";
						}
						const infobox_contains_absolute_div = Array.from(infobox.childNodes).some(absolute_info_element);
						if (infobox_contains_absolute_div) {
							const breaks = Array.from(infobox.childNodes).filter(absolute_info_element)[0].querySelectorAll("br");
							element.style.setProperty("margin-bottom", `${15*(breaks.length + 1)}px`);
						}
						infobox.appendChild(element);
						repositionInfobox(infobox);
					}
				});
			}, 50);
		}, 300);
	}
	main();
})();
