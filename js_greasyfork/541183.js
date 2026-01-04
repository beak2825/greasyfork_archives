// ==UserScript==
// @name         自动点击助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  可以用鼠标选择元素，设置自动点击网页按钮的脚本
// @author       pipiqiang@pipiqiang.cn
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/541183/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/541183/%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置存储键名
    const STORAGE_KEY = 'auto_click_tasks';
    
    // 全局变量
    let isSelecting = false;
    let selectedElement = null;
    let tasks = [];
    let activeIntervals = [];
    let overlay = null;
    let controlPanel = null;

    // 初始化
    function init() {
        loadTasks();
        createControlPanel();
        startSavedTasks();
    }

    // 加载保存的任务
    function loadTasks() {
        const savedTasks = GM_getValue(STORAGE_KEY, '[]');
        try {
            tasks = JSON.parse(savedTasks);
        } catch (e) {
            tasks = [];
        }
    }

    // 保存任务
    function saveTasks() {
        GM_setValue(STORAGE_KEY, JSON.stringify(tasks));
    }

    // 创建控制面板
    function createControlPanel() {
        controlPanel = document.createElement('div');
        controlPanel.id = 'auto-click-panel';
        controlPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #fff;
            border: 2px solid #007bff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
        controlPanel.innerHTML = `
                <div style="
                    background: #007bff;
                    color: white;
                    padding: 10px;
                    border-radius: 6px 6px 0 0;
                    font-weight: bold;
                    cursor: move;
                    user-select: none;
                " id="panel-header">
                    🖱️ 自动点击助手
                    <span style="float: right; cursor: pointer;" id="toggle-panel">−</span>
                </div>
                <div id="panel-content" style="padding: 15px;">
                    <div style="margin-bottom: 15px;">
                        <button id="select-element" style="
                            background: #28a745;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            width: 100%;
                            margin-bottom: 10px;
                        ">选择元素</button>
                        
                        <div style="margin-bottom: 10px;">
                            <label>点击间隔(秒):</label>
                            <input type="number" id="interval-input" value="5" min="1" style="
                                width: 60px;
                                padding: 4px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                margin-left: 10px;
                            ">
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <label>任务名称:</label>
                            <input type="text" id="task-name" placeholder="例如: 刷新按钮" style="
                                width: 100%;
                                padding: 6px;
                                border: 1px solid #ddd;
                                border-radius: 4px;
                                margin-top: 5px;
                            ">
                        </div>
                        
                        <button id="add-task" style="
                            background: #007bff;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            width: 100%;
                        ">添加任务</button>
                    </div>
                    
                    <div id="task-list" style="
                        max-height: 200px;
                        overflow-y: auto;
                        border-top: 1px solid #eee;
                        padding-top: 10px;
                    "></div>
                </div>
        `;
        
        document.body.appendChild(controlPanel);
        
        // 绑定事件
        bindPanelEvents();
        
        // 使面板可拖拽
        makeDraggable();
        
        // 更新任务列表显示
        updateTaskList();
    }

    // 绑定面板事件
    function bindPanelEvents() {
        // 选择元素按钮
        document.getElementById('select-element').addEventListener('click', startElementSelection);
        
        // 添加任务按钮
        document.getElementById('add-task').addEventListener('click', addTask);
        
        // 折叠/展开面板
        document.getElementById('toggle-panel').addEventListener('click', togglePanel);
    }

    // 使面板可拖拽
    function makeDraggable() {
        const header = document.getElementById('panel-header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;
        
        function dragStart(e) {
            if (e.target.id === 'toggle-panel') return;
            
            isDragging = true;
            
            // 记录鼠标按下时的位置
            startX = e.clientX;
            startY = e.clientY;
            
            // 记录面板当前位置
            const rect = controlPanel.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            
            e.preventDefault();
            e.stopPropagation();
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            e.preventDefault();
            e.stopPropagation();
            
            // 计算鼠标移动的距离
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            // 计算新位置
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;

            // 确保面板不会被拖出视窗
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - controlPanel.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - controlPanel.offsetHeight));

            // 更新面板位置
            controlPanel.style.left = `${newLeft}px`;
            controlPanel.style.top = `${newTop}px`;
            controlPanel.style.right = 'auto';
            controlPanel.style.bottom = 'auto';
        }
        
        function dragEnd(e) {
            isDragging = false;
            e.preventDefault();
            e.stopPropagation();
            
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', dragEnd);
        }
        
        header.addEventListener('mousedown', dragStart);
    }

    // 折叠/展开面板
    function togglePanel() {
        const content = document.getElementById('panel-content');
        const toggle = document.getElementById('toggle-panel');
        
        if (content.style.display === 'none') {
            content.style.display = 'block';
            toggle.textContent = '−';
        } else {
            content.style.display = 'none';
            toggle.textContent = '+';
        }
    }

    // 开始元素选择
    function startElementSelection() {
        if (isSelecting) {
            stopElementSelection();
            return;
        }
        
        isSelecting = true;
        document.getElementById('select-element').textContent = '取消选择';
        document.getElementById('select-element').style.background = '#dc3545';
        
        // 创建遮罩层
        createOverlay();
        
        // 添加鼠标事件监听
        document.addEventListener('mouseover', highlightElement);
        document.addEventListener('click', selectElement, true);
        
        // 显示提示
        showToast('请点击要自动点击的元素');
    }

    // 停止元素选择
    function stopElementSelection() {
        isSelecting = false;
        document.getElementById('select-element').textContent = '选择元素';
        document.getElementById('select-element').style.background = '#28a745';
        
        // 移除遮罩层
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
        
        // 移除事件监听
        document.removeEventListener('mouseover', highlightElement);
        document.removeEventListener('click', selectElement, true);
        
        // 清除高亮
        clearHighlight();
    }

    // 创建遮罩层
    function createOverlay() {
        overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 123, 255, 0.1);
            z-index: 9999;
            pointer-events: none;
        `;
        document.body.appendChild(overlay);
    }

    // 高亮元素
    function highlightElement(e) {
        if (!isSelecting || e.target.closest('#auto-click-panel')) return;
        
        clearHighlight();
        e.target.style.outline = '3px solid #007bff';
        e.target.style.backgroundColor = 'rgba(0, 123, 255, 0.2)';
        e.target.setAttribute('data-highlighted', 'true');
    }

    // 清除高亮
    function clearHighlight() {
        const highlighted = document.querySelectorAll('[data-highlighted="true"]');
        highlighted.forEach(el => {
            el.style.outline = '';
            el.style.backgroundColor = '';
            el.removeAttribute('data-highlighted');
        });
    }

    // 选择元素
    function selectElement(e) {
        if (!isSelecting || e.target.closest('#auto-click-panel')) return;
        
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        selectedElement = e.target;
        stopElementSelection();
        
        // 显示选中的元素信息
        const elementInfo = getElementInfo(selectedElement);
        showToast(`已选择: ${elementInfo}`);
        
        // 自动填充任务名称
        const taskNameInput = document.getElementById('task-name');
        if (!taskNameInput.value) {
            taskNameInput.value = elementInfo;
        }
    }

    // 获取元素信息
    function getElementInfo(element) {
        const tagName = element.tagName.toLowerCase();
        const text = element.textContent.trim().substring(0, 20);
        const id = element.id ? `#${element.id}` : '';
        const className = element.className ? `.${element.className.split(' ')[0]}` : '';
        
        return `${tagName}${id}${className}${text ? ` "${text}"` : ''}`;
    }

    // 添加任务
    function addTask() {
        if (!selectedElement) {
            showToast('请先选择一个元素', 'error');
            return;
        }
        
        const interval = parseInt(document.getElementById('interval-input').value);
        const taskName = document.getElementById('task-name').value.trim();
        
        if (!taskName) {
            showToast('请输入任务名称', 'error');
            return;
        }
        
        if (interval < 1) {
            showToast('点击间隔必须大于0秒', 'error');
            return;
        }
        
        // 生成元素选择器
        const selector = generateSelector(selectedElement);
        
        const task = {
            id: Date.now(),
            name: taskName,
            selector: selector,
            interval: interval,
            url: window.location.href,
            domain: window.location.hostname,
            active: false,
            created: new Date().toLocaleString()
        };
        
        tasks.push(task);
        saveTasks();
        updateTaskList();
        
        // 清空输入
        document.getElementById('task-name').value = '';
        selectedElement = null;
        
        showToast(`任务 "${taskName}" 已添加`);
    }

    // 生成元素选择器
    function generateSelector(element) {
        // 优先使用ID
        if (element.id) {
            return `#${element.id}`;
        }

         // 使用标签名和属性
        let selector = element.tagName.toLowerCase();

        // 使用类名
        if (element.className) {
            const classes = element.className.split(' ').filter(c=>c.indexOf(':') === -1).filter(c => c.trim());
            for (const cla of classes) {
                selector+= `.${cla}`;
            }
        }



        // 添加属性选择器
        const attrs = ['data-id', 'data-action', 'name', 'type'];
        for (const attr of attrs) {
            if (element.hasAttribute(attr)) {
                selector += `[${attr}="${element.getAttribute(attr)}"]`;
                break;
            }
        }

        return selector;
    }


    // 更新任务列表
    function updateTaskList() {
        const taskList = document.getElementById('task-list');
        
        if (tasks.length === 0) {
            taskList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">暂无任务</div>';
            return;
        }
        
        const currentDomain = window.location.hostname;
        const relevantTasks = tasks.filter(task => task.domain === currentDomain);
        
        if (relevantTasks.length === 0) {
            taskList.innerHTML = '<div style="color: #666; text-align: center; padding: 20px;">当前域名无任务</div>';
            return;
        }
        
        taskList.innerHTML = '';
        relevantTasks.forEach(task => {
            const taskDiv = document.createElement('div');
            taskDiv.style.cssText = `
                border: 1px solid #ddd;
                border-radius: 4px;
                padding: 10px;
                margin-bottom: 10px;
                background: ${task.active ? '#e8f5e8' : '#f8f9fa'};
            `;
            
            taskDiv.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 5px;">${task.name}</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 8px;">
                    间隔: ${task.interval}秒 | 创建: ${task.created}
                </div>
                <div style="display: flex; gap: 5px;">
                    <button class="toggle-btn" style="
                        background: ${task.active ? '#dc3545' : '#28a745'};
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        ${task.active ? '停止' : '启动'}
                    </button>
                    <button class="delete-btn" style="
                        background: #6c757d;
                        color: white;
                        border: none;
                        padding: 4px 8px;
                        border-radius: 3px;
                        cursor: pointer;
                        font-size: 12px;
                    ">
                        删除
                    </button>
                </div>
            `;
            
            // 绑定事件
            const toggleBtn = taskDiv.querySelector('.toggle-btn');
            const deleteBtn = taskDiv.querySelector('.delete-btn');
            
            toggleBtn.addEventListener('click', () => toggleTask(task.id));
            deleteBtn.addEventListener('click', () => deleteTask(task.id));
            
            taskList.appendChild(taskDiv);
        });
    }

    // 切换任务状态
    function toggleTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        if (task.active) {
            stopTask(taskId);
        } else {
            startTask(taskId);
        }
    }
    
    // 暴露到全局
    window.toggleTask = toggleTask;

    // 启动任务
    function startTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        const element = document.querySelector(task.selector);
        if (!element) {
            showToast(`找不到元素: ${task.selector}`, 'error');
            return;
        }
        
        task.active = true;
        const intervalId = setInterval(() => {
            const currentElement = document.querySelector(task.selector);
            if (currentElement) {
                currentElement.click();
                console.log(`自动点击: ${task.name}`);
            } else {
                console.warn(`元素不存在，停止任务: ${task.name}`);
                stopTask(taskId);
            }
        }, task.interval * 1000);
        
        activeIntervals.push({ taskId, intervalId });
        saveTasks();
        updateTaskList();
        
        showToast(`任务 "${task.name}" 已启动`);
    }

    // 停止任务
    function stopTask(taskId) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;
        
        task.active = false;
        const intervalIndex = activeIntervals.findIndex(item => item.taskId === taskId);
        
        if (intervalIndex !== -1) {
            clearInterval(activeIntervals[intervalIndex].intervalId);
            activeIntervals.splice(intervalIndex, 1);
        }
        
        saveTasks();
        updateTaskList();
        
        showToast(`任务 "${task.name}" 已停止`);
    }

    // 删除任务
    function deleteTask(taskId) {
        if (!confirm('确定要删除这个任务吗？')) return;
        
        stopTask(taskId);
        tasks = tasks.filter(t => t.id !== taskId);
        saveTasks();
        updateTaskList();
        
        showToast('任务已删除');
    }
    
    // 暴露到全局
    window.deleteTask = deleteTask;

    // 启动保存的任务
    function startSavedTasks() {
        const currentDomain = window.location.hostname;
        const relevantTasks = tasks.filter(task => 
            task.domain === currentDomain && task.active
        );
        
        relevantTasks.forEach(task => {
            // 延迟启动，确保页面加载完成
            setTimeout(() => {
                const element = document.querySelector(task.selector);
                if (element) {
                    startTask(task.id);
                } else {
                    console.warn(`页面加载后找不到元素，任务未启动: ${task.name}`);
                    task.active = false;
                    saveTasks();
                }
            }, 2000);
        });
    }

    // 显示提示消息
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
            color: white;
            padding: 12px 20px;
            border-radius: 4px;
            z-index: 10001;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
