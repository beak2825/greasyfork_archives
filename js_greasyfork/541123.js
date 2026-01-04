// ==UserScript==
// @name         Proton 用户名自动检测
// @namespace    https://account.proton.me
// @version      10.11.1
// @author       Riki
// @license      CC-BY-4.0
// @description  【逻辑重构】真正的“双向奔赴”模式：正序递增，倒序递减。确保两个账号同时扫描时完全互补，不会重叠。
// @match        https://account.proton.me/*/mail/signup*
// @match        https://account.proton.me/signup*
// @match        https://account.proton.me/*/signup*
// @match        https://account.proton.me/mail/signup*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541123/Proton%20%E7%94%A8%E6%88%B7%E5%90%8D%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541123/Proton%20%E7%94%A8%E6%88%B7%E5%90%8D%E8%87%AA%E5%8A%A8%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置中心 ---
    const CONFIG = {
        MAX_LOG_DOM_NODES: 500,
        BATCH_REMOVE_COUNT: 50,
        REQUEST_TIMEOUT_MS: 15000,
        MAX_RETRIES: 3,
        INITIAL_RETRY_DELAY_MS: 1000,
        BASE_DELAY_MS: 1500,
        RANDOM_DELAY_MS: 2000,
        SPEED_UPDATE_INTERVAL_MS: 500,
        TIMES_GOAL: 100
    };

    // --- 全局状态 ---
    let state = {
        isRunning: false,
        stopReason: null,
        globalAbortController: null
    };

    // --- 核心字符集 (统一标准) ---
    // 为了保证正序和倒序在同一个维度上，我们必须使用同一套字符集
    // 顺序：A-Z -> 0-9 -> 特殊符号
    const CHARS_ALL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_.-";
    // 尾字符集（Proton 不允许用户名以特殊符号结尾）
    const CHARS_LAST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    const BASE_ALL = CHARS_ALL.length;
    const BASE_LAST = CHARS_LAST.length;
    const CHARS_ALL_MAP = new Map(CHARS_ALL.split('').map((c, i) => [c, i]));
    const CHARS_LAST_MAP = new Map(CHARS_LAST.split('').map((c, i) => [c, i]));

    function createHeaders(uid) {
        return new Headers({
            "accept": "application/vnd.protonmail.v1+json",
            "x-pm-appversion": "web-account@5.0.255.0",
            "x-pm-locale": "zh_CN",
            "x-pm-ov": "lax",
            "x-pm-uid": uid
        });
    }

    function randomDelay() {
        return CONFIG.BASE_DELAY_MS + (Math.random() * CONFIG.RANDOM_DELAY_MS | 0);
    }

    async function abortableDelay(ms, signal) {
        try {
            await new Promise((resolve, reject) => {
                if (signal.aborted) return reject(new DOMException('Aborted', 'AbortError'));
                const timeoutId = setTimeout(() => {
                    signal.removeEventListener('abort', onAbort);
                    resolve();
                }, ms);
                const onAbort = () => {
                    clearTimeout(timeoutId);
                    reject(new DOMException('Aborted', 'AbortError'));
                };
                signal.addEventListener('abort', onAbort, { once: true });
            });
            return true;
        } catch (e) {
            return e.name !== 'AbortError';
        }
    }

    async function retryableFetch(url, options, { maxRetries, initialDelay, uiManager, globalSignal }) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            if (globalSignal.aborted) return { status: 'stopped' };
            const requestAbortController = new AbortController();
            const timeoutId = setTimeout(() => requestAbortController.abort('timeout'), CONFIG.REQUEST_TIMEOUT_MS);
            const onManualStop = () => requestAbortController.abort('manual');
            globalSignal.addEventListener('abort', onManualStop);

            try {
                const response = await fetch(url, { ...options, signal: requestAbortController.signal });
                if (response.status >= 500 && attempt < maxRetries) throw new Error(`Server error: ${response.status}`);
                return { status: response.status, ok: response.ok };
            } catch (error) {
                if (globalSignal.aborted || requestAbortController.signal.reason === 'manual') return { status: 'stopped' };
                if (attempt < maxRetries) {
                    const delay = initialDelay * (2 ** (attempt - 1));
                    uiManager.updateStatus(`请求重试(${attempt}/${maxRetries})...`, 'info');
                    if (!await abortableDelay(delay, globalSignal)) return { status: 'stopped' };
                    continue;
                }
                return { status: 'error', ok: false, error };
            } finally {
                clearTimeout(timeoutId);
                globalSignal.removeEventListener('abort', onManualStop);
            }
        }
        return { status: 'error', ok: false, error: new Error("Failed") };
    }

    // --- UI Logic ---
    const uiManager = {
        elements: {},
        init(panel) {
            this.elements = {
                startBtn: panel.querySelector("#pm-start-btn"),
                stopBtn: panel.querySelector("#pm-stop-btn"),
                statusEl: panel.querySelector("#pm-status"),
                progEl: panel.querySelector("#pm-progress"),
                currEl: panel.querySelector("#pm-current"),
                logEl: panel.querySelector("#pm-log-content"),
                uidInput: panel.querySelector("#pm-uid-input"),
                startInput: panel.querySelector("#pm-start-input"),
                speedEl: panel.querySelector("#pm-speed"),
                timesEl: panel.querySelector("#pm-times"),
                timesBar: panel.querySelector("#pm-times-bar"),
                container: panel.querySelector("#pm-times-bar-container"),
                orderToggle: panel.querySelector("#pm-order-toggle")
            };
        },
        setRunningState(running, reason = null) {
            state.isRunning = running;
            state.stopReason = running ? null : reason;
            const els = this.elements;
            els.startBtn.disabled = running;
            els.stopBtn.style.display = running ? 'inline-block' : 'none';
            els.stopBtn.disabled = !running;
            els.stopBtn.textContent = "■ Stop";
            els.uidInput.readOnly = running;
            els.startInput.readOnly = running;
            els.orderToggle.classList.toggle('disabled', running);
            els.container.style.display = running ? 'flex' : 'none';
            if (running) window.addEventListener('beforeunload', this.beforeUnloadHandler);
            else window.removeEventListener('beforeunload', this.beforeUnloadHandler);
        },
        updateStatus(text, styleKey = 'info') {
            const styles = {
                error: '#ff5252', info: '#abb2bf', success: '#61afef', stopped: '#ffab40', goal: '#40c4ff'
            };
            this.elements.statusEl.textContent = text;
            this.elements.statusEl.style.color = styles[styleKey] || styles.error;
        },
        updateProgress(current, total, order) {
            // 如果是倒序，显示逻辑稍微变一下，让用户知道在倒数
            const icon = order === 'backward' ? '⬇️' : '⬆️';
            this.elements.progEl.textContent = `${icon} ${current.toLocaleString()} / ${total.toLocaleString()}`;
        },
        updateCurrentName(name) { this.elements.currEl.textContent = name; },
        updateSpeed(speed) { this.elements.speedEl.textContent = `${speed.toFixed(2)} req/s`; },
        updateTimes(count, goal) {
            this.elements.timesEl.textContent = `${count} / ${goal}`;
            this.elements.timesBar.style.width = `${Math.min((count / goal) * 100, 100)}%`;
        },
        appendLog(text, styleKey = 'info') {
            const icons = {
                200: '✅', 409: '❌', 401: '🔑', 429: '🚫', error: '⚠️', info: 'ℹ️', success: '📁', stopped: '🛑', goal: '🏆'
            };
            const colors = {
                200: '#76ff03', 409: '#ffab40', 401: '#ff5252', 429: '#ffeb3b', error: '#ff5252', info: '#abb2bf', success: '#61afef', stopped: '#ffab40', goal: '#40c4ff'
            };
            if (this.elements.logEl.childElementCount >= CONFIG.MAX_LOG_DOM_NODES) {
                for (let i = 0; i < CONFIG.BATCH_REMOVE_COUNT; i++) this.elements.logEl.firstChild?.remove();
            }
            const div = document.createElement("div");
            div.style.color = colors[styleKey] || colors.error;
            div.textContent = `${icons[styleKey] || icons.info} ${text}`;
            this.elements.logEl.appendChild(div);
            this.elements.logEl.scrollTop = this.elements.logEl.scrollHeight;
        },
        beforeUnloadHandler: (e) => { e.preventDefault(); e.returnValue = ''; },
        clearLog() { this.elements.logEl.innerHTML = ''; }
    };

    function createPanel() {
        if (document.getElementById("pm-batch-panel")) return;
        const panel = document.createElement("div");
        panel.id = "pm-batch-panel";
        Object.assign(panel.style, {
            position: "fixed", bottom: "20px", right: "20px", width: "380px",
            background: "#282c34", color: "#abb2bf", padding: "15px", borderRadius: "10px",
            fontSize: "13px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", zIndex: 999999,
            fontFamily: "'Segoe UI', 'Roboto', sans-serif"
        });

        panel.innerHTML = `
      <style>
        .pm-btn { padding: 6px 14px; border: none; border-radius: 5px; cursor: pointer; font-weight: bold; }
        .pm-btn:disabled { cursor: not-allowed; opacity: 0.6; }
        .pm-btn-start { background: #4CAF50; color: white; }
        .pm-btn-stop { background: #f44336; color: white; display: none; }
        .pm-input { width: 100%; padding: 6px; border-radius: 4px; border: 1px solid #444; background: #333; color: #fff; box-sizing: border-box; }
        .pm-toggle-btn { background: transparent; border: none; color: #abb2bf; padding: 4px 12px; border-radius: 5px; cursor: pointer; font-size: 12px; font-weight: 500; transition: all 0.25s; }
        .pm-toggle-btn.active { background: #3B82F6; color: #ffffff; font-weight: bold; }
      </style>
      <div style="display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 10px; margin-bottom: 12px;">
        <label>UID：</label>
        <input id="pm-uid-input" type="text" maxlength="50" class="pm-input" placeholder="自动获取或粘贴">
        <label>起始：</label>
        <div style="display: flex; align-items: center;">
            <input id="pm-start-input" type="text" class="pm-input" style="max-width: 100px; flex-shrink: 0;" placeholder="AAAA">
            <div id="pm-order-toggle" data-order="forward" style="margin-left: 15px; background: #3a3f4b; border-radius: 6px; padding: 2px;">
                <button id="pm-order-forward-btn" class="pm-toggle-btn active">正序 (+1)</button>
                <button id="pm-order-backward-btn" class="pm-toggle-btn">倒序 (-1)</button>
            </div>
        </div>
      </div>
      <div style="margin-bottom: 12px; display:flex; gap: 10px;">
        <button id="pm-start-btn" class="pm-btn pm-btn-start">▶ Start</button>
        <button id="pm-stop-btn" class="pm-btn pm-btn-stop">■ Stop</button>
        <span id="pm-status" style="margin-left: auto; align-self: center;">Ready</span>
      </div>
      <div style="margin-bottom: 10px; display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; justify-content: space-between;">
          <span>Prog: <span id="pm-progress">0 / 0</span></span>
          <span><span id="pm-speed">0.00 req/s</span></span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>Curr: <span id="pm-current">-</span></span>
          <div id="pm-times-bar-container" style="display: none; align-items: center; gap: 8px;">
            <span style="font-size:11px;">Hit: <span id="pm-times">0</span></span>
            <div style="width: 80px; height: 6px; background: #444; border-radius: 3px; overflow: hidden;">
              <div id="pm-times-bar" style="width: 0%; height: 100%; background: #4CAF50; transition: width 0.3s;"></div>
            </div>
          </div>
        </div>
      </div>
      <div id="pm-log-container" style="border-top:1px solid #444; padding-top:10px;">
          <div id="pm-log-content" style="height:120px; overflow-y:auto; font-size:12px; line-height:1.5; font-family: 'Fira Code', monospace;"></div>
      </div>
    `;
        document.body.appendChild(panel);
        uiManager.init(panel);

        const toggleContainer = panel.querySelector('#pm-order-toggle');
        const btns = {
            forward: panel.querySelector('#pm-order-forward-btn'),
            backward: panel.querySelector('#pm-order-backward-btn')
        };

        const setOrder = (order) => {
            if (state.isRunning) return;
            btns.forward.classList.toggle('active', order === 'forward');
            btns.backward.classList.toggle('active', order === 'backward');
            toggleContainer.dataset.order = order;
        };

        btns.forward.onclick = () => setOrder('forward');
        btns.backward.onclick = () => setOrder('backward');

        loadSettings(setOrder);

        uiManager.elements.startBtn.onclick = () => {
            runBatch(uiManager.elements.uidInput.value.trim(), uiManager.elements.startInput.value.trim().toUpperCase());
        };
        uiManager.elements.stopBtn.onclick = () => {
            uiManager.elements.stopBtn.textContent = "Stopping...";
            state.globalAbortController?.abort();
        };
    }

    function saveSettings(settings) {
        if (settings.startFrom) localStorage.setItem('pm_checker_last_start', settings.startFrom);
        if (settings.order) localStorage.setItem('pm_checker_order', settings.order);
    }

    function loadSettings(setOrderCallback) {
        const autoUid = sessionStorage.getItem('ua_uid');
        if (autoUid) uiManager.elements.uidInput.value = autoUid;
        const lastStart = localStorage.getItem('pm_checker_last_start');
        if (lastStart) uiManager.elements.startInput.value = lastStart;
        const lastOrder = localStorage.getItem('pm_checker_order');
        if (lastOrder) setOrderCallback(lastOrder);
    }

    // --- 核心逻辑 ---

    function localNameToIndex(name) {
        const len = name.length;
        if (len === 0) return 0;
        const lastChar = name[len - 1];
        if (!CHARS_LAST_MAP.has(lastChar)) throw new Error("用户名末尾字符无效");
        for (let i = 0; i < len - 1; i++) {
            if (!CHARS_ALL_MAP.has(name[i])) throw new Error(`非法字符: ${name[i]}`);
        }
        let index = 0;
        for (let i = 0; i < len - 1; i++) {
            index = index * BASE_ALL + CHARS_ALL_MAP.get(name[i]);
        }
        index = index * BASE_LAST + CHARS_LAST_MAP.get(lastChar);
        return index;
    }

    function localIndexToName(index, length) {
        if (index < 0) return null; // 倒序越界保护
        const lastCharIndex = index % BASE_LAST;
        let name = CHARS_LAST[lastCharIndex];
        let remainingIndex = Math.floor(index / BASE_LAST);
        for (let i = 0; i < length - 1; i++) {
            const charIndex = remainingIndex % BASE_ALL;
            name = CHARS_ALL[charIndex] + name;
            remainingIndex = Math.floor(remainingIndex / BASE_ALL);
        }
        return name;
    }

    async function checkUsername(name, headers) {
        const url = new URL("https://account.proton.me/api/core/v4/users/available");
        url.searchParams.append('Name', name);
        url.searchParams.append('ParseDomain', '1');
        const { status } = await retryableFetch(url, { method: "GET", headers, credentials: "include" }, {
            maxRetries: CONFIG.MAX_RETRIES, initialDelay: CONFIG.INITIAL_RETRY_DELAY_MS,
            uiManager, globalSignal: state.globalAbortController.signal
        });
        const line = status === 'error' ? `${name} : Error` : `${name} : ${status}`;
        return { status, line };
    }

    async function runBatch(uid, startFrom) {
        if (state.isRunning) return;
        if (!/^[a-zA-Z0-9-]{10,50}$/.test(uid)) return uiManager.updateStatus("UID 无效", 'error');
        if (!startFrom) return uiManager.updateStatus("请输入起始用户名", 'error');

        const order = document.querySelector('#pm-order-toggle').dataset.order;
        uiManager.setRunningState(true);
        state.globalAbortController = new AbortController();
        uiManager.clearLog();
        uiManager.updateStatus("Running...", 'info');

        const runLength = startFrom.length;
        // 计算总空间：比如4位数的总可能性
        const totalForLength = runLength > 0 ? Math.pow(BASE_ALL, runLength - 1) * BASE_LAST : 0;
        
        let startLocalIndex;
        try { startLocalIndex = localNameToIndex(startFrom); }
        catch (e) { uiManager.setRunningState(false); return uiManager.updateStatus(e.message, 'error'); }

        let localCurrentIndex = startLocalIndex;
        let results = [];
        let lastChecked = null;
        let requestCount = 0;
        let successfulChecks = 0;
        let goalReached = false;
        const startTime = performance.now();
        const headers = createHeaders(uid);

        uiManager.updateTimes(0, CONFIG.TIMES_GOAL);

        try {
            while (state.isRunning) {
                // [边界检查] 
                // 正序：不能超过最大值
                if (order === 'forward' && localCurrentIndex >= totalForLength) {
                    state.stopReason = 'complete'; break; 
                }
                // 倒序：不能小于0
                if (order === 'backward' && localCurrentIndex < 0) {
                    state.stopReason = 'complete'; break; 
                }

                const name = localIndexToName(localCurrentIndex, runLength);
                if (!name) break; // 双重保险

                lastChecked = name;
                uiManager.updateProgress(localCurrentIndex, totalForLength, order);
                uiManager.updateCurrentName(name);

                const { status, line } = await checkUsername(name, headers);
                if (status === 'stopped') { state.stopReason = 'manual'; break; }
                
                results.push(line);
                uiManager.appendLog(line, status);
                requestCount++;

                if (status === 200 || status === 409) {
                    successfulChecks++;
                    uiManager.updateTimes(successfulChecks, CONFIG.TIMES_GOAL);
                    if (successfulChecks >= CONFIG.TIMES_GOAL && !goalReached) {
                        uiManager.appendLog(`目标达成 (${CONFIG.TIMES_GOAL})`, 'goal');
                        goalReached = true;
                    }
                } else if (status === 401 || status === 429 || status === 'error') {
                    state.stopReason = 'error';
                    uiManager.appendLog(`异常中止: ${name}`, 'error');
                    break;
                }

                // [核心修改] 根据模式决定是递增还是递减
                if (order === 'forward') {
                    localCurrentIndex++;
                } else {
                    localCurrentIndex--;
                }

                const elapsed = (performance.now() - startTime) / 1000;
                if (elapsed > 0.5) uiManager.updateSpeed(requestCount / elapsed);

                if (state.isRunning && !await abortableDelay(randomDelay(), state.globalAbortController.signal)) {
                    state.stopReason = 'manual';
                }
            }
            if (state.isRunning) state.stopReason = 'complete';
        } finally {
            uiManager.setRunningState(false, state.stopReason);
            uiManager.updateStatus(state.stopReason === 'complete' ? 'Done' : 'Stopped', state.stopReason === 'error' ? 'error' : 'stopped');
            
            // 保存进度：如果是倒序，下次启动默认还是从当前位置开始（方便断点续传）
            // 但如果是完成状态，重置为 0 或 Max 可能会比较方便，这里保持保存“下一个待检测”的逻辑
            let nextName = localIndexToName(localCurrentIndex, runLength);
            // 倒序如果跑到头了(-1)，就存不下来了，存个 startFrom 吧
            if (!nextName && order === 'backward') nextName = startFrom; 
            
            saveSettings({ startFrom: nextName || startFrom, order });

            if (results.length > 0) {
                const blob = new Blob([results.join('\n')], { type: "text/plain;charset=utf-8" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `Proton_${startFrom}_to_${lastChecked}.txt`;
                document.body.appendChild(a); a.click(); a.remove();
            }
        }
    }

    window.addEventListener("load", () => setTimeout(createPanel, 500));
})();