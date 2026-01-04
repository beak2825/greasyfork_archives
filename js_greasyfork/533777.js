// ==UserScript==
// @name         SlowDao
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  开启web3之旅
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533777/SlowDao.user.js
// @updateURL https://update.greasyfork.org/scripts/533777/SlowDao.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.hostname !== 'chat.chainopera.ai') {
        return;
    }

    // 配置参数
    const config = {
        maxRetries: 3,
        retryDelay: 2000,
        checkInterval: 1000,
        timeout: 30000,
        signCheckInterval: 1000, // 检查签到状态的间隔
        maxSignCheckAttempts: 15 // 最大检查次数
    };

    // 等待元素出现的函数
    async function waitForElement(selector, timeout = config.timeout) {
        const startTime = Date.now();
        while (Date.now() - startTime < timeout) {
            const element = document.querySelector(selector);
            if (element) return element;
            await new Promise(resolve => setTimeout(resolve, config.checkInterval));
        }
        return null;
    }

    // 重试函数
    async function retryOperation(operation, maxRetries = config.maxRetries) {
        let lastError;
        for (let i = 0; i < maxRetries; i++) {
            try {
                return await operation();
            } catch (error) {
                console.log(`尝试 ${i + 1}/${maxRetries} 失败:`, error.message);
                lastError = error;
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, config.retryDelay));
                }
            }
        }
        throw lastError;
    }

    // 检查域名
    function checkDomain() {
        if (window.location.hostname !== 'chat.chainopera.ai') {
            throw new Error('不在正确的域名上');
        }
        console.log('检测到正确的域名，开始自动化流程');
    }

    // 点击MetaMask按钮
    async function clickMetaMask() {
        const metamaskButton = await waitForElement('button[type="button"] img[src="/web3-metamask.png"]');
        if (metamaskButton) {
            console.log('找到MetaMask按钮，准备点击');
            metamaskButton.parentElement.click();
            console.log('已点击MetaMask按钮');
        } else {
            console.log('未找到MetaMask按钮，继续执行');
        }
    }

    // 检查钱包连接状态并点击钱包按钮
    async function handleWalletConnection() {
        const walletButton = await waitForElement('button.inline-flex.items-center span.flex.gap-2.items-center.text-xs');
        if (walletButton && walletButton.textContent.includes('0x')) {
            console.log('钱包已连接，点击钱包按钮');
            walletButton.closest('button').click();
            return true;
        }
        console.log('钱包未连接或未找到钱包按钮');
        return false;
    }

    // 获取当前可签到的按钮
    async function getSignableButton() {
        const buttons = document.querySelectorAll('div[data-signed="false"]');
        for (const button of buttons) {
            const innerDiv = button.querySelector('div.border.border-co');
            if (innerDiv && !innerDiv.classList.contains('cursor-not-allowed')) {
                const dayText = button.querySelector('.text-xs').textContent;
                const day = parseInt(dayText.replace('Day ', ''));
                return { button, day };
            }
        }
        return null;
    }

    // 执行对话
    async function performConversations() {
        // 对话按钮的XPath列表
        const conversationXPaths = [
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[2]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[1]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[3]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[4]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[5]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[6]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[7]',
            '/html/body/div[1]/div[3]/div[2]/div/div[2]/div/div[2]/div/div/div[1]/div[2]/div[8]'
        ];

        // 随机打乱XPath顺序
        const shuffledXPaths = [...conversationXPaths].sort(() => Math.random() - 0.5);

        // 点击对话按钮进行对话
        let successCount = 0;
        let currentIndex = 0;

        const targetSuccessCount = Math.floor(Math.random() * 6) + 13; // 生成13-18之间的随机数
        while (successCount < targetSuccessCount) {
            try {
                // 获取当前要点击的按钮
                const xpath = shuffledXPaths[currentIndex % shuffledXPaths.length];
                let element = null;
                const startTime = Date.now();
                // 添加20秒超时机制
                while (!element && Date.now() - startTime < 20000) {
                    element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                    if (!element) {
                        await new Promise(resolve => setTimeout(resolve, 1000)); // 每500ms检查一次
                    }
                }

                if (element) {
                    successCount++;
                    console.log(`准备进行第 ${successCount} 次对话`);
                    element.click();

                    // 等待对话开始
                    await new Promise(resolve => setTimeout(resolve, 5000));

                    // 检查对话是否超时（1分钟）
                    const startTime = Date.now();
                    let hasResponse = false;

                    while (Date.now() - startTime < 120000) {
                        // 检查是否有响应完成
                        const responseComplete = document.querySelector('.text-gray-500.text-xs');
                        if (responseComplete) {
                            hasResponse = true;
                            console.log('对话响应完成');
                            break;
                        }
                        // 点击停止按钮
                        const stopButton = await waitForElement('button.bg-destructive', 20000);
                        if (!stopButton) {
                            break;
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                    // 点击停止按钮
                    const stopButton = await waitForElement('button.bg-destructive', 20000);
                    if (stopButton) {
                        stopButton.click();
                        console.log('成功点击停止按钮');
                        await new Promise(resolve => setTimeout(resolve, 6000));
                        //确保按钮消失
                        const stopButtonDisappear = await waitForElement('button.bg-destructive', 20000);
                        if (!stopButtonDisappear) {
                            console.log('停止按钮已消失');
                        } else {
                            console.log('停止按钮未消失');
                            //点击停止按钮
                            stopButton.click();
                            console.log('成功点击停止按钮');
                            await new Promise(resolve => setTimeout(resolve, 6000));
                        }
                    } else {
                        console.log('未找到停止按钮或等待超时');
                    }

                    const newChatButton = await waitForElement('button.relative.py-3.bg-background svg.lucide-message-square-plus', 5000);
                    if (newChatButton) {
                        newChatButton.closest('button').click();
                        console.log('成功点击新对话按钮');
                        await new Promise(resolve => setTimeout(resolve, 5000));
                    } else {
                        console.log('未找到新对话按钮');
                    }
                    
                } else {

                    console.log(`未找到对话按钮，尝试下一个`);

                    //检测聊天按钮
                    let allButtonsExist = false;
                    for (const xpath of conversationXPaths) {
                        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                        if (element) {
                            allButtonsExist = true;
                            break;
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 5000));
                    
                    if (!allButtonsExist) {
                        // 点击Discover按钮
                        const discoverButton = await waitForElement('button[type="button"] svg path[d*="M12 5.75L12.6107"]', 20000);
                        if (discoverButton) {
                            discoverButton.closest('button').click();
                            console.log('成功点击Discover按钮');
                            await new Promise(resolve => setTimeout(resolve, 3000));
    
                            // 定义目标Agent名称列表
                            const targetAgents = [
                                'Token Analytics Agent',
                                'Caila Agent',
                                'Market Sentiment Radar',
                                'Meme Coin Radar'
                            ];
    
                            // 查找并点击目标Agent卡片
                            let agentFound = false;
                            for (const agentName of targetAgents) {
                                // 查找所有可能的Agent卡片
                                const agentCards = document.querySelectorAll('div.cursor-pointer.group.p-3.sm\\:p-4.rounded-xl');
                                for (const card of agentCards) {
                                    const agentTitle = card.querySelector('h3');
                                    if (agentTitle && agentTitle.textContent.includes(agentName)) {
                                        card.click();
                                        console.log(`成功点击 ${agentName} 卡片`);
                                        agentFound = true;
                                        await new Promise(resolve => setTimeout(resolve, 2000));
                                        break;
                                    }
                                }
                                if (agentFound) break;
                            }
    
                            if (!agentFound) {
                                console.log('未找到目标Agent卡片，尝试重新点击Discover按钮');
                                // 尝试重新点击Discover按钮
                                const retryDiscoverButton = await waitForElement('button[type="button"] svg path[d*="M12 5.75L12.6107"]', 20000);
                                if (retryDiscoverButton) {
                                    retryDiscoverButton.closest('button').click();
                                    console.log('重新点击Discover按钮');
                                    await new Promise(resolve => setTimeout(resolve, 3000));
    
                                    // 再次尝试查找目标Agent卡片
                                    for (const agentName of targetAgents) {
                                        const retryAgentCards = document.querySelectorAll('div.cursor-pointer.group.p-3.sm\\:p-4.rounded-xl');
                                        for (const card of retryAgentCards) {
                                            const agentTitle = card.querySelector('h3');
                                            if (agentTitle && agentTitle.textContent.includes(agentName)) {
                                                card.click();
                                                console.log(`成功点击 ${agentName} 卡片`);
                                                agentFound = true;
                                                await new Promise(resolve => setTimeout(resolve, 2000));
                                                break;
                                            }
                                        }
                                        if (agentFound) break;
                                    }
                                }
                            }
    
                            if (!agentFound) {
                                console.log('仍然未找到目标Agent卡片，跳过当前对话');
                                continue;
                            }
    
                            // 点击Try Agent按钮
                            const tryAgentButton = await waitForElement('div[class*="relative z-10"] p.absolute', 20000);
                            if (tryAgentButton) {
                                tryAgentButton.click();
                                console.log('成功点击Try Agent按钮');
                                await new Promise(resolve => setTimeout(resolve, 2000));
                            } else {
                                console.log('未找到Try Agent按钮或等待超时');
                            }
                        } else {
                            console.log('未找到Discover按钮或等待超时');
                        }
                    }
                }

                // 移动到下一个对话按钮
                currentIndex++;

            } catch (error) {
                console.error(`开始对话时出错:`, error);
                currentIndex++;
            }
        }

        console.log(`总共完成了 ${successCount} 次对话`);
        return successCount >= 10;
    }

    // 执行签到
    async function performSignIn() {
        // 等待签到界面加载
        await new Promise(resolve => setTimeout(resolve, 8000));

        const signInfo = await getSignableButton();
        if (!signInfo) {
            console.log('没有找到可以签到的按钮');
            return false;
        }

        console.log(`准备签到: Day ${signInfo.day}`);
        signInfo.button.click();
        console.log('已点击签到按钮');

        // 等待签到完成
        await new Promise(resolve => setTimeout(resolve, 3000));
        return true;
    }

    // 主流程
    async function main() {
        try {
            checkDomain();

            // 检查钱包是否已经连接
            const connectedWalletButton = await waitForElement('button.inline-flex.items-center.justify-center span.flex.gap-2.items-center.text-xs svg.lucide-wallet', 5000);
            if (connectedWalletButton && connectedWalletButton.closest('span').textContent.includes('0x')) {
                console.log('钱包已经连接，跳过MetaMask连接步骤');
            } else {
                // 执行MetaMask连接
                await retryOperation(clickMetaMask);

                // 等待一段时间让钱包连接完成
                await new Promise(resolve => setTimeout(resolve, 13000));
                
                
            }

            await new Promise(resolve => setTimeout(resolve, 3000));

            // 点击钱包按钮
            await retryOperation(handleWalletConnection);

            // 执行签到
            await performSignIn();
            console.log('签到流程完成');

            // 等待10秒让元素出现
            console.log('等待10秒让返回按钮出现');
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 点击返回按钮
            const backButton = await waitForElement('button.inline-flex.items-center.justify-center.whitespace-nowrap svg rect[transform*="matrix(-1"]', 20000);
            if (backButton) {
                backButton.closest('button').click();
                console.log('成功点击返回按钮');
                await new Promise(resolve => setTimeout(resolve, 2000));
            } else {
                console.log('未找到返回按钮或等待超时');
            }

            console.log('开始对话流程');

            // 执行对话
            const conversationSuccess = await retryOperation(performConversations);

            if (conversationSuccess) {
                window.location.href = 'https://testnet.somnia.network/';
                console.log('所有对话完成');
            } else {
                console.log('对话未全部完成');
            }
        } catch (error) {
            console.error('自动化流程失败:', error.message);
        }
    }

    // 等待页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }
})();

