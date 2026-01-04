// ==UserScript==
// @name        Dead Frontier - API
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=24
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=35
// @grant       none
// @version     0.1.33
// @author      Shrike00
// @description Dead Frontier API
// ==/UserScript==

// Changelog
// 0.1.33 - July 26, 2025
// - Change: Added hunger scaling with survival stat.
// 0.1.32 - May 10, 2025
// - Change: Added empty backpack function.
// 0.1.31 - April 25, 2025
// - Bugfix: Fixed backpack functions.
// 0.1.30 - April 25, 2025
// - Change: Added useBackpackItem.
// 0.1.29 - April 18, 2025
// - Change: Updated itemcat to itemtype.
// 0.1.28 - February 22, 2025
// - Feature: Added discardBackpackItem.
// 0.1.27 - February 21, 2025
// - Change: Added length limit to search string.
// 0.1.26 - February 21, 2025
// - Change: Rollback 0.1.25
// 0.1.25 - February 21, 2025
// - Change: Encoded search strings with encodeURI.
// 0.1.24 - February 19, 2025
// - Change: Added data and raw_data getters to PlayerValues.
// 0.1.23 - February 7, 2025
// - Change: Fixed(?) implantsToImplants and added locking and unlocking inventory and backpack slots.
// 0.1.22 - February 7, 2025
// - Change: Added implantsToImplants.
// 0.1.21 - February 7, 2025
// - Change: Added backpackToImplants.
// 0.1.20 - February 7, 2025
// - Change: Removed window references and called in implicit scope to account for sandboxing (for non-@grant none scripts)
// - Feature: Added implant mutation.
// 0.1.19 - December 16, 2024
// - Change: Replaced references to webCall with webCall to account for const change.
// 0.1.18 - November 8, 2024
// - Bugfix: Fixed backpack slot count/iterating through backpack when not wearing one.
// - Bugfix: Fixed requesting rename data.
// 0.1.17 - November 4, 2024
// - Feature: Added search by category to MarketCache.
// 0.1.16 - October 27, 2024
// - Feature: Added CollectionBook.
// 0.1.15 - October 25, 2024
// - Bugfix: Added support for private/public selling entries.
// 0.1.14 - October 24, 2024
// - Bugfix: Added credits to stackable items.
// - Feature: Added support for searching renamed items that is completely separate from searching regular items.
// 0.1.13 - May 2, 2024
// - Change: Updated tradezone ids.
// 0.1.12 - April 11, 2024
// - Bugfix: Fixed querying backpack from uservars.
// 0.1.11 - February 25, 2024
// - Bugfix: Storage moves for larger than max stacked ammo should now work properly.
// 0.1.10 - February 22, 2024
// - Change: Added support for backpacks.
// - Change: Added mastercrafting.
// 0.1.9 - February 22, 2024
// - Change: Added generic market search strings that should work for most items.
// 0.1.8 - February 21, 2024
// - Change: Added property to Item for renames, added backpack functions for querying and moving items.
// 0.1.7 - December 15, 2023
// - Change: Added search string for all stockings.
// 0.1.6 - October 24, 2023
// - Bugfix: Item should now correctly handle cooked item names.
// 0.1.5 - August 19, 2023
// - Bugfix: Bank now checks for presence of bank elements.
// 0.1.4 - March 21, 2023
// - Change: Storage moves no longer query the storage before sending the move.
// 0.1.3 - March 19, 2023
// - Change: Added ammo, inventory, and selling entry counts to MarketItems.
// 0.1.2 - March 15, 2023
// - Change: Added additional helper functions.
// - Change: Added parameter to some functions that talk to the backend. Can now choose to not update UI on return.
// 0.1.1 - December 24, 2022
// - Change: Added Christmas Stocking 2022.

