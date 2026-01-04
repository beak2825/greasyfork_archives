// ==UserScript==
// @name        Dead Frontier - Implant Setups/Loadouts
// @namespace   Dead Frontier - Shrike00
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31*
// @grant       GM.setValue
// @grant       GM.getValue
// @version     0.0.13
// @author      Shrike00
// @description Menus for changing between implants on the inventory screen and depositing/withdrawing on the storage screen.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @require https://update.greasyfork.org/scripts/526316/1534016/Multiset.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526351/Dead%20Frontier%20-%20Implant%20SetupsLoadouts.user.js
// @updateURL https://update.greasyfork.org/scripts/526351/Dead%20Frontier%20-%20Implant%20SetupsLoadouts.meta.js
// ==/UserScript==

// Changelog
// 0.0.13 - July 18, 2025
// - Change: Hide official feature.
// 0.0.12 - April 19, 2025
// - Bugfix: Fixed for JS update to website, displaying mutable implant boosts.
// 0.0.11 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.0.10 - February 26, 2025
// - Bugfix: Fix from 0.0.9, continued.
// 0.0.9 - February 26, 2025
// - Bugfix: Fixed small bug related to subsequence locking/unlocking.
// 0.0.8 - February 26, 2025
// - Change: Slight change to subsequence placement cost function: now considers swapping implants to be more expensive
// than shifting into an empty slot.
// - Change: Automatically selects currently selected setup in options.
// - Change: Updates implant inclusion table when overwriting instead of removing all children.
// - Change: Properly updates select dropdown for more operations.
// - Change: Removed many throws to avoid polluting the console and replaced them with returns.
// - Change: Added highlighting to storage menu.
// - Bugfix: Now does not highlight implant slots that end up with nothing in them.
// 0.0.7 - February 23, 2025
// - Bugfix: Incorrect condition for deciding to mutate non-unique mutables from before, changed again.
// - Change: Added in display of stats for mutable implants in inventory options menu.
// 0.0.6 - February 22, 2025
// - Bugfix: Incorrect condition for deciding to mutate non-unique mutables and incorrect selection of type to mutate
// into for non-unique mutables; now compares counts of current implants against target.
// - Change: Changed background-color to dropshadow for implants that were mutated.
// Refactoring.
// 0.0.5 - February 21, 2025
// - Change: Changed scrollbar colors (for Chromium browsers).
// 0.0.4 - February 21, 2025
// - Change: Slightly changed slot locking behaviour to avoid causing unnecessary changes to Inventory Information script.
// Comments, name changes
// 0.0.3 - February 21, 2025
// Code cleanup, no functional changes.
// 0.0.2 - February 21, 2025
// - Change: Improved swapping algorithm (should now work with non-unique mutables and be flexible enough to handle
// future positional implants).
// - Feature: Options menu on inventory for looking at setups, as well as creating, overwriting, deleting, exporting,
// and importing them.
// - Feature: Menu in storage for looking at setups and seeing what implants are needed and not needed.
// 0.0.1 - February 9, 2025
// Initial release

