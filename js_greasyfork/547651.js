// ==UserScript==
// @name        Komiic 阅读助手
// @name:en     Komiic Reading Assistant
// @namespace   Tohsaka-Rin-Scripts
// @match       https://komiic.com/comic/*
// @version     10.0
// @author      远坂凛 Tohsaka Rin
// @description 动态调节页面宽度并自动保存设置，优化 Komiic 漫画阅读体验。
// @description:en Dynamically adjusts page width and auto-saves settings to optimize the Komiic comic reading experience.
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @icon        data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBmaWxsPSJ3aGl0ZSI+PHBhdGggZD0iTTQ4Ny40IDMyOS45bC01OC42LTE0LjItMTIuNyA1MS45Yy00LjQgMTguMS0yMi45IDM5LjQtNDEuMiA0My44bC0zNC4xIDguM2MtMTkuNCA0LjYtMzkgMi4xLTU2LjgtNi44bC0xNy40LTguOXYtODZsODkuMy0yMS44YzQuMy0xIDguOC0uNSA3LjggMy43bDIxLjIgODUuNWMxLjIgNS4xIDcgOC40IDExLjkgNy4yTDQ4MSAxODFjNS4yLTEuMyA5LjYgMS44IDkuNyA3LjFsMTUgNzVjLjIgNS4yLTIuOSAxMC04LjMgMTF6TTMzMy45IDExOS4yYzAtMTEtOS0yMC0yMC0yMGgtMzguN2wtMTMuNy0yMy40Yy02LjEtMTAuNC0xNy43LTE2LjgtMzAuMy0xNi44SDIwN2MtMTIuNSAwLTI0LjIgNi40LTMwLjMgMTYuOEwxNjMgOTkuMkgxMjVjLTExIDAtMjAgOS0yMCAyMHYyNWMwIDEyLjIgMTEuMyAyMy40IDIyLjYgMjAuN2w4OS4zLTIxLjhjNC4zLTEgOS42LS4zIDguNiA0LjJsLTEzLjYgNTUuMmMtMS42IDYuMyAyLjYgMTIuNSA4LjggMTMuOGw4My45IDE2LjhjNS4yIDEgMTAuNC0uMSAxMy42LTQuMmw1MS45LTEyNmMxLTMuOSAuNy04LjItMy40LTEwLjFMMzMzLjkgMTM0djE1LjljMCAxMS4yIDkuNCAyMC4yIDIwLjUgMjAuMnM5LjUtMTEuOCA4LjQtMjIuN2wtMjEtODVjLTEuOC03LjQtOC42LTExLjYtMTUuOC05LjdsLTg5LjQgMjEuOGMtMTIuOCAzLjEtMjUtNC43LTI1LTIwdi0yNWMwLTIuMiAxLjgtNCA0LTRoMzguN2wxMy43LTIzLjRjMi41LTQuMiA3LTEuOCA5LS4yaDMyLjdjMiAwIDYuNS0zLjggOSAuMmwzLjcgNi4yYzIuNSAyLjUgNS41IDUgOC41IDVoMzAuM2MyLjIgMCA0IDEuOCA0IDR2MTYyYzAgMi4yLTEuOCA0LTQgNGgtOS41Yy0xMi4yIDAtMjMuMi0xMC0yMC41LTIyLjNsMTMuNi01NS4yYy45LTQuNS0zLjEtOC44LTcuOC05LjdMMjYxIDE3NC4xYy00LjYtMS4xLTkuMS4yLTExLjEgNC44TDE4MSAzMDkuNGMtMiA0LjYtLjIgOS44IDQuMiAxMS44bDM0LjEgMTcuMWMxNy44IDguOSAzNy40IDExLjQgNTYuOCA2LjhMMzA5IDM0MWMxOC4zLTQuNCAzNi44LTI1LjYgNDEuMi00My44bDEyLjctNTEuOU00NS40IDMyOS45TDEyOCAxNDZjNS4yLTEuMyA5LjYgMS44IDkuNyA3LjFsMTUgNzVjLjIgNS4yLTIuOSAxMC04LjUgMTFMMjYuNiAzNTkuNGMtNS4yIDEuMy05LjYtMS44LTkuNy03LjFsLTE1LTc1Yy0uNS01LjIgMi45LTEwIDguNS0xMXptMzY5LTExNC40bDEwLjYtNDIuOWMyLjgxLTEwLjYxLTUuMy0yMC45LTExLjYtMjMuNWwtNDEuMy0xMy41Yy02LjQxLTIuNjEtMTQuNDEgMy4xMS0xNC4yIDEyLjUxbDEuOCAxMy40Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/547651/Komiic%20%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/547651/Komiic%20%E9%98%85%E8%AF%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 配置 ---
    const STORAGE_KEY = 'komiic_width_percentage';
    const DEFAULT_WIDTH = 85;
    const PRESET_VALUES = [90, 88, 86, 85, 84, 82, 80];
    const AUTO_HIDE_DELAY = 5000;

    let autoHideTimer = null;

    // --- 2. 样式注入 (CSS) ---
    GM_addStyle(`
        #width-control-panel {
            position: fixed; bottom: 20px; right: 20px; z-index: 9999;
            background-color: rgba(40, 40, 40, 0.9); color: white; padding: 10px;
            border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.4);
            font-family: sans-serif; display: flex; align-items: center; gap: 10px;
            transition: transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
        }
        #width-control-panel.hidden { transform: translateX(calc(100% - 45px)); }
        #width-toggle-btn {
            background: none; border: none; color: white; font-size: 24px;
            cursor: pointer; padding: 5px; line-height: 1;
        }
        #width-controls-container { display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .slider-group { display: flex; align-items: center; gap: 10px; }
        #width-slider { width: 150px; }
        #width-label { font-size: 16px; font-weight: bold; min-width: 50px; text-align: center; }
        #preset-buttons-container { display: flex; gap: 5px; flex-wrap: wrap; justify-content: center; }
        .preset-btn {
            background-color: #555; color: white; border: 1px solid #777; border-radius: 4px;
            padding: 4px 8px; cursor: pointer; font-size: 12px; transition: background-color 0.2s;
        }
        .preset-btn:hover { background-color: #777; }
    `);

    // --- 3. 创建悬浮窗 (HTML) ---
    const panel = document.createElement('div');
    panel.id = 'width-control-panel'; panel.className = 'hidden';
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'width-toggle-btn'; toggleBtn.textContent = '⚙️'; toggleBtn.title = '调整页面宽度';
    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'width-controls-container';
    const sliderGroup = document.createElement('div');
    sliderGroup.className = 'slider-group';
    const slider = document.createElement('input');
    slider.type = 'range'; slider.id = 'width-slider'; slider.min = 50; slider.max = 100;
    const label = document.createElement('span');
    label.id = 'width-label';
    sliderGroup.appendChild(label); sliderGroup.appendChild(slider);
    const presetContainer = document.createElement('div');
    presetContainer.id = 'preset-buttons-container';
    PRESET_VALUES.forEach(value => {
        const btn = document.createElement('button');
        btn.className = 'preset-btn'; btn.textContent = value + '%'; btn.dataset.value = value;
        presetContainer.appendChild(btn);
    });
    controlsContainer.appendChild(sliderGroup); controlsContainer.appendChild(presetContainer);
    panel.appendChild(toggleBtn); panel.appendChild(controlsContainer);
    document.body.appendChild(panel);

    // --- 4. 功能逻辑 ---
    const collapsePanel = () => panel.classList.add('hidden');
    function resetAutoHideTimer() { clearTimeout(autoHideTimer); autoHideTimer = setTimeout(collapsePanel, AUTO_HIDE_DELAY); }
    const applyWidthLimit = (percentage) => { document.body.style.maxWidth = percentage + '%'; document.body.style.margin = '0 auto'; document.body.style.boxSizing = 'border-box'; };
    function updateWidth(percentage, shouldSave = false) {
        slider.value = percentage; label.textContent = percentage + '%'; applyWidthLimit(percentage);
        if (shouldSave) { GM_setValue(STORAGE_KEY, percentage); console.log(`[Komiic Script] Width saved: ${percentage}%`); }
    }
    async function initialize() { const savedWidth = await GM_getValue(STORAGE_KEY, DEFAULT_WIDTH); updateWidth(savedWidth); }
    toggleBtn.addEventListener('click', () => { panel.classList.toggle('hidden'); if (!panel.classList.contains('hidden')) { resetAutoHideTimer(); } else { clearTimeout(autoHideTimer); } });
    slider.addEventListener('input', () => { updateWidth(slider.value); resetAutoHideTimer(); });
    slider.addEventListener('change', () => { updateWidth(slider.value, true); });
    presetContainer.addEventListener('click', (e) => { if (e.target.classList.contains('preset-btn')) { updateWidth(e.target.dataset.value, true); resetAutoHideTimer(); } });

    // --- 5. 兼容懒加载 ---
    const observer = new MutationObserver(() => applyWidthLimit(slider.value));
    observer.observe(document.body, { childList: true, subtree: true });

    // --- 6. 启动 ---
    window.addEventListener('load', initialize);

})();