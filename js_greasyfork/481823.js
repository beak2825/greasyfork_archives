// ==UserScript==
// @name        Dead Frontier - Ammo Stack in Storage
// @namespace   Shrike00 - Dead Frontier
// @match       https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @grant       none
// @version     0.4
// @author      -
// @license     MIT
// @description Quickly stack ammo in storage.
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @downloadURL https://update.greasyfork.org/scripts/481823/Dead%20Frontier%20-%20Ammo%20Stack%20in%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/481823/Dead%20Frontier%20-%20Ammo%20Stack%20in%20Storage.meta.js
// ==/UserScript==

// Changelog
// 0.4 - April 19, 2025
// - Bugfix: Updated for website JS update.
// 0.3 - February 25, 2024
// - Change: Updated with more accurate storage swap.
// 0.2 - February 22, 2024
// - Bugfix: Should now work with simple menu.

(function() {
	'use strict';

	const UiUpdate = DeadFrontier.UiUpdate;

	function filter(g, predicate) {
		return function*() {
			for (let e of g()) {
				if (predicate(e)) {
					yield e;
				}
			}
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

	function partialAmmo(g) {
		const output = new Map();
		for (const [slot, item] of g()) {
			const is_ammo = item.category === DeadFrontier.ItemCategory.AMMO;
			const is_full_stack = is_ammo ? item.quantity >= item.properties.get("max_quantity") : true;
			const is_lowest = is_ammo && !is_full_stack && output.has(item.base_type) ? item.quantity < output.get(item.base_type).item.quantity : true;
			if (is_ammo && !is_full_stack && is_lowest) {
				output.set(item.base_type, {slot: slot, item: item});
			}
		}
		return output;
	}

	function fullAmmo(g) {
		const output = new Map();
		for (const [slot, item] of g()) {
			const is_ammo = item.category === DeadFrontier.ItemCategory.AMMO;
			const is_full_stack = is_ammo ? item.quantity >= item.properties.get("max_quantity") : true;
			if (is_ammo && is_fullstack) {
				output.set(item.base_type, {slot: slot, item:item});
			}
		}
		return output;
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

	function setLoadingText(text) {
		const prompt = document.getElementById("prompt");
		const gamecontent = document.getElementById("gamecontent");
		gamecontent.innerHTML = text;
	}

	function emptyStorageSlots(player_items) {
		return Array.from(player_items.storageSlots()).filter((e) => e[1] === undefined).map((e) => e[0]);
	}

	function autostack(player_items) {
		player_items.requestStorage().then(function() {
			//const partial_ammo_inventory = partialAmmo(filter(player_items.inventoryItems.bind(player_items), (struct) => !window.lockedSlots.includes(struct[0].toString())));
			const partial_ammo_inventory = partialAmmo(player_items.inventoryItems.bind(player_items));
			const partial_ammo_storage = partialAmmo(player_items.storageItems.bind(player_items));
			let active_promise = Promise.resolve();
			let i = 0;
			setLoadingVisible();
			const inventory_slots_moved_into = [];
			const storage_slots_moved_into = [];
			const empty_storage_slots = emptyStorageSlots(player_items);
			let empty_storage_slots_used = 0;
			// Do not consider ammo that is partially stacked in locked slots, and does not have a corresponding partial storage.
			const keys_to_remove = [];
			for (const [key, value] of partial_ammo_inventory.entries()) {
				const inventory_item = value.item;
				const inventory_slot = value.slot;
				const locked_inventory_slot = player_items.isLockedSlot(inventory_slot);
				if (locked_inventory_slot && !partial_ammo_storage.has(key)) {
					keys_to_remove.push(key);
				}
			}
			for (const key of keys_to_remove) {
				partial_ammo_inventory.delete(key);
			}
			// Main move routine.
			for (const [key, value] of partial_ammo_inventory.entries()) {
				i++;
				const inventory_item = value.item;
				const inventory_slot = value.slot;
				const locked_inventory_slot = player_items.isLockedSlot(inventory_slot);
				const is_last_item = i === partial_ammo_inventory.size;
				const update = is_last_item ? UiUpdate.YES : UiUpdate.NO;
				if (partial_ammo_storage.has(key)) { // Move between inventory and storage.
					const storage_item = partial_ammo_storage.get(key).item;
					const storage_slot = partial_ammo_storage.get(key).slot;
					// Move to inventory if ammo can be fully stacked or if in locked slot, otherwise move to storage.
					const can_full_stack_inventory = inventory_item.quantity + storage_item.quantity >= inventory_item.properties.get("max_quantity")
					const move_to_inventory = can_full_stack_inventory || locked_inventory_slot;
					if (move_to_inventory) {
						inventory_slots_moved_into.push(inventory_slot);
					} else {
						storage_slots_moved_into.push(storage_slot);
					}
					let move;
					const current_index = i;
					if (move_to_inventory) {
						move = function() {
							setLoadingText("Loading...<br>(Moving " + current_index.toString() + " of " + partial_ammo_inventory.size.toString() + ")");
							return player_items.storageToInventory(storage_slot, inventory_slot, update);
						}
					} else {
						move = function() {
							setLoadingText("Loading...<br>(Moving " + current_index.toString() + " of " + partial_ammo_inventory.size.toString() + ")");
							return player_items.inventoryToStorage(inventory_slot, storage_slot, update);
						}
					}
					active_promise = active_promise.then(move);
				} else if (!locked_inventory_slot) { // Move inventory to empty storage slots.
					const current_index = i;
					function move() {
						// If storage slot is open then move unlocked slot ammo stack to it, otherwise, resolve immediately.
						if (empty_storage_slots_used < empty_storage_slots.length) {
							const first_open_storage_slot = empty_storage_slots[empty_storage_slots_used];
							storage_slots_moved_into.push(first_open_storage_slot);
							setLoadingText("Loading...<br>(Moving " + current_index.toString() + " of " + partial_ammo_inventory.size.toString() + ")");
							empty_storage_slots_used++;
							return player_items.inventoryToStorage(inventory_slot, first_open_storage_slot, update);
						} else {
							return Promise.resolve();
						}
					}
					active_promise = active_promise.then(move);
				}
			}
			return active_promise.then(function() {
				setLoadingHidden();
				// Highlight affected slots.
				const inventory = document.getElementById("inventory");
				const storage = document.getElementById("normalContainer");
				const moved_into_inventory_elements = Array.from(inventory.querySelectorAll("td")).filter((td) => inventory_slots_moved_into.includes(parseInt(td.dataset.slot)));
				const moved_into_storage_elements = [];
				if (storage !== null) {
					moved_into_storage_elements.push(...Array.from(storage.querySelectorAll("div")).filter((div) => storage_slots_moved_into.includes(parseInt(div.dataset.slot))));
				}
				const elements_to_highlight = moved_into_inventory_elements.concat(moved_into_storage_elements)
				if (partial_ammo_inventory.size !== 0) {
					playSound("swap");
				}
				for (const e of elements_to_highlight) {
					e.style.setProperty("background-color", "white");
					e.style.setProperty("box-shadow", "0 0 0 1px inset white");
				}
				return promiseWait(800).then(function() {
					for (const e of elements_to_highlight) {
						e.style.removeProperty("background-color");
						e.style.removeProperty("box-shadow");
					}
				})
			});
		});
	}

	function makeAutostackButton() {
		const button = document.createElement("button");
		button.innerHTML = "Autostack Ammo";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("text-align", "left");
		button.style.setProperty("left", "13px");
		button.style.setProperty("top", "40px");
		return button;
	}

	function main() {
		const player_items = new DeadFrontier.PlayerItems();
		const inventory_holder = document.getElementById("inventoryholder");
		const autostack_button = makeAutostackButton();
		autostack_button.addEventListener("click", function(e) {
			autostack(player_items);
		});
		inventory_holder.appendChild(autostack_button);
	}
	main();
})();
