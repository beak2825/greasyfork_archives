// ==UserScript==
// @name        Torn Inventory & Display Case Market Value
// @namespace   Violentmonkey Scripts
// @match       https://www.torn.com/*
// @grant       GM_xmlhttpRequest
// @version     1.0
// @license     MIT
// @author      BillyBourbon/Bilbosaggings[2323763]
// @description Combined script for Inventory and Display Case market value
// @downloadURL https://update.greasyfork.org/scripts/531970/Torn%20Inventory%20%20Display%20Case%20Market%20Value.user.js
// @updateURL https://update.greasyfork.org/scripts/531970/Torn%20Inventory%20%20Display%20Case%20Market%20Value.meta.js
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

  // ========================
  // Inventory Market Value
  // ========================
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

  // ========================
  // Display Case Market Value
  // ========================
  async function updateDisplayCaseMarketValue() {
    // Wait for display case page to load
    while (document.querySelector(".display-cabinet") === null) {
      await new Promise(resolve => setTimeout(resolve, 500)); // Delay before retrying
    }

    const displayCaseContainer = document.querySelector(".display-cabinet");

    const { items: tornItems } = await loadTornItems();

    displayCaseContainer.querySelectorAll("li").forEach(li => {
      const temp = li.querySelector(".item-hover");

      if (temp === null || temp.getAttribute("data-userscript") === "true") return; // Skip if there's no item

      const itemId = temp.getAttribute("itemId");
      const ammountField = li.querySelector(".b-item-amount");
      const ammount = ammountField.innerHTML.trim().substring(1);

      const item = findTornItem(itemId, tornItems);

      // Check if item was found
      if (item && item.value && item.value.market_price) {
        const marketPrice = item.value.market_price;
        const totalValue = ammount * marketPrice
        if(totalValue > 0) ammountField.innerHTML += `(${formatToCurrency(totalValue)})`;
      } else {
        console.error(`Item with ID ${itemId} not found or missing market price.`);
      }

      temp.setAttribute("data-userscript", "true")
    });
  }

  // ========================
  // Main Logic
  // ========================
  const currentUrl = window.location.href;

  if (currentUrl.includes("item.php")) {
    console.log("Updating Inventory Market Value...");
    // Observe changes in the inventory page
    document.querySelectorAll(".items-cont").forEach(container => {
      const observer = new MutationObserver(callback);
      observer.observe(container, {
        attributes: true,
        childList: true,
        subtree: true
      });
    })
  }
  else if (currentUrl.includes("displaycase.php")) {
     console.log("Updating Display Case Market Value...");
     await updateDisplayCaseMarketValue();
  }
})();
