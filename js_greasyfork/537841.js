// ==UserScript==
// @name         Infinex Auto Clicker Enhanced
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Enhanced auto click elements on infinex.xyz with better waiting and retry logic
// @author       @dami16z
// @match        https://app.infinex.xyz/play/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537841/Infinex%20Auto%20Clicker%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/537841/Infinex%20Auto%20Clicker%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 改进的等待元素函数，支持更灵活的等待策略
    function waitForElement(selector, options = {}) {
        const {
            timeout = 30000,
            interval = 200,
            textContent = null,
            visible = true,
            enabled = false
        } = options;

        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            const checkElement = () => {
                const elements = typeof selector === 'function'
                    ? selector()
                    : document.querySelectorAll(selector);

                const elementArray = Array.from(elements);

                for (const element of elementArray) {
                    if (!element) continue;

                    // 检查文本内容
                    if (textContent && !element.textContent.trim().includes(textContent)) {
                        continue;
                    }

                    // 检查可见性
                    if (visible) {
                        const rect = element.getBoundingClientRect();
                        const style = window.getComputedStyle(element);
                        if (rect.width === 0 || rect.height === 0 ||
                            style.display === 'none' ||
                            style.visibility === 'hidden' ||
                            style.opacity === '0') {
                            continue;
                        }
                    }

                    // 检查是否启用
                    if (enabled && (element.disabled || element.hasAttribute('disabled'))) {
                        continue;
                    }

                    resolve(element);
                    return;
                }

                if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element not found within ${timeout}ms. Selector: ${selector}`));
                } else {
                    setTimeout(checkElement, interval);
                }
            };

            checkElement();
        });
    }

    // 等待多个元素中的任意一个出现
    function waitForAnyElement(selectors, options = {}) {
        const promises = selectors.map(selector =>
            waitForElement(selector, { ...options, timeout: options.timeout || 30000 })
                .catch(() => null)
        );

        return Promise.race(promises.filter(p => p !== null))
            .then(result => {
                if (!result) {
                    throw new Error('None of the elements were found');
                }
                return result;
            });
    }

    // 改进的按文本查找元素函数
    function findElementByText(text, selector = '*', options = {}) {
        const { exact = false, caseSensitive = false } = options;
        const elements = document.querySelectorAll(selector);

        return Array.from(elements).find(el => {
            const elementText = el.textContent.trim();
            if (exact) {
                return caseSensitive ? elementText === text : elementText.toLowerCase() === text.toLowerCase();
            } else {
                return caseSensitive ? elementText.includes(text) : elementText.toLowerCase().includes(text.toLowerCase());
            }
        });
    }

    // 改进的点击函数，添加多种点击方式
    function clickElement(element, options = {}) {
        if (!element) return false;

        const { method = 'auto', force = false } = options;

        // 检查元素是否可点击
        if (!force && (element.disabled || element.hasAttribute('disabled'))) {
            console.log('Element is disabled, skipping click');
            return false;
        }

        try {
            // 滚动到元素可见位置
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // 等待滚动完成
            setTimeout(() => {
                switch (method) {
                    case 'native':
                        element.click();
                        break;
                    case 'dispatch':
                        const clickEvent = new MouseEvent('click', {
                            view: window,
                            bubbles: true,
                            cancelable: true,
                            button: 0
                        });
                        element.dispatchEvent(clickEvent);
                        break;
                    case 'auto':
                    default:
                        // 先尝试原生点击，失败则用事件分发
                        try {
                            element.click();
                        } catch (e) {
                            const event = new MouseEvent('click', {
                                view: window,
                                bubbles: true,
                                cancelable: true,
                                button: 0
                            });
                            element.dispatchEvent(event);
                        }
                        break;
                }

                console.log('Successfully clicked element:', element);
            }, 100);

            return true;
        } catch (error) {
            console.error('Click failed:', error);
            return false;
        }
    }

    // 随机延迟函数
    function randomDelay(min = 500, max = 1500) {
        return new Promise(resolve => {
            const delay = Math.random() * (max - min) + min;
            setTimeout(resolve, delay);
        });
    }

    // 重试执行函数
    async function retryOperation(operation, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation();
                if (result) return result;
            } catch (error) {
                console.log(`Attempt ${attempt} failed:`, error.message);
            }

            if (attempt < maxRetries) {
                console.log(`Retrying in ${delay}ms... (${attempt}/${maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
        throw new Error(`Operation failed after ${maxRetries} attempts`);
    }

    // 改进的主执行逻辑
    async function executeClickSequence() {
        try {
            console.log('🚀 开始执行增强版自动点击序列...');

            // 第一步：点击第一个Done按钮
            console.log('🔍 Step 1: 寻找第一个 Done 按钮...');
            try {
                await retryOperation(async () => {
                    const doneButton = await waitForElement(() => {
                        // 多种方式查找Done按钮
                        let btn = findElementByText('Done', 'button');
                        if (!btn) {
                            const spans = document.querySelectorAll('span');
                            for (const span of spans) {
                                if (span.textContent.trim() === 'Done') {
                                    btn = span.closest('button');
                                    if (btn) break;
                                }
                            }
                        }
                        return btn ? [btn] : [];
                    }, { timeout: 15000, visible: true });

                    if (clickElement(doneButton)) {
                        console.log('✅ 成功点击第一个 Done 按钮');
                        await randomDelay(800, 1500);
                        return true;
                    }
                    return false;
                });
            } catch (error) {
                console.log('⚠️ 未找到第一个 Done 按钮，继续执行...');
            }

            // 第二步：点击Open按钮
            console.log('🔍 Step 2: 寻找 Open 按钮...');
            try {
                await retryOperation(async () => {
                    const openButton = await waitForElement(() => {
                        let btn = findElementByText('Open', 'button');
                        if (!btn) {
                            btn = document.querySelector('button[class*="br-pack-btn"]');
                            if (btn && !btn.textContent.includes('Open')) {
                                btn = null;
                            }
                        }
                        return btn ? [btn] : [];
                    }, { timeout: 15000, visible: true });

                    if (clickElement(openButton)) {
                        console.log('✅ 成功点击 Open 按钮');
                        await randomDelay(800, 1500);
                        return true;
                    }
                    return false;
                });
            } catch (error) {
                console.log('⚠️ 未找到 Open 按钮，继续执行...');
            }

            // 第三步：点击Choose your hand按钮
            console.log('🔍 Step 3: 寻找 Choose your hand 按钮...');
            try {
                await retryOperation(async () => {
                    const chooseHandButton = await waitForElement(() => {
                        const btn = findElementByText('Choose your hand', 'button');
                        return btn ? [btn] : [];
                    }, { timeout: 15000, visible: true });

                    if (clickElement(chooseHandButton)) {
                        console.log('✅ 成功点击 Choose your hand 按钮');
                        await randomDelay(800, 1500);
                        return true;
                    }
                    return false;
                });
            } catch (error) {
                console.log('⚠️ 未找到 Choose your hand 按钮，继续执行...');
            }

            // 第四步：点击第二个Done按钮
            console.log('🔍 Step 4: 寻找第二个 Done 按钮...');
            try {
                await retryOperation(async () => {
                    await randomDelay(1000, 2000); // 等待页面更新

                    const allDoneButtons = Array.from(document.querySelectorAll('button'))
                        .filter(btn => btn.textContent.trim().includes('Done'));

                    if (allDoneButtons.length > 1) {
                        const secondDoneButton = allDoneButtons[1];
                        if (clickElement(secondDoneButton)) {
                            console.log('✅ 成功点击第二个 Done 按钮');
                            await randomDelay(800, 1500);
                            return true;
                        }
                    }
                    return false;
                });
            } catch (error) {
                console.log('⚠️ 未找到第二个 Done 按钮，继续执行...');
            }

            // 第五步：随机点击卡片
            console.log('🔍 Step 5: 开始随机点击卡片按钮...');
            try {
                await retryOperation(async () => {
                    // 等待卡片加载
                    await randomDelay(2000, 3000);

                    const cardSelectors = [
                        'button[class*="relative flex aspect-"]',
                        'button[class*="aspect-"][class*="h-24"]',
                        'button div[class*="aspect-"]',
                        'button img[alt*="card"]'
                    ];

                    let cardButtons = [];
                    for (const selector of cardSelectors) {
                        cardButtons = document.querySelectorAll(selector);
                        if (cardButtons.length > 0) {
                            if (selector.includes('img')) {
                                cardButtons = Array.from(cardButtons)
                                    .map(img => img.closest('button'))
                                    .filter(btn => btn);
                            }
                            break;
                        }
                    }

                    console.log(`📋 找到 ${cardButtons.length} 个卡片按钮`);

                    if (cardButtons.length > 0) {
                        const shuffledButtons = Array.from(cardButtons).sort(() => Math.random() - 0.5);
                        const buttonsToClick = Math.min(10, shuffledButtons.length);

                        for (let i = 0; i < buttonsToClick; i++) {
                            if (clickElement(shuffledButtons[i])) {
                                console.log(`✅ 点击了第 ${i + 1}/${buttonsToClick} 个卡片按钮`);
                                await randomDelay(300, 800);
                            }
                        }
                        return true;
                    }
                    return false;
                });
            } catch (error) {
                console.log('⚠️ 未找到卡片按钮，继续执行...');
            }

            // 第六步：点击Confirm按钮（重点改进）
            console.log('🔍 Step 6: 寻找 Confirm 按钮...');
            try {
                await retryOperation(async () => {
                    const confirmButton = await waitForElement(() => {
                        // 多种方式查找Confirm按钮
                        let btn = findElementByText('Confirm', 'button');
                        if (!btn) {
                            const spans = document.querySelectorAll('span');
                            for (const span of spans) {
                                if (span.textContent.trim() === 'Confirm') {
                                    btn = span.closest('button');
                                    if (btn) break;
                                }
                            }
                        }
                        return btn ? [btn] : [];
                    }, {
                        timeout: 45000, // 增加超时时间
                        visible: true,
                        enabled: true // 等待按钮启用
                    });

                    if (clickElement(confirmButton)) {
                        console.log('✅ 成功点击 Confirm 按钮');
                        return true;
                    }
                    return false;
                }, 5, 2000); // 增加重试次数和间隔
            } catch (error) {
                console.log('❌ 未能点击 Confirm 按钮:', error.message);
            }

            console.log('🎉 自动点击序列执行完成！');

        } catch (error) {
            console.error('❌ 执行过程中出现错误:', error);
        }
    }

    // 监听页面变化，适应动态加载内容
    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            // 检查是否有新的相关元素加载
            let hasRelevantChanges = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const text = node.textContent || '';
                            if (text.includes('Done') || text.includes('Open') ||
                                text.includes('Choose your hand') || text.includes('Confirm')) {
                                hasRelevantChanges = true;
                            }
                        }
                    });
                }
            });

            if (hasRelevantChanges) {
                console.log('🔄 检测到页面变化，相关元素可能已加载');
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // 启动脚本
    function startScript() {
        console.log('🎯 Infinex Auto Clicker Enhanced 脚本已加载');

        // 启动页面变化监听
        const observer = observePageChanges();

        // 延迟启动，给页面充分加载时间
        setTimeout(() => {
            executeClickSequence().finally(() => {
                // 清理观察器
                observer.disconnect();
            });
        }, 5000); // 增加初始延迟
    }

    // 页面加载完成后启动
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startScript);
    } else {
        startScript();
    }

})();