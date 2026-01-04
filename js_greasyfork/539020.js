// ==UserScript==
// @name         Bilibili 搜索时间范围设置
// @namespace    http://tampermonkey.net/
// @version      3.8
// @description  通过油猴菜单设置B站搜索的起止时间。
// @author       bloodchili & Gemini
// @match        *://*.bilibili.com/*
// @grant        GM_addStyle
// @grant        GM_setValues
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/539020/Bilibili%20%E6%90%9C%E7%B4%A2%E6%97%B6%E9%97%B4%E8%8C%83%E5%9B%B4%E8%AE%BE%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/539020/Bilibili%20%E6%90%9C%E7%B4%A2%E6%97%B6%E9%97%B4%E8%8C%83%E5%9B%B4%E8%AE%BE%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置 & 默认值 ---
    const MIN_START_DATE = '2009-06-26';
    const STORAGE_KEY_START = 'bili_search_start_date_v3';
    const STORAGE_KEY_END = 'bili_search_end_date_v3';

    const getTodayString = () => new Date().toISOString().split('T')[0];
    const toYYYYMMDD = (d) => d.toISOString().split('T')[0];

    // --- 2. 弹出式设置窗口 ---
    function openSettingsModal() {
        if (document.getElementById('bili-settings-modal')) return;

        const overlay = document.createElement('div');
        overlay.id = 'bili-settings-overlay';
        const modal = document.createElement('div');
        modal.id = 'bili-settings-modal';
        // ★★★ 改动点 1：在HTML中添加新按钮 ★★★
        modal.innerHTML = `
            <h3>设置B站搜索时间范围</h3>
            <div class="form-group">
                <label for="modal-start-date">起始日期:</label>
                <input type="date" id="modal-start-date">
            </div>
            <div class="form-group">
                <label for="modal-end-date">结束日期:</label>
                <input type="date" id="modal-end-date">
            </div>
            <div class="buttons">
                <button id="modal-save-btn">保存设置</button>
                <button id="modal-reset-btn">恢复默认</button>
                <button id="modal-close-btn">关闭</button>
            </div>
            <div class="notice">保存后，在下次B站搜索时将自动应用。</div>
        `;
        // ★★★ 改动点 2：为新按钮添加样式 ★★★
        GM_addStyle(`
            #bili-settings-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 9998; }
            #bili-settings-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; border-radius: 8px; padding: 20px 30px; z-index: 9999; box-shadow: 0 4px 12px rgba(0,0,0,0.15); }
            #bili-settings-modal h3 { margin-top: 0; text-align: center; }
            #bili-settings-modal .form-group { margin: 15px 0; display: flex; align-items: center; }
            #bili-settings-modal label { width: 80px; }
            #bili-settings-modal input[type="date"] { padding: 5px; border: 1px solid #ccc; border-radius: 4px; }
            #bili-settings-modal .buttons { text-align: center; margin-top: 25px; }
            #bili-settings-modal button { margin: 0 8px; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;}
            #bili-settings-modal #modal-save-btn { background: #00a1d6; color: white; }
            #bili-settings-modal #modal-reset-btn { background: #f1f2f3; color: #61666d; }
            #bili-settings-modal #modal-close-btn { background: #e3e5e7; }
            #bili-settings-modal .notice { font-size: 12px; color: #999; text-align: center; margin-top: 15px; }
        `);

        document.body.appendChild(overlay);
        document.body.appendChild(modal);

        const startDateInput = document.getElementById('modal-start-date');
        const endDateInput = document.getElementById('modal-end-date');
        const resetButton = document.getElementById('modal-reset-btn'); // 获取新按钮
        let lastGoodStartDate = MIN_START_DATE;
        let lastGoodEndDate = getTodayString();

        const normalizeDates = (event) => {
            const minDate = new Date(MIN_START_DATE);
            const today = new Date();
            today.setHours(23, 59, 59, 999);

            let startDate = new Date(startDateInput.value);
            let endDate = new Date(endDateInput.value);
            let needsCorrection = false;

            if (isNaN(startDate.getTime()) || startDate < minDate) {
                startDateInput.value = lastGoodStartDate;
                needsCorrection = true;
            }
            if (isNaN(endDate.getTime()) || endDate < minDate || endDate > today) {
                endDateInput.value = lastGoodEndDate;
                needsCorrection = true;
            }
            if (needsCorrection) return;

            startDate = new Date(startDateInput.value);
            endDate = new Date(endDateInput.value);

            if (startDate > endDate) {
                if (event && event.target.id === 'modal-start-date') {
                    endDateInput.value = startDateInput.value;
                } else {
                    startDateInput.value = endDateInput.value;
                }
            }
            lastGoodStartDate = startDateInput.value;
            lastGoodEndDate = endDateInput.value;
        };

        const closeModal = () => {
            document.body.removeChild(modal);
            document.body.removeChild(overlay);
        };

        Promise.all([
            GM_getValue(STORAGE_KEY_START, MIN_START_DATE),
            GM_getValue(STORAGE_KEY_END, getTodayString())
        ]).then(([loadedStartStr, loadedEndStr]) => {
            let startDate = new Date(loadedStartStr);
            let endDate = new Date(loadedEndStr);
            const minDate = new Date(MIN_START_DATE);
            const today = new Date(getTodayString());

            let needsReset = false;
            if (isNaN(startDate.getTime()) || startDate < minDate) needsReset = true;
            if (isNaN(endDate.getTime()) || endDate < minDate || endDate > today) needsReset = true;
            if (startDate > endDate) needsReset = true;

            let finalStart, finalEnd;

            if (needsReset) {
                finalStart = MIN_START_DATE;
                finalEnd = getTodayString();
            } else {
                finalStart = loadedStartStr;
                finalEnd = loadedEndStr;
            }

            startDateInput.value = finalStart;
            endDateInput.value = finalEnd;
            lastGoodStartDate = finalStart;
            lastGoodEndDate = finalEnd;
        });

        startDateInput.addEventListener('change', normalizeDates);
        endDateInput.addEventListener('change', normalizeDates);

        // ★★★ 改动点 3：为恢复默认按钮绑定事件 ★★★
        resetButton.addEventListener('click', () => {
            const defaultStart = MIN_START_DATE;
            const defaultEnd = getTodayString();

            // 直接将输入框的值设为默认值
            startDateInput.value = defaultStart;
            endDateInput.value = defaultEnd;

            // 同时更新“记忆”中的合法值，以便后续验证
            lastGoodStartDate = defaultStart;
            lastGoodEndDate = defaultEnd;

            // 可以在这里加一个视觉反馈，比如按钮闪一下，但目前保持简洁
            console.log('[Bili Time Filter] Dates reset to default in modal.');
        });

        document.getElementById('modal-save-btn').addEventListener('click', async () => {
            normalizeDates({target: endDateInput});
            normalizeDates({target: startDateInput});

            await GM_setValue(STORAGE_KEY_START, startDateInput.value);
            await GM_setValue(STORAGE_KEY_END, endDateInput.value);

            alert('设置已保存！');
            closeModal();
            if (location.hostname === "search.bilibili.com") {
                location.reload();
            }
        });

        document.getElementById('modal-close-btn').addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
    }

    // --- 3. 注册油猴菜单命令 (不变) ---
    GM_registerMenuCommand('设置B站搜索时间', openSettingsModal);

    // --- 4. 核心重定向逻辑 (不变) ---
    function dateToTimestamp(dateString, isEndDate = false) {
        const date = new Date(dateString);
        isEndDate ? date.setHours(23, 59, 59, 999) : date.setHours(0, 0, 0, 0);
        return Math.floor(date.getTime() / 1000);
    }
    async function checkAndRedirect() {
        if (location.hostname !== "search.bilibili.com" || !location.href.includes("keyword=")) return;
        const startDate = await GM_getValue(STORAGE_KEY_START, MIN_START_DATE);
        const endDate = await GM_getValue(STORAGE_KEY_END, getTodayString());
        const beginTimestamp = dateToTimestamp(startDate);
        const endTimestamp = dateToTimestamp(endDate, true);
        const correctParams = `pubtime_begin_s=${beginTimestamp}&pubtime_end_s=${endTimestamp}`;
        if (location.href.includes(correctParams)) return;
        const hasAnyPubtime = /pubtime_begin_s=\d+/.test(location.href);
        if (!hasAnyPubtime) location.replace(`${location.href}&${correctParams}`);
    }

    // --- 5. 启动器 (不变) ---
    let lastUrl = location.href;
    const pageObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            checkAndRedirect();
        }
    });
    pageObserver.observe(document.documentElement, { childList: true, subtree: true });
    checkAndRedirect();

})();