// ==UserScript==
// @name        Inventory Market Value
// @license     MIT
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/item*
// @grant       none
// @version     1.05
// @author      BillyBourbon/Bilbosaggings[2323763]
// @description A userscript
// @downloadURL https://update.greasyfork.org/scripts/531951/Inventory%20Market%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/531951/Inventory%20Market%20Value.meta.js
// ==/UserScript==

// ================================
// Input your apikey inbetween the quote marks ""
const apikey = "";
// ================================
(() => {
	function formatToCurrency(n) {
		n = Number(n);
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(n);
	}

	async function loadTornItems() {
		const cacheKey = "tornItemsCache";
		const cacheExpiryKey = "tornItemsCacheExpiry";
		const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

		const cachedData = localStorage.getItem(cacheKey);
		const cachedExpiry = localStorage.getItem(cacheExpiryKey);

		if (cachedData && cachedExpiry && Date.now() < cachedExpiry) {
			console.log("Using cached data");
			return JSON.parse(cachedData);
		}

		let attempt = 0;
		let jsonResponse = null;

		while (attempt < 3) {
			try {
				jsonResponse = await new Promise((resolve, reject) => {
					GM_xmlhttpRequest({
						method: "GET",
						url: `https://api.torn.com/v2/torn/items`,
						headers: {
							"Authorization": `ApiKey ${apikey}`,
						},
						onload: function (response) {
							if (response.status >= 200 && response.status < 300) {
								try {
									const responseData = JSON.parse(response.responseText);
									resolve(responseData);
								} catch (error) {
									reject(new Error("Failed to parse JSON"));
								}
							} else {
								reject(new Error(`API request failed with status: ${response.status}`));
							}
						},
						onerror: function (error) {
							reject(new Error(`API request failed with error: ${error}`));
						}
					});
				});

				console.log(jsonResponse);

				localStorage.setItem(cacheKey, JSON.stringify(jsonResponse));
				localStorage.setItem(cacheExpiryKey, Date.now() + cacheDuration);

				return jsonResponse;
			} catch (error) {
				attempt++;
				console.error(`Attempt ${attempt} failed: ${error.message}`);

				if (attempt < 3) {
					await new Promise(resolve => setTimeout(resolve, 2000)); // Delay before retrying
				}
			}
		}
	}

	function findTornItem(itemId, tornItems) {
		const item = tornItems.find(o => o.id.toString() === itemId.toString());

		return item;
	}


	async function insertMarketValues(itemList) {
		let counter = 0;

		const {
			items: tornItems
		} = await loadTornItems();

		for (let child of itemList.querySelectorAll("li")) {
			const itemId = child.getAttribute("data-item");
			if (itemId !== null && itemId > 0 && child.querySelector(".name-wrap .name") !== null) {
				const itemNameSpan = child.querySelector(".name-wrap .name");
				const itemQuantitySpan = child.querySelector(".name-wrap .qty");
				const itemQuantity = itemQuantitySpan.innerHTML.length === 0 ? 1 : Number(itemQuantitySpan.innerHTML.substring(1));
				const {
					value: {
						market_price
					}
				} = findTornItem(itemId, tornItems);
				itemNameSpan.innerHTML += ` (${formatToCurrency(market_price * itemQuantity)})`;

				counter++;
			}
		}

		return counter;
	}

	const callback = async (mutationList, observer) => {
		console.log("mutation observed");
		for (const mutation of mutationList) {
			if (mutation.type === "childList") {
				if (mutation.addedNodes.length === 0) return;
				const editedElementCount = await insertMarketValues(mutation.target);

				if (editedElementCount > 0) observer.disconnect();
			}
		}
	}

	document.querySelectorAll(".items-cont").forEach(container => {
		const observer = new MutationObserver(callback);
		observer.observe(container, {
			attributes: true,
			childList: true,
			subtree: true
		});
	})
})()