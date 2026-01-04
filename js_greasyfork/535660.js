// ==UserScript==
// @name         Threads 全能助手 6.6 (修訂版 - 刪除動態密鑰)
// @namespace    https://secure.scriptlab.net
// @version      6.6.4
// @description  移除動態密鑰與遠端請求，解決 CSP 問題，確保 UI 必定顯示
// @author       ChatGPT
// @match        *://*.threads.net/*
// @match        *://*.threads.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @run-at       document-idle
// @license      MIT
// @language     zh-TW
// @downloadURL https://update.greasyfork.org/scripts/535660/Threads%20%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%2066%20%28%E4%BF%AE%E8%A8%82%E7%89%88%20-%20%E5%88%AA%E9%99%A4%E5%8B%95%E6%85%8B%E5%AF%86%E9%91%B0%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535660/Threads%20%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%2066%20%28%E4%BF%AE%E8%A8%82%E7%89%88%20-%20%E5%88%AA%E9%99%A4%E5%8B%95%E6%85%8B%E5%AF%86%E9%91%B0%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待 body 出現（SPA 兼容）
    function waitForBody() {
        return new Promise(resolve => {
            if (document.body) return resolve();
            new MutationObserver((m, obs) => {
                if (document.body) {
                    obs.disconnect();
                    resolve();
                }
            }).observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    // 初始化並注入 UI
    async function initUI() {
        await waitForBody();
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed', top: '10px', right: '10px',
            background: '#fff', border: '1px solid #ccc', padding: '8px',
            fontSize: '13px', fontFamily: 'Arial', zIndex: 9999
        });
        panel.innerHTML = `
            <div id="tb-status">狀態: 待命</div>
            <div>循環: <span id="tb-loops">0</span> 觀看: <span id="tb-views">0</span></div>
            間隔最小(s): <input id="tb-int-min" type="number" value="30" style="width:50px">
            間隔最大(s): <input id="tb-int-max" type="number" value="60" style="width:50px"><br>
            批次大小: <input id="tb-batch" type="number" value="5" style="width:50px"><br>
            <button id="tb-start">▶ 開始</button>
            <button id="tb-stop">⏹ 停止</button>
        `;
        document.body.appendChild(panel);
    }

    // 基本工具
    const wait = ms => new Promise(res => setTimeout(res, ms));
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const notify = (title, msg) => GM_notification && GM_notification({title, text: msg, timeout: 2000});

    // 狀態
    const state = {
        params: { intervalMin:30, intervalMax:60, batchSize:5 },
        stats: { loops:0, views:0 },
        running: false
    };

    // 更新介面數值
    function updateDisplay() {
        const loops = document.getElementById('tb-loops');
        const views = document.getElementById('tb-views');
        if (loops) loops.textContent = state.stats.loops;
        if (views) views.textContent = state.stats.views;
    }
    function setStatus(text) {
        const statusEl = document.getElementById('tb-status');
        if (statusEl) statusEl.textContent = '狀態: ' + text;
    }

    // 模擬瀏覽操作
    async function simulate() {
        for (let i = 0; i < state.params.batchSize; i++) {
            GM_xmlhttpRequest({ method: 'POST', url: '/api/graphql', data: '{}' });
        }
        state.stats.views += state.params.batchSize;
        state.stats.loops++;
        updateDisplay();
    }

    // 執行主迴圈
    async function runner() {
        setStatus('運行中');
        state.running = true;
        while (state.running) {
            try {
                await simulate();
            } catch (e) {
                console.error(e);
                notify('錯誤', e.toString());
            }
            const interval = rand(state.params.intervalMin, state.params.intervalMax) * 1000;
            await wait(interval);
        }
        setStatus('已停止');
    }

    // 綁定按鈕事件
    async function bindEvents() {
        await waitForBody();
        document.getElementById('tb-start').addEventListener('click', () => {
            state.params.intervalMin = parseInt(document.getElementById('tb-int-min').value) || 30;
            state.params.intervalMax = parseInt(document.getElementById('tb-int-max').value) || 60;
            state.params.batchSize   = parseInt(document.getElementById('tb-batch').value)   || 5;
            if (!state.running) runner();
        });
        document.getElementById('tb-stop').addEventListener('click', () => { state.running = false; });
    }

    // 啟動
    initUI();
    bindEvents();
})();
