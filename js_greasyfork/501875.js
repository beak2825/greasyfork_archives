// ==UserScript==
// @name         [银河奶牛]食用工具
// @namespace    http://tampermonkey.net/
// @version      0.397
// @description  开箱记录、箱子期望、离线统计、公会钉钉
// @author       Truth_Light
// @license      Truth_Light
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/501875/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%A3%9F%E7%94%A8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/501875/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%A3%9F%E7%94%A8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    const itemSelector = '.ItemDictionary_drop__24I5f';
    const iconSelector = '.Icon_icon__2LtL_ use';
    const chestNameSelector = '#root > div > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.ItemDictionary_modalContent__WvEBY > div.ItemDictionary_itemAndDescription__28_he > div.Item_itemContainer__x7kH1 > div > div > div > div > svg > use';
    const MARKET_API_URL = "https://raw.githubusercontent.com/holychikenz/MWIApi/main/medianmarket.json";
    let marketData = null;
    let timer = null;
    let formattedChestDropData = {};
    let battlePlayerFood = {};

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
                        console.log('从API获取到的数据:', data);
                        resolve(data);
                    } else {
                        console.error('获取数据失败。状态码:', response.status);
                        reject(new Error('数据获取失败'));
                    }
                },
                ontimeout: function() {
                    console.error('请求超时：超过5秒未能获取到数据');
                    reject(new Error('请求超时'));
                },
                onerror: function(error) {
                    console.error('获取数据时发生错误:', error);
                    reject(error);
                }
            });
        });
    }

    try {
        // 尝试从 API 获取数据
        marketData = await fetchMarketData();
    } catch (error) {
        console.error('从 API 获取数据失败，尝试从本地存储获取数据。', error);

        // 从本地存储获取数据
        const marketDataStr = localStorage.getItem('MWITools_marketAPI_json');
        marketData = JSON.parse(marketDataStr);

        if (!marketData) {
            alert('无法获取 market 数据');
        } else {
            console.log('从本地存储获取到的数据:', marketData);
        }
    }

    function getSpecialItemPrice(itemName,priceType) {
        if (marketData?.market?.[itemName]) {
            const itemPrice = marketData.market[itemName][priceType];
            if (itemPrice !== undefined && itemPrice !== -1) {
                return itemPrice;
            }
        }
        console.error(`未找到物品 ${itemName} 的 ${priceType} 价格信息`);
        return null;
    }

    let specialItemPrices = {
        'Coin': { ask: 1, bid: 1 }, // 默认的特殊物品价值，包括 ask 和 bid 价值
        'Cowbell': {
            ask: getSpecialItemPrice('Bag Of 10 Cowbells', 'ask') / 10 || 30000,
            bid: getSpecialItemPrice('Bag Of 10 Cowbells', 'bid') / 10 || 25000
        },
        'Chimerical Token': {
            ask: getSpecialItemPrice('Chimerical Essence', 'ask') || 1300,
            bid: getSpecialItemPrice('Chimerical Essence', 'bid') || 1100
        },
        'Sinister Token': {
            ask: getSpecialItemPrice('Sinister Essence', 'ask') || 1400,
            bid: getSpecialItemPrice('Sinister Essence', 'bid') || 1200
        },
        'Enchanted Token': {
            ask: getSpecialItemPrice('Enchanted Essence', 'ask') || 3900,
            bid: getSpecialItemPrice('Enchanted Essence', 'bid') || 3500
        },
    };

    function getItemNameFromElement(element) {
        const itemNameRaw = element.getAttribute('href').split('#').pop();
        return formatItemName(itemNameRaw);
    }

    function getItemPrice(itemName) {
        let itemAskValue = 0;
        let itemBidValue = 0;
        let priceColor = '#E7E7E7';

        if (marketData) {
            try {
                if (marketData && marketData.market && marketData.market[itemName]) {
                    itemAskValue = marketData.market[itemName].ask;
                    itemBidValue = marketData.market[itemName].bid;

                    if (itemAskValue === -1 && itemBidValue === -1) {
                        priceColor = 'yellow';
                    } else if (itemAskValue === -1) {
                        priceColor = '#D95961';
                    } else if (itemBidValue === -1) {
                        priceColor = '#2FC4A7';
                    }

                    if (itemAskValue === -1 && itemBidValue !== -1) {
                        itemAskValue = itemBidValue;
                    }
                } else {
                    console.error(`未找到物品 ${itemName} 的价格信息`);
                    priceColor = 'yellow';
                }

            } catch (error) {
                console.error(`解析 MWITools_marketAPI_json 数据时出错:`, error);
            }
        } else {
            console.error('未找到 MWITools_marketAPI_json 的本地存储数据');
        }



        return { ask: itemAskValue, bid: itemBidValue, priceColor };
    }

    function formatItemName(itemNameRaw) {
        let formattedName = itemNameRaw.replace('#', '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

        const specialStrings = {
            'Artisans': 'Artisan\'s',
        };

        const blacklist = [
            'Swiftness Coffee',
        ];

        if (blacklist.includes(formattedName)) {
            return formattedName.split(' ').map(word => specialStrings[word] || word).join(' ');
        }

        if (formattedName.includes(' ')) {
            const words = formattedName.split(' ');
            let firstWord = words[0];
            const restOfName = words.slice(1).join(' ');

            if (firstWord.endsWith('s') && !firstWord.endsWith("'s")) {
                firstWord = `${firstWord.slice(0, -1)}'${firstWord.slice(-1)}`;
            }
            formattedName = `${firstWord}${restOfName ? " " + restOfName : ""}`;
        }

        return formattedName.split(' ').map(word => specialStrings[word] || word).join(' ');
    }


    function formatPrice(value) {
        const isNegative = value < 0;
        value = Math.abs(value);

        if (value >= 1000000) {
            return (isNegative ? '-' : '') + (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (isNegative ? '-' : '') + (value / 1000).toFixed(1) + 'K';
        } else {
            return (isNegative ? '-' : '') + value.toFixed(1);
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

        // 从本地存储读取数据
        let edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        edibleTools.Chest_Open_Data = edibleTools.Chest_Open_Data || {};

        let chestOpenData = edibleTools.Chest_Open_Data;
        const chestDropData = edibleTools.Chest_Drop_Data;

        const chestNameElement = modalElement.querySelector("div.Modal_modal__1Jiep > div.Inventory_modalContent__3ObSx > div.Item_itemContainer__x7kH1 > div > div > div.Item_iconContainer__5z7j4 > div > svg > use");
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

            //显示
            const openChestElement = document.querySelector('.Inventory_modalContent__3ObSx');

            const displayElement = document.createElement('div');
            displayElement.classList.add('ChestStatistics'); // 自定义类名，用于样式控制
            displayElement.style.position = 'absolute';
            displayElement.style.left = `${openChestElement.offsetLeft}px`;
            displayElement.style.top = `${openChestElement.offsetTop}px`;
            displayElement.style.fontSize = '12px';
            displayElement.innerHTML = `
            总计开箱次数:<br>
            ${chestData["总计开箱数量"]}<br>
            本次开箱价值:<br>
            ${formatPrice(totalAskValue)}/${formatPrice(totalBidValue)}<br>
            总计开箱价值:<br>
            ${formatPrice(chestData["总计开箱Ask"])}/${formatPrice(chestData["总计开箱Bid"])}<br>
        `;

            const expectedOutputElement = document.createElement('div');
            expectedOutputElement.classList.add('ExpectedOutput');
            expectedOutputElement.style.position = 'absolute';
            expectedOutputElement.style.left = `${openChestElement.offsetLeft}px`;
            expectedOutputElement.style.bottom = `${openChestElement.offsetTop}px`;
            expectedOutputElement.style.fontSize = '12px';
            expectedOutputElement.innerHTML = `
            预计产出价值:<br>
            ${formatPrice(chestDropData[chestName]["期望产出Ask"]*chestCount)}/${formatPrice(chestDropData[chestName]["期望产出Bid"]*chestCount)}<br>
        `;

            openChestElement.appendChild(displayElement);
            openChestElement.appendChild(expectedOutputElement);

            // 保存更新的数据到本地存储
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

                // 获取价格
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

        console.log(totalAskValue);
        return { totalAskValue, totalBidValue };
    }



    function OfflineStatistics(modalElement) {
        const itemsContainer = modalElement.querySelectorAll(".OfflineProgressModal_itemList__26h-Y");

        let timeContainer = null;
        let getItemContainer = null;
        let spendItemContainer = null;


        itemsContainer.forEach(container => {
            const labelElement = container.querySelector('.OfflineProgressModal_label__2HwFG');
            if (labelElement) {
                const textContent = labelElement.textContent.trim();
                if (textContent.startsWith("You were offline for") || textContent.startsWith("你离线了")) {
                    timeContainer = container;
                } else if (textContent.startsWith("Items gained:") || textContent.startsWith("获得物品:")) {
                    getItemContainer = container;
                } else if (textContent.startsWith("You consumed:") || textContent.startsWith("你消耗了:")) {
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
            newElement.textContent = `利润:[${formatPrice(getitemtotalBidValue - spenditemtotalAskValue)}/${formatPrice((getitemtotalBidValue - spenditemtotalAskValue) / (TotalSec / 3600) * 24)}]/天`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            timeContainer.querySelector(':first-child').appendChild(newElement);
        }
        if (getItemContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `产出:[${formatPrice(getitemtotalAskValue)}/${formatPrice(getitemtotalBidValue)}]`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            getItemContainer.querySelector(':first-child').appendChild(newElement);
        }
        if (spendItemContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `成本:[${formatPrice(spenditemtotalAskValue)}/${formatPrice(spenditemtotalBidValue)}]`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            spendItemContainer.querySelector(':first-child').appendChild(newElement);
        }
    }


    function initObserver() {
        // 选择要观察的目标节点
        const targetNode = document.body;

        // 观察器的配置（需要观察子节点的变化）
        const config = { childList: true, subtree: true };

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 监听到子节点变化
                    mutation.addedNodes.forEach(addedNode => {
                        // 检查是否是我们关注的 Modal_modalContainer__3B80m 元素被添加
                        if (addedNode.classList && addedNode.classList.contains('Modal_modalContainer__3B80m')) {
                            // Modal_modalContainer__3B80m 元素被添加，执行处理函数
                            //
                            //processItems();
                            ShowChestPrice();
                            recordChestOpening(addedNode);

                            // 开始监听箱子图标的变化
                            startIconObserver();
                        }
                        if (addedNode.classList && addedNode.classList.contains('OfflineProgressModal_modalContainer__knnk7')) {
                            OfflineStatistics(addedNode);
                            console.log("离线报告已创建!")
                        }
                    });

                    mutation.removedNodes.forEach(removedNode => {
                        // 检查是否是 Modal_modalContainer__3B80m 元素被移除
                        if (removedNode.classList && removedNode.classList.contains('Modal_modalContainer__3B80m')) {
                            // Modal_modalContainer__3B80m 元素被移除，停止监听箱子图标的变化
                            stopIconObserver();
                        }
                    });
                }
            }
        });

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);

        // 定义箱子图标变化的观察器
        let iconObserver = null;

        // 开始监听箱子图标的变化
        function startIconObserver() {
            const chestNameElem = document.querySelector(chestNameSelector);
            if (!chestNameElem) return;

            // 创建一个观察器实例来监听图标的变化
            iconObserver = new MutationObserver(() => {
                // 当箱子图标变化时，执行处理函数
                //processItems();
                ShowChestPrice();
            });

            // 配置观察器的选项
            const iconConfig = { attributes: true, attributeFilter: ['href'] };

            // 以上述配置开始观察箱子图标节点
            iconObserver.observe(chestNameElem, iconConfig);
        }

        // 停止监听箱子图标的变化
        function stopIconObserver() {
            if (iconObserver) {
                iconObserver.disconnect();
                iconObserver = null;
            }
        }
    }




    initObserver();


    //公会部分代码
    const userLanguage = navigator.language || navigator.userLanguage;
    const isZH = userLanguage.startsWith("zh");
    const updataDealy = 24*60*60*1000; //数据更新时限
    let rateXPDayMap = {};

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
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }



    //奶牛钉钉
    function handleMessage(message) {
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "new_battle") {
                processCombatConsumables(obj);
            }
            if (obj && obj.type === "init_client_data") {
                processAndPrintData(obj,marketData);
            }
            if (obj && obj.type === "guild_updated") {
                const Guild_ID = obj.guild.id;
                const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                edibleTools.Guild_Data = edibleTools.Guild_Data || {};
                let storedData = edibleTools.Guild_Data || {};

                // 判断是否已经存在旧数据
                if (storedData[Guild_ID] && storedData[Guild_ID].guild_updated && storedData[Guild_ID].guild_updated.old.updatedAt) {
                    const oldUpdatedAt = new Date(storedData[Guild_ID].guild_updated.new.updatedAt);
                    const newUpdatedAt = new Date(obj.guild.updatedAt);

                    // 计算时间差（单位：毫秒）
                    const timeDifference = newUpdatedAt - oldUpdatedAt;

                    if (timeDifference >= updataDealy) {
                        // 更新老数据为新数据
                        storedData[Guild_ID].guild_updated.old = storedData[Guild_ID].guild_updated.new;
                        // 更新新数据为当前数据
                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    } else {
                        // 仅更新新数据
                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    }
                    //计算Δ
                    const Delta = {
                        Delta_Xp: storedData[Guild_ID].guild_updated.new.experience - storedData[Guild_ID].guild_updated.old.experience,
                        Delta_Level: storedData[Guild_ID].guild_updated.new.level - storedData[Guild_ID].guild_updated.old.level,
                        Delta_Time: (newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000, // 转换为秒
                        Rate_XP_Hours: (3600*(obj.guild.experience - storedData[Guild_ID].guild_updated.old.experience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000)).toFixed(2)
                    };
                    storedData[Guild_ID].guild_updated.Delta = Delta;

                    const Guild_TotalXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[1];
                    if (Guild_TotalXp_div) {
                        const xpText = isZH ? "经验值 / 小时" : "XP / Hour";

                        Guild_TotalXp_div.insertAdjacentHTML(
                            "afterend",
                            `<div>${formatPrice(Delta.Rate_XP_Hours)} ${xpText}</div>`
                        );
                        const Guild_NeedXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2];
                        if (Guild_NeedXp_div) {
                            const Guild_NeedXp = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2].textContent.replace(/,/g, '');
                            const Time = TimeReset(Guild_NeedXp/Delta.Rate_XP_Hours);
                            Guild_NeedXp_div.insertAdjacentHTML(
                                "afterend", // 使用 "afterend" 在元素的后面插入内容
                                `<div>${Time}</div>`
                        );
                        }
                    }
                } else {
                    // 如果没有旧数据，则直接添加新数据
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

                // 存储更新后的数据到 localStorage
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
                            const oldUpdatedAt = storedData[Guild_ID].guild_player[name].old.updatedAt
                            const timeDifference = newUpdatedAt - oldUpdatedAt
                            if (timeDifference >= updataDealy) {
                                // 更新老数据为新数据
                                storedData[Guild_ID].guild_player[name].old = storedData[Guild_ID].guild_player[name].new;
                                // 更新新数据为当前数据
                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            } else {
                                // 仅更新新数据
                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            }
                            //计算Δ
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
                //console.log("测试数据",storedData);
                //console.log("guild_characters_updated", obj);
                updateExperienceDisplay(rateXPDayMap);
                edibleTools.Guild_Data = storedData;
                localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
            }




        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }


    function TimeReset(hours) {
        const totalMinutes = hours * 60;
        const days = Math.floor(totalMinutes / (24 * 60));
        const yudays = totalMinutes % (24 * 60);
        const hrs = Math.floor(yudays / 60);
        const minutes = Math.floor(yudays % 60);
        const dtext = isZH ? "天" : "d";
        const htext = isZH ? "时" : "h";
        const mtext = isZH ? "分" : "m";
        return `${days}${dtext} ${hrs}${htext} ${minutes}${mtext}`;
    }

    function updateExperienceDisplay(rateXPDayMap) {
        const trElements = document.querySelectorAll(".GuildPanel_membersTable__1NwIX tbody tr");
        const idleuser_list = [];
        const dtext = isZH ? "天" : "d";

        // 将 rateXPDayMap 转换为数组并排序
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

                        // 计算颜色
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
            console.error('公会标语元素未找到！');
            return;
        }
        const clonedElement = targetElement.cloneNode(true);

        const namesText = idleuser_list.join(', ');
        clonedElement.innerHTML = '';
        clonedElement.textContent = isZH ? `闲置的成员：${namesText}` : `Idle User : ${namesText}`;
        clonedElement.style.color = '#ffcc00';

        // 设置复制元素的高度为原元素的25%
        const originalStyle = window.getComputedStyle(targetElement);
        const originalHeight = originalStyle.height;
        const originalMinHeight = originalStyle.minHeight;
        clonedElement.style.height = `25%`;
        clonedElement.style.minHeight = `25%`; // 也设置最小高度
        targetElement.parentElement.appendChild(clonedElement);
    }


    hookWS();


    //箱子数据获取
    function processAndPrintData(obj) {
        let formattedShopData = {};

        // 处理商店数据
        for (let [key, details] of Object.entries(obj.shopItemDetailMap)) {
            const { itemHrid, costs } = details;
            const itemName = formatItemName(itemHrid.split('/').pop());

            costs.forEach(cost => {
                const costItemName = formatItemName(cost.itemHrid.split('/').pop());

                if (costItemName === "Coin") return;

                const costCount = cost.count;

                if (!formattedShopData[costItemName]) {
                    formattedShopData[costItemName] = { items: {}, 最挣钱: '', BID单价: 0 };
                }

                // 计算每种代币购买每个物品的收益
                let bidValue = marketData?.market?.[itemName]?.bid || 0;
                let profit = bidValue / costCount;

                formattedShopData[costItemName].items[itemName] = {
                    花费: costCount
                };

                // 更新最赚钱的物品信息
                if (profit > formattedShopData[costItemName].BID单价) {
                    formattedShopData[costItemName].最挣钱 = itemName;
                    formattedShopData[costItemName].BID单价 = profit;
                    specialItemPrices[costItemName].ask = profit;
                    specialItemPrices[costItemName].bid = profit;
                }
            });
        }
        const mostProfitableItems = Object.values(formattedShopData).map(item => item.最挣钱).filter(Boolean);
        console.log(mostProfitableItems)
        // 处理箱子掉落物数据

        for (let iteration = 0; iteration < 4; iteration++) {
            for (let [key, items] of Object.entries(obj.openableLootDropMap)) {
                const boxName = formatItemName(key.split('/').pop());

                if (!formattedChestDropData[boxName]) {
                    formattedChestDropData[boxName] = { item: {} };
                }
                let TotalAsk = 0;
                let TotalBid = 0;
                let awa = 0;
                items.forEach(item => {
                    const { itemHrid, dropRate, minCount, maxCount } = item;
                    const itemName = formatItemName(itemHrid.split('/').pop());
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
                        // 如果物品已存在，更新期望掉落和相关价格
                        const existingItem = formattedChestDropData[boxName].item[itemName];
                        existingItem.期望掉落 += expectedYield;
                    } else if (iteration === 0) {
                        formattedChestDropData[boxName].item[itemName] = {
                            期望掉落: expectedYield,
                        };
                    }

                    // 判断 itemName 是否在最挣钱物品列表中，并执行相应代码
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

                    // 累计总价
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
        let edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        edibleTools.Chest_Drop_Data = formattedChestDropData;
        localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
        // 打印结果
        //console.log("特殊物品价格表:",specialItemPrices)
        //console.log("箱子掉落物列表:", formattedChestDropData);
        //console.log("地牢商店列表:", formattedShopData);
    }

    function ShowChestPrice() {
        const modalContainer = document.querySelector(".Modal_modalContainer__3B80m");
        if (!modalContainer) return; // 如果不存在 Modal_modalContainer__3B80m 元素，则直接返回

        const chestNameElem = document.querySelector(chestNameSelector);
        if (!chestNameElem) return;

        const chestName = getItemNameFromElement(chestNameElem);
        const items = document.querySelectorAll(itemSelector);

        const dropListContainer = document.querySelector('.ItemDictionary_openToLoot__1krnv');
        if (!dropListContainer) return; // 检查 dropListContainer 是否存在

        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools'))
        const formattedChestDropData = edibleTools.Chest_Drop_Data;

        items.forEach(item => {
            const itemName = getItemNameFromElement(item.querySelector(iconSelector));
            if (!itemName) return; // 检查 itemName 是否存在

            const itemData = formattedChestDropData[chestName].item[itemName];
            if (!itemData) return; // 检查 itemData 是否存在

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

            const minPriceOutput = createPriceOutput('期望产出 (最低买入价计算)', askPrice);
            const maxPriceOutput = createPriceOutput('期望产出 (最高收购价计算)', bidPrice);

            dropListContainer.appendChild(minPriceOutput);
            dropListContainer.appendChild(maxPriceOutput);
        }
    }

    function processCombatConsumables(obj) {
        obj.players.forEach(player => {
            battlePlayerFood[player.character.name] = {};
            player.combatConsumables.forEach(consumable => {
                const itemname = formatItemName(consumable.itemHrid.split('/').pop());
                battlePlayerFood[player.character.name][itemname] = consumable.count;
            });
        });
    }


    GM_registerMenuCommand('打印所有箱子掉落物', function() {
        console.log('箱子掉落物列表:', formattedChestDropData);
    });

    GM_registerMenuCommand('打印全部开箱记录', function() {
        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        const openChestData = edibleTools.Chest_Open_Data || {};
        console.log('开箱记录:', openChestData);
    });

    GM_registerMenuCommand('打印玩家吃喝数量', function() {
        console.log('玩家吃喝数量:', battlePlayerFood);

        let dataHtml = '<div style="display: flex; flex-wrap: nowrap;">';
        for (let player in battlePlayerFood) {
            dataHtml += `
            <div style="flex: 1 0 auto; min-width: 100px; margin: 10px; padding: 10px; border: 1px solid black;">
                <h3>${player}</h3>
        `;
            let consumables = battlePlayerFood[player];
            for (let item in consumables) {
                dataHtml += `<p>${item}: ${consumables[item]}</p>`;
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
        closeButton.textContent = '关闭';
        closeButton.style.display = 'block';
        closeButton.style.margin = '20px auto 0 auto';
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);


        document.body.appendChild(popup);
    });
})();