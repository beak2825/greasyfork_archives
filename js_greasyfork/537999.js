// ==UserScript==
// @name         Reddit Enhancer (Performance Mode + Tools)
// @namespace    https://greasyfork.org/en/users/123456-eliminater74
// @version      1.6
// @description  Draggable neon menu, Import/Export, Reset buttons, Wide mode, Font/Line tweaks, and Performance Mode toggle to reduce CPU load. No sidebar or video mod. Built for Eliminater74 🛠️✨🧠
// @author       Eliminater74
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://old.reddit.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/537999/Reddit%20Enhancer%20%28Performance%20Mode%20%2B%20Tools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/537999/Reddit%20Enhancer%20%28Performance%20Mode%20%2B%20Tools%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const settingsKey = 'redditEnhancerSettings';
    const positionKey = 'redditEnhancerPosition';

    const defaultSettings = {
        darkMode: false,
        hidePromoted: true,
        hideSuggested: true,
        wideMode: true,
        fontSize: '15px',
        lineHeight: '1.6',
        autoExpandComments: true,
        autoRefresh: false,
        performanceMode: false
    };

    let settings = JSON.parse(localStorage.getItem(settingsKey)) || defaultSettings;
    let savedPos = JSON.parse(localStorage.getItem(positionKey)) || { top: null, left: null };

    function saveSettings() {
        localStorage.setItem(settingsKey, JSON.stringify(settings));
    }

    function applySettings() {
        document.body.style.setProperty('--custom-font-size', settings.fontSize);
        document.body.style.setProperty('--custom-line-height', settings.lineHeight);
        document.body.classList.toggle('re-wide-mode', settings.wideMode);
        document.body.classList.toggle('re-dark-mode', settings.darkMode);
    }

    function hideElements() {
        const isOldReddit = location.hostname.startsWith('old.');
        if (settings.hidePromoted) {
            const promos = isOldReddit
                ? document.querySelectorAll('.promotedlink')
                : document.querySelectorAll('span');
            promos.forEach(el => {
                if (el.textContent.toLowerCase().includes('promoted')) {
                    el.closest('div[data-testid="post-container"]')?.remove();
                    el.closest('.promotedlink')?.remove();
                }
            });
        }

        if (settings.hideSuggested) {
            document.querySelectorAll('div[data-testid="post-container"], .thing').forEach(el => {
                const txt = el.innerText.toLowerCase();
                if (txt.includes('because you follow') || txt.includes('suggested')) el.remove();
            });
        }
    }

    function performanceCleanup() {
        try {
            // Remove iframes and slow footers
            document.querySelectorAll('iframe, .premium-banner-outer, footer, .bottom-bar, [id*="ad-"]').forEach(el => el.remove());

            // Kill observers
            if (window.ResizeObserver) window.ResizeObserver = class { observe() {} disconnect() {} };
            if (window.IntersectionObserver) window.IntersectionObserver = class { observe() {} disconnect() {} };

            // Kill scroll/resize events
            window.addEventListener = new Proxy(window.addEventListener, {
                apply(target, thisArg, args) {
                    const type = args[0];
                    if (['scroll', 'resize'].includes(type)) return;
                    return Reflect.apply(target, thisArg, args);
                }
            });
        } catch (e) {
            console.warn('Performance cleanup failed:', e);
        }
    }

    function autoExpandComments() {
        if (!settings.autoExpandComments) return;
        const isOldReddit = location.hostname.startsWith('old.');
        const buttons = isOldReddit
            ? document.querySelectorAll('.morecomments a')
            : document.querySelectorAll('button[data-testid="comment_expand_button"]');
        buttons.forEach(btn => btn.click());
    }

    function autoRefreshFeed() {
        if (settings.autoRefresh) {
            setTimeout(() => location.reload(), 1000 * 60 * 5);
        }
    }

    function createSettingsMenu() {
        const menu = document.createElement('div');
        menu.id = 'reddit-enhancer-menu';
        if (savedPos.top && savedPos.left) {
            menu.style.top = savedPos.top + 'px';
            menu.style.left = savedPos.left + 'px';
            menu.style.right = 'auto';
            menu.style.bottom = 'auto';
        }

        menu.innerHTML = `
            <button id="re-toggle" title="Reddit Enhancer Settings">⚙️</button>
            <div id="re-panel">
                <label><input type="checkbox" id="re-darkMode"> Dark Mode</label><br>
                <label><input type="checkbox" id="re-hidePromoted"> Hide Promoted Posts</label><br>
                <label><input type="checkbox" id="re-hideSuggested"> Hide Suggested Posts</label><br>
                <label><input type="checkbox" id="re-wideMode"> Wide Layout</label><br>
                <label><input type="checkbox" id="re-autoExpandComments"> Auto Expand Comments</label><br>
                <label><input type="checkbox" id="re-autoRefresh"> Auto Refresh Feed</label><br>
                <label><input type="checkbox" id="re-performanceMode"> 🧠 Performance Mode</label><br>
                <label>Font Size: <input type="text" id="re-fontSize" value="${settings.fontSize}"></label><br>
                <label>Line Height: <input type="text" id="re-lineHeight" value="${settings.lineHeight}"></label><br>
                <button id="re-save">💾 Save</button>
                <button id="re-export">⬇️ Export</button>
                <button id="re-import">⬆️ Import</button>
                <button id="re-reset">🧼 Reset Settings</button>
                <button id="re-reset-pos">📍 Reset Position</button>
                <input type="file" id="re-import-file" style="display:none">
            </div>
        `;
        document.body.appendChild(menu);

        const ids = Object.keys(defaultSettings);
        ids.forEach(id => {
            const el = document.getElementById(`re-${id}`);
            if (el) el.checked = settings[id];
        });
        document.getElementById('re-fontSize').value = settings.fontSize;
        document.getElementById('re-lineHeight').value = settings.lineHeight;

        document.getElementById('re-toggle').onclick = () =>
            document.getElementById('re-panel').classList.toggle('open');

        document.getElementById('re-save').onclick = () => {
            ids.forEach(id => {
                const el = document.getElementById(`re-${id}`);
                if (el) settings[id] = el.type === 'checkbox' ? el.checked : el.value;
            });
            settings.fontSize = document.getElementById('re-fontSize').value;
            settings.lineHeight = document.getElementById('re-lineHeight').value;
            saveSettings();
            applySettings();
            hideElements();
            if (settings.performanceMode) performanceCleanup();
        };

        document.getElementById('re-export').onclick = () => {
            const blob = new Blob([JSON.stringify(settings)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'redditEnhancerSettings.json';
            a.click();
        };

        document.getElementById('re-import').onclick = () => {
            document.getElementById('re-import-file').click();
        };

        document.getElementById('re-import-file').addEventListener('change', function () {
            const reader = new FileReader();
            reader.onload = function () {
                try {
                    settings = JSON.parse(reader.result);
                    saveSettings();
                    location.reload();
                } catch (e) {
                    alert('Invalid settings file.');
                }
            };
            reader.readAsText(this.files[0]);
        });

        document.getElementById('re-reset').onclick = () => {
            localStorage.removeItem(settingsKey);
            location.reload();
        };

        document.getElementById('re-reset-pos').onclick = () => {
            localStorage.removeItem(positionKey);
            location.reload();
        };

        // Drag logic
        let isDragging = false, offsetX = 0, offsetY = 0;
        document.getElementById('re-toggle').addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - menu.offsetLeft;
            offsetY = e.clientY - menu.offsetTop;
            menu.style.transition = 'none';
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = Math.max(0, e.clientX - offsetX);
                const y = Math.max(0, e.clientY - offsetY);
                menu.style.left = x + 'px';
                menu.style.top = y + 'px';
                menu.style.right = 'auto';
                menu.style.bottom = 'auto';
            }
        });
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem(positionKey, JSON.stringify({
                    top: parseInt(menu.style.top),
                    left: parseInt(menu.style.left)
                }));
            }
        });
    }

    function addStyles() {
        GM_addStyle(`
            #reddit-enhancer-menu {
                position: fixed;
                bottom: 12px;
                right: 12px;
                z-index: 99999;
                font-family: monospace, sans-serif;
                user-select: none;
            }
            #re-toggle {
                font-size: 20px;
                padding: 10px;
                background: #000;
                color: #00ffff;
                border: 2px solid #00ffff;
                border-radius: 50%;
                cursor: move;
                box-shadow: 0 0 10px #00ffff;
                transition: all 0.3s ease-in-out;
            }
            #re-toggle:hover {
                box-shadow: 0 0 18px #00ffff, 0 0 30px #00ffff;
                transform: rotate(90deg);
            }
            #re-panel {
                display: none;
                position: absolute;
                bottom: 50px;
                right: 0;
                background: rgba(20, 20, 20, 0.95);
                border: 2px solid #00ffff;
                border-radius: 10px;
                padding: 12px;
                width: 260px;
                color: #00ffff;
                box-shadow: 0 0 20px #00ffffaa;
            }
            #re-panel.open {
                display: block;
            }
            #re-panel input[type="text"] {
                width: 60px;
                background: #111;
                color: #0ff;
                border: 1px solid #0ff;
                padding: 2px 4px;
                margin-top: 2px;
                margin-bottom: 6px;
            }
            #re-panel label {
                display: block;
                margin-bottom: 6px;
                font-size: 13px;
            }
            #re-panel button {
                margin-top: 6px;
                background: #000;
                color: #0ff;
                border: 1px solid #0ff;
                padding: 6px 10px;
                border-radius: 6px;
                cursor: pointer;
                font-weight: bold;
                margin-right: 4px;
            }
            body.re-wide-mode ._1OVBBWLtHoSPfGCRaPzpTf,
            body.re-wide-mode .content,
            body.re-wide-mode .listing-outer {
                max-width: 100% !important;
                width: 100% !important;
            }
            body.re-dark-mode {
                background-color: #121212 !important;
                color: #e0e0e0 !important;
            }
        `);
    }

    function init() {
        addStyles();
        createSettingsMenu();
        applySettings();
        hideElements();
        autoExpandComments();
        autoRefreshFeed();
        if (settings.performanceMode) performanceCleanup();
        new MutationObserver(() => {
            hideElements();
            if (settings.performanceMode) performanceCleanup();
        }).observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', init);
})();
