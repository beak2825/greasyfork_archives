// ==UserScript==
// @name         Booth Item Extractor
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Extract booth item information
// @author       You
// @match        https://accounts.booth.pm/library*
// @match        https://accounts.booth.pm/library/gifts*
// @match        https://booth.pm/*/items/*
// @match        https://*.booth.pm/items/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527522/Booth%20Item%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/527522/Booth%20Item%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getCurrentPath() {
        const path = window.location.pathname;
        return path.startsWith('/library/gifts') ? '/library/gifts' : '/library';
    }

    async function extractItemInfo(pageNum = 1) {
        const basePath = getCurrentPath();
        const response = await fetch(`${basePath}?page=${pageNum}`);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        // Find all item containers
        const containers = doc.querySelectorAll('.mb-16.bg-white');
        if (!containers || containers.length === 0) return null;

        const itemData = [];

        // Extract information from each container
        containers.forEach(container => {
            const header = container.querySelector('.flex.gap-8');
            if (!header) return;

            const itemLink = header.querySelector('a[href*="/items/"]');
            const itemImage = header.querySelector('img.l-library-item-thumbnail');
            const itemTitle = header.querySelector('.text-text-default.font-bold');
            const shopName = header.querySelector('.typography-14.text-text-gray600');

            itemData.push({
                title: itemTitle ? itemTitle.textContent.trim() : '',
                url: itemLink ? itemLink.href : '',
                imageUrl: itemImage ? itemImage.src : '',
                shop: shopName ? shopName.textContent.trim() : ''
            });
        });

        return itemData;
    }

    async function getLastPageNumber() {
        const basePath = getCurrentPath();
        const response = await fetch(basePath);
        const text = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');

        const lastPageLink = doc.querySelector('a.last-page');
        if (lastPageLink) {
            const href = lastPageLink.getAttribute('href');
            const match = href.match(/page=(\d+)/);
            if (match) {
                return parseInt(match[1]);
            }
        }
        return 1;
    }

    async function extractMultiplePages() {
        const allItems = [];
        const button = document.querySelector('#extractButton');
        if (button) button.disabled = true;

        try {
            const lastPage = await getLastPageNumber();
            for (let page = 1; page <= lastPage; page++) {
                if (button) button.textContent = `Extracting page ${page}/${lastPage}...`;
                const items = await extractItemInfo(page);
                if (items && items.length > 0) {
                    allItems.push(...items);
                } else {
                    break; // No more items found
                }
                // Add a small delay to avoid overwhelming the server
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            return allItems;
        } finally {
            if (button) {
                button.disabled = false;
                button.textContent = 'Extract Items Info';
            }
        }
    }

    async function extractCurrentPage() {
        const itemInfo = await extractItemInfo(1);
        if (itemInfo && itemInfo.length > 0) {
            console.log('Extracted Items Information:', itemInfo);
            try {
                await navigator.clipboard.writeText(JSON.stringify(itemInfo, null, 2));
                alert(`Items information copied to clipboard! (${itemInfo.length} items from current page)`);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        } else {
            console.error('Failed to extract items information');
        }
    }

    // ボタンのスタイルを共通化する関数
    function applyButtonStyle(button, marginRight = '0px') {
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: ${marginRight};
            z-index: 10000;
            padding: 10px;
            background: #0066cc;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        `;
    }

    // 商品ページ用の情報抽出関数
    async function extractSingleItemInfo() {
        const itemData = {
            title: '',
            imageUrl: '',
            shop: '',
            url: window.location.href
        };

        try {
            // 商品名を取得
            const titleElement = document.evaluate(
                '//*[@id="items"]/article/div/div/div/div[4]/div[1]/div[1]/div[1]/header/h2',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if (titleElement) itemData.title = titleElement.textContent.trim();

            // 画像を取得（div[2]から順にループして探す）
            let imageElement = null;
            for (let i = 2; i <= 5; i++) { // 2から5までのdiv要素を確認
                const xpath = `//*[@id="items"]/article/div/div/div/div[4]/div[2]/div[1]/div/div/div[${i}]/div/div/div/img`;
                imageElement = document.evaluate(
                    xpath,
                    document,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null
                ).singleNodeValue;
                
                if (imageElement) {
                    itemData.imageUrl = imageElement.src;
                    break;
                }
            }

            // ショップ名を取得
            const shopElement = document.evaluate(
                '//*[@id="items"]/article/div/div/div/div[4]/div[1]/div[1]/div[1]/header/div[3]/a[1]/span',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            if (shopElement) itemData.shop = shopElement.textContent.trim();

            console.log('Extracted Item Information:', itemData);
            try {
                await navigator.clipboard.writeText(JSON.stringify([itemData], null, 2));
                alert('Item information copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        } catch (error) {
            console.error('Error extracting item information:', error);
        }
    }

    // Check if we're on a product page
    if (window.location.href.match(/https:\/\/booth\.pm\/.*\/items\/.*/)) {
        // 商品ページ用のボタン
        const singleItemButton = document.createElement('button');
        singleItemButton.id = 'extractSingleItemButton';
        singleItemButton.textContent = 'Extract One Item';
        applyButtonStyle(singleItemButton, '20px');
        singleItemButton.addEventListener('click', extractSingleItemInfo);
        document.body.appendChild(singleItemButton);
    } else {
        // If we're on the library page, add the original buttons
        const allPagesButton = document.createElement('button');
        allPagesButton.id = 'extractButton';
        allPagesButton.textContent = 'Extract All Pages';
        applyButtonStyle(allPagesButton, '200px');
        allPagesButton.addEventListener('click', async () => {
            const itemInfo = await extractMultiplePages();
            if (itemInfo && itemInfo.length > 0) {
                console.log('Extracted Items Information:', itemInfo);
                try {
                    await navigator.clipboard.writeText(JSON.stringify(itemInfo, null, 2));
                    alert(`Items information copied to clipboard! (${itemInfo.length} items from multiple pages)`);
                } catch (err) {
                    console.error('Failed to copy:', err);
                }
            } else {
                console.error('Failed to extract items information');
            }
        });

        const currentPageButton = document.createElement('button');
        currentPageButton.id = 'extractCurrentPageButton';
        currentPageButton.textContent = 'Extract Current Page';
        applyButtonStyle(currentPageButton, '20px');
        currentPageButton.addEventListener('click', extractCurrentPage);

        document.body.appendChild(allPagesButton);
        document.body.appendChild(currentPageButton);
    }
})();