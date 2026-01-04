// ==UserScript==
// @name         FC2PPV 番號提取器
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  從頁面上的文章連結 (href="/articles/...") 精確提取6-8位數字番號並複製到剪貼簿 (自動過濾回覆區與推薦區干擾)
// @author       YourName (Modified by Assistant)
// @match        https://fc2ppvdb.com/*
// @icon         https://www.google.com/s2/favicons?domain=fc2ppvdb.com
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528803/FC2PPV%20%E7%95%AA%E8%99%9F%E6%8F%90%E5%8F%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528803/FC2PPV%20%E7%95%AA%E8%99%9F%E6%8F%90%E5%8F%96%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 自定義提示框樣式 (還原回紫色/紅色風格) ---
    GM_addStyle(`
        .custom-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px;
            background: #9999ff; /* 紫色背景表示成功 (還原) */
            color: white;
            border: 1px solid #3a8a3e;
            border-radius: 4px;
            z-index: 9999;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 14px;
        }
        .custom-alert.error { /* 錯誤樣式 (還原) */
             background: #f44336; /* 紅色背景表示未找到或錯誤 */
             border-color: #d32f2f;
        }
    `);

    // --- 創建可自動關閉的提示框 (還原回原始函數邏輯) ---
    function showAutoCloseAlert(message, duration = 3000, isError = false) {
        // 移除已存在的提示框，避免堆疊
        const existingAlert = document.querySelector('.custom-alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        const alertBox = document.createElement('div');
        alertBox.className = 'custom-alert';
        if (isError) {
            alertBox.classList.add('error'); // 添加錯誤樣式類
        }
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        setTimeout(() => {
             // 確保元素還在 DOM 中再移除
            if (alertBox && alertBox.parentNode) {
               alertBox.remove();
            }
        }, duration);
    }

    // --- 核心提取邏輯 (V3.0 精準版) ---
    function extractAndCopy() {
        const numbers = new Set();

        // 輔助函數：處理元素並提取數字
        const processElements = (elements) => {
            elements.forEach(el => {
                // 如果是 div (修改版結構)，找最近的父層 a；如果是 a，直接使用
                const link = el.tagName === 'A' ? el : el.closest('a');
                if (!link) return;

                const href = link.getAttribute('href');
                if (!href) return;

                // 正則表達式：精確提取 6-8 位數字，排除參數干擾
                const match = href.match(/\/articles\/(\d{6,8})(?:$|\?|#)/);

                if (match && match[1]) {
                    numbers.add(match[1]);
                }
            });
        };

        // ============================================================
        // 策略 1: 修改版結構優先 (Video Preview Container)
        // ============================================================
        const modifiedCards = document.querySelectorAll('.video-preview-container');
        if (modifiedCards.length > 0) {
            processElements(modifiedCards);
        }

        // ============================================================
        // 策略 2: 原始結構 (Grid 佈局鎖定)
        // 鎖定 #actress-articles 下的 flex 容器，自動過濾回覆區
        // ============================================================
        if (numbers.size === 0) {
            const gridLinks = document.querySelectorAll('#actress-articles .flex.flex-wrap a[href*="/articles/"]');
            if (gridLinks.length > 0) {
                processElements(gridLinks);
            }
        }

        // ============================================================
        // 已移除「全域後備策略」，防止抓取到非列表區的錯誤號碼 (解決 8 vs 7 問題)
        // ============================================================

        // --- 結果處理 ---

        // 情況 A: 未找到
        if (numbers.size === 0) {
            // 使用原本的錯誤訊息文字
            showAutoCloseAlert("未在頁面連結中找到符合條件的番號 (6-8位數字)", 3000, true);
            return;
        }

        // 情況 B: 成功找到
        // 排序：轉為陣列 -> 排序 -> 反轉 (讓最新的號碼在最上面) -> 組合字串
        const sortedResult = [...numbers].sort().reverse();
        const resultText = sortedResult.join('\r\n');

        GM_setClipboard(resultText);

        // 使用原本的成功訊息文字格式
        showAutoCloseAlert(`已複製 ${numbers.size} 個番號到剪貼簿`, 3000);
    }

    // --- 事件監聽 ---
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'F8') {
            extractAndCopy();
            e.preventDefault();
        }
    });

    console.log("[FC2PPV] 番號提取器 v3.0.0 已就緒 (Ctrl+Shift+F8)");
})();