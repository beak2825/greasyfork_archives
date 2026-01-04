// ==UserScript==
// @name         123FastLink (最新全局悬浮按钮适配新UI)
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  基于@Bao-qing (2025-01-29)，@微風子 (1.3.1)，@Cursor (1.0.6) 版本的分支。最新全局悬浮按钮适配新UI
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
// @downloadURL https://update.greasyfork.org/scripts/542532/123FastLink%20%28%E6%9C%80%E6%96%B0%E5%85%A8%E5%B1%80%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%E9%80%82%E9%85%8D%E6%96%B0UI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542532/123FastLink%20%28%E6%9C%80%E6%96%B0%E5%85%A8%E5%B1%80%E6%82%AC%E6%B5%AE%E6%8C%89%E9%92%AE%E9%80%82%E9%85%8D%E6%96%B0UI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Constants and Configuration ---
    const SCRIPT_NAME = "123FastLink";
    const SCRIPT_VERSION = "1.0.1";
    const debugMode = false; // Add debug mode flag
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
        TARGET_BUTTON_AREA: '.Header_header__A5PFb, .ant-dropdown-trigger.sysdiv.parmiryButton',
        FILE_ROW_SELECTOR: ".ant-table-row.ant-table-row-level-0.editable-row",
        FILE_CHECKBOX_SELECTOR: "input[type='checkbox']"
    };

    const RETRY_AND_DELAY_CONFIG = {
        RATE_LIMIT_ITEM_RETRY_DELAY_MS: 5000,
        RATE_LIMIT_MAX_ITEM_RETRIES: 2,
        RATE_LIMIT_GLOBAL_PAUSE_TRIGGER_FAILURES: 3,
        RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS: 8000,
        GENERAL_API_RETRY_DELAY_MS: 3000,
        GENERAL_API_MAX_RETRIES: 20,
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
        _createFolderInternal: async function(parentId, folderName) { if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) { throw new Error(`创建文件夹 "${folderName}" 失败：父文件夹ID无效 (${parentId})。`); } const requestBody = { driveId: 0, etag: "", fileName: folderName, parentFileId: parseInt(parentId, 10), size: 0, type: 1, NotReuse: true, RequestSource: null, duplicate: 1, event: "newCreateFolder", operateType: 1 }; const responseData = await this.sendRequest("POST", API_PATHS.UPLOAD_REQUEST, {}, requestBody); if (responseData?.data?.Info?.FileId !== undefined) return responseData.data.Info; throw new Error('创建文件夹失败或API响应缺少FileId'); },
        listDirectoryContents: async function(parentId, limit = 100) { return coreLogic._executeApiWithRetries(() => this._listDirectoryContentsInternal(parentId, limit), `列出目录ID: ${parentId}`, coreLogic.currentOperationRateLimitStatus); },
        _listDirectoryContentsInternal: async function(parentId, limit = 100) {
            if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) {
                throw new Error(`无效的文件夹ID: ${parentId}，无法列出内容。`);
            }
            let allItems = [];
            let nextMarker = "0";
            let currentPage = 1;
            let totalItems = 0;

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

            console.log(`[${SCRIPT_NAME}] Retrieved ${totalItems} items (${allItems.length} unique) from directory ${parentId}`);
            return allItems;
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
        _modalStopButtonId: 'fl-modal-stop-btn',
        _modalPauseButtonId: 'fl-modal-pause-btn',
        // Keep track of last known progress to update mini bar instantly if needed
        _lastProgressData: { processed: 0, total: 0, successes: 0, failures: 0, currentFileName: "", extraStatus: "" },
        reset: function() {
            this._userRequestedStop = false;
            this._isPaused = false;
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
        getSelectedFileIds: () => Array.from(document.querySelectorAll(DOM_SELECTORS.FILE_ROW_SELECTOR)).filter(row => (row.querySelector(DOM_SELECTORS.FILE_CHECKBOX_SELECTOR) || {}).checked).map(row => String(row.getAttribute('data-row-key'))).filter(id => id != null),
        getCurrentDirectoryId: () => {
            const url = window.location.href;
            const homeFilePathMatch = url.match(/[?&]homeFilePath=([^&]*)/);
            if (homeFilePathMatch) { let filePathIds = homeFilePathMatch[1]; if (filePathIds && filePathIds !== "") { if (filePathIds.includes(',')) { const idsArray = filePathIds.split(','); return idsArray[idsArray.length - 1]; } else { return filePathIds; } } else { return "0"; } }
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

        _generateLinkProcess: async function(itemFetcherAsyncFn, operationTitleForUI, isBatchMode = false) {
            processStateManager.reset();
            this.currentOperationRateLimitStatus.consecutiveRateLimitFailures = 0;
            let allFileEntriesData = [];
            let processedAnyFolder = false; // This will be set by the itemFetcher callback
            let totalDiscoveredItemsForProgress = 0;
            let itemsProcessedForProgress = 0;
            let successes = 0, failures = 0;
            let jsonDataForExport = null;
            const startTime = Date.now();

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
                } else {
                    if (processStateManager.isStopRequested()) processStateManager.appendInfoMessage(`⚠️ 操作已停止。以下是已处理 ${allFileEntriesData.length} 项的部分链接/数据。`);
                    if (useV2Format) processStateManager.appendInfoMessage('💡 使用V2链接格式 (Base62 ETags) 生成。', true); else processStateManager.appendInfoMessage('ℹ️ 使用V1链接格式 (标准 ETags) 生成。', true);

                    let titleMessage = failures > 0 && successes > 0 ? "🎯 部分成功" : (successes > 0 ? "🎉 生成成功" : "🤔 无有效数据");
                    if (processStateManager.isStopRequested()) titleMessage = "🔴 操作已停止 (部分数据)";

                    let linkText = allFileEntriesData.length < 100 ? link : `成功生成了 ${allFileEntriesData.length} 条链接！\n${link.substring(0, 100)}${link.length > 100 ? '...' : ''}`;

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

        generateShareLink: async function() {
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
            }, "生成秒传链接");
        },

        generateLinkFromPublicShare: async function(shareKey, sharePwd, startParentFileId = "0", isBatchMode = false) {
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
            }, `从分享链接生成 (Key: ${shareKey.substring(0,8)}...)`, isBatchMode);
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

            const initialModalTitle = `⚙️ ${operationTitle}状态 (${filesToProcess.length} 项)`;
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
                        if (folderCache[currentPathForUser]) { parentIdForUserPath = folderCache[currentPathForUser]; continue; }

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
                        folderCache[currentPathForUser] = parentIdForUserPath;
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
                        if (!actualFileName && pathParts.length > 0 && file.fileName.endsWith('/')) { processStateManager.appendErrorMessage(`⚠️ 文件路径 "${file.fileName}" (${formattedFileSize}) 可能表示目录，跳过。`); failures++; permanentlyFailedItems.push({ ...file, error: "路径表示目录" }); continue; }

                        let parentIdForLinkPath = finalRootDirId; // **FIXED**: Link paths are relative to finalRootDirId
                        let currentCumulativeLinkPath = "";

                        for (let j = 0; j < pathParts.length; j++) {
                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                            const part = pathParts[j]; if (!part) continue;
                            currentCumulativeLinkPath = j === 0 ? part : `${currentCumulativeLinkPath}/${part}`;
                            processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${file.fileName} (${formattedFileSize})`, `检查/创建路径: ${currentCumulativeLinkPath}`);

                            const cacheKeyForLinkPath = `link:${currentCumulativeLinkPath}`; // Namespace cache for link paths
                            if (folderCache[cacheKeyForLinkPath]) {
                                parentIdForLinkPath = folderCache[cacheKeyForLinkPath];
                            } else {
                                const dirContents = await apiHelper.listDirectoryContents(parentIdForLinkPath, 500);
                                if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                                const foundFolder = dirContents.find(it => it.Type === 1 && it.FileName === part && it.ParentFileID == parentIdForLinkPath);

                                if (foundFolder && !isNaN(foundFolder.FileID)) {
                                    parentIdForLinkPath = foundFolder.FileID;
                                } else {
                                    processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${file.fileName} (${formattedFileSize})`, `创建文件夹: ${currentCumulativeLinkPath}`);
                                    const createdFolder = await apiHelper.createFolder(parentIdForLinkPath, part);
                                    if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                                    parentIdForLinkPath = parseInt(createdFolder.FileId);
                                }
                                folderCache[cacheKeyForLinkPath] = parentIdForLinkPath;
                                await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 5));
                            }
                        }
                        effectiveParentId = parentIdForLinkPath;
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
            uiManager.updateModalContent(summary);
            if (permanentlyFailedItems.length > 0 && !processStateManager.isStopRequested()) {
                const failuresLogDiv = document.getElementById('fastlink-failures-list'); const permanentFailuresDiv = document.getElementById('fastlink-permanent-failures-log');
                if (failuresLogDiv && permanentFailuresDiv) { failuresLogDiv.innerHTML = ''; permanentlyFailedItems.forEach(pf => { const p = document.createElement('p'); p.style.margin = '2px 0'; p.innerHTML = `📄 <span style="font-weight:bold;">${pf.fileName}</span>: <span style="color:red;">${pf.error || '未知错误'}</span>`; failuresLogDiv.appendChild(p); }); permanentFailuresDiv.style.display = 'block'; }
                const modalInstance = uiManager.getModalElement();
                if (modalInstance) {
                    let buttonsDiv = modalInstance.querySelector('.fastlink-modal-buttons'); if(!buttonsDiv) { buttonsDiv = document.createElement('div'); buttonsDiv.className = 'fastlink-modal-buttons'; modalInstance.querySelector(`#${uiManager.MODAL_CONTENT_ID}`)?.appendChild(buttonsDiv); } buttonsDiv.innerHTML = '';
                    const retryBtn = document.createElement('button'); retryBtn.id = 'fl-m-retry-failed'; retryBtn.className = 'confirm-btn'; retryBtn.textContent = `🔁 重试失败项 (${permanentlyFailedItems.length})`; retryBtn.onclick = () => { this._executeActualFileTransfer(permanentlyFailedItems, isFolderStructureHint, operationTitle + " - 重试", [], targetFolderPath, startIndex, endIndex); }; buttonsDiv.appendChild(retryBtn);
                    const copyLogBtn = document.createElement('button'); copyLogBtn.id = 'fl-m-copy-failed-log'; copyLogBtn.className = 'copy-btn'; copyLogBtn.style.marginLeft = '10px'; copyLogBtn.textContent = '复制问题日志'; copyLogBtn.onclick = () => { const logText = permanentlyFailedItems.map(pf => `文件: ${pf.fileName || (pf.originalEntry&&pf.originalEntry.path)||'未知路径'}\n${(pf.originalEntry&&pf.originalEntry.etag)?('原始ETag: '+pf.originalEntry.etag+'\n'):(pf.etag?'处理后ETag: '+pf.etag+'\n':'')}${(pf.originalEntry&&pf.originalEntry.size)?('大小: '+pf.originalEntry.size+'\n'):(pf.size?'大小: '+pf.size+'\n':'')}错误: ${pf.error||'未知错误'}`).join('\n\n'); GM_setClipboard(logText); uiManager.showAlert("问题文件日志已复制到剪贴板！", 1500); }; buttonsDiv.appendChild(copyLogBtn);
                    const closeBtnModal = document.createElement('button'); closeBtnModal.id = 'fl-m-final-close'; closeBtnModal.className = 'cancel-btn'; closeBtnModal.textContent = '关闭'; closeBtnModal.style.marginLeft = '10px'; closeBtnModal.onclick = () => uiManager.hideModal(); buttonsDiv.appendChild(closeBtnModal);
                }
                 uiManager.enableModalCloseButton(false); // Use custom close button
            } else {
                 uiManager.enableModalCloseButton(true); // Enable original close button
            }
        },

        // =================================================================
        // Gemini 新增：独立的JSON文件拆分逻辑 (重构版) START
        // =================================================================
        splitImportedJsonFile: function(fileContent, originalFileName, splitMethod, config) {
            try {
                const jsonData = JSON.parse(fileContent);
                if (!jsonData || !Array.isArray(jsonData.files)) {
                    uiManager.showError("JSON文件格式无效，缺少 'files' 数组。");
                    return;
                }

                const baseMetadata = { ...jsonData };
                delete baseMetadata.files;
                delete baseMetadata.totalFilesCount;
                delete baseMetadata.totalSize;
                delete baseMetadata.formattedTotalSize;

                const baseFileName = originalFileName.endsWith('.json') ? originalFileName.slice(0, -5) : originalFileName;
                let downloadedCount = 0;

                if (splitMethod === 'byCount') {
                    const chunkSize = config.chunkSize;
                    if (!chunkSize || chunkSize <= 0) {
                        uiManager.showError("请输入有效的正整数作为每个文件的数量。");
                        return;
                    }
                    for (let i = 0; i < jsonData.files.length; i += chunkSize) {
                        const chunkFiles = jsonData.files.slice(i, i + chunkSize);
                        const chunkTotalSize = chunkFiles.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
                        const chunkJsonData = {
                            ...baseMetadata,
                            totalFilesCount: chunkFiles.length,
                            totalSize: chunkTotalSize,
                            formattedTotalSize: formatBytes(chunkTotalSize),
                            files: chunkFiles
                        };
                        uiManager._downloadToFile(JSON.stringify(chunkJsonData, null, 2), `${baseFileName}_part_${downloadedCount + 1}.json`, 'application/json');
                        downloadedCount++;
                    }
                } else if (splitMethod === 'byFolder') {
                    const level = config.level;
                    if (!level || level <= 0) {
                        uiManager.showError("请输入有效的正整数作为目录层级。");
                        return;
                    }

                    const originalCommonPath = (jsonData.commonPath || "").replace(/\/$/, '') + (jsonData.commonPath ? '/' : '');
                    const folders = new Map();

                    jsonData.files.forEach(file => {
                        const pathParts = file.path.split('/').filter(p => p);
                        const groupKey = pathParts.length >= level ? pathParts.slice(0, level).join('/') : '_root_';

                        if (!folders.has(groupKey)) {
                            folders.set(groupKey, []);
                        }
                        folders.get(groupKey).push(file);
                    });

                    for (const [groupKey, filesInGroup] of folders.entries()) {
                        const newCommonPath = groupKey === '_root_' ? originalCommonPath : (originalCommonPath + groupKey + '/');
                        const newFilesArray = filesInGroup.map(originalFile => {
                            const oldRelativePath = originalFile.path;
                            const newRelativePath = groupKey === '_root_' ? oldRelativePath : oldRelativePath.substring(groupKey.length + 1);
                            return { ...originalFile, path: newRelativePath };
                        });

                        const chunkTotalSize = newFilesArray.reduce((sum, file) => sum + (Number(file.size) || 0), 0);
                        const chunkJsonData = {
                            ...baseMetadata,
                            commonPath: newCommonPath,
                            totalFilesCount: newFilesArray.length,
                            totalSize: chunkTotalSize,
                            formattedTotalSize: formatBytes(chunkTotalSize),
                            files: newFilesArray
                        };

                        const sanitizedFolderName = groupKey.replace(/[\/:*?"<>|]/g, '_');
                        uiManager._downloadToFile(JSON.stringify(chunkJsonData, null, 2), `${sanitizedFolderName}.json`, 'application/json');
                        downloadedCount++;
                    }
                }

                if (downloadedCount > 0) {
                    uiManager.showAlert(`拆分完成！已开始下载 ${downloadedCount} 个文件。`, 3000);
                    uiManager.hideModal();
                } else {
                    uiManager.showError("没有可供拆分的文件。请检查文件内容和拆分设置。");
                }

            } catch (e) {
                console.error(`[${SCRIPT_NAME}] JSON 拆分失败:`, e);
                uiManager.showError(`JSON 拆分失败: ${e.message}`);
            }
        }
        // =================================================================
        // Gemini 新增：独立的JSON文件拆分逻辑 (重构版) END
        // =================================================================
    };

    const uiManager = {
        modalElement: null, dropdownMenuElement: null, STYLE_ID: 'fastlink-dynamic-styles', MODAL_CONTENT_ID: 'fastlink-modal-content-area',
        activeModalOperationType: null, modalHideCallback: null,
        miniProgressElement: null, isMiniProgressActive: false, // Added for mini progress

        _downloadToFile: function(content, filename, contentType) { const a = document.createElement('a'); const blob = new Blob([content], { type: contentType }); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); },
        applyStyles: function() {
            const style = document.createElement('style');
            style.textContent = `
                .fastlink-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; width: 500px; max-height: 80vh; display: flex; flex-direction: column; }
                .fastlink-modal-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; text-align: center; }
                .fastlink-modal-content { flex: 1; overflow-y: auto; margin-bottom: 15px; position: relative; }
                .fastlink-modal-buttons { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; }
                .fastlink-modal-buttons button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; }
                .fastlink-modal-buttons button:disabled { opacity: 0.5; cursor: not-allowed; }
                .fastlink-modal-buttons .confirm-btn { background: #4CAF50; color: white; }
                .fastlink-modal-buttons .cancel-btn { background: #f44336; color: white; }
                .fastlink-modal-buttons .copy-btn { background: #2196F3; color: white; }
                .fastlink-modal-buttons .export-btn { background: #FF9800; color: white; }
                .fastlink-modal-buttons .stop-btn { background: #f44336; color: white; }
                .fastlink-modal-buttons .pause-btn { background: #FF9800; color: white; }
                .fastlink-modal-buttons .minimize-btn { background: #9E9E9E; color: white; }
                .fastlink-modal-buttons .close-btn { background: #9E9E9E; color: white; }
                .fastlink-modal-input{width:calc(100% - 16px);padding:8px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px}
                .fastlink-modal-textarea{width:calc(100% - 16px);padding:8px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px;min-height:200px;font-family:monospace;white-space:pre;resize:vertical}
                .fastlink-file-input-container{margin-top:10px;margin-bottom:5px;text-align:left}
                .fastlink-file-input-container label{margin-right:5px;font-size:0.9em;}
                .fastlink-file-input-container input[type="file"]{font-size:0.9em;max-width:250px;}
                .fastlink-progress-container{width:100%;height:10px;background-color:#f0f0f0;border-radius:5px;margin:10px 0 15px;overflow:hidden}
                .fastlink-progress-bar{height:100%;background-color:#1890ff;transition:width .3s ease}
                .fastlink-status{text-align:left;margin-bottom:10px;max-height:150px;overflow-y:auto;border:1px solid #eee;padding:0px;font-size:.9em;position:relative}
                .fastlink-status p:first-child{position:sticky;top:0;background:white;z-index:1;margin:0;padding:3px 0;border-bottom:1px solid #eee}
                .fastlink-status p{margin:3px 0;line-height:1.3}
                .fastlink-stats{display:flex;justify-content:space-between;margin:10px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;padding:5px 0}
                .fastlink-current-file{width:90%;height:81px;margin:0 auto;overflow-y:auto;word-break:break-all;background-color:#f9f9f9;padding:8px;border-radius:4px;border:1px solid #ddd;font-family:monospace;font-size:0.9em;line-height:1.4}
                .error-message{color:#d9534f;font-size:.9em}
                .info-message{color:#28a745;font-size:.9em}
                .fastlink-result{text-align:center}
                .fastlink-result h3{font-size:18px;margin:5px 0 15px}
                .fastlink-result p{margin:8px 0}
                .fastlink-link-text{width:90%;height:81px;margin:0 auto;overflow-y:auto;word-break:break-all;background-color:#f9f9f9;padding:8px;border-radius:4px;border:1px solid #ddd;font-family:monospace;font-size:0.9em;line-height:1.4}
                #fastlink-dropdown-menu-container{position:absolute;background:#fff;border:1px solid #ccc;padding:2px;box-shadow:0 4px 6px rgba(0,0,0,.1);margin-top:5px;z-index:10002 !important;max-height:calc(100vh - 80px);overflow-y:auto;top:100%;left:0;}
                .fastlink-drag-drop-area{border:2px dashed #ccc;padding:20px; text-align:center; transition: border-color .3s ease; font-size: 1.1em; color: #666;}
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
        createDropdownButton: function() {
            const existingButtons = document.querySelectorAll('.fastlink-main-button-container');
            existingButtons.forEach(btn => btn.remove());
            const targetElement = document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA);
            if (targetElement && targetElement.parentNode) {
                const buttonContainer = document.createElement('div');
                buttonContainer.className = 'fastlink-main-button-container ant-dropdown-trigger sysdiv parmiryButton';
                buttonContainer.style.borderRight = '0.5px solid rgb(217, 217, 217)';
                buttonContainer.style.cursor = 'pointer';
                buttonContainer.style.marginLeft = '20px';
                buttonContainer.style.position = 'relative';
                buttonContainer.innerHTML = `<span role="img" aria-label="menu" class="anticon anticon-menu" style="margin-right: 6px;"><svg viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M120 300h720v60H120zm0 180h720v60H120zm0 180h720v60H120z"></path></svg></span> 秒传 `;
                const dropdownMenu = document.createElement('div');
                dropdownMenu.id = 'fastlink-dropdown-menu-container';
                dropdownMenu.style.display = 'none';
                dropdownMenu.style.position = 'absolute';
                dropdownMenu.style.top = 'calc(100% + 5px)';
                dropdownMenu.style.right = '0';
                dropdownMenu.style.zIndex = '1000';
                dropdownMenu.style.minWidth = '200px';
                dropdownMenu.style.whiteSpace = 'nowrap';
                dropdownMenu.innerHTML = `
                    <ul class="ant-dropdown-menu ant-dropdown-menu-root ant-dropdown-menu-vertical ant-dropdown-menu-light" role="menu" tabindex="0" data-menu-list="true" style="border-radius: 10px;">
                        <li id="fastlink-generateShare" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🔗 生成链接 (选中项)</li>
                        <li id="fastlink-generateFromPublicShare" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🌐 从分享链接生成</li>
                        <li id="fastlink-generateFromPublicShareBatch" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">📦 从分享链接批量生成</li>
                        <li class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="separator" style="border-top: 1px solid #eee; margin: 3px 0; padding: 0;"></li>
                        <li id="fastlink-receiveDirect" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">📥 链接/文件转存</li>
                        <li id="fastlink-splitJsonFile" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">✂️ 拆分JSON文件</li>
                        <li class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="separator" style="border-top: 1px solid #eee; margin: 3px 0; padding: 0;"></li>
                        <li id="fastlink-filterSettings" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🔍 元数据过滤设置</li>
                        <li id="fastlink-convert123Share" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🔄 转换.123share文件</li>
                        <li id="fastlink-settings" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">⚙️ 设置</li>
                    </ul>`;
                this.dropdownMenuElement = dropdownMenu;
                buttonContainer.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none'; });
                document.addEventListener('click', (e) => { if (this.dropdownMenuElement && !buttonContainer.contains(e.target) && !this.dropdownMenuElement.contains(e.target)) { if (this.dropdownMenuElement.style.display !== 'none') this.dropdownMenuElement.style.display = 'none'; } });
                dropdownMenu.querySelector('#fastlink-generateShare').addEventListener('click', async (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; await coreLogic.generateShareLink(); });
                dropdownMenu.querySelector('#fastlink-generateFromPublicShare').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("🌐 从分享链接中生成链接", "", 'inputPublicShare'); });
                dropdownMenu.querySelector('#fastlink-generateFromPublicShareBatch').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("🌐 从分享链接批量生成链接", "", 'inputPublicShareBatch'); });
                dropdownMenu.querySelector('#fastlink-receiveDirect').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("📥 文件转存/粘贴链接", "", 'inputLink'); });
                dropdownMenu.querySelector('#fastlink-filterSettings').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("🔍 元数据过滤设置", "", 'filterSettings'); });

                // =================================================================
                // Gemini 新增：为新的拆分工具添加入口 START
                // =================================================================
                dropdownMenu.querySelector('#fastlink-splitJsonFile').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("✂️ 拆分JSON文件", "", 'splitJsonTool'); });
                // =================================================================
                // Gemini 新增：为新的拆分工具添加入口 END
                // =================================================================

                dropdownMenu.querySelector('#fastlink-convert123Share').addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.style.display = 'none';
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = '.123share,.json';
                    input.onchange = async (event) => {
                        const file = event.target.files[0];
                        if (file) {
                            try {
                                const content = await new Promise((resolve, reject) => {
                                    const reader = new FileReader();
                                    reader.onload = (e) => resolve(e.target.result);
                                    reader.onerror = (e) => reject(e);
                                    reader.readAsText(file);
                                });
                                if (file.name.endsWith('.123share')) {
                                    const jsonData = convert123ShareToJson(content);
                                    if (jsonData) {
                                        this._downloadToFile(JSON.stringify(jsonData, null, 2), file.name.replace('.123share', '.json'), 'application/json');
                                        this.showAlert("转换成功！JSON文件已开始下载。");
                                    } else {
                                        this.showError("转换失败：无法解析.123share文件。");
                                    }
                                } else if (file.name.endsWith('.json')) {
                                    // Convert JSON to .123share
                                    try {
                                        const jsonData = JSON.parse(content);
                                        const shareContent = convertJsonTo123Share(jsonData);
                                        if (shareContent) {
                                            this._downloadToFile(shareContent, file.name.replace('.json', '.123share'), 'text/plain');
                                            this.showAlert("转换成功！.123share文件已开始下载。");
                                        } else {
                                            this.showError("转换失败：无法生成.123share文件。");
                                        }
                                    } catch (e) {
                                        this.showError(`转换失败：${e.message}`);
                                    }
                                } else {
                                    this.showError("请选择.123share或.json文件。");
                                }
                            } catch (e) {
                                console.error(`[${SCRIPT_NAME}] Error processing file:`, e);
                                this.showError(`处理文件时发生错误: ${e.message}`);
                            }
                        }
                    };
                    input.click();
                });
                dropdownMenu.querySelector('#fastlink-settings').addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdownMenu.style.display = 'none';
                    this.showSettingsDialog();
                });
                targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling);
                buttonContainer.appendChild(dropdownMenu);
                console.log(`[${SCRIPT_NAME}] 秒传按钮已添加。`);
                return true;
            } else {
                console.warn(`[${SCRIPT_NAME}] 目标按钮区域 '${DOM_SELECTORS.TARGET_BUTTON_AREA}' 未找到。`);
                return false;
            }
        },
        showModal: function(title, content, type = 'info', closable = true, pureLinkForClipboard = null, jsonDataForExport = null, preprocessingFailuresForLog = null) {
            const isOperationalModal = (t) => ['progress_stoppable', 'inputLink', 'inputPublicShare', 'filterSettings', 'showLink', 'splitJsonTool'].includes(t);

            if (this.modalElement && this.activeModalOperationType && this.activeModalOperationType !== type && isOperationalModal(this.activeModalOperationType) && isOperationalModal(type) ) {
                console.log(`[${SCRIPT_NAME}] Hiding active modal ('${this.activeModalOperationType}') for new modal ('${type}').`);
                if (this.modalHideCallback) { this.modalHideCallback(); this.modalHideCallback = null; }
                this.modalElement.style.display = 'none';
            } else if (this.modalElement && type !== 'info' && type !== 'error' && this.activeModalOperationType !== type) { // Avoid hiding info/error for another of same, ensure different op type
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

            let htmlContent = `<div class="fastlink-modal-title">${title}</div><div id="${this.MODAL_CONTENT_ID}" class="fastlink-modal-content">`;
            if (type === 'inputLink') { htmlContent += `<div id="fl-m-drop-area" class="fastlink-drag-drop-area"><textarea id="fl-m-link-input" class="fastlink-modal-input" placeholder="🔗 粘贴秒传链接 或 📂 将文件拖放到此处..." style="min-height: 60px;">${content|| ''}</textarea><div id="fl-m-file-drop-status" style="font-size:0.9em; color:#28a745; margin-top:5px; margin-bottom:5px; min-height:1.2em;"></div><div class="fastlink-file-input-container"><label for="fl-m-file-input">或通过选择文件导入:</label><input type="file" id="fl-m-file-input" accept=".json,.123share" class="fastlink-modal-file-input"></div></div><div class="folder-selector-container"><label for="fl-folder-selector" class="folder-selector-label">目标文件夹路径 (可选):</label><div class="folder-selector-input-container"><input type="text" id="fl-folder-selector" class="folder-selector-input" placeholder="输入目标文件夹路径，如: 电影/漫威"><div id="fl-folder-dropdown" class="folder-selector-dropdown"></div></div><div id="fl-selected-folders" class="folder-tag-container"></div></div><div class="folder-selector-container"><label for="fl-path-prefix" class="folder-selector-label">文件路径前缀过滤 (可选):</label><div class="folder-selector-input-container"><input type="text" id="fl-path-prefix" class="folder-selector-input" placeholder="输入路径前缀，如: 电影/漫威/2023"></div></div><div class="folder-selector-container"><label class="folder-selector-label">文件范围 (可选):</label><div class="folder-selector-input-container" style="display: flex; gap: 10px;"><input type="number" id="fl-start-index" class="folder-selector-input" placeholder="起始序号" min="1" style="width: 100px;"><input type="number" id="fl-end-index" class="folder-selector-input" placeholder="结束序号" min="1" style="width: 100px;"></div></div>`; }
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
                                <label>层数: <input type="number" id="fl-split-level" class="fastlink-modal-input" value="1" min="1" style="width: 60px; display: inline-block; margin-left: 5px;"></label>
                            </span>
                        </div>
                        <div>
                            <label><input type="radio" name="split-method" value="byCount"> 按文件数量拆分</label>
                            <span id="fl-split-chunk-size-container">
                                 <input type="number" id="fl-split-chunk-size" class="fastlink-modal-input" value="500" min="1" style="width: 80px; display: inline-block; margin-left: 10px;">
                                 <span>个文件/份</span>
                            </span>
                        </div>
                    </div>
                `;
            }
            else htmlContent += content;
            htmlContent += `</div><div class="fastlink-modal-buttons">`;
            if (type === 'inputLink') { htmlContent += `<button id="fl-m-confirm" class="confirm-btn">➡️ 转存</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'inputPublicShare') { htmlContent += `<button id="fl-m-generate-public" class="confirm-btn">✨ 生成</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'inputPublicShareBatch') { htmlContent += `<button id="fl-m-generate-public-batch" class="confirm-btn">✨ 批量生成</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'filterSettings') { htmlContent += `<button id="fl-m-save-filters" class="confirm-btn">💾 保存设置</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'showLink') {
                if (pureLinkForClipboard || jsonDataForExport) {
                    htmlContent += `<button id="fl-m-copy" class="copy-btn">📋 复制链接</button>`;
                    if (jsonDataForExport) {
                        htmlContent += `<button id="fl-m-export-json" class="export-btn">📄 导出为JSON</button>`;
                        if (jsonDataForExport.totalFilesCount > 1) {
                           htmlContent += `<button id="fl-m-export-split-json" class="export-btn" style="background-color: #ff5722;" title="将包含多个文件的JSON拆分成数个小文件下载">📄 导出为拆分JSON</button>`;
                        }
                    }
                }
                htmlContent += `<button id="fl-m-cancel" class="close-btn">关闭</button>`;
            }
            else if (type === 'progress_stoppable') { htmlContent += `<button id="${processStateManager.getStopButtonId()}" class="stop-btn">🛑 停止</button><button id="${processStateManager.getPauseButtonId()}" class="pause-btn" style="margin-left: 5px;">⏸️ 暂停</button><button id="fl-m-minimize" class="minimize-btn" style="margin-left: 5px;">最小化</button><button id="fl-m-cancel" class="close-btn" ${processStateManager.isStopRequested() ? '' : 'disabled'}>关闭</button>`; }
            else if (type === 'info_with_buttons' && preprocessingFailuresForLog && preprocessingFailuresForLog.length > 0) { htmlContent += `<button id="fl-m-copy-preprocessing-log" class="copy-btn">📋 复制日志</button><button id="fl-m-cancel" class="close-btn" style="margin-left:10px;">关闭</button>`; }
            else if (type === 'splitJsonTool') {
                htmlContent += `<button id="fl-split-start-btn" class="confirm-btn">🚀 开始拆分</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`;
            }
            else { htmlContent += `<button id="fl-m-cancel" class="close-btn">关闭</button>`; }
            htmlContent += `</div><div class="fastlink-modal-version">v${SCRIPT_VERSION}</div>`;
            this.modalElement.innerHTML = htmlContent; document.body.appendChild(this.modalElement);

            if (isOperationalModal(type)) this.activeModalOperationType = type; else this.activeModalOperationType = null;

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

             if (type === 'inputLink') { const dropArea = this.modalElement.querySelector('#fl-m-drop-area'); const fileInputEl = this.modalElement.querySelector(`#fl-m-file-input`); const linkInputEl = this.modalElement.querySelector('#fl-m-link-input'); const statusDiv = this.modalElement.querySelector('#fl-m-file-drop-status'); if (dropArea && fileInputEl && linkInputEl && statusDiv) { linkInputEl.addEventListener('input', () => { if (linkInputEl.value.trim() !== '') { if (fileInputEl.files && fileInputEl.files.length > 0) fileInputEl.value = ''; statusDiv.textContent = ''; } });
linkInputEl.addEventListener('paste', async (event) => {
    const pastedData = (event.clipboardData || window.clipboardData).getData('text');
    if (!pastedData) return;

    let jsonData;
    let successfullyParsed = false;
    let finalPastedJsonString = pastedData;
    let isAlternativeFormat = false;

    // Display truncated content in input box if it's too long
    if (pastedData.length > 2000) {
        const truncatedContent = pastedData.substring(0, 2000) + '...';
        linkInputEl.value = truncatedContent;
        this.showAlert("JSON内容已截断显示（超过2000字符）", 3000);
    } else {
        linkInputEl.value = pastedData;
    }

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

                // Display truncated content in status if it's too long
                if (content.length > 2000) {
                    const truncatedContent = content.substring(0, 2000) + '...';
                    statusDiv.textContent = `已选择文件: ${file.name}${isAlternativeFormat ? ' (已转换为标准格式)' : ''} (内容已截断显示，超过2000字符)。请点击下方"转存"按钮。`;
                    linkInputEl.value = truncatedContent;
                } else {
                    statusDiv.textContent = `已选择文件: ${file.name}${isAlternativeFormat ? ' (已转换为标准格式)' : ''}。请点击下方"转存"按钮。`;
                    linkInputEl.value = content;
                }
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
fileInputEl.addEventListener('change', () => { if (fileInputEl.files && fileInputEl.files.length > 0) { statusDiv.textContent = `已选中文件: ${fileInputEl.files[0].name}。请点击下方"转存"按钮。`; if(linkInputEl) linkInputEl.value = ''; } else statusDiv.textContent = ''; }); ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false)); ['dragenter', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over-active'), false)); ['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over-active'), false)); dropArea.addEventListener('drop', (e) => {
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

                                    // Display truncated content in status if it's too long
                                    if (content.length > 2000) {
                                        const truncatedContent = content.substring(0, 2000) + '...';
                                        statusDiv.textContent = `已选择文件: ${droppedFile.name}${isAlternativeFormat ? ' (已转换为标准格式)' : ''} (内容已截断显示，超过2000字符)。请点击下方"转存"按钮。`;
                                        linkInputEl.value = truncatedContent;
                                    } else {
                                        statusDiv.textContent = `已选择文件: ${droppedFile.name}${isAlternativeFormat ? ' (已转换为标准格式)' : ''}。请点击下方"转存"按钮。`;
                                        linkInputEl.value = content;
                                    }
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
                                if (settingsManager.get('useFolderNameForJson')) {
                                    const firstPathSegment = (result.jsonData.commonPath || '').split('/')[0];
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
                                    fileName = `123FastLink_${Date.now()}.json`;
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
                if (settingsManager.get('useFolderNameForJson')) {
                    const firstPathSegment = (jsonDataForExport.commonPath || '').split('/')[0];
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
                    fileName = `123FastLink_${Date.now()}.json`;
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
                     if (settingsManager.get('useFolderNameForJson')) {
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
             if(type === 'inputLink' || type === 'inputPublicShare'){ const firstInput = this.modalElement.querySelector('input[type="text"], textarea'); if(firstInput) setTimeout(() => firstInput.focus(), 100); }
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
                console.warn(`[${SCRIPT_NAME}] 达到最大尝试次数，未能添加按钮。请刷新页面重试。`);
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
(function () {
  'use strict';

  function createFloatingMenu() {
    if (document.querySelector('#fastlink-floating-button')) return;

    const btn = document.createElement('div');
    btn.id = 'fastlink-floating-button';
    btn.innerText = '📎';
    btn.style.display = 'none'; // 初始隐藏

    const isMobile = 'ontouchstart' in window;
    btn.style.cssText += `
      position: fixed;
      ${isMobile ? 'left: 20px;' : 'right: 20px;'}
      top: 40%;
      width: 60px;
      height: 60px;
      line-height: 60px;
      text-align: center;
      z-index: 9999;
      background: #1890ff;
      color: white;
      border-radius: 50%;
      cursor: move;
      font-size: 22px;
      font-weight: bold;
      box-shadow: 0 2px 6px rgba(0,0,0,0.25);
      user-select: none;
      touch-action: none;
    `;

    const menu = document.createElement('ul');
    menu.id = 'fastlink-dropdown-menu';
    menu.style.cssText = `
      position: fixed;
      background: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      list-style: none;
      padding: 6px 0;
      margin: 0;
      display: none;
      min-width: 180px;
      font-size: 14px;
      z-index: 10000;
    `;

    const entries = [
      { label: '📄 生成秒传链接', action: () => coreLogic.generateShareLink() },
      { label: '🌐 从分享链接生成', action: () => uiManager.showModal("🌐 从分享链接中生成链接", "", 'inputPublicShare') },
      { label: '🌐 批量解析分享链接', action: () => uiManager.showModal("🌐 批量生成", "", 'inputPublicShareBatch') },
      { label: '📥 链接/文件转存', action: () => uiManager.showModal("📥 粘贴链接或上传文件", "", 'inputLink') },
      { label: '✂️ 拆分JSON文件', action: () => uiManager.showModal("✂️ 拆分工具", "", 'splitJsonTool') },
      { label: '🔄 转换.123share', action: () => open123ShareConvert() },
      { label: '🔍 元数据过滤设置', action: () => uiManager.showModal("🔍 过滤设置", "", 'filterSettings') },
      { label: '⚙️ 设置', action: () => uiManager.showSettingsDialog() },
    ];

    entries.forEach(({ label, action }) => {
      const li = document.createElement('li');
      li.innerText = label;
      li.style.cssText = 'padding: 8px 12px; cursor: pointer;';
      li.onmouseenter = () => li.style.background = '#f0f0f0';
      li.onmouseleave = () => li.style.background = 'white';
      li.onclick = () => {
        menu.style.display = 'none';
        action();
      };
      menu.appendChild(li);
    });

    let offsetX = 0, offsetY = 0;
    let isDragging = false, moved = false;

    function snapToEdge() {
      const screenWidth = window.innerWidth;
      const btnRect = btn.getBoundingClientRect();
      const distanceToLeft = btnRect.left;
      const distanceToRight = screenWidth - (btnRect.left + btnRect.width);
      if (distanceToLeft <= distanceToRight && distanceToLeft <= 40) {
        btn.style.left = '20px';
        btn.style.right = 'auto';
      } else if (distanceToRight < distanceToLeft && distanceToRight <= 40) {
        btn.style.left = 'auto';
        btn.style.right = '20px';
      } else {
        btn.style.left = btnRect.left + 'px';
        btn.style.right = 'auto';
      }
    }

    function showMenu() {
      const rect = btn.getBoundingClientRect();
      const menuWidth = 180;
      const menuHeight = menu.offsetHeight || 240;
      let left = rect.left;
      let top = rect.top + btn.offsetHeight + 6;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      if (left + menuWidth > viewportWidth) {
        left = viewportWidth - menuWidth - 10;
        if (left < 0) left = 0;
      }
      if (top + menuHeight > viewportHeight) {
        top = rect.top - menuHeight - 6;
        if (top < 0) top = 0;
      }
      if (left < 0) left = 10;
      menu.style.left = left + 'px';
      menu.style.top = top + 'px';
      menu.style.display = 'block';
    }

    btn.addEventListener('mousedown', (e) => {
      isDragging = true;
      moved = false;
      offsetX = e.clientX - btn.getBoundingClientRect().left;
      offsetY = e.clientY - btn.getBoundingClientRect().top;
      document.body.style.userSelect = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        moved = true;
        btn.style.left = e.clientX - offsetX + 'px';
        btn.style.top = e.clientY - offsetY + 'px';
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
        menu.style.left = btn.style.left;
        menu.style.top = (e.clientY - offsetY + btn.offsetHeight + 6) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        snapToEdge();
        document.body.style.userSelect = '';
      }
    });

    btn.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      isDragging = true;
      moved = false;
      const touch = e.touches[0];
      offsetX = touch.clientX - btn.getBoundingClientRect().left;
      offsetY = touch.clientY - btn.getBoundingClientRect().top;
      e.preventDefault();
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        moved = true;
        const touch = e.touches[0];
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;
        btn.style.left = x + 'px';
        btn.style.top = y + 'px';
        btn.style.right = 'auto';
        btn.style.bottom = 'auto';
        menu.style.left = x + 'px';
        menu.style.top = (y + btn.offsetHeight + 6) + 'px';
        e.preventDefault();
      }
    }, { passive: false });

    btn.addEventListener('touchend', (e) => {
      if (isDragging) {
        isDragging = false;
        snapToEdge();
        if (!moved) {
          if (menu.style.display === 'block') {
            menu.style.display = 'none';
          } else {
            showMenu();
          }
          e.preventDefault();
        }
      }
    });

    btn.addEventListener('mouseenter', () => {
      if (!('ontouchstart' in window)) showMenu();
    });

    btn.addEventListener('mouseleave', () => {
      if (!('ontouchstart' in window)) {
        setTimeout(() => {
          if (!menu.matches(':hover')) menu.style.display = 'none';
        }, 200);
      }
    });

    menu.addEventListener('mouseleave', () => {
      if (!('ontouchstart' in window)) menu.style.display = 'none';
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !menu.contains(e.target)) menu.style.display = 'none';
    });

    document.body.appendChild(btn);
    document.body.appendChild(menu);
  }

  function open123ShareConvert() {
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
          downloadFile(JSON.stringify(jsonData, null, 2), file.name.replace('.123share', '.json'), 'application/json');
        } else if (file.name.endsWith('.json')) {
          const jsonData = JSON.parse(content);
          const shareContent = convertJsonTo123Share(jsonData);
          downloadFile(shareContent, file.name.replace('.json', '.123share'), 'text/plain');
        } else {
          alert("❌ 请上传 .123share 或 .json 文件！");
        }
      } catch (e) {
        alert("❌ 处理文件出错：" + e.message);
      }
    };
    input.click();
  }

  function downloadFile(content, filename, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function observePageChanges() {
    const observer = new MutationObserver(() => {
      createFloatingMenu();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function monitorTargetVisibility() {
    const targetSelector = '.with-side-menu-layout-sider-menu--item-label';
    const matchText = '全部文件';

    const checkVisibility = () => {
      const btn = document.querySelector('#fastlink-floating-button');
      const menu = document.querySelector('#fastlink-dropdown-menu');
      const found = Array.from(document.querySelectorAll(targetSelector))
        .some(el => el.textContent.trim() === matchText);

      if (btn && menu) {
        btn.style.display = found ? 'block' : 'none';
        if (!found) menu.style.display = 'none';
      }
    };

    const observer = new MutationObserver(checkVisibility);
    observer.observe(document.body, { childList: true, subtree: true });
    setInterval(checkVisibility, 1000); // 保险措施，每秒检测一次
  }

  window.addEventListener('load', () => {
    createFloatingMenu();
    observePageChanges();
    monitorTargetVisibility();
  });

  setTimeout(() => {
    createFloatingMenu();
    observePageChanges();
    monitorTargetVisibility();
  }, 2000);
})();

})();