// ==UserScript==
// @name        Dead Frontier - Fast Services
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant       none
// @version     0.0.7
// @author      Shrike00
// @description Adds buttons to quickly search services at the Marketplace.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472536/Dead%20Frontier%20-%20Fast%20Services.user.js
// @updateURL https://update.greasyfork.org/scripts/472536/Dead%20Frontier%20-%20Fast%20Services.meta.js
// ==/UserScript==

// Changelog
// 0.0.7 - May 10, 2025
// - Change: Replaced multi-step armor repair with direct repair from equipment.
// 0.0.6 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.5 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.4 - December 16, 2024
// - Change: Updated with new API version for webCall change.
// 0.0.3 - March 12, 2024
// - Change: Added case for no engineers available.
// 0.0.2 - August 10, 2023
// - Change: Now confirms pop-up with enter key.

(function() {
	'use strict';

	// User Options
	// This only affects market search for services, not armour repair.
	const service_level = 75; // Valid values are 5, 15, 25, 35, 45, and 75.

	const max_repair_cost_no_confirm = 0;
	const max_repair_cost_popup = 25000;


	// Enumerations
	const ServiceType = {CHEF: "Chef", DOCTOR: "Doctor", ENGINEER: "Engineer"};
	const ServiceName =  {[ServiceType.CHEF]: "Cooking", [ServiceType.DOCTOR]: "Medical", [ServiceType.ENGINEER]: "Repair"};

	const UiUpdate = DeadFrontier.UiUpdate;

	// Helpers

	function dummy() {
		// Function that does nothing.
	}

	function nearest(n, pivot) {
		// Rounds to closest pivot value. nearest(154.29, 0.2) == 154.20, for example. Format using toFixed(n) if
		// displaying or converting to string.
		return Math.round(n/pivot)*pivot;
	}

	function waitForId(id, timeout) {
		const promise = new Promise(function(resolve, reject) {
			const start = performance.now();
			const check = setInterval(function() {
				const e = document.getElementById(id);
				if (e !== null) {
					clearInterval(check);
					resolve(e);
				}
				if (performance.now() - start >= timeout) {
					clearInterval(check);
					reject(e);
				}
			}, 100);
		});
		return promise;
	}

	function rawResponseToObject(response) {
		// Converts raw string response from trade_search.php to JS object<string, string>.
		const object = {};
		const pairs = response.split("&");
		for (let i = 0; i < pairs.length; i++) {
			const [key, value] = pairs[i].split("=");
			object[key] = value;
		}
		delete object[""]; // Removes undefined key, since response leads with an ampersand (&).
		return object;
	}

	function wearingArmour() {
		const uservars = userVars;
		const armour_type = uservars["DFSTATS_df_armourtype"];
		return armour_type !== "";
	}

	function canRemoveArmour() {
		const inventory_slot_available = findFirstEmptyGenericSlot("inv") !== false;
		return wearingArmour() && inventory_slot_available;
	}

	function swapItems(primary_data, secondary_data, callback) {
		// Data [slot_index, item_type, inventory_group]. If the slot being moved to does not contain an item, use the
		// empty string.
		const uservars = userVars;
		const payload = [primary_data, secondary_data];
		// Taken from updateInventory. Stripped down so it only works for equip/un-equip.
		const dataArr = {};
		dataArr["pagetime"] = uservars["pagetime"];
		dataArr["templateID"] = uservars["template_ID"];
		dataArr["sc"] = uservars["sc"];
		dataArr["creditsnum"] = uservars["DFSTATS_df_credits"];
		dataArr["buynum"] = "0";
		dataArr["renameto"] = "undefined`undefined";
		dataArr["expected_itemprice"] = "-1";
		dataArr["expected_itemtype2"] = payload[1][1];
		dataArr["expected_itemtype"] = payload[0][1];
		dataArr["itemnum2"] = payload[1][0];
		dataArr["itemnum"] = payload[0][0];
		dataArr["price"] = getUpgradePrice();
		dataArr["userID"] = uservars["userID"];
		dataArr["password"] = uservars["password"];
		playSound("equip");
		dataArr["action"] = "newequip";
		if(payload[0][2] !== payload[1][2])
		{
			if(payload[0][2] === "character")
			{
				dataArr["expected_itemtype2"] = payload[0][1];
				dataArr["expected_itemtype"] = payload[1][1];
				dataArr["itemnum2"] = payload[0][0];
				dataArr["itemnum"] = payload[1][0];
			}
		}
		webCall("inventory_new", dataArr, callback, true);
	}

	function removeArmour() {
		// updateInventory takes an array with two elements. The first is a 3-array with the primary item data, and the
		// second is about where it's being moved to.
		// ItemData [slot_index, item_type, inventory_group(equipment, character, or inventory)]
		// MoveToData [slot_index, item_type, inventory_group]
		// Taken from shiftItem.
		const uservars = userVars;
		const armour_type = uservars["DFSTATS_df_armourtype"];
		const item_data = ["34", armour_type, "character"];
		const move_to_data = [findFirstEmptyGenericSlot("inv"), "", "inventory"];
		swapItems(item_data, move_to_data, function(data) {
			updateIntoArr(flshToArr(data, "DFSTATS_"), uservars);
			// 			$.each($(".characterRender"), function(key, val)
			// 			{
			// 				renderAvatarUpdate(val, uservars);
			// 			});
			populateInventory();
			populateCharacterInventory();
			updateAllFields();
			renderAvatarUpdate();
		});
	}

	function* slots() {
		// Generator that iterates through slots and yields [slot, type, quantity].
		const uservars = userVars;
		const nslots = parseInt(uservars["DFSTATS_df_invslots"]);
		for (let slot = 1; slot <= nslots; slot++) {
			const type_key = "DFSTATS_df_inv" + slot.toString() + "_type";
			const quantity_key = "DFSTATS_df_inv" + slot.toString() + "_quantity";
			const type = uservars[type_key];
			yield [slot, uservars[type_key], uservars[quantity_key]];
		}
	}

	function* items() {
		// Generator that iterates through filled slots and yields [slot, type, quantity].
		for (const [slot, type, quantity] of slots()) {
			const slot_filled = type !== "";
			if (slot_filled) {
				yield [slot, type, quantity];
			}
		}
	}

	function findItem(item_type) {
		for (const [slot, type, quantity] of items()) {
			if (type === item_type) {
				return slot;
			}
		}
		return null;
	}

	function countItem(item_type) {
		let output = 0;
		for (const [slot, type, quantity] of items()) {
			if (type === item_type) {
				output += 1;
			}
		}
		return output;
	}

	function reequipArmour(slot, armour_type) {
		// updateInventory takes an array with two elements. The first is a 3-array with the primary item data, and the
		// second is about where it's being moved to.
		// ItemData [slot_index, item_type, inventory_group(equipment, character, or inventory)]
		// MoveToData [slot_index, item_type, inventory_group]
		// Taken from shiftItem.
		const uservars = userVars;
		const move_to_data = ["34", "", "character"];
		const item_data = [slot, armour_type, "inventory"];
		swapItems(item_data, move_to_data, function(data) {
			updateIntoArr(flshToArr(data, "DFSTATS_"), uservars);
			// 			$.each($(".characterRender"), function(key, val)
			// 			{
			// 				renderAvatarUpdate(val, uservars);
			// 			});
			populateInventory();
			populateCharacterInventory();
			updateAllFields();
			renderAvatarUpdate();
		});
	}

	// Requests

	function setupRequestServicesMarketData(tradezone, service, level) {
		// Sets up POST request for searching up market data for given service, level, and tradezone.
		const request = new XMLHttpRequest();
		request.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php");
		request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// Setting up request payload.
		const request_parameters = new URLSearchParams();
		request_parameters.set("hash", "");
		request_parameters.set("pagetime", "");
		request_parameters.set("tradezone", tradezone.toString());
		request_parameters.set("searchname", level.toString());
		request_parameters.set("category", "");
		request_parameters.set("profession", service.toString());
		request_parameters.set("memID", "");
		request_parameters.set("searchtype", "buyinglist");
		request_parameters.set("search", "services");
		return [request, request_parameters];
	}

	function parseMarketServicesData(response, service, level) {
		const parsed = rawResponseToObject(response);
		parsed["services"] = true;
		parsed["searcheditem"] = level;
		document.getElementById("searchField").value = level;
		const dropdown = document.getElementById("categoryChoice");
		dropdown.dataset.catname = service;
		dropdown.dataset.cattype = "service";
		document.getElementById("cat").innerHTML = "Services - " + ServiceName[service];
		listMarket(parsed);
		const children = document.getElementById("itemDisplay").children;
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const cls = child.className;
			if (cls !== "serviceItem") {
				continue;
			}
			const icon = child.getElementsByClassName("fakeSlot trueIcon")[0];
			if (service === ServiceType.CHEF) {
				icon.classList.replace("trueIcon", "ChefIcon");
			} else if (service === ServiceType.DOCTOR) {
				icon.classList.replace("trueIcon", "DoctorIcon");
			} else if (service === ServiceType.ENGINEER) {
				icon.classList.replace("trueIcon", "EngineerIcon");
			}
		}
		document.getElementById("makeSearch").removeAttribute("disabled");
		const prompt = document.getElementById("gamecontent");
		prompt.parentNode.style.display = "none";
		prompt.innerHTML = "";
	}

	function requestServicesMarketData(tradezone, service, level) {
		// Requests market data for given item and tradezone. Calls parseMarketServiceData to parse and store
		// information.
		const [request, parameters] = setupRequestServicesMarketData(tradezone, service, level);
		request.onreadystatechange = function() {
			const is_complete = this.readyState == 4;
			const response_ok = this.status == 200;
			const client_error = this.status >= 400 && this.status < 500;
			const server_error = this.status >= 500 && this.status < 600;
			if (is_complete && response_ok) {
				parseMarketServicesData(this.response, service, level);
			}
		}
		const prompt = document.getElementById("gamecontent");
		prompt.innerHTML = "<div style='text-align: center'>Loading, please wait...</div>";
		prompt.parentNode.style.display = "block";
		request.send(parameters);
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

	function makeCookingButton(parent, callback) {
		const button = document.createElement("button");
		button.className = "dffs-base";
		button.innerHTML = "cooking";
		button.style.position = "absolute";
		button.style.top = "55px";
		button.style.left = "610px";
		button.style.textAlign = "left";
		button.addEventListener("click", callback);
		parent.appendChild(button);
		return button;
	}

	function makeMedicalButton(parent, callback) {
		const button = document.createElement("button");
		button.className = "dffs-base";
		button.innerHTML = "medical";
		button.style.position = "absolute";
		button.style.top = "75px";
		button.style.left = "610px";
		button.style.textAlign = "left";
		button.addEventListener("click", callback);
		parent.appendChild(button);
		return button;
	}

	function makeRepairButton(parent, callback) {
		const button = document.createElement("button");
		button.className = "dffs-base";
		button.innerHTML = "repair";
		button.style.position = "absolute";
		button.style.top = "95px";
		button.style.left = "610px";
		button.style.textAlign = "left";
		button.addEventListener("click", callback);
		parent.appendChild(button);
		return button;
	}

	function makeRepairArmourButton(parent, callback) {
		const button = document.createElement("button");
		button.className = "dffs-base";
		button.style.position = "absolute";
		button.style.top = "15px";
		button.style.left = "610px";
		button.style.textAlign = "left";
		button.addEventListener("click", callback);
		parent.appendChild(button);
		return button;
	}

	function waitForItemDisplay(callback, timeout) {
		const start = performance.now();
		const check = setInterval(function() {
			if (document.getElementById("itemDisplay") !== null) {
				clearInterval(check);
				callback();
			} else if (performance.now() - start > timeout) {
				clearInterval(check);
			}
		}, 100);
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

	function setCancelWarningVisible(text, cancel_callback) {
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
		const cancel_button = document.createElement("button");
		cancel_button.style.position = "absolute";
		cancel_button.style.top = "72px";
		cancel_button.style.left = "100px";
		cancel_button.innerHTML = "Cancel";
		cancel_button.addEventListener("click", cancel_callback);
		gamecontent.appendChild(cancel_button);
	}


	function buyRepair(player_items, market_items, engineer, slot, armour) {
		setLoadingVisible();
		return player_items.inventoryToArmour(slot, UiUpdate.NO).then(function() {
			return market_items.buyRepairFromMarketEntry(engineer, slot, armour, UiUpdate.NO);
		}).then(function() {
			player_items.inventoryToArmour(slot, UiUpdate.YES);
			playSound("repair");
			setLoadingHidden();
		});
	}

	function buyRepairArmor(player_items, market_items, engineer, armour) {
		setLoadingVisible();
		const slot = 34;
		return market_items.buyRepairFromMarketEntry(engineer, slot, armour, UiUpdate.YES)
		.then(function() {
			playSound("repair");
			setLoadingHidden();
		});
		// .then(function() {
		// 	return waitForId("statusBox", 1000);
		// })
		// .then(function(e) {
		// 	e.remove();
		// });
	}

	let armour_type = undefined;
	function addButtons() {
		const tradezone = userVars.DFSTATS_df_tradezone;
		const marketplace = document.getElementById("marketplace");
		makeCookingButton(marketplace, function() {requestServicesMarketData(tradezone, ServiceType.CHEF, service_level);});
		makeMedicalButton(marketplace, function() {requestServicesMarketData(tradezone, ServiceType.DOCTOR, service_level);});
		makeRepairButton(marketplace, function() {requestServicesMarketData(tradezone, ServiceType.ENGINEER, service_level);});
		const player_values = new DeadFrontier.PlayerValues();
		const player_items = new DeadFrontier.PlayerItems();
		const market_items = new DeadFrontier.MarketItems();
		const armour_button = makeRepairArmourButton(marketplace, dummy);
		armour_button.innerHTML = "repair armour";
		player_values.request().then(function(values) {
			const market_cache = new DeadFrontier.MarketCache(values.tradezone);
			return market_cache;
		}).then(function(cache) {
			armour_button.removeEventListener("click", dummy);
			armour_button.addEventListener("click", function() {
				// Notification and early return if repair is not needed or not possible.
				if (!wearingArmour()) {
					setCancelWarningVisible("You are not wearing armour!", setWarningHidden);
					return;
				}
				// if (!canRemoveArmour()) {
				// 	setCancelWarningVisible("You need an open inventory slot!", setWarningHidden);
				// 	return;
				// }
				const armour = player_items.armour();
				const repair_needed = armour.properties.get("durability") !== armour.properties.get("max_durability");
				const engineer_level = armour.properties.get("engineer_level");
				if (!repair_needed) {
					setCancelWarningVisible("Your armour is already at full durability!", setWarningHidden);
					return;
				}
				// Normal path.
				cache.requestServiceMarketEntriesByType(ServiceType.ENGINEER).then(function(cache) {
					const engineers = cache.getServiceMarketEntriesByType(ServiceType.ENGINEER);
					const valid_engineers = engineers.filter((e) => e.service.level >= engineer_level);
					const engineers_available = valid_engineers.length > 0;
					if (!engineers_available) {
						setCancelWarningVisible("No engineers avaiable.");
						return;
					}
					const cheapest_valid_engineer = valid_engineers[0];
					const enough_cash = cheapest_valid_engineer.price <= player_values.cash;
					if (!enough_cash) {
						setCancelWarningVisible("You need <br><span style=\"color: red;\">$" + cheapest_valid_engineer.price.toLocaleString() + "</span><br>to repair your armour.", setWarningHidden);
						return;
					}
					if (cheapest_valid_engineer.price <= max_repair_cost_no_confirm) {
						const slot = findFirstEmptyGenericSlot("inv");
						buyRepairArmor(player_items, market_items, cheapest_valid_engineer, armour);
						// buyRepair(player_items, market_items, cheapest_valid_engineer, slot, armour);
					} else if (cheapest_valid_engineer.price <= max_repair_cost_popup) {
						setWarningVisible("This repair will cost<br><span style=\"color: red;\">$" + cheapest_valid_engineer.price.toLocaleString() + "</span>.<br>Are you sure you want to repair your armour?",
							function() {
								const slot = findFirstEmptyGenericSlot("inv");
								buyRepairArmor(player_items, market_items, cheapest_valid_engineer, armour);
								// buyRepair(player_items, market_items, cheapest_valid_engineer, slot, armour);
								setWarningHidden();
							},
						setWarningHidden);
					}
				});
			});
		});

		// const armour_button = makeRemoveArmourButton(marketplace, function() {
		// 	if (canRemoveArmour()) {
		// 		armour_type = userVars["DFSTATS_df_armourtype"];
		// 		removeArmour();
		// 		armour_button.innerHTML = "re-equip armour";
		// 	} else if (armour_type !== undefined && findItem(armour_type) !== null && countItem(armour_type) === 1) {
		// 		const slot = findItem(armour_type);
		// 		armour_type = undefined;
		// 		reequipArmour(slot, armour_type);
		// 		armour_button.removeAttribute("disabled");
		// 		armour_button.innerHTML = "remove armour";
		// 	} else {
		// 		armour_button.setAttribute("disabled", "");
		// 	}
		// });
		// const armour_in_inventory = findItem(armour_type) !== null;
		// if (canRemoveArmour() || armour_in_inventory) {
		// 	if (canRemoveArmour()) {
		// 		armour_button.innerHTML = "remove armour";
		// 	} else {
		// 		armour_button.innerHTML = "re-equip armour";
		// 	}
		// } else {
		// 	armour_button.innerHTML = "remove armour";
		// 	armour_button.setAttribute("disabled", "");
		// }
	}

	// Main

	function main() {
		waitForItemDisplay(function() {
			// Initial addition of service buttons.
			addButtons();
			// Mutation observer to check for changes to the marketplace child nodes, re-adding the event listener
			// whenever the selectMarket element is re-added (which happens when the market tab is changed).
			const callback = function(mutationList, observer) {
				for (const record of mutationList) {
					const element = record.addedNodes[0];
					if (element !== undefined && element.id === "selectMarket") {
						const buying_button = document.getElementById("loadBuying");
						buying_button.addEventListener("click", addButtons);
					}
				}
			}
			const observer = new MutationObserver(callback);
			const marketplace = document.getElementById("marketplace");
			observer.observe(marketplace, {childList: true});
			const remove_statusbox = function(mutationList, observer) {
				for (const record of mutationList) {
					const element = record.addedNodes[0];
					if (element !== undefined && element.id === "statusBox") {
						element.remove();
					}
				}
			}
			const inventory_holder = document.getElementById("inventoryholder");
			const statusbox_observer = new MutationObserver(remove_statusbox);
			statusbox_observer.observe(inventory_holder, {childList: true});
		}, 5000);
	}

	main();
})();
