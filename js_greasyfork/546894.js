// ==UserScript==
// @name         知乎首页元素屏蔽—知乎摸鱼2025.08
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽知乎首页的顶部导航栏和右侧边栏
// @author       Warfarin
// @license MIT
// @match        https://www.zhihu.com/*
// @match        https://zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546894/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD%E2%80%94%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC202508.user.js
// @updateURL https://update.greasyfork.org/scripts/546894/%E7%9F%A5%E4%B9%8E%E9%A6%96%E9%A1%B5%E5%85%83%E7%B4%A0%E5%B1%8F%E8%94%BD%E2%80%94%E7%9F%A5%E4%B9%8E%E6%91%B8%E9%B1%BC202508.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    function waitForElements() {
        // 屏蔽顶部导航栏
        const headerSelectors = [
            'div.css-lgijre', // 顶部导航栏容器
            'header.AppHeader', // 应用头部
            '.AppHeader', // 应用头部
            '.css-lgijre' // 顶部导航栏
        ];

        // 屏蔽右侧边栏
        const sidebarSelectors = [
            'div[style*="position: sticky; top: 62px;"]', // 右侧边栏
            '.GlobalSideBar', // 全局侧边栏
            '.css-19idom', // 创作中心卡片
            '.css-173vipd', // 推荐关注卡片
            '.css-18gpi2u' // 圈子卡片
        ];

        // 屏蔽发布想法区域
        const writeAreaSelectors = [
            'div.WriteArea.Card.css-1x8qqvf', // 发布想法区域
            '.WriteArea', // 发布想法区域
            '.css-1x8qqvf' // 发布想法区域
        ];

        // 屏蔽顶部导航栏
        headerSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                    console.log('已屏蔽顶部导航栏元素:', selector);
                }
            });
        });

        // 屏蔽右侧边栏
        sidebarSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                    console.log('已屏蔽右侧边栏元素:', selector);
                }
            });
        });

        // 屏蔽发布想法区域
        writeAreaSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                    console.log('已屏蔽发布想法区域:', selector);
                }
            });
        });

        // 屏蔽分享、收藏、举报等按钮
        const actionButtonSelectors = [
            // 分享按钮
            'button[aria-label*="分享"]',
            'button:has(svg[class*="Share"])',
            '.ShareMenu',
            '.ShareMenu-toggler',

            // 收藏按钮
            'button[aria-label*="收藏"]',
            'button:has(svg[class*="Star"])',
            'button:has(svg[class*="Star Button-zi"])',

            // 举报按钮
            'button[aria-label*="举报"]',
            'button:has(svg[class*="FlagFill24"])',
            'button:has(svg[class*="Flag"])',

            // 喜欢按钮
            'button[aria-label*="喜欢"]',
            'button:has(svg[class*="Heart"])',
            'button:has(svg[class*="Heart Button-zi"])',

            // 更多按钮
            'button[aria-label*="更多"]',
            '.OptionsButton',
            'button:has(svg[class*="Dots"])'
        ];

        actionButtonSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element) {
                    element.style.display = 'none';
                    console.log('已屏蔽按钮:', selector);
                }
            });
        });

        // 调整主内容区域的样式，确保布局正常
        const mainContent = document.querySelector('.Topstory-container, .Topstory-main, .css-1nqy7uv');
        if (mainContent) {
            mainContent.style.marginLeft = 'auto';
            mainContent.style.marginRight = 'auto';
            mainContent.style.width = '800px'; // 设置固定宽度
            mainContent.style.maxWidth = '800px';
            // 不设置textAlign，保持内容左对齐
        }

        // 调整主内容容器居中
        const topstoryContent = document.querySelector('#TopstoryContent, .Topstory-content');
        if (topstoryContent) {
            topstoryContent.style.marginLeft = 'auto';
            topstoryContent.style.marginRight = 'auto';
            topstoryContent.style.width = '800px';
            topstoryContent.style.maxWidth = '800px';
            // 不设置textAlign，保持内容左对齐
        }

        // 调整赞同按钮样式，使其与评论按钮一致
        const voteButtons = document.querySelectorAll('.VoteButton');
        voteButtons.forEach(button => {
            if (button) {
                // 获取评论按钮的样式作为参考
                const commentButton = button.parentElement?.parentElement?.querySelector('button:has(svg[class*="Comment"])');
                if (commentButton) {
                    // 完全重写按钮的className，移除所有VoteButton相关类
                    button.className = 'Button FEfUrdfMIKpQDJDqkjte Button--plain Button--withIcon Button--withLabel';

                    // 强制移除所有VoteButton相关的样式
                    button.classList.remove('VoteButton', 'VoteButton--up', 'VoteButton--down');

                    // 设置内联样式确保样式一致 - 使用!important覆盖所有CSS
                    button.style.setProperty('display', 'inline-flex', 'important');
                    button.style.setProperty('align-items', 'center', 'important');
                    button.style.setProperty('border', 'none', 'important');
                    button.style.setProperty('background', 'transparent', 'important');
                    button.style.setProperty('background-color', 'transparent', 'important');
                    button.style.setProperty('color', 'inherit', 'important');
                    button.style.setProperty('padding', '0', 'important');
                    button.style.setProperty('margin', '0', 'important');
                    button.style.setProperty('font-size', 'inherit', 'important');
                    button.style.setProperty('font-weight', 'inherit', 'important');
                    button.style.setProperty('box-shadow', 'none', 'important');
                    button.style.setProperty('outline', 'none', 'important');
                    button.style.setProperty('border-radius', '0', 'important');
                    button.style.setProperty('min-height', 'auto', 'important');
                    button.style.setProperty('height', 'auto', 'important');
                    button.style.setProperty('line-height', 'inherit', 'important');

                    // 移除所有可能的伪元素样式
                    button.style.setProperty('--zhihu-button-primary-bg', 'transparent', 'important');
                    button.style.setProperty('--zhihu-button-primary-border', 'none', 'important');
                    button.style.setProperty('--zhihu-button-primary-color', 'inherit', 'important');

                    // 添加CSS规则来强制覆盖所有可能的样式
                    const styleId = 'zhihu-vote-button-override';
                    if (!document.getElementById(styleId)) {
                        const style = document.createElement('style');
                        style.id = styleId;
                        style.textContent = `
                            .VoteButton,
                            button[class*="VoteButton"],
                            button[aria-label*="赞同"],
                            button[aria-label*="反对"] {
                                background: transparent !important;
                                background-color: transparent !important;
                                border: none !important;
                                color: inherit !important;
                                box-shadow: none !important;
                                outline: none !important;
                                border-radius: 0 !important;
                                padding: 0 !important;
                                margin: 0 !important;
                                font-size: inherit !important;
                                font-weight: inherit !important;
                                min-height: auto !important;
                                height: auto !important;
                                line-height: inherit !important;
                            }

                            .VoteButton:hover,
                            .VoteButton:focus,
                            .VoteButton:active,
                            button[class*="VoteButton"]:hover,
                            button[class*="VoteButton"]:focus,
                            button[class*="VoteButton"]:active {
                                background: transparent !important;
                                background-color: transparent !important;
                                border: none !important;
                                color: inherit !important;
                                box-shadow: none !important;
                                outline: none !important;
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    console.log('已调整赞同按钮样式');
                }
            }
        });

        // 隐藏反对按钮
        const downVoteButtons = document.querySelectorAll('.VoteButton--down');
        downVoteButtons.forEach(button => {
            if (button) {
                button.style.display = 'none';
                console.log('已隐藏反对按钮');
            }
        });
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }

    // 监听动态加载的内容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                waitForElements();
            }
        });
    });

    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

            // 定期检查（防止某些元素被重新显示）
        setInterval(waitForElements, 2000);

        // 定期检查缩略图状态（与全局状态保持一致）
        setInterval(() => {
            if (!globalThumbnailState) {
                const thumbnails = document.querySelectorAll('.RichContent-cover, .RichContent-cover-inner, img[class*="css-1phd9a0"]');
                thumbnails.forEach(thumbnail => {
                    if (thumbnail.style.display !== 'none') {
                        thumbnail.style.display = 'none';
                        thumbnail.style.opacity = '0';
                    }
                });
            }
        }, 3000); // 每3秒检查一次

    // 创建控制按钮
    function createControlButton() {
        const button = document.createElement('div');
        button.id = 'zhihu-control-button';
        button.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: #fff;
                border: 2px solid #1772F6;
                border-radius: 8px;
                padding: 10px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                cursor: pointer;
                user-select: none;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
                <div style="
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #1772F6;
                    font-weight: 600;
                ">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>知乎优化</span>
                </div>
                <div style="
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid #e0e0e0;
                    font-size: 12px;
                    color: #666;
                ">
                    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
                        <input type="checkbox" id="show-thumbnails" checked style="cursor: pointer;">
                        显示缩略图
                    </label>
                </div>
            </div>
        `;

        document.body.appendChild(button);

        // 添加点击事件
        button.addEventListener('click', function(e) {
            if (e.target.type !== 'checkbox') {
                // 切换显示状态
                if (button.style.display === 'none') {
                    button.style.display = 'block';
                } else {
                    button.style.display = 'none';
                }
            }
        });

        // 添加键盘快捷键显示按钮（按ESC键显示）
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && button.style.display === 'none') {
                button.style.display = 'block';
            }
        });

        // 添加缩略图控制功能
        const checkbox = button.querySelector('#show-thumbnails');
        checkbox.addEventListener('change', function() {
            toggleThumbnailsEnhanced(this.checked);
        });

        console.log('控制按钮已创建');
    }

    // 控制缩略图显示/隐藏
    function toggleThumbnails(show) {
        const thumbnails = document.querySelectorAll('.RichContent-cover, .RichContent-cover-inner, img[class*="css-1phd9a0"]');

        thumbnails.forEach(thumbnail => {
            if (show) {
                thumbnail.style.display = '';
                thumbnail.style.opacity = '1';
            } else {
                thumbnail.style.display = 'none';
                thumbnail.style.opacity = '0';
            }
        });

        console.log(show ? '已显示缩略图' : '已隐藏缩略图');
    }

    // 全局缩略图显示状态
    let globalThumbnailState = true; // 默认显示

    // 增强的缩略图控制函数
    function toggleThumbnailsEnhanced(show) {
        globalThumbnailState = show;
        toggleThumbnails(show);

        // 如果隐藏缩略图，设置定时器持续监控新内容
        if (!show) {
            // 清除之前的定时器
            if (window.thumbnailMonitorTimer) {
                clearInterval(window.thumbnailMonitorTimer);
            }

            // 设置新的监控定时器
            window.thumbnailMonitorTimer = setInterval(() => {
                const newThumbnails = document.querySelectorAll('.RichContent-cover, .RichContent-cover-inner, img[class*="css-1phd9a0"]');
                newThumbnails.forEach(thumbnail => {
                    if (thumbnail.style.display !== 'none') {
                        thumbnail.style.display = 'none';
                        thumbnail.style.opacity = '0';
                    }
                });
            }, 1000); // 每秒检查一次
        } else {
            // 如果显示缩略图，清除监控定时器
            if (window.thumbnailMonitorTimer) {
                clearInterval(window.thumbnailMonitorTimer);
                window.thumbnailMonitorTimer = null;
            }
        }
    }

    // 页面加载完成后创建控制按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createControlButton);
    } else {
        createControlButton();
    }

    console.log('知乎首页元素屏蔽器已启动');
})();