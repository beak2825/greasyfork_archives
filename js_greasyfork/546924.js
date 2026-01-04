// ==UserScript==
// @name         自动滚动页面 (最终重构版)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Shift+S 激活。
// @author       Leeyw & Cjz & Gemini
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546924/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2%20%28%E6%9C%80%E7%BB%88%E9%87%8D%E6%9E%84%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546924/%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%E9%A1%B5%E9%9D%A2%20%28%E6%9C%80%E7%BB%88%E9%87%8D%E6%9E%84%E7%89%88%29.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 全局变量与状态 ---
    let panelElement = null, scrolling = false, scrollSpeed = 30, targetScrollY = 0, lastTimestamp = 0;
    let currentTheme = 'dark', currentOpacity = 1.0;
    const SYNC_THRESHOLD = 10;
    let zoomObserver = null, antiZoomProbe = null;

    let lastHoveredElement = document.body;
    let scrollTarget = window;

    const themes = {
        dark: { panelBg: '#282c34', panelColor: '#e0e0e0', buttonBg: '#5c6370', buttonColor: '#e0e0e0', inputBg: '#3f444f', inputColor: '#e0e0e0' },
        light: { panelBg: '#f0f0f0', panelColor: '#212121', buttonBg: '#ffffff', buttonColor: '#212121', inputBg: '#ffffff', inputColor: '#212121' }
    };

    // --- 智能滚动相关函数 ---
    function findScrollableTarget(element) {
        if (!element) return window;
        let el = element;
        while (el && el !== document.documentElement) {
            const style = window.getComputedStyle(el);
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
                return el;
            }
            el = el.parentElement;
        }
        return window;
    }

    const getScroller = (elementOnDemand) => {
        const target = elementOnDemand ? findScrollableTarget(elementOnDemand) : scrollTarget;
        const isWindow = target === window;
        const scrollElement = isWindow ? (document.scrollingElement || document.documentElement) : target;

        return {
            scrollTo: (y) => {
                if (isWindow) window.scrollTo(0, y);
                else target.scrollTop = y;
            },
            getScrollTop: () => isWindow ? window.scrollY : target.scrollTop,
            scrollToTop: () => target.scrollTo({ top: 0, behavior: 'smooth' }),
            scrollToBottom: () => target.scrollTo({ top: scrollElement.scrollHeight, behavior: 'smooth' }),
        };
    };

    // --- 核心功能：创建并显示面板 ---
    async function createPanel() {
        if (panelElement) return;

        await loadSettings();

        panelElement = document.createElement('div');
        Object.assign(panelElement.style, {
            position: 'fixed', right: '10px', bottom: '10px', zIndex: '2147483647',
            padding: '5px', borderRadius: '5px', fontFamily: 'sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)', lineHeight: '1.2', fontSize: '12px',
            transition: 'opacity 0.1s'
        });

        // Helper functions for UI creation
        const createRow = (styles = {}) => { const r = document.createElement('div'); Object.assign(r.style, { display: 'flex', alignItems: 'center', minHeight: '20px' }, styles); return r; };
        const createButton = (text, styles = {}) => { const b = document.createElement('button'); b.textContent = text; Object.assign(b.style, { border: '1px solid #888', borderRadius: '3px', cursor: 'pointer', padding: '1px 4px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }, styles); return b; };
        const createLabel = (text) => { const l = document.createElement('span'); l.textContent = text; Object.assign(l.style, { width: '50px', textAlign: 'right', marginRight: '3px', userSelect: 'none' }); return l; };

        // 创建所有元素
        const speedRow = createRow({ marginBottom: '3px' });
        const opacityRow = createRow({ marginBottom: '3px' });
        const buttonRow = createRow({ justifyContent: 'space-between' });

        const speedSlider = document.createElement('input');
        const scrollTopButton = createButton('⬆', { width: '22px', height: '22px', padding: '0', marginLeft: 'auto' });
        const opacitySlider = document.createElement('input');
        const scrollBottomButton = createButton('⬇', { width: '22px', height: '22px', padding: '0', marginLeft: 'auto' });
        const startStopButton = createButton('开始');
        const toggleThemeButton = createButton('主题');
        const speedInput = document.createElement('input');

        // 组装行
        Object.assign(speedSlider, { type: 'range', min: '1', max: '400', step: '1', value: Math.abs(scrollSpeed) });
        speedSlider.style.width = '75px';
        speedRow.appendChild(createLabel('速度:'));
        speedRow.appendChild(speedSlider);
        speedRow.appendChild(scrollTopButton);

        Object.assign(opacitySlider, { type: 'range', min: '0.2', max: '1.0', step: '0.05', value: currentOpacity });
        opacitySlider.style.width = '75px';
        opacityRow.appendChild(createLabel('透明度:'));
        opacityRow.appendChild(opacitySlider);
        opacityRow.appendChild(scrollBottomButton);

        Object.assign(speedInput, { type: 'number', step: '1', value: scrollSpeed });
        Object.assign(speedInput.style, { width: '55px', border: '1px solid #888', borderRadius: '3px', padding: '1px 3px', textAlign: 'center', fontSize: '12px', margin: '0 0px' });
        [startStopButton, speedInput, toggleThemeButton].forEach(el => buttonRow.appendChild(el));

        [speedRow, opacityRow, buttonRow].forEach(el => panelElement.appendChild(el));
        document.body.appendChild(panelElement);

        // --- 事件监听 ---
        const allButtons = [startStopButton, toggleThemeButton, scrollTopButton, scrollBottomButton];
        speedSlider.addEventListener('input', () => {
            const newMagnitude = parseFloat(speedSlider.value);
            const sign = Math.sign(scrollSpeed) || 1;
            scrollSpeed = newMagnitude * sign;
            speedInput.value = scrollSpeed;
            saveSettings();
        });
        speedInput.addEventListener('change', () => {
            const newSpeed = parseFloat(speedInput.value) || 0;
            scrollSpeed = newSpeed;
            speedSlider.value = Math.min(400, Math.abs(newSpeed));
            saveSettings();
        });
        scrollTopButton.addEventListener('click', () => getScroller(lastHoveredElement).scrollToTop());
        scrollBottomButton.addEventListener('click', () => getScroller(lastHoveredElement).scrollToBottom());
        opacitySlider.addEventListener('input', () => {
            currentOpacity = opacitySlider.value;
            panelElement.style.opacity = currentOpacity;
            saveSettings();
        });
        startStopButton.addEventListener('click', () => {
            scrolling = !scrolling;
            startStopButton.textContent = scrolling ? '停止' : '开始';
            if (scrolling) {
                scrollTarget = findScrollableTarget(lastHoveredElement);
                lastTimestamp = 0;
                targetScrollY = getScroller().getScrollTop();
                window.requestAnimationFrame(autoScroll);
            }
        });
        toggleThemeButton.addEventListener('click', () => {
            currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
            applyTheme(currentTheme, toggleThemeButton, speedInput, allButtons);
        });

        // --- 初始化状态 ---
        panelElement.style.opacity = currentOpacity;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        currentTheme = prefersDark ? 'dark' : 'light';
        applyTheme(currentTheme, toggleThemeButton, speedInput, allButtons);
        startAntiZoom();
    }

    // --- 设置管理与辅助函数 ---
    const getSettingsKey = () => `autoScrollSettings_${window.location.hostname}`;
    async function saveSettings() { try { await GM_setValue(getSettingsKey(), { speed: scrollSpeed, opacity: currentOpacity }); } catch (e) { console.error('自动滚屏脚本保存设置失败，可能是权限不足。', e); } }
    async function loadSettings() { try { const saved = await GM_getValue(getSettingsKey(), {}); scrollSpeed = saved.speed ?? 30; currentOpacity = saved.opacity ?? 1.0; } catch (e) { console.error('自动滚屏脚本读取设置失败，将使用默认设置。', e); scrollSpeed = 30; currentOpacity = 1.0; } }
    const applyTheme = (themeName, themeBtn, speedInputRef, buttonsRef) => { const theme = themes[themeName]; Object.assign(panelElement.style, { backgroundColor: theme.panelBg, color: theme.panelColor }); themeBtn.textContent = themeName === 'dark' ? '暗' : '明'; Object.assign(speedInputRef.style, { backgroundColor: theme.inputBg, color: theme.inputColor }); buttonsRef.forEach(btn => Object.assign(btn.style, { backgroundColor: theme.buttonBg, color: theme.buttonColor })); };
    function startAntiZoom() { if (antiZoomProbe) return; antiZoomProbe = document.createElement('div'); Object.assign(antiZoomProbe.style, { position: 'fixed', top: '0', left: '0', width: '100vw', height: '0', visibility: 'hidden', zIndex: '-1' }); document.body.appendChild(antiZoomProbe); const updateZoom = () => { if (!panelElement || !antiZoomProbe) return; const probeWidth = antiZoomProbe.getBoundingClientRect().width; if (probeWidth === 0) return; const zoomFactor = window.innerWidth / probeWidth; requestAnimationFrame(() => { if (panelElement) panelElement.style.zoom = 1 / zoomFactor; }); }; zoomObserver = new ResizeObserver(updateZoom); zoomObserver.observe(antiZoomProbe); requestAnimationFrame(updateZoom); }
    function stopAntiZoom() { if (zoomObserver) zoomObserver.disconnect(); if (antiZoomProbe) antiZoomProbe.remove(); zoomObserver = null; antiZoomProbe = null; if (panelElement) panelElement.style.zoom = '1'; }

    // --- 核心滚动逻辑 (修正) ---
    function autoScroll(timestamp) {
        if (!scrolling || !panelElement) return;
        const scroller = getScroller();
        if (!lastTimestamp) { lastTimestamp = timestamp; window.requestAnimationFrame(autoScroll); return; }

        const deltaTime = (timestamp - lastTimestamp) / 1000;
        lastTimestamp = timestamp;

        const actualScrollY = scroller.getScrollTop();
        if (Math.abs(actualScrollY - targetScrollY) > SYNC_THRESHOLD) {
            targetScrollY = actualScrollY;
        }

        targetScrollY += scrollSpeed * deltaTime;
        scroller.scrollTo(targetScrollY);

        window.requestAnimationFrame(autoScroll);
    }

    const togglePanelVisibility = () => { if (!panelElement) { createPanel(); } else { const isVisible = panelElement.style.display !== 'none'; if (isVisible) { panelElement.style.display = 'none'; stopAntiZoom(); } else { panelElement.style.display = 'block'; startAntiZoom(); } } };

    // --- 全局事件监听 ---
    document.addEventListener('keydown', (e) => { if (e.shiftKey && e.key === 'S') { e.preventDefault(); togglePanelVisibility(); } });
    document.addEventListener('mousemove', e => { if (e.target !== lastHoveredElement) lastHoveredElement = e.target; });
})();