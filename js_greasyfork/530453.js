// ==UserScript==
// @name         Bushiroad Store 小助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  在Bushiroad商店页面(collection/product)和商品列表(page)显示商品的实际库存数量，并取消隐藏未开售商品的“添加到购物车”按钮
// @author       Sakuraumi
// @match        https://bushiroad-store.com/products/*
// @match        https://bushiroad-store.com/collections/*
// @match        https://bushiroad-store.com/pages/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530453/Bushiroad%20Store%20%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/530453/Bushiroad%20Store%20%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;

    // 检查当前网址并执行不同的代码
    if (currentUrl.includes('bushiroad-store.com/products/') || currentUrl.includes('bushiroad-store.com/collections/')) {
        run_collection_or_product();
    } else if (currentUrl.includes('bushiroad-store.com/pages/')) {
        run_page();
    }


    function run_collection_or_product() {
            // 解析JSON数据
    let scriptTags = document.getElementsByTagName('script');
    let jsonData = null;
    // 寻找包含数据的 <script> 标签
    for (let script of scriptTags) {
        if (script.textContent.includes('"inventory_quantity"')) {
            // 找到包含数据的 <script> 标签
            let jsonString = script.textContent.trim();
            let startIndex = jsonString.indexOf('{');
            let endIndex = jsonString.lastIndexOf('}') + 1;
            let jsonContent = jsonString.substring(startIndex, endIndex);

            // 解析JSON数据
            try {
                jsonData = JSON.parse(jsonContent);
                // console.log("success parse target.")
                console.log(jsonData);
                break;
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        }
    }

    // 提取并显示库存数量
    if (jsonData && jsonData.inventories) {
        // console.log("found inventories key.")
        for (let inventoryId in jsonData.inventories) {
            let inventory = jsonData.inventories[inventoryId];
            let inventoryQuantity = inventory.inventory_quantity;

            console.log(inventoryQuantity);
            let productElement_high = document.querySelector('.product-form__inventory.inventory.inventory--high');
            let productElement_low = document.querySelector('.product-form__inventory.inventory.inventory--low');
            let productElement_none = document.querySelector('.product-form__inventory.inventory');

            if (productElement_high) {
                let p = document.createElement('p');
                p.textContent = `剩余数量: ${inventoryQuantity}`;
                productElement_high.appendChild(p);
            }
            else if (productElement_low) {
                let p = document.createElement('p');
                p.textContent = `剩余数量: ${inventoryQuantity}`;
                productElement_low.appendChild(p);
            }
            else if (productElement_none) {
                let p = document.createElement('p');
                p.textContent = `剩余数量: ${inventoryQuantity}`;
                productElement_none.appendChild(p);
            }
        }
    }

    let element_add_to_cart_button = document.querySelector('.product-form__payment-container');
    if (element_add_to_cart_button) {
        element_add_to_cart_button.removeAttribute('hidden');
    }
    }

    function run_page() {
    // 获取所有商品单元
    const productItems = document.querySelectorAll('.product-item__info');

    // 获取所有商品页面的链接
    const urls = Array.from(productItems).map(item => {
        const link = item.querySelector('.product-item__title');
        if (link) {
            const url = link.getAttribute('href');
            return window.location.origin + url;
        }
        return null;
    }).filter(url => url !== null);

    // 异步请求并显示库存信息
    async function fetchAndDisplayInventory() {
        // 请求每个 URL，请求完成后立刻显示
        for (let i = 0; i < urls.length; i++) {
            try {
                const inventoryQuantity = await fetchInventoryData(urls[i]);
                if (inventoryQuantity !== null) {
                    // 在对应的商品单元中添加库存数量
                    addInventoryToPage(productItems[i], inventoryQuantity);
                }
            } catch (error) {
                console.error("请求失败：", error);
            }
        }
    }

    // 启动异步获取库存
    fetchAndDisplayInventory();

    /**
     * 发送请求并获取商品的库存数量
     * @param {string} url 商品的页面链接
     * @returns {Promise<number|null>} 返回库存数量，或者null如果没有找到
     */
    async function fetchInventoryData(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    const html = response.responseText;
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(html, 'text/html');

                    // 查找库存数量
                    const inventoryQuantity = findInventoryQuantity(doc);
                    resolve(inventoryQuantity);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * 从商品页面的HTML中查找库存数量
     * @param {Document} doc 解析后的商品页面HTML
     * @returns {number|null} 返回库存数量，或者null如果没有找到
     */
    function findInventoryQuantity(doc) {
        const scriptTags = doc.getElementsByTagName('script');
        let jsonData = null;

        // 寻找包含数据的 <script> 标签
        for (let script of scriptTags) {
            if (script.textContent.includes('"inventory_quantity"')) {
                let jsonString = script.textContent.trim();
                let startIndex = jsonString.indexOf('{');
                let endIndex = jsonString.lastIndexOf('}') + 1;
                let jsonContent = jsonString.substring(startIndex, endIndex);

                // 解析JSON数据
                try {
                    jsonData = JSON.parse(jsonContent);

                    // 遍历 inventories 并获取库存数量
                    if (jsonData && jsonData.inventories) {
                        for (let inventoryId in jsonData.inventories) {
                            let inventory = jsonData.inventories[inventoryId];
                            let inventoryQuantity = inventory.inventory_quantity;
                            if (inventoryQuantity !== undefined) {
                                return inventoryQuantity;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            }
        }
        return null;
    }

    /**
     * 在商品单元中添加库存数量的显示
     * @param {Element} item 商品单元的DOM元素
     * @param {number} inventoryQuantity 库存数量
     */
    function addInventoryToPage(item, inventoryQuantity) {
        const saleText = item.querySelector('.product__show-text-sale');
        if (!saleText) return;

        // 创建一个新的<p>标签显示库存数量
        const inventoryText = document.createElement('p');
        inventoryText.classList.add('inventory-quantity');
        inventoryText.textContent = `剩余庫存：${inventoryQuantity} 件`;

        // 插入到商品单元中的预约信息后面
        saleText.insertAdjacentElement('afterend', inventoryText);
    }
    }

})();
