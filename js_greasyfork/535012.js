// ==UserScript==
// @name         自动点击预订表格
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  自动点击预订页面中的表格元素
// @author       AlphaGod
// @license MIT
// @match        https://bawtt.ydmap.cn/booking/schedule/107443*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ydmap.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535012/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%A2%84%E8%AE%A2%E8%A1%A8%E6%A0%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/535012/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E9%A2%84%E8%AE%A2%E8%A1%A8%E6%A0%BC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    const config = {
        // 匹配条件配置（支持多条件组合）
        matchConditions: [
            {
                text: '免费',              // 要匹配的文本
                condition: 'contains'      // 匹配条件类型
                // 第一个条件不需要逻辑运算符
            },
            {
                text: '开放',              // 要匹配的文本
                condition: 'notContainsIgnoreCase'      // 匹配条件类型
                // 第一个条件不需要逻辑运算符
            }
            // 可以添加更多条件...
        ],
        // 定时检测间隔（毫秒）
        checkInterval: 500,
        // 最大点击数量
        maxClicks: 10,
        // 最大检测次数，超过后停止定时检测
        maxCheckCount: 60,
        // 要检查的元素配置（初始为空，由用户选择）
        targets: []
    };

    // 全局状态记录
    const state = {
        checkCount: 0,        // 已检测次数
        totalClickCount: 0,   // 总点击次数
        timerRef: null,       // 定时器引用
        startTime: null,      // 开始时间
        clickedElements: [],  // 已点击的元素记录
        cancelledElements: [], // 已取消的元素记录
        activeElements: {}    // 当前活跃（已选中但未取消）的元素，使用 'row-col' 作为键
    };

    // 存储优先级信息
    let priorityInfo = {
        columnGroups: {}, // 按列分组的元素
        columnScores: {}, // 每列的连续性分数
        sortedColumns: [], // 按优先级排序的列
        orderedCells: []   // 排序后的元素列表
    };

    // 单个条件的匹配判断函数
    function isTextMatchingCondition(elementText, matchText, matchCondition) {
        // 初始化匹配结果为false
        let isMatch = false;

        // 根据不同的匹配条件类型使用不同的判断方法
        switch (matchCondition) {
            case 'equals':
                // 完全相等（区分大小写）
                isMatch = elementText === matchText;
                break;

            case 'equalsIgnoreCase':
                // 完全相等（不区分大小写）
                isMatch = elementText.toLowerCase() === matchText.toLowerCase();
                break;

            case 'notEquals':
                // 不相等
                isMatch = elementText !== matchText;
                break;

            case 'contains':
                // 包含（区分大小写）
                isMatch = elementText.includes(matchText);
                break;

            case 'containsIgnoreCase':
                // 包含（不区分大小写）
                isMatch = elementText.toLowerCase().includes(matchText.toLowerCase());
                break;

            case 'notContains':
                // 不包含（区分大小写）
                isMatch = !elementText.includes(matchText);
                break;

            case 'notContainsIgnoreCase':
                // 不包含（不区分大小写）
                isMatch = !elementText.toLowerCase().includes(matchText.toLowerCase());
                break;

            case 'startsWith':
                // 以...开头
                isMatch = elementText.startsWith(matchText);
                break;

            case 'endsWith':
                // 以...结尾
                isMatch = elementText.endsWith(matchText);
                break;

            case 'regEx':
                // 正则表达式匹配
                try {
                    // 创建正则表达式对象
                    const regex = new RegExp(matchText);
                    // 测试文本是否匹配正则表达式
                    isMatch = regex.test(elementText);
                } catch (e) {
                    // 如果正则表达式有错误，记录错误并返回不匹配
                    console.error('正则表达式错误:', e);
                    isMatch = false;
                }
                break;

            default:
                // 默认使用包含关系
                isMatch = elementText.includes(matchText);
        }

        // 返回匹配结果
        return isMatch;
    }

    // 复合条件的匹配判断函数
    function isTextMatchingComplexConditions(elementText, conditions) {
        // 如果没有条件，默认不匹配
        if (!conditions || conditions.length === 0) {
            return false;
        }

        // 第一个条件的匹配结果
        let result = isTextMatchingCondition(
            elementText,
            conditions[0].text,
            conditions[0].condition
        );

        // 从第二个条件开始，依次应用逻辑运算符组合结果
        for (let i = 1; i < conditions.length; i++) {
            const condition = conditions[i];
            const currentMatch = isTextMatchingCondition(
                elementText,
                condition.text,
                condition.condition
            );

            // 获取逻辑运算符，如果未指定则默认为AND
            const logicOp = condition.logicOperator || 'AND';

            // 根据逻辑运算符组合结果
            if (logicOp === 'AND') {
                // 逻辑与：两个条件都必须为真
                result = result && currentMatch;
            } else if (logicOp === 'OR') {
                // 逻辑或：两个条件有一个为真即可
                result = result || currentMatch;
            }
        }

        return result;
    }

    // 检查并点击元素的函数
    function checkAndClickElements() {
        // 更新检测次数
        state.checkCount++;

        // 计算运行时间
        const runTime = Math.floor((Date.now() - state.startTime) / 1000);

        console.log(`第 ${state.checkCount} 次检测（运行时间: ${runTime} 秒）`);

        // 检查是否所有选择的坐标都已经被点击
        const allTargetsClicked = config.targets.every(target => {
            const key = `${target.row}-${target.col}`;
            return state.activeElements[key];
        });

        if (allTargetsClicked && config.targets.length > 0) {
            console.log('所有选择的坐标都已经被点击，停止检测');
            clearInterval(state.timerRef);
            state.timerRef = null;

            updateControlPanelStatus();
            resetScript();
            return;
        }

        // 记录本次检测的点击数
        let currentClickCount = 0;

        // 使用已排序的目标进行检测（优先连续性坐标）
        const targetsToCheck = priorityInfo.orderedCells && priorityInfo.orderedCells.length > 0 ?
            [...priorityInfo.orderedCells] : [...config.targets];

        console.log('按优先级排序后的检测顺序：', targetsToCheck.map(t => `(${t.row},${t.col})`).join(', '));

        // 遍历所有目标元素（按优先级顺序）
        for (const target of targetsToCheck) {
            // 如果总点击数已达到最大点击次数，则停止定时器
            if (state.totalClickCount >= config.maxClicks) {
                console.log(`已达到最大点击次数：${config.maxClicks}，停止定时器`);
                clearInterval(state.timerRef);
                state.timerRef = null;

                updateControlPanelStatus();
                resetScript();
                return;
            }

            // 检查元素是否已经被点击过（避免重复点击）
            const elementKey = `${target.row}-${target.col}`;
            if (state.activeElements[elementKey]) {
                console.log(`跳过已点击的元素：${target.description}`);
                continue;
            }

            // 构建选择器
            const selector = `table > tbody > tr:nth-child(${target.row}) > td:nth-child(${target.col}) > div > span > div`;
            const element = document.querySelector(selector);

            // 检查元素是否存在且符合匹配条件
            if (element) {
                // 使用复合条件匹配函数判断文本是否匹配
                const isMatch = isTextMatchingComplexConditions(element.textContent, config.matchConditions);

                if (isMatch) {
                    console.log(`找到匹配元素：${target.description}，文本内容：${element.textContent}`);

                    // 模拟点击事件
                    element.click();
                    console.log(`已点击：${target.description}`);
                    currentClickCount++;
                    state.totalClickCount++;

                    // 记录已点击的元素信息
                    const clickedItem = {
                        time: new Date().toLocaleTimeString(),
                        description: target.description,
                        text: element.textContent,
                        row: target.row,
                        col: target.col,
                        element: element, // 保存元素引用，便于后续取消
                        key: elementKey
                    };
                    state.clickedElements.push(clickedItem);

                    // 标记为活跃元素
                    state.activeElements[elementKey] = true;

                    // 如果已经达到最大点击次数，立即停止检测
                    if (state.totalClickCount >= config.maxClicks) {
                        console.log(`已达到最大点击次数：${config.maxClicks}，立即停止检测`);
                        clearInterval(state.timerRef);
                        state.timerRef = null;

                        updateControlPanelStatus();
                        resetScript();
                        return;
                    }
                }
            } else if (element) {
                // 使用复合条件匹配函数判断文本是否匹配
                const isMatch = isTextMatchingComplexConditions(element.textContent, config.matchConditions);

                if (isMatch) {
                    console.log(`找到匹配元素：${target.description}，文本内容：${element.textContent}`);

                    // 模拟点击事件
                    element.click();
                    // ...其余点击后的代码保持不变...
                } else {
                    // 这里是修改部分：详细输出为什么不匹配
                    console.log(`元素存在但不匹配：${target.description}`);
                    console.log(`  - 实际文本内容：${element.textContent}`);
                    console.log(`  - 当前匹配条件：${JSON.stringify(config.matchConditions, null, 2)}`);

                    // 如果匹配条件是复杂条件，可以进一步分析每个条件的匹配结果
                    if (Array.isArray(config.matchConditions) && config.matchConditions.length > 0) {
                        console.log(`  - 条件分析：`);
                        config.matchConditions.forEach((condition, index) => {
                            const conditionResult = isTextMatchingCondition(element.textContent, condition.text, condition.condition);
                            console.log(`    条件${index + 1}(${condition.condition}="${condition.text}")：${conditionResult ? '通过' : '不通过'}`);
                        });
                    }
                }
            } else {
                console.log(`未找到元素：${target.description}`);
            }
        }

        // 输出本次检测结果
        if (currentClickCount === 0) {
            console.log('本次检测未找到匹配的元素');
        } else {
            console.log(`本次检测共点击了 ${currentClickCount} 个元素，总计 ${state.totalClickCount} 个`);
        }

        // 如果达到最大检测次数，停止定时器
        if (state.checkCount >= config.maxCheckCount) {
            console.log(`已达到最大检测次数 ${config.maxCheckCount}，停止定时器`);
            clearInterval(state.timerRef);
            state.timerRef = null;

            updateControlPanelStatus();
            resetScript();
        }
    }

    // 取消已点击的元素
    function cancelClickedElement(index) {
        if (index >= 0 && index < state.clickedElements.length) {
            const item = state.clickedElements[index];

            // 根据用户要求，不再将元素添加到取消列表
            // state.cancelledElements.push({
            //     row: item.row,
            //     col: item.col,
            //     description: item.description,
            //     cancelTime: new Date().toLocaleTimeString()
            // });

            // 如果还有元素引用，尝试再次点击模拟取消
            if (item.element) {
                console.log(`尝试取消点击：${item.description}`);
                try {
                    item.element.click();
                    console.log(`已取消点击：${item.description}`);

                    // 从活跃元素中移除
                    if (item.key && state.activeElements[item.key]) {
                        delete state.activeElements[item.key];
                    }
                } catch (e) {
                    console.log(`取消点击失败：${e.message}`);
                }
            }

            // 更新点击计数
            state.totalClickCount--;
            if (state.totalClickCount < 0) state.totalClickCount = 0;

            // 更新状态显示
            updateControlPanelStatus();

            return true;
        }
        return false;
    }

    // 重置脚本状态
    function resetScript() {
        // 清除定时器
        if (state.timerRef) {
            clearInterval(state.timerRef);
            state.timerRef = null;
        }

        // 重置后启用开始按钮
        if (document.getElementById('start-detection-btn')) {
            const startBtn = document.getElementById('start-detection-btn');
            startBtn.disabled = false;
            startBtn.style.backgroundColor = '#4CAF50';
            startBtn.textContent = '开始检测';
        }

        // 隐藏检测时的按钮
        toggleDetectionButtons(false);

        // 重置按钮相关状态
        if (typeof isPaused !== 'undefined') isPaused = false;
        // 其他按钮相关状态如有也在此处重置

        // 重置状态
        // state.checkCount = 0;
        // state.totalClickCount = 0;
        state.clickedElements = [];
        state.cancelledElements = [];
        state.activeElements = {};
        // state.startTime = Date.now(); // 重置开始时间

        // 不清除选中的元素，保留用户选择
        // config.targets = [];

        console.log('脚本状态已重置');

        // 更新状态显示
        // const statusDiv = document.getElementById('click-status');
        // if (statusDiv) {
        //     statusDiv.innerHTML = `等待开始检测`;
        // }
        // 清空检测结果展示区
        // const resultDiv = document.getElementById('result-display');
        // if (resultDiv) {
        //     resultDiv.innerHTML = '';
        // }
        // 不重新启动定时器，等待手动开始
    }

    // 创建控制面板
    function createControlPanel() {
        // 创建控制面板容器
        const panel = document.createElement('div');
        panel.id = 'click-control-panel';
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            min-width: 200px;
            max-width: 250px;
            transition: all 0.3s ease;
        `;

        // 创建标题栏（可点击折叠）
        const titleBar = document.createElement('div');
        titleBar.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #555;
            padding-bottom: 5px;
            cursor: pointer;
        `;

        // 标题文本
        const title = document.createElement('div');
        title.textContent = '自动点击控制面板';
        title.style.cssText = `
            font-weight: bold;
            text-align: center;
        `;

        // 折叠图标
        const collapseIcon = document.createElement('span');
        collapseIcon.textContent = '−'; // 减号（展开状态）
        collapseIcon.style.cssText = `
            font-weight: bold;
            font-size: 16px;
        `;

        titleBar.appendChild(title);
        titleBar.appendChild(collapseIcon);
        panel.appendChild(titleBar);

        // 面板内容容器（可折叠部分）
        const panelContent = document.createElement('div');
        panelContent.id = 'panel-content';
        panel.appendChild(panelContent);

        // 添加折叠功能
        let isCollapsed = false;
        titleBar.onclick = function () {
            isCollapsed = !isCollapsed;
            if (isCollapsed) {
                panelContent.style.display = 'none';
                collapseIcon.textContent = '+'; // 加号（折叠状态）
                panel.style.minWidth = '150px';
            } else {
                panelContent.style.display = 'block';
                collapseIcon.textContent = '−'; // 减号（展开状态）
                panel.style.minWidth = '200px';
            }
        };

        // 创建状态显示区域
        const statusDiv = document.createElement('div');
        statusDiv.id = 'click-status';
        statusDiv.style.cssText = `
            margin-bottom: 10px;
            font-size: 12px;
        `;
        statusDiv.innerHTML = `等待开始检测`;
        panelContent.appendChild(statusDiv);

        // 创建检测结果展示区域
        const resultDiv = document.createElement('div');
        resultDiv.id = 'result-display';
        resultDiv.style.cssText = `
            margin-bottom: 10px;
            font-size: 12px;
            color:rgb(209, 178, 0);
            word-break: break-all;
        `;
        resultDiv.innerHTML = '';
        panelContent.appendChild(resultDiv);

        // 创建复合条件管理界面
        const complexConditionContainer = document.createElement('div');
        complexConditionContainer.id = 'complex-condition-container';
        complexConditionContainer.style.cssText = `
            margin-bottom: 10px;
            border: 1px solid #555;
            border-radius: 3px;
            padding: 5px;
            background-color: rgba(255, 255, 255, 0.1);
        `;

        // 创建标题
        const conditionTitle = document.createElement('div');
        conditionTitle.textContent = '复合匹配条件';
        conditionTitle.style.cssText = `
            font-size: 11px;
            margin-bottom: 5px;
            text-align: center;
            color: #ddd;
        `;
        complexConditionContainer.appendChild(conditionTitle);

        // 创建条件列表
        const conditionsList = document.createElement('div');
        conditionsList.id = 'conditions-list';
        complexConditionContainer.appendChild(conditionsList);

        // 更新条件列表显示
        function updateConditionsList() {
            conditionsList.innerHTML = '';

            if (!config.matchConditions || config.matchConditions.length === 0) {
                const noConditions = document.createElement('div');
                noConditions.textContent = '没有条件';
                noConditions.style.color = '#999';
                noConditions.style.fontSize = '10px';
                noConditions.style.textAlign = 'center';
                conditionsList.appendChild(noConditions);
                return;
            }

            // 显示所有条件
            config.matchConditions.forEach((condition, index) => {
                const conditionItem = document.createElement('div');
                conditionItem.style.cssText = `
                    margin: 3px 0;
                    padding: 3px;
                    background-color: #444;
                    border-radius: 3px;
                    font-size: 10px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                `;

                // 显示逻辑运算符（第一个条件不显示）
                let conditionText = '';
                if (index > 0) {
                    // 获取逻辑运算符，如果未指定则默认为AND
                    const logicOp = condition.logicOperator || 'AND';
                    conditionText += `<span style="color: #ff9800;">${logicOp}</span> `;
                }

                // 显示条件类型和匹配文本
                conditionText += `<span style="color: #4CAF50;">${getConditionName(condition.condition)}</span> `;
                conditionText += `<span style="color: #2196F3;">"${condition.text}"</span>`;

                const conditionInfo = document.createElement('div');
                conditionInfo.innerHTML = conditionText;
                conditionItem.appendChild(conditionInfo);

                // 添加删除按钮
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '×';
                deleteBtn.style.cssText = `
                    background-color: #f44336;
                    color: white;
                    border: none;
                    border-radius: 3px;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    font-size: 10px;
                    margin-left: 5px;
                `;
                deleteBtn.onclick = function () {
                    config.matchConditions.splice(index, 1);
                    updateConditionsList();
                };
                conditionItem.appendChild(deleteBtn);

                conditionsList.appendChild(conditionItem);
            });
        }

        // 获取条件类型的中文名称
        function getConditionName(condition) {
            const conditionNames = {
                'equals': '完全相等',
                'equalsIgnoreCase': '相等(不区分大小写)',
                'notEquals': '不相等',
                'contains': '包含',
                'containsIgnoreCase': '包含(不区分大小写)',
                'notContains': '不包含',
                'notContainsIgnoreCase': '不包含(不区分大小写)',
                'startsWith': '以...开头',
                'endsWith': '以...结尾',
                'regEx': '正则表达式'
            };
            return conditionNames[condition] || condition;
        }

        // 创建添加条件的界面
        const addConditionContainer = document.createElement('div');
        addConditionContainer.style.cssText = `
            margin-top: 5px;
            display: flex;
            flex-direction: column;
        `;

        // 创建条件类型选择下拉菜单
        const conditionTypeSelect = document.createElement('select');
        conditionTypeSelect.style.cssText = `
            margin: 3px 0;
            padding: 2px;
            background-color: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 3px;
            font-size: 10px;
        `;

        // 添加所有可用的匹配条件选项
        const matchConditions = [
            { value: 'equals', text: '完全相等（区分大小写）' },
            { value: 'equalsIgnoreCase', text: '完全相等（不区分大小写）' },
            { value: 'notEquals', text: '不相等' },
            { value: 'contains', text: '包含（区分大小写）' },
            { value: 'containsIgnoreCase', text: '包含（不区分大小写）' },
            { value: 'notContains', text: '不包含（区分大小写）' },
            { value: 'notContainsIgnoreCase', text: '不包含（不区分大小写）' },
            { value: 'startsWith', text: '以...开头' },
            { value: 'endsWith', text: '以...结尾' },
            { value: 'regEx', text: '正则表达式匹配' }
        ];

        // 创建并添加选项
        matchConditions.forEach(condition => {
            const option = document.createElement('option');
            option.value = condition.value;
            option.textContent = condition.text;
            conditionTypeSelect.appendChild(option);
        });

        // 创建逻辑运算符选择下拉菜单
        const logicOperatorSelect = document.createElement('select');
        logicOperatorSelect.style.cssText = `
            margin: 3px 0;
            padding: 2px;
            background-color: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 3px;
            font-size: 10px;
        `;

        // 添加逻辑运算符选项
        const operators = [
            { value: 'AND', text: '并且 (AND)' },
            { value: 'OR', text: '或者 (OR)' }
        ];

        operators.forEach(op => {
            const option = document.createElement('option');
            option.value = op.value;
            option.textContent = op.text;
            logicOperatorSelect.appendChild(option);
        });

        // 创建匹配文本输入框
        const matchTextInput = document.createElement('input');
        matchTextInput.type = 'text';
        matchTextInput.placeholder = '输入匹配文本';
        matchTextInput.style.cssText = `
            margin: 3px 0;
            padding: 3px;
            background-color: #333;
            color: white;
            border: 1px solid #555;
            border-radius: 3px;
            font-size: 10px;
        `;

        // 创建添加条件按钮
        const addConditionBtn = document.createElement('button');
        addConditionBtn.textContent = '添加条件';
        addConditionBtn.style.cssText = `
            margin: 3px 0;
            padding: 3px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        `;

        // 添加按钮点击事件
        addConditionBtn.onclick = function () {
            // 获取输入的匹配文本
            const matchText = matchTextInput.value.trim();
            if (!matchText) {
                alert('请输入匹配文本');
                return;
            }

            // 创建新条件
            const newCondition = {
                text: matchText,
                condition: conditionTypeSelect.value
            };

            // 如果不是第一个条件，则添加逻辑运算符
            if (config.matchConditions && config.matchConditions.length > 0) {
                newCondition.logicOperator = logicOperatorSelect.value;
            }

            // 初始化条件数组（如果不存在）
            if (!config.matchConditions) {
                config.matchConditions = [];
            }

            // 添加新条件
            config.matchConditions.push(newCondition);

            // 清空输入框
            matchTextInput.value = '';

            // 更新条件列表显示
            updateConditionsList();
        };

        // 添加元素到添加条件容器
        addConditionContainer.appendChild(document.createTextNode('逻辑关系:'));
        addConditionContainer.appendChild(logicOperatorSelect);
        addConditionContainer.appendChild(document.createTextNode('条件类型:'));
        addConditionContainer.appendChild(conditionTypeSelect);
        addConditionContainer.appendChild(document.createTextNode('匹配文本:'));
        addConditionContainer.appendChild(matchTextInput);
        addConditionContainer.appendChild(addConditionBtn);

        // 将添加条件界面添加到复合条件容器
        complexConditionContainer.appendChild(addConditionContainer);

        // 将复合条件容器添加到控制面板
        panelContent.appendChild(complexConditionContainer);

        // 初始化条件列表显示
        updateConditionsList();

        // 创建表格选择区域
        const tableContainer = document.createElement('div');
        tableContainer.style.cssText = `
            margin-bottom: 10px;
            border: 1px solid #555;
            border-radius: 3px;
            padding: 5px;
            background-color: rgba(255, 255, 255, 0.1);
        `;

        // 创建表格标题
        const tableTitle = document.createElement('div');
        tableTitle.textContent = '点击选择要检测的元素位置';
        tableTitle.style.cssText = `
            font-size: 11px;
            margin-bottom: 5px;
            text-align: center;
            color: #ddd;
        `;
        tableContainer.appendChild(tableTitle);

        // 创建小型表格（6列×8行）
        const table = document.createElement('table');
        table.style.cssText = `
            width: 100%;
            border-collapse: collapse;
            table-layout: fixed;
        `;

        // 添加列头
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');

        // 添加列标题（1-6）
        for (let col = 1; col <= 6; col++) {
            const th = document.createElement('th');
            th.textContent = col;
            th.style.cssText = `
                width: 15px;
                height: 15px;
                background-color: #555;
                color: white;
                text-align: center;
                font-size: 9px;
                border: 1px solid #777;
                padding: 2px;
            `;
            headerRow.appendChild(th);
        }

        thead.appendChild(headerRow);
        table.appendChild(thead);

        // 添加表格主体
        const tbody = document.createElement('tbody');

        // 创建选中元素的记录数组
        const selectedCells = [];

        // 使用全局优先级信息

        // 添加行（1-8）
        for (let row = 1; row <= 8; row++) {
            const tr = document.createElement('tr');

            // 添加单元格
            for (let col = 1; col <= 6; col++) {
                const td = document.createElement('td');
                td.dataset.row = row;
                td.dataset.col = col;
                td.textContent = row; // 显示行号在单元格里
                td.style.cssText = `
                    width: 15px;
                    height: 15px;
                    background-color: #333;
                    border: 1px solid #777;
                    text-align: center;
                    font-size: 8px;
                    cursor: pointer;
                    padding: 2px;
                    color: #777;
                `;

                // 添加点击事件
                td.onclick = function () {
                    const cellRow = parseInt(this.dataset.row);
                    const cellCol = parseInt(this.dataset.col);

                    // 检查是否已选中
                    const isSelected = this.classList.contains('selected');

                    if (isSelected) {
                        // 取消选中
                        this.classList.remove('selected');
                        this.style.backgroundColor = '#333';
                        this.style.color = '#777';

                        // 从选中列表中移除
                        const index = selectedCells.findIndex(cell =>
                            cell.row === cellRow && cell.col === cellCol
                        );
                        if (index !== -1) {
                            selectedCells.splice(index, 1);
                        }
                    } else {
                        // 限制最多只能选2个
                        if (selectedCells.length >= 2) {
                            alert('最多只能选择2个坐标位置！');
                            return;
                        }
                        // 选中
                        this.classList.add('selected');
                        this.style.backgroundColor = '#4CAF50';
                        this.style.color = 'white';

                        // 添加到选中列表
                        selectedCells.push({
                            row: cellRow,
                            col: cellCol,
                            element: this,
                            description: `第${cellRow}行第${cellCol}列`
                        });
                    }

                    // 更新配置
                    config.targets = [...selectedCells];

                    // 计算优先级
                    calculatePriority();

                    // 更新选中元素显示
                    updateSelectedCellsDisplay();
                };

                tr.appendChild(td);
            }

            tbody.appendChild(tr);
        }

        table.appendChild(tbody);
        tableContainer.appendChild(table);

        // 默认可选坐标组
        const defaultGroups = [
            [{ row: 1, col: 1 }, { row: 2, col: 1 }],
            [{ row: 1, col: 2 }, { row: 2, col: 2 }],
            [{ row: 1, col: 3 }, { row: 2, col: 3 }],
            [{ row: 1, col: 4 }, { row: 2, col: 4 }],
            [{ row: 1, col: 5 }, { row: 2, col: 5 }],
            [{ row: 1, col: 6 }, { row: 2, col: 6 }]
        ];
        // 随机选一组
        const randomGroup = defaultGroups[Math.floor(Math.random() * defaultGroups.length)];
        // 自动选中并高亮
        randomGroup.forEach(cell => {
            // 找到对应td
            const td = table.querySelector(`td[data-row='${cell.row}'][data-col='${cell.col}']`);
            if (td && !td.classList.contains('selected')) {
                td.classList.add('selected');
                td.style.backgroundColor = '#4CAF50';
                td.style.color = 'white';
                selectedCells.push({
                    row: cell.row,
                    col: cell.col,
                    element: td,
                    description: `第${cell.row}行第${cell.col}列`
                });
            }
        });
        config.targets = [...selectedCells];
        calculatePriority();
        updateSelectedCellsDisplay();

        // 创建已选元素显示区域
        const selectedDisplay = document.createElement('div');
        selectedDisplay.id = 'selected-cells-display';
        selectedDisplay.style.cssText = `
            margin-top: 5px;
            font-size: 9px;
            color: #ddd;
        `;
        selectedDisplay.textContent = '已选: 无';
        tableContainer.appendChild(selectedDisplay);

        // 计算选中元素的优先级
        function calculatePriority() {
            if (selectedCells.length === 0) {
                priorityInfo = {
                    columnGroups: {},
                    columnScores: {},
                    sortedColumns: [],
                    orderedCells: []
                };
                return;
            }

            // 按列分组
            const columnGroups = {};
            selectedCells.forEach(target => {
                if (!columnGroups[target.col]) {
                    columnGroups[target.col] = [];
                }
                columnGroups[target.col].push(target);
            });

            // 对每个列组内的目标按行排序
            Object.values(columnGroups).forEach(group => {
                group.sort((a, b) => a.row - b.row);
            });

            // 计算每个列的连续子序列
            const columnContinuities = {};
            Object.entries(columnGroups).forEach(([col, group]) => {
                // 存储该列的所有连续子序列
                const continuities = [];
                let currentSeq = [group[0]]; // 当前连续序列从第一个元素开始

                // 寻找连续子序列
                for (let i = 1; i < group.length; i++) {
                    if (group[i].row === group[i - 1].row + 1) {
                        // 如果是连续的，加入当前序列
                        currentSeq.push(group[i]);
                    } else {
                        // 如果不连续，存储当前序列并开始新序列
                        if (currentSeq.length > 1) { // 只有长度>1的才是连续序列
                            continuities.push([...currentSeq]);
                        }
                        currentSeq = [group[i]];
                    }
                }

                // 处理最后一个序列
                if (currentSeq.length > 1) {
                    continuities.push(currentSeq);
                }

                // 如果没有连续序列，则每个元素单独为一组
                if (continuities.length === 0) {
                    group.forEach(item => {
                        continuities.push([item]);
                    });
                } else {
                    // 处理未包含在连续序列中的单个元素
                    const includedItems = new Set();
                    continuities.forEach(seq => {
                        seq.forEach(item => {
                            includedItems.add(`${item.row}-${item.col}`);
                        });
                    });

                    group.forEach(item => {
                        const key = `${item.row}-${item.col}`;
                        if (!includedItems.has(key)) {
                            continuities.push([item]);
                        }
                    });
                }

                // 按序列长度降序排序
                continuities.sort((a, b) => b.length - a.length);

                columnContinuities[col] = continuities;
            });

            // 计算每个列的连续性分数
            const columnScores = {};
            Object.entries(columnContinuities).forEach(([col, continuities]) => {
                // 连续性分数为最长连续序列的长度-1
                const maxContinuityLength = continuities.length > 0 ? continuities[0].length : 0;
                const continuityScore = maxContinuityLength > 1 ? maxContinuityLength - 1 : 0;

                columnScores[col] = {
                    continuityScore,
                    maxContinuityLength,
                    count: columnGroups[col].length
                };
            });

            // 按连续性分数和元素数量对列进行排序
            const sortedColumns = Object.keys(columnGroups).sort((a, b) => {
                // 先按连续性分数降序排序
                if (columnScores[b].continuityScore !== columnScores[a].continuityScore) {
                    return columnScores[b].continuityScore - columnScores[a].continuityScore;
                }
                // 如果连续性分数相同，则按元素数量降序排序
                if (columnScores[b].count !== columnScores[a].count) {
                    return columnScores[b].count - columnScores[a].count;
                }
                // 如果元素数量也相同，则按列号升序排序
                return parseInt(a) - parseInt(b);
            });

            // 收集所有连续序列和单个元素
            const allSequences = [];

            // 首先收集所有列的连续序列
            Object.entries(columnContinuities).forEach(([col, continuities]) => {
                continuities.forEach(seq => {
                    // 添加列号和连续性信息
                    allSequences.push({
                        col: parseInt(col),
                        sequence: seq,
                        length: seq.length,
                        isContinuous: seq.length > 1
                    });
                });
            });

            // 对所有序列进行排序，不再以列为主要排序标准
            allSequences.sort((a, b) => {
                // 首先按连续性排序（连续的序列优先）
                if (a.isContinuous !== b.isContinuous) {
                    return a.isContinuous ? -1 : 1;
                }

                // 如果都是连续序列或都不是连续序列，按长度降序排序
                if (a.length !== b.length) {
                    return b.length - a.length;
                }

                // 如果长度相同，按列号升序排序
                return a.col - b.col;
            });

            // 生成最终排序的元素列表
            const orderedCells = [];
            allSequences.forEach(item => {
                orderedCells.push(...item.sequence);
            });

            // 更新优先级信息
            priorityInfo = {
                columnGroups,
                columnScores,
                sortedColumns,
                columnContinuities,
                orderedCells
            };

            console.log('优先级信息更新：', priorityInfo);
        }

        // 更新选中元素显示
        function updateSelectedCellsDisplay() {
            const display = document.getElementById('selected-cells-display');
            if (display) {
                if (selectedCells.length === 0) {
                    display.textContent = '已选: 无';
                } else {
                    // 根据优先级排序显示选中的单元格
                    let displayText = '已选: ';

                    // 如果有优先级信息，按优先级显示
                    if (priorityInfo.orderedCells && priorityInfo.orderedCells.length > 0) {
                        // 显示带优先级的单元格
                        displayText += priorityInfo.orderedCells.map((cell, index) => {
                            // 检查该元素是否在连续序列中
                            let isInContinuity = false;
                            let continuityLength = 1;

                            if (priorityInfo.columnContinuities && priorityInfo.columnContinuities[cell.col]) {
                                // 遍历该列的所有连续序列
                                for (const seq of priorityInfo.columnContinuities[cell.col]) {
                                    if (seq.length > 1) {
                                        // 检查当前元素是否在这个连续序列中
                                        const found = seq.find(item => item.row === cell.row && item.col === cell.col);
                                        if (found) {
                                            isInContinuity = true;
                                            continuityLength = seq.length;
                                            break;
                                        }
                                    }
                                }
                            }

                            // 根据是否在连续序列中和序列长度决定颜色
                            const color = isInContinuity ?
                                (continuityLength > 2 ? '#4CAF50' : '#FFC107') : // 长度>2使用绿色，=2使用黄色
                                '#FFFFFF'; // 非连续元素使用白色

                            return `<span style="color: ${color}">
                                   ${index + 1}:(${cell.row},${cell.col})</span>`;
                        }).join(', ');
                    } else {
                        // 没有优先级信息，按原顺序显示
                        displayText += selectedCells.map(cell => `(${cell.row},${cell.col})`).join(', ');
                    }

                    display.innerHTML = displayText;
                }
            }
        }

        panelContent.appendChild(tableContainer);

        // 创建按钮容器 - 始终显示的按钮
        const alwaysVisibleBtns = document.createElement('div');
        alwaysVisibleBtns.id = 'always-visible-buttons';
        panelContent.appendChild(alwaysVisibleBtns);

        // 创建按钮容器 - 仅检测时显示的按钮
        const detectionBtns = document.createElement('div');
        detectionBtns.id = 'detection-buttons';
        detectionBtns.style.display = 'none'; // 初始隐藏
        panelContent.appendChild(detectionBtns);

        // 创建查看已点击元素按钮 (始终可见)
        const viewBtn = document.createElement('button');
        viewBtn.textContent = '查看已点击元素';
        viewBtn.style.cssText = `
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
            width: 100%;
        `;
        viewBtn.onclick = function () {
            console.log('--- 已点击的元素列表 ---');
            if (state.clickedElements.length === 0) {
                console.log('暂无点击记录');
            } else {
                state.clickedElements.forEach((item, index) => {
                    console.log(`${index + 1}. [${item.time}] ${item.description} - 内容: ${item.text}`);
                });
            }
            console.log('------------------------');
        };
        alwaysVisibleBtns.appendChild(viewBtn);

        // 创建暂停/继续按钮 (仅检测时可见)
        const pauseBtn = document.createElement('button');
        pauseBtn.textContent = '暂停检测';
        pauseBtn.style.cssText = `
            background-color: #f44336;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
            width: 100%;
        `;

        let isPaused = false;
        pauseBtn.onclick = function () {
            if (!isPaused) {
                // 暂停
                if (state.timerRef) {
                    clearInterval(state.timerRef);
                    state.timerRef = null;
                    pauseBtn.textContent = '继续检测';
                    pauseBtn.style.backgroundColor = '#2196F3';
                    console.log('检测已暂停');
                }
            } else {
                // 继续
                state.timerRef = setInterval(function () {
                    checkAndClickElements();
                    updateControlPanelStatus();
                }, config.checkInterval);
                pauseBtn.textContent = '暂停检测';
                pauseBtn.style.backgroundColor = '#f44336';
                console.log(`检测已继续，每 ${config.checkInterval / 1000} 秒检测一次`);
            }
            isPaused = !isPaused;
        };
        detectionBtns.appendChild(pauseBtn);

        // 创建取消上一次点击按钮 (仅检测时可见)
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消上次点击';
        cancelBtn.style.cssText = `
            background-color: #ff9800;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
            width: 100%;
        `;
        cancelBtn.onclick = function () {
            if (state.clickedElements.length > 0) {
                // 取消最后一次点击
                const lastIndex = state.clickedElements.length - 1;
                if (cancelClickedElement(lastIndex)) {
                    console.log('已取消最后一次点击');
                    // 从列表中移除
                    state.clickedElements.pop();
                }
            } else {
                console.log('没有可取消的点击记录');
            }
        };
        detectionBtns.appendChild(cancelBtn);

        // 创建开始按钮
        const startBtn = document.createElement('button');
        startBtn.id = 'start-detection-btn';
        startBtn.textContent = '开始检测';
        startBtn.style.cssText = `
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
            width: 100%;
        `;
        startBtn.onclick = function () {
            // 如果已经在运行，则不重复启动
            if (state.timerRef) {
                console.log('检测已在运行中');
                return;
            }
            startDetection();

            // 更新按钮状态
            startBtn.disabled = true;
            startBtn.style.backgroundColor = '#888';
            startBtn.textContent = '检测中...';

            // 显示检测时的按钮
            toggleDetectionButtons(true);
        };
        alwaysVisibleBtns.appendChild(startBtn);

        // 创建重置按钮
        const resetBtn = document.createElement('button');
        resetBtn.textContent = '重置脚本';
        resetBtn.style.cssText = `
            background-color: #9c27b0;
            border: none;
            color: white;
            padding: 5px 10px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 12px;
            margin: 2px;
            cursor: pointer;
            border-radius: 3px;
            width: 100%;
        `;
        resetBtn.onclick = function () {
            resetScript();
            // 重置后启用开始按钮
            startBtn.disabled = false;
            startBtn.style.backgroundColor = '#4CAF50';
            startBtn.textContent = '开始检测';

            // 隐藏检测时的按钮
            toggleDetectionButtons(false);
        };
        alwaysVisibleBtns.appendChild(resetBtn);

        // 添加到页面
        document.body.appendChild(panel);

        // 返回状态显示元素，用于后续更新
        return statusDiv;
    }

    // 更新控制面板状态
    function updateControlPanelStatus() {
        const statusDiv = document.getElementById('click-status');
        const resultDiv = document.getElementById('result-display');
        if (statusDiv) {
            // 如果正在运行检测
            if (state.timerRef) {
                const runTime = Math.floor((Date.now() - state.startTime) / 1000);
                statusDiv.innerHTML = `
                    <span style="color: #4CAF50;">正在运行</span><br>
                    运行时间: ${runTime} 秒<br>
                    检测次数: ${state.checkCount}/${config.maxCheckCount}<br>
                    已点击: ${state.totalClickCount}/${config.maxClicks}
                `;
                if (resultDiv) resultDiv.innerHTML = '';
            } else if (state.totalClickCount >= config.maxClicks) {
                // 如果已达到最大点击次数
                const runTime = Math.floor((Date.now() - state.startTime) / 1000);
                statusDiv.innerHTML = `
                    <span style="color: #f44336;">已完成</span><br>
                    运行时间: ${runTime} 秒<br>
                    检测次数: ${state.checkCount}/${config.maxCheckCount}<br>
                    已点击: <span style="color: #f44336;">${state.totalClickCount}/${config.maxClicks} (已达到最大值)</span>
                `;
                // 展示检测和执行结果
                if (resultDiv) {
                    let html = '';
                    html += `<b>检测已停止</b><br>`;
                    html += `检测次数：${state.checkCount}<br>`;
                    html += `总点击数：${state.totalClickCount}<br>`;
                    if (state.clickedElements.length > 0) {
                        html += '已点击元素：<br>';
                        state.clickedElements.forEach((item, idx) => {
                            html += `${idx + 1}. [${item.time}] ${item.description} <br> 内容: ${item.text}<br>`;
                        });
                    } else {
                        html += '本次检测未点击任何元素<br>';
                    }
                    resultDiv.innerHTML = html;
                }
                toggleDetectionButtons(false);
            } else if (state.checkCount >= config.maxCheckCount) {
                // 如果已达到最大检测次数
                const runTime = Math.floor((Date.now() - state.startTime) / 1000);
                statusDiv.innerHTML = `
                    <span style="color: #ff9800;">已达到最大检测次数</span><br>
                    运行时间: ${runTime} 秒<br>
                    检测次数: <span style="color: #ff9800;">${state.checkCount}/${config.maxCheckCount} (已达到最大值)</span><br>
                    已点击: ${state.totalClickCount}/${config.maxClicks}
                `;
                // 展示检测和执行结果
                if (resultDiv) {
                    let html = '';
                    html += `<b>检测已停止</b><br>`;
                    html += `检测次数：${state.checkCount}<br>`;
                    html += `总点击数：${state.totalClickCount}<br>`;
                    if (state.clickedElements.length > 0) {
                        html += '已点击元素：<br>';
                        state.clickedElements.forEach((item, idx) => {
                            html += `${idx + 1}. [${item.time}] ${item.description} <br> 内容: ${item.text}<br>`;
                        });
                    } else {
                        html += '本次检测未点击任何元素<br>';
                    }
                    resultDiv.innerHTML = html;
                }
                toggleDetectionButtons(false);
            } else if (config.targets.length > 0 && config.targets.every(target => state.activeElements[`${target.row}-${target.col}`])) {
                // 所有选择的坐标都已经被点击
                statusDiv.innerHTML = `<span style=\"color: #4CAF50;\">所有选择的坐标都已被点击，检测已完成</span>`;
                if (resultDiv) {
                    let html = '';
                    html += `<b>检测已停止</b><br>`;
                    html += `检测次数：${state.checkCount}<br>`;
                    html += `总点击数：${state.totalClickCount}<br>`;
                    if (state.clickedElements.length > 0) {
                        html += '已点击元素：<br>';
                        state.clickedElements.forEach((item, idx) => {
                            html += `${idx + 1}. [${item.time}] ${item.description} <br> 内容: ${item.text}<br>`;
                        });
                    } else {
                        html += '本次检测未点击任何元素<br>';
                    }
                    resultDiv.innerHTML = html;
                }
                toggleDetectionButtons(false);
            }
        }
    }

    // 显示或隐藏检测相关按钮
    function toggleDetectionButtons(show) {
        const detectionBtns = document.getElementById('detection-buttons');
        if (detectionBtns) {
            detectionBtns.style.display = show ? 'block' : 'none';
        }
    }

    // 排序目标元素，按列优先并优先处理连续行坐标
    function sortTargets(targets) {
        // 如果没有目标，直接返回空数组
        if (targets.length === 0) {
            return [];
        }

        // 使用已经计算好的优先级信息
        if (priorityInfo.orderedCells && priorityInfo.orderedCells.length > 0) {
            console.log('使用已计算的优先级信息进行排序');

            // 直接使用预先计算好的排序结果
            const sortedTargets = [...priorityInfo.orderedCells];

            console.log('排序前的目标：', targets);
            console.log('排序后的目标：', sortedTargets);
            return sortedTargets;
        }

        // 如果没有预先计算的优先级信息，则重新计算
        console.log('重新计算优先级信息进行排序');

        // 按列分组
        const columnGroups = {};
        targets.forEach(target => {
            if (!columnGroups[target.col]) {
                columnGroups[target.col] = [];
            }
            columnGroups[target.col].push(target);
        });

        // 对每个列组内的目标按行排序
        Object.values(columnGroups).forEach(group => {
            group.sort((a, b) => a.row - b.row);
        });

        // 计算每个列组的连续性分数
        const columnScores = {};
        Object.entries(columnGroups).forEach(([col, group]) => {
            let continuityScore = 0;
            for (let i = 1; i < group.length; i++) {
                if (group[i].row === group[i - 1].row + 1) {
                    continuityScore++;
                }
            }
            columnScores[col] = {
                continuityScore,
                count: group.length
            };
        });

        // 按连续性分数和元素数量对列进行排序
        const sortedColumns = Object.keys(columnGroups).sort((a, b) => {
            // 先按连续性分数降序排序
            if (columnScores[b].continuityScore !== columnScores[a].continuityScore) {
                return columnScores[b].continuityScore - columnScores[a].continuityScore;
            }
            // 如果连续性分数相同，则按元素数量降序排序
            if (columnScores[b].count !== columnScores[a].count) {
                return columnScores[b].count - columnScores[a].count;
            }
            // 如果元素数量也相同，则按列号升序排序
            return parseInt(a) - parseInt(b);
        });

        // 根据排序结果重新组合目标数组
        const sortedTargets = [];
        sortedColumns.forEach(col => {
            sortedTargets.push(...columnGroups[col]);
        });

        console.log('排序前的目标：', targets);
        console.log('排序后的目标：', sortedTargets);
        return sortedTargets;
    }

    // 启动检测的函数
    function startDetection() {
        // 检查是否有选择的元素
        if (config.targets.length === 0) {
            alert('请先选择要检测的元素！');
            return;
        }

        // 重置脚本状态
        resetScript();

        // 更新开始按钮状态
        const startBtn = document.getElementById('start-detection-btn');
        if (startBtn) {
            startBtn.disabled = true;
            startBtn.style.backgroundColor = '#cccccc';
            startBtn.textContent = '检测中...';
        }

        // 记录开始时间
        state.startTime = Date.now();

        console.log(`开始检测，共选择了 ${config.targets.length} 个元素`);
        console.log('选择的元素：', priorityInfo.orderedCells || config.targets);

        // 减少首次检测前的延迟，加快响应速度
        const quickStartDelay = 500; // 使用更短的延迟时间（毫秒）

        // 立即执行首次检测
        setTimeout(() => {
            // 执行首次检测
            checkAndClickElements();
            // 更新状态显示
            updateControlPanelStatus();

            // 启动定时器进行后续检测，使用更短的间隔时间
            state.timerRef = setInterval(function () {
                checkAndClickElements();
                // 每次检测后更新状态显示
                updateControlPanelStatus();
            }, 800); // 使用更短的间隔时间，加快检测速度
        }, quickStartDelay);

        // 更新状态显示
        updateControlPanelStatus();
    }

    // 等待页面完全加载
    window.addEventListener('load', function () {
        console.log('预订页面加载完成，等待手动开始...');

        // 显示当前匹配条件信息
        let conditionsInfo = '没有匹配条件';
        if (config.matchConditions && config.matchConditions.length > 0) {
            conditionsInfo = config.matchConditions.map((condition, index) => {
                let text = '';
                if (index > 0) {
                    const logicOp = condition.logicOperator || 'AND';
                    text += `${logicOp} `;
                }

                const conditionNames = {
                    'equals': '完全相等',
                    'equalsIgnoreCase': '相等(不区分大小写)',
                    'notEquals': '不相等',
                    'contains': '包含',
                    'containsIgnoreCase': '包含(不区分大小写)',
                    'notContains': '不包含',
                    'notContainsIgnoreCase': '不包含(不区分大小写)',
                    'startsWith': '以...开头',
                    'endsWith': '以...结尾',
                    'regEx': '正则表达式'
                };

                const conditionName = conditionNames[condition.condition] || condition.condition;
                text += `${conditionName} "${condition.text}"`;
                return text;
            }).join(', ');
        }

        console.log(`配置：匹配条件「${conditionsInfo}」，最多点击 ${config.maxClicks} 个元素，最多检测 ${config.maxCheckCount} 次`);

        // 创建控制面板
        createControlPanel();
    });
})();