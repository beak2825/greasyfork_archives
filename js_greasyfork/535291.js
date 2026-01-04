// ==UserScript==
// @name         飞书表格自动滚动 可diy局部滚动
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  为指定class的表格添加自动滚动功能
// @author       Your name
// @include           *://*.feishu.cn/*
// @license           AGPL License
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/535291/%E9%A3%9E%E4%B9%A6%E8%A1%A8%E6%A0%BC%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%20%E5%8F%AFdiy%E5%B1%80%E9%83%A8%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535291/%E9%A3%9E%E4%B9%A6%E8%A1%A8%E6%A0%BC%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%20%E5%8F%AFdiy%E5%B1%80%E9%83%A8%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试日志函数
    const debug = (msg) => {
        console.log(`[表格自动滚动] ${msg}`);
    };

    // 添加样式
    const styles = `
        .auto-scroll-btn {
            position: fixed;
            z-index: 2147483647;
            padding: 10px 20px;
            background: #4CAF50;
            color: white !important;
            border: none;
            border-radius: 5px;
            cursor: pointer !important;
            font-size: 14px;
            top: 20px;
            right: 20px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            user-select: none;
            pointer-events: auto !important;
            opacity: 1 !important;
            visibility: visible !important;
            font-family: Arial, sans-serif !important;
        }
        .auto-scroll-btn:hover {
            opacity: 0.8 !important;
            transform: scale(1.05);
        }
        .auto-scroll-btn.active {
            background: #f44336;
        }
    `;

    // 创建style元素
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // 创建按钮
    const button = document.createElement('button');
    button.className = 'auto-scroll-btn';
    button.textContent = '表格滚动';
    document.body.appendChild(button);

    let scrollInterval = null;
    let isScrolling = false;
    let scrollSpeed = 1; // 初始滚动速度

    // 获取表格容器
    function getTableContainer() {
        return document.querySelector('.explorer-file-list-virtualized__container');
    }

    // 获取容器实际高度
    function getContainerHeight() {
        const container = getTableContainer();
        return container ? container.scrollHeight : 0;
    }

    // 获取当前滚动位置
    function getCurrentScroll() {
        const container = getTableContainer();
        return container ? container.scrollTop : 0;
    }

    // 检查是否到达底部
    function isBottomReached() {
        const container = getTableContainer();
        if (!container) return true;

        const containerHeight = container.clientHeight;
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        return (containerHeight + scrollTop >= scrollHeight - 50); // 添加50px缓冲区
    }

    // 滚动函数
    function autoScroll() {
        try {
            const container = getTableContainer();
            if (!container) {
                debug('未找到表格容器，停止滚动');
                stopScrolling();
                return;
            }

            if (isBottomReached()) {
                debug('已到达底部，停止滚动');
                stopScrolling();
                return;
            }

            container.scrollBy({
                top: scrollSpeed,
                behavior: 'auto'
            });
        } catch (error) {
            debug('滚动出错：' + error.message);
            stopScrolling();
        }
    }

    // 开始滚动
    function startScrolling() {
        try {
            const container = getTableContainer();
            if (!container) {
                debug('未找到表格容器');
                return;
            }

            if (!isScrolling) {
                debug('开始滚动');
                isScrolling = true;
                button.classList.add('active');
                button.textContent = '停止滚动';
                scrollInterval = setInterval(autoScroll, 10);
            }
        } catch (error) {
            debug('启动滚动失败：' + error.message);
            stopScrolling();
        }
    }

    // 停止滚动
    function stopScrolling() {
        try {
            if (isScrolling) {
                debug('停止滚动');
                isScrolling = false;
                button.classList.remove('active');
                button.textContent = '表格滚动';
                if (scrollInterval) {
                    clearInterval(scrollInterval);
                    scrollInterval = null;
                }
            }
        } catch (error) {
            debug('停止滚动失败：' + error.message);
        }
    }

    // 状态检查
    function checkScrollingState() {
        const container = getTableContainer();
        if (!container && isScrolling) {
            debug('表格容器不存在，停止滚动');
            stopScrolling();
        }
    }

    // 按钮点击事件
    button.addEventListener('click', function(e) {
        try {
            if (!e) e = window.event;
            e.preventDefault();
            e.stopPropagation();

            if (isScrolling) {
                stopScrolling();
            } else {
                startScrolling();
            }
        } catch (error) {
            debug('点击事件处理出错：' + error.message);
            stopScrolling();
        }
        return false;
    }, true);

    // 键盘事件 - 空格暂停/继续
    document.addEventListener('keydown', function(e) {
        if (e.code === 'Space' && e.target === document.body) {
            e.preventDefault();
            if (isScrolling) {
                stopScrolling();
            } else {
                startScrolling();
            }
        }
    });

    // 清理函数
    function cleanup() {
        try {
            stopScrolling();
            button.remove();
            styleSheet.remove();
        } catch (error) {
            debug('清理失败：' + error.message);
        }
    }

    // 页面卸载时清理
    window.addEventListener('unload', cleanup);

    // 定期检查滚动状态
    setInterval(checkScrollingState, 1000);

    debug('脚本初始化完成');
})();