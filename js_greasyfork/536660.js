// ==UserScript==
// @name         123云盘秒传链接
// @namespace    http://tampermonkey.net/
// @version      1.3.1
// @description  123FastLink是一款适用于123网盘（123Pan）的用户脚本，可以从您选中的文件/文件夹或分享链接链接中生成秒传信息，并支持通过秒传信息或导入JSON数据快速转存文件/文件夹到您的网盘。支持过滤元数据文件。修复指定文件夹转存问题。
// @author        Gemini
// @match        *://*.123pan.com/*
// @match        *://*.123pan.cn/*
// @match        *://*.123865.com/*
// @match        *://*.123684.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=123pan.com
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/536660/123%E4%BA%91%E7%9B%98%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/536660/123%E4%BA%91%E7%9B%98%E7%A7%92%E4%BC%A0%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    // --- Constants and Configuration ---
    const SCRIPT_NAME = "123FastLink";
    const SCRIPT_VERSION = "1.3.1"; // 修复指定文件夹转存问题
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
        SHARE_LIST: "/b/api/share/get"
    };
  
    const DOM_SELECTORS = {
        TARGET_BUTTON_AREA: '.ant-dropdown-trigger.sysdiv.parmiryButton',
        FILE_ROW_SELECTOR: ".ant-table-row.ant-table-row-level-0.editable-row",
        FILE_CHECKBOX_SELECTOR: "input[type='checkbox']"
    };
  
    const RETRY_AND_DELAY_CONFIG = {
        RATE_LIMIT_ITEM_RETRY_DELAY_MS: 5000,
        RATE_LIMIT_MAX_ITEM_RETRIES: 2,
        RATE_LIMIT_GLOBAL_PAUSE_TRIGGER_FAILURES: 3,
        RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS: 30000,
        GENERAL_API_RETRY_DELAY_MS: 3000,
        GENERAL_API_MAX_RETRIES: 2,
        PROACTIVE_DELAY_MS: 200
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
            filterOnShareEnabled: true,
            filterOnTransferEnabled: true,
        }
    };
  
    const filterManager = {
        filters: [],
        filterOnShareEnabled: true,
        filterOnTransferEnabled: true,
  
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
            try {
                const modal = uiManager.getModalElement();
                if (!modal) {
                    console.warn(`[${SCRIPT_NAME}] Filter settings: renderFilterItems called but no modal element found.`);
                    return;
                }
                const selectedTagsContainer = modal.querySelector('#fl-selected-filter-tags');
                const dropdown = modal.querySelector('#fl-filter-dropdown');
                const searchInput = modal.querySelector('#fl-filter-search-input');
                if (!selectedTagsContainer || !dropdown) {
                    console.warn(`[${SCRIPT_NAME}] Filter settings: renderFilterItems missing critical elements (tagsContainer or dropdown).`);
                    return;
                }
  
                selectedTagsContainer.innerHTML = '';
                dropdown.innerHTML = '';
                const searchTerm = searchInput ? searchInput.value.trim().toLowerCase() : "";
  
                this.filters.forEach((filter, index) => {
                    if (filter.enabled) {
                        const tag = document.createElement('div');
                        tag.className = 'filter-tag';
                        tag.dataset.index = index;
                        tag.innerHTML = `<span class="filter-emoji">${filter.emoji}</span><span class="filter-tag-text">.${filter.ext}</span><span class="filter-tag-name">(${filter.name})</span><span class="filter-tag-remove">×</span>`;
                        tag.querySelector('.filter-tag-remove')?.addEventListener('click', () => { this.filters[index].enabled = false; this.renderFilterItems(); });
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
            } catch (e) {
                console.error(`[${SCRIPT_NAME}] CRITICAL ERROR in renderFilterItems:`, e);
                // Optionally re-throw or handle by showing a specific error to the user via uiManager
            }
        },
        attachFilterEvents: function() {
            try {
                const modal = uiManager.getModalElement();
                if (!modal) {
                    console.warn(`[${SCRIPT_NAME}] Filter settings: attachFilterEvents called but no modal element found.`);
                    return;
                }
                console.log(`[${SCRIPT_NAME}] Filter settings: Attaching events to modal.`);
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
                            const term = searchInput.value.trim().toLowerCase().replace(/^\\./, ''); // Remove leading dot
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
                console.log(`[${SCRIPT_NAME}] Filter settings: Events attached successfully.`);
            } catch (e) {
                console.error(`[${SCRIPT_NAME}] CRITICAL ERROR in attachFilterEvents:`, e);
                uiManager.showError("加载过滤器设置时发生严重错误，可能部分功能无法使用。请尝试刷新页面。", 5000);
            }
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
        _listDirectoryContentsInternal: async function(parentId, limit = 100) { if (parentId === undefined || parentId === null || isNaN(parseInt(parentId))) { throw new Error(`无效的文件夹ID: ${parentId}，无法列出内容。`); } let allItems = []; let nextMarker = "0"; let currentPage = 1; do { const queryParams = { driveId: 0, limit: limit, next: nextMarker, orderBy: "file_name", orderDirection: "asc", parentFileId: parseInt(parentId, 10), trashed: false, SearchData: "", Page: currentPage, OnlyLookAbnormalFile: 0, event: "homeListFile", operateType: 4, inDirectSpace: false }; const responseData = await this.sendRequest("GET", API_PATHS.LIST_NEW, queryParams); if (responseData?.data?.InfoList) { const newItems = responseData.data.InfoList.map(item => ({ FileID: parseInt(item.FileId, 10) || NaN, FileName: item.FileName || "Unknown", Type: parseInt(item.Type, 10) || 0, Size: parseInt(item.Size, 10) || 0, Etag: item.Etag || "", ParentFileID: parseInt(item.ParentFileId, 10) })); allItems = allItems.concat(newItems); nextMarker = responseData.data.Next; currentPage++; } else { nextMarker = "-1"; } } while (nextMarker !== "-1" && nextMarker !== null && nextMarker !== undefined && String(nextMarker).trim() !== ""); return allItems; },
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
                const queryParams = { limit: limit, next: nextMarker, orderBy: "file_name", orderDirection: "asc", parentFileId: parseInt(parentId, 10), Page: currentPage, shareKey: shareKey, };
                if (sharePwd) queryParams.SharePwd = sharePwd;
                const responseData = await this.sendRequest("GET", API_PATHS.SHARE_LIST, queryParams, null, true);
                if (responseData?.data?.InfoList) {
                    const newItems = responseData.data.InfoList.map(item => ({ FileID: parseInt(item.FileId, 10) || NaN, FileName: item.FileName || "Unknown", Type: parseInt(item.Type, 10) || 0, Size: parseInt(item.Size, 10) || 0, Etag: item.Etag || "", ParentFileID: parseInt(item.ParentFileId, 10) }));
                    allItems = allItems.concat(newItems); nextMarker = responseData.data.Next; currentPage++;
                } else { if (currentPage === 1 && !responseData?.data?.InfoList && responseData.message && responseData.code !== 0) throw new Error(`API错误: ${responseData.message}`); nextMarker = "-1"; }
            } while (nextMarker !== "-1" && nextMarker !== null && nextMarker !== undefined && String(nextMarker).trim() !== "");
            return allItems;
        },
    };
  
    const processStateManager = {
        _userRequestedStop: false,
        _modalStopButtonId: 'fl-modal-stop-btn',
        // Keep track of last known progress to update mini bar instantly if needed
        _lastProgressData: { processed: 0, total: 0, successes: 0, failures: 0, currentFileName: "", extraStatus: "" },
        reset: function() {
            this._userRequestedStop = false;
            const btn = document.getElementById(this._modalStopButtonId);
            if(btn){btn.textContent = "🛑 停止"; btn.disabled = false;}
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
            const minimizeBtn = document.getElementById('fl-m-minimize');
            if(minimizeBtn) minimizeBtn.disabled = true;
            console.log(`[${SCRIPT_NAME}] User requested stop.`);
            // Update mini progress title if active
            if (uiManager.isMiniProgressActive && uiManager.miniProgressElement) {
                const miniTitle = uiManager.miniProgressElement.querySelector('.fastlink-mini-progress-title span');
                if (miniTitle) miniTitle.textContent = "🛑 正在停止...";
            }
        },
        isStopRequested: function() { return this._userRequestedStop; },
        getStopButtonId: function() { return this._modalStopButtonId; },
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
        appendLogMessage: function(message, isError = false) { 
            const logArea = document.querySelector('.fastlink-status'); 
            console.log(`[${SCRIPT_NAME}] appendLogMessage: 尝试记录: "${message}"`, "错误?", isError, "日志区域存在?", !!logArea);
            if (logArea) { 
                const p = document.createElement('p'); 
                p.className = isError ? 'error-message' : 'info-message'; 
                p.innerHTML = message; 
                const extraStatusSibling = logArea.querySelector('.extra-status-message'); 
                if (extraStatusSibling) logArea.insertBefore(p, extraStatusSibling.nextSibling); 
                else logArea.appendChild(p); 
                logArea.scrollTop = logArea.scrollHeight; 
            } else {
                console.error(`[${SCRIPT_NAME}] appendLogMessage: 日志区域 '.fastlink-status' 未找到! 无法记录: "${message}"`);
            }
        } 
    };
  
    const coreLogic = {
        currentOperationRateLimitStatus: { consecutiveRateLimitFailures: 0 },
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
                        return result;
                    } catch (error) {
                        if (processStateManager.isStopRequested()) throw error;
                        if (error.isRateLimit) {
                            rateLimitStatusRef.consecutiveRateLimitFailures++;
                            const rlRetryAttemptDisplay = rateLimitRetriesForCurrentGeneralAttempt + 1;
                            const currentFileEl = document.querySelector('.fastlink-current-file .file-name');
                            if(currentFileEl) processStateManager.appendLogMessage(`⏳ ${currentFileEl.textContent || itemNameForLog}: 操作频繁 (RL ${rlRetryAttemptDisplay}/${RETRY_AND_DELAY_CONFIG.RATE_LIMIT_MAX_ITEM_RETRIES + 1})`, true);
                            if (rateLimitRetriesForCurrentGeneralAttempt >= RETRY_AND_DELAY_CONFIG.RATE_LIMIT_MAX_ITEM_RETRIES) { processStateManager.appendLogMessage(`❌ ${itemNameForLog}: 已达当前常规尝试的最大API限流重试次数。`, true); throw error; }
                            rateLimitRetriesForCurrentGeneralAttempt++;
                            if (rateLimitStatusRef.consecutiveRateLimitFailures >= RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_TRIGGER_FAILURES) {
                                processStateManager.appendLogMessage(`[全局暂停] API持续频繁，暂停 ${RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS / 1000} 秒...`, true);
                                const extraStatusEl = document.querySelector('.fastlink-status .extra-status-message');
                                if(extraStatusEl) extraStatusEl.textContent = `全局暂停中... ${RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS / 1000}s`;
                                await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.RATE_LIMIT_GLOBAL_PAUSE_DURATION_MS));
                                if(extraStatusEl) extraStatusEl.textContent = "";
                                rateLimitStatusRef.consecutiveRateLimitFailures = 0; rateLimitRetriesForCurrentGeneralAttempt = 0;
                            } else { await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.RATE_LIMIT_ITEM_RETRY_DELAY_MS)); }
                        } else {
                            const genRetryAttemptDisplay = generalErrorRetries + 1;
                            processStateManager.appendLogMessage(`❌ ${itemNameForLog}: ${error.message} (常规重试 ${genRetryAttemptDisplay}/${RETRY_AND_DELAY_CONFIG.GENERAL_API_MAX_RETRIES + 1})`, true);
                            generalErrorRetries++; if (generalErrorRetries > RETRY_AND_DELAY_CONFIG.GENERAL_API_MAX_RETRIES) throw error;
                            await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.GENERAL_API_RETRY_DELAY_MS)); break;
                        }
                    }
                }
            }
            throw new Error(`[${SCRIPT_NAME}] 所有API重试均失败: ${itemNameForLog}`);
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
  
        _generateLinkProcess: async function(itemFetcherAsyncFn, operationTitleForUI) {
            processStateManager.reset();
            this.currentOperationRateLimitStatus.consecutiveRateLimitFailures = 0;
            let allFileEntriesData = [];
            let processedAnyFolder = false; 
            let totalDiscoveredItemsForProgress = 0;
            let itemsProcessedForProgress = 0;
            let successes = 0, failures = 0;
            let jsonDataForExport = null;
            const startTime = Date.now();
            let permanentlyFailedItemsFromFetcher = []; 
  
            uiManager.showModal(operationTitleForUI, `
                <div class="fastlink-progress-container"><div class="fastlink-progress-bar" style="width: 0%"></div></div>
                <div class="fastlink-status"><p>🔍 正在分析项目...</p><p class="extra-status-message" style="color: #ff7f50; display: none;"></p></div>
                <div class="fastlink-stats"><span class="success-count">✅ 成功：0</span><span class="failed-count">❌ 失败：0</span></div>
                <div class="fastlink-current-file"><p class="file-name">准备开始...</p></div>`, 'progress_stoppable', false);
            processStateManager.appendLogMessage("🚀 [LOG_TEST] _generateLinkProcess: 日志系统准备就绪。模态框已显示。"); // Initial log test
  
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
                if (result.permanentlyFailedItems) permanentlyFailedItemsFromFetcher = result.permanentlyFailedItems; // Get failed items
  
            } catch (e) {
                if (e.message === "UserStopped") processStateManager.appendLogMessage("🛑 用户已停止操作。", true);
                else { processStateManager.appendLogMessage(`SYSTEM ERROR: ${e.message}`, true); console.error("Error during generation:", e); }
            }
  
            processStateManager.updateProgressUI(itemsProcessedForProgress, totalDiscoveredItemsForProgress, successes, failures, "处理完成", "");
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            let summary;
  
            if (allFileEntriesData.length > 0 || permanentlyFailedItemsFromFetcher.length > 0) { // Consider failed items for showing results modal
                let link = "";
                const allPaths = allFileEntriesData.map(entry => entry.fullPath);
                const commonPrefix = this._findLongestCommonPrefix(allPaths);
                let useV2Format = true;
                const processedEntries = allFileEntriesData.map(entry => { const etagConversion = hexToOptimizedEtag(entry.etag); if (!etagConversion.useV2) useV2Format = false; return { ...entry, processedEtag: etagConversion.useV2 ? etagConversion.optimized : entry.etag }; });
  
                if (commonPrefix && (processedAnyFolder || allPaths.some(p => p.includes('/')))) { const fileStrings = processedEntries.map(entry => `${useV2Format ? entry.processedEtag : entry.etag}#${entry.size}#${entry.fullPath.substring(commonPrefix.length)}`); link = (useV2Format ? COMMON_PATH_LINK_PREFIX_V2 : COMMON_PATH_LINK_PREFIX_V1) + commonPrefix + COMMON_PATH_DELIMITER + fileStrings.join('$');
                } else { const fileStrings = processedEntries.map(entry => `${useV2Format ? entry.processedEtag : entry.etag}#${entry.size}#${entry.fullPath}`); link = fileStrings.join('$'); if (processedAnyFolder || allPaths.some(p => p.includes('/'))) link = (useV2Format ? LEGACY_FOLDER_LINK_PREFIX_V2 : LEGACY_FOLDER_LINK_PREFIX_V1) + link; else if (useV2Format && !link.startsWith(LEGACY_FOLDER_LINK_PREFIX_V2) && !link.startsWith(COMMON_PATH_LINK_PREFIX_V2)) link = LEGACY_FOLDER_LINK_PREFIX_V2 + link; }
  
                const commonPathForExport = (commonPrefix && (processedAnyFolder || allPaths.some(p => p.includes('/')))) ? commonPrefix : "";
                jsonDataForExport = { scriptVersion: SCRIPT_VERSION, exportVersion: "1.0", usesBase62EtagsInExport: useV2Format, commonPath: commonPathForExport, files: allFileEntriesData.map(entry => ({ path: commonPathForExport ? entry.fullPath.substring(commonPathForExport.length) : entry.fullPath, size: String(entry.size), etag: useV2Format ? hexToOptimizedEtag(entry.etag).optimized : entry.etag })) };
  
                if (processStateManager.isStopRequested()) processStateManager.appendLogMessage(`⚠️ 操作已停止。以下是已处理 ${allFileEntriesData.length} 项的部分链接/数据。`);
                if (useV2Format) processStateManager.appendLogMessage('💡 使用V2链接格式 (Base62 ETags) 生成。'); else processStateManager.appendLogMessage('ℹ️ 使用V1链接格式 (标准 ETags) 生成。');
  
                const totalSize = allFileEntriesData.reduce((acc, entry) => acc + Number(entry.size), 0);
                const formattedTotalSize = formatBytes(totalSize);
                let titleMessage = failures > 0 && successes > 0 ? "🎯 部分成功" : (successes > 0 ? "🎉 生成成功" : "🤔 无有效数据");
                if (processStateManager.isStopRequested()) titleMessage = "🔴 操作已停止 (部分数据)";
                else if (successes === 0 && permanentlyFailedItemsFromFetcher.length > 0 && allFileEntriesData.length === 0) titleMessage = "😢 全部失败";
                else if (successes > 0 && permanentlyFailedItemsFromFetcher.length > 0) titleMessage = "🎯 部分成功 (含失败项)";
  
  
                summary = `<div class="fastlink-result"><p>📄 已处理项目 (用于链接/JSON): ${allFileEntriesData.length} 个</p><p>✅ 成功获取链接信息: ${successes} 个</p><p>❌ 失败/跳过项目 (元数据提取阶段): ${failures} 个</p><p>📋 永久失败项目 (无法处理): ${permanentlyFailedItemsFromFetcher.length} 个</p><p>💾 已处理项目总大小: ${formattedTotalSize}</p><p>⏱️ 耗时: ${totalTime} 秒</p><textarea class="fastlink-link-text" readonly>${link}</textarea></div>`;
                
                // Add failed items log if any
                if (permanentlyFailedItemsFromFetcher.length > 0) {
                    summary += `<div id="fastlink-permanent-failures-log" style="display: block; margin-top: 10px; text-align: left; max-height: 150px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; font-size: 0.85em;"><h4>永久失败项目 (${permanentlyFailedItemsFromFetcher.length}):</h4><div id="fastlink-failures-list">`;
                    permanentlyFailedItemsFromFetcher.forEach(pf => {
                        summary += `<p style="margin:2px 0;">📄 <span style="font-weight:bold;">${pf.fileName || '未知文件'}</span> (ID: ${pf.id || 'N/A'}): <span style="color:red;">${pf.error || '未知错误'}</span></p>`;
                    });
                    summary += `</div></div>`;
                }
  
                uiManager.showModal( 
                    titleMessage, // Use the already determined titleMessage
                    summary, 
                    'showLink', 
                    true, // Ensure closable is true for showLink type
                    link, 
                    jsonDataForExport,
                    permanentlyFailedItemsFromFetcher // Pass failed items to modal for potential button actions
                );
                return link;
            } else {
                if (processStateManager.isStopRequested()) summary = `<div class="fastlink-result"><h3>🔴 操作已停止</h3><p>未收集到有效文件信息。</p><p>⏱️ 耗时: ${totalTime} 秒</p></div>`;
                else if (failures > 0 && successes === 0) summary = `<div class="fastlink-result"><h3>😢 生成失败</h3><p>未能提取有效文件信息 (${successes} 成功, ${failures} 失败)</p><p>⏱️ 耗时: ${totalTime} 秒</p></div>`;
                else summary = `<div class="fastlink-result"><h3>🤔 无有效文件</h3><p>未选中任何符合条件的文件，或文件夹为空，或所有可选文件均被过滤器排除。</p><p>⏱️ 耗时: ${totalTime} 秒</p></div>`;
                uiManager.updateModalContent(summary); uiManager.enableModalCloseButton(true); return "";
            }
        },
  
        generateShareLink: async function() {
            const selectedItemIds = this.getSelectedFileIds();
            if (!selectedItemIds.length) { uiManager.showAlert("请先勾选要分享的文件或文件夹。"); return ""; }
            let permanentlyFailedItems = []; 
  
            // Log selected items at the very beginning of the share link generation process
            console.log(`[${SCRIPT_NAME}] generateShareLink: 开始处理选中的ID:`, selectedItemIds);
            // Use a timeout to ensure modal is ready for appendLogMessage
            setTimeout(() => {
                processStateManager.appendLogMessage(`[generateShareLink] 检测到 ${selectedItemIds.length} 个选中的项目。`);
            }, 100);
  
            return this._generateLinkProcess(async (addDataCb, markFolderCb, progressCb) => {
                let totalDiscovered = selectedItemIds.length;
                let processedCount = 0;
                let successCount = 0;
                let failureCount = 0;
  
                async function processSingleItem(itemId, currentRelativePath, preFetchedDetails = null) {
                    if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                    processStateManager.appendLogMessage(`⚙️ [PSI_START] ID: ${itemId}, Path: '${currentRelativePath || 'ROOT'}', HasPrefetched: ${!!preFetchedDetails}`);
                    if (preFetchedDetails) {
                        processStateManager.appendLogMessage(`📄 [PSI_PREFETCHED_DETAILS] ID: ${itemId}, FID: ${preFetchedDetails.FileID}, Name: '${preFetchedDetails.FileName}', Type: ${preFetchedDetails.Type}, Size: ${preFetchedDetails.Size}, Etag: ${preFetchedDetails.Etag ? preFetchedDetails.Etag.substring(0,10)+'...' : 'N/A'}`);
                    }
  
                    let itemDetails = preFetchedDetails;
                    const baseItemNameForLog = `${currentRelativePath || 'ROOT'}/${preFetchedDetails ? preFetchedDetails.FileName : itemId}`;
  
                    if (!itemDetails) {
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForLog, extraStatus: "获取信息..." });
                        try {
                            const itemInfoResponse = await apiHelper.getFileInfo([String(itemId)]);
                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                            if (!itemInfoResponse?.data?.infoList?.length) throw new Error(`项目 ${itemId} 信息未找到`);
                            itemDetails = itemInfoResponse.data.infoList[0];
                            processStateManager.appendLogMessage(`📄 [PSI_FETCHED_DETAILS] ID: ${itemId}, FID: ${itemDetails.FileID}, Name: '${itemDetails.FileName}', Type: ${itemDetails.Type}, Size: ${itemDetails.Size}, Etag: ${itemDetails.Etag ? itemDetails.Etag.substring(0,10)+'...' : 'N/A'}`);
                        } catch (e) {
                            if (processStateManager.isStopRequested()) throw e;
                            failureCount++; processedCount++; // Count as processed because we attempted
                            const errorMsg = `获取项目详情 '${baseItemNameForLog}' (ID: ${itemId}) 失败: ${e.message}`;
                            processStateManager.appendLogMessage(`❌ [PSI_FETCH_FAIL] ${errorMsg}`);
                            permanentlyFailedItems.push({ fileName: baseItemNameForLog, id: itemId, error: errorMsg });
                            progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForLog, extraStatus: "获取信息失败" });
                            return;
                        }
                    } else {
                         progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForLog, extraStatus: "处理预取信息..." });
                         // Log details if pre-fetched, as they weren't logged by the block above
                         processStateManager.appendLogMessage(`📄 [PSI_USING_PREFETCHED_DETAILS] ID: ${itemId}, FID: ${itemDetails.FileID}, Name: '${itemDetails.FileName}', Type: ${itemDetails.Type}, Size: ${itemDetails.Size}, Etag: ${itemDetails.Etag ? itemDetails.Etag.substring(0,10)+'...' : 'N/A'}`);
                    }
                    
                    processStateManager.appendLogMessage(`[PSI_PRE_TYPE_CHECK] ID: ${itemId}, FID: ${itemDetails.FileID}, Name: '${itemDetails.FileName}', Type: ${itemDetails.Type}, Size: ${itemDetails.Size}, Etag: ${itemDetails.Etag ? itemDetails.Etag.substring(0,10)+'...' : 'N/A'}`);
  
                    if (isNaN(itemDetails.FileID) && itemDetails.FileID !== 0) {
                        failureCount++; processedCount++;  // Count as processed
                        const errorMsg = `项目 '${itemDetails.FileName || itemId}' (ID: ${itemId}) FileID无效 (${itemDetails.FileID})`;
                        processStateManager.appendLogMessage(`❌ [PSI_INVALID_FID] ${errorMsg}`);
                        permanentlyFailedItems.push({ fileName: itemDetails.FileName || String(itemId), id: String(itemId), error: errorMsg });
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForLog });
                        return;
                    }
  
                    const cleanName = (itemDetails.FileName || "Unknown").replace(/[#$%\/]/g, "_").replace(new RegExp(COMMON_PATH_DELIMITER.replace(/[.*+?^${}()|[\\\]\\\\]/g, '\\$&'), 'g'), '_');
                    const itemDisplayPath = `${currentRelativePath ? currentRelativePath + '/' : ''}${cleanName}`;
                    const formattedSize = formatBytes(Number(itemDetails.Size) || 0);
                    
                    // Increment processedCount if it hasn't been due to an early fetch/FID failure
                    let alreadyCountedInError = permanentlyFailedItems.some(f => f.id === String(itemId));
                    if (!alreadyCountedInError) {
                        processedCount++;
                        processStateManager.appendLogMessage(`[PSI_PROCESSED_COUNT_INC] ID: ${itemId}. Processed count is now ${processedCount}.`);
                    }
  
                    progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: `${itemDisplayPath} (${formattedSize})` });
  
                    if (itemDetails.Type === 0) { // File
                        processStateManager.appendLogMessage(`[PSI_FILE_CHECK] '${itemDetails.FileName}' (ID: ${itemId}) is Type 0.`);
                        if (itemDetails.Etag && String(itemDetails.Etag).length > 0 && itemDetails.Size !== undefined) {
                            processStateManager.appendLogMessage(`[PSI_FILE_META_OK] File: '${itemDetails.FileName}', Etag: '${itemDetails.Etag.substring(0,10)}...', Size: ${itemDetails.Size}`);
                            processStateManager.appendLogMessage(`[PSI_PRE_FILTER_CHECK] cleanName: '${cleanName}', filterOnShareEnabled: ${filterManager.filterOnShareEnabled}`);
                            if (filterManager.shouldFilterFile(cleanName, true)) {
                                processStateManager.appendLogMessage(`⏭️ [PSI_FILTERED] File '${itemDisplayPath}' (${formattedSize}) was excluded by filter.`);
                                // Not added to permanentlyFailedItems as this is expected behavior if filtered.
                            } else {
                                addDataCb({ etag: itemDetails.Etag, size: itemDetails.Size, fullPath: itemDisplayPath });
                                successCount++;
                                processStateManager.appendLogMessage(`✔️ [PSI_FILE_SUCCESS] Added file '${itemDisplayPath}' (${formattedSize}) to link.`);
                            }
                        } else {
                            failureCount++; // This is a failure for link generation
                            let ed = (!itemDetails.Etag || String(itemDetails.Etag).length === 0) ? "缺少或空Etag" : "缺少大小";
                            const errorMsg = `File '${itemDisplayPath}' (${formattedSize}) (ID: ${itemId})元数据不完整: ${ed}. Etag: '${itemDetails.Etag}', Size: ${itemDetails.Size}`;
                            processStateManager.appendLogMessage(`❌ [PSI_FILE_META_FAIL] ${errorMsg}`);
                            permanentlyFailedItems.push({ fileName: itemDisplayPath, id: String(itemDetails.FileID), error: errorMsg, etag: itemDetails.Etag, size: itemDetails.Size });
                        }
                    } else if (itemDetails.Type === 1) { // Folder
                        processStateManager.appendLogMessage(`[PSI_FOLDER_CHECK] '${itemDetails.FileName}' (ID: ${itemId}) is Type 1.`);
                        markFolderCb(true);
                        processStateManager.appendLogMessage(`📁 [PSI_SCAN_FOLDER] Scanning folder: ${itemDisplayPath}`);
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: itemDisplayPath, extraStatus: "列出内容..." });
                        let contents;
                        try {
                            contents = await apiHelper.listDirectoryContents(itemDetails.FileID);
                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                        } catch (e) {
                            if (processStateManager.isStopRequested()) throw e;
                            // This folder itself has an issue if listing fails.
                            failureCount++;
                            const errorMsg = `处理文件夹 '${itemDisplayPath}' (ID: ${itemId}) 内容列出失败: ${e.message}`;
                            processStateManager.appendLogMessage(`❌ [PSI_LIST_DIR_FAIL] ${errorMsg}`);
                            permanentlyFailedItems.push({ fileName: itemDisplayPath, id: String(itemDetails.FileID), error: `列出内容失败: ${e.message}` });
                            progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: itemDisplayPath, extraStatus: "列出内容失败" });
                            return;
                        }
                        
                        totalDiscovered += contents.length;
                        for (const contentItem of contents) {
                            if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                            if (isNaN(contentItem.FileID) && contentItem.FileID !==0) {
                                failureCount++;
                                const errorMsg = `文件夹 '${itemDisplayPath}' 内发现无效项目ID (${contentItem.FileID}), 文件名: '${contentItem.FileName}'`;
                                processStateManager.appendLogMessage(`❌ [PSI_INVALID_SUB_ID] ${errorMsg}`);
                                permanentlyFailedItems.push({ fileName: `${itemDisplayPath}/${contentItem.FileName || '未知'}`, id: String(contentItem.FileID), error: errorMsg });
                                continue;
                            }
                            await processSingleItem(contentItem.FileID, itemDisplayPath, contentItem);
                            await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 2));
                        }
                    } else { // Unknown type
                        failureCount++; // Count unknown types as failures for link generation
                        const unknownTypeMsg = `项目 '${itemDisplayPath}' (${formattedSize}) (ID: ${itemId}) 是未知类型 (${itemDetails.Type})，已跳过。`;
                        processStateManager.appendLogMessage(`⚠️ [PSI_UNKNOWN_TYPE] ${unknownTypeMsg}`);
                        permanentlyFailedItems.push({ fileName: itemDisplayPath, id: String(itemDetails.FileID), error: unknownTypeMsg, type: itemDetails.Type });
                    }
                    await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS));
                }
  
                progressCb({ processed: 0, total: totalDiscovered, successCount: 0, failureCount: 0, currentFile: "准备开始..." });
                for (let i = 0; i < selectedItemIds.length; i++) { 
                    if (processStateManager.isStopRequested()) break; 
                    // Log before processing each top-level item
                    processStateManager.appendLogMessage(`[generateShareLink] 开始处理顶层项目 ${i + 1}/${selectedItemIds.length}, ID: ${selectedItemIds[i]}`);
                    await processSingleItem(selectedItemIds[i], ""); 
                }
                return { 
                    totalDiscoveredItemsForProgress: Math.max(totalDiscovered, processedCount), 
                    itemsProcessedForProgress: processedCount, 
                    successes: successCount, 
                    failures: failureCount,
                    permanentlyFailedItems: permanentlyFailedItems // Return failed items
                };
            }, "生成秒传链接");
        },
  
        generateLinkFromPublicShare: async function(shareKey, sharePwd, startParentFileId = "0") {
            if (!shareKey?.trim()) { uiManager.showAlert("分享Key不能为空。"); return "";}
            if (isNaN(parseInt(startParentFileId))) { uiManager.showAlert("起始文件夹ID必须是数字。"); return ""; }
  
            return this._generateLinkProcess(async (addDataCb, markFolderCb, progressCb) => {
                let totalDiscovered = 1;
                let processedCount = 0;
                let successCount = 0;
                let failureCount = 0;
  
                async function _fetchSharedItemsRecursive(currentSharedParentId, currentRelativePath) {
                    if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                    const baseItemNameForUI = `${currentRelativePath || '分享根目录'}/ID:${currentSharedParentId}`;
                    progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForUI, extraStatus: "获取分享内容..." });
  
                    let contents;
                    try {
                        contents = await apiHelper.listSharedDirectoryContents(currentSharedParentId, shareKey, sharePwd);
                        if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                    } catch (e) {
                        if (processStateManager.isStopRequested()) throw e;
                        failureCount++; processedCount++;
                        processStateManager.appendLogMessage(`❌ 获取分享目录 "${baseItemNameForUI}" 内容失败: ${e.message}`, true);
                        progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: baseItemNameForUI, extraStatus: "获取分享内容失败" });
                        return;
                    }
  
                    if (processedCount === 0 && currentSharedParentId === startParentFileId) totalDiscovered = contents.length > 0 ? contents.length : 1;
                    else totalDiscovered += contents.length;
                    processedCount++;
  
                    for (const item of contents) {
                        if (processStateManager.isStopRequested()) throw new Error("UserStopped");
                        if (isNaN(item.FileID)) { failureCount++; totalDiscovered = Math.max(1, totalDiscovered-1); processStateManager.appendLogMessage(`❌ 分享内发现无效项目ID: ${item.FileName}`, true); continue; }
  
                        const cleanName = (item.FileName || "Unknown").replace(/[#$%\/]/g, "_").replace(new RegExp(COMMON_PATH_DELIMITER.replace(/[.*+?^${}()|[\\\]\\\\]/g, '\\\\$&'), 'g'), '_');
                        const itemDisplayPath = `${currentRelativePath ? currentRelativePath + '/' : ''}${cleanName}`;
                        const formattedSize = formatBytes(Number(item.Size) || 0);
  
                        let itemProcessedThisLoop = false; // Flag to ensure processedCount is incremented correctly for files
  
                        if (item.Type === 0) { // File
                            progressCb({ processed: processedCount + (itemProcessedThisLoop ? 0 : 1), total: totalDiscovered, successCount, failureCount, currentFile: `${itemDisplayPath} (${formattedSize})` });
                            if (item.Etag && item.Size !== undefined) {
                                if (filterManager.shouldFilterFile(cleanName, true)) { processStateManager.appendLogMessage(`⏭️ 已过滤: ${itemDisplayPath} (${formattedSize})`); }
                                else { addDataCb({ etag: item.Etag, size: item.Size, fullPath: itemDisplayPath }); successCount++; processStateManager.appendLogMessage(`✔️ 文件 (分享): ${itemDisplayPath} (${formattedSize})`);}
                            } else { failureCount++; let ed = !item.Etag ? "缺少Etag" : "缺少大小"; processStateManager.appendLogMessage(`❌ 分享文件 "${itemDisplayPath}" (${formattedSize}) ${ed}`, true); }
                            if(!itemProcessedThisLoop) { processedCount++; itemProcessedThisLoop = true;}
                        } else if (item.Type === 1) { // Folder
                             progressCb({ processed: processedCount, total: totalDiscovered, successCount, failureCount, currentFile: itemDisplayPath }); // Update UI for folder before recursive call
                            markFolderCb(true);
                            processStateManager.appendLogMessage(`📁 扫描分享文件夹: ${itemDisplayPath}`);
                            await _fetchSharedItemsRecursive(item.FileID, itemDisplayPath);
                        }
                        await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS / 2));
                    }
                }
                progressCb({ processed: 0, total: totalDiscovered, successCount: 0, failureCount: 0, currentFile: "准备开始从分享链接生成..." });
                await _fetchSharedItemsRecursive(startParentFileId, "");
                return { totalDiscoveredItemsForProgress: Math.max(totalDiscovered, processedCount), itemsProcessedForProgress: processedCount, successes: successCount, failures: failureCount };
            }, `从分享链接生成 (Key: ${shareKey.substring(0,8)}...)`);
        },
  
        parseShareLink: (shareLink) => {
            let commonBasePath = ""; let isCommonPathFormat = false; let isV2EtagFormat = false;
            if (shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V2)) { isCommonPathFormat = true; isV2EtagFormat = true; shareLink = shareLink.substring(COMMON_PATH_LINK_PREFIX_V2.length); }
            else if (shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V1)) { isCommonPathFormat = true; shareLink = shareLink.substring(COMMON_PATH_LINK_PREFIX_V1.length); }
            if (isCommonPathFormat) { const delimiterPos = shareLink.indexOf(COMMON_PATH_DELIMITER); if (delimiterPos > -1) { commonBasePath = shareLink.substring(0, delimiterPos); shareLink = shareLink.substring(delimiterPos + 1); } else { console.error("Malformed common path link: delimiter not found."); isCommonPathFormat = false; } }
            else { if (shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V2)) { isV2EtagFormat = true; shareLink = shareLink.substring(LEGACY_FOLDER_LINK_PREFIX_V2.length); } else if (shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V1)) { shareLink = shareLink.substring(LEGACY_FOLDER_LINK_PREFIX_V1.length); } }
            return shareLink.split('$').map(sLink => { const parts = sLink.split('#'); if (parts.length >= 3) { let etag = parts[0]; try { etag = optimizedEtagToHex(parts[0], isV2EtagFormat); } catch (e) { console.error(`[${SCRIPT_NAME}] Error decoding ETag: ${parts[0]}, ${e.message}`); return null; } let filePath = parts.slice(2).join('#'); if (isCommonPathFormat && commonBasePath) filePath = commonBasePath + filePath; return { etag: etag, size: parts[1], fileName: filePath }; } return null; }).filter(i => i);
        },
        transferFromShareLink: async function(shareLink, targetFolderPath = "") {
            if (!shareLink?.trim()) { uiManager.showAlert("链接为空"); return; } const filesToProcess = this.parseShareLink(shareLink); if (!filesToProcess.length) { uiManager.showAlert("无法解析链接或链接中无有效文件信息"); return; }
            const isFolderStructureHint = shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V1) || shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V1) || shareLink.startsWith(LEGACY_FOLDER_LINK_PREFIX_V2) || shareLink.startsWith(COMMON_PATH_LINK_PREFIX_V2) || filesToProcess.some(f => f.fileName.includes('/'));
            await this._executeActualFileTransfer(filesToProcess, isFolderStructureHint, "链接转存", [], targetFolderPath);
        },
        transferImportedJsonData: async function(jsonData, targetFolderPath = "") {
            if (!jsonData || typeof jsonData !== 'object') { uiManager.showAlert("JSON数据无效"); return; } const { scriptVersion, exportVersion, usesBase62EtagsInExport, commonPath, files } = jsonData; if (!files || !Array.isArray(files) || files.length === 0) { uiManager.showAlert("JSON文件中没有有效的文件条目。"); return; }
            processStateManager.appendLogMessage(`[导入] JSON包含 ${files.length} 个条目。公共路径: '${commonPath || "(无)"}', Base62 ETags (声明): ${usesBase62EtagsInExport === undefined ? '未声明' : usesBase62EtagsInExport}`); let preprocessingFailedItems = [];
            const filesToProcess = files.map(fileFromJson => { if (!fileFromJson || typeof fileFromJson.path !== 'string' || !fileFromJson.size || !fileFromJson.etag) { const errorMsg = "条目无效 (缺少 path, size, or etag)"; preprocessingFailedItems.push({ fileName: (fileFromJson||{}).path || "未知文件(数据缺失)", error: errorMsg, originalEntry: fileFromJson||{} }); return null; } let finalEtag; try { let attemptDecode = usesBase62EtagsInExport; if (usesBase62EtagsInExport === undefined) { const isLikelyHex = /^[0-9a-fA-F]+$/.test(fileFromJson.etag); if (isLikelyHex && fileFromJson.etag.length === 32) attemptDecode = false; else if (!isLikelyHex || fileFromJson.etag.length < 32) attemptDecode = true; else attemptDecode = false; processStateManager.appendLogMessage(`[导入推断] 文件 '${fileFromJson.path.substring(0,30)}...' ETag '${fileFromJson.etag.substring(0,10)}...', usesBase62EtagsInExport未声明，推断为: ${attemptDecode}`); } finalEtag = attemptDecode ? optimizedEtagToHex(fileFromJson.etag, true) : fileFromJson.etag; } catch (e) { const errorMsg = `ETag解码失败 (${fileFromJson.etag}): ${e.message}`; processStateManager.appendLogMessage(`❌ ${errorMsg} 文件: ${fileFromJson.path}`, true); preprocessingFailedItems.push({ fileName: fileFromJson.path, error: errorMsg, originalEntry: fileFromJson }); return null; } const fullFileName = commonPath ? commonPath + fileFromJson.path : fileFromJson.path; return { etag: finalEtag, size: String(fileFromJson.size), fileName: fullFileName, originalEntry: fileFromJson }; }).filter(f => f !== null);
            if (preprocessingFailedItems.length > 0) processStateManager.appendLogMessage(`[导入注意] ${preprocessingFailedItems.length} 个条目在预处理阶段失败，将不会被尝试转存。`, true);
            if (!filesToProcess.length && preprocessingFailedItems.length > 0) { uiManager.showModal("⚠️ JSON导入预处理失败",`所有 ${preprocessingFailedItems.length} 个文件条目在导入预处理阶段即发生错误，无法继续转存。<br><div id="fastlink-permanent-failures-log" style="display: block; margin-top: 10px; text-align: left; max-height: 150px; overflow-y: auto; border: 1px solid #ddd; padding: 5px; font-size: 0.85em;"><h4>预处理失败项目:</h4><div id="fastlink-failures-list">${preprocessingFailedItems.map(pf => `<p style="margin:2px 0;">📄 <span style="font-weight:bold;">${pf.fileName}</span>: <span style="color:red;">${pf.error}</span></p>`).join('')}</div></div>`, 'info_with_buttons', true, null, null, preprocessingFailedItems); return; }
            else if (!filesToProcess.length) { uiManager.showAlert("JSON文件中解析后无有效文件可转存（所有条目均无效或解码失败）。"); return; }
            const isFolderStructureHint = !!commonPath || filesToProcess.some(f => f.fileName.includes('/')); await this._executeActualFileTransfer(filesToProcess, isFolderStructureHint, "文件导入", preprocessingFailedItems, targetFolderPath);
        },
        _executeActualFileTransfer: async function(filesToProcess, isFolderStructureHint, operationTitle = "转存", initialPreprocessingFailures = [], targetFolderPath = "") {
            processStateManager.reset(); this.currentOperationRateLimitStatus.consecutiveRateLimitFailures = 0; let permanentlyFailedItems = [...initialPreprocessingFailures]; let totalSuccessfullyTransferredSize = 0;
            let rootDirId = this.getCurrentDirectoryId(); if (rootDirId === null || isNaN(parseInt(rootDirId))) { uiManager.showAlert("无法确定当前目标目录ID。将尝试转存到根目录。"); rootDirId = "0"; } rootDirId = parseInt(rootDirId);
            let userSpecifiedFolderPath = targetFolderPath ? targetFolderPath.trim() : ""; let finalRootDirId = rootDirId;
  
            const initialModalTitle = `⚙️ ${operationTitle}状态 (${filesToProcess.length} 项)`;
            // Initial modal content with placeholder for folder selector (might be removed if no folder path input)
            let modalContent = `
                <div class="fastlink-progress-container"><div class="fastlink-progress-bar" style="width: 0%"></div></div>
                <div class="fastlink-status">
                    <p>🚀 准备${operationTitle} ${filesToProcess.length} 个文件到目录ID ${rootDirId}${userSpecifiedFolderPath ? " 的 " + userSpecifiedFolderPath + " 文件夹中" : ""}</p>
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
                            processStateManager.appendLogMessage(`ℹ️ 文件夹已存在: ${folderName} (ID: ${parentIdForUserPath})`);
                        } else {
                            processStateManager.appendLogMessage(`📁 创建文件夹: ${folderName} (在ID: ${parentIdForUserPath})`);
                            const newFolder = await apiHelper.createFolder(parentIdForUserPath, folderName);
                            if (processStateManager.isStopRequested()) { uiManager.showAlert("操作已取消"); return; }
                            if (newFolder && !isNaN(parseInt(newFolder.FileId))) { parentIdForUserPath = parseInt(newFolder.FileId); processStateManager.appendLogMessage(`✅ 文件夹创建成功: ${folderName} (ID: ${parentIdForUserPath})`); }
                            else { throw new Error(`创建文件夹返回的ID无效: ${JSON.stringify(newFolder)}`); }
                        }
                        folderCache[currentPathForUser] = parentIdForUserPath;
                    }
                    finalRootDirId = parentIdForUserPath;
                    processStateManager.appendLogMessage(`✅ 目标文件夹就绪: ${userSpecifiedFolderPath} (ID: ${finalRootDirId})`);
                } catch (error) {
                    processStateManager.appendLogMessage(`❌ 创建目标文件夹 "${userSpecifiedFolderPath}" 失败: ${error.message}`, true);
                    console.error(`[${SCRIPT_NAME}] 创建目标文件夹错误:`, error);
                    uiManager.showAlert(`创建目标文件夹失败: ${error.message}，将尝试转存到当前目录 (ID: ${rootDirId})`);
                    finalRootDirId = rootDirId; // Fallback
                }
            }
  
            for (let i = 0; i < filesToProcess.length; i++) {
                if (processStateManager.isStopRequested()) break;
                const file = filesToProcess[i];
                const originalFileNameForLog = file.fileName || "未知文件";
                const formattedFileSize = file.size ? formatBytes(Number(file.size)) : "未知大小";
  
                if (!file || !file.fileName || !file.etag || !file.size) { failures++; processStateManager.appendLogMessage(`❌ 跳过无效文件数据 (索引 ${i}): ${originalFileNameForLog}`, true); permanentlyFailedItems.push({ ...file, fileName: originalFileNameForLog, error: "无效文件数据" }); processStateManager.updateProgressUI(i + 1, filesToProcess.length, successes, failures, `无效数据 (${formattedFileSize})`); continue; }
                if (filterManager.shouldFilterFile(file.fileName, false)) { processStateManager.appendLogMessage(`⏭️ 已过滤: ${file.fileName} (${formattedFileSize})`); processStateManager.updateProgressUI(i + 1, filesToProcess.length, successes, failures, `已过滤: ${file.fileName} (${formattedFileSize})`); continue; }
  
                processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${file.fileName} (${formattedFileSize})`, "");
                let effectiveParentId = finalRootDirId; // Start with the (potentially user-specified) target folder
                let actualFileName = file.fileName;
  
                try {
                    if (file.fileName.includes('/')) {
                        const pathParts = file.fileName.split('/');
                        actualFileName = pathParts.pop();
                        if (!actualFileName && pathParts.length > 0 && file.fileName.endsWith('/')) { processStateManager.appendLogMessage(`⚠️ 文件路径 "${file.fileName}" (${formattedFileSize}) 可能表示目录，跳过。`, true); failures++; permanentlyFailedItems.push({ ...file, error: "路径表示目录" }); continue; }
  
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
                                await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS));
                            }
                        }
                        effectiveParentId = parentIdForLinkPath;
                    }
  
                    if (isNaN(effectiveParentId) || effectiveParentId < 0) throw new Error(`路径创建失败或父ID无效 (${effectiveParentId}) for ${file.fileName} (${formattedFileSize})`);
                    if (!actualFileName) throw new Error(`文件名无效 for ${file.fileName} (${formattedFileSize})`);
  
                    processStateManager.updateProgressUI(i, filesToProcess.length, successes, failures, `${actualFileName} (${formattedFileSize})`, `秒传到ID: ${effectiveParentId}`);
                    await apiHelper.rapidUpload(file.etag, file.size, actualFileName, effectiveParentId);
                    if (processStateManager.isStopRequested()) throw new Error("UserStopped"); successes++; totalSuccessfullyTransferredSize += Number(file.size); processStateManager.appendLogMessage(`✔️ 文件: ${file.fileName} (${formattedFileSize})`);
                } catch (e) { if (processStateManager.isStopRequested()) break; failures++; processStateManager.appendLogMessage(`❌ 文件 "${actualFileName}" (${formattedFileSize}) (原始: ${originalFileNameForLog}) 失败: ${e.message}`, true); permanentlyFailedItems.push({ ...file, fileName: originalFileNameForLog, error: e.message }); processStateManager.updateProgressUI(i + 1, filesToProcess.length, successes, failures, `${actualFileName} (${formattedFileSize})`, "操作失败"); }
                await new Promise(r => setTimeout(r, RETRY_AND_DELAY_CONFIG.PROACTIVE_DELAY_MS));
            }
            processStateManager.updateProgressUI(filesToProcess.length, filesToProcess.length, successes, failures, "处理完成", "");
            const totalTime = Math.round((Date.now() - startTime) / 1000); let resultEmoji = successes > 0 && permanentlyFailedItems.length === 0 ? '🎉' : (successes > 0 ? '🎯' : '😢'); if (processStateManager.isStopRequested()) resultEmoji = '🔴';
            let finalUserMessage = processStateManager.isStopRequested() ? "操作已由用户停止" : `${operationTitle}完成`; if (!processStateManager.isStopRequested() && permanentlyFailedItems.length > 0) finalUserMessage = `${operationTitle}部分完成或预处理失败，共 ${permanentlyFailedItems.length} 个文件有问题。`;
            const formattedTotalSuccessfullyTransferredSize = formatBytes(totalSuccessfullyTransferredSize);
            let summary = `<div class="fastlink-result"><h3>${resultEmoji} ${finalUserMessage}</h3><p>✅ 成功转存: ${successes} 个文件</p><p>💾 成功转存总大小: ${formattedTotalSuccessfullyTransferredSize}</p><p>❌ 转存尝试失败: ${failures} 个文件</p><p>📋 总计问题文件 (含预处理): ${permanentlyFailedItems.length} 个</p><p>⏱️ 耗时: ${totalTime} 秒</p>${!processStateManager.isStopRequested() && successes > 0 ? '<p>📢 请手动刷新页面查看已成功转存的结果</p>' : ''}</div>`;
            uiManager.updateModalContent(summary);
            if (permanentlyFailedItems.length > 0 && !processStateManager.isStopRequested()) {
                const failuresLogDiv = document.getElementById('fastlink-failures-list'); const permanentFailuresDiv = document.getElementById('fastlink-permanent-failures-log');
                if (failuresLogDiv && permanentFailuresDiv) { failuresLogDiv.innerHTML = ''; permanentlyFailedItems.forEach(pf => { const p = document.createElement('p'); p.style.margin = '2px 0'; p.innerHTML = `📄 <span style="font-weight:bold;">${pf.fileName}</span>: <span style="color:red;">${pf.error || '未知错误'}</span>`; failuresLogDiv.appendChild(p); }); permanentFailuresDiv.style.display = 'block'; }
                const modalInstance = uiManager.getModalElement();
                if (modalInstance) {
                    let buttonsDiv = modalInstance.querySelector('.fastlink-modal-buttons'); if(!buttonsDiv) { buttonsDiv = document.createElement('div'); buttonsDiv.className = 'fastlink-modal-buttons'; modalInstance.querySelector(`#${uiManager.MODAL_CONTENT_ID}`)?.appendChild(buttonsDiv); } buttonsDiv.innerHTML = '';
                    const retryBtn = document.createElement('button'); retryBtn.id = 'fl-m-retry-failed'; retryBtn.className = 'confirm-btn'; retryBtn.textContent = `🔁 重试失败项 (${permanentlyFailedItems.length})`; retryBtn.onclick = () => { this._executeActualFileTransfer(permanentlyFailedItems, isFolderStructureHint, operationTitle + " - 重试", [], targetFolderPath); }; buttonsDiv.appendChild(retryBtn);
                    const copyLogBtn = document.createElement('button'); copyLogBtn.id = 'fl-m-copy-failed-log'; copyLogBtn.className = 'copy-btn'; copyLogBtn.style.marginLeft = '10px'; copyLogBtn.textContent = '复制问题日志'; copyLogBtn.onclick = () => { const logText = permanentlyFailedItems.map(pf => `文件: ${pf.fileName || (pf.originalEntry&&pf.originalEntry.path)||'未知路径'}\n${(pf.originalEntry&&pf.originalEntry.etag)?('原始ETag: '+pf.originalEntry.etag+'\n'):(pf.etag?'处理后ETag: '+pf.etag+'\n':'')}${(pf.originalEntry&&pf.originalEntry.size)?('大小: '+pf.originalEntry.size+'\n'):(pf.size?'大小: '+pf.size+'\n':'')}错误: ${pf.error||'未知错误'}`).join('\n\n'); GM_setClipboard(logText); uiManager.showAlert("问题文件日志已复制到剪贴板！", 1500); }; buttonsDiv.appendChild(copyLogBtn);
                    const closeBtnModal = document.createElement('button'); closeBtnModal.id = 'fl-m-final-close'; closeBtnModal.className = 'cancel-btn'; closeBtnModal.textContent = '关闭'; closeBtnModal.style.marginLeft = '10px'; closeBtnModal.onclick = () => uiManager.hideModal(); buttonsDiv.appendChild(closeBtnModal);
                }
                 uiManager.enableModalCloseButton(false); // Use custom close button
            } else {
                 uiManager.enableModalCloseButton(true); // Enable original close button
            }
        }
    };
  
    const uiManager = {
        modalElement: null, dropdownMenuElement: null, STYLE_ID: 'fastlink-dynamic-styles', MODAL_CONTENT_ID: 'fastlink-modal-content-area',
        activeModalOperationType: null, modalHideCallback: null,
        miniProgressElement: null, isMiniProgressActive: false, // Added for mini progress
  
        _downloadToFile: function(content, filename, contentType) { const a = document.createElement('a'); const blob = new Blob([content], { type: contentType }); a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href); },
        applyStyles: function() {
            if (document.getElementById(this.STYLE_ID)) return;
            let css = `
                .fastlink-modal{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background-color:white;padding:20px;border-radius:8px;box-shadow:0 0 15px rgba(0,0,0,.3);z-index:10001;width:420px;max-height:90vh;display:flex;flex-direction:column;text-align:center}
                .fastlink-modal-title{font-size:18px;font-weight:700;margin-bottom:15px}
                .fastlink-modal-content{flex:1;overflow-y:auto;max-height:calc(90vh - 140px);}
                .fastlink-modal-content textarea,.fastlink-modal-content div[contenteditable]{width:100%;min-height:80px;max-height:200px;overflow-y:auto;margin-bottom:15px;padding:8px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;white-space:pre-wrap;word-wrap:break-word}
                .fastlink-modal-content .fastlink-link-text{width:calc(100% - 16px)!important;min-height:80px;margin-bottom:0!important}
                .fastlink-modal-input{width:calc(100% - 16px);padding:8px;margin-bottom:10px;border:1px solid #ccc;border-radius:4px}
                .fastlink-modal-buttons{margin-top:15px;}
                .fastlink-modal-buttons button{padding:8px 15px;margin:0 5px;border-radius:4px;cursor:pointer;border:1px solid transparent;font-size:14px}
                .fastlink-modal-buttons .confirm-btn{background-color:#28a745;color:#fff}
                .fastlink-modal-buttons .confirm-btn:disabled{background-color:#94d3a2;cursor:not-allowed}
                .fastlink-modal-buttons .cancel-btn,.fastlink-modal-buttons .close-btn{background-color:#6c757d;color:#fff}
                .fastlink-modal-buttons .stop-btn{background-color:#dc3545;color:#fff}
                .fastlink-modal-buttons .copy-btn{background-color:#007bff;color:#fff}
                .fastlink-modal-buttons .export-btn{background-color:#ffc107;color:#212529;margin-left:10px}
                .fastlink-modal-buttons .minimize-btn{background-color:#ffc107;color:#212529;margin-left:5px;}
                .fastlink-file-input-container{margin-top:10px;margin-bottom:5px;text-align:left}
                .fastlink-file-input-container label{margin-right:5px;font-size:0.9em;}
                .fastlink-file-input-container input[type="file"]{font-size:0.9em;max-width:250px;}
                .fastlink-progress-container{width:100%;height:10px;background-color:#f0f0f0;border-radius:5px;margin:10px 0 15px;overflow:hidden}
                .fastlink-progress-bar{height:100%;background-color:#1890ff;transition:width .3s ease}
                .fastlink-status{text-align:left;margin-bottom:10px;max-height:150px;overflow-y:auto;border:1px solid #eee;padding:5px;font-size:.9em}
                .fastlink-status p{margin:3px 0;line-height:1.3}
                .fastlink-stats{display:flex;justify-content:space-between;margin:10px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;padding:5px 0}
                .fastlink-current-file{background-color:#f9f9f9;padding:5px;border-radius:4px;margin:5px 0;min-height:1.5em;word-break:break-all}
                .error-message{color:#d9534f;font-size:.9em}
                .info-message{color:#28a745;font-size:.9em}
                .fastlink-result{text-align:center}
                .fastlink-result h3{font-size:18px;margin:5px 0 15px}
                .fastlink-result p{margin:8px 0}
                #fastlink-dropdown-menu-container{position:absolute;background:#fff;border:1px solid #ccc;padding:2px;box-shadow:0 4px 6px rgba(0,0,0,.1);margin-top:5px;z-index:10002 !important;max-height:calc(100vh - 80px);overflow-y:auto;top:100%;left:0;}
                .fastlink-drag-drop-area{border:2px dashed #ccc;padding:10px;transition: border-color .3s ease;}
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
            `;
            GM_addStyle(css);
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
            const existingButtons = document.querySelectorAll('.fastlink-main-button-container'); existingButtons.forEach(btn => btn.remove()); const targetElement = document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA); if (targetElement && targetElement.parentNode) { const buttonContainer = document.createElement('div'); buttonContainer.className = 'fastlink-main-button-container ant-dropdown-trigger sysdiv parmiryButton'; buttonContainer.style.borderRight = '0.5px solid rgb(217, 217, 217)'; buttonContainer.style.cursor = 'pointer'; buttonContainer.style.marginLeft = '20px'; buttonContainer.innerHTML = `<span role="img" aria-label="menu" class="anticon anticon-menu" style="margin-right: 6px;"><svg viewBox="64 64 896 896" focusable="false" data-icon="menu" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M120 300h720v60H120zm0 180h720v60H120zm0 180h720v60H120z"></path></svg></span> 秒传 `;
            const dropdownMenu = document.createElement('div'); dropdownMenu.id = 'fastlink-dropdown-menu-container'; dropdownMenu.style.display = 'none';
            dropdownMenu.innerHTML = `<ul class="ant-dropdown-menu ant-dropdown-menu-root ant-dropdown-menu-vertical ant-dropdown-menu-light" role="menu" tabindex="0" data-menu-list="true" style="border-radius: 10px;"><li id="fastlink-generateShare" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🔗 生成链接 (选中项)</li><li class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="separator" style="border-top: 1px solid #eee; margin: 3px 0; padding: 0;"></li><li id="fastlink-receiveDirect" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">📥 链接/文件转存</li><li id="fastlink-generateFromPublicShare" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🌐 从分享链接生成</li><li class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="separator" style="border-top: 1px solid #eee; margin: 3px 0; padding: 0;"></li><li id="fastlink-filterSettings" class="ant-dropdown-menu-item ant-dropdown-menu-item-only-child" role="menuitem" tabindex="-1" style="padding: 5px 12px;">🔍 元数据过滤设置</li></ul>`; this.dropdownMenuElement = dropdownMenu;
            buttonContainer.addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = dropdownMenu.style.display === 'none' ? 'block' : 'none'; });
            document.addEventListener('click', (e) => { if (this.dropdownMenuElement && !buttonContainer.contains(e.target) && !this.dropdownMenuElement.contains(e.target)) { if (this.dropdownMenuElement.style.display !== 'none') this.dropdownMenuElement.style.display = 'none'; } });
            dropdownMenu.querySelector('#fastlink-generateShare').addEventListener('click', async (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; await coreLogic.generateShareLink(); });
            dropdownMenu.querySelector('#fastlink-generateFromPublicShare').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("🌐 从分享链接中生成链接", "", 'inputPublicShare'); });
            dropdownMenu.querySelector('#fastlink-receiveDirect').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("📥 文件转存/粘贴链接", "", 'inputLink'); });
            dropdownMenu.querySelector('#fastlink-filterSettings').addEventListener('click', (e) => { e.stopPropagation(); dropdownMenu.style.display = 'none'; this.showModal("🔍 元数据过滤设置", "", 'filterSettings'); });
            targetElement.parentNode.insertBefore(buttonContainer, targetElement.nextSibling); buttonContainer.appendChild(dropdownMenu); console.log(`[${SCRIPT_NAME}] 秒传按钮已添加。`); return true;
            } else { console.warn(`[${SCRIPT_NAME}] 目标按钮区域 '${DOM_SELECTORS.TARGET_BUTTON_AREA}' 未找到。`); return false; }
        },
        showModal: function(title, content, type = 'info', closable = true, pureLinkForClipboard = null, jsonDataForExport = null, preprocessingFailuresForLog = null) {
            const isOperationalModal = (t) => ['progress_stoppable', 'inputLink', 'inputPublicShare', 'filterSettings', 'showLink'].includes(t);
  
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
            if (type === 'inputLink') { htmlContent += `<div id="fl-m-drop-area" class="fastlink-drag-drop-area"><textarea id="fl-m-link-input" class="fastlink-modal-input" placeholder="🔗 粘贴秒传链接 或 📂 将文件拖放到此处..." style="min-height: 60px;">${content|| ''}</textarea><div id="fl-m-file-drop-status" style="font-size:0.9em; color:#28a745; margin-top:5px; margin-bottom:5px; min-height:1.2em;"></div><div class="fastlink-file-input-container"><label for="fl-m-file-input">或通过选择文件导入:</label><input type="file" id="fl-m-file-input" accept=".json,.123fastlink,.txt" class="fastlink-modal-file-input"></div></div><div class="folder-selector-container"><label for="fl-folder-selector" class="folder-selector-label">目标文件夹路径 (可选):</label><div class="folder-selector-input-container"><input type="text" id="fl-folder-selector" class="folder-selector-input" placeholder="输入目标文件夹路径，如: 电影/漫威"><div id="fl-folder-dropdown" class="folder-selector-dropdown"></div></div><div id="fl-selected-folders" class="folder-tag-container"></div></div>`; }
            else if (type === 'inputPublicShare') { htmlContent += `<input type="text" id="fl-m-public-share-key" class="fastlink-modal-input" placeholder="🔑 分享Key 或 完整分享链接"><input type="text" id="fl-m-public-share-pwd" class="fastlink-modal-input" placeholder="🔒 提取码 (如有)"><input type="text" id="fl-m-public-share-fid" class="fastlink-modal-input" value="0" placeholder="📁 起始文件夹ID (默认0为根目录)">`; }
            else if (type === 'filterSettings') { htmlContent += filterManager.buildFilterModalContent(); }
            else htmlContent += content;
            htmlContent += `</div><div class="fastlink-modal-buttons">`;
            if (type === 'inputLink') { htmlContent += `<button id="fl-m-confirm" class="confirm-btn">➡️ 转存</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'inputPublicShare') { htmlContent += `<button id="fl-m-generate-public" class="confirm-btn">✨ 生成</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'filterSettings') { htmlContent += `<button id="fl-m-save-filters" class="confirm-btn">💾 保存设置</button><button id="fl-m-cancel" class="cancel-btn">取消</button>`; }
            else if (type === 'showLink') { 
                if (pureLinkForClipboard || jsonDataForExport) { 
                    htmlContent += `<button id="fl-m-copy" class="copy-btn">📋 复制链接</button>`; 
                    if (jsonDataForExport) htmlContent += `<button id="fl-m-export-json" class="export-btn">📄 导出为 JSON</button>`; 
                }
                // Add copy failed log button if there are failed items from generation
                if (preprocessingFailuresForLog && preprocessingFailuresForLog.length > 0) {
                     htmlContent += `<button id="fl-m-copy-generation-failed-log" class="copy-btn" style="margin-left:10px; background-color: #ff7f50;">📋 复制失败日志 (${preprocessingFailuresForLog.length})</button>`;
                }
                htmlContent += `<button id="fl-m-cancel" class="close-btn" style="margin-left:10px;">关闭</button>`; 
            }
            else if (type === 'progress_stoppable') { htmlContent += `<button id="${processStateManager.getStopButtonId()}" class="stop-btn">🛑 停止</button><button id="fl-m-minimize" class="minimize-btn" style="margin-left: 5px;">最小化</button><button id="fl-m-cancel" class="close-btn" ${processStateManager.isStopRequested() ? '' : 'disabled'}>关闭</button>`; }
            else if (type === 'info_with_buttons' && preprocessingFailuresForLog && preprocessingFailuresForLog.length > 0) { htmlContent += `<button id="fl-m-copy-preprocessing-log" class="copy-btn">📋 复制日志</button><button id="fl-m-cancel" class="close-btn" style="margin-left:10px;">关闭</button>`; }
            else { htmlContent += `<button id="fl-m-cancel" class="close-btn">关闭</button>`; }
            htmlContent += `</div>`; this.modalElement.innerHTML = htmlContent; document.body.appendChild(this.modalElement);
  
            if (isOperationalModal(type)) this.activeModalOperationType = type; else this.activeModalOperationType = null;
  
             const confirmBtn = this.modalElement.querySelector('#fl-m-confirm');
             if(confirmBtn){ confirmBtn.onclick = async () => { const linkInputEl = this.modalElement.querySelector(`#fl-m-link-input`); const fileInputEl = this.modalElement.querySelector(`#fl-m-file-input`); const folderSelectorEl = this.modalElement.querySelector(`#fl-folder-selector`); let link = linkInputEl ? linkInputEl.value.trim() : null; let file = fileInputEl && fileInputEl.files && fileInputEl.files.length > 0 ? fileInputEl.files[0] : null; let targetFolderPath = folderSelectorEl ? folderSelectorEl.value.trim() : ""; confirmBtn.disabled = true; this.modalElement.querySelector('#fl-m-cancel')?.setAttribute('disabled', 'true'); if (file) { processStateManager.appendLogMessage(`ℹ️ 从文件 "${file.name}" 导入...`); try { const fileContent = await file.text(); const jsonData = JSON.parse(fileContent); await coreLogic.transferImportedJsonData(jsonData, targetFolderPath); } catch (e) { console.error(`[${SCRIPT_NAME}] 文件导入失败:`, e); processStateManager.appendLogMessage(`❌ 文件导入失败: ${e.message}`, true); uiManager.showError(`文件读取或解析失败: ${e.message}`); } } else if (link) { await coreLogic.transferFromShareLink(link, targetFolderPath); } else { this.showAlert("请输入链接或选择/拖放文件"); } if(this.modalElement && confirmBtn){ confirmBtn.disabled = false; this.modalElement.querySelector('#fl-m-cancel')?.removeAttribute('disabled'); } }; }
             
             const saveFiltersBtn = this.modalElement.querySelector('#fl-m-save-filters'); 
             if(saveFiltersBtn){ 
                saveFiltersBtn.onclick = () => { 
                    console.log(`[${SCRIPT_NAME}] saveFiltersBtn clicked.`);
                    console.log(`[${SCRIPT_NAME}] Attempting to save filter settings...`);
                    const saveResult = filterManager.saveSettings();
                    console.log(`[${SCRIPT_NAME}] filterManager.saveSettings() returned: ${saveResult}`);
                    if(saveResult){ 
                        console.log(`[${SCRIPT_NAME}] Settings saved successfully. Hiding current modal BEFORE showing alert.`);
                        this.hideModal(); // Hide current modal first
                        this.showAlert("✅ 过滤器设置已保存！", 1500); 
                        console.log(`[${SCRIPT_NAME}] Alert for success shown.`);
                    } else { 
                        console.log(`[${SCRIPT_NAME}] Failed to save settings. Showing error alert.`);
                        this.showError("❌ 保存过滤器设置失败！"); 
                        console.log(`[${SCRIPT_NAME}] Error alert for save failure shown.`);
                    } 
                }; 
            }
  
             if(type === 'filterSettings'){ 
                console.log(`[${SCRIPT_NAME}] Modal type is filterSettings, attaching filter events...`);
                filterManager.attachFilterEvents(); 
             }
             if (type === 'inputLink') { const dropArea = this.modalElement.querySelector('#fl-m-drop-area'); const fileInputEl = this.modalElement.querySelector(`#fl-m-file-input`); const linkInputEl = this.modalElement.querySelector('#fl-m-link-input'); const statusDiv = this.modalElement.querySelector('#fl-m-file-drop-status'); if (dropArea && fileInputEl && linkInputEl && statusDiv) { linkInputEl.addEventListener('input', () => { if (linkInputEl.value.trim() !== '') { if (fileInputEl.files && fileInputEl.files.length > 0) fileInputEl.value = ''; statusDiv.textContent = ''; } }); fileInputEl.addEventListener('change', () => { if (fileInputEl.files && fileInputEl.files.length > 0) { statusDiv.textContent = `已选中文件: ${fileInputEl.files[0].name}。请点击下方"转存"按钮。`; if(linkInputEl) linkInputEl.value = ''; } else statusDiv.textContent = ''; }); ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, (e) => { e.preventDefault(); e.stopPropagation(); }, false)); ['dragenter', 'dragover'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.add('drag-over-active'), false)); ['dragleave', 'drop'].forEach(eventName => dropArea.addEventListener(eventName, () => dropArea.classList.remove('drag-over-active'), false)); dropArea.addEventListener('drop', (e) => { const dt = e.dataTransfer; if (dt && dt.files && dt.files.length > 0) { const droppedFile = dt.files[0]; if (droppedFile.name.endsWith('.json') || droppedFile.name.endsWith('.123fastlink') || droppedFile.name.endsWith('.txt') || droppedFile.type === 'application/json' || droppedFile.type === 'text/plain') { try { const dataTransfer = new DataTransfer(); dataTransfer.items.add(droppedFile); fileInputEl.files = dataTransfer.files; if (statusDiv) statusDiv.textContent = `已拖放文件: ${droppedFile.name}。请点击下方"转存"按钮。`; if (linkInputEl) linkInputEl.value = ''; } catch (err) { console.error("Error creating DataTransfer:", err); if (statusDiv) statusDiv.textContent = "处理拖放文件时发生错误。"; } } else { if (statusDiv) statusDiv.textContent = "文件类型无效。请拖放 .json, .123fastlink, 或 .txt 文件。"; } } }, false); } const folderSelector = this.modalElement.querySelector('#fl-folder-selector'); const folderDropdown = this.modalElement.querySelector('#fl-folder-dropdown'); if (folderSelector && folderDropdown) { folderSelector.addEventListener('click', function() { folderDropdown.classList.toggle('active'); }); folderSelector.addEventListener('blur', function() { setTimeout(() => { folderDropdown.classList.remove('active'); }, 200); }); /* Other folder selector events... */ } }
             const generatePublicBtn = this.modalElement.querySelector('#fl-m-generate-public'); if(generatePublicBtn){ generatePublicBtn.onclick = async () => { const shareKeyEl = this.modalElement.querySelector('#fl-m-public-share-key'); const sharePwdEl = this.modalElement.querySelector('#fl-m-public-share-pwd'); const shareFidEl = this.modalElement.querySelector('#fl-m-public-share-fid'); const rawShareKeyInput = shareKeyEl ? shareKeyEl.value.trim() : null; let sharePwd = sharePwdEl ? sharePwdEl.value.trim() : null; const shareFid = shareFidEl ? shareFidEl.value.trim() : "0"; let finalShareKey = rawShareKeyInput; if (rawShareKeyInput) { if (rawShareKeyInput.includes('/s/')) { try { let url; try { url = new URL(rawShareKeyInput); } catch (e) { if (!rawShareKeyInput.startsWith('http')) url = new URL('https://' + rawShareKeyInput); else throw e; } const pathSegments = url.pathname.split('/'); const sIndex = pathSegments.indexOf('s'); if (sIndex !== -1 && pathSegments.length > sIndex + 1) { finalShareKey = pathSegments[sIndex + 1]; const searchParams = new URLSearchParams(url.search); const possiblePwdParams = ['pwd', '提取码', 'password', 'extract', 'code']; for (const paramName of possiblePwdParams) { if (searchParams.has(paramName)) { const urlPwd = searchParams.get(paramName); if (urlPwd && (!sharePwd || sharePwd.length === 0)) { sharePwd = urlPwd; if (sharePwdEl) sharePwdEl.value = sharePwd; } break; } } if ((!sharePwd || sharePwd.length === 0)) { const fullUrl = rawShareKeyInput; const pwdRegexes = [ /[?&]提取码[:=]([A-Za-z0-9]+)/, /提取码[:=]([A-Za-z0-9]+)/, /[?&]pwd[:=]([A-Za-z0-9]+)/, /[?&]password[:=]([A-Za-z0-9]+)/ ]; for (const regex of pwdRegexes) { const match = fullUrl.match(regex); if (match && match[1]) { sharePwd = match[1]; if (sharePwdEl) sharePwdEl.value = sharePwd; break; } } } } else { let pathAfterS = rawShareKeyInput.substring(rawShareKeyInput.lastIndexOf('/s/') + 3); finalShareKey = pathAfterS.split(/[/?#]/)[0]; } } catch (e) { let pathAfterS = rawShareKeyInput.substring(rawShareKeyInput.lastIndexOf('/s/') + 3); finalShareKey = pathAfterS.split(/[/?#]/)[0]; if (!sharePwd || sharePwd.length === 0) { const pwdMatch = rawShareKeyInput.match(/提取码[:=]([A-Za-z0-9]+)/); if (pwdMatch && pwdMatch[1]) { sharePwd = pwdMatch[1]; if (sharePwdEl) sharePwdEl.value = sharePwd; } } console.warn(`[${SCRIPT_NAME}] 分享链接解析失败: ${e.message}`); } } if (finalShareKey && finalShareKey.includes('自定义')) finalShareKey = finalShareKey.split('自定义')[0]; } if (!finalShareKey) { this.showAlert("请输入有效的分享Key或分享链接。"); return; } if (isNaN(parseInt(shareFid))) { this.showAlert("起始文件夹ID必须是数字。"); return; } generatePublicBtn.disabled = true; this.modalElement.querySelector('#fl-m-cancel')?.setAttribute('disabled', 'true'); await coreLogic.generateLinkFromPublicShare(finalShareKey, sharePwd, shareFid); if(this.modalElement && generatePublicBtn){ generatePublicBtn.disabled = false; this.modalElement.querySelector('#fl-m-cancel')?.removeAttribute('disabled');} };}
             const copyBtn = this.modalElement.querySelector('#fl-m-copy'); if(copyBtn){ copyBtn.onclick = () => { const textToCopy = pureLinkForClipboard || this.modalElement.querySelector('.fastlink-link-text')?.value; if (textToCopy) { GM_setClipboard(textToCopy); this.showAlert("已复制到剪贴板！");} else this.showError("无法找到链接文本。"); };}
             const exportJsonBtn = this.modalElement.querySelector('#fl-m-export-json'); if(exportJsonBtn && jsonDataForExport){ exportJsonBtn.onclick = () => { try { this._downloadToFile(JSON.stringify(jsonDataForExport, null, 2), `123FastLink_${Date.now()}.json`, 'application/json'); this.showAlert("JSON文件已开始下载！"); } catch (e) { console.error(`[${SCRIPT_NAME}] 导出JSON失败:`, e); this.showError(`导出JSON失败: ${e.message}`); }};}
             
             const copyGenFailedLogBtn = this.modalElement.querySelector('#fl-m-copy-generation-failed-log'); // For showLink type
             if (copyGenFailedLogBtn && preprocessingFailuresForLog && preprocessingFailuresForLog.length > 0) {
                copyGenFailedLogBtn.onclick = () => {
                    const logText = preprocessingFailuresForLog.map(pf => `文件: ${pf.fileName || '未知文件'} (ID: ${pf.id || 'N/A'})\n错误: ${pf.error || '未知错误'}\n${pf.etag ? ('ETag: ' + pf.etag + '\n') : ''}${pf.size !== undefined ? ('Size: ' + pf.size + '\n') : ''}`).join('\n');
                    GM_setClipboard(logText);
                    this.showAlert("失败项目日志已复制到剪贴板！", 1500);
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
             if (cancelBtn) {
                if (type === 'progress_stoppable') {
                    cancelBtn.textContent = processStateManager.isStopRequested() ? "关闭" : "隐藏";
                    cancelBtn.disabled = !processStateManager.isStopRequested(); // Only enable if stopped
                    cancelBtn.onclick = () => {
                        if (processStateManager.isStopRequested()) { 
                            this.hideModal(); 
                        } else { // If not stopped, it acts as a hide/minimize button
                            if (this.modalElement) this.modalElement.style.display = 'none';
                            // Consider showing mini progress or specific callback if defined
                            if (this.modalHideCallback) { this.modalHideCallback(); this.modalHideCallback = null; }
                            // Do not call showMiniProgress here directly, let minimize button handle it.
                        }
                    };
                } else if (type === 'showLink') { // Explicit handling for the 'showLink' close button
                    if (closable) {
                        cancelBtn.disabled = false; // Ensure it's enabled
                        cancelBtn.onclick = () => this.hideModal();
                    } else {
                        cancelBtn.disabled = true; // Should not happen if closable is true
                    }
                } else if (closable) { // General handler for other closable modals
                    cancelBtn.onclick = () => this.hideModal();
                }
                
                // Fallback for non-closable or if button should be disabled
                if (!closable && type !== 'progress_stoppable') {
                     cancelBtn.disabled = true;
                }
            }
            
            const copyPreprocessingLogBtn = this.modalElement.querySelector('#fl-m-copy-preprocessing-log'); if(copyPreprocessingLogBtn && preprocessingFailuresForLog) { copyPreprocessingLogBtn.onclick = () => { const logText = preprocessingFailuresForLog.map(pf => `文件: ${pf.fileName || (pf.originalEntry&&pf.originalEntry.path)||'未知路径'}\n${(pf.originalEntry&&pf.originalEntry.etag)?('原始ETag: '+pf.originalEntry.etag+'\n'):(pf.etag?'处理后ETag: '+pf.etag+'\n':'')}${(pf.originalEntry&&pf.originalEntry.size)?('大小: '+pf.originalEntry.size+'\n'):(pf.size?'大小: '+pf.size+'\n':'')}错误: ${pf.error||'未知错误'}`).join('\n\n'); GM_setClipboard(logText); this.showAlert("预处理失败日志已复制到剪贴板！", 1500); };}
  
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
        showAlert: function(message, duration = 2000) { this.showModal("ℹ️ 提示", message, 'info'); setTimeout(() => { if (this.modalElement && this.modalElement.querySelector('.fastlink-modal-title')?.textContent === "ℹ️ 提示") this.hideModal(); }, duration); },
        showError: function(message, duration = 3000) { this.showModal("⚠️ 错误", `<span style="color: red;">${message}</span>`, 'info'); setTimeout(() => { if (this.modalElement && this.modalElement.querySelector('.fastlink-modal-title')?.textContent === "⚠️ 错误") this.hideModal(); }, duration); },
        getModalElement: function() { return this.modalElement; },
    };
  
    function initialize() { console.log(`[${SCRIPT_NAME}] ${SCRIPT_VERSION} 初始化...`); filterManager.init(); uiManager.applyStyles(); uiManager.initMiniProgress(); let loadAttempts = 0; const maxAttempts = 10; function tryAddButton() { loadAttempts++; const pageSeemsReady = document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA) || document.querySelector('.Header_header__A5PFb'); if (pageSeemsReady) { if (document.querySelector('.fastlink-main-button-container')) return; if (uiManager.createDropdownButton()) return; } if (loadAttempts < maxAttempts) { const delay = loadAttempts < 3 ? 1500 : 3000; setTimeout(tryAddButton, delay); } else console.warn(`[${SCRIPT_NAME}] 达到最大尝试次数，未能添加按钮。`); } const observer = new MutationObserver((mutations, obs) => { const targetAreaExists = !!document.querySelector(DOM_SELECTORS.TARGET_BUTTON_AREA); const ourButtonExists = !!document.querySelector('.fastlink-main-button-container'); if (targetAreaExists && !ourButtonExists) { loadAttempts = 0; setTimeout(tryAddButton, 700); } }); observer.observe(document.documentElement, { childList: true, subtree: true }); setTimeout(tryAddButton, 500); }
    if (document.readyState === 'complete' || document.readyState === 'interactive') { setTimeout(initialize, 300); } else { window.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 300)); }
  
    function isValidHex(str) { if (typeof str !== 'string' || str.length === 0) return false; return /^[0-9a-fA-F]+$/.test(str); }
    function bigIntToBase62(num) { if (typeof num !== 'bigint') throw new Error("Input must be a BigInt."); if (num === 0n) return BASE62_CHARS[0]; let base62 = ""; let n = num; while (n > 0n) { base62 = BASE62_CHARS[Number(n % 62n)] + base62; n = n / 62n; } return base62; }
    function base62ToBigInt(str) { if (typeof str !== 'string' || str.length === 0) throw new Error("Input must be non-empty string."); let num = 0n; for (let i = 0; i < str.length; i++) { const char = str[i]; const val = BASE62_CHARS.indexOf(char); if (val === -1) throw new Error(`Invalid Base62 char: ${char}`); num = num * 62n + BigInt(val); } return num; }
    function hexToOptimizedEtag(hexEtag) { if (!isValidHex(hexEtag) || hexEtag.length === 0) return { original: hexEtag, optimized: null, useV2: false }; try { const bigIntValue = BigInt('0x' + hexEtag); const base62Value = bigIntToBase62(bigIntValue); if (base62Value.length > 0 && base62Value.length < hexEtag.length) return { original: hexEtag, optimized: base62Value, useV2: true }; return { original: hexEtag, optimized: hexEtag, useV2: false }; } catch (e) { console.warn(`[${SCRIPT_NAME}] ETag "${hexEtag}" to Base62 failed: ${e.message}. Using original.`); return { original: hexEtag, optimized: null, useV2: false }; } }
    function optimizedEtagToHex(optimizedEtag, isV2Etag) { if (!isV2Etag) return optimizedEtag; if (typeof optimizedEtag !== 'string' || optimizedEtag.length === 0) throw new Error("V2 ETag cannot be empty."); try { const bigIntValue = base62ToBigInt(optimizedEtag); let hex = bigIntValue.toString(16).toLowerCase(); if (hex.length < 32 && optimizedEtag.length >= 21 && optimizedEtag.length <= 22) hex = hex.padStart(32, '0'); return hex; } catch (e) { throw new Error(`Base62 ETag "${optimizedEtag}" to Hex failed: ${e.message}`); } }
  })();
  function formatBytes(bytes, decimals = 2) { if (bytes === 0) return '0 Bytes'; const k = 1024; const dm = decimals < 0 ? 0 : decimals; const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]; }
  