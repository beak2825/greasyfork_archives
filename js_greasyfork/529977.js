// ==UserScript==
// @name         Enhanced Exhentai Record (Optimized)
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  增強型 Exhentai 記錄腳本，優化加載進度和閱讀體驗，支持後台加載
// @author       You
// @match        https://exhentai.org/watched*
// @icon         https://www.google.com/s2/favicons?domain=exhentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529977/Enhanced%20Exhentai%20Record%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529977/Enhanced%20Exhentai%20Record%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置選項
    const CONFIG = {
        autoHideRecorded: true,      // 自動隱藏已記錄項目
        loadDelay: 800,              // 加載下一頁的延遲（毫秒）
        toastDuration: 3000,         // Toast 顯示時間
        storageKey: 'exhentai_record',// 本地存儲鍵名
        continueInBackground: true   // 切換頁面時繼續加載
    };

    // DOM 元素引用
    let DOM = {
        progressBar: null,
        progressText: null,
        readingProgressBar: null,
        statusArea: null,
        totalCountElem: null,
        pageRecordedElem: null,
        pageUnrecordedElem: null,
        pageHiddenElem: null
    };

    // 統計數據
    const STATS = {
        totalProcessed: 0,
        totalAdded: 0,
        totalFiltered: 0,
        currentPage: 1,
        estimatedTotalPages: 0,
        readingProgress: 0
    };

    // 加載狀態
    const LOADING_STATE = {
        userPaused: false,     // 用戶手動暫停
        backgroundPaused: false, // 因切換到後台而暫停
        processing: false      // 正在處理
    };

    // SVG 圖標定義
    const ICONS = {
        record: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
        toggle: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
        download: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>',
        upload: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>',
        loadAll: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="8 17 12 21 16 17"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29"></path></svg>',
        info: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
        data: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>',
        check: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>',
        uncheck: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="9" x2="15" y2="15"></line><line x1="15" y1="9" x2="9" y2="15"></line></svg>',
        hidden: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>',
        stop: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>',
        pause: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>',
        play: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>'
    };

    // 樣式定義
    const STYLES = `
        /* 主控制面板 */
        .ex-record-toolbar {
            position: sticky;
            top: 0;
            margin: 0 auto;
            padding: 15px;
            background-color: #333;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            margin-bottom: 15px;
            border: 1px solid #444;
            max-width: 95%;
        }

        /* 按鈕樣式 */
        .ex-record-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin: 5px;
            padding: 8px 15px;
            background-color: #444;
            color: #eee;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
            border: none;
            font-weight: bold;
            font-size: 14px;
            min-width: 120px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .ex-record-btn svg {
            margin-right: 8px;
        }

        .ex-record-btn:hover {
            background-color: #555;
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }

        .ex-record-btn:active {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        /* 不同類型的按鈕顏色 */
        .ex-record-add {
            background-color: #1a73e8;
        }

        .ex-record-add:hover {
            background-color: #1967d2;
        }

        .ex-record-toggle {
            background-color: #34a853;
        }

        .ex-record-toggle:hover {
            background-color: #2d9247;
        }

        .ex-record-export {
            background-color: #ea4335;
        }

        .ex-record-export:hover {
            background-color: #d33426;
        }

        .ex-record-import {
            background-color: #fbbc05;
            color: #333;
        }

        .ex-record-import:hover {
            background-color: #f0b400;
        }

        .ex-record-stop {
            background-color: #ea4335;
        }

        .ex-record-stop:hover {
            background-color: #d33426;
        }

        /* 信息顯示 */
        .ex-record-info {
            display: inline-flex;
            align-items: center;
            padding: 8px 12px;
            margin: 5px;
            border-radius: 4px;
            background-color: #444;
            color: #eee;
            font-weight: bold;
            border: 1px solid #555;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        }

        .ex-record-info svg {
            margin-right: 8px;
            color: #aaa;
        }

        /* 標記已記錄項目 */
        .ex-record-highlighted {
            background-color: rgba(26, 115, 232, 0.15) !important;
            border-left: 4px solid #1a73e8 !important;
        }

        /* 記錄時間顯示 */
        .ex-record-time {
            font-size: 12px;
            color: #aaa;
            margin-left: 8px;
            display: inline-block;
            padding: 3px 6px;
            background-color: rgba(0, 0, 0, 0.2);
            border-radius: 3px;
        }

        /* Toast 消息 */
        .ex-record-toast {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            background-color: rgba(50, 50, 50, 0.9);
            color: #fff;
            border-radius: 4px;
            z-index: 10000;
            animation: ex-record-fadeInOut 3s ease-in-out forwards;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            border-left: 4px solid #1a73e8;
            max-width: 300px;
        }

        @keyframes ex-record-fadeInOut {
            0% { opacity: 0; transform: translateY(-20px); }
            10% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-20px); }
        }

        /* 模態對話框 */
        .ex-record-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10001;
        }

        .ex-record-modal-content {
            background-color: #333;
            padding: 20px;
            border-radius: 8px;
            width: 80%;
            max-width: 600px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5);
            color: #eee;
            border: 1px solid #444;
        }

        .ex-record-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            border-bottom: 1px solid #444;
            padding-bottom: 10px;
        }

        .ex-record-modal-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #aaa;
        }

        .ex-record-modal-close:hover {
            color: #fff;
        }

        .ex-record-modal-body {
            margin-bottom: 15px;
        }

        .ex-record-modal textarea {
            width: 100%;
            height: 200px;
            background-color: #222;
            color: #eee;
            border: 1px solid #444;
            padding: 10px;
            border-radius: 4px;
            resize: vertical;
            font-family: monospace;
        }

        .ex-record-modal-footer {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .ex-record-modal-btn {
            padding: 8px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            min-width: 80px;
        }

        .ex-record-modal-btn-primary {
            background-color: #1a73e8;
            color: white;
        }

        .ex-record-modal-btn-primary:hover {
            background-color: #1967d2;
        }

        .ex-record-modal-btn-secondary {
            background-color: #444;
            color: #eee;
        }

        .ex-record-modal-btn-secondary:hover {
            background-color: #555;
        }

        /* 控制面板內的區域 */
        .ex-record-toolbar {
            flex-direction: column;
            padding: 12px 15px;
        }

        .ex-record-controls-row {
            display: flex;
            width: 100%;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .ex-record-controls-row:last-child {
            margin-bottom: 0;
        }

        .ex-record-controls-left, .ex-record-controls-center, .ex-record-controls-right {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        .ex-record-controls-stats {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            justify-content: flex-start;
        }

        .ex-record-controls-center {
            flex-grow: 1;
            justify-content: center;
            margin: 0 10px;
        }

        .ex-record-controls-buttons {
            flex: 1;
            display: flex;
            justify-content: center;
        }

        .ex-record-controls-data {
            display: flex;
            justify-content: flex-end;
        }

        /* 進度條樣式 */
        .ex-record-progress-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 300px;
            background-color: #333;
            border-radius: 5px;
            padding: 12px;
            box-shadow: 0 3px 10px rgba(0,0,0,0.3);
            border: 1px solid #444;
            z-index: 1000;
            transition: opacity 0.3s ease;
        }

        .ex-record-progress-container.hidden {
            opacity: 0;
            pointer-events: none;
        }

        .ex-record-progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
        }

        .ex-record-progress-title {
            font-weight: bold;
            color: #eee;
        }

        .ex-record-progress-controls {
            display: flex;
            gap: 5px;
        }

        .ex-record-progress-btn {
            background: none;
            border: none;
            color: #aaa;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            transition: all 0.2s;
        }

        .ex-record-progress-btn:hover {
            background-color: #444;
            color: #fff;
        }

        .ex-record-progress {
            width: 100%;
            height: 6px;
            background-color: #444;
            border-radius: 3px;
            margin: 5px 0;
            overflow: hidden;
        }

        .ex-record-progress-bar {
            height: 100%;
            background-color: #1a73e8;
            width: 0%;
            transition: width 0.3s ease;
        }

        .ex-record-reading-progress {
            width: 100%;
            height: 6px;
            background-color: #444;
            border-radius: 3px;
            margin: 8px 0 5px 0;
            overflow: hidden;
        }

        .ex-record-reading-progress-bar {
            height: 100%;
            background-color: #34a853;
            width: 0%;
            transition: width 0.3s ease;
        }

        .ex-record-progress-stats {
            display: flex;
            justify-content: space-between;
            color: #aaa;
            font-size: 12px;
            margin-top: 5px;
        }

        .ex-record-progress-text {
            color: #eee;
            font-size: 13px;
            margin: 8px 0;
        }

        /* 數據管理下拉選單 */
        .ex-record-controls-right {
            position: relative;
        }

        .ex-record-data-buttons {
            position: absolute;
            right: 0;
            top: 100%;
            background-color: #333;
            border-radius: 4px;
            padding: 5px;
            display: none;
            flex-direction: column;
            z-index: 2000;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3);
            border: 1px solid #444;
            min-width: 120px;
        }

        .ex-record-controls-right:hover .ex-record-data-buttons {
            display: flex;
        }

        .ex-record-data-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #444;
            color: #eee;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.3s;
            font-weight: bold;
            font-size: 14px;
            border: none;
        }

        .ex-record-data-toggle svg {
            margin-right: 8px;
        }

        .ex-record-data-toggle:hover {
            background-color: #555;
        }
    `;

    // 工具函數
    const Utils = {
        // 從 localStorage 獲取記錄
        getRecords() {
            try {
                const recordStr = localStorage.getItem(CONFIG.storageKey);
                return recordStr ? JSON.parse(recordStr) : {};
            } catch (e) {
                console.error('解析記錄失敗:', e);
                return {};
            }
        },

        // 保存記錄到 localStorage
        saveRecords(records) {
            try {
                localStorage.setItem(CONFIG.storageKey, JSON.stringify(records));
                return true;
            } catch (e) {
                console.error('保存記錄失敗:', e);
                UI.showToast('保存記錄失敗: ' + e.message);
                return false;
            }
        },

        // 格式化時間
        formatDate(dateString) {
            try {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');

                return `${year}-${month}-${day} ${hours}:${minutes}`;
            } catch (e) {
                return '未知時間';
            }
        },

        // 獲取表格主體
        getTableBody() {
            const table = document.querySelector('.itg.glte');
            return table && table.tBodies.length > 0 ? table.tBodies[0] : null;
        },

        // 獲取頁面中的所有項目 ID
        getPageItems() {
            const tableBody = this.getTableBody();
            if (!tableBody) return [];

            return Array.from(tableBody.rows)
                .map(row => {
                    const link = row.querySelector('a');
                    if (!link) return null;
                    const url = link.href.split("/").filter(i => i !== '');
                    return url[url.length - 1] + url[url.length - 2];
                })
                .filter(id => id !== null);
        },

        // 從URL獲取項目ID
        getIdFromUrl(url) {
            const parts = url.split("/").filter(i => i !== '');
            return parts[parts.length - 1] + parts[parts.length - 2];
        },

        // 估算總頁數
        estimateTotalPages() {
            // 嘗試從分頁器中獲取頁數
            const pager = document.querySelector('.ptt');
            if (pager) {
                const lastPageLink = Array.from(pager.querySelectorAll('a')).pop();
                if (lastPageLink && lastPageLink.textContent) {
                    const pageNum = parseInt(lastPageLink.textContent);
                    if (!isNaN(pageNum)) {
                        return pageNum;
                    }
                }
            }
            // 如果無法從頁面獲取，返回預設值
            return 10;
        },

        // 獲取當前頁碼
        getCurrentPage() {
            const pager = document.querySelector('.ptt');
            if (pager) {
                const currentPageElement = pager.querySelector('td.ptds');
                if (currentPageElement && currentPageElement.textContent) {
                    const pageNum = parseInt(currentPageElement.textContent);
                    if (!isNaN(pageNum)) {
                        return pageNum;
                    }
                }
            }
            return 1;
        },

        // 動態調整閱讀進度
        updateReadingProgress() {
            // 計算閱讀進度百分比
            const tableBody = this.getTableBody();
            if (!tableBody) return 0;

            const totalItems = tableBody.rows.length;
            if (totalItems === 0) return 0;

            // 通過檢測可見區域來判斷閱讀進度
            const viewportHeight = window.innerHeight;
            const viewportTop = window.scrollY;
            const viewportBottom = viewportTop + viewportHeight;

            let visibleCount = 0;

            Array.from(tableBody.rows).forEach(row => {
                const rect = row.getBoundingClientRect();
                const rowTop = rect.top + viewportTop;
                const rowBottom = rect.bottom + viewportTop;

                // 行完全可見或部分可見
                if ((rowTop >= viewportTop && rowTop <= viewportBottom) ||
                    (rowBottom >= viewportTop && rowBottom <= viewportBottom) ||
                    (rowTop <= viewportTop && rowBottom >= viewportBottom)) {
                    visibleCount++;
                }
                // 已經滾動過的行
                else if (rowBottom < viewportTop) {
                    visibleCount++;
                }
            });

            const progress = Math.min(100, Math.round((visibleCount / totalItems) * 100));

            if (DOM.readingProgressBar) {
                DOM.readingProgressBar.style.width = `${progress}%`;
            }

            return progress;
        },

        // 延時執行函數
        debounce(func, wait) {
            let timeout;
            return function(...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        // 可靠的延時函數，即使在後台也能工作
        reliableDelay(ms) {
            return new Promise(resolve => {
                const startTime = Date.now();
                const checkTime = () => {
                    const elapsedTime = Date.now() - startTime;
                    if (elapsedTime >= ms) {
                        resolve();
                    } else {
                        setTimeout(checkTime, Math.min(100, ms - elapsedTime));
                    }
                };
                setTimeout(checkTime, Math.min(100, ms));
            });
        },

        // 記錄到控制台
        log(message) {
            console.log(`[ExRecord] ${message}`);
        }
    };

    // UI 操作相關
    const UI = {
        // 顯示 Toast 消息
        showToast(message, duration = CONFIG.toastDuration) {
            const toast = document.createElement('div');
            toast.className = 'ex-record-toast';
            toast.textContent = message;
            document.body.appendChild(toast);

            setTimeout(() => {
                if (toast.parentNode) {
                    document.body.removeChild(toast);
                }
            }, duration);
        },

        // 創建進度顯示容器
        createProgressContainer() {
            const container = document.createElement('div');
            container.className = 'ex-record-progress-container';
            container.id = 'ex-record-progress-container';
            container.innerHTML = `
                <div class="ex-record-progress-header">
                    <div class="ex-record-progress-title">加載進度</div>
                    <div class="ex-record-progress-controls">
                        <button class="ex-record-progress-btn" id="ex-record-pause-btn" title="暫停/繼續加載">
                            ${ICONS.pause}
                        </button>
                        <button class="ex-record-progress-btn" id="ex-record-stop-btn" title="停止加載">
                            ${ICONS.stop}
                        </button>
                    </div>
                </div>
                <div class="ex-record-progress-text" id="ex-record-progress-text">準備加載...</div>
                <div class="ex-record-progress">
                    <div class="ex-record-progress-bar" id="ex-record-progress-bar"></div>
                </div>
                <div class="ex-record-progress-stats">
                    <span id="ex-record-progress-page">頁面: 0/0</span>
                    <span id="ex-record-progress-items">已加載: 0</span>
                </div>
                <div class="ex-record-progress-text">閱讀進度</div>
                <div class="ex-record-reading-progress">
                    <div class="ex-record-reading-progress-bar" id="ex-record-reading-progress-bar"></div>
                </div>
                <div class="ex-record-progress-stats">
                    <span id="ex-record-reading-percent">0%</span>
                    <span id="ex-record-new-items">新項目: 0</span>
                </div>
            `;

            document.body.appendChild(container);

            // 獲取DOM引用
            DOM.progressBar = document.getElementById('ex-record-progress-bar');
            DOM.progressText = document.getElementById('ex-record-progress-text');
            DOM.readingProgressBar = document.getElementById('ex-record-reading-progress-bar');

            // 設置暫停/停止按鈕事件
            document.getElementById('ex-record-pause-btn').addEventListener('click', () => {
                this.toggleLoadingPause();
            });

            document.getElementById('ex-record-stop-btn').addEventListener('click', () => {
                this.stopLoading();
            });

            return container;
        },

        // 更新暫停按鈕圖標
        updatePauseButtonIcon(isPaused) {
            const pauseBtn = document.getElementById('ex-record-pause-btn');
            if (pauseBtn) {
                pauseBtn.innerHTML = isPaused ? ICONS.play : ICONS.pause;
                pauseBtn.title = isPaused ? "繼續加載" : "暫停加載";
            }
        },

        // 更新加載進度
        updateProgress(percent, currentPage, totalPages, loadedItems) {
            if (DOM.progressBar) {
                DOM.progressBar.style.width = `${percent}%`;
            }

            // 更新頁面計數
            const pageCountElement = document.getElementById('ex-record-progress-page');
            if (pageCountElement) {
                pageCountElement.textContent = `頁面: ${currentPage}/${totalPages || '?'}`;
            }

            // 更新已加載項目數
            const itemsCountElement = document.getElementById('ex-record-progress-items');
            if (itemsCountElement) {
                itemsCountElement.textContent = `已加載: ${loadedItems}`;
            }

            // 更新新項目數
            const newItemsElement = document.getElementById('ex-record-new-items');
            if (newItemsElement) {
                newItemsElement.textContent = `新項目: ${STATS.totalAdded}`;
            }

            // 更新閱讀百分比
            const readingPercentElement = document.getElementById('ex-record-reading-percent');
            if (readingPercentElement) {
                const readingPercent = Utils.updateReadingProgress();
                STATS.readingProgress = readingPercent;
                readingPercentElement.textContent = `${readingPercent}%`;
            }
        },

        // 更新加載狀態文本
        updateProgressText(text) {
            if (DOM.progressText) {
                DOM.progressText.textContent = text;
            }
        },

        // 顯示/隱藏進度容器
        toggleProgressContainer(show = true) {
            const container = document.getElementById('ex-record-progress-container');
            if (container) {
                container.className = show
                    ? 'ex-record-progress-container'
                    : 'ex-record-progress-container hidden';
            }
        },

        // 暫停/繼續加載
        toggleLoadingPause() {
            const loader = PageLoader;

            if (LOADING_STATE.userPaused) {
                // 如果是用戶暫停，則恢復
                LOADING_STATE.userPaused = false;
                this.updatePauseButtonIcon(false);

                if (!LOADING_STATE.backgroundPaused) {
                    // 如果不是因為背景暫停，則恢復加載
                    loader.processNextItem();
                    this.updateProgressText('繼續加載中...');
                    this.showToast('繼續加載');
                } else {
                    this.updateProgressText('頁面處於後台，將在返回前台時繼續加載');
                    this.showToast('已設置為繼續加載，將在返回前台時恢復');
                }
            } else {
                // 暫停加載
                LOADING_STATE.userPaused = true;
                this.updatePauseButtonIcon(true);
                this.updateProgressText('加載已暫停（用戶手動）');
                this.showToast('加載已暫停');
            }
        },

        // 停止加載
        stopLoading() {
            PageLoader.stopLoading();
            LOADING_STATE.userPaused = false;
            LOADING_STATE.backgroundPaused = false;
            this.updatePauseButtonIcon(false);
            this.updateProgressText('加載已停止');
            this.showToast('加載已停止');

            // 3秒後隱藏進度條
            setTimeout(() => {
                this.toggleProgressContainer(false);
            }, 3000);
        },

        // 創建控制面板
        createControlPanel() {
            const controlPanel = document.createElement('div');
            controlPanel.className = 'ex-record-toolbar';

            // 構建控制面板HTML - 分為上下兩行
            controlPanel.innerHTML = `
                <!-- 第一行：數據統計 -->
                <div class="ex-record-controls-row">
                    <div class="ex-record-controls-stats">
                        <div class="ex-record-info" id="ex-record-total-count">
                            ${ICONS.info}總記錄: 0 筆
                        </div>
                        <div class="ex-record-info" id="ex-record-page-recorded">
                            ${ICONS.check}本頁已記錄: 0 筆
                        </div>
                        <div class="ex-record-info" id="ex-record-page-unrecorded">
                            ${ICONS.uncheck}本頁未記錄: 0 筆
                        </div>
                        <div class="ex-record-info" id="ex-record-page-hidden">
                            ${ICONS.hidden}本頁隱藏: 0 筆
                        </div>
                    </div>
                </div>

                <!-- 第二行：操作按鈕 -->
                <div class="ex-record-controls-row">
                    <!-- 中間按鈕區域 -->
                    <div class="ex-record-controls-buttons">
                        <button class="ex-record-btn ex-record-add" id="ex-record-add-btn">
                            ${ICONS.record}記錄此頁
                        </button>
                        <button class="ex-record-btn ex-record-toggle" id="ex-record-toggle-btn">
                            ${ICONS.toggle}隱藏/顯示
                        </button>
                        <button class="ex-record-btn ex-record-add" id="ex-record-load-all-btn">
                            ${ICONS.loadAll}加載所有頁面
                        </button>
                    </div>

                    <!-- 右側數據管理按鈕 -->
                    <div class="ex-record-controls-data">
                        <div class="ex-record-controls-right">
                            <button class="ex-record-data-toggle" id="ex-record-data-toggle">
                                ${ICONS.data}數據管理
                            </button>
                            <div class="ex-record-data-buttons">
                                <button class="ex-record-btn ex-record-export" id="ex-record-export-btn">
                                    ${ICONS.download}匯出記錄
                                </button>
                                <button class="ex-record-btn ex-record-import" id="ex-record-import-btn">
                                    ${ICONS.upload}匯入記錄
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // 插入到頁面中
            const target = document.querySelector('.searchnav');
            if (target && target.parentNode) {
                target.parentNode.insertBefore(controlPanel, target);
            } else {
                const searchtext = document.querySelector('.searchtext');
                if (searchtext && searchtext.parentNode) {
                    searchtext.parentNode.insertBefore(controlPanel, searchtext.nextSibling);
                } else {
                    document.body.insertBefore(controlPanel, document.body.firstChild);
                }
            }

            // 保存DOM引用
            DOM.totalCountElem = document.getElementById('ex-record-total-count');
            DOM.pageRecordedElem = document.getElementById('ex-record-page-recorded');
            DOM.pageUnrecordedElem = document.getElementById('ex-record-page-unrecorded');
            DOM.pageHiddenElem = document.getElementById('ex-record-page-hidden');

            // 綁定按鈕事件
            document.getElementById('ex-record-add-btn').addEventListener('click', () => Record.recordCurrentPage());
            document.getElementById('ex-record-toggle-btn').addEventListener('click', () => Record.toggleRecordedItems());
            document.getElementById('ex-record-load-all-btn').addEventListener('click', () => PageLoader.loadAllPages());
            document.getElementById('ex-record-export-btn').addEventListener('click', () => DataManager.exportRecords());
            document.getElementById('ex-record-import-btn').addEventListener('click', () => DataManager.importRecords());

            return controlPanel;
        },

        // 更新統計信息顯示
        updateStatsDisplay() {
            const records = Utils.getRecords();
            const recordsCount = Object.keys(records).length;

            // 更新記錄總數
            if (DOM.totalCountElem) {
                DOM.totalCountElem.innerHTML = `${ICONS.info}總記錄: ${recordsCount} 筆`;
            }

            // 計算並更新當前頁面統計
            const pageItems = Utils.getPageItems();
            const pageRecorded = pageItems.filter(id => records[id]).length;
            const pageUnrecorded = pageItems.length - pageRecorded;

            if (DOM.pageRecordedElem) {
                DOM.pageRecordedElem.innerHTML = `${ICONS.check}本頁已記錄: ${pageRecorded} 筆`;
            }

            if (DOM.pageUnrecordedElem) {
                DOM.pageUnrecordedElem.innerHTML = `${ICONS.uncheck}本頁未記錄: ${pageUnrecorded} 筆`;
            }

            // 統計隱藏數量
            let hiddenCount = 0;
            const tableBody = Utils.getTableBody();
            if (tableBody) {
                Array.from(tableBody.rows).forEach(row => {
                    if (row.style.display === "none") {
                        hiddenCount++;
                    }
                });
            }

            if (DOM.pageHiddenElem) {
                DOM.pageHiddenElem.innerHTML = `${ICONS.hidden}本頁隱藏: ${hiddenCount} 筆`;
            }
        },

        // 添加樣式到頁面
        addStyles() {
            const styleElement = document.createElement('style');
            styleElement.textContent = STYLES;
            document.head.appendChild(styleElement);
        },

        // 創建模態對話框
        createModal(title, content, buttons) {
            const modal = document.createElement('div');
            modal.className = 'ex-record-modal';
            modal.innerHTML = `
                <div class="ex-record-modal-content">
                    <div class="ex-record-modal-header">
                        <h3>${title}</h3>
                        <button class="ex-record-modal-close">&times;</button>
                    </div>
                    <div class="ex-record-modal-body">
                        ${content}
                    </div>
                    <div class="ex-record-modal-footer">
                        ${buttons.map(btn => `
                            <button class="ex-record-modal-btn ${btn.primary ? 'ex-record-modal-btn-primary' : 'ex-record-modal-btn-secondary'}"
                                id="${btn.id}">${btn.text}</button>
                        `).join('')}
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // 綁定關閉按鈕
            const closeBtn = modal.querySelector('.ex-record-modal-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => document.body.removeChild(modal));
            }

            // 返回modal以供後續處理
            return modal;
        }
    };

    // 記錄操作相關
    const Record = {
        // 標記已記錄的項目
        highlightRecorded() {
            const tableBody = Utils.getTableBody();
            if (!tableBody) return;

            const records = Utils.getRecords();

            Array.from(tableBody.rows).forEach(row => {
                const link = row.querySelector('a');
                if (!link) return;

                const url = link.href.split("/").filter(i => i !== '');
                const id = url[url.length - 1] + url[url.length - 2];

                if (records[id]) {
                    row.classList.add('ex-record-highlighted');

                    // 添加記錄時間
                    const titleElement = row.querySelector('.gl4e');
                    if (titleElement && !titleElement.querySelector('.ex-record-time')) {
                        const timeSpan = document.createElement('span');
                        timeSpan.className = 'ex-record-time';
                        // 兼容新舊記錄格式
                        const timestamp = records[id].timestamp || records[id].t || '';
                        timeSpan.textContent = timestamp ? `記錄於: ${Utils.formatDate(timestamp)}` : '已記錄';
                        titleElement.appendChild(timeSpan);
                    }
                } else {
                    row.classList.remove('ex-record-highlighted');

                    // 移除記錄時間
                    const timeSpan = row.querySelector('.ex-record-time');
                    if (timeSpan && timeSpan.parentNode) {
                        timeSpan.parentNode.removeChild(timeSpan);
                    }
                }
            });
        },

        // 切換顯示/隱藏已記錄的項目
        toggleRecordedItems() {
            const tableBody = Utils.getTableBody();
            if (!tableBody) return;

            const records = Utils.getRecords();
            let hiddenCount = 0;
            let shownCount = 0;

            Array.from(tableBody.rows).forEach(row => {
                const link = row.querySelector('a');
                if (!link) return;

                const url = link.href.split("/").filter(i => i !== '');
                const id = url[url.length - 1] + url[url.length - 2];

                if (records[id]) {
                    if (row.style.display === "none") {
                        row.style.display = "table-row";
                        shownCount++;
                    } else {
                        row.style.display = "none";
                        hiddenCount++;
                    }
                }
            });

            if (hiddenCount > 0) {
                UI.showToast(`已隱藏 ${hiddenCount} 筆已記錄的內容`);
            } else if (shownCount > 0) {
                UI.showToast(`已顯示 ${shownCount} 筆已記錄的內容`);
            } else {
                UI.showToast('本頁沒有已記錄的內容');
            }

            UI.updateStatsDisplay();
        },

        // 隱藏已記錄的項目
        hideRecordedItems() {
            const tableBody = Utils.getTableBody();
            if (!tableBody) return 0;

            const records = Utils.getRecords();
            let hiddenCount = 0;

            Array.from(tableBody.rows).forEach(row => {
                const link = row.querySelector('a');
                if (!link) return;

                const url = link.href.split("/").filter(i => i !== '');
                const id = url[url.length - 1] + url[url.length - 2];

                if (records[id]) {
                    row.style.display = "none";
                    hiddenCount++;
                }
            });

            UI.updateStatsDisplay();
            return hiddenCount;
        },

        // 記錄當前頁面的所有項目
        recordCurrentPage() {
            const tableBody = Utils.getTableBody();
            if (!tableBody) return;

            const records = Utils.getRecords();
            const now = new Date().toISOString();
            let newCount = 0;

            Array.from(tableBody.rows).forEach(row => {
                if (row.style.display === "none") return; // 跳過已隱藏的行

                const link = row.querySelector('a');
                if (!link) return;

                const url = link.href.split("/").filter(i => i !== '');
                const id = url[url.length - 1] + url[url.length - 2];

                if (!records[id]) {
                    // 使用簡化的數據結構以節省空間
                    records[id] = { t: now };
                    newCount++;
                }
            });

            if (newCount > 0) {
                if (Utils.saveRecords(records)) {
                    this.highlightRecorded();
                    UI.updateStatsDisplay();
                    UI.showToast(`已記錄 ${newCount} 筆新內容`);
                } else {
                    UI.showToast('記錄失敗：可能超出存儲限制');
                }
            } else {
                UI.showToast('沒有新內容可記錄');
            }
        }
    };

    // 頁面加載器
    const PageLoader = {
        loadQueue: [], // 加載隊列
        isLoading: false, // 是否正在加載
        isStopped: false, // 是否已停止

        // 初始化加載器
        init() {
            STATS.currentPage = Utils.getCurrentPage();
            STATS.estimatedTotalPages = Utils.estimateTotalPages();

            // 設置頁面可見性變化監聽
            this.setupVisibilityHandler();
        },

        // 監聽頁面可見性變化
        setupVisibilityHandler() {
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'hidden') {
                    // 頁面進入後台
                    Utils.log('頁面進入後台');
                    if (!CONFIG.continueInBackground && !LOADING_STATE.userPaused && this.isLoading) {
                        // 如果不允許在後台加載且沒有用戶手動暫停，則暫停加載
                        LOADING_STATE.backgroundPaused = true;
                        UI.updateProgressText('頁面處於後台，加載已暫停');
                        Utils.log('自動暫停加載');
                    }
                } else if (document.visibilityState === 'visible') {
                    // 頁面回到前台
                    Utils.log('頁面回到前台');
                    if (LOADING_STATE.backgroundPaused && !LOADING_STATE.userPaused) {
                        // 如果因為後台而暫停且沒有用戶手動暫停，則恢復加載
                        LOADING_STATE.backgroundPaused = false;
                        UI.updateProgressText('頁面回到前台，繼續加載...');
                        Utils.log('自動恢復加載');
                        this.processNextItem();
                    }
                }
            });
        },

        // 加載所有頁面
        loadAllPages() {
            if (this.isLoading) {
                UI.showToast('正在加載中，請等待...');
                return;
            }

            // 初始化進度顯示
            UI.toggleProgressContainer(true);
            UI.updateProgressText('準備加載所有頁面...');
            UI.updatePauseButtonIcon(false);

            this.isLoading = true;
            this.isStopped = false;
            this.loadQueue = [];

            // 重設加載狀態
            LOADING_STATE.userPaused = false;
            LOADING_STATE.backgroundPaused = false;
            LOADING_STATE.processing = false;

            // 重設統計
            STATS.totalProcessed = 0;
            STATS.totalAdded = 0;
            STATS.totalFiltered = 0;

            // 查找下一頁鏈接
            const nextPageLink = document.querySelector('#unext');
            if (!nextPageLink || nextPageLink.href === "javascript:void(0)") {
                UI.updateProgressText('已經是最後一頁');
                UI.showToast('已經是最後一頁');
                this.isLoading = false;

                // 3秒後隱藏進度條
                setTimeout(() => {
                    UI.toggleProgressContainer(false);
                }, 3000);

                return;
            }

            // 添加第一個頁面到隊列
            this.addPageToQueue(nextPageLink.href, true);

            // 開始處理隊列
            this.processNextItem();
        },

        // 添加頁面到隊列
        addPageToQueue(pageUrl, recursive = false) {
            this.loadQueue.push({
                type: 'page',
                url: pageUrl,
                recursive: recursive
            });
            Utils.log(`頁面已添加到隊列: ${pageUrl}`);
        },

        // 添加行項目到隊列
        addRowsToQueue(params) {
            this.loadQueue.push({
                type: 'rows',
                ...params
            });
            Utils.log(`${params.rows.length} 行已添加到隊列`);
        },

        // 處理隊列中的下一個項目
        async processNextItem() {
            // 如果已停止或沒有正在加載，則退出
            if (this.isStopped || !this.isLoading) {
                return;
            }

            // 如果用戶暫停或後台暫停，則退出
            if (LOADING_STATE.userPaused || (LOADING_STATE.backgroundPaused && !CONFIG.continueInBackground)) {
                return;
            }

            // 如果正在處理項目，則退出
            if (LOADING_STATE.processing) {
                return;
            }

            // 如果隊列為空，則完成加載
            if (this.loadQueue.length === 0) {
                this.completeLoading();
                return;
            }

            // 獲取隊列中的下一個項目
            const nextItem = this.loadQueue.shift();

            // 設置處理標記
            LOADING_STATE.processing = true;

            try {
                if (nextItem.type === 'page') {
                    // 處理頁面項目
                    await this.processPageItem(nextItem);
                } else if (nextItem.type === 'rows') {
                    // 處理行項目
                    await this.processRowsItem(nextItem);
                }
            } catch (error) {
                console.error('處理項目失敗:', error);
                UI.updateProgressText(`處理失敗: ${error.message}`);
                UI.showToast(`處理失敗: ${error.message}`);
                // 發生錯誤時仍然繼續處理其他項目
                LOADING_STATE.processing = false;
                this.processNextItem();
            }
        },

        // 處理頁面項目
        async processPageItem(item) {
            const { url, recursive } = item;

            STATS.currentPage++;
            UI.updateProgressText(`正在加載第 ${STATS.currentPage} 頁...`);

            try {
                // 獲取頁面內容
                const response = await fetch(url);
                const html = await response.text();

                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 獲取下一頁的表格
                const nextPageTableBody = doc.querySelector('.itg.glte tbody');
                if (!nextPageTableBody) {
                    throw new Error('無法解析頁面內容');
                }

                // 獲取下一頁中的行
                const nextPageRows = Array.from(nextPageTableBody.rows);

                // 獲取當前表格
                const tableBody = Utils.getTableBody();
                if (!tableBody) {
                    throw new Error('無法找到當前頁面的表格');
                }

                // 添加行項目到隊列
                this.addRowsToQueue({
                    rows: nextPageRows,
                    tableBody: tableBody,
                    totalToProcess: nextPageRows.length,
                    processed: 0,
                    filtered: 0
                });

                // 檢查是否有下一頁
                const nextPageUrl = this.getNextPageUrlFromDoc(doc);
                if (nextPageUrl && recursive) {
                    this.addPageToQueue(nextPageUrl, true);
                }

                // 處理完成
                LOADING_STATE.processing = false;
                this.processNextItem();
            } catch (error) {
                LOADING_STATE.processing = false;
                throw error;
            }
        },

        // 處理行項目
        async processRowsItem(item) {
            const { rows, tableBody, totalToProcess } = item;
            const records = Utils.getRecords();

            let addedCount = item.processed || 0;
            let filteredCount = item.filtered || 0;

            try {
                // 處理每一行
                for (let i = 0; i < rows.length; i++) {
                    // 檢查是否已停止
                    if (this.isStopped) {
                        LOADING_STATE.processing = false;
                        this.isLoading = false;
                        return;
                    }

                    // 檢查是否暫停
                    if (LOADING_STATE.userPaused || (LOADING_STATE.backgroundPaused && !CONFIG.continueInBackground)) {
                        // 如果暫停，則將剩餘行重新加入隊列
                        const remainingRows = rows.slice(i);
                        this.loadQueue.unshift({
                            type: 'rows',
                            rows: remainingRows,
                            tableBody: tableBody,
                            totalToProcess: totalToProcess,
                            processed: addedCount,
                            filtered: filteredCount
                        });
                        LOADING_STATE.processing = false;
                        return;
                    }

                    const row = rows[i];

                    // 解析 ID
                    const link = row.querySelector('a');
                    if (!link) continue;

                    const id = Utils.getIdFromUrl(link.href);

                    // 檢查是否已記錄
                    const isAlreadyRecorded = records[id];

                    // 複製行並添加到表格
                    const clonedRow = row.cloneNode(true);
                    tableBody.appendChild(clonedRow);
                    addedCount++;
                    STATS.totalProcessed++;
                    STATS.totalAdded++;

                    // 如果是已記錄項目，設置高亮並可能隱藏
                    if (isAlreadyRecorded) {
                        clonedRow.classList.add('ex-record-highlighted');

                        // 添加記錄時間
                        const titleElement = clonedRow.querySelector('.gl4e');
                        if (titleElement && !titleElement.querySelector('.ex-record-time')) {
                            const timeSpan = document.createElement('span');
                            timeSpan.className = 'ex-record-time';
                            const timestamp = records[id].timestamp || records[id].t || '';
                            timeSpan.textContent = timestamp ? `記錄於: ${Utils.formatDate(timestamp)}` : '已記錄';
                            titleElement.appendChild(timeSpan);
                        }

                        // 根據當前狀態決定是否隱藏
                        if (CONFIG.autoHideRecorded) {
                            clonedRow.style.display = 'none';
                            filteredCount++;
                            STATS.totalFiltered++;
                        }
                    }

                    // 更新進度顯示
                    const percent = Math.round((i + 1) / totalToProcess * 100);
                    UI.updateProgress(
                        percent,
                        STATS.currentPage,
                        STATS.estimatedTotalPages,
                        STATS.totalProcessed
                    );

                    // 更新統計顯示
                    UI.updateStatsDisplay();

                    // 適當延遲以避免頁面凍結
                    if (i < rows.length - 1 && i % 10 === 0) {
                        await Utils.reliableDelay(10);
                    }
                }

                // 更新進度文本
                UI.updateProgressText(`第 ${STATS.currentPage} 頁完成，已加載 ${addedCount} 項`);

                // 添加延遲以避免請求過快
                await Utils.reliableDelay(CONFIG.loadDelay);

                // 處理完成
                LOADING_STATE.processing = false;
                this.processNextItem();
            } catch (error) {
                LOADING_STATE.processing = false;
                throw error;
            }
        },

        // 完成加載
        completeLoading() {
            this.isLoading = false;
            UI.updateProgressText(`加載完成，共處理 ${STATS.totalProcessed} 項，新增 ${STATS.totalAdded} 項`);
            UI.showToast(`加載完成，共處理 ${STATS.totalProcessed} 項，新增 ${STATS.totalAdded} 項`);

            // 3秒後隱藏進度條
            setTimeout(() => {
                UI.toggleProgressContainer(false);
            }, 3000);
        },

        // 從文檔中獲取下一頁URL
        getNextPageUrlFromDoc(doc) {
            const nextPageLink = doc.querySelector('#unext');
            if (nextPageLink && nextPageLink.href && nextPageLink.href !== "javascript:void(0)") {
                return nextPageLink.href;
            }
            return null;
        },

        // 停止加載
        stopLoading() {
            this.isStopped = true;
            this.isLoading = false;
            this.loadQueue = [];
            LOADING_STATE.processing = false;
            LOADING_STATE.userPaused = false;
            LOADING_STATE.backgroundPaused = false;
        }
    };

    // 數據管理
    const DataManager = {
        // 匯出記錄
        exportRecords() {
            const records = Utils.getRecords();
            const exportData = JSON.stringify(records, null, 2);

            const modalContent = `
                <p>以下是您的記錄資料，請複製並保存：</p>
                <textarea readonly>${exportData}</textarea>
            `;

            const buttons = [
                { id: 'ex-record-copy-btn', text: '複製', primary: true },
                { id: 'ex-record-modal-close-btn', text: '關閉', primary: false }
            ];

            const modal = UI.createModal('匯出記錄', modalContent, buttons);

            document.getElementById('ex-record-copy-btn').addEventListener('click', () => {
                const textarea = modal.querySelector('textarea');
                if (textarea) {
                    textarea.select();
                    document.execCommand('copy');
                    UI.showToast('已複製到剪貼簿');
                }
            });

            document.getElementById('ex-record-modal-close-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        },

        // 匯入記錄
        importRecords() {
            const modalContent = `
                <p>請貼上之前匯出的記錄資料：</p>
                <textarea placeholder="在這裡貼上 JSON 格式的記錄資料..."></textarea>
            `;

            const buttons = [
                { id: 'ex-record-import-btn', text: '匯入', primary: true },
                { id: 'ex-record-modal-close-btn', text: '取消', primary: false }
            ];

            const modal = UI.createModal('匯入記錄', modalContent, buttons);

            document.getElementById('ex-record-import-btn').addEventListener('click', () => {
                const textarea = modal.querySelector('textarea');
                if (!textarea) return;

                try {
                    const importData = JSON.parse(textarea.value);
                    const currentRecords = Utils.getRecords();

                    // 合併記錄
                    const mergedRecords = { ...currentRecords, ...importData };

                    if (Utils.saveRecords(mergedRecords)) {
                        Record.highlightRecorded();
                        UI.updateStatsDisplay();
                        UI.showToast(`匯入成功，共 ${Object.keys(mergedRecords).length} 筆記錄`);
                    } else {
                        UI.showToast('匯入失敗：保存記錄時出錯');
                    }

                    document.body.removeChild(modal);
                } catch (error) {
                    UI.showToast(`匯入失敗：${error.message}`);
                }
            });

            document.getElementById('ex-record-modal-close-btn').addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        }
    };

    // 檢查舊數據格式並轉換
    function migrateOldData() {
        const oldRecordStr = localStorage.getItem("record");
        if (oldRecordStr) {
            try {
                const oldIds = oldRecordStr.split(",").filter(id => id.trim() !== '');
                const newRecords = Utils.getRecords();
                const now = new Date().toISOString();

                for (let i = 0; i < oldIds.length; i++) {
                    const id = oldIds[i];
                    if (id && !newRecords[id]) {
                        newRecords[id] = { t: now };
                    }
                }

                Utils.saveRecords(newRecords);
                localStorage.removeItem("record");
                UI.showToast("已轉換舊格式記錄");
            } catch (e) {
                console.error('轉換舊記錄失敗:', e);
            }
        }
    }

    // 初始化函數
    function init() {
        console.log('初始化 Enhanced Exhentai Record 腳本...');

        // 添加樣式
        UI.addStyles();

        // 轉換舊數據
        migrateOldData();

        if (Utils.getTableBody()) {
            // 創建控制面板
            UI.createControlPanel();

            // 創建進度容器
            UI.createProgressContainer();
            UI.toggleProgressContainer(false); // 默認隱藏

            // 標記已記錄的項目
            Record.highlightRecorded();

            // 更新統計信息
            UI.updateStatsDisplay();

            // 初始化頁面加載器
            PageLoader.init();

            // 默認隱藏已記錄的項目
            if (CONFIG.autoHideRecorded) {
                const hiddenCount = Record.hideRecordedItems();
                if (hiddenCount > 0) {
                    UI.showToast(`已隱藏 ${hiddenCount} 筆已記錄的內容`);
                }
            }

            // 添加滾動事件來監控閱讀進度
            window.addEventListener('scroll', Utils.debounce(() => {
                Utils.updateReadingProgress();
            }, 200));
        } else {
            console.log('找不到作品表格，可能不在正確的頁面');
        }
    }

    // 確保頁面載入完成後執行初始化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(init, 1000);
        });
    }

    // 確保初始化執行
    setTimeout(() => {
        if (!document.querySelector('.ex-record-toolbar')) {
            init();
        }
    }, 2000);
})();