(function() {
    'use strict';

    // 验证当前域名是否为 klokapp.ai
    if (window.location.hostname !== 'klokapp.ai') {
        console.log('此脚本仅适用于 klokapp.ai 域名，当前域名：' + window.location.hostname);
        return;
    }


    const ConnectWallet =setInterval(() => {
        const buttons = document.querySelectorAll('button.style_button__pYQlj');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(ConnectWallet)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    const MetaMask =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(MetaMask)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000);

    const Signin =setInterval(() => {
        const buttons = document.querySelectorAll('button.style_button__pYQlj.style_primary__w2PcZ');
        buttons.forEach(button => {
            // 检查按钮是否包含 "Continue with Google" 文本并且没有 disabled 属性
            if (button.textContent.includes('Sign in') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(Signin)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 5000);

    setInterval(() => {
        const targetElement = document.querySelector('h2');
        if (targetElement && targetElement.textContent.includes('Application error: a client-side exception has occurred')) {
            location.reload();
        }
    }, 5000);


    setInterval(() => {
        location.reload();
    }, 150000);


    function waitForElement(selector, timeout = 10000) {
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

    // 带超时的等待四个按钮的容器出现
    function waitForButtons(timeout = 10000) {
        return waitForElement('.flex.flex-col.lg\\:flex-row.justify-around.items-center.gap-1.w-full.xs\\:mb-40.md\\:mb-0', timeout);
    }

    // 带超时的等待加载指示器消失
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

    // 模拟点击事件（使用 element.click()）
    function simulateClick(element) {
        try {
            element.click();
            console.log('成功点击元素');
        } catch (error) {
            console.error('点击失败:', error);
            throw error; // 抛出错误以便上层处理
        }
    }

    // 获取 "New Chat" 按钮，带重试机制
    async function getNewChatButton() {
        let attempts = 3;
        while (attempts > 0) {
            try {
                return await waitForElement('a[href="/app"]', 10000);
            } catch (e) {
                attempts--;
                console.warn(`未找到 New Chat 按钮，还剩 ${attempts} 次尝试:`, e);
                if (attempts === 0) throw e;
                await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒后重试
            }
        }
    }

    // 跳转检查函数
    function checkAndRedirect() {
        return new Promise(async (resolve) => {
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                console.log('当前计数器值:', counterText, '解析为:', counter);

                if (counter === 10 || counter === 50) {
                    const nextPageUrl = 'https://earn.taker.xyz';
                    window.location.href = nextPageUrl;
                    console.log('计数器为10，跳转到:', nextPageUrl);
                    await new Promise(resolve => setTimeout(resolve, 2000)); // 等待2秒确认跳转
                    resolve();
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

            // 第一步：点击"New Chat"按钮
            const newChatButton = await getNewChatButton();
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
        let maxCycles = 10; // 最大循环次数
        let cycleCount = 0;
        let consecutiveFailures = 0;
        const maxFailures = 5; // 最大连续失败次数

        while (cycleCount < maxCycles && consecutiveFailures < maxFailures) {
            console.log(`开始第 ${cycleCount + 1} 次循环`);
            const success = await runChatCycle();
            if (!success) {
                consecutiveFailures++;
                console.log(`本周期失败 (${consecutiveFailures}/${maxFailures})，暂停10秒后重试`);
                await new Promise(resolve => setTimeout(resolve, 20000));
            } else {
                consecutiveFailures = 0;
                cycleCount++;
                console.log(`本周期成功，完成 ${cycleCount} 次循环`);
                await new Promise(resolve => setTimeout(resolve, 20000));
            }

            // 单独检查计数器并跳转
            try {
                const counterElement = await waitForXPath('/html/body/div[1]/div[2]/div[2]/div[1]/div/div[1]/div[1]/div[2]/div[1]', 5000);
                const counterText = counterElement ? counterElement.textContent.trim() : '';
                const counter = parseInt(counterText) || 0;
                if (counter === 10) {
                    console.log('检测到计数器为10，准备跳转');
                    await checkAndRedirect();
                    break; // 跳转后退出循环
                }
            } catch (error) {
                console.error('计数器检查超时:', error);
            }
        }

        if (consecutiveFailures >= maxFailures) {
            console.error('连续失败次数达到上限，脚本终止');
        } else {
            console.log('脚本执行结束，总计完成', cycleCount, '次循环');
        }
    })();

    // 提供手动触发跳转的接口
    window.checkAndRedirect = checkAndRedirect;
})();
(function() {
    'use strict';

     if (window.location.hostname !== 'bitlightlabs.com') {
        return;
    }
    const Connect =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect Wallet') &&
                !button.hasAttribute('disabled')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(Connect)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000)

    const Start =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Start') &&
                !button.hasAttribute('disabled') && !button.textContent.includes('Verify your X account') && !button.textContent.includes('Verify Account')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
                clearInterval(Start)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000)

    setInterval(() => {
        const svgButton = document.querySelector('button[class*="gap-2 whitespace-nowrap"] svg[width="15"][height="15"]');
        if (svgButton && svgButton.closest('button')) {
            svgButton.closest('button').click();
        }
    }, 30000);


    const Starttime =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Start') &&
                !button.hasAttribute('disabled') && !button.textContent.includes('Verify your X account') && !button.textContent.includes('Verify Account')) {
                console.log('找到可点击的按钮，正在点击...');
                button.click();
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 50000)

    const Verify =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.textContent.includes('Connect Wallet') && button.textContent.includes('Verify Account') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Verify)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000)
    const Xaccount =setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.textContent.includes('Connect Wallet') && button.textContent.includes('Verify your X account') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Xaccount)
            } else if (button.hasAttribute('disabled')) {
                console.log('按钮不可点击，跳过');
            }
        });
    }, 2000)

})();
(function() {
    'use strict';

     if (window.location.hostname !== 'faucets.chain.link') {
        return;
    }

    function simulateClick(element) {
        if (element) {
            const clickEvent = new MouseEvent('click', {
                bubbles: true,
                cancelable: true
            });
            element.dispatchEvent(clickEvent);
            return true;
        }
        return false;
    }

    // 登录相关逻辑
    const login = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Connect') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                    clearInterval(login);
                }
            }
        });
    }, 3000);

    // 点击 Sepolia faucet card
    const clickSepoliaCard = setInterval(() => {
        const sepoliaCard = document.querySelector('button[data-testid="faucet_card_sepolia_link"]');
        if (sepoliaCard && !sepoliaCard.hasAttribute('disabled')) {
            if (simulateClick(sepoliaCard)) {
                clearInterval(clickSepoliaCard);
            }
        }
    }, 2000);

    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('MetaMask') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                    console.log('模拟点击 MetaMask 按钮');
                    clearInterval(MetaMask);
                }
            } else if (button.hasAttribute('disabled')) {
                const checkbox = document.getElementById('accept-terms');
                if(checkbox && !checkbox.hasAttribute('disabled')){
                    if (simulateClick(checkbox)) {
                        console.log('模拟点击 accept-terms 复选框');
                    }
                }
            }
        });
    }, 2000);

    const Continue = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.includes('Continue') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                    clearInterval(Continue);
                }
            }
        });
    }, 3000);
    const getTokens = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.hasAttribute('Connect') || button.textContent.includes('Get tokens') && !button.hasAttribute('disabled')) {
                if (simulateClick(button)) {
                }
            }
        });
    }, 2000);

})();
(function() {
    const observer = new MutationObserver(() => {
        if (window.location.href.includes("x.com") || window.location.href.includes("twitter.com") || window.location.href.includes("discord.com") || window.location.href.includes("https://api.x.com/oauth/authorize")) {
            const allElements = Array.from(document.querySelectorAll('*'));
            allElements.forEach(el => {
                const buttonText = el.innerHTML.trim();
                if (['Authorize app'].includes(buttonText) && el.tagName === 'BUTTON') {
                    setTimeout(() => {
                        el.click();
                    }, 2000);
                }
            });
            const currentUrl = new URL(window.location.href);
            const currentPath = currentUrl.pathname;
            let xComIndex = "";
            if(currentUrl.href.indexOf("x.com")){
                xComIndex=currentUrl.href.indexOf("x.com")
            }
            if(currentUrl.href.indexOf("api.x.com")){
                xComIndex=currentUrl.href.indexOf("api.x.com")
            }
            if(currentUrl.href.indexOf("discord.com")){
                xComIndex=currentUrl.href.indexOf("discord.com")
            }
            const hasTwoSegments = xComIndex !== -1 && (currentUrl.href.slice(xComIndex + 5).split('/').length - 1) >= 2 || currentUrl.href.includes('?') || currentUrl.href.includes('&');
            if(window.location.href.includes("x.com")){
                const popup = document.querySelector('div[data-testid="confirmationSheetDialog"]');
                if (popup) {
                    try {
                        const repostButton = Array.from(popup.querySelectorAll('*')).find(el => el.innerHTML.trim().includes('Repost') || el.innerHTML.trim().includes('Post'));
                        if (repostButton) {
                            setTimeout(() => {
                                repostButton.click();
                                setTimeout(() => {window.close();}, 6000);
                            }, 2000);
                        }
                    } catch (error) {
                        console.error("点击弹窗按钮时出错:", error);
                    }
                }


                const authorizeSpan = allElements.find(span => span.innerHTML.trim() === 'Authorize app' && span.tagName === 'SPAN');
                if (authorizeSpan) {
                    const button = authorizeSpan.closest('button');
                    if (button) {
                        setTimeout(() => {
                            button.click();
                            observer.disconnect();
                            setTimeout(() => {window.close();}, 6000);
                        }, 2000);
                    }
                }
                const followButton = allElements.find(el =>['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].some(text => el.innerHTML.trim().includes(text)) && el.tagName === 'BUTTON');
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);

                }
                const followInput = allElements.find(input =>input.tagName === 'INPUT' && input.type === 'submit' && ['Follow', 'Authorize app', 'Repost', 'Post', 'Like'].includes(input.value.trim()));
                if (followButton) {
                    setTimeout(() => {
                        followButton.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }

                const specificInput = allElements.find(input => input.tagName === 'INPUT' && input.type === 'submit' && input.value === "Authorize app");
                if (specificInput) {
                    setTimeout(() => {
                        specificInput.click();
                        observer.disconnect();
                        setTimeout(() => {window.close();}, 6000);
                    }, 2000);
                }
            }
        }
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    // Your code here...
})();
(function() {
    if (window.location.hostname !== 'accounts.google.com') {
        return;
    }

    'use strict';
    // Function to check if the URL contains a specific Google account path
    function checkGoogleAccountPath() {
        if (window.location.href.includes('https://accounts.google.com')) {
            console.log('URL contains Google account path.');
            // Find and click the div containing an email address
            const emailDiv = document.querySelector('div[data-email*="@gmail.com"]');
            if (emailDiv) {
                emailDiv.click();
                console.log('Clicked the div containing an email address.');
            }
        }
    }

    // Function to click a button with text "Continue"
    function clickContinueButton() {
        const continueButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('Continue') || button.textContent.includes('Doorgaan') || button.textContent.includes('Continuar') || button.textContent.includes('ดำเนินการต่อ'));
        if (continueButton) {
            continueButton.click();
            console.log('Clicked the button with text "Continue".');
        }
    }

    // Function to handle password input and click the "Next" button
    function handlePasswordInput() {
        const passwordInput = document.querySelector('input[type="password"]');
        const nextButton = Array.from(document.querySelectorAll('button')).find(button => button.textContent.includes('下一步') || button.textContent.includes('Next') || button.textContent.includes('Volgende'));

        if (passwordInput && nextButton) {
            if (passwordInput.value === '') {
                passwordInput.value = 'DorothyKBlackshear'; // Replace with the actual password
                console.log('Entered password.');
            }
            if (nextButton && passwordInput.value !== '') {
                nextButton.click();
                console.log('Clicked the "Next" button.');
            }
        }
    }

    // Set an interval to continuously scan and perform actions
    setInterval(() => {
        if (window.location.href.includes('accounts.google.com')) {
            checkGoogleAccountPath();
            clickContinueButton();
            handlePasswordInput();
        }
    }, 2000); // Adjust the interval time as needed (2000ms = 2 seconds)

    document.addEventListener('DOMContentLoaded', () => {
        //clickButton();
    });

})();
(function() {
    'use strict';
    if (window.location.hostname !== 'app.gata.xyz') {
        return;
    }
    const Start = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Start') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Start);
            }
        });
    }, 5000);
    const MetaMask = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 30000);
    const Start1 = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Start') &&
                !button.hasAttribute('disabled')) {
                button.click();
            }
        });
    }, 30000);
    const MetaMask1 = setInterval(() => {
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('MetaMask') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(MetaMask1);
            }
        });
    }, 5000);
    const Skip = setInterval(() => {
        const buttons = document.querySelectorAll('div');
        buttons.forEach(button => {
            if (button.textContent.trim().includes('Skip & Register >>') &&
                !button.hasAttribute('disabled')) {
                button.click();
                clearInterval(Skip);
            }
        });
    }, 5000);
    // Your code here...
})();