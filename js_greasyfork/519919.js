// ==UserScript==
// @name         TAPD批量创建任务
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在TAPD故事页面快速创建关联任务
// @author       GZY
// @match        https://www.tapd.cn/*/prong/stories/view/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519919/TAPD%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/519919/TAPD%E6%89%B9%E9%87%8F%E5%88%9B%E5%BB%BA%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在文件开头添加配置和工具模块
    const CONFIG = {
        API_BASE_URL: 'https://www.tapd.cn',
        DEFAULT_EFFORT: 0.5,
        ANIMATION_DURATION: 300,
        MAX_RETRY_COUNT: 3,
        TASK_TYPES: ['开发', '自测', '联调', '沟通'],
        STORAGE_KEY: 'TAPD_HELPER_SETTINGS',
        DEFAULT_TASK_TYPES: ['沟通', '联调', '自测', '开发'],  // 默认匹配顺序
        DEFAULT_TASKS: [  // 添加默认任务配置
            { suffix: '开发', effortRatio: 1 },
            { suffix: '自测', effortRatio: 0.3 },
            { suffix: '联调', effortRatio: 0.5 }
        ]
    };

    // 日志系统
    const Logger = {
        debug(msg, ...args) {
            console.debug(`[TAPD Helper] ${msg}`, ...args);
        },
        error(msg, ...args) {
            console.error(`[TAPD Helper] ${msg}`, ...args);
        }
    };

    // 统一错误处理
    function handleError(error, context) {
        Logger.error(`Error in ${context}:`, error);
        showNotification('错误', error.message || '操作失败，请稍后重试', true);
    }

    // 防抖函数
    function debounce(fn, delay = 300) {
        let timer = null;
        return function(...args) {
            clearTimeout(timer);
            timer = setTimeout(() => fn.apply(this, args), delay);
        }
    }

    // 输入验证
    function validateTaskInput(task) {
        if (!task.name?.trim()) {
            throw new Error('任务名称不能为空');
        }
        if (task.effort < 0) {
            throw new Error('工时必须是非负数');
        }
    }

    // XSS防护
    function sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // 状态管理
    const TaskManager = {
        state: {
            tasks: [],
            isProcessing: false,
            currentModal: null
        },
        
        setState(newState) {
            this.state = { ...this.state, ...newState };
            this.notifyUpdate();
        },
        
        notifyUpdate() {
            if (this.state.tasks.length > 0) {
                updatePreview(
                    this.state.tasks[0].name,
                    this.state.tasks[0].effort
                );
            }
        }
    };

    // 加载指示器
    function showLoadingIndicator() {
        const existingIndicator = document.querySelector('.loading-indicator');
        if (existingIndicator) {
            return existingIndicator;
        }

        const indicator = document.createElement('div');
        indicator.className = 'loading-indicator';
        indicator.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">处理中...</div>
        `;
        document.body.appendChild(indicator);
        return indicator;
    }

    // 更新加载指示器文本
    function updateLoadingText(text) {
        const loadingIndicator = document.querySelector('.loading-indicator');
        if (loadingIndicator) {
            const textElement = loadingIndicator.querySelector('.loading-text');
            if (textElement) {
                textElement.textContent = text;
            }
        }
    }

    // 操作确认
    function confirmAction(message, tasks = null) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            
            // 获取全局设置中的任务类型
            const settings = getSettings();
            const taskTypes = settings.taskTypes || CONFIG.DEFAULT_TASK_TYPES;
            
            // 修改任务预览的显示方式，使用全局设置的任务类型
            const tasksPreview = tasks ? `
                <div class="confirm-tasks-preview">
                    <h3>处理后的任务状态：</h3>
                    <div class="confirm-tasks-list">
                        ${tasks.map((task, index) => `
                            <div class="confirm-task-item" data-task-index="${index}">
                                <div class="confirm-task-name">${sanitizeHTML(task.name || '未命名任务')}</div>
                                <div class="confirm-task-info">
                                    <div class="task-field ${!task.custom_field_one ? 'task-field-new' : ''}" data-field="type">
                                        <span class="field-label">类型：</span>
                                        <select class="field-select" data-field="type">
                                            ${taskTypes.map(type => 
                                                `<option value="${type}" ${(task.custom_field_one || task.processed_type) === type ? 'selected' : ''}>${type}</option>`
                                            ).join('')}
                                        </select>
                                    </div>
                                    <div class="task-field ${!task.custom_field_two ? 'task-field-new' : ''}" data-field="complexity">
                                        <span class="field-label">复杂度：</span>
                                        <select class="field-select" data-field="complexity">
                                            <option value="1" ${(task.custom_field_two || task.processed_complexity) === '1' ? 'selected' : ''}>1</option>
                                            <option value="3" ${(task.custom_field_two || task.processed_complexity) === '3' ? 'selected' : ''}>3</option>
                                        </select>
                                    </div>
                                    <div class="task-field ${!task.custom_field_three ? 'task-field-new' : ''}" data-field="points">
                                        <span class="field-label">功能点：</span>
                                        <select class="field-select" data-field="points">
                                            <option value="1" ${(task.custom_field_three || task.processed_points) === '1' ? 'selected' : ''}>1</option>
                                            <option value="2" ${(task.custom_field_three || task.processed_points) === '2' ? 'selected' : ''}>2</option>
                                            <option value="3" ${(task.custom_field_three || task.processed_points) === '3' ? 'selected' : ''}>3</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <div class="confirm-tasks-summary">
                        <div>总任务数：${tasks.length}</div>
                        <div>总工时：${tasks.reduce((sum, t) => sum + (t.effort || 0), 0)}</div>
                    </div>
                </div>
            ` : '';

            modal.innerHTML = `
                <div class="confirm-content">
                    <p>${sanitizeHTML(message)}</p>
                    ${tasksPreview}
                    <div class="confirm-buttons">
                        <button class="confirm-no">取消</button>
                        <button class="confirm-yes">确定</button>
                    </div>
                </div>
            `;

            // 添加新的样式
            const styleSheet = document.getElementById('tapd-task-styles');
            if (styleSheet && tasks) {
                styleSheet.textContent += `
                    .confirm-tasks-preview {
                        margin: 15px 0;
                        max-height: 400px;
                        overflow-y: auto;
                    }
                    .confirm-task-item {
                        padding: 12px;
                        border-bottom: 1px solid #e8e8e8;
                        background: #fff;
                    }
                    .confirm-task-name {
                        font-weight: 500;
                        margin-bottom: 8px;
                        color: #333;
                    }
                    .confirm-task-info {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 16px;
                    }
                    .task-field {
                        display: flex;
                        align-items: center;
                        gap: 4px;
                        padding: 4px 8px;
                        border-radius: 4px;
                        background: #f5f5f5;
                    }
                    .task-field-new {
                        background: #e6f7ff;
                        border: 1px solid #91d5ff;
                    }
                    .field-label {
                        color: #666;
                        font-size: 13px;
                    }
                    .field-value {
                        color: #333;
                        font-weight: 500;
                        font-size: 13px;
                    }
                    .confirm-tasks-summary {
                        margin-top: 12px;
                        padding: 12px;
                        background: #f5f5f5;
                        border-radius: 4px;
                        display: flex;
                        justify-content: space-between;
                        font-size: 13px;
                        color: #333;
                    }
                    
                    .field-select {
                        appearance: none;
                        -webkit-appearance: none;
                        border: none;
                        background: transparent;
                        font-size: 13px;
                        color: #333;
                        font-weight: 500;
                        padding: 2px 20px 2px 4px;
                        margin-left: 4px;
                        cursor: pointer;
                        outline: none;
                        position: relative;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
                        background-repeat: no-repeat;
                        background-position: right 4px center;
                        background-size: 12px;
                    }
                    
                    .field-select:hover {
                        color: #1890ff;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231890ff' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
                    }
                    
                    .field-select:focus {
                        box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
                        border-radius: 2px;
                    }
                    
                    .task-field-new .field-select {
                        color: #1890ff;
                        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%231890ff' d='M6 8.825L1.175 4 2.238 2.938 6 6.7l3.763-3.762L10.825 4z'/%3E%3C/svg%3E");
                    }
                    
                    .task-field {
                        min-width: 130px;
                        transition: all 0.3s ease;
                        border: 1px solid transparent;
                    }
                    
                    .task-field:hover {
                        border-color: #e6f7ff;
                        background: #f8f8f8;
                    }
                    
                    .task-field-new {
                        background: #e6f7ff;
                        border: 1px solid #91d5ff;
                    }
                    
                    .task-field-new:hover {
                        background: #e6f7ff;
                        border-color: #69c0ff;
                    }
                    
                    /* 优化选项样式 */
                    .field-select option {
                        padding: 8px 12px;
                        background: white;
                        color: #333;
                    }
                    
                    /* 优化任务信息布局 */
                    .confirm-task-info {
                        display: flex;
                        flex-wrap: wrap;
                        gap: 12px;
                        padding: 4px 0;
                    }
                    
                    /* 优化任务名称样式 */
                    .confirm-task-name {
                        font-weight: 500;
                        margin-bottom: 12px;
                        color: #333;
                        padding: 0 4px;
                    }
                    
                    /* 优化任务项样式 */
                    .confirm-task-item {
                        padding: 16px;
                        border-bottom: 1px solid #e8e8e8;
                        background: #fff;
                        transition: all 0.3s ease;
                    }
                    
                    .confirm-task-item:hover {
                        background: #fafafa;
                    }
                    
                    .confirm-task-item:last-child {
                        border-bottom: none;
                    }
                `;
            }

            // 添加选择框变更事件监听
            if (tasks) {
                const content = modal.querySelector('.confirm-content');
                content.addEventListener('change', (e) => {
                    if (e.target.classList.contains('field-select')) {
                        const taskItem = e.target.closest('.confirm-task-item');
                        const taskIndex = parseInt(taskItem.dataset.taskIndex);
                        const field = e.target.dataset.field;
                        const value = e.target.value;

                        // 更新任务数据
                        if (field === 'type') {
                            tasks[taskIndex].processed_type = value;
                        } else if (field === 'complexity') {
                            tasks[taskIndex].processed_complexity = value;
                        } else if (field === 'points') {
                            tasks[taskIndex].processed_points = value;
                        }
                    }
                });
            }

            const handleClose = (result) => {
                modal.style.animation = 'fadeIn 0.3s ease reverse';
                setTimeout(() => {
                    modal.remove();
                    resolve(result ? tasks : false); // 返回修改后的任务数据
                }, 280);
            };

            modal.querySelector('.confirm-yes').onclick = () => handleClose(true);
            modal.querySelector('.confirm-no').onclick = () => handleClose(false);

            document.body.appendChild(modal);
        });
    }

    // API 模块
    const TAPD = {
        API: {
            async createTask(taskName, taskEffort, beginDate, dueDate) {
                try {
                    const storyId = extractLastNumber(window.location.href);
                    const workspaceId = window.location.href.match(/tapd\.cn\/(\d+)/)?.[1];
                    
                    if (!storyId || !workspaceId) {
                        throw new Error('无法从当前URL中提取必要的ID信息');
                    }
                    
                    validateTaskInput({ name: taskName, effort: taskEffort });
                    
                    const baseUrl = `${CONFIG.API_BASE_URL}/${workspaceId}/prong/tasks/quick_add_task`;
                    const requestUrl = `${baseUrl}/${storyId}?is_from_story_view=true`;
                    
                    const settings = getSettings();
                    const formData = new URLSearchParams({
                        'data[Task][name]': taskName,
                        'data[Task][effort]': taskEffort,
                        'data[Task][owner]': settings.taskOwner || '高子阳'
                    });
                    
                    if (beginDate) formData.append('data[Task][begin]', beginDate);
                    if (dueDate) formData.append('data[Task][due]', dueDate);
                    
                    const response = await fetch(requestUrl, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: formData,
                        credentials: 'include'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`创建任务 "${taskName}" 失败`);
                    }
                    
                    return await response.json();
            } catch (error) {
                    handleError(error, 'createTask');
                    throw error;
                }
            },
            
            async updateTaskField(taskId, field, value) {
                try {
                    const workspaceId = window.location.href.match(/tapd\.cn\/(\d+)/)?.[1];
                    const url = `${CONFIG.API_BASE_URL}/${workspaceId}/prong/tasks/inline_update_intab?r=${Date.now()}`;
                    
                    const formData = new FormData();
                    formData.append('data[id]', taskId);
                    formData.append('data[field]', field);
                    formData.append('data[value]', value);
                    
                    const response = await fetch(url, {
                        method: 'POST',
                        credentials: 'include',
                        body: formData,
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest'
                        }
                    });
                    
                    if (!response.ok) {
                        throw new Error(`更新失败: ${response.statusText}`);
                    }
                    
                    const result = await response.text();
                    if (result.includes('error') || result.includes('失败')) {
                        throw new Error(`更新失败: ${result}`);
                    }
                    
                    Logger.debug(`成功更新任务 ${taskId} 的 ${field} 为 ${value}`);
    } catch (error) {
                    handleError(error, 'updateTaskField');
                    throw error;
    }
}
        }
    };

    // 注入样式
