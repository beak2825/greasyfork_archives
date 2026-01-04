// ==UserScript==
// @name         Klok Automation
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动在Klok上循环创建新聊天并随机选择提示，仅在 klokapp.ai 运行
// @author       You
// @match        https://klokapp.ai/*
// @match        https://app.olab.xyz/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528745/Klok%20Automation.user.js
// @updateURL https://update.greasyfork.org/scripts/528745/Klok%20Automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.hostname !== 'klokapp.ai') {
        return;
    }

    // 带超时的等待元素出现的函数
    function waitForElement(selector, timeout = 10000) { // 默认10秒超时
        return Promise.race([
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 500);
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`等待元素 ${selector} 超时`)), timeout);
            })
        ]);
    }

    // 使用 XPath 等待元素出现的函数
    function waitForXPath(xpath, timeout = 10000) {
        return Promise.race([
            new Promise((resolve) => {
                const interval = setInterval(() => {
                    const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
                    const element = result.singleNodeValue;
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    }
                }, 500);
            }),
            new Promise((_, reject) => {
                setTimeout(() => reject(new Error(`等待 XPath ${xpath} 超时`)), timeout);
            })
        ]);
    }

    // 带超时的等待四个按钮的容器出现的函数
    function waitForButtons(timeout = 10000) {
        return waitForElement('.flex.flex-col.lg\\:flex-row.justify-around.items-center.gap-1.w-full.xs\\:mb-40.md\\:mb-0', timeout);
    }

    // 带超时的等待加载指示器消失的函数
    function waitForLoadingToFinish(timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkLoading = () => {
                const loadingDots = document.querySelector('.style_loadingDots__6shQU');
                console.log('检查加载状态:', loadingDots ? '存在' : '不存在');
                if (!loadingDots || loadingDots.offsetParent === null) {
                    clearInterval(interval);
                    resolve();
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    reject(new Error('等待加载指示器消失超时'));
                }
            };
            const interval = setInterval(checkLoading, 500);
            checkLoading(); // 立即检查一次
        });
    }

    // 模拟点击事件
    function simulateClick(element) {
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    // 单独的跳转检查函数
    function checkAndRedirect() {
        return new Promise(async (resolve) => {
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                console.log('当前计数器值:', counterText, '解析为:', counter);

                if (counter === 10) {
                    const nextPageUrl = 'https://earn.taker.xyz'; // 请替换为实际的下一页URL
                    window.location.href = nextPageUrl;
                    console.log('计数器为10，跳转到:', nextPageUrl);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒确认跳转
                    resolve(); // 跳转后退出
                } else {
                    console.log('计数器不为10，无需跳转');
                    resolve();
                }
            } catch (error) {
                console.error('跳转检查出错:', error);
                resolve();
            }
        });
    }

    // 一次完整流程的执行
    async function runChatCycle() {
        try {
            console.log('开始新聊天周期');

            // 第一步：点击“New Chat”按钮
            const newChatButton = await waitForElement('a[href="/app"]', 5000);
            console.log('找到 New Chat 按钮，准备点击');
            simulateClick(newChatButton);
            await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒让页面响应

            // 第二步：等待四个按钮出现并随机点击一个
            const buttonsContainer = await waitForButtons();
            console.log('找到按钮容器，准备随机点击');
            const buttons = buttonsContainer.querySelectorAll('button');
            if (buttons.length > 0) {
                const randomIndex = Math.floor(Math.random() * buttons.length);
                simulateClick(buttons[randomIndex]);
                console.log('随机点击第', randomIndex + 1, '个按钮');
                await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒让页面响应
            } else {
                console.log('未找到按钮');
                return false;
            }

            // 等待加载指示器消失
            console.log('等待加载完成...');
            await waitForLoadingToFinish();
            console.log('加载完成');

            // 检查跳转
            await checkAndRedirect();
            return true; // 表示周期成功完成
        } catch (error) {
            console.error('聊天周期出错:', error);
            return false; // 表示周期失败
        }
    }

    // 主逻辑 - 循环执行
    (async () => {
        let maxCycles = 10; // 最大循环次数，可调整
        let cycleCount = 0;

        while (cycleCount < maxCycles) {
            console.log(`开始第 ${cycleCount + 1} 次循环`);
            const success = await runChatCycle();
            if (!success) {
                console.log('本周期失败，暂停10秒后重试');
                await new Promise(resolve => setTimeout(resolve, 10000)); // 失败后暂停10秒
            } else {
                cycleCount++;
                console.log(`本周期成功，完成 ${cycleCount} 次循环`);
                await new Promise(resolve => setTimeout(resolve, 2000)); // 成功后暂停2秒
            }

            // 单独检查计数器并跳转
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                if (counter === 10) {
                    console.log('检测到计数器为10，准备跳转');
                    await checkAndRedirect(); // 调用跳转函数
                    break; // 跳转后退出循环
                }
            } catch (error) {
                console.error('计数器检查超时:', error);
            }
        }

        console.log('脚本执行结束，总计完成', cycleCount, '次循环');
    })();

    // 提供手动触发跳转的接口
    window.checkAndRedirect = checkAndRedirect;
})();

(function() {
    'use strict';
    const currentPath = window.location.pathname;

    if (window.location.hostname == 'app.olab.xyz') {
        if (currentPath === "/taskCenter") {
            setInterval(() => {
                const checkInButton = Array.from(document.querySelectorAll('button'))
                .find(button => button.textContent.includes('Check-in'));

                if (checkInButton) {
                    checkInButton.click();
                }
            }, 5000);
        }
    }

})();

