// ==UserScript==
// @name         妖火论坛快捷回复插件2
// @namespace    https://*.yaohuo.me
// @version      1.0
// @description  在妖火论坛帖子页面右侧添加快捷回复按钮
// @author       GodPoplar
// @match        https://www.yaohuo.me/bbs-*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524015/%E5%A6%96%E7%81%AB%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B62.user.js
// @updateURL https://update.greasyfork.org/scripts/524015/%E5%A6%96%E7%81%AB%E8%AE%BA%E5%9D%9B%E5%BF%AB%E6%8D%B7%E5%9B%9E%E5%A4%8D%E6%8F%92%E4%BB%B62.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 首先定义快捷回复的内容
    const replies = ['感谢分享', '感谢','多谢分享','多谢!', '666','已阅','同问','一样','等等','带带','帮顶','不至于','不清楚','不知道','O(∩_∩)O哈哈~','交给楼上','对','吃','没了','ε=(´ο｀*)))唉'];

    // 然后是配置数据结构
    const defaultSettings = {
        requireConfirm: false,
        customReplies: replies.slice(), // 现在可以安全地使用 replies
    };

    // 获取保存的设置或使用默认设置
    let settings = JSON.parse(localStorage.getItem('yaohuo_reply_settings')) || defaultSettings;
    // 确保 settings 对象包含所有必要的属性
    settings = {
        ...defaultSettings,
        ...settings,
        // 确保 customReplies 存在，如果不存在就使用默认值
        customReplies: settings?.customReplies || defaultSettings.customReplies
    };

    // 创建设置面板函数
    function setMenu() {
        // 避免重复添加
        if (document.getElementById('yaohuo-modal-mask')) {
            return;
        }

        // 添加样式
        const style = `
            #yaohuo-modal-mask {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.6);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .yaohuo-wrap {
                background: white;
                border-radius: 8px;
                min-width: 300px;
                max-width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            }
            
            .yaohuo-wrap header {
                padding: 15px;
                font-size: 16px;
                font-weight: bold;
                border-bottom: 1px solid #eee;
                text-align: center;
                background: white;
            }
            
            .yaohuo-wrap .content {
                padding: 15px;
                background: white;
            }
            
            .yaohuo-wrap .reply-management {
                margin-top: 15px;
            }
            
            .yaohuo-wrap .reply-list {
                border: 1px solid #eee;
                padding: 10px;
                margin: 10px 0;
                border-radius: 4px;
            }
            
            .yaohuo-wrap .reply-item {
                margin-bottom: 8px;
            }
            
            .yaohuo-wrap .reply-item input {
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            
            .yaohuo-wrap .reply-item button {
                padding: 5px 10px;
                background: #ff4444;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .yaohuo-wrap #add-reply {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 8px 15px;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .yaohuo-wrap footer {
                padding: 15px;
                text-align: center;
                border-top: 1px solid #eee;
                background: white;
            }

            /* 开关按钮样式 */
            .switch {
                position: relative;
                display: inline-block;
                width: 50px;
                height: 24px;
            }

            .switch input {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .slider {
                position: absolute;
                cursor: pointer;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: #ccc;
                transition: .4s;
                border-radius: 24px;
            }

            .slider:before {
                position: absolute;
                content: "";
                height: 16px;
                width: 16px;
                left: 4px;
                bottom: 4px;
                background-color: white;
                transition: .4s;
                border-radius: 50%;
            }

            input:checked + .slider {
                background-color: #2196F3;
            }

            input:checked + .slider:before {
                transform: translateX(26px);
            }

            /* 设置项样式 */
            .setting-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
                padding: 10px;
                background: #f5f5f5;
                border-radius: 4px;
            }

            .setting-item span {
                font-size: 14px;
            }
        `;

        // 确保样式被正确添加
        const styleEl = document.createElement('style');
        styleEl.textContent = style;
        document.head.appendChild(styleEl);

        // 在创建模态框之前，确保先移除可能存在的旧模态框
        const oldModal = document.getElementById('yaohuo-modal-mask');
        if (oldModal) {
            oldModal.remove();
        }

        // 确保在使用 map 之前检查 customReplies 是否存在
        const replyListHTML = (settings.customReplies || []).map((reply, index) => `
            <div class="reply-item" style="display: flex; margin-bottom: 8px;">
                <input type="text" value="${reply}" style="flex: 1; margin-right: 8px;">
                <button class="delete-reply" data-index="${index}">删除</button>
            </div>
        `).join('');

        const modalHTML = `
            <div id="yaohuo-modal-mask">
                <div class="yaohuo-wrap">
                    <header>🔥快捷回复🔥插件设置</header>
                    <div class="content">
                        <div class="setting-item">
                            <span>发送前确认</span>
                            <label class="switch">
                                <input type="checkbox" id="requireConfirm" ${settings.requireConfirm ? 'checked' : ''}>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <div class="reply-management">
                            <h3>回复词管理</h3>
                            <div class="reply-list" style="max-height: 300px; overflow-y: auto;">
                                ${replyListHTML}
                            </div>
                            <button id="add-reply" style="margin-top: 10px;">添加回复词</button>
                        </div>
                    </div>
                    <footer>
                        <button class="cancel-btn">取消</button>
                        <button class="ok-btn">确认</button>
                    </footer>
                </div>
            </div>
        `;

        // 添加到页面 - 使用原生 JS
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // 获取必要的元素
        const modal = document.getElementById('yaohuo-modal-mask');
        const addReplyBtn = modal.querySelector('#add-reply');
        const replyList = modal.querySelector('.reply-list');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const okBtn = modal.querySelector('.ok-btn');
        const requireConfirmCheckbox = modal.querySelector('#requireConfirm');

        // 确保所有事件监听器都被正确添加
        if (addReplyBtn) {
            addReplyBtn.addEventListener('click', () => {
                const newReplyItem = document.createElement('div');
                newReplyItem.className = 'reply-item';
                newReplyItem.style.display = 'flex';
                newReplyItem.style.marginBottom = '8px';
                newReplyItem.innerHTML = `
                    <input type="text" value="" style="flex: 1; margin-right: 8px;">
                    <button class="delete-reply">删除</button>
                `;
                replyList.appendChild(newReplyItem);
            });
        }

        // 取消按钮
        cancelBtn.addEventListener('click', () => {
            modal.remove();
        });

        // 确认按钮
        okBtn.addEventListener('click', () => {
            settings.requireConfirm = requireConfirmCheckbox.checked;
            
            // 获取所有回复词
            const replyInputs = modal.querySelectorAll('.reply-item input');
            settings.customReplies = Array.from(replyInputs)
                .map(input => input.value.trim())
                .filter(reply => reply !== '');
            
            localStorage.setItem('yaohuo_reply_settings', JSON.stringify(settings));
            modal.remove();
            alert('设置已保存');
            
            // 更新快捷回复按钮
            updateReplyButtons();
        });

        // 点击遮罩层关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // 删除回复词
        replyList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-reply')) {
                e.target.closest('.reply-item').remove();
            }
        });
    }

    // 检查当前页面是否有 class="retextarea" 的元素
    const retextareaElement = document.querySelector('.retextarea');
    if (!retextareaElement) return;

    // 优化按钮样式定义 - 将重复的样式抽取出来
    const buttonStyles = {
        common: `
            margin: 5px;
            padding: 5px 10px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            transition: background-color 0.2s;
        `,
        hover: `
            background-color: #0056b3;
        `
    };

    // 添加样式到页面
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        .quick-reply-btn {${buttonStyles.common}}
        .quick-reply-btn:hover {${buttonStyles.hover}}
    `;
    document.head.appendChild(styleSheet);

    // 优化按钮创建函数
    function createReplyButton(reply) {
        const button = document.createElement('button');
        button.textContent = reply;
        button.className = 'quick-reply-btn';
        button.style.cssText = buttonStyles.common;
        
        button.addEventListener('click', () => {
            const sendReply = () => {
                retextareaElement.value = reply;
                const submitButton = document.querySelector('input[type="submit"]');
                submitButton?.click() || alert('未找到提交按钮');
            };

            (!settings.requireConfirm || confirm(`确定要发送回复："${reply}"？`)) && sendReply();
        });

        return button;
    }

    // 优化更新按钮函数
    function updateReplyButtons() {
        const contentWrapper = buttonContainer.querySelector('div');
        if (!contentWrapper) return;
        
        contentWrapper.innerHTML = '';
        (settings.customReplies || []).forEach(reply => {
            contentWrapper.appendChild(createReplyButton(reply));
        });
    }

    // 创建内嵌按钮和配置按钮
    const inlineButton = document.createElement('a');
    inlineButton.textContent = '快速回复';
    inlineButton.href = 'javascript:void(0);';
    
    const configButton = document.createElement('a');
    configButton.textContent = '快捷回复配置';
    configButton.href = 'javascript:void(0);';
    
    // 找到"设置"链接并复制其样式
    const settingLink = Array.from(document.querySelectorAll('a')).find(link => link.textContent === '设置');
    if (settingLink && settingLink.parentElement) {
        // 复制设置链接的样式到两个按钮
        const computedStyle = window.getComputedStyle(settingLink);
        [inlineButton, configButton].forEach(button => {
            button.style.cssText = computedStyle.cssText;
            button.style.marginLeft = computedStyle.marginLeft;
            button.style.marginRight = computedStyle.marginRight;
        });
        
        // 添加到同一个容器中
        settingLink.parentElement.appendChild(inlineButton);
        settingLink.parentElement.appendChild(configButton);
    }

    // 创建简化版的按钮容器（移除标题栏）
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'quick-reply-container';
    buttonContainer.style.width = '300px';
    buttonContainer.style.position = 'fixed';
    buttonContainer.style.top = '0';
    buttonContainer.style.right = '0';
    buttonContainer.style.zIndex = '9999';
    buttonContainer.style.backgroundColor = '#f9f9f9';
    buttonContainer.style.border = '1px solid #ccc';
    buttonContainer.style.padding = '10px';
    buttonContainer.style.borderRadius = '5px';
    buttonContainer.style.maxHeight = '400px';
    buttonContainer.style.overflowY = 'auto';
    buttonContainer.style.overflowX = 'hidden';
    
    // 从 localStorage 读取面板状态
    const isPanelVisible = localStorage.getItem('yaohuo_panel_visible') === 'true';
    buttonContainer.style.display = isPanelVisible ? 'block' : 'none';

    // 创建按钮容器的内容包装器
    const contentWrapper = document.createElement('div');
    buttonContainer.appendChild(contentWrapper);

    // 点击快速回复按钮显示/隐藏面板
    inlineButton.addEventListener('click', (e) => {
        e.stopPropagation();
        const newDisplay = buttonContainer.style.display === 'none' ? 'block' : 'none';
        buttonContainer.style.display = newDisplay;
        // 保存面板状态到 localStorage
        localStorage.setItem('yaohuo_panel_visible', newDisplay === 'block');
    });

    // 点击配置按钮打开设置面板
    configButton.addEventListener('click', () => {
        setMenu();
    });

    // 确保按钮容器被添加到页面
    document.body.appendChild(buttonContainer);
    
    // 初始化快捷回复按钮
    updateReplyButtons();
})();