function injectStyles() {
    const styles = `
        .task-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
            overflow-y: auto;
            pointer-events: none;
        }
        .task-modal {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            opacity: 0;
            transform: translateY(-20px);
            animation: modalSlideIn 0.3s ease forwards;
            pointer-events: auto;
        }
        .task-modal h2 {
            margin: 0 0 20px 0;
            color: #333;
        }
        .task-form-group {
            margin-bottom: 15px;
        }
        .task-form-group label {
            display: block;
            margin-bottom: 5px;
            color: #666;
        }
        .task-form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            box-sizing: border-box;
        }
        .task-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }
        .task-modal-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .task-modal-submit {
            background-color: #1890ff;
            color: white;
        }
        .task-modal-submit:hover {
            background-color: #40a9ff;
        }
        .task-modal-cancel {
            background-color: #f0f0f0;
            color: #666;
        }
        .task-modal-cancel:hover {
            background-color: #e8e8e8;
        }
        .task-preview {
            margin-top: 15px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
        }
        .task-preview-item {
            position: relative;
            padding: 10px;
            background: #fff;
            border: 1px solid #e8e8e8;
            border-left: 3px solid #1890ff;
            border-radius: 8px;
            margin-bottom: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s;
        }
        .task-preview-item:hover {
            box-shadow: 0 2px 8px rgba(0,0,0,0.09);
        }
        .task-display-content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .task-name {
            font-size: 13px;
            flex: 1;
            display: flex;
            align-items: center;
        }
        .task-effort {
            font-size: 13px;
            min-width: 60px;
        }
        .task-edit-content {
            flex: 1;
            padding-right: 16px;
        }
        .task-edit-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }
        .task-edit-row:last-child {
            margin-bottom: 0;
        }
        .task-edit-row label {
            min-width: 70px;
            color: #666;
            font-size: 14px;
        }
        .task-edit-input {
            flex: 1;
            padding: 4px 8px;
            border: 1px solid #d9d9d9;
            border-radius: 4px;
            font-size: 14px;
            transition: all 0.3s;
        }
        .task-edit-input:hover {
            border-color: #40a9ff;
        }
        .task-edit-input:focus {
            border-color: #40a9ff;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
            outline: none;
        }
        .effort-input {
            width: 100px !important;
            flex: none !important;
        }
        .task-actions {
            display: flex;
            gap: 8px;
            opacity: 0.6;
            transition: opacity 0.3s;
        }
        .task-preview-item:hover .task-actions {
            opacity: 1;
        }
        .task-action-btn {
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: all 0.3s;
            font-size: 16px;
        }
        .task-action-btn:hover {
            background-color: #f5f5f5;
        }
        .add-task-button {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 12px;
            border: 1px dashed #d9d9d9;
            border-radius: 4px;
            color: #1890ff;
            cursor: pointer;
            transition: all 0.3s;
            margin-top: 16px;
        }
        .add-task-button:hover {
            border-color: #40a9ff;
            background-color: #e6f7ff;
        }
        .create-task-button {
            position: fixed;
            right: 50px;
            bottom: 50px;
            width: 40px;
            height: 40px;
            padding: 0;
            margin: 0;
            border: none;
            background: none;
            cursor: pointer;
            z-index: 9999;
        }
        .create-task-button:hover {
            transform: scale(1.1);
        }
        .create-task-button img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        .date-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            font-family: inherit;
            font-size: inherit;
            color: inherit;
        }

        .date-input:hover {
            border-color: #40a9ff;
        }

        .date-input:focus {
            outline: none;
            border-color: #1890ff;
            box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
        }

        /* 移除日期输入框的默认图标（仅在某些浏览器中生效） */
        .date-input::-webkit-calendar-picker-indicator {
            background: transparent;
            cursor: pointer;
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
        }

        .date-picker-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, calc(-50% - 20px));
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 10001;
            opacity: 0;
            animation: datePickerSlideIn 0.3s ease forwards;
        }

        .date-picker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        }

        .date-picker-content {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .date-picker-select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            width: 80px;
        }

        .date-picker-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
        }

        .date-picker-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .date-picker-confirm {
            background-color: #1890ff;
            color: white;
        }

        .date-picker-cancel {
            background-color: #f0f0f0;
            color: #666;
        }

        /* 弹窗动画修复 */
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        @keyframes modalSlideIn {
            from {
                opacity: 0;
                transform: translateY(0);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes datePickerSlideIn {
            from {
                opacity: 0;
                transform: translate(-50%, calc(-50% - 20px));
            }
            to {
                opacity: 1;
                transform: translate(-50%, -50%);
            }
        }

        /* 加载状态样式 */
        .loading-button {
            position: relative;
            pointer-events: none;
            opacity: 0.7;
        }

        .loading-button::after {
            content: '';
            position: absolute;
            width: 16px;
            height: 16px;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            border: 2px solid #ffffff;
            border-top-color: transparent;
            border-radius: 50%;
            animation: rotate 0.8s linear infinite;
        }

        @keyframes rotate {
            0% { transform: translateY(-50%) rotate(0deg); }
            100% { transform: translateY(-50%) rotate(360deg); }
        }

        /* 优化按钮过渡效果 */
        .task-modal-button {
            transition: all 0.3s ease;
        }

        .task-modal-submit:hover {
            background-color: #40a9ff;
        }

        .task-modal-cancel:hover {
            background-color: #e8e8e8;
        }

        .task-preview-row {
            display: flex;
            align-items: center;
                margin-bottom: 8px;
            }

            .task-preview-row label {
                min-width: 70px;
                margin-right: 8px;
            }

            .task-edit-input {
                flex: 1;
                padding: 4px 8px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: inherit;
            }

            .task-edit-input:hover {
                border-color: #40a9ff;
            }

            .task-edit-input:focus {
                outline: none;
                border-color: #1890ff;
                box-shadow: 0 0 0 2px rgba(24,144,255,0.2);
            }

            .task-edit-input[type="number"] {
                width: 80px;
                flex: none;
            }

            /* 添加菜单样式 */
            .task-menu {
                position: fixed;
                right: 50px;
                bottom: 100px;
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                padding: 8px 0;
                z-index: 9999;
                display: none;
                min-width: 150px;
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.3s, transform 0.3s;
            }

            .task-menu.show {
                display: block;
                opacity: 1;
                transform: translateY(0);
            }

            .task-menu-item {
                padding: 10px 16px;
                cursor: pointer;
                transition: background-color 0.3s;
                color: #333;
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .task-menu-item:hover {
                background-color: #f5f5f5;
            }

            .task-menu-item i {
                font-size: 16px;
                color: #1890ff;
            }

            /* 加载指示器样式 */
            .loading-indicator {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.65);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10001;
                backdrop-filter: blur(2px);
                animation: fadeIn 0.3s ease;
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-top: 3px solid #ffffff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }

            .loading-text {
                color: white;
                font-size: 14px;
                padding: 8px 16px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 4px;
                max-width: 80%;
                text-align: center;
            }

            @keyframes spin {
               0% { transform: rotate(0deg); }
               100% { transform: rotate(360deg); }
            }

            /* 优化确认弹窗样式 */
            .confirm-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.65);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10001;
                backdrop-filter: blur(2px);
                animation: fadeIn 0.3s ease;
            }

            .confirm-content {
                background: white;
                padding: 24px;
                border-radius: 8px;
                min-width: 320px;
                max-width: 90%;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                transform: translateY(-20px);
                animation: slideIn 0.3s ease forwards;
            }

            .confirm-content p {
                margin: 0 0 20px 0;
                font-size: 14px;
                color: #333;
                line-height: 1.5;
            }

            .confirm-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }

            .confirm-yes,
            .confirm-no {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .confirm-yes {
                background-color: #1890ff;
                color: white;
            }

            .confirm-yes:hover {
                background-color: #40a9ff;
            }

            .confirm-no {
                background-color: #f0f0f0;
                color: #666;
            }

            .confirm-no:hover {
                background-color: #d9d9d9;
            }

            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }        

            .task-type-item {
                position: relative;
                margin-bottom: 16px;
            }
            
            .type-error-message {
                color: #ff4d4f;
                font-size: 12px;
                margin-top: 4px;
                margin-bottom: 8px;
            }
            
            .task-type.invalid {
                border-color: #ff4d4f !important;
                background-color: #fff2f0;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.id = 'tapd-task-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // 创建弹窗
    function createModal() {
        const modal = document.createElement('div');
        modal.className = 'task-modal-overlay';
        modal.innerHTML = `
            <div class="task-modal">
                <h2>批量创建任务</h2>
                <form id="taskForm">
                    <div class="task-form-group">
                        <label for="taskName">任务名称（必填->主任务名称）</label>
                        <input type="text" id="taskName" required placeholder="请输入主任务名称">
                    </div>
                    <div class="task-form-group">
                        <label for="taskEffort">开发工时（必填->主任务工时）</label>
                        <input type="number" id="taskEffort" required placeholder="请输入开发工时" min="0" step="0.5">
                    </div>
                    <div class="task-form-group">
                        <label for="taskBegin">开始时间（可选）</label>
                        <input type="text" id="taskBegin" class="date-input" placeholder="点击选择开始时间" readonly>
                    </div>
                    <div class="task-form-group">
                        <label for="taskDue">结束时间（可选）</label>
                        <input type="text" id="taskDue" class="date-input" placeholder="点击选择结束时间" readonly>
                    </div>

                    <div class="task-preview">
                        <div class="preview-title">将创建以下任务：</div>
                        <div id="taskPreview"></div>
                    </div>

                    <div class="task-modal-buttons">
                        <button type="button" class="task-modal-button task-modal-cancel">取消</button>
                        <button type="submit" class="task-modal-button task-modal-submit">创建全部</button>
                    </div>
                </form>
            </div>
        `;
        return modal;
    }

    // 创建按钮
    function createButton() {
        const button = document.createElement('button');
        button.className = 'create-task-button';
        button.innerHTML = `
            <img src="https://wlpublicmedias-cdn.acewill.net/superapp/image//2024/11/29/d528be5e6ae6414857efefa662ae9015111614.jpeg" alt="菜单">
        `;

        const menu = document.createElement('div');
        menu.className = 'task-menu';
        menu.innerHTML = `
            <div class="task-menu-item" data-action="create">
                <i>🚀</i>
                <span>快速创建任务</span>
            </div>
            <div class="task-menu-item" data-action="process">
                <i>⚡</i>
                <span>一键处理任务</span>
            </div>
            <div class="task-menu-item" data-action="settings">
                <i>⚙️</i>
                <span>全局设置</span>
            </div>
        `;

        document.body.appendChild(button);
        document.body.appendChild(menu);

        // 点击按钮显示/隐藏菜单
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('show');
        });

        // 点击菜单项
        menu.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.task-menu-item');
            if (!menuItem) return;

            const action = menuItem.dataset.action;
            menu.classList.remove('show');

            if (action === 'create') {
                showTaskModal();
            } else if (action === 'process') {
                processAllTasks();
            } else if (action === 'settings') {
                showSettingsModal();
            }
        });

        // 点击其他区域关闭菜单
        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });

        return button;
    }

    // 更新预览
    function updatePreview(taskName, taskEffort, beginDate, dueDate) {
        if (!taskName) {
            document.getElementById('taskPreview').innerHTML = '';
            return;
        }

        // 初始化时创建默认任务
        if (!window.customTasks) {
            const settings = getSettings();
            // 使用设置中的任务配置或默认配置
            const tasksConfig = settings.defaultTasks || CONFIG.DEFAULT_TASKS;
            window.customTasks = tasksConfig.map(task => ({
                name: `${taskName}-${task.suffix}`,
                effort: taskEffort * task.effortRatio,
                isEditing: false,
                isDefault: true
            }));
        } else {
            // 只更新默认任务的属性
            const settings = getSettings();
            const tasksConfig = settings.defaultTasks || CONFIG.DEFAULT_TASKS;
            window.customTasks.forEach((task, index) => {
                if (task.isDefault && index < tasksConfig.length) {
                    const defaultTask = tasksConfig[index];
                    task.name = `${taskName}-${defaultTask.suffix}`;
                    task.effort = taskEffort * defaultTask.effortRatio;
                }
            });
        }

        let tasks = window.customTasks;

        function renderTasks() {
            const previewHtml = tasks.map((task, index) => `
                <div class="task-preview-item">
                    ${task.isEditing ? `
                        <div class="task-edit-content">
                            <div class="task-edit-row">
                                <label>名称：</label>
                                <input type="text"
                                    class="task-edit-input"
                                    data-index="${index}"
                                    data-type="name"
                                    value="${task.name}">
                            </div>
                            <div class="task-edit-row">
                                <label>工时：</label>
                                <input type="number"
                                    class="task-edit-input effort-input"
                                    data-index="${index}"
                                    data-type="effort"
                                    value="${task.effort}"
                                    min="0"
                                    step="0.1">
                            </div>
                        </div>
                    ` : `
                        <div class="task-display-content">
                            <div class="task-name">名称：${task.name}</div>
                            <div class="task-effort">工时：${task.effort}</div>
                        </div>
                    `}
                    <div class="task-actions">
                        <span class="task-action-btn edit-btn" onclick="handleEdit(${index})" title="编辑">✏️</span>
                        <span class="task-action-btn delete-btn" onclick="handleDelete(${index})" title="删除">🗑️</span>
                        <span class="task-action-btn copy-btn" onclick="handleCopy(${index})" title="复制">📋</span>
                    </div>
                </div>
            `).join('');

            const addButtonHtml = `
                <div class="add-task-button" onclick="handleAdd()">
                    <span>+ 添加任务</span>
                </div>
            `;

            document.getElementById('taskPreview').innerHTML = previewHtml + addButtonHtml;
        }

        // 编辑任务
        window.handleEdit = (index) => {
            tasks[index].isEditing = !tasks[index].isEditing;
            renderTasks();
        };

        // 删除任务
        window.handleDelete = (index) => {
            if (tasks[index].isDefault) {
                showNotification('提示', '默认任务不能删除', true);
                return;
            }
            tasks = tasks.filter((_, i) => i !== index);
            window.customTasks = tasks;
            renderTasks();
        };

        // 复制任务
        window.handleCopy = (index) => {
            const newTask = {
                ...tasks[index],
                name: tasks[index].name + '-副本',
                isDefault: false,
                isEditing: false
            };
            tasks.push(newTask);
            window.customTasks = tasks;
            renderTasks();
        };

        // 添加新任务
        window.handleAdd = () => {
            const newTask = {
                name: taskName + '-新任务',
                effort: taskEffort,
                isEditing: true,
                isDefault: false
            };
            tasks.push(newTask);
            window.customTasks = tasks;
            renderTasks();
        };

        // 初始渲染
        renderTasks();

        // 监听输入变化
        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('task-edit-input')) {
                const index = parseInt(e.target.dataset.index);
                const type = e.target.dataset.type;
                const value = e.target.value;

                if (type === 'name') {
                    tasks[index].name = value;
                } else if (type === 'effort') {
                    tasks[index].effort = parseFloat(value) || 0;
                }
                tasks[index].isEditing = false;
                renderTasks();
            }
        });

        return tasks;
    }
    // 批量创建任务
    async function batchCreateTasks(tasks, beginDate, dueDate) {
        const loadingIndicator = showLoadingIndicator();
        try {
            TaskManager.setState({ isProcessing: true });
            
            for (const task of tasks) {
                updateLoadingText(`创建任务 ${task.name} 中...`);
                await TAPD.API.createTask(task.name, task.effort, beginDate, dueDate);
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            updateLoadingText('所有任务创建完成！');
            showNotification('成功', '所有任务创建完成！');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            handleError(error, 'batchCreateTasks');
        } finally {
            TaskManager.setState({ isProcessing: false });
            loadingIndicator.remove();
        }
    }

    // 显示任务创建弹窗
    function showTaskModal() {
        const modal = createModal();
        document.body.appendChild(modal);

        const taskNameInput = modal.querySelector('#taskName');
        const taskEffortInput = modal.querySelector('#taskEffort');
        const taskBeginInput = modal.querySelector('#taskBegin');
        const taskDueInput = modal.querySelector('#taskDue');

        // 更新预览处理
        function updatePreviewHandler() {
            const taskName = taskNameInput.value.trim();
            if (!taskName) {
                document.getElementById('taskPreview').innerHTML = '';
                return;
            }

            updatePreview(
                taskName,
                taskEffortInput.value,
                taskBeginInput.value,
                taskDueInput.value
            );
        }

        // 添加输入事件监听
        taskNameInput.addEventListener('input', updatePreviewHandler);
        taskEffortInput.addEventListener('input', updatePreviewHandler);
        taskBeginInput.addEventListener('change', updatePreviewHandler);
        taskDueInput.addEventListener('change', updatePreviewHandler);

        // 添加日期选择器点击事件
        taskBeginInput.addEventListener('click', () => {
            createDatePickerModal(taskBeginInput.value, (date) => {
                taskBeginInput.value = date;
                updatePreviewHandler();
            });
        });

        taskDueInput.addEventListener('click', () => {
            createDatePickerModal(taskDueInput.value, (date) => {
                taskDueInput.value = date;
                updatePreviewHandler();
            });
        });

        // 表单提交处理
        const form = modal.querySelector('#taskForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
        const loadingIndicator = showLoadingIndicator();

            const submitButton = form.querySelector('.task-modal-submit');
            submitButton.textContent = '创建中...';
            updateLoadingText('创建任务中...');
            submitButton.disabled = true;

            try {
                const taskName = taskNameInput.value.trim();
                const taskEffort = taskEffortInput.value;
                const beginDate = taskBeginInput.value;
                const dueDate = taskDueInput.value;

                // 获取预览中最新的任务数据
                const tasks = updatePreview(taskName, taskEffort, beginDate, dueDate);
                modal.remove();
                await batchCreateTasks(tasks, beginDate, dueDate);
            } catch (error) {
                submitButton.textContent = '创建全部';
                submitButton.disabled = false;
                showNotification('错误', error.message, true);
            }
        });

        // 取消按钮处理
        const cancelButton = modal.querySelector('.task-modal-cancel');
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });

        // 点击遮罩层关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 从 URL 中提取最后一个数字序列
    function extractLastNumber(url) {
        const matches = url.match(/(\d+)(?!.*\d)/);
        return matches ? matches[0] : null;
    }

    // 显示通知
    function showNotification(title, message, isError = false) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translate(-50%, 0);
            padding: 12px 24px;
            background-color: ${isError ? '#ff4d4f' : '#52c41a'};
            color: white;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            min-width: 200px;
            text-align: center;
            opacity: 0;
            animation: notificationSlideIn 0.3s ease forwards;
        `;
        notification.textContent = `${title}: ${message}`;
        document.body.appendChild(notification);

        // 添加动画样式
        const styleSheet = document.getElementById('tapd-task-styles');
        if (styleSheet) {
            styleSheet.textContent += `
                @keyframes notificationSlideIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                }
                @keyframes notificationSlideOut {
                    from {
                        opacity: 1;
                        transform: translate(-50%, 0);
                    }
                    to {
                        opacity: 0;
                        transform: translate(-50%, -20px);
                    }
                }
            `;
        }

        setTimeout(() => {
            notification.style.animation = 'notificationSlideOut 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 添加日期选择器弹窗创建函数
    function createDatePickerModal(initialDate, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'date-picker-overlay';

        const modal = document.createElement('div');
        modal.className = 'date-picker-modal';

        const currentDate = initialDate ? new Date(initialDate) : new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();

        // 创建年份选项（前后5年）
        const yearOptions = Array.from({ length: 11 }, (_, i) => year - 5 + i)
            .map(y => `<option value="${y}" ${y === year ? 'selected' : ''}>${y}年</option>`)
            .join('');

        // 创建月份选项
        const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)
            .map(m => `<option value="${m}" ${m === month ? 'selected' : ''}>${m}月</option>`)
            .join('');

        // 创建日期选项
        const daysInMonth = new Date(year, month, 0).getDate();
        const dayOptions = Array.from({ length: daysInMonth }, (_, i) => i + 1)
            .map(d => `<option value="${d}" ${d === day ? 'selected' : ''}>${d}日</option>`)
            .join('');

        modal.innerHTML = `
            <div class="date-picker-content">
                <select class="date-picker-select" id="yearSelect">${yearOptions}</select>
                <select class="date-picker-select" id="monthSelect">${monthOptions}</select>
                <select class="date-picker-select" id="daySelect">${dayOptions}</select>
            </div>
            <div class="date-picker-buttons">
                <button class="date-picker-button date-picker-cancel">取消</button>
                <button class="date-picker-button date-picker-confirm">确定</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 更新日期选项
        function updateDays() {
            const yearSelect = modal.querySelector('#yearSelect');
            const monthSelect = modal.querySelector('#monthSelect');
            const daySelect = modal.querySelector('#daySelect');

            const selectedYear = parseInt(yearSelect.value);
            const selectedMonth = parseInt(monthSelect.value);
            const daysInSelectedMonth = new Date(selectedYear, selectedMonth, 0).getDate();

            const currentDay = parseInt(daySelect.value);
            daySelect.innerHTML = Array.from({ length: daysInSelectedMonth }, (_, i) => i + 1)
                .map(d => `<option value="${d}" ${d === currentDay && d <= daysInSelectedMonth ? 'selected' : ''}>${d}日</option>`)
                .join('');
        }

        // 事件监听
        modal.querySelector('#yearSelect').addEventListener('change', updateDays);
        modal.querySelector('#monthSelect').addEventListener('change', updateDays);

        // 修改关闭函数
        function closeDatePicker() {
            overlay.style.animation = 'fadeIn 0.3s ease reverse';
            modal.style.animation = 'slideIn 0.3s ease reverse';

            setTimeout(() => {
                overlay.remove();
            }, 300);
        }

        // 修改事件监听
        modal.querySelector('.date-picker-confirm').addEventListener('click', () => {
            const year = modal.querySelector('#yearSelect').value;
            const month = modal.querySelector('#monthSelect').value.padStart(2, '0');
            const day = modal.querySelector('#daySelect').value.padStart(2, '0');
            onConfirm(`${year}-${month}-${day}`);
            closeDatePicker();
        });

        modal.querySelector('.date-picker-cancel').addEventListener('click', closeDatePicker);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeDatePicker();
            }
        });
    }

    // 处理任务函数
    async function processAllTasks() {
        const loadingIndicator = showLoadingIndicator();
        try {
            TaskManager.setState({ isProcessing: true });
            Logger.debug('开始获取任务列表...');
            updateLoadingText('获取任务列表中...');
            
            const storyId = extractLastNumber(window.location.href);
            const workspaceId = window.location.href.match(/tapd\.cn\/(\d+)/)?.[1];

            if (!storyId || !workspaceId) {
                throw new Error('无法从当前URL中提取必要的ID信息');
            }

            // 存储所有页面的任务
            let allTasks = [];
            let currentPage = 1;
            let totalPages = 1;

            // 获取第一页并检查是否有分页
            const firstPageUrl = `https://www.tapd.cn/${workspaceId}/prong/tasks/task_list_common?story_id=${storyId}&page=1&time=${Date.now()}`;
            const firstPageResponse = await fetch(firstPageUrl, {
                credentials: 'include'
            });

            if (!firstPageResponse.ok) {
                throw new Error('获取任务列表失败');
            }

            const firstPageHtml = await firstPageResponse.text();
            const firstPageDoc = new DOMParser().parseFromString(firstPageHtml, 'text/html');

            // 检查是否有分页并获取总页数
            const pagerDiv = firstPageDoc.querySelector('#simple_pager_div');
            if (pagerDiv && pagerDiv.innerHTML.trim()) {
                const currentPageSpan = pagerDiv.querySelector('.current-page');
                if (currentPageSpan) {
                    const pageInfo = currentPageSpan.textContent.trim().split('/');
                    if (pageInfo.length === 2) {
                        totalPages = parseInt(pageInfo[1]);
                        Logger.debug(`检测到分页,共 ${totalPages} 页`);
                    }
                }
            }

            // 解析第一页的任务
            const firstPageTasks = parseTasks(firstPageDoc);
            allTasks = allTasks.concat(firstPageTasks);

            // 如果有多页,获取剩余页面的任务
            if (totalPages > 1) {
                for (let page = 2; page <= totalPages; page++) {
                    updateLoadingText(`获取第 ${page}/${totalPages} 页任务列表...`);
                    Logger.debug(`正在获取第 ${page} 页`);
                    
                    const pageUrl = `https://www.tapd.cn/${workspaceId}/prong/tasks/task_list_common?story_id=${storyId}&page=${page}&time=${Date.now()}`;
                    const pageResponse = await fetch(pageUrl, {
                        credentials: 'include'
                    });

                    if (!pageResponse.ok) {
                        throw new Error(`获取第 ${page} 页任务列表失败`);
                    }

                    const pageHtml = await pageResponse.text();
                    const pageDoc = new DOMParser().parseFromString(pageHtml, 'text/html');
                    const pageTasks = parseTasks(pageDoc);
                    allTasks = allTasks.concat(pageTasks);

                    // 添加延迟避免请求过快
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }

            // 检查是否有需要处理的任务
            const fieldMapping = window.TAPD_FIELD_MAPPING;
            if (!fieldMapping) {
                throw new Error('未找到字段映射信息');
            }

            const tasksNeedProcess = allTasks.some(task => 
                !task[fieldMapping.taskType] || 
                !task[fieldMapping.complexity] || 
                !task[fieldMapping.points]
            );

            if (!tasksNeedProcess) {
                showNotification('提示', '没有需要处理的任务');
                return;
            }

            // 获取设置和任务类型配置
            const settings = getSettings();
            const taskTypes = settings.taskTypes || CONFIG.DEFAULT_TASK_TYPES;

            // 预处理任务数据
            const processedTasks = allTasks.filter(task => 
                (!task[fieldMapping.taskType] || 
                 !task[fieldMapping.complexity] || 
                 !task[fieldMapping.points]) && task.name
            ).map(task => {
                const result = { ...task };
                
                // 计算任务类型
                if (!task[fieldMapping.taskType]) {
                    const name = (task.name || '').toLowerCase();
                    let matched = false;
                    for (const type of taskTypes) {
                        const typePattern = type.toLowerCase();
                        if (name.includes(typePattern)) {
                            result.processed_type = type;
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        result.processed_type = '开发';
                        Logger.debug(`任务 "${task.name}" 未匹配到任何类型，使用默认类型：开发`);
                    }
                }
                
                // 计算复杂度
                if (!task[fieldMapping.complexity]) {
                    result.processed_complexity = task.effort > 2 ? '3' : '1';
                }
                
                // 计算功能点数
                if (!task[fieldMapping.points]) {
                    result.processed_points = '1';
                }
                
                return result;
            });

            // 检查是否有有效的任务需要处理
            if (processedTasks.length === 0) {
                showNotification('提示', '没有需要处理的有效任务');
                return;
            }

            // 显示确认弹窗
            const updatedTasks = await confirmAction(
                `发现 ${processedTasks.length} 个任务需要处理，是否继续？`, 
                processedTasks
            );

            if (!updatedTasks) {
                return;
            }

            // 更新任务字段
            const newLoadingIndicator = showLoadingIndicator();
            Logger.debug('开始更新任务字段...');
            updateLoadingText('更新任务字段中...');
            await updateTaskFields(updatedTasks);
            
            Logger.debug('所有任务字段更新完成');
            updateLoadingText('任务字段更新完成');
            showNotification('成功', '所有任务字段已更新');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);

        } catch (error) {
            handleError(error, 'processAllTasks');
        } finally {
            TaskManager.setState({ isProcessing: false });
            if (document.querySelector('.loading-indicator')) {
                document.querySelector('.loading-indicator').remove();
            }
        }
    }

    // 新增解析任务的辅助函数
    function parseTasks(doc) {
        const tasks = [];
        const form = doc.querySelector('#quick_add_task');
        if (!form) return tasks;

        // 从表头获取字段映射
        const fieldMapping = {};
        const headers = form.querySelectorAll('th[data-editable-field]');
        headers.forEach(header => {
            const field = header.getAttribute('data-editable-field');
            if (field === 'custom_field_one' || field === 'custom_field_two' || field === 'custom_field_three' || field === 'custom_field_five' || field === 'custom_field_six' ) {
                const title = header.querySelector('a')?.textContent?.trim() || '';
                fieldMapping[title] = field;
            }
        });

        // 记录字段映射到全局配置
        if (!window.TAPD_FIELD_MAPPING) {
            window.TAPD_FIELD_MAPPING = {
                taskType: fieldMapping['任务类型'] || 'custom_field_one',
                complexity: fieldMapping['复杂度'] || 'custom_field_two',
                points: fieldMapping['功能点数'] || 'custom_field_three'
            };
            Logger.debug('字段映射:', window.TAPD_FIELD_MAPPING);
        }

        const rows = form.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const task = {
                id: row.getAttribute('id'),
                name: row.querySelector('.td_name a')?.textContent?.trim(),
                status: row.querySelector('.checkable-capsule-item')?.textContent?.trim(),
                effort: parseFloat(row.querySelector('.td_effort')?.textContent) || 0,
                progress: row.querySelector('.td_progress')?.textContent?.trim(),
                owner: row.querySelector('.td_owner')?.textContent?.trim(),
                begin: row.querySelector('.td_begin')?.textContent?.trim(),
                due: row.querySelector('.td_due')?.textContent?.trim(),
                created: row.querySelector('.td_created')?.textContent?.trim(),
                effort_completed: parseFloat(row.querySelector('.td_effort_completed')?.textContent) || 0,
                exceed: parseFloat(row.querySelector('.td_exceed')?.textContent) || 0,
                completed: row.querySelector('.td_completed')?.textContent?.trim()
            };

            // 使用字段映射获取自定义字段值
            task[window.TAPD_FIELD_MAPPING.taskType] = row.querySelector(`.td_${window.TAPD_FIELD_MAPPING.taskType}`)?.textContent?.trim();
            task[window.TAPD_FIELD_MAPPING.complexity] = row.querySelector(`.td_${window.TAPD_FIELD_MAPPING.complexity}`)?.textContent?.trim();
            task[window.TAPD_FIELD_MAPPING.points] = row.querySelector(`.td_${window.TAPD_FIELD_MAPPING.points}`)?.textContent?.trim();

            tasks.push(task);
        });

        return tasks;
    }

    // 初始化
    function init() {
        injectStyles();
        createButton();
    }

    // 确保 DOM 加载完成后再初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 在processAllTasks函数中,解析完tasks数据后添加:

    async function updateTaskFields(tasks) {
        const fieldMapping = window.TAPD_FIELD_MAPPING;
        if (!fieldMapping) {
            throw new Error('未找到字段映射信息');
        }

        for(const task of tasks) {
            try {
                // 1. 处理任务类型
                if(!task[fieldMapping.taskType]) {
                    const taskType = task.processed_type || '开发';
                    await updateTaskField(task.id, fieldMapping.taskType, taskType);
                    Logger.debug(`设置任务 "${task.name}" 的类型为：${taskType}`);
                }

                // 2. 处理复杂度
                if(!task[fieldMapping.complexity]) {
                    const complexity = task.processed_complexity || (task.effort > 2 ? '3' : '1');
                    await updateTaskField(task.id, fieldMapping.complexity, complexity);
                }

                // 3. 处理功能点数
                if(!task[fieldMapping.points]) {
                    const points = task.processed_points || '1';
                    await updateTaskField(task.id, fieldMapping.points, points);
                }

            } catch(error) {
                console.error(`更新任务 ${task.id} 失败:`, error);
                showNotification('错误', `更新任务 ${task.id} 失败`, true);
            }
        }
    }

    // 发送更新请求的函数
    async function updateTaskField(taskId, field, value) {

        const workspaceId = window.location.href.match(/tapd\.cn\/(\d+)/)?.[1];
        const url = `https://www.tapd.cn/${workspaceId}/prong/tasks/inline_update_intab?r=${Date.now()}`;

        const formData = new FormData();
        formData.append('data[id]', taskId);
        formData.append('data[field]', field);
        formData.append('data[value]', value);

        const response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            body: formData,
            headers: {
                // 不需要设置 Content-Type,让浏览器自动处理
                'X-Requested-With': 'XMLHttpRequest'
            }
        });

        if (!response.ok) {
            throw new Error(`更新失败: ${response.statusText}`);
        }

        const result = await response.text();
        if(result.includes('error') || result.includes('失败')) {
            throw new Error(`更新失败: ${result}`);
        }

        console.log(`成功更新任务 ${taskId} 的 ${field} 为 ${value}`);
    }

    // 获取设置
    function getSettings() {
        const settings = localStorage.getItem(CONFIG.STORAGE_KEY);
        return settings ? JSON.parse(settings) : {
            taskOwner: '高子阳',
            defaultTasks: CONFIG.DEFAULT_TASKS,  // 使用 CONFIG 中的默认配置
            taskTypes: CONFIG.DEFAULT_TASK_TYPES
        };
    }

    // 保存设置
    function saveSettings(settings) {
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(settings));
    }

    // 创建设置弹窗
    function showSettingsModal() {
        const currentSettings = getSettings();
        
        const modal = document.createElement('div');
        modal.className = 'task-modal-overlay';
        modal.innerHTML = `
            <div class="task-modal settings-modal">
                <h2>全局设置</h2>
                <form id="settingsForm">
                    <div class="task-form-group">
                        <label for="taskOwner">默认任务负责人</label>
                        <input 
                            type="text" 
                            id="taskOwner" 
                            required 
                            placeholder="请输入任务负责人"
                            value="${currentSettings.taskOwner || ''}"
                        >
                    </div>
                    
                    <!-- 添加任务类型顺序设置 -->
                    <div class="task-form-group">
                        <label>任务类型匹配顺序</label>
                        <div id="taskTypesContainer">
                            ${currentSettings.taskTypes.map((type, index) => `
                                <div class="task-type-item" data-index="${index}">
                                    <div class="task-input-group">
                                        <span class="task-type-order">${index + 1}</span>
                                        <input 
                                            type="text" 
                                            class="task-type" 
                                            placeholder="任务类型"
                                            value="${type}"
                                            required
                                        >
                                        <button type="button" class="move-type-btn" onclick="handleMoveType(${index}, 'up')" ${index === 0 ? 'disabled' : ''}>↑</button>
                                        <button type="button" class="move-type-btn" onclick="handleMoveType(${index}, 'down')" ${index === currentSettings.taskTypes.length - 1 ? 'disabled' : ''}>↓</button>
                                        <button type="button" class="remove-type-btn" onclick="handleRemoveType(${index})">❌</button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button type="button" class="add-type-btn" onclick="handleAddType()">
                            + 添加任务类型
                        </button>
                    </div>

                    <!-- 原有的默认任务配置 -->
                    <div class="task-form-group">
                        <label>默认任务配置</label>
                        <div id="defaultTasksContainer">
                            ${currentSettings.defaultTasks.map((task, index) => `
                                <div class="default-task-item" data-index="${index}">
                                    <div class="task-input-group">
                                        <input 
                                            type="text" 
                                            class="task-suffix" 
                                            placeholder="任务后缀"
                                            value="${task.suffix}"
                                            required
                                        >
                                        <input 
                                            type="number" 
                                            class="task-ratio" 
                                            placeholder="工时比例"
                                            value="${task.effortRatio}"
                                            step="0.1"
                                            min="0"
                                            required
                                        >
                                        ${index > 0 ? `
                                            <button type="button" class="remove-task-btn" onclick="handleRemoveTask(${index})">
                                                ❌
                                            </button>
                                        ` : `
                                            <div class="remove-task-btn-placeholder"></div>
                                        `}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button type="button" class="add-default-task-btn" onclick="handleAddDefaultTask()">
                            + 添加默认任务
                        </button>
                    </div>
                    <div class="settings-info">
                        <p>👉 设置将保存在浏览器本地存储中</p>
                        <p>👉 这些设置将应用于所有新创建的任务</p>
                    </div>
                    <div class="task-modal-buttons">
                        <button type="button" class="task-modal-button task-modal-cancel">取消</button>
                        <button type="submit" class="task-modal-button task-modal-submit">保存设置</button>
                    </div>
                </form>
            </div>
        `;

        // 添加样式
        const styleSheet = document.getElementById('tapd-task-styles');
        if (styleSheet) {
            styleSheet.textContent += `
                .settings-modal {
                    max-width: 600px;
                }
                .default-task-item {
                    margin-bottom: 10px;
                }
                .task-input-group {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                }
                .task-suffix {
                    flex: 2;
                }
                .task-ratio {
                    flex: 1;
                    width: 80px;
                }
                .remove-task-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    font-size: 14px;
                }
                .add-default-task-btn {
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                    text-align: center;
                }
                .add-default-task-btn:hover {
                    background: #e0e0e0;
                }
                .remove-task-btn-placeholder {
                    width: 29px;
                    height: 28px;
                }
                .task-type-item {
                    margin-bottom: 10px;
                }
                .task-type-order {
                    width: 24px;
                    text-align: center;
                    color: #666;
                }
                .move-type-btn {
                    padding: 4px 8px;
                    background: none;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    cursor: pointer;
                }
                .move-type-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
                .move-type-btn:not(:disabled):hover {
                    background: #f0f0f0;
                }
                .add-type-btn {
                    margin-top: 10px;
                    padding: 8px 16px;
                    background: #f0f0f0;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    width: 100%;
                    text-align: center;
                }
                
                .add-type-btn:hover {
                    background: #e0e0e0;
                }
                
                .remove-type-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 5px;
                    font-size: 14px;
                    opacity: 0.7;
                }
                
                .remove-type-btn:hover:not(:disabled) {
                    opacity: 1;
                }
                
                .remove-type-btn:disabled {
                    cursor: not-allowed;
                    opacity: 0.3;
                }
            `;
        }

        document.body.appendChild(modal);

        // 添加输入事件监听
        function addInputListener(input) {
            input.addEventListener('input', function() {
                const item = this.closest('.task-type-item');
                const index = parseInt(item.dataset.index);
                validateTaskTypeInput(this, index + 1);
                updateTaskTypeOrder();
            });
        }

        // 为所有现有的任务类型输入框添加监听
        const taskTypeInputs = modal.querySelectorAll('.task-type');
        taskTypeInputs.forEach(input => addInputListener(input));

        window.validateTaskTypeInput = function(input, index) {
            const item = input.closest('.task-type-item');
            const inputGroup = item.querySelector('.task-input-group');
            const isEmpty = !input.value.trim();
            input.classList.toggle('invalid', isEmpty);
            
            // 移除旧的错误提示
            const oldErrorDiv = item.querySelector('.type-error-message');
            if (oldErrorDiv) {
                oldErrorDiv.remove();
            }
            
            // 添加新的错误提示
            if (isEmpty) {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'type-error-message';
                errorDiv.textContent = `序号 ${index} 的任务类型不能为空`;
                // 将错误提示插入到 input-group 后面
                inputGroup.insertAdjacentElement('afterend', errorDiv);
            }
        };

        // 添加任务按钮处理函数
        window.handleAddDefaultTask = () => {
            const container = document.getElementById('defaultTasksContainer');
            const index = container.children.length;
            const newTaskHtml = `
                <div class="default-task-item" data-index="${index}">
                    <div class="task-input-group">
                        <input 
                            type="text" 
                            class="task-suffix" 
                            placeholder="任务后缀"
                            required
                        >
                        <input 
                            type="number" 
                            class="task-ratio" 
                            placeholder="工时比例"
                            step="0.1"
                            min="0"
                            required
                        >
                        <button type="button" class="remove-task-btn" onclick="handleRemoveTask(${index})">
                            ❌
                        </button>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', newTaskHtml);
        };

        // 删除任务按钮处理函数
        window.handleRemoveTask = (index) => {
            const container = document.getElementById('defaultTasksContainer');
            const taskItem = container.querySelector(`[data-index="${index}"]`);
            if (taskItem) {
                taskItem.remove();
            }
        };

        // 添加移动任务类型顺序的处理函数
        window.handleMoveType = (index, direction) => {
            const container = document.getElementById('taskTypesContainer');
            const items = container.querySelectorAll('.task-type-item');
            
            if (direction === 'up' && index > 0) {
                container.insertBefore(items[index], items[index - 1]);
            } else if (direction === 'down' && index < items.length - 1) {
                container.insertBefore(items[index + 1], items[index]);
            }
            
            // 更新序号和按钮状态
            updateTaskTypeOrder();
        };

        // 更新任务类型序号和按钮状态
        window.updateTaskTypeOrder = function() {
            const items = document.querySelectorAll('.task-type-item');
            const totalItems = items.length;

            items.forEach((item, index) => {
                item.querySelector('.task-type-order').textContent = index + 1;
                item.dataset.index = index;
                
                const upBtn = item.querySelector('.move-type-btn[onclick*="up"]');
                const downBtn = item.querySelector('.move-type-btn[onclick*="down"]');
                const removeBtn = item.querySelector('.remove-type-btn');
                
                // 更新按钮状态
                upBtn.disabled = index === 0;
                downBtn.disabled = index === totalItems - 1;
                removeBtn.disabled = totalItems <= 1;
                
                // 更新按钮事件
                upBtn.setAttribute('onclick', `handleMoveType(${index}, 'up')`);
                downBtn.setAttribute('onclick', `handleMoveType(${index}, 'down')`);
                removeBtn.setAttribute('onclick', `handleRemoveType(${index})`);
                
                // 更新按钮样式
                upBtn.classList.toggle('disabled', upBtn.disabled);
                downBtn.classList.toggle('disabled', downBtn.disabled);
                removeBtn.classList.toggle('disabled', removeBtn.disabled);
                
                // 重新验证当前输入
                const input = item.querySelector('.task-type');
                validateTaskTypeInput(input, index + 1);
            });

            // 更新保存按钮状态
            const form = items[0]?.closest('form');
            if (form) {
                const submitBtn = form.querySelector('.task-modal-submit');
                const hasErrors = form.querySelectorAll('.type-error-message').length > 0;
                submitBtn.disabled = hasErrors;
                submitBtn.classList.toggle('disabled', hasErrors);
            }
        };

        // 表单提交处理
        const form = modal.querySelector('#settingsForm');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const taskTypes = Array.from(form.querySelectorAll('.task-type'))
                .map(input => input.value.trim());

            const settings = {
                taskOwner: form.querySelector('#taskOwner').value.trim(),
                defaultTasks: Array.from(form.querySelectorAll('.default-task-item')).map(item => ({
                    suffix: item.querySelector('.task-suffix').value.trim(),
                    effortRatio: parseFloat(item.querySelector('.task-ratio').value) || 0
                })),
                taskTypes
            };

            try {
                saveSettings(settings);
                showNotification('成功', '设置已保存');
                modal.remove();
            } catch (error) {
                showNotification('错误', '保存设置失败', true);
            }
        });

        // 取消按钮处理
        const cancelButton = modal.querySelector('.task-modal-cancel');
        cancelButton.addEventListener('click', () => {
            modal.remove();
        });

        // 点击遮罩层关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    // 添加新的处理函数
    window.handleAddType = () => {
        const container = document.getElementById('taskTypesContainer');
        const items = container.querySelectorAll('.task-type-item');
        
        // 检查现有任务类型是否有空值
        let hasEmptyType = false;
        items.forEach((item, idx) => {
            if (!item.querySelector('.task-type').value.trim()) {
                hasEmptyType = true;
                showNotification('提示', `请先填写序号 ${idx + 1} 的任务类型`, true);
            }
        });
        
        if (hasEmptyType) return;
        
        // 更新倒数第二个元素的下箭头状态
        if (items.length > 0) {
            const previousLastItem = items[items.length - 1];
            const previousLastDownBtn = previousLastItem.querySelector('.move-type-btn[onclick*="down"]');
            previousLastDownBtn.disabled = false;
            previousLastDownBtn.classList.remove('disabled');
        }
        
        const index = items.length;
        const newTypeHtml = `
            <div class="task-type-item" data-index="${index}">
                <div class="task-input-group">
                    <span class="task-type-order">${index + 1}</span>
                    <input 
                        type="text" 
                        class="task-type" 
                        placeholder="任务类型"
                        required
                    >
                    <button type="button" class="move-type-btn" onclick="handleMoveType(${index}, 'up')" ${index === 0 ? 'disabled' : ''}>↑</button>
                    <button type="button" class="move-type-btn" onclick="handleMoveType(${index}, 'down')" disabled>↓</button>
                    <button type="button" class="remove-type-btn" onclick="handleRemoveType(${index})">❌</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', newTypeHtml);
        
        // 为新添加的输入框添加事件监听
        const newItem = container.lastElementChild;
        const newInput = newItem.querySelector('.task-type');
        
        // 添加输入事件监听
        newInput.addEventListener('input', function() {
            validateTaskTypeInput(this, parseInt(newItem.dataset.index) + 1);
            updateTaskTypeOrder();
        });
        
        // 添加焦点事件，自动聚焦到新添加的输入框
        newInput.focus();
        
        // 立即验证新添加的输入框
        validateTaskTypeInput(newInput, index + 1);
        updateTaskTypeOrder();
    };

    // 添加删除任务类型的处理函数
    window.handleRemoveType = (index) => {
        const container = document.getElementById('taskTypesContainer');
        const items = container.querySelectorAll('.task-type-item');
        
        // 不允许删除最后一个任务类型
        if (items.length <= 1) {
            showNotification('提示', '至少需要保留一个任务类型', true);
            return;
        }
        
        // 删除前记录是否是第一个或最后一个元素
        const isFirst = index === 0;
        const isLast = index === items.length - 1;
        
        items[index].remove();
        
        // 如果删除的是第一个或最后一个，需要立即更新相邻元素的状态
        if (isFirst || isLast) {
            const newItems = container.querySelectorAll('.task-type-item');
            if (isFirst && newItems.length > 0) {
                // 更新新的第一个元素
                const firstItem = newItems[0];
                const upBtn = firstItem.querySelector('.move-type-btn[onclick*="up"]');
                upBtn.disabled = true;
            }
            if (isLast && newItems.length > 0) {
                // 更新新的最后一个元素
                const lastItem = newItems[newItems.length - 1];
                const downBtn = lastItem.querySelector('.move-type-btn[onclick*="down"]');
                downBtn.disabled = true;
            }
        }
        
        updateTaskTypeOrder(); // 更新所有项的序号和按钮状态
    };
})();