// ==UserScript==
// @name         Threads 全能助手 6.6 (精簡 UI 修正版)
// @namespace    https://secure.scriptlab.net
// @version      6.6.3
// @description  簡化 UI 並確保在 SPA 動態加載的情況下也能顯示面板
// @author       ChatGPT
// @match        *://*.threads.net/*
// @match        *://*.threads.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-start
// @license      MIT
// @language     zh-TW
// @downloadURL https://update.greasyfork.org/scripts/535657/Threads%20%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%2066%20%28%E7%B2%BE%E7%B0%A1%20UI%20%E4%BF%AE%E6%AD%A3%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535657/Threads%20%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B%2066%20%28%E7%B2%BE%E7%B0%A1%20UI%20%E4%BF%AE%E6%AD%A3%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待 document.body 出現（兼容 SPA）
    function waitForBody() {
        return new Promise(resolve => {
            if (document.body) return resolve();
            new MutationObserver((mutations, obs) => {
                if (document.body) {
                    obs.disconnect();
                    resolve();
                }
            }).observe(document.documentElement, { childList: true, subtree: true });
        });
    }

    // 初始化 UI
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

    // 基礎工具
    const wait = ms => new Promise(res => setTimeout(res, ms));
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const notify = (t, m) => { if (typeof GM_notification === 'function') GM_notification({ title: t, text: m, timeout:2000 }); };

    // 狀態
    const state = {
        params: { intervalMin:30, intervalMax:60, batchSize:5 },
        stats: { loops:0, views:0 },
        running: false
    };

    // 更新顯示
    function updateDisplay() {
        const loops = document.getElementById('tb-loops');
        const views = document.getElementById('tb-views');
        if (loops) loops.textContent = state.stats.loops;
        if (views) views.textContent = state.stats.views;
    }
    function setStatus(t) {
        const st = document.getElementById('tb-status');
        if (st) st.textContent = '狀態: ' + t;
    }

    // 模擬操作
    async function simulate() {
        for (let i = 0; i < state.params.batchSize; i++) {
            GM_xmlhttpRequest({ method:'POST', url:'/api/graphql', data:'{}' });
        }
        state.stats.views += state.params.batchSize;
        state.stats.loops++;
        updateDisplay();
    }

    // 主流程
    async function runner() {
        setStatus('運行中');
        state.running = true;
        while (state.running) {
            await simulate();
            const iv = rand(state.params.intervalMin, state.params.intervalMax) * 1000;
            await wait(iv);
        }
        setStatus('已停止');
    }

    // 綁定事件（面板建立後）
    async function bindEvents() {
        await waitForBody();
        document.getElementById('tb-start')?.addEventListener('click', () => {
            state.params.intervalMin = parseInt(document.getElementById('tb-int-min').value) || 30;
            state.params.intervalMax = parseInt(document.getElementById('tb-int-max').value) || 60;
            state.params.batchSize   = parseInt(document.getElementById('tb-batch').value)   || 5;
            if (!state.running) runner();
        });
        document.getElementById('tb-stop')?.addEventListener('click', () => { state.running = false; });
    }

    // 啟動
    initUI();
    bindEvents();
})();
