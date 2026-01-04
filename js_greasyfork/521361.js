// ==UserScript==
// @name         Amazon KW Asin located
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  查找指定ASIN，自然位与广告位分别定位，支持搜索历史记录保存及备注，优化了停止条件
// @author       ciaociao
// @match        https://www.amazon.com/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521361/Amazon%20KW%20Asin%20located.user.js
// @updateURL https://update.greasyfork.org/scripts/521361/Amazon%20KW%20Asin%20located.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAX_EXTRA_PAGES = 5;
    let searchState = { natural: null, sponsored: null, foundOne: false, pagesAfterFirstFind: 0 };
    let targetASIN = '';
    let currentPage = 1;

    // 创建输入和控制面板
    const panelHTML = `
        <div style="position:fixed; top:10px; right:10px; background:white; border:1px solid #ccc; padding:10px; z-index:10000;">
            <label for="asinSelect">选择ASIN: </label>
            <select id="asinSelect" style="width:200px;"><option value="">-- 选择一个ASIN --</option></select><br>
            <label for="asinInput">输入ASIN: </label>
            <input type="text" id="asinInput" style="width:150px;" placeholder="输入ASIN" /><br>
            <label for="asinLabel">备注: </label>
            <input type="text" id="asinLabel" style="width:150px;" placeholder="输入备注 (可选)" /><br>
            <button id="startSearch">开始搜索</button>
            <button id="clearStorage">清空历史</button>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', panelHTML);

    // 加载保存的 ASIN
    loadSavedASINs();

    document.getElementById('startSearch').addEventListener('click', () => {
        targetASIN = document.getElementById('asinInput').value.trim() || document.getElementById('asinSelect').value.trim();
        if (!targetASIN) {
            alert('请输入有效的ASIN！');
            return;
        }
        const label = document.getElementById('asinLabel').value.trim() || '未命名';
        saveASIN(targetASIN, label);
        resetSearchState();
        searchASIN();
    });

    document.getElementById('clearStorage').addEventListener('click', () => {
        localStorage.removeItem('savedASINs');
        loadSavedASINs();
        alert('已清空所有保存的ASIN！');
    });

    function resetSearchState() {
        searchState = { natural: null, sponsored: null, foundOne: false, pagesAfterFirstFind: 0 };
        currentPage = 1;
    }

    function searchASIN() {
        const productDivs = document.querySelectorAll('div[data-asin]');
        let naturalPosition = 0; // 自然位计数
        let sponsoredPosition = 0; // 广告位计数

        for (const div of productDivs) {
            const asin = div.getAttribute('data-asin');
            // 修改广告位判断逻辑，更准确地识别广告商品
            const isSponsored = div.querySelector('[data-component-type="sp-sponsored-result"], span.puis-label-popover-default, span.s-label-popover-default') !== null;
            const hasAddToCart = div.querySelector('span.a-button-inner button.a-button-text');

            if (asin && hasAddToCart) {
                if (isSponsored) {
                    sponsoredPosition++; // 广告位计数
                    if (asin === targetASIN) {
                        searchState.sponsored = { page: currentPage, position: sponsoredPosition };
                    }
                } else {
                    naturalPosition++; // 自然位计数
                    if (asin === targetASIN) {
                        searchState.natural = { page: currentPage, position: naturalPosition };
                    }
                }
            }
        }

        updateSearchState();
    }

    function updateSearchState() {
        if (searchState.natural || searchState.sponsored) {
            if (!searchState.foundOne) {
                searchState.foundOne = true;
                searchState.pagesAfterFirstFind = 0;
            } else {
                searchState.pagesAfterFirstFind++;
            }
        }

        if (searchState.pagesAfterFirstFind >= MAX_EXTRA_PAGES || (searchState.natural && searchState.sponsored)) {
            showResults();
        } else {
            goToNextPage();
        }
    }

    function goToNextPage() {
        const nextPageButton = document.querySelector('a.s-pagination-next');
        if (nextPageButton) {
            currentPage++;
            nextPageButton.click();
            setTimeout(searchASIN, 4000);
        } else {
            showResults();
        }
    }

    function showResults() {
        let message = `搜索完成：\n`;
        message += searchState.natural ? `自然位: 第 ${searchState.natural.page} 页，第 ${searchState.natural.position} 个位置\n` : '自然位: 未找到\n';
        message += searchState.sponsored ? `广告位: 第 ${searchState.sponsored.page} 页，第 ${searchState.sponsored.position} 个位置\n` : '广告位: 未找到\n';
        alert(message);
    }

    function saveASIN(asin, label) {
        const savedASINs = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        if (!savedASINs.some(item => item.asin === asin)) {
            savedASINs.push({ asin, label });
            localStorage.setItem('savedASINs', JSON.stringify(savedASINs));
            loadSavedASINs();
        }
    }

    function loadSavedASINs() {
        const savedASINs = JSON.parse(localStorage.getItem('savedASINs') || '[]');
        const asinSelect = document.getElementById('asinSelect');
        asinSelect.innerHTML = '<option value="">-- 选择一个ASIN --</option>';
        savedASINs.forEach(({ asin, label }) => {
            const option = document.createElement('option');
            option.value = asin;
            option.textContent = `${asin} - ${label}`;
            asinSelect.appendChild(option);
        });
    }
})();