// ==UserScript==
// @name         ChatGPT Exporter 🔥🚀 (HTML, PDF, MD, JSON) 
// @namespace    https://giths.com/random/chatgpt-exporter
// @version      3.0
// @description  Downloads ChatGPT chats as MD, JSON, HTML, or PDF. Integrates natively into the ChatGPT top toolbar.
// @author       Mr005K
// @license      MIT
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @require      https://cdn.jsdelivr.net/npm/marked@17.0.1/lib/marked.umd.min.js
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/507635/ChatGPT%20Exporter%20%F0%9F%94%A5%F0%9F%9A%80%20%28HTML%2C%20PDF%2C%20MD%2C%20JSON%29.user.js
// @updateURL https://update.greasyfork.org/scripts/507635/ChatGPT%20Exporter%20%F0%9F%94%A5%F0%9F%9A%80%20%28HTML%2C%20PDF%2C%20MD%2C%20JSON%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- STATE MANAGEMENT ---
    const state = {
        accessToken: null,
        threadData: [],
        chatTitle: "ChatGPT Export",
        isReady: false
    };

    // --- ICONS (Matches Native SVG Style) ---
    // This is a "Download" icon, which is the semantic inverse of "Share"
    const SAVE_ICON = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="-ms-0.5 icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`;
    const SPINNER = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="-ms-0.5 icon" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;

    // --- CUSTOM CSS (Only for the dropdown menu, button uses native classes) ---
    function injectStyles() {
        const css = `
            @keyframes spin { 100% { transform: rotate(360deg); } }

            /* Wrapper to handle relative positioning for the dropdown */
            #inndex-save-wrapper {
                position: relative;
                display: flex;
                align-items: center;
            }

            /* The Dropdown Menu */
            #inndex-menu {
                position: absolute;
                top: 100%;
                right: 0;
                margin-top: 8px;
                background: var(--token-surface-primary, #171717); /* Fallback to dark if var fails */
                border: 1px solid var(--token-border-light, #333);
                border-radius: 12px;
                padding: 6px;
                display: none;
                flex-direction: column;
                gap: 4px;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                min-width: 140px;
                z-index: 50;
            }

            #inndex-menu.show { display: flex; }

            .inndex-opt {
                background: transparent;
                color: var(--token-text-primary, #ececec);
                border: none;
                border-radius: 8px;
                padding: 8px 12px;
                font-size: 14px;
                text-align: left;
                cursor: pointer;
                transition: background 0.2s;
            }
            .inndex-opt:hover {
                background: var(--token-surface-hover, #2a2a2a);
            }
        `;
        GM_addStyle(css);
    }

    // --- DOM MANIPULATION ---
    function injectButton(targetContainer) {
        if (document.getElementById('inndex-save-wrapper')) return;

        // Create Wrapper
        const wrapper = document.createElement('div');
        wrapper.id = 'inndex-save-wrapper';

        // Create Button (Using Native Classes)
        const btn = document.createElement('button');
        btn.id = 'inndex-save-btn';
        // These are the exact classes from your snippet
        btn.className = "btn relative btn-ghost text-token-text-primary mx-2";
        btn.setAttribute('aria-label', 'Save Chat');
        btn.innerHTML = `
            <div class="flex w-full items-center justify-center gap-1.5">
                ${SPINNER}
                Save
            </div>
        `;

        // Create Dropdown
        const menu = document.createElement('div');
        menu.id = 'inndex-menu';

        const formats = ['MD', 'JSON', 'HTML', 'PDF'];
        formats.forEach(type => {
            const opt = document.createElement('button');
            opt.className = 'inndex-opt';
            opt.textContent = `Download ${type}`;
            opt.onclick = (e) => {
                e.stopPropagation();
                downloadFile(type.toLowerCase());
                menu.classList.remove('show');
            };
            menu.appendChild(opt);
        });

        // Toggle Logic
        btn.onclick = (e) => {
            e.stopPropagation();
            if (!state.isReady) return;
            // Close other open menus if any (optional)
            const menu = document.getElementById('inndex-menu');
            menu.classList.toggle('show');
        };

        // Close dropdown when clicking elsewhere
        document.addEventListener('click', (e) => {
            if (!wrapper.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        wrapper.appendChild(btn);
        wrapper.appendChild(menu);

        // Insert into the native container (Insert before the last child or append)
        targetContainer.appendChild(wrapper);
    }

    function updateButtonState(loading) {
        const btn = document.getElementById('inndex-save-btn');
        if (!btn) return;

        const container = btn.querySelector('div');
        if (loading) {
            container.innerHTML = `${SPINNER} Save`;
            btn.style.opacity = "0.7";
            btn.style.cursor = "wait";
        } else {
            container.innerHTML = `${SAVE_ICON} Save`;
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }
    }

    // --- DATA LOGIC ---
    async function loadConversation() {
        state.isReady = false;
        updateButtonState(true);

        const uuid = window.location.pathname.match(/\/c\/([a-f0-9-]{36})/)?.[1];
        if (!uuid) return; // Not in a chat

        // Get Access Token if missing
        if (!state.accessToken) {
            try {
                const r = await fetch('/api/auth/session');
                const d = await r.json();
                state.accessToken = d.accessToken;
            } catch (e) { console.error("Token fetch failed", e); return; }
        }

        try {
            const response = await fetch(`/backend-api/conversation/${uuid}`, {
                headers: { 'Authorization': `Bearer ${state.accessToken}` }
            });
            const data = await response.json();

            state.chatTitle = data.title || document.title || "ChatGPT Export";
            processData(data);

            state.isReady = true;
            updateButtonState(false);

        } catch (err) {
            console.error("Chat fetch failed", err);
            const btn = document.getElementById('inndex-save-btn');
            if(btn) btn.innerText = "Error";
        }
    }

    function processData(data) {
        if (!data.mapping || !data.current_node) return;
        const thread = [];
        let currId = data.current_node;

        while (currId) {
            const node = data.mapping[currId];
            if (!node) break;
            const msg = node.message;
            if (msg && msg.content && msg.content.parts && msg.content.parts.length > 0) {
                if (msg.author.role !== 'system' && msg.recipient === 'all') {
                    let text = typeof msg.content.parts[0] === 'string' ? msg.content.parts[0] : "```\nCode Block\n```";
                    if (text.trim()) {
                        thread.push({
                            role: msg.author.role,
                            text: text
                        });
                    }
                }
            }
            currId = node.parent;
        }
        state.threadData = thread.reverse();
    }

    // --- EXPORT LOGIC ---
    function getFilename(ext) {
        const date = new Date().toISOString().slice(0, 10);
        const safeTitle = state.chatTitle.replace(/[/\\?%*:|"<>]/g, '-').substring(0, 50);
        return `${safeTitle} - ${date}.${ext}`;
    }

    function downloadFile(type) {
        const filename = getFilename(type);

        if (type === 'json') {
            triggerDownload(JSON.stringify({ title: state.chatTitle, messages: state.threadData }, null, 2), 'application/json', filename);
        }
        else if (type === 'md') {
            let content = `# ${state.chatTitle}\n\n`;
            state.threadData.forEach(m => {
                content += `### ${m.role === 'user' ? 'User' : 'ChatGPT'}\n\n${m.text}\n\n---\n\n`;
            });
            triggerDownload(content, 'text/markdown', filename);
        }
        else if (type === 'html' || type === 'pdf') {
            const html = generateHTML(state.threadData);
            if (type === 'html') {
                triggerDownload(html, 'text/html', getFilename('html'));
            } else {
                const win = window.open('', '_blank');
                win.document.write(html);
                win.document.close();
                setTimeout(() => { win.print(); win.close(); }, 500);
            }
        }
    }

    function triggerDownload(content, type, filename) {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    // --- HTML GENERATOR (Kept largely the same, optimized for clean export) ---
    function generateHTML(data) {
        const date = new Date().toISOString().slice(0, 10);
        let bodyContent = data.map(m => {
            const roleClass = m.role === 'user' ? 'user' : 'ai';
            const roleName = m.role === 'user' ? 'User' : 'ChatGPT';
            const htmlText = window.marked ? window.marked.parse(m.text) : m.text;
            return `
                <div class="message ${roleClass}">
                    <div class="role">${roleName}</div>
                    <div class="content">${htmlText}</div>
                </div>
            `;
        }).join('');

        return `
            <!DOCTYPE html>
            <html lang="en" data-theme="dark"> <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${state.chatTitle} - Export</title>
                <style>
                    :root { --bg-primary: #ffffff; --bg-message: #f7f7f8; --text-primary: #374151; --border: #e5e7eb; --code-bg: #f3f4f6; --user-role: #10a37f; }
                    [data-theme="dark"] { --bg-primary: #171717; --bg-message: #212121; --text-primary: #ececec; --border: #333333; --code-bg: #0d0d0d; --user-role: #10a37f; }
                    body { font-family: system-ui, sans-serif; background-color: var(--bg-primary); color: var(--text-primary); margin: 0; line-height: 1.6; }
                    .container { max-width: 800px; margin: 0 auto; padding: 40px 20px; }
                    h1 { border-bottom: 1px solid var(--border); padding-bottom: 15px; }
                    .meta { color: #888; font-size: 12px; margin-bottom: 30px; }
                    .message { margin-bottom: 30px; }
                    .role { font-weight: 700; font-size: 12px; text-transform: uppercase; margin-bottom: 5px; }
                    .user .role { color: var(--user-role); }
                    pre { background: var(--code-bg); padding: 10px; border-radius: 5px; overflow-x: auto; }
                    @media print { body { background: #fff; color: #000; } .theme-toggle { display: none; } }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>${state.chatTitle}</h1>
                    <div class="meta">Exported on ${date}</div>
                    ${bodyContent}
                </div>
            </body>
            </html>
        `;
    }

    // --- INITIALIZATION ---
    injectStyles();

    // Observer to handle React's dynamic DOM changes
    const observer = new MutationObserver((mutations) => {
        // We look for the conversation header actions container
        const headerActions = document.querySelector('#conversation-header-actions');

        if (headerActions) {
            // Check if our button is already there
            if (!document.getElementById('inndex-save-wrapper')) {
                injectButton(headerActions);
                // Trigger load if data is missing
                if (!state.isReady) loadConversation();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Handle URL changes (SPA navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            loadConversation();
        }
    }).observe(document.body, { subtree: true, childList: true });

})();