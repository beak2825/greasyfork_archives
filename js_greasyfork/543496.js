// ==UserScript==
// @name          B站自动宽屏居中NEW
// @namespace     @NIA
// @version       1.70
// @description   自动宽屏播放并将播放器垂直居中视口，退出宽屏/网页全屏/全屏模式自动滚动页面到顶部。默认关闭自动宽屏。
// @author        NIA
// @icon          https://www.bilibili.com//favicon.ico
// @license       MIT
// @match         https://*.bilibili.com/video/*
// @match         https://*.bilibili.com/list/*
// @match         https://*.bilibili.com/bangumi/play/*
// @grant         GM_getValue
// @grant         GM_setValue
// @grant         GM_registerMenuCommand
// @grant         GM_unregisterMenuCommand
// @run-at        document-idle
// @downloadURL https://update.greasyfork.org/scripts/543496/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E5%B1%85%E4%B8%ADNEW.user.js
// @updateURL https://update.greasyfork.org/scripts/543496/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E5%B1%85%E4%B8%ADNEW.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    // --- 配置项 ---
    const DEFAULT_PLAYER_CENTER_OFFSET = 90; // 播放器垂直居中时的默认偏移量 (像素)
    const OFFSET_STEP = 1;                   // 调整偏移量时的步长
    const DEBOUNCE_DELAY = 200;              // 事件防抖延迟 (ms)
    const URL_CHECK_DELAY = 500;             // URL 变化后执行逻辑的延迟 (ms)
    const FINAL_CHECK_DELAY = 400;           // 初始化或导航后最终检查状态的延迟 (ms)
    const SCROLL_ANIMATION_DURATION = 500;   // 预估的平滑滚动动画时长 (ms)
    const OBSERVER_MAX_WAIT_TIME = 15000;    // MutationObserver 最长等待时间 (15秒)
    const SCRIPT_VERSION = '1.70';           // 脚本版本，用于日志记录
 
    // --- 状态变量 ---
    let elements = {
        wideBtn: null,
        webFullBtn: null,
        fullBtn: null,
        player: null,
        playerContainer: null,
    };
    let isEnabled = GM_getValue('enableWideScreen', false);
    let playerCenterOffset = GM_getValue('playerCenterOffset', DEFAULT_PLAYER_CENTER_OFFSET);
    let currentUrl = window.location.href;
    let initTimeout = null;
    let reInitScheduled = false;
    let lastScrollTime = 0;
    let isScrolling = false;
    let registeredCommandIds = [];
    let coreElementsObserver = null;
    let observerTimeoutId = null;
 
    /**
     * 平滑滚动到指定的垂直位置 (带节流)。
     * @param {number} topPosition 目标垂直滚动位置
     */
    function scrollToPosition(topPosition) {
        if (isScrolling) return;
        const now = Date.now();
        if (now - lastScrollTime < 100 && Math.abs(window.scrollY - topPosition) < 5) {
            return;
        }
        lastScrollTime = now;
        isScrolling = true;
        window.scrollTo({
            top: topPosition,
            behavior: 'smooth'
        });
        setTimeout(() => {
            isScrolling = false;
        }, SCROLL_ANIMATION_DURATION);
    }
 
    /** 滚动页面使播放器大致垂直居中于视口。 */
    const scrollToPlayer = function() {
        if (!elements.player && !cacheElements()) {
             console.warn("[B站自动宽屏居中] scrollToPlayer: 播放器元素未缓存且重新缓存失败。");
             return;
        }
        if (!elements.player) {
            return;
        }
        requestAnimationFrame(() => {
            const playerRect = elements.player.getBoundingClientRect();
            if (playerRect.height > 0) {
                const playerTop = playerRect.top + window.scrollY;
                const desiredScrollTop = playerTop - playerCenterOffset;
                if (Math.abs(window.scrollY - desiredScrollTop) > 5) {
                    scrollToPosition(desiredScrollTop);
                }
            }
        });
    }
 
    /** 滚动到页面顶部。 */
    const scrollToTop = function() {
        if (window.scrollY > 0) {
            scrollToPosition(0);
        }
    }
 
    /**
     * 检查播放器当前的宽屏/全屏状态，并据此执行相应的滚动操作。
     * 这是一个统一的、防抖处理的滚动入口。
     */
    const debouncedCheckAndScroll = (function() {
        let timeoutId;
        return function() {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                if (!elements.player || !elements.wideBtn) {
                    if (!cacheElements()) {
                        return;
                    }
                }
                const isWide = elements.wideBtn.classList.contains('bpx-state-entered');
                const isWebFull = elements.webFullBtn && elements.webFullBtn.classList.contains('bpx-state-entered');
                const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
 
                if (isWide && !isWebFull && !isFull) {
                    scrollToPlayer();
                } else if (!isWide && !isWebFull && !isFull) {
                    scrollToTop();
                }
            }, DEBOUNCE_DELAY);
        };
    })();
 
    /**
     * 缓存播放器及相关的控制按钮等核心DOM元素。
     * @returns {boolean}
     */
    function cacheElements() {
        elements.player = document.querySelector('#bilibili-player');
        if (!elements.player) {
            return false;
        }
        elements.playerContainer = document.querySelector('.bpx-player-container') ||
                                   document.querySelector('#bilibiliPlayer') ||
                                   elements.player;
        if (elements.playerContainer) {
            elements.wideBtn = elements.playerContainer.querySelector('.bpx-player-ctrl-wide');
            elements.webFullBtn = elements.playerContainer.querySelector('.bpx-player-ctrl-web');
            elements.fullBtn = elements.playerContainer.querySelector('.bpx-player-ctrl-full');
        } else {
            elements.wideBtn = document.querySelector('.bpx-player-ctrl-wide');
            elements.webFullBtn = document.querySelector('.bpx-player-ctrl-web');
            elements.fullBtn = document.querySelector('.bpx-player-ctrl-full');
        }
        return !!elements.wideBtn;
    }
 
    /** 如果启用了自动宽屏，确保播放器处于宽屏模式。 */
    function ensureWideMode() {
        if (!isEnabled || !elements.wideBtn) return;
 
        const isCurrentlyWide = elements.wideBtn.classList.contains('bpx-state-entered');
        const isWebFull = elements.webFullBtn && elements.webFullBtn.classList.contains('bpx-state-entered');
        const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
 
        if (!isCurrentlyWide && !isWebFull && !isFull) {
            elements.wideBtn.click();
        }
    }
 
    /** 设置事件监听器。 */
    function setupListeners() {
        removeListenersAndObserver();
        console.log("[B站自动宽屏居中] setupListeners: 开始设置事件监听器。");
 
        if (!cacheElements()) {
            console.error("[B站自动宽屏居中] setupListeners: 核心元素查找失败，无法设置监听器。");
            return;
        }
 
        // 核心改动：统一调用 debouncedCheckAndScroll
        elements.wideBtn.addEventListener('click', debouncedCheckAndScroll);
        if (elements.webFullBtn) elements.webFullBtn.addEventListener('click', debouncedCheckAndScroll);
        if (elements.fullBtn) elements.fullBtn.addEventListener('click', debouncedCheckAndScroll);
 
        const videoArea = elements.playerContainer?.querySelector('.bpx-player-video-area');
        if (videoArea) videoArea.addEventListener('dblclick', debouncedCheckAndScroll);
 
        document.addEventListener('fullscreenchange', debouncedCheckAndScroll);
        document.addEventListener('webkitfullscreenchange', debouncedCheckAndScroll);
        document.addEventListener('mozfullscreenchange', debouncedCheckAndScroll);
        document.addEventListener('MSFullscreenChange', debouncedCheckAndScroll);
 
        document.addEventListener('keydown', handleKeyPress);
        window.addEventListener('resize', debouncedCheckAndScroll);
        console.log("[B站自动宽屏居中] setupListeners: 事件监听器设置完成。");
    }
 
    /** 移除所有已添加的事件监听器和 MutationObserver。 */
    function removeListenersAndObserver() {
        if (elements.wideBtn) elements.wideBtn.removeEventListener('click', debouncedCheckAndScroll);
        if (elements.webFullBtn) elements.webFullBtn.removeEventListener('click', debouncedCheckAndScroll);
        if (elements.fullBtn) elements.fullBtn.removeEventListener('click', debouncedCheckAndScroll);
 
        const currentContainer = elements.playerContainer || document.querySelector('.bpx-player-container') || document.querySelector('#bilibiliPlayer');
        const videoArea = currentContainer?.querySelector('.bpx-player-video-area');
        if (videoArea) videoArea.removeEventListener('dblclick', debouncedCheckAndScroll);
 
        document.removeEventListener('fullscreenchange', debouncedCheckAndScroll);
        document.removeEventListener('webkitfullscreenchange', debouncedCheckAndScroll);
        document.removeEventListener('mozfullscreenchange', debouncedCheckAndScroll);
        document.removeEventListener('MSFullscreenChange', debouncedCheckAndScroll);
 
        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('resize', debouncedCheckAndScroll);
 
        if (coreElementsObserver) { coreElementsObserver.disconnect(); coreElementsObserver = null; }
        if (observerTimeoutId) { clearTimeout(observerTimeoutId); observerTimeoutId = null; }
 
        elements = { wideBtn: null, webFullBtn: null, fullBtn: null, player: null, playerContainer: null };
    }
 
    /** 处理键盘按下事件，主要用于检测 ESC 键。 */
    function handleKeyPress(event) {
        if (event.key === 'Escape') {
            debouncedCheckAndScroll();
        }
    }
 
    /** 注册或更新油猴菜单命令。 */
    function registerMenuCommands() {
        if (typeof GM_registerMenuCommand !== 'function' || typeof GM_unregisterMenuCommand !== 'function') return;
 
        registeredCommandIds.forEach(id => {
            try { GM_unregisterMenuCommand(id); } catch (e) {}
        });
        registeredCommandIds = [];
 
        const toggleCommandText = `自动宽屏模式 (当前: ${isEnabled ? '✅ 开启' : '❌ 关闭'})`;
        registeredCommandIds.push(GM_registerMenuCommand(toggleCommandText, toggleWideScreen));
 
        const offsetCommandText = `播放器居中偏移量 (当前: ${playerCenterOffset}px)`;
        registeredCommandIds.push(GM_registerMenuCommand(offsetCommandText, () => {}));
 
        registeredCommandIds.push(GM_registerMenuCommand(`- 减少播放器偏移量 (${OFFSET_STEP}px)`, () => adjustPlayerOffset(-OFFSET_STEP)));
        registeredCommandIds.push(GM_registerMenuCommand(`+ 增加播放器偏移量 (${OFFSET_STEP}px)`, () => adjustPlayerOffset(OFFSET_STEP)));
        registeredCommandIds.push(GM_registerMenuCommand('恢复播放器偏移量为默认值', resetPlayerOffset));
 
        console.log("[B站自动宽屏居中] 菜单命令已更新。");
    }
 
    /** 切换自动宽屏功能的启用/禁用状态。 */
    function toggleWideScreen() {
        const intendedState = !GM_getValue('enableWideScreen', false);
        if (window.confirm(`是否要${intendedState ? "开启" : "关闭"}自动宽屏模式？`)) {
            isEnabled = intendedState;
            GM_setValue('enableWideScreen', isEnabled);
            registerMenuCommands();
 
            if (isEnabled) {
                // 启用时，只点击按钮，不立即滚动
                ensureWideMode();
            } else {
                if (elements.wideBtn && elements.wideBtn.classList.contains('bpx-state-entered')) {
                    elements.wideBtn.click();
                }
            }
            debouncedCheckAndScroll(); // 统一调用防抖函数来处理最终的滚动
        }
    }
 
    /** 调整播放器居中偏移量。 */
    function adjustPlayerOffset(delta) {
        playerCenterOffset += delta;
        GM_setValue('playerCenterOffset', playerCenterOffset);
        console.log(`[B站自动宽屏居中] 播放器居中偏移量已调整为: ${playerCenterOffset}px`);
        registerMenuCommands();
        debouncedCheckAndScroll(); // 统一调用防抖函数来处理最终的滚动
    }
 
    /** 恢复播放器居中偏移量为默认值。 */
    function resetPlayerOffset() {
        if (window.confirm(`是否要恢复播放器居中偏移量为默认值 (${DEFAULT_PLAYER_CENTER_OFFSET}px)？`)) {
            playerCenterOffset = DEFAULT_PLAYER_CENTER_OFFSET;
            GM_setValue('playerCenterOffset', playerCenterOffset);
            console.log(`[B站自动宽屏居中] 播放器居中偏移量已恢复为默认值: ${playerCenterOffset}px`);
            registerMenuCommands();
            debouncedCheckAndScroll(); // 统一调用防抖函数来处理最终的滚动
        }
    }
 
    /**
     * 核心初始化逻辑：尝试缓存元素，如果失败则使用 MutationObserver 等待元素加载。
     */
    function initializeScriptLogic() {
        reInitScheduled = false;
        clearTimeout(initTimeout);
        if (coreElementsObserver) { coreElementsObserver.disconnect(); coreElementsObserver = null; }
        if (observerTimeoutId) { clearTimeout(observerTimeoutId); observerTimeoutId = null; }
 
        console.log("[B站自动宽屏居中] initializeScriptLogic: 开始初始化脚本逻辑...");
 
        if (cacheElements()) {
            console.log("[B站自动宽屏居中] initializeScriptLogic: 核心元素已通过初次尝试成功缓存。");
            setupListeners();
            if (isEnabled) ensureWideMode();
            setTimeout(debouncedCheckAndScroll, FINAL_CHECK_DELAY); // 最终状态检查
            return;
        }
 
        console.log("[B站自动宽屏居中] initializeScriptLogic: 初次缓存失败，设置 MutationObserver。");
 
        const observerCallback = function(mutationsList, observerInstance) {
            if (document.querySelector('#bilibili-player') && document.querySelector('.bpx-player-ctrl-wide')) {
                if (cacheElements()) {
                    console.log("[B站自动宽屏居中] MutationObserver 触发: 核心元素已成功缓存。");
                    observerInstance.disconnect();
                    clearTimeout(observerTimeoutId);
                    coreElementsObserver = null;
                    observerTimeoutId = null;
 
                    setupListeners();
                    if (isEnabled) ensureWideMode();
                    setTimeout(debouncedCheckAndScroll, FINAL_CHECK_DELAY); // 最终状态检查
                }
            }
        };
 
        coreElementsObserver = new MutationObserver(observerCallback);
        let targetNodeToObserve = document.getElementById('playerWrap') || document.getElementById('mirror-vdcon') || document.getElementById('app') || document.body;
        coreElementsObserver.observe(targetNodeToObserve, { childList: true, subtree: true });
 
        observerTimeoutId = setTimeout(() => {
            if (coreElementsObserver) {
                console.error(`[B站自动宽屏居中] MutationObserver 超时 (${OBSERVER_MAX_WAIT_TIME}ms): 未能找到或缓存核心元素。`);
                coreElementsObserver.disconnect();
                coreElementsObserver = null;
            }
        }, OBSERVER_MAX_WAIT_TIME);
    }
 
    /**
     * 安排脚本的重新初始化，通常在检测到页面导航（URL路径变化）时调用。
     */
    function scheduleReInitialization(delay = URL_CHECK_DELAY) {
        if (reInitScheduled) return;
        reInitScheduled = true;
        clearTimeout(initTimeout);
        initTimeout = setTimeout(() => {
            removeListenersAndObserver();
            if (typeof GM_unregisterMenuCommand === 'function') {
                registeredCommandIds.forEach(id => {
                    try { GM_unregisterMenuCommand(id); } catch (e) {}
                });
                registeredCommandIds = [];
            }
            setTimeout(initializeScriptLogic, 100);
        }, delay);
    }
 
    /**
     * 检查给定的URL是否匹配脚本的目标页面规则。
     */
    function isTargetPage(url) {
        return /\/(video|list|bangumi\/play)\//.test(url);
    }
 
    /**
     * 处理URL发生变化（包括SPA导航和历史记录变化）。
     */
    function handleUrlChange() {
        requestAnimationFrame(() => {
            const newHref = window.location.href;
            const newPathname = window.location.pathname;
 
            let oldPathnameFromCurrentUrl = '/';
            if (currentUrl) {
                try {
                    oldPathnameFromCurrentUrl = new URL(currentUrl).pathname;
                } catch (e) {
                    console.warn('[B站自动宽屏居中] 解析旧URL的pathname失败:', currentUrl, e);
                    const doubleSlashIndex = currentUrl.indexOf('//');
                    if (doubleSlashIndex !== -1) {
                        const pathStartIndex = currentUrl.indexOf('/', doubleSlashIndex + 2);
                        if (pathStartIndex !== -1) {
                            const queryIndex = currentUrl.indexOf('?', pathStartIndex);
                            const hashIndex = currentUrl.indexOf('#', pathStartIndex);
                            let endIndex = currentUrl.length;
                            if (queryIndex !== -1) endIndex = queryIndex;
                            if (hashIndex !== -1 && hashIndex < endIndex) endIndex = hashIndex;
                            oldPathnameFromCurrentUrl = currentUrl.substring(pathStartIndex, endIndex);
                        }
                    }
                }
            }
 
            if (newPathname !== oldPathnameFromCurrentUrl) {
                console.log(`[B站自动宽屏居中] Pathname 变化: 从 "${oldPathnameFromCurrentUrl}" 到 "${newPathname}". 触发重新初始化.`);
                const previousFullUrl = currentUrl;
                currentUrl = newHref;
 
                const isNowTarget = isTargetPage(newHref);
                if (isNowTarget) {
                    scheduleReInitialization();
                } else if (isTargetPage(previousFullUrl)) {
                    removeListenersAndObserver();
                    if (typeof GM_unregisterMenuCommand === 'function') {
                        registeredCommandIds.forEach(id => { try { GM_unregisterMenuCommand(id); } catch (e) {} });
                        registeredCommandIds = [];
                    }
                    clearTimeout(initTimeout);
                    reInitScheduled = false;
                }
            } else if (newHref !== currentUrl) {
                currentUrl = newHref;
            }
        });
    }
 
    /** 脚本主入口函数。 */
    function main() {
        console.log(`[B站自动宽屏居中] 脚本开始执行 (main)。版本: ${SCRIPT_VERSION}`);
        isEnabled = GM_getValue('enableWideScreen', false);
        playerCenterOffset = GM_getValue('playerCenterOffset', DEFAULT_PLAYER_CENTER_OFFSET);
 
        if (isTargetPage(currentUrl)) {
            registerMenuCommands();
        }
 
        window.addEventListener('popstate', handleUrlChange);
 
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            const result = originalPushState.apply(this, args);
            window.dispatchEvent(new CustomEvent('historystatechanged'));
            return result;
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            const result = originalReplaceState.apply(this, args);
            window.dispatchEvent(new CustomEvent('historystatechanged'));
            return result;
        };
        window.addEventListener('historystatechanged', handleUrlChange);
 
        if (isTargetPage(currentUrl)) {
            initializeScriptLogic();
        }
 
        window.addEventListener('unload', () => {
            removeListenersAndObserver();
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener('historystatechanged', handleUrlChange);
            window.removeEventListener('popstate', handleUrlChange);
            clearTimeout(initTimeout);
            if (typeof GM_unregisterMenuCommand === 'function') {
                registeredCommandIds.forEach(id => { try { GM_unregisterMenuCommand(id); } catch (e) {} });
                registeredCommandIds = [];
            }
        });
    }
 
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();