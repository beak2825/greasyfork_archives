// ==UserScript==
// @name         Prompt Manager
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  可分享版本：在AI网站上保存并快速使用 Prompts，已将示例中个人的两个 Prompt 内容清空
// @author       schweigen
// @match        https://chatgpt.com/*
// @match        https://claude.ai/*
// @match        https://chat.deepseek.com/*
// @match        https://www.perplexity.ai/*
// @match        https://chat.mistral.ai/*
// @match        https://app.nextchat.dev/*
// @match        https://chat01.ai/*
// @match        https://you.com/*
// @match        https://chatgpt.aicnm.cc/*
// @match        https://chatshare.xyz/*
// @match        https://chat.biggraph.net/*
// @match        https://grok.com/*
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533418/Prompt%20Manager.user.js
// @updateURL https://update.greasyfork.org/scripts/533418/Prompt%20Manager.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // === 用户可编辑的 Prompts 列表 ===
    const prompts = [
        {
            title: "极限思考",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "geoguesser网络谜踪",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "",
            content: ``
        },
        {
            title: "",
            content: ``
        },
    ];

    // 添加必要的样式
    GM_addStyle(`
        /* Prompt Manager 容器样式 */
        #prompt-manager {
            position: fixed !important;
            top: 80px !important;
            right: 20px !important;
            width: 350px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
            overflow-x: visible !important;
            background: #ffffff !important;
            border: 1px solid #e1e4e8 !important;
            border-radius: 12px !important;
            box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
            z-index: 2147483646 !important; /* 低于按钮，避免遮挡拖拽 */
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
            display: block !important;
            color: #24292e !important;
            opacity: 1 !important;
            visibility: visible !important;
        }

        #prompt-manager.hidden {
            display: none !important;
        }

        /* 标题样式 */
        #prompt-manager h2 {
            margin: 0 !important;
            padding: 16px !important;
            background: #2c3e50 !important;
            color: #ffffff !important;
            border-radius: 12px 12px 0 0 !important;
            text-align: center !important;
            font-size: 18px !important;
            font-weight: 600 !important;
            position: relative !important;
        }

        /* 关闭按钮样式（碰撞箱上移） */
        #close-prompt-btn {
            position: absolute !important;
            top: -10px !important; /* 向上移动显示区域 */
            right: 0 !important;
            padding: 10px 16px !important;
            cursor: pointer !important;
            font-size: 20px !important;
            color: #ffffff !important;
            user-select: none !important;
        }

        /* Prompt 项样式 */
        .prompt-item {
            border-bottom: 1px solid #e1e4e8 !important;
            padding: 12px 16px !important;
            position: relative !important;
            transition: all 0.2s ease !important;
            background: #ffffff !important;
        }

        .prompt-item:hover {
            background: #f6f8fa !important;
        }

        .prompt-title {
            font-weight: 500 !important;
            cursor: pointer !important;
            position: relative !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            color: #2c3e50 !important;
        }

        .prompt-content {
            display: none !important;
            margin-top: 8px !important;
            white-space: pre-wrap !important;
            background: #f8f9fa !important;
            padding: 12px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            transition: background 0.2s ease !important;
            color: #2c3e50 !important;
            border: 1px solid #e1e4e8 !important;
        }

        .prompt-content:hover {
            background: #edf2f7 !important;
        }

        /* 复制按钮样式 */
        .copy-button {
            background: #3498db !important;
            color: #ffffff !important;
            border: none !important;
            padding: 6px 12px !important;
            border-radius: 4px !important;
            cursor: pointer !important;
            font-size: 12px !important;
            margin-left: 10px !important;
            transition: all 0.2s ease !important;
        }

        .copy-button:hover {
            background: #2980b9 !important;
            transform: translateY(-1px) !important;
        }

        /* Toggle 按钮样式 */
        #toggle-prompt-btn {
            position: fixed !important;
            top: 60px !important;
            right: 20px !important;
            width: 40px !important;
            height: 40px !important;
            background: #3498db !important;
            color: #ffffff !important;
            border: none !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            font-size: 20px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            z-index: 2147483647 !important;
            transition: all 0.2s ease !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
            opacity: 1 !important;
            visibility: visible !important;
            touch-action: none !important; /* 避免触摸/触控板手势干扰拖拽 */
        }

        #toggle-prompt-btn:hover {
            background: #2980b9 !important;
            transform: translateY(-1px) !important;
        }

        /* 复制成功提示样式 */
        #copy-success {
            position: fixed !important;
            top: 100px !important;
            right: 20px !important;
            background: #2ecc71 !important;
            color: #ffffff !important;
            padding: 8px 16px !important;
            border-radius: 6px !important;
            opacity: 0 !important;
            transition: opacity 0.3s ease !important;
            z-index: 2147483647 !important;
            font-size: 14px !important;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
        }

        /* 内部成功提示样式 */
        .inner-success {
            background: #2ecc71 !important;
            color: #ffffff !important;
            padding: 8px 12px !important;
            margin-top: 8px !important;
            border-radius: 6px !important;
            text-align: center !important;
            font-size: 14px !important;
            display: none !important;
        }

        /* 搜索输入框样式 */
        #search-input {
            width: calc(100% - 32px) !important;
            padding: 10px 12px !important;
            margin: 16px !important;
            border: 1px solid #e1e4e8 !important;
            border-radius: 6px !重要;
            background: #f8f9fa !important;
            color: #2c3e50 !important;
            font-size: 14px !important;
            transition: all 0.2s ease !important;
        }

        #search-input:focus {
            outline: none !important;
            border-color: #3498db !important;
            box-shadow: 0 0 0 2px rgba(52,152,219,0.2) !important;
        }

        #search-input::placeholder {
            color: #95a5a6 !important;
        }
    `);

    // 确保DOM加载完成后再创建元素
    function createElements() {
        // 创建 Toggle 按钮
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'toggle-prompt-btn';
        toggleBtn.title = '隐藏/显示 Prompt Manager';
        toggleBtn.innerHTML = '&#9776;';
        document.body.appendChild(toggleBtn);

        // 如果用户之前拖动过，则恢复按钮保存的位置
        const savedX = GM_getValue('toggleBtnX', null);
        const savedY = GM_getValue('toggleBtnY', null);
        if (savedX !== null && savedY !== null) {
            toggleBtn.style.setProperty('left', savedX + 'px', 'important');
            toggleBtn.style.setProperty('top', savedY + 'px', 'important');
            toggleBtn.style.setProperty('right', 'auto', 'important');
        }

        // 创建 Prompt Manager 容器，增加了关闭叉号
        const manager = document.createElement('div');
        manager.id = 'prompt-manager';
        manager.classList.add('hidden'); // 默认隐藏
        manager.innerHTML = `
            <h2>
                Prompts
                <span id="close-prompt-btn" title="关闭">×</span>
            </h2>
            <input type="text" id="search-input" placeholder="搜索 Prompts...">
            <div id="prompt-list"></div>
        `;
        document.body.appendChild(manager);

        // 为关闭叉号添加点击事件
        const closeBtn = document.getElementById('close-prompt-btn');
        closeBtn.addEventListener('click', () => {
            manager.classList.add('hidden');
        });

        // 创建复制成功提示
        const copySuccess = document.createElement('div');
        copySuccess.id = 'copy-success';
        copySuccess.textContent = '复制成功';
        document.body.appendChild(copySuccess);

        // 创建一个 Prompt 项
        function createPromptItem(prompt, index) {
            const item = document.createElement('div');
            item.className = 'prompt-item';

            const title = document.createElement('div');
            title.className = 'prompt-title';

            const titleText = document.createElement('span');
            titleText.textContent = prompt.title || "无标题 Prompt";

            const copyTitleBtn = document.createElement('button');
            copyTitleBtn.className = 'copy-button';
            copyTitleBtn.textContent = '复制';
            copyTitleBtn.title = '复制整个 Prompt 内容';

            // 创建内部成功提示元素
            const innerSuccess = document.createElement('div');
            innerSuccess.className = 'inner-success';
            innerSuccess.textContent = '复制成功';
            innerSuccess.style.display = 'none';

            copyTitleBtn.onclick = (e) => {
                e.stopPropagation();
                if (prompt.content) {
                    copyToClipboard(prompt.content, item);
                } else {
                    showInnerSuccess(item, '内容为空，无法复制。');
                }
            };

            // 仅添加标题和复制按钮
            title.appendChild(titleText);
            title.appendChild(copyTitleBtn);

            const content = document.createElement('div');
            content.className = 'prompt-content';
            content.textContent = prompt.content || "无内容 Prompt";

            content.addEventListener('click', () => {
                if (prompt.content) {
                    copyToClipboard(prompt.content, item);
                } else {
                    showInnerSuccess(item, '内容为空，无法复制。');
                }
            });

            // 仅添加点击切换内容显示
            title.addEventListener('click', () => {
                const isVisible = content.style.display === 'block';
                content.style.display = isVisible ? 'none' : 'block';
            });

            item.appendChild(title);
            item.appendChild(content);
            item.appendChild(innerSuccess); // 添加内部成功提示

            return item;
        }

        // 渲染 Prompts 列表
        function renderPrompts(filter = '') {
            const promptList = document.getElementById('prompt-list');
            promptList.innerHTML = '';
            const filtered = prompts.filter(p =>
                (p.title && p.title.toLowerCase().includes(filter.toLowerCase())) ||
                (p.content && p.content.toLowerCase().includes(filter.toLowerCase()))
            );
            filtered.forEach((prompt, index) => {
                const item = createPromptItem(prompt, index);
                promptList.appendChild(item);
            });
        }

        // 复制到剪贴板并显示成功提示
        function copyToClipboard(text, promptItem) {
            navigator.clipboard.writeText(text).then(() => {
                showInnerSuccess(promptItem, '复制成功');
            }).catch(err => {
                console.error('复制失败: ', err);
                showInnerSuccess(promptItem, '复制失败，请手动复制。');
            });
        }

        // 显示成功提示并立即关闭面板
        function showInnerSuccess(promptItem, message = '复制成功') {
            // 直接关闭面板，不显示内部提示
            document.getElementById('prompt-manager').classList.add('hidden');

            // 在外部显示一个简短的提示
            showCopySuccess(message);
        }

        // 显示复制成功提示（保留旧函数以兼容）
        function showCopySuccess(message = '复制成功') {
            copySuccess.textContent = message;
            copySuccess.style.opacity = '1';
            setTimeout(() => {
                copySuccess.style.opacity = '0';
            }, 1500);
        }

        // ======= 以下为拖拽功能 =======
        let isDragging = false, justDragged = false, startX, startY, origLeft, origTop;

        // 阻止元素被浏览器当作可拖拽目标（避免原生拖拽干扰）
        toggleBtn.addEventListener('dragstart', (e) => e.preventDefault());

        toggleBtn.addEventListener('mousedown', function(e) {
            if (e.button !== 0) return; // 仅响应鼠标左键
            isDragging = false;
            startX = e.clientX;
            startY = e.clientY;
            // 获取当前按钮的位置（相对于视口）
            const rect = toggleBtn.getBoundingClientRect();
            origLeft = rect.left;
            origTop = rect.top;
            // 避免选中文本干扰拖拽
            e.preventDefault();
            document.body.style.setProperty('user-select', 'none', 'important');

            function onMouseMove(e) {
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                if (!isDragging) {
                    // 超过 5px 视为拖拽操作
                    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                        isDragging = true;
                    }
                }
                if (isDragging) {
                    // 计算并夹紧到视口内，避免拖出屏幕导致失联
                    const btnRect = toggleBtn.getBoundingClientRect();
                    const maxLeft = Math.max(0, window.innerWidth - btnRect.width);
                    const maxTop = Math.max(0, window.innerHeight - btnRect.height);
                    let targetLeft = origLeft + dx;
                    let targetTop = origTop + dy;
                    if (targetLeft < 0) targetLeft = 0;
                    if (targetTop < 0) targetTop = 0;
                    if (targetLeft > maxLeft) targetLeft = maxLeft;
                    if (targetTop > maxTop) targetTop = maxTop;

                    // 使用 setProperty 带上 'important' 以覆盖样式中的 !important
                    toggleBtn.style.setProperty('left', targetLeft + 'px', 'important');
                    toggleBtn.style.setProperty('top', targetTop + 'px', 'important');
                    toggleBtn.style.setProperty('right', 'auto', 'important');
                    e.preventDefault();
                }
            }

            function onMouseUp(e) {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                window.removeEventListener('blur', onMouseUp);
                document.body.style.removeProperty('user-select');
                if (isDragging) {
                    justDragged = true;
                    // 保存新位置
                    const newLeft = parseInt(toggleBtn.style.left, 10);
                    const newTop = parseInt(toggleBtn.style.top, 10);
                    GM_setValue('toggleBtnX', newLeft);
                    GM_setValue('toggleBtnY', newTop);
                }
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            window.addEventListener('blur', onMouseUp);
        });

        // 修改点击事件，避免拖拽后触发点击
        toggleBtn.addEventListener('click', (e) => {
            if (justDragged) {
                justDragged = false;
                return;
            }
            manager.classList.toggle('hidden');
        });

        // Toggle 按钮快捷键显示/隐藏 Prompt Manager (Ctrl/Command + O)
        document.addEventListener('keydown', (e) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const modifier = isMac ? e.metaKey : e.ctrlKey;

            if (modifier && e.key.toLowerCase() === 'o') {
                e.preventDefault();
                manager.classList.toggle('hidden');
            }
        });

        // 搜索 Prompts
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            renderPrompts(searchInput.value);
        });

        // 初始渲染
        renderPrompts();
    }

    // 确保DOM加载完成后再创建元素
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createElements);
    } else {
        createElements();
    }

    // 每隔一秒检查一次是否需要重新创建元素（用于处理某些网站的动态加载）
    let checkInterval = setInterval(() => {
        if (!document.getElementById('toggle-prompt-btn')) {
            createElements();
        }
    }, 1000);

    // 5分钟后停止检查，以避免无限循环
    setTimeout(() => {
        clearInterval(checkInterval);
    }, 300000); // 5分钟

    // ======= 添加油猴菜单命令，用于重置按钮默认位置 =======
    GM_registerMenuCommand("重置按钮默认位置", () => {
        GM_deleteValue('toggleBtnX');
        GM_deleteValue('toggleBtnY');
        const toggleBtn = document.getElementById('toggle-prompt-btn');
        if (toggleBtn) {
            toggleBtn.style.setProperty('top', '60px', 'important');
            toggleBtn.style.setProperty('right', '20px', 'important');
            toggleBtn.style.removeProperty('left');
        }
    });
})();
