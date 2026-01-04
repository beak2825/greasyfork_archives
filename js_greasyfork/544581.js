// ==UserScript==
// @name         广告视频卡片提示屏蔽器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @license      MIT
// @description  屏蔽首页被AdGuard/AdBlock等插件部分屏蔽后留下的异常视频卡片，支持完全删除
// @author       PPPotatooo
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544581/%E5%B9%BF%E5%91%8A%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87%E6%8F%90%E7%A4%BA%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544581/%E5%B9%BF%E5%91%8A%E8%A7%86%E9%A2%91%E5%8D%A1%E7%89%87%E6%8F%90%E7%A4%BA%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let removedCount = 0;
    const DEBUG = true; // 设置为false可关闭调试输出

    function log(message) {
        if (DEBUG) {
            console.log(`[B站广告屏蔽] ${message}`);
        }
    }

    // 检测是否为可疑的随机类名
    function isSuspiciousClassName(className) {
        if (!className || typeof className !== 'string') return false;

        // 定义可疑随机类名的正则模式
        const suspiciousPatterns = [
            /^[a-z]+\d+[a-z]*$/,           // 字母+数字+字母 如: bi4hudfdh2jw4, abc123def
            /^[a-z]\d+[a-z]+$/,            // 单字母+数字+字母 如: b8ernjwo, a1bcdef
            /^[a-z]{1,3}\d{1,4}[a-z]{1,6}$/, // 1-3字母+1-4数字+1-6字母
            /^[a-z]{2,8}\d{1,3}$/,         // 2-8字母+1-3数字
            /^[a-z]\d[a-z]{2,8}$/,         // 1字母+1数字+2-8字母
            /^[a-z]{3,}\d+$/,              // 3+字母+数字
            /^[a-z]+\d{2,}[a-z]+$/,        // 字母+2+数字+字母
        ];

        // 排除正常的类名（以已知前缀开头的）
        const normalPrefixes = [
            'bili-', 'feed-', 'shortcut-', 'v-', 'no-interest-',
            'revert-', 'watch-', 'video-', 'info-', 'stats-',
            'image-', 'cover-', 'mask-', 'wrap', 'card-', 'btn-'
        ];

        // 如果是正常类名，直接返回false
        for (let prefix of normalPrefixes) {
            if (className.startsWith(prefix)) {
                return false;
            }
        }

        // 检查是否匹配可疑模式
        return suspiciousPatterns.some(pattern => pattern.test(className));
    }

    // 检测元素是否包含可疑的随机类名
    function hasSuspiciousClassName(element) {
        // 检查元素本身的类名
        if (element.classList) {
            for (let className of element.classList) {
                if (isSuspiciousClassName(className)) {
                    log(`发现可疑类名: ${className}`);
                    return true;
                }
            }
        }

        // 检查子元素的类名
        const allElements = element.querySelectorAll('*');
        for (let el of allElements) {
            if (el.classList) {
                for (let className of el.classList) {
                    if (isSuspiciousClassName(className)) {
                        log(`发现子元素可疑类名: ${className}`);
                        return true;
                    }
                }
            }
        }

        return false;
    }

    // 检测是否为异常的广告卡片
    function isAdCard(card) {
        try {
            // 检查1: 检测可疑的随机类名
            if (hasSuspiciousClassName(card)) {
                return true;
            }

            // 检查2: 验证是否缺少正常视频卡片的核心内容
            const hasTitle = card.querySelector('.bili-video-card__info--tit');
            const hasCover = card.querySelector('.bili-video-card__cover, .bili-video-card__image');
            const hasAuthor = card.querySelector('.bili-video-card__info--author');
            const hasVideoLink = card.querySelector('a[href*="/video/"]');

            // 如果是bili-video-card但缺少关键内容，判定为异常
            const videoCard = card.querySelector('.bili-video-card');
            if (videoCard && (!hasTitle || !hasCover || !hasVideoLink)) {
                log('发现缺少核心内容的视频卡片');
                return true;
            }

            // 检查3: 检测内容异常简单的卡片
            const cardHTML = card.innerHTML;
            if (cardHTML.length < 500 && card.querySelector('.bili-video-card')) {
                log('发现内容异常简单的视频卡片');
                return true;
            }

            // 检查4: 检测只有空的bili-video-card的情况
            if (videoCard) {
                const videoCardContent = videoCard.innerHTML.replace(/<!--.*?-->/g, '').trim();
                if (videoCardContent.length < 100) {
                    log('发现几乎为空的视频卡片');
                    return true;
                }
            }

            // 检查5: 检测被标记为已屏蔽的卡片
            if (card.dataset.adBlocked === 'true' || card.style.display === 'none') {
                log('发现已被标记为屏蔽的卡片');
                return true;
            }

        } catch (error) {
            log(`检测过程中出现错误: ${error.message}`);
        }

        return false;
    }

    // 获取应该删除的目标元素（优先删除外层feed-card）
    function getTargetElementToRemove(element) {
        // 如果当前元素有外层的feed-card，删除外层
        const outerFeedCard = element.closest('.feed-card');
        if (outerFeedCard) {
            return outerFeedCard;
        }

        // 如果当前元素本身是feed-card，删除自己
        if (element.classList.contains('feed-card')) {
            return element;
        }

        // 如果是bili-feed-card，删除自己
        if (element.classList.contains('bili-feed-card')) {
            return element;
        }

        // 默认返回元素本身
        return element;
    }

    // 移除广告卡片
    function removeAdCards() {
        // 查找所有可能的卡片容器
        const allCards = [
            ...document.querySelectorAll('.feed-card'),
            ...document.querySelectorAll('.bili-feed-card')
        ];

        let currentRemovedCount = 0;
        const processedElements = new Set();

        allCards.forEach((card, index) => {
            // 避免重复处理同一个元素
            if (processedElements.has(card)) {
                return;
            }

            if (isAdCard(card)) {
                const targetElement = getTargetElementToRemove(card);

                // 避免删除已经处理过的元素
                if (!processedElements.has(targetElement) && targetElement.parentNode) {
                    processedElements.add(targetElement);
                    processedElements.add(card);

                    // 完全删除元素
                    targetElement.remove();
                    currentRemovedCount++;
                    removedCount++;

                    log(`已删除第 ${removedCount} 个广告卡片 (${targetElement.className})`);
                }
            }

            processedElements.add(card);
        });

        if (currentRemovedCount > 0) {
            log(`本次清理删除了 ${currentRemovedCount} 个广告卡片`);
        }
    }

    // 监听DOM变化
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 检查是否有新的feed卡片添加
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList && (
                                node.classList.contains('bili-feed-card') ||
                                node.classList.contains('feed-card')
                            )) {
                                shouldCheck = true;
                            } else if (node.querySelector && (
                                node.querySelector('.bili-feed-card') ||
                                node.querySelector('.feed-card')
                            )) {
                                shouldCheck = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheck) {
                // 延迟执行，确保内容完全加载
                setTimeout(removeAdCards, 100);
            }
        });

        // 开始观察
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        log('DOM变化监听器已启动');
    }

    // 定期检查（备用机制）
    function setupPeriodicCheck() {
        setInterval(() => {
            removeAdCards();
        }, 3000); // 每3秒检查一次

        log('定期检查机制已启动');
    }

    // 初始化
    function init() {
        log('B站广告屏蔽插件启动 v2.0');

        // 等待页面基本加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(init, 1000);
            });
            return;
        }

        // 立即执行一次清理
        setTimeout(removeAdCards, 1000);

        // 设置监听器
        setTimeout(setupMutationObserver, 1500);

        // 设置定期检查
        setTimeout(setupPeriodicCheck, 2000);

        // 页面滚动时也触发检查
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(removeAdCards, 500);
        });

        log('所有监听机制已设置完成');
    }

    // 添加手动触发按钮（可选，便于调试）
    function addDebugButton() {
        if (!DEBUG) return;

        setTimeout(() => {
            const button = document.createElement('button');
            button.textContent = `清理广告 (${removedCount})`;
            button.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                z-index: 9999;
                padding: 8px 12px;
                background: #ff6b9d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.2);
            `;

            button.addEventListener('click', () => {
                removeAdCards();
                button.textContent = `清理广告 (${removedCount})`;
            });

            document.body.appendChild(button);

            // 定时更新按钮显示
            setInterval(() => {
                button.textContent = `清理广告 (${removedCount})`;
            }, 1000);

        }, 3000);
    }

    // 测试随机类名检测函数（调试用）
    function testSuspiciousClassNames() {
        if (!DEBUG) return;

        const testCases = [
            'bi4hudfdh2jw4',    // 应该被检测到
            'b8ernjwo',         // 应该被检测到
            'abc123def',        // 应该被检测到
            'bili-video-card',  // 不应该被检测到
            'feed-card',        // 不应该被检测到
            'a1b2c3',          // 应该被检测到
            'shortcut-bg',     // 不应该被检测到
            'xyz789',          // 应该被检测到
        ];

        log('测试随机类名检测：');
        testCases.forEach(className => {
            const result = isSuspiciousClassName(className);
            log(`${className}: ${result ? '可疑' : '正常'}`);
        });
    }

    // 启动插件
    init();

    // 添加调试按钮
    addDebugButton();

    // 测试函数
    testSuspiciousClassNames();

    log('插件加载完成 v2.0');

})();
