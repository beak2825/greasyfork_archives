// ==UserScript==
// @name         TLDR SCANNER
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Our Little Secret
// @author       TLDR TLDR [3348219]
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @match        https://www.torn.com/imarket.php*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/521537/TLDR%20SCANNER.user.js
// @updateURL https://update.greasyfork.org/scripts/521537/TLDR%20SCANNER.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Scanner is Starting');

    GM_addStyle(`
        #missingItemsGUI {
            position: fixed;
            top: 10px;
            right: 10px;
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
    `);

    function getItemInfo(itemName) {
        return new Promise((resolve, reject) => {
            console.log(`Fetching info for item: ${itemName}`);
            GM_xmlhttpRequest({
                method: "GET",
                url: `http://153.92.5.106:8080/get_item_info/${encodeURIComponent(itemName)}`,
                onload: function(response) {
                    if (response.status === 200) {
                        const items = JSON.parse(response.responseText);
                        console.log(`Parsed data for ${itemName}:`, items);
                        resolve(items);
                    } else {
                        reject(new Error(`Failed to fetch item info: ${response.statusText}`));
                    }
                },
                onerror: reject
            });
        });
    }

    function updateUserIdInDatabase(itemName, userId, damage, accuracy, armor) {
        console.log(`Updating database for item: ${itemName}, user: ${userId}, Damage: ${damage}, Accuracy: ${accuracy}, Armor: ${armor}`);
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "POST",
                url: `http://153.92.5.106:8080/update_user_id`,
                data: JSON.stringify({ itemName, userId, damage, accuracy, armor }),
                headers: { "Content-Type": "application/json" },
                timeout: 10000,
                onload: function(response) {
                    if (response.status === 200) {
                        resolve();
                    } else {
                        reject(new Error(`Failed to update database: ${response.statusText}`));
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Request timed out'))
            });
        });
    }

    function getPropertyValues(itemElement) {
        const properties = itemElement.querySelectorAll('.modifiersAndPropertiesWrapper___VPWW_ .properties___QCPEP div .value___cwqHv');
        const values = [];

        properties.forEach(prop => {
            if (prop.textContent) {
                values.push(parseFloat(prop.textContent));
            }
        });

        if (values.length === 2) {
            return {
                damage: values[0],
                accuracy: values[1],
                armor: null
            };
        } else if (values.length === 1) {
            return {
                damage: null,
                accuracy: null,
                armor: values[0]
            };
        }

        return null;
    }

    function handleBuyButtonClick(event) {
        const buyButton = event.target.closest('button.actionButton___pb_Da');
        if (!buyButton) return;

        const itemElement = buyButton.closest('li');
        if (!itemElement) {
            console.warn('Could not find item element');
            return;
        }

        const itemNameElement = itemElement.querySelector('.name___ukdHN');
        if (!itemNameElement) {
            console.warn('Could not find item name element');
            return;
        }

        const itemName = itemNameElement.textContent.trim();
        const properties = getPropertyValues(itemElement);

        if (!properties) {
            console.warn('Could not find valid property values');
            return;
        }

        console.log(`Clicked item: ${itemName}, Properties:`, properties);

        const observer = new MutationObserver((mutations, obs) => {
            const anonymousElement = document.querySelector('.anonymous___P3s5s');
            if (anonymousElement) {
                obs.disconnect();
                const userId = 'Anonymous';
                getItemInfo(itemName)
                    .then(items => {
                        const matchingItems = items.filter(item => {
                            if (properties.damage !== null) {
                                return parseFloat(item.damage) === properties.damage &&
                                       parseFloat(item.accuracy) === properties.accuracy;
                            } else {
                                return parseFloat(item.armor) === properties.armor;
                            }
                        });
                        if (matchingItems.length > 0) {
                            return updateUserIdInDatabase(itemName, userId, properties.damage, properties.accuracy, properties.armor);
                        }
                    })
                    .catch(error => console.error('Error in buy button click handler:', error));
            } else {
                const sellerLinkElement = document.querySelector("#item-market-root > div > div > div.marketWrapper___S5pRm > div.itemListWrapper___dguQ9 > div.itemListWrapper___ugBOt > ul > li.sellerListWrapper___PN32N > ul > li > div > div.userInfoWrapper___B2a2P > div > div.honorWrap___BHau4.flexCenter___bV1QP.honorWrapSmall___oFibH > a");
                if (sellerLinkElement && sellerLinkElement.href.includes('profiles.php?XID=')) {
                    obs.disconnect();
                    const userId = sellerLinkElement.href.split('XID=')[1];
                    if (userId) {
                        getItemInfo(itemName)
                            .then(items => {
                                const matchingItems = items.filter(item => {
                                    if (properties.damage !== null) {
                                        return parseFloat(item.damage) === properties.damage &&
                                               parseFloat(item.accuracy) === properties.accuracy;
                                    } else {
                                        return parseFloat(item.armor) === properties.armor;
                                    }
                                });
                                if (matchingItems.length > 0) {
                                    return updateUserIdInDatabase(itemName, userId, properties.damage, properties.accuracy, properties.armor);
                                }
                            })
                            .catch(error => console.error('Error in buy button click handler:', error));
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    function setupBuyButtonListener() {
        document.addEventListener('click', handleBuyButtonClick);
    }

    function fetchMissingItems() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: "http://153.92.5.106:5000/missing_items",
                onload: function(response) {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`Failed to fetch missing items: ${response.statusText}`));
                    }
                },
                onerror: reject
            });
        });
    }

    function processMissingItems(items) {
        const itemMap = new Map();
        items.forEach(item => {
            if (!itemMap.has(item.item_id)) {
                itemMap.set(item.item_id, { name: item.item_name, prices: [] });
            }
            itemMap.get(item.item_id).prices.push(item.price);
        });

        const guiElement = document.createElement('div');
        guiElement.id = 'missingItemsGUI';
        guiElement.innerHTML = '<h3>Missing Items</h3><ul></ul>';

        const listElement = guiElement.querySelector('ul');
        itemMap.forEach((item, itemId) => {
            const minPrice = Math.min(...item.prices);
            const maxPrice = Math.max(...item.prices);
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = `https://www.torn.com/page.php?sid=ItemMarket#/market/view=search&itemID=${itemId}&sortField=price&sortOrder=ASC&priceFrom=${minPrice}&priceTo=${maxPrice}&bonuses[0]=-2`;
            link.textContent = item.name;
            link.target = '_blank';
            listItem.appendChild(link);
            listElement.appendChild(listItem);
        });

        document.body.appendChild(guiElement);
    }

    function initGUI() {
        fetchMissingItems()
            .then(processMissingItems)
            .catch(error => console.error('Error initializing GUI:', error));
    }

    function init() {
        setupBuyButtonListener();
        initGUI();
    }

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://153.92.5.106:8080/test",
        onload: function(response) {
            if (response.status === 200) {
                console.log("Server connection test successful");
                init();
            } else {
                console.error("Server connection test failed. Status:", response.status);
            }
        },
        onerror: function(error) {
            console.error("Server connection test failed:", error);
        }
    });

    console.log('Scanner loaded');
})();