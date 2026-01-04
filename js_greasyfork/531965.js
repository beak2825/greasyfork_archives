// ==UserScript==
// @name        Display case market value
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/displaycase.php*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @license     MIT
// @author      BillyBourbon/Bilbosaggings[2323763]
// @description Display the total market value of items in a display case
// @downloadURL https://update.greasyfork.org/scripts/531965/Display%20case%20market%20value.user.js
// @updateURL https://update.greasyfork.org/scripts/531965/Display%20case%20market%20value.meta.js
// ==/UserScript==

// ================================
// Input your apikey in between the quote marks ""
const apikey = "";
// ================================

(async () => {
	// Function to format numbers to currency format (USD)
	function formatToCurrency(n) {
		n = Number(n);
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(n);
	}

	// Function to load Torn items with caching
	async function loadTornItems() {
		const cacheKey = "tornItemsCache";
		const cacheExpiryKey = "tornItemsCacheExpiry";
		const cacheDuration = 60 * 60 * 1000; // 1 hour in milliseconds

		// Check for cached data
		const cachedData = localStorage.getItem(cacheKey);
		const cachedExpiry = localStorage.getItem(cacheExpiryKey);

		if (cachedData && cachedExpiry && Date.now() < cachedExpiry) {
			console.log("Using cached data");
			return JSON.parse(cachedData);
		}

		let attempt = 0;
		let jsonResponse = null;

		// Retry logic for API request
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

				// Cache the API response
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

	// Function to find a Torn item by its ID
	function findTornItem(itemId, tornItems) {
		const item = tornItems.find(o => o.id.toString() === itemId.toString());

		// Return null if item is not found
		return item || null;
	}

	// Wait for the display case container to load
	while (document.querySelector(".display-cabinet") === null) {
		await new Promise(resolve => setTimeout(resolve, 500)); // Delay before retrying
	}

	// Select the display case container
	const displayCaseContainer = document.querySelector(".display-cabinet");

	// Load the Torn items
	const { items: tornItems } = await loadTornItems();

	// Iterate through each item in the display case
	displayCaseContainer.querySelectorAll("li").forEach(li => {
		const temp = li.querySelector(".item-hover");

		if (temp === null) return; // Skip if there's no item

		const itemId = temp.getAttribute("itemId");

		const ammountField = li.querySelector(".b-item-amount");

		const ammount = ammountField.innerHTML.trim().substring(1);

		// Find the item from the loaded Torn items
		const item = findTornItem(itemId, tornItems);

		// Check if item was found
		if (item && item.value && item.value.market_price) {
			const marketPrice = item.value.market_price;

			// Calculate total market value
			ammountField.innerHTML += `(${formatToCurrency(ammount * marketPrice)})`;
		} else {
			console.error(`Item with ID ${itemId} not found or missing market price.`);
		}
	});
})();
