// ==UserScript==
// @name         LDStatus (v4.4.1 - Wythe Ultimate)
// @namespace    http://tampermonkey.net/
// @version      4.4.1
// @description  Linux.do 增强工具箱：显示信任级别进度、自定义标签导航、论坛帖子智能排序、新标签页打开优化。
// @author       1e0n (Leon) & Wythe
// @match        https://linux.do/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @license      MIT
// @grant        GM_info
// @connect      connect.linux.do
// @connect      github.com
// @connect      raw.githubusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/538282/LDStatus%20%28v441%20-%20Wythe%20Ultimate%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538282/LDStatus%20%28v441%20-%20Wythe%20Ultimate%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("LDStatus Ultimate (v4.4.1) script started!");

    // ======================================================================================
    // 模块 1: 核心 UI 与配置 (LDStatus Base)
    // ======================================================================================

    const STORAGE_KEY_PREFIX = 'ld_panel_v4_';
    const STORAGE_KEY_POSITION = STORAGE_KEY_PREFIX + 'position';
    const STORAGE_KEY_COLLAPSED = STORAGE_KEY_PREFIX + 'collapsed';
    const STORAGE_KEY_THEME = STORAGE_KEY_PREFIX + 'theme';
    const STORAGE_KEY_PREVIOUS_REQ = STORAGE_KEY_PREFIX + 'previous_requirements';
    const STORAGE_KEY_CUSTOM_TAGS = STORAGE_KEY_PREFIX + 'custom_tags';

    // 排序器状态
    const sorterState = {
        isNewestFirst: false,
        originalOrder: [],
        observer: null,
        lastCount: 0,
        autoLoadEnabled: false,
        newTopicCheckInterval: null
    };

    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
        /* --- 核心面板样式 --- */
        #ld-trust-level-panel.ld-dark-theme { background-color: #2d3748; color: #e2e8f0; box-shadow: 0 0 6px rgba(0, 0, 0, 0.4); }
        #ld-trust-level-panel.ld-dark-theme #ld-trust-level-header { background-color: #1a202c; color: white; }
        #ld-trust-level-panel.ld-dark-theme .ld-toggle-btn,
        #ld-trust-level-panel.ld-dark-theme .ld-refresh-btn,
        #ld-trust-level-panel.ld-dark-theme .ld-update-btn,
        #ld-trust-level-panel.ld-dark-theme .ld-theme-btn { color: white; }
        #ld-trust-level-panel.ld-dark-theme .ld-version { color: #a0aec0; }
        #ld-trust-level-panel.ld-dark-theme .ld-trust-level-item.ld-success .ld-value { color: #68d391; }
        #ld-trust-level-panel.ld-dark-theme .ld-trust-level-item.ld-fail .ld-value { color: #fc8181; }
        #ld-trust-level-panel.ld-dark-theme .ld-loading { color: #a0aec0; }

        #ld-trust-level-panel.ld-light-theme { background-color: #ffffff; color: #1a202c; box-shadow: 0 0 6px rgba(0, 0, 0, 0.15); border: 1px solid #e2e8f0; }
        #ld-trust-level-panel.ld-light-theme #ld-trust-level-header { background-color: #3182ce; color: #ffffff; border-bottom: 1px solid #2c5282; }
        #ld-trust-level-panel.ld-light-theme .ld-toggle-btn,
        #ld-trust-level-panel.ld-light-theme .ld-refresh-btn,
        #ld-trust-level-panel.ld-light-theme .ld-update-btn,
        #ld-trust-level-panel.ld-light-theme .ld-theme-btn { color: white; text-shadow: 0 0 1px rgba(0,0,0,0.3); }
        #ld-trust-level-panel.ld-light-theme .ld-version { color: #4a5568; }
        #ld-trust-level-panel.ld-light-theme .ld-trust-level-item.ld-success .ld-value { color: #276749; font-weight: bold; }
        #ld-trust-level-panel.ld-light-theme .ld-trust-level-item.ld-fail .ld-value { color: #c53030; font-weight: bold; }
        #ld-trust-level-panel.ld-light-theme .ld-name { color: #2d3748; }
        #ld-trust-level-panel.ld-light-theme .ld-loading { color: #4a5568; }

        #ld-trust-level-panel { position: fixed; left: 10px; top: 100px; width: 130px; border-radius: 6px; z-index: 9999; font-family: Arial, sans-serif; transition: transform 0.1s ease; overflow: hidden; font-size: 12px; line-height: 1.2; }
        #ld-trust-level-header { padding: 1px 5px; cursor: move; user-select: none; }
        .ld-header-top-line { display: flex; justify-content: space-between; align-items: center; width: 100%; }
        .ld-header-title { font-weight: bold; white-space: nowrap; margin-right: 5px; }
        .ld-header-second-line { display: flex; justify-content: space-between; align-items: center; width: 100%; margin-top: 1px; }
        .ld-header-button-bar { display: flex; align-items: center; }
        #ld-trust-level-content { padding: 2px 5px; max-height: none; overflow-y: visible; }
        .ld-trust-level-item { margin-bottom: 2px; }
        .ld-trust-level-item .ld-name { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; margin-bottom: 0px; }
        .ld-trust-level-item .ld-value { display: block; font-weight: bold; text-align: left; }
        .ld-toggle-btn, .ld-refresh-btn, .ld-update-btn, .ld-theme-btn { background: none; border: none; cursor: pointer; font-size: 12px; padding: 1px; }
        .ld-toggle-btn { margin-left: 3px; }
        .ld-header-button-bar button { margin-left: 3px; }
        .ld-header-button-bar button:first-child { margin-left: 0; }
        .ld-version { font-size: 12px; font-weight: normal; }

        .ld-collapsed { width: 24px !important; height: 24px !important; min-width: 24px !important; max-width: 24px !important; border-radius: 6px; overflow: hidden; transform: none !important; line-height: initial; }
        .ld-collapsed #ld-trust-level-header { justify-content: center; width: 24px !important; height: 24px !important; min-width: 24px !important; max-width: 24px !important; padding: 0; display: flex; align-items: center; }
        .ld-collapsed #ld-trust-level-content { display: none !important; }
        .ld-collapsed .ld-header-title, .ld-collapsed .ld-header-second-line { display: none !important; }
        .ld-collapsed .ld-toggle-btn { margin: 0; font-size: 12px; display: flex; justify-content: center; align-items: center; width: 100%; height: 100%; padding: 0; }

        .ld-loading { text-align: center; padding: 5px; }
        .ld-dark-theme .ld-increase { color: #ffd700; }
        .ld-dark-theme .ld-decrease { color: #4299e1; }
        .ld-light-theme .ld-increase { color: #d69e2e; font-weight: bold; }
        .ld-light-theme .ld-decrease { color: #2b6cb0; font-weight: bold; }

        /* --- 标签与分割线 --- */
        .ld-separator { border: 0; height: 1px; margin: 4px 0; }
        .ld-dark-theme .ld-separator { background-color: #4a5568; }
        .ld-light-theme .ld-separator { background-color: #e2e8f0; }
        .ld-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; margin-top: 2px; }
        .ld-section-header .ld-title { font-weight: bold; }
        .ld-add-tag-btn { background: none; border: none; cursor: pointer; font-size: 14px; padding: 0 2px; line-height: 1; }
        .ld-light-theme .ld-add-tag-btn { color: #2c5282; }
        .ld-dark-theme .ld-add-tag-btn { color: #90cdf4; }
        .ld-custom-tag-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2px; }
        .ld-custom-tag-link { text-decoration: none; color: inherit; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex-grow: 1; font-size: 12px; }
        .ld-dark-theme .ld-custom-tag-link:hover { color: white; text-decoration: underline; }
        .ld-light-theme .ld-custom-tag-link { color: #2b6cb0; }
        .ld-light-theme .ld-custom-tag-link:hover { color: #2c5282; text-decoration: underline; }
        .ld-delete-tag-btn { background: none; border: none; cursor: pointer; font-size: 12px; padding: 0 2px; color: #e53e3e; margin-left: 4px; line-height: 1; }
        .ld-delete-tag-btn:hover { color: #c53030; }

        .ld-credit-note { font-size: 10px; text-align: center; opacity: 0.7; margin-top: 5px; padding: 0 2px; }
        .ld-dark-theme .ld-credit-note { color: #a0aec0; }
        .ld-light-theme .ld-credit-note { color: #4a5568; }

        /* --- 排序工具按钮样式 --- */
        .ld-tools-container { display: flex; justify-content: space-between; gap: 4px; margin-bottom: 2px; }
        .ld-tool-btn {
            flex: 1;
            border: none;
            border-radius: 4px;
            padding: 3px 0;
            font-size: 14px;
            cursor: pointer;
            text-align: center;
            transition: all 0.2s;
            color: #fff;
        }
        .ld-tool-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .ld-tool-btn:active { transform: translateY(1px); }

        .ld-tool-sort { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
        .ld-tool-sort.active { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }

        .ld-tool-auto { background: linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%); }
        .ld-tool-auto.active { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

        .ld-tool-refresh { background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #4a5568 !important; }
        .ld-tool-refresh:hover { background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); }
    `;

    if (document.head) document.head.appendChild(style);
    else document.addEventListener('DOMContentLoaded', () => document.head.appendChild(style));

    const panel = document.createElement('div');
    panel.id = 'ld-trust-level-panel';

    const currentTheme = GM_getValue(STORAGE_KEY_THEME, 'dark');
    panel.classList.add(currentTheme === 'dark' ? 'ld-dark-theme' : 'ld-light-theme');

    let scriptVersion = "N/A";
    if (typeof GM_info !== 'undefined' && GM_info.script) {
        scriptVersion = GM_info.script.version || "N/A";
    }

    const header = document.createElement('div');
    header.id = 'ld-trust-level-header';
    header.innerHTML = `
        <div class="ld-header-top-line">
            <span class="ld-header-title">Status+</span>
            <button class="ld-toggle-btn" title="展开/收起">◀</button>
        </div>
        <div class="ld-header-second-line">
            <span class="ld-version">v${scriptVersion}</span>
            <div class="ld-header-button-bar">
                <button class="ld-update-btn" title="检查更新">🔎</button>
                <button class="ld-refresh-btn" title="刷新数据">🔄</button>
                <button class="ld-theme-btn" title="切换主题">🌙</button>
            </div>
        </div>
    `;

    const content = document.createElement('div');
    content.id = 'ld-trust-level-content';
    content.innerHTML = '<div class="ld-loading">加载中...</div>';
    content.addEventListener('click', handleContentClick);

    panel.appendChild(header);
    panel.appendChild(content);

    if (document.body) document.body.appendChild(panel);
    else document.addEventListener('DOMContentLoaded', () => document.body.appendChild(panel));

    let toggleBtn, refreshBtn, updateBtn, themeBtn, versionSpan;
    let cachedRequirementsData = null;

    function queryHeaderElements() {
        toggleBtn = header ? header.querySelector('.ld-toggle-btn') : null;
        versionSpan = header ? header.querySelector('.ld-version') : null;
        const buttonBar = header ? header.querySelector('.ld-header-button-bar') : null;
        if (buttonBar) {
            updateBtn = buttonBar.querySelector('.ld-update-btn');
            refreshBtn = buttonBar.querySelector('.ld-refresh-btn');
            themeBtn = buttonBar.querySelector('.ld-theme-btn');
        }
    }
    queryHeaderElements();

    // ======================================================================================
    // 模块 2: 面板状态与交互 (LDStatus Core)
    // ======================================================================================

    function savePanelPosition() { try { const transform = window.getComputedStyle(panel).transform; if (transform && transform !== 'none') { const matrix = new DOMMatrixReadOnly(transform); GM_setValue(STORAGE_KEY_POSITION, { x: matrix.e, y: matrix.f }); } } catch (e) { console.error("Error saving panel position:", e); } }
    function savePanelCollapsedState() { try { GM_setValue(STORAGE_KEY_COLLAPSED, panel.classList.contains('ld-collapsed')); } catch (e) { console.error("Error saving panel collapsed state:", e); } }

    function restorePanelState() {
        try {
            const isCollapsed = GM_getValue(STORAGE_KEY_COLLAPSED, false);
            if (isCollapsed) { panel.classList.add('ld-collapsed'); if (toggleBtn) toggleBtn.textContent = '▶'; } else { panel.classList.remove('ld-collapsed'); if (toggleBtn) toggleBtn.textContent = '◀'; }
            const position = GM_getValue(STORAGE_KEY_POSITION, null);
            if (position && typeof position.x === 'number' && typeof position.y === 'number') { panel.style.transform = `translate(${position.x}px, ${position.y}px)`; } else { panel.style.left = '10px'; panel.style.top = '100px'; panel.style.transform = ''; }
        } catch (e) {
            panel.classList.remove('ld-collapsed'); if (toggleBtn) toggleBtn.textContent = '◀'; panel.style.left = '10px'; panel.style.top = '100px'; panel.style.transform = '';
        }
    }

    let isDragging = false;
    let lastX, lastY;
    if (header) {
        header.addEventListener('mousedown', (e) => {
            if (panel.classList.contains('ld-collapsed') || e.target.closest('button')) return;
            isDragging = true;
            const currentTransform = window.getComputedStyle(panel).transform;
            const matrix = new DOMMatrixReadOnly(currentTransform === 'none' ? '' : currentTransform);
            lastX = e.clientX - matrix.e;
            lastY = e.clientY - matrix.f;
            panel.style.transition = 'none';
            document.body.style.userSelect = 'none';
        });
    }
    document.addEventListener('mousemove', (e) => { if (!isDragging) return; const newX = e.clientX - lastX; const newY = e.clientY - lastY; panel.style.transform = `translate(${newX}px, ${newY}px)`; });
    document.addEventListener('mouseup', () => { if (!isDragging) return; isDragging = false; panel.style.transition = ''; document.body.style.userSelect = ''; savePanelPosition(); });

    if (toggleBtn) { toggleBtn.addEventListener('click', () => { panel.classList.toggle('ld-collapsed'); toggleBtn.textContent = panel.classList.contains('ld-collapsed') ? '▶' : '◀'; savePanelCollapsedState(); }); }
    if (refreshBtn) refreshBtn.addEventListener('click', fetchTrustLevelData);
    if (updateBtn) updateBtn.addEventListener('click', checkForUpdates);
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    function toggleTheme() { const isDarkTheme = panel.classList.contains('ld-dark-theme'); panel.classList.remove(isDarkTheme ? 'ld-dark-theme' : 'ld-light-theme'); panel.classList.add(isDarkTheme ? 'ld-light-theme' : 'ld-dark-theme'); GM_setValue(STORAGE_KEY_THEME, isDarkTheme ? 'light' : 'dark'); updateThemeButtonIcon(); }
    function updateThemeButtonIcon() { if (!themeBtn) return; const isCurrentlyDark = panel.classList.contains('ld-dark-theme'); themeBtn.textContent = isCurrentlyDark ? '🌙' : '☀️'; themeBtn.title = isCurrentlyDark ? '切换为亮色主题' : '切换为深色主题'; }

    // 检查更新逻辑
    function checkForUpdates() {
        if (!updateBtn) return;
        const currentScriptVersion = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.version : '0';
        const updateMetaURL = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.updateURL || GM_info.script.downloadURL : null;
        const downloadURL = (typeof GM_info !== 'undefined' && GM_info.script) ? GM_info.script.downloadURL || GM_info.script.updateURL : 'https://greasyfork.org/scripts/538282-ldstatus-%E6%89%8B%E6%9C%BA%E7%89%88.user.js';
        if (!updateMetaURL) { updateBtn.textContent = '⚠️'; return; }
        updateBtn.textContent = '⌛';
        GM_xmlhttpRequest({
            method: 'GET', url: updateMetaURL,
            onload: function(response) {
                if (response.status === 200) {
                    const versionMatch = response.responseText.match(/@version\s+([\d\.]+)/);
                    if (versionMatch && versionMatch[1] && versionMatch[1] > currentScriptVersion) {
                        updateBtn.textContent = '⚠️'; updateBtn.title = `发现新版本 v${versionMatch[1]}，点击更新`; updateBtn.style.color = '#ffd700'; updateBtn.onclick = function() { window.open(downloadURL, '_blank'); };
                    } else {
                        updateBtn.textContent = '✔'; updateBtn.style.color = '#68d391'; setTimeout(() => { updateBtn.textContent = '🔎'; updateBtn.style.color = ''; updateBtn.onclick = checkForUpdates; }, 3000);
                    }
                } else { updateBtn.textContent = '❌'; setTimeout(() => { updateBtn.textContent = '🔎'; }, 3000); }
            }, onerror: function() { updateBtn.textContent = '❌'; setTimeout(() => { updateBtn.textContent = '🔎'; }, 3000); }
        });
    }

    // ======================================================================================
    // 模块 3: 数据获取与渲染 (Fetch & Render)
    // ======================================================================================

    let previousRequirements = [];
    try { const storedReqs = GM_getValue(STORAGE_KEY_PREVIOUS_REQ, null); if (storedReqs) previousRequirements = JSON.parse(storedReqs); } catch (e) { GM_setValue(STORAGE_KEY_PREVIOUS_REQ, null); }

    function fetchTrustLevelData() {
        if (!content) return;
        renderFullPanelContent("加载中...");
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://connect.linux.do',
            headers: { "Referer": "https://linux.do/", "X-Requested-With": "XMLHttpRequest" },
            timeout: 15000,
            onload: function(response) {
                if (response.status === 200) parseTrustLevelData(response.responseText);
                else if (response.status === 403) renderFullPanelContent("请尝试手动访问 connect.linux.do 登录");
                else renderFullPanelContent(`获取数据失败 (${response.status})`);
            },
            onerror: function(error) { renderFullPanelContent(`网络错误: ${error.error || 'Unknown'}`); },
            ontimeout: function() { renderFullPanelContent("获取数据超时"); }
        });
    }

    function parseTrustLevelData(html) {
        try {
            const parser = new DOMParser(); const doc = parser.parseFromString(html, 'text/html');
            const trustLevelSection = Array.from(doc.querySelectorAll('.bg-white.p-6.rounded-lg')).find(div => { const heading = div.querySelector('h2'); return heading && heading.textContent.includes('信任级别'); });
            if (!trustLevelSection) { renderFullPanelContent('未找到信任级别数据'); return; }

            const heading = trustLevelSection.querySelector('h2').textContent.trim(); const match = heading.match(/(.*) - 信任级别 (\d+) 的要求/);
            const username = match ? match[1] : '未知用户'; const targetLevel = match ? match[2] : '未知';
            const tableRows = trustLevelSection.querySelectorAll('table tr'); const currentRequirements = [];

            for (let i = 1; i < tableRows.length; i++) {
                const row = tableRows[i]; const cells = row.querySelectorAll('td');
                if (cells.length >= 3) {
                    const name = cells[0].textContent.trim(); const current = cells[1].textContent.trim(); const required = cells[2].textContent.trim();
                    const isSuccess = cells[1].classList.contains('text-green-500');
                    const currentValue = (current.match(/(\d+)/) ? parseInt(current.match(/(\d+)/)[1], 10) : 0);
                    let changeValue = 0; let hasChanged = false;

                    if (previousRequirements && previousRequirements.length > 0) {
                        const prevReq = previousRequirements.find(pr => pr.name === name);
                        if (prevReq) {
                            if (currentValue !== prevReq.currentValue) { changeValue = currentValue - prevReq.currentValue; hasChanged = true; }
                            else if (prevReq.hasChanged) { changeValue = prevReq.changeValue; hasChanged = true; }
                        }
                    }
                    currentRequirements.push({ name, current, required, isSuccess, currentValue, changeValue, hasChanged });
                }
            }
            const resultText = trustLevelSection.querySelector('p.text-red-500, p.text-green-500');
            const isMeetingRequirements = resultText ? !resultText.classList.contains('text-red-500') : false;

            cachedRequirementsData = { username, targetLevel, requirements: currentRequirements, isMeetingRequirements };
            renderFullPanelContent();

            previousRequirements = currentRequirements.map(r => ({ name: r.name, currentValue: r.currentValue, changeValue: r.changeValue, hasChanged: r.hasChanged }));
            GM_setValue(STORAGE_KEY_PREVIOUS_REQ, JSON.stringify(previousRequirements));
        } catch (e) { console.error("Error parsing:", e); renderFullPanelContent('解析数据时出错'); }
    }

    function renderFullPanelContent(statusMessage = null) {
        if (!content) return;
        let html = '';

        // --- 1. 状态/数据区 ---
        if (statusMessage) {
            const isError = statusMessage !== "加载中...";
            html += `<div class="ld-loading" style="${isError ? 'color: #fc8181;' : ''}">${statusMessage}</div>`;
        } else if (cachedRequirementsData) {
            const { username, targetLevel, requirements, isMeetingRequirements } = cachedRequirementsData;
            html += `<div style="margin-bottom: 2px; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${username} - 信任级别 ${targetLevel}">${username} - TL${targetLevel}</div>
                     <div style="margin-bottom: 2px; font-weight: bold; font-size: 12px;" class="${isMeetingRequirements ? 'ld-success' : 'ld-fail'}">${isMeetingRequirements ? '✔ 已符合' : '❌ 未符合'}要求</div>`;
            requirements.forEach(req => {
                let name = req.name.replace('已读帖子（所有时间）', '已读(总)').replace('浏览的话题（所有时间）', '浏览(总)').replace('获赞：点赞用户数量', '点赞用户').replace('获赞：单日最高数量', '总获赞天').replace('被禁言（过去 6 个月）', '被禁言').replace('被封禁（过去 6 个月）', '被封禁');
                let current = req.current.match(/(\d+)/) ? req.current.match(/(\d+)/)[1] : req.current;
                let required = req.required.match(/(\d+)/) ? req.required.match(/(\d+)/)[1] : req.required;
                let changeIndicator = (req.hasChanged && req.changeValue !== 0) ? (req.changeValue > 0 ? `<span class="ld-increase"> ▲${req.changeValue}</span>` : `<span class="ld-decrease"> ▼${Math.abs(req.changeValue)}</span>`) : '';
                html += `<div class="ld-trust-level-item ${req.isSuccess ? 'ld-success' : 'ld-fail'}" title="${req.name}: ${req.current} / ${req.required}"><span class="ld-name">${name}</span><span class="ld-value">${current}${changeIndicator} / ${required}</span></div>`;
            });
        } else {
            html += '<div class="ld-loading">无数据</div>';
        }

        html += `<hr class="ld-separator">`;

        // --- 2. 自定义标签 ---
        const defaultTags = [ { name: "人工智能", url: "https://linux.do/tag/%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD" }, { name: "订阅节点", url: "https://linux.do/tag/%E8%AE%A2%E9%98%85%E8%8A%82%E7%82%B9" } ];
        let customTags = [];
        try { customTags = JSON.parse(GM_getValue(STORAGE_KEY_CUSTOM_TAGS, JSON.stringify(defaultTags))); } catch (e) { customTags = defaultTags; }

        html += `<div class="ld-section-header"><span class="ld-title">我的标签</span><button class="ld-add-tag-btn" title="添加新标签">➕</button></div>`;
        if (customTags.length > 0) {
            customTags.forEach((tag, index) => {
                html += `<div class="ld-custom-tag-item"><a href="${tag.url}" target="_blank" class="ld-custom-tag-link" title="访问标签: ${tag.name}">${tag.name}</a><button class="ld-delete-tag-btn" data-index="${index}" title="删除此标签">✖</button></div>`;
            });
        } else { html += `<div style="font-size: 11px; text-align: center; opacity: 0.7; padding: 2px 0;">点击 ➕ 添加标签</div>`; }

        html += `<hr class="ld-separator">`;

        // --- 3. 辅助功能 (排序器) ---
        // 仅在非详情页显示排序功能
        if (!/^\/t\/[^\/]+\/\d+/.test(window.location.pathname)) {
            html += `<div class="ld-section-header"><span class="ld-title">辅助工具</span></div>
                     <div class="ld-tools-container">
                         <button class="ld-tool-btn ld-tool-sort ${sorterState.isNewestFirst ? 'active' : ''}" id="ld-sort-btn" title="${sorterState.isNewestFirst ? '已按时间排序' : '点击按最新时间排序'}">${sorterState.isNewestFirst ? '✅' : '⏰'}</button>
                         <button class="ld-tool-btn ld-tool-auto ${sorterState.autoLoadEnabled ? 'active' : ''}" id="ld-autoload-btn" title="${sorterState.autoLoadEnabled ? '自动加载: 开' : '自动加载: 关'}">${sorterState.autoLoadEnabled ? '⚡' : '🔄'}</button>
                         <button class="ld-tool-btn ld-tool-refresh" id="ld-refresh-sort-btn" title="手动刷新排序">🔃</button>
                     </div>`;
        } else {
             html += `<div class="ld-section-header" style="opacity:0.6;"><span class="ld-title">帖子详情页禁用</span></div>`;
        }

        html += `<div class="ld-credit-note" title="By 1e0n & Wythe">LDStatus Ultimate v4.4</div>`;

        content.innerHTML = html;
    }

    function handleContentClick(e) {
        if (e.target.matches('.ld-add-tag-btn')) handleAddTag();
        if (e.target.matches('.ld-delete-tag-btn')) handleDeleteTag(parseInt(e.target.getAttribute('data-index'), 10));
        // 排序器按钮事件
        if (e.target.closest('#ld-sort-btn')) toggleSort();
        if (e.target.closest('#ld-autoload-btn')) toggleAutoLoad();
        if (e.target.closest('#ld-refresh-sort-btn')) manualRefreshSort();
    }

    // 标签管理逻辑
    function handleAddTag() {
        const tagName = prompt("请输入新标签的名称:", "");
        if (!tagName || !tagName.trim()) return;
        const trimmedName = tagName.trim();
        const finalURL = "https://linux.do/tag/" + encodeURIComponent(trimmedName);
        let customTags = []; try { customTags = JSON.parse(GM_getValue(STORAGE_KEY_CUSTOM_TAGS, "[]")) || []; } catch (e) {}
        customTags.push({ name: trimmedName, url: finalURL });
        GM_setValue(STORAGE_KEY_CUSTOM_TAGS, JSON.stringify(customTags));
        renderFullPanelContent();
    }

    function handleDeleteTag(index) {
        if (isNaN(index) || !confirm("确定删除？")) return;
        let customTags = []; try { customTags = JSON.parse(GM_getValue(STORAGE_KEY_CUSTOM_TAGS, "[]")) || []; } catch (e) {}
        if (index >= 0 && index < customTags.length) {
            customTags.splice(index, 1);
            GM_setValue(STORAGE_KEY_CUSTOM_TAGS, JSON.stringify(customTags));
            renderFullPanelContent();
        }
    }

    // ======================================================================================
    // 模块 4: 帖子排序与新标签页逻辑 (Sorter Core)
    // ======================================================================================

    function getContainer() { return document.querySelector('.topic-list tbody, .topic-list, .latest-topic-list, #topic-list, .user-stream'); }
    function getTopics() { const container = getContainer(); return container ? Array.from(container.querySelectorAll('tr.topic-list-item, .topic-list-item, .latest-topic-list-item, .user-stream-item')).filter(item => item.parentNode) : []; }

    function getTopicTime(topic, index) {
        const selectors = ['.activity[title*="创建"]', '.age[title*="创建"]', '[title*="年"][title*="月"]', '.relative-date', '.created-at', '.age', '.post-activity', 'time[datetime]', '.crawler-post-meta time'];
        for (let selector of selectors) {
            const elem = topic.querySelector(selector);
            if (elem) {
                const datetime = elem.getAttribute('datetime');
                if (datetime && !isNaN(new Date(datetime).getTime())) return new Date(datetime).getTime();
                const titleTime = parseTime(elem.getAttribute('title')); if (titleTime) return titleTime;
                const textTime = parseTime(elem.textContent); if (textTime) return textTime;
            }
        }
        return Date.now() - (index * 1000); // Fallback
    }

    function parseTime(str) {
        if (!str) return null;
        let match = str.match(/创建日期[：:]\s*(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日\s*(\d{1,2}):(\d{2})/);
        if (match) return new Date(match[1], match[2]-1, match[3], match[4], match[5]).getTime();
        match = str.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
        if (match) return new Date(match[1], match[2]-1, match[3]).getTime();
        match = str.match(/(\d+)\s*小时前/); if (match) return Date.now() - parseInt(match[1]) * 3600000;
        match = str.match(/(\d+)\s*分钟前/); if (match) return Date.now() - parseInt(match[1]) * 60000;
        match = str.match(/(\d+)\s*天前/); if (match) return Date.now() - parseInt(match[1]) * 86400000;
        if (str.includes('刚刚')) return Date.now();
        const date = new Date(str); return !isNaN(date.getTime()) ? date.getTime() : null;
    }

    function performSort() {
        const container = getContainer();
        const topics = getTopics();
        if (!container || topics.length === 0) return false;

        const sorted = topics.map((topic, index) => ({ element: topic, time: getTopicTime(topic, index) })).sort((a, b) => b.time - a.time);
        const fragment = document.createDocumentFragment();
        sorted.forEach(item => fragment.appendChild(item.element));
        container.appendChild(fragment);
        return true;
    }

    function toggleSort() {
        const container = getContainer();
        const topics = getTopics();
        if (!container || topics.length === 0) { showToast('当前页面未找到帖子列表'); return; }

        if (!sorterState.isNewestFirst) {
            if (sorterState.originalOrder.length === 0) sorterState.originalOrder = topics.map(t => t.cloneNode(true));
            if (performSort()) {
                sorterState.isNewestFirst = true;
                showToast('已按时间倒序排列 ✅');
                setupObserver();
                if (sorterState.autoLoadEnabled) startNewTopicCheck();
            }
        } else {
            const fragment = document.createDocumentFragment();
            sorterState.originalOrder.forEach(topic => fragment.appendChild(topic.cloneNode(true)));
            container.innerHTML = ''; container.appendChild(fragment);
            sorterState.isNewestFirst = false;
            showToast('已恢复默认排序 ⏰');
            if (sorterState.observer) { sorterState.observer.disconnect(); sorterState.observer = null; }
            stopNewTopicCheck();
        }
        renderFullPanelContent(); // 更新按钮状态
        sorterState.lastCount = topics.length;
    }

    function toggleAutoLoad() {
        sorterState.autoLoadEnabled = !sorterState.autoLoadEnabled;
        if (sorterState.autoLoadEnabled) { startNewTopicCheck(); showToast('自动加载新话题: 开 ⚡'); }
        else { stopNewTopicCheck(); showToast('自动加载新话题: 关 🔄'); }
        renderFullPanelContent();
    }

    function manualRefreshSort() {
        if (sorterState.isNewestFirst) { performSort(); showToast('排序已刷新 🔃'); }
        else { showToast('请先开启排序功能'); }
    }

    function setupObserver() {
        if (sorterState.observer) return;
        const container = getContainer();
        if (!container) return;
        sorterState.observer = new MutationObserver(() => {
            if (!sorterState.isNewestFirst) return;
            const currentTopics = getTopics();
            if (currentTopics.length !== sorterState.lastCount) {
                requestAnimationFrame(() => {
                    if (sorterState.isNewestFirst && performSort()) {
                        sorterState.lastCount = currentTopics.length;
                    }
                });
            }
        });
        sorterState.observer.observe(container, { childList: true, subtree: true });
    }

    function startNewTopicCheck() {
        if (sorterState.newTopicCheckInterval) clearInterval(sorterState.newTopicCheckInterval);
        sorterState.newTopicCheckInterval = setInterval(() => {
            if (!sorterState.isNewestFirst || !sorterState.autoLoadEnabled) return;
            const newTopicsBtn = document.querySelector('.show-more.has-topics a.alert-info');
            if (newTopicsBtn) {
                const match = newTopicsBtn.textContent.match(/查看\s*(\d+)\s*个/);
                if (match && parseInt(match[1]) >= 5) { newTopicsBtn.click(); showToast(`已加载 ${match[1]} 个新话题`); setTimeout(performSort, 500); }
            }
        }, 3000);
    }
    function stopNewTopicCheck() { if (sorterState.newTopicCheckInterval) { clearInterval(sorterState.newTopicCheckInterval); sorterState.newTopicCheckInterval = null; } }

    function showToast(msg) {
        const old = document.getElementById('ld-toast'); if (old) old.remove();
        const toast = document.createElement('div');
        toast.id = 'ld-toast';
        toast.style.cssText = 'position:fixed;top:20px;left:50%;transform:translateX(-50%);z-index:10001;background:rgba(0,0,0,0.8);color:white;padding:8px 16px;border-radius:20px;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.2);pointer-events:none;';
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => toast && toast.remove(), 2000);
    }

    // --- 新标签页打开逻辑 (仅在列表页生效) ---
    function attachNewTabListener() {
        document.addEventListener('click', (ev) => {
            // [修改] 核心逻辑：如果当前页面本身就是帖子详情页，则不劫持任何链接
            if (/^\/t\/[^\/]+\/\d+/.test(location.pathname)) {
                return; // 当前在详情页内，直接放行，使用原生行为
            }

            if (ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;
            let a = ev.target.closest('a');
            if (!a || !a.href || a.href === '#' || a.hasAttribute('download')) return;

            try {
                const url = new URL(a.href);
                // 只处理指向帖子详情页的链接
                const isTopicLink = /\/t\/[^\/]+\/\d+/.test(url.pathname);
                if (!isTopicLink) return;

                ev.preventDefault();
                ev.stopPropagation();
                if (typeof GM_openInTab === 'function') GM_openInTab(a.href, { active: true, setParent: true });
                else window.open(a.href, '_blank', 'noopener');
            } catch(e) { /* ignore */ }
        }, true);
    }

    // ======================================================================================
    // 初始化
    // ======================================================================================

    function initializePanel() {
        if (!panel || !header || !content) { setTimeout(initializePanel, 50); return; }
        queryHeaderElements();
        restorePanelState();
        updateThemeButtonIcon();
        fetchTrustLevelData();
        setInterval(fetchTrustLevelData, 300000);

        // 页面变动检测 (SPA 路由变化时重置排序状态)
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                sorterState.isNewestFirst = false; sorterState.originalOrder = [];
                if (sorterState.observer) { sorterState.observer.disconnect(); sorterState.observer = null; }
                stopNewTopicCheck();
                renderFullPanelContent(); // 重新渲染以更新按钮状态
            }
        }, 1000);

        attachNewTabListener();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePanel);
    else initializePanel();

})();
