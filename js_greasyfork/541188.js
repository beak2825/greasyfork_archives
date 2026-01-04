// ==UserScript==
// @name         网页自动刷新 Pro
// @namespace    https://www.wuaishare.cn/
// @version      1.2
// @description  自动刷新页面：按网址分别设置刷新间隔；右下角可拖拽面板（记忆位置），倒计时/暂停/重置/设置；面板闲置后自动半透明，悬浮或点击恢复清晰。
// @author       吾爱分享网
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541188/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/541188/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%20Pro.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const MIN_INTERVAL = 5;
    const key = 'urlRefreshMap';
    const panelPosKey = 'autoRefreshPanelPos_v1';
    const currentUrl = location.href;

    let timeLeft = 0;
    let interval = 0;
    let isPaused = false;
    const originalTitle = document.title;

    (async function init() {
        const config = await loadConfig();
        if (config[currentUrl] && config[currentUrl] >= MIN_INTERVAL) {
            interval = config[currentUrl];
            timeLeft = interval;
            await createControlPanel();
            countdown();
        }
    })();

    GM_registerMenuCommand('🛠 设置当前页面刷新间隔', async () => {
        const config = await loadConfig();
        let input = prompt(`请输入刷新间隔时间（单位：秒，≥${MIN_INTERVAL}）：`, config[currentUrl] || 60);
        let val = parseInt(input);
        if (!isNaN(val) && val >= MIN_INTERVAL) {
            config[currentUrl] = val;
            await GM_setValue(key, JSON.stringify(config));
            alert(`✅ 当前页面设置为每 ${val} 秒刷新一次，刷新页面后生效`);
        } else {
            alert('❌ 无效输入，刷新时间必须为数字且 ≥ ' + MIN_INTERVAL);
        }
    });

    GM_registerMenuCommand('❌ 关闭当前页面自动刷新', async () => {
        const config = await loadConfig();
        if (config[currentUrl]) {
            delete config[currentUrl];
            await GM_setValue(key, JSON.stringify(config));
            alert('✅ 已关闭当前页面刷新，刷新页面后停止生效');
        } else {
            alert('ℹ️ 当前页面未设置刷新');
        }
    });

    function countdown() {
        if (!isPaused) {
            document.title = `[${formatTime(timeLeft)}] ${originalTitle}`;
            timeLeft--;
        } else {
            document.title = `[已暂停] ${originalTitle}`;
        }

        if (timeLeft <= 0 && !isPaused) {
            location.reload();
        } else {
            setTimeout(countdown, 1000);
        }
    }

    async function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'autoRefreshProPanel';
        panel.style.cssText = `
            position: fixed;
            bottom: 10px;
            right: 10px;
            background: rgba(0,0,0,0.75);
            color: white;
            font-size: 14px;
            padding: 10px;
            border-radius: 8px;
            z-index: 99999;
            font-family: sans-serif;
            line-height: 1.8;
            box-shadow: 0 8px 24px rgba(0,0,0,0.25);
            user-select: none;
            transition: opacity 200ms ease;
            opacity: 1;
        `;
        panel.innerHTML = `
            <div id="dragHandle" style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                gap:10px;
                margin-bottom:6px;
                cursor: move;
                font-weight: 600;
            ">
                <span>⏱️ 自动刷新</span>
                <span style="opacity:.8;font-weight:400;font-size:12px;">拖动这里</span>
            </div>
            <div style="margin-bottom:6px;">
                剩余：<span id="countdown">${formatTime(timeLeft)}</span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                <button id="pauseBtn" style="cursor:pointer;">⏸ 暂停</button>
                <button id="resetBtn" style="cursor:pointer;">🔁 重置</button>
                <button id="setBtn" style="cursor:pointer;">⚙ 设置</button>
            </div>
        `;
        document.body.appendChild(panel);

        // 恢复拖动位置（全局记忆；不跟随具体网址）
        const savedPos = await loadPanelPos();
        if (savedPos && Number.isFinite(savedPos.left) && Number.isFinite(savedPos.top)) {
            panel.style.left = `${savedPos.left}px`;
            panel.style.top = `${savedPos.top}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
        }

        const countdownEl = panel.querySelector('#countdown');
        const pauseBtn = panel.querySelector('#pauseBtn');
        const resetBtn = panel.querySelector('#resetBtn');
        const setBtn = panel.querySelector('#setBtn');
        const dragHandle = panel.querySelector('#dragHandle');

        setInterval(() => {
            countdownEl.textContent = formatTime(timeLeft);
            pauseBtn.textContent = isPaused ? '▶️ 继续' : '⏸ 暂停';
        }, 1000);

        pauseBtn.onclick = () => { isPaused = !isPaused; };
        resetBtn.onclick = () => { timeLeft = interval; };

        setBtn.onclick = async () => {
            const config = await loadConfig();
            let input = prompt(`设置新的刷新时间（单位：秒，≥${MIN_INTERVAL}）：`, interval);
            let val = parseInt(input);
            if (!isNaN(val) && val >= MIN_INTERVAL) {
                config[currentUrl] = val;
                await GM_setValue(key, JSON.stringify(config));
                interval = val;
                timeLeft = interval;
                alert(`✅ 当前页面刷新间隔已更新为 ${val} 秒`);
            } else {
                alert('❌ 输入无效，必须为数字且不小于 ' + MIN_INTERVAL);
            }
        };

        // 闲置后半透明；悬浮/点击恢复
        const FADE_DELAY_MS = 3000;
        const FADE_OPACITY = 0.35;
        let fadeTimer = null;

        function setOpaque(isOpaque) {
            panel.style.opacity = isOpaque ? '1' : String(FADE_OPACITY);
        }

        function scheduleFade() {
            if (fadeTimer) clearTimeout(fadeTimer);
            fadeTimer = setTimeout(() => setOpaque(false), FADE_DELAY_MS);
        }

        function wake() {
            setOpaque(true);
            scheduleFade();
        }

        panel.addEventListener('mouseenter', wake, true);
        panel.addEventListener('mousedown', wake, true);
        panel.addEventListener('touchstart', wake, { passive: true });
        panel.addEventListener('mouseleave', scheduleFade, true);
        scheduleFade();

        // 可拖拽（仅拖动头部，避免误点按钮）
        let dragging = false;
        let startOffsetX = 0;
        let startOffsetY = 0;

        function clamp(n, min, max) {
            return Math.max(min, Math.min(max, n));
        }

        dragHandle.addEventListener('pointerdown', (e) => {
            if (e.button !== 0 && e.pointerType !== 'touch') return;
            wake();
            dragging = true;
            panel.setPointerCapture?.(e.pointerId);

            const rect = panel.getBoundingClientRect();
            startOffsetX = e.clientX - rect.left;
            startOffsetY = e.clientY - rect.top;

            panel.style.left = `${rect.left}px`;
            panel.style.top = `${rect.top}px`;
            panel.style.right = 'auto';
            panel.style.bottom = 'auto';
            e.preventDefault();
        });

        window.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            const maxLeft = Math.max(0, window.innerWidth - panel.offsetWidth);
            const maxTop = Math.max(0, window.innerHeight - panel.offsetHeight);
            const left = clamp(e.clientX - startOffsetX, 0, maxLeft);
            const top = clamp(e.clientY - startOffsetY, 0, maxTop);
            panel.style.left = `${left}px`;
            panel.style.top = `${top}px`;
        }, true);

        window.addEventListener('pointerup', (e) => {
            if (!dragging) return;
            dragging = false;
            try {
                const left = parseFloat(panel.style.left);
                const top = parseFloat(panel.style.top);
                if (Number.isFinite(left) && Number.isFinite(top)) {
                    GM_setValue(panelPosKey, JSON.stringify({ left, top }));
                }
            } catch { /* ignore */ }
            panel.releasePointerCapture?.(e.pointerId);
        }, true);
    }

    async function loadConfig() {
        const raw = await GM_getValue(key, '{}');
        try {
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }

    async function loadPanelPos() {
        const raw = await GM_getValue(panelPosKey, '');
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }

    function formatTime(t) {
        const h = Math.floor(t / 3600);
        const m = Math.floor((t % 3600) / 60);
        const s = t % 60;
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }

    function pad(n) {
        return String(n).padStart(2, '0');
    }

})();