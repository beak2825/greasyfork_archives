// ==UserScript==
// @name         起点图表格筛选 (v7.4 懒加载优化)
// @namespace    http://tampermonkey.net/
// @version      7.4
// @description  为起点图(qidiantu.com)增加强大的表格筛选和数据分析功能。支持分类和等级的多选过滤、书名热词分析与筛选，并完美兼容网站的懒加载机制。新增书单收录数显示（支持点击刷新）和智能容错功能。
// @author       Gemini
// @homepageURL  https://github.com/liucong2013/qidiantu-filter
// @match        https://www.qidiantu.com/shouding/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543774/%E8%B5%B7%E7%82%B9%E5%9B%BE%E8%A1%A8%E6%A0%BC%E7%AD%9B%E9%80%89%20%28v74%20%E6%87%92%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543774/%E8%B5%B7%E7%82%B9%E5%9B%BE%E8%A1%A8%E6%A0%BC%E7%AD%9B%E9%80%89%20%28v74%20%E6%87%92%E5%8A%A0%E8%BD%BD%E4%BC%98%E5%8C%96%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const SCRIPT_NAME = '起点图表格筛选';
    const log = (...args) => console.log(`[${SCRIPT_NAME}]`, ...args);

    function addViewportMeta() {
        if (document.querySelector('meta[name="viewport"]')) return;
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(meta);
    }

    if (document.head) {
        addViewportMeta();
    } else {
        const observer = new MutationObserver(() => {
            if (document.head) {
                addViewportMeta();
                observer.disconnect();
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }

    GM_addStyle(`
        .gm-sticky-toolbar { position: sticky; top: 0; background-color: #ffffff; padding: 8px 10px; border-bottom: 1px solid #e0e0e0; box-shadow: 0 2px 4px rgba(0,0,0,0.05); z-index: 1001; }
        #gm-hotword-display-area { padding-top: 8px; border-top: 1px dashed #ccc; margin-top: 8px; text-align: center; }
        .gm-hotword-tag { display: inline-block; padding: 3px 8px; margin: 2px; background-color: #e9f5ff; border: 1px solid #d0eaff; border-radius: 4px; cursor: pointer; }
        .gm-hotword-tag.active { background-color: #007bff; color: white; border-color: #0056b3; }
        #gm-hotword-clear-btn { display: none; width: 98%; box-sizing: border-box; margin: 8px auto 0 auto; padding: 4px; background-color: #ffe9e9; border: 1px solid #ffd0d0; border-radius: 4px; cursor: pointer; }
        .gm-multiselect-container { position: relative; display: inline-block; margin-left: 8px; font-weight: normal; vertical-align: middle; }
        .gm-multiselect-button, #gm-analyze-hotwords-btn { padding: 4px 10px; border: 1px solid #ccc; border-radius: 4px; background-color: #f8f8f8; cursor: pointer; }
        .gm-multiselect-button.active { background-color: #007bff; color: white; border-color: #0056b3; }
        .gm-multiselect-dropdown { display: none; position: absolute; background-color: white; border: 1px solid #ccc; border-radius: 4px; padding: 5px; z-index: 1002; max-height: 300px; overflow-y: auto; text-align: left; }
        .gm-multiselect-dropdown.show { display: block; }
        .gm-multiselect-dropdown label { display: block; padding: 3px 5px; white-space: nowrap; }
        .gm-multiselect-dropdown label:hover { background-color: #f0f0f0; }
        .gm-multiselect-clear-btn { position: sticky; top: -5px; z-index: 1; width: calc(100% + 10px); margin: -5px -5px 5px -5px; box-sizing: border-box; padding: 5px; text-align: center; border: none; border-bottom: 1px solid #ddd; background: #f5f5f5; cursor: pointer; }
        .booklist-count { font-size: 12px; color: #ff6a00; margin-left: 8px; background-color: #fff3e0; padding: 1px 5px; border-radius: 3px; border: 1px solid #ffe0b2; display: inline-flex; align-items: center; cursor: pointer; }
        .booklist-count:hover { background-color: #ffe0b2; }
        .booklist-spinner { width: 12px; height: 12px; border: 2px solid #ffab40; border-top-color: transparent; border-radius: 50%; display: inline-block; animation: spin 1s linear infinite; margin-right: 4px; }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
            body, .table-bordered { font-size: 14px; }
            .gm-sticky-toolbar { padding: 5px; display: flex; flex-direction: column; align-items: stretch; }
            #gm-analyze-hotwords-btn { margin-bottom: 5px; }
            .gm-multiselect-container { margin: 5px 0; display: block; }
            .gm-multiselect-button { width: 100%; box-sizing: border-box; text-align: center; }
            .gm-multiselect-dropdown { width: 98%; box-sizing: border-box; left: 1%; }
            .table-bordered th, .table-bordered td { padding: 4px; white-space: normal !important; }
            .table-bordered th:nth-child(1), .table-bordered td:nth-child(1) { min-width: 30px; width: 30px; }
            .table-bordered th:nth-child(3), .table-bordered td:nth-child(3),
            .table-bordered th:nth-child(5), .table-bordered td:nth-child(5) { min-width: 50px; }
            .table-bordered th:nth-child(2), .table-bordered td:nth-child(2) { min-width: 150px; }
            .table-bordered th { font-size: 13px; }
            #gm-hotword-display-area { text-align: left; }
            .booklist-count { display: block; margin-left: 0; margin-top: 4px; text-align: center; justify-content: center; }
        }
    `);

    let allTableRows = [];
    let categoryFilterControl = null;
    let levelFilterControl = null;
    let activeHotword = null;
    let tableBodyObserver = null;
    let booklistFetchQueue = [];
    let isFetching = false;
    let consecutiveFailureCount = 0;
    const MAX_CONSECUTIVE_FAILURES = 5;
    let fetchLimit = 100;

    const CACHE_KEY_PREFIX = 'booklist_count_v5_'; // Invalidate old cache v4
    const CACHE_EXPIRATION_MS = 30 * 24 * 60 * 60 * 1000; // 30天

    function getRandomDelay(min = 200, max = 500) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async function fetchBooklistCount(bookUrl, displayElement, force = false) {
        const bookIdMatch = bookUrl.match(/\/info\/(\d+)/);
        const row = displayElement.closest('tr');

        if (!bookIdMatch) {
            log('Could not extract book ID from URL:', bookUrl);
            displayElement.textContent = 'ID错误';
            if (row) row.dataset.booklistState = 'failed';
            return 'error';
        }
        const bookId = bookIdMatch[1];
        const cacheKey = `${CACHE_KEY_PREFIX}${bookId}`;

        if (!force) {
            try {
                const cachedData = await GM_getValue(cacheKey);
                if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRATION_MS)) {
                    log(`Book ID ${bookId}: Found valid cache. Count: ${cachedData.count}`);
                    displayElement.innerHTML = `书单: ${cachedData.count}`;
                    if (row) row.dataset.booklistState = 'fetched';
                    consecutiveFailureCount = 0; // Reset on cache hit
                    return 'cache';
                }
            } catch (e) {
                log(`Error reading cache for Book ID ${bookId}:`, e);
            }
        }

        log(`Book ID ${bookId}: ${force ? 'Forced fetch' : 'No cache, fetching from network'}.`);
        displayElement.innerHTML = '<div class="booklist-spinner"></div>查询中...';

        try {
            const response = await fetch(bookUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
                    "Referer": "https://www.qidiantu.com/shouding/"
                }
            });

            if (response.ok) {
                const text = await response.text();
                const match = text.match(/共被(\d+)份书单收录过/);
                const rawMatchText = match ? `'${match[0]}'` : 'N/A';
                const count = match ? match[1] : '0';
                log(`Book ID ${bookId}: Raw match: ${rawMatchText}, Extracted count: ${count}, URL: ${bookUrl}`);
                displayElement.innerHTML = `书单: ${count}`;
                if (row) row.dataset.booklistState = 'fetched';
                consecutiveFailureCount = 0; // Reset on success
                try {
                    await GM_setValue(cacheKey, { count: count, timestamp: Date.now() });
                } catch (e) {
                    log(`Error saving cache for Book ID ${bookId}:`, e);
                }
                return 'network';
            } else {
                log(`Book ID ${bookId}: Fetch failed with status ${response.status}`);
                displayElement.textContent = '查询失败';
                if (row) row.dataset.booklistState = 'failed';
                consecutiveFailureCount++;
                return 'error';
            }
        } catch (error) {
            log(`Book ID ${bookId}: Fetch error.`, error);
            displayElement.textContent = '查询失败';
            if (row) row.dataset.booklistState = 'failed';
            consecutiveFailureCount++;
            return 'error';
        }
    }

    async function processFetchQueue() {
        if (isFetching) return;
        if (booklistFetchQueue.length === 0) return;

        isFetching = true;
        log('Starting to process fetch queue...');

        while (booklistFetchQueue.length > 0) {
            if (consecutiveFailureCount >= MAX_CONSECUTIVE_FAILURES) {
                log(`连续获取失败${MAX_CONSECUTIVE_FAILURES}次，自动停止获取。`);
                booklistFetchQueue.length = 0; // Clear the queue
                break;
            }

            const item = booklistFetchQueue.shift();
            log(`Processing Book URL: ${item.url}. Queue size: ${booklistFetchQueue.length}`);
            const result = await fetchBooklistCount(item.url, item.element, item.force);

            if (result === 'network') {
                await new Promise(resolve => setTimeout(resolve, getRandomDelay()));
            }
        }

        log('All booklist fetch tasks completed or stopped.');
        isFetching = false;
    }

    function enqueueBooklistFetch(row, index) {
        if (row.dataset.booklistState) return;

        const link = row.cells[1]?.querySelector('a');
        if (!link || !link.href) return;

        let countSpan = row.querySelector('.booklist-count');
        if (!countSpan) {
            countSpan = document.createElement('span');
            countSpan.className = 'booklist-count';
            link.parentNode.appendChild(countSpan);
        }

        if (index < fetchLimit) {
            row.dataset.booklistState = 'queued';
            countSpan.title = '点击刷新';
            countSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                fetchBooklistCount(link.href, countSpan, true);
            });
            booklistFetchQueue.push({ url: link.href, element: countSpan, force: false });
        } else {
            row.dataset.booklistState = 'unfetched';
            countSpan.textContent = '未获取';
            countSpan.title = '点击获取';
            countSpan.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                fetchLimit = index + 20; 
                log(`Fetch limit extended to: ${fetchLimit}`);
                updateDisplay();
            }, { once: true });
        }
    }

    function updateDisplay() {
        if (!categoryFilterControl || !levelFilterControl) return;
        const selectedCategories = categoryFilterControl.getSelected();
        const selectedLevels = levelFilterControl.getSelected();

        categoryFilterControl.container.querySelector('.gm-multiselect-button').classList.toggle('active', selectedCategories.length > 0);
        levelFilterControl.container.querySelector('.gm-multiselect-button').classList.toggle('active', selectedLevels.length > 0);

        allTableRows = Array.from(document.querySelectorAll('.table-bordered tbody tr'));

        let visibleRowIndex = 0;
        allTableRows.forEach(row => {
            const category = row.cells[1]?.textContent.trim().match(/\[(.*?)\]/)?.[1] || '';
            const level = row.cells[4]?.textContent.trim() || '';
            const title = row.cells[1]?.querySelector('a')?.textContent.trim() || '';
            const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(category);
            const levelMatch = selectedLevels.length === 0 || selectedLevels.includes(level);
            const hotwordMatch = !activeHotword || title.includes(activeHotword);
            const isVisible = categoryMatch && levelMatch && hotwordMatch;
            row.style.display = isVisible ? '' : 'none';

            if (isVisible) {
                enqueueBooklistFetch(row, visibleRowIndex);
                visibleRowIndex++;
            }
        });
        log('Display updated. Triggering booklist fetch queue.');
        processFetchQueue();
    }

    function initializeControls(table) {
        if (document.querySelector('.gm-sticky-toolbar')) return;
        log('Initializing controls...');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        if (!thead || !tbody) return;

        allTableRows = Array.from(tbody.querySelectorAll('tr'));
        if (allTableRows.length === 0) return;

        const toolbar = document.createElement('div');
        toolbar.className = 'gm-sticky-toolbar';
        table.parentNode.insertBefore(toolbar, table);
        const analyzeBtn = document.createElement('button');
        analyzeBtn.id = 'gm-analyze-hotwords-btn';
        analyzeBtn.textContent = '书名热词分析';
        toolbar.appendChild(analyzeBtn);

        const headerRow = thead.querySelector('tr');
        if (!headerRow || headerRow.children.length < 5) return;
        const titleHeader = headerRow.children[1];
        const levelHeader = headerRow.children[4];

        const categoryCounts = {};
        const levelCounts = {};
        allTableRows.forEach(r => {
            const category = r.cells[1]?.textContent.trim().match(/\[(.*?)\]/)?.[1];
            const level = r.cells[4]?.textContent.trim();
            if (category) categoryCounts[category] = (categoryCounts[category] || 0) + 1;
            if (level) levelCounts[level] = (levelCounts[level] || 0) + 1;
        });

        const categoriesWithOptions = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }));
        const levelsWithOptions = Object.entries(levelCounts).map(([name, count]) => ({ name, count }));

        categoryFilterControl = createMultiSelect(categoriesWithOptions, "分类", updateDisplay);
        levelFilterControl = createMultiSelect(levelsWithOptions, "等级", updateDisplay);

        titleHeader.appendChild(categoryFilterControl.container);
        levelHeader.appendChild(levelFilterControl.container);

        analyzeBtn.addEventListener('click', analyzeAndDisplayHotwords);

        log('Enqueuing initial visible books for booklist count fetch.');
        updateDisplay(); // Initial call to setup everything

        if (tableBodyObserver) tableBodyObserver.disconnect();
        tableBodyObserver = new MutationObserver((mutations) => {
            const hasAddedNodes = mutations.some(m => m.addedNodes.length > 0);
            if (hasAddedNodes) {
                log('New rows detected, re-applying filter and fetching booklist data.');
                updateDisplay();
            }
        });
        tableBodyObserver.observe(tbody, { childList: true });
        log('Controls initialized and table observer is running.');
    }

    function analyzeAndDisplayHotwords() {
        const toolbar = document.querySelector('.gm-sticky-toolbar');
        let hotwordArea = document.getElementById('gm-hotword-display-area');
        if (hotwordArea) hotwordArea.remove();
        const wordCounts = {};
        const stopWords = new Set(['的', '了', '我', '你', '他', '她', '之', '什么', '一个', '这个', '那个']);
        allTableRows.forEach(r => {
            const originalTitle = r.cells[1]?.querySelector('a')?.textContent.trim();
            if (!originalTitle) return;
            const cleanedTitle = originalTitle.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
            for (let i = 0; i < cleanedTitle.length - 1; i += 2) {
                const word = cleanedTitle.substring(i, i + 2);
                if (word.length === 2 && !stopWords.has(word) && !/\d/.test(word)) {
                    wordCounts[word] = (wordCounts[word] || 0) + 1;
                }
            }
        });
        const sortedWords = Object.entries(wordCounts).sort((a, b) => b[1] - a[1]).slice(0, 30);
        hotwordArea = document.createElement('div');
        hotwordArea.id = 'gm-hotword-display-area';
        toolbar.appendChild(hotwordArea);
        sortedWords.forEach(([word, count]) => {
            const tag = document.createElement('span');
            tag.className = 'gm-hotword-tag';
            tag.textContent = `${word} (${count})`;
            tag.dataset.word = word;
            hotwordArea.appendChild(tag);
        });
        const clearBtn = document.createElement('div');
        clearBtn.id = 'gm-hotword-clear-btn';
        clearBtn.textContent = '清除热词筛选';
        hotwordArea.appendChild(clearBtn);
        hotwordArea.addEventListener('click', e => {
            const target = e.target;
            if (target.classList.contains('gm-hotword-tag')) {
                const word = target.dataset.word;
                if (target.classList.contains('active')) {
                    activeHotword = null;
                    target.classList.remove('active');
                } else {
                    hotwordArea.querySelectorAll('.gm-hotword-tag.active').forEach(t => t.classList.remove('active'));
                    target.classList.add('active');
                    activeHotword = word;
                }
            } else if (target.id === 'gm-hotword-clear-btn') {
                activeHotword = null;
                hotwordArea.querySelectorAll('.gm-hotword-tag.active').forEach(t => t.classList.remove('active'));
            }
            clearBtn.style.display = activeHotword ? 'block' : 'none';
            updateDisplay();
        });
    }

    function createMultiSelect(options, label, onChangeCallback) {
        const container = document.createElement('div');
        container.className = 'gm-multiselect-container';

        container.addEventListener('mousedown', e => {
            e.preventDefault();
            e.stopPropagation();
        });

        const button = document.createElement('button');
        button.className = 'gm-multiselect-button';
        button.textContent = label;
        container.appendChild(button);
        const dropdown = document.createElement('div');
        dropdown.className = 'gm-multiselect-dropdown';
        container.appendChild(dropdown);
        dropdown.innerHTML = `<button class="gm-multiselect-clear-btn">全部取消</button>${options.map(opt => `<label><input type="checkbox" value="${opt.name}"> ${opt.name} (${opt.count})</label>`).join('')}`;

        button.addEventListener('click', e => {
            e.stopPropagation();
            document.querySelectorAll('.gm-multiselect-dropdown.show').forEach(d => { if (d !== dropdown) d.classList.remove('show'); });
            dropdown.classList.toggle('show');
        });

        dropdown.addEventListener('change', () => {
            onChangeCallback();
        });

        dropdown.querySelector('.gm-multiselect-clear-btn').addEventListener('click', e => {
            e.stopPropagation();
            dropdown.querySelectorAll('input:checked').forEach(c => { c.checked = false; });
            onChangeCallback();
        });

        document.addEventListener('click', () => dropdown.classList.remove('show'));
        dropdown.addEventListener('click', e => e.stopPropagation());

        return { container, getSelected: () => Array.from(dropdown.querySelectorAll('input:checked')).map(input => input.value) };
    }

    const initialObserver = new MutationObserver((mutationsList, observer) => {
        const table = document.querySelector('.table-bordered');
        if (table) {
            log('Table element found, initializing script.');
            observer.disconnect();
            initializeControls(table);
        }
    });

    initialObserver.observe(document.body, { childList: true, subtree: true });
    log('Script loaded. Waiting for table element to appear...');

})();