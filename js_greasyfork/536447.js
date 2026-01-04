// ==UserScript==
// @name         Link AI Chat Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add custom chat functionality to Link AI console
// @author       You
// @match        https://link-ai.tech/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAMAAADVRocKAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAS1BMVEX////ycnLyampuu25muGby8nLy8mrl5eXk5OT8DAz8/AzPz8/z8zONvY3Nzc3d3d3b29v/AAAMnAwAmQD//wDMzMz19SmIu4j///+ks1oiAAAAEXRSTlMAwMfg5cDHgIj+/vD7/v7AxxKKtKIAAAABYktHRACIBR1IAAAACW9GRnMAAAEtAAABagBZv0KIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAAB3RJTUUH4gERCw82Bupv1AAAAAl2cEFnAAADGgAABGMAz64W0QAAAItJREFUaN7t2UkKgEAQBEF13Pfd///UQ4n0YQRBBIXMYzEaD+ggIPpZYaRCO7pYObMlqUrswyxX2TVQDKqw4zip0WzlrEr7sFpUBQAAAAAAAAAAAHBWr6p+C/D+CwAAAAAAAAAA4BnQbKp5C2iP71oAAAAAAAAAAID/AN6Ddderzmze2/SNgzXRJ9sBPp3K24JPMHQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDEtMTdUMTk6MTQ6NDIrMDg6MDBqGWm5AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE4LTAxLTE3VDE5OjE0OjQyKzA4OjAwG0TRBQAAAABJRU5ErkJggg==
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/536447/Link%20AI%20Chat%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/536447/Link%20AI%20Chat%20Assistant.meta.js
// ==/UserScript==

