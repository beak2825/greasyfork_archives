// ==UserScript==
// @name         NYAA Magnet Extractor with Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extract magnet links from sukebei.nyaa.si with filtering, (de)select-all and single-click init
// @author       sauterne
// @match        https://sukebei.nyaa.si/*
// @match        https://nyaa.si/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/538004/NYAA%20Magnet%20Extractor%20with%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/538004/NYAA%20Magnet%20Extractor%20with%20Filter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* ----------  Styles  ---------- */
    GM_addStyle(`
        #magnetHelperPanel {
            background:#333;
            border:1px solid #555;
            border-radius:8px;
            padding:15px;
            margin-bottom:12px;
            color:#eee;
            font-size:14px;
        }
        #magnetHelperPanel input[type="text"],
        #magnetHelperPanel textarea{
            width:100%;
            padding:6px 8px;
            margin:6px 0 10px;
            border:1px solid #666;
            border-radius:4px;
            background:#444;
            color:#eee;
        }
        #magnetHelperPanel button{
            padding:6px 12px;
            margin-right:8px;
            border:none;
            border-radius:4px;
            cursor:pointer;
            background:#007bff;
            color:#fff;
        }
        #magnetHelperPanel button:hover{ background:#0056b3; }
        .magnet-helper-highlight{ background:#556B2F !important; }
        .magnet-helper-checkbox{ margin-right:6px; vertical-align:middle; }
        #magnetHelperTriggerBtn{
            position:fixed;
            bottom:20px; right:20px;
            z-index:9999;
            padding:10px 15px;
            background:#28a745;
            color:#fff;
            border:none;
            border-radius:5px;
            cursor:pointer;
            box-shadow:0 2px 5px rgba(0,0,0,0.3);
        }
        #magnetHelperTriggerBtn:hover{ background:#218838; }
        #magnetHelperPanel .row{margin-bottom:8px;}
        #magnetHelperPanel label{margin-left:4px;}
    `);

    /* ----------  Globals  ---------- */
    let checkboxesAdded = false;
    let panelAdded     = false;
    let torrentRows    = [];

    /* ----------  Elements ---------- */
    const triggerBtn = document.createElement('button');
    triggerBtn.id = 'magnetHelperTriggerBtn';
    triggerBtn.textContent = 'Filter & Extract';
    document.body.appendChild(triggerBtn);

    let panel, searchInput, searchBtn, extractBtn, copyBtn,
        selectAllBox, resultsArea;

    /* ----------  Helper functions ---------- */
    function addCheckboxes() {
        if (checkboxesAdded) return;

        const tableBody = document.querySelector('.torrent-list > tbody');
        if (!tableBody) return;

        torrentRows = Array.from(tableBody.querySelectorAll('tr'));

        torrentRows.forEach(row => {
            // 跳过已加过的行
            if (row.querySelector('.magnet-helper-checkbox')) return;

            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.className = 'magnet-helper-checkbox';
            const firstTd = row.querySelector('td');
            firstTd && firstTd.prepend(cb);
        });

        checkboxesAdded = true;
    }

    function buildPanel() {
        if (panelAdded) return;

        /* --- 容器插入在表格上方 --- */
        panel = document.createElement('div');
        panel.id = 'magnetHelperPanel';
        panel.innerHTML = `
            <div class="row">
                <input type="checkbox" id="magnetSelectAll"><label for="magnetSelectAll">Select All</label>
            </div>
            <div class="row">
                <input type="text" id="magnetSearchInput" placeholder="Enter keyword (e.g., Deadmau)">
                <button id="magnetSearchBtn">Search & Auto-Check</button>
            </div>
            <div class="row">
                <button id="magnetExtractBtn">Extract Selected</button>
                <button id="magnetCopyBtn" style="display:none;">Copy All</button>
            </div>
            <textarea id="magnetResultTextarea" readonly placeholder="Extracted magnet links will appear here..."></textarea>
        `;

        /* 把面板插在 torrent 列表之前 */
        const table = document.querySelector('.torrent-list');
        table.parentNode.insertBefore(panel, table);

        /* 缓存内部节点 */
        searchInput   = panel.querySelector('#magnetSearchInput');
        searchBtn     = panel.querySelector('#magnetSearchBtn');
        extractBtn    = panel.querySelector('#magnetExtractBtn');
        copyBtn       = panel.querySelector('#magnetCopyBtn');
        resultsArea   = panel.querySelector('#magnetResultTextarea');
        selectAllBox  = panel.querySelector('#magnetSelectAll');

        /* --- 事件绑定 --- */
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', e => { if (e.key === 'Enter') handleSearch(); });
        extractBtn.addEventListener('click', handleExtract);
        copyBtn.addEventListener('click', handleCopy);
        selectAllBox.addEventListener('change', toggleSelectAll);

        panelAdded = true;
    }

    function toggleSelectAll() {
        const checked = selectAllBox.checked;
        torrentRows.forEach(r => {
            const cb = r.querySelector('.magnet-helper-checkbox');
            if (cb) cb.checked = checked;
            r.classList.toggle('magnet-helper-highlight', checked);
        });
    }

    function handleSearch() {
        const term = searchInput.value.toLowerCase().trim();
        torrentRows.forEach(r => {
            const cb = r.querySelector('.magnet-helper-checkbox');
            if (!cb) return;

            /* 获取标题文本 */
            let nameCell = r.querySelector('td[colspan="2"]') || r.querySelectorAll('td')[1];
            const txt = (nameCell?.innerText || '').toLowerCase();

            const hit = term && txt.includes(term);
            cb.checked = hit;
            r.classList.toggle('magnet-helper-highlight', hit);
        });
    }

    function handleExtract() {
        const links = [];
        torrentRows.forEach(r => {
            const cb = r.querySelector('.magnet-helper-checkbox');
            if (cb && cb.checked) {
                const a = r.querySelector('a[href^="magnet:"]');
                a && links.push(a.href);
            }
        });
        resultsArea.value = links.join('\n');
        copyBtn.style.display = links.length ? 'inline-block' : 'none';
        alert(links.length ? `Extracted ${links.length} links.` : 'No links selected.');
    }

    function handleCopy() {
        GM_setClipboard(resultsArea.value);
        alert('Copied to clipboard!');
    }

    /* ----------  Trigger button ---------- */
    triggerBtn.addEventListener('click', () => {
        /* 第一次点：先加复选框 + 面板；之后只切换显示状态 */
        if (!checkboxesAdded) addCheckboxes();
        if (!panelAdded)      buildPanel();

        /* 刷新行 cache（如翻页后） */
        const body = document.querySelector('.torrent-list > tbody');
        if (body) torrentRows = Array.from(body.querySelectorAll('tr'));

        /* toggle 显示 */
        panel.style.display = (panel.style.display === 'none' || !panel.style.display) ? 'block' : 'none';
    });
})();
