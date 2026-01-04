// ==UserScript==
// @name        Dead Frontier - Backpack Move
// @namespace   Shrike00 - Dead Frontier
// @match       https://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=25
// @grant       none
// @version     0.8
// @author      Shrike00
// @license     MIT
// @description Quickly move backpack items.
// @require https://update.greasyfork.org/scripts/441829/1586829/Dead%20Frontier%20-%20API.js
// @downloadURL https://update.greasyfork.org/scripts/487987/Dead%20Frontier%20-%20Backpack%20Move.user.js
// @updateURL https://update.greasyfork.org/scripts/487987/Dead%20Frontier%20-%20Backpack%20Move.meta.js
// ==/UserScript==

// Changelog
// 0.8 - May 10, 2025
// - Bugfix: Checks if slot lock has been loaded.
// - Change: Added empty action for moving all backpack items at once.
// 0.7 - April 24, 2025
// - Bugfix: Removed double sound play.
// 0.6 - April 18, 2025
// - Bugfix: Fixed for JS update to website.
// 0.5 - April 11, 2024
// - Bugfix: Should now work in all cases with empty slots in backpack.
// 0.4 - February 26, 2024
// - Change: Added progress counter to loading pop-up.
// 0.3 - February 26, 2024
// - Change: Added loading pop-up.
// 0.2 - February 24, 2024
// - Change: Button does not appear when backpack is not equipped.

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

	function waitForElementId(id, timeout=1000) {
		const promise = new Promise(function(resolve, reject) {
			const start = performance.now();
			const check = setInterval(function() {
				const e = document.getElementById(id);
				if (e !== null) {
					clearInterval(check);
					resolve(e);
				}
				if (performance.now() - start > start) {
					clearInterval(check);
					reject();
				}
			}, 100);
		});
		return promise;
	}

	function requestSent(substring) {
		const resource_performance_entries = performance.getEntriesByType("resource");
		const requests = resource_performance_entries.filter((entry) => ["script", "xmlhttprequest"].includes(entry.initiatorType));
		const target_request = requests.find((entry) => entry.name.includes(substring));
		// Can check target_request?.responseStatus, but that seems to not be available on Safari.
		return target_request !== undefined;
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

	function moveBackpackItems(player_items) {
		const slot_lock_loaded = requestSent("item_lock");
		if (!slot_lock_loaded) {
			return Promise.reject();
		}
		const max_items_moved = player_items.emptyInventorySlots();
		let count = 0;
		const backpack_slots_to_move = [];
		const total_backpack_items_to_move = Array.from(player_items.backpackItems().filter((pair) => !player_items.isLockedBackpackSlot(pair[0]))).length;
		if (total_backpack_items_to_move === 0) {
			return Promise.resolve();
		}
		setLoadingVisible();
		// Move using all-at-once action.
		if (total_backpack_items_to_move <= max_items_moved) {
			const inventory_slots_moved_into = Array.from(player_items.inventorySlots().filter((pair) => pair[1] === undefined).map((pair) => pair[0])).slice(0, total_backpack_items_to_move);
			return player_items.emptyBackpackToInventory(UiUpdate.YES)
			.then(function() {
				setLoadingHidden();
				playSound("swap");
				// Highlight elements.
				const inventory = document.getElementById("inventory");
				const moved_into_inventory_elements = Array.from(inventory.querySelectorAll("td")).filter((td) => inventory_slots_moved_into.includes(parseInt(td.dataset.slot)));
				const elements_to_highlight = moved_into_inventory_elements;
				for (const e of elements_to_highlight) {
					e.style.setProperty("background-color", "white");
					e.style.setProperty("box-shadow", "0 0 0 1px inset white");
				}
				return promiseWait(800).then(function() {
					for (const e of elements_to_highlight) {
						e.style.removeProperty("background-color");
						e.style.removeProperty("box-shadow");
					}
				});
			});
		}
		// Move some of them using individual move actions.
		for (let [backpack_slot, item] of player_items.backpackItems()) {
			// Stop if inventory is full.
			if (count >= max_items_moved) {
				break;
			}
			if (!player_items.isLockedBackpackSlot(backpack_slot)) {
				backpack_slots_to_move.push(backpack_slot);
				count++;
			}
		}
		const inventory_slots_moved_into = [];
		let active_promise = Promise.resolve();
		// Sequentially move as many backpack items as possible into inventory.
		for (let i = 0; i < backpack_slots_to_move.length; i++) {
			const is_last_item = i === backpack_slots_to_move.length - 1;
			const update = is_last_item ? UiUpdate.YES : UiUpdate.NO;
			active_promise = active_promise.then(function() {
				const backpack_slot = backpack_slots_to_move[i];
				const inventory_slot = findFirstEmptyGenericSlot("inv");
				inventory_slots_moved_into.push(inventory_slot);
				setLoadingText("Loading...<br>(Moving " + (i + 1).toString() + " of "+ backpack_slots_to_move.length.toString() + ")");
				if (is_last_item) {
					playSound("swap");
				}
				return player_items.backpackToInventory(backpack_slot, inventory_slot, update);
			});
		}
		active_promise.then(function() {
			setLoadingHidden();
			// Highlight elements.
			const inventory = document.getElementById("inventory");
			const moved_into_inventory_elements = Array.from(inventory.querySelectorAll("td")).filter((td) => inventory_slots_moved_into.includes(parseInt(td.dataset.slot)));
			const elements_to_highlight = moved_into_inventory_elements;
			for (const e of elements_to_highlight) {
				e.style.setProperty("background-color", "white");
				e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			}
			return promiseWait(800).then(function() {
				for (const e of elements_to_highlight) {
					e.style.removeProperty("background-color");
					e.style.removeProperty("box-shadow");
				}
			});
		});
		return active_promise;
	}

	function makeBackpackTransferButton() {
		const button = document.createElement("button");
		button.innerHTML = "Move to Inventory";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("text-align", "right");
		button.style.setProperty("left", "530px");
		button.style.setProperty("top", "35px");
		return button;
	}

	function main() {
		const player_items = new DeadFrontier.PlayerItems();
		const inventory_holder = document.getElementById("inventoryholder");
		const transfer_button = makeBackpackTransferButton();
		transfer_button.addEventListener("click", function(e) {
			moveBackpackItems(player_items);
		});
		inventory_holder.appendChild(transfer_button);
		waitForElementId("backpackdisplay")
		.then(function(backpack) {
			// Hide button if backpack is not equipped, display it if backpack is equipped.
			const observer = new MutationObserver(function(records, obs) {
				for (const record of records) {
					if (record.removedNodes.length > 0) {
						transfer_button.style.setProperty("display", "none");
					} else if (record.addedNodes.length > 0) {
						transfer_button.style.setProperty("display", "block");
					}
				}
			});
			observer.observe(backpack, {childList: true});
			// Initial display (or not) of button when page is loaded.
			const backpack_equipped = backpack.children.length > 0;
			const display = backpack_equipped ? "block" : "none";
			transfer_button.style.setProperty("display", display);
		});
	}
	main();
})();
