// ==UserScript==
// @name         YouTube Shorts 表現分析
// @namespace    http://tampermonkey.net/
// @version      4.4.1
// @description  正式版v1。
// @author       AI Designer & Engineer (Hotfixed)
// @match        https://www.youtube.com/@*/shorts
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544069/YouTube%20Shorts%20%E8%A1%A8%E7%8F%BE%E5%88%86%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/544069/YouTube%20Shorts%20%E8%A1%A8%E7%8F%BE%E5%88%86%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // --- 全域變數 ---
    let analysisModal = null;
    let allVideoData = [];
    let currentFilters = {
        title: '',
        minViews: null,
        maxViews: null,
        tags: new Set()
    };

    // --- 樣式定義 (GM_addStyle) ---
    GM_addStyle(`
        /* Google 字體 */
        @import url('https://fonts.googleapis.com/css2?family=Huninn&display=swap');

        /* 分析按鈕 */
        #shorts-stats-button { position: relative; overflow: hidden; font-family: "Roboto", "Arial", sans-serif; font-size: 14px; font-weight: 500; height: 32px; padding: 0 16px; margin-left: 8px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; background-color: transparent !important; border: none; color: #5e3c40 !important; z-index: 1; transition: color 0.4s ease-in-out; }
        #shorts-stats-button::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; background-color: #F8D7DA; border-radius: 8px; transform: rotate(0deg) scale(1); border: 1px solid rgba(0, 0, 0, 0.1); transition: all 0.4s ease-in-out; }
        #shorts-stats-button:hover::before { background-color: #FFD700; border-radius: 50%; transform: rotate(360deg) scale(0.1); border-color: transparent; }
        #shorts-stats-button:hover { color: #FFD700 !important; }

        /* 彈出視窗基礎樣式 */
        #analysis-modal-overlay { position: fixed !important; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; background-color: rgba(0,0,0,0.7) !important; z-index: 9999 !important; display: flex !important; justify-content: center !important; align-items: center !important; }
        #analysis-modal { background-color: #212121 !important; color: #fff !important; width: 90vw !important; max-width: 1400px !important; max-height: 90vh !important; border-radius: 12px !important; display: flex !important; flex-direction: column !important; overflow: hidden !important; border: 1px solid #555 !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important; font-family: 'Huninn', sans-serif !important; font-size: 15px !important; }

        /* Header */
        .modal-header { padding: 16px; border-bottom: 1px solid #444; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0; }
        .modal-header h2 { margin: 0; font-size: 20px; }
        .modal-close-btn { background: none; border: none; color: #fff; font-size: 24px; cursor: pointer; }

        /* 統計總覽模塊 */
        #stats-overview-panel { padding: 16px 24px; border-bottom: 1px solid #444; display: flex; flex-direction: column; gap: 8px; }
        #stats-overview-title { font-size: 13px; color: #aaa; text-align: center; }
        #stats-overview-grid { display: flex; justify-content: space-around; align-items: stretch; flex-wrap: wrap; gap: 16px; }
        .stat-item { text-align: center; display: flex; flex-direction: column; }
        .stat-value { font-size: 28px; font-weight: bold; color: #fff; line-height: 1.1; }
        .stat-value .stat-unit { font-size: 16px; font-weight: normal; color: #ccc; margin-left: 4px; }
        .stat-label { font-size: 14px; color: #aaa; margin-top: 4px; }

        /* Body (左右佈局) */
        .modal-body { padding: 16px; flex-grow: 1; overflow: hidden; display: grid; grid-template-columns: 240px 1fr; gap: 16px; }

        /* 左側 Tag 面板 */
        #tag-panel { display: flex; flex-direction: column; gap: 8px; border-right: 1px solid #444; padding-right: 16px; overflow-y: auto; }
        .tag-item { cursor: pointer; padding: 6px 8px; border-radius: 4px; transition: background-color 0.2s; word-break: break-all; font-size: 14px; }
        .tag-item:hover { background-color: #3f3f3f; }
        .tag-item.active { background-color: #065fd4; color: #fff; font-weight: bold; }
        .tag-item span { color: #aaa; margin-left: 4px; }

        /* 右側主內容區 */
        #main-content-panel { display: flex; flex-direction: column; gap: 16px; min-height: 0; }

        /* 篩選器佈局 */
        .filter-controls { display: flex; align-items: flex-end; gap: 16px; flex-shrink: 0; flex-wrap: wrap; }
        .filter-group { display: flex; flex-direction: column; gap: 4px; }
        .filter-group.title-group { flex-grow: 1; min-width: 200px; }
        .filter-group label { font-size: 12px; color: #aaa; margin-left: 2px; }
        .filter-group input { box-sizing: border-box; padding: 8px; border-radius: 4px; border: 1px solid #555; background-color: #121212; color: #fff; font-size: 14px; font-family: 'Huninn', sans-serif; }
        .views-inputs { display: flex; gap: 8px; }
        .views-inputs input { width: 100px; }
        .selection-controls { display: flex; gap: 8px; }
        .selection-controls button { background-color: #333; border: 1px solid #555; color: #eee; cursor: pointer; padding: 8px 12px; font-size: 14px; border-radius: 4px; }
        .selection-controls button:hover { background-color: #444; }

        /* 隱藏數字輸入框的箭頭 */
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }

        /* 影片列表 */
        .video-list-container { border: 1px solid #444; border-radius: 8px; display: flex; flex-direction: column; flex-grow: 1; min-height: 0; overflow: hidden; }
        #video-list { overflow-y: auto; height: 100%; }
        .video-list-header, .video-list-item { display: grid; grid-template-columns: 60px 60px 1fr 150px; gap: 16px; padding: 10px 12px; align-items: center; border-bottom: 1px solid #444; }
        .video-list-header { font-weight: bold; background-color: #303030; position: sticky; top: 0; z-index: 10; padding: 8px 12px; }
        .video-list-item:last-child { border-bottom: none; }
        .video-list-item:hover { background-color: #2c2c2c; }
        .header-cell, .cell-center { display: flex; justify-content: center; align-items: center; }
        .video-list-header > div:nth-child(2), .video-list-header > div:nth-child(4) { text-align: center; }
        .video-index { text-align: center; }
        .video-views { text-align: right; padding-right: 8px; }
        .video-title { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    `);

    // --- UI 創建函數 ---
    function createAnalysisUI() { /* ... 此函數無變動 ... */ if (analysisModal) analysisModal.remove(); const createEl = (tag, options = {}) => { const el = document.createElement(tag); if (options.className) el.className = options.className; if (options.id) el.id = options.id; if (options.text) el.textContent = options.text; if (options.type) el.type = options.type; if (options.placeholder) el.placeholder = options.placeholder; Object.keys(options.listeners || {}).forEach(event => { el.addEventListener(event, options.listeners[event]); }); return el; }; analysisModal = createEl('div', { id: 'analysis-modal-overlay', listeners: { click: (e) => { if (e.target.id === 'analysis-modal-overlay') analysisModal.remove(); } } }); const modal = createEl('div', { id: 'analysis-modal' }); const modalHeader = createEl('div', { className: 'modal-header' }); modalHeader.appendChild(createEl('h2', { text: 'Shorts 表現分析報告' })); modalHeader.appendChild(createEl('button', { className: 'modal-close-btn', text: '×', listeners: { click: () => analysisModal.remove() } })); const statsPanel = createEl('div', { id: 'stats-overview-panel' }); statsPanel.appendChild(createEl('div', { id: 'stats-overview-title' })); statsPanel.appendChild(createEl('div', { id: 'stats-overview-grid' })); const modalBody = createEl('div', { className: 'modal-body' }); const tagPanel = createEl('div', { id: 'tag-panel' }); const mainContentPanel = createEl('div', { id: 'main-content-panel' }); const filterControls = createEl('div', { className: 'filter-controls' }); const titleGroup = createEl('div', {className: 'filter-group title-group'}); titleGroup.appendChild(createEl('label', {text: '標題關鍵字'})); titleGroup.appendChild(createEl('input', { id: 'video-search-input', type: 'text', placeholder: '依標題搜尋...', listeners: { input: (e) => { currentFilters.title = e.target.value; applyAndRender(); } } })); const viewsGroup = createEl('div', {className: 'filter-group'}); viewsGroup.appendChild(createEl('label', {text: '播放量範圍'})); const viewsInputs = createEl('div', {className: 'views-inputs'}); viewsInputs.appendChild(createEl('input', { id: 'min-views-input', type: 'number', placeholder: '最小值', listeners: { input: (e) => { currentFilters.minViews = e.target.value === '' ? null : parseInt(e.target.value, 10); applyAndRender(); } } })); viewsInputs.appendChild(createEl('input', { id: 'max-views-input', type: 'number', placeholder: '最大值', listeners: { input: (e) => { currentFilters.maxViews = e.target.value === '' ? null : parseInt(e.target.value, 10); applyAndRender(); } } })); viewsGroup.appendChild(viewsInputs); const selectionGroup = createEl('div', {className: 'filter-group'}); selectionGroup.appendChild(createEl('label', {text: '操作', style: 'opacity:0;'})); const selectionControls = createEl('div', {className: 'selection-controls'}); selectionControls.appendChild(createEl('button', { text: '全選', listeners: { click: () => toggleSelectAll(true) } })); selectionControls.appendChild(createEl('button', { text: '清除', listeners: { click: () => toggleSelectAll(false) } })); selectionGroup.appendChild(selectionControls); filterControls.append(titleGroup, viewsGroup, selectionGroup); const videoListContainer = createEl('div', { className: 'video-list-container' }); const videoListHeader = createEl('div', { className: 'video-list-header' }); const headerCheckboxCell = createEl('div', {className: 'header-cell'}); videoListHeader.appendChild(headerCheckboxCell); ['序號', '標題', '播放量'].forEach(text => videoListHeader.appendChild(createEl('div', { text }))); const videoList = createEl('div', { id: 'video-list' }); videoListContainer.append(videoListHeader, videoList); mainContentPanel.append(filterControls, videoListContainer); modalBody.append(tagPanel, mainContentPanel); modal.append(modalHeader, statsPanel, modalBody); analysisModal.appendChild(modal); document.body.appendChild(analysisModal); }

    // --- 資料抓取與處理 ---
    // [修正] 還原為穩定運作的 forEach 版本
    function scrapeShortsData() {
        const videoElements = document.querySelectorAll('ytd-rich-item-renderer');
        const data = [];
        videoElements.forEach((el, i) => {
            const titleElement = el.querySelector('h3.shortsLockupViewModelHostMetadataTitle a');
            const viewsElement = el.querySelector('div.shortsLockupViewModelHostOutsideMetadataSubhead');
            if (titleElement && viewsElement) {
                const fullTitle = titleElement.getAttribute('title');
                const viewsText = viewsElement.innerText;
                let cleanTitle = '';
                let tags = [];
                const parts = fullTitle.split('#').map(p => p.trim());
                if (parts[0] === '' && parts.length > 1) {
                    cleanTitle = parts[1];
                    tags = parts.slice(2).filter(t => t);
                } else {
                    cleanTitle = parts[0];
                    tags = parts.slice(1).filter(t => t);
                }
                data.push({
                    id: i,
                    chronologicalIndex: videoElements.length - i,
                    title: cleanTitle || fullTitle,
                    fullTitle: fullTitle,
                    tags: tags,
                    views: parseViews(viewsText),
                    selected: false
                });
            }
        });
        return data;
    }

    // --- 渲染與更新 ---
    function renderVideoList(videoData) { /* ... 此函數無變動 ... */ const listEl = document.getElementById('video-list'); if (!listEl) return; while (listEl.firstChild) { listEl.removeChild(listEl.firstChild); } const sortedVideos = [...videoData].sort((a, b) => b.chronologicalIndex - a.chronologicalIndex); sortedVideos.forEach(video => { const item = document.createElement('div'); item.className = 'video-list-item'; const cbDiv = document.createElement('div'); cbDiv.className = 'cell-center'; const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = video.selected; cb.addEventListener('change', () => { const originalVideo = allVideoData.find(v => v.id === video.id); if (originalVideo) originalVideo.selected = cb.checked; updateStatsOverview(); }); cbDiv.appendChild(cb); const indexDiv = document.createElement('div'); indexDiv.className = 'video-index'; indexDiv.textContent = video.chronologicalIndex; const titleDiv = document.createElement('div'); titleDiv.className = 'video-title'; titleDiv.textContent = video.title; titleDiv.title = video.fullTitle; const viewsDiv = document.createElement('div'); viewsDiv.className = 'video-views'; viewsDiv.textContent = video.views.toLocaleString(); item.append(cbDiv, indexDiv, titleDiv, viewsDiv); listEl.appendChild(item); }); updateVisibleCountDisplay(sortedVideos); }
    function renderTagList() { /* ... 此函數無變動 ... */ const tagPanel = document.getElementById('tag-panel'); if (!tagPanel) return; while (tagPanel.firstChild) { tagPanel.removeChild(tagPanel.firstChild); } const tagCounts = new Map(); allVideoData.forEach(video => { video.tags.forEach(tag => { const lowerCaseTag = tag.toLowerCase(); tagCounts.set(lowerCaseTag, (tagCounts.get(lowerCaseTag) || 0) + 1); }); }); const sortedTags = [...tagCounts.entries()].sort((a, b) => b[1] - a[1]); const allItem = document.createElement('div'); allItem.className = 'tag-item'; allItem.textContent = `所有影片`; const allCountSpan = document.createElement('span'); allCountSpan.textContent = `(${allVideoData.length})`; allItem.appendChild(allCountSpan); allItem.addEventListener('click', () => { currentFilters.tags.clear(); document.querySelectorAll('#tag-panel .tag-item.active').forEach(el => el.classList.remove('active')); allItem.classList.add('active'); applyAndRender(); }); tagPanel.appendChild(allItem); sortedTags.forEach(([tag, count]) => { const tagItem = document.createElement('div'); tagItem.className = 'tag-item'; tagItem.textContent = `#${tag}`; const countSpan = document.createElement('span'); countSpan.textContent = `(${count})`; tagItem.appendChild(countSpan); tagItem.addEventListener('click', () => { if (currentFilters.tags.has(tag)) { currentFilters.tags.delete(tag); tagItem.classList.remove('active'); } else { currentFilters.tags.add(tag); tagItem.classList.add('active'); } if (currentFilters.tags.size === 0) { allItem.classList.add('active'); } else { allItem.classList.remove('active'); } applyAndRender(); }); tagPanel.appendChild(tagItem); }); if (currentFilters.tags.size === 0) { allItem.classList.add('active'); } }
    function updateVisibleCountDisplay(visibleVideos) { /* ... 此函數無變動 ... */ const headerCell = document.querySelector('.video-list-header .header-cell'); if (!headerCell) return; while (headerCell.firstChild) { headerCell.removeChild(headerCell.firstChild); } const countDisplay = document.createElement('div'); countDisplay.style.cssText = 'color: #aaa; font-size: 14px; font-weight: bold;'; countDisplay.textContent = `# ${visibleVideos.length}`; headerCell.appendChild(countDisplay); }

    // --- 統計相關函數 ---
    function calculateStatistics(videos) { /* ... 此函數無變動 ... */ if (!videos || videos.length === 0) { return { count: 0, total: 0, avg: 0, median: 0, stdDev: 0, max: 0, min: 0 }; } const views = videos.map(v => v.views).sort((a, b) => a - b); const count = views.length; const total = views.reduce((sum, v) => sum + v, 0); const avg = total / count; const mid = Math.floor(count / 2); const median = count % 2 !== 0 ? views[mid] : (views[mid - 1] + views[mid]) / 2; const stdDev = Math.sqrt(views.map(v => Math.pow(v - avg, 2)).reduce((sum, v) => sum + v, 0) / count); return { count, total, avg, median, stdDev, max: views[count - 1], min: views[0] }; }
    function formatNumberWithUnit(num) { /* ... 此函數無變動 ... */ const createFormattedEl = (value, unit) => { const valEl = document.createElement('span'); valEl.className = 'stat-value'; valEl.textContent = value; if (unit) { const unitEl = document.createElement('span'); unitEl.className = 'stat-unit'; unitEl.textContent = unit; valEl.appendChild(unitEl); } return valEl; }; if (num >= 1_000_000) return createFormattedEl((num / 1_000_000).toFixed(1), 'M'); if (num >= 10_000) return createFormattedEl((num / 1000).toFixed(1), 'k'); return createFormattedEl(Math.round(num).toLocaleString()); }
    function updateStatsOverview() { /* ... 此函數無變動 ... */ const selectedVideos = allVideoData.filter(v => v.selected); const visibleVideos = applyFilters(); let targetVideos = selectedVideos.length > 0 ? selectedVideos : visibleVideos; let titleText = selectedVideos.length > 0 ? `已選 ${selectedVideos.length} 部影片統計` : `可見 ${visibleVideos.length} 部影片統計`; const stats = calculateStatistics(targetVideos); const titleEl = document.getElementById('stats-overview-title'); const gridEl = document.getElementById('stats-overview-grid'); if (!titleEl || !gridEl) return; titleEl.textContent = titleText; while (gridEl.firstChild) { gridEl.removeChild(gridEl.firstChild); } const metrics = [ { label: '總播放量', value: stats.total }, { label: '平均播放量', value: stats.avg }, { label: '播放量中位數', value: stats.median }, { label: '最高播放量', value: stats.max }, { label: '最低播放量', value: stats.min }, { label: '標準差', value: stats.stdDev } ]; metrics.forEach(metric => { const itemEl = document.createElement('div'); itemEl.className = 'stat-item'; const labelEl = document.createElement('div'); labelEl.className = 'stat-label'; labelEl.textContent = metric.label; itemEl.append(formatNumberWithUnit(metric.value), labelEl); gridEl.appendChild(itemEl); }); }

    // --- 核心邏輯 ---
    async function startAnalysis() { /* ... 此函數無變動 ... */ showLoadingOverlay('滾動頁面中，請稍候...'); await scrollToBottom(); showLoadingOverlay('正在抓取與處理影片資料...'); allVideoData = scrapeShortsData(); if (allVideoData.length === 0) { alert('找不到任何Shorts影片，請確認您在正確的頻道Shorts頁面。'); removeLoadingOverlay(); return; } createAnalysisUI(); renderTagList(); applyAndRender(); removeLoadingOverlay(); }
    function applyAndRender() { /* ... 此函數無變動 ... */ const filtered = applyFilters(); renderVideoList(filtered); updateStatsOverview(); }
    function toggleSelectAll(select) { /* ... 此函數無變動 ... */ let filteredData = applyFilters(); const filteredIds = new Set(filteredData.map(v => v.id)); allVideoData.forEach(video => { if (filteredIds.has(video.id)) { video.selected = select; } }); renderVideoList(filteredData); updateStatsOverview(); }
    function applyFilters() { /* ... 此函數無變動 ... */ let filteredData = [...allVideoData]; if (currentFilters.title) { const searchTerm = currentFilters.title.toLowerCase(); filteredData = filteredData.filter(v => v.fullTitle.toLowerCase().includes(searchTerm)); } if (currentFilters.minViews !== null) { filteredData = filteredData.filter(v => v.views >= currentFilters.minViews); } if (currentFilters.maxViews !== null) { filteredData = filteredData.filter(v => v.views <= currentFilters.maxViews); } if (currentFilters.tags.size > 0) { filteredData = filteredData.filter(v => v.tags.some(t => currentFilters.tags.has(t.toLowerCase()))); } return filteredData; }

    // --- 工具函數 ---
    function parseViews(s) { /* ... 此函數無變動 ... */ let numStr = s.replace(/[,萬千]/g, '').replace(/觀看次數：|次|views/gi, '').trim(); let multiplier = 1; if (s.toLowerCase().includes('k')) { multiplier = 1000; } else if (s.includes('萬') || s.toLowerCase().includes('万')) { multiplier = 10000; } let n = parseFloat(numStr) * multiplier; return isNaN(n) ? 0 : Math.round(n); }
    async function scrollToBottom() { return new Promise(r => { let h = 0; const i = setInterval(() => { const ch = document.documentElement.scrollHeight; window.scrollTo(0, ch); if (ch === h) { setTimeout(() => { if (document.documentElement.scrollHeight === ch) { clearInterval(i); window.scrollTo(0, 0); r(); } }, 2500); } h = ch; }, 500); }); }
    function showLoadingOverlay(t) { removeLoadingOverlay(); const o = document.createElement('div'); o.id = 'loading-overlay'; o.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; justify-content: center; align-items: center; color: white; font-size: 24px; font-weight: bold;`; o.textContent = t; document.body.appendChild(o); }
    function removeLoadingOverlay() { const o = document.getElementById('loading-overlay'); if (o) o.remove(); }
    function addMainButton() { const observer = new MutationObserver(() => { const c = document.querySelector('ytd-feed-filter-chip-bar-renderer #chips'); if (c && !document.getElementById('shorts-stats-button')) { const b = document.createElement('button'); b.id = 'shorts-stats-button'; b.innerText = '統計'; b.onclick = startAnalysis; c.appendChild(b); observer.disconnect(); } }); observer.observe(document.body, { childList: true, subtree: true }); }

    // --- 啟動腳本 ---
    addMainButton();
})();