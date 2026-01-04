// ==UserScript==
// @name:en         [MWI]Inventory Items Quick Sell Assistant(Express Version)
// @name            [银河奶牛]库存物品一键自动出售（极速版）
// @namespace       https://cnb.cool/shenhuanjie/skyner-cn/tamper-monkey-script/mwi-auto-sell-assistant
// @version         1.0.7.1
// @description:en  [Auto Sell Assistant] Instantly sell specified inventory items with a single click. This express version intelligently minimizes operational delays, boosting in-game efficiency by optimizing item sale speed beyond the capabilities of the original plugin.
// @description     一键自动出售库存中指定物品，智能优化操作延迟，提升游戏效率，在原有插件的基础上优化了出售物品的速度，快捷键:S
// @author          shenhuanjie
// @license         MIT
// @match           https://www.milkywayidle.com/game*
// @icon            https://www.milkywayidle.com/favicon.svg
// @grant           GM_setValue
// @grant           GM_getValue
// @homepage        https://greasyfork.org/scripts/535491
// @supportURL      https://greasyfork.org/scripts/535491
// @connect         greasyfork.org
// @require         https://cdn.tailwindcss.com
// @run-at          document-idle
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/536068/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%93%E5%AD%98%E7%89%A9%E5%93%81%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E5%87%BA%E5%94%AE%EF%BC%88%E6%9E%81%E9%80%9F%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/536068/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E5%BA%93%E5%AD%98%E7%89%A9%E5%93%81%E4%B8%80%E9%94%AE%E8%87%AA%E5%8A%A8%E5%87%BA%E5%94%AE%EF%BC%88%E6%9E%81%E9%80%9F%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 判断用户语言环境
    const isChinese = navigator.language.includes('zh');

    // 国际化消息
    const messages = {
        zh: {
            // 按钮文本
            goToMarket: '前往市场',
            sell: '出售',
            all: '全部',
            postSellOrder: '发布出售订单',

            // 错误消息
            selectItemFirst: '请先选择一个物品！',
            cannotNavigateToMarket: '无法导航到市场页面！',

            // 通知消息
            scriptLoaded: '脚本已加载',
            executingStep: '执行: {action} ({attempt}/{maxAttempts})',
            clickedButton: '已点击"{action}"按钮',
            stepCompleted: '步骤 {current}/{total} ({action}) 耗时 {time}ms',
            stepFailed: '步骤 {current}/{total} ({action}) 失败: {error} 耗时 {time}ms',
            executionFailed: '执行失败: {error}',
            increasingDelay: '增加延迟至 {delay}ms，准备重试',
            chainCompleted: '动作链执行完毕，总耗时 {time}ms',
            optimizedDelay: '优化"{action}"的延迟至 {delay}ms',
            optimizationCompleted: '优化完成，平均节省 {time}ms'
        },
        en: {
            // 按钮文本
            goToMarket: 'Go to Market',
            sell: 'Sell',
            all: 'All',
            postSellOrder: 'Post Sell Order',

            // 错误消息
            selectItemFirst: 'Please select an item first!',
            cannotNavigateToMarket: 'Cannot navigate to market page!',

            // 通知消息
            scriptLoaded: 'Script loaded',
            executingStep: 'Executing: {action} ({attempt}/{maxAttempts})',
            clickedButton: 'Clicked "{action}" button',
            stepCompleted: 'Step {current}/{total} ({action}) completed in {time}ms',
            stepFailed: 'Step {current}/{total} ({action}) failed: {error} in {time}ms',
            executionFailed: 'Execution failed: {error}',
            increasingDelay: 'Increasing delay to {delay}ms, preparing to retry',
            chainCompleted: 'Action chain completed, total time: {time}ms',
            optimizedDelay: 'Optimized "{action}" delay to {delay}ms',
            optimizationCompleted: 'Optimization completed, average time saved: {time}ms'
        }
    };

    // 获取消息函数
    function getMessage(key, replacements = {}) {
        const lang = isChinese ? 'zh' : 'en';
        let message = messages[lang][key];

        if (!message) {
            console.warn(`Missing translation for key: ${key}`);
            return key;
        }

        for (const [placeholder, value] of Object.entries(replacements)) {
            message = message.replace(`{${placeholder}}`, value);
        }
        return message;
    }

    // 全局配置
    const CONFIG = {
        debugMode: true,
        notificationPosition: 'top-right',
        notificationDuration: 3000,
        defaultHighlightColor: 'rgba(255, 0, 0, 0.1)',
        defaultHighlightDuration: 500,
        precondition: {
            selector: '[class*="Item_selected__"]',
            errorMessage: getMessage('selectItemFirst')
        },
        hotkey: {
            key: 's',
            altKey: false,
            ctrlKey: false,
            shiftKey: false
        },
        marketSelectors: [
            '[class*="MarketplacePage_container__"]',
            '[class*="MarketplacePanel_"]',
            '[data-testid="marketplace"]'
        ],
        localStorageKey: 'autoClickOptimalDelays',
        minDelay: 10,       // 最小延迟时间（毫秒）
        maxDelay: 2000,      // 最大延迟时间（毫秒）
        delayStep: 100,       // 延迟调整步长（毫秒）
        retryAttempts: 3,    // 每步最大重试次数
        successThreshold: 5, // 计算最优延迟的成功次数基数
        optimizationFactor: 1.3 // 安全余量系数
    };

    // 从本地存储加载最优延迟配置
    let optimalDelays = JSON.parse(GM_getValue(CONFIG.localStorageKey, '{}'));

    // 初始化执行统计
    const executionStats = {};

    // 节点池（存储所有可选节点）
    const NODE_POOL = [
        { id: 'start', type: 'start' },
        {
            id: 'action1',
            type: 'action',
            description: isChinese ? '前往市场' : 'Go to Market',
            containerSelector: '[class*="MuiTooltip-tooltip"]',
            buttonSelector: 'button[class*="Button_button__"][class*="Button_fullWidth__"]',
            text: getMessage('goToMarket'),
            checkResult: function() {
                return checkMarketPage();
            },
            errorMessage: getMessage('cannotNavigateToMarket')
        },
        {
            id: 'action2',
            type: 'action',
            description: isChinese ? '出售' : 'Sell',
            containerSelector: '[class*="MarketplacePanel_itemContainer__"]',
            buttonSelector: 'button[class*="Button_sell__"]',
            text: getMessage('sell')
        },
        {
            id: 'action3',
            type: 'action',
            description: isChinese ? '全部' : 'All',
            containerSelector: '[class*="MarketplacePanel_quantityInputs__"]',
            buttonSelector: 'button',
            text: getMessage('all')
        },
        {
            id: 'action4',
            type: 'action',
            description: isChinese ? '发布出售订单' : 'Post Sell Order',
            containerSelector: '[class*="MarketplacePanel_modalContent__"]',
            buttonSelector: '[class*="MarketplacePanel_postButtonContainer__"] > button[class*="Button_success__"]',
            text: getMessage('postSellOrder')
        },
        { id: 'end', type: 'end' }
    ];

    // 工作流配置（指定当前使用的节点及顺序）
    const WORKFLOW_CONFIG = [
        { nodeId: 'start', onSuccess: 'action1', onFailure: 'end' },
        { nodeId: 'action1', onSuccess: 'action2', onFailure: 'end' },
        { nodeId: 'action2', onSuccess: 'action3', onFailure: 'end' },
        { nodeId: 'action3', onSuccess: 'action4', onFailure: 'end' },
        { nodeId: 'action4', onSuccess: 'end', onFailure: 'end' },
        { nodeId: 'end' }
    ];

    // 初始化工作流节点延迟配置
    NODE_POOL.forEach(node => {
        if (node.type === 'action') {
            const key = node.description;
            node.preDelay = optimalDelays[key] || 800;
            node.postDelay = optimalDelays[`${key}_post`] || 600;
            executionStats[key] = {
                successes: 0,
                failures: 0,
                totalTime: 0,
                attempts: []
            };
        }
    });

    // 根据工作流配置生成实际执行的节点映射
    const WORKFLOW_NODES = WORKFLOW_CONFIG.map(config => {
        const node = NODE_POOL.find(n => n.id === config.nodeId);
        return {
            ...node,
            onSuccess: config.onSuccess,
            onFailure: config.onFailure
        };
    });

    // 生成工作流字符画函数
    function printWorkflowDiagram() {
        if (!CONFIG.debugMode) return;

        console.log('===== 工作流配置流程图 =====');
        console.log('节点类型：[Start] 开始节点 | [Action] 操作节点 | [End] 结束节点');
        console.log('连接符号：→ 成功跳转 | × 失败跳转');
        console.log('');

        WORKFLOW_CONFIG.forEach(config => {
            const node = NODE_POOL.find(n => n.id === config.nodeId);
            if (!node) return;

            let nodeLabel;
            switch (node.type) {
                case 'start':
                    nodeLabel = `[Start] ${node.id}`;
                    break;
                case 'action':
                    nodeLabel = `[Action] ${node.id} (${node.description})`;
                    break;
                case 'end':
                    nodeLabel = `[End] ${node.id}`;
                    break;
                default:
                    nodeLabel = `[Unknown] ${node.id}`;
            }

            if (config.onSuccess) {
                const successNode = NODE_POOL.find(n => n.id === config.onSuccess) || { id: config.onSuccess };
                console.log(`${nodeLabel} → ${successNode.id} (成功)`);
            }
            if (config.onFailure && config.onFailure !== config.onSuccess) {
                const failureNode = NODE_POOL.find(n => n.id === config.onFailure) || { id: config.onFailure };
                console.log(`${nodeLabel} × ${failureNode.id} (失败)`);
            }
        });

        console.log('==========================');
    }

    // 调试模式下输出流程图
    printWorkflowDiagram();

    // 初始化
    document.addEventListener('keydown', function(event) {
        const { key, altKey, ctrlKey, shiftKey } = CONFIG.hotkey;

        if (
            event.key.toLowerCase() === key.toLowerCase() &&
            event.altKey === altKey &&
            event.ctrlKey === ctrlKey &&
            event.shiftKey === shiftKey
        ) {
            event.preventDefault();
            executeWorkflow(); // 改为触发工作流执行
        }
    });

    log(getMessage('scriptLoaded'), 'info');
    log(`${isChinese ? '使用最优延迟配置' : 'Using optimal delay configuration'}: ${JSON.stringify(optimalDelays)}`, 'info');

    // 市场页面检查函数
    function checkMarketPage() {
        for (const selector of CONFIG.marketSelectors) {
            if (document.querySelectorAll(selector).length > 0) {
                return true;
            }
        }
        return false;
    }

    // 执行完整动作链
    async function executeWorkflow() {
        // 执行前置条件检查
        if (!checkPrecondition()) {
            showNotification(CONFIG.precondition.errorMessage, 'error');
            return;
        }

        const startTime = performance.now();
        let currentNodeId = 'start'; // 初始节点为start

        // 计算总步数（不包括start和end节点）
        const totalSteps = WORKFLOW_NODES.filter(node => node.type === 'action').length;
        let currentStep = 0;

        while (true) {
            const currentNode = WORKFLOW_NODES.find(node => node.id === currentNodeId);
            if (!currentNode) {
                showNotification(isChinese ? '工作流节点未找到' : 'Workflow node not found', 'error');
                return;
            }

            if (currentNode.type === 'end') {
                // 到达结束节点
                const totalDuration = Math.round(performance.now() - startTime);

                // 检查是否有未处理的错误
                if (currentNode.error) {
                    const errorMsg = `${isChinese ? '流程异常结束' : 'Workflow aborted'}: ${currentNode.error.message}`;
                    const notification = showNotification(errorMsg, 'error');
                    if (notification) {
                        notification.style.top = '20px';
                        notification.style.right = '20px';
                    }
                    log(errorMsg, 'error');
                } else {
                    // showNotification(getMessage('chainCompleted', {time: totalDuration}), 'success');
                    log(getMessage('chainCompleted', {time: totalDuration}), 'success');
                }

                saveOptimalDelays();
                return;
            }

            if (currentNode.type === 'action') {
                currentStep++; // 增加当前步数
                let attempt = 0;
                let success = false;

                while (attempt < CONFIG.retryAttempts && !success) {
                    attempt++;
                    // 只在日志中记录执行信息，不显示通知
                    log(getMessage('executingStep', {
                        action: currentNode.description,
                        attempt: attempt,
                        maxAttempts: CONFIG.retryAttempts
                    }), 'info');

                    const actionStartTime = performance.now();

                    try {
                        // 不再显示开始执行的通知，只在成功完成时显示

                        // 查找元素
                        const element = findElement(currentNode);

                        if (!element) {
                            // 显示错误通知，然后抛出错误
                            const errorMsg = isChinese ?
                                `未找到"${currentNode.description}"按钮` :
                                `"${currentNode.description}" button not found`;

                            // 确保通知显示在右上角
                            const notification = showNotification(`${isChinese ? '步骤' : 'Step'} ${currentStep}/${totalSteps}: ${errorMsg}`, 'error');
                            notification.style.top = '20px';
                            notification.style.right = '20px';

                            const error = new Error(errorMsg);
                            error.notificationShown = true; // 标记已显示通知
                            throw error;
                        }

                        // 高亮并点击元素
                        highlightElement(element);

                        // 记录点击前的状态
                        const beforeClickTime = performance.now();

                        element.click();
                        log(getMessage('clickedButton', {action: currentNode.description}), 'success');

                        // 等待后置延迟并检查结果
                        await wait(currentNode.postDelay);

                        // 检查结果（如果有检查函数）
                        if (typeof currentNode.checkResult === 'function') {
                            const result = currentNode.checkResult();
                            if (!result) {
                                throw new Error(currentNode.errorMessage ||
                                    (isChinese ?
                                        `执行"${currentNode.description}"后检查失败` :
                                        `Check failed after executing "${currentNode.description}"`));
                            }
                        }

                        // 执行成功
                        success = true;
                        currentNodeId = currentNode.onSuccess || 'end'; // 默认跳转end

                        // 计算实际执行时间
                        const actualTime = Math.round(performance.now() - actionStartTime);

                        // 显示步骤完成信息
                        showNotification(getMessage('stepCompleted', {
                            current: currentStep,
                            total: totalSteps,
                            action: currentNode.description,
                            time: actualTime
                        }), 'success');

                        // 更新统计信息
                        updateStats(currentNode.description, true, actualTime);

                        // 等待下一个节点的前置延迟
                        await wait(currentNode.preDelay);

                    } catch (error) {
                        // 执行失败
                        const errorTime = Math.round(performance.now() - actionStartTime);
                        log(`${isChinese ? '错误' : 'Error'}: ${error.message}`, 'error');

                        // 确保显示包含步骤信息的错误消息（如果之前没有显示过）
                        if (!error.notificationShown) {
                            showNotification(`${isChinese ? '步骤' : 'Step'} ${currentStep}/${totalSteps}: ${error.message} (${errorTime}ms)`, 'error');
                        }

                        updateStats(currentNode.description, false, errorTime);

                        if (attempt < CONFIG.retryAttempts) {
                            currentNode.postDelay = Math.min(currentNode.postDelay + CONFIG.delayStep, CONFIG.maxDelay);
                            log(`增加 "${currentNode.description}" 的延迟至 ${currentNode.postDelay}ms`, 'warning');
                            showNotification(getMessage('increasingDelay', {delay: currentNode.postDelay}), 'warning');
                        } else {
                            // 标记为异常结束并传递错误信息
                            const endNode = WORKFLOW_NODES.find(node => node.id === (currentNode.onFailure || 'end'));
                            if (endNode) {
                                endNode.error = error;
                            }
                            currentNodeId = currentNode.onFailure || 'end';
                        }
                    }
                }
            } else if (currentNode.type === 'start') {
                // 开始节点直接跳转到onSuccess
                currentNodeId = currentNode.onSuccess || 'end';
                // showNotification(isChinese ? '工作流已启动' : 'Workflow started', 'info');
            }
        }
    }

    // 查找元素函数
    function findElement(action) {
        const containers = document.querySelectorAll(action.containerSelector);

        for (const container of containers) {
            const candidates = container.querySelectorAll(action.buttonSelector);

            for (const candidate of candidates) {
                if (candidate.textContent.trim() === action.text) {
                    return candidate;
                }
            }
        }

        // 尝试全局查找
        const globalCandidates = document.querySelectorAll(action.buttonSelector);

        for (const candidate of globalCandidates) {
            if (candidate.textContent.trim() === action.text) {
                return candidate;
            }
        }

        // 如果没有找到精确匹配，尝试模糊匹配（对于可能的翻译差异）
        if (!isChinese) {
            // 在英文环境下，尝试更宽松的匹配
            for (const container of containers) {
                const candidates = container.querySelectorAll(action.buttonSelector);

                for (const candidate of candidates) {
                    const buttonText = candidate.textContent.trim().toLowerCase();
                    const actionText = action.text.toLowerCase();

                    // 检查按钮文本是否包含动作文本，或动作文本是否包含按钮文本
                    if (buttonText.includes(actionText) || actionText.includes(buttonText)) {
                        return candidate;
                    }
                }
            }

            // 全局模糊匹配
            for (const candidate of globalCandidates) {
                const buttonText = candidate.textContent.trim().toLowerCase();
                const actionText = action.text.toLowerCase();

                if (buttonText.includes(actionText) || actionText.includes(buttonText)) {
                    return candidate;
                }
            }
        }

        return null;
    }

    // 前置条件检查
    function checkPrecondition() {
        const elements = document.querySelectorAll(CONFIG.precondition.selector);
        return elements.length > 0;
    }

    // 高亮元素
    function highlightElement(element, color = CONFIG.defaultHighlightColor, duration = CONFIG.defaultHighlightDuration) {
        const originalStyle = element.style.cssText;

        element.style.cssText = `
            ${originalStyle}
            transition: all 0.3s;
            box-shadow: 0 0 0 3px ${color};
        `;

        setTimeout(() => {
            element.style.cssText = originalStyle;
        }, duration);
    }

    // 存储活动通知
    const activeNotifications = [];

    // 更新通知位置
    function updateNotificationPositions() {
        let currentTop = 20;
        activeNotifications.forEach(notif => {
            notif.style.top = `${currentTop}px`;
            currentTop += notif.offsetHeight + 10;
        });
    }

    // 显示通知（支持堆叠效果）
    function showNotification(message, type = 'info') {
        // 创建新通知
        const notification = document.createElement('div');
        notification.className = 'action-chain-notification';

        // 通知样式
        notification.style.cssText = `
            position: fixed;
            padding: 12px 16px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 199;
            transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            font-size: 14px;
            font-weight: 500;
            max-width: 300px;
            transform: translateY(-30px);
            opacity: 0;
            left: 20px;
        `;

        // 类型样式
        const types = {
            info: {
                bg: 'rgba(30, 144, 255, 0.95)',
                text: 'white',
                icon: 'ℹ️'
            },
            success: {
                bg: 'rgba(76, 175, 80, 0.95)',
                text: 'white',
                icon: '✅'
            },
            error: {
                bg: 'rgba(244, 67, 54, 0.95)',
                text: 'white',
                icon: '❌'
            },
            warning: {
                bg: 'rgba(255, 193, 7, 0.95)',
                text: '#333',
                icon: '⚠️'
            }
        };

        const style = types[type] || types.info;
        notification.style.backgroundColor = style.bg;
        notification.style.color = style.text;

        // 设置内容（添加图标）
        notification.innerHTML = `
            <div style="display: flex; align-items: center;">
                <span style="margin-right: 8px; font-size: 16px;">${style.icon}</span>
                <span>${message}</span>
            </div>
        `;

        // 添加到页面
        document.body.appendChild(notification);
        activeNotifications.push(notification);

        // 计算并设置位置
        updateNotificationPositions();

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // 自动消失
        setTimeout(() => {
            notification.style.transform = 'translateY(-30px)';
            notification.style.opacity = '0';
            notification.style.boxShadow = 'none';

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                // 从数组中移除
                const index = activeNotifications.indexOf(notification);
                if (index > -1) {
                    activeNotifications.splice(index, 1);
                }
                // 更新剩余通知位置
                updateNotificationPositions();
            }, 400);
        }, CONFIG.notificationDuration);
    }

    // 日志函数
    function log(message, level = 'info') {
        if (!CONFIG.debugMode && level !== 'error') return;

        const colors = {
            info: 'color: #333;',
            success: 'color: #4CAF50;',
            error: 'color: #F44336; font-weight: bold;',
            warning: 'color: #FFC107;',
            debug: 'color: #2196F3;'
        };

        console.log(`%c[${isChinese ? '工作流脚本' : 'Flow Actions Script'}] ${message}`, colors[level] || colors.info);
    }

    // 调试信息
    function logDebugInfo(action) {
        if (!CONFIG.debugMode) return;

        console.groupCollapsed(`🔍 ${isChinese ? '调试信息' : 'Debug Info'}: ${action.description}`);

        console.log(`▶ ${isChinese ? '配置参数' : 'Configuration Parameters'}:`, {
            containerSelector: action.containerSelector,
            buttonSelector: action.buttonSelector,
            text: action.text,
            currentPreDelay: action.preDelay,
            currentPostDelay: action.postDelay
        });

        const containers = document.querySelectorAll(action.containerSelector);
        console.log(`▶ ${isChinese ? '容器查找结果' : 'Container Search Results'}: ${isChinese ? '找到' : 'Found'} ${containers.length} ${isChinese ? '个容器' : 'containers'}`);

        if (containers.length > 0) {
            console.log(`${isChinese ? '容器列表' : 'Container List'}:`, containers);

            containers.forEach((container, index) => {
                const buttons = container.querySelectorAll(action.buttonSelector);
                console.log(`  ▶ ${isChinese ? '容器' : 'Container'} ${index + 1}: ${isChinese ? '找到' : 'Found'} ${buttons.length} ${isChinese ? '个候选按钮' : 'candidate buttons'}`);

                if (buttons.length > 0) {
                    console.log(`  ${isChinese ? '按钮列表' : 'Button List'}:`);
                    buttons.forEach((btn, btnIndex) => {
                        console.log(`    ${btnIndex + 1}. "${btn.textContent.trim()}"`);
                    });
                }
            });
        }

        const globalButtons = document.querySelectorAll(action.buttonSelector);
        console.log(`▶ ${isChinese ? '全局按钮查找结果' : 'Global Button Search Results'}: ${isChinese ? '找到' : 'Found'} ${globalButtons.length} ${isChinese ? '个候选按钮' : 'candidate buttons'}`);

        if (globalButtons.length > 0) {
            console.log(`${isChinese ? '全局按钮列表' : 'Global Button List'}:`);
            globalButtons.forEach((btn, index) => {
                console.log(`  ${index + 1}. "${btn.textContent.trim()}"`);
            });
        }

        console.groupEnd();
    }

    // 等待函数
    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 更新执行统计
    function updateStats(actionName, success, executionTime = 0) {
        const stats = executionStats[actionName];

        if (success) {
            stats.successes++;
            stats.totalTime += executionTime;
            stats.attempts.push(executionTime);

            // 记录最佳执行时间
            const bestTime = Math.min(...stats.attempts);

            // 自动调整延迟 - 如果连续成功，尝试减少延迟
            if (stats.successes >= CONFIG.successThreshold) {
                // 计算平均执行时间并增加安全余量
                const avgTime = stats.totalTime / stats.successes;
                const safeDelay = Math.max(
                    Math.round(bestTime * CONFIG.optimizationFactor),
                    CONFIG.minDelay
                );

                // 如果当前延迟比计算的安全延迟大，减少延迟
                const targetAction = WORKFLOW_NODES.find(node => node.type === 'action' && node.description === actionName);
                if (targetAction?.postDelay > safeDelay) {
                    targetAction.postDelay = safeDelay;
                    log(`${isChinese ? '优化' : 'Optimized'} "${actionName}" ${isChinese ? '的延迟至' : 'delay to'} ${safeDelay}ms (${isChinese ? '最佳' : 'best'}: ${Math.round(bestTime)}ms)`, 'info');
                    // showNotification(getMessage('optimizedDelay', {action: actionName, delay: safeDelay}), 'info');
                }
            }
        } else {
            stats.failures++;
        }
    }

    // 保存最优延迟配置
    function saveOptimalDelays() {
        const delays = {};

        WORKFLOW_NODES.filter(node => node.type === 'action').forEach(action => {
            delays[action.description] = action.preDelay;
            delays[`${action.description}_post`] = action.postDelay;
        });

        GM_setValue(CONFIG.localStorageKey, JSON.stringify(delays));
        log(`${isChinese ? '已保存最优延迟配置' : 'Saved optimal delay configuration'}: ${JSON.stringify(delays)}`, 'info');

        // 显示优化结果
        const totalSavedTime = Object.values(executionStats)
            .filter(s => s.successes > 0)
            .reduce((sum, s) => sum + (s.totalTime / s.successes), 0);

        if (totalSavedTime > 0) {
            log(`${isChinese ? '优化潜力' : 'Optimization potential'}: ${isChinese ? '平均可节省' : 'Average time saved'} ${Math.round(totalSavedTime)}ms`, 'info');
            // showNotification(getMessage('optimizationCompleted', {time: Math.round(totalSavedTime)}), 'success');
        }
    }
})();