// ==UserScript==
// @name         Threads 免登入 5.5 (增強Token與錯誤處理)
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  支援多目標、自訂首頁、手動Token、增強429/401處理、GraphQL錯誤檢查的 Threads 自動瀏覽腳本
// @author       ChatGPT & Gemini
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
// @downloadURL https://update.greasyfork.org/scripts/536513/Threads%20%E5%85%8D%E7%99%BB%E5%85%A5%2055%20%28%E5%A2%9E%E5%BC%B7Token%E8%88%87%E9%8C%AF%E8%AA%A4%E8%99%95%E7%90%86%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536513/Threads%20%E5%85%8D%E7%99%BB%E5%85%A5%2055%20%28%E5%A2%9E%E5%BC%B7Token%E8%88%87%E9%8C%AF%E8%AA%A4%E8%99%95%E7%90%86%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('[ThreadsV55] script loaded');
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
    try {
        Object.defineProperty(navigator, 'userAgent', { get: () => baseUA + UA_SUFFIX[Math.floor(Math.random() * UA_SUFFIX.length)] });
    } catch (e) {
        console.warn('[ThreadsV55] Failed to modify userAgent:', e);
    }

    // MOD: Point 1 - Enhanced Access Token Acquisition
    let currentTokenSource = null; // 'manual' or 'bootstrap'

    function getAccessToken() {
        const manualToken = GM_getValue(STORAGE.MANUAL_TOKEN, null);
        if (manualToken) {
            currentTokenSource = 'manual';
            console.log('[ThreadsV55] Using manual access token.');
            return manualToken;
        }
        try {
            const boot = window.__bootstrapSharedData || window.__INIT_DATA || {};
            const token = boot.config?.accessToken || boot.accessToken || null;
            if (token) {
                currentTokenSource = 'bootstrap';
                console.log('[ThreadsV55] Using bootstrap access token.');
                return token;
            }
        } catch (e) {
            console.warn('[ThreadsV55] Error accessing bootstrap data for token:', e);
        }
        currentTokenSource = null;
        return null;
    }

    // --- 攔截 fetch ---
    const origFetch = window.fetch;
    // MOD: Point 2 - Global variable for rate limiting timestamp
    let throttleUntil = 0;

    window.fetch = async function(resource, init = {}) {
        const url = typeof resource === 'string' ? resource : resource.url;
        init.credentials = 'include'; // Keep credentials inclusion

        const token = getAccessToken();
        if (token) {
            init.headers = init.headers || {};
            init.headers.Authorization = 'Bearer ' + token;
        }

        let resp;
        try {
            // MOD: Point 2 - Check throttle before making a request
            // This is a softer throttle check within fetch; the main one is in simulate()
            if (Date.now() < throttleUntil) {
                console.log(`[ThreadsV55] Fetch throttled, waiting for ${Math.ceil((throttleUntil - Date.now())/1000)}s before this fetch.`);
                await wait(throttleUntil - Date.now());
            }
            resp = await origFetch(resource, init);
        } catch (e) {
            // MOD: Point 2 - Network error feedback
            console.error('[ThreadsV55] Fetch Network Error:', e);
            updateStatus('網路錯誤，請檢查連線');
            notify('網路錯誤', `請求 ${url} 失敗: ${e.message}`);
            return Promise.reject(e); // Propagate network errors
        }

        // MOD: Point 2 - Refined 401/429 handling
        if (resp.status === 401) {
            console.warn(`[ThreadsV55] 401 Unauthorized for URL: ${url}`);
            if (currentTokenSource === 'manual') {
                GM_setValue(STORAGE.MANUAL_TOKEN, ''); // Clear invalid manual token
                updateStatus('手動 Token 失效，已清除');
                notify('Token 錯誤', '手動提供的 Access Token 已失效並被清除，請重新設定。');
            } else if (currentTokenSource === 'bootstrap') {
                updateStatus('頁面 Token 失效');
                notify('Token 錯誤', '頁面提供的 Access Token 已失效。');
            } else {
                updateStatus('驗證失敗 (401)');
                notify('驗證失敗', '請求未經授權，請檢查 Token。');
            }
            stop(); // Stop the script on auth failure
            return resp; // Return original response to avoid breaking promise chain
        }

        if (resp.status === 429) {
            const retryAfterSeconds = parseInt(resp.headers.get('Retry-After')) || 60; // Default to 60s
            throttleUntil = Date.now() + retryAfterSeconds * 1000;
            const throttleMsg = `遇到伺服器頻率限制 (429)，將於 ${retryAfterSeconds} 秒後自動繼續。`;
            console.warn(`[ThreadsV55] ${throttleMsg} URL: ${url}`);
            updateStatus(throttleMsg);
            notify('頻率限制', `伺服器要求等待 ${retryAfterSeconds} 秒`, 6000);
            return resp; // Return original response
        }

        // MOD: Point 2 - GraphQL error field check
        if ((url.includes('/graphql/query') || url.includes('/api/graphql')) && init.method === 'POST' && resp.ok) {
            try {
                const clonedResp = resp.clone();
                const data = await clonedResp.json();
                if (data.errors && data.errors.length > 0) {
                    console.warn('[ThreadsV55] GraphQL API Error:', url, 'Payload:', init.body, 'Response Errors:', data.errors);
                    notify('GraphQL API 錯誤', `請求 ${url.substring(url.lastIndexOf('/')+1)} 回應包含錯誤。`, 4000)
                } else if (resp.status === 200) {
                     console.log('[ThreadsV55] GraphQL 200 OK:', url, 'Payload:', init.body);
                }
            } catch (e) {
                console.warn('[ThreadsV55] Error parsing GraphQL JSON response for error checking:', e);
            }
        } else if (resp.ok && (url.includes('/graphql/query') || url.includes('/api/graphql'))) {
            console.log(`[ThreadsV55] GraphQL non-POST or non-OK: ${resp.status}`, url);
        }
        return resp;
    };

    // --- 通知 ---
    function notify(title, text, timeout = 2000) { // Added timeout default
        if (typeof GM_notification === 'function') {
            GM_notification({ title: `[ThreadsV55] ${title}`, text, timeout });
        } else {
            console.log(`[ThreadsV55] ${title}: ${text}`);
        }
    }

    // --- 存取 Function ---
    const NS = 'ThreadsV55_'; // MOD: Version bump in namespace
    const STORAGE = {
        TARGETS: NS + 'TARGETS',
        IDX:     NS + 'IDX',
        HOME:    NS + 'HOME',
        RUN:     NS + 'RUN',
        LOOP:    NS + 'LOOP',
        MAX:     NS + 'MAX',
        MANUAL_TOKEN: NS + 'MANUAL_TOKEN' // MOD: Point 1 - Storage for manual token
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
        PAUSE:       [3000, 10000]
    };

    // --- UI Panel ---
    const PID = 'tm_threads_v55'; // MOD: Version bump in Panel ID
    if (document.getElementById(PID)) return;
    const panel = document.createElement('div'); panel.id = PID;
    Object.assign(panel.style, {
        position:   'fixed',
        top:        '10px',
        right:      '10px',
        background: '#fff',
        border:     '1px solid #ccc',
        padding:    '10px', // Increased padding
        fontSize:   '13px',
        zIndex:     9999,
        display:    'flex', // MOD: For better layout
        flexDirection: 'column', // MOD: For better layout
        gap: '5px' // MOD: Spacing between elements
    });
    const btnStart = document.createElement('button'); btnStart.textContent = '開始';
    const btnStop  = document.createElement('button'); btnStop.textContent  = '暫停';
    const inpMax   = document.createElement('input'); inpMax.type = 'number'; inpMax.placeholder = '最大循環(空=無限)'; inpMax.style.width = 'calc(100% - 10px)'; // Adjust width
    const inpHome  = document.createElement('input'); inpHome.placeholder = '首頁 URL'; inpHome.style.width = 'calc(100% - 10px)';
    const inpTar   = document.createElement('textarea'); inpTar.placeholder = '目標 URL(逗號分隔)'; inpTar.style.width = 'calc(100% - 10px)'; inpTar.style.height = '50px';

    // MOD: Point 1 - UI for Manual Token
    const inpManualToken = document.createElement('input'); inpManualToken.type = 'password'; inpManualToken.placeholder = '手動 Access Token (選填)'; inpManualToken.style.width = 'calc(100% - 10px)';
    const btnSaveToken = document.createElement('button'); btnSaveToken.textContent = '保存 Token';
    btnSaveToken.onclick = () => {
        const tokenToSave = inpManualToken.value.trim();
        if (tokenToSave) {
            save(STORAGE.MANUAL_TOKEN, tokenToSave);
            notify('Token 已保存', '手動 Access Token 已儲存。');
            inpManualToken.value = ''; // Clear after save
        } else {
            save(STORAGE.MANUAL_TOKEN, ''); // Clear stored token if input is empty
            notify('Token 已清除', '手動 Access Token 已清除。');
        }
    };
    const btnClearToken = document.createElement('button'); btnClearToken.textContent = '清除已存 Token';
    btnClearToken.onclick = () => {
        save(STORAGE.MANUAL_TOKEN, '');
        inpManualToken.value = '';
        notify('Token 已清除', '手動 Access Token 已清除。');
    };


    const lblStatus= document.createElement('div'); lblStatus.textContent = '狀態: 待命'; lblStatus.style.marginTop = '5px';
    const lblLoop  = document.createElement('div'); lblLoop.textContent   = '完整循環: 0';
    const lblCount = document.createElement('div'); lblCount.textContent  = '倒數: 0s';

    const buttonContainer = document.createElement('div'); // Container for buttons
    Object.assign(buttonContainer.style, { display: 'flex', gap: '5px'});
    buttonContainer.append(btnStart, btnStop);

    const tokenButtonContainer = document.createElement('div');
    Object.assign(tokenButtonContainer.style, { display: 'flex', gap: '5px', marginTop: '5px'});
    tokenButtonContainer.append(btnSaveToken, btnClearToken);

    panel.append(buttonContainer, inpMax, inpHome, inpTar, inpManualToken, tokenButtonContainer, lblStatus, lblLoop, lblCount);
    document.body.appendChild(panel);

    const updateStatus = s => {
        if (lblStatus) lblStatus.textContent = '狀態: ' + s;
        else console.log('[ThreadsV55] Status Update (lblStatus not found):', s);
    };


    inpHome.value = load(STORAGE.HOME, typeof location !== 'undefined' ? location.origin : '');
    inpTar.value  = load(STORAGE.TARGETS, JSON.stringify(typeof location !== 'undefined' ? [location.origin] : []))
                        .replace(/[[\]"]+/g, '')
                        .split(',')
                        .join(',\n'); // MOD: Newline for better readability in textarea
    inpManualToken.value = load(STORAGE.MANUAL_TOKEN, '') ? '********' : ''; // Indicate if token is stored


    function getTargets() {
        try {
            // MOD: Handle newline as separator as well for textarea input
            const rawTargets = load(STORAGE.TARGETS, '[]').replace(/\s*,\s*/g, ',').replace(/\s*\n\s*/g, ',');
            return JSON.parse(rawTargets.startsWith('[') ? rawTargets : `["${rawTargets.split(',').join('","')}"]`);
        } catch(e) {
            console.error("[ThreadsV55] Error parsing targets:", e, load(STORAGE.TARGETS, '[]'));
            return [];
        }
    }
    function getNext() {
        const list = getTargets();
        if (!list || list.length === 0) {
            updateStatus("錯誤：目標列表為空");
            notify("錯誤", "目標 URL 列表為空，請設定目標。");
            stop();
            return null;
        }
        let idx = load(STORAGE.IDX, -1);
        idx = (idx + 1) % list.length;
        save(STORAGE.IDX, idx);
        return list[idx];
    }
    function isTarget() {
        if (typeof location === 'undefined') return false;
        return getTargets().some(u => location.href.startsWith(u));
    }
    let visited = false;

    // --- 隨機滾動 ---
    async function scrollOnce() {
        const fast = Math.random() < 0.5;
        const scrollAmount = fast ? rand(...R.SCROLL_FAST) : rand(...R.SCROLL_SLOW);
        const currentScrollY = window.scrollY;
        const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;

        let direction;
        if (currentScrollY >= maxScrollY - 10) direction = -1; // 거의 끝에 도달하면 위로
        else if (currentScrollY <= 10) direction = 1;    // 거의 처음에 도달하면 아래로
        else direction = Math.random() < 0.7 ? 1 : -1; // 70% 확률로 아래로

        const targetY = Math.min(Math.max(0, currentScrollY + scrollAmount * direction), maxScrollY);

        window.scrollTo({ top: targetY, behavior: 'smooth' });
        await wait(fast ? rand(...R.WAIT_FAST) : rand(...R.WAIT_SLOW));
    }

    // --- 核心模擬流程 ---
    async function simulate() {
        if (!load(STORAGE.RUN, false)) return; // MOD: Ensure script should be running

        // MOD: Point 2 & 3 - Throttle check at the beginning of simulation step
        while (Date.now() < throttleUntil && load(STORAGE.RUN, false)) {
            const remainingThrottleSec = Math.ceil((throttleUntil - Date.now()) / 1000);
            updateStatus(`頻率限制中，剩餘 ${remainingThrottleSec} 秒`);
            lblCount.textContent = `等待: ${remainingThrottleSec}s`; // Update countdown for throttle
            await wait(1000);
        }
        if (!load(STORAGE.RUN, false)) { // Check again if script was stopped during throttle
            updateStatus('已停止 (節流期間)');
            return;
        }

        const tgt = isTarget(); if (tgt) visited = true;
        const pageTypeMsg = tgt ? '目標頁' : '首頁';
        updateStatus('瀏覽 ' + pageTypeMsg);
        notify('模擬', '開始 ' + pageTypeMsg, 1500);

        const duration = rand(...(tgt ? R.STAY : R.BROWSE));
        let rem = duration;
        lblCount.textContent = '倒數: ' + Math.ceil(rem / 1000) + 's';

        // Clear previous interval if any, though typically simulate() is not re-entrant in that way
        if (simulate.intervalId) clearInterval(simulate.intervalId);
        simulate.intervalId = setInterval(() => {
            rem -= 1000;
            // If still throttled, show throttle countdown, else show normal countdown
            if (Date.now() < throttleUntil) {
                const remainingThrottleSec = Math.ceil((throttleUntil - Date.now()) / 1000);
                lblCount.textContent = `等待: ${remainingThrottleSec}s`;
            } else {
                lblCount.textContent = '倒數: ' + (rem > 0 ? Math.ceil(rem / 1000) : 0) + 's';
            }
        }, 1000);

        const t0 = Date.now();
        while (Date.now() - t0 < duration && load(STORAGE.RUN, false)) {
            // MOD: Point 2 & 3 - Re-check throttle inside the loop as well
            if (Date.now() < throttleUntil) {
                await wait(1000); // Wait for throttle to pass, then continue scrolling or page logic
                continue; // Skip scrollOnce for this iteration
            }
            if (!document.hidden) { // MOD: Only scroll if document is visible
                await scrollOnce();
            } else {
                updateStatus('頁面非激活，暫停滾動');
                await wait(rand(...R.WAIT_SLOW)); // Wait longer if page is not visible
            }
        }
        clearInterval(simulate.intervalId);
        simulate.intervalId = null;
        lblCount.textContent = '倒數: 0s';

        if (!load(STORAGE.RUN, false)) {
            updateStatus('已停止');
            return;
        }

        await wait(rand(...R.PAUSE));

        // Check throttle again before navigation
        while (Date.now() < throttleUntil && load(STORAGE.RUN, false)) {
            const remainingThrottleSec = Math.ceil((throttleUntil - Date.now()) / 1000);
            updateStatus(`頻率限制中 (導航前)，剩餘 ${remainingThrottleSec} 秒`);
            await wait(1000);
        }
        if (!load(STORAGE.RUN, false)) {
            updateStatus('已停止 (導航前節流)');
            return;
        }


        const home = inpHome.value.trim() || (typeof location !== 'undefined' ? location.origin : 'https://www.threads.net');
        save(STORAGE.HOME, home);

        const nextTargetUrl = getNext();
        if (!nextTargetUrl && load(STORAGE.RUN, false)) { // If getNext returned null due to empty list
             updateStatus("錯誤：無法獲取下一個目標");
             stop(); // Stop the script
             return;
        }

        const nextNav = tgt ? home : nextTargetUrl;

        if (tgt && nextNav === home && visited) {
            let c = load(STORAGE.LOOP, 0) + 1;
            save(STORAGE.LOOP, c);
            lblLoop.textContent = '完整循環: ' + c;
            const m = parseInt(load(STORAGE.MAX, 'Infinity')); // Ensure MAX is int or Infinity
            if (m !== Infinity && c >= m) {
                notify('任務完成', `已達到最大循環次數 ${m}。`);
                stop(); return;
            }
            visited = false;
        }
        if (typeof location !== 'undefined' && nextNav) {
             location.href = nextNav;
        } else if (!nextNav) {
            updateStatus("錯誤：無導航目標");
            stop();
        }
    }

    function runner() {
        // MOD: Ensure simulate is not called if already stopping or throttled in a way that stops runner
        if (!load(STORAGE.RUN, false)) return Promise.resolve();
        return simulate().then(() => {
            if (load(STORAGE.RUN, false)) {
                // Add a small delay before calling runner again, esp if simulate was short
                return wait(100).then(runner);
            }
        }).catch(error => {
            console.error("[ThreadsV55] Error in runner chain:", error);
            updateStatus(`錯誤: ${error.message}`);
            stop(); // Stop on critical errors in the runner chain
        });
    }

    function stop() {
        save(STORAGE.RUN, false);
        if (simulate.intervalId) { // Clear interval from simulate
            clearInterval(simulate.intervalId);
            simulate.intervalId = null;
        }
        updateStatus('已停止');
        notify('停止', '腳本已停止運作。', 1500);
        btnStart.disabled = false;
    }

    btnStart.onclick = () => {
        const maxLoops = parseInt(inpMax.value);
        if (!isNaN(maxLoops) && maxLoops > 0) save(STORAGE.MAX, maxLoops);
        else save(STORAGE.MAX, 'Infinity'); // Store as string 'Infinity'

        // MOD: Allow comma and/or newline separated targets
        const targetsArray = inpTar.value
            .split(/[,;\n]+/) // Split by comma, semicolon, or newline
            .map(s => s.trim())
            .filter(s => s && s.startsWith('http')); // Ensure it's a valid URL
        
        if (targetsArray.length > 0) {
            save(STORAGE.TARGETS, JSON.stringify(targetsArray));
        } else {
            notify("設定錯誤", "目標 URL 列表為空或格式不正確，請至少設定一個有效的 URL。");
            updateStatus("錯誤: 無有效目標");
            return; // Don't start if no valid targets
        }
        
        const homeUrl = inpHome.value.trim();
        if (homeUrl && homeUrl.startsWith('http')) {
            save(STORAGE.HOME, homeUrl);
        } else {
            notify("設定錯誤", "首頁 URL 格式不正確。");
            updateStatus("錯誤: 無效首頁URL");
            return; // Don't start if home URL is invalid
        }


        save(STORAGE.IDX, -1); // Reset index
        save(STORAGE.LOOP, 0); // Reset loop count
        save(STORAGE.RUN, true);
        visited = false;
        throttleUntil = 0; // Reset throttle state on start
        lblLoop.textContent = '完整循環: 0';
        updateStatus('運行中');
        btnStart.disabled = true;
        runner();
    };
    btnStop.onclick = () => stop();

    // --- SPA 導覽偵測 ---
    // MOD: Point 3 - SPA navigation handling is largely by re-triggering simulate.
    // The throttle checks within simulate and its robust timer handling help.
    const originalPushState = history.pushState;
    history.pushState = function() {
        const result = originalPushState.apply(this, arguments);
        window.dispatchEvent(new Event('urlchange'));
        return result;
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function() {
        const result = originalReplaceState.apply(this, arguments);
        window.dispatchEvent(new Event('urlchange'));
        return result;
    };

    window.addEventListener('popstate', () => window.dispatchEvent(new Event('urlchange')));
    window.addEventListener('urlchange', () => {
        console.log('[ThreadsV55] URL changed (SPA navigation), re-evaluating simulate.');
        if (load(STORAGE.RUN, false)) {
            // Wait a brief moment for the page to potentially settle after URL change
            setTimeout(() => {
                 if (load(STORAGE.RUN, false)) simulate();
            }, 500);
        }
    });
    window.addEventListener('load', () => {
        if (load(STORAGE.RUN, false)) {
            console.log('[ThreadsV55] Window loaded, starting simulation if RUN is true.');
            setTimeout(() => {
                if (load(STORAGE.RUN, false)) simulate();
            }, 1000);
        }
    });

    // Initial status update if panel is already there (e.g. script reload)
    if(document.getElementById(PID)) {
         if (load(STORAGE.RUN, false)) {
            updateStatus("運行中 (重載)");
            btnStart.disabled = true;
         } else {
            updateStatus("待命 (重載)");
         }
    }
})();