// ==UserScript==
// @name         scroll up and down buttons
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  Add up/down navigation buttons with options for transparency
// @author       the pie stealer
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/546045/scroll%20up%20and%20down%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/546045/scroll%20up%20and%20down%20buttons.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.top !== window.self) return;
    if (document.body && document.body.children.length === 1) {
        const tag = document.body.children[0].tagName.toLowerCase();
        if (['img', 'video', 'audio', 'embed', 'object'].includes(tag)) return;
    }

    const STORAGE_KEY_ENABLED = 'scrollButtons_enabled';
    let isScriptEnabled = GM_getValue(STORAGE_KEY_ENABLED, true);
    let menuCmdId = null;
    let scrollAnimationId = null;
    let isTemporarilyHidden = false;
    function stopScrolling() {
        if (scrollAnimationId) {
            cancelAnimationFrame(scrollAnimationId);
            scrollAnimationId = null;
        }
    }

    ['mousedown', 'wheel', 'DOMMouseScroll', 'mousewheel', 'keydown', 'touchstart'].forEach(evt =>
        document.addEventListener(evt, stopScrolling, { passive: true })
    );

    function smoothScrollTo(targetY) {
        if (scrollAnimationId) cancelAnimationFrame(scrollAnimationId);
        const startY = window.scrollY;
        const distance = targetY - startY;
        const duration = 800; // change this to 1000 or whatever higher scroll speed value you want if this current scroll speed value is scrolling the web page too fast for you
        const startTime = performance.now();

        function step(currentTime) {
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
            window.scrollTo(0, startY + (distance * ease));
            if (progress < 1) scrollAnimationId = requestAnimationFrame(step);
            else scrollAnimationId = null;
        }
        scrollAnimationId = requestAnimationFrame(step);
    }

    const style = document.createElement('style');
    style.innerHTML = `
        :root {
            --sb-bg: rgba(30, 30, 30);
            --sb-hover: rgba(50, 50, 50, 0.96);
            --sb-text: #ffffff;
            --sb-glass-border: 1px solid rgba(255, 255, 255, 0.1);
            --sb-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            --sb-blur: blur(10px);
        }

        .sb-container {
            position: fixed;
            bottom: 13px;
            right: 13px;
            display: flex;
            flex-direction: column;
            gap: 5px;
            z-index: 2147483647;
            transition: opacity 0.3s ease, transform 0.3s ease;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .sb-btn {
            width: 37px;
            height: 37px;
            background: var(--sb-bg);
            backdrop-filter: var(--sb-blur);
            -webkit-backdrop-filter: var(--sb-blur);
            border: var(--sb-glass-border);
            color: var(--sb-text);
            border-radius: 50%;
            cursor: pointer;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: var(--sb-shadow);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            outline: none;
            user-select: none;
        }

        .sb-btn:hover {
            background: var(--sb-hover);
            transform: translateY(-2px);
            box-shadow: 0 6px 16px rgba(0,0,0,0.4);
        }

        .sb-btn:active {
            transform: scale(0.95);
        }

        .sb-btn.sb-transparent { opacity: 0 !important; pointer-events: none; }
        .sb-container:hover .sb-btn.sb-transparent { opacity: 1 !important; pointer-events: auto; }

        .sb-panel {
            position: fixed;
            bottom: 30px;
            right: 90px;
            width: 240px;
            background: rgba(20, 20, 20, 0.9);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: var(--sb-glass-border);
            border-radius: 16px;
            padding: 20px;
            color: #eee;
            display: none;
            flex-direction: column;
            gap: 15px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            z-index: 2147483647;
            font-size: 14px;
            transform-origin: bottom right;
            animation: sb-fade-in 0.2s ease-out;
        }

        @keyframes sb-fade-in {
            from { opacity: 0; transform: scale(0.9) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
        }

        .sb-panel-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: 600;
            font-size: 16px;
            margin-bottom: 5px;
            color: var(--sb-accent);
        }

        .sb-close {
            cursor: pointer;
            opacity: 0.6;
            font-size: 30px;
            transition: opacity 0.2s;
        }
        .sb-close:hover { opacity: 1; color: #ff5f5f; }

        .sb-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .sb-input {
            width: 50px;
            background: rgba(255,255,255,0.1);
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 6px;
            color: white;
            padding: 4px 8px;
            text-align: center;
            font-size: 13px;
        }

        .sb-input:focus {
            outline: none;
            border-color: var(--sb-accent);
            background: rgba(255,255,255,0.15);
        }

        .sb-action-btn {
            width: 100%;
            padding: 8px;
            background: var(--sb-accent);
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            margin-top: 5px;
            background-color: #4a90e2;
            transition: background 0.2s;
        }

        .sb-action-btn:hover { background: #black; }

        .sb-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
        }
        .sb-switch input { opacity: 0; width: 0; height: 0; }

        .sb-slider {
            position: absolute;
            cursor: pointer;
            top: 0; left: 0; right: 0; bottom: 0;
            background-color: #555;
            transition: .4s;
            border-radius: 34px;
        }

        .sb-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        .sb-switch input:checked + .sb-slider { background-color: #4a90e2; }
        .sb-switch input:checked + .sb-slider:before { transform: translateX(18px); }

        .sb-hr {
            border: 0;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
            margin: 5px 0;
        }
    `;

    const container = document.createElement('div');
    container.className = 'sb-container';

    const createBtn = (html, title, onClick) => {
        const btn = document.createElement('button');
        btn.className = 'sb-btn';
        btn.innerHTML = html;
        btn.title = title;
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            onClick(e);
        });
        return btn;
    };

    const upBtn = createBtn(
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>',
        'Scroll to Top',
        () => smoothScrollTo(0)
    );

    const downBtn = createBtn(
        '<svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>',
        'Scroll to Bottom',
        () => smoothScrollTo(document.documentElement.scrollHeight)
    );

    const settingsBtn = createBtn(
        '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/></svg>',
        'Settings',
        () => {
            const isFlex = settingsPanel.style.display === 'flex';
            settingsPanel.style.display = isFlex ? 'none' : 'flex';
        }
    );

    container.append(upBtn, settingsBtn, downBtn);

    const settingsPanel = document.createElement('div');
    settingsPanel.className = 'sb-panel';

    const header = document.createElement('div');
    header.className = 'sb-panel-header';
    header.innerHTML = `<span>Settings</span><span class="sb-close">&times;</span>`;
    header.querySelector('.sb-close').onclick = () => settingsPanel.style.display = 'none';
    settingsPanel.appendChild(header);

    const timerRow = document.createElement('div');
    timerRow.className = 'sb-row';
    timerRow.innerHTML = `<span>Hide duration (s)</span>`;

    const timerInput = document.createElement('input');
    timerInput.type = 'number';
    timerInput.className = 'sb-input';
    timerInput.min = '1';
    timerInput.value = '5';
    timerRow.appendChild(timerInput);
    settingsPanel.appendChild(timerRow);

    const hideBtn = document.createElement('button');
    hideBtn.className = 'sb-action-btn';
    hideBtn.innerText = 'Start Temporary Hide';
    hideBtn.onclick = () => {
        const seconds = parseInt(timerInput.value, 10) * 1000;
        if (isNaN(seconds)) return;

        removeUI();
        isTemporarilyHidden = true;

        setTimeout(() => {
            isTemporarilyHidden = false;
            addUI();
        }, seconds);
    };
    settingsPanel.appendChild(hideBtn);

    settingsPanel.appendChild(document.createElement('div')).className = 'sb-hr';

    const transpRow = document.createElement('div');
    transpRow.className = 'sb-row';
    transpRow.innerHTML = `<span>transparency toggle</span>`;

    const switchLabel = document.createElement('label');
    switchLabel.className = 'sb-switch';
    const switchInput = document.createElement('input');
    switchInput.type = 'checkbox';
    const switchSlider = document.createElement('span');
    switchSlider.className = 'sb-slider';

    switchLabel.append(switchInput, switchSlider);
    transpRow.appendChild(switchLabel);
    settingsPanel.appendChild(transpRow);

    const STORAGE_KEY_TRANSP = 'scrollBtn_transparency';
    const buttons = [upBtn, downBtn, settingsBtn];

    function applyTransparency(isTransparent) {
        switchInput.checked = isTransparent;
        buttons.forEach(btn => {
            isTransparent ? btn.classList.add('sb-transparent') : btn.classList.remove('sb-transparent');
        });
        localStorage.setItem(STORAGE_KEY_TRANSP, isTransparent ? '1' : '0');
    }

    switchInput.addEventListener('change', () => applyTransparency(switchInput.checked));

    const savedTransp = localStorage.getItem(STORAGE_KEY_TRANSP);
    if (savedTransp === '1') applyTransparency(true);

    function removeUI() {
        if (container) container.remove();
        if (settingsPanel) settingsPanel.remove();
        if (style) style.remove();
    }

    function addUI() {
        if (!isScriptEnabled) return;
        if (!document.head.contains(style)) document.head.appendChild(style);
        if (!document.body.contains(container)) document.body.appendChild(container);
        if (!document.body.contains(settingsPanel)) document.body.appendChild(settingsPanel);
    }

    function toggleScript() {
        isScriptEnabled = !isScriptEnabled;
        GM_setValue(STORAGE_KEY_ENABLED, isScriptEnabled);
        isScriptEnabled ? addUI() : removeUI();
        updateMenuCommand();
    }

    function updateMenuCommand() {
        if (menuCmdId !== null) GM_unregisterMenuCommand(menuCmdId);
        menuCmdId = GM_registerMenuCommand(
            isScriptEnabled ? "disable scroll buttons" : "enable scroll nuttons",
            toggleScript
        );
    }

    updateMenuCommand();
    if (isScriptEnabled) addUI();

    document.addEventListener('fullscreenchange', () => {
        if (!isScriptEnabled) return;
        container.style.display = document.fullscreenElement ? 'none' : 'flex';
    });

    const observer = new MutationObserver(() => {
        if (!isScriptEnabled || isTemporarilyHidden) return;
        addUI();
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();