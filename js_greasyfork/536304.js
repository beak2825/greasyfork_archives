// ==UserScript==
// @name         nHentai 标签翻译与功能增强
// @namespace    http://tampermonkey.net/
// @version      2025530.1.01.03
// @description  🌟添加标签翻译和悬浮框释义🌟点击计数器复制标签词条🌟正确标签转跳功能
// @license      CC-BY-NC-SA-4.0
// @author       ZhaoYang
// @match        https://nhentai.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhentai.net
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/536304/nHentai%20%E6%A0%87%E7%AD%BE%E7%BF%BB%E8%AF%91%E4%B8%8E%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/536304/nHentai%20%E6%A0%87%E7%AD%BE%E7%BF%BB%E8%AF%91%E4%B8%8E%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 优化：缓存移动设备检测正则
    const MOBILE_REGEX = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;

    //===========================================
    // 配置和常量
    //===========================================

    // 配置对象 - 初始设置
    const CONFIG = {
        // 用户可配置设置
        USER_SETTINGS: {
            ENABLED: true,                    // 启用脚本
            MAX_ACTIVE_TOOLTIPS: 35,          // 总提示框上限
            MAX_ABBR_TOOLTIPS: 30,             // 提示框内说明提示框
            SEARCH_TERM: 'chinese',           // 搜索关键词
            REDIRECT_TO_ORIGINAL: false,      // 重定向到原始标签页
            COPY_MODE: 'both',                // 复制模式: original, translation, both
            CLICK_COUNTER_TO_COPY: GM_getValue('click_counter_to_copy', !isMobileDevice()), // 点击计数器复制(PC默认开启，移动设备默认关闭)
            DISPLAY_MODE: 'both',             // 显示模式: original, translation, both
        },

        // 脚本状态
        STATUS: {
            WORKER_ACTIVE: false,
            WORKER_FALLBACK: false,
            DATA_LOADED: false
        },

        // 容量配置
        MAX_ACTIVE_TOOLTIPS: 35, // 最大活动提示数量
        MAX_ABBR_TOOLTIPS: 30, // 最大abbr提示数量

        // 性能配置
        POSITION_THRESHOLD: 2, // 位置更新阈值(px)
        UPDATE_INTERVAL: 16, // 更新间隔(ms)，约60fps

        // 池配置
        POOL_SIZE: {
            MOBILE: {
                MAX: 8,
                OPTIMAL: 4
            },
            DESKTOP: {
                MAX: 5,
                OPTIMAL: 2
            }
        },

        // 视觉配置
        BASE_Z_INDEX: 9999, // 基准z-index值

        // 动画配置
        ANIMATION_DURATION: 200, // 动画持续时间(ms)
    };

    // 初始化时同步全局配置和用户设置
    CONFIG.MAX_ACTIVE_TOOLTIPS = CONFIG.USER_SETTINGS.MAX_ACTIVE_TOOLTIPS;
    CONFIG.MAX_ABBR_TOOLTIPS = CONFIG.USER_SETTINGS.MAX_ABBR_TOOLTIPS;

    /**
     * 配置管理器 - 统一管理所有配置访问
     */
    class ConfigManager {
        /**
         * 获取配置
         * @param {string} key - 配置键名
         * @param {*} defaultValue - 默认值
         * @returns {*} 配置值
         */
        static getConfig(key, defaultValue = null) {
            // 先检查特殊的动态配置
            if (key === 'MAX_ACTIVE_TOOLTIPS') {
                return SettingsManager.getSetting(key, CONFIG.MAX_ACTIVE_TOOLTIPS);
            } else if (key === 'MAX_ABBR_TOOLTIPS') {
                return SettingsManager.getSetting(key, CONFIG.MAX_ABBR_TOOLTIPS);
            } else if (key === 'BASE_Z_INDEX') {
                return CONFIG.BASE_Z_INDEX;
            }

            // 检查一般配置
            if (key in CONFIG) {
                return CONFIG[key];
            }
            return defaultValue;
        }
    }

    /**
     * 设置管理器 - 管理用户设置
     */
    class SettingsManager {
        /**
         * 获取用户设置
         * @param {string} key - 设置键名
         * @param {*} defaultValue - 默认值
         * @returns {*} 设置值
         */
        static getSetting(key, defaultValue = null) {
            if (key in CONFIG.USER_SETTINGS) {
                return CONFIG.USER_SETTINGS[key];
            }
            return defaultValue;
        }

        /**
         * 设置用户设置
         * @param {string} key - 设置键名
         * @param {*} value - 设置值
         * @param {boolean} saveToStorage - 是否保存到存储
         * @returns {boolean} 是否成功设置
         */
        static setSetting(key, value, saveToStorage = true) {
            if (key in CONFIG.USER_SETTINGS) {
                // 类型安全转换
                if (typeof CONFIG.USER_SETTINGS[key] === 'boolean' && typeof value !== 'boolean') {
                    if (typeof value === 'string') {
                        value = value.toLowerCase() === 'true';
                    } else {
                        value = Boolean(value);
                    }
                } else if (typeof CONFIG.USER_SETTINGS[key] === 'number' && typeof value !== 'number') {
                    value = Number(value) || 0;
                }

                CONFIG.USER_SETTINGS[key] = value;

                // 同步到特定全局配置
                if (key === 'MAX_ACTIVE_TOOLTIPS') {
                    CONFIG.MAX_ACTIVE_TOOLTIPS = value;
                } else if (key === 'MAX_ABBR_TOOLTIPS') {
                    CONFIG.MAX_ABBR_TOOLTIPS = value;
                }

                // 保存到GM存储
                if (saveToStorage) {
                    const storageKey = key.toLowerCase();
                    GM_setValue(storageKey, value);
                }

                return true;
            }
            return false;
        }

        /**
         * 加载所有用户设置
         */
        static loadAllSettings() {
            // 从 GM_getValue 加载设置，如果不存在则使用默认值
            for (const key in CONFIG.USER_SETTINGS) {
                if (Object.prototype.hasOwnProperty.call(CONFIG.USER_SETTINGS, key)) {
                    const storageKey = key.toLowerCase();
                    const savedValue = GM_getValue(storageKey, null);
                    if (savedValue !== null) {
                        // 添加类型转换
                        const defaultValue = CONFIG.USER_SETTINGS[key];
                        if (typeof defaultValue === 'number' && typeof savedValue === 'string') {
                            // 将字符串转为数字
                            CONFIG.USER_SETTINGS[key] = Number(savedValue);
                        } else if (typeof defaultValue === 'boolean' && typeof savedValue === 'string') {
                            // 将字符串转为布尔值
                            CONFIG.USER_SETTINGS[key] = savedValue.toLowerCase() === 'true';
                        } else {
                            CONFIG.USER_SETTINGS[key] = savedValue;
                        }
                    }
                }
            }

            // 同步到特定全局配置
            CONFIG.MAX_ACTIVE_TOOLTIPS = CONFIG.USER_SETTINGS.MAX_ACTIVE_TOOLTIPS;
            CONFIG.MAX_ABBR_TOOLTIPS = CONFIG.USER_SETTINGS.MAX_ABBR_TOOLTIPS;
        }
    }

    /**
     * 状态管理器 - 管理运行时状态
     */
    class StatusManager {
        /**
         * 获取状态
         * @param {string} key - 状态键名
         * @returns {*} 状态值
         */
        static getStatus(key) {
            return CONFIG.STATUS[key];
        }

        /**
         * 设置状态
         * @param {string} key - 状态键名
         * @param {*} value - 状态值
         * @returns {boolean} 是否成功设置
         */
        static setStatus(key, value) {
            if (key in CONFIG.STATUS) {
                CONFIG.STATUS[key] = value;
                return true;
            }
            return false;
        }
    }

    // 预编译正则表达式
    const REGEX = {
        HREF: /https?:\/\/nhentai\.net\/([^/]+)\/([^/]+)/,
        NORMALIZE_TAG: /[\s\-_]+/g,
        SYMBOLS_ONLY: /^<p>\s*[\(\)\*\[\]\{\}\.\,\;\:\-\_\+\=\!\?\#\%\&\$]+\s*<\/p>$/i,
        IMG_SRC: /src=["']([^"']+)["']/,
        TAG_SELECTOR: '.tag, .tags > a, [data-original-tag]'
    };

    // 基本变量和常量定义
    let tagMap = null;
    let scrollTimeout = null;
    let observer = null;
    let abbrObserver = null;
    let isScrolling = false;
    let lastSearchQuery = '';

    // 缓存常用DOM元素
    const domCache = {
        tagsContainer: null,
        searchContent: null,
        settingsModal: null
    };

    // 添加移动设备检测函数
    function isMobileDevice() {
        return MOBILE_REGEX.test(navigator.userAgent);
    }

    /**
     * 设置UI管理器 - 处理用户设置界面
     */
    class SettingsUI {
        constructor() {
            this.settingsOpen = false;
            this.settingsContainer = null;
            this.reloadTagDataCallback = null;
        }

        /**
         * 创建设置按钮
         * @param {Function} reloadTagDataCallback - 重新加载标签数据的回调函数
         */
        createSettingsButton(reloadTagDataCallback) {
            const rightNav = document.querySelector('nav .menu.right');
            if (!rightNav) return;

            // 检查是否已存在按钮
            if (rightNav.querySelector('.settings-btn')) return;

            // 创建设置按钮
            const settingsButton = document.createElement('li');
            settingsButton.className = 'settings-btn';

            // 使用createElement替代innerHTML
            const settingsLink = document.createElement('a');
            settingsLink.textContent = '设置';
            settingsButton.appendChild(settingsLink);

            // 这里使用bind绑定this上下文
            settingsButton.addEventListener('click', this.showSettings.bind(this));

            // 将重新加载回调保存到实例
            this.reloadTagDataCallback = reloadTagDataCallback;

            // 添加到导航栏
            rightNav.prepend(settingsButton);
        }

        /**
         * 显示设置对话框
         */
        showSettings() {
            if (this.settingsOpen) return;

            // 创建模态对话框
            const modal = document.createElement('div');
            modal.className = 'nh-settings-modal';

            // 创建模态内容
            const modalContent = document.createElement('div');
            modalContent.className = 'nh-settings-content';

            // 标题
            const title = document.createElement('h3');
            title.textContent = 'nHentai 标签翻译优化设置';
            modalContent.appendChild(title);

            // 设置表单
            const form = document.createElement('div');
            form.className = 'nh-settings-form';

            // 搜索词设置
            const searchTermGroup = document.createElement('div');
            searchTermGroup.className = 'settings-group';

            const searchTermLabel = document.createElement('label');
            searchTermLabel.textContent = '搜索页常驻搜索词：';

            const searchTermInput = document.createElement('input');
            searchTermInput.type = 'text';
            searchTermInput.id = 'nh-search-term';
            searchTermInput.value = SettingsManager.getSetting('SEARCH_TERM', 'chinese');

            const searchTermDesc = document.createElement('div');
            searchTermDesc.className = 'setting-description';
            searchTermDesc.textContent = '设置点击标签时添加的搜索词，默认为"chinese"';

            searchTermGroup.appendChild(searchTermLabel);
            searchTermGroup.appendChild(searchTermInput);
            searchTermGroup.appendChild(searchTermDesc);
            form.appendChild(searchTermGroup);

            // 转跳设置
            const redirectGroup = document.createElement('div');
            redirectGroup.className = 'settings-group';

            const redirectLabel = document.createElement('label');
            redirectLabel.textContent = '标签点击转跳到：';

            const redirectSelect = document.createElement('select');
            redirectSelect.id = 'nh-redirect-option';

            const option1 = document.createElement('option');
            option1.value = 'search';
            option1.textContent = '搜索页';
            option1.selected = !SettingsManager.getSetting('REDIRECT_TO_ORIGINAL', false);

            const option2 = document.createElement('option');
            option2.value = 'original';
            option2.textContent = '原始标签页';
            option2.selected = SettingsManager.getSetting('REDIRECT_TO_ORIGINAL', false);

            redirectSelect.appendChild(option1);
            redirectSelect.appendChild(option2);

            const redirectDesc = document.createElement('div');
            redirectDesc.className = 'setting-description';
            redirectDesc.textContent = '设置点击标签时跳转的目标页面';

            redirectGroup.appendChild(redirectLabel);
            redirectGroup.appendChild(redirectSelect);
            redirectGroup.appendChild(redirectDesc);
            form.appendChild(redirectGroup);

            // 复制模式设置
            const copyModeGroup = document.createElement('div');
            copyModeGroup.className = 'settings-group';

            const copyModeLabel = document.createElement('label');
            copyModeLabel.textContent = '标签复制内容：';

            const copyModeSelect = document.createElement('select');
            copyModeSelect.id = 'nh-copy-mode';

            const copyOption1 = document.createElement('option');
            copyOption1.value = 'original';
            copyOption1.textContent = '原文';
            copyOption1.selected = SettingsManager.getSetting('COPY_MODE', 'original') === 'original';

            const copyOption2 = document.createElement('option');
            copyOption2.value = 'translation';
            copyOption2.textContent = '译文';
            copyOption2.selected = SettingsManager.getSetting('COPY_MODE', 'original') === 'translation';

            const copyOption3 = document.createElement('option');
            copyOption3.value = 'both';
            copyOption3.textContent = '原文+译文';
            copyOption3.selected = SettingsManager.getSetting('COPY_MODE', 'original') === 'both';

            copyModeSelect.appendChild(copyOption1);
            copyModeSelect.appendChild(copyOption2);
            copyModeSelect.appendChild(copyOption3);

            const copyModeDesc = document.createElement('div');
            copyModeDesc.className = 'setting-description';
            copyModeDesc.textContent = '设置复制标签时的文本内容格式';

            copyModeGroup.appendChild(copyModeLabel);
            copyModeGroup.appendChild(copyModeSelect);
            copyModeGroup.appendChild(copyModeDesc);
            form.appendChild(copyModeGroup);

            // 显示模式设置
            const displayModeGroup = document.createElement('div');
            displayModeGroup.className = 'settings-group';

            const displayModeLabel = document.createElement('label');
            displayModeLabel.textContent = '标签显示内容：';

            const displayModeSelect = document.createElement('select');
            displayModeSelect.id = 'nh-display-mode';

            const displayOption1 = document.createElement('option');
            displayOption1.value = 'original';
            displayOption1.textContent = '原文';
            displayOption1.selected = SettingsManager.getSetting('DISPLAY_MODE', 'original') === 'original';

            const displayOption2 = document.createElement('option');
            displayOption2.value = 'translation';
            displayOption2.textContent = '译文';
            displayOption2.selected = SettingsManager.getSetting('DISPLAY_MODE', 'original') === 'translation';

            const displayOption3 = document.createElement('option');
            displayOption3.value = 'both';
            displayOption3.textContent = '原文+译文';
            displayOption3.selected = SettingsManager.getSetting('DISPLAY_MODE', 'original') === 'both';

            displayModeSelect.appendChild(displayOption1);
            displayModeSelect.appendChild(displayOption2);
            displayModeSelect.appendChild(displayOption3);

            const displayModeDesc = document.createElement('div');
            displayModeDesc.className = 'setting-description';
            displayModeDesc.textContent = '设置标签显示的文本内容格式';

            displayModeGroup.appendChild(displayModeLabel);
            displayModeGroup.appendChild(displayModeSelect);
            displayModeGroup.appendChild(displayModeDesc);
            form.appendChild(displayModeGroup);

            // 计数器点击复制设置
            const counterClickGroup = document.createElement('div');
            counterClickGroup.className = 'settings-group';

            const counterClickWrapper = document.createElement('div');
            counterClickWrapper.className = 'checkbox-wrapper';

            const counterClickCheckbox = document.createElement('input');
            counterClickCheckbox.type = 'checkbox';
            counterClickCheckbox.id = 'nh-counter-click';
            counterClickCheckbox.checked = SettingsManager.getSetting('CLICK_COUNTER_TO_COPY', false);

            const counterClickText = document.createElement('span');
            counterClickText.textContent = '点击计数器复制标签';

            counterClickWrapper.appendChild(counterClickCheckbox);
            counterClickWrapper.appendChild(counterClickText);

            const counterClickDesc = document.createElement('div');
            counterClickDesc.className = 'setting-description';
            counterClickDesc.textContent = '启用后，点击标签计数器将自动复制标签文本（移动设备默认禁用）';

            counterClickGroup.appendChild(counterClickWrapper);
            counterClickGroup.appendChild(counterClickDesc);
            form.appendChild(counterClickGroup);

            // 最大活动提示数量设置
            const maxTooltipsGroup = document.createElement('div');
            maxTooltipsGroup.className = 'settings-group';

            const maxTooltipsLabel = document.createElement('label');
            maxTooltipsLabel.textContent = '提示框总上限：';

            const maxTooltipsInput = document.createElement('input');
            maxTooltipsInput.type = 'number';
            maxTooltipsInput.id = 'nh-max-tooltips';
            maxTooltipsInput.min = '1';
            maxTooltipsInput.max = '100';
            maxTooltipsInput.value = SettingsManager.getSetting('MAX_ACTIVE_TOOLTIPS', 35);

            const maxTooltipsDesc = document.createElement('div');
            maxTooltipsDesc.className = 'setting-description';
            maxTooltipsDesc.textContent = '设置标签提示框数量总上限 (1-100)，重复标签提示框只计算一次';

            maxTooltipsGroup.appendChild(maxTooltipsLabel);
            maxTooltipsGroup.appendChild(maxTooltipsInput);
            maxTooltipsGroup.appendChild(maxTooltipsDesc);
            form.appendChild(maxTooltipsGroup);

            // 最大abbr提示数量设置
            const maxAbbrGroup = document.createElement('div');
            maxAbbrGroup.className = 'settings-group';

            const maxAbbrLabel = document.createElement('label');
            maxAbbrLabel.textContent = '提示框递归上限：';

            const maxAbbrInput = document.createElement('input');
            maxAbbrInput.type = 'number';
            maxAbbrInput.id = 'nh-max-abbr';
            maxAbbrInput.min = '1';
            maxAbbrInput.max = '50';
            maxAbbrInput.value = SettingsManager.getSetting('MAX_ABBR_TOOLTIPS', 30);

            const maxAbbrDesc = document.createElement('div');
            maxAbbrDesc.className = 'setting-description';
            maxAbbrDesc.textContent = '设置点击提示框内的标签而打开的提示框上限(1-50)，重复标签提示框只计算一次';

            maxAbbrGroup.appendChild(maxAbbrLabel);
            maxAbbrGroup.appendChild(maxAbbrInput);
            maxAbbrGroup.appendChild(maxAbbrDesc);
            form.appendChild(maxAbbrGroup);

            // 状态显示区域
            const statusGroup = document.createElement('div');
            statusGroup.className = 'settings-group status-group';

            const statusTitle = document.createElement('h4');
            statusTitle.textContent = '脚本运行状态';

            const statusList = document.createElement('ul');
            statusList.className = 'status-list';

            // Web Worker状态
            const workerStatus = document.createElement('li');
            if (StatusManager.getStatus('WORKER_ACTIVE')) {
                // 创建元素替代innerHTML
                const statusIcon = document.createElement('span');
                statusIcon.textContent = '✅ ';
                const statusText = document.createTextNode('Web Worker 工作正常');
                workerStatus.appendChild(statusIcon);
                workerStatus.appendChild(statusText);
                workerStatus.className = 'status-ok';
            } else if (StatusManager.getStatus('WORKER_FALLBACK')) {
                // 创建元素替代innerHTML
                const statusIcon = document.createElement('span');
                statusIcon.textContent = '⚠️ ';
                const statusText = document.createTextNode('Web Worker 回退到主线程');
                workerStatus.appendChild(statusIcon);
                workerStatus.appendChild(statusText);
                workerStatus.className = 'status-warning';
            } else {
                // 创建元素替代innerHTML
                const statusIcon = document.createElement('span');
                statusIcon.textContent = '❓ ';
                const statusText = document.createTextNode('Web Worker 尚未初始化');
                workerStatus.appendChild(statusIcon);
                workerStatus.appendChild(statusText);
                workerStatus.className = 'status-neutral';
            }

            // 数据加载状态
            const dataStatus = document.createElement('li');
            if (StatusManager.getStatus('DATA_LOADED')) {
                // 创建元素替代innerHTML
                const statusIcon = document.createElement('span');
                statusIcon.textContent = '✅ ';
                const statusText = document.createTextNode(`标签数据已加载 (${tagMap ? tagMap.size : 0} 项)`);
                dataStatus.appendChild(statusIcon);
                dataStatus.appendChild(statusText);
                dataStatus.className = 'status-ok';
            } else {
                // 创建元素替代innerHTML
                const statusIcon = document.createElement('span');
                statusIcon.textContent = '❌ ';
                const statusText = document.createTextNode('标签数据尚未加载');
                dataStatus.appendChild(statusIcon);
                dataStatus.appendChild(statusText);
                dataStatus.className = 'status-error';
            }

            statusList.appendChild(workerStatus);
            statusList.appendChild(dataStatus);
            statusGroup.appendChild(statusTitle);
            statusGroup.appendChild(statusList);
            form.appendChild(statusGroup);

            // 重新加载标签数据按钮（移动到设置菜单中）
            const reloadGroup = document.createElement('div');
            reloadGroup.className = 'settings-group action-group';

            const reloadButton = document.createElement('button');
            reloadButton.className = 'nh-button reload-button';
            reloadButton.textContent = '重新获取标签数据';
            reloadButton.addEventListener('click', () => {
                this.closeSettings();
                if (this.reloadTagDataCallback) {
                    this.reloadTagDataCallback();
                }
            });

            reloadGroup.appendChild(reloadButton);
            form.appendChild(reloadGroup);

            // 按钮组
            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'settings-button-group';

            const saveButton = document.createElement('button');
            saveButton.className = 'nh-button save-button';
            saveButton.textContent = '保存设置';
            // 修复: 绑定this上下文到事件处理函数
            saveButton.addEventListener('click', this.saveSettings.bind(this));

            const cancelButton = document.createElement('button');
            cancelButton.className = 'nh-button cancel-button';
            cancelButton.textContent = '取消';
            // 修复: 绑定this上下文到事件处理函数
            cancelButton.addEventListener('click', this.closeSettings.bind(this));

            buttonGroup.appendChild(saveButton);
            buttonGroup.appendChild(cancelButton);
            form.appendChild(buttonGroup);

            modalContent.appendChild(form);
            modal.appendChild(modalContent);

            // 添加到DOM
            document.body.appendChild(modal);
            this.settingsContainer = modal;
            domCache.settingsModal = modal;

            // 添加关闭事件（点击模态框外部关闭）
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeSettings();
                }
            });

            // 标记为打开状态
            this.settingsOpen = true;

            // 确保模态框可见
            setTimeout(() => {
                modal.classList.add('visible');
            }, 10);
        }

        /**
         * 关闭设置对话框
         */
        closeSettings() {
            if (!this.settingsOpen || !this.settingsContainer) return;

            // 移除模态效果
            this.settingsContainer.classList.remove('visible');

            // 延迟移除DOM内容，让动画有时间完成
            const ANIMATION_DURATION = ConfigManager.getConfig('ANIMATION_DURATION', 200);
            setTimeout(() => {
                if (this.settingsContainer && this.settingsContainer.parentNode) {
                    this.settingsContainer.parentNode.removeChild(this.settingsContainer);
                }
                this.settingsContainer = null;
                domCache.settingsModal = null;
                this.settingsOpen = false;
            }, ANIMATION_DURATION);
        }

        /**
         * 保存设置
         */
        saveSettings() {
            try {
                // 获取输入值
                const searchTerm = document.getElementById('nh-search-term').value.trim() || 'chinese';
                const redirectOption = document.getElementById('nh-redirect-option').value;
                const copyMode = document.getElementById('nh-copy-mode').value;
                const displayMode = document.getElementById('nh-display-mode').value;
                const maxTooltips = parseInt(document.getElementById('nh-max-tooltips').value) || 35;
                const maxAbbr = parseInt(document.getElementById('nh-max-abbr').value) || 30;
                const counterClickEnabled = document.getElementById('nh-counter-click').checked;

                // 验证输入
                if (maxTooltips < 1 || maxTooltips > 100) {
                    this.showNotification('最大提示数量必须在1-100之间');
                    return;
                }

                if (maxAbbr < 1 || maxAbbr > 50) {
                    this.showNotification('最大缩写提示数量必须在1-50之间');
                    return;
                }

                // 使用SettingsManager保存设置
                SettingsManager.setSetting('SEARCH_TERM', searchTerm);
                SettingsManager.setSetting('REDIRECT_TO_ORIGINAL', (redirectOption === 'original'));
                SettingsManager.setSetting('COPY_MODE', copyMode);
                SettingsManager.setSetting('DISPLAY_MODE', displayMode);
                SettingsManager.setSetting('MAX_ACTIVE_TOOLTIPS', maxTooltips);
                SettingsManager.setSetting('MAX_ABBR_TOOLTIPS', maxAbbr);
                SettingsManager.setSetting('CLICK_COUNTER_TO_COPY', counterClickEnabled);

                // 关闭设置并通知
                this.closeSettings();
                this.showNotification('设置已保存，正在刷新页面...');

                // 刷新页面以应用新设置
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            } catch (err) {
                console.error('保存设置失败:', err);
                this.showNotification('保存设置失败: ' + err.message);
            }
        }

        /**
         * 显示通知
         * @param {string} message - 通知消息
         */
        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'nh-notification';
            notification.textContent = message;

            document.body.appendChild(notification);

            // 触发动画
            setTimeout(() => {
                notification.classList.add('visible');
            }, 10);

            // 自动消失
            setTimeout(() => {
                notification.classList.remove('visible');
                const ANIMATION_DURATION = ConfigManager.getConfig('ANIMATION_DURATION', 200);
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, ANIMATION_DURATION);
            }, 2000);
        }
    }

    /**
     * 工具函数模块 - 集中管理所有通用工具函数
     */
    const Utils = {
        /**
         * 标准化标签名 - 支持特殊字符
         * @param {string} tagName 原始标签名
         * @returns {string} 标准化的标签名
         */
        normalizeTagName: (tagName) => {
            if (!tagName) return '';
            return tagName.replace(REGEX.NORMALIZE_TAG, ' ').trim().toLowerCase();
        },

        /**
         * 防抖函数
         * @param {Function} func - 要防抖的函数
         * @param {number} wait - 防抖等待时间
         * @returns {Function} 防抖后的函数
         */
        debounce: (func, wait) => {
            let timeout;
            return function(...args) {
                const context = this;
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(context, args), wait);
            };
        },

        /**
         * 节流函数 - 确保正确的this绑定
         * @param {Function} func - 要节流的函数
         * @param {number} limit - 节流限制时间
         * @returns {Function} 节流后的函数
         */
        throttle: function(func, limit) {
            let lastCall = 0;
            const self = this;
            return function(...args) {
                const now = Date.now();
                if (now - lastCall >= limit) {
                    lastCall = now;
                    return func.apply(self, args);
                }
            };
        },

        /**
         * 根据用户设置格式化复制内容
         * @param {string} originalText - 原文
         * @param {string} translatedText - 译文
         * @returns {string} 格式化后的文本
         */
        formatCopyText: (originalText, translatedText) => {
            // 清理可能的HTML内容
            const cleanHtml = (text) => {
                if (!text) return '';
                return text.replace(/<[^>]*>/g, '');
            };

            const cleanOriginal = cleanHtml(originalText);
            const cleanTranslated = cleanHtml(translatedText);

            // 根据用户设置决定复制内容
            const copyMode = SettingsManager.getSetting('COPY_MODE', 'original');
            switch(copyMode) {
                case 'translation':
                    return cleanTranslated || cleanOriginal;
                case 'both':
                    return cleanTranslated ? `${cleanTranslated} (${cleanOriginal})` : cleanOriginal;
                case 'original':
                default:
                    return cleanOriginal;
            }
        }
    };

    /**
     * 缓存管理器 - 用于统一管理所有类型的缓存
     */
    class CacheManager {
        constructor(options = {}) {
            this.maxSize = options.maxSize || 200;
            this.cleanupInterval = options.cleanupInterval || 300000; // 默认5分钟
            this.map = new Map();

            // 定期清理
            if (this.cleanupInterval > 0) {
                this.cleanupTimer = setInterval(() => this.cleanup(), this.cleanupInterval);
            }
        }

        /**
         * 获取缓存项
         * @param {string} key - 缓存键
         * @returns {*} 缓存值或undefined
         */
        get(key) {
            return this.map.get(key);
        }

        /**
         * 设置缓存项
         * @param {string} key - 缓存键
         * @param {*} value - 缓存值
         */
        set(key, value) {
            this.map.set(key, value);

            // 如果超出大小，触发清理
            if (this.map.size > this.maxSize) {
                this.cleanup();
            }
        }

        /**
         * 删除缓存项
         * @param {string} key - 缓存键
         * @returns {boolean} 是否删除成功
         */
        delete(key) {
            return this.map.delete(key);
        }

        /**
         * 清空缓存
         */
        clear() {
            this.map.clear();
        }

        /**
         * 获取缓存大小
         * @returns {number} 缓存项数量
         */
        get size() {
            return this.map.size;
        }

        /**
         * 清理缓存 - 只保留一半最新的项
         */
        cleanup() {
            if (this.map.size <= this.maxSize / 2) return;

            const entries = [...this.map.entries()];
            const halfSize = Math.floor(entries.length / 2);
            this.map = new Map(entries.slice(-halfSize));
        }

        /**
         * 清理资源
         */
        dispose() {
            if (this.cleanupTimer) {
                clearInterval(this.cleanupTimer);
                this.cleanupTimer = null;
            }
            this.map.clear();
        }
    }

    /**
     * 引用管理器 - 统一管理DOM元素引用关系
     */
    class ReferenceManager {
        constructor() {
            this.elementMap = new WeakMap();
        }

        /**
         * 设置元素引用数据
         * @param {HTMLElement} element - DOM元素
         * @param {Object} data - 相关数据
         */
        setElementData(element, data) {
            let existingData = this.elementMap.get(element) || {};
            this.elementMap.set(element, {
                ...existingData,
                ...data
            });
        }

        /**
         * 获取元素引用数据
         * @param {HTMLElement} element - DOM元素
         * @returns {Object|undefined} 元素数据
         */
        getElementData(element) {
            return this.elementMap.get(element);
        }
    }

    /**
     * @typedef {Object} TooltipData
     * @property {HTMLElement} div - 提示元素
     * @property {HTMLElement} element - 触发元素
     * @property {number} clientX - 当前X坐标
     * @property {number} clientY - 当前Y坐标
     * @property {boolean} isActive - 是否活动状态
     * @property {number} createdAt - 创建时间戳
     * @property {boolean} positionLocked - 位置是否锁定
     * @property {boolean} needRectUpdate - 是否需要更新rect
     * @property {string} content - 提示内容 (用于内容比较和复用)
     * @property {number} zIndex - z-index值
     */

    /**
     * 多层工具提示模块类
     */
    class Tooltip {
        constructor(referenceManager) {
            // 提示层管理
            this.tooltips = [];
            this.refManager = referenceManager;
            this.lastClientX = 0;
            this.lastClientY = 0;
            this.isUpdating = false;
            this.needPositionUpdate = false;
            this.intersectionObserver = null;
            this.currentZIndex = ConfigManager.getConfig('BASE_Z_INDEX', 9999);

            // 初始化对象池
            this.tooltipPool = [];

            // 对象池管理
            const poolConfig = ConfigManager.getConfig('POOL_SIZE', {
                MOBILE: { MAX: 8, OPTIMAL: 4 },
                DESKTOP: { MAX: 5, OPTIMAL: 2 }
            });
            this.maxPoolSize = poolConfig[isMobileDevice() ? 'MOBILE' : 'DESKTOP'].MAX;

            // will-change计时器管理
            this.willChangeTimers = new WeakMap();  // 存储 timer 信息
            this.activeTimerElements = new Set();

            // 绑定方法到实例
            this.updatePositions = this.updatePositions.bind(this);
            this.updateOnScroll = this.updateOnScroll.bind(this);
            // 使用修正后的throttle以保留正确的this绑定
            this.updateOnScrollThrottled = Utils.throttle.call(this, this.updateOnScroll, 100);
            this.updateOnResize = this.updateOnResize.bind(this);
            this.updateOnResizeThrottled = Utils.throttle.call(this, this.updateOnResize, 100);
            this.handleDocumentClick = this.handleDocumentClick.bind(this);

            // 初始化交叉观察器
            this.initIntersectionObserver();

            // 监听滚动事件
            window.addEventListener('scroll', this.updateOnScrollThrottled, {
                passive: true
            });

            // 监听窗口大小变化
            window.addEventListener('resize', this.updateOnResizeThrottled, {
                passive: true
            });

            // 使用事件委托监听点击事件关闭提示
            document.addEventListener('click', this.handleDocumentClick);
        }

        /**
         * 处理文档点击事件
         * @param {MouseEvent} e - 点击事件
         */
        handleDocumentClick(e) {
            // 如果点击的是abbr元素，不做任何操作
            if (e.target.tagName === 'ABBR') return;

            // 获取点击的目标元素
            const target = e.target;

            // 检查是否点击了链接（a标签）
            const clickedLink = target.tagName === 'A' || target.closest('a');

            // 使用composedPath获取事件路径，判断点击是否在提示内
            const path = e.composedPath();
            let isInTooltip = false;
            let clickedTooltip = null;

            for (const tooltip of this.tooltips) {
                if (path.includes(tooltip.div)) {
                    isInTooltip = true;
                    clickedTooltip = tooltip;
                    break;
                }
            }

            // 如果点击在提示框内
            if (isInTooltip) {
                // 如果点击的不是链接（即点击了空白区域），关闭最上层的提示
                if (!clickedLink) {
                    this.hideTop();
                }
                // 如果点击的是链接，让链接正常工作，不关闭提示框
            } else if (this.tooltips.length > 0) {
                // 点击在提示框外，关闭最上层的提示
                this.hideTop();
            }
        }

        /**
         * 处理窗口大小变化
         */
        updateOnResize() {
            if (this.getActiveTooltips().length === 0) return;

            // 重置所有活动提示的位置锁定，允许重新计算方向
            for (const tooltip of this.tooltips) {
                if (tooltip.isActive) {
                    tooltip.positionLocked = false;
                    tooltip.needRectUpdate = true;
                }
            }

            this.needPositionUpdate = true;

            // 立即更新位置
            this.updatePositions(true); // 强制更新
        }

        /**
         * 获取活动中的提示
         * @returns {TooltipData[]} 活动提示数组
         */
        getActiveTooltips() {
            return this.tooltips.filter(t => t.isActive);
        }

        /**
         * 根据Z-index排序的活动提示
         * @returns {TooltipData[]} 按Z-index排序的活动提示数组
         */
        getActiveTooltipsByZIndex() {
            return this.getActiveTooltips().sort((a, b) => a.zIndex - b.zIndex);
        }

        /**
         * 初始化交叉观察器
         */
        initIntersectionObserver() {
            this.intersectionObserver = new IntersectionObserver((entries) => {
                let needUpdate = false;

                entries.forEach(entry => {
                    const div = entry.target;
                    const tooltip = this.findTooltipByDiv(div);

                    if (!tooltip) return;

                    // 检查元素是否仍在文档中
                    if (!entry.isIntersecting && !document.contains(div)) {
                        // 从数组中移除引用
                        const index = this.tooltips.indexOf(tooltip);
                        if (index !== -1) this.tooltips.splice(index, 1);
                    } else if (entry.isIntersecting) {
                        // 标记为活动状态
                        tooltip.isActive = true;
                        needUpdate = true;
                    } else {
                        // 标记为非活动状态
                        tooltip.isActive = false;
                    }
                });

                // 如果有变化且正在更新，立即更新位置
                if (needUpdate && this.isUpdating) {
                    this.needPositionUpdate = true;
                }
            }, {
                root: null, // 相对于视口
                rootMargin: '100px', // 扩展监测区域，提前准备
                threshold: 0 // 任何可见度都触发
            });
        }

        /**
         * 查找提示框对象
         * @param {HTMLElement} div - 提示元素
         * @returns {TooltipData|null} 找到的提示对象
         */
        findTooltipByDiv(div) {
            for (const tooltip of this.tooltips) {
                if (tooltip.div === div) return tooltip;
            }
            return null;
        }

        /**
         * 按内容查找提示框
         * @param {string} content - 提示内容
         * @returns {TooltipData|null} 找到的提示对象
         */
        findTooltipByContent(content) {
            for (const tooltip of this.tooltips) {
                if (tooltip.content === content && tooltip.isActive) {
                    return tooltip;
                }
            }
            return null;
        }

        /**
         * 从对象池获取提示元素
         * @returns {HTMLElement} 提示元素
         */
        getTooltipElement() {
            // 从对象池中获取元素，如果池为空则创建新元素
            if (this.tooltipPool.length > 0) {
                const div = this.tooltipPool.pop();
                div.classList.remove('visible');
                return div;
            } else {
                // 创建新元素
                const div = document.createElement('div');
                div.className = 'nh-tooltip';
                document.body.appendChild(div);
                return div;
            }
        }

        /**
         * 归还提示元素到对象池
         * @param {HTMLElement} div - 要归还的提示元素
         */
        returnTooltipElement(div) {
            if (!div) return;

            // 检查元素是否已在池中
            if (this.tooltipPool.includes(div)) return;

            // 清空内容 - 使用更安全的方式代替innerHTML
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }

            // 重置样式和类
            div.className = 'nh-tooltip';

            // 重置所有内联样式
            div.removeAttribute('style');

            // 移除所有数据属性
            Array.from(div.attributes).forEach(attr => {
                if (attr.name.startsWith('data-')) {
                    div.removeAttribute(attr.name);
                }
            });

            // 移除所有事件监听器（通过克隆节点）
            const newDiv = div.cloneNode(false);
            if (div.parentNode) {
                div.parentNode.replaceChild(newDiv, div);
                // 使用新创建的div替代旧的div
                div = newDiv;
            }

            // 添加到对象池
            this.tooltipPool.push(div);

            // 内存优化：限制对象池大小
            while (this.tooltipPool.length > this.maxPoolSize) {
                const oldDiv = this.tooltipPool.shift();
                if (oldDiv && document.body.contains(oldDiv)) {
                    document.body.removeChild(oldDiv);
                }
            }

            // 返回新的div引用以便调用方可以更新引用
            return div;
        }

        /**
         * 开始位置更新
         */
        startPositionUpdates() {
            if (this.isUpdating) return;
            this.isUpdating = true;

            // 初始位置更新
            this.updatePositions();
        }

        /**
         * 停止位置更新
         */
        stopPositionUpdates() {
            this.isUpdating = false;
        }

        /**
         * 更新所有提示框位置
         * @param {boolean} [forceUpdate=false] - 是否强制更新
         */
        updatePositions(forceUpdate = false) {
            // 按z-index排序获取活动提示
            const activeTooltips = this.getActiveTooltipsByZIndex();

            // 更新位置
            if (activeTooltips.length > 0) {
                for (let i = 0; i < activeTooltips.length; i++) {
                    const offset = 15; // 基本偏移
                    this.updateSinglePosition(activeTooltips[i], offset, i);
                }
            }
        }

        /**
         * 更新单个提示位置
         * @param {TooltipData} tooltip - 提示数据
         * @param {number} offset - 偏移量
         * @param {number} index - 索引
         */
        updateSinglePosition(tooltip, offset, index) {
            const div = tooltip.div;
            const clientX = tooltip.clientX;
            const clientY = tooltip.clientY;

            // 缓存rect以避免频繁重新计算
            if (!tooltip.rectCache || tooltip.needRectUpdate) {
                tooltip.rectCache = div.getBoundingClientRect();
                tooltip.needRectUpdate = false;
            }
            const rect = tooltip.rectCache;

            // 计算边界值
            const rightBoundary = window.innerWidth - 10;
            const bottomBoundary = window.innerHeight - 10;

            // 初始确定位置方向，避免跳跃
            if (!tooltip.positionLocked) {
                // 初始方向确定 - 默认右下，不足时翻转
                tooltip.showOnRight = clientX + rect.width + offset <= rightBoundary;
                tooltip.showOnBottom = clientY + rect.height + offset <= bottomBoundary;
                tooltip.positionLocked = true;
            }

            // 根据锁定方向计算位置
            let posX = tooltip.showOnRight ? clientX + offset : clientX - rect.width - offset;
            let posY = tooltip.showOnBottom ? clientY + offset : clientY - rect.height - offset;

            // 确保至少部分可见
            posX = Math.max(10, Math.min(posX, rightBoundary - Math.min(rect.width, 250)));
            posY = Math.max(10, Math.min(posY, bottomBoundary - Math.min(rect.height, 300)));

            // 直接应用位置
            div.style.transform = `translate(${posX}px, ${posY}px)`;

            // 使用CSS变量设置亮度 - 根据z-index而非索引
            const BASE_Z_INDEX = ConfigManager.getConfig('BASE_Z_INDEX', 9999);
            const zIndexDistance = (tooltip.zIndex - BASE_Z_INDEX) / 10;
            const brightness = Math.min(0.3, zIndexDistance * 0.05);
            div.style.setProperty('--tooltip-brightness', brightness.toString());
        }

        /**
         * 滚动时更新位置
         */
        updateOnScroll() {
            if (this.getActiveTooltips().length === 0) return;

            isScrolling = true;
            this.needPositionUpdate = true;

            const activeTooltips = this.getActiveTooltips();

            for (const tooltip of activeTooltips) {
                // 对于有关联元素的情况，使用元素位置
                if (tooltip.element && tooltip.element.isConnected) {
                    const rect = tooltip.element.getBoundingClientRect();
                    // 使用相对偏移计算位置
                    tooltip.clientX = rect.left + tooltip.relativeX;
                    tooltip.clientY = rect.top + tooltip.relativeY;
                } else {
                    // 对于没有元素引用的情况，从初始坐标计算
                    tooltip.clientX = tooltip.initialClientX;
                    tooltip.clientY = tooltip.initialClientY - window.scrollY + tooltip.initialScrollY;
                }

                // 标记需要更新rect缓存
                tooltip.needRectUpdate = true;
            }

            // 强制立即更新位置
            if (activeTooltips.length > 0) {
                this.updatePositions(true); // 强制更新
            }

            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
            }, 100);
        }

        /**
         * 查找具有最低z-index的活动提示
         * @returns {TooltipData|null} 具有最低z-index的提示
         */
        findLowestZIndexTooltip() {
            const activeTooltips = this.getActiveTooltips();
            if (activeTooltips.length === 0) return null;

            return activeTooltips.reduce((lowest, current) => {
                return (current.zIndex < lowest.zIndex) ? current : lowest;
            }, activeTooltips[0]);
        }

        /**
         * 删除提示元素的通用方法
         * @param {TooltipData} tooltip - 要删除的提示
         * @param {boolean} [animate=true] - 是否使用动画
         */
        removeTooltipElement(tooltip, animate = true) {
            if (!tooltip) return;

            const div = tooltip.div;

            // 从提示数组中移除
            const index = this.tooltips.indexOf(tooltip);
            if (index !== -1) {
                this.tooltips.splice(index, 1);
            }

            // 停止观察
            if (this.intersectionObserver) {
                this.intersectionObserver.unobserve(div);
            }

            // 清理will-change定时器
            if (this.willChangeTimers.has(div)) {
                if (this.willChangeTimers.get(div).frame) {
                    cancelAnimationFrame(this.willChangeTimers.get(div).frame);
                }
                this.willChangeTimers.delete(div);
            }

            // 移除所有图片的事件监听器，避免已删除元素上的事件触发
            const images = div.querySelectorAll('img');
            if (images.length > 0) {
                images.forEach(img => {
                    // 移除所有可能的事件监听器
                    img.onload = null;
                    img.onerror = null;
                    // 对于使用addEventListener添加的监听器，我们无法精确移除，
                    // 所以会在returnTooltipElement中彻底移除所有事件监听器
                });
            }

            if (animate) {
                // 开始淡出动画
                div.classList.remove('visible');

                // 延迟仅用于视觉效果和对象池归还
                const ANIMATION_DURATION = ConfigManager.getConfig('ANIMATION_DURATION', 200);
                setTimeout(() => {
                    // 移除will-change以释放GPU资源
                    div.style.willChange = 'auto';
                    // 归还到对象池，并更新div引用
                    const newDiv = this.returnTooltipElement(div);
                    // 如果返回了新的div引用，更新tooltip中的引用
                    if (newDiv && newDiv !== div) {
                        tooltip.div = newDiv;
                    }

                    // 如果没有更多提示，停止动画更新
                    if (this.tooltips.length === 0) {
                        this.stopPositionUpdates();
                    }
                }, ANIMATION_DURATION);
            } else {
                // 立即移除，不使用动画
                div.style.willChange = 'auto';
                // 归还到对象池，并更新div引用
                const newDiv = this.returnTooltipElement(div);
                // 如果返回了新的div引用，更新tooltip中的引用
                if (newDiv && newDiv !== div) {
                    tooltip.div = newDiv;
                }

                // 如果没有更多提示，停止动画更新
                if (this.tooltips.length === 0) {
                    this.stopPositionUpdates();
                }
            }
        }

        /**
         * 关闭具有最低z-index的活动提示
         */
        hideLowest() {
            const lowestTooltip = this.findLowestZIndexTooltip();
            if (!lowestTooltip) return;

            this.removeTooltipElement(lowestTooltip);
        }

        /**
         * 显示提示
         * @param {string} content - 提示内容
         * @param {MouseEvent} event - 触发事件
         * @param {boolean} [stackable=false] - 是否可堆叠
         * @returns {HTMLElement} 提示元素
         */
        show(content, event, stackable = false) {
            // 记录最后事件信息
            this.lastClientX = event.clientX;
            this.lastClientY = event.clientY;

            // 记录初始滚动位置
            const initialScrollY = window.scrollY;

            // 如果提示内容已经存在，则重用
            let div;

            // 检查是否已存在相同内容的提示框
            const existingTooltip = this.findTooltipByContent(content);
            if (existingTooltip) {
                div = existingTooltip.div;

                // 清理will-change定时器
                if (this.willChangeTimers.has(div)) {
                    if (this.willChangeTimers.get(div).frame) {
                        cancelAnimationFrame(this.willChangeTimers.get(div).frame);
                    }
                    this.willChangeTimers.delete(div);
                }

                // 更新坐标
                existingTooltip.clientX = this.lastClientX;
                existingTooltip.clientY = this.lastClientY;
                existingTooltip.initialClientX = this.lastClientX;
                existingTooltip.initialClientY = this.lastClientY;
                existingTooltip.initialScrollY = initialScrollY;

                // 计算元素相对位置偏移
                const targetElement = event.target;
                if (targetElement) {
                    const targetRect = targetElement.getBoundingClientRect();
                    existingTooltip.relativeX = this.lastClientX - targetRect.left;
                    existingTooltip.relativeY = this.lastClientY - targetRect.top;
                    existingTooltip.element = targetElement;
                }

                // 标记需要更新rect
                existingTooltip.needRectUpdate = true;
                existingTooltip.positionLocked = false;

                // 将此提示移至顶层
                const newZIndex = this.currentZIndex + 10;
                existingTooltip.zIndex = newZIndex;
                div.style.zIndex = newZIndex.toString();
                this.currentZIndex = newZIndex;

                // 立即更新位置
                this.updateSinglePosition(existingTooltip, 15, 0);

                // 添加will-change以优化性能
                div.style.willChange = 'transform, opacity';

                // 使用requestAnimationFrame替代setTimeout
                let animationFrame = null;
                const removeWillChange = () => {
                    if (div.classList.contains('visible')) {
                        div.style.willChange = 'auto';
                    }
                    if (this.willChangeTimers.has(div)) {
                        this.willChangeTimers.delete(div);
                        this.activeTimerElements.delete(div);
                    }
                };

                const startRemoveAnimation = (timestamp) => {
                    if (!this.willChangeTimers.has(div)) return;

                    const startTime = this.willChangeTimers.get(div).startTime;
                    const elapsed = timestamp - startTime;

                    if (elapsed >= 300) {
                        removeWillChange();
                    } else {
                        animationFrame = requestAnimationFrame(startRemoveAnimation);
                        this.willChangeTimers.get(div).frame = animationFrame;
                    }
                };

                // 存储动画信息以便清理
                this.willChangeTimers.set(div, {
                    startTime: performance.now(),
                    frame: requestAnimationFrame(startRemoveAnimation)
                });

                // 确保可见（只在不可见时添加类）
                if (!div.classList.contains('visible')) {
                    div.classList.add('visible');
                }

                // 开始位置更新
                this.startPositionUpdates();

                return div;
            }

            // 如果不可堆叠且已有提示，则替换最上层提示
            if (!stackable && this.tooltips.length > 0) {
                const topTooltip = this.tooltips[this.tooltips.length - 1];
                div = topTooltip.div;

                // 清理will-change定时器
                if (this.willChangeTimers.has(div)) {
                    if (this.willChangeTimers.get(div).frame) {
                        cancelAnimationFrame(this.willChangeTimers.get(div).frame);
                    }
                    this.willChangeTimers.delete(div);
                }

                // 从数组中移除
                this.tooltips.pop();

                // 从交叉观察中移除
                this.intersectionObserver.unobserve(div);
            } else {
                // 检查是否超出限制，在添加新提示前先移除最低层的提示
                const maxActiveTooltips = SettingsManager.getSetting('MAX_ACTIVE_TOOLTIPS', 10);
                if (this.getActiveTooltips().length >= maxActiveTooltips) {
                    this.hideLowest();
                }

                div = this.getTooltipElement(); // 从对象池获取
            }

            // 为每层提示设置递增z-index
            this.currentZIndex += 10;
            const zIndex = this.currentZIndex;
            div.style.zIndex = zIndex.toString();

            // 添加will-change以优化性能
            div.style.willChange = 'transform, opacity';

            // 使用requestAnimationFrame替代setTimeout
            let animationFrame = null;
            const removeWillChange = () => {
                if (div.classList.contains('visible')) {
                    div.style.willChange = 'auto';
                }
                if (this.willChangeTimers.has(div)) {
                    this.willChangeTimers.delete(div);
                    this.activeTimerElements.delete(div);
                }
            };

            const startRemoveAnimation = (timestamp) => {
                if (!this.willChangeTimers.has(div)) return;

                const startTime = this.willChangeTimers.get(div).startTime;
                const elapsed = timestamp - startTime;

                if (elapsed >= 300) {
                    removeWillChange();
                } else {
                    animationFrame = requestAnimationFrame(startRemoveAnimation);
                    this.willChangeTimers.get(div).frame = animationFrame;
                }
            };

            // 存储动画信息以便清理
            this.willChangeTimers.set(div, {
                startTime: performance.now(),
                frame: requestAnimationFrame(startRemoveAnimation)
            });

            // 清空div内容（以防重用）
            while (div.firstChild) {
                div.removeChild(div.firstChild);
            }

            // 先计算位置再显示
            div.classList.remove('visible');

            // 获取元素相对位置偏移(用于精确跟踪)
            const targetElement = event.target;
            let relativeX = 0,
                relativeY = 0;

            if (targetElement) {
                const targetRect = targetElement.getBoundingClientRect();
                relativeX = this.lastClientX - targetRect.left;
                relativeY = this.lastClientY - targetRect.top;
            }

            // 构建tooltip对象
            const tooltip = {
                div,
                element: targetElement,
                clientX: this.lastClientX,
                clientY: this.lastClientY,
                initialClientX: this.lastClientX,
                initialClientY: this.lastClientY,
                initialScrollY,
                relativeX,
                relativeY,
                rectCache: null,
                needRectUpdate: true,
                positionLocked: false,
                pendingUpdate: false,
                isActive: true, // 活动状态标志
                createdAt: Date.now(), // 创建时间戳
                showOnRight: true,
                showOnBottom: true,
                zIndex: zIndex, // 保存z-index值
                content: content // 保存内容用于比较
            };

            // 设置内容 - 使用DOM方法
            if (typeof content === 'string') {
                // 安全解析HTML内容
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                const bodyNodes = Array.from(doc.body.childNodes);

                // 将安全节点附加到div
                bodyNodes.forEach(node => {
                    div.appendChild(node.cloneNode(true));
                });
            } else if (content instanceof Node) {
                div.appendChild(content);
            }

            // 添加到堆栈
            this.tooltips.push(tooltip);

            // 观察此提示框
            this.intersectionObserver.observe(div);

            // 更新位置
            this.updateSinglePosition(tooltip, 15, 0);

            // 强制回流
            div.offsetHeight;

            // 只在这里添加visible类，使用setTimeout确保正确的渲染顺序
            setTimeout(() => {
                div.classList.add('visible');
            }, 10);

            // 开始动画帧更新
            this.startPositionUpdates();

            // 图片加载监听器 - 修复异步加载图片后位置不调整的问题
            const images = div.querySelectorAll('img');
            if (images.length > 0) {
                let imagesLoaded = 0;
                const totalImages = images.length;

                const imageLoadHandler = () => {
                    imagesLoaded++;
                    if (imagesLoaded === totalImages) {
                        // 所有图片加载完成后，标记需要更新rect缓存并更新位置
                        const tooltipData = this.findTooltipByDiv(div);
                        if (tooltipData) {
                            tooltipData.needRectUpdate = true;
                            this.updatePositions(true);
                        }
                    }
                };

                images.forEach(img => {
                    // 已加载图片
                    if (img.complete) {
                        imageLoadHandler();
                    } else {
                        // 监听加载事件
                        img.addEventListener('load', imageLoadHandler, { once: true });
                        // 监听错误事件，确保计数正确
                        img.addEventListener('error', () => {
                            img.style.display = 'none';
                            imageLoadHandler();
                        }, { once: true });
                    }
                });
            }

            return div;
        }

        /**
         * 隐藏最上层提示
         */
        hideTop() {
            if (this.tooltips.length === 0) return;

            // 找到z-index最高的提示
            const activeTooltips = this.getActiveTooltips();
            if (activeTooltips.length === 0) return;

            const topTooltip = activeTooltips.reduce((highest, current) => {
                return (current.zIndex > highest.zIndex) ? current : highest;
            }, activeTooltips[0]);

            this.removeTooltipElement(topTooltip);
        }

        /**
         * 检查提示是否可见
         * @returns {boolean} 是否有可见提示
         */
        get isVisible() {
            return this.tooltips.length > 0;
        }

        /**
         * 清理资源
         */
        cleanup() {
            // 移除所有活动提示
            const activeTooltips = [...this.tooltips];
            for (const tooltip of activeTooltips) {
                this.removeTooltipElement(tooltip, false);
            }

            // 清空数组
            this.tooltips = [];

            // 清空对象池
            while (this.tooltipPool.length > 0) {
                const div = this.tooltipPool.pop();
                if (div && document.body.contains(div)) {
                    document.body.removeChild(div);
                }
            }

            // 清理willChangeTimers
            for (const div of this.activeTimerElements) {
                const timerInfo = this.willChangeTimers.get(div);
                if (timerInfo && timerInfo.frame) {
                    cancelAnimationFrame(timerInfo.frame);
                }
            }
            this.activeTimerElements.clear();

            // 停止交叉观察器
            if (this.intersectionObserver) {
                this.intersectionObserver.disconnect();
                this.intersectionObserver = null;
            }

            // 移除事件监听器
            window.removeEventListener('scroll', this.updateOnScrollThrottled);
            window.removeEventListener('resize', this.updateOnResizeThrottled);
            document.removeEventListener('click', this.handleDocumentClick);

            // 清空引用
            this.tooltipPool = [];
            this.refManager = null;
        }
    }

    /**
     * 标签处理模块 - 统一处理标签相关功能
     */
    class TagProcessor {
        constructor(refManager) {
            this.refManager = refManager;
            this.processTagsDebounced = Utils.debounce(this.processTags.bind(this), 50);
        }

        /**
         * 统一标签处理函数
         * @param {HTMLElement} tag - 标签元素
         * @returns {Object|null} 处理结果
         */
        processTagElement(tag) {
            if (!tag || tag.dataset.processed || !tagMap) return null;

            tag.dataset.processed = true;

            // 标记为已处理
            tag.setAttribute('data-nh-processed', 'true');

            const match = tag.href?.match(REGEX.HREF);
            if (!match) return null;

            const [_, type, originalTag] = match;
            const normalizedTag = Utils.normalizeTagName(originalTag);
            const translation = tagMap.get(normalizedTag);

            if (!translation) return null;

            // 格式化原始标签名
            const displayOriginal = originalTag.replace(/-/g, ' ');

            // 1. 获取原始标签名和计数元素
            const nameSpan = tag.querySelector('.name');
            const countSpan = tag.querySelector('.count');

            if (!nameSpan) return null;

            // 2. 保存原始href并设置为搜索链接
            const originalHref = tag.getAttribute('href');

            // 根据设置决定链接行为
            const redirectToOriginal = SettingsManager.getSetting('REDIRECT_TO_ORIGINAL', false);
            if (redirectToOriginal) {
                // 保持原始链接
                tag.setAttribute('href', originalHref);
            } else {
                // 设置为搜索链接
                const searchTerm = SettingsManager.getSetting('SEARCH_TERM', 'chinese');
                tag.setAttribute('href', `/search/?q=${searchTerm}+${encodeURIComponent(originalTag)}`);
            }

            // 保存原始标签信息
            tag.setAttribute('data-original-tag', originalTag);
            tag.setAttribute('data-original-href', originalHref);

            // 3. 处理翻译内容
            let translatedText = '';

            // 使用正则提取内容而非固定切片
            if (translation.name) {
                const contentMatch = translation.name.match(/<p>(.*?)<\/p>/);
                translatedText = contentMatch ? contentMatch[1] : translation.name.replace(/<\/?[^>]+(>|$)/g, '').trim();
            }

            // 清空原有内容 - 使用DOM方法代替innerHTML
            while (nameSpan.firstChild) {
                nameSpan.removeChild(nameSpan.firstChild);
            }

            // 添加name-wrapper类及其它必要样式
            nameSpan.classList.add('name-wrapper');

            // 检查是否包含图片，先放置图片元素
            if (translation.name?.includes('<img')) {
                // 提取图片URL
                const imgMatch = translation.name.match(REGEX.IMG_SRC);
                const imgUrl = imgMatch ? imgMatch[1] : '';

                // 提取纯文本内容 - 移除所有HTML标签
                let textContent = translation.name
                    .replace(/<img[^>]+>/g, '')
                    .replace(/<\/?[^>]+(>|$)/g, '')
                    .trim();

                if (!textContent) {
                    textContent = translatedText;
                }

                // 设置提取的纯文本用于CSS伪元素显示译文
                nameSpan.setAttribute('data-translated', textContent);

                // 同时存储用于复制功能
                nameSpan.setAttribute('data-translated-text', textContent);
                nameSpan.setAttribute('data-original-text', displayOriginal);

                // 设置显示文本，根据用户设置
                let displayedText;
                switch(SettingsManager.getSetting('DISPLAY_MODE', 'both')) {
                    case 'translation':
                        displayedText = textContent;
                        break;
                    case 'original':
                        displayedText = displayOriginal;
                        break;
                    case 'both':
                    default:
                        displayedText = `${textContent} (${displayOriginal})`;
                        break;
                }
                nameSpan.setAttribute('data-displayed-text', displayedText);

                // 对于有图片的情况，创建一个仅用于显示的图片元素
                if (imgUrl) {
                    // 显式创建图片容器和img元素
                    const imageContainer = document.createElement('span');
                    imageContainer.className = 'image-container';

                    const imgElement = document.createElement('img');
                    imgElement.src = imgUrl;
                    imgElement.alt = '';
                    imgElement.className = 'tag-icon';

                    // 添加错误处理
                    imgElement.onerror = () => {
                        imgElement.style.display = 'none';
                    };

                    imageContainer.appendChild(imgElement);

                    // 将图片容器添加到nameSpan (最终顺序由CSS flex控制)
                    nameSpan.appendChild(imageContainer);
                }
            } else {
                // 没有图片的情况，直接设置译文
                translatedText = translatedText.replace(/<\/?[^>]+(>|$)/g, '').trim(); // 移除任何HTML标签

                nameSpan.setAttribute('data-translated', translatedText);

                // 同时存储用于复制功能
                nameSpan.setAttribute('data-translated-text', translatedText);
                nameSpan.setAttribute('data-original-text', displayOriginal);

                // 设置显示文本，根据用户设置
                let displayedText;
                switch(SettingsManager.getSetting('DISPLAY_MODE', 'both')) {
                    case 'translation':
                        displayedText = translatedText;
                        break;
                    case 'original':
                        displayedText = displayOriginal;
                        break;
                    case 'both':
                    default:
                        displayedText = `${translatedText} (${displayOriginal})`;
                        break;
                }
                nameSpan.setAttribute('data-displayed-text', displayedText);
            }

            // 创建内部链接 - 保持原始文本用于复制
            const newLink = document.createElement('a');
            if (redirectToOriginal) {
                newLink.setAttribute('href', originalHref);
            } else {
                newLink.setAttribute('href', `/search/?q=${SettingsManager.getSetting('SEARCH_TERM', 'chinese')}+${encodeURIComponent(originalTag)}`);
            }

            // a标签内容为用户设置的复制文本内容（不含HTML标签）
            // 确保不包含任何HTML代码
            newLink.textContent = Utils.formatCopyText(displayOriginal, translatedText);

            // 添加链接到nameSpan (最终顺序由CSS flex控制)
            nameSpan.appendChild(newLink);

            // 4. 确保计数器不可选择
            if (countSpan) {
                countSpan.style.userSelect = 'none';
            }

            // 5. 初始化元素状态
            this.refManager.setElementData(tag, {
                lastHover: 0,
                hoverFrame: null,
                isActive: false,
                originalTag: originalTag,
                translatedText: translatedText,
                originalText: displayOriginal
            });

            return {
                tag,
                translation
            };
        }

        /**
         * 处理容器内的所有标签
         * @param {HTMLElement} context - 上下文元素
         */
        processTags(context) {
            if (!tagMap) return;

            // 更精确的选择器
            const tags = context.querySelectorAll('.tag:not([data-processed]):not([data-origin="search"])');

            // 如果没有标签需要处理，直接返回
            if (tags.length === 0) return;

            // 使用 DocumentFragment 减少DOM重绘
            const fragment = document.createDocumentFragment();
            const processedElements = [];

            tags.forEach((tag) => {
                this.processTagElement(tag); // 直接处理原始元素，无需克隆
            });

            // 如果有需要批量添加的标签
            if (processedElements.length > 0) {
                context.appendChild(fragment);
            }
        }

        /**
         * 处理搜索页面
         */
        handleSearchPage() {
            if (!tagMap) return;

            // 直接查询h1元素，不使用缓存
            const h1 = document.querySelector('#content h1');
            if (!h1) return;

            const query = new URLSearchParams(location.search).get('q')
                ?.replace(/\+/g, ' ')
                .split(/\s+/g)
                .filter(term => term.length > 0) || [];

            // 如果查询没有变化，不需要更新
            const queryString = query.join(',');
            if (queryString === lastSearchQuery && document.querySelector('.search-translation')) {
                return;
            }

            // 更新当前查询缓存
            lastSearchQuery = queryString;

            // 获取或创建容器
            let container = document.querySelector('.search-translation');
            let tagsContainer;

            if (!container) {
                container = document.createElement('div');
                container.className = 'search-translation';

                // 使用createElement创建子元素，而不是innerHTML
                const titleElement = document.createElement('div');
                titleElement.className = 'search-translation-title';
                titleElement.textContent = '搜索翻译：';

                tagsContainer = document.createElement('div');
                tagsContainer.className = 'tags';

                container.appendChild(titleElement);
                container.appendChild(tagsContainer);

                h1.insertAdjacentElement('afterend', container);
            } else {
                tagsContainer = container.querySelector('.tags');
                // 优化：使用replaceChildren()代替innerHTML = ''
                tagsContainer.replaceChildren();
            }

            // 使用DocumentFragment减少DOM操作
            const fragment = document.createDocumentFragment();

            // 处理查询的每个部分
            query.forEach((term) => {
                if (/^[\w-]+:/.test(term)) return;

                const matchTerm = Utils.normalizeTagName(term);
                const translation = tagMap.get(matchTerm);

                if (translation) {
                    // 创建外层tag容器 - 应该是一个a标签，带有href属性
                    const tag = document.createElement('a');
                    tag.className = 'tag';
                    tag.setAttribute('data-nh-processed', 'true');
                    tag.setAttribute('data-original-tag', translation.originalKey);
                    tag.setAttribute('data-origin', 'search');

                    // 修复: 修正变量引用，使用SettingsManager获取设置
                    const redirectToOriginal = SettingsManager.getSetting('REDIRECT_TO_ORIGINAL', false);

                    // 根据设置决定链接目标
                    if (redirectToOriginal) {
                        // 原始标签页
                        const type = translation.namespace || 'tag';
                        const originalHref = `/${type}/${translation.originalKey}/`;
                        tag.setAttribute('href', originalHref);
                    } else {
                        // 搜索页面
                        tag.setAttribute('href', `/search/?q=${SettingsManager.getSetting('SEARCH_TERM', 'chinese')}+${encodeURIComponent(translation.originalKey)}`);
                    }

                    // 创建名称span
                    const nameSpan = document.createElement('span');
                    nameSpan.className = 'name name-wrapper';

                    // 获取翻译文本和原始文本
                    const displayOriginal = translation.originalKey.replace(/-/g, ' ');
                    let translatedText = '';

                    // 检查是否包含图片
                    if (translation.name?.includes('<img')) {
                        // 提取图片URL
                        const imgMatch = translation.name.match(REGEX.IMG_SRC);
                        const imgUrl = imgMatch ? imgMatch[1] : '';

                        // 提取纯文本内容 - 移除所有HTML标签
                        let textContent = translation.name
                            .replace(/<img[^>]+>/g, '')
                            .replace(/<\/?[^>]+(>|$)/g, '')
                            .trim();

                        if (!textContent) {
                            textContent = translation.name?.slice(3, -4) || '';
                        }

                        translatedText = textContent;

                        // 设置提取的纯文本用于CSS伪元素显示译文和复制功能
                        nameSpan.setAttribute('data-translated', textContent);
                        nameSpan.setAttribute('data-translated-text', textContent);
                        nameSpan.setAttribute('data-original-text', displayOriginal);

                        // 设置显示文本，根据用户设置
                        let displayedText;
                        switch(SettingsManager.getSetting('DISPLAY_MODE', 'both')) {
                            case 'translation':
                                displayedText = textContent;
                                break;
                            case 'original':
                                displayedText = displayOriginal;
                                break;
                            case 'both':
                            default:
                                displayedText = `${textContent} (${displayOriginal})`;
                                break;
                        }
                        nameSpan.setAttribute('data-displayed-text', displayedText);

                        // 对于有图片的情况，创建图片元素
                        if (imgUrl) {
                            // 显式创建图片容器和img元素
                            const imageContainer = document.createElement('span');
                            imageContainer.className = 'image-container';

                            const imgElement = document.createElement('img');
                            imgElement.src = imgUrl;
                            imgElement.alt = '';
                            imgElement.className = 'tag-icon';

                            // 添加错误处理
                            imgElement.onerror = () => {
                                imgElement.style.display = 'none';
                            };

                            imageContainer.appendChild(imgElement);

                            // 将图片容器添加到nameSpan (顺序由CSS flex控制)
                            nameSpan.appendChild(imageContainer);
                        }
                    } else {
                        // 没有图片的情况
                        if (translation.name) {
                            const contentMatch = translation.name.match(/<p>(.*?)<\/p>/);
                            translatedText = contentMatch ? contentMatch[1] : translation.name.replace(/<\/?[^>]+(>|$)/g, '').trim();
                        } else {
                            translatedText = '';
                        }
                        translatedText = translatedText.replace(/<\/?[^>]+(>|$)/g, '').trim(); // 确保移除所有HTML标签

                        nameSpan.setAttribute('data-translated', translatedText);
                        nameSpan.setAttribute('data-translated-text', translatedText);
                        nameSpan.setAttribute('data-original-text', displayOriginal);

                        // 设置显示文本，根据用户设置
                        let displayedText;
                        switch(SettingsManager.getSetting('DISPLAY_MODE', 'both')) {
                            case 'translation':
                                displayedText = translatedText;
                                break;
                            case 'original':
                                displayedText = displayOriginal;
                                break;
                            case 'both':
                            default:
                                displayedText = `${translatedText} (${displayOriginal})`;
                                break;
                        }
                        nameSpan.setAttribute('data-displayed-text', displayedText);
                    }

                    // 创建内部链接 - 保持原始文本用于复制
                    const newLink = document.createElement('a');
                    if (redirectToOriginal) {
                        // 原始标签页
                        const type = translation.namespace || 'tag';
                        const originalHref = `/${type}/${translation.originalKey}/`;
                        newLink.setAttribute('href', originalHref);
                    } else {
                        // 搜索页面
                        newLink.setAttribute('href', `/search/?q=${SettingsManager.getSetting('SEARCH_TERM', 'chinese')}+${encodeURIComponent(translation.originalKey)}`);
                    }

                    // a标签内容为用户设置的复制文本内容（不含HTML标签）
                    // 确保不包含任何HTML代码
                    newLink.textContent = Utils.formatCopyText(displayOriginal, translatedText);

                    // 添加链接到nameSpan (顺序由CSS flex控制)
                    nameSpan.appendChild(newLink);

                    // 添加到tag
                    tag.appendChild(nameSpan);

                    // 初始化元素状态
                    this.refManager.setElementData(tag, {
                        lastHover: 0,
                        hoverFrame: null,
                        isActive: false,
                        originalTag: translation.originalKey,
                        translatedText: translatedText,
                        originalText: displayOriginal
                    });

                    fragment.appendChild(tag);
                }
            });

            // 更新DOM
            tagsContainer.appendChild(fragment);
        }
    }

    /**
     * 事件处理模块 - 统一管理事件处理
     */
    class EventHandler {
        constructor(refManager, tooltip) {
            this.refManager = refManager;
            this.tooltip = tooltip;
            this.currentTooltip = null;
            this.lastTooltipTime = 0;
            this.lastTooltipContent = '';
            this.lastTooltipEvent = null;
            this.abbrObserver = null;
            this.clickHandlerRef = null; // 存储点击处理函数引用

            // 绑定方法到实例
            this.handleDocumentMouseOver = this.handleDocumentMouseOver.bind(this);
            this.handleDocumentMouseOut = this.handleDocumentMouseOut.bind(this);
            this.handleMouseOver = this.handleMouseOver.bind(this);
            this.handleMouseOut = this.handleMouseOut.bind(this);
            this.handleAbbrClick = this.handleAbbrClick.bind(this);
            this.handleCounterClick = this.handleCounterClick.bind(this);
            this.handleAbbrMutation = this.handleAbbrMutation.bind(this);
        }

        /**
         * 处理文档级别鼠标悬停事件 (事件委托优化)
         * @param {MouseEvent} event - 鼠标事件
         */
        handleDocumentMouseOver(event) {
            // 使用事件委托，检查是否是目标元素
            const target = event.target.closest(REGEX.TAG_SELECTOR);
            if (target) {
                this.handleMouseOver({ target, clientX: event.clientX, clientY: event.clientY });
            }
        }

        /**
         * 处理文档级别鼠标移出事件 (事件委托优化)
         * @param {MouseEvent} event - 鼠标事件
         */
        handleDocumentMouseOut(event) {
            // 使用事件委托，检查是否是目标元素
            const target = event.target.closest(REGEX.TAG_SELECTOR);
            if (target) {
                this.handleMouseOut({ target });
            }
        }

        /**
         * 鼠标悬停事件处理
         * @param {Object} event - 合成的事件对象
         */
        handleMouseOver(event) {
            // 精确查找目标元素
            const target = event.target;
            if (!target) return;

            // 获取或初始化元素数据
            let data = this.refManager.getElementData(target);
            if (!data) {
                data = {
                    lastHover: 0,
                    hoverFrame: null,
                    isActive: false,
                    originalTag: target.dataset.originalTag
                };
                this.refManager.setElementData(target, data);
            }

            // 标记元素为活动状态
            data.isActive = true;

            // 基于时间戳的节流
            const now = Date.now();
            if (!data.lastHover || now - data.lastHover > 50) {
                data.lastHover = now;

                // 清除之前的RAF帧
                if (data.hoverFrame) {
                    cancelAnimationFrame(data.hoverFrame);
                }

                // 使用RAF优化渲染时机
                data.hoverFrame = requestAnimationFrame(() => {
                    // 确保标签映射已初始化，元素仍处于活动状态
                    if (!tagMap || !data.isActive) return;

                    // 检查原始标签信息
                    const originalTag = data.originalTag;
                    if (!originalTag) return;

                    const normalizedTag = Utils.normalizeTagName(originalTag);
                    const translation = tagMap.get(normalizedTag);

                    // Check if there's any content to show (intro or links)
                    if (translation?.intro || translation?.links) {
                        // Combine available content or use just one
                        let tooltipContent = '';

                        if (translation.intro) {
                            tooltipContent += translation.intro;
                        }

                        // 检查links是否只包含纯符号
                        if (translation.links) {
                            // 使用预编译的正则表达式
                            const symbolsOnly = REGEX.SYMBOLS_ONLY.test(translation.links);

                            if (!symbolsOnly) {
                                // 如果不是纯符号，添加分隔符和内容
                                if (translation.intro) {
                                    tooltipContent += '<hr>';
                                }
                                tooltipContent += translation.links;
                            }
                        }

                        if (tooltipContent.trim() !== '') {
                            this.tooltip.show(tooltipContent, {
                                target,
                                clientX: event.clientX || 0,
                                clientY: event.clientY || 0
                            });
                        }
                    }

                    data.hoverFrame = null;
                });
            }
        }

        /**
         * 鼠标移出事件处理
         * @param {Object} event - 合成的事件对象
         */
        handleMouseOut(event) {
            // 精确查找目标元素
            const target = event.target;
            if (!target) return;

            // 获取元素数据
            const data = this.refManager.getElementData(target);
            if (!data) return;

            // 标记元素为非活动状态
            data.isActive = false;

            // 清除RAF帧
            if (data.hoverFrame) {
                cancelAnimationFrame(data.hoverFrame);
                data.hoverFrame = null;
            }
        }

        /**
         * 处理abbr点击事件
         * @param {MouseEvent} event - 点击事件
         */
        handleAbbrClick(event) {
            if (event.target.tagName !== 'ABBR') return;

            event.preventDefault();
            event.stopPropagation();

            const abbr = event.target;
            const tagName = abbr.getAttribute('title');

            if (!tagName || !tagMap) return;

            // 检查是否已有此abbr的提示，避免重复创建
            const abbrData = this.refManager.getElementData(abbr);
            if (abbrData && abbrData.tooltipDiv && document.contains(abbrData.tooltipDiv)) {
                // 已存在提示，只更新位置并移至顶层
                for (const t of this.tooltip.tooltips) {
                    if (t.div === abbrData.tooltipDiv) {
                        // 移至顶层 - 更新z-index
                        this.tooltip.currentZIndex += 10;
                        const newZIndex = this.tooltip.currentZIndex;
                        t.zIndex = newZIndex;
                        t.div.style.zIndex = newZIndex.toString();

                        // 确保活动状态
                        t.isActive = true;

                        // 更新位置信息
                        t.clientX = event.clientX;
                        t.clientY = event.clientY;
                        t.initialClientX = event.clientX;
                        t.initialClientY = event.clientY;
                        t.initialScrollY = window.scrollY;

                        // 重新计算相对位置
                        if (t.element) {
                            const targetRect = t.element.getBoundingClientRect();
                            t.relativeX = event.clientX - targetRect.left;
                            t.relativeY = event.clientY - targetRect.top;
                        }

                        // 强制更新位置
                        t.lastUpdateX = null;
                        t.lastUpdateY = null;
                        t.needRectUpdate = true;
                        this.tooltip.needPositionUpdate = true;

                        // 确保可见
                        t.div.classList.add('visible');
                        this.tooltip.startPositionUpdates();
                        return;
                    }
                }
            }

            // 获取或缓存内容
            const cacheKey = Utils.normalizeTagName(tagName);
            // 确保缓存对象存在
            if (!this.abbrCache) {
                this.abbrCache = new CacheManager({
                    maxSize: 200,
                    cleanupInterval: 300000
                });
            }
            let content = this.abbrCache.get(cacheKey);

            if (!content) {
                const translation = tagMap.get(cacheKey);
                if (!translation?.intro && !translation?.links) return;

                // Combine available content
                let tooltipContent = '';

                if (translation.intro) {
                    tooltipContent += translation.intro;
                }

                // 检查links是否只包含纯符号
                if (translation.links) {
                    // 使用预编译的正则表达式
                    const symbolsOnly = REGEX.SYMBOLS_ONLY.test(translation.links);

                    if (!symbolsOnly) {
                        // 如果不是纯符号，添加分隔符和内容
                        if (translation.intro) {
                            tooltipContent += '<hr>';
                        }
                        tooltipContent += translation.links;
                    }
                }

                if (tooltipContent.trim() === '') return;

                content = tooltipContent;
                this.abbrCache.set(cacheKey, content);
            }

            // 检查是否超过abbr提示限制
            const abbrTooltips = this.tooltip.tooltips.filter(t =>
                t.element && t.element.tagName === 'ABBR' && t.isActive);

            if (abbrTooltips.length >= CONFIG.MAX_ABBR_TOOLTIPS) {
                // 找出z-index最低的abbr提示
                const lowestTooltip = abbrTooltips.reduce((lowest, current) => {
                    return (current.zIndex < lowest.zIndex) ? current : lowest;
                }, abbrTooltips[0]);

                if (lowestTooltip) {
                    this.tooltip.removeTooltipElement(lowestTooltip);
                }
            }

            // 创建新提示
            const div = this.tooltip.show(content, event, true);

            // 找到新创建的tooltip对象并添加引用
            for (let i = this.tooltip.tooltips.length - 1; i >= 0; i--) {
                const t = this.tooltip.tooltips[i];
                if (t.div === div) {
                    t.element = abbr;
                    t.createdAt = Date.now();

                    // 存储引用关系
                    this.refManager.setElementData(abbr, {
                        tooltipDiv: div
                    });
                    break;
                }
            }
        }

        /**
         * 处理abbr元素的DOM变化
         * @param {MutationRecord[]} mutations - 变化记录数组
         */
        handleAbbrMutation(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.removedNodes.length) {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            // 检查是否含有abbr元素
                            const abbrs = node.tagName === 'ABBR' ? [node] :
                                Array.from(node.querySelectorAll('abbr'));

                            if (abbrs.length === 0) continue;

                            for (const abbr of abbrs) {
                                // 查找对应的tooltip
                                const abbrData = this.refManager.getElementData(abbr);
                                if (abbrData && abbrData.tooltipDiv) {
                                    // 找到对应tooltip并清理
                                    for (let i = this.tooltip.tooltips.length - 1; i >= 0; i--) {
                                        const t = this.tooltip.tooltips[i];
                                        if (t.div === abbrData.tooltipDiv || t.element === abbr) {
                                            // 移除提示元素
                                            this.tooltip.removeTooltipElement(t, false);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        /**
         * 设置abbr元素处理
         * @param {CacheManager} abbrCache - Abbr缓存管理器
         */
        setupAbbrHandler(abbrCache) {
            this.abbrCache = abbrCache;
            // 使用命名函数作为事件监听器
            document.addEventListener('click', this.handleAbbrClick);

            // 监听DOM变化，处理abbr元素移除的情况
            this.abbrObserver = new MutationObserver(this.handleAbbrMutation);

            // 开始观察DOM变化，仅在文档体上监听
            this.abbrObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }

        /**
         * 设置页面事件监听
         */
        setupEventListeners() {
            // 使用事件委托优化 - 在文档级别监听鼠标事件
            document.addEventListener('mouseover', this.handleDocumentMouseOver, {
                passive: true
            });
            document.addEventListener('mouseout', this.handleDocumentMouseOut, {
                passive: true
            });

            // 创建统一的事件处理函数，处理不同类型的点击事件
            this.clickHandlerRef = (event) => {
                // 处理abbr元素点击
                if (event.target && event.target.tagName === 'ABBR') {
                    this.handleAbbrClick(event);
                }

                // 处理计数器点击 - 使用事件捕获而非冒泡，确保最先处理
                if (event.target && event.target.classList.contains('count')) {
                    this.handleCounterClick(event);
                    return; // 返回阻止后续处理
                }
            };

            // 注册统一的点击处理函数
            document.addEventListener('click', this.clickHandlerRef, true); // 使用捕获阶段
        }

        /**
         * 清理事件监听
         */
        cleanup() {
            // 移除文档级别事件监听
            document.removeEventListener('mouseover', this.handleDocumentMouseOver);
            document.removeEventListener('mouseout', this.handleDocumentMouseOut);

            // 移除abbr相关事件监听
            document.removeEventListener('click', this.handleAbbrClick);

            // 移除点击处理函数(捕获阶段)
            if (this.clickHandlerRef) {
                document.removeEventListener('click', this.clickHandlerRef, true);
                this.clickHandlerRef = null;
            }

            // 移除abbr观察器
            if (this.abbrObserver) {
                this.abbrObserver.disconnect();
                this.abbrObserver = null;
            }

            // 清理abbr缓存
            if (this.abbrCache) {
                this.abbrCache.dispose();
                this.abbrCache = null;
            }
        }

        // 处理计数器点击事件
        handleCounterClick(event) {
            // 检查是否是计数器元素
            const countSpan = event.target.closest('.count');
            if (!countSpan) return;

            // 检查用户设置是否允许计数器点击复制
            const clickCounterToCopy = SettingsManager.getSetting('CLICK_COUNTER_TO_COPY', !isMobileDevice());
            if (!clickCounterToCopy) return;

            // 立即阻止默认行为和事件冒泡，防止任何导航发生
            event.preventDefault();
            event.stopPropagation();

            const countElement = event.target;
            const tagElement = countElement.closest('.tag');

            if (!tagElement) return;

            // 获取关联的name-wrapper元素
            const nameWrapper = tagElement.querySelector('.name-wrapper');

            if (!nameWrapper || !nameWrapper.querySelector('a')) return;

            // 获取链接元素，其中包含要复制的文本
            const link = nameWrapper.querySelector('a');
            const textToCopy = link.textContent;

            // 执行复制到剪贴板操作
            try {
                // 使用现代Clipboard API
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(textToCopy)
                        .then(() => {
                            // 显示成功消息
                            const settingsManager = new SettingsManager();
                            settingsManager.showNotification('已复制：' + textToCopy);
                        })
                        .catch(err => {
                            console.error('Clipboard API 失败，使用回退方法:', err);
                            fallbackCopy();
                        });
                } else {
                    // 回退到旧方法
                    fallbackCopy();
                }
            } catch (err) {
                console.error('复制失败:', err);
            }

            // 回退复制方法
            function fallbackCopy() {
                // 创建临时输入元素
                const tempInput = document.createElement('textarea');
                tempInput.value = textToCopy;
                tempInput.setAttribute('readonly', '');
                tempInput.style.position = 'absolute';
                tempInput.style.left = '-9999px';
                document.body.appendChild(tempInput);

                // 选择文本并复制
                tempInput.select();

                let success = false;
                try {
                    success = document.execCommand('copy');
                } catch (err) {
                    console.error('execCommand复制失败:', err);
                }

                // 移除临时元素
                document.body.removeChild(tempInput);

                // 显示结果
                if (success) {
                    const settingsManager = new SettingsManager();
                    settingsManager.showNotification('已复制：' + textToCopy);
                }
            }
        }
    }

    /**
     * 页面管理模块 - 统一管理页面处理
     */
    class PageManager {
        constructor(tagProcessor, settingsUI) {
            this.tagProcessor = tagProcessor;
            this.settingsUI = settingsUI;

            // 绑定方法
            this.reloadTagData = this.reloadTagData.bind(this);
        }

        /**
         * 监听DOM变化
         */
        observeDOMChanges() {
            if (!domCache.tagsContainer) {
                domCache.tagsContainer = document.getElementById('tags');
            }

            const tagsContainer = domCache.tagsContainer;
            if (!tagsContainer) return;

            // 防止重复观察
            if (observer) {
                observer.disconnect();
            }

            let mutationsPending = false;

            observer = new MutationObserver((mutations) => {
                let hasChanges = false;

                for (const mutation of mutations) {
                    if (mutation.type === 'childList' && mutation.addedNodes.length) {
                        hasChanges = true;
                        break;
                    }
                }

                // 只在确实有变化时处理，并使用RAF确保在绘制前批量处理
                if (hasChanges && !mutationsPending) {
                    mutationsPending = true;
                    requestAnimationFrame(() => {
                        this.tagProcessor.processTagsDebounced(tagsContainer);
                        mutationsPending = false;
                    });
                }
            });

            // 优化观察配置 - 只观察必要的变化
            observer.observe(tagsContainer, {
                childList: true,
                subtree: true,
                attributes: false
            });

            // 初始处理
            this.tagProcessor.processTagsDebounced(tagsContainer);
        }

        /**
         * 创建Web Worker解析数据
         * @param {Object} rawData - 原始标签数据
         * @returns {Promise} 处理完成的Promise
         */
        async parseTagDataWithWorker(rawData) {
            return new Promise((resolve, reject) => {
                try {
                    // 快速检查是否支持Worker
                    if (typeof Worker === 'undefined') {
                        console.info('当前环境不支持Web Worker，使用主线程处理');
                        StatusManager.setStatus('WORKER_ACTIVE', false);
                        StatusManager.setStatus('WORKER_FALLBACK', true);
                        this.initTagMap(rawData);
                        resolve(tagMap);
                        return;
                    }

                    // 创建Worker代码
                    const workerCode = `
                    self.onmessage = function(e) {
                        try {
                            const rawData = e.data;

                            if (!rawData?.data) {
                                self.postMessage({ error: 'Invalid data format' });
                                return;
                            }

                            // 辅助函数 - 标准化标签名
                            function normalizeTagName(tagName) {
                                if (!tagName) return '';
                                return tagName.replace(/[\\s\\-_]+/g, ' ').trim().toLowerCase();
                            }

                            // 创建Map
                            const tagMap = new Map();

                            // 批量处理，减少GC压力
                            for (const namespace of rawData.data) {
                                try {
                                    if (!namespace?.namespace || !namespace?.data) continue;

                                    const ns = namespace.namespace;
                                    const entries = Object.entries(namespace.data);

                                    for (let i = 0; i < entries.length; i++) {
                                        try {
                                            const [key, value] = entries[i];
                                            if (!key) continue;

                                            const normKey = normalizeTagName(key);
                                            tagMap.set(normKey, {
                                                ...value,
                                                originalKey: key,
                                                namespace: ns
                                            });
                                        } catch (itemErr) {
                                            console.error(\`Processing tag item \${entries[i]?.[0] || 'unknown'} error\`);
                                        }
                                    }
                                } catch (nsErr) {
                                    console.error(\`Processing namespace \${namespace?.namespace || 'unknown'} error\`);
                                }
                            }

                            // 将Map转为序列化格式传回主线程
                            const serializedMap = Array.from(tagMap.entries());
                            self.postMessage({ success: true, data: serializedMap });
                        } catch (err) {
                            self.postMessage({ error: err.message || 'Unknown error' });
                        }
                    };
                    `;

                    // 创建Blob和Worker
                    const blob = new Blob([workerCode], { type: 'application/javascript' });
                    const workerUrl = URL.createObjectURL(blob);
                    const worker = new Worker(workerUrl);

                    // 设置超时，确保Worker不会无限等待
                    const timeoutId = setTimeout(() => {
                        console.warn('Worker处理超时，回退到主线程处理');
                        worker.terminate();
                        URL.revokeObjectURL(workerUrl);

                        StatusManager.setStatus('WORKER_ACTIVE', false);
                        StatusManager.setStatus('WORKER_FALLBACK', true);

                        // 回退到主线程处理
                        this.initTagMap(rawData);
                        resolve(tagMap);
                    }, 5000); // 5秒超时

                    // 处理Worker消息
                    worker.onmessage = (e) => {
                        clearTimeout(timeoutId);

                        if (e.data.error) {
                            console.error('Worker error:', e.data.error);
                            tagMap = new Map(); // 确保至少初始化为空Map

                            // 更新状态 - Worker回退
                            StatusManager.setStatus('WORKER_ACTIVE', false);
                            StatusManager.setStatus('WORKER_FALLBACK', true);

                            // 清理资源
                            worker.terminate();
                            URL.revokeObjectURL(workerUrl);

                            // 回退到主线程处理
                            this.initTagMap(rawData);
                            resolve(tagMap);
                        } else if (e.data.success) {
                            // 将序列化的Map转回Map对象
                            tagMap = new Map(e.data.data);

                            // 更新状态 - Worker成功
                            StatusManager.setStatus('WORKER_ACTIVE', true);
                            StatusManager.setStatus('WORKER_FALLBACK', false);
                            StatusManager.setStatus('DATA_LOADED', true);

                            // 清理资源
                            worker.terminate();
                            URL.revokeObjectURL(workerUrl);

                            resolve(tagMap);
                        }
                    };

                    // 处理Worker错误
                    worker.onerror = (err) => {
                        clearTimeout(timeoutId);
                        console.error('Worker initialization error:', err);
                        tagMap = new Map(); // 确保至少初始化为空Map

                        // 更新状态 - Worker失败
                        StatusManager.setStatus('WORKER_ACTIVE', false);
                        StatusManager.setStatus('WORKER_FALLBACK', true);

                        worker.terminate();
                        URL.revokeObjectURL(workerUrl);

                        // 回退到主线程处理
                        this.initTagMap(rawData);
                        resolve(tagMap);
                    };

                    // 发送数据到Worker
                    worker.postMessage(rawData);
                } catch (err) {
                    console.error('Failed to create worker:', err);

                    // 更新状态 - Worker失败
                    StatusManager.setStatus('WORKER_ACTIVE', false);
                    StatusManager.setStatus('WORKER_FALLBACK', true);

                    // 回退到主线程处理
                    this.initTagMap(rawData);
                    resolve(tagMap);
                }
            });
        }

        /**
         * 初始化标签映射 (主线程回退方案)
         * @param {Object} rawData - 原始标签数据
         */
        initTagMap(rawData) {
            try {
                if (!rawData?.data) {
                    throw new Error('标签数据格式错误');
                }

                // 预先分配适当大小的Map
                tagMap = new Map();

                // 批量处理，减少GC压力
                for (const namespace of rawData.data) {
                    try {
                        if (!namespace?.namespace || !namespace?.data) {
                            console.warn(`跳过无效命名空间: ${JSON.stringify(namespace)}`);
                            continue;
                        }

                        const ns = namespace.namespace;
                        const entries = Object.entries(namespace.data);

                        for (let i = 0; i < entries.length; i++) {
                            try {
                                const [key, value] = entries[i];
                                if (!key) continue;

                                const normKey = Utils.normalizeTagName(key);
                                tagMap.set(normKey, {
                                    ...value,
                                    originalKey: key,
                                    namespace: ns
                                });
                            } catch (itemErr) {
                                console.error(`处理标签项 ${entries[i]?.[0] || '未知'} 时出错: ${itemErr.message}`);
                            }
                        }
                    } catch (nsErr) {
                        console.error(`处理命名空间 ${namespace?.namespace || '未知'} 时出错: ${nsErr.message}`);
                    }
                }

                // 数据加载完成
                StatusManager.setStatus('DATA_LOADED', true);
                console.info(`标签数据加载完成: ${tagMap.size} 项`);
            } catch (err) {
                console.error(`处理标签数据时出错: ${err.message}`);
                tagMap = new Map(); // 确保至少初始化为空Map

                // 数据加载失败
                StatusManager.setStatus('DATA_LOADED', false);
                this.settingsUI.showNotification(`标签数据加载失败: ${err.message}`);
            }
        }

        /**
         * 重新加载标签数据
         */
        reloadTagData() {
            try {
                // 检查是否已经在进行下载
                if (document.querySelector('.nh-download-status')) {
                    console.info('已有下载任务正在进行，跳过此次下载');
                    return;
                }

                // 清除当前状态
                StatusManager.setStatus('WORKER_ACTIVE', false);
                StatusManager.setStatus('WORKER_FALLBACK', false);
                StatusManager.setStatus('DATA_LOADED', false);

                // 创建下载提示元素
                let downloadStatus = document.createElement('div');
                downloadStatus.className = 'nh-download-status';
                downloadStatus.innerHTML = `
                    <div class="download-indicator">
                        <span class="download-spinner"></span>
                        <span class="download-text">正在下载标签数据...</span>
                    </div>
                `;
                document.body.appendChild(downloadStatus);

                this.settingsUI.showNotification('正在获取标签数据...');

                GM_xmlhttpRequest({
                    method: 'GET',
                    url: 'https://github.com/EhTagTranslation/DatabaseReleases/raw/master/db.html.json',
                    onload: (res) => {
                        try {
                            // 移除下载提示
                            if (downloadStatus && downloadStatus.parentNode) {
                                downloadStatus.parentNode.removeChild(downloadStatus);
                            }

                            const data = JSON.parse(res.responseText);
                            if (!data?.data) {
                                throw new Error('返回的数据格式无效');
                            }

                            GM_setValue('tag-data', data);
                            this.settingsUI.showNotification('标签数据获取成功，正在刷新页面...');

                            // 延迟刷新以确保通知显示
                            setTimeout(() => {
                                window.location.reload();
                            }, 1000);
                        } catch (e) {
                            // 移除下载提示
                            if (downloadStatus && downloadStatus.parentNode) {
                                downloadStatus.parentNode.removeChild(downloadStatus);
                            }

                            console.error('数据解析失败:', e.message);
                            this.settingsUI.showNotification(`数据解析失败: ${e.message}`);
                        }
                    },
                    onerror: (err) => {
                        // 移除下载提示
                        if (downloadStatus && downloadStatus.parentNode) {
                            downloadStatus.parentNode.removeChild(downloadStatus);
                        }

                        console.error('获取标签数据失败:', err);
                        this.settingsUI.showNotification('获取标签数据失败，请检查网络连接');
                    }
                });
            } catch (err) {
                console.error('重新加载标签数据失败:', err.message);
                this.settingsUI.showNotification(`重新加载失败: ${err.message}`);
            }
        }

        /**
         * 运行主逻辑
         */
        async runMainLogic() {
            const path = location.pathname;

            if (path.startsWith('/g/')) {
                // 标签页
                this.observeDOMChanges();
            } else if (path.startsWith('/search/')) {
                // 搜索页
                this.tagProcessor.handleSearchPage();
            }
        }

        /**
         * 加载标签数据并启动
         * @returns {Promise} 加载完成的Promise
         */
        async loadTagData() {
            try {
                const cachedData = GM_getValue('tag-data');
                if (cachedData) {
                    try {
                        // 先检查Worker是否可用，如果不可用则不显示提示
                        let workerAvailable = false;
                        try {
                            // 简单测试Worker是否可用
                            workerAvailable = typeof Worker !== 'undefined';
                        } catch (e) {
                            workerAvailable = false;
                        }

                        // 只有在Worker可用时才显示加载提示
                        let loadingStatus = null;
                        if (workerAvailable) {
                            // 创建下载提示元素
                            loadingStatus = document.createElement('div');
                            loadingStatus.className = 'nh-download-status';
                            loadingStatus.innerHTML = `
                                <div class="download-indicator">
                                    <span class="download-spinner"></span>
                                    <span class="download-text">正在加载标签数据...</span>
                                </div>
                            `;
                            document.body.appendChild(loadingStatus);
                        }

                        // 使用Worker解析数据
                        await this.parseTagDataWithWorker(cachedData);

                        // 移除加载提示
                        if (loadingStatus && loadingStatus.parentNode) {
                            loadingStatus.parentNode.removeChild(loadingStatus);
                        }

                        await this.runMainLogic();
                        console.info('使用Web Worker加载标签数据成功');
                    } catch (err) {
                        console.error(`Worker处理失败，使用主线程解析: ${err.message}`);

                        // 创建下载提示元素（如果不存在）
                        let loadingStatus = document.querySelector('.nh-download-status');
                        if (!loadingStatus) {
                            loadingStatus = document.createElement('div');
                            loadingStatus.className = 'nh-download-status';
                            loadingStatus.innerHTML = `
                                <div class="download-indicator">
                                    <span class="download-spinner"></span>
                                    <span class="download-text">正在使用备用方式加载标签数据...</span>
                                </div>
                            `;
                            document.body.appendChild(loadingStatus);
                        } else {
                            loadingStatus.querySelector('.download-text').textContent = '正在使用备用方式加载标签数据...';
                        }

                        // 回退到主线程处理
                        this.initTagMap(cachedData);

                        // 移除加载提示
                        if (loadingStatus && loadingStatus.parentNode) {
                            loadingStatus.parentNode.removeChild(loadingStatus);
                        }

                        await this.runMainLogic();
                        console.info('使用主线程加载标签数据成功');
                    }
                } else {
                    console.warn('未找到缓存的标签数据，正在重新获取');
                    this.reloadTagData();
                }
            } catch (err) {
                // 移除任何可能存在的加载提示
                const loadingStatus = document.querySelector('.nh-download-status');
                if (loadingStatus && loadingStatus.parentNode) {
                    loadingStatus.parentNode.removeChild(loadingStatus);
                }

                console.error(`加载标签数据失败: ${err.message}`);
                this.settingsUI.showNotification(`加载标签数据失败: ${err.message}`);

                // 在错误情况下也尝试执行主逻辑，以便至少显示原始标签
                try {
                    await this.runMainLogic();
                } catch (runErr) {
                    console.error('执行主逻辑失败:', runErr);
                }
            }
        }
    }

    /**
     * 添加样式到页面
     */
    function addStyles() {
        const styles = `
        /* 提示框样式 */
        .nh-tooltip {
            position: fixed;
            top: 0;
            left: 0;
            background-color: rgba(40, 42, 54, 0.95);
            color: #f8f8f2;
            padding: 8px 12px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
            font-size: 14px;
            max-width: 400px;
            opacity: 0;
            pointer-events: auto;
            transform: translateY(5px);
            transition: opacity ${ConfigManager.getConfig('ANIMATION_DURATION', 200)}ms ease-out, transform 0.15s ease-out;
            z-index: ${ConfigManager.getConfig('BASE_Z_INDEX', 9999)};
            line-height: 1.4;
            filter: brightness(calc(1 - var(--tooltip-brightness, 0)));
            will-change: opacity, transform;
            box-sizing: border-box;
            border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* 在现有的.nh-tooltip样式后添加 */
        .nh-tooltip img {
            max-width: min(100%, 400px);  /* 最大不超过提示框宽度或400px */
            max-height: 60vh;             /* 最大不超过视口高度的60% */
            height: auto;                 /* 保持原始比例 */
        }

        .nh-tooltip.visible {
            visibility: visible;
            opacity: 1;
        }

        /* 添加链接样式 */
        .nh-tooltip a {
            text-decoration: underline;
            color: #0099ff;
            cursor: pointer;
        }

        .nh-tooltip a:hover {
            color: #66ccff;
        }

        .search-translation {
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 1px solid #444;
        }

        .reload-btn, .settings-btn {
            cursor: pointer;
        }

        /* 名称容器特殊处理 */
        .tag .name-wrapper {
            position: relative;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
        }

        /* 确保内部链接样式与原始文本一致 */
        .tag .name-wrapper a {
            color: rgb(204,204,204);
            display: inline-block;
            text-decoration: none;
            font-size: 14px;
        }

        /* 重写之前的CSS伪元素代码 */
        /* 图片容器样式 */
        .tag .name-wrapper .image-container {
            display: inline-block;
            margin-right: 5px;
            vertical-align: middle;
            user-select: none;
        }

        /* 图片样式 */
        .tag .name-wrapper .image-container img.tag-icon {
            vertical-align: middle;
            max-height: 16px;
            width: auto;
            pointer-events: none;
        }

        /* 修复标签内容的顺序 */
        .tag .name-wrapper {
            position: relative;
            display: flex;
            align-items: center;
        }

        /* 图片放最前面 */
        .tag .name-wrapper .image-container {
            order: 1;
        }

        /* 链接样式 - 不可见但能复制 */
        .tag .name-wrapper > a {
            order: 3;
            position: relative;
            color: transparent;
            font-size: 0;
            text-decoration: none;
            z-index: 2; /* 确保可点击 */
        }

        /* 使用单一伪元素显示完整的 "译文(原文)" 格式 */
        .tag .name-wrapper::before {
            content: attr(data-displayed-text);
            display: inline;
            order: 2;
            color: rgb(204,204,204);
            font-size: 14px;
            pointer-events: none;
            user-select: none;
            white-space: pre-wrap;
            word-break: break-word;
        }

        /* 确保计数器不可选择 */
        .tag .count {
            user-select: none !important;
        }

        /* 扩展a标签点击区域到整个标签 */
        .tag {
            position: relative; /* 确保父元素有相对定位 */
        }

        .tag .name-wrapper {
            position: static; /* 确保name-wrapper不干扰定位 */
        }

        .tag .name-wrapper a {
            position: static; /* 保持内容在正确位置 */
            display: inline-block; /* 允许伪元素工作 */
            z-index: 2;
        }

        /* 使用伪元素创建覆盖整个父标签的点击区域 */
        .tag .name-wrapper a::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%; /* 与父标签同宽 */
            height: 100%; /* 与父标签同高 */
            z-index: 1; /* 在文本下方但可接收点击 */
        }

        /* 确保count元素显示在正确位置 */
        .tag .count {
            position: relative;
            z-index: 3; /* 确保在链接伪元素之上 */
        }

        /* 设置菜单样式 */
        .nh-settings-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 99999;
            opacity: 0;
            visibility: hidden;
            transition: opacity ${ConfigManager.getConfig('ANIMATION_DURATION', 200)}ms ease, visibility ${ConfigManager.getConfig('ANIMATION_DURATION', 200)}ms ease;
        }

        .nh-settings-modal.visible {
            opacity: 1;
            visibility: visible;
        }

        .nh-settings-content {
            background-color: #1f1f1f;
            border-radius: 8px;
            padding: 20px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .nh-settings-content h3 {
            margin-top: 0;
            margin-bottom: 20px;
            color: #ed2553;
            border-bottom: 1px solid #333;
            padding-bottom: 10px;
        }

        .nh-settings-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .settings-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }

        .settings-group label {
            font-size: 14px;
            color: #ccc;
        }

        .settings-group input[type="text"],
        .settings-group input[type="number"],
        .settings-group select {
            background-color: #2a2a2a;
            border: 1px solid #444;
            padding: 8px 10px;
            color: #fff;
            border-radius: 4px;
            font-size: 14px;
            width: 100%;
        }

        .settings-group input[type="text"]:focus,
        .settings-group input[type="number"]:focus,
        .settings-group select:focus {
            outline: none;
            border-color: #ed2553;
        }

        .setting-description {
            font-size: 12px;
            color: #999;
            margin-top: 2px;
        }

        .status-group {
            background-color: #252525;
            padding: 10px;
            border-radius: 4px;
            margin-top: 10px;
        }

        .status-group h4 {
            margin-top: 0;
            margin-bottom: 10px;
            color: #ccc;
            font-size: 14px;
        }

        .status-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .status-list li {
            margin-bottom: 5px;
            font-size: 13px;
        }

        .status-ok {
            color: #4caf50;
        }

        .status-warning {
            color: #ff9800;
        }

        .status-error {
            color: #f44336;
        }

        .status-neutral {
            color: #90a4ae;
        }

        .settings-button-group {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
        }

        .action-group {
            display: flex;
            justify-content: flex-start;
            margin-top: 10px;
        }

        .nh-button {
            background-color: #2a2a2a;
            border: 1px solid #444;
            color: #ccc;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s ease;
        }

        .nh-button:hover {
            background-color: #333;
        }

        .nh-button.save-button {
            background-color: #ed2553;
            color: #fff;
            border-color: #ed2553;
        }

        .nh-button.save-button:hover {
            background-color: #ff3e69;
        }

        .nh-button.reload-button {
            background-color: #1a7fd9;
            color: #fff;
            border-color: #1a7fd9;
        }

        .nh-button.reload-button:hover {
            background-color: #2196f3;
        }

        /* 通知样式 */
        .nh-notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: rgba(237, 37, 83, 0.9);
            color: #fff;
            padding: 12px 20px;
            border-radius: 4px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
            transform: translateY(100px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
            z-index: 10001;
        }

        /* 下载提示样式 */
        .nh-download-status {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            padding: 10px;
            background-color: rgba(40, 42, 54, 0.9);
            color: #f8f8f2;
            z-index: 999999;
            text-align: center;
            font-size: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .download-indicator {
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .download-spinner {
            display: inline-block;
            width: 16px;
            height: 16px;
            margin-right: 8px;
            border: 2px solid #bd93f9;
            border-top-color: transparent;
            border-radius: 50%;
            animation: nh-spinner 1s linear infinite;
        }

        @keyframes nh-spinner {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .nh-notification.visible {
            transform: translateY(0);
            opacity: 1;
        }
`;
        document.head.appendChild(document.createElement('style')).textContent = styles;
    }

    /**
     * 资源清理
     */
    function cleanup() {
        // 断开观察器
        if (observer) {
            observer.disconnect();
            observer = null;
        }

        // 断开abbr观察器
        if (abbrObserver) {
            abbrObserver.disconnect();
            abbrObserver = null;
        }

        // 清理计时器
        clearTimeout(scrollTimeout);

        // 清空DOM缓存
        Object.keys(domCache).forEach((key) => {
            delete domCache[key];
        });
    }

    /**
     * 初始化脚本
     */
    async function init() {
        // 添加样式
        addStyles();

        // 先加载所有用户设置
        SettingsManager.loadAllSettings();

        // 创建引用管理器
        const refManager = new ReferenceManager();

        // 创建提示管理器
        const tooltip = new Tooltip(refManager);

        // 创建设置UI管理器
        const settingsUI = new SettingsUI();

        // 创建标签处理器
        const tagProcessor = new TagProcessor(refManager);

        // 创建事件处理器
        const eventHandler = new EventHandler(refManager, tooltip);

        // 创建页面管理器
        const pageManager = new PageManager(tagProcessor, settingsUI);

        // 创建abbr缓存
        const abbrCache = new CacheManager({
            maxSize: 200,
            cleanupInterval: 300000
        });

        // 创建设置按钮和重新加载按钮
        settingsUI.createSettingsButton(pageManager.reloadTagData.bind(pageManager));

        // 设置事件处理
        eventHandler.setupEventListeners();

        // 设置abbr处理
        eventHandler.setupAbbrHandler(abbrCache);

        // 清理资源
        window.addEventListener('beforeunload', () => {
            cleanup();
            tooltip.cleanup();
            eventHandler.cleanup();
            abbrCache.dispose();
        });

        try {
            // 加载标签数据并启动主逻辑
            await pageManager.loadTagData();
            pageManager.runMainLogic();
        } catch (err) {
            console.error('初始化失败:', err);
            StatusManager.setStatus('DATA_LOADED', false);
        }
    }

    /**
     * 加载脚本
     */
    function loadScript() {
        // 判断是否已加载
        if (window.nhTagTranslatorLoaded) return;
        window.nhTagTranslatorLoaded = true;

        // 使用requestIdleCallback执行初始化，避免阻塞页面渲染
        if (window.requestIdleCallback) {
            requestIdleCallback(() => {
                init().catch(err => console.error('初始化失败:', err));
            });
        } else {
            // 回退到setTimeout
            setTimeout(() => {
                init().catch(err => console.error('初始化失败:', err));
            }, 100);
        }
    }

    // 在页面加载完成后执行
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', loadScript);
    } else {
        loadScript();
    }
})();