// ==UserScript==
// @name         Discord Token Manager
// @icon         https://www.google.com/s2/favicons?domain=discord.com&sz=256
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  Get Token, Login via Token, Batch Token Validator & Switcher (Editor & Line Numbers)
// @author       Chaython
// @homepageURL  https://github.com/Chaython/Discord-Token-Manager
// @supportURL   https://github.com/Chaython/Discord-Token-Manager/issues
// @match        https://discord.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529038/Discord%20Token%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/529038/Discord%20Token%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global State ---
    let CAPTURED_TOKEN = null;
    let isMinimized = false;
    let hasDragged = false;

    // Position Memory
    let expandedPos = null;
    let minimizedPos = null;

    const scope = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

    // --- Safe Storage Wrappers ---
    const safeGetValue = (key, def) => {
        try { return GM_getValue(key, def); } catch(e) { console.warn('[DTG] Storage Error:', e); return def; }
    };
    const safeSetValue = (key, val) => {
        try { GM_setValue(key, val); } catch(e) { console.warn('[DTG] Storage Error:', e); }
    };

    // --- Network Sniffer ---
    const originalOpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalSetRequestHeader = unsafeWindow.XMLHttpRequest.prototype.setRequestHeader;
    unsafeWindow.XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header.toLowerCase() === 'authorization' && value) {
            CAPTURED_TOKEN = value;
        }
        return originalSetRequestHeader.apply(this, arguments);
    };

    // --- Styles ---
    const setupStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .dtg-panel {
                position: fixed; bottom: 20px; right: 20px; z-index: 9999;
                background-color: #2f3136; color: #dcddde; border-radius: 8px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.5); font-family: 'Whitney', sans-serif;
                border: 1px solid #202225;
                display: flex; flex-direction: column;
                overflow: hidden;
                min-width: 320px; min-height: 300px;
                max-width: 95vw; max-height: 95vh;
                width: 350px; height: 500px;
                transition: width 0.1s, height 0.1s, border-radius 0.2s;
            }

            /* --- STRICT MINIMIZED STATE --- */
            .dtg-panel.minimized {
                width: 40px !important;
                height: 40px !important;
                min-width: 0 !important;
                min-height: 0 !important;
                padding: 0 !important;
                border-radius: 50% !important;
                overflow: hidden !important;
                resize: none !important;
                background: #5865f2 !important;
                border: 2px solid #fff !important;
                cursor: grab !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                box-shadow: 0 4px 10px rgba(0,0,0,0.5) !important;
            }
            .dtg-panel.minimized:active {
                cursor: grabbing !important;
            }

            .dtg-panel.minimized > * { display: none !important; }

            .dtg-panel.minimized::after {
                content: '🔑'; font-size: 20px; line-height: 1; display: block;
            }

            /* Resize Handle */
            .dtg-resize-handle {
                position: absolute; top: 0; left: 0;
                width: 15px; height: 15px; cursor: nwse-resize; z-index: 10000;
                border-top: 3px solid rgba(255, 255, 255, 0.4);
                border-left: 3px solid rgba(255, 255, 255, 0.4);
                border-top-left-radius: 8px; transition: border-color 0.2s;
            }
            .dtg-resize-handle:hover { border-color: rgba(255, 255, 255, 0.9); }

            .dtg-header {
                background-color: #5865f2; color: white; padding: 8px 12px 8px 20px;
                font-weight: 600; font-size: 14px; display: flex; justify-content: space-between;
                align-items: center; flex-shrink: 0; cursor: grab;
            }
            .dtg-header:active { cursor: grabbing; }

            .dtg-controls { display: flex; gap: 8px; }
            .dtg-icon-btn { cursor: pointer; opacity: 0.8; font-weight: bold; }
            .dtg-icon-btn:hover { opacity: 1; }

            .dtg-tabs { display: flex; background: #202225; border-bottom: 1px solid #202225; flex-shrink: 0; }
            .dtg-tab { flex: 1; text-align: center; padding: 8px 0; cursor: pointer; font-size: 12px; color: #8e9297; transition: 0.2s; }
            .dtg-tab:hover { color: #dcddde; background: #292b2f; }
            .dtg-tab.active { color: #fff; background: #2f3136; border-bottom: 2px solid #5865f2; }

            .dtg-content { padding: 10px; display: flex; flex-direction: column; gap: 8px; flex: 1; overflow-y: auto; min-height: 0; }

            .dtg-btn {
                background-color: #4f545c; color: white; border: none; padding: 8px;
                border-radius: 4px; cursor: pointer; font-size: 13px; text-align: center;
                transition: background 0.2s; width: 100%; flex-shrink: 0;
            }
            .dtg-btn:hover { background-color: #686d73; }
            .dtg-btn.primary { background-color: #5865f2; }
            .dtg-btn.primary:hover { background-color: #4752c4; }
            .dtg-btn.danger { background-color: #ed4245; }
            .dtg-btn.warning { background-color: #faa61a; color: #000; }
            .dtg-btn.success { background-color: #3ba55c; }
            .dtg-btn-group { display: flex; gap: 5px; flex-shrink: 0; }

            .dtg-input {
                background-color: #202225; border: 1px solid #202225; color: white;
                padding: 8px; border-radius: 4px; font-size: 13px; outline: none; width: 100%; box-sizing: border-box; flex-shrink: 0;
            }

            .dtg-editor-wrapper {
                display: flex; flex: 1; background-color: #202225; border: 1px solid #202225; border-radius: 4px;
                overflow: hidden; position: relative; min-height: 100px;
            }
            .dtg-line-numbers {
                width: 28px; background-color: #2f3136; color: #72767d; text-align: right; 
                padding: 8px 4px 8px 0; font-family: monospace; font-size: 12px; line-height: 16px;
                overflow: hidden; border-right: 1px solid #18191c; user-select: none;
            }
            .dtg-textarea {
                flex: 1; background: transparent; border: none; color: white;
                padding: 8px 8px 8px 6px; padding-right: 24px; padding-bottom: 24px;
                font-family: monospace; font-size: 12px; line-height: 16px;
                outline: none; resize: none; white-space: pre; overflow: auto;
            }

            .dtg-separator { height: 1px; background-color: #40444b; margin: 4px 0; flex-shrink: 0; }

            .dtg-batch-item {
                display: flex; align-items: center; justify-content: space-between;
                background: #202225; padding: 8px; border-radius: 4px;
                font-size: 12px; margin-bottom: 8px; flex-shrink: 0;
            }
            .dtg-batch-status { width: 10px; height: 10px; border-radius: 50%; display: inline-block; margin-right: 6px; flex-shrink: 0; }
            .dtg-status-valid { background-color: #3ba55c; box-shadow: 0 0 5px #3ba55c; }
            .dtg-status-invalid { background-color: #ed4245; }

            .dtg-line-tag {
                color: #72767d; font-family: monospace; font-size: 11px; margin-right: 8px;
                background: #2f3136; padding: 1px 4px; border-radius: 3px;
            }

            .dtg-batch-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin-right: 5px; }
            .dtg-action-group { display: flex; gap: 4px; }
            .dtg-btn-sm { padding: 4px 8px; font-size: 11px; width: auto; }
        `;
        document.head.appendChild(style);
    };

    // --- Core Logic ---
    const loginWithToken = (token) => {
        if (!token) return;
        token = token.replace(/^"|"$/g, '').trim();
        try {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            const localStorage = iframe.contentWindow.localStorage;
            localStorage.setItem('token', `"${token}"`);
            document.body.removeChild(iframe);
            setTimeout(() => window.location.reload(), 300);
        } catch (e) {
            console.error(e);
            alert('Login failed. Check console.');
        }
    };

    const getToken = () => {
        if (CAPTURED_TOKEN) return CAPTURED_TOKEN;
        try {
            const targetEval = (unsafeWindow || window).eval;
            return targetEval(`
                (webpackChunkdiscord_app.push([[''], {}, e => {
                    m = [];
                    for (let c in e.c) m.push(e.c[c]);
                }]), m).find(m => m?.exports?.default?.getToken !== void 0).exports.default.getToken()
            `);
        } catch (e) {}
        return null;
    };

    const copyTokenSafe = (t) => {
        if(!t) t = getToken();
        if(t) {
            navigator.clipboard.writeText(t).catch(err => prompt("Copy your token:", t));
        } else {
            alert('Token not found yet. Switch channels to generate traffic.');
        }
    };

    const updateLineNumbers = (panel) => {
        const textarea = panel.querySelector('#dtg-batch-input');
        const numbers = panel.querySelector('#dtg-line-numbers');
        if(!textarea || !numbers) return;
        const lineCount = textarea.value.split('\n').length;
        numbers.innerHTML = Array.from({length: lineCount}, (_, i) => i + 1).join('<br>');
    };

    const validateToken = async (token) => {
        try {
            const response = await fetch('https://discord.com/api/v9/users/@me', {
                headers: { 'Authorization': token }
            });
            if (response.status === 200) {
                const data = await response.json();
                return { valid: true, username: data.username, discriminator: data.discriminator };
            }
            return { valid: false };
        } catch (e) {
            return { valid: false, error: true };
        }
    };

    const runBatchCheck = async (panel) => {
        const textarea = panel.querySelector('#dtg-batch-input');
        if (!textarea) return;
        let raw = textarea.value;
        const allLines = raw.split(/\r?\n/);
        const seenTokens = new Set();
        const uniqueLines = [];
        for (const line of allLines) {
            const trimmed = line.trim();
            if (trimmed.length < 5) continue;
            if (!seenTokens.has(trimmed)) {
                seenTokens.add(trimmed);
                uniqueLines.push(trimmed);
            }
        }
        const finalText = uniqueLines.join('\n') + (uniqueLines.length > 0 ? '\n' : '');
        textarea.value = finalText;
        updateLineNumbers(panel);
        safeSetValue('dtg_saved_tokens', finalText);

        const resultsDiv = panel.querySelector('#dtg-batch-results');
        resultsDiv.innerHTML = '<div style="text-align:center; color:#888;">Checking...</div>';

        let html = '';
        const accountCounts = {};

        for (let i = 0; i < uniqueLines.length; i++) {
            const token = uniqueLines[i];
            const cleanToken = token.replace(/^"|"$/g, '');
            const lineNumber = i + 1;
            const res = await validateToken(cleanToken);
            const statusClass = res.valid ? 'dtg-status-valid' : 'dtg-status-invalid';
            let name = 'Invalid / Locked';
            let loginBtn = '';

            if (res.valid) {
                let baseName = `${res.username}`;
                if (res.discriminator && res.discriminator !== '0') {
                    baseName += `#${res.discriminator}`;
                }
                if (accountCounts[baseName] === undefined) {
                    accountCounts[baseName] = 0;
                    name = baseName;
                } else {
                    accountCounts[baseName]++;
                    name = `${baseName} (Copy ${accountCounts[baseName]})`;
                }
                loginBtn = `<button class="dtg-btn dtg-btn-sm primary dtg-action-login" data-token="${cleanToken}">Login</button>`;
            }
            const copyBtn = `<button class="dtg-btn dtg-btn-sm dtg-action-copy" data-token="${cleanToken}">Copy</button>`;
            html += `
                <div class="dtg-batch-item">
                    <div style="display:flex; align-items:center; flex:1; min-width:0;">
                        <span class="dtg-batch-status ${statusClass}"></span>
                        <span class="dtg-line-tag">#${lineNumber}</span>
                        <span class="dtg-batch-name" title="${name}">${name}</span>
                    </div>
                    <div class="dtg-action-group">${copyBtn}${loginBtn}</div>
                </div>
            `;
            resultsDiv.innerHTML = html;
            await new Promise(r => setTimeout(r, 200));
        }
        if (!html) resultsDiv.innerHTML = '<div style="text-align:center;">No valid tokens found</div>';

        resultsDiv.querySelectorAll('.dtg-action-login').forEach(btn => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); loginWithToken(btn.dataset.token); });
        });
        resultsDiv.querySelectorAll('.dtg-action-copy').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const t = btn.dataset.token;
                navigator.clipboard.writeText(t).then(() => {
                    const originalText = btn.innerText;
                    btn.innerText = 'Copied!';
                    setTimeout(() => btn.innerText = originalText, 1000);
                });
            });
        });
    };

    const removeInvalidLines = async (panel) => {
        const textarea = panel.querySelector('#dtg-batch-input');
        if (!textarea) return;
        const resultsDiv = panel.querySelector('#dtg-batch-results');
        const raw = textarea.value;
        const allLines = raw.split(/\r?\n/);
        const validLines = [];
        resultsDiv.innerHTML = '<div style="text-align:center; color:#faa61a;">Validating & Removing Invalid...</div>';
        for (const line of allLines) {
            const token = line.trim();
            if (token.length < 5) continue;
            const cleanToken = token.replace(/^"|"$/g, '');
            const res = await validateToken(cleanToken);
            if (res.valid) validLines.push(token);
        }
        const newText = validLines.join('\n') + (validLines.length > 0 ? '\n' : '');
        textarea.value = newText;
        updateLineNumbers(panel);
        safeSetValue('dtg_saved_tokens', newText);
        runBatchCheck(panel);
    };

    // --- UI Creation ---
    const createPanel = () => {
        // Prevent Duplicates
        const existing = document.getElementById('dtg-panel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'dtg-panel';
        panel.className = 'dtg-panel';

        panel.innerHTML = `
            <div id="dtg-resize-handle" class="dtg-resize-handle" title="Drag to Resize"></div>
            <div class="dtg-header" id="dtg-header">
                <span>Discord Tools</span>
                <div class="dtg-controls">
                    <span class="dtg-icon-btn" id="dtg-min">_</span>
                    <span class="dtg-icon-btn" id="dtg-close">✕</span>
                </div>
            </div>
            <div class="dtg-tabs">
                <div class="dtg-tab active" data-tab="single">Single</div>
                <div class="dtg-tab" data-tab="batch">Batch</div>
            </div>
            <div class="dtg-content" id="dtg-content-single"></div>
            <div class="dtg-content" id="dtg-content-batch" style="display:none;"></div>
        `;

        if(document.body) document.body.appendChild(panel);
        else return;

        const renderSingle = () => {
            const container = panel.querySelector('#dtg-content-single');
            const isLoginPage = window.location.href.includes('/login');
            if (!isLoginPage) {
                container.innerHTML = `
                    <button id="dtg-copy" class="dtg-btn primary">Copy Current Token</button>
                    <div class="dtg-separator"></div>
                    <input id="dtg-quick-input" class="dtg-input" type="password" placeholder="Paste token to switch">
                    <button id="dtg-quick-login" class="dtg-btn">Login</button>
                    <div class="dtg-separator"></div>
                    <button id="dtg-logout" class="dtg-btn danger">Logout</button>
                `;
                panel.querySelector('#dtg-copy').onclick = () => copyTokenSafe();
                panel.querySelector('#dtg-quick-login').onclick = () => loginWithToken(panel.querySelector('#dtg-quick-input').value);
                panel.querySelector('#dtg-logout').onclick = () => { window.location.href = '/login'; };
            } else {
                container.innerHTML = `
                    <input id="dtg-input-token" class="dtg-input" type="password" placeholder="Paste Token Here">
                    <button id="dtg-login-btn" class="dtg-btn primary">Login</button>
                `;
                panel.querySelector('#dtg-login-btn').onclick = () => loginWithToken(panel.querySelector('#dtg-input-token').value);
            }
        };

        const renderBatch = () => {
            const container = panel.querySelector('#dtg-content-batch');
            container.innerHTML = `
                <div class="dtg-editor-wrapper">
                    <div id="dtg-line-numbers" class="dtg-line-numbers">1</div>
                    <textarea id="dtg-batch-input" class="dtg-textarea" placeholder="Paste list of tokens" spellcheck="false"></textarea>
                </div>
                <div class="dtg-btn-group">
                    <button id="dtg-batch-check" class="dtg-btn success" style="flex:2;">Check & List</button>
                    <button id="dtg-batch-remove-invalid" class="dtg-btn warning" style="flex:2;">Remove Invalid</button>
                    <button id="dtg-batch-clear" class="dtg-btn danger" style="flex:1;">Clear</button>
                </div>
                <div class="dtg-separator"></div>
                <div id="dtg-batch-results"></div>
            `;
            const input = panel.querySelector('#dtg-batch-input');
            const lines = panel.querySelector('#dtg-line-numbers');
            input.addEventListener('scroll', () => { lines.scrollTop = input.scrollTop; });
            input.addEventListener('input', () => updateLineNumbers(panel));

            const savedTokens = safeGetValue('dtg_saved_tokens', '');
            if (savedTokens) { input.value = savedTokens; updateLineNumbers(panel); }

            panel.querySelector('#dtg-batch-check').onclick = () => runBatchCheck(panel);
            panel.querySelector('#dtg-batch-remove-invalid').onclick = () => removeInvalidLines(panel);
            panel.querySelector('#dtg-batch-clear').onclick = () => {
                input.value = '';
                panel.querySelector('#dtg-batch-results').innerHTML = '';
                safeSetValue('dtg_saved_tokens', '');
                updateLineNumbers(panel);
            };
        };

        renderSingle();
        renderBatch();

        // --- POSITION LOGIC ---
        const toggleMinimize = (shouldMinimize) => {
            const rect = panel.getBoundingClientRect();
            
            if (shouldMinimize) {
                expandedPos = { top: rect.top, left: rect.left };
                panel.classList.add('minimized');
                isMinimized = true;

                if (minimizedPos) {
                    panel.style.top = minimizedPos.top + 'px';
                    panel.style.left = minimizedPos.left + 'px';
                    panel.style.bottom = 'auto'; panel.style.right = 'auto';
                } else {
                    panel.style.top = rect.top + 'px';
                    panel.style.left = rect.left + 'px';
                    panel.style.bottom = 'auto'; panel.style.right = 'auto';
                }
            } else {
                minimizedPos = { top: rect.top, left: rect.left };
                panel.classList.remove('minimized');
                isMinimized = false;

                if (expandedPos) {
                    panel.style.top = expandedPos.top + 'px';
                    panel.style.left = expandedPos.left + 'px';
                    panel.style.bottom = 'auto'; panel.style.right = 'auto';
                }
            }
        };


        // --- DRAG LOGIC ---
        const initDrag = (e) => {
            const isHeader = e.target.closest('#dtg-header');
            const isMinimizedClick = panel.classList.contains('minimized');
            if (e.target.closest('.dtg-controls')) return;
            if (!isHeader && !isMinimizedClick) return;

            e.preventDefault();
            hasDragged = false;
            
            const rect = panel.getBoundingClientRect();
            panel.style.bottom = 'auto'; panel.style.right = 'auto';
            panel.style.left = rect.left + 'px'; panel.style.top = rect.top + 'px';

            const startX = e.clientX; const startY = e.clientY;
            const startLeft = rect.left; const startTop = rect.top;

            const onMove = (e) => {
                const dx = e.clientX - startX; const dy = e.clientY - startY;
                if (Math.abs(dx) > 3 || Math.abs(dy) > 3) hasDragged = true;
                panel.style.left = (startLeft + dx) + 'px';
                panel.style.top = (startTop + dy) + 'px';
            };

            const onUp = () => {
                document.removeEventListener('mousemove', onMove);
                document.removeEventListener('mouseup', onUp);
            };
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        };

        panel.addEventListener('mousedown', initDrag);

        // --- RESIZE LOGIC ---
        const handle = panel.querySelector('#dtg-resize-handle');
        handle.addEventListener('mousedown', function(e) {
            e.preventDefault(); e.stopPropagation();
            const startX = e.clientX; const startY = e.clientY;
            const startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
            const startHeight = parseInt(document.defaultView.getComputedStyle(panel).height, 10);

            function doDrag(e) {
                const width = startWidth + (startX - e.clientX);
                const height = startHeight + (startY - e.clientY);
                if (width > 320 && width < (window.innerWidth - 20)) panel.style.width = width + 'px';
                if (height > 300 && height < (window.innerHeight - 20)) panel.style.height = height + 'px';
            }
            function stopDrag() {
                document.removeEventListener('mousemove', doDrag);
                document.removeEventListener('mouseup', stopDrag);
            }
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        });

        // Tabs & Controls
        const switchTab = (tabName) => {
            panel.querySelectorAll('.dtg-tab').forEach(t => t.classList.remove('active'));
            const activeTab = panel.querySelector(`.dtg-tab[data-tab="${tabName}"]`);
            if(activeTab) activeTab.classList.add('active');
            if (tabName === 'single') {
                panel.querySelector('#dtg-content-single').style.display = 'flex';
                panel.querySelector('#dtg-content-batch').style.display = 'none';
            } else {
                panel.querySelector('#dtg-content-single').style.display = 'none';
                panel.querySelector('#dtg-content-batch').style.display = 'flex';
                updateLineNumbers(panel);
            }
            safeSetValue('dtg_last_tab', tabName);
        };

        panel.querySelectorAll('.dtg-tab').forEach(tab => {
            tab.addEventListener('click', () => switchTab(tab.dataset.tab));
        });

        panel.querySelector('#dtg-min').addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMinimize(true);
        });

        panel.querySelector('#dtg-close').addEventListener('click', (e) => {
            e.stopPropagation();
            panel.remove();
        });

        panel.addEventListener('click', (e) => {
            if (hasDragged) { hasDragged = false; return; }
            if (panel.classList.contains('minimized')) {
                toggleMinimize(false);
            }
        });

        const stopProp = (e) => e.stopPropagation();
        const inputs = panel.querySelectorAll('input, textarea, button');
        inputs.forEach(el => el.addEventListener('click', stopProp));

        const lastTab = safeGetValue('dtg_last_tab', 'single');
        if (lastTab === 'batch') {
            switchTab('batch');
            const savedTokens = safeGetValue('dtg_saved_tokens', '');
            if (savedTokens) { setTimeout(() => runBatchCheck(panel), 500); }
        }
    };

    const init = () => {
        setupStyles();
        if (document.readyState === 'complete') { createPanel(); } 
        else { window.addEventListener('load', () => { setTimeout(createPanel, 1000); }); }
    };

    init();

})();
