// ==UserScript==
// @name        Dead Frontier - Discarding
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @grant       none
// @version     0.0.11
// @author      Shrike00
// @description Alternate discarding method.
// @require https://update.greasyfork.org/scripts/441829/1630783/Dead%20Frontier%20-%20API.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472537/Dead%20Frontier%20-%20Discarding.user.js
// @updateURL https://update.greasyfork.org/scripts/472537/Dead%20Frontier%20-%20Discarding.meta.js
// ==/UserScript==

// Changelog
// 0.0.11 - July 26, 2025
// - Change: Added hunger check scaling with survival stat.
// 0.0.10 - April 26, 2025
// - Bugfix: Fixed use button alignment.
// 0.0.9 - April 25, 2025
// - Bugfix: Fixed backpack functions.
// 0.0.8 - April 25, 2025
// - Feature: Added backpack.
// - Feature: Added option to display additional market price data.
// - Change: Added full names to items.
// - Change: Fixed formatting for buttons.
// 0.0.7 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.6 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.5 - February 24, 2024
// - Bugfix: No longer errors if no market entries pass the item filter.
// - Feature: Added tradezone override for market search.
// 0.0.4 - February 22, 2024
// - Bugfix: Properly prevents discard based on market price.
// 0.0.3 - February 22, 2024
// - Change: Updated with general search that should work for more items.
// 0.0.2 - August 10, 2023
// - Change: Now confirms pop-up with enter key.


