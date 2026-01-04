// ==UserScript==
// @name        隐藏任意元素
// @namespace https://github.com/giveme0101
// @version      2.4.2
// @description  通过右键点击隐藏页面上的任意元素，并保存隐藏状态，最新隐藏的显示在顶部
// @author       Kevin xiajun94@foxmail.com
// @match        *://*/*
// @grant       GM_info
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546644/%E9%9A%90%E8%97%8F%E4%BB%BB%E6%84%8F%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/546644/%E9%9A%90%E8%97%8F%E4%BB%BB%E6%84%8F%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义样式
    GM_addStyle(`
        #element-hider-manage-btn {
            position: fixed;
            top: -6px;
            right: -6px;
            z-index: 9999999999;
            padding: 10px;
            background: linear-gradient(45deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #0000ff, #8000ff);
            opacity: 0.3;
            color: white;
            border: none;
            border-radius: 50%;
            cursor: pointer;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            transition: all 0.3s ease;
        }

        #element-hider-manage-btn:hover {
            background: linear-gradient(50deg, #ff0000, #ff8000, #ffff00, #00ff00, #0080ff, #0000ff, #8000ff);
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            transform: scale(1.5);
            opacity: 0.9;
        }

        #element-hider-panel {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 20px;
            z-index: 9999999998;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            min-width: 500px;
            max-width: 80%;
            max-height: 80vh;
            overflow-y: auto;
            font-family: Arial, sans-serif;
        }

        #element-hider-panel h3 {
            margin-top: 0;
            color: #4a6bdf;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        #element-hider-panel ul {
            padding-left: 0;
            max-height: 300px;
            overflow-y: auto;
            margin: 15px 0;
        }

        #element-hider-panel li {
            margin-bottom: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            border-radius: 4px;
            background: #f9f9f9;
            transition: background 0.2s;
        }

        #element-hider-panel li:hover {
            background: #f0f0f0;
        }

        #element-hider-panel li .selector-text {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 80%;
            font-family: monospace;
            font-size: 12px;
            padding: 4px 8px;
        }

        #element-hider-panel .button-group {
            display: flex;
            gap: 5px;
        }

        #element-hider-panel button {
            background: #4a6bdf;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        }

        #element-hider-panel button:hover {
            background: #3a5bc0;
        }

        #element-hider-panel .preview-btn {
            background: #ffa500;
        }

        #element-hider-panel .preview-btn:hover {
            background: #e59400;
        }

        #element-hider-panel .restore-btn {
            background: #4CAF50;
        }

        #element-hider-panel .restore-btn:hover {
            background: #3e8e41;
        }

        #element-hider-panel .clear-btn {
            background: #ff4757;
            padding: 8px 12px;
        }

        #element-hider-panel .clear-btn:hover {
            background: #e03e4d;
        }


        #element-hider-panel .start-btn {
            background: ##1e9fff;
            padding: 8px 12px;
        }

        #element-hider-panel .start-btn:hover {
            background: #3a5edb
        }

        .element-hider-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 9999;
            background: rgba(0,0,0,0.5);
            animation: fadeIn 0.3s ease;
        }

        .element-hider-tooltip {
            position: fixed;
            background: #333;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 12px;
            pointer-events: none;
            font-family: Arial, sans-serif;
            animation: fadeIn 0.2s ease;
            max-width: 300px;
            word-break: break-word;
        }

        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }

        .element-highlight {
            outline: 2px solid red !important;
            outline-offset: 2px;
            position: relative;
            z-index: 9998;
        }

        .element-highlight::after {
            content: '隐藏元素预览';
            position: absolute;
            top: -25px;
            left: 0;
            background: red;
            color: white;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 10px;
            z-index: 9999;
        }
    `);

    // 存储隐藏元素的数据结构
    const STORAGE_KEY = 'hidden_elements';
    const STATE_KEY = 'state_key'
    ;
    let hiddenElements = JSON.parse(GM_getValue(STORAGE_KEY, '{}'));

    // 初始化当前页面的隐藏记录
    const currentUrl = window.location.host + window.location.pathname;
    if (!hiddenElements[currentUrl]) {
        hiddenElements[currentUrl] = [];
    }

    // 应用已保存的隐藏元素
    function applyHiddenElements() {
        // 从最新的开始应用（后隐藏的先应用）
        const elementsToHide = [...hiddenElements[currentUrl]].reverse();
        elementsToHide.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    element.style.display = 'none';
                    element.setAttribute('data-hidden-by-element-hider', 'true');
                });
            } catch (e) {
                console.warn('无法隐藏元素:', selector, e);
            }
        });
    }

    // 查找最内层的元素
    function findInnermostElement(x, y) {
        return document.elementFromPoint(x, y);
    }

    // 生成CSS选择器
    function generateSelector(element) {
        // 如果有ID，优先使用ID选择器
        if (element.id) {
            return `#${CSS.escape(element.id)}`;
        }

        let selector = element.tagName.toLowerCase();

        // 添加类名
        if (element.className && typeof element.className === 'string') {
            const classes = element.className.split(/\s+/).filter(cls => cls.length > 0);
            if (classes.length > 0) {
                selector += '.' + classes.map(cls => CSS.escape(cls)).join('.');
            }
        }

        // 如果没有类名和ID，添加属性选择器
        if (!element.id && (!element.className || element.className.trim() === '')) {
            // 尝试使用其他属性
            const attrs = ['name', 'type', 'alt', 'title', 'src', 'href'];
            for (const attr of attrs) {
                if (element.hasAttribute(attr)) {
                    const value = element.getAttribute(attr);
                    if (value && value.length < 50) { // 避免过长的值
                        selector += `[${attr}="${CSS.escape(value)}"]`;
                        break;
                    }
                }
            }
        }

        // 添加父元素信息提高特异性
        let path = [];
        let current = element;
        let limit = 0;

        while (current.parentElement && limit < 5) {
            const parent = current.parentElement;
            let parentSelector = parent.tagName.toLowerCase();

            if (parent.id) {
                parentSelector = `#${CSS.escape(parent.id)}`;
                path.unshift(parentSelector);
                break;
            } else if (parent.className && typeof parent.className === 'string') {
                const classes = parent.className.split(/\s+/).filter(cls => cls.length > 0);
                if (classes.length > 0) {
                    parentSelector += '.' + classes.map(cls => CSS.escape(cls)).join('.');
                }
            }

            path.unshift(parentSelector);
            current = parent;
            limit++;
        }

        if (path.length > 0) {
            selector = path.join(' > ') + ' > ' + selector;
        }

        // 添加:nth-child信息
        if (element.parentElement) {
            const children = Array.from(element.parentElement.children);
            const index = children.indexOf(element);
            if (index >= 0) {
                selector += `:nth-child(${index + 1})`;
            }
        }

        return selector;
    }

    // 隐藏元素并保存
    function hideElement(element) {
        const selector = generateSelector(element);
        element.style.display = 'none';
        element.setAttribute('data-hidden-by-element-hider', 'true');

        // 检查是否已存在相同的选择器
        const existingIndex = hiddenElements[currentUrl].indexOf(selector);
        if (existingIndex > -1) {
            // 如果已存在，先移除旧的
            hiddenElements[currentUrl].splice(existingIndex, 1);
        }

        // 将新的选择器添加到数组开头（最新隐藏的显示在最上面）
        hiddenElements[currentUrl].unshift(selector);
        GM_setValue(STORAGE_KEY, JSON.stringify(hiddenElements));

        return selector;
    }

    // 显示管理界面
    function showManagementPanel() {
        // 如果面板已存在，先移除
        const existingPanel = document.getElementById('element-hider-panel');
        if (existingPanel) {
            existingPanel.remove();
        }

        const existingOverlay = document.querySelector('.element-hider-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // 创建浮窗
        const panel = document.createElement('div');
        panel.id = 'element-hider-panel';

        // 标题
        const title = document.createElement('h3');
        title.textContent = `隐藏元素管理 (${hiddenElements[currentUrl].length}) - ${currentUrl}`;
        panel.appendChild(title);

        // 当前页面隐藏元素列表
        const list = document.createElement('ul');

        if (hiddenElements[currentUrl].length === 0) {
            const item = document.createElement('li');
            item.textContent = '当前页面没有隐藏元素';
            item.style.background = 'none';
            item.style.justifyContent = 'center';
            list.appendChild(item);
        } else {
            // 显示所有隐藏元素，最新的在最上面
            hiddenElements[currentUrl].forEach((selector, index) => {
                const item = document.createElement('li');

                const text = document.createElement('span');
                text.className = 'selector-text';
                text.textContent = selector;
                text.idx = index;
                text.title = selector;
                text.onclick = function(){
                    this.setAttribute('contenteditable', true);
                }
                text.onblur = function(){
                    hiddenElements[currentUrl].splice(index, 1, this.textContent);
                    GM_setValue(STORAGE_KEY, JSON.stringify(hiddenElements));
                }

                const buttonGroup = document.createElement('div');
                buttonGroup.className = 'button-group';

                // 预览按钮
                const previewBtn = document.createElement('button');
                previewBtn.className = 'preview-btn';
                previewBtn.textContent = '预览';
                previewBtn.title = '预览此元素位置';
                previewBtn.onclick = function() {
                    try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            const originalDisplay = element.style.display;
                            const originalOutline = element.style.outline;
                            const originalZIndex = element.style.zIndex;

                            // 临时显示并高亮元素
                            element.style.display = '';
                            element.style.outline = '';
                            element.style.zIndex = '9998';
                            element.classList.add('element-highlight');

                            // 滚动到元素位置
                            element.scrollIntoView({behavior: 'smooth', block: 'center'});

                            // 3秒后恢复
                            setTimeout(() => {
                                element.style.display = originalDisplay;
                                element.style.outline = originalOutline;
                                element.style.zIndex = originalZIndex;
                                element.classList.remove('element-highlight');
                            }, 3000);
                        });
                    } catch (e) {
                        console.error('预览元素时出错:', e);
                    }
                };

                // 恢复按钮
                const restoreBtn = document.createElement('button');
                restoreBtn.className = 'restore-btn';
                restoreBtn.textContent = '恢复';
                restoreBtn.title = '恢复显示此元素';
                restoreBtn.onclick = function() {
                    try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            element.style.display = '';
                            element.removeAttribute('data-hidden-by-element-hider');
                        });

                        // 从存储中移除
                        hiddenElements[currentUrl].splice(index, 1);
                        GM_setValue(STORAGE_KEY, JSON.stringify(hiddenElements));

                        // 刷新列表
                        panel.remove();
                        overlay.remove();
                        showManagementPanel();
                    } catch (e) {
                        console.error('恢复元素时出错:', e);
                    }
                };

                buttonGroup.appendChild(previewBtn);
                buttonGroup.appendChild(restoreBtn);
                item.appendChild(text);
                item.appendChild(buttonGroup);
                list.appendChild(item);
            });
        }

        panel.appendChild(list);

        // 操作按钮
        const clearBtn = document.createElement('button');
        clearBtn.className = 'clear-btn';
        clearBtn.textContent = '清除所有';
        clearBtn.onclick = function() {
            if (confirm('确定要恢复当前页面的所有隐藏元素吗？')) {
                // 恢复所有元素显示
                hiddenElements[currentUrl].forEach(selector => {
                    try {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            element.style.display = '';
                            element.removeAttribute('data-hidden-by-element-hider');
                        });
                    } catch (e) {
                        console.error('恢复元素时出错:', e);
                    }
                });

                // 清除存储
                hiddenElements[currentUrl] = [];
                GM_setValue(STORAGE_KEY, JSON.stringify(hiddenElements));

                // 关闭面板
                panel.remove();
                overlay.remove();

                // 显示成功消息
                showTooltip('已恢复所有隐藏元素', window.innerWidth / 2, window.innerHeight / 2);
            }
        };

        const startBtn = document.createElement('button');
        startBtn.className = 'start-btn';
        startBtn.textContent = GM_getValue(STATE_KEY, '0') === '1' ? "已开启" : "已关闭";
        startBtn.onclick = function(e) {
            GM_setValue(STATE_KEY, GM_getValue(STATE_KEY, '0') === '0' ? '1' : '0');
            regDbClickEvt(e);
            panel.remove();
            overlay.remove();
        };;

        const btnContainer = document.createElement('div');
        btnContainer.style.marginTop = '15px';
        btnContainer.style.display = 'flex';
        btnContainer.style.justifyContent = 'space-between';
        btnContainer.appendChild(clearBtn);
        btnContainer.appendChild(startBtn);
        panel.appendChild(btnContainer);

        // 添加到页面
        document.body.appendChild(panel);

        // 点击背景关闭
        const overlay = document.createElement('div');
        overlay.className = 'element-hider-overlay';
        overlay.onclick = function() {
            panel.remove();
            overlay.remove();
        };
        document.body.appendChild(overlay);
    }

    // 显示提示信息
    function showTooltip(message, x, y) {
        const tooltip = document.createElement('div');
        tooltip.className = 'element-hider-tooltip';
        tooltip.textContent = message;
        tooltip.style.top = `${y}px`;
        tooltip.style.left = `${x}px`;
        document.body.appendChild(tooltip);

        // 2秒后消失
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    }

    // 右键事件处理
    function handleRightClick(e) {
        // 如果点击的是管理面板本身或管理按钮，则不处理
        if (e.target.closest('#element-hider-panel') || e.target.id === 'element-hider-manage-btn') {
            return;
        }

        // 阻止默认右键菜单
        e.preventDefault();

        const element = findInnermostElement(e.clientX, e.clientY);
        if (element && element !== document.documentElement && element !== document.body) {
            const selector = hideElement(element);

            // 显示提示信息
            showTooltip(`已隐藏: ${element.tagName}${element.id ? '#' + element.id : ''}`, e.pageX, e.pageY - 30);
        }
    }

    function regDbClickEvt(e){
        const openStatus = GM_getValue(STATE_KEY, '0');
        if (openStatus === '1') {
            showTooltip('已开启右键点击隐藏功能', e.pageX, e.pageY - 30);
            document.addEventListener('contextmenu', handleRightClick);
        } else {
            showTooltip('已关闭右键点击隐藏功能', e.pageX, e.pageY - 30);
            document.removeEventListener('contextmenu', handleRightClick);
        }
    }

    // 初始化
    function init() {
        // 应用已保存的隐藏元素
        applyHiddenElements();

        // 重置状态
        GM_setValue(STATE_KEY, '0');

        // 添加管理按钮到页面
        const manageBtn = document.createElement('button');
        manageBtn.id = 'element-hider-manage-btn';
        // manageBtn.textContent = '.';
        manageBtn.title = '隐藏元素管理';
        manageBtn.onclick = showManagementPanel;
        document.body.appendChild(manageBtn);

        // 注册油猴菜单命令
        if (typeof GM_registerMenuCommand !== 'undefined') {
            GM_registerMenuCommand('管理隐藏元素', showManagementPanel);
        }
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();