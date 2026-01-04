// ==UserScript==
// @name         TheresMoreGame Cheater
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  修改 TheresMoreGame 游戏数据并添加调整属性的 UI
// @author       Keith
// @match        https://theresmoregame.g8hh.com.cn/*
// @grant        none
//// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500089/TheresMoreGame%20Cheater.user.js
// @updateURL https://update.greasyfork.org/scripts/500089/TheresMoreGame%20Cheater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ids = {
        resources: [
            'research', 'food', 'wood', 'stone', 'gold', 'tools', 'copper', 'iron',
            'cow', 'horse', 'luck', 'mana', 'building_material', 'faith', 'supplies',
            'crystal', 'steel', 'saltpetre', 'natronite'
        ],
        prestige: ['legacy'],
        special: ['relic', 'coin', 'tome_wisdom', 'gem', 'titan_gift']
    };

    // UI 样式
    const style = `
        #mod-ui {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #000;
            color: #ddd;
            border: 1px solid #333;
            padding: 10px;
            z-index: 10000;
            width: 320px;
            box-shadow: 0 0 10px rgba(0,0,0,0.4);
            font-family: Arial, sans-serif;
        }
        #mod-ui h3 {
            margin: 0 0 10px 0;
            font-size: 16px;
            color: #ccc;
            cursor: move;
        }
        #mod-ui input, #mod-ui select {
            width: 100%;
            margin-bottom: 10px;
            padding: 5px;
            box-sizing: border-box;
            background-color: #222;
            color: #ddd;
            border: 1px solid #333;
        }
        #mod-ui button {
            padding: 5px 10px;
            width: 100%;
            background-color: #004499;
            color: #ddd;
            border: none;
            cursor: pointer;
            box-sizing: border-box;
            margin-bottom: 10px;
        }
        #mod-ui button.close-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            width: auto;
            background-color: #333;
            color: #ddd;
            border: none;
            cursor: pointer;
            padding: 5px 10px;
        }
        #mod-ui button.close-btn:hover {
            background-color: #666;
        }
        #mod-ui button:hover {
            background-color: #002266;
        }
        #mod-ui .auto-recover-container {
            display: flex;
            align-items: center;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        #mod-ui .auto-recover-container label {
            color: #ddd;
            white-space: nowrap;
            padding: 5px 5px;
            margin-right: 5px;
            display: inline-flex;
            align-items: center;
        }
        #mod-ui .auto-recover-container input[type="checkbox"] {
            margin: 0;
            margin-left: 15px;
        }
    `;

    // 在文档中插入样式
    const styleElement = document.createElement('style');
    styleElement.innerText = style;
    document.head.appendChild(styleElement);

    // 创建 UI 元素
    const uiElement = document.createElement('div');
    uiElement.id = 'mod-ui';
    uiElement.innerHTML = `
        <h3>修改资源</h3>
        <select id="resource-type">
            <option value="resources">普通资源</option>
            <option value="prestige">声望点</option>
            <option value="special">特殊资源</option>
        </select>
        <input type="number" id="amount-input" placeholder="输入数量" />
        <select id="operation-type">
            <option value="set">设置</option>
            <option value="add">增加</option>
            <option value="subtract">减少</option>
        </select>
        <button id="apply-btn">应用</button>
        <div class="auto-recover-container">
            <label for="auto-recover-checkbox">自动恢复
                <input type="checkbox" id="auto-recover-checkbox" />
            </label>
        </div>
        <input type="number" id="auto-recover-interval" placeholder="恢复间隔（毫秒）" disabled />
        <button id="close-btn" class="close-btn">关闭</button>
    `;
    document.body.appendChild(uiElement);

    // 拖动功能
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    uiElement.querySelector('h3').onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        uiElement.style.top = (uiElement.offsetTop - pos2) + "px";
        uiElement.style.left = (uiElement.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

    // 获取游戏数据
    function getGameData() {
        const rootElement = document.getElementById('root');
        if (!rootElement) {
            console.error('无法找到 React 根元素。');
            return null;
        }

        const reactKey = Object.keys(rootElement).find(key => key.startsWith('__reactContainer$'));
        if (reactKey) {
            const container = rootElement[reactKey];
            return container?.stateNode?.current?.child?.memoizedProps?.MainStore;
        }
        return null;
    }

    // 修改资源数据
    function modifyResources(type, amount = 1000000000, operation = 'add') {
        const gameData = getGameData();
        if (!gameData || !gameData.run || !gameData.run.resources) {
            console.error('游戏数据不可用或结构不正确。');
            return;
        }

        const resources = gameData.run.resources;
        if (!ids[type]) {
            console.error(`无效的类型：${type}`);
            return;
        }

        console.log('Attempting to modify resources:', type, amount, operation);

        resources.forEach(resource => {
            console.log('Checking resource:', resource.id, resource.value);
            if (ids[type].includes(resource.id)) {
                switch (operation) {
                    case 'set':
                        resource.value = amount;
                        break;
                    case 'add':
                        resource.value = (resource.value ?? 0) + amount;
                        break;
                    case 'subtract':
                        resource.value = Math.max((resource.value ?? 0) - amount, 0);
                        break;
                    default:
                        console.error(`Invalid operation: ${operation}`);
                        break;
                }
                console.log('Modified resource:', resource.id, 'New value:', resource.value);
            }
        });

        console.log(`${type} modification complete.`);
    }

    // 自动恢复资源
    let autoRecoverInterval;
    let lastRecoverInterval = 2000; // 默认恢复间隔为 2000 毫秒

    function startAutoRecover(type, interval) {
        if (autoRecoverInterval) {
            clearInterval(autoRecoverInterval);
        }
        autoRecoverInterval = setInterval(() => {
            modifyResources(type, 1000000000, 'set');
        }, interval);
        lastRecoverInterval = interval; // 保存最后设置的恢复间隔
    }

    function stopAutoRecover() {
        if (autoRecoverInterval) {
            clearInterval(autoRecoverInterval);
        }
    }

    // 等待页面加载完毕
    window.addEventListener('load', () => {
        console.log('页面加载完成。');

        // 应用按钮事件
        document.getElementById('apply-btn').addEventListener('click', () => {
            const type = document.getElementById('resource-type').value;
            const amount = parseInt(document.getElementById('amount-input').value, 10);
            const operation = document.getElementById('operation-type').value;

            if (isNaN(amount)) {
                alert('请输入有效的数字');
                return;
            }

            modifyResources(type, amount, operation);
        });

        // 自动恢复复选框事件
        document.getElementById('auto-recover-checkbox').addEventListener('change', (event) => {
            const isChecked = event.target.checked;
            const intervalInput = document.getElementById('auto-recover-interval');
            intervalInput.disabled = !isChecked;

            if (!isChecked) {
                stopAutoRecover();
            } else {
                const interval = parseInt(intervalInput.value, 10) || lastRecoverInterval;
                const type = document.getElementById('resource-type').value;
                startAutoRecover(type, interval);
            }
        });

        // 自动恢复间隔输入框事件
        document.getElementById('auto-recover-interval').addEventListener('input', (event) => {
            const interval = parseInt(event.target.value, 10);
            if (isNaN(interval) || interval <= 0) {
                alert('请输入有效的恢复间隔时间（毫秒）');
                event.target.value = lastRecoverInterval;
                return;
            }

            if (document.getElementById('auto-recover-checkbox').checked) {
                const type = document.getElementById('resource-type').value;
                startAutoRecover(type, interval);
            }
        });

        // 关闭按钮事件
        document.getElementById('close-btn').addEventListener('click', () => {
            document.body.removeChild(uiElement);
        });
    });
})();