// ==UserScript==
    // @name         123FastLink (最新侧边菜单栏按钮适配新UI)
    // @namespace    http://tampermonkey.net/
    // @version      1.2.1
    // @description  基于@Bao-qing (2025-01-29)，@微風子 (1.3.1)，@Cursor (1.0.6) 版本的分支。最新全侧边菜单栏按钮适配新UI
    // @author       Cursor, Gemini
    // @match        *://www.123pan.com/*
    // @match        *://*.123pan.com/*
    // @match        *://*.123pan.cn/*
    // @match        *://*.123865.com/*
    // @match        *://*.123684.com/*
    // @match        *://*.123912.com/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
    // @license      MIT
    // @grant        GM_setClipboard
    // @grant        GM_addStyle
    // @grant        GM_getValue
    // @grant        GM_setValue
    // @license      Apache-2.0
    // @match        https://pan.quark.cn/*
    // @match        https://drive.quark.cn/*
    // @match        https://pan.quark.cn/s/*
    // @match        https://drive.quark.cn/s/*
    // @match        https://cloud.189.cn/web/*
    // @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0OCA0OCI+PHBhdGggZmlsbD0iIzRjYWY1MCIgZD0iTTI0IDRDMTIuOTUgNCA0IDEyLjk1IDQgMjRzOC45NSAyMCAyMCAyMCAyMC04Ljk1IDIwLTIwUzM1LjA1IDQgMjQgNHptLTQgMzBsLTgtOCAyLjgzLTIuODNMNTIgMjQuMzRsNi4xNy02LjE3TDYxIDIxbC0xMSAxMXoiLz48L3N2Zz4=
    // @grant        GM_setClipboard
    // @grant        GM_notification
    // @grant        GM_xmlhttpRequest
    // @grant        GM_cookie
    // @grant        GM_getValue
    // @grant        GM_setValue
    // @run-at       document-end
    // @connect      drive.quark.cn
    // @connect      drive-pc.quark.cn
    // @connect      pc-api.uc.cn
    // @connect      cloud.189.cn
