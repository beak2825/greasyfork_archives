// ==UserScript==
// @name         chatshare车辆跟踪器，让你更快找到新车
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  跟踪共享账号池中的新车辆并添加复制按钮，让你更快找到新车
// @author       schweigen
// @match        https://chatshare.xyz/pastel/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536409/chatshare%E8%BD%A6%E8%BE%86%E8%B7%9F%E8%B8%AA%E5%99%A8%EF%BC%8C%E8%AE%A9%E4%BD%A0%E6%9B%B4%E5%BF%AB%E6%89%BE%E5%88%B0%E6%96%B0%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/536409/chatshare%E8%BD%A6%E8%BE%86%E8%B7%9F%E8%B8%AA%E5%99%A8%EF%BC%8C%E8%AE%A9%E4%BD%A0%E6%9B%B4%E5%BF%AB%E6%89%BE%E5%88%B0%E6%96%B0%E8%BD%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    GM_addStyle(`
        #carTrackerPanel {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: white;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding: 10px;
            z-index: 9999;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }

        #carTrackerHeader {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            border-bottom: 1px solid #eee;
            padding-bottom: 5px;
        }

        #carTrackerTitle {
            margin: 0;
            font-size: 16px;
            font-weight: bold;
            color: #333;
        }

        .carTrackerButton {
            padding: 5px 10px;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
            margin-right: 5px;
            margin-bottom: 5px;
        }

        #saveButton {
            background-color: #4CAF50;
            color: white;
        }

        #toggleListButton {
            background-color: #2196F3;
            color: white;
        }

        #addButton {
            background-color: #ff9800;
            color: white;
        }

        #togglePanelButton {
            border: none;
            background: none;
            cursor: pointer;
            font-size: 18px;
        }

        #carList {
            margin-top: 10px;
            margin-bottom: 10px;
            max-height: 150px;
            overflow-y: auto;
            display: none;
        }

        #carList ul {
            margin: 0;
            padding-left: 20px;
        }

        #addCarInput {
            width: 150px;
            padding: 5px;
            margin-right: 5px;
            border: 1px solid #ccc;
            border-radius: 3px;
        }

        #addCarForm {
            display: flex;
            margin-bottom: 10px;
            align-items: center;
        }

        .newCar {
            background-color: #ffd54f !important;
            border: 2px solid #ffc107 !important;
            animation: pulseBorder 1s infinite alternate !important;
        }

        @keyframes pulseBorder {
            from {
                box-shadow: 0 0 5px #ffc107;
            }
            to {
                box-shadow: 0 0 15px #ffc107;
            }
        }

        /* 复制按钮样式 */
        .copy-button {
            background-color: #1E90FF;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 5px;
            font-size: 10px;
            cursor: pointer;
            margin-left: 5px;
            vertical-align: middle;
            height: 22px;
            line-height: 18px;
        }

        .copy-button:hover {
            background-color: #0066CC;
        }

        .copy-success {
            background-color: #4CAF50;
        }

        /* 调整车名容器样式 */
        .state-info {
            display: flex !important;
            align-items: center !important;
            flex-wrap: wrap !important;
            justify-content: space-between !important;
        }

        .state-info p {
            margin-right: 5px !important;
        }

        /* 顶部通知样式 */
        #notificationToast {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 14px;
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .notification-show {
            opacity: 1 !important;
        }
    `);

    // 全局变量
    let isInitialized = false;
    let checkInterval = null;
    let urlCheckInterval = null;
    let lastUrl = '';

    // 初始化函数
    function init() {
        console.log('[车辆跟踪器] 初始化中...');

        // 创建通知元素
        if (!document.getElementById('notificationToast')) {
            const toast = document.createElement('div');
            toast.id = 'notificationToast';
            document.body.appendChild(toast);
        }

        // 保存当前URL
        lastUrl = location.href;

        // 立即检查一次URL
        checkUrlAndInitialize();

        // 设置URL定期检查，每500毫秒检查一次URL变化
        urlCheckInterval = setInterval(function() {
            // 只有当URL发生变化时才检查
            if (lastUrl !== location.href) {
                console.log('[车辆跟踪器] 检测到URL变化:', lastUrl, '->', location.href);
                lastUrl = location.href;
                checkUrlAndInitialize();
            }
        }, 500);

        // 添加常规的hashchange监听
        window.addEventListener('hashchange', function() {
            console.log('[车辆跟踪器] hashchange事件触发');
            checkUrlAndInitialize();
        });

        // 添加popstate监听
        window.addEventListener('popstate', function() {
            console.log('[车辆跟踪器] popstate事件触发');
            checkUrlAndInitialize();
        });

        console.log('[车辆跟踪器] 初始化完成，开始监听URL变化');
    }

    // 检查URL并根据需要初始化功能
    function checkUrlAndInitialize() {
        const isCarListPage = location.hash.startsWith('#/carlist');
        console.log('[车辆跟踪器] 检查URL:', location.href, '是否是车辆列表页面:', isCarListPage);

        if (isCarListPage && !isInitialized) {
            console.log('[车辆跟踪器] 检测到车辆列表页面，开始启动跟踪器');
            // 启动跟踪器前等待DOM加载
            setTimeout(startTracker, 1000);
        } else if (!isCarListPage && isInitialized) {
            console.log('[车辆跟踪器] 离开车辆列表页面，停止跟踪器');
            // 停止跟踪器
            stopTracker();
        }
    }

    // 启动跟踪器
    function startTracker() {
        try {
            // 创建并添加面板到页面
            createPanel();

            // 检查新车并高亮显示
            checkForNewCars();

            // 为所有车名添加复制按钮
            addCopyButtons();

            // 定期检查新的车辆元素
            checkInterval = setInterval(addCopyButtons, 2000);

            isInitialized = true;

            showNotification('车辆跟踪器已启动');
        } catch (err) {
            console.error('车辆跟踪器启动失败:', err);
        }
    }

    // 停止跟踪器
    function stopTracker() {
        if (checkInterval) {
            clearInterval(checkInterval);
            checkInterval = null;
        }

        const panel = document.getElementById('carTrackerPanel');
        if (panel) panel.remove();

        isInitialized = false;
    }

    // 创建面板
    function createPanel() {
        // 检查面板是否已存在
        if (document.getElementById('carTrackerPanel')) return;

        // 创建面板容器
        const panel = document.createElement('div');
        panel.id = 'carTrackerPanel';

        // 创建标题栏
        const header = document.createElement('div');
        header.id = 'carTrackerHeader';

        const title = document.createElement('h3');
        title.id = 'carTrackerTitle';
        title.textContent = '车辆跟踪器';

        const toggleButton = document.createElement('button');
        toggleButton.id = 'togglePanelButton';
        toggleButton.textContent = '−';

        header.appendChild(title);
        header.appendChild(toggleButton);

        // 创建添加单个车辆的表单
        const addCarForm = document.createElement('div');
        addCarForm.id = 'addCarForm';

        const addCarInput = document.createElement('input');
        addCarInput.id = 'addCarInput';
        addCarInput.type = 'text';
        addCarInput.placeholder = '输入车辆名称';

        const addButton = document.createElement('button');
        addButton.id = 'addButton';
        addButton.className = 'carTrackerButton';
        addButton.textContent = '添加车辆';

        addCarForm.appendChild(addCarInput);
        addCarForm.appendChild(addButton);

        // 创建内容区
        const content = document.createElement('div');
        content.id = 'carTrackerContent';

        // 创建统计部分
        const statsSection = document.createElement('div');
        statsSection.id = 'carStats';

        // 从localStorage加载车辆
        const savedCars = getSavedCars();
        const totalCars = document.querySelectorAll('.chatgpt').length;
        const newCars = countNewCars(savedCars);

        statsSection.innerHTML = `
            <p><strong>统计信息:</strong></p>
            <ul>
                <li>已保存车辆: ${savedCars.length}</li>
                <li>当前车辆: ${totalCars}</li>
                <li>新车辆: ${newCars} (<span style="color: #ffc107;">以金色高亮显示</span>)</li>
            </ul>
        `;

        // 创建按钮组
        const buttonGroup = document.createElement('div');
        buttonGroup.id = 'carTrackerButtons';

        const toggleListButton = document.createElement('button');
        toggleListButton.id = 'toggleListButton';
        toggleListButton.className = 'carTrackerButton';
        toggleListButton.textContent = '显示已保存车辆';

        const saveButton = document.createElement('button');
        saveButton.id = 'saveButton';
        saveButton.className = 'carTrackerButton';
        saveButton.textContent = '保存当前车辆';

        buttonGroup.appendChild(toggleListButton);
        buttonGroup.appendChild(saveButton);

        // 创建车辆列表(初始隐藏)
        const carList = document.createElement('div');
        carList.id = 'carList';

        if (savedCars.length > 0) {
            carList.innerHTML = '<p><strong>已保存车辆:</strong></p>';
            const list = document.createElement('ul');

            savedCars.forEach(car => {
                const item = document.createElement('li');
                item.textContent = car;
                list.appendChild(item);
            });

            carList.appendChild(list);
        } else {
            carList.innerHTML = '<p>尚未保存任何车辆。</p>';
        }

        // 添加事件监听器
        toggleButton.addEventListener('click', function() {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                toggleButton.textContent = '−';
            } else {
                content.style.display = 'none';
                toggleButton.textContent = '+';
            }
        });

        toggleListButton.addEventListener('click', function() {
            if (carList.style.display === 'none') {
                carList.style.display = 'block';
                toggleListButton.textContent = '隐藏已保存车辆';
            } else {
                carList.style.display = 'none';
                toggleListButton.textContent = '显示已保存车辆';
            }
        });

        saveButton.addEventListener('click', saveCurrentCars);

        // 添加单个车辆的事件处理
        addButton.addEventListener('click', function() {
            addSingleCar();
        });

        addCarInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                addSingleCar();
            }
        });

        // 组装面板
        content.appendChild(statsSection);
        content.appendChild(buttonGroup);
        content.appendChild(carList);

        panel.appendChild(header);
        panel.appendChild(addCarForm);
        panel.appendChild(content);

        // 将面板添加到页面
        document.body.appendChild(panel);
    }

    // 为所有车名添加复制按钮
    function addCopyButtons() {
        const carNameElements = document.querySelectorAll('.state-info p');

        carNameElements.forEach(nameElement => {
            // 检查是否已经添加了复制按钮
            if (nameElement.parentNode.querySelector('.copy-button')) {
                return; // 已经有按钮了，跳过
            }

            const carName = nameElement.textContent.trim();
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制';
            copyButton.className = 'copy-button';
            copyButton.title = '复制车名到剪贴板';

            copyButton.addEventListener('click', function(event) {
                event.stopPropagation(); // 阻止事件冒泡，避免触发车辆的点击事件

                // 复制到剪贴板
                GM_setClipboard(carName);

                // 显示复制成功的视觉反馈
                copyButton.textContent = '已复制';
                copyButton.classList.add('copy-success');

                // 2秒后恢复原样
                setTimeout(function() {
                    copyButton.textContent = '复制';
                    copyButton.classList.remove('copy-success');
                }, 2000);
            });

            // 将按钮添加到车名后面
            nameElement.parentNode.appendChild(copyButton);
        });
    }

    // 检查新车并高亮显示
    function checkForNewCars() {
        const savedCars = getSavedCars();

        // 获取页面上所有车辆元素
        const carElements = document.querySelectorAll('.chatgpt');

        carElements.forEach(element => {
            const nameElement = element.querySelector('.state-info p');
            if (nameElement) {
                const carName = nameElement.textContent.trim();

                // 检查这个车是否已保存
                if (!savedCars.includes(carName)) {
                    // 高亮显示为新车
                    element.classList.add('newCar');
                }
            }
        });
    }

    // 添加单个车辆的功能
    function addSingleCar() {
        const input = document.getElementById('addCarInput');
        const carName = input.value.trim();

        if (carName) {
            // 获取现有的保存车辆
            const savedCars = getSavedCars();

            // 检查是否已经存在
            if (!savedCars.includes(carName)) {
                // 添加到保存列表
                savedCars.push(carName);
                localStorage.setItem('savedCars', JSON.stringify(savedCars));

                // 更新UI
                updateCarList(savedCars);
                updateStats();

                // 查找并移除高亮
                const carElements = document.querySelectorAll('.chatgpt');
                carElements.forEach(element => {
                    const nameElement = element.querySelector('.state-info p');
                    if (nameElement && nameElement.textContent.trim() === carName) {
                        element.classList.remove('newCar');
                    }
                });

                // 清空输入框
                input.value = '';

                // 显示通知
                showNotification(`已添加车辆: ${carName}`);
            } else {
                showNotification(`车辆 ${carName} 已在保存列表中!`);
            }
        } else {
            showNotification('请输入车辆名称!');
        }
    }

    // 保存当前所有车辆
    function saveCurrentCars() {
        // 清除之前保存的车辆
        localStorage.removeItem('savedCars');

        // 获取页面上所有车辆元素
        const carElements = document.querySelectorAll('.chatgpt');
        const currentCars = [];

        carElements.forEach(element => {
            const nameElement = element.querySelector('.state-info p');
            if (nameElement) {
                const carName = nameElement.textContent.trim();
                currentCars.push(carName);

                // 移除高亮
                element.classList.remove('newCar');
            }
        });

        // 保存到localStorage
        localStorage.setItem('savedCars', JSON.stringify(currentCars));

        // 更新UI
        updateCarList(currentCars);
        updateStats();

        // 显示通知
        showNotification('当前车辆已成功保存!');
    }

    // 更新车辆列表UI
    function updateCarList(cars) {
        const carList = document.getElementById('carList');
        if (carList) {
            if (cars.length > 0) {
                carList.innerHTML = '<p><strong>已保存车辆:</strong></p>';
                const list = document.createElement('ul');

                cars.forEach(car => {
                    const item = document.createElement('li');
                    item.textContent = car;
                    list.appendChild(item);
                });

                carList.appendChild(list);
            } else {
                carList.innerHTML = '<p>尚未保存任何车辆。</p>';
            }
        }
    }

    // 更新统计信息
    function updateStats() {
        const statsSection = document.getElementById('carStats');
        if (statsSection) {
            const savedCars = getSavedCars();
            const totalCars = document.querySelectorAll('.chatgpt').length;
            const newCars = countNewCars(savedCars);

            statsSection.innerHTML = `
                <p><strong>统计信息:</strong></p>
                <ul>
                    <li>已保存车辆: ${savedCars.length}</li>
                    <li>当前车辆: ${totalCars}</li>
                    <li>新车辆: ${newCars} (<span style="color: #ffc107;">以金色高亮显示</span>)</li>
                </ul>
            `;
        }
    }

    // 从localStorage获取保存的车辆
    function getSavedCars() {
        const cars = localStorage.getItem('savedCars');
        return cars ? JSON.parse(cars) : [];
    }

    // 计算新车数量
    function countNewCars(savedCars) {
        let count = 0;
        const carElements = document.querySelectorAll('.chatgpt');

        carElements.forEach(element => {
            const nameElement = element.querySelector('.state-info p');
            if (nameElement) {
                const carName = nameElement.textContent.trim();
                if (!savedCars.includes(carName)) {
                    count++;
                }
            }
        });

        return count;
    }

    // 显示通知
    function showNotification(message, duration = 3000) {
        const toast = document.getElementById('notificationToast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('notification-show');

            setTimeout(() => {
                toast.classList.remove('notification-show');
            }, duration);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();