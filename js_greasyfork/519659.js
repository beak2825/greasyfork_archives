// ==UserScript==
// @name         IT之家移动页面热门评论高亮
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  在全部评论中匹配热门评论并高亮显示，避免重复查看热门评论、精简评论样式、隐藏0赞0反按钮、自动点击更多评论、根据评论总数隐藏一部分低赞低反评论
// @author       hui-Zz
// @match        http*://m.ithome.com/*
// @match        http*://bbs.hupu.com/*
// @icon         https://www.emojiall.com/en/header-svg/%F0%9F%93%B0.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519659/IT%E4%B9%8B%E5%AE%B6%E7%A7%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E7%83%AD%E9%97%A8%E8%AF%84%E8%AE%BA%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519659/IT%E4%B9%8B%E5%AE%B6%E7%A7%BB%E5%8A%A8%E9%A1%B5%E9%9D%A2%E7%83%AD%E9%97%A8%E8%AF%84%E8%AE%BA%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /* 站点配置 */
    const SITE_CONFIG = {
        'm.ithome.com': {
            hotCommentSelector: '.hot-comment .placeholder',   // 热门评论容器选择器
            allCommentSelector: '.all-comment .placeholder',   // 全部评论容器选择器
            usernameSelector: '.user-name',                     // 用户名元素选择器
            contentSelector: '.user-review',                    // 评论内容选择器
            commentContainerHot: '.hot-comment',               // 热门评论区域选择器
            commentContainer: '.all-comment',                   // 全部评论区域选择器
            initAction: () => {
                const tip = document.querySelector('.hot_comment_tip');
                if(tip.classList.contains('hide')){
                    $('.hot-comment').hide();          // 初始化操作：隐藏热门评论区域
                }
            }
        }
    };

    // 获取当前站点配置
    const hostname = window.location.hostname;
    const config = SITE_CONFIG[hostname];
    if (!config) return; // 非目标站点直接退出
    config.initAction(); // 执行站点初始化操作

    /* 工具函数：生成评论唯一标识 */
    const getCommentKey = comment => `${comment.username}_${comment.content}`;

    /* 核心功能实现 */
    class CommentHighlighter {
        constructor() {
            this.hotComments = new Map();   // 使用Map存储热门评论（O(1)查找）
            this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            this.hotCommentElementCount = 0;
            this.hotNum = 1;
            this.commentElementCount = 0;
            this.initObservers();
            this.collectHotComments();     // 初始收集热门评论
            this.highlightComments();      // 初始高亮匹配到的热门评论
        }

        /* 初始化MutationObserver监听 */
        initObservers() {
            // 热门评论区域监听
            this.observeArea(config.commentContainerHot, () => this.collectHotComments());
            // 全部评论区域监听
            this.observeArea(config.commentContainer, () => this.highlightComments());
        }

        /* 通用区域监听方法 */
        observeArea(selector, callback) {
            const targetNode = document.querySelector(selector);
            if (!targetNode) return;

            new MutationObserver(() => callback())
                .observe(targetNode, {
                    childList: true,  // 监听子元素变化
                    subtree: true     // 监听所有后代元素
                });
        }

        /* 收集热门评论 */
        collectHotComments() {
            this.hotComments.clear();

            document.querySelectorAll(config.hotCommentSelector)
                .forEach(commentElement => {
                    this.hotCommentElementCount++;
                    const username = this.getText(commentElement, config.usernameSelector);
                    const content = this.getText(commentElement, config.contentSelector);
                    if (username && content) {
                        this.hotComments.set(getCommentKey({ username, content }), true);
                        this.processSpecialElements(commentElement); // 处理特殊元素
                    }
                });
        }

        /* 高亮匹配评论 */
        highlightComments() {
            // 获取评论总数
            this.commentElementCount = (el => el ? parseInt(el.textContent, 10) : 0)(document.querySelector('.comment-number'));
            document.querySelectorAll(config.allCommentSelector)
                .forEach(commentElement => {
                    const username = this.getText(commentElement, config.usernameSelector);
                    const content = this.getText(commentElement, config.contentSelector);

                    if (hostname === 'm.ithome.com') {
                        // 点击更多评论
                        commentElement.querySelector('.look-more')?.click();
                        // 处理IP显示
                        this.processHupuIP(commentElement);
                        const reply = commentElement.querySelector('.reply');
                        // 始终隐藏回复按钮（🎈想回复评论注释掉下一行代码）
                        if (reply) reply.style.display = 'none';
                        const userfloor = commentElement.querySelector('.user-floor');
                        const userwritemsg = commentElement.querySelector('.user-write-msg');
                        const userreview = commentElement.querySelector('.user-review');
                        userfloor.style.float = 'none';
                        userfloor.style.marginLeft = '10px';
                        userwritemsg.style.float = 'right';
                        userwritemsg.style.marginTop = '-20px';
                        userreview.style.marginTop = '5px';
                        // 根据评论总数隐藏一部分低赞低反评论（🎈不隐藏热门评论就注释掉下一行代码）
                        this.hideComments(commentElement);
                        // 高亮匹配的评论
                        if (username && content && this.hotComments.has(getCommentKey({ username, content }))) {
                            if (commentElement.classList.contains('placeholder') && commentElement.classList.contains('main-floor')) {
                                commentElement.className = 'placeholder main-floor hot-comment-highlight';
                            }else{
                                commentElement.classList.add('hot-comment-highlight');
                            }
                            // 防重复：判断当前评论是否已添加序号，避免重复生成
                            if (!commentElement.querySelector(".ithome-comment-num")){
                                // 创建序号标签 + 美化样式
                                const numSpan = document.createElement("span");
                                numSpan.className = "ithome-comment-num";
                                numSpan.style.cssText = "color:#999;font-size:0.95em;margin-right:6px;display:inline-block;";
                                numSpan.textContent = `${this.hotCommentElementCount}-${this.hotNum ++}`; // 索引从0开始，序号+1 → 1. 2. 3.
                                // 把序号插入到【当前评论内容的最前面】
                                commentElement.insertBefore(numSpan, commentElement.firstChild);
                            }
                            const currentMainLi = commentElement.closest('li.placeholder.main-floor');
                            // 如果子评论是热门评论则修改确保不隐藏主评论的class
                            if (currentMainLi) currentMainLi.className = 'placeholder main-floor hot-comment-highlight';
                        }
                    }
                });
        }

        /* 隐藏低赞反评论 */
        hideComments(commentElement) {
            if (hostname === 'm.ithome.com') {
                // 获取所有交互元素（安全访问）
                const standby = commentElement.querySelector('.stand-by');
                const oppose = commentElement.querySelector('.oppose');
                const reviewfooter = commentElement.querySelector('.review-footer');

                // 根据评论数量确定支持/反对的隐藏阈值
                let hideStandbyThreshold = [];
                let opposeStandbyThreshold = [];
                let hideNum = 0;
                if (this.commentElementCount < 20) {
                    // 小于20条，显示所有
                    hideStandbyThreshold = [];
                    opposeStandbyThreshold = [];
                } else {
                    if (this.commentElementCount < 50) {
                        // 20-50条，隐藏0、1、2支持/反对
                        hideStandbyThreshold = [0, 1, 2];
                        opposeStandbyThreshold = [0, 1, 2];
                        hideNum = 3;
                    } else if (this.commentElementCount < 100) {
                        // 50-100条，隐藏0、1、2、3、4支持/反对
                        hideStandbyThreshold = [0, 1, 2, 3, 4];
                        opposeStandbyThreshold = [0, 1, 2, 3, 4];
                        hideNum = 5;
                    } else if (this.commentElementCount < 200) {
                        // 100-200条，隐藏10以下支持/反对
                        hideStandbyThreshold = Array.from({ length: 9 }, (_, i) => i);
                        opposeStandbyThreshold = Array.from({ length: 9 }, (_, i) => i);
                        hideNum = 10;
                    } else {
                        // 大于200条，隐藏20以下支持/反对
                        hideStandbyThreshold = Array.from({ length: 19 }, (_, i) => i);
                        opposeStandbyThreshold = Array.from({ length: 19 }, (_, i) => i);
                        hideNum = 20;
                    }
                    // 统计热门评论数量
                    const titleDom = document.querySelector(".hot-comment-box .re-tags .tags-name");
                    titleDom.innerHTML = `热门评论 <span style="font-size:0.9em;color:#999;margin-left:4px;">(${this.hotCommentElementCount}) 隐藏正反均${hideNum}以下评论</span>`;
                }
                // 处理支持按钮
                if (standby) {
                    const standbyText = standby.textContent?.trim();
                    const match = standbyText?.match(/支持\((\d+)\)/);
                    if (match) {
                        const count = parseInt(match[1]);
                        if (count == 0) {
                            standby.style.display = 'none';
                        }
                    }
                }
                // 处理反对按钮
                if (oppose) {
                    const opposeText = oppose.textContent?.trim();
                    const match = opposeText?.match(/反对\((\d+)\)/);
                    if (match) {
                        const count = parseInt(match[1]);
                        if (count == 0) {
                            oppose.style.display = 'none';
                        }
                    }
                }
                // 当支持/反对都符合条件时隐藏底部栏
                if (reviewfooter && standby && oppose) {
                    const standbyText = standby.textContent?.trim();
                    const opposeText = oppose.textContent?.trim();
                    const standbyMatch = standbyText?.match(/支持\((\d+)\)/);
                    const opposeMatch = opposeText?.match(/反对\((\d+)\)/);

                    if (standbyMatch && opposeMatch) {
                        const standbyCount = parseInt(standbyMatch[1]);
                        const opposeCount = parseInt(opposeMatch[1]);

                        if (hideStandbyThreshold.includes(standbyCount) && opposeStandbyThreshold.includes(opposeCount)) {
                            reviewfooter.style.display = 'none';
                            //var hasDeputyFloor = commentElement.querySelector('li.placeholder.deputy-floor');
                            if (commentElement.classList.contains('placeholder') && commentElement.classList.contains('main-floor')) {
                                // 隐藏当前符合隐藏条件评论
                                commentElement.classList.add('hide');
                            }
                        }
                    }
                }
            }

        }

        /* 辅助方法：安全获取文本内容 */
        getText(element, selector) {
            return element.querySelector(selector)?.textContent?.trim();
        }

        /* 处理IP地址显示 */
        processHupuIP(element) {
            const ipElement = element.querySelector('.user-ip');
            const ipText = ipElement?.textContent?.trim();
            const match = ipText?.match(/IT之家(.*?)网友/);
            if (match) ipElement.textContent = match[1];
        }

        /* 处理站点特殊元素 */
        processSpecialElements(element) {
            // IT之家特殊处理（示例）
            if (hostname === 'm.ithome.com') {
                element.style.display = 'block';
            }
        }
    }

    /* 样式注入 */
    const style = document.createElement('style');
    style.textContent = `
        .hot-comment-highlight {
            background-color: yellow !important;
            border: 2px solid orange !important;
        }
        @media (prefers-color-scheme: dark) {
            .hot-comment-highlight {
                background-color: #333 !important;
                color: #fff !important;
            }
        }
    `;
    document.head.appendChild(style);

    // 启动高亮系统
    new CommentHighlighter();

})();