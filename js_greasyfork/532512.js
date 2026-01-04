// ==UserScript==
// @name         ChatGPT.com Advanced Message Culler
// @namespace    https://chatgpt.com/
// @version      1.5.0
// @description  Culls messages from ChatGPT conversations via an overlay. Helpful for those who have low-end hardwares
// @author       sytesn, ChatGPT
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532512/ChatGPTcom%20Advanced%20Message%20Culler.user.js
// @updateURL https://update.greasyfork.org/scripts/532512/ChatGPTcom%20Advanced%20Message%20Culler.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const PIN_STORAGE_KEY = 'chatgpt_message_pins';
    const SETTINGS_KEYS = [
        'culler-limit',
        'culler-enabled',
        'culler-mode',
        'culler-fade',
        'panel-left',
        'panel-top'
    ];

    const getPinnedIds = () => JSON.parse(localStorage.getItem(PIN_STORAGE_KEY) || '[]');
    const setPinnedIds = (ids) => localStorage.setItem(PIN_STORAGE_KEY, JSON.stringify(ids));

    let MESSAGE_LIMIT = parseInt(localStorage.getItem('culler-limit')) || 50;
    let cullingEnabled = localStorage.getItem('culler-enabled') === 'true';
    let mode = localStorage.getItem('culler-mode') || "hide";
    let fadeEnabled = localStorage.getItem('culler-fade') !== 'false';
    let multiSelect = false;

    const style = document.createElement('style');
    style.textContent = `
        #culler-panel {
            position: fixed;
            top: ${localStorage.getItem('panel-top') || '10px'};
            left: ${localStorage.getItem('panel-left') || '10px'};
            z-index: 9999;
            background-color: #111;
            padding: 10px;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 13px;
            color: #fff;
            transition: opacity 0.3s ease;
            max-width: 300px;
            resize: both;
            overflow: auto;
        }
        .fade {
            transition: opacity 0.4s ease;
            opacity: 0;
        }
        .fade-in {
            opacity: 1 !important;
        }
        #culler-panel input, #culler-panel select {
            background-color: #222;
            color: #fff;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 2px 4px;
        }
        #culler-panel button {
            margin-top:6px;
            padding:4px 8px;
            border: none;
            border-radius: 4px;
            background-color: #444;
            color: #fff;
            cursor: pointer;
        }
        .top-right-btn {
            position: absolute;
            top: 4px;
            right: 6px;
            background: transparent;
            font-size: 14px;
            padding: 0;
        }
        .pin-btn {
            position: absolute;
            top: 4px;
            right: 4px;
            background: #444;
            border: none;
            color: #fff;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 12px;
            cursor: pointer;
        }
        #pin-panel {
            position: fixed;
            top: 60px;
            right: 10px;
            width: 300px;
            max-height: 70vh;
            overflow-y: auto;
            background: #1e1e1e;
            color: white;
            border-radius: 8px;
            padding: 10px;
            z-index: 9999;
            box-shadow: 0 0 10px #000;
            display: none;
        }
        .pin-message {
            background: #2e2e2e;
            border-radius: 6px;
            padding: 8px;
            margin-bottom: 6px;
            font-size: 13px;
            position: relative;
        }
        .pin-message button {
            position: absolute;
            top: 4px;
            right: 4px;
            background: #900;
            border: none;
            color: white;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 12px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    const panel = document.createElement('div');
    panel.id = 'culler-panel';
    panel.innerHTML = `
        <button class="top-right-btn" id="overlay-minimize">✕</button>
        <div style="margin-bottom:6px;font-weight:bold;">Message Culler</div>
        <label><input type="checkbox" id="culler-enable"> Enable</label><br>
        <label>Keep last <input type="number" id="culler-limit" value="${MESSAGE_LIMIT}" style="width: 50px;"></label><br>
        <label>Mode:
            <select id="culler-mode">
                <option value="hide">Hide</option>
                <option value="remove">Remove</option>
            </select>
        </label><br>
        <label>Fade: <input type="checkbox" id="culler-fade" ${fadeEnabled ? 'checked' : ''}></label><br>
        <button id="culler-refresh">Refresh Now</button>
        <button id="pin-toggle">📌 View Pins</button><br>
        <button id="multi-select-toggle">Multi-Select: Off</button>
        <button id="export-btn">Export</button>
        <button id="import-btn">Import</button>
    `;
    document.body.appendChild(panel);

    // Draggable support
    (function makeDraggable(el) {
        let isDragging = false, offsetX = 0, offsetY = 0;
        el.addEventListener('mousedown', (e) => {
            if (["INPUT", "SELECT", "BUTTON"].includes(e.target.tagName)) return;
            isDragging = true;
            offsetX = e.clientX - el.offsetLeft;
            offsetY = e.clientY - el.offsetTop;
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                el.style.left = (e.clientX - offsetX) + 'px';
                el.style.top = (e.clientY - offsetY) + 'px';
                localStorage.setItem('panel-left', el.style.left);
                localStorage.setItem('panel-top', el.style.top);
            }
        });
        document.addEventListener('mouseup', () => isDragging = false);
    })(panel);

    const enableCheckbox = panel.querySelector('#culler-enable');
    const limitInput = panel.querySelector('#culler-limit');
    const modeSelect = panel.querySelector('#culler-mode');
    const fadeCheckbox = panel.querySelector('#culler-fade');
    const refreshBtn = panel.querySelector('#culler-refresh');
    const multiToggle = panel.querySelector('#multi-select-toggle');

    enableCheckbox.checked = cullingEnabled;
    modeSelect.value = mode;

    enableCheckbox.addEventListener('change', () => {
        cullingEnabled = enableCheckbox.checked;
        localStorage.setItem('culler-enabled', cullingEnabled);
        applyCulling();
    });

    limitInput.addEventListener('change', () => {
        const oldLimit = MESSAGE_LIMIT;
        MESSAGE_LIMIT = parseInt(limitInput.value, 10) || 50;
        localStorage.setItem('culler-limit', MESSAGE_LIMIT);
        applyCulling(oldLimit);
    });

    modeSelect.addEventListener('change', () => {
        mode = modeSelect.value;
        localStorage.setItem('culler-mode', mode);
        applyCulling();
    });

    fadeCheckbox.addEventListener('change', () => {
        fadeEnabled = fadeCheckbox.checked;
        localStorage.setItem('culler-fade', fadeEnabled);
    });

    refreshBtn.addEventListener('click', () => applyCulling());

    multiToggle.addEventListener('click', () => {
        multiSelect = !multiSelect;
        multiToggle.textContent = `Multi-Select: ${multiSelect ? 'On' : 'Off'}`;
    });

    document.getElementById('overlay-minimize').addEventListener('click', () => {
        panel.style.display = 'none';
        showRestoreBtn();
    });

    function showRestoreBtn() {
        const btn = document.createElement('button');
        btn.textContent = 'Show Overlay';
        btn.style = 'position:fixed;top:10px;left:10px;z-index:9999;background:#333;color:#fff;padding:6px;border:none;border-radius:4px;';
        btn.onclick = () => {
            panel.style.display = 'block';
            btn.remove();
        };
        document.body.appendChild(btn);
    }

    document.getElementById('export-btn').addEventListener('click', () => {
        const data = {};
        SETTINGS_KEYS.forEach(k => data[k] = localStorage.getItem(k));
        data.pins = getPinnedIds();
        const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.download = 'chatgpt_culler_backup.json';
        a.href = url;
        a.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('import-btn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = e => {
                try {
                    const data = JSON.parse(e.target.result);
                    SETTINGS_KEYS.forEach(k => {
                        if (data[k] !== undefined) localStorage.setItem(k, data[k]);
                    });
                    if (Array.isArray(data.pins)) setPinnedIds(data.pins);
                    location.reload();
                } catch (e) {
                    alert('Invalid file!');
                }
            };
            reader.readAsText(file);
        };
        input.click();
    });

    // Command palette
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'K') {
            const cmd = prompt('Culler Command: hide/show/refresh');
            if (cmd === 'hide') panel.style.display = 'none';
            if (cmd === 'show') panel.style.display = 'block';
            if (cmd === 'refresh') applyCulling();
        }
    });

    const pinPanel = document.createElement('div');
    pinPanel.id = 'pin-panel';
    pinPanel.innerHTML = `<h2>Pinned Messages</h2><div id="pin-container"></div>`;
    document.body.appendChild(pinPanel);

    document.getElementById('pin-toggle').addEventListener('click', () => {
        pinPanel.style.display = pinPanel.style.display === 'none' ? 'block' : 'none';
        updatePinnedPanel();
    });

    function getMessageElements() {
        return Array.from(document.querySelectorAll('article[data-testid^="conversation-turn-"]'));
    }

    function applyCulling(previousLimit = MESSAGE_LIMIT) {
        const messages = getMessageElements();
        const pinned = new Set(getPinnedIds());
        const visible = messages.filter(msg => !pinned.has(msg.dataset.testid));
        const limitCutoff = visible.length - MESSAGE_LIMIT;

        messages.forEach((msg, i) => {
            const id = msg.dataset.testid;
            const isPinned = pinned.has(id);
            const visibleIndex = visible.indexOf(msg);

            ensurePinButton(msg);

            if (!cullingEnabled || isPinned || visibleIndex >= limitCutoff) {
                if (fadeEnabled && previousLimit < MESSAGE_LIMIT && visibleIndex >= limitCutoff && visibleIndex < visible.length - previousLimit) {
                    msg.classList.add('fade');
                    msg.style.display = '';
                    setTimeout(() => msg.classList.add('fade-in'), 10);
                    setTimeout(() => msg.classList.remove('fade', 'fade-in'), 410);
                } else {
                    msg.style.display = '';
                }
                msg.classList.remove('culled');
            } else {
                if (mode === "remove") {
                    if (!msg.dataset.removed) {
                        msg.dataset.removed = "true";
                        msg.remove();
                    }
                } else {
                    if (fadeEnabled) {
                        msg.classList.add('fade');
                        msg.classList.remove('fade-in');
                        setTimeout(() => msg.style.display = 'none', 400);
                    } else {
                        msg.style.display = "none";
                    }
                    msg.classList.add("culled");
                }
            }
        });
    }

    function ensurePinButton(msg) {
        if (msg.querySelector('.pin-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'pin-btn';
        const id = msg.dataset.testid;
        const pinned = new Set(getPinnedIds());
        btn.textContent = pinned.has(id) ? 'Unpin' : 'Pin';

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const ids = new Set(getPinnedIds());

            if (multiSelect) {
                const allVisible = getMessageElements().filter(el => el.style.display !== 'none');
                allVisible.forEach(el => {
                    const elId = el.dataset.testid;
                    if (!ids.has(elId)) ids.add(elId);
                });
            } else {
                if (ids.has(id)) ids.delete(id); else ids.add(id);
            }

            setPinnedIds([...ids]);
            applyCulling();
        });

        msg.style.position = 'relative';
        msg.appendChild(btn);
    }

    function updatePinnedPanel() {
        const pinned = new Set(getPinnedIds());
        const container = document.getElementById('pin-container');
        container.innerHTML = '';
        getMessageElements().forEach(msg => {
            if (pinned.has(msg.dataset.testid)) {
                const clone = msg.cloneNode(true);
                clone.querySelector('.pin-btn')?.remove();
                const id = msg.dataset.testid;
                const unpinBtn = document.createElement('button');
                unpinBtn.textContent = 'Unpin';
                unpinBtn.onclick = () => {
                    const ids = new Set(getPinnedIds());
                    ids.delete(id);
                    setPinnedIds([...ids]);
                    updatePinnedPanel();
                    applyCulling();
                };
                clone.appendChild(unpinBtn);
                clone.className = 'pin-message';
                container.appendChild(clone);
            }
        });
    }

    new MutationObserver(() => {
        if (cullingEnabled) applyCulling();
    }).observe(document.body, { childList: true, subtree: true });

    setTimeout(() => applyCulling(), 1000);
})();
