// ==UserScript==
// @name         Threads 免登入 5.4 (Auto-Match .net / .com)
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  支援多目標、自訂首頁、自動登入憑證帶入、429/401 靜默、GraphQL 請求統計的 Threads 自動瀏覽腳本
// @author       ChatGPT
// @match        *://*.threads.com/*
// @match        *://*.threads.net/*
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @language     zh-TW
// @downloadURL https://update.greasyfork.org/scripts/532942/Threads%20%E5%85%8D%E7%99%BB%E5%85%A5%2054%20%28Auto-Match%20net%20%20com%29.user.js
// @updateURL https://update.greasyfork.org/scripts/532942/Threads%20%E5%85%8D%E7%99%BB%E5%85%A5%2054%20%28Auto-Match%20net%20%20com%29.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
    alert('Tampermonkey 腳本已啟動！');
    console.log('[ThreadsV54] script loaded');
    const wait = ms => new Promise(res => setTimeout(res, ms));
 
    // --- 防偵測 ---
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'languages', { get: () => ['zh-TW','zh'] });
    Object.defineProperty(navigator, 'plugins',   { get: () => [1,2,3,4,5] });
    const UA_SUFFIX = [
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.5845.96 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.5993.90 Mobile Safari/537.36',
        ' AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6082.47 Mobile Safari/537.36'
    ];
    const baseUA = navigator.userAgent.replace(/\s*\(.+?\)/, '');
    Object.defineProperty(navigator, 'userAgent', { get: () => baseUA + UA_SUFFIX[Math.floor(Math.random() * UA_SUFFIX.length)] });
 
    // --- 自動注入 Access Token ---
    function getAccessToken() {
        try {
            const boot = window.__bootstrapSharedData || window.__INIT_DATA || {};
            return boot.config?.accessToken || boot.accessToken || null;
        } catch {
            return null;
        }
    }
 
    // --- 攔截 fetch ---
    const origFetch = window.fetch;
    window.fetch = async function(resource, init = {}) {
        const url = typeof resource === 'string' ? resource : resource.url;
        init.credentials = 'include';
        const token = getAccessToken();
        if (token) {
            init.headers = init.headers || {};
            init.headers.Authorization = 'Bearer ' + token;
        }
        let resp;
        try {
            resp = await origFetch(resource, init);
        } catch (e) {
            // 網路錯誤才拋出
            return Promise.reject(e);
        }
        // 靜默處理 401/429
        if (resp.status === 401 || resp.status === 429) return resp;
        // 記錄 GraphQL 請求
        if ((url.includes('/graphql/query') || url.includes('/api/graphql')) && init.method === 'POST') {
            console.log('[ThreadsV54] GraphQL 200 OK:', url, 'Payload:', init.body);
        }
        return resp;
    };
 
    // --- 通知 ---
    function notify(title, text) {
        if (typeof GM_notification === 'function') {
            GM_notification({ title, text, timeout: 2000 });
        } else {
            console.log(`${title}: ${text}`);
        }
    }
 
    // --- 存取 Function ---
    const NS = 'ThreadsV54_';
    const STORAGE = {
        TARGETS: NS + 'TARGETS',
        IDX:     NS + 'IDX',
        HOME:    NS + 'HOME',
        RUN:     NS + 'RUN',
        LOOP:    NS + 'LOOP',
        MAX:     NS + 'MAX'
    };
    const save = (k, v) => GM_setValue(k, v);
    const load = (k, d) => {
        const v = GM_getValue(k);
        return v !== undefined ? v : d;
    };
    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
 
    // --- 模擬參數 ---
    const R = {
        STAY:        [20000, 30000],  // 目標頁停留時間
        BROWSE:      [120000,180000], // 首頁瀏覽時間
        SCROLL_FAST: [window.innerHeight * 0.8, window.innerHeight * 1.2],
        SCROLL_SLOW: [window.innerHeight * 0.3, window.innerHeight * 0.6],
        WAIT_FAST:   [1000, 2000],
        WAIT_SLOW:   [4000, 6000],
        PAUSE:       [3000, 10000]   // 換頁前暫停
    };
 
    // --- UI Panel ---
    const PID = 'tm_threads_v54';
    if (document.getElementById(PID)) return;
    const panel = document.createElement('div'); panel.id = PID;
    Object.assign(panel.style, {
        position:   'fixed',
        top:        '10px',
        right:      '10px',
        background: '#fff',
        border:     '1px solid #ccc',
        padding:    '8px',
        fontSize:   '13px',
        zIndex:     9999
    });
    const btnStart = document.createElement('button'); btnStart.textContent = '開始';
    const btnStop  = document.createElement('button'); btnStop.textContent  = '暫停'; btnStop.style.marginLeft = '6px';
    const inpMax   = document.createElement('input'); inpMax.placeholder = '最大循環(空=無限)'; inpMax.style.width = '100%';
    const inpHome  = document.createElement('input'); inpHome.placeholder = '首頁 URL'; inpHome.style.width = '100%';
    const inpTar   = document.createElement('textarea'); inpTar.placeholder = '目標 URL(逗號分隔)'; inpTar.style.width = '100%'; inpTar.style.height = '50px';
    const lblStatus= document.createElement('div'); lblStatus.textContent = '狀態: 待命';
    const lblLoop  = document.createElement('div'); lblLoop.textContent   = '完整循環: 0';
    const lblCount = document.createElement('div'); lblCount.textContent  = '倒數: 0s';
    panel.append(btnStart, btnStop, inpMax, inpHome, inpTar, lblStatus, lblLoop, lblCount);
    document.body.appendChild(panel);
    const updateStatus = s => lblStatus.textContent = '狀態: ' + s;
 
    inpHome.value = load(STORAGE.HOME, location.origin);
    inpTar.value  = load(STORAGE.TARGETS, JSON.stringify([location.origin]))
                        .replace(/[[\]"]+/g, '')
                        .split(',')
                        .join(', ');
 
    function getTargets() {
        try {
            return JSON.parse(load(STORAGE.TARGETS, '[]'));
        } catch {
            return [];
        }
    }
    function getNext() {
        const list = getTargets();
        let idx = load(STORAGE.IDX, -1);
        idx = (idx + 1) % list.length;
        save(STORAGE.IDX, idx);
        return list[idx];
    }
    function isTarget() {
        return getTargets().some(u => location.href.startsWith(u));
    }
    let visited = false;
 
    // --- 隨機滾動 ---
    async function scrollOnce() {
        const fast = Math.random() < 0.5;
        const step = fast ? rand(...R.SCROLL_FAST) : rand(...R.SCROLL_SLOW);
        const maxY = document.documentElement.scrollHeight - window.innerHeight;
        let dir;
        if (window.scrollY >= maxY) dir = -1;
        else if (window.scrollY <= 0) dir = 1;
        else dir = Math.random() < 0.7 ? 1 : -1;
        const y = Math.min(Math.max(0, window.scrollY + step * dir), maxY);
        window.scrollTo({ top: y, behavior: 'smooth' });
        await wait(fast ? rand(...R.WAIT_FAST) : rand(...R.WAIT_SLOW));
    }
 
    // --- 自動按愛心 ---
    async function autoLike(force = false) {
        // 嘗試尋找主文的愛心按鈕
        // 1. 先找 aria-label="Like" 或 aria-label="讚"
        // 2. 若已按過(aria-pressed=true)則不再點擊
        const likeBtn = document.querySelector('button[aria-label="Like"], button[aria-label="讚"]');
        if (likeBtn) {
            const pressed = likeBtn.getAttribute('aria-pressed');
            if (force) {
                if (pressed !== 'true') {
                    likeBtn.click();
                    notify('自動按愛心', '已自動按下主文愛心');
                }
            } else {
                // 首頁隨機 50% 機率按愛心
                if (pressed !== 'true' && Math.random() < 0.5) {
                    likeBtn.click();
                    notify('自動按愛心', '首頁隨機按下主文愛心');
                }
            }
        }
    }
 
    // --- 核心模擬流程 ---
    async function simulate() {
        const tgt = isTarget(); if (tgt) visited = true;
        updateStatus('瀏覽 ' + (tgt ? '目標頁' : '首頁'));
        // 進入目標頁一定要按愛心，首頁隨機
        if (tgt) {
            await autoLike(true);
        } else {
            await autoLike(false);
        }
        notify('模擬', '開始 ' + (tgt ? '目標頁' : '首頁'));
        const duration = rand(...(tgt ? R.STAY : R.BROWSE));
        let rem = duration;
        lblCount.textContent = '倒數: ' + Math.ceil(rem / 1000) + 's';
        const ti = setInterval(() => {
            rem -= 1000;
            lblCount.textContent = '倒數: ' + (rem > 0 ? Math.ceil(rem / 1000) : 0) + 's';
        }, 1000);
        const t0 = Date.now();
        while (Date.now() - t0 < duration && load(STORAGE.RUN, false)) {
            await scrollOnce();
        }
        clearInterval(ti);
        lblCount.textContent = '倒數: 0s';
        if (!load(STORAGE.RUN, false)) return;
        await wait(rand(...R.PAUSE));
        const home = inpHome.value.trim() || location.origin;
        save(STORAGE.HOME, home);
        const next = tgt ? home : getNext();
        if (tgt && next === home && visited) {
            let c = load(STORAGE.LOOP, 0) + 1;
            save(STORAGE.LOOP, c);
            lblLoop.textContent = '完整循環: ' + c;
            const m = load(STORAGE.MAX, Infinity);
            if (m !== Infinity && c >= m) { stop(); return; }
            visited = false;
        }
        location.href = next;
    }
 
    function runner() {
        return simulate().then(() => load(STORAGE.RUN, false) && runner());
    }
    function stop() {
        save(STORAGE.RUN, false);
        updateStatus('已停止');
        notify('停止', '已停止');
        btnStart.disabled = false;
    }
 
    btnStart.onclick = () => {
        const m = parseInt(inpMax.value);
        if (!isNaN(m)) save(STORAGE.MAX, m);
        const arr = inpTar.value.split(',').map(s => s.trim()).filter(s => s);
        if (arr.length) save(STORAGE.TARGETS, JSON.stringify(arr));
        save(STORAGE.IDX, -1);
        save(STORAGE.LOOP, 0);
        save(STORAGE.RUN, true);
        visited = false;
        lblLoop.textContent = '完整循環: 0';
        updateStatus('運行中');
        btnStart.disabled = true;
        runner();
    };
    btnStop.onclick = () => stop();
 
    // --- SPA 導覽偵測 ---
    ['pushState', 'replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = function() {
            orig.apply(this, arguments);
            window.dispatchEvent(new Event('urlchange'));
        };
    });
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('urlchange')));
    window.addEventListener('urlchange', () => load(STORAGE.RUN, false) && simulate());
    window.addEventListener('load', () => setTimeout(() => load(STORAGE.RUN, false) && simulate(), 1000));
})();