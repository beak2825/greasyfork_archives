// ==UserScript==
// @name         Threads 免登入 6.1 (強韌性與導覽修復)
// @namespace    http://tampermonkey.net/
// @version      6.1
// @description  修復 SPA 導覽偵測、增強除錯能力與穩定性的 Threads 自動瀏覽腳本
// @author       程式夥伴
// @match        *://threads.net/*
// @match        *://www.threads.net/*
// @match        *://threads.com/*
// @match        *://www.threads.com/*
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @license      MIT
// @language     zh-TW
// @downloadURL https://update.greasyfork.org/scripts/543844/Threads%20%E5%85%8D%E7%99%BB%E5%85%A5%2061%20%28%E5%BC%B7%E9%9F%8C%E6%80%A7%E8%88%87%E5%B0%8E%E8%A6%BD%E4%BF%AE%E5%BE%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543844/Threads%20%E5%85%8D%E7%99%BB%E5%85%A5%2061%20%28%E5%BC%B7%E9%9F%8C%E6%80%A7%E8%88%87%E5%B0%8E%E8%A6%BD%E4%BF%AE%E5%BE%A9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[ThreadsV61] script loaded');
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

    // --- [升級] 自動注入 Access Token ---
    function getAccessToken() {
        try {
            const boot = window.__bootstrapSharedData || window.__INIT_DATA || {};
            const token = boot.config?.accessToken || boot.accessToken || null;
            if (!token) {
                console.warn('[ThreadsV61] 未能從 window.__bootstrapSharedData 或 window.__INIT_DATA 中獲取 accessToken。');
            }
            return token;
        } catch (e) {
            console.error('[ThreadsV61] 獲取 accessToken 時發生錯誤:', e);
            return null;
        }
    }

    // --- [升級] 攔截 fetch ---
    const origFetch = window.fetch;
    window.fetch = async function(resource, init = {}) {
        const url = typeof resource === 'string' ? resource : resource.url;
        init.credentials = 'include';
        const token = getAccessToken();
        if (token) {
            init.headers = init.headers || {};
            init.headers.Authorization = 'Bearer ' + token;
            if (url.includes('/api/graphql')) console.log('[ThreadsV61] 請求已附加 Token。');
        } else {
            if (url.includes('/api/graphql')) console.warn('[ThreadsV61] 請求未附加 Token，可能導致驗證失敗。');
        }
        let resp;
        try {
            resp = await origFetch(resource, init);
        } catch (e) {
            return Promise.reject(e);
        }
        if (resp.status === 401 || resp.status === 429) return resp;
        if ((url.includes('/graphql/query') || url.includes('/api/graphql')) && init.method === 'POST') {
            console.log('[ThreadsV61] GraphQL 200 OK:', url);
        }
        return resp;
    };

    // --- 通知 ---
    function notify(title, text) {
        if (typeof GM_notification === 'function') {
            GM_notification({ title, text, timeout: 3000 });
        } else {
            console.log(`${title}: ${text}`);
        }
    }

    // --- 存取 Function ---
    const NS = 'ThreadsV61_';
    const STORAGE = {
        TARGETS: NS + 'TARGETS', IDX: NS + 'IDX', HOME: NS + 'HOME',
        RUN: NS + 'RUN', LOOP: NS + 'LOOP', MAX: NS + 'MAX'
    };
    const save = (k, v) => GM_setValue(k, v);
    const load = (k, d) => GM_getValue(k, d);
    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;

    // --- 模擬參數 ---
    const R = {
        STAY: [45000, 75000], BROWSE: [180000, 300000],
        SCROLL_FAST: [window.innerHeight * 0.7, window.innerHeight * 1.1],
        SCROLL_SLOW: [window.innerHeight * 0.2, window.innerHeight * 0.5],
        WAIT_FAST: [4000, 7000], WAIT_SLOW: [8000, 15000],
        PAUSE: [10000, 20000],
        HUMAN_PAUSE_CHANCE: 0.15,
        HUMAN_PAUSE_DURATION: [2000, 5000],
    };

    // --- UI Panel ---
    const PID = 'tm_threads_v61';
    if (document.getElementById(PID)) return;

    const styles = `
        #${PID} { position: fixed; top: 10px; right: 10px; background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 8px; padding: 12px; font-size: 14px; z-index: 9999; box-shadow: 0 4px 8px rgba(0,0,0,0.1); width: 250px; font-family: sans-serif; }
        #${PID} button { border: none; padding: 8px 12px; border-radius: 5px; cursor: pointer; transition: background-color 0.2s; font-weight: bold; }
        #${PID} .btn-start { background-color: #28a745; color: white; }
        #${PID} .btn-start:disabled { background-color: #6c757d; cursor: not-allowed; }
        #${PID} .btn-stop { background-color: #dc3545; color: white; margin-left: 8px; }
        #${PID} .btn-stop:disabled { background-color: #6c757d; cursor: not-allowed; }
        #${PID} .btn-clear { background-color: #ffc107; color: black; margin-top: 8px; width: 100%; }
        #${PID} input, #${PID} textarea { width: 100%; padding: 6px; border: 1px solid #ced4da; border-radius: 4px; margin-top: 8px; box-sizing: border-box; }
        #${PID} textarea { height: 60px; resize: vertical; }
        #${PID} > div { margin-top: 8px; }
        #${PID} .progress-bar-container { width: 100%; background-color: #e9ecef; border-radius: 4px; overflow: hidden; height: 10px; margin-top: 4px; }
        #${PID} .progress-bar { width: 0%; height: 100%; background-color: #007bff; transition: width 0.5s ease-in-out; }
        #${PID} .log-container { font-size: 12px; color: #495057; max-height: 80px; overflow-y: auto; border: 1px solid #e9ecef; padding: 5px; margin-top: 8px; border-radius: 4px; background: #fff; }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    const panel = document.createElement('div'); panel.id = PID;

    const btnStart = document.createElement('button'); btnStart.textContent = '開始'; btnStart.className = 'btn-start';
    const btnStop  = document.createElement('button'); btnStop.textContent  = '暫停'; btnStop.className = 'btn-stop';
    const btnClear = document.createElement('button'); btnClear.textContent = '清除設定並重載'; btnClear.className = 'btn-clear'; // [新增] 清除設定按鈕
    const inpMax   = document.createElement('input'); inpMax.placeholder = '最大循環(空=無限)';
    const inpHome  = document.createElement('input'); inpHome.placeholder = '首頁 URL';
    const inpTar   = document.createElement('textarea'); inpTar.placeholder = '目標 URL (逗號分隔)';
    const lblStatus= document.createElement('div'); lblStatus.textContent = '狀態: 待命';
    const lblLoop  = document.createElement('div'); lblLoop.textContent   = '完整循環: 0';
    const lblCount = document.createElement('div'); lblCount.textContent  = '倒數: 0s';
    const progressBarContainer = document.createElement('div'); progressBarContainer.className = 'progress-bar-container';
    const progressBar = document.createElement('div'); progressBar.className = 'progress-bar';
    progressBarContainer.appendChild(progressBar);
    const logContainer = document.createElement('div'); logContainer.className = 'log-container';
    logContainer.textContent = '日誌紀錄...';

    panel.append(btnStart, btnStop, inpMax, inpHome, inpTar, lblStatus, lblLoop, lblCount, progressBarContainer, logContainer, btnClear);
    document.body.appendChild(panel);

    const log = (message) => {
        const now = new Date();
        const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        logContainer.innerHTML = `[${time}] ${message}<br>` + logContainer.innerHTML;
        if (logContainer.children.length > 20) { logContainer.removeChild(logContainer.lastChild); }
    };

    function loadSettings() {
        inpHome.value = load(STORAGE.HOME, location.origin);
        inpTar.value  = JSON.parse(load(STORAGE.TARGETS, '[]')).join(', ');
        log('設定已載入。');
    }
    loadSettings();


    function getTargets() {
        try { return JSON.parse(load(STORAGE.TARGETS, '[]')); } catch { return []; }
    }
    function getNext() {
        const list = getTargets();
        if (list.length === 0) return load(STORAGE.HOME, location.origin);
        let idx = load(STORAGE.IDX, -1);
        idx = (idx + 1) % list.length;
        save(STORAGE.IDX, idx);
        return list[idx];
    }
    function isTarget() {
        const currentUrl = location.href;
        return getTargets().some(u => currentUrl.startsWith(u));
    }
    let visited = false;

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

        if (Math.random() < R.HUMAN_PAUSE_CHANCE) {
            const pauseTime = rand(...R.HUMAN_PAUSE_DURATION);
            log(`隨機停頓 ${Math.round(pauseTime/1000)} 秒...`);
            await wait(pauseTime);
        }
    }

    async function simulate() {
        if (!load(STORAGE.RUN, false)) return;

        const tgt = isTarget();
        if (tgt) visited = true;

        const pageType = tgt ? '目標頁' : '首頁';
        log(`開始瀏覽 ${pageType}: ${location.href.substring(0, 50)}...`);
        notify('模擬', `開始瀏覽 ${pageType}`);

        const duration = rand(...(tgt ? R.STAY : R.BROWSE));
        let rem = duration;

        const ti = setInterval(() => {
            rem -= 1000;
            const remainingSeconds = Math.max(0, Math.ceil(rem / 1000));
            lblCount.textContent = `倒數: ${remainingSeconds}s`;
            const progress = Math.max(0, (duration - rem) / duration * 100);
            progressBar.style.width = `${progress}%`;
        }, 1000);

        const t0 = Date.now();
        while (Date.now() - t0 < duration && load(STORAGE.RUN, false)) {
            await scrollOnce();
        }
        clearInterval(ti);

        lblCount.textContent = '倒數: 0s';
        progressBar.style.width = '100%';
        if (!load(STORAGE.RUN, false)) {
            log('腳本已手動停止');
            return;
        }

        await wait(rand(...R.PAUSE));
        if (!load(STORAGE.RUN, false)) {
             log('腳本已手動停止');
             return;
        }

        const home = inpHome.value.trim() || location.origin;
        save(STORAGE.HOME, home);
        const next = tgt ? home : getNext();

        if (tgt && next === home && visited) {
            let c = load(STORAGE.LOOP, 0) + 1;
            save(STORAGE.LOOP, c);
            lblLoop.textContent = '完整循環: ' + c;
            log(`完成第 ${c} 次完整循環`);
            const m = load(STORAGE.MAX, Infinity);
            if (m !== Infinity && c >= m) {
                stop();
                log(`已達到最大循環次數 ${m}，腳本停止。`);
                notify('完成', `已達到最大循環次數 ${m}`);
                return;
            }
            visited = false;
        }

        log(`準備跳轉至: ${next}`);
        location.href = next;
    }

    function isValidHttpUrl(string) {
        try {
            const url = new URL(string);
            return url.protocol === "http:" || url.protocol === "https:";
        } catch (_) {
            return false;
        }
    }

    function start() {
        const homeUrl = inpHome.value.trim();
        if (!isValidHttpUrl(homeUrl)) {
            log('錯誤: 首頁 URL 格式不正確。');
            notify('錯誤', '首頁 URL 格式不正確');
            return;
        }

        const arr = inpTar.value.split(',').map(s => s.trim()).filter(s => s);
        if (arr.length === 0) {
            log('錯誤: 請至少輸入一個目標 URL。');
            notify('錯誤', '請至少輸入一個目標 URL');
            return;
        }
        for (const url of arr) {
            if (!isValidHttpUrl(url)) {
                log(`錯誤: 目標 URL "${url}" 格式不正確。`);
                notify('錯誤', `目標 URL "${url}" 格式不正確`);
                return;
            }
        }

        const m = parseInt(inpMax.value);
        save(STORAGE.MAX, (!isNaN(m) && m > 0) ? m : Infinity);
        save(STORAGE.TARGETS, JSON.stringify(arr));
        save(STORAGE.HOME, homeUrl);
        save(STORAGE.IDX, -1);
        save(STORAGE.LOOP, 0);
        save(STORAGE.RUN, true);
        visited = false;

        lblLoop.textContent = '完整循環: 0';
        log('腳本已啟動。');
        btnStart.disabled = true;
        btnStop.disabled = false;
        simulate();
    }

    function stop() {
        save(STORAGE.RUN, false);
        log('腳本已停止。');
        btnStart.disabled = false;
        btnStop.disabled = true;
        let id = window.setTimeout(function() {}, 0);
        while (id--) { window.clearTimeout(id); }
        id = window.setInterval(function() {}, 0);
        while (id--) { window.clearInterval(id); }
    }

    // [新增] 清除所有設定
    btnClear.onclick = () => {
        if (confirm('確定要清除所有已儲存的設定嗎？此操作將會重載頁面。')) {
            const keys = Object.values(STORAGE);
            keys.forEach(key => GM_deleteValue(key));
            log('所有設定已清除，即將重載頁面...');
            notify('清除完畢', '所有設定已清除');
            setTimeout(() => location.reload(), 1500);
        }
    };

    btnStart.onclick = start;
    btnStop.onclick = stop;
    btnStop.disabled = true;

    // --- [重大修復] SPA 導覽偵測 ---
    // 使用 history API 攔截來可靠地偵測 URL 變化
    ['pushState', 'replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = function() {
            const result = orig.apply(this, arguments);
            window.dispatchEvent(new Event('urlchange'));
            return result;
        };
    });
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('urlchange')));
    window.addEventListener('urlchange', () => {
        if (load(STORAGE.RUN, false)) {
            log(`偵測到 URL 變化，重新觸發模擬。`);
            // 給頁面一點時間加載新內容
            setTimeout(simulate, 2000);
        }
    });

    // --- 自動啟動 ---
    window.addEventListener('load', () => {
        if (load(STORAGE.RUN, false)) {
            btnStart.disabled = true;
            btnStop.disabled = false;
            log('頁面重載後，腳本自動恢復運行。');
            setTimeout(simulate, 1000);
        }
    });

})();
