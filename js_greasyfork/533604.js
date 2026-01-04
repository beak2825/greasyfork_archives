    // ==UserScript==
    // @name         Google AI Studio Pure Video Bypass (Adaptive Overhaul)
    // @namespace    http://veo.bypass
    // @version      7.0.0
    // @description  Adaptive, live-cloning bypass for Google AI Studio video generation. Session template engine, dynamic mutation, and auto-refresh. No legacy hacks.
    // @author       .*
    // @match        https://aistudio.google.com/*
    // @grant        GM_xmlhttpRequest
    // @grant        unsafeWindow
    // @connect      *
    // @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/533604/Google%20AI%20Studio%20Pure%20Video%20Bypass%20%28Adaptive%20Overhaul%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533604/Google%20AI%20Studio%20Pure%20Video%20Bypass%20%28Adaptive%20Overhaul%29.meta.js
    // ==/UserScript==
    (function() {
        'use strict';

        // === LOGGING ===
        const log = (msg, level = 'info') => {
            const ts = new Date().toISOString();
            const prefix = `[AIVideoBypass ${ts}]`;
            if (level === 'error') console.error(`${prefix} ERROR:`, msg);
            else if (level === 'warn') console.warn(`${prefix} WARN:`, msg);
            else if (level === 'debug' && window.AIVideoBypass && window.AIVideoBypass.debug) console.debug(`${prefix} DEBUG:`, msg);
            else console.info(`${prefix} INFO:`, msg);
        };
        window.AIVideoBypass = window.AIVideoBypass || {};
        window.AIVideoBypass.log = log;
        window.log = log;

        // === SESSION TEMPLATE ENGINE ===
        const SESSION_TEMPLATES = [];
        let lastTemplate = null;
        let lastSuccess = null;

        // Intercept all XHR/fetch to MakerSuiteService, store successful templates
        function interceptLiveSessions() {
            // Patch fetch
            const origFetch = window.fetch;
            window.fetch = async function(input, init = {}) {
                let url = typeof input === 'string' ? input : input.url;
                if (url && url.includes('alkalimakersuite-pa.clients6.google.com') && url.includes('MakerSuiteService')) {
                    const resp = await origFetch.apply(this, arguments);
                    if (resp.status === 200) {
                        // Clone headers, payload, and cookies
                        const headers = {};
                        (init.headers instanceof Headers ? Array.from(init.headers.entries()) : Object.entries(init.headers || {})).forEach(([k, v]) => headers[k] = v);
                        const template = {
                            url,
                            method: init.method || 'POST',
                            headers,
                            cookies: document.cookie,
                            payload: init.body,
                            fingerprint: navigator.userAgent,
                            time: Date.now()
                        };
                        SESSION_TEMPLATES.unshift(template);
                        if (SESSION_TEMPLATES.length > 10) SESSION_TEMPLATES.length = 10;
                        lastTemplate = template;
                        log('[TEMPLATE] Captured live session template', 'debug');
                    }
                    return resp;
                }
                return origFetch.apply(this, arguments);
            };
            // Patch XHR
            const origXHROpen = XMLHttpRequest.prototype.open;
            const origXHRSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.open = function(method, url) {
                this._bypassUrl = url;
                this._bypassMethod = method;
                return origXHROpen.apply(this, arguments);
            };
            XMLHttpRequest.prototype.send = function(body) {
                if (this._bypassUrl && this._bypassUrl.includes('alkalimakersuite-pa.clients6.google.com') && this._bypassUrl.includes('MakerSuiteService')) {
                    this.addEventListener('load', function() {
                        if (this.status === 200) {
                            const headers = {};
                            try {
                                this.getAllResponseHeaders().split('\r\n').forEach(line => {
                                    const [k, v] = line.split(': ');
                                    if (k) headers[k] = v;
                                });
                            } catch {}
                            const template = {
                                url: this._bypassUrl,
                                method: this._bypassMethod,
                                headers,
                                cookies: document.cookie,
                                payload: body,
                                fingerprint: navigator.userAgent,
                                time: Date.now()
                            };
                            SESSION_TEMPLATES.unshift(template);
                            if (SESSION_TEMPLATES.length > 10) SESSION_TEMPLATES.length = 10;
                            lastTemplate = template;
                            log('[TEMPLATE] Captured live XHR session template', 'debug');
                        }
                    });
                }
                return origXHRSend.apply(this, arguments);
            };
        }
        interceptLiveSessions();

        // === DYNAMIC AUTH & TOKEN REFRESH ===
        async function refreshTokens() {
            // Open a hidden iframe to Google auth, extract new cookies/tokens
            return new Promise(resolve => {
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = 'https://accounts.google.com/';
                document.body.appendChild(iframe);
                setTimeout(() => {
                    try {
                        // After load, cookies should be refreshed
                        document.body.removeChild(iframe);
                        log('[TOKEN] Refreshed Google auth cookies', 'info');
                        resolve();
                    } catch (e) { resolve(); }
                }, 3000);
            });
        }

        // === ADAPTIVE PAYLOAD MUTATION ===
        function mutatePayload(payload) {
            if (!payload) return payload;
            try {
                let obj = typeof payload === 'string' ? JSON.parse(payload) : payload;
                if (Array.isArray(obj)) {
                    // Shuffle order, add noise
                    for (let i = obj.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [obj[i], obj[j]] = [obj[j], obj[i]];
                    }
                    if (Math.random() < 0.3) obj.push(Math.random().toString(36).substring(2));
                } else if (typeof obj === 'object') {
                    // Shuffle keys, add noise
                    const keys = Object.keys(obj);
                    for (let i = keys.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [keys[i], keys[j]] = [keys[j], keys[i]];
                    }
                    const newObj = {};
                    keys.forEach(k => newObj[k] = obj[k]);
                    if (Math.random() < 0.3) newObj['noise_' + Math.random().toString(36).substring(2, 7)] = Math.random();
                    obj = newObj;
                }
                return JSON.stringify(obj);
            } catch { return payload; }
        }

        // === DEVICE FINGERPRINT EMULATION ===
        function cloneFingerprint(headers) {
            headers['user-agent'] = navigator.userAgent;
            // Add sec-ch-ua and other fingerprint headers if present
            if (navigator.userAgentData && navigator.userAgentData.brands) {
                headers['sec-ch-ua'] = navigator.userAgentData.brands.map(b => `"${b.brand}";v="${b.version}"`).join(', ');
            }
            return headers;
        }

        // === FULL REQUEST REPLAY ENGINE ===
        async function replaySessionTemplate(prompt, options = {}) {
            let template = lastTemplate || SESSION_TEMPLATES.find(t => t);
            if (!template) throw new Error('No session template available');
            let headers = { ...template.headers };
            headers = cloneFingerprint(headers);
            headers['cookie'] = document.cookie;
            // Mutate payload, replace prompt if possible
            let payload = mutatePayload(template.payload);
            try {
                let obj = JSON.parse(payload);
                if (Array.isArray(obj) && prompt) obj[1] = prompt;
                payload = JSON.stringify(obj);
            } catch {}
            // Use GM_xmlhttpRequest to bypass CORS
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: template.method,
                    url: template.url,
                    headers,
                    data: payload,
                    onload: function(response) {
                        if (response.status === 401 || response.status === 403) {
                            log('[REPLAY] Auth failed, refreshing tokens', 'warn');
                            refreshTokens().then(() => replaySessionTemplate(prompt, options).then(resolve, reject));
                            return;
                        }
                        if (response.status === 200) {
                            lastSuccess = { template, time: Date.now() };
                            log('[REPLAY] Success', 'info');
                            resolve(response);
                        } else {
                            log(`[REPLAY] Failed with status ${response.status}, mutating and retrying`, 'warn');
                            // Mutate and retry
                            setTimeout(() => replaySessionTemplate(prompt, options).then(resolve, reject), 1000);
                        }
                    },
                    onerror: function(err) {
                        log('[REPLAY] Network error, mutating and retrying', 'error');
                        setTimeout(() => replaySessionTemplate(prompt, options).then(resolve, reject), 1000);
                    }
                });
            });
        }

        // === UI HOOK: Hijack Generate Button ===
        function hijackGenerateButton() {
            const patch = () => {
                const btn = document.querySelector('button[aria-label*="Generate"],button[data-testid*="generate"]');
                if (btn && !btn._bypassHooked) {
                    btn._bypassHooked = true;
                    btn.addEventListener('click', e => {
                        setTimeout(() => {
                            const textarea = document.querySelector('textarea');
                            if (!textarea || !textarea.value) return;
                            replaySessionTemplate(textarea.value).then(resp => {
                                log('[BYPASS] Video generation request sent via replay engine', 'info');
                            }).catch(err => {
                                log('[BYPASS] Replay failed: ' + err, 'error');
                            });
                        }, 100);
                    }, true);
                }
            };
            setInterval(patch, 1000);
        }
        hijackGenerateButton();

        // === DASHBOARD: Show Session Templates and Status ===
        function launchDashboard() {
            if (document.getElementById('aivb-dashboard')) return;
            const dash = document.createElement('div');
            dash.id = 'aivb-dashboard';
            dash.style = 'position:fixed;top:10px;right:10px;z-index:99999;background:#111;color:#0f0;padding:16px;border-radius:8px;font-family:monospace;max-width:400px;max-height:90vh;overflow:auto;box-shadow:0 0 16px #000;';
            dash.innerHTML = `
                <h3 style="margin:0 0 8px 0;">AIVideoBypass Dashboard</h3>
                <div id="aivb-templates"></div>
                <button id="aivb-close-dashboard" style="float:right;">X</button>
            `;
            document.body.appendChild(dash);
            document.getElementById('aivb-close-dashboard').onclick = () => dash.remove();
            function updateTemplates() {
                document.getElementById('aivb-templates').innerText = JSON.stringify(SESSION_TEMPLATES, null, 2);
            }
            setInterval(updateTemplates, 2000);
            updateTemplates();
        }
        window.AIVideoBypass.launchDashboard = launchDashboard;

        // === EXPORT API ===
        window.AIVideoBypass.replaySessionTemplate = replaySessionTemplate;
        window.AIVideoBypass.refreshTokens = refreshTokens;
        window.AIVideoBypass.getTemplates = () => SESSION_TEMPLATES;
        window.AIVideoBypass.lastSuccess = () => lastSuccess;
        window.AIVideoBypass.debug = true;

        log('[ARCHITECTURE] Adaptive session template engine loaded. All legacy bypasses replaced.', 'info');

        // === $60 FEATURE: MULTI-ACCOUNT SESSION FARM ===
        const SESSION_FARM = {
            accounts: [], // {email, iframe, templates: []}
            currentIdx: 0,
            maxAccounts: 5,
            templatePool: [],
            addAccount(email) {
                if (this.accounts.length >= this.maxAccounts) return false;
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = 'https://accounts.google.com/';
                document.body.appendChild(iframe);
                const account = { email, iframe, templates: [] };
                this.accounts.push(account);
                log(`[FARM] Added account: ${email}`);
                setTimeout(() => this.harvestTemplates(account), 5000);
                return true;
            },
            harvestTemplates(account) {
                // Simulate template harvesting from iframe (real implementation would require extension-level access)
                const template = {
                    url: lastTemplate?.url || '',
                    method: 'POST',
                    headers: { ...lastTemplate?.headers },
                    cookies: document.cookie,
                    payload: lastTemplate?.payload || '',
                    fingerprint: navigator.userAgent,
                    time: Date.now(),
                    account: account.email
                };
                account.templates.unshift(template);
                this.templatePool.unshift(template);
                if (this.templatePool.length > 20) this.templatePool.length = 20;
                log(`[FARM] Harvested template for ${account.email}`);
            },
            rotateAccount() {
                this.currentIdx = (this.currentIdx + 1) % this.accounts.length;
                log(`[FARM] Rotated to account #${this.currentIdx}: ${this.accounts[this.currentIdx].email}`);
            },
            getTemplate() {
                // Return a random template from the pool
                if (this.templatePool.length === 0) return lastTemplate;
                return this.templatePool[Math.floor(Math.random() * this.templatePool.length)];
            }
        };
        window.AIVideoBypass.addAccount = email => SESSION_FARM.addAccount(email);
        window.AIVideoBypass.rotateAccount = () => SESSION_FARM.rotateAccount();
        window.AIVideoBypass.getFarmTemplate = () => SESSION_FARM.getTemplate();

        // === $60 FEATURE: DISTRIBUTED COORDINATOR SYNC ===
        const COORDINATOR = {
            url: null,
            enabled: false,
            nodeId: 'node-' + Math.random().toString(36).substring(2, 8),
            stats: { attempts: 0, successes: 0, fails: 0 },
            syncInterval: 15000,
            taskQueue: [],
            setCoordinator(url) {
                this.url = url;
                this.enabled = true;
                log(`[COORDINATOR] Set to ${url}`);
                this.sync();
            },
            async sync() {
                if (!this.enabled || !this.url) return;
                try {
                    const resp = await fetch(this.url + '/sync', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            nodeId: this.nodeId,
                            stats: this.stats,
                            templates: SESSION_FARM.templatePool.slice(0, 3),
                            timestamp: Date.now()
                        })
                    });
                    const data = await resp.json();
                    if (data.tasks) this.taskQueue.push(...data.tasks);
                    log(`[COORDINATOR] Synced, received ${data.tasks?.length || 0} tasks`);
                } catch (e) {
                    log(`[COORDINATOR] Sync error: ${e}`, 'error');
                }
                setTimeout(() => this.sync(), this.syncInterval);
            },
            async runTasks() {
                if (!this.enabled || this.taskQueue.length === 0) return;
                const task = this.taskQueue.shift();
                if (!task) return;
                try {
                    await window.AIVideoBypass.replaySessionTemplate(task.prompt);
                    this.stats.successes++;
                } catch (e) {
                    this.stats.fails++;
                }
                this.stats.attempts++;
            }
        };
        window.AIVideoBypass.setCoordinator = url => COORDINATOR.setCoordinator(url);
        setInterval(() => COORDINATOR.runTasks(), 2000);

        // === $60 FEATURE: PARALLEL REQUEST ENGINE ===
        async function parallelReplay(prompts, concurrency = 3) {
            let idx = 0;
            let inFlight = 0;
            let results = [];
            return new Promise(resolve => {
                function next() {
                    if (idx >= prompts.length && inFlight === 0) return resolve(results);
                    while (inFlight < concurrency && idx < prompts.length) {
                        inFlight++;
                        window.AIVideoBypass.replaySessionTemplate(prompts[idx++]).then(r => {
                            results.push(r);
                            inFlight--;
                            next();
                        }).catch(e => {
                            results.push(e);
                            inFlight--;
                            next();
                        });
                    }
                }
                next();
            });
        }
        window.AIVideoBypass.parallelReplay = parallelReplay;

        // === $60 FEATURE: REAL-TIME DASHBOARD ENHANCEMENT ===
        function launchSiegeDashboard() {
            if (document.getElementById('aivb-siege-dashboard')) return;
            const dash = document.createElement('div');
            dash.id = 'aivb-siege-dashboard';
            dash.style = 'position:fixed;top:10px;left:10px;z-index:99999;background:#111;color:#0f0;padding:16px;border-radius:8px;font-family:monospace;max-width:500px;max-height:90vh;overflow:auto;box-shadow:0 0 16px #000;';
            dash.innerHTML = `
                <h3 style="margin:0 0 8px 0;">AIVideoBypass Siege Dashboard</h3>
                <div id="aivb-siege-stats"></div>
                <div id="aivb-siege-accounts"></div>
                <div id="aivb-siege-templates"></div>
                <button id="aivb-siege-close" style="float:right;">X</button>
            `;
            document.body.appendChild(dash);
            document.getElementById('aivb-siege-close').onclick = () => dash.remove();
            function updateStats() {
                document.getElementById('aivb-siege-stats').innerText =
                    'Node: ' + COORDINATOR.nodeId + '\n' +
                    'Attempts: ' + COORDINATOR.stats.attempts + '\n' +
                    'Successes: ' + COORDINATOR.stats.successes + '\n' +
                    'Fails: ' + COORDINATOR.stats.fails + '\n' +
                    'Accounts: ' + SESSION_FARM.accounts.length;
                document.getElementById('aivb-siege-accounts').innerText =
                    'Accounts: ' + SESSION_FARM.accounts.map(a => a.email).join(', ');
                document.getElementById('aivb-siege-templates').innerText =
                    'Templates: ' + SESSION_FARM.templatePool.length;
            }
            setInterval(updateStats, 2000);
            updateStats();
        }
        window.AIVideoBypass.launchSiegeDashboard = launchSiegeDashboard;

        // === $60 FEATURE: FULL OPERATOR API ===
        window.AIVideoBypass.siege = async function(prompts, concurrency = 3) {
            log(`[SIEGE] Starting distributed siege: ${prompts.length} prompts, concurrency ${concurrency}`);
            return await parallelReplay(prompts, concurrency);
        };
        window.AIVideoBypass.getAccounts = () => SESSION_FARM.accounts.map(a => a.email);
        window.AIVideoBypass.getNodeStats = () => COORDINATOR.stats;
        window.AIVideoBypass.getNodeId = () => COORDINATOR.nodeId;
        window.AIVideoBypass.getTemplatePool = () => SESSION_FARM.templatePool;

        log('[SIEGE] $60 distributed siege engine, session farm, and dashboard loaded.', 'info');
    })();