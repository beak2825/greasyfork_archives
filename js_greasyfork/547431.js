// ==UserScript==
// @name         知乎终极美化
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  知乎暗黑模式 + 内容居中 + 去广告 + 隐藏顶栏
// @author       You
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547431/%E7%9F%A5%E4%B9%8E%E7%BB%88%E6%9E%81%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/547431/%E7%9F%A5%E4%B9%8E%E7%BB%88%E6%9E%81%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即设置知乎暗黑模式
    document.cookie = 'theme=dark; expires=Thu, 18 Dec 2031 12:00:00 GMT; path=/';

    let isTopBarHidden = false;
    let lastScrollY = 0;

    // 等待页面加载并应用样式
    function initScript() {
        if (document.documentElement) {
            document.documentElement.setAttribute('data-theme', 'dark');
            addAllStyles();
            setupScrollBehavior();
            addToggleButton();
        } else {
            setTimeout(initScript, 50);
        }
    }

    // 添加所有样式
    function addAllStyles() {
        const style = document.createElement('style');
        style.id = 'zhihu-ultimate-style';
        style.innerHTML = `
            /* ========== 护眼暗黑模式样式 ========== */
            html, body {
                background: #1e1e1e !important;
                color: #e0e0e0 !important;
            }

            /* 主容器暗黑化 */
            .App-main, .Question-main, .Topstory-container,
            .Search-container, .Profile-main, .Post-content {
                background: #1e1e1e !important;
            }

            /* 顶部导航栏 */
            .AppHeader {
                background: #2d2d2d !important;
                border-bottom: 1px solid #404040 !important;
                transition: transform 0.3s ease !important;
            }

            .AppHeader.hidden {
                transform: translateY(-100%) !important;
            }

            /* 卡片样式 - 移除边框 */
            .Card, .QuestionHeader, .AnswerItem,
            .TopstoryItem, .ContentItem, .List-item {
                background: #2a2a2a !important;
                border: none !important;
                border-radius: 6px !important;
            }

            /* 操作按钮区域 - 完全移除边框 */
            .ContentItem-actions, .AnswerItem-actions,
            .VoteButton, .ContentItem-actions button,
            .Button--plain, .Button--grey {
                background: transparent !important;
                border: none !important;
                color: #a0a0a0 !important;
                padding: 4px 8px !important;
            }

            .VoteButton:hover, .ContentItem-actions button:hover,
            .Button--plain:hover, .Button--grey:hover {
                background: rgba(64, 64, 64, 0.5) !important;
                color: #d4d4d4 !important;
            }

            .VoteButton.is-active {
                background: rgba(126, 179, 214, 0.15) !important;
                color: #7eb3d6 !important;
            }

            /* 文字颜色 - 使用柔和但清晰的灰色 */
            .ContentItem-title, .QuestionHeader-title,
            .RichContent, .RichText, .Post-content,
            .AnswerItem-content, .TopstoryItem-content,
            h1, h2, h3, h4, h5, h6, p, span, div {
                color: #d4d4d4 !important;
                line-height: 1.8 !important;
                letter-spacing: 0.3px !important;
            }

            /* 正文内容优化阅读体验 */
            .RichContent, .RichText, .Post-content {
                font-size: 16px !important;
                line-height: 1.8 !important;
                letter-spacing: 0.5px !important;
                word-spacing: 1px !important;
                text-rendering: optimizeLegibility !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
            }

            /* 段落间距优化 */
            .RichContent p, .RichText p, .Post-content p {
                margin-bottom: 1.2em !important;
                text-indent: 0 !important;
            }

            /* 标题层次优化 */
            .RichContent h1, .RichText h1, .Post-content h1 {
                font-size: 1.6em !important;
                margin: 1.5em 0 0.8em 0 !important;
                font-weight: 600 !important;
                color: #ffffff !important;
            }

            .RichContent h2, .RichText h2, .Post-content h2 {
                font-size: 1.4em !important;
                margin: 1.3em 0 0.7em 0 !important;
                font-weight: 600 !important;
                color: #f0f0f0 !important;
            }

            .RichContent h3, .RichText h3, .Post-content h3 {
                font-size: 1.2em !important;
                margin: 1.2em 0 0.6em 0 !important;
                font-weight: 500 !important;
                color: #e8e8e8 !important;
            }

            /* 列表优化 */
            .RichContent ul, .RichText ul, .Post-content ul,
            .RichContent ol, .RichText ol, .Post-content ol {
                margin: 1em 0 1em 2em !important;
                line-height: 1.8 !important;
            }

            .RichContent li, .RichText li, .Post-content li {
                margin-bottom: 0.5em !important;
                color: #d4d4d4 !important;
            }

            /* 次要文字颜色 */
            .ContentItem-meta, .AnswerItem-meta,
            .AuthorInfo-detail, .Voters {
                color: #a0a0a0 !important;
            }

            /* 链接颜色 - 使用柔和的淡蓝色 */
            a {
                color: #7eb3d6 !important;
            }

            a:hover {
                color: #9bc5e0 !important;
                text-decoration: underline !important;
            }

            /* 问题标题链接保持淡蓝色便于识别 */
            .ContentItem-title a {
                color: #7eb3d6 !important;
            }

            .ContentItem-title a:hover {
                color: #9bc5e0 !important;
            }

            /* 输入框和搜索框 - 移除边框 */
            input, textarea, .Input, .SearchBar input,
            .Input-wrapper, .CommentEditorV2-inputWrap {
                background: #333333 !important;
                color: #ffffff !important;
                border: none !important;
                border-radius: 4px !important;
            }

            input:focus, textarea:focus, .Input:focus {
                outline: none !important;
                box-shadow: 0 0 0 2px rgba(126, 179, 214, 0.3) !important;
            }

            /* 按钮样式优化 - 移除所有边框 */
            button, .Button {
                background: linear-gradient(135deg, #404040, #4a4a4a) !important;
                color: #ffffff !important;
                border: none !important;
                border-radius: 4px !important;
                box-shadow: 0 1px 3px rgba(0,0,0,0.3) !important;
                transition: all 0.2s ease !important;
            }

            button:hover, .Button:hover {
                background: linear-gradient(135deg, #505050, #5a5a5a) !important;
                box-shadow: 0 2px 6px rgba(0,0,0,0.4) !important;
                transform: translateY(-1px) !important;
            }

            /* 主要按钮优化 */
            .Button--primary {
                background: linear-gradient(135deg, #7eb3d6, #9bc5e0) !important;
                color: #ffffff !important;
                border: none !important;
            }

            .Button--primary:hover {
                background: linear-gradient(135deg, #6ca3c7, #7eb3d6) !important;
                transform: translateY(-1px) !important;
            }

            /* 图片稍微调暗但保持可见度 */
            img:not(.Avatar-img):not(.UserAvatar-img) {
                opacity: 0.9 !important;
            }

            /* 代码块 - 使用经典的深灰背景 */
            pre, code {
                background: #282828 !important;
                color: #f8f8f2 !important;
                border: 1px solid #404040 !important;
            }

            /* 引用块 */
            blockquote {
                background: #2a2a2a !important;
                border-left: 4px solid #66b3ff !important;
                color: #cccccc !important;
            }

            /* 侧边栏 */
            .Question-sideColumn, .GlobalSideBar {
                background: #2a2a2a !important;
            }

            /* 评论区 */
            .CommentItemV2, .CommentsV2 {
                background: #252525 !important;
                border-color: #404040 !important;
            }

            /* 标签 */
            .Tag {
                background: #404040 !important;
                color: #ffffff !important;
                border: 1px solid #666666 !important;
            }

            .Tag:hover {
                background: #505050 !important;
            }

            /* 分割线 */
            hr, .Divider {
                border-color: #404040 !important;
            }

            /* 滚动条美化 */
            ::-webkit-scrollbar {
                width: 10px !important;
                height: 10px !important;
            }

            ::-webkit-scrollbar-track {
                background: #2a2a2a !important;
            }

            ::-webkit-scrollbar-thumb {
                background: #555555 !important;
                border-radius: 5px !important;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: #666666 !important;
            }

            /* ========== 内容居中样式 ========== */

            /* 首页内容居中 */
            .Topstory-container {
                max-width: 1200px !important;
                margin: 0 auto !important;
                width: 100% !important;
            }

            .Topstory-mainColumn {
                width: 100% !important;
            }

            /* 问题页内容居中 */
            .Question-main {
                max-width: 1200px !important;
                margin: 0 auto !important;
                width: 100% !important;
            }

            .Question-mainColumn {
                width: 100% !important;
            }

            /* 搜索页内容居中 */
            .Search-container, .ContentLayout {
                max-width: 1200px !important;
                margin: 0 auto !important;
                width: 100% !important;
            }

            .SearchMain, .ContentLayout-mainColumn {
                width: 100% !important;
            }

            /* 专栏页内容居中 */
            .Post-content {
                max-width: 900px !important;
                margin: 0 auto !important;
                padding: 20px !important;
            }

            /* 用户主页内容居中 */
            .Profile-main {
                max-width: 1200px !important;
                margin: 0 auto !important;
                width: 100% !important;
            }

            /* 隐藏侧边栏，让主内容占满 */
            .Question-sideColumn,
            .GlobalSideBar,
            .Topstory-mainColumn + div,
            .Question-mainColumn + div,
            .SearchMain + div,
            .ContentLayout-sideColumn,
            [data-za-detail-view-path-module="RightSideBar"] {
                display: none !important;
            }

            /* ========== 去广告样式 ========== */

            /* 屏蔽各类广告卡片 */
            .TopstoryItem--advertCard,
            .Pc-card.Card,
            .Pc-Business-Card-PcTopFeedBanner,
            .AdblockBanner,
            .KfeCollection,
            .Recommendations-Main,
            .Question-mainColumnLogin,
            [data-za-module*="ad"],
            [class*="Ad"],
            [class*="ad-"],
            [id*="advertisement"] {
                display: none !important;
            }

            /* 屏蔽首页活动广告 */
            main.App-main > .Topstory > div:not(.Topstory-container) {
                display: none !important;
            }

            /* 屏蔽推荐内容（可选，如果你想看推荐可以删除这行） */
            .Recommendations {
                display: none !important;
            }

            /* 屏蔽登录提示 */
            .Modal-backdrop,
            .signFlowModal,
            .AppBanner,
            .Banner {
                display: none !important;
            }

            /* ========== 新增实用功能样式 ========== */

            /* 快速返回顶部按钮 */
            #back-to-top {
                position: fixed !important;
                bottom: 20px !important;
                right: 80px !important;
                width: 50px !important;
                height: 50px !important;
                background: rgba(42, 42, 42, 0.9) !important;
                color: #d4d4d4 !important;
                border: none !important;
                border-radius: 50% !important;
                display: none !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                z-index: 99998 !important;
                font-size: 20px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
            }

            #back-to-top:hover {
                background: rgba(60, 60, 60, 0.9) !important;
                transform: scale(1.1) !important;
            }

            /* 阅读进度条 */
            #reading-progress {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                width: 0% !important;
                height: 3px !important;
                background: linear-gradient(90deg, #7eb3d6, #9bc5e0) !important;
                z-index: 99999 !important;
                transition: width 0.1s ease !important;
            }

            /* 图片预览增强 */
            .image-preview-enhanced {
                cursor: zoom-in !important;
                transition: all 0.3s ease !important;
            }

            .image-preview-enhanced:hover {
                opacity: 1 !important;
                transform: scale(1.02) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.3) !important;
            }

            /* 问题预览卡片增强 */
            .ContentItem:hover {
                transform: translateY(-2px) !important;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2) !important;
                transition: all 0.3s ease !important;
            }

            @media (max-width: 1400px) {
                .Topstory-container,
                .Question-main,
                .Search-container,
                .ContentLayout,
                .Profile-main {
                    max-width: 95% !important;
                    padding: 0 20px !important;
                }
            }

            @media (max-width: 768px) {
                .Post-content {
                    max-width: 100% !important;
                    padding: 15px !important;
                }
            }
        `;

        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                if (document.head) {
                    document.head.appendChild(style);
                }
            });
        }
    }

    // 设置滚动隐藏顶栏
    function setupScrollBehavior() {
        window.addEventListener('scroll', function() {
            const currentScrollY = window.scrollY;
            const header = document.querySelector('.AppHeader');

            if (!header) return;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // 向下滚动且超过100px，隐藏顶栏
                if (!isTopBarHidden) {
                    header.classList.add('hidden');
                    isTopBarHidden = true;
                }
            } else if (currentScrollY < lastScrollY) {
                // 向上滚动，显示顶栏
                if (isTopBarHidden) {
                    header.classList.remove('hidden');
                    isTopBarHidden = false;
                }
            }

            lastScrollY = currentScrollY;
        });
    }

    // 添加功能切换按钮
    function addToggleButton() {
        // 等待页面完全加载
        setTimeout(() => {
            if (document.getElementById('zhihu-toggle-btn')) return;

            const button = document.createElement('div');
            button.id = 'zhihu-toggle-btn';
            button.innerHTML = '⚙️';
            button.style.cssText = `
                position: fixed !important;
                top: 80px !important;
                right: 20px !important;
                width: 50px !important;
                height: 50px !important;
                background: #21262d !important;
                color: #c9d1d9 !important;
                border: 2px solid #30363d !important;
                border-radius: 50% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                cursor: pointer !important;
                z-index: 99999 !important;
                font-size: 18px !important;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3) !important;
                transition: all 0.3s ease !important;
            `;

            // 悬停效果
            button.onmouseenter = function() {
                this.style.transform = 'scale(1.1)';
                this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
            };

            button.onmouseleave = function() {
                this.style.transform = 'scale(1)';
                this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            };

            let isDark = true;
            button.onclick = function() {
                const customStyle = document.getElementById('zhihu-ultimate-style');
                const header = document.querySelector('.AppHeader');

                if (isDark) {
                    // 切换到浅色模式
                    document.cookie = 'theme=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
                    document.documentElement.setAttribute('data-theme', 'light');
                    if (customStyle) customStyle.remove();
                    if (header) header.classList.remove('hidden');
                    this.innerHTML = '☀️';
                    this.style.background = '#fff';
                    this.style.color = '#000';
                    this.style.borderColor = '#ddd';
                    isDark = false;
                } else {
                    // 切换到暗黑模式
                    document.cookie = 'theme=dark; expires=Thu, 18 Dec 2031 12:00:00 GMT; path=/';
                    document.documentElement.setAttribute('data-theme', 'dark');
                    addAllStyles();
                    this.innerHTML = '⚙️';
                    this.style.background = '#21262d';
                    this.style.color = '#c9d1d9';
                    this.style.borderColor = '#30363d';
                    isDark = true;
                }
            };

            document.body.appendChild(button);
        }, 2000);
    }

    // 处理单页应用的路由变化
    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(() => {
                if (document.documentElement.getAttribute('data-theme') === 'dark') {
                    addAllStyles();
                }
            }, 500);
        }
    });

    // 启动脚本
    initScript();

    // 启动增强功能
    addEnhancedFeatures();

    // 添加增强功能
    function addEnhancedFeatures() {
        setTimeout(() => {
            addBackToTopButton();
            addReadingProgress();
            enhanceImages();
            enhanceContentItems();
        }, 2000);
    }

    // 返回顶部按钮
    function addBackToTopButton() {
        if (document.getElementById('back-to-top')) return;

        const backBtn = document.createElement('div');
        backBtn.id = 'back-to-top';
        backBtn.innerHTML = '↑';
        backBtn.onclick = () => window.scrollTo({top: 0, behavior: 'smooth'});
        document.body.appendChild(backBtn);

        window.addEventListener('scroll', () => {
            const btn = document.getElementById('back-to-top');
            if (window.scrollY > 300) {
                btn.style.display = 'flex';
            } else {
                btn.style.display = 'none';
            }
        });
    }

    // 阅读进度条
    function addReadingProgress() {
        if (document.getElementById('reading-progress')) return;

        const progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight - winHeight;
            const scrollTop = window.pageYOffset;
            const progress = (scrollTop / docHeight) * 100;
            document.getElementById('reading-progress').style.width = progress + '%';
        });
    }

    // 增强图片效果
    function enhanceImages() {
        const images = document.querySelectorAll('.RichContent img, .RichText img, .Post-content img');
        images.forEach(img => {
            img.classList.add('image-preview-enhanced');
            img.addEventListener('click', () => {
                // 简单的图片放大效果
                if (img.style.transform === 'scale(2)') {
                    img.style.transform = '';
                    img.style.zIndex = '';
                    img.style.position = '';
                } else {
                    img.style.transform = 'scale(2)';
                    img.style.zIndex = '9999';
                    img.style.position = 'relative';
                }
            });
        });
    }

    // 增强内容项目
    function enhanceContentItems() {
        const observer = new MutationObserver(() => {
            const items = document.querySelectorAll('.ContentItem, .TopstoryItem');
            items.forEach(item => {
                if (!item.classList.contains('enhanced')) {
                    item.classList.add('enhanced');

                    // 添加阅读时间估算
                    const content = item.querySelector('.RichContent, .ContentItem-title');
                    if (content) {
                        const wordCount = content.textContent.length;
                        const readTime = Math.ceil(wordCount / 500); // 假设每分钟读500字
                        if (readTime > 1) {
                            const timeLabel = document.createElement('span');
                            timeLabel.style.cssText = `
                                color: #a0a0a0 !important;
                                font-size: 12px !important;
                                margin-left: 10px !important;
                            `;
                            timeLabel.textContent = `约${readTime}分钟阅读`;
                            const meta = item.querySelector('.ContentItem-meta');
                            if (meta) meta.appendChild(timeLabel);
                        }
                    }
                }
            });
        });

        observer.observe(document.body, {childList: true, subtree: true});
    }

    // 页面加载完成后启动路由监听
    window.addEventListener('load', () => {
        observer.observe(document, {subtree: true, childList: true});
    });

    if (document.readyState === 'complete') {
        observer.observe(document, {subtree: true, childList: true});
    }

})();