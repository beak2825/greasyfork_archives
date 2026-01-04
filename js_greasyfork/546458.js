// ==UserScript==
// @name          页内弹窗打开链接
// @namespace     http://tampermonkey.net/
// @version       1.1.1
// @description   点击网页内链接，在弹窗中加载内容
// @author        AI
// @match         *://*/*
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @grant         GM_getValue
// @grant         GM_setValue
// @connect       *
// @license       MIT 
// @downloadURL https://update.greasyfork.org/scripts/546458/%E9%A1%B5%E5%86%85%E5%BC%B9%E7%AA%97%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/546458/%E9%A1%B5%E5%86%85%E5%BC%B9%E7%AA%97%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 添加全局样式 (unchanged)
    GM_addStyle(`
        /* 基础链接样式优化 */
        .suh a, table tr td a, th.common a {
            cursor: pointer;
            transition: color 0.2s ease-in-out, text-shadow 0.2s ease-in-out;
            text-decoration: none;
            position: relative;
            color: inherit;
        }
        .suh a:hover, table tr td a:hover, th.common a.xst:hover {
            color: #2979ff;
            text-shadow: 0 0 5px rgba(41, 121, 255, 0.3);
        }

        /* 面板核心样式 (弹窗模式) */
        #popup-content-panel {
            position: fixed;
            z-index: 10000;
            background-color: #fff;
            box-shadow: 0 5px 35px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            overflow: hidden;
            opacity: 0;
            pointer-events: none;
            width: 84vw;
            height: 96vh;
            max-width: 1080px;
            max-height: 840px;
            top: 50%;
            left: 50%;
            border: 1px solid #ccc;
            border-radius: 8px;
            transform: translate(-50%, -50%) scale(0.95);
            transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }

        #popup-content-panel.visible {
            opacity: 1;
            pointer-events: auto;
            transform: translate(-50%, -50%) scale(1);
        }

        /* 面板头部 */
        #popup-panel-header {
            display: flex; justify-content: space-between; align-items: center;
            padding: 10px 12px;
            background-color: #f9f9f9;
            border-bottom: 1px solid #e0e0e0; height: 52px; min-height: 52px; box-sizing: border-box;
            cursor: grab;
        }
         #popup-panel-header:active {
             cursor: grabbing;
         }
        #popup-panel-title {
            font-size: 16px;
            font-weight: 500; color: #333;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
            max-width: calc(100% - 130px);
            user-select: none;
        }
        #popup-panel-actions { display: flex; gap: 5px; }
        .popup-panel-btn {
            background-color: transparent; border: 1px solid transparent; border-radius: 4px;
            padding: 5px 7px;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
            transition: background-color 0.15s ease-in-out, color 0.15s ease-in-out, transform 0.1s ease-in-out;
            color: #555;
        }
        .popup-panel-btn svg { width: 16px; height: 16px; }
        .popup-panel-btn:hover { background-color: #e9e9e9; color: #333; }
        .popup-panel-btn:active { transform: translateY(0.5px); background-color: #dcdcdc; }
        .popup-panel-btn svg { pointer-events: none; }
        #popup-panel-close:hover { color: #d32f2f; }
        #popup-panel-refresh:hover, #popup-panel-open-in-new:hover,
        #popup-panel-maximize:hover { color: #1976d2; }

        /* 内容区域 */
        #popup-content-area {
            flex: 1; overflow-y: auto; position: relative;
            background-color: #fff; padding: 15px; box-sizing: border-box; scroll-behavior: smooth;
        }
        #popup-content-area.iframe-direct-load {
            padding: 0; /* Remove padding when iframe loads src directly */
        }


        /* 加载与错误状态 */
        #popup-panel-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #777; padding: 25px; }
        .spinner { width: 36px; height: 36px; margin-bottom: 18px; border: 3px solid rgba(41, 121, 255, 0.2); border-radius: 50%; border-top: 3px solid #2979ff; animation: spin 0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        #popup-panel-error { padding: 35px; color: #c62828; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; box-sizing: border-box; }
        #popup-panel-error h3 { margin-top: 18px; margin-bottom: 12px; font-weight: 500; font-size: 1.2em; }
        #popup-panel-error p { margin-bottom: 22px; color: #777; max-width: 420px; line-height: 1.6; }
        #popup-panel-error button { padding: 11px 22px; background: #2979ff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; transition: background 0.15s ease-in-out, transform 0.1s ease-in-out, box-shadow 0.15s ease-in-out; }
        #popup-panel-error button:hover { background: #4d90fe; transform: translateY(-0.5px); box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); }

        /* Iframe */
        #popup-panel-iframe { width: 100%; height: 100%; border: none; background-color: white; }

        /* 链接视觉提示 (unchanged from v1.7) */
        .popup-trigger::after, th.common::after, a.xst::after {
            content: ''; /* Material Symbols Outlined: open_in_new_down */
            font-family: 'Material Symbols Outlined';
            position: absolute; right: 8px; top: 50%;
            transform: translateY(-50%); font-size: 16px; opacity: 0;
            transition: opacity 0.2s ease-in-out, transform 0.15s ease-in-out;
            pointer-events: none;
        }
        div.items-content-tittle.popup-trigger { position: relative; }
        div.items-content-tittle.popup-trigger::after {
            right: 5px;
        }
        div.tittle_data.popup-trigger { position: relative; padding-right: 25px; }
        div.tittle_data.popup-trigger::after {
            right: 5px;
        }
        div.items-content-remark.popup-trigger {
            position: relative;
            padding-right: 25px;
        }
        div.items-content-remark.popup-trigger::after {
            right: 5px;
        }
        div.items-content-tittle.popup-trigger {
             padding-right: 25px;
        }
        .popup-trigger:hover::after,
        th.common:hover::after,
        a.xst:hover::after,
        div.items-content-tittle.popup-trigger:hover::after,
        div.tittle_data.popup-trigger:hover::after,
        div.items-content-remark.popup-trigger:hover::after {
            opacity: 0.7; transform: translateY(-50%) scale(1.05);
        }
        th.common { position: relative; }
        a.xst { position: relative; display: inline-block; transition: color 0.15s ease-in-out, padding-right 0.15s ease-in-out; padding-right: 20px; }
        a.xst:hover { color: #2979ff; padding-right: 25px; }
        a.xst::after { right: 0; }

        /* 遮罩层 (unchanged) */
        #popup-panel-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            opacity: 0; z-index: 9998;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
            backdrop-filter: blur(3px);
        }
        #popup-panel-overlay.visible {
            opacity: 1;
            pointer-events: auto;
        }

        /* 悬浮开关按钮容器与关闭按钮 */
        #popup-toggle-container {
            position: fixed;
            right: 14px;
            bottom: 16px;
            z-index: 10003;
            display: flex; align-items: center; gap: 6px;
        }
        #popup-toggle-btn {
            background: #2979ff;
            color: #fff;
            border: none;
            border-radius: 20px;
            padding: 8px 12px;
            font-size: 12px;
            line-height: 1;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            display: flex; align-items: center; gap: 6px;
            transition: opacity .2s ease, transform .1s ease, background .2s ease;
            opacity: .85;
        }
        #popup-toggle-btn:hover { opacity: 1; transform: translateY(-1px); }
        #popup-toggle-btn.disabled { background: #9e9e9e; }
        #popup-toggle-btn svg { width: 14px; height: 14px; }
        #popup-toggle-hide {
            width: 22px; height: 22px;
            border-radius: 50%;
            border: none;
            background: rgba(0,0,0,0.35);
            color: #fff;
            display: inline-flex; align-items: center; justify-content: center;
            cursor: pointer;
            opacity: 0; transform: translateY(1px);
            transition: opacity .18s ease, transform .12s ease, background .15s ease;
            pointer-events: none;
        }
        #popup-toggle-hide:hover { background: rgba(0,0,0,0.5); }
        #popup-toggle-container:hover #popup-toggle-hide { opacity: 1; transform: translateY(0); pointer-events: auto; }
    `);

    // SVG 图标定义 (unchanged)
    const ICONS = {
        close: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
        external: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>',
        refresh: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 4v6h-6"></path><path d="M1 20v-6h6"></path><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path><path d="M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>',
        maximize: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>',
        minimize: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 14 10 14 10 20"></polyline><polyline points="20 10 14 10 14 4"></polyline><line x1="14" y1="10" x2="21" y2="3"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>'
    };

    // 全局变量 (unchanged)
    let currentUrl = "";
    let isFullScreen = false;
    let panelPreFullScreenDimensions = {};
    let maximizeBtnElement;
    let clickHandlerAttached = false;
    let mutationObserver = null;

    // 启用站点存储（白名单，按主域名 eTLD+1 粒度）
    function computeRegistrableDomain(hostname) {
        try {
            if (!hostname) return '';
            // IP 和 localhost 直接返回
            if (/^\d+\.\d+\.\d+\.\d+$/.test(hostname) || hostname === 'localhost') return hostname;
            const parts = hostname.split('.');
            if (parts.length <= 2) return hostname;
            const twoLabel = parts.slice(-2).join('.');
            const threeLabel = parts.slice(-3).join('.');
            const twoPartSuffixes = new Set([
                'co.uk','ac.uk','gov.uk','org.uk','ltd.uk','plc.uk','me.uk',
                'com.cn','net.cn','org.cn','gov.cn','edu.cn','ac.cn',
                'com.au','net.au','org.au','edu.au','gov.au',
                'co.jp','ne.jp','or.jp','go.jp','ac.jp',
                'co.kr','ne.kr','or.kr','go.kr','ac.kr'
            ]);
            if (twoPartSuffixes.has(twoLabel) && parts.length >= 3) {
                return threeLabel;
            }
            return twoLabel;
        } catch (_) {
            return hostname || '';
        }
    }

    function loadEnabledHosts() {
        try {
            if (typeof GM_getValue === 'function') {
                // 新白名单键：popup_enabled_hosts，默认空 -> 默认关闭
                const list = GM_getValue('popup_enabled_hosts', []);
                const set = new Set();
                if (Array.isArray(list)) {
                    list.forEach(item => {
                        const host = String(item || '').split(':')[0];
                        const domain = computeRegistrableDomain(host);
                        if (domain) set.add(domain);
                    });
                }
                // 规范化保存
                try { if (typeof GM_setValue === 'function') GM_setValue('popup_enabled_hosts', Array.from(set)); } catch (_) {}
                return set;
            }
        } catch (_) {}
        try {
            const raw = localStorage.getItem('popup_enabled_hosts');
            const list = raw ? JSON.parse(raw) : [];
            const set = new Set();
            if (Array.isArray(list)) {
                list.forEach(item => {
                    const host = String(item || '').split(':')[0];
                    const domain = computeRegistrableDomain(host);
                    if (domain) set.add(domain);
                });
            }
            // 规范化保存
            try { localStorage.setItem('popup_enabled_hosts', JSON.stringify(Array.from(set))); } catch (_) {}
            return set;
        } catch (_) { return new Set(); }
    }

    function saveEnabledHosts(set) {
        const arr = Array.from(set);
        try { if (typeof GM_setValue === 'function') GM_setValue('popup_enabled_hosts', arr); } catch (_) {}
        try { localStorage.setItem('popup_enabled_hosts', JSON.stringify(arr)); } catch (_) {}
    }

    const enabledHosts = loadEnabledHosts();
    function getCurrentHostKey() { return computeRegistrableDomain(window.location.hostname); }

    function isCurrentHostEnabled() { return enabledHosts.has(getCurrentHostKey()); }

    function setCurrentHostEnabled(enabled) {
        const key = getCurrentHostKey();
        if (enabled) enabledHosts.add(key); else enabledHosts.delete(key);
        saveEnabledHosts(enabledHosts);
    }

    function ensureToggleButton() {
        let container = document.getElementById('popup-toggle-container');
        let btn = document.getElementById('popup-toggle-btn');
        let hideBtn = document.getElementById('popup-toggle-hide');
        if (!container) {
            container = document.createElement('div');
            container.id = 'popup-toggle-container';
            document.body.appendChild(container);
        }
        if (!btn) {
            btn = document.createElement('button');
            btn.id = 'popup-toggle-btn';
            btn.type = 'button';
            btn.title = '切换本网站弹窗处理开关';
            container.appendChild(btn);
            btn.addEventListener('click', () => {
                const toEnable = !isCurrentHostEnabled();
                setCurrentHostEnabled(toEnable);
                updateToggleButtonState();
                if (toEnable) {
                    enableHandlers();
                } else {
                    disableHandlers();
                    closePanel();
                }
            });
        }
        if (!hideBtn) {
            hideBtn = document.createElement('button');
            hideBtn.id = 'popup-toggle-hide';
            hideBtn.type = 'button';
            hideBtn.title = '隐藏此按钮（刷新后恢复）';
            hideBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
            container.appendChild(hideBtn);
            hideBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                container.style.display = 'none';
            });
        }
        updateToggleButtonState();
    }

    function updateToggleButtonState() {
        const btn = document.getElementById('popup-toggle-btn');
        if (!btn) return;
        const enabled = isCurrentHostEnabled();
        btn.classList.toggle('disabled', !enabled);
        btn.innerHTML = !enabled
            ? '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg><span>已禁用</span>'
            : '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9 12l2 2 4-4"/></svg><span>已启用</span>';
    }

    function enableHandlers() {
        if (!clickHandlerAttached) {
            document.addEventListener("click", handleLinkClick, true);
            clickHandlerAttached = true;
        }
        const runEnhancements = () => {
            enhanceCiliLinks();
            enhanceForumLinks();
            enhanceTgbShuoLinks();
            enhanceTgbBlogLinks();
            enhanceTgbGenericItemLinks();
        };
        runEnhancements();
        if (!mutationObserver) {
            mutationObserver = new MutationObserver(runEnhancements);
            mutationObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    function disableHandlers() {
        if (clickHandlerAttached) {
            document.removeEventListener("click", handleLinkClick, true);
            clickHandlerAttached = false;
        }
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }
    }

    // --- Panel Creation and Management Functions (unchanged) ---

    function createOverlay() {
        if (document.getElementById("popup-panel-overlay")) return document.getElementById("popup-panel-overlay");
        const overlay = document.createElement("div");
        overlay.id = "popup-panel-overlay";
        overlay.addEventListener("click", closePanel);
        document.body.appendChild(overlay);
        return overlay;
    }

    function createContentPanel() {
        if (document.getElementById("popup-content-panel")) return document.getElementById("popup-content-panel");

        createOverlay();
        const popupPanel = document.createElement("div");
        popupPanel.id = "popup-content-panel";

        const header = document.createElement("div");
        header.id = "popup-panel-header";
        const title = document.createElement("div");
        title.id = "popup-panel-title";
        const actions = document.createElement("div");
        actions.id = "popup-panel-actions";

        const refreshBtn = document.createElement("button");
        refreshBtn.id = "popup-panel-refresh"; refreshBtn.className = "popup-panel-btn";
        refreshBtn.innerHTML = ICONS.refresh; refreshBtn.title = "刷新内容 (R)";
        refreshBtn.onclick = () => { if (currentUrl) loadContent(currentUrl); };

        maximizeBtnElement = document.createElement("button");
        maximizeBtnElement.id = "popup-panel-maximize"; maximizeBtnElement.className = "popup-panel-btn";
        maximizeBtnElement.onclick = toggleFullScreen;

        const openBtn = document.createElement("button");
        openBtn.id = "popup-panel-open-in-new"; openBtn.className = "popup-panel-btn";
        openBtn.innerHTML = ICONS.external; openBtn.title = "在新标签页打开";
        openBtn.onclick = () => { if (currentUrl) window.open(currentUrl, "_blank"); };

        const closeBtn = document.createElement("button");
        closeBtn.id = "popup-panel-close"; closeBtn.className = "popup-panel-btn";
        closeBtn.innerHTML = ICONS.close; closeBtn.title = "关闭 (Esc)";
        closeBtn.onclick = closePanel;

        const contentArea = document.createElement("div");
        contentArea.id = "popup-content-area";

        actions.appendChild(refreshBtn);
        actions.appendChild(maximizeBtnElement);
        actions.appendChild(openBtn);
        actions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(actions);
        popupPanel.appendChild(header);
        popupPanel.appendChild(contentArea);
        document.body.appendChild(popupPanel);

        document.addEventListener("keydown", (e) => {
            const panel = document.getElementById("popup-content-panel");
            if (panel && panel.classList.contains("visible")) {
                if (e.key === "Escape") closePanel();
                else if (e.key === "f" || e.key === "F") toggleFullScreen();
                else if (e.key === "r" || e.key === "R") {
                    if (currentUrl && !e.ctrlKey && !e.metaKey) {
                        e.preventDefault(); loadContent(currentUrl);
                    }
                }
            }
        });
        header.addEventListener("dblclick", (e) => {
            if (e.target.closest('button')) return;
            toggleFullScreen();
        });
        return popupPanel;
    }

    function updateMaximizeButtonIcon() {
        if (maximizeBtnElement) {
            maximizeBtnElement.innerHTML = isFullScreen ? ICONS.minimize : ICONS.maximize;
            maximizeBtnElement.title = isFullScreen ? "恢复 (F)" : "全屏 (F)";
        }
    }

    function toggleFullScreen() {
        const popupPanel = document.getElementById("popup-content-panel");
        if (!popupPanel) return;

        if (!isFullScreen) {
            panelPreFullScreenDimensions = {
                width: popupPanel.style.width, height: popupPanel.style.height,
                top: popupPanel.style.top, left: popupPanel.style.left,
                transform: popupPanel.style.transform, borderRadius: popupPanel.style.borderRadius,
                maxWidth: popupPanel.style.maxWidth, maxHeight: popupPanel.style.maxHeight
            };
            popupPanel.style.transition = 'none';
            Object.assign(popupPanel.style, {
                width: "100vw", height: "100vh", top: "0px", left: "0px",
                transform: "none", borderRadius: "0px", maxWidth: "none", maxHeight: "none",
                zIndex: "10002"
            });
            void popupPanel.offsetWidth;
            popupPanel.style.transition = '';
            isFullScreen = true;
        } else {
            popupPanel.style.transition = 'none';
            Object.assign(popupPanel.style, {
                width: panelPreFullScreenDimensions.width || '', height: panelPreFullScreenDimensions.height || '',
                top: panelPreFullScreenDimensions.top || '', left: panelPreFullScreenDimensions.left || '',
                transform: panelPreFullScreenDimensions.transform || '', borderRadius: panelPreFullScreenDimensions.borderRadius || '',
                maxWidth: panelPreFullScreenDimensions.maxWidth || '', maxHeight: panelPreFullScreenDimensions.maxHeight || '',
                zIndex: "10000"
            });
            void popupPanel.offsetWidth;
            popupPanel.style.transition = '';
            isFullScreen = false;
        }
        updateMaximizeButtonIcon();
    }

    function closePanel() {
        const popupPanel = document.getElementById("popup-content-panel");
        const overlay = document.getElementById("popup-panel-overlay");
        if (!popupPanel) return;
        if (isFullScreen) toggleFullScreen();

        popupPanel.classList.remove("visible");
        if (overlay) overlay.classList.remove("visible");

        setTimeout(() => {
            const contentArea = document.getElementById("popup-content-area");
            if (contentArea) contentArea.innerHTML = "";
            currentUrl = "";
        }, 350);
    }

    function showPanel(titleText, urlToLoad) {
        const popupPanel = createContentPanel();
        const overlay = document.getElementById("popup-panel-overlay");
        currentUrl = urlToLoad;
        document.getElementById("popup-panel-title").textContent = titleText || "查看内容";

        popupPanel.classList.remove('visible');
        Object.assign(popupPanel.style, {
            width: '', height: '', top: '', left: '', transform: '',
            maxWidth: '', maxHeight: '', borderRadius: '', zIndex: ''
        });
        isFullScreen = false;
        updateMaximizeButtonIcon();

        requestAnimationFrame(() => {
            popupPanel.classList.add("visible");
            if (overlay) overlay.classList.add("visible");
        });
        return document.getElementById("popup-content-area");
    }

    function showLoading(container) {
        container.classList.remove('iframe-direct-load');
        container.innerHTML = `
            <div id="popup-panel-loading">
                <div class="spinner"></div>
                <div style="font-size: 15px; font-weight: 500;">正在加载内容...</div>
                <div style="margin-top: 10px; font-size: 13px; color: #999;">请稍候片刻</div>
            </div>`;
    }

    function showError(container, message) {
        container.classList.remove('iframe-direct-load');
        const escapedUrl = currentUrl ? currentUrl.replace(/'/g, "\\'") : '';
        container.innerHTML = `
            <div id="popup-panel-error">
                <div><svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#c62828" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
                <h3 style="margin-top:15px;margin-bottom:10px;">加载失败</h3>
                <p>${message || "无法加载请求的内容"}</p>
                <button onclick="var urlToOpen = '${escapedUrl}'; if(urlToOpen) window.open(urlToOpen, '_blank');"
                        style="margin-top:15px;padding:8px 16px;background:#d32f2f;color:white;border:none;border-radius:4px;cursor:pointer;"
                        ${!escapedUrl ? 'disabled' : ''}>
                    在新标签页打开
                </button>
            </div>`;
    }

    function loadContent(url) {
        const contentArea = document.getElementById("popup-content-area");
        if (!contentArea) return;

        contentArea.classList.remove('iframe-direct-load'); // Reset class
        contentArea.innerHTML = ""; // Clear previous content before showing loading or iframe

        if (url.includes("linux.do")) {
            console.log(`[PopupViewer] Attempting direct iframe load for: ${url}`);
            showLoading(contentArea); // Show spinner HTML

            const iframe = document.createElement("iframe");
            iframe.id = "popup-panel-iframe";
            iframe.sandbox = "allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts";
            // Note: allow-top-navigation and allow-popups-to-escape-sandbox are omitted to prevent breaking out

            let loadTimeoutCleared = false;
            const loadTimeout = setTimeout(() => {
                if (loadTimeoutCleared) return;
                loadTimeoutCleared = true;
                console.warn(`[PopupViewer] Timeout waiting for ${url} to load directly.`);
                if (document.getElementById('popup-panel-loading')) {
                    showError(contentArea, `加载 ${url} 超时或被阻止。请尝试在新标签页打开。`);
                }
            }, 15000); // 15 seconds timeout

            iframe.onload = () => {
                if (loadTimeoutCleared) return; // Avoid acting if timeout already processed this
                loadTimeoutCleared = true;
                clearTimeout(loadTimeout);
                console.log(`[PopupViewer] iframe onload event for ${url}.`);

                // The iframe has loaded. Remove spinner and ensure iframe is styled.
                // The spinner was the content of contentArea. Now replace it.
                const loadingSpinner = document.getElementById('popup-panel-loading');
                if (loadingSpinner && loadingSpinner.parentNode === contentArea) {
                    contentArea.removeChild(loadingSpinner);
                }
                // If the iframe isn't already in contentArea (e.g., if an error cleared it, though unlikely here),
                // or if something else replaced the spinner, ensure the iframe is the sole content.
                if (!contentArea.contains(iframe)) {
                    contentArea.innerHTML = ''; // Clear anything else
                    contentArea.appendChild(iframe);
                }
                contentArea.classList.add('iframe-direct-load');
            };

            iframe.onerror = () => {
                if (loadTimeoutCleared) return;
                loadTimeoutCleared = true;
                clearTimeout(loadTimeout);
                console.error(`[PopupViewer] Error loading ${url} directly into iframe via onerror.`);
                showError(contentArea, `加载 ${url} 失败。`);
            };

            // Replace the loading spinner content with the iframe element itself.
            // Setting iframe.src will trigger the load.
            contentArea.innerHTML = ''; // Clear spinner HTML
            contentArea.appendChild(iframe);
            iframe.src = url; // Set src AFTER appending to ensure onload/onerror are attached

            return;
        }

        // Default method for other sites (GM_xmlhttpRequest)
        showLoading(contentArea);
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: (response) => {
                if (response.status === 200) {
                    try {
                        contentArea.innerHTML = ""; // Clear loading message
                        const iframe = document.createElement("iframe");
                        iframe.id = "popup-panel-iframe";
                        iframe.sandbox = "allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts";
                        contentArea.appendChild(iframe);

                        const iframeDoc = iframe.contentWindow.document;
                        iframeDoc.open();
                        let baseHref = url;
                        try {
                            const urlObj = new URL(url);
                            baseHref = urlObj.origin ? `${urlObj.origin}${urlObj.pathname}` : urlObj.pathname;
                        } catch (e) {
                            console.warn("Could not create base URL from:", url, e);
                        }
                        iframeDoc.write(`<!DOCTYPE html><html><head><base href="${baseHref}"><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Content</title></head><body>${response.responseText}</body></html>`);
                        iframeDoc.close();

                        iframe.onload = () => {
                            try {
                                const links = iframeDoc.querySelectorAll("a[href]");
                                links.forEach(link => {
                                    link.target = "_blank";
                                    try {
                                        if (!link.getAttribute('href')?.startsWith('javascript:')) {
                                            const absoluteUrl = new URL(link.getAttribute('href'), iframeDoc.baseURI).href;
                                            link.href = absoluteUrl;
                                        }
                                    } catch (e) { /* console.warn("Could not absolutize URL:", link.getAttribute('href'), e); */ }
                                });
                                const style = iframeDoc.createElement('style');
                                style.textContent = `body { font-family: Segoe UI, sans-serif; padding: 10px; word-wrap: break-word; overflow-wrap: break-word; } img, video, iframe { max-width: 100%; height: auto; } a { color: #007bff; text-decoration: none; } a:hover { text-decoration: underline; } a:visited { color: #6a0dad; }`;
                                iframeDoc.head.appendChild(style);
                            } catch (iframeError) {
                                console.error("Error manipulating iframe content:", iframeError);
                            }
                        };
                        if (iframe.contentWindow && iframe.contentWindow.document.readyState === 'complete') {
                           iframe.onload();
                        }
                    } catch (error) {
                        showError(contentArea, "内容解析失败: " + error.message);
                        console.error("Error processing content:", error);
                    }
                } else {
                    showError(contentArea, `加载失败 (HTTP ${response.status})`);
                }
            },
            onerror: (error) => {
                showError(contentArea, "网络请求失败");
                console.error("GM_xmlhttpRequest error:", error);
            },
        });
    }

    // --- Refactored Link Handling Logic (unchanged from v1.6) ---

    function isLinkSamePageAnchor(href) {
        try {
            const currentLoc = new URL(window.location.href);
            const linkLoc = new URL(href, window.location.href);
            return linkLoc.origin === currentLoc.origin &&
                   linkLoc.pathname === currentLoc.pathname &&
                   linkLoc.hash &&
                   linkLoc.href !== currentLoc.href;
        } catch (e) {
            return false;
        }
    }

    function isAssetLikeUrl(urlString) {
        try {
            const urlObj = new URL(urlString, window.location.href);
            const pathname = urlObj.pathname.toLowerCase();
            const assetExtensions = [
                '.jpg','.jpeg','.png','.gif','.webp','.svg','.avif','.ico',
                '.mp3','.wav','.ogg','.flac','.mp4','.webm','.mkv','.mov',
                '.pdf','.zip','.rar','.7z','.tar','.gz','.bz2','.xz','.dmg','.exe','.apk',
                '.woff','.woff2','.ttf','.otf','.eot','.wasm'
            ];
            return assetExtensions.some(ext => pathname.endsWith(ext));
        } catch (_) {
            return false;
        }
    }

    function shouldHandleAsInnerPage(href) {
        if (!href) return false;
        if (href.startsWith('javascript:')) return false;
        if (href.startsWith('mailto:') || href.startsWith('tel:')) return false;
        if (isAssetLikeUrl(href)) return false;
        try {
            const current = new URL(window.location.href);
            const link = new URL(href, window.location.href);
            // 仅处理同源或同主域的普通页面链接
            return link.origin === current.origin && !isLinkSamePageAnchor(link.href);
        } catch (_) {
            return false;
        }
    }

    function activateLinkInPanel(event, clickedElement, title, urlToOpen) {
        event.preventDefault();
        event.stopPropagation();
        showPanel(title, urlToOpen);
        loadContent(urlToOpen);
    }

    function handleForumLink_XST(event) {
        const link = event.target.closest("a.xst");
        if (link && link.href && !link.href.startsWith('javascript:')) {
            if (isLinkSamePageAnchor(link.href)) {
                return false;
            }
            const title = link.textContent.trim() || "查看帖子";
            const resolvedUrl = new URL(link.href, window.location.origin).href;
            activateLinkInPanel(event, link, title, resolvedUrl);
            return true;
        }
        return false;
    }

    function handleTGBGenericItemClick(event) {
        const clickedElement = event.target;
        const titleDiv = clickedElement.closest('div.items-content-tittle.popup-trigger');
        const remarkDiv = clickedElement.closest('div.items-content-remark.popup-trigger');
        const targetContainer = titleDiv || remarkDiv;

        if (!targetContainer || !targetContainer.closest('div.items-list-content')) {
            return false;
        }
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        if (!(hostname === "www.tgb.cn" && !pathname.startsWith("/blog/") && !pathname.startsWith("/user/blog/"))) {
            return false;
        }

        let linkElement = null;
        let urlToOpen = null;
        let titleText = "";

        if (targetContainer.parentElement.tagName === 'A') {
            linkElement = targetContainer.parentElement;
            const href = linkElement.getAttribute('href');
            if (href && !href.startsWith('javascript:')) {
                try { urlToOpen = new URL(href, window.location.origin).href; } catch (e) { console.warn("Error resolving href in TGB Generic (parent A):", href, e); }
            }
            titleText = linkElement.title || targetContainer.textContent.trim() || "淘股吧内容";
        } else {
            linkElement = targetContainer.querySelector('a');
            if (linkElement) {
                const dataHref = linkElement.dataset.href;
                const href = linkElement.getAttribute('href');
                if (dataHref) {
                    try { urlToOpen = new URL(dataHref, window.location.origin).href; } catch (e) { console.warn("Error resolving data-href in TGB Generic (child A):", dataHref, e); }
                }
                if (!urlToOpen && href && !href.startsWith('javascript:')) {
                    try { urlToOpen = new URL(href, window.location.origin).href; } catch (e) { console.warn("Error resolving href in TGB Generic (child A fallback):", href, e); }
                }
                titleText = linkElement.title || linkElement.textContent.trim() || targetContainer.textContent.trim() || "淘股吧内容";
            }
        }

        if (linkElement && urlToOpen && !isLinkSamePageAnchor(urlToOpen)) {
            activateLinkInPanel(event, linkElement, titleText, urlToOpen);
            return true;
        }
        return false;
    }


    const COMMON_SITE_HANDLERS = [
        {
            name: "GitHub Issues",
            condition: (hostname, pathname) => hostname === "github.com" && pathname.includes("/issues"),
            linkSelector: 'a.IssuePullRequestTitle-module__ListItemTitle_1--_xOfg',
            parentSelector: 'div.IssueRow-module__row--XmR1f',
            titleExtractor: (el) => el.textContent.trim() || "查看 GitHub Issue",
        },
        {
            name: "Linux.do Topics",
            condition: (hostname, pathname) => hostname === "linux.do",
            linkSelector: 'a.title.raw-link.raw-topic-link',
            parentSelector: 'tr.topic-list-item',
            titleExtractor: (el) => el.textContent.trim() || "查看主题",
        },
        {
            name: "TGB Shuo Livenews",
            condition: (hostname, pathname) => hostname === "shuo.tgb.cn" && pathname.startsWith("/livenews/"),
            linkSelector: 'div.items-content-tittle a',
            parentSelector: 'div.items-list-content',
            titleExtractor: (el) => el.textContent.trim() || "查看资讯",
        },
        {
            name: "TGB Blog",
            condition: (hostname, pathname) => hostname === "www.tgb.cn" && pathname.startsWith("/blog/"),
            linkSelector: 'div.tittle_data a',
            parentSelector: 'div.article_tittle',
            titleExtractor: (el) => el.title || el.textContent.trim() || "查看博客",
        }
    ];

    function handleLinkClick(event) {
        if (event.target.closest("#popup-content-panel") && !event.target.closest('.popup-panel-btn')) {
            return;
        }

        const currentHostname = window.location.hostname;
        const currentPathname = window.location.pathname;

        if (handleForumLink_XST(event)) return;
        if (handleTGBGenericItemClick(event)) return;

        if (currentHostname.includes("cili.")) {
            const target = event.target;
            const tableRow = target.closest("tr");
            if (tableRow) {
                const firstTd = tableRow.querySelector("td:first-child");
                if (firstTd && firstTd.contains(target)) {
                    const linkCell = firstTd.querySelector("a");
                    if (linkCell && linkCell.href && !linkCell.href.startsWith('javascript:')) {
                        const resolvedUrl = new URL(linkCell.href, window.location.origin).href;
                        if (isLinkSamePageAnchor(resolvedUrl)) {
                            return;
                        }
                        let title = (linkCell.querySelector("b")?.textContent || linkCell.textContent).trim() || "查看内容";
                        activateLinkInPanel(event, linkCell, title, resolvedUrl);
                        return;
                    }
                }
            }
        }

        for (const handler of COMMON_SITE_HANDLERS) {
            if (handler.condition(currentHostname, currentPathname)) {
                const linkElement = event.target.closest(handler.linkSelector) ||
                                    (event.target.matches(handler.linkSelector) ? event.target : null);

                if (linkElement && (!handler.parentSelector || linkElement.closest(handler.parentSelector))) {
                    let resolvedUrl;
                    const hrefAttr = linkElement.getAttribute('href');
                    if (hrefAttr && !hrefAttr.startsWith('javascript:')) {
                        try {
                            resolvedUrl = new URL(hrefAttr, window.location.origin).href;
                        } catch(e) {
                            console.warn("Error resolving href for common handler link:", hrefAttr, e);
                            resolvedUrl = null;
                        }
                    }

                    if (!resolvedUrl) {
                        continue;
                    }

                    if (isLinkSamePageAnchor(resolvedUrl)) {
                        return;
                    }

                    const title = handler.titleExtractor(linkElement);
                    activateLinkInPanel(event, linkElement, title, resolvedUrl);
                    return;
                }
            }
        }

        const targetSuhTd = event.target.closest("td.suh");
        if (targetSuhTd) {
            const link = event.target.closest("a") || targetSuhTd.querySelector("a");
            if (link && link.href && !link.href.startsWith('javascript:')) {
                const resolvedUrl = new URL(link.href, window.location.origin).href;
                if (isLinkSamePageAnchor(resolvedUrl)) {
                    return;
                }
                const title = link.title || link.textContent.trim() || "查看内容";
                activateLinkInPanel(event, link, title, resolvedUrl);
                return;
            }
        }

        // 通用兜底：对所有页面的同域内页链接启用弹窗
        // 跳过带功能键、鼠标中键、具有显式 target 的新开标签
        if (event.defaultPrevented) return;
        if (event.button !== 0) return; // only left click
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const anyLink = event.target.closest('a[href]');
        if (anyLink) {
            const hrefAttr = anyLink.getAttribute('href') || '';
            const targetAttr = (anyLink.getAttribute('target') || '').toLowerCase();
            if (targetAttr === '_blank') return;
            if (shouldHandleAsInnerPage(hrefAttr)) {
                let resolvedUrl;
                try { resolvedUrl = new URL(hrefAttr, window.location.href).href; } catch (_) {}
                if (resolvedUrl) {
                    const title = anyLink.title || anyLink.textContent.trim() || '查看内容';
                    activateLinkInPanel(event, anyLink, title, resolvedUrl);
                    return;
                }
            }
        }
    }

    // --- Link Enhancement Functions (unchanged from v1.6) ---
    function enhanceCiliLinks() {
        if (!window.location.hostname.includes("cili.")) return;
        document.querySelectorAll("tr").forEach(row => {
            const firstCell = row.querySelector("td:first-child");
            const link = firstCell ? firstCell.querySelector("a") : null;
            if (firstCell && link && link.href && !link.href.startsWith('javascript:')) {
                if (isLinkSamePageAnchor(new URL(link.href, window.location.origin).href)) return;
                firstCell.classList.add("popup-trigger");
            }
        });
    }

    function enhanceForumLinks() {
        document.querySelectorAll("a.xst").forEach(link => {
            if (link.href && !link.href.startsWith('javascript:')) {
                 if (isLinkSamePageAnchor(new URL(link.href, window.location.origin).href)) return;
                const th = link.closest("th.common, th.new, th.lock");
                if (th && !th.classList.contains('common')) {
                    th.classList.add("common");
                }
            }
        });
    }

    function enhanceTgbShuoLinks() {
        if (!(window.location.hostname === "shuo.tgb.cn" && window.location.pathname.startsWith("/livenews/"))) return;
        document.querySelectorAll('div.items-content-tittle').forEach(titleDiv => {
            const link = titleDiv.querySelector('a');
            if (link && link.href && !link.href.startsWith('javascript:')) {
                if (isLinkSamePageAnchor(new URL(link.href, window.location.origin).href)) return;
                titleDiv.classList.add("popup-trigger");
            }
        });
    }

    function enhanceTgbBlogLinks() {
        if (!(window.location.hostname === "www.tgb.cn" && window.location.pathname.startsWith("/blog/"))) return;
        document.querySelectorAll('div.article_tittle').forEach(articleTitleDiv => {
            const titleDataDiv = articleTitleDiv.querySelector('div.tittle_data');
            const link = titleDataDiv ? titleDataDiv.querySelector('a') : null;
            if (titleDataDiv && link && link.href && !link.href.startsWith('javascript:')) {
                if (isLinkSamePageAnchor(new URL(link.href, window.location.origin).href)) return;
                titleDataDiv.classList.add("popup-trigger");
            }
        });
    }

    function enhanceTgbGenericItemLinks() {
        const hostname = window.location.hostname;
        const pathname = window.location.pathname;
        if (!(hostname === "www.tgb.cn" && !pathname.startsWith("/blog/") && !pathname.startsWith("/user/blog/"))) {
            return;
        }
        document.querySelectorAll('div.items-content-tittle, div.items-content-remark').forEach(containerDiv => {
            if (!containerDiv.closest('div.items-list-content')) return;
            let linkElement = null;
            let resolvedUrl = null;
            const innerLink = containerDiv.querySelector('a');
            if (innerLink) {
                const dataHref = innerLink.dataset.href;
                const href = innerLink.getAttribute('href');
                if (dataHref) {
                    try { resolvedUrl = new URL(dataHref, window.location.origin).href; linkElement = innerLink; } catch (e) {}
                }
                if (!resolvedUrl && href && !href.startsWith('javascript:')) {
                     try { resolvedUrl = new URL(href, window.location.origin).href; linkElement = innerLink; } catch (e) {}
                }
            }
            if (!linkElement && containerDiv.parentElement.tagName === 'A') {
                const parentLink = containerDiv.parentElement;
                const href = parentLink.getAttribute('href');
                if (href && !href.startsWith('javascript:')) {
                    try { resolvedUrl = new URL(href, window.location.origin).href; linkElement = parentLink; } catch (e) {}
                }
            }
            if (linkElement && resolvedUrl && !isLinkSamePageAnchor(resolvedUrl)) {
                containerDiv.classList.add("popup-trigger");
            }
        });
    }


    // --- Initialization ---
    function init() {
        const materialFontLink = document.createElement('link');
        materialFontLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
        materialFontLink.rel = 'stylesheet';
        document.head.appendChild(materialFontLink);

        ensureToggleButton();
        // 默认关闭，只有在白名单中才启用
        if (isCurrentHostEnabled()) {
            enableHandlers();
        } else {
            disableHandlers();
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
