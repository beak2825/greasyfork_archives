// ==UserScript==
// @name         動畫瘋觀看紀錄側欄 (完整版)
// @namespace    https://greasyfork.org/users/119029
// @version      1.0
// @license MIT
// @description  使用 Fetch API 直接獲取觀看紀錄，動態嵌入側欄，動畫瘋風格設計，支援展開/隱藏功能與錯誤快取機制。
// @author       MC_Chu
// @match        https://ani.gamer.com.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @connect      ani.gamer.com.tw
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/544703/%E5%8B%95%E7%95%AB%E7%98%8B%E8%A7%80%E7%9C%8B%E7%B4%80%E9%8C%84%E5%81%B4%E6%AC%84%20%28%E5%AE%8C%E6%95%B4%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544703/%E5%8B%95%E7%95%AB%E7%98%8B%E8%A7%80%E7%9C%8B%E7%B4%80%E9%8C%84%E5%81%B4%E6%AC%84%20%28%E5%AE%8C%E6%95%B4%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS - 動畫瘋風格：白底、黑字、藍按鈕
    const styles = `
    #tm-anime-sidebar {
        position: fixed; top: 50%; right: -400px; width: 400px; height: 80vh;
        background: #fff; border: 1px solid #ddd; border-radius: 8px 0 0 8px;
        box-shadow: -3px 0 15px rgba(0,0,0,0.1); transition: right .4s;
        transform: translateY(-50%); z-index: 99999; font-family: 'Microsoft JhengHei', 'Noto Sans TC', sans-serif;
        overflow: hidden;
    }
    #tm-anime-sidebar.tm-show { right: 0 !important; }
    #tm-sidebar-toggle {
        position: absolute; left: -45px; top: 50%; transform: translateY(-50%);
        width: 45px; height: 90px; background: #0084ff; color: #fff; border: none;
        border-radius: 8px 0 0 8px; cursor: pointer; writing-mode: vertical-lr;
        text-orientation: mixed; box-shadow: -2px 0 8px rgba(0,0,0,0.15); z-index:100000;
        transition: all .3s;
    }
    #tm-sidebar-toggle:hover { background: #0066cc; transform: translateY(-50%) translateX(-3px); }
    #tm-sidebar-header {
        display:flex; justify-content:space-between; align-items:center;
        padding:15px 20px; background:#f8f9fa; border-bottom:1px solid #e9ecef;
    }
    #tm-sidebar-title { margin:0; font-size:16px; color:#333; }
    #tm-refresh-btn {
        background:#0084ff; color:#fff; border:none; border-radius:4px;
        padding:6px 12px; font-size:12px; cursor:pointer; transition:background .3s;
    }
    #tm-refresh-btn:hover { background:#0066cc; }
    #tm-close-btn {
        position:absolute; top:10px; right:10px; background:none; border:none;
        font-size:20px; color:#666; cursor:pointer; width:30px; height:30px;
        display:flex; align-items:center; justify-content:center; border-radius:50%;
        transition:all .3s;
    }
    #tm-close-btn:hover { background:#f8f9fa; color:#333; }
    #tm-sidebar-content {
        padding:15px; height:calc(100% - 70px); overflow-y:auto;
    }
    #tm-sidebar-content::-webkit-scrollbar { width:6px; }
    #tm-sidebar-content::-webkit-scrollbar-track { background:#f1f1f1; border-radius:3px; }
    #tm-sidebar-content::-webkit-scrollbar-thumb { background:#c1c1c1; border-radius:3px; }
    #tm-sidebar-content::-webkit-scrollbar-thumb:hover { background:#a1a1a1; }
    .tm-history-item {
        border:1px solid #e9ecef; border-radius:6px; padding:12px; margin-bottom:12px;
        transition:all .3s; cursor:pointer; background:#fff;
    }
    .tm-history-item:hover {
        border-color:#0084ff; box-shadow:0 2px 8px rgba(0,132,255,0.1);
        transform:translateY(-1px);
    }
    .tm-history-title { font-size:14px; font-weight:bold; color:#333;
        display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;
        overflow:hidden; text-overflow:ellipsis; margin-bottom:8px;
    }
    .tm-history-meta { display:flex; justify-content:space-between; align-items:center;
        font-size:12px; color:#666; margin-bottom:10px;
    }
    .tm-episode-info { background:#f8f9fa; padding:2px 6px; border-radius:3px; }
    .tm-progress-info { color:#28a745; }
    .tm-play-button {
        width:100%; background:#0084ff; color:#fff; border:none; border-radius:4px;
        padding:8px 12px; font-size:13px; display:flex; align-items:center;
        justify-content:center; gap:6px; font-weight:bold; cursor:pointer;
        transition:all .3s;
    }
    .tm-play-button:hover {
        background:#0066cc; transform:translateY(-1px);
        box-shadow:0 2px 6px rgba(0,132,255,0.3);
    }
    .tm-no-data, .tm-loading, .tm-error {
        text-align:center; padding:30px; font-size:14px;
    }
    .tm-no-data { color:#666; }
    .tm-loading { color:#999; }
    .tm-error {
        color:#dc3545; background:#f8d7da; border-radius:4px; margin:10px;
    }
    `;

    // 注入樣式
    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = styles;
        document.head.appendChild(style);
    }

    // 建立側欄
    function createSidebar() {
        const sidebar = document.createElement('div');
        sidebar.id = 'tm-anime-sidebar';
        sidebar.innerHTML = `
            <button id="tm-sidebar-toggle">觀看紀錄</button>
            <button id="tm-close-btn">×</button>
            <div id="tm-sidebar-header">
                <h3 id="tm-sidebar-title">🎬 觀看紀錄</h3>
                <button id="tm-refresh-btn">🔄 刷新</button>
            </div>
            <div id="tm-sidebar-content">
                <div class="tm-loading">⏳ 載入中...</div>
            </div>
        `;
        document.body.appendChild(sidebar);
        bindEvents();
    }

    // 綁定按鈕事件
    function bindEvents() {
        const sidebar = document.getElementById('tm-anime-sidebar');
        const toggleBtn = document.getElementById('tm-sidebar-toggle');
        const closeBtn = document.getElementById('tm-close-btn');
        const refreshBtn = document.getElementById('tm-refresh-btn');

        toggleBtn.addEventListener('click', () => {
            sidebar.classList.toggle('tm-show');
            if (sidebar.classList.contains('tm-show')) loadHistory();
        });
        closeBtn.addEventListener('click', () => sidebar.classList.remove('tm-show'));
        refreshBtn.addEventListener('click', loadHistory);

        document.addEventListener('click', e => {
            if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
                sidebar.classList.remove('tm-show');
            }
        });
    }

    // 使用 GM_xmlhttpRequest 取得 HTML
    function fetchHistoryHtml() {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://ani.gamer.com.tw/viewList.php',
                headers: { 'Cache-Control': 'no-cache' },
                onload(res) {
                    if (res.status === 200) resolve(res.responseText);
                    else reject(new Error(`Status ${res.status}`));
                },
                onerror(err) { reject(err); }
            });
        });
    }

    // 解析 HTML
    function parseHistory(html) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const items = [];
        doc.querySelectorAll('.user-watch-list').forEach(el => {
            const titleEl = el.querySelector('.history-anime-title');
            const epEl = el.querySelector('.history-lastwatch .user-lastwatch');
            const progEl = el.querySelector('.history-lastwatch:last-child');
            const linkEl = el.querySelector('.click-area');
            if (!titleEl || !epEl || !linkEl) return;
            const title = titleEl.textContent.trim();
            const episode = epEl.textContent.trim();
            const progress = progEl ? progEl.textContent.replace('觀看至 ', '').trim() : '';
            const url = linkEl.href;
            const totalMatch = el.textContent.match(/｜\s*(\d+)/);
            const total = totalMatch ? totalMatch[1] : '未知';
            items.push({ title, episode, total, progress, url });
        });
        return items;
    }

    // 渲染列表
    function renderHistory(items) {
        const container = document.getElementById('tm-sidebar-content');
        if (!items.length) {
            container.innerHTML = `<div class="tm-no-data">📺 暫無觀看紀錄<br><small>播放動畫後自動顯示</small></div>`;
            return;
        }
        container.innerHTML = items.slice(0, 30).map(item => `
            <div class="tm-history-item" onclick="window.open('${item.url}','_blank')">
                <div class="tm-history-title">${item.title}</div>
                <div class="tm-history-meta">
                    <span class="tm-episode-info">第 ${item.episode} 集</span>
                    <span class="tm-progress-info">${item.progress||'未開始'}</span>
                </div>
                <div style="font-size:12px;color:#999;margin-bottom:8px;">總共 ${item.total} 集</div>
                <button class="tm-play-button" onclick="event.stopPropagation();window.open('${item.url}','_blank')">
                    ▶️ 繼續觀看
                </button>
            </div>
        `).join('');
    }

    // 載入紀錄
    async function loadHistory() {
        const content = document.getElementById('tm-sidebar-content');
        content.innerHTML = `<div class="tm-loading">🔄 正在獲取觀看紀錄...</div>`;
        try {
            const html = await fetchHistoryHtml();
            const items = parseHistory(html);
            GM_setValue('animeHistory', JSON.stringify(items));
            renderHistory(items);
        } catch (err) {
            console.error(err);
            const cache = JSON.parse(GM_getValue('animeHistory','[]'));
            if (cache.length) {
                renderHistory(cache);
                content.insertAdjacentHTML('afterbegin',
                    '<div class="tm-error">⚠️ 顯示快取資料，請刷新</div>'
                );
            } else {
                content.innerHTML = `<div class="tm-error">
                    ❌ 載入失敗<br><small>${err.message}</small><br>
                    <button onclick="loadHistory()" style="padding:6px 12px;background:#0084ff;color:#fff;border:none;border-radius:4px;cursor:pointer;">重試</button>
                </div>`;
            }
        }
    }

    // 初始化
    function init() {
        injectStyles();
        createSidebar();
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