;(function() {
    'use strict';

    // 添加 Ant Design 风格的 CSS
    const antStyles = `
        /* Ant Design 风格的基础样式 */
        :root {
            --ant-primary-color: #1890ff;
            --ant-success-color: #52c41a;
            --ant-warning-color: #faad14;
            --ant-error-color: #f5222d;
            --ant-font-size-base: 14px;
            --ant-border-radius-base: 2px;
            --ant-box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
        }

        .ant-btn {
            line-height: 1.5715;
            position: relative;
            display: inline-block;
            font-weight: 400;
            white-space: nowrap;
            text-align: center;
            background-image: none;
            border: 1px solid transparent;
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.015);
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
            user-select: none;
            touch-action: manipulation;
            height: 32px;
            padding: 4px 15px;
            font-size: 14px;
            border-radius: 2px;
            color: rgba(0, 0, 0, 0.85);
            border-color: #d9d9d9;
            background: #fff;
        }

        .ant-btn:hover {
            color: var(--ant-primary-color);
            border-color: var(--ant-primary-color);
        }

        .ant-btn-primary {
            color: #fff;
            border-color: var(--ant-primary-color);
            background: var(--ant-primary-color);
            text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
            box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
        }

        .ant-btn-primary:hover {
            color: #fff;
            border-color: #40a9ff;
            background: #40a9ff;
        }

        .ant-input {
            box-sizing: border-box;
            margin: 0;
            padding: 4px 11px;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            line-height: 1.5715;
            list-style: none;
            position: relative;
            display: inline-block;
            width: 100%;
            min-width: 0;
            background-color: #fff;
            background-image: none;
            border: 1px solid #d9d9d9;
            border-radius: 2px;
            transition: all 0.3s;
        }

        .ant-input:hover {
            border-color: #40a9ff;
            border-right-width: 1px !important;
        }

        .ant-input:focus {
            border-color: #40a9ff;
            border-right-width: 1px !important;
            outline: 0;
            box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
        }

        .ant-textarea {
            max-width: 100%;
            height: auto;
            min-height: 100px;
            line-height: 1.5715;
            vertical-align: bottom;
            transition: all 0.3s, height 0s;
            resize: vertical;
        }

        .ant-card {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
            color: rgba(0, 0, 0, 0.85);
            font-size: 14px;
            font-variant: tabular-nums;
            line-height: 1.5715;
            list-style: none;
            font-feature-settings: 'tnum';
            position: relative;
            background: #fff;
            border-radius: 2px;
            transition: all 0.3s;
        }

        .ant-card-bordered {
            border: 1px solid #f0f0f0;
        }

        .ant-card-head {
            min-height: 48px;
            margin-bottom: -1px;
            padding: 0 24px;
            color: rgba(0, 0, 0, 0.85);
            font-weight: 500;
            font-size: 16px;
            background: transparent;
            border-bottom: 1px solid #f0f0f0;
            border-radius: 2px 2px 0 0;
        }

        .ant-card-head-title {
            display: inline-block;
            flex: 1;
            padding: 16px 0;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .ant-card-extra {
            float: right;
            margin-left: auto;
            padding: 16px 0;
            color: rgba(0, 0, 0, 0.85);
            font-weight: normal;
            font-size: 14px;
        }

        .ant-card-body {
            padding: 24px;
        }

        .ant-float-btn {
            position: fixed;
            z-index: 100;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            background-color: #fff;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08), 0 9px 28px 0 rgba(0, 0, 0, 0.05), 0 12px 48px 16px rgba(0, 0, 0, 0.03);
            border-radius: 50%;
            transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        }

        .ant-float-btn:hover {
            box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.12), 0 18px 56px 4px rgba(0, 0, 0, 0.1), 0 24px 80px 16px rgba(0, 0, 0, 0.06);
        }

        .ant-float-btn-primary {
            background-color: var(--ant-primary-color);
            color: #fff;
        }

        .ant-float-btn-primary:hover {
            background-color: #40a9ff;
        }

        .ant-toast {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s;
        }

        .ant-toast.visible {
            opacity: 1;
        }
    `;

    // 添加样式
    GM_addStyle(antStyles);

    // 防抖函数，优化性能
    function debounce(fn, delay) {
        let timer = null;
        return function(...args) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn.apply(this, args);
                timer = null;
            }, delay);
        };
    }

    // 初始化
    let initialized = false;
    let floatingBtn = null;
    let mainInterface = null;

    // 目标URL
    const TARGET_URL = 'https://link-ai.tech/console/chatManage';

    // 添加变量来标记API请求状态
    let isApiRequestActive = false;

    // 添加一个变量来存储上次抓取的昵称
    let lastCapturedNickname = '';

    function init() {
        // 始终监听URL变化
        startUrlChangeMonitor();

        if (initialized) return;
        initialized = true;

        // 初始检查URL
        checkCurrentUrl();
    }

    // 开始监听URL变化
    function startUrlChangeMonitor() {
        // 监听history API变化
        monitorHistoryChanges();

        // 使用定时器定期检查URL (兜底方案)
        setInterval(checkCurrentUrl, 1000);

        // 监听hashchange事件
        window.addEventListener('hashchange', checkCurrentUrl);

        // 监听popstate事件
        window.addEventListener('popstate', checkCurrentUrl);
    }

    // 监听history API变化
    function monitorHistoryChanges() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        // 覆盖pushState
        history.pushState = function() {
            originalPushState.apply(this, arguments);
            checkCurrentUrl();
        };

        // 覆盖replaceState
        history.replaceState = function() {
            originalReplaceState.apply(this, arguments);
            checkCurrentUrl();
        };
    }

    // 检查当前URL
    function checkCurrentUrl() {
        const currentUrl = window.location.href;

        if (currentUrl.startsWith(TARGET_URL)) {
            // 如果是目标URL，显示按钮
            showElements();
        } else {
            // 如果不是目标URL，隐藏按钮
            hideElements();
        }
    }

    // 显示元素
    function showElements() {
        if (floatingBtn && document.body.contains(floatingBtn)) {
            // 按钮已存在，显示
            floatingBtn.style.display = 'flex';
        } else if (!document.getElementById('link-ai-chat-assistant')) {
            // 按钮和面板都不存在，创建按钮
            createFloatingButton();
        }

        // 如果界面存在，显示
        const assistant = document.getElementById('link-ai-chat-assistant');
        if (assistant) {
            assistant.style.display = 'block';
        }
    }

    // 隐藏元素
    function hideElements() {
        // 隐藏按钮
        if (floatingBtn && document.body.contains(floatingBtn)) {
            floatingBtn.style.display = 'none';
        }

        // 隐藏主界面
        const assistant = document.getElementById('link-ai-chat-assistant');
        if (assistant) {
            assistant.style.display = 'none';
        }
    }

    function isExist() {
        return document.getElementById("link-ai-chat-assistant") || document.getElementById("link-ai-chat-button");
    }

    // 修改浮动按钮样式和位置的函数
    function createFloatingButton() {
        // 确保按钮不重复创建
        if (document.getElementById("link-ai-chat-button")) return;

        // 先检查当前URL是否是目标URL
        if (!window.location.href.startsWith(TARGET_URL)) return;

        // 尝试查找chat-box元素作为参考
        const chatBox = document.querySelector('.chat-box');

        const button = document.createElement('div');
        button.id = 'link-ai-chat-button';
        button.className = 'ant-float-btn ant-float-btn-primary';
        button.style.cssText = `
            width: 40px;
            height: 40px;
            font-size: 18px;
            z-index: 9999;
            background-color: var(--ant-primary-color);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            box-shadow: 0 6px 16px -8px rgba(0, 0, 0, 0.08);
            transition: all 0.3s;
        `;

        // 使用用户图标替代加号
        button.innerHTML = '<svg viewBox="64 64 896 896" focusable="false" data-icon="user" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M858.5 763.6a374 374 0 00-80.6-119.5 375.63 375.63 0 00-119.5-80.6c-.4-.2-.8-.3-1.2-.5C719.5 518 760 444.7 760 362c0-137-111-248-248-248S264 225 264 362c0 82.7 40.5 156 102.8 201.1-.4.2-.8.3-1.2.5-44.8 18.9-85 46-119.5 80.6a375.63 375.63 0 00-80.6 119.5A371.7 371.7 0 00136 901.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8 2-77.2 33-149.5 87.8-204.3 56.7-56.7 132-87.9 212.2-87.9s155.5 31.2 212.2 87.9C779 752.7 810 825 812 902.2c.1 4.4 3.6 7.8 8 7.8h60a8 8 0 008-8.2c-1-47.8-10.9-94.3-29.5-138.2zM512 534c-45.9 0-89.1-17.9-121.6-50.4S340 407.9 340 362c0-45.9 17.9-89.1 50.4-121.6S466.1 190 512 190s89.1 17.9 121.6 50.4S684 316.1 684 362c0 45.9-17.9 89.1-50.4 121.6S557.9 534 512 534z"></path></svg>';
        button.title = '对话助手';

        // 设置初始位置
        if (chatBox) {
            // 设置位置在chat-box上方并靠右对齐
            button.style.position = 'absolute';

            // 将按钮插入到chat-box的父元素中，并放在chat-box前面
            chatBox.parentNode.insertBefore(button, chatBox);

            // 调整位置 - 靠右对齐
            setTimeout(() => {
                const chatBoxRect = chatBox.getBoundingClientRect();
                button.style.top = (chatBoxRect.top - 50) + 'px';
                button.style.left = 'auto';
                button.style.right = '20px';
            }, 0);
        } else {
            // 如果未找到chat-box，则使用默认位置
            button.style.position = 'fixed';
            button.style.top = '20px';
            button.style.right = '20px';
            document.body.appendChild(button);
        }

        // 保存全局引用
        floatingBtn = button;

        // 使用事件委托避免多个事件监听器
        button.addEventListener('click', function(e) {
            e.stopPropagation();

            // 再次检查当前URL是否是目标URL
            if (!window.location.href.startsWith(TARGET_URL)) return;

            this.remove();
            floatingBtn = null;
            createMainInterface();
        });

        // 悬浮效果 - 使用CSS过渡代替JS动画
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // 添加DOM观察以动态调整位置
        observeDOMChanges();
    }

    function createMainInterface() {
        // 检查当前URL是否是目标URL
        if (!window.location.href.startsWith(TARGET_URL)) return;

        const container = createElement();

        // 找到chat-box以便放置主界面
        const chatBox = document.querySelector('.chat-box');

        if (chatBox) {
            // 计算位置使其靠近chat-box
            container.style.position = 'absolute';
            container.style.top = (chatBox.getBoundingClientRect().top - 10) + 'px';
            container.style.right = '20px';

            // 将界面添加到chat-box父元素内部
            chatBox.parentNode.insertBefore(container, chatBox);
        } else {
            // 默认位置
            document.body.appendChild(container);
        }

        // 保存对主界面的引用
        mainInterface = container;

        // 延迟加载事件处理程序，避免UI阻塞
        setTimeout(() => {
            addEventListeners();
            capturePageContent();
        }, 100);
    }

    function createElement() {
        const container = document.createElement('div');
        container.id = 'link-ai-chat-assistant';
        container.className = 'ant-card ant-card-bordered';
        container.style.cssText = `
            position: fixed;
            top: 24px;
            right: 24px;
            width: 400px;
            max-width: 90vw;
            background-color: white;
            border-radius: 2px;
            z-index: 9999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
            box-shadow: var(--ant-box-shadow);
        `;

        container.innerHTML = `
            <div class="ant-card-head">
                <div class="ant-card-head-wrapper">
                    <div class="ant-card-head-title">对话助手</div>
                    <div class="ant-card-extra">
                        <button id="minimize-btn" class="ant-btn" style="padding: 0 8px; height: 24px;">
                            <svg viewBox="64 64 896 896" focusable="false" data-icon="minus" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
            <div class="ant-card-body">
                <div style="margin-bottom: 16px;">
                    <label for="nickname" style="display: block; margin-bottom: 8px;">昵称</label>
                    <input id="nickname" class="ant-input" type="text">
                </div>

                <div style="margin-bottom: 16px;">
                    <label for="message" style="display: block; margin-bottom: 8px;">消息内容</label>
                    <textarea id="message" class="ant-input ant-textarea" style="height: 100px;"></textarea>
                </div>

                <div style="display: flex; gap: 8px; margin-bottom: 16px;">
                    <button id="submit-btn" class="ant-btn ant-btn-primary" style="flex: 1;">提交</button>
                    <button id="capture-btn" class="ant-btn">重新获取</button>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                        <label>返回结果</label>
                        <div>
                            <button id="copy-btn" class="ant-btn" style="margin-right: 8px;">复制</button>
                            <button id="save-btn" class="ant-btn">写入</button>
                        </div>
                    </div>
                    <div id="result-container" contenteditable="true" class="ant-input ant-textarea" style="min-height: 150px; max-height: 600px; overflow-y: auto;"></div>
                </div>
            </div>
        `;

        return container;
    }

    function addEventListeners() {
        // 获取元素
        const container = document.getElementById('link-ai-chat-assistant');
        const submitBtn = document.getElementById('submit-btn');
        const copyBtn = document.getElementById('copy-btn');
        const saveBtn = document.getElementById('save-btn');
        const captureBtn = document.getElementById('capture-btn');
        const minimizeBtn = document.getElementById('minimize-btn');

        // 确保元素存在再添加事件
        if (!container || !submitBtn || !copyBtn || !saveBtn || !captureBtn || !minimizeBtn) {
            console.error('无法找到必要的DOM元素');
            return;
        }

        // 使用事件委托减少事件监听器数量
        container.addEventListener('click', function(e) {
            e.stopPropagation(); // 阻止事件冒泡

            // 检查当前URL是否是目标URL
            if (!window.location.href.startsWith(TARGET_URL)) return;

            const target = e.target;

            // 根据点击的元素ID执行相应的操作
            if (target === submitBtn || target.closest('#submit-btn')) {
                handleSubmit();
            } else if (target === copyBtn || target.closest('#copy-btn')) {
                handleCopy();
            } else if (target === saveBtn || target.closest('#save-btn')) {
                handleSave();
            } else if (target === captureBtn || target.closest('#capture-btn')) {
                capturePageContent(true); // 传入true表示强制抓取
            } else if (target === minimizeBtn || target.closest('#minimize-btn')) {
                container.remove();
                mainInterface = null;
                createFloatingButton();

                // 重新调整按钮位置
                setTimeout(adjustButtonPosition, 100);
            }
        });

        // 添加拖动功能 - 仅在头部可拖动
        const header = container.querySelector('.ant-card-head');
        if (header) {
            makeDraggable(container, header);
        }
    }

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.style.cursor = 'move';
        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 获取鼠标位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 鼠标移动时调用elementDrag
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            // 计算边界
            const rect = element.getBoundingClientRect();
            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            // 防止拖出视窗
            if (newTop < 0) newTop = 0;
            if (newLeft < 0) newLeft = 0;
            if (newTop > window.innerHeight - 50) newTop = window.innerHeight - 50;
            if (newLeft > window.innerWidth - 50) newLeft = window.innerWidth - 50;

            // 设置元素的新位置
            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            // 停止移动
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 使用防抖优化页面内容抓取
    const debouncedCapture = debounce(function() {
        // 如果主界面已打开，则尝试抓取内容
        if (document.getElementById('link-ai-chat-assistant')) {
            capturePageContent();
        }
    }, 300);

    function observePageChanges() {
        // 创建一个观察器实例
        const observer = new MutationObserver(debouncedCapture);

        // 配置观察选项
        const config = {
            childList: true,
            subtree: true
        };

        // 开始观察文档的变化
        observer.observe(document.body, config);
    }

    function capturePageContent(forceCapture = false) {
        try {
            // 检查当前URL是否是目标URL
            if (!window.location.href.startsWith(TARGET_URL)) return;

            // 如果API请求正在进行中，不允许强制刷新
            if (isApiRequestActive && forceCapture) {
                showToast('请求处理中，请稍后再试');
                return;
            }

            // 查找聊天标题和消息内容
            const chatBox = document.querySelector('.chat-box');
            if (!chatBox) return;

            // 抓取昵称
            let nickname = '';
            const chatTitle = chatBox.querySelector('.chat-title span');
            if (chatTitle) {
                nickname = chatTitle.textContent.trim();
            }

            // 获取当前消息输入框的内容
            const messageInput = document.getElementById('message');
            const nicknameInput = document.getElementById('nickname');

            // 如果不是强制抓取，且昵称与上次抓取的相同且消息输入框有内容，则跳过抓取
            if (!forceCapture && nickname === lastCapturedNickname && messageInput && messageInput.value.trim() !== '') {
                // 仅更新昵称输入框
                if (nicknameInput && nickname) {
                    nicknameInput.value = nickname;
                }
                return;
            }

            // 抓取消息内容 - 只抓取第一个mess-right前的所有mess-left
            let messages = [];

            // 获取message-info容器
            const messageInfo = chatBox.querySelector('.message-info');
            if (messageInfo) {
                // 查找所有mess-right和mess-left元素
                const allMessages = Array.from(messageInfo.querySelectorAll('.mess-right, .mess-left'));

                // 找到第一个mess-right的索引
                let firstRightIndex = -1;
                for (let i = 0; i < allMessages.length; i++) {
                    if (allMessages[i].classList.contains('mess-right')) {
                        firstRightIndex = i;
                        break;
                    }
                }

                // 如果找到了第一个mess-right
                if (firstRightIndex !== -1) {
                    // 收集第一个mess-right前的所有mess-left中的消息
                    for (let i = 0; i < firstRightIndex; i++) {
                        if (allMessages[i].classList.contains('mess-left')) {
                            // 查找所有的段落
                            const paragraphs = allMessages[i].querySelectorAll('.markdown-body p');
                            if (paragraphs && paragraphs.length > 0) {
                                // 收集该mess-left中的所有段落
                                let messageText = '';
                                paragraphs.forEach(p => {
                                    if (p.textContent.trim()) {
                                        messageText += p.textContent.trim() + '\n';
                                    }
                                });

                                // 如果有内容，添加到消息列表
                                if (messageText.trim()) {
                                    messages.push(messageText.trim());
                                }
                            }
                        }
                    }
                } else {
                    // 如果没有找到mess-right，收集所有mess-left
                    const leftMessages = messageInfo.querySelectorAll('.mess-left');
                    leftMessages.forEach(leftMessage => {
                        // 查找所有的段落
                        const paragraphs = leftMessage.querySelectorAll('.markdown-body p');
                        if (paragraphs && paragraphs.length > 0) {
                            // 收集该mess-left中的所有段落
                            let messageText = '';
                            paragraphs.forEach(p => {
                                if (p.textContent.trim()) {
                                    messageText += p.textContent.trim() + '\n';
                                }
                            });

                            // 如果有内容，添加到消息列表
                            if (messageText.trim()) {
                                messages.push(messageText.trim());
                            }
                        }
                    });
                }
            }

            // 填充到输入框，不更新富文本区域
            if (nicknameInput && nickname) {
                nicknameInput.value = nickname;
            }

            // 处理收集的消息，只更新消息输入框
            if (messageInput) {
                if (messages.length > 0) {
                    // 将消息数组倒序排列（降序处理）
                    messages.reverse();

                    // 将多条消息合并为一条，用换行符连接
                    const combinedMessage = messages.join('\n');

                    // 更新输入框
                    messageInput.value = combinedMessage;
                    // 自动调整textarea高度以适应内容
                    messageInput.style.height = 'auto';
                    messageInput.style.height = (messageInput.scrollHeight) + 'px';
                } else {
                    // 如果获取到昵称但没有获取到消息内容，则清空消息输入框
                    messageInput.value = '';
                    messageInput.style.height = 'auto';
                }
            }

            // 如果是强制抓取，显示提示
            if (forceCapture) {
                showToast('已更新最新内容');
            }

            // 更新上次抓取的昵称
            lastCapturedNickname = nickname;
        } catch (e) {
            console.error('获取失败:', e);
            showToast('获取失败');
        }
    }

    let conversation_id = '';
    let message_id = '';

    function handleSubmit() {
        const nickname = document.getElementById('nickname').value;
        const message = document.getElementById('message').value;
        const submitBtn = document.getElementById('submit-btn');

        if (!nickname || !message) {
            showToast('请填写昵称和消息内容');
            return;
        }

        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        // 禁用提交按钮
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
        submitBtn.style.cursor = 'not-allowed';

        resultContainer.innerHTML = '<div style="color: #888;">正在处理请求...</div>';

        // 处理消息内容 - 可能包含多条消息
        const processedMessage = preprocessMessage(message);

        // 标记API请求已开始
        isApiRequestActive = true;

        // 使用setTimeout避免UI阻塞
        setTimeout(() => {
            // 发送请求到API
            ajaxRequest({
                method: "POST",
                url: "http://47.97.11.56:8000/api/coze/assistantChat",
                data: JSON.stringify({
                    content: processedMessage,
                    nickname: nickname
                }),
                success: function(response) {
                    // 标记API请求已结束
                    isApiRequestActive = false;

                    try {
                        const result = JSON.parse(response);
                        if (result.code === 200) {
                            resultContainer.innerHTML = formatResponse(result.data.reply || '无回复内容');
                            conversation_id = result.data.conversation_id;
                            message_id = result.data.message_id;
                        } else {
                            resultContainer.innerHTML = `<div style="color: var(--ant-error-color);">请求失败: ${result.message || '未知错误'}</div>`;
                        }
                    } catch(e) {
                        console.error('解析响应失败:', e);
                        resultContainer.innerHTML = formatResponse(response) || '<div style="color: var(--ant-error-color);">解析响应失败</div>';
                    }

                    // 重新启用提交按钮
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                },
                error: function() {
                    // 标记API请求已结束
                    isApiRequestActive = false;

                    resultContainer.innerHTML = '<div style="color: var(--ant-error-color);">请求失败，请重试</div>';
                    // 失败时使用模拟响应
                    simulateResponse();

                    // 重新启用提交按钮
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                    submitBtn.style.cursor = 'pointer';
                }
            });
        }, 0);
    }

    // 预处理消息内容
    function preprocessMessage(message) {
        // 如果消息为空，返回空字符串
        if (!message) return '';

        // 将多个连续的换行符替换为两个换行符
        const normalized = message.replace(/\n{3,}/g, '\n\n');

        // 这里可以添加其他需要的预处理步骤

        return normalized;
    }

    function ajaxRequest(options) {
        const { method, url, data, success, error } = options;

        try {
            GM_xmlhttpRequest({
                method: method,
                url: url,
                data: data,
                headers: {
                    "Content-Type": "application/json"
                },
                timeout: 300000, // 设置超时时间为300秒 (300000毫秒)
                onload: function(response) {
                    try {
                        if (response.status >= 200 && response.status < 300) {
                            success(response.responseText);
                        } else {
                            console.error('请求失败:', response.status, response.statusText);
                            error(response);
                        }
                    } catch(e) {
                        console.error('处理响应失败:', e);
                        error(e);
                    }
                },
                onerror: function(err) {
                    console.error('请求错误:', err);
                    error(err);
                },
                ontimeout: function() {
                    console.error('请求超时');
                    error(new Error('请求超时：已等待300秒'));
                }
            });
        } catch (e) {
            console.error('发送请求失败:', e);
            error(e);
        }
    }

    function formatResponse(text) {
        if (!text) return '';

        // 尝试转换可能的HTML实体
        let decoded = text.replace(/&lt;/g, '<')
                         .replace(/&gt;/g, '>')
                         .replace(/&amp;/g, '&')
                         .replace(/&quot;/g, '"')
                         .replace(/&#39;/g, "'");

        // 检查是否是提示信息
        if (decoded.includes('工作流请求超时') || decoded.includes('请稍后重试')) {
            return `<div style="color: var(--ant-warning-color); font-weight: bold; padding: 8px; background-color: rgba(250, 173, 20, 0.1); border-radius: 4px;">${decoded.replace(/\n/g, '<br>')}</div>`;
        }

        // 简化处理逻辑：直接将所有换行符转换为<br>
        return decoded.replace(/\n/g, '<br>');
    }

    function simulateResponse() {
        const resultContainer = document.getElementById('result-container');
        const nickname = document.getElementById('nickname').value;
        const message = document.getElementById('message').value;

        if (!resultContainer || !message) return;

        setTimeout(() => {
            resultContainer.innerHTML = formatResponse("工作流请求超时,请稍后重试。");
        }, 800);
    }

    function handleCopy() {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        const text = resultContainer.innerText;
        copyTextToClipboard(text);
    }

    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text)
                .then(() => {
                    showToast('已复制到剪贴板');
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    showToast('复制失败，请重试');
                });
        } else {
            // 使用传统方式复制
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();

            try {
                document.execCommand('copy');
                showToast('已复制到剪贴板');
            } catch (err) {
                console.error('复制失败:', err);
                showToast('复制失败，请重试');
            }

            document.body.removeChild(textArea);
        }
    }

    function handleSave() {
        const resultContainer = document.getElementById('result-container');
        if (!resultContainer) return;

        const content = resultContainer.innerText;
        const nickname = document.getElementById('nickname').value;

        // 检查是否包含提示信息
        if (content.includes('工作流请求超时') || content.includes('请稍后重试') || content.includes('正在处理请求')) {
            showToast('提示信息不能写入');
            return;
        }

        if (!content || !nickname) {
            showToast('写入内容不能为空');
            return;
        }

        // 显示保存中的提示
        showToast('正在保存...');

        // 标记API请求已开始
        isApiRequestActive = true;

        // 调用接口保存修改后的内容
        ajaxRequest({
            method: "POST",
            url: "http://47.97.11.56:8000/api/coze/assistantChatWrite",
            data: JSON.stringify({
                conversation_id: conversation_id,
                message_id: message_id,
                content: content
            }),
            success: function(response) {
                // 标记API请求已结束
                isApiRequestActive = false;

                try {
                    const result = JSON.parse(response);
                    if (result.code === 200) {
                        showToast('写入成功');

                        // 同时保存到本地存储
                        try {
                            const savedResponses = GM_getValue('savedResponses', []);
                            savedResponses.push({
                                conversation_id: conversation_id,
                                message_id: message_id,
                                content: content,
                                timestamp: new Date().toISOString()
                            });
                            GM_setValue('savedResponses', savedResponses);
                        } catch (e) {
                            console.error('本地保存失败:', e);
                        }
                    } else {
                        showToast(result.message || '保存失败');
                    }
                } catch(e) {
                    console.error('解析响应失败:', e);
                    showToast('保存失败: 服务器响应异常');
                }
            },
            error: function() {
                // 标记API请求已结束
                isApiRequestActive = false;

                showToast('保存失败: 无法连接到服务器');

                // 保存失败时尝试保存到本地
                try {
                    const savedResponses = GM_getValue('savedResponses', []);
                    savedResponses.push({
                        conversation_id: conversation_id,
                        message_id: message_id,
                        content: content,
                        timestamp: new Date().toISOString()
                    });
                    GM_setValue('savedResponses', savedResponses);
                    showToast('已保存到本地');
                } catch (e) {
                    console.error('本地保存失败:', e);
                    showToast('无法保存内容');
                }
            }
        });
    }

    function showToast(message) {
        // 移除现有的toast
        const existingToast = document.querySelector('.ant-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'ant-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // 使用RAF确保动画流畅
        requestAnimationFrame(() => {
            toast.classList.add('visible');

            setTimeout(() => {
                toast.classList.remove('visible');
                setTimeout(() => toast.remove(), 300);
            }, 2000);
        });
    }

    // 修改按钮位置的函数
    function adjustButtonPosition() {
        if (!floatingBtn || !document.body.contains(floatingBtn)) return;

        // 检查当前URL是否是目标URL
        if (!window.location.href.startsWith(TARGET_URL)) {
            hideElements();
            return;
        }

        const chatBox = document.querySelector('.chat-box');
        if (chatBox) {
            const chatBoxRect = chatBox.getBoundingClientRect();
            floatingBtn.style.position = 'absolute';
            floatingBtn.style.top = (chatBoxRect.top - 50) + 'px';
            // 靠右对齐，距离右侧20px
            floatingBtn.style.left = 'auto';
            floatingBtn.style.right = '20px';
        }
    }

    // 观察DOM变化
    function observeDOMChanges() {
        const observer = new MutationObserver(debounce(() => {
            // 调整按钮位置
            adjustButtonPosition();

            // 如果在目标页面且已经打开了主界面，尝试抓取内容
            if (window.location.href.startsWith(TARGET_URL) &&
                document.getElementById('link-ai-chat-assistant')) {
                capturePageContent();
            }
        }, 300));

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    // 清空功能
    function handleClear() {
        document.getElementById('message').value = '';
        document.getElementById('result-container').innerHTML = '';
        conversation_id = '';
        message_id = '';
        showToast('已清空内容');
    }

    // 在页面完全加载后初始化，使用更安全的DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 监听导航完成事件
    window.addEventListener('load', () => {
        // 确保初始化已执行
        if (!initialized) {
            init();
        }

        // 页面加载完成后检查URL
        checkCurrentUrl();
    });

    // 监听Single Page Application路由变化
    window.addEventListener('popstate', checkCurrentUrl);
    window.addEventListener('pushstate', checkCurrentUrl);
    window.addEventListener('replacestate', checkCurrentUrl);
})();