// TODO: Fix locking/unlocking behavior (more visible when moving large amounts of implants).
(function() {
	'use strict';

	// User Options

	// Shows setups even if you don't have enough implant slots or don't have the implants available.
	const SHOW_IMPOSSIBLE_SETUPS_DROPDOWN = false;
	// Implants that are moved into inventory or backpack have their slots locked. Implants moved from inventory or
	// backpack have their slots unlocked.
	const LOCK_UNLOCK_SLOTS = true;


	// Imports

	const UiUpdate = DeadFrontier.UiUpdate;

	const OUTPOST_INVENTORY = window.location.href.indexOf("fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25") !== -1;
	const INNERCITY = window.location.href.indexOf("fairview.deadfrontier.com/onlinezombiemmo/DF3D/DF3D_InventoryPage.php?page=31") !== -1;
	const STORAGE = window.location.href.indexOf("fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50") !== -1;

	// Classes

	class ImplantSetup {
		// Simple data class for storing implant setups.
		constructor(implants) {
			this.implants = implants;
		}
	}


	// Helpers

	function promiseWait(dt) {
		// Promise that delays by given number of milliseconds.
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

	function typeSplit(type) {
		// Splits item id into components.
		return type.split("_");
	}

	function readStoredData(obj) {
		// Reads Object into Map.
		const output = new Map();
		for (const [key, value] of Object.entries(obj)) {
			output.set(key, value);
		}
		return output;
	}

	function createStoredDataObject(map) {
		// Writes Map into Object.
		const obj = {};
		for (const [key, value] of map.entries()) {
			obj[key] = value;
		}
		return obj;
	}

	function currentImplantSetup(player_items) {
		// Returns currently equipped implants as ImplantSetup.
		const implants = [];
		for (const [slot, item] of player_items.implantItems()) {
			implants.push(item.full_type);
		}
		return new ImplantSetup(implants);
	}

	function itemTypesAvailable(player_items) {
		// Returns Multiset containing all base types of all owned items in implants, inventory, and backpack.
		const equipped_types = new Multiset(Array.from(player_items.implantItems()).map((pair) => pair[1].base_type));
		const inventory_types = new Multiset(Array.from(player_items.inventoryItems()).map((pair) => pair[1].base_type));
		const backpack_types = new Multiset(Array.from(player_items.backpackItems()).map((pair) => pair[1].base_type));
		const all_types = equipped_types.disjointUnion(inventory_types).disjointUnion(backpack_types);
		return all_types;
	}

	function hasEnoughImplantSlots(player_items, target_implant_setup) {
		// Returns true if player has enough implant slots to equip all implants in setup.
		const nslots = Array.from(player_items.implantSlots()).length;
		return nslots >= target_implant_setup.implants.length;
	}

	function implantsToUnequip(player_items, target_implant_setup) {
		// Returns base types of implants that are equipped currently, but are not in target setup.
		const needed_implant_types = new Multiset(target_implant_setup.implants.map((full_type) => typeSplit(full_type)[0]));
		const equipped_types = new Multiset(Array.from(player_items.implantItems()).map((pair) => pair[1].base_type));
		return equipped_types.difference(needed_implant_types);
	}

	function implantsToEquip(player_items, target_implant_setup) {
		// Returns base types of implants that aren't equipped currently, but are in target setup.
		const needed_implant_types = new Multiset(target_implant_setup.implants.map((full_type) => typeSplit(full_type)[0]));
		const equipped_types = new Multiset(Array.from(player_items.implantItems()).map((pair) => pair[1].base_type));
		return needed_implant_types.difference(equipped_types);
	}

	function implantAfter(base_type) {
		// Returns true if implant has special interactions when placed after another.
		const types = new Set(["mimicimplant"]);
		return types.has(base_type);
	}

	function isMutable(full_type) {
		// Returns true if implant is mutable.
		return full_type.indexOf("stats") !== -1;
	}

	function parseMutableImplantStats(stats_substring, item_data) {
		// From inventory.js
		// Getting value of each of each point.
		const implant_multipliers = item_data['implant_stats_multi'].split(',');
		for(const mult of implant_multipliers) {
			implant_multipliers[mult] = parseFloat(implant_multipliers[mult]);
		}
		// Reading values from data.
		const allowed_stats_to_mod = item_data['implant_stats'].split(',');
		const max_combinations = allowed_stats_to_mod.length;
		const max_needed_bits = parseInt(item_data['implant_stats_max_stat']).toString(2).length;
		const bonus_stats = {};
		let temp_stats = parseInt(stats_substring, 36);
		for(let i = max_combinations - 1; i >= 0; i--) {
			if(typeof bonus_stats[allowed_stats_to_mod[i]] === 'undefined') {
				bonus_stats[allowed_stats_to_mod[i]] = 0;
			}
			// Bitmasking to read stat for this bonus.
			let imp_bonus = Number(temp_stats & (Math.pow(2, max_needed_bits) - 1));
			if(imp_bonus > parseInt(item_data['implant_stats_max_stat'])) {
				imp_bonus = parseInt(item_data['implant_stats_max_stat']);
			}
			bonus_stats[allowed_stats_to_mod[i]] += imp_bonus * implant_multipliers[i];
			// RShift for next type of bonus.
			temp_stats = temp_stats >> max_needed_bits;
		}
		return bonus_stats;
	}

	function findFirstEmptyBackpackSlot(player_items) {
		// Returns first empty backpack slot, or false if there are none.
		for (const [slot, item] of player_items.backpackSlots()) {
			if (item === undefined) {
				return slot;
			}
		}
		return false;
	}

	function implantPositionalSequences(implants) {
		// Returns two values: an array of arrays showing positional subsequences and the corresponding indices,
		// e.g. [["prophecyimplant", "mimicimplant"], [2, 3]];
		const sequences = [];
		const indices = [];
		let current_sequence = null;
		for (let i = 0; i < implants.length; i++) {
			const implant = implants.toReversed()[i];
			const index = implants.length - i - 1;
			const base_type = typeSplit(implant)[0];
			if (implantAfter(base_type)) {
				indices.push(index);
				if (current_sequence === null) {
					current_sequence = [implant];
				} else {
					current_sequence.push(implant);
				}
			} else if (current_sequence !== null) {
				indices.push(index);
				current_sequence.push(implant);
				sequences.push(current_sequence.reverse());
				current_sequence = null;
			}
		}
		return [sequences.reverse(), indices.reverse()];
	}

	function range(start, stop, step = 1) {
		// Returns range of numbers as array.
		const output = [];
		for (let i = start; i < stop; i += step) {
			output.push(i);
		}
		return output;
	}

	function setupsEquivalent(setup1, setup2) {
		// Returns true if two setups are equivalent.
		const [subsequences1, _indices1] = implantPositionalSequences(setup1.implants);
		const [subsequences2, _indices2] = implantPositionalSequences(setup2.implants);
		const all_implants1 = new Multiset(setup1.implants);
		const all_implants2 = new Multiset(setup2.implants);
		const subsequence_implants1 = new Multiset(subsequences1.flat());
		const subsequence_implants2 = new Multiset(subsequences2.flat());
		const nonsubsequence_implants1 = all_implants1.difference(subsequence_implants1);
		const nonsubsequence_implants2 = all_implants2.difference(subsequence_implants2);
		// Check subsequences.
		for (const subseq1 of subsequences1) {
			let found_match = false;
			for (const subseq2 of subsequences2) {
				const arrays_equal = subseq1.length === subseq2.length && subseq1.every((e, i) => subseq1[i] === subseq2[i]);
				if (arrays_equal) {
					found_match = true;
					break;
				}
			}
			if (!found_match) {
				return false;
			}
		}
		// Check non-positionals.
		return nonsubsequence_implants1.equals(nonsubsequence_implants2);
	}

	function subsequenceStarts(nslots, player_items, full_sequence, subsequences) {
		// Returns two values: an array selected starting indices and an array of used slots.
		// e.g. [[2, 5], [[2, 3], [5, 6]];
		let packing_contradiction_found = false;
		const selected_starting_indices = [];
		const slots_used = [];
		for (const subseq of subsequences) {
			let lowest_cost = Infinity;
			let best_starting_slot = null;
			for (let slot = 1; slot <= nslots - subseq.length + 1; slot++) {
				const potential_start = slot;
				// Subsequence step i: Check if any of the potential slots would overlap with another subsequence, and
				// skip that group of indices if so.
				const potential_slots = range(potential_start, potential_start + subseq.length);
				const overlapping_index_found = potential_slots.some((slot) => slots_used.includes(slot));
				if (overlapping_index_found) {
					continue;
				}
				// Subsequence step ii: Iterate through group of potential slots, and compute cost of transforming
				// existing implants to correct subsequence.
				let working_cost = 0.0;
				for (let j = 0; j < subseq.length; j++) {
					const slot = potential_start + j;
					const current_implant = player_items.implant(slot);
					const required_implant_full_type = subseq[j];
					const required_implant_base_type = typeSplit(required_implant_full_type)[0];
					const correct = current_implant !== undefined ? current_implant.full_type === required_implant_full_type : false;
					const mutable_to_correct = current_implant !== undefined ? current_implant.base_type === required_implant_base_type : false;
					const shift_into_empty_required = current_implant === undefined;
					const swap_required = current_implant !== undefined && current_implant.base_type !== required_implant_base_type;
					if (correct) {
						working_cost += 0.0;
					} else if (mutable_to_correct) {
						working_cost += 0.5;
					} else if (shift_into_empty_required) {
						working_cost += 0.7;
					} else {
						working_cost += 1.0;
					}
				}
				if (working_cost < lowest_cost) {
					lowest_cost = working_cost;
					best_starting_slot = potential_start;
				}
			}
			// Subsequence step iii: Note best starting index for subsequence and confirm corresponding index slots.
			if (best_starting_slot === null) {
				packing_contradiction_found = true;
				break;
			}
			selected_starting_indices.push(best_starting_slot);
			slots_used.push(range(best_starting_slot, best_starting_slot + subseq.length));
		}
		if (packing_contradiction_found) {
			// If greedy subsequence locations result in it being impossible to fit all subsequences, fallback to
			// placing them in order starting at the beginning.
			selected_starting_indices.length = 0;
			slots_used.length = 0;
			let starting_slot = 1 - subsequences[0].length;
			for (const subseq of subsequences) {
				starting_slot += subseq.length;
				selected_starting_indices.push(starting_slot);
				slots_used.push(starting_slot, starting_slot + subseq.length);
			}
		}
		return [selected_starting_indices, slots_used];
	}

	function swapSetup(player_items, current_implant_setup, target_implant_setup, error_callback) {
		// Main subroutine for swapping out implants.
		// First, check if all the implants needed for the setup are available, in inventory, backpack, or already
		// equipped, and that the player has enough implant slots for the setup.
		if (target_implant_setup === undefined) {
			setErrorVisible("No implant setup selected.", error_callback);
			return Promise.reject();
			// throw new Error("No implant setup selected.");
		}
		const available_types = itemTypesAvailable(player_items);
		const needed_implants = new Multiset(target_implant_setup.implants.map((full_type) => typeSplit(full_type)[0]));
		const has_all_implants = available_types.isSupersetOf(needed_implants);
		if (!has_all_implants) {
			console.debug(needed_implants.difference(available_types));
			setErrorVisible("Implants for target setup are not all available.", error_callback);
			return Promise.reject();
			// throw new Error("Implants for target setup are not all available.");
		}
		if (!hasEnoughImplantSlots(player_items, target_implant_setup)) {
			setErrorVisible("Not enough implant slots for target setup.", error_callback);
			return Promise.reject();
			// throw new Error("Not enough implant slots for target setup.");
		}
		// Next, check if there's enough space to unequip unneeded implants.
		const implants_to_equip_base_types = implantsToEquip(player_items, target_implant_setup); // Multiset, used to track implants needed to be equipped.
		const implants_to_unequip_base_types = implantsToUnequip(player_items, target_implant_setup); // Multiset, used to track implants needed to be unequipped.
		const mutables_to_account_for_full_types = new Multiset(target_implant_setup.implants.filter((full_type) => isMutable(full_type)));
		const enough_space_to_move_out_implants = implants_to_unequip_base_types.size <= player_items.emptyBackpackSlots() + player_items.emptyInventorySlots();
		if (!enough_space_to_move_out_implants) {
			setErrorVisible("Not enough space to unequip implants.", error_callback);
			return Promise.reject();
			// throw new Error("Not enough space to unequip implants.");
		}
		const [subsequences, _] = implantPositionalSequences(target_implant_setup.implants); // Positional subsequences.
		const nslots = parseInt(userVars["DFSTATS_df_implantslots"]); // Number of implant slots.
		// STEP 1: Iterate through subsequences and choose best location for each.
		const [selected_starting_slots, subsequence_slots] = subsequenceStarts(nslots, player_items, target_implant_setup.implants, subsequences);
		// STEP 2: Actually move and mutate implants into best slots found in previous step.
		let active_promise = Promise.resolve();
		const inventory_slots_to_lock = new Set();
		const backpack_slots_to_lock = new Set();
		const inventory_slots_to_unlock = new Set();
		const backpack_slots_to_unlock = new Set();
		const inventory_slots_moved_into = new Set();
		const backpack_slots_moved_into = new Set();
		const implant_slots_moved_into = new Set();
		const implant_slots_mutated = new Set();
		for (let i = 0; i < subsequence_slots.flat().length; i++) {
			active_promise = active_promise.then(function() {
				// Look at what is currently in the implant slot and what needs to be there.
				const implant_slot = subsequence_slots.flat()[i];
				const required_implant_full = subsequences.flat()[i];
				const required_implant_base = typeSplit(required_implant_full)[0];
				const current_implant = player_items.implant(implant_slot);
				const need_to_swap = current_implant !== undefined ? current_implant.base_type !== required_implant_base : true;
				// If swapping, check other implant slots first if not being used for non-positional/non-subsequence slots.
				// If not found or they are being used there, check inventory and backpack.
				if (need_to_swap) {
					const target_implants_full = new Multiset(target_implant_setup.implants);
					const subsequence_implants_full = new Multiset(subsequences.flat());
					const subsequence_implants_base = new Multiset(subsequence_implants_full.toArray().map((full_type) => typeSplit(full_type)[0]));
					const nonsubsequence_implants_full = target_implants_full.difference(subsequence_implants_full);
					const nonsubsequence_implants_base = new Multiset(nonsubsequence_implants_full.toArray().map((full_type) => typeSplit(full_type)[0]));
					// Check if a non-positional slot contains an implant needed for the subsequence, and is not
					// required as a non-positional implant. Takes the needed subsequence implant from there if so.
					const can_take_from_nonpositional_slot = !nonsubsequence_implants_base.has(required_implant_base);
					if (can_take_from_nonpositional_slot) {
						const implants = Array.from(player_items.implantItems());
						const nonpositional_implants = implants.filter((pair) => !subsequence_slots.flat().includes(pair[0]));
						const implants_target = nonpositional_implants.find((pair) => pair[1].base_type === required_implant_base);
						if (implants_target !== undefined) {
							implant_slots_moved_into.add(implants_target[0]);
							implant_slots_moved_into.add(implant_slot);
							return player_items.implantsToImplants(implants_target[0], implant_slot, UiUpdate.NO);
						}
					}
					// Check inventory for required implant.
					const inventory = player_items.inventoryItems();
					const inventory_target = inventory.find((pair) => pair[1].base_type === required_implant_base);
					if (inventory_target !== undefined) {
						implant_slots_moved_into.add(implant_slot);
						if (current_implant !== undefined) {
							inventory_slots_to_lock.add(inventory_target[0]);
							inventory_slots_moved_into.add(inventory_target[0]);
						} else {
							inventory_slots_to_unlock.add(inventory_target[0]);
						}
						return player_items.inventoryToImplants(inventory_target[0], implant_slot, UiUpdate.NO);
					}
					// Check backpack for required implant.
					const backpack = player_items.backpackItems();
					const backpack_target = backpack.find((pair) => pair[1].base_type === required_implant_base);
					if (backpack_target !== undefined) {
						implant_slots_moved_into.add(implant_slot);
						if (current_implant !== undefined) {
							backpack_slots_to_lock.add(backpack_target[0]);
							backpack_slots_moved_into.add(backpack_target[0]);
						} else {
							backpack_slots_to_unlock.add(backpack_target[0]);
						}
						return player_items.backpackToImplants(backpack_target[0], implant_slot, UiUpdate.NO);
					}
					throw new Error("Unable to find required implant: " + required_implant_base + " in inventory/backpack.");
				}
			}).then(function() {
				// Mutate implant that is there if it needs to be mutated.
				const implant_slot = subsequence_slots.flat()[i];
				const current_implant = player_items.implant(implant_slot);
				const required_implant_full = subsequences.flat()[i];
				const need_to_mutate = current_implant.full_type !== required_implant_full;
				if (need_to_mutate) {
					implant_slots_mutated.add(implant_slot);
					return player_items.mutateItem(1000 + implant_slot, current_implant.full_type, required_implant_full, UiUpdate.NO);
				}
			});
		}
		// STEP 3: Move and mutate non-positional implants.
		const nonsubsequence_slots = range(1, nslots + 1).filter((slot) => !subsequence_slots.flat().includes(slot));
		for (let i = 0; i < nonsubsequence_slots.length; i++) {
			active_promise = active_promise.then(function() {
				// Look at what is currently in the implant slot and what non-subsequence implants remain.
				const implant_slot = nonsubsequence_slots[i];
				const current_implant = player_items.implant(implant_slot);
				const target_implants_full = new Multiset(target_implant_setup.implants);
				const subsequence_implants_full = new Multiset(subsequences.flat());
				const subsequence_implants_base = new Multiset(subsequence_implants_full.toArray().map((full_type) => typeSplit(full_type)[0]));
				const required_nonsubsequence_implants_full = target_implants_full.difference(subsequence_implants_full);
				const required_nonsubsequence_implants_base = new Multiset(required_nonsubsequence_implants_full.toArray().map((full_type) => typeSplit(full_type)[0]));
				const need_to_swap = current_implant !== undefined ? !required_nonsubsequence_implants_base.has(current_implant.base_type) : true;
				if (need_to_swap) {
					// Look for remaining implants to equip. If there are none, unequip to empty slot.
					const current_implants = Array.from(player_items.implantItems());
					const current_implants_nonsubsequence = current_implants.filter((pair) => !subsequence_slots.flat().includes(pair[0]));
					const current_implants_nonsubsequence_base = new Multiset(current_implants_nonsubsequence.map((pair) => pair[1].base_type));
					const nonsubsequence_remaining_base = required_nonsubsequence_implants_base.difference(current_implants_nonsubsequence_base);
					if (nonsubsequence_remaining_base.size > 0) {
						const required_implant_base = nonsubsequence_remaining_base.toArray()[0];
						// Look in inventory for required implant.
						const inventory = player_items.inventoryItems();
						const inventory_target = inventory.find((pair) => pair[1].base_type === required_implant_base);
						if (inventory_target !== undefined) {
							implant_slots_moved_into.add(implant_slot);
							if (current_implant !== undefined) {
								inventory_slots_to_lock.add(inventory_target[0]);
								inventory_slots_moved_into.add(inventory_target[0]);
								if (LOCK_UNLOCK_SLOTS) {
									return player_items.lockInventorySlot(inventory_target[0], UiUpdate.NO).then(function() {
										return player_items.inventoryToImplants(inventory_target[0], implant_slot, UiUpdate.NO);
									});
								} else {
									return player_items.inventoryToImplants(inventory_target[0], implant_slot, UiUpdate.NO);
								}
							} else {
								inventory_slots_to_unlock.add(inventory_target[0]);
								return player_items.inventoryToImplants(inventory_target[0], implant_slot, UiUpdate.NO);
							}
						}
						// Look in backpack for required implant.
						const backpack = player_items.backpackItems();
						const backpack_target = backpack.find((pair) => pair[1].base_type === required_implant_base);
						if (backpack_target !== undefined) {
							implant_slots_moved_into.add(implant_slot);
							if (current_implant !== undefined) {
								backpack_slots_to_lock.add(backpack_target[0]);
								backpack_slots_moved_into.add(backpack_target[0]);
								if (LOCK_UNLOCK_SLOTS) {
									return player_items.lockBackpackSlot(backpack_target[0], UiUpdate.NO).then(function() {
										return player_items.backpackToImplants(backpack_target[0], implant_slot, UiUpdate.NO);
									});
								} else {
									return player_items.backpackToImplants(backpack_target[0], implant_slot, UiUpdate.NO);
								}
							} else {
								backpack_slots_to_unlock.add(backpack_target[0]);
								return player_items.backpackToImplants(backpack_target[0], implant_slot, UiUpdate.NO);
							}
						}
					// Move non-required implant into empty slot.
					} else if (current_implant !== undefined) {
						const empty_inventory_slot = findFirstEmptyGenericSlot("inv");
						if (empty_inventory_slot) {
							inventory_slots_to_lock.add(empty_inventory_slot);
							inventory_slots_moved_into.add(empty_inventory_slot);
							implant_slots_moved_into.delete(implant_slot);
							if (LOCK_UNLOCK_SLOTS) {
								return player_items.lockInventorySlot(empty_inventory_slot, UiUpdate.NO).then(function() {
									return player_items.inventoryToImplants(empty_inventory_slot, implant_slot, UiUpdate.NO);
								});
							} else {
								return player_items.inventoryToImplants(empty_inventory_slot, implant_slot, UiUpdate.NO);
							}
						}
						const empty_backpack_slot = findFirstEmptyBackpackSlot(player_items);
						if (empty_backpack_slot) {
							backpack_slots_to_lock.add(empty_backpack_slot);
							backpack_slots_moved_into.add(empty_backpack_slot);
							implant_slots_moved_into.delete(implant_slot);
							if (LOCK_UNLOCK_SLOTS) {
								return player_items.lockBackpackSlot(empty_backpack_slot, UiUpdate.NO).then(function() {
									return player_items.backpackToImplants(empty_backpack_slot, implant_slot, UiUpdate.NO);
								});
							} else {
								return player_items.backpackToImplants(empty_backpack_slot, implant_slot, UiUpdate.NO);
							}
						}
						throw new Error("Unable to find empty slot in inventory/backpack.");
					}
				}
			}).then(function() {
				// Mutate implant that is there if it needs to be mutated.
				const implant_slot = nonsubsequence_slots[i];
				const current_implant = player_items.implant(implant_slot);
				if (current_implant === undefined) {
					return;
				}
				// Compare required count of type to current count of type.
				const target_implants_full = new Multiset(target_implant_setup.implants);
				const subsequence_implants_full = new Multiset(subsequences.flat());
				const required_nonsubsequence_implants_full = target_implants_full.difference(subsequence_implants_full);
				const current_nonsubsequence_implants = nonsubsequence_slots.map((slot) => player_items.implant(slot)).filter((item) => item !== undefined);
				const current_nonsubsequence_implants_full = new Multiset(current_nonsubsequence_implants.map((item) => item.full_type));
				const current_count = current_nonsubsequence_implants_full.count(current_implant.full_type);
				const target_count = required_nonsubsequence_implants_full.count(current_implant.full_type);
				const need_to_mutate = isMutable(current_implant.full_type) && current_count > target_count;
				if (need_to_mutate) {
					// Find an implant in the required setup that matches the base type of the current implant and does not have enough in the current setup.
					const required_implant_full = required_nonsubsequence_implants_full.toArray().find(
						(full_type) => typeSplit(full_type)[0] === current_implant.base_type &&
						current_nonsubsequence_implants_full.count(full_type) < required_nonsubsequence_implants_full.count(full_type)
					);
					implant_slots_mutated.add(implant_slot);
					return player_items.mutateItem(1000 + implant_slot, current_implant.full_type, required_implant_full, UiUpdate.NO);
				}
			});
		}
		// STEP 4: Lock/unlock relevant slots.
		if (LOCK_UNLOCK_SLOTS) {
			function lockUnlockSlots(slots, check, action) {
				let inner_promise = Promise.resolve();
				for (const slot of slots.values()) {
					inner_promise = inner_promise.then(function() {
						if (check(slot)) {
							return action(slot, UiUpdate.NO);
						}
					});
				}
				return inner_promise;
			}
			const bound_isLockedSlot = player_items.isLockedSlot.bind(player_items);
			const bound_isLockedBackpackSlot = player_items.isLockedBackpackSlot.bind(player_items);
			const bound_lockInventorySlot = player_items.lockInventorySlot.bind(player_items);
			const bound_unlockInventorySlot = player_items.unlockInventorySlot.bind(player_items);
			const bound_lockBackpackSlot = player_items.lockBackpackSlot.bind(player_items);
			const bound_unlockBackpackSlot = player_items.unlockBackpackSlot.bind(player_items);
			active_promise = active_promise.then(function() {
				return lockUnlockSlots(inventory_slots_to_unlock, (slot) => bound_isLockedSlot(slot), bound_unlockInventorySlot);
			})
			.then(function() {
				return lockUnlockSlots(inventory_slots_to_lock.difference(inventory_slots_to_unlock), (slot) => !bound_isLockedSlot(slot), bound_lockInventorySlot);
			})
			.then(function() {
				return lockUnlockSlots(backpack_slots_to_unlock, (slot) => bound_isLockedBackpackSlot(slot), bound_unlockBackpackSlot);
			})
			.then(function() {
				return lockUnlockSlots(backpack_slots_to_lock.difference(backpack_slots_to_unlock), (slot) => !bound_isLockedBackpackSlot(slot), bound_lockBackpackSlot);
			});
		}
		// Update UI.
		active_promise = active_promise.then(function() {
			populateInventory();
			populateBackpack();
			populateImplants();
			player_items.updateLockedSlots();
			doLockedElems();
			updateAllFields();
			return;
		})
		.then(function() {
			// Ending functions.
			setLoadingHidden();
			playSound("swap");
			// Highlight elements.
			const inventory = document.getElementById("inventory");
			const empty_inventory_slots = Array.from(player_items.inventorySlots()).filter((pair) => pair[1] === undefined).map((pair) => pair[0]);
			const moved_into_inventory_elements = Array.from(inventory.querySelectorAll("td"))
				.filter((td) => inventory_slots_moved_into.has(parseInt(td.dataset.slot)))
				.filter((td) => !empty_inventory_slots.includes(parseInt(td.dataset.slot)));
			const implants = document.getElementById("implants");
			const empty_implant_slots = Array.from(player_items.implantSlots()).filter((pair) => pair[1] === undefined).map((pair) => pair[0]);
			const moved_into_implant_elements = Array.from(implants.querySelectorAll("td"))
				.filter((td) => implant_slots_moved_into.has(parseInt(td.dataset.slot)))
				.filter((td) => !empty_implant_slots.includes(parseInt(td.dataset.slot)));
			const backpack = document.getElementById("backpackdisplay");
			const empty_backpack_slots = Array.from(player_items.backpackSlots()).filter((pair) => pair[1] === undefined).map((pair) => pair[0]);
			const moved_into_backpack_elements = Array.from(backpack.querySelectorAll("td"))
				.filter((td) => backpack_slots_moved_into.has(parseInt(td.dataset.slot)))
				.filter((td) => !empty_backpack_slots.includes(parseInt(td.dataset.slot)));
			const elements_to_highlight = moved_into_inventory_elements.concat(moved_into_implant_elements, moved_into_backpack_elements);
			for (const e of elements_to_highlight) {
				e.style.setProperty("background-color", "white");
				e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			}
			const mutated_implant_elements = Array.from(implants.querySelectorAll("td")).filter((td) => implant_slots_mutated.has(parseInt(td.dataset.slot)));
			for (const e of mutated_implant_elements) {
				const color = "rgba(255,255,255,0.9)";
				e.querySelector("div").style.setProperty("filter", `drop-shadow(1px 1px 1px ${color}) drop-shadow(-1px -1px 1px ${color}) drop-shadow(-1px 1px 1px ${color}) drop-shadow(1px -1px 1px ${color})`);
			}
			return promiseWait(800).then(function() {
				for (const e of elements_to_highlight) {
					e.style.removeProperty("background-color");
					e.style.removeProperty("box-shadow");
				}
				for (const e of mutated_implant_elements) {
					e.querySelector("div").style.removeProperty("filter");
				}
			});
		});
		// Final return.
		return active_promise;
	}


	// UI

	function setLoadingHidden() {
		// Hide loading UI.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		prompt.style.setProperty("display", "none");
		gamecontent.style.setProperty("display", "none");
		resetGameContent();
	}

	function setLoadingVisible() {
		// Show loading UI.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.setProperty("text-align", "center");
		gamecontent.style.setProperty("left", "200px");
		gamecontent.innerHTML = "Loading...";
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
	}

	function setErrorHidden() {
		// Hides pop-up warning.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		prompt.removeAttribute("style");
		gamecontent.removeAttribute("class");
		resetGameContent();
	}

	function setErrorVisible(text, closeCallback) {
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
		gamecontent.style.setProperty("left", "200px");
		gamecontent.innerHTML = text;
		// Buttons
		const close_button = document.createElement("button");
		close_button.style.position = "absolute";
		close_button.style.top = "72px";
		close_button.style.left = "0px";
		close_button.style.right = "0px";
		close_button.style.setProperty("margin-inline", "auto");
		close_button.style.setProperty("width", "fit-content");
		close_button.innerHTML = "close";
		close_button.addEventListener("click", closeCallback);
		gamecontent.appendChild(close_button);
	}

	function selectImplantSetup(names) {
		// Creates implant setup selection dropdown element.
		const dropdown = document.createElement("select");
		dropdown.className = "opElem";
		dropdown.style.setProperty("text-align", "left");
		dropdown.style.setProperty("left", "10px");
		dropdown.style.setProperty("top", "290px");
		dropdown.style.setProperty("width", "20%");
		dropdown.setAttribute("dfis", "");
		for (const name of names) {
			const option = document.createElement("option");
			option.innerHTML = name;
			option.setAttribute("value", name);
			dropdown.appendChild(option);
		}
		return dropdown;
	}

	function updateImplantSetupsSelect(select, implant_setups, player_items) {
		// Update dropdown menu for implant setups on inventory screens.
		const setup_options = select.querySelectorAll("option");
		const option_elements = new Map(Array.from(setup_options).map((e) => [e.getAttribute("value"), e]));
		const existing_names = new Set(Array.from(setup_options).map((e) => e.getAttribute("value")));
		const names_in_map = new Set(implant_setups.keys());
		const names_to_add = names_in_map.difference(existing_names);
		const names_to_remove = existing_names.difference(names_in_map);
		const total_names = names_in_map.union(names_to_add).difference(names_to_remove);
		const sorted_names = Array.from(total_names.values());
		function optionElement(name) {
			const e = document.createElement("option");
			e.innerHTML = name;
			e.setAttribute("value", name);
			return e;
		}
		function showSetupInSelect(setup) {
			if (SHOW_IMPOSSIBLE_SETUPS_DROPDOWN) {
				return true;
			}
			const available_types = itemTypesAvailable(player_items);
			const needed_implants = new Multiset(setup.implants.map((full_type) => typeSplit(full_type)[0]));
			const has_all_implants = available_types.isSupersetOf(needed_implants);
			const has_enough_implant_slots = hasEnoughImplantSlots(player_items, setup);
			return has_all_implants && has_enough_implant_slots;
		}
		const new_children = sorted_names
			.filter((name) => showSetupInSelect(implant_setups.get(name)))
			.map((name) => optionElement(name));
		select.replaceChildren(...new_children);
	}

	function equipButton() {
		// Equip button for inventory screen.
		const button = document.createElement("button");
		button.style.position = "absolute";
		button.style.left = "10px";
		button.style.top = "305px";
		if (INNERCITY) {
			button.style.top = "310px";
		}
		button.innerHTML = "equip";
		return button;
	}

	function deleteButton() {
		// Delete button for inventory screen.
		const button = document.createElement("button");
		button.style.position = "absolute";
		button.style.left = "70px";
		button.style.top = "320px";
		button.innerHTML = "delete";
		return button;
	}

	function deleteAllButton() {
		// Delete all button for inventory options menu.
		const button = document.createElement("button");
		button.innerHTML = "delete all";
		return button;
	}

	function newButton() {
		// New button for inventory options menu.
		const button = document.createElement("button");
		button.style.position = "absolute";
		button.style.left = "140px";
		button.style.top = "320px";
		button.innerHTML = "new";
		return button;
	}

	function overwriteButton() {
		// Overwrite button for inventory options menu.
		const button = document.createElement("button");
		button.style.position = "absolute";
		button.style.left = "140px";
		button.style.top = "320px";
		button.innerHTML = "overwrite";
		return button;
	}

	function exportButton() {
		// Export button for inventory options menu.
		const button = document.createElement("button");
		button.innerHTML = "export";
		return button;
	}

	function exportAllButton() {
		// Export all button for inventory options menu.
		const button = document.createElement("button");
		button.innerHTML = "export all";
		return button;
	}

	function importButton() {
		// Import button for inventory options menu.
		const button = document.createElement("button");
		button.innerHTML = "import";
		return button;
	}

	function optionsButton() {
		// Options button for inventory screens.
		const button = document.createElement("button");
		button.style.position = "absolute";
		button.style.left = "65px";
		button.style.top = "305px";
		if (INNERCITY) {
			button.style.top = "310px";
		}
		button.innerHTML = "options";
		return button;
	}

	function resetGameContent() {
		// Resets #gamecontent to original values.
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.setProperty("height", "100px");
		gamecontent.style.setProperty("width", "270px");
		gamecontent.style.setProperty("left", "208px");
		gamecontent.style.setProperty("top", "195px");
		gamecontent.style.removeProperty("border");
	}

	function setSubmitPromptVisible(text, inputValid, submitCallback, cancelCallback, initial_value = "") {
		// Shows pop-up warning/prompt for text input submission.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		gamecontent.style.setProperty("height", "110px");
		gamecontent.style.setProperty("left", "204px");
		gamecontent.style.setProperty("border", "red 1px solid");
		// Message
		const message_div = document.createElement("div");
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
		// message_div.style.setProperty("position", "absolute");
		// message_div.style.setProperty("top", "5px");
		message_div.style.setProperty("margin", "auto");
		message_div.style.setProperty("width", "95%");
		message_div.style.setProperty("font-family", "\"Courier New CE\", Arial");
		message_div.style.setProperty("font-weight", "bold");
		message_div.style.setProperty("color", "white");
		message_div.style.setProperty("text-align", "center");
		message_div.innerHTML = text;
		// Name Input
		const input_div = document.createElement("div");
		input_div.style.setProperty("position", "absolute");
		input_div.style.setProperty("bottom", "25px");
		input_div.style.setProperty("left", "50px");
		const input = document.createElement("input");
		input.type = "text";
		input.value = "";
		if (INNERCITY) {
			input.style.setProperty("color", "black");
		}
		input_div.appendChild(input);
		gamecontent.appendChild(message_div);
		gamecontent.appendChild(input_div);
		// Buttons
		const cancel_button = document.createElement("button");
		cancel_button.style.position = "absolute";
		cancel_button.style.top = "92px";
		cancel_button.style.left = "80px";
		cancel_button.style.right = "0px";
		cancel_button.style.setProperty("margin-inline", "auto");
		cancel_button.style.setProperty("width", "fit-content");
		cancel_button.innerHTML = "cancel";
		cancel_button.addEventListener("click", function() {
			resetGameContent();
			cancelCallback();
		});
		gamecontent.appendChild(cancel_button);
		const submit_button = document.createElement("button");
		submit_button.style.position = "absolute";
		submit_button.style.top = "92px";
		submit_button.style.left = "0px";
		submit_button.style.right = "80px";
		submit_button.style.setProperty("margin-inline", "auto");
		submit_button.style.setProperty("width", "fit-content");
		submit_button.innerHTML = "submit";
		submit_button.addEventListener("click", function() {
			resetGameContent();
			submitCallback(input.value);
		});
		gamecontent.appendChild(submit_button);
		// Set initial value of yes button.
		const input_valid = inputValid(input.value);
		if (input_valid) {
			submit_button.removeAttribute("disabled");
		} else {
			submit_button.setAttribute("disabled", true);
		}
		// Focus input and only make yes button enabled if input is valid.
		input.focus();
		input.oninput = function(e) {
			const input_valid = inputValid(input.value);
			if (input_valid) {
				submit_button.removeAttribute("disabled");
			} else {
				submit_button.setAttribute("disabled", true);
			}
		};
		return input;
	}

	function setYesNoPromptVisible(text, yesCallback, noCallback) {
		// Shows pop-up warning/prompt for yes/no actions.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		gamecontent.style.setProperty("height", "110px");
		gamecontent.style.setProperty("left", "204px");
		gamecontent.style.setProperty("border", "red 1px solid");
		// Message
		const message_div = document.createElement("div");
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
		// message_div.style.setProperty("position", "absolute");
		// message_div.style.setProperty("top", "5px");
		message_div.style.setProperty("margin", "auto");
		message_div.style.setProperty("width", "95%");
		message_div.style.setProperty("font-family", "\"Courier New CE\", Arial");
		message_div.style.setProperty("font-weight", "bold");
		message_div.style.setProperty("color", "white");
		message_div.style.setProperty("text-align", "center");
		message_div.innerHTML = text;
		gamecontent.appendChild(message_div);
		// Buttons
		const no_button = document.createElement("button");
		no_button.style.position = "absolute";
		no_button.style.top = "92px";
		no_button.style.left = "80px";
		no_button.style.right = "0px";
		no_button.style.setProperty("margin-inline", "auto");
		no_button.style.setProperty("width", "fit-content");
		no_button.innerHTML = "no";
		no_button.addEventListener("click", function() {
			resetGameContent();
			noCallback();
		});
		gamecontent.appendChild(no_button);
		const yes_button = document.createElement("button");
		yes_button.style.position = "absolute";
		yes_button.style.top = "92px";
		yes_button.style.left = "0px";
		yes_button.style.right = "80px";
		yes_button.style.setProperty("margin-inline", "auto");
		yes_button.style.setProperty("width", "fit-content");
		yes_button.innerHTML = "yes";
		yes_button.addEventListener("click", function() {
			resetGameContent();
			yesCallback();
		});
		gamecontent.appendChild(yes_button);
	}

	function setTextConfirmationPromptVisible(message, inputValid, submitCallback, cancelCallback) {
		// Shows pop-up warning/prompt that requires typing or copying something into a text input.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		gamecontent.style.setProperty("height", "150px");
		gamecontent.style.setProperty("left", "204px");
		gamecontent.style.setProperty("border", "red 1px solid");
		// Message
		const message_div = document.createElement("div");
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
		// message_div.style.setProperty("position", "absolute");
		// message_div.style.setProperty("top", "5px");
		message_div.style.setProperty("margin", "auto");
		message_div.style.setProperty("width", "95%");
		message_div.style.setProperty("font-family", "\"Courier New CE\", Arial");
		message_div.style.setProperty("font-weight", "bold");
		message_div.style.setProperty("color", "white");
		message_div.style.setProperty("text-align", "center");
		message_div.innerHTML = message;
		// Name Input
		const input_div = document.createElement("div");
		input_div.style.setProperty("position", "absolute");
		input_div.style.setProperty("bottom", "25px");
		input_div.style.setProperty("left", "50px");
		const input = document.createElement("input");
		input.type = "text";
		input.value = "";
		if (INNERCITY) {
			input.style.setProperty("color", "black");
		}
		input_div.appendChild(input);
		gamecontent.appendChild(message_div);
		gamecontent.appendChild(input_div);
		// Buttons
		const cancel_button = document.createElement("button");
		cancel_button.style.position = "absolute";
		cancel_button.style.top = "135px";
		cancel_button.style.left = "80px";
		cancel_button.style.right = "0px";
		cancel_button.style.setProperty("margin-inline", "auto");
		cancel_button.style.setProperty("width", "fit-content");
		cancel_button.innerHTML = "cancel";
		cancel_button.addEventListener("click", function() {
			resetGameContent();
			cancelCallback();
		});
		gamecontent.appendChild(cancel_button);
		const submit_button = document.createElement("button");
		submit_button.style.position = "absolute";
		submit_button.style.top = "135px";
		submit_button.style.left = "0px";
		submit_button.style.right = "80px";
		submit_button.style.setProperty("margin-inline", "auto");
		submit_button.style.setProperty("width", "fit-content");
		submit_button.innerHTML = "submit";
		submit_button.addEventListener("click", function() {
			resetGameContent();
			submitCallback(input.value);
		});
		gamecontent.appendChild(submit_button);
		// Set initial value of yes button.
		submit_button.setAttribute("disabled", "");
		// Focus input and only make submit button enabled if input is valid.
		input.oninput = function(e) {
			const input_valid = inputValid(input.value);
			if (input_valid) {
				submit_button.removeAttribute("disabled");
			} else {
				submit_button.setAttribute("disabled", true);
			}
		};
		return input;
	}

	function setExportPromptVisible(message, textbox_value, closeCallback) {
		// Shows pop-up warning/prompt for a readonly textarea.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		gamecontent.style.setProperty("height", "150px");
		gamecontent.style.setProperty("width", "390px");
		gamecontent.style.setProperty("left", "144px");
		gamecontent.style.setProperty("border", "red 1px solid");
		// Message
		const message_div = document.createElement("div");
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
		// message_div.style.setProperty("position", "absolute");
		// message_div.style.setProperty("top", "5px");
		message_div.style.setProperty("margin", "auto");
		message_div.style.setProperty("width", "95%");
		message_div.style.setProperty("font-family", "\"Courier New CE\", Arial");
		message_div.style.setProperty("font-weight", "bold");
		message_div.style.setProperty("color", "white");
		message_div.style.setProperty("text-align", "center");
		message_div.innerHTML = message;
		// Input
		const textarea_div = document.createElement("div");
		textarea_div.style.setProperty("position", "absolute");
		textarea_div.style.setProperty("bottom", "25px");
		textarea_div.style.setProperty("left", "5px");
		const textarea = document.createElement("textarea");
		// textarea.type = "text";
		textarea.setAttribute("readonly", "");
		textarea.value = textbox_value;
		textarea.style.setProperty("width", "380px");
		textarea.style.setProperty("height", "55px");
		if (INNERCITY) {
			textarea.style.setProperty("color", "black");
		}
		textarea_div.appendChild(textarea);
		gamecontent.appendChild(message_div);
		gamecontent.appendChild(textarea_div);
		// Buttons
		const close_button = document.createElement("button");
		close_button.style.position = "absolute";
		close_button.style.top = "135px";
		close_button.style.left = "0px";
		close_button.style.right = "0px";
		close_button.style.setProperty("margin-inline", "auto");
		close_button.style.setProperty("width", "fit-content");
		close_button.innerHTML = "close";
		close_button.addEventListener("click", function() {
			resetGameContent();
			closeCallback();
		});
		gamecontent.appendChild(close_button);
		return textarea;
	}

	function setImportPromptVisible(message, inputValid, submitCallback, cancelCallback) {
		// Shows pop-up warning/prompt for a writeable texarea.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = "";
		gamecontent.style.setProperty("height", "150px");
		gamecontent.style.setProperty("width", "390px");
		gamecontent.style.setProperty("left", "144px");
		gamecontent.style.setProperty("border", "red 1px solid");
		// Message
		const message_div = document.createElement("div");
		prompt.style.setProperty("display", "block");
		gamecontent.style.setProperty("display", "block");
		// message_div.style.setProperty("position", "absolute");
		// message_div.style.setProperty("top", "5px");
		message_div.style.setProperty("margin", "auto");
		message_div.style.setProperty("width", "95%");
		message_div.style.setProperty("font-family", "\"Courier New CE\", Arial");
		message_div.style.setProperty("font-weight", "bold");
		message_div.style.setProperty("color", "white");
		message_div.style.setProperty("text-align", "center");
		message_div.innerHTML = message;
		// Input
		const textarea_div = document.createElement("div");
		textarea_div.style.setProperty("position", "absolute");
		textarea_div.style.setProperty("bottom", "25px");
		textarea_div.style.setProperty("left", "5px");
		const textarea = document.createElement("textarea");
		// textarea.type = "text";
		textarea.style.setProperty("width", "380px");
		textarea.style.setProperty("height", "55px");
		if (INNERCITY) {
			textarea.style.setProperty("color", "black");
		}
		textarea_div.appendChild(textarea);
		gamecontent.appendChild(message_div);
		gamecontent.appendChild(textarea_div);
		// Buttons
		const cancel_button = document.createElement("button");
		cancel_button.style.position = "absolute";
		cancel_button.style.top = "135px";
		cancel_button.style.left = "120px";
		cancel_button.style.right = "0px";
		cancel_button.style.setProperty("margin-inline", "auto");
		cancel_button.style.setProperty("width", "fit-content");
		cancel_button.innerHTML = "cancel";
		cancel_button.addEventListener("click", function() {
			resetGameContent();
			cancelCallback();
		});
		gamecontent.appendChild(cancel_button);
		const submit_button = document.createElement("button");
		submit_button.style.position = "absolute";
		submit_button.style.top = "135px";
		submit_button.style.left = "0px";
		submit_button.style.right = "120px";
		submit_button.style.setProperty("margin-inline", "auto");
		submit_button.style.setProperty("width", "fit-content");
		submit_button.innerHTML = "submit";
		submit_button.addEventListener("click", function() {
			resetGameContent();
			submitCallback(textarea.value);
		});
		gamecontent.appendChild(submit_button);
		// Check textarea and enable submission only if input is valid.
		submit_button.setAttribute("disabled", true);
		textarea.oninput = function(e) {
			const input_valid = inputValid(textarea.value);
			if (input_valid) {
				submit_button.removeAttribute("disabled");
			} else {
				submit_button.setAttribute("disabled", true);
			}
		};
		return textarea;
	}

	function setPromptHidden() {
		// Hides pop-up warning. Call this inside submit and cancel callbacks.
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.style.removeProperty("border");
		prompt.removeAttribute("style");
		gamecontent.removeAttribute("class");
	}

	function detailsContainer() {
		// Root container for menus.
		const box = document.createElement("div");
		box.style.setProperty("position", "absolute");
		box.style.setProperty("display", "grid");
		box.style.setProperty("width", "99%");
		box.style.setProperty("max-width", "694px");
		box.style.setProperty("height", "99.5%");
		if (OUTPOST_INVENTORY || STORAGE) {
			box.style.setProperty("max-height", "540px");
		} else if (INNERCITY) {
			box.style.setProperty("max-height", "560px");
		}
		box.style.setProperty("top", "0px");
		box.style.setProperty("left", "0px");
		box.style.setProperty("margin", "0 auto");
		box.style.setProperty("justify-content", "center");
		box.style.setProperty("z-index", 20);
		box.style.setProperty("background-color", "rgba(0, 0, 0, 1)");
		box.style.setProperty("border", "1px solid red");
		return box;
	}

	function cancelButton() {
		// Cancel button for menus.
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

	function detailsTitle() {
		// Title for menus.
		const title = document.createElement("div");
		title.style.setProperty("font-size", "18px");
		title.style.setProperty("margin-top", "5px");
		title.style.setProperty("margin-bottom", "-30px");
		title.style.setProperty("font-weight", "bold");
		title.style.setProperty("color", "#D0D0D0");
		title.style.setProperty("text-shadow", "0 0 5px red");
		title.style.setProperty("font-family", "Courier New, Arial");
		title.style.setProperty("text-align", "center");
		title.innerHTML = "Implant Setups";
		return title;
	}

	function detailsScrollingFrame() {
		// Scrolling frames for menus.
		const frame = document.createElement("div");
		frame.style.setProperty("overflow-y", "scroll");
		frame.style.setProperty("border", "1px solid #990000");
		frame.style.setProperty("position", "relative");
		frame.style.setProperty("scrollbar-color", "#686868 black");
		if (OUTPOST_INVENTORY || STORAGE) {
			frame.style.setProperty("height", "425px");
		} else if (INNERCITY) {
			frame.style.setProperty("height", "425px");
		}
		frame.style.setProperty("width", "320px");
		frame.style.setProperty("bottom", "15px");
		return frame;
	}

	const implant_bonus_map = new Map();
	implant_bonus_map.set("implant_expBoostMod", "Exp Gain");
	implant_bonus_map.set("implant_damageBoostMod", "Damage Inflicted");
	implant_bonus_map.set("implant_speedBoostMod", "Movement Speed");
	implant_bonus_map.set("implant_damageReductionBoostMod", "Incoming Damage Reduction");
	implant_bonus_map.set("implant_weaponLootBoostMod", "Chance to Find Weapons");
	implant_bonus_map.set("implant_armourLootBoostMod", "Chance to Find Armour");
	implant_bonus_map.set("implant_ammoLootBoostMod", "Ammo Looted");
	implant_bonus_map.set("implant_cashLootBoostMod", "Cash Looted");
	implant_bonus_map.set("implant_searchSpeedBoostMod", "Search Speed");
	implant_bonus_map.set("implant_miscLootBoostMod", "Chance to Find Misc / Blueprints");
	function updateImplantInclusionTableInventory(setup, details_table, player_items) {
		// Updates table showing the availability of implants on inventory pages.
		details_table.replaceChildren();
		const [_, positional_indices] = implantPositionalSequences(setup.implants);
		const implants_base = setup.implants.map((full_type) => typeSplit(full_type)[0]);
		const implant_slots_used = new Set();
		const inventory_slots_used = new Set();
		const backpack_slots_used = new Set();
		const storage_slots_used = new Set();
		for (let i = 0; i < implants_base.length; i++) {
			const base_type = implants_base[i];
			const presence_tr = document.createElement("tr");
			if (INNERCITY) {
				presence_tr.style.setProperty("font-size", "12px");
				presence_tr.style.setProperty("font-family", "Sans-Serif");
			}
			const implant_td = document.createElement("td");
			implant_td.style.setProperty("text-align", "left");
			implant_td.style.setProperty("width", "200px");
			if (positional_indices.includes(i)) {
				implant_td.style.setProperty("background-color", "#444444");
			}
			if (INNERCITY) {
				implant_td.style.setProperty("color", "white");
			}
			implant_td.innerHTML = globalData[base_type] !== undefined ? globalData[base_type].name : base_type;
			const full_type = setup.implants[i];
			if (isMutable(full_type)) {
				const [_base_type, stats, ...rest] = typeSplit(full_type);
				const stats_substring = stats.slice(5);
				const stat_bonuses = parseMutableImplantStats(stats_substring, globalData[base_type]);
				for (const [key, name] of implant_bonus_map.entries()) {
					if (key in stat_bonuses && stat_bonuses[key] !== 0) {
						const bonus = stat_bonuses[key];
						const sign = bonus > 0 ? "+" : "";
						implant_td.innerHTML += "<span style='font-size: 10px;'><br>" + "&nbsp".repeat(2) + sign + bonus.toString() + "% " + name + "</span>";
					}
				}
			}
			presence_tr.appendChild(implant_td);
			details_table.appendChild(presence_tr);
			const inclusion_td = document.createElement("td");
			inclusion_td.style.setProperty("color", "darkgreen");
			inclusion_td.style.setProperty("text-align", "center");
			inclusion_td.style.setProperty("width", "100px");
			presence_tr.appendChild(inclusion_td);
			const button_td = document.createElement("td");
			button_td.style.setProperty("width", "0px");
			presence_tr.appendChild(button_td);
			// Look through all accessible locations to report location of each implant. Adds any counted slots to set
			// to avoid double-counting.
			let found = false;
			for (const [slot, implant] of player_items.implantItems()) {
				if (implant_slots_used.has(slot)) {
					continue;
				}
				if (implant.base_type === base_type) {
					implant_slots_used.add(slot);
					inclusion_td.innerHTML = "IMPLANTS";
					found = true;
					break;
				}
			}
			if (!found) {
				for (const [slot, item] of player_items.inventoryItems()) {
					if (inventory_slots_used.has(slot)) {
						continue;
					}
					if (item.base_type === base_type) {
						inventory_slots_used.add(slot);
						inclusion_td.innerHTML = "INVENTORY";
						found = true;
						break;
					}
				}
			}
			if (!found) {
				for (const [slot, item] of player_items.backpackItems()) {
					if (backpack_slots_used.has(slot)) {
						continue;
					}
					if (item.base_type === base_type) {
						backpack_slots_used.add(slot);
						inclusion_td.innerHTML = "BACKPACK";
						found = true;
						break;
					}
				}
			}
			if (!found) {
				inclusion_td.style.setProperty("color", "red");
				inclusion_td.innerHTML = "NOT FOUND";
			}
		}
	}

	function setSetupsListInventory(table, name, setup, details_table, player_items) {
		// Set selected element and setup on options menu setup list.
		table.dataset.selected_setup = name;
		for (const child of table.children) {
			const name_td = child.children[0];
			if (name_td.innerHTML === name) {
				name_td.style.setProperty("font-style", "italic");
				name_td.style.setProperty("font-size", "14px");
			} else {
				child.children[0].style.removeProperty("font-style");
				child.children[0].style.setProperty("font-size", "12px");
			}
		}
		updateImplantInclusionTableInventory(setup, details_table, player_items);
	}

	function deselectAllFromSetupsListInventory(table, details_table) {
		// Deselect (all) setup(s) on options menu setup list.
		delete table.dataset.selected_setup;
		for (const child of table.children) {
			child.children[0].style.removeProperty("font-style");
			child.children[0].style.setProperty("font-size", "12px");
		}
		details_table.replaceChildren();
	}

	function updateSetupsListInventory(table, implant_setups, player_items, details_table) {
		// Update table showing list of setups on inventory pages.
		table.replaceChildren();
		for (const [name, setup] of implant_setups) {
			const tr = document.createElement("tr");
			table.appendChild(tr);
			tr.style.setProperty("font-size", "12px");
			tr.style.setProperty("color", "white");
			if (INNERCITY) {
				tr.style.setProperty("font-family", "Sans-Serif");
			}
			const name_td = document.createElement("td");
			name_td.innerHTML = name;
			name_td.style.setProperty("text-align", "left");
			name_td.style.setProperty("width", "240px");
			tr.appendChild(name_td);
			const up_button_td = document.createElement("td");
			up_button_td.style.setProperty("width", "30px");
			const up_button = document.createElement("button");
			up_button.innerHTML = "up";
			up_button.addEventListener("click", function() {
				const previous = tr.previousElementSibling;
				if (previous !== null) {
					previous.before(tr);
				}
			});
			up_button_td.appendChild(up_button);
			tr.appendChild(up_button_td);
			const down_button_td = document.createElement("td");
			down_button_td.style.setProperty("width", "30px");
			const down_button = document.createElement("button");
			down_button.innerHTML = "down";
			down_button.addEventListener("click", function() {
				const next = tr.nextElementSibling;
				if (next !== null) {
					next.after(tr);
				}
			});
			down_button_td.appendChild(down_button);
			tr.appendChild(down_button_td);
			name_td.addEventListener("click", function() {
				setSetupsListInventory(table, name, setup, details_table, player_items);
			});
		}
	}

	function setupsButton() {
		// Setups button for storage page.
		const button = document.createElement("button");
		button.innerHTML = "Setups";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("left", "13px");
		// button.style.setProperty("right", "0px");
		button.style.setProperty("top", "60px");
		button.style.setProperty("margin", "auto");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("font-family", "Courier New, Arial");
		return button;
	}

	function updateImplantInclusionTableStorage(setups, details_table, player_items) {
		// Updates table showing the availability of implants on storage page.
		details_table.replaceChildren();
		let implants_multiset_full = new Multiset();
		for (const setup of setups) {
			// setUnion is a max union, i.e. if one implant setup needs two ingenuity, and another requires one,
			// selecting both will result in Multiset(ingenuityimplant=2);
			implants_multiset_full = implants_multiset_full.setUnion(new Multiset(setup.implants.map((full_type) => typeSplit(full_type)[0])));
		}
		const implants_base = implants_multiset_full.toArray().map((full_type) => typeSplit(full_type)[0]);
		const implant_slots_used = new Set();
		const inventory_slots_used = new Set();
		const backpack_slots_used = new Set();
		const storage_slots_used = new Set();
		for (const base_type of implants_base) {
			const presence_tr = document.createElement("tr");
			if (INNERCITY) {
				presence_tr.style.setProperty("font-size", "12px");
			}
			const implant_td = document.createElement("td");
			implant_td.style.setProperty("text-align", "left");
			implant_td.style.setProperty("width", "160px");
			if (INNERCITY) {
				implant_td.style.setProperty("color", "white");
			}
			implant_td.innerHTML = globalData[base_type] !== undefined ? globalData[base_type].name : base_type;
			presence_tr.appendChild(implant_td);
			details_table.appendChild(presence_tr);
			const inclusion_td = document.createElement("td");
			inclusion_td.style.setProperty("color", "darkgreen");
			inclusion_td.style.setProperty("width", "80px");
			presence_tr.appendChild(inclusion_td);
			const button_td = document.createElement("td");
			button_td.style.setProperty("width", "60px");
			presence_tr.appendChild(button_td);
			// Look through all accessible locations to report location of each implant. Adds any counted slots to set
			// to avoid double-counting.
			let found = false;
			for (const [slot, implant] of player_items.implantItems()) {
				if (implant_slots_used.has(slot)) {
					continue;
				}
				if (implant.base_type === base_type) {
					implant_slots_used.add(slot);
					inclusion_td.innerHTML = "IMPLANTS";
					found = true;
					break;
				}
			}
			if (!found) {
				for (const [slot, item] of player_items.inventoryItems()) {
					if (inventory_slots_used.has(slot)) {
						continue;
					}
					if (item.base_type === base_type) {
						inventory_slots_used.add(slot);
						inclusion_td.innerHTML = "INVENTORY";
						found = true;
						break;
					}
				}
			}
			if (!found) {
				for (const [slot, item] of player_items.backpackItems()) {
					if (backpack_slots_used.has(slot)) {
						continue;
					}
					if (item.base_type === base_type) {
						backpack_slots_used.add(slot);
						inclusion_td.innerHTML = "BACKPACK";
						found = true;
						break;
					}
				}
			}
			// If found in storage, add a withdrawal option.
			if (!found) {
				for (const [slot, item] of player_items.storageItems()) {
					if (storage_slots_used.has(slot)) {
						continue;
					}
					if (item.base_type === base_type) {
						storage_slots_used.add(slot);
						inclusion_td.innerHTML = "STORAGE";
						found = true;
						const withdraw_button = document.createElement("button");
						withdraw_button.innerHTML = "withdraw";
						button_td.appendChild(withdraw_button);
						const empty_inventory_slot = findFirstEmptyGenericSlot("inv");
						if (!empty_inventory_slot) {
							withdraw_button.setAttribute("disabled", "true");
						}
						withdraw_button.addEventListener("click", function() {
							const empty_inventory_slot = findFirstEmptyGenericSlot("inv");
							if (!empty_inventory_slot) {
								return;
							}
							setLoadingVisible();
							player_items.storageToInventory(slot, empty_inventory_slot, UiUpdate.NO)
							.then(function() {
								return player_items.requestStorage();
							})
							.then(function() {
								if (!player_items.isLockedSlot(empty_inventory_slot) && LOCK_UNLOCK_SLOTS) {
									return player_items.lockInventorySlot(empty_inventory_slot, UiUpdate.NO);
								}
							})
							.then(function() {
								updateImplantInclusionTableStorage(setups, details_table, player_items);
								populateInventory();
								populateStorage();
								player_items.updateLockedSlots();
								doLockedElems();
								updateAllFields();
								setLoadingHidden();
								playSound("swap");
							});
						});
						break;
					}
				}
			}
			if (!found) {
				inclusion_td.style.setProperty("color", "red");
				inclusion_td.innerHTML = "NOT FOUND";
			}
		}
		// If an unneeded implant is found in inventory, add a deposit option.
		for (const [slot, item] of player_items.inventoryItems()) {
			if (inventory_slots_used.has(slot)) {
				continue;
			}
			const is_implant = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.IMPLANT;
			if (is_implant) {
				inventory_slots_used.add(slot);
				const presence_tr = document.createElement("tr");
				if (INNERCITY) {
					presence_tr.style.setProperty("font-size", "12px");
				}
				const implant_td = document.createElement("td");
				implant_td.style.setProperty("text-align", "left");
				implant_td.style.setProperty("width", "160px");
				if (INNERCITY) {
					implant_td.style.setProperty("color", "white");
				}
				implant_td.innerHTML = item.base_name;
				presence_tr.appendChild(implant_td);
				details_table.appendChild(presence_tr);
				const inclusion_td = document.createElement("td");
				inclusion_td.style.setProperty("color", "yellow");
				inclusion_td.style.setProperty("width", "80px");
				inclusion_td.innerHTML = "UNNEEDED INVENTORY";
				presence_tr.appendChild(inclusion_td);
				const button_td = document.createElement("td");
				button_td.style.setProperty("width", "60px");
				presence_tr.appendChild(button_td);
				const deposit_button = document.createElement("button");
				deposit_button.innerHTML = "deposit";
				button_td.appendChild(deposit_button);
				const empty_storage_slot = findFirstEmptyStorageSlot();
				if (!empty_storage_slot) {
					deposit_button.setAttribute("disabled", "true");
				}
				deposit_button.addEventListener("click", function() {
					const empty_storage_slot = findFirstEmptyStorageSlot();
					if (!empty_storage_slot) {
						return;
					}
					setLoadingVisible();
					player_items.inventoryToStorage(slot, empty_storage_slot, UiUpdate.NO)
					.then(function() {
						return player_items.requestStorage();
					})
					.then(function() {
						if (player_items.isLockedSlot(slot) && LOCK_UNLOCK_SLOTS) {
							return player_items.unlockInventorySlot(slot, UiUpdate.NO);
						}
					})
					.then(function() {
						updateImplantInclusionTableStorage(setups, details_table, player_items);
						populateInventory();
						populateStorage();
						player_items.updateLockedSlots();
						doLockedElems();
						updateAllFields();
						setLoadingHidden();
						playSound("swap");
					});
				});
			}
		}
		// Other locations that unneeded implants can be, but which are not typically allowed to deposit into storage.
		// They may be able to, but in keeping with the existing UI, I won't add in a deposit from backpack, for example.
		for (const [slot, item] of player_items.implantItems()) {
			if (implant_slots_used.has(slot)) {
				continue;
			}
			const is_implant = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.IMPLANT;
			if (is_implant) {
				implant_slots_used.add(slot);
				const presence_tr = document.createElement("tr");
				if (INNERCITY) {
					presence_tr.style.setProperty("font-size", "12px");
				}
				const implant_td = document.createElement("td");
				implant_td.style.setProperty("text-align", "left");
				implant_td.style.setProperty("width", "160px");
				if (INNERCITY) {
					implant_td.style.setProperty("color", "white");
				}
				implant_td.innerHTML = item.base_name;
				presence_tr.appendChild(implant_td);
				details_table.appendChild(presence_tr);
				const inclusion_td = document.createElement("td");
				inclusion_td.style.setProperty("color", "yellow");
				inclusion_td.style.setProperty("width", "70px");
				inclusion_td.innerHTML = "UNNEEDED IMPLANTS";
				presence_tr.appendChild(inclusion_td);
			}
		}
		for (const [slot, item] of player_items.backpackItems()) {
			if (backpack_slots_used.has(slot)) {
				continue;
			}
			const is_implant = item.category === DeadFrontier.ItemCategory.ITEM && item.subcategory === DeadFrontier.ItemSubcategory.IMPLANT;
			if (is_implant) {
				backpack_slots_used.add(slot);
				const presence_tr = document.createElement("tr");
				if (INNERCITY) {
					presence_tr.style.setProperty("font-size", "12px");
				}
				const implant_td = document.createElement("td");
				implant_td.style.setProperty("text-align", "left");
				implant_td.style.setProperty("width", "160px");
				if (INNERCITY) {
					implant_td.style.setProperty("color", "white");
				}
				implant_td.innerHTML = item.base_name;
				presence_tr.appendChild(implant_td);
				details_table.appendChild(presence_tr);
				const inclusion_td = document.createElement("td");
				inclusion_td.style.setProperty("color", "yellow");
				inclusion_td.style.setProperty("width", "70px");
				inclusion_td.innerHTML = "UNNEEDED BACKPACK";
				presence_tr.appendChild(inclusion_td);
			}
		}
	}

	function setSetupsListStorage(table, details_table, implant_setups, player_items) {
		// Set selected element and setup on storage menu setup list.
		const setup_names = [];
		for (const child of table.children) {
			const checkbox = child.children[1].children[0];
			const checked = checkbox.checked;
			const name_td = child.children[0];
			const name = name_td.innerHTML;
			if (checked) {
				name_td.style.setProperty("font-size", "14px");
				name_td.style.setProperty("font-style", "italic");
				setup_names.push(name);
			} else {
				name_td.style.setProperty("font-size", "12px");
				name_td.style.removeProperty("font-style");
			}
		}
		if (setup_names.length > 0) {
			const setups = setup_names.map((name) => implant_setups.get(name));
			updateImplantInclusionTableStorage(setups, details_table, player_items);
		} else {
			details_table.replaceChildren();
		}
	}

	function deselectAllFromSetupsListStorage(table, details_table) {
		// Deselect (all) setup(s) on storage menu setup list.
		for (const child of table.children) {
			const name_td = child.children[0];
			const checkbox = child.children[1].children[0];
			name_td.style.removeProperty("font-style");
			name_td.style.setProperty("font-size", "12px");
			checkbox.checked = false;
		}
		details_table.replaceChildren();
	}

	function updateSetupsListStorage(table, implant_setups, player_items, details_table) {
		// Update table showing list of setups on storage page.
		table.replaceChildren();
		for (const [name, setup] of implant_setups) {
			const tr = document.createElement("tr");
			table.appendChild(tr);
			tr.style.setProperty("font-size", "12px");
			tr.style.setProperty("color", "white");
			const name_td = document.createElement("td");
			name_td.innerHTML = name;
			name_td.style.setProperty("text-align", "left");
			name_td.style.setProperty("width", "240px");
			tr.appendChild(name_td);
			const checkbox_td = document.createElement("td");
			checkbox_td.style.setProperty("width", "60px");
			const checkbox = document.createElement("input");
			checkbox.setAttribute("type", "checkbox");
			checkbox_td.appendChild(checkbox);
			tr.appendChild(checkbox_td);
			function toggleCheckbox() {
				const checkbox = tr.children[1].children[0];
				checkbox.checked = !checkbox.checked;
			}
			name_td.addEventListener("click", function() {
				toggleCheckbox();
				setSetupsListStorage(table, details_table, implant_setups, player_items);
			});
			checkbox_td.addEventListener("click", function() {
				toggleCheckbox();
				setSetupsListStorage(table, details_table, implant_setups, player_items);
			});
			checkbox.addEventListener("click", function() {
				toggleCheckbox();
				setSetupsListStorage(table, details_table, implant_setups, player_items);
			});
		}
	}

	function updateSelectWithSetup(current_setup, implant_setups, implant_setup_select) {
		// Change dropdown menu to match current_setup. Deselects all if no matching setup if found.
		let matching_setup_found = false;
		for (const [value, setup] of implant_setups.entries()) {
			if (setupsEquivalent(current_setup, setup)) {
				implant_setup_select.value = value;
				matching_setup_found = true;
				break;
			}
		}
		if (!matching_setup_found) {
			implant_setup_select.selectedIndex = -1;
		}
	}

	function hideOfficialFeature() {
		if (OUTPOST_INVENTORY) {
			const implant_menu = document.getElementById("implantMenu");
			const bucket = implant_menu.querySelector("div#implantbucket");
			bucket.style.setProperty("display", "none");
			const preset_select = implant_menu.querySelector("div#implantPresetMenuSelect");
			preset_select.style.setProperty("display", "none");
			const buttons = implant_menu.querySelectorAll("button");
			for (const button of buttons) {
				button.style.setProperty("display", "none");
			}
			for (const button of buttons) {
				if (button.innerHTML === "?") {
					const title_block = button.parentNode.parentNode;
					title_block.style.setProperty("display", "none");
				}
			}
		}
	}


	// Main

	function setupInventoryPage() {
		// Main subroutine to run on inventory pages.
		promiseWaitForElementId("implantMenu")
		.then(function() {
			return GM.getValue("implant_setups", {});
		})
		.then(function(stored_data) {
			hideOfficialFeature();
			const player_items = new DeadFrontier.PlayerItems();
			const implant_setups = readStoredData(stored_data);
			const inventory_holder = document.getElementById("inventoryholder");
			const implant_setup_select = selectImplantSetup(Array.from(implant_setups.keys()));
			// Update dropdown box with loaded setups. If current setup matches one of them, select that setup in the
			// dropdown.
			updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
			updateSelectWithSetup(currentImplantSetup(player_items), implant_setups, implant_setup_select);
			inventory_holder.appendChild(implant_setup_select);
			// Add equip and options buttons to the inventory screen.
			const equip_button = equipButton();
			const options_button = optionsButton();
			inventory_holder.appendChild(equip_button);
			inventory_holder.appendChild(options_button);
			equip_button.addEventListener("click", function() {
				const target_implant_setup = implant_setups.get(implant_setup_select.value);
				equip_button.setAttribute("disabled", "");
				setLoadingVisible();
				swapSetup(player_items, currentImplantSetup(player_items), target_implant_setup, function() {
					setErrorHidden();
					equip_button.removeAttribute("disabled");
				})
				.then(function() {
					setLoadingHidden();
					equip_button.removeAttribute("disabled");
				})
				.catch(function() {
					// Do nothing.
				});
			});
			// Define and place options menu.
			const container = detailsContainer();
			container.style.setProperty("display", "none");
			inventory_holder.appendChild(container);
			const cancel_button = cancelButton();
			container.appendChild(cancel_button);
			const details_title = detailsTitle();
			details_title.style.setProperty("grid-column-start", "span 2");
			container.appendChild(details_title);
			// Top buttons.
			const delete_button = deleteButton();
			const delete_all_button = deleteAllButton();
			const new_button = newButton();
			const overwrite_button = overwriteButton();
			const export_button = exportButton();
			const export_all_button = exportAllButton();
			const import_button = importButton();
			new_button.style.setProperty("margin-right", "20px");
			overwrite_button.style.setProperty("margin-right", "20px");
			delete_button.style.setProperty("margin-right", "20px");
			export_button.style.setProperty("margin-right", "20px");
			const controls_div = document.createElement("div");
			controls_div.style.setProperty("grid-row-start", 2);
			controls_div.style.setProperty("margin-top", "20px");
			controls_div.style.setProperty("margin-bottom", "10px");
			const buttons_div1 = document.createElement("div");
			buttons_div1.appendChild(new_button);
			buttons_div1.appendChild(overwrite_button);
			buttons_div1.appendChild(delete_button);
			buttons_div1.appendChild(delete_all_button);
			controls_div.appendChild(buttons_div1);
			new_button.style.removeProperty("position");
			overwrite_button.style.removeProperty("position");
			delete_button.style.removeProperty("position");
			export_button.style.removeProperty("position");
			import_button.style.removeProperty("position");
			const buttons_div2 = document.createElement("div");
			buttons_div2.appendChild(export_button);
			buttons_div2.appendChild(export_all_button);
			buttons_div2.appendChild(import_button);
			export_all_button.style.setProperty("margin-right", "20px");
			controls_div.appendChild(buttons_div2);
			container.appendChild(controls_div);
			// Scrolling frames.
			const details_scrolling_frame = detailsScrollingFrame();
			details_scrolling_frame.style.setProperty("grid-column-start", 1);
			details_scrolling_frame.style.setProperty("grid-row-start", 3);
			const setups_table = document.createElement("table");
			details_scrolling_frame.appendChild(setups_table);
			container.appendChild(details_scrolling_frame);
			const details_scrolling_frame2 = detailsScrollingFrame();
			details_scrolling_frame2.style.setProperty("grid-column-start", 2);
			details_scrolling_frame2.style.setProperty("grid-row-start", 3);
			const details_table = document.createElement("table");
			details_scrolling_frame2.appendChild(details_table);
			container.appendChild(details_scrolling_frame2);
			// Event listeners for all buttons.
			options_button.addEventListener("click", function() {
				container.style.setProperty("display", "grid");
				updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
				if (implant_setup_select.value !== "") {
					const name = implant_setup_select.value;
					setSetupsListInventory(setups_table, name, implant_setups.get(name), details_table, player_items);
				} else {
					deselectAllFromSetupsListInventory(setups_table, details_table);
				}
			});
			cancel_button.addEventListener("click", function() {
				// Change select dropdown with new order.
				const new_order = [];
				for (const child of setups_table.children) {
					const name_td = child.children[0];
					const name = name_td.innerHTML;
					new_order.push([name, implant_setups.get(name)]);
				}
				implant_setups.clear();
				for (const [name, setup] of new_order) {
					implant_setups.set(name, setup);
				}
				updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
				const stored_data = createStoredDataObject(implant_setups);
				GM.setValue("implant_setups", stored_data);
				updateSelectWithSetup(currentImplantSetup(player_items), implant_setups, implant_setup_select);
				deselectAllFromSetupsListInventory(setups_table, details_table);
				container.style.setProperty("display", "none");
			});
			new_button.addEventListener("click", function() {
				let message = "Choose a name to save the current implant setup as.";
				setSubmitPromptVisible(
					message,
					function(input_value) {
						return input_value !== "" && !implant_setups.has(input_value);
					},
					function(input_value) {
						setPromptHidden();
						implant_setups.set(input_value, currentImplantSetup(player_items));
						updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
						updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
						updateImplantInclusionTableInventory(currentImplantSetup(player_items), details_table, player_items);
						setSetupsListInventory(setups_table, input_value, currentImplantSetup(player_items), details_table, player_items);
						const stored_data = createStoredDataObject(implant_setups);
						GM.setValue("implant_setups", stored_data);
					},
					function() {
						setPromptHidden();
					}
				);
			});
			overwrite_button.addEventListener("click", function() {
				const setup_name = setups_table.dataset.selected_setup;
				if (setup_name === undefined) {
					setErrorVisible("No implant setup selected.", function() {
						setErrorHidden();
					});
					return;
					// throw new Error("No implant setup selected.");
				}
				const message = "Overwrite implant setup<br><span style='color: red;'>" + setup_name + "</span><br>with current setup?";
				setYesNoPromptVisible(
					message,
					function() {
						setPromptHidden();
						implant_setups.set(setup_name, currentImplantSetup(player_items));
						updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
						updateSelectWithSetup(currentImplantSetup(player_items), implant_setups, implant_setup_select);
						updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
						setSetupsListInventory(setups_table, setup_name, currentImplantSetup(player_items), details_table, player_items);
						updateImplantInclusionTableInventory(currentImplantSetup(player_items), details_table, player_items);
						const stored_data = createStoredDataObject(implant_setups);
						GM.setValue("implant_setups", stored_data);
					},
					function() {
						setPromptHidden();
					}
				);
			});
			delete_button.addEventListener("click", function() {
				const setup_name = setups_table.dataset.selected_setup;
				if (setup_name === undefined) {
					setErrorVisible("No implant setup selected.", function() {
						setErrorHidden();
					});
					return;
					// throw new Error("No implant setup selected.");
				}
				const message = "Delete implant setup?<br><span style='color: red;'>" + setup_name + "</span>";
				setYesNoPromptVisible(
					message,
					function() {
						setPromptHidden();
						implant_setups.delete(setup_name);
						updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
						updateSelectWithSetup(currentImplantSetup(player_items), implant_setups, implant_setup_select);
						updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
						deselectAllFromSetupsListInventory(setups_table, details_table);
						const stored_data = createStoredDataObject(implant_setups);
						GM.setValue("implant_setups", stored_data);
					},
					function() {
						setPromptHidden();
					}
				);
			});
			delete_all_button.addEventListener("click", function() {
				const required_input = "I am deleting all of my setups.";
				const message = "Type or copy the phrase below into the textbox to confirm delete all setups.<br><br><span style='color: red;'>" + required_input + "</span>";
				setTextConfirmationPromptVisible(
					message,
					function(value) {
						return value === required_input;
					},
					function(value) {
						implant_setups.clear();
						updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
						updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
						deselectAllFromSetupsListInventory(setups_table, details_table);
						GM.setValue("implant_setups", stored_data);
						setPromptHidden();
					},
					function() {
						setPromptHidden();
					}
				);
			});
			export_button.addEventListener("click", function() {
				const setup_name = setups_table.dataset.selected_setup;
				if (setup_name === undefined) {
					setErrorVisible("No implant setup selected.", function() {
						setErrorHidden();
					});
					return;
					// throw new Error("No implant setup selected.");
				}
				const message = "Exported selected setup <br><span style='color: red;'>" + setup_name + "</span><br>Copy-paste and save to use when importing.";
				setExportPromptVisible(
					message,
					JSON.stringify([{ name: setup_name, setup: implant_setups.get(setup_name) }], null, "\t"),
					function() {
						setPromptHidden();
					}
				);
			});
			export_all_button.addEventListener("click", function() {
				const message = "Exported all setups.<br><br>Copy-paste and save to use when importing.";
				setExportPromptVisible(
					message,
					JSON.stringify(Array.from(implant_setups.entries()).map((pair) => ({ name: pair[0], setup: pair[1] })), null, "\t"),
					function() {
						setPromptHidden();
					}
				);
			});
			import_button.addEventListener("click", function() {
				const message = "Paste exported text string below to import setup(s).";
				setImportPromptVisible(
					message,
					function(value) {
						// Check for correct string formatting for importing.
						try {
							const parsed = JSON.parse(value);
							const is_array = Array.isArray(parsed);
							if (!is_array) {
								return false;
							}
							for (const e of parsed) {
								// https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript/8511350#8511350
								const is_object = typeof e === 'object' && !Array.isArray(e) && e !== null;
								if (!is_object) {
									return false;
								}
								const keys = ["name", "setup"];
								const has_required_keys = keys.every((k) => e.hasOwnProperty(k));
								return has_required_keys;
							}
						} catch (SyntaxError) {
							return false;
						}
					},
					function(value) {
						const parsed = JSON.parse(value);
						for (const obj of parsed) {
							const name = obj.name;
							const setup = obj.setup;
							const is_present_already = implant_setups.has(name);
							deselectAllFromSetupsListInventory(setups_table, details_table);
							if (!is_present_already) {
								implant_setups.set(name, setup);
								updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
								updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
								const stored_data = createStoredDataObject(implant_setups);
								GM.setValue("implant_setups", stored_data);
							} else {
								// Retry names with increasing number values until a non-present one is found.
								let i = 1;
								let potential_name = name + " (" + i.toString() + ")";
								while (implant_setups.has(potential_name)) {
									i++;
									potential_name = name + " (" + i.toString() + ")";
								}
								implant_setups.set(potential_name, setup);
								updateImplantSetupsSelect(implant_setup_select, implant_setups, player_items);
								updateSetupsListInventory(setups_table, implant_setups, player_items, details_table);
								const stored_data = createStoredDataObject(implant_setups);
								GM.setValue("implant_setups", stored_data);
							}
						}
						setPromptHidden();
					},
					function() {
						setPromptHidden();
					}
				);
			});
		});
	}

	function setupStoragePage() {
		// Main subroutine to run on storage page.
		GM.getValue("implant_setups", {})
		.then(function(stored_data) {
			const implant_setups = readStoredData(stored_data);
			const player_items = new DeadFrontier.PlayerItems();
			const player_values = new DeadFrontier.PlayerValues();
			const setups_button = setupsButton();
			// Container and buttons.
			const container = detailsContainer();
			container.style.setProperty("display", "none");
			const inventory_holder = document.getElementById("inventoryholder");
			const cancel_button = cancelButton();
			container.appendChild(cancel_button);
			const details_title = detailsTitle();
			details_title.style.setProperty("grid-column-start", "span 2");
			container.appendChild(details_title);
			const buttons_div = document.createElement("div");
			const deselect_all_button = document.createElement("button");
			deselect_all_button.innerHTML = "deselect all";
			buttons_div.appendChild(deselect_all_button);
			buttons_div.style.setProperty("grid-row-start", 2);
			buttons_div.style.setProperty("margin-top", "5px");
			buttons_div.style.setProperty("margin-bottom", "-10px");
			container.appendChild(buttons_div);
			// Scrolling frames.
			const details_scrolling_frame = detailsScrollingFrame();
			details_scrolling_frame.style.setProperty("grid-column-start", 1);
			details_scrolling_frame.style.setProperty("grid-row-start", 3);
			const setups_table = document.createElement("table");
			details_scrolling_frame.appendChild(setups_table);
			container.appendChild(details_scrolling_frame);
			const details_scrolling_frame2 = detailsScrollingFrame();
			details_scrolling_frame2.style.setProperty("grid-column-start", 2);
			details_scrolling_frame2.style.setProperty("grid-row-start", 3);
			const details_table = document.createElement("table");
			details_scrolling_frame2.appendChild(details_table);
			container.appendChild(details_scrolling_frame2);
			inventory_holder.appendChild(setups_button);
			inventory_holder.appendChild(container);
			// Event listeners.
			cancel_button.addEventListener("click", function() {
				container.style.setProperty("display", "none");
				details_table.replaceChildren();
				for (const row of setups_table.children) {
					row.children[1].children[0].checked = false;
				}
			});
			deselect_all_button.addEventListener("click", function() {
				deselectAllFromSetupsListStorage(setups_table, details_table);
			});
			let backpack_values_loaded = false;
			setups_button.addEventListener("click", function() {
				// Request backpack data once only.
				let active_promise = Promise.resolve();
				if (!backpack_values_loaded) {
					active_promise = player_values.request()
					.then(function() {
						updateIntoArr(flshToArr(player_values.raw_data, "DFSTATS_"), userVars);
						backpack_values_loaded = true;
					});
				}
				active_promise.then(function() {
					return player_items.requestStorage();
				})
				.then(function() {
					updateSetupsListStorage(setups_table, implant_setups, player_items, details_table);
					container.style.setProperty("display", "grid");
				});
			});
		});
	}

	function main() {
		// Main subroutine and entry point.
		if (INNERCITY || OUTPOST_INVENTORY) {
			setupInventoryPage();
		} else if (STORAGE) {
			setupStoragePage();
		}
	}
	main();
})();
