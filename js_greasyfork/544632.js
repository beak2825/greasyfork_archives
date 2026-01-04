// ==UserScript==
// @name         Save bookmarks to Notion
// @name:zh-CN   保存书签到 Notion
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Save web page information to a Notion database with a redesigned, streamlined UI. Main view for mapping, separate view for settings.
// @description:zh-CN 通过重新设计的、流线型的UI，将网页信息保存到Notion数据库。主界面用于字段映射，并有独立的设置界面。
// @author       Ker1
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      api.notion.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544632/Save%20bookmarks%20to%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/544632/Save%20bookmarks%20to%20Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- ICONS ---
    const NOTION_ICON_SVG = `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.2203 3.5H8.77969C8.58333 3.5 8.42373 3.6596 8.42373 3.85596V24.144C8.42373 24.3404 8.58333 24.5 8.77969 24.5H19.2203C19.4167 24.5 19.5763 24.3404 19.5763 24.144V3.85596C19.5763 3.6596 19.4167 3.5 19.2203 3.5Z" fill="black"/><path d="M10.0932 5.25H17.9068V8.75H10.0932V5.25Z" fill="white"/><path d="M10.0932 10.5H17.9068V12.25H10.0932V10.5Z" fill="white"/><path d="M10.0932 14H14.3559V15.75H10.0932V14Z" fill="white"/></svg>`;
    const GEAR_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M19.4399 12.99C19.4399 12.99 19.5199 12.51 19.6199 12.27C19.8799 11.64 20.1199 11.02 20.3499 10.43L21.4999 7.76C21.6599 7.38 21.5599 6.93 21.2499 6.62L19.3799 4.75C19.0699 4.44 18.6199 4.34 18.2399 4.5L15.5699 5.65C14.9799 5.88 14.3599 6.12 13.7299 6.38C13.4899 6.48 12.9999 6.56 12.9999 6.56M12.9999 6.56L12.2699 6.37C11.6399 6.12 11.0199 5.88 10.4299 5.65L7.75994 4.5C7.37994 4.34 6.92994 4.44 6.61994 4.75L4.74994 6.62C4.43994 6.93 4.33994 7.38 4.49994 7.76L5.64994 10.43C5.87994 11.02 6.11994 11.64 6.37994 12.27C6.47994 12.51 6.55994 12.99 6.55994 12.99M6.55994 12.99L6.37994 13.73C6.12994 14.36 5.88994 14.98 5.65994 15.57L4.50994 18.24C4.34994 18.62 4.44994 19.07 4.75994 19.38L6.62994 21.25C6.93994 21.56 7.38994 21.66 7.76994 21.5L10.4399 20.35C11.0299 20.12 11.6499 19.88 12.2799 19.62C12.5199 19.52 12.9999 19.44 12.9999 19.44M12.9999 19.44L13.7299 19.63C14.3599 19.88 14.9799 20.12 15.5699 20.35L18.2399 21.5C18.6199 21.66 19.0699 21.56 19.3799 21.25L21.2499 19.38C21.5599 19.07 21.6599 18.62 21.4999 18.24L20.3499 15.57C20.1199 14.98 19.8799 14.36 19.6199 13.73C19.5199 13.49 19.4399 13.01 19.4399 12.99" stroke="#666" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const BACK_ICON_SVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 18L9 12L15 6" stroke="#333" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;


    // --- CSS STYLES (Apple/macOS Inspired) ---
    GM_addStyle(`
        :root {
            --s2n-bg-color: #f6f6f6;
            --s2n-content-bg: #ffffff;
            --s2n-border-color: #e0e0e0;
            --s2n-text-color: #333333;
            --s2n-text-secondary-color: #666666;
            --s2n-primary-blue: #007aff;
            --s2n-button-secondary-bg: #e9e9eb;
            --s2n-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .s2n-float-button {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background-color: var(--s2n-content-bg);
            border: 1px solid var(--s2n-border-color);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            z-index: 9998;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .s2n-float-button:hover {
            transform: scale(1.08);
            box-shadow: 0 6px 16px rgba(0,0,0,0.12);
        }
        .s2n-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
            z-index: 9999;
            display: none;
            justify-content: center;
            align-items: center;
        }
        .s2n-modal-content {
            background-color: var(--s2n-bg-color);
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            width: 90%;
            max-width: 700px;
            font-family: var(--s2n-font-family);
            max-height: 85vh;
            display: flex;
            flex-direction: column;
            border: 1px solid rgba(0,0,0,0.05);
            overflow: hidden;
        }
        .s2n-modal-header {
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid var(--s2n-border-color);
            flex-shrink: 0;
        }
        .s2n-modal-header h2 {
            margin: 0;
            font-size: 20px;
            font-weight: 600;
            color: var(--s2n-text-color);
        }
        .s2n-icon-button {
            background: none;
            border: none;
            padding: 5px;
            cursor: pointer;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s;
        }
        .s2n-icon-button:hover {
            background-color: var(--s2n-button-secondary-bg);
        }
        .s2n-modal-body {
            overflow-y: auto;
            padding: 20px;
            flex-grow: 1;
        }
        .s2n-view { display: none; }
        .s2n-view.active { display: block; }
        .s2n-form-group {
            margin-bottom: 18px;
        }
        .s2n-form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            font-size: 14px;
            color: var(--s2n-text-color);
        }
        .s2n-form-group input[type="text"],
        .s2n-form-group input[type="password"],
        .s2n-field-mapping-table input,
        .s2n-field-mapping-table select {
            width: 100%;
            padding: 9px 12px;
            border: 1px solid var(--s2n-border-color);
            border-radius: 8px;
            box-sizing: border-box;
            background-color: var(--s2n-content-bg);
            font-size: 14px;
            transition: border-color 0.2s, box-shadow 0.2s;
        }
        .s2n-form-group input:focus,
        .s2n-field-mapping-table input:focus,
        .s2n-field-mapping-table select:focus {
            outline: none;
            border-color: var(--s2n-primary-blue);
            box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.2);
        }
        .s2n-field-mapping-table {
            width: 100%;
            border-collapse: collapse;
            background-color: var(--s2n-content-bg);
            border-radius: 8px;
            border: 1px solid var(--s2n-border-color);
        }
        .s2n-field-mapping-table th,
        .s2n-field-mapping-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid var(--s2n-border-color);
            vertical-align: middle;
        }
        .s2n-field-mapping-table tr:last-child td { border-bottom: none; }
        .s2n-field-mapping-table th {
            font-weight: 500;
            font-size: 13px;
            color: var(--s2n-text-secondary-color);
        }
        .s2n-current-value {
            color: #005a9e;
            font-style: italic;
            font-size: 13px;
            max-width: 150px;
            display: inline-block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            vertical-align: middle;
        }
        .s2n-modal-footer {
            padding: 15px 20px;
            border-top: 1px solid var(--s2n-border-color);
            display: flex;
            justify-content: flex-end;
            align-items: center;
            background-color: #fcfcfc;
            flex-shrink: 0;
        }
        .s2n-status-message {
            margin-right: auto;
            color: var(--s2n-primary-blue);
            font-weight: 500;
        }
        .s2n-button {
            padding: 9px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            margin-left: 10px;
            transition: opacity 0.2s;
        }
        .s2n-button:hover { opacity: 0.85; }
        .s2n-button-primary {
            background-color: var(--s2n-primary-blue);
            color: white;
        }
        .s2n-button-secondary {
            background-color: var(--s2n-button-secondary-bg);
            color: var(--s2n-text-color);
        }
        .s2n-button-danger {
            background-color: #ffe0e0;
            color: #ff3b30;
            padding: 4px 10px;
            font-size: 14px;
            border-radius: 6px;
        }
    `);

    // --- HTML STRUCTURE ---
    const floatButton = document.createElement('div');
    floatButton.className = 's2n-float-button';
    floatButton.innerHTML = NOTION_ICON_SVG;
    document.body.appendChild(floatButton);

    const modalOverlay = document.createElement('div');
    modalOverlay.className = 's2n-modal-overlay';
    modalOverlay.innerHTML = `
        <div class="s2n-modal-content">
            <!-- Main View -->
            <div id="s2n-main-view" class="s2n-view active">
                <div class="s2n-modal-header">
                    <h2>Save to Notion</h2>
                    <button id="s2n-settings-button" class="s2n-icon-button" title="Settings">${GEAR_ICON_SVG}</button>
                </div>
                <div class="s2n-modal-body">
                    <h3 style="font-size: 16px; font-weight: 600; margin: 0 0 10px 0;">Field Mappings</h3>
                    <table class="s2n-field-mapping-table">
                        <thead>
                            <tr>
                                <th>Notion Property</th>
                                <th>Data Source</th>
                                <th>CSS Selector</th>
                                <th>Preview</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="s2n-field-mappings-body"></tbody>
                    </table>
                    <button id="s2n-add-field-button" class="s2n-button s2n-button-secondary" style="margin-top: 15px;">+ Add Field</button>
                </div>
                <div class="s2n-modal-footer">
                    <span id="s2n-status-message-main" class="s2n-status-message"></span>
                    <button id="s2n-save-to-notion-button" class="s2n-button s2n-button-primary">Save to Notion</button>
                </div>
            </div>

            <!-- Settings View -->
            <div id="s2n-settings-view" class="s2n-view">
                <div class="s2n-modal-header">
                    <button id="s2n-back-button" class="s2n-icon-button" title="Back">${BACK_ICON_SVG}</button>
                    <h2>Settings</h2>
                    <span style="width: 34px;"></span> <!-- Spacer -->
                </div>
                <div class="s2n-modal-body">
                    <div class="s2n-form-group">
                        <label for="s2n-api-key">Notion Integration Token</label>
                        <input type="password" id="s2n-api-key" placeholder="secret_...">
                    </div>
                    <div class="s2n-form-group">
                        <label for="s2n-db-id">Notion Database ID</label>
                        <input type="text" id="s2n-db-id" placeholder="32-character database ID">
                    </div>
                </div>
                <div class="s2n-modal-footer">
                    <span id="s2n-status-message-settings" class="s2n-status-message"></span>
                    <button id="s2n-save-config-button" class="s2n-button s2n-button-primary">Save Settings</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // --- DOM REFERENCES ---
    const mainView = document.getElementById('s2n-main-view');
    const settingsView = document.getElementById('s2n-settings-view');
    const settingsButton = document.getElementById('s2n-settings-button');
    const backButton = document.getElementById('s2n-back-button');
    const apiKeyInput = document.getElementById('s2n-api-key');
    const dbIdInput = document.getElementById('s2n-db-id');
    const fieldMappingsBody = document.getElementById('s2n-field-mappings-body');
    const addFieldButton = document.getElementById('s2n-add-field-button');
    const saveConfigButton = document.getElementById('s2n-save-config-button');
    const saveToNotionButton = document.getElementById('s2n-save-to-notion-button');
    const statusMessageMain = document.getElementById('s2n-status-message-main');
    const statusMessageSettings = document.getElementById('s2n-status-message-settings');

    // --- STATE & CONFIG ---
    let config = { apiKey: '', databaseId: '', mappings: [] };

    // --- FUNCTIONS ---

    function showView(viewName) {
        mainView.classList.toggle('active', viewName === 'main');
        settingsView.classList.toggle('active', viewName === 'settings');
        if (viewName === 'main') {
            updatePreviewValues();
        }
    }

    function showModal() {
        modalOverlay.style.display = 'flex';
        loadConfig().then(() => {
            showView('main');
        });
    }

    function hideModal() {
        modalOverlay.style.display = 'none';
        statusMessageMain.textContent = '';
        statusMessageSettings.textContent = '';
    }

    function updatePreviewValues() {
        const rows = fieldMappingsBody.querySelectorAll('tr');
        rows.forEach(row => {
            const sourceType = row.querySelector('.s2n-source-type').value;
            const selector = row.querySelector('.s2n-css-selector').value;
            const valueSpan = row.querySelector('.s2n-current-value');
            if (!valueSpan) return;
            const value = getPageData(sourceType, selector);
            valueSpan.textContent = value ? `${value}` : 'Not found';
            valueSpan.title = value || 'Not found';
        });
    }

    function createFieldMappingRow(mapping = { property: '', source: 'title', selector: '' }) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" class="s2n-property-name" value="${mapping.property}" placeholder="e.g., Name"></td>
            <td>
                <select class="s2n-source-type">
                    <option value="title" ${mapping.source === 'title' ? 'selected' : ''}>Page Title</option>
                    <option value="url" ${mapping.source === 'url' ? 'selected' : ''}>Page URL</option>
                    <option value="description" ${mapping.source === 'description' ? 'selected' : ''}>Page Description</option>
                    <option value="icon" ${mapping.source === 'icon' ? 'selected' : ''}>Page Icon URL</option>
                    <option value="date" ${mapping.source === 'date' ? 'selected' : ''}>Current Date</option>
                    <option value="selection" ${mapping.source === 'selection' ? 'selected' : ''}>Selected Text</option>
                    <option value="selector" ${mapping.source === 'selector' ? 'selected' : ''}>CSS Selector</option>
                </select>
            </td>
            <td><input type="text" class="s2n-css-selector" value="${mapping.selector}" placeholder="e.g., h1.main-title"></td>
            <td><span class="s2n-current-value"></span></td>
            <td><button class="s2n-button-danger s2n-remove-field">&times;</button></td>
        `;
        fieldMappingsBody.appendChild(row);

        const propertyInput = row.querySelector('.s2n-property-name');
        if (mapping.property === '[Page Icon]') {
            propertyInput.readOnly = true;
            propertyInput.style.backgroundColor = '#f0f0f0';
            propertyInput.title = "This special field sets the Notion page's icon. Do not change.";
        }

        const sourceTypeSelect = row.querySelector('.s2n-source-type');
        const selectorInput = row.querySelector('.s2n-css-selector');
        selectorInput.style.display = sourceTypeSelect.value === 'selector' ? 'block' : 'none';

        const handleInputChange = () => {
            selectorInput.style.display = sourceTypeSelect.value === 'selector' ? 'block' : 'none';
            updatePreviewValues();
        };

        sourceTypeSelect.addEventListener('change', handleInputChange);
        selectorInput.addEventListener('input', handleInputChange);
        row.querySelector('.s2n-remove-field').addEventListener('click', () => row.remove());
    }

    async function saveConfig() {
        const mappings = [];
        const rows = fieldMappingsBody.querySelectorAll('tr');
        rows.forEach(row => {
            const property = row.querySelector('.s2n-property-name').value.trim();
            if (property) {
                mappings.push({
                    property: property,
                    source: row.querySelector('.s2n-source-type').value,
                    selector: row.querySelector('.s2n-css-selector').value.trim()
                });
            }
        });

        config = {
            apiKey: apiKeyInput.value.trim(),
            databaseId: dbIdInput.value.trim(),
            mappings: mappings
        };

        await GM_setValue('s2n_config', JSON.stringify(config));
        statusMessageSettings.textContent = 'Settings Saved!';
        setTimeout(() => statusMessageSettings.textContent = '', 3000);
    }

    async function loadConfig() {
        const savedConfig = await GM_getValue('s2n_config', null);
        fieldMappingsBody.innerHTML = '';
        if (savedConfig) {
            config = JSON.parse(savedConfig);
            apiKeyInput.value = config.apiKey || '';
            dbIdInput.value = config.databaseId || '';
            if (config.mappings && config.mappings.length > 0) {
                config.mappings.forEach(mapping => createFieldMappingRow(mapping));
            } else {
                addDefaultMappings();
            }
        } else {
            addDefaultMappings();
        }
    }

    function addDefaultMappings() {
        createFieldMappingRow({ property: 'Name', source: 'title', selector: '' });
        createFieldMappingRow({ property: 'URL', source: 'url', selector: '' });
        createFieldMappingRow({ property: 'Description', source: 'description', selector: '' });
        createFieldMappingRow({ property: 'Icon URL', source: 'icon', selector: '' });
        createFieldMappingRow({ property: 'Icon File', source: 'icon', selector: '' });
        createFieldMappingRow({ property: '[Page Icon]', source: 'icon', selector: '' });
    }

    function getPageData(source, selector) {
        try {
            switch (source) {
                case 'title': return document.title;
                case 'url': return window.location.href;
                case 'description':
                    const metaDesc = document.querySelector('meta[name="description"]');
                    return metaDesc ? metaDesc.content.trim() : '';
                case 'icon':
                    let favicon = document.querySelector('link[rel="icon"]') || document.querySelector('link[rel="shortcut icon"]');
                    if (favicon && favicon.href) return new URL(favicon.href, window.location.href).href;
                    return new URL('/favicon.ico', window.location.href).href;
                case 'date': return new Date().toISOString().split('T')[0];
                case 'selection': return window.getSelection().toString().trim();
                case 'selector':
                    const element = document.querySelector(selector);
                    return element ? element.innerText.trim() : '';
                default: return '';
            }
        } catch (error) {
            console.error(`[Save to Notion] Error getting data for source "${source}":`, error);
            return '';
        }
    }

    function buildNotionPayload() {
        const payload = { parent: { database_id: config.databaseId }, properties: {} };
        let pageIconUrl = '';

        config.mappings.forEach(mapping => {
            const value = getPageData(mapping.source, mapping.selector);
            const propName = mapping.property;
            const propNameLower = propName.toLowerCase().replace(/\s/g, '');

            if (propName === '[Page Icon]') {
                if (value) pageIconUrl = value;
                return;
            }
            if (!value && mapping.source !== 'selection') return;

            let propertyObject;
            if (propNameLower === 'iconfile') {
                propertyObject = { files: [{ type: "external", name: "page_icon_file", external: { url: value } }] };
            } else if (propNameLower === 'name' || propNameLower === 'title') {
                propertyObject = { title: [{ text: { content: value } }] };
            } else if (mapping.source === 'url' || mapping.source === 'icon') {
                propertyObject = { url: value };
            } else if (mapping.source === 'date') {
                propertyObject = { date: { start: value } };
            } else {
                propertyObject = { rich_text: [{ text: { content: value } }] };
            }
            payload.properties[propName] = propertyObject;
        });

        if (pageIconUrl) {
            payload.icon = { type: 'external', external: { url: pageIconUrl } };
        }
        return payload;
    }

    function saveToNotion() {
        if (!config.apiKey || !config.databaseId) {
            alert("Please configure your Notion API Key and Database ID in the Settings tab first.");
            showView('settings');
            return;
        }
        const payload = buildNotionPayload();
        if (Object.keys(payload.properties).length === 0 && !payload.icon) {
            alert("No data could be extracted based on your current mappings. Please check your settings or select some text.");
            return;
        }
        statusMessageMain.textContent = 'Saving...';
        saveToNotionButton.disabled = true;

        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.notion.com/v1/pages',
            headers: {
                'Authorization': `Bearer ${config.apiKey}`,
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            },
            data: JSON.stringify(payload),
            onload: function(response) {
                saveToNotionButton.disabled = false;
                if (response.status >= 200 && response.status < 300) {
                    statusMessageMain.textContent = 'Saved to Notion!';
                    setTimeout(hideModal, 1500);
                } else {
                    const error = JSON.parse(response.responseText);
                    statusMessageMain.textContent = `Error: ${error.message}`;
                    console.error('[Save to Notion] Error:', error);
                }
            },
            onerror: function(response) {
                saveToNotionButton.disabled = false;
                statusMessageMain.textContent = 'Network error. Check console.';
                console.error('[Save to Notion] Network Error:', response);
            }
        });
    }

    // --- EVENT LISTENERS ---
    floatButton.addEventListener('click', showModal);
    modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideModal(); });
    settingsButton.addEventListener('click', () => showView('settings'));
    backButton.addEventListener('click', () => showView('main'));
    addFieldButton.addEventListener('click', () => { createFieldMappingRow(); updatePreviewValues(); });
    saveConfigButton.addEventListener('click', saveConfig);
    saveToNotionButton.addEventListener('click', saveToNotion);

    // --- INITIALIZATION ---
    loadConfig();
})();