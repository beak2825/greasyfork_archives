// ==UserScript==
// @name         B站自动宽屏居中
// @namespace    @ChatGPT
// @version      1.65
// @description  自动宽屏播放并将播放器垂直居中视口，退出宽屏/网页全屏/全屏模式自动滚动页面到顶部。默认关闭自动宽屏。
// @author       Gemini, wha4up (AI Optimized)
// @icon         data:image/webp;base64,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
// @license      MIT
// @match        https://*.bilibili.com/video/*
// @match        https://*.bilibili.com/list/*
// @match        https://*.bilibili.com/bangumi/play/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-idle
// @supportURL   https://greasyfork.org/zh-CN/scripts/492413-b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E5%B1%85%E4%B8%AD/feedback
// @homepageURL  https://greasyfork.org/zh-CN/scripts/492413-b%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E5%B1%85%E4%B8%AD
// @downloadURL https://update.greasyfork.org/scripts/492413/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E5%B1%85%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/492413/B%E7%AB%99%E8%87%AA%E5%8A%A8%E5%AE%BD%E5%B1%8F%E5%B1%85%E4%B8%AD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 配置项 ---
    const PLAYER_CENTER_OFFSET = 75;      // 播放器垂直居中时的偏移量 (像素)
    const CHECK_INTERVAL = 500;           // (waitForElement) 查找元素的间隔时间 (ms)
    const MAX_ATTEMPTS = 20;              // (waitForElement) 查找元素的最大尝试次数
    const DEBOUNCE_DELAY = 200;           // 事件防抖延迟 (ms)
    const URL_CHECK_DELAY = 500;          // URL 变化后执行逻辑的延迟 (ms)
    const FINAL_CHECK_DELAY = 300;        // 初始化或导航后最终检查状态的延迟 (ms)
    const SCROLL_ANIMATION_DURATION = 500;// 预估的平滑滚动动画时长 (ms)
    const OBSERVER_MAX_WAIT_TIME = 15000; // MutationObserver 最长等待时间 (15秒)
    const SCRIPT_VERSION = '1.68-final-review'; // 脚本版本，用于日志记录

    // --- 状态变量 ---
    let elements = {
        wideBtn: null,
        webFullBtn: null,
        fullBtn: null,
        player: null,
        playerContainer: null,
    };
    let isEnabled = GM_getValue('enableWideScreen', false); // 自动宽屏功能是否启用
    let currentUrl = window.location.href;                  // 当前页面的完整URL
    let initTimeout = null;                                 // 初始化延迟计时器
    let reInitScheduled = false;                            // 是否已计划重新初始化
    let lastScrollTime = 0;                                 // 上次滚动时间，用于滚动节流
    let isScrolling = false;                                // 是否正在执行平滑滚动
    let currentMenuCommandText = '';                        // 当前注册的油猴菜单命令文本

    let coreElementsObserver = null;                        // 用于核心元素加载的 MutationObserver
    let observerTimeoutId = null;                           // MutationObserver 的安全超时计时器

    // --- 工具函数 ---

    /**
     * 防抖函数：在事件触发后等待指定延迟，若期间无新触发则执行函数。
     * @param {Function} func 需要防抖的函数
     * @param {number} delay 延迟时间 (ms)
     * @returns {Function} 防抖处理后的函数
     */
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * (辅助函数) 通过轮询等待指定元素出现在 DOM 中。
     * 主要用于 MutationObserver 机制之外的特定元素等待场景。
     * @param {string} selector CSS选择器
     * @param {Function} callback 元素找到后的回调函数，参数为找到的元素或null
     * @param {number} interval 检查间隔 (ms)
     * @param {number} maxAttempts 最大尝试次数
     */
    function waitForElement(selector, callback, interval = CHECK_INTERVAL, maxAttempts = MAX_ATTEMPTS) {
        let attempts = 0;
        // console.log(`[B站自动宽屏居中] (waitForElement) 开始等待元素 "${selector}"`); // 调试时可取消注释
        let intervalId = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                // console.log(`[B站自动宽屏居中] (waitForElement) 元素 "${selector}" 已找到`); // 调试时可取消注释
                clearInterval(intervalId);
                callback(element);
            } else {
                attempts++;
                if (attempts >= maxAttempts) {
                    clearInterval(intervalId);
                    console.warn(`[B站自动宽屏居中] (waitForElement) 元素 "${selector}" 未在 ${maxAttempts * interval}ms 内找到。`);
                    if (typeof callback === 'function') callback(null);
                }
            }
        }, interval);
    }

    /**
     * 平滑滚动到指定的垂直位置 (带节流)。
     * @param {number} topPosition 目标垂直滚动位置
     */
    function scrollToPosition(topPosition) {
        if (isScrolling) return; // 如果已在滚动中，则忽略新的滚动请求
        const now = Date.now();
        // 简单的节流，避免过于频繁的滚动请求
        if (now - lastScrollTime < 100 && Math.abs(window.scrollY - topPosition) < 50) {
            return;
        }
        lastScrollTime = now;
        isScrolling = true;
        window.scrollTo({
            top: topPosition,
            behavior: 'smooth'
        });
        // 预估滚动动画完成时间，在此期间阻止新的滚动
        setTimeout(() => {
            isScrolling = false;
        }, SCROLL_ANIMATION_DURATION);
    }

    /** 滚动页面使播放器大致垂直居中于视口。 */
    function scrollToPlayer() {
        // 确保播放器元素已缓存，如果未缓存则尝试缓存
        if (!elements.player && !cacheElements()) {
             console.warn("[B站自动宽屏居中] scrollToPlayer: 播放器元素未缓存且重新缓存失败。");
             return;
        }
        // 再次检查，确保 elements.player 有效
        if (!elements.player) {
            console.error("[B站自动宽屏居中] scrollToPlayer: 播放器元素 (elements.player) 仍然无效。");
            return;
        }
        // 使用 requestAnimationFrame 优化滚动性能
        requestAnimationFrame(() => {
            const playerRect = elements.player.getBoundingClientRect();
            if (playerRect.height > 0) { // 仅当播放器有高度时执行
                const playerTop = playerRect.top + window.scrollY;
                const desiredScrollTop = playerTop - PLAYER_CENTER_OFFSET;
                // 仅当当前滚动位置与目标位置有显著差异时才滚动
                if (Math.abs(window.scrollY - desiredScrollTop) > 5) {
                    scrollToPosition(desiredScrollTop);
                }
            }
        });
    }

    /** 滚动到页面顶部。 */
    function scrollToTop() {
        if (window.scrollY > 0) {
            scrollToPosition(0);
        }
    }

    /**
     * 缓存播放器及相关的控制按钮等核心DOM元素。
     * @returns {boolean} 如果核心元素（播放器和宽屏按钮）成功缓存则返回true，否则返回false。
     */
    function cacheElements() {
        // console.log("[B站自动宽屏居中] 开始缓存元素 (cacheElements)..."); // 调试时可取消注释
        elements.player = document.querySelector('#bilibili-player');
        if (!elements.player) {
            console.warn("[B站自动宽屏居中] cacheElements: 核心播放器元素 '#bilibili-player' 未找到。");
            return false; // 播放器是必需的
        }

        // 查找播放器容器，有多种可能的选择器
        elements.playerContainer = document.querySelector('.bpx-player-container') ||
                                   document.querySelector('#bilibiliPlayer') || // 兼容旧版选择器
                                   elements.player; // 最差情况回退到播放器主元素

        // 在播放器容器内查找控制按钮
        if (elements.playerContainer) {
            elements.wideBtn = elements.playerContainer.querySelector('.bpx-player-ctrl-wide');
            elements.webFullBtn = elements.playerContainer.querySelector('.bpx-player-ctrl-web');
            elements.fullBtn = elements.playerContainer.querySelector('.bpx-player-ctrl-full');
        } else {
            // 如果播放器容器未明确找到（理论上不太可能，因为有 fallback），尝试全局查找按钮
            console.warn("[B站自动宽屏居中] cacheElements: 'elements.playerContainer' 未明确找到，尝试全局查找按钮。");
            elements.wideBtn = document.querySelector('.bpx-player-ctrl-wide');
            elements.webFullBtn = document.querySelector('.bpx-player-ctrl-web');
            elements.fullBtn = document.querySelector('.bpx-player-ctrl-full');
        }

        if (!elements.wideBtn) {
            console.warn("[B站自动宽屏居中] cacheElements: 未找到宽屏按钮 '.bpx-player-ctrl-wide'。");
            return false; // 宽屏按钮对于核心功能也是必需的
        }

        // 网页全屏和全屏按钮不是核心功能所必需的，仅记录警告
        if (!elements.webFullBtn) {
            // console.warn("[B站自动宽屏居中] cacheElements: 未找到网页全屏按钮 '.bpx-player-ctrl-web'.");
        }
        if (!elements.fullBtn) {
            // console.warn("[B站自动宽屏居中] cacheElements: 未找到全屏按钮 '.bpx-player-ctrl-full'.");
        }
        return true; // 播放器和宽屏按钮都找到，视为成功
    }

    /** 检查播放器当前的宽屏/全屏状态，并据此执行相应的滚动操作。 */
    function checkAndScroll() {
        // 确保核心元素已缓存
        if (!elements.player || !elements.wideBtn) {
            if (!cacheElements()) { // 如果未缓存，尝试再次缓存
                console.error("[B站自动宽屏居中] checkAndScroll: 核心元素缓存失败，无法执行滚动逻辑。");
                return;
            }
        }

        const isWide = elements.wideBtn.classList.contains('bpx-state-entered');
        const isWebFull = elements.webFullBtn && elements.webFullBtn.classList.contains('bpx-state-entered');
        const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

        // 根据状态执行滚动
        if (isWide && !isWebFull && !isFull) { // 仅在宽屏模式（非网页全屏/全屏）下居中播放器
            scrollToPlayer();
        } else if (!isWide && !isWebFull && !isFull) { // 非任何特殊模式时，滚动到顶部
            scrollToTop();
        }
        // 其他情况（网页全屏/全屏）不执行滚动
    }

    /** 防抖处理的 checkAndScroll，用于 resize 事件，避免频繁触发。 */
    const debouncedCheckAndScroll = debounce(checkAndScroll, DEBOUNCE_DELAY);

    /** 如果启用了自动宽屏，确保播放器处于宽屏模式。 */
    function ensureWideMode() {
        if (!isEnabled) return; // 如果未启用自动宽屏，则不执行任何操作

        // 确保宽屏按钮已缓存
        if (!elements.wideBtn && !cacheElements()) {
             console.error("[B站自动宽屏居中] ensureWideMode: 宽屏按钮无法缓存。");
             return;
        }
        if (!elements.wideBtn) { // 再次检查
            console.error("[B站自动宽屏居中] ensureWideMode: 宽屏按钮 (elements.wideBtn) 仍然无效。");
            return;
        }

        const isCurrentlyWide = elements.wideBtn.classList.contains('bpx-state-entered');
        const isWebFull = elements.webFullBtn && elements.webFullBtn.classList.contains('bpx-state-entered');
        const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);

        // 如果当前不是宽屏，也不是网页全屏或全屏，则点击宽屏按钮
        if (!isCurrentlyWide && !isWebFull && !isFull) {
            elements.wideBtn.click();
            setTimeout(checkAndScroll, 200); // 点击后稍作延迟再检查滚动状态
        } else if (isCurrentlyWide && !isWebFull && !isFull) {
            // 如果已经是宽屏模式（且非其他全屏），则执行一次检查滚动
            checkAndScroll();
        }
    }

    /** 设置事件监听器。 */
    function setupListeners() {
        removeListenersAndObserver(); // 先移除旧的监听器和Observer，确保清洁状态
        console.log("[B站自动宽屏居中] setupListeners: 开始设置事件监听器。");

        if (!cacheElements()) { // 确保元素已缓存
            console.error("[B站自动宽屏居中] setupListeners: 核心元素查找失败，无法设置监听器。");
            return;
        }

        // 为播放器控制按钮添加点击事件监听
        elements.wideBtn.addEventListener('click', handleWideBtnClick);
        if (elements.webFullBtn) elements.webFullBtn.addEventListener('click', checkAndScroll);
        if (elements.fullBtn) elements.fullBtn.addEventListener('click', checkAndScroll);

        // 为视频区域添加双击事件监听（双击通常也可能改变全屏状态）
        const videoArea = elements.playerContainer?.querySelector('.bpx-player-video-area');
        if (videoArea) videoArea.addEventListener('dblclick', checkAndScroll);

        // 监听全屏状态变化事件
        document.addEventListener('fullscreenchange', checkAndScroll);
        document.addEventListener('webkitfullscreenchange', checkAndScroll); // 兼容 WebKit 内核
        document.addEventListener('mozfullscreenchange', checkAndScroll);    // 兼容 Firefox
        document.addEventListener('MSFullscreenChange', checkAndScroll);     // 兼容 IE/Edge (旧版)

        // 监听键盘事件 (主要用于处理 ESC 键退出全屏)
        document.addEventListener('keydown', handleKeyPress);
        // 监听窗口大小变化事件
        window.addEventListener('resize', debouncedCheckAndScroll);
        console.log("[B站自动宽屏居中] setupListeners: 事件监听器设置完成。");
    }

    /** 移除所有已添加的事件监听器和 MutationObserver。 */
    function removeListenersAndObserver() {
        console.log("[B站自动宽屏居中] removeListenersAndObserver: 开始清理监听器和Observer。");

        // 移除按钮点击事件
        if (elements.wideBtn) elements.wideBtn.removeEventListener('click', handleWideBtnClick);
        if (elements.webFullBtn) elements.webFullBtn.removeEventListener('click', checkAndScroll);
        if (elements.fullBtn) elements.fullBtn.removeEventListener('click', checkAndScroll);

        // 移除视频区域双击事件 (需要重新获取容器以防 elements 对象被清空)
        const currentContainer = elements.playerContainer || document.querySelector('.bpx-player-container') || document.querySelector('#bilibiliPlayer');
        const videoArea = currentContainer?.querySelector('.bpx-player-video-area');
        if (videoArea) videoArea.removeEventListener('dblclick', checkAndScroll);

        // 移除全屏状态变化事件
        document.removeEventListener('fullscreenchange', checkAndScroll);
        document.removeEventListener('webkitfullscreenchange', checkAndScroll);
        document.removeEventListener('mozfullscreenchange', checkAndScroll);
        document.removeEventListener('MSFullscreenChange', checkAndScroll);

        // 移除键盘和窗口大小变化事件
        document.removeEventListener('keydown', handleKeyPress);
        window.removeEventListener('resize', debouncedCheckAndScroll);

        // 断开并清理 MutationObserver
        if (coreElementsObserver) {
            coreElementsObserver.disconnect();
            coreElementsObserver = null;
            console.log("[B站自动宽屏居中] CoreElements MutationObserver 已断开。");
        }
        if (observerTimeoutId) {
            clearTimeout(observerTimeoutId);
            observerTimeoutId = null;
        }

        // 重置缓存的元素对象
        elements = { wideBtn: null, webFullBtn: null, fullBtn: null, player: null, playerContainer: null };
        console.log("[B站自动宽屏居中] removeListenersAndObserver: 清理完成。");
    }

    /** 处理键盘按下事件，主要用于检测 ESC 键。 */
    function handleKeyPress(event) {
        if (event.key === 'Escape') {
            // ESC 键通常用于退出全屏或网页全屏，延迟检查状态
            setTimeout(checkAndScroll, 150);
        }
    }

    /** 注册或更新油猴菜单命令，用于切换自动宽屏功能的启用状态。 */
    function registerMenuCommand() {
        // 确保 GM API 可用
        if (typeof GM_registerMenuCommand !== 'function' || typeof GM_unregisterMenuCommand !== 'function') return;

        const newCommandText = `自动宽屏模式 (当前: ${isEnabled ? '✅ 开启' : '❌ 关闭'})`;
        // 如果菜单文本发生变化，先尝试注销旧命令
        if (currentMenuCommandText && currentMenuCommandText !== newCommandText) {
            try { GM_unregisterMenuCommand(currentMenuCommandText); } catch (e) {
                console.warn("[B站自动宽屏居中] 注销旧菜单命令失败:", e);
            }
        }
        // 注册新命令
        try {
            GM_registerMenuCommand(newCommandText, toggleWideScreen);
            currentMenuCommandText = newCommandText; // 更新当前命令文本记录
        } catch (e) {
            console.error("[B站自动宽屏居中] 注册新菜单命令失败:", e);
        }
    }

    /** 切换自动宽屏功能的启用/禁用状态。 */
    function toggleWideScreen() {
        const intendedState = !GM_getValue('enableWideScreen', false); // 获取预期的下一个状态
        // 弹出确认框，让用户确认操作
        if (window.confirm(`是否要${intendedState ? "开启" : "关闭"}自动宽屏模式？`)) {
            isEnabled = intendedState;
            GM_setValue('enableWideScreen', isEnabled); // 保存设置
            registerMenuCommand(); // 更新菜单显示

            if (isEnabled) { // 如果开启自动宽屏
                ensureWideMode(); // 确保进入宽屏模式
            } else { // 如果关闭自动宽屏
                // 如果当前处于宽屏模式，则模拟点击宽屏按钮退出宽屏
                if (elements.wideBtn && elements.wideBtn.classList.contains('bpx-state-entered')) {
                    elements.wideBtn.click();
                }
                setTimeout(checkAndScroll, 100); // 稍作延迟后检查滚动状态
            }
        }
    }

    /** 处理宽屏按钮被点击的事件。 */
    function handleWideBtnClick() {
        checkAndScroll(); // 立即检查一次
        setTimeout(checkAndScroll, 200); // 延迟后再次检查，确保状态更新
    }

    /**
     * 核心初始化逻辑：尝试缓存元素，如果失败则使用 MutationObserver 等待元素加载。
     */
    function initializeScriptLogic() {
        reInitScheduled = false; // 重置重新初始化计划标志
        clearTimeout(initTimeout); // 清除可能存在的初始化延迟计时器

        // 清理任何可能存在的旧 Observer 和其超时
        if (coreElementsObserver) { coreElementsObserver.disconnect(); coreElementsObserver = null; }
        if (observerTimeoutId) { clearTimeout(observerTimeoutId); observerTimeoutId = null; }

        console.log("[B站自动宽屏居中] initializeScriptLogic: 开始初始化脚本逻辑...");

        // 1. 尝试立即缓存核心元素
        if (cacheElements()) {
            console.log("[B站自动宽屏居中] initializeScriptLogic: 核心元素已通过初次尝试成功缓存。");
            setupListeners();      // 设置事件监听
            if (isEnabled) ensureWideMode(); // 如果启用，则确保宽屏
            setTimeout(checkAndScroll, FINAL_CHECK_DELAY); // 最终状态检查
            return; // 初始化成功，结束
        }

        // 2. 如果初次缓存失败，则设置 MutationObserver 等待元素出现
        console.log("[B站自动宽屏居中] initializeScriptLogic: 初次缓存失败，设置 MutationObserver。");

        const observerCallback = function(mutationsList, observerInstance) {
            // 检查核心元素（播放器和宽屏按钮）是否已出现在DOM中
            if (document.querySelector('#bilibili-player') && document.querySelector('.bpx-player-ctrl-wide')) {
                console.log("[B站自动宽屏居中] MutationObserver 检测到变化，尝试重新缓存元素。");
                if (cacheElements()) { // 再次尝试缓存
                    console.log("[B站自动宽屏居中] MutationObserver 触发: 核心元素已成功缓存。");
                    observerInstance.disconnect();      // 成功找到，停止观察
                    clearTimeout(observerTimeoutId);    // 清除安全超时
                    coreElementsObserver = null;        // 清理 observer 实例变量
                    observerTimeoutId = null;

                    setupListeners();                   // 设置事件监听
                    if (isEnabled) ensureWideMode();    // 如果启用，则确保宽屏
                    setTimeout(checkAndScroll, FINAL_CHECK_DELAY); // 最终状态检查
                } else {
                    // 此情况理论上较少发生：querySelector 找到了基本元素，但 cacheElements 内部的完整检查仍失败
                    console.warn("[B站自动宽屏居中] MutationObserver 触发: querySelector 找到基本元素，但 cacheElements 完整检查失败。");
                }
            }
        };

        coreElementsObserver = new MutationObserver(observerCallback);

        // 选择一个合适的父节点进行观察，目标是尽早发现播放器相关元素的注入
        // 尝试的顺序：#playerWrap -> #mirror-vdcon -> #app -> document.body
        let targetNodeToObserve = document.getElementById('playerWrap') ||
                                  document.getElementById('mirror-vdcon') ||
                                  document.getElementById('app') ||
                                  document.body; // 最差情况观察整个 body

        console.log("[B站自动宽屏居中] MutationObserver 将开始观察节点:", targetNodeToObserve.id || targetNodeToObserve.tagName);
        coreElementsObserver.observe(targetNodeToObserve, { childList: true, subtree: true });

        // 设置一个最长等待超时，防止 MutationObserver 无限期运行
        observerTimeoutId = setTimeout(() => {
            if (coreElementsObserver) { // 检查 Observer 是否仍然存在 (可能已被成功回调清除)
                console.error(`[B站自动宽屏居中] MutationObserver 超时 (${OBSERVER_MAX_WAIT_TIME}ms): 未能找到或缓存核心元素。`);
                coreElementsObserver.disconnect();
                coreElementsObserver = null;
            }
        }, OBSERVER_MAX_WAIT_TIME);
    }

    /**
     * 安排脚本的重新初始化，通常在检测到页面导航（URL路径变化）时调用。
     * @param {number} delay 重新初始化前的延迟时间 (ms)
     */
    function scheduleReInitialization(delay = URL_CHECK_DELAY) {
        if (reInitScheduled) return; // 如果已安排，则不再重复安排
        reInitScheduled = true;
        clearTimeout(initTimeout); // 清除之前的延迟计时器
        console.log(`[B站自动宽屏居中] scheduleReInitialization: 安排在 ${delay}ms 后重新初始化。`);
        initTimeout = setTimeout(() => {
            removeListenersAndObserver(); // 清理旧的监听器和状态
            setTimeout(initializeScriptLogic, 100); // 短暂延迟后开始新的初始化
        }, delay);
    }

    /**
     * 检查给定的URL是否匹配脚本的目标页面规则。
     * @param {string} url 要检查的URL
     * @returns {boolean} 如果是目标页面则返回true，否则返回false
     */
    function isTargetPage(url) {
        return /\/(video|list|bangumi\/play)\//.test(url); // 匹配视频页、列表页、番剧播放页
    }

    /**
     * 处理URL发生变化（包括SPA导航和历史记录变化）。
     * 主要通过比较URL的pathname部分来判断是否需要重新初始化脚本。
     */
    function handleUrlChange() {
        // 使用 requestAnimationFrame 确保在浏览器下一次重绘前执行，优化性能
        requestAnimationFrame(() => {
            const newHref = window.location.href;
            const newPathname = window.location.pathname;

            let oldPathnameFromCurrentUrl = '/'; // 默认值，以防 currentUrl 解析失败
            if (currentUrl) { // 确保 currentUrl 有值
                try {
                    // currentUrl 存储的是上一次检查时的完整 href
                    oldPathnameFromCurrentUrl = new URL(currentUrl).pathname;
                } catch (e) {
                    console.warn('[B站自动宽屏居中] 解析旧URL的pathname失败:', currentUrl, e);
                    // 备用方案：尝试从旧的完整URL中提取路径部分
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

            // 仅当 URL 的路径部分 (pathname) 发生变化时，才认为需要重新初始化
            if (newPathname !== oldPathnameFromCurrentUrl) {
                console.log(`[B站自动宽屏居中] Pathname 变化: 从 "${oldPathnameFromCurrentUrl}" 到 "${newPathname}". 触发重新初始化.`);
                const previousFullUrl = currentUrl; // 保存变化前的完整URL，用于isTargetPage判断
                currentUrl = newHref; // 更新当前URL记录为新的完整URL

                const wasTarget = isTargetPage(previousFullUrl);
                const isNowTarget = isTargetPage(newHref);

                if (isNowTarget) { // 如果新URL是目标页面
                    scheduleReInitialization();
                } else if (wasTarget && !isNowTarget) { // 如果从目标页面导航到非目标页面
                    console.log("[B站自动宽屏居中] 从目标页面导航到非目标页面 (Pathname change)，移除监听器。");
                    removeListenersAndObserver();
                    clearTimeout(initTimeout); // 取消任何待处理的重新初始化
                    reInitScheduled = false;
                }
            } else if (newHref !== currentUrl) {
                // Pathname 未变，但完整 URL (可能查询参数或哈希值) 变了。
                // 此时仅更新 currentUrl 记录，不触发重新初始化。
                // console.log(`[B站自动宽屏居中] URL (query/hash) 变化，Pathname 未变. 不重新初始化.`); // 调试时可取消注释
                currentUrl = newHref;
            }
        });
    }

    /** 脚本主入口函数。 */
    function main() {
        console.log(`[B站自动宽屏居中] 脚本开始执行 (main)。版本: ${SCRIPT_VERSION}`);
        isEnabled = GM_getValue('enableWideScreen', false); // 读取用户保存的设置
        registerMenuCommand(); // 注册油猴菜单

        // 监听浏览器历史记录变化 (前进/后退按钮)
        window.addEventListener('popstate', handleUrlChange);

        // 劫持 history.pushState 和 history.replaceState 以监听SPA导航
        const originalPushState = history.pushState;
        history.pushState = function(...args) {
            const result = originalPushState.apply(this, args);
            window.dispatchEvent(new CustomEvent('historystatechanged')); // 触发自定义事件
            return result;
        };
        const originalReplaceState = history.replaceState;
        history.replaceState = function(...args) {
            const result = originalReplaceState.apply(this, args);
            window.dispatchEvent(new CustomEvent('historystatechanged')); // 触发自定义事件
            return result;
        };
        // 监听自定义的 history state 变化事件
        window.addEventListener('historystatechanged', handleUrlChange);

        // 初始加载时，如果当前页面是目标页面，则初始化脚本
        if (isTargetPage(currentUrl)) { // currentUrl 已在顶部初始化
            initializeScriptLogic();
        }

        // 页面卸载时执行清理操作
        window.addEventListener('unload', () => {
            removeListenersAndObserver();
            history.pushState = originalPushState;
            history.replaceState = originalReplaceState;
            window.removeEventListener('historystatechanged', handleUrlChange);
            window.removeEventListener('popstate', handleUrlChange);
            clearTimeout(initTimeout);
        });
    }

    // --- 启动脚本 ---
    // 等待 DOM 内容加载完成后执行 main 函数
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main(); // 如果 DOM 已加载，则直接执行
    }
})();