// base.js
// flshToArr(flashStr, padding, callback) takes a response and puts it to a object or sends it to a callback.
// updateIntoArr(flshArr, baseArr) copies the elements of the first array into the second.
// updateAllFields() updates weapon sidebar, vital stats/boosts sidebar.
// renderAvatarUpdate(elem, customVars) updates character avatar.
// inventory.js
// populateStorage(), populateInventory(), populateImplants(), populateCharacterInventory() all update their elements
// from userVars.
// reloadStorageData() and reloadInventoryData() load from the backend before calling the populate functions.
// TODO: Fix storage no ui updating (need to move response from storage move into local variables)
const DeadFrontier = (function() {
	'use strict';
	// TODO: Remove request methods, always re-query. Also remove uservars, global data?
	// TODO: Figure out how to request/force update global data.
	// Helpers

	function typeSplit(type) {
		// Splits item id into components.
		return type.split("_");
	}

	function stringGroups(s, size) {
		// Splits string into array of substrings of length size or smaller.
		const output = [];
		for (let i = 0; i < s.length; i += size) {
			output.push(s.substring(i, i + size));
		}
		return output;
	}

	function responseToMap(response) {
		// Converts raw string response to Map.
		const map = new Map();
		const pairs = response.split("&");
		for (let i = 0; i < pairs.length; i++) {
			const [key, value] = pairs[i].split("=");
			map.set(key, value);
		}
		map.delete(""); // Removes undefined key, since response leads with an ampersand (&).
		return map;
	}

	function updateCashBank(cash_on_hand, cash_in_bank) {
		// Updates cash and bank amount elements with provided values.
		const cash = "Cash: $"+nf.format(cash_on_hand);
		const bank = "Bank: $"+nf.format(cash_in_bank);
		$(".heldCash").each(function(cashKey, cashVal) {
			$(cashVal).text(cash).attr("data-cash", cash);
		});
		const bank_element_exists = $("#bankCash").length > 0;
		if (bank_element_exists){
			$("#bankCash").text(bank).attr("data-cash", bank);
		}
	}

	function promiseWait(dt) {
		// Returns promise that waits the given number of ms.
		const promise = new Promise(function(resolve, reject) {
			setTimeout(resolve, dt);
		});
		return promise;
	}

	function queryObjectByKey(obj, key, dt = 100) {
		// Returns promise that resolves with the object once it contains the given key.
		if (obj[key] !== undefined) {
			return Promise.resolve(obj);
		}
		const promise = new Promise(function(resolve, reject) {
			const check = setInterval(function() {
				const key_exists = obj[key] !== undefined;
				if (key_exists) {
					clearInterval(check);
					resolve(obj);
				}
			}, dt);
		});
		return promise;
	}

	function queryObjectByKeys(obj, keys, dt) {
		// Returns promise that resolves with the object once it contains all the given keys.
		const unique_keys = new Set(keys);
		const promises = Array.from(unique_keys).map((key) => queryObjectForKey(obj, key, dt));
		return Promise.all(promises).then(() => obj);
	}

	function isMastercrafted(item) {
		// Returns if item is mastercrafted.
		const properties = item.properties;
		const category = item.category
		const is_mastercrafted = properties.has("mastercrafted") && properties.get("mastercrafted") === true;
		const is_enhanceable = isEnhanceable(item);
		return is_enhanceable && is_mastercrafted;
	}

	function isNearGodcrafted(item) {
		// Returns if item is near-godcrafted.
		const properties = item.properties;
		const category = item.category;
		const is_mastercrafted = properties.has("mastercrafted") && properties.get("mastercrafted") === true;
		if (category === ItemCategory.WEAPON) {
			const total_stats = properties.get("accuracy") + properties.get("reloading") + properties.get("critical_hit");
			return total_stats === 23;
		} else if (category === ItemCategory.ARMOUR) {
			const total_stats = properties.get("agility") + properties.get("endurance");
			return total_stats === 47;
		} else if (category === ItemCategory.BACKPACK) {
			return properties.get("bonus_slots") === 2;
		} else {
			return false;
		}
	}

	function isGodcrafted(item) {
		// Returns if item is godcrafted.
		const properties = item.properties;
		const category = item.category;
		const is_mastercrafted = properties.has("mastercrafted") && properties.get("mastercrafted") === true;
		const godcrafted_weapon = is_mastercrafted && category === ItemCategory.WEAPON
			&& properties.get("accuracy") === 8 && properties.get("reloading") === 8 && properties.get("critical_hit") === 8;
		const godcrafted_armour = is_mastercrafted && category === ItemCategory.ARMOUR
			&& properties.get("agility") === 24 && properties.get("endurance") === 24;
		const godcrafted_backpack = is_mastercrafted && category === ItemCategory.BACKPACK
			&& properties.get("bonus_slots") === 3;
		return godcrafted_weapon || godcrafted_armour || godcrafted_backpack;
	}

	function isCooked(item) {
		// Returns if item is cooked.
		return item.properties.has("cooked") && item.properties.get("cooked") === true;
	}

	function isStackable(item) {
		// Returns if item is stackable.
		return item.category === ItemCategory.AMMO || item.base_type === "credits";
	}

	function isEnhanceable(item) {
		// Returns if an item can be mastercrafted/godcrafted.
		const enhanceable = new Set([ItemCategory.WEAPON, ItemCategory.ARMOUR, ItemCategory.BACKPACK]);
		return enhanceable.has(item.category);
	}

	// Enums

	const Tradezone = {
		// The integers used are the same as the internal Dead Frontier representation, so they cannot be changed.
		OUTPOST: 21,
		CAMP_VALCREST: 22,
// 		NASTYAS_HOLDOUT: 4,
// 		DOGGS_STOCKAGE: 10,
// 		PRECINCT_13: 11,
// 		FORT_PASTOR: 12,
// 		SECRONOM_BUNKER: 13,
		WASTELANDS: 10,
		NW: 1,
		N: 2,
		NE: 3,
		W: 4,
		CENTRAL: 5,
		E: 6,
		SW: 7,
		S: 8,
		SE: 9
	};

	const ItemCategory = {
		AMMO: "ammo",
		WEAPON: "weapon",
		ARMOUR: "armour",
		BACKPACK: "backpack",
		ITEM: "item",
		OTHER: "other"
	};

	const ItemSubcategory = {
		FOOD: "food",
		MEDICINE: "medicine",
		IMPLANT: "implant",
		CLOTHING: "clothing",
		BARRICADE: "barricade",
		OTHER: "other"
	};

	const ServiceType = {
		CHEF: "Chef",
		DOCTOR: "Doctor",
		ENGINEER: "Engineer"
	};

	const ProficiencyType = {
		MELEE: "melee",
		PISTOL: "pistol",
		RIFLE: "rifle",
		SHOTGUN: "shotgun",
		MACHINEGUN: "machinegun",
		EXPLOSIVE: "explosive"
	};

	const UiUpdate = {
		YES: true,
		NO: false
	};

	// Predicates

	const ItemFilters = {
		Mastercrafted: (item) => isMastercrafted(item),
		NearGodcrafted: (item) => isNearGodcrafted(item),
		Godcrafted: (item) => isGodcrafted(item),
		Cooked: (item) => isCooked(item),
		Enhanceable: (item) => isEnhanceable(item)
	};

	const ServiceFilters = {
		ServiceLevel: function(level) {
			return (service) => service.level === level;
		},
		ServiceLevels: function(levels) {
			return (service) => levels.includes(service.level);
		},
		ServiceLevelAtLeast: function(level) {
			return (service) => service.level >= level;
		}
	};

	const MarketFilters = {
		ServiceLevel: function(level) {
			return (market_entry) => market_entry.service.level === level;
		},
		ServiceLevels: function(levels) {
			return (market_entry) => levels.includes(market_entry.service.level);
		},
		ServiceLevelAtLeast: function(level) {
			return (market_entry) => market_entry.service.level >= level;
		},
		Mastercrafted: (market_entry) => isMastercrafted(market_entry.item),
		NearGodcrafted: (market_entry) => isNearGodcrafted(market_entry.item),
		Godcrafted: (market_entry) => isGodcrafted(market_entry.item),
		Cooked: (market_entry) => isCooked(market_entry.item),
		Enhanceable: (market_entry) => isEnhanceable(market_entry.item)
	};

	// Classes

	// Item, ItemMarketEntry, Service, ServiceMarketEntry
	// These classes are all simple data classes meant to hold information.

	class Item {
		static #global_data = globalData;

		#makeProperties(full_type) {
			const base_type = typeSplit(full_type)[0];
			const data = Item.#global_data[base_type];
			const is_weapon = data.itemtype === "weapon";
			const is_armour = data.itemtype === "armour";
			const is_backpack = data.itemtype === "backpack";
			// Creates properties Map from full type string.
			const components = typeSplit(full_type);
			const properties = new Map();
			// Iterate through each component.
			for (let i = 1; i < components.length; i++) {
				const component = components[i];
				const is_mastercrafted = component.indexOf("stats") !== -1;
				const has_colour = component.indexOf("colour") !== -1;
				const is_rename = component.indexOf("name") !== -1;
				if (is_mastercrafted) {
					properties.set("mastercrafted", true);
					const numbers = component.substring("stats".length);
					if (is_weapon) {
						const stats = stringGroups(numbers, 1);
						properties.set("accuracy", parseInt(stats[0]));
						properties.set("reloading", parseInt(stats[1]));
						properties.set("critical_hit", parseInt(stats[2]));
					} else if (is_armour) {
						const stats = stringGroups(numbers, 2);
						properties.set("agility", parseInt(stats[0]));
						properties.set("endurance", parseInt(stats[1]));
					} else if (is_backpack) {
						const stats = stringGroups(numbers, 1);
						properties.set("bonus_slots", parseInt(stats[0]));
					}
				} else if (has_colour) {
					const colour = component.substring("colour".length);
					properties.set("colour", colour);
				} else if (is_rename) {
					const rename = component.substring("name".length);
					properties.set("rename", rename);
				} else {
					properties.set(component, true);
				}
			}
			// Properties from globalData.
			properties.set("lootable", !("noloot" in data) || data.noloot !== "1");
			properties.set("transferable", !("no_transfer" in data) || data.no_transfer !== "1");
			if (is_weapon) {
				properties.set("weapon_type", data.type);
				properties.set("proficiency_type", data.wepPro);
				properties.set("proficiency_level", data.pro_req);
				properties.set("required_strength", data.str_req);
			} else if (is_armour) {
				properties.set("engineer_level", parseInt(data.shop_level) - 5);
				properties.set("required_strength", parseInt(data.str_req));
			} else if (is_backpack) {
				properties.set("base_slots", parseInt(data.slots));
				const total_slots = properties.has("bonus_slots") ? properties.get("base_slots") + properties.get("bonus_slots") : properties.get("base_slots");
				properties.set("total_slots", total_slots);
			}

			return properties;
		}

		#itemCategory(type) {
			// Returns item category given type.
			const data = Item.#global_data[type];
			const is_ammo = data.itemtype == "ammo";
			const is_weapon = data.itemtype == "weapon";
			const is_armour = data.itemtype == "armour";
			const is_backpack = data.itemtype === "backpack";
			const is_item = data.itemtype == "item";
			if (is_ammo) {
				return ItemCategory.AMMO;
			} else if (is_weapon) {
				return ItemCategory.WEAPON;
			} else if (is_armour) {
				return ItemCategory.ARMOUR;
			} else if (is_backpack) {
				return ItemCategory.BACKPACK;
			} else if (is_item) {
				return ItemCategory.ITEM;
			} else {
				return ItemCategory.OTHER;
			}
		}

		#itemSubcategory(type) {
			// Returns item subcategory given type. Type should have itemcat == "item".
			const data = Item.#global_data[type];
			const is_food = parseInt(data.foodrestore) > 0;
			const is_medicine = parseInt(data.healthrestore) > 0;
			const is_implant = "implant" in data && data.implant == "1";
			const is_clothing = "clothingtype" in data;
			const is_barricade = "barricade" in data && data.barricade == "1";
			if (is_food) {
				return ItemSubcategory.FOOD;
			} else if (is_medicine) {
				return ItemSubcategory.MEDICINE;
			} else if (is_implant) {
				return ItemSubcategory.IMPLANT;
			} else if (is_clothing) {
				return ItemSubcategory.CLOTHING;
			} else if (is_barricade) {
				return ItemSubcategory.BARRICADE;
			} else {
				return ItemSubcategory.OTHER;
			}
		}

		constructor(full_type, name, quantity) {
			this.full_type = full_type;
			this.base_name = name;
			this.base_type = typeSplit(full_type)[0];
			this.category = this.#itemCategory(this.base_type);
			this.quantity = parseInt(quantity);
			this.properties = this.#makeProperties(full_type);
			if (this.category === ItemCategory.ITEM) {
				this.subcategory = this.#itemSubcategory(this.base_type);
				if (this.subcategory === ItemSubcategory.CLOTHING) {
					this.properties.set("clothing_type", Item.#global_data[this.base_type].clothingtype);
				}
			}
			if (this.properties.has("cooked") && this.properties.get("cooked")) {
				this.base_name = name.substring(0, 6) === "Cooked" ? name.substring(7) : name;
				this.full_name = "Cooked " + this.base_name;
			} else if (this.properties.has("colour")) {
				this.full_name = this.properties.get("colour") + " " + this.base_name;
			}
		}
	}

	class ItemMarketEntry {
		constructor(item, price, trade_id, member_id, member_name, tradezone) {
			this.item = item;
			this.price = parseInt(price);
			this.trade_id = parseInt(trade_id)
			this.member_id = parseInt(member_id);
			this.member_name = member_name;
			this.tradezone = parseInt(tradezone);
		}
	}

	class ItemSellingEntry {
		constructor(market_entry, member_to_id, member_to_name) {
			this.market_entry = market_entry;
			this.member_to_id = parseInt(member_to_id);
			this.member_to_name = member_to_name;
		}
	}

	class Service {
		constructor(service_type, level) {
			this.service_type = service_type;
			this.level = parseInt(level);
		}
	}

	class ServiceMarketEntry {
		constructor(service, price, member_id, member_name, tradezone) {
			this.service = service;
			this.price = parseInt(price);
			this.member_id = parseInt(member_id);
			this.member_name = member_name;
			this.tradezone = tradezone;
		}
	}

	// GlobalData

	// class GlobalData {
	// 	#setupPlayerValuesWebcallParameters() {
	// 		const parameters = {};
	// 		const uservars = userVars;
	// 		parameters["userID"] = uservars["userID"];
	// 		parameters["password"] = uservars["password"];
	// 		parameters["sc"] = uservars["sc"];
	// 		parameters["template_ID"] = "";
	// 		console.debug(parameters);
	// 		return parameters;
	// 	}
 //
	// 	#_data;
	// 	#_requests_out;
	// 	constructor() {
	// 		this.#_requests_out = 0;
	// 	}
 //
	// 	request() {
	// 		const instance = this;
	// 		const promise = new Promise(function(resolve, reject) {
	// 			instance.#_requests_out += 1;
	// 			const parameters = instance.#setupPlayerValuesWebcallParameters();
	// 			const data = {};
	// 			webCall("itemspawn", data);
	// 			setTimeout(function() {
	// 				console.debug(data);
	// 			}, 5000);
	// 			// webCall("itemspawn", parameters, function(data) {
	// 			// 	instance.#_data = responseToMap(data);
	// 			// 	instance.#_requests_out -= 1;
	// 			// 	resolve(instance);
	// 			// });
	// 		});
	// 		return promise;
	// 	}
	// }


	// PlayerValues

	class PlayerValues {

		#setupPlayerValuesWebcallParameters() {
			const parameters = {};
			const uservars = userVars;
			parameters["userID"] = uservars["userID"];
			parameters["password"] = uservars["password"];
			parameters["sc"] = uservars["sc"];
			return parameters;
		}

		#query(str) {
			return this.#_data.get(str);
		}

		#_raw_data;
		#_data;
		#_requests_out;
		constructor() {
			this.#_requests_out = 0;
		}

		get data() {
			return this.#_data;
		}

		get member_id() {
			return this.#query("id_member");
		}

		get name() {
			return this.#query("df_name");
		}

		get gender() {
			return this.#query("df_gender");
		}

		get rank() {
			return this.#query("df_rank");
		}

		get profession() {
			return this.#query("df_profession");
		}

		get level() {
			return this.#query("df_level");
		}

		get dead() {
			return this.#query("df_dead") === "1";
		}

		get cash() {
			return parseInt(this.#query("df_cash"));
		}

		get bank() {
			return parseInt(this.#query("df_bankcash"));
		}

		get credits() {
			return parseInt(this.#query("df_credits"));
		}

		get gold_member() {
			return this.#query("df_goldmember") === "1"
		}

		get max_hp() {
			return parseInt(this.#query("df_hpmax"));
		}

		get current_hp() {
			return parseInt(this.#query("df_hpcurrent"));
		}

		get current_hunger() {
			return parseInt(this.#query("df_hungerhp"));
		}

		get x() {
			return parseInt(this.#query("df_positionx"));
		}

		get y() {
			return parseInt(this.#query("df_positiony"));
		}

		get stats() {
			return {
				strength: parseInt(this.#query("df_strength")),
				accuracy: parseInt(this.#query("df_accuracy")),
				agility: parseInt(this.#query("df_agility")),
				endurance: parseInt(this.#query("df_endurance")),
				critical_hit: parseInt(this.#query("df_criticalhit")),
				reloading: parseInt(this.#query("df_reloading")),
				survival: parseInt(this.#query("df_survival")),
				dexterity: parseInt(this.#query("df_dexterity"))
			};
		}

		get proficiencies() {
			return {
				melee: parseInt(this.#query("df_promelee")),
				pistols: parseInt(this.#query("df_propistol")),
				rifles: parseInt(this.#query("df_prorifle")),
				shotguns: parseInt(this.#query("df_proshotgun")),
				machine_guns: parseInt(this.#query("df_promachinegun")),
				explosives: parseInt(this.#query("df_proexplosive"))
			};
		}

		get ammo() {
			return {
				// Shotgun ammo
				"10gaugeammo": parseInt(this.#query("df_10gaugeammo")),
				"12gaugeammo": parseInt(this.#query("df_12gaugeammo")),
				"16gaugeammo": parseInt(this.#query("df_16gaugeammo")),
				"20gaugeammo": parseInt(this.#query("df_20gaugeammo")),
				// Handgun ammo
				"32ammo": parseInt(this.#query("df_32ammo")),
				"357ammo": parseInt(this.#query("df_357ammo")),
				"35ammo": parseInt(this.#query("df_35ammo")),
				"38ammo": parseInt(this.#query("df_38ammo")),
				"40ammo": parseInt(this.#query("df_40ammo")),
				"45ammo": parseInt(this.#query("df_45ammo")),
				"50ammo": parseInt(this.#query("df_50ammo")),
				"55ammo": parseInt(this.#query("df_55ammo")),
				// Rifle ammo
				"55rifleammo": parseInt(this.#query("df_55rifleammo")),
				"75rifleammo": parseInt(this.#query("df_75rifleammo")),
				"9rifleammo": parseInt(this.#query("df_9rifleammo")),
				"127rifleammo": parseInt(this.#query("df_127rifleammo")),
				"14rifleammo": parseInt(this.#query("df_14rifleammo")),
				// Grenade ammo
				"grenadeammo": parseInt(this.#query("df_grenadeammo")),
				"heavygrenadeammo": parseInt(this.#query("df_heavygrenadeammo"))
			};
		}

		get tradezone() {
			return parseInt(this.#query("df_tradezone"));
		}

		get account_name() {
			return this.#query("account_name");
		}

		get data() {
			return this.#_data;
		}

		get raw_data() {
			return this.#_raw_data;
		}

		request() {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				instance.#_requests_out += 1;
				const parameters = instance.#setupPlayerValuesWebcallParameters();
				webCall("get_values", parameters, function(data) {
					instance.#_raw_data = data;
					instance.#_data = responseToMap(data);
					instance.#_requests_out -= 1;
					resolve(instance);
				});
			});
			return promise;
		}
	}


	// PlayerItems
	// The PlayerItems class is responsible for storing item data and item movement (equipment, storage).
	// TODO: Add check for global data availability for all items (inventory, equipment).
	class PlayerItems {
		static #global_data = globalData;

		#fulltypeQuantityFromInventorySlot(slot) {
			// Returns item type and item quantity from slot.
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_invslots"]);
			if (slot > nslots || slot < 1) {
				throw new RangeError("Slot: " + slot.toString() + " out of range of inventory slots.");
			}
			const type_key = "DFSTATS_df_inv" + slot.toString() + "_type";
			const quantity_key = "DFSTATS_df_inv" + slot.toString() + "_quantity";
			return [uservars[type_key], parseInt(uservars[quantity_key])];
		}

		#fulltypeQuantityFromStorageSlot(slot) {
			const uservars = this.#_uservars;
			const storage = this.#_storage_data;
			const nslots = parseInt(uservars["DFSTATS_df_storage_slots"]);
			if (slot > nslots || slot < 1) {
				throw new RangeError("Slot: " + slot.toString() + " out of range of storage slots.");
			}
			const type_key = "df_store" + slot.toString() + "_type";
			const quantity_key = "df_store" + slot.toString() + "_quantity";
			return [storage.get(type_key), parseInt(storage.get(quantity_key))];
		}

		#nBackpackSlots() {
			// Returns number of backpack slots available.
			const uservars = this.#_uservars;
			const globaldata = PlayerItems.#global_data;
			const full_type = uservars["DFSTATS_df_backpack"];
			if (full_type === "") {
				return 0;
			}
			const base_type = typeSplit(uservars["DFSTATS_df_backpack"])[0];
			const backpack = new Item(full_type, globaldata[base_type].name, 1);
			return backpack.properties.get("total_slots");
		}

		#fulltypeQuantityFromBackpackSlot(slot) {
			// Returns item type and item quantity from slot.
			const uservars = this.#_uservars;
			const nslots = this.#nBackpackSlots();
			if (slot > nslots || slot < 1) {
				throw new RangeError("Slot: " + slot.toString() + " out of range of backpack slots.");
			}
			const type_key = "DFSTATS_df_backpack" + slot.toString() + "_type";
			const quantity_key = "DFSTATS_df_backpack" + slot.toString() + "_quantity";
			return type_key in uservars ? [uservars[type_key], parseInt(uservars[quantity_key])] : ["", ""];
		}

		#setupStorageWebcallParameters() {
			const parameters = {};
			const uservars = this.#_uservars;
			parameters["userID"] = uservars["userID"];
			parameters["password"] = uservars["password"];
			parameters["sc"] = uservars["sc"];
			parameters["pagetime"] = uservars["pagetime"];
			return parameters;
		}

		#typeFromImplantSlot(slot) {
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_implantslots"]);
			if (slot > nslots || slot < 1) {
				throw new RangeError("Slot: " + slot.toString() + " out of range of implant slots.");
			}
			const type_key = "DFSTATS_df_implant" + slot.toString() + "_type";
			return uservars[type_key];
		}

		#typeInGlobalData(type) {
			return type === "" || type in PlayerItems.#global_data;
		}

		#_uservars;
		#_storage_data;
		constructor() {
			this.#_uservars = userVars;
		}

		// Availability Checks

		inventoryAvailable() {
			// Check for userstats keys.
			const inventory_available = this.#_uservars["DFSTATS_df_invslots"] !== undefined;
			if (!inventory_available) {
				return false;
			}
			// Check for global data keys.
			const nslots = parseInt(this.#_uservars["DFSTATS_df_invslots"]);
			for (let i = 1; i <= nslots; i++) {
				const [full_type, quantity] = this.#fulltypeQuantityFromInventorySlot(i);
				const base_type = typeSplit(full_type)[0];
				if (!this.#typeInGlobalData(base_type)) {
					return false;
				}
			}
			return true;
		}

		equipmentAvailable() {
			// TODO: Check for clothing in global data.
			const uservars = this.#_uservars;
			const global_data = PlayerItems.#global_data;
			const implants_available = uservars["DFSTATS_df_implantslots"] !== undefined;
			const weapons_available = uservars["DFSTATS_df_weapon1type"] !== undefined;
			const armour_available = uservars["DFSTATS_df_armourtype"] !== undefined;
			const implants_nslots = parseInt(this.#_uservars["DFSTATS_df_implantslots"]);
			for (let i = 1; i <= implants_nslots; i++) {
				const implant_type = typeFromImplantSlot(i);
				if (!this.#typeInGlobalData(implant_type)) {
					return false;
				}
			}
			const weapons_in_globaldata = this.#typeInGlobalData(uservars["DFSTATS_df_weapon1type"]) && this.#typeInGlobalData(uservars["DFSTATS_df_weapon2type"]) && this.#typeInGlobalData(uservars["DFSTATS_df_weapon3type"]);
			if (!weapons_in_globaldata) {
				return false;
			}
			const armour_in_global_data = this.#typeInGlobalData(uservars["DFSTATS_df_armourtype"]);
			if (!armour_in_global_data) {
				return false;
			}
			return true;
		}

		storageAvailable() {
			const uservars_available = this.#_uservars !== undefined;
			return uservars_available;
		}

		// Inventory Queries

		itemFromInventorySlot(slot) {
			const [full_type, quantity] = this.#fulltypeQuantityFromInventorySlot(slot);
			if (full_type === "") {
				return undefined;
			}
			const base_type = typeSplit(full_type)[0];
			const data = PlayerItems.#global_data[base_type]
			const name = data.name;
			const item = new Item(full_type, name, quantity);
			// Adding in durability properties for armour.
			if (item.category === ItemCategory.ARMOUR) {
				item.properties.set("durability", quantity);
				item.properties.set("max_durability", parseInt(data.hp));
			}
			// Adding in cooked property for food.
			if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.FOOD) {
				const is_cooked = item.properties.has("cooked") && item.properties.get("cooked") === true;
				if (!is_cooked) {
					item.properties.set("cooked", false);
				}
			}
			// Adding in max quantity property for ammunition.
			if (item.category === ItemCategory.AMMO) {
				item.properties.set("max_quantity", parseInt(data.max_quantity));
			}
			return item;
		}

		inventory(slot) {
			return this.itemFromInventorySlot(slot);
		}

		*inventorySlots() {
			// Generator that iterates through slots and yields [slot, Item].
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_invslots"]);
			for (let slot = 1; slot <= nslots; slot++) {
				const item = this.itemFromInventorySlot(slot);
				yield [slot, item];
			}
		}

		*inventoryItems() {
			// Generator that iterates through filled slots and yields [slot, Item].
			for (const [slot, item] of this.inventorySlots()) {
				const slot_filled = item !== undefined;
				if (slot_filled) {
					yield [slot, item];
				}
			}
		}

		isLockedSlot(slot) {
			return lockedSlots.includes(slot.toString());
		}

		totalInventorySlots() {
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_invslots"]);
			return nslots;
		}

		fullInventorySlots() {
			return Array.from(this.inventorySlots()).filter((e) => e[1] !== undefined).length;
		}

		emptyInventorySlots() {
			return Array.from(this.inventorySlots()).filter((e) => e[1] === undefined).length;
		}

		// Backpack Queries

		itemFromBackpackSlot(slot) {
			const [full_type, quantity] = this.#fulltypeQuantityFromBackpackSlot(slot);
			if (full_type === "") {
				return undefined;
			}
			const base_type = typeSplit(full_type)[0];
			const data = PlayerItems.#global_data[base_type]
			const name = data.name;
			const item = new Item(full_type, name, quantity);
			// Adding in durability properties for armour.
			if (item.category === ItemCategory.ARMOUR) {
				item.properties.set("durability", quantity);
				item.properties.set("max_durability", parseInt(data.hp));
			}
			// Adding in cooked property for food.
			if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.FOOD) {
				const is_cooked = item.properties.has("cooked") && item.properties.get("cooked") === true;
				if (!is_cooked) {
					item.properties.set("cooked", false);
				}
			}
			// Adding in max quantity property for ammunition.
			if (item.category === ItemCategory.AMMO) {
				item.properties.set("max_quantity", parseInt(data.max_quantity));
			}
			return item;
		}

		backpack(slot) {
			return this.itemFromBackpackSlot(slot);
		}

		*backpackSlots() {
			// Generator that iterates through slots and yields [slot, Item].
			const uservars = this.#_uservars;
			const nslots = this.#nBackpackSlots();
			for (let slot = 1; slot <= nslots; slot++) {
				const item = this.itemFromBackpackSlot(slot);
				yield [slot, item];
			}
		}

		*backpackItems() {
			// Generator that iterates through filled slots and yields [slot, Item].
			for (const [slot, item] of this.backpackSlots()) {
				const slot_filled = item !== undefined;
				if (slot_filled) {
					yield [slot, item];
				}
			}
		}

		isLockedBackpackSlot(slot) {
			return lockedSlots.includes((slot + 1050).toString());
		}

		totalBackpackSlots() {
			return this.#nBackpackSlots();
		}

		fullBackpackSlots() {
			return Array.from(this.backpackSlots()).filter((e) => e[1] !== undefined).length;
		}

		emptyBackpackSlots() {
			return Array.from(this.backpackSlots()).filter((e) => e[1] === undefined).length;
		}

		// Implant Queries

		itemFromImplantSlot(slot) {
			const type = this.#typeFromImplantSlot(slot);
			if (type === "") {
				return undefined;
			}
			const base_type = typeSplit(type)[0];
			const name = PlayerItems.#global_data[base_type].name;
			const quantity = 1;
			const item = new Item(type, name, quantity);
			return item;
		}

		implant(slot) {
			return this.itemFromImplantSlot(slot);
		}

		*implantSlots() {
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_implantslots"]);
			for (let slot = 1; slot <= nslots; slot++) {
				const item = this.itemFromImplantSlot(slot);
				yield [slot, item];
			}
		}

		*implantItems() {
			for (const [slot, item] of this.implantSlots()) {
				const slot_filled = item !== undefined;
				if (slot_filled) {
					yield [slot, item];
				}
			}
		}

		// Equipment Queries

		armour() {
			const uservars = this.#_uservars;
			const full_type = uservars["DFSTATS_df_armourtype"];
			if (full_type === "") {
				return undefined;
			}
			const name = uservars["DFSTATS_df_armourname"];
			const durability = parseInt(uservars["DFSTATS_df_armourhp"]);
			const max_durability = parseInt(uservars["DFSTATS_df_armourhpmax"]);
			const item = new Item(full_type, name, durability);
			item.properties.set("durability", durability);
			item.properties.set("max_durability", max_durability);
			return item;
		}

		weapon(index) {
			const uservars = this.#_uservars;
			const i = index.toString();
			const full_type = uservars["DFSTATS_df_weapon" + i + "type"];
			if (full_type === "") {
				return undefined;
			}
			const name = uservars["DFSTATS_df_weapon" + i + "name"];
			const quantity = 1;
			const item = new Item(full_type, name, quantity);
			return item;
		}

		backpack() {
			const uservars = this.#_uservars;
			const full_type = uservars["DFSTATS_df_backpack"];
			if (full_type === "") {
				return undefined;
			}
			const base_type = typeSplit(full_type)[0];
			const name = PlayerItems.#global_data[base_type].name;
			const quantity = 1;
			const item = new Item(full_type, name, quantity);
			return item;
		}

		#cosmetic(key) {
			const uservars = this.#_uservars;
			const full_type = uservars[key];
			if (full_type === "") {
				return undefined;
			}
			const base_type = typeSplit(full_type)[0];
			const name = PlayerItems.#global_data[base_type].name;
			const quantity = 1;
			const item = new Item(full_type, name, quantity);
			return item;
		}

		hat() {
			return this.#cosmetic("DFSTATS_df_avatar_hat");
		}

		mask() {
			return this.#cosmetic("DFSTATS_df_avatar_mask");
		}

		coat() {
			return this.#cosmetic("DFSTATS_df_avatar_coat");
		}

		shirt() {
			return this.#cosmetic("DFSTATS_df_avatar_shirt");
		}

		trousers() {
			return this.#cosmetic("DFSTATS_df_avatar_trousers");
		}

		// Storage Queries

		requestStorage() {
			// Before any storage queries, this function must be called, as well as after any changes are made to storage.
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupStorageWebcallParameters();
				webCall("get_storage", parameters, function(data) {
					storageBox = flshToArr(data); // Update website vars.
					instance.#_storage_data = responseToMap(data);
					resolve(instance);
				}, true);
			});
			return promise;
		}

		itemFromStorageSlot(slot) {
			const [full_type, quantity] = this.#fulltypeQuantityFromStorageSlot(slot);
			if (full_type === undefined) {
				return undefined;
			}
			const base_type = typeSplit(full_type)[0];
			const data = PlayerItems.#global_data[base_type]
			const name = data.name;
			const item = new Item(full_type, name, quantity);
			if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.FOOD) {
				const is_cooked = item.properties.has("cooked") && item.properties.get("cooked") === true;
				if (!is_cooked) {
					item.properties.set("cooked", false);
				}
			}
			if (item.category === ItemCategory.AMMO) {
				item.properties.set("max_quantity", parseInt(data.max_quantity));
			}
			return item;
		}

		storage(slot) {
			return this.itemFromStorageSlot(slot);
		}

		*storageSlots() {
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_storage_slots"]);
			for (let slot = 1; slot <= nslots; slot++) {
				const item = this.itemFromStorageSlot(slot);
				yield [slot, item];
			}
		}

		*storageItems() {
			for (const [slot, item] of this.storageSlots()) {
				const slot_filled = item !== undefined;
				if (slot_filled) {
					yield [slot, item];
				}
			}
		}

		// Move Operations

		#setupMoveParameters() {
			const parameters = {};
			const uservars = this.#_uservars;
			parameters["userID"] = uservars["userID"];
			parameters["password"] = uservars["password"];
			parameters["sc"] = uservars["sc"];
			parameters["pagetime"] = uservars["pagetime"];
			parameters["templateID"] = uservars["template_ID"];
			parameters["creditsnum"] = this.#_uservars["DFSTATS_df_credits"];
			return parameters;
		}

		#quantityIsMax(item) {
			return item.quantity === item.properties.get("max_quantity");
		}

		#moveResult(item1, item2_init) {
			// Returns result of moving item1 into item2. item2 can be undefined.
			const item2 = item2_init === undefined ? new Item(item1.full_type, item1.base_name, 0) : item2_init; // Dummy item if item2 is undefined.
			const both_stackable = isStackable(item1) && isStackable(item2);
			const same_type = item1.full_type === item2.full_type;
			if (both_stackable && same_type) {
				const max = item1.properties.get("max_quantity");
				const sum = item1.quantity + item2.quantity;
				const item_stacking = item1.quantity < max && item2.quantity < max;
				if (item_stacking) {
					if (sum > max) {
						// item2 slot becomes fully stacked, item1 slot gets remainder.
						const diff = sum - max;
						const item1_new = new Item(item1.full_type, item1.base_name, diff);
						const item2_new = new Item(item2.full_type, item2.base_name, max);
						return [item1_new, item2_new];
					} else {
						// item2 slot gets full quantity, item1 slot is empty.
						const item1_new = undefined;
						const item2_new = new Item(item2.full_type, item2.base_name, sum);
						return [item1_new, item2_new];
					}
				}
			}
			// Swap items.
			return [item2, item1];
		}

		#storageArrayFromSlotItem(slot, item) {
			const delta = {};
			delta["df_store" + slot.toString() + "_type"] = item.full_type;
			delta["df_store" + slot.toString() + "_quantity"] = item.quantity.toString();
			return delta;
		}

		inventoryToInventory(primary_slot, secondary_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "newswap";
				const primary_item = instance.itemFromInventorySlot(primary_slot);
				const secondary_item = instance.itemFromInventorySlot(secondary_slot);
				parameters["itemnum"] = primary_slot.toString();
				parameters["itemnum2"] = secondary_slot.toString();
				parameters["expected_itemtype"] = primary_item !== undefined  ? primary_item.full_type : "";
				parameters["expected_itemtype2"] = secondary_item !== undefined ? secondary_item.full_type : "";
				webCall("inventory_new", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		inventoryToImplants(inventory_slot, implant_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "newswap";
				const inventory_item = instance.itemFromInventorySlot(inventory_slot);
				if (inventory_item !== undefined && (inventory_item.category !== ItemCategory.ITEM || inventory_item.subcategory !== ItemSubcategory.IMPLANT)) {
					throw new TypeError("Inventory item: " + inventory_item.full_type + " is not an implant.");
				}
				const implant_item = instance.itemFromImplantSlot(implant_slot);
				parameters["itemnum"] = inventory_slot.toString();
				parameters["itemnum2"] = (implant_slot + 1000).toString();
				parameters["expected_itemtype"] = inventory_item !== undefined ? inventory_item.full_type : "";
				parameters["expected_itemtype2"] = implant_item !== undefined ? implant_item.full_type : "";
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						populateImplants();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		#inventoryToEquipment(inventory_slot, equipment_slot, get_equipment, error_if_false, equipment_slot_name = "given", update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "newequip";
				const inventory_item = instance.itemFromInventorySlot(inventory_slot);
				if (!error_if_false(inventory_item)) {
					throw new TypeError("Inventory item: " + inventory_item.full_type + " cannot be placed in the " + equipment_slot_name + " slot.");
				}
				const equipment_item = get_equipment();
				parameters["itemnum"] = inventory_slot.toString();
				parameters["itemnum2"] = equipment_slot.toString();
				parameters["expected_itemtype"] = inventory_item !== undefined ? inventory_item.full_type : "";
				parameters["expected_itemtype2"] = equipment_item !== undefined ? equipment_item.full_type : "";
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						$.each($(".characterRender"), function(key, val)
						{
							renderAvatarUpdate(val, userVars);
						});
						populateInventory();
						populateCharacterInventory();
						updateAllFields();
						renderAvatarUpdate();
					}
					resolve(instance)
				}, true);
			});
			return promise;
		}

		inventoryToArmour(inventory_slot, update_ui = UiUpdate.YES) {
			const armour_slot = 34
			const error_if_false = (inventory_item) => inventory_item === undefined || inventory_item.category === ItemCategory.ARMOUR;
			const armour = () => this.armour();
			return this.#inventoryToEquipment(inventory_slot, armour_slot, armour, error_if_false, "armour", update_ui);
		}

		inventoryToWeapon(inventory_slot, weapon_slot, update_ui = UiUpdate.YES) {
			const adjusted_weapon_slot = weapon_slot + 30;
			const error_if_false = (inventory_item) => inventory_item === undefined || inventory_item.category === ItemCategory.WEAPON;
			const weapon = () => this.weapon(weapon_slot);
			return this.#inventoryToEquipment(inventory_slot, adjusted_weapon_slot, weapon, error_if_false, "weapon", update_ui);
		}

		inventoryToHat(inventory_slot, update_ui = UiUpdate.YES) {
			const hat_slot = 40;
			const error_if_false = (inventory_item) => inventory_item === undefined || (inventory_item.category === ItemCategory.ITEM && inventory_item.subcategory === ItemSubcategory.CLOTHING && inventory_item.properties.get("clothing_type") === "hat");
			const hat = () => this.hat();
			return this.#inventoryToEquipment(inventory_slot, hat_slot, hat, error_if_false, "hat", update_ui);
		}

		inventoryToMask(inventory_slot, update_ui = UiUpdate.YES) {
			const mask_slot = 39;
			const error_if_false = (inventory_item) => inventory_item === undefined || (inventory_item.category === ItemCategory.ITEM && inventory_item.subcategory === ItemSubcategory.CLOTHING && inventory_item.properties.get("clothing_type") === "mask");
			const mask = () => this.mask();
			return this.#inventoryToEquipment(inventory_slot, mask_slot, mask, error_if_false, "mask", update_ui);
		}

		inventoryToCoat(inventory_slot, update_ui = UiUpdate.YES) {
			const coat_slot = 38;
			const error_if_false = (inventory_item) => inventory_item === undefined || (inventory_item.category === ItemCategory.ITEM && inventory_item.subcategory === ItemSubcategory.CLOTHING && inventory_item.properties.get("clothing_type") === "coat");
			const coat = () => this.coat();
			return this.#inventoryToEquipment(inventory_slot, coat_slot, coat, error_if_false, "coat", update_ui);
		}

		inventoryToShirt(inventory_slot, update_ui = UiUpdate.YES) {
			const shirt_slot = 36;
			const error_if_false = (inventory_item) => inventory_item === undefined || (inventory_item.category === ItemCategory.ITEM && inventory_item.subcategory === ItemSubcategory.CLOTHING && inventory_item.properties.get("clothing_type") === "shirt");
			const shirt = () => this.shirt();
			return this.#inventoryToEquipment(inventory_slot, shirt_slot, shirt, error_if_false, "shirt", update_ui);
		}

		inventoryToTrousers(inventory_slot, update_ui = UiUpdate.YES) {
			const trousers_slot = 37;
			const error_if_false = (inventory_item) => inventory_item === undefined || (inventory_item.category === ItemCategory.ITEM && inventory_item.subcategory === ItemSubcategory.CLOTHING && inventory_item.properties.get("clothing_type") === "trousers");
			const trousers = () => this.trousers();
			return this.#inventoryToEquipment(inventory_slot, trousers_slot, trousers, error_if_false, "trousers", update_ui);
		}

		inventoryToStorage(inventory_slot, storage_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "store";
				const inventory_item = instance.itemFromInventorySlot(inventory_slot);
				const storage_item = instance.itemFromStorageSlot(storage_slot);
				parameters["itemnum"] = inventory_slot.toString();
				parameters["itemnum2"] = (storage_slot + 40).toString();
				parameters["expected_itemtype"] = inventory_item !== undefined  ? inventory_item.full_type : "";
				parameters["expected_itemtype2"] = storage_item !== undefined ? storage_item.full_type : "";
				webCall("inventory_new", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					const [inventory_new, storage_new] = instance.#moveResult(inventory_item, storage_item);
					if (storage_new !== undefined) {
						updateIntoArr(instance.#storageArrayFromSlotItem(storage_slot, storage_new), storageBox);
					} else {
						delete storageBox["df_store" + storage_slot.toString() + "_type"];
						delete storageBox["df_store" + storage_slot.toString() + "_quantity"];
					}
					if (update_ui) {
						populateStorage();
						populateInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		storageToInventory(storage_slot, inventory_slot, update_ui = UiUpdate.YES) {
			// Slightly different because the first item in the inventory_new webCall must be defined, and the final
			// item/stack will end up in inventory. i.e. If there is no item in the inventory slot for inventoryToStorage,
			// it will not do anything. (Also has a different action type.)
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "take";
				const inventory_item = instance.itemFromInventorySlot(inventory_slot);
				const storage_item = instance.itemFromStorageSlot(storage_slot);
				parameters["itemnum"] = (storage_slot + 40).toString();
				parameters["itemnum2"] = inventory_slot.toString();
				parameters["expected_itemtype"] = storage_item !== undefined ? storage_item.full_type : "";
				parameters["expected_itemtype2"] = inventory_item !== undefined  ? inventory_item.full_type : "";
				webCall("inventory_new", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					const [storage_new, inventory_new] = instance.#moveResult(storage_item, inventory_item);
					if (storage_new !== undefined) {
						updateIntoArr(instance.#storageArrayFromSlotItem(storage_slot, storage_new), storageBox);
					} else {
						delete storageBox["df_store" + storage_slot.toString() + "_type"];
						delete storageBox["df_store" + storage_slot.toString() + "_quantity"];
					}
					if (update_ui) {
						populateStorage();
						populateInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		inventoryToBackpack(inventory_slot, backpack_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "backpack";
				const inventory_item = instance.itemFromInventorySlot(inventory_slot);
				const backpack_item = instance.itemFromBackpackSlot(backpack_slot);
				parameters["itemnum"] = inventory_slot.toString();
				parameters["itemnum2"] = (backpack_slot + 1050).toString();
				parameters["expected_itemtype"] = inventory_item !== undefined  ? inventory_item.full_type : "";
				parameters["expected_itemtype2"] = backpack_item !== undefined ? backpack_item.full_type : "";
				webCall("hotrods/backpack", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui) {
						populateBackpack();
						populateInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		backpackToInventory(backpack_slot, inventory_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "backpack";
				const inventory_item = instance.itemFromInventorySlot(inventory_slot);
				const backpack_item = instance.itemFromBackpackSlot(backpack_slot);
				parameters["itemnum"] = (backpack_slot + 1050).toString();
				parameters["itemnum2"] = inventory_slot.toString();
				parameters["expected_itemtype"] = backpack_item !== undefined  ? backpack_item.full_type : "";
				parameters["expected_itemtype2"] = inventory_item !== undefined ? inventory_item.full_type : "";
				webCall("hotrods/backpack", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui) {
						populateBackpack();
						populateInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		emptyBackpackToInventory(update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "empty";
				parameters["itemnum"] = "";
				parameters["itemnum2"] = "";
				parameters["expected_itemtype"] = "";
				parameters["expected_itemtype2"] = "";
				webCall("hotrods/backpack", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui) {
						populateBackpack();
						populateInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		backpackToImplants(backpack_slot, implant_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupMoveParameters();
				parameters["action"] = "backpack";
				const implant_item = instance.itemFromImplantSlot(implant_slot);
				const backpack_item = instance.itemFromBackpackSlot(backpack_slot);
				const primary_slot = backpack_item !== undefined ? backpack_slot + 1050 : implant_slot + 1000;
				const secondary_slot = backpack_item !== undefined ? implant_slot + 1000: backpack_slot + 1050;
				const primary_item = backpack_item !== undefined ? backpack_item.full_type : implant_item.full_type;
				const secondary_item = (backpack_item !== undefined && implant_item !== undefined) ? implant_item.full_type : "";
				parameters["itemnum"] = primary_slot.toString();
				parameters["itemnum2"] = secondary_slot.toString();
				parameters["expected_itemtype"] = primary_item;
				parameters["expected_itemtype2"] = secondary_item;
				webCall("hotrods/backpack", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui) {
						populateBackpack();
						populateImplants();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		implantsToImplants(primary_slot, secondary_slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				// Using just the itemnum and expected_itemtype work but cause a connection error almost everytime. I'm
				// not sure which of these are necessary, so I just included everything.
				const primary_item = instance.itemFromImplantSlot(primary_slot);
				const secondary_item = instance.itemFromImplantSlot(secondary_slot);
				const parameters = {};
				const uservars = instance.#_uservars;
				parameters["pagetime"] = uservars["pagetime"];
				parameters["templateID"] = uservars["template_ID"];
				parameters["sc"] = uservars["sc"];
				parameters["creditsnum"] = instance.#_uservars["DFSTATS_df_credits"];
				parameters["buynum"] = "0";
				parameters["renameto"] = "undefined`undefined";
				parameters["expected_itemprice"] = "-1";
				parameters["expected_itemtype2"] = secondary_item !== undefined ? secondary_item.full_type : "";
				parameters["expected_itemtype"] = primary_item !== undefined ? primary_item.full_type : "";
				parameters["itemnum2"] = (secondary_slot + 1000).toString();
				parameters["itemnum"] = (primary_slot + 1000).toString();
				parameters["price"] = "2400000";
				parameters["gv"] = "21";
				parameters["userID"] = uservars["userID"];
				parameters["password"] = uservars["password"];
				parameters["action"] = "newswap";
				webCall("inventory_new", parameters, function(data)
				{
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui) {
						populateImplants();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		// Usage, Discard, Scrap, Mastercraft

		#setupItemScrapRequest() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = 0;
			parameters["buynum"] = 0;
			parameters["renameto"] = "";
			parameters["expected_itemprice"] = "-1";
			parameters["expected_itemtype2"] = "";
			parameters["itemnum2"] = "0";
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		scrapInventoryItem(slot, inventory_item, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const scrap_value = scrapValue(inventory_item.full_type, inventory_item.quantity);
				const parameters = instance.#setupItemRemovalRequest();
				parameters["action"] = "scrap";
				parameters["price"] = scrap_value;
				parameters["itemnum"] = slot.toString();
				parameters["expected_itemtype"] = inventory_item.full_type;
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						populateCharacterInventory();
						updateAllFields();
						renderAvatarUpdate();
						const cash = instance.#_uservars["DFSTATS_df_cash"];
						const bank = instance.#_uservars["DFSTATS_df_bankcash"];
						updateCashBank(cash, bank);
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		#setupItemMastercraftRequest() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = 0;
			parameters["buynum"] = 0;
			parameters["renameto"] = "";
			parameters["expected_itemprice"] = "-1";
			parameters["expected_itemtype2"] = "";
			parameters["itemnum2"] = "0";
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		mastercraftInventoryItem(slot, inventory_item, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const enhance_value = enhanceValue(inventory_item.full_type);
				const parameters = instance.#setupItemMastercraftRequest();
				parameters["action"] = "enhance";
				parameters["price"] = enhance_value;
				parameters["itemnum"] = slot.toString();
				parameters["expected_itemtype"] = inventory_item.full_type;
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						populateCharacterInventory();
						updateAllFields();
						renderAvatarUpdate();
						const cash = instance.#_uservars["DFSTATS_df_cash"];
						const bank = instance.#_uservars["DFSTATS_df_bankcash"];
						updateCashBank(cash, bank);
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		#setupItemRemovalRequest() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = this.#_uservars["DFSTATS_df_credits"];
			parameters["buynum"] = "0";
			parameters["renameto"] = "undefined`undefined";
			parameters["expected_itemprice"] = "-1";
			parameters["price"] = getUpgradePrice();
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		#useActionType(item) {
			const global_data = PlayerItems.#global_data;
			const medicine = parseInt(global_data[item.base_type]["healthrestore"]) > 0;
			const usable_gm_ticket = global_data[item.base_type]["gm_days"] && global_data[item.base_type]["gm_days"] !== "0";
			const food = parseInt(global_data[item.base_type]["foodrestore"]) > 0;
			const boost = parseInt(global_data[item.base_type]["boostdamagehours"]) > 0 || parseInt(global_data[item.base_type]["boostexphours"]) > 0 || parseInt(global_data[item.base_type]["boostspeedhours"]) > 0;
			const story_item = global_data[item.base_type]["opencontents"] && global_data[item.base_type]["opencontents"].length > 0;
			if (medicine || usable_gm_ticket) {
				return "newuse";
			} else if (food) {
				return "newconsume";
			} else if (boost) {
				return "newboost";
			} else if (story_item) {
				return "newopen";
			} else {
				return false;
			}
		}

		#actionNecessary(item) {
			const global_data = PlayerItems.#global_data;
			const medicine = parseInt(global_data[item.base_type]["healthrestore"]) > 0;
			const usable_gm_ticket = global_data[item.base_type]["gm_days"] && global_data[item.base_type]["gm_days"] !== "0";
			const food = parseInt(global_data[item.base_type]["foodrestore"]) > 0;
			const boost = parseInt(global_data[item.base_type]["boostdamagehours"]) > 0 || parseInt(global_data[item.base_type]["boostexphours"]) > 0 || parseInt(global_data[item.base_type]["boostspeedhours"]) > 0;
			const story_item = global_data[item.base_type]["opencontents"] && global_data[item.base_type]["opencontents"].length > 0;
			const need_health = parseInt(this.#_uservars["DFSTATS_df_hpcurrent"]) < parseInt(this.#_uservars["DFSTATS_df_hpmax"]);
			const maximum_hunger = parseInt(Math.round(50 + parseFloat(this.#_uservars["DFSTATS_df_survival"])*1.5));
			const need_hunger = parseInt(this.#_uservars["DFSTATS_df_hungerhp"]) < maximum_hunger;
			if (medicine) {
				return need_health;
			} else if (food) {
				return need_hunger;
			} else {
				return true;
			}
		}

		useInventoryItem(slot, inventory_item, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const action_type = instance.#useActionType(inventory_item);
				if (!action_type) {
					throw new TypeError("Cannot use Item: " + inventory_item.full_type + ".");
				}
				const action_necessary = instance.#actionNecessary(inventory_item);
				if (!action_necessary) {
					throw new RangeError("Item: " + inventory_item.full_type + " will provide no benefit when used.");
				}
				const parameters = instance.#setupItemRemovalRequest();
				parameters["action"] = action_type;
				parameters["itemnum"] = slot.toString();
				parameters["itemnum2"] = "0";
				parameters["expected_itemtype"] = inventory_item.full_type;
				parameters["expected_itemtype2"] = "";
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						populateCharacterInventory();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		useBackpackItem(slot, item, update_ui = UiUpdate.YES) {
			return this.useInventoryItem(slot + 1050, item, update_ui);
		}

		discardInventoryItem(slot, inventory_item, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupItemRemovalRequest();
				parameters["action"] = "newdiscard";
				parameters["itemnum"] = slot.toString();
				parameters["itemnum2"] = "0";
				parameters["expected_itemtype"] = inventory_item.full_type;
				parameters["expected_itemtype2"] = "";
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						populateCharacterInventory();
						updateAllFields();
						renderAvatarUpdate();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		discardBackpackItem(slot, item, update_ui = UiUpdate.YES) {
			return this.discardInventoryItem(slot + 1050, item, update_ui);
		}

		#setupItemMutateRequest() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = this.#_uservars["DFSTATS_df_credits"];
			parameters["buynum"] = "0";
			parameters["renameto"] = "undefined`undefined";
			parameters["expected_itemprice"] = "-1";
			parameters["price"] = "0";
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		mutateItem(slot, item, new_item_type, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupItemRemovalRequest();
				parameters["action"] = "mutate";
				parameters["itemnum"] = slot.toString();
				parameters["itemnum2"] = "0";
				parameters["expected_itemtype"] = item.full_type;
				parameters["expected_itemtype2"] = new_item_type;
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						populateCharacterInventory();
						populateImplants();
						updateAllFields();
						renderAvatarUpdate();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		updateLockedSlots() {
			// TODO: Add support for implants and equipment later.
			const inventory = document.getElementById("inventory");
			const backpack = document.getElementById("backpackdisplay");
			if (inventory !== null) {
				const inventory_slots = inventory.querySelectorAll("td.validSlot");
				for (const slot of inventory_slots) {
					const index = slot.dataset.slot;
					if (lockedSlots.includes(index.toString()) && !slot.classList.contains("locked")) {
						slot.classList.add("locked");
					} else if (slot.classList.contains("locked")) {
						slot.classList.remove("locked");
					}
				}
			}
			if (backpack !== null) {
				const backpack_slots = backpack.querySelectorAll("td.validSlot");
				for (const slot of backpack_slots) {
					const index = slot.dataset.slot + 1050;
					if (lockedSlots.includes(index.toString()) && !slot.classList.contains("locked")) {
						slot.classList.add("locked");
					} else if (slot.classList.contains("locked")) {
						slot.classList.remove("locked");
					}
				}
			}
		}

		lockInventorySlot(slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupItemRemovalRequest();
				const uservars = instance.#_uservars;
				parameters["itemnum"] = slot.toString();
				parameters["userID"] = uservars["userID"];
				parameters["password"] = uservars["password"];
				parameters["sc"] = uservars["sc"];
				parameters["gv"] = "21";
				parameters["action"] = "addSlot";
				webCall("hotrods/item_lock", parameters, function(data) {
					lockedSlots = data.split(',');
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						doLockedElems();
						instance.updateLockedSlots();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		unlockInventorySlot(slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupItemRemovalRequest();
				const uservars = instance.#_uservars;
				parameters["itemnum"] = slot.toString();
				parameters["userID"] = uservars["userID"];
				parameters["password"] = uservars["password"];
				parameters["sc"] = uservars["sc"];
				parameters["gv"] = "21";
				parameters["action"] = "removeSlot";
				webCall("hotrods/item_lock", parameters, function(data) {
					lockedSlots = data.split(',');
					if (update_ui === UiUpdate.YES) {
						populateInventory();
						doLockedElems();
						instance.updateLockedSlots();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		lockBackpackSlot(slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupItemRemovalRequest();
				const uservars = instance.#_uservars;
				parameters["itemnum"] = (slot + 1050).toString();
				parameters["userID"] = uservars["userID"];
				parameters["password"] = uservars["password"];
				parameters["sc"] = uservars["sc"];
				parameters["gv"] = "21";
				parameters["action"] = "addSlot";
				webCall("hotrods/item_lock", parameters, function(data) {
					lockedSlots = data.split(',');
					if (update_ui === UiUpdate.YES) {
						populateBackpack();
						doLockedElems();
						instance.updateLockedSlots();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		unlockBackpackSlot(slot, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupItemRemovalRequest();
				const uservars = instance.#_uservars;
				parameters["itemnum"] = (slot + 1050).toString();
				parameters["userID"] = uservars["userID"];
				parameters["password"] = uservars["password"];
				parameters["sc"] = uservars["sc"];
				parameters["gv"] = "21";
				parameters["action"] = "removeSlot";
				webCall("hotrods/item_lock", parameters, function(data) {
					lockedSlots = data.split(',');
					if (update_ui === UiUpdate.YES) {
						populateBackpack();
						doLockedElems();
						instance.updateLockedSlots();
						updateAllFields();
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}
	}

	// MarketItems

	class MarketItems {

		static #global_data = globalData;

		#typeInGlobalData(base_type) {
			return base_type in MarketItems.#global_data;
		}

		#_uservars;
		#_data;
		#_nselling;
		#_publicselling;
		constructor() {
			this.#_uservars = userVars;
		}

		// Availability Checks

		sellingEntriesAvailable() {
			// Run after requesting data.
			const data = this.#_data;
			const nselling = this.#_nselling;
			const publicselling = this.#_publicselling;
			for (let i = 0; i < publicselling; i++) {
				const full_type = data.get("tradelist_" + i.toString() + "_item");
				const base_type = typeSplit(full_type)[0];
				if (!this.#typeInGlobalData(base_type)) {
					return false;
				}
			}
			return true;
		}

		// Selling Queries

		#setupSellingWebcallParameters() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["tradezone"] = "";
			parameters["searchname"] = "";
			parameters["searchtype"] = "sellinglist";
			parameters["search"] = "trades";
			parameters["memID"] = this.#_uservars["userID"];
			parameters["category"] = "";
			parameters["profession"] = "";
			return parameters;
		}

		requestSelling() {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const parameters = instance.#setupSellingWebcallParameters();
				webCall("trade_search", parameters, function(data) {
					instance.#_data = responseToMap(data);
					// maxresults is the number of results for this type of trade, while totalsales is across all trades (public and private)
					// totalsales is shared between public and private sales (30 is the total sales between public and private)
					instance.#_nselling = parseInt(instance.#_data.get("tradelist_totalsales")); // maxresults vs. totalsales?
					instance.#_publicselling = parseInt(instance.#_data.get("tradelist_maxresults"));
					resolve(instance);
				});
			});
			return promise;
		}

		maxSellingEntries() {
			const uservars = this.#_uservars;
			const nslots = parseInt(uservars["DFSTATS_df_invslots"]);
			return nslots; // Maximum selling entries equal to number of inventory slots.
		}

		nSellingEntries() {
			return this.#_nselling;
		}

		availableSellingEntries() {
			return this.maxSellingEntries() - this.nSellingEntries();
		}

		itemFromSellingIndex(index) {
			const data = this.#_data;
			const full_type = data.get("tradelist_" + index.toString() + "_item");
			const name = data.get("tradelist_" + index.toString() + "_itemname");
			const quantity = data.get("tradelist_" + index.toString() + "_quantity");
			const item = new Item(full_type, name, quantity);
			return item;
		}

		marketEntryFromSellingIndex(index) {
			const item = this.itemFromSellingIndex(index);
			const data = this.#_data;
			const price =  data.get("tradelist_" + index.toString() + "_price");
			const trade_id = data.get("tradelist_" + index.toString() + "_trade_id");
			const member_id = data.get("tradelist_" + index.toString() + "_id_member");
			const member_name = data.get("tradelist_" + index.toString() + "_member_name");
			const tradezone = data.get("tradelist_" + index.toString() + "_trade_zone");
			const market_entry = new ItemMarketEntry(item, price, trade_id, member_id, member_name, tradezone);
			return market_entry;
		}

		sellingEntryFromSellingIndex(index) {
			const market_entry = this.marketEntryFromSellingIndex(index);
			const data = this.#_data;
			const member_to_id = data.get("tradelist_" + index.toString() + "_id_member_to");
			const member_to_name = data.get("tradelist_" + index.toString() + "_member_to_name");
			const selling_entry = new ItemSellingEntry(market_entry, member_to_id, member_to_name);
			return selling_entry;
		}

		*sellingEntries() {
			for (let i = 0; i < this.#_publicselling; i++) {
				yield [i, this.sellingEntryFromSellingIndex(i)];
			}
		}

		// Selling Changes

		#setupCancelSellingParameters() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = "0";
			parameters["renameto"] = "";
			parameters["expected_itemprice"] = "-1";
			parameters["expected_itemtype2"] = "";
			parameters["expected_itemtype"] = "";
			parameters["itemnum2"] = 0;
			parameters["itemnum"] = 0;
			parameters["price"] = 0;
			parameters["action"] = "newcancelsale";
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters
		}

		cancelSellingEntry(selling_entry, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const inventory_space_available = findFirstEmptyGenericSlot("inv") !== false;
				const is_credits = selling_entry.market_entry.item.full_type === "credits";
				if (!is_credits && !inventory_space_available) {
					throw new RangeError("Cannot cancel selling entry if no inventory space is available.");
				}
				const parameters = instance.#setupCancelSellingParameters();
				parameters["buynum"] = selling_entry.market_entry.trade_id;
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						if (getSellingList !== undefined) {
							getSellingList();
						} else { // These functions are also called by getSellingList, but it is undefined out of the marketplace.
							populateInventory();
							updateAllFields();
						}
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		#setupSellInventoryParameters() {
			var parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["buynum"] = 0;
			parameters["renameto"] = "";
			parameters["expected_itemprice"] = "-1"; // same on all sales
			parameters["expected_itemtype2"] = "";
			parameters["expected_itemtype"] = "";
			parameters["itemnum2"] = "0";
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		sellInventoryItem(inventory_slot, inventory_item, price, update_ui = UiUpdate.YES) {
			const instance = this;
			// return instance.requestSelling().then(
			const promise = new Promise(function(resolve, reject) {
				// const selling_list_has_space = instance.#_nselling < parseInt(instance.#_uservars["DFSTATS_df_invslots"]);
				// if (!selling_list_has_space) {
				// 	throw new RangeError("Cannot sell item when selling list is full.");
				// }
				const parameters = instance.#setupSellInventoryParameters();
				parameters["price"] = price;
				parameters["action"] = "newsell";
				parameters["expected_itemtype"] = inventory_item.full_type;
				parameters["itemnum"] = inventory_slot.toString();
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						if (getSellingList !== undefined) {
							getSellingList();
						} else {
							populateInventory();
							updateAllFields();
						}
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		// Buying Items

		#setupBuyItemParameters() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = "undefined";
			parameters["renameto"] = "undefined`undefined";
			parameters["expected_itemtype2"] = "";
			parameters["expected_itemtype"] = "";
			parameters["itemnum2"] = 0;
			parameters["itemnum"] = 0;
			parameters["price"] = 0;
			parameters["action"] = "newbuy";
			parameters["userID"] = userVars["userID"];
			parameters["password"] = userVars["password"];
			return parameters;
		}

		buyItemFromMarketEntry(market_entry, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				// Throw if inventory is full or not enough cash on-hand.
				const inventory_space_available = findFirstEmptyGenericSlot("inv") !== false;
				const enough_cash = parseInt(instance.#_uservars["DFSTATS_df_cash"]) >= market_entry.price;
				if (!inventory_space_available) {
					throw new RangeError("Cannot buy item when inventory is full.");
				}
				if (!enough_cash) {
					throw new RangeError("Cannot buy item: " + market_entry.item.full_type + " with price $" + market_entry.price.toLocaleString() + " with $" + instance.#_uservars["DFSTATS_df_cash"].toLocaleString() + " on-hand.");
				}
				// Setup parameters and request purchase.
				const parameters = instance.#setupBuyItemParameters();
				parameters["buynum"] = market_entry.trade_id;
				parameters["expected_itemprice"] = market_entry.price;
				webCall("inventory_new", parameters, function(data) {
					const item_purchase_successful = data !== "";
					if (item_purchase_successful) {
						updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
						if (update_ui === UiUpdate.YES) {
							populateInventory();
							const cash = instance.#_uservars["DFSTATS_df_cash"];
							const bank = instance.#_uservars["DFSTATS_df_bankcash"];
							updateCashBank(cash, bank);
							updateAllFields();
						}
						resolve(instance);
					} else {
						reject(instance);
					}
				}, true);
			});
			return promise;
		}

		// Buying Services

		#setupBuyServiceParameters() {
			const parameters = {};
			parameters["pagetime"] = this.#_uservars["pagetime"];
			parameters["templateID"] = this.#_uservars["template_ID"];
			parameters["sc"] = this.#_uservars["sc"];
			parameters["creditsnum"] = 0;
			parameters["renameto"] = "undefined`undefined";
			parameters["expected_itemtype2"] = "";
			parameters["expected_itemtype"] = "";
			parameters["itemnum2"] = "0";
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		#buyServiceFromMarketEntry(item_valid, service_needed, action_type, market_entry, slot, inventory_item, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				const is_valid_item = item_valid(inventory_item);
				const enough_cash = parseInt(instance.#_uservars["DFSTATS_df_cash"]) >= market_entry.price;
				if (!service_needed()) {
					throw new RangeError("Service not needed.");
				}
				if (!is_valid_item) {
					throw new TypeError("Item: " + inventory_item.full_type + " is invalid for this service.");
				}
				if (!enough_cash) {
					throw new RangeError("Cannot buy service for $" + market_entry.price.toLocaleString() + " with $" + parseInt(instance.#_uservars["DFSTATS_df_cash"]).toLocaleString() + " on-hand.");
				}
				const parameters = instance.#setupBuyServiceParameters();
				parameters["itemnum"] = slot.toString();
				parameters["price"] = scrapAmount(inventory_item.full_type, inventory_item.quantity); // I don't know why this is here.
				parameters["action"] = action_type;
				parameters["buynum"] = market_entry.member_id.toString();
				parameters["expected_itemprice"] = market_entry.price.toString();
				webCall("inventory_new", parameters, function(data) {
					updateIntoArr(flshToArr(data, "DFSTATS_"), userVars);
					if (update_ui === UiUpdate.YES) {
						loadStatusData();
						populateInventory();
						populateCharacterInventory();
						updateAllFields();
						const cash = instance.#_uservars["DFSTATS_df_cash"];
						const bank = instance.#_uservars["DFSTATS_df_bankcash"];
						updateCashBank(cash, bank);
					}
					resolve(instance);
				}, true);
			});
			return promise;
		}

		buyRepairFromMarketEntry(market_entry, slot, inventory_item, update_ui = UiUpdate.YES) {
			const item_valid = (item) => item.category === ItemCategory.ARMOUR && item.properties.get("durability") !== item.properties.get("max_durability");
			const service_needed = () => true;
			const action_type = "buyrepair";
			return this.#buyServiceFromMarketEntry(item_valid, service_needed, action_type, market_entry, slot, inventory_item, update_ui);
		}

		buyAdministerFromMarketEntry(market_entry, slot, inventory_item, update_ui = UiUpdate.YES) {
			const item_valid = (item) => item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.MEDICINE && MarketItems.#global_data[item.full_type].needdoctor === "1";
			const service_needed = () => this.#_uservars["DFSTATS_df_hpcurrent"] !== this.#_uservars["DFSTATS_df_hpmax"];
			const action_type = "buyadminister";
			return this.#buyServiceFromMarketEntry(item_valid, service_needed, action_type, market_entry, slot, inventory_item, update_ui);
		}

		buyCookFromMarketEntry(market_entry, slot, inventory_item, update_ui = UiUpdate.YES) {
			const item_valid = (item) => item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.FOOD && MarketItems.#global_data[item.full_type].needcook === "1" && (!inventory_item.properties.has("cooked") || inventory_item.properties.get("cooked") === false);
			const service_needed = () => true;
			const action_type = "buycook";
			return this.#buyServiceFromMarketEntry(item_valid, service_needed, action_type, market_entry, slot, inventory_item, update_ui);
		}
	}

	// Bank

	class Bank {
		#_player_values;
		#_uservars;
		constructor() {
			this.#_uservars = userVars;
			this.#_player_values = new PlayerValues();
		}

		#setupBankWebcallParameters() {
			const parameters = {};
			parameters["sc"] = this.#_uservars["sc"];
			parameters["userID"] = this.#_uservars["userID"];
			parameters["password"] = this.#_uservars["password"];
			return parameters;
		}

		deposit(amount, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				instance.#_player_values.request()
				.then(function(values) {
					const parameters = instance.#setupBankWebcallParameters();
					parameters["deposit"] = amount;
					if (amount > values.cash) {
						throw new RangeError("Cannot deposit: $" + amount.toLocaleString() + " is more than is carried on-hand.");
					}
					webCall("bank", parameters, function(data) {
						const map = responseToMap(data);
						if (update_ui === UiUpdate.YES) {
							const cash = parseInt(map.get("df_cash"));
							const bank = parseInt(map.get("df_bankcash"));
							updateCashBank(cash, bank);
						}
						resolve(instance);
					});
				});
			});
			return promise;
		}

		depositAll(update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				instance.#_player_values.request()
				.then(function(values) {
					return instance.deposit(values.cash, update_ui);
				});
			});
			return promise;
		}

		withdraw(amount, update_ui = UiUpdate.YES) {
			const instance = this;
			const promise = new Promise(function(resolve, reject) {
				instance.#_player_values.request()
				.then(function(values) {
					const parameters = instance.#setupBankWebcallParameters();
					parameters["withdraw"] = amount;
					if (amount > values.bank) {
						throw new RangeError("Cannot withdraw: $" + amount.toLocaleString() + " is more than is in bank.");
					}
					webCall("bank", parameters, function(data) {
						const map = responseToMap(data);
						if (update_ui === UiUpdate.YES) {
							const cash = parseInt(map.get("df_cash"));
							const bank = parseInt(map.get("df_bankcash"));
							updateCashBank(cash, bank);
						}
						resolve(instance);
					});
				});
			});
			return promise;
		}
	}

	// MarketCache
	// The MarketCache class is responsible for requesting, processing, and storing market data for items and services.

	class MarketCache {
		static #global_data = globalData;

		// Data Processing

		#specialSearchString(type) {
			// NOTE: All custom search strings go here.
			const name = MarketCache.#global_data[type].name;
			if (type == "exterminatorreactivext") {
				//     "12345678901234567890" 20 char limit
				return "reactive xt";
			} else if (type == "exterminatorreactive") {
				return "exterminator react";
			} else if (type == "xterminatorreactive") {
				return "x-terminator react";
			} else if (type == "barnellrf31crossbow") {
				return "barnell rf31";
			} else if (type == "goldenrabbitimplant") {
				return "golden rabbit imp";
			} else if (type == "xmannbergblueprints") {
				return "x-mannberg blue";
			} else if (type == "dawnsabreblueprints") {
				return "dawn blade blue";
			} else if (type == "dawnenforcerblueprints") {
				return "dawn enforcer blue";
			} else if (type == "dawncarbineblueprints") {
				return "dawn carbine blue";
			} else if (type == "dawnstrikerblueprints") {
				return "dawn striker blue";
			} else if (type == "dawnlauncherblueprints") {
				return "dawn launcher blue";
			} else if (type == "xreactiveblueprints") {
				return "x-reactive blue";
			} else if (type == "inquisitorblueprints") {
				return "inquisitor blue";
			} else if (type == "sharktoothripperblueprints") {
				return "ripper blue";
			} else if (type == "qr22obsidianblueprints") {
				return "obsidian blue";
			} else if (type == "rusthound37eblueprints") {
				return "37-e blue";
			} else if (type == "heatpit75blueprints") {
				return "pit 75 blue";
			} else if (type == "a10bullsharkblueprints") {
				return "bullshark blue";
			} else if (type == "scorchernk19blueprints") {
				return "nk19 blue";
			} else if (type == "christmasstocking2022"){
				return "stocking 2022";
			} else if (type.indexOf("christmasstocking") !== -1 && !Number.isNaN(type.slice(-4))) {
				return "stocking " + type.slice(-4);
			} else if (type.indexOf("blueprints") !== -1) {
				return name.slice(-20);
			} else if (name.length > 20) {
				return name.slice(0, 20);
			} else {
				return false;
			}
		}

		// Item Requests

		#setupItemRequest(tradezone, search_string) {
			// Sets up POST request for searching up market data for given search string and tradezone.
			const request = new XMLHttpRequest();
			request.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php");
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			// Setting up request payload.
			const request_parameters = new URLSearchParams();
			request_parameters.set("hash", "");
			request_parameters.set("pagetime", "");
			request_parameters.set("tradezone", tradezone.toString());
			request_parameters.set("searchname", encodeURI(search_string.slice(0, 20)));
			request_parameters.set("category", "");
			request_parameters.set("profession", "");
			request_parameters.set("memID", "");
			request_parameters.set("searchtype", "buyinglistitemname");
			request_parameters.set("search", "trades");
			return [request, request_parameters];
		}

		#setupCategoryRequest(tradezone, category) {
			// Sets up POST request for searching up market data for given category and tradezone.
			const request = new XMLHttpRequest();
			request.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php");
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			// Setting up request payload.
			const request_parameters = new URLSearchParams();
			request_parameters.set("hash", "");
			request_parameters.set("pagetime", "");
			request_parameters.set("tradezone", tradezone.toString());
			request_parameters.set("searchname", "");
			request_parameters.set("category", category);
			request_parameters.set("profession", "");
			request_parameters.set("memID", "");
			request_parameters.set("searchtype", "buyinglistcategory");
			request_parameters.set("search", "trades");
			return [request, request_parameters];
		}

		#deleteItemData(item_type) {
			this.item_types.delete(item_type);
			this.item_data.delete(item_type);
		}

		#deleteRenameData(rename) {
			this.renames.delete(rename);
			this.rename_data.delete(rename);
		}

		#parseItemData(response) {
			// Parses item data and puts array(s) of MarketEntry into the instance.
			const map = responseToMap(response);
			const results = parseInt(map.get("tradelist_maxresults"));
			const types = new Set(); // Contains types that this worker is operating on. These will all be new types.
			// Delete all types that exist in this request.
			const types_to_delete = new Set();
			for (let i = 0; i < results; i++) {
				const full_type = map.get("tradelist_" + i.toString() + "_item");
				const base_type = typeSplit(full_type)[0];
				types_to_delete.add(base_type);
			}
			for (const type of types_to_delete.values()) {
				if (this.hasItemType(type)) {
					this.#deleteItemData(type);
				}
			}
			// Add in new data.
			for (let i = 0; i < results; i++) {
				// Extracts MarketEntry properties from keys.
				const full_type = map.get("tradelist_" + i.toString() + "_item");
				const base_type = typeSplit(full_type)[0];
				const name = map.get("tradelist_" + i.toString() + "_itemname");
				const quantity = parseInt(map.get("tradelist_" + i.toString() + "_quantity"))
				const price = parseInt(map.get("tradelist_" + i.toString() + "_price"));
				const trade_id = parseInt(map.get("tradelist_" + i.toString() + "_trade_id"));
				const member_id = parseInt(map.get("tradelist_" + i.toString() + "_id_member"));
				const member_name = map.get("tradelist_" + i.toString() + "_member_name");
				const item = new Item(full_type, name, quantity);
				const market_entry = new ItemMarketEntry(item, price, trade_id, member_id, member_name, this.tradezone);
				const is_renamed = item.properties.has("rename");
				if (is_renamed) {
					const rename = item.properties.get("rename");
				}
				// Putting data into item data.
				if (!this.hasItemType(base_type)) { // New type that has not yet been added.
					types.add(base_type);
					this.item_types.add(base_type);
					this.item_data.set(base_type, []);
					this.item_data.get(base_type).push(market_entry);
				} else if (types.has(base_type)) { // Type that this worker has started and has exclusive access to.
					this.item_data.get(base_type).push(market_entry);
				} else { // Some other worker is handling the type.
					continue;
				}
			}
			// Sorts MarketEntry[] of newly added types by price per unit, ascending.
			for (const type of types.values()) {
				const market_entries = this.item_data.get(type);
				const item = market_entries[0].item;
				if (isStackable(item)) {
					market_entries.sort(function(a, b) {return (a.price/a.quantity) - (b.price/b.quantity);});
				} else { // Armour has its durability in its quantity, and I don't want to sort by that.
					market_entries.sort(function(a, b) {return a.price - b.price;})
				}
			}
		}

		#parseRenameData(response) {
			// Parses item data and puts array(s) of MarketEntry into the instance.
			const map = responseToMap(response);
			const results = parseInt(map.get("tradelist_maxresults"));
			const renames = new Set(); // Contains renames that this worker is operating on. These will all be new names.
			// Delete all names that exist in this request.
			const names_to_delete = new Set();
			for (let i = 0; i < results; i++) {
				const name = map.get("tradelist_" + i.toString() + "_itemname");
				names_to_delete.add(name);
			}
			for (const name of names_to_delete.values()) {
				if (this.hasRename(name)) {
					this.#deleteRenameData(name);
				}
			}
			// Add in new data.
			for (let i = 0; i < results; i++) {
				// Extracts MarketEntry properties from keys.
				const full_type = map.get("tradelist_" + i.toString() + "_item");
				const base_type = typeSplit(full_type)[0];
				const name = map.get("tradelist_" + i.toString() + "_itemname");
				const quantity = parseInt(map.get("tradelist_" + i.toString() + "_quantity"))
				const price = parseInt(map.get("tradelist_" + i.toString() + "_price"));
				const trade_id = parseInt(map.get("tradelist_" + i.toString() + "_trade_id"));
				const member_id = parseInt(map.get("tradelist_" + i.toString() + "_id_member"));
				const member_name = map.get("tradelist_" + i.toString() + "_member_name");
				const item = new Item(full_type, name, quantity);
				const market_entry = new ItemMarketEntry(item, price, trade_id, member_id, member_name, this.tradezone);
				const rename = item.properties.get("rename");
				// Putting data into rename data.
				if (!this.hasRename(rename)) { // New name that has not yet been added.
					renames.add(rename);
					this.renames.add(rename);
					this.rename_data.set(rename, []);
					this.rename_data.get(rename).push(market_entry);
				} else if (renames.has(rename)) { // Name that this worker has started and has exclusive access to.
					this.rename_data.get(rename).push(market_entry);
				} else { // Some other worker is handling this name.
					continue;
				}
			}
			// Sorts MarketEntry[] of newly added names by price per unit, ascending.
			for (const rename of renames.values()) {
				const market_entries = this.rename_data.get(rename);
				const item = market_entries[0].item;
				if (isStackable(item)) {
					market_entries.sort(function(a, b) {return (a.price/a.quantity) - (b.price/b.quantity);});
				} else { // Armour has its durability in its quantity, and I don't want to sort by that.
					market_entries.sort(function(a, b) {return a.price - b.price;})
				}
			}
		}

		#parseMixedData(response) {
			// Parses item data and puts array(s) of MarketEntry into the instance.
			const map = responseToMap(response);
			const results = parseInt(map.get("tradelist_maxresults"));
			const types = new Set(); // Contains types that this worker is operating on. These will all be new types.
			const renames = new Set();
			// Add in new data.
			for (let i = 0; i < results; i++) {
				// Extracts MarketEntry properties from keys.
				const full_type = map.get("tradelist_" + i.toString() + "_item");
				const base_type = typeSplit(full_type)[0];
				const name = map.get("tradelist_" + i.toString() + "_itemname");
				const quantity = parseInt(map.get("tradelist_" + i.toString() + "_quantity"))
				const price = parseInt(map.get("tradelist_" + i.toString() + "_price"));
				const trade_id = parseInt(map.get("tradelist_" + i.toString() + "_trade_id"));
				const member_id = parseInt(map.get("tradelist_" + i.toString() + "_id_member"));
				const member_name = map.get("tradelist_" + i.toString() + "_member_name");
				const item = new Item(full_type, name, quantity);
				const market_entry = new ItemMarketEntry(item, price, trade_id, member_id, member_name, this.tradezone);
				const is_renamed = item.properties.has("rename");
				// Putting data into item data.
				if (!is_renamed) {
					if (!this.hasItemType(base_type)) { // New type that has not yet been added.
						types.add(base_type);
						this.item_types.add(base_type);
						this.item_data.set(base_type, []);
						this.item_data.get(base_type).push(market_entry);
					} else if (types.has(base_type)) { // Type that this worker has started and has exclusive access to.
						this.item_data.get(base_type).push(market_entry);
					} else { // Some other worker is handling the type.
						continue;
					}
				} else {
					// Putting data into rename data.
					const rename = item.properties.get("rename");
					if (!this.hasRename(rename)) { // New name that has not yet been added.
						renames.add(rename);
						this.renames.add(rename);
						this.rename_data.set(rename, []);
						this.rename_data.get(rename).push(market_entry);
					} else if (renames.has(rename)) { // Name that this worker has started and has exclusive access to.
						this.rename_data.get(rename).push(market_entry);
					} else { // Some other worker is handling this name.
						continue;
					}
				}
			}
			// Sorts MarketEntry[] of newly added types by price per unit, ascending.
			for (const type of types.values()) {
				const market_entries = this.item_data.get(type);
				const item = market_entries[0].item;
				if (isStackable(item)) {
					market_entries.sort(function(a, b) {return (a.price/a.quantity) - (b.price/b.quantity);});
				} else { // Armour has its durability in its quantity, and I don't want to sort by that.
					market_entries.sort(function(a, b) {return a.price - b.price;})
				}
			}
			// Sorts MarketEntry[] of newly added names by price per unit, ascending.
			for (const rename of renames.values()) {
				const market_entries = this.rename_data.get(rename);
				const item = market_entries[0].item;
				if (isStackable(item)) {
					market_entries.sort(function(a, b) {return (a.price/a.quantity) - (b.price/b.quantity);});
				} else { // Armour has its durability in its quantity, and I don't want to sort by that.
					market_entries.sort(function(a, b) {return a.price - b.price;})
				}
			}
		}

		#requestItemData(tradezone, search_string, callback) {
			const instance = this; // Variable to hold class instance to avoid clashing with the request (inner 'this').
			const promise = new Promise(function(resolve, reject) {
				const [request, parameters] = instance.#setupItemRequest(tradezone, search_string);
				request.onreadystatechange = function() {
					const is_complete = this.readyState == 4;
					const response_ok = this.status == 200;
					const client_error = this.status >= 400 && this.status < 500;
					const server_error = this.status >= 500 && this.status < 600;
					if (is_complete && response_ok) {
						instance.#parseItemData(this.response);
						instance.#_requests_out -= 1;
						resolve(instance);
					} else if (is_complete && (client_error || server_error)) {
						instance.#_requests_out -= 1;
						reject(instance);
					}
				}
				instance.#_requests_out += 1;
				request.send(parameters);
			});
			return promise;
		}

		#requestRenameData(tradezone, search_string) {
			const instance = this; // Variable to hold class instance to avoid clashing with the request (inner 'this').
			const promise = new Promise(function(resolve, reject) {
				const [request, parameters] = instance.#setupItemRequest(tradezone, search_string);
				request.onreadystatechange = function() {
					const is_complete = this.readyState == 4;
					const response_ok = this.status == 200;
					const client_error = this.status >= 400 && this.status < 500;
					const server_error = this.status >= 500 && this.status < 600;
					if (is_complete && response_ok) {
						instance.#parseRenameData(this.response);
						instance.#_requests_out -= 1;
						resolve(instance);
					} else if (is_complete && (client_error || server_error)) {
						instance.#_requests_out -= 1;
						reject(instance);
					}
				}
				instance.#_requests_out += 1;
				request.send(parameters);
			});
			return promise;
		}

		#requestCategoricalData(tradezone, category) {
			const instance = this; // Variable to hold class instance to avoid clashing with the request (inner 'this').
			const promise = new Promise(function(resolve, reject) {
				const [request, parameters] = instance.#setupCategoryRequest(tradezone, category);
				request.onreadystatechange = function() {
					const is_complete = this.readyState == 4;
					const response_ok = this.status == 200;
					const client_error = this.status >= 400 && this.status < 500;
					const server_error = this.status >= 500 && this.status < 600;
					if (is_complete && response_ok) {
						instance.#parseMixedData(this.response);
						instance.#_requests_out -= 1;
						resolve(instance);
					} else if (is_complete && (client_error || server_error)) {
						instance.#_requests_out -= 1;
						reject(instance);
					}
				}
				instance.#_requests_out += 1;
				request.send(parameters);
			});
			return promise;
		}

		// Service Requests

		#setupServiceRequest(tradezone, service) {
			// Sets up POST request for searching up market data for given service and tradezone.
			const request = new XMLHttpRequest();
			request.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/trade_search.php");
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			// Setting up request payload.
			const request_parameters = new URLSearchParams();
			request_parameters.set("hash", "");
			request_parameters.set("pagetime", "");
			request_parameters.set("tradezone", tradezone.toString());
			request_parameters.set("searchname", "");
			request_parameters.set("category", "");
			request_parameters.set("profession", service.toString());
			request_parameters.set("memID", "");
			request_parameters.set("searchtype", "buyinglist");
			request_parameters.set("search", "services");
			return [request, request_parameters];
		}

		#deleteServiceData(service) {
			this.service_types.delete(service);
			this.service_data.delete(service);
		}

		#parseServiceData(response, service) {
			const map = responseToMap(response);
			map.set("services", true);
			const results = parseInt(map.get("tradelist_maxresults"));
			const types = new Set();
			// Deletes all types that exist in this request.
			const types_to_delete = new Set();
			for (let i = 0; i < results; i++) {
				const service_type = map.get("tradelist_" + i.toString() + "_profession");
				types_to_delete.add(service_type);
			}
			for (const type of types_to_delete.values()) {
				if (this.hasServiceType(type)) {
					this.#deleteServiceData(type);
				}
			}
			// Adding in new data.
			for (let i = 0; i < results; i++) {
				const service_type = map.get("tradelist_" + i.toString() + "_profession");
				const level = parseInt(map.get("tradelist_" + i.toString() + "_level"));
				const price = parseInt(map.get("tradelist_" + i.toString() + "_price"));
				const member_id = parseInt(map.get("tradelist_" + i.toString() + "_id_member"));
				const member_name = map.get("tradelist_" + i.toString() + "_member_name");
				const service = new Service(service_type, level);
				const market_entry = new ServiceMarketEntry(service, price, member_id, member_name, this.tradezone);
				// Putting data into service data.
				if (!this.hasServiceType(service_type)) { // New type that has not yet been added.
					types.add(service_type);
					this.service_types.add(service_type);
					this.service_data.set(service_type, []);
					this.service_data.get(service_type).push(market_entry);
				} else if (types.has(service_type)) { // Type that this worker has started and has exclusive access to.
					this.service_data.get(service_type).push(market_entry);
				} else { // Some other worker is handling the type.
					continue;
				}
			}
			for (const type of types.values()) {
				const market_entries = this.service_data.get(type);
				market_entries.sort(function(a, b) {return a.price - b.price;});
			}
		}

		#requestServiceData(tradezone, service) {
			// Requests market data for given service and tradezone. Calls parseServiceData to parse and store
			// information.
			const instance = this; // Variable to hold class instance to avoid clashing with the request (inner 'this').
			const promise = new Promise(function(resolve, reject) {
				const [request, parameters] = instance.#setupServiceRequest(tradezone, service);
				request.onreadystatechange = function() {
					const is_complete = this.readyState == 4;
					const response_ok = this.status == 200;
					const client_error = this.status >= 400 && this.status < 500;
					const server_error = this.status >= 500 && this.status < 600;
					if (is_complete && response_ok) {
						instance.#_requests_out -= 1;
						instance.#parseServiceData(this.response, service);
						resolve(instance);
					} else if (is_complete && (client_error || server_error)) {
						instance.#_requests_out -= 1;
						reject(instance);
					}
				}
				instance.#_requests_out += 1;
				request.send(parameters);
			});
			return promise;
		}

		// Public Functions

		static itemToCategorical(item) {
			if (item.category === ItemCategory.WEAPON) {
				const weapon_type = item.properties.get("weapon_type");
				if (["submachinegun", "machinegun"].includes(weapon_type)) {
					return "weapon_lightmachinegun";
				} else if (["bigmachinegun", "minigun"].includes(weapon_type)) {
					return "weapon_heavymachinegun";
				} else if (weapon_type === "grenadelauncher") {
					return "weapon_grenadelauncher";
				}
				else {
					return "weapon_" + item.properties.get("proficiency_type");
				}
			} else if (item.category === ItemCategory.ARMOUR) {
				return "armour";
			} else if (item.category === ItemCategory.AMMO) {
				if (item.base_type.indexOf("rifle") !== -1) {
					return "ammo_rifle";
				} else if (item.base_type.indexOf("gauge") !== -1) {
					return "ammo_shotgun";
				} else if (item.base_type.indexOf("grenade") !== -1) {
					return "ammo_grenade";
				} else if (item.base_type.indexOf("fuel") !== -1) {
					return "ammo_fuel";
				} else {
					return "ammo_handgun";
				}
			} else if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.FOOD) {
				return "food";
			} else if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.MEDICINE) {
				return "medical";
			} else if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.CLOTHING) {
				const clothing_type = item.properties.get("clothing_type");
				if (["mask", "hat"].includes(clothing_type)) {
					return "clothing_headwear";
				} else if (clothing_type === "coat") {
					return "clothing_coat";
				} else {
					return "clothing_basic";
				}
			} else if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.BARRICADE) {
				return "barricading";
			} else if (item.category === ItemCategory.ITEM && item.subcategory === ItemSubcategory.IMPLANT) {
				return "implants";
			} else if (item.category === ItemCategory.BACKPACK) {
				return "backpack";
			} else {
				return "misc";
			}
		}

		#_tradezone;
		#_requests_out;
		constructor(tradezone) {
			this.#_tradezone = tradezone;
			this.item_types = new Set();
			this.item_data = new Map();
			this.renames = new Set();
			this.rename_data = new Map();
			this.service_types = new Set();
			this.service_data = new Map();
			this.#_requests_out = 0;
		}

		get tradezone() {
			return this.#_tradezone;
		}

		get requests_out() {
			return this.#_requests_out;
		}

		hasItemType(type) {
			const base_type = typeSplit(type)[0];
			return this.item_types.has(base_type);
		}

		hasRename(rename) {
			return this.renames.has(rename);
		}

		getItemMarketEntriesByType(type) {
			const base_type = typeSplit(type)[0];
			const data = this.item_data.get(base_type);
			if (data === undefined) {
				throw new ReferenceError("Item: " + base_type + " unavailable.");
			} else {
				return data;
			}
		}

		getItemMarketEntriesByRename(rename) {
			const data = this.rename_data.get(rename);
			if (data === undefined) {
				throw new ReferenceError("Renamed item: " + rename + " unavailable.");
			} else {
				return data;
			}
		}

		requestItemMarketEntriesByType(type) {
			const base_type = typeSplit(type)[0];
			const special_string = this.#specialSearchString(base_type);
			const name = special_string !== false ? special_string : MarketCache.#global_data[base_type].name;
			const promise = this.#requestItemData(this.tradezone, name);
			return promise;
		}

		requestMultipleItemMarketEntriesByType(types) {
			const unique_types = new Set(types); // To avoid repeats.
			// Need to bind to avoid losing track of 'this', becoming undefined.
			const promises = Array.from(unique_types).map(this.requestItemMarketEntriesByType.bind(this));
			// Once all promises (requests) complete, unify them into a single promise that resolves to the instance.
			return Promise.allSettled(promises).then(() => this);
		}

		requestItemMarketEntriesByRename(rename) {
			const promise = this.#requestRenameData(this.tradezone, rename);
			return promise;
		}

		requestMultipleItemMarketEntriesByRename(renames) {
			const unique_renames = new Set(renames); // To avoid repeats.
			// Need to bind to avoid losing track of 'this', becoming undefined.
			const promises = Array.from(unique_renames).map(this.requestItemMarketEntriesByRename.bind(this));
			// Once all promises (requests) complete, unify them into a single promise that resolves to the instance.
			return Promise.allSettled(promises).then(() => this);
		}

		requestItemMarketEntriesByCategory(category) {
			const promise = this.#requestCategoricalData(this.tradezone, category);
			return promise;
		}

		requestMultipleItemMarketEntriesByCategory(categories) {
			const unique_categories = new Set(categories); // To avoid repeats.
			// Need to bind to avoid losing track of 'this', becoming undefined.
			const promises = Array.from(unique_categories).map(this.requestItemMarketEntriesByCategory.bind(this));
			// Once all promises (requests) complete, unify them into a single promise that resolves to the instance.
			return Promise.allSettled(promises).then(() => this);
		}

		hasServiceType(type) {
			return this.service_types.has(type);
		}

		getServiceMarketEntriesByType(type) {
			const data = this.service_data.get(type);
			if (data === undefined) {
				throw new ReferenceError("Service: " + type + " unavailable.");
			} else {
				return data;
			}
		}

		requestServiceMarketEntriesByType(type) {
			const promise = this.#requestServiceData(this.tradezone, type);
			return promise;
		}

		requestMultipleServiceMarketEntriesByType(types) {
			const unique_types = new Set(types); // To avoid repeats.
			// Need to bind to avoid losing track of 'this', becoming undefined.
			const promises = Array.from(unique_types).map(this.requestServiceMarketEntriesByType.bind(this));
			// Once all promises (requests) complete, unify them into a single promise that resolves to the instance.
			return Promise.allSettled(promises).then(() => this);
		}
	}

	// CollectionBook

	class CollectionBook {
		#setupCollectionBookRequest() {
			// Sets up POST request for requesting collection book data.
			const request = new XMLHttpRequest();
			request.open("POST", "https://fairview.deadfrontier.com/onlinezombiemmo/hotrods/collectionbook.php");
			request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			// Setting up request payload.
			const request_parameters = new URLSearchParams();
			request_parameters.set("userID", this.#_uservars["userID"]);
			request_parameters.set("password", this.#_uservars["password"]);
			request_parameters.set("sc", this.#_uservars["sc"]);
			request_parameters.set("pagetime", this.#_uservars["pagetime"]);
			request_parameters.set("memberto", this.#_uservars["userID"]);
			request_parameters.set("action", "getother");
			return [request, request_parameters];
		}

		#parseCollectionBookData(response) {
			const map = responseToMap(response);
			const count = parseInt(map.get("total_items"));
			for (let i = 0; i < count; i++) {
				const base_key = "cb" + i.toString() + "_";
				const base_type = map.get(base_key + "type");
				const quantity = parseInt(map.get(base_key + "quantity"));
				const full_type = map.get(base_key + "inv");
				const pinned = map.get(base_key + "pinned") === "1";
				const priority = parseInt(map.get(base_key + "priority"));
				this.#_ordered_types.push(base_type);
				this.#_base_types.add(base_type);
				this.#_quantities.set(base_type, quantity);
				this.#_full_types.set(base_type, full_type);
				this.#_pinned.set(base_type, pinned);
				this.#_priorities.set(base_type, priority);
			}
		}

		#_uservars;
		#_requests_out;
		#_ordered_types;
		#_base_types;
		#_quantities;
		#_full_types;
		#_pinned;
		#_priorities;
		constructor() {
			this.#_uservars = userVars;
			this.#_requests_out = 0;
			this.#_ordered_types = [];
			this.#_base_types = new Set();
			this.#_quantities = new Map();
			this.#_full_types = new Map();
			this.#_pinned = new Map();
			this.#_priorities = new Map();
		}

		get requests_out() {
			return this.#_requests_out;
		}

		requestCollectionBookData() {
			const instance = this; // Variable to hold class instance to avoid clashing with the request (inner 'this').
			const promise = new Promise(function(resolve, reject) {
				const [request, parameters] = instance.#setupCollectionBookRequest();
				request.onreadystatechange = function() {
					const is_complete = this.readyState == 4;
					const response_ok = this.status == 200;
					const client_error = this.status >= 400 && this.status < 500;
					const server_error = this.status >= 500 && this.status < 600;
					if (is_complete && response_ok) {
						instance.#_requests_out -= 1;
						instance.#parseCollectionBookData(this.response);
						resolve(instance);
					} else if (is_complete && (client_error || server_error)) {
						instance.#_requests_out -= 1;
						reject(instance);
					}
				}
				instance.#_requests_out += 1;
				request.send(parameters);
			});
			return promise;
		}

		hasType(type) {
			return this.#_base_types.has(type);
		}

		quantity(type) {
			return this.#_quantities.get(type);
		}

		fullTypeInCollection(type) {
			return this.#_full_types.get(type);
		}

		pinned(type) {
			return this.#_pinned.get(type);
		}

		priority(type) {
			return this.#_priorities.get(type);
		}

		total() {
			return this.#_base_types.size;
		}

		*types() {
			const n = this.total();
			for (let i = 0; i < n; i++) {
				yield this.#_ordered_types[i];
			}
		}
	}

	// InventoryUI

	class InventoryUI {
		#_player_items;
		constructor() {
			this.#_player_items = new PlayerItems();
		}

		#isValidSlotElementFromMouseOverElement(element) {
			const is_slot_element = element.classList.contains("validSlot");
			const is_item_element = element.classList.contains("item");
			return is_slot_element || is_item_element;
		}

		#slotSlotTypeFromMouseOverElement(element) {
			const is_slot_element = element.classList.contains("validSlot");
			const is_item_element = element.classList.contains("item");
			if (!is_slot_element && !is_item_element) {
				throw new Error("Element: " + element + " is not a slot or item element.");
			}
			const slot_element = is_slot_element ? element : element.parentNode;
			const slot = parseInt(element.dataset.slot);
			const slot_type = "slottype" in element.dataset ? element.dataset.slottype : undefined;
			return [slot, slot_type];
		}

		#elementSlotTypeCheck(element, key) {
			const [slot, slot_type] = instance.#slotSlotTypeFromMouseOverElement(element);
			return slot_type === key;
		}

		#elementIsInventory(element) {
			return this.#elementSlotTypeCheck(element, undefined);
		}

		#elementIsImplant(element) {
			return this.#elementSlotTypeCheck(element, "implant");
		}

		#elementIsWeapon(element) {
			return this.#elementSlotTypeCheck(element, "weapon");
		}

		#elementIsArmour(element) {
			return this.#elementSlotTypeCheck(element, "armour");
		}

		#elementIsHat(element) {
			return this.#elementSlotTypeCheck(element, "hat");
		}

		#elementIsMask(element) {
			return this.#elementSlotTypeCheck(element, "mask");
		}

		#elementIsCoat(element) {
			return this.#elementSlotTypeCheck(element, "coat");
		}

		#elementIsShirt(element) {
			return this.#elementSlotTypeCheck(element, "shirt");
		}

		#elementIsTrousers(element) {
			return this.#elementSlotTypeCheck("trousers");
		}
	}

	function main() {
		// setTimeout(function() {
		// 	const player_items = new PlayerItems();
		// }, 1000);
		// const market_cache = new MarketCache(21);
		// market_cache.requestItemMarketEntriesByCategory("weapon_melee")
		// .then(function() {
		// 	console.debug(market_cache);
		// });
		// setTimeout(function() {
		// 	const global_data = globalData;
		// 	const map = new Map();
		// 	for (const [key, value] of Object.entries(global_data)) {
		// 		const item = new Item(key, value.name, 1);
		// 		const transferable = item.properties.get("transferable");
		// 		if (transferable) {
		// 			map.set(key, MarketCache.itemToCategorical(item));
		// 		}
		// 	}
		// 	console.debug(map);
		// }, 1000);
		// const target = player_items.implant(16);
		// console.debug(target);
		// player_items.mutateItem("1016", target, "fortuneimplant_statsb3jrb4")
		// player_items.unlockInventorySlot(1);
		// player_items.unlockBackpackSlot(6);
		// console.debug("API");
		// const player_items = new PlayerItems();
		// for (const [slot, item] of player_items.backpackSlots()) {
		// 	console.debug(slot, item);
		// }

	}
	main();

	return {
		// Enums
		Tradezone: Tradezone,
		ItemCategory: ItemCategory,
		ItemSubcategory: ItemSubcategory,
		ServiceType: ServiceType,
		ProficiencyType: ProficiencyType,
		UiUpdate: UiUpdate,
		// Predicates
		ItemFilters: ItemFilters,
		ServiceFilters: ServiceFilters,
		MarketFilters: MarketFilters,
		// Classes
		PlayerValues: PlayerValues,
		PlayerItems: PlayerItems,
		MarketItems: MarketItems,
		Bank: Bank,
		MarketCache: MarketCache,
		CollectionBook: CollectionBook
	};

})();
