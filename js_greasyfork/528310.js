// ==UserScript==
// @name         Amazon 关键词 批量搜索关键词
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  查找指定ASIN，支持批量关键词搜索，自然位与广告位分别定位，支持搜索历史记录保存及备注，可自定义最大搜索页数
// @author       ciaociao
// @match        https://www.amazon.com/*
// @icon         https://www.amazon.com/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528310/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20%E6%89%B9%E9%87%8F%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/528310/Amazon%20%E5%85%B3%E9%94%AE%E8%AF%8D%20%E6%89%B9%E9%87%8F%E6%90%9C%E7%B4%A2%E5%85%B3%E9%94%AE%E8%AF%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let searchState = { natural: null, sponsored: null };
    let targetASIN = '';
    let currentPage = 1;
    let isSearching = false;
    let keywordQueue = [];
    let currentKeyword = '';
    let searchResults = [];
    let maxPage = 7; // 默认最大页数

    const panelHTML = `
        <div id="asinSearchPanel" style="position:fixed; top:10px; right:10px; width:400px; background-color: white; border-radius:12px; border:1px solid #e0e0e0; padding:15px; z-index:10000; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);">

            <label for="asinInput">输入ASIN: </label>
            <input type="text" id="asinInput" style="width:100%; margin-bottom:5px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;" placeholder="输入ASIN" /><br>

            <label for="keywordsInput">搜索关键词(每行一个): </label>
            <textarea id="keywordsInput" style="width:100%; height:100px; margin-bottom:5px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;" placeholder="输入搜索关键词，每行一个"></textarea><br>

            <label for="maxPageInput">最大搜索页数(默认7): </label>
            <input type="number" id="maxPageInput" style="width:100%; margin-bottom:5px; padding: 5px; border: 1px solid #ddd; border-radius: 4px;" placeholder="默认7" /><br>

            <button id="startSearch" style="width:100%; margin-top:8px; padding:8px; border-radius:4px; background:#007BFF; color:#fff; border:none; cursor:pointer;">开始批量搜索</button>
            <button id="stopSearch" style="width:100%; margin-top:6px; padding:8px; border-radius:4px; background:#FFA500; color:#fff; border:none; cursor:pointer; display:none;">终止搜索</button>
            <button id="clearStorage" style="width:100%; margin-top:6px; padding:8px; border-radius:4px; background:#FF4D4D; color:#fff; border:none; cursor:pointer;">清空历史</button>

            <div id="searchStatus" style="margin-top:10px; border-top:1px solid #e0e0e0; padding-top:10px;">
                <div id="searchProgress" style="display:none;">
                    <p style="margin:5px 0; color: #333;">当前关键词: <span id="currentKeywordDisplay">-</span></p>
                    <p style="margin:5px 0; color: #333;">剩余关键词: <span id="remainingKeywords">0</span></p>
                    <p style="margin:5px 0; color: #333;">当前页码: <span id="currentPageDisplay">1</span></p>
                </div>
                <div id="searchResults" style="display:none;">
                    <p style="margin:5px 0; font-weight:bold; color: #333;">搜索结果:</p>
                    <p style="margin:5px 0; color: #333;">自然位: <span id="naturalPosition">未找到</span></p>
                    <p style="margin:5px 0; color: #333;">广告位: <span id="sponsoredPosition">未找到</span></p>
                </div>
            </div>

            <div id="batchResults" style="margin-top:10px; max-height:400px; overflow-y:auto;">
                <table id="resultsTable" style="width:100%; border-collapse:collapse; display:none;">
                    <thead>
                        <tr>
                            <th style="padding:8px; border:1px solid #e0e0e0; background:#f8f9fa; color: #333;">关键词</th>
                            <th style="padding:8px; border:1px solid #e0e0e0; background:#f8f9fa; color: #333;">自然位</th>
                            <th style="padding:8px; border:1px solid #e0e0e0; background:#f8f9fa; color: #333;">广告位</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>`;

    function initialize() {
        const existingPanel = document.getElementById('asinSearchPanel');
        if (existingPanel) {
            existingPanel.remove();
        }

        document.body.insertAdjacentHTML('beforeend', panelHTML);

        // 绑定按钮事件
        document.getElementById('startSearch').addEventListener('click', startSearchProcess);
        document.getElementById('stopSearch').addEventListener('click', stopSearchProcess);
        document.getElementById('clearStorage').addEventListener('click', clearStorageHandler);

        // 恢复搜索状态
        resumeSearchIfNeeded();
    }

    function startSearchProcess() {
        targetASIN = document.getElementById('asinInput').value.trim();
        if (!targetASIN) {
            alert('请输入有效的ASIN！');
            return;
        }

        const keywords = document.getElementById('keywordsInput').value.trim();
        if (!keywords) {
            alert('请输入至少一个搜索关键词！');
            return;
        }

        const maxPageInput = document.getElementById('maxPageInput').value.trim();
        if (!maxPageInput) {
            maxPage = 7;
        } else {
            const parsedValue = parseInt(maxPageInput, 10);
            maxPage = isNaN(parsedValue) ? 7 : parsedValue;
        }

        // 初始化关键词队列
        keywordQueue = keywords.split('\n')
            .map(k => k.trim())
            .filter(k => k.length > 0);

        if (keywordQueue.length === 0) {
            alert('请输入有效的搜索关键词！');
            return;
        }

        // 初始化搜索结果数组
        searchResults = [];

        // 显示表格并清空内容
        const resultsTable = document.getElementById('resultsTable');
        resultsTable.style.display = 'table';
        resultsTable.querySelector('tbody').innerHTML = '';

        // 设为搜索中
        isSearching = true;
        // 显示/隐藏按钮
        document.getElementById('startSearch').style.display = 'none';
        document.getElementById('stopSearch').style.display = 'block';

        // 保存搜索状态
        const searchData = {
            targetASIN,
            keywordQueue,
            currentKeyword: '',
            searchResults,
            isSearching,
            maxPage
        };
        localStorage.setItem('batchSearchState', JSON.stringify(searchData));

        // 开始第一个关键词的搜索
        startNextKeywordSearch();
    }

    function stopSearchProcess() {
        if (!isSearching) return;
        isSearching = false;
        localStorage.removeItem('batchSearchState');
        alert('搜索已终止！');

        // 切换按钮
        document.getElementById('stopSearch').style.display = 'none';
        document.getElementById('startSearch').style.display = 'block';

        updateBatchResults();
    }

    function startNextKeywordSearch() {
        if (keywordQueue.length === 0) {
            finishBatchSearch();
            return;
        }

        currentKeyword = keywordQueue.shift();
        resetSearchState();
        isSearching = true;
        updateSearchProgress();

        // 更新搜索状态
        const searchData = {
            targetASIN,
            keywordQueue,
            currentKeyword,
            searchResults,
            isSearching,
            searchState,
            currentPage,
            maxPage
        };
        localStorage.setItem('batchSearchState', JSON.stringify(searchData));

        // 跳转到搜索页面
        window.location.href = `https://www.amazon.com/s?k=${encodeURIComponent(currentKeyword)}`;
    }

    function resumeSearchIfNeeded() {
        const savedSearch = localStorage.getItem('batchSearchState');
        if (savedSearch) {
            const searchData = JSON.parse(savedSearch);
            if (searchData.isSearching) {
                targetASIN = searchData.targetASIN;
                keywordQueue = searchData.keywordQueue;
                currentKeyword = searchData.currentKeyword;
                searchResults = searchData.searchResults;
                searchState = searchData.searchState || { natural: null, sponsored: null };
                currentPage = searchData.currentPage || 1;
                maxPage = searchData.maxPage || 7;
                isSearching = true;

                // 显示表格
                document.getElementById('resultsTable').style.display = 'table';

                // 切换按钮
                document.getElementById('startSearch').style.display = 'none';
                document.getElementById('stopSearch').style.display = 'block';

                updateSearchProgress();
                searchASIN();
            }
        }
    }

    function updateSearchProgress() {
        document.getElementById('searchProgress').style.display = 'block';
        document.getElementById('currentKeywordDisplay').textContent = currentKeyword;
        document.getElementById('remainingKeywords').textContent = keywordQueue.length.toString();
        document.getElementById('currentPageDisplay').textContent = currentPage.toString();
        updateBatchResults();
    }

    function updateBatchResults() {
        const tbody = document.getElementById('resultsTable').querySelector('tbody');
        tbody.innerHTML = '';

        searchResults.forEach(result => {
            const row = document.createElement('tr');

            // 关键词列
            const keywordCell = document.createElement('td');
            keywordCell.style.padding = '8px';
            keywordCell.style.border = '1px solid #e0e0e0';
            keywordCell.style.color = '#333';
            keywordCell.textContent = result.keyword;
            row.appendChild(keywordCell);

            // 自然位列
            const naturalCell = document.createElement('td');
            naturalCell.style.padding = '8px';
            naturalCell.style.border = '1px solid #e0e0e0';
            naturalCell.style.color = '#333';
            naturalCell.textContent = result.natural ?
                `${result.natural.page}.${result.natural.position}` :
                'Null';
            row.appendChild(naturalCell);

            // 广告位列
            const sponsoredCell = document.createElement('td');
            sponsoredCell.style.padding = '8px';
            sponsoredCell.style.border = '1px solid #e0e0e0';
            sponsoredCell.style.color = '#333';
            sponsoredCell.textContent = result.sponsored ?
                `${result.sponsored.page}.${result.sponsored.position}` :
                'Null';
            row.appendChild(sponsoredCell);

            tbody.appendChild(row);
        });
    }

    function finishBatchSearch() {
        isSearching = false;
        localStorage.removeItem('batchSearchState');
        alert('批量搜索完成！');

        // 搜索完成后切换按钮
        document.getElementById('stopSearch').style.display = 'none';
        document.getElementById('startSearch').style.display = 'block';

        updateBatchResults();
    }

    function clearStorageHandler() {
        localStorage.removeItem('batchSearchState');
        searchResults = [];
        const resultsTable = document.getElementById('resultsTable');
        resultsTable.style.display = 'none';
        resultsTable.querySelector('tbody').innerHTML = '';
        alert('已清空所有保存的数据！');

        // 如果正在搜索，也停止
        if (isSearching) {
            stopSearchProcess();
        }
    }

    function resetSearchState() {
        searchState = { natural: null, sponsored: null };
        currentPage = 1;
        document.getElementById('searchResults').style.display = 'none';
        document.getElementById('searchProgress').style.display = 'block';
        document.getElementById('naturalPosition').textContent = '未找到';
        document.getElementById('sponsoredPosition').textContent = '未找到';
    }

    function searchASIN() {
        if (!isSearching) return;

        const productDivs = document.querySelectorAll('div[data-asin]');
        let naturalPosition = 0;
        let sponsoredPosition = 0;

        for (const div of productDivs) {
            const asin = div.getAttribute('data-asin');
            const isSponsored = div.querySelector('[data-component-type="sp-sponsored-result"], span.puis-label-popover-default, span.s-label-popover-default') !== null;
            const hasAddToCart = div.querySelector('span.a-button-inner button.a-button-text');

            if (asin && hasAddToCart) {
                if (isSponsored) {
                    sponsoredPosition++;
                    if (asin === targetASIN && !searchState.sponsored) {
                        searchState.sponsored = { page: currentPage, position: sponsoredPosition };
                        document.getElementById('sponsoredPosition').textContent =
                            `第 ${currentPage} 页，第 ${sponsoredPosition} 个位置`;
                    }
                } else {
                    naturalPosition++;
                    if (asin === targetASIN && !searchState.natural) {
                        searchState.natural = { page: currentPage, position: naturalPosition };
                        document.getElementById('naturalPosition').textContent =
                            `第 ${currentPage} 页，第 ${naturalPosition} 个位置`;
                    }
                }
            }
        }

        // 更新搜索状态
        const searchData = {
            targetASIN,
            keywordQueue,
            currentKeyword,
            searchResults,
            isSearching,
            searchState,
            currentPage,
            maxPage
        };
        localStorage.setItem('batchSearchState', JSON.stringify(searchData));

        if (searchState.natural && searchState.sponsored) {
            finishCurrentKeywordSearch();
        } else {
            goToNextPage();
        }
    }

    function finishCurrentKeywordSearch() {
        // 保存当前关键词的搜索结果
        searchResults.push({
            keyword: currentKeyword,
            natural: searchState.natural,
            sponsored: searchState.sponsored
        });

        // 开始下一个关键词的搜索
        startNextKeywordSearch();
    }

    function goToNextPage() {
        const nextPageButton = document.querySelector('a.s-pagination-next:not(.s-pagination-disabled)');
        if (nextPageButton && isSearching && currentPage < maxPage) {
            currentPage++;
            updateSearchProgress();
            nextPageButton.click();
            setTimeout(searchASIN, 4000);
        } else {
            finishCurrentKeywordSearch();
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();