// ==UserScript==
// @name         SSTracker – Shopee Spending Tracker
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  Parse shop details, calculate totals, and export data with an enhanced modern interface
// @author       tukangcode (UI Enhanced by AI)
// @match        https://*shopee.co.id/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.7.5/dist/sweetalert2.all.min.js
// @require      https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538963/SSTracker%20%E2%80%93%20Shopee%20Spending%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/538963/SSTracker%20%E2%80%93%20Shopee%20Spending%20Tracker.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Configuration and state management from original script
    const config = {
        isVisible: GM_getValue('parserGuiVisible', true),
        autoShow: GM_getValue('parserAutoShow', true),
        useDiscountPrice: GM_getValue('parserUseDiscount', true),
        darkMode: GM_getValue('parserDarkMode', window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
        history: GM_getValue('parserHistory', [])
    };

    let results = [];
    let isProcessing = false;

    // Add ENHANCED styles for a modern UI/UX
    GM_addStyle(`
        :root {
            --primary-color: #6366f1;
            --primary-hover: #4f46e5;
            --danger-color: #ef4444;
            --danger-hover: #dc2626;
            --success-color: #22c55e;
            --success-hover: #16a34a;

            --light-bg: #ffffff;
            --light-bg-secondary: #f9fafb;
            --light-border: #e5e7eb;
            --light-text: #1f2937;
            --light-text-secondary: #6b7280;

            --dark-bg: #111827;
            --dark-bg-secondary: #1f2937;
            --dark-border: #374151;
            --dark-text: #d1d5db;
            --dark-text-secondary: #9ca3af;
        }

        #order-parser-ui {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 650px;
            min-width: 380px;
            min-height: 250px;
            background: var(--light-bg);
            color: var(--light-text);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            padding: 24px;
            max-height: 90vh;
            overflow: auto;
            display: ${config.isVisible ? 'block' : 'none'};
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            resize: both;
            border: 1px solid var(--light-border);
        }

        #order-parser-ui.dark-mode {
            background: var(--dark-bg);
            color: var(--dark-text);
            border-color: var(--dark-border);
        }

        #order-parser-ui h2 {
            margin-top: 0;
            margin-bottom: 20px;
            font-size: 1.5rem;
            font-weight: 600;
            color: var(--primary-color);
            display: flex;
            align-items: center;
            justify-content: space-between;
            cursor: move;
            user-select: none;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 10px 18px;
            margin-right: 12px;
            margin-bottom: 12px;
            background-color: var(--primary-color);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.95rem;
            font-weight: 500;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .btn:hover, .btn:focus-visible {
            background-color: var(--primary-hover);
            transform: translateY(-2px);
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            outline: none;
        }

        .btn:active {
            transform: translateY(0px);
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .btn.disabled, .btn:disabled {
            background: #9ca3af;
            cursor: not-allowed;
            opacity: 0.6;
            box-shadow: none;
            transform: none;
        }

        .btn.btn-danger { background: var(--danger-color); }
        .btn.btn-danger:hover { background: var(--danger-hover); }
        .btn.btn-success { background: var(--success-color); }
        .btn.btn-success:hover { background: var(--success-hover); }

        .btn-group {
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .tabs {
            display: flex;
            margin-bottom: 20px;
            border-bottom: 1px solid var(--light-border);
        }
        #order-parser-ui.dark-mode .tabs { border-color: var(--dark-border); }

        .tab {
            padding: 10px 18px;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            position: relative;
            color: var(--light-text-secondary);
            font-weight: 500;
        }
        #order-parser-ui.dark-mode .tab { color: var(--dark-text-secondary); }

        .tab:hover, .tab.active { color: var(--primary-color); }
        .tab.active { border-bottom-color: var(--primary-color); }

        .tab-content { display: none; }
        .tab-content.active {
            display: block;
            animation: fadeIn 0.5s;
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

        table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-top: 15px;
            font-size: 0.9rem;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border: 1px solid var(--light-border);
        }
        #order-parser-ui.dark-mode table { border-color: var(--dark-border); }

        th {
            background: var(--light-bg-secondary);
            text-align: left;
            padding: 14px 16px;
            font-weight: 600;
            color: var(--light-text);
            position: sticky;
            top: 0;
            cursor: pointer;
            border-bottom: 1px solid var(--light-border);
        }
        #order-parser-ui.dark-mode th {
            background: var(--dark-bg-secondary);
            color: var(--dark-text);
            border-color: var(--dark-border);
        }
        th:hover { background: #f3f4f6; }
        #order-parser-ui.dark-mode th:hover { background: #374151; }

        td {
            padding: 14px 16px;
            border-bottom: 1px solid var(--light-border);
            vertical-align: top;
        }
        #order-parser-ui.dark-mode td { border-color: var(--dark-border); }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: var(--light-bg-secondary); }
        #order-parser-ui.dark-mode tr:hover td { background: var(--dark-bg-secondary); }

        .truncate {
            max-width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: help;
        }

        pre {
            margin-top: 15px;
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            overflow-x: auto;
            color: #1f2937;
            border: 1px solid #e5e7eb;
        }
        #order-parser-ui.dark-mode pre {
            background: var(--dark-bg-secondary);
            color: var(--dark-text);
            border-color: var(--dark-border);
        }

        .setting-group {
            margin: 20px 0;
            padding: 20px;
            background: var(--light-bg-secondary);
            border-radius: 12px;
            border: 1px solid var(--light-border);
        }
        #order-parser-ui.dark-mode .setting-group {
            background: var(--dark-bg-secondary);
            border-color: var(--dark-border);
        }
        .setting-group h3 { margin-top: 0; color: #4b5563; }
        #order-parser-ui.dark-mode .setting-group h3 { color: #9ca3af; }

        .setting-label {
            display: flex;
            align-items: center;
            margin: 15px 0;
            font-size: 1rem;
        }

        .switch {
            position: relative; display: inline-block;
            width: 44px; height: 22px; margin-right: 12px;
        }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider {
            position: absolute; cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #ccc;
            transition: .3s; border-radius: 22px;
        }
        .slider:before {
            position: absolute; content: "";
            height: 18px; width: 18px;
            left: 3px; bottom: 2px;
            background-color: white;
            transition: .3s; border-radius: 50%;
        }
        input:checked + .slider { background-color: var(--primary-color); }
        input:focus + .slider { box-shadow: 0 0 1px var(--primary-color); }
        input:checked + .slider:before { transform: translateX(20px); }

        textarea {
            width: calc(100% - 22px);
            height: 150px;
            margin-top: 10px;
            font-family: "Fira Code", monospace;
            font-size: 0.9rem;
            padding: 10px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            resize: vertical;
            background: var(--light-bg);
            color: var(--light-text);
        }
        #order-parser-ui.dark-mode textarea {
            background: var(--dark-bg-secondary);
            color: var(--dark-text);
            border-color: #4b5563;
        }

        .empty-state {
            padding: 40px; text-align: center;
            color: var(--light-text-secondary); border: 2px dashed var(--light-border);
            border-radius: 12px; margin-top: 15px;
        }
        #order-parser-ui.dark-mode .empty-state { color: var(--dark-text-secondary); border-color: var(--dark-border); }
        .empty-state i {
            font-size: 3rem; margin-bottom: 15px;
            color: #d1d5db;
        }
        #order-parser-ui.dark-mode .empty-state i { color: #4b5563; }

        .search-box {
            width: calc(100% - 34px);
            padding: 12px 16px;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            margin-bottom: 15px;
            background: var(--light-bg);
            color: var(--light-text);
            font-size: 1rem;
            transition: all 0.2s;
        }
        #order-parser-ui.dark-mode .search-box {
            background: var(--dark-bg-secondary);
            color: var(--dark-text);
            border-color: #4b5563;
        }
        .search-box:focus {
            outline: none;
            border-color: var(--primary-color);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
        }
        #order-parser-ui.dark-mode .search-box:focus { box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2); }
        .search-box::placeholder { color: #9ca3af; }
        #order-parser-ui.dark-mode .search-box::placeholder { color: #6b7280; }

        .history-item {
            padding: 16px; margin-bottom: 10px;
            border-radius: 12px;
            background: var(--light-bg-secondary);
            border: 1px solid var(--light-border);
            cursor: pointer;
            transition: all 0.2s;
        }
        #order-parser-ui.dark-mode .history-item { background: var(--dark-bg-secondary); border-color: var(--dark-border); }
        .history-item:hover {
            background: #f3f4f6;
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        }
        #order-parser-ui.dark-mode .history-item:hover {
            background: #374151;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        .history-date {
            font-size: 0.8rem;
            color: var(--light-text-secondary);
            margin-bottom: 8px;
        }
        #order-parser-ui.dark-mode .history-date { color: var(--dark-text-secondary); }

        .loading {
            position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(5px);
            display: flex; align-items: center; justify-content: center;
            border-radius: 16px;
            z-index: 100000;
        }
        #order-parser-ui.dark-mode .loading {
            background: rgba(17, 24, 39, 0.7);
        }
        .spinner {
            width: 48px; height: 48px;
            border-radius: 50%;
            border: 4px solid rgba(99, 102, 241, 0.2);
            border-top-color: var(--primary-color);
            animation: spin 1s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .tooltip { position: relative; display: inline-block; margin-left: 5px; }
        .tooltip .tooltip-text {
            visibility: hidden; width: 220px;
            background-color: #1f2937;
            color: #ffffff;
            text-align: center; border-radius: 8px;
            padding: 10px; position: absolute;
            z-index: 1; bottom: 130%; left: 50%;
            transform: translateX(-50%);
            opacity: 0; transition: opacity 0.3s;
            font-size: 0.9rem; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .tooltip:hover .tooltip-text, .tooltip:focus .tooltip-text {
            visibility: visible; opacity: 1;
        }

        .sr-only {
            position: absolute; width: 1px; height: 1px;
            padding: 0; margin: -1px; overflow: hidden;
            clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
        }

        .sort-helper-text {
            font-size: 0.85rem; color: var(--light-text-secondary);
            margin-bottom: 8px; margin-top: -7px; padding-left: 4px;
        }
        #order-parser-ui.dark-mode .sort-helper-text { color: var(--dark-text-secondary); }

        .header-controls button {
            background: transparent;
            border: none;
            color: #9ca3af;
            font-size: 1.2rem;
            padding: 5px;
            border-radius: 6px;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, color 0.2s;
        }
        .header-controls button:hover {
            background-color: #f3f4f6;
            color: var(--primary-color);
        }
        #order-parser-ui.dark-mode .header-controls button {
            color: #6b7280;
        }
        #order-parser-ui.dark-mode .header-controls button:hover {
            background-color: #374151;
            color: var(--primary-color);
        }
    `);

    // Create UI with enhanced structure
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="order-parser-ui" class="${config.darkMode ? 'dark-mode' : ''}" role="dialog" aria-label="Shopee Order Parser">
            <div id="loading-overlay" class="loading" style="display: none;" role="alert" aria-busy="true">
                <div class="spinner" aria-label="Loading"></div>
            </div>

            <h2>
                <span>Shopee Order Parser</span>
                <div class="header-controls">
                    <button id="theme-toggle" class="btn-icon" aria-label="Toggle dark mode">
                        <i class="fas ${config.darkMode ? 'fa-sun' : 'fa-moon'}"></i>
                    </button>
                    <button id="close-btn" class="btn-icon" aria-label="Close parser">×</button>
                </div>
            </h2>

            <div class="tabs" role="tablist">
                <div class="tab active" data-tab="parser" role="tab" aria-selected="true" aria-controls="parser-tab">Parser</div>
                <div class="tab" data-tab="history" role="tab" aria-selected="false" aria-controls="history-tab">History</div>
                <div class="tab" data-tab="settings" role="tab" aria-selected="false" aria-controls="settings-tab">Settings</div>
            </div>

            <div id="parser-tab" class="tab-content active" role="tabpanel" aria-labelledby="parser-tab">
                <div class="btn-group">
                    <button class="btn" id="parse-btn" aria-label="Parse orders">
                        <i class="fas fa-search" aria-hidden="true" style="margin-right: 8px;"></i> Parse Orders
                    </button>
                    <button class="btn" id="calc-btn" disabled aria-label="Calculate total">
                        <i class="fas fa-calculator" aria-hidden="true" style="margin-right: 8px;"></i> Calculate Total
                    </button>
                    <button class="btn btn-danger" id="clean-btn" disabled aria-label="Clear results">
                        <i class="fas fa-trash" aria-hidden="true" style="margin-right: 8px;"></i> Clear
                    </button>
                </div>

                <div class="btn-group">
                     <button class="btn btn-success" id="export-md-btn" disabled aria-label="Export as Markdown">
                        <i class="fab fa-markdown" aria-hidden="true" style="margin-right: 8px;"></i> Export Markdown
                    </button>
                    <button class="btn btn-success" id="export-csv-btn" disabled aria-label="Export as CSV">
                        <i class="fas fa-file-csv" aria-hidden="true" style="margin-right: 8px;"></i> Export CSV
                    </button>
                    <button class="btn" id="save-btn" disabled aria-label="Save to history" style="background-color: #8b5cf6;"><i class="fas fa-save" aria-hidden="true" style="margin-right: 8px;"></i> Save to History
                    </button>
                </div>

                <input type="text" id="search-box" class="search-box" placeholder="Search orders..." style="display: none;" aria-label="Search orders">
                <div class="sort-helper-text" style="display: none;">Click table headers to sort.</div>

                <div id="results-container">
                    <div id="empty-state" class="empty-state">
                        <i class="fas fa-receipt" aria-hidden="true"></i>
                        <p>No orders parsed yet. Click "Parse Orders" to begin.</p>
                    </div>
                    <table id="result-table" style="display: none;" role="grid">
                        <thead>
                            <tr>
                                <th data-sort="index" role="columnheader" scope="col">No</th>
                                <th data-sort="shop" role="columnheader" scope="col">Shop Name</th>
                                <th data-sort="item" role="columnheader" scope="col">Item Name</th>
                                <th data-sort="price" role="columnheader" scope="col">Total Order</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </table>
                </div>

                <pre id="grand-total" style="display:none;" role="status" aria-live="polite"></pre>
                <div style="margin-top: 20px;">
                    <h3>Raw Parsed Output</h3>
                    <textarea id="raw-output" readonly placeholder="Parsed shop name, item, and total will appear here..." aria-label="Raw parsed output"></textarea>
                </div>
            </div>

            <div id="history-tab" class="tab-content" role="tabpanel" aria-labelledby="history-tab">
                <div id="history-list"></div>
            </div>

            <div id="settings-tab" class="tab-content" role="tabpanel" aria-labelledby="settings-tab">
                <div class="setting-group">
                    <h3>Display Settings</h3>
                    <label class="setting-label">
                        <span class="switch"><input type="checkbox" id="auto-show-toggle" ${config.autoShow ? 'checked' : ''}><span class="slider"></span></span>
                        Show GUI Automatically
                    </label>
                    <label class="setting-label">
                        <span class="switch"><input type="checkbox" id="dark-mode-toggle" ${config.darkMode ? 'checked' : ''}><span class="slider"></span></span>
                        Dark Mode
                    </label>
                </div>
                <div class="setting-group">
                    <h3>Parser Settings</h3>
                    <label class="setting-label">
                        <span class="switch"><input type="checkbox" id="use-discount-toggle" ${config.useDiscountPrice ? 'checked' : ''}><span class="slider"></span></span>
                        Use Discounted Price
                        <div class="tooltip" role="tooltip" tabindex="0">
                            <i class="fas fa-question-circle" style="margin-left: 8px; color: #9ca3af;"></i>
                            <span class="tooltip-text">When enabled, the parser will use the discounted price instead of the original price if available.</span>
                        </div>
                    </label>
                </div>
                <div class="setting-group">
                    <h3>Keyboard Shortcuts</h3>
                    <p><kbd style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; border: 1px solid #d1d5db;">Ctrl</kbd> + <kbd style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; border: 1px solid #d1d5db;">M</kbd> - Toggle parser</p>
                    <p><kbd style="background: #e5e7eb; padding: 2px 6px; border-radius: 4px; border: 1px solid #d1d5db;">Esc</kbd> - Hide parser</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    // Add Font Awesome
    const fontAwesome = document.createElement('link');
    fontAwesome.rel = 'stylesheet';
    fontAwesome.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesome);

    // DOM References from original script
    const parserUI = document.getElementById('order-parser-ui');
    const parseBtn = document.getElementById('parse-btn');
    const calcBtn = document.getElementById('calc-btn');
    const cleanBtn = document.getElementById('clean-btn');
    const exportMdBtn = document.getElementById('export-md-btn');
    const exportCsvBtn = document.getElementById('export-csv-btn');
    const saveBtn = document.getElementById('save-btn');
    const closeBtn = document.getElementById('close-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const resultTable = document.getElementById('result-table');
    const tableBody = resultTable.querySelector('tbody');
    const emptyState = document.getElementById('empty-state');
    const grandTotalEl = document.getElementById('grand-total');
    const useDiscountToggle = document.getElementById('use-discount-toggle');
    const autoShowToggle = document.getElementById('auto-show-toggle');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const rawOutput = document.getElementById('raw-output');
    const searchBox = document.getElementById('search-box');
    const sortHelper = document.querySelector('.sort-helper-text');
    const loadingOverlay = document.getElementById('loading-overlay');
    const historyList = document.getElementById('history-list');
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    // Draggable functionality from original script
    (function makeDraggable() {
        const panel = parserUI;
        const header = parserUI.querySelector('h2');
        let isDragging = false, offsetX = 0, offsetY = 0;

        header.addEventListener('mousedown', function (e) {
            if (e.target.closest('button')) return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function (e) {
            if (!isDragging) return;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            x = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, x));
            y = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, y));
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.right = 'auto';
        });
        document.addEventListener('mouseup', function () {
            isDragging = false;
            document.body.style.userSelect = '';
        });
    })();

    // Tab functionality from original script
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            tabContents.forEach(c => c.classList.remove('active'));
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const activeTabContent = document.getElementById(`${tab.dataset.tab}-tab`);
            activeTabContent.classList.add('active');
            activeTabContent.setAttribute('aria-hidden', 'false');

            if (tab.dataset.tab === 'history') {
                renderHistory();
            }
        });
    });

    // Theme toggle functionality
    function applyTheme() {
        parserUI.classList.toggle('dark-mode', config.darkMode);
        themeToggle.innerHTML = `<i class="fas ${config.darkMode ? 'fa-sun' : 'fa-moon'}"></i>`;
        GM_setValue('parserDarkMode', config.darkMode);
    }
    themeToggle.addEventListener('click', () => {
        config.darkMode = !config.darkMode;
        applyTheme();
    });

    closeBtn.addEventListener('click', toggleGUI);

    // Sort functionality from original script
    let sortState = { key: 'index', order: 'asc' };
    resultTable.querySelectorAll('th').forEach(header => {
        header.addEventListener('click', () => {
            const sortKey = header.dataset.sort;
            sortState.order = (sortState.key === sortKey && sortState.order === 'asc') ? 'desc' : 'asc';
            sortState.key = sortKey;
            sortResults();
            updateSortIndicators();
        });
    });

    function updateSortIndicators() {
        resultTable.querySelectorAll('th').forEach(th => {
            th.innerHTML = th.innerHTML.replace(/ <i.*<\/i>$/, '');
            if (th.dataset.sort === sortState.key) {
                th.innerHTML += ` <i class="fas fa-sort-${sortState.order === 'asc' ? 'up' : 'down'}"></i>`;
            }
        });
    }

    // Search functionality from original script
    searchBox.addEventListener('input', () => {
        filterResults(searchBox.value.trim().toLowerCase());
    });

    // Settings functionality from original script
    useDiscountToggle.addEventListener('change', function () {
        config.useDiscountPrice = this.checked;
        GM_setValue('parserUseDiscount', config.useDiscountPrice);
    });

    autoShowToggle.addEventListener('change', function () {
        config.autoShow = this.checked;
        GM_setValue('parserAutoShow', config.autoShow);
    });

    darkModeToggle.addEventListener('change', function () {
        config.darkMode = this.checked;
        applyTheme();
    });

    // Helper functions from original script
    function toggleGUI() {
        config.isVisible = !config.isVisible;
        parserUI.style.display = config.isVisible ? 'block' : 'none';
        GM_setValue('parserGuiVisible', config.isVisible);
    }

    function showLoading(show) {
        isProcessing = show;
        loadingOverlay.style.display = show ? 'flex' : 'none';
    }

    function updateButtonStates(hasResults) {
        const buttonsToToggle = [calcBtn, exportMdBtn, exportCsvBtn, cleanBtn, saveBtn];
        buttonsToToggle.forEach(btn => {
            btn.disabled = !hasResults;
        });
        parseBtn.disabled = hasResults;
        searchBox.style.display = hasResults ? 'block' : 'none';
        sortHelper.style.display = hasResults ? 'block' : 'none';
    }

    // Core parsing logic from original script
    function parseAllOrders() {
        showLoading(true);
        setTimeout(() => {
            try {
                const allElements = Array.from(document.querySelectorAll('.UDaMW3, .DWVWOJ, .ylYzwa'));
                let shopName = null;
                results = [];

                for (let i = 0; i < allElements.length; i++) {
                    const el = allElements[i];
                    if (el.classList.contains('UDaMW3')) {
                        shopName = el.textContent.trim();
                    } else if (el.classList.contains('DWVWOJ') && shopName) {
                        const itemName = el.textContent.trim();
                        let priceEl = null;

                        for (let j = i + 1; j < Math.min(i + 10, allElements.length); j++) {
                            if (allElements[j].classList.contains('ylYzwa')) {
                                priceEl = allElements[j];
                                break;
                            }
                        }

                        let totalOrder = 0;
                        if (priceEl) {
                            const priceContainer = priceEl.querySelector('.YRp1mm');
                            const discountedEl = priceContainer?.querySelector('.nW_6Oi, .PNlXhK');
                            const originalEl = priceContainer?.querySelector('.q6Gzj5');

                            if (config.useDiscountPrice && discountedEl) {
                                totalOrder = parseInt(discountedEl.textContent.replace(/\D+/g, ''), 10) || 0;
                            } else if (originalEl) {
                                totalOrder = parseInt(originalEl.textContent.replace(/\D+/g, ''), 10) || 0;
                            } else {
                                const anyPrice = priceEl.querySelector('span');
                                totalOrder = parseInt(anyPrice?.textContent.replace(/\D+/g, '') || '0', 10);
                            }
                        }

                        results.push({
                            shopName,
                            itemName,
                            totalOrder: isNaN(totalOrder) ? 0 : totalOrder
                        });
                    }
                }

                updateUI();
                updateRawOutput();

                if (results.length > 0) {
                    updateButtonStates(true);
                    Swal.fire({
                        title: 'Success!',
                        text: `${results.length} orders parsed successfully.`,
                        icon: 'success',
                        timer: 2000,
                        timerProgressBar: true,
                        showConfirmButton: false
                    });
                } else {
                    Swal.fire({
                        title: 'No Orders Found',
                        text: 'No matching elements found on this page.',
                        icon: 'warning'
                    });
                }
            } catch (error) {
                console.error('Error parsing orders:', error);
                Swal.fire({ title: 'Error', text: 'An error occurred while parsing orders.', icon: 'error' });
            } finally {
                showLoading(false);
            }
        }, 100);
    }

    // UI and data handling functions from original script
    function updateUI() {
        if (results.length === 0) {
            emptyState.style.display = 'block';
            resultTable.style.display = 'none';
            return;
        }

        emptyState.style.display = 'none';
        resultTable.style.display = 'table';
        tableBody.innerHTML = '';

        results.forEach((item, i) => {
            const row = tableBody.insertRow();
            row.dataset.index = i;

            const displayPrice = item.totalOrder > 0 ? `Rp${item.totalOrder.toLocaleString('id-ID')}` : 'N/A';

            row.innerHTML = `
                <td>${i + 1}</td>
                <td class="truncate" title="${item.shopName}">${item.shopName}</td>
                <td class="truncate" title="${item.itemName}">${item.itemName}</td>
                <td>${displayPrice}</td>
            `;
        });
    }

    function sortResults() {
        const { key, order } = sortState;
        const modifier = order === 'asc' ? 1 : -1;

        const sortable = [...results].map((item, index) => ({...item, originalIndex: index}));

        if (key === 'index') {
            sortable.sort((a,b) => (a.originalIndex - b.originalIndex) * modifier);
        } else {
            sortable.sort((a, b) => {
                const valA = a[key];
                const valB = b[key];

                if (typeof valA === 'string') {
                    return valA.localeCompare(valB) * modifier;
                }
                if (typeof valA === 'number') {
                    return (valA - valB) * modifier;
                }
                return 0;
            });
        }
        results = sortable;
        updateUI();
    }

    function filterResults(query) {
        if (!query) {
            Array.from(tableBody.rows).forEach(row => row.style.display = '');
            return;
        }
        Array.from(tableBody.rows).forEach(row => {
            const item = results[parseInt(row.dataset.index)];
            const match = item.shopName.toLowerCase().includes(query) ||
                          item.itemName.toLowerCase().includes(query);
            row.style.display = match ? '' : 'none';
        });
    }

    function updateRawOutput() {
        rawOutput.value = results.map(item =>
            `${item.shopName}\n${item.itemName}\nRp${item.totalOrder.toLocaleString('id-ID')}`
        ).join('\n\n');
    }

    function calculateGrandTotal() {
        const total = results.reduce((sum, item) => sum + item.totalOrder, 0);
        grandTotalEl.style.display = 'block';
        grandTotalEl.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px;">
                <h3 style="margin: 0; font-size: 1.2rem;">Grand Total</h3>
                <span style="font-size: 1.4rem; font-weight: bold; color: var(--primary-color);">Rp${total.toLocaleString('id-ID')}</span>
            </div>
        `;
        Swal.fire({
            title: 'Total Calculated',
            html: `<h3 style="font-weight: 500;">Grand Total: <span style="color: var(--primary-color); font-weight: 700;">Rp${total.toLocaleString('id-ID')}</span></h3>`,
            icon: 'info'
        });
    }

    function cleanResults() {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will clear all parsed data from the current session.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, clear it!'
        }).then((result) => {
            if (result.isConfirmed) {
                results = [];
                updateUI();
                grandTotalEl.style.display = 'none';
                rawOutput.value = '';
                updateButtonStates(false);
                Swal.fire('Cleared!', 'All parsed data has been cleared.', 'success');
            }
        });
    }

    function downloadFile(content, fileName, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function exportMarkdown() {
        let md = "# Shopee Order Summary\n\n";
        md += "| No | Shop Name | Item Name | Total Order |\n";
        md += "|:---|:----------|:----------|:------------|\n";
        results.forEach((item, index) => {
            md += `| ${index + 1} | ${item.shopName.replace(/\|/g, '\\|')} | ${item.itemName.replace(/\|/g, '\\|')} | Rp${item.totalOrder.toLocaleString('id-ID')} |\n`;
        });
        const total = results.reduce((sum, item) => sum + item.totalOrder, 0);
        md += `\n**Grand Total: Rp${total.toLocaleString('id-ID')}**\n`;

        downloadFile(md, `shopee_orders_${new Date().toISOString().slice(0, 10)}.md`, 'text/markdown');
        Swal.fire('Export Complete', 'Markdown file downloaded.', 'success');
    }

    function exportCSV() {
        let csv = 'No;Shop Name;Item Name;Total Order\n';
        results.forEach((item, index) => {
            csv += `"${index + 1}";"${item.shopName.replace(/"/g, '""')}";"${item.itemName.replace(/"/g, '""')}";"${item.totalOrder}"\n`;
        });
        const total = results.reduce((sum, item) => sum + item.totalOrder, 0);
        csv += `\n;;Grand Total;"${total}"`;

        downloadFile('\uFEFF' + csv, `shopee_orders_${new Date().toISOString().slice(0, 10)}.csv`, 'text/csv;charset=utf-8;');
        Swal.fire('Export Complete', 'CSV file downloaded.', 'success');
    }

    function saveToHistory() {
        const historyEntry = {
            date: new Date().toISOString(),
            results: [...results],
            totalAmount: results.reduce((sum, item) => sum + item.totalOrder, 0)
        };

        let history = GM_getValue('parserHistory', []);
        history.unshift(historyEntry);
        if (history.length > 20) history.pop();

        GM_setValue('parserHistory', history);
        config.history = history;

        Swal.fire({
            title: 'Saved!',
            text: 'This order session has been saved to history.',
            icon: 'success',
            timer: 2000,
            showConfirmButton: false,
        });
    }

    function renderHistory() {
        historyList.innerHTML = '';
        if (!config.history || config.history.length === 0) {
            historyList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-history" aria-hidden="true"></i>
                    <p>No saved order history found.</p>
                </div>`;
            return;
        }

        config.history.forEach((entry, index) => {
            const date = new Date(entry.date);
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            historyItem.innerHTML = `
                <div class="history-date">${date.toLocaleString()}</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>${entry.results.length} items</div>
                    <div>Total: <strong>Rp${entry.totalAmount.toLocaleString('id-ID')}</strong></div>
                </div>`;
            historyItem.addEventListener('click', () => {
                Swal.fire({
                    title: `History: ${date.toLocaleDateString()}`,
                    html: `Load ${entry.results.length} items from this session?`,
                    showCancelButton: true,
                    confirmButtonText: 'Load Data',
                    cancelButtonText: 'Close',
                    showDenyButton: true,
                    denyButtonText: 'Delete',
                    denyButtonColor: '#ef4444'
                }).then((result) => {
                    if (result.isConfirmed) {
                        results = [...entry.results];
                        updateUI();
                        updateRawOutput();
                        updateButtonStates(true);
                        document.querySelector('.tab[data-tab="parser"]').click();
                        Swal.fire('Loaded!', 'Historical data has been loaded.', 'success');
                    } else if (result.isDenied) {
                        config.history.splice(index, 1);
                        GM_setValue('parserHistory', config.history);
                        renderHistory();
                        Swal.fire('Deleted!', 'History entry has been removed.', 'success');
                    }
                });
            });
            historyList.appendChild(historyItem);
        });
    }

    // Event listeners from original script
    parseBtn.addEventListener('click', parseAllOrders);
    calcBtn.addEventListener('click', calculateGrandTotal);
    cleanBtn.addEventListener('click', cleanResults);
    exportMdBtn.addEventListener('click', exportMarkdown);
    exportCsvBtn.addEventListener('click', exportCSV);
    saveBtn.addEventListener('click', saveToHistory);

    // Keyboard shortcuts from original script
    window.addEventListener('keydown', e => {
        if (e.key === 'm' && e.ctrlKey) {
            e.preventDefault();
            toggleGUI();
        } else if (e.key === 'Escape' && config.isVisible) {
            toggleGUI();
        }
    });

    // Initialize UI
    if (config.autoShow) {
        parserUI.style.display = 'block';
    } else {
        parserUI.style.display = 'none';
    }
    applyTheme();
    renderHistory();
})();