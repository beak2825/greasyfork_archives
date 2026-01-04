// ==UserScript==
// @name         Alibaba阿里巴巴国际站-小朱笔记
// @namespace    https://www.zhudc.com/
// @version      1.1
// @description  1、在阿里巴巴国际站打开产品详情页，显示产品详情页中三个关键词。2、新旧版关键词搜索结果页显示产品排名与产品ID信息
// @author       小朱笔记
// @match        https://www.alibaba.com/product-detail/*
// @match        https://www.alibaba.com/trade/search*
// @match        https://www.alibaba.com//trade/search*
// @license      MTT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467404/Alibaba%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99-%E5%B0%8F%E6%9C%B1%E7%AC%94%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/467404/Alibaba%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99-%E5%B0%8F%E6%9C%B1%E7%AC%94%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Alibaba阿里国际站详情页显示关键词
    let keywords = document.querySelector('meta[name="keywords"]');
    if (keywords) {
        let keywordsContent = keywords.getAttribute('content');
        let regex = /Buy\s(.*)\sProduct on/g;
        let match = regex.exec(keywordsContent);
        if (match && match[1]) {
            let specificKeywords = match[1];
            let keywordsArray = specificKeywords.split(',');
            for (let i = 0; i < keywordsArray.length; i++) {
                let keyword = keywordsArray[i];
                let keywordsElement = document.createElement('div');
                keywordsElement.innerText = `Keyword ${i + 1}: ${keyword}`;
                keywordsElement.style.fontSize = '15px';
                keywordsElement.style.color = 'red';
                let productTitle = document.querySelector('.product-title');
                if (productTitle) {
                    productTitle.parentNode.insertBefore(keywordsElement, productTitle.nextSibling);
                }
            }
        }
    }
})();


(function() {
    'use strict';

    //新版阿里国际站搜索结果信息
    // Get all product elements on the page using the provided selector
    let products = document.querySelectorAll('.fy23-search-card.fy23-list-normal-card.m-gallery-product-item-v2.J-search-card-wrapper[data-product_id]');
    // Initialize the rank counter for non-P4P products
    let rank = 1;
    // Loop through each product element
    for (let i = 0; i < products.length; i++) {
        let product = products[i];
        // Get the product ID from the data-product_id attribute
        let productID = product.getAttribute('data-product_id');
        // Check if the product is a P4P product
        let isP4P = product.getAttribute('data-aplus-auto-offer').includes('is_p4p=true');
        // Create a new element to display the product ID and rank
        let idElement = document.createElement('span');
        idElement.textContent = 'ID: ' + productID + ' | 总排: ' + (i + 1) + (isP4P ? ' | P4P ' : ' | 自排 : ' + rank++);
        // Set the background color and text color of the new element
        idElement.style.backgroundColor = 'red';
        idElement.style.color = 'white';
        // Set the font size of the new element
        idElement.style.fontSize = '15px';
        // Set the padding of the new element
        idElement.style.padding = '5px';
        // Find the search-card-m-action-area element on the page
        let flexRowElement = product.querySelector('.search-card-m-action-area');
        // Add the new element to the page below the search-card-m-action-area element
        flexRowElement.parentNode.insertBefore(idElement, flexRowElement);
    }
})();


(function() {
    'use strict';

//旧版阿里国际站搜索结果信息
// Get all product elements on the page using the provided selector
let products = document.querySelectorAll('.list-no-v2-outter.J-offer-wrapper.traffic-product-card');
// Initialize the rank counter for non-P4P products
let rank = 1;
// Loop through each product element
for (let i = 0; i < products.length; i++) {
    let product = products[i];
    // Get the trackinfo data from the data-trackinfo attribute
    let trackinfo = product.getAttribute('data-trackinfo');
    // Parse the trackinfo data to extract the product ID
    let data = {};
    trackinfo.split('@@').forEach(item => {
        let [key, value] = item.split(':');
        data[key] = value;
    });
    let productID = data['product_id'];
    // Check if the product is a P4P product
    let isP4P = product.getAttribute('data-is_p4p') === 'true';
    // Create a new element to display the product ID and rank
    let idElement = document.createElement('span');
    idElement.textContent = 'ID: ' + productID + ' | 总排: ' + (i + 1) + (isP4P ? ' | P4P ' : ' | 自排 : ' + rank++);
    // Set the background color and text color of the new element
    idElement.style.backgroundColor = 'red';
    idElement.style.color = 'white';
    // Set the font size of the new element
    idElement.style.fontSize = '15px';
    // Set the padding of the new element
    idElement.style.padding = '5px';
    // Find the flex-row element on the page
    let flexRowElement = product.querySelector('.flex-row');
    // Add the new element to the page below the flex-row element
    flexRowElement.parentNode.insertBefore(idElement, flexRowElement);
}


})();