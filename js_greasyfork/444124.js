// ==UserScript==
// @name        Dead Frontier - Selling Lists
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant       none
// @version     0.0.18
// @author      Shrike00
// @description Alternate selling lists.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @license     MIT

// @downloadURL https://update.greasyfork.org/scripts/444124/Dead%20Frontier%20-%20Selling%20Lists.user.js
// @updateURL https://update.greasyfork.org/scripts/444124/Dead%20Frontier%20-%20Selling%20Lists.meta.js
// ==/UserScript==

// Changelog
// 0.0.18 - May 11, 2025
// - Feature: Added custom undercut values and the ability to choose to undercut market or scrap.
// 0.0.17 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.16 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.15 - February 21, 2025
// - Bugfix: Now properly handles nothing on market case.
//           Reported by kik0001 on Discord.
// 0.0.14 - November 9, 2024
// - Bugfix: Resolved issue with not adding selling buttons to selling tab initially on Tampermonkey.
//           Reported by lucky11 (and archadria).
// 0.0.13 - October 25, 2024
// - Bugfix: Removed conflict with private trades.
//           Reported by lucky11.
// 0.0.12 - October 24, 2024
// - Bugfix: Added per-unit pricing for credits.
// - Bugfix: Added support for renamed items.
// 0.0.11 - February 24, 2024
// - Change: Renames and mastercrafted backpacks now display properly.
// 0.0.10 - February 24, 2024
// - Change: Updated backpack filters.
// 0.0.9 - February 22, 2024
// - Change: Updated with new general search that should work for more items.
// 0.0.8 - December 15, 2023
// - Change: Updated with new stocking search.
// 0.0.7 - October 24, 2023
// - Feature: Added short scale number when manually entering price.
// - Change: Added "Cooked" to cooked items.
// - Improvement: No longer requests non-tradable and locked slots, and made checks more aggressive.
// 0.0.6 - December 24, 2022
// - Change: Added Christmas Stocking 2022.
// 0.0.5 - November 20, 2022
// - Bug fix: Selling buttons show up all the time.
// - Bug fix: Improved calculated pricing of ammo stacks to not undercut your own entries.
// - Bug fix: Shows non-integer prices with two decimal places.
// - Improvement: Showed more accurate pricing for ammo stacks in Cancel Sales.
// 0.0.4 - October 30, 2022
// - Change: Trying to undercut below the scrap price pops up a confirmation request.
// - Bug fix: Moving to the item-for-item panel and then back retains the buttons.
// - Bug fix: Improved estimation of same price for ammo stacks by using an epsilon (since calculation is based on per-unit values).
// 0.0.3 - October 6, 2022
// - Bug fix: Improved comma formatting for non-integer numbers.
// - Improvement: Option to show additional place price depending on what place is requested.
// 0.0.2 - June 6, 2022
// - Change: Post sale price now accounts for previous price for ammo stacks and adjusts initial suggested price.
// - Change: Item name in sale pop-up is more detailed.
// - Change: Shows warning if no market entries for the item are available.
// 0.0.1 - June 4, 2022
// - Initial release


