// ==UserScript==
// @name         Pterclub Workload Statistics Toolkit
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  自动记录、展示并管理月度工作量。
// @author       YourName
// @match        https://pterclub.com/salary.php
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541837/Pterclub%20Workload%20Statistics%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/541837/Pterclub%20Workload%20Statistics%20Toolkit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 核心配置 ---
    const HISTORY_STORAGE_KEY = 'workload_history_log_v3';
    const MONTH_TITLE_SELECTOR = 'td.colhead[colspan="15"] > font.big';

    // --- 核心功能函数 ---
    function getPageMonth() {
        const titleElement = document.querySelector(MONTH_TITLE_SELECTOR);
        if (!titleElement) { return null; }
        const titleText = titleElement.textContent.trim();
        const match = titleText.match(/(\d{4})\s*年\s*(\d{1,2})\s*月/);
        if (match && match[1] && match[2]) {
            return `${match[1]}-${match[2].padStart(2, '0')}`;
        }
        return null;
    }

    function getTotalWorkload() {
        try {
            const userLinkElements = document.querySelectorAll('a[href="userdetails.php?id=23583"]');///////////////////////////这里要修改成你的UID//////////////////////////////////
            if (userLinkElements.length < 2) { return null; }
            const userLinkElement = userLinkElements[1];
            const userRow = userLinkElement.closest('tr');
            if (!userRow) { return null; }
            const targetCell = userRow.querySelector('td:nth-last-child(2)');
            if (!targetCell) { return null; }
            const rawText = targetCell.textContent.trim();
            const match = rawText.match(/^\d+/);
            return match ? parseInt(match[0], 10) : null;
        } catch (error) {
            console.error("QA-Error: 在 getTotalWorkload 函数中发生意外错误:", error);
            return null;
        }
    }

    // --- UI显示函数 ---
    function displayHistoryUI(history, errorMsg = null) {
        let panel = document.getElementById('workload-history-panel');
        if (!panel) {
            panel = document.createElement('div');
            panel.id = 'workload-history-panel';
            Object.assign(panel.style, {
                position: 'fixed', bottom: '20px', right: '20px', padding: '12px',
                backgroundColor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '8px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)', zIndex: '9999', fontFamily: 'Arial, sans-serif',
                fontSize: '14px', color: '#343a40', minWidth: '180px',
                maxHeight: '400px', overflowY: 'auto'
            });
            document.body.appendChild(panel);
        }
        panel.innerHTML = '';

        const title = document.createElement('h4');
        title.textContent = '工作量统计';
        Object.assign(title.style, { margin: '0 0 8px 0', fontSize: '16px', borderBottom: '1px solid #dee2e6', paddingBottom: '8px'});
        panel.appendChild(title);

        if (errorMsg) {
            const errorElement = document.createElement('div');
            errorElement.textContent = `⚠️ ${errorMsg}`;
            errorElement.style.color = 'red';
            errorElement.style.fontWeight = 'bold';
            panel.appendChild(errorElement);
            return;
        }

        const keys = Object.keys(history);

        const totalSum = Object.values(history).reduce((sum, value) => sum + Number(value), 0);
        const sumElement = document.createElement('div');
        sumElement.innerHTML = `累计总和: <strong style="font-size: 16px; color: #28a745;">${totalSum}</strong>`;
        Object.assign(sumElement.style, { margin: '4px 0', paddingBottom: '8px', borderBottom: '1px solid #dee2e6' });
        panel.appendChild(sumElement);

        if (keys.length === 0) {
            const noRecord = document.createElement('div');
            noRecord.textContent = '暂无历史记录';
            panel.appendChild(noRecord);
            return;
        }

        keys.sort().reverse();
        const list = document.createElement('div');
        list.style.lineHeight = '1.8';
        keys.forEach(month => {
            const entry = document.createElement('div');
            entry.innerHTML = `${month}: <strong style="color: #007bff;">${history[month]}</strong>`;
            list.appendChild(entry);
        });
        panel.appendChild(list);
    }

    // --- 脚本主逻辑 ---
    async function main() {
        let errorMsg = null;
        let pageMonth = null;
        let totalWorkload = null;

        pageMonth = getPageMonth();
        if (!pageMonth) {
            errorMsg = "无法在页面上定位到月份标题。";
        } else {
            totalWorkload = getTotalWorkload();
            if (totalWorkload === null) {
                errorMsg = "无法在页面上定位到您的工作量数据,请检查是否已经更新UID。";
            }
        }
        const history = await GM_getValue(HISTORY_STORAGE_KEY, {});
        if (!errorMsg && pageMonth && totalWorkload !== null) {
            const storedWorkload = history[pageMonth];
            if (totalWorkload !== storedWorkload) {
                history[pageMonth] = totalWorkload;
                await GM_setValue(HISTORY_STORAGE_KEY, history);
            }
        }
        displayHistoryUI(history, errorMsg);
    }

    setTimeout(main, 1000);

})();