// ==UserScript==
// @name         ONPJS
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  监控proof数量并在3分钟无变化时自动切换按钮状态
// @author       TinYueUS@gmail.com
// @match        https://onprover.orochi.network/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      onprover.orochi.network
// @connect      open.feishu.cn
// @downloadURL https://update.greasyfork.org/scripts/537534/ONPJS.user.js
// @updateURL https://update.greasyfork.org/scripts/537534/ONPJS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加设备名称配置
    const DEVICE_NAME = 'P-1'; // 你可以修改这个设备名称
    const FEISHU_WEBHOOK = ''; //飞书 WEBHOOK

    let lastProofCount = null;
    let unchangedCount = 0;
    let isProving = true;
    let checkInterval = null;
    let isHandlingButtonState = false;
    let switchAttemptCount = 0; // 记录切换按钮尝试次数
    let lastSwitchProofCount = null; // 记录上次切换时的proof数量
    let cloudflareCheckInterval = null;
    if (FEISHU_WEBHOOK === '') {
       return;
    }
    // 发送飞书通知
    async function sendFeishuNotification(message) {
        try {
            await GM_xmlhttpRequest({
                method: 'POST',
                url: FEISHU_WEBHOOK,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    msg_type: 'text',
                    content: {
                        text: `[${DEVICE_NAME}] ${message}`
                    }
                })
            });
            console.log('飞书通知发送成功');
        } catch (error) {
            console.error('飞书通知发送失败:', error);
        }
    }

    // 检查是否在Cloudflare验证页面
    function isCloudflarePage() {
        return document.title.includes('Cloudflare') ||
               document.querySelector('#challenge-running') !== null ||
               document.querySelector('#challenge-stage') !== null;
    }

    // 等待Cloudflare验证完成
    function waitForCloudflare() {
        return new Promise((resolve) => {
            if (!isCloudflarePage()) {
                resolve();
                return;
            }

            console.log('检测到Cloudflare验证，等待验证完成...');

            let waitTime = 0;
            let notificationSent = false;

            const checkCloudflare = () => {
                if (!isCloudflarePage()) {
                    console.log('Cloudflare验证已完成');
                    // 重置通知状态
                    notificationSent = false;
                    resolve();
                    return;
                }

                waitTime += 1;

                // 当等待时间超过15秒且未发送过通知时发送通知
                if (waitTime >= 20 && !notificationSent) {
                    sendFeishuNotification(`Cloudflare验证时间超过15秒！当前已等待${waitTime}秒`);
                    notificationSent = true;
                }

                setTimeout(checkCloudflare, 1000);
            };

            checkCloudflare();
        });
    }

    // 获取当前proof数量
    function getProofCount() {
        const proofElement = document.querySelector('p.text-24.font-doto.text-zk-blue-300.font-bold');
        if (proofElement) {
            return parseInt(proofElement.textContent.trim());
        }
        return null;
    }

    // 获取当前按钮状态
    function getButtonState() {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.textContent.includes('prove')) {
                return 'prove';
            } else if (button.textContent.includes('Stop proving')) {
                return 'stop';
            }
        }
        return null;
    }

    // 点击按钮的函数
    function clickButton() {
        const buttons = document.querySelectorAll('button');
        for (const button of buttons) {
            if (button.textContent.includes('prove') || button.textContent.includes('Stop proving')) {
                console.log('正在点击按钮:', button.textContent.trim());
                button.click();
                isProving = !isProving;
                break;
            }
        }
    }

    // 检查proof数量是否变化
    function checkProofCount() {
        const currentCount = getProofCount();

        if (currentCount === null) {
            console.log('无法获取proof数量，等待页面加载...');
            return;
        }

        if (lastProofCount === null) {
            lastProofCount = currentCount;
            console.log('初始化proof数量:', currentCount);
            return;
        }

        // 如果proof数量发生变化，重置所有计数器
        if (currentCount !== lastProofCount) {
            console.log(`Proof数量已变化: ${lastProofCount} -> ${currentCount}`);
            unchangedCount = 0;
            lastProofCount = currentCount;
            switchAttemptCount = 0;
            lastSwitchProofCount = null;
            return;
        }

        if (currentCount === lastProofCount) {
            unchangedCount++;
            console.log(`Proof数量未变化: ${currentCount}, 已持续${unchangedCount}次检查`);

            // 检查是否需要切换按钮状态或刷新页面
            if (!isHandlingButtonState) {
                const currentState = getButtonState();

                // 在Stop proving状态下，连续10次未变化时刷新页面
                if (currentState === 'stop' && unchangedCount >= 10) {
                    console.log('Stop proving状态下连续10次proof数量未变化，准备刷新页面');
                    // 保存当前状态
                    GM_setValue('lastProofCount', currentCount);
                    GM_setValue('switchAttemptCount', switchAttemptCount);
                    // 使用location.reload()进行页面刷新
                    window.location.reload();
                    return;
                }

                // 在prove状态下，连续2次未变化时切换到Stop proving
                if (currentState === 'prove' && unchangedCount === 2) {
                    console.log('Proof数量连续两次未变化且按钮为prove状态，准备切换到Stop proving状态');
                    isHandlingButtonState = true;
                    handleButtonState();
                    // 重置unchangedCount
                    unchangedCount = 0;
                }
            }
        }
    }

    // 等待按钮状态切换
    function waitForButtonState(targetState) {
        return new Promise((resolve) => {
            let attempts = 0;
            const maxAttempts = 30; // 最多等待30秒

            const checkButton = () => {
                const currentState = getButtonState();
                if (currentState === targetState) {
                    console.log(`按钮已切换到${targetState}状态`);
                    resolve(true);
                    return;
                }

                attempts++;
                if (attempts >= maxAttempts) {
                    console.log(`等待按钮切换到${targetState}状态超时`);
                    resolve(false);
                    return;
                }

                setTimeout(checkButton, 1000);
            };
            checkButton();
        });
    }

    // 处理按钮状态切换
    async function handleButtonState() {
        try {
            const currentState = getButtonState();
            console.log('当前按钮状态:', currentState);

            // 记录切换前的proof数量
            lastSwitchProofCount = getProofCount();

            if (currentState === 'prove') {
                // 如果当前是prove状态，点击切换到stop状态
                console.log('切换到Stop proving状态');
                clickButton();
                // 等待按钮状态变化
                await waitForButtonState('stop');
                // 额外等待5秒确保状态稳定
                await new Promise(resolve => setTimeout(resolve, 5000));
            } else if (currentState === 'stop') {
                // 如果当前是stop状态，等待一段时间后点击切换到prove状态
                console.log('当前是Stop proving状态，等待5秒后切换到prove状态');
                await new Promise(resolve => setTimeout(resolve, 5000));
                clickButton();
                // 等待按钮状态变化
                await waitForButtonState('prove');
                // 额外等待5秒确保状态稳定
                await new Promise(resolve => setTimeout(resolve, 5000));
            }

            // 重置计数器
            unchangedCount = 0;
            console.log('按钮状态切换完成，重置计数器');
        } finally {
            isHandlingButtonState = false;
        }
    }

    // 主循环
    function mainLoop() {
        checkProofCount();
    }

    // 等待页面加载完成
    async function waitForPageLoad() {
        // 等待Cloudflare验证完成
        await waitForCloudflare();

        return new Promise((resolve) => {
            let loadingAttempts = 0;
            let notificationSent = false;

            const checkPage = () => {
                const proofElement = document.querySelector('p.text-24.font-doto.text-zk-blue-300.font-bold');
                const buttons = document.querySelectorAll('button');

                if (proofElement && buttons.length > 0) {
                    console.log('页面加载完成，开始监控');
                    resolve();
                    return;
                }

                loadingAttempts++;
                console.log(`等待页面加载...${loadingAttempts}次`);

                // 当等待次数超过15次且未发送过通知时发送通知
                if (loadingAttempts >= 15 && !notificationSent) {
                    sendFeishuNotification(`页面加载时间过长！已尝试加载 ${loadingAttempts} 次`);
                    notificationSent = true;
                }

                setTimeout(checkPage, 1000);
            };
            checkPage();
        });
    }

    // 启动脚本
    async function startScript() {
        try {
            // 恢复之前保存的状态
            const savedProofCount = GM_getValue('lastProofCount');
            const savedSwitchAttemptCount = GM_getValue('switchAttemptCount');
            if (savedProofCount !== undefined) {
                lastProofCount = savedProofCount;
                switchAttemptCount = savedSwitchAttemptCount;
                console.log('恢复之前的状态:', { lastProofCount, switchAttemptCount });
            }

            await waitForPageLoad();

            // 清除可能存在的旧定时器
            if (checkInterval) {
                clearInterval(checkInterval);
            }

            // 设置新的定时器，每10秒执行一次
            checkInterval = setInterval(mainLoop, 10 * 1000);

            // 立即执行一次
            mainLoop();

            console.log('脚本已启动，每10秒检查一次');
        } catch (error) {
            console.error('脚本启动失败:', error);
        }
    }

    // 启动脚本
    startScript();
})();