(function() {
	'use strict';

	// User Options
	const show_additional_place_price = false; // Shows additional place price.

	function additionalPlace(requested_place) {
		// Option to display additional price data under primary place price data.
		if (requested_place < 5) {
			return 5;
		} else if (requested_place < 10) {
			return 10;
		} else if (requested_place < 20) {
			return 20;
		} else if (requested_place < 50) {
			return 50;
		} else {
			return false;
		}
	}

	function isEquipment(item) {
		const weapon = item.category === ItemCategory.WEAPON;
		const armour = item.category === ItemCategory.ARMOUR;
		const equipable_item = item.category === ItemCategory.ITEM && (item.subcategory === ItemSubcategory.IMPLANT || item.subcategory === ItemSubcategory.CLOTHING);
		return weapon || armour || equipable_item;
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

	const posting_categories = [
		{name: "Equipment", predicate: isEquipment},
		{name: "Consumables", predicate: isConsumable},
		{name: "Ammo", predicate: isAmmo},
		{name: "Other", predicate: (item) => true}
	]

	const selling_categories = [
		{name: "Equipment", predicate: isEquipment},
		{name: "Consumables", predicate: isConsumable},
		{name: "Ammo", predicate: isAmmo},
		{name: "Other", predicate: (item) => true}
	];

	function warnMarketSelling(my_price, market_price) {
		// Return true to display warning message for posting a sale.
		const absolute_price_threshold = 10000;
		const percentage_price_threshold = 0.70;
		return (market_price - my_price > absolute_price_threshold) || (market_price*percentage_price_threshold > my_price);
	}

	function warnMarketOver(my_price, market_price, my_place) {
		// Return true to highlight a sale posting.
		const place_threshold = 20;
		const absolute_price_threshold = 10000;
		const percentage_price_threshold = 0.70;
		return my_place === null || my_place > place_threshold || (my_price - market_price > absolute_price_threshold) || (my_price*percentage_price_threshold > market_price);
	}

	// Imports

	const ItemCategory = DeadFrontier.ItemCategory;
	const ItemSubcategory = DeadFrontier.ItemSubcategory;

	// Helpers

	function nearest(n, pivot) {
		// Rounds to closest pivot value. nearest(154.29, 0.2) == 154.20, for example. Format using toFixed(n) if
		// displaying or converting to string.
		return Math.round(n/pivot)*pivot;
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function promiseWait(dt) {
		const promise = new Promise(function(resolve, reject) {
			setTimeout(function() {
				resolve();
			}, dt);
		});
		return promise;
	}

	function promiseElementId(element_id, dt = 200) {
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				const element = document.getElementById(element_id);
				if (element !== null) {
					clearInterval(check);
					resolve(element);
				}
			})
		}, dt);
		return promise;
	}

	function promiseInventoryAvailable(player_items, dt = 500) {
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				if (player_items.inventoryAvailable()) {
					clearInterval(check);
					resolve();
				}
			}, dt);
		});
		return promise;
	}

	function promiseSellingListAvailable(market_items, dt = 500) {
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				if (market_items.sellingEntriesAvailable()) {
					clearInterval(check);
					resolve();
				}
			}, dt);
		});
		return promise;
	}

	function updateCacheFromSelling(cache, market_items) {
		return market_items.requestSelling()
		.then(function() {
			return promiseSellingListAvailable(market_items);
		})
		.then(function() {
			const selling_entries = Array.from(market_items.sellingEntries()).map((e) => e[1]);
			const base_types = [];
			for (let i = 0; i < selling_entries.length; i++) {
				const selling_entry = selling_entries[i];
				const item = selling_entry.market_entry.item;
				const is_renamed = item.properties.has("rename");
				if (!is_renamed) {
					base_types.push(item.base_type);
				}
			}
			return cache.requestMultipleItemMarketEntriesByType(base_types);
		})
		.then(function() {
			const selling_entries = Array.from(market_items.sellingEntries()).map((e) => e[1]);
			const renames = [];
			for (let i = 0; i < selling_entries.length; i++) {
				const selling_entry = selling_entries[i];
				const item = selling_entry.market_entry.item;
				const is_renamed = item.properties.has("rename");
				if (is_renamed) {
					renames.push(item.properties.get("rename"));
				}
			}
			return cache.requestMultipleItemMarketEntriesByRename(renames);
		});
	}

	function updateCacheFromInventory(cache, player_items) {
		return promiseInventoryAvailable(player_items, 100)
		.then(function() {
			const types_to_request = [];
			const base_types = Array.from(player_items.inventoryItems()).map((e) => e[1].base_type);
			for (const [slot, item] of player_items.inventoryItems()) {
				const transferable = item.properties.get("transferable");
				const locked_slot = player_items.isLockedSlot(slot);
				const is_renamed = item.properties.has("rename");
				if (transferable && !locked_slot && !is_renamed) {
					types_to_request.push(item.base_type);
				}
			}
			return cache.requestMultipleItemMarketEntriesByType(types_to_request);
		})
		.then(function() {
			const renames_to_request = [];
			for (const [slot, item] of player_items.inventoryItems()) {
				const transferable = item.properties.get("transferable");
				const locked_slot = player_items.isLockedSlot(slot);
				const is_renamed = item.properties.has("rename");
				if (transferable && !locked_slot && is_renamed) {
					renames_to_request.push(item.properties.get("rename"));
				}
			}
			return cache.requestMultipleItemMarketEntriesByRename(renames_to_request);
		});
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

	function getPlace(market_entry, market_entries) {
		const filtered_entries = market_entries.filter(marketFilter(market_entry.item));
		for (let i = 0; i < filtered_entries.length; i++) {
			if (market_entry.trade_id === filtered_entries[i].trade_id) {
				return i + 1;
			}
		}
		return null;
	}

	function marketEntryIsMine(market_items, market_entry) {
		const my_market_entries = Array.from(market_items.sellingEntries()).map((e) => e[1].market_entry);
		const entry_is_mine = my_market_entries.find((e) => e.trade_id === market_entry.trade_id) !== undefined;
		return entry_is_mine;
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

	function setPricePromptHidden() {
		// Hides pop-up warning.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.removeProperty("border");
		prompt.removeAttribute("style");
		gamecontent.removeAttribute("class");
	}

	function priceInputValid(value, min, max) {
		const digit_match = /^[0-9]+$/;
		const input_valid = value >= min && value <= max && digit_match.test(value);
		return input_valid;
	}

	function priceText(value) {
		value = parseInt(value);
		if (value === 0) {
			return "$0";
		}
		const order = Math.floor(Math.log10(value));
		let engineering_exponent = Math.floor(order - (order % 3));
		let engineering_significand = value/(10.0**engineering_exponent);
		const round_up = nearest(engineering_significand, 0.01) === 1000;
		if (round_up) {
			engineering_significand /= 1000;
			engineering_exponent += 3;
		}
		let postfix = "";
		if (engineering_exponent === 0) {
			postfix = "";
		} else if (engineering_exponent === 3) {
			postfix = "k";
		} else if (engineering_exponent === 6) {
			postfix = "M";
		} else if (engineering_exponent === 9) {
			postfix = "B";
		} else if (engineering_exponent === 12) {
			postfix = "T";
		}
		if (engineering_exponent === 0) {
			return "$" + engineering_significand;
		} else {
			return "$" + engineering_significand.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}) + postfix;
		}
	}

	function resetGameContent() {
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.setProperty("height", "100px");
		gamecontent.style.removeProperty("border");
	}

	function setPricePromptVisible(text, yesCallback, noCallback, initial_value="") {
		// Shows pop-up warning/prompt.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		gamecontent.style.setProperty("height", "110px");
		gamecontent.style.setProperty("border", "red 1px solid");
		// Message
		const message_div = document.createElement("div");
		prompt.style.setProperty("display", "block");
		message_div.style.setProperty("position", "absolute");
		message_div.style.setProperty("top", "5px");
		message_div.style.setProperty("font-family", "\"Courier New CE\", Arial");
		message_div.style.setProperty("font-weight", "bold");
		message_div.style.setProperty("color", "white");
		message_div.style.setProperty("text-align", "center");
		message_div.innerHTML = text;
		// Price Input
		const price_div = document.createElement("div");
		price_div.style.setProperty("position", "absolute");
		price_div.style.setProperty("bottom", "25px");
		price_div.style.setProperty("left", "35px");
		const label = document.createElement("label");
		label.innerHTML = "$";
		label.style.setProperty("color", "rgb(255, 255, 0)");
		gamecontent.appendChild(label);
		const input = document.createElement("input");
		input.type = "number";
		input.max = 999999999;
		input.min = 0;
		input.value = initial_value;
		price_div.appendChild(label);
		price_div.appendChild(input);
		gamecontent.appendChild(message_div);
		gamecontent.appendChild(price_div);
		// Buttons
		const noButton = document.createElement("button");
		noButton.style.position = "absolute";
		noButton.style.top = "92px";
		noButton.style.left = "151px";
		noButton.innerHTML = "No";
		noButton.addEventListener("click", function() {
			resetGameContent();
			noCallback();
		});
		gamecontent.appendChild(noButton);
		const yesButton = document.createElement("button");
		yesButton.style.position = "absolute";
		yesButton.style.left = "86px";
		yesButton.style.top = "92px";
		yesButton.innerHTML = "Yes";
		yesButton.addEventListener("click", function() {
			resetGameContent();
			yesCallback(input.value);
		});
		gamecontent.appendChild(yesButton);
		// Set initial value of yes button.
		const input_valid = priceInputValid(input.value, input.min, input.max);
		if (input_valid) {
			yesButton.removeAttribute("disabled");
		} else {
			yesButton.setAttribute("disabled", true);
		}
		// Focus input and only make yes button enabled if input is valid.
		input.focus();
		function updatePriceText(value) {
			const price = value === "" ? priceText(0) : priceText(value);
			message_div.innerHTML = text + "<br><span style=\"color: yellow;\">" + price + "</span>"
		}
		updatePriceText(input.value);
		input.oninput = function(e) {
			input.value = clamp(input.value, input.min, input.max);
			const input_valid = priceInputValid(input.value, input.min, input.max);
			if (input_valid) {
				updatePriceText(input.value);
				yesButton.removeAttribute("disabled");
			} else {
				yesButton.setAttribute("disabled", true);
			}
		}
		// Enter hotkey for selling.
		let debounce = true; // Avoid sending sell request if one has already been sent.
		gamecontent.onkeydown = function(e) {
			const input_valid = priceInputValid(input.value, input.min, input.max);
			const enter_pressed = e.code === "Enter" || e.code === "NumpadEnter";
			if (debounce && input_valid && enter_pressed) {
				debounce = false;
				Promise.resolve(yesCallback(input.value))
				.then(function() {
					resetGameContent();
					debounce = true;
				});
			}
		}
		return input;
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
	}

	function postSalesButton() {
		const button = document.createElement("button");
		button.innerHTML = "post sales";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("top", "340px");
		button.style.setProperty("left", "590px");
		// button.style.setProperty("top", "325px");
		// button.style.setProperty("left", "255px");
		return button;
	}

	function salesContainer() {
		const box = document.createElement("div");
		box.style.setProperty("position", "absolute");
		box.style.setProperty("display", "none");
		box.style.setProperty("width", "99%");
		box.style.setProperty("height", "99.7%");
		box.style.setProperty("top", "0px");
		box.style.setProperty("left", "0px");
		box.style.setProperty("margin", "0 auto");
		box.style.setProperty("justify-content", "center");
		box.style.setProperty("z-index", 20);
		box.style.setProperty("background-color", "rgba(0, 0, 0, 1)")
		box.style.setProperty("border", "1px solid red");
		return box;
	}

	function closeContainerButton() {
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

	function titleBlock(title_text) {
		const title = document.createElement("div");
		title.style.setProperty("font-size", "18px");
		title.style.setProperty("margin-top", "5px");
		title.style.setProperty("margin-bottom", "-30px");
		title.style.setProperty("font-weight", "bold");
		title.style.setProperty("color", "#D0D0D0");
		title.style.setProperty("text-shadow", "0 0 5px red");
		title.style.setProperty("font-family", "Courier New, Arial");
		title.innerHTML = title_text;
		return title;
	}

	function placeInput() {
		const input = document.createElement("input");
		input.setAttribute("type", "number");
		input.style.setProperty("position", "absolute");
		input.style.setProperty("width", "30px");
		input.style.setProperty("top", "5px");
		input.style.setProperty("left", "35px");
		return input;
	}

	function updatePlaceButton() {
		const button = document.createElement("button");
		button.style.setProperty("position", "absolute");
		button.style.setProperty("top", "5px");
		button.style.setProperty("left", "70px");
		button.style.setProperty("margin-left", "2px");
		button.innerHTML = "Update Place";
		return button;
	}

	function marketScrapDropdown() {
		const dropdown = document.createElement("select");
		dropdown.className = "opElem";
		dropdown.style.setProperty("position", "absolute");
		dropdown.style.setProperty("text-align", "left");
		dropdown.style.setProperty("left", "500px");
		dropdown.style.setProperty("top", "5px");
		dropdown.style.setProperty("width", "65px");
		const market = document.createElement("option");
		market.innerHTML = "Market";
		market.setAttribute("value", "market");
		dropdown.appendChild(market);
		const scrap = document.createElement("option");
		scrap.innerHTML = "Scrap";
		scrap.setAttribute("value", "scrap");
		dropdown.appendChild(scrap);
		return dropdown;
	}

	function underDiv() {
		const div = document.createElement("div");
		div.innerHTML = "under";
		div.style.setProperty("position", "absolute");
		div.style.setProperty("text-align", "left");
		div.style.setProperty("left", "462px");
		div.style.setProperty("top", "7px");
		div.style.setProperty("font-size", "12px");
		return div;
	}

	function undercutInput() {
		const input = document.createElement("input");
		input.setAttribute("type", "number");
		input.style.setProperty("position", "absolute");
		input.style.setProperty("width", "45px");
		input.style.setProperty("top", "5px");
		input.style.setProperty("left", "410px");
		return input;
	}

	function scrollingFrame() {
		const frame = document.createElement("div");
		frame.style.setProperty("overflow-y", "scroll");
		frame.style.setProperty("border", "1px solid #990000");
		frame.style.setProperty("position", "relative");
		frame.style.setProperty("height", "450px");
		frame.style.setProperty("width", "640px");
		frame.style.setProperty("bottom", "5px");
		return frame;
	}

	function postSalesKeys() {
		const keys = document.createElement("div");
		keys.style.setProperty("margin-top", "10px");
		keys.style.setProperty("margin-bottom", "-15px");
		keys.style.setProperty("font-size", "14px");
		keys.style.setProperty("font-weight", "bold");
		keys.style.setProperty("font-family", "Courier New, monospace");
		const name = document.createElement("span");
		name.style.setProperty("position", "absolute");
		name.style.setProperty("top", "23px");
		name.style.setProperty("left", "32px");
		name.innerHTML = "Item Name";
		keys.appendChild(name);
		const market_price = document.createElement("span");
		market_price.style.setProperty("position", "absolute");
		market_price.style.setProperty("top", "23px");
		market_price.style.setProperty("left", "255px");
		market_price.innerHTML = "Market Price";
		keys.appendChild(market_price);
		const undercut_price = document.createElement("span");
		undercut_price.style.setProperty("position", "absolute");
		undercut_price.style.setProperty("top", "23px");
		undercut_price.style.setProperty("left", "399px");
		undercut_price.innerHTML = "Undercut";
		keys.appendChild(undercut_price);
		return keys;
	}

	function cancelSalesKeys() {
		const keys = document.createElement("div");
		keys.style.setProperty("margin-top", "10px");
		keys.style.setProperty("margin-bottom", "-15px");
		keys.style.setProperty("font-size", "14px");
		keys.style.setProperty("font-weight", "bold");
		keys.style.setProperty("font-family", "Courier New, monospace");
		const name = document.createElement("span");
		name.style.setProperty("position", "absolute");
		name.style.setProperty("top", "23px");
		name.style.setProperty("left", "27px");
		name.innerHTML = "Item Name";
		keys.appendChild(name);
		const market_price = document.createElement("span");
		market_price.style.setProperty("position", "absolute");
		market_price.style.setProperty("top", "23px");
		market_price.style.setProperty("left", "253px");
		market_price.innerHTML = "Market Price";
		keys.appendChild(market_price);
		const my_price = document.createElement("span");
		my_price.style.setProperty("position", "absolute");
		my_price.style.setProperty("top", "23px");
		my_price.style.setProperty("left", "395px");
		my_price.innerHTML = "My Price";
		keys.appendChild(my_price);
		const marketplace_position = document.createElement("span");
		marketplace_position.style.setProperty("position", "absolute");
		marketplace_position.style.setProperty("top", "23px");
		marketplace_position.style.setProperty("left", "489px");
		marketplace_position.innerHTML = "Place";
		keys.appendChild(marketplace_position);
		return keys;
	}

	function cancelSalesButton() {
		const button = document.createElement("button");
		button.innerHTML = "cancel sales";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("top", "355px");
		button.style.setProperty("left", "577px");
		// button.style.setProperty("top", "325px");
		// button.style.setProperty("left", "375px");
		return button;
	}

	function headerElement(name) {
		const header = document.createElement("tr");
		header.innerHTML = name;
		header.style.setProperty("font-weight", "bold");
		header.style.setProperty("font-size", "14px");
		header.style.setProperty("position", "relative");
		header.style.setProperty("right", "2px");
		header.style.setProperty("text-align", "left");
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
		name.style.setProperty("width", "210px");
		name.style.setProperty("text-align", "left");
		return name;
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

	function undercutPriceDatum(text) {
		const undercut_price = document.createElement("td");
		undercut_price.innerHTML = text;
		undercut_price.style.setProperty("text-align", "right");
		undercut_price.style.setProperty("padding-left", "10px");
		undercut_price.style.setProperty("padding-top", "4px");
		undercut_price.style.setProperty("padding-bottom", "4px");
		undercut_price.style.setProperty("width", "100px");
		return undercut_price;
	}

	function myPriceDatum(text) {
		const my_price = document.createElement("td");
		my_price.innerHTML = text;
		my_price.style.setProperty("text-align", "right");
		my_price.style.setProperty("padding-left", "10px");
		my_price.style.setProperty("padding-top", "4px");
		my_price.style.setProperty("padding-bottom", "4px");
		my_price.style.setProperty("width", "100px");
		return my_price;
	}

	function placeDatum(text) {
		const place = document.createElement("td");
		place.innerHTML = text;
		place.style.setProperty("text-align", "right");
		place.style.setProperty("padding-left", "10px");
		place.style.setProperty("padding-top", "4px");
		place.style.setProperty("padding-bottom", "4px");
		place.style.setProperty("width", "60px");
		return place;
	}

	function undercutButton() {
		const undercut_button = document.createElement("button");
		undercut_button.innerHTML = "Undercut";
		undercut_button.style.setProperty("margin-left", "50px");
		undercut_button.style.setProperty("margin-top", "4px");
		undercut_button.style.setProperty("margin-bottom", "4px");
		undercut_button.style.setProperty("margin-right", "4px");
		return undercut_button;
	}

	function postSaleButton() {
		const post_sale_button = document.createElement("button");
		post_sale_button.innerHTML = "Post Sale";
		post_sale_button.style.setProperty("margin-left", "20px");
		post_sale_button.style.setProperty("margin-top", "4px");
		post_sale_button.style.setProperty("margin-bottom", "4px");
		post_sale_button.style.setProperty("margin-right", "4px");
		return post_sale_button;
	}

	function cancelSaleButton() {
		const cancel_sale_button = document.createElement("button");
		cancel_sale_button.innerHTML = "Cancel Sale";
		cancel_sale_button.style.setProperty("margin-left", "50px");
		cancel_sale_button.style.setProperty("margin-top", "4px");
		cancel_sale_button.style.setProperty("margin-bottom", "4px");
		cancel_sale_button.style.setProperty("margin-right", "4px");
		return cancel_sale_button;
	}

	const previous_sale_prices = new Map();
	const previous_sale_information = new Map();
	function updatePostSales(table, player_items, market_items, cache, requested_place, requested_undercut, requested_datum) {
		setLoadingVisible();
		market_items.requestSelling()
		.then(function() {
			table.replaceChildren(); // Remove children.
			// Create header elements
			const headers = posting_categories.map((category) => headerElement(category.name));
			const posting_item_category_data = new Map();
			posting_categories.forEach((category) => posting_item_category_data.set(category.name, []));
			headers.forEach((header) => table.appendChild(header));
			const nselling = Array.from(market_items.sellingEntries()).length;
			const selling_list_full = nselling === parseInt(userVars["DFSTATS_df_invslots"]);
			for (const [slot, item] of player_items.inventoryItems()) {
				const is_renamed = item.properties.has("rename");
				if (!cache.hasItemType(item.base_type) && !(is_renamed && cache.hasRename(item.properties.get("rename")))) {
					continue;
				}
				if (lockedSlots.includes(slot.toString())) {
					continue;
				}
				// Creates row element
				const tr = document.createElement("tr");
				tr.style.setProperty("font-size", "12px");
				tr.style.setProperty("font-weight", "normal");
				// Item name
				const name = itemNameDatum(displayName(item));
				// Preparing price data
				let market_price_text = "";
				let undercut_price_text = "";
				let additional_place_market_price_text = "N/A";
				let suggested_undercut_price = null;
				const item_market_data = getMarketData(item, cache);
				const filtered_data = item_market_data.filter(marketFilter(item));
				const has_requested_place = requested_place <= filtered_data.length;
				if (has_requested_place && requested_datum === "market") {
					const filtered_market_entries = item_market_data.filter(marketFilter(item));
					const placed_market_entry = filtered_market_entries[requested_place - 1];
					const placed_market_item = placed_market_entry.item;
					const placed_market_price = isStackable(item) ? (placed_market_entry.price/placed_market_entry.item.quantity)*item.quantity : placed_market_entry.price;
					const displayed_market_price = Number.isInteger(placed_market_price) ? placed_market_price : nearest(placed_market_price, 0.01);
					suggested_undercut_price = Number.isInteger(placed_market_price) ? Math.max(placed_market_price - requested_undercut, 0) : Math.floor(placed_market_price - requested_undercut + 1);
					// Check if placed_market_entry is the same price as one of yours, and adjust suggested undercut price to be the same as your own so that you're not undercutting yourself.
					const same_priced_market_entries = filtered_market_entries.filter((market_entry) => market_entry.price === placed_market_price || Math.abs(market_entry.price - placed_market_price) < 0.01);
					const any_placed_entry_is_mine = same_priced_market_entries.some((market_entry) => marketEntryIsMine(market_items, market_entry));
					// const placed_entry_is_mine = marketEntryIsMine(market_items, placed_market_entry);
					let same_price_as_mine = undefined // Number.isInteger(placed_market_price) ? placed_market_price : Math.floor(placed_market_price);
					if (Number.isInteger(placed_market_price) || placed_market_entry.item.quantity === item.quantity) {
						same_price_as_mine = placed_market_price;
					} else {
						same_price_as_mine = Math.floor(placed_market_entry);
					}
					suggested_undercut_price = any_placed_entry_is_mine ? same_price_as_mine : suggested_undercut_price;
					market_price_text = "$" + (Number.isInteger(displayed_market_price) ? displayed_market_price.toLocaleString() : displayed_market_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})) + (any_placed_entry_is_mine ? " (me)" : "");
					undercut_price_text = "$" + suggested_undercut_price.toLocaleString();
					// Pick out additional market entry.
					const has_additional_place = Number.isInteger(additionalPlace(requested_place)) && additionalPlace(requested_place) <= filtered_data.length;
					if (has_additional_place) {
						const additional_placed_market_entry = filtered_market_entries[additionalPlace(requested_place) - 1];
						const additional_placed_market_item = additional_placed_market_entry.item;
						const additional_placed_market_price = isStackable(item) ? (additional_placed_market_entry.price/additional_placed_market_item.quantity)*item.quantity : additional_placed_market_entry.price;
						const additional_displayed_market_price = Number.isInteger(additional_placed_market_price) ? additional_placed_market_price : nearest(additional_placed_market_price, 0.01);
						additional_place_market_price_text = "$" + (Number.isInteger(additional_displayed_market_price) ? additional_displayed_market_price.toLocaleString() : additional_displayed_market_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}));
					}
				} else if (requested_datum === "scrap") {
					const scrap_price = scrapValue(item.full_type, item.quantity);
					suggested_undercut_price = Number.isInteger(scrap_price) ? Math.max(scrap_price - requested_undercut, 0) : Math.floor(scrap_price - requested_undercut + 1);
					market_price_text = "$" + parseInt(scrap_price).toLocaleString();
					undercut_price_text = "$" + suggested_undercut_price.toLocaleString();
				} else {
					market_price_text = "N/A";
					undercut_price_text = "N/A";
				}
				function postSale(price) {
					setLoadingVisible();
					return market_items.sellInventoryItem(slot, item, price)
					.then(function() {
						updatePostSales(table, player_items, market_items, cache, requested_place, requested_undercut, requested_datum);
						setLoadingHidden();
						previous_sale_prices.set(item.full_type, price);
						previous_sale_information.set(item.full_type, {quantity: isStackable(item) ? item.quantity : 1, price: price})
					});
				}
				// Market price
				const market_price = marketPriceDatum(market_price_text);
				if (Number.isInteger(additionalPlace(requested_place)) && show_additional_place_price && requested_datum === "market") {
					const additional_price_info = document.createElement("div");
					additional_price_info.style.setProperty("font-size", "10px");
					additional_price_info.innerHTML = numberToPlace(additionalPlace(requested_place)) + ": " + additional_place_market_price_text;
					market_price.append(additional_price_info);
				}
				const scrap_value = scrapValue(item.full_type, item.quantity);
				// Undercut price
				const undercut_price = undercutPriceDatum(undercut_price_text);
				// Undercut button
				const undercut_button = undercutButton();
				undercut_button.addEventListener("mouseenter", function(e) {
					tr.style.setProperty("font-weight", "bold");
					tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
				});
				undercut_button.addEventListener("mouseleave", function(e) {
					tr.style.setProperty("font-weight", "normal");
					tr.style.removeProperty("box-shadow");
				})
				undercut_button.addEventListener("click", function(e) {
					if (suggested_undercut_price < scrap_value && requested_datum !== "scrap") {
						const message = "This item scraps for <span style=\"color: red;\">$" + scrap_value.toLocaleString() + "</span>.<br>Are you sure you want to sell this item for <span style=\"color: red;\">$" + suggested_undercut_price.toLocaleString() + "</span>?";
						setWarningVisible(message, function() {
							setWarningHidden();
							postSale(suggested_undercut_price);
						}, setWarningHidden);
					} else {
						postSale(suggested_undercut_price);
					}
				});
				if (suggested_undercut_price === null) {
					undercut_button.disabled = true;
				}
				// Post sale button
				const post_sale_button = postSaleButton();
				post_sale_button.addEventListener("mouseenter", function(e) {
					tr.style.setProperty("font-weight", "bold");
					tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
				});
				post_sale_button.addEventListener("mouseleave", function(e) {
					tr.style.setProperty("font-weight", "normal");
					tr.style.removeProperty("box-shadow");
				});
				post_sale_button.addEventListener("click", function(e) {
					const message = "How much would you like to sell the <span style=\"color: red;\">" + displayName(item) + "</span> for?";
					// const initial_value = previous_sale_prices.has(item.full_type) ? previous_sale_prices.get(item.full_type) : "";
					let initial_value = ""
					if (previous_sale_information.has(item.full_type)) {
						const info = previous_sale_information.get(item.full_type);
						initial_value = isStackable(item) ? Math.floor(item.quantity * (info.price / info.quantity)) : info.price;
					}
					setPricePromptVisible(message, function(value) {
						setPricePromptHidden();
						const my_price = parseInt(value);
						const cheapest_market_entry = filtered_data[0];
						const market_price = cheapest_market_entry.price;
						const no_entries_available = filtered_data.length === 0;
						if (scrap_value > my_price && requested_datum !== "scrap") { // Scrap value is greater than proposed price.
							const message = "This item scraps for <span style=\"color: red;\">$" + scrap_value.toLocaleString() + "</span>.<br>Are you sure you want to sell this item for <span style=\"color: red;\">$" + my_price.toLocaleString() + "</span>?";
							setWarningVisible(message, function() {
								setWarningHidden();
								postSale(my_price);
							}, setWarningHidden);
						} else if (warnMarketSelling(my_price, market_price) && requested_datum === "market") { // Market price is significantly higher than proposed price.
							const message = "This item sells for <span style=\"color: red;\">$" + market_price.toLocaleString() + "</span>.<br>Are you sure you want to sell this item for <span style=\"color: red;\">$" + my_price.toLocaleString() + "</span>?";
							setWarningVisible(message, function() {
								setWarningHidden();
								postSale(my_price);
							}, setWarningHidden);
						} else if (no_entries_available && requested_datum === "market") {
							const message = "No market data for this item is available.<br>Are you sure you want to sell this item for <span style=\"color: red;\">$" + my_price.toLocaleString() + "</span>?";
							setWarningVisible(message, function() {
								setWarningHidden();
								postSale(my_price);
							}, setWarningHidden);
						} else { // No warnings, sell immediately.
							setWarningHidden();
							return postSale(my_price);
						}
					}, setPricePromptHidden, initial_value);
				});
				if (selling_list_full) {
					undercut_button.disabled = true;
					post_sale_button.disabled = true;
				}
				if (suggested_undercut_price !== null && scrap_value > suggested_undercut_price && requested_datum !== "scrap") {
					name.style.setProperty("color", "red");
					market_price.style.setProperty("color", "red");
					undercut_price.style.setProperty("color", "red");
				}
				// Adding to arrays (to be sorted and added to table).
				const undercut_td = document.createElement("td");
				undercut_td.append(undercut_button)
				const post_sale_td = document.createElement("td");
				post_sale_td.append(post_sale_button);
				tr.appendChild(name);
				tr.appendChild(market_price);
				tr.appendChild(undercut_price);
				tr.appendChild(undercut_td);
				tr.appendChild(post_sale_td);
				const data = {element: tr, full_type: item.full_type, category: item.category};
				for (let i = 0; i < posting_categories.length; i++) {
					const category = posting_categories[i];
					if (category.predicate(item)) {
						posting_item_category_data.get(category.name).push(data);
						break;
					}
				}
			}
			// Sort item table rows and add to table.
			function sortingFunction(a, b) {
				if (a.category !== b.category) {
					return a.category > b.category;
				} else {
					return a.full_type > b.full_type;
				}
			}
			headers.forEach((header) => header.style.setProperty("display", posting_item_category_data.get(header.innerHTML).length === 0 ? "none" : "block"));
			posting_item_category_data.forEach((category_data) => category_data.sort(sortingFunction));
			headers.forEach((header) => header.after(...posting_item_category_data.get(header.innerHTML).map((data) => data.element)));
			setLoadingHidden();
		});
	}

	function updateCancelSales(table, market_items, cache) {
		setLoadingVisible();
		market_items.requestSelling()
		.then(function() {
			table.replaceChildren(); // Remove children.
			// Create header elements
			const headers = selling_categories.map((category) => headerElement(category.name));
			const selling_item_category_data = new Map();
			selling_categories.forEach((category) => selling_item_category_data.set(category.name, []));
			headers.forEach((header) => table.appendChild(header));
			for (const [slot, selling_entry] of market_items.sellingEntries()) {
				const market_entry = selling_entry.market_entry;
				const item = market_entry.item;
				const is_renamed = item.properties.has("rename");
				if (!cache.hasItemType(item.base_type) && !(is_renamed && cache.hasRename(item.properties.get("rename")))) {
					continue;
				}
				// Creates row element
				const tr = document.createElement("tr");
				tr.style.setProperty("font-size", "12px");
				tr.style.setProperty("font-weight", "normal");
				// Item name
				const name = itemNameDatum(displayName(item));
				// Market price
				const item_market_data = getMarketData(item, cache);
				const filtered_market_entries = item_market_data.filter(marketFilter(item));
				const cheapest_market_entry = filtered_market_entries[0];
				const cheapest_market_item = cheapest_market_entry.item;
				const cheapest_market_price = isStackable(item) ? (cheapest_market_entry.price/cheapest_market_entry.item.quantity)*item.quantity : cheapest_market_entry.price;
				const market_price = marketPriceDatum("$" + (Number.isInteger(cheapest_market_price) ? cheapest_market_price.toLocaleString() : cheapest_market_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})));
				// My price
				const my_price = myPriceDatum("$" + selling_entry.market_entry.price.toLocaleString());
				// Place
				const my_place = getPlace(market_entry, item_market_data);
				const place = placeDatum(my_place !== null ? my_place.toString() : ">" + item_market_data.length.toString());
				// Cancel sale button
				const cancel_sale_button = cancelSaleButton();
				if (warnMarketOver(selling_entry.market_entry.price, cheapest_market_price, my_place)) {
					name.style.setProperty("color", "red");
					market_price.style.setProperty("color", "red");
					my_price.style.setProperty("color", "red");
					place.style.setProperty("color", "red");
				}
				const inventory_space_available = findFirstEmptyGenericSlot("inv") !== false;
				if (!inventory_space_available) {
					cancel_sale_button.disabled = true;
				}
				cancel_sale_button.addEventListener("mouseenter", function(e) {
					tr.style.setProperty("font-weight", "bold");
					tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
				});
				cancel_sale_button.addEventListener("mouseleave", function(e) {
					tr.style.setProperty("font-weight", "normal");
					tr.style.removeProperty("box-shadow");
				})
				cancel_sale_button.addEventListener("click", function(e) {
					setLoadingVisible();
					market_items.cancelSellingEntry(selling_entry)
					.then(function() {
						updateCancelSales(table, market_items, cache);
						setLoadingHidden();
					});
				});
				// Adding to arrays (to be sorted and added to table).
				const cancel_sale_td = document.createElement("td");
				cancel_sale_td.append(cancel_sale_button);
				tr.appendChild(name);
				tr.appendChild(market_price);
				tr.appendChild(my_price);
				tr.appendChild(place);
				tr.appendChild(cancel_sale_td);
				const data = {element: tr, full_type: item.full_type, place: my_place, category: item.category};
				for (let i = 0; i < selling_categories.length; i++) {
					const category = selling_categories[i];
					if (category.predicate(item)) {
						selling_item_category_data.get(category.name).push(data);
						break;
					}
				}
			}
			// Sort item table rows and add to table.
			function sortingFunction(a, b) {
				if (a.category !== b.category) {
					return a.category > b.category;
				} else if (a.full_type !== b.full_type) {
					return a.full_type > b.full_type;
				} else {
					return a.place > b.place;
				}
			}
			headers.forEach((header) => header.style.setProperty("display", selling_item_category_data.get(header.innerHTML).length === 0 ? "none" : "block"));
			selling_item_category_data.forEach((category_data) => category_data.sort(sortingFunction));
			headers.forEach((header) => header.after(...selling_item_category_data.get(header.innerHTML).map((data) => data.element)));
			setLoadingHidden();
		});
	}

	function addToSellingTab(player_items, market_items, market_cache) {
		const marketplace = document.getElementById("marketplace");
		// Post sales button and container
		const post_sales_button = postSalesButton();
		const post_sales_container = salesContainer();
		const post_sales_title = titleBlock("Post Sales");
		const post_sales_keys = postSalesKeys();
		const post_sales_frame = scrollingFrame();
		const post_sales_table = document.createElement("table");
		post_sales_table.style.setProperty("margin-bottom", "4px");
		const post_sales_place_input = placeInput();
		const post_sales_place_update = updatePlaceButton();
		const close_post_sales_container_button = closeContainerButton();
		const market_scrap_dropdown = marketScrapDropdown();
		const under_div = underDiv();
		const undercut_input = undercutInput();
		let requested_place = 1;
		let requested_undercut = 1;
		let requested_datum = "market";
		undercut_input.value = requested_undercut.toString();
		post_sales_button.addEventListener("click", function(e) {
			setLoadingVisible();
			updateCacheFromInventory(market_cache, player_items)
			.then(function() {
				updatePostSales(post_sales_table, player_items, market_items, market_cache, requested_place, requested_undercut, requested_datum);
				promiseWait(100) // Wait to allow DOM to update.
				.then(function() {
					post_sales_container.style.setProperty("display", "grid");
					post_sales_place_input.value = requested_place.toString();
					setLoadingHidden();
				});
			});
		});
		function updatePlaceSales(e) {
			const new_place = parseInt(post_sales_place_input.value);
			if (!Number.isInteger(new_place) || new_place <= 0) {
				return;
			} else {
				requested_place = new_place;
			}
			setLoadingVisible();
			updatePostSales(post_sales_table, player_items, market_items, market_cache, requested_place, requested_undercut, requested_datum);
			post_sales_place_input.value = requested_place.toString();
			setLoadingHidden();
		}
		post_sales_place_update.addEventListener("click", updatePlaceSales);
		post_sales_place_input.onkeydown = function(e) {
			if (e.code === "Enter" || e.code === "NumpadEnter") {
				updatePlaceSales();
			}
		}
		function updateUndercut(e) {
			const new_undercut = parseInt(undercut_input.value);
			if (!Number.isInteger(new_undercut) || new_undercut <= 0){
				return;
			} else {
				requested_undercut = new_undercut;
			}
			setLoadingVisible();
			updatePostSales(post_sales_table, player_items, market_items, market_cache, requested_place, requested_undercut, requested_datum);
			undercut_input.value = requested_undercut.toString();
			setLoadingHidden();
		}
		undercut_input.addEventListener("input", updateUndercut);
		function updateDatum(e) {
			const new_datum = market_scrap_dropdown.value;
			requested_datum = new_datum;
			setLoadingVisible();
			updatePostSales(post_sales_table, player_items, market_items, market_cache, requested_place, requested_undercut, requested_datum);
			for (const child of post_sales_keys.children) {
				if (child.innerHTML === "Market Price" && requested_datum === "scrap") {
					child.innerHTML = "Scrap Price";
					child.style.setProperty("left", "262px");
					break;
				} else if (child.innerHTML === "Scrap Price" && requested_datum === "market") {
					child.innerHTML = "Market Price";
					child.style.setProperty("left", "255px");
					break;
				}
			}
			setLoadingHidden();
		}
		market_scrap_dropdown.addEventListener("change", updateDatum);
		close_post_sales_container_button.addEventListener("click", function(e) {
			post_sales_container.style.setProperty("display", "none");
		});
		post_sales_container.appendChild(post_sales_title);
		post_sales_container.appendChild(post_sales_keys);
		post_sales_container.appendChild(post_sales_frame);
		post_sales_container.appendChild(post_sales_place_input);
		post_sales_container.appendChild(post_sales_place_update);
		post_sales_container.appendChild(market_scrap_dropdown);
		post_sales_container.appendChild(under_div);
		post_sales_container.appendChild(undercut_input);
		post_sales_frame.appendChild(post_sales_table);
		post_sales_container.appendChild(close_post_sales_container_button);
		marketplace.appendChild(post_sales_button);
		marketplace.appendChild(post_sales_container);
		// Cancel sales button and container
		const cancel_sales_button = cancelSalesButton();
		const cancel_sales_container = salesContainer();
		const cancel_sales_title = titleBlock("Cancel Sales");
		const cancel_sales_keys = cancelSalesKeys();
		const cancel_sales_frame = scrollingFrame();
		const cancel_sales_table = document.createElement("table");
		cancel_sales_table.style.setProperty("margin-bottom", "4px");
		const close_cancel_sales_container_button = closeContainerButton();
		cancel_sales_button.addEventListener("click", function(e) {
			setLoadingVisible();
			updateCacheFromSelling(market_cache, market_items)
			.then(function() {
				updateCancelSales(cancel_sales_table, market_items, market_cache);
				promiseWait(100) // Wait to allow DOM to update.
				.then(function() {
					cancel_sales_container.style.setProperty("display", "grid");
					setLoadingHidden();
				});
			});
		});
		close_cancel_sales_container_button.addEventListener("click", function(e) {
			cancel_sales_container.style.setProperty("display", "none");
		});
		cancel_sales_container.appendChild(cancel_sales_title);
		cancel_sales_container.appendChild(cancel_sales_keys);
		cancel_sales_frame.appendChild(cancel_sales_table);
		cancel_sales_container.appendChild(cancel_sales_frame);
		cancel_sales_container.appendChild(close_cancel_sales_container_button);
		// Adding buttons to marketplace
		marketplace.appendChild(cancel_sales_button);
		marketplace.appendChild(cancel_sales_container);
	}

	function sellingButtonEventListeners(player_items, market_items, market_cache) {
		const marketplace = document.getElementById("marketplace");
		let selling_button = document.getElementById("loadSelling");
		// Add on-click listener every time the selling button shows up.
		const observer = new MutationObserver(function(mutation_list, observer) {
			for (const mutation of mutation_list) {
				for (const node of mutation.addedNodes) {
					if (node.id === "selectMarket") {
						for (const child of node.children) {
							if (child.id === "loadSelling" && selling_button !== child) {
								selling_button = child;
								selling_button.addEventListener("click", function(e) {
									addToSellingTab(player_items, market_items, market_cache);
								});
							}
						}
					}
				}
			}
		});
		observer.observe(marketplace, {childList: true});
		// Needed on Chrome and Chromium browsers to add on first load, but not on Firefox for some reason.
		// Maybe it has to do with differences in how the pages are loaded?
		if (selling_button !== null) {
			selling_button.addEventListener("click", function(e) {
				addToSellingTab(player_items, market_items, market_cache);
			});
		}
// 		promiseElementId("loadSelling") // Wait for load selling button.
// 		.then(function(selling_button) {
// 			let tab_elements_present = false;
// 			// Adds event listener that adds selling tab elements when button is clicked.
// 			selling_button.addEventListener("click", function(e) {
// 				addToSellingTab(player_items, market_items, market_cache);
// 				tab_elements_present = true;
// 			});
// 			// Calls this function again when any of the other buttons are clicked, since the original selling button is
// 			// destroyed every time the market tab is changed.
// 			const select_market = document.getElementById("selectMarket");
// 			const buttons = Array.from(select_market.children);
// 			buttons.forEach(function(button) {
// 				button.addEventListener("click", function(e) {
// 					sellingButtonEventListeners(player_items, market_items, market_cache);
// 				});
// 			});
// 			// Adds in support for trade panel listeners to re-add selling listeners when moving back to the original marketplace from the item-for-item panel.
// 			promiseElementId("loadItemForItem")
// 			.then(function(item_for_item_button) {
// 				item_for_item_button.addEventListener("click", function(e) {
// 					const marketplace = document.getElementById("marketplace");
// 					const buttons = marketplace.getElementsByTagName("button");
// 					for (const element of buttons) {
// 						if (element.innerHTML === "Collect Trade Items" || element.innerHTML === "Archived Trades") {
// 							element.addEventListener("click", function(e) {
// 								for (const child of marketplace.children) {
// 									if (child.className === "opElem" && child.nodeName === "BUTTON" && child.innerHTML === "&lt; TRADE PANEL") {
// 										child.addEventListener("click", function(e) {
// 											sellingButtonEventListeners(player_items, market_items, market_cache);
// 										});
// 									}
// 								}
// 							});
// 						}
// 					}
// 				});
// 			});
// 		});
	}

	// Main

	function main() {
		const player_items = new DeadFrontier.PlayerItems();
		const market_items = new DeadFrontier.MarketItems();
		const market_cache = new DeadFrontier.MarketCache(userVars.DFSTATS_df_tradezone);
		sellingButtonEventListeners(player_items, market_items, market_cache);
	}
	main();
})();

