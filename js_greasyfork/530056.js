// ==UserScript==
// @name         ssssshhhhhh
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  Our Little Secret
// @license MIT
// @author       ssssshhhh
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/imarket.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/530056/ssssshhhhhh.user.js
// @updateURL https://update.greasyfork.org/scripts/530056/ssssshhhhhh.meta.js
// ==/UserScript==

(function () {
  "use strict";
  console.log("Scanner is Starting");

  GM_addStyle(`
        #missingItemsGUI {
            background-color: #f0f0f0;
            border: 1px solid #ccc;
            padding: 10px;
            z-index: 9999;
            max-height: 80vh;
            overflow-y: auto;
        }
        #missingItemsGUI h3 { margin-top: 0; }
        #missingItemsGUI ul { list-style-type: none; padding: 0; }
        #missingItemsGUI li { margin-bottom: 5px; }
        #missingItemsGUI a { text-decoration: none; color: #0066cc; }

        li.tmb-missing {
          background-color: darkmagenta;
        }

        li.tmb-found {
        }
    `);

  const missing_items = new Map();

  function getItemInfo(itemName) {
    return new Promise((resolve, reject) => {
      console.log(`Fetching info for item: ${itemName}`);
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://mug.xennet.org/http/get_item_info/${encodeURIComponent(itemName)}`,
        onload: function (response) {
          if (response.status === 200) {
            const items = JSON.parse(response.responseText);
            console.log(`Parsed data for ${itemName}:`, items);
            resolve(items);
          } else {
            reject(
              new Error(`Failed to fetch item info: ${response.statusText}`),
            );
          }
        },
        onerror: reject,
      });
    });
  }

  function updateUserIdInDatabase(itemName, userId, damage, accuracy, armor) {
    console.log(
      `Updating database for item: ${itemName}, user: ${userId}, Damage: ${damage}, Accuracy: ${accuracy}, Armor: ${armor}`,
    );
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "POST",
        url: `https://mug.xennet.org/http/update_user_id`,
        data: JSON.stringify({ itemName, userId, damage, accuracy, armor }),
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
        onload: function (response) {
          if (response.status === 200) {
            resolve();
          } else {
            reject(
              new Error(`Failed to update database: ${response.statusText}`),
            );
          }
        },
        onerror: reject,
        ontimeout: () => reject(new Error("Request timed out")),
      });
    });
  }

  function getPropertyValues(itemElement) {
    const properties = itemElement.querySelectorAll(
      ".modifiersAndPropertiesWrapper___VPWW_ .properties___QCPEP div .value___cwqHv",
    );
    const values = [];

    properties.forEach((prop) => {
      if (prop.textContent) {
        values.push(parseFloat(prop.textContent));
      }
    });

    if (values.length === 2) {
      return {
        damage: values[0],
        accuracy: values[1],
        armor: null,
      };
    } else if (values.length === 1) {
      return {
        damage: null,
        accuracy: null,
        armor: values[0],
      };
    }

    return null;
  }

  function extractItemFromLi(itemElement) {
    const itemNameElement = itemElement.querySelector(".name___ukdHN");
    if (!itemNameElement) {
      console.warn("Could not find item name element");
      return { itemName: null, properties: null };
    }

    const itemName = itemNameElement.textContent.trim();
    const properties = getPropertyValues(itemElement);

    if (!properties) {
      console.warn("Could not find valid property values");
      return { itemName: null, properties: null };
    }

    return { itemName, properties };
  }

  function handleBuyButtonClick(event) {
    const buyButton = event.target.closest("button.actionButton___pb_Da");
    if (!buyButton) return;

    const itemElement = buyButton.closest("li");
    if (!itemElement) {
      console.warn("Could not find item element");
      return;
    }

    const { itemName, properties } = extractItemFromLi(itemElement);
    if (!itemName || !properties) {
      return;
    }

    console.log(`Clicked item: ${itemName}, Properties:`, properties);

    const observer = new MutationObserver((mutations, obs) => {
      const anonymousElement = document.querySelector(".anonymous___P3s5s");
      if (anonymousElement) {
        obs.disconnect();
        const userId = "Anonymous";
        getItemInfo(itemName)
          .then((items) => {
            const matchingItems = items.filter((item) => {
              if (properties.damage !== null) {
                return (
                  parseFloat(item.damage) === properties.damage &&
                  parseFloat(item.accuracy) === properties.accuracy
                );
              } else {
                return parseFloat(item.armor) === properties.armor;
              }
            });
            if (matchingItems.length > 0) {
              return updateUserIdInDatabase(
                itemName,
                userId,
                properties.damage,
                properties.accuracy,
                properties.armor,
              );
            }
          })
          .catch((error) =>
            console.error("Error in buy button click handler:", error),
          );
      } else {
        const sellerLinkElement = document.querySelector(
          "div.item-market div.honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH > a",
        );
        if (
          sellerLinkElement &&
          sellerLinkElement.href.includes("profiles.php?XID=")
        ) {
          obs.disconnect();
          const userId = sellerLinkElement.href.split("XID=")[1];
          if (userId) {
            getItemInfo(itemName)
              .then((items) => {
                const matchingItems = items.filter((item) => {
                  if (properties.damage !== null) {
                    return (
                      parseFloat(item.damage) === properties.damage &&
                      parseFloat(item.accuracy) === properties.accuracy
                    );
                  } else {
                    return parseFloat(item.armor) === properties.armor;
                  }
                });
                if (matchingItems.length > 0) {
                  return updateUserIdInDatabase(
                    itemName,
                    userId,
                    properties.damage,
                    properties.accuracy,
                    properties.armor,
                  );
                }
              })
              .catch((error) =>
                console.error("Error in buy button click handler:", error),
              );
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  function setupBuyButtonListener() {
    document.addEventListener("click", handleBuyButtonClick);
  }

  function markSeenItem(li) {
    const key = extractItemKeyFromLi(li);
    console.log(key);

    if (key == null) {
      li.classList.remove("tmb-found");
      li.classList.remove("tmb-missing");
      return;
    }

    if (missing_items.size <= 0) {
      return;
    }

    if (missing_items.has(key)) {
      li.classList.remove("tmb-found");
      li.classList.add("tmb-missing");
    } else {
      li.classList.add("tmb-found");
      li.classList.remove("tmb-missing");
    }
  }

  function setupMarketMarker() {
    console.log("Setting up observer");
    const observer = new MutationObserver((mutations, obs) => {
      console.log("Found mutations");
      console.log(mutations);
      document
        .querySelectorAll(".item-market ul.itemList___u4Hg1 li")
        .forEach((li) => {
          markSeenItem(li);
        });
    });

    observer.observe(document.querySelector(".item-market"), {
      childList: true,
      subtree: true,
    });

    document
      .querySelectorAll(".item-market ul.itemList___u4Hg1 li")
      .forEach((li) => {
        markSeenItem(li);
      });
  }

  function fetchMissingItems() {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url: "https://mug.xennet.org/flask/missing_items",
        onload: function (response) {
          if (response.status === 200) {
            resolve(JSON.parse(response.responseText));
          } else {
            reject(
              new Error(
                `Failed to fetch missing items: ${response.statusText}`,
              ),
            );
          }
        },
        onerror: reject,
      });
    });
  }

  function makeItemKey(item) {
    return JSON.stringify([
      item.item_name,
      item.damage,
      item.accuracy,
      item.armor,
    ]);
  }

  function extractItemKeyFromLi(li) {
    const { itemName, properties } = extractItemFromLi(li);
    if (!itemName || !properties) {
      return null;
    }

    return JSON.stringify([
      itemName,
      properties.damage,
      properties.accuracy,
      properties.armor,
    ]);
  }

  function processMissingItems(items) {
    const itemMap = new Map();
    missing_items.clear();
    items.forEach((item) => {
      if (!itemMap.has(item.item_id)) {
        itemMap.set(item.item_id, { name: item.item_name, prices: [] });
      }
      itemMap.get(item.item_id).prices.push(item.price);
      console.log(makeItemKey(item));
      missing_items.set(makeItemKey(item), item);
    });

    const guiElement = document.createElement("div");
    guiElement.id = "missingItemsGUI";
    guiElement.innerHTML = "<h3>Missing Items</h3><ul></ul>";

    const listElement = guiElement.querySelector("ul");
    itemMap.forEach((item, itemId) => {
      const minPrice = Math.min(...item.prices);
      const maxPrice = Math.max(...item.prices);
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}&sortField=price&sortOrder=ASC&priceFrom=${minPrice}&priceTo=${maxPrice}&bonuses[0]=-2`;
      link.textContent = item.name;
      link.target = "_blank";
      listItem.appendChild(link);
      listElement.appendChild(listItem);
    });

    const ilw = document.querySelector('div[class^="itemListWrapper_]');
    if (ilw) {
      ilw.appendChild(guiElement);
    }
    const mw = document.querySelector('div[class^="marketWrapper_"]');
    if (mw) {
      mw.appendChild(guiElement);
    }
  }

  function initGUI() {
    fetchMissingItems()
      .then(processMissingItems)
      .catch((error) => console.error("Error initializing GUI:", error));
  }

  function init() {
    setupBuyButtonListener();
    setupMarketMarker();
    initGUI();
  }

  GM_xmlhttpRequest({
    method: "GET",
    url: "https://mug.xennet.org/http/test",
    onload: function (response) {
      if (response.status === 200) {
        console.log("Server connection test successful");
        init();
      } else {
        console.error(
          "Server connection test failed. Status:",
          response.status,
        );
      }
    },
    onerror: function (error) {
      console.error("Server connection test failed:", error);
    },
  });

  console.log("Scanner loaded");
})();
