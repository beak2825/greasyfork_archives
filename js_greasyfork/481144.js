// ==UserScript==
// @name         Kongfz Item Filter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Filter items on Kongfz website based on delivery time, completion rate, and blacklist sellers
// @author       Larus
// @match        https://item.kongfz.com/book/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481144/Kongfz%20Item%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/481144/Kongfz%20Item%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const BLACKLISTED_SELLER_LINKS = ['SellerName1', 'SellerName2']; // Add blacklisted sellers link here
    let minCompletionRate = 80; // Minimum completion rate to show
    let maxDeliveryTime = 24; // Maximum delivery time in hours
    let filterNewItems = true; // Whether to filter out '全新' items
    let highlightBlacklist = false; // Whether to highlight blacklisted sellers

// Add UI for filtering
    function addFilterUI() {
        const filterDiv = document.createElement('div');
        filterDiv.innerHTML = `
            <label>最小完成率 (%): <input type="number" id="minCompletionRate" value="${minCompletionRate}"></label>
            <label>最大发送时间 (Hours): <input type="number" id="maxDeliveryTime" value="${maxDeliveryTime}"></label>
            <label><input type="checkbox" id="filterNewItems" ${filterNewItems ? 'checked' : ''}> 筛选'全新' 条目</label>
            <label><input type="checkbox" id="highlightBlacklist" ${highlightBlacklist ? 'checked' : ''}> 标记拉黑商家</label>
            <button id="applyFilters">应用筛选项</button>
        `;
        document.body.insertBefore(filterDiv, document.body.firstChild);

        document.getElementById('applyFilters').addEventListener('click', applyFilters);
    }

// Apply filters to the items
    function applyFilters() {
        minCompletionRate = document.getElementById('minCompletionRate').value;
        maxDeliveryTime = document.getElementById('maxDeliveryTime').value;
        filterNewItems = document.getElementById('filterNewItems').checked;
        highlightBlacklist = document.getElementById('highlightBlacklist').checked;

        const items = document.querySelectorAll('li.clearfix.item-list');
        let blacklistedItems = [];

        items.forEach(item => {
            const completionRate = extractCompletionRate(item);
            const deliveryTime = extractDeliveryTime(item);
            const sellerLink = extractSellerLink(item);
            const isItemNew = extractNewItem(item);
            const isBlacklisted = BLACKLISTED_SELLER_LINKS.includes(sellerLink);


           if (completionRate < minCompletionRate || deliveryTime > maxDeliveryTime || (filterNewItems && isItemNew)) {
                item.style.display = 'none';
            } else {
                item.style.display = '';
                if (isBlacklisted) {
                    if (highlightBlacklist) {
                        item.style.backgroundColor = 'yellow'; // Highlight style
                        blacklistedItems.push(item);
                    } else {
                        item.style.display = 'none';
                    }
                }
            }
        });
        // Move blacklisted items to the bottom if highlighted
        if (highlightBlacklist && blacklistedItems.length) {
            blacklistedItems.forEach(item => document.body.appendChild(item));
        }
    }

    // Extract completion rate from an item element
    function extractCompletionRate(item) {
        // Modify this function based on the actual structure of the page
        const text = item.textContent || '';
        const match = text.match(/成功完成率(\d+\.\d+)%/);
        return match ? parseFloat(match[1]) : 0;
    }

    // Extract delivery time from an item element
    function extractDeliveryTime(item) {
        // Modify this function based on the actual structure of the page
        const text = item.textContent || '';
        const match = text.match(/平均发货(\d+)小时/);
        return match ? parseInt(match[1], 10) : Number.MAX_SAFE_INTEGER;
    }

// Extract seller link from an item element
    function extractSellerLink(item) {
        const sellerAnchor = item.querySelector('a[href*="shop.kongfz.com"]');
        return sellerAnchor ? sellerAnchor.href : '';
    }

    // Extract whether the item is '全新'
    function extractNewItem(item) {
        const conditionDiv = item.querySelector('div.list-con-product');
        return conditionDiv && conditionDiv.textContent.includes('全新');
    }

    // Initialize script
    addFilterUI();
})();
