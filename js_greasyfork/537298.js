// ==UserScript==
// @name         超级助手面板 (链接新标签页+Cookie+滚动控制+AI媒体下载)
// @namespace    https://greasyfork.org/users/your-username // 建议替换为你的唯一命名空间
// @version      2.2.1-compact
// @description  默认禁用链接新标签页(白名单启用)。右下角UI面板：管理规则、Cookies、页面滚动(含后台无限滚动选项)、AI媒体下载(作者:醉春风)。
// @description:en Disabled by default. Links in new tab on whitelisted sites. UI Panel (bottom-right) for rules, Cookies, Page Scroll (bg infinite option), AI Media Downloader (by 醉春风).
// @author       AI Assistant (AI Media Downloader features by 醉春风, Scrolling features by 人民的勤务员)
// @match        *://*/*
// @license MIT
// @grant        GM_openInTab
// @grant        window.open
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/537298/%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8B%E9%9D%A2%E6%9D%BF%20%28%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%2BCookie%2B%E6%BB%9A%E5%8A%A8%E6%8E%A7%E5%88%B6%2BAI%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537298/%E8%B6%85%E7%BA%A7%E5%8A%A9%E6%89%8B%E9%9D%A2%E6%9D%BF%20%28%E9%93%BE%E6%8E%A5%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%2BCookie%2B%E6%BB%9A%E5%8A%A8%E6%8E%A7%E5%88%B6%2BAI%E5%AA%92%E4%BD%93%E4%B8%8B%E8%BD%BD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MAIN_DEBUG = false;
    const main_log = (...args) => { if (MAIN_DEBUG) console.log('[主助手面板]', ...args); };

    const MAIN_SCRIPT_CONFIG = {
        whitelistKey: 'openInNewTab_custom_whitelist_v1',
        blacklistKey: 'openInNewTab_custom_blacklist_v1',
        panelVisibleKey: 'openInNewTab_panelVisibleState_v2', // Increment version if structure changes
        defaultWhitelist: [], defaultBlacklist: [],
        scrollerTopKey: 'scroller_hotkey_top_v2',
        scrollerBottomKey: 'scroller_hotkey_one_off_bottom_v2', // For one-off scroll to bottom
        scrollerInfiniteToggleKey: 'scroller_hotkey_infinite_toggle_v2', // For toggling infinite scroll
        scrollerBackgroundInfiniteKeyPrefix: 'scroller_bg_infinite_v2_'
    };

    let main_userWhitelist = [];
    let main_userBlacklist = [];
    let main_panelVisible = GM_getValue(MAIN_SCRIPT_CONFIG.panelVisibleKey, false);
    main_log("脚本加载，初始面板可见状态 (从存储读取):", main_panelVisible);
    let main_uiPanel = null;

    GM_addStyle(`
        /* 主UI面板样式 */
        #superAssistantPanel { position: fixed !important; right: 15px !important; bottom: 15px !important; width: 192px; max-height: calc(90vh - 30px); background-color: #f0f2f5; border: 1px solid #d9d9d9; border-radius: 8px; padding: 8px; z-index: 2147483640 !important; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol"; font-size: 13px; color: #333; box-shadow: 0 6px 16px 0 rgba(0,0,0,0.08), 0 3px 6px -4px rgba(0,0,0,0.12), 0 9px 28px 8px rgba(0,0,0,0.05); display: none !important; flex-direction: column; line-height: 1.5; }
        #superAssistantPanel.panel-visible { display: flex !important; }
        #superAssistantPanel .panel-header { text-align: center; font-size: 16px; font-weight: 600; color: #2c3e50; padding-bottom: 8px; margin-bottom: 8px; border-bottom: 1px solid #e8e8e8;}
        #superAssistantPanel .panel-content-scrollable { overflow-y: auto; flex-grow: 1; margin-bottom: 8px; padding-right: 5px; }
        #superAssistantPanel .section-title { margin-top: 12px; margin-bottom: 8px; font-size: 14px; font-weight: 500; color: #34495e; padding-bottom: 5px; border-bottom: 1px dashed #bdc3c7; }
        #superAssistantPanel .add-form { display: flex; margin-bottom: 8px; align-items: center; }
        #superAssistantPanel .add-form input[type="text"] { flex-grow: 1; margin-right: 6px; padding: 5px 8px; border: 1px solid #ccc; border-radius: 4px; font-size: 12px; }
        #superAssistantPanel .add-form button { padding: 6px 10px; font-size: 12px; color: white; background-color: #3498db; border: none; border-radius: 4px; cursor: pointer; white-space: nowrap; }
        #superAssistantPanel .add-form button:hover { background-color: #2980b9; }
        #superAssistantPanel ul { list-style-type: none; padding-left: 0; margin: 0 0 8px 0; border: 1px solid #ecf0f1; border-radius: 4px; background-color: #fff; max-height: 100px; overflow-y:auto; } /* 减小列表高度 */
        #superAssistantPanel li { padding: 5px 8px; border-bottom: 1px solid #f5f7fa; display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
        #superAssistantPanel li:last-child { border-bottom: none; }
        #superAssistantPanel li .pattern-text { word-break: break-all; margin-right: 6px; flex-grow: 1; line-height: 1.3; }
        #superAssistantPanel .delete-btn { color: #e74c3c; background-color: transparent; border: none; cursor: pointer; font-weight: bold; font-size: 18px; padding: 0 4px; line-height: 1; opacity: 0.7; }
        #superAssistantPanel .delete-btn:hover { opacity: 1; }
        #superAssistantPanel .panel-empty-msg { font-size: 12px; color: #7f8c8d; padding: 8px; text-align: center; background-color: #fff; border-radius: 4px; }
        #superAssistantPanel .cookie-section, .scroller-section, .ai-downloader-section { margin-top: 12px; padding-top: 8px; border-top: 1px solid #e8e8e8; }
        #superAssistantPanel .cookie-display { width: calc(100% - 12px); min-height: 50px; max-height:80px; margin-top: 4px; margin-bottom: 6px; padding: 5px; border: 1px solid #ccc; border-radius: 4px; font-size: 11px; word-break: break-all; overflow-y: auto; line-height: 1.3; background:#fff; }
        #superAssistantPanel .actions-group { display: flex; justify-content: space-between; gap: 8px; margin-top: 6px; }
        #superAssistantPanel .actions-group button { padding: 6px 0; font-size: 12px; color: white; border-radius: 4px; cursor: pointer; flex-grow: 1; border:none; transition: background-color 0.2s ease; }
        #superAssistantPanel .scroller-actions { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
        #superAssistantPanel .scroller-actions .scroll-row, #superAssistantPanel .scroller-actions .single-button-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        #superAssistantPanel .scroller-actions button { flex-grow: 1; padding: 6px 0; font-size: 12px; } /* 统一滚动按钮大小 */
        #superAssistantPanel .scroller-actions .btn-toggle-scroll.active { background-color: #e67e22 !important; border-color: #d35400 !important; }
        #superAssistantPanel .scroller-actions .infinite-scroll-options { display: flex; align-items: center; margin-top: 4px; }
        #superAssistantPanel .scroller-actions input[type="checkbox"] { margin-right: 5px; transform: scale(0.9); vertical-align: middle; }
        #superAssistantPanel .scroller-actions label { font-size: 11px; color: #555; cursor:pointer; vertical-align: middle; user-select:none; }
        #superAssistantPanel .actions-group .btn-primary, #superAssistantPanel .scroller-actions .btn-primary { background-color: #3498db; } #superAssistantPanel .actions-group .btn-primary:hover, #superAssistantPanel .scroller-actions .btn-primary:hover { background-color: #2980b9; }
        #superAssistantPanel .actions-group .btn-secondary, #superAssistantPanel .scroller-actions .btn-secondary { background-color: #2ecc71; } #superAssistantPanel .actions-group .btn-secondary:hover, #superAssistantPanel .scroller-actions .btn-secondary:hover { background-color: #27ae60; }
        #superAssistantPanel .actions-group .btn-info, #superAssistantPanel .scroller-actions .btn-info { background-color: #1abc9c; } #superAssistantPanel .actions-group .btn-info:hover, #superAssistantPanel .scroller-actions .btn-info:hover { background-color: #16a085; }
        #superAssistantPanel .close-panel-btn { display: block; width: 100%; padding: 7px 10px; font-size: 13px; color: #fff; background-color: #95a5a6; border: none; border-radius: 4px; cursor: pointer; margin-top:10px; }
        #superAssistantPanel .close-panel-btn:hover { background-color: #7f8c8d; }
        #superAssistantPanel .ai-downloader-author { font-size: 10px; color: #7f8c8d; text-align: right; margin-top: 4px; }

        /* AI Downloader Panel Styles (与之前版本相同，确保z-index) */
        .manus-ai-preview-panel { z-index: 2147483646 !important; /* ...其他样式与v1.7.1一致... */ }
        .manus-ai-downloader-notification, .manus-ai-downloader-error { z-index: 2147483647 !important; /* ...其他样式与v1.7.1一致... */ }
        /* (此处省略大量AI下载模块的CSS，与上一版本相同) */
        .manus-ai-preview-panel { position: fixed !important; top: 0 !important; right: 0 !important; width: 320px !important; height: 100% !important; background: rgba(26, 26, 26, 0.98) !important; border-radius: 0 !important; box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2) !important; display: flex !important; flex-direction: column !important; transform: translateX(100%) !important; transition: transform 0.35s ease-out !important; color: white !important; font-family: sans-serif !important; border-left: 1px solid #3a8ffe !important;}
        .manus-ai-preview-panel.show { transform: translateX(0) !important; }
        .manus-ai-preview-header { display: flex !important; justify-content: space-between !important; align-items: center !important; padding: 10px 12px !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; flex-shrink: 0 !important; background-color: rgba(0,0,0,0.2); }
        .manus-ai-preview-title { color: white !important; font-size: 15px !important; font-weight: bold !important; }
        .manus-ai-author-credit { color: #ffcc00 !important; font-size: 11px !important; font-style: italic !important; margin-left: 8px !important; font-weight: normal !important; }
        .manus-ai-preview-close { color: white !important; background: none !important; border: none !important; cursor: pointer !important; font-size: 20px !important; padding: 5px !important; line-height:1; opacity: 0.7; }
        .manus-ai-preview-close:hover { opacity: 1; background: rgba(255,255,255,0.1) !important; border-radius: 50%;}
        .manus-ai-preview-toolbar { display: flex !important; padding: 8px 12px !important; border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important; gap: 6px !important; flex-wrap: wrap !important; flex-shrink: 0 !important; background-color: rgba(0,0,0,0.1); }
        .manus-ai-preview-toolbar button { background: rgba(255, 255, 255, 0.1) !important; color: white !important; border: none !important; border-radius: 3px !important; padding: 5px 8px !important; font-size: 12px !important; cursor: pointer !important; transition: background 0.2s !important; }
        .manus-ai-preview-toolbar button:hover { background: rgba(255, 255, 255, 0.2) !important; }
        .manus-ai-preview-counter { margin-left: auto !important; color: rgba(255, 255, 255, 0.8) !important; font-size: 12px !important; display: flex !important; align-items: center !important; }
        .manus-ai-preview-content { flex: 1 !important; overflow-y: auto !important; padding: 10px !important; display: grid !important; grid-template-columns: repeat(auto-fill, minmax(75px, 1fr)) !important; gap: 8px !important; }
        .manus-ai-preview-content::-webkit-scrollbar { width: 5px !important; }
        .manus-ai-preview-content::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.1) !important; }
        .manus-ai-preview-content::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.25) !important; border-radius: 3px !important; }
        .manus-ai-media-item { position: relative !important; width: 100% !important; padding-bottom: 100% !important; border-radius: 3px !important; overflow: hidden !important; cursor: pointer !important; transition: transform 0.15s, box-shadow 0.15s !important; background-color: #222 !important; }
        .manus-ai-media-item:hover { transform: scale(1.03) !important; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important; z-index: 1 !important; }
        .manus-ai-media-item.selected { border: 2px solid #007bff !important; box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25) !important; }
        .manus-ai-media-thumbnail-container { position: absolute !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; background-color: #282c34 !important; }
        .manus-ai-media-thumbnail-container svg { width: 28px !important; height: 28px !important; opacity: 0.7 !important; fill: none !important; stroke: #ccc !important; stroke-width: 1.5 !important; stroke-linecap: round !important; stroke-linejoin: round !important; }
        .manus-ai-media-checkbox { position: absolute !important; top: 4px !important; right: 4px !important; width: 16px !important; height: 16px !important; border: 1.5px solid white !important; border-radius: 2px !important; background: rgba(0, 0, 0, 0.6) !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: background 0.2s !important; z-index: 3 !important; }
        .manus-ai-media-checkbox.checked { background: #007bff !important; border-color: #007bff !important; }
        .manus-ai-media-checkbox.checked::after { content: "" !important; width: 8px !important; height: 4px !important; border-left: 2px solid white !important; border-bottom: 2px solid white !important; transform: rotate(-45deg) translate(0px, -1px) !important; }
        .manus-ai-media-item.video .manus-ai-media-thumbnail-container::before { content: "▶"; position: absolute; font-size: 20px; color: rgba(255,255,255,0.7); z-index: 1; opacity: 0.8; text-shadow: 0 0 3px black;}
        .manus-ai-media-duration { position: absolute !important; bottom: 4px !important; right: 4px !important; background: rgba(0, 0, 0, 0.75) !important; color: white !important; font-size: 9px !important; padding: 1px 3px !important; border-radius: 2px !important; z-index: 3 !important; }
        .manus-ai-preview-footer { padding: 8px 12px !important; border-top: 1px solid rgba(255, 255, 255, 0.1) !important; display: flex !important; justify-content: space-between !important; flex-shrink: 0 !important; background-color: rgba(0,0,0,0.2); }
        .manus-ai-download-btn { background: linear-gradient(135deg, #007bff 0%, #0056b3 100%) !important; color: white !important; border: none !important; border-radius: 3px !important; padding: 6px 12px !important; font-size: 13px !important; font-weight: bold !important; cursor: pointer !important; transition: all 0.2s !important; display: flex !important; align-items: center !important; }
        .manus-ai-download-btn svg { margin-right: 5px !important; fill: none !important; stroke: white !important; stroke-width: 2 !important; stroke-linecap: round !important; stroke-linejoin: round !important; width: 14px; height: 14px; }
        .manus-ai-download-btn:hover { transform: translateY(-1px) !important; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.25) !important; }
        .manus-ai-download-btn:disabled { background: #555 !important; cursor: not-allowed !important; transform: none !important; box-shadow: none !important; opacity:0.7; }
        .manus-ai-cancel-btn { background: rgba(255, 255, 255, 0.15) !important; color: white !important; border: none !important; border-radius: 3px !important; padding: 6px 12px !important; font-size: 13px !important; cursor: pointer !important; transition: background 0.2s !important; }
        .manus-ai-cancel-btn:hover { background: rgba(255, 255, 255, 0.25) !important; }
        .manus-ai-downloader-notification, .manus-ai-downloader-error { position: fixed !important; top: 20px !important; right: 20px !important; background: rgba(0,0,0,0.85) !important; color: white !important; padding: 10px 15px !important; border-radius: 4px !important; z-index: 2147483647 !important; font-size: 14px !important; max-width: 300px !important; box-shadow: 0 2px 10px rgba(0,0,0,0.2) !important; opacity: 0; animation: manusAiFadeInAndOut 3s ease-in-out forwards !important;}
        .manus-ai-downloader-error { background: rgba(220,53,69,0.9) !important; animation-duration: 3.5s !important; }
        .manus-ai-downloader-error svg { margin-right: 8px; vertical-align: middle; }
        @keyframes manusAiFadeInAndOut { 0%, 100% { opacity: 0; transform: translateY(-10px); } 10%, 90% { opacity: 1; transform: translateY(0); } }

        #hotkeyModal_PageScroller { position: fixed; z-index: 2147483647; background: white; padding: 20px; border-radius: 8px; box-shadow: 0px 0px 15px rgba(0,0,0,0.5); top: 50%; left: 50%; transform: translate(-50%, -50%); max-width: 350px; color: #333; }
        #hotkeyModal_PageScroller h2 { margin-top: 0; margin-bottom:15px; font-size:18px; text-align:center; }
        #hotkeyModal_PageScroller label { display: block; margin-bottom: 5px; font-size:14px; }
        #hotkeyModal_PageScroller input { width: calc(100% - 18px); padding: 8px; border: 1px solid #ccc; border-radius: 4px; margin-bottom:10px; font-size:14px; }
        #hotkeyModal_PageScroller .modal-buttons { text-align: right; margin-top:15px; }
        #hotkeyModal_PageScroller .modal-buttons button { padding: 8px 15px; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px; font-size:14px; }
        #hotkeyModal_PageScroller #saveHotkeys_PageScroller { background-color: #28a745; color: white; }
        #hotkeyModal_PageScroller #closeModal_PageScroller { background-color: #dc3545; color: white; }
    `);

    // --- 主脚本的核心函数 (Cookie, 链接规则列表UI, 主面板显隐控制等) ---
    function main_getPageCookies() { return document.cookie; }
    function main_copyToClipboard(text) {
        if (typeof GM_setClipboard === 'function') { GM_setClipboard(text,'text'); alert('内容已复制到剪贴板！ (GM)'); }
        else { const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed';ta.style.top='-9999px';ta.style.left='-9999px'; document.body.appendChild(ta); ta.focus();ta.select(); try { if(document.execCommand('copy')) alert('内容已复制到剪贴板！'); else prompt('复制失败，请手动复制:', text); } catch(err){prompt('复制操作异常，请手动复制:',text);} document.body.removeChild(ta); }
    }
    function main_createAddForm(listType, listArray, configKey, parentElement) {
        const form = document.createElement('div'); form.className = 'add-form';
        const input = document.createElement('input'); input.type = 'text'; input.placeholder = `添加${listType === 'whitelist' ? '白' : '黑'}名单模式...`;
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addButton.click(); });
        const addButton = document.createElement('button'); addButton.textContent = '添加';
        addButton.onclick = () => { const pattern = input.value.trim(); if (pattern) { if (listArray.includes(pattern)) { alert(`模式 "${pattern}" 已存在!`); return; } listArray.push(pattern); GM_setValue(configKey, listArray.join(',')); input.value = ''; main_renderListsUI(); } else { alert('请输入有效的URL模式！'); } };
        form.appendChild(input); form.appendChild(addButton); parentElement.appendChild(form);
    }

    // *************************************************************************************
    // * PageScroller 模块 (页面滚动控制功能)
    // *************************************************************************************
    const PageScroller = (function() {
        let state = {
            isInfinitelyScrolling: false,
            infiniteScrollIntervalId: null,
            autoStopTimeoutId: null, // 用于非无限滚动时，检查是否到达底部并停止
            backgroundInfiniteScrollEnabled: false,
            pageVisibility: !document.hidden,
            hotkeyTop: '',
            hotkeyOneOffBottom: '', // 新快捷键：一次性到底部
            hotkeyInfiniteToggle: '' // 快捷键：切换无限滚动
        };
        let ui_infiniteScrollToggleButton = null;
        let ui_backgroundInfiniteCheckbox = null;

        const SCROLL_STEP_PX = 300;       // "无限到底部"每次滚动的像素，模拟中键
        const SCROLL_INTERVAL_FG = 700;   // "无限到底部"前台滚动检测/执行间隔 (ms)
        const SCROLL_INTERVAL_BG = 2000;  // "无限到底部"后台滚动检测/执行间隔 (ms)
        const LOAD_WAIT_AFTER_SCROLL = 150; // 每次滚动一小步后，等待内容加载的时间 (ms)

        const currentHostnameBgInfiniteKey = () => MAIN_SCRIPT_CONFIG.scrollerBackgroundInfiniteKeyPrefix + window.location.hostname;

        function _loadSettings() {
            state.hotkeyTop = GM_getValue(MAIN_SCRIPT_CONFIG.scrollerTopKey, 'Home'); // 默认Home键
            state.hotkeyOneOffBottom = GM_getValue(MAIN_SCRIPT_CONFIG.scrollerBottomKey, 'End'); // 默认End键
            state.hotkeyInfiniteToggle = GM_getValue(MAIN_SCRIPT_CONFIG.scrollerInfiniteToggleKey, '');
            state.backgroundInfiniteScrollEnabled = GM_getValue(currentHostnameBgInfiniteKey(), false);
            if (ui_backgroundInfiniteCheckbox) {
                ui_backgroundInfiniteCheckbox.checked = state.backgroundInfiniteScrollEnabled;
            }
            main_log("滚动器设置已加载:", state);
        }

        function _saveHotkeySettings() {
            GM_setValue(MAIN_SCRIPT_CONFIG.scrollerTopKey, state.hotkeyTop);
            GM_setValue(MAIN_SCRIPT_CONFIG.scrollerBottomKey, state.hotkeyOneOffBottom);
            GM_setValue(MAIN_SCRIPT_CONFIG.scrollerInfiniteToggleKey, state.hotkeyInfiniteToggle);
        }

        function _updateToggleButtonVisuals() {
            if (ui_infiniteScrollToggleButton) {
                ui_infiniteScrollToggleButton.textContent = state.isInfinitelyScrolling ? '停止无限滚动' : '无限到底部';
                ui_infiniteScrollToggleButton.classList.toggle('active', state.isInfinitelyScrolling);
            }
        }

        function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
        function scrollToBottomOnce() { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }

        function _performInfiniteScrollStep() {
            if (!state.isInfinitelyScrolling) return;
            if (!state.pageVisibility && !state.backgroundInfiniteScrollEnabled) { // 如果页面不可见且未允许后台滚动
                main_log("无限滚动：页面不可见且未允许后台，暂停。");
                // 不清除 interval，这样返回页面时可以继续，或者在 visibilitychange 中处理
                return;
            }

            const currentScrollY = window.scrollY;
            const pageHeight = document.body.scrollHeight;
            const windowHeight = window.innerHeight;

            if (currentScrollY + windowHeight < pageHeight - 10) { // 未滚动到最底部 (10px容差)
                window.scrollBy({ top: SCROLL_STEP_PX, behavior: 'smooth' });
                // 滚动后等待加载
                setTimeout(() => {
                    if (state.isInfinitelyScrolling) { // 再次检查状态，可能用户已停止
                        // _performInfiniteScrollStep(); // 不再递归，由setInterval控制
                    }
                }, LOAD_WAIT_AFTER_SCROLL);
            } else {
                // main_log("无限滚动：已到达或接近底部，等待新内容或下一次interval触发。");
            }
        }

        function _startInfiniteScroll() {
            if (state.infiniteScrollIntervalId) clearInterval(state.infiniteScrollIntervalId);
            state.isInfinitelyScrolling = true;
            _updateToggleButtonVisuals();
            main_log("开始无限滚动. 后台允许:", state.backgroundInfiniteScrollEnabled, "页面可见:", state.pageVisibility);

            const interval = state.pageVisibility ? SCROLL_INTERVAL_FG : SCROLL_INTERVAL_BG;
            _performInfiniteScrollStep(); // 立即执行一次
            state.infiniteScrollIntervalId = setInterval(_performInfiniteScrollStep, interval);
        }

        function _stopInfiniteScroll() {
            main_log("停止无限滚动.");
            if (state.infiniteScrollIntervalId) clearInterval(state.infiniteScrollIntervalId);
            state.infiniteScrollIntervalId = null;
            state.isInfinitelyScrolling = false;
            _updateToggleButtonVisuals();
        }

        function toggleInfiniteScroll() { // 由UI按钮或快捷键调用
            if (state.isInfinitelyScrolling) {
                _stopInfiniteScroll();
            } else {
                // 确保从UI同步最新的后台滚动设置
                if(ui_backgroundInfiniteCheckbox) state.backgroundInfiniteScrollEnabled = ui_backgroundInfiniteCheckbox.checked;
                _startInfiniteScroll();
            }
        }

        function setBackgroundInfiniteScrollEnabled(enabled) {
            state.backgroundInfiniteScrollEnabled = enabled;
            GM_setValue(currentHostnameBgInfiniteKey(), enabled);
            main_log("后台无限滚动设置更新为:", enabled);
            if (state.isInfinitelyScrolling) { // 如果正在滚动，根据新设置调整行为
                _stopInfiniteScroll(); // 停止当前滚动
                _startInfiniteScroll(); // 以新配置（特别是新的后台间隔逻辑）重新开始
            }
        }

        function loadBackgroundSettingToCheckbox(checkboxElement) {
            if (checkboxElement) {
                ui_backgroundInfiniteCheckbox = checkboxElement; // 绑定UI元素
                state.backgroundInfiniteScrollEnabled = GM_getValue(currentHostnameBgInfiniteKey(), false);
                ui_backgroundInfiniteCheckbox.checked = state.backgroundInfiniteScrollEnabled;
            }
        }

        function handleVisibilityChange() {
            const nowVisible = !document.hidden;
            if (state.pageVisibility === nowVisible) return; // 状态未变
            state.pageVisibility = nowVisible;
            main_log("页面可见性改变:", state.pageVisibility);

            if (state.isInfinitelyScrolling) {
                if (state.pageVisibility || state.backgroundInfiniteScrollEnabled) {
                    main_log("页面可见或允许后台滚动，重新启动/调整无限滚动定时器。");
                    _stopInfiniteScroll(); // 先停止，确保使用正确的间隔
                    _startInfiniteScroll();
                } else {
                    main_log("页面不可见且禁止后台滚动，暂时停止无限滚动定时器 (但状态保留)。");
                    if (state.infiniteScrollIntervalId) clearInterval(state.infiniteScrollIntervalId);
                    // isInfinitelyScrolling 状态仍然是true，返回时会恢复
                }
            }
        }
        document.addEventListener("visibilitychange", handleVisibilityChange, false);

        function showHotkeyModal() {
            if (document.getElementById('hotkeyModal_PageScroller')) return;
            let tempHotkeyTop = state.hotkeyTop;
            let tempHotkeyOneOffBottom = state.hotkeyOneOffBottom;
            let tempHotkeyInfiniteToggle = state.hotkeyInfiniteToggle;

            const modalHtml = `
                <div id="hotkeyModal_PageScroller">
                    <h2>设置滚动快捷键</h2>
                    <div><label for="hkInputTop_PS">回到顶部:</label><input id="hkInputTop_PS" value="${tempHotkeyTop}" readonly /></div>
                    <div><label for="hkInputBottom_PS">直达底部 (一次性):</label><input id="hkInputBottom_PS" value="${tempHotkeyOneOffBottom}" readonly /></div>
                    <div><label for="hkInputInfinite_PS">切换无限到底部:</label><input id="hkInputInfinite_PS" value="${tempHotkeyInfiniteToggle}" readonly /></div>
                    <div class="modal-buttons">
                        <button id="saveHotkeys_PageScroller">保存</button> <button id="closeModal_PageScroller">关闭</button>
                    </div>
                </div>`;
            const modalContainer = document.createElement('div'); modalContainer.innerHTML = modalHtml; document.body.appendChild(modalContainer);
            const inputs = {
                top: document.getElementById('hkInputTop_PS'),
                bottom: document.getElementById('hkInputBottom_PS'),
                infinite: document.getElementById('hkInputInfinite_PS')
            };
            const placeholders = { top: tempHotkeyTop || '未设置', bottom: tempHotkeyOneOffBottom||'未设置', infinite: tempHotkeyInfiniteToggle||'未设置' };
            Object.values(inputs).forEach(input => {
                input.placeholder = placeholders[input.id.split('_')[0].replace('hkInput','')];
                input.value = input.placeholder; // 显示当前值
                input.addEventListener('click', function() { this.value = '按下按键...'; this.placeholder = '按下按键...'; });
                input.addEventListener('keydown', function(event) {
                    event.preventDefault();
                    const key = event.key.toLowerCase() === "escape" ? "" : (event.key.length === 1 ? event.key.toLowerCase() : event.key);
                    this.value = key || this.placeholder; // 如果清空则显示placeholder
                    if (this.id === 'hkInputTop_PS') tempHotkeyTop = key;
                    else if (this.id === 'hkInputBottom_PS') tempHotkeyOneOffBottom = key;
                    else if (this.id === 'hkInputInfinite_PS') tempHotkeyInfiniteToggle = key;
                });
                input.addEventListener('blur', function() {
                    if (this.value === '按下按键...') { this.value = this.placeholder; }
                });
            });
            document.getElementById('saveHotkeys_PageScroller').onclick = () => {
                state.hotkeyTop = tempHotkeyTop; state.hotkeyOneOffBottom = tempHotkeyOneOffBottom; state.hotkeyInfiniteToggle = tempHotkeyInfiniteToggle;
                _saveHotkeySettings(); alert('滚动快捷键已保存!'); closeModal();
            };
            document.getElementById('closeModal_PageScroller').onclick = closeModal; function closeModal() { modalContainer.remove(); }
        }

        document.addEventListener('keydown', function (event) {
            if (event.target.matches('input, textarea, [contenteditable="true"], [contenteditable]')) return;
            const key = event.key.toLowerCase();
            if (state.hotkeyTop && key === state.hotkeyTop.toLowerCase()) { scrollToTop(); }
            else if (state.hotkeyOneOffBottom && key === state.hotkeyOneOffBottom.toLowerCase()) { scrollToBottomOnce(); }
            else if (state.hotkeyInfiniteToggle && key === state.hotkeyInfiniteToggle.toLowerCase()) {
                // 快捷键直接切换状态，UI面板中的按钮状态需要找到并同步（如果面板可见）
                if (ui_infiniteScrollToggleButton && ui_backgroundInfiniteCheckbox) {
                    toggleInfiniteScroll(ui_infiniteScrollToggleButton, ui_backgroundInfiniteCheckbox);
                } else { // 如果UI面板未创建或按钮未绑定，直接操作内部状态
                    if (state.isInfinitelyScrolling) _stopInfiniteScroll(); else _startInfiniteScroll();
                }
            }
        });
        _loadSettings(); // 模块加载时读取快捷键

        return {
            scrollToTop, scrollToBottomOnce, toggleInfiniteScroll, showHotkeyModal,
            bindToUI: (toggleButton, infiniteCheckbox) => { // 用于主UI创建时绑定
                ui_infiniteScrollToggleButton = toggleButton;
                ui_backgroundInfiniteCheckbox = infiniteCheckbox;
                loadBackgroundSettingToCheckbox(infiniteCheckbox); // 加载并设置复选框状态
                _updateToggleButtonVisuals(); // 更新按钮初始视觉状态
            },
            setBackgroundInfiniteScrollEnabled, // UI复选框改变时调用
            isInfinitelyScrolling: () => state.isInfinitelyScrolling,
        };
    })();

    // ======================================================================
    // ================ 核心：添加此处缺失的函数 =======================
    // ======================================================================
    function main_renderListsUI() {
        if (!main_uiPanel || !document.body.contains(main_uiPanel)) return;

        const renderList = (listType, listArray, configKey) => {
            const ul = document.getElementById(`main-${listType}-ul`);
            if (!ul) return;
            ul.innerHTML = '';

            if (listArray.length === 0) {
                const emptyMsg = document.createElement('li');
                emptyMsg.className = 'panel-empty-msg';
                emptyMsg.textContent = `列表为空`;
                ul.appendChild(emptyMsg);
            } else {
                listArray.forEach((pattern, index) => {
                    const li = document.createElement('li');
                    const textSpan = document.createElement('span');
                    textSpan.className = 'pattern-text';
                    textSpan.textContent = pattern;
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-btn';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.title = `删除 "${pattern}"`;
                    deleteBtn.onclick = () => {
                        listArray.splice(index, 1);
                        GM_setValue(configKey, listArray.join(','));
                        main_renderListsUI();
                    };
                    li.appendChild(textSpan);
                    li.appendChild(deleteBtn);
                    ul.appendChild(li);
                });
            }
        };

        renderList('whitelist', main_userWhitelist, MAIN_SCRIPT_CONFIG.whitelistKey);
        renderList('blacklist', main_userBlacklist, MAIN_SCRIPT_CONFIG.blacklistKey);
        main_log("UI 列表已刷新");
    }
    // ======================================================================

    function main_createUIPanel() {
        main_log("main_createUIPanel 调用");
        if (!document.body) { main_log("document.body 未准备好，延迟创建"); setTimeout(main_createUIPanel, 100); return; }
        if (main_uiPanel && document.body.contains(main_uiPanel)) { // 改为检查是否已在DOM中
            main_log("面板已存在于DOM，仅更新状态和内容");
            main_uiPanel.classList.toggle('panel-visible', main_panelVisible);
            if(main_panelVisible) main_renderListsUI(); // 确保列表在显示时刷新
              // 刷新滚动UI
            const scrollBtn = document.getElementById('infiniteScrollToggleButton_main');
            const infiniteCheck = document.getElementById('backgroundInfiniteScrollCheckbox_main');
            if(scrollBtn && infiniteCheck) PageScroller.bindToUI(scrollBtn, infiniteCheck);

            main_log("面板已存在，classList:", main_uiPanel.classList.toString());
            return;
        }
        main_log("创建新的UI面板DOM");
        main_uiPanel = document.createElement('div'); main_uiPanel.id = 'superAssistantPanel';
        const header = document.createElement('div'); header.className = 'panel-header'; header.textContent = '超级助手面板'; main_uiPanel.appendChild(header);
        const scrollableContent = document.createElement('div'); scrollableContent.className = 'panel-content-scrollable';

        // 链接新标签页规则区
        const linkRulesSection = document.createElement('div');
        const linkRulesTitle = document.createElement('h4'); linkRulesTitle.className = 'section-title'; linkRulesTitle.textContent = '链接新标签页规则:'; linkRulesSection.appendChild(linkRulesTitle);
        ['whitelist', 'blacklist'].forEach(type => { const subSection = document.createElement('div'); const subTitle = document.createElement('h5'); subTitle.style.cssText = 'font-size: 13px; font-weight: normal; margin-bottom: 4px;'; subTitle.textContent = type === 'whitelist' ? '白名单 (启用):' : '黑名单 (禁用):'; subSection.appendChild(subTitle); main_createAddForm(type, type === 'whitelist' ? main_userWhitelist : main_userBlacklist, type === 'whitelist' ? MAIN_SCRIPT_CONFIG.whitelistKey : MAIN_SCRIPT_CONFIG.blacklistKey, subSection); const ul = document.createElement('ul'); ul.id = `main-${type}-ul`; subSection.appendChild(ul); linkRulesSection.appendChild(subSection); });
        scrollableContent.appendChild(linkRulesSection);

        // Cookie 管理区
        const cookieSection = document.createElement('div'); cookieSection.className = 'cookie-section'; const cookieTitle = document.createElement('h4'); cookieTitle.className = 'section-title'; cookieTitle.textContent = 'Cookie 管理:'; cookieSection.appendChild(cookieTitle); const cookieDisplayArea = document.createElement('textarea'); cookieDisplayArea.id = 'main-cookie-display'; cookieDisplayArea.readOnly = true; cookieDisplayArea.className = 'cookie-display'; cookieDisplayArea.placeholder = '点击“获取Cookies”按钮显示...\n(注意: HttpOnly Cookies 无法获取)'; cookieSection.appendChild(cookieDisplayArea); const cookieActionsDiv = document.createElement('div'); cookieActionsDiv.className = 'actions-group'; const getCookieButton = document.createElement('button'); getCookieButton.textContent = '获取Cookies'; getCookieButton.className = 'btn-info'; getCookieButton.onclick = () => { const cookies = main_getPageCookies(); cookieDisplayArea.value = cookies || ''; cookieDisplayArea.placeholder = cookies ? 'Cookies 已获取 (不含 HttpOnly)' : '当前页面没有可访问的 Cookies。'; }; const copyCookieButton = document.createElement('button'); copyCookieButton.textContent = '复制Cookies'; copyCookieButton.className = 'btn-secondary'; copyCookieButton.onclick = () => { if (cookieDisplayArea.value) main_copyToClipboard(cookieDisplayArea.value); else alert('文本框中没有 Cookies 内容可复制。'); }; cookieActionsDiv.appendChild(getCookieButton); cookieActionsDiv.appendChild(copyCookieButton); cookieSection.appendChild(cookieActionsDiv); scrollableContent.appendChild(cookieSection);

        // 页面滚动控制区
        const scrollerSection = document.createElement('div'); scrollerSection.className = 'scroller-section';
        const scrollerTitle = document.createElement('h4'); scrollerTitle.className = 'section-title'; scrollerTitle.textContent = '页面滚动控制:'; scrollerSection.appendChild(scrollerTitle);
        const scrollerActionsDiv = document.createElement('div'); scrollerActionsDiv.className = 'scroller-actions';

        const topRow = document.createElement('div'); topRow.className = 'single-button-row actions-group';
        const scrollToTopButton = document.createElement('button'); scrollToTopButton.textContent = '回到顶部'; scrollToTopButton.className = 'btn-primary';
        scrollToTopButton.onclick = PageScroller.scrollToTop;
        const scrollToBottomButton = document.createElement('button'); scrollToBottomButton.textContent = '直达底部'; scrollToBottomButton.className = 'btn-primary';
        scrollToBottomButton.onclick = PageScroller.scrollToBottomOnce;
        topRow.appendChild(scrollToTopButton); topRow.appendChild(scrollToBottomButton);
        scrollerActionsDiv.appendChild(topRow);

        const infiniteScrollRow = document.createElement('div'); infiniteScrollRow.className = 'scroll-row actions-group';
        const infiniteScrollToggleButton = document.createElement('button');
        infiniteScrollToggleButton.id = 'infiniteScrollToggleButton_main'; // 给按钮一个ID
        infiniteScrollToggleButton.className = 'btn-info btn-toggle-scroll';
        infiniteScrollRow.appendChild(infiniteScrollToggleButton); // 按钮放前面

        const infiniteOptionsDiv = document.createElement('div'); infiniteOptionsDiv.className = 'infinite-scroll-options';
        const backgroundInfiniteCheckbox = document.createElement('input');
        backgroundInfiniteCheckbox.type = 'checkbox';
        backgroundInfiniteCheckbox.id = 'backgroundInfiniteScrollCheckbox_main'; // ID
        const backgroundInfiniteLabel = document.createElement('label');
        backgroundInfiniteLabel.htmlFor = 'backgroundInfiniteScrollCheckbox_main';
        backgroundInfiniteLabel.textContent = '后台持续';
        backgroundInfiniteLabel.title = '勾选后，即使切换到其他浏览器标签页，无限滚动也会尝试继续。';
        infiniteOptionsDiv.appendChild(backgroundInfiniteCheckbox);
        infiniteOptionsDiv.appendChild(backgroundInfiniteLabel);
        infiniteScrollRow.appendChild(infiniteOptionsDiv); // 复选框和标签放按钮后面

        // 绑定 PageScroller 的 UI 元素
        PageScroller.bindToUI(infiniteScrollToggleButton, backgroundInfiniteCheckbox);

        infiniteScrollToggleButton.onclick = () => PageScroller.toggleInfiniteScroll();
        backgroundInfiniteCheckbox.onchange = () => PageScroller.setBackgroundInfiniteScrollEnabled(backgroundInfiniteCheckbox.checked);

        scrollerActionsDiv.appendChild(infiniteScrollRow);
        scrollerSection.appendChild(scrollerActionsDiv);
        scrollableContent.appendChild(scrollerSection);

        // AI 媒体下载区 (与之前版本相同)
        const aiDownloaderSection = document.createElement('div'); aiDownloaderSection.className = 'ai-downloader-section'; const aiDownloaderTitle = document.createElement('h4'); aiDownloaderTitle.className = 'section-title'; aiDownloaderTitle.textContent = 'AI 媒体下载'; aiDownloaderSection.appendChild(aiDownloaderTitle); const aiAuthorCredit = document.createElement('div'); aiAuthorCredit.className = 'ai-downloader-author'; aiAuthorCredit.textContent = `功能模块作者: 醉春风 (v${AIContentDownloader && AIContentDownloader.CONFIG ? AIContentDownloader.CONFIG.VERSION : 'N/A'})`; aiDownloaderSection.appendChild(aiAuthorCredit); const aiActionsDiv = document.createElement('div'); aiActionsDiv.className = 'actions-group'; const toggleMediaPanelButton = document.createElement('button'); toggleMediaPanelButton.textContent = '显示/隐藏媒体列表'; toggleMediaPanelButton.className = 'btn-primary'; toggleMediaPanelButton.onclick = () => AIContentDownloader.toggleMediaPanel(); const manualScanButton = document.createElement('button'); manualScanButton.textContent = '手动扫描媒体'; manualScanButton.className = 'btn-info'; manualScanButton.onclick = () => AIContentDownloader.scanForMedia(); aiActionsDiv.appendChild(toggleMediaPanelButton); aiActionsDiv.appendChild(manualScanButton); aiDownloaderSection.appendChild(aiActionsDiv); scrollableContent.appendChild(aiDownloaderSection);

        main_uiPanel.appendChild(scrollableContent);
        const closeButton = document.createElement('button'); closeButton.textContent = '关闭面板';
        closeButton.className = 'close-panel-btn'; closeButton.onclick = main_togglePanelVisibility; main_uiPanel.appendChild(closeButton);
        document.body.appendChild(main_uiPanel);
        main_log("UI面板已附加到body");
        main_renderListsUI();
        if (main_panelVisible) main_uiPanel.classList.add('panel-visible'); // 确保根据状态显示
        main_log(`UI面板创建后，classList:`, main_uiPanel.classList.toString());
    }

    function main_togglePanelVisibility() { /* ... (与之前版本类似，确保调用 main_createUIPanel 和 classList.toggle/add/remove) ... */
        main_log(`main_togglePanelVisibility 调用前，main_panelVisible: ${main_panelVisible}`);
        main_panelVisible = !main_panelVisible;
        GM_setValue(MAIN_SCRIPT_CONFIG.panelVisibleKey, main_panelVisible);
        main_log(`main_togglePanelVisibility 调用后，main_panelVisible: ${main_panelVisible}`);

        if (!main_uiPanel || !document.body.contains(main_uiPanel)) {
            main_log("面板不存在或未附加，调用 main_createUIPanel");
            main_createUIPanel(); // createUIPanel 内部会根据最新的 main_panelVisible 设置显示
        } else {
            main_log("面板已存在，切换 .panel-visible 类");
            main_uiPanel.classList.toggle('panel-visible', main_panelVisible);
            if(main_panelVisible) main_renderListsUI(); // 如果是显示，则刷新列表
        }
        if (main_uiPanel) main_log("面板最终classList:", main_uiPanel.classList.toString());
    }
    function main_loadConfig() { /* ... (与之前版本相同) ... */
        main_log("main_loadConfig 调用");
        const storedWhitelistStr = GM_getValue(MAIN_SCRIPT_CONFIG.whitelistKey); const storedBlacklistStr = GM_getValue(MAIN_SCRIPT_CONFIG.blacklistKey);
        main_userWhitelist = (typeof storedWhitelistStr === 'string' && storedWhitelistStr.trim() !== '') ? storedWhitelistStr.split(',').map(s => s.trim()).filter(s => s) : (typeof storedWhitelistStr === 'undefined' ? (GM_setValue(MAIN_SCRIPT_CONFIG.whitelistKey, MAIN_SCRIPT_CONFIG.defaultWhitelist.join(',')), [...MAIN_SCRIPT_CONFIG.defaultWhitelist]) : []);
        main_userBlacklist = (typeof storedBlacklistStr === 'string' && storedBlacklistStr.trim() !== '') ? storedBlacklistStr.split(',').map(s => s.trim()).filter(s => s) : (typeof storedBlacklistStr === 'undefined' ? (GM_setValue(MAIN_SCRIPT_CONFIG.blacklistKey, MAIN_SCRIPT_CONFIG.defaultBlacklist.join(',')), [...MAIN_SCRIPT_CONFIG.defaultBlacklist]) : []);
        if (main_uiPanel && main_panelVisible && document.body.contains(main_uiPanel)) { main_log("配置已加载，面板可见，刷新UI列表"); main_renderListsUI(); }
    }
    function main_urlMatchesPattern(url, pattern) { /* ... (与之前版本相同) ... */
        if (!pattern || !url) return false; let currentUrl = url; let p = pattern.trim(); if (!p.includes("://")) { currentUrl = currentUrl.replace(/^https?:\/\//, ""); } if (!p.startsWith("www.") && !p.includes("://") && currentUrl.startsWith("www.")) { currentUrl = currentUrl.replace(/^www\./, "");} const escapedPattern = p.replace(/[.+?^${}()|[\]\\]/g, '\\$&'); const regexString = '^' + escapedPattern.replace(/\\\*/g, '.*') + '$'; try { return new RegExp(regexString, 'i').test(currentUrl); } catch (e) { return false; }
    }

    // 菜单命令 (增加滚动快捷键设置)
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('配置 "链接新标签页" 白名单 (Prompt)', () => { /* ... */ const c=GM_getValue(MAIN_SCRIPT_CONFIG.whitelistKey,main_userWhitelist.join(','));const n=prompt('白名单(启用链接新标签页),逗号分隔:',c);if(n!==null){GM_setValue(MAIN_SCRIPT_CONFIG.whitelistKey,n);main_loadConfig();alert('链接白名单已更新！');}}, 'L');
        GM_registerMenuCommand('配置 "链接新标签页" 黑名单 (Prompt)', () => { /* ... */ const c=GM_getValue(MAIN_SCRIPT_CONFIG.blacklistKey,main_userBlacklist.join(','));const n=prompt('黑名单(禁用链接新标签页),逗号分隔:',c);if(n!==null){GM_setValue(MAIN_SCRIPT_CONFIG.blacklistKey,n);main_loadConfig();alert('链接黑名单已更新！');}}, 'K');
        GM_registerMenuCommand('设置页面滚动快捷键', PageScroller.showHotkeyModal, 'S');
        GM_registerMenuCommand('显示/隐藏 超级助手面板', main_togglePanelVisibility, 'P');
    }

    // AIContentDownloader 模块 (与版本1.7.1一致，此处省略以减少篇幅，实际使用时需完整粘贴)
    const AIContentDownloader = (function() { /* ... (完整的 AIContentDownloader 模块代码) ... */
        const CONFIG = { DEBUG: false, INIT_DELAY: 2500, RETRY_DELAY: 3000, MAX_RETRIES: 2, AUTHOR: "醉春风", VERSION: "3.4" };
        const state = { platform: null, mediaItems: [], selectedItems: [], isProcessing: false, isPanelOpen: false, mediaMap: new Map(), mediaUrls: new Set(), windowLock: false, instanceId: 'manus_ai_dl_' + Math.random().toString(36).substr(2, 9), initRetries: 0, observer: null, observerScanTimeout: null };
        const log = (...args) => { if (CONFIG.DEBUG) console.log(`[AI下载模块 v${CONFIG.VERSION}]`, ...args); };
        const error = (...args) => { console.error(`[AI下载模块 v${CONFIG.VERSION}]`, ...args); };
        const ICONS = { image: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>`, video: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>`, download: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`, error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`, };
        class MediaItem { constructor(element, type, url = null) { this.id = 'media_' + Math.random().toString(36).substr(2, 9); this.element = element; this.type = type; this.url = url || (element ? (element.src || element.currentSrc) : null); this.highestQualityUrl = this.url; this.width = element ? (element.naturalWidth || element.videoWidth || 0) : 0; this.height = element ? (element.naturalHeight || element.videoHeight || 0) : 0; this.duration = type === 'video' && element ? element.duration : 0; this.selected = false; this.timestamp = Date.now(); this.videoLoaded = false; this.thumbnailLoaded = false; } createThumbnailElement() { const itemDiv = document.createElement('div'); itemDiv.className = `manus-ai-media-item ${this.type}`; itemDiv.dataset.id = this.id; const thumbnailContainer = document.createElement('div'); thumbnailContainer.className = 'manus-ai-media-thumbnail-container'; if (this.url) { try { const placeholder = document.createElement('div'); placeholder.innerHTML = this.type === 'image' ? ICONS.image : ICONS.video; placeholder.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background-color:#2a2a2a;'; thumbnailContainer.appendChild(placeholder); if (this.type === 'image') { const img = document.createElement('img'); img.src = this.url; img.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;'; img.crossOrigin = 'anonymous'; img.loading = 'lazy'; img.decoding = 'async'; img.onload = () => { this.thumbnailLoaded = true; if(placeholder.parentNode) placeholder.remove(); }; img.onerror = () => {}; thumbnailContainer.appendChild(img); } else { const video = document.createElement('video'); video.src = this.url; video.crossOrigin = 'anonymous'; video.muted = true; video.preload = 'metadata'; video.style.cssText = 'width:100%;height:100%;object-fit:cover;position:absolute;top:0;left:0;'; video.addEventListener('loadeddata', () => { this.videoLoaded = true; this.thumbnailLoaded = true; this.duration = video.duration || 0; const durationEl = itemDiv.querySelector('.manus-ai-media-duration'); if (durationEl) durationEl.textContent = this.formatDuration(this.duration); if(placeholder.parentNode) placeholder.remove(); }); video.addEventListener('error', () => {}); thumbnailContainer.appendChild(video); } } catch (e) { error('创建缩略图DOM出错:', e); thumbnailContainer.innerHTML = this.type === 'image' ? ICONS.image : ICONS.video; } } else { thumbnailContainer.innerHTML = this.type === 'image' ? ICONS.image : ICONS.video; } itemDiv.appendChild(thumbnailContainer); if (this.type === 'video') { const durationSpan = document.createElement('span'); durationSpan.className = 'manus-ai-media-duration'; durationSpan.textContent = this.formatDuration(this.duration); itemDiv.appendChild(durationSpan); } const checkbox = document.createElement('div'); checkbox.className = 'manus-ai-media-checkbox'; if (this.selected) checkbox.classList.add('checked'); itemDiv.appendChild(checkbox); itemDiv.addEventListener('click', (e) => { if (state.windowLock) return; const rect = checkbox.getBoundingClientRect(); const isCheckboxClick = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom); if (isCheckboxClick) { this.toggleSelect(); UI.updateSelectedCounter(); UI.updateDownloadButton(); } else { if (this.url) { if (typeof GM_openInTab === 'function') { GM_openInTab(this.url, { active: true, insert: true }); } else { window.open(this.url, '_blank'); } } else { UI.showError("此媒体项没有有效的URL可打开。"); } } }); return itemDiv; } toggleSelect() {this.selected = !this.selected; const itemElement = document.querySelector(`.manus-ai-media-item[data-id="${this.id}"]`); if (itemElement) { itemElement.classList.toggle('selected', this.selected); itemElement.querySelector('.manus-ai-media-checkbox').classList.toggle('checked', this.selected); } if (this.selected) { if (!state.selectedItems.includes(this.id)) state.selectedItems.push(this.id); } else { const index = state.selectedItems.indexOf(this.id); if (index !== -1) state.selectedItems.splice(index, 1); } } setSelected(selected) { if (this.selected !== selected) this.toggleSelect(); } formatDuration(seconds) { if (!seconds || isNaN(seconds)) return '0:00'; seconds = Math.round(seconds); const m = Math.floor(seconds / 60); const s = seconds % 60; return `${m}:${s.toString().padStart(2, '0')}`;}}
        const UI = { createPreviewPanel: () => { let panel = document.querySelector('.manus-ai-preview-panel'); if (panel) return panel; panel = document.createElement('div'); panel.className = 'manus-ai-preview-panel'; panel.dataset.instanceId = state.instanceId; panel.innerHTML = `<div class="manus-ai-preview-header"><div class="manus-ai-preview-title">媒体内容 <span class="manus-ai-author-credit">by ${CONFIG.AUTHOR}</span> v${CONFIG.VERSION}</div><button class="manus-ai-preview-close" title="关闭媒体列表">×</button></div><div class="manus-ai-preview-toolbar"><button class="manus-ai-select-all" title="全选所有媒体">全选</button> <button class="manus-ai-select-none" title="取消所有选择">无</button><button class="manus-ai-select-images" title="仅选择图片">图片</button> <button class="manus-ai-select-videos" title="仅选择视频">视频</button><div class="manus-ai-preview-counter">已选: 0</div></div><div class="manus-ai-preview-content"></div><div class="manus-ai-preview-footer"><button class="manus-ai-download-btn" disabled> ${ICONS.download} 下载选中(0) </button><button class="manus-ai-cancel-btn">关闭</button></div>`; document.body.appendChild(panel); panel.querySelector('.manus-ai-preview-close').addEventListener('click', () => UI.togglePreviewPanel(false)); panel.querySelector('.manus-ai-cancel-btn').addEventListener('click', () => UI.togglePreviewPanel(false)); panel.querySelector('.manus-ai-select-all').addEventListener('click', UI.selectAll); panel.querySelector('.manus-ai-select-none').addEventListener('click', UI.selectNone); panel.querySelector('.manus-ai-select-images').addEventListener('click', () => UI.selectByType('image')); panel.querySelector('.manus-ai-select-videos').addEventListener('click', () => UI.selectByType('video')); panel.querySelector('.manus-ai-download-btn').addEventListener('click', UI.startDownload); return panel; }, showNotification: (message, duration = 2500) => { const n = document.createElement('div'); n.className = 'manus-ai-downloader-notification'; n.textContent = message; document.body.appendChild(n); setTimeout(() => n.remove(), duration); }, showError: (message, duration = 3500) => { const e = document.createElement('div'); e.className = 'manus-ai-downloader-error'; e.innerHTML = `${ICONS.error} ${message}`; document.body.appendChild(e); setTimeout(() => e.remove(), duration); }, togglePreviewPanel: (show = null) => { const panel = UI.createPreviewPanel(); const isCurrentlyShown = panel.classList.contains('show'); const shouldShow = show !== null ? show : !isCurrentlyShown; if (shouldShow) { panel.classList.add('show'); state.isPanelOpen = true; UI.refreshPreviewContent(); } else { panel.classList.remove('show'); state.isPanelOpen = false; } }, refreshPreviewContent: () => { const cc = document.querySelector('.manus-ai-preview-panel .manus-ai-preview-content'); if (!cc) return; cc.innerHTML = ''; if (state.mediaItems.length === 0) { cc.innerHTML = '<div style="grid-column: 1 / -1; color: #aaa; text-align: center; padding: 20px;">暂无媒体或尝试手动扫描</div>'; } else { [...state.mediaItems].sort((a, b) => b.timestamp - a.timestamp).forEach(item => cc.appendChild(item.createThumbnailElement())); } UI.updateSelectedCounter(); UI.updateDownloadButton(); }, updateSelectedCounter: () => { const c = document.querySelector('.manus-ai-preview-counter'); if (c) c.textContent = `已选: ${state.selectedItems.length}`; }, updateDownloadButton: () => { const b = document.querySelector('.manus-ai-download-btn'); if(!b)return; const cnt = state.selectedItems.length; b.disabled = cnt === 0; b.innerHTML = `${ICONS.download} 下载选中(${cnt})`; }, selectAll: () => { state.mediaItems.forEach(i => i.setSelected(true)); UI.updateSelectedCounter(); UI.updateDownloadButton(); }, selectNone: () => { state.mediaItems.forEach(i => i.setSelected(false)); UI.updateSelectedCounter(); UI.updateDownloadButton(); }, selectByType: (t) => { state.mediaItems.forEach(i => i.setSelected(i.type === t)); UI.updateSelectedCounter(); UI.updateDownloadButton(); }, startDownload: () => { const itemsToDownload = state.mediaItems.filter(item => state.selectedItems.includes(item.id)); if (itemsToDownload.length === 0) { UI.showError('没有选中任何项'); return; } UI.showNotification(`开始下载 ${itemsToDownload.length} 个媒体项...`); itemsToDownload.forEach((item, index) => { setTimeout(() => { if (!item.url) { UI.showError(`媒体项 #${index+1} URL无效`); return; } const ext = item.type === 'video' ? (item.url.match(/\.(mp4|webm|mov|mkv|avi)/i)?.[1] || 'mp4') : (item.url.match(/\.(jpg|jpeg|png|gif|webp|bmp|svg)/i)?.[1] || 'jpg'); const ts = new Date().toISOString().replace(/[-:.]/g, '').replace('T','_'); const fileName = `${item.type}_${CONFIG.AUTHOR}_${ts}_${index + 1}.${ext}`; if (typeof GM_download === 'function') { GM_download({ url: item.url, name: fileName, saveAs: false, onload: () => log(`${fileName} 下载完成。`), onerror: (err) => { error(`下载 ${fileName} 失败:`, err.error || err); UI.showError(`${fileName.substring(0,20)}... 下载失败`); }}); } else { const a = document.createElement('a'); a.href = item.url; a.download = fileName; document.body.appendChild(a); a.click(); document.body.removeChild(a); }}, index * 700);});}};
        const utils = { detectPlatform: () => { const url = window.location.href.toLowerCase(); const host = window.location.hostname.toLowerCase(); if (host.includes('klingai.com') || host.includes('kuaishou.com') || host.includes('kuaishou.cn') || host.includes('app.klingai.com')) return 'keling'; if (host.includes('mjianying.com') || host.includes('dreamina.capcut.com') || host.includes('capcut.com')) return 'jimeng'; if (host.includes('googleusercontent.com')) { if (url.includes('/youtube.com/')) return 'generic_video'; return 'generic_image';} if (document.querySelector('[class*="kl-"], [data-kl]')) return 'keling'; if (document.querySelector('[class*="jm-"], [data-jm], [class*="capcut"], [class*="jianying"]')) return 'jimeng'; const title = document.title.toLowerCase(); if (title.includes('可灵') || title.includes('kling')) return 'keling'; if (title.includes('即梦') || title.includes('jimeng') || title.includes('capcut') || title.includes('剪映')) return 'jimeng'; return null; }, isUrlProcessed: (url) => { if (!url) return true; return state.mediaUrls.has(url); }, markUrlAsProcessed: (url) => { if (url) state.mediaUrls.add(url); }, cleanupDuplicateMedia: () => { const uniqueUrls = new Set(); const uniqueItems = []; for (let i = state.mediaItems.length - 1; i >= 0; i--) { const item = state.mediaItems[i]; if (item.url && !uniqueUrls.has(item.url)) { uniqueUrls.add(item.url); uniqueItems.push(item); }} uniqueItems.reverse(); if (state.mediaItems.length !== uniqueItems.length) { state.mediaItems = uniqueItems; log(`清理后媒体项: ${uniqueItems.length}`);}}};
        const platforms = { keling: { selectors: ['video[src]', 'img[src]', 'div[style*="background-image"]', '[class*="video"] video', '[class*="image"] img', '[class*="gallery"] img', '[class*="player"] video'] }, jimeng: { selectors: ['video[src]', 'img[src]', 'div[style*="background-image"]', '[class*="player"] video', '[class*="preview"] img', '[class*="image-render"] img', '[class*="canvas"] canvas'] }, generic_video: { selectors: ['video[src]'] }, generic_image: { selectors: ['img[src]', 'div[style*="background-image"]'] }};
        function findAndProcessMedia() { if (!state.platform && state.platform !== null) { state.platform = utils.detectPlatform() || 'generic_image'; } else if (state.platform === null) { state.platform = utils.detectPlatform() || 'generic_image';} log(`扫描媒体 (平台: ${state.platform})...`); let newMediaFound = false; const platformConfig = platforms[state.platform] || { selectors: ['video[src]','img[src]', 'div[style*="background-image"]'] }; platformConfig.selectors.forEach(selector => { try { document.querySelectorAll(selector).forEach(element => { let url = null; let type = 'image'; if (element.tagName === 'IMG') { url = element.src; type = 'image'; } else if (element.tagName === 'VIDEO') { url = element.src || element.currentSrc; type = 'video'; } else if (element.tagName === 'DIV' && selector.includes('background-image')) { const bgStyle = window.getComputedStyle(element).backgroundImage; if (bgStyle && bgStyle.startsWith('url("') && bgStyle.endsWith('")')) { url = bgStyle.slice(5, -2); type = 'image';} } else if (element.tagName === 'CANVAS' && state.platform === 'jimeng') { try { url = element.toDataURL('image/png'); type = 'image'; } catch (e) { return; } } if (!url || utils.isUrlProcessed(url)) return; if (type === 'image' && (element.naturalWidth < 50 || element.naturalHeight < 50) && !url.startsWith('data:')) return; utils.markUrlAsProcessed(url); const mediaItem = new MediaItem(null, type, url); mediaItem.width = element.naturalWidth || element.videoWidth || element.width || 0; mediaItem.height = element.naturalHeight || element.videoHeight || element.height || 0; if (type === 'video') mediaItem.duration = element.duration || 0; state.mediaItems.push(mediaItem); newMediaFound = true; }); } catch (e) { error(`选择器 ${selector} 出错:`, e); } }); if (newMediaFound) { utils.cleanupDuplicateMedia(); if (state.isPanelOpen) UI.refreshPreviewContent(); } return newMediaFound; }
        function setupNetworkListener() { const processPotentialMediaUrl = (url) => { if (url && (url.match(/\.(jpe?g|png|gif|webp|mp4|webm|mov|mkv|avi|bmp|svg)/i) || url.includes('/image/') || url.includes('/video/') || url.startsWith('blob:') || url.startsWith('data:image') || url.startsWith('data:video'))) { if (utils.isUrlProcessed(url)) return; const type = (url.match(/\.(mp4|webm|mov|mkv|avi)/i) || url.includes('/video/') || url.startsWith('data:video')) ? 'video' : 'image'; utils.markUrlAsProcessed(url); const mediaItem = new MediaItem(null, type, url); state.mediaItems.push(mediaItem); utils.cleanupDuplicateMedia(); if (state.isPanelOpen) UI.refreshPreviewContent(); }}; if(window.XMLHttpRequest_ManusAiHooked) return; const origXHR = window.XMLHttpRequest; window.XMLHttpRequest = function() { const xhr = new origXHR(); xhr.addEventListener('load', function() { if(this.responseURL) processPotentialMediaUrl(this.responseURL); }); return xhr; }; window.XMLHttpRequest_ManusAiHooked = true; if(window.fetch_ManusAiHooked) return; const origFetch = window.fetch; window.fetch = function(...args) { return origFetch.apply(this, args).then(response => { if (response && response.url) processPotentialMediaUrl(response.url); return response.clone(); }).catch(err => { error("Fetch hook error:", err); throw err;}); }; window.fetch_ManusAiHooked = true;}
        function startObserver() { if (state.observer) state.observer.disconnect(); state.observer = new MutationObserver((mutations) => { let p = mutations.some(m => (m.type==='childList'&&m.addedNodes.length>0) || (m.type==='attributes'&&(m.attributeName==='src'||m.attributeName==='currentSrc'||m.attributeName==='style'||m.attributeName==='href'))); if(p){clearTimeout(state.observerScanTimeout); state.observerScanTimeout = setTimeout(findAndProcessMedia,700);}}); if(document.body) state.observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'currentSrc', 'style', 'href'] }); else setTimeout(startObserver, 500); }
        function initializeScript() { log(`尝试初始化AI下载模块 (第 ${state.initRetries + 1} 次)`); state.platform = utils.detectPlatform(); log(`AI下载平台: ${state.platform || '通用 (未特定识别)'}`); UI.createPreviewPanel(); setupNetworkListener(); const foundInitially = findAndProcessMedia(); startObserver(); if (!foundInitially && state.initRetries < CONFIG.MAX_RETRIES) { state.initRetries++; setTimeout(initializeScript, CONFIG.RETRY_DELAY); return; } log(`AI下载模块 (v${CONFIG.VERSION} by ${CONFIG.AUTHOR}) 初始化完成。`);}
        return { CONFIG: CONFIG, initialize: initializeScript, toggleMediaPanel: UI.togglePreviewPanel, scanForMedia: () => { log("用户手动扫描"); findAndProcessMedia(); UI.showNotification('手动扫描完成'); } };
    })();


    // --- 主脚本初始化和事件监听 ---
    main_loadConfig(); // 首先加载主脚本的配置

    const main_ensureInitialPanelState = () => {
        main_log("main_ensureInitialPanelState 调用，当前 main_panelVisible:", main_panelVisible);
        if (main_panelVisible) { // 如果存储的状态是可见
            if (!main_uiPanel || !document.body.contains(main_uiPanel)) {
                main_log("面板DOM不存在或未附加，调用 main_createUIPanel()");
                main_createUIPanel(); // createUIPanel 内部会根据 main_panelVisible (true) 来显示
            } else {
                main_log("面板DOM已存在，确保设置为可见并刷新列表");
                main_uiPanel.classList.add('panel-visible'); // 确保添加此类以显示
                main_renderListsUI();
                  // 刷新滚动UI
                const scrollBtn = document.getElementById('infiniteScrollToggleButton_main');
                const infiniteCheck = document.getElementById('backgroundInfiniteScrollCheckbox_main');
                if(scrollBtn && infiniteCheck && PageScroller && PageScroller.bindToUI) PageScroller.bindToUI(scrollBtn, infiniteCheck);
            }
        } else {
            main_log("初始状态 main_panelVisible 为 false，不主动显示面板");
            if (main_uiPanel && main_uiPanel.classList.contains('panel-visible')) {
                main_uiPanel.classList.remove('panel-visible');
            }
        }
    };

    const startAllFeatures = () => {
        main_ensureInitialPanelState(); // 主UI面板初始化（如果需要）
        AIContentDownloader.initialize(); // AI下载模块后台逻辑初始化
        // PageScroller 模块的快捷键和 visibilitychange 监听器在其IIFE内部已自动设置
        // PageScroller 的UI元素绑定会在 main_createUIPanel 中进行
    };

    // 确保在DOM完全加载后执行，特别是对于UI创建和交互
    if (document.readyState === "complete" || document.readyState === "interactive") {
        main_log("DOM已ready或interactive，直接启动所有功能。");
        startAllFeatures();
    } else {
        main_log("等待 DOMContentLoaded 事件...");
        document.addEventListener("DOMContentLoaded", () => {
            main_log("DOMContentLoaded 事件触发，启动所有功能。");
            startAllFeatures();
        });
    }

    document.addEventListener('click', function(event) {
        // 检查点击是否发生在任一脚本的UI面板内部，如果是则不处理链接打开
        const aiPreviewPanel = document.querySelector('.manus-ai-preview-panel');
        const hotkeyModal = document.getElementById('hotkeyModal_PageScroller');
        if ((main_uiPanel && main_uiPanel.contains(event.target)) ||
            (aiPreviewPanel && aiPreviewPanel.contains(event.target)) ||
            (hotkeyModal && hotkeyModal.contains(event.target))
           ) {
            return;
        }

        // --- 链接在新标签页打开的核心逻辑 ---
        const currentPageUrl = window.location.href;
        let scriptShouldRunLinkLogic = false;
        const isWhitelisted = main_userWhitelist.some(pattern => main_urlMatchesPattern(currentPageUrl, pattern));

        if (isWhitelisted) {
            scriptShouldRunLinkLogic = true;
        } else {
            // 默认禁用，除非在白名单。黑名单的作用是覆盖可能的其他启用条件（如果未来逻辑改变）或用于用户明确排除。
            // const isBlacklisted = main_userBlacklist.some(pattern => main_urlMatchesPattern(currentPageUrl, pattern));
            // if (isBlacklisted) {
            //     scriptShouldRunLinkLogic = false;
            // } else {
            //     scriptShouldRunLinkLogic = false; // 默认禁用
            // }
            scriptShouldRunLinkLogic = false; // 不在白名单中，则不启用链接处理逻辑
        }

        if (!scriptShouldRunLinkLogic) {
            return;
        }

        if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

        let targetElement = event.target; let anchorElement = null;
        for (let i = 0; i < 5 && targetElement && targetElement !== document.body; i++) { if (targetElement.tagName === 'A') { anchorElement = targetElement; break; } targetElement = targetElement.parentElement; }
        if (anchorElement) {
            const href = anchorElement.href; const rawHref = anchorElement.getAttribute('href');
            if (!href || (rawHref && rawHref.startsWith('#')) || href.startsWith('javascript:')) return;
            if (anchorElement.hasAttribute('download')) return;
            if (event.altKey && event.shiftKey) { return; } // Alt+Shift+Click 绕过脚本
            event.preventDefault(); event.stopPropagation();
            if (typeof GM_openInTab === 'function') { GM_openInTab(href, { active: true, insert: true }); }
            else if (typeof window.open === 'function') { window.open(href, '_blank'); }
        }
    }, true);

})();