// ==UserScript==
// @name        Dead Frontier - Mastercrafting
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @grant       none
// @version     0.0.6
// @author      Shrike00
// @description Alternate mastercrafting method.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488290/Dead%20Frontier%20-%20Mastercrafting.user.js
// @updateURL https://update.greasyfork.org/scripts/488290/Dead%20Frontier%20-%20Mastercrafting.meta.js
// ==/UserScript==

// Changelog
// 0.0.6 - October 17, 2025
// - Change: Compatibility update to avoid conflicting with official fast enhance feature.
// 0.0.5 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.4 - March 4, 2024
// Change: Clamped values of stat inputs to valid values.
// 0.0.3 - March 2, 2024
// - Bugfix: Fixed display of mastercrafting value for some items.
// - Change: Added in number of times mastercrafted.
// - Feature: Allowed exact stat matching as end target.
// 0.0.2 - February 26, 2024
// - Bugfix: Converts enhance values to number.
// 0.0.1 - February 23, 2024
// - Initial release

(function() {
	'use strict';

	// User Options

	function isWeapon(item) {
		return item.category === ItemCategory.WEAPON;
	}

	function isArmour(item) {
		return item.category === ItemCategory.ARMOUR;
	}

	function isBackpack(item) {
		return item.category === ItemCategory.BACKPACK;
	}

	const enhance_categories = [
		{name: "Weapon", predicate: isWeapon},
		{name: "Armour", predicate: isArmour},
		{name: "Backpack", predicate: isBackpack}
	];

	// Imports

	const ItemCategory = DeadFrontier.ItemCategory;
	const ItemSubcategory = DeadFrontier.ItemSubcategory;

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

	function imageURLFromType(type) {
		return "https://files.deadfrontier.com/deadfrontier/inventoryimages/large/" + type + ".png";
	}

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function mastercraftValue(item, key) {
		if (DeadFrontier.ItemFilters.Mastercrafted(item)) {
			return item.properties.get(key);
		} else {
			return 0;
		}
	}

	// UI

	function mastercraftContainer() {
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

	function mastercraftIcon() {
		const inventory_holder = document.getElementById("inventoryholder");
		for (let i = 0; inventory_holder.children.length; i++) {
			const child = inventory_holder.children[i];
			if (child.dataset.action === "enhance") {
				return child;
			}
		}
		return undefined;
	}

	function mastercraftTitle() {
		const title = document.createElement("div");
		title.style.setProperty("font-size", "18px");
		title.style.setProperty("margin-top", "5px");
		title.style.setProperty("margin-bottom", "-30px");
		title.style.setProperty("font-weight", "bold");
		title.style.setProperty("color", "#D0D0D0");
		title.style.setProperty("text-shadow", "0 0 5px red");
		title.style.setProperty("font-family", "Courier New, Arial");
		title.innerHTML = "Mastercrafting";
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

	function mastercraftScrollingFrame() {
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
		} else if (item.category === DeadFrontier.ItemCategory.BACKPACK) {
			const is_mastercrafted = DeadFrontier.ItemFilters.Mastercrafted(item);
			return is_mastercrafted ? name + " (+" + item.properties.get("bonus_slots") + " Slots)" : name;
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
		name.style.setProperty("width", "490px");
		return name;
	}

	function selectButton() {
		const select_button = document.createElement("button");
		select_button.innerHTML = "Select";
		select_button.style.setProperty("margin-left", "60px");
		select_button.style.setProperty("margin-top", "4px");
		select_button.style.setProperty("margin-bottom", "4px");
		select_button.style.setProperty("margin-right", "4px");
		return select_button;
	}

	function displayImage(type) {
		const image = document.createElement("img");
		image.setAttribute("src", imageURLFromType(type));
		const div = document.createElement("div");
		div.style.setProperty("padding-bottom", "5px");
		div.appendChild(image);
		return div;
	}

	function statThresholdDiv(name, max) {
		const div = document.createElement("div");
		const name_div = document.createElement("div");
		name_div.innerHTML = name;
		name_div.style.setProperty("padding-bottom", "5px");
		div.appendChild(name_div);
		const input = document.createElement("input");
		input.setAttribute("type", "number");
		input.setAttribute("min", 1);
		input.setAttribute("max", max);
		input.setAttribute("value", max);
		input.style.setProperty("appearance", "auto");
		div.appendChild(input);
		return [div, input];
	}

	function enhancementThresholdDiv(item) {
		const div = document.createElement("div");
		div.style.setProperty("display", "grid");
		const description = document.createElement("div");
		description.innerHTML = "Stop Threshold";
		description.style.setProperty("grid-column-start", "1");
		description.style.setProperty("font-weight", "bold");
		description.style.setProperty("font-size", "16px");
		div.appendChild(description);
		const dropdown_div = document.createElement("div");
		const stop_type_dropdown = document.createElement("select");
		dropdown_div.appendChild(stop_type_dropdown);
		dropdown_div.style.setProperty("grid-column-start", "1");
		stop_type_dropdown.style.setProperty("width", "200px");
		const at_least_option = document.createElement("option");
		at_least_option.setAttribute("value", "at-least");
		at_least_option.innerHTML = "Stats equal or higher";
		stop_type_dropdown.appendChild(at_least_option);
		const exactly_option = document.createElement("option");
		exactly_option.setAttribute("value", "exactly");
		exactly_option.innerHTML = "Stats exact match";
		stop_type_dropdown.appendChild(exactly_option);
		div.appendChild(dropdown_div);
		const probability_label = document.createElement("div");
		probability_label.innerHTML = "Probability";
		probability_label.style.setProperty("grid-column-start", "1");
		const probability = document.createElement("div");
		probability.innerHTML = "0.00%";
		probability.style.setProperty("grid-column-start", "1");
		let stat_inputs = {};
		let updateProbability = undefined;
		// Set number stat_inputs and percentage calculations depending on whether item is weapon, armour, or backpack.
		if (item.category === ItemCategory.WEAPON) {
			div.style.setProperty("grid-template-columns", "1fr 1fr 1fr");
			description.style.setProperty("grid-column-end", "4");
			dropdown_div.style.setProperty("grid-column-end", "4");
			const [accuracy_div, accuracy_input] = statThresholdDiv("Accuracy", 8);
			div.appendChild(accuracy_div);
			const [reloading_div, reloading_input] = statThresholdDiv("Reloading", 8);
			div.appendChild(reloading_div);
			const [critical_hit_div, critical_hit_input] = statThresholdDiv("Critical Hit", 8);
			div.appendChild(critical_hit_div);
			probability_label.style.setProperty("grid-column-end", "4");
			div.appendChild(probability_label);
			probability.style.setProperty("grid-column-end", "4");
			div.appendChild(probability);
			stat_inputs = {"accuracy": accuracy_input, "reloading": reloading_input, "critical_hit": critical_hit_input};
			updateProbability = function() {
				let percentage = 0;
				if (stop_type_dropdown.value === "at-least") {
					percentage = 1;
					for (let key in stat_inputs) {
						percentage *= ((8 - stat_inputs[key].value) + 1)/8;
					}
				} else if (stop_type_dropdown.value === "exactly") {
					percentage = 1/(8*8*8);
				}
				const formatter = Intl.NumberFormat(Intl.Locale, {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2});
				probability.innerHTML = formatter.format(percentage);
			}
			updateProbability();
		} else if (item.category === ItemCategory.ARMOUR) {
			div.style.setProperty("grid-template-columns", "1fr 1fr");
			description.style.setProperty("grid-column-end", "3");
			dropdown_div.style.setProperty("grid-column-end", "3");
			const [agility_div, agility_input] = statThresholdDiv("Agility", 24);
			div.appendChild(agility_div);
			const [endurance_div, endurance_input] = statThresholdDiv("Endurance", 24);
			div.appendChild(endurance_div);
			probability_label.style.setProperty("grid-column-end", "3");
			div.appendChild(probability_label);
			probability.style.setProperty("grid-column-end", "3");
			div.appendChild(probability);
			stat_inputs = {"agility": agility_input, "endurance": endurance_input};
			updateProbability = function() {
				let percentage = 0;
				if (stop_type_dropdown.value === "at-least") {
					percentage = 1;
					for (let key in stat_inputs) {
						percentage *= ((24 - stat_inputs[key].value) + 1)/24;
					}
				} else if (stop_type_dropdown.value === "exactly") {
					percentage = 1/(24*24);
				}
				const formatter = Intl.NumberFormat(Intl.Locale, {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2});
				probability.innerHTML = formatter.format(percentage);
			}
			updateProbability();
		} else if (item.category === ItemCategory.BACKPACK) {
			div.style.setProperty("grid-template-columns", "1fr");
			description.style.setProperty("grid-column-end", "2");
			dropdown_div.style.setProperty("grid-column-end", "2");
			const [bonus_slots_div, bonus_slots_input] = statThresholdDiv("Bonus Slots", 3);
			div.appendChild(bonus_slots_div);
			probability_label.style.setProperty("grid-column-end", "2");
			div.appendChild(probability_label);
			probability.style.setProperty("grid-column-end", "2");
			div.appendChild(probability);
			stat_inputs = {"bonus_slots": bonus_slots_input};
			updateProbability = function() {
				let percentage = 0.00;
				if (stop_type_dropdown.value === "at-least") {
					percentage = [0.80, 0.19, 0.01].slice(parseInt(bonus_slots_input.value) - 1).reduce((a, b) => a + b);
				} else if (stop_type_dropdown.value === "exactly") {
					percentage = [0.80, 0.19, 0.01][parseInt(bonus_slots_input.value) - 1];
				}
				const formatter = Intl.NumberFormat(Intl.Locale, {style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2});
				probability.innerHTML = formatter.format(percentage);
			}
			updateProbability();
		} else {
			throw new TypeError("Unexpected item type: " + item.category);
		}
		return [div, stop_type_dropdown, stat_inputs, updateProbability];
	}

	function trackingDiv() {
		const div = document.createElement("div");
		div.style.setProperty("padding-top", "30px");
		div.style.setProperty("display", "grid");
		div.style.setProperty("grid-template-columns", "1fr 150px 150px 1fr");
		div.appendChild(document.createElement("div"));
		const times_div = document.createElement("div");
		const times_description = document.createElement("div");
		times_description.innerHTML = "Times";
		times_div.appendChild(times_description);
		const times_value = document.createElement("div");
		times_value.innerHTML = "0";
		times_div.appendChild(times_value);
		div.appendChild(times_div);
		const cash_spent_div = document.createElement("div");
		const cash_spent_description = document.createElement("div");
		cash_spent_description.innerHTML = "Cash Spent";
		cash_spent_div.appendChild(cash_spent_description);
		const cash_spent_value = document.createElement("div");
		cash_spent_value.innerHTML = "$0";
		cash_spent_value.style.setProperty("background", "#E6CC4D");
		cash_spent_value.style.setProperty("background-image", "-webkit-gradient( linear, left top, left bottom, color-stop(0, #E6CC4D), color-stop(0.5, #E6CC4D), color-stop(1, #000000) )");
		cash_spent_value.style.setProperty("-webkit-background-clip", "text");
		cash_spent_value.style.setProperty("-webkit-text-fill-color", "transparent");
		cash_spent_div.appendChild(cash_spent_value);
		div.appendChild(cash_spent_div);
		return [div, times_value, cash_spent_value];
	}

	function statDisplayDiv(name) {
		const div = document.createElement("div");
		const name_div = document.createElement("div");
		name_div.style.setProperty("padding-bottom", "5px");
		name_div.innerHTML = name;
		div.appendChild(name_div);
		const value_div = document.createElement("div");
		value_div.innerHTML = "undefined";
		div.appendChild(value_div);
		return [div, value_div];
	}

	function currentStatsDiv(item) {
		const div = document.createElement("div");
		div.style.setProperty("display", "grid");
		const description = document.createElement("div");
		description.style.setProperty("font-weight", "bold");
		description.style.setProperty("font-size", "16px");
		description.style.setProperty("grid-column-start", "1");
		description.innerHTML = "Current Stats";
		div.appendChild(description);
		let update_stats = undefined;
		if (item.category === ItemCategory.WEAPON) {
			div.style.setProperty("grid-template-columns", "1fr 100px 100px 100px 1fr");
			description.style.setProperty("grid-column-end", "6");
			div.appendChild(document.createElement("div"));
			const [accuracy_div, accuracy_value] = statDisplayDiv("Accuracy");
			div.appendChild(accuracy_div);
			const [reloading_div, reloading_value] = statDisplayDiv("Reloading");
			div.appendChild(reloading_div);
			const [critical_hit_div, critical_hit_value] = statDisplayDiv("Critical Hit");
			div.appendChild(critical_hit_div);
			update_stats = function(item) {
				accuracy_value.innerHTML = mastercraftValue(item, "accuracy");
				reloading_value.innerHTML = mastercraftValue(item, "reloading");
				critical_hit_value.innerHTML = mastercraftValue(item, "critical_hit");
			}
			update_stats(item);
		} else if (item.category === ItemCategory.ARMOUR) {
			div.style.setProperty("grid-template-columns", "1fr 100px 100px 1fr");
			description.style.setProperty("grid-column-end", "5");
			div.appendChild(document.createElement("div"));
			const [agility_div, agility_value] = statDisplayDiv("Agility");
			div.appendChild(agility_div);
			const [endurance_div, endurance_value] = statDisplayDiv("Endurance");
			div.appendChild(endurance_div);
			update_stats = function(item) {
				agility_value.innerHTML = mastercraftValue(item, "agility");
				endurance_value.innerHTML = mastercraftValue(item, "endurance");
			}
			update_stats(item);
		} else if (item.category === ItemCategory.BACKPACK) {
			div.style.setProperty("grid-template-columns", "1fr 100px 1fr");
			description.style.setProperty("grid-column-end", "4");
			div.appendChild(document.createElement("div"));
			const [bonus_slots_div, bonus_slots_value] = statDisplayDiv("Bonus Slots");
			div.appendChild(bonus_slots_div);
			update_stats = function(item) {
				bonus_slots_value.innerHTML = mastercraftValue(item, "bonus_slots");
			}
			update_stats(item);
		} else {
			throw new TypeError("Unexpected item type: " + item.category);
		}
		return [div, update_stats];
	}

	function enhanceDiv(item) {
		const div = document.createElement("div");
		div.style.setProperty("padding-top", "30px");
		const enhance_cost_div = document.createElement("div");
		enhance_cost_div.innerHTML = "$" + parseInt(enhanceValue(item.full_type)).toLocaleString();
		div.appendChild(enhance_cost_div);
		const enhance_button = document.createElement("button");
		enhance_button.innerHTML = "Mastercraft";
		div.appendChild(enhance_button);
		return [div, enhance_button];
	}

	function updateMastercraftItems(table, player_items) {
		table.replaceChildren(); // Remove children
		// Create header elements
		const headers = enhance_categories.map((category) => headerElement(category.name));
		headers.forEach((header) => table.appendChild(header));
		// Stores information about each table row
		const item_category_data = new Map();
		enhance_categories.forEach((category) => item_category_data.set(category.name, []));
		for (const [slot, item] of player_items.inventoryItems()) {
			// Skip if item is not enhanceable.
			if (!DeadFrontier.ItemFilters.Enhanceable(item)) {
				continue;
			}
			// Creates row element
			const tr = document.createElement("tr");
			tr.style.setProperty("font-size", "12px");
			// Item name
			const name = itemNameDatum(displayName(item));
			// Item select button
			const select_button = selectButton();
			select_button.addEventListener("mouseenter", function(e) {
				tr.style.setProperty("font-weight", "bold");
				tr.style.setProperty("box-shadow", "0px 0px 2px 1px white");
			});
			select_button.addEventListener("mouseleave", function(e) {
				tr.style.removeProperty("font-weight");
				tr.style.removeProperty("box-shadow");
			});
			// Select Button Event Listeners
			select_button.addEventListener("click", function(e) {
				const mastercraft_container = mastercraftContainer();
				mastercraft_container.style.setProperty("display", "grid");
				mastercraft_container.style.setProperty("grid-template-rows", "40px auto 100px 100px 80px 100px 30px");
				mastercraft_container.style.setProperty("grid-template-columns", "1fr");
				const title = mastercraftTitle();
				title.innerHTML = item.properties.has("rename") ? item.properties.get("rename") : item.base_name;
				mastercraft_container.appendChild(title);
				const flash_replace = document.getElementById("inventoryholder").parentNode;
				const image = displayImage(item.base_type);
				mastercraft_container.appendChild(image);
				const [enhancement_threshold_div, stop_type_dropdown, stat_inputs, updateProbability] = enhancementThresholdDiv(item);
				mastercraft_container.appendChild(enhancement_threshold_div);
				const [tracking_div, times_element, cash_spent_element] = trackingDiv();
				mastercraft_container.appendChild(tracking_div);
				const [current_stats_div, updateStats] = currentStatsDiv(item);
				mastercraft_container.appendChild(current_stats_div);
				const [enhance_div, enhance_button] = enhanceDiv(item);
				mastercraft_container.appendChild(enhance_div);
				const cancel_button = cancelButton();
				cancel_button.addEventListener("click", function(e) {
					updateMastercraftItems(table, player_items);
					promiseWait(100) // Wait for DOM to update.
					.then(function() {
						mastercraft_container.remove();
					});
				});
				let current_item = item;
				function setButtonState() {
					// Disable button if out of cash or if all stats exceed threshold, otherwise enable button.
					const stats_exceed_threshold = Object.keys(stat_inputs).map((key) => mastercraftValue(current_item, key) >= parseInt(stat_inputs[key].value));
					const stats_match_exactly = Object.keys(stat_inputs).map((key) => mastercraftValue(current_item, key) === parseInt(stat_inputs[key].value));
					const all_stats_exceed_threshold = stats_exceed_threshold.every((e) => e);
					const all_stats_match_exactly = stats_match_exactly.every((e) => e);
					const enough_cash = parseInt(userVars["DFSTATS_df_cash"]) >= parseInt(enhanceValue(current_item.full_type));
					const stats_pass = (stop_type_dropdown.value === "at-least" && all_stats_exceed_threshold) || (stop_type_dropdown.value === "exactly" && all_stats_match_exactly);
					if (stats_pass || !enough_cash) {
						enhance_button.setAttribute("disabled", "");
					} else {
						enhance_button.removeAttribute("disabled");
					}
				}
				setButtonState();
				for (let key in stat_inputs) {
					const stat_input = stat_inputs[key];
					stat_input.oninput = function(e) {
						stat_input.value = clamp(stat_input.value, stat_input.min, stat_input.max);
						// Rechecks button state and recalculates probability when inputs are changed.
						setButtonState();
						updateProbability();
					}
				}
				stop_type_dropdown.oninput = function(e) {
					setButtonState();
					updateProbability();
				}
				let total_cash_spent = 0;
				let times_mastercrafted = 0;
				function updateAfterMastercraft() {
					// Gets new item with new stats and updates button state, cash spent.
					current_item = player_items.inventory(slot);
					updateStats(current_item);
					setButtonState();
					total_cash_spent += parseInt(enhanceValue(item.full_type));
					cash_spent_element.innerHTML = "$" + total_cash_spent.toLocaleString();
					times_mastercrafted += 1;
					times_element.innerHTML = times_mastercrafted.toLocaleString();
				}
				let debounce = true;
				function requestMastercraft() {
					if (!debounce) {
						return;
					}
					debounce = false;
					setLoadingVisible();
					player_items.mastercraftInventoryItem(slot, current_item)
					.then(function() {
						playSound("swap");
						updateAfterMastercraft();
						setLoadingHidden();
						debounce = true;
					});
				}
				enhance_button.addEventListener("click", function(e) {
					requestMastercraft();
				});
				mastercraft_container.appendChild(cancel_button);
				flash_replace.appendChild(mastercraft_container);
			});

			// Adding to arrays (to be sorted and added to table).
			tr.appendChild(name);
			tr.appendChild(select_button);
			// Adds data about each table row to map
			const data = {element: tr, full_type: item.full_type, quantity: item.quantity, item: item};
			for (let i = 0; i < enhance_categories.length; i++) {
				const category = enhance_categories[i];
				if (category.predicate(item)) {
					item_category_data.get(category.name).push(data);
					break;
				}
			}
		}
		// Sort item table rows and add to table.
		function sortingFunction(a, b) {
			const a_props = a.item.properties;
			const b_props = b.item.properties;
			const has_proficiency_req = a_props.has("proficiency_level") && b_props.has("proficiency_level");
			const has_max_durability = a_props.has("max_durability") && b_props.has("max_durability");
			const has_base_slots = a_props.has("base_slots") && b_props.has("base_slots");
			const a_enhance = parseInt(enhanceValue(a.full_type));
			const b_enhance = parseInt(enhanceValue(b.full_type));
			if (a_enhance !== b_enhance) {
				return a_enhance > b_enhance;
			} else {
				return a.full_type > b.full_type;
			}
			// if (has_proficiency_req) {
			// 	const a_prof = a_props.get("proficiency_level");
			// 	const b_prof = b_props.get("proficiency_level");
			// 	if (a_prof === b_prof) {
			// 		return a.full_type > b.full_type;
			// 	} else {
			// 		return a_prof > b_prof;
			// 	}
			// } else if (has_max_durability) {
			// 	const a_dura = a_props.get("max_durability");
			// 	const b_dura = b_props.get("max_durability");
			// 	if (a_dura === b_dura) {
			// 		return a.full_type > b.full_type;
			// 	} else {
			// 		return a_dura > b_dura;
			// 	}
			// } else if (has_base_slots) {
			// 	const a_slots = a_props.get("base_slots");
			// 	const b_slots = b_props.get("base_slots");
			// 	if (a_slots === b_slots) {
			// 		return a.full_type > b.full_type;
			// 	} else {
			// 		return a_slots > b_slots;
			// 	}
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
		keys.style.setProperty("font-family", "Courier New, monospace");
		const name = document.createElement("span");
		name.style.setProperty("position", "absolute");
		name.style.setProperty("top", "23px");
		name.style.setProperty("left", "53px");
		name.innerHTML = "Item Name";
		keys.appendChild(name);
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
		const flash_replace = document.getElementById("inventoryholder").parentNode;
		const container = mastercraftContainer();
		const prompt = document.getElementById("prompt");
		let prompt_observer;
		flash_replace.appendChild(container);
		const title = mastercraftTitle();
		container.appendChild(title);
		container.appendChild(tableKeys());
		const mastercraft_frame = mastercraftScrollingFrame();
		container.appendChild(mastercraft_frame);
		const cancel_button = cancelButton();
		container.appendChild(cancel_button);
		const table = document.createElement("table");
		table.style.setProperty("margin-bottom", "4px");
		mastercraft_frame.appendChild(table);
		mastercraftIcon().addEventListener("click", function(e) {
			removeActionBox(prompt);
			prompt.style.setProperty("display", "none");
			prompt_observer.observe(prompt, {childList: true});
			updateMastercraftItems(table, player_items);
			promiseWait(100) // Wait for DOM to update.
			.then(function() {
				container.style.setProperty("display", "grid");
			});
		});
		cancel_button.addEventListener("click", function(e) {
			pageLock = false;
			prompt_observer.disconnect();
			container.style.setProperty("display", "none");
			container.style.setProperty("display", "none");
			prompt.style.setProperty("display", "none");
		});
		// Observer to hide genericActionBox that pops up the liability/responsibility agreement for official quick enhance.
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
			prompt.style.setProperty("display", "none");
		}
		prompt_observer = new MutationObserver(prompt_callback);
	}
	main();
})();
