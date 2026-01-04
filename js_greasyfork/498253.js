// ==UserScript==
// @name         [银河奶牛]箱子期望显示
// @namespace    http://tampermonkey.net/
// @version      0.27
// @description  银河奶牛箱子期望显示
// @author       Truth_Light
// @license      Truth_Light
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @downloadURL https://update.greasyfork.org/scripts/498253/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%AE%B1%E5%AD%90%E6%9C%9F%E6%9C%9B%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/498253/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E7%AE%B1%E5%AD%90%E6%9C%9F%E6%9C%9B%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const itemSelector = '.ItemDictionary_drop__24I5f';
    const iconSelector = '.Icon_icon__2LtL_ use';
    const chestNameSelector = '#root > div > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.ItemDictionary_modalContent__WvEBY > div.ItemDictionary_itemAndDescription__28_he > div.Item_itemContainer__x7kH1 > div > div > div > div > svg > use';
    const resultDisplaySelector = '.ItemDictionary_openToLoot__1krnv';
    const marketDataStr = localStorage.getItem('MWITools_marketAPI_json');
    const marketData = JSON.parse(marketDataStr);
    let timer = null;
    let chestList = {};

    function getSpecialItemPrice(itemName, priceType) {
        if (marketDataStr && marketData) {
            if (marketData.market && marketData.market[itemName]) {
                const itemPrice = marketData.market[itemName][priceType];
                if (itemPrice !== undefined && itemPrice !== -1) {
                    return itemPrice;
                }
            }
        }
        console.error(`未找到物品 ${itemName} 的 ${priceType} 价格信息`);
        return null; // 或者返回默认值，视情况而定
    }

    let specialItemPrices = {
        'Coin': { ask: 1, bid: 1 }, // 默认的特殊物品价值，包括ask和bid价值
        'Cowbell': {
            ask: getSpecialItemPrice('Bag Of 10 Cowbells', 'ask')/10,
            bid: getSpecialItemPrice('Bag Of 10 Cowbells', 'bid')/10
        },
        'Chimerical Token': {
            ask: getSpecialItemPrice('Chimerical Essence', 'ask'),
            bid: getSpecialItemPrice('Chimerical Essence', 'bid')
        },
        'Sinister Token': {
            ask: getSpecialItemPrice('Sinister Essence', 'ask'),
            bid: getSpecialItemPrice('Sinister Essence', 'bid')
        },
        'Enchanted Token': {
            ask: getSpecialItemPrice('Enchanted Essence', 'ask'),
            bid: getSpecialItemPrice('Enchanted Essence', 'bid')
        },
    };

    function processItems() {
        const modalContainer = document.querySelector(".Modal_modalContainer__3B80m");
        if (!modalContainer) return; // 如果不存在 Modal_modalContainer__3B80m 元素，则直接返回

        const chestNameElem = document.querySelector(chestNameSelector);
        if (!chestNameElem) return;

        const chestName = getItemNameFromElement(chestNameElem);

        const items = document.querySelectorAll(itemSelector);

        const itemDataList = [];
        let totalAskValue = 0;
        let totalBidValue = 0;

        items.forEach(item => {
            const quantityRangeElem = item.querySelector('div:first-child');
            const quantityRangeText = quantityRangeElem.textContent.trim();
            const quantityRange = parseQuantityRange(quantityRangeText);

            const itemName = getItemNameFromElement(item.querySelector(iconSelector));

            let probabilityElem = item.querySelector('div:nth-child(3)');//提取物品的概率
            let probabilityText = probabilityElem ? probabilityElem.textContent.trim() : '';
            probabilityText = probabilityText.replace('~', '');

            let probability;
            if (probabilityText === '') {
                probability = 1.0; // 如果概率文本为空，则假定掉落率为100%
            } else {
                probability = parseProbability(probabilityText);
            }

            let expectedOutput = 0;
            if (quantityRange.min === quantityRange.max) {
                expectedOutput = quantityRange.min * probability;
            } else {
                const average = (quantityRange.min + quantityRange.max) / 2;
                expectedOutput = average * probability;
            }

            let { ask: itemAskValue, bid: itemBidValue, priceColor } = getItemPrice(itemName);

            const itemTotalAskValue = expectedOutput * itemAskValue;
            const itemTotalBidValue = expectedOutput * itemBidValue;

            totalAskValue += itemTotalAskValue;
            totalBidValue += itemTotalBidValue;

            const itemData = {
                itemName,
                quantityRange: `${quantityRange.min}-${quantityRange.max}`,
                probability: probability * 100,
                expectedOutput: expectedOutput.toFixed(2),
                itemAskValue,
                itemBidValue,
                itemTotalAskValue: itemTotalAskValue.toFixed(2),
                itemTotalBidValue: itemTotalBidValue.toFixed(2),
                priceColor
            };

            itemDataList.push(itemData);

            const itemNameElem = item.querySelector('.Item_name__2C42x');
            if (itemNameElem) {
                if (priceColor) {
                    itemNameElem.style.color = priceColor;
                }
            }

        });

        if (itemDataList.length > 0) {
            chestList[chestName] = {
                items: itemDataList,
                totalAskValue: totalAskValue.toFixed(2),
                totalBidValue: totalBidValue.toFixed(2)
            };
            saveChestList();
            displayResult(document.body, totalAskValue, totalBidValue);
        }
    }

    function saveChestList() {
        localStorage.setItem('chestList', JSON.stringify(chestList));
    }

    function loadChestList() {
        const savedChestList = localStorage.getItem('chestList');
        chestList = savedChestList ? JSON.parse(savedChestList) : {};
    }

    function getItemNameFromElement(element) {
        const itemNameRaw = element.getAttribute('href').split('#').pop();
        return formatItemName(itemNameRaw);
    }

    function getItemPrice(itemName) {
        let itemAskValue = 0;
        let itemBidValue = 0;
        let priceColor = '#E7E7E7';

        if (chestList[itemName]) {
            // 如果是箱子，直接使用chestList中的价格信息
            itemAskValue = chestList[itemName].totalAskValue;
            itemBidValue = chestList[itemName].totalBidValue;
        } else {
            if (specialItemPrices[itemName]) {
                itemAskValue = specialItemPrices[itemName].ask;
                itemBidValue = specialItemPrices[itemName].bid;
            } else {
                if (marketDataStr) {
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
            }
        }

        return { ask: itemAskValue, bid: itemBidValue, priceColor };
    }

    function formatItemName(itemNameRaw) {
        let formattedName = itemNameRaw.replace('#', '').replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());

        if (formattedName.includes(' ')) {
            const words = formattedName.split(' ');
            let firstWord = words[0];
            const restOfName = words.slice(1).join(' ');
            if (firstWord.endsWith('s') && !firstWord.endsWith("'s")) {
                firstWord = `${firstWord.slice(0, -1)}'${firstWord.slice(-1)}`;
            }
            formattedName = `${firstWord}${restOfName ? " " + restOfName : ""}`;
        }

        return formattedName;
    }

    function parseQuantityRange(rangeText) {
        const parts = rangeText.split('-').map(str => parseInt(str.trim().replace(',', ''), 10));
        if (parts.length === 1) {
            return { min: parts[0], max: parts[0] };
        } else {
            return { min: parts[0], max: parts[1] };
        }
    }

    function parseProbability(probabilityText) {
        const probPercentage = parseFloat(probabilityText.replace('%', ''));
        return probPercentage / 100;
    }

    function formatPrice(value) {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        } else {
            return value.toString();
        }
    }

    function displayResult(container, totalExpectedOutputASK, totalExpectedOutputBID) {
        const formattedASK = formatPrice(totalExpectedOutputASK);
        const formattedBID = formatPrice(totalExpectedOutputBID);

        const dropListContainer = container.querySelector(resultDisplaySelector);

        // 继续执行其他操作
        const previousResults = dropListContainer.querySelectorAll('.resultDiv');
        previousResults.forEach(result => result.remove());

        // 创建期望产出（最低买入价计算）元素
        const minPriceOutput = document.createElement('div');
        minPriceOutput.className = 'resultDiv';
        minPriceOutput.textContent = `期望产出 (最低买入价计算): ${formattedASK}`;
        minPriceOutput.style.color = 'gold';
        minPriceOutput.style.fontSize = '14px';
        minPriceOutput.style.fontWeight = '400';
        minPriceOutput.style.paddingTop = '10px';

        // 创建期望产出（最高收购价计算）元素
        const maxPriceOutput = document.createElement('div');
        maxPriceOutput.className = 'resultDiv';
        maxPriceOutput.textContent = `期望产出 (最高收购价计算): ${formattedBID}`;
        maxPriceOutput.style.color = 'gold';
        maxPriceOutput.style.fontSize = '14px';
        maxPriceOutput.style.fontWeight = '400';
        maxPriceOutput.style.paddingTop = '10px';

        // 插入新创建的元素到掉落物表的最后一个物品后面
        dropListContainer.appendChild(minPriceOutput);
        dropListContainer.appendChild(maxPriceOutput);
    }

    // 初始化时加载已保存的箱子列表
    loadChestList();
    console.log(chestList);
    // 初始化


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
                            processItems();

                            // 开始监听箱子图标的变化
                            startIconObserver();
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
                processItems();
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

})();
