// ==UserScript==
// @name         jojoWork功能增强器
// @version      2.1.2
// @description  支持多网站的功能增强脚本，包括 Redmine 等项目管理系统的功能扩展，新增工时登记功能
// @author       gongzhimin
// @author       sunquan
// @author       caizhenyu
// @match        https://t.xjjj.co/*
// @grant        none
// @namespace https://greasyfork.org/users/408872
// @downloadURL https://update.greasyfork.org/scripts/543201/jojoWork%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/543201/jojoWork%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 网站功能增强器基类
     * 提供通用的功能增强框架
     */
    class SiteEnhancer {
        constructor() {
            this.siteName = 'Unknown';
            this.isEnabled = false;
            this.features = new Map();
            this.styles = new Map();
        }

        /**
         * 检测当前网站是否匹配
         * @returns {boolean} 是否匹配
         */
        detectSite() {
            return false;
        }

        /**
         * 初始化增强器
         */
        async init() {
            if (!this.detectSite()) {
                console.log(`${this.siteName} 增强器：当前网站不匹配`);
                return;
            }

            this.isEnabled = true;
            console.log(`=== ${this.siteName} 功能增强器启动 ===`);

            await this.initializeCore();
            await this.initializeFeatures();
            this.injectStyles();

            console.log(`=== ${this.siteName} 功能增强器初始化完成 ===`);
        }

        /**
         * 初始化核心功能
         */
        async initializeCore() {
            // 子类实现
        }

        /**
         * 初始化功能模块
         */
        async initializeFeatures() {
            // 子类实现
        }

        /**
         * 注入样式
         */
        injectStyles() {
            this.styles.forEach((css, id) => {
                this.addStyle(css, id);
            });
        }

        /**
         * 添加样式
         * @param {string} css CSS 样式
         * @param {string} id 样式 ID
         */
        addStyle(css, id) {
            if (document.getElementById(id)) {
                return; // 样式已存在
            }

            const style = document.createElement('style');
            style.id = id;
            style.textContent = css;
            document.head.appendChild(style);
        }

        /**
         * 移除样式
         * @param {string} id 样式 ID
         */
        removeStyle(id) {
            const style = document.getElementById(id);
            if (style) {
                style.remove();
            }
        }

        /**
         * 注册功能模块
         * @param {string} name 功能名称
         * @param {Function} initFunction 初始化函数
         */
        registerFeature(name, initFunction) {
            this.features.set(name, initFunction);
        }

        /**
         * 启用功能
         * @param {string} name 功能名称
         */
        async enableFeature(name) {
            const feature = this.features.get(name);
            if (feature) {
                await feature.call(this);
                console.log(`${this.siteName}: 功能 ${name} 已启用`);
            }
        }

        /**
         * 销毁增强器
         */
        destroy() {
            this.styles.forEach((css, id) => {
                this.removeStyle(id);
            });
            this.features.clear();

            // 清理DOM观察器
            if (this.domObserver) {
                this.domObserver.disconnect();
                this.domObserver = null;
            }

            // 清理行观察器
            if (this.rowObserver) {
                this.rowObserver.disconnect();
                this.rowObserver = null;
            }

            // 清理日期编辑器行观察器
            if (this.dateRowObserver) {
                this.dateRowObserver.disconnect();
                this.dateRowObserver = null;
            }

            // 清理重新初始化计时器
            if (this.reinitializeTimer) {
                clearTimeout(this.reinitializeTimer);
                this.reinitializeTimer = null;
            }

            this.isEnabled = false;
        }
    }

    /**
     * Redmine 功能增强器
     * 专门针对 Redmine 系统的功能增强
     */
    class RedmineEnhancer extends SiteEnhancer {
        constructor() {
            super();
            this.siteName = 'Redmine';

            // Redmine 特定属性
            this.currentUserId = '';
            this.baseUrl = '';
            this.taskList = [];
            this.defaultParentId = '';
            this.statusUpdateTimer = null;
            this.projectId = '';
            this.domObserver = null; // DOM观察器
            this.rowObserver = null; // 行观察器
            this.isReinitializing = false; // 重新初始化标志
            this.reinitializeTimer = null; // 重新初始化防抖计时器

            // 任务数据管理
            this.allTasksData = []; // 存储所有任务数据
            this.filteredTasksData = []; // 存储过滤后的任务数据
            this.collapsedTaskIds = new Set(); // 存储折叠的任务ID
            this.taskHierarchy = new Map(); // 存储任务层级关系

            // 批量状态更新相关
            this.checkboxStates = new Map(); // 内存存储复选框状态，替代localStorage
            this.checkboxStateInterval = null; // 复选框状态检查定时器

            // 成员筛选相关
            this.projectMembers = []; // 当前项目成员列表
            this.assigneeFilterUserId = ''; // 当前筛选的用户ID

            // 注册功能模块
            this.registerFeature('batchTaskCreator', this.initBatchTaskCreator);
            this.registerFeature('taskFilter', this.initTaskFilter);
            this.registerFeature('collapseFeature', this.initCollapseFeature);
            this.registerFeature('quickCopyFeature', this.initQuickCopyFeature);
            this.registerFeature('todayHoursDisplay', this.initTodayHoursDisplay);
            this.registerFeature('taskEditor', this.initTaskEditor);
            this.registerFeature('timeLogging', this.initTimeLogging);

            // 注册样式
            this.registerStyles();
        }

        /**
         * 注册所有样式
         */
        registerStyles() {
            // 今日高亮样式
            this.styles.set('today-highlight', `
                .today-highlight,
                tr.issue.today-highlight,
                #issue_tree tr.issue.today-highlight {
                    background: #ffe066 !important;
                    background-color: #ffe066 !important;
                    transition: background 0.5s;
                }
                .today-highlight td,
                tr.issue.today-highlight td,
                #issue_tree tr.issue.today-highlight td {
                    background: #ffe066 !important;
                    background-color: #ffe066 !important;
                }
            `);

            // 常用标题下拉UI样式
            this.styles.set('custom-title-ui', `
                #custom-title-list {
                    background: #fff;
                    border: 1px solid #d9d9d9;
                    border-radius: 6px;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.10);
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    min-width: 180px;
                    max-width: 400px;
                    max-height: 240px;
                    overflow-y: auto;
                    padding: 4px 0;
                    z-index: 99999;
                }
                .custom-title-item {
                    display: flex;
                    align-items: center;
                    padding: 8px 16px;
                    font-size: 14px;
                    color: #333;
                    cursor: pointer;
                    transition: background 0.2s;
                    border: none;
                    background: none;
                }
                .custom-title-item:hover {
                    background: #e6f7ff;
                }
                .custom-title-remove {
                    margin-left: auto;
                    color: #bbb;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    padding-left: 8px;
                    transition: color 0.2s;
                }
                .custom-title-remove:hover {
                    color: #f5222d;
                }
                .custom-title-empty {
                    padding: 12px 16px;
                    color: #bbb;
                    text-align: center;
                    font-size: 14px;
                }
            `);

            // 复选框样式
            this.styles.set('checkbox-styles', `
                /* 复选框基础样式（不强制显示） */
                input[name="ids[]"] {
                    width: 16px !important;
                    height: 16px !important;
                    margin-right: 8px !important;
                    position: static !important;
                    clip: auto !important;
                    overflow: visible !important;
                }

                /* 强制限制复选框父单元格宽度 */
                table.list tbody tr td.checkbox,
                table.list thead tr th.checkbox,
                #issue_tree tbody tr td.checkbox,
                #issue_tree thead tr th.checkbox,
                .list tbody tr td.checkbox,
                .list thead tr th.checkbox,
                tbody tr td.checkbox,
                thead tr th.checkbox,
                td.checkbox,
                th.checkbox {
                    display: table-cell !important;
                    width: 30px !important;
                    min-width: 30px !important;
                    max-width: 30px !important;
                    padding: 2px 4px !important;
                    text-align: center !important;
                    box-sizing: border-box !important;
                    overflow: hidden !important;
                    vertical-align: middle !important;
                }

                /* 当前用户任务的复选框样式 */
                tr.issue[data-user-task="true"] input[name="ids[]"] {
                    display: inline-block !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                }

                tr.issue[data-user-task="true"] td.checkbox {
                    display: table-cell !important;
                    visibility: visible !important;
                    opacity: 1 !important;
                    width: 30px !important;
                    min-width: 30px !important;
                    max-width: 30px !important;
                }

                /* 其他用户任务的复选框样式 - 完全隐藏列 */
                tr.issue[data-user-task="false"] input[name="ids[]"] {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                }

                tr.issue[data-user-task="false"] td.checkbox {
                    display: none !important;
                    visibility: hidden !important;
                    opacity: 0 !important;
                    width: 0 !important;
                    min-width: 0 !important;
                    max-width: 0 !important;
                    padding: 0 !important;
                    margin: 0 !important;
                    border: none !important;
                }
            `);

            // 复制消息动画样式
            this.styles.set('copy-message-styles', `
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                @keyframes slideOutRight {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `);

            // 工时登记样式
            this.styles.set('time-logging-styles', `
                .time-logging-mode .time-entry-container {
                    display: inline-block;
                    margin-left: 10px;
                    padding: 4px 8px;
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 4px;
                    font-size: 12px;
                }
                .time-entry-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 4px 0;
                    padding: 4px;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                }
                .time-entry-item input[type="date"] {
                    width: 120px;
                    padding: 2px 4px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                }
                .time-entry-item input[type="number"] {
                    width: 60px;
                    padding: 2px 4px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                }
                .time-entry-item input[type="text"] {
                    width: 400px;
                    padding: 2px 4px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                }
                .time-entry-item select {
                    width: 140px;
                    padding: 2px 4px;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    font-size: 11px;
                }
                .time-entry-actions {
                    display: flex;
                    gap: 4px;
                }
                .time-entry-btn {
                    padding: 2px 6px;
                    font-size: 11px;
                    border: none;
                    border-radius: 2px;
                    cursor: pointer;
                }
                .time-entry-btn.add {
                    background: #28a745;
                    color: white;
                }
                .time-entry-btn.remove {
                    background: #dc3545;
                    color: white;
                }
                .time-entry-btn.edit {
                    background: #ffc107;
                    color: #212529;
                }
                .time-entry-btn:hover {
                    opacity: 0.8;
                }
                .time-logging-mode #issue_tree tr.issue td.subject {
                    position: relative;
                }
            `);
        }

        /**
         * 检测是否为 Redmine 网站
         * @returns {boolean} 是否匹配
         */
        detectSite() {
            // 检查是否匹配指定的网站域名
            const supportedSites = [
                // 主要 Redmine 网站
                () => /t\.xjjj\.co\/issues\/\d+(?=[?#]|$)/.test(window.location.href),
            ];

            // 只要匹配任意一个条件就启用
            return supportedSites.some(check => {
                try {
                    return check();
                } catch (error) {
                    return false;
                }
            });
        }

        /**
         * 获取认证头信息
         * @param {Object} options 选项
         * @returns {Object} 包含认证信息的头部对象
         */
        getAuthHeaders(options = {}) {
            const headers = {};

            // 对于REST API请求，优先使用API Key认证
            const apiKey = this.getAPIKey();
            if (apiKey) {
                headers['X-Redmine-API-Key'] = apiKey;
                console.log('使用API Key认证');
            } else {
                // 如果没有API Key，使用CSRF token认证（仅用于 JSON 请求）
                if (!options.isFormData) {
                    const csrfToken = this.getCSRFToken();
                    if (csrfToken) {
                        headers['X-CSRF-Token'] = csrfToken;
                        console.log('使用CSRF Token认证');
                    } else {
                        console.warn('既没有API Key也没有CSRF Token，请求可能会失败');
                    }
                }
            }

            // 添加基本头部
            headers['X-Requested-With'] = 'XMLHttpRequest';

            // 根据请求类型设置内容类型
            // 只有明确指定为 JSON API 请求时才添加 JSON 相关头部
            if (!options.skipContentType && !options.isFormData && options.isJsonApi) {
                headers['Content-Type'] = 'application/json';
                headers['Accept'] = 'application/json';
            }

            console.log('准备的认证头信息:', Object.keys(headers));
            return headers;
        }

        /**
         * 调试认证信息
         * @param {string} requestType 请求类型
         * @param {Object} data 请求数据
         */
        debugAuthInfo(requestType, data) {
            console.log(`=== ${requestType} 认证调试信息 ===`);

            const csrfToken = this.getCSRFToken();
            const apiKey = this.getAPIKey();

            console.log('CSRF Token:', csrfToken ? csrfToken.substring(0, 10) + '...' : '未找到');
            console.log('API Key:', apiKey ? '已配置' : '未配置');

            if (data instanceof FormData) {
                console.log('FormData 内容:');
                for (let [key, value] of data.entries()) {
                    if (key === 'authenticity_token') {
                        console.log(`  ${key}: ${value.substring(0, 10)}...`);
                    } else {
                        console.log(`  ${key}: ${value}`);
                    }
                }
            }

            console.log('========================');
        }

        /**
         * 获取 CSRF Token
         * @returns {string|null} CSRF Token
         */
        getCSRFToken() {
            // 方法1: 从 meta 标签获取 (Rails 标准方式)
            let token = $('meta[name="csrf-token"]').attr('content');
            if (token) {
                console.log('从 meta[name="csrf-token"] 获取到 CSRF Token:', token.substring(0, 10) + '...');
                return token;
            }

            // 方法2: 从 meta 标签获取 (可能的变体)
            token = $('meta[name="_csrf"]').attr('content');
            if (token) {
                console.log('从 meta[name="_csrf"] 获取到 CSRF Token:', token.substring(0, 10) + '...');
                return token;
            }

            // 方法3: 从表单中获取
            token = $('input[name="authenticity_token"]').val();
            if (token) {
                console.log('从 input[name="authenticity_token"] 获取到 CSRF Token:', token.substring(0, 10) + '...');
                return token;
            }

            // 方法4: 从 Rails 的 CSRF token 获取
            if (window.Rails && window.Rails.csrfToken) {
                token = window.Rails.csrfToken();
                if (token) {
                    console.log('从 Rails.csrfToken() 获取到 CSRF Token:', token.substring(0, 10) + '...');
                    return token;
                }
            }

            // 方法5: 从页面中的任何隐藏字段获取
            token = $('form input[name="authenticity_token"]:first').val();
            if (token) {
                console.log('从表单隐藏字段获取到 CSRF Token:', token.substring(0, 10) + '...');
                return token;
            }

            // 方法6: 从 Redmine 特定的位置获取
            token = $('#new_issue input[name="authenticity_token"]').val();
            if (token) {
                console.log('从 Redmine 新建问题表单获取到 CSRF Token:', token.substring(0, 10) + '...');
                return token;
            }

            console.warn('未找到 CSRF Token，尝试的所有方法都失败了');
            this.debugCSRFTokenSources();
            return null;
        }

        /**
         * 调试 CSRF Token 来源
         */
        debugCSRFTokenSources() {
            console.log('=== CSRF Token 调试信息 ===');

            // 检查所有可能的 meta 标签
            $('meta').each((i, meta) => {
                const name = $(meta).attr('name');
                const content = $(meta).attr('content');
                if (name && (name.includes('csrf') || name.includes('token'))) {
                    console.log(`Meta 标签: ${name} = ${content ? content.substring(0, 20) + '...' : 'null'}`);
                }
            });

            // 检查所有可能的隐藏字段
            $('input[type="hidden"]').each((i, input) => {
                const name = $(input).attr('name');
                const value = $(input).val();
                if (name && (name.includes('token') || name.includes('authenticity'))) {
                    console.log(`隐藏字段: ${name} = ${value ? value.substring(0, 20) + '...' : 'null'}`);
                }
            });

            // 检查 Rails 对象
            if (window.Rails) {
                console.log('Rails 对象存在:', Object.keys(window.Rails));
                if (window.Rails.csrfToken) {
                    console.log('Rails.csrfToken 方法存在');
                }
            } else {
                console.log('Rails 对象不存在');
            }
        }

        /**
         * 获取 API Key（如果用户配置了）
         * @returns {string|null} API Key
         */
        getAPIKey() {
            // 从本地存储获取用户配置的 API Key
            try {
                const apiKey = localStorage.getItem('redmine_api_key');
                if (apiKey) {
                    return apiKey;
                }
            } catch (error) {
                console.warn('无法从本地存储获取 API Key:', error);
            }

            // 从页面中查找 API Key（某些 Redmine 版本可能会显示）
            const apiKeyElement = $('.api-key, #api-key, [data-api-key]');
            if (apiKeyElement.length > 0) {
                const apiKey = apiKeyElement.text().trim() || apiKeyElement.attr('data-api-key');
                if (apiKey) {
                    return apiKey;
                }
            }

            return null;
        }

        /**
         * 发送带认证信息的 AJAX 请求
         * @param {Object} options jQuery AJAX 选项
         * @returns {Promise} AJAX Promise
         */
        authenticatedAjax(options) {
            // 检查是否是 JSON API 请求
            const isJsonApi = this.isJsonApiRequest(options.url, options);
            const authHeaders = this.getAuthHeaders({
                isFormData: false,
                isJsonApi: isJsonApi
            });

            // 合并认证头信息
            const ajaxOptions = {
                ...options,
                headers: {
                    ...authHeaders,
                    ...(options.headers || {})
                },
                xhrFields: {
                    withCredentials: true,
                    ...(options.xhrFields || {})
                }
            };

            return $.ajax(ajaxOptions);
        }

        /**
         * 发送带认证信息的 Fetch 请求
         * @param {string} url 请求 URL
         * @param {Object} options Fetch 选项
         * @returns {Promise} Fetch Promise
         */
        authenticatedFetch(url, options = {}) {
            // 检查是否是 JSON API 请求
            const isJsonApi = this.isJsonApiRequest(url, options);
            const authHeaders = this.getAuthHeaders({
                isFormData: false,
                isJsonApi: isJsonApi
            });

            // 合并认证头信息
            const fetchOptions = {
                ...options,
                headers: {
                    ...authHeaders,
                    ...(options.headers || {})
                },
                credentials: options.credentials || 'same-origin'
            };

            return fetch(url, fetchOptions);
        }

        /**
         * 显示 API Key 配置界面
         */
        showApiKeyConfig() {
            const currentApiKey = localStorage.getItem('redmine_api_key') || '';

            const modal = $(`
                <div class="api-key-modal" style="
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.5);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">
                    <div class="api-key-content" style="
                        background: white;
                        padding: 20px;
                        border-radius: 8px;
                        max-width: 500px;
                        width: 90%;
                    ">
                        <h3>配置 Redmine API Key</h3>
                        <p>为了确保 AJAX 请求的认证，您可以配置 Redmine API Key：</p>
                        <div style="margin: 15px 0;">
                            <label for="api-key-input">API Key:</label><br>
                            <input type="text" id="api-key-input" value="${currentApiKey}"
                                   style="width: 100%; padding: 8px; margin-top: 5px; box-sizing: border-box;">
                        </div>
                        <p style="font-size: 12px; color: #666;">
                            您可以在 Redmine 的 "我的账户" → "API 访问密钥" 中找到您的 API Key
                        </p>
                        <div style="text-align: right; margin-top: 20px;">
                            <button id="api-key-test" style="margin-right: 10px; padding: 8px 16px; background: #28a745; color: white; border: none;">测试REST API认证</button>
                            <button id="api-key-cancel" style="margin-right: 10px; padding: 8px 16px;">取消</button>
                            <button id="api-key-save" style="padding: 8px 16px; background: #007cba; color: white; border: none;">保存</button>
                        </div>
                    </div>
                </div>
            `);

            $('body').append(modal);

            // 绑定事件
            modal.find('#api-key-test').on('click', async () => {
                const apiKey = modal.find('#api-key-input').val().trim();

                // 临时保存 API Key 用于测试
                const originalApiKey = localStorage.getItem('redmine_api_key');
                if (apiKey) {
                    localStorage.setItem('redmine_api_key', apiKey);
                } else {
                    localStorage.removeItem('redmine_api_key');
                }

                // 测试认证
                const testResult = await this.testAuthentication();

                // 恢复原始 API Key
                if (originalApiKey) {
                    localStorage.setItem('redmine_api_key', originalApiKey);
                } else {
                    localStorage.removeItem('redmine_api_key');
                }

                // 显示测试结果
                if (testResult) {
                    alert('✓ REST API认证测试成功！API Key 配置正确，可以正常使用REST API功能。');
                } else {
                    alert('✗ REST API认证测试失败！请检查 API Key 是否正确，或查看控制台了解详细信息。\n\n注意：现在使用的是REST API，需要确保Redmine支持API访问。');
                }
            });

            modal.find('#api-key-save').on('click', () => {
                const apiKey = modal.find('#api-key-input').val().trim();
                if (apiKey) {
                    localStorage.setItem('redmine_api_key', apiKey);
                    console.log('API Key 已保存');
                } else {
                    localStorage.removeItem('redmine_api_key');
                    console.log('API Key 已清除');
                }
                modal.remove();
            });

            modal.find('#api-key-cancel').on('click', () => {
                modal.remove();
            });

            // 点击背景关闭
            modal.on('click', (e) => {
                if (e.target === modal[0]) {
                    modal.remove();
                }
            });
        }

        /**
         * 设置全局 AJAX 默认设置
         */
        setupGlobalAjaxDefaults() {
            const self = this;

            // 保存全局 beforeSend 函数的引用
            const globalBeforeSend = function(xhr, settings) {
                // 检查是否是 FormData 请求
                const isFormData = settings.data instanceof FormData;

                // 检查是否已经有自定义的 beforeSend 处理
                // 通过检查 settings 中是否有标记来判断
                if (settings._hasCustomBeforeSend) {
                    // 如果有自定义的 beforeSend，跳过全局处理
                    console.log('检测到自定义 beforeSend，跳过全局认证处理');
                    return;
                }

                // 为非 FormData 请求添加认证头信息
                if (!isFormData) {
                    // 检查是否是 JSON API 请求
                    const isJsonApi = self.isJsonApiRequest(settings.url, settings);
                    const authHeaders = self.getAuthHeaders({
                        isFormData: false,
                        isJsonApi: isJsonApi
                    });

                    Object.keys(authHeaders).forEach(key => {
                        xhr.setRequestHeader(key, authHeaders[key]);
                    });
                    console.log('已添加认证头到 AJAX 请求', isJsonApi ? '(JSON API)' : '(普通请求)');
                } else {
                    // 对于 FormData 请求，只添加基本的头部
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

                    // 如果有 API Key，仍然添加
                    const apiKey = self.getAPIKey();
                    if (apiKey) {
                        xhr.setRequestHeader('X-Redmine-API-Key', apiKey);
                    }
                    console.log('FormData 请求，只添加基本认证头');
                }

                // 确保包含凭据
                xhr.withCredentials = true;
            };

            // 设置 jQuery AJAX 全局默认设置
            $.ajaxSetup({
                beforeSend: globalBeforeSend
            });

            console.log('全局 AJAX 认证设置已配置');

            // 显示当前认证状态
            this.logAuthStatus();
        }

        /**
         * 检查是否是 JSON API 请求
         * @param {string} url 请求 URL
         * @param {Object} settings AJAX 设置
         * @returns {boolean} 是否是 JSON API 请求
         */
        isJsonApiRequest(url, settings = {}) {
            if (!url) return false;

            // JSON API 请求的特征
            const jsonApiPatterns = [
                /\.json$/,                          // 以 .json 结尾的 URL
                /\/api\//,                          // API 路径
                /\/rest\//,                         // REST API 路径
            ];

            // 检查 URL 是否匹配 JSON API 模式
            const isJsonUrl = jsonApiPatterns.some(pattern => pattern.test(url));

            // 检查请求设置中是否明确指定了 JSON
            const hasJsonDataType = settings.dataType === 'json';
            const hasJsonContentType = settings.contentType && settings.contentType.includes('application/json');
            const hasJsonAccept = settings.headers && settings.headers.Accept && settings.headers.Accept.includes('application/json');

            return isJsonUrl || hasJsonDataType || hasJsonContentType || hasJsonAccept;
        }

        /**
         * 记录当前认证状态
         */
        logAuthStatus() {
            const csrfToken = this.getCSRFToken();
            const apiKey = this.getAPIKey();

            console.log('=== Redmine REST API 认证状态 ===');
            console.log('CSRF Token:', csrfToken ? '✓ 已获取' : '✗ 未找到');
            console.log('API Key:', apiKey ? '✓ 已配置' : '✗ 未配置');
            console.log('推荐认证方式: REST API (使用API Key)');

            if (!csrfToken && !apiKey) {
                console.warn('警告: 未找到 CSRF Token 且未配置 API Key，REST API 请求可能会失败');
                console.log('建议: 点击批量任务创建面板中的 ⚙️ 按钮配置 API Key 以使用REST API');

                // 显示详细的调试信息
                this.debugCSRFTokenSources();
            } else if (apiKey) {
                console.log('✓ 已配置API Key，将使用REST API进行所有操作');
            } else {
                console.log('⚠️ 仅有CSRF Token，建议配置API Key以获得更好的REST API支持');
            }
        }

        /**
         * 测试认证配置
         */
        async testAuthentication() {
            console.log('=== 开始测试REST API认证配置 ===');

            try {
                // 构建测试URL
                const testUrl = `${window.location.origin}/users/current.json`;

                // 获取认证头信息
                const headers = this.getAuthHeaders({ isFormData: false, isJsonApi: true });

                console.log('测试URL:', testUrl);
                console.log('测试头信息:', headers);

                // 测试获取当前用户信息
                const response = await fetch(testUrl, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const userData = await response.json();
                    console.log('✓ REST API认证测试成功，当前用户:', userData.user?.name || '未知');
                    return true;
                } else {
                    console.error('✗ REST API认证测试失败，状态码:', response.status);
                    const responseText = await response.text();
                    console.error('响应内容:', responseText);
                    return false;
                }
            } catch (error) {
                console.error('✗ REST API认证测试异常:', error);
                return false;
            }
        }

        /**
         * 初始化核心功能
         */
        async initializeCore() {
            await new Promise(resolve => {
                $(document).ready(resolve);
            });

            this.setupGlobalAjaxDefaults();
            this.monitorAjaxRequests();
            this.cleanupOldEventListeners();
            this.setupDOMObserver(); // 新增：监听DOM变化
            await this.initializeVariables(); // 等待异步初始化完成
        }

        /**
         * 初始化功能模块
         */
        async initializeFeatures() {
            // 启用所有注册的功能
            this.enableFeature('batchTaskCreator');
            this.enableFeature('taskFilter');
            this.enableFeature('collapseFeature');
            this.enableFeature('quickCopyFeature');
            this.enableFeature('todayHoursDisplay');
            this.enableFeature('taskEditor');
            await this.enableFeature('timeLogging');
        }

        // 新增：监控所有AJAX请求的方法
        monitorAjaxRequests() {
            const self = this;
            const originalAjax = $.ajax;

            $.ajax = function(options) {
                const url = options.url || '';
                const method = options.method || options.type || 'GET';

                // 监控所有请求，但重点关注可能有问题的请求
                if (method === 'PATCH' || url.includes('context_menu') || url.includes('bulk_')) {
                    console.log(`=== ${method} 请求监控 ===`);
                    console.log('URL:', url);
                    console.log('方法:', method);
                    console.log('数据:', options.data);

                    // 分析URL，检查是否是正确的任务更新URL
                    if (method === 'PATCH') {
                        const issueIdMatch = url.match(/\/issues\/(\d+)/);
                        if (issueIdMatch) {
                            console.log('检测到任务ID:', issueIdMatch[1]);
                            console.log('这是一个任务更新请求');
                        } else {
                            console.warn('⚠️ 这个PATCH请求不是标准的任务更新请求!');
                            console.warn('可能的问题URL:', url);
                        }
                    }

                    console.log('发起者堆栈:');
                    const stack = new Error().stack.split('\n').slice(1, 6);
                    stack.forEach(line => console.log('  ', line.trim()));
                    console.log('========================');
                }

                return originalAjax.apply(this, arguments);
            };

            console.log('AJAX请求监控已启用');
        }

        // 新增：清理可能遗留的事件监听器
        cleanupOldEventListeners() {
            console.log('清理可能遗留的事件监听器...');

            // 清理批量状态更新相关的事件监听器
            $(document).off('.batchStatus');
            $(document).off('.batchStatusProtection');
            $("#batch-update-status-btn").off('.batchStatus');
            $("#batch-complete-btn").off('.batchComplete');
            $("#batch-status-select").off('.batchStatus');

            // 清理工时登记相关的事件监听器
            $(document).off('click.timeLogging', '.time-entry-btn.add');
            $(document).off('click.timeLogging', '.time-entry-btn.edit');
            $(document).off('click.timeLogging', '.time-entry-btn.remove');

            // 只清理localStorage中的旧状态，不删除现在需要的元素
            // localStorage.removeItem('redmine_checkbox_states');

            console.log('事件监听器清理完成');
        }

        /**
         * 设置DOM观察器，监听页面内容的动态更新
         */
        setupDOMObserver() {
            // 如果已经存在观察器，先断开
            if (this.domObserver) {
                this.domObserver.disconnect();
            }

            // 初始化重新初始化标志和防抖计时器
            this.isReinitializing = false;
            this.reinitializeTimer = null;

            // 创建观察器实例
            this.domObserver = new MutationObserver((mutations) => {
                // 如果正在重新初始化，跳过处理
                if (this.isReinitializing) {
                    return;
                }

                let shouldReinitialize = false;

                mutations.forEach((mutation) => {
                    // 检查是否有新增的节点
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            // 跳过我们自己创建的元素
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 跳过批量任务创建器和控制面板等我们自己的元素
                                if (node.id === 'batch-task-creator' ||
                                    node.id === 'batch-task-toggle' ||
                                    node.id === 'issue-tree-controls' ||
                                    node.classList?.contains('today-hours') ||
                                    node.classList?.contains('copy-task-id-btn')) {
                                    return;
                                }

                                // 更精确地检测 refreshData 按钮的重新创建
                                // 只有当按钮是作为 .subject 的直接子元素被添加时才认为是刷新
                                const hasRefreshButton = node.classList?.contains('refreshData') &&
                                                        node.parentElement?.classList?.contains('subject');

                                // 检查是否是整个 .subject 区域被替换
                                const isSubjectReplaced = node.classList?.contains('subject') &&
                                                        node.querySelector?.('.refreshData');

                                // 检查是否是 issue details 的主要内容被更新
                                const isDetailsContentUpdated = node.classList?.contains('details') &&
                                                               node.querySelector?.('.subject') &&
                                                               !node.querySelector?.('#batch-task-creator');

                                if (hasRefreshButton || isSubjectReplaced || isDetailsContentUpdated) {
                                    shouldReinitialize = true;
                                    console.log('检测到页面内容刷新（refreshData触发），准备重新初始化功能');
                                }
                            }
                        });
                    }
                });

                // 如果需要重新初始化，使用防抖机制避免频繁触发
                if (shouldReinitialize) {
                    // 清除之前的计时器
                    if (this.reinitializeTimer) {
                        clearTimeout(this.reinitializeTimer);
                    }

                    // 设置新的计时器
                    this.reinitializeTimer = setTimeout(() => {
                        this.reinitializeAfterRefresh();
                    }, 500); // 增加延迟时间
                }
            });

            // 开始观察，但只观察特定的容器
            const targetNode = document.querySelector('.issue.details') || document.body;
            const config = {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            };

            this.domObserver.observe(targetNode, config);
            console.log('DOM观察器已启动，监听页面内容变化');
        }

        /**
         * 页面刷新后重新初始化功能
         * @param {boolean} forceReinitialize 是否强制重新初始化（用于手动调用）
         */
        async reinitializeAfterRefresh(forceReinitialize = false) {
            // 防止重复初始化（除非强制重新初始化）
            if (this.isReinitializing && !forceReinitialize) {
                console.log('正在重新初始化中，跳过重复调用');
                return;
            }

            this.isReinitializing = true;
            console.log('=== 页面内容刷新后重新初始化 ===');

            try {
                // 暂时断开DOM观察器，避免在重新初始化过程中触发
                if (this.domObserver) {
                    this.domObserver.disconnect();
                }

                // 重新初始化变量（可能项目信息发生了变化）
                await this.initializeVariables();

                // 重新注入样式（确保样式在页面刷新后仍然有效）
                this.injectStyles();

                // 重新初始化所有功能模块
                await this.initializeFeatures();

                console.log('✓ 页面刷新后功能重新初始化完成');

                // 重新启动DOM观察器
                setTimeout(() => {
                    this.setupDOMObserver();
                    this.isReinitializing = false;
                }, 1000); // 等待1秒后重新启动观察器

            } catch (error) {
                console.error('页面刷新后重新初始化失败:', error);
                this.isReinitializing = false;

                // 即使出错也要重新启动观察器
                setTimeout(() => {
                    this.setupDOMObserver();
                }, 1000);
            }
        }

        /**
         * 使用 refreshData 按钮刷新页面内容
         * 替代 window.location.reload() 的功能
         */
        refreshPageContent() {
            console.log('=== 尝试使用 refreshData 按钮刷新页面内容 ===');

            // 查找 refreshData 按钮，尝试多种选择器
            let refreshButton = document.querySelector('.refreshData');
            console.log('查找 .refreshData:', refreshButton);

            if (refreshButton) {
                console.log('找到 refreshData 按钮，执行点击刷新');

                try {
                    // 点击刷新按钮
                    refreshButton.click();

                    // 等待刷新完成后主动重新初始化功能
                    setTimeout(async () => {
                        console.log('refreshData 刷新完成，开始重新初始化功能');
                        await this.reinitializeAfterRefresh(true); // 强制重新初始化
                    }, 2000);

                    return true;
                } catch (error) {
                    console.error('点击 refreshData 按钮时出错:', error);
                    // 出错时回退到页面重载
                    window.location.reload();
                    return false;
                }
            } else {
                console.warn('未找到 refreshData 按钮，回退到页面重载');
                console.log('当前页面的按钮元素:', document.querySelectorAll('button'));
                window.location.reload();
                return false;
            }
        }

        async initializeVariables() {
            // 获取当前用户ID
            this.currentUserId = $('#loggedas a').attr('href').split('/').pop();

            // 获取父任务ID
            this.defaultParentId = window.location.pathname.split('/issues/')[1] || '';

            // 获取baseUrl用于表单提交
            const searchFormAction = $('#quick-search form').attr('action');
            this.baseUrl = searchFormAction ? searchFormAction.replace('search', 'issues') : `${window.location.origin}/issues`;

            // 通过REST API获取项目ID（仅用于获取项目信息）
            await this.getProjectIdFromIssue();

            // 获取默认的跟踪类型和状态
            this.getDefaultIssueSettings();

            console.log('当前用户ID:', this.currentUserId);
            console.log('baseUrl:', this.baseUrl);
            console.log('当前项目ID:', this.projectId);
            console.log('默认父任务ID:', this.defaultParentId);
            console.log('默认跟踪类型ID:', this.defaultTrackerId);
            console.log('默认状态ID:', this.defaultStatusId);

            if (!this.currentUserId) {
                console.error('无法获取用户ID');
                return false;
            }

            return true;
        }

        // 新增：通过REST API从任务ID获取项目ID
        async getProjectIdFromIssue() {
            if (!this.defaultParentId) {
                console.warn('没有父任务ID，无法获取项目ID');
                return;
            }

            try {
                console.log(`通过REST API获取任务 ${this.defaultParentId} 的项目信息...`);

                // 构建API URL
                const apiUrl = `${window.location.origin}/issues/${this.defaultParentId}.json`;

                // 获取认证头信息
                const headers = this.getAuthHeaders({ isFormData: false, isJsonApi: true });

                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: headers,
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.issue && data.issue.project) {
                        this.projectId = data.issue.project.id;
                        this.projectIdentifier = data.issue.project.identifier;
                        console.log('✓ 成功获取项目信息:', {
                            id: this.projectId,
                            identifier: this.projectIdentifier,
                            name: data.issue.project.name
                        });

                        // 同时获取任务的跟踪类型和状态作为默认值
                        if (data.issue.tracker) {
                            this.defaultTrackerId = data.issue.tracker.id;
                            console.log('从父任务获取跟踪类型ID:', this.defaultTrackerId);
                        }
                        if (data.issue.status) {
                            this.defaultStatusId = '1'; // 新建任务默认为"新建"状态
                            console.log('设置默认状态ID为新建:', this.defaultStatusId);
                        }
                    } else {
                        console.error('API响应格式异常:', data);
                    }
                } else {
                    console.error('获取任务信息失败:', response.status, response.statusText);
                    const responseText = await response.text();
                    console.error('响应内容:', responseText);
                }
            } catch (error) {
                console.error('获取项目ID时发生错误:', error);
            }
        }

        // 加载并填充“当前项目相关人员”下拉框
        async loadAndPopulateAssigneeFilter() {
            const $select = $('#assignee-filter-select');
            if (!$select.length) return;

            try {
                // 从当前页面的任务列表中提取相关人员
                const taskRelatedUsers = this.extractTaskRelatedUsers();

                this.projectMembers = taskRelatedUsers;
                this.populateAssigneeOptions($select);

                console.log(`从当前任务中提取到 ${taskRelatedUsers.length} 个相关人员`);
            } catch (e) {
                console.error('提取任务相关人员失败:', e);
                this.projectMembers = [];
                this.populateAssigneeOptions($select);
            }
        }

        // 从当前页面的任务列表中提取相关人员
        extractTaskRelatedUsers() {
            const users = new Map(); // 使用 Map 去重
            const $issueTree = $("#issue_tree");

            if (!$issueTree.length) {
                console.warn('未找到任务列表，无法提取相关人员');
                return [];
            }

            // 遍历所有任务行，提取指派人员信息
            $issueTree.find('tr.issue').each((index, row) => {
                const $row = $(row);

                // 查找指派人员列
                const $assignedTo = $row.find('td.assigned_to a.user');
                if ($assignedTo.length > 0) {
                    const userHref = $assignedTo.attr('href');
                    const userName = $assignedTo.text().trim();

                    if (userHref && userName) {
                        // 从 href 中提取用户ID，格式通常是 /users/123
                        const userIdMatch = userHref.match(/\/users\/(\d+)$/);
                        if (userIdMatch) {
                            const userId = userIdMatch[1];
                            users.set(userId, {
                                id: userId,
                                name: userName
                            });
                        }
                    }
                }
            });

            // 转换为数组并按姓名排序
            const userArray = Array.from(users.values())
                .sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN'));

            return userArray;
        }

        // 根据已加载的成员渲染下拉框
        populateAssigneeOptions($select) {
            const target = $select && $select.length ? $select : $('#assignee-filter-select');
            if (!target.length) return;

            const currentUserId = this.currentUserId || '';
            // 不再使用本地存储，每次都默认选择当前用户
            const selectedUserId = this.assigneeFilterUserId || currentUserId;

            target.empty();

            // 我自己（默认）
            target.append(`<option value="${currentUserId}">我自己</option>`);

            if (this.projectMembers && this.projectMembers.length) {
                // 其他成员
                this.projectMembers.forEach(u => {
                    // 避免重复增加当前用户
                    if (u.id === currentUserId) return;
                    target.append(`<option value="${u.id}">${u.name}</option>`);
                });
            } else {
                target.append('<option value="" disabled>（无任务相关人员）</option>');
            }

            // 选中当前筛选的用户
            target.val(selectedUserId);

            // 更新按钮显示状态
            setTimeout(() => {
                this.updateTodayTaskButtonVisibility();
            }, 100);
        }

        // 获取当前筛选所用的用户ID
        getActiveFilterUserId() {
            return (this.assigneeFilterUserId && String(this.assigneeFilterUserId)) || (this.currentUserId && String(this.currentUserId)) || '';
        }

        // 手动刷新任务相关人员列表
        refreshTaskRelatedUsers() {
            console.log('手动刷新任务相关人员列表...');
            this.loadAndPopulateAssigneeFilter();
        }

        // 新增：获取默认的任务设置
        getDefaultIssueSettings() {
            // 尝试从新建任务表单中获取默认值
            const $newIssueForm = $('#issue-form, #new_issue');

            if ($newIssueForm.length) {
                // 从表单中获取默认跟踪类型
                const $trackerSelect = $newIssueForm.find('#issue_tracker_id');
                if ($trackerSelect.length) {
                    this.defaultTrackerId = $trackerSelect.val() || $trackerSelect.find('option:first').val() || '1';
                } else {
                    this.defaultTrackerId = '1'; // 默认值
                }

                // 从表单中获取默认状态
                const $statusSelect = $newIssueForm.find('#issue_status_id');
                if ($statusSelect.length) {
                    this.defaultStatusId = $statusSelect.val() || $statusSelect.find('option:first').val() || '1';
                } else {
                    this.defaultStatusId = '1'; // 默认值
                }
            } else {
                // 如果没有表单，尝试从现有任务中获取
                const $issueDetails = $('.issue .attributes');
                if ($issueDetails.length) {
                    // 从任务详情页面获取跟踪类型
                    const trackerText = $issueDetails.find('.tracker .value').text().trim();
                    this.defaultTrackerId = this.getTrackerIdByName(trackerText) || '1';

                    // 默认状态设为"新建"
                    this.defaultStatusId = '1';
                } else {
                    // 使用通用默认值
                    this.defaultTrackerId = '1'; // 通常是"缺陷"或"任务"
                    this.defaultStatusId = '1';  // 通常是"新建"
                }
            }
        }

        // 新增：根据跟踪类型名称获取ID（简单映射）
        getTrackerIdByName(trackerName) {
            const trackerMap = {
                '缺陷': '1',
                'Bug': '1',
                '任务': '2',
                'Task': '2',
                '功能': '3',
                'Feature': '3',
                '需求': '3'
            };
            return trackerMap[trackerName] || '1';
        }

        initBatchTaskCreator() {
            // 校验defaultParentId是否为纯数字
            if (!/^\d+$/.test(this.defaultParentId)) {
                console.log('父任务ID无效，批量创建功能不启用');
                return;
            }

            // 清理可能存在的旧的批量任务创建器
            const existingCreator = $('#batch-task-creator');
            if (existingCreator.length > 0) {
                console.log('发现已存在的批量任务创建器，清理后重新创建');
                existingCreator.remove();
            }

            const batchTaskArea = this.createBatchTaskHTML();
            $('body').append(batchTaskArea);

            // 设置开始日期默认为当前日期
            this.setDefaultStartDate();
            this.bindBatchTaskEvents();
        }

        setDefaultStartDate() {
            const today = new Date();
            const dateString = today.getFullYear() + '-' +
                String(today.getMonth() + 1).padStart(2, '0') + '-' +
                String(today.getDate()).padStart(2, '0');

            // 等待DOM元素创建完成后设置默认值
            setTimeout(() => {
                $("#task-start-date").val(dateString);
            }, 100);
        }

        // 获取本周一的日期
        getThisMonday() {
            const today = new Date();
            const dayOfWeek = today.getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
            const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 如果是周日，往前6天；否则往前到周一
            const monday = new Date(today);
            monday.setDate(today.getDate() + daysToMonday);
            return this.formatDate(monday);
        }

        // 获取本周二的日期
        getThisTuesday() {
            const monday = new Date(this.parseDate(this.getThisMonday()));
            monday.setDate(monday.getDate() + 1);
            return this.formatDate(monday);
        }

        // 获取下周一的日期
        getNextMonday() {
            const thisMonday = new Date(this.parseDate(this.getThisMonday()));
            thisMonday.setDate(thisMonday.getDate() + 7);
            return this.formatDate(thisMonday);
        }
        // 获取下周二的日期
        getNextTuesday() {
            const thisMonday = new Date(this.parseDate(this.getThisMonday()));
            thisMonday.setDate(thisMonday.getDate() + 8);
            return this.formatDate(thisMonday);
        }
        // 获取下周四的日期
        getNextThursday() {
            const thisMonday = new Date(this.parseDate(this.getThisMonday()));
            thisMonday.setDate(thisMonday.getDate() + 10); // 下周一+3=下周四
            return this.formatDate(thisMonday);
        }
        // 获取下周五的日期
        getNextFriday() {
            const thisMonday = new Date(this.parseDate(this.getThisMonday()));
            thisMonday.setDate(thisMonday.getDate() + 11); // 下周一+4=下周五
            return this.formatDate(thisMonday);
        }

        // 格式化日期为 YYYY-MM-DD
        formatDate(date) {
            return date.getFullYear() + '-' +
                String(date.getMonth() + 1).padStart(2, '0') + '-' +
                String(date.getDate()).padStart(2, '0');
        }

        // 解析日期字符串
        parseDate(dateString) {
            const parts = dateString.split('-');
            return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        }

        // 根据任务类型设置默认日期
        setDatesByTaskType(taskType) {
            let startDate = '';
            let endDate = '';

            switch(taskType) {
                case '技术方案设计':
                    startDate = this.getThisMonday();
                    endDate = this.getThisTuesday();
                    break;
                case '技术方案评审':
                    startDate = this.getThisTuesday();
                    endDate = this.getThisTuesday();
                    break;
                case '冒烟自测':
                    startDate = this.getNextMonday();
                    endDate = this.getNextMonday();
                    break;
                case '单元测试':
                    startDate = this.getNextTuesday();
                    endDate = '';
                    break;
                case 'fat测试':
                    startDate = this.getNextTuesday();
                    endDate = this.getNextThursday();
                    break;
                case 'uat测试':
                    startDate = this.getNextFriday();
                    endDate = this.getNextFriday();
                    break;
                default:
                    // 其他任务类型使用当前日期作为开始日期
                    const today = new Date();
                    startDate = this.formatDate(today);
                    endDate = '';
                    break;
            }

            $("#task-start-date").val(startDate);
            $("#task-due-date").val(endDate);
        }

        createBatchTaskHTML() {
            // 新增：读取本地模式
            const savedMode = localStorage.getItem('redmine_task_mode') || 'select';
            return `
                <div id="batch-task-creator" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #ffffff;
                    border: 2px solid #628DB6;
                    border-radius: 8px;
                    padding: 15px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 1000;
                    min-width: 500px;
                    max-width: 1200px;
                    max-height: 90vh;
                    overflow-y: auto;
                    display: none;
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                        <h3 style="margin: 0; color: #628DB6;">批量创建任务</h3>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <select id="task-mode-switch" style="padding: 2px 8px; font-size: 13px;">
                                <option value="select" ${savedMode === 'select' ? 'selected' : ''}>选择模式</option>
                                <option value="custom" ${savedMode === 'custom' ? 'selected' : ''}>自定义模式</option>
                            </select>
                            <button id="close-task-creator" class="button" style="background: #d00; color: white;">×</button>
                        </div>
                    </div>

                    <div id="task-creator-content">
                        <div style="margin: 5px 0;">
                            <div style="margin-bottom: 5px;">
                                <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                                    <select id="task-title-select" style="flex: 1; padding: 5px;">
                                        <option value="">请选择任务类型</option>
                                        <option value="后端开发任务">后端开发任务</option>
                                        <option value="技术方案设计">技术方案设计</option>
                                        <option value="技术方案评审">技术方案评审</option>
                                        <option value="冒烟自测">冒烟自测</option>
                                        <option value="单元测试">单元测试</option>
                                        <option value="开发任务">开发任务</option>
                                        <option value="测试任务">测试任务</option>
                                        <option value="测试用例编写">测试用例编写</option>
                                        <option value="用例评审">用例评审</option>
                                        <option value="fat测试">fat测试</option>
                                        <option value="uat测试">uat测试</option>
                                    </select>
                                    <button id="use-custom-title" class="button" title="使用自定义标题">自定义</button>
                                </div>
                                <div style="display: flex; gap: 5px; align-items: center; margin-bottom: 5px;">
                                    <input type="text" id="task-title" placeholder="或输入自定义任务标题" style="width: 100%; padding: 5px; display: none;">
                                    <button id="save-custom-title" class="button" style="display: none; white-space: nowrap;">保存为常用</button>
                                </div>
                                <div id="custom-title-list" style="display: none; flex-wrap: wrap; gap: 5px; margin-bottom: 5px;"></div>
                            </div>
                            <div style="display: flex; gap: 5px; margin-bottom: 5px;">
                                <input type="date" id="task-start-date" style="flex: 1; padding: 5px;" title="开始日期">
                                <input type="date" id="task-due-date" style="flex: 1; padding: 5px;" title="结束日期">
                                <input type="text" id="task-parent-id" placeholder="父任务ID" style="flex: 1; padding: 5px;">
                            </div>
                            <button id="add-task" class="button" style="width: 100%; margin-bottom: 10px;">添加到列表</button>
                        </div>

                        <div id="task-list" style="margin: 10px 0; max-height: 200px; overflow-y: auto;">
                            <table class="list" style="width: 100%; font-size: 12px;">
                                <thead>
                                    <tr style="background: #f5f5f5;">
                                        <th style="padding: 5px;">任务标题</th>
                                        <th style="padding: 5px;">开始日期</th>
                                        <th style="padding: 5px;">结束日期</th>
                                        <th style="padding: 5px;">父任务ID</th>
                                        <th style="padding: 5px;">操作</th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>

                        <div style="display: flex; gap: 10px; margin-top: 10px;">
                            <button id="create-batch-tasks" class="button-positive" style="flex: 1; background: #169F4B; color: white; padding: 8px;">创建所有任务</button>
                            <button id="config-api-key" style="background: #666; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;" title="配置 API Key 以确保请求认证">⚙️</button>
                        </div>

                        <div id="task-progress" style="margin-top: 10px; display: none;">
                            <div style="background: #f0f0f0; border-radius: 4px; overflow: hidden;">
                                <div id="progress-bar" style="height: 20px; background: #169F4B; width: 0%; transition: width 0.3s;"></div>
                            </div>
                            <div id="progress-text" style="text-align: center; margin-top: 5px; font-size: 12px;"></div>
                        </div>
                    </div>
                    
                    <!-- 拖拽手柄 -->
                    <div class="resize-handle" style="
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 20px;
                        height: 20px;
                        cursor: nw-resize;
                        background: #f0f0f0;
                        border-radius: 6px 0 0 0;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 12px;
                        color: #666;
                        user-select: none;
                        z-index: 1001;
                    " title="拖拽调整大小">⋮⋮</div>
                </div>

                <!-- 悬浮按钮，默认显示 -->
                <div id="batch-task-toggle" style="
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: #628DB6;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 60px;
                    height: 60px;
                    font-size: 28px;
                    font-weight: 300;
                    cursor: pointer;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                " title="批量创建任务">+</div>
            `;
        }

        bindBatchTaskEvents() {
            // 恢复上次保存的宽度和高度
            const savedWidth = localStorage.getItem('redmine_batch_creator_width');
            const savedHeight = localStorage.getItem('redmine_batch_creator_height');
            if (savedWidth) {
                $('#batch-task-creator').width(parseInt(savedWidth));
            }
            if (savedHeight) {
                $('#batch-task-creator').height(parseInt(savedHeight));
            }

            // 拖拽调整大小功能 - 从左上角拖动
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;

            $('.resize-handle').on('mousedown', function(e) {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                
                const $creator = $('#batch-task-creator');
                startWidth = $creator.width();
                startHeight = $creator.height();
                
                // 获取当前位置
                const position = $creator.position();
                startLeft = position.left;
                startTop = position.top;
                
                e.preventDefault();
            });

            $(document).on('mousemove', function(e) {
                if (!isResizing) return;
                
                // 计算鼠标移动距离
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                // 从左上角拖动：向左向上拖动增加尺寸，向右向下拖动减少尺寸
                const newWidth = startWidth - deltaX;
                const newHeight = startHeight - deltaY;
                
                // 设置最小和最大尺寸
                const minWidth = 500, maxWidth = 1200;
                const minHeight = 400, maxHeight = 800;
                
                const finalWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
                const finalHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));
                
                // 调整位置：当尺寸改变时，需要相应调整位置以保持右下角固定
                const newLeft = startLeft + (startWidth - finalWidth);
                const newTop = startTop + (startHeight - finalHeight);
                
                const $creator = $('#batch-task-creator');
                $creator.css({
                    width: finalWidth,
                    height: finalHeight,
                    left: newLeft,
                    top: newTop
                });
            });

            $(document).on('mouseup', function() {
                if (isResizing) {
                    isResizing = false;
                    // 保存宽度和高度
                    localStorage.setItem('redmine_batch_creator_width', $('#batch-task-creator').width());
                    localStorage.setItem('redmine_batch_creator_height', $('#batch-task-creator').height());
                }
            });

            const addTaskToList = () => {
                let title = $("#task-title-select").val() || $("#task-title").val().trim();

                if (!title) {
                    alert('请选择或输入任务标题！');
                    return;
                }

                const startDate = $("#task-start-date").val();
                const dueDate = $("#task-due-date").val();
                const parentId = $("#task-parent-id").val().trim() || this.defaultParentId;

                // 默认添加的都是父任务
                this.taskList.push({
                    title,
                    startDate,
                    dueDate,
                    parentId,
                    isParent: true, // 默认都是父任务
                    children: [], // 子任务列表
                    createdId: null // 创建后的任务ID
                });
                this.updateTaskList();

                // 清空输入
                $("#task-title-select").val('');
                $("#task-title").val('');
                // 清空日期时重置为今天（除非有特定任务类型被重新选择）
                const today = new Date();
                const todayString = this.formatDate(today);
                $("#task-start-date").val(todayString);
                $("#task-due-date").val('');
                $("#task-parent-id").val('');

                // 如果当前显示的是自定义输入框，重新聚焦
                if ($("#task-title").is(":visible")) {
                    $("#task-title").focus();
                } else {
                    $("#task-title-select").focus();
                }
            };

            // 监听开始日期变化，如果是开发任务则同步结束日期
            $("#task-start-date").change(() => {
                const selectedType = $("#task-title-select").val();
                if (selectedType === "开发任务") {
                    const startDate = $("#task-start-date").val();
                    $("#task-due-date").val(startDate);
                }
            });

            // 标题选择和自定义输入切换
            $("#task-title-select").change(() => {
                const selectedType = $("#task-title-select").val();
                if (selectedType) {
                    this.setDatesByTaskType(selectedType);
                }
                // 新增：如果是开发任务，结束日期同步为开始日期
                if (selectedType === "开发任务") {
                    const startDate = $("#task-start-date").val();
                    $("#task-due-date").val(startDate);
                }
            });

            // 常用标题相关逻辑
            function getCustomTitles() {
                return JSON.parse(localStorage.getItem('redmine_custom_titles') || '[]');
            }
            function setCustomTitles(titles) {
                localStorage.setItem('redmine_custom_titles', JSON.stringify(titles));
            }
            function renderCustomTitleList() {
                console.log('renderCustomTitleList', getCustomTitles());
                const titles = getCustomTitles();
                const $input = $("#task-title");
                const $list = $("#custom-title-list");
                // 确保下拉插入到body，避免被父容器裁剪
                if ($list.parent()[0] !== document.body) {
                    $list.appendTo('body');
                }
                $list.empty();
                if (titles.length === 0) {
                    $list.append('<div class="custom-title-empty" style="padding: 12px 16px; color: #bbb; text-align: center;">暂无常用标题</div>');
                    $list.show();
                    return;
                }
                titles.forEach(title => {
                    const $tag = $('<div class="custom-title-item">')
                        .text(title)
                        .on('mousedown', function(e) { // 用mousedown防止blur提前隐藏
                            e.preventDefault();
                            $input.val(title).focus();
                            $list.hide();
                        });
                    const $remove = $('<span class="custom-title-remove">×</span>')
                        .on('mousedown', function(e) {
                            e.stopPropagation();
                            const newTitles = getCustomTitles().filter(t => t !== title);
                            setCustomTitles(newTitles);
                            renderCustomTitleList();
                        });
                    $tag.append($remove);
                    $list.append($tag);
                });
                $list.show();
            }
            // 输入框内容变化时，控制按钮可用状态
            $(document).on('input', '#task-title', function() {
                const val = $(this).val().trim();
                if (val) {
                    $('#save-custom-title').prop('disabled', false);
                } else {
                    $('#save-custom-title').prop('disabled', true);
                }
            });
            // 初始化时禁用按钮
            $('#save-custom-title').prop('disabled', true);

            // 保存为常用按钮（事件委托）
            $(document).on('click', '#save-custom-title', function() {
                const val = $("#task-title").val().trim();
                if (!val) return;
                let titles = getCustomTitles();
                if (!titles.includes(val)) {
                    titles.push(val);
                    setCustomTitles(titles);
                    renderCustomTitleList();
                }
                // 清空输入框并禁用按钮
                $("#task-title").val('');
                $('#save-custom-title').prop('disabled', true);
                $("#task-title").focus();
            });
            // 自定义输入框显示时，显示保存按钮和常用标题
            function showCustomTitleUI(show) {
                if (show) {
                    $("#save-custom-title").css('display', 'inline-block');
                    // 不自动显示下拉，等聚焦时再显示
                } else {
                    $("#save-custom-title").hide();
                    $("#custom-title-list").hide();
                }
            }
            // 下拉列表样式和显示逻辑
            $(document).ready(function() {
                const $input = $("#task-title");
                const $list = $("#custom-title-list");
                // 设置下拉样式
                $list.css({
                    position: 'absolute',
                    background: '#fff',
                    border: '1px solid #ccc',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    zIndex: 2000,
                    minWidth: '180px',
                    maxHeight: '200px',
                    overflowY: 'auto',
                    display: 'none',
                    marginTop: '0',
                    borderRadius: '4px',
                    padding: 0
                });
                // 输入框聚焦时显示下拉
                $input.on('focus', function() {
                    if ($input.is(":visible")) {
                        renderCustomTitleList();
                        // 定位下拉到输入框下方
                        const offset = $input.offset();
                        $list.css({
                            left: offset.left,
                            top: offset.top + $input.outerHeight() - 1, // 让边框重合
                            width: $input.outerWidth(),
                            background: '#fff', // 保证不会透明被遮挡
                            zIndex: 99999,
                            position: 'absolute'
                        });
                        $list.show();
                    }
                });

                // 新增：点击输入框时也显示下拉列表
                $input.on('click', function() {
                    if ($input.is(":visible")) {
                        renderCustomTitleList();
                        // 定位下拉到输入框下方
                        const offset = $input.offset();
                        $list.css({
                            left: offset.left,
                            top: offset.top + $input.outerHeight() - 1,
                            width: $input.outerWidth(),
                            background: '#fff',
                            zIndex: 99999,
                            position: 'absolute'
                        });
                        $list.show();
                    }
                });
                // 鼠标悬停高亮
                $(document).on('mouseenter', '.custom-title-item', function() {
                    $(this).css('background', '#e6f7ff');
                }).on('mouseleave', '.custom-title-item', function() {
                    $(this).css('background', '');
                });

                // 防止下拉列表滚动影响外部滚动
                $list.on('wheel', function(e) {
                    e.stopPropagation();
                    const scrollTop = this.scrollTop;
                    const scrollHeight = this.scrollHeight;
                    const height = this.clientHeight;
                    const delta = e.originalEvent.deltaY;

                    // 检查是否在边界
                    if ((delta < 0 && scrollTop <= 0) || (delta > 0 && scrollTop + height >= scrollHeight)) {
                        e.preventDefault();
                    }
                });

                // 修改：点击下拉列表外部时隐藏
                $(document).on('click', function(e) {
                    if (!$(e.target).closest('#custom-title-list, #task-title').length) {
                        $list.hide();
                    }
                });
            });

            $("#use-custom-title").click(() => {
                const select = $("#task-title-select");
                const input = $("#task-title");
                const button = $("#use-custom-title");

                if (input.is(":visible")) {
                    // 切换回选择模式
                    input.hide();
                    select.show();
                    button.text("自定义").attr("title", "使用自定义标题");
                    select.focus();
                    showCustomTitleUI(false);
                } else {
                    // 切换到自定义输入模式
                    select.hide();
                    input.show();
                    button.text("选择").attr("title", "从预设选项中选择");
                    input.focus();
                    // 切换到自定义模式时，设置默认日期为今天
                    const today = new Date();
                    const todayString = this.formatDate(today);
                    $("#task-start-date").val(todayString);
                    $("#task-due-date").val('');
                    showCustomTitleUI(true);
                }
            });

            // 绑定原有事件
            $("#task-title, #task-parent-id").keypress((e) => {
                if (e.which === 13) {
                    addTaskToList();
                }
            });

            // 为下拉选择也绑定回车事件
            $("#task-title-select").keypress((e) => {
                if (e.which === 13) {
                    addTaskToList();
                }
            });

            $("#add-task").click(addTaskToList);

            $("#close-task-creator").click(() => {
                $("#batch-task-creator").hide();
                $("#batch-task-toggle").show();
            });

            $("#batch-task-toggle").click(() => {
                $("#batch-task-creator").show();
                $("#batch-task-toggle").hide();
            });

            // 确保按钮事件绑定正确
            $("#create-batch-tasks").click(() => {
                console.log('=== 创建所有任务按钮被点击 ===');
                this.createAllTasks();
            });

            // API Key 配置按钮事件
            $("#config-api-key").click(() => {
                this.showApiKeyConfig();
            });

            // ESC键关闭面板
            $(document).keydown((e) => {
                if (e.key === 'Escape') {
                    $("#batch-task-creator").hide();
                    $("#batch-task-toggle").show();
                }
            });

            // 新增：模式切换逻辑
            const applyMode = (mode) => {
                if (mode === 'custom') {
                    $("#task-title-select").hide();
                    $("#task-title").show();
                    $("#use-custom-title").text("选择").attr("title", "从预设选项中选择");
                    showCustomTitleUI(true);
                } else {
                    $("#task-title-select").show();
                    $("#task-title").hide();
                    $("#use-custom-title").text("自定义").attr("title", "使用自定义标题");
                    showCustomTitleUI(false);
                }
            };
            // 监听模式切换
            $("#task-mode-switch").change(function() {
                const mode = $(this).val();
                localStorage.setItem('redmine_task_mode', mode);
                applyMode(mode);
            });
            // 初始化时应用本地模式
            const savedMode = localStorage.getItem('redmine_task_mode') || 'select';
            applyMode(savedMode);
            // 保证自定义/选择按钮与模式联动
            $("#use-custom-title").off('click').on('click', function() {
                const mode = $("#task-mode-switch").val();
                if (mode === 'custom') {
                    // 切换到选择模式
                    $("#task-mode-switch").val('select').trigger('change');
                } else {
                    // 切换到自定义模式
                    $("#task-mode-switch").val('custom').trigger('change');
                }
            });
        }

        updateTaskList() {
            const tbody = $("#task-list tbody");
            tbody.empty();

            if (this.taskList.length === 0) {
                tbody.append('<tr><td colspan="6" style="text-align: center; color: #999; padding: 20px;">暂无任务</td></tr>');
                return;
            }

            this.taskList.forEach((task, index) => {
                // 父任务行
                const parentTr = $('<tr>').append(
                    $('<td style="padding: 3px;">').append(
                        $('<input type="text" class="task-title-edit" style="width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;">')
                            .val(task.title)
                            .on('change', (e) => {
                                this.taskList[index].title = $(e.target).val();
                            })
                    ),
                    $('<td style="padding: 3px;">').append(
                        $('<input type="date" class="task-start-date-edit" style="width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;">')
                            .val(task.startDate || '')
                            .on('change', (e) => {
                                this.taskList[index].startDate = $(e.target).val();
                            })
                    ),
                    $('<td style="padding: 3px;">').append(
                        $('<input type="date" class="task-due-date-edit" style="width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;">')
                            .val(task.dueDate || '')
                            .on('change', (e) => {
                                this.taskList[index].dueDate = $(e.target).val();
                            })
                    ),
                    $('<td style="padding: 3px;">').append(
                        $('<input type="text" class="task-parent-id-edit" style="width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;" placeholder="父任务ID">')
                            .val(task.parentId || '')
                            .on('change', (e) => {
                                this.taskList[index].parentId = $(e.target).val();
                            })
                    ),
                    $('<td style="padding: 3px; text-align: center;">').text('父任务'),
                    $('<td style="padding: 3px;">').append(
                        $('<button class="button" style="padding: 2px 8px; font-size: 11px; margin-right: 5px;" title="添加子任务">+子任务</button>').click(() => {
                            this.addChildTask(index);
                        }),
                        $('<a href="#" style="color: #d00; text-decoration: none;" title="删除">×</a>').click((e) => {
                            e.preventDefault();
                            this.taskList.splice(index, 1);
                            this.updateTaskList();
                        })
                    )
                );
                tbody.append(parentTr);

                // 子任务行
                task.children.forEach((childTask, childIndex) => {
                    const childTr = $('<tr style="background: #f9f9f9;">').append(
                        $('<td style="padding: 3px; padding-left: 20px;">').append(
                            $('<span style="color: #666; margin-right: 5px;">└─</span>'),
                            $('<input type="text" class="child-task-title-edit" style="width: calc(100% - 20px); padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;">')
                                .val(childTask.title)
                                .on('change', (e) => {
                                    this.taskList[index].children[childIndex].title = $(e.target).val();
                                })
                        ),
                        $('<td style="padding: 3px;">').append(
                            $('<input type="date" class="child-start-date-edit" style="width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;">')
                                .val(childTask.startDate || '')
                                .on('change', (e) => {
                                    this.taskList[index].children[childIndex].startDate = $(e.target).val();
                                })
                        ),
                        $('<td style="padding: 3px;">').append(
                            $('<input type="date" class="child-due-date-edit" style="width: 100%; padding: 2px; border: 1px solid #ddd; border-radius: 2px; box-sizing: border-box;">')
                                .val(childTask.dueDate || '')
                                .on('change', (e) => {
                                    this.taskList[index].children[childIndex].dueDate = $(e.target).val();
                                })
                        ),
                        $('<td style="padding: 3px; text-align: center; color: #999;">').text('自动设置'),
                        $('<td style="padding: 3px; text-align: center;">').text('子任务'),
                        $('<td style="padding: 3px;">').append(
                            $('<a href="#" style="color: #d00; text-decoration: none;" title="删除">×</a>').click((e) => {
                                e.preventDefault();
                                this.taskList[index].children.splice(childIndex, 1);
                                this.updateTaskList();
                            })
                        )
                    );
                    tbody.append(childTr);
                });
            });
        }

        // 新增：为父任务添加子任务
        addChildTask(parentIndex) {
            const parentTask = this.taskList[parentIndex];
            if (!parentTask) return;

            // 关闭已存在的子任务对话框
            const existingDialog = $('#child-task-dialog');
            if (existingDialog.length > 0) {
                existingDialog.remove();
            }

            // 创建子任务输入对话框
            const childTaskDialog = $(`
                <div id="child-task-dialog" style="
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    border: 2px solid #628DB6;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 2000;
                    min-width: 400px;
                ">
                    <h4 style="margin: 0 0 15px 0; color: #628DB6;">为父任务"${parentTask.title}"添加子任务</h4>
                    <div style="margin-bottom: 10px;">
                        <div style="display: flex; gap: 5px; margin-bottom: 5px; align-items: stretch;">
                            <input type="text" id="child-task-title" placeholder="子任务标题" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; height: 36px; line-height: 20px;">
                            <button id="save-child-title-common" style="padding: 8px 12px; background: #f5f5f5; border: 1px solid #ddd; border-radius: 4px; color: #628DB6; cursor: pointer; white-space: nowrap; height: 36px; line-height: 20px; box-sizing: border-box;">保存为常用</button>
                        </div>
                        <div id="child-custom-title-list" style="margin-top: 5px;"></div>
                    </div>
                    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                        <input type="date" id="child-start-date" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <input type="date" id="child-due-date" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end;">
                        <button id="cancel-child-task" class="button" style="padding: 8px 16px;">关闭</button>
                    </div>
                </div>
            `);

            // 设置默认日期
            const today = new Date();
            const todayString = this.formatDate(today);
            childTaskDialog.find('#child-start-date').val(todayString);

            // 添加到页面
            $('body').append(childTaskDialog);

            // 绑定事件
            childTaskDialog.find('#cancel-child-task').click(() => {
                childTaskDialog.remove();
            });

            // 回车添加子任务
            childTaskDialog.find('#child-task-title').keypress((e) => {
                if (e.which === 13) {
                    this.addChildTaskFromDialog(childTaskDialog, parentIndex);
                }
            });

            // ESC关闭
            childTaskDialog.find('input').keydown((e) => {
                if (e.keyCode === 27) {
                    childTaskDialog.find('#cancel-child-task').click();
                }
            });

            // 保存为常用按钮
            childTaskDialog.find('#save-child-title-common').click(() => {
                const val = childTaskDialog.find('#child-task-title').val().trim();
                if (!val) {
                    alert('请输入子任务标题');
                    return;
                }
                this.saveCustomTitle(val);
                this.renderChildCustomTitleList(childTaskDialog);
            });

            // 渲染常用标题列表
            this.renderChildCustomTitleList(childTaskDialog);

            // 聚焦到标题输入框
            setTimeout(() => {
                childTaskDialog.find('#child-task-title').focus();
            }, 100);
        }

        // 修改：渲染子任务常用标题列表（改为下拉框形式）
        renderChildCustomTitleList(dialog) {
            const $input = dialog.find('#child-task-title');
            const $list = dialog.find('#child-custom-title-list');
            const titles = this.getCustomTitles();
            $list.empty();

            if (titles.length === 0) {
                $list.append('<div style="padding: 8px; color: #999; text-align: center; font-size: 12px;">暂无常用标题</div>');
                return;
            }

            // 创建下拉框样式的常用标题列表
            const $dropdown = $('<div style="border: 1px solid #ddd; border-radius: 4px; background: #fff; max-height: 120px; overflow-y: auto;">');

            titles.forEach(title => {
                const $item = $(`<div class="child-custom-title-item" style="padding: 6px 8px; cursor: pointer; border-bottom: 1px solid #f0f0f0; font-size: 12px;">${title}</div>`);
                $item.hover(
                    () => $item.css('background', '#f5f5f5'),
                    () => $item.css('background', '#fff')
                );
                $item.click(() => {
                    $input.val(title);
                    $input.focus();
                });
                $dropdown.append($item);
            });

            // 移除最后一个项目的底部边框
            $dropdown.find('.child-custom-title-item:last-child').css('border-bottom', 'none');

            $list.append($dropdown);
        }

        // 新增：从对话框添加子任务（不自动保存为常用）
        addChildTaskFromDialog(dialog, parentIndex) {
            const childTitle = dialog.find('#child-task-title').val().trim();
            const childStartDate = dialog.find('#child-start-date').val();
            const childDueDate = dialog.find('#child-due-date').val();

            if (!childTitle) {
                alert('请输入子任务标题！');
                return;
            }

            // 添加子任务到父任务的children数组
            this.taskList[parentIndex].children.push({
                title: childTitle,
                startDate: childStartDate,
                dueDate: childDueDate,
                parentId: null, // 由系统自动设置
                isParent: false
            });

            // 不自动保存为常用
            // this.saveCustomTitle(childTitle);

            // 更新任务列表
            this.updateTaskList();

            // 清空输入框，准备添加下一个子任务
            dialog.find('#child-task-title').val('');
            dialog.find('#child-due-date').val('');
            // 保持开始日期不变
            const today = new Date();
            const todayString = this.formatDate(today);
            dialog.find('#child-start-date').val(todayString);

            // 聚焦到标题输入框
            setTimeout(() => {
                dialog.find('#child-task-title').focus();
            }, 100);
        }

        // 新增：初始化子任务常用标题功能
        initChildCustomTitleFeature(dialog) {
            const $input = dialog.find('#child-task-title');
            const $select = dialog.find('#child-task-title-select');
            const $list = dialog.find('#child-custom-title-list');

            // 设置下拉列表样式
            $list.css({
                position: 'fixed', // 改为fixed定位
                background: '#fff',
                border: '1px solid #ccc',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                zIndex: 2001,
                minWidth: '180px',
                maxHeight: '200px',
                overflowY: 'auto',
                display: 'none',
                marginTop: '0',
                borderRadius: '4px'
            });

            // 点击输入框显示下拉
            $input.on('click', function() {
                if ($(this).is(":visible")) {
                    renderChildCustomTitleList();
                    // 定位下拉到输入框下方
                    const inputOffset = $(this).offset();
                    const dialogOffset = dialog.offset();

                    // 计算相对于对话框的位置
                    const relativeLeft = inputOffset.left - dialogOffset.left;
                    const relativeTop = inputOffset.top - dialogOffset.top + $(this).outerHeight() - 1;

                    $list.css({
                        left: dialogOffset.left + relativeLeft,
                        top: dialogOffset.top + relativeTop,
                        width: $(this).outerWidth(),
                        background: '#fff',
                        zIndex: 99999,
                        position: 'fixed'
                    });
                    $list.show();
                }
            });

            // 点击外部隐藏下拉
            $(document).on('click', function(e) {
                if (!$(e.target).closest('#child-custom-title-list, #child-task-title').length) {
                    $list.hide();
                }
            });

            // 防止下拉列表滚动影响外部滚动
            $list.on('wheel', function(e) {
                e.stopPropagation();
                const scrollTop = this.scrollTop;
                const scrollHeight = this.scrollHeight;
                const height = this.clientHeight;
                const delta = e.originalEvent.deltaY;

                if ((delta < 0 && scrollTop <= 0) || (delta > 0 && scrollTop + height >= scrollHeight)) {
                    e.preventDefault();
                }
            });

            // 渲染常用标题列表
            function renderChildCustomTitleList() {
                const titles = getCustomTitles();
                $list.empty();

                if (titles.length === 0) {
                    $list.append('<div style="padding: 10px; color: #999; text-align: center;">暂无常用标题</div>');
                    return;
                }

                titles.forEach(title => {
                    const $item = $(`<div class="child-custom-title-item" style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;">${title}</div>`);
                    $item.hover(
                        () => $item.css('background', '#f0f0f0'),
                        () => $item.css('background', '')
                    );
                    $item.click(() => {
                        $input.val(title);
                        $list.hide();
                        // 自动添加子任务
                        setTimeout(() => {
                            $input.trigger($.Event('keypress', { which: 13 }));
                        }, 100);
                    });
                    $list.append($item);
                });
            }

            // 获取常用标题
            function getCustomTitles() {
                return JSON.parse(localStorage.getItem('redmine_custom_titles') || '[]');
            }
        }

        // 新增：填充子任务标题下拉框
        populateChildTitleSelect($select) {
            const titles = this.getCustomTitles();
            $select.find('option:not(:first)').remove(); // 保留第一个选项

            titles.forEach(title => {
                $select.append(`<option value="${title}">${title}</option>`);
            });
        }

        // 新增：获取常用标题
        getCustomTitles() {
            return JSON.parse(localStorage.getItem('redmine_custom_titles') || '[]');
        }

        // 新增：保存常用标题
        saveCustomTitle(title) {
            const titles = this.getCustomTitles();
            if (!titles.includes(title)) {
                titles.unshift(title);
                if (titles.length > 10) titles.pop();
                localStorage.setItem('redmine_custom_titles', JSON.stringify(titles));
            }
        }

        // 新增：格式化日期
        formatDate(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // 修改：创建所有任务的方法
        createAllTasks() {
            if (this.taskList.length === 0) {
                alert('请至少添加一个任务！');
                return;
            }

            // 调试任务列表
            this.debugTaskList();

            // 显示进度条
            $("#task-progress").show();
            $("#create-batch-tasks").prop('disabled', true).text('正在创建...');

            let completedTasks = 0;
            let successCount = 0;
            let failCount = 0;
            const totalTasks = this.getTotalTaskCount();
            const childTaskCount = this.getChildTaskCount();

            console.log(`开始创建任务，总计: ${totalTasks}个 (父任务: ${this.taskList.length}个, 子任务: ${childTaskCount}个)`);

            // 先创建所有父任务
            this.createParentTasks((parentSuccess, parentFail) => {
                console.log(`父任务创建回调执行: 成功${parentSuccess}个，失败${parentFail}个`);

                successCount += parentSuccess;
                failCount += parentFail;
                completedTasks += this.taskList.length;

                // 更新进度
                const progress = (completedTasks / totalTasks) * 100;
                $("#progress-bar").css('width', progress + '%');
                $("#progress-text").text(`父任务完成: ${completedTasks}/${totalTasks} (成功: ${successCount}, 失败: ${failCount})`);

                console.log(`父任务创建完成，开始创建子任务...`);

                // 再创建所有子任务
                this.createChildTasks((childSuccess, childFail) => {
                    console.log(`子任务创建回调执行: 成功${childSuccess}个，失败${childFail}个`);

                    successCount += childSuccess;
                    failCount += childFail;
                    completedTasks += childTaskCount;

                    const message = `任务创建完成！\n成功：${successCount}个\n失败：${failCount}个`;
                    if (window.confirm(message + '\n是否刷新页面查看最新状态？')) {
                        this.refreshPageContent();
                    }

                    // 重置界面
                    $("#task-progress").hide();
                    $("#create-batch-tasks").prop('disabled', false).text('创建所有任务');
                    this.taskList = [];
                    this.updateTaskList();
                });
            });
        }

        // 新增：调试方法，检查任务列表结构
        debugTaskList() {
            console.log('=== 调试任务列表 ===');
            console.log('任务列表长度:', this.taskList.length);

            this.taskList.forEach((task, index) => {
                console.log(`任务 ${index}:`, {
                    title: task.title,
                    isParent: task.isParent,
                    hasChildren: task.children && task.children.length > 0,
                    childrenCount: task.children ? task.children.length : 0,
                    children: task.children
                });
            });

            console.log('=== 调试结束 ===');
        }

        // 修改：创建父任务方法 - 使用正确的父任务ID
        createParentTasks(callback) {
            const parentTasks = this.taskList.filter(task => task.isParent);
            
            if (parentTasks.length === 0) {
                console.log('没有父任务需要创建');
                if (callback) callback(0, 0);
                return;
            }

            console.log(`开始创建 ${parentTasks.length} 个父任务`);
            
            let completedCount = 0;
            let successCount = 0;
            let failCount = 0;
            const createdParentTasks = [];

            const createNextParent = (index) => {
                if (index >= parentTasks.length) {
                    console.log('所有父任务创建完成');
                    
                    if (createdParentTasks.length === 0) {
                        console.warn('没有成功创建的父任务，不会创建子任务');
                    } else {
                        console.log(`成功创建了 ${createdParentTasks.length} 个父任务，将更新子任务的父任务ID`);
                        this.updateTaskListWithCreatedIds(createdParentTasks);
                    }
                    
                    if (callback) callback(successCount, failCount);
                    return;
                }

                const task = parentTasks[index];
                console.log(`创建父任务 ${index + 1}/${parentTasks.length}: ${task.title}`);
                
                // 修改：使用任务对象中的parentId，如果没有则使用defaultParentId
                const useParentId = task.parentId || this.defaultParentId;
                console.log(`父任务使用的父ID: ${useParentId} (任务配置的parentId: ${task.parentId}, 默认parentId: ${this.defaultParentId})`);

                this.createTask(task, useParentId, this.baseUrl, this.currentUserId, (success, taskId) => {
                    completedCount++;
                    
                    if (success && taskId) {
                        successCount++;
                        console.log(`父任务创建成功: ${task.title}，ID: ${taskId}`);
                        
                        createdParentTasks.push({
                            originalTask: task,
                            createdId: taskId,
                            title: task.title
                        });
                        task.createdId = taskId;
                        
                    } else {
                        failCount++;
                        if (success && !taskId) {
                            console.error(`父任务创建失败: ${task.title} - 未获取到任务ID`);
                        } else {
                            console.error(`父任务创建失败: ${task.title} - 创建请求失败`);
                        }
                    }

                    setTimeout(() => {
                        createNextParent(index + 1);
                    }, 1000);
                });
            };

            createNextParent(0);
        }

        // 新增：更新任务列表中的父任务ID
        updateTaskListWithCreatedIds(createdParentTasks) {
            console.log('更新子任务的父任务ID...');
            
            this.taskList.forEach(task => {
                if (!task.isParent && task.children) {
                    // 对于子任务，查找对应的父任务
                    task.children.forEach(childTask => {
                        if (childTask.parentTaskTitle) {
                            // 查找对应的父任务
                            const parentTask = createdParentTasks.find(parent => 
                                parent.title === childTask.parentTaskTitle
                            );
                            
                            if (parentTask && parentTask.createdId) {
                                childTask.parentId = parentTask.createdId;
                                console.log(`子任务 ${childTask.title} 的父任务ID更新为: ${parentTask.createdId}`);
                            } else {
                                console.warn(`找不到子任务 ${childTask.title} 的父任务: ${childTask.parentTaskTitle}`);
                            }
                        }
                    });
                }
            });
        }

        // 修改：创建子任务方法 - 检查父任务ID
        createChildTasks(callback) {
            const childTasks = [];
            
            // 收集所有子任务，但只包括有有效父任务ID的
            this.taskList.forEach(task => {
                if (task.children && task.children.length > 0 && task.createdId) {
                    // 只有父任务有createdId才添加子任务
                    task.children.forEach(childTask => {
                        childTasks.push({
                            ...childTask,
                            parentId: task.createdId, // 使用新创建的父任务ID
                            parentTaskTitle: task.title // 保存父任务标题用于调试
                        });
                    });
                } else if (task.children && task.children.length > 0 && !task.createdId) {
                    console.warn(`跳过父任务 "${task.title}" 的子任务，因为父任务ID获取失败`);
                }
            });
            
            if (childTasks.length === 0) {
                console.log('没有子任务需要创建（可能父任务创建失败或没有子任务）');
                if (callback) callback(0, 0);
                return;
            }

            console.log(`开始创建 ${childTasks.length} 个子任务`);
            
            let completedCount = 0;
            let successCount = 0;
            let failCount = 0;

            const createNextChild = (index) => {
                if (index >= childTasks.length) {
                    console.log('所有子任务创建完成');
                    if (callback) callback(successCount, failCount);
                    return;
                }

                const task = childTasks[index];
                
                console.log(`创建子任务 ${index + 1}/${childTasks.length}: ${task.title}, 父任务ID: ${task.parentId}`);

                this.createTask(task, task.parentId, this.baseUrl, this.currentUserId, (success, taskId) => {
                    completedCount++;
                    
                    if (success) {
                        successCount++;
                        console.log(`子任务创建成功: ${task.title}，ID: ${taskId || '未获取'}`);
                        if (taskId) {
                            task.createdId = taskId;
                        }
                    } else {
                        failCount++;
                        console.error(`子任务创建失败: ${task.title}`);
                    }

                    // 添加延迟后创建下一个任务
                    setTimeout(() => {
                        createNextChild(index + 1);
                    }, 1000); // 1秒延迟
                });
            };

            createNextChild(0);
        }

        // 修改：创建任务方法 - 使用表单方式
        createTask(task, parentIssueId, baseUrl, userId, callback) {
            console.log(`开始创建任务: "${task.title}"`);
            console.log('父任务ID:', parentIssueId);
            console.log('项目ID:', this.projectId);

            const formData = new FormData();

            // 获取 CSRF Token
            const csrfToken = this.getCSRFToken();
            if (csrfToken) {
                formData.append('authenticity_token', csrfToken);
                console.log('已添加 CSRF Token 到 FormData:', csrfToken.substring(0, 10) + '...');
            } else {
                console.error('未找到 CSRF Token，请求可能会失败！');
                // 尝试从当前页面的表单获取
                const pageToken = $('meta[name="csrf-token"]').attr('content') ||
                                 $('input[name="authenticity_token"]:first').val();
                if (pageToken) {
                    formData.append('authenticity_token', pageToken);
                    console.log('从页面获取到备用 CSRF Token');
                }
            }

            formData.append('issue[subject]', task.title);
            formData.append('issue[assigned_to_id]', userId);

            // 添加项目ID（如果有的话）
            if (this.projectId) {
                formData.append('issue[project_id]', this.projectId);
                console.log('设置项目ID:', this.projectId);
            }

            if (parentIssueId) {
                formData.append('issue[parent_issue_id]', parentIssueId);
            }

            if (task.startDate && /^\d{4}-\d{2}-\d{2}$/.test(task.startDate)) {
                formData.append('issue[start_date]', task.startDate);
            }

            if (task.dueDate && /^\d{4}-\d{2}-\d{2}$/.test(task.dueDate)) {
                formData.append('issue[due_date]', task.dueDate);
            }

            // 使用表单方式创建任务
            this.createTaskWithForm(formData, baseUrl, task, callback);
        }

        // 使用表单方式创建任务
        async createTaskWithForm(formData, baseUrl, task, callback) {
            try {
                // 构建正确的表单提交URL
                const submitUrl = baseUrl || `${window.location.origin}/issues`;

                // 对于 FormData 请求，只添加必要的头部
                const headers = {
                    'X-Requested-With': 'XMLHttpRequest'
                };

                // 如果有 API Key，添加到头部
                const apiKey = this.getAPIKey();
                if (apiKey) {
                    headers['X-Redmine-API-Key'] = apiKey;
                }

                console.log('=== 表单任务创建请求 ===');
                console.log('提交URL:', submitUrl);
                console.log('请求头信息:', headers);

                // 使用统一的调试方法
                this.debugAuthInfo('任务创建(表单)', formData);

                const response = await fetch(submitUrl, {
                    method: 'POST',
                    body: formData,
                    headers: headers,
                    credentials: 'same-origin' // 包含同源 cookies
                });

                console.log(`任务 "${task.title}" 响应状态:`, response.status);
                console.log(`任务 "${task.title}" 响应类型:`, response.type);
                console.log('响应头信息:', [...response.headers.entries()]);

                // 检查各种错误状态
                if (response.status === 401) {
                    const responseText = await response.text();
                    console.error('身份验证失败，响应内容:', responseText);
                    throw new Error(`身份验证失败 (401): 请检查 CSRF Token 或 API Key 配置。建议点击 ⚙️ 按钮配置 API Key`);
                } else if (response.status === 403) {
                    const responseText = await response.text();
                    console.error('权限不足，响应内容:', responseText);
                    throw new Error(`权限不足 (403): 当前用户没有创建任务的权限`);
                } else if (response.status === 404) {
                    const responseText = await response.text();
                    console.error('API端点未找到，响应内容:', responseText);
                    console.error('请求的URL:', apiUrl);
                    console.error('可能的原因：');
                    console.error('1. Redmine版本不支持REST API');
                    console.error('2. API功能未启用');
                    console.error('3. URL构建错误');
                    throw new Error(`API端点未找到 (404): 请检查Redmine是否启用了REST API功能`);
                } else if (response.status === 422) {
                    const responseText = await response.text();
                    console.error('请求参数错误，响应内容:', responseText);
                    console.error('发送的数据:', JSON.stringify(issueData, null, 2));
                    throw new Error(`请求参数错误 (422): ${responseText}`);
                }

                let taskId = null;

                if (response.status === 302 || response.status === 301) {
                    // 处理重定向响应（表单提交成功通常返回重定向）
                    const location = response.headers.get('Location');
                    console.log(`任务 "${task.title}" Location头:`, location);

                    if (location) {
                        const locationMatch = location.match(/\/issues\/(\d+)/);
                        if (locationMatch) {
                            taskId = locationMatch[1];
                            console.log(`从Location头成功提取任务ID: ${taskId}`);
                        } else {
                            console.warn('Location头存在但未找到任务ID:', location);
                        }
                    } else {
                        console.warn('302/301响应但未找到Location头');
                    }
                } else if (response.status >= 200 && response.status < 300) {
                    // 成功响应，尝试从响应URL中提取
                    const urlMatch = response.url.match(/\/issues\/(\d+)/);
                    if (urlMatch) {
                        taskId = urlMatch[1];
                        console.log(`从响应URL提取任务ID: ${taskId}`);
                    } else {
                        console.log(`从响应URL提取任务ID失败: ${response.url}`);
                    }
                } else {
                    console.error(`任务 "${task.title}" 创建失败:`, response.status, response.statusText);
                    if (callback) callback(false, null);
                    return;
                }

                if (taskId) {
                    console.log(`✅ 任务 "${task.title}" 创建成功，任务ID: ${taskId}`);
                    if (callback) callback(true, taskId);
                } else {
                    console.warn(`❌ 任务 "${task.title}" 创建失败 - 无法获取任务ID`);
                    if (callback) callback(false, null);
                }

            } catch (error) {
                console.error(`任务 "${task.title}" fetch请求失败:`, error);
                if (callback) callback(false, null);
            }
        }

        // 新增：初始化任务过滤功能
        initTaskFilter() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            // 检查是否已经存在控制面板，避免重复创建
            if ($("#issue-tree-controls").length > 0) {
                console.log('任务过滤控制面板已存在，跳过重复初始化');
                return;
            }

            // 创建控制面板
            const controlPanel = `
                <div id="issue-tree-controls" style="margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 3px; border: 1px solid #ddd;">
                    <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                        <label style="display: flex; align-items: center; cursor: pointer; margin: 0;">
                            <input type="checkbox" id="task-filter-switch" style="margin-right: 8px;">
                            <span>我的任务</span>
                        </label>
                        <div style="display: flex; gap: 10px;">
                            <button id="collapse-all-btn" class="button" style="font-size: 12px; padding: 4px 8px;">一键折叠</button>
                            <button id="expand-all-btn" class="button" style="font-size: 12px; padding: 4px 8px;">一键展开</button>
                            <button id="time-logging-btn" class="button" style="font-size: 12px; padding: 4px 8px; background: #28a745; color: white;">登记工时</button>
                            <button id="scroll-today-task-btn" class="button" style="font-size: 12px; padding: 4px 8px; display: none; background: #ffe066; color: #333;">定位到今天的任务</button>
                        </div>
                        <div  id="task-filter-switch-other" style="display: none; align-items: center; gap: 6px;">
                            <select id="assignee-filter-select" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px; min-width: 180px;">
                                <option value="">加载中...</option>
                            </select>
                        </div>
                    </div>

                    <!-- 批量变更任务状态功能 -->
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #ddd;">
                        <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                            <span style="font-size: 12px; color: #666;">批量变更状态:</span>
                            <select id="batch-status-select" style="padding: 4px 8px; font-size: 12px; border: 1px solid #ccc; border-radius: 3px;">
                                <option value="">请先选择要变更的任务</option>
                            </select>
                            <button id="batch-update-status-btn" class="button" style="font-size: 12px; padding: 4px 8px; background: #169F4B; color: white; border: none; border-radius: 3px;" disabled>批量更新</button>
                            <button id="batch-complete-btn" class="button" style="font-size: 12px; padding: 4px 8px; background: #FF6B35; color: white; border: none; border-radius: 3px;" disabled>批量完成</button>
                            <span id="selected-tasks-count" style="font-size: 12px; color: #666;">已选择: 0 个任务</span>
                        </div>
                    </div>
                     <!-- 日期显示模式切换 -->
                    <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                        <span style="font-size: 12px; color: #666;">日期显示规则:</span>
                        <select id="date-display-mode" style="padding: 2px; font-size: 12px;">
                             <option value="date">日期</option>
                             <option value="week">周几</option>
                        </select>
                    </div>
                </div>
            `;

            // 插入到issue_tree的第一个元素
            $issueTree.prepend(controlPanel);

            // 读取本地设置
            const checked = localStorage.getItem('redmine_my_task_filter') === '1';
            $("#task-filter-switch").prop('checked', checked);

            // 初始化人员筛选下拉框（不使用本地存储）
            this.assigneeFilterUserId = this.currentUserId || '';
            this.loadAndPopulateAssigneeFilter();

            // 绑定人员下拉框事件
            $('#assignee-filter-select').on('change', (e) => {
                const val = (e.target.value || '').trim();
                this.assigneeFilterUserId = val || this.currentUserId;
                // 不再保存到本地存储，因为中途可能新增人员
                if ($('#task-filter-switch').is(':checked')) {
                    this.filterMyTasks();
                }
                // 更新按钮显示状态
                this.updateTodayTaskButtonVisibility();
            });

            // 绑定刷新人员列表按钮事件
            $('#refresh-users-btn').on('click', () => {
                this.refreshTaskRelatedUsers();
            });

            // 首次加载时根据本地设置自动过滤
            if (checked) {
                this.filterMyTasks();
            }
            // 统一更新按钮显示状态
            this.updateTodayTaskButtonVisibility();

            // 绑定过滤开关事件
            $("#task-filter-switch").change((e) => {
                if (e.target.checked) {
                    localStorage.setItem('redmine_my_task_filter', '1');
                    this.filterMyTasks();
                } else {
                    localStorage.setItem('redmine_my_task_filter', '0');
                    this.showAllTasks();
                }
                // 统一更新按钮显示状态
                this.updateTodayTaskButtonVisibility();
            });

            // 绑定一键折叠按钮事件
            $("#collapse-all-btn").click(() => {
                this.collapseAllTasks();
            });

            // 绑定一键展开按钮事件
            $("#expand-all-btn").click(() => {
                this.expandAllTasks();
            });

            // 绑定登记工时按钮事件
            $("#time-logging-btn").click(() => {
                this.toggleTimeLoggingMode();
            });



            // 绑定定位到今天的任务按钮事件
            $(document).on('click', '#scroll-today-task-btn', () => {
                this.scrollToTodayTask();
            });

            // 初始化批量变更状态功能
            this.initBatchStatusUpdate();

            // 绑定切换事件
            $('#date-display-mode').change((e) => {
                const mode = e.target.value;
                localStorage.setItem('redmine_date_display_mode', mode);
                this.updateDateDisplay(mode);
            });

            // 从本地存储恢复上次选择的模式
            const savedMode = localStorage.getItem('redmine_date_display_mode') || 'date';
            $('#date-display-mode').val(savedMode);

            // 初始化显示
            this.updateDateDisplay(savedMode);
        }

        // 修改：基于DOM属性的任务筛选 - 修复逻辑
        filterMyTasks() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            const targetUserId = this.getActiveFilterUserId();
            if (!targetUserId) {
                console.error('未找到目标用户ID，无法筛选任务');
                return;
            }

            console.log('开始筛选我的任务...');

            // 1. 先隐藏所有任务
            $issueTree.find('tr.issue').hide();

            // 2. 显示我的任务
            const $myTasks = $issueTree.find(`tr.issue td.assigned_to a.user[href$="/users/${targetUserId}"]`).closest('tr.issue');
            $myTasks.show();
            console.log(`找到 ${$myTasks.length} 个我的任务:`, $myTasks.map((i, el) => $(el).attr('data-task-id')).get());

            // 3. 显示我的任务的所有父任务（使用data-parent-id属性）
            $myTasks.each((index, row) => {
                let $task = $(row);
                let parentId = $task.attr('data-parent-id');
                while (parentId) {
                    const $parent = $issueTree.find(`tr.issue[data-task-id="${parentId}"]`);
                    if ($parent.length) {
                        $parent.show();
                        console.log(`显示父任务: ${parentId}`);
                        parentId = $parent.attr('data-parent-id');
                        $task = $parent;
                    } else {
                        break;
                    }
                }
            });

            // 4. 显示我的任务的所有子任务
            $myTasks.each((index, row) => {
                const $task = $(row);
                const taskId = $task.attr('data-task-id');
                if (taskId) {
                    this.showAllChildrenInFilter($task, parseInt(taskId));
                }
            });

            // 5. 显示当前任务（如果它是我的任务或者包含我的任务）
            if (this.defaultParentId) {
                const $currentTask = $issueTree.find(`tr.issue[data-task-id="${this.defaultParentId}"]`);
                if ($currentTask.length) {
                    // 检查当前任务或其子任务是否有指派给目标用户的
                    const hasMySubtasks = this.hasMyTasksInSubtree(parseInt(this.defaultParentId));
                    if (hasMySubtasks) {
                        $currentTask.show();
                        console.log(`显示当前任务: ${this.defaultParentId}（包含我的子任务）`);
                    }
                }
            }

            // 6. 保存筛选状态
            localStorage.setItem('redmine_my_task_filter', '1');

            // 7. 应用折叠状态，并确保按钮状态正确
            this.applyCollapseStateToDOM();
            
            // 8. 额外确保所有可见的有子任务的行的按钮状态正确
            setTimeout(() => {
                $issueTree.find('tr.issue:visible[data-has-children="true"]').each((index, row) => {
                    const $row = $(row);
                    const taskId = $row.attr('data-task-id');
                    const $collapseBtn = $row.find('.collapse-btn');
                    
                    if (taskId && $collapseBtn.length) {
                        const isCollapsed = this.collapsedTaskIds.has(parseInt(taskId));
                        $collapseBtn.text(isCollapsed ? '+' : '-')
                                   .attr('title', isCollapsed ? '展开子任务' : '折叠子任务');
                    }
                });
            }, 50);
        }

        // 新增：递归显示我的任务的所有子任务
        showAllChildrenInFilter($parentRow, parentTaskId) {
            const $issueTree = $("#issue_tree");
            const children = this.taskHierarchy.get(parentTaskId) || [];
            
            children.forEach(child => {
                const $childRow = $issueTree.find(`tr.issue[data-task-id="${child.id}"]`);
                if ($childRow.length > 0) {
                    $childRow.show();
                    console.log(`显示我的任务的子任务: ${child.id}`);
                    
                    // 递归显示子任务的子任务
                    if (this.taskHierarchy.has(child.id)) {
                        this.showAllChildrenInFilter($childRow, child.id);
                    }
                }
            });
        }

        // 新增：检查任务树中是否包含我的任务
        hasMyTasksInSubtree(taskId) {
            const myUserId = this.getActiveFilterUserId();
            
            // 检查任务本身
            const task = this.allTasksData.find(t => t.id === taskId);
            if (task && task.assigned_to_id && task.assigned_to_id.toString() === myUserId) {
                return true;
            }
            
            // 递归检查所有子任务
            const children = this.taskHierarchy.get(taskId) || [];
            for (const child of children) {
                if (child.assigned_to_id && child.assigned_to_id.toString() === myUserId) {
                    return true;
                }
                if (this.hasMyTasksInSubtree(child.id)) {
                    return true;
                }
            }
            
            return false;
        }

        // 修改：显示所有任务
        showAllTasks() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            $issueTree.find('tr.issue').show();
            localStorage.setItem('redmine_my_task_filter', '0');
            this.applyCollapseStateToDOM();
        }

        // 修改：展开子任务 - 修复筛选状态下的展开逻辑
        expandChildrenByDOM($parentRow, parentTaskId) {
            const $issueTree = $("#issue_tree");
            const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
            const children = this.taskHierarchy.get(parseInt(parentTaskId)) || [];
            
            console.log(`展开任务 ${parentTaskId} 的子任务，筛选状态: ${isFilterEnabled}`);
            
            children.forEach(child => {
                const $childRow = $issueTree.find(`tr.issue[data-task-id="${child.id}"]`);
                if ($childRow.length > 0) {
                    if (isFilterEnabled) {
                        // 筛选状态下，严格检查子任务是否应该显示
                        const shouldShow = this.shouldShowTaskInFilter(child.id);
                        console.log(`子任务 ${child.id} 是否应该显示: ${shouldShow}`);
                        
                        if (shouldShow) {
                            $childRow.show();
                            
                            // 重要：只有在子任务未折叠且有子任务的情况下才递归展开
                            // 并且要确保不会展开超出筛选范围的任务
                            if (!this.collapsedTaskIds.has(child.id) && this.taskHierarchy.has(child.id)) {
                                // 检查是否应该展开子任务的子任务
                                const childChildren = this.taskHierarchy.get(child.id) || [];
                                const hasValidGrandChildren = childChildren.some(grandChild => 
                                    this.shouldShowTaskInFilter(grandChild.id)
                                );
                                
                                if (hasValidGrandChildren) {
                                    this.expandChildrenByDOM($childRow, child.id);
                                }
                            }
                        } else {
                            // 如果不应该显示，确保隐藏
                            $childRow.hide();
                        }
                    } else {
                        // 非筛选状态下，正常显示
                        $childRow.show();
                        if (!this.collapsedTaskIds.has(child.id) && this.taskHierarchy.has(child.id)) {
                            this.expandChildrenByDOM($childRow, child.id);
                        }
                    }
                }
            });
        }

        // 修改：切换折叠状态 - 增强筛选状态下的控制
        toggleCollapseByDOM($row, taskId) {
            const taskIdInt = parseInt(taskId);
            const $collapseBtn = $row.find('.collapse-btn');
            const isCollapsed = this.collapsedTaskIds.has(taskIdInt);
            const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';

            console.log(`切换任务 ${taskId} 的折叠状态，当前状态: ${isCollapsed ? '折叠' : '展开'}，筛选状态: ${isFilterEnabled}`);

            if (isCollapsed) {
                // 展开
                if (isFilterEnabled) {
                    // 筛选状态下的展开：只展开符合筛选条件的子任务
                    this.expandChildrenWithFilter($row, taskId);
                } else {
                    // 非筛选状态下的正常展开
                    this.expandChildrenByDOM($row, taskId);
                }
                $collapseBtn.text('-').attr('title', '折叠子任务');
                this.collapsedTaskIds.delete(taskIdInt);
            } else {
                // 折叠
                this.collapseChildrenByDOM($row, taskId);
                $collapseBtn.text('+').attr('title', '展开子任务');
                this.collapsedTaskIds.add(taskIdInt);
            }

            this.saveCollapseState();
        }

        // 新增：在筛选状态下有选择性地展开子任务
        expandChildrenWithFilter($parentRow, parentTaskId) {
            const $issueTree = $("#issue_tree");
            const children = this.taskHierarchy.get(parseInt(parentTaskId)) || [];
            
            console.log(`筛选状态下展开任务 ${parentTaskId} 的子任务`);
            
            children.forEach(child => {
                const $childRow = $issueTree.find(`tr.issue[data-task-id="${child.id}"]`);
                if ($childRow.length > 0) {
                    const shouldShow = this.shouldShowTaskInFilter(child.id);
                    console.log(`检查子任务 ${child.id}，应该显示: ${shouldShow}`);
                    
                    if (shouldShow) {
                        $childRow.show();
                        console.log(`显示子任务 ${child.id}`);
                        
                        // 检查是否需要展开这个子任务的子任务
                        if (this.taskHierarchy.has(child.id)) {
                            const isChildCollapsed = this.collapsedTaskIds.has(child.id);
                            console.log(`子任务 ${child.id} 的折叠状态: ${isChildCollapsed ? '折叠' : '展开'}`);
                            
                            if (!isChildCollapsed) {
                                // 如果子任务未折叠，递归检查其子任务
                                const grandChildren = this.taskHierarchy.get(child.id) || [];
                                const hasValidGrandChildren = grandChildren.some(grandChild => 
                                    this.shouldShowTaskInFilter(grandChild.id)
                                );
                                
                                console.log(`子任务 ${child.id} 是否有有效的孙任务: ${hasValidGrandChildren}`);
                                
                                if (hasValidGrandChildren) {
                                    this.expandChildrenWithFilter($childRow, child.id);
                                }
                            }
                        }
                    } else {
                        $childRow.hide();
                        console.log(`隐藏子任务 ${child.id}`);
                    }
                }
            });
        }

        // 修改：检查任务在筛选状态下是否应该显示 - 修复逻辑
        shouldShowTaskInFilter(taskId) {
            const myUserId = this.getActiveFilterUserId();
            
            // 1. 检查是否是我的任务
            const task = this.allTasksData.find(t => t.id === taskId);
            if (task && task.assigned_to_id && task.assigned_to_id.toString() === myUserId) {
                console.log(`任务 ${taskId} 是我的任务，指派给: ${task.assigned_to_id}`);
                return true;
            }
            
            // 获取所有我的任务
            const myTasks = this.allTasksData.filter(t => 
                t.assigned_to_id && t.assigned_to_id.toString() === myUserId
            );
            
            // 2. 检查是否是我的任务的父任务链中的任务
            for (const myTask of myTasks) {
                const parents = this.getAllParents(myTask.id);
                if (parents.some(parent => parent.id === taskId)) {
                    console.log(`任务 ${taskId} 是我的任务 ${myTask.id} 的父任务`);
                    return true;
                }
            }
            
            // 3. 检查是否是我的任务的子任务链中的任务
            for (const myTask of myTasks) {
                const children = this.getAllChildren(myTask.id, true);
                if (children.some(child => child.id === taskId)) {
                    console.log(`任务 ${taskId} 是我的任务 ${myTask.id} 的子任务`);
                    return true;
                }
            }
            
            // 注意：移除了"当前任务的所有子任务都显示"的逻辑
            // 只有当当前任务本身是我的任务时，才显示当前任务
            if (this.defaultParentId && taskId === parseInt(this.defaultParentId)) {
                console.log(`任务 ${taskId} 是当前任务`);
                return true;
            }
            
            if (task) {
                console.log(`任务 ${taskId} 不应该在筛选中显示，指派给: ${task.assigned_to_id || '无人'}`);
            } else {
                console.log(`任务 ${taskId} 不在任务数据中`);
            }
            return false;
        }

        // 修改：折叠子任务
        collapseChildrenByDOM($parentRow, parentTaskId) {
            const $issueTree = $("#issue_tree");
            const children = this.taskHierarchy.get(parseInt(parentTaskId)) || [];
            
            children.forEach(child => {
                const $childRow = $issueTree.find(`tr.issue[data-task-id="${child.id}"]`);
                if ($childRow.length > 0) {
                    $childRow.hide();
                    if (this.taskHierarchy.has(child.id)) {
                        this.collapseChildrenByDOM($childRow, child.id);
                    }
                }
            });
        }

        // 修改：一键折叠所有任务 - 修复筛选状态下的问题
        collapseAllTasks() {
            const $issueTree = $("#issue_tree");
            const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
            
            if (isFilterEnabled) {
                // 筛选状态下，只折叠可见的父任务
                console.log('筛选状态下一键折叠');
                
                $issueTree.find('tr.issue:visible[data-has-children="true"]').each((index, row) => {
                    const $row = $(row);
                    const taskId = $row.attr('data-task-id');
                    if (taskId) {
                        this.collapsedTaskIds.add(parseInt(taskId));
                        this.collapseChildrenByDOM($row, taskId);
                        $row.find('.collapse-btn').text('+').attr('title', '展开子任务');
                    }
                });
            } else {
                // 非筛选状态下的正常折叠
                const selector = 'tr.issue[data-has-children="true"]';
                
                $issueTree.find(selector).each((index, row) => {
                    const $row = $(row);
                    const taskId = $row.attr('data-task-id');
                    if (taskId) {
                        this.collapsedTaskIds.add(parseInt(taskId));
                        this.collapseChildrenByDOM($row, taskId);
                        $row.find('.collapse-btn').text('+').attr('title', '展开子任务');
                    }
                });
            }
            
            this.saveCollapseState();
        }

        // 修改：一键展开所有任务 - 修复按钮状态更新问题
        expandAllTasks() {
            const $issueTree = $("#issue_tree");
            const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
            
            if (isFilterEnabled) {
                // 筛选状态下，需要重新应用筛选逻辑
                console.log('筛选状态下一键展开');
                
                // 清除所有折叠状态
                this.collapsedTaskIds.clear();
                this.saveCollapseState();
                
                // 重新应用筛选
                this.filterMyTasks();
                
                // 重要：更新所有可见的折叠按钮状态为展开状态
                setTimeout(() => {
                    $issueTree.find('tr.issue:visible .collapse-btn').each((index, btn) => {
                        const $btn = $(btn);
                        $btn.text('-').attr('title', '折叠子任务');
                    });
                }, 100); // 延迟一点确保DOM更新完成
                
            } else {
                // 非筛选状态下的正常展开
                const selector = 'tr.issue[data-has-children="true"]';
                
                $issueTree.find(selector).each((index, row) => {
                    const $row = $(row);
                    const taskId = $row.attr('data-task-id');
                    if (taskId) {
                        this.collapsedTaskIds.delete(parseInt(taskId));
                        this.expandChildrenByDOM($row, taskId);
                        $row.find('.collapse-btn').text('-').attr('title', '折叠子任务');
                    }
                });
                
                this.saveCollapseState();
            }
        }

        // 修改：应用折叠状态到DOM - 确保按钮状态正确
        applyCollapseStateToDOM() {
            const $issueTree = $("#issue_tree");
            
            $issueTree.find('tr.issue[data-has-children="true"]').each((index, row) => {
                const $row = $(row);
                const taskId = $row.attr('data-task-id');
                
                if (taskId) {
                    const taskIdInt = parseInt(taskId);
                    const $collapseBtn = $row.find('.collapse-btn');
                    
                    if (this.collapsedTaskIds.has(taskIdInt)) {
                        // 任务应该是折叠状态
                        this.collapseChildrenByDOM($row, taskId);
                        $collapseBtn.text('+').attr('title', '展开子任务');
                    } else {
                        // 任务应该是展开状态
                        const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
                        if (isFilterEnabled) {
                            this.expandChildrenWithFilter($row, taskId);
                        } else {
                            this.expandChildrenByDOM($row, taskId);
                        }
                        $collapseBtn.text('-').attr('title', '折叠子任务');
                    }
                }
            });
        }

        // 修改：保存折叠状态
        saveCollapseState() {
            const collapsedArray = Array.from(this.collapsedTaskIds);
            localStorage.setItem('redmine_collapsed_tasks', JSON.stringify(collapsedArray));
        }

        // 修改：恢复折叠状态
        restoreCollapseState() {
            const saved = JSON.parse(localStorage.getItem('redmine_collapsed_tasks') || '[]');
            this.collapsedTaskIds = new Set(saved);
        }

        // 新增：构建任务层级关系
        buildTaskHierarchy() {
            this.taskHierarchy.clear();
            
            console.log('开始构建任务层级关系...');
            console.log('所有任务数据:', this.allTasksData);
            
            // 按父任务分组
            this.allTasksData.forEach(task => {
                if (task.parent) {
                    if (!this.taskHierarchy.has(task.parent)) {
                        this.taskHierarchy.set(task.parent, []);
                    }
                    this.taskHierarchy.get(task.parent).push(task);
                }
            });

            console.log('任务层级关系构建完成:', this.taskHierarchy);
            
            // 调试输出：显示每个父任务的子任务数量
            this.taskHierarchy.forEach((children, parentId) => {
                console.log(`父任务 ${parentId} 有 ${children.length} 个子任务:`, children.map(c => c.id));
            });
        }

        // 新增：获取任务的所有子任务（递归）
        getAllChildren(taskId, includeCollapsed = false) {
            const children = [];
            const queue = [taskId];

            while (queue.length > 0) {
                const currentId = queue.shift();
                const childTasks = this.taskHierarchy.get(currentId) || [];

                childTasks.forEach(child => {
                    children.push(child);
                    // 如果包含折叠的任务，继续递归
                    if (includeCollapsed || !this.collapsedTaskIds.has(currentId)) {
                        queue.push(child.id);
                    }
                });
            }

            return children;
        }

        // 新增：获取任务的所有父任务（递归）
        getAllParents(taskId) {
            const parents = [];
            let currentTask = this.allTasksData.find(t => t.id === taskId);

            while (currentTask && currentTask.parent) {
                const parentTask = this.allTasksData.find(t => t.id === currentTask.parent);
                if (parentTask) {
                    parents.unshift(parentTask);
                    currentTask = parentTask;
                } else {
                    break;
                }
            }

            return parents;
        }

        // 新增：应用当前筛选条件
        applyCurrentFilters() {
            const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
            console.log('应用筛选条件，筛选状态:', isFilterEnabled);
            
            if (isFilterEnabled) {
                this.filterMyTasksByData();
            } else {
                this.filteredTasksData = [...this.allTasksData];
                console.log('未启用筛选，显示所有任务:', this.filteredTasksData.length, '个');
            }
            
            // 重新渲染任务列表
            this.renderTasksList();
        }

        // 修改：基于数据的任务筛选 - 修复逻辑
        filterMyTasksByData() {
            const myUserId = this.getActiveFilterUserId();
            console.log('开始筛选我的任务，用户ID:', myUserId);
            
            // 获取我的任务（包括当前任务和其子任务）
            const myTasks = this.allTasksData.filter(task => 
                task.assigned_to_id && task.assigned_to_id.toString() === myUserId
            );
            
            console.log('找到我的任务:', myTasks.map(t => ({id: t.id, subject: t.subject})));

            const showSet = new Set();

            // 对每个我的任务，添加其所有父任务和子任务
            myTasks.forEach(task => {
                showSet.add(task.id);
                console.log(`添加我的任务 ${task.id} 到显示列表`);
                
                // 添加所有父任务
                const parents = this.getAllParents(task.id);
                parents.forEach(parent => {
                    showSet.add(parent.id);
                    console.log(`添加父任务 ${parent.id} 到显示列表`);
                });
                
                // 添加所有子任务
                const children = this.getAllChildren(task.id, true);
                children.forEach(child => {
                    showSet.add(child.id);
                    console.log(`添加子任务 ${child.id} 到显示列表`);
                });
            });

            // 确保当前任务（defaultParentId）始终显示
            if (this.defaultParentId) {
                showSet.add(parseInt(this.defaultParentId));
                console.log(`添加当前任务 ${this.defaultParentId} 到显示列表`);
                
                // 添加当前任务的所有子任务
                const currentTaskChildren = this.getAllChildren(parseInt(this.defaultParentId), true);
                currentTaskChildren.forEach(child => {
                    showSet.add(child.id);
                    console.log(`添加当前任务的子任务 ${child.id} 到显示列表`);
                });
            }

            console.log('筛选后要显示的任务ID:', Array.from(showSet));
            
            this.filteredTasksData = this.allTasksData.filter(task => showSet.has(task.id));
            console.log('筛选后的任务数据:', this.filteredTasksData.map(t => ({id: t.id, subject: t.subject, parent: t.parent, assigned_to_id: t.assigned_to_id})));
            
            // 验证筛选结果
            const filteredIds = this.filteredTasksData.map(t => t.id);
            console.log('筛选结果中的任务ID:', filteredIds);
            console.log('showSet中的任务ID:', Array.from(showSet));
            console.log('两者是否一致:', JSON.stringify(filteredIds.sort()) === JSON.stringify(Array.from(showSet).sort()));
            
            // 应用筛选到DOM
            this.applyFilterToDOM();
        }

        // 新增：渲染任务列表
        renderTasksList() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            // 清空现有内容
            $issueTree.find('tbody').empty();

            // 按层级渲染任务
            const rootTasks = this.filteredTasksData.filter(task => !task.parent);

            rootTasks.forEach(task => {
                this.renderTaskRow(task, 0);
            });
        }

        // 新增：渲染单个任务行
        renderTaskRow(task, level) {
            const $issueTree = $("#issue_tree");
            const isCollapsed = this.collapsedTaskIds.has(task.id);
            const hasChildren = this.taskHierarchy.has(task.id);

            // 创建任务行
            const $row = this.createTaskRow(task, level);
            $issueTree.find('tbody').append($row);

            // 如果有子任务且未折叠，递归渲染子任务
            if (hasChildren && !isCollapsed) {
                const children = this.taskHierarchy.get(task.id);
                children.forEach(child => {
                    this.renderTaskRow(child, level + 1);
                });
            }
        }

        // 新增：创建任务行HTML
        createTaskRow(task, level) {
            const indentClass = level > 0 ? `idnt-${level}` : '';
            const parentClass = this.taskHierarchy.has(task.id) ? 'parent' : '';
            const collapsedClass = this.collapsedTaskIds.has(task.id) ? 'collapsed' : '';

            const $row = $(`
                <tr class="issue issue-${task.id} ${indentClass} ${parentClass} ${collapsedClass}">
                    <td class="checkbox">
                        <input type="checkbox" name="ids[]" value="${task.id}">
                    </td>
                    <td class="id">
                        <a href="/issues/${task.id}">${task.id}</a>
                    </td>
                    <td class="tracker">${task.tracker}</td>
                    <td class="status">${task.status}</td>
                    <td class="priority">${task.priority}</td>
                    <td class="subject">
                        ${this.createCollapseButton(task)}
                        <a href="/issues/${task.id}">${task.subject}</a>
                    </td>
                    <td class="assigned_to">
                        ${task.assigned_to ? `<a href="/users/${task.assigned_to_id}" class="user">${task.assigned_to}</a>` : ''}
                    </td>
                    <td class="start_date">${task.start_date || ''}</td>
                    <td class="due_date">${task.due_date || ''}</td>
                </tr>
            `);

            return $row;
        }

        // 修改：创建折叠按钮或占位符
        createCollapseButton(task) {
            // 创建基础样式的占位符
            const baseStyle = `
                display: inline-block;
                width: 16px;
                height: 16px;
                line-height: 16px;
                text-align: center;
                margin-right: 5px;
                float: left;  /* 添加浮动，确保在箭头图标左边 */
            `;

            // 所有任务都需要占位符，确保缩进一致
            const placeholderHtml = `<span class="collapse-placeholder" style="${baseStyle}"></span>`;

            // 如果有子任务，则替换占位符为折叠按钮
            if (this.taskHierarchy.has(task.id)) {
                const isCollapsed = this.collapsedTaskIds.has(task.id);
                const buttonText = isCollapsed ? '+' : '-';
                const buttonTitle = isCollapsed ? '展开子任务' : '折叠子任务';

                return `<span class="collapse-btn" style="${baseStyle}
                    cursor: pointer;
                    font-weight: bold;
                    color: #666;
                    user-select: none;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    background: #f9f9f9;
                " data-task-id="${task.id}" title="${buttonTitle}">${buttonText}</span>`;
            }

            return placeholderHtml;
        }

        // 新增：滚动到今天的任务（支持下拉框选中的人员）
        scrollToTodayTask() {
            console.log('=== 开始定位今天的任务 ===');

            // 如果有高亮，则取消所有高亮
            const $highlighted = $("#issue_tree tr.issue.today-highlight");
            if ($highlighted.length > 0) {
                console.log('取消现有高亮，共', $highlighted.length, '个任务');
                $highlighted.removeClass('today-highlight');
                return;
            }

            // 获取当前筛选的用户ID（支持下拉框选中的人员）
            const targetUserId = this.getActiveFilterUserId();
            if (!targetUserId) {
                alert('未找到目标用户，无法定位任务！');
                return;
            }

            // 查找今天的任务，高亮属于目标用户的任务
            const today = new Date();
            const todayStr = this.formatDate(today);
            let found = false;
            let foundTasks = [];
            const targetUserHref = `/users/${targetUserId}`;

            console.log('查找目标用户:', targetUserId, '今天日期:', todayStr);

            $("#issue_tree tr.issue:visible").each((i, row) => {
                const $row = $(row);
                // 判断是否属于目标用户
                const $assignedTo = $row.find('td.assigned_to a.user');
                const isTargetUser = $assignedTo.length && ($assignedTo.attr('href') || '').endsWith(targetUserHref);
                if (!isTargetUser) return;

                // 跳过有子任务的（parent class）
                const classes = $row.attr('class').split(/\s+/);
                if (classes.includes('parent')) return;

                // 日期判断 - 必须同时存在开始时间和结束时间
                // 获取日期时需要排除编辑图标的文本
                const startDateCell = $row.find('td.start_date');
                const dueDateCell = $row.find('td.due_date');
                const startDate = startDateCell.clone().find('.date-edit-icon').remove().end().text().trim();
                const dueDate = dueDateCell.clone().find('.date-edit-icon').remove().end().text().trim();

                console.log('检查任务:', $row.find('td.subject a').text().trim(),
                           '开始日期:', startDate, '结束日期:', dueDate);

                // 确保开始时间和结束时间都不为空，且今天在任务时间范围内
                if (startDate && dueDate && startDate !== '' && dueDate !== '' &&
                    startDate <= todayStr && dueDate >= todayStr) {

                    console.log('✓ 找到今天的任务:', $row.find('td.subject a').text().trim());

                    // 强制添加高亮类
                    $row.addClass('today-highlight');

                    // 强制设置内联样式确保高亮显示
                    $row.css({
                        'background': '#ffe066 !important',
                        'background-color': '#ffe066 !important'
                    });
                    $row.find('td').css({
                        'background': '#ffe066 !important',
                        'background-color': '#ffe066 !important'
                    });

                    foundTasks.push($row.find('td.subject a').text().trim());

                    if (!found) {
                        console.log('滚动到第一个找到的任务');
                        $row[0].scrollIntoView({behavior: 'smooth', block: 'center'});
                        found = true;
                    }
                }
            });

            if (!found) {
                // 获取用户名用于提示
                const userName = this.getUserNameById(targetUserId);
                console.log('未找到今天的任务');
                alert(`没有找到${userName}今天在进行中的任务！`);
            } else {
                console.log('✓ 成功高亮', foundTasks.length, '个今天的任务:', foundTasks);
                console.log('高亮将保持显示，再次点击"定位到今天的任务"按钮可取消高亮');
            }
        }

        // 根据用户ID获取用户名
        getUserNameById(userId) {
            if (userId === this.currentUserId) {
                return '您';
            }

            // 从项目成员中查找
            const user = this.projectMembers.find(u => u.id === userId);
            return user ? user.name : '该用户';
        }

        // 统一控制"定位到今天的任务"按钮的显示隐藏
        updateTodayTaskButtonVisibility() {
            const isFilterEnabled = $('#task-filter-switch').is(':checked');
            const hasSelectedUser = this.getActiveFilterUserId();

            // 只有在启用筛选且有选中用户时才显示按钮
            if (isFilterEnabled && hasSelectedUser) {
                $("#scroll-today-task-btn").show();
                $("#task-filter-switch-other").show();
            } else {
                $("#scroll-today-task-btn").hide();
                $("#task-filter-switch-other").hide();
            }
        }

        // ==================== 工时登记功能 ====================

        /**
         * 初始化工时登记功能
         */
        async initTimeLogging() {
            console.log('=== 初始化工时登记功能 ===');

            // 初始化工时登记状态
            this.timeLoggingMode = false;
            this.timeEntries = new Map(); // 存储每个任务的工时条目
            this.activityOptions = []; // 活动选项

            // 确保事件监听器只绑定一次
            this.bindTimeLoggingEvents();

            // 获取活动选项（等待加载完成）
            await this.loadActivityOptions();
            console.log('工时登记功能初始化完成，活动选项数量:', this.activityOptions.length);
        }

        /**
         * 绑定工时登记相关事件（确保只绑定一次）
         */
        bindTimeLoggingEvents() {
            // 先清理可能存在的事件监听器
            $(document).off('click.timeLogging', '.time-entry-btn.add');
            $(document).off('click.timeLogging', '.time-entry-btn.edit');
            $(document).off('click.timeLogging', '.time-entry-btn.remove');

            // 重新绑定事件监听器，使用命名空间避免重复绑定
            $(document).on('click.timeLogging', '.time-entry-btn.add', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const taskId = $(e.target).attr('data-task-id');
                console.log('添加工时按钮被点击，任务ID:', taskId);
                this.addTimeEntry(taskId);
            });

            $(document).on('click.timeLogging', '.time-entry-btn.edit', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const taskId = $(e.target).attr('data-task-id');
                const index = parseInt($(e.target).attr('data-entry-index'));
                console.log('编辑工时按钮被点击，任务ID:', taskId, '索引:', index);
                this.editTimeEntry(taskId, index);
            });

            $(document).on('click.timeLogging', '.time-entry-btn.remove', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const taskId = $(e.target).attr('data-task-id');
                const index = parseInt($(e.target).attr('data-entry-index'));
                console.log('删除工时按钮被点击，任务ID:', taskId, '索引:', index);
                this.removeTimeEntry(taskId, index);
            });

            console.log('工时登记事件监听器已绑定');
        }

        /**
         * 切换工时登记模式
         */
        toggleTimeLoggingMode() {
            this.timeLoggingMode = !this.timeLoggingMode;
            const $btn = $('#time-logging-btn');
            const $issueTree = $('#issue_tree');

            if (this.timeLoggingMode) {
                console.log('进入工时登记模式');
                $btn.text('提交工时').css({
                    'background': '#dc3545',
                    'color': 'white'
                });
                $issueTree.addClass('time-logging-mode');
                this.showTimeEntryInputs();
            } else {
                console.log('退出工时登记模式');
                // 先提交工时，再隐藏界面
                this.submitTimeEntries().then((result) => {
                    // 检查是否是因为不完整条目或用户取消而没有实际提交
                    if (result && result.cancelled) {
                        console.log('提交被取消或存在不完整条目，保持工时登记模式');
                        // 不需要做任何事情，保持当前状态
                        return;
                    }

                    // 提交完成后才真正退出模式
                    $btn.text('登记工时').css({
                        'background': '#28a745',
                        'color': 'white'
                    });
                    $issueTree.removeClass('time-logging-mode');
                    this.hideTimeEntryInputs();
                }).catch((error) => {
                    console.error('提交工时失败:', error);
                    // 错误时恢复界面
                    $btn.text('登记工时').css({
                        'background': '#28a745',
                        'color': 'white'
                    });
                    $issueTree.removeClass('time-logging-mode');
                    this.hideTimeEntryInputs();
                });
            }
        }

        /**
         * 显示工时输入界面
         */
        showTimeEntryInputs() {
            const $issueTree = $('#issue_tree');

            // 为每个可见的任务行添加工时输入界面
            $issueTree.find('tr.issue:visible').each((index, row) => {
                const $row = $(row);
                const taskId = this.getTaskIdFromRow($row);
                if (!taskId) return;

                const $subjectCell = $row.find('td.subject');
                if ($subjectCell.length === 0) return;

                // 检查是否已经有工时输入容器
                let $existingContainer = $subjectCell.find('.time-entry-container');
                if ($existingContainer.length > 0) {
                    // 如果已存在，只需要刷新内容，不要重新创建
                    this.refreshTimeEntryContainer(taskId);
                    return;
                }

                // 创建工时输入容器
                const timeEntryContainer = this.createTimeEntryContainer(taskId);
                $subjectCell.append(timeEntryContainer);
            });
        }

        /**
         * 隐藏工时输入界面
         */
        hideTimeEntryInputs() {
            $('#issue_tree .time-entry-container').remove();
        }

        /**
         * 创建工时输入容器
         */
        createTimeEntryContainer(taskId) {
            const existingEntries = this.timeEntries.get(taskId) || [];

            const $container = $(`
                <div class="time-entry-container" data-task-id="${taskId}">
                    <div class="time-entry-list"></div>
                    <button type="button" class="time-entry-btn add" data-task-id="${taskId}">
                        + 添加工时
                    </button>
                </div>
            `);

            const $list = $container.find('.time-entry-list');

            // 如果有现有的工时条目，显示它们
            existingEntries.forEach((entry, index) => {
                const entryHtml = this.createTimeEntryItem(taskId, entry, index);
                $list.append(entryHtml);
            });

            return $container;
        }

        /**
         * 创建单个工时条目
         */
        createTimeEntryItem(taskId, entry = {}, index = 0) {
            console.log('创建工时条目，当前活动选项:', this.activityOptions);

            // 根据用户角色筛选活动选项
            const filteredActivities = this.getFilteredActivitiesByUserRole(taskId);
            console.log('筛选后的活动选项:', filteredActivities);

            const activityOptions = filteredActivities.map(activity =>
                `<option value="${activity.id}" ${activity.id == entry.activity_id ? 'selected' : ''}>${activity.name}</option>`
            ).join('');

            console.log('生成的活动选项HTML:', activityOptions);

            // 获取默认日期（今天）
            const defaultDate = entry.spent_on || this.formatDate(new Date());

            return $(`
                <div class="time-entry-item" data-entry-index="${index}">
                    <input type="date"
                           class="time-date"
                           value="${defaultDate}"
                           title="工时日期">
                    <input type="number"
                           class="time-hours"
                           placeholder="工时"
                           min="0"
                           step="0.5"
                           value="${entry.hours || ''}"
                           title="工时（小时）">
                    <input type="text"
                           class="time-comments"
                           placeholder="注释"
                           value="${entry.comments || ''}"
                           title="工时注释">
                    <select class="time-activity" title="活动类型">
                        <option value="">选择活动</option>
                        ${activityOptions}
                    </select>
                    <div class="time-entry-actions">
                        <button type="button" class="time-entry-btn edit"
                                data-task-id="${taskId}" data-entry-index="${index}"
                                title="编辑">
                            ✏️
                        </button>
                        <button type="button" class="time-entry-btn remove"
                                data-task-id="${taskId}" data-entry-index="${index}"
                                title="删除">
                            🗑️
                        </button>
                    </div>
                </div>
            `);
        }

        /**
         * 添加工时条目
         */
        addTimeEntry(taskId) {
            console.log('=== 添加工时条目 ===');
            console.log('任务ID:', taskId);
            console.log('当前工时登记模式:', this.timeLoggingMode);

            if (!taskId) {
                console.error('任务ID为空，无法添加工时条目');
                alert('无法获取任务ID，请刷新页面后重试');
                return;
            }

            // 防重复点击保护
            const now = Date.now();
            const lastClickKey = `addTimeEntry_${taskId}`;
            if (this.lastClickTime && this.lastClickTime[lastClickKey] && (now - this.lastClickTime[lastClickKey]) < 500) {
                console.log('防重复点击保护：忽略重复点击');
                return;
            }

            // 记录点击时间
            if (!this.lastClickTime) this.lastClickTime = {};
            this.lastClickTime[lastClickKey] = now;

            // 先保存现有UI中的数据
            this.saveAllTimeEntriesFromUIForTask(taskId);

            const entries = this.timeEntries.get(taskId) || [];
            const newEntry = {
                spent_on: this.formatDate(new Date()), // 默认今天
                hours: '',
                comments: '',
                activity_id: ''
            };

            entries.push(newEntry);
            this.timeEntries.set(taskId, entries);

            console.log('已添加工时条目，当前条目数:', entries.length);

            // 直接添加新的UI元素，而不是刷新整个容器
            this.appendTimeEntryToUI(taskId, newEntry, entries.length - 1);
        }

        /**
         * 编辑工时条目
         */
        editTimeEntry(taskId, index) {
            console.log('编辑工时条目:', taskId, index);

            const $container = $(`.time-entry-container[data-task-id="${taskId}"]`);
            const $item = $container.find(`.time-entry-item[data-entry-index="${index}"]`);

            // 保存当前编辑的数据
            this.saveTimeEntryFromUI(taskId, index);

            // 可以在这里添加更多编辑逻辑，比如高亮显示正在编辑的条目
            $item.css('background', '#fff3cd');
            setTimeout(() => {
                $item.css('background', 'white');
            }, 1000);
        }

        /**
         * 删除工时条目
         */
        removeTimeEntry(taskId, index) {
            console.log('删除工时条目:', taskId, index);

            const entries = this.timeEntries.get(taskId) || [];
            if (index >= 0 && index < entries.length) {
                entries.splice(index, 1);
                this.timeEntries.set(taskId, entries);

                // 更新界面
                this.refreshTimeEntryContainer(taskId);
            }
        }

        /**
         * 刷新工时条目容器
         */
        refreshTimeEntryContainer(taskId) {
            console.log('刷新工时条目容器，任务ID:', taskId);

            const $container = $(`.time-entry-container[data-task-id="${taskId}"]`);
            if ($container.length === 0) {
                console.log('未找到工时容器');
                return;
            }

            const $list = $container.find('.time-entry-list');
            const entries = this.timeEntries.get(taskId) || [];

            console.log('当前条目数:', entries.length);
            console.log('现有UI条目数:', $list.find('.time-entry-item').length);

            // 先保存现有UI中的数据
            $list.find('.time-entry-item').each((index, item) => {
                const $item = $(item);
                const entryIndex = parseInt($item.attr('data-entry-index'));
                if (entryIndex >= 0 && entryIndex < entries.length) {
                    const hours = $item.find('.time-hours').val();
                    const comments = $item.find('.time-comments').val();
                    const activity_id = $item.find('.time-activity').val();

                    // 只有当UI中有数据时才更新内存
                    if (hours || comments || activity_id) {
                        entries[entryIndex] = {
                            hours: hours || entries[entryIndex].hours,
                            comments: comments || entries[entryIndex].comments,
                            activity_id: activity_id || entries[entryIndex].activity_id
                        };
                    }
                }
            });

            // 更新内存中的数据
            this.timeEntries.set(taskId, entries);

            // 重新渲染UI
            $list.empty();
            entries.forEach((entry, index) => {
                const entryHtml = this.createTimeEntryItem(taskId, entry, index);
                $list.append(entryHtml);
            });

            console.log('刷新完成，最终条目数:', entries.length);
        }

        /**
         * 从UI保存工时条目数据
         */
        saveTimeEntryFromUI(taskId, index) {
            console.log(`保存工时数据 - 任务ID: ${taskId}, 索引: ${index}`);

            const $container = $(`.time-entry-container[data-task-id="${taskId}"]`);
            const $item = $container.find(`.time-entry-item[data-entry-index="${index}"]`);

            console.log('找到容器:', $container.length, '找到条目:', $item.length);

            if ($item.length === 0) {
                console.warn('未找到工时条目元素');
                return;
            }

            const spent_on = $item.find('.time-date').val();
            const hours = $item.find('.time-hours').val();
            const comments = $item.find('.time-comments').val();
            const activity_id = $item.find('.time-activity').val();

            console.log('从UI获取的数据:', { spent_on, hours, comments, activity_id });

            const entries = this.timeEntries.get(taskId) || [];
            if (index >= 0 && index < entries.length) {
                entries[index] = {
                    spent_on: spent_on,
                    hours: hours,
                    comments: comments,
                    activity_id: activity_id
                };
                this.timeEntries.set(taskId, entries);
                console.log('已保存到内存:', entries[index]);
            } else {
                console.warn('索引超出范围:', index, '数组长度:', entries.length);
            }
        }

        /**
         * 保存所有UI中的工时数据
         */
        saveAllTimeEntriesFromUI() {
            console.log('=== 保存所有UI中的工时数据 ===');

            const containers = $('.time-entry-container');
            console.log('找到工时容器数量:', containers.length);

            containers.each((index, container) => {
                const $container = $(container);
                const taskId = $container.attr('data-task-id');
                console.log(`处理任务 ${taskId} 的工时容器`);

                const items = $container.find('.time-entry-item');
                console.log(`任务 ${taskId} 有 ${items.length} 个工时条目`);

                items.each((itemIndex, item) => {
                    const $item = $(item);
                    const entryIndex = parseInt($item.attr('data-entry-index'));
                    console.log(`保存任务 ${taskId} 的第 ${entryIndex} 个工时条目`);
                    this.saveTimeEntryFromUI(taskId, entryIndex);
                });
            });

            console.log('所有UI数据保存完成');
        }

        /**
         * 保存指定任务的UI中的工时数据
         */
        saveAllTimeEntriesFromUIForTask(taskId) {
            console.log('保存任务工时数据:', taskId);

            const $container = $(`.time-entry-container[data-task-id="${taskId}"]`);
            if ($container.length === 0) return;

            $container.find('.time-entry-item').each((itemIndex, item) => {
                const $item = $(item);
                const entryIndex = parseInt($item.attr('data-entry-index'));
                this.saveTimeEntryFromUI(taskId, entryIndex);
            });
        }

        /**
         * 直接添加工时条目到UI，不刷新整个容器
         */
        appendTimeEntryToUI(taskId, entry, index) {
            console.log('添加工时条目到UI:', taskId, index);

            const $container = $(`.time-entry-container[data-task-id="${taskId}"]`);
            if ($container.length === 0) {
                console.error('未找到工时容器');
                return;
            }

            const $list = $container.find('.time-entry-list');
            const entryHtml = this.createTimeEntryItem(taskId, entry, index);
            $list.append(entryHtml);

            console.log('已添加工时条目到UI');
        }

        /**
         * 提交所有工时条目
         */
        async submitTimeEntries() {
            return new Promise(async (resolve, reject) => {
                try {
            console.log('=== 开始提交工时条目 ===');

            // 先保存所有UI中的数据
            console.log('保存UI中的工时数据...');
            this.saveAllTimeEntriesFromUI();

            console.log('保存完成，当前内存中的工时数据:', this.timeEntries);

            const allEntries = [];
            const incompleteEntries = [];
            let hasValidEntries = false;

            // 收集所有工时条目，区分完整和不完整的
            for (const [taskId, entries] of this.timeEntries) {
                console.log(`检查任务 ${taskId} 的工时条目:`, entries);
                for (const [entryIndex, entry] of entries.entries()) {
                    console.log('检查工时条目:', entry);
                    console.log('工时:', entry.hours, '类型:', typeof entry.hours);
                    console.log('活动ID:', entry.activity_id, '类型:', typeof entry.activity_id);

                    const hasHours = entry.hours && parseFloat(entry.hours) > 0;
                    const hasActivity = entry.activity_id && entry.activity_id !== '';
                    const hasComments = entry.comments && entry.comments.trim() !== '';
                    const hasDate = entry.spent_on && entry.spent_on.trim() !== '';

                    if (hasHours && hasActivity && hasDate) {
                        allEntries.push({
                            taskId: taskId,
                            hours: parseFloat(entry.hours),
                            comments: entry.comments || '',
                            activity_id: entry.activity_id,
                            spent_on: entry.spent_on,
                            entryIndex: entryIndex
                        });
                        hasValidEntries = true;
                        console.log('✓ 有效的工时条目');
                    } else if (hasHours || hasActivity || hasComments || hasDate) {
                        // 部分填写的条目视为不完整
                        incompleteEntries.push({
                            taskId: taskId,
                            entryIndex: entryIndex,
                            entry: entry,
                            missingFields: {
                                hours: !hasHours,
                                activity: !hasActivity,
                                date: !hasDate
                            }
                        });
                        console.log('✗ 不完整的工时条目 - 日期:', entry.spent_on, '工时:', entry.hours, '活动ID:', entry.activity_id);
                    }
                }
            }

            console.log('收集到的有效工时条目:', allEntries);
            console.log('收集到的不完整工时条目:', incompleteEntries);

            // 如果有不完整的条目，直接弹出 alert 提示
            if (incompleteEntries.length > 0) {
                let alertMessage = `发现 ${incompleteEntries.length} 个工时条目填写不完整：\n\n`;

                incompleteEntries.forEach((item, index) => {
                    const missingFields = [];
                    if (item.missingFields.date) missingFields.push('日期');
                    if (item.missingFields.hours) missingFields.push('工时');
                    if (item.missingFields.activity) missingFields.push('活动类型');

                    alertMessage += `${index + 1}. 任务 ${item.taskId}: 缺少 ${missingFields.join('、')}\n`;
                });

                alertMessage += '\n请补充完整信息后再提交！';
                alert(alertMessage);

                // 保持工时登记模式
                this.timeLoggingMode = true;
                const $btn = $('#time-logging-btn');
                $btn.text('提交工时').css({
                    'background': '#dc3545',
                    'color': 'white'
                });
                $('#issue_tree').addClass('time-logging-mode');
                resolve({ cancelled: true, reason: 'incomplete' }); // 返回取消状态
                return;
            }

            if (!hasValidEntries) {
                alert('没有找到有效的工时条目！请确保填写了日期、工时和活动类型。');
                reject(new Error('没有有效的工时条目'));
                return;
            }

            console.log('准备提交的工时条目:', allEntries);

            // 确认提交
            const confirmMessage = `确定要提交 ${allEntries.length} 个工时条目吗？\n\n` +
                allEntries.map(entry =>
                    `任务 ${entry.taskId}: ${entry.spent_on} - ${entry.hours}小时 - ${this.getActivityNameById(entry.activity_id)}${entry.comments ? ` - ${entry.comments}` : ''}`
                ).join('\n');

                    if (!confirm(confirmMessage)) {
                        console.log('用户取消提交，保持工时登记模式');
                        // 重新进入工时登记模式，不要退出
                        this.timeLoggingMode = true;
                        const $btn = $('#time-logging-btn');
                        $btn.text('提交工时').css({
                            'background': '#dc3545',
                            'color': 'white'
                        });
                        $('#issue_tree').addClass('time-logging-mode');
                        resolve({ cancelled: true, reason: 'user_cancel' }); // 返回取消状态
                        return;
                    }

            // 逐个提交工时条目
            let successCount = 0;
            let failCount = 0;

            for (const entry of allEntries) {
                try {
                    const success = await this.submitSingleTimeEntry(entry);
                    if (success) {
                        successCount++;
                    } else {
                        failCount++;
                    }
                } catch (error) {
                    console.error('提交工时条目失败:', entry, error);
                    failCount++;
                }
            }

                    // 显示结果
                    const resultMessage = `工时提交完成！\n成功: ${successCount} 个\n失败: ${failCount} 个`;
                    alert(resultMessage);

                    // 如果全部成功，清空工时条目并刷新页面
                    if (failCount === 0) {
                        this.timeEntries.clear();
                        console.log('工时提交成功，准备刷新页面...');
                        // 使用现有的刷新机制
                        this.refreshPageContent();
                    }

                    resolve({ success: true, successCount, failCount });
                } catch (error) {
                    console.error('提交工时时发生错误:', error);
                    reject(error);
                }
            });
        }

        /**
         * 根据活动ID获取活动名称
         */
        getActivityNameById(activityId) {
            const activity = this.activityOptions.find(a => a.id == activityId);
            return activity ? activity.name : `活动${activityId}`;
        }

        /**
         * 提交单个工时条目
         */
        async submitSingleTimeEntry(entry) {
            console.log('=== 提交单个工时条目 ===');
            console.log('工时条目数据:', entry);

            try {
                // 构建工时数据
                const timeEntryData = {
                    time_entry: {
                        issue_id: entry.taskId,
                        hours: entry.hours,
                        comments: entry.comments,
                        activity_id: entry.activity_id,
                        spent_on: entry.spent_on || this.formatDate(new Date()) // 使用用户选择的日期，默认今天
                    }
                };

                console.log('构建的工时数据:', timeEntryData);
                console.log('准备发送到 /time_entries.json');

                // 使用REST API提交工时
                const response = await this.authenticatedFetch('/time_entries.json', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(timeEntryData)
                });

                console.log('工时提交响应状态:', response.status);
                console.log('工时提交响应URL:', response.url);

                if (response.ok) {
                    console.log('✓ 工时条目提交成功:', entry.taskId);
                    return true;
                } else {
                    const errorText = await response.text();
                    console.error('✗ 工时条目提交失败:', response.status, errorText);
                    return false;
                }
            } catch (error) {
                console.error('提交工时条目时发生异常:', error);
                return false;
            }
        }

        /**
         * 加载活动选项
         */
        async loadActivityOptions() {
            console.log('=== 加载活动选项 ===');

            try {
                // 尝试从REST API获取活动列表
                const response = await this.authenticatedFetch('/enumerations/time_entry_activities.json');

                console.log('活动选项API响应状态:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('活动选项API响应数据:', data);
                    if (data.time_entry_activities) {
                        this.activityOptions = data.time_entry_activities;
                        console.log('✓ 成功加载活动选项:', this.activityOptions.length, '个', this.activityOptions);
                        return;
                    }
                }
            } catch (error) {
                console.warn('从API加载活动选项失败:', error);
            }

            // 如果API失败，使用默认活动选项
            this.activityOptions = [
                { id: '8', name: '设计' },
                { id: '9', name: '开发' },
                { id: '10', name: '测试' },
                { id: '11', name: '文档' },
                { id: '12', name: '支持' }
            ];
            console.log('使用默认活动选项:', this.activityOptions);
        }

        /**
         * 从任务行获取任务ID
         */
        getTaskIdFromRow($row) {
            // 尝试多种方式获取任务ID
            let taskId = $row.attr('data-task-id');
            if (taskId) return taskId;

            // 从复选框获取
            const $checkbox = $row.find('input[name="ids[]"]');
            if ($checkbox.length > 0) {
                taskId = $checkbox.val();
                if (taskId) return taskId;
            }

            // 从任务链接获取
            const $taskLink = $row.find('td.subject a');
            if ($taskLink.length > 0) {
                const href = $taskLink.attr('href');
                const match = href && href.match(/\/issues\/(\d+)/);
                if (match) return match[1];
            }

            return null;
        }

        /**
         * 根据用户角色筛选活动选项
         */
        getFilteredActivitiesByUserRole(taskId) {
            try {
                // 获取任务行
                const $taskRow = $(`tr.issue`).filter((index, row) => {
                    const currentTaskId = this.getTaskIdFromRow($(row));
                    return currentTaskId == taskId;
                });

                if ($taskRow.length === 0) {
                    console.log('未找到任务行，返回所有活动');
                    return this.activityOptions || [];
                }

                // 获取指派给的用户信息
                const $assignedUser = $taskRow.find('td.assigned_to a.user');
                if ($assignedUser.length === 0) {
                    console.log('未找到指派用户，返回所有活动');
                    return this.activityOptions || [];
                }

                const userText = $assignedUser.text().trim();
                console.log('用户信息:', userText);

                // 提取角色信息（从[]中提取）
                const roleMatch = userText.match(/\[([^\]]+)\]/);
                if (!roleMatch) {
                    console.log('未找到用户角色信息，返回所有活动');
                    return this.activityOptions || [];
                }

                const userRole = roleMatch[1];
                console.log('提取的用户角色:', userRole);

                // 根据角色筛选活动
                const filteredActivities = this.filterActivitiesByRole(userRole);
                console.log('筛选后的活动数量:', filteredActivities.length);

                return filteredActivities;
            } catch (error) {
                console.error('筛选活动时出错:', error);
                return this.activityOptions || [];
            }
        }

        /**
         * 根据角色筛选活动选项
         */
        filterActivitiesByRole(role) {
            if (!this.activityOptions || this.activityOptions.length === 0) {
                return [];
            }

            // 角色筛选规则
            const roleFilters = {
                '研发': ['研发:'],
                '测试': ['测试:'],
            };

            const filters = roleFilters[role];
            if (!filters) {
                console.log('未找到角色筛选规则，返回所有活动');
                return this.activityOptions;
            }

            console.log('角色筛选关键词:', filters);

            // 筛选包含关键词的活动
            const filteredActivities = this.activityOptions.filter(activity => {
                return filters.some(filter => activity.name.includes(filter));
            });

            console.log(`筛选结果: 从 ${this.activityOptions.length} 个活动中筛选出 ${filteredActivities.length} 个`);

            // 如果筛选后没有结果，返回所有活动
            if (filteredActivities.length === 0) {
                console.log('筛选后无结果，返回所有活动');
                return this.activityOptions;
            }

            return filteredActivities;
        }

        // ==================== 工时登记功能结束 ====================





        // 初始化批量变更状态功能
        initBatchStatusUpdate() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            console.log('初始化批量状态更新功能');

            // 清理之前可能存在的事件监听器，避免重复绑定
            $(document).off('.batchStatus');
            $(document).off('.batchStatusProtection');
            $("#batch-update-status-btn").off('.batchStatus');
            $("#batch-complete-btn").off('.batchComplete');
            $("#batch-status-select").off('.batchStatus');

            // 强制显示现有复选框
            this.ensureCheckboxesVisible();

            // 监听复选框变化
            $(document).off('change.batchStatus', 'input[name="ids[]"]').on('change.batchStatus', 'input[name="ids[]"]', () => {
                console.log('复选框状态变化');
                // 立即保存状态
                this.saveCheckboxStates();

                // 使用防抖机制避免频繁更新
                clearTimeout(this.statusUpdateTimer);
                this.statusUpdateTimer = setTimeout(() => {
                    // 在更新前再次确保状态正确
                    this.restoreCheckboxStates();
                    this.updateStatusOptions();
                    this.updateSelectedTasksCount();
                }, 150);
            });

            // 保护复选框点击事件
            $(document).off('click.batchStatus', 'input[name="ids[]"]').on('click.batchStatus', 'input[name="ids[]"]', (e) => {
                e.stopPropagation();
            });

            // 监听状态下拉框变化
            $("#batch-status-select").off('.batchStatus').on('change.batchStatus', (e) => {
                console.log('状态下拉框值改变:', e.target.value);
                // 不再在下拉框变更时恢复复选框状态，避免错误地还原用户最新选择
                // 仅更新按钮状态/计数
                this.updateSelectedTasksCount();
            });

            // 移除对状态下拉框焦点时的状态保存，避免无意义的旧选中被记录

            // 添加简单的全局保护机制
            $(document).off('click.batchStatusProtection').on('click.batchStatusProtection', (e) => {
                const $target = $(e.target);
                // 如果点击的不是批量状态相关的元素，则恢复复选框状态
                if (!$target.is('input[name="ids[]"]') &&
                    !$target.closest('#batch-status-select, #batch-update-status-btn, #batch-complete-btn').length) {
                    this.restoreCheckboxStates();
                }
            });

            // 绑定按钮事件（先解绑避免重复绑定）
            $("#batch-update-status-btn").off('click.batchStatus').on('click.batchStatus', () => {
                console.log('批量更新状态按钮被点击');
                this.batchUpdateTaskStatus();
            });

            $("#batch-complete-btn").off('click.batchComplete').on('click.batchComplete', () => {
                console.log('批量完成按钮被点击');
                this.batchCompleteTasks();
            });

            // 延迟处理复选框
            setTimeout(() => {
                this.ensureCheckboxesVisible();
            }, 2000);

            // 监听DOM变化，处理动态添加的任务行
            const observer = new MutationObserver((mutations) => {
                let hasNewRows = false;
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1 && (node.matches('tr.issue') || node.querySelector('tr.issue'))) {
                                hasNewRows = true;
                            }
                        });
                    }
                });

                if (hasNewRows) {
                    console.log('检测到新的任务行，更新复选框可见性');
                    setTimeout(() => {
                        this.ensureCheckboxesVisible();
                    }, 100);
                }
            });

            // 开始观察任务表格的变化
            if ($issueTree.length) {
                observer.observe($issueTree[0], {
                    childList: true,
                    subtree: true
                });
            }
        }

        // 确保复选框可见（只对当前用户的任务）
        ensureCheckboxesVisible() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            const existingCheckboxes = $issueTree.find('input[name="ids[]"]');
            console.log('处理复选框数量:', existingCheckboxes.length);

            const myUserId = this.currentUserId;
            const myUserHref = `/users/${myUserId}`;

            // 强制设置所有复选框列的宽度
            $issueTree.find('td.checkbox, th.checkbox').each(function() {
                const $cell = $(this);
                $cell.css({
                    'display': 'table-cell',
                    'width': '30px',
                    'min-width': '30px',
                    'max-width': '30px',
                    'padding': '2px 4px',
                    'text-align': 'center',
                    'box-sizing': 'border-box',
                    'overflow': 'hidden',
                    'vertical-align': 'middle'
                });

                // 使用原生DOM强制设置
                this.style.setProperty('display', 'table-cell', 'important');
                this.style.setProperty('width', '30px', 'important');
                this.style.setProperty('min-width', '30px', 'important');
                this.style.setProperty('max-width', '30px', 'important');
                this.style.setProperty('box-sizing', 'border-box', 'important');
            });

            existingCheckboxes.each((index, checkbox) => {
                const $checkbox = $(checkbox);
                const $row = $checkbox.closest('tr.issue');

                // 检查任务是否归属于当前用户
                const $assignedTo = $row.find('td.assigned_to a.user');
                const isMine = $assignedTo.length && ($assignedTo.attr('href') || '').endsWith(myUserHref);

                // 设置data属性，让CSS控制可见性
                $row.attr('data-user-task', isMine ? 'true' : 'false');

                const $parentCell = $checkbox.closest('td.checkbox');

                if (isMine) {
                    console.log(`任务 ${$checkbox.val()} 归属于当前用户，显示复选框`);
                    // 确保当前用户任务的复选框列有正确宽度
                    if ($parentCell.length) {
                        $parentCell.css({
                            'display': 'table-cell',
                            'width': '30px',
                            'min-width': '30px',
                            'max-width': '30px'
                        });
                        $parentCell[0].style.setProperty('display', 'table-cell', 'important');
                        $parentCell[0].style.setProperty('width', '30px', 'important');
                        $parentCell[0].style.setProperty('min-width', '30px', 'important');
                        $parentCell[0].style.setProperty('max-width', '30px', 'important');
                    }
                } else {
                    console.log(`任务 ${$checkbox.val()} 不归属于当前用户，隐藏复选框`);
                    // 确保非当前用户的任务复选框不被选中
                    $checkbox.prop('checked', false);

                    // 完全隐藏其他用户任务的复选框列
                    if ($parentCell.length) {
                        $parentCell.css({
                            'width': '0',
                            'min-width': '0',
                            'max-width': '0',
                            'padding': '0',
                            'margin': '0',
                            'border': 'none'
                        });
                        $parentCell[0].style.setProperty('width', '0', 'important');
                        $parentCell[0].style.setProperty('min-width', '0', 'important');
                        $parentCell[0].style.setProperty('max-width', '0', 'important');
                        $parentCell[0].style.setProperty('padding', '0', 'important');
                    }
                }
            });

            console.log('复选框可见性设置完成');
        }

        // 保存复选框状态（使用内存存储）
        saveCheckboxStates() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) {
                console.log('任务表格不存在，无法保存复选框状态');
                return;
            }

            this.checkboxStates.clear();
            let checkedCount = 0;
            const checkedIds = [];

            $issueTree.find('input[name="ids[]"]').each((index, checkbox) => {
                const $checkbox = $(checkbox);
                const taskId = $checkbox.val();
                if (taskId) {
                    const isChecked = $checkbox.prop('checked');
                    this.checkboxStates.set(taskId, isChecked);
                    if (isChecked) {
                        checkedCount++;
                        checkedIds.push(taskId);
                    }
                }
            });

            console.log(`已保存复选框状态: ${checkedCount} 个选中`, checkedIds);
        }

        // 恢复复选框状态（使用内存存储）
        restoreCheckboxStates() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) {
                console.log('任务表格不存在，无法恢复复选框状态');
                return;
            }

            if (this.checkboxStates.size === 0) {
                console.log('没有保存的复选框状态可恢复');
                return;
            }

            let restoredCount = 0;
            let changedCount = 0;
            const restoredIds = [];

            $issueTree.find('input[name="ids[]"]').each((index, checkbox) => {
                const $checkbox = $(checkbox);
                const taskId = $checkbox.val();
                if (taskId && this.checkboxStates.has(taskId)) {
                    const shouldBeChecked = this.checkboxStates.get(taskId);
                    const currentlyChecked = $checkbox.prop('checked');

                    if (currentlyChecked !== shouldBeChecked) {
                        $checkbox.prop('checked', shouldBeChecked);
                        changedCount++;
                        console.log(`修正任务 ${taskId} 的复选框状态: ${currentlyChecked} -> ${shouldBeChecked}`);
                    }

                    if (shouldBeChecked) {
                        restoredCount++;
                        restoredIds.push(taskId);
                    }
                }
            });

            console.log(`已恢复复选框状态: ${restoredCount} 个选中, ${changedCount} 个状态被修正`, restoredIds);
        }

        // 更新状态选项
        updateStatusOptions() {
            const $issueTree = $("#issue_tree");
            const $statusSelect = $("#batch-status-select");
            const selectedTasks = [];

            const currentSelectedValue = $statusSelect.val();

            console.log('开始更新状态选项');

            // 收集选中任务的状态信息
            $issueTree.find('input[name="ids[]"]:checked').each((index, checkbox) => {
                const $row = $(checkbox).closest('tr.issue');
                const currentStatus = this.getTaskCurrentStatus($row);
                if (currentStatus) {
                    selectedTasks.push(currentStatus);
                }
            });

            console.log(`找到 ${selectedTasks.length} 个选中的任务`);

            // 清空并重新填充状态选项
            $statusSelect.empty();

            if (selectedTasks.length === 0) {
                $statusSelect.append('<option value="">请先选择要变更的任务</option>');
                console.log('没有选中任务');
                return;
            }

            // 添加默认选项
            $statusSelect.append('<option value="">请选择目标状态</option>');

            // 获取可用的目标状态
            const availableStatuses = this.getAvailableTargetStatuses(selectedTasks);

            if (availableStatuses.length === 0) {
                $statusSelect.append('<option value="">所选任务无可变更状态</option>');
                console.log('所选任务无可变更状态');
                return;
            }

            // 添加可用状态选项
            availableStatuses.forEach(status => {
                $statusSelect.append(`<option value="${status.id}">${status.name}</option>`);
            });

            // 恢复之前选择的值（如果仍然可用）
            if (currentSelectedValue && availableStatuses.some(s => s.id.toString() === currentSelectedValue)) {
                $statusSelect.val(currentSelectedValue);
            }

            console.log(`状态选项更新完成，可用状态: ${availableStatuses.length} 个`);
        }

        // 获取任务当前状态
        getTaskCurrentStatus($row) {
            // 尝试多种可能的状态单元格选择器
            const selectors = [
                'td.status',           // 最常见的
                'td[class*="status"]', // 包含status的class
                'td:contains("新建")',  // 直接查找包含状态文本的单元格
                'td:contains("进行中")',
                'td:contains("已实施")',
                'td:contains("完成")'
            ];

            let statusText = '';
            let $statusCell = null;

            // 首先尝试标准选择器
            $statusCell = $row.find('td.status');

            if ($statusCell.length) {
                statusText = $statusCell.text().trim();
            } else {
                // 尝试备用选择器
                for (const selector of selectors) {
                    $statusCell = $row.find(selector);
                    if ($statusCell.length) {
                        statusText = $statusCell.text().trim();
                        break;
                    }
                }
            }

            // 匹配状态
            if (statusText.includes('新建')) return 1;
            if (statusText.includes('进行中')) return 2;
            if (statusText.includes('已实施') || statusText.includes('完成')) return 5;

            return null;
        }

        // 获取可用的目标状态（优化版）
        getAvailableTargetStatuses(currentStatuses) {
            const statusMap = {
                1: { id: 1, name: '新建' },
                2: { id: 2, name: '进行中' },
                5: { id: 5, name: '已实施[完成]' }
            };

            // 如果没有选中任务，返回空数组
            if (!currentStatuses || currentStatuses.length === 0) {
                return [];
            }

            // 获取唯一的状态
            const uniqueStatuses = [...new Set(currentStatuses)];
            const availableStatuses = new Set();

            // 根据当前状态计算可用的目标状态
            uniqueStatuses.forEach(status => {
                switch (status) {
                    case 1: // 新建
                        availableStatuses.add(statusMap[2]); // 可以变为进行中
                        availableStatuses.add(statusMap[5]); // 可以直接完成
                        break;
                    case 2: // 进行中
                        availableStatuses.add(statusMap[5]); // 可以完成
                        break;
                    case 5: // 已完成
                        // 已完成的任务通常不能再变更状态
                        break;
                    default:
                        console.warn('未知的任务状态:', status);
                }
            });

            // 转换为数组并按逻辑顺序排序
            const result = Array.from(availableStatuses);
            result.sort((a, b) => a.id - b.id);

            console.log('可用目标状态:', result.map(s => s.name));
            return result;
        }

        // 更新选中任务数量和按钮状态（优化版）
        updateSelectedTasksCount() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            const selectedCount = $issueTree.find('input[name="ids[]"]:checked').length;
            const $updateBtn = $("#batch-update-status-btn");
            const $completeBtn = $("#batch-complete-btn");
            const newStatus = $("#batch-status-select").val();

            // 更新选中任务计数显示
            if (selectedCount === 0) {
                $("#selected-tasks-count").text('请选择要操作的任务');
            } else {
                // 统计不同状态的任务数量
                const statusCounts = { 1: 0, 2: 0, 5: 0 };
                $issueTree.find('input[name="ids[]"]:checked').each((index, checkbox) => {
                    const $row = $(checkbox).closest('tr.issue');
                    const currentStatus = this.getTaskCurrentStatus($row);
                    if (statusCounts.hasOwnProperty(currentStatus)) {
                        statusCounts[currentStatus]++;
                    }
                });

                const statusNames = { 1: '新建', 2: '进行中', 5: '已完成' };
                const statusText = Object.entries(statusCounts)
                    .filter(([status, count]) => count > 0)
                    .map(([status, count]) => `${statusNames[status]}${count}个`)
                    .join(', ');

                $("#selected-tasks-count").text(`已选择 ${selectedCount} 个任务: ${statusText}`);
            }

            // 更新批量更新按钮状态
            const canUpdate = selectedCount > 0 && newStatus && newStatus !== '';
            $updateBtn.prop('disabled', !canUpdate);

            // 更新批量完成按钮状态
            let completableCount = 0;
            if (selectedCount > 0) {
                $issueTree.find('input[name="ids[]"]:checked').each((index, checkbox) => {
                    const $row = $(checkbox).closest('tr.issue');
                    const currentStatus = this.getTaskCurrentStatus($row);
                    // 批量完成支持"新建"(1)和"进行中"(2)状态的任务
                    if (currentStatus === 1 || currentStatus === 2) {
                        completableCount++;
                    }
                });
            }

            $completeBtn.prop('disabled', completableCount === 0);
        }

        // 批量更新任务状态
        batchUpdateTaskStatus() {
            const newStatus = $("#batch-status-select").val();
            if (!newStatus) {
                alert('请选择要变更的状态！');
                return;
            }

            const selectedTaskIds = [];
            const $issueTree = $("#issue_tree");

            $issueTree.find('input[name="ids[]"]:checked').each((index, checkbox) => {
                const taskId = $(checkbox).val();
                if (taskId) {
                    selectedTaskIds.push(taskId);
                }
            });

            if (selectedTaskIds.length === 0) {
                alert('请至少选择一个任务！');
                return;
            }

            const statusText = $("#batch-status-select option:selected").text();
            const confirmed = window.confirm(`确定要将选中的 ${selectedTaskIds.length} 个任务状态变更为 "${statusText}" 吗？`);
            if (!confirmed) return;

            $("#batch-update-status-btn").prop('disabled', true).text('更新中...');

            let completedTasks = 0;
            let successCount = 0;
            let failCount = 0;
            const totalTasks = selectedTaskIds.length;

            selectedTaskIds.forEach((taskId, index) => {
                setTimeout(() => {
                    this.updateSingleTaskStatus(taskId, newStatus, (success) => {
                        completedTasks++;
                        if (success) {
                            successCount++;
                        } else {
                            failCount++;
                        }

                        if (completedTasks === totalTasks) {
                            const message = `任务状态更新完成！\n成功：${successCount}个\n失败：${failCount}个`;

                            $("#batch-update-status-btn").prop('disabled', false).text('批量更新');
                            $("#batch-status-select").val('');
                            this.updateSelectedTasksCount();

                            $issueTree.find('input[name="ids[]"]').prop('checked', false);
                            this.updateSelectedTasksCount();
                            // 清空已保存的复选框状态，避免后续误恢复
                            if (this.checkboxStates) {
                                this.checkboxStates.clear();
                            }

                            // 询问是否刷新页面
                            if (window.confirm(message + '\n任务状态更新完成！是否刷新页面查看最新状态？')) {
                                this.refreshPageContent();
                            }
                        }
                    });
                }, index * 500);
            });
        }

        // 更新单个任务状态 - 使用REST API
        updateSingleTaskStatus(taskId, newStatus, callback) {
            console.log(`开始更新任务 ${taskId} 状态为: ${newStatus}`);

            // 构建REST API URL
            const apiUrl = `${window.location.origin}/issues/${taskId}.json`;

            // 构建JSON数据
            const issueData = {
                issue: {
                    status_id: newStatus
                }
            };

            // 获取认证头信息
            const headers = this.getAuthHeaders({ isFormData: false, isJsonApi: true });

            console.log('状态更新REST API URL:', apiUrl);
            console.log('状态更新数据:', issueData);

            // 调试认证信息
            this.debugAuthInfo('状态更新(REST)', issueData);

            // 使用fetch发送REST API请求
            fetch(apiUrl, {
                method: 'PUT', // REST API通常使用PUT来更新资源
                body: JSON.stringify(issueData),
                headers: headers,
                credentials: 'same-origin'
            })
            .then(response => {
                console.log(`任务 ${taskId} 状态更新响应:`, response.status);

                if (response.status === 401) {
                    throw new Error(`身份验证失败 (401): 请检查 CSRF Token 或 API Key 配置`);
                } else if (response.status === 403) {
                    throw new Error(`权限不足 (403): 当前用户没有更新任务的权限`);
                } else if (response.status === 422) {
                    return response.text().then(text => {
                        throw new Error(`请求参数错误 (422): ${text}`);
                    });
                }

                // REST API成功响应通常是200或204
                if (response.status >= 200 && response.status < 300) {
                    console.log(`✅ 任务 ${taskId} 状态更新成功`);
                    if (callback) callback(true);
                } else {
                    console.error(`❌ 任务 ${taskId} 状态更新失败: HTTP ${response.status}`);
                    if (callback) callback(false);
                }
            })
            .catch(error => {
                console.error(`❌ 任务 ${taskId} 状态更新请求失败:`, error);
                if (callback) callback(false);
            });
        }

        // 批量完成任务（智能完成）
        batchCompleteTasks() {
            const selectedTasks = [];
            const $issueTree = $("#issue_tree");

            $issueTree.find('input[name="ids[]"]:checked').each((index, checkbox) => {
                const $row = $(checkbox).closest('tr.issue');
                const currentStatus = this.getTaskCurrentStatus($row);

                // 支持"新建"(1)和"进行中"(2)状态的任务
                if (currentStatus === 1 || currentStatus === 2) {
                    const taskId = $(checkbox).val();
                    if (taskId) {
                        selectedTasks.push({
                            id: taskId,
                            status: currentStatus
                        });
                    }
                }
            });

            if (selectedTasks.length === 0) {
                alert('请至少选择一个"新建"或"进行中"状态的任务！');
                return;
            }

            // 统计不同状态的任务数量
            const newTasks = selectedTasks.filter(t => t.status === 1).length;
            const inProgressTasks = selectedTasks.filter(t => t.status === 2).length;

            let confirmMessage = `确定要将选中的 ${selectedTasks.length} 个任务完成吗？\n\n`;
            if (newTasks > 0) {
                confirmMessage += `新建任务 ${newTasks} 个：新建 → 进行中 → 已实施[完成]\n`;
            }
            if (inProgressTasks > 0) {
                confirmMessage += `进行中任务 ${inProgressTasks} 个：进行中 → 已实施[完成]\n`;
            }

            const confirmed = window.confirm(confirmMessage);
            if (!confirmed) return;

            $("#batch-complete-btn").prop('disabled', true).text('完成中...');

            let completedTasks = 0;
            let successCount = 0;
            let failCount = 0;
            const totalTasks = selectedTasks.length;

            selectedTasks.forEach((task, index) => {
                setTimeout(() => {
                    if (task.status === 1) {
                        // 新建任务：两步操作
                        this.completeTaskInTwoSteps(task.id, (success) => {
                            completedTasks++;
                            if (success) {
                                successCount++;
                            } else {
                                failCount++;
                            }

                            if (completedTasks === totalTasks) {
                                this.showBatchCompleteResult(successCount, failCount);
                            }
                        });
                    } else if (task.status === 2) {
                        // 进行中任务：一步操作，直接完成
                        this.updateSingleTaskStatus(task.id, 5, (success) => {
                            completedTasks++;
                            if (success) {
                                successCount++;
                            } else {
                                failCount++;
                            }

                            if (completedTasks === totalTasks) {
                                this.showBatchCompleteResult(successCount, failCount);
                            }
                        });
                    }
                }, index * 1000);
            });
        }

        // 显示批量完成结果
        showBatchCompleteResult(successCount, failCount) {
            const message = `任务批量完成！\n成功：${successCount}个\n失败：${failCount}个`;
            alert(message);

            $("#batch-complete-btn").prop('disabled', false).text('批量完成');
            this.updateSelectedTasksCount();

            $("#issue_tree").find('input[name="ids[]"]').prop('checked', false);
            this.updateSelectedTasksCount();
            // 清空已保存的复选框状态，避免后续误恢复
            if (this.checkboxStates) {
                this.checkboxStates.clear();
            }

            // 询问是否刷新页面
            if (window.confirm('任务批量完成！是否刷新页面查看最新状态？')) {
                this.refreshPageContent();
            }
        }

        // 两步完成任务
        completeTaskInTwoSteps(taskId, callback) {
            console.log(`开始两步完成任务 ${taskId}`);

            this.updateSingleTaskStatus(taskId, 2, (step1Success) => {
                if (step1Success) {
                    console.log(`任务 ${taskId} 第一步成功：新建 -> 进行中`);

                    setTimeout(() => {
                        this.updateSingleTaskStatus(taskId, 5, (step2Success) => {
                            if (step2Success) {
                                console.log(`任务 ${taskId} 第二步成功：进行中 -> 已实施[完成]`);
                                if (callback) callback(true);
                            } else {
                                console.error(`任务 ${taskId} 第二步失败：进行中 -> 已实施[完成]`);
                                if (callback) callback(false);
                            }
                        });
                    }, 1000);
                } else {
                    console.error(`任务 ${taskId} 第一步失败：新建 -> 进行中`);
                    if (callback) callback(false);
                }
            });
        }

        // 修改：通过REST API获取当前任务的子任务数据
        async loadAllTasksData() {
            try {
                if (!this.defaultParentId) {
                    console.error('无法获取当前任务ID');
                    return false;
                }

                console.log('获取当前任务的子任务，任务ID:', this.defaultParentId);

                // 修改：添加更多include参数以获取完整信息
                const baseUrl = window.location.origin;
                const apiUrl = `${baseUrl}/issues/${this.defaultParentId}.json?include=children,relations,assigned_to`;

                console.log('获取任务数据:', apiUrl);

                const response = await this.authenticatedAjax({
                    url: apiUrl,
                    type: 'GET',
                    dataType: 'json'
                });

                if (response && response.issue) {
                    // 由于API可能不返回完整信息，从DOM中获取补充信息
                    this.allTasksData = [];
                    const $issueTree = $("#issue_tree");
                    
                    // 先添加当前任务
                    const currentTask = this.parseSingleTask(response.issue);
                    this.supplementTaskData(currentTask);
                    this.allTasksData.push(currentTask);

                    // 递归处理子任务
                    if (response.issue.children) {
                        this.processChildren(response.issue.children, currentTask.id);
                    }

                    this.buildTaskHierarchy();
                    this.markParentChildRelationships();
                    console.log('任务数据加载完成:', this.allTasksData.length, '个任务');
                    return true;
                }
                return false;
            } catch (error) {
                console.error('加载任务数据失败:', error);
                return false;
            }
        }

        // 新增：从DOM中补充任务数据
        supplementTaskData(task) {
            const $row = $(`tr.issue-${task.id}`);
            if ($row.length) {
                const $assignedTo = $row.find('td.assigned_to a.user');
                if ($assignedTo.length) {
                    const href = $assignedTo.attr('href');
                    const match = href.match(/\/users\/(\d+)/);
                    if (match) {
                        task.assigned_to_id = match[1];
                        task.assigned_to = $assignedTo.text().trim();
                    }
                }
            }
            return task;
        }

        // 新增：递归处理子任务
        processChildren(children, parentId) {
            children.forEach(child => {
                const task = this.parseSingleTask(child);
                task.parent = parentId;
                this.supplementTaskData(task);
                this.allTasksData.push(task);

                if (child.children && child.children.length > 0) {
                    this.processChildren(child.children, task.id);
                }
            });
        }

        // 新增：从class中提取任务ID的辅助方法
        getTaskIdFromClass($row) {
            const classes = $row.attr('class').split(/\s+/);
            const issueClass = classes.find(c => /^issue-\d+$/.test(c));
            return issueClass ? issueClass.replace('issue-', '') : null;
        }

        // 修改：在DOM上标识父子关系和任务属性
        markParentChildRelationships() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            console.log('开始标识DOM中的任务关系...');

            // 为每个任务行添加data属性和占位符
            $issueTree.find('tr.issue').each((index, row) => {
                const $row = $(row);
                const taskId = this.getTaskIdFromClass($row);

                if (taskId) {
                    const task = this.allTasksData.find(t => t.id === parseInt(taskId));
                    if (task) {
                        // 添加任务基本信息
                        $row.attr({
                            'data-task-id': taskId,
                            'data-assigned-to': task.assigned_to_id || '',
                            'data-parent-id': task.parent || '',
                            'data-is-my-task': task.assigned_to_id && task.assigned_to_id.toString() === this.currentUserId ? 'true' : 'false'
                        });

                        // 获取subject单元格
                        const $subjectCell = $row.find('td.subject');
                        
                        // 移除现有的折叠按钮或占位符
                        $subjectCell.find('.collapse-btn, .collapse-placeholder').remove();

                        // 检查是否有子任务
                        const hasChildren = this.taskHierarchy.has(parseInt(taskId));
                        
                        if (hasChildren) {
                            $row.addClass('has-children parent');
                            $row.attr('data-has-children', 'true');
                            this.addCollapseButtonToRow($row, taskId);
                        } else {
                            // 为没有子任务的行添加占位符
                            this.addPlaceholderToRow($row);
                        }
                    }
                }
            });

            console.log('DOM任务关系标识完成');
        }

        // 新增：为没有子任务的行添加占位符
        addPlaceholderToRow($row) {
            const $subjectCell = $row.find('td.subject');
            const $subjectLink = $subjectCell.find('a').first();
            
            // 创建占位符
            const $placeholder = $(`
                <span class="collapse-placeholder" style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    margin-right: 5px;
                "></span>
            `);
            
            // 插入到链接前面
            $subjectLink.before($placeholder);
        }

        // 修改：为单个行添加折叠按钮
        addCollapseButtonToRow($row, taskId) {
            // 检查是否已经添加过折叠按钮
            if ($row.find('.collapse-btn').length > 0) return;

            const isCollapsed = this.collapsedTaskIds.has(parseInt(taskId));
            const $subjectCell = $row.find('td.subject');
            const $subjectLink = $subjectCell.find('a').first();

            // 创建折叠按钮
            const $collapseBtn = $(`
                <span class="collapse-btn" style="
                    display: inline-block;
                    width: 16px;
                    height: 16px;
                    line-height: 16px;
                    text-align: center;
                    cursor: pointer;
                    margin-right: 5px;
                    font-weight: bold;
                    color: #666;
                    user-select: none;
                    border: 1px solid #ccc;
                    border-radius: 2px;
                    background: #f9f9f9;
                " data-task-id="${taskId}" title="${isCollapsed ? '展开子任务' : '折叠子任务'}">${isCollapsed ? '+' : '-'}</span>
            `);

            // 插入到链接前面
            $subjectLink.before($collapseBtn);

            // 绑定点击事件
            $collapseBtn.click((e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCollapseByDOM($row, taskId);
            });

            // 应用初始折叠状态
            if (isCollapsed) {
                this.collapseChildrenByDOM($row, taskId);
            }
        }

        // 新增：检查任务是否在筛选集合中
        isTaskInFilteredSet(taskId) {
            // 重新计算筛选集合
            const myUserId = this.currentUserId;
            const myTasks = this.allTasksData.filter(task => 
                task.assigned_to_id && task.assigned_to_id.toString() === myUserId
            );

            const showSet = new Set();

            // 对每个我的任务，添加其所有父任务和子任务
            myTasks.forEach(task => {
                showSet.add(task.id);
                
                // 添加所有父任务
                const parents = this.getAllParents(task.id);
                parents.forEach(parent => showSet.add(parent.id));
                
                // 添加所有子任务
                const children = this.getAllChildren(task.id, true);
                children.forEach(child => showSet.add(child.id));
            });

            // 确保当前任务（defaultParentId）始终显示
            if (this.defaultParentId) {
                showSet.add(parseInt(this.defaultParentId));
                
                // 添加当前任务的所有子任务
                const currentTaskChildren = this.getAllChildren(parseInt(this.defaultParentId), true);
                currentTaskChildren.forEach(child => showSet.add(child.id));
            }

            return showSet.has(taskId);
        }

        // 修改：应用当前筛选条件
        applyCurrentFilters() {
            const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
            console.log('应用筛选条件，筛选状态:', isFilterEnabled);
            
            if (isFilterEnabled) {
                this.filterMyTasksByData();
            } else {
                this.filteredTasksData = [...this.allTasksData];
                console.log('未启用筛选，显示所有任务:', this.filteredTasksData.length, '个');
            }
            
            // 重新渲染任务列表
            this.renderTasksList();
        }

        // 修改：从单个任务构建任务树
        buildTaskTreeFromIssue(issue) {
            const tasks = [];
            
            // 添加当前任务
            tasks.push(this.parseSingleTask(issue));
            
            // 递归添加所有子任务
            if (issue.children && issue.children.length > 0) {
                this.addChildrenToTasks(issue.children, tasks, issue.id);
            }
            
            return tasks;
        }

        // 修改：递归添加子任务 - 添加父任务ID参数
        addChildrenToTasks(children, tasks, parentId) {
            children.forEach(child => {
                // 设置父任务ID
                const taskWithParent = {
                    ...this.parseSingleTask(child),
                    parent: parentId
                };
                tasks.push(taskWithParent);
                
                // 递归处理子任务的子任务
                if (child.children && child.children.length > 0) {
                    this.addChildrenToTasks(child.children, tasks, child.id);
                }
            });
        }

        // 修改：解析单个任务数据
        parseSingleTask(issue) {
            return {
                id: issue.id,
                subject: issue.subject,
                status: issue.status ? issue.status.name : '',
                status_id: issue.status ? issue.status.id : null,
                assigned_to: issue.assigned_to ? issue.assigned_to.name : '',
                assigned_to_id: issue.assigned_to ? issue.assigned_to.id : null,
                start_date: issue.start_date,
                due_date: issue.due_date,
                parent: null, // 在addChildrenToTasks中设置
                children: issue.children || [],
                priority: issue.priority ? issue.priority.name : '',
                tracker: issue.tracker ? issue.tracker.name : '',
                project: issue.project ? issue.project.name : '',
                created_on: issue.created_on,
                updated_on: issue.updated_on,
                description: issue.description || ''
            };
        }

        // 修改：构建任务层级关系
        buildTaskHierarchy() {
            this.taskHierarchy.clear();
            
            console.log('开始构建任务层级关系...');
            console.log('所有任务数据:', this.allTasksData);
            
            // 按父任务分组
            this.allTasksData.forEach(task => {
                if (task.parent) {
                    if (!this.taskHierarchy.has(task.parent)) {
                        this.taskHierarchy.set(task.parent, []);
                    }
                    this.taskHierarchy.get(task.parent).push(task);
                }
            });

            console.log('任务层级关系构建完成:', this.taskHierarchy);
            
            // 调试输出：显示每个父任务的子任务数量
            this.taskHierarchy.forEach((children, parentId) => {
                console.log(`父任务 ${parentId} 有 ${children.length} 个子任务:`, children.map(c => c.id));
            });
        }

        // 新增：检查任务是否是我的任务的父任务
        isParentOfMyTask(taskId) {
            const myTasks = this.allTasksData.filter(task => 
                task.assigned_to_id && task.assigned_to_id.toString() === this.currentUserId
            );

            return myTasks.some(myTask => {
                const parents = this.getAllParents(myTask.id);
                return parents.some(parent => parent.id === taskId);
            });
        }

        // 新增：获取当前用户ID的方法
        getCurrentUserId() {
            // 从页面上的登录信息获取用户ID
            const $loggedAs = $('#loggedas a');
            if ($loggedAs.length) {
                const href = $loggedAs.attr('href');
                const match = href.match(/\/users\/(\d+)/);
                if (match) {
                    return match[1];
                }
            }

            // 备用方法：从其他可能的元素获取
            const $userLink = $('.user.active');
            if ($userLink.length) {
                const href = $userLink.attr('href');
                const match = href.match(/\/users\/(\d+)/);
                if (match) {
                    return match[1];
                }
            }

            console.error('无法获取当前用户ID');
            return null;
        }

        // 初始化折叠功能
        initCollapseFeature() {
            // 先加载任务数据
            this.loadAllTasksData().then(success => {
                if (success) {
                    this.restoreCollapseState();
                    // 检查并应用筛选状态
                    const isFilterEnabled = localStorage.getItem('redmine_my_task_filter') === '1';
                    if (isFilterEnabled) {
                        this.filterMyTasks();
                    } else {
                        this.applyCollapseStateToDOM();
                    }
                }
            });
        }

        // 新增：获取总任务数量
        getTotalTaskCount() {
            let total = 0;
            
            // 计算父任务数量
            const parentTasks = this.taskList.filter(task => task.isParent);
            total += parentTasks.length;
            
            // 计算子任务数量
            this.taskList.forEach(task => {
                if (task.children && task.children.length > 0) {
                    total += task.children.length;
                }
            });
            
            return total;
        }

        // 新增：获取子任务数量
        getChildTaskCount() {
            let total = 0;
            this.taskList.forEach(task => {
                if (task.children && task.children.length > 0) {
                    total += task.children.length;
                }
            });
            return total;
        }

        // 新增：初始化快速复制任务ID功能
        initQuickCopyFeature() {
            this.addCopyButtonsToAllRows();
            this.observeNewRows(); // 监听新添加的行
        }

        // 新增：为所有任务行添加复制按钮
        addCopyButtonsToAllRows() {
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            $issueTree.find('tr.issue').each((index, row) => {
                this.addCopyButtonToRow($(row));
            });
        }

        // 新增：为单个任务行添加复制按钮
        addCopyButtonToRow($row) {
            // 检查是否已经添加过复制按钮
            if ($row.find('.copy-task-id-btn').length > 0) return;

            const taskId = this.getTaskIdFromClass($row);
            if (!taskId) return;

            // 创建复制按钮
            const $copyBtn = $(`
                <span class="copy-task-id-btn" style="
                    display: inline-block;
                    width: 18px;
                    height: 18px;
                    line-height: 18px;
                    text-align: center;
                    cursor: pointer;
                    margin-left: 5px;
                    font-size: 12px;
                    color: #666;
                    background: #f0f0f0;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    user-select: none;
                    vertical-align: middle;
                " title="复制任务ID: ${taskId}" data-task-id="${taskId}">📋</span>
            `);

            // 将按钮添加到ID列或主题列
            const $idCell = $row.find('td.id');
            if ($idCell.length) {
                // 如果有ID列，添加到ID列
                $idCell.append($copyBtn);
            } else {
                // 否则添加到主题列
                const $subjectCell = $row.find('td.subject');
                $subjectCell.append($copyBtn);
            }

            // 绑定点击事件
            $copyBtn.click((e) => {
                e.preventDefault();
                e.stopPropagation();
                this.copyTaskIdToClipboard(taskId, $copyBtn);
            });

            // 添加鼠标悬停效果
            $copyBtn.hover(
                function() {
                    $(this).css('background', '#e0e0e0');
                },
                function() {
                    $(this).css('background', '#f0f0f0');
                }
            );
        }

        // 新增：复制任务ID到剪贴板
        async copyTaskIdToClipboard(taskId, $button) {
            try {
                // 尝试使用现代的 Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(taskId);
                    this.showCopySuccess($button, taskId);
                } else {
                    // 降级到传统方法
                    this.fallbackCopyToClipboard(taskId, $button);
                }
            } catch (error) {
                console.error('复制失败:', error);
                this.fallbackCopyToClipboard(taskId, $button);
            }
        }
        /**
         * 计算并显示当日工时 - 修复版本
         */
        async calculateAndDisplayTodayHours() {
            try {
                // 获取当前任务ID
                const $spentTimeLink = $('.spent-time a');
                if (!$spentTimeLink.length) {
                    $('#today-hours-value').text('无法获取任务链接');
                    return;
                }

                const href = $spentTimeLink.attr('href');
                const match = href.match(/issue_id=~(\d+)/);
                if (!match) {
                    $('#today-hours-value').text('无法解析任务ID');
                    return;
                }

                const issueId = match[1];
                const currentUserId = this.getCurrentUserId();
                if (!currentUserId) {
                    $('#today-hours-value').text('无法获取用户ID');
                    return;
                }

                // 构造时间条目查询URL
                const timeEntriesUrl = window.location.origin + `/time_entries?utf8=%E2%9C%93&set_filter=1&sort=spent_on%3Adesc&f%5B%5D=spent_on&op%5Bspent_on%5D=t&f%5B%5D=issue_id&op%5Bissue_id%5D=%7E&v%5Bissue_id%5D%5B%5D=${issueId}&f%5B%5D=user_id&op%5Buser_id%5D=%3D&v%5Buser_id%5D%5B%5D=${currentUserId}&f%5B%5D=&c%5B%5D=project&c%5B%5D=spent_on&c%5B%5D=user&c%5B%5D=activity&c%5B%5D=issue&c%5B%5D=comments&c%5B%5D=hours&group_by=&t%5B%5D=hours&t%5B%5D=`;

                // 发起请求获取时间条目页面
                const response = await fetch(timeEntriesUrl);
                const htmlText = await response.text();

                // 创建临时DOM解析返回的HTML
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // 查找总工时元素 - 从Total-for-hours下的value元素获取
                const totalHoursContainer = doc.querySelector('.total-for-hours');
                if (totalHoursContainer) {
                    const totalHoursElement = totalHoursContainer.querySelector('.value');
                    if (totalHoursElement) {
                        const totalHours = totalHoursElement.textContent.trim();

                        // 创建链接元素
                        const $link = $(`<a href="${timeEntriesUrl}" target="_blank">${totalHours} 小时</a>`);

                        // 如果工时小于6小时，将文本标红
                        if (parseFloat(totalHours) < 6) {
                            $link.css('color', 'red');
                        }

                        $('#today-hours-value').html($link);
                    } else {
                        // 创建链接元素
                        const $link = $(`<a href="${timeEntriesUrl}" target="_blank">今日还未登记工时</a>`);
                        $link.css('color', 'red'); // 0小时也标红
                        $('#today-hours-value').html($link);
                    }
                } else {
                    // 创建链接元素
                    const $link = $(`<a href="${timeEntriesUrl}" target="_blank">0.00 小时</a>`);
                    $link.css('color', 'red'); // 0小时也标红
                    $('#today-hours-value').html($link);
                }
            } catch (error) {
                $('#today-hours-value').html(`<a href="#" style="color: red;">获取失败</a>`);
            }
        }



        // 新增：降级复制方法
        fallbackCopyToClipboard(taskId, $button) {
            // 创建临时文本区域
            const textArea = document.createElement('textarea');
            textArea.value = taskId;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            
            try {
                textArea.focus();
                textArea.select();
                const successful = document.execCommand('copy');
                if (successful) {
                    this.showCopySuccess($button, taskId);
                } else {
                    this.showCopyError($button, taskId);
                }
            } catch (error) {
                console.error('降级复制也失败:', error);
                this.showCopyError($button, taskId);
            } finally {
                document.body.removeChild(textArea);
            }
        }

        // 新增：显示复制成功反馈
        showCopySuccess($button, taskId) {
            const originalText = $button.text();
            const originalTitle = $button.attr('title');
            
            // 临时改变按钮样式和文本
            $button.text('✓')
                   .css({
                       'background': '#d4edda',
                       'color': '#155724',
                       'border-color': '#c3e6cb'
                   })
                   .attr('title', `已复制: ${taskId}`);

            // 显示浮动提示
            this.showFloatingMessage(`已复制任务ID: ${taskId}`, 'success');

            // 2秒后恢复原样
            setTimeout(() => {
                $button.text(originalText)
                       .css({
                           'background': '#f0f0f0',
                           'color': '#666',
                           'border-color': '#ccc'
                       })
                       .attr('title', originalTitle);
            }, 2000);
        }

        // 新增：显示复制失败反馈
        showCopyError($button, taskId) {
            const originalText = $button.text();
            const originalTitle = $button.attr('title');
            
            // 临时改变按钮样式和文本
            $button.text('✗')
                   .css({
                       'background': '#f8d7da',
                       'color': '#721c24',
                       'border-color': '#f5c6cb'
                   })
                   .attr('title', `复制失败: ${taskId}`);

            // 显示浮动提示
            this.showFloatingMessage(`复制失败: ${taskId}`, 'error');

            // 2秒后恢复原样
            setTimeout(() => {
                $button.text(originalText)
                       .css({
                           'background': '#f0f0f0',
                           'color': '#666',
                           'border-color': '#ccc'
                       })
                       .attr('title', originalTitle);
            }, 2000);
        }

        // 新增：显示浮动消息
        showFloatingMessage(message, type = 'info') {
            // 移除已存在的消息
            $('.copy-message').remove();

            const bgColor = type === 'success' ? '#d4edda' : 
                           type === 'error' ? '#f8d7da' : '#d1ecf1';
            const textColor = type === 'success' ? '#155724' : 
                             type === 'error' ? '#721c24' : '#0c5460';
            const borderColor = type === 'success' ? '#c3e6cb' : 
                               type === 'error' ? '#f5c6cb' : '#bee5eb';

            const $message = $(`
                <div class="copy-message" style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: ${bgColor};
                    color: ${textColor};
                    border: 1px solid ${borderColor};
                    border-radius: 5px;
                    padding: 10px 15px;
                    font-size: 14px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease-out;
                ">${message}</div>
            `);

            // CSS动画样式已在类初始化时注册

            $('body').append($message);

            // 3秒后自动消失
            setTimeout(() => {
                $message.css('animation', 'slideOutRight 0.3s ease-in');
                setTimeout(() => {
                    $message.remove();
                }, 300);
            }, 3000);
        }

        // 新增：监听新添加的行
        observeNewRows() {
            // 如果已经有观察器，先断开
            if (this.rowObserver) {
                this.rowObserver.disconnect();
            }

            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) return;

            // 创建 MutationObserver 来监听新添加的行
            this.rowObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // 元素节点
                                const $node = $(node);
                                // 检查是否是任务行或包含任务行
                                if ($node.hasClass('issue')) {
                                    this.addCopyButtonToRow($node);
                                } else {
                                    // 查找子元素中的任务行
                                    $node.find('tr.issue').each((index, row) => {
                                        this.addCopyButtonToRow($(row));
                                    });
                                }
                            }
                        });
                    }
                });
            });

            // 开始观察
            this.rowObserver.observe($issueTree[0], {
                childList: true,
                subtree: true
            });
        }
        
        // 新增：将日期格式化为周显示格式的方法
        formatDateAsWeek(dateString) {
            if (!dateString) return '';

            try {
                const date = new Date(dateString);
                if (isNaN(date.getTime())) return dateString;

                // 获取当前日期
                const today = new Date();
                today.setHours(0, 0, 0, 0); // 清除时间部分

                // 获取目标日期
                date.setHours(0, 0, 0, 0); // 清除时间部分

                // 计算两个日期之间的天数差
                const timeDiff = date.getTime() - today.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

                // 计算周数差（以周一为一周开始）
                const getWeekNumber = (d) => {
                    const target = new Date(d.valueOf());
                    const dayNumber = (d.getDay() + 6) % 7; // 周一为0，周日为6
                    target.setDate(target.getDate() - dayNumber + 3); // 周四
                    const firstThursday = target.valueOf();
                    target.setMonth(0, 1);
                    if (target.getDay() !== 4) {
                        target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
                    }
                    const weekNumber = 1 + Math.ceil((firstThursday - target) / (7 * 24 * 3600 * 1000));
                    return weekNumber;
                };

                // 获取年份和周数
                const todayWeek = getWeekNumber(today);
                const dateWeek = getWeekNumber(date);
                const todayYear = today.getFullYear();

                // 简化计算周差的方法
                const getWeekDiff = () => {
                    // 计算两个日期之间完整的周数差
                    const oneDay = 24 * 60 * 60 * 1000;
                    const days = Math.round((date - today) / oneDay);
                    const weekDiff = Math.floor((days + today.getDay()) / 7) - Math.floor(today.getDay() / 7);
                    return weekDiff;
                };

                const weekDiff = getWeekDiff();

                // 获取星期几 (0=周日, 1=周一, ..., 6=周六)
                const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
                const weekday = weekdays[date.getDay()];

                // 根据周数差添加前缀
                if (weekDiff === -1) {
                    return '上' + weekday;
                } else if (weekDiff === 0) {
                    return '本' + weekday;
                } else if (weekDiff === 1) {
                    return '下' + weekday;
                } else {
                    // 对于超出上周、本周、下周范围的日期，只显示周几
                    return weekday;
                }
            } catch (e) {
                console.warn('日期格式化为周时出错:', dateString, e);
                return dateString;
            }
        }

        // 新增：更新日期显示格式的方法
        updateDateDisplay(mode) {
            const $issueTree = $("#issue_tree");
            const $dateCells = $issueTree.find('td.start_date, td.due_date');

            console.log(`更新日期显示模式为: ${mode}`);

            $dateCells.each((index, cell) => {
                const $cell = $(cell);
                const dateText = $cell.data('original-date') || $cell.text().trim();

                // 保存原始日期数据
                if (!$cell.data('original-date')) {
                    $cell.data('original-date', dateText);
                }

                // 根据模式更新显示
                if (mode === 'week' && dateText) {
                    const weekText = this.formatDateAsWeek(dateText);
                    $cell.text(weekText);
                } else {
                    $cell.text(dateText);
                }
            });
        }

        /**
         * 初始化当日工时统计显示
         */
        initTodayHoursDisplay() {
            const self = this;
            $(document).ready(function() {
                self.addTodayHoursField();
            });
        }

        /**
         * 添加当日工时统计字段
         */
        addTodayHoursField() {
            const $spentTime = $('.spent-time');
            if ($spentTime.length === 0) {
                //console.warn('未找到 spent-time 元素');
                return;
            }

            // 检查是否已经存在当日工时字段，避免重复创建
            if ($('.today-hours').length > 0) {
                console.log('当日工时字段已存在，跳过重复初始化');
                // 重新计算并显示当日工时
                this.calculateAndDisplayTodayHours();
                return;
            }

            // 创建当日工时统计字段，使用更显眼的样式
            const $todayHoursField = $(`        <div class="today-hours attribute" style="display: flex; align-items: center; gap: 8px;">
            <div class="label" style="font-weight: bold; color: #2060a0; font-size: 14px;">当日工时:</div>
            <div class="value" id="today-hours-value" style="font-weight: bold; font-size: 14px; padding: 4px 8px; border-radius: 4px; background-color: #f0f8ff; border: 1px solid #2060a0; min-width: 80px; text-align: center;">计算中...</div>
        </div>
    `);

            // 插入到 spent-time 后面
            $spentTime.after($todayHoursField);
            // 计算并显示当日工时
            // 计算并显示当日工时
            this.calculateAndDisplayTodayHours();
        }

        /**
         * 初始化任务编辑器功能
         * 支持任务日期、人员指派、开发状态的直接修改
         */
        initTaskEditor() {
            console.log('=== 初始化任务编辑器功能 ===');

            // 检查是否在任务列表页面
            const $issueTree = $("#issue_tree");
            if (!$issueTree.length) {
                console.log('未找到任务列表，任务编辑器功能不启用');
                return;
            }

            // 初始化编辑器数据
            this.initTaskEditorData();

            // 为现有的可编辑单元格添加编辑功能
            this.addEditorsToExistingCells();

            // 监听新添加的行
            this.observeNewRowsForTaskEditor();

            // 注册任务编辑器样式
            this.registerTaskEditorStyles();

            console.log('✓ 任务编辑器功能初始化完成');
        }

        /**
         * 初始化任务编辑器数据
         */
        async initTaskEditorData() {
            // 加载项目成员列表（如果还没有加载）
            if (!this.projectMembers || this.projectMembers.length === 0) {
                await this.loadAndPopulateAssigneeFilter();
            }

            // 加载状态选项
            await this.loadStatusOptions();

            console.log('任务编辑器数据初始化完成');
        }

        /**
         * 加载状态选项
         */
        async loadStatusOptions() {
            console.log('=== 加载状态选项 ===');

            try {
                // 尝试从REST API获取状态列表
                const response = await this.authenticatedFetch('/issue_statuses.json');

                console.log('状态选项API响应状态:', response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log('状态选项API响应数据:', data);
                    if (data.issue_statuses) {
                        // 确保ID是字符串格式，便于后续比较
                        this.statusOptions = data.issue_statuses.map(status => ({
                            id: String(status.id),
                            name: status.name
                        }));
                        console.log('✓ 成功加载状态选项:', this.statusOptions.length, '个', this.statusOptions);
                        return;
                    }
                }
            } catch (error) {
                console.warn('从API加载状态选项失败:', error);
            }

            // 如果API失败，尝试从页面中提取状态选项
            this.extractStatusOptionsFromPage();
        }

        /**
         * 从页面中提取状态选项
         */
        extractStatusOptionsFromPage() {
            console.log('尝试从页面中提取状态选项...');

            const statusOptions = [];

            // 尝试从状态筛选器中提取
            const $statusFilter = $('#status_id');
            if ($statusFilter.length > 0) {
                $statusFilter.find('option').each((index, option) => {
                    const $option = $(option);
                    const id = $option.val();
                    const name = $option.text().trim();

                    if (id && name && id !== '' && name !== '') {
                        statusOptions.push({
                            id: String(id),
                            name: name
                        });
                    }
                });
            }

            // 尝试从现有任务行中提取状态信息
            if (statusOptions.length === 0) {
                const statusSet = new Set();
                $('#issue_tree tr.issue td.status').each((index, cell) => {
                    const statusText = $(cell).text().trim();
                    if (statusText && statusText !== '-') {
                        statusSet.add(statusText);
                    }
                });

                // 为提取的状态创建临时ID（这不是最佳方案，但可以作为备选）
                let tempId = 1;
                statusSet.forEach(statusName => {
                    statusOptions.push({
                        id: String(tempId++),
                        name: statusName
                    });
                });
            }

            if (statusOptions.length > 0) {
                this.statusOptions = statusOptions;
                console.log('✓ 从页面提取到状态选项:', this.statusOptions);
            } else {
                console.warn('未能从页面提取到状态选项');
            }
        }

        /**
         * 注册任务编辑器相关样式
         */
        registerTaskEditorStyles() {
            this.styles.set('task-editor-styles', `
                /* 任务编辑器样式 */
                .task-editor-input, .task-editor-select {
                    width: 100%;
                    padding: 2px 4px;
                    border: 1px solid #ccc;
                    border-radius: 3px;
                    font-size: 11px;
                    background: #fff;
                    box-sizing: border-box;
                }

                .task-editor-input:focus, .task-editor-select:focus {
                    border-color: #628DB6;
                    outline: none;
                    box-shadow: 0 0 3px rgba(98, 141, 182, 0.3);
                }

                .task-cell-editable {
                    cursor: pointer;
                    position: relative;
                    min-width: 80px;
                }

                .task-cell-editable:hover {
                    background-color: #f0f8ff;
                }

                .task-edit-icon {
                    position: absolute;
                    right: 2px;
                    top: 50%;
                    transform: translateY(-50%);
                    font-size: 10px;
                    color: #999;
                    opacity: 0;
                    transition: opacity 0.2s;
                }

                .task-cell-editable:hover .task-edit-icon {
                    opacity: 1;
                }

                .task-saving {
                    background-color: #fff3cd !important;
                    border: 1px solid #ffeaa7;
                }

                .task-save-success {
                    background-color: #d4edda !important;
                    border: 1px solid #c3e6cb;
                    transition: background-color 2s ease;
                }

                .task-save-error {
                    background-color: #f8d7da !important;
                    border: 1px solid #f5c6cb;
                }

                /* 特定字段样式 */
                .assigned-to-cell-editable {
                    min-width: 100px;
                }

                .status-cell-editable {
                    min-width: 80px;
                }

                .date-cell-editable {
                    min-width: 90px;
                }
            `);

            // 立即注入样式
            this.addStyle(this.styles.get('task-editor-styles'), 'task-editor-styles');
        }

        /**
         * 为现有的可编辑单元格添加编辑功能
         */
        addEditorsToExistingCells() {
            const $issueTree = $("#issue_tree");

            // 查找所有可编辑的单元格
            $issueTree.find('td.start_date, td.due_date, td.assigned_to, td.status').each((index, cell) => {
                this.addEditorToCell($(cell));
            });

            console.log('已为现有可编辑单元格添加编辑功能');
        }

        /**
         * 为单个单元格添加编辑功能
         */
        addEditorToCell($cell) {
            // 获取任务ID
            const $row = $cell.closest('tr.issue');
            const taskId = $row.attr('data-task-id') || this.extractTaskIdFromRow($row);

            if (!taskId) {
                return;
            }

            // 确定字段类型和标签
            let fieldType, fieldLabel, cssClass;
            if ($cell.hasClass('start_date')) {
                fieldType = 'start_date';
                fieldLabel = '开始日期';
                cssClass = 'date-cell-editable';
            } else if ($cell.hasClass('due_date')) {
                fieldType = 'due_date';
                fieldLabel = '结束日期';
                cssClass = 'date-cell-editable';
            } else if ($cell.hasClass('assigned_to')) {
                fieldType = 'assigned_to';
                fieldLabel = '指派人员';
                cssClass = 'assigned-to-cell-editable';
            } else if ($cell.hasClass('status')) {
                fieldType = 'status';
                fieldLabel = '状态';
                cssClass = 'status-cell-editable';
            } else {
                return; // 不支持的字段类型
            }

            // 避免重复添加
            if ($cell.hasClass('task-cell-editable')) {
                return;
            }

            // 添加可编辑样式和图标
            $cell.addClass('task-cell-editable').addClass(cssClass);
            $cell.attr('title', `点击编辑${fieldLabel}`);

            // 添加编辑图标
            if (!$cell.find('.task-edit-icon').length) {
                $cell.append('<span class="task-edit-icon">✏️</span>');
            }

            // 绑定点击事件
            $cell.off('click.taskEditor').on('click.taskEditor', (e) => {
                e.stopPropagation();
                this.startFieldEdit($cell, taskId, fieldType);
            });
        }

        /**
         * 开始编辑字段
         */
        async startFieldEdit($cell, taskId, fieldType) {
            // 如果已经在编辑状态，不重复处理
            if ($cell.find('.task-editor-input, .task-editor-select').length > 0) {
                return;
            }

            const currentValue = this.extractCurrentValue($cell, fieldType);
            const fieldLabel = this.getFieldLabel(fieldType);

            console.log(`开始编辑任务 ${taskId} 的${fieldLabel}，当前值: ${currentValue}`);

            // 保存原始内容
            const originalContent = $cell.html();

            // 显示加载状态（特别是对于状态字段）
            if (fieldType === 'status') {
                $cell.html('<span>加载可用状态...</span>');
            }

            try {
                // 创建编辑控件（异步）
                const $editor = await this.createFieldEditor(fieldType, currentValue, taskId);

                // 替换单元格内容为编辑控件
                $cell.html($editor);
                $editor.focus();

                // 绑定事件
                $editor.on('blur keydown change', (e) => {
                    if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== 'Escape') {
                        return;
                    }

                    if (e.key === 'Escape') {
                        // 取消编辑
                        $cell.html(originalContent);
                        return;
                    }

                    // 获取新值
                    const newValue = $editor.val();

                    // 检查值是否有实际变更
                    if (newValue === currentValue) {
                        console.log(`任务 ${taskId} 的${fieldLabel}没有变更，取消保存`);
                        $cell.html(originalContent);
                        return;
                    }

                    // 对于状态字段，验证是否为有效的转换
                    if (fieldType === 'status') {
                        this.validateAndSaveStatusChange($cell, taskId, currentValue, newValue, originalContent);
                    } else {
                        // 保存其他字段编辑
                        this.saveFieldEdit($cell, taskId, fieldType, newValue, originalContent);
                    }
                });

            } catch (error) {
                console.error(`创建${fieldLabel}编辑器失败:`, error);
                $cell.html(originalContent);

                if (fieldType === 'status') {
                    this.showTaskEditError(`无法获取任务的可用状态。\n可能原因：\n1. 无法访问任务编辑页面\n2. 当前用户没有编辑权限\n3. 任务状态配置异常`);
                } else {
                    this.showTaskEditError(`无法加载${fieldLabel}编辑器，请重试`);
                }
            }
        }

        /**
         * 提取当前字段值
         */
        extractCurrentValue($cell, fieldType) {
            const cellText = $cell.clone().find('.task-edit-icon').remove().end().text().trim();

            switch (fieldType) {
                case 'start_date':
                case 'due_date':
                    return this.parseDateString(cellText) || '';
                case 'assigned_to':
                    // 从链接中提取用户ID
                    const $userLink = $cell.find('a.user');
                    if ($userLink.length > 0) {
                        const href = $userLink.attr('href');
                        const match = href.match(/\/users\/(\d+)$/);
                        return match ? match[1] : '';
                    }
                    return '';
                case 'status':
                    // 从状态文本中匹配状态ID
                    const statusName = cellText;
                    console.log('提取状态值 - 单元格文本:', statusName, '可用状态选项:', this.statusOptions);

                    if (!this.statusOptions || this.statusOptions.length === 0) {
                        console.warn('状态选项未加载，无法提取状态ID');
                        return '';
                    }

                    const status = this.statusOptions.find(s => s.name === statusName);
                    const statusId = status ? status.id : '';
                    console.log('状态名称匹配结果:', statusName, '->', statusId);
                    return statusId;
                default:
                    return cellText;
            }
        }

        /**
         * 获取字段标签
         */
        getFieldLabel(fieldType) {
            const labels = {
                'start_date': '开始日期',
                'due_date': '结束日期',
                'assigned_to': '指派人员',
                'status': '状态'
            };
            return labels[fieldType] || fieldType;
        }

        /**
         * 创建字段编辑器
         */
        async createFieldEditor(fieldType, currentValue, taskId = null) {
            switch (fieldType) {
                case 'start_date':
                case 'due_date':
                    return $(`<input type="date" class="task-editor-input" value="${currentValue}">`);

                case 'assigned_to':
                    const $assigneeSelect = $('<select class="task-editor-select"></select>');
                    $assigneeSelect.append('<option value="">未指派</option>');

                    // 添加当前用户
                    const currentUserId = this.currentUserId;
                    $assigneeSelect.append(`<option value="${currentUserId}" ${currentValue === currentUserId ? 'selected' : ''}>我自己</option>`);

                    // 添加项目成员
                    if (this.projectMembers && this.projectMembers.length > 0) {
                        this.projectMembers.forEach(member => {
                            if (member.id !== currentUserId) {
                                $assigneeSelect.append(`<option value="${member.id}" ${currentValue === member.id ? 'selected' : ''}>${member.name}</option>`);
                            }
                        });
                    }

                    return $assigneeSelect;

                case 'status':
                    const $statusSelect = $('<select class="task-editor-select"></select>');
                    $statusSelect.append('<option value="">加载中...</option>');

                    // 从任务编辑页面加载可用状态
                    if (taskId) {
                        try {
                            const availableStatuses = await this.loadTaskAvailableStatuses(taskId, currentValue);
                            $statusSelect.empty();

                            if (availableStatuses && availableStatuses.length > 0) {
                                availableStatuses.forEach(status => {
                                    $statusSelect.append(`<option value="${status.id}" ${currentValue === status.id ? 'selected' : ''}>${status.name}</option>`);
                                });
                                console.log(`✓ 状态选择器已创建，包含 ${availableStatuses.length} 个可用状态`);
                            } else {
                                $statusSelect.append('<option value="">该任务无可用状态</option>');
                                $statusSelect.prop('disabled', true);
                            }
                        } catch (error) {
                            console.error('加载可用状态失败:', error);
                            $statusSelect.empty();
                            $statusSelect.append('<option value="">无法加载状态</option>');
                            $statusSelect.prop('disabled', true);
                        }
                    } else {
                        $statusSelect.empty();
                        $statusSelect.append('<option value="">缺少任务ID</option>');
                        $statusSelect.prop('disabled', true);
                    }

                    return $statusSelect;

                default:
                    return $(`<input type="text" class="task-editor-input" value="${currentValue}">`);
            }
        }

        /**
         * 从任务编辑页面获取可用状态
         */
        async loadTaskAvailableStatuses(taskId, currentStatusId) {
            console.log(`=== 从编辑页面加载任务 ${taskId} 的可用状态 ===`);
            console.log('当前状态ID:', currentStatusId);

            try {
                const editUrl = `${window.location.origin}/issues/${taskId}/edit`;
                console.log('访问编辑页面:', editUrl);

                const response = await fetch(editUrl, {
                    method: 'GET',
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const html = await response.text();
                    const $doc = $(html);

                    const availableStatuses = [];

                    // 从编辑页面的状态下拉框中提取可用状态
                    const $statusSelect = $doc.find('#issue_status_id');
                    if ($statusSelect.length > 0) {
                        $statusSelect.find('option').each((index, option) => {
                            const $option = $(option);
                            const statusId = $option.val();
                            const statusName = $option.text().trim();

                            if (statusId && statusName && statusId !== '') {
                                availableStatuses.push({
                                    id: String(statusId),
                                    name: statusName
                                });
                            }
                        });

                        console.log('✓ 从编辑页面获取到可用状态:', availableStatuses);
                        return availableStatuses;
                    } else {
                        throw new Error('编辑页面中未找到状态选择器');
                    }
                } else {
                    throw new Error(`无法访问编辑页面: ${response.status}`);
                }

            } catch (error) {
                console.error('从编辑页面加载状态失败:', error);
                throw error;
            }
        }

        /**
         * 验证并保存状态变更
         */
        async validateAndSaveStatusChange($cell, taskId, currentStatusId, newStatusId, originalContent) {
            console.log(`验证状态变更: 任务${taskId} 从状态${currentStatusId} 变更为状态${newStatusId}`);

            try {
                // 重新获取可用状态转换，确保新状态是有效的
                const availableStatuses = await this.loadTaskAvailableStatuses(taskId, currentStatusId);

                // 检查新状态是否在可用状态列表中
                const isValidTransition = availableStatuses.some(status => String(status.id) === String(newStatusId));

                if (!isValidTransition) {
                    console.error(`无效的状态转换: 状态${newStatusId} 不在可用转换列表中`);
                    console.error('可用状态:', availableStatuses);

                    $cell.html(originalContent);
                    this.showTaskEditError(`无效的状态转换！\n所选状态不在可用选项中。\n可用状态: ${availableStatuses.map(s => s.name).join(', ')}`);
                    return;
                }

                // 状态转换有效，执行保存
                console.log('✓ 状态转换验证通过，执行保存');
                this.saveFieldEdit($cell, taskId, 'status', newStatusId, originalContent);

            } catch (error) {
                console.error('验证状态转换时发生错误:', error);
                $cell.html(originalContent);
                this.showTaskEditError('无法验证状态转换，请重试');
            }
        }



        /**
         * 保存字段编辑
         */
        async saveFieldEdit($cell, taskId, fieldType, newValue, originalContent) {
            const fieldLabel = this.getFieldLabel(fieldType);

            console.log(`保存任务 ${taskId} 的${fieldLabel}: ${newValue}`);

            // 显示保存状态
            $cell.addClass('task-saving');
            $cell.html(`<span>保存中...</span>`);

            try {
                // 构建更新数据
                const updateData = {
                    issue: {}
                };

                // 根据字段类型设置更新数据
                switch (fieldType) {
                    case 'start_date':
                    case 'due_date':
                        updateData.issue[fieldType] = newValue || null;
                        break;
                    case 'assigned_to':
                        updateData.issue.assigned_to_id = newValue || null;
                        break;
                    case 'status':
                        updateData.issue.status_id = newValue;
                        break;
                }

                // 发送更新请求
                const success = await this.updateTaskField(taskId, updateData);

                if (success) {
                    // 保存成功
                    $cell.removeClass('task-saving').addClass('task-save-success');
                    const displayValue = this.formatFieldForDisplay(fieldType, newValue);
                    console.log(`格式化显示值 - 字段类型: ${fieldType}, 新值: ${newValue}, 显示值: ${displayValue}`);
                    $cell.html(`${displayValue}<span class="task-edit-icon">✏️</span>`);

                    console.log(`✅ 任务 ${taskId} 的${fieldLabel}更新成功: ${newValue}`);

                    // 2秒后移除成功样式
                    setTimeout(() => {
                        $cell.removeClass('task-save-success');
                    }, 2000);

                } else {
                    // 保存失败
                    $cell.removeClass('task-saving').addClass('task-save-error');
                    $cell.html(originalContent);

                    console.error(`❌ 任务 ${taskId} 的${fieldLabel}更新失败`);

                    // 显示错误提示
                    this.showTaskEditError(`${fieldLabel}更新失败，请重试`);

                    // 3秒后移除错误样式
                    setTimeout(() => {
                        $cell.removeClass('task-save-error');
                    }, 3000);
                }

            } catch (error) {
                console.error(`任务 ${taskId} 的${fieldLabel}更新异常:`, error);

                // 恢复原始内容
                $cell.removeClass('task-saving').addClass('task-save-error');
                $cell.html(originalContent);

                this.showTaskEditError(`${fieldLabel}更新异常: ${error.message}`);

                setTimeout(() => {
                    $cell.removeClass('task-save-error');
                }, 3000);
            }
        }

        /**
         * 格式化字段显示值
         */
        formatFieldForDisplay(fieldType, value) {
            switch (fieldType) {
                case 'start_date':
                case 'due_date':
                    return value ? this.formatDateForDisplay(value) : '-';
                case 'assigned_to':
                    if (!value) return '-';
                    if (value === this.currentUserId) return '我自己';
                    const member = this.projectMembers.find(m => m.id === value);
                    return member ? member.name : `用户${value}`;
                case 'status':
                    if (!value) return '-';
                    // 确保状态选项已加载
                    if (!this.statusOptions || this.statusOptions.length === 0) {
                        console.warn('状态选项未加载，使用默认显示');
                        return `状态${value}`;
                    }
                    // 将value转换为字符串进行比较，因为API可能返回数字或字符串
                    const status = this.statusOptions.find(s => String(s.id) === String(value));
                    if (status) {
                        console.log(`状态ID ${value} 对应状态名称: ${status.name}`);
                        return status.name;
                    } else {
                        console.warn(`未找到状态ID ${value} 对应的状态名称，可用状态:`, this.statusOptions);
                        return `状态${value}`;
                    }
                default:
                    return value || '-';
            }
        }

        /**
         * 更新任务字段
         */
        async updateTaskField(taskId, updateData) {
            try {
                // 构建API URL
                const apiUrl = `${window.location.origin}/issues/${taskId}.json`;

                // 获取认证头信息
                const headers = this.getAuthHeaders({ isFormData: false, isJsonApi: true });
                headers['Content-Type'] = 'application/json';

                console.log('更新任务字段 API URL:', apiUrl);
                console.log('更新数据:', updateData);

                // 发送PATCH请求
                const response = await fetch(apiUrl, {
                    method: 'PATCH',
                    headers: headers,
                    credentials: 'same-origin',
                    body: JSON.stringify(updateData)
                });

                if (response.ok) {
                    console.log('✓ 任务字段更新成功');
                    return true;
                } else {
                    console.error('✗ 任务字段更新失败:', response.status, response.statusText);
                    const responseText = await response.text();
                    console.error('响应内容:', responseText);
                    return false;
                }

            } catch (error) {
                console.error('更新任务字段时发生异常:', error);
                return false;
            }
        }

        /**
         * 解析日期字符串为 YYYY-MM-DD 格式
         */
        parseDateString(dateStr) {
            if (!dateStr || dateStr === '-' || dateStr === '') {
                return '';
            }

            // 尝试多种日期格式
            const formats = [
                /^(\d{4})-(\d{1,2})-(\d{1,2})$/,     // YYYY-MM-DD
                /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,   // MM/DD/YYYY
                /^(\d{1,2})-(\d{1,2})-(\d{4})$/,    // MM-DD-YYYY
                /^(\d{4})\/(\d{1,2})\/(\d{1,2})$/,  // YYYY/MM/DD
            ];

            for (const format of formats) {
                const match = dateStr.match(format);
                if (match) {
                    let year, month, day;

                    if (format === formats[0] || format === formats[3]) {
                        // YYYY-MM-DD 或 YYYY/MM/DD
                        [, year, month, day] = match;
                    } else {
                        // MM/DD/YYYY 或 MM-DD-YYYY
                        [, month, day, year] = match;
                    }

                    // 确保月份和日期是两位数
                    month = month.padStart(2, '0');
                    day = day.padStart(2, '0');

                    return `${year}-${month}-${day}`;
                }
            }

            // 尝试使用 Date 对象解析
            try {
                const date = new Date(dateStr);
                if (!isNaN(date.getTime())) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    return `${year}-${month}-${day}`;
                }
            } catch (e) {
                console.warn('无法解析日期字符串:', dateStr);
            }

            return '';
        }

        /**
         * 格式化日期用于显示
         */
        formatDateForDisplay(dateStr) {
            if (!dateStr) {
                return '-';
            }

            try {
                const date = new Date(dateStr);
                if (isNaN(date.getTime())) {
                    return dateStr;
                }

                // 返回 YYYY-MM-DD 格式
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            } catch (e) {
                return dateStr;
            }
        }

        /**
         * 显示任务编辑错误提示
         */
        showTaskEditError(message) {
            // 创建错误提示
            const $errorMsg = $(`
                <div class="task-edit-error-msg" style="
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #f8d7da;
                    color: #721c24;
                    padding: 10px 15px;
                    border: 1px solid #f5c6cb;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    z-index: 10000;
                    max-width: 300px;
                    font-size: 14px;
                ">
                    <strong>任务编辑错误:</strong><br>
                    ${message}
                </div>
            `);

            $('body').append($errorMsg);

            // 3秒后自动移除
            setTimeout(() => {
                $errorMsg.fadeOut(300, () => {
                    $errorMsg.remove();
                });
            }, 3000);
        }

        /**
         * 监听新添加的行，为新的可编辑单元格添加编辑功能
         */
        observeNewRowsForTaskEditor() {
            // 如果已经存在行观察器，先断开
            if (this.taskEditorRowObserver) {
                this.taskEditorRowObserver.disconnect();
            }

            // 创建新的观察器
            this.taskEditorRowObserver = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === Node.ELEMENT_NODE) {
                                // 检查是否是任务行
                                if (node.classList?.contains('issue')) {
                                    const $row = $(node);
                                    $row.find('td.start_date, td.due_date, td.assigned_to, td.status').each((index, cell) => {
                                        this.addEditorToCell($(cell));
                                    });
                                }

                                // 检查是否包含任务行
                                const $newRows = $(node).find('tr.issue');
                                $newRows.each((index, row) => {
                                    const $row = $(row);
                                    $row.find('td.start_date, td.due_date, td.assigned_to, td.status').each((index, cell) => {
                                        this.addEditorToCell($(cell));
                                    });
                                });
                            }
                        });
                    }
                });
            });

            // 开始观察
            const targetNode = document.querySelector('#issue_tree') || document.body;
            this.taskEditorRowObserver.observe(targetNode, {
                childList: true,
                subtree: true
            });

            console.log('任务编辑器行观察器已启动');
        }

        /**
         * 从任务行中提取任务ID
         */
        extractTaskIdFromRow($row) {
            // 尝试多种方式获取任务ID
            let taskId = $row.attr('data-task-id');

            if (!taskId) {
                // 从ID属性中提取
                const rowId = $row.attr('id');
                if (rowId) {
                    const match = rowId.match(/issue-(\d+)/);
                    if (match) {
                        taskId = match[1];
                    }
                }
            }

            if (!taskId) {
                // 从任务链接中提取
                const $taskLink = $row.find('td.subject a');
                if ($taskLink.length > 0) {
                    const href = $taskLink.attr('href');
                    if (href) {
                        const match = href.match(/\/issues\/(\d+)/);
                        if (match) {
                            taskId = match[1];
                        }
                    }
                }
            }

            return taskId;
        }

    }

    // 网站增强器管理
    const enhancers = [
        new RedmineEnhancer(),
        // 未来可以添加更多网站的增强器
    ];

    // 初始化匹配的增强器
    let activeEnhancer = null;
    enhancers.forEach(async enhancer => {
        try {
            await enhancer.init();
            if (enhancer.isEnabled) {
                activeEnhancer = enhancer;
            }
        } catch (error) {
            console.error(`${enhancer.siteName} 增强器初始化失败:`, error);
        }
    });

    // 导出到全局作用域供调试使用
    window.SiteEnhancer = {
        activeEnhancer,
        testAuth: () => activeEnhancer?.testAuthentication(),
        showApiConfig: () => activeEnhancer?.showApiKeyConfig(),
        debugCSRF: () => activeEnhancer?.debugCSRFTokenSources(),
        getCSRFToken: () => activeEnhancer?.getCSRFToken(),
        getAuthHeaders: () => activeEnhancer?.getAuthHeaders()
    };

    // 导出复选框状态管理工具
    window.SiteEnhancer = {
        ...window.SiteEnhancer,

        // 复选框状态管理
        saveCheckboxStates: () => {
            if (activeEnhancer?.saveCheckboxStates) {
                activeEnhancer.saveCheckboxStates();
            } else {
                console.log('没有活跃的增强器');
            }
        },
        restoreCheckboxStates: () => {
            if (activeEnhancer?.restoreCheckboxStates) {
                activeEnhancer.restoreCheckboxStates();
            } else {
                console.log('没有活跃的增强器');
            }
        },
        clearCheckboxStates: () => {
            if (activeEnhancer?.checkboxStates) {
                activeEnhancer.checkboxStates.clear();
                console.log('已清除保存的复选框状态');
            } else {
                console.log('没有活跃的增强器');
            }
        },
        showCheckboxStates: () => {
            if (activeEnhancer?.checkboxStates) {
                const checkedIds = [];
                activeEnhancer.checkboxStates.forEach((isChecked, taskId) => {
                    if (isChecked) checkedIds.push(taskId);
                });
                console.log('当前保存的复选框状态:', checkedIds);
                return checkedIds;
            } else {
                console.log('没有活跃的增强器');
                return [];
            }
        },
        debugAuth: (requestType = '测试') => {
            if (activeEnhancer?.debugAuthInfo) {
                const formData = new FormData();
                formData.append('test', 'value');
                activeEnhancer.debugAuthInfo(requestType, formData);
            } else {
                console.log('没有活跃的增强器');
            }
        },
        debugEvents: () => {
            console.log('=== 事件监听器调试信息 ===');

            // 检查按钮是否存在
            const $updateBtn = $("#batch-update-status-btn");
            const $completeBtn = $("#batch-complete-btn");
            const $statusSelect = $("#batch-status-select");

            console.log('批量更新按钮存在:', $updateBtn.length > 0);
            console.log('批量完成按钮存在:', $completeBtn.length > 0);
            console.log('状态选择框存在:', $statusSelect.length > 0);

            // 检查事件监听器
            if ($updateBtn.length > 0) {
                const events = $._data($updateBtn[0], 'events');
                console.log('批量更新按钮的事件:', events);
            }

            console.log('========================');
        }
    };

    console.log('调试工具已加载到 window.SiteEnhancer');
    console.log('可用命令:');
    console.log('  SiteEnhancer.testAuth() - 测试认证');
    console.log('  SiteEnhancer.showApiConfig() - 显示 API 配置');
    console.log('  SiteEnhancer.debugCSRF() - 调试 CSRF Token');
    console.log('  SiteEnhancer.getCSRFToken() - 获取 CSRF Token');
    console.log('  SiteEnhancer.getAuthHeaders() - 获取认证头');
    console.log('  SiteEnhancer.saveCheckboxStates() - 保存复选框状态');
    console.log('  SiteEnhancer.restoreCheckboxStates() - 恢复复选框状态');
    console.log('  SiteEnhancer.clearCheckboxStates() - 清除复选框状态');
    console.log('  SiteEnhancer.showCheckboxStates() - 显示复选框状态');
    console.log('  SiteEnhancer.debugAuth() - 调试认证信息');
    console.log('  SiteEnhancer.debugEvents() - 调试事件监听器');
})();

