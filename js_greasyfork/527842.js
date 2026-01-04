// ==UserScript==
// @name         1Panel 增强
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  1Panel 功能增强
// @author       yuyan
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527842/1Panel%20%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/527842/1Panel%20%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置项
    const CONFIG = {
        panelUrls: GM_getValue('panelUrls', []) // 存储用户配置的面板地址数组
    };

    // 检查当前页面是否匹配配置的地址
    function isMatchingUrl() {
        if (!CONFIG.panelUrls.length) return false;
        const currentUrl = window.location.host; // 获取当前域名+端口
        return CONFIG.panelUrls.some(url => currentUrl.includes(url));
    }

    // 添加样式
    GM_addStyle(`
        .panel-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9998;
            display: none;
        }

        .settings-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            z-index: 9999;
            min-width: 400px;
            max-width: 600px;
            display: none;
        }

        .settings-panel h2 {
            margin: 0 0 20px 0;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .settings-content {
            max-height: 400px;
            overflow-y: auto;
            padding-right: 10px;
        }

        .menu-item-control {
            margin-bottom: 10px;
            display: flex;
            align-items: center;
        }

        .menu-item-control input[type="checkbox"] {
            margin-right: 10px;
        }

        .panel-buttons {
            margin-top: 20px;
            text-align: right;
            border-top: 1px solid #eee;
            padding-top: 15px;
        }

        .panel-button {
            padding: 8px 15px;
            margin-left: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }

        .save-button {
            background: #409EFF;
            color: white;
        }

        .cancel-button {
            background: #909399;
            color: white;
        }

        .url-config {
            margin-bottom: 20px;
            padding: 15px;
            background: #f5f7fa;
            border-radius: 4px;
        }

        .url-item {
            display: flex;
            gap: 10px;
            margin-bottom: 10px;
        }

        .url-input {
            flex: 1;
            padding: 8px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
        }

        .remove-url {
            background: #f56c6c;
            color: white;
        }

        .add-url {
            background: #67c23a;
            color: white;
            width: 100%;
        }

        .url-config p {
            margin: 5px 0;
            color: #909399;
            font-size: 12px;
        }
    `);

    // 等待菜单元素加载
    function waitForMenu() {
        return new Promise(resolve => {
            const checkExist = setInterval(() => {
                const menu = document.querySelector('.el-menu--vertical');
                if (menu) {
                    clearInterval(checkExist);
                    resolve(menu);
                }
            }, 100);
        });
    }

    // 获取菜单项文本
    function getMenuItemText(element) {
        const span = element.querySelector('span');
        return span ? span.textContent.trim() : '';
    }

    // 创建菜单项控制
    function createMenuItemControl(text, isVisible) {
        const div = document.createElement('div');
        div.className = 'menu-item-control';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isVisible;
        checkbox.dataset.menuItem = text;

        const label = document.createElement('label');
        label.textContent = text;

        div.appendChild(checkbox);
        div.appendChild(label);

        return div;
    }

    // 创建URL配置面板
    function createUrlConfigPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';

        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <h2>1Panel地址配置</h2>
            <div class="url-config">
                <div id="urlList">
                    ${CONFIG.panelUrls.map((url, index) => `
                        <div class="url-item">
                            <input type="text" class="url-input" value="${url}">
                            <button class="panel-button remove-url" data-index="${index}">删除</button>
                        </div>
                    `).join('')}
                </div>
                <button class="panel-button add-url" style="margin-top: 10px;">添加地址</button>
                <p>支持的格式:</p>
                <p>- 域名: panel.yourdomain.com</p>
                <p>- 域名带端口: panel.yourdomain.com:8888</p>
                <p>- IP: 192.168.1.100</p>
                <p>- IP带端口: 192.168.1.100:29758</p>
            </div>
            <div class="panel-buttons">
                <button class="panel-button cancel-button">取消</button>
                <button class="panel-button save-button">保存</button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);
        overlay.style.display = 'block';
        panel.style.display = 'block';

        // 添加地址按钮事件
        panel.querySelector('.add-url').addEventListener('click', () => {
            const urlList = panel.querySelector('#urlList');
            const newUrlItem = document.createElement('div');
            newUrlItem.className = 'url-item';
            newUrlItem.innerHTML = `
                <input type="text" class="url-input" value="">
                <button class="panel-button remove-url">删除</button>
            `;
            urlList.appendChild(newUrlItem);

            // 为新添加的删除按钮绑定事件
            newUrlItem.querySelector('.remove-url').addEventListener('click', function() {
                newUrlItem.remove();
            });
        });

        // 为现有的删除按钮绑定事件
        panel.querySelectorAll('.remove-url').forEach(button => {
            button.addEventListener('click', function() {
                this.closest('.url-item').remove();
            });
        });

        // 保存按钮事件
        panel.querySelector('.save-button').addEventListener('click', () => {
            const urls = Array.from(panel.querySelectorAll('.url-input'))
                .map(input => input.value.trim())
                .filter(url => url !== ''); // 过滤空值

            GM_setValue('panelUrls', urls);
            CONFIG.panelUrls = urls;
            overlay.remove();
            alert('配置已保存，请刷新页面使配置生效');
        });

        // 取消按钮事件
        panel.querySelector('.cancel-button').addEventListener('click', () => {
            overlay.remove();
        });

        // 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });

        return { overlay, panel };
    }

    // 创建设置面板HTML
    function createSettingsPanel() {
        const overlay = document.createElement('div');
        overlay.className = 'panel-overlay';

        const panel = document.createElement('div');
        panel.className = 'settings-panel';
        panel.innerHTML = `
            <h2>菜单显示设置</h2>
            <div class="settings-content"></div>
            <div class="panel-buttons">
                <button class="panel-button cancel-button">取消</button>
                <button class="panel-button save-button">保存</button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        return { overlay, panel };
    }

    // 渲染设置面板内容
    async function renderSettings() {
        const menu = await waitForMenu();
        const settingsContent = document.querySelector('.settings-content');
        settingsContent.innerHTML = '';

        const menuItems = menu.querySelectorAll('li');
        menuItems.forEach(item => {
            const text = getMenuItemText(item);
            if (text) {
                const saved = GM_getValue(text);
                const isVisible = saved === undefined ? true : saved;
                const control = createMenuItemControl(text, isVisible);
                settingsContent.appendChild(control);
            }
        });
    }

    // 应用设置
    async function applySettings() {
        const menu = await waitForMenu();
        const menuItems = menu.querySelectorAll('li');

        menuItems.forEach(item => {
            const text = getMenuItemText(item);
            if (text) {
                const isVisible = GM_getValue(text, true);
                item.style.display = isVisible ? '' : 'none';
            }
        });
    }

    // 保存设置
    function saveSettings() {
        const controls = document.querySelectorAll('.menu-item-control input');
        controls.forEach(checkbox => {
            const text = checkbox.dataset.menuItem;
            GM_setValue(text, checkbox.checked);
        });
        applySettings();
    }

    // 显示设置面板
    function showSettingsPanel() {
        const { overlay, panel } = createSettingsPanel();
        overlay.style.display = 'block';
        panel.style.display = 'block';
        renderSettings();

        // 注册事件处理
        panel.querySelector('.save-button').addEventListener('click', () => {
            saveSettings();
            overlay.remove();
        });

        panel.querySelector('.cancel-button').addEventListener('click', () => {
            overlay.remove();
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        });
    }

    // 初始化
    function init() {
        // 注册URL配置菜单
        GM_registerMenuCommand('⚙️ 配置1Panel地址', createUrlConfigPanel);

        // 只在匹配的URL下执行面板功能
        if (isMatchingUrl()) {
            // 注册菜单命令
            GM_registerMenuCommand('📋 菜单显示设置', showSettingsPanel);

            // 应用已保存的设置
            applySettings();
        }
    }

    // 启动脚本
    init();
})();
