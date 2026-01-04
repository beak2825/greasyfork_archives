// ==UserScript==
// @name        [VA]奶牛便签
// @namespace   http://tampermonkey.net/
// @version     7.4
// @description 带详细注释的便签系统，支持全局布局同步和独立内容存储，修复移动端拖动问题
// @match       https://www.milkywayidle.com/game*
// @author      VerdantAether
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535615/%5BVA%5D%E5%A5%B6%E7%89%9B%E4%BE%BF%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/535615/%5BVA%5D%E5%A5%B6%E7%89%9B%E4%BE%BF%E7%AD%BE.meta.js
// ==/UserScript==

/* 核心功能说明：
   - 全局布局同步：所有页面共享按钮位置、文本框尺寸和可见性状态
   - 独立内容存储：每个角色（根据characterId）拥有独立的文本内容
   - 操作方式：
     1. 拖动按钮移动整个便签系统
     2. 拖动文本框右下角调整大小
     3. 单击按钮切换显示/隐藏文本框
     4. 所有修改自动保存
   - 移动端支持：添加触摸事件处理
*/

(function() {
    'use strict';

    // =====================
    // 配置参数
    // =====================
    const config = {
        buttonSize: 36, // 按钮直径(像素)
        textBoxOffset: 3, // 文本框相对按钮的垂直偏移量
        minSize: { // 文本框最小尺寸限制
            width: 300,
            height: 36
        },
        defaultPosition: { // 默认初始位置
            x: 20,
            y: 20
        },
        dragThreshold: 3, // 拖动判定的最小移动距离(像素)
        globalLayoutKey: 'Global_Note_Layout', // 全局布局存储键
        initializationDelay: 3000 // 页面加载后的初始化延迟(毫秒)
    };

    // =====================
    // 样式注入
    // =====================
    GM_addStyle(`
        /* 按钮样式 */
        .sticky-button {
            position: fixed;
            width: ${config.buttonSize}px;
            height: ${config.buttonSize}px;
            border-radius: 50%;
            background: #4CAF50;
            cursor: move;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
            user-select: none;       /* 防止文字被选中 */
            transition: transform 0.2s;
            touch-action: none;     /* 防止触摸默认行为 */
        }
        /* 按钮悬停效果 */
        .sticky-button:hover {
            transform: scale(1.1);
        }

        /* 文本框样式 */
        .sticky-textbox {
            position: fixed;
            z-index: 99998;         /* 略低于按钮 */
            background: rgba(48,59,110,0.9);
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(48,59,110,0.5);
            padding: 6px;
            font-size: 14px;
            resize: both;           /* 允许双向调整大小 */
            overflow: auto;         /* 内容过多时显示滚动条 */
            min-width: ${config.minSize.width}px;
            min-height: ${config.minSize.height}px;
            backdrop-filter: blur(2px); /* 背景模糊效果 */
        }
    `);

    // =====================
    // 工具函数
    // =====================

    /**
     * 生成内容存储键（基于URL中的characterId参数）
     * @returns {string} 当前角色的唯一存储键
     */
    function getContentKey() {
        const urlParams = new URLSearchParams(window.location.search);
        return `MW_Note_${urlParams.get('characterId')}`;
    }

    // =====================
    // 核心功能
    // =====================

    /**
     * 创建并初始化整个便签系统
     */
    function createStickySystem() {
        // 从存储加载数据 -------------------------------------------------
        const layoutData = GM_getValue(config.globalLayoutKey, {
            x: config.defaultPosition.x,
            y: config.defaultPosition.y,
            textWidth: config.minSize.width,
            textHeight: config.minSize.height,
            visible: true
        });

        // 独立内容加载（当前角色）
        const contentData = GM_getValue(getContentKey(), '');

        // 创建界面元素 ---------------------------------------------------
        const button = createButton(layoutData);
        const textBox = createTextBox(layoutData, contentData);

        // 状态管理变量
        let isDragging = false; // 当前是否正在拖动
        let dragStartTime = 0; // 拖动开始时间戳
        let startX = 0; // 拖动开始X坐标
        let startY = 0; // 拖动开始Y坐标
        let initialX = 0; // 初始X位置
        let initialY = 0; // 初始Y位置

        // =====================
        // 事件绑定
        // =====================

        /**
         * 处理拖动开始事件（支持鼠标和触摸）
         */
        function handleDragStart(e) {
            // 阻止默认行为防止页面滚动
            if (e.cancelable) e.preventDefault();
            
            // 获取正确的坐标（支持触摸事件）
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            dragStartTime = Date.now();
            startX = clientX;
            startY = clientY;
            initialX = parseFloat(button.style.left);
            initialY = parseFloat(button.style.top);

            // 添加事件监听器
            document.addEventListener(isTouchEvent(e) ? 'touchmove' : 'mousemove', handleDragMove);
            document.addEventListener(isTouchEvent(e) ? 'touchend' : 'mouseup', handleDragEnd);
        }

        /**
         * 判断是否是触摸事件
         */
        function isTouchEvent(e) {
            return e.touches !== undefined;
        }

        /**
         * 按钮拖动事件 - 开始拖动/点击判断
         */
        button.addEventListener('mousedown', handleDragStart);
        button.addEventListener('touchstart', handleDragStart);

        /**
         * 拖动移动处理
         */
        function handleDragMove(e) {
            // 阻止默认行为防止页面滚动
            if (e.cancelable) e.preventDefault();
            
            // 获取正确的坐标（支持触摸事件）
            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);
            
            const dx = Math.abs(clientX - startX);
            const dy = Math.abs(clientY - startY);

            // 超过阈值开始拖动
            if (dx > config.dragThreshold || dy > config.dragThreshold) {
                isDragging = true;
                updateButtonPosition(
                    button,
                    initialX + clientX - startX,
                    initialY + clientY - startY
                );
                updateTextBoxPosition(button, textBox);
            }
        }

        /**
         * 拖动结束处理
         */
        function handleDragEnd(e) {
            // 阻止默认行为防止页面滚动
            if (e.cancelable) e.preventDefault();
            
            // 移除事件监听器
            document.removeEventListener(isTouchEvent(e) ? 'touchmove' : 'mousemove', handleDragMove);
            document.removeEventListener(isTouchEvent(e) ? 'touchend' : 'mouseup', handleDragEnd);

            if (isDragging) {
                // 拖动操作：保存布局
                saveGlobalLayout(button, textBox);
            } else if (Date.now() - dragStartTime < 200) {
                // 短时间点击：切换显示状态
                toggleTextBoxVisibility(textBox);
                saveGlobalLayout(button, textBox);
            }

            isDragging = false;
        }

        /**
         * 文本框大小调整事件
         */
        textBox.addEventListener('mousedown', e => {
            // 检查是否点击了调整手柄区域
            if (isResizeHandle(e, textBox)) {
                startResize(e);
            }
        });

        // 添加触摸事件支持
        textBox.addEventListener('touchstart', e => {
            // 检查是否点击了调整手柄区域
            if (isResizeHandle(e, textBox)) {
                startResize(e.touches[0]);
            }
        });

        function startResize(e) {
            // 阻止默认行为防止页面滚动
            if (e.cancelable) e.preventDefault();
            
            const startX = e.clientX || e.touches[0].clientX;
            const startY = e.clientY || e.touches[0].clientY;
            const startWidth = textBox.offsetWidth;
            const startHeight = textBox.offsetHeight;

            function resizeHandler(e) {
                // 阻止默认行为防止页面滚动
                if (e.cancelable) e.preventDefault();
                
                const clientX = e.clientX || (e.touches && e.touches[0].clientX);
                const clientY = e.clientY || (e.touches && e.touches[0].clientY);
                
                // 计算新尺寸（带最小值限制）
                const newWidth = Math.max(
                    config.minSize.width,
                    startWidth + (clientX - startX)
                );
                const newHeight = Math.max(
                    config.minSize.height,
                    startHeight + (clientY - startY)
                );
                textBox.style.width = `${newWidth}px`;
                textBox.style.height = `${newHeight}px`;
            }

            function stopResizeHandler() {
                document.removeEventListener('mousemove', resizeHandler);
                document.removeEventListener('mouseup', stopResizeHandler);
                document.removeEventListener('touchmove', resizeHandler);
                document.removeEventListener('touchend', stopResizeHandler);
                saveGlobalLayout(button, textBox);
            }

            document.addEventListener('mousemove', resizeHandler);
            document.addEventListener('mouseup', stopResizeHandler);
            document.addEventListener('touchmove', resizeHandler);
            document.addEventListener('touchend', stopResizeHandler);
        }

        /**
         * 文本框内容输入事件 - 实时保存
         */
        textBox.addEventListener('input', () => {
            GM_setValue(getContentKey(), textBox.value);
        });

        // 初始化界面
        document.body.append(button, textBox);
        updateTextBoxPosition(button, textBox);
    }

    // =====================
    // DOM操作辅助函数
    // =====================

    /**
     * 创建按钮元素
     * @param {object} layoutData - 布局数据
     */
    function createButton(layoutData) {
        const button = document.createElement('div');
        button.className = 'sticky-button';
        button.textContent = '📝';
        button.style.left = `${layoutData.x}px`;
        button.style.top = `${layoutData.y}px`;
        return button;
    }

    /**
     * 创建文本框元素
     * @param {object} layoutData - 布局数据
     * @param {string} content - 初始内容
     */
    function createTextBox(layoutData, content) {
        const textBox = document.createElement('textarea');
        textBox.className = 'sticky-textbox';
        textBox.style.width = `${layoutData.textWidth}px`;
        textBox.style.height = `${layoutData.textHeight}px`;
        textBox.value = content;
        textBox.style.display = layoutData.visible ? 'block' : 'none';
        return textBox;
    }

    // =====================
    // 功能逻辑函数
    // =====================

    /**
     * 更新按钮位置
     * @param {HTMLElement} button - 按钮元素
     * @param {number} x - 新的X坐标
     * @param {number} y - 新的Y坐标
     */
    function updateButtonPosition(button, x, y) {
        button.style.left = `${x}px`;
        button.style.top = `${y}px`;
    }

    /**
     * 更新文本框位置（跟随按钮）
     */
    function updateTextBoxPosition(button, textBox) {
        const btnRect = button.getBoundingClientRect();
        textBox.style.left = `${btnRect.right + config.textBoxOffset}px`; // 按钮右侧+间距
        textBox.style.top = `${btnRect.top}px`; // 与按钮顶部对齐
    }

    /**
     * 切换文本框可见性
     */
    function toggleTextBoxVisibility(textBox) {
        textBox.style.display = textBox.style.display === 'none' ? 'block' : 'none';
    }

    /**
     * 保存全局布局到存储
     */
    function saveGlobalLayout(button, textBox) {
        const btnRect = button.getBoundingClientRect();
        GM_setValue(config.globalLayoutKey, {
            x: btnRect.left,
            y: btnRect.top,
            textWidth: textBox.offsetWidth,
            textHeight: textBox.offsetHeight,
            visible: textBox.style.display !== 'none'
        });
    }

    /**
     * 判断是否点击了调整大小手柄区域
     */
    function isResizeHandle(e, element) {
        const rect = element.getBoundingClientRect();
        return (
            e.clientX > rect.right - 16 && // 右侧16px区域
            e.clientY > rect.bottom - 16 // 底部16px区域
        );
    }

    // =====================
    // 初始化入口
    // =====================
    window.addEventListener('load', () => {
        // 延迟初始化以确保游戏主界面加载完成
        setTimeout(() => {
            if (!document.querySelector('.sticky-button')) {
                createStickySystem();
            }
        }, config.initializationDelay);
    });
})();