// ==UserScript==
// @name         Google 搜索结果自动收集 (带开关)
// @namespace    http://tampermonkey.net/
// @version      2025-07-22
// @description  自动收集title和url，过滤重复域名，翻页时重置
// @author       AI
// @@version     1.2
// @match        https://www.google.com/*search*
// @match        https://www.google.com.hk/*search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/543268/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543268/Google%20%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E8%87%AA%E5%8A%A8%E6%94%B6%E9%9B%86%20%28%E5%B8%A6%E5%BC%80%E5%85%B3%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Storage Keys ---
    const STORAGE_KEY_RESULTS = 'googleCopier_sessionResults';
    const STORAGE_KEY_SEEN_ITEMS = 'googleCopier_sessionSeenItems'; // Can hold URLs or Hostnames
    const STORAGE_KEY_QUERY = 'googleCopier_sessionQuery';
    const STORAGE_KEY_FILTER_DOMAIN = 'googleCopier_filterDomainEnabled';
    const STORAGE_KEY_RESET_ON_NEXT = 'googleCopier_resetOnNextEnabled';

    // --- Global State ---
    let filterByDomainEnabled = GM_getValue(STORAGE_KEY_FILTER_DOMAIN, false);
    let resetOnNextEnabled = GM_getValue(STORAGE_KEY_RESET_ON_NEXT, false);
    let currentData = {}; // Will be initialized by loadData

    // --- Session Management ---
    (function handleSession() {
        const params = new URLSearchParams(window.location.search);
        const currentQuery = params.get('q') || '';
        const storedQuery = GM_getValue(STORAGE_KEY_QUERY, null);

        if (currentQuery !== storedQuery) {
            console.log(`新搜索已启动。旧关键字: '${storedQuery}', 新关键字: '${currentQuery}'。正在清空旧会话数据。`);
            GM_deleteValue(STORAGE_KEY_RESULTS);
            GM_deleteValue(STORAGE_KEY_SEEN_ITEMS);
            GM_setValue(STORAGE_KEY_QUERY, currentQuery);
        }
    })();

    // --- Data Management ---
    function loadData() {
        let results = GM_getValue(STORAGE_KEY_RESULTS, []);
        let seenItems = new Set(GM_getValue(STORAGE_KEY_SEEN_ITEMS, []));
        if (!Array.isArray(results)) {
            results = [];
            seenItems = new Set();
        }
        currentData = { allUniqueResults: results, seenItems: seenItems };
    }

    function saveData() {
        GM_setValue(STORAGE_KEY_RESULTS, currentData.allUniqueResults);
        GM_setValue(STORAGE_KEY_SEEN_ITEMS, Array.from(currentData.seenItems));
    }

    function resetData() {
        console.log("已收集的数据已清空。");
        GM_deleteValue(STORAGE_KEY_RESULTS);
        GM_deleteValue(STORAGE_KEY_SEEN_ITEMS);
        loadData(); // Reload empty data structures
        updateButtonCounts(0);
    }

    // --- Core Logic ---
    function getGoogleSearchResultsAndStoreUniques() {
        loadData(); // Always load the latest data from storage before collecting
        let newResultsThisPageCount = 0;
        const resultLinkElements = Array.from(document.querySelectorAll('#rso a[href]'))
                                   .filter(a => a.querySelector('h3') && a.href && !a.href.startsWith('javascript:'));

        resultLinkElements.forEach(linkElement => {
            const h3 = linkElement.querySelector('h3');
            if (h3) {
                const title = h3.innerText.trim();
                const url = linkElement.href;
                const hostname = new URL(url).hostname.replace(/^www\./, '');

                const itemToCheck = filterByDomainEnabled ? hostname : url;

                if (title && url && !currentData.seenItems.has(itemToCheck)) {
                    currentData.allUniqueResults.push({ title, url, hostname });
                    currentData.seenItems.add(itemToCheck);
                    newResultsThisPageCount++;
                }
            }
        });

        if (newResultsThisPageCount > 0) {
            console.log(`当前页新增 ${newResultsThisPageCount} 条唯一结果。总共已收集 ${currentData.allUniqueResults.length} 条。`);
        } else {
            console.log(`当前页未找到新的唯一结果。总共已收集 ${currentData.allUniqueResults.length} 条。`);
        }

        saveData();
        updateButtonCounts(currentData.allUniqueResults.length);
    }

    function clickNextPage() {
        const nextPageButton = document.getElementById('pnnext') || document.querySelector('a[aria-label="下一页"]');
        if (nextPageButton && nextPageButton.href) {
            nextPageButton.click();
        } else {
            console.warn("未找到“下一页”按钮，或已到达最后一页。");
        }
    }

    // --- UI Elements ---
    let copyAllButtonGlobal, openUrlsButtonGlobal;

    function updateButtonCounts(count) {
        if (copyAllButtonGlobal) copyAllButtonGlobal.textContent = `复制所有 (${count}) 结果`;
        if (openUrlsButtonGlobal) openUrlsButtonGlobal.textContent = `批量打开 (${count}) 链接`;
    }

    function createCheckbox(id, labelText, isChecked, onChangeCallback) {
        const container = document.createElement('div');
        Object.assign(container.style, { display: 'flex', alignItems: 'center', gap: '5px' });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = id;
        checkbox.checked = isChecked;
        checkbox.onchange = onChangeCallback;
        Object.assign(checkbox.style, { margin: '0', cursor: 'pointer' });

        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = labelText;
        Object.assign(label.style, { fontSize: '13px', color: '#333', cursor: 'pointer', userSelect: 'none' });

        container.appendChild(checkbox);
        container.appendChild(label);
        return container;
    }

    function createControlButtons() {
        if (document.getElementById('googleResultCopierPanel_GM')) return;

        const panel = document.createElement('div');
        panel.id = 'googleResultCopierPanel_GM';
        Object.assign(panel.style, {
            position: 'fixed', top: '20px', right: '20px', zIndex: '2147483647',
            padding: '12px', backgroundColor: 'rgba(240, 240, 240, 0.95)',
            border: '1px solid #bbb', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            display: 'flex', flexDirection: 'column', gap: '10px'
        });

        const titleBar = document.createElement('div');
        titleBar.textContent = '结果收集器';
        Object.assign(titleBar.style, { fontWeight: 'bold', textAlign: 'center', paddingBottom: '8px', borderBottom: '1px solid #ddd' });
        panel.appendChild(titleBar);

        const filterCheckbox = createCheckbox('filterDomainCheckbox', '过滤重复域名', filterByDomainEnabled, (e) => {
            filterByDomainEnabled = e.target.checked;
            GM_setValue(STORAGE_KEY_FILTER_DOMAIN, filterByDomainEnabled);
            console.log(`过滤重复域名已'${filterByDomainEnabled ? '开启' : '关闭'}'。正在重置并重新收集当前页...`);
            resetData();
            getGoogleSearchResultsAndStoreUniques();
        });
        panel.appendChild(filterCheckbox);

        const resetCheckbox = createCheckbox('resetOnNextCheckbox', '翻页时重置', resetOnNextEnabled, (e) => {
            resetOnNextEnabled = e.target.checked;
            GM_setValue(STORAGE_KEY_RESET_ON_NEXT, resetOnNextEnabled);
            console.log(`翻页时重置已'${resetOnNextEnabled ? '开启' : '关闭'}'。`);
        });
        panel.appendChild(resetCheckbox);

        const buttonContainer = document.createElement('div');
        Object.assign(buttonContainer.style, { display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px', borderTop: '1px solid #ddd' });
        panel.appendChild(buttonContainer);

        const buttonConfigs = [
            { text: `复制所有 (0) 结果`, color: '#008CBA', action: () => {
                if (currentData.allUniqueResults.length === 0) { console.log("没有结果可复制。"); return; }
                const excelFormattedText = "Title\tURL\n" + currentData.allUniqueResults.map(r => `${r.title.replace(/[\n\t]/g, ' ')}\t${r.url}`).join('\n');
                navigator.clipboard.writeText(excelFormattedText.trim()).then(() => console.log('复制成功！')).catch(err => console.error('复制失败:', err));
            }, ref: (btn) => { copyAllButtonGlobal = btn; } },
            { text: `批量打开 (0) 链接`, color: '#9C27B0', action: () => {
                if (currentData.allUniqueResults.length === 0) { console.log("没有链接可打开。"); return; }
                currentData.allUniqueResults.forEach((r, i) => setTimeout(() => window.open(r.url, '_blank'), i * 150));
            }, ref: (btn) => { openUrlsButtonGlobal = btn; } },
            // ***** THIS IS THE CORRECTED LOGIC BLOCK *****
            { text: '前往下一页', color: '#f44336', action: () => {
                if (resetOnNextEnabled) {
                    // If reset is enabled, just clear the data and navigate.
                    // The script will automatically collect on the new page.
                    console.log("翻页时重置已启用，正在清空数据并前往下一页...");
                    resetData();
                    clickNextPage();
                } else {
                    // If reset is NOT enabled, collect the current page's data first, then navigate.
                    console.log("正在收集当前页并前往下一页...");
                    getGoogleSearchResultsAndStoreUniques();
                    setTimeout(clickNextPage, 100);
                }
            }},
            { text: '重置当前会话数据', color: '#607D8B', action: () => resetData() }
        ];

        buttonConfigs.forEach(config => {
            const button = document.createElement('button');
            button.textContent = config.text;
            Object.assign(button.style, {
                padding: '10px 15px', backgroundColor: config.color, color: 'white', border: 'none',
                borderRadius: '5px', cursor: 'pointer', fontSize: '14px', textAlign: 'center', transition: 'background-color 0.2s ease'
            });
            button.onmouseover = () => { button.style.opacity = '0.9'; };
            button.onmouseout = () => { button.style.opacity = '1'; };
            button.onclick = config.action;
            if (config.ref) config.ref(button);
            buttonContainer.appendChild(button);
        });

        document.body.appendChild(panel);
        // Load data initially to populate UI
        loadData();
        updateButtonCounts(currentData.allUniqueResults.length);
        console.log("Tampermonkey: 自动结果收集器面板已创建。");
    }

    // --- Script Entry Point ---
    const checkInterval = setInterval(() => {
        if (document.getElementById('rso') || document.getElementById('search')) {
            clearInterval(checkInterval);
            console.log("Google 结果容器已找到，开始自动收集...");
            createControlButtons(); // Create UI first
            getGoogleSearchResultsAndStoreUniques(); // Then collect
        }
    }, 500);

})();