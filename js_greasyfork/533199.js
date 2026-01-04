// ==UserScript==
// @name         Kmoe屏蔽器
// @author       yaulei
// @version      1.5
// @description  屏蔽含關鍵詞評論，支援添加與管理關鍵詞，依評分設定生效範圍
// @match        *://mox.moe/*
// @match        *://kox.moe/*
// @match        *://koz.moe/*
// @exclude      *://mox.moe/c/10001.htm
// @exclude      *://kox.moe/c/10001.htm
// @exclude      *://koz.moe/c/10001.htm
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1379965
// @downloadURL https://update.greasyfork.org/scripts/533199/Kmoe%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/533199/Kmoe%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const excludedUrls = [
        "https://mox.moe/c/10001.htm",
        "https://kox.moe/c/10001.htm"
    ];

    const currentUrl = window.location.href;
    if (excludedUrls.includes(currentUrl)) return;

    const STORAGE_KEY = 'kox_block_keywords';
    const RATING_FILTER_KEY = 'kox_rating_filters';

    // ===== UI 元素創建 =====

    // 外層容器（固定在左下角）
    const uiWrapper = document.createElement('div');
    uiWrapper.style.position = 'fixed';
    uiWrapper.style.bottom = '20px';
    uiWrapper.style.left = '20px';
    uiWrapper.style.zIndex = '9999';
    uiWrapper.style.fontSize = '14px';
    uiWrapper.style.maxWidth = '260px';

    // 主按鈕：打開設定面板
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '屏蔽器設定';
    toggleButton.style.width = '100%';
    toggleButton.style.marginBottom = '6px';

    // 面板容器（初始隱藏）
    const panel = document.createElement('div');
    panel.style.display = 'none';
    panel.style.background = 'white';
    panel.style.border = '1px solid #ccc';
    panel.style.borderRadius = '8px';
    panel.style.padding = '8px';
    panel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    panel.style.marginTop = '6px';


    // 按鈕切換面板顯示
    toggleButton.onclick = () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    };

    // ===== 添加屏蔽詞輸入欄 =====

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = '輸入詞語（多個詞使用空格分隔）';
    input.style.width = '100%';
    input.style.marginTop = '4px';

    const addButton = document.createElement('button');
    addButton.textContent = '添加';
    addButton.style.marginTop = '4px';
    addButton.style.width = '100%';

    panel.appendChild(input);
    panel.appendChild(addButton);

    // ===== 屏蔽範圍選擇（折疊區塊） =====

    const ratingSection = document.createElement('details');
    const ratingSummary = document.createElement('summary');
    ratingSummary.textContent = '屏蔽範圍';
    ratingSection.appendChild(ratingSummary);

    const ratingOptions = ["未评分", "1", "2", "3", "4", "5"];
    const selectedRatings = new Set(JSON.parse(localStorage.getItem(RATING_FILTER_KEY)) || ratingOptions);

    ratingOptions.forEach(label => {
        const btn = document.createElement('button');
        btn.textContent = label;
        btn.style.margin = '2px';
        btn.style.padding = '2px 5px';
        btn.style.border = '1px solid #888';
        btn.style.borderRadius = '4px';
        btn.style.background = selectedRatings.has(label) ? '#ccc' : '#fff';

        btn.onclick = () => {
            if (selectedRatings.has(label)) {
                selectedRatings.delete(label);
                btn.style.background = '#fff';
            } else {
                selectedRatings.add(label);
                btn.style.background = '#ccc';
            }
            localStorage.setItem(RATING_FILTER_KEY, JSON.stringify(Array.from(selectedRatings)));
            hideComments();
        };
        ratingSection.appendChild(btn);
    });

    panel.appendChild(ratingSection);

    // ===== 屏蔽詞管理區塊（折疊） =====

    const section = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = '屏蔽詞管理';
    section.appendChild(summary);

    const keywordList = document.createElement('div');
    keywordList.style.display = 'flex';
    keywordList.style.flexWrap = 'wrap';
    keywordList.style.gap = '6px';
    keywordList.style.marginTop = '6px';

    section.appendChild(keywordList);
    panel.appendChild(section);

    // ===== 關鍵詞管理邏輯 =====

    function getKeywords() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    }

    function saveKeywords(list) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    function updateKeywordList() {
        keywordList.innerHTML = '';
        getKeywords().forEach((kw, i) => {
            const item = document.createElement('span');
            item.textContent = kw;
            item.style.border = '1px solid #ccc';
            item.style.padding = '2px 6px';
            item.style.borderRadius = '4px';
            item.style.background = '#f5f5f5';
            item.style.display = 'inline-flex';
            item.style.alignItems = 'center';

            const del = document.createElement('button');
            del.textContent = 'x';
            del.style.marginLeft = '4px';
            del.onclick = () => {
                const updated = getKeywords().filter((_, idx) => idx !== i);
                saveKeywords(updated);
                updateKeywordList();
                hideComments();
            };
            item.appendChild(del);
            keywordList.appendChild(item);
        });
    }

    function addKeywords() {
        const newWords = input.value.trim().split(/\s+/);
        if (!newWords.length || newWords[0] === '') return;
        const current = getKeywords();
        const updated = [...new Set([...current, ...newWords])];
        saveKeywords(updated);
        input.value = '';
        updateKeywordList();
        hideComments();
    }

    addButton.onclick = addKeywords;
    input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addKeywords();
        }
    });

    // ===== 評論過濾邏輯 =====

    function hideComments() {
        const keywords = getKeywords();
        const ratingSet = new Set(JSON.parse(localStorage.getItem(RATING_FILTER_KEY)) || ratingOptions);
        const commentElements = document.querySelectorAll('td[id^="comm_cont_"]');

        commentElements.forEach(comment => {
            const text = comment.innerText || comment.textContent;
            const ratingMatch = text.match(/對本書評價\s*:\s*(\d)\s*星/);
            const rating = ratingMatch ? ratingMatch[1] : "未评分";
            const match = keywords.some(kw => text.includes(kw));
            comment.style.display = match && ratingSet.has(rating) ? 'none' : '';
        });
    }

    // 點擊非 UI 區域自動折疊設定面板
    document.addEventListener('click', function(e) {
        if (!uiWrapper.contains(e.target)) {
            panel.style.display = 'none';
        }
    });

    // 初始化 UI
    uiWrapper.appendChild(toggleButton);
    uiWrapper.appendChild(panel);
    document.body.appendChild(uiWrapper);

    updateKeywordList();
    hideComments();

    // 監控 DOM 動態變更，自動重新篩選
    const observer = new MutationObserver(hideComments);
    observer.observe(document.body, { childList: true, subtree: true });
})();

