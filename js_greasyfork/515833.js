// ==UserScript==
// @name         Better Web Animation 网页动画优化
// @namespace    http://tampermonkey.net/
// @version      6.11
// @description  为所有网页的新加载、变化、移动和消失的内容提供可配置的平滑显现和动画效果，包括图片和元素位置、尺寸变化的平滑过渡。
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @license      CC BY-NC 4.0
// @downloadURL https://update.greasyfork.org/scripts/515833/Better%20Web%20Animation%20%E7%BD%91%E9%A1%B5%E5%8A%A8%E7%94%BB%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/515833/Better%20Web%20Animation%20%E7%BD%91%E9%A1%B5%E5%8A%A8%E7%94%BB%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 多语言支持
    const translations = {
        en: {
            settingsTitle: 'Animation Effect Settings',
            fadeInDuration: 'Fade-in Duration (seconds):',
            fadeOutDuration: 'Fade-out Duration (seconds):',
            transitionDuration: 'Transition Duration (seconds):',
            positionTransitionDuration: 'Position Transition Duration (seconds):',
            sizeTransitionDuration: 'Size Transition Duration (seconds):',
            animationTypes: 'Animation Types:',
            fade: 'Fade',
            zoom: 'Zoom',
            rotate: 'Rotate',
            slide: 'Slide',
            excludedTags: 'Excluded Tags (separated by commas):',
            observeAttributes: 'Observe Attribute Changes',
            observeCharacterData: 'Observe Text Changes',
            enableInitialFadeIn: 'Enable Initial Fade-in Effect',
            complexityThreshold: 'Complexity Threshold (elements):',
            mutationThreshold: 'Mutation Threshold (mutations/sec):',
            enableComplexityDetection: 'Enable Complexity Detection',
            enableMutationDetection: 'Enable Mutation Rate Detection',
            saveConfig: 'Save Settings',
            cancelConfig: 'Cancel',
            settings: 'Settings',
            animations: 'Animations',
            enabled: 'Enabled',
            disabled: 'Disabled',
            animationPresets: 'Animation Presets:',
            defaultPreset: 'Default',
            gentlePreset: 'Gentle',
            dynamicPreset: 'Dynamic',
            customPreset: 'Custom',
            enablePositionTransition: 'Enable Position Transition',
            enableSizeTransition: 'Enable Size Transition',
            enableImageFadeIn: 'Enable Image Fade-in',
            detectFrequentChanges: 'Detect Frequent Changes',
            changeThreshold: 'Change Threshold:',
            detectionDuration: 'Detection Duration (ms):',
            complexityThresholdLabel: 'Complexity Threshold (elements):',
            mutationThresholdLabel: 'Mutation Threshold (mutations/sec):',
            highComplexityDetected: 'High complexity detected. Animations have been disabled.',
            highMutationRateDetected: 'High mutation rate detected. Animations have been disabled.',
        },
        zh: {
            settingsTitle: '动画效果设置',
            fadeInDuration: '渐显持续时间（秒）:',
            fadeOutDuration: '渐隐持续时间（秒）:',
            transitionDuration: '属性过渡持续时间（秒）:',
            positionTransitionDuration: '位置过渡持续时间（秒）:',
            sizeTransitionDuration: '尺寸过渡持续时间（秒）:',
            animationTypes: '动画类型:',
            fade: '淡入/淡出（Fade）',
            zoom: '缩放（Zoom）',
            rotate: '旋转（Rotate）',
            slide: '滑动（Slide）',
            excludedTags: '排除的标签（用逗号分隔）:',
            observeAttributes: '观察属性变化',
            observeCharacterData: '观察文本变化',
            enableInitialFadeIn: '启用加载时的渐入效果',
            complexityThreshold: '复杂度阈值（元素数量）:',
            mutationThreshold: '突变阈值（突变/秒）:',
            enableComplexityDetection: '启用复杂度检测',
            enableMutationDetection: '启用突变率检测',
            saveConfig: '保存设置',
            cancelConfig: '取消',
            settings: '设置',
            animations: '动画',
            enabled: '已启用',
            disabled: '已禁用',
            animationPresets: '动画预设:',
            defaultPreset: '默认',
            gentlePreset: '柔和',
            dynamicPreset: '动感',
            customPreset: '自定义',
            enablePositionTransition: '启用位置过渡',
            enableSizeTransition: '启用尺寸过渡',
            enableImageFadeIn: '启用图片渐入',
            detectFrequentChanges: '检测频繁变化',
            changeThreshold: '变化阈值:',
            detectionDuration: '检测持续时间（毫秒）:',
            complexityThresholdLabel: '复杂度阈值（元素数量）:',
            mutationThresholdLabel: '突变阈值（突变/秒）:',
            highComplexityDetected: '检测到高复杂度。动画已被禁用。',
            highMutationRateDetected: '检测到高突变率。动画已被禁用。',
        }
    };

    const userLang = navigator.language.startsWith('zh') ? 'zh' : 'en';
    const t = translations[userLang];

    // 默认配置，确保所有配置项都有默认值
    const defaultConfig = {
        fadeInDuration: 0.5, // 渐显持续时间（秒）
        fadeOutDuration: 0.5, // 渐隐持续时间（秒）
        transitionDuration: 0.5, // 属性过渡持续时间（秒）
        positionTransitionDuration: 0.5, // 位置过渡持续时间（秒）
        sizeTransitionDuration: 0.5, // 尺寸过渡持续时间（秒）
        animationTypes: ['fade'], // 动画类型：'fade', 'zoom', 'rotate', 'slide'
        excludedTags: ['script'], // 排除的标签
        observeAttributes: true, // 观察属性变化
        observeCharacterData: true, // 观察文本变化
        enableInitialFadeIn: true, // 启用加载时的渐入效果
        complexityThreshold: 50000, // 复杂度阈值（元素数量）
        mutationThreshold: 1000, // 突变阈值（突变/秒）
        enableComplexityDetection: true, // 启用复杂度检测
        enableMutationDetection: true, // 启用突变率检测
        animationPreset: 'default', // 动画预设
        enablePositionTransition: true, // 启用位置过渡
        enableSizeTransition: true, // 启用尺寸过渡
        enableImageFadeIn: true, // 启用图片渐入
        detectFrequentChanges: false, // 检测频繁变化（默认关闭）
        changeThreshold: 50, // 变化阈值（默认值）
        detectionDuration: 500, // 检测持续时间（毫秒）（默认值）
    };

    // 加载用户配置，确保所有配置项都有值
    let userConfig = Object.assign({}, defaultConfig, GM_getValue('userConfig', {}));

    // 动画启用状态
    let animationsEnabled = true;

    // 存储菜单命令的ID
    let animationToggleMenuId = null;
    let settingsMenuId = null;

    // 添加菜单命令
    settingsMenuId = GM_registerMenuCommand(t.settings, showConfigPanel);

    // 添加动画开关菜单
    updateAnimationMenuCommand();

    function updateAnimationMenuCommand() {
        const label = `${t.animations}: ${animationsEnabled ? t.enabled : t.disabled}`;
        // 移除之前的动画开关菜单命令
        if (animationToggleMenuId !== null) {
            GM_unregisterMenuCommand(animationToggleMenuId);
        }
        // 注册新的动画开关菜单命令，并保存其ID
        animationToggleMenuId = GM_registerMenuCommand(label, toggleAnimations);
    }

    function toggleAnimations() {
        animationsEnabled = !animationsEnabled;
        if (animationsEnabled) {
            observer.disconnect(); // 先断开观察器，防止重复注册
            startObserving();
            applyAnimationsToExistingElements();
        } else {
            observer.disconnect();
        }
        updateAnimationMenuCommand();
    }

    // 检测复杂网页
    function checkComplexity() {
        if (!userConfig.enableComplexityDetection) return;

        const totalElements = document.getElementsByTagName('*').length;
        if (totalElements > userConfig.complexityThreshold) {
            animationsEnabled = false;
            console.warn('Animations have been disabled due to high complexity of the webpage.');
            GM_notification(t.highComplexityDetected, 'Better Web Animation');
            updateAnimationMenuCommand();
        }
    }

    checkComplexity();

    // 添加全局样式
    function addGlobalStyles() {
        // 移除之前的样式
        const existingStyle = document.getElementById('global-animation-styles');
        if (existingStyle) existingStyle.remove();

        // 动态生成动画样式
        let animations = '';

        // 根据预设设置动画参数
        switch (userConfig.animationPreset) {
            case 'gentle':
                userConfig.fadeInDuration = 1;
                userConfig.fadeOutDuration = 1;
                userConfig.transitionDuration = 1;
                userConfig.positionTransitionDuration = 1;
                userConfig.sizeTransitionDuration = 1;
                break;
            case 'dynamic':
                userConfig.fadeInDuration = 0.3;
                userConfig.fadeOutDuration = 0.3;
                userConfig.transitionDuration = 0.3;
                userConfig.positionTransitionDuration = 0.3;
                userConfig.sizeTransitionDuration = 0.3;
                break;
            case 'custom':
                // 保持用户自定义设置
                break;
            default:
                // 默认设置
                userConfig.fadeInDuration = defaultConfig.fadeInDuration;
                userConfig.fadeOutDuration = defaultConfig.fadeOutDuration;
                userConfig.transitionDuration = defaultConfig.transitionDuration;
                userConfig.positionTransitionDuration = defaultConfig.positionTransitionDuration;
                userConfig.sizeTransitionDuration = defaultConfig.sizeTransitionDuration;
                break;
        }

        // 渐显效果
        if (userConfig.animationTypes.includes('fade')) {
            animations += `
            .fade-in-effect {
                animation: fadeIn ${userConfig.fadeInDuration}s forwards;
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: var(--original-opacity, 1); }
            }
            `;
        }

        // 缩放效果
        if (userConfig.animationTypes.includes('zoom')) {
            animations += `
            .zoom-in-effect {
                animation: zoomIn ${userConfig.fadeInDuration}s forwards;
            }
            @keyframes zoomIn {
                from { transform: scale(0); }
                to { transform: scale(1); }
            }
            `;
        }

        // 旋转效果
        if (userConfig.animationTypes.includes('rotate')) {
            animations += `
            .rotate-in-effect {
                animation: rotateIn ${userConfig.fadeInDuration}s forwards;
            }
            @keyframes rotateIn {
                from { transform: rotate(-360deg); }
                to { transform: rotate(0deg); }
            }
            `;
        }

        // 滑动效果
        if (userConfig.animationTypes.includes('slide')) {
            animations += `
            .slide-in-effect {
                animation: slideIn ${userConfig.fadeInDuration}s forwards;
            }
            @keyframes slideIn {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
            }
            `;
        }

        // 属性变化过渡效果
        if (userConfig.transitionDuration > 0) {
            animations += `
            .property-change-effect {
                transition: all ${userConfig.transitionDuration}s ease-in-out;
            }
            `;
        }

        // 渐隐效果
        if (userConfig.fadeOutDuration > 0) {
            animations += `
            .fade-out-effect {
                animation: fadeOut ${userConfig.fadeOutDuration}s forwards;
            }
            @keyframes fadeOut {
                from { opacity: var(--original-opacity, 1); }
                to { opacity: 0; }
            }
            `;
        }

        // 位置过渡效果
        if (userConfig.enablePositionTransition && userConfig.positionTransitionDuration > 0) {
            animations += `
            .position-transition-effect {
                transition: transform ${userConfig.positionTransitionDuration}s ease-in-out;
            }
            `;
        }

        // 尺寸过渡效果
        if (userConfig.enableSizeTransition && userConfig.sizeTransitionDuration > 0) {
            animations += `
            .size-transition-effect {
                transition: width ${userConfig.sizeTransitionDuration}s ease-in-out, height ${userConfig.sizeTransitionDuration}s ease-in-out;
            }
            `;
        }

        // 图片渐入效果
        if (userConfig.enableImageFadeIn) {
            animations += `
            img.image-fade-in-effect {
                opacity: 0;
                transition: opacity ${userConfig.fadeInDuration}s ease-in-out;
            }
            img.image-fade-in-effect.loaded {
                opacity: 1;
            }
            `;
        }

        // 添加样式到页面
        const style = document.createElement('style');
        style.id = 'global-animation-styles';
        style.textContent = animations;
        document.head.appendChild(style);
    }

    addGlobalStyles();

    // 页面加载时，为整个页面应用平滑显现效果
    function applyInitialFadeIn() {
        if (!userConfig.enableInitialFadeIn) return;
        document.body.style.opacity = '0';
        document.body.style.transition = `opacity ${userConfig.fadeInDuration}s`;
        window.addEventListener('load', () => {
            document.body.style.opacity = '';
        });
    }

    applyInitialFadeIn();

    // 检查元素是否可见（在视口内）并非固定定位
    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const style = window.getComputedStyle(element);
        const isVisible = (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
            style.visibility !== 'hidden' &&
            style.display !== 'none'
        );
        // 排除固定定位和粘性定位元素
        const position = style.position;
        const isFixedOrSticky = position === 'fixed' || position === 'sticky';
        return isVisible && !isFixedOrSticky;
    }

    // 检查是否为要排除的特定元素（如Bilibili播放器）
    let bilibiliExcludedElement = null;

    function isBilibiliVideoPage() {
        return window.location.href.startsWith('https://www.bilibili.com/video/');
    }

    if (isBilibiliVideoPage()) {
        const xpath = '//*[@id="bilibili-player"]/div/div/div[1]/div[1]/div[4]';
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        bilibiliExcludedElement = result.singleNodeValue;
    }

    // 使用 WeakMap 记录元素的初始位置和尺寸
    const elementRects = new WeakMap();

    // 使用 WeakSet 跟踪正在动画的元素，避免递归触发
    const animatingElements = new WeakSet();

    // 标志位，指示是否正在滚动
    let isScrolling = false;
    let scrollTimeout;

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        isScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isScrolling = false;
        }, 100); // 在用户停止滚动100毫秒后，重置标志位
    }, { passive: true });

    // 应用进入动画效果
    function applyEnterAnimations(element) {
        if (!animationsEnabled) return;

        // 检查是否在排除列表中
        if (userConfig.excludedTags.includes(element.tagName.toLowerCase())) return;
        // 检查元素是否在视口内
        if (!isElementInViewport(element)) return;
        // 检查是否为要排除的特定元素
        if (element === bilibiliExcludedElement) return;
        // 检查是否正在动画中
        if (animatingElements.has(element)) return;

        // 检查初始透明度
        const computedStyle = window.getComputedStyle(element);
        const initialOpacity = computedStyle.opacity;

        // 保存原始透明度
        element.style.setProperty('--original-opacity', initialOpacity);

        // 清除之前的动画类
        element.classList.remove('fade-in-effect', 'zoom-in-effect', 'rotate-in-effect', 'slide-in-effect');

        // 添加动画类
        if (userConfig.animationTypes.includes('fade')) {
            element.classList.add('fade-in-effect');
        }
        if (userConfig.animationTypes.includes('zoom')) {
            element.classList.add('zoom-in-effect');
        }
        if (userConfig.animationTypes.includes('rotate')) {
            element.classList.add('rotate-in-effect');
        }
        if (userConfig.animationTypes.includes('slide')) {
            element.classList.add('slide-in-effect');
        }

        // 标记元素正在动画中
        animatingElements.add(element);

        // 监听动画结束，移除动画类和标记
        function handleAnimationEnd() {
            element.classList.remove('fade-in-effect', 'zoom-in-effect', 'rotate-in-effect', 'slide-in-effect');
            element.style.removeProperty('--original-opacity');
            animatingElements.delete(element);
            element.removeEventListener('animationend', handleAnimationEnd);
        }
        element.addEventListener('animationend', handleAnimationEnd);
    }

    // 应用属性变化过渡效果
    function applyTransitionEffect(element) {
        if (!animationsEnabled) return;

        // 检查是否在排除列表中
        if (userConfig.excludedTags.includes(element.tagName.toLowerCase())) return;
        // 检查元素是否在视口内
        if (!isElementInViewport(element)) return;
        // 检查是否为要排除的特定元素
        if (element === bilibiliExcludedElement) return;
        // 检查是否正在动画中
        if (animatingElements.has(element)) return;

        if (!element.classList.contains('property-change-effect')) {
            element.classList.add('property-change-effect');

            // 标记元素正在过渡中
            animatingElements.add(element);

            // 监听过渡结束，移除过渡类和标记
            const removeTransitionClass = () => {
                element.classList.remove('property-change-effect');
                animatingElements.delete(element);
                element.removeEventListener('transitionend', removeTransitionClass);
            };
            element.addEventListener('transitionend', removeTransitionClass);
        }
    }

    // 应用位置和尺寸变化过渡效果
    function applyPositionAndSizeTransition(changedElements) {
        if (!animationsEnabled) return;
        if (isScrolling) return; // 如果正在滚动，跳过位置和尺寸过渡

        // 过滤不可见元素
        const elements = changedElements.filter(element => isElementInViewport(element));

        if (elements.length === 0) return;

        // 在当前帧记录元素的初始位置和尺寸
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            elementRects.set(element, rect);
        });

        // 在下一帧中应用过渡效果
        requestAnimationFrame(() => {
            elements.forEach(element => {
                // 检查是否正在动画中
                if (animatingElements.has(element)) return;

                // 获取元素的新位置和尺寸
                const firstRect = elementRects.get(element);
                const lastRect = element.getBoundingClientRect();

                // 计算位置和尺寸变化
                const deltaX = firstRect.left - lastRect.left;
                const deltaY = firstRect.top - lastRect.top;
                const deltaW = firstRect.width / lastRect.width;
                const deltaH = firstRect.height / lastRect.height;

                // 如果位置或尺寸发生变化
                if (deltaX !== 0 || deltaY !== 0 || deltaW !== 1 || deltaH !== 1) {
                    // 标记元素正在动画中
                    animatingElements.add(element);

                    // 设置初始变换
                    element.style.transformOrigin = 'top left';
                    element.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;

                    // 强制重绘
                    element.getBoundingClientRect();

                    // 应用过渡效果
                    const transitions = [];
                    if (userConfig.enablePositionTransition && userConfig.positionTransitionDuration > 0) {
                        transitions.push(`transform ${userConfig.positionTransitionDuration}s ease-in-out`);
                    }
                    if (userConfig.enableSizeTransition && userConfig.sizeTransitionDuration > 0) {
                        transitions.push(`width ${userConfig.sizeTransitionDuration}s ease-in-out`, `height ${userConfig.sizeTransitionDuration}s ease-in-out`);
                    }
                    element.style.transition = transitions.join(', ');

                    // 在下一帧中移除变换，触发过渡
                    requestAnimationFrame(() => {
                        element.style.transform = '';
                        if (userConfig.enableSizeTransition && userConfig.sizeTransitionDuration > 0) {
                            element.style.width = '';
                            element.style.height = '';
                        }
                    });

                    // 监听过渡结束，清除样式和标记
                    const handleTransitionEnd = () => {
                        element.style.transition = '';
                        element.style.transformOrigin = '';
                        animatingElements.delete(element);
                        element.removeEventListener('transitionend', handleTransitionEnd);
                    };
                    element.addEventListener('transitionend', handleTransitionEnd);
                } else {
                    // 如果没有变化，清除记录
                    elementRects.delete(element);
                }
            });
        });
    }

    // 应用离开动画效果
    function applyExitAnimations(element) {
        if (!animationsEnabled) return;

        // 检查是否在排除列表中
        if (userConfig.excludedTags.includes(element.tagName.toLowerCase())) return;
        // 检查元素是否在视口内
        if (!isElementInViewport(element)) return;
        // 检查是否为要排除的特定元素
        if (element === bilibiliExcludedElement) return;
        // 检查是否正在动画中
        if (animatingElements.has(element)) return;

        // 如果元素已经有离开动画，直接返回
        if (element.classList.contains('fade-out-effect')) return;

        // 获取元素的原始透明度
        const computedStyle = window.getComputedStyle(element);
        const initialOpacity = computedStyle.opacity;
        element.style.setProperty('--original-opacity', initialOpacity);

        // 添加渐隐类
        element.classList.add('fade-out-effect');

        // 标记元素正在动画中
        animatingElements.add(element);

        // 在动画结束后，从DOM中移除元素并清除标记
        function handleAnimationEnd() {
            element.removeEventListener('animationend', handleAnimationEnd);
            animatingElements.delete(element);
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }
        element.addEventListener('animationend', handleAnimationEnd);
    }

    // 应用图片渐入效果
    function applyImageFadeIn(img) {
        if (!animationsEnabled || !userConfig.enableImageFadeIn) return;

        // 检查是否在排除列表中
        if (userConfig.excludedTags.includes('img')) return;

        if (!img.classList.contains('image-fade-in-effect')) {
            img.classList.add('image-fade-in-effect');
            if (img.complete && img.naturalWidth !== 0) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    img.classList.add('loaded');
                });
            }
        }
    }

    // 应用动画到现有的所有元素
    function applyAnimationsToExistingElements() {
        // 遍历所有元素，应用进入动画
        document.querySelectorAll('*').forEach(element => {
            applyEnterAnimations(element);

            // 对所有图片应用图片渐入效果
            if (element.tagName.toLowerCase() === 'img') {
                applyImageFadeIn(element);
            } else {
                // 对子元素中的图片应用图片渐入效果
                element.querySelectorAll('img').forEach(img => {
                    applyImageFadeIn(img);
                });
            }
        });
    }

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(mutations => {
        if (!animationsEnabled) return;

        if (userConfig.enableMutationDetection) {
            // 统计突变次数
            mutationCount += mutations.length;
            const now = Date.now();
            const elapsed = now - mutationStartTime;
            if (elapsed >= 1000) { // 1秒
                const mutationsPerSecond = mutationCount / (elapsed / 1000);
                mutationCount = 0;
                mutationStartTime = now;

                if (mutationsPerSecond > userConfig.mutationThreshold) {
                    animationsEnabled = false;
                    console.warn('Animations have been disabled due to high mutation rate.');
                    GM_notification(t.highMutationRateDetected, 'Better Web Animation');
                    updateAnimationMenuCommand();
                    observer.disconnect();
                    return;
                }
            }
        }

        // 使用 requestAnimationFrame 优化回调
        requestAnimationFrame(() => {
            const changedElements = new Set();

            mutations.forEach(mutation => {
                if (mutation.type === 'childList') {
                    // 在节点被添加时应用进入动画
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            applyEnterAnimations(node);

                            // 对新添加的图片应用图片渐入效果
                            if (node.tagName.toLowerCase() === 'img') {
                                applyImageFadeIn(node);
                            } else {
                                // 对子元素中的图片应用图片渐入效果
                                node.querySelectorAll('img').forEach(img => {
                                    applyImageFadeIn(img);
                                });
                            }
                        }
                    });

                    // 在节点被移除前应用离开动画
                    mutation.removedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            applyExitAnimations(node);
                        }
                    });

                    // 添加父节点到变化集合
                    if (mutation.target && mutation.target.nodeType === Node.ELEMENT_NODE) {
                        changedElements.add(mutation.target);
                    }
                } else if ((mutation.type === 'attributes' && userConfig.observeAttributes) ||
                           (mutation.type === 'characterData' && userConfig.observeCharacterData)) {
                    const target = mutation.target;
                    if (target.nodeType === Node.ELEMENT_NODE) {
                        applyTransitionEffect(target);
                        changedElements.add(target);

                        // 如果是图片的 src 属性发生变化，重新应用图片渐入效果
                        if (target.tagName.toLowerCase() === 'img' && mutation.attributeName === 'src') {
                            applyImageFadeIn(target);
                        }
                    }
                }
            });

            // 应用位置和尺寸过渡效果
            if ((userConfig.enablePositionTransition || userConfig.enableSizeTransition) && changedElements.size > 0) {
                applyPositionAndSizeTransition(Array.from(changedElements));
            }
        });
    });

    // 突变计数器
    let mutationCount = 0;
    let mutationStartTime = Date.now();

    // 开始观察
    function startObserving() {
        observer.observe(document.body, {
            childList: true,
            attributes: userConfig.observeAttributes,
            characterData: userConfig.observeCharacterData,
            subtree: true,
            attributeFilter: ['src', 'style', 'class'], // 观察属性变化，尤其是图片的'src'变化
        });
    }

    if (animationsEnabled) {
        startObserving();
        applyAnimationsToExistingElements(); // 应用动画到现有元素
    }

    // 配置面板
    function showConfigPanel() {
        // 检查是否已存在配置面板
        if (document.getElementById('animation-config-panel')) return;

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'animation-config-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
        overlay.style.zIndex = '9998';
        document.body.appendChild(overlay);

        // 创建配置面板的HTML结构
        const panel = document.createElement('div');
        panel.id = 'animation-config-panel';
        panel.style.position = 'fixed';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.backgroundColor = '#fff';
        panel.style.border = '1px solid #ccc';
        panel.style.padding = '20px';
        panel.style.zIndex = '9999';
        panel.style.maxWidth = '600px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.overflowY = 'auto';
        panel.style.maxHeight = '80%';

        panel.innerHTML = `
        <h2>${t.settingsTitle}</h2>
        <label>
            ${t.animationPresets}
            <select id="animationPreset">
                <option value="default" ${userConfig.animationPreset === 'default' ? 'selected' : ''}>${t.defaultPreset}</option>
                <option value="gentle" ${userConfig.animationPreset === 'gentle' ? 'selected' : ''}>${t.gentlePreset}</option>
                <option value="dynamic" ${userConfig.animationPreset === 'dynamic' ? 'selected' : ''}>${t.dynamicPreset}</option>
                <option value="custom" ${userConfig.animationPreset === 'custom' ? 'selected' : ''}>${t.customPreset}</option>
            </select>
        </label>
        <br><br>
        <div id="customSettings" style="display: ${userConfig.animationPreset === 'custom' ? 'block' : 'none'};">
            <label>
                ${t.fadeInDuration}
                <input type="number" id="fadeInDuration" value="${userConfig.fadeInDuration}" step="0.1" min="0">
            </label>
            <br>
            <label>
                ${t.fadeOutDuration}
                <input type="number" id="fadeOutDuration" value="${userConfig.fadeOutDuration}" step="0.1" min="0">
            </label>
            <br>
            <label>
                ${t.transitionDuration}
                <input type="number" id="transitionDuration" value="${userConfig.transitionDuration}" step="0.1" min="0">
            </label>
            <br>
            <label>
                ${t.positionTransitionDuration}
                <input type="number" id="positionTransitionDuration" value="${userConfig.positionTransitionDuration}" step="0.1" min="0">
            </label>
            <br>
            <label>
                ${t.sizeTransitionDuration}
                <input type="number" id="sizeTransitionDuration" value="${userConfig.sizeTransitionDuration}" step="0.1" min="0">
            </label>
            <br>
            <label>
                ${t.changeThreshold}
                <input type="number" id="changeThresholdConfig" value="${userConfig.changeThreshold}" min="1">
            </label>
            <br>
            <label>
                ${t.detectionDuration}
                <input type="number" id="detectionDurationConfig" value="${userConfig.detectionDuration}" min="100">
            </label>
            <br>
        </div>
        <label>
            ${t.animationTypes}
            <br>
            <input type="checkbox" id="animationFade" ${userConfig.animationTypes.includes('fade') ? 'checked' : ''}> ${t.fade}
            <br>
            <input type="checkbox" id="animationZoom" ${userConfig.animationTypes.includes('zoom') ? 'checked' : ''}> ${t.zoom}
            <br>
            <input type="checkbox" id="animationRotate" ${userConfig.animationTypes.includes('rotate') ? 'checked' : ''}> ${t.rotate}
            <br>
            <input type="checkbox" id="animationSlide" ${userConfig.animationTypes.includes('slide') ? 'checked' : ''}> ${t.slide}
        </label>
        <br>
        <label>
            ${t.excludedTags}
            <input type="text" id="excludedTags" value="${userConfig.excludedTags.join(',')}">
        </label>
        <br><br>
        <label>
            <input type="checkbox" id="observeAttributes" ${userConfig.observeAttributes ? 'checked' : ''}> ${t.observeAttributes}
        </label>
        <br>
        <label>
            <input type="checkbox" id="observeCharacterData" ${userConfig.observeCharacterData ? 'checked' : ''}> ${t.observeCharacterData}
        </label>
        <br><br>
        <label>
            <input type="checkbox" id="detectFrequentChanges" ${userConfig.detectFrequentChanges ? 'checked' : ''}> ${t.detectFrequentChanges}
        </label>
        <br>
        <label>
            ${t.changeThreshold}
            <input type="number" id="changeThresholdConfig" value="${userConfig.changeThreshold}" min="1">
        </label>
        <br>
        <label>
            ${t.detectionDuration}
            <input type="number" id="detectionDurationConfig" value="${userConfig.detectionDuration}" min="100">
        </label>
        <br><br>
        <label>
            <input type="checkbox" id="enableInitialFadeIn" ${userConfig.enableInitialFadeIn ? 'checked' : ''}> ${t.enableInitialFadeIn}
        </label>
        <br><br>
        <label>
            <input type="checkbox" id="enablePositionTransition" ${userConfig.enablePositionTransition ? 'checked' : ''}> ${t.enablePositionTransition}
        </label>
        <br>
        <label>
            <input type="checkbox" id="enableSizeTransition" ${userConfig.enableSizeTransition ? 'checked' : ''}> ${t.enableSizeTransition}
        </label>
        <br>
        <label>
            <input type="checkbox" id="enableImageFadeIn" ${userConfig.enableImageFadeIn ? 'checked' : ''}> ${t.enableImageFadeIn}
        </label>
        <br><br>
        <label>
            <input type="checkbox" id="enableComplexityDetection" ${userConfig.enableComplexityDetection ? 'checked' : ''}> ${t.enableComplexityDetection}
        </label>
        <br>
        <label>
            ${t.complexityThresholdLabel}
            <input type="number" id="complexityThreshold" value="${userConfig.complexityThreshold}" min="0">
        </label>
        <br><br>
        <label>
            <input type="checkbox" id="enableMutationDetection" ${userConfig.enableMutationDetection ? 'checked' : ''}> ${t.enableMutationDetection}
        </label>
        <br>
        <label>
            ${t.mutationThresholdLabel}
            <input type="number" id="mutationThreshold" value="${userConfig.mutationThreshold}" min="0">
        </label>
        <br><br>
        <button id="saveConfig">${t.saveConfig}</button>
        <button id="cancelConfig">${t.cancelConfig}</button>
        `;

        document.body.appendChild(panel);

        // 根据预设切换自定义设置的显示
        document.getElementById('animationPreset').addEventListener('change', (e) => {
            const customSettings = document.getElementById('customSettings');
            if (e.target.value === 'custom') {
                customSettings.style.display = 'block';
            } else {
                customSettings.style.display = 'none';
            }
        });

        // 添加事件监听
        document.getElementById('saveConfig').addEventListener('click', () => {
            // 保存配置
            userConfig.animationPreset = document.getElementById('animationPreset').value;

            if (userConfig.animationPreset === 'custom') {
                userConfig.fadeInDuration = parseFloat(document.getElementById('fadeInDuration').value) || defaultConfig.fadeInDuration;
                userConfig.fadeOutDuration = parseFloat(document.getElementById('fadeOutDuration').value) || defaultConfig.fadeOutDuration;
                userConfig.transitionDuration = parseFloat(document.getElementById('transitionDuration').value) || defaultConfig.transitionDuration;
                userConfig.positionTransitionDuration = parseFloat(document.getElementById('positionTransitionDuration').value) || defaultConfig.positionTransitionDuration;
                userConfig.sizeTransitionDuration = parseFloat(document.getElementById('sizeTransitionDuration').value) || defaultConfig.sizeTransitionDuration;
                userConfig.changeThreshold = parseInt(document.getElementById('changeThresholdConfig').value) || defaultConfig.changeThreshold;
                userConfig.detectionDuration = parseInt(document.getElementById('detectionDurationConfig').value) || defaultConfig.detectionDuration;
            }

            const animationTypes = [];
            if (document.getElementById('animationFade').checked) animationTypes.push('fade');
            if (document.getElementById('animationZoom').checked) animationTypes.push('zoom');
            if (document.getElementById('animationRotate').checked) animationTypes.push('rotate');
            if (document.getElementById('animationSlide').checked) animationTypes.push('slide');
            userConfig.animationTypes = animationTypes.length > 0 ? animationTypes : defaultConfig.animationTypes;

            const excludedTags = document.getElementById('excludedTags').value.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag);
            userConfig.excludedTags = excludedTags.length > 0 ? excludedTags : defaultConfig.excludedTags;

            userConfig.observeAttributes = document.getElementById('observeAttributes').checked;
            userConfig.observeCharacterData = document.getElementById('observeCharacterData').checked;
            userConfig.detectFrequentChanges = document.getElementById('detectFrequentChanges').checked;

            userConfig.enableInitialFadeIn = document.getElementById('enableInitialFadeIn').checked;

            userConfig.enablePositionTransition = document.getElementById('enablePositionTransition').checked;
            userConfig.enableSizeTransition = document.getElementById('enableSizeTransition').checked;
            userConfig.enableImageFadeIn = document.getElementById('enableImageFadeIn').checked;

            userConfig.enableComplexityDetection = document.getElementById('enableComplexityDetection').checked;
            userConfig.complexityThreshold = parseInt(document.getElementById('complexityThreshold').value) || defaultConfig.complexityThreshold;

            userConfig.enableMutationDetection = document.getElementById('enableMutationDetection').checked;
            userConfig.mutationThreshold = parseInt(document.getElementById('mutationThreshold').value) || defaultConfig.mutationThreshold;

            // 保存到本地存储
            GM_setValue('userConfig', userConfig);

            // 更新样式和观察器
            addGlobalStyles();
            observer.disconnect();
            if (animationsEnabled) {
                startObserving();
                applyAnimationsToExistingElements();
            }

            // 移除配置面板
            panel.remove();
            overlay.remove();
        });

        document.getElementById('cancelConfig').addEventListener('click', () => {
            // 移除配置面板
            panel.remove();
            overlay.remove();
        });

        overlay.addEventListener('click', () => {
            panel.remove();
            overlay.remove();
        });
    }

})();
