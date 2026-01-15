// ==UserScript==
// @name         视频临时倍速+B站字幕开关记忆+播放器自动滚动
// @namespace    http://tampermonkey.net/
// @version      2.7.2
// @description  视频播放增强：1. 长按左键临时加速 2. B站字幕开关记忆 3. B站播放器自动滚动定位
// @author       Alonewinds
// @match        *://*/*
// @exclude      *://*/iframe/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @license      MIT
// @icon         https://s1.aigei.com/src/img/png/a6/a6c975c4efb84ebea1126c902f7daf1f.png?e=2051020800&token=P7S2Xpzfz11vAkASLTkfHN7Fw-oOZBecqeJaxypL:t5hcie9Hw5PjZfuwchVYoN5lrlo=
// @downloadURL https://update.greasyfork.org/scripts/521942/%E8%A7%86%E9%A2%91%E4%B8%B4%E6%97%B6%E5%80%8D%E9%80%9F%2BB%E7%AB%99%E5%AD%97%E5%B9%95%E5%BC%80%E5%85%B3%E8%AE%B0%E5%BF%86%2B%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/521942/%E8%A7%86%E9%A2%91%E4%B8%B4%E6%97%B6%E5%80%8D%E9%80%9F%2BB%E7%AB%99%E5%AD%97%E5%B9%95%E5%BC%80%E5%85%B3%E8%AE%B0%E5%BF%86%2B%E6%92%AD%E6%94%BE%E5%99%A8%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.location.hostname.includes('bilibili.com') &&
        window.self !== window.top &&
        window.location.hostname !== 'player.bilibili.com') {
        return;
    }

    // 默认配置
    const config = {
        speedRate: GM_getValue('speedRate', 2.0),
        minPressTime: 200,
        selectors: {
            'www.bilibili.com': '.bpx-player-video-area',
            'www.youtube.com': '.html5-video-player',
            'default': '.video-controls, .progress-bar, [role="slider"]'
        },
        debug: false
    };

    // 字幕相关常量选择器
    const SUBTITLE_SELECTORS = {
        VIDEO_WRAP: '.bpx-player-video-wrap',
        VIDEO: 'video',
        SUBTITLE_BUTTON: '.bpx-player-ctrl-subtitle-result',
        SUBTITLE_TOGGLE: '.bpx-player-ctrl-btn.bpx-player-ctrl-subtitle',
        // 支持多种中文字幕格式：zh-CN, zh-Hans, ai-zh, ai-zh-Hans 等
        // 注意：列表按优先级排序，AI字幕优先
        CHINESE_LANGUAGE_OPTIONS: [
            '.bpx-player-ctrl-subtitle-language-item[data-lan^="ai-zh"]',  // AI中文字幕（任意前缀）
            '.bpx-player-ctrl-subtitle-language-item[data-lan="zh-Hans"]', // 简体中文
            '.bpx-player-ctrl-subtitle-language-item[data-lan="zh-CN"]',   // 中文（中国）
            '.bpx-player-ctrl-subtitle-language-item[data-lan^="zh"]'      // 任意以zh开头的字幕
        ],
        // 任意激活的语言选项
        ACTIVE_LANGUAGE: '.bpx-player-ctrl-subtitle-language-item.bpx-state-active',
        // 原始字幕关闭按钮（Origin Section）
        CLOSE_SUBTITLE_SWITCH: '.bpx-player-ctrl-subtitle-close-switch',
        CLOSE_SUBTITLE_ACTIVE: '.bpx-player-ctrl-subtitle-close-switch.bpx-state-active',
        // 翻译字幕关闭按钮（Translation Section）- B站新版播放器有两个独立的字幕区域
        CLOSE_TRANSLATION_SWITCH: '.bpx-player-ctrl-translation-close-switch',
        CLOSE_TRANSLATION_ACTIVE: '.bpx-player-ctrl-translation-close-switch.bpx-state-active',
        // 字幕面板（新版class名）
        SUBTITLE_PANEL: '.bpx-player-ctrl-subtitle-menu',
        MAX_RETRIES: 5
    };

    const TIMING = {
        INITIAL_SUBTITLE_DELAY: 3000,  // 增加延迟，等待B站原生逻辑完成
        SUBTITLE_CHECK_INTERVAL: 500,
        LANGUAGE_CLICK_DELAY: 500,     // 增加延迟以确保菜单完全渲染
        VERIFY_DELAY: 1000             // 操作后验证延迟
    };

    // ================ 播放器滚动定位配置 ================
    const SCROLL_CONFIG = {
        enabled: GM_getValue('scrollEnabled', true),  // 功能开关
        topOffset: GM_getValue('topOffset', null),
        scrollDelay: GM_getValue('scrollDelay', 1500),
        scrollDuration: 300
    };

    const PLAYER_SELECTORS = [
        '#bilibili-player',
        '.bpx-player-container',
        '#player_module',
        '.player-wrap',
        '#playerWrap'
    ];

    const HEADER_SELECTORS = [
        '.bili-header.fixed-header',
        '.fixed-header',
        '#biliMainHeader',
        '.bili-header__bar',
        '#internationalHeader',
        '.mini-header'
    ];

    // 状态变量
    let pressStartTime = 0;
    let originalSpeed = 1.0;
    let isPressed = false;
    let activeVideo = null;
    let isLongPress = false;
    let preventNextClick = false;

    // B站字幕相关变量
    let subtitleCheckTimer = null;
    let animationFrameId = null;
    let urlObserver = null;
    let isAutoSetting = false;

    // 播放器滚动相关变量
    let scrollAdjustModeActive = false;
    let currentScrollAdjustOffset = 0;
    let scrollAdjustIndicator = null;
    let scrollTimeout = null;
    let lastScrollUrl = location.href;

    // 调试日志函数
    function debugLog(...args) {
        if (config.debug) {
            console.log(...args);
        }
    }

    // ================ 字幕功能 ================

    // 获取保存的字幕状态：返回 { enabled: boolean, language: string|null }
    function getGlobalSubtitleState() {
        const state = GM_getValue('globalSubtitleState', { enabled: false, language: null });
        // 兼容旧版本的布尔值格式
        if (typeof state === 'boolean') {
            return { enabled: state, language: null };
        }
        return state;
    }

    // 保存字幕状态：同时保存开关状态和具体的语言类型
    function saveGlobalSubtitleState(isOpen, language = null) {
        const state = { enabled: isOpen, language: language };
        GM_setValue('globalSubtitleState', state);
        debugLog('保存字幕状态:', state);
    }

    // 获取当前激活的字幕语言
    function getActiveSubtitleLanguage() {
        const activeItem = document.querySelector(SUBTITLE_SELECTORS.ACTIVE_LANGUAGE);
        return activeItem ? activeItem.getAttribute('data-lan') : null;
    }

    function isSubtitleOn() {
        // 方法1：检查原始字幕"关闭"按钮是否激活
        const originCloseSwitch = document.querySelector(SUBTITLE_SELECTORS.CLOSE_SUBTITLE_ACTIVE);
        // 方法2：检查翻译字幕"关闭"按钮是否激活
        const translationCloseSwitch = document.querySelector(SUBTITLE_SELECTORS.CLOSE_TRANSLATION_ACTIVE);

        // 如果两个关闭按钮都激活，说明字幕已关闭
        // 如果任一区域有字幕开启，则认为字幕是开启的
        const originClosed = !!originCloseSwitch;
        const translationClosed = !!translationCloseSwitch || !document.querySelector(SUBTITLE_SELECTORS.CLOSE_TRANSLATION_SWITCH);

        // 如果两个区域都关闭了，字幕才算关闭
        if (originClosed && translationClosed) {
            return false;
        }

        // 方法3：检查是否有任意语言选项处于激活状态
        const activeLanguageItem = document.querySelector(SUBTITLE_SELECTORS.ACTIVE_LANGUAGE);
        if (activeLanguageItem) {
            return true;
        }

        // 方法4：检查字幕按钮本身是否有激活状态
        const subtitleBtn = document.querySelector(SUBTITLE_SELECTORS.SUBTITLE_TOGGLE);
        if (subtitleBtn && subtitleBtn.classList.contains('bpx-state-active')) {
            return true;
        }

        // 默认返回false
        return false;
    }

    function setSubtitleState(desiredState, preferredLanguage = null) {
        if (isAutoSetting) return;

        isAutoSetting = true;
        let retryCount = 0;

        const intervalId = setInterval(() => {
            if (retryCount >= SUBTITLE_SELECTORS.MAX_RETRIES) {
                clearInterval(intervalId);
                isAutoSetting = false;
                return;
            }
            retryCount++;

            const subtitleToggle = document.querySelector(SUBTITLE_SELECTORS.SUBTITLE_TOGGLE);
            if (!subtitleToggle) return;

            clearInterval(intervalId);

            const currentState = isSubtitleOn();
            const currentLanguage = getActiveSubtitleLanguage();

            // 如果状态和语言都匹配，无需操作
            if (currentState === desiredState && (!desiredState || currentLanguage === preferredLanguage)) {
                isAutoSetting = false;
                return;
            }

            // 点击字幕按钮打开菜单
            subtitleToggle.click();

            setTimeout(() => {
                if (desiredState) {
                    // 开启字幕：优先选择用户之前选择的语言
                    let clicked = false;

                    // 首先尝试用户之前选择的语言
                    if (preferredLanguage) {
                        const preferredOption = document.querySelector(
                            `.bpx-player-ctrl-subtitle-language-item[data-lan="${preferredLanguage}"]`
                        );
                        if (preferredOption) {
                            preferredOption.click();
                            debugLog('自动恢复字幕语言:', preferredLanguage);
                            clicked = true;
                        }
                    }

                    // 如果找不到用户之前的选择，按优先级尝试中文选项
                    if (!clicked) {
                        for (const selector of SUBTITLE_SELECTORS.CHINESE_LANGUAGE_OPTIONS) {
                            const option = document.querySelector(selector);
                            if (option) {
                                option.click();
                                debugLog('自动开启字幕（按优先级选择）:', selector);
                                clicked = true;
                                break;
                            }
                        }
                    }

                    // 如果还是没找到，尝试第一个可用选项
                    if (!clicked) {
                        const firstOption = document.querySelector('.bpx-player-ctrl-subtitle-language-item:not(.bpx-state-active)');
                        if (firstOption) {
                            firstOption.click();
                            debugLog('自动开启字幕（使用第一个可用选项）');
                        }
                    }
                } else {
                    // 关闭字幕：需要同时关闭原始字幕和翻译字幕两个区域
                    // 定义关闭函数
                    const performClose = () => {
                        // 关闭原始字幕区域
                        const originCloseSwitch = document.querySelector(SUBTITLE_SELECTORS.CLOSE_SUBTITLE_SWITCH);
                        if (originCloseSwitch && !originCloseSwitch.classList.contains('bpx-state-active')) {
                            originCloseSwitch.click();
                            debugLog('自动关闭原始字幕');
                        }
                        // 关闭翻译字幕区域
                        const translationCloseSwitch = document.querySelector(SUBTITLE_SELECTORS.CLOSE_TRANSLATION_SWITCH);
                        if (translationCloseSwitch && !translationCloseSwitch.classList.contains('bpx-state-active')) {
                            translationCloseSwitch.click();
                            debugLog('自动关闭翻译字幕');
                        }
                    };

                    // 首次尝试关闭
                    performClose();

                    // 验证关闭是否成功，如果没成功则重试
                    setTimeout(() => {
                        if (isSubtitleOn()) {
                            debugLog('关闭未成功，重试关闭...');
                            // 重新打开菜单
                            const toggle = document.querySelector(SUBTITLE_SELECTORS.SUBTITLE_TOGGLE);
                            if (toggle) toggle.click();
                            setTimeout(performClose, 300);
                        }
                    }, TIMING.VERIFY_DELAY);
                }

                setTimeout(() => {
                    isAutoSetting = false;
                }, 500 + TIMING.VERIFY_DELAY);

            }, TIMING.LANGUAGE_CLICK_DELAY);

        }, TIMING.SUBTITLE_CHECK_INTERVAL);
    }

    function initSubtitleAutoOpen() {
        checkAndInitVideoListener();

        const observer = new MutationObserver(() => {
            checkAndInitVideoListener();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setupSubtitleButtonListener();
    }

    function checkAndInitVideoListener() {
        const videoWrapElement = document.querySelector(SUBTITLE_SELECTORS.VIDEO_WRAP);
        if (!videoWrapElement) return;

        const videoElement = videoWrapElement.querySelector(SUBTITLE_SELECTORS.VIDEO);
        if (!videoElement) return;

        videoElement.removeEventListener('loadeddata', onVideoLoaded);
        videoElement.addEventListener('loadeddata', onVideoLoaded);
    }

    function onVideoLoaded() {
        setTimeout(applySubtitleMemory, TIMING.INITIAL_SUBTITLE_DELAY);
    }

    function applySubtitleMemory() {
        const rememberedState = getGlobalSubtitleState();
        debugLog('应用保存的字幕状态:', rememberedState);
        setSubtitleState(rememberedState.enabled, rememberedState.language);
    }

    function setupSubtitleButtonListener() {
        const subtitleObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            // 检测新版字幕菜单面板
                            if (node.classList && (
                                node.classList.contains('bpx-player-ctrl-subtitle-menu') ||
                                node.classList.contains('bpx-player-ctrl-subtitle-panel') ||
                                node.querySelector('.bpx-player-ctrl-subtitle-menu') ||
                                node.querySelector('.bpx-player-ctrl-subtitle-panel')
                            )) {
                                setTimeout(() => {
                                    setupSubtitleOptionListeners();
                                }, 100);
                            }
                        }
                    });
                }
            });
        });

        subtitleObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        document.addEventListener('click', (e) => {
            const subtitleToggle = e.target.closest(SUBTITLE_SELECTORS.SUBTITLE_TOGGLE);
            if (subtitleToggle && !isAutoSetting) {
                setTimeout(() => {
                    const currentState = isSubtitleOn();
                    const currentLanguage = getActiveSubtitleLanguage();
                    saveGlobalSubtitleState(currentState, currentLanguage);
                    debugLog('用户点击字幕按钮，保存状态:', currentState, currentLanguage);
                }, 1000);
            }
        }, true);
    }

    function setupSubtitleOptionListeners() {
        // 获取所有语言选项和关闭按钮
        const languageOptions = document.querySelectorAll('.bpx-player-ctrl-subtitle-language-item');
        const originCloseSwitch = document.querySelector(SUBTITLE_SELECTORS.CLOSE_SUBTITLE_SWITCH);
        const translationCloseSwitch = document.querySelector(SUBTITLE_SELECTORS.CLOSE_TRANSLATION_SWITCH);

        // 为所有语言选项添加监听器
        languageOptions.forEach(option => {
            if (!option._hasListener) {
                option._hasListener = true;
                option.addEventListener('click', () => {
                    if (isAutoSetting) return;

                    setTimeout(() => {
                        const currentState = isSubtitleOn();
                        const currentLanguage = getActiveSubtitleLanguage();
                        saveGlobalSubtitleState(currentState, currentLanguage);
                        debugLog('用户选择字幕语言，保存状态:', currentState, currentLanguage);
                    }, 500);
                });
            }
        });

        // 为原始字幕关闭按钮添加监听器
        if (originCloseSwitch && !originCloseSwitch._hasListener) {
            originCloseSwitch._hasListener = true;
            originCloseSwitch.addEventListener('click', () => {
                if (isAutoSetting) return;

                setTimeout(() => {
                    const currentState = isSubtitleOn();
                    // 关闭时language传null
                    saveGlobalSubtitleState(currentState, null);
                    debugLog('用户点击关闭原始字幕，保存状态:', currentState);
                }, 500);
            });
        }

        // 为翻译字幕关闭按钮添加监听器
        if (translationCloseSwitch && !translationCloseSwitch._hasListener) {
            translationCloseSwitch._hasListener = true;
            translationCloseSwitch.addEventListener('click', () => {
                if (isAutoSetting) return;

                setTimeout(() => {
                    const currentState = isSubtitleOn();
                    // 关闭时language传null
                    saveGlobalSubtitleState(currentState, null);
                    debugLog('用户点击关闭翻译字幕，保存状态:', currentState);
                }, 500);
            });
        }
    }

    // ================ 播放器滚动定位功能 ================

    function getPlayerElement() {
        for (const selector of PLAYER_SELECTORS) {
            const element = document.querySelector(selector);
            if (element) return element;
        }
        return null;
    }

    function detectHeaderHeight() {
        let maxHeight = 0;

        for (const selector of HEADER_SELECTORS) {
            const header = document.querySelector(selector);
            if (header) {
                const style = window.getComputedStyle(header);
                const position = style.position;

                if (position === 'fixed' || position === 'sticky') {
                    const rect = header.getBoundingClientRect();
                    if (rect.top <= 10) {
                        maxHeight = Math.max(maxHeight, rect.height);
                    }
                }
            }
        }

        if (maxHeight === 0) {
            const allElements = document.querySelectorAll('*');
            for (const el of allElements) {
                const style = window.getComputedStyle(el);
                if (style.position === 'fixed' || style.position === 'sticky') {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 10 && rect.height > 20 && rect.width > window.innerWidth * 0.5) {
                        maxHeight = Math.max(maxHeight, rect.bottom);
                    }
                }
            }
        }

        return maxHeight;
    }

    function getEffectiveScrollOffset() {
        if (SCROLL_CONFIG.topOffset !== null) {
            return SCROLL_CONFIG.topOffset;
        }
        return detectHeaderHeight();
    }

    function smoothScrollTo(targetY, duration = SCROLL_CONFIG.scrollDuration) {
        const startY = window.scrollY;
        const distance = targetY - startY;
        const startTime = performance.now();

        function easeOutCubic(t) {
            return 1 - Math.pow(1 - t, 3);
        }

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeProgress = easeOutCubic(progress);

            window.scrollTo(0, startY + distance * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function scrollPlayerToPosition(customOffset = null) {
        const player = getPlayerElement();
        if (!player) {
            return false;
        }

        const offset = customOffset !== null ? customOffset : getEffectiveScrollOffset();
        const playerRect = player.getBoundingClientRect();
        const currentScrollY = window.scrollY;

        const targetScrollY = currentScrollY + playerRect.top - offset;
        const finalScrollY = Math.max(0, targetScrollY);

        smoothScrollTo(finalScrollY);
        return true;
    }

    function showScrollToast(message, duration = 1500) {
        const existing = document.getElementById('player-scroll-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'player-scroll-toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.85);
            color: #fff;
            padding: 12px 28px;
            border-radius: 8px;
            font-size: 14px;
            z-index: 999999;
            transition: opacity 0.3s;
            pointer-events: none;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    function createScrollAdjustIndicator() {
        if (scrollAdjustIndicator) return scrollAdjustIndicator;

        const indicator = document.createElement('div');
        indicator.id = 'offset-adjust-indicator';
        indicator.innerHTML = `
            <div style="background: linear-gradient(135deg, #00a1d6, #00b5e5); color: white; padding: 16px 24px; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,161,214,0.4); font-family: system-ui, -apple-system, sans-serif;">
                <div style="font-size: 16px; font-weight: bold; margin-bottom: 12px;">🎯 可视化调整模式</div>
                <div style="font-size: 28px; font-weight: bold; text-align: center; margin: 8px 0;" id="offset-value">0px</div>
                <div style="font-size: 12px; opacity: 0.9; margin-top: 12px; line-height: 1.6;">
                    <div>↑↓ 键：微调 ±1px</div>
                    <div>Page Up/Down：调整 ±10px</div>
                    <div>Enter：确认保存</div>
                    <div>Esc：取消</div>
                </div>
                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.3); font-size: 12px; opacity: 0.8;">
                    检测到顶部遮挡：<span id="detected-height">--</span>
                </div>
            </div>
        `;
        indicator.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            z-index: 999999;
            user-select: none;
        `;

        document.body.appendChild(indicator);
        scrollAdjustIndicator = indicator;
        return indicator;
    }

    function updateScrollIndicator(offset) {
        const valueEl = document.getElementById('offset-value');
        const detectedEl = document.getElementById('detected-height');
        if (valueEl) {
            valueEl.textContent = `${offset}px`;
        }
        if (detectedEl) {
            detectedEl.textContent = `${detectHeaderHeight()}px`;
        }
    }

    function drawReferenceLine(offset) {
        let line = document.getElementById('offset-reference-line');
        if (!line) {
            line = document.createElement('div');
            line.id = 'offset-reference-line';
            line.style.cssText = `
                position: fixed;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, transparent, #00a1d6, #00a1d6, transparent);
                z-index: 999998;
                pointer-events: none;
                box-shadow: 0 0 10px rgba(0,161,214,0.8);
            `;
            document.body.appendChild(line);
        }
        line.style.top = `${offset}px`;
    }

    function removeReferenceLine() {
        const line = document.getElementById('offset-reference-line');
        if (line) line.remove();
    }

    function enterScrollAdjustMode() {
        if (scrollAdjustModeActive) return;

        scrollAdjustModeActive = true;
        currentScrollAdjustOffset = getEffectiveScrollOffset();

        createScrollAdjustIndicator();
        updateScrollIndicator(currentScrollAdjustOffset);
        drawReferenceLine(currentScrollAdjustOffset);
        scrollPlayerToPosition(currentScrollAdjustOffset);

        document.addEventListener('keydown', handleScrollAdjustKeydown);
        showScrollToast('已进入可视化调整模式', 1000);
    }

    function exitScrollAdjustMode(save = false) {
        if (!scrollAdjustModeActive) return;

        scrollAdjustModeActive = false;
        document.removeEventListener('keydown', handleScrollAdjustKeydown);

        if (scrollAdjustIndicator) {
            scrollAdjustIndicator.remove();
            scrollAdjustIndicator = null;
        }
        removeReferenceLine();

        if (save) {
            GM_setValue('topOffset', currentScrollAdjustOffset);
            SCROLL_CONFIG.topOffset = currentScrollAdjustOffset;
            showScrollToast(`✓ 偏移量已保存：${currentScrollAdjustOffset}px`);
        } else {
            showScrollToast('已取消调整');
        }
    }

    function handleScrollAdjustKeydown(event) {
        if (!scrollAdjustModeActive) return;

        let delta = 0;
        switch (event.key) {
            case 'ArrowUp':
                delta = 1;
                break;
            case 'ArrowDown':
                delta = -1;
                break;
            case 'PageUp':
                delta = 10;
                break;
            case 'PageDown':
                delta = -10;
                break;
            case 'Enter':
                event.preventDefault();
                exitScrollAdjustMode(true);
                return;
            case 'Escape':
                event.preventDefault();
                exitScrollAdjustMode(false);
                return;
            default:
                return;
        }

        event.preventDefault();
        currentScrollAdjustOffset = currentScrollAdjustOffset + delta;
        updateScrollIndicator(currentScrollAdjustOffset);
        drawReferenceLine(currentScrollAdjustOffset);
        scrollPlayerToPosition(currentScrollAdjustOffset);
    }

    function performAutoScroll() {
        if (!SCROLL_CONFIG.enabled) return;  // 检查开关

        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        scrollTimeout = setTimeout(() => {
            const offset = getEffectiveScrollOffset();
            scrollPlayerToPosition(offset);
        }, SCROLL_CONFIG.scrollDelay);
    }

    function setupScrollUrlChangeListener() {
        const originalPushState = history.pushState;
        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            onScrollUrlChange();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function (...args) {
            originalReplaceState.apply(this, args);
            onScrollUrlChange();
        };

        window.addEventListener('popstate', onScrollUrlChange);

        setInterval(() => {
            if (location.href !== lastScrollUrl) {
                onScrollUrlChange();
            }
        }, 1000);
    }

    function onScrollUrlChange() {
        const currentUrl = location.href;

        if (currentUrl === lastScrollUrl) return;

        lastScrollUrl = currentUrl;

        if (currentUrl.includes('/video/') || currentUrl.includes('/bangumi/play/') || currentUrl.includes('/list/')) {
            performAutoScroll();
        }
    }

    function initScrollFeature() {
        setupScrollUrlChangeListener();
        performAutoScroll();
    }

    function setupScrollHotkeyListener() {
        document.addEventListener('keydown', (event) => {
            if (scrollAdjustModeActive) return;

            const { key, ctrlKey, altKey, shiftKey } = event;

            const activeElement = document.activeElement;
            if (activeElement && (
                activeElement.tagName === 'INPUT' ||
                activeElement.tagName === 'TEXTAREA' ||
                activeElement.isContentEditable
            )) {
                return;
            }

            if (key.toLowerCase() === 'e' && !ctrlKey && altKey && !shiftKey) {
                if (!SCROLL_CONFIG.enabled) {
                    showScrollToast('播放器自动滚动功能已关闭');
                    return;
                }
                event.preventDefault();
                enterScrollAdjustMode();
            }
        });
    }

    // ================ 倍速控制功能 ================
    function findVideoElement(element) {
        if (!element) return null;
        if (element instanceof HTMLVideoElement) return element;

        const domain = window.location.hostname;
        if (domain === 'www.bilibili.com') {
            const playerArea = document.querySelector('.bpx-player-video-area');
            if (!playerArea?.contains(element)) return null;
        } else if (domain === 'www.youtube.com') {
            const ytPlayer = element.closest('.html5-video-player');
            if (!ytPlayer?.contains(element)) return null;
            const video = ytPlayer.querySelector('video');
            if (video) return video;
        }

        const controlSelector = config.selectors.default;
        if (element.closest(controlSelector)) return null;

        const container = element.closest('*:has(video)');
        const video = container?.querySelector('video');
        return video && window.getComputedStyle(video).display !== 'none' ? video : null;
    }

    function setYouTubeSpeed(video, speed) {
        if (window.location.hostname === 'www.youtube.com') {
            const player = video.closest('.html5-video-player');
            if (player) {
                try {
                    if (player._speedInterval) {
                        clearInterval(player._speedInterval);
                        player._speedInterval = null;
                    }
                    video.playbackRate = speed;
                    if (speed !== 1.0) {
                        player._speedInterval = setInterval(() => {
                            if (video.playbackRate !== speed) {
                                video.playbackRate = speed;
                            }
                        }, 100);
                        setTimeout(() => {
                            if (player._speedInterval) {
                                clearInterval(player._speedInterval);
                                player._speedInterval = null;
                            }
                        }, 5000);
                    }
                    video.dispatchEvent(new Event('ratechange'));
                } catch (e) {
                    console.error('设置 YouTube 播放速度失败:', e);
                }
            }
        } else {
            video.playbackRate = speed;
        }
    }

    function startPressDetection() {
        if (!animationFrameId) {
            function checkPress() {
                handlePressDetection();
                animationFrameId = requestAnimationFrame(checkPress);
            }
            checkPress();
        }
    }

    function stopPressDetection() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
    }

    function handleMouseDown(e) {
        if (e.button !== 0) return;
        const domain = window.location.hostname;
        let video = null;
        let playerArea = null;

        if (domain === 'www.bilibili.com' || domain === 'www.youtube.com') {
            const selector = config.selectors[domain];
            playerArea = document.querySelector(selector);
            if (!playerArea?.contains(e.target)) return;

            // 排除B站播放器控制栏区域
            if (domain === 'www.bilibili.com') {
                const controlSelectors = [
                    '.bpx-player-control-wrap',      // 控制栏容器
                    '.bpx-player-control-bottom',    // 底部控制栏
                    '.bpx-player-control-top',       // 顶部控制栏
                    '.bpx-player-sending-bar',       // 弹幕发送栏
                    '.bpx-player-dm-input',          // 弹幕输入框
                    '.bpx-player-ctrl-btn',          // 控制按钮
                    '.bpx-player-progress-wrap',     // 进度条区域
                    '.squirtle-controller'           // 旧版控制器
                ];
                for (const sel of controlSelectors) {
                    if (e.target.closest(sel)) {
                        return; // 点击在控制栏区域，不触发加速
                    }
                }
            }

            // 排除YouTube播放器控制栏区域
            if (domain === 'www.youtube.com') {
                const ytControlSelectors = [
                    '.ytp-chrome-bottom',            // 底部控制栏
                    '.ytp-chrome-top',               // 顶部控制栏
                    '.ytp-progress-bar-container',   // 进度条
                    '.ytp-button'                    // 控制按钮
                ];
                for (const sel of ytControlSelectors) {
                    if (e.target.closest(sel)) {
                        return;
                    }
                }
            }

            video = findVideoElement(e.target);
        } else {
            video = findVideoElement(e.target);
            if (video) {
                playerArea = video.closest('*:has(video)') || video.parentElement;
                if (!playerArea?.contains(e.target)) return;

                // 通用控制栏排除逻辑（适用于第三方播放器）
                const genericControlSelectors = [
                    // 常见播放器控制栏容器
                    '.vjs-control-bar',          // Video.js
                    '.plyr__controls',           // Plyr
                    '.mejs__controls',           // MediaElement.js
                    '.jw-controls',              // JW Player
                    '.fp-controls',              // Flowplayer
                    '.dplayer-controller',       // DPlayer
                    '.art-bottom',               // ArtPlayer
                    '.xgplayer-controls',        // 西瓜播放器
                    '.video-js .vjs-control',    // Video.js 控制按钮
                    '[role="slider"]',           // 滑块元素
                    'input[type="range"]'        // 范围输入
                ];

                for (const sel of genericControlSelectors) {
                    try {
                        if (e.target.closest(sel)) {
                            return;
                        }
                    } catch (err) { }
                }

                // 排除视频底部15%区域（通常是控制栏位置）
                const videoRect = video.getBoundingClientRect();
                const clickY = e.clientY;
                const bottomThreshold = videoRect.bottom - videoRect.height * 0.15;
                if (clickY > bottomThreshold) {
                    return; // 点击在视频底部区域，不触发加速
                }
            }
        }

        if (!video || video.paused) {
            hideSpeedIndicator();
            return;
        }

        pressStartTime = Date.now();
        activeVideo = video;
        originalSpeed = video.playbackRate;
        isPressed = true;
        isLongPress = false;
        preventNextClick = false;
        startPressDetection();
    }

    function handleMouseUp(e) {
        if (!isPressed || !activeVideo) return;
        const pressDuration = Date.now() - pressStartTime;
        if (pressDuration >= config.minPressTime) {
            preventNextClick = true;
            setYouTubeSpeed(activeVideo, originalSpeed);
            hideSpeedIndicator();
        }
        isPressed = false;
        isLongPress = false;
        activeVideo = null;
        stopPressDetection();
    }

    function handlePressDetection() {
        if (!isPressed || !activeVideo) return;
        const pressDuration = Date.now() - pressStartTime;
        if (pressDuration >= config.minPressTime) {
            const currentSpeedRate = GM_getValue('speedRate', config.speedRate);
            if (activeVideo.playbackRate !== currentSpeedRate) {
                setYouTubeSpeed(activeVideo, currentSpeedRate);
            }
            if (!isLongPress) {
                isLongPress = true;
                const playerArea = activeVideo.closest('*:has(video)') || activeVideo.parentElement;
                let indicator = document.querySelector('.speed-indicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.className = 'speed-indicator';
                    indicator.style.pointerEvents = 'none';
                    playerArea.appendChild(indicator);
                }
                indicator.innerHTML = `当前加速 ${currentSpeedRate}x <span class="speed-arrow">▶▶</span>`;
                indicator.style.display = 'block';
            }
        }
    }

    function handleClick(e) {
        if (preventNextClick) {
            e.stopPropagation();
            preventNextClick = false;
        }
    }

    function hideSpeedIndicator() {
        const indicator = document.querySelector('.speed-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    function addSpeedIndicatorStyle() {
        if (document.querySelector('.speed-indicator-style')) return;

        const style = document.createElement('style');
        style.className = 'speed-indicator-style';
        style.textContent = `
            .speed-indicator {
                position: absolute;
                top: 15%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                z-index: 999999;
                display: none;
                font-size: 14px;
                pointer-events: none;
            }
            .speed-arrow {
                color: #00a1d6;
                margin-left: 2px;
            }`;
        document.head.appendChild(style);
    }

    function initializeEvents() {
        addSpeedIndicatorStyle();

        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('mouseup', handleMouseUp, true);
        document.addEventListener('click', handleClick, true);
        document.addEventListener('mouseleave', handleMouseUp, true);

        document.addEventListener('fullscreenchange', hideSpeedIndicator);
        document.addEventListener('webkitfullscreenchange', hideSpeedIndicator);
        document.addEventListener('mozfullscreenchange', hideSpeedIndicator);
        document.addEventListener('MSFullscreenChange', hideSpeedIndicator);

        document.addEventListener('pause', (e) => {
            if (e.target instanceof HTMLVideoElement) {
                hideSpeedIndicator();
            }
        }, true);

        if (window.location.hostname === 'www.bilibili.com') {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(initSubtitleAutoOpen, 1000);
                    setTimeout(initScrollFeature, 1000);
                    setupScrollHotkeyListener();
                });
            } else {
                setTimeout(initSubtitleAutoOpen, 1000);
                setTimeout(initScrollFeature, 1000);
                setupScrollHotkeyListener();
            }

            let lastUrl = location.href;
            urlObserver = new MutationObserver(() => {
                const url = location.href;
                if (url !== lastUrl) {
                    lastUrl = url;
                    setTimeout(() => {
                        checkAndInitVideoListener();
                    }, 500);
                }
            });
            urlObserver.observe(document, { subtree: true, childList: true });
        }
    }

    function cleanup() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (subtitleCheckTimer) clearTimeout(subtitleCheckTimer);
        if (urlObserver) urlObserver.disconnect();
        if (scrollTimeout) clearTimeout(scrollTimeout);
    }

    window.addEventListener('unload', cleanup);

    // 菜单命令
    GM_registerMenuCommand('设置倍速值', () => {
        if (window.self !== window.top && window.location.hostname !== 'player.bilibili.com') return;
        const newSpeed = prompt('请输入新的倍速值（建议范围：1.1-4）:', config.speedRate);
        if (newSpeed && !isNaN(newSpeed)) {
            config.speedRate = parseFloat(newSpeed);
            GM_setValue('speedRate', config.speedRate);
        }
    });

    // B站专属菜单
    if (window.location.hostname === 'www.bilibili.com') {
        GM_registerMenuCommand(
            SCROLL_CONFIG.enabled ? '✅ 播放器自动滚动：已开启' : '❌ 播放器自动滚动：已关闭',
            () => {
                const newValue = !SCROLL_CONFIG.enabled;
                GM_setValue('scrollEnabled', newValue);
                // 刷新页面使设置立即生效
                location.reload();
            }
        );

        GM_registerMenuCommand('⚙️ 设置播放器偏移量 (Alt+E)', () => {
            if (!SCROLL_CONFIG.enabled) {
                showScrollToast('请先开启播放器自动滚动功能');
                return;
            }
            enterScrollAdjustMode();
        });

        GM_registerMenuCommand('⏱️ 设置滚动延迟', () => {
            if (!SCROLL_CONFIG.enabled) {
                showScrollToast('请先开启播放器自动滚动功能');
                return;
            }
            const current = GM_getValue('scrollDelay', 1500);
            const input = prompt(
                `页面加载后延迟滚动时间（毫秒）：\n` +
                `建议值：1000~3000\n\n` +
                `当前值：${current}`,
                current
            );

            if (input !== null) {
                const value = parseInt(input, 10);
                if (!isNaN(value) && value >= 0) {
                    GM_setValue('scrollDelay', value);
                    SCROLL_CONFIG.scrollDelay = value;
                    showScrollToast(`延迟已设置为 ${value}ms`);
                }
            }
        });
    }

    initializeEvents();
})();
