// ==UserScript==
// @name         中国知网CNKI硕博论文PDF下载
// @version      4.0.3
// @namespace    https://greasyfork.org/users/244539
// @icon         https://www.cnki.net/favicon.ico
// @description  知网文献、硕博论文PDF批量下载，下载硕博论文章节目录
// @author       @zoglmk
// @match        *://*.cnki.net/*
// @run-at       document-idle
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/389343/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91CNKI%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87PDF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/389343/%E4%B8%AD%E5%9B%BD%E7%9F%A5%E7%BD%91CNKI%E7%A1%95%E5%8D%9A%E8%AE%BA%E6%96%87PDF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

// 如果没有显示批量下载的按钮，大概率是因为你的知网地址没有匹配到。
// 解决办法：将你的域名按照上面的 @match 的格式，添加到后面，保存脚本，刷新网页，应该就可以了。（最后要加个*）
// 例：// @match https://webvpn.cueb.edu.cn/*

(function () {
    'use strict';

    let useWebVPN = GM_getValue('useWebVPN', false);
    let fetchLevels = GM_getValue('fetchLevels', true);
    const config = { "buttonText": "批量下载 PDF", "buttonColor": "#3b82f6", "buttonTextColor": "#ffffff", "showIcon": true, "position": "floating-bottom-right", "borderRadius": "9999px", "autoDownload": false };

    // Global Caches
    const journalLevelCache = new Map();
    const journalRequestCache = new Map();

    // Sort State
    let sortState = {
        field: null,
        direction: 'desc'
    };

    // --- INIT & CSS ---
    function init() {
        const style = document.createElement('style');
        style.textContent = `
    /* --- CNKI Beautified UI Styles --- */
    :root {
      --cnki-primary: #3b82f6;
      --cnki-text-on-primary: #ffffff;
      --cnki-radius: 20px;
      --cnki-primary-light: color-mix(in srgb, var(--cnki-primary), transparent 90%);
      --cnki-primary-border: color-mix(in srgb, var(--cnki-primary), transparent 80%);
    }

    .cnki-ui-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(2px);
        z-index: 2147483647; /* Max z-index */
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        opacity: 0;
        animation: cnkiFadeIn 0.2s forwards;
    }

    @keyframes cnkiFadeIn {
        to { opacity: 1; }
    }

    .cnki-ui-modal {
        background: white;
        width: 90vw; /* Responsive width */
        max-width: 1450px;
        height: 85vh;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transform: scale(0.95);
        animation: cnkiScaleIn 0.2s forwards;
    }

    @keyframes cnkiScaleIn {
        to { transform: scale(1); }
    }

    .cnki-ui-header {
        padding: 16px 24px;
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #ffffff;
    }

    .cnki-ui-title {
        font-size: 18px;
        font-weight: 600;
        color: #111827;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .cnki-version-tag {
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        background-color: #f3f4f6;
        color: #6b7280;
        border: 1px solid #e5e7eb;
        font-weight: normal;
        margin-left: 6px;
    }

    .cnki-ui-close {
        background: transparent;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 24px;
        line-height: 1;
        padding: 4px;
        border-radius: 4px;
        transition: color 0.2s;
    }
    .cnki-ui-close:hover { color: #374151; background: #f3f4f6; }

    .cnki-ui-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        background: #f9fafb;
    }

    .cnki-ui-toolbar {
        padding: 12px 24px;
        background: white;
        border-bottom: 1px solid #f3f4f6;
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        align-items: center;
    }

    .cnki-toolbar-tips {
        margin-left: auto;
        font-size: 12px;
        color: #b91c1c;
        background-color: #fef2f2;
        border: 1px solid #fecaca;
        padding: 8px 16px;
        border-radius: 6px;
        line-height: 1.6;
        text-align: left;
        max-width: 650px;
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    .cnki-ui-btn {
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        border: 1px solid transparent;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
        text-decoration: none;
    }

    .cnki-btn-primary {
        background-color: var(--cnki-primary);
        color: var(--cnki-text-on-primary);
        box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }
    .cnki-btn-primary:hover { filter: brightness(110%); transform: translateY(-1px); }

    .cnki-btn-secondary {
        background-color: white;
        border-color: #d1d5db;
        color: #374151;
    }
    .cnki-btn-secondary:hover { background-color: #f9fafb; border-color: #9ca3af; color: #111827; }

    .cnki-btn-danger {
        background-color: #fff1f2;
        color: #be123c;
        border-color: #fecdd3;
    }
    .cnki-btn-danger:hover { background-color: #ffe4e6; border-color: #fda4af; }

    .cnki-btn-sm {
        padding: 4px 10px;
        font-size: 12px;
        border: 1px solid var(--cnki-primary);
        color: var(--cnki-primary);
        background: #f0f7ff;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        min-width: 70px;
        text-align: center;
        display: inline-block;
    }
    .cnki-btn-sm:hover {
        background: var(--cnki-primary);
        color: #fff;
    }
    .cnki-btn-sm:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .cnki-btn-icon {
        padding: 2px;
        border-radius: 4px;
        color: #9ca3af;
        cursor: pointer;
        background: transparent;
        border: none;
        display: inline-flex;
        align-items: center;
        vertical-align: middle;
        margin-left: 6px;
        opacity: 0;
        transition: all 0.2s;
    }
    .cnki-title-wrapper:hover .cnki-btn-icon { opacity: 1; }
    .cnki-btn-icon:hover { color: var(--cnki-primary); background: #f3f4f6; }

    .cnki-table-container {
        flex: 1;
        overflow-y: auto;
        padding: 0;
        position: relative;
    }

    .cnki-data-table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;
        font-size: 14px; /* Comfort Size */
        table-layout: fixed;
    }

    .cnki-data-table th {
        text-align: left;
        padding: 10px 12px; /* Comfort Padding */
        background: #f9fafb;
        color: #6b7280;
        font-weight: 600;
        border-bottom: 1px solid #e5e7eb;
        position: sticky;
        top: 0;
        z-index: 10;
        text-transform: uppercase;
        font-size: 13px;
        letter-spacing: 0.05em;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .cnki-sortable {
        cursor: pointer;
        user-select: none;
        transition: background-color 0.2s;
    }
    .cnki-sortable:hover {
        background-color: #f3f4f6;
        color: var(--cnki-primary);
    }
    .cnki-sort-icon {
        display: inline-block;
        margin-left: 4px;
        font-size: 10px;
        width: 10px;
        color: #6b7280;
    }
    .cnki-sort-active .cnki-sort-icon {
        color: var(--cnki-primary);
    }

    /* Center Alignment */
    .cnki-col-center { text-align: center !important; vertical-align: middle !important; }

    .cnki-item-check {
        margin: 0 auto;
        display: block;
        width: 16px;
        height: 16px;
        cursor: pointer;
    }

    .cnki-data-table td {
        padding: 10px 12px; /* Comfort Padding */
        border-bottom: 1px solid #f3f4f6;
        color: #374151;
        vertical-align: middle;
        background: white;
        word-break: break-all;
    }

    .cnki-data-table tr:hover td { background-color: #f8fafc; }

    .cnki-title-wrapper {
        display: flex;
        align-items: center;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 4px;
        font-size: 14px;
    }

    .cnki-highlight {
        font-weight: bold;
        color: #e50012;
    }

    .cnki-author {
        font-size: 12px;
        color: #6b7280;
        line-height: 1.4;
        max-height: 2.8em;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    /* Standard Keyword Tags */
    .cnki-tag {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 99px;
        background: var(--cnki-primary-light);
        color: var(--cnki-primary);
        border: 1px solid var(--cnki-primary-border);
        font-size: 12px; /* Comfort Size */
        margin-right: 4px;
        margin-bottom: 4px;
        font-weight: 500;
        white-space: nowrap;
    }

    /* Distinct Level Tags (Red) */
    .cnki-level-tag {
        display: inline-block;
        padding: 2px 8px;
        border-radius: 4px;
        background: #fff1f2;
        color: #be123c;
        border: 1px solid #fecdd3;
        font-size: 12px; /* Comfort Size */
        margin-right: 4px;
        margin-bottom: 4px;
        white-space: nowrap;
        line-height: 1.2;
    }

    .cnki-level-loading { color: #9ca3af; font-size: 11px; }

    .cnki-meta-text {
        color: #6b7280;
        font-size: 12px;
    }

    .cnki-status-success { color: #16a34a; font-size: 12px; font-weight: 600; }
    .cnki-status-error { color: #dc2626; font-size: 12px; font-weight: 600; }
    .cnki-status-loading { color: #ea580c; font-size: 12px; font-weight: 600; }
    .cnki-status-pending { display: none; }

    .cnki-footer {
        padding: 12px 24px;
        background: white;
        border-top: 1px solid #e5e7eb;
        font-size: 13px;
        color: #6b7280;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 10px;
    }

    .cnki-footer a { color: var(--cnki-primary); text-decoration: none; cursor: pointer; }
    .cnki-footer a:hover { text-decoration: underline; }


    .cnki-debug-error {
        font-family: monospace;
        font-size: 11px;
        color: #dc2626;
        background-color: #fef2f2;
        border: 1px solid #fee2e2;
        padding: 4px 8px;
        border-radius: 4px;
        flex: 1;
        margin: 0 20px;
        word-break: break-all;
        white-space: pre-wrap;
        max-height: 42px;
        overflow-y: auto;
        line-height: 1.2;
    }

    /* QR Code Hover Styles */
    .cnki-qr-link {
        position: relative;
        display: inline-block;
        cursor: pointer;
        color: var(--cnki-primary);
    }
    /* Bridge to prevent hover loss */
    .cnki-qr-link::before {
        content: '';
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
        height: 20px;
    }
    .cnki-qr-box {
        display: none;
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: white;
        padding: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.15);
        border-radius: 8px;
        border: 1px solid #f3f4f6;
        z-index: 100;
        text-align: center;
        width: 130px;
        margin-bottom: 10px;
    }
    .cnki-qr-link:hover .cnki-qr-box {
        display: block;
    }
    .cnki-qr-box img {
        width: 110px;
        height: 110px;
        display: block;
        margin: 0 auto 5px auto;
        background: #f9fafb;
    }
    .cnki-qr-box div {
        font-size: 11px;
        color: #6b7280;
    }
    /* Arrow for QR Box */
    .cnki-qr-box::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -6px;
        border-width: 6px;
        border-style: solid;
        border-color: white transparent transparent transparent;
    }

    .cnki-main-btn {
        position: fixed;
        z-index: 9999;
        background-color: var(--cnki-primary) !important;
        color: var(--cnki-text-on-primary) !important;
        border: none;
        padding: 10px 20px;
        border-radius: var(--cnki-radius);
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .cnki-main-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
    }

    .cnki-hidden {
        display: none !important;
    }

    /* Positions */
    .cnki-pos-floating-bottom-right { bottom: 40px; right: 40px; }
    .cnki-pos-floating-top-right { top: 120px; right: 40px; }
    .cnki-pos-floating-center-right { top: 50%; right: 20px; transform: translateY(-50%); }
    .cnki-pos-inline-title { position: static; display: inline-flex; margin-left: 10px; padding: 6px 12px; font-size: 12px; }
    .cnki-pos-inline-toolbar { position: static; display: inline-flex; margin-left: 0; padding: 6px 12px; font-size: 12px; }

    /* Utilities */
    .cnki-loading-toast {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #374151;
        color: white;
        padding: 12px 30px;
        border-radius: 8px;
        font-size: 15px;
        font-weight: 500;
        z-index: 2147483648;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        text-align: center;
        animation: fadeIn 0.2s ease-out;
        border: 1px solid rgba(255,255,255,0.1);
    }
    @keyframes fadeIn { from { opacity: 0; transform: translate(-50%, -45%); } to { opacity: 1; transform: translate(-50%, -50%); } }
  `;
        document.head.appendChild(style);

        const url = window.location.href.toLowerCase();

        // Add main button to search pages
        if (url.includes('defaultresult') || url.includes('advsearch') || url.includes('search')) {
            createMainButton();
        }

        // Add chapter download to abstract pages
        if (url.includes('abstract') || url.includes('kns8s')) {
            addCategoryDownloadButton();
        }

        // Register Menu
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand("打开批量下载助手", () => {
                if (!localStorage.getItem('cnkiFirstTimePopupShown_v4_0_2')) {
                    showHelpModal();
                } else {
                    openDashboard();
                    loadSavedData();
                }
            });
        }

        // Keydown for Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeDashboard();
            }
        });
    }

    // --- HELPER: GM Fetch ---
    function gmFetch(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: (res) => resolve(res.responseText),
                onerror: (err) => reject(err)
            });
        });
    }

    // --- HELPER: Validate PDF file header ---
    async function validatePDF(blob) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
                const arr = new Uint8Array(reader.result);
                const header = String.fromCharCode(...arr.slice(0, 5));
                resolve(header === '%PDF-');
            };
            reader.onerror = () => resolve(false);
            reader.readAsArrayBuffer(blob.slice(0, 8));
        });
    }

    // --- HELPER: Create safe filename ---
    function createSafeFilename(filename, maxLength = 200) {
        let safeName = filename
            .replace(/[\/:*?"<>|\\]/g, '_')  // 替换非法字符
            .replace(/\s+/g, ' ')             // 多空格变单空格
            .trim();

        // 限制长度（为 .pdf 扩展名预留空间）
        if (safeName.length > maxLength) {
            safeName = safeName.substring(0, maxLength);
        }

        return safeName + '.pdf';
    }


    // --- HELPER: Journal Level Fetcher ---
    async function fetchJournalLevel(url) {
        if (!url) return '无';

        if (journalLevelCache.has(url)) return journalLevelCache.get(url);
        if (journalRequestCache.has(url)) return journalRequestCache.get(url);

        const promise = gmFetch(url).then(html => {
            if (!html) return '无';
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const spans = Array.from(doc.querySelectorAll('.journalType.journalType2 span'));
            const res = spans.map(s => s.textContent.trim()).filter(Boolean).join('/');
            return res || '无';
        }).catch((e) => {
            console.warn('Journal fetch failed', e);
            return '无';
        }).then(res => {
            journalLevelCache.set(url, res);
            journalRequestCache.delete(url);
            return res;
        });

        journalRequestCache.set(url, promise);
        return promise;
    }

    // --- HELPER: Keyword Highlighting ---
    function getSearchWords() {
        const input = document.getElementById('txt_search');
        if (input && input.value) {
            return input.value.trim().split(/\s+/).filter(Boolean);
        }
        return [];
    }

    function highlightText(text) {
        if (!text) return text;
        const words = getSearchWords();
        if (words.length === 0) return text;

        // Simple and robust string replacement logic
        let processedText = text;
        words.forEach(word => {
            // Escape special regex chars in keyword
            const escapedWord = word.replace(/[.*+?^$${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp('(' + escapedWord + ')', 'gi');
            processedText = processedText.replace(regex, '<span class="cnki-highlight">$1</span>');
        });
        return processedText;
    }

    // --- UI COMPONENTS ---
    function createMainButton() {
        if (document.getElementById('cnki-main-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'cnki-main-btn';
        btn.className = 'cnki-main-btn cnki-pos-' + config.position;
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> <span>${config.buttonText}</span>`;

        btn.onclick = () => {
            if (!localStorage.getItem('cnkiFirstTimePopupShown_v4_0_2')) {
                showHelpModal();
            } else {
                openDashboard();
                loadSavedData();
            }
        };

        // Handle inline injection
        if (config.position === 'inline-title') {
            const target = document.querySelector('.result-count');
            if (target) target.parentNode.insertBefore(btn, target.nextSibling);
            else document.body.appendChild(btn);
        } else {
            document.body.appendChild(btn);
        }
    }

    function createLoading(text, duration = 2000) {
        // remove existing
        const existing = document.getElementById('cnki-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'cnki-toast';
        toast.className = 'cnki-loading-toast';
        toast.innerHTML = text;
        document.body.appendChild(toast);

        if (duration > 0) {
            setTimeout(() => {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
            }, duration);
        }
        return toast;
    }

    // --- DASHBOARD LOGIC ---
    function openDashboard() {
        if (document.getElementById('cnki-modal-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'cnki-modal-overlay';
        overlay.className = 'cnki-ui-overlay';

        overlay.innerHTML = `
            <div class="cnki-ui-modal">
                <div class="cnki-ui-header">
                    <div class="cnki-ui-title">
                         <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> 批量下载助手 <span class="cnki-version-tag">v4.0</span>
                    </div>
                    <div id="cnki-debug-info" class="cnki-debug-error" style="display:none;"></div>
                    <button id="cnki-close-btn" class="cnki-ui-close" title="关闭 (Esc)">&times;</button>
                </div>

                <div class="cnki-ui-toolbar">
                    <button id="cnki-get-links" class="cnki-ui-btn cnki-btn-primary" title="获取当前页面的所有论文链接">获取本页链接</button>
                    <button id="cnki-batch-dl" class="cnki-ui-btn cnki-btn-primary" title="下载所有勾选的论文">批量下载</button>
                    <button id="cnki-clear" class="cnki-ui-btn cnki-btn-danger" title="清空所有已获取的数据">清空数据</button>
                    <button id="cnki-webvpn" class="cnki-ui-btn ${useWebVPN ? 'cnki-btn-primary' : 'cnki-btn-secondary'}" title="切换WebVPN模式">WebVPN: ${useWebVPN ? '开启' : '关闭'}</button>
                    <button id="cnki-level-toggle" class="cnki-ui-btn ${fetchLevels ? 'cnki-btn-primary' : 'cnki-btn-secondary'}" title="切换是否显示期刊等级">期刊等级: ${fetchLevels ? '开启' : '关闭'}</button>
                    <div class="cnki-toolbar-tips">
                        1、关闭窗口数据不会消失，如需获取新数据，先点击清除数据。<br/>
                        2、通过WebVPN远程登录的用户获取出错请尝试开启开关。<br/>
                        3、问题反馈请查看顶部报错信息截图到留言区或公众号私信。
                    </div>
                </div>

                <div class="cnki-ui-content">
                    <div class="cnki-table-container">
                        <table class="cnki-data-table">
                            <thead>
                                <tr>
                                    <th class="cnki-col-center" style="width: 40px"><input type="checkbox" id="cnki-select-all" class="cnki-item-check"></th>
                                    <th class="cnki-col-center" style="width: 50px">No.</th>
                                    <th>论文标题 / 作者</th>
                                    <th style="width: 110px">期刊</th>
                                    <th class="cnki-col-center ${fetchLevels ? '' : 'cnki-hidden'}" style="width: 90px" id="cnki-th-level">期刊等级</th>
                                    <th class="cnki-col-center cnki-sortable" style="width: 85px" data-sort="date">发表时间 <span class="cnki-sort-icon">▲▼</span></th>
                                    <th class="cnki-col-center cnki-sortable" style="width: 70px" data-sort="quote">被引 <span class="cnki-sort-icon">▲▼</span></th>
                                    <th class="cnki-col-center cnki-sortable" style="width: 70px" data-sort="download">下载 <span class="cnki-sort-icon">▲▼</span></th>
                                    <th class="cnki-col-center" style="width: 100px">状态</th>
                                    <th style="width: 170px">关键词</th>
                                </tr>
                            </thead>
                            <tbody id="cnki-table-body"></tbody>
                        </table>
                    </div>
                </div>

                <div class="cnki-footer">
                    <span id="cnki-status-text">暂无数据</span>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <span>欢迎关注：</span>
                        <div class="cnki-qr-link">
                             公众号: zgmgm
                             <div class="cnki-qr-box">
                                 <img src="data:image/jpeg;base64,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" />
                                 <div>扫码关注</div>
                             </div>
                        </div>
                        <span>|</span>
                        <a href="https://www.youtube.com/channel/UCC1ExQh99BVTaPbGbGTcUzg/" target="_blank">YouTube</a>
                        <span>&nbsp;</span>
                        <a href="https://space.bilibili.com/7241318" target="_blank">B站</a>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event Listeners
        document.getElementById('cnki-close-btn').onclick = closeDashboard;
        overlay.onclick = (e) => { if (e.target === overlay) closeDashboard(); };

        document.getElementById('cnki-get-links').onclick = getLinks;
        document.getElementById('cnki-batch-dl').onclick = downloadSelected;
        document.getElementById('cnki-clear').onclick = clearData;

        document.getElementById('cnki-select-all').onclick = (e) => {
            const checked = e.target.checked;
            document.querySelectorAll('.cnki-item-check:not(#cnki-select-all)').forEach(cb => {
                if (!cb.disabled) cb.checked = checked;
            });
            updateStatus();
        };

        document.getElementById('cnki-webvpn').onclick = function () {
            useWebVPN = !useWebVPN;
            GM_setValue('useWebVPN', useWebVPN);
            this.textContent = `WebVPN: ${useWebVPN ? '开启' : '关闭'}`;
            this.className = `cnki-ui-btn ${useWebVPN ? 'cnki-btn-primary' : 'cnki-btn-secondary'}`;
            createLoading(`WebVPN ${useWebVPN ? '已开启' : '已关闭'}`);
        };

        document.getElementById('cnki-level-toggle').onclick = function () {
            fetchLevels = !fetchLevels;
            GM_setValue('fetchLevels', fetchLevels);
            this.textContent = `期刊等级: ${fetchLevels ? '开启' : '关闭'}`;
            this.className = `cnki-ui-btn ${fetchLevels ? 'cnki-btn-primary' : 'cnki-btn-secondary'}`;
            const th = document.getElementById('cnki-th-level');
            const cells = document.querySelectorAll('.cnki-td-level');

            if (fetchLevels) {
                th.classList.remove('cnki-hidden');
                cells.forEach(c => c.classList.remove('cnki-hidden'));
                // Trigger auto-fetch if enabled and data exists
                triggerLevelLoad();
            } else {
                th.classList.add('cnki-hidden');
                cells.forEach(c => c.classList.add('cnki-hidden'));
            }
        };

        // Header Sort Listeners
        document.querySelectorAll('.cnki-sortable').forEach(th => {
            th.onclick = () => handleSort(th.dataset.sort);
        });
    }

    function closeDashboard() {
        const overlay = document.getElementById('cnki-modal-overlay');
        if (overlay) overlay.remove();
    }

    function showHelpModal() {
        if (document.getElementById('cnki-help-overlay')) return;
        const overlay = document.createElement('div');
        overlay.id = 'cnki-help-overlay';
        overlay.className = 'cnki-ui-overlay';
        overlay.innerHTML = `
           <div class="cnki-ui-modal" style="width: 600px; height: auto; max-height: 80vh;">
                <div class="cnki-ui-header">
                    <div class="cnki-ui-title">使用说明 v4.0</div>
                    <button id="cnki-help-close" class="cnki-ui-close">&times;</button>
                </div>
                <div class="cnki-ui-content" style="padding: 20px; overflow-y: auto;">
                    <ul style="list-style: none; padding: 0; line-height: 1.8; color: #374151;">
                        <li style="margin-bottom: 8px;"><b>首先请确保脚本为最新版本。</b></li>
                        <li style="margin-bottom: 8px;">1. 脚本只能获取当前页的文献，知网默认每页20篇，不建议一次下载更多。</li>
                        <li style="margin-bottom: 8px;">2. 如需清除已获取的数据 / 获取新数据，请先点击"<b>清除数据</b>"按钮。</li>
                        <li style="margin-bottom: 8px;">3. <b>如果只能下载一个，可能是浏览器拦截，允许弹出多窗口即可。</b></li>
                        <li style="margin-bottom: 8px;">4. 脚本只支持<b>新版知网</b>，不能在<b>隐私模式、无痕窗口</b>运行。</li>
                        <li style="margin-bottom: 8px;">5. 增加了批量下载延迟(2-5秒)，以防止IP被封。</li>
                        <li style="margin-bottom: 8px;">6. 不可用于超大批量下载，仅供个人学习使用。</li>
                    </ul>
                </div>
                <div class="cnki-footer" style="justify-content: flex-end;">
                     <button id="cnki-help-ok" class="cnki-ui-btn cnki-btn-primary">我知道了</button>
                </div>
           </div>
        `;
        document.body.appendChild(overlay);

        const close = () => {
            overlay.remove();
            localStorage.setItem('cnkiFirstTimePopupShown_v4_0_2', 'true');
            openDashboard();
            loadSavedData();
        };
        document.getElementById('cnki-help-close').onclick = close;
        document.getElementById('cnki-help-ok').onclick = close;
    }

    // --- DATA LOGIC ---
    function convertToWebVPNLink(originalLink) {
        if (!useWebVPN) return originalLink;
        const webVPNDomain = window.location.origin;
        const path = originalLink.replace(/^(https?:\/\/)?(www\.)?[^\/]+/, '');
        return `${webVPNDomain}${path}`;
    }

    async function getLinks() {
        const tbody = document.getElementById('cnki-table-body');
        if (tbody && tbody.children.length > 0) {
            createLoading('已有数据！请先清除数据。');
            return;
        }

        // 1. Scan List
        const rows = Array.from(document.querySelectorAll('.fz14'));
        if (rows.length === 0) {
            createLoading('未找到文献链接，请确保在搜索结果页。');
            return;
        }

        const toast = createLoading('正在获取链接...', 0);
        const results = [];

        // Batch Fetch Logic (Native Fetch for speed)
        const batchSize = 5;
        for (let i = 0; i < rows.length; i += batchSize) {
            const batch = rows.slice(i, i + batchSize);
            toast.textContent = `正在获取链接... (${Math.round((i / rows.length) * 100)}%)`;

            await Promise.all(batch.map(async (link, batchIdx) => {
                try {
                    const searchRow = link.closest('tr') || link.closest('.list-item'); // Adapt to different views
                    let date = '', quote = '', download = '', source = '', sourceUrl = '';

                    if (searchRow) {
                        date = searchRow.querySelector('.date')?.textContent?.trim() || '';
                        quote = searchRow.querySelector('.quote')?.textContent?.trim() || '0';
                        download = searchRow.querySelector('.download')?.textContent?.trim() || '0';
                        const sourceElem = searchRow.querySelector('.source a');
                        if (sourceElem) {
                            source = sourceElem.textContent.trim();
                            sourceUrl = sourceElem.href;
                        }
                    }

                    const res = await fetch(convertToWebVPNLink(link.href));
                    const html = await res.text();
                    const doc = new DOMParser().parseFromString(html, 'text/html');

                    // Clean spans in h1
                    const h1 = doc.querySelector('.wx-tit h1');
                    if (h1) h1.querySelectorAll('span').forEach(s => s.remove());

                    const title = h1?.textContent.trim() || '无标题';
                    const author = Array.from(doc.querySelectorAll('.author')).map(a => a.textContent.trim().replace(/;/g, '')).join('; ');
                    const keywords = Array.from(doc.querySelectorAll('.keywords a')).map(k => k.textContent.replace(/;/g, '').trim()).join(',');

                    // Find PDF Link
                    let pdfLink = '';
                    const operateBtn = doc.querySelector('.operate-btn');
                    if (operateBtn) {
                        // Try standard PDF download
                        const linkElem = Array.from(operateBtn.querySelectorAll('a')).find(a => a.textContent.includes('PDF下载') || a.textContent.includes('整本下载'));
                        if (linkElem) pdfLink = linkElem.href;
                    }

                    results.push({
                        id: i + batchIdx + 1,
                        title, author, pdfLink, keywords,
                        date, quote, download, source, sourceUrl,
                        level: 'Wait' // placeholder
                    });

                } catch (err) {
                    console.error('Row fetch error', err);
                }
            }));

            // Random delay to be safe
            await new Promise(r => setTimeout(r, 500));
        }

        // Render Table
        toast.remove();
        createLoading('获取完毕！', 1000);

        // Save & Render
        const finalData = results.sort((a, b) => a.id - b.id);
        localStorage.setItem('cnkiTableData', JSON.stringify(finalData));
        loadSavedData();

        // Auto select all
        document.getElementById('cnki-select-all').click();
    }

    // Lazy Load Journal Levels
    async function triggerLevelLoad() {
        if (!fetchLevels) return;

        const data = JSON.parse(localStorage.getItem('cnkiTableData') || '[]');
        if (data.length === 0) return;

        let changed = false;

        // Process sequentially to avoid overwhelming server with cross-origin requests
        for (const item of data) {
            if (item.sourceUrl && (!item.level || item.level === 'Wait' || item.level === 'Pending')) {
                // Update UI to loading
                const cell = document.getElementById(`level-cell-${item.id}`);
                if (cell && cell.textContent !== '...') {
                    cell.innerHTML = '<span class="cnki-level-loading">...</span>';
                }

                const level = await fetchJournalLevel(item.sourceUrl);
                item.level = level;
                changed = true;

                // Update UI immediately
                if (cell) {
                    cell.innerHTML = level === '无' ? '<span class="cnki-meta-text">-</span>' :
                        level.split('/').map(l => `<span class="cnki-level-tag">${l}</span>`).join('');
                }
            }
        }

        if (changed) {
            localStorage.setItem('cnkiTableData', JSON.stringify(data));
        }
    }

    function loadSavedData() {
        const saved = localStorage.getItem('cnkiTableData');
        const tbody = document.getElementById('cnki-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';
        if (!saved) {
            updateStatus();
            return;
        }

        let data = JSON.parse(saved);

        // Apply Sort
        if (sortState.field) {
            data.sort((a, b) => {
                let va = a[sortState.field];
                let vb = b[sortState.field];

                // Parse numbers
                if (sortState.field === 'quote' || sortState.field === 'download') {
                    va = parseInt(va) || 0;
                    vb = parseInt(vb) || 0;
                }

                if (va < vb) return sortState.direction === 'asc' ? -1 : 1;
                if (va > vb) return sortState.direction === 'asc' ? 1 : -1;
                return 0;
            });

            // Update Headers Icons
            document.querySelectorAll('.cnki-sortable').forEach(th => {
                th.classList.remove('cnki-sort-active');
                th.querySelector('.cnki-sort-icon').textContent = '▲▼';
                if (th.dataset.sort === sortState.field) {
                    th.classList.add('cnki-sort-active');
                    th.querySelector('.cnki-sort-icon').textContent = sortState.direction === 'asc' ? '▲' : '▼';
                }
            });
        }

        data.forEach((item, index) => addTableRow(item, tbody, index));
        updateStatus();

        // Trigger background level load
        if (fetchLevels) setTimeout(triggerLevelLoad, 100);
    }

    function handleSort(field) {
        if (sortState.field === field) {
            sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortState.field = field;
            sortState.direction = (field === 'date') ? 'asc' : 'desc'; // Date asc by default makes sense? actually desc usually. Let's stick to desc default for stats.
            if (field === 'date') sortState.direction = 'desc';
        }
        loadSavedData();
    }

    function addTableRow(item, tbody, index) {
        const tr = document.createElement('tr');

        // Title Highlight
        const safeTitle = highlightText(item.title);

        // Level Render
        let levelHtml = '<span class="cnki-meta-text">-</span>';
        if (item.level && item.level !== 'Wait' && item.level !== '无') {
            levelHtml = item.level.split('/').map(l => `<span class="cnki-level-tag">${l}</span>`).join('');
        } else if (item.level === 'Wait') {
            levelHtml = ''; // Will be loaded
        }

        // Keywords
        const tags = item.keywords ? item.keywords.split(',').slice(0, 3).map(k => `<span class="cnki-tag">${k}</span>`).join('') : '';

        // Single Download Button
        const dlBtnId = `btn-dl-${item.id}`;
        const statusId = `status-${item.id}`;
        const checkboxId = `cb-${item.id}`;

        tr.innerHTML = `
            <td class="cnki-col-center"><input type="checkbox" id="${checkboxId}" class="cnki-item-check" ${item.pdfLink ? '' : 'disabled'}></td>
            <td class="cnki-col-center" style="color:#9ca3af">${index + 1}</td>
            <td>
                <div class="cnki-title-wrapper">
                    <span title="${item.title}">${safeTitle}</span>
                    <button class="cnki-btn-icon" title="复制标题" onclick="navigator.clipboard.writeText('${item.title.replace(/'/g, "\\'")}')">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                    </button>
                </div>
                <div class="cnki-author" title="${item.author}">${item.author}</div>
            </td>
            <td style="font-size:12px">${item.source || '-'}</td>
            <td class="cnki-col-center cnki-td-level ${fetchLevels ? '' : 'cnki-hidden'}" id="level-cell-${item.id}">${levelHtml}</td>
            <td class="cnki-col-center cnki-meta-text">${item.date}</td>
            <td class="cnki-col-center cnki-meta-text">${item.quote}</td>
            <td class="cnki-col-center cnki-meta-text">${item.download}</td>
            <td class="cnki-col-center">
                 ${item.pdfLink ?
                `<button id="${dlBtnId}" class="cnki-btn-sm">PDF下载</button>` :
                '<span class="cnki-link-disabled">无链接</span>'}
                 <span id="${statusId}" class="cnki-status-pending" style="display:none"></span>
            </td>
            <td><div style="overflow:hidden; height:24px;">${tags}</div></td>
        `;

        tbody.appendChild(tr);

        // Attach Event Listeners
        const dlBtn = document.getElementById(dlBtnId);
        if (dlBtn) {
            dlBtn.onclick = () => downloadSingleFile(item.pdfLink, item.title, dlBtn, document.getElementById(statusId));
        }

        const cb = document.getElementById(checkboxId);
        if (cb) {
            cb.checked = true; // Auto select by default on render if needed, or based on state? Defaulting to true as per user flow.
            cb.onchange = updateStatus;
        }
    }

    // --- DOWNLOAD LOGIC (修复的核心部分 v4.0.2) ---
    function downloadSingleFile(url, filename, btn, statusSpan, retryCount = 0) {
        const MAX_RETRY = 3;
        const TIMEOUT_MS = 60000; // 60秒超时

        if (!url) return;

        if (retryCount === 0) {
            console.log(`[CNKI-Helper] 开始下载: ${filename}, URL: ${url}`);
            btn.style.display = 'none';
            statusSpan.style.display = 'flex';
            statusSpan.className = 'cnki-status-loading';
            statusSpan.textContent = '准备中...';
        } else {
            console.log(`[CNKI-Helper] 重试下载 (${retryCount}/${MAX_RETRY}): ${filename}, URL: ${url}`);
            statusSpan.textContent = `重试${retryCount}...`;
        }

        // 显示错误并恢复按钮的辅助函数
        function showError(message, detail = '') {
            console.error(`[CNKI-Helper] ${message}`, detail);
            statusSpan.className = 'cnki-status-error';
            statusSpan.textContent = message;
            statusSpan.title = detail || message; // 悬停显示详细信息
            btn.style.display = 'inline-block';
            btn.textContent = '重试';

            // 显示面板底部的调试信息（仅显示第一条）
            const debugEl = document.getElementById('cnki-debug-info');
            if (debugEl && debugEl.style.display === 'none') {
                const time = new Date().toLocaleTimeString();
                // 截断详情以防过长
                const shortDetail = detail.length > 300 ? detail.substring(0, 300) + '...' : detail;
                debugEl.textContent = `[${time}] ${message}: ${shortDetail}`;
                debugEl.style.display = 'block';
            }
        }

        // 从 HTML 中提取真实下载链接
        function extractRealLink(htmlText, baseUrl) {
            let realLink = null;

            // 使用 DOMParser 解析 HTML
            try {
                const doc = new DOMParser().parseFromString(htmlText, 'text/html');

                // 1. 查找特定的下载链接元素
                // 常见的知网下载按钮 ID 或类名
                const selectors = [
                    '#pdfDown',
                    '.btn-dl',
                    'a[href*="download.aspx"]',
                    'a[href*="pdfDown"]',
                    'a[href$=".pdf"]',
                    'a[href*="Download"]',
                    'a[href*="/bar/download/order"]' // 支持 bar.cnki.net 链接
                ];

                for (const selector of selectors) {
                    const el = doc.querySelector(selector);
                    if (el && el.href) {
                        realLink = el.href;
                        break;
                    }
                }
            } catch (e) {
                console.warn('[CNKI-Helper] DOMParser 解析失败', e);
            }

            // 2. 检测 meta refresh 跳转 (保留正则作为备选)
            if (!realLink) {
                const metaRefresh = htmlText.match(/<meta[^>]+http-equiv=["']refresh["'][^>]+content=["'][^"']*url=([^"']+)["']/i);
                if (metaRefresh) {
                    realLink = metaRefresh[1].replace(/&amp;/g, '&');
                }
            }

            // 3. 检测 JavaScript location 跳转
            if (!realLink) {
                const jsRedirect = htmlText.match(/(?:location\.href|location\.replace|location\s*=)\s*[=(]\s*['"]([^'"]+)['"]/i);
                if (jsRedirect) {
                    realLink = jsRedirect[1].replace(/&amp;/g, '&');
                }
            }

            // 4. 正则兜底匹配所有可能的 href
            if (!realLink) {
                const hrefMatch = htmlText.match(/href=['"]([^'"]+)['"]/gi);
                if (hrefMatch) {
                    for (let link of hrefMatch) {
                        let cleanLink = link.replace(/^href=['"]/, '').replace(/['"]$/, '').replace(/&amp;/g, '&');
                        if (cleanLink.includes('download.aspx') ||
                            cleanLink.includes('pdfDown') ||
                            cleanLink.toLowerCase().endsWith('.pdf') ||
                            cleanLink.includes('/bar/download/order')) { // 支持 bar.cnki.net 链接
                            realLink = cleanLink;
                            break;
                        }
                    }
                }
            }

            // 处理相对路径
            if (realLink && !realLink.startsWith('http')) {
                try {
                    const base = new URL(baseUrl);
                    if (realLink.startsWith('/')) {
                        realLink = base.origin + realLink;
                    } else {
                        realLink = new URL(realLink, baseUrl).href;
                    }
                } catch (e) {
                    console.warn('[CNKI-Helper] URL解析失败:', e);
                    realLink = null;
                }
            }

            return realLink;
        }

        // 检测是否为错误页面（验证码、登录等）
        // 大幅弱化检测逻辑，避免误报
        function detectErrorPage(htmlText) {
            const lowerHtml = htmlText.toLowerCase();

            // 只有当出现明确的“请输入验证码”且页面较短时才认为是验证码页面
            if (lowerHtml.includes('验证码') && (lowerHtml.includes('input') || lowerHtml.includes('form'))) {
                // 进一步检查是否真的有验证码输入框
                if (htmlText.includes('validateCode') || htmlText.includes('CheckCode')) {
                    return '需要验证码';
                }
            }

            // 登录页面检测：移除对 "login" 单词的简单检测，因为页面 header 通常都有
            // 检查标题或特定提示信息
            if (lowerHtml.includes('<title>用户登录</title>') || lowerHtml.includes('请先登录')) {
                return '需要登录';
            }

            if (lowerHtml.includes('访问过于频繁') || lowerHtml.includes('请求过快')) {
                return '访问频繁受限';
            }

            return null;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            timeout: TIMEOUT_MS,
            headers: {
                // 强制 Referer 为知网主域，避免因深层路径被拦截，符合 bar.cnki.net 的预期
                'Referer': 'https://kns.cnki.net/',
                'User-Agent': navigator.userAgent,
                // 移除显式 Cookie，完全依赖 anonymous: false 让 Tampermonkey 自动携带目标域(bar.cnki.net)的所有 Cookie
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7'
            },
            anonymous: false, // 允许携带 Cookie
            ontimeout: () => {
                if (retryCount < MAX_RETRY) {
                    console.log(`[CNKI-Helper] 请求超时，重试中...`);
                    downloadSingleFile(url, filename, btn, statusSpan, retryCount + 1);
                } else {
                    showError('下载超时', `原始URL: ${url}\n超时时间: ${TIMEOUT_MS / 1000}s`);
                }
            },
            onload: async (res) => {
                const blob = res.response;
                const contentType = (res.responseHeaders.match(/content-type:\s*([^\r\n;]+)/i)?.[1] || '').toLowerCase().trim();
                console.log(`[CNKI-Helper] 请求状态: ${res.status}, Type: ${contentType}, Size: ${blob?.size || 0}`);

                // 检查 HTTP 状态码
                if (res.status >= 400) {
                    if (retryCount < MAX_RETRY) {
                        downloadSingleFile(url, filename, btn, statusSpan, retryCount + 1);
                    } else {
                        showError(`HTTP ${res.status}`, `原始URL: ${url}\n状态码: ${res.status}\n响应头: ${res.responseHeaders}`);
                    }
                    return;
                }

                // --- 核心修复：检查是否返回了 HTML ---
                if (contentType.includes('text/html') || contentType.includes('text/plain')) {
                    const reader = new FileReader();
                    reader.onload = function () {
                        const htmlText = reader.result;

                        // 尝试提取真实下载链接
                        // 优先提取链接，因为有时页面虽然包含“登录”字样但其实也是跳转页
                        let realLink = extractRealLink(htmlText, url);

                        if (realLink && retryCount < MAX_RETRY) {
                            console.log(`[CNKI-Helper] 检测到跳转，尝试新链接: ${realLink}`);
                            downloadSingleFile(realLink, filename, btn, statusSpan, retryCount + 1);
                        } else {
                            // 如果找不到链接，再检测是否为错误页面
                            const errorType = detectErrorPage(htmlText);
                            if (errorType) {
                                showError(errorType, `检测到知网错误提示: ${errorType}\n\n原始HTML片段:\n${htmlText.substring(0, 500)}`);
                            } else {
                                // 如果既没链接也不是已知的错误页面，在日志里打印前500个字符帮忙调试
                                console.warn('[CNKI-Helper] 未知HTML响应:', htmlText.substring(0, 500));
                                showError('获取链接失败', `无法解析下载链接且未识别出错误页。\n\n原始URL: ${url}\n\n响应HTML前800字符:\n${htmlText.substring(0, 800)}`);
                            }
                        }
                    };
                    reader.onerror = () => showError('读取失败', '无法读取Blob响应内容');
                    reader.readAsText(blob);
                    return;
                }

                // 检查文件大小
                if (!blob || blob.size < 1000) {
                    if (retryCount < MAX_RETRY) {
                        console.log(`[CNKI-Helper] 文件过小 (${blob?.size || 0} bytes)，重试中...`);
                        downloadSingleFile(url, filename, btn, statusSpan, retryCount + 1);
                    } else {
                        showError('文件无效', `文件大小仅 ${blob?.size || 0} 字节，可能为空或损坏。\n原始URL: ${url}`);
                    }
                    return;
                }

                // --- 核心修复：验证 PDF 文件头 ---
                const isPDF = await validatePDF(blob);
                if (!isPDF) {
                    console.warn(`[CNKI-Helper] 文件头验证失败，不是有效的 PDF`);
                    if (retryCount < MAX_RETRY) {
                        downloadSingleFile(url, filename, btn, statusSpan, retryCount + 1);
                    } else {
                        showError('非PDF文件', `文件头验证失败，下载内容不是PDF。\nContentType: ${contentType}\n原始URL: ${url}`);
                    }
                    return;
                }

                // 保存文件
                const finalName = createSafeFilename(filename);
                const blobUrl = URL.createObjectURL(blob);

                console.log(`[CNKI-Helper] 开始保存文件: ${finalName}, 大小: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);

                GM_download({
                    url: blobUrl,
                    name: finalName,
                    saveAs: false,
                    onload: () => {
                        statusSpan.className = 'cnki-status-success';
                        statusSpan.textContent = '✔ 完成';
                        statusSpan.title = `已保存: ${finalName}`;
                        // 延迟释放 URL，确保文件完全写入
                        setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
                    },
                    onerror: (e) => {
                        console.error(`[CNKI-Helper] GM_download 保存失败`, e);
                        showError('保存失败', `GM_download 错误: ${JSON.stringify(e)}\n文件名: ${finalName}`);
                        URL.revokeObjectURL(blobUrl);
                    },
                    onprogress: (p) => {
                        if (p.total > 0) {
                            const pct = Math.round(p.loaded / p.total * 100);
                            statusSpan.textContent = `⬇ ${pct}%`;
                        } else {
                            statusSpan.textContent = `⬇ ${(p.loaded / 1024).toFixed(0)}KB`;
                        }
                    }
                });
            },
            onerror: (e) => {
                if (retryCount < MAX_RETRY) {
                    console.log(`[CNKI-Helper] 网络错误，重试中...`);
                    downloadSingleFile(url, filename, btn, statusSpan, retryCount + 1);
                } else {
                    showError('网络错误', `请求失败。\n原始URL: ${url}\n错误详情: ${JSON.stringify(e)}`);
                }
            }
        });
    }


    async function downloadSelected() {
        const checkboxes = document.querySelectorAll('.cnki-item-check:checked:not(#cnki-select-all)');
        if (checkboxes.length === 0) {
            createLoading('请选择要下载的项目！');
            return;
        }

        console.log(`[CNKI-Helper] 开始批量下载, 共选 ${checkboxes.length} 个项目`);

        const data = JSON.parse(localStorage.getItem('cnkiTableData'));

        for (const cb of checkboxes) {
            const row = cb.closest('tr');
            // Get original ID via hidden attribute or data attribute would be safer, but mapping via original sorted index in localstorage is risky if sorted.
            // Better to use the ID we stored in checkbox ID?
            const id = parseInt(cb.id.replace('cb-', ''));
            const item = data.find(d => d.id === id);

            if (item && item.pdfLink) {
                const btn = row.querySelector('.cnki-btn-sm');
                const status = row.querySelector('span[id^="status-"]');

                if (btn && btn.style.display !== 'none') {
                    console.log(`[CNKI-Helper] 正在处理: ${item.title} (ID: ${id})`);
                    downloadSingleFile(item.pdfLink, item.title, btn, status);
                    // Delay between starts
                    await new Promise(r => setTimeout(r, 2000 + Math.random() * 2000));
                }
            } else {
                console.warn(`[CNKI-Helper] 找不到项目数据或没有PDF链接. ID: ${id}`, item);
            }
        }
    }

    function clearData() {
        localStorage.removeItem('cnkiTableData');
        document.getElementById('cnki-table-body').innerHTML = '';

        // Hide debug info
        const debugEl = document.getElementById('cnki-debug-info');
        if (debugEl) {
            debugEl.style.display = 'none';
            debugEl.textContent = '';
        }

        updateStatus();
        createLoading('数据已清除');
    }

    function updateStatus() {
        const count = document.querySelectorAll('.cnki-item-check:checked:not(#cnki-select-all)').length;
        const total = document.querySelectorAll('#cnki-table-body tr').length;
        document.getElementById('cnki-status-text').textContent = `共 ${total} 条，已选 ${count} 条`;

        const btn = document.getElementById('cnki-batch-dl');
        if (btn) btn.textContent = `批量下载 (${count})`;
    }

    function addCategoryDownloadButton() {
        const otherBtns = document.querySelector('.other-btns');
        if (!otherBtns) return;

        // Check exist
        if (document.getElementById('diy-cat-dl')) return;

        const li = document.createElement('li');
        li.id = 'diy-cat-dl';
        li.className = 'btn-diy';
        li.style.cssText = 'width:auto;height:23px;line-height:22px;background-color:#3f8af0;border-radius:3px;margin-left:10px;display:inline-block;';

        const a = document.createElement('a');
        a.textContent = '目录下载';
        a.style.cssText = 'color:#ffffff;padding:0 10px;text-decoration:none;font-size:12px;cursor:pointer;display:block;';
        a.onclick = downloadCategory;

        li.appendChild(a);
        otherBtns.appendChild(li);
    }

    async function downloadCategory() {
        createLoading('正在获取目录...');
        // Logic for category download... (Simplified for brevity, same as original logic)
        const operateBtn = document.querySelector('.operate-btn');
        let hrefLink = '';
        if (operateBtn) {
            const link = Array.from(operateBtn.querySelectorAll('a')).find(a => a.innerText.includes('章节下载'));
            if (link) hrefLink = link.href;
        }

        if (!hrefLink) { createLoading('无法获取目录链接'); return; }

        try {
            const html = await gmFetch(hrefLink);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const title = doc.querySelector('.wx-tit h1')?.textContent.trim() || '目录';
            const chapters = Array.from(doc.querySelectorAll('.ls-chapters li'))
                .map(c => c.textContent.trim().split('-')[0].replace(/\n/g, '\t'))
                .join('\n');

            const blob = new Blob([chapters], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = title + '_目录.txt';
            a.click();
            URL.revokeObjectURL(url);
            createLoading('下载完成');
        } catch (e) {
            createLoading('下载目录失败');
        }
    }

    // Run
    window.addEventListener('load', init);
})();