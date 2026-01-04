// ==UserScript==
// @name         steam市场一键提取磨损
// @namespace    steam市场一键提取磨损
// @version      3.1
// @description  Enhance Steam Community Market and Trade pages with more features and information, including filter and result selection options for float values copied from market listings.
// @author       Sneer Cat
// @match        https://steamcommunity.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461930/steam%E5%B8%82%E5%9C%BA%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%96%E7%A3%A8%E6%8D%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/461930/steam%E5%B8%82%E5%9C%BA%E4%B8%80%E9%94%AE%E6%8F%90%E5%8F%96%E7%A3%A8%E6%8D%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取指定数量的 csgofloat-itemfloat 的值
    function getFloatValues(num) {
        let floatValues = '';
        const floatElements = document.querySelectorAll('.csgofloat-itemfloat');
        const maxNum = Math.min(num, floatElements.length);
        for (let i = 0; i < maxNum; i++) {
            const floatElement = floatElements[i];
            floatValues += floatElement.innerText.replace(/[^0-9.]/g, '') + ',';
        }
        return floatValues.slice(0, -1);
    }

    // 添加复制按钮和结果筛选功能
    function addCopyButton() {
        const parentElement = document.querySelector('.market_listing_nav');
        const copyButton = document.createElement('button');
        copyButton.innerText = '复制 Float 值';
        copyButton.style.marginLeft = '10px';
        const numInput = document.createElement('input');
        numInput.type = 'number';
        numInput.min = '1';
        numInput.max = '100';
        numInput.style.marginLeft = '10px';
        numInput.value = '32';
        const lessThanInput = document.createElement('input');
        lessThanInput.type = 'number';
        lessThanInput.placeholder = '不大于...';
        lessThanInput.style.marginLeft = '10px';
        const greaterThanInput = document.createElement('input');
        greaterThanInput.type = 'number';
        greaterThanInput.placeholder = '不小于...';
        greaterThanInput.style.marginLeft = '10px';
        const resultDisplay = document.createElement('div');
        resultDisplay.style.marginLeft = '10px';
        copyButton.onclick = () => {
            const floatValues = getFloatValues(numInput.value);
            let filteredValues = floatValues.split(',').filter((value) => {
                const lessThanValue = parseFloat(lessThanInput.value);
                if (!isNaN(lessThanValue) && parseFloat(value) > lessThanValue) {
                    return false;
                }
                const greaterThanValue = parseFloat(greaterThanInput.value);
                if (!isNaN(greaterThanValue) && parseFloat(value) < greaterThanValue) {
                    return false;
                }
                return true;
            }).join(',');
            const resultNum = filteredValues.split(',').length;
            navigator.clipboard.writeText(filteredValues).then(() => {
                alert(`已复制 ${resultNum} 个 Float 值到剪贴板！`);
            });
            resultDisplay.innerText = ` (${resultNum} 个符合条件)`;
        };
        parentElement.appendChild(copyButton);
        parentElement.appendChild(numInput);
        parentElement.appendChild(lessThanInput);
        parentElement.appendChild(greaterThanInput);
        parentElement.appendChild(resultDisplay);
    }

    // 在 market 页面添加复制按钮和结果筛选功能
    if (window.location.href.includes('/market/listings/')) {
        addCopyButton();
    }

    // 添加过滤、排序和物品信息功能
    if (window.location.href.includes('/market/') && window.location.href.includes('/listings/')) {
        // 添加过滤和排序选项
        const parentElement = document.querySelector('.market_listing_nav');
        const sortSelect = parentElement.querySelector('select[name="sort"]');
        sortSelect.insertAdjacentHTML('afterend', '<select name="filter" style="margin-left: 10px;"><option value="">过滤</option><option value="stattrak">StatTrak</option><option value="souvenir">Souvenir</option></select>');
        const filterSelect = parentElement.querySelector('select[name="filter"]');
        filterSelect.addEventListener('change', () => {
            const selectedValue = filterSelect.value;
            const nameElements = document.querySelectorAll('.market_listing_item_name');
            for (let i = 0; i < nameElements.length; i++) {
                const nameElement = nameElements[i];
                if (selectedValue === '') {
                    nameElement.parentElement.parentElement.style.display = 'block';
                } else if (!nameElement.innerText.includes(selectedValue)) {
                    nameElement.parentElement.parentElement.style.display = 'none';
}
}
});

    // 在悬停时显示物品信息
    const itemHoverElements = document.querySelectorAll('.market_listing_item_name');
    for (let i = 0; i < itemHoverElements.length; i++) {
        const itemHoverElement = itemHoverElements[i];
        itemHoverElement.addEventListener('mouseover', () => {
            const itemName = itemHoverElement.innerText.trim();
            const itemInfoUrl = `https://steamcommunity.com/market/priceoverview/?appid=730&currency=1&market_hash_name=${encodeURIComponent(itemName)}`;
            fetch(itemInfoUrl)
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        const imageSrc = `https://steamcommunity-a.akamaihd.net/economy/image/${data.asset_description.icon_url}`;
                        const description = data.asset_description.descriptions.find((description) => description.type === 'html').value;
                        const infoBox = document.createElement('div');
                        infoBox.style.position = 'absolute';
                        infoBox.style.width = '300px';
                        infoBox.style.padding = '5px';
                        infoBox.style.backgroundColor = 'white';
                        infoBox.style.boxShadow = '2px 2px 2px rgba(0, 0, 0, 0.3)';
                        infoBox.innerHTML = `<img src="${imageSrc}" style="width: 64px; height: 48px; float: left; margin-right: 10px;">${description}`;
                        itemHoverElement.parentElement.appendChild(infoBox);
                    }
                });
        });
        itemHoverElement.addEventListener('mouseout', () => {
            const infoBox = itemHoverElement.parentElement.querySelector('div');
            if (infoBox) {
                itemHoverElement.parentElement.removeChild(infoBox);
            }
        });
    }
}

// 添加自动确认功能
if (window.location.href.includes('/inventory')) {
    // 等待页面完全加载后再执行自动确认
    window.addEventListener('load', () => {
        const confirmAllButton = document.querySelector('.inventory_page .inventory_ctn .trade_confirmbtn');
        if (confirmAllButton) {
            confirmAllButton.click();
        }
    });
}
})();