// ==UserScript==
// @name         Threads V2.3
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  支援多目標、自訂首頁、倒數顯示與防偵測功能，優化 SPA 網站支援與 UI 持久性。
// @author       ChatGPT
// @match        https://www.threads.net/*
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533918/Threads%20V23.user.js
// @updateURL https://update.greasyfork.org/scripts/533918/Threads%20V23.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 防偵測（可選）---
    Object.defineProperty(navigator, 'webdriver', {get:() => false});
    Object.defineProperty(navigator, 'languages', {get:() => ['zh-TW','zh']});
    Object.defineProperty(navigator, 'plugins', {get:() => [1,2,3,4,5]});

    // --- Storage Keys ---
    const NS = 'ThreadsV23_';
    const STORAGE = {
        TARGETS: NS + 'TARGETS',
        IDX: NS + 'IDX',
        HOME: NS + 'HOME',
        RUN: NS + 'RUN',
        LOOP: NS + 'LOOP',
        MAX: NS + 'MAX'
    };

    const DEFAULT_HOME = 'https://www.threads.net';
    const DEFAULT_TARGETS = ['https://www.threads.net/t/CHECKME'];

    const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const save = (k, v) => GM_setValue(k, v);
    const load = (k, d) => {
        const v = GM_getValue(k);
        return v !== undefined ? v : d;
    };

    const R = {
        STAY: [20000, 30000],      // 在目標頁停留
        BROWSE: [60000, 90000],    // 在首頁瀏覽
        SCROLL: [1000, 3000],      // 滾動間隔
        PAUSE: [3000, 8000]        // 頁面跳轉前停頓
    };

    const PID = 'tm_threads_v23_panel';
    let panel, btnStart, btnStop, inpHome, inpTar, inpMax, lblStatus, lblLoop, lblCount;

    function insertUI() {
        if (document.getElementById(PID)) return;
        panel = document.createElement('div'); panel.id = PID;
        Object.assign(panel.style, {
            position: 'fixed', top: '10px', right: '10px', background: '#fff',
            border: '1px solid #ccc', padding: '8px', fontSize: '13px', zIndex: 9999
        });

        btnStart = document.createElement('button'); btnStart.textContent = '開始';
        btnStop = document.createElement('button'); btnStop.textContent = '暫停'; btnStop.style.marginLeft = '6px';
        inpMax = document.createElement('input'); inpMax.placeholder = '最大循環次數'; inpMax.style.width = '100%'; inpMax.style.margin = '4px 0';
        inpHome = document.createElement('input'); inpHome.placeholder = '首頁 URL'; inpHome.style.width = '100%'; inpHome.style.margin = '4px 0';
        inpTar = document.createElement('textarea'); inpTar.placeholder = '多目標 URL (逗號分隔)'; inpTar.style.width = '100%'; inpTar.style.height = '50px'; inpTar.style.margin = '4px 0';
        lblStatus = document.createElement('div'); lblStatus.textContent = '狀態: 待命';
        lblLoop = document.createElement('div'); lblLoop.textContent = '完整循環: 0';
        lblCount = document.createElement('div'); lblCount.textContent = '倒數: 0s';

        panel.append(btnStart, btnStop, inpMax, inpHome, inpTar, lblStatus, lblLoop, lblCount);
        document.body.appendChild(panel);
        console.log('[V2.3] UI 面板插入成功');

        // 初始值
        inpHome.value = load(STORAGE.HOME, DEFAULT_HOME);
        inpTar.value = load(STORAGE.TARGETS, JSON.stringify(DEFAULT_TARGETS)).replace(/[\[\]"]+/g, '').split(',').join(', ');

        // 點擊事件
        btnStart.onclick = () => {
            const m = parseInt(inpMax.value); if (!isNaN(m)) save(STORAGE.MAX, m);
            const arr = inpTar.value.split(',').map(s => s.trim()).filter(s => s); if (arr.length) save(STORAGE.TARGETS, JSON.stringify(arr));
            save(STORAGE.HOME, inpHome.value.trim() || DEFAULT_HOME);
            save(STORAGE.IDX, -1);
            save(STORAGE.LOOP, 0);
            save(STORAGE.RUN, true);
            visitedTarget = false;
            lblLoop.textContent = '完整循環: 0';
            updateStatus('運行中');
            btnStart.disabled = true;
            runner();
        };

        btnStop.onclick = () => stop('手動停止');
    }

    function updateStatus(t) {
        lblStatus.textContent = '狀態: ' + t;
    }

    function notify(title, text) {
        if (typeof GM_notification === 'function') GM_notification({ title, text, timeout: 2000 });
    }

    const getTargets = () => {
        try {
            return JSON.parse(load(STORAGE.TARGETS, JSON.stringify(DEFAULT_TARGETS)));
        } catch {
            return DEFAULT_TARGETS;
        }
    };

    const getNext = () => {
        const list = getTargets();
        let idx = load(STORAGE.IDX, -1);
        idx = (idx + 1) % list.length;
        save(STORAGE.IDX, idx);
        return list[idx];
    };

    const isTarget = () => getTargets().some(u => location.href.startsWith(u));

    let visitedTarget = false;

    async function scrollOnce() {
        const step = window.innerHeight * (Math.random() * 0.5 + 0.5);
        let y = Math.min(Math.max(0, window.scrollY + step * (Math.random() < 0.7 ? 1 : -1)), document.documentElement.scrollHeight - window.innerHeight);
        window.scrollTo({ top: y, behavior: 'smooth' });
        await wait(rand(...R.SCROLL));
    }

    async function simulate() {
        const tgt = isTarget();
        if (tgt) visitedTarget = true;
        updateStatus('瀏覽 ' + (tgt ? '目標頁' : '首頁'));
        notify('模擬', '開始 ' + (tgt ? '目標頁' : '首頁'));
        const duration = rand(...(tgt ? R.STAY : R.BROWSE));
        let rem = duration; lblCount.textContent = '倒數: ' + Math.ceil(rem / 1000) + 's';
        const ti = setInterval(() => {
            rem -= 1000;
            lblCount.textContent = '倒數: ' + (rem > 0 ? Math.ceil(rem / 1000) : 0) + 's';
        }, 1000);

        const t0 = Date.now();
        while (Date.now() - t0 < duration && load(STORAGE.RUN, false)) await scrollOnce();
        clearInterval(ti); lblCount.textContent = '倒數: 0s';
        if (!load(STORAGE.RUN, false)) return;

        await wait(rand(...R.PAUSE));
        const homeUrl = inpHome.value.trim() || DEFAULT_HOME;
        const nextUrl = tgt ? homeUrl : getNext();

        if (tgt && nextUrl === homeUrl && visitedTarget) {
            let c = load(STORAGE.LOOP, 0) + 1;
            save(STORAGE.LOOP, c);
            lblLoop.textContent = '完整循環: ' + c;
            const m = load(STORAGE.MAX, Infinity);
            if (m !== Infinity && c >= m) {
                stop(`達上限 ${m}`);
                return;
            }
            visitedTarget = false;
        }

        location.href = nextUrl;
    }

    async function runner() {
        while (load(STORAGE.RUN, false)) await simulate();
    }

    function stop(msg) {
        save(STORAGE.RUN, false);
        updateStatus('已停止');
        notify('停止', msg || '已停止');
        btnStart.disabled = false;
    }

    function autoContinue() {
        if (load(STORAGE.RUN, false)) {
            btnStart.disabled = true;
            lblLoop.textContent = '完整循環: ' + load(STORAGE.LOOP, 0);
            runner();
        }
    }

    // --- SPA 支援：監聽 pushState ---
    function hookPushState() {
        const pushState = history.pushState;
        history.pushState = function () {
            pushState.apply(history, arguments);
            window.dispatchEvent(new Event("locationchange"));
        };
        window.addEventListener("popstate", () => {
            window.dispatchEvent(new Event("locationchange"));
        });
    }

    window.addEventListener('load', () => {
        setTimeout(() => {
            insertUI();
            hookPushState();
            autoContinue();
        }, 1000);
    });

    window.addEventListener('locationchange', () => {
        setTimeout(() => {
            insertUI();
            autoContinue();
        }, 1000);
    });

    // --- 防止 UI 被 React 清除 ---
    const observer = new MutationObserver(() => insertUI());
    observer.observe(document.body, { childList: true, subtree: true });

})();
