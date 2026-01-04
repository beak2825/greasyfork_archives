// ==UserScript==
// @name         [攀登idle]自动化脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  攀登放置自动化脚本(目前仅有自动移动)
// @author       Truth_Light
// @license      Truth_Light
// @match        https://g1tyx.github.io/the-climb/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528509/%5B%E6%94%80%E7%99%BBidle%5D%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528509/%5B%E6%94%80%E7%99%BBidle%5D%E8%87%AA%E5%8A%A8%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let isScriptRunning = false; // 脚本运行状态
    let logicList = []; // 存储用户添加的逻辑

    function createButtonContainer() {
        const container = document.createElement('div');
        container.id = 'button-container';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.display = 'flex';
        container.style.gap = '10px';
        container.style.zIndex = '1000';

        // 添加切换脚本状态的按钮
        const toggleScriptButton = createButton(isScriptRunning ? '停止脚本' : '启动脚本', toggleScript, isScriptRunning ? '#f44336' : '#4CAF50');
        toggleScriptButton.id = 'toggle-script-button';

        // 添加其他按钮
        const addLogicButton = createButton('添加逻辑', showAddLogicDialog, '#2196F3');
        const manageLogicButton = createButton('管理逻辑', showManageLogicDialog, '#FF9800');

        container.appendChild(toggleScriptButton);
        container.appendChild(addLogicButton);
        container.appendChild(manageLogicButton);

        // 将容器添加到页面
        document.body.appendChild(container);
    }

    // 创建按钮
    function createButton(text, onClick, color) {
        const button = document.createElement('button');
        button.textContent = text;
        button.style.backgroundColor = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.padding = '10px 20px';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.opacity = '0.9';
        button.addEventListener('click', onClick);
        return button;
    }

    // 切换脚本状态
    function toggleScript() {
        if (isScriptRunning) {
            stopScript();
        } else {
            startScript();
        }
        updateToggleButton();
    }

    // 更新切换按钮的样式和文本
    function updateToggleButton() {
        const toggleButton = document.getElementById('toggle-script-button');
        if (toggleButton) {
            toggleButton.textContent = isScriptRunning ? '停止脚本' : '启动脚本';
            toggleButton.style.backgroundColor = isScriptRunning ? '#f44336' : '#4CAF50';
        }
    }

    // 启动脚本
    function startScript() {
        if (!isScriptRunning) {
            isScriptRunning = true;
            console.log("脚本开始运行!");
            runLogic();
        }
    }

    // 停止脚本
    function stopScript() {
        if (isScriptRunning) {
            isScriptRunning = false;
            console.log("脚本停止运行!");
        }
    }

    // 创建自定义弹窗（添加逻辑）
    function createAddLogicDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'add-logic-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialog.style.zIndex = '1001';
        dialog.style.display = 'none';

        // 弹窗内容
        const title = document.createElement('h3');
        title.textContent = '添加逻辑';
        title.style.marginTop = '0';

        const locationLabel = document.createElement('label');
        locationLabel.textContent = '当前地点:';
        locationLabel.style.display = 'block';
        locationLabel.style.marginBottom = '5px';

        const locationInput = document.createElement('input');
        locationInput.type = 'text';
        locationInput.value = getCurrentLocation();
        locationInput.disabled = true;
        locationInput.style.width = '100%';
        locationInput.style.marginBottom = '10px';

        const actionLabel = document.createElement('label');
        actionLabel.textContent = '选择行动:';
        actionLabel.style.display = 'block';
        actionLabel.style.marginBottom = '5px';

        const actionSelect = document.createElement('select');
        actionSelect.style.width = '100%';
        actionSelect.style.marginBottom = '10px';

        const actions = getAvailableActions().map(action => action.text);
        actions.forEach(action => {
            const option = document.createElement('option');
            option.value = action;
            option.textContent = action;
            actionSelect.appendChild(option);
        });

        const priorityLabel = document.createElement('label');
        priorityLabel.textContent = '优先级（数字越小优先级越高）:';
        priorityLabel.style.display = 'block';
        priorityLabel.style.marginBottom = '5px';

        const priorityInput = document.createElement('input');
        priorityInput.type = 'number';
        priorityInput.value = 1;
        priorityInput.style.width = '100%';
        priorityInput.style.marginBottom = '10px';

        const confirmButton = createButton('确认', () => {
            const selectedAction = actionSelect.value;
            const priority = parseInt(priorityInput.value, 10);
            if (selectedAction && !isNaN(priority)) {
                addLogic(locationInput.value, selectedAction, priority);
                dialog.style.display = 'none';
            }
        }, '#4CAF50');

        const cancelButton = createButton('取消', () => {
            dialog.style.display = 'none';
        }, '#f44336');

        // 将元素添加到弹窗
        dialog.appendChild(title);
        dialog.appendChild(locationLabel);
        dialog.appendChild(locationInput);
        dialog.appendChild(actionLabel);
        dialog.appendChild(actionSelect);
        dialog.appendChild(priorityLabel);
        dialog.appendChild(priorityInput);
        dialog.appendChild(confirmButton);
        dialog.appendChild(cancelButton);

        // 将弹窗添加到页面
        document.body.appendChild(dialog);
        return dialog;
    }

    // 创建管理逻辑弹窗
    function createManageLogicDialog() {
        const dialog = document.createElement('div');
        dialog.id = 'manage-logic-dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '50%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, -50%)';
        dialog.style.backgroundColor = 'white';
        dialog.style.padding = '20px';
        dialog.style.borderRadius = '10px';
        dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        dialog.style.zIndex = '1001';
        dialog.style.display = 'none';

        // 弹窗内容
        const title = document.createElement('h3');
        title.textContent = '管理逻辑';
        title.style.marginTop = '0';

        const logicListContainer = document.createElement('div');
        logicListContainer.id = 'manage-logic-list';
        logicListContainer.style.marginBottom = '10px';

        const closeButton = createButton('关闭', () => {
            dialog.style.display = 'none';
        }, '#f44336');

        // 将元素添加到弹窗
        dialog.appendChild(title);
        dialog.appendChild(logicListContainer);
        dialog.appendChild(closeButton);

        // 将弹窗添加到页面
        document.body.appendChild(dialog);
        return dialog;
    }

    // 显示添加逻辑弹窗
    function showAddLogicDialog() {
        const dialog = document.getElementById('add-logic-dialog');
        if (dialog) {
            // 获取当前地点
            const locationInput = dialog.querySelector('input[type="text"]');
            if (locationInput) {
                locationInput.value = getCurrentLocation();
            }

            // 获取可用行动
            const actionSelect = dialog.querySelector('select');
            if (actionSelect) {
                actionSelect.innerHTML = ''; // 清空之前的选项
                const actions = getAvailableActions().map(action => action.text);
                actions.forEach(action => {
                    const option = document.createElement('option');
                    option.value = action;
                    option.textContent = action;
                    actionSelect.appendChild(option);
                });
            }

            dialog.style.display = 'block';
        }
    }

    // 显示管理逻辑弹窗
    function showManageLogicDialog() {
        const dialog = document.getElementById('manage-logic-dialog');
        if (dialog) {
            updateManageLogicDialog();
            dialog.style.display = 'block';
        }
    }

    // 更新管理逻辑弹窗内容
    function updateManageLogicDialog() {
        const logicListContainer = document.getElementById('manage-logic-list');
        logicListContainer.innerHTML = '';

        logicList.forEach((logic, index) => {
            const logicItem = document.createElement('div');
            logicItem.style.display = 'flex';
            logicItem.style.justifyContent = 'space-between';
            logicItem.style.alignItems = 'center';
            logicItem.style.marginBottom = '10px';

            const logicText = document.createElement('span');
            logicText.textContent = `${logic.location} → ${logic.action} (优先级: ${logic.priority})`;

            const deleteButton = createButton('删除', () => {
                logicList.splice(index, 1);
                updateManageLogicDialog(); // 更新界面
                localStorage.setItem('logicList', JSON.stringify(logicList)); // 保存到 localStorage
            }, '#f44336');

            logicItem.appendChild(logicText);
            logicItem.appendChild(deleteButton);
            logicListContainer.appendChild(logicItem);
        });
    }

    // 获取当前地点的名称
    function getCurrentLocation() {
        const locationElement = document.querySelector("#container > div.scene.box > div.top > div.left > div.name");
        return locationElement ? locationElement.textContent.trim() : null;
    }

    // 获取所有可用的行动按钮
    function getAvailableActions() {
        const actionElements = document.querySelectorAll("#container > div.scene.box > div.options > div.option");
        return Array.from(actionElements).map(element => ({
            element,
            text: element.textContent.trim(),
        }));
    }

    // 根据行动文本点击按钮
    function clickActionByText(actionText) {
        const actions = getAvailableActions();
        const targetAction = actions.find(action => action.text === actionText);
        if (targetAction) {
            targetAction.element.click();
            console.log(`点击: ${actionText}`);
        } else {
            console.error(`没有找到: ${actionText}`);
        }
    }

    // 主逻辑
    async function runLogic() {
        while (isScriptRunning) {
            try {
                const currentLocation = getCurrentLocation();
                console.log(`当前地点: ${currentLocation}`);

                // 获取当前地点的所有逻辑，按优先级排序
                const relevantLogics = logicList
                .filter(logic => logic.location === currentLocation)
                .sort((a, b) => a.priority - b.priority);

                for (const logic of relevantLogics) {
                    const actions = getAvailableActions().map(action => action.text);
                    if (actions.includes(logic.action)) {
                        clickActionByText(logic.action);
                        break; // 执行优先级最高的可用行动
                    }
                }

                // 延迟
                await sleep(100);
            } catch (error) {
                console.error('错误:', error);
                stopScript(); // 停止脚本
                break;
            }
        }
    }

    function initializeLogicList() {
        const cachedLogicList = localStorage.getItem('logicList');
        if (cachedLogicList) {
            logicList = JSON.parse(cachedLogicList);
            console.log('从缓存中加载逻辑列表:', logicList);
        } else {
            logicList = [];
            console.log('未找到缓存的逻辑列表，初始化空列表。');
        }
    }

    // 添加逻辑
    function addLogic(location, action, priority) {
        logicList.push({ location, action, priority });
        console.log(`添加逻辑: ${location} → ${action} (优先级: ${priority})`);
        updateManageLogicDialog();

        // 保存到 localStorage
        localStorage.setItem('logicList', JSON.stringify(logicList));
    }

    // sleep 函数
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // 初始化
    initializeLogicList();
    createButtonContainer();
    createAddLogicDialog();
    createManageLogicDialog();
})();