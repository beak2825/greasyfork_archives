// ==UserScript==
// @name         奶牛宝箱钥匙价格速算助手
// @namespace    http://tampermonkey.net/
// @version      1.22
// @description  1
// @author       Stella
// @license      Stella
// @match        https://www.milkywayidle.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/501521/%E5%A5%B6%E7%89%9B%E5%AE%9D%E7%AE%B1%E9%92%A5%E5%8C%99%E4%BB%B7%E6%A0%BC%E9%80%9F%E7%AE%97%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/501521/%E5%A5%B6%E7%89%9B%E5%AE%9D%E7%AE%B1%E9%92%A5%E5%8C%99%E4%BB%B7%E6%A0%BC%E9%80%9F%E7%AE%97%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const MARKET_API_URL =
    'https://raw.githubusercontent.com/holychikenz/MWIApi/main/medianmarket.json';

  const keyBundles = {
    奇幻宝箱钥匙: [
      {name: 'Chimerical Essence', quantity: 600, probability: 1},
      {name: 'Chimerical Essence', quantity: 3000, probability: 0.05},
      {name: 'Crippling Slash', quantity: 1.5, probability: 0.5},
      {name: 'Pestilent Shot', quantity: 1.5, probability: 0.5},
      {name: 'Manticore Sting', quantity: 1, probability: 0.3},
      {name: 'Griffin Leather', quantity: 1, probability: 0.5},
      {name: 'Jackalope Antler', quantity: 1, probability: 0.4},
      {name: 'Dodocamel Plume', quantity: 1, probability: 0.1},
      {name: 'Chimerical Key', quantity: 1, probability: 0.02},
    ],
    邪恶宝箱钥匙: [
      {name: 'Sinister Essence', quantity: 600, probability: 1},
      {name: 'Sinister Essence', quantity: 3000, probability: 0.05},
      {name: 'Penetrating Strike', quantity: 1.5, probability: 0.5},
      {name: 'Pestilent Shot', quantity: 1.5, probability: 0.5},
      {name: 'Smoke Burst', quantity: 1.5, probability: 0.5},
      {name: "Acrobat's Ribbon", quantity: 1, probability: 0.2},
      {name: "Magician's Cloth", quantity: 1, probability: 0.2},
      {name: 'Chaotic Chain', quantity: 1, probability: 0.1},
      {name: 'Cursed Ball', quantity: 1, probability: 0.1},
      {name: 'Sinister Key', quantity: 1, probability: 0.02},
    ],
    秘法宝箱钥匙: [
      {name: 'Enchanted Essence', quantity: 600, probability: 1},
      {name: 'Enchanted Essence', quantity: 3000, probability: 0.05},
      {name: 'Crippling Slash', quantity: 1.5, probability: 0.5},
      {name: 'Penetrating Shot', quantity: 1.5, probability: 0.5},
      {name: 'Mana Spring', quantity: 1.5, probability: 0.5},
      {name: "Knight's Ingot", quantity: 1, probability: 0.2},
      {name: "Bishop's Scroll", quantity: 1, probability: 0.2},
      {name: 'Royal Cloth', quantity: 1, probability: 0.2},
      {name: 'Regal Jewel', quantity: 1, probability: 0.1},
      {name: 'Sundering Jewel', quantity: 1, probability: 0.1},
      {name: 'Enchanted Key', quantity: 1, probability: 0.02},
    ],
  };

  const materialsList = {
    太阳石碎片: [
      { itemHrid: '/items/Sunstone', quantity: 1, name: '太阳石' },
    ],
    奇幻宝箱钥匙: [
      { itemHrid: '/items/blue_key_fragment', quantity: 1, name: '蓝色宝箱钥匙碎片' },
      { itemHrid: '/items/green_key_fragment', quantity: 1, name: '绿色宝箱钥匙碎片' },
      { itemHrid: '/items/purple_key_fragment', quantity: 1, name: '紫色宝箱钥匙碎片' },
      { itemHrid: '/items/brown_key_fragment', quantity: 1, name: '棕色宝箱钥匙碎片' },

    ],
    邪恶宝箱钥匙: [
      { itemHrid: '/items/purple_key_fragment', quantity: 1, name: '紫色宝箱钥匙碎片' },
      { itemHrid: '/items/orange_key_fragment', quantity: 1, name: '橙色宝箱钥匙碎片' },
      { itemHrid: '/items/brown_key_fragment', quantity: 1, name: '棕色宝箱钥匙碎片' },
      { itemHrid: '/items/dark_key_fragment', quantity:1, name: '黑暗宝箱钥匙碎片' },
  
    ],
    秘法宝箱钥匙: [
      { itemHrid: '/items/white_key_fragment', quantity: 1, name: '白色宝箱钥匙碎片' },
      { itemHrid: '/items/orange_key_fragment', quantity: 1, name: '橙色宝箱钥匙碎片' },
      { itemHrid: '/items/stone_key_fragment', quantity: 1, name: '石头宝箱钥匙碎片' },
      { itemHrid: '/items/burning_key_fragment', quantity: 1, name: '石头宝箱钥匙碎片' },
  
    ],
  };

  let socketInstance = null;

  const OriginalWebSocket = unsafeWindow.WebSocket;
  const ProxyWebSocket = function (url, protocols) {
    const instance = new OriginalWebSocket(url, protocols);
    instance.addEventListener('message', async (event) => {
      handleOrderReturn(JSON.parse(event.data));
    });
    socketInstance = instance;
    return instance;
  };
  unsafeWindow.WebSocket = ProxyWebSocket;

  const tooltipObserver = new MutationObserver(async (mutations) => {
    for (const mutation of mutations) {
      for (const added of mutation.addedNodes) {
        if (added.classList && added.classList.contains('MuiTooltip-popper')) {
          if (added.querySelector('div.ItemTooltipText_name__2JAHA')) {
            handleTooltipItem(added);
          }
        }
      }
    }
  });

  function sendOrderPriceRequest(itemHrid) {
    const params = {
      type: 'get_market_item_order_books',
      getMarketItemOrderBooksData: {
        itemHrid
      }
    };
    socketInstance.send(JSON.stringify(params));
  }

  let currentWatcher = {
    itemHrid: '',
    quantity: 0,
    resolve: null
  };

  function handleOrderReturn(msgData) {
    const curItemHrid = currentWatcher.itemHrid;
    const msgType = msgData.type;
    if (!curItemHrid || msgType !== 'market_item_order_books_updated') return false;
    const msgItemHrid = msgData.marketItemOrderBooks.itemHrid;
    if (msgItemHrid === curItemHrid) {
      const asksPrice = msgData.marketItemOrderBooks.orderBooks[0]?.asks[0].price;
      currentWatcher.resolve(currentWatcher.quantity * asksPrice);
      currentWatcher = {
        itemHrid: '',
        quantity: 0,
        resolve: null
      };
    }
  }

  function getItemPricefromWs(material) {
    sendOrderPriceRequest(material.itemHrid);
    return new Promise((resolve) => {
      currentWatcher = {
        itemHrid: material.itemHrid,
        quantity: material.quantity,
        resolve
      };
    });
  }

  async function calculateMaterialPrice(materialsList) {
    return new Promise((resolve) => {
      materialsList.reduce((pre, cur) => {
        return pre.then((total) => {
          if (typeof cur === 'object') {
            return getItemPricefromWs(cur).then((price) => {
              return price + total;
            });
          }
          return Promise.resolve(total + cur);
        });
      }, Promise.resolve(0)).then((total) => {
        resolve(total);
      });
    });
  }

  tooltipObserver.observe(document.body, {
    attributes: false,
    childList: true,
    characterData: false,
  });

  async function handleTooltipItem(tooltip) {
    const itemNameElems = tooltip.querySelectorAll(
      'div.ItemTooltipText_name__2JAHA span'
    );

    if (itemNameElems.length > 0) {
      const itemNameElem = itemNameElems[0];
      const itemName = itemNameElem.textContent;
      console.log(itemName);

      // Calculate total material price
      const curMaterialsList = materialsList[itemName];
      if (curMaterialsList) {
        const total = await calculateMaterialPrice(curMaterialsList);
        console.log(total, '总价'); // Output total price to console

        // Create and append material price element
        const materialPriceElem = document.createElement('span');
        materialPriceElem.style.color = 'red'; // Optional: set the color of the material price text
        const realTimeCost = (total / 1_000_000).toFixed(1);
        const realTimeCostUsingTea = (total*0.9 / 1_000_000).toFixed(1);
        materialPriceElem.innerHTML = ` <br>实时成本: ${realTimeCost}M,<br> 实时成本（工匠茶）: ${realTimeCostUsingTea}M `;
        itemNameElem.parentNode.insertBefore(
          materialPriceElem,
          itemNameElem.nextSibling
        );
      }

      // Check if the item name is in the keyBundles
    /*  if (keyBundles[itemName]) {
        // Fetch item prices from the JSON file
        const prices = await fetchMarketJSON();
        if (prices) {
          // Calculate total bundle price
          const totalBundlePrice = calculateTotalBundlePrice(
            prices,
            keyBundles[itemName]
          );
          if (totalBundlePrice !== null) {
            // Create and append bundle price element
            const bundlePriceElem = document.createElement('span');
            bundlePriceElem.style.color = 'yellow'; // Optional: set the color of the bundle price text
            bundlePriceElem.textContent = ` - 预期收益: ${totalBundlePrice}M`;

            // Insert the bundle price element after the item name
            itemNameElem.parentNode.insertBefore(
              bundlePriceElem,
              itemNameElem.nextSibling
            );
          }
        }
      }*/
    }
  }

  function calculateTotalBundlePrice(prices, bundleItems) {
    let total = 0;
    for (const item of bundleItems) {
      if (prices.market[item.name]) {
        total +=
          prices.market[item.name].bid * item.quantity * item.probability;
      } else {
        console.warn(`Price for ${item.name} not found`);
        return null;
      }
    }
    return (total / 1_000_000).toFixed(1);
  }

  async function fetchMarketJSON(forceFetch = false) {
    if (
      !forceFetch &&
      localStorage.getItem('MWITools_marketAPI_timestamp') &&
      Date.now() - localStorage.getItem('MWITools_marketAPI_timestamp') < 900000
    ) {
      return JSON.parse(localStorage.getItem('MWITools_marketAPI_json'));
    }

    console.log('Fetching market data from GitHub...');
    let jsonStr = await new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        url: MARKET_API_URL,
        method: 'GET',
        timeout: 5000,
        onload: (response) => {
          if (response.status == 200) {
            console.log('Successfully fetched market data from GitHub');
            resolve(response.responseText);
          } else {
            console.error(
              `Failed to fetch market data from GitHub, HTTP status ${response.status}`
            );
            resolve(null);
          }
        },
        onabort: () => {
          console.error('Request aborted while fetching market data');
          resolve(null);
        },
        onerror: () => {
          console.error('Error occurred while fetching market data');
          resolve(null);
        },
        ontimeout: () => {
          console.error('Request timed out while fetching market data');
          resolve(null);
        },
      });
    });

    if (!jsonStr) {
      console.error('Failed to fetch market data from GitHub');
      return null;
    }

    try {
      const jsonObj = JSON.parse(jsonStr);
      if (jsonObj && jsonObj.time && jsonObj.market) {
        localStorage.setItem(
          'MWITools_marketAPI_timestamp',
          Date.now().toString()
        );
        localStorage.setItem('MWITools_marketAPI_json', JSON.stringify(jsonObj));
        return jsonObj;
      } else {
        console.error('Invalid market data format');
        return null;
      }
    } catch (error) {
      console.error('Failed to parse market data JSON', error);
      return null;
    }
  }
})();