(function() {
	'use strict';

	const use_tradezone_override = false;
	const tradezone_override = DeadFrontier.Tradezone.CAMP_VALCREST; // Set to DeadFrontier.Tradezone.OUTPOST to use shared outpost tradezone.

	// User Options

	const show_additional_place_price = false; // Shows additional place price.
	const additional_place = 5

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

	const discard_categories = [
		{name: "Consumables", predicate: isConsumable},
		{name: "Ammo", predicate: isAmmo},
		{name: "Equipment", predicate: isEquipment},
		{name: "Other", predicate: (item) => true}
	];

	// Add in item types that are non-lootable or non-transferable but commonly discarded here.
	const whitelist_types = new Set();
	function discardItemPredicate(item) {
		const globaldata = globalData;
		const data = globaldata[item.base_type];
		const transferable = !("no_transfer" in data) || data.no_transfer !== "1";
		const lootable = !("noloot" in data) || data.noloot !== "1";
		return (transferable && lootable) || whitelist_types.has(item.base_type);
	}

	function warnMarketPrice(scrap_price, market_price) {
		const flat_threshold = 50000;
		const warn = market_price > flat_threshold || scrap_price > flat_threshold;
		return warn;
	}

	function preventMarketPrice(scrap_price, market_price) {
		const flat_difference = 100000;
		const prevent = market_price - scrap_price > flat_difference;
		return prevent;
	}

	// Imports

	const ItemCategory = DeadFrontier.ItemCategory;
	const ItemSubcategory = DeadFrontier.ItemSubcategory;

	// Globals
	const outpost_inventory = window.location.href.indexOf("fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25") !== -1;
	const innercity_inventory = window.location.href.indexOf("fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31") !== -1;

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

	function isUsable(item) {
		return item.category === ItemCategory.ITEM && (item.subcategory === ItemSubcategory.FOOD || item.subcategory === ItemSubcategory.MEDICINE);
	}

	function needHealing() {
		const uservars = userVars;
		const current_hp = parseInt(uservars["DFSTATS_df_hpcurrent"]);
		const max_hp = parseInt(uservars["DFSTATS_df_hpmax"]);
		return current_hp < max_hp;
	}

	function needFood() {
		const uservars = userVars;
		const current_hunger = parseInt(uservars["DFSTATS_df_hungerhp"]);
		const maximum_hunger = parseInt(Math.round(50 + parseFloat(uservars["DFSTATS_df_survival"])*1.5));
		return current_hunger < maximum_hunger;
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

	function updateCacheFromInventoryAndBackpack(market_cache, player_items) {
		// Requests all items from inventory.
		return promiseInventoryAvailable(player_items)
		.then(function() {
			const inventory_base_types = Array.from(player_items.inventoryItems()).map((e) => e[1].base_type);
			const backpack_base_types = Array.from(player_items.backpackItems()).map((e) => e[1].base_type);
			const all_base_types = inventory_base_types.concat(backpack_base_types);
			return market_cache.requestMultipleItemMarketEntriesByType(all_base_types);
		});
	}

	function updateMissingCacheFromInventoryAndBackpack(market_cache, player_items) {
		// Only requests missing items from cache.
		return promiseInventoryAvailable(player_items)
		.then(function() {
			const inventory_base_types = Array.from(player_items.inventoryItems()).filter((e) => !market_cache.hasItemType(e[1].base_type));
			const backpack_base_types = Array.from(player_items.backpackItems()).filter((e) => !market_cache.hasItemType(e[1].base_type));
			const all_base_types = inventory_base_types.concat(backpack_base_types);
			return market_cache.requestMultipleItemMarketEntriesByType(all_base_types);
		})
	}

	function mean(array) {
		const sum = array.reduce((v1, v2) => v1 + v2);
		return sum/array.length;
	}

	function median(sorted_array) {
		const length = sorted_array.length;
		if (length % 2 === 1) {
			return sorted_array[Math.floor(length/2)];
		} else {
			const first = sorted_array[length/2];
			const second = sorted_array[length/2 - 1];
			return (first + second)/2;
		}
	}

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

	// UI

	function discardingContainer() {
		const box = document.createElement("div");
		box.style.setProperty("position", "absolute");
		box.style.setProperty("display", "grid");
		box.style.setProperty("width", "99%");
		box.style.setProperty("max-width", "694px");
		box.style.setProperty("height", "99%");
		if (outpost_inventory) {
			box.style.setProperty("max-height", "536px");
		} else if (innercity_inventory) {
			box.style.setProperty("max-height", "560px");
		}
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

	function discardIcon() {
		const inventory_holder = document.getElementById("inventoryholder");
		for (let i = 0; inventory_holder.children.length; i++) {
			const child = inventory_holder.children[i];
			if (child.dataset.action === "discard") {
				return child;
			}
		}
		return undefined;
	}

	function discardTitle() {
		const title = document.createElement("div");
		title.style.setProperty("font-size", "18px");
		title.style.setProperty("margin-top", "5px");
		title.style.setProperty("margin-bottom", "-30px");
		title.style.setProperty("font-weight", "bold");
		title.style.setProperty("color", "#D0D0D0");
		title.style.setProperty("text-shadow", "0 0 5px red");
		title.style.setProperty("font-family", "Courier New, Arial");
		title.style.setProperty("text-align", "center");
		title.innerHTML = "Discarding";
		return title;
	}

	function setWarningHidden() {
		// Hides pop-up warning.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		prompt.removeAttribute("style");
		gamecontent.removeAttribute("class");
	}

	function setWarningVisible(text, yesCallback, noCallback) {
		// Shows pop-up warning/prompt.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		// Warning message
		prompt.style.setProperty("display", "block");
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
	}

	function setLoadingVisible() {
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.setProperty("text-align", "center");
		gamecontent.innerHTML = "Loading...";
		prompt.style.setProperty("display", "block");
	}

	function discardScrollingFrame() {
		const frame = document.createElement("div");
		frame.style.setProperty("overflow-y", "scroll");
		frame.style.setProperty("border", "1px solid #990000");
		frame.style.setProperty("position", "relative");
		if (outpost_inventory) {
			frame.style.setProperty("height", "465px");
		} else if (innercity_inventory) {
			frame.style.setProperty("height", "485px");
		}
		frame.style.setProperty("width", "640px");
		frame.style.setProperty("bottom", "5px");
		return frame;
	}

	function headerElement(name) {
		const header = document.createElement("tr");
		header.innerHTML = name;
		header.style.setProperty("font-weight", "bold");
		header.style.setProperty("font-size", "14px");
		header.style.setProperty("color", "white");
		return header;
	}

	function displayName(item) {
		const base_name = item.base_name;
		const is_renamed = item.properties.has("rename");
		const name = is_renamed ? item.properties.get("rename") : base_name;
		if (item.category === DeadFrontier.ItemCategory.WEAPON && DeadFrontier.ItemFilters.Mastercrafted(item)) {
			const accuracy = item.properties.get("accuracy").toString();
			const reloading = item.properties.get("reloading").toString();
			const critical_hit = item.properties.get("critical_hit").toString();
			return name + " (" + accuracy + "/" + reloading + "/" + critical_hit + ")";
		} else if (item.category === DeadFrontier.ItemCategory.ARMOUR && DeadFrontier.ItemFilters.Mastercrafted(item)) {
			const agility = item.properties.get("agility").toString();
			const endurance = item.properties.get("endurance").toString();
			return name + " (" + agility + "/" + endurance + ")";
		} else if (item.category === DeadFrontier.ItemCategory.BACKPACK && DeadFrontier.ItemFilters.Mastercrafted(item)) {
			const bonus_slots = item.properties.get("bonus_slots").toString();
			return name + " (+" + bonus_slots + " slots)";
		} else if (isStackable(item)) {
			const quantity = item.quantity.toString();
			return name + " (" + quantity  + ")";
		} else if (DeadFrontier.ItemFilters.Cooked(item))  {
			return "Cooked " + name;
		} else {
			return name;
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

	function discardButton() {
		const discard_button = document.createElement("button");
		discard_button.innerHTML = "Discard";
		discard_button.style.setProperty("margin-left", "20px");
		discard_button.style.setProperty("margin-top", "4px");
		discard_button.style.setProperty("margin-bottom", "4px");
		discard_button.style.setProperty("margin-right", "4px");
		return discard_button;
	}

	function useButton() {
		const use_button = document.createElement("button");
		use_button.innerHTML = "Use";
		use_button.style.setProperty("margin-left", "20px");
		use_button.style.setProperty("margin-top", "4px");
		use_button.style.setProperty("margin-bottom", "4px");
		use_button.style.setProperty("margin-right", "4px");
		return use_button;
	}

	function averageInventoryPrice(player_items, market_cache) {
		const items = player_items.inventoryItems();
		const prices = [];
		for (const [slot, item] of items) {
			if (lockedSlots.includes(slot.toString())) {
				continue;
			}
			if (!discardItemPredicate(item)) {
				continue;
			}
			const scrap_value = scrapValue(item.full_type, item.quantity);
			let cheapest_market_price = null;
			if (market_cache.hasItemType(item.base_type)) {
				const item_market_data = market_cache.getItemMarketEntriesByType(item.base_type);
				const filtered_entries = item_market_data.filter(marketFilter(item));
				if (filtered_entries.length > 0) {
					const cheapest_market_entry = filtered_entries[0];
					const cheapest_market_item = cheapest_market_entry.item;
					cheapest_market_price = isStackable(item) ? Math.floor((cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity) : cheapest_market_entry.price;
				} else {
					cheapest_market_price = 0;
				}
			} else {
				cheapest_market_price = 0;
			}
			prices.push(Math.max(cheapest_market_price, scrap_value));
		}
		if (prices.length > 0) {
			prices.sort((a, b) => a > b);
			return [mean(prices), median(prices)];
		} else {
			return [0, 0];
		}
	}

	function updateDiscardItems(table, player_items, market_cache) {
		// TODO: Calculate average inventory price.
		table.replaceChildren(); // Remove children
		// Create header elements
		const headers = discard_categories.map((category) => headerElement(category.name));
		headers.forEach((header) => table.appendChild(header));
		// Stores information about each table row
		const item_category_data = new Map();
		discard_categories.forEach((category) => item_category_data.set(category.name, []));
		const [mean_value, median_value] = averageInventoryPrice(player_items, market_cache);
		// console.log(mean_value, median_value);
		const inventory_items = Array.from(player_items.inventoryItems()).map((e) => e.concat(["inventory"]));
		const backpack_items = Array.from(player_items.backpackItems()).map((e) => e.concat(["backpack"]));
		const all_items = inventory_items.concat(backpack_items);
		for (const [slot, item, slot_type] of all_items) {
			// Skip if item is in locked slot or does not pass predicate (by default, ignores non-transferable and non-lootable items).
			const is_locked = (slot_type === "inventory" && player_items.isLockedSlot(slot) || slot_type === "backpack" && player_items.isLockedBackpackSlot(slot));
			if (is_locked) {
				continue;
			}
			if (!discardItemPredicate(item)) {
				continue;
			}
			// Creates row element
			const tr = document.createElement("tr");
			tr.style.setProperty("font-size", "12px");
			tr.style.setProperty("color", "white");
			// Item name
			const name = itemNameDatum(displayName(item));
			// Item scrap price
			const scrap_value = scrapValue(item.full_type, item.quantity);
			const scrap_price = scrapPriceDatum("$" + scrap_value.toLocaleString())
			// Item market price
			let market_price = null;
			let cheapest_market_price = null;
			let additional_place_market_price_text = "N/A";
			if (market_cache.hasItemType(item.base_type)) {
				const item_market_data = market_cache.getItemMarketEntriesByType(item.base_type);
				const filtered_entries = item_market_data.filter(marketFilter(item));
				if (filtered_entries.length > 0) {
					const cheapest_market_entry = filtered_entries[0];
					const cheapest_market_item = cheapest_market_entry.item;
					cheapest_market_price = isStackable(item) ? Math.floor((cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity) : cheapest_market_entry.price;
					market_price = marketPriceDatum("$" + cheapest_market_price.toLocaleString());
					const has_additional_place = additional_place <= filtered_entries.length;
					if (has_additional_place) {
						const additional_placed_market_entry = filtered_entries[additional_place - 1];
						const additional_placed_market_item = additional_placed_market_entry.item;
						const additional_placed_market_price = isStackable(item) ? (additional_placed_market_entry.price/additional_placed_market_item.quantity)*item.quantity : additional_placed_market_entry.price;
						const additional_displayed_market_price = Number.isInteger(additional_placed_market_price) ? additional_placed_market_price : nearest(additional_placed_market_price, 0.01);
						additional_place_market_price_text = "$" + (Number.isInteger(additional_displayed_market_price) ? additional_displayed_market_price.toLocaleString() : additional_displayed_market_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
						if (show_additional_place_price) {
							const additional_price_info = document.createElement("div");
							additional_price_info.style.setProperty("font-size", "10px");
							additional_price_info.innerHTML = numberToPlace(additional_place) + ": " + additional_place_market_price_text;
							market_price.append(additional_price_info);
						}
					}
				} else {
					cheapest_market_price = 0;
					market_price = marketPriceDatum("N/A");
				}
			} else {
				cheapest_market_price = 0;
				market_price = marketPriceDatum("N/A");
			}
			// Item discard and use button
			const discard_button = discardButton();
			discard_button.addEventListener("mouseenter", function(e) {
				tr.style.setProperty("font-weight", "bold");
				tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
			});
			discard_button.addEventListener("mouseleave", function(e) {
				tr.style.removeProperty("font-weight");
				tr.style.removeProperty("box-shadow");
			});
			const use_button = useButton();
			use_button.addEventListener("mouseenter", function(e) {
				tr.style.setProperty("font-weight", "bold");
				tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
			});
			use_button.addEventListener("mouseleave", function(e) {
				tr.style.removeProperty("font-weight");
				tr.style.removeProperty("box-shadow");
			});
			if (isUsable(item)) {
				const can_use_food = item.subcategory === ItemSubcategory.FOOD && needFood();
				const can_use_medicine = item.subcategory === ItemSubcategory.MEDICINE && needHealing();
				const no_need = !can_use_food && !can_use_medicine;
				if (no_need) {
					use_button.setAttribute("disabled", true);
				}
			} else {
				use_button.setAttribute("hidden", true);
			}
			// Discard Button Event Listeners
			const warn_discard = warnMarketPrice(scrap_value, cheapest_market_price);
			const prevent_discard = preventMarketPrice(scrap_value, cheapest_market_price);
			const item_value = Math.max(scrap_value, cheapest_market_price);
			const discard_function = slot_type === "inventory" ? player_items.discardInventoryItem.bind(player_items) : player_items.discardBackpackItem.bind(player_items);
			if (prevent_discard) {
				tr.style.setProperty("color", "red");
				discard_button.style.setProperty("display", "none");
			} else if (warn_discard || item_value >= median_value) {
				tr.style.setProperty("color", "red");
				discard_button.addEventListener("click", function(e) {
					const text = "This item sells for <span style=\"color: red;\">$" + cheapest_market_price.toLocaleString() + "</span> and scraps for <span style=\"color: red;\">$" + scrap_value.toLocaleString() + "</span>.<br>Are you sure you want to discard this item?";
					setWarningVisible(text, function() {
						discard_function(slot, item)
						.then(function() {
							updateDiscardItems(table, player_items, market_cache);
							setWarningHidden();
						});
					}, setWarningHidden);
				});
			} else {
				discard_button.addEventListener("click", function(e) {
					setLoadingVisible();
					discard_function(slot, item)
					.then(function() {
						setLoadingHidden();
						updateDiscardItems(table, player_items, market_cache);
					});
				});
			}
			const use_function = slot_type === "inventory" ? player_items.useInventoryItem.bind(player_items) : player_items.useBackpackItem.bind(player_items);
			use_button.addEventListener("click", function(e) {
				setLoadingVisible();
				use_function(slot, item)
				.then(function() {
					setLoadingHidden();
					if (item.subcategory === ItemSubcategory.FOOD) {
						playSound("eat");
					} else if (item.subcategory === ItemSubcategory.MEDICINE) {
						playSound("heal");
					}
					updateDiscardItems(table, player_items, market_cache);
				})
			});
			// Adding to arrays (to be sorted and added to table).
			tr.appendChild(name);
			tr.appendChild(market_price);
			tr.appendChild(scrap_price);
			const discard_button_td = document.createElement("td");
			discard_button_td.style.setProperty("width", "65px");
			discard_button_td.appendChild(discard_button);
			tr.appendChild(discard_button_td);
			const use_button_td = document.createElement("td");
			use_button_td.style.setProperty("width", "55px");
			use_button_td.appendChild(use_button);
			tr.appendChild(use_button_td);
			// Adds data about each table row to map
			const data = {element: tr, full_type: item.full_type, quantity: item.quantity, market_price: cheapest_market_price};
			for (let i = 0; i < discard_categories.length; i++) {
				const category = discard_categories[i];
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
			const price_a = a.market_price;
			const price_b = b.market_price;
			const value_a = Math.max(scrap_a, price_a);
			const value_b = Math.max(scrap_b, price_b);
			if (value_a === value_b) {
				return a.full_type > b.full_type;
			} else {
				return value_a > value_b;
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

	function tableKeys() {
		const keys = document.createElement("div");
		keys.style.setProperty("margin-top", "10px");
		keys.style.setProperty("margin-bottom", "-15px");
		keys.style.setProperty("font-size", "14px");
		keys.style.setProperty("font-weight", "bold");
		keys.style.setProperty("color", "white");
		const name = document.createElement("span");
		name.style.setProperty("position", "absolute");
		name.style.setProperty("top", "23px");
		name.style.setProperty("left", "33px");
		name.innerHTML = "Item Name";
		keys.appendChild(name);
		const market_price = document.createElement("span");
		market_price.style.setProperty("position", "absolute");
		market_price.style.setProperty("top", "23px");
		market_price.style.setProperty("left", "310px");
		market_price.innerHTML = "Market Price";
		keys.appendChild(market_price);
		const scrap_price = document.createElement("span");
		scrap_price.style.setProperty("position", "absolute");
		scrap_price.style.setProperty("top", "23px");
		scrap_price.style.setProperty("left", "430px");
		scrap_price.innerHTML = "Scrap Price";
		if (innercity_inventory) {
			name.style.setProperty("left", "38px");
			market_price.style.setProperty("left", "315px");
			scrap_price.style.setProperty("left", "437px");
		}
		keys.appendChild(scrap_price);
		return keys;
	}

	// Main

	function main() {
		const player_items = new DeadFrontier.PlayerItems();
		const tradezone = use_tradezone_override ? tradezone_override : parseInt(userVars.DFSTATS_df_tradezone);
		const market_cache = new DeadFrontier.MarketCache(tradezone);
		const flash_replace = document.getElementById("inventoryholder").parentNode;
		const positioner = document.createElement("div");
		positioner.style.setProperty("position", "absolute");
		positioner.style.setProperty("width", "100%");
		positioner.style.setProperty("height", "100%");
		positioner.style.setProperty("display", "grid");
		positioner.style.setProperty("align-content", "center");
		positioner.style.setProperty("top", "0px");
		if (innercity_inventory) {
			positioner.style.setProperty("left", "31.7%");
		}
		positioner.style.setProperty("display", "none");
		const container = discardingContainer();
		flash_replace.appendChild(positioner);
		positioner.appendChild(container);
		const title = discardTitle();
		container.appendChild(title);
		container.appendChild(tableKeys());
		const scrapping_frame = discardScrollingFrame();
		container.appendChild(scrapping_frame);
		const cancel_button = cancelButton();
		container.appendChild(cancel_button);
		const table = document.createElement("table");
		table.style.setProperty("margin-bottom", "4px");
		table.style.setProperty("table-layout", "fixed");
		let last_request_time = null;
		scrapping_frame.appendChild(table);
		discardIcon().addEventListener("click", function(e) {
			setLoadingVisible();
			const now = performance.now();
			updateCacheFromInventoryAndBackpack(market_cache, player_items)
			.then(function() {
				last_request_time = now;
				updateDiscardItems(table, player_items, market_cache);
				promiseWait(100) // Wait for DOM to update.
				.then(function() {
					positioner.style.setProperty("display", "grid");
					setLoadingHidden();
				});
			});
		});
		cancel_button.addEventListener("click", function(e) {
			positioner.style.setProperty("display", "none");
		});
	};
	main();
})();
