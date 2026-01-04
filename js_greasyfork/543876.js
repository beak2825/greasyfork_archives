// ==UserScript==
// @name         Threads 瀏覽次數工具 - 版本 7.2.1 - tf-ads.com
// @namespace    http://tampermonkey.net/
// @version      7.2.1
// @description  UI/狀態最佳化：Panel寬度限制/白底半透明/按鈕狀態正確自動切換
// @author       39 International Co., Ltd.
// @match        *://threads.net/*
// @match        *://www.threads.net/*
// @match        *://threads.com/*
// @match        *://www.threads.com/*
// @run-at       document-idle
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @language     zh-TW
// @downloadURL https://update.greasyfork.org/scripts/543876/Threads%20%E7%80%8F%E8%A6%BD%E6%AC%A1%E6%95%B8%E5%B7%A5%E5%85%B7%20-%20%E7%89%88%E6%9C%AC%20721%20-%20tf-adscom.user.js
// @updateURL https://update.greasyfork.org/scripts/543876/Threads%20%E7%80%8F%E8%A6%BD%E6%AC%A1%E6%95%B8%E5%B7%A5%E5%85%B7%20-%20%E7%89%88%E6%9C%AC%20721%20-%20tf-adscom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[ThreadsV721] script loaded');
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

    // --- 存取 Function ---
    const NS = 'ThreadsV721_';
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
        STAY:        [20000, 30000],
        BROWSE:      [120000,180000],
        SCROLL_FAST: [window.innerHeight * 0.8, window.innerHeight * 1.2],
        SCROLL_SLOW: [window.innerHeight * 0.3, window.innerHeight * 0.6],
        WAIT_FAST:   [1000, 2000],
        WAIT_SLOW:   [4000, 6000],
        PAUSE:       [3000, 10000],
        PAGE_JUMP:   [1000, 5000]
    };

    // --- UI主體 ---
    const PID = 'tm_threads_v721';
    if (document.getElementById(PID)) return;
    const panel = document.createElement('div'); panel.id = PID;
    Object.assign(panel.style, {
        position:   'fixed',
        left:       '50%',
        bottom:     '32px',
        transform:  'translateX(-50%)',
        background: 'rgba(255,255,255,0.75)',
        width:      '100%',
        maxWidth:   '520px',
        minWidth:   '280px',
        overflowX:  'hidden',
        display:    'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        zIndex:     9999,
        border:     '1px solid #dadce0',
        borderRadius: '14px',
        padding:    '18px 24px 14px 24px',
        boxShadow:  '0 2px 16px 3px rgba(60,64,67,.18)',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize:   '15px',
        color:      '#212121',
        boxSizing:  'border-box',
        margin:     '0 auto'
    });

    // Style
    const style = document.createElement('style');
    style.textContent = `
    #tm_threads_v721 label, #tm_threads_v721 .form-row {
        display: flex;
        flex-direction: column;
        margin-bottom: 8px;
        width: 100%;
    }
    #tm_threads_v721 .status-row {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-bottom: 12px;
        width: 100%;
        font-weight: 500;
    }
    #tm_threads_v721 .button-row {
        display: flex;
        flex-direction: row;
        gap: 12px;
        margin-bottom: 10px;
        width: 100%;
        justify-content: flex-start;
    }
    #tm_threads_v721 button:disabled {
        opacity: 0.5 !important;
        cursor: not-allowed !important;
    }
    #tm_threads_v721 input, #tm_threads_v721 textarea {
        background: rgba(255,255,255,0.98);
    }
    @media (max-width: 700px) {
        #tm_threads_v721 { max-width: 98vw !important; padding: 12px 2vw 10px 2vw !important; }
    }
    `;
    document.head.appendChild(style);

    // 標題
    const title = document.createElement('div');
    title.textContent = 'Threads 瀏覽次數工具 - 版本 7.2.1';
    title.style.fontWeight = '500';
    title.style.fontSize = '17px';
    title.style.marginBottom = '10px';
    panel.appendChild(title);

    // 最大次數、首頁URL (上下兩排)
    const formRow1 = document.createElement('div');
    formRow1.className = 'form-row';
    const labelMax = document.createElement('label');
    labelMax.textContent = '最大次數 (空=無限):';
    const inpMax = document.createElement('input');
    Object.assign(inpMax, {
        id: "tm_max",
        type: "number",
        min: 1,
        placeholder: "最大次數 (空=無限)",
        autocomplete: "off"
    });
    Object.assign(inpMax.style, {
        width: "100%",
        padding: "7px 10px",
        fontSize: "15px",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        outline: "none",
        marginBottom: "6px",
        boxSizing: "border-box"
    });
    labelMax.appendChild(inpMax);
    formRow1.appendChild(labelMax);

    const labelHome = document.createElement('label');
    labelHome.textContent = '首頁 URL:';
    const inpHome = document.createElement('input');
    Object.assign(inpHome, {
        id: "tm_home",
        type: "text",
        placeholder: "首頁 URL",
        autocomplete: "off"
    });
    Object.assign(inpHome.style, {
        width: "100%",
        padding: "7px 10px",
        fontSize: "15px",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        outline: "none",
        marginBottom: "6px",
        boxSizing: "border-box"
    });
    labelHome.appendChild(inpHome);
    formRow1.appendChild(labelHome);
    panel.appendChild(formRow1);

    // 目標 URL
    const formRow2 = document.createElement('div');
    formRow2.className = 'form-row';
    const labelTar = document.createElement('label');
    labelTar.textContent = '目標 URL (可用換行、逗號、分號、空格分隔):';
    const inpTar = document.createElement('textarea');
    Object.assign(inpTar, {
        id: "tm_tar",
        placeholder: "目標 URL (可用換行、逗號、分號、空格分隔)"
    });
    Object.assign(inpTar.style, {
        width: "100%",
        padding: "7px 10px",
        fontSize: "15px",
        border: "1px solid #dadce0",
        borderRadius: "8px",
        outline: "none",
        height: "70px",
        resize: "vertical",
        boxSizing: "border-box",
        whiteSpace: "pre-wrap",
        lineHeight: "1.6",
        marginBottom: "4px"
    });
    function cleanAndFormatURLs(value) {
        let urls = value
            .split(/[\n,，;；\s]+/)
            .map(x => x.trim())
            .filter(x => x && /^https?:\/\//.test(x));
        urls = Array.from(new Set(urls)); // 去重
        return urls.join('\n');
    }
    inpTar.addEventListener('input', function(e) {
        const before = inpTar.value;
        const after = cleanAndFormatURLs(before);
        if (before !== after) {
            inpTar.value = after;
            inpTar.selectionStart = inpTar.selectionEnd = after.length;
        }
    });
    labelTar.appendChild(inpTar);
    formRow2.appendChild(labelTar);
    panel.appendChild(formRow2);

    // 按鈕區 (黑底白字)
    const btnBox = document.createElement('div');
    btnBox.className = 'button-row';
    const btnStart = document.createElement('button');
    btnStart.id = "tm_start";
    btnStart.textContent = '開始';
    Object.assign(btnStart.style, {
        padding: "7px 20px",
        border: "none",
        background: "#111",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px",
        color: "#fff",
        fontWeight: "bold",
        transition: "background .15s"
    });
    btnStart.addEventListener('mouseenter',()=>btnStart.style.background='#222');
    btnStart.addEventListener('mouseleave',()=>btnStart.style.background='#111');

    const btnStop = document.createElement('button');
    btnStop.id = "tm_stop";
    btnStop.textContent = '暫停';
    Object.assign(btnStop.style, {
        padding: "7px 20px",
        border: "none",
        background: "#111",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "15px",
        color: "#fff",
        fontWeight: "bold",
        transition: "background .15s"
    });
    btnStop.addEventListener('mouseenter',()=>btnStop.style.background='#222');
    btnStop.addEventListener('mouseleave',()=>btnStop.style.background='#111');

    btnBox.appendChild(btnStart);
    btnBox.appendChild(btnStop);
    panel.appendChild(btnBox);

    // 狀態區 (上下排)
    const statusBox = document.createElement('div');
    statusBox.className = 'status-row';
    const lblStatus = document.createElement('div');
    lblStatus.id = "tm_status";
    lblStatus.textContent = '狀態: 待命';
    statusBox.appendChild(lblStatus);

    const lblLoop = document.createElement('div');
    lblLoop.id = "tm_loop";
    lblLoop.textContent = '進入目標網址: 0 次';
    statusBox.appendChild(lblLoop);

    const lblCount = document.createElement('div');
    lblCount.id = "tm_count";
    lblCount.textContent = '倒數: 0s';
    statusBox.appendChild(lblCount);

    panel.appendChild(statusBox);
    document.body.appendChild(panel);

    // --- 狀態/變數 ---
    let isAutoReload = false;
    function updateButtonState() {
        const running = !!load(STORAGE.RUN, false);
        btnStart.disabled = running;
        btnStop.disabled  = !running;
    }
    const updateStatus = s => lblStatus.textContent = '狀態: ' + s + (isAutoReload ? '（自動刷新）' : '');

    // 預設值載入
    inpHome.value = load(STORAGE.HOME, location.origin);
    inpTar.value  = load(STORAGE.TARGETS, JSON.stringify([location.origin]))
                        .replace(/[[\]"]+/g, '')
                        .split(',')
                        .join('\n');

    // --- 通知 ---
    function notify(title, text) {
        if (typeof GM_notification === 'function') {
            GM_notification({ title, text, timeout: 2000 });
        } else {
            console.log(`${title}: ${text}`);
        }
    }

    function getLoopCount() {
        return parseInt(localStorage.getItem(STORAGE.LOOP)) || 0;
    }
    function setLoopCount(v) {
        localStorage.setItem(STORAGE.LOOP, v);
    }
    function incLoopCount() {
        let v = getLoopCount() + 1;
        setLoopCount(v);
        return v;
    }

    let timerId = null;
    function resetTimer() {
        if (timerId) clearInterval(timerId);
        timerId = null;
    }

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

    async function simulate() {
        resetTimer();
        updateButtonState();
        const tgt = isTarget();
        if (tgt) {
            let c = incLoopCount();
            lblLoop.textContent = '進入目標網址: ' + c + ' 次';
            const m = load(STORAGE.MAX, Infinity);
            if (m !== Infinity && c >= m) { stop(); return; }
        }
        updateStatus('瀏覽' + (tgt ? '目標頁' : '首頁'));
        notify('模擬', '開始 ' + (tgt ? '目標頁' : '首頁'));
        const duration = rand(...(tgt ? R.STAY : R.BROWSE));
        let rem = duration;
        lblCount.textContent = '即將停留：' + Math.ceil(duration / 1000) + ' 秒';
        await wait(600);
        lblCount.textContent = '倒數: ' + Math.ceil(rem / 1000) + 's';
        resetTimer();
        timerId = setInterval(() => {
            rem -= 1000;
            lblCount.textContent = '倒數: ' + (rem > 0 ? Math.ceil(rem / 1000) : 0) + 's';
            if (rem <= 0) resetTimer();
        }, 1000);

        const t0 = Date.now();
        while (Date.now() - t0 < duration && load(STORAGE.RUN, false)) {
            await scrollOnce();
        }
        resetTimer();
        lblCount.textContent = '倒數: 0s';
        if (!load(STORAGE.RUN, false)) return;
        await wait(rand(...R.PAUSE));
        await wait(rand(...R.PAGE_JUMP));
        const home = inpHome.value.trim() || location.origin;
        save(STORAGE.HOME, home);
        const next = tgt ? home : getNext();
        location.href = next;
    }

    function runner() {
        updateButtonState();
        simulate().then(() => {
            if (load(STORAGE.RUN, false)) runner();
            else updateButtonState();
        });
    }
    function stop() {
        save(STORAGE.RUN, false);
        updateStatus('已停止');
        notify('停止', '已停止');
        resetTimer();
        updateButtonState();
    }

    // --- 按下「開始」再清理一次並存入 targets ---
    btnStart.onclick = () => {
        if (btnStart.disabled) return;
        const m = parseInt(inpMax.value);
        if (!isNaN(m)) save(STORAGE.MAX, m);
        else save(STORAGE.MAX, Infinity);
        const arr = inpTar.value
            .split(/[\n,，;；\s]+/)
            .map(s => s.trim())
            .filter(s => s && /^https?:\/\//.test(s));
        if (arr.length) save(STORAGE.TARGETS, JSON.stringify(Array.from(new Set(arr))));
        save(STORAGE.IDX, -1);
        setLoopCount(0);
        save(STORAGE.RUN, true);
        lblLoop.textContent = '進入目標網址: 0 次';
        updateStatus('運行中');
        updateButtonState();
        simulate();
    };
    btnStop.onclick = () => {
        if (btnStop.disabled) return;
        stop();
    };

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

    // --- SPA 導覽偵測 ---
    ['pushState', 'replaceState'].forEach(fn => {
        const orig = history[fn];
        history[fn] = function() {
            orig.apply(this, arguments);
            window.dispatchEvent(new Event('urlchange'));
        };
    });
    window.addEventListener('popstate', () => window.dispatchEvent(new Event('urlchange')));
    window.addEventListener('urlchange', () => {
        updateButtonState();
        load(STORAGE.RUN, false) && simulate();
    });
    window.addEventListener('load', () => setTimeout(() => {
        updateButtonState();
        load(STORAGE.RUN, false) && simulate();
    }, 800));

    lblLoop.textContent = '進入目標網址: ' + getLoopCount() + ' 次';
    updateButtonState();

    // --- 429自我恢復 ---
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
            return Promise.reject(e);
        }
        if (resp.status === 401 || resp.status === 429) {
            const state = {
                targets: load(STORAGE.TARGETS),
                idx:     load(STORAGE.IDX),
                home:    inpHome.value,
                loop:    getLoopCount(),
                max:     load(STORAGE.MAX),
            };
            localStorage.setItem('ThreadsV721_RECOVER', JSON.stringify(state));
            window.open(location.origin + '?recover=1', '_blank');
            setTimeout(() => window.close(), 500);
            return resp;
        }
        if ((url.includes('/graphql/query') || url.includes('/api/graphql')) && init.method === 'POST') {
            console.log('[ThreadsV721] GraphQL 200 OK:', url, 'Payload:', init.body);
        }
        return resp;
    };

    // --- 啟動時自動恢復 ---
    const recover = new URLSearchParams(location.search).get('recover');
    const state = localStorage.getItem('ThreadsV721_RECOVER');
    if (recover && state) {
        try {
            const o = JSON.parse(state);
            save(STORAGE.TARGETS, o.targets);
            save(STORAGE.IDX, o.idx);
            save(STORAGE.HOME, o.home);
            setLoopCount(o.loop);
            save(STORAGE.MAX, o.max);
            localStorage.removeItem('ThreadsV721_RECOVER');
            save(STORAGE.RUN, true);
            updateButtonState();
            runner();
            lblStatus.textContent += '（自動恢復）';
        } catch (e) { console.error('恢復狀態失敗', e); }
    } else {
        updateButtonState();
    }
})();
