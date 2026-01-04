// ==UserScript==
// @name         [MWI] Edible Tools
// @namespace    http://tampermonkey.net/
// @version      0.501
// @description  Translated version of Truth_Light's Edible_Tools
// @author       Truth_Light, WataFX
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/534545/%5BMWI%5D%20Edible%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/534545/%5BMWI%5D%20Edible%20Tools.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const itemSelector = '.ItemDictionary_drop__24I5f';
    const iconSelector = '.Icon_icon__2LtL_ use';
    const chestNameSelector = '#root > div > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.ItemDictionary_modalContent__WvEBY > div.ItemDictionary_itemAndDescription__28_he > div.Item_itemContainer__x7kH1 > div > div > div > svg > use';
    const MARKET_API_URL = "https://raw.githubusercontent.com/holychikenz/MWIApi/main/medianmarket.json";
    let timer = null;
    let formattedChestDropData = {};
    let battlePlayerFood = {};
    let battlePlayerLoot = {};
    let battlePlayerData = {};
    let battlePlayerFoodConsumable = {};
    let battleDuration;
    let battleRunCount;
    let now_battle_map;
    let enhancementLevel;
    let currentEnhancingIndex = 1;
    let enhancementData = {
        [currentEnhancingIndex]: { "强化数据": {}, "其他数据": {} }
    };
    let currentPlayerID = null;
    let currentPlayerName = null;
    let item_icon_url

    let marketData = JSON.parse(localStorage.getItem('MWITools_marketAPI_json'));
    const init_Client_Data = localStorage.getItem('initClientData');
    if (!init_Client_Data) return;
    let init_Client_Data_;
    try {
        init_Client_Data_ = JSON.parse(init_Client_Data);
    } catch (error) {
        console.error('Data parsing failed:', error);
        return;
    }
    if (init_Client_Data_.type !== 'init_client_data') return;
    const item_hrid_to_name = init_Client_Data_.itemDetailMap;
    for (const key in item_hrid_to_name) {
        if (item_hrid_to_name[key] && typeof item_hrid_to_name[key] === 'object' && item_hrid_to_name[key].name) {
            item_hrid_to_name[key] = item_hrid_to_name[key].name;
        }
    }
    const item_name_to_hrid = Object.fromEntries(
        Object.entries(item_hrid_to_name).map(([key, value]) => [value, key])
    );

    let specialItemPrices = {
        'Coin': { ask: 1, bid: 1 },
        'Cowbell': {
            ask: getSpecialItemPrice('Bag Of 10 Cowbells', 'ask') / 10 || 32000,
            bid: getSpecialItemPrice('Bag Of 10 Cowbells', 'bid') / 10 || 30000
        },
        'Chimerical Token': {
            ask: getSpecialItemPrice('Chimerical Essence', 'ask') || 600,
            bid: getSpecialItemPrice('Chimerical Essence', 'bid') || 600
        },
        'Sinister Token': {
            ask: getSpecialItemPrice('Sinister Essence', 'ask') || 1300,
            bid: getSpecialItemPrice('Sinister Essence', 'bid') || 1300
        },
        'Enchanted Token': {
            ask: getSpecialItemPrice('Enchanted Essence', 'ask') || 1800,
            bid: getSpecialItemPrice('Enchanted Essence', 'bid') || 1700
        },
        'Pirate Token': {
            ask: getSpecialItemPrice('Pirate Essence', 'ask') || 4000,
            bid: getSpecialItemPrice('Pirate Essence', 'bid') || 4000
        },
    };

    const auraAbilities = new Set([
        'revive',
        'insanity',
        'invincible',
        'fierce_aura',
        'aqua_aura',
        'sylvan_aura',
        'flame_aura',
        'speed_aura',
        'critical_aura'
    ]);

    const updataDealy = 24*60*60*1000;
    let rateXPDayMap = {};

    async function fetchMarketData() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: MARKET_API_URL,
                responseType: 'json',
                timeout: 5000,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        console.log('Data obtained from the API:', data);
                        resolve(data);
                    } else {
                        console.error('Failed to obtain data. Status code:', response.status);
                        reject(new Error('Data acquisition failed'));
                    }
                },
                ontimeout: function() {
                    console.error('Request timeout: Failed to obtain data after more than 5 seconds');
                    reject(new Error('Request timeout'));
                },
                onerror: function(error) {
                    console.error('An error occurred while getting data:', error);
                    reject(error);
                }
            });
        });
    }

    hookWS();
    initObserver();

    try {

        marketData = await fetchMarketData();
        marketData.market.Coin.ask = 1;
        marketData.market.Coin.bid = 1;
    } catch (error) {
        console.error('Failed to get data from API, tried to get data from local storage.', error);

        const marketDataStr = localStorage.getItem('MWITools_marketAPI_json');
        marketData = JSON.parse(marketDataStr);

        if (!marketData) {
            alert('Unable to obtain market data');
        } else {
            console.log('Data retrieved from local storage:', marketData);
        }
    }

    function getSpecialItemPrice(itemName, priceType) {
        if (marketData?.market?.[itemName]) {
            const itemPrice = marketData.market[itemName][priceType];
            if (itemPrice !== undefined && itemPrice !== -1) {
                return itemPrice;
            }
        }
        console.error(`No price information found for item ${itemName} ${priceType}`);
        return null;
    }

    function getItemNameFromElement(element) {
        const itemNameRaw = element.getAttribute('href').split('#').pop();
        return formatItemName(itemNameRaw);
    }

    function formatItemName(itemNameRaw) {
        return item_hrid_to_name[`/items/${itemNameRaw}`]
    }

    function formatPrice(value,n = 1) {
        const isNegative = value < 0;
        value = Math.abs(value);
        if (value >= 1e13 / n) {
            return (isNegative ? '-' : '') + (value / 1e12).toFixed(1) + 'T';
        } else if (value >= 1e10 / n) {
            return (isNegative ? '-' : '') + (value / 1e9).toFixed(1) + 'B';
        } else if (value >= 1e7 / n) {
            return (isNegative ? '-' : '') + (value / 1e6).toFixed(1) + 'M';
        } else if (value >= 1e4 / n) {
            return (isNegative ? '-' : '') + (value / 1e3).toFixed(1) + 'K';
        } else {
            return (isNegative ? '-' : '') + value.toFixed(0);
        }
    }

    function parseQuantityString(quantityStr) {
        const suffix = quantityStr.slice(-1);
        const base = parseFloat(quantityStr.slice(0, -1));
        if (suffix === 'K') {
            return base * 1000;
        } else if (suffix === 'M') {
            return base * 1000000;
        } else if (suffix === 'B') {
            return base * 1000000000;
        } else {
            return parseFloat(quantityStr);
        }
    }

    function recordChestOpening(modalElement) {
        if (document.querySelector('.ChestStatistics')) {
            return;
        }

        let edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        edibleTools.Chest_Open_Data = edibleTools.Chest_Open_Data || {};

        if (!currentPlayerID || !currentPlayerName) {
            console.error("Unable to get the current player's ID or nickname");
            return;
        }
        edibleTools.Chest_Open_Data[currentPlayerID] = edibleTools.Chest_Open_Data[currentPlayerID] || {
            玩家昵称: currentPlayerName,
            开箱数据: {}
        };

        let chestOpenData = edibleTools.Chest_Open_Data[currentPlayerID].开箱数据;
        const chestDropData = edibleTools.Chest_Drop_Data;

        const chestNameElement = modalElement.querySelector("div.Modal_modal__1Jiep > div.Inventory_modalContent__3ObSx > div.Item_itemContainer__x7kH1 > div > div > div.Item_iconContainer__5z7j4 > svg > use");
        const chestCountElement = modalElement.querySelector("div.Modal_modal__1Jiep > div.Inventory_modalContent__3ObSx > div.Item_itemContainer__x7kH1 > div > div > div.Item_count__1HVvv");

        if (chestNameElement && chestCountElement) {
            const chestName = getItemNameFromElement(chestNameElement);
            chestOpenData[chestName] = chestOpenData[chestName] || {};
            let chestData = chestOpenData[chestName];
            const chestCount = parseQuantityString(chestCountElement.textContent.trim());
            chestData["总计开箱数量"] = (chestData["总计开箱数量"] || 0) + chestCount;
            chestData["获得物品"] = chestData["获得物品"] || {};
            const itemsContainer = modalElement.querySelector('.Inventory_gainedItems___e9t9');
            const itemElements = itemsContainer.querySelectorAll('.Item_itemContainer__x7kH1');

            let totalAskValue = 0;
            let totalBidValue = 0;

            itemElements.forEach(itemElement => {
                const itemNameElement = itemElement.querySelector('.Item_iconContainer__5z7j4 use');
                const itemQuantityElement = itemElement.querySelector('.Item_count__1HVvv');

                if (itemNameElement && itemQuantityElement) {
                    const itemName = getItemNameFromElement(itemNameElement);
                    const itemQuantity = parseQuantityString(itemQuantityElement.textContent.trim());

                    const itemData = chestDropData[chestName].item[itemName] || {};
                    const itemAskValue = itemData["出售单价"] || 0;
                    const itemBidValue = itemData["收购单价"] || 0;
                    const color = itemData.Color || '';

                    itemQuantityElement.style.color = color;

                    const itemOpenTotalAskValue = itemAskValue * itemQuantity;
                    const itemOpenTotalBidValue = itemBidValue * itemQuantity;

                    chestData["获得物品"][itemName] = chestData["获得物品"][itemName] || {};
                    chestData["获得物品"][itemName]["数量"] = (chestData["获得物品"][itemName]["数量"] || 0) + itemQuantity;
                    chestData["获得物品"][itemName]["总计Ask价值"] = (chestData["获得物品"][itemName]["总计Ask价值"] || 0) + itemOpenTotalAskValue;
                    chestData["获得物品"][itemName]["总计Bid价值"] = (chestData["获得物品"][itemName]["总计Bid价值"] || 0) + itemOpenTotalBidValue;

                    totalAskValue += itemOpenTotalAskValue;
                    totalBidValue += itemOpenTotalBidValue;
                }
            });

            chestData["总计开箱Ask"] = (chestData["总计开箱Ask"] || 0) + totalAskValue;
            chestData["总计开箱Bid"] = (chestData["总计开箱Bid"] || 0) + totalBidValue;

            const differenceValue = totalBidValue - chestDropData[chestName]["期望产出Bid"] * chestCount;

            chestData["累计偏差值"] = (chestData["累计偏差值"] || 0) + differenceValue;

            let profitRange = null;
            let profitColor = 'lime';
            const chestCosts = {
                "Chimerical Chest": {
                    keyAsk: getSpecialItemPrice('Chimerical Chest Key', 'ask') || 3000e3,
                    keyBid: getSpecialItemPrice('Chimerical Chest Key', 'bid') || 3000e3,
                    entryAsk: getSpecialItemPrice('Chimerical Entry Key', 'ask') || 280e3,
                    entryBid: getSpecialItemPrice('Chimerical Entry Key', 'bid') || 280e3
                },
                "Sinister Chest": {
                    keyAsk: getSpecialItemPrice('Sinister Chest Key', 'ask') || 6000e3,
                    keyBid: getSpecialItemPrice('Sinister Chest Key', 'bid') || 5400e3,
                    entryAsk: getSpecialItemPrice('Sinister Entry Key', 'ask') || 300e3,
                    entryBid: getSpecialItemPrice('Sinister Entry Key', 'bid') || 280e3
                },
                "Enchanted Chest": {
                    keyAsk: getSpecialItemPrice('Enchanted Chest Key', 'ask') || 7600e3,
                    keyBid: getSpecialItemPrice('Enchanted Chest Key', 'bid') || 7200e3,
                    entryAsk: getSpecialItemPrice('Enchanted Entry Key', 'ask') || 360e3,
                    entryBid: getSpecialItemPrice('Enchanted Entry Key', 'bid') || 360e3
                },
                "Pirate Chest": {
                    keyAsk: getSpecialItemPrice('Pirate Chest Key', 'ask') || 10000e3,
                    keyBid: getSpecialItemPrice('Pirate Chest Key', 'bid') || 10000e3,
                    entryAsk: getSpecialItemPrice('Pirate Entry Key', 'ask') || 460e3,
                    entryBid: getSpecialItemPrice('Pirate Entry Key', 'bid') || 440e3
                }
            };

            if (chestCosts[chestName]) {
                const { keyAsk, keyBid, entryAsk, entryBid } = chestCosts[chestName];
                const minProfit = totalBidValue - (keyAsk + entryAsk) * chestCount;
                const maxProfit = totalAskValue - (keyBid + entryBid) * chestCount;
                profitRange = `${formatPrice(minProfit)}～${formatPrice(maxProfit)}`;

                chestData["总计最高利润"] = (chestData["总计最高利润"] || 0) + maxProfit;
                chestData["总计最低利润"] = (chestData["总计最低利润"] || 0) + minProfit;

                if (minProfit > 0 && maxProfit > 0) {
                    profitColor = 'lime';
                } else if (minProfit < 0 && maxProfit < 0) {
                    profitColor = 'red';
                } else {
                    profitColor = 'orange';
                }
            }

            const openChestElement = document.querySelector('.Inventory_modalContent__3ObSx');

            const displayElement = document.createElement('div');
            displayElement.classList.add('ChestStatistics');
            displayElement.style.position = 'absolute';
            displayElement.style.left = `${openChestElement.offsetLeft}px`;
            displayElement.style.top = `${openChestElement.offsetTop}px`;
            displayElement.style.fontSize = '12px';
            displayElement.innerHTML = `
            Total chests:<br>
            ${chestData["总计开箱数量"]}<br>
            Value:<br>
            ${formatPrice(totalAskValue)}/${formatPrice(totalBidValue)}<br>
            Total value:<br>
            ${formatPrice(chestData["总计开箱Ask"])}/${formatPrice(chestData["总计开箱Bid"])}<br>
        `;

            const expectedOutputElement = document.createElement('div');
            expectedOutputElement.classList.add('ExpectedOutput');
            expectedOutputElement.style.position = 'absolute';
            expectedOutputElement.style.left = `${openChestElement.offsetLeft}px`;
            expectedOutputElement.style.bottom = `${openChestElement.offsetTop}px`;
            expectedOutputElement.style.fontSize = '12px';
            expectedOutputElement.innerHTML = `
            Expected:<br>
            ${formatPrice(chestDropData[chestName]["期望产出Ask"]*chestCount)}/${formatPrice(chestDropData[chestName]["期望产出Bid"]*chestCount)}<br>
        `;

            const differenceOutputElement = document.createElement('div');
            differenceOutputElement.classList.add('DifferenceOutput');
            differenceOutputElement.style.position = 'absolute';
            differenceOutputElement.style.right = `${openChestElement.offsetLeft}px`;
            differenceOutputElement.style.bottom = `${openChestElement.offsetTop}px`;
            differenceOutputElement.style.fontSize = '12px';
            differenceOutputElement.style.color = differenceValue > 0 ? 'lime' : 'red';
            differenceOutputElement.innerHTML = `
            ${differenceValue > 0 ? 'Higher:' : 'Lower:'}<br>
            ${formatPrice(Math.abs(differenceValue))}<br>
        `;

            const cumulativeDifferenceElement = document.createElement('div');
            cumulativeDifferenceElement.classList.add('CumulativeDifference');
            cumulativeDifferenceElement.style.position = 'absolute';
            cumulativeDifferenceElement.style.right = `${openChestElement.offsetLeft}px`;
            cumulativeDifferenceElement.style.top = `${openChestElement.offsetTop}px`;
            cumulativeDifferenceElement.style.fontSize = '12px';
            cumulativeDifferenceElement.style.color = chestData["累计偏差值"] > 0 ? 'lime' : 'red';
            cumulativeDifferenceElement.innerHTML = `
            <br><br>
            <span style="color: ${profitColor};">Profit:</span><br>
            ${profitRange ? `<span style="color: ${profitColor};">${profitRange}</span>` : `<span style="color: ${profitColor};">${formatPrice(totalAskValue)}/${formatPrice(totalBidValue)}</span>`}<br>
            Grand total ${chestData["累计偏差值"] > 0 ? 'higher:' : 'lower:'}<br>
            ${formatPrice(Math.abs(chestData["累计偏差值"]))}<br>
            `;

            openChestElement.appendChild(displayElement);
            openChestElement.appendChild(expectedOutputElement);
            openChestElement.appendChild(differenceOutputElement);
            openChestElement.appendChild(cumulativeDifferenceElement);

            localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
        }
    }

    function calculateTotalValues(itemElements) {
        let totalAskValue = 0;
        let totalBidValue = 0;

        itemElements.forEach(itemElement => {
            const itemNameElement = itemElement.querySelector('.Item_iconContainer__5z7j4 use');
            const itemQuantityElement = itemElement.querySelector('.Item_count__1HVvv');

            if (itemNameElement && itemQuantityElement) {
                const itemName = getItemNameFromElement(itemNameElement);
                const itemQuantity = parseQuantityString(itemQuantityElement.textContent.trim());

                let askPrice = 0;
                let bidPrice = 0;
                let priceColor = '';

                if (specialItemPrices[itemName] && specialItemPrices[itemName].ask) {
                    askPrice = parseFloat(specialItemPrices[itemName].ask);
                    bidPrice = parseFloat(specialItemPrices[itemName].bid);
                    priceColor = '';
                } else if (marketData?.market?.[itemName]) {
                    bidPrice = marketData.market[itemName].bid;
                    askPrice = marketData.market[itemName].ask;
                } else {
                    console.log(`${itemName} 的价格未找到`);
                }
                const itemTotalAskValue = askPrice * itemQuantity;
                const itemTotalBidValue = bidPrice * itemQuantity;
                totalAskValue += itemTotalAskValue;
                totalBidValue += itemTotalBidValue;
            }
        });

        return { totalAskValue, totalBidValue };
    }

    const updateCombatLevel = () => {
        const elements = document.querySelectorAll(".NavigationBar_currentExperience__3GDeX");

        if (elements.length === 17) {
            const levels = Array.from(elements).slice(10, 17).map(el => {
                const levelText = parseInt(el.parentNode.parentNode.querySelector(".NavigationBar_textContainer__7TdaI .NavigationBar_level__3C7eR").textContent);
                const decimalPart = parseFloat(el.style.width) / 100;
                return { integerPart: levelText, decimalPart: decimalPart };
            });

            let [endurance, intelligence, attack, strength, defense, ranged, magic] = levels;

            let combatTypeMax = Math.max(
                0.5 * (attack.integerPart + strength.integerPart),
                ranged.integerPart,
                magic.integerPart
            );

            if (combatTypeMax !== 0.5 * (attack.integerPart + strength.integerPart)) {
                attack.decimalPart = 0;
                strength.decimalPart = 0;
            }
            if (combatTypeMax !== ranged.integerPart) ranged.decimalPart = 0;
            if (combatTypeMax !== magic.integerPart) magic.decimalPart = 0;

            let combatLevel = 0.2 * (endurance.integerPart + intelligence.integerPart + defense.integerPart) + 0.4 * combatTypeMax;
            combatLevel = parseFloat(combatLevel.toFixed(2));

            const integerPart = Math.floor(combatLevel);
            const decimalPart = combatLevel - integerPart;

            const list1 = [
                endurance.decimalPart * 0.2,
                intelligence.decimalPart * 0.2,
                attack.decimalPart * 0.2,
                strength.decimalPart * 0.2,
                defense.decimalPart * 0.2,
                ranged.decimalPart * 0.2,
                magic.decimalPart * 0.2
            ];

            const list2 = [
                endurance.decimalPart * 0.2,
                intelligence.decimalPart * 0.2,
                attack.decimalPart * 0.2,
                strength.decimalPart * 0.2,
                defense.decimalPart * 0.2,
                ranged.decimalPart * 0.2,
                magic.decimalPart * 0.2,
                ranged.decimalPart * 0.2,
                magic.decimalPart * 0.2
            ];

            list1.sort((a, b) => b - a);
            list2.sort((a, b) => b - a);

            if (decimalPart === 0.8) {
                combatLevel += list1[0];
            } else {
                let total = 0;
                const maxIterations = Math.floor((1 - decimalPart) / 0.2);
                let iterations = 0;

                for (const i of list2) {
                    if (iterations >= maxIterations) break;

                    if ((decimalPart + total + i) < 1) {
                        total += i;
                    } else {
                        break;
                    }

                    iterations++;
                }
                combatLevel = decimalPart + integerPart + total;
            }

            elements[15].parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".NavigationBar_nav__3uuUl .NavigationBar_level__3C7eR").textContent = combatLevel.toFixed(2);
        }
    };
    window.setInterval(updateCombatLevel, 10000);

    function OfflineStatistics(modalElement) {
        const itemsContainer = modalElement.querySelectorAll(".OfflineProgressModal_itemList__26h-Y");

        let timeContainer = null;
        let getItemContainer = null;
        let spendItemContainer = null;

        itemsContainer.forEach(container => {
            const labelElement = container.querySelector('.OfflineProgressModal_label__2HwFG');
            if (labelElement) {
                const textContent = labelElement.textContent.trim();
                if (textContent.startsWith("Offline duration")) {
                    timeContainer = container;
                } else if (textContent.startsWith("Items gained")) {
                    getItemContainer = container;
                } else if (textContent.startsWith("Items consumed")) {
                    spendItemContainer = container;
                }
            }
        });

        let TotalSec = null;
        if (timeContainer) {
            const textContent = timeContainer.textContent;
            const match = textContent.match(/(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)/);
            if (match) {
                let days = parseInt(match[1], 10) || 0;
                let hours = parseInt(match[2], 10) || 0;
                let minutes = parseInt(match[3], 10) || 0;
                let seconds = parseInt(match[4], 10) || 0;
                TotalSec = days * 86400 + hours * 3600 + minutes * 60 + seconds;
            }
        }

        let getitemtotalAskValue = 0;
        let getitemtotalBidValue = 0;
        if (getItemContainer) {
            const getitemElements = getItemContainer.querySelectorAll('.Item_itemContainer__x7kH1');
            const { totalAskValue, totalBidValue } = calculateTotalValues(getitemElements);
            getitemtotalAskValue = totalAskValue;
            getitemtotalBidValue = totalBidValue;
        }

        let spenditemtotalAskValue = 0;
        let spenditemtotalBidValue = 0;
        if (spendItemContainer) {
            const spenditemElements = spendItemContainer.querySelectorAll('.Item_itemContainer__x7kH1');
            const { totalAskValue, totalBidValue } = calculateTotalValues(spenditemElements);
            spenditemtotalAskValue = totalAskValue;
            spenditemtotalBidValue = totalBidValue;
        }

        if (timeContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `Profit: ${formatPrice(getitemtotalBidValue - spenditemtotalAskValue,10)} [${formatPrice((getitemtotalBidValue - spenditemtotalAskValue) / (TotalSec / 3600) * 24,10)}/d]`;
            newElement.style.color = 'gold';
            newElement.style.whiteSpace = 'nowrap';
            newElement.style.marginLeft = 'auto';
            timeContainer.querySelector(':first-child').appendChild(newElement);
        }
        if (getItemContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `Output:[${formatPrice(getitemtotalAskValue)}/${formatPrice(getitemtotalBidValue)}]`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            newElement.style.whiteSpace = 'nowrap';
            getItemContainer.querySelector(':first-child').appendChild(newElement);
        }
        if (spendItemContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `Price:[${formatPrice(spenditemtotalAskValue)}/${formatPrice(spenditemtotalBidValue)}]`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            newElement.style.whiteSpace = 'nowrap';
            spendItemContainer.querySelector(':first-child').appendChild(newElement);
        }
    }

    function initObserver() {

        const targetNode = document.body;

        const config = { childList: true, subtree: true };

        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {

                    mutation.addedNodes.forEach(addedNode => {

                        if (addedNode.classList && addedNode.classList.contains('Modal_modalContainer__3B80m')) {

                            ShowChestPrice();
                            recordChestOpening(addedNode);

                            startIconObserver();
                        }
                        if (addedNode.classList && addedNode.classList.contains('OfflineProgressModal_modalContainer__knnk7')) {
                            OfflineStatistics(addedNode);
                            console.log("离线报告已创建!")
                        }
                        if (addedNode.classList && addedNode.classList.contains('MainPanel_subPanelContainer__1i-H9')) {
                            if (addedNode.querySelector(".CombatPanel_combatPanel__QylPo")) {
                                addBattlePlayerFoodButton();
                                addBattlePlayerLootButton();
                            } else if (addedNode.querySelector('.EnhancingPanel_enhancingPanel__ysWpV')) {
                                updateEnhancementUI();
                            }
                        }

                    });

                    mutation.removedNodes.forEach(removedNode => {

                        if (removedNode.classList && removedNode.classList.contains('Modal_modalContainer__3B80m')) {

                            stopIconObserver();
                        }
                    });
                }
            }
        });

        observer.observe(targetNode, config);

        let iconObserver = null;

        function startIconObserver() {
            const chestNameElem = document.querySelector(chestNameSelector);
            if (!chestNameElem) return;

            iconObserver = new MutationObserver(() => {

                ShowChestPrice();
            });

            const iconConfig = { attributes: true, attributeFilter: ['href'] };

            iconObserver.observe(chestNameElem, iconConfig);
        }

        function stopIconObserver() {
            if (iconObserver) {
                iconObserver.disconnect();
                iconObserver = null;
            }
        }
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });

            return handleMessage(message);
        }
    }

    function addStatisticsButton() {
        const waitForNavi = () => {
            const targetNode = document.querySelector("div.NavigationBar_minorNavigationLinks__dbxh7");
            if (targetNode) {

                let statsButton = document.createElement("div");
                statsButton.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                statsButton.style.color = "gold";
                statsButton.innerHTML = "Chest Statistics";
                statsButton.addEventListener("click", () => {
                    const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                    const openChestData = edibleTools.Chest_Open_Data || {};
                    createVisualizationWindow(openChestData);
                });

                let edibleToolsButton = document.createElement("div");
                edibleToolsButton.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                edibleToolsButton.style.color = "gold";
                edibleToolsButton.innerHTML = "Edible Tools";
                edibleToolsButton.addEventListener("click", () => {
                    openSettings();
                });

                targetNode.insertAdjacentElement("afterbegin", statsButton);
                targetNode.insertAdjacentElement("afterbegin", edibleToolsButton);

                item_icon_url = document.querySelector("div[class^='Item_itemContainer'] use")?.getAttribute("href")?.split("#")[0];

                addBattlePlayerFoodButton();
                addBattlePlayerLootButton();
            } else {
                setTimeout(waitForNavi, 200);
            }
        };

        waitForNavi();
    }

    function handleMessage(message) {
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "new_battle") {
                processCombatConsumables(obj);
            } else if (obj && obj.type === "init_character_data") {
                now_battle_map = undefined;
                processCharacterData(obj);
                addStatisticsButton();
                update_market_list(obj);
            } else if (obj && obj.type === "action_completed" && obj.endCharacterAction) {
                const actionHrid = obj.endCharacterAction.actionHrid;
                if (actionHrid === "/actions/enhancing/enhance") {
                    processEnhancementData(obj);
                } else if (actionHrid.startsWith("/actions/combat/")) {
                    now_battle_map = actionHrid;
                }
            } else if (obj && obj.type === "guild_updated") {
                const Guild_ID = obj.guild.id;
                const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                edibleTools.Guild_Data = edibleTools.Guild_Data || {};
                let storedData = edibleTools.Guild_Data || {};

                if (storedData[Guild_ID] && storedData[Guild_ID].guild_updated && storedData[Guild_ID].guild_updated.old.updatedAt) {
                    const oldUpdatedAt = new Date(storedData[Guild_ID].guild_updated.new.updatedAt);
                    const newUpdatedAt = new Date(obj.guild.updatedAt);

                    const timeDifference = newUpdatedAt - oldUpdatedAt;

                    if (timeDifference >= updataDealy) {

                        storedData[Guild_ID].guild_updated.old = storedData[Guild_ID].guild_updated.new;

                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    } else {

                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    }

                    const Delta = {
                        Delta_Xp: storedData[Guild_ID].guild_updated.new.experience - storedData[Guild_ID].guild_updated.old.experience,
                        Delta_Level: storedData[Guild_ID].guild_updated.new.level - storedData[Guild_ID].guild_updated.old.level,
                        Delta_Time: (newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000,
                        Rate_XP_Hours: (3600*(obj.guild.experience - storedData[Guild_ID].guild_updated.old.experience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000)).toFixed(2)
                    };
                    storedData[Guild_ID].guild_updated.Delta = Delta;

                    const Guild_TotalXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[1];
                    if (Guild_TotalXp_div) {
                        const xpText = "XP / Hour";

                        Guild_TotalXp_div.insertAdjacentHTML(
                            "afterend",
                            `<div>${formatPrice(Delta.Rate_XP_Hours)} ${xpText}</div>`
                        );
                        const Guild_NeedXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2];
                        if (Guild_NeedXp_div) {
                            const Guild_NeedXp = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2].textContent.replace(/,/g, '');
                            const Time = TimeReset(Guild_NeedXp/Delta.Rate_XP_Hours);
                            Guild_NeedXp_div.insertAdjacentHTML(
                                "afterend",
                                `<div>${Time}</div>`
                        );
                        }
                    }
                } else {

                    storedData[Guild_ID] = {
                        guild_name: obj.guild.name,
                        guild_updated: {
                            old: {
                                experience: obj.guild.experience,
                                level: obj.guild.level,
                                updatedAt: obj.guild.updatedAt
                            },
                            new: {},
                        }
                    };
                }

                edibleTools.Guild_Data = storedData;
                localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
            } else if (obj && obj.type === "guild_characters_updated") {
                const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                edibleTools.Guild_Data = edibleTools.Guild_Data || {};
                let storedData = edibleTools.Guild_Data || {};
                for (const key in obj.guildSharableCharacterMap) {
                    if (obj.guildSharableCharacterMap.hasOwnProperty(key)) {
                        const Guild_ID = obj.guildCharacterMap[key].guildID;
                        const name = obj.guildSharableCharacterMap[key].name;
                        const newUpdatedAt = new Date();
                        storedData[Guild_ID].guild_player = storedData[Guild_ID].guild_player || {};
                        if (storedData[Guild_ID] && storedData[Guild_ID].guild_player && storedData[Guild_ID].guild_player[name] && storedData[Guild_ID].guild_player[name].old && storedData[Guild_ID].guild_player[name].old.updatedAt) {
                            const oldUpdatedAt = new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)
                            const timeDifference = newUpdatedAt - oldUpdatedAt
                            if (timeDifference >= updataDealy) {

                                storedData[Guild_ID].guild_player[name].old = storedData[Guild_ID].guild_player[name].new;

                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            } else {

                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            }

                            const Delta = {
                                Delta_Time:(newUpdatedAt - new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)) / 1000,
                                Delta_Xp: storedData[Guild_ID].guild_player[name].new.guildExperience - storedData[Guild_ID].guild_player[name].old.guildExperience,
                                Rate_XP_Day: (24*3600*(obj.guildCharacterMap[key].guildExperience - storedData[Guild_ID].guild_player[name].old.guildExperience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)) / 1000)).toFixed(2)
                            };
                            storedData[Guild_ID].guild_player[name].Delta = Delta;
                            rateXPDayMap[name] = Delta.Rate_XP_Day;
                        }else {
                            storedData[Guild_ID].guild_player[name] = {
                                old: {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                },
                                new:{}
                            };
                        }
                    }

                }

                updateExperienceDisplay(rateXPDayMap);
                edibleTools.Guild_Data = storedData;
                localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
            } else if (obj && obj.type === "market_listings_updated") {
                update_market_list(obj);
            } else if (obj && obj.type === "battle_consumable_ability_updated" && obj.consumable) {
                const itemHrid = obj.consumable.itemHrid
                battlePlayerFoodConsumable
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }

    function update_market_list(date) {
        if (!date) return;

        let market_list = JSON.parse(GM_getValue('market_list', '[]'));

        function updateOrders(orders) {
            orders.forEach(newOrder => {
                const existingOrderIndex = market_list.findIndex(order => order.id === newOrder.id);
                if (existingOrderIndex !== -1) {
                    market_list[existingOrderIndex] = newOrder;
                } else {
                    market_list.push(newOrder);
                }

                newOrder.lastUpdated = new Date().toISOString();
            });
        }

        if (date.type === "init_character_data" && date.myMarketListings) {
            updateOrders(date.myMarketListings);
        } else if (date.type === "market_listings_updated" && date.endMarketListings) {
            updateOrders(date.endMarketListings);
        }

        GM_setValue('market_list', JSON.stringify(market_list));
    }

    function TimeReset(hours) {
        const totalMinutes = hours * 60;
        const days = Math.floor(totalMinutes / (24 * 60));
        const yudays = totalMinutes % (24 * 60);
        const hrs = Math.floor(yudays / 60);
        const minutes = Math.floor(yudays % 60);
        const dtext = "d";
        const htext = "h";
        const mtext = "m";
        return `${days}${dtext} ${hrs}${htext} ${minutes}${mtext}`;
    }

    function updateExperienceDisplay(rateXPDayMap) {
        const trElements = document.querySelectorAll(".GuildPanel_membersTable__1NwIX tbody tr");
        const idleuser_list = [];
        const dtext = "d";

        const sortedMembers = Object.entries(rateXPDayMap)
        .map(([name, XPdata]) => ({ name, XPdata }))
        .sort((a, b) => b.XPdata - a.XPdata);

        sortedMembers.forEach(({ name, XPdata }) => {
            trElements.forEach(tr => {
                const nameElement = tr.querySelector(".CharacterName_name__1amXp");
                const experienceElement = tr.querySelector("td:nth-child(3) > div");
                const activityElement = tr.querySelector('.GuildPanel_activity__9vshh');

                if (nameElement && nameElement.textContent.trim() === name) {
                    if (activityElement.childElementCount === 0) {
                        idleuser_list.push(nameElement.textContent.trim());
                    }

                    if (experienceElement) {
                        const newDiv = document.createElement('div');
                        newDiv.textContent = `${formatPrice(XPdata)}/${dtext}`;

                        const rank = sortedMembers.findIndex(member => member.name === name);
                        const hue = 120 - (rank * (120 / (sortedMembers.length - 1)));
                        newDiv.style.color = `hsl(${hue}, 100%, 50%)`;

                        experienceElement.insertAdjacentElement('afterend', newDiv);
                    }
                    return;
                }
            });
        });

        update_idleuser_tb(idleuser_list);
    }

    function update_idleuser_tb(idleuser_list) {
        const targetElement = document.querySelector('.GuildPanel_noticeMessage__3Txji');
        if (!targetElement) {
            console.error('Guild notify message element not found!');
            return;
        }
        const clonedElement = targetElement.cloneNode(true);

        const namesText = idleuser_list.join(', ');
        clonedElement.innerHTML = '';
        clonedElement.textContent = `Idle User : ${namesText}`;
        clonedElement.style.color = '#ffcc00';

        const originalStyle = window.getComputedStyle(targetElement);
        const originalHeight = originalStyle.height;
        const originalMinHeight = originalStyle.minHeight;
        clonedElement.style.height = `25%`;
        clonedElement.style.minHeight = `25%`;
        targetElement.parentElement.appendChild(clonedElement);
    }

    function processCharacterData(init_character_data) {
        const initClientData = localStorage.getItem('initClientData');
        if (!initClientData) return;
        let init_client_data
        try {
            init_client_data = JSON.parse(initClientData);
        } catch (error) {
            console.error('Data parsing failed:', error);
            return;
        }
        if (init_client_data.type !== 'init_client_data') return;
        const item_hrid_to_name = init_client_data.itemDetailMap;
        for (const key in item_hrid_to_name) {
            if (item_hrid_to_name[key] && typeof item_hrid_to_name[key] === 'object' && item_hrid_to_name[key].name) {
                item_hrid_to_name[key] = item_hrid_to_name[key].name;
            }
        }
        const item_name_to_hrid = Object.fromEntries(
            Object.entries(item_hrid_to_name).map(([key, value]) => [value, key])
        );
        const hrid2name = item_hrid_to_name;

        const character = init_character_data.character;
        if (character) {
            currentPlayerID = character.id;
            currentPlayerName = character.name;
        }

        let formattedShopData = {};
        if (init_character_data?.characterActions[0]?.actionHrid?.startsWith("/actions/combat/")) {now_battle_map = init_character_data.characterActions[0].actionHrid}

        for (let [key, details] of Object.entries(init_client_data.shopItemDetailMap)) {
            const { itemHrid, costs } = details;
            const itemName = hrid2name[itemHrid] || formatItemName(itemHrid.split('/').pop());

            costs.forEach(cost => {
                const costItemName = hrid2name[cost.itemHrid] || formatItemName(cost.itemHrid.split('/').pop());
                if (costItemName === "Coin") return;

                const costCount = cost.count;

                if (!formattedShopData[costItemName]) {
                    formattedShopData[costItemName] = { items: {}, 最挣钱: '', BID单价: 0 };
                }

                let bidValue = getSpecialItemPrice(itemName,"bid") || 0;
                let profit = bidValue / costCount;

                formattedShopData[costItemName].items[itemName] = {
                    花费: costCount
                };

                if (profit > formattedShopData[costItemName].BID单价) {
                    formattedShopData[costItemName].最挣钱 = itemName;
                    formattedShopData[costItemName].BID单价 = profit;
                    (specialItemPrices[costItemName] ??= {}).ask = profit;
                    (specialItemPrices[costItemName] ??= {}).bid = profit;
                }
            });
        }
        const mostProfitableItems = Object.values(formattedShopData).map(item => item.最挣钱).filter(Boolean);

        for (let iteration = 0; iteration < 4; iteration++) {
            for (let [key, items] of Object.entries(init_client_data.openableLootDropMap)) {
                const boxName = hrid2name[key] || formatItemName(key.split('/').pop());

                if (!formattedChestDropData[boxName]) {
                    formattedChestDropData[boxName] = { item: {} };
                }
                let TotalAsk = 0;
                let TotalBid = 0;
                let awa = 0;
                items.forEach(item => {
                    const { itemHrid, dropRate, minCount, maxCount } = item;
                    const itemName = hrid2name[itemHrid] || formatItemName(itemHrid.split('/').pop());
                    const expectedYield = ((minCount + maxCount) / 2) * dropRate;
                    let bidPrice = -1;
                    let askPrice = -1;
                    let priceColor = '';

                    if (specialItemPrices[itemName] && specialItemPrices[itemName].ask) {
                        askPrice = parseFloat(specialItemPrices[itemName].ask);
                        bidPrice = parseFloat(specialItemPrices[itemName].bid);
                        priceColor = '';
                    } else if (marketData?.market?.[itemName]) {
                        bidPrice = marketData.market[itemName].bid;
                        askPrice = marketData.market[itemName].ask;
                    } else {
                        console.log(`${itemName} 的价格未找到`);
                    }

                    if (formattedChestDropData[boxName].item[itemName] && iteration === 0) {

                        const existingItem = formattedChestDropData[boxName].item[itemName];
                        existingItem.期望掉落 += expectedYield;
                    } else if (iteration === 0) {
                        formattedChestDropData[boxName].item[itemName] = {
                            期望掉落: expectedYield,
                        };
                    }

                    if (mostProfitableItems.includes(itemName)) {
                        priceColor = '#FFb3E6';
                    } else if (askPrice === -1 && bidPrice === -1) {
                        priceColor = 'yellow';
                    } else if (askPrice === -1) {
                        askPrice = bidPrice;
                        priceColor = '#D95961';
                    } else if (bidPrice === -1) {
                        priceColor = '#2FC4A7';
                    }

                    const existingItem = formattedChestDropData[boxName].item[itemName];
                    existingItem.出售单价 = askPrice;
                    existingItem.收购单价 = bidPrice;
                    existingItem.出售总价 = (existingItem.出售单价 * existingItem.期望掉落).toFixed(2);
                    existingItem.收购总价 = (existingItem.收购单价 * existingItem.期望掉落).toFixed(2);
                    existingItem.Color = priceColor;

                    TotalAsk += (askPrice * expectedYield);
                    TotalBid += (bidPrice * expectedYield);
                });

                formattedChestDropData[boxName] = {
                    ...formattedChestDropData[boxName],
                    期望产出Ask: TotalAsk.toFixed(2),
                    期望产出Bid: TotalBid.toFixed(2),
                };

                if (!specialItemPrices[boxName]) {
                    specialItemPrices[boxName] = {}
                }

                specialItemPrices[boxName].ask = formattedChestDropData[boxName].期望产出Ask;
                specialItemPrices[boxName].bid = formattedChestDropData[boxName].期望产出Bid;
            }
        }

        for (let itemName in specialItemPrices) {
            if (specialItemPrices.hasOwnProperty(itemName)) {
                marketData.market[itemName] = {
                    ask: specialItemPrices[itemName].ask,
                    bid: specialItemPrices[itemName].bid
                };
            }
        }
        localStorage.setItem('MWITools_marketAPI_json', JSON.stringify(marketData));

        const combatMaps = {};
        const actionDetailMap = init_client_data.actionDetailMap;
        for (const [actionHrid, actionDetail] of Object.entries(actionDetailMap)) {
            if (!actionHrid.startsWith("/actions/combat/")) continue;
            if (!actionDetail.combatZoneInfo || actionDetail.combatZoneInfo.isDungeon) continue;

            const fightInfo = actionDetail.combatZoneInfo.fightInfo;
            const randomSpawnInfo = fightInfo?.randomSpawnInfo;
            const spawns = randomSpawnInfo?.spawns;

            if (!spawns || spawns.length === 0) continue;

            let mapType = "群战";
            if (spawns.length === 1) {
                mapType = "单怪";
            }
            if (actionHrid.includes("_elite") && mapType === "群战") {
                mapType = "群战(精英)";
            }

            const monsterGen = {};
            const maxSpawnCount = randomSpawnInfo.maxSpawnCount;
            const maxTotalStrength = randomSpawnInfo.maxTotalStrength;

            const expectedCounts = calculateExpectedSpawns(spawns, maxSpawnCount, maxTotalStrength);

            spawns.forEach(spawn => {
                monsterGen[spawn.combatMonsterHrid] = {
                    期望数量: expectedCounts[spawn.combatMonsterHrid],
                    精英等级: spawn.eliteTier
                };
            });

            const bossData = {};
            const bossSpawns = fightInfo.bossSpawns;
            const battlesPerBoss = fightInfo.battlesPerBoss;

            if (bossSpawns && bossSpawns.length > 0) {
                bossSpawns.forEach(boss => {
                    if (boss.combatMonsterHrid) {
                        bossData[boss.combatMonsterHrid] = {
                            精英等级: boss.eliteTier
                        };
                    }
                });
            }

            combatMaps[actionHrid] = {
                地图类型: mapType,
                BOSS波次: battlesPerBoss || 0,
                小怪生成: monsterGen,
                BOSS数据: Object.keys(bossData).length > 0 ? bossData : ""
            };
        }
        const combatMobDropData = {};
        const monsterMap = init_client_data.combatMonsterDetailMap;

        for (const [monsterHrid, monsterData] of Object.entries(monsterMap)) {
            const formattedDrops = {
                怪物名称: monsterData.name,
                普通掉落: [],
                稀有掉落: []
            };

            if (monsterData.dropTable) {
                monsterData.dropTable.forEach(drop => {
                    formattedDrops.普通掉落.push({
                        掉落物名称: item_hrid_to_name[drop.itemHrid] || drop.itemHrid,
                        掉落物Hrid: drop.itemHrid,
                        掉落几率: drop.dropRate,
                        掉落数量: (drop.minCount + drop.maxCount) / 2,
                        精英门槛: drop.minEliteTier
                    });
                });
            }

            if (monsterData.rareDropTable) {
                monsterData.rareDropTable.forEach(drop => {
                    formattedDrops.稀有掉落.push({
                        掉落物名称: item_hrid_to_name[drop.itemHrid] || drop.itemHrid,
                        掉落物Hrid: drop.itemHrid,
                        掉落几率: drop.dropRate,
                        掉落数量: (drop.minCount + drop.maxCount) / 2,
                        精英门槛: drop.minEliteTier
                    });
                });
            }

            combatMobDropData[monsterHrid] = formattedDrops;
        }
        let edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        edibleTools = {
            ...edibleTools,
            Chest_Drop_Data: formattedChestDropData,
            Combat_Data: { Combat_Map_Data: combatMaps ,Combat_Mob_Drop_Data: combatMobDropData}
        };

        edibleTools.Chest_Open_Data = edibleTools.Chest_Open_Data || {};
        if (edibleTools.Chest_Open_Data && !edibleTools.Chest_Open_Data[0]) {
            const oldData = { ...edibleTools.Chest_Open_Data };
            edibleTools.Chest_Open_Data = {};
            edibleTools.Chest_Open_Data[0] = {
                玩家昵称: "Old chest data",
                开箱数据: oldData
            };
        }

        edibleTools.Chest_Open_Data[currentPlayerID] = edibleTools.Chest_Open_Data[currentPlayerID] || {
            玩家昵称: currentPlayerName,
            开箱数据: {}
        };

        try {
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
        } catch (error) {
            console.error('An error occurred while saving data:', error);
        }

    }

    function calculateExpectedSpawns(spawns, maxSpawnCount, maxTotalStrength) {
        const monsterList = spawns.map(s => ({ hrid: s.combatMonsterHrid, strength: s.strength }));
        const spawnProbability = 1 / spawns.length;

        const dp = Array.from({ length: maxSpawnCount + 1 }, () => ({}));
        dp[0][0] = 1;

        const expectedCounts = {};
        monsterList.forEach(m => {
            expectedCounts[m.hrid] = 0;
        });

        for (let pos = 0; pos < maxSpawnCount; pos++) {
            const currentDP = dp[pos];
            const nextDP = dp[pos + 1] = {};

            for (const [currentStrengthStr, prob] of Object.entries(currentDP)) {
                const currentStrength = parseInt(currentStrengthStr);

                for (const monster of monsterList) {
                    const newStrength = currentStrength + monster.strength;
                    if (newStrength > maxTotalStrength) continue;

                    const transitionProb = prob * spawnProbability;
                    nextDP[newStrength] = (nextDP[newStrength] || 0) + transitionProb;

                    expectedCounts[monster.hrid] += transitionProb;
                }
            }
        }
        return expectedCounts;
    }

    function ShowChestPrice() {
        const modalContainer = document.querySelector(".Modal_modalContainer__3B80m");
        if (!modalContainer) return;

        const chestNameElem = document.querySelector(chestNameSelector);
        if (!chestNameElem) return;

        const chestName = getItemNameFromElement(chestNameElem);
        const items = document.querySelectorAll(itemSelector);

        const dropListContainer = document.querySelector('.ItemDictionary_openToLoot__1krnv');
        if (!dropListContainer) return;

        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools'))
        const formattedChestDropData = edibleTools.Chest_Drop_Data;

        items.forEach(item => {
            const itemName = getItemNameFromElement(item.querySelector(iconSelector));
            if (!itemName) return;

            const itemData = formattedChestDropData[chestName].item[itemName];
            if (!itemData) return;

            const itemColor = itemData.Color;
            const itemNameElem = item.querySelector('.Item_name__2C42x');
            if (itemNameElem && itemColor) {
                itemNameElem.style.color = itemColor;
            }
        });

        const askPrice = formattedChestDropData[chestName]["期望产出Ask"];
        const bidPrice = formattedChestDropData[chestName]["期望产出Bid"];
        if (askPrice && bidPrice) {

            const previousResults = dropListContainer.querySelectorAll('.resultDiv');
            previousResults.forEach(result => result.remove());

            const createPriceOutput = (label, price) => {
                const priceOutput = document.createElement('div');
                priceOutput.className = 'resultDiv';
                priceOutput.textContent = `${label}: ${formatPrice(price)}`;
                priceOutput.style.color = 'gold';
                priceOutput.style.fontSize = '14px';
                priceOutput.style.fontWeight = '400';
                priceOutput.style.paddingTop = '10px';
                return priceOutput;
            };

            const minPriceOutput = createPriceOutput('Expected Output (Ask Price)', askPrice);
            const maxPriceOutput = createPriceOutput('Expected Output (Bid Price)', bidPrice);

            dropListContainer.appendChild(minPriceOutput);
            dropListContainer.appendChild(maxPriceOutput);

        }
    }

    function processEnhancementData(obj) {
        const now_enhancementLevel = parseInt(obj.endCharacterAction.primaryItemHash.match(/::(\d+)$/)[1]);
        const currentCount = obj.endCharacterAction.currentCount;

        if (enhancementData[currentEnhancingIndex]["强化次数"] && currentCount <= enhancementData[currentEnhancingIndex]["强化次数"]) {
            currentEnhancingIndex++;
            enhancementData[currentEnhancingIndex] = { "强化数据": {}, "其他数据": {} };
            enhancementLevel = undefined;
        }

        if (!enhancementData[currentEnhancingIndex]["其他数据"]["物品名称"]) {
            const itemName = item_hrid_to_name[obj.endCharacterAction.primaryItemHash.match(/::([^:]+)::[^:]*$/)[1]];
            enhancementData[currentEnhancingIndex]["其他数据"] = {
                "物品名称": itemName,
                "目标强化等级": obj.endCharacterAction.enhancingMaxLevel,
                "保护消耗总数": 0,
            }
            const filteredItems = obj.endCharacterItems.filter(
                item => item.hash !== obj.endCharacterAction.primaryItemHash
            );

            const candidateItems = filteredItems.filter(
                item => item.itemHrid === obj.endCharacterAction.primaryItemHash.split('::')[2]
            );

            let prevLevelItem;
            if (candidateItems.length === 1) {
                prevLevelItem = candidateItems[0];
            } else if (candidateItems.length > 1) {
                prevLevelItem = candidateItems.find(
                    item => item.hash !== obj.endCharacterAction.secondaryItemHash
                );
            }

            enhancementLevel = prevLevelItem?.enhancementLevel ?? 0;
        }

        const currentItem = enhancementData[currentEnhancingIndex]["强化数据"];

        if (!currentItem[enhancementLevel]) {
            currentItem[enhancementLevel] = {"祝福次数": 0, "成功次数": 0, "失败次数": 0, "成功率": 0 };
        }

        if (enhancementLevel < now_enhancementLevel) {
            currentItem[enhancementLevel]["成功次数"]++;
            if (now_enhancementLevel - enhancementLevel == 2) {
                currentItem[enhancementLevel]["祝福次数"]++;
            }
        } else {
            currentItem[enhancementLevel]["失败次数"]++;
            if (obj.endCharacterAction.enhancingProtectionMinLevel >= 2 && enhancementLevel >= obj.endCharacterAction.enhancingProtectionMinLevel) {
                enhancementData[currentEnhancingIndex]["其他数据"]["保护消耗总数"]++;
            }
        }

        const success = currentItem[enhancementLevel]["成功次数"];
        const failure = currentItem[enhancementLevel]["失败次数"];
        currentItem[enhancementLevel]["成功率"] = success / (success + failure);

        const highestSuccessLevel = Math.max(...Object.keys(currentItem).filter(level => currentItem[level]["成功次数"] > 0));
        const enhancementState = (highestSuccessLevel + 1 >= enhancementData[currentEnhancingIndex]["其他数据"]["目标强化等级"]) ? "Success" : "Failure";
        enhancementData[currentEnhancingIndex]["强化状态"] = enhancementState;
        enhancementLevel = now_enhancementLevel;

        enhancementData[currentEnhancingIndex]["强化次数"] = currentCount;
        updateEnhancementUI();
    }

    function updateEnhancementUI() {
        const targetElement = document.querySelector(".SkillActionDetail_enhancingComponent__17bOx");
        if (!targetElement) return;

        let parentContainer = document.querySelector("#enhancementParentContainer");
        if (!parentContainer) {
            parentContainer = document.createElement("div");
            parentContainer.id = "enhancementParentContainer";
            parentContainer.style.display = "block";
            parentContainer.style.borderLeft = "2px solid var(--color-divider)";
            parentContainer.style.padding = "0 4px";

            const title = document.createElement("div");
            title.textContent = "Enhancement Data";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "10px";
            title.style.textAlign = "center";
            title.style.color = "var(--color-space-300)";
            parentContainer.appendChild(title);

            const dropdownContainer = document.createElement("div");
            dropdownContainer.style.marginBottom = "10px";

            const dropdown = document.createElement("select");
            dropdown.id = "enhancementDropdown";
            dropdown.addEventListener("change", function () {
                renderEnhancementUI(this.value);
                updateDropdownColor();
            });

            dropdownContainer.appendChild(dropdown);
            parentContainer.appendChild(dropdownContainer);

            const enhancementStatsContainer = document.createElement("div");
            enhancementStatsContainer.id = "enhancementStatsContainer";
            enhancementStatsContainer.style.display = "grid";
            enhancementStatsContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
            enhancementStatsContainer.style.gap = "10px";
            enhancementStatsContainer.style.textAlign = "center";
            enhancementStatsContainer.style.marginTop = "10px";

            parentContainer.appendChild(enhancementStatsContainer);
            targetElement.appendChild(parentContainer);
        }

        const dropdown = document.querySelector("#enhancementDropdown");
        const previousSelectedValue = dropdown.value;
        dropdown.innerHTML = "";

        Object.keys(enhancementData).forEach(key => {
            const item = enhancementData[key];
            const option = document.createElement("option");
            const itemName = item["其他数据"]["物品名称"];
            const transferName = itemName;
            const targetLevel = item["其他数据"]["目标强化等级"];
            const currentLevel = Math.max(...Object.keys(item["强化数据"]));
            const enhancementState = item["强化状态"];

            option.text = `${transferName} (Target: ${targetLevel}, Total: ${item["强化次数"]}${item["其他数据"]["保护消耗总数"] > 0 ? `, PU: ${item["其他数据"]["保护消耗总数"]}` : ""})`;

            option.value = key;
            option.style.color = enhancementState === "Success" ? "green"
            : (currentLevel < targetLevel && Object.keys(enhancementData).indexOf(key) === Object.keys(enhancementData).length - 1) ? "orange"
            : "red";

            dropdown.appendChild(option);
        });

        if (Object.keys(enhancementData).length > 0) {
            dropdown.value = previousSelectedValue || Object.keys(enhancementData)[0];
            updateDropdownColor();
            renderEnhancementUI(dropdown.value);
        }

        function updateDropdownColor() {
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            dropdown.style.color = selectedOption ? selectedOption.style.color : "black";
        }
    }

    function renderEnhancementUI(selectedKey) {
        const enhancementStatsContainer = document.querySelector("#enhancementStatsContainer");
        enhancementStatsContainer.innerHTML = "";

        const item = enhancementData[selectedKey];

        const headers = ["Level", "Success", "Failure", "Rate"];
        headers.forEach(headerText => {
            const headerDiv = document.createElement("div");
            headerDiv.style.fontWeight = "bold";
            headerDiv.textContent = headerText;
            enhancementStatsContainer.appendChild(headerDiv);
        });

        const totalSuccess = Object.values(item["强化数据"]).reduce((acc, val) => acc + val["成功次数"], 0);
        const totalFailure = Object.values(item["强化数据"]).reduce((acc, val) => acc + val["失败次数"], 0);
        const totalCount = totalSuccess + totalFailure;
        const totalRate = totalCount > 0 ? (totalSuccess / totalCount * 100).toFixed(2) : "0.00";

        ["Total", totalSuccess, totalFailure, `${totalRate}%`].forEach((totalText, index) => {
            const totalDiv = document.createElement("div");
            totalDiv.textContent = totalText;
            enhancementStatsContainer.appendChild(totalDiv);
        });

        Object.keys(item["强化数据"]).sort((a, b) => b - a).forEach(level => {
            const levelData = item["强化数据"][level];
            const levelDivs = [
                level,
                levelData["祝福次数"] > 0
                ? `${levelData["成功次数"]}(${levelData["祝福次数"]})`
                : `${levelData["成功次数"]}`,
                levelData["失败次数"],
                `${(levelData["成功率"] * 100).toFixed(2)}%`
            ];

            levelDivs.forEach(data => {
                const dataDiv = document.createElement("div");
                dataDiv.textContent = data;
                enhancementStatsContainer.appendChild(dataDiv);
            });
        });
    }

    function processCombatConsumables(obj) {
        battlePlayerFood = {};
        battlePlayerLoot = {};
        battlePlayerData = {};
        battleDuration = (new Date() - new Date(obj.combatStartTime)) / 1000;
        battleRunCount = obj.battleId || 1;
        obj.players.forEach(player => {
            const playerName = player.character.name;

            battlePlayerFood[playerName] = { drinkConcentration: player.combatDetails.combatStats.drinkConcentration };
            battlePlayerLoot[playerName] = {};
            battlePlayerData[playerName] = { aura: null, skillexp: {} ,combatDropQuantity: player.combatDetails.combatStats.combatDropQuantity ,combatDropRate: player.combatDetails.combatStats.combatDropRate, combatRareFind: player.combatDetails.combatStats.combatRareFind};

            player.combatConsumables.forEach(consumable => {
                const itemname = item_hrid_to_name[consumable.itemHrid];
                battlePlayerFood[playerName][itemname] = {
                    "数量": consumable.count,
                    "颜色": "white",
                    "ID": consumable.itemHrid
                };
            });

            Object.values(player.totalLootMap).forEach(Loot => {
                const itemname = item_hrid_to_name[Loot.itemHrid];
                battlePlayerLoot[playerName][itemname] = {
                    "数量": Loot.count,
                    "ID": Loot.itemHrid
                };
            });

            player.combatAbilities.forEach(ability => {
                const isAura = Array.from(auraAbilities).some(aura => ability.abilityHrid.endsWith(aura));
                if (isAura) {
                    battlePlayerData[playerName].aura = ability.abilityHrid;
                }
            });

            Object.keys(player.totalSkillExperienceMap).forEach(skillPath => {
                const skillname = skillPath.replace('/skills/', '');
                battlePlayerData[playerName].skillexp[skillname] = player.totalSkillExperienceMap[skillPath];
            });
        });
    }

    function addBattlePlayerFoodButton() {

        var tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div")
        var referenceTab = tabsContainer ? tabsContainer.children[1] : null;

        if (!tabsContainer || !referenceTab) return;
        if (tabsContainer.querySelector('.Button_battlePlayerFood__custom')) return;

        var battlePlayerFoodButton = document.createElement('div');
        battlePlayerFoodButton.className = referenceTab.className + ' Button_battlePlayerFood__custom';
        battlePlayerFoodButton.setAttribute('script_translatedfrom', 'New Action');
        battlePlayerFoodButton.textContent = "Dispatch";

        battlePlayerFoodButton.addEventListener('click', function() {

            let maxQuantityLength = 0;
            Object.values(battlePlayerFood).forEach(playerData => {
                Object.entries(playerData).forEach(([itemName, itemData]) => {
                    if (itemName === 'drinkConcentration') return;
                    const length = formatPrice(itemData.数量).length;
                    if (length > maxQuantityLength) maxQuantityLength = length;
                });
            });

            let minTimeOverall = Infinity;
            let minTimePlayer = null;
            Object.keys(battlePlayerFood).forEach(playerName => {
                const playerData = battlePlayerFood[playerName];
                const drinkConcentration = playerData.drinkConcentration || 0;
                let minTime = Infinity;
                Object.entries(playerData).forEach(([itemName, itemData]) => {
                    if (itemName === 'drinkConcentration') return;
                    let unitTime = itemName.includes('Coffee') ? 300 / (1 + drinkConcentration) : 60;
                    const totalDays = (itemData.数量 * unitTime) / 86400;
                    if (totalDays < minTime) minTime = totalDays;
                });
                if (minTime < minTimeOverall) {
                    minTimeOverall = minTime;
                    minTimePlayer = playerName;
                }
            });

            let dataHtml = `<div style="display: flex; padding: 10px; gap: 15px;">`;

            Object.keys(battlePlayerFood).forEach(playerName => {
                const playerData = battlePlayerFood[playerName];
                const isMinTimePlayer = Object.keys(battlePlayerFood).length > 1 && playerName === minTimePlayer;

                dataHtml += `<div style="flex-shrink: 0; padding: 15px; border: 1px solid #98a7e9; border-radius: 10px; background-color: #1e1e2f; white-space: nowrap;">
                <h3 style="color: ${isMinTimePlayer ? 'red' : '#98a7e9'}; margin: 0 0 15px 0; text-align: center;">
                    ${playerName}
                </h3>`;

                const drinkConcentration = playerData.drinkConcentration || 0;
                let minTime = Infinity;
                const items = [];
                Object.entries(playerData).forEach(([itemName, itemData]) => {
                    if (itemName === 'drinkConcentration') return;
                    let unitTime = itemName.includes('Coffee') ? 300 / (1 + drinkConcentration) : 60;
                    const totalDays = (itemData.数量 * unitTime) / 86400;
                    items.push({ itemName, itemData, totalDays });
                    if (totalDays < minTime) minTime = totalDays;
                });

                items.forEach(({ itemName, itemData, totalDays }) => {
                    const isMinItem = totalDays === minTime;
                    const svgIcon = `<svg width="20" height="20" style="margin-right:8px;vertical-align:middle">
                    <use href="${item_icon_url}#${itemData.ID.split('/').pop()}"></use>
                    </svg>`;

                    dataHtml += `
                        <div style="display: flex; align-items: center; background-color: #2c2e45; border-radius: 5px; padding: 4px; margin-bottom: 8px; border: 1px solid #98a7e9;">
                            <span style="color: ${isMinItem ? 'red' : 'white'};
                                   min-width: ${maxQuantityLength * 10}px;
                                   text-align: center;">
                                ${formatPrice(itemData.数量)}
                            </span>
                            ${svgIcon}
                            <span style="color: ${isMinItem ? 'red' : 'white'};">${itemName}</span>
                        </div>`;
                });

                const timeDisplay = minTime < 1
                ? `${(minTime * 24).toFixed(1)}h`
                : `${minTime.toFixed(1)}d`;
                dataHtml += `
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #98a7e9;">
                    <p style="color: ${isMinTimePlayer ? 'red' : '#4CAF50'}; margin: 0; font-weight: bold; text-align: center;">Duration: ${timeDisplay}</p>
                </div>`;

                const playerAura = battlePlayerData[playerName]?.aura;
                if (playerAura) {
                    const auraHrid = playerAura.split('/').pop();
                    const auraItemHrid = `/items/${auraHrid}`;
                    const auraName = item_hrid_to_name[auraItemHrid] || auraHrid;
                    const transferAuraName = auraName;
                    dataHtml += `
                    <div style="margin-top: 10px; text-align: center;">
                    <p style="color: #98a7e9; margin: 0; font-weight: bold;">Special: ${transferAuraName}</p></div>`;
                }

                dataHtml += `</div>`;
            });
            dataHtml += '</div>';

            let popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#131419';
            popup.style.border = '1px solid #98a7e9';
            popup.style.borderRadius = '10px';
            popup.style.zIndex = '10000';
            popup.style.maxWidth = '90%';

            let scrollWrapper = document.createElement('div');
            scrollWrapper.style.overflowX = 'auto';
            scrollWrapper.style.padding = '20px';
            scrollWrapper.innerHTML = dataHtml;

            let closeButton = document.createElement('button');
            closeButton.textContent = '❎️';
            closeButton.style.display = 'block';
            closeButton.style.width = 'calc(100% - 40px)';
            closeButton.style.margin = '0 20px 15px';
            closeButton.style.backgroundColor = '#4357af';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.padding = '10px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => document.body.removeChild(popup);

            popup.appendChild(scrollWrapper);
            popup.appendChild(closeButton);
            document.body.appendChild(popup);
        });

        var lastTab = tabsContainer.children[tabsContainer.children.length - 1];
        tabsContainer.insertBefore(battlePlayerFoodButton, lastTab.nextSibling);

        var style = document.createElement('style');
        style.innerHTML = `
            .Button_battlePlayerFood__custom {
                background-color: #546ddb;
                color: white;
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .Button_battlePlayerFood__custom:hover {
                background-color: #6b84ff;
            }`;
        document.head.appendChild(style);
    }

    function addBattlePlayerLootButton() {

        var tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div");
        var referenceTab = tabsContainer ? tabsContainer.children[1] : null;

        if (!tabsContainer || !referenceTab) {
            return;
        }

        if (tabsContainer.querySelector('.Button_battlePlayerLoot__custom')) {
            console.log('Split the loot button already exists');
            return;
        }

        var battlePlayerLootButton = document.createElement('div');
        battlePlayerLootButton.className = referenceTab.className + ' Button_battlePlayerLoot__custom';
        battlePlayerLootButton.setAttribute('script_translatedfrom', 'New Action');
        battlePlayerLootButton.textContent = "Loot Distribution";

        battlePlayerLootButton.addEventListener('click', function() {
            const isMobile = window.innerWidth < 768;
            const playerCount = Object.keys(battlePlayerLoot).length;
            let maxItemsToShow = 10;
            const EPH = (60 * 60 * (battleRunCount - 1) / battleDuration)

            const skillTranslation = {
                attack: 'Attack',
                defense: 'Defense',
                intelligence: 'Intelligence',
                power: 'Power',
                stamina: 'Stamina',
                magic: 'Magic',
                ranged: 'Ranged',
            };

            if (isMobile) {
                if (playerCount === 3) {
                    maxItemsToShow = 3;
                } else if (playerCount === 2) {
                    maxItemsToShow = 5;
                } else if (playerCount === 1) {
                    maxItemsToShow = 10;
                } else if (playerCount > 3) {
                    maxItemsToShow = 1;
                }
            }

            const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
            const combatData = edibleTools.Combat_Data || {};
            const currentMapData = combatData.Combat_Map_Data?.[now_battle_map];
            const combatDropData = combatData.Combat_Mob_Drop_Data || {};
            const Mob_Kill_List = {};
            if (currentMapData && combatDropData) {
                const bossWave = currentMapData.BOSS波次;

                if (bossWave === 0) {
                    Object.entries(currentMapData.小怪生成).forEach(([monsterHrid, data]) => {
                        Mob_Kill_List[monsterHrid] = {
                            击杀数量: data.期望数量 * (battleRunCount - 1),
                            精英等级: data.精英等级
                        };
                    });
                } else {
                    const fullCycles = Math.floor((battleRunCount - 1) / bossWave);
                    const remainingWaves = (battleRunCount - 1) % bossWave;
                    const normalWaves = fullCycles * (bossWave - 1) + remainingWaves;

                    Object.entries(currentMapData.小怪生成).forEach(([monsterHrid, data]) => {
                        Mob_Kill_List[monsterHrid] = {
                            击杀数量: data.期望数量 * normalWaves,
                            精英等级: data.精英等级
                        };
                    });

                    if (currentMapData.BOSS数据 && typeof currentMapData.BOSS数据 === 'object') {
                        Object.entries(currentMapData.BOSS数据).forEach(([bossHrid, bossData]) => {
                            const existing = Mob_Kill_List[bossHrid] || { 击杀数量: 0 };
                            Mob_Kill_List[bossHrid] = {
                                击杀数量: existing.击杀数量 + fullCycles,
                                精英等级: bossData.精英等级
                            };
                        });
                    }
                }
                console.log(Mob_Kill_List)
            }

            let dataHtml = '<div style="display: flex; flex-direction: ' + (isMobile ? 'column' : 'row') + '; flex-wrap: nowrap; background-color: #131419; padding: ' + (isMobile ? '5px' : '10px') + '; border-radius: 10px; color: white;">';
            const minPrice = 10000;

            let playerPrices = [];
            for (let player in battlePlayerLoot) {
                let totalPrice = 0;
                let lootItems = battlePlayerLoot[player];
                for (let item in lootItems) {
                    let bidPrice = getSpecialItemPrice(item,"bid") || 0;
                    totalPrice += bidPrice * lootItems[item].数量;
                }
                playerPrices.push({ player, totalPrice });
            }

            let minTotalPricePlayer = null;
            if (playerPrices.length > 1) {
                minTotalPricePlayer = playerPrices.reduce((min, current) =>
                                                          current.totalPrice < min.totalPrice ? current : min
                                                         ).player;
            }

            for (let player in battlePlayerLoot) {
                const PlayerBonusData = battlePlayerData[player];
                const playerExpectDrops = {};

                const commonDropRateMultiplier = 1 + (PlayerBonusData.combatDropRate || 0);
                const rareDropRateMultiplier = 1 + (PlayerBonusData.combatRareFind || 0);
                const dropQuantityMultiplier = 1 + (PlayerBonusData.combatDropQuantity || 0);

                for (const [monsterHrid, killInfo] of Object.entries(Mob_Kill_List)) {
                    const monsterDrops = combatDropData[monsterHrid];
                    if (!monsterDrops) continue;

                    const processDrops = (drops, isRare) => {
                        for (const drop of drops) {
                            if (killInfo.精英等级 < drop.精英门槛) continue;

                            const rateMultiplier = isRare ? rareDropRateMultiplier : commonDropRateMultiplier;
                            const actualRate = Math.min(drop.掉落几率 * rateMultiplier, 1);
                            const actualQuantity = drop.掉落数量 * dropQuantityMultiplier / playerCount;

                            const expected = killInfo.击杀数量 * actualRate * actualQuantity;

                            if (expected > 0) {
                                const key = drop.掉落物名称;
                                playerExpectDrops[key] = (playerExpectDrops[key] || 0) + expected;
                            }
                        }
                    }

                    if (monsterDrops.普通掉落) processDrops(monsterDrops.普通掉落, false);
                    if (monsterDrops.稀有掉落) processDrops(monsterDrops.稀有掉落, true);
                }
                let totalExpectPrice = 0;
                for (const [itemName, expectedQuantity] of Object.entries(playerExpectDrops)) {
                    const unitPrice = getSpecialItemPrice(itemName, 'bid');
                    if (unitPrice !== null) {
                        totalExpectPrice += unitPrice * expectedQuantity;
                    }
                }

                const formattedExpectDrops = {};
                for (const [itemHrid, value] of Object.entries(playerExpectDrops)) {
                    formattedExpectDrops[itemHrid] = Number(value.toFixed(2));
                }
                console.log(formattedExpectDrops)

                let totalFoodPrice = 0;
                const playerFood = battlePlayerFood[player];

                for (let foodName in playerFood) {
                    if (foodName === 'drinkConcentration') continue;

                    const foodPrice = getSpecialItemPrice(foodName, 'ask') || 0;

                    let consumptionRate = 0;
                    if (foodName.endsWith('Coffee')) {
                        consumptionRate = 300 / (1 + (playerFood.drinkConcentration || 0));
                    } else if (foodName.endsWith('Donut') || foodName.endsWith('Cake') || foodName.endsWith('cake')) {
                        consumptionRate = 75;
                    } else if (foodName.endsWith('Gummy') || foodName.endsWith('Yogurt')) {
                        consumptionRate = 67;
                    }

                    const totalConsumed = (battleDuration / consumptionRate);
                    totalFoodPrice += totalConsumed * foodPrice;
                }

                let totalPrice = 0;

                dataHtml += `<div style="flex: 1 0 auto; min-width: 100px; margin: ${isMobile ? '5px 0' : '10px'}; padding: ${isMobile ? '5px' : '10px'}; border-radius: 10px; background-color: #1e1e2f; border: 1px solid #98a7e9;">`;
                dataHtml += `<h3 style="color: white; margin: ${isMobile ? '0 0 5px 0' : '0 0 10px 0'}; font-size: ${isMobile ? '12px' : '20px'};">${player}</h3>`;

                let lootItems = battlePlayerLoot[player];
                for (let item in lootItems) {
                    let bidPrice = getSpecialItemPrice(item,"bid") || 0;
                    totalPrice += bidPrice * lootItems[item].数量;
                }

                if (totalPrice > 0 && playerCount <= 3) {
                    let color = '#4CAF50';
                    if (player === minTotalPricePlayer) {
                        color = '#FF0000';
                    }

                    const pricePerDay = formatPrice((60 * 60 * 24 * totalPrice) / battleDuration);
                    const ExpectPricePerDay = formatPrice((60 * 60 * 24 * totalExpectPrice) / battleDuration);
                    const expectedProfit = totalExpectPrice - totalFoodPrice;
                    const expectedProfitPerDay = (60 * 60 * 24 * expectedProfit) / battleDuration;

                    dataHtml += `
                        <div style="color: ${color}; font-weight: bold; font-size: ${isMobile ? '10px' : '16px'}; margin: ${isMobile ? '2px 0' : '10px 0'};">
                            <div style="margin-bottom: ${isMobile ? '4px' : '8px'};">
                                Total Revenue: ${formatPrice(totalPrice)}<br>
                                Daily Revenue: ${pricePerDay}/d
                            </div>
                            ${totalExpectPrice > 0 ? `
                                <div style="height: 1px; background: #98a7e9; margin: ${isMobile ? '3px 0' : '6px 0'};"></div>
                                <div style="color: ${totalPrice > totalExpectPrice ? '#4CAF50':'#FF0000'}; margin-bottom: ${isMobile ? '4px' : '8px'};">
                                    ${(!isMobile) ? `Expected Revenue: ${formatPrice(totalExpectPrice)}<br>` : ''}
                                    NoRNG Daily: ${ExpectPricePerDay}/d<br>
                                    Expected Daily: ${formatPrice(expectedProfitPerDay)}/d
                                </div>
                            ` : ''}
                        </div>`;
                }

                let maxSkill = null;
                let maxXp = 0;
                if (battlePlayerData[player]?.skillexp) {
                    for (let skill in battlePlayerData[player].skillexp) {
                        let xp = battlePlayerData[player].skillexp[skill];
                        if (xp > maxXp) {
                            maxXp = xp;
                            maxSkill = skill;
                        }
                    }
                }
                const xpPerHours = formatPrice((60 * 60 * maxXp) / battleDuration);
                const translatedSkillName = skillTranslation[maxSkill] || maxSkill;

                dataHtml += `
                <div style="height: 1px; background: #98a7e9; margin: ${isMobile ? '3px 0' : '6px 0'};"></div>
                <div style="color: #FFC107; font-size: ${isMobile ? '10px' : '16px'}; font-weight: bold; margin: ${isMobile ? '2px 0' : '10px 0'};">
                    ${translatedSkillName} EXP: ${xpPerHours}/h
                </div>`;

                let sortedItems = Object.keys(lootItems)
                .map(item => {
                    let bidPrice = getSpecialItemPrice(item, "bid") || 0;
                    return {
                        item,
                        bidPrice,
                        quantity: lootItems[item].数量
                    };
                })
                .filter(item => item.bidPrice >= 10000)
                .sort((a, b) => b.bidPrice - a.bidPrice);

                let maxQuantityLength = Math.max(...sortedItems.map(item => item.quantity.toString().length));

                for (let i = 0; i < Math.min(sortedItems.length, maxItemsToShow); i++) {
                    let item = sortedItems[i].item;
                    let bidPrice = sortedItems[i].bidPrice;
                    let quantity = sortedItems[i].quantity;

                    let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgIcon.setAttribute('width', isMobile ? '12' : '20');
                    svgIcon.setAttribute('height', isMobile ? '12' : '20');
                    svgIcon.style.marginRight = '3px';
                    svgIcon.style.verticalAlign = 'middle';

                    let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    useElement.setAttribute('href', `${item_icon_url}#${lootItems[item].ID.split('/').pop()}`);
                    svgIcon.appendChild(useElement);

                    dataHtml += `
					<div style="display: flex; align-items: center; background-color: #2c2e45; border-radius: 5px; padding: ${isMobile ? '3px' : '8px'}; margin-bottom: ${isMobile ? '3px' : '8px'}; border: 1px solid #98a7e9; white-space: nowrap; flex-shrink: 0;">
						<span style="color: white; margin-right: 3px; min-width: ${isMobile ? maxQuantityLength * 5 : maxQuantityLength * 8}px; text-align: center; font-size: ${isMobile ? '10px' : '16px'}; line-height: 1.2;">${quantity}</span>
						${svgIcon.outerHTML}
						<span style="color: white; white-space: nowrap; font-size: ${isMobile ? '10px' : '16px'}; line-height: 1.2;">${item}</span>
					</div>`;
                }
                dataHtml += '</div>';
            }
            dataHtml += '</div>';

            let popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#131419';
            popup.style.border = '1px solid #98a7e9';
            popup.style.padding = isMobile ? '10px 10px 10px' : '20px 20px 20px';
            popup.style.borderRadius = '10px';
            popup.style.zIndex = '10000';
            popup.style.maxWidth = '90%';
            popup.style.maxHeight = '90%';
            popup.style.overflowX = 'auto';
            popup.style.overflowY = 'auto';
            popup.style.whiteSpace = 'nowrap';
            popup.innerHTML = dataHtml;

            const newElement = document.createElement('div');
            newElement.textContent = `${EPH.toFixed(1)} EPH`;
            newElement.style.position = 'absolute';
            newElement.style.top = '0';
            newElement.style.left = '50%';
            newElement.style.transform = 'translateX(-50%)';
            newElement.style.height = isMobile ? '10px' : '20px';
            newElement.style.minWidth = isMobile ? '80px' : '160px';
            newElement.style.display = 'flex';
            newElement.style.alignItems = 'center';
            newElement.style.justifyContent = 'center';
            newElement.style.backgroundColor = '#4357af';
            newElement.style.borderRadius = '0 0 5px 5px';
            newElement.style.fontSize = isMobile ? '8px' : '16px';
            newElement.style.color = 'white';
            newElement.style.fontWeight = 'bold';
            newElement.style.lineHeight = '1';
            newElement.style.zIndex = '1';

            let closeButton = document.createElement('button');
            closeButton.textContent = '❎️';
            closeButton.style.position = 'sticky';
            closeButton.style.bottom = '0';
            closeButton.style.display = 'block';
            closeButton.style.margin = '5px auto 0 auto';
            closeButton.style.backgroundColor = '#4357af';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.padding = isMobile ? '5px 10px' : '10px 20px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = isMobile ? '12px' : '14px';
            closeButton.onclick = function() {
                document.body.removeChild(popup);
            };
            popup.appendChild(newElement);
            popup.appendChild(closeButton);
            document.body.appendChild(popup);
        });

        var lastTab = tabsContainer.children[tabsContainer.children.length - 1];
        tabsContainer.insertBefore(battlePlayerLootButton, lastTab.nextSibling);

        var style = document.createElement('style');
        style.innerHTML = `
			.Button_battlePlayerLoot__custom {
				background-color: #db5454;
				color: white;
				border-radius: 5px;
				padding: 5px 10px;
				cursor: pointer;
				transition: background-color 0.3s ease;
			}
			.Button_battlePlayerLoot__custom:hover {
				background-color: #ff6b6b;
			}
		`;
        document.head.appendChild(style);
    }

    GM_registerMenuCommand('Print all chest data', function() {
        console.log('Chest drop list:', formattedChestDropData);
    });

    function createWindowBase() {
        let windowDiv = document.createElement('div');
        windowDiv.className = 'visualization-window';
        windowDiv.style.position = 'fixed';
        windowDiv.style.top = '50%';
        windowDiv.style.left = '50%';
        windowDiv.style.transform = 'translate(-50%, -50%)';
        windowDiv.style.minWidth = '300px';
        windowDiv.style.maxWidth = 'min(400px, 90vw)';
        windowDiv.style.maxHeight = '80vh';
        windowDiv.style.backgroundColor = '#131419';
        windowDiv.style.border = '1px solid #98a7e9';
        windowDiv.style.borderRadius = '10px';
        windowDiv.style.zIndex = '10000';
        windowDiv.style.padding = '20px';
        windowDiv.style.boxSizing = 'border-box';
        windowDiv.style.display = 'flex';
        windowDiv.style.flexDirection = 'column';
        windowDiv.style.gap = '15px';
        windowDiv.style.color = '#ffffff';
        windowDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        windowDiv.style.overflow = 'hidden';
        return windowDiv;
    }

    function createVisualizationWindow(chestData) {
        let oldWindow = document.querySelector('.visualization-window');
        if (oldWindow) oldWindow.remove();

        let windowDiv = createWindowBase();
        windowDiv.style.minHeight = '300px';
        windowDiv.style.maxWidth = '400px';

        let title = document.createElement('h1');
        title.innerText = 'Select Character';
        title.style.color = '#98a7e9';
        title.style.margin = '0';
        title.style.fontSize = '1.5em';
        title.style.textAlign = 'center';
        windowDiv.appendChild(title);

        let contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';
        contentDiv.style.overflowY = 'auto';
        contentDiv.style.paddingRight = '8px';
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '10px';

        for (let playerID in chestData) {
            const playerData = chestData[playerID];
            const playerName = playerData.玩家昵称;

            let playerBox = document.createElement('div');
            playerBox.style.display = 'flex';
            playerBox.style.alignItems = 'center';
            playerBox.style.border = '1px solid #98a7e9';
            playerBox.style.borderRadius = '8px';
            playerBox.style.padding = '12px';
            playerBox.style.cursor = 'pointer';
            playerBox.style.backgroundColor = '#1e1e2f';
            playerBox.style.transition = 'all 0.3s ease';

            playerBox.onmouseenter = () => {
                playerBox.style.backgroundColor = '#2c2e45';
                playerBox.style.transform = 'translateX(5px)';
            };
            playerBox.onmouseleave = () => {
                playerBox.style.backgroundColor = '#1e1e2f';
                playerBox.style.transform = 'none';
            };

            playerBox.onclick = () => showChestList(playerID, playerName, playerData.开箱数据);

            let playerText = document.createElement('span');
            playerText.style.flex = '1';
            playerText.style.fontSize = '1.1em';
            playerText.style.color = '#ffffff';
            playerText.textContent = playerName;

            let deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.width = '24px';
            deleteButton.style.height = '24px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Do you want to delete all [${playerName}] data?`)) {
                    deletePlayerChestData(playerID);
                    createVisualizationWindow(JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data);
                }
            };

            playerBox.appendChild(playerText);
            playerBox.appendChild(deleteButton);
            contentDiv.appendChild(playerBox);
        }

        windowDiv.appendChild(contentDiv);

        let closeButton = document.createElement('button');
        closeButton.textContent = '❎️';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = '#4357af';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => document.body.removeChild(windowDiv);

        windowDiv.appendChild(closeButton);
        document.body.appendChild(windowDiv);
    }

    function deletePlayerChestData(playerID) {
        let edibleToolsData = JSON.parse(localStorage.getItem('Edible_Tools'));
        if (edibleToolsData && edibleToolsData.Chest_Open_Data) {
            delete edibleToolsData.Chest_Open_Data[playerID];
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleToolsData));
        }
    }

    function showChestList(playerID, playerName, chestData) {
        let oldWindow = document.querySelector('.visualization-window');
        if (oldWindow) oldWindow.remove();

        let windowDiv = createWindowBase();
        windowDiv.style.minHeight = '300px';
        windowDiv.style.maxWidth = '400px';

        let title = document.createElement('h1');
        title.innerText = 'Chest Records';
        title.style.color = '#98a7e9';
        title.style.margin = '0';
        title.style.fontSize = '1.5em';
        title.style.textAlign = 'center';
        windowDiv.appendChild(title);

        let contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';
        contentDiv.style.overflowY = 'auto';
        contentDiv.style.paddingRight = '8px';
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '10px';

        for (let chestName in chestData) {
            let chest = chestData[chestName];

            let chestBox = document.createElement('div');
            chestBox.style.display = 'flex';
            chestBox.style.alignItems = 'center';
            chestBox.style.border = '1px solid #98a7e9';
            chestBox.style.borderRadius = '8px';
            chestBox.style.padding = '12px';
            chestBox.style.cursor = 'pointer';
            chestBox.style.backgroundColor = '#1e1e2f';
            chestBox.style.transition = 'all 0.3s ease';

            chestBox.onmouseenter = () => {
                chestBox.style.backgroundColor = '#2c2e45';
                chestBox.style.transform = 'translateX(5px)';
            };
            chestBox.onmouseleave = () => {
                chestBox.style.backgroundColor = '#1e1e2f';
                chestBox.style.transform = 'none';
            };

            chestBox.onclick = () => showChestDetails(playerID, playerName, chestName, chest);

            let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('width', '20');
            svgIcon.setAttribute('height', '20');
            svgIcon.style.marginRight = '12px';
            svgIcon.style.flexShrink = '0';

            let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            try {
                let iconId = item_name_to_hrid[chestName].split('/').pop();
                useElement.setAttribute('href', `${item_icon_url}#${iconId}`);
            } catch (error) {
                useElement.setAttribute('href', `${item_icon_url}#coin`);
            }
            svgIcon.appendChild(useElement);

            let chestText = document.createElement('span');
            chestText.style.flex = '1';
            chestText.style.fontSize = '0.95em';
            chestText.innerHTML = `
                <div style="color: #98a7e9;">${chestName}</div>
                <div style="color: #ffffff; font-size: 1.1em;">${chest['总计开箱数量']}</div>
            `;

            let deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.width = '24px';
            deleteButton.style.height = '24px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`Delete ${chestName} data?`)) {
                    deleteChestData(playerID, chestName);
                    showChestList(playerID, playerName, JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data[playerID].开箱数据);
                }
            };

            chestBox.appendChild(svgIcon);
            chestBox.appendChild(chestText);
            chestBox.appendChild(deleteButton);
            contentDiv.appendChild(chestBox);
        }

        windowDiv.appendChild(contentDiv);

        let footerDiv = document.createElement('div');
        footerDiv.style.display = 'flex';
        footerDiv.style.gap = '10px';
        footerDiv.style.marginTop = '10px';

        const buttonStyle = {
            flex: '1',
            backgroundColor: '#4357af',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '0.95em'
        };

        let backButton = document.createElement('button');
        Object.assign(backButton.style, buttonStyle);
        backButton.innerText = '⬅️';
        backButton.onclick = () => {
            windowDiv.remove();
            createVisualizationWindow(JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data);
        };

        let closeButton = document.createElement('button');
        Object.assign(closeButton.style, buttonStyle);
        closeButton.innerText = '❎️';
        closeButton.onclick = () => windowDiv.remove();

        footerDiv.appendChild(backButton);
        footerDiv.appendChild(closeButton);
        windowDiv.appendChild(footerDiv);

        document.body.appendChild(windowDiv);
    }

    function deleteChestData(playerID, chestName) {
        let edibleToolsData = JSON.parse(localStorage.getItem('Edible_Tools'));
        if (edibleToolsData && edibleToolsData.Chest_Open_Data && edibleToolsData.Chest_Open_Data[playerID]) {
            delete edibleToolsData.Chest_Open_Data[playerID].开箱数据[chestName];
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleToolsData));
        }
    }

    function showChestDetails(playerID, playerName, chestName, chestData) {
        let oldWindow = document.querySelector('.visualization-window');
        if (oldWindow) oldWindow.remove();

        let detailsWindow = createWindowBase();
        detailsWindow.style.minWidth = '300px';
        detailsWindow.style.maxWidth = '400px';

        let title = document.createElement('div');
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.justifyContent = 'center';
        title.style.gap = '10px';
        title.style.margin = '0 0 15px 0';

        let titleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        titleSvg.setAttribute('width', '28');
        titleSvg.setAttribute('height', '28');

        let iconId = item_name_to_hrid[chestName].split('/').pop();
        titleSvg.innerHTML = `<use href="${item_icon_url}#${iconId}"/>`;

        let titleText = document.createElement('span');
        titleText.style.color = '#98a7e9';
        titleText.style.fontSize = '1.4em';
        titleText.textContent = chestName;

        title.appendChild(titleSvg);
        title.appendChild(titleText);
        detailsWindow.appendChild(title);

        let contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';
        contentDiv.style.overflowY = 'auto';
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '12px';
        contentDiv.style.paddingRight = '8px';

        let statsCard = document.createElement('div');
        statsCard.style.backgroundColor = '#1e1e2f';
        statsCard.style.borderRadius = '8px';
        statsCard.style.padding = '15px';
		statsCard.innerHTML = `
			<div style="color: #98a7e9; margin-bottom: 10px;">📋 Statistics Overview</div>
			<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
				<div>Total Open</div>
				<div style="color: #ffffff; text-align: right;">${chestData['总计开箱数量']}</div>
				<div>Total Ask</div>
				<div style="color: #4CAF50; text-align: right;">${formatPrice(chestData['总计开箱Ask'])}</div>
				<div>Total Bid</div>
				<div style="color: orange; text-align: right;">${formatPrice(chestData['总计开箱Bid'])}</div>
				<div>${chestData['累计偏差值'] < 0 ? "Below Expectation" : "Above Expectation"}</div>
				<div style="color: ${chestData['累计偏差值'] < 0 ? '#F44336' : '#4CAF50'}; text-align: right;">${formatPrice(Math.abs(chestData['累计偏差值'] || 0))}</div>
				${chestData['总计最高利润'] !== undefined ? `
					<div>Expected Profit</div>
					<div style="color: ${
						(chestData['总计最低利润'] > 0 && chestData['总计最高利润'] > 0) ? '#4CAF50' :
						(chestData['总计最低利润'] < 0 && chestData['总计最高利润'] < 0) ? '#F44336' :
						'#FFEB3B'
					}; text-align: right;">
						${formatPrice(chestData['总计最低利润'])}～${formatPrice(chestData['总计最高利润'])}
					</div>
				` : ''}
			</div>
		`;
        contentDiv.appendChild(statsCard);

        let itemListHeader = document.createElement('div');
        itemListHeader.style.color = '#98a7e9';
        itemListHeader.innerText = "🎁 Get Item";
        contentDiv.appendChild(itemListHeader);

        const sortedItems = Object.entries(chestData['获得物品']).sort((a, b) => {
            const getValidValue = (val) => val === -1 ? 0 : val;

            const aAsk = getValidValue(a[1]['总计Ask价值']);
            const aBid = getValidValue(a[1]['总计Bid价值']);
            const bAsk = getValidValue(b[1]['总计Ask价值']);
            const bBid = getValidValue(b[1]['总计Bid价值']);

            return (bAsk + bBid) - (aAsk + aBid);
        });

        sortedItems.forEach(([itemName, item]) => {
            let itemBox = document.createElement('div');

            itemBox.style.display = 'flex';
            itemBox.style.alignItems = 'center';
            itemBox.style.backgroundColor = '#1e1e2f';
            itemBox.style.border = '1px solid #98a7e9';
            itemBox.style.borderRadius = '8px';
            itemBox.style.padding = '12px';
            itemBox.style.gap = '10px';

            let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('width', '24');
            svgIcon.setAttribute('height', '24');

            let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            try {
                let iconId = item_name_to_hrid[itemName].split('/').pop();
                useElement.setAttribute('href', `${item_icon_url}#${iconId}`);
            } catch (error) {
                useElement.setAttribute('href', `${item_icon_url}#coin`);
            }
            svgIcon.appendChild(useElement);

            let itemText = document.createElement('div');
            itemText.style.flex = '1';
            itemText.innerHTML = `
            <div style="color: #ffffff;">${itemName}</div>
            <div style="color: #98a7e9; font-size: 0.9em;">Count: ${formatPrice(item['数量'])}</div>
        `;

            itemBox.appendChild(svgIcon);
            itemBox.appendChild(itemText);
            contentDiv.appendChild(itemBox);
        });

        detailsWindow.appendChild(contentDiv);

        let footerDiv = document.createElement('div');
        footerDiv.style.display = 'flex';
        footerDiv.style.gap = '10px';
        footerDiv.style.marginTop = '10px';

        const buttonStyle = {
            flex: '1',
            backgroundColor: '#4357af',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
        };

        let backButton = document.createElement('button');
        Object.assign(backButton.style, buttonStyle);
        backButton.innerText = '⬅️';
        backButton.onclick = () => {
            detailsWindow.remove();
            showChestList(playerID, playerName, JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data[playerID].开箱数据);
        };

        let closeButton = document.createElement('button');
        Object.assign(closeButton.style, buttonStyle);
        closeButton.innerText = '❎️';
        closeButton.onclick = () => detailsWindow.remove();

        footerDiv.appendChild(backButton);
        footerDiv.appendChild(closeButton);
        detailsWindow.appendChild(footerDiv);

        document.body.appendChild(detailsWindow);
    }

    GM_registerMenuCommand('Print all chest data', function() {
        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        const openChestData = edibleTools.Chest_Open_Data || {};
        createVisualizationWindow(openChestData);
    });

    GM_registerMenuCommand('Print chest drop list', function() {
        let dataHtml = '<div style="display: flex; flex-wrap: nowrap;">';
        const minPrice = 10000;
        for (let player in battlePlayerLoot) {
            let totalPrice = 0;
            dataHtml += `<div style="flex: 1 0 auto; min-width: 100px; margin: 10px; padding: 10px; border: 1px solid black;">`;
            dataHtml += `<h3>${player}</h3>`;

            let lootItems = battlePlayerLoot[player];
            for (let item in lootItems) {
                let bidPrice = getSpecialItemPrice(item,"bid") || 0;
                totalPrice += bidPrice*lootItems[item].数量
                if (bidPrice > minPrice) {
                    dataHtml += `<p>${item}: ${lootItems[item].数量}</p>`;
                }
            }
            if (totalPrice > 0) {
                dataHtml += `<p>Total price: ${formatPrice(totalPrice)}</p>`;
            }
            dataHtml += '</div>';
        }
        dataHtml += '</div>';

        let popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '10px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '75%';
        popup.style.overflowX = 'auto';
        popup.style.whiteSpace = 'nowrap';
        popup.innerHTML = dataHtml;

        let closeButton = document.createElement('button');
        closeButton.textContent = '❎️';
        closeButton.style.display = 'block';
        closeButton.style.margin = '20px auto 0 auto';
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    });

    function formatToChinesetime(timestamp) {
        const date = new Date(timestamp);
        const beijingOffset = 8 * 60;
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + beijingOffset);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    function openSettings() {
        const tran_market_list = {
            "/market_listing_status/filled": "Filled",
            "/market_listing_status/active": "Active",
            "/market_listing_status/cancelled": "Cancelled",
            "/market_listing_status/expired": "Expired",
        };
        const market_List_Data = JSON.parse(GM_getValue('market_list', '[]'));
        const hrid2name = item_hrid_to_name;

        market_List_Data.forEach(item => {
            item.itemName = hrid2name[item.itemHrid] || item.itemHrid;
            if (item.lastUpdated) {
                item.format_lastUpdated = formatToChinesetime(item.lastUpdated);
            }
        });

        const settingsContainer = document.createElement('div');
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.top = '0';
        settingsContainer.style.left = '0';
        settingsContainer.style.width = '100%';
        settingsContainer.style.height = '100%';
        settingsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        settingsContainer.style.zIndex = '9999';
        settingsContainer.style.display = 'flex';
        settingsContainer.style.flexDirection = 'column';

        const Edible_Tools_HTML = `
            <div style="flex: 1; overflow-y: auto; background-color: #131419; padding: 20px;">
                <header style="background-color: #2c2e45; color: rgb(255, 255, 255); padding: 10px 20px; text-align: center;">
                    <h1>MilkyWay Database</h1>
                </header>
                <div style="display: flex; flex: 1; color: rgb(255, 255, 255);">
                    <div style="width: 200px; background-color: rgba(238, 238, 238, 0); padding: 10px;">
                        <button id="showMarketDataBtn" style="width: 100%; padding: 10px; margin: 5px 0; background-color: #26273a; color: white; border: none; border-radius: 5px;">Market Data</button>
                        <button id="showOpenChestDataBtn" style="width: 100%; padding: 10px; margin: 5px 0; background-color: #26273a; color: white; border: none; border-radius: 5px;">Chest Data</button>
                        <button id="showEnhancementDataBtn" style="width: 100%; padding: 10px; margin: 5px 0; background-color: #26273a; color: white; border: none; border-radius: 5px;">Enhancement Data</button>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto; display: block;" id="showMarketDataPage">
                        <h2 style="text-align: center;">Market Data</h2>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <button id="deleteOldDataBtn" style="padding: 10px 20px; margin: 0 10px; background-color: #4357af; color: white; border: none; border-radius: 5px;">Delete outdated market data</button>
                            <button id="deleteSpecificStatusDataBtn" style="padding: 10px 20px; margin: 0 10px; background-color: #4357af; color: white; border: none; border-radius: 5px;">Keep only compeleted orders</button>
                        </div>
                        <table class="marketList-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th data-sort="id">ID</th>
                                    <th data-sort="characterID">Character ID</th>
                                    <th data-sort="status">Status</th>
                                    <th data-sort="isSell">Type</th>
                                    <th data-sort="itemName">Item</th>
                                    <th data-sort="orderQuantity">Order qty</th>
                                    <th data-sort="filledQuantity">Filled qty</th>
                                    <th data-sort="price">Price</th>
                                    <th data-sort="total">Total</th>
                                    <th data-sort="format_lastUpdated">Last update</th>
                                    <th>Cancel</th>
                                </tr>
                            </thead>
                            <tbody id="marketDataTableBody">
                            </tbody>
                        </table>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto; display: none;" id="OpenChestDataPage">
                        <h2 style="text-align: center;">Chest Data</h2>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto; display: none;" id="EnhancementDataPage">
                        <h2 style="text-align: center;">Enhancement Data</h2>
                    </div>
                </div>
            </div>
            <button id="closeSettingsBtn" style="position: absolute; top: 30px; right: 30px; padding: 5px 10px; background-color: #4357af; color: white; border: none; border-radius: 5px;">❎️</button>
            `;
        settingsContainer.innerHTML = Edible_Tools_HTML;
        document.body.appendChild(settingsContainer);

        const marketDataPage = document.getElementById('showMarketDataPage');
        const OpenChestDataPage = document.getElementById('OpenChestDataPage');
        const EnhancementDataPage = document.getElementById('EnhancementDataPage');

        let currentPage = 1;
        let rowsPerPage = 10;

        function showMarketData() {
            marketDataPage.style.display = 'block';
            OpenChestDataPage.style.display = 'none';
            EnhancementDataPage.style.display = 'none';

            const tableBody = document.getElementById('marketDataTableBody');
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const paginatedData = market_List_Data.slice(startIndex, endIndex);

            tableBody.innerHTML = paginatedData.map((row, index) => {

                let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgIcon.setAttribute('width', '20');
                svgIcon.setAttribute('height', '20');
                svgIcon.style.marginRight = '10px';
                svgIcon.style.verticalAlign = 'middle';

                let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                try {
                    let iconId = row.itemHrid.split('/').pop();
                    useElement.setAttribute('href', `${item_icon_url}#${iconId}`);
                } catch (error) {
                    console.error(`Unable to find item icon ID:`, error);
                    useElement.setAttribute('href', `${item_icon_url}#coin`);
                }
                svgIcon.appendChild(useElement);

                let translatedName = row.itemName;
                if (row.enhancementLevel > 0) {
                    translatedName = `${translatedName} +${row.enhancementLevel}`;
                }
                let itemNameWithIcon = `${svgIcon.outerHTML}${translatedName}`;

                const globalIndex = startIndex + index;
                return `
                <tr data-index="${globalIndex}">
                    <td>${row.id}</td>
                    <td>${row.characterID}</td>
                    <td>${tran_market_list[row.status] || row.status}</td>
                    <td>${row.isSell ? 'Sell' : 'Buy'}</td>
                    <td>${itemNameWithIcon}</td>
                    <td>${(row.orderQuantity).toLocaleString()}</td>
                    <td>${(row.filledQuantity).toLocaleString()}</td>
                    <td>${(row.price).toLocaleString()}</td>
                    <td>${(row.price * row.filledQuantity).toLocaleString()}</td>
                    <td>${row.format_lastUpdated}</td>
                    <td><button class="delete-btn">Delete</button></td>
                </tr>
                `;
            }).join('');

            updatePaginationControls();
            attachDeleteListeners();
        }

        const paginationControls = document.createElement('div');
        paginationControls.style.textAlign = 'center';
        paginationControls.style.marginTop = '20px';
        paginationControls.innerHTML = `
            <button id="prevPageBtn" style="padding: 5px 10px; margin: 0 5px;">Prev</button>
            <span id="currentPageDisplay">Page ${currentPage}</span>
            <button id="nextPageBtn" style="padding: 5px 10px; margin: 0 5px;">Next</button>
            <label style="margin-left: 10px;">
                Display per page
                <input id="rowsPerPageInput" type="number" value="${rowsPerPage}" min="1" style="width: 50px; text-align: center;">
                OK
            </label>
        `;

        marketDataPage.appendChild(paginationControls);

        function updatePaginationControls() {
            const totalPages = Math.ceil(market_List_Data.length / rowsPerPage);
            document.getElementById('currentPageDisplay').textContent = `Page ${currentPage} / ${totalPages}`;

            document.getElementById('prevPageBtn').disabled = currentPage === 1;
            document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
        }

        document.getElementById('prevPageBtn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showMarketData();
            }
        });

        document.getElementById('nextPageBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(market_List_Data.length / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                showMarketData();
            }
        });

        document.getElementById('rowsPerPageInput').addEventListener('change', (event) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            if (newRowsPerPage > 0) {
                rowsPerPage = newRowsPerPage;
                currentPage = 1;
                showMarketData();
            }
        });
        function ShowOpenChestData() {
            marketDataPage.style.display = 'none';
            OpenChestDataPage.style.display = 'block';
            EnhancementDataPage.style.display = 'none';
        }

        function ShowEnhancementData() {
            marketDataPage.style.display = 'none';
            OpenChestDataPage.style.display = 'none';
            EnhancementDataPage.style.display = 'block';
        }

        showMarketData();

        function attachDeleteListeners() {
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const row = event.target.closest('tr');
                    const index = parseInt(row.getAttribute('data-index'), 10);
                    market_List_Data.splice(index, 1);

                    GM_setValue('market_list', JSON.stringify(market_List_Data));
                    showMarketData();
                });
            });
        }

        attachDeleteListeners();

        let sortOrder = { field: null, direction: 1 };

        function sortTable(column) {
            const field = column.getAttribute('data-sort');
            const direction = sortOrder.field === field && sortOrder.direction === 1 ? -1 : 1;

            market_List_Data.sort((a, b) => {
                if (field === 'total') {
                    return (a.price * a.filledQuantity - b.price * b.filledQuantity) * direction;
                }
                if (typeof a[field] === 'string') {
                    return (a[field].localeCompare(b[field])) * direction;
                }
                return (a[field] - b[field]) * direction;
            });

            document.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });
            column.classList.add(direction === 1 ? 'sort-asc' : 'sort-desc');

            sortOrder = { field, direction };

            showMarketData();
            attachDeleteListeners();
        }

        document.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                sortTable(th);
            });
        });

        document.getElementById('showMarketDataBtn').addEventListener('click', showMarketData);
        document.getElementById('showOpenChestDataBtn').addEventListener('click', ShowOpenChestData);
        document.getElementById('showEnhancementDataBtn').addEventListener('click', ShowEnhancementData);

        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            document.body.removeChild(settingsContainer);
        });

        document.getElementById('deleteOldDataBtn').addEventListener('click', () => {
            const userInput = prompt("Please enter the date before which you want to delete (format: YYYY-MM-DD)", "");

            if (!userInput) return;

            const userDate = new Date(userInput);

            if (isNaN(userDate)) {
                alert("Invalid date format, please use YYYY-MM-DD");
                return;
            }

            let market_list = JSON.parse(GM_getValue('market_list', '[]'));

            const filteredMarketList = market_list.filter(order => {
                const orderDate = new Date(order.lastUpdated);
                return orderDate >= userDate;
            });

            GM_setValue('market_list', JSON.stringify(filteredMarketList));

            alert("Deleted successfully");
            document.body.removeChild(settingsContainer);
        });

        document.getElementById('deleteSpecificStatusDataBtn').addEventListener('click', () => {
            let market_list = JSON.parse(GM_getValue('market_list', '[]'));
            const statusToDelete = ["/market_listing_status/active","/market_listing_status/cancelled","/market_listing_status/expired"];
            const deleteCount = market_list.filter(order => statusToDelete.includes(order.status)).length;

            if (deleteCount === 0) {
                alert("There is no data to delete.");
                return;
            }

            const isConfirmed = confirm(`${deleteCount} records will be deleted. Do you want to continue?`);
            if (!isConfirmed) {
                return;
            }

            const filteredMarketList = market_list.filter(order => !statusToDelete.includes(order.status));

            GM_setValue('market_list', JSON.stringify(filteredMarketList));

            alert("Deleted successfully");

            document.body.removeChild(settingsContainer);
        });

        const style = document.createElement('style');
        style.innerHTML = `
    .marketList-table {
        width: 100%;
        border-collapse: collapse;
    }

    .marketList-table, .marketList-table th, .marketList-table td {
        border: 1px solid #26273a;
    }

    .marketList-table th, .marketList-table td {
        padding: 10px;
        text-align: center;
    }

    .marketList-table th {
        background-color: #26273a;
        cursor: pointer;
    }

    .marketList-table th.sort-asc::after {
        content: ' ▲';
    }

    .marketList-table th.sort-desc::after {
        content: ' ▼';
    }
    `;
        document.head.appendChild(style);
    }

})();