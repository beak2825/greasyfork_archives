// ==UserScript==
// @name         鼠标自动化操作
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  输入多个坐标和时间间隔实现自动化点击，支持修改和删除，任务管理面板优化
// @author       heiyu
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497300/%E9%BC%A0%E6%A0%87%E8%87%AA%E5%8A%A8%E5%8C%96%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/497300/%E9%BC%A0%E6%A0%87%E8%87%AA%E5%8A%A8%E5%8C%96%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建固定的 UI 框
    const positionBox = document.createElement('div');
    Object.assign(positionBox.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        width: '350px',
        height: '400px',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: 'white',
        borderRadius: '5px',
        zIndex: '1000',
        fontFamily: 'Arial, sans-serif',
        fontSize: '14px',
        cursor: 'move',
        display: 'flex',
        flexDirection: 'column',
    });
    document.body.appendChild(positionBox);

    // 添加标题
    const title = document.createElement('div');
    title.textContent = '鼠标自动化操作';
    Object.assign(title.style, {
        fontSize: '16px',
        fontWeight: 'bold',
        marginBottom: '10px',
        padding: '5px',
    });
    positionBox.appendChild(title);

    // 显示当前鼠标位置
    const mousePositionDisplay = document.createElement('div');
    Object.assign(mousePositionDisplay.style, {
        marginBottom: '10px',
        padding: '5px',
    });
    positionBox.appendChild(mousePositionDisplay);
    document.addEventListener('mousemove', event => {
        mousePositionDisplay.textContent = `捕获的位置: x: ${event.clientX}, y: ${event.clientY}`;
    });

    // 添加任务输入区域
    const inputContainer = document.createElement('div');
    Object.assign(inputContainer.style, {
        marginBottom: '10px',
        padding: '5px',
    });
    positionBox.appendChild(inputContainer);

    const coordXInput = createInput('输入捕获到的x坐标');
    const coordYInput = createInput('输入捕获到的y坐标');
    const countdownInput = createInput('鼠标点击的时间间隔（毫秒）');
    inputContainer.appendChild(coordXInput);
    inputContainer.appendChild(coordYInput);
    inputContainer.appendChild(countdownInput);

    const addButton = createButton('添加任务', () => {
        const x = parseInt(coordXInput.value, 10);
        const y = parseInt(coordYInput.value, 10);
        const countdown = parseInt(countdownInput.value, 10);

        if (isNaN(x) || isNaN(y) || isNaN(countdown)) {
            alert('请输入有效的坐标和时间间隔。');
            return;
        }

        addTask(x, y, countdown);
    });
    const executeButton = createButton('开始执行', executeTasks);
    inputContainer.appendChild(addButton);
    inputContainer.appendChild(executeButton);

    // 添加任务列表容器
    const taskListContainer = document.createElement('div');
    Object.assign(taskListContainer.style, {
        flex: '1',
        overflowY: 'auto',
        padding: '5px',
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderRadius: '5px',
    });
    positionBox.appendChild(taskListContainer);

    // 添加任务列表
    const taskList = document.createElement('div');
    taskListContainer.appendChild(taskList);

    // 任务队列
    const tasks = [];

    // 添加任务到队列并更新显示
    function addTask(x, y, countdown) {
        tasks.push({ x, y, countdown });
        updateTaskList();
    }

    // 更新任务列表显示
    function updateTaskList() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskDiv = document.createElement('div');
            taskDiv.textContent = `任务${index + 1}: x：${task.x}, y：${task.y}, t：${task.countdown}ms`;

            const modifyButton = createButton('修改', () => modifyTask(index));
            const deleteButton = createButton('删除', () => deleteTask(index));

            taskDiv.appendChild(modifyButton);
            taskDiv.appendChild(deleteButton);
            Object.assign(taskDiv.style, {
                marginBottom: '5px',
                padding: '5px',
                border: '1px solid #666',
                borderRadius: '3px',
            });
            taskList.appendChild(taskDiv);
        });
    }

    // 修改任务
    function modifyTask(index) {
        const task = tasks[index];
        const newX = prompt('输入新的 x 坐标', task.x);
        const newY = prompt('输入新的 y 坐标', task.y);
        const newCountdown = prompt('输入新的时间间隔（毫秒）', task.countdown);

        if (newX !== null && newY !== null && newCountdown !== null) {
            tasks[index] = { x: parseInt(newX, 10), y: parseInt(newY, 10), countdown: parseInt(newCountdown, 10) };
            updateTaskList();
        }
    }

    // 删除任务
    function deleteTask(index) {
        tasks.splice(index, 1);
        updateTaskList();
    }

    // 执行任务
    function executeTasks() {
        let delay = 0;

        tasks.forEach(task => {
            delay += task.countdown;
            setTimeout(() => simulateMouseClick(task.x, task.y), delay);
        });
    }

    // 模拟鼠标点击
    function simulateMouseClick(x, y) {
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: x,
            clientY: y,
        });

        const target = document.elementFromPoint(x, y);
        if (target) {
            target.dispatchEvent(event);
        }
    }

    // 工具函数：创建输入框
    function createInput(placeholder) {
        const input = document.createElement('input');
        Object.assign(input.style, {
            display: 'block',
            marginBottom: '5px',
            width: 'calc(100% - 10px)',
        });
        input.type = 'number';
        input.placeholder = placeholder;
        return input;
    }

    // 工具函数：创建按钮
    function createButton(label, onClick) {
        const button = document.createElement('button');
        button.textContent = label;
        Object.assign(button.style, {
            display: 'inline-block',
            margin: '5px 5px 0 0',
            padding: '5px 10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
        });
        button.addEventListener('click', onClick);
        return button;
    }
        // 使 UI 可拖动
    positionBox.onmousedown = function(event) {
        const shiftX = event.clientX - positionBox.getBoundingClientRect().left;
        const shiftY = event.clientY - positionBox.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            positionBox.style.left = pageX - shiftX + 'px';
            positionBox.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        positionBox.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            positionBox.onmouseup = null;
        };
    };

    positionBox.ondragstart = () => false;
})();
