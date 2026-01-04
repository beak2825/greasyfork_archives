// ==UserScript==
// @license MIT
// @name        B站话题过滤器
// @namespace   BiliTopicFilter
// @version     1.0
// @description 修复UI弹出问题的稳定版本
// @author      maxwell
// @icon data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjMDBjMzdjIiBkPSJNMTIgMkM2LjQ4IDIgMiA2LjQ4IDIgMTJzNC40OCAxMCAxMCAxMCAxMC00LjQ4IDEwLTEwUzE3LjUyIDIgMTIgMnptMCAxOGMtNC40MSAwLTgtMy41OS04LThzMy41OS04IDgtOCA4IDMuNTkgOCA4LTMuNTkgOC04IDh6bS0xLjA3LTcuMjRMOS4zMyAxMi43bC0xLjQxLTEuNDEgMi44My0yLjgzIDIuODMgMi44MyA0LjI0LTQuMjQgMS40MSAxLjQxLTVsLTUuMDA1IDV6Ii8+PC9zdmc+
// @match       https://www.bilibili.com/v/topic/detail/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/522852/B%E7%AB%99%E8%AF%9D%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/522852/B%E7%AB%99%E8%AF%9D%E9%A2%98%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ConfigManager {
        constructor() {
            this.unsavedChanges = false;
            this.cache = {
                settings: {
                    userFilter: true,
                    keywordFilter: true,
                    hideMethod: 'overlay'
                },
                blocked: {
                    users: new Set(),
                    keywords: new Set(),
                    whitelist: new Set()
                }
            };
            this.load();
        }

        load() {
            const saved = GM_getValue('filterConfig');
            if (saved) {
                this.cache.settings = saved.settings || this.cache.settings;
                this.cache.blocked.users = new Set(saved.blocked?.users || []);
                this.cache.blocked.keywords = new Set(saved.blocked?.keywords || []);
                this.cache.blocked.whitelist = new Set(saved.blocked?.whitelist || []);
            }
        }

        save() {
            GM_setValue('filterConfig', {
                settings: this.cache.settings,
                blocked: {
                    users: [...this.cache.blocked.users],
                    keywords: [...this.cache.blocked.keywords],
                    whitelist: [...this.cache.blocked.whitelist]
                }
            });
            this.unsavedChanges = false;
        }

        addItem(type, value) {
            if (type === 'users' || type === 'whitelist') {
                if (!/^\d+$/.test(value)) return;
            }
            this.cache.blocked[type].add(value.toString());
            this.unsavedChanges = true;
        }

        removeItem(type, value) {
            this.cache.blocked[type].delete(value.toString());
            this.unsavedChanges = true;
        }
    }

    class FilterUI {
        constructor(config) {
            this.config = config;
            this.initUI();
            this.bindGlobalEvents();
            this.hide(); // 初始隐藏
        }

        initUI() {
            this.container = document.createElement('div');
            this.container.className = 'filter-main';
            this.render();
            document.body.appendChild(this.container);
        }

        render() {
            this.container.innerHTML = `
                <div class="header">
                    <h3>内容过滤器</h3>
                    <button class="close-btn">×</button>
                </div>
                <div class="tabs">
                    <button data-tab="users" class="active">用户屏蔽</button>
                    <button data-tab="keywords">关键词屏蔽</button>
                    <button data-tab="whitelist">白名单</button>
                    <button data-tab="settings">设置</button>
                </div>
                <div class="content">
                    <div data-tab="users" class="tab-pane active">
                        <div class="input-group">
                            <input type="text" placeholder="输入UID，多个用逗号分隔">
                            <button class="add-btn">添加</button>
                        </div>
                        <div class="item-list" data-type="users"></div>
                    </div>

                    <div data-tab="keywords" class="tab-pane">
                        <div class="input-group">
                            <input type="text" placeholder="输入关键词，多个用逗号分隔">
                            <button class="add-btn">添加</button>
                        </div>
                        <div class="item-list" data-type="keywords"></div>
                    </div>

                    <div data-tab="whitelist" class="tab-pane">
                        <div class="input-group">
                            <input type="text" placeholder="输入UID，多个用逗号分隔">
                            <button class="add-btn">添加</button>
                        </div>
                        <div class="item-list" data-type="whitelist"></div>
                    </div>

                    <div data-tab="settings" class="tab-pane">
                        <label>
                          <input type="checkbox" data-setting="userFilter">启用用户屏蔽
                        </label>
                        <label>
                            <input type="checkbox" data-setting="keywordFilter">启用关键词屏蔽
                        </label>
                        <label>
                            <input type="radio" name="hideMethod" value="overlay" data-setting="hideMethod">显示屏蔽层
                        </label>
                        <label>
                            <input type="radio" name="hideMethod" value="remove" data-setting="hideMethod">完全隐藏
                        </label>
                    </div>
                </div>
                <div class="footer">
                    <button class="save-btn">保存配置</button>
                    <span class="save-status"></span>
                </div>
            `;
            this.refreshView();
        }

        bindGlobalEvents() {
            // 关闭按钮事件
            this.container.querySelector('.close-btn').addEventListener('click', () => this.hide());

            // 标签切换事件
            this.container.querySelectorAll('[data-tab]').forEach(btn => {
                btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
            });

            // 添加按钮事件
            this.container.querySelectorAll('.add-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.handleAddItem(btn.closest('.tab-pane'));
                });
            });

            // 删除按钮事件
            this.container.addEventListener('click', e => {
                if (e.target.classList.contains('delete-btn')) {
                    this.handleDeleteItem(e.target.closest('.list-item'));
                }
            });

            // 保存按钮
            this.container.querySelector('.save-btn').addEventListener('click', () => this.handleSave());

            // 设置项变更
            this.container.querySelectorAll('[data-setting]').forEach(input => {
                input.addEventListener('change', () => this.handleSettingChange(input));
            });
        }

        show() {
            this.container.style.display = 'block';
            this.refreshView();
        }

        hide() {
            this.container.style.display = 'none';
        }

        switchTab(tabName) {
            // 切换标签按钮状态
            this.container.querySelectorAll('[data-tab]').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.tab === tabName);
            });

            // 切换内容面板
            this.container.querySelectorAll('.tab-pane').forEach(pane => {
                pane.classList.toggle('active', pane.dataset.tab === tabName);
            });
        }

        handleAddItem(pane) {
            const type = pane.dataset.tab;
            const input = pane.querySelector('input');
            const values = input.value.split(',').map(v => v.trim()).filter(Boolean);

            if (type === 'users' || type === 'whitelist') {
                if (values.some(v => !/^\d+$/.test(v))) {
                    alert('UID必须为数字');
                    return;
                }
            }

            values.forEach(v => this.config.addItem(type, v));
            input.value = '';
            this.refreshList(type);
        }

        handleDeleteItem(item) {
            const type = item.parentElement.dataset.type;
            const value = item.dataset.value;
            this.config.removeItem(type, value);
            this.refreshList(type); // 另一个调用点
        }

        handleSave() {
            this.config.save();
            this.showStatus('保存成功！');
        }

        handleSettingChange(input) {
            const settingKey = input.dataset.setting;
            const value = input.type === 'checkbox'
                ? input.checked
                : input.value;

            // 更新配置
            this.config.cache.settings[settingKey] = value;
            this.config.unsavedChanges = true;
        }

        refreshList(type) {
            const list = this.container.querySelector(`[data-type="${type}"]`);
            list.innerHTML = [...this.config.cache.blocked[type]].map(value => `
                <div class="list-item" data-value="${value}">
                    ${value}
                    <button class="delete-btn">×</button>
                </div>
            `).join('');
        }

        refreshView() {
            // 刷新所有列表
            ['users', 'keywords', 'whitelist'].forEach(type => this.refreshList(type));

            // 更新设置项状态
            Object.entries(this.config.cache.settings).forEach(([key, val]) => {
                const input = this.container.querySelector(`[data-setting="${key}"]`);
                if (!input) return;

                if (input.type === 'checkbox') {
                    input.checked = val;
                } else if (input.type === 'radio') {
                    input.checked = (input.value === val);
                }
            });
        }

        showStatus(text) {
            const status = this.container.querySelector('.save-status');
            status.textContent = text;
            setTimeout(() => status.textContent = '', 2000);
        }
    }

    GM_addStyle(`
    /* 基础容器 */
    .filter-main {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 420px;
        height: 560px; /* 固定高度 */
        background: #2D2F33;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        color: #FFFFFF;
        font-family: system-ui, sans-serif;
        z-index: 99999;
        display: none;
        flex-direction: column; /* 垂直布局 */
    }

    /* 头部区域 */
    .filter-main .header {
        padding: 18px 24px;
        border-bottom: 1px solid #404040;
        position: relative;
        padding-right: 60px;
    }


    .filter-main .header h3 {
        margin: 0;
        font-size: 17px;
        font-weight: 500;
        letter-spacing: 0.5px;
    }

    .filter-main .close-btn {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 32px;
        height: 32px;
        background: rgba(255,255,255,0.1);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .filter-main .close-btn:hover {
        opacity: 0.8;
    }

    /* 标签导航 */
    .filter-main .tabs {
        display: flex;
        padding: 0 16px;
        background: #36383D;
        flex-shrink: 0;
        border-radius: 8px 8px 0 0;
    }

    .filter-main .tabs button {
        flex: 1;
        padding: 14px 0;
        margin: 0 4px;
        font-size: 13px;
        color: #9DA3AD;
        background: none;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s;
        position: relative;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 500;
    }

    .filter-main .tabs button:hover {
        color: #FFFFFF;
    }

    .filter-main .tabs button.active {
        color: #FFFFFF;
        background: rgba(255,255,255,0.08);
    }

    /* 内容区域 */
    .filter-main .content {
        padding: 16px 24px;
        flex: 1; /* 填充剩余空间 */
        overflow-y: auto;
    }

    .filter-main .tab-pane {
        display: none;
    }

    .filter-main .tab-pane.active {
        display: block;
    }

    /* 输入组 */
    .filter-main .input-group {
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
    }

    .filter-main input[type="text"] {
        flex: 1;
        padding: 10px 14px;
        background: #3A3D41;
        border: 1px solid #4E5156;
        border-radius: 8px;
        color: #FFFFFF;
        font-size: 13px;
        transition: all 0.2s;
    }

    .filter-main input[type="text"]:focus {
        border-color: #0095FF;
        outline: none;
        box-shadow: 0 0 0 2px rgba(0,149,255,0.15);
    }

    /* 按钮样式 */
    .filter-main .add-btn,
    .filter-main .save-btn {
        padding: 9px 18px;
        background: #0095FF;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .filter-main .add-btn:hover,
    .filter-main .save-btn:hover {
        background: #007ACC;
        transform: translateY(-1px);
    }

    /* 列表项 */
    .filter-main .item-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
    }

    .filter-main .list-item {
        background: #3A3D41;
        padding: 6px 14px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
    }

    .filter-main .delete-btn {
        width: 18px;
        height: 18px;
        background: #FF5555;
        color: white !important;
        border: none;
        border-radius: 50%;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: transform 0.2s;
    }

    .filter-main .delete-btn:hover {
        transform: scale(1.1);
    }

    /* 设置项 */
/*     .filter-main [data-setting] {
        margin: 14px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13px;
    } */

    .filter-main [data-tab="settings"] label {
      display: inline-flex;
      line-height: 36px;
      width: 100%;
      align-items: center;
      margin-right: 20px;
      vertical-align: middle;
    }

    .filter-main [type="checkbox"],
    .filter-main [type="radio"] {
        margin: 0 6px 0 0;
        width: 16px;
        height: 16px;
        accent-color: #0095FF;
    }

    /* 底部区域 */
    .filter-main .footer {
        padding: 16px 24px;
        border-top: 1px solid #404040;
        flex-shrink: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .filter-main .save-status {
        color: #00C853;
        font-size: 12px;
        opacity: 0.9;
    }
`);


    class ContentFilter {
        static init(config) {
            const nativeOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function (method, url) {
                if (url.startsWith('//api.bilibili.com/x/polymer/web-dynamic/v1/feed/topic')) {
                    this.addEventListener('readystatechange', function () {
                        if (this.readyState === 4) {
                            try {
                                const response = JSON.parse(this.responseText);
                                if (response.code === 0) {
                                    response.data.topic_card_list.items =
                                        response.data.topic_card_list.items.filter(item =>
                                            ContentFilter.shouldKeep(item, config)
                                        );
                                    // 当前 xhr 对象上定义 responseText
                                    Object.defineProperty(this, "responseText", {
                                        writable: true,
                                    });
                                    Object.defineProperty(this, 'responseText', {
                                        value: JSON.stringify(response)
                                    });
                                }
                            } catch (e) { }
                        }
                    });
                }
                nativeOpen.apply(this, arguments);
            }
        }

        static shouldKeep(item, config) {
            const authorId = item.dynamic_card_item?.modules?.module_author?.mid?.toString() || '';
            const content = [
                item.dynamic_card_item?.modules?.module_dynamic?.major?.opus?.title || '',
                item.dynamic_card_item?.modules?.module_dynamic?.major?.opus?.summary?.text || '',
                item.dynamic_card_item?.modules?.module_dynamic?.desc?.text || ''
            ].join(' ').toLowerCase();

            if (config.cache.blocked.whitelist.has(authorId)) return true;
            if (config.cache.settings.userFilter && config.cache.blocked.users.has(authorId)) return false;
            if (config.cache.settings.keywordFilter &&
                [...config.cache.blocked.keywords].some(kw => content.includes(kw.toLowerCase()))) return false;
            return true;
        }
    }

    // 初始化系统
    const config = new ConfigManager();
    let filterUIInstance = null;

    GM_registerMenuCommand('打开过滤设置', () => {
        if (!filterUIInstance) {
            filterUIInstance = new FilterUI(config);
        }
        filterUIInstance.show();
    });

    ContentFilter.init(config);
})();