// ==UserScript==
// @name         UI Scraper : Element Text Extractor
// @namespace    http://tampermonkey.net/
// @version      2.1
// @license      MIT
// @description  Advanced UI element text extractor with keyboard shortcuts, export formats, undo functionality, and optimized performance
// @author       MakMak
// @match        http://*/*
// @match        https://*/*
// @icon         https://i.ibb.co/Fk364jmW/table.png
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/541811/UI%20Scraper%20%3A%20Element%20Text%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/541811/UI%20Scraper%20%3A%20Element%20Text%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STATE MANAGEMENT ---
    let isSelecting = false;
    let currentMode = 'list'; // 'list' or 'table'
    let listData = [];
    let tableData = [];
    let tableHeaders = [];
    let currentRow = [];
    let lastHoveredElement = null;
    let extractorEnabled = false;
    let panelEl = null;
    let stylesInjected = false;
    let abortController = null;
    let hoverDebounceTimer = null;
    let autoSaveTimer = null;
    let actionHistory = []; // For undo functionality
    let previewMode = false;
    let menuCommandText = ""; // To store the current menu command text for toggling

    // Enhanced table batch mode state
    let firstRowElements = []; // Store DOM elements from first complete row
    let columnSelectors = []; // Store selectors for each column
    let firstRowCompleted = false; // Track if first row is complete

    // Analyze first row elements to create column-specific selectors
    function analyzeColumnSelectors(elements) {
        const selectors = [];

        elements.forEach((element, index) => {
            const selector = generateElementSelector(element);
            selectors.push({
                columnIndex: index,
                columnName: tableHeaders[index],
                selector: selector,
                element: element,
                tagName: element.tagName.toLowerCase(),
                className: element.className,
                attributes: getRelevantAttributes(element)
            });
        });

        return selectors;
    }

    // Generate a specific selector for an element
    function generateElementSelector(element) {
        const tagName = element.tagName.toLowerCase();
        let selector = tagName;

        // Add class selector if available (excluding our highlight classes)
        const cleanClassName = element.className
            .split(' ')
            .filter(c => !c.startsWith('extractor-'))
            .join('.');

        if (cleanClassName) {
            selector += '.' + cleanClassName;
        }

        // Add attribute selectors for more specificity
        const relevantAttrs = getRelevantAttributes(element);
        relevantAttrs.forEach(attr => {
            if (attr.value && attr.value.length < 50) { // Avoid very long attribute values
                selector += `[${attr.name}="${attr.value}"]`;
            }
        });

        return selector;
    }

    // Get relevant attributes for selector generation
    function getRelevantAttributes(element) {
        const relevantAttrs = ['data-*', 'role', 'type', 'name', 'id'];
        const attrs = [];

        for (let attr of element.attributes) {
            if (relevantAttrs.some(pattern =>
                pattern.includes('*') ? attr.name.startsWith(pattern.replace('*', '')) : attr.name === pattern
            )) {
                attrs.push({ name: attr.name, value: attr.value });
            }
        }

        return attrs;
    }

    // Performance constants
    const HOVER_DEBOUNCE_DELAY = 50;
    const AUTO_SAVE_DELAY = 2000;
    const MAX_HISTORY_SIZE = 50;

    // Smart element selection - elements to ignore
    const IGNORED_ELEMENTS = new Set([
        'SCRIPT', 'STYLE', 'NOSCRIPT', 'META', 'LINK', 'TITLE', 'HEAD',
        'BR', 'HR', 'IMG', 'INPUT', 'BUTTON', 'SELECT', 'TEXTAREA'
    ]);

    // --- UI PANEL HTML ---
    const panelHTML = `
        <div id="extractor-panel" class="extractor-panel-hidden">
            <div class="ex-header">
                📝 Text Extractor <span id="transparency-indicator" style="display: none;">👻</span>
                <div class="ex-header-controls">
                    <button class="ex-minimize-btn" title="Minimize">−</button>
                    <button class="ex-close-btn" title="Close">×</button>
                </div>
            </div>
            <div class="ex-body">
                <div class="ex-controls">
                    <button id="ex-toggle-selection" class="ex-primary-btn">Start Selecting</button>
                    <div class="ex-modes">
                        <label><input type="radio" name="ex-mode" value="list" checked> List</label>
                        <label><input type="radio" name="ex-mode" value="table"> Table</label>
                    </div>
                </div>
                <!-- Manual selector input for List mode -->
                <div id="ex-selector-input" class="ex-selector-controls" style="display:none; margin-top: 8px;">
                    <label for="ex-manual-selector" style="font-size: 12px; font-weight: 600;">CSS Selector:</label>
                    <div class="ex-selector-input-group" style="display:flex; gap: 4px; margin-top: 4px;">
                        <input type="text" id="ex-manual-selector" placeholder="e.g., .product-name, h2.title" title="Enter CSS selector and press Enter" style="flex:1; padding: 6px 8px; font-size: 13px; border: 1px solid #ced4da; border-radius: 6px;">
                        <button id="ex-apply-selector" class="ex-small-btn" title="Apply Selector" style="align-self: center; padding: 6px 10px;">→</button>
                    </div>
                    <div class="ex-selector-info" style="margin-top: 4px; font-size: 11px; color: #6c757d;">
                        <span id="ex-selector-count">0 elements found</span>
                    </div>
                </div>
                <div id="ex-table-setup" style="display: none;">
                    <label for="ex-column-names">Column Names (comma-separated):</label>
                    <input type="text" id="ex-column-names" placeholder="e.g., Name, Price, SKU">
                </div>
                <div class="ex-results">
                    <div class="ex-results-header">
                        <label>Collected Data:</label>
                        <div class="ex-data-controls">
                            <button id="ex-preview-btn" class="ex-small-btn" title="Toggle Preview">👁</button>
                            <button id="ex-undo-btn" class="ex-small-btn" title="Undo Last (Ctrl+Z)">↶</button>
                        </div>
                    </div>
                    <textarea id="ex-extracted-data" rows="8" readonly></textarea>
                </div>
                <div class="ex-actions">
                    <div class="ex-export-group">
                        <button id="ex-copy-btn">Copy</button>
                        <div class="ex-export-dropdown">
                            <button id="ex-export-btn" class="ex-dropdown-btn">Export ▼</button>
                            <div class="ex-export-menu">
                                <button data-format="text">Plain Text</button>
                                <button data-format="json">JSON</button>
                                <button data-format="csv">CSV</button>
                                <button data-format="html">HTML Table</button>
                            </div>
                        </div>
                    </div>
                    <button id="ex-clear-btn">Clear All</button>
                    <button id="ex-batch-btn" title="Select Similar Elements">Batch</button>
                </div>
                <div class="ex-status">
                    <span id="ex-status-text">Mode: List | Ready</span>
                    <span id="ex-shortcuts-hint">Ctrl+K: Toggle | Esc: Stop | Ctrl+Z: Undo | Ctrl+T: Transparency</span>
                </div>
            </div>
        </div>
    `;

    // --- CSS STYLES (Lazy loaded) ---
    const panelCSS = `
        #extractor-panel {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 360px;
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 14px;
            color: #333;
            user-select: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(10px);
        }

        #extractor-panel * {
            box-sizing: border-box;
        }

        .extractor-panel-hidden {
            transform: translateX(100%);
            opacity: 0;
        }

        /* Enhanced dragging styles */
        #extractor-panel.dragging {
            box-shadow: 0 12px 48px rgba(0,0,0,0.25);
            z-index: 9999999;
        }

        #extractor-panel.dragging .ex-header {
            cursor: grabbing;
        }

        /* Semi-transparent mode for better element selection behind panel */
        #extractor-panel.semi-transparent {
            opacity: 0.7;
            pointer-events: none;
        }

        #extractor-panel.semi-transparent .ex-header,
        #extractor-panel.semi-transparent .ex-body {
            pointer-events: auto;
        }

        .ex-header {
            padding: 12px 16px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            cursor: move;
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ex-header-controls {
            display: flex;
            gap: 8px;
        }

        /* Reworked buttons to be perfect circles with centered icons */
        .ex-minimize-btn, .ex-close-btn {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: rgba(255,255,255,0.2);
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            transition: background-color 0.2s;
            padding: 0; /* Remove default padding that skews the circle shape */
            line-height: 1; /* Normalize line-height for better centering */
        }
        .ex-minimize-btn {
            font-weight: bold; /* A bold minus/plus looks better */
        }
        .ex-close-btn {
            font-weight: normal; /* A normal weight '×' is cleaner */
        }
        .ex-minimize-btn:hover, .ex-close-btn:hover {
            background: rgba(255,255,255,0.3);
        }

        .ex-body {
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .ex-controls {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
        }

        .ex-modes {
            display: flex;
            gap: 12px;
            background: #f8f9fa;
            padding: 4px;
            border-radius: 8px;
        }

        .ex-modes label {
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s;
            font-size: 13px;
        }

        .ex-modes label:has(input:checked) {
            background: #667eea;
            color: white;
        }

        .ex-modes input {
            display: none;
        }

        #ex-table-setup {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        #ex-column-names {
            padding: 8px 12px;
            border: 2px solid #e9ecef;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        #ex-column-names:focus {
            outline: none;
            border-color: #667eea;
        }

        .ex-results {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .ex-results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .ex-data-controls {
            display: flex;
            gap: 4px;
        }

        #ex-extracted-data {
            width: 100%;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background-color: #fff;
            resize: vertical;
            min-height: 120px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 13px;
            padding: 12px;
            line-height: 1.5;
            transition: border-color 0.2s;
        }

        #ex-extracted-data:focus {
            outline: none;
            border-color: #667eea;
        }

        .ex-actions {
            display: flex;
            gap: 8px;
            align-items: center;
        }

        .ex-export-group {
            display: flex;
            position: relative;
        }

        .ex-export-dropdown {
            position: relative;
        }

        .ex-export-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: none;
            min-width: 120px;
            z-index: 1000000;
        }

        .ex-export-menu.show {
            display: block;
        }

        .ex-export-menu button {
            width: 100%;
            text-align: left;
            padding: 8px 12px;
            border: none;
            background: none;
            cursor: pointer;
            font-size: 13px;
            transition: background-color 0.2s;
        }

        .ex-export-menu button:hover {
            background: #f8f9fa;
        }

        .ex-export-menu button:first-child {
            border-top-left-radius: 8px;
            border-top-right-radius: 8px;
        }

        .ex-export-menu button:last-child {
            border-bottom-left-radius: 8px;
            border-bottom-right-radius: 8px;
        }

        button {
            padding: 8px 16px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background-color: #ffffff;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            font-size: 13px;
        }

        button:hover {
            border-color: #667eea;
            transform: translateY(-1px);
        }

        .ex-primary-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            font-weight: 600;
        }

        .ex-primary-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .ex-primary-btn.active {
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
        }

        .ex-small-btn {
            padding: 6px 8px;
            font-size: 12px;
            min-width: auto;
        }

        .ex-dropdown-btn {
            border-left: none;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            padding: 8px 12px;
        }

        #ex-copy-btn {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .ex-status {
            font-size: 11px;
            color: #6c757d;
            text-align: center;
            border-top: 1px solid #e9ecef;
            padding-top: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        #ex-shortcuts-hint {
            font-size: 10px;
            opacity: 0.7;
        }

        /* Element Highlighting with improved animations */
        .extractor-hover-highlight {
            outline: 2px solid #667eea !important;
            outline-offset: 2px;
            cursor: crosshair !important;
            animation: pulse-hover 1.5s infinite;
        }

        .extractor-selected-highlight {
            outline: 2px solid #28a745 !important;
            outline-offset: 2px;
            background-color: rgba(40, 167, 69, 0.1) !important;
            animation: flash-select 0.6s ease-out;
        }

        .extractor-preview-highlight {
            outline: 2px dashed #ffc107 !important;
            outline-offset: 2px;
            background-color: rgba(255, 193, 7, 0.1) !important;
        }

        @keyframes pulse-hover {
            0%, 100% { outline-color: #667eea; }
            50% { outline-color: #764ba2; }
        }

        @keyframes flash-select {
            0% { background-color: rgba(40, 167, 69, 0.3) !important; }
            100% { background-color: rgba(40, 167, 69, 0.1) !important; }
        }

        /* Minimized state */
        .ex-body.minimized {
            display: none;
        }

        #extractor-panel.minimized {
            width: 200px;
        }

        /* Responsive adjustments */
        @media (max-width: 480px) {
            #extractor-panel {
                width: calc(100vw - 40px);
                right: 20px;
                left: 20px;
            }
        }

        /* Styles for manual selector input */
        .ex-selector-controls {
            margin: 12px 0;
            padding: 12px;
            background: #f8f9fa;
            border-radius: 6px;
            border: 1px solid #e9ecef;
        }

        .ex-selector-controls label {
            display: block;
            margin-bottom: 6px;
            font-weight: 500;
            color: #495057;
            font-size: 12px;
        }

        .ex-selector-input-group {
            display: flex;
            gap: 6px;
            margin-bottom: 6px;
        }

        #ex-manual-selector {
            flex: 1;
            padding: 8px 10px;
            border: 1px solid #ced4da;
            border-radius: 4px;
            font-size: 12px;
            font-family: 'Courier New', monospace;
            background: white;
        }

        #ex-manual-selector:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
        }

        #ex-apply-selector {
            padding: 8px 12px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            min-width: 32px;
        }

        #ex-apply-selector:hover {
            background: #5a67d8;
        }

        .ex-selector-info {
            font-size: 11px;
            color: #6c757d;
        }

        #ex-selector-count {
            font-weight: 500;
        }

        /* Hide selector input in table mode */
        .ex-selector-controls.hidden {
            display: none;
        }
    `;

    // --- UTILITY FUNCTIONS ---
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Update selector input with current element's selector
    function updateSelectorInput(element) {
        const manualSelectorInput = document.getElementById('ex-manual-selector');
        const selectorCountSpan = document.getElementById('ex-selector-count');

        if (!manualSelectorInput || !selectorCountSpan) return;

        // Generate selector using same logic as batch mode
        const tagName = element.tagName.toLowerCase();
        const className = element.className;

        let selector = tagName;
        if (className) {
            const cleanClassName = className.split(' ').filter(c => !c.startsWith('extractor-')).join('.');
            if (cleanClassName) {
                selector += '.' + cleanClassName;
            }
        }

        // Update input field
        manualSelectorInput.value = selector;

        // Update count
        try {
            const elements = Array.from(document.querySelectorAll(selector))
                .filter(el => !isIgnorableElement(el) && el.innerText.trim().length > 0);
            const count = elements.length;
            selectorCountSpan.textContent = `${count} element${count !== 1 ? 's' : ''} found`;

            // Change color based on count
            if (count === 0) {
                selectorCountSpan.style.color = '#dc3545';
            } else if (count === 1) {
                selectorCountSpan.style.color = '#28a745';
            } else {
                selectorCountSpan.style.color = '#007bff';
            }
        } catch (err) {
            selectorCountSpan.textContent = 'Invalid selector';
            selectorCountSpan.style.color = '#dc3545';
        }
    }

    function isIgnorableElement(element) {
        if (!element || !element.tagName) return true;

        // Check if it's an ignored element type
        if (IGNORED_ELEMENTS.has(element.tagName)) return true;

        // Check if it's part of our extractor UI
        if (element.closest('#extractor-panel')) return true;

        // Check if element has no visible text content
        const text = element.innerText?.trim();
        if (!text || text.length === 0) return true;

        // Check if element is hidden
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return true;

        return false;
    }

    function saveData() {
        const data = {
            listData,
            tableData,
            tableHeaders,
            currentRow,
            currentMode,
            timestamp: Date.now()
        };
        GM_setValue('extractorData', JSON.stringify(data));
    }

    function loadData() {
        try {
            const saved = GM_getValue('extractorData', null);
            if (saved) {
                const data = JSON.parse(saved);
                // Only load if data is recent (within 24 hours)
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    listData = data.listData || [];
                    tableData = data.tableData || [];
                    tableHeaders = data.tableHeaders || [];
                    currentRow = data.currentRow || [];
                    currentMode = data.currentMode || 'list';
                    return true;
                }
            }
        } catch (e) {
            console.warn('Failed to load saved data:', e);
        }
        return false;
    }

    function addToHistory(action) {
        actionHistory.push({
            action,
            timestamp: Date.now(),
            listData: [...listData],
            tableData: tableData.map(row => [...row]),
            tableHeaders: [...tableHeaders],
            currentRow: [...currentRow],
            // Include table batch state in history
            firstRowCompleted,
            columnSelectors: [...columnSelectors]
        });

        // Limit history size
        if (actionHistory.length > MAX_HISTORY_SIZE) {
            actionHistory.shift();
        }
    }

    function scheduleAutoSave() {
        if (autoSaveTimer) {
            clearTimeout(autoSaveTimer);
        }
        autoSaveTimer = setTimeout(saveData, AUTO_SAVE_DELAY);
    }

    // --- EXPORT FUNCTIONS ---
    function exportData(format) {
        let content = '';
        let filename = `extracted-data-${new Date().toISOString().split('T')[0]}`;
        let mimeType = 'text/plain';

        switch (format) {
            case 'json':
                if (currentMode === 'list') {
                    content = JSON.stringify({ items: listData }, null, 2);
                } else {
                    const tableObj = tableData.map(row => {
                        const obj = {};
                        tableHeaders.forEach((header, index) => {
                            obj[header] = row[index] || '';
                        });
                        return obj;
                    });
                    content = JSON.stringify({ headers: tableHeaders, data: tableObj }, null, 2);
                }
                filename += '.json';
                mimeType = 'application/json;charset=utf-8;';
                break;

            case 'csv':
                if (currentMode === 'list') {
                    content = listData.map(item => `"${item.replace(/"/g, '""')}"`).join('\n');
                } else {
                    const csvHeaders = tableHeaders.map(h => `"${h.replace(/"/g, '""')}"`).join(',');
                    const csvRows = tableData.map(row =>
                        row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
                    ).join('\n');
                    content = csvHeaders + '\n' + csvRows;
                }
                filename += '.csv';
                // Set charset and prepend BOM for UTF-8 compatibility (e.g., in Excel)
                mimeType = 'text/csv;charset=utf-8;';
                content = '\uFEFF' + content; // Add UTF-8 Byte Order Mark
                break;

            case 'html':
                if (currentMode === 'list') {
                    const listItems = listData.map(item => `<li>${escapeHtml(item)}</li>`).join('\n');
                    content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Extracted Data</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        ul { list-style-type: disc; padding-left: 20px; }
        li { margin: 5px 0; }
    </style>
</head>
<body>
    <h1>Extracted List Data</h1>
    <ul>
${listItems}
    </ul>
</body>
</html>`;
                } else {
                    const headerRow = tableHeaders.map(h => `<th>${escapeHtml(h)}</th>`).join('');
                    const dataRows = tableData.map(row =>
                        '<tr>' + row.map(cell => `<td>${escapeHtml(cell)}</td>`).join('') + '</tr>'
                    ).join('\n');
                    content = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Extracted Data</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; font-weight: bold; }
        tr:nth-child(even) { background-color: #f9f9f9; }
    </style>
</head>
<body>
    <h1>Extracted Table Data</h1>
    <table>
        <thead>
            <tr>${headerRow}</tr>
        </thead>
        <tbody>
${dataRows}
        </tbody>
    </table>
</body>
</html>`;
                }
                filename += '.html';
                mimeType = 'text/html;charset=utf-8;';
                break;

            default: // text
                if (currentMode === 'list') {
                    content = listData.join('\n');
                } else {
                    content = tableHeaders.join('\t') + '\n';
                    content += tableData.map(row => row.join('\t')).join('\n');
                }
                filename += '.txt';
                mimeType = 'text/plain;charset=utf-8;';
                break;
        }

        // Create and trigger download
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // --- GM MENU FUNCTIONS ---
    function toggleExtractor() {
        extractorEnabled = !extractorEnabled;

        if (extractorEnabled) {
            initExtractor();
        } else {
            destroyExtractor();
        }

        updateMenuCommand();
    }

    // This function now handles a single toggling menu command.
    function updateMenuCommand() {
        // Unregister the previous command to prevent duplicates in some script managers
        if (menuCommandText) {
            GM_unregisterMenuCommand(menuCommandText);
        }

        // Set the new command text based on the extractor's state
        menuCommandText = extractorEnabled ? "🟢 Disable Extractor" : "⚪ Enable Extractor";
        GM_registerMenuCommand(menuCommandText, toggleExtractor);
    }

    function initExtractor() {
        if (panelEl) return; // Already initialized

        // Lazy inject CSS
        if (!stylesInjected) {
            GM_addStyle(panelCSS);
            stylesInjected = true;
        }

        // Create UI
        const container = document.createElement('div');
        container.innerHTML = panelHTML;
        document.body.appendChild(container);

        // Get the actual panel element
        panelEl = document.getElementById('extractor-panel');

        // Load saved data
        if (loadData()) {
            // Update UI to reflect loaded data
            const modeRadio = document.querySelector(`input[name="ex-mode"][value="${currentMode}"]`);
            if (modeRadio) {
                modeRadio.checked = true;
                const tableSetupDiv = document.getElementById('ex-table-setup');
                const selectorInputDiv = document.getElementById('ex-selector-input');
                tableSetupDiv.style.display = currentMode === 'table' ? 'block' : 'none';
                // Initialize selector input visibility based on mode
                selectorInputDiv.style.display = currentMode === 'list' ? 'block' : 'none';
            }
            updateDisplay();
            updateStatus();
        }

        setupEventListeners();

        // Restore saved panel position
        const savedPosition = GM_getValue('panel_position', null);
        if (savedPosition) {
            // Ensure position is still within viewport bounds
            const maxTop = window.innerHeight - panelEl.offsetHeight - 10;
            const maxLeft = window.innerWidth - panelEl.offsetWidth - 10;

            const top = Math.max(10, Math.min(savedPosition.top, maxTop));
            const left = Math.max(10, Math.min(savedPosition.left, maxLeft));

            panelEl.style.top = top + 'px';
            panelEl.style.left = left + 'px';
        }

        // Make panel draggable
        makeDraggable(panelEl);

        // Show panel with animation
        setTimeout(() => {
            if (panelEl) panelEl.classList.remove('extractor-panel-hidden');
        }, 100);
    }

    function destroyExtractor() {
        if (!panelEl) return;

        // Stop any active selection
        if (isSelecting) {
            toggleSelection();
        }

        // Clear timers
        if (hoverDebounceTimer) clearTimeout(hoverDebounceTimer);
        if (autoSaveTimer) clearTimeout(autoSaveTimer);

        // Abort all event listeners
        if (abortController) abortController.abort();

        // Remove UI
        panelEl.parentElement.remove();
        panelEl = null;

        // Clear highlights
        document.querySelectorAll('.extractor-hover-highlight, .extractor-selected-highlight, .extractor-preview-highlight').forEach(el => {
            el.classList.remove('extractor-hover-highlight', 'extractor-selected-highlight', 'extractor-preview-highlight');
        });

        // Reset state
        isSelecting = false;
        lastHoveredElement = null;
        actionHistory = [];
    }

    function setupEventListeners() {
        // Create new AbortController for better event management
        abortController = new AbortController();
        const { signal } = abortController;

        // Get UI Elements
        const toggleBtn = document.getElementById('ex-toggle-selection');
        const modeRadios = document.querySelectorAll('input[name="ex-mode"]');
        const tableSetupDiv = document.getElementById('ex-table-setup');
        const selectorInputDiv = document.getElementById('ex-selector-input');
        const manualSelectorInput = document.getElementById('ex-manual-selector');
        const applySelectorBtn = document.getElementById('ex-apply-selector');
        const selectorCountSpan = document.getElementById('ex-selector-count');
        const copyBtn = document.getElementById('ex-copy-btn');
        const clearBtn = document.getElementById('ex-clear-btn');
        const closeBtn = document.querySelector('.ex-close-btn');
        const minimizeBtn = document.querySelector('.ex-minimize-btn');
        const undoBtn = document.getElementById('ex-undo-btn');
        const previewBtn = document.getElementById('ex-preview-btn');
        const batchBtn = document.getElementById('ex-batch-btn');
        const exportBtn = document.getElementById('ex-export-btn');
        const exportMenu = document.querySelector('.ex-export-menu');

        // Panel event listeners
        toggleBtn.addEventListener('click', toggleSelection, { signal });
        copyBtn.addEventListener('click', copyToClipboard, { signal });
        clearBtn.addEventListener('click', clearData, { signal });
        undoBtn.addEventListener('click', undoLastAction, { signal });
        previewBtn.addEventListener('click', togglePreview, { signal });
        batchBtn.addEventListener('click', toggleBatchMode, { signal });

        closeBtn.addEventListener('click', () => {
            // Automatically disable extractor when closing instead of just hiding
            extractorEnabled = false;
            destroyExtractor();
            updateMenuCommand();
        }, { signal });

        minimizeBtn.addEventListener('click', () => {
            const body = document.querySelector('.ex-body');
            const isMinimized = body.classList.contains('minimized');
            body.classList.toggle('minimized');
            panelEl.classList.toggle('minimized');
            minimizeBtn.textContent = isMinimized ? '−' : '+';
        }, { signal });

        // Export dropdown
        exportBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('show');
        }, { signal });

        // Close export menu when clicking outside
        document.addEventListener('click', () => {
            if (exportMenu.classList.contains('show')) {
                 exportMenu.classList.remove('show');
            }
        }, { signal });

        // Export format buttons
        exportMenu.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const format = btn.dataset.format;
                exportData(format);
                exportMenu.classList.remove('show');

                // Visual feedback
                const originalText = exportBtn.textContent;
                exportBtn.textContent = 'Exported!';
                setTimeout(() => {
                    exportBtn.textContent = originalText;
                }, 1500);
            }, { signal });
        });

        // Mode change listeners
        modeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                currentMode = e.target.value;
                tableSetupDiv.style.display = currentMode === 'table' ? 'block' : 'none';

                // Show or hide manual selector input for list mode
                if (currentMode === 'list') {
                    selectorInputDiv.style.display = 'block';
                } else {
                    selectorInputDiv.style.display = 'none';
                    manualSelectorInput.value = '';
                    selectorCountSpan.textContent = '0 elements found';
                }

                clearData(); // Clear data when switching modes
                updateStatus();
                scheduleAutoSave();
            }, { signal });
        });

        // Manual selector input: apply selector button click
        applySelectorBtn.addEventListener('click', () => {
            applyManualSelector();
        }, { signal });

        // Manual selector input: enter key triggers apply
        manualSelectorInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyManualSelector();
            }
        }, { signal });

        // Real-time validation as user types
        manualSelectorInput.addEventListener('input', () => {
            const selector = manualSelectorInput.value.trim();
            if (!selector) {
                selectorCountSpan.textContent = '0 elements found';
                selectorCountSpan.style.color = '#6c757d';
                clearSelectorPreview();
                return;
            }

            try {
                const elements = Array.from(document.querySelectorAll(selector))
                    .filter(el => !isIgnorableElement(el) && el.innerText.trim().length > 0);
                const count = elements.length;
                selectorCountSpan.textContent = `${count} element${count !== 1 ? 's' : ''} found`;

                // Change color based on count
                if (count === 0) {
                    selectorCountSpan.style.color = '#dc3545';
                } else if (count === 1) {
                    selectorCountSpan.style.color = '#28a745';
                } else {
                    selectorCountSpan.style.color = '#007bff';
                }

                // Preview matching elements
                previewSelectorElements(elements);
            } catch (err) {
                selectorCountSpan.textContent = 'Invalid selector';
                selectorCountSpan.style.color = '#dc3545';
                clearSelectorPreview();
            }
        }, { signal });

        // Clear preview when input loses focus
        manualSelectorInput.addEventListener('blur', () => {
            setTimeout(() => clearSelectorPreview(), 200); // Small delay to allow clicking apply button
        }, { signal });

        // Show preview when input gains focus
        manualSelectorInput.addEventListener('focus', () => {
            const selector = manualSelectorInput.value.trim();
            if (selector) {
                try {
                    const elements = Array.from(document.querySelectorAll(selector))
                        .filter(el => !isIgnorableElement(el) && el.innerText.trim().length > 0);
                    previewSelectorElements(elements);
                } catch (err) {
                    // Ignore errors on focus
                }
            }
        }, { signal });

        // Keyboard shortcuts
        document.addEventListener('keydown', handleKeyboardShortcuts, { signal });

        // Global listeners for selection (with debouncing)
        const debouncedMouseOver = debounce(handleMouseOver, HOVER_DEBOUNCE_DELAY);
        document.addEventListener('mouseover', debouncedMouseOver, { signal });
        document.addEventListener('mouseout', handleMouseOut, { signal });
        document.addEventListener('click', handleElementClick, { capture: true, signal });

        // Apply manual selector function
        function applyManualSelector() {
            const selector = manualSelectorInput.value.trim();
            if (!selector) {
                alert('Please enter a CSS selector.');
                return;
            }
            let elements;
            try {
                elements = Array.from(document.querySelectorAll(selector))
                    .filter(el => !isIgnorableElement(el) && el.innerText.trim().length > 0);
            } catch (err) {
                alert('Invalid CSS selector.');
                return;
            }
            const count = elements.length;
            selectorCountSpan.textContent = `${count} element${count !== 1 ? 's' : ''} found`;

            if (count === 0) {
                alert('No matching elements found for the given selector.');
                return;
            }

            // Confirm adding elements to listData
            if (!confirm(`Found ${count} matching elements. Add all to the list?`)) {
                return;
            }

            addToHistory('manual_selector_add');

            elements.forEach(el => {
                const text = el.innerText.trim();
                if (!listData.includes(text)) {
                    listData.push(text);
                    el.classList.add('extractor-selected-highlight');
                }
            });

            updateDisplay();
            updateStatus();
            scheduleAutoSave();
        }
    }

    // Preview matching elements with highlight
    function previewSelectorElements(elements) {
        clearSelectorPreview();
        elements.forEach(el => {
            el.classList.add('extractor-preview-highlight');
        });
    }

    // Clear selector preview highlights
    function clearSelectorPreview() {
        document.querySelectorAll('.extractor-preview-highlight').forEach(el => {
            el.classList.remove('extractor-preview-highlight');
        });
    }

    // --- KEYBOARD SHORTCUTS ---
    function handleKeyboardShortcuts(e) {
        // Ctrl+K: Toggle selection
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            toggleSelection();
            return;
        }

        // Escape: Stop selecting
        if (e.key === 'Escape' && isSelecting) {
            e.preventDefault();
            toggleSelection();
            return;
        }

        // Ctrl+Z: Undo
        if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            undoLastAction();
            return;
        }

        // Ctrl+E: Toggle extractor
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            toggleExtractor();
            return;
        }

        // Ctrl+T: Toggle panel transparency for better element selection
        if (e.ctrlKey && e.key === 't' && panelEl) {
            e.preventDefault();
            togglePanelTransparency();
            return;
        }

        // Ctrl+Shift+C: Copy data
        if (e.ctrlKey && e.shiftKey && (e.key === 'C' || e.key === 'c')) {
            e.preventDefault();
            copyToClipboard();
            return;
        }
    }

    // --- CORE LOGIC ---
    function toggleSelection() {
        isSelecting = !isSelecting;
        const toggleBtn = document.getElementById('ex-toggle-selection');

        if (isSelecting) {
            toggleBtn.textContent = 'Stop Selecting';
            toggleBtn.classList.add('active');
        } else {
            toggleBtn.textContent = 'Start Selecting';
            toggleBtn.classList.remove('active');
            if (lastHoveredElement) {
                lastHoveredElement.classList.remove('extractor-hover-highlight');
                lastHoveredElement = null;
            }
        }
        updateStatus();
    }

    function handleMouseOver(e) {
        if (!isSelecting || isIgnorableElement(e.target)) return;

        // Clear previous hover highlight
        if (lastHoveredElement && lastHoveredElement !== e.target) {
            lastHoveredElement.classList.remove('extractor-hover-highlight');
        }

        lastHoveredElement = e.target;
        lastHoveredElement.classList.add('extractor-hover-highlight');

        // Auto-populate selector input in List mode
        if (currentMode === 'list') {
            updateSelectorInput(e.target);
        }
    }

    function handleMouseOut(e) {
        if (!isSelecting || !e.target.classList) return;
        e.target.classList.remove('extractor-hover-highlight');
    }

    function handleElementClick(e) {
        if (!isSelecting || isIgnorableElement(e.target)) return;

        e.preventDefault();
        e.stopPropagation();

        const target = e.target;
        target.classList.remove('extractor-hover-highlight');

        const text = target.innerText.trim();
        if (!text) return;

        // Add to history before making changes
        addToHistory('add_element');

        target.classList.add('extractor-selected-highlight');

        if (currentMode === 'list') {
            listData.push(text);
        } else { // Table mode
            if (tableHeaders.length === 0) {
                const columnNames = document.getElementById('ex-column-names').value;
                if (!columnNames) {
                    alert('Please set the column names for the table first!');
                    target.classList.remove('extractor-selected-highlight');
                    // Re-enable selection for this element
                    isSelecting = true;
                    return;
                }
                tableHeaders = columnNames.split(',').map(h => h.trim());
            }

            // Track elements for first row to build column selectors
            if (!firstRowCompleted) {
                firstRowElements.push(target);
            }

            currentRow.push(text);
            if (currentRow.length === tableHeaders.length) {
                tableData.push([...currentRow]);

                // When first row is complete, analyze column selectors
                if (!firstRowCompleted) {
                    firstRowCompleted = true;
                    columnSelectors = analyzeColumnSelectors(firstRowElements);

                    // Update batch button to indicate it's ready for intelligent selection
                    const batchBtn = document.getElementById('ex-batch-btn');
                    if (batchBtn) {
                        batchBtn.title = 'Smart Batch: Select similar table rows';
                        batchBtn.style.background = '#28a745';
                        batchBtn.style.color = 'white';
                    }

                    console.log('First row completed. Column selectors ready:', columnSelectors);
                }

                currentRow = [];
                firstRowElements = []; // Reset for potential next row
            }
        }

        updateDisplay();
        updateStatus();
        scheduleAutoSave();
    }

    function togglePreview() {
        previewMode = !previewMode;
        const previewBtn = document.getElementById('ex-preview-btn');

        if (previewMode) {
            previewBtn.style.background = '#ffc107';
            previewBtn.style.color = 'black';
            showPreview();
        } else {
            previewBtn.style.background = '';
            previewBtn.style.color = '';
            hidePreview();
        }
    }

    function showPreview() {
        // Highlight all selected elements with preview style
        document.querySelectorAll('.extractor-selected-highlight').forEach(el => {
            el.classList.add('extractor-preview-highlight');
        });
    }

    function hidePreview() {
        document.querySelectorAll('.extractor-preview-highlight').forEach(el => {
            el.classList.remove('extractor-preview-highlight');
        });
    }

    // Toggle panel transparency for better element selection
    function togglePanelTransparency() {
        if (!panelEl) return;

        const isTransparent = panelEl.classList.contains('semi-transparent');

        if (isTransparent) {
            panelEl.classList.remove('semi-transparent');
            // Update status to show normal mode
            const statusText = document.getElementById('ex-status-text');
            if (statusText) {
                statusText.textContent = statusText.textContent.replace(' | Transparent', '');
            }
        } else {
            panelEl.classList.add('semi-transparent');
            // Update status to show transparent mode
            const statusText = document.getElementById('ex-status-text');
            if (statusText) {
                statusText.textContent += ' | Transparent';
            }
        }
    }

    function toggleBatchMode() {
        // Enhanced batch mode with different logic for list vs table mode
        if (currentMode === 'list') {
            // Original list mode batch logic
            if (!lastHoveredElement) {
                alert('Hover over an element first to select similar elements in batch mode.');
                return;
            }

            const tagName = lastHoveredElement.tagName;
            const className = lastHoveredElement.className;

            // Find similar elements
            let selector = tagName.toLowerCase();
            if (className) {
                // Filter out script-injected classes from the selector
                const cleanClassName = className.split(' ').filter(c => !c.startsWith('extractor-')).join('.');
                if(cleanClassName) {
                    selector += '.' + cleanClassName;
                }
            }

            const similarElements = Array.from(document.querySelectorAll(selector))
                .filter(el => !isIgnorableElement(el) && el.innerText.trim());

            if (similarElements.length === 0) {
                alert('No similar elements found.');
                return;
            }

            const confirmMsg = `Found ${similarElements.length} similar elements. Add all to selection?`;
            if (!confirm(confirmMsg)) return;

            addToHistory('batch_add');

            similarElements.forEach(el => {
                const text = el.innerText.trim();
                if (!text) return;

                el.classList.add('extractor-selected-highlight');
                if (!listData.includes(text)) {
                    listData.push(text);
                }
            });

        } else {
            // Simplified table mode batch logic using proven List mode approach
            if (!firstRowCompleted) {
                alert('Please complete the first table row manually before using batch mode.\\n\\nThis helps the system understand your table structure and find similar rows intelligently.');
                return;
            }

            if (columnSelectors.length === 0) {
                alert('Column selectors not available. Please try selecting the first row again.');
                return;
            }

            // Use the same proven logic as List mode for each column
            const allSimilarElements = [];

            columnSelectors.forEach((cs, columnIndex) => {
                const tagName = cs.element.tagName;
                const className = cs.element.className;

                // Build selector using same logic as List mode
                let selector = tagName.toLowerCase();
                if (className) {
                    const cleanClassName = className.split(' ').filter(c => !c.startsWith('extractor-')).join('.');
                    if(cleanClassName) {
                        selector += '.' + cleanClassName;
                    }
                }

                // Find all similar elements for this column
                const similarElements = Array.from(document.querySelectorAll(selector))
                    .filter(el => !isIgnorableElement(el) && el.innerText.trim())
                    .filter(el => el !== cs.element); // Exclude the original element

                console.log(`Column ${columnIndex + 1} (${cs.columnName}): Found ${similarElements.length} similar elements with selector "${selector}"`);

                allSimilarElements.push({
                    columnIndex,
                    columnName: cs.columnName,
                    elements: similarElements,
                    selector
                });
            });

            // Find the minimum number of elements across all columns to ensure complete rows
            const minElements = Math.min(...allSimilarElements.map(col => col.elements.length));

            if (minElements === 0) {
                alert('No similar elements found for table batch mode.\\n\\nTry hovering over elements from the same table structure.');
                return;
            }

            const totalElements = minElements * tableHeaders.length;
            const confirmMsg = `Found ${minElements} similar rows with ${tableHeaders.length} columns each.\\n\\nThis will add ${totalElements} elements to your table.\\n\\nContinue?`;
            if (!confirm(confirmMsg)) return;

            addToHistory('batch_add_table_rows');

            // Add elements row by row
            for (let rowIndex = 0; rowIndex < minElements; rowIndex++) {
                const rowData = [];

                allSimilarElements.forEach(columnData => {
                    const element = columnData.elements[rowIndex];
                    if (element) {
                        const text = element.innerText.trim();
                        if (text) {
                            element.classList.add('extractor-selected-highlight');
                            rowData.push(text);
                        }
                    }
                });

                // Only add complete rows
                if (rowData.length === tableHeaders.length) {
                    tableData.push(rowData);
                }
            }
        }

        updateDisplay();
        updateStatus();
        scheduleAutoSave();
    }

    // Find similar table rows based on column selectors from first row


    function undoLastAction() {
        if (actionHistory.length === 0) {
            alert('Nothing to undo.');
            return;
        }

        const lastState = actionHistory.pop();

        // Restore previous state
        listData = [...lastState.listData];
        tableData = lastState.tableData.map(row => [...row]);
        tableHeaders = [...lastState.tableHeaders];
        currentRow = [...lastState.currentRow];

        // Restore table batch mode state from history if available
        if (currentMode === 'table' && lastState.firstRowCompleted !== undefined) {
            firstRowCompleted = lastState.firstRowCompleted;
            columnSelectors = lastState.columnSelectors ? [...lastState.columnSelectors] : [];

            // Update batch button appearance based on restored state
            const batchBtn = document.getElementById('ex-batch-btn');
            if (batchBtn) {
                if (firstRowCompleted && columnSelectors.length > 0) {
                    batchBtn.title = 'Smart Batch: Select similar table rows';
                    batchBtn.style.background = '#28a745';
                    batchBtn.style.color = 'white';
                } else {
                    batchBtn.title = 'Select Similar Elements';
                    batchBtn.style.background = '';
                    batchBtn.style.color = '';
                }
            }
        } else if (currentMode === 'table') {
            // Reset if no history data available
            firstRowElements = [];
            columnSelectors = [];
            firstRowCompleted = false;

            const batchBtn = document.getElementById('ex-batch-btn');
            if (batchBtn) {
                batchBtn.title = 'Select Similar Elements';
                batchBtn.style.background = '';
                batchBtn.style.color = '';
            }
        }

        // This is complex, so for now we just clear all highlights
        // and let the user re-highlight if needed. A more advanced implementation
        // would track individual elements.
        document.querySelectorAll('.extractor-selected-highlight').forEach(el => {
            el.classList.remove('extractor-selected-highlight');
        });

        updateDisplay();
        updateStatus();
        scheduleAutoSave();

        // Visual feedback
        const undoBtn = document.getElementById('ex-undo-btn');
        const originalText = undoBtn.textContent;
        undoBtn.textContent = '✓';
        setTimeout(() => {
            undoBtn.textContent = originalText;
        }, 1000);
    }

    function updateDisplay() {
        const textarea = document.getElementById('ex-extracted-data');
        if (!textarea) return;

        let output = '';
        if (currentMode === 'list') {
            output = listData.join('\n');
        } else {
            if (tableHeaders.length > 0) {
                output = tableHeaders.join('\t') + '\n';
                output += tableData.map(row => row.join('\t')).join('\n');

                // Show current row progress
                if (currentRow.length > 0) {
                    output += (output.length > 0 ? '\n' : '') + 'Next row: ' + currentRow.join('\t');
                }
            }
        }
        textarea.value = output;
        textarea.scrollTop = textarea.scrollHeight;
    }

    function updateStatus() {
        const statusText = document.getElementById('ex-status-text');
        if (!statusText) return;
        let status = `Mode: ${currentMode.charAt(0).toUpperCase() + currentMode.slice(1)}`;

        if (isSelecting) {
            if (currentMode === 'table') {
                if (tableHeaders.length > 0) {
                    status += ` | Row ${tableData.length + 1}, Col ${currentRow.length + 1}/${tableHeaders.length}`;
                } else {
                    status += ` | Set column names first`;
                }
            } else {
                status += ` | Item ${listData.length + 1}`;
            }
        } else {
            const count = currentMode === 'list' ? listData.length : tableData.length;
            status += ` | ${count} items collected`;
        }
        statusText.textContent = status;
    }

    function clearData() {
        // Add to history before clearing
        if (listData.length > 0 || tableData.length > 0) {
            addToHistory('clear_all');
        }

        listData = [];
        tableData = [];
        tableHeaders = [];
        currentRow = [];

        // Reset table batch mode state
        firstRowElements = [];
        columnSelectors = [];
        firstRowCompleted = false;

        // Reset batch button appearance
        const batchBtn = document.getElementById('ex-batch-btn');
        if (batchBtn) {
            batchBtn.title = 'Select Similar Elements';
            batchBtn.style.background = '';
            batchBtn.style.color = '';
        }

        if (isSelecting) {
            toggleSelection();
        }

        document.querySelectorAll('.extractor-selected-highlight, .extractor-preview-highlight').forEach(el => {
            el.classList.remove('extractor-selected-highlight', 'extractor-preview-highlight');
        });

        if (panelEl) {
            document.getElementById('ex-extracted-data').value = '';
            document.getElementById('ex-column-names').value = '';
        }

        updateStatus();
        scheduleAutoSave();
    }

    function copyToClipboard() {
        const textarea = document.getElementById('ex-extracted-data');
        const copyBtn = document.getElementById('ex-copy-btn');
        if (!textarea || !copyBtn) return;

        if (!textarea.value) {
            alert('No data to copy!');
            return;
        }

        navigator.clipboard.writeText(textarea.value).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            copyBtn.style.background = '#28a745';
            copyBtn.style.color = 'white';

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
                copyBtn.style.color = '';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);

            // Fallback: select text for manual copy
            textarea.select();
            textarea.setSelectionRange(0, 99999);
            alert('Could not copy automatically. Text has been selected - press Ctrl+C to copy.');
        });
    }

    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;
        const header = element.querySelector(".ex-header");
        if (!header) return;

        // Enhanced dragging with better UX
        header.style.cursor = 'move';
        header.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            // Prevent dragging when clicking on buttons
            if (e.target.classList.contains('ex-close-btn') || e.target.classList.contains('ex-minimize-btn')) {
                return;
            }

            e.preventDefault();
            isDragging = true;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // Add visual feedback during drag
            element.style.transition = 'none';
            element.style.opacity = '0.9';
            element.style.transform = 'scale(1.02)';

            // Temporarily reduce pointer events on body to prevent interference
            document.body.style.pointerEvents = 'none';
            element.style.pointerEvents = 'auto';

            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;

            // Add class for styling during drag
            element.classList.add('dragging');
        }

        function elementDrag(e) {
            if (!isDragging) return;

            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            const newTop = element.offsetTop - pos2;
            const newLeft = element.offsetLeft - pos1;

            // Better viewport boundary detection with padding
            const padding = 10;
            const maxTop = window.innerHeight - element.offsetHeight - padding;
            const maxLeft = window.innerWidth - element.offsetWidth - padding;

            element.style.top = Math.max(padding, Math.min(newTop, maxTop)) + "px";
            element.style.left = Math.max(padding, Math.min(newLeft, maxLeft)) + "px";
        }

        function closeDragElement() {
            isDragging = false;
            document.onmouseup = null;
            document.onmousemove = null;

            // Restore visual state and pointer events
            element.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
            document.body.style.pointerEvents = 'auto';

            // Remove drag class
            element.classList.remove('dragging');

            // Save position for next session
            const rect = element.getBoundingClientRect();
            GM_setValue('panel_position', {
                top: rect.top,
                left: rect.left
            });
        }

        // Restore last position if available
        const savedPosition = GM_getValue('panel_position', null);
        if (savedPosition) {
            // Use padding equal to that in drag to avoid stuck edges if window resized
            const padding = 10;
            const maxTop = window.innerHeight - element.offsetHeight - padding;
            const maxLeft = window.innerWidth - element.offsetWidth - padding;

            element.style.top = `${Math.min(Math.max(padding, savedPosition.top), maxTop)}px`;
            element.style.left = `${Math.min(Math.max(padding, savedPosition.left), maxLeft)}px`;
        }
    }

    // Toggle panel transparency for better element selection
    function togglePanelTransparency() {
        if (!panelEl) return;

        const isTransparent = panelEl.classList.contains('semi-transparent');
        const transparencyIndicator = document.getElementById('transparency-indicator');

        if (isTransparent) {
            panelEl.classList.remove('semi-transparent');
            if (transparencyIndicator) transparencyIndicator.style.display = 'none';
            // Update status to show normal mode
            const statusText = document.getElementById('ex-status-text');
            if (statusText) {
                statusText.textContent = statusText.textContent.replace(' | Transparent', '');
            }
        } else {
            panelEl.classList.add('semi-transparent');
            if (transparencyIndicator) transparencyIndicator.style.display = 'inline';
            // Update status to show transparent mode
            const statusText = document.getElementById('ex-status-text');
            if (statusText) {
                statusText.textContent += ' | Transparent';
            }
        }
    }

    // --- SCRIPT INITIALIZATION ---
    function init() {
        // Load saved state
        extractorEnabled = false;

        // Register menu command
        updateMenuCommand();

        // Initialize if enabled
        if (extractorEnabled) {
            // Delay initialization to ensure page is fully loaded
            setTimeout(initExtractor, 500);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();