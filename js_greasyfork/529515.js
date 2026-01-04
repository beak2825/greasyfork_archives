// ==UserScript==
// @name         抖音优化
// @namespace    http://tampermonkey.net/
// @version      4.10
// @description  优化抖音体验：隐藏购物车、热榜，去重搜索结果，添加弹幕开关，记住礼物特效状态
// @author       AI
// @match        *://*.douyin.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/529515/%E6%8A%96%E9%9F%B3%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529515/%E6%8A%96%E9%9F%B3%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储已看到的视频ID，用于去重
    const seenVideoIDs = new Set();

    /**
     * 检查当前页面是否为搜索结果页面
     * @returns {boolean} 是否为搜索页面
     */
    function isSearchPage() {
        return window.location.pathname.startsWith('/search/');
    }

    // === 元素隐藏功能 ===

    /**
     * 隐藏购物车图标容器，通过定位包含特定SVG的div
     */
    function hideShoppingCartDiv() {
        const divsWithSvg = document.querySelectorAll('div');
        divsWithSvg.forEach(div => {
            const cartSvg = div.querySelector('svg[width="28"][height="28"]');
            if (cartSvg) {
                let targetDiv = cartSvg;
                for (let i = 0; i < 4 && targetDiv; i++) {
                    targetDiv = targetDiv.parentElement;
                    if (!targetDiv || targetDiv.tagName !== 'DIV') break;
                }
                if (targetDiv) {
                    targetDiv.style.display = 'none';
                }
            }
        });
    }

    /**
     * 隐藏搜索框弹出的“抖音热榜”四个字
     */
    function hideSearchHotPreviousDiv() {
        const hotDiv = document.querySelector('div[data-e2e="search-hot-container"]');
        if (hotDiv?.previousElementSibling?.tagName === 'DIV') {
            hotDiv.previousElementSibling.style.display = 'none';
        }
    }

    /**
     * 执行所有元素隐藏操作的主函数
     */
    function cleanUpElements() {
        hideShoppingCartDiv();
        hideSearchHotPreviousDiv();
    }

    // === 搜索结果去重 ===

    /**
     * 处理单个<li>元素，提取视频ID并隐藏重复项，仅在搜索页面执行
     * @param {Element} li - 要处理的列表项元素
     */
    function processLi(li) {
        if (!isSearchPage() || !(li instanceof Element)) return;
        const aTag = li.querySelector('a[href*="/video/"]');
        if (!aTag) return;
        const href = aTag.getAttribute('href');
        const match = href?.match(/\/video\/(\d+)/);
        if (!match) return;
        const videoID = match[1];
        if (seenVideoIDs.has(videoID)) {
            li.style.display = 'none';
        } else {
            seenVideoIDs.add(videoID);
        }
    }

    /**
     * 处理页面上已存在的<li>元素以进行去重，仅在搜索页面执行
     */
    function processExistingLi() {
        if (!isSearchPage()) return;
        document.querySelectorAll('li').forEach(processLi);
    }

    // === 工具函数 ===

    /**
     * 等待元素出现在DOM中并执行回调
     * @param {string} selector - 目标元素的CSS选择器
     * @param {Function} callback - 元素出现时执行的回调函数
     * @param {number} maxRetries - 最大重试次数
     * @param {number} interval - 重试间隔（毫秒）
     */
    function waitForElement(selector, callback, maxRetries = 20, interval = 500) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
            return;
        }
        let retries = 0;
        const timer = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(timer);
                callback(element);
            } else if (retries >= maxRetries) {
                clearInterval(timer);
            }
            retries++;
        }, interval);
    }

    // === 直播弹幕控制Industrial-Strength Solutions ===

    /**
     * 添加显示/隐藏弹幕的切换按钮
     * @param {Element} targetDiv - 按钮追加的目标容器
     */
    function addToggleChatroomButton(targetDiv) {
        const button = document.createElement('button');
        let isChatroomVisible = localStorage.getItem('chatroomVisible') !== 'false';
        button.textContent = isChatroomVisible ? '隐藏弹幕' : '显示弹幕';
        Object.assign(button.style, {
            marginLeft: '40px',
            padding: '4px 10px',
            borderRadius: '40px',
            backgroundColor: '#fe2c55',
            color: 'white',
            fontSize: '14px',
            cursor: 'pointer'
        });
        targetDiv.appendChild(button);

        waitForElement('div[class*="webcast-chatroom___list"]', (chatroomMessages) => {
            // 定位直播相关元素
            const audienceFilterDiv = Array.from(document.querySelectorAll('div > div > p'))
                .find(p => p.textContent.includes('高等级用户'))?.closest('div')?.parentElement;
            const audiencePanelDiv = document.querySelector('div > div > div[id*="audiencePanelScrollId"]')?.parentElement?.parentElement;
            const nextDiv = audienceFilterDiv?.nextElementSibling; // 送礼用户排名
            const nextDiv2 = nextDiv?.nextElementSibling; // 用户进入房间通知

            /**
             * 强制隐藏弹幕相关元素
             */
            function enforceHiddenState() {
                if (!isChatroomVisible) {
                    chatroomMessages.style.display = 'none';
                    if (audiencePanelDiv) audiencePanelDiv.style.display = 'none';
                }
                // Permanently hide these elements
                if (audienceFilterDiv) audienceFilterDiv.style.display = 'none';
                if (nextDiv?.tagName === 'DIV') nextDiv.style.display = 'none';
                if (nextDiv2?.tagName === 'DIV') nextDiv2.style.display = 'none';
            }

            enforceHiddenState();

            // 为nextDiv和nextDiv2设置MutationObserver以监控样式变化
            let styleObserver, styleObserver2;
            if (nextDiv?.tagName === 'DIV') {
                styleObserver = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.attributeName === 'style' && nextDiv.style.display !== 'none') {
                            nextDiv.style.display = 'none';
                        }
                    });
                });
                styleObserver.observe(nextDiv, { attributes: true, attributeFilter: ['style'] });
            }

            if (nextDiv2?.tagName === 'DIV') {
                styleObserver2 = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.attributeName === 'style' && nextDiv2.style.display !== 'none') {
                            nextDiv2.style.display = 'none';
                        }
                    });
                });
                styleObserver2.observe(nextDiv2, { attributes: true, attributeFilter: ['style'] });
            }

            // 定期检查以确保隐藏状态
            const intervalId = setInterval(() => {
                if (nextDiv?.tagName === 'DIV' && nextDiv.style.display !== 'none') {
                    nextDiv.style.display = 'none';
                }
                if (nextDiv2?.tagName === 'DIV' && nextDiv2.style.display !== 'none') {
                    nextDiv2.style.display = 'none';
                }
                if (audienceFilterDiv && audienceFilterDiv.style.display !== 'none') {
                    audienceFilterDiv.style.display = 'none';
                }
            }, 1000);

            // 切换弹幕显示状态
            button.addEventListener('click', () => {
                isChatroomVisible = !isChatroomVisible;
                button.textContent = isChatroomVisible ? '隐藏弹幕' : '显示弹幕';
                chatroomMessages.style.display = isChatroomVisible ? '' : 'none';
                if (audiencePanelDiv) audiencePanelDiv.style.display = isChatroomVisible ? '' : 'none';
                localStorage.setItem('chatroomVisible', isChatroomVisible);
            });

            // 页面卸载时清理
            window.addEventListener('unload', () => {
                styleObserver?.disconnect();
                styleObserver2?.disconnect();
                clearInterval(intervalId);
            });
        });
    }

    // === 礼物特效控制 ===

    /**
     * 模拟悬停事件以显示视频播放器控件
     */
    function triggerHover() {
        const videoPlayer = document.querySelector('div[data-e2e="basicPlayer"]');
        if (videoPlayer) {
            const hoverEvent = new MouseEvent('mouseover', { bubbles: true, cancelable: true });
            videoPlayer.dispatchEvent(hoverEvent);
        }
    }

    /**
     * 检查礼物特效是否激活，基于SVG属性
     * @param {Element} element - 特效开关元素
     * @returns {boolean} 特效是否激活
     */
    function isGiftEffectActive(element) {
        const svg = element.querySelector('svg');
        if (!svg) return false;
        const activePath = svg.querySelector('path[d="M18.802 20.5l1.384 1.502 2.214-2.38"]');
        const circle = svg.querySelector('circle[cx="20.566"][cy="20.716"]');
        return !!activePath && !circle;
    }

    /**
     * 应用保存的礼物特效设置到直播
     */
    function applyLiveSettings() {
        triggerHover();
        let retryCount = 0;
        const maxRetries = 5;
        const retryInterval = setInterval(() => {
            const effectSwitch = document.querySelector('div[data-e2e="effect-switch"]');
            if (effectSwitch || retryCount >= maxRetries) {
                clearInterval(retryInterval);
                if (!effectSwitch) return;
                
                const savedGiftState = GM_getValue('giftEffectState', true);
                const isActive = isGiftEffectActive(effectSwitch);
                
                // 同步礼物特效状态
                if (isActive !== savedGiftState) {
                    effectSwitch.click();
                    setTimeout(() => {
                        if (isGiftEffectActive(effectSwitch) !== savedGiftState) {
                            effectSwitch.click();
                        }
                    }, 300);
                }

                // 用户交互时保存状态
                effectSwitch.addEventListener('click', () => {
                    setTimeout(() => {
                        GM_setValue('giftEffectState', isGiftEffectActive(effectSwitch));
                    }, 100);
                });
            } else {
                triggerHover();
                retryCount++;
            }
        }, 1000);
    }

    // === DOM观察 ===

    /**
     * 设置MutationObserver以监控DOM变化
     */
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            cleanUpElements(); // 每次 DOM 变化时都调用，确保隐藏动态加载的元素
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return;
                    // 处理 <li> 元素，仅在搜索页面
                    if (isSearchPage()) {
                        if (node.tagName.toLowerCase() === 'li') {
                            processLi(node);
                        } else {
                            node.querySelectorAll('li').forEach(processLi);
                        }
                    }
                    // 检查新添加的节点是否包含 search-hot-container
                    if (node.matches('div[data-e2e="search-hot-container"]') || 
                        node.querySelector('div[data-e2e="search-hot-container"]')) {
                        hideSearchHotPreviousDiv();
                    }
                });
            });
            if (document.querySelector('div[data-e2e="basicPlayer"]')) {
                applyLiveSettings();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // === 初始化 ===

    /**
     * 初始化脚本所有功能
     */
    function initialize() {
        cleanUpElements();
        processExistingLi(); // 去重逻辑受 isSearchPage 控制
        waitForElement('div[data-e2e="live-room-audience"]', (audienceDiv) => {
            const targetDiv = audienceDiv.parentElement;
            if (targetDiv) {
                addToggleChatroomButton(targetDiv);
            }
        });
        applyLiveSettings();
    }

    // 页面加载完成或立即执行初始化
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }

    // 开始DOM观察
    setupObserver();
})();