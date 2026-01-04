// ==UserScript==
// @name         Hospital Timer Everywhere
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.3
// @description  Uses your API key to show a timer for remaining hospital time across all pages with configurable alert time
// @author       Weav3r
// @match        https://www.torn.com/*
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/542484/Hospital%20Timer%20Everywhere.user.js
// @updateURL https://update.greasyfork.org/scripts/542484/Hospital%20Timer%20Everywhere.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_URL = 'https://api.torn.com/user/';
    let isRunning = false, isAlertActive = false, alertTime = 300, apiFreq = 60;
    let displayEl, barEl, alertRowEl, countdownTimer, staticTextEl, timerEl;
    let updateTimeout = null;
    let pollingInterval = null;

    const store = {
        get: (k, def = null) => {
            try {
                return JSON.parse(localStorage.getItem(`hospTimer_${k}`)) ?? def;
            } catch {
                return localStorage.getItem(`hospTimer_${k}`) ?? def;
            }
        },
        set: (k, v) => localStorage.setItem(`hospTimer_${k}`, JSON.stringify(v)),
        del: (k) => localStorage.removeItem(`hospTimer_${k}`)
    };

    const showSettings = type => {
        const current = store.get(`${type}Time`, type === 'alert' ? 300 : 60);
        const m = Math.floor(current / 60), s = current % 60;
        const input = prompt(`Set ${type} time (seconds) - Current: ${m ? `${m}m ${s}s` : `${s}s`}`, current);
        if (input !== null) {
            const val = +input;
            if (!isNaN(val) && val >= (type === 'alert' ? 0 : 30)) {
                store.set(`${type}Time`, val);
                if (type === 'alert') {
                    alertTime = val;
                } else {
                    apiFreq = val;
                    if (isRunning) {
                        stopUpdates();
                        startUpdates();
                    }
                }
                alert(`${type} time set to ${val}s`);
            }
        }
    };

    const validateKey = async k => {
        try {
            const r = await fetch(`${API_URL}?key=${k}&comment=HospTimer&selections=basic`);
            const d = await r.json();
            return d.error ? { valid: false, error: d.error.error } : { valid: true, data: d };
        } catch { return { valid: false, error: 'Network error' }; }
    };

    const promptKey = () => {
        const k = prompt('Enter Torn API key:');
        if (k?.trim()) {
            validateKey(k.trim()).then(r => {
                if (r.valid) {
                    store.set('key', k.trim());
                    update();
                    startUpdates();
                } else {
                    alert(`Invalid: ${r.error}`);
                    promptKey();
                }
            });
        }
    };

    const fmt = s => {
        const hours = Math.floor(s/3600);
        const minutes = Math.floor(s%3600/60);

        if (s < 60) {
            return 'less than 1m';
        }

        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
    };

    const toggleAlertRow = show => {
        if (show && !alertRowEl) {
            if (!barEl) return;
            alertRowEl = document.createElement('div');
            alertRowEl.id = 'hospital-alert-row';

            const barHeight = barEl.offsetHeight;
            alertRowEl.style.cssText = `width:100%;background:#d32f2f;color:white;padding:6px 0;text-align:center;font-size:13px;font-weight:bold;position:sticky;top:${barHeight}px;z-index:999;`;

            const createBtn = (text, url) => {
                const btn = document.createElement('button');
                btn.textContent = text;
                btn.style.cssText = 'background:#fff;color:#d32f2f;border:none;padding:2px 8px;margin:0 5px;border-radius:3px;cursor:pointer;font-size:11px;';
                btn.onclick = () => window.open(url, '_blank');
                return btn;
            };
            alertRowEl.append('Hospital ending soon! ', createBtn('Your Items', 'https://www.torn.com/item.php'), createBtn('Faction Medical', 'https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=medical'));
            barEl.parentNode.insertBefore(alertRowEl, barEl.nextSibling);
        } else if (!show && alertRowEl) {
            alertRowEl.remove();
            alertRowEl = null;
        }
    };

    const stopCountdown = () => {
        if (countdownTimer) {
            clearTimeout(countdownTimer);
            countdownTimer = null;
        }
    };

    const countdown = (until, details) => {
        if (!displayEl || !barEl) return;
        stopCountdown();
        isAlertActive = false;

        staticTextEl.textContent = `Hospital: ${details} - `;

        const tick = () => {
            const left = Math.max(0, until - Math.floor(Date.now() / 1000));
            if (left > 0) {
                timerEl.textContent = fmt(left);
                const shouldAlert = left <= alertTime;
                if (shouldAlert !== isAlertActive) {
                    isAlertActive = shouldAlert;
                    barEl.style.animation = shouldAlert ? 'hospTimer-flash 1s infinite' : '';
                    toggleAlertRow(shouldAlert);
                }
                countdownTimer = setTimeout(tick, 60000);
            } else {
                staticTextEl.textContent = 'Hospital time completed!';
                timerEl.textContent = '';
                barEl.style.animation = '';
                store.del('status');
                isAlertActive = false;
                toggleAlertRow(false);
                stopUpdates();
                startUpdates();
            }
        };
        tick();
    };

    const stopUpdates = () => {
        isRunning = false;
        if (updateTimeout) {
            clearTimeout(updateTimeout);
            updateTimeout = null;
        }
    };

    const stopPolling = () => {
        if (pollingInterval) {
            clearInterval(pollingInterval);
            pollingInterval = null;
        }
    };

    const cleanup = () => {
        stopUpdates();
        stopCountdown();
        toggleAlertRow(false);
        stopPolling();
    };

    const update = async (force = false) => {
        if (!displayEl) return;
        const key = store.get('key');
        if (!key) {
            staticTextEl.textContent = 'No API key - Click to set';
            timerEl.textContent = '';
            displayEl.style.cursor = 'pointer';
            displayEl.onclick = promptKey;
            return;
        }

        if (!force) {
            const cached = store.get('status');
            if (cached?.status) {
                const { status } = cached;
                if (status.state === 'Hospital') {
                    const left = Math.max(0, status.until - Math.floor(Date.now() / 1000));
                    if (left > 0) {
                        countdown(status.until, status.details);
                        displayEl.style.cursor = 'default';
                        displayEl.onclick = null;
                        return;
                    }
                    store.del('status');
                } else {
                    staticTextEl.textContent = 'Not in hospital';
                    timerEl.textContent = '';
                    displayEl.style.cursor = 'default';
                    displayEl.onclick = null;
                    return;
                }
            }
        }

        try {
            const r = await fetch(`${API_URL}?key=${key}&comment=HospTimer&selections=basic`);
            const d = await r.json();
            store.set('lastApiCall', Math.floor(Date.now() / 1000));
            if (d.error) {
                stopCountdown();
                staticTextEl.textContent = `API Error: ${d.error.error} - Click to fix`;
                timerEl.textContent = '';
                displayEl.style.cursor = 'pointer';
                displayEl.onclick = () => {
                    if (confirm('OK = New key, Cancel = Retry')) {
                        store.del('key');
                        store.del('status');
                        promptKey();
                    } else {
                        update(true);
                    }
                };
                return;
            }
            store.set('status', d);
            const { status } = d;
            if (status?.state === 'Hospital') {
                const left = Math.max(0, status.until - Math.floor(Date.now() / 1000));
                if (left > 0) {
                    countdown(status.until, status.details);
                } else {
                    staticTextEl.textContent = 'Hospital time completed!';
                    timerEl.textContent = '';
                    store.del('status');
                }
            } else {
                staticTextEl.textContent = 'Not in hospital';
                timerEl.textContent = '';
            }
            displayEl.style.cursor = 'default';
            displayEl.onclick = null;
        } catch {
            stopCountdown();
            staticTextEl.textContent = 'Network error - Click to retry';
            timerEl.textContent = '';
            displayEl.style.cursor = 'pointer';
            displayEl.onclick = () => update(true);
        }
    };

    const startUpdates = async () => {
        if (isRunning) return;
        isRunning = true;

        const lastApiCall = store.get('lastApiCall', 0);
        const timeSinceLastCall = Math.floor(Date.now() / 1000) - lastApiCall;

        if (timeSinceLastCall >= apiFreq) {
            await update(true);
        } else {
            await update(false);
        }

        scheduleNextUpdate();
    };

    const scheduleNextUpdate = () => {
        if (!isRunning) return;

        if (updateTimeout) {
            clearTimeout(updateTimeout);
        }

        const lastApiCall = store.get('lastApiCall', 0);
        const timeSinceLastCall = Math.floor(Date.now() / 1000) - lastApiCall;
        const timeUntilNextCall = Math.max(1, apiFreq - timeSinceLastCall) * 1000;

        updateTimeout = setTimeout(async () => {
            if (isRunning) {
                await update(true);
                scheduleNextUpdate();
            }
        }, timeUntilNextCall);
    };

    const init = () => {
        if (barEl) return;
        const wrapper = document.querySelector('.content-wrapper');
        if (!wrapper) return;

        const style = document.createElement('style');
        style.textContent = `@keyframes hospTimer-flash{0%{background-color:#333}50%{background-color:#d32f2f}100%{background-color:#333}}#hospital-timer{border-bottom:2px solid #555!important;box-shadow:0 2px 4px rgba(0,0,0,0.2)}`;
        document.head.appendChild(style);

        barEl = document.createElement('div');
        barEl.id = 'hospital-timer';
        barEl.className = 'cont-gray top-round';
        barEl.style.cssText = 'width:100%;position:sticky;top:0;z-index:1000;margin:0;padding:8px 0;text-align:center;font-size:14px;font-weight:bold';

        displayEl = document.createElement('span');
        displayEl.id = 'timer-display';

        staticTextEl = document.createElement('span');
        timerEl = document.createElement('span');

        displayEl.appendChild(staticTextEl);
        displayEl.appendChild(timerEl);

        staticTextEl.textContent = 'Loading...';

        const createBtn = (svg, pos, title, action) => {
            const btn = document.createElement('span');
            btn.innerHTML = svg;
            btn.style.cssText = `position:absolute;cursor:pointer;opacity:0.7;padding:0;width:14px;height:14px;display:flex;align-items:center;justify-content:center;right:${pos}px;top:50%;transform:translateY(-50%);`;
            btn.title = title;
            btn.onclick = action;
            return btn;
        };

        barEl.append(displayEl,
            createBtn('<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>', 28, 'Alert Settings', () => showSettings('alert')),
            createBtn('<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>', 8, 'API Frequency', () => showSettings('api'))
        );
        wrapper.insertBefore(barEl, wrapper.firstChild);

        alertTime = store.get('alertTime', 300);
        apiFreq = store.get('apiTime', 60);
        startUpdates();
    };

    const checkAndInit = () => {
        if (!document.querySelector('#hospital-timer') && document.querySelector('.content-wrapper')) {
            init();
        }
    };

    const startPolling = () => {
        stopPolling();

        checkAndInit();

        pollingInterval = setInterval(checkAndInit, 1000);
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('pagehide', cleanup);

    startPolling();
})();
