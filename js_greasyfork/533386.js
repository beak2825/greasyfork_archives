// ==UserScript==
// @name            发送到 Memos
// @name:en         Send to Memos
// @namespace       https://github.com/hu3rror/my-userscript
// @version         2.6.0
// @description     将选中的链接或文本发送到 Memos，支持配置、添加源页面信息和快速发送按钮
// @description:en  Send selected links or text to Memos, supports configuration, adding source page information, and quick send buttons
// @author          Hu3rror
// @match           *://*/*
// @grant           GM_xmlhttpRequest
// @grant           GM_registerMenuCommand
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_addStyle
// @license         MIT
// @homepageURL   https://github.com/hu3rror/my-userscript
// @supportURL   https://github.com/hu3rror/my-userscript/issues
// @downloadURL https://update.greasyfork.org/scripts/533386/%E5%8F%91%E9%80%81%E5%88%B0%20Memos.user.js
// @updateURL https://update.greasyfork.org/scripts/533386/%E5%8F%91%E9%80%81%E5%88%B0%20Memos.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 获取保存的配置或使用默认值
    const MEMOS_API_URL = GM_getValue('MEMOS_API_URL', '');
    const API_TOKEN = GM_getValue('API_TOKEN', '');
    let isConfigured = MEMOS_API_URL && API_TOKEN;

    // 检测系统颜色主题
    function isDarkMode() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // 添加样式（包含优化后的暗黑模式）
    GM_addStyle(`
        #memos-float-button {
            position: fixed;
            width: 36px;
            height: 36px;
            background-color: rgba(76, 175, 80, 0.7);
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 36px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 1px 1px 3px rgba(0,0,0,0.2);
            z-index: 9999;
            user-select: none;
            display: none; /* 初始状态隐藏 */
            align-items: center;
            justify-content: center;
            right: 20px;
            bottom: 20px;
            transition: all 0.3s ease;
        }
        #memos-float-button:hover {
            background-color: rgba(69, 160, 73, 0.9);
            opacity: 1;
        }
        .memos-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .memos-modal-content {
            padding: 20px;
            border-radius: 8px;
            width: 400px;
            max-width: 90%;
            transition: all 0.3s ease;
        }
        .memos-modal-content.light-mode {
            background-color: white;
            color: #333;
        }
        .memos-modal-content.dark-mode {
            background-color: #1e1e1e;
            color: #e0e0e0;
        }
        .memos-modal h2 {
            margin-top: 0;
        }
        .memos-form-group {
            margin-bottom: 15px;
        }
        .memos-form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
        }
        .memos-form-group input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            transition: all 0.3s ease;
        }
        .memos-modal-content.light-mode .memos-form-group input {
            background-color: white;
            border-color: #ddd;
            color: #333;
        }
        .memos-modal-content.dark-mode .memos-form-group input {
            background-color: #2d2d2d;
            border-color: #3d3d3d;
            color: #e0e0e0;
        }
        .memos-button {
            padding: 8px 16px;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 10px;
            transition: all 0.3s ease;
        }
        .memos-button.save {
            background-color: #4caf50;
        }
        .memos-button.cancel {
            background-color: #f44336;
        }
        .memos-button:hover {
            opacity: 0.9;
        }
        .memos-buttons {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }

        /* 优化后的暗黑模式按钮样式 */
        .dark-mode #memos-float-button {
            background-color: rgba(60, 70, 60, 0.5); /* 更暗、更柔和的绿色 */
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }
        .dark-mode #memos-float-button:hover {
            background-color: rgba(70, 80, 70, 0.7); /* 悬停时略微变亮 */
        }

        /* 暗黑模式下的模态框按钮 */
        .memos-modal-content.dark-mode .memos-button.save {
            background-color: #3a7d3f; /* 更暗的绿色 */
        }
        .memos-modal-content.dark-mode .memos-button.cancel {
            background-color: #c53929; /* 更暗的红色 */
        }
    `);

    // 创建自动关闭的通知
    function showNotification(message, isError = false) {
        const notification = document.createElement('div');
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.padding = '10px 20px';
        notification.style.backgroundColor = isError ? '#f44336' : '#4caf50';
        notification.style.color = 'white';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '9999';
        notification.style.opacity = '0.9';
        notification.style.transition = 'opacity 0.2s ease';
        notification.textContent = message;

        document.body.appendChild(notification);

        // 1.5秒后淡出并移除
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.remove();
            }, 500); // 等待淡出动画完成
        }, 1500);
    }

    // 获取选中文本
    function getSelectedText() {
        return window.getSelection().toString().trim();
    }

    // 获取当前页面信息，以 Markdown 格式
    function getPageInfo() {
        const pageTitle = document.title || '无标题页面';
        const pageUrl = window.location.href;
        return `\n\n---\n**来源**：[${pageTitle}](${pageUrl})`;
    }

    // 发送内容到 Memos 的函数
    function sendToMemos(content) {
        if (!isConfigured) {
            showNotification('请先配置 Memos API URL 和 Token', true);
            showConfigModal();
            return;
        }

        // 添加页面来源信息
        content += getPageInfo();

        GM_xmlhttpRequest({
            method: 'POST',
            url: MEMOS_API_URL,
            headers: {
                'Authorization': `Bearer ${API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                content: content,
                visibility: 'PRIVATE' // 可选：'PUBLIC', 'PROTECTED', 'PRIVATE'
            }),
            onload: function(response) {
                if (response.status === 200 || response.status === 201) {
                    showNotification('成功发送到 Memos！');
                } else {
                    showNotification(`发送到 Memos 失败。状态码: ${response.status}\n可能端点错误，建议尝试 /api/v1/memo 或 /api/memos。`, true);
                }
            },
            onerror: function(error) {
                showNotification('发送到 Memos 时出错: ' + error, true);
            }
        });
    }

    // 存储当前右键点击的链接
    let currentLink = null;

    // 监听右键点击事件，捕获链接
    document.addEventListener('contextmenu', function(event) {
        currentLink = event.target.closest('a');
    }, false);

    // 注册菜单命令
    GM_registerMenuCommand('发送选中内容到 Memos', function() {
        handleSendAction();
    });

    GM_registerMenuCommand('配置 Memos API', function() {
        showConfigModal();
    });

    // 处理发送动作
    function handleSendAction() {
        const selectedText = getSelectedText();
        if (selectedText) {
            // 如果有选中文本，发送选中文本
            sendToMemos(selectedText);
        } else if (currentLink && currentLink.href) {
            // 如果没有选中文本但有链接，发送链接
            const linkText = currentLink.textContent.trim() || '无文本';
            const linkUrl = currentLink.href;
            const content = `${linkText}\n${linkUrl}`;
            sendToMemos(content);
        } else {
            showNotification('请先选择文本或右键点击链接', true);
        }
    }

    // 清理 currentLink，防止重复使用
    document.addEventListener('click', function() {
        currentLink = null;
    }, false);

    // 创建配置模态框
    function showConfigModal() {
        // 创建模态框容器
        const modal = document.createElement('div');
        modal.className = 'memos-modal';

        // 创建模态框内容
        const modalContent = document.createElement('div');
        modalContent.className = `memos-modal-content ${isDarkMode() ? 'dark-mode' : 'light-mode'}`;

        modalContent.innerHTML = `
            <h2>配置 Memos API</h2>
            <div class="memos-form-group">
                <label for="memos-api-url">API URL:</label>
                <input type="text" id="memos-api-url" placeholder="例如：https://example.com/api/v1/memos" value="${MEMOS_API_URL}">
                <small style="color:#666;display:block;margin-top:5px;">注意：保留 /api/v1/memos 路径</small>
            </div>
            <div class="memos-form-group">
                <label for="memos-api-token">API Token:</label>
                <input type="password" id="memos-api-token" placeholder="输入您的 API Token" value="${API_TOKEN}">
            </div>
            <div class="memos-buttons">
                <button class="memos-button cancel">取消</button>
                <button class="memos-button save">保存</button>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // 监听系统颜色模式变化
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleColorSchemeChange = (e) => {
            modalContent.className = `memos-modal-content ${e.matches ? 'dark-mode' : 'light-mode'}`;
        };
        colorSchemeQuery.addEventListener('change', handleColorSchemeChange);

        // 添加事件监听器
        const cancelButton = modalContent.querySelector('.memos-button.cancel');
        const saveButton = modalContent.querySelector('.memos-button.save');

        cancelButton.addEventListener('click', function() {
            colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
            modal.remove();
        });

        saveButton.addEventListener('click', function() {
            const apiUrl = document.getElementById('memos-api-url').value.trim();
            const apiToken = document.getElementById('memos-api-token').value.trim();

            if (!apiUrl || !apiToken) {
                showNotification('API URL 和 Token 不能为空', true);
                return;
            }

            GM_setValue('MEMOS_API_URL', apiUrl);
            GM_setValue('API_TOKEN', apiToken);
            isConfigured = true;

            showNotification('配置已保存');
            colorSchemeQuery.removeEventListener('change', handleColorSchemeChange);
            modal.remove();

            // 检查并创建浮动按钮（仅当配置完成时）
            updateFloatButton();
        });
    }

    // 创建浮动按钮
    function createFloatButton() {
        // 如果已存在，不再创建
        if (document.getElementById('memos-float-button')) {
            return;
        }
        const floatButton = document.createElement('div');
        floatButton.id = 'memos-float-button';
        floatButton.textContent = 'M';
        floatButton.title = '发送到 Memos';
        document.body.appendChild(floatButton);
        // 应用保存的位置
        const savedPosition = GM_getValue('MEMOS_BUTTON_POSITION', null);
        if (savedPosition) {
            floatButton.style.left = savedPosition.left + 'px';
            floatButton.style.top = savedPosition.top + 'px';
            floatButton.style.right = 'auto';
            floatButton.style.bottom = 'auto';
        }
        // 添加点击事件
        floatButton.addEventListener('click', function(e) {
            if (!floatButton.isDragging) {
                handleSendAction();
            }
        });
        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        floatButton.addEventListener('mousedown', function(e) {
            isDragging = true;
            floatButton.isDragging = true; // 添加一个标志
            offsetX = e.clientX - floatButton.getBoundingClientRect().left;
            offsetY = e.clientY - floatButton.getBoundingClientRect().top;
            e.preventDefault(); // 防止选中文本
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                // 确保按钮不会超出视口
                const maxX = window.innerWidth - floatButton.offsetWidth;
                const maxY = window.innerHeight - floatButton.offsetHeight;
                floatButton.style.left = Math.min(Math.max(0, x), maxX) + 'px';
                floatButton.style.right = 'auto';
                floatButton.style.top = Math.min(Math.max(0, y), maxY) + 'px';
                floatButton.style.bottom = 'auto';
            }
        });
        document.addEventListener('mouseup', function() {
            if (isDragging) {
                // 保存按钮位置
                GM_setValue('MEMOS_BUTTON_POSITION', {
                    left: parseInt(floatButton.style.left, 10) || 0,
                    top: parseInt(floatButton.style.top, 10) || 0
                });
                isDragging = false;
            }
            floatButton.isDragging = false; // 拖动结束，重置标志
        });
        // 监听系统颜色模式变化并更新按钮样式
        const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const updateButtonStyle = (e) => {
            if (e.matches) {
                document.body.classList.add('dark-mode');
            } else {
                document.body.classList.remove('dark-mode');
            }
        };

        // 初始设置
        updateButtonStyle(colorSchemeQuery);
        colorSchemeQuery.addEventListener('change', updateButtonStyle);
    }

    // 更新浮动按钮 - 仅当配置完成时显示
    function updateFloatButton() {
        if (isConfigured) {
            createFloatButton();
        } else {
            const existingButton = document.getElementById('memos-float-button');
            if (existingButton) {
                existingButton.remove();
            }
        }
    }

    // 监听选中文本事件
    document.addEventListener('mouseup', function() {
        const selectedText = getSelectedText();
        const floatButton = document.getElementById('memos-float-button');

        if (selectedText && isConfigured) {
            // 如果有选中文本且已配置，显示按钮
            if (!floatButton) {
                createFloatButton(); // 如果按钮不存在则创建
            }
            floatButton.style.display = 'flex';
        } else {
            // 如果没有选中文本或未配置，隐藏按钮
            if (floatButton) {
                floatButton.style.display = 'none';
            }
        }
    });

    // 初始化 - 不自动弹出配置窗口，只检查是否已配置并决定是否显示浮动按钮
    function init() {
        // 首次加载时，检查是否有选中文本，并决定是否显示按钮
        const selectedText = getSelectedText();
        if (selectedText && isConfigured) {
            createFloatButton();
            const floatButton = document.getElementById('memos-float-button');
            if(floatButton){
                 floatButton.style.display = 'flex';
            }

        }
    }

    // 在页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
