// ==UserScript==
// @name        Dead Frontier - storage deposit one / withdraw one
// @namespace   Dead Frontier - Disk217
// @match       *://fairview.deadfrontier.com/onlinezombiemmo/index.php?page=50
// @version     0.0.13
// @author      Disk217
// @description Adds buttons to deposit one to storage, or withdraw one from storage page
// @require https://update.greasyfork.org/scripts/441829/1573182/Dead%20Frontier%20-%20API.js
// @require https://update.greasyfork.org/scripts/526316/1534016/Multiset.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534864/Dead%20Frontier%20-%20storage%20deposit%20one%20%20withdraw%20one.user.js
// @updateURL https://update.greasyfork.org/scripts/534864/Dead%20Frontier%20-%20storage%20deposit%20one%20%20withdraw%20one.meta.js
// ==/UserScript==

// This userscript contains edited code from Shrike00 licenced under MIT, used under the terms of that licence.

(function() {
    'use strict';

    // Imports

	const UiUpdate = DeadFrontier.UiUpdate;

    const player_items = new DeadFrontier.PlayerItems();

    const inventory_holder = document.getElementById("inventoryholder");

    const deposit_button = makeDepositButton();
    deposit_button.addEventListener("click", function(e) {
        deposit_one_to_storage(player_items);
    });
    inventory_holder.appendChild(deposit_button);

    const withdraw_button = makeWithdrawButton();
    withdraw_button.addEventListener("click", function(e) {
        withdraw_one_from_storage(player_items);
    });
    inventory_holder.appendChild(withdraw_button);

    const refresh_button = makeRefreshButton();
    refresh_button.addEventListener("click", function(e) {
        refresh()
    });
    inventory_holder.appendChild(refresh_button);

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

    function emptyStorageSlots(player_items) {
			return Array.from(player_items.storageSlots()).filter((e) => e[1] === undefined).length;
		}

    function deposit_one_to_storage(player_items) {
        player_items.requestStorage().then( function() { return deposit_one_to_storage_promise(player_items) } )
    }

    function deposit_one_to_storage_promise(player_items) {
		const max_items_moved = 1
		let count = 0;
		const inventory_slots_to_move = [];
		for (let [inventory_slot, item] of player_items.inventoryItems()) {
			// Stop if inventory is full.
			if (count >= max_items_moved) {
				break;
			}
			if (!player_items.isLockedSlot(inventory_slot)) {
				inventory_slots_to_move.push(inventory_slot);
				count++;
			}
		}

        const storage_slots_moved_into = [];
		let active_promise = Promise.resolve();
		// move one item into storage
		for (let i = 0; i < inventory_slots_to_move.length; i++) {
			const update = UiUpdate.NO;
			active_promise = active_promise.then(function() {
				const inventory_slot = inventory_slots_to_move[i];
				const storage_slot = findFirstEmptyStorageSlot();
                if (storage_slot == false) return Promise.resolve();
				storage_slots_moved_into.push(storage_slot);
				return player_items.inventoryToStorage(inventory_slot, storage_slot, update);
			});
		}

        active_promise.then(function() {
			// Highlight elements.
			const storage = document.getElementById("normalContainer");
			const moved_into_storage_elements = Array.from(storage.querySelectorAll("div")).filter((div) => storage_slots_moved_into.includes(parseInt(div.getAttribute("data-slot"))));
			const elements_to_highlight = moved_into_storage_elements;
			for (const e of elements_to_highlight) {
				e.style.setProperty("background-color", "white");
				e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			}
            const inventory = document.getElementById("inventory");
            const moved_from_inventory_elements = Array.from(inventory.querySelectorAll("td")).filter((td) => inventory_slots_to_move.includes(parseInt(td.dataset.slot)));
            for (const e of moved_from_inventory_elements) {
				e.style.setProperty("background-color", "red");
				e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			}
			return promiseWait(400).then(function() {
				for (const e of elements_to_highlight) {
					e.style.removeProperty("background-color");
					e.style.removeProperty("box-shadow");
				}
                for (const e of moved_from_inventory_elements) {
					e.style.removeProperty("background-color");
					e.style.removeProperty("box-shadow");
				}
			})
		});
		return active_promise;
    }

    function withdraw_one_from_storage(player_items) {
        player_items.requestStorage().then( function() { return withdraw_one_from_storage_promise(player_items) } )
    }

    function withdraw_one_from_storage_promise(player_items) {
		const max_items_moved = 1
		let count = 0;
		const storage_slots_to_move = [];
        const min_to_move = storageTab * 40 + 1
        const first_to_not_move = (storageTab + 1) *40 + 1
		for (let [storage_slot, item] of player_items.storageItems()) {
            if ( storage_slot < min_to_move ) {
                continue
            }
			// Stop if inventory is full.
			if (count >= max_items_moved) {
				break;
			}
            if ( storage_slot >= first_to_not_move ) {
                break;
            }

            storage_slots_to_move.push(storage_slot)
            count++;
		}

        const inventory_slots_moved_into = [];
		let active_promise = Promise.resolve();
		// move one item into inventory
		for (let i = 0; i < storage_slots_to_move.length; i++) {
			const update = UiUpdate.NO
			active_promise = active_promise.then(function() {
				const storage_slot = storage_slots_to_move[i];
				const inventory_slot = findFirstEmptyGenericSlot("inv");
				inventory_slots_moved_into.push(inventory_slot);
				return player_items.storageToInventory(storage_slot, inventory_slot, update);
			});
		}

        active_promise.then(function() {
			// Highlight elements.
			const inventory = document.getElementById("inventory");
			const moved_into_inventory_elements = Array.from(inventory.querySelectorAll("td")).filter((td) => inventory_slots_moved_into.includes(parseInt(td.dataset.slot)));
			const elements_to_highlight = moved_into_inventory_elements;
			for (const e of elements_to_highlight) {
				e.style.setProperty("background-color", "white");
				e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			}
            const storage = document.getElementById("normalContainer");
			const moved_from_storage_elements = Array.from(storage.querySelectorAll("div")).filter((div) => storage_slots_to_move.includes(parseInt(div.getAttribute("data-slot"))));
            for (const e of moved_from_storage_elements) {
				e.style.setProperty("background-color", "red");
				e.style.setProperty("box-shadow", "0 0 0 1px inset white");
			}
			return promiseWait(400).then(function() {
				for (const e of elements_to_highlight) {
					e.style.removeProperty("background-color");
					e.style.removeProperty("box-shadow");
				}
                for (const e of moved_from_storage_elements) {
					e.style.removeProperty("background-color");
					e.style.removeProperty("box-shadow");
				}
			})
		});
		return active_promise;
    }

    function refresh() {
        return player_items.requestStorage().then(populateStorage).then(populateInventory)
    }

    function makeDepositButton() {
		const button = document.createElement("button");
		button.innerHTML = "Deposit";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("text-align", "right");
		button.style.setProperty("left", "530px");
		button.style.setProperty("top", "35px");
		return button;
	}

    function makeWithdrawButton() {
		const button = document.createElement("button");
		button.innerHTML = "Withdraw";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("text-align", "right");
		button.style.setProperty("left", "600px");
		button.style.setProperty("top", "35px");
		return button;
	}

    function makeRefreshButton() {
		const button = document.createElement("button");
		button.innerHTML = "Refresh";
		button.style.setProperty("position", "absolute");
		button.style.setProperty("font-size", "15px");
		button.style.setProperty("text-align", "right");
		button.style.setProperty("left", "450px");
		button.style.setProperty("top", "35px");
		return button;
	}
})();