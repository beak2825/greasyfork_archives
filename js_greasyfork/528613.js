// ==UserScript==
// @name         多功能点击器（坐标 + 文字点击）
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  支持坐标点击和文字点击，支持隐藏/显示控制面板，性能优化
// @author       你的名字
// @match        *://*.github.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528613/%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%82%B9%E5%87%BB%E5%99%A8%EF%BC%88%E5%9D%90%E6%A0%87%20%2B%20%E6%96%87%E5%AD%97%E7%82%B9%E5%87%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528613/%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%82%B9%E5%87%BB%E5%99%A8%EF%BC%88%E5%9D%90%E6%A0%87%20%2B%20%E6%96%87%E5%AD%97%E7%82%B9%E5%87%BB%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 创建界面样式
    const style = document.createElement('style');
    style.innerHTML = `
        #multi-clicker-ui {
            position: fixed;
            top: 10px;
            right: 10px;
            background-color: #2d2d2d;
            color: #e0e0e0;
            padding: 15px;
            border-radius: 8px;
            font-family: 'Arial', sans-serif;
            z-index: 9999;
            box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            width: 320px;
            transition: transform 0.3s ease;
        }
        #multi-clicker-ui.hidden {
            transform: translateX(110%);
        }
        #multi-clicker-ui h3 {
            margin: 0 0 10px;
            font-size: 16px;
            color: #ffffff;
        }
        #multi-clicker-ui label {
            display: block;
            margin: 10px 0 5px;
            font-size: 14px;
            color: #e0e0e0;
        }
        #multi-clicker-ui input[type="text"],
        #multi-clicker-ui input[type="number"] {
            width: 100%;
            padding: 5px;
            margin-bottom: 10px;
            border: 1px solid #444;
            border-radius: 4px;
            background-color: #3d3d3d;
            color: #e0e0e0;
        }
        #multi-clicker-ui button {
            background-color: #444;
            color: #e0e0e0;
            border: none;
            padding: 8px 12px;
            margin: 5px 0;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }
        #multi-clicker-ui button:hover {
            background-color: #555;
        }
        #multi-clicker-ui .status {
            margin-top: 10px;
            font-size: 14px;
            color: #e0e0e0;
        }
        #multi-clicker-ui .checkbox-label {
            display: flex;
            align-items: center;
            margin: 10px 0;
        }
        #multi-clicker-ui .checkbox-label input {
            margin-right: 8px;
        }
        #multi-clicker-ui .text-list,
        #multi-clicker-ui .coord-list {
            margin: 10px 0;
            max-height: 150px;
            overflow-y: auto;
            border: 1px solid #444;
            border-radius: 4px;
            padding: 5px;
            background-color: #3d3d3d;
        }
        #multi-clicker-ui .text-item,
        #multi-clicker-ui .coord-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px;
            margin: 3px 0;
            background-color: #444;
            border-radius: 3px;
        }
        #multi-clicker-ui .text-item button,
        #multi-clicker-ui .coord-item button {
            background-color: #ff5555;
            color: white;
            border: none;
            padding: 3px 6px;
            border-radius: 3px;
            cursor: pointer;
        }
        #multi-clicker-ui .text-item button:hover,
        #multi-clicker-ui .coord-item button:hover {
            background-color: #ff7777;
        }
        #toggle-panel {
            position: fixed;
            top: 10px;
            right: 60px;
            background-color: #2d2d2d;
            color: #e0e0e0;
            border: none;
            padding: 10px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
        }
        #toggle-panel:hover {
            background-color: #444;
        }
    `;
    document.head.appendChild(style);

    // 创建隐藏/显示按钮
    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-panel';
    toggleButton.innerHTML = '🍔';
    document.body.appendChild(toggleButton);

    // 创建主界面
    const ui = document.createElement('div');
    ui.id = 'multi-clicker-ui';
    ui.innerHTML = `
        <h3>多功能点击器</h3>
        <div>
            <label for="text-input">输入要点击的文字：</label>
            <input type="text" id="text-input" placeholder="例如：点击我">
            <button id="add-text">添加文字</button>
        </div>
        <div class="text-list" id="text-list"></div>
        <div>
            <label for="delay">默认点击延迟（毫秒）：</label>
            <input type="number" id="delay" value="1000">
        </div>
        <div class="checkbox-label">
            <input type="checkbox" id="infinite-loop" checked>
            <label for="infinite-loop">无限循环</label>
        </div>
        <div>
            <button id="toggle">暂停</button>
        </div>
        <div class="status">
            状态: <span id="status">运行中</span>
        </div>
        <hr>
        <div>
            <button id="record-coord">开始记录坐标</button>
            <button id="toggle-auto-click">开始自动点击坐标</button>
            <button id="clear-coords">清除坐标</button>
        </div>
        <div class="coord-list" id="coord-list"></div>
    `;
    document.body.appendChild(ui);

    // 初始化变量
    let running = true;
    let targetTexts = [];
    let delay = 1000;
    let infiniteLoop = true;
    let lastClickTime = 0;

    // 坐标点击相关变量
    const coordinates = new Map();
    let isRecording = false;
    let isAutoClicking = false;

    // 缓存 DOM 元素
    const textInput = document.getElementById('text-input');
    const textList = document.getElementById('text-list');
    const coordList = document.getElementById('coord-list');
    const statusElement = document.getElementById('status');
    const toggleButtonElement = document.getElementById('toggle');
    const recordCoordButton = document.getElementById('record-coord');
    const toggleAutoClickButton = document.getElementById('toggle-auto-click');

    // 隐藏/显示界面
    toggleButton.addEventListener('click', () => {
        ui.classList.toggle('hidden');
    });

    // 切换运行状态
    toggleButtonElement.addEventListener('click', () => {
        running = !running;
        statusElement.textContent = running ? '运行中' : '已暂停';
        toggleButtonElement.textContent = running ? '暂停' : '继续';
    });

    // 添加文字
    document.getElementById('add-text').addEventListener('click', () => {
        const input = textInput.value.trim();
        if (input && !targetTexts.includes(input)) {
            targetTexts.push(input);
            updateTextList();
            console.log('添加的文字:', input);
        }
    });

    // 删除文字
    function removeText(text) {
        targetTexts = targetTexts.filter(t => t !== text);
        updateTextList();
        console.log('删除的文字:', text);
    }

    // 更新文字列表
    function updateTextList() {
        textList.innerHTML = '';
        targetTexts.forEach(text => {
            const item = document.createElement('div');
            item.className = 'text-item';
            item.innerHTML = `
                <span>${text}</span>
                <button onclick="removeText('${text}')">删除</button>
            `;
            textList.appendChild(item);
        });
    }

    // 更新默认延迟
    document.getElementById('delay').addEventListener('change', () => {
        delay = parseInt(document.getElementById('delay').value, 10);
        console.log(`默认延迟设置为: ${delay} 毫秒`);
    });

    // 更新无限循环选项
    document.getElementById('infinite-loop').addEventListener('change', () => {
        infiniteLoop = document.getElementById('infinite-loop').checked;
        console.log(`无限循环: ${infiniteLoop ? '开启' : '关闭'}`);
    });

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        if (running) {
            const now = Date.now();
            if (now - lastClickTime >= delay) {
                clickText();
                lastClickTime = now;
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
    });

    // 点击文字功能
    function clickText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            if (targetTexts.includes(node.nodeValue.trim())) {
                const range = document.createRange();
                range.selectNodeContents(node);
                const rect = range.getBoundingClientRect();

                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                    clientX: rect.left + rect.width / 2,
                    clientY: rect.top + rect.height / 2
                });
                node.parentElement.dispatchEvent(clickEvent);

                console.log(`点击了文字: ${node.nodeValue.trim()}`);
            }
        }
    }

    // 坐标点击功能
    recordCoordButton.addEventListener('click', () => {
        isRecording = !isRecording;
        recordCoordButton.textContent = isRecording ? '停止记录坐标' : '开始记录坐标';
        console.log(isRecording ? '开始记录坐标' : '停止记录坐标');
    });

    document.addEventListener('click', (event) => {
        if (isRecording && !event.target.closest('#multi-clicker-ui') && event.target !== recordCoordButton) {
            const id = Date.now();
            coordinates.set(id, { x: event.clientX, y: event.clientY, interval: delay });
            updateCoordList();
            console.log(`记录坐标: (${event.clientX}, ${event.clientY})`);
        }
    });

    // 整合“开始自动点击坐标”和“停止自动点击”按钮
    toggleAutoClickButton.addEventListener('click', () => {
        if (coordinates.size === 0) {
            console.log('没有坐标可点击');
            return;
        }

        isAutoClicking = !isAutoClicking;
        toggleAutoClickButton.textContent = isAutoClicking ? '停止自动点击' : '开始自动点击坐标';
        statusElement.textContent = isAutoClicking ? '自动点击运行中' : '自动点击已停止';

        if (isAutoClicking) {
            console.log('开始自动点击坐标...');
            autoClickCoordinates();
        } else {
            console.log('停止自动点击');
        }
    });

    // 自动点击坐标（支持首尾循环）
    function autoClickCoordinates() {
        let index = 0;
        const coordsArray = Array.from(coordinates.values());

        function clickNext() {
            if (!isAutoClicking) {
                console.log('自动点击已停止');
                return;
            }

            if (index < coordsArray.length) {
                const coord = coordsArray[index];
                simulateClick(coord.x, coord.y);
                console.log(`自动点击坐标: (${coord.x}, ${coord.y}), 间隔: ${coord.interval} 毫秒`);

                setTimeout(() => {
                    index++;
                    if (index >= coordsArray.length && infiniteLoop) {
                        index = 0; // 首尾循环
                    }
                    clickNext();
                }, coord.interval);
            } else {
                isAutoClicking = false;
                toggleAutoClickButton.textContent = '开始自动点击坐标';
                statusElement.textContent = '自动点击完成';
                console.log('自动点击完成');
            }
        }

        clickNext();
    }

    // 清除坐标
    document.getElementById('clear-coords').addEventListener('click', () => {
        coordinates.clear();
        updateCoordList();
        console.log('已清除所有坐标');
    });

    // 更新坐标列表
    function updateCoordList() {
        coordList.innerHTML = '';
        coordinates.forEach((coord, id) => {
            const item = document.createElement('div');
            item.className = 'coord-item';
            item.innerHTML = `
                <span>坐标 ${id}: (${coord.x}, ${coord.y})</span>
                <input type="number" class="coord-delay" value="${coord.interval}" placeholder="延迟（毫秒）">
                <button onclick="removeCoord(${id})">删除</button>
            `;
            // 绑定延迟输入框的更新事件
            const delayInput = item.querySelector('.coord-delay');
            delayInput.addEventListener('change', () => {
                coord.interval = parseInt(delayInput.value, 10);
                console.log(`坐标 ${id} 的延迟更新为: ${coord.interval} 毫秒`);
            });
            coordList.appendChild(item);
        });
    }

    // 删除坐标
    function removeCoord(id) {
        coordinates.delete(id);
        updateCoordList();
        console.log(`删除坐标: ${id}`);
    }

    // 模拟点击
    function simulateClick(x, y) {
        const element = document.elementFromPoint(x, y);
        if (element) {
            const event = new MouseEvent('click', {
                bubbles: true,
                cancelable: true,
                view: window,
                clientX: x,
                clientY: y
            });
            element.dispatchEvent(event);
        }
    }

    // 暴露函数到全局
    window.removeText = removeText;
    window.removeCoord = removeCoord;
})();