// ==UserScript==
// @name         煎蛋网瀑布流布局
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  类似小红书、pinterest的瀑布流显示
// @author       psdoc烛光
// @match        https://jandan.net/*
// @icon         https://favicon.im/zh/jandan.net?larger=true
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546555/%E7%85%8E%E8%9B%8B%E7%BD%91%E7%80%91%E5%B8%83%E6%B5%81%E5%B8%83%E5%B1%80.user.js
// @updateURL https://update.greasyfork.org/scripts/546555/%E7%85%8E%E8%9B%8B%E7%BD%91%E7%80%91%E5%B8%83%E6%B5%81%E5%B8%83%E5%B1%80.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 用户提供的容器信息
    const CONTAINER_SELECTOR = '#comments'; // 整个帖子列表容器
    const POST_SELECTOR = '.comment-row.p-2'; // 单个帖子容器

    // 深色模式状态
    let isDarkMode = localStorage.getItem('jandan-dark-mode') === 'true';

    // 初始化瀑布流
    function initWaterfall() {
        // 获取主容器
        const container = document.querySelector(CONTAINER_SELECTOR);
        if (!container) {
            console.error('未找到帖子列表容器:', CONTAINER_SELECTOR);
            return;
        }

        // 应用瀑布流容器样式
        container.classList.add('waterfall-container');

        // 处理现有帖子
        processPosts();

        // 监听分页加载，处理新添加的帖子
        observeNewPosts(container);

        // 初始化深色模式切换
        initDarkModeToggle();

        // 应用当前主题
        applyTheme();
    }

    // 初始化深色模式切换
    function initDarkModeToggle() {
        const themeToggle = document.querySelector('.bi.bi-brightness-high');
        if (themeToggle) {
            // 避免重复添加事件监听器
            if (themeToggle.hasAttribute('data-theme-enabled')) return;
            themeToggle.setAttribute('data-theme-enabled', 'true');

            themeToggle.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                toggleDarkMode();
            });

            themeToggle.style.cursor = 'pointer';
            themeToggle.title = isDarkMode ? '切换到浅色模式' : '切换到深色模式';
        }
    }

    // 切换深色模式
    function toggleDarkMode() {
        isDarkMode = !isDarkMode;
        localStorage.setItem('jandan-dark-mode', isDarkMode.toString());
        applyTheme();

        // 更新按钮提示
        const themeToggle = document.querySelector('.bi.bi-brightness-high');
        if (themeToggle) {
            themeToggle.title = isDarkMode ? '切换到浅色模式' : '切换到深色模式';
        }
    }

    // 应用主题
    function applyTheme() {
        if (isDarkMode) {
            document.body.classList.add('jandan-dark-theme');
        } else {
            document.body.classList.remove('jandan-dark-theme');
        }
    }

    // 处理帖子样式
    function processPosts() {
        const posts = document.querySelectorAll(POST_SELECTOR);
        posts.forEach(post => {
            post.classList.add('waterfall-post');
            // 移除可能影响布局的内联样式
            post.removeAttribute('style');
        });

        // 添加评论内容点击放大功能
        addCommentZoomFeature();

        console.log('已处理', posts.length, '个帖子');
    }

    // 添加评论内容放大功能
    function addCommentZoomFeature() {
        const commentContents = document.querySelectorAll('.comment-content');

        commentContents.forEach(content => {
            // 避免重复添加事件监听器
            if (content.hasAttribute('data-zoom-enabled')) return;
            content.setAttribute('data-zoom-enabled', 'true');

            // 添加点击事件
            content.addEventListener('click', function (e) {
                // 防止事件冒泡
                e.stopPropagation();

                // 创建放大模态框
                createZoomModal(this);
            });

            // 添加鼠标悬停提示
            content.style.cursor = 'pointer';
            content.title = '点击放大查看';
        });
    }

    // 创建放大模态框
    function createZoomModal(contentElement) {
        // 检查是否已存在模态框
        const existingModal = document.querySelector('.comment-zoom-modal');
        if (existingModal) {
            existingModal.remove();
        }

        // 创建模态框容器
        const modal = document.createElement('div');
        modal.className = 'comment-zoom-modal';

        // 创建模态框内容
        const modalContent = document.createElement('div');
        modalContent.className = 'comment-zoom-content';

        // 克隆评论内容
        const clonedContent = contentElement.cloneNode(true);
        modalContent.appendChild(clonedContent);

        // 创建关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'comment-zoom-close';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => modal.remove();

        modal.appendChild(modalContent);
        modal.appendChild(closeBtn);

        // 添加到页面
        document.body.appendChild(modal);

        // 点击背景关闭
        modal.addEventListener('click', function (e) {
            if (e.target === modal) {
                modal.remove();
            }
        });

        // ESC键关闭
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                modal.remove();
            }
        });
    }

    // 监听新帖子加载
    function observeNewPosts(container) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    // 延迟处理，确保新内容已完全加载
                    setTimeout(processPosts, 500);
                }
            });
        });

        // 配置观察器
        observer.observe(container, {
            childList: true,
            subtree: true
        });

        console.log('已启动分页加载监听器');
    }

    // 添加瀑布流样式
    GM_addStyle(`
        /* 页面容器宽度调整 */
        .container.wrapper.p-0 {
            max-width: 100% !important;
            width: 100% !important;
            padding-left: 20px !important;
            padding-right: 20px !important;
        }

        /* Container容器自适应宽度 */
        .container {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding-left: 15px !important;
            padding-right: 15px !important;
            box-sizing: border-box !important;
            background: none !important;
            background-color: transparent !important;
        }

        /* Row容器自适应宽度 */
        .row {
            width: 100% !important;
            max-width: 100% !important;
            margin-left: 0 !important;
            margin-right: 0 !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            box-sizing: border-box !important;
        }

        /* 主内容区域宽度调整 */
        .main.col-lg-8.col-md-8.col-12 {
            flex: 0 0 85% !important;
            max-width: 85% !important;
            width: 85% !important;
        }

        /* 对应调整侧边栏宽度 */
        .col-lg-4.col-md-4 {
            flex: 0 0 15% !important;
            max-width: 15% !important;
            width: 15% !important;
        }

        /* 瀑布流容器样式 - 真正的瀑布流 */
        #comments.waterfall-container {
            column-count: 3 !important;
            column-gap: 20px !important;
            column-fill: balance !important;
            padding: 20px !important;
            max-width: 95% !important;
            margin: 0 auto !important;
        }

        /* 单个帖子样式 */
        .comment-row.p-2.waterfall-post {
            width: 100% !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
            margin: 0 0 20px 0 !important;
            border: 1px solid #e0e0e0 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
            background: none !important;
            background-color: transparent !important;
            padding: 15px !important;
            box-sizing: border-box !important;
            display: inline-block !important;
        }

        /* 图片自适应 */
        .comment-row.p-2.waterfall-post img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            border-radius: 4px !important;
        }

        /* 页码悬浮样式 - 竖排布局 */
        .page-nav.p-2.border-bottom {
            position: fixed !important;
            right: 16.5% !important;
            top: 50% !important;
            transform: translateY(-50%) !important;
            z-index: 1000 !important;
            background: none !important;
            background-color: transparent !important;
            border: none !important;
            border-radius: 8px !important;
            padding: 10px !important;
            width: 70px !important;
            backdrop-filter: none !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 5px !important;
        }

        /* 页码元素样式 - 统一大小的按钮 */
        .page-nav.p-2.border-bottom a,
        .page-nav.p-2.border-bottom span,
        .page-nav.p-2.border-bottom button {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 50px !important;
            height: 30px !important;
            padding: 0 !important;
            margin: 3px 0 !important;
            text-decoration: none !important;
            border-radius: 6px !important;
            transition: all 0.2s ease !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            border: 1px solid transparent !important;
            box-sizing: border-box !important;
            cursor: pointer !important;
        }

        /* 普通页码链接和按钮 */
        .page-nav.p-2.border-bottom a,
        .page-nav.p-2.border-bottom button {
            background: #f8f9fa !important;
            color:rgb(73, 73, 73) !important;
        }

        .page-nav.p-2.border-bottom a:hover,
        .page-nav.p-2.border-bottom button:hover {
            background: #e9ecef !important;
            border-color: #dee2e6 !important;
            transform: scale(1.05) !important;
        }

        /* 当前页码样式 */
        .page-nav.p-2.border-bottom span {
            background:rgb(100, 100, 100) !important;
            color: white !important;
            border-color: #007bff !important;
        }

        /* 上一页/下一页按钮特殊样式 */
        .page-nav.p-2.border-bottom a[href*="cp-"]:first-child,
        .page-nav.p-2.border-bottom a[href*="cp-"]:last-child,
        .page-nav.p-2.border-bottom button:first-child,
        .page-nav.p-2.border-bottom button:last-child {
            background: #000 !important;
            color: white !important;
        }

        .page-nav.p-2.border-bottom a[href*="cp-"]:first-child:hover,
        .page-nav.p-2.border-bottom a[href*="cp-"]:last-child:hover,
        .page-nav.p-2.border-bottom button:first-child:hover,
        .page-nav.p-2.border-bottom button:last-child:hover {
            background: #000 !important;
        }

        /* 禁用状态的按钮 */
        .page-nav.p-2.border-bottom button:disabled {
            background: #e9ecef !important;
            color:rgb(121, 121, 121) !important;
            cursor: not-allowed !important;
            opacity: 0.6 !important;
        }

        .page-nav.p-2.border-bottom button:disabled:hover {
            transform: none !important;
            background: #e9ecef !important;
        }

        /* 移除原有列表样式 */
        #comments .commentlist {
            list-style: none !important;
            padding: 0 !important;
            margin: 0 !important;
        }

        /* 隐藏浮动窗口 */
        #float-window {
            display: none !important;
        }

        /* 隐藏原始页码导航 */
        .page-nav.p-2 {
            display: none !important;
        }

        /* 导航栏样式 */
        #nav {
            background: none !important;
            background-color: transparent !important;
            background-image: none !important;
        }

        /* 面包屑导航样式 */
        .breadcrumb {
            background: none !important;
            background-color: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 8px 0 !important;
            margin-bottom: 15px !important;
        }

        /* 快速表单按钮样式 */
        .quick-form.p-2 {
            width: 100% !important;
            padding: 8px 16px !important;
            background: #000 !important;
            color: white !important;
            border: 1px solid #000 !important;
            border-radius: 6px !important;
            font-size: 14px !important;
            font-weight: 500 !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            text-decoration: none !important;
            box-sizing: border-box !important;
            margin-bottom: 15px !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
        }

        .quick-form.p-2:hover {
            background: #333 !important;
            border-color: #333 !important;
            transform: translateY(-1px) !important;
        }

        .quick-form.p-2:active {
            transform: translateY(0) !important;
        }

        /* 快速表单内的按钮和输入框 */
        .quick-form.p-2 button,
        .quick-form.p-2 input[type="submit"],
        .quick-form.p-2 input[type="button"] {
            background: #000 !important;
            color: white !important;
            border: 1px solid #000 !important;
            border-radius: 4px !important;
            padding: 6px 12px !important;
            font-size: 13px !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
        }

        .quick-form.p-2 button:hover,
        .quick-form.p-2 input[type="submit"]:hover,
        .quick-form.p-2 input[type="button"]:hover {
            background: #333 !important;
            border-color: #333 !important;
        }

        /* 评论内容放大功能样式 */
        .comment-content {
            transition: all 0.2s ease !important;
        }

        .comment-content:hover {
            background-color: rgba(0, 123, 255, 0.05) !important;
            border-radius: 4px !important;
        }

        /* 放大模态框样式 */
        .comment-zoom-modal {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background: rgba(0, 0, 0, 0.8) !important;
            z-index: 10000 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            padding: 20px !important;
            box-sizing: border-box !important;
        }

        .comment-zoom-content {
            background: white !important;
            border-radius: 12px !important;
            padding: 30px !important;
            max-width: 90% !important;
            max-height: 90% !important;
            overflow-y: auto !important;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
            position: relative !important;
            font-size: 16px !important;
            line-height: 1.6 !important;
        }

        .comment-zoom-content img {
            max-width: 100% !important;
            height: auto !important;
            border-radius: 8px !important;
            margin: 10px 0 !important;
        }

        .comment-zoom-close {
            position: absolute !important;
            top: 15px !important;
            right: 15px !important;
            background: #ff4757 !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            width: 40px !important;
            height: 40px !important;
            font-size: 24px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.2s ease !important;
            z-index: 10001 !important;
        }

        .comment-zoom-close:hover {
            background: #ff3742 !important;
            transform: scale(1.1) !important;
        }

        /* 深色模式样式 */
        body.jandan-dark-theme {
            background-color: #1a1a1a !important;
            color: #e0e0e0 !important;
        }

        /* 深色模式 - 单个帖子样式 */
        body.jandan-dark-theme .comment-row.p-2.waterfall-post {
            background: none !important;
            background-color: transparent !important;
            border-color: #404040 !important;
            color: #e0e0e0 !important;
        }

        /* 深色模式 - 帖子内的文本和链接 */
        body.jandan-dark-theme .comment-row.p-2.waterfall-post * {
            color: #e0e0e0 !important;
        }

        body.jandan-dark-theme .comment-row.p-2.waterfall-post a {
            color: #66b3ff !important;
        }

        body.jandan-dark-theme .comment-row.p-2.waterfall-post a:hover {
            color: #4da6ff !important;
        }

        /* 深色模式 - 页码悬浮样式 */
        body.jandan-dark-theme .page-nav.p-2.border-bottom {
            background: none !important;
            background-color: transparent !important;
            border: none !important;
        }

        body.jandan-dark-theme .page-nav.p-2.border-bottom a,
        body.jandan-dark-theme .page-nav.p-2.border-bottom button {
            background: #404040 !important;
            color: #e0e0e0 !important;
        }

        body.jandan-dark-theme .page-nav.p-2.border-bottom a:hover,
        body.jandan-dark-theme .page-nav.p-2.border-bottom button:hover {
            background: #555555 !important;
            border-color: #666666 !important;
        }

        body.jandan-dark-theme .page-nav.p-2.border-bottom span {
            background: #0d6efd !important;
            color: white !important;
        }

        /* 深色模式 - 上一页/下一页按钮 */
        body.jandan-dark-theme .page-nav.p-2.border-bottom a[href*="cp-"]:first-child,
        body.jandan-dark-theme .page-nav.p-2.border-bottom a[href*="cp-"]:last-child,
        body.jandan-dark-theme .page-nav.p-2.border-bottom button:first-child,
        body.jandan-dark-theme .page-nav.p-2.border-bottom button:last-child {
            background: #e0e0e0 !important;
            color: #1a1a1a !important;
        }

        body.jandan-dark-theme .page-nav.p-2.border-bottom a[href*="cp-"]:first-child:hover,
        body.jandan-dark-theme .page-nav.p-2.border-bottom a[href*="cp-"]:last-child:hover,
        body.jandan-dark-theme .page-nav.p-2.border-bottom button:first-child:hover,
        body.jandan-dark-theme .page-nav.p-2.border-bottom button:last-child:hover {
            background: #cccccc !important;
        }

        /* 深色模式 - 禁用状态按钮 */
        body.jandan-dark-theme .page-nav.p-2.border-bottom button:disabled {
            background: #333333 !important;
            color: #666666 !important;
        }

        /* 深色模式 - 快速表单按钮 */
        body.jandan-dark-theme .quick-form.p-2 {
            background: #e0e0e0 !important;
            color: #1a1a1a !important;
            border-color: #e0e0e0 !important;
        }

        body.jandan-dark-theme .quick-form.p-2:hover {
            background: #cccccc !important;
            border-color: #cccccc !important;
        }

        body.jandan-dark-theme .quick-form.p-2 button,
        body.jandan-dark-theme .quick-form.p-2 input[type="submit"],
        body.jandan-dark-theme .quick-form.p-2 input[type="button"] {
            background: #e0e0e0 !important;
            color: #1a1a1a !important;
            border-color: #e0e0e0 !important;
        }

        body.jandan-dark-theme .quick-form.p-2 button:hover,
        body.jandan-dark-theme .quick-form.p-2 input[type="submit"]:hover,
        body.jandan-dark-theme .quick-form.p-2 input[type="button"]:hover {
            background: #cccccc !important;
            border-color: #cccccc !important;
        }

        /* 深色模式 - 评论内容悬停 */
        body.jandan-dark-theme .comment-content:hover {
            background-color: rgba(13, 110, 253, 0.1) !important;
        }

        /* 深色模式 - 放大模态框 */
        body.jandan-dark-theme .comment-zoom-content {
            background: #2d2d2d !important;
            color: #e0e0e0 !important;
        }

        /* 深色模式 - 容器和布局 */
        body.jandan-dark-theme .container,
        body.jandan-dark-theme .row,
        body.jandan-dark-theme .main {
            background-color: transparent !important;
        }

        /* 深色模式 - 面包屑 */
        body.jandan-dark-theme .breadcrumb {
            color: #cccccc !important;
        }

        body.jandan-dark-theme .breadcrumb a {
            color: #0d6efd !important;
        }

        /* dark-model 模式下的评论卡片黑色边框 */
        .dark-model .comment-row.p-2.waterfall-post {
            border-color: #333333 !important;
        }

        /* d-flex 元素左右缩进 */
        .d-flex.align-items-center.flex-grow-1 {
            padding-left: 10px !important;
            padding-right: 10px !important;
        }

        /* 自适应瀑布流列数 */
        @media (min-width: 1400px) {
            #comments.waterfall-container {
                column-count: 3 !important;
                column-gap: 25px !important;
                padding: 25px !important;
            }
        }

        @media (min-width: 1200px) and (max-width: 1399px) {
            #comments.waterfall-container {
                column-count: 3 !important;
                column-gap: 20px !important;
                padding: 20px !important;
            }
        }

        @media (min-width: 992px) and (max-width: 1199px) {
            #comments.waterfall-container {
                column-count: 3 !important;
                column-gap: 18px !important;
                padding: 18px !important;
            }
        }

        @media (min-width: 768px) and (max-width: 991px) {
            #comments.waterfall-container {
                column-count: 3 !important;
                column-gap: 15px !important;
                padding: 15px !important;
            }
        }
            /* 移动端页码调整 */
        @media (min-width: 576px) and (max-width: 767px) {
            #comments.waterfall-container {
                column-count: 2 !important;
                column-gap: 12px !important;
                padding: 12px !important;
            }
        }

        @media (max-width: 575px) {
            #comments.waterfall-container {
                column-count: 1 !important;
                column-gap: 10px !important;
                padding: 10px !important;
            }

            /* 移动端Container调整 */
            .container {
                padding-left: 10px !important;
                padding-right: 10px !important;
            }

            .page-nav.p-2.border-bottom {
                left: 10px !important;
                width: 50px !important;
                padding: 8px !important;
                gap: 3px !important;
            }

            .page-nav.p-2.border-bottom a,
            .page-nav.p-2.border-bottom span,
            .page-nav.p-2.border-bottom button {
                width: 34px !important;
                height: 20px !important;
                font-size: 12px !important;
            }

            /* 移动端快速表单按钮调整 */
            .quick-form.p-2 {
                padding: 6px 12px !important;
                font-size: 12px !important;
            }

            .quick-form.p-2 button,
            .quick-form.p-2 input[type="submit"],
            .quick-form.p-2 input[type="button"] {
                padding: 4px 8px !important;
                font-size: 11px !important;
            }

            /* 移动端放大模态框调整 */
            .comment-zoom-content {
                padding: 20px !important;
                font-size: 14px !important;
            }

            .comment-zoom-close {
                width: 35px !important;
                height: 35px !important;
                font-size: 20px !important;
            }
        }
    `);

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWaterfall);
    } else {
        initWaterfall();
    }
})();