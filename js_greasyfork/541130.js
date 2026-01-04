// ==UserScript==
// @name         全屏按钮（适用于移动设备）
// @name:zh-CN   全屏按钮（适用于移动设备）
// @name:en      Full screen button (for mobile devices)
// @namespace    http://tampermonkey.net/
// @version      3.3
// @description  一个功能强大的全屏按钮，通过油猴菜单进行配置。支持拖动、自动淡化、可选自动贴边、位置重置。
// @description:zh-CN  一个功能强大的全屏按钮，通过油猴菜单进行配置。支持拖动、自动淡化、可选自动贴边、位置重置。
// @description:en     A powerful fullscreen button, configurable via the Greasemonkey menu. Supports dragging, auto-fading, optional auto-sticking, and position reset.
// @author       凡留钰 + ChatGPT + Gemini
// @match        *://*/*
// @noframes
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/4eb17e88irkc3910fvbpp4f0h270
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541130/%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E7%A7%BB%E5%8A%A8%E8%AE%BE%E5%A4%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/541130/%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE%EF%BC%88%E9%80%82%E7%94%A8%E4%BA%8E%E7%A7%BB%E5%8A%A8%E8%AE%BE%E5%A4%87%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // [优化] 增加 document.body 存在性检查，提高脚本健壮性
    if (!document.body) {
        console.warn('[Fullscreen Button] Document body not found, script will not run.');
        return;
    }

    // --- 1. 配置中心 ---
    const CONFIG = {
        initialLeftPercent: 90, // 按钮默认位置_横向
        initialTopPercent: 90, // 按钮默认位置_纵向
        buttonSize: '6vw', // 按钮占页面百分比大小
        minSize: '24px', // 按钮像素大小_最小
        maxSize: '48px', // 按钮像素大小_最大
        fadeOpacity: 0.4, // 按钮透明度_淡出
        hoverOpacity: 0.8, // 按钮透明度_鼠标悬停
        fadeDelay: 3000, // 多久后按钮淡化，单位：ms
        snapTransition: 'left 0.3s ease-out, top 0.3s ease-out',
        opacityTransition: 'opacity 0.3s ease',
        storageKeySnapping: 'enableEdgeSnapping',
    };

    // --- 2. 状态管理器 ---
    const state = {
        dragging: false,
        moved: false,
        hideTimer: null,
        animationFrameId: null,
        leftPercent: CONFIG.initialLeftPercent,
        topPercent: CONFIG.initialTopPercent,
        menuCommandIds: [],
    };

    // --- 3. 创建并初始化按钮 ---
    const btn = document.createElement('button');
    // [优化] 对CSS属性进行逻辑分组，提高可读性
    Object.assign(btn.style, {
        // 定位与层级
        position: 'fixed',
        zIndex: '2147483647',
        // 尺寸
        width: CONFIG.buttonSize,
        height: CONFIG.buttonSize,
        minWidth: CONFIG.minSize,
        minHeight: CONFIG.minSize,
        maxWidth: CONFIG.maxSize,
        maxHeight: CONFIG.maxSize,
        // 外观
        backgroundImage: 'url("data:image/png;base64,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")',
        backgroundSize: 'cover',
        borderRadius: '50%',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        border: 'none',
        opacity: CONFIG.hoverOpacity,
        // 行为与过渡
        cursor: 'grab',
        userSelect: 'none',
        transition: CONFIG.opacityTransition,
    });
    document.body.appendChild(btn);

    // --- 4. 核心功能函数 ---
    function updatePosition() { const w = btn.offsetWidth, h = btn.offsetHeight; btn.style.left = `${(state.leftPercent / 100) * (window.innerWidth - w)}px`; btn.style.top = `${(state.topPercent / 100) * (window.innerHeight - h)}px`; }
    function clampAndUpdatePosition() { state.leftPercent = Math.max(0, Math.min(100, state.leftPercent)); state.topPercent = Math.max(0, Math.min(100, state.topPercent)); updatePosition(); }
    function updateDragPosition(e) { const touch = e.touches ? e.touches[0] : e; const w = btn.offsetWidth, h = btn.offsetHeight; state.leftPercent = (w > 0) ? ((touch.clientX - state.offsetX) / (window.innerWidth - w)) * 100 : 0; state.topPercent = (h > 0) ? ((touch.clientY - state.offsetY) / (window.innerHeight - h)) * 100 : 0; clampAndUpdatePosition(); state.animationFrameId = null; }
    function toggleFullscreen() { if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(err => console.error(`[Fullscreen Button] Error: ${err.message}`)); else document.exitFullscreen(); }

    // --- 5. 事件处理逻辑 ---
    function dragStart(e) { e.preventDefault(); const touch = e.touches ? e.touches[0] : e; state.dragging = true; state.moved = false; btn.style.transition = CONFIG.opacityTransition; const r = btn.getBoundingClientRect(); state.offsetX = touch.clientX - r.left; state.offsetY = touch.clientY - r.top; state.startX = touch.clientX; state.startY = touch.clientY; btn.style.cursor = 'grabbing'; clearHideTimer(); document.addEventListener('mousemove', dragMove, { passive: false }); document.addEventListener('mouseup', dragEnd, { passive: false }); document.addEventListener('touchmove', dragMove, { passive: false }); document.addEventListener('touchend', dragEnd, { passive: false }); }
    function dragMove(e) { if (!state.dragging) return; e.preventDefault(); const touch = e.touches ? e.touches[0] : e; if (!state.moved && (Math.abs(touch.clientX - state.startX) > 5 || Math.abs(touch.clientY - state.startY) > 5)) state.moved = true; if (!state.animationFrameId) state.animationFrameId = requestAnimationFrame(() => updateDragPosition(e)); }
    function dragEnd() { if (!state.dragging) return; state.dragging = false; document.removeEventListener('mousemove', dragMove); document.removeEventListener('mouseup', dragEnd); document.removeEventListener('touchmove', dragMove); document.removeEventListener('touchend', dragEnd); if (state.animationFrameId) { cancelAnimationFrame(state.animationFrameId); state.animationFrameId = null; } btn.style.cursor = 'grab'; if (state.moved) { if (GM_getValue(CONFIG.storageKeySnapping, true)) applyEdgeSnapping(); } else { toggleFullscreen(); } startHideTimer(); }

    // --- 6. 自动淡化逻辑 ---
    function startHideTimer() { clearTimeout(state.hideTimer); state.hideTimer = setTimeout(() => { btn.style.opacity = CONFIG.fadeOpacity; }, CONFIG.fadeDelay); }
    function clearHideTimer() { clearTimeout(state.hideTimer); btn.style.opacity = CONFIG.hoverOpacity; }

    // --- 7. 与油猴菜单交互的核心函数 ---

    function applyEdgeSnapping() { state.leftPercent = state.leftPercent > 50 ? 100 : 0; btn.style.transition = `${CONFIG.opacityTransition}, ${CONFIG.snapTransition}`; clampAndUpdatePosition(); }
    function resetButtonPosition() { state.leftPercent = CONFIG.initialLeftPercent; state.topPercent = CONFIG.initialTopPercent; if (GM_getValue(CONFIG.storageKeySnapping, true)) { applyEdgeSnapping(); } else { btn.style.transition = CONFIG.opacityTransition; clampAndUpdatePosition(); } startHideTimer(); /* [优化] 重置后也启动淡出计时器，统一行为 */ }

    /**
     * [优化] 提取出的切换自动贴边功能的具体实现函数
     */
    function toggleSnapping() {
        const isEnabled = GM_getValue(CONFIG.storageKeySnapping, true);
        const newValue = !isEnabled;
        GM_setValue(CONFIG.storageKeySnapping, newValue);

        if (newValue) {
            applyEdgeSnapping();
        } else {
            btn.style.transition = CONFIG.opacityTransition;
        }
        // 关键：再次调用主函数来刷新整个菜单
        updateAllMenuCommands();
    }

    /**
     * [结构优化] 统一更新所有油猴菜单命令
     */
    function updateAllMenuCommands() {
        state.menuCommandIds.forEach(id => GM_unregisterMenuCommand(id));
        state.menuCommandIds = [];

        // --- 菜单项1：重置按钮位置 ---
        const resetId = GM_registerMenuCommand('重置按钮位置', resetButtonPosition);
        state.menuCommandIds.push(resetId);

        // --- 菜单项2：切换自动贴边 ---
        const isSnappingEnabled = GM_getValue(CONFIG.storageKeySnapping, true);
        const snappingMenuText = (isSnappingEnabled ? '⬜️ 关闭' : '✅ 开启') + ' 自动贴边';
        // [优化] 此处直接调用已命名的回调函数，代码更清晰
        const snapId = GM_registerMenuCommand(snappingMenuText, toggleSnapping);
        state.menuCommandIds.push(snapId);
    }

    // --- 8. 初始化与事件绑定 ---
    btn.addEventListener('mousedown', dragStart);
    btn.addEventListener('touchstart', dragStart, { passive: false });
    ['mouseenter', 'touchstart'].forEach(evt => btn.addEventListener(evt, clearHideTimer));
    ['mouseleave', 'touchend'].forEach(evt => btn.addEventListener(evt, startHideTimer));
    btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); }, true);
    window.addEventListener('resize', clampAndUpdatePosition);
    window.addEventListener('orientationchange', clampAndUpdatePosition);

    updateAllMenuCommands();

    // --- 9. 首次运行 ---
    if (GM_getValue(CONFIG.storageKeySnapping, true)) {
        applyEdgeSnapping();
    } else {
        clampAndUpdatePosition();
    }
    startHideTimer();

})();