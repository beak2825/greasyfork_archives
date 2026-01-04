// ==UserScript==
// @name         拖拽打开链接
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拖拽链接时在新标签页打开
// @license MIT
// @icon         data:image/jpg;base64,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
// @author       zm
// @match        http://*/*
// @match        https://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/536590/%E6%8B%96%E6%8B%BD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/536590/%E6%8B%96%E6%8B%BD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // 全局变量保存当前菜单标题
    let currentMenuTitle = null;
    let refreshTimeout = null;
    
    // 初始化配置项（首次运行时创建）
    const DEFAULT_CONFIG = {
        openInNewTab: false // 默认不启用新标签页打开
    };

    // 配置管理器
    const ConfigManager = {
        async init() {
            const savedConfig = await GM_getValue('drag_open_config');
            this.config = savedConfig ? JSON.parse(savedConfig) : {...DEFAULT_CONFIG};
        },
        async set(key, value) {
            this.config[key] = value;
            await GM_setValue('drag_open_config', JSON.stringify(this.config));
        },
        get(key) {
            return this.config[key];
        }
    };

    // 初始化配置
    await ConfigManager.init();

    // 注册菜单命令
    registerConfigMenu(ConfigManager);

    // 添加状态提示
    function showStatusNotification(enabled) {
        const msg = enabled ? '✅ 已启用：拖拽链接将在新标签打开' : '❌ 已禁用：拖拽链接不会在新标签打开';
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            right: 30px;
            bottom: 30px;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            z-index: 99999;
            font-family: sans-serif;
            transition: opacity 0.5s ease-out;
        `;
        toast.textContent = msg;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    }

    // 菜单注册函数
    function registerConfigMenu(configManager) {
        const newTitle = `拖拽链接新标签页: ${configManager.get('openInNewTab') ? '✅ 启用' : '❌ 禁用'}`;
        
        if (currentMenuTitle === newTitle) return; // 完全相同直接返回

        // 防抖 300ms 避免连续快速调用
        // 清除之前的防抖定时器
        if (refreshTimeout) clearTimeout(refreshTimeout);
        // 设置新的防抖定时器，避免频繁刷新菜单
        refreshTimeout = setTimeout(async () => {
            try {
                // 如果已有菜单项，先注销
                if (currentMenuTitle) {
                    await GM_unregisterMenuCommand(currentMenuTitle);
                }
                // 注册新的菜单项，并在回调中处理点击逻辑
                await GM_registerMenuCommand(newTitle, async () => {
                    const newValue = !configManager.get('openInNewTab');
                    await configManager.set('openInNewTab', newValue);
                    showStatusNotification(newValue); // 显示状态提示
                    registerConfigMenu(configManager); // 递归刷新菜单
                });

                currentMenuTitle = newTitle;
            } catch (e) {
                console.error('菜单刷新失败:', e);
            }
        }, 300);

    }


    // 监听拖拽开始事件
    document.addEventListener('dragstart', function(e) {
         // 1. 阻止所有图片的拖拽事件（含链接包裹的图片）
        // if (e.target.tagName === 'IMG' || e.target.closest('a img')) {
        //     e.preventDefault();// 阻止默认拖拽行为
        //     e.stopImmediatePropagation();// 阻止其他监听器
        //     return;
        // }

        // 2. 保留文字链接的拖拽高亮功能
        if (e.target.tagName === 'A' && e.target.href) {
            // 添加高亮样式
            e.target.style.border = '2px dashed orange';
            e.target.style.padding = '2px';
            
            // 清除拖拽数据中的图片信息（防止Lens识别）
            e.dataTransfer.setData('text/plain', e.target.href);
        }
    },true);

    // 监听拖拽结束事件
    document.addEventListener('dragend', function(e) {
        // 移除高亮样式
        if (e.target.tagName === 'A' && e.target.href) {
            e.target.style.border = '';
            e.target.style.padding = '';
        }
    });

    // 监听拖拽释放事件（可选）
    document.addEventListener('drop', function(e) {
        e.preventDefault();
        // 仅允许纯文本链接释放
        const link = e.dataTransfer.getData('text/plain');
        if (link && isValidUrl(link.trim()) && ConfigManager.get('openInNewTab')) {
            window.open(link, '_blank');
        }

    });
    
    function isValidUrl(url) {
        try {
            // 自动补全缺少协议的URL（如 example.com => http://example.com）
            const fullUrl = url.includes('://') ? url : 'http://' + url;
            const parsed = new URL(fullUrl);
            return ['http:', 'https:'].includes(parsed.protocol);
        } catch (e) {
            return false;
        }
    }

    // 防止默认拖拽行为（必须启用），因为浏览器默认会阻止 drop 事件的触发，从而导致拖拽效果无效。
    document.addEventListener('dragover', function(e) {
        e.preventDefault();
    });

})();