// @downloadURL https://update.greasyfork.org/scripts/542980/123FastLink%20%28%E6%9C%80%E6%96%B0%E4%BE%A7%E8%BE%B9%E8%8F%9C%E5%8D%95%E6%A0%8F%E6%8C%89%E9%92%AE%E9%80%82%E9%85%8D%E6%96%B0UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542980/123FastLink%20%28%E6%9C%80%E6%96%B0%E4%BE%A7%E8%BE%B9%E8%8F%9C%E5%8D%95%E6%A0%8F%E6%8C%89%E9%92%AE%E9%80%82%E9%85%8D%E6%96%B0UI%29.meta.js
    // ==/UserScript==

    (function() {
        'use strict';

        // --- Constants and Configuration ---
        const SCRIPT_NAME = "123FastLink";
        const SCRIPT_VERSION = "1.1.0";
        const debugMode = true; // 启用调试模式以显示详细处理信息
        const LEGACY_FOLDER_LINK_PREFIX_V1 = "123FSLinkV1$";
        const COMMON_PATH_LINK_PREFIX_V1 = "123FLCPV1$";
        const LEGACY_FOLDER_LINK_PREFIX_V2 = "123FSLinkV2$";
        const COMMON_PATH_LINK_PREFIX_V2 = "123FLCPV2$";
        const COMMON_PATH_DELIMITER = "%";
        const BASE62_CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        const API_PATHS = {
            UPLOAD_REQUEST: "/b/api/file/upload_request",
            LIST_NEW: "/b/api/file/list/new",
            FILE_INFO: "/b/api/file/info",
            SHARE_LIST: "/b/api/share/get",
            FOLDER_DETAIL: "/b/api/file/detail"
        };
    const DOM_SELECTORS = {

            // 定位顶部操作区的下拉触发按钮（如“上传”“离线下载”）

            TARGET_BUTTON_AREA: '.home-operator-button-group .ant-dropdown-trigger',

            // 定位文件行（表格模式下的行是 div.ant-table-row，需将 tr 改为 div）

            FILE_ROW_SELECTOR: 'div.ant-table-row[data-row-key], .tiled-list-item-wrap.file-wrapper[data-file], .file-item[data-file], .column-file-item[data-file], .file-card[data-file], .item-container[data-file], .list-item[data-file], .grid-item[data-file]',

            // 定位文件行内的复选框（限定在表格的选择列中）

            FILE_CHECKBOX_SELECTOR: '.ant-table-selection-column input[type="checkbox"], .file-select-checkbox input[type="checkbox"]'

        };

        const RETRY_AND_DELAY_CONFIG = {
            RATE_LIMIT_ITEM_RETRY_DELAY_MS: 5000,
            RATE_LIMIT_MAX_ITEM_RETRIES: 2,
            RATE_LIMIT_GLOBAL_PAUSE_TRIGGER_FAILURES: 3,
            RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS: 8000,
            GENERAL_API_RETRY_DELAY_MS: 3000,
            GENERAL_API_MAX_RETRIES: 0,
            PROACTIVE_DELAY_MS: 50
        };

        const FILTER_CONFIG = {
            STORAGE_KEY: 'fastlink_filter_settings',
            DEFAULT_FILTERS: [
                { ext: 'nfo', name: '电影信息文件', emoji: '📝', enabled: true },
                { ext: 'jpg', name: '图片文件', emoji: '🖼️', enabled: true },
                { ext: 'jpeg', name: '图片文件', emoji: '🖼️', enabled: false },
                { ext: 'png', name: '图片文件', emoji: '🖼️', enabled: true },
                { ext: 'gif', name: '动图文件', emoji: '🎞️', enabled: false },
                { ext: 'bmp', name: '图片文件', emoji: '🖼️', enabled: false },
                { ext: 'webp', name: '图片文件', emoji: '🖼️', enabled: false },
                { ext: 'tif', name: '图片文件', emoji: '🖼️', enabled: false },
                { ext: 'tiff', name: '图片文件', emoji: '🖼️', enabled: false },
                { ext: 'txt', name: '文本文件', emoji: '📄', enabled: false },
                { ext: 'srt', name: '字幕文件', emoji: '💬', enabled: false },
                { ext: 'ass', name: '字幕文件', emoji: '💬', enabled: false },
                { ext: 'ssa', name: '字幕文件', emoji: '💬', enabled: false },
                { ext: 'vtt', name: '字幕文件', emoji: '💬', enabled: false },
                { ext: 'sub', name: '字幕文件', emoji: '💬', enabled: false },
                { ext: 'idx', name: '字幕索引', emoji: '🔍', enabled: false },
                { ext: 'xml', name: 'XML文件', emoji: '🔧', enabled: false },
                { ext: 'html', name: '网页文件', emoji: '🌐', enabled: false },
                { ext: 'htm', name: '网页文件', emoji: '🌐', enabled: false },
                { ext: 'url', name: '网址链接', emoji: '🔗', enabled: false },
                { ext: 'lnk', name: '快捷方式', emoji: '🔗', enabled: false },
                { ext: 'pdf', name: 'PDF文档', emoji: '📑', enabled: false },
                { ext: 'doc', name: 'Word文档', emoji: '📘', enabled: false },
                { ext: 'docx', name: 'Word文档', emoji: '📘', enabled: false },
                { ext: 'xls', name: 'Excel表格', emoji: '📊', enabled: false },
                { ext: 'xlsx', name: 'Excel表格', emoji: '📊', enabled: false },
                { ext: 'ppt', name: 'PPT演示', emoji: '📽️', enabled: false },
                { ext: 'pptx', name: 'PPT演示', emoji: '📽️', enabled: false },
                { ext: 'md', name: 'Markdown文件', emoji: '📝', enabled: false },
                { ext: 'torrent', name: '种子文件', emoji: '🧲', enabled: false },
            ],
            DEFAULT_FILTER_OPTIONS: {
                filterOnShareEnabled: false,
                filterOnTransferEnabled: false,
            }
        };

        const API_ERROR_CODES = {
            STORAGE_SPACE_EXCEEDED: {
                code: 5055,
                message: "云盘空间超出限制",
                shouldNotRetry: true
            }
            // Add more error codes here as needed
        };

        // Add settings manager
        const settingsManager = {
            settings: {
                debugMode: false,
                useFolderNameForJson: true,
                appendDateToJson: true,
                usesBase62EtagsInExport: true
            },
            init: function() {
                // Load settings from storage
                const savedSettings = localStorage.getItem('123FastLink_settings');
                if (savedSettings) {
                    try {
                        this.settings = JSON.parse(savedSettings);
                    } catch (e) {
                        console.error(`[${SCRIPT_NAME}] Failed to load settings:`, e);
                    }
                }
            },
            save: function() {
                localStorage.setItem('123FastLink_settings', JSON.stringify(this.settings));
            },
            get: function(key) {
                return this.settings[key];
            },
            set: function(key, value) {
                this.settings[key] = value;
                this.save();
            },
            isDebugMode: function() {
                return this.get('debugMode');
            }
        };

        const apiTestManager = {
            getApiPathOptions: function() {
                return Object.entries(API_PATHS).map(([key, path]) => ({
                    value: path,
                    label: `${key} (${path})`
                }));
            },
            getRequiredParams: function(apiPath) {
                // Define required parameters for each API path
                const paramMap = {
                    [API_PATHS.FOLDER_DETAIL]: ['fileID'],
                    [API_PATHS.FILE_INFO]: ['fileIdList'],
                    [API_PATHS.LIST_NEW]: [
                        'driveId',
                        'limit',
                        'next',
                        'orderBy',
                        'orderDirection',
                        'trashed',
                        'SearchData',
                        'OnlyLookAbnormalFile',
                        'event',
                        'operateType',
                        'inDirectSpace',
                        'parentFileId',
                        'Page'
                    ],
                    [API_PATHS.SHARE_LIST]: ['shareKey'],
                    [API_PATHS.UPLOAD]: ['fileName', 'parentFileId', 'size']
                };
                return paramMap[apiPath] || [];
            },
            getDefaultParams: function(apiPath) {
                const defaultParams = {
                    [API_PATHS.LIST_NEW]: {
                        driveId: 0,
                        limit: 100,
                        next: 0,
                        orderBy: "file_name",
                        orderDirection: "asc",
                        trashed: false,
                        SearchData: "",
                        OnlyLookAbnormalFile: 0,
                        event: "homeListFile",
                        operateType: 4,
                        inDirectSpace: false,
                        parentFileId: 0,
                        Page: 1
                    }
                };
                return defaultParams[apiPath] || {};
            },
            async testApi(apiPath, params, retryCount = null, method = 'POST') {
                try {
                    // Create a function that returns a Promise for the API call
                    const apiCall = async () => {
                        const response = await apiHelper.sendRequest(method, apiPath, params);
                        if (!response) {
                            throw new Error('服务器返回空响应');
                        }
                        if (response.code !== 0) {
                            throw new Error(`API错误: ${response.message || '未知错误'} (代码: ${response.code})`);
                        }
                        return response;
                    };

                    let response;
                    if (retryCount === null || retryCount === 0) {
                        // No retry, just make the API call once
                        response = await apiCall();
                    } else {
                        // Implement our own retry logic
                        let attempts = 0;
                        let lastError = null;

                        while (attempts <= retryCount) {
                            try {
                                response = await apiCall();
                                break; // Success, exit the retry loop
                            } catch (error) {
                                lastError = error;
                                attempts++;
                                if (attempts > retryCount) {
                                    throw lastError; // Max retries reached, throw the last error
                                }
                                // Wait before retrying
                                await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.GENERAL_API_RETRY_DELAY_MS));
                            }
                        }
                    }

                    return {
                        success: true,
                        data: response
                    };
                } catch (error) {
                    console.error(`[${SCRIPT_NAME}] API测试失败:`, error);
                    return {
                        success: false,
                        error: error.message || '未知错误'
                    };
                }
            }
        };

        const filterManager = {
            filters: [],
            filterOnShareEnabled: false,
            filterOnTransferEnabled: false,

            init: function() { this.loadSettings(); },
            loadSettings: function() {
                try {
                    const savedSettings = GM_getValue(FILTER_CONFIG.STORAGE_KEY);
                    if (savedSettings) {
                        const parsedSettings = JSON.parse(savedSettings);
                        if (Array.isArray(parsedSettings.filters)) this.filters = parsedSettings.filters;
                        else { this.filters = parsedSettings; this.filterOnShareEnabled = FILTER_CONFIG.DEFAULT_FILTER_OPTIONS.filterOnShareEnabled; this.filterOnTransferEnabled = FILTER_CONFIG.DEFAULT_FILTER_OPTIONS.filterOnTransferEnabled; }
                        if (typeof parsedSettings.filterOnShareEnabled === 'boolean') this.filterOnShareEnabled = parsedSettings.filterOnShareEnabled;
                        if (typeof parsedSettings.filterOnTransferEnabled === 'boolean') this.filterOnTransferEnabled = parsedSettings.filterOnTransferEnabled;
                        console.log(`[${SCRIPT_NAME}] 已加载过滤器设置`);
                    } else this.resetToDefaults();
                } catch (e) { console.error(`[${SCRIPT_NAME}] 加载过滤器设置失败:`, e); this.resetToDefaults(); }
            },
            saveSettings: function() {
                try {
                    GM_setValue(FILTER_CONFIG.STORAGE_KEY, JSON.stringify({ filters: this.filters, filterOnShareEnabled: this.filterOnShareEnabled, filterOnTransferEnabled: this.filterOnTransferEnabled }));
                    return true;
                } catch (e) { console.error(`[${SCRIPT_NAME}] 保存过滤器设置失败:`, e); return false; }
            },
            resetToDefaults: function() { this.filters = JSON.parse(JSON.stringify(FILTER_CONFIG.DEFAULT_FILTERS)); this.filterOnShareEnabled = FILTER_CONFIG.DEFAULT_FILTER_OPTIONS.filterOnShareEnabled; this.filterOnTransferEnabled = FILTER_CONFIG.DEFAULT_FILTER_OPTIONS.filterOnTransferEnabled; console.log(`[${SCRIPT_NAME}] 已重置为默认过滤器设置`); },
            shouldFilterFile: function(fileName, isShareOperation = true) {
                if ((isShareOperation && !this.filterOnShareEnabled) || (!isShareOperation && !this.filterOnTransferEnabled)) return false;
                if (!fileName) return false;
                const lastDotIndex = fileName.lastIndexOf('.');
                if (lastDotIndex === -1) return false;
                const extension = fileName.substring(lastDotIndex + 1).toLowerCase();
                const filter = this.filters.find(f => f.ext.toLowerCase() === extension);
                return filter && filter.enabled;
            },
            getFilteredCount: function() { return this.filters.filter(f => f.enabled).length; },
            setAllFilters: function(enabled) { this.filters.forEach(filter => filter.enabled = enabled); },

            buildFilterModalContent: function() {
                let html = `
                    <div class="filter-global-switches">
                        <div class="filter-switch-item">
                            <input type="checkbox" id="fl-filter-share-toggle" class="filter-toggle-checkbox" ${this.filterOnShareEnabled ? 'checked' : ''}>
                            <label for="fl-filter-share-toggle"><span class="filter-emoji">🔗</span><span class="filter-name">生成分享链接时启用过滤</span></label>
                        </div>
                        <div class="filter-switch-item">
                            <input type="checkbox" id="fl-filter-transfer-toggle" class="filter-toggle-checkbox" ${this.filterOnTransferEnabled ? 'checked' : ''}>
                            <label for="fl-filter-transfer-toggle"><span class="filter-emoji">📥</span><span class="filter-name">转存链接/文件时启用过滤</span></label>
                        </div>
                    </div>
                    <hr class="filter-divider">
                    <div class="filter-description">
                        <p>管理要过滤的文件类型。启用过滤后，相应类型的文件将不会包含在生成的链接或转存操作中。</p>
                    </div>
                    <div class="filter-select-style-container">
                        <div id="fl-selected-filter-tags" class="filter-selected-tags"></div>
                        <input type="text" id="fl-filter-search-input" class="filter-search-input" placeholder="输入扩展名 (如: jpg) 或名称添加/搜索...">
                        <div id="fl-filter-dropdown" class="filter-dropdown"></div>
                    </div>
                    <div class="filter-controls" style="margin-top: 15px;">
                        <button id="fl-filter-select-all" class="filter-btn">✅ 全选</button>
                        <button id="fl-filter-select-none" class="filter-btn">❌ 全不选</button>
                        <button id="fl-filter-reset" class="filter-btn">🔄 恢复默认</button>
                    </div>`;
                return html;
            },
            renderFilterItems: function() {
                const modal = uiManager.getModalElement();
                if (!modal) return;
                const selectedTagsContainer = modal.querySelector('#fl-selected-filter-tags');
                const dropdown = modal.querySelector('#fl-filter-dropdown');
                const searchInput = modal.querySelector('#fl-filter-search-input');
                if (!selectedTagsContainer || !dropdown) return;

                selectedTagsContainer.innerHTML = '';
                dropdown.innerHTML = '';
                const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";

                this.filters.forEach((filter, index) => {
                    if (filter.enabled) {
                        const tag = document.createElement('div');
                        tag.className = 'filter-tag';
                        tag.dataset.index = index;
                        tag.innerHTML = `<span class="filter-emoji">${filter.emoji}</span><span class="filter-tag-text">.${filter.ext}</span><span class="filter-tag-name">(${filter.name})</span><span class="filter-tag-remove">×</span>`;
                        tag.querySelector('.filter-tag-remove').addEventListener('click', () => { this.filters[index].enabled = false; this.renderFilterItems(); });
                        selectedTagsContainer.appendChild(tag);
                    } else {
                        const filterText = `.${filter.ext} ${filter.name}`.toLowerCase();
                        if (searchTerm && !filter.ext.toLowerCase().includes(searchTerm) && !filterText.includes(searchTerm)) return;
                        const item = document.createElement('div');
                        item.className = 'filter-dropdown-item';
                        item.dataset.index = index;
                        item.innerHTML = `<span class="filter-emoji">${filter.emoji}</span><span class="filter-ext">.${filter.ext}</span><span class="filter-name">${filter.name}</span>`;
                        item.addEventListener('click', () => { this.filters[index].enabled = true; if (searchInput) searchInput.value = ''; this.renderFilterItems(); });
                        dropdown.appendChild(item);
                    }
                });
                dropdown.style.display = dropdown.children.length > 0 && (document.activeElement === searchInput || dropdown.matches(':hover')) ? 'block' : 'none';
            },
            attachFilterEvents: function() {
                const modal = uiManager.getModalElement();
                if (!modal) return;
                this.renderFilterItems();
                const searchInput = modal.querySelector('#fl-filter-search-input');
                const dropdown = modal.querySelector('#fl-filter-dropdown');

                if (searchInput && dropdown) {
                    searchInput.addEventListener('input', () => this.renderFilterItems());
                    searchInput.addEventListener('focus', () => { if (dropdown.children.length > 0) dropdown.style.display = 'block'; });
                    searchInput.addEventListener('blur', () => setTimeout(() => { if (!dropdown.matches(':hover')) dropdown.style.display = 'none'; }, 200));
                    searchInput.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && searchInput.value.trim() !== '') {
                            e.preventDefault();
                            const term = searchInput.value.trim().toLowerCase().replace(/^\./, ''); // Remove leading dot
                            if (!term || !/^[a-z0-9_]+$/.test(term)) { // Basic validation for new extension
                                uiManager.showAlert("无效的扩展名格式。请只使用字母、数字和下划线。", 1500);
                                return;
                            }
                            const matchedIndex = this.filters.findIndex(f => f.ext.toLowerCase() === term);
                            if (matchedIndex !== -1) { // Existing filter
                                if (!this.filters[matchedIndex].enabled) {
                                    this.filters[matchedIndex].enabled = true;
                                    searchInput.value = '';
                                    this.renderFilterItems();
                                } else {
                                    uiManager.showAlert(`扩展名 ".${term}" 已经启用。`, 1500);
                                }
                            } else { // New filter
                                this.filters.push({ ext: term, name: '自定义类型', emoji: '✨', enabled: true });
                                // Sort filters by extension name to keep the list organized
                                this.filters.sort((a, b) => a.ext.localeCompare(b.ext));
                                searchInput.value = '';
                                this.renderFilterItems();
                                uiManager.showAlert(`已添加并启用自定义过滤器 ".${term}"。`, 1500);
                            }
                        }
                    });
                    dropdown.addEventListener('mouseenter', () => dropdown.dataset.hover = "true");
                    dropdown.addEventListener('mouseleave', () => { delete dropdown.dataset.hover; if (document.activeElement !== searchInput) dropdown.style.display = 'none'; });
                }
                const shareToggle = modal.querySelector('#fl-filter-share-toggle');
                if (shareToggle) shareToggle.addEventListener('change', () => { this.filterOnShareEnabled = shareToggle.checked; });
                const transferToggle = modal.querySelector('#fl-filter-transfer-toggle');
                if (transferToggle) transferToggle.addEventListener('change', () => { this.filterOnTransferEnabled = transferToggle.checked; });
                modal.querySelector('#fl-filter-select-all')?.addEventListener('click', () => { this.setAllFilters(true); this.renderFilterItems(); });
                modal.querySelector('#fl-filter-select-none')?.addEventListener('click', () => { this.setAllFilters(false); this.renderFilterItems(); });
                modal.querySelector('#fl-filter-reset')?.addEventListener('click', () => {
                    this.resetToDefaults();
                    if (shareToggle) shareToggle.checked = this.filterOnShareEnabled;
                    if (transferToggle) transferToggle.checked = this.filterOnTransferEnabled;
                    this.renderFilterItems();
                });
            }
        };

        const apiHelper = {
            buildURL: (host, path, queryParams = {}) => { const queryString = new URLSearchParams(queryParams).toString(); return `${host}${path}${queryString ? '?' + queryString : ''}`; },
            sendRequest: async function(method, path, queryParams = {}, body = null, isPublicCall = false) {
                const config = { host: 'https://' + window.location.host, authToken: localStorage['authorToken'], loginUuid: localStorage['LoginUuid'], appVersion: '3', referer: document.location.href, };
                const headers = { 'Content-Type': 'application/json;charset=UTF-8', 'platform': 'web', 'App-Version': config.appVersion, 'Origin': config.host, 'Referer': config.referer, };
                if (!isPublicCall) { if (config.authToken) headers['Authorization'] = 'Bearer ' + config.authToken; if (config.loginUuid) headers['LoginUuid'] = config.loginUuid; }
                try {
                    const urlToFetch = this.buildURL(config.host, path, queryParams);
                    const response = await fetch(urlToFetch, { method, headers, body: body ? JSON.stringify(body) : null, credentials: 'include' });
                    const responseText = await response.text();
                    let responseData;
                    try { responseData = JSON.parse(responseText); } catch (e) { if (!response.ok) throw new Error(`❗ HTTP ${response.status}: ${responseText || response.statusText}`); throw new Error(`❗ 响应解析JSON失败: ${e.message}`); }
                    if (responseData.code !== 0) { const message = responseData.message || 'API业务逻辑错误'; const apiError = new Error(`❗ ${message}`); if (typeof message === 'string' && (message.includes("频繁") || message.includes("操作过快") || message.includes("rate limit") || message.includes("too many requests"))) apiError.isRateLimit = true; throw apiError; }
                    return responseData;
                } catch (error) { if (!error.isRateLimit && !error.message?.startsWith("UserStopped")) { /* Log non-rate-limit, non-user-stopped errors */ } throw error; }
            },
            createFolder: async function(parentId, folderName) { return coreLogic._executeApiWithRetries(() => this._createFolderInternal(parentId, folderName), `创建文件夹: ${folderName}`, coreLogic.currentOperationRateLimitStatus); },
            _createFolderInternal: async function(parentId, folderName) {
                if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) {
                    throw new Error(`创建文件夹 "${folderName}" 失败：父文件夹ID无效 (${parentId})。`);
                }

                const requestBody = {
                    driveId: 0,
                    etag: "",
                    fileName: folderName,
                    parentFileId: parseInt(parentId, 10),
                    size: 0,
                    type: 1,
                    NotReuse: true,
                    RequestSource: null,
                    duplicate: 1,
                    event: "newCreateFolder",
                    operateType: 1
                };

                try {
                    const responseData = await this.sendRequest("POST", API_PATHS.UPLOAD_REQUEST, {}, requestBody);

                    if (responseData?.data?.Info?.FileId !== undefined) {
                        console.log(`[${SCRIPT_NAME}] 文件夹创建成功: ${folderName} (ID: ${responseData.data.Info.FileId})`);
                        return responseData.data.Info;
                    } else {
                        console.error(`[${SCRIPT_NAME}] 创建文件夹API响应异常:`, responseData);
                        throw new Error(`创建文件夹 "${folderName}" 失败: API响应缺少FileId`);
                    }
                } catch (error) {
                    console.error(`[${SCRIPT_NAME}] 创建文件夹 "${folderName}" 异常:`, error);
                    throw error;
                }
            },
            listDirectoryContents: async function(parentId, limit = 100) { return coreLogic._executeApiWithRetries(() => this._listDirectoryContentsInternal(parentId, limit), `列出目录ID: ${parentId}`, coreLogic.currentOperationRateLimitStatus); },
            _listDirectoryContentsInternal: async function(parentId, limit = 100) {
                if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) {
                    throw new Error(`无效的文件夹ID: ${parentId}，无法列出内容。`);
                }

                let allItems = [];
                let nextMarker = "0";
                let currentPage = 1;
                let totalItems = 0;

                try {
                    do {
                        await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS));
                        const queryParams = {
                            driveId: 0,
                            limit: limit,
                            next: 0,
                            orderBy: "file_name",
                            orderDirection: "asc",
                            trashed: false,
                            SearchData: "",
                            OnlyLookAbnormalFile: 0,
                            event: "homeListFile",
                            operateType: 4,
                            inDirectSpace: false,
                            parentFileId: parseInt(parentId, 10),
                            Page: currentPage
                        };

                        const responseData = await this.sendRequest("GET", API_PATHS.LIST_NEW, queryParams);
                        if (responseData?.data?.InfoList) {
                            if (responseData.data.InfoList.length === 0) break;
                            const newItems = responseData.data.InfoList.map(item => ({
                                FileID: parseInt(item.FileId, 10) || NaN,
                                FileName: item.FileName || "Unknown",
                                Type: parseInt(item.Type, 10) || 0,
                                Size: parseInt(item.Size, 10) || 0,
                                Etag: item.Etag || "",
                                ParentFileID: parseInt(item.ParentFileId, 10)
                            }));
                            allItems = allItems.concat(newItems);
                            totalItems += responseData.data.InfoList.length;
                            nextMarker = responseData.data.Next;
                            currentPage++;
                        } else {
                            if (currentPage === 1 && !responseData?.data?.InfoList && responseData.message && responseData.code !== 0) {
                                throw new Error(`API错误: ${responseData.message}`);
                            }
                            nextMarker = "-1";
                        }
                    } while (nextMarker !== "-1");

                    console.log(`[${SCRIPT_NAME}] 成功获取目录 ${parentId} 中的 ${totalItems} 个项目 (${allItems.length} 个唯一项目)`);
                    return allItems;
                } catch (error) {
                    console.error(`[${SCRIPT_NAME}] 列出目录 ${parentId} 内容失败:`, error);
                    throw new Error(`列出目录内容失败: ${error.message}`);
                }
            },
            getFileInfo: async function(idList) { return coreLogic._executeApiWithRetries(() => this._getFileInfoInternal(idList), `获取文件信息: ${idList.join(',')}`, coreLogic.currentOperationRateLimitStatus); },
            _getFileInfoInternal: async function(idList) { if (!idList || idList.length === 0) return { data: { infoList: [] } }; const requestBody = { fileIdList: idList.map(id => ({ fileId: String(id) })) }; const responseData = await this.sendRequest("POST", API_PATHS.FILE_INFO, {}, requestBody); if (responseData?.data?.infoList) { responseData.data.infoList = responseData.data.infoList.map(info => ({ ...info, FileID: parseInt(info.FileId || info.FileID, 10) || NaN, FileName: info.Name || info.FileName || "Unknown", Type: parseInt(info.Type || info.type, 10) || 0, Size: parseInt(info.Size || info.size, 10) || 0, Etag: info.Etag || info.etag || "" })); } return responseData; },
            rapidUpload: async function(etag, size, fileName, parentId) { return coreLogic._executeApiWithRetries(() => this._rapidUploadInternal(etag, size, fileName, parentId), `秒传: ${fileName}`, coreLogic.currentOperationRateLimitStatus); },
            _rapidUploadInternal: async function(etag, size, fileName, parentId) { if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) { throw new Error(`秒传文件 "${fileName}" 失败：父文件夹ID无效 (${parentId})。`); } const requestBody = { driveId: 0, etag: etag, fileName: fileName, parentFileId: parseInt(parentId, 10), size: parseInt(size, 10), type: 0, NotReuse: false, RequestSource: null, duplicate: 1, event: "rapidUpload", operateType: 1 }; const responseData = await this.sendRequest("POST", API_PATHS.UPLOAD_REQUEST, {}, requestBody); if (responseData?.data?.Info?.FileId !== undefined) return responseData.data.Info; throw new Error(responseData.message || '秒传文件失败或API响应异常'); },
            listSharedDirectoryContents: async function(parentId, shareKey, sharePwd, limit = 100) { return coreLogic._executeApiWithRetries( () => this._listSharedDirectoryContentsInternal(parentId, shareKey, sharePwd, limit), `列出分享目录ID: ${parentId} (ShareKey: ${shareKey.substring(0,4)}...)`, coreLogic.currentOperationRateLimitStatus, true ); },
            _listSharedDirectoryContentsInternal: async function(parentId, shareKey, sharePwd, limit = 100) {
                if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) throw new Error(`无效的分享文件夹ID: ${parentId}，无法列出内容。`);
                if (!shareKey) throw new Error("ShareKey 不能为空。");
                let allItems = []; let nextMarker = "0"; let currentPage = 1;
                do {
                    const queryParams = { limit: limit, next: 0, orderBy: "file_name", orderDirection: "asc", parentFileId: parseInt(parentId, 10), Page: currentPage, shareKey: shareKey, };
                    if (sharePwd) queryParams.SharePwd = sharePwd;
                    const responseData = await this.sendRequest("GET", API_PATHS.SHARE_LIST, queryParams, null, true);
                    if (responseData?.data?.InfoList) {
                        if (responseData.data.InfoList.length === 0) break;
                        const newItems = responseData.data.InfoList.map(item => ({ FileID: parseInt(item.FileId, 10) || NaN, FileName: item.FileName || "Unknown", Type: parseInt(item.Type, 10) || 0, Size: parseInt(item.Size, 10) || 0, Etag: item.Etag || "", ParentFileID: parseInt(item.ParentFileId, 10) }));
                        allItems = allItems.concat(newItems); nextMarker = responseData.data.Next; currentPage++;
                    } else { if (currentPage === 1 && !responseData?.data?.InfoList && responseData.message && responseData.code !== 0) throw new Error(`API错误: ${responseData.message}`); nextMarker = "-1"; }
                } while (nextMarker !== "-1");
                return allItems;
            },
            getFolderDetail: async function(folderId) {
                return coreLogic._executeApiWithRetries(
                    () => this._getFolderDetailInternal(folderId),
                    `获取文件夹详情: ${folderId}`,
                    coreLogic.currentOperationRateLimitStatus
                );
            },
            _getFolderDetailInternal: async function(folderId) {
                if (!folderId || isNaN(parseInt(folderId))) {
                    throw new Error(`无效的文件夹ID: ${folderId}`);
                }
                const queryParams = { fileID: parseInt(folderId, 10) };
                const responseData = await this.sendRequest("GET", API_PATHS.FOLDER_DETAIL, queryParams);
                if (responseData?.code === 0 && responseData?.data) {
                    return responseData.data;
                }
                throw new Error(responseData?.message || '获取文件夹详情失败');
            },
        };

        const processStateManager = {
            _userRequestedStop: false,
            _isPaused: false,
            _operationActive: false,
            _modalStopButtonId: 'fl-modal-stop-btn',
            _modalPauseButtonId: 'fl-modal-pause-btn',
            // Keep track of last known progress to update mini bar instantly if needed
            _lastProgressData: { processed: 0, total: 0, successes: 0, failures: 0, currentFileName: "", extraStatus: "" },
            reset: function() {
                this._userRequestedStop = false;
                this._isPaused = false;
                this._operationActive = true;
                const btn = document.getElementById(this._modalStopButtonId);
                if(btn){btn.textContent = "🛑 停止"; btn.disabled = false;}
                const pauseBtn = document.getElementById(this._modalPauseButtonId);
                if(pauseBtn){pauseBtn.textContent = "⏸️ 暂停"; pauseBtn.disabled = true;}
                // Reset mini progress title too
                if (uiManager.miniProgressElement) {
                    const miniTitle = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-title span');
                    if (miniTitle) miniTitle.textContent = "⚙️ 处理中...";
                }
            },
            requestStop: function() {
                this._userRequestedStop = true;
                this._operationActive = false;
                const btn = document.getElementById(this._modalStopButtonId);
                if(btn){btn.textContent = "正在停止..."; btn.disabled = true;}
                const pauseBtn = document.getElementById(this._modalPauseButtonId);
                if(pauseBtn){pauseBtn.disabled = true;}
                const minimizeBtn = document.getElementById('fl-m-minimize');
                if(minimizeBtn) minimizeBtn.disabled = true;
                console.log(`[${SCRIPT_NAME}] User requested stop.`);
                // Update mini progress title if active
                if (uiManager.isMiniProgressActive && uiManager.miniProgressElement) {
                    const miniTitle = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-title span');
                    if (miniTitle) miniTitle.textContent = "🛑 正在停止...";
                }
            },
            togglePause: function() {
                this._isPaused = !this._isPaused;
                const pauseBtn = document.getElementById(this._modalPauseButtonId);
                if(pauseBtn) {
                    pauseBtn.textContent = this._isPaused ? "▶️ 继续" : "⏸️ 暂停";
                }
                // Update mini progress title if active
                if (uiManager.isMiniProgressActive && uiManager.miniProgressElement) {
                    const miniTitle = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-title span');
                    if (miniTitle) miniTitle.textContent = this._isPaused ? "⏸️ 已暂停" : "⚙️ 处理中...";
                }
                return this._isPaused;
            },
            isPaused: function() { return this._isPaused; },
            isStopRequested: function() { return this._userRequestedStop; },
            startOperation: function() { this._operationActive = true; },
            markCompleted: function() { this._operationActive = false; },
            isOperationActive: function() { return this._operationActive; },
            getStopButtonId: function() { return this._modalStopButtonId; },
            getPauseButtonId: function() { return this._modalPauseButtonId; },
            updateProgressUINow: function() { // Added to directly call update with last known data
                this.updateProgressUI(
                    this._lastProgressData.processed,
                    this._lastProgressData.total,
                    this._lastProgressData.successes,
                    this._lastProgressData.failures,
                    this._lastProgressData.currentFileName,
                    this._lastProgressData.extraStatus
                );
            },
            updateProgressUI: function(processed, total, successes, failures, currentFileName, extraStatus = "") {
                // Store last data
                this._lastProgressData = { processed, total, successes, failures, currentFileName, extraStatus };

                const bar = document.querySelector('.fastlink-progress-bar');
                if (bar) bar.style.width = `${total > 0 ? Math.round((processed / total) * 100) : 0}%`;
                const statTxt = document.querySelector('.fastlink-status p:first-child');
                if (statTxt) statTxt.textContent = `处理中: ${processed} / ${total} 项 (预估)`;
                const sucCnt = document.querySelector('.fastlink-stats .success-count');
                if (sucCnt) sucCnt.textContent = `✅ 成功：${successes}`;
                const failCnt = document.querySelector('.fastlink-stats .failed-count');
                if (failCnt) failCnt.textContent = `❌ 失败：${failures}`;
                const curFile = document.querySelector('.fastlink-current-file .file-name');
                if (curFile) curFile.textContent = currentFileName ? `📄 ${currentFileName}` : "准备中...";
                const extraEl = document.querySelector('.fastlink-status .extra-status-message');
                if (extraEl) { extraEl.textContent = extraStatus; extraEl.style.display = extraStatus ? 'block' : 'none';}

                // 同时更新独立进度页面
                uiManager.updateGenerateProgress({
                    processed,
                    total,
                    successCount: successes,
                    failureCount: failures,
                    currentFile: currentFileName,
                    extraStatus
                });

                // Update mini progress bar if active
                if (uiManager.isMiniProgressActive && uiManager.miniProgressElement) {
                    const miniBar = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-bar');
                    if (miniBar) miniBar.style.width = `${total > 0 ? Math.round((processed / total) * 100) : 0}%`;

                    const miniFile = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-file');
                    if (miniFile) miniFile.textContent = currentFileName ? (currentFileName.length > 30 ? currentFileName.substring(0, 27) + "..." : currentFileName) : "准备中...";

                    const miniStatus = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-status');
                    if (miniStatus) miniStatus.textContent = `${processed}/${total} (✅${successes} ❌${failures})`;

                    const miniTitle = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-title span');
                    if (miniTitle) {
                        if (this._userRequestedStop) {
                            miniTitle.textContent = (processed < total) ? "🛑 正在停止..." : "🛑 已停止";
                        } else if (processed >= total && total > 0) {
                            miniTitle.textContent = "✅ 处理完成";
                        } else {
                            miniTitle.textContent = "⚙️ 处理中...";
                        }
                    }
                }
            },
            appendInfoMessage: function(message) {
                const logArea = document.querySelector('.fastlink-info-messages');
                if (logArea) {
                    // Remove oldest messages if we have more than 100
                    while (logArea.children.length >= 100) {
                        logArea.removeChild(logArea.firstChild);
                    }
                    const p = document.createElement('p');
                    p.className = 'info-message';
                    p.innerHTML = message;
                    logArea.appendChild(p);
                    logArea.scrollTop = logArea.scrollHeight;
                }
            },

            appendErrorMessage: function(message) {
                const isDebugMode = settingsManager.isDebugMode();
                const logArea = isDebugMode ? document.querySelector('.fastlink-error-messages') : document.querySelector('.fastlink-info-messages');
                if (logArea) {
                    if (!isDebugMode) { // in debug mode, keep all messages
                        while (logArea.children.length >= 100) {
                            logArea.removeChild(logArea.firstChild);
                        }
                    }
                    const p = document.createElement('p');
                    p.className =  'error-message';
                    p.innerHTML = message;
                    logArea.appendChild(p);
                    logArea.scrollTop = logArea.scrollHeight;
                }
            },
        };

        const coreLogic = {
            currentOperationRateLimitStatus: { consecutiveRateLimitFailures: 0, totalRetries: { general: 0, rateLimit: 0 } },
            _executeApiWithRetries: async function(apiFunctionExecutor, itemNameForLog, rateLimitStatusRef, isPublicCallForSendRequest = false) {
                let generalErrorRetries = 0;
                while (generalErrorRetries <= RETRY_AND_DELAY_CONFIG.GENERAL_API_MAX_RETRIES) {
                    if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                    let rateLimitRetriesForCurrentGeneralAttempt = 0;
                    while (rateLimitRetriesForCurrentGeneralAttempt <= RETRY_AND_DELAY_CONFIG.RATE_LIMIT_MAX_ITEM_RETRIES) {
                        if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                        try {
                            const result = await apiFunctionExecutor();
                            rateLimitStatusRef.consecutiveRateLimitFailures = 0;
                            if (generalErrorRetries > 0 || rateLimitRetriesForCurrentGeneralAttempt > 0) {
                                processStateManager.appendInfoMessage(`ℹ️ ${itemNameForLog}: Succeeded after ${generalErrorRetries} general retries and ${rateLimitRetriesForCurrentGeneralAttempt} rate limit retries`);
                                rateLimitStatusRef.totalRetries.general += generalErrorRetries;
                                rateLimitStatusRef.totalRetries.rateLimit += rateLimitRetriesForCurrentGeneralAttempt;
                            }
                            return result;
                        } catch (error) {
                            // Check if this is a known error code that should not be retried
                            const knownError = Object.values(API_ERROR_CODES).find(err => error.message.includes(err.message));
                            if (knownError && knownError.shouldNotRetry) {
                                processStateManager.appendErrorMessage(`❌ ${itemNameForLog}: ${error.message} (无需重试)`);
                                throw error;
                            }

                            if (processStateManager.isStopRequested()) throw error;
                            if (error.isRateLimit) {
                                rateLimitStatusRef.consecutiveRateLimitFailures++;
                                const rlRetryAttemptDisplay = rateLimitRetriesForCurrentGeneralAttempt + 1;
                                const currentFileEl = document.querySelector('.fastlink-current-file .file-name');
                                if(currentFileEl) processStateManager.appendErrorMessage(`⏳ ${currentFileEl.textContent || itemNameForLog}: 操作频繁 (RL ${rlRetryAttemptDisplay}/${RETRY_AND_DELAY_CONFIG.RATE_LIMIT_MAX_ITEM_RETRIES + 1})`);
                                if (rateLimitRetriesForCurrentGeneralAttempt >= RETRY_AND_DELAY_CONFIG.RATE_LIMIT_MAX_ITEM_RETRIES) { processStateManager.appendErrorMessage(`❌ ${itemNameForLog}: 已达当前常规尝试的最大API限流重试次数。`); throw error; }
                                rateLimitRetriesForCurrentGeneralAttempt++;
                                if (rateLimitStatusRef.consecutiveRateLimitFailures >= RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_TRIGGER_FAILURES) {
                                    processStateManager.appendErrorMessage(`[全局暂停] API持续频繁，暂停 ${RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS / 1000} 秒...`);
                                    const extraStatusEl = document.querySelector('.fastlink-status .extra-status-message');
                                    if(extraStatusEl) extraStatusEl.textContent = `全局暂停中... ${RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS / 1000}s`;
                                    await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS));
                                    if(extraStatusEl) extraStatusEl.textContent = "";
                                    rateLimitStatusRef.consecutiveRateLimitFailures = 0; rateLimitRetriesForCurrentGeneralAttempt = 0;
                                } else { await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.RATE_LIMIT_ITEM_RETRY_DELAY_MS)); }
                            } else {
                                const genRetryAttemptDisplay = generalErrorRetries + 1;
                                processStateManager.appendErrorMessage(`❌ ${itemNameForLog}: ${error.message} (常规重试 ${genRetryAttemptDisplay}/${RETRY_AND_DELAY_CONFIG.GENERAL_API_MAX_RETRIES + 1})`);
                                generalErrorRetries++; if (generalErrorRetries > RETRY_AND_DELAY_CONFIG.GENERAL_API_MAX_RETRIES) throw error;
                                await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.GENERAL_API_RETRY_DELAY_MS)); break;
                            }
                        }
                    }
                }
                rateLimitStatusRef.totalRetries.general += generalErrorRetries;
                rateLimitStatusRef.totalRetries.rateLimit += rateLimitRetriesForCurrentGeneralAttempt;
                throw new Error(`[${SCRIPT_NAME}] All API retries failed: ${itemNameForLog} (Total: ${rateLimitStatusRef.totalRetries.general} general, ${rateLimitStatusRef.totalRetries.rateLimit} rate limit retries)`);
            },
            getSelectedFileIds: () => Array.from(document.querySelectorAll(DOM_SELECTORS.FILE_ROW_SELECTOR))
                .filter(row => {
                    // 平铺模式
                    if (row.classList.contains('tiled-list-item-wrap')) {
                        // 找到同级的勾选框
                        const checkbox = row.parentElement?.querySelector('.tiled-list-item-operate-check input[type="checkbox"]');
                        return checkbox && checkbox.checked;
                    }
                    // 列表模式
                    const checkbox = row.querySelector(DOM_SELECTORS.FILE_CHECKBOX_SELECTOR);
                    return checkbox && checkbox.checked;
                })
                .map(row => {
                    // 平铺模式
                    if (row.classList.contains('tiled-list-item-wrap')) {
                        return String(row.getAttribute('data-file'));
                    }
                    // 列表模式
                    return String(row.getAttribute('data-row-key'));
                })
                .filter(id => id != null && id !== "null" && id !== "undefined"),
            getCurrentDirectoryId: () => {
                const url = window.location.href;
                const homeFilePathMatch = url.match(/[?&]homeFilePath=([^&]*)/);
                if (homeFilePathMatch) {
                    let filePathIds = decodeURIComponent(homeFilePathMatch[1]);
                    if (filePathIds && filePathIds !== "") {
                        if (filePathIds.includes(',')) {
                            const idsArray = filePathIds.split(',');
                            return idsArray[idsArray.length - 1];
                        } else {
                            return filePathIds;
                        }
                    } else {
                        return "0";
                    }
                }
                const regexes = [ /fid=(\d+)/, /#\/list\/folder\/(\d+)/, /\/drive\/(?:folder\/)?(\d+)/, /\/s\/[a-zA-Z0-9_-]+\/(\d+)/, /(?:\/|^)(\d+)(?=[\/?#]|$)/ ];
                for (const regex of regexes) { const match = url.match(regex); if (match && match[1]) { if (match[1] === "0") { if (regex.source === String(/\/drive\/(?:folder\/)?(\d+)/) && url.includes("/drive/0")) return "0"; } return match[1]; } }
                const lowerUrl = url.toLowerCase(); if (lowerUrl.includes("/drive/0") || lowerUrl.endsWith("/drive") || lowerUrl.endsWith("/drive/") || lowerUrl.match(/^https?:\/\/[^\/]+\/?([#?].*)?$/) || lowerUrl.endsWith(".123pan.com") || lowerUrl.endsWith(".123pan.cn") || lowerUrl.endsWith(".123pan.com/") || lowerUrl.endsWith(".123pan.cn/")) return "0";
                try { const pathname = new URL(url).pathname; if (pathname === '/' || pathname.toLowerCase() === '/drive/' || pathname.toLowerCase() === '/index.html') return "0"; } catch(e) { /*ignore*/ }
                return "0";
            },
            _findLongestCommonPrefix: function(paths) {
                if (!paths || paths.length === 0) return ""; if (paths.length === 1 && paths[0].includes('/')) { const lastSlash = paths[0].lastIndexOf('/'); if (lastSlash > -1) return paths[0].substring(0, lastSlash + 1); return ""; } if (paths.length === 1 && !paths[0].includes('/')) return "";
                const sortedPaths = [...paths].sort(); const firstPath = sortedPaths[0]; const lastPath = sortedPaths[sortedPaths.length - 1]; let i = 0; while (i < firstPath.length && firstPath.charAt(i) === lastPath.charAt(i)) i++; let prefix = firstPath.substring(0, i);
                if (prefix.includes('/')) prefix = prefix.substring(0, prefix.lastIndexOf('/') + 1); else { if (!paths.every(p => p === prefix || p.startsWith(prefix + "/"))) return "";}
                return (prefix.length > 1 && prefix.endsWith('/')) ? prefix : "";
            },

            _generateLinkProcess: async function(itemFetcherAsyncFn, operationTitleForUI, isBatchMode = false, useProgressPage = false) {
                processStateManager.reset();
                processStateManager.startOperation();
                this.currentOperationRateLimitStatus.consecutiveRateLimitFailures = 0;
                let allFileEntriesData = [];
                let processedAnyFolder = false; // This will be set by the itemFetcher callback
                let totalDiscoveredItemsForProgress = 0;
                let itemsProcessedForProgress = 0;
                let successes = 0, failures = 0;
                let jsonDataForExport = null;
                const startTime = Date.now();

                // 根据参数显示模态框或独立进度页面
                if (useProgressPage) {
                    uiManager.showGenerateProgressPage();
                } else {
                    uiManager.showModal(operationTitleForUI, `
                        <div class="fastlink-progress-container"><div class="fastlink-progress-bar" style="width: 0%"></div></div>
                        <div class="fastlink-status-container">
                            <div class="fastlink-info-status">
                                <p>🔍 正在分析项目...</p>
                                <div class="fastlink-info-messages"></div>
                            </div>
                            <div class="fastlink-error-status">
                                <div class="fastlink-error-messages"></div>
                            </div>
                            <p class="extra-status-message" style="color: #ff7f50; display: none;"></p>
                        </div>
                        <div class="fastlink-stats"><span class="success-count">✅ 成功：0</span><span class="failed-count">❌ 失败：0</span></div>
                        <div class="fastlink-current-file"><p class="file-name">准备开始...</p></div>`, 'progress_stoppable', false);
                }

                try {
                    const result = await itemFetcherAsyncFn(
                        (itemData) => { allFileEntriesData.push(itemData); },
                        (isFolder) => { if(isFolder) processedAnyFolder = true; },
                        (progressUpdate) => {
                            if (progressUpdate.total !== undefined) totalDiscoveredItemsForProgress = progressUpdate.total;
                            if (progressUpdate.processed !== undefined) itemsProcessedForProgress = progressUpdate.processed;
                            if (progressUpdate.successCount !== undefined) successes = progressUpdate.successCount;
                            if (progressUpdate.failureCount !== undefined) failures = progressUpdate.failureCount;
                            processStateManager.updateProgressUI(itemsProcessedForProgress, totalDiscoveredItemsForProgress, successes, failures, progressUpdate.currentFile, progressUpdate.extraStatus);
                        }
                    );
                    // Ensure final counts are taken from the result of the fetcher
                    totalDiscoveredItemsForProgress = result.totalDiscoveredItemsForProgress;
                    itemsProcessedForProgress = result.itemsProcessedForProgress;
                    successes = result.successes;
                    failures = result.failures;

                } catch (e) {
                    if (e.message === "UserStopped") processStateManager.appendInfoMessage("🛑 用户已停止操作。");
                    else { processStateManager.appendErrorMessage(`SYSTEM ERROR: ${e.message}`); console.error("Error during generation:", e); }
                }

                processStateManager.updateProgressUI(itemsProcessedForProgress, totalDiscoveredItemsForProgress, successes, failures, "处理完成", "");
                processStateManager.markCompleted();

                const totalTime = Math.round((Date.now() - startTime) / 1000);
                console.log(`[${SCRIPT_NAME}] File links processing took ${totalTime}s for ${allFileEntriesData.length} entries`);

                if (allFileEntriesData.length > 0) {
                    let link = "";
                    const allPaths = allFileEntriesData.map(entry => entry.fullPath);
                    const commonPrefix = this._findLongestCommonPrefix(allPaths);
                    let useV2Format = settingsManager.get('usesBase62EtagsInExport');
                    let profileStartTime = performance.now();
                    const processedEntries = allFileEntriesData.map(entry => {
                        const etagConversion = hexToOptimizedEtag(entry.etag);
                        return {
                            ...entry,
                            processedEtag: useV2Format ? etagConversion.optimized : entry.etag
                        };
                    });
                    let profileEndTime = performance.now();
                    console.log(`[${SCRIPT_NAME}] File entry etag conversion took ${(profileEndTime - profileStartTime).toFixed(2)}ms for ${allFileEntriesData.length} entries`);

                    if (commonPrefix && (processedAnyFolder || allPaths.some(p => p.includes('/')))) { const fileStrings = processedEntries.map(entry => `${useV2Format ? entry.processedEtag : entry.etag}#${entry.size}#${entry.fullPath.substring(commonPrefix.length)}`); link = (useV2Format ? COMMON_PATH_LINK_PREFIX_V2 : COMMON_PATH_LINK_PREFIX_V1) + commonPrefix + COMMON_PATH_DELIMITER + fileStrings.join('$');
                    } else { const fileStrings = processedEntries.map(entry => `${useV2Format ? entry.processedEtag : entry.etag}#${entry.size}#${entry.fullPath}`); link = fileStrings.join('$'); if (processedAnyFolder || allPaths.some(p => p.includes('/'))) link = (useV2Format ? LEGACY_FOLDER_LINK_PREFIX_V2 : LEGACY_FOLDER_LINK_PREFIX_V1) + link; else if (useV2Format && !link.startsWith(LEGACY_FOLDER_LINK_PREFIX_V2) && !link.startsWith(COMMON_PATH_LINK_PREFIX_V2)) link = LEGACY_FOLDER_LINK_PREFIX_V2 + link; }

                    const commonPathForExport = (commonPrefix && (processedAnyFolder || allPaths.some(p => p.includes('/')))) ? commonPrefix : "";
                    const totalSize = allFileEntriesData.reduce((acc, entry) => acc + (Number(entry.size) || 0), 0);
                    const formattedTotalSize = formatBytes(totalSize);
                    profileStartTime = performance.now()
                    jsonDataForExport = {
                        scriptVersion: SCRIPT_VERSION,
                        exportVersion: "1.0",
                        usesBase62EtagsInExport: useV2Format,
                        commonPath: commonPathForExport,
                        totalFilesCount: allFileEntriesData.length,
                        totalSize: totalSize,
                        formattedTotalSize: formattedTotalSize,
                        files: allFileEntriesData.map(entry => ({
                            path: commonPathForExport ? entry.fullPath.substring(commonPathForExport.length) : entry.fullPath,
                            size: String(entry.size),
                            etag: useV2Format ? hexToOptimizedEtag(entry.etag).optimized : entry.etag
                        }))
                    };
                    profileEndTime = performance.now();
                    console.log(`[${SCRIPT_NAME}] Preparing json data for export took ${(profileEndTime - profileStartTime).toFixed(2)}ms for ${allFileEntriesData.length} entries`);

                    if (isBatchMode) {
                        uiManager.hideModal();
                    } else if (useProgressPage) {
                        // 在独立进度页面上显示结果
                        if (uiManager.progressPageElement) {
                            // 更新进度页面标题
                            const header = uiManager.progressPageElement.querySelector('.fastlink-progress-page-header h2');
                            if (header) {
                                header.textContent = processStateManager.isStopRequested() ? "🔴 秒传链接 (部分生成)" : "🎉 秒传链接已生成";
                            }

                            // 更新状态信息
                            const infoStatus = uiManager.progressPageElement.querySelector('.fastlink-info-status p:first-child');
                            if (infoStatus) {
                                infoStatus.textContent = "🔍 生成完成！";
                            }

                            // 隐藏暂停/停止按钮
                            const buttonsContainer = uiManager.progressPageElement.querySelector('.fastlink-progress-page-buttons');
                            if (buttonsContainer) {
                                buttonsContainer.style.display = 'none';
                            }

                            // 添加结果区域
                            const resultDiv = document.createElement('div');
                            resultDiv.className = 'fastlink-progress-page-result';

                            let titleMessage = failures > 0 && successes > 0 ? "🎯 部分成功" : (successes > 0 ? "🎉 生成成功" : "🤔 无有效数据");
                            if (processStateManager.isStopRequested()) titleMessage = "🔴 操作已停止 (部分数据)";

                            // Get error messages if any
                            const errorStatusDiv = uiManager.progressPageElement.querySelector('.fastlink-error-status');
                            const errorMessagesDiv = errorStatusDiv ? errorStatusDiv.querySelector('.fastlink-error-messages') : null;
                            let errorMessagesHtml = '';
                            if (errorMessagesDiv && errorMessagesDiv.children.length > 0 && settingsManager.isDebugMode()) {
                                errorMessagesHtml = `<div class="fastlink-error-summary" style="margin-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; font-size: 0.9em;">
                                    <h4 style="margin: 0 0 10px 0;">⚠️ 错误信息:</h4>
                                    ${Array.from(errorMessagesDiv.children).map(p => `<p style="margin: 3px 0; color: #d9534f;">${p.innerHTML}</p>`).join('')}
                                </div>`;
                            }

                            resultDiv.innerHTML = `
                                <div class="fastlink-result">
                                    <h3>${titleMessage}</h3>
                                    <p>📄 已处理项目 (用于链接/JSON): ${allFileEntriesData.length} 个</p>
                                    <p>✅ 成功提取元数据: ${successes} 个</p>
                                    <p>❌ 失败/跳过项目: ${failures} 个</p>
                                    <p>💾 已处理项目总大小: ${formattedTotalSize}</p>
                                    <p>⏱️ 耗时: ${totalTime} 秒</p>
                                    <textarea class="fastlink-link-text" readonly style="width: 100%; height: 100px; margin: 10px 0; padding: 12px; border-radius: 8px; border: 1px solid #d9d9d9; resize: vertical; font-size: 14px; box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);">${link}</textarea>
                                    <div class="fastlink-result-buttons" style="display: flex; gap: 12px; justify-content: center; margin-top: 16px;">
                                        <button id="fl-p-copy-btn" class="result-btn" style="padding: 10px 20px; background-color: #52c41a; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(82, 196, 26, 0.2);">📋 复制</button>
                                        <button id="fl-p-export-btn" class="result-btn" style="padding: 10px 20px; background-color: #1890ff; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);">📤 导出</button>
                                        <button id="fl-p-split-btn" class="result-btn" style="padding: 10px 20px; background-color: #fa8c16; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.3s ease; box-shadow: 0 2px 4px rgba(250, 140, 22, 0.2);">✂️ 拆分</button>
                                    </div>
                                    <style>
                                        .result-btn:hover {
                                            transform: translateY(-1px);
                                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15) !important;
                                        }
                                        .result-btn:active {
                                            transform: translateY(0);
                                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
                                        }
                                    </style>
                                </div>
                                ${errorMessagesHtml}
                            `;

                            // 将结果区域添加到进度页面
                            const content = uiManager.progressPageElement.querySelector('.fastlink-progress-page-content');
                            content.appendChild(resultDiv);

                            // 添加按钮事件监听
                            const copyBtn = uiManager.progressPageElement.querySelector('#fl-p-copy-btn');
                            if (copyBtn) {
                                copyBtn.onclick = () => {
                                    GM_setClipboard(link);
                                    copyBtn.textContent = "✅ 已复制";
                                    setTimeout(() => {
                                        copyBtn.textContent = "📋 复制";
                                    }, 2000);
                                };
                            }

                            const exportBtn = uiManager.progressPageElement.querySelector('#fl-p-export-btn');
                            if (exportBtn) {
                                exportBtn.onclick = () => {
                                    // 使用与侧边导出相同的文件名生成逻辑
                                    let fileName;
                                    // 判断是否为文件夹导出（有公共路径或文件路径包含目录结构）
                                    const isFolderExport = jsonDataForExport.commonPath || jsonDataForExport.files.some(f => f.path.includes('/'));

                                    if (isFolderExport && settingsManager.get('useFolderNameForJson')) {
                                        // 文件夹导出：使用文件夹名（公共路径的第一段）
                                        const firstPathSegment = (jsonDataForExport.commonPath || jsonDataForExport.files[0]?.path || '').split('/')[0];
                                        const sanitizedPath = firstPathSegment.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');
                                        if (sanitizedPath) {
                                            if (settingsManager.get('appendDateToJson')) {
                                                const now = new Date();
                                                const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                                fileName = `${sanitizedPath}_${dateStr}.json`;
                                            } else {
                                                fileName = `${sanitizedPath}.json`;
                                            }
                                        } else {
                                            fileName = `123FastLink_${Date.now()}.json`;
                                        }
                                    } else {
                                        // 文件导出：使用文件名（去掉扩展名）
                                        let nameSource = '';
                                        if (jsonDataForExport.files && jsonDataForExport.files.length > 0) {
                                            nameSource = jsonDataForExport.files[0].path;
                                        }

                                        if (nameSource) {
                                            // 提取文件名（去掉路径，只保留文件名部分）
                                            const pathParts = nameSource.split('/');
                                            const fileNameOnly = pathParts[pathParts.length - 1];
                                            // 去掉文件扩展名
                                            const nameWithoutExt = fileNameOnly.replace(/\.[^/.]+$/, '');
                                            const sanitizedPath = nameWithoutExt.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');

                                            if (sanitizedPath) {
                                                if (settingsManager.get('appendDateToJson')) {
                                                    const now = new Date();
                                                    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                                    fileName = `${sanitizedPath}_${dateStr}.json`;
                                                } else {
                                                    fileName = `${sanitizedPath}.json`;
                                                }
                                            } else {
                                                fileName = `123FastLink_${Date.now()}.json`;
                                            }
                                        } else {
                                            fileName = `123FastLink_${Date.now()}.json`;
                                        }
                                    }

                                    const blob = new Blob([JSON.stringify(jsonDataForExport, null, 2)], { type: 'application/json' });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = fileName;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                };
                            }

                            const splitBtn = uiManager.progressPageElement.querySelector('#fl-p-split-btn');
                            if (splitBtn) {
                                splitBtn.onclick = () => {
                                    // 隐藏进度页面
                                    uiManager.hideGenerateProgressPage();
                                    // 显示拆分工具
                                    uiManager.showModal("✂️ 拆分JSON文件", "", 'splitJsonTool');
                                };
                            }
                        }
                    } else {
                        // 原有模态框显示逻辑
                        if (processStateManager.isStopRequested()) processStateManager.appendInfoMessage(`⚠️ 操作已停止。以下是已处理 ${allFileEntriesData.length} 项的部分链接/数据。`);
                        if (useV2Format) processStateManager.appendInfoMessage('💡 使用V2链接格式 (Base62 ETags) 生成。', true); else processStateManager.appendInfoMessage('ℹ️ 使用V1链接格式 (标准 ETags) 生成。', true);

                        let titleMessage = failures > 0 && successes > 0 ? "🎯 部分成功" : (successes > 0 ? "🎉 生成成功" : "🤔 无有效数据");
                        if (processStateManager.isStopRequested()) titleMessage = "🔴 操作已停止 (部分数据)";

                        // 不再截断链接，显示完整链接
                        let linkText = link;

                        // Get error messages if any
                        const errorMessagesDiv = document.querySelector('.fastlink-error-messages');
                        let errorMessagesHtml = '';
                        if (errorMessagesDiv && errorMessagesDiv.children.length > 0 && settingsManager.isDebugMode()) {
                            errorMessagesHtml = `<div class="fastlink-error-summary" style="margin-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; font-size: 0.9em;">
                                <h4 style="margin: 0 0 10px 0;">⚠️ 错误信息:</h4>
                                ${Array.from(errorMessagesDiv.children).map(p => `<p style="margin: 3px 0; color: #d9534f;">${p.innerHTML}</p>`).join('')}
                            </div>`;
                        }

                        const summary = `<div class="fastlink-result"><h3>${titleMessage}</h3><p>📄 已处理项目 (用于链接/JSON): ${allFileEntriesData.length} 个</p><p>✅ 成功提取元数据: ${successes} 个</p><p>❌ 失败/跳过项目: ${failures} 个</p><p>💾 已处理项目总大小: ${formattedTotalSize}</p><p>⏱️ 耗时: ${totalTime} 秒</p><textarea class="fastlink-link-text" readonly>${linkText}</textarea></div>${errorMessagesHtml}`;
                        uiManager.showModal( processStateManager.isStopRequested() ? "🔴 秒传链接 (部分生成)" : "🎉 秒传链接已生成", summary, 'showLink', true, link, jsonDataForExport );
                    }
                    return { link, jsonData: jsonDataForExport };
                }
                return { link: "", jsonData: null };
            },

            generateShareLink: async function(optionsOrUseProgressPage = false) {
                // 支持两种调用方式：1. generateShareLink(true) 2. generateShareLink({ useProgressPage: true, ... })
                const options = typeof optionsOrUseProgressPage === 'object' ? optionsOrUseProgressPage : { useProgressPage: optionsOrUseProgressPage };
                const useProgressPage = options.useProgressPage || false;

                const selectedItemIds = this.getSelectedFileIds();
                if (!selectedItemIds.length) { uiManager.showAlert("请先勾选要分享的文件或文件夹。"); return ""; }

                return this._generateLinkProcess(async (addDataCb, markFolderCb, progressCb) => {
                    let totalDiscovered = selectedItemIds.length;
                    let processedCount = 0;
                    let successCount = 0;
                    let failureCount = 0;

                    async function processSingleItem(itemInput, currentRelativePath) { // itemInput can be itemId or itemObject
                        if (processStateManager.isStopRequested()) throw new Error("UserStopped");

                        // Add pause check
                        while (processStateManager.isPaused()) {
                            await new Promise(r => setTimeout(r, 100)); // Wait 100ms before checking again
                        }

                        let itemDetails;
                        let itemIdForDisplay = typeof itemInput === 'object' && itemInput !== null && itemInput.FileID ? itemInput.FileID : itemInput;
                        const baseItemName = `${currentRelativePath || '根目录'}/${itemIdForDisplay}`;
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemName, extraStatus: "获取信息..." });

                        if (typeof itemInput === 'object' && itemInput !== null && itemInput.FileID !== undefined && itemInput.FileName !== undefined && itemInput.Type !== undefined) {
                            // Use provided itemDetails if it's a complete object
                            itemDetails = itemInput;
                        } else {
                            // Otherwise, fetch itemDetails
                            try {
                                const itemInfoResponse = await apiHelper.getFileInfo([String(itemInput)]); // itemInput is an ID here
                                if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                                if (!itemInfoResponse?.data?.infoList?.length) throw new Error(`项目 ${itemInput} 信息未找到`);
                                itemDetails = itemInfoResponse.data.infoList[0];
                            } catch (e) {
                                if (processStateManager.isStopRequested()) throw e;
                                failureCount++; processedCount++;
                                processStateManager.appendErrorMessage(`❌ 获取项目 "${baseItemName}" 详情最终失败: ${e.message}`);
                                progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemName, extraStatus: "获取信息失败" });
                                return;
                            }
                        }

                        if (isNaN(itemDetails.FileID)) { failureCount++; processedCount++; processStateManager.appendErrorMessage(`❌ 项目 "${itemDetails.FileName || itemId}" FileID无效`); progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemName }); return; }
                        const cleanName = (itemDetails.FileName || "Unknown").replace(/[#$%\/]/g, "_").replace(new RegExp(COMMON_PATH_DELIMITER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '_');
                        const itemDisplayPath = `${currentRelativePath ? currentRelativePath + '/' : ''}${cleanName}`;
                        const formattedSize = formatBytes(Number(itemDetails.Size) || 0);
                        processedCount++;
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: `${itemDisplayPath} (${formattedSize})` });

                        if (itemDetails.Type === 0) { // File
                            if (itemDetails.Etag && itemDetails.Size !== undefined) {
                                if (filterManager.shouldFilterFile(cleanName, true)) {
                                    if (settingsManager.isDebugMode()) processStateManager.appendInfoMessage(`⏭️ 已过滤: ${itemDisplayPath} (${formattedSize})`);
                                }
                                else {
                                    addDataCb({ etag: itemDetails.Etag, size: itemDetails.Size, fullPath: itemDisplayPath });
                                    successCount++;
                                    if (settingsManager.isDebugMode()) processStateManager.appendInfoMessage(`✔️ 文件: ${itemDisplayPath} (${formattedSize})`);
                                }
                            } else {
                                failureCount++;
                                let ed = !itemDetails.Etag ? "缺少Etag" : "缺少大小";
                                processStateManager.appendErrorMessage(`❌ 文件 "${itemDisplayPath}" (${formattedSize}) ${ed}`);
                            }
                        } else if (itemDetails.Type === 1) { // Folder
                            markFolderCb(true);
                            processStateManager.appendInfoMessage(`📁 扫描文件夹: ${itemDisplayPath}`);
                            progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: itemDisplayPath, extraStatus: "列出内容..." });
                            try {
                                const contents = await apiHelper.listDirectoryContents(itemDetails.FileID);
                                if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                                totalDiscovered += contents.length;
                                for (const contentItem of contents) {
                                    if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                                    if (isNaN(contentItem.FileID)) { failureCount++; totalDiscovered = Math.max(1, totalDiscovered -1); processStateManager.appendErrorMessage(`❌ 文件夹 "${itemDisplayPath}" 内发现无效项目ID`); continue; }
                                    await processSingleItem(contentItem, itemDisplayPath); // Pass the whole contentItem
                                    await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 10));
                                }
                            } catch (e) { if (processStateManager.isStopRequested()) throw e; processStateManager.appendErrorMessage(`❌ 处理文件夹 "${itemDisplayPath}" 内容最终失败: ${e.message}`); progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: itemDisplayPath, extraStatus: "列出内容失败" }); }
                        }
                        await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 5));
                    }

                    progressCb({ processed: 0, total: totalDiscovered, successCount: 0, failureCount: 0, currentFile: "准备开始..." });
                    for (let i = 0; i < selectedItemIds.length; i++) { if (processStateManager.isStopRequested()) break; await processSingleItem(selectedItemIds[i], ""); }
                    return { totalDiscoveredItemsForProgress: Math.max(totalDiscovered, processedCount), itemsProcessedForProgress: processedCount, successes: successCount, failures: failureCount };
                }, "生成秒传链接", false, useProgressPage);
            },

            generateLinkFromPublicShare: async function(shareKey, sharePwd, startParentFileId = "0", isBatchMode = false, useProgressPage = false) {
                if (!shareKey?.trim()) { uiManager.showAlert("分享Key不能为空。"); return "";}
                if (isNaN(parseInt(startParentFileId))) { uiManager.showAlert("起始文件夹ID必须是数字。"); return ""; }

                return this._generateLinkProcess(async (addDataCb, markFolderCb, progressCb) => {
                    let totalDiscovered = 1;
                    let processedCount = 0;
                    let successCount = 0;
                    let failureCount = 0;

                    async function _fetchSharedItemsRecursive(currentSharedParentId, currentRelativePath) {
                        if (processStateManager.isStopRequested()) throw new Error("UserStopped");

                        // Add pause check
                        while (processStateManager.isPaused()) {
                            await new Promise(r => setTimeout(r, 100)); // Wait 100ms before checking again
                        }

                        const baseItemNameForUI = `${currentRelativePath || '分享根目录'}/ID:${currentSharedParentId}`;
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForUI, extraStatus: "获取分享内容..." });

                        let contents;
                        try {
                            contents = await apiHelper.listSharedDirectoryContents(currentSharedParentId, shareKey, sharePwd);
                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                        } catch (e) {
                            if (processStateManager.isStopRequested()) throw e;
                            failureCount++; processedCount++;
                            processStateManager.appendErrorMessage(`❌ 获取分享目录 "${baseItemNameForUI}" 内容失败: ${e.message}`);
                            progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForUI, extraStatus: "获取分享内容失败" });
                            return;
                        }

                        if (processedCount === 0 && currentSharedParentId === startParentFileId) totalDiscovered = contents.length > 0 ? contents.length : 1;
                        else totalDiscovered += contents.length;
                        processedCount++;

                        for (const item of contents) {
                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                            if (isNaN(item.FileID)) { failureCount++; totalDiscovered = Math.max(1, totalDiscovered-1); processStateManager.appendErrorMessage(`❌ 分享内发现无效项目ID: ${item.FileName}`); continue; }

                            const cleanName = (item.FileName || "Unknown").replace(/[#$%\/]/g, "_").replace(new RegExp(COMMON_PATH_DELIMITER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '_');
                            const itemDisplayPath = `${currentRelativePath ? currentRelativePath + '/' : ''}${cleanName}`;
                            const formattedSize = formatBytes(Number(item.Size) || 0);

                            // Test case for test_failure.txt
                            if (cleanName === "test_failure.txt") {
                                processStateManager.appendErrorMessage(`❌ 测试失败文件: ${itemDisplayPath}`);
                                failureCount++;
                                continue;
                            }

                            let itemProcessedThisLoop = false; // Flag to ensure processedCount is incremented correctly for files

                            if (item.Type === 0) { // File
                                progressCb({ processed: processedCount + (itemProcessedThisLoop ? 0 : 1), total: totalDiscovered, successCount, failureCount, currentFile: `${itemDisplayPath} (${formattedSize})` });
                                if (item.Etag && item.Size !== undefined) {
                                    if (filterManager.shouldFilterFile(cleanName, true)) { processStateManager.appendInfoMessage(`⏭️ 已过滤: ${itemDisplayPath} (${formattedSize})`); }
                                    else { addDataCb({ etag: item.Etag, size: item.Size, fullPath: itemDisplayPath }); successCount++; if (settingsManager.isDebugMode()) processStateManager.appendInfoMessage(`✔️ 文件 (分享): ${itemDisplayPath} (${formattedSize})`);}
                                } else { failureCount++; let ed = !item.Etag ? "缺少Etag" : "缺少大小"; processStateManager.appendErrorMessage(`❌ 分享文件 "${itemDisplayPath}" (${formattedSize}) ${ed}`); }
                                if(!itemProcessedThisLoop) { processedCount++; itemProcessedThisLoop = true;}
                            } else if (item.Type === 1) { // Folder
                                progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: itemDisplayPath }); // Update UI for folder before recursive call
                                markFolderCb(true);
                                processStateManager.appendInfoMessage(`📁 扫描分享文件夹: ${itemDisplayPath}`);
                                await _fetchSharedItemsRecursive(item.FileID, itemDisplayPath);
                            }
                            await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 20));
                        }
                    }
                    progressCb({ processed: 0, total: totalDiscovered, successCount: 0, failureCount: 0, currentFile: "准备开始从分享链接生成..." });
                    await _fetchSharedItemsRecursive(startParentFileId, "");
                    return { totalDiscoveredItemsForProgress: Math.max(totalDiscovered, processedCount), itemsProcessedForProgress: processedCount, successes: successCount, failures: failureCount };
                }, `从分享链接生成 (Key: ${shareKey.substring(0,8)}...)`, isBatchMode, useProgressPage);
            },

            parseShareLink: (shareLink) => {
                let commonBasePath = ""; let isCommonPathFormat = false; let isV2EtagFormat = false;
                if (shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V2)) { isCommonPathFormat = true; isV2EtagFormat = true; shareLink = shareLink.substring(COMMON_PATH_LINK_PREFIX_V2.length); }
                else if (shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V1)) { isCommonPathFormat = true; shareLink = shareLink.substring(COMMON_PATH_LINK_PREFIX_V1.length); }
                if (isCommonPathFormat) { const delimiterPos = shareLink.indexOf(COMMON_PATH_DELIMITER); if (delimiterPos > -1) { commonBasePath = shareLink.substring(0, delimiterPos); shareLink = shareLink.substring(delimiterPos + 1); } else { console.error("Malformed common path link: delimiter not found."); isCommonPathFormat = false; } }
                else { if (shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V2)) { isV2EtagFormat = true; shareLink = shareLink.substring(LEGACY_FOLDER_LINK_PREFIX_V2.length); } else if (shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V1)) { shareLink = shareLink.substring(LEGACY_FOLDER_LINK_PREFIX_V1.length); } }
                return shareLink.split('$').map(sLink => { const parts = sLink.split('#'); if (parts.length >= 3) { let etag = parts[0]; try { etag = optimizedEtagToHex(parts[0], isV2EtagFormat); } catch (e) { console.error(`[${SCRIPT_NAME}] Error decoding ETag: ${parts[0]}, ${e.message}`); return null; } let filePath = parts.slice(2).join('#'); if (isCommonPathFormat && commonBasePath) filePath = commonBasePath + filePath; return { etag: etag, size: parts[1], fileName: filePath }; } return null; }).filter(i => i);
            },
            transferFromShareLink: async function(shareLink, targetFolderPath = "", startIndex = null, endIndex = null) {
                if (!shareLink?.trim()) { uiManager.showAlert("链接为空"); return; } const filesToProcess = this.parseShareLink(shareLink); if (!filesToProcess.length) { uiManager.showAlert("无法解析链接或链接中无有效文件信息"); return; }
                const isFolderStructureHint = shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V1) || shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V1) || shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V2) || shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V2) || filesToProcess.some(f => f.fileName.includes('/'));
                await this._executeActualFileTransfer(filesToProcess, isFolderStructureHint, "链接转存", [], targetFolderPath, startIndex, endIndex);
            },
            transferImportedJsonData: async function(jsonData, targetFolderPath = "", startIndex = null, endIndex = null) {
                if (!jsonData || typeof jsonData !== 'object') { uiManager.showAlert("JSON数据无效"); return; } const { scriptVersion, exportVersion, usesBase62EtagsInExport, commonPath, files } = jsonData; if (!files || !Array.isArray(files) || files.length === 0) { uiManager.showAlert("JSON文件中没有有效的文件条目。"); return; }
                processStateManager.appendInfoMessage(`[导入] JSON包含 ${files.length} 个条目。公共路径: '${commonPath || "(无)"}', Base62 ETags (声明): ${usesBase62EtagsInExport === undefined ? '未声明' : usesBase62EtagsInExport}`); let preprocessingFailedItems = [];
                const filesToProcess = files.map(fileFromJson => { if (!fileFromJson || typeof fileFromJson.path !== 'string' || !fileFromJson.size || !fileFromJson.etag) { const errorMsg = "条目无效 (缺少 path, size, or etag)"; preprocessingFailedItems.push({ fileName: (fileFromJson||{}).path || "未知文件(数据缺失)", error: errorMsg, originalEntry: fileFromJson||{} }); return null; } let finalEtag; try { let attemptDecode = usesBase62EtagsInExport; if (usesBase62EtagsInExport === undefined) { const isLikelyHex = /^[0-9a-fA-F]+$/.test(fileFromJson.etag); if (isLikelyHex && fileFromJson.etag.length === 32) attemptDecode = false; else if (!isLikelyHex || fileFromJson.etag.length < 32) attemptDecode = true; else attemptDecode = false; processStateManager.appendInfoMessage(`[导入推断] 文件 '${fileFromJson.path.substring(0,30)}...' ETag '${fileFromJson.etag.substring(0,10)}...', usesBase62EtagsInExport未声明，推断为: ${attemptDecode}`); } finalEtag = attemptDecode ? optimizedEtagToHex(fileFromJson.etag, true) : fileFromJson.etag; } catch (e) { const errorMsg = `ETag解码失败 (${fileFromJson.etag}): ${e.message}`; processStateManager.appendErrorMessage(`❌ ${errorMsg} 文件: ${fileFromJson.path}`); preprocessingFailedItems.push({ fileName: fileFromJson.path, error: errorMsg, originalEntry: fileFromJson }); return null; } const fullFileName = commonPath ? commonPath + fileFromJson.path : fileFromJson.path; return { etag: finalEtag, size: String(fileFromJson.size), fileName: fullFileName, originalEntry: fileFromJson }; }).filter(f => f !== null);
                if (preprocessingFailedItems.length > 0) processStateManager.appendErrorMessage(`[导入注意] ${preprocessingFailedItems.length} 个条目在预处理阶段失败，将不会被尝试转存。`);
                if (!filesToProcess.length && preprocessingFailedItems.length > 0) { uiManager.showModal("⚠️ JSON导入预处理失败",`所有 ${preprocessingFailedItems.length} 个文件条目在导入预处理阶段即发生错误，无法继续转存。<br><div id="fastlink-permanent-failures-log" style="display: block; margin-top: 10px; text-align: left; max-height: 150px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; font-size: 0.85em;"><h4>预处理失败项目:</h4><div id="fastlink-failures-list">${preprocessingFailedItems.map(pf => `<p style="margin:2px 0;">📄 <span style="font-weight:bold;">${pf.fileName}</span>: <span style="color:red;">${pf.error}</span></p>`).join('')}</div></div>`, 'info_with_buttons', true, null, null, preprocessingFailedItems); return; }
                else if (!filesToProcess.length) { uiManager.showAlert("JSON文件中解析后无有效文件可转存（所有条目均无效或解码失败）。"); return; }
                const isFolderStructureHint = !!commonPath || filesToProcess.some(f => f.fileName.includes('/')); await this._executeActualFileTransfer(filesToProcess, isFolderStructureHint, "文件导入", preprocessingFailedItems, targetFolderPath, startIndex, endIndex);
            },
            _executeActualFileTransfer: async function(filesToProcess, isFolderStructureHint, operationTitle = "转存", initialPreprocessingFailures = [], targetFolderPath = "", startIndex = null, endIndex = null) {
                processStateManager.reset();
                processStateManager.startOperation();
                this.currentOperationRateLimitStatus.consecutiveRateLimitFailures = 0;
                let permanentlyFailedItems = [...initialPreprocessingFailures];
                let totalSuccessfullyTransferredSize = 0;

                // Apply range filter if specified
                console.log(`before: startIndex: ${startIndex}, endIndex: ${endIndex}`);
                if (startIndex == null && endIndex !== null)
                {
                    startIndex = 1;
                } else if (startIndex !== null && endIndex == null)
                {
                    endIndex = originalLength;
                }
                console.log(`after: startIndex: ${startIndex}, endIndex: ${endIndex}`);
                if (startIndex !== null && endIndex !== null) {
                    const originalLength = filesToProcess.length;
                    if (startIndex > originalLength) {
                        uiManager.showAlert(`起始序号超出范围：总文件数为 ${originalLength}，但起始序号为 ${startIndex}`);
                        return;
                    }
                    if (endIndex > originalLength) {
                        uiManager.showAlert(`结束序号超出范围：总文件数为 ${originalLength}，但结束序号为 ${endIndex}`);
                        return;
                    }
                    filesToProcess = filesToProcess.slice(startIndex - 1, endIndex);
                    processStateManager.appendInfoMessage(`ℹ️ 已应用文件范围过滤: ${startIndex}-${endIndex} (共 ${filesToProcess.length} 个文件)`);
                    if (filesToProcess.length === 0) {
                        uiManager.showAlert(`指定范围内没有文件可处理 (范围: ${startIndex}-${endIndex}, 总文件数: ${originalLength})`);
                        return;
                    }
                }

                let rootDirId = this.getCurrentDirectoryId();
                if (rootDirId === null || isNaN(parseInt(rootDirId))) { uiManager.showAlert("无法确定当前目标目录ID。将尝试转存到根目录。"); rootDirId = "0"; }
                rootDirId = parseInt(rootDirId);
                let userSpecifiedFolderPath = targetFolderPath ? targetFolderPath.trim() : "";
                let finalRootDirId = rootDirId;
                const pathPrefixInput = document.getElementById('fl-path-prefix');
                const pathPrefix = pathPrefixInput ? pathPrefixInput.value.trim() : "";
                if (pathPrefix) { processStateManager.appendInfoMessage(`ℹ️ 已启用路径前缀过滤: ${pathPrefix}`); filesToProcess = filesToProcess.filter(file => file.fileName.startsWith(pathPrefix)); if (filesToProcess.length === 0) { uiManager.showAlert("没有找到以指定路径前缀开头的文件。"); return; } }

                const initialModalTitle = `⏳ 转存中 (${filesToProcess.length} 项)`;
                // Initial modal content with placeholder for folder selector (might be removed if no folder path input)
                let modalContent = `
                    <div class="fastlink-progress-container"><div class="fastlink-progress-bar" style="width: 0%"></div></div>
                    <div class="fastlink-status-container">
                        <div class="fastlink-info-status">
                            <p>🚀 准备${operationTitle} ${filesToProcess.length} 个文件到目录ID ${rootDirId}${userSpecifiedFolderPath ? " 的 " + userSpecifiedFolderPath + " 文件夹中" : ""}</p>
                            <div class="fastlink-info-messages"></div>
                        </div>
                        <div class="fastlink-error-status">
                            <p>⚠️ 错误信息</p>
                            <div class="fastlink-error-messages"></div>
                        </div>
                        <p class="extra-status-message" style="color: #ff7f50; display: none;"></p>
                    </div>
                    <div class="fastlink-stats"><span class="success-count">✅ 成功：0</span><span class="failed-count">❌ 失败：0</span></div>
                    <div class="fastlink-current-file"><p class="file-name">准备开始...</p></div>
                    <div id="fastlink-permanent-failures-log" style="display: none; margin-top: 10px; text-align: left; max-height: 100px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; font-size: 0.85em;"><h4>永久失败项目:</h4><div id="fastlink-failures-list"></div></div>`;

                // Folder selector is only part of the 'inputLink' or 'inputPublicShare' initial modal, not the progress modal directly *during* transfer.
                // However, the logic to create userSpecifiedFolderPath runs *before* the loop.
                // For this modal, we don't need to show the input again.
                uiManager.showModal(initialModalTitle, modalContent, 'progress_stoppable', false);

                let successes = 0, failures = 0; const folderCache = {}; const startTime = Date.now();

                if (userSpecifiedFolderPath) {
                    try {
                        processStateManager.updateProgressUI(0, filesToProcess.length, successes, failures, `创建目标文件夹: ${userSpecifiedFolderPath}`, "");
                        const dirContents = await apiHelper.listDirectoryContents(rootDirId, 500); // Check against current dir
                        if (processStateManager.isStopRequested()) { uiManager.showAlert("操作已取消"); return; }

                        const pathParts = userSpecifiedFolderPath.split('/');
                        let parentIdForUserPath = rootDirId; // User path is relative to current dir
                        let currentPathForUser = "";

                        for (let i = 0; i < pathParts.length; i++) {
                            const folderName = pathParts[i].trim(); if (!folderName) continue;
                            currentPathForUser = currentPathForUser ? `${currentPathForUser}/${folderName}` : folderName;
                            const userPathCacheKey = `user_${currentPathForUser.replace(/\//g, '_')}`;
                            if (folderCache[userPathCacheKey]) { parentIdForUserPath = folderCache[userPathCacheKey]; continue; }

                            const existingFolder = dirContents.find(item => item.Type === 1 && item.FileName === folderName && item.ParentFileID == parentIdForUserPath); // More specific check
                            if (existingFolder && !isNaN(existingFolder.FileID)) {
                                parentIdForUserPath = existingFolder.FileID;
                                processStateManager.appendInfoMessage(`ℹ️ 文件夹已存在: ${folderName} (ID: ${parentIdForUserPath})`);
                            } else {
                                processStateManager.appendInfoMessage(`📁 创建文件夹: ${folderName} (在ID: ${parentIdForUserPath})`);
                                const newFolder = await apiHelper.createFolder(parentIdForUserPath, folderName);
                                if (processStateManager.isStopRequested()) { uiManager.showAlert("操作已取消"); return; }
                                if (newFolder && !isNaN(parseInt(newFolder.FileId))) { parentIdForUserPath = parseInt(newFolder.FileId); processStateManager.appendInfoMessage(`✅ 文件夹创建成功: ${folderName} (ID: ${parentIdForUserPath})`); }
                                else { throw new Error(`创建文件夹返回的ID无效: ${JSON.stringify(newFolder)}`); }
                            }
                            folderCache[userPathCacheKey] = parentIdForUserPath;
                        }
                        finalRootDirId = parentIdForUserPath;
                        processStateManager.appendInfoMessage(`✅ 目标文件夹就绪: ${userSpecifiedFolderPath} (ID: ${finalRootDirId})`);
                    } catch (error) {
                        processStateManager.appendErrorMessage(`❌ 创建目标文件夹 "${userSpecifiedFolderPath}" 失败: ${error.message}`);
                        console.error(`[${SCRIPT_NAME}] 创建目标文件夹错误:`, error);
                        uiManager.showAlert(`创建目标文件夹失败: ${error.message}，将尝试转存到当前目录 (ID: ${rootDirId})`);
                        finalRootDirId = rootDirId; // Fallback
                    }
                }

                for (let i = 0; i < filesToProcess.length; i++) {
                    if (processStateManager.isStopRequested()) break;

                    // Add pause check
                    while (processStateManager.isPaused()) {
                        await new Promise(r => setTimeout(r, 100)); // Wait 100ms before checking again
                    }

                    const file = filesToProcess[i];
                    const originalFileNameForLog = file.fileName || "未知文件";
                    const formattedFileSize = file.size ? formatBytes(Number(file.size)) : "未知大小";

                    if (!file || !file.fileName || !file.etag || !file.size) { failures++; processStateManager.appendErrorMessage(`❌ 跳过无效文件数据 (索引 ${i}): ${originalFileNameForLog}`); permanentlyFailedItems.push({ ...file, fileName: originalFileNameForLog, error: "无效文件数据" }); processStateManager.updateProgressUI(i + 1, filesToProcess.length, successes, failures, `无效数据 (${formattedFileSize})`); continue; }
                    if (filterManager.shouldFilterFile(file.fileName, false)) { processStateManager.appendInfoMessage(`⏭️ 已过滤: ${file.fileName} (${formattedFileSize})`); processStateManager.updateProgressUI(i + 1, filesToProcess.length, successes, failures, `已过滤: ${file.fileName} (${formattedFileSize})`); continue; }

                    processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${file.fileName} (${formattedFileSize})`, "");
                    let effectiveParentId = finalRootDirId; // Start with the (potentially user-specified) target folder
                    let actualFileName = file.fileName;

                    try {
                        if (file.fileName.includes('/')) {
                            const pathParts = file.fileName.split('/');
                            actualFileName = pathParts.pop();
                            if (!actualFileName && pathParts.length > 0 && file.fileName.endsWith('/')) {
                                processStateManager.appendErrorMessage(`⚠️ 文件路径 "${file.fileName}" (${formattedFileSize}) 可能表示目录，跳过。`);
                                failures++;
                                permanentlyFailedItems.push({ ...file, error: "路径表示目录" });
                                continue;
                            }

                            let parentIdForLinkPath = finalRootDirId; // **FIXED**: Link paths are relative to finalRootDirId
                            let currentCumulativeLinkPath = "";

                            // 添加调试信息
                            processStateManager.appendInfoMessage(`🔍 处理文件路径: ${file.fileName} (共 ${pathParts.length} 级目录)`);

                            for (let j = 0; j < pathParts.length; j++) {
                                if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                                const part = pathParts[j];
                                if (!part) continue;

                                currentCumulativeLinkPath = j === 0 ? part : `${currentCumulativeLinkPath}/${part}`;
                                processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${file.fileName} (${formattedFileSize})`, `检查/创建路径: ${currentCumulativeLinkPath} (第${j+1}级)`);

                                // 使用更简单的缓存键，避免路径分隔符问题
                                const cacheKeyForLinkPath = `link_${currentCumulativeLinkPath.replace(/\//g, '_')}`;
                                if (folderCache[cacheKeyForLinkPath]) {
                                    parentIdForLinkPath = folderCache[cacheKeyForLinkPath];
                                    processStateManager.appendInfoMessage(`✅ 使用缓存: ${currentCumulativeLinkPath} (ID: ${parentIdForLinkPath})`);
                                } else {
                                    try {
                                        const dirContents = await apiHelper.listDirectoryContents(parentIdForLinkPath, 500);
                                        if (processStateManager.isStopRequested()) throw new Error("UserStopped");

                                        const foundFolder = dirContents.find(it => it.Type === 1 && it.FileName === part && it.ParentFileID == parentIdForLinkPath);

                                        if (foundFolder && !isNaN(foundFolder.FileID)) {
                                            parentIdForLinkPath = foundFolder.FileID;
                                            processStateManager.appendInfoMessage(`✅ 找到已存在文件夹: ${part} (ID: ${parentIdForLinkPath})`);
                                        } else {
                                            processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${file.fileName} (${formattedFileSize})`, `创建文件夹: ${currentCumulativeLinkPath} (第${j+1}级)`);
                                            processStateManager.appendInfoMessage(`📁 创建新文件夹: ${part} (在ID: ${parentIdForLinkPath})`);

                                            const createdFolder = await apiHelper.createFolder(parentIdForLinkPath, part);
                                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");

                                            if (createdFolder && createdFolder.FileId) {
                                                parentIdForLinkPath = parseInt(createdFolder.FileId);
                                                processStateManager.appendInfoMessage(`✅ 文件夹创建成功: ${part} (新ID: ${parentIdForLinkPath})`);
                                            } else {
                                                throw new Error(`创建文件夹 "${part}" 失败: API返回无效响应`);
                                            }
                                        }
                                        folderCache[cacheKeyForLinkPath] = parentIdForLinkPath;
                                    } catch (folderError) {
                                        processStateManager.appendErrorMessage(`❌ 处理文件夹 "${part}" 失败: ${folderError.message}`);
                                        throw new Error(`创建目录结构失败: ${folderError.message}`);
                                    }

                                    // 增加延迟以避免API限制
                                    await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 5));
                                }
                            }
                            effectiveParentId = parentIdForLinkPath;
                            processStateManager.appendInfoMessage(`🎯 最终目标目录ID: ${effectiveParentId} (路径: ${currentCumulativeLinkPath})`);
                        }

                        if (isNaN(effectiveParentId) || effectiveParentId < 0) throw new Error(`路径创建失败或父ID无效 (${effectiveParentId}) for ${file.fileName} (${formattedFileSize})`);
                        if (!actualFileName) throw new Error(`文件名无效 for ${file.fileName} (${formattedFileSize})`);

                        processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${actualFileName} (${formattedFileSize})`, `秒传到ID: ${effectiveParentId}`);
                        await apiHelper.rapidUpload(file.etag, file.size, actualFileName, effectiveParentId);
                        if (processStateManager.isStopRequested()) throw new Error("UserStopped"); successes++; totalSuccessfullyTransferredSize += Number(file.size); processStateManager.appendInfoMessage(`✔️ 文件: ${file.fileName} (${formattedFileSize})`);
                    } catch (e) { if (processStateManager.isStopRequested()) break; failures++; processStateManager.appendErrorMessage(`❌ 文件 "${actualFileName}" (${formattedFileSize}) (原始: ${originalFileNameForLog}) 失败: ${e.message}`); permanentlyFailedItems.push({ ...file, fileName: originalFileNameForLog, error: e.message }); processStateManager.updateProgressUI(i + 1, filesToProcess.length, successes, failures, `${actualFileName} (${formattedFileSize})`, "操作失败"); }
                    await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 5));
                }
                processStateManager.updateProgressUI(filesToProcess.length, filesToProcess.length, successes, failures, "处理完成", "");
                processStateManager.markCompleted();
                const totalTime = Math.round((Date.now() - startTime) / 1000); let resultEmoji = successes > 0 && permanentlyFailedItems.length === 0 ? '🎉' : (successes > 0 ? '🎯' : '😢'); if (processStateManager.isStopRequested()) resultEmoji = '🔴';
                let finalUserMessage = processStateManager.isStopRequested() ? "操作已由用户停止" : `${operationTitle}完成`; if (!processStateManager.isStopRequested() && permanentlyFailedItems.length > 0) finalUserMessage = `${operationTitle}部分完成或预处理失败，共 ${permanentlyFailedItems.length} 个文件有问题。`;
                const formattedTotalSuccessfullyTransferredSize = formatBytes(totalSuccessfullyTransferredSize);
                let summary = `<div class="fastlink-result"><h3>${resultEmoji} ${finalUserMessage}</h3><p>✅ 成功转存: ${successes} 个文件</p><p>💾 成功转存总大小: ${formattedTotalSuccessfullyTransferredSize}</p><p>❌ 转存尝试失败: ${failures} 个文件</p><p>📋 总计问题文件 (含预处理): ${permanentlyFailedItems.length} 个</p><p>⏱️ 耗时: ${totalTime} 秒</p>${!processStateManager.isStopRequested() && successes > 0 ? '<p>📢 请手动刷新页面查看已成功转存的结果</p>' : ''}</div>`;
                if (permanentlyFailedItems.length > 0) {
                    summary += `<div class="fastlink-failures-summary" style="margin-top: 15px; text-align: left; max-height: 200px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; font-size: 0.9em;">
                        <h4 style="margin: 0 0 10px 0;">❌ 失败项目详情:</h4>
                        ${permanentlyFailedItems.map((item, index) => `
                            <div class="failure-item" style="margin-bottom: 8px; padding: 5px; background: ${index % 2 === 0 ? '#f9f9f9' : '#fff'};">
                                <p style="margin: 0;"><strong>文件名:</strong> ${item.fileName || '未知文件'}</p>
                                <p style="margin: 3px 0 0 0; color: #ff4444;"><strong>错误:</strong> ${item.error || '未知错误'}</p>
                            </div>
                        `).join('')}
                    </div>`;
                }
                uiManager.updateModalTitle(processStateManager.isStopRequested() ? "🔴 操作已停止" : "🎉 转存完成");
                uiManager.updateModalContent(summary);
                if (permanentlyFailedItems.length > 0 && !processStateManager.isStopRequested()) {
                    const failuresLogDiv = document.getElementById('fastlink-failures-list'); const permanentFailuresDiv = document.getElementById('fastlink-permanent-failures-log');
                    if (failuresLogDiv && permanentFailuresDiv) { failuresLogDiv.innerHTML = ''; permanentlyFailedItems.forEach(pf => { const p = document.createElement('p'); p.style.margin = '2px 0'; p.innerHTML = `📄 <span style="font-weight:bold;">${pf.fileName}</span>: <span style="color:red;">${pf.error || '未知错误'}</span>`; failuresLogDiv.appendChild(p); }); permanentFailuresDiv.style.display = 'block'; }
                    const modalInstance = uiManager.getModalElement();
                    if (modalInstance) {
                        let buttonsDiv = modalInstance.querySelector('.fastlink-modal-buttons'); if(!buttonsDiv) { buttonsDiv = document.createElement('div'); buttonsDiv.className = 'fastlink-modal-buttons'; modalInstance.querySelector(`#${uiManager.MODAL_CONTENT_ID}`)?.appendChild(buttonsDiv); } buttonsDiv.innerHTML = '';
                        const retryBtn = document.createElement('button'); retryBtn.id = 'fl-m-retry-failed'; retryBtn.className = 'confirm-btn'; retryBtn.textContent = `🔁 重试失败项 (${permanentlyFailedItems.length})`; retryBtn.onclick = () => { this._executeActualFileTransfer(permanentlyFailedItems, isFolderStructureHint, operationTitle + " - 重试", [], targetFolderPath, startIndex, endIndex); }; buttonsDiv.appendChild(retryBtn);
                        const copyLogBtn = document.createElement('button'); copyLogBtn.id = 'fl-m-copy-failed-log'; copyLogBtn.className = 'copy-btn'; copyLogBtn.style.marginLeft = '10px'; copyLogBtn.textContent = '复制问题日志'; copyLogBtn.onclick = () => { const logText = permanentlyFailedItems.map(pf => `文件: ${pf.fileName || (pf.originalEntry&&pf.originalEntry.path)||'未知路径'}\n${(pf.originalEntry&&pf.originalEntry.etag)?('原始ETag: '+pf.originalEntry.etag+'\n'):(pf.etag?'处理后ETag: '+pf.etag+'\n':'')}${(pf.originalEntry&&pf.originalEntry.size)?('大小: '+pf.originalEntry.size+'\n'):(pf.size?'大小: '+pf.size+'\n':'')}错误: ${pf.error||'未知错误'}`).join('\n\n'); GM_setClipboard(logText); uiManager.showAlert("问题文件日志已复制到剪贴板！", 1500); }; buttonsDiv.appendChild(copyLogBtn);

                    }
                    uiManager.enableModalCloseButton(false); // Use custom close button
                } else {
                    uiManager.enableModalCloseButton(true); // Enable original close button
                }
            },
            // =================================================================
            // Gemini 新增：独立的JSON文件拆分逻辑 (重构版) END
            // =================================================================
        };

        const uiManager = {
            modalElement: null, dropdownMenuElement: null, STYLE_ID: 'fastlink-dynamic-styles', MODAL_CONTENT_ID: 'fastlink-modal-content-area',
            activeModalOperationType: null, modalHideCallback: null,
            miniProgressElement: null, isMiniProgressActive: false, // Added for mini progress
            preferredCenteredLayout: false,

            _downloadToFile: function(content, filename, contentType) { const a = document.createElement('a'); const blob = new Blob([content], { type: contentType }); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); },
            applyStyles: function() {
                const style = document.createElement('style');
                style.textContent = `
                    .fastlink-modal {
                        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                        background: linear-gradient(45deg, #e6f0ff 0%, #f5faff 30%, #ffffff 100%);
                        border-radius:8px;
                        padding: 12px; border-radius: 18px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; width: 380px; max-height: 80vh; display: flex; flex-direction: column; }
                    .fastlink-modal-title-container { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }                .fastlink-modal-title { font-size: 18px; font-weight: bold; }                .fastlink-modal-close-btn { background: none; border: none; font-size: 28px; cursor: pointer; color: #f44336; padding: 0; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; }                .fastlink-modal-close-btn:hover { background: #ffebee; color: #d32f2f; }
                    .fastlink-modal-content { flex: 1; overflow-y: auto; margin-bottom: 10px; position: relative; max-height: calc(75vh - 120px); padding-bottom: 24px; }
                    .fastlink-modal-buttons {
    display: flex;              /* 使用弹性布局 */
    justify-content: center;    /* 子元素水平居中排列 */
    gap: 8px;                  /* 子元素之间的间距为10px */
    flex-wrap: wrap;            /* 允许子元素换行 */
    position: static;           /* 固定在内容下方，不覆盖内容 */
    background: inherit;        /* 继承父元素背景色 */
    border: 2px dashed #ccc;      /* 2像素虚线边框，浅灰色 */
    border-radius: 8px;
    padding: 8px 10px;          /* 适度内边距 */
    margin-top: auto;           /* 推到弹窗底部 */
    }
                    .fastlink-modal-buttons button { padding: 10px 16px; border: none; border-radius: 14px; cursor: pointer; font-size: 1em; }
                    .fastlink-modal-buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
                    .fastlink-modal-buttons .confirm-btn {
                    background:rgb(57, 187, 59);
                    border-radius: 12px;
                    width: 120px;
                    height: 44px;
                    box-shadow: 2px 2px 5px rgba(51, 244, 179, 0.3);
                    transition: box-shadow 0.3s ease;
                    }
                    .fastlink-modal-buttons .copy-btn {
                    background: #2196F3;
                    color: white;
                    border-radius: 12px;
                    width: 120px;
                    height: 44px;
                    box-shadow: 2px 2px 5px rgba(53, 200, 245, 0.3);
                    transition: box-shadow 0.3s ease;
                    }
                    .fastlink-modal-buttons .export-btn {
                    background: #FF9800;
                    color: white;
                    border-radius: 12px;
                    width: 120px;
                    height: 44px;
                    box-shadow: 2px 2px 5px rgba(239, 54, 41, 0.3);
                    transition: box-shadow 0.3s ease;
                    }
                    .fastlink-modal-buttons .stop-btn {
                    border-radius: 12px;
                    width: 120px;
                    height: 44px;
                    box-shadow: 2px 2px 5px rgba(244, 67, 54, 0.3);
                    transition: box-shadow 0.3s ease;
                    background: #f44336;
                    color: white; }
                    .fastlink-modal-buttons .pause-btn {
                    border-radius: 12px;
                    width: 120px;
                    height: 44px;
                    box-shadow: 2px 2px 5px rgba(250, 147, 56, 0.3);
                    transition: box-shadow 0.3s ease;
                    background: #FF9800;
                    color: white; }
                    .fastlink-modal-buttons .minimize-btn {
                    border-radius: 12px;
                    width: 120px;
                    height: 44px;
                    box-shadow: 2px 2px 5px rgba(91, 81, 81, 0.3);
                    transition: box-shadow 0.3s ease;
                    background:rgb(148, 146, 146); color: white; }
    .fastlink-modal-input {
    min-height: 280px;
    width: 100%;
    margin: 0;
    padding: 12px;
    box-sizing: border-box;
    text-align: left;
    display: block;
    border-radius:8px;
    border: 1px solid #d9d9d9;
    font-family: monospace;
    font-size: 14px;
    line-height: 1.4;
    word-break: break-all;
    background-color: #f9f9f9;
    resize: vertical;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    }
                    .fastlink-modal-textarea{width:calc(100% - 16px);padding:8px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px;min-height:200px;font-family:monospace;white-space:pre;resize:vertical}
                    .fastlink-file-input-container{margin-top:10px;margin-bottom:5px;text-align:left}
    .fastlink-file-input-label{
    display: block;
    font-size: 1em;
    width: 100%;
    height: 48px;
    line-height: 46px;
    border-radius: 12px;
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    box-sizing: border-box;
    cursor: pointer;
    transition: all 0.3s ease;
    text-align: center;
    }
                    .fastlink-progress-container{width:100%;height:12px;background-color:#f5f5f5;border-radius:8px;margin:10px 0 15px;overflow:hidden;box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);}
                    .fastlink-progress-bar{height:100%;background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);transition:width .3s ease;box-shadow: 0 0 0 1px rgba(24, 144, 255, 0.2);}
                    .fastlink-status{text-align:left;margin-bottom:10px;max-height:100px;overflow-y:auto;border:1px solid #eee;padding:0px;font-size:.85em;position:relative}
                    .fastlink-status p:first-child{position:sticky;top:0;background:white;z-index:1;margin:0;padding:3px 0;border-bottom:1px solid #eee}
                    .fastlink-status p{margin:3px 0;line-height:1.3}
                    .fastlink-stats{display:flex;justify-content:space-between;margin:10px 0;border-top:1px solid #e8e8e8;border-bottom:1px solid #e8e8e8;padding:8px 0;font-size:14px}
                    .fastlink-current-file{width:100%;height:50px;margin:0 auto;overflow-y:auto;word-break:break-all;background-color:#fafafa;padding:10px;border-radius:8px;border:1px solid #e8e8e8;font-family:monospace;font-size:14px;line-height:1.4;box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);}
                    .error-message{color:#d9534f;font-size:.85em}
                    .info-message{color:#28a745;font-size:.85em}
                    .fastlink-result{text-align:center}
                    .fastlink-result h3{font-size:18px;margin:5px 0 15px}
                    .fastlink-result p{margin:8px 0}
                    .fastlink-link-text{width:90%;height:50px;margin:0 auto;overflow-y:auto;word-break:break-all;background-color:#f9f9f9;padding:8px;border-radius:4px;border:1px solid #ddd;font-family:monospace;font-size:0.85em;line-height:1.4}
                    #fastlink-dropdown-menu-container{position:absolute;background:#fff;border:1px solid #ccc;padding:2px;box-shadow:0 4px 6px rgba(0,0,0,.1);margin-top:5px;z-index:10002 !important;max-height:calc(100vh - 80px);overflow-y:auto;top:100%;left:0;}
                    #fastlink-dropdown-menu-container ul{color:#333;font-size:14px;}
                    #fastlink-dropdown-menu-container .ant-dropdown-menu-item{color:#333;padding:8px 16px !important;}
                    #fastlink-dropdown-menu-container .ant-dropdown-menu-item:hover{background-color:#f0f0f0;}
                    .fastlink-drag-drop-area {
    border: 2px dashed #ccc;      /* 2像素虚线边框，浅灰色 */
    border-radius: 8px;
    padding: 12px;                /* 内边距20像素 */
    text-align: center;           /* 文字水平居中 */
    transition: border-color .3s ease; /* 边框颜色过渡动画 */
    font-size: 1.1em;             /* 字体大小稍大 */
    color: #666;                  /* 文字颜色中灰色 */
    display: block;               /* 块状布局 */
    min-height: 240px;            /* 最小高度240像素 */
    }
                    .fastlink-drag-drop-area.drag-over-active{border-color:#007bff; background-color: #f8f9fa;}
                    .filter-controls{display:flex;justify-content:space-between;margin-bottom:15px;}
                    .filter-btn{padding:5px 10px;border:1px solid #ddd;border-radius:4px;background:#f8f9f8;cursor:pointer;font-size:0.9em;}
                    .filter-btn:hover{background:#e9ecef;}
                    .filter-description{margin-bottom:15px;text-align:left;font-size:0.9em;}
                    .filter-list{max-height:250px;overflow-y:auto;border:1px solid #eee;padding:5px;text-align:left;margin-bottom:15px;}
                    .filter-item{display:flex;align-items:center;padding:5px 0;border-bottom:1px solid #f5f5f5;}
                    .filter-item:last-child{border-bottom:none;}
                    .filter-checkbox{margin-right:10px;}
                    .filter-emoji{margin-right:5px;}
                    .filter-ext{font-weight:bold;margin-right:8px;}
                    .filter-name{color:#666;font-size:0.9em;}
                    .fastlink-modal.filter-dialog{max-height:90vh;display:flex;flex-direction:column;}
                    .fastlink-modal.filter-dialog .fastlink-modal-content{flex:1;overflow-y:auto;max-height:calc(90vh - 120px);}
                    .filter-global-switches{margin-bottom:15px;text-align:left;}
                    .filter-switch-item{display:flex;align-items:center;margin-bottom:8px;}
                    .filter-toggle-checkbox{margin-right:10px;}
                    .filter-divider{margin:15px 0;border:0;border-top:1px solid #eee;}
                    .filter-select-style-container { position: relative; margin-bottom: 15px; }
                    .filter-selected-tags { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; border: 1px solid #d9d9d9; border-radius: 4px; min-height: 38px; margin-bottom: -1px; }
                    .filter-tag { display: inline-flex; align-items: center; background-color: #e6f7ff; border: 1px solid #91d5ff; border-radius: 4px; padding: 3px 8px; font-size: 0.9em; cursor: default; }
                    .filter-tag .filter-emoji { margin-right: 4px; } .filter-tag .filter-tag-text { font-weight: bold; } .filter-tag .filter-tag-name { color: #555; margin-left: 4px; font-size: 0.9em; }
                    .filter-tag-remove { margin-left: 8px; cursor: pointer; font-weight: bold; color: #555; } .filter-tag-remove:hover { color: #000; }
                    .filter-search-input { width: 100%; padding: 8px 10px; border: 1px solid #d9d9d9; border-radius: 0 0 4px 4px; box-sizing: border-box; font-size: 0.95em; }
                    .filter-selected-tags + .filter-search-input { border-top-left-radius: 0; border-top-right-radius: 0; }
                    .filter-search-input:focus { outline: none; border-color: #40a9ff; box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2); }
                    .filter-dropdown { position: absolute; top: 100%; left: 0; right: 0; background-color: #fff; border: 1px solid #d9d9d9; border-top: none; max-height: 200px; overflow-y: auto; z-index: 1001; display: none; border-radius: 0 0 4px 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
                    .filter-dropdown-item { display: flex; align-items: center; padding: 8px 12px; cursor: pointer; font-size: 0.9em; }
                    .filter-dropdown-item:hover { background-color: #f5f5f5; } .filter-dropdown-item .filter-emoji { margin-right: 6px; } .filter-dropdown-item .filter-ext { font-weight: bold; margin-right: 6px; } .filter-dropdown-item .filter-name { color: #555; }
                    .fastlink-modal.filter-dialog .fastlink-modal-content { max-height: calc(90vh - 160px); }
                    .folder-selector-container{margin-top:10px;text-align:left;}.folder-selector-label{display:block;margin-bottom:5px;font-size:0.9em;}.folder-selector-input-container{position:relative;}.folder-selector-input{width:100%;padding:8px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;}.folder-selector-dropdown{position:absolute;width:100%;max-height:200px;overflow-y:auto;background:#fff;border:1px solid #ccc;border-top:none;border-radius:0 0 4px 4px;z-index:1000;display:none;}.folder-selector-dropdown.active{display:block;}.folder-item{display:flex;align-items:center;padding:8px 10px;cursor:pointer;}.folder-item:hover{background:#f5f5f5;}.folder-item-checkbox{margin-right:10px;}.folder-item-icon{margin-right:8px;color:#1890ff;}.folder-item-name{flex-grow:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}.folder-tag-container{display:flex;flex-wrap:wrap;gap:5px;margin-top:5px;min-height:30px;border:1px solid #eee;padding:5px;border-radius:4px;}.folder-tag{display:flex;align-items:center;background:#e6f7ff;border-radius:2px;padding:2px 8px;border:1px solid #91d5ff;}.folder-tag-text{margin-right:5px;}.folder-tag-remove{cursor:pointer;color:#999;font-weight:bold;font-size:14px;}.folder-tag-remove:hover{color:#666;}
                    .fastlink-mini-progress{position:fixed;bottom:15px;right:15px;width:280px;background-color:#fff;border:1px solid #ccc;border-radius:6px;box-shadow:0 2px 10px rgba(0,0,0,.2);z-index:10005;padding:10px;font-size:0.85em;display:none;flex-direction:column;}
                    .fastlink-mini-progress-title{font-weight:bold;margin-bottom:5px;display:flex;justify-content:space-between;align-items:center;}
                    .fastlink-mini-progress-bar-container{width:100%;height:8px;background-color:#e9ecef;border-radius:4px;overflow:hidden;margin-bottom:5px;}
                    .fastlink-mini-progress-bar{height:100%;background-color:#007bff;transition:width .2s ease;}
                    .fastlink-mini-progress-file{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-bottom:3px;color:#555;}
                    .fastlink-mini-progress-status{font-size:0.9em;color:#333;}
                    .fastlink-mini-progress-restore-btn{font-size:0.8em;padding:3px 8px;background-color:#6c757d;color:white;border:none;border-radius:3px;cursor:pointer;align-self:flex-start;margin-top:5px;}
                    .fastlink-mini-progress-restore-btn:hover{background-color:#5a6268;}
                    /* 独立进度页面样式 - 参考侧边栏设计优化 */
                    .fastlink-progress-page {
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        z-index: 9999;
                        background: linear-gradient(45deg, #e6f0ff 0%, #f5faff 30%, #ffffff 100%);
                        border-radius: 16px;
                        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
                        width: 480px;
                        max-width: 90%;
                        max-height: 80vh;
                        overflow-y: auto;
                    }

                    .fastlink-progress-page-content {
                        padding: 20px;
                    }

                    .fastlink-progress-page-header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        margin-bottom: 16px;
                    }

                    .fastlink-progress-page-header h2 {
                        margin: 0;
                        font-size: 18px;
                        color: #333;
                        font-weight: bold;
                    }

                    .fastlink-progress-page-close-btn {
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: #f44336;
                        padding: 0;
                        width: 40px;
                        height: 40px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                    }

                    .fastlink-progress-page-close-btn:hover {
                        background-color: #ffebee;
                        color: #d32f2f;
                    }

                    .fastlink-progress-page-buttons {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 16px;
                    }

                    .settings-dialog .settings-group { margin-bottom: 15px; }
                    .settings-dialog .settings-group h4 { margin: 0 0 10px 0; color: #333; }
                    .settings-dialog .settings-item { display: flex; align-items: center; margin-bottom: 8px; }
                    .settings-dialog .settings-item label { margin-left: 8px; cursor: pointer; }
                    .settings-dialog .settings-description { font-size: 0.85em; color: #666; margin-left: 24px; margin-top: 2px; }

                    /* API Test Styles */
                    .api-test-container {
                        margin-top: 15px;
                        padding: 15px;
                        background: #f5f5f5;
                        border-radius: 8px;
                        display:none;
                    }

                    .api-test-row {
                        margin-bottom: 10px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }

                    .api-test-row label {
                        min-width: 100px;
                        font-weight: 500;
                    }

                    .api-path-select {
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        background: white;
                    }

                    .api-param-input {
                        flex: 1;
                        padding: 8px;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                    }

                    .api-test-button {
                        padding: 8px 16px;
                        background: #1890ff;
                        color: white;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: 500;
                    }

                    .api-test-button:hover {
                        background: #40a9ff;
                    }

                    .api-test-button:disabled {
                        background: #d9d9d9;
                        cursor: not-allowed;
                    }

                    .api-test-result {
                        margin-top: 15px;
                        padding: 10px;
                        border-radius: 4px;
                    }

                    .api-test-success {
                        background: #f6ffed;
                        border: 1px solid #b7eb8f;
                    }

                    .api-test-error {
                        background: #fff2f0;
                        border: 1px solid #ffccc7;
                    }

                    .api-test-loading {
                        color: #666;
                        font-style: italic;
                    }

                    .api-test-result pre {
                        margin: 10px 0 0;
                        padding: 10px;
                        background: white;
                        border-radius: 4px;
                        overflow-x: auto;
                        font-family: monospace;
                        font-size: 12px;
                        line-height: 1.5;
                    }
                    .fastlink-status-container {
                        text-align: left;
                        margin-bottom: 10px;
                        border: 1px solid #eee;
                        padding: 0px;
                        font-size: .9em;
                        position: relative;
                    }
                    .fastlink-info-status, .fastlink-error-status {
                        max-height: 100px;
                        overflow-y: auto;
                        border-bottom: 1px solid #eee;
                    }
                    .fastlink-info-status p:first-child, .fastlink-error-status p:first-child {
                        position: sticky;
                        top: 0;
                        background: white;
                        z-index: 1;
                        margin: 0;
                        padding: 3px 0;
                        border-bottom: 1px solid #eee;
                    }
                    .fastlink-info-messages, .fastlink-error-messages {
                        padding: 5px;
                    }
                    .fastlink-info-messages p, .fastlink-error-messages p {
                        margin: 3px 0;
                        line-height: 1.3;
                    }
                    .error-message {
                        color: #d9534f;
                        font-size: .9em;
                    }
                    .info-message {
                        color: #28a745;
                        font-size: .9em;
                    }
                    .fastlink-modal-version { position: absolute; bottom: 5px; right: 10px; font-size: 0.7em; color: #999; }
                    .fastlink-divider {
                        height: 1.5px;
                        margin: 0;
                        background: #cccccc;
                        border: none;
                        width: 100%;
                    }
                    .fastlink-divider-thick {
                        height: 2px;
                        margin: 0;
                        background: #cccccc;
                        border-radius: 2px;
                        width: 100%;
                    }
                    #fl-menu-more-group::-webkit-scrollbar {
                        width: 10px;
                        background: transparent;
                    }
                    #fl-menu-more-group::-webkit-scrollbar-thumb {
                        background: #b3c6e0;
                        border-radius: 8px;
                        min-height: 30px;
                    }
                    #fl-menu-more-group::-webkit-scrollbar-thumb:hover {
                        background: #1890ff;
                    }
                    #fl-menu-more-group::-webkit-scrollbar-track {
                        background: #f2f4f8;
                        border-radius: 8px;
                    }
                `;
                style.textContent += `
                    .fastlink-info-popup {
                        position: fixed;
                        bottom: 20px;
                        left: 50%;
                        transform: translateX(-50%);
                        background-color: #333;
                        color: white;
                        padding: 10px 20px;
                        border-radius: 5px;
                        z-index: 99999;
                        opacity: 1;
                        transition: opacity 0.5s ease-out;
                    }
                    .fastlink-info-popup-fadeout {
                        opacity: 0;
                    }
                    .split-options { margin: 15px 0; border: 1px solid #eee; padding: 10px; border-radius: 4px; text-align: left; }
                    .split-options div { margin-bottom: 10px; }
                    .split-options label { margin-right: 10px; }
                    #fl-split-level-container, #fl-split-chunk-size-container { display: none; }
                `;
                document.head.appendChild(style);
            },
            initMiniProgress: function() { // Added for mini progress
                if (this.miniProgressElement) return;
                this.miniProgressElement = document.createElement('div');
                this.miniProgressElement.className = 'fastlink-mini-progress';
                this.miniProgressElement.innerHTML = `
                    <div class="fastlink-mini-progress-title">
                        <span>⚙️ 处理中...</span>
                        <button class="fastlink-mini-progress-restore-btn">恢复</button>
                    </div>
                    <div class="fastlink-mini-progress-bar-container"><div class="fastlink-mini-progress-bar" style="width: 0%;"></div></div>
                    <div class="fastlink-mini-progress-file">准备中...</div>
                    <div class="fastlink-mini-progress-status">0/0</div>
                `;
                document.body.appendChild(this.miniProgressElement);
                this.miniProgressElement.querySelector('.fastlink-mini-progress-restore-btn').addEventListener('click', () => {
                    this.hideMiniProgress();
                    if (this.modalElement && this.activeModalOperationType === 'progress_stoppable') {
                        this.modalElement.style.display = 'flex';
                    }
                });
            },
            showMiniProgress: function() { // Added for mini progress
                if (this.miniProgressElement) {
                    this.miniProgressElement.style.display = 'flex';
                    this.isMiniProgressActive = true;
                }
            },
            hideMiniProgress: function() { // Added for mini progress
                if (this.miniProgressElement) {
                    this.miniProgressElement.style.display = 'none';
                    this.isMiniProgressActive = false;
                }
            },
            // 添加独立的进度页面元素
            progressPageElement: null,

            // 显示独立的秒传链接生成进度页面
            showGenerateProgressPage: function() {
                // 如果已经存在则先移除
                if (this.progressPageElement) {
                    this.hideGenerateProgressPage();
                }

                // 创建进度页面元素
                this.progressPageElement = document.createElement('div');
                this.progressPageElement.className = 'fastlink-progress-page';
                this.progressPageElement.innerHTML = `
                    <div class="fastlink-progress-page-content">
                        <div class="fastlink-progress-page-header">
                            <h2>🔗 妙传链接生成中</h2>
                            <button id="fl-p-close-btn" class="fastlink-progress-page-close-btn">×</button>
                        </div>
                        <div class="fastlink-progress-container"><div class="fastlink-progress-bar" style="width: 0%"></div></div>
                        <div class="fastlink-status-container">
                            <div class="fastlink-info-status">
                                <p>🔍 正在分析项目...</p>
                                <div class="fastlink-info-messages"></div>
                            </div>
                            <div class="fastlink-error-status">
                                <div class="fastlink-error-messages"></div>
                            </div>
                            <p class="extra-status-message" style="color: #ff7f50; display: none;"></p>
                        </div>
                        <div class="fastlink-stats"><span class="success-count">✅ 成功：0</span><span class="failed-count">❌ 失败：0</span></div>
                        <div class="fastlink-current-file"><p class="file-name">准备开始...</p></div>
                        <div class="fastlink-progress-page-buttons fastlink-modal-buttons">
                            <button id="${processStateManager.getStopButtonId()}_page" class="stop-btn">🛑 停止</button>
                            <button id="${processStateManager.getPauseButtonId()}_page" class="pause-btn" style="margin-left: 5px;">⏸️ 暂停</button>
                            <button id="fl-p-minimize" class="minimize-btn" style="margin-left: 5px;">最小化</button>
                        </div>
                    </div>
                `;

                document.body.appendChild(this.progressPageElement);

                // 添加事件监听
                const closeBtn = this.progressPageElement.querySelector('#fl-p-close-btn');
                if (closeBtn) {
                    closeBtn.onclick = () => {
                        // 检查是否处于最小化状态
                        if (this.progressPageElement.style.width === '300px' && this.progressPageElement.style.height === '80px') {
                            // 处于最小化状态，执行恢复操作
                            // 恢复原始样式
                            this.progressPageElement.style.width = '480px';
                            this.progressPageElement.style.height = 'auto';
                            this.progressPageElement.style.top = '50%';
                            this.progressPageElement.style.left = '50%';
                            this.progressPageElement.style.bottom = 'auto';
                            this.progressPageElement.style.right = 'auto';
                            this.progressPageElement.style.transform = 'translate(-50%, -50%)';
                            this.progressPageElement.style.overflow = 'auto';

                            // 恢复内容样式
                            const content = this.progressPageElement.querySelector('.fastlink-progress-page-content');
                            if (content) {
                                content.style.padding = '20px';
                            }

                            const header = this.progressPageElement.querySelector('.fastlink-progress-page-header h2');
                            if (header) {
                                header.style.fontSize = '18px';
                            }

                            // 显示所有元素
                            const statusContainer = this.progressPageElement.querySelector('.fastlink-status-container');
                            const stats = this.progressPageElement.querySelector('.fastlink-stats');
                            const currentFile = this.progressPageElement.querySelector('.fastlink-current-file');
                            const buttonsContainer = this.progressPageElement.querySelector('.fastlink-progress-page-buttons');

                            if (statusContainer) statusContainer.style.display = 'block';
                            if (stats) stats.style.display = 'block';
                            if (currentFile) currentFile.style.display = 'block';

                            // 恢复按钮
                            if (buttonsContainer) {
                                buttonsContainer.innerHTML = `
                                    <button id="${processStateManager.getStopButtonId()}_page" class="stop-btn">🛑 停止</button>
                                    <button id="${processStateManager.getPauseButtonId()}_page" class="pause-btn" style="margin-left: 5px;">⏸️ ${processStateManager.isPaused() ? '继续' : '暂停'}</button>
                                    <button id="fl-p-minimize" class="minimize-btn" style="margin-left: 5px;">最小化</button>
                                `;

                                // 重新绑定事件监听器
                                const stopBtn = this.progressPageElement.querySelector(`#${processStateManager.getStopButtonId()}_page`);
                                if (stopBtn) {
                                    stopBtn.onclick = () => {
                                        if (confirm("确定要停止当前操作吗？")) {
                                            processStateManager.requestStop();
                                            stopBtn.textContent = "正在停止...";
                                            stopBtn.disabled = true;
                                        }
                                    };
                                }

                                const pauseBtn = this.progressPageElement.querySelector(`#${processStateManager.getPauseButtonId()}_page`);
                                if (pauseBtn) {
                                    pauseBtn.onclick = () => {
                                        processStateManager.togglePause();
                                        pauseBtn.textContent = processStateManager.isPaused() ? "▶️ 继续" : "⏸️ 暂停";
                                    };
                                }

                                const minimizeBtn = this.progressPageElement.querySelector('#fl-p-minimize');
                                if (minimizeBtn) {
                                    minimizeBtn.onclick = minimizeProgressPage;
                                }
                            }
                        } else {
                            // 正常状态，执行关闭操作
                            if (confirm("确定要停止当前操作吗？")) {
                                processStateManager.requestStop();
                                this.hideGenerateProgressPage();
                            }
                        }
                    };
                }

                const stopBtn = this.progressPageElement.querySelector(`#${processStateManager.getStopButtonId()}_page`);
                if (stopBtn) {
                    stopBtn.onclick = () => {
                        if (confirm("确定要停止当前操作吗？")) {
                            processStateManager.requestStop();
                            stopBtn.textContent = "正在停止...";
                            stopBtn.disabled = true;
                        }
                    };
                }

                const pauseBtn = this.progressPageElement.querySelector(`#${processStateManager.getPauseButtonId()}_page`);
                if (pauseBtn) {
                    pauseBtn.onclick = () => {
                        processStateManager.togglePause();
                        pauseBtn.textContent = processStateManager.isPaused() ? "▶️ 继续" : "⏸️ 暂停";
                    };
                }

                // 最小化处理函数
                const minimizeProgressPage = () => {
                    // 将进度页面最小化到右下角
                    this.progressPageElement.style.width = '300px';
                    this.progressPageElement.style.height = '80px';
                    this.progressPageElement.style.top = 'auto';
                    this.progressPageElement.style.left = 'auto';
                    this.progressPageElement.style.bottom = '10px';
                    this.progressPageElement.style.right = '10px';
                    this.progressPageElement.style.transform = 'none';
                    this.progressPageElement.style.overflow = 'hidden';

                    // 隐藏不必要的元素
                    const content = this.progressPageElement.querySelector('.fastlink-progress-page-content');
                    if (content) {
                        content.style.padding = '10px';
                    }

                    const header = this.progressPageElement.querySelector('.fastlink-progress-page-header h2');
                    if (header) {
                        header.style.fontSize = '14px';
                    }

                    // 隐藏详细信息，只显示进度条和最小化状态
                    const statusContainer = this.progressPageElement.querySelector('.fastlink-status-container');
                    const stats = this.progressPageElement.querySelector('.fastlink-stats');
                    const currentFile = this.progressPageElement.querySelector('.fastlink-current-file');
                    const buttonsContainer = this.progressPageElement.querySelector('.fastlink-progress-page-buttons');

                    if (statusContainer) statusContainer.style.display = 'none';
                    if (stats) stats.style.display = 'none';
                    if (currentFile) currentFile.style.display = 'none';
                    if (buttonsContainer) {
                        // 最小化时只保留最小化按钮
                        buttonsContainer.style.display = 'flex';
                        buttonsContainer.innerHTML = `<button id="fl-p-minimize" class="minimize-btn" style="width: 100%;">最小化</button>`;

                        // 重新绑定最小化事件
                        const minimizeBtn = this.progressPageElement.querySelector('#fl-p-minimize');
                        if (minimizeBtn) {
                            minimizeBtn.onclick = minimizeProgressPage;
                        }
                    }
                };

                // 最小化按钮事件监听
                const minimizeBtn = this.progressPageElement.querySelector('#fl-p-minimize');
                if (minimizeBtn) {
                    minimizeBtn.onclick = minimizeProgressPage;
                }
            },

            // 隐藏独立的进度页面
            hideGenerateProgressPage: function() {
                if (this.progressPageElement) {
                    this.progressPageElement.remove();
                    this.progressPageElement = null;
                }
            },

            // 更新独立进度页面的进度
            updateGenerateProgress: function(progressUpdate) {
                if (!this.progressPageElement) return;

                const { processed, total, successCount, failureCount, currentFile, extraStatus } = progressUpdate;

                // 更新进度条
                const progressBar = this.progressPageElement.querySelector('.fastlink-progress-bar');
                if (progressBar && total > 0) {
                    progressBar.style.width = `${(processed / total) * 100}%`;
                }

                // 更新统计信息
                const successCountEl = this.progressPageElement.querySelector('.success-count');
                const failedCountEl = this.progressPageElement.querySelector('.failed-count');
                if (successCountEl) successCountEl.textContent = `✅ 成功：${successCount}`;
                if (failedCountEl) failedCountEl.textContent = `❌ 失败：${failureCount}`;

                // 更新当前文件
                const fileNameEl = this.progressPageElement.querySelector('.file-name');
                if (fileNameEl) fileNameEl.textContent = currentFile;

                // 更新额外状态
                const extraStatusEl = this.progressPageElement.querySelector('.extra-status-message');
                if (extraStatusEl) {
                    if (extraStatus) {
                        extraStatusEl.textContent = extraStatus;
                        extraStatusEl.style.display = 'block';
                    } else {
                        extraStatusEl.style.display = 'none';
                    }
                }
            },

            createDropdownButton: function() {
                const existingButtons = document.querySelectorAll('.fastlink-main-button-container');
                existingButtons.forEach(btn => btn.remove());
                const targetElement = document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA);
                if (targetElement && targetElement.parentNode) {
                    const buttonContainer = document.createElement('div');
                    buttonContainer.className = 'fastlink-main-button-container ant-dropdown-trigger sysdiv parmiryButton';
                    buttonContainer.style.border = '0.5px solid rgb(218, 218, 218)';
                    buttonContainer.style.cursor = 'pointer';
                    buttonContainer.style.marginLeft = '20px';
                    buttonContainer.style.position = 'relative';
                    buttonContainer.style.padding = '0px 0px';
                    buttonContainer.style.width = '90px';
                    buttonContainer.style.height = '40px';
                    buttonContainer.style.minWidth = '90px';
                    buttonContainer.style.maxWidth = '90px';
                    buttonContainer.style.minHeight = '40px';
                    buttonContainer.style.maxHeight = '40px';
                    buttonContainer.style.borderRadius = '8px';
                    buttonContainer.style.transition = 'all 0.3s ease';
                    buttonContainer.style.userSelect = 'none';
buttonContainer.style.WebkitUserSelect = 'none'; // Safari 兼容
buttonContainer.style.MozUserSelect = 'none'; // Firefox 兼容
                    // 设置初始样式
buttonContainer.style.backgroundColor = '#ffffff';
buttonContainer.style.transition = 'all 0.3s ease';
                    buttonContainer.style.color = '#000000';
                    buttonContainer.style.backgroundColor = '#ffffff';
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.alignItems = 'center';
                    buttonContainer.innerHTML = `<span role="img" aria-label="menu" class="anticon anticon-menu" style="margin-right: 8px;"><svg viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M120 300h720v60H120zm0 180h720v60H120zm0 180h720v60H120z"></path></svg></span> <span style="font-size: 14px; font-weight: 500;">秒传</span>`;
                    const dropdownMenu = document.createElement('div');
                    dropdownMenu.id = 'fastlink-dropdown-menu-container';
                    dropdownMenu.style.display = 'none';
                    dropdownMenu.style.position = 'absolute';
                    dropdownMenu.style.top = 'calc(100% + 5px)';
                    dropdownMenu.style.right = '0';
                    dropdownMenu.style.zIndex = '10000';
                    dropdownMenu.style.minWidth = '220px';
                    dropdownMenu.style.whiteSpace = 'nowrap';
                    dropdownMenu.style.backgroundColor = 'white';
                    dropdownMenu.style.borderRadius = '20px';
                    dropdownMenu.style.boxShadow = '0 2px 8px rgba(255, 255, 255, 0.15)';
                    dropdownMenu.innerHTML = `
                        <ul class="ant-dropdown-menu ant-dropdown-menu-root ant-dropdown-menu-vertical ant-dropdown-menu-light" role="menu" tabindex="0" data-menu-list="true" style="border-radius: 20px; padding: 4px 0; margin: 0; list-style: none;">
                            <li id="fastlink-generateShare" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.3s ease; color: #333; font-size: 14px; display: flex; align-items: center;border-radius: 12px;border-bottom: 2px solid #eee;border-right: 1px solid #eee;margin-bottom: 4px;border-top: 1px solid #eee;">
                                <span style="margin-right: 8px;">🔗</span> 生成链接 (选中项)
                            </li>
                            <li id="fastlink-receiveDirect" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.3s ease; color: #333; font-size: 14px; display: flex; align-items: center;border-radius: 12px;border-bottom: 2px solid #eee;border-right: 1px solid #eee;margin-bottom: 4px;border-top: 1px solid #eee;">
                                <span style="margin-right: 8px;">📥</span> 链接/文件转存
                            </li>
                            <li id="fastlink-splitJsonFile" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.3s ease; color: #333; font-size: 14px; display: flex; align-items: center;border-radius: 12px;border-bottom: 2px solid #eee;border-right: 1px solid #eee;margin-bottom: 4px;border-top: 1px solid #eee;">
                                <span style="margin-right: 8px;">✂️</span> 拆分JSON文件
                            </li>
                            <li id="fastlink-settings" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 8px 16px; cursor: pointer; transition: background-color 0.3s ease; color: #333; font-size: 14px; display: flex; align-items: center;border-radius: 12px;border-bottom: 2px solid #eee;border-right: 1px solid #eee;margin-bottom: 4px;border-top: 1px solid #eee;">
                                <span style="margin-right: 8px;">⚙️</span> 设置
                            </li>
                        </ul>`;
                    this.dropdownMenuElement = dropdownMenu;
                    buttonContainer.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none'; });
                    document.addEventListener('click', (e) => {
                        // 检查点击是否发生在文件选择区域，如果是则不关闭菜单
                        const isFileSelection = e.target.closest(DOM_SELECTORS.FILE_ROW_SELECTOR) ||
                                               e.target.closest(DOM_SELECTORS.FILE_CHECKBOX_SELECTOR) ||
                                               e.target.matches(DOM_SELECTORS.FILE_CHECKBOX_SELECTOR);

                        if (this.dropdownMenuElement &&
                            !buttonContainer.contains(e.target) &&
                            !this.dropdownMenuElement.contains(e.target) &&
                            !isFileSelection) {
                            if (this.dropdownMenuElement.style.display !== 'none')
                                this.dropdownMenuElement.style.display = 'none';
                        }
                    });
                    dropdownMenu.querySelector('#fastlink-generateShare').addEventListener('click', async (e) => {
                        e.stopPropagation();
                        dropdownMenu.style.display = 'none';
                        if(typeof coreLogic!== 'undefined' && coreLogic.generateShareLink) {
                            // 先检查是否有选择文件
                            const selectedItemIds = coreLogic.getSelectedFileIds();
                            if (!selectedItemIds.length) {
                                uiManager.showAlert("请先勾选要分享的文件或文件夹。");
                                return;
                            }
                            // 调用生成链接函数，内部会自动显示独立进度页面
                            await coreLogic.generateShareLink(true);
                            // 不再自动隐藏进度页面，让用户可以查看结果和使用按钮
                        }
                    });
                    dropdownMenu.querySelector('#fastlink-receiveDirect').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("📥 文件转存/粘贴链接", "", 'inputLinkNew'); });
                    dropdownMenu.querySelector('#fastlink-splitJsonFile').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("✂️ 拆分JSON文件", "", 'splitJsonTool'); });
                    dropdownMenu.querySelector('#fastlink-settings').addEventListener('click', (e) => {
                        e.stopPropagation();
                        dropdownMenu.style.display = 'none';
                        this.showSettingsDialog();
                    });
                    // 添加悬停效果
                    buttonContainer.addEventListener('mouseenter', () => {
                        buttonContainer.style.backgroundColor = '#e6f7ff';
                        buttonContainer.style.borderColor = '#91d5ff';
                    });
                    buttonContainer.addEventListener('mouseleave', () => {
                        buttonContainer.style.backgroundColor = '#f5f5f5';
                        buttonContainer.style.borderColor = 'rgb(217, 217, 217)';
                    });
                    // 为菜单项添加悬停效果
                    const menuItems = dropdownMenu.querySelectorAll('.ant-dropdown-menu-item');
                    menuItems.forEach(item => {
                        item.addEventListener('mouseenter', () => {
                            item.style.backgroundColor = '#f5f5f5';
                        });
                        item.addEventListener('mouseleave', () => {
                            item.style.backgroundColor = 'white';
                        });
                    });
                    targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling);
                    buttonContainer.appendChild(dropdownMenu);
                    console.log(`[${SCRIPT_NAME}] 秒传按钮已添加。`);
                    return true;
                } else {
                    // 只在调试模式下显示警告，避免正常使用时产生过多日志
                    if (settingsManager.isDebugMode()) {
                        console.warn(`[${SCRIPT_NAME}] 目标按钮区域 '${DOM_SELECTORS.TARGET_BUTTON_AREA}' 未找到。`);
                    }
                    return false;
                }
            },
            showModal: function(title, content, type = 'info', closable = true, pureLinkForClipboard = null, jsonDataForExport = null, preprocessingFailuresForLog = null) {
                const isOperationalModal = (t) => ['progress_stoppable', 'inputLink', 'inputPublicShare', 'filterSettings', 'showLink', 'splitJsonTool', 'settings', 'generateShareNew', 'inputLinkNew'].includes(t);

                if (this.modalElement && this.activeModalOperationType && this.activeModalOperationType !== type && isOperationalModal(this.activeModalOperationType) && isOperationalModal(type) ) {
                    console.log(`[${SCRIPT_NAME}] Hiding active modal ('${this.activeModalOperationType}') for new modal ('${type}').`);
                    if (this.modalHideCallback) { this.modalHideCallback(); this.modalHideCallback = null; }
                    this.modalElement.style.display = 'none';
                } else if (this.modalElement && type !== 'info' && type !== 'error' && this.activeModalOperationType !== type) {
                    this.hideModal();
                }

                if (this.modalElement && this.modalElement.style.display === 'none' && this.activeModalOperationType === type && isOperationalModal(type)) {
                    this.modalElement.style.display = 'flex';
                    const titleEl = this.modalElement.querySelector('.fastlink-modal-title');
                    if (titleEl) titleEl.textContent = title;
                    // If it's a progress_stoppable modal being reshown, ensure buttons are in correct state
                    if (type === 'progress_stoppable') {
                        const stopBtnInstance = this.modalElement.querySelector(`#${processStateManager.getStopButtonId()}`);
                        const cancelBtnInstance = this.modalElement.querySelector('#fl-m-cancel.close-btn');
                        if (stopBtnInstance) {
                            stopBtnInstance.textContent = processStateManager.isStopRequested() ? "正在停止..." : "🛑 停止";
                            stopBtnInstance.disabled = processStateManager.isStopRequested();
                        }
                        if (cancelBtnInstance) {
                            cancelBtnInstance.textContent = processStateManager.isStopRequested() ? "关闭" : "隐藏";
                            cancelBtnInstance.disabled = !processStateManager.isStopRequested() && type === 'progress_stoppable' && !this.modalElement.querySelector(`#${processStateManager.getStopButtonId()}`)?.disabled ; // Disable hide if stop is active
                        }
                    }
                    return;
                } else if (this.modalElement && this.modalElement.style.display === 'none' && this.activeModalOperationType !== type) {
                    this.hideModal();
                }

                this.modalElement = document.createElement('div'); this.modalElement.className = 'fastlink-modal';
                if (type === 'filterSettings') this.modalElement.className += ' filter-dialog';

                let htmlContent = `<div class="fastlink-modal-title-container"><div class="fastlink-modal-title">${title}</div><button id="fl-m-close-btn" class="fastlink-modal-close-btn">×</button></div><div id="${this.MODAL_CONTENT_ID}" class="fastlink-modal-content">`;
                if (type === 'inputLinkNew') {
                    htmlContent += `<div class="new-modal-container">
                        <div id="fl-m-drop-area" class="fastlink-drag-drop-area">
                            <textarea id="fl-m-link-input" class="fastlink-modal-input" placeholder="  🔗 粘贴秒传链接       或 📂将文件拖放到此处.." >${content|| ''}</textarea>
                            <div id="fl-m-file-drop-status" style="font-size:0.9em; color:#28a745; margin-top:0px; margin-bottom:0px; min-height:1.2em;"></div>
                        </div>
                        <div class="fastlink-file-input-container" style="margin-top:10px;">
                            <label for="fl-m-file-input" class="fastlink-file-input-label">选择秒传文件</label>
                            <input type="file" id="fl-m-file-input" accept=".json,.123share" style="display: none;">
                        </div>
                        <div class="folder-selector-container"></div>
                    </div>`;
                } else if (type === 'generateShareNew') {
                    htmlContent += `<div class="new-modal-container">
                        <div class="generate-share-new-content">
                            <div class="info-section">
                                <h3>🔗 生成链接</h3>
                                <p>已选择的文件将被生成秒传链接，您可以选择不同的生成选项。</p>
                            </div>
                            <div class="options-section">
                                <div class="option-item">
                                    <label><input type="checkbox" id="fl-m-include-metadata" checked> 包含文件元数据</label>
                                </div>
                                <div class="option-item">
                                    <label><input type="checkbox" id="fl-m-compress-json"> 压缩JSON输出</label>
                                </div>
                                <div class="option-item">
                                    <label><input type="radio" name="fl-m-format" value="json" checked> JSON格式</label>
                                    <label style="margin-left: 15px;"><input type="radio" name="fl-m-format" value="123share"> 123share格式</label>
                                </div>
                            </div>
                            <div class="selected-files-section">
                                <h4>📁 已选择文件</h4>
                                <div id="fl-m-selected-files" style="max-height: 150px; overflow-y: auto; border: 1px solid #eee; padding: 10px; margin-top: 10px;">
                                    <p>正在获取选择的文件...</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                } else if (type === 'inputLink') { htmlContent += `<div id="fl-m-drop-area" class="fastlink-drag-drop-area"><textarea id="fl-m-link-input" class="fastlink-modal-input" placeholder="  🔗 粘贴秒传链接       或 📂将文件拖放到此处.." >${content|| ''}</textarea><div id="fl-m-file-drop-status" style="font-size:0.9em; color:#28a745; margin-top:0px; margin-bottom:0px; min-height:1.2em;"></div><div class="fastlink-file-input-container"><label for="fl-m-file-input" class="fastlink-file-input-label">选择秒传文件</label><input type="file" id="fl-m-file-input" accept=".json,.123share" style="display: none;"></div></div><div class="folder-selector-container"></div></div>`; }
                else if (type === 'inputPublicShare') { htmlContent += `<input type="text" id="fl-m-public-share-key" class="fastlink-modal-input" placeholder="🔑 分享Key 或 完整分享链接"><input type="text" id="fl-m-public-share-pwd" class="fastlink-modal-input" placeholder="🔒 提取码 (如有)"><input type="text" id="fl-m-public-share-fid" class="fastlink-modal-input" value="0" placeholder="📁 起始文件夹ID (默认0为根目录)">`; }
                else if (type === 'inputPublicShareBatch') { htmlContent += `<textarea id="fl-m-public-share-batch-input" class="fastlink-modal-textarea" placeholder="🔗 请输入多个分享链接，每行一个&#10;支持格式：&#10;1. 完整分享链接 (如 https://www.123pan.com/s/xxx)&#10;2. 分享Key (如 xxx)&#10;3. 带提取码的链接 (如 https://www.123pan.com/s/xxx?pwd=yyy)&#10;4. 带提取码的文本 (如 xxx 提取码:yyy)"></textarea>`; }
                else if (type === 'filterSettings') { htmlContent += filterManager.buildFilterModalContent(); }
                else if (type === 'splitJsonTool') {
                    htmlContent += `
                        <div id="fl-split-drop-area" class="fastlink-drag-drop-area" style="padding: 10px; margin-bottom: 15px;">
                            <p>拖拽一个 .json 文件到此处</p>
                            <p style="font-size: 0.9em; color: #999;">或</p>
                            <input type="file" id="fl-split-file-input" accept=".json" style="display: none;">
                            <button id="fl-split-browse-btn" class="filter-btn">点击选择文件</button>
                            <p id="fl-split-file-status" style="font-size:0.9em; color:#28a745; margin-top:10px; min-height:1.2em;"></p>
                        </div>
                        <div class="split-options">
                            <strong>选择拆分模式:</strong>
                            <div>
                                <label><input type="radio" name="split-method" value="byFolder" checked> 按目录层级拆分</label>
                                <span id="fl-split-level-container">
                                    <label>层数: <input type="number" id="fl-split-level" class="fastlink-modal-input" value="1" min="1" style="width: 60px; display: inline-block; margin-left: 5px; min-height: auto; height: 30px; padding: 4px 8px;"></label>
                                </span>
                            </div>
                            <div>
                                <label><input type="radio" name="split-method" value="byCount"> 按文件数量拆分</label>
                                <span id="fl-split-chunk-size-container">
                                    <input type="number" id="fl-split-chunk-size" class="fastlink-modal-input" value="500" min="1" style="width: 80px; display: inline-block; margin-left: 10px; min-height: auto; height: 30px; padding: 4px 8px;">
                                    <span>个文件/份</span>
                                </span>
                            </div>
                        </div>
                    `;
                }
                else htmlContent += content;
                htmlContent += `</div><div class="fastlink-modal-buttons">`;
                if (type === 'inputLinkNew') { htmlContent += `<button id="fl-m-confirm" class="confirm-btn">➡️ 转存</button>`; }
                else if (type === 'generateShareNew') { htmlContent += `<button id="fl-m-generate" class="confirm-btn">✨ 生成链接</button>`; }
                else if (type === 'inputLink') { htmlContent += `<button id="fl-m-confirm" class="confirm-btn">➡️ 转存</button>`; }
                else if (type === 'inputPublicShare') { htmlContent += `<button id="fl-m-generate-public" class="confirm-btn">✨ 生成</button>`; }
                else if (type === 'inputPublicShareBatch') { htmlContent += `<button id="fl-m-generate-public-batch" class="confirm-btn">✨ 批量生成</button>`; }
                else if (type === 'filterSettings') { htmlContent += `<button id="fl-m-save-filters" class="confirm-btn">💾 保存设置</button>`; }
                else if (type === 'showLink') {
                    if (pureLinkForClipboard || jsonDataForExport) {
                        htmlContent += `<button id="fl-m-copy" class="copy-btn">📋 复制</button>`;
                        if (jsonDataForExport) {
                            htmlContent += `<button id="fl-m-export-json" class="export-btn">📄 导出</button>`;
                            if (jsonDataForExport.totalFilesCount > 1) {
                            htmlContent += `<button id="fl-m-export-split-json" class="export-btn" style="background-color: #ff5722;" title="将包含多个文件的JSON拆分成数个小文件下载">📄 拆分</button>`;
                            }
                        }
                    }
                }
                else if (type === 'progress_stoppable') { htmlContent += `<button id="${processStateManager.getStopButtonId()}" class="stop-btn">🛑 停止</button><button id="${processStateManager.getPauseButtonId()}" class="pause-btn" style="margin-left: 5px;">⏸️ 暂停</button><button id="fl-m-minimize" class="minimize-btn" style="margin-left: 5px;">最小化</button>`; }
                else if (type === 'info_with_buttons' && preprocessingFailuresForLog && preprocessingFailuresForLog.length > 0) { htmlContent += `<button id="fl-m-copy-preprocessing-log" class="copy-btn">📋 复制日志</button>`; }
                else if (type === 'splitJsonTool') {
                    htmlContent += `<button id="fl-split-start-btn" class="confirm-btn">🚀 拆分</button>`;
                }
                else { htmlContent += `<button id="fl-m-cancel" class="close-btn">关闭</button>`; }
                htmlContent += `</div>`;
                this.modalElement.innerHTML = htmlContent; document.body.appendChild(this.modalElement);

                if (isOperationalModal(type)) this.activeModalOperationType = type; else this.activeModalOperationType = null;

                // 记录顶部来源/侧边来源偏好布局
                if (type === 'inputLinkNew' || type === 'generateShareNew') {
                    this.preferredCenteredLayout = true;
                } else if (type === 'inputLink') {
                    this.preferredCenteredLayout = false;
                }

                const confirmBtn = this.modalElement.querySelector('#fl-m-confirm');
                if(confirmBtn) {
                        confirmBtn.onclick = async () => {
                            const linkInputEl = this.modalElement.querySelector(`#fl-m-link-input`);
                            const fileInputEl = this.modalElement.querySelector(`#fl-m-file-input`);
                            const folderSelectorEl = this.modalElement.querySelector(`#fl-folder-selector`);
                            const startIndexEl = this.modalElement.querySelector(`#fl-start-index`);
                            const endIndexEl = this.modalElement.querySelector(`#fl-end-index`);
                            const dropArea = this.modalElement.querySelector('#fl-m-drop-area');
                            let link = linkInputEl ? linkInputEl.value.trim() : null;
                            let file = fileInputEl && fileInputEl.files && fileInputEl.files.length > 0 ? fileInputEl.files[0] : null;
                            let targetFolderPath = folderSelectorEl ? folderSelectorEl.value.trim() : "";
                            let startIndex = startIndexEl && startIndexEl.value.trim() ? parseInt(startIndexEl.value) : null;
                            let endIndex = endIndexEl && endIndexEl.value.trim() ? parseInt(endIndexEl.value) : null;

                            // Validate range if provided
                            if (startIndex !== null && startIndex <1) {
                                this.showAlert("起始序号必须大于等于1");
                                return;
                            }
                            if (endIndex !== null && endIndex < 1) {
                                this.showAlert("结束序号必须大于等于1");
                                return;
                            }
                            if (startIndex !== null && endIndex !== null && endIndex < startIndex) {
                                this.showAlert("结束序号必须大于等于起始序号");
                                return;
                            }

                            confirmBtn.disabled = true;
                            this.modalElement.querySelector('#fl-m-cancel')?.setAttribute('disabled', 'true');

                            try {
                                if (dropArea && dropArea.dataset.fileContent) {
                                    // Process dropped file
                                    let jsonData;
                                    if (dropArea.dataset.fileType === '.123share') {
                                        jsonData = convert123ShareToJson(dropArea.dataset.fileContent);
                                    } else {
                                        jsonData = JSON.parse(dropArea.dataset.fileContent);
                                    }
                                    await coreLogic.transferImportedJsonData(jsonData, targetFolderPath, startIndex, endIndex);
                                    //this.closeModal();
                                } else if (file) {
                                    // Process selected file
                                    processStateManager.appendInfoMessage(`ℹ️ 从文件 "${file.name}" 导入...`);
                                    const fileContent = await file.text();
                                    const jsonData = JSON.parse(fileContent);
                                    await coreLogic.transferImportedJsonData(jsonData, targetFolderPath, startIndex, endIndex);
                                } else if (link) {
                                    await coreLogic.transferFromShareLink(link, targetFolderPath, startIndex, endIndex);
                                } else {
                                    this.showAlert("请输入链接或选择/拖放文件");
                                }
                            } catch (e) {
                                console.error(`[${SCRIPT_NAME}] 处理失败:`, e);
                                processStateManager.appendErrorMessage(`❌ 处理失败: ${e.message}`);
                                uiManager.showError(`处理失败: ${e.message}`);
                            } finally {
                                if(this.modalElement && confirmBtn) {
                                    confirmBtn.disabled = false;
                                    this.modalElement.querySelector('#fl-m-cancel')?.removeAttribute('disabled');
                                }
                            }
                        };
                    }

                // 处理生成链接新页面的事件
                const generateBtn = this.modalElement.querySelector('#fl-m-generate');
                if(generateBtn) {
                    generateBtn.onclick = async () => {
                        const includeMetadata = this.modalElement.querySelector('#fl-m-include-metadata')?.checked || false;
                        const compressJson = this.modalElement.querySelector('#fl-m-compress-json')?.checked || false;
                        const format = this.modalElement.querySelector('input[name="fl-m-format"]:checked')?.value || 'json';

                        generateBtn.disabled = true;
                        this.modalElement.querySelector('#fl-m-cancel')?.setAttribute('disabled', 'true');

                        try {
                            // 调用生成链接的核心逻辑，传入新的选项
                            await coreLogic.generateShareLink({
                                includeMetadata: includeMetadata,
                                compress: compressJson,
                                format: format
                            });
                        } catch (e) {
                            console.error(`[${SCRIPT_NAME}] 生成链接失败:`, e);
                            processStateManager.appendErrorMessage(`❌ 生成链接失败: ${e.message}`);
                            uiManager.showError(`生成链接失败: ${e.message}`);
                        } finally {
                            if(this.modalElement && generateBtn) {
                                generateBtn.disabled = false;
                                this.modalElement.querySelector('#fl-m-cancel')?.removeAttribute('disabled');
                            }
                        }
                    };

                    // 初始化时获取选择的文件
                    setTimeout(() => {
                        const selectedFilesEl = this.modalElement.querySelector('#fl-m-selected-files');
                        if(selectedFilesEl) {
                            // 这里可以根据实际情况获取选择的文件
                            selectedFilesEl.innerHTML = `<p>正在获取选择的文件...</p>`;

                            // 模拟获取选择的文件
                            setTimeout(() => {
                                selectedFilesEl.innerHTML = `<p>已选择 <strong>0</strong> 个文件</p>
                                                           <p>请在页面中选择文件后点击生成链接按钮</p>`;
                            }, 500);
                        }
                    }, 100);
                }
                const saveFiltersBtn = this.modalElement.querySelector('#fl-m-save-filters'); if(saveFiltersBtn){ saveFiltersBtn.onclick = () => { if(filterManager.saveSettings()){ this.showAlert("✅ 过滤器设置已保存！", 1500); this.hideModal(); } else { this.showError("❌ 保存过滤器设置失败！"); } }; }
                if(type === 'filterSettings'){ filterManager.attachFilterEvents(); }

                if (type === 'splitJsonTool') {
                    const dropArea = this.modalElement.querySelector('#fl-split-drop-area');
                    const fileInput = this.modalElement.querySelector('#fl-split-file-input');
                    const browseBtn = this.modalElement.querySelector('#fl-split-browse-btn');
                    const statusDiv = this.modalElement.querySelector('#fl-split-file-status');
                    const startBtn = this.modalElement.querySelector('#fl-split-start-btn');
                    const levelContainer = this.modalElement.querySelector('#fl-split-level-container');
                    const chunkSizeContainer = this.modalElement.querySelector('#fl-split-chunk-size-container');
                    const radioButtons = this.modalElement.querySelectorAll('input[name="split-method"]');

                    let fileContent = null;
                    let originalFileName = '';

                    browseBtn.onclick = () => fileInput.click();
                    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
                        dropArea.addEventListener(eventName, e => { e.preventDefault(); e.stopPropagation(); });
                    });
                    ['dragenter', 'dragover'].forEach(eventName => {
                        dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over-active'));
                    });
                    ['dragleave', 'drop'].forEach(eventName => {
                        dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over-active'));
                    });

                    const handleFile = (file) => {
                        if (file && file.name.endsWith('.json')) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                                fileContent = e.target.result;
                                originalFileName = file.name;
                                statusDiv.textContent = `已加载文件: ${file.name}`;
                            };
                            reader.readAsText(file, 'UTF-8');
                        } else {
                            this.showError("请选择一个有效的 .json 文件。");
                            fileContent = null;
                            originalFileName = '';
                            statusDiv.textContent = '';
                        }
                    };

                    dropArea.addEventListener('drop', e => handleFile(e.dataTransfer.files[0]));
                    fileInput.addEventListener('change', e => handleFile(e.target.files[0]));

                    const toggleInputs = () => {
                        const selectedMethod = this.modalElement.querySelector('input[name="split-method"]:checked').value;
                        levelContainer.style.display = (selectedMethod === 'byFolder') ? 'inline' : 'none';
                        chunkSizeContainer.style.display = (selectedMethod === 'byCount') ? 'inline' : 'none';
                    };

                    radioButtons.forEach(radio => radio.onchange = toggleInputs);
                    toggleInputs();

                    startBtn.onclick = () => {
                        if (!fileContent) {
                            this.showError("请先加载一个JSON文件。");
                            return;
                        }
                        const method = this.modalElement.querySelector('input[name="split-method"]:checked').value;
                        const config = {};
                        if (method === 'byFolder') {
                            config.level = parseInt(this.modalElement.querySelector('#fl-split-level').value, 10);
                        } else {
                            config.chunkSize = parseInt(this.modalElement.querySelector('#fl-split-chunk-size').value, 10);
                        }
                        coreLogic.splitImportedJsonFile(fileContent, originalFileName, method, config);
                    };
                }

                if (type === 'inputLink' || type === 'inputLinkNew') { const dropArea = this.modalElement.querySelector('#fl-m-drop-area'); const fileInputEl = this.modalElement.querySelector(`#fl-m-file-input`); const linkInputEl = this.modalElement.querySelector('#fl-m-link-input'); const statusDiv = this.modalElement.querySelector('#fl-m-file-drop-status'); if (dropArea && fileInputEl && linkInputEl && statusDiv) { linkInputEl.addEventListener('input', () => { if (linkInputEl.value.trim() !== '') { if (fileInputEl.files && fileInputEl.files.length > 0) fileInputEl.value = ''; statusDiv.textContent = ''; } });
    linkInputEl.addEventListener('paste', async (event) => {
        event.preventDefault(); // 防止粘贴内容重复
        const pastedData = (event.clipboardData || window.clipboardData).getData('text');
        if (!pastedData) return;

        let jsonData;
        let successfullyParsed = false;
        let finalPastedJsonString = pastedData;
        let isAlternativeFormat = false;

        // 不再截断内容，直接显示完整内容
        linkInputEl.value = pastedData;

        // Attempt 1: Try to parse as-is (complete JSON object/array)
        try {
            jsonData = JSON.parse(pastedData);
            // Check for alternative format first
            const convertedData = convertAlternativeJsonFormat(jsonData);
            if (convertedData) {
                jsonData = convertedData;
                finalPastedJsonString = JSON.stringify(convertedData, null, 2);
                successfullyParsed = true;
                isAlternativeFormat = true;
            } else if (typeof jsonData === 'object' && jsonData !== null) {
                if (Array.isArray(jsonData.files) || Array.isArray(jsonData)) {
                    successfullyParsed = true;
                    // If it's just an array of files, wrap it for consistency with expected structure
                    if (Array.isArray(jsonData) && !jsonData.every(item => typeof item === 'object' && item.path && item.size && item.etag)) {
                        // If it's an array but not of file objects, it's not what we want for snippet processing
                        successfullyParsed = false;
                    } else if (Array.isArray(jsonData)) {
                        jsonData = { files: jsonData }; // Wrap the array
                        finalPastedJsonString = JSON.stringify(jsonData); // Re-stringify the wrapped version
                    }
                }
            }
        } catch (e) { /* ignore, try next */ }

        // Attempt 2: Try to parse as a snippet (array of objects) by wrapping it
        if (!successfullyParsed) {
            try {
                const wrappedPastedData = `[${pastedData}]`;
                const tempJsonData = JSON.parse(wrappedPastedData);
                // Check for alternative format in wrapped data
                const convertedData = convertAlternativeJsonFormat(tempJsonData);
                if (convertedData) {
                    jsonData = convertedData;
                    finalPastedJsonString = JSON.stringify(convertedData, null, 2);
                    successfullyParsed = true;
                    isAlternativeFormat = true;
                } else if (Array.isArray(tempJsonData) && tempJsonData.every(item => typeof item === 'object' && item.path && item.size && item.etag)) {
                    jsonData = { files: tempJsonData };
                    finalPastedJsonString = JSON.stringify(jsonData);
                    successfullyParsed = true;
                }
            } catch (e) { /* ignore, try next */ }
        }

        // Attempt 3: Try to parse as a snippet with a trailing comma
        if (!successfullyParsed && pastedData.trim().endsWith(',')) {
            try {
                const trimmedPastedData = pastedData.trim().slice(0, -1);
                const wrappedPastedData = `[${trimmedPastedData}]`;
                const tempJsonData = JSON.parse(wrappedPastedData);
                // Check for alternative format in wrapped data
                const convertedData = convertAlternativeJsonFormat(tempJsonData);
                if (convertedData) {
                    jsonData = convertedData;
                    finalPastedJsonString = JSON.stringify(convertedData, null, 2);
                    successfullyParsed = true;
                    isAlternativeFormat = true;
                } else if (Array.isArray(tempJsonData) && tempJsonData.every(item => typeof item === 'object' && item.path && item.size && item.etag)) {
                    jsonData = { files: tempJsonData };
                    finalPastedJsonString = JSON.stringify(jsonData);
                    successfullyParsed = true;
                }
            } catch (e) { /* ignore */ }
        }

        if (successfullyParsed && jsonData && Array.isArray(jsonData.files) && jsonData.files.length > 0) {
            event.preventDefault(); // Prevent default paste behavior
            const jsonFile = new File([finalPastedJsonString], "pasted_snippet.json", { type: "application/json" });
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(jsonFile);
            fileInputEl.files = dataTransfer.files;
            statusDiv.textContent = isAlternativeFormat ?
                `已粘贴并转换JSON片段为标准格式 (pasted_snippet.json)。请点击下方"转存"按钮。` :
                `已粘贴JSON片段并处理为 (pasted_snippet.json)。请点击下方"转存"按钮。`;
        } else {
            // If not successfully parsed as a file list or snippet, let it paste normally
            console.log("[FastLink] Pasted data was not recognized as a valid JSON file list or snippet.");
        }
    });
    fileInputEl.addEventListener('change', async () => {
        if (fileInputEl.files && fileInputEl.files.length > 0) {
            const file = fileInputEl.files[0];
            try {
                const reader = new FileReader();
                reader.onload = (event) => {
                    let content = event.target.result;
                    let jsonData;
                    let isAlternativeFormat = false;

                    try {
                        jsonData = JSON.parse(content);
                        const convertedData = convertAlternativeJsonFormat(jsonData);
                        if (convertedData) {
                            jsonData = convertedData;
                            content = JSON.stringify(convertedData, null, 2);
                            isAlternativeFormat = true;
                        }
                    } catch (e) {
                        // If parsing fails, use original content
                        console.log("[FastLink] File content parsing failed:", e);
                    }

                    // Store the processed content for processing
                    dropArea.dataset.fileContent = content;
                    dropArea.dataset.fileType = file.name.endsWith('.123share') ? '.123share' : '.json';

                    // 不再截断内容，直接显示完整内容
                    statusDiv.textContent = `已选择文件: ${file.name}${isAlternativeFormat ? ' (已转换为标准格式)' : ''}。请点击下方"转存"按钮。`;
                    linkInputEl.value = content;
                };
                reader.readAsText(file);
            } catch (err) {
                console.error("Error processing file:", err);
                this.showAlert("处理文件时发生错误。");
            }
        } else {
            statusDiv.textContent = '';
        }
    });
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false)); ['dragenter', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over-active'), false)); ['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over-active'), false)); dropArea.addEventListener('drop', (e) => {
                        const dt = e.dataTransfer;
                        if (dt && dt.files && dt.files.length > 0) {
                            const droppedFile = dt.files[0];
                            if (droppedFile.name.endsWith('.json') || droppedFile.name.endsWith('.123share') || droppedFile.type === 'application/json') {
                                try {
                                    const reader = new FileReader();
                                    reader.onload = (event) => {
                                        let content = event.target.result;
                                        let jsonData;
                                        let isAlternativeFormat = false;

                                        try {
                                            jsonData = JSON.parse(content);
                                            const convertedData = convertAlternativeJsonFormat(jsonData);
                                            if (convertedData) {
                                                jsonData = convertedData;
                                                content = JSON.stringify(convertedData, null, 2);
                                                isAlternativeFormat = true;
                                            }
                                        } catch (e) {
                                            // If parsing fails, use original content
                                            console.log("[FastLink] File content parsing failed:", e);
                                        }

                                        // Store the processed content for processing
                                        dropArea.dataset.fileContent = content;
                                        dropArea.dataset.fileType = droppedFile.name.endsWith('.123share') ? '.123share' : '.json';

                                        // 不再截断内容，直接显示完整内容
                                        statusDiv.textContent = `已选择文件: ${droppedFile.name}${isAlternativeFormat ? ' (已转换为标准格式)' : ''}。请点击下方"转存"按钮。`;
                                        linkInputEl.value = content;
                                    };
                                    reader.readAsText(droppedFile);
                                } catch (err) {
                                    console.error("Error processing file:", err);
                                    this.showAlert("处理文件时发生错误。");
                                }
                            } else {
                                this.showAlert("请拖放 .json 或 .123share 文件。");
                            }
                        }
                    }, false); } const folderSelector = this.modalElement.querySelector('#fl-folder-selector'); const folderDropdown = this.modalElement.querySelector('#fl-folder-dropdown'); if (folderSelector && folderDropdown) { folderSelector.addEventListener('click', function() { folderDropdown.classList.toggle('active'); }); folderSelector.addEventListener('blur', function() { setTimeout(() => { folderDropdown.classList.remove('active'); }, 200); }); /* Other folder selector events... */ } }
                const generatePublicBtn = this.modalElement.querySelector('#fl-m-generate-public'); if(generatePublicBtn){ generatePublicBtn.onclick = async () => { const shareKeyEl = this.modalElement.querySelector('#fl-m-public-share-key'); const sharePwdEl = this.modalElement.querySelector('#fl-m-public-share-pwd'); const shareFidEl = this.modalElement.querySelector('#fl-m-public-share-fid'); const rawShareKeyInput = shareKeyEl ? shareKeyEl.value.trim() : null; let sharePwd = sharePwdEl ? sharePwdEl.value.trim() : null; const shareFid = shareFidEl ? shareFidEl.value.trim() : "0"; let finalShareKey = rawShareKeyInput; if (rawShareKeyInput) { if (rawShareKeyInput.includes('/s/')) { try { let url; try { url = new URL(rawShareKeyInput); } catch (e) { if (!rawShareKeyInput.startsWith('http')) url = new URL('https://' + rawShareKeyInput); else throw e; } const pathSegments = url.pathname.split('/'); const sIndex = pathSegments.indexOf('s'); if (sIndex !== -1 && pathSegments.length > sIndex + 1) { finalShareKey = pathSegments[sIndex + 1]; const searchParams = new URLSearchParams(url.search); const possiblePwdParams = ['pwd', '提取码', 'password', 'extract', 'code']; for (const paramName of possiblePwdParams) { if (searchParams.has(paramName)) { const urlPwd = searchParams.get(paramName); if (urlPwd && (!sharePwd || sharePwd.length === 0)) { sharePwd = urlPwd; if (sharePwdEl) sharePwdEl.value = sharePwd; } break; } } if ((!sharePwd || sharePwd.length === 0)) { const fullUrl = rawShareKeyInput; const pwdRegexes = [ /[?&]提取码[:=]([A-Za-z0-9]+)/, /提取码[:=]([A-Za-z0-9]+)/, /[?&]pwd[:=]([A-Za-z0-9]+)/, /[?&]password[:=]([A-Za-z0-9]+)/, /提取码[：:]([A-Za-z0-9]+)/, /[?&]提取码[：:]([A-Za-z0-9]+)/ ]; for (const regex of pwdRegexes) { const match = fullUrl.match(regex); if (match && match[1]) { sharePwd = match[1]; if (sharePwdEl) sharePwdEl.value = sharePwd; break; } } } } else { let pathAfterS = rawShareKeyInput.substring(rawShareKeyInput.lastIndexOf('/s/') + 3); finalShareKey = pathAfterS.split(/[/?#]/)[0]; } } catch (e) { let pathAfterS = rawShareKeyInput.substring(rawShareKeyInput.lastIndexOf('/s/') + 3); finalShareKey = pathAfterS.split(/[/?#]/)[0]; if (!sharePwd || sharePwd.length === 0) { const pwdMatch = rawShareKeyInput.match(/提取码[:=]([A-Za-z0-9]+)/); if (pwdMatch && pwdMatch[1]) { sharePwd = pwdMatch[1]; if (sharePwdEl) sharePwdEl.value = sharePwd; } } console.warn(`[${SCRIPT_NAME}] 分享链接解析失败: ${e.message}`); } } if (finalShareKey && finalShareKey.includes('自定义')) finalShareKey = finalShareKey.split('自定义')[0]; } if (!finalShareKey) { this.showAlert("请输入有效的分享Key或分享链接。"); return; } if (isNaN(parseInt(shareFid))) { this.showAlert("起始文件夹ID必须是数字。"); return; } generatePublicBtn.disabled = true; this.modalElement.querySelector('#fl-m-cancel')?.setAttribute('disabled', 'true'); await coreLogic.generateLinkFromPublicShare(finalShareKey, sharePwd, shareFid); if(this.modalElement && generatePublicBtn){ generatePublicBtn.disabled = false; this.modalElement.querySelector('#fl-m-cancel')?.removeAttribute('disabled');} };}
                const generatePublicBatchBtn = this.modalElement.querySelector('#fl-m-generate-public-batch');
                if(generatePublicBatchBtn) {
                    generatePublicBatchBtn.onclick = async () => {
                        const batchInputEl = this.modalElement.querySelector('#fl-m-public-share-batch-input');
                        if (!batchInputEl || !batchInputEl.value.trim()) {
                            this.showAlert("请输入至少一个分享链接。");
                            return;
                        }

                        const lines = batchInputEl.value.trim().split('\n').filter(line => line.trim());
                        if (lines.length === 0) {
                            this.showAlert("请输入至少一个分享链接。");
                            return;
                        }

                        generatePublicBatchBtn.disabled = true;
                        this.modalElement.querySelector('#fl-m-cancel')?.setAttribute('disabled', 'true');

                        let successCount = 0;
                        let failureCount = 0;
                        let totalFiles = 0;
                        let totalSize = 0;

                        for (const line of lines) {
                            if (!line.trim()) continue;
                            const { shareKey, sharePwd } = extractShareInfoFromText(line);
                            if (!shareKey) {
                                processStateManager.appendErrorMessage(`❌ 无效的分享链接: ${line}`);
                                failureCount++;
                                continue;
                            }

                            try {
                                const result = await coreLogic.generateLinkFromPublicShare(shareKey, sharePwd, "0", true);
                                if (result && result.jsonData) {
                                    // Generate filename for this share
                                    let fileName;
                                    // 判断是否为文件夹导出（有公共路径或文件路径包含目录结构）
                                    const isFolderExport = result.jsonData.commonPath || result.jsonData.files.some(f => f.path.includes('/'));

                                    if (isFolderExport && settingsManager.get('useFolderNameForJson')) {
                                        // 文件夹导出：使用文件夹名（公共路径的第一段）
                                        const firstPathSegment = (result.jsonData.commonPath || result.jsonData.files[0]?.path || '').split('/')[0];
                                        const sanitizedPath = firstPathSegment.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');
                                        if (sanitizedPath) {
                                            if (settingsManager.get('appendDateToJson')) {
                                                const now = new Date();
                                                const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                                fileName = `${sanitizedPath}_${dateStr}.json`;
                                            } else {
                                                fileName = `${sanitizedPath}.json`;
                                            }
                                        } else {
                                            fileName = `123FastLink_${Date.now()}.json`;
                                        }
                                    } else {
                                        // 文件导出：使用文件名（去掉扩展名）
                                        let nameSource = '';
                                        if (result.jsonData.files && result.jsonData.files.length > 0) {
                                            nameSource = result.jsonData.files[0].path;
                                        }

                                        if (nameSource) {
                                            // 提取文件名（去掉路径，只保留文件名部分）
                                            const pathParts = nameSource.split('/');
                                            const fileNameOnly = pathParts[pathParts.length - 1];
                                            // 去掉文件扩展名
                                            const nameWithoutExt = fileNameOnly.replace(/\.[^/.]+$/, '');
                                            const sanitizedPath = nameWithoutExt.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');

                                            if (sanitizedPath) {
                                                if (settingsManager.get('appendDateToJson')) {
                                                    const now = new Date();
                                                    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                                    fileName = `${sanitizedPath}_${dateStr}.json`;
                                                } else {
                                                    fileName = `${sanitizedPath}.json`;
                                                }
                                            } else {
                                                fileName = `123FastLink_${Date.now()}.json`;
                                            }
                                        } else {
                                            fileName = `123FastLink_${Date.now()}.json`;
                                        }
                                    }

                                    // Silently export JSON
                                    this._downloadToFile(JSON.stringify(result.jsonData, null, 2), fileName, 'application/json');

                                    // Update totals
                                    totalFiles += result.jsonData.totalFilesCount;
                                    totalSize += result.jsonData.totalSize;
                                    successCount++;
                                } else {
                                    processStateManager.appendErrorMessage(`❌ 生成分享链接失败: ${shareKey}`);
                                    failureCount++;
                                }
                            } catch (error) {
                                processStateManager.appendErrorMessage(`❌ 处理分享链接时出错: ${shareKey} - ${error.message}`);
                                failureCount++;
                            }
                        }

                        // Show final summary modal
                        const formattedTotalSize = formatBytes(totalSize);
                        const summary = `<div class="fastlink-result">
                            <h3>${failureCount > 0 && successCount > 0 ? "🎯 部分成功" : (successCount > 0 ? "🎉 生成成功" : "🤔 无有效数据")}</h3>
                            <p>📄 已处理分享: ${lines.length} 个</p>
                            <p>✅ 成功生成: ${successCount} 个</p>
                            <p>❌ 失败项目: ${failureCount} 个</p>
                            <p>📦 总文件数: ${totalFiles} 个</p>
                            <p>💾 总大小: ${formattedTotalSize}</p>
                        </div>`;

                        this.showModal("🎉 批量处理完成", summary, 'showLink', true);
                        processStateManager.appendInfoMessage(`\n📊 批量处理完成: 成功 ${successCount} 个, 失败 ${failureCount} 个`);
                        generatePublicBatchBtn.disabled = false;
                        this.modalElement.querySelector('#fl-m-cancel')?.removeAttribute('disabled');
                    };
                }

                const copyBtn = this.modalElement.querySelector('#fl-m-copy'); if(copyBtn){ copyBtn.onclick = () => { const textToCopy = pureLinkForClipboard || this.modalElement.querySelector('.fastlink-link-text')?.value; if (textToCopy) { GM_setClipboard(textToCopy); this.showAlert("已复制到剪贴板！");} else this.showError("无法找到链接文本。"); };}
                const exportJsonBtn = this.modalElement.querySelector('#fl-m-export-json'); if(exportJsonBtn && jsonDataForExport){ exportJsonBtn.onclick = () => { try {
                    let fileName;
                    // 判断是否为文件夹导出（有公共路径或文件路径包含目录结构）
                    const isFolderExport = jsonDataForExport.commonPath || jsonDataForExport.files.some(f => f.path.includes('/'));

                    if (isFolderExport && settingsManager.get('useFolderNameForJson')) {
                        // 文件夹导出：使用文件夹名（公共路径的第一段）
                        const firstPathSegment = (jsonDataForExport.commonPath || jsonDataForExport.files[0]?.path || '').split('/')[0];
                        const sanitizedPath = firstPathSegment.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');
                        if (sanitizedPath) {
                            if (settingsManager.get('appendDateToJson')) {
                                const now = new Date();
                                const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                fileName = `${sanitizedPath}_${dateStr}.json`;
                            } else {
                                fileName = `${sanitizedPath}.json`;
                            }
                        } else {
                            fileName = `123FastLink_${Date.now()}.json`;
                        }
                    } else {
                        // 文件导出：使用文件名（去掉扩展名）
                        let nameSource = '';
                        if (jsonDataForExport.files && jsonDataForExport.files.length > 0) {
                            nameSource = jsonDataForExport.files[0].path;
                        }

                        if (nameSource) {
                            // 提取文件名（去掉路径，只保留文件名部分）
                            const pathParts = nameSource.split('/');
                            const fileNameOnly = pathParts[pathParts.length - 1];
                            // 去掉文件扩展名
                            const nameWithoutExt = fileNameOnly.replace(/\.[^/.]+$/, '');
                            const sanitizedPath = nameWithoutExt.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');

                            if (sanitizedPath) {
                                if (settingsManager.get('appendDateToJson')) {
                                    const now = new Date();
                                    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                    fileName = `${sanitizedPath}_${dateStr}.json`;
                                } else {
                                    fileName = `${sanitizedPath}.json`;
                                }
                            } else {
                                fileName = `123FastLink_${Date.now()}.json`;
                            }
                        } else {
                            fileName = `123FastLink_${Date.now()}.json`;
                        }
                    }
                    this._downloadToFile(JSON.stringify(jsonDataForExport, null, 2), fileName, 'application/json');
                    this.showAlert("JSON文件已开始下载！");
                } catch (e) {
                    console.error(`[${SCRIPT_NAME}] 导出JSON失败:`, e);
                    this.showError(`导出JSON失败: ${e.message}`);
                }};}
                const exportSplitJsonBtn = this.modalElement.querySelector('#fl-m-export-split-json');
                if (exportSplitJsonBtn && jsonDataForExport) {
                    exportSplitJsonBtn.onclick = () => {
                        const chunkSizeInput = prompt("每个JSON文件包含多少个文件条目？", "500");
                        if (!chunkSizeInput) return; // User cancelled
                        const chunkSize = parseInt(chunkSizeInput, 10);
                        if (isNaN(chunkSize) || chunkSize <= 0) {
                            this.showAlert("请输入有效的正整数。", 2000);
                            return;
                        }

                        const totalFiles = jsonDataForExport.files.length;
                        const baseJsonData = { ...jsonDataForExport }; // Clone metadata
                        delete baseJsonData.files; // Remove the large files array from the base

                        // Determine base filename using existing logic
                        let baseFileName = `123FastLink_${Date.now()}`;
                        // 判断是否为文件夹导出（有公共路径或文件路径包含目录结构）
                        const isFolderExport = jsonDataForExport.commonPath || jsonDataForExport.files.some(f => f.path.includes('/'));

                        if (isFolderExport && settingsManager.get('useFolderNameForJson')) {
                            // 文件夹导出：使用文件夹名（公共路径的第一段）
                            const firstPathSegment = (jsonDataForExport.commonPath || (jsonDataForExport.files[0]?.path || '')).split('/')[0];
                            const sanitizedPath = firstPathSegment.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');
                            if (sanitizedPath) {
                                if (settingsManager.get('appendDateToJson')) {
                                    const now = new Date();
                                    const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                    baseFileName = `${sanitizedPath}_${dateStr}`;
                                } else {
                                    baseFileName = sanitizedPath;
                                }
                            }
                        } else {
                            // 文件导出：使用文件名（去掉扩展名）
                            let nameSource = '';
                            if (jsonDataForExport.files && jsonDataForExport.files.length > 0) {
                                nameSource = jsonDataForExport.files[0].path;
                            }

                            if (nameSource) {
                                // 提取文件名（去掉路径，只保留文件名部分）
                                const pathParts = nameSource.split('/');
                                const fileNameOnly = pathParts[pathParts.length - 1];
                                // 去掉文件扩展名
                                const nameWithoutExt = fileNameOnly.replace(/\.[^/.]+$/, '');
                                const sanitizedPath = nameWithoutExt.replace(/[\/:*?"<>|]/g, '_').replace(/^\s+|\s+$/g, '');

                                if (sanitizedPath) {
                                    if (settingsManager.get('appendDateToJson')) {
                                        const now = new Date();
                                        const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
                                        baseFileName = `${sanitizedPath}_${dateStr}`;
                                    } else {
                                        baseFileName = sanitizedPath;
                                    }
                                }
                            }
                        }

                        let partCounter = 1;
                        for (let i = 0; i < totalFiles; i += chunkSize) {
                            const chunk = jsonDataForExport.files.slice(i, i + chunkSize);

                            // Create a new JSON object for this chunk
                            const chunkJsonData = {
                                ...baseJsonData,
                                totalFilesCount: chunk.length, // Update file count for this specific chunk
                                files: chunk,
                                // Note: totalSize and formattedTotalSize will still reflect the whole set.
                                // Recalculating for each chunk is possible but might be slow and is often not necessary.
                            };

                            const chunkContent = JSON.stringify(chunkJsonData, null, 2);
                            const chunkFileName = `${baseFileName}_part_${partCounter}.json`;

                            this._downloadToFile(chunkContent, chunkFileName, 'application/json');
                            partCounter++;
                        }

                        this.showAlert(`已开始下载 ${partCounter - 1} 个拆分后的JSON文件。`, 3000);
                    };
                }
                const stopBtn = this.modalElement.querySelector(`#${processStateManager.getStopButtonId()}`); if(stopBtn){ stopBtn.onclick = () => { if (confirm("确定要停止当前操作吗？")) { processStateManager.requestStop(); const closeBtnForStop = this.modalElement.querySelector('#fl-m-cancel.close-btn'); if(closeBtnForStop) closeBtnForStop.disabled = false; const minimizeBtnForStop = this.modalElement.querySelector('#fl-m-minimize'); if(minimizeBtnForStop) minimizeBtnForStop.disabled = true; } }; }

                const minimizeBtn = this.modalElement.querySelector('#fl-m-minimize'); // Added for mini progress
                if (minimizeBtn) {
                    minimizeBtn.onclick = () => {
                        if (this.modalElement) this.modalElement.style.display = 'none';
                        this.showMiniProgress();
                        // Ensure the mini progress bar shows current progress immediately
                        processStateManager.updateProgressUINow(); // Call a direct update if needed or rely on next interval
                    };
                }
                const closeBtn = this.modalElement.querySelector('#fl-m-close-btn');
                if (closeBtn) {
                    closeBtn.onclick = () => {
                        // 只有进行中的进度弹窗需要停止确认，结束后或非进度弹窗直接关闭
                        if (type === 'progress_stoppable' && processStateManager.isOperationActive() && !processStateManager.isStopRequested()) {
                            if (confirm("确定要停止当前操作吗？")) {
                                processStateManager.requestStop();
                                const closeBtnForStop = this.modalElement.querySelector('#fl-m-cancel.close-btn');
                                if(closeBtnForStop) closeBtnForStop.disabled = false;
                                const minimizeBtnForStop = this.modalElement.querySelector('#fl-m-minimize');
                                if(minimizeBtnForStop) minimizeBtnForStop.disabled = true;
                            }
                        } else {
                            this.hideModal();
                        }
                    };
                }
                const cancelBtn = this.modalElement.querySelector('#fl-m-cancel');
                const finalCloseBtn = this.modalElement.querySelector('#fl-m-final-close');
                if (cancelBtn && type === 'progress_stoppable') {
                    cancelBtn.textContent = processStateManager.isStopRequested() ? "关闭" : "隐藏";
                    cancelBtn.onclick = () => {
                        if (processStateManager.isStopRequested() || !this.modalElement.querySelector(`#${processStateManager.getStopButtonId()}`)) { this.hideModal(); } // Close if stopped or no stop button
                        else { if (this.modalElement) this.modalElement.style.display = 'none'; if (this.modalHideCallback) { this.modalHideCallback(); this.modalHideCallback = null; } }
                    };
                } else if ((cancelBtn || finalCloseBtn) && closable) {
                    if (cancelBtn) cancelBtn.onclick = () => this.hideModal();
                    if (finalCloseBtn) finalCloseBtn.onclick = () => this.hideModal();
                }
                if(!closable && cancelBtn && type !== 'progress_stoppable') cancelBtn.disabled = true;
                const copyPreprocessingLogBtn = this.modalElement.querySelector('#fl-m-copy-preprocessing-log'); if(copyPreprocessingLogBtn && preprocessingFailuresForLog) { copyPreprocessingLogBtn.onclick = () => { const logText = preprocessingFailuresForLog.map(pf => `文件: ${pf.fileName || (pf.originalEntry&&pf.originalEntry.path)||'未知路径'}\n${(pf.originalEntry&&pf.originalEntry.etag)?('原始ETag: '+pf.originalEntry.etag+'\n'):(pf.etag?'处理后ETag: '+pf.etag+'\n':'')}${(pf.originalEntry&&pf.originalEntry.size)?('大小: '+pf.originalEntry.size+'\n'):(pf.size?'大小: '+pf.size+'\n':'')}错误: ${pf.error||'未知错误'}`).join('\n\n'); GM_setClipboard(logText); this.showAlert("预处理失败日志已复制到剪贴板！", 1500); };}

                const pauseBtn = this.modalElement.querySelector(`#${processStateManager.getPauseButtonId()}`);
                if (pauseBtn && (type === 'progress_stoppable' || closable)) {
                    pauseBtn.disabled = false;
                    pauseBtn.onclick = () => {
                        processStateManager.togglePause();
                    };
                }

                if (type === 'progress_stoppable') { this.modalHideCallback = () => { const stopBtnInstance = this.modalElement?.querySelector(`#${processStateManager.getStopButtonId()}`); if (stopBtnInstance && !processStateManager.isStopRequested()) stopBtnInstance.textContent = "🛑 停止 (后台)"; }; }
                if(type === 'inputLink' || type === 'inputLinkNew' || type === 'showLink'){ const firstInput = this.modalElement.querySelector('input[type="text"], textarea'); if(firstInput) setTimeout(() => firstInput.focus(), 100); }

                // 统一所有弹窗定位；顶部来源的进度弹窗也保持居中显示
                setTimeout(() => {
                    // 顶部页面或其触发的进度弹窗使用居中定位
                    if (type === 'generateShareNew' || type === 'inputLinkNew' || (type === 'progress_stoppable' && this.preferredCenteredLayout)) {
                        this.modalElement.style.position = 'fixed';
                        this.modalElement.style.top = '50%';
                        this.modalElement.style.left = '50%';
                        this.modalElement.style.transform = 'translate(-50%, -50%)';
                        this.modalElement.style.width = window.innerWidth <= 600 ? '92vw' : '380px';
                        this.modalElement.style.maxWidth = window.innerWidth <= 600 ? '96vw' : '420px';
                        this.modalElement.style.borderRadius = window.innerWidth <= 600 ? '28px' : '18px';
                        this.modalElement.style.maxHeight = '72vh';
                        this.modalElement.style.zIndex = 10010;
                        const modalContent = this.modalElement.querySelector('.fastlink-modal-content');
                        if(modalContent) {
                            modalContent.style.maxHeight = 'calc(72vh - 60px)';
                            modalContent.style.overflowY = 'auto';
                        }
                    } else {
                        // 其他弹窗类型定位为侧边栏按钮旁边（无论PC/移动端）
                        const fastLinkBtn = document.getElementById('fastlink-tool-li');
                        if (fastLinkBtn) {
                            const rect = fastLinkBtn.getBoundingClientRect();
                            this.modalElement.style.position = 'fixed';
                            this.modalElement.style.top = (rect.top + window.scrollY - 180) + 'px';
                            this.modalElement.style.left = (rect.right + 8) + 'px';
                            this.modalElement.style.transform = 'none';
                            // 宽度/圆角自适应
                            if(window.innerWidth <= 600) {
                                this.modalElement.style.width = '94vw';
                                this.modalElement.style.maxWidth = '98vw';
                                this.modalElement.style.borderRadius = '28px';
                            } else {
                                this.modalElement.style.width = '210px';
                                this.modalElement.style.maxWidth = '230px';
                                this.modalElement.style.borderRadius = '18px';
                            }
                            this.modalElement.style.maxHeight = '90vh';
                            this.modalElement.style.zIndex = 10010;
                            // 内容区滚动
                            const modalContent = this.modalElement.querySelector('.fastlink-modal-content');
                            if(modalContent) {
                                modalContent.style.maxHeight = 'calc(90vh - 60px)';
                                modalContent.style.overflowY = 'auto';
                            }
                        } else {
                            // 如果找不到按钮，兜底居中
                            this.modalElement.style.position = 'fixed';
                            this.modalElement.style.top = '50%';
                            this.modalElement.style.left = '50%';
                            this.modalElement.style.transform = 'translate(-50%, -50%)';
                            this.modalElement.style.width = window.innerWidth <= 600 ? '92vw' : '200px';
                            this.modalElement.style.maxWidth = window.innerWidth <= 600 ? '96vw' : '220px';
                            this.modalElement.style.borderRadius = window.innerWidth <= 600 ? '28px' : '18px';
                            this.modalElement.style.maxHeight = '90vh';
                            this.modalElement.style.zIndex = 10010;
                            const modalContent = this.modalElement.querySelector('.fastlink-modal-content');
                            if(modalContent) {
                                modalContent.style.maxHeight = 'calc(90vh - 60px)';
                                modalContent.style.overflowY = 'auto';
                            }
                        }
                    }
                }, 0);
            },
            enableModalCloseButton: function(enable = true) {
                if (this.modalElement) {
                    const closeBtn = this.modalElement.querySelector('#fl-m-cancel.close-btn');
                    if (closeBtn) { closeBtn.disabled = !enable; if(enable && this.activeModalOperationType === 'progress_stoppable') closeBtn.textContent = "关闭"; }
                    const stopBtn = this.modalElement.querySelector(`#${processStateManager.getStopButtonId()}`);
                    if (stopBtn && enable) stopBtn.disabled = true; // If enabling close, typically stop is done
                }
            },
            updateModalContent: function(newContent) { if (this.modalElement) { const ca = this.modalElement.querySelector(`#${this.MODAL_CONTENT_ID}`); if (ca) { if (ca.tagName === 'TEXTAREA' || ca.hasAttribute('contenteditable')) ca.value = newContent; else ca.innerHTML = newContent; ca.scrollTop = ca.scrollHeight;} } },
            updateModalTitle: function(newTitle) { if (this.modalElement) { const te = this.modalElement.querySelector('.fastlink-modal-title'); if (te) te.textContent = newTitle; } },
            hideModal: function() { if (this.modalElement) { this.modalElement.remove(); this.modalElement = null; } this.activeModalOperationType = null; this.modalHideCallback = null; },
            showInfo: function(message, duration = 2000) {
                const infoElement = document.createElement('div');
                infoElement.className = 'fastlink-info-popup';
                infoElement.innerHTML = message;
                document.body.appendChild(infoElement);
                setTimeout(() => {
                    infoElement.classList.add('fastlink-info-popup-fadeout');
                    setTimeout(() => { if (infoElement.parentNode) infoElement.parentNode.removeChild(infoElement); }, 500); // Wait for fadeout animation
                }, duration);
            },
            showAlert: function(message, duration = 2000) { this.showInfo(message, duration); },
            showError: function(message, duration = 3000) { this.showInfo(`<span style="color: red;">⚠️ ${message}</span>`, duration); },
            getModalElement: function() { return this.modalElement; },
            showSettingsDialog: function() {
                const settingsContent = `
                    <div class="settings-dialog">
                        <div class="settings-group">
                            <h4>⚙️ 设置</h4>
                            <div class="settings-item">
                                <input type="checkbox" id="setting-debug-mode" ${settingsManager.get('debugMode') ? 'checked' : ''}>
                                <label for="setting-debug-mode">调试模式</label>
                                <div class="settings-description">启用后将显示更多调试信息</div>
                            </div>
                            <div class="settings-item">
                                <input type="checkbox" id="setting-use-folder-name" ${settingsManager.get('useFolderNameForJson') ? 'checked' : ''}>
                                <label for="setting-use-folder-name">使用文件夹名作为JSON文件名</label>
                                <div class="settings-description">导出JSON时使用文件夹名作为文件名前缀</div>
                            </div>
                            <div class="settings-item">
                                <input type="checkbox" id="setting-append-date" ${settingsManager.get('appendDateToJson') ? 'checked' : ''}>
                                <label for="setting-append-date">在JSON文件名中添加日期</label>
                                <div class="settings-description">导出JSON时在文件名中添加日期信息</div>
                            </div>
                            <div class="settings-item">
                                <input type="checkbox" id="setting-use-base62-etags" ${settingsManager.get('usesBase62EtagsInExport') ? 'checked' : ''}>
                                <label for="setting-use-base62-etags">使用Base62格式的ETag</label>
                                <div class="settings-description">导出JSON时使用Base62格式的ETag（更短的格式）</div>
                        </div>
                        ${settingsManager.isDebugMode() ? `
                        <div class="settings-group">
                            <div class="api-test-container">
                                <h4>🔍 API 测试</h4>
                                <div class="api-test-row">
                                    <label for="api-path-select">API 路径:</label>
                                    <select id="api-path-select" class="api-path-select">
                                        ${apiTestManager.getApiPathOptions().map(option =>
                                            `<option value="${option.value}">${option.label}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                                <div class="api-test-row">
                                    <label for="api-method-select">请求方法:</label>
                                    <select id="api-method-select" class="api-path-select" style="width:100px;">
                                        <option value="POST">POST</option>
                                        <option value="GET">GET</option>
                                    </select>
                                </div>
                                <div id="api-params-container" class="api-params-container">
                                    </div>
                                <div class="api-test-row">
                                    <label for="api-retry-count">重试次数:</label>
                                    <input type="number" id="api-retry-count" class="api-param-input" min="0" max="20" value="3" style="width:80px;">
                                </div>
                                <div class="api-test-row">
                                    <button id="api-test-button" class="api-test-button">测试 API</button>
                                </div>
                                <div id="api-test-result" class="api-test-result">
                                    </div>
                            </div>
                        </div>
                        ` : ''}
                    </div>`;

                this.showModal("⚙️ 设置", settingsContent, 'settings', true);

                // Add event listeners for settings
                const debugModeCheckbox = this.modalElement.querySelector('#setting-debug-mode');
                const useFolderNameCheckbox = this.modalElement.querySelector('#setting-use-folder-name');
                const appendDateCheckbox = this.modalElement.querySelector('#setting-append-date');
                const useBase62EtagsCheckbox = this.modalElement.querySelector('#setting-use-base62-etags');

                if (debugModeCheckbox) {
                    debugModeCheckbox.onchange = () => {
                        settingsManager.set('debugMode', debugModeCheckbox.checked);
                        // Refresh the settings dialog to show/hide API test section
                        this.showSettingsDialog();
                    };
                }

                if (useFolderNameCheckbox) {
                    useFolderNameCheckbox.onchange = () => {
                        settingsManager.set('useFolderNameForJson', useFolderNameCheckbox.checked);
                    };
                }

                if (appendDateCheckbox) {
                    appendDateCheckbox.onchange = () => {
                        settingsManager.set('appendDateToJson', appendDateCheckbox.checked);
                    };
                }

                if (useBase62EtagsCheckbox) {
                    useBase62EtagsCheckbox.onchange = () => {
                        settingsManager.set('usesBase62EtagsInExport', useBase62EtagsCheckbox.checked);
                    };
                }

                // Add API test functionality if debug mode is enabled
                if (settingsManager.isDebugMode()) {
                    const apiPathSelect = this.modalElement.querySelector('#api-path-select');
                    const paramsContainer = this.modalElement.querySelector('#api-params-container');
                    const testButton = this.modalElement.querySelector('#api-test-button');
                    const resultContainer = this.modalElement.querySelector('#api-test-result');
                    const retryCountInput = this.modalElement.querySelector('#api-retry-count');

                    function updateParamsFields() {
                        const selectedPath = apiPathSelect.value;
                        const requiredParams = apiTestManager.getRequiredParams(selectedPath);
                        const defaultParams = apiTestManager.getDefaultParams(selectedPath);

                        paramsContainer.innerHTML = requiredParams.map(param => {
                            const defaultValue = defaultParams[param] !== undefined ? defaultParams[param] : '';
                            return `
                                <div class="api-test-row">
                                    <label for="param-${param}">${param}:</label>
                                    <input type="text" id="param-${param}" class="api-param-input" placeholder="输入 ${param}" value="${defaultValue}">
                                </div>
                            `;
                        }).join('');
                    }

                    apiPathSelect.onchange = updateParamsFields;
                    updateParamsFields();

                    testButton.onclick = async () => {
                        const selectedPath = apiPathSelect.value;
                        const selectedMethod = this.modalElement.querySelector('#api-method-select').value;
                        const requiredParams = apiTestManager.getRequiredParams(selectedPath);
                        const defaultParams = apiTestManager.getDefaultParams(selectedPath);
                        const params = {};
                        let retryCount = 3;
                        if (retryCountInput && retryCountInput.value !== '') {
                            retryCount = parseInt(retryCountInput.value, 10);
                            if (isNaN(retryCount) || retryCount < 0) retryCount = 0;
                        }
                        // Collect parameter values
                        requiredParams.forEach(param => {
                            const input = this.modalElement.querySelector(`#param-${param}`);
                            if (input) {
                                params[param] = input.value;
                            }
                        });

                        // Show loading state
                        testButton.disabled = true;
                        testButton.textContent = '测试中...';
                        resultContainer.innerHTML = '<div class="api-test-loading">正在测试 API...</div>';

                        try {
                            const result = await apiTestManager.testApi(selectedPath, params, retryCount, selectedMethod);
                            if (result.success) {
                                resultContainer.innerHTML = `
                                    <div class="api-test-success">
                                        <h4>✔️ 请求成功</h4>
                                        <pre>${JSON.stringify(result.data, null, 2)}</pre>
                                    </div>
                                `;
                            } else {
                                resultContainer.innerHTML = `
                                    <div class="api-test-error">
                                        <h4>❌ 请求失败</h4>
                                        <pre>${result.error}</pre>
                                    </div>
                                `;
                            }
                        } catch (error) {
                            console.error(`[${SCRIPT_NAME}] API测试出错:`, error);
                            resultContainer.innerHTML = `
                                <div class="api-test-error">
                                    <h4>❌ 请求失败</h4>
                                    <pre>${error.message || '未知错误'}</pre>
                                </div>
                            `;
                        } finally {
                            testButton.disabled = false;
                            testButton.textContent = '测试 API';
                        }
                    };
                }
            },
        };

        function initialize() {
            console.log(`[${SCRIPT_NAME}] ${SCRIPT_VERSION} 初始化...`);
            settingsManager.init();
            filterManager.init();
            uiManager.applyStyles();
            uiManager.initMiniProgress();
            let loadAttempts = 0;
            const maxAttempts = 10;
            function tryAddButton() {
                loadAttempts++;
                const pageSeemsReady = document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA);
                if (pageSeemsReady) {
                    if (document.querySelector('.fastlink-main-button-container')) return;
                    if (uiManager.createDropdownButton()) return;
                }
                if (loadAttempts < maxAttempts) {
                    const delay = loadAttempts < 3 ? 1500 : 3000;
                    setTimeout(tryAddButton, delay);
                } else {
                    // 只在调试模式下显示警告，避免正常使用时产生过多日志
                    if (settingsManager.isDebugMode()) {
                        console.warn(`[${SCRIPT_NAME}] 达到最大尝试次数，未能添加按钮。请刷新页面重试。`);
                    }
                }
            }
            const observer = new MutationObserver((mutations, obs) => {
                const targetAreaExists = !!document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA);
                const ourButtonExists = !!document.querySelector('.fastlink-main-button-container');
                if (targetAreaExists && !ourButtonExists) {
                    loadAttempts = 0;
                    setTimeout(tryAddButton, 700);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
            setTimeout(tryAddButton, 500);
            injectFastLinkSidebarMenu(); // <-- 新增：集成到左侧菜单栏
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(initialize, 300); } else { window.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 300)); }

        function isValidHex(str) {
            if (typeof str !== 'string' || str.length === 0) return false;
            return /^[0-9a-fA-F]+$/.test(str);
        }

        function isValidBase62(str) {
            if (typeof str !== 'string' || str.length === 0) return false;
            return /^[0-9a-zA-Z]+$/.test(str);
        }

        function bigIntToBase62(num) {
            if (typeof num !== 'bigint') throw new Error("Input must be a BigInt.");
            if (num === 0n) return BASE62_CHARS[0];
            let base62 = "";
            let n = num;
            while (n > 0n) {
                base62 = BASE62_CHARS[Number(n % 62n)] + base62;
                n = n / 62n;
            }
            return base62;
        }

        function base62ToBigInt(str) {
            if (typeof str !== 'string' || str.length === 0) throw new Error("Input must be non-empty string.");
            let num = 0n;
            for (let i = 0; i < str.length; i++) {
                const char = str[i];
                const val = BASE62_CHARS.indexOf(char);
                if (val === -1) throw new Error(`Invalid Base62 char: ${char}`);
                num = num * 62n + BigInt(val);
            }
            return num;
        }

        function hexToOptimizedEtag(hexEtag) {
            // First check if it's already a Base62 ETag
            if (isValidBase62(hexEtag) && !isValidHex(hexEtag)) {
                console.log(`[${SCRIPT_NAME}] ETag is already in Base62 format: ${hexEtag}`);
                return { original: hexEtag, optimized: hexEtag, useV2: true };
            }

            // Then check if it's a valid hex ETag
            if (!isValidHex(hexEtag) || hexEtag.length === 0) {
                console.log(`[${SCRIPT_NAME}] Invalid hex ETag: ${hexEtag}`);
                return { original: hexEtag, optimized: null, useV2: false };
            }

            try {
                if (settingsManager.isDebugMode()) console.log(`[${SCRIPT_NAME}] Converting hex ETag: ${hexEtag}`);
                const bigIntValue = BigInt('0x' + hexEtag);
                const base62Value = bigIntToBase62(bigIntValue);
                if (base62Value.length > 0 && base62Value.length < hexEtag.length) {
                    if (settingsManager.isDebugMode()) console.log(`[${SCRIPT_NAME}] Converted to Base62 ETag: ${base62Value}`);
                    return { original: hexEtag, optimized: base62Value, useV2: true };
                }
                if (settingsManager.isDebugMode()) console.log(`[${SCRIPT_NAME}] Keeping original hex ETag (conversion not beneficial): ${hexEtag}`);
                return { original: hexEtag, optimized: hexEtag, useV2: false };
            } catch (e) {
                console.warn(`[${SCRIPT_NAME}] ETag "${hexEtag}" to Base62 failed: ${e.message}. Using original.`);
                return { original: hexEtag, optimized: null, useV2: false };
            }
        }

        function optimizedEtagToHex(optimizedEtag, isV2Etag) {
            if (!isV2Etag) return optimizedEtag;
            if (typeof optimizedEtag !== 'string' || optimizedEtag.length === 0) {
                throw new Error("V2 ETag cannot be empty.");
            }

            // If it's already a hex string, return it
            if (isValidHex(optimizedEtag)) {
                console.log(`[${SCRIPT_NAME}] ETag is already in hex format: ${optimizedEtag}`);
                return optimizedEtag;
            }

            // If it's a Base62 string, convert it
            if (isValidBase62(optimizedEtag)) {
                try {
                    console.log(`[${SCRIPT_NAME}] Converting Base62 ETag: ${optimizedEtag}`);
                    const bigIntValue = base62ToBigInt(optimizedEtag);
                    let hex = bigIntValue.toString(16).toLowerCase();
                    // Always pad to 32 characters for hex ETags
                    if (hex.length < 32) {
                        hex = hex.padStart(32, '0');
                    }
                    console.log(`[${SCRIPT_NAME}] Converted to hex ETag: ${hex}`);
                    return hex;
                } catch (e) {
                    console.error(`[${SCRIPT_NAME}] Failed to convert Base62 ETag "${optimizedEtag}" to hex:`, e);
                    throw new Error(`Base62 ETag "${optimizedEtag}" to Hex failed: ${e.message}`);
                }
            }

            throw new Error(`Invalid ETag format: ${optimizedEtag}`);
        }

        // Add new function to handle .123share file conversion
        function convert123ShareToJson(fileContent) {
            try {
                // Decode base64 content
                const decodedContent = atob(fileContent);
                // Parse JSON
                const rawData = JSON.parse(decodedContent);

                // Build folder structure and file paths
                const folderMap = new Map(); // Map<folderId, folderName>
                const fileEntries = []; // Array of file entries to be included in output

                // First pass: collect all folders
                rawData.forEach(item => {
                    if (item.Type === 1) { // Folder
                        folderMap.set(item.FileId, item.FileName);
                    }
                });

                // Second pass: process files and build paths
                rawData.forEach(item => {
                    if (item.Type === 0) { // File
                        // Build path by following parent chain
                        let currentPath = item.FileName;
                        let currentParentId = item.parentFileId;
                        let rootFolderId = currentParentId; // Track the root folder ID

                        while (currentParentId && currentParentId !== "0") {
                            const parentName = folderMap.get(currentParentId);
                            if (parentName) {
                                currentPath = parentName + "/" + currentPath;
                                // Find parent's parent
                                const parentItem = rawData.find(i => i.FileId === currentParentId);
                                currentParentId = parentItem ? parentItem.parentFileId : "0";
                                if (currentParentId === "0") {
                                    rootFolderId = item.parentFileId; // This is the root folder ID
                                }
                            } else {
                                break;
                            }
                        }

                        fileEntries.push({
                            path: currentPath,
                            size: String(item.Size || 0),
                            etag: item.Etag,
                            rootFolderId: rootFolderId // Store the root folder ID for each file
                        });
                    }
                });

                // Calculate total size
                const totalSize = fileEntries.reduce((sum, entry) => sum + (Number(entry.size) || 0), 0);

                // Find common root folder
                let commonPath = "";
                if (fileEntries.length > 0) {
                    const firstRootFolderId = fileEntries[0].rootFolderId;
                    const allShareSameRoot = fileEntries.every(entry => entry.rootFolderId === firstRootFolderId);

                    if (allShareSameRoot && firstRootFolderId !== "0") {
                        // Find the root folder name
                        const rootFolderName = folderMap.get(firstRootFolderId);
                        if (rootFolderName) {
                            commonPath = rootFolderName + "/";
                        }
                    }
                }

                // Check if we should use V2 format (Base62 ETags)
                const useV2Format = settingsManager.get('usesBase62EtagsInExport');

                // Convert to expected format
                const jsonData = {
                    scriptVersion: SCRIPT_VERSION,
                    exportVersion: "1.0",
                    usesBase62EtagsInExport: useV2Format,
                    commonPath: commonPath,
                    totalFilesCount: fileEntries.length,
                    totalSize: totalSize,
                    formattedTotalSize: formatBytes(totalSize),
                    files: fileEntries.map(entry => ({
                        path: commonPath ? entry.path.substring(commonPath.length) : entry.path,
                        size: entry.size,
                        etag: useV2Format ? hexToOptimizedEtag(entry.etag).optimized : entry.etag
                    }))
                };

                return jsonData;
            } catch (e) {
                console.error(`[${SCRIPT_NAME}] Error converting .123share file:`, e);
                throw new Error("Invalid .123share file format");
            }
        }

        // Add new function to handle JSON to .123share file conversion
        function convertJsonTo123Share(jsonData) {
            try {
                if (!jsonData || typeof jsonData !== 'object' || !Array.isArray(jsonData.files)) {
                    throw new Error("Invalid JSON data format");
                }

                // Convert files array to raw data format
                const rawData = [];
                const folderMap = new Map(); // Map<folderPath, folderId>
                let nextFolderId = 1;

                // Helper function to ensure folder exists and get its ID
                function ensureFolderExists(folderPath) {
                    if (!folderPath) return "0"; // Root folder
                    if (folderMap.has(folderPath)) return folderMap.get(folderPath);

                    const folderId = String(nextFolderId++);
                    folderMap.set(folderPath, folderId);

                    // Add folder entry
                    rawData.push({
                        FileId: folderId,
                        FileName: folderPath.split('/').pop(),
                        Type: 1, // Folder
                        Size: 0,
                        Etag: "",
                        ParentFileId: folderPath.includes('/') ? ensureFolderExists(folderPath.substring(0, folderPath.lastIndexOf('/'))) : "0"
                    });

                    return folderId;
                }

                // Process each file
                jsonData.files.forEach(file => {
                    const fullPath = jsonData.commonPath ? jsonData.commonPath + file.path : file.path;
                    const fileName = fullPath.split('/').pop();
                    const folderPath = fullPath.substring(0, fullPath.lastIndexOf('/'));
                    const parentFolderId = ensureFolderExists(folderPath);

                    // Add file entry
                    rawData.push({
                        FileId: String(nextFolderId++),
                        FileName: fileName,
                        Type: 0, // File
                        Size: parseInt(file.size) || 0,
                        Etag: file.etag,
                        ParentFileId: parentFolderId
                    });
                });

                // Convert to base64 with proper Unicode handling
                const jsonString = JSON.stringify(rawData);
                // First encode the string to UTF-8 using encodeURIComponent
                const utf8String = encodeURIComponent(jsonString)
                    .replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16)));
                // Then convert to base64
                return btoa(utf8String);
            } catch (e) {
                console.error(`[${SCRIPT_NAME}] Error converting JSON to .123share file:`, e);
                throw new Error("Invalid JSON data format or conversion failed");
            }
        }

        function formatBytes(bytes, decimals = 2) { if (bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; }

        // Add settings click handler
        document.addEventListener('click', function(e) {
            if (e.target.id === 'fastlink-settings') {
                uiManager.showSettingsDialog();
            }
        });

        // Add helper function to convert alternative format to standard format
        function convertAlternativeJsonFormat(jsonData) {
            if (!Array.isArray(jsonData)) return null;

            // Check if it's the alternative format (array of arrays with 3 elements)
            if (jsonData.every(item => Array.isArray(item) && item.length === 3 &&
                typeof item[0] === 'string' && typeof item[1] === 'number' && typeof item[2] === 'string')) {

                return {
                    usesBase62EtagsInExport: false,
                    files: jsonData.map(item => ({
                        path: item[2],
                        size: String(item[1]),
                        etag: item[0].toLowerCase() // Convert etag to lowercase
                    }))
                };
            }
            return null;
        }

        // === 集成FastLink到左侧菜单栏 START ===
        function createFastLinkMenuItem(id, text, iconHref) {
            const li = document.createElement('li');
            li.id = id;
            li.className = 'ant-menu-item ant-menu-item-only-child fastlink-sidebar-btn';
            li.setAttribute('role', 'menuitem');
            li.style.paddingLeft = '24px';

            const span = document.createElement('span');
            span.className = 'ant-menu-title-content';

            const a = document.createElement('a');
            a.className = 'menu-item';
            a.href = '#';

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'menu-icon-wrapper';
            // 使用自定义SVG图标（云朵+闪电）
            iconWrapper.innerHTML = `
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1890ff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17.5 19a4.5 4.5 0 0 0 0-9 6 6 0 1 0-11.31 4.19"/>
                <polyline points="13 11 9 17 15 17 11 23" fill="#1890ff" stroke="#1890ff" stroke-width="1.2"/>
            </svg>`;

            const textDiv = document.createElement('div');
            textDiv.className = 'menu-text';
            textDiv.textContent = text;
            textDiv.style.fontWeight = 'bold';
            textDiv.style.color = '#1890ff';

            a.appendChild(iconWrapper);
            a.appendChild(textDiv);
            span.appendChild(a);
            li.appendChild(span);

            // 增加悬停高亮
            li.onmouseenter = () => { li.style.background = '#e6f7ff'; textDiv.style.color = '#096dd9'; };
            li.onmouseleave = () => { li.style.background = ''; textDiv.style.color = '#1890ff'; };

            return li;
        }

        function injectFastLinkSidebarMenu() {
            const checkInterval = setInterval(() => {
                const sidebarMenu = document.querySelector('.side-menu-container > ul.side-menu:not(.bottom-menu)');
                if (sidebarMenu && !document.getElementById('fastlink-tool-li')) {
                    const fastLinkItem = createFastLinkMenuItem('fastlink-tool-li', '秒传工具', '#business_share_24_1');
                    fastLinkItem.onclick = (e) => {
                        e.preventDefault();
                        // 如果菜单弹窗已存在，则关闭菜单（无论功能弹窗是否存在）
                        const menuExist = document.getElementById('fastlink-sidebar-popup-menu');
                        if (menuExist) {
                            menuExist.remove();
                            return;
                        }
                        // 如果功能弹窗已存在，则也关闭（可选，保留原逻辑）
                        const modal = document.querySelector('.fastlink-modal');
                        if (modal) {
                            modal.remove();
                        }
                        document.getElementById('fastlink-sidebar-popup-mask')?.remove();
                        // 不再插入遮罩，无论PC还是移动端
                        // 菜单本体
                        const menu = document.createElement('div');
                        menu.id = 'fastlink-sidebar-popup-menu';
                        menu.style.cssText = `
                            position: fixed;
                            z-index: 10010;
                            min-width: 180px;
                            width: ${window.innerWidth <= 600 ? '99vw' : '210px'};
                            max-width: ${window.innerWidth <= 600 ? '98vw' : '240px'};
                            background: #fff;
                            border-radius: 8px;
                            box-shadow: 0 2px 12px rgba(0,0,0,0.08);
                            border: 1px solid #e6e6e6;
                            padding: 0 0 8px 0;
                            font-size: ${window.innerWidth <= 600 ? '18px' : '13px'};
                            right: auto;
                            left: auto;
                        `;
                        const rect = fastLinkItem.getBoundingClientRect();
                        menu.style.top = (rect.top + window.scrollY + 2) + 'px';
                        menu.style.left = (rect.right + 8) + 'px';
                        menu.innerHTML = `
                            <div style="padding:2px 0;">
                                <div class="fastlink-menu-item main-func" id="fl-menu-generateShare">
                                <span class="menu-icon">📄</span>
                                生成秒传链接
                                </div>
                                <div class="fastlink-divider"></div>
                                <div class="fastlink-menu-item main-func" id="fl-menu-receiveDirect">
                                <span class="menu-icon">📥</span>
                                链接/文件转存
                                </div>
                                <div class="fastlink-divider"></div>
                                <div class="fastlink-menu-item more-func-toggle" id="fl-menu-more-toggle">⋯ 更多功能</div>
                                <div id="fl-menu-more-group" style="display:none;">
                                    <div class="fastlink-menu-item" id="fl-menu-generateFromPublicShare"><span class="menu-icon">🌐</span>从分享链接生成</div>
                                    <div class="fastlink-divider"></div>
                                    <div class="fastlink-menu-item" id="fl-menu-generateFromPublicShareBatch"><span class="menu-icon">📦</span>批量解析分享链接</div>
                                    <div class="fastlink-divider"></div>
                                    <div class="fastlink-menu-item" id="fl-menu-splitJsonFile"><span class="menu-icon">✂️</span>拆分JSON文件</div>
                                    <div class="fastlink-divider"></div>
                                    <div class="fastlink-menu-item" id="fl-menu-convert123Share"><span class="menu-icon">🔄</span>转换.123share</div>
                                    <div class="fastlink-divider"></div>
                                    <div class="fastlink-menu-item" id="fl-menu-filterSettings"><span class="menu-icon">🔍</span>元数据过滤设置</div>
                                    <div class="fastlink-divider"></div>
                                    <div class="fastlink-menu-item" id="fl-menu-settings"><span class="menu-icon">⚙️</span>设置</div>
                                </div>
                            </div>
                            <style>
    #fastlink-sidebar-popup-menu {
        background: #fff;
        border-radius: 22px;
        border: 1px solid #e6e6e6;
        box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        min-width: 220px;
        max-width: 96vw;
        padding-bottom: 10px;
        animation: fastlink-fadein .15s;
    }
    @keyframes fastlink-fadein {
        from { opacity: 0; transform: translateY(16px);}
        to   { opacity: 1; transform: translateY(0);}
    }
    .fastlink-menu-item{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        padding: 14px 0 8px 0;
        margin: 8px 16px;
        font-size: 17px;
        font-weight: 500;
        border-radius: 16px;
        background: none !important;
        color: #222;
        cursor: pointer;
        transition: background .13s, color .13s, box-shadow .13s, border .13s, transform .10s;
        user-select: none;
        border: 1px solid transparent;
        box-shadow: none;
    }
    .fastlink-menu-item .menu-icon {
        font-size: 24px;
        margin-bottom: 2px;
        color: #1890ff;
    }
    .fastlink-menu-item:active {
        transform: scale(0.98);
    }
    .fastlink-menu-item:hover, .fastlink-menu-item:active {
        background: #f5f5f5 !important;
        color: #1890ff;
        border: 1px solid #e6e6e6;
        box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }
    .main-func {
        background: none !important;
        color: #096dd9;
        font-size: 19px;
        font-weight: bold;
        border-radius: 18px;
        margin-bottom: 8px;
        margin-top: 8px;
        box-shadow: none;
        border: 1px solid transparent;
    }
    .main-func .menu-icon {
        color: #1890ff;
    }
    .main-func:hover, .main-func:active {
        background: #f5f5f5 !important;
        color: #0050b3;
        border: 1px solid #e6e6e6;
    }
    .more-func-toggle {
        border-top: 1px solid #e0eaff;
        margin-top: 14px;
        font-size: 16px;
        padding: 10px 0 6px 0;
        color: #1890ff;
        background: none !important;
        font-weight: bold;
        border-radius: 0 0 16px 16px;
        border: 1px solid transparent;
    }
    .more-func-toggle:hover, .more-func-toggle:active {
        background: #f5f5f5 !important;
        color: #096dd9;
        border: 1px solid #e6e6e6;
    }
    #fl-menu-more-group {
        max-height: 260px;
        overflow-y: auto;
        margin-top: 2px;
        background: none !important;
        border-radius: 14px;
        box-shadow: none;
        padding-bottom: 6px;
    }
    @media (max-width: 600px) {
        #fastlink-sidebar-popup-menu{
            min-width: 98vw !important;
            width: 99vw !important;
            left: 0vw !important;
            right: auto !important;
            font-size: 20px !important;
            border-radius: 32px !important;
        }
        .fastlink-menu-item, .main-func, .more-func-toggle{
            font-size:21px !important;
            padding:20px 0 10px 0 !important;
            margin:12px 0 !important;
            border-radius:28px !important;
        }
        #fl-menu-more-group{
            max-height:60vh;
            border-radius: 24px !important;
        }
    }
    @media (min-width: 601px) {
        #fastlink-sidebar-popup-menu{
            min-width: 180px !important;
            max-width: 240px !important;
            width: 210px !important;
            font-size: 13px !important;
            border-radius: 28px !important;
            padding-bottom: 4px !important;
        }
        .fastlink-menu-item, .main-func, .more-func-toggle{
            font-size:13px !important;
            padding:7px 0 4px 0 !important;
            margin:4px 6px !important;
            border-radius:20px !important;
        }
        .main-func {
            font-size: 14px !important;
            border-radius: 22px !important;
            margin-bottom: 4px !important;
            margin-top: 4px !important;
        }
        .more-func-toggle {
            font-size: 12px !important;
            padding: 5px 0 3px 0 !important;
            border-radius: 0 0 20px 20px !important;
        }
        #fl-menu-more-group{
            max-height: 120px !important;
            border-radius: 18px !important;
            padding-bottom: 2px !important;
        }
    }
    </style>
                        `;
                        document.body.appendChild(menu);
                        // 更多功能展开/收起
                        const moreToggle = menu.querySelector('#fl-menu-more-toggle');
                        const moreGroup = menu.querySelector('#fl-menu-more-group');
                        let moreOpen = false;
                        moreToggle.onclick = () => {
                            moreOpen = !moreOpen;
                            moreGroup.style.display = moreOpen ? 'block' : 'none';
                            moreToggle.textContent = moreOpen ? '▲ 收起更多' : '⋯ 更多功能';
                        };
                        // 只在菜单内按钮点击时关闭菜单
                        const closeMenu = () => { menu.remove(); };
                        // 主功能事件
                        document.getElementById('fl-menu-generateShare')?.addEventListener('click', () => { closeMenu(); if(typeof coreLogic!== 'undefined' && coreLogic.generateShareLink) coreLogic.generateShareLink(); });
                        document.getElementById('fl-menu-receiveDirect')?.addEventListener('click', () => { closeMenu(); uiManager.showModal("📥 文件转存/粘贴链接", "", 'inputLink'); });
                        // 更多功能事件
                        menu.querySelector('#fl-menu-generateFromPublicShare')?.addEventListener('click', () => { closeMenu(); uiManager.showModal("🌐 从分享链接中生成链接", "", 'inputPublicShare'); });
                        menu.querySelector('#fl-menu-generateFromPublicShareBatch')?.addEventListener('click', () => { closeMenu(); uiManager.showModal("🌐 批量生成", "", 'inputPublicShareBatch'); });
                        menu.querySelector('#fl-menu-splitJsonFile')?.addEventListener('click', () => { closeMenu(); uiManager.showModal("✂️ 拆分工具", "", 'splitJsonTool'); });
                        menu.querySelector('#fl-menu-convert123Share')?.addEventListener('click', () => {
                            closeMenu();
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = '.123share,.json';
                            input.onchange = async (event) => {
                                const file = event.target.files[0];
                                if (!file) return;
                                try {
                                    const content = await file.text();
                                    if (file.name.endsWith('.123share')) {
                                        const jsonData = convert123ShareToJson(content);
                                        const a = document.createElement('a');
                                        a.href = URL.createObjectURL(new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' }));
                                        a.download = file.name.replace('.123share', '.json');
                                        a.click();
                                        URL.revokeObjectURL(a.href);
                                    } else if (file.name.endsWith('.json')) {
                                        const jsonData = JSON.parse(content);
                                        const shareContent = convertJsonTo123Share(jsonData);
                                        const a = document.createElement('a');
                                        a.href = URL.createObjectURL(new Blob([shareContent], { type: 'text/plain' }));
                                        a.download = file.name.replace('.json', '.123share');
                                        a.click();
                                        URL.revokeObjectURL(a.href);
                                    } else {
                                        alert("❌ 请上传 .123share 或 .json 文件！");
                                    }
                                } catch (e) {
                                    alert("❌ 处理文件出错：" + e.message);
                                }
                            };
                            input.click();
                        });
                        menu.querySelector('#fl-menu-filterSettings')?.addEventListener('click', () => { closeMenu(); uiManager.showModal("🔍 元数据过滤设置", "", 'filterSettings'); });
                        menu.querySelector('#fl-menu-settings')?.addEventListener('click', () => { closeMenu(); uiManager.showSettingsDialog(); });
                    };
                    sidebarMenu.appendChild(fastLinkItem);
                    clearInterval(checkInterval);
                }
            }, 1000);
        }
        // === 集成FastLink到左侧菜单栏 END ===

        // 添加测试函数
        function testMultiLevelDirectoryTransfer() {
            console.log(`[${SCRIPT_NAME}] 开始测试多级目录转存功能...`);

            // 创建测试数据
            const testFiles = [
                {
                    fileName: "level1/level2/level3/level4/level5/test1.txt",
                    etag: "test_etag_1",
                    size: "1024"
                },
                {
                    fileName: "level1/level2/level3/level4/level5/level6/test2.txt",
                    etag: "test_etag_2",
                    size: "2048"
                },
                {
                    fileName: "level1/level2/level3/level4/level5/level6/level7/level8/test3.txt",
                    etag: "test_etag_3",
                    size: "3072"
                },
                {
                    fileName: "deep/nested/folder/structure/with/many/levels/and/files/test4.txt",
                    etag: "test_etag_4",
                    size: "4096"
                }
            ];

            console.log(`[${SCRIPT_NAME}] 测试文件数据:`, testFiles);
            console.log(`[${SCRIPT_NAME}] 测试包含最多10级目录结构`);

            // 显示测试信息
            uiManager.showAlert(`🧪 多级目录转存测试\n\n测试文件包含:\n- 5级目录: test1.txt\n- 6级目录: test2.txt\n- 8级目录: test3.txt\n- 10级目录: test4.txt\n\n请使用转存功能测试这些文件路径`, 5000);

            return testFiles;
        }

        // 添加调试函数
        function debugFolderCache() {
            console.log(`[${SCRIPT_NAME}] 当前文件夹缓存:`, folderCache);
            return folderCache;
        }

        // 添加清除缓存函数
        function clearFolderCache() {
            folderCache = {};
            console.log(`[${SCRIPT_NAME}] 文件夹缓存已清除`);
            uiManager.showAlert("🗑️ 文件夹缓存已清除", 2000);
        }

        // 将测试函数添加到全局作用域
        window.testMultiLevelDirectoryTransfer = testMultiLevelDirectoryTransfer;
        window.debugFolderCache = debugFolderCache;
        window.clearFolderCache = clearFolderCache;

        console.log(`[${SCRIPT_NAME}] 多级目录转存功能已优化，调试模式已启用`);
        console.log(`[${SCRIPT_NAME}] 使用方法: 在浏览器控制台运行以下命令:`);
        console.log(`[${SCRIPT_NAME}] - testMultiLevelDirectoryTransfer() - 获取测试数据`);
        console.log(`[${SCRIPT_NAME}] - debugFolderCache() - 查看当前缓存`);
        console.log(`[${SCRIPT_NAME}] - clearFolderCache() - 清除缓存`);

        "use strict";

    const utils = {
        getCachedCookie() {
            return GM_getValue("quark_cookie", "");
        },

        saveCookie(cookie) {
            GM_setValue("quark_cookie", cookie);
        },

        getCookie(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(";").shift();
            return null;
        },

        showCookieInputDialog(onSave, currentCookie = "") {
            const dialog = document.createElement("div");
            dialog.id = "quark-cookie-input-dialog";
            dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;">
          <div style="background: white; padding: 30px; border-radius: 8px; width: 80%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column;">
            <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">设置夸克网盘Cookie</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 15px;">
              请打开浏览器开发者工具(F12) → Network → 找到任意请求 → 复制完整的Cookie值<br/>
              <strong>必须包含：__puus、__pus、ctoken 等关键Cookie</strong>
            </div>
            <textarea id="quark-cookie-input"
              placeholder="粘贴完整的Cookie字符串，例如：ctoken=xxx; __puus=xxx; __pus=xxx; ..."
              style="flex: 1; min-height: 200px; padding: 10px; border: 1px solid #d9d9d9; border-radius: 4px; font-family: monospace; font-size: 12px; resize: vertical;">${currentCookie}</textarea>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 15px;">
              <button id="quark-cookie-save-btn" style="padding: 8px 20px; background: #0d53ff; color: white; border: none; border-radius: 4px; cursor: pointer;">保存</button>
              <button id="quark-cookie-cancel-btn" style="padding: 8px 20px; background: #d9d9d9; color: #333; border: none; border-radius: 4px; cursor: pointer;">取消</button>
            </div>
          </div>
        </div>
      `;
            document.body.appendChild(dialog);

            document.getElementById("quark-cookie-save-btn").onclick = () => {
                const cookie = document
                    .getElementById("quark-cookie-input")
                    .value.trim();
                if (!cookie) {
                    alert("Cookie不能为空");
                    return;
                }
                this.saveCookie(cookie);
                dialog.remove();
                GM_notification({
                    text: "Cookie已保存",
                    timeout: 2000,
                });
                if (onSave) {
                    onSave(cookie);
                }
            };

            document.getElementById("quark-cookie-cancel-btn").onclick = () => {
                dialog.remove();
            };
        },

        sleep(ms) {
            return new Promise((resolve) => setTimeout(resolve, ms));
        },

        findReact(dom, traverseUp = 0) {
            let key = Object.keys(dom).find((key) => {
                return (
                    key.startsWith("__reactFiber$") ||
                    key.startsWith("__reactInternalInstance$")
                );
            });

            let domFiber = dom[key];

            if (domFiber == null) {
                return null;
            }

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = (fiber) => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type === "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };

            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }

            return compFiber.stateNode || compFiber;
        },

        findVue(dom, traverseUp = 0) {
            let i = 0;
            let el = dom;
            while (i < traverseUp) {
                if (!el) return null;
                el = el.parentElement;
                i++;
            }
            return el?.__vue__;
        },

        getCurrentPath() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const dirFid = urlParams.get("dir_fid");

                if (!dirFid || dirFid === "0") {
                    return "";
                }

                const breadcrumb = document.querySelector(".breadcrumb-list");
                if (breadcrumb) {
                    const items = breadcrumb.querySelectorAll(".breadcrumb-item");
                    const pathParts = [];

                    for (let i = 1; i < items.length; i++) {
                        const text = items[i].textContent.trim();
                        if (text) {
                            pathParts.push(text);
                        }
                    }

                    return pathParts.join("/");
                }

                return "";
            } catch (e) {
                return "";
            }
        },

        getSelectedList() {
            try {
                const fileListDom = document.getElementsByClassName("file-list")[0];

                if (!fileListDom) {
                    return [];
                }

                const reactObj = this.findReact(fileListDom);

                const props = reactObj?.props;

                if (props) {
                    const fileList = props.list || [];
                    const selectedKeys = props.selectedRowKeys || [];

                    const selectedList = [];
                    fileList.forEach(function (val) {
                        if (selectedKeys.includes(val.fid)) {
                            selectedList.push(val);
                        }
                    });

                    return selectedList;
                }

                return [];
            } catch (e) {
                return [];
            }
        },

        post(url, data, headers = {}) {
            return new Promise((resolve, reject) => {
                const requestData = JSON.stringify(data);
                const QUARK_UA =
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/2.5.20 Chrome/100.0.4896.160 Electron/18.3.5.4-b478491100 Safari/537.36 Channel/pckk_other_ch";
                const defaultHeaders = {
                    "Content-Type": "application/json;charset=utf-8",
                    "User-Agent": QUARK_UA,
                    Origin: location.origin,
                    Referer: `${location.origin}/`,
                    Dnt: "",
                    "Cache-Control": "no-cache",
                    Pragma: "no-cache",
                    Expires: "0",
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: url,
                    headers: {...defaultHeaders, ...headers},
                    data: requestData,
                    onload: function (response) {
                        try {
                            const result = JSON.parse(response.responseText);
                            resolve(result);
                        } catch (e) {
                            reject(new Error("响应解析失败"));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error("网络请求失败"));
                    },
                });
            });
        },

        get(url, headers = {}) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    headers: headers,
                    onload: function (response) {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(response.responseText);
                        } else {
                            reject(new Error(`请求失败: ${response.status}`));
                        }
                    },
                    onerror: function (error) {
                        reject(new Error("网络请求失败"));
                    },
                });
            });
        },

        async getFolderFiles(folderId, folderPath = "", onProgress) {
            const API_URL =
                "https://drive-pc.quark.cn/1/clouddrive/file/sort?pr=ucpro&fr=pc";
            const allFiles = [];
            let page = 1;
            const pageSize = 50;

            while (true) {
                const url = `${API_URL}&pdir_fid=${folderId}&_page=${page}&_size=${pageSize}&_fetch_total=1&_fetch_sub_dirs=0&_sort=file_type:asc,updated_at:desc`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result?.code !== 0 || !result?.data?.list) {
                    break;
                }

                const items = result.data.list;
                for (const item of items) {
                    const itemPath = folderPath
                        ? `${folderPath}/${item.file_name}`
                        : item.file_name;

                    if (item.dir) {
                        const subFiles = await this.getFolderFiles(
                            item.fid,
                            itemPath,
                            onProgress,
                        );
                        allFiles.push(...subFiles);
                    } else if (item.file) {
                        allFiles.push({...item, path: itemPath});
                        if (onProgress) {
                            onProgress();
                        }
                    }
                }

                if (items.length < pageSize) {
                    break;
                }
                page++;
            }

            return allFiles;
        },

        async getShareFolderFiles(shareId, stoken, folderId, folderPath = "") {
            const allFiles = [];
            let page = 1;
            const pageSize = 100;

            while (true) {
                const url = `https://pc-api.uc.cn/1/clouddrive/share/sharepage/detail?pwd_id=${shareId}&stoken=${encodeURIComponent(
                    stoken,
                )}&pdir_fid=${folderId}&_page=${page}&_size=${pageSize}&pr=ucpro&fr=pc`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            Referer: "https://pan.quark.cn/",
                        },
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result?.code !== 0 || !result?.data?.list) {
                    break;
                }

                const items = result.data.list;
                for (const item of items) {
                    const itemPath = folderPath
                        ? `${folderPath}/${item.file_name}`
                        : item.file_name;

                    if (item.dir) {
                        const subFiles = await this.getShareFolderFiles(
                            shareId,
                            stoken,
                            item.fid,
                            itemPath,
                        );
                        allFiles.push(...subFiles);
                    } else if (item.file) {
                        allFiles.push({...item, path: itemPath});
                    }
                }

                if (items.length < pageSize) {
                    break;
                }
                page++;
            }

            return allFiles;
        },

        async getShareToken(shareId, passcode = "", cookie = "") {
            const API_URL = "https://pc-api.uc.cn/1/clouddrive/share/sharepage/token";

            try {
                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "POST",
                        url: API_URL,
                        headers: {
                            "Content-Type": "application/json",
                            Cookie: cookie,
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                            Referer: "https://pan.quark.cn/",
                        },
                        data: JSON.stringify({
                            pwd_id: shareId,
                            passcode: passcode,
                        }),
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result?.code === 31001) {
                    throw new Error("请先登录网盘");
                }
                if (result?.code !== 0) {
                    throw new Error(
                        `获取token失败，代码：${result.code}，消息：${result.message}`,
                    );
                }

                return {
                    stoken: result.data.stoken,
                    title: result.data.title || ""
                };
            } catch (error) {
                throw error;
            }
        },

        async getFilesWithMd5(fileList, onProgress) {
            const API_URL =
                "https://drive.quark.cn/1/clouddrive/file/download?pr=ucpro&fr=pc";
            const BATCH_SIZE = 15;

            const data = [];
            let processed = 0;
            const validFiles = fileList.filter((item) => item.file === true);

            const pathMap = {};
            validFiles.forEach((file) => {
                pathMap[file.fid] = file.path;
            });

            for (let i = 0; i < validFiles.length; i += BATCH_SIZE) {
                const batch = validFiles.slice(i, i + BATCH_SIZE);
                const fids = batch.map((item) => item.fid);

                try {
                    const result = await this.post(API_URL, {fids});

                    if (result?.code === 31001) {
                        throw new Error("请先登录网盘");
                    }
                    if (result?.code !== 0) {
                        throw new Error(
                            `获取链接失败，代码：${result.code}，消息：${result.message}`,
                        );
                    }

                    if (result?.data) {
                        const filesWithPath = result.data.map((file) => {
                            const newFile = {
                                ...file,
                                path: pathMap[file.fid] || file.file_name,
                            };

                            let md5 = newFile.md5 || newFile.hash || newFile.etag || "";
                            md5 = this.decodeMd5(md5);

                            if (md5) {
                                newFile.md5 = md5;
                            }

                            return newFile;
                        });
                        data.push(...filesWithPath);
                    }

                    processed += batch.length;
                    if (onProgress) {
                        onProgress(processed, validFiles.length);
                    }

                    await this.sleep(1000);
                } catch (error) {
                    throw error;
                }
            }

            return data;
        },

        async scanQuarkShareFiles(
            shareId,
            stoken,
            cookie,
            parentFileId = 0,
            path = "",
            recursive = true
        ) {
            const fileItems = [];
            let page = 1;

            while (true) {
                const url = `https://pc-api.uc.cn/1/clouddrive/share/sharepage/detail?pwd_id=${shareId}&stoken=${encodeURIComponent(
                    stoken,
                )}&pdir_fid=${parentFileId}&_page=${page}&_size=100&pr=ucpro&fr=pc`;

                const result = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: "GET",
                        url: url,
                        headers: {
                            Cookie: cookie,
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0",
                            Referer: "https://pan.quark.cn/",
                        },
                        onload: function (response) {
                            try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                reject(new Error("响应解析失败"));
                            }
                        },
                        onerror: () => reject(new Error("网络请求失败")),
                    });
                });

                if (result.code !== 0 || !result.data?.list) break;

                for (const item of result.data.list) {
                    const itemPath = path ? `${path}/${item.file_name}` : item.file_name;

                    if (item.dir) {
                        if (recursive) {
                            const subFiles = await this.scanQuarkShareFiles(
                                shareId,
                                stoken,
                                cookie,
                                item.fid,
                                itemPath,
                                true
                            );
                            fileItems.push(...subFiles);
                        }
                    } else {
                        fileItems.push({
                            fid: item.fid,
                            token: item.share_fid_token,
                            name: item.file_name,
                            size: item.size,
                            path: itemPath,
                        });
                    }
                }

                if (result.data.list.length < 100) break;
                page++;
            }

            return fileItems;
        },

        async batchGetShareFilesMd5(
            shareId,
            stoken,
            cookie,
            fileItems,
            onProgress,
        ) {
            const md5Map = {};
            const batchSize = 10;
            let totalProcessed = 0;


            for (let i = 0; i < fileItems.length; i += batchSize) {
                const batch = fileItems.slice(i, i + batchSize);
                const fids = batch.map((item) => item.fid);
                const tokens = batch.map((item) => item.token);


                try {
                    const requestBody = {
                        fids,
                        pwd_id: shareId,
                        stoken,
                        fids_token: tokens,
                    };


                    const md5Result = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "POST",
                            url: `https://pc-api.uc.cn/1/clouddrive/file/download?pr=ucpro&fr=pc&uc_param_str=&__dt=${Math.floor(Math.random() * 4 + 1) * 60 * 1000}&__t=${Date.now()}`,
                            headers: {
                                "Content-Type": "application/json",
                                Cookie: cookie,
                                "User-Agent":
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) quark-cloud-drive/3.14.2 Chrome/112.0.5615.165 Electron/24.1.3.8 Safari/537.36 Channel/pckk_other_ch",
                                Referer: "https://pan.quark.cn/",
                                Accept: "application/json, text/plain, */*",
                                Origin: "https://pan.quark.cn",
                            },
                            data: JSON.stringify(requestBody),
                            onload: function (response) {
                                try {
                                    const parsed = JSON.parse(response.responseText);
                                    resolve(parsed);
                                } catch (e) {
                                    resolve({code: -1, message: "解析失败"});
                                }
                            },
                            onerror: (error) => {
                                resolve({code: -1, message: "网络错误"});
                            },
                        });
                    });


                    if (md5Result.code === 0 && md5Result.data) {
                        const dataList = Array.isArray(md5Result.data)
                            ? md5Result.data
                            : [md5Result.data];

                        dataList.forEach((item, idx) => {
                            const fid = fids[idx];
                            if (!fid) return;

                            let md5 = item.md5 || item.hash || "";
                            md5 = utils.decodeMd5(md5);

                            md5Map[fid] = md5;
                        });
                    } else {
                        fids.forEach((fid) => (md5Map[fid] = ""));
                    }
                } catch (e) {
                    fids.forEach((fid) => (md5Map[fid] = ""));
                }

                totalProcessed += batch.length;
                if (onProgress) {
                    onProgress(totalProcessed, fileItems.length);
                }

                await this.sleep(1000);
            }

            return md5Map;
        },

        generateRapidTransferJson(filesData, commonPath = "") {
            const files = filesData.map((file) => ({
                path: file.path || file.file_name,
                etag: (file.etag || file.md5 || "").toLowerCase(),
                size: file.size,
            }));

            const totalSize = files.reduce((sum, f) => sum + f.size, 0);

            // 确保commonPath以"/"结尾
            const formattedCommonPath = commonPath ? (commonPath.endsWith("/") ? commonPath : commonPath + "/") : "";

            return {
                scriptVersion: "3.0.3",
                exportVersion: "1.0",
                usesBase62EtagsInExport: true,
                commonPath: formattedCommonPath,
                files: files,
                totalFilesCount: files.length,
                totalSize: totalSize,
            };
        },

        generateRapidTransferLink(filesData, commonPath = "") {
            const files = filesData.map((file) => ({
                path: file.path || file.file_name,
                etag: (file.etag || file.md5 || "").toLowerCase(),
                size: file.size,
            }));

            // 使用与导入端相同的基于BigInt的Base62编码实现
            const toBase62 = (hex) => {
                const alphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                if (!hex) return '';

                // 将十六进制字符串转换为BigInt
                const bigIntValue = BigInt('0x' + hex);
                if (bigIntValue === 0n) return alphabet[0];

                let result = '';
                let n = bigIntValue;
                while (n > 0n) {
                    result = alphabet[Number(n % 62n)] + result;
                    n = n / 62n;
                }
                return result;
            };

            const prefix = "123FLCPV2$";
            const delimiter = "%";

            // 如果有commonPath，则需要调整文件路径，而不是直接拼接在链接前缀后面
            const fileParts = files.map(f => {
                const base62Etag = toBase62(f.etag);
                // 如果有commonPath，确保文件路径是相对路径，不包含commonPath
                let filePath = f.path;
                if (commonPath && filePath.startsWith(commonPath)) {
                    filePath = filePath.slice(commonPath.length);
                }
                return `${base62Etag}#${f.size}#${filePath}`;
            });

            // commonPath应该只在需要时添加，且格式为prefix + commonPath + delimiter
            // 但当commonPath与文件名相同时（单个文件分享），应该使用默认的prefix + delimiter
            const link = prefix + (commonPath && fileParts.length > 1 ? commonPath : "") + delimiter + fileParts.join("$");
            return link;
        },

        generateNative123Format(filesData, commonPath = "") {
            const files = filesData.map((file) => ({
                path: file.path || file.file_name,
                etag: (file.etag || file.md5 || "").toLowerCase(),
                size: file.size,
            }));

            const lines = files.map(f => {
                const fullPath = commonPath ? (commonPath + f.path) : f.path;
                return `${f.etag}#${f.size}#${fullPath}`;
            });

            return lines.join("\n");
        },

        showLoadingDialog(title, message) {
            const existingDialog = document.getElementById(
                "quark-json-loading-dialog",
            );
            if (existingDialog) {
                existingDialog.remove();
            }

            const dialog = document.createElement("div");
            dialog.id = "quark-json-loading-dialog";
            dialog.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 30px; border-radius: 8px; min-width: 350px; text-align: center;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">${title}</div>
                        <div id="quark-json-loading-message" style="font-size: 14px; color: #666; margin-bottom: 10px;">${message}</div>
                        <div id="quark-json-loading-detail" style="font-size: 12px; color: #999; margin-bottom: 10px; min-height: 18px;"></div>
                        <div style="margin-top: 15px;">
                            <div style="width: 100%; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                                <div id="quark-json-progress-bar" style="width: 0%; height: 100%; background: linear-gradient(90deg, #0d53ff, #52c41a); transition: width 0.3s;"></div>
                            </div>
                            <div id="quark-json-progress-text" style="font-size: 13px; color: #666; margin-top: 8px; font-weight: 500;">0%</div>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);
            return dialog;
        },

        updateProgress(processed, total, phase = "获取MD5") {
            const messageEl = document.getElementById("quark-json-loading-message");
            const detailEl = document.getElementById("quark-json-loading-detail");
            const progressBar = document.getElementById("quark-json-progress-bar");
            const progressText = document.getElementById("quark-json-progress-text");

            if (messageEl) {
                messageEl.textContent = `正在${phase}...`;
            }
            if (detailEl) {
                detailEl.textContent = `已处理 ${processed} / ${total} 个文件`;
            }
            if (progressBar) {
                const percent = total > 0 ? ((processed / total) * 100).toFixed(1) : 0;
                progressBar.style.width = `${percent}%`;
            }
            if (progressText) {
                const percent = total > 0 ? ((processed / total) * 100).toFixed(1) : 0;
                progressText.textContent = `${percent}%`;
            }
        },

        updateScanProgress(count) {
            const messageEl = document.getElementById("quark-json-loading-message");
            const detailEl = document.getElementById("quark-json-loading-detail");
            if (messageEl) {
                messageEl.textContent = "正在扫描文件...";
            }
            if (detailEl) {
                detailEl.textContent = `已发现 ${count} 个文件`;
            }
        },

        updateScanComplete(total) {
            const messageEl = document.getElementById("quark-json-loading-message");
            const detailEl = document.getElementById("quark-json-loading-detail");
            if (messageEl) {
                messageEl.textContent = "扫描完成，准备获取MD5...";
            }
            if (detailEl) {
                detailEl.textContent = `共发现 ${total} 个文件`;
            }
        },

        closeLoadingDialog() {
            const dialog = document.getElementById("quark-json-loading-dialog");
            if (dialog) {
                dialog.remove();
            }
        },

        showResultDialog(json, shareTitle = "") {
            let currentData = json;
            let currentMode = 'link'; // 默认显示为秒传链接

            const renderContent = () => {
                const preEl = document.getElementById("quark-json-preview");
                if (!preEl) return;
                if (currentMode === 'json') {
                    preEl.textContent = JSON.stringify(currentData, null, 2);
                } else {
                    const commonPath = currentData.commonPath || "";
                    const link = this.generateRapidTransferLink(currentData.files, commonPath);
                    preEl.textContent = link;
                }
            };

            const checkboxHtml = shareTitle ? `
                <div style="margin-bottom: 15px; padding: 10px; background: #f0f7ff; border-radius: 4px;">
                    <label style="display: flex; align-items: center; cursor: pointer;">
                        <input type="checkbox" id="quark-json-commonpath-checkbox" checked style="margin-right: 8px; width: 16px; height: 16px; cursor: pointer;">
                        <span style="font-size: 14px; color: #333;">设置 使用原文件名：<strong>${shareTitle}</strong></span>
                    </label>
                </div>
            ` : '';

            const dialog = document.createElement("div");
            dialog.innerHTML = `
                <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; display: flex; align-items: center; justify-content: center;">
                    <div style="background: white; padding: 30px; border-radius: 8px; width: 80%; max-width: 800px; max-height: 80vh; display: flex; flex-direction: column;">
                        <div style="font-size: 18px; font-weight: bold; margin-bottom: 15px;">秒传JSON生成成功</div>
                        ${checkboxHtml}
                        <div style="flex: 1; overflow: auto; background: #f5f5f5; padding: 15px; border-radius: 4px; font-family: monospace; font-size: 12px; margin-bottom: 15px;">
                            <pre id="quark-json-preview" style="margin: 0; white-space: pre-wrap; word-wrap: break-word;"></pre>
                        </div>
                        <div style="display: flex; gap: 10px; justify-content: flex-end;">
                            <button id="quark-json-toggle-btn" style="padding: 8px 20px; background: #1890ff; color: white; border: none; border-radius: 4px; cursor: pointer;">显示为JSON</button>
                            <button id="quark-json-copy-btn" style="padding: 8px 20px; background: #ff7b00; color: white; border: none; border-radius: 4px; cursor: pointer;">复制当前内容</button>
                            <button id="quark-json-download-btn" style="padding: 8px 20px; background: #52c41a; color: white; border: none; border-radius: 4px; cursor: pointer;">下载文件</button>
                            <button id="quark-json-close-btn" style="padding: 8px 20px; background: #d9d9d9; color: #333; border: none; border-radius: 4px; cursor: pointer;">关闭</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(dialog);

            // 初始显示 JSON
            renderContent();

            // 切换显示模式
            document.getElementById("quark-json-toggle-btn").onclick = () => {
                if (currentMode === 'json') {
                    currentMode = 'link';
                    document.getElementById("quark-json-toggle-btn").textContent = "显示为JSON";
                } else {
                    currentMode = 'json';
                    document.getElementById("quark-json-toggle-btn").textContent = "显示为秒传链接";
                }
                renderContent();
            };

            // 复制当前内容
            document.getElementById("quark-json-copy-btn").onclick = () => {
                const preEl = document.getElementById("quark-json-preview");
                if (preEl) {
                    GM_setClipboard(preEl.textContent);
                    this.showToast("已复制到剪贴板");
                }
            };

            // 下载 JSON（根据选中的文件/文件夹名称命名）
            document.getElementById("quark-json-download-btn").onclick = () => {
                const jsonStr = JSON.stringify(currentData, null, 2);
                const blob = new Blob([jsonStr], {type: "application/json"});
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;

                // 根据选中的文件/文件夹名称生成文件名
                let filename = "123link.json"; // 默认文件名

                if (shareTitle) {
                    // 对于分享文件，使用分享标题作为文件名
                    filename = shareTitle.replace(/[<>"/\\|?*]/g, '_') + ".json";
                } else if (currentData.files && currentData.files.length > 0) {
                    // 对于个人文件，根据文件列表情况生成文件名
                    if (currentData.files.length === 1) {
                        // 只有一个文件时，使用该文件的名称
                        const singleFile = currentData.files[0];
                        if (singleFile.path) {
                            // 从path中提取文件名（去掉路径部分）
                            const filePath = singleFile.path;
                            const lastSlashIndex = filePath.lastIndexOf('/');
                            const fileName = lastSlashIndex !== -1 ?
                                filePath.substring(lastSlashIndex + 1) :
                                filePath;
                            filename = fileName.replace(/[<>"/\\|?*]/g, '_') + ".json";
                        }
                    } else if (currentData.commonPath) {
                        // 多个文件且有commonPath时，使用commonPath作为文件名
                        let commonPath = currentData.commonPath;
                        // 去除末尾的斜杠（如果有）
                        commonPath = commonPath.endsWith('/') ? commonPath.slice(0, -1) : commonPath;
                        const lastSlashIndex = commonPath.lastIndexOf('/');
                        const folderName = lastSlashIndex !== -1 ?
                            commonPath.substring(lastSlashIndex + 1) :
                            commonPath;
                        filename = folderName.replace(/[<>"/\\|?*]/g, '_') + ".json";
                    } else {
                        // 多个文件且没有commonPath时，使用文件数量作为标识
                        filename = `multiple_files_${currentData.files.length}.json`;
                    }
                }

                a.download = filename;
                a.click();
                URL.revokeObjectURL(url);
                this.showToast("下载已开始");
            };

            // 关闭
            document.getElementById("quark-json-close-btn").onclick = () => {
                dialog.remove();
            };

            // commonPath 复选框逻辑
            if (shareTitle) {
                const newCommonPath = shareTitle + "/";
                currentData = {...json, commonPath: newCommonPath};
                renderContent();

                const checkbox = document.getElementById("quark-json-commonpath-checkbox");
                checkbox.onchange = () => {
                    if (checkbox.checked) {
                        currentData = {...json, commonPath: newCommonPath};
                    } else {
                        currentData = {...json, commonPath: ""};
                    }
                    renderContent();
                };
            }
        },

        showError(message, showCookieButton = false) {
            const dialog = document.createElement("div");
            dialog.id = "quark-json-error-dialog";
            dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
            <div style="background: white; padding: 24px; border-radius: 8px; width: 90%; max-width: 420px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; flex-direction: column; align-items: center;">
                <div style="color: #ff4d4f; margin-bottom: 16px;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
                    </svg>
                </div>
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 8px; color: #333;">操作失败</div>
                <div style="font-size: 14px; color: #555; margin-bottom: 24px; text-align: center; white-space: pre-line;">${message}</div>
                <div style="display: flex; gap: 12px; justify-content: center; width: 100%;">
                    ${showCookieButton ? '<button id="quark-json-error-cookie-btn" style="flex: 1; padding: 10px 20px; background: #0d53ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">修改Cookie</button>' : ""}
                    <button id="quark-json-error-close-btn" style="flex: 1; padding: 10px 20px; background: #f0f0f0; color: #333; border: 1px solid #d9d9d9; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">确定</button>
                </div>
            </div>
        </div>
    `;
            document.body.appendChild(dialog);

            if (showCookieButton) {
                document.getElementById("quark-json-error-cookie-btn").onclick = () => {
                    dialog.remove();
                    this.showCookieInputDialog(null, this.getCachedCookie());
                };
            }

            document.getElementById("quark-json-error-close-btn").onclick = () => {
                dialog.remove();
            };
        },

        showToast(message) {
            const existingToast = document.getElementById("quark-json-toast");
            if (existingToast) {
                existingToast.remove();
            }

            const toast = document.createElement("div");
            toast.id = "quark-json-toast";
            toast.textContent = message;
            toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10002;
            opacity: 0;
            transition: opacity 0.3s ease-in-out, top 0.3s ease-in-out;
        `;

            document.body.appendChild(toast);

            setTimeout(() => {
                toast.style.opacity = "1";
                toast.style.top = "40px";
            }, 10);

            setTimeout(() => {
                toast.style.opacity = "0";
                toast.style.top = "20px";
                setTimeout(() => {
                    toast.remove();
                }, 300);
            }, 2500);
        },

        showUpdateDialog() {
            const version = GM_info.script.version;
            const dialog = document.createElement("div");
            dialog.id = "quark-json-update-dialog";
            dialog.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji';">
            <div style="background: white; padding: 24px; border-radius: 8px; width: 90%; max-width: 500px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <div style="font-size: 20px; font-weight: 600; margin-bottom: 16px; color: #333; text-align: center;">脚本更新 v${version}</div>
                <div style="font-size: 15px; color: #555; margin-bottom: 24px;">
                    <ul style="margin: 0; padding-left: 20px;">
                        <li style="margin-bottom: 10px;"><strong>修复</strong>：修复了夸克网盘个人文件和分享链接中Base64编码的MD5值无法正确解析的问题。</li>
                        <li style="margin-bottom: 10px;"><strong>优化</strong>：将MD5解码逻辑提取为独立工具函数，提高代码可维护性。</li>
                    </ul>
                </div>
                <div style="text-align: center;">
                    <button id="quark-json-update-close-btn" style="padding: 10px 30px; background: #0d53ff; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 500;">我已知晓</button>
                </div>
            </div>
        </div>
    `;
            document.body.appendChild(dialog);

            document.getElementById("quark-json-update-close-btn").onclick = () => {
                dialog.remove();
            };
        },

        parseSize(sizeStr) {
            if (typeof sizeStr === "number") {
                return sizeStr;
            }
            if (typeof sizeStr !== "string") {
                return 0;
            }
            const sizeMatch = sizeStr.match(/^([\d.]+)\s*([a-z]+)/i);
            if (!sizeMatch) {
                const num = parseInt(sizeStr, 10);
                return isNaN(num) ? 0 : num;
            }
            const size = parseFloat(sizeMatch[1]);
            const unit = sizeMatch[2].toUpperCase();
            switch (unit) {
                case "G":
                case "GB":
                    return Math.round(size * 1024 * 1024 * 1024);
                case "M":
                case "MB":
                    return Math.round(size * 1024 * 1024);
                case "K":
                case "KB":
                    return Math.round(size * 1024);
                case "B":
                default:
                    return Math.round(size);
            }
        },

        decodeMd5(md5) {
            if (!md5) {
                return "";
            }

            // 如果是Base64编码的MD5值（包含"=="），尝试解码为十六进制
            if (md5.includes("==")) {
                try {
                    const binaryString = atob(md5);
                    if (binaryString.length === 16) {
                        return Array.from(binaryString, (char) =>
                            char.charCodeAt(0).toString(16).padStart(2, "0"),
                        ).join("");
                    }
                    // 如果解码后的长度不是16字节，可能不是有效的MD5值
                    return md5;
                } catch (e) {
                    // 解码失败，返回原始值
                    return md5;
                }
            }

            // 如果是十六进制格式的MD5值（32位），直接返回
            if (/^[0-9a-fA-F]{32}$/.test(md5)) {
                return md5.toLowerCase();
            }

            // 如果是十六进制格式但可能有其他字符，尝试提取32位十六进制
            const hexMatch = md5.match(/[0-9a-fA-F]{32}/);
            if (hexMatch) {
                return hexMatch[0].toLowerCase();
            }

            // 其他情况，返回原始值
            return md5;
        },
    };

    const tianyiService = {
        getSelectedFiles() {
            try {
                if (typeof unsafeWindow !== "undefined") {
                    let list;
                    if (/\/web\/share/.test(location.href)) {
                        list = unsafeWindow.shareUser?.getSelectedFileList();
                    } else {
                        list = unsafeWindow.file?.getSelectedFileList();
                    }
                    if (list && list.length > 0) {
                        return list;
                    }
                }
            } catch (e) {
                // ignore
            }

            const selectedItems = [];
            let selectedElements = document.querySelectorAll("li.c-file-item-select");

            if (selectedElements.length === 0) {
                const checkedBoxes = document.querySelectorAll(".ant-checkbox-checked");
                if (checkedBoxes.length > 0) {
                    selectedElements = Array.from(checkedBoxes)
                        .map((box) => box.closest("li.c-file-item"))
                        .filter((el) => el);
                }
            }

            if (selectedElements.length === 0) {
                return [];
            }

            selectedElements.forEach((itemEl) => {
                if (itemEl.__vue__) {
                    const vueInstance = itemEl.__vue__;
                    const fileData =
                        vueInstance.fileItem ||
                        vueInstance.fileInfo ||
                        vueInstance.item ||
                        vueInstance.file;
                    if (fileData) {
                        if (
                            !selectedItems.some(
                                (item) => item.fileId === (fileData.id || fileData.fileId),
                            )
                        ) {
                            const normalizedItem = {
                                fileId: fileData.id || fileData.fileId,
                                fileName: fileData.name || fileData.fileName,
                                isFolder: fileData.isFolder || fileData.fileCata === 2,
                                md5: fileData.md5,
                                size: fileData.size,
                            };
                            selectedItems.push(normalizedItem);
                        }
                    }
                }
            });
            return selectedItems;
        },

        async getPersonalFolderFiles(folderId, path = "", onProgress = null) {
            const files = [];
            let pageNum = 1;
            const pageSize = 100;

            while (true) {
                const appKey = "600100422";
                const timestamp = Date.now().toString();
                const urlParams = {
                    folderId: folderId,
                    pageNum: pageNum,
                    pageSize: pageSize,
                    orderBy: "lastOpTime",
                    descending: "true",
                };

                const signParams = {
                    ...urlParams,
                    Timestamp: timestamp,
                    AppKey: appKey,
                };
                const signature = this.get189Signature(signParams);

                const url = `https://cloud.189.cn/api/open/file/listFiles.action?${new URLSearchParams(urlParams)}`;

                const text = await utils.get(url, {
                    Accept: "application/json;charset=UTF-8",
                    "Sign-Type": "1",
                    Signature: signature,
                    Timestamp: timestamp,
                    AppKey: appKey,
                });

                const data = JSON.parse(text);

                if (data.res_code !== 0) break;

                const fileList = data.fileListAO?.fileList || [];
                const folderList = data.fileListAO?.folderList || [];

                if (fileList.length === 0 && folderList.length === 0) break;

                for (const file of fileList) {
                    const filePath = path ? `${path}/${file.name}` : file.name;
                    files.push({
                        path: filePath,
                        etag: (file.md5 || "").toLowerCase(),
                        size: file.size,
                        fileId: file.id,
                    });
                    if (onProgress) onProgress();
                }

                for (const folder of folderList) {
                    const folderPath = path ? `${path}/${folder.name}` : folder.name;
                    const subFiles = await this.getPersonalFolderFiles(
                        folder.id,
                        folderPath,
                        onProgress,
                    );
                    files.push(...subFiles);
                }

                if (fileList.length + folderList.length < pageSize) break;
                pageNum++;
            }
            return files;
        },

        async getBaseShareInfo(shareUrl, sharePwd) {
            let match =
                shareUrl.match(/\/t\/([a-zA-Z0-9]+)/) ||
                shareUrl.match(/[?&]code=([a-zA-Z0-9]+)/);
            if (!match) throw new Error("无效的189网盘分享链接");

            const shareCode = match[1];
            let accessCode = sharePwd || "";

            if (!accessCode) {
                const cookieName = `share_${shareCode}`;
                const cookiePwd = utils.getCookie(cookieName);
                if (cookiePwd) {
                    accessCode = cookiePwd;
                } else {
                    try {
                        const decodedUrl = decodeURIComponent(shareUrl);
                        const pwdMatch = decodedUrl.match(
                            /[（(]访问码[：:]\s*([a-zA-Z0-9]+)/,
                        );
                        if (pwdMatch && pwdMatch[1]) {
                            accessCode = pwdMatch[1];
                        }
                    } catch (e) {
                        /* ignore decoding errors */
                    }
                }
            }

            let shareId = shareCode;

            if (accessCode) {
                const checkUrl = `https://cloud.189.cn/api/open/share/checkAccessCode.action?shareCode=${shareCode}&accessCode=${accessCode}`;
                try {
                    const checkText = await utils.get(checkUrl, {
                        Accept: "application/json;charset=UTF-8",
                        Referer: "https://cloud.189.cn/web/main/",
                    });
                    const checkData = JSON.parse(checkText);
                    if (checkData.shareId) shareId = checkData.shareId;
                } catch (e) {
                    /* ignore */
                }
            }

            const params = {shareCode, accessCode: accessCode};
            const timestamp = Date.now().toString();
            const appKey = "600100422";
            const signData = {...params, Timestamp: timestamp, AppKey: appKey};
            const signature = this.get189Signature(signData);
            const apiUrl = `https://cloud.189.cn/api/open/share/getShareInfoByCodeV2.action?${new URLSearchParams(params)}`;

            const text = await utils.get(apiUrl, {
                Accept: "application/json;charset=UTF-8",
                "Sign-Type": "1",
                Signature: signature,
                Timestamp: timestamp,
                AppKey: appKey,
                Referer: "https://cloud.189.cn/web/main/",
            });

            let data;
            try {
                data = JSON.parse(
                    text.replace(
                        /"(id|fileId|parentId|shareId)":"?(\d{15,})"?/g,
                        '"$1":"$2"',
                    ),
                );
            } catch (e) {
                throw new Error("解析分享信息失败");
            }

            if (data.res_code !== 0) {
                if (data.res_code === 40401 && !accessCode)
                    throw new Error("该分享需要提取码，请输入提取码");
                throw new Error(`获取分享信息失败: ${data.res_message || "未知错误"}`);
            }

            return {
                shareId: data.shareId || shareId,
                shareMode: data.shareMode || "0",
                accessCode: accessCode,
                shareCode: shareCode,
                title: data.fileName || ""
            };
        },

        async get189ShareFiles(
            shareId,
            shareDirFileId,
            fileId,
            path = "",
            shareMode = "0",
            accessCode = "",
            shareCode = "",
            onProgress = null,
        ) {
            const files = [];
            let page = 1;

            while (true) {
                const params = {
                    pageNum: page.toString(),
                    pageSize: "100",
                    fileId: fileId.toString(),
                    shareDirFileId: shareDirFileId.toString(),
                    isFolder: "true",
                    shareId: shareId.toString(),
                    shareMode: shareMode,
                    iconOption: "5",
                    orderBy: "lastOpTime",
                    descending: "true",
                    accessCode: accessCode || "",
                };
                const queryString = new URLSearchParams(params).toString();
                const url = `https://cloud.189.cn/api/open/share/listShareDir.action?${queryString}`;

                const headers = {
                    Accept: "application/json;charset=UTF-8",
                    Referer: "https://cloud.189.cn/web/main/",
                };
                if (shareCode && accessCode) {
                    headers["Cookie"] = `share_${shareCode}=${accessCode}`;
                }

                const text = await utils.get(url, headers);
                let data;
                try {
                    const fixedText = text.replace(
                        /"(id|fileId|parentId|shareId)":(\d{15,})/g,
                        '"$1":"$2"',
                    );
                    data = JSON.parse(fixedText);
                } catch (e) {
                    break;
                }

                if (data.res_code !== 0) {
                    if (data.res_code === "FileNotFound" && path) {
                        console.log(
                            `[189] 警告：子文件夹 "${path}" 访问失败，189网盘分享可能需要登录才能访问子文件夹`,
                        );
                    }
                    break;
                }

                const fileList = data.fileListAO?.fileList || [];
                const folderList = data.fileListAO?.folderList || [];

                for (const file of fileList) {
                    const filePath = path ? `${path}/${file.name}` : file.name;
                    files.push({
                        path: filePath,
                        etag: (file.md5 || "").toLowerCase(),
                        size: file.size,
                    });
                    if (onProgress) onProgress();
                }

                for (const folder of folderList) {
                    const folderPath = path ? `${path}/${folder.name}` : folder.name;
                    const subFiles = await this.get189ShareFiles(
                        shareId,
                        folder.id,
                        folder.id,
                        folderPath,
                        shareMode,
                        accessCode,
                        shareCode,
                        onProgress,
                    );
                    files.push(...subFiles);
                }

                if (fileList.length + folderList.length < 100) {
                    break;
                }
                page++;
            }
            return files;
        },

        parseXMLResponse(xmlText) {
            const getTagValue = (xml, tagName) =>
                xml.match(new RegExp(`<${tagName}>([^<]*)<\/${tagName}>`, "i"))?.[1] ||
                null;
            return {
                res_code: parseInt(getTagValue(xmlText, "res_code") || "0"),
                res_message: getTagValue(xmlText, "res_message") || "",
                shareId: getTagValue(xmlText, "shareId") || "",
                fileId: getTagValue(xmlText, "fileId") || "",
                shareMode: getTagValue(xmlText, "shareMode") || "0",
                isFolder: getTagValue(xmlText, "isFolder") === "true",
                needAccessCode: getTagValue(xmlText, "needAccessCode") || "0",
                fileName: getTagValue(xmlText, "fileName") || "",
            };
        },

        get189Signature(params) {
            const sortedKeys = Object.keys(params).sort();
            const sortedParams = sortedKeys
                .map((key) => `${key}=${params[key]}`)
                .join("&");
            return this.simpleMD5(sortedParams);
        },

        simpleMD5(str) {
            function rotateLeft(value, shift) {
                return (value << shift) | (value >>> (32 - shift));
            }

            function addUnsigned(x, y) {
                const lsw = (x & 0xffff) + (y & 0xffff);
                const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
                return (msw << 16) | (lsw & 0xffff);
            }

            function F(x, y, z) {
                return (x & y) | (~x & z);
            }

            function G(x, y, z) {
                return (x & z) | (y & ~z);
            }

            function H(x, y, z) {
                return x ^ y ^ z;
            }

            function I(x, y, z) {
                return y ^ (x | ~z);
            }

            function FF(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function GG(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function HH(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function II(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
                return addUnsigned(rotateLeft(a, s), b);
            }

            function convertToWordArray(str) {
                const lWordCount = ((str.length + 8) >>> 6) + 1;
                const lMessageLength = lWordCount * 16;
                const lWordArray = new Array(lMessageLength - 1);
                let lBytePosition = 0;
                let lByteCount = 0;
                while (lByteCount < str.length) {
                    const lWordIndex = (lByteCount - (lByteCount % 4)) / 4;
                    lBytePosition = (lByteCount % 4) * 8;
                    lWordArray[lWordIndex] =
                        lWordArray[lWordIndex] |
                        (str.charCodeAt(lByteCount) << lBytePosition);
                    lByteCount++;
                }
                const lWordIndex = (lByteCount - (lByteCount % 4)) / 4;
                lBytePosition = (lByteCount % 4) * 8;
                lWordArray[lWordIndex] =
                    lWordArray[lWordIndex] | (0x80 << lBytePosition);
                lWordArray[lMessageLength - 2] = str.length << 3;
                lWordArray[lMessageLength - 1] = str.length >>> 29;
                return lWordArray;
            }

            function wordToHex(value) {
                let result = "";
                for (let i = 0; i <= 3; i++) {
                    const byte = (value >>> (i * 8)) & 255;
                    result += ("0" + byte.toString(16)).slice(-2);
                }
                return result;
            }

            const x = convertToWordArray(str);
            let a = 0x67452301,
                b = 0xefcdab89,
                c = 0x98badcfe,
                d = 0x10325476;
            const S11 = 7,
                S12 = 12,
                S13 = 17,
                S14 = 22;
            const S21 = 5,
                S22 = 9,
                S23 = 14,
                S24 = 20;
            const S31 = 4,
                S32 = 11,
                S33 = 16,
                S34 = 23;
            const S41 = 6,
                S42 = 10,
                S43 = 15,
                S44 = 21;
            for (let k = 0; k < x.length; k += 16) {
                const AA = a,
                    BB = b,
                    CC = c,
                    DD = d;
                a = FF(a, b, c, d, x[k + 0], S11, 0xd76aa478);
                d = FF(d, a, b, c, x[k + 1], S12, 0xe8c7b756);
                c = FF(c, d, a, b, x[k + 2], S13, 0x242070db);
                b = FF(b, c, d, a, x[k + 3], S14, 0xc1bdceee);
                a = FF(a, b, c, d, x[k + 4], S11, 0xf57c0faf);
                d = FF(d, a, b, c, x[k + 5], S12, 0x4787c62a);
                c = FF(c, d, a, b, x[k + 6], S13, 0xa8304613);
                b = FF(b, c, d, a, x[k + 7], S14, 0xfd469501);
                a = FF(a, b, c, d, x[k + 8], S11, 0x698098d8);
                d = FF(d, a, b, c, x[k + 9], S12, 0x8b44f7af);
                c = FF(c, d, a, b, x[k + 10], S13, 0xffff5bb1);
                b = FF(b, c, d, a, x[k + 11], S14, 0x895cd7be);
                a = FF(a, b, c, d, x[k + 12], S11, 0x6b901122);
                d = FF(d, a, b, c, x[k + 13], S12, 0xfd987193);
                c = FF(c, d, a, b, x[k + 14], S13, 0xa679438e);
                b = FF(b, c, d, a, x[k + 15], S14, 0x49b40821);
                a = GG(a, b, c, d, x[k + 1], S21, 0xf61e2562);
                d = GG(d, a, b, c, x[k + 6], S22, 0xc040b340);
                c = GG(c, d, a, b, x[k + 11], S23, 0x265e5a51);
                b = GG(b, c, d, a, x[k + 0], S24, 0xe9b6c7aa);
                a = GG(a, b, c, d, x[k + 5], S21, 0xd62f105d);
                d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
                c = GG(c, d, a, b, x[k + 15], S23, 0xd8a1e681);
                b = GG(b, c, d, a, x[k + 4], S24, 0xe7d3fbc8);
                a = GG(a, b, c, d, x[k + 9], S21, 0x21e1cde6);
                d = GG(d, a, b, c, x[k + 14], S22, 0xc33707d6);
                c = GG(c, d, a, b, x[k + 3], S23, 0xf4d50d87);
                b = GG(b, c, d, a, x[k + 8], S24, 0x455a14ed);
                a = GG(a, b, c, d, x[k + 13], S21, 0xa9e3e905);
                d = GG(d, a, b, c, x[k + 2], S22, 0xfcefa3f8);
                c = GG(c, d, a, b, x[k + 7], S23, 0x676f02d9);
                b = GG(b, c, d, a, x[k + 12], S24, 0x8d2a4c8a);
                a = HH(a, b, c, d, x[k + 5], S31, 0xfffa3942);
                d = HH(d, a, b, c, x[k + 8], S32, 0x8771f681);
                c = HH(c, d, a, b, x[k + 11], S33, 0x6d9d6122);
                b = HH(b, c, d, a, x[k + 14], S34, 0xfde5380c);
                a = HH(a, b, c, d, x[k + 1], S31, 0xa4beea44);
                d = HH(d, a, b, c, x[k + 4], S32, 0x4bdecfa9);
                c = HH(c, d, a, b, x[k + 7], S33, 0xf6bb4b60);
                b = HH(b, c, d, a, x[k + 10], S34, 0xbebfbc70);
                a = HH(a, b, c, d, x[k + 13], S31, 0x289b7ec6);
                d = HH(d, a, b, c, x[k + 0], S32, 0xeaa127fa);
                c = HH(c, d, a, b, x[k + 3], S33, 0xd4ef3085);
                b = HH(b, c, d, a, x[k + 6], S34, 0x4881d05);
                a = HH(a, b, c, d, x[k + 9], S31, 0xd9d4d039);
                d = HH(d, a, b, c, x[k + 12], S32, 0xe6db99e5);
                c = HH(c, d, a, b, x[k + 15], S33, 0x1fa27cf8);
                b = HH(b, c, d, a, x[k + 2], S34, 0xc4ac5665);
                a = II(a, b, c, d, x[k + 0], S41, 0xf4292244);
                d = II(d, a, b, c, x[k + 7], S42, 0x432aff97);
                c = II(c, d, a, b, x[k + 14], S43, 0xab9423a7);
                b = II(b, c, d, a, x[k + 5], S44, 0xfc93a039);
                a = II(a, b, c, d, x[k + 12], S41, 0x655b59c3);
                d = II(d, a, b, c, x[k + 3], S42, 0x8f0ccc92);
                c = II(c, d, a, b, x[k + 10], S43, 0xffeff47d);
                b = II(b, c, d, a, x[k + 1], S44, 0x85845dd1);
                a = II(a, b, c, d, x[k + 8], S41, 0x6fa87e4f);
                d = II(d, a, b, c, x[k + 15], S42, 0xfe2ce6e0);
                c = II(c, d, a, b, x[k + 6], S43, 0xa3014314);
                b = II(b, c, d, a, x[k + 13], S44, 0x4e0811a1);
                a = II(a, b, c, d, x[k + 4], S41, 0xf7537e82);
                d = II(d, a, b, c, x[k + 11], S42, 0xbd3af235);
                c = II(c, d, a, b, x[k + 2], S43, 0x2ad7d2bb);
                b = II(b, c, d, a, x[k + 9], S44, 0xeb86d391);
                a = addUnsigned(a, AA);
                b = addUnsigned(b, BB);
                c = addUnsigned(c, CC);
                d = addUnsigned(d, DD);
            }
            return (
                wordToHex(a) +
                wordToHex(b) +
                wordToHex(c) +
                wordToHex(d)
            ).toLowerCase();
        },
    };

    async function generateJson() {
        try {
            const hostname = location.hostname;
            const path = location.pathname;

            if (hostname.includes("cloud.189.cn")) {
                if (path.startsWith("/web/main")) {
                    await generateTianyiHomeJson();
                } else {
                    await generateTianyiShareJson();
                }
            } else if (hostname.includes("quark.cn")) {
                const isSharePage = /^\/(s|share)\//.test(path);
                if (isSharePage) {
                    await generateShareJson();
                } else {
                    await generateHomeJson();
                }
            }
        } catch (error) {
            utils.closeLoadingDialog();
            utils.showError(error.message || "生成JSON失败");
        }
    }

    async function generateTianyiShareJson() {
        utils.showLoadingDialog("正在扫描文件", "准备中...");

        try {
            const selectedFiles = tianyiService.getSelectedFiles();

            if (selectedFiles.length === 0) {
                utils.closeLoadingDialog();
                utils.showError("请先勾选要生成JSON的文件或文件夹");
                return;
            }

            const shareUrl = window.location.href;
            let sharePwd = "";

            const allFiles = [];
            let itemsProcessed = 0;
            let filesFound = 0;

            const onProgress = () => {
                filesFound++;
                utils.updateScanProgress(filesFound);
            };

            utils.updateProgress(0, selectedFiles.length, "扫描文件");
            utils.updateScanProgress(0);

            const {shareId, shareMode, accessCode, shareCode, title} =
                await tianyiService.getBaseShareInfo(shareUrl, sharePwd);

            for (const item of selectedFiles) {
                if (item.isFolder) {
                    const folderPath = item.fileName;
                    const subFiles = await tianyiService.get189ShareFiles(
                        shareId,
                        item.fileId,
                        item.fileId,
                        folderPath,
                        shareMode,
                        accessCode,
                        shareCode,
                        onProgress,
                    );
                    allFiles.push(...subFiles);
                } else {
                    allFiles.push({
                        path: item.fileName,
                        etag: (item.md5 || "").toLowerCase(),
                        size: item.size,
                    });
                    onProgress();
                }
                itemsProcessed++;
                utils.updateProgress(itemsProcessed, selectedFiles.length, "扫描文件");
            }

            utils.updateScanComplete(allFiles.length);
            await utils.sleep(300);

            // 根据选中文件类型设置正确的commonPath和文件名
            let useCommonPath = "";
            let fileName = "";

            if (selectedFiles.length === 1) {
                if (selectedFiles[0].isFolder) {
                    // 单个文件夹时，使用文件夹名称作为commonPath和文件名
                    useCommonPath = selectedFiles[0].fileName;
                    fileName = selectedFiles[0].fileName;
                } else {
                    // 单个文件时，使用文件名
                    fileName = selectedFiles[0].fileName;
                }
            } else {
                // 多个文件时，使用第一个文件名加上_等后缀来标识多选
                if (selectedFiles.length <= 3) {
                    // 少量文件时，使用前几个文件名拼接
                    fileName = selectedFiles.slice(0, 3).map(f => f.fileName).join('_') + '_等';
                } else {
                    // 多个文件时，使用第一个文件名加_等X个文件
                    fileName = `${selectedFiles[0].fileName}_等${selectedFiles.length}个文件`;
                }
                // 对于多选，仍然使用title作为commonPath
                useCommonPath = title;
            }
            const finalJson = utils.generateRapidTransferJson(allFiles, useCommonPath);
            utils.closeLoadingDialog();
            utils.showResultDialog(finalJson, fileName);
        } catch (error) {
            utils.closeLoadingDialog();
            utils.showError(error.message || "生成JSON失败");
        }
    }

    async function generateTianyiHomeJson() {
        utils.showLoadingDialog("正在扫描文件", "准备中...");

        try {
            const selectedFiles = tianyiService.getSelectedFiles();
            if (selectedFiles.length === 0) {
                utils.closeLoadingDialog();
                utils.showError("请先勾选要生成JSON的文件或文件夹");
                return;
            }

            const allFiles = [];
            let filesFound = 0;
            const onProgress = () => {
                filesFound++;
                utils.updateScanProgress(filesFound);
            };
            utils.updateScanProgress(0);

            for (const item of selectedFiles) {
                if (item.isFolder) {
                    const subFiles = await tianyiService.getPersonalFolderFiles(
                        item.fileId,
                        item.fileName,
                        onProgress,
                    );
                    allFiles.push(...subFiles);
                } else {
                    allFiles.push({
                        path: item.fileName,
                        size: item.size,
                        fileId: item.fileId,
                        etag: (item.md5 || "").toLowerCase(),
                    });
                    onProgress();
                }
            }

            utils.updateScanComplete(allFiles.length);
            await utils.sleep(300);

            const filesMissingMd5 = allFiles.filter((f) => !f.etag);
            if (filesMissingMd5.length > 0) {
                utils.updateProgress(0, filesMissingMd5.length, "获取MD5");
                let md5Processed = 0;

                for (const file of filesMissingMd5) {
                    try {
                        const details = await tianyiService.getPersonalFileDetails(
                            file.fileId,
                        );
                        file.etag = (details.md5 || "").toLowerCase();
                    } catch (e) {
                        console.error(`获取文件MD5失败: ${file.path}`, e);
                    }
                    md5Processed++;
                    utils.updateProgress(md5Processed, filesMissingMd5.length, "获取MD5");
                    await utils.sleep(100); // 防止请求过快
                }
            }

            // 根据选中文件类型设置正确的commonPath和文件名
            let useCommonPath = "";
            let fileName = "";

            if (selectedFiles.length === 1) {
                if (selectedFiles[0].isFolder) {
                    // 单个文件夹时，使用文件夹名称作为commonPath和文件名
                    useCommonPath = selectedFiles[0].fileName;
                    fileName = selectedFiles[0].fileName;
                } else {
                    // 单个文件时，使用文件名
                    fileName = selectedFiles[0].fileName;
                }
            } else {
                // 多个文件时，使用第一个文件名加上_等后缀来标识多选
                if (selectedFiles.length <= 3) {
                    // 少量文件时，使用前几个文件名拼接
                    fileName = selectedFiles.slice(0, 3).map(f => f.fileName).join('_') + '_等';
                } else {
                    // 多个文件时，使用第一个文件名加_等X个文件
                    fileName = `${selectedFiles[0].fileName}_等${selectedFiles.length}个文件`;
                }
                // 多选时commonPath保持为空
            }
            const finalJson = utils.generateRapidTransferJson(allFiles, useCommonPath);
            utils.closeLoadingDialog();
            utils.showResultDialog(finalJson, fileName);
        } catch (error) {
            utils.closeLoadingDialog();
            utils.showError(error.message || "生成JSON失败");
        }
    }

    async function generateHomeJson() {
        const selectedItems = utils.getSelectedList();

        if (selectedItems.length === 0) {
            utils.showError("请先勾选要生成JSON的文件或文件夹");
            return;
        }

        utils.showLoadingDialog("正在扫描文件", "准备中...");

        const currentPath = utils.getCurrentPath();

        const allFiles = [];
        let totalFilesFound = 0;

        for (const item of selectedItems) {
            if (item.file) {
                const filePath = currentPath
                    ? `${currentPath}/${item.file_name}`
                    : item.file_name;
                allFiles.push({...item, path: filePath});
                totalFilesFound++;
                utils.updateScanProgress(totalFilesFound);
            } else if (item.dir) {
                const folderPath = currentPath
                    ? `${currentPath}/${item.file_name}`
                    : item.file_name;
                const folderFiles = await utils.getFolderFiles(
                    item.fid,
                    folderPath,
                    () => {
                        totalFilesFound++;
                        utils.updateScanProgress(totalFilesFound);
                    },
                );
                allFiles.push(...folderFiles);
            }
        }

        if (allFiles.length === 0) {
            utils.closeLoadingDialog();
            utils.showError("没有找到任何文件");
            return;
        }

        const filesData = await utils.getFilesWithMd5(
            allFiles,
            (processed, total) => {
                utils.updateProgress(processed, total, "获取MD5");
            },
        );

        utils.closeLoadingDialog();

        // 获取当前页面标题，作为commonPath的默认值
        // 根据选择的文件/文件夹类型和数量设置适当的commonPath和文件名
        let useCommonPath = "";
        let fileName = "";

        if (selectedItems.length === 1) {
            // 单个文件或文件夹的情况，使用其名称
            fileName = selectedItems[0].file_name;
            useCommonPath = selectedItems[0].dir ? fileName : "";
        } else {
            // 多个文件时，使用第一个文件名加上_等后缀来标识多选
            if (selectedItems.length <= 3) {
                // 少量文件时，使用前几个文件名拼接
                fileName = selectedItems.slice(0, 3).map(f => f.file_name).join('_') + '_等';
            } else {
                // 多个文件时，使用第一个文件名加_等X个文件
                fileName = `${selectedItems[0].file_name}_等${selectedItems.length}个文件`;
            }
            // 对于多选，仍然可以使用页面标题作为commonPath
            useCommonPath = document.title.replace(/ - 夸克网盘$/, '');
        }

        const json = utils.generateRapidTransferJson(filesData, useCommonPath);
        utils.showResultDialog(json, fileName);
    }

    async function generateShareJson() {
        const selectedItems = utils.getSelectedList();

        if (selectedItems.length === 0) {
            utils.showError("请先勾选要生成JSON的文件或文件夹");
            return;
        }

        const match = location.pathname.match(/\/(s|share)\/([a-zA-Z0-9]+)/);
        if (!match) {
            utils.showError("无法获取分享ID");
            return;
        }
        const shareId = match[2];

        let cookie = utils.getCachedCookie();

        if (!cookie || cookie.length < 10) {
            utils.showCookieInputDialog((newCookie) => {
                setTimeout(() => generateShareJson(), 100);
            });
            return;
        }

        utils.showLoadingDialog("正在扫描文件", "准备中...");

        let title = "";
        try {

            const {stoken, title: shareTitle} = await utils.getShareToken(shareId, "", cookie);
            title = shareTitle;

            const allFileItems = [];
            let totalFilesFound = 0;

            for (const item of selectedItems) {
                if (item.file) {
                    const parentFid = item.pdir_fid;
                    const filesInParent = await utils.scanQuarkShareFiles(
                        shareId,
                        stoken,
                        cookie,
                        parentFid,
                        '',
                        false
                    );
                    const fileInfo = filesInParent.find(f => f.fid === item.fid);

                    if (fileInfo) {
                        const fileItem = {
                            fid: item.fid,
                            token: fileInfo.token,
                            name: item.file_name,
                            size: item.size,
                            path: item.file_name,
                        };
                        allFileItems.push(fileItem);
                    } else {
                        // Fallback to old logic if not found
                        const fileItem = {
                            fid: item.fid,
                            token: item.share_fid_token,
                            name: item.file_name,
                            size: item.size,
                            path: item.file_name,
                        };
                        allFileItems.push(fileItem);
                    }
                    totalFilesFound++;
                    utils.updateScanProgress(totalFilesFound);
                } else if (item.dir) {
                    const folderFiles = await utils.scanQuarkShareFiles(
                        shareId,
                        stoken,
                        cookie,
                        item.fid,
                        item.file_name,
                    );
                    allFileItems.push(...folderFiles);
                    totalFilesFound += folderFiles.length;
                    utils.updateScanProgress(totalFilesFound);
                }
            }


            if (allFileItems.length === 0) {
                utils.closeLoadingDialog();
                utils.showError("没有找到任何文件", true);
                return;
            }

            utils.updateScanComplete(allFileItems.length);
            await utils.sleep(300);

            const md5Map = await utils.batchGetShareFilesMd5(
                shareId,
                stoken,
                cookie,
                allFileItems,
                (processed, total) => {
                    utils.updateProgress(processed, total, "获取分享文件MD5");
                },
            );

            const files = allFileItems.map((item) => ({
                path: item.path,
                etag: (md5Map[item.fid] || "").toLowerCase(),
                size: item.size,
            }));

            // 根据选择的文件/文件夹类型和数量设置适当的commonPath和文件名
            let useCommonPath = "";
            let fileName = "";

            if (selectedItems.length === 1) {
                // 单个文件或文件夹的情况，使用其名称
                fileName = selectedItems[0].file_name;
                useCommonPath = selectedItems[0].dir ? (fileName.endsWith("/") ? fileName : fileName + "/") : "";
            } else {
                // 多个文件时，使用第一个文件名加上_等后缀来标识多选
                if (selectedItems.length <= 3) {
                    // 少量文件时，使用前几个文件名拼接
                    fileName = selectedItems.slice(0, 3).map(f => f.file_name).join('_') + '_等';
                } else {
                    // 多个文件时，使用第一个文件名加_等X个文件
                    fileName = `${selectedItems[0].file_name}_等${selectedItems.length}个文件`;
                }
                // 对于多选，仍然使用分享标题作为commonPath
                useCommonPath = title ? (title.endsWith("/") ? title : title + "/") : "";
            }

            const json = {
                scriptVersion: "3.0.3",
                exportVersion: "1.0",
                usesBase62EtagsInExport: true,
                commonPath: useCommonPath,
                files,
                totalFilesCount: files.length,
                totalSize: files.reduce((sum, f) => sum + f.size, 0),
            };

            utils.closeLoadingDialog();

            utils.showResultDialog(json, fileName);
        } catch (error) {
            utils.closeLoadingDialog();
            const errorMsg = error.message || "生成JSON失败";
            const isCookieError =
                errorMsg.includes("登录") ||
                errorMsg.includes("token") ||
                errorMsg.includes("Cookie") ||
                errorMsg.includes("23018");
            utils.showError(
                errorMsg +
                (isCookieError ? "\n\n可能是Cookie失效，请尝试更新Cookie" : ""),
                isCookieError,
            );
        }
    }

    function addButton() {
        const hostname = location.hostname;
        let container;

        if (document.getElementById("quark-json-generator-btn")) {
            return;
        }

        if (hostname.includes("cloud.189.cn")) {
            const isMainPage = location.pathname.startsWith("/web/main");

            if (isMainPage) {
                container = document.querySelector(
                    '[class*="FileHead_file-head-left"]',
                );
            } else {
                container = document.querySelector(".file-operate");
            }

            if (!container) return;

            const button = document.createElement("a");
            button.id = "quark-json-generator-btn";
            button.className = "btn";
            button.href = "javascript:;";
            button.textContent = "生成JSON";
            if (isMainPage) {
                button.style.cssText =
                    "width: 76px; height: 30px; padding: 0; border-radius: 4px; line-height: 30px; color: #fff; text-align: center; font-size: 12px; background: #52c41a; border: 1px solid #46a219; position: relative; display: block; margin-right: 12px;";
            } else {
                button.style.cssText =
                    "width: 116px; height: 36px; padding: 0; border-radius: 4px; line-height: 36px; color: #fff; text-align: center; font-size: 14px; background: #52c41a; border: 1px solid #46a219; position: relative; display: block;margin-right:20px;";
            }

            container.insertBefore(button, container.firstChild);

            if (!isMainPage) {
                const styleId = "quark-json-flex-style";
                if (!document.getElementById(styleId)) {
                    const style = document.createElement("style");
                    style.id = styleId;
                    style.textContent = `
                  .outlink-box-b .file-operate {
                      display: flex !important;
                      flex-wrap: nowrap !important;
                      justify-content: flex-end !important;
                      align-items: center !important;
                      /* Override conflicting styles */
                      float: none !important;
                      text-align: unset !important;
                  }
                  .btn-save-as{
                  margin-left: 0 !important;
                  }
              `;
                    document.head.appendChild(style);
                }
            }

            button.onclick = generateJson;
        } else if (hostname.includes("quark.cn")) {
            const path = location.pathname;
            const isSharePage = /^\/(s|share)\//.test(path);
            if (isSharePage) {
                container = document.querySelector(".share-btns");
                if (!container) {
                    const alternatives = [
                        ".ant-layout-content .operate-bar",
                        ".share-detail-header .operate-bar",
                        ".share-header-btns",
                        ".share-operate-btns",
                        "[class*='share'][class*='btn']",
                        ".ant-btn-group",
                    ];
                    for (const selector of alternatives) {
                        container = document.querySelector(selector);
                        if (container) break;
                    }
                }
            } else {
                container = document.querySelector(".btn-operate .btn-main");
            }
            if (!container) return;

            const buttonWrapper = document.createElement("div");
            buttonWrapper.id = "quark-json-generator-btn";
            buttonWrapper.className = "ant-dropdown-trigger pl-button-json";

            const isSharePageQuark = /^\/(s|share)\//.test(location.pathname);
            if (isSharePageQuark) {
                buttonWrapper.style.cssText =
                    "display: inline-block; margin-left: 16px;";
                buttonWrapper.innerHTML = `
            <button type="button" class="ant-btn ant-btn-primary" style="background: #52c41a; border-color: #52c41a; height: 40px;">
                <svg style="width: 16px; height: 16px; margin-right: 4px; vertical-align: -3px;" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></svg>
                <span>生成JSON</span>
            </button>`;
                container.appendChild(buttonWrapper);
            } else {
                buttonWrapper.style.cssText =
                    "display: inline-block; margin-right: 16px;";
                buttonWrapper.innerHTML = `
            <div class="ant-upload ant-upload-select ant-upload-select-text">
                <button type="button" class="ant-btn ant-btn-primary" style="background: #52c41a; border-color: #52c41a;">
                    <svg style="width: 16px; height: 16px; margin-right: 4px; vertical-align: -3px;" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2z"/></svg>
                    <span>生成JSON</span>
                </button>
            </div>`;
                container.insertBefore(buttonWrapper, container.firstChild);
            }
            buttonWrapper.querySelector("button").onclick = generateJson;
        }
    }

    function init() {
        const SCRIPT_VERSION = GM_info.script.version;
        const LAST_VERSION = GM_getValue("last_version", "0");

        if (SCRIPT_VERSION > LAST_VERSION) {
            utils.showUpdateDialog();
            GM_setValue("last_version", SCRIPT_VERSION);
        }

        const hostname = location.hostname;
        if (hostname.includes("quark.cn") || hostname.includes("cloud.189.cn")) {
            const observer = new MutationObserver(() => {
                addButton();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });

            addButton();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
    })();
