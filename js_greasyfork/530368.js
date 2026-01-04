// ==UserScript==
// @name         gaianet
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  空投 - 实时重定向到chat页面
// @author       开启数字空投财富的发掘之旅
// @match        https://www.gaianet.ai/*
// @downloadURL https://update.greasyfork.org/scripts/530368/gaianet.user.js
// @updateURL https://update.greasyfork.org/scripts/530368/gaianet.meta.js
// ==/UserScript==

(function() {
    const targetUrl = 'https://www.gaianet.ai/chat';

    // 日志函数
    function log(message) {
        console.log(`[GaiaNet Chat AutoClicker] ${message}`);
    }

    // 实时监测 URL 变化并重定向
    function checkAndRedirect() {
        if (window.location.hostname === 'www.gaianet.ai') {
            if (window.location.href !== targetUrl) {
                log(`当前页面不是目标页面，正在重定向到: ${targetUrl}`);
                window.location.href = targetUrl;
                return false;
            }
            return true;
        } else {
            log('不在 www.gaianet.ai 域名下，脚本停止执行');
            return false;
        }
    }

    // 使用 MutationObserver 实时监测页面变化
    function setupUrlWatcher() {
        let lastUrl = window.location.href;

        // 检查 History API 变化
        window.addEventListener('popstate', () => {
            if (!checkAndRedirect()) {
                return;
            }
        });

        // 监测页面 DOM 变化，可能包含 SPA 路由变化
        const observer = new MutationObserver(() => {
            if (window.location.href !== lastUrl) {
                lastUrl = window.location.href;
                if (!checkAndRedirect()) {
                    return;
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 初始检查
        checkAndRedirect();
    }

    // 以下是原有的工具函数，未作改动
    function getElementByXPath(path) {
        try {
            const element = document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            return element;
        } catch (error) {
            log(`[调试] XPath错误: ${path} - ${error.message}`);
            return null;
        }
    }

    function isElementClickable(element) {
        if (!element) {
            log('[调试] 元素不存在');
            return false;
        }
        try {
            const style = window.getComputedStyle(element);
            const clickable = style.display !== 'none' &&
                            style.visibility !== 'hidden' &&
                            style.opacity !== '0' &&
                            !element.disabled;
            log('[调试] 元素样式 - display:', style.display || '未知',
                'visibility:', style.visibility || '未知',
                'opacity:', style.opacity || '未知',
                'disabled:', element.disabled || '未知');
            log('[调试] 元素可点击:', clickable);
            return clickable;
        } catch (error) {
            log('[调试] 检查元素可点击性时出错:', error.message);
            return false;
        }
    }

    async function getRandomElementFromXPathRange(basePath, startIdx, endIdx, timeout = 30000) {
        const maxAttempts = 3;
        for (let attempt = 0; attempt < maxAttempts; attempt++) {
            const index = Math.floor(Math.random() * (endIdx - startIdx + 1)) + startIdx;
            const path = basePath.replace(/\[1~[0-9]+\]$/, `[${index}]`);
            log(`[调试] 尝试 ${attempt + 1}/${maxAttempts} - 选择元素，XPath: ${path}`);
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                const element = getElementByXPath(path);
                if (element && isElementClickable(element)) {
                    log(`[调试] 找到可点击元素，XPath: ${path}`);
                    return element;
                }
                await sleep(500);
            }
            log(`[调试] 未找到可点击元素，XPath: ${path}`);
        }
        return null;
    }

    async function waitForElementWithText(identifier, text = '', isXPath = false, timeout = 30000, infiniteWait = false) {
        log(`[调试] 等待元素: ${identifier}${text ? ` 包含文本 "${text}"` : ''}${infiniteWait ? '（无限等待）' : ''}`);
        const startTime = Date.now();
        while (infiniteWait || (Date.now() - startTime < timeout)) {
            let element = isXPath ? getElementByXPath(identifier) : document.querySelector(identifier);
            if (element && isElementClickable(element)) {
                const elementText = element.textContent.trim().toUpperCase();
                if (!text || elementText === text.toUpperCase()) {
                    log('[调试] 元素已找到:', element.outerHTML);
                    return element;
                }
            }
            await sleep(500);
        }
        log('[调试] 等待超时，未找到匹配文本的可点击元素');
        return null;
    }

    function simulateClick(element) {
        try {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window
            });
            element.dispatchEvent(event);
            log('[调试] 已模拟点击事件');
            return true;
        } catch (error) {
            log('[调试] 模拟点击失败:', error.message);
            return false;
        }
    }

    function getRandomDelay() {
        return Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 实时监测元素0并点击，统计点击次数，添加超时恢复
    let element0ClickCount = 0;
    let pauseMainLoop = false;
    async function monitorElement0() {
        const element0XPath = '/html/body/div[2]/div[3]/div/div[2]/div/button';
        log('[Element0] 开始实时监测元素0');
        while (true) {
            const element0 = getElementByXPath(element0XPath);
            if (element0 && isElementClickable(element0)) {
                element0.click();
                element0ClickCount++;
                log(`[Element0] 元素0已点击，第 ${element0ClickCount} 次:`, element0.outerHTML);

                if (element0ClickCount > 20) {
                    log('[Element0] 点击次数超过20次，暂停主循环并执行额外点击');
                    pauseMainLoop = true;

                    const timeoutPromise = new Promise(resolve => setTimeout(() => {
                        log('[Element0] 额外点击超时（10秒），强制恢复主循环');
                        pauseMainLoop = false;
                        element0ClickCount = 0;
                        resolve(false);
                    }, 10000));

                    const extraClickPromise = (async () => {
                        const extraElement1 = await waitForElementWithText('#nav > div.hidden.lg\\:flex.flex-1.flex-crossCenter.justify-end.wow.animate__.animate__fadeIn > div.flex-crossCenter.gap-6.xl\\:gap-8 > a:nth-child(4)', '', false, 5000);
                        if (extraElement1) {
                            extraElement1.click();
                            log('[Element0] 额外元素1已点击:', extraElement1.outerHTML);
                        }
                        await sleep(getRandomDelay());

                        const extraElement2 = await waitForElementWithText('#nav > div.hidden.lg\\:flex.flex-1.flex-crossCenter.justify-end.wow.animate__.animate__fadeIn.animated > div.flex-crossCenter.gap-6.xl\\:gap-8 > a:nth-child(6)', '', false, 5000);
                        if (extraElement2) {
                            extraElement2.click();
                            log('[Element0] 额外元素2已点击:', extraElement2.outerHTML);
                        }

                        element0ClickCount = 0;
                        pauseMainLoop = false;
                        log('[Element0] 额外点击完成，恢复主循环');
                        return true;
                    })();

                    await Promise.race([extraClickPromise, timeoutPromise]);
                }
                await sleep(1000);
            }
            await sleep(500);
        }
    }

    let shouldJumpToNextCycle = false;
    function startElementCheck() {
        setInterval(async () => {
            try {
                const checkElementSelector = '#__next > div > div > div.gaia-container.pt-12.md\\:pt-20.pb-\\[96px\\].md\\:pb-\\[150px\\] > div > div.flex-1 > div.MuiTableContainer-root.min-h-\\[380px\\].overflow-auto.hiddenScrollBar.css-kge0eu > table > thead > tr > th:nth-child(3)';
                const checkElement = document.querySelector(checkElementSelector);
                if (checkElement) {
                    log('[ElementCheck] 检测到特定元素:', checkElement.outerHTML);
                    const extraElement2 = await waitForElementWithText('#nav > div.hidden.lg\\:flex.flex-1.flex-crossCenter.justify-end.wow.animate__.animate__fadeIn.animated > div.flex-crossCenter.gap-6.xl\\:gap-8 > a:nth-child(6)', '', false, 5000);
                    if (extraElement2) {
                        extraElement2.click();
                        log('[ElementCheck] 额外元素2已点击，准备跳到下次循环:', extraElement2.outerHTML);
                        shouldJumpToNextCycle = true;
                    }
                }
            } catch (error) {
                log('[ElementCheck] 检测特定元素时出错:', error.message);
            }
        }, 20000);
    }

    async function performClickSequence(cycle) {
        log(`[Cycle ${cycle}/300] 开始执行`);

        while (pauseMainLoop) {
            log(`[Cycle ${cycle}/300] 主循环已暂停，等待恢复`);
            await sleep(1000);
        }

        const element1XPath = '//*[@id="__next"]/div/div/div[2]/div[3]/div/div/div/div[1]/div/div[2]';
        const element1 = await waitForElementWithText(element1XPath, '', true);
        if (element1) {
            element1.click();
            log('元素1已点击');
        } else {
            log('未找到元素1或不可点击，跳过此循环');
            return false;
        }
        await sleep(getRandomDelay());

        const element2BaseXPath = '/html/body/div[2]/div[3]/div/div/div[3]/div[2]/div/div/div[1~32]';
        const element2Initial = await waitForElementWithText(element2BaseXPath.replace(/\[1~32\]$/, '[1]'), '', true, 30000, true);
        if (element2Initial) {
            const randomElement2 = await getRandomElementFromXPathRange(element2BaseXPath, 1, 32, 30000);
            if (randomElement2) {
                randomElement2.click();
                log('随机选择的元素2已点击:', randomElement2.outerHTML);
            } else {
                log('未找到可点击的随机元素2，跳过此循环');
                return false;
            }
        } else {
            log('未找到元素2基础实例，跳过此循环');
            return false;
        }
        await sleep(getRandomDelay());

        const element3XPath = '//*[@id="__next"]/div/div/div[2]/div[3]/div/div/div/div[2]/div/button';
        const element3 = await waitForElementWithText(element3XPath, '', true, 5000);
        if (element3) {
            element3.click();
            log('元素3已点击');
        } else {
            log('未找到元素3或5秒内不可点击，继续下一步');
        }
        await sleep(getRandomDelay());

        const element4BaseXPath = '//*[@id="__next"]/div/div/div[2]/div[3]/div/div/div/div[2]/div/div[1]/div/div[1~4]';
        const element4 = await getRandomElementFromXPathRange(element4BaseXPath, 1, 4, 5000);
        if (element4) {
            if (isElementClickable(element4)) {
                element4.click();
                log('随机选择的元素4已点击:', element4.outerHTML);
            } else {
                log('元素4不可点击，跳过此循环');
                return false;
            }
        } else {
            log('未找到元素4或5秒内不可点击，执行元素6和7后跳到下个循环');
            const element6XPath = '//*[@id="__next"]/div/div/div[2]/div[1]/div/div[3]/button[1]';
            const element6 = await waitForElementWithText(element6XPath, '', true);
            if (element6) {
                element6.click();
                log('元素6已点击（元素4超时回退）');
            }
            await sleep(getRandomDelay());

            const element7Selector = 'svg.tabler-icon.tabler-icon-check';
            const element7 = await waitForElementWithText(element7Selector, '');
            if (element7) {
                simulateClick(element7);
                log('元素7已点击（元素4超时回退）:', element7.outerHTML);
            }
            return false;
        }
        await sleep(getRandomDelay());

        const element5Selector = 'button.absolute.min-w-\\[94px\\].h-10.bg-primaryOnyx.rounded-\\[8px\\]';
        const element5 = await waitForElementWithText(element5Selector, 'SEND', false, 60000);
        if (element5) {
            log('元素5已出现且文本为"SEND"');
        } else {
            log('1分钟内未出现文本为"SEND"的元素5，尝试点击文本为"STOP"的元素');
            const element5Stop = await waitForElementWithText(element5Selector, 'STOP', false, 5000);
            if (element5Stop) {
                element5Stop.click();
                log('元素5（文本为"STOP"）已点击（超时回退）');
            }
        }
        await sleep(getRandomDelay());

        const element6XPath = '//*[@id="__next"]/div/div/div[2]/div[1]/div/div[3]/button[1]';
        const element6 = await waitForElementWithText(element6XPath, '', true);
        if (element6) {
            element6.click();
            log('元素6已点击');
        } else {
            log('未找到元素6或不可点击，跳过此循环');
            return false;
        }
        await sleep(getRandomDelay());

        const element7Selector = 'svg.tabler-icon.tabler-icon-check';
        const element7 = await waitForElementWithText(element7Selector, '');
        if (element7) {
            simulateClick(element7);
            log('元素7已点击:', element7.outerHTML);
        } else {
            log('未找到元素7或不可点击，跳过此循环');
            return false;
        }

        log(`[Cycle ${cycle}/300] 完成`);
        return true;
    }

    // 主流程
    async function mainFlow() {
        log('脚本开始执行 - 当前页面: https://www.gaianet.ai/chat');
        const maxCycles = 300;

        setTimeout(monitorElement0, 0);
        startElementCheck();

        for (let cycle = 1; cycle <= maxCycles; cycle++) {
            try {
                const success = await performClickSequence(cycle);
                if (!success) {
                    log(`循环 ${cycle} 未完成，继续下一个循环`);
                }
                if (shouldJumpToNextCycle) {
                    log(`[Cycle ${cycle}/300] 因额外元素2点击，跳到下次循环`);
                    shouldJumpToNextCycle = false;
                    continue;
                }
                if (cycle < maxCycles) {
                    log('等待3秒后开始下一次循环');
                    await sleep(3000);
                }
            } catch (error) {
                log(`循环 ${cycle} 执行过程中发生错误: ${error.message}`);
            }
        }
    }

    // 页面加载后启动
    window.addEventListener('load', async function() {
        setupUrlWatcher(); // 启动实时监测
        if (window.location.href === targetUrl) {
            log('页面加载完成，位于目标页面，启动主流程');
            await sleep(2000);
            mainFlow();
        }
    });
})();


