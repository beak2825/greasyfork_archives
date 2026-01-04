// ==UserScript==
// @name            [银河奶牛]库存物品快速交易(支持右一左一快速操作)
// @namespace       https://tampermonkey.net/
// @version         1.1.1
// @description     一键自动出售物品,当单击选择了物品,也就是展开了前往市场,然后按S键,就会自动卖右一,按A键就会自动挂左一
// @author          YuoHira
// @license         MIT
// @icon            https://www.milkywayidle.com/favicon.svg
// @match           https://www.milkywayidle.com/game*
// @downloadURL https://update.greasyfork.org/scripts/536865/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%93%E5%AD%98%E7%89%A9%E5%93%81%E5%BF%AB%E9%80%9F%E4%BA%A4%E6%98%93%28%E6%94%AF%E6%8C%81%E5%8F%B3%E4%B8%80%E5%B7%A6%E4%B8%80%E5%BF%AB%E9%80%9F%E6%93%8D%E4%BD%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536865/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%93%E5%AD%98%E7%89%A9%E5%93%81%E5%BF%AB%E9%80%9F%E4%BA%A4%E6%98%93%28%E6%94%AF%E6%8C%81%E5%8F%B3%E4%B8%80%E5%B7%A6%E4%B8%80%E5%BF%AB%E9%80%9F%E6%93%8D%E4%BD%9C%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局变量，用于取消操作
    let isOperating = false;

    // 模拟真实用户点击
    function simulateRealClick(element) {
        if (!element) return false;
        
        try {
            // 获取元素的位置和大小
            const rect = element.getBoundingClientRect();
            
            // 计算元素中心位置
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            // 添加1-5像素的随机偏移
            const offsetX = (Math.random() * 10 - 5); // -5到5之间的随机偏移
            const offsetY = (Math.random() * 10 - 5); // -5到5之间的随机偏移
            
            // 最终点击位置 (确保不会超出元素边界)
            const clickX = Math.min(Math.max(centerX + offsetX, rect.left + 2), rect.right - 2);
            const clickY = Math.min(Math.max(centerY + offsetY, rect.top + 2), rect.bottom - 2);
            
            // 创建鼠标事件，添加位置信息
            const eventOptions = {
                bubbles: true,
                cancelable: true,
                view: window,
                button: 0,
                buttons: 1,
                clientX: clickX,
                clientY: clickY,
                screenX: clickX,
                screenY: clickY
            };
            
            const mouseDownEvent = new MouseEvent('mousedown', eventOptions);
            const mouseUpEvent = new MouseEvent('mouseup', eventOptions);
            const clickEvent = new MouseEvent('click', eventOptions);
            
            // 随机延迟模拟人类行为
            const delay1 = Math.floor(Math.random() * 20) + 10; // 10-30ms
            const delay2 = Math.floor(Math.random() * 30) + 20; // 20-50ms
            
            // 分发事件序列
            element.dispatchEvent(mouseDownEvent);
            
            setTimeout(() => {
                element.dispatchEvent(mouseUpEvent);
                
                setTimeout(() => {
                    element.dispatchEvent(clickEvent);
                }, delay2);
            }, delay1);
            
            return true;
        } catch (e) {
            console.error('模拟点击失败:', e);
            // 如果模拟失败，回退到普通点击
            try {
                element.click();
                return true;
            } catch (clickError) {
                console.error('普通点击也失败:', clickError);
                return false;
            }
        }
    }

    // 显示临时提示信息
    function showTemporaryMessage(message, duration = 3000) {
        // 移除之前可能存在的临时提示
        const existingMessage = document.getElementById('temporary-script-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // 创建提示元素
        const messageDiv = document.createElement('div');
        messageDiv.id = 'temporary-script-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 25px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 16px;
            opacity: 1;
            transition: opacity 0.5s ease-in-out;
            pointer-events: none; /* 不影响下方元素的点击 */
        `;

        // 添加到页面
        document.body.appendChild(messageDiv);

        // 设置定时器，duration毫秒后移除
        setTimeout(() => {
            messageDiv.style.opacity = '0'; // 淡出效果
            setTimeout(() => {
                messageDiv.remove();
            }, 500); // 等待淡出动画完成再移除
        }, duration);
    }

    // 按键触发自动交易
    document.addEventListener('keydown', function (event) {
        if (event.key.toLowerCase() === 's') {
            event.preventDefault();
            if (!isOperating) {
                autoSell();
            }
        } else if (event.key.toLowerCase() === 'a') {
            event.preventDefault();
            if (!isOperating) {
                autoSellLeft();
            }
        } else if (isOperating) {
            // 按下任意其他键取消操作
            isOperating = false;
            console.log('用户取消了操作');
            // 将alert替换为showTemporaryMessage
            showTemporaryMessage('已取消操作', 3000);
        }
    });

    // 查找按钮函数 - 根据按钮文本查找
    function findButtonByText(buttonText, container = document) {
        // 将buttonText转换为数组，支持"或"操作
        const textArray = Array.isArray(buttonText) ? buttonText : [buttonText];

        // 查找所有按钮元素
        const buttons = container.querySelectorAll('button');

        // 遍历所有按钮查找匹配文本的按钮
        for (const btn of buttons) {
            for (const text of textArray) {
                if (btn.textContent.includes(text)) {
                    return btn;
                }
            }
        }

        // 查找可能嵌套在其他元素中的按钮
        const elements = container.querySelectorAll('*');
        for (const el of elements) {
            for (const text of textArray) {
                if (el.textContent.trim() === text && el.querySelector('button')) {
                    return el.querySelector('button');
                }
            }
        }

        return null;
    }

    // 查找按钮函数 - 根据精确匹配的文本查找
    function findButtonByExactText(buttonText, container = document) {
        // 查找所有按钮元素
        const buttons = container.querySelectorAll('button');

        // 遍历所有按钮查找完全匹配文本的按钮
        for (const btn of buttons) {
            if (btn.textContent.trim() === buttonText) {
                return btn;
            }
        }

        // 查找可能嵌套在其他元素中的按钮
        const elements = container.querySelectorAll('*');
        for (const el of elements) {
            // 检查元素自身是否完全匹配
            if (el.childNodes.length === 1 && el.textContent.trim() === buttonText) {
                const nearestButton = el.closest('button');
                if (nearestButton) {
                    return nearestButton;
                }
            }

            // 检查元素内是否有完全匹配的文本节点
            const textNodes = Array.from(el.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
            for (const textNode of textNodes) {
                if (textNode.textContent.trim() === buttonText) {
                    const nearestButton = el.closest('button') || el.querySelector('button');
                    if (nearestButton) {
                        return nearestButton;
                    }
                }
            }
        }

        return null;
    }

    // 创建步骤对象 - 封装步骤逻辑
    function createStep(name, containerSelector, buttonTextOrArray, exactMatch = false, successCallback = null) {
        return {
            name: name,
            fn: () => {
                // 使用querySelectorAll查找所有匹配的容器元素
                const containers = document.querySelectorAll(containerSelector);
                if (containers.length === 0) {
                    return false;
                }
                
                // 遍历所有容器
                for (const container of containers) {
                    // 执行成功回调（如果有）
                    if (successCallback) {
                        const callbackResult = successCallback(container);
                        if (callbackResult === true) {
                            return true;
                        }
                    }

                    // 查找并点击按钮
                    const btn = exactMatch
                        ? findButtonByExactText(buttonTextOrArray, container)
                        : findButtonByText(buttonTextOrArray, container);

                    if (btn) {
                        // 使用模拟真实点击替代普通点击
                        return simulateRealClick(btn);
                    }
                }
                
                return false;
            }
        };
    }

    // 持续尝试执行步骤直到成功或超时
    async function tryExecuteStep(stepFn, stepName, timeout = 5000) {
        console.log(`尝试执行: ${stepName}`);
        return new Promise((resolve) => {
            const startTime = Date.now();

            // 使用requestAnimationFrame持续尝试
            function attemptStep() {
                if (!isOperating) {
                    resolve(false); // 用户取消了操作
                    return;
                }

                try {
                    const success = stepFn();
                    if (success) {
                        console.log(`成功: ${stepName}`);
                        resolve(true);
                        return;
                    }
                } catch (err) {
                    console.error(`执行错误 ${stepName}:`, err);
                }

                // 检查是否超时
                if (Date.now() - startTime > timeout) {
                    console.error(`超时: ${stepName}`);
                    resolve(false);
                    return;
                }

                // 继续尝试
                requestAnimationFrame(attemptStep);
            }

            attemptStep();
        });
    }

    // 执行一系列步骤
    async function executeSteps(steps) {
        for (let i = 0; i < steps.length; i++) {
            if (!isOperating) {
                showTemporaryMessage('操作已取消', 3000);
                break;
            }

            const step = steps[i];
            const success = await tryExecuteStep(step.fn, step.name);

            if (!success) {
                console.error(`步骤 ${i + 1} (${step.name}) 失败`);
                isOperating = false;
                showTemporaryMessage(`步骤 ${i + 1} (${step.name}) 失败: 请手动检查`, 3000);
                return false;
            }

            // 成功执行完一个步骤后等待一小段时间让UI更新
            await new Promise(resolve => setTimeout(resolve, 300));
        }

        return true;
    }

    // 自动交易流程 - 直接出售
    async function autoSell() {
        isOperating = true;

        // 检查是否选择了物品
        if (!document.querySelector('[class*="Item_selected__"]')) {
            // 将alert替换为showTemporaryMessage
            showTemporaryMessage('请先选择物品!', 3000);
            isOperating = false;
            return;
        }

        // 定义交易步骤
        const steps = [
            // 步骤1: 前往市场
            createStep('前往市场', '[class*="MuiTooltip-tooltip"]', '前往市场'),

            // 步骤2: 点击出售
            createStep('点击出售', '[class*="MarketplacePanel_orderBook"]', '出售', true),

            // 步骤3: 点击全部或检查已有最多
            createStep('点击全部', '[class*="MarketplacePanel_modalContent"]', ['全部', '最多']),

            // 步骤4: 发布出售订单
            createStep('发布出售订单', '[class*="MarketplacePanel_modalContent__"]', '发布出售')
        ];

        // 执行步骤
        const success = await executeSteps(steps);

        isOperating = false;
        if (success) {
            console.log('交易完成!');
            // 可以选择在这里也加一个完成提示
            // showTemporaryMessage('直接出售完成!', 3000);
        }
    }

    // 自动交易流程 - 挂左一
    async function autoSellLeft() {
        isOperating = true;

        // 检查是否选择了物品
        if (!document.querySelector('[class*="Item_selected__"]')) {
            // 替换alert，使用自定义函数显示3秒后自动消失的提示
            showTemporaryMessage('请先选择物品!', 3000); // 显示提示信息，持续3秒
            isOperating = false;
            return;
        }

        // 定义交易步骤
        const steps = [
            // 步骤1: 前往市场
            createStep('前往市场', '[class*="MuiTooltip-tooltip"]', '前往市场'),

            // 步骤2: 点击新出售挂牌
            createStep('新出售挂牌', '[class*="MarketplacePanel_orderBook"]', '新出售挂牌'),

            // 步骤3: 点击全部或检查已有最多
            createStep('点击全部', '[class*="MarketplacePanel_modalContent"]', ['全部', '最多']),

            // 步骤4: 点击"+"按钮（左一）
            createStep('点击加号', '[class*="MarketplacePanel_modalContent"]', '+'),

            // 步骤5: 发布出售订单
            createStep('发布出售订单', '[class*="MarketplacePanel_modalContent__"]', '发布出售')
        ];

        // 执行步骤
        const success = await executeSteps(steps);

        isOperating = false;
        if (success) {
            console.log('挂左一完成!');
            // 可以选择在这里也加一个完成提示
            // showTemporaryMessage('挂左一完成!', 3000);
        }
    }

    console.log('牛牛快速交易脚本已加载，按S触发直接出售，按A触发挂左一，按任意其他键取消');
})();