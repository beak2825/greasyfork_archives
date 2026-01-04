// ==UserScript==
// @name         Linux Do 量子速读
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  帮您在Linux Do论坛中折叠无意义回复，告别水贴，光速获取信息！
// @author       量子咸鱼K
// @match        *://linux.do/t/topic/*
// @grant        GM_log
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529274/Linux%20Do%20%E9%87%8F%E5%AD%90%E9%80%9F%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/529274/Linux%20Do%20%E9%87%8F%E5%AD%90%E9%80%9F%E8%AF%BB.meta.js
// ==/UserScript==

// 立即执行的日志，确认脚本加载
console.log('[折叠器] 脚本已加载');

(function() {
    'use strict';

    // 添加日志函数
    const DEBUG = {
        enabled: true,
        log: function(type, message, data = null) {
            if (!this.enabled) return;
            const timestamp = new Date().toISOString().split('T')[1];
            console.log(`[折叠器][${timestamp}][${type}] ${message}`, data ? data : '');
        }
    };

    // 立即执行的测试日志
    DEBUG.log('测试', '日志系统初始化成功');

    // 配置项
    const CONFIG = {
        // 判定为无意义回复的最大字符数
        MAX_CHARS: 30,
        // 连续显示的最大回复数
        MAX_VISIBLE_REPLIES: 8,
        // 用于判定无意义回复的关键词和正则表达式
        MEANINGLESS_PATTERNS: [
            // 基础表情和重复字符
            /^[。.…～~]+$/,  // 省略号
            /^.*[哈嘿呵h]{2,}$/i,  // 笑声
            /^.*[666６]{2,}$/,  // 666
            /^.*[？?!！.。]{2,}$/,  // 连续的标点符号
            /^.*[:：][+＋]1[:：]$/,  // :+1:
            /^.*(\s*:[\w-]+:\s*){1,}$/,  // 纯表情符号

            //  单字重复
            /^.*(.)\1{1,}$/,  // 任何字符重复

            //  感谢类 感谢@hanhai贡献补充规则
            /^.*[谢蟹感]谢?(你|您|分享|大佬|楼主|老铁|老哥|佬友?|大神|博主)?(，|,|.|！|!|~|～|。)*.*$/i,
            /^.*感恩|感动|感激[！!~～。.]*$/,
            /^.*(thank|thanks|thx|tks)[！!~～。.]*$/i,

            //  支持类 感谢@hanhai贡献补充规则
            /.*期待.*/i,
            /^.*(支持|顶|赞|好评|mark占?位?|收藏|马克|签到|打卡|学习|关注|收藏了|路过|前来|学习了)[！!~～。.]*$/i,
            /^.*(\+1|1\+|加1|[➕＋]1)[！!~～。.]*$/,
            /^.*先赞后看[！!~～。.]*$/,
            /^.*已阅[！!~～。.]*$/,
            /^.*非常好用[！!~～。.]*$/,
            /^.*好用[，,]?爱用[！!~～。.]*$/,
            /^.*爱用[，,]?喜欢[！!~～。.]*$/,
            /^.*火钳威武[！!~～。.]*$/,

            //  称赞类
            /^.*(好|棒|强|厉害|可以|不错|牛|帅|赞|妙|秒|绝|狠|太强|很强|太棒|很棒|牛逼|nb|可以的)[！!~～。.]*$/i,
            /^.*(nice|good|perfect|awesome|ok+)[！!~～。.]*$/i,
            /^.*[牛nb]{1,}[bB呀啊哇plus]{0,5}$/,  // 牛b，nbbb，牛逼plus等
            /^.*牛啊?皇[！!~～。.]*$/,

            //  楼层相关
            /^.*[第前后大小]?[1-9一二三四五六七八九十百千]{1,}[楼层名]?[！!~～。.]*$/,
            /^.*(前排|沙发|板凳|地板)[！!~～。.]*$/,
            /^.*[大小]?后排[！!~～。.]*$/,
            /^.*排队[！!~～。.]*$/,
            /^.*[前后][排队][！!~～。.]*$/,

            //  佬相关
            /^.*(佬|大佬|巨佬|巨巨|大神)[！!~～。.]*$/,
            /^.*佬(的)?分享[！!~～。.]*$/,
            /^.*始皇(大佬|陛下|老师|[vV][1-9])?[！!~～。.]*$/,
            /^.*吾皇[万岁]{2,}$/,
            /^.*伟大[～~]*[，,]?无需多[盐言][！!~～。.]*$/,

            //  其他常见短语
            /^.*(顶上去|顶上来|顶一下|帮顶|支持一下|学习了|学到了|受益了|get|学习打卡)[！!~～。.]*$/i,
            /^.*(看看|路过|潜水|冒泡|打卡|签到|留念|留名)[！!~～。.]*$/,
            /^.*[1-9一二三四五六七八九十]\s*[份分]到手[！!~～。.]*$/,
            /^.*别说话[！!~～。.]*$/,
            /^.*前排[！!~～。.]*爽[～~]*$/,
            /^.*前排[！!~～。.]*始皇[牛nb逼]{1,}[！!~～。.]*（破音）$/,

            //  表情符号组合
            /^.*(:[+＋]1:\s*){1,}$/,  // 连续的 :+1: 表情
            /^.*[:：][^\s]{1,10}[:：](\s*[:：][^\s]{1,10}[:：])*$/, // 任意表情符号组合

            // Custom
            "来了","太强","哈哈哈","红红火火","牛啊","好好好","重生了","来啦","cy","插眼","mark","Mark","tql","始皇"
        ]
    };

    // 判断是否为无意义回复
    function isMeaninglessReply(content) {
        const cleanContent = content.replace(/\s+/g, '');
        if (cleanContent.length <= CONFIG.MAX_CHARS) {
            const matchedPattern = CONFIG.MEANINGLESS_PATTERNS.find(pattern => {
                if (pattern instanceof RegExp) {
                    return pattern.test(cleanContent);
                } else {
                    return cleanContent.toLowerCase().includes(pattern.toLowerCase());
                }
            });

            if (matchedPattern) {
                DEBUG.log('检测', `发现无意义回复: "${content}" (匹配模式: ${matchedPattern})`);
                return true;
            }
        }
        return false;
    }

    // 创建折叠后的回复元素
    function createFoldedReply(post) {
        try {
            const userInfo = post.querySelector('.topic-meta-data');
            if (!userInfo) {
                DEBUG.log('错误', '未找到用户信息区域');
                return null;
            }

            const username = userInfo.querySelector('.username');
            const postNumber = userInfo.querySelector('.post-number, .linuxfloor');
            const cookedContent = post.querySelector('.cooked');


            let author;
            if (!username || !cookedContent) {
                author = userInfo.querySelector('.full-name').childNodes[0].getAttribute('data-user-card');
                //console.log(username,cookedContent,userInfo,author);
            }else{
                author = username.textContent;
            }
            const content = cookedContent.textContent.trim();
            const number = postNumber ? postNumber.textContent : '';

            DEBUG.log('创建', `创建折叠元素: #${number} ${author}`);

            const foldedDiv = document.createElement('div');
            foldedDiv.className = 'folded-reply';
            foldedDiv.innerHTML = `
                ${number ? `<span class="folded-post-number">${number}</span>` : ''}
                <span class="folded-author">${author}</span>:
                <span class="folded-content">${content}</span>
            `;
            foldedDiv.style.cssText = `
                padding: 5px 15px;
                margin: 5px 0;
                background-color: var(--primary-very-low);
                border-radius: 4px;
                font-size: 0.9em;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            `;

            foldedDiv.addEventListener('click', () => {
                DEBUG.log('点击', `展开回复: #${number}`);
                post.style.display = '';
                foldedDiv.style.display = 'none';
            });

            return foldedDiv;
        } catch (error) {
            DEBUG.log('错误', '创建折叠元素失败', error);
            return null;
        }
    }

    // 处理连续的无意义回复
    function handleConsecutiveMeaninglessReplies(replies) {
        let currentIndex = 0;
        let consecutiveGroups = [];
        let currentGroup = [];

        // 首先找出所有连续的回复组
        for (let i = 0; i < replies.length; i++) {
            if (currentGroup.length === 0) {
                currentGroup.push(replies[i]);
            } else {
                const lastPost = currentGroup[currentGroup.length - 1].post;
                const currentPost = replies[i].post;

                // 检查是否连续（通过比较帖子编号）
                const lastNumber = parseInt(lastPost.querySelector('.post-number, .linuxfloor')?.textContent?.replace(/[^0-9]/g, ''));
                const currentNumber = parseInt(currentPost.querySelector('.post-number, .linuxfloor')?.textContent?.replace(/[^0-9]/g, ''));

                if (lastNumber && currentNumber && currentNumber === lastNumber + 1) {
                    currentGroup.push(replies[i]);
                } else {
                    if (currentGroup.length > CONFIG.MAX_VISIBLE_REPLIES) {
                        consecutiveGroups.push([...currentGroup]);
                    }
                    currentGroup = [replies[i]];
                }
            }
        }

        // 处理最后一组
        if (currentGroup.length > CONFIG.MAX_VISIBLE_REPLIES) {
            consecutiveGroups.push(currentGroup);
        }

        // 处理每一组连续回复
        consecutiveGroups.forEach(group => {
            DEBUG.log('处理', `发现连续回复组: 数量=${group.length}`);

            // 显示前 MAX_VISIBLE_REPLIES 个回复
            for (let i = 0; i < CONFIG.MAX_VISIBLE_REPLIES; i++) {
                if (group[i]) {
                    group[i].foldedReply.style.display = '';
                }
            }

            // 隐藏剩余的回复
            for (let i = CONFIG.MAX_VISIBLE_REPLIES; i < group.length; i++) {
                group[i].foldedReply.style.display = 'none';
            }

            // 创建省略号元素
            const ellipsis = document.createElement('div');
            ellipsis.className = 'replies-ellipsis';
            ellipsis.innerHTML = `
                <span>还有 ${group.length - CONFIG.MAX_VISIBLE_REPLIES} 条类似回复</span>
                <span class="show-more">点击展开</span>
            `;
            ellipsis.style.cssText = `
                text-align: center;
                padding: 8px;
                color: var(--primary-medium);
                cursor: pointer;
                margin: 5px 0;
                background-color: var(--primary-very-low);
                border-radius: 4px;
                font-size: 0.9em;
            `;

            // 插入省略号到最后一个可见回复之后
            const lastVisibleReply = group[CONFIG.MAX_VISIBLE_REPLIES - 1].foldedReply;
            if (lastVisibleReply) {
                lastVisibleReply.parentNode.insertBefore(ellipsis, lastVisibleReply.nextSibling);
                DEBUG.log('插入', '插入省略号元素');
            }

            // 点击省略号时展开所有回复
            ellipsis.addEventListener('click', () => {
                DEBUG.log('展开', '展开连续回复');
                for (let i = CONFIG.MAX_VISIBLE_REPLIES; i < group.length; i++) {
                    group[i].foldedReply.style.display = '';
                }
                ellipsis.style.display = 'none';
            });
        });
    }

    // 主函数
    function foldMeaninglessReplies() {
        DEBUG.log('执行', '开始处理帖子');
        // 移除已存在的折叠元素
        document.querySelectorAll('.folded-reply, .replies-ellipsis').forEach(el => el.remove());

        const posts = Array.from(document.querySelectorAll('.post-stream article.boxed.onscreen-post')).slice(1);
        DEBUG.log('统计', `找到 ${posts.length} 个回复帖子`);
        const meaninglessReplies = [];

        posts.forEach(post => {
            try {
                const content = post.querySelector('.cooked')?.textContent.trim();
                if (!content) {
                    DEBUG.log('跳过', '帖子内容为空');
                    return;
                }

                if (isMeaninglessReply(content)) {
                    const foldedReply = createFoldedReply(post);
                    if (foldedReply) {
                        post.parentNode.insertBefore(foldedReply, post);
                        post.style.display = 'none';
                        meaninglessReplies.push({post, foldedReply});
                    }
                }
            } catch (error) {
                DEBUG.log('错误', '处理帖子时发生错误', error);
            }
        });

        DEBUG.log('统计', `本次共折叠 ${meaninglessReplies.length} 个回复`);

        if (meaninglessReplies.length > 0) {
            handleConsecutiveMeaninglessReplies(meaninglessReplies);
        }
    }

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .folded-reply {
            transition: background-color 0.2s;
        }
        .folded-reply:hover {
            background-color: var(--primary-low);
        }
        .folded-post-number {
            color: var(--primary-medium);
            font-size: 0.8em;
            min-width: 2em;
        }
        .folded-author {
            font-weight: bold;
            color: var(--primary-high);
        }
        .folded-content {
            color: var(--primary-medium);
        }
        .replies-ellipsis .show-more {
            color: var(--tertiary);
            margin-left: 5px;
        }
        .replies-ellipsis:hover {
            background-color: var(--primary-low);
        }
    `;
    document.head.appendChild(style);

    // 使用防抖函数来避免频繁触发
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 检查页面是否已完全加载
    function isPageFullyLoaded() {
        // 检查 Discourse 应用是否已加载
        if (typeof define !== 'function' || typeof require !== 'function') {
            DEBUG.log('加载检查', 'AMD 模块系统未加载');
            return false;
        }

        // 检查 post-stream 组件是否已加载
        const postStream = document.querySelector('#post-stream');
        if (!postStream) {
            DEBUG.log('加载检查', 'post-stream 元素未找到');
            return false;
        }

        // 检查是否有加载状态
        const loadingPosts = postStream.querySelector('.loading-container, .timeline-loading, .loading-onebox');
        if (loadingPosts) {
            DEBUG.log('加载检查', '帖子正在加载中');
            return false;
        }

        // 检查是否有可见的帖子
        const visiblePosts = postStream.querySelectorAll('article.topic-post:not(.placeholder)');
        if (visiblePosts.length === 0) {
            DEBUG.log('加载检查', '没有可见的帖子');
            return false;
        }

        DEBUG.log('加载检查', `页面加载完成 (可见帖子数: ${visiblePosts.length})`);
        return true;
    }

    // 等待 Discourse 应用加载
    function waitForDiscourse() {
        return new Promise((resolve) => {
            const maxAttempts = 200; // 增加等待时间到 20 秒
            let attempts = 0;

            function check() {
                attempts++;

                // 检查 Discourse 应用是否已加载
                const appLoaded = typeof define === 'function' && typeof require === 'function';
                const postStreamLoaded = document.querySelector('#post-stream article.topic-post');
                const loadingIndicator = document.querySelector('#post-stream .loading-container');

                // 检查 TopicController 是否已初始化
                const topicControllerLoaded = window.require && (() => {
                    try {
                        const container = window.require('discourse/app').default.__container__;
                        const controller = container.lookup('controller:topic');
                        return controller && controller.model && controller.model.postStream;
                    } catch (e) {
                        return false;
                    }
                })();

                if (appLoaded && postStreamLoaded && !loadingIndicator && topicControllerLoaded) {
                    // 额外等待一小段时间，确保内容完全加载
                    setTimeout(() => {
                        DEBUG.log('等待', 'Discourse 应用已加载，帖子已就绪');
                        resolve();
                    }, 1000);
                    return;
                }

                if (attempts >= maxAttempts) {
                    DEBUG.log('等待', '等待超时，将在路由变化时重试');
                    resolve();
                    return;
                }

                setTimeout(check, 100);
            }

            // 如果页面已经加载完成，立即开始检查
            if (document.readyState === 'complete') {
                check();
            } else {
                // 否则等待页面加载完成
                window.addEventListener('load', check);
            }
        });
    }

    // 监听路由变化
    function setupRouteObserver() {
        let lastUrl = location.href;
        let isProcessing = false;

        // 创建一个 MutationObserver 来监视 URL 变化
        const observer = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                if (isProcessing) return;

                isProcessing = true;
                DEBUG.log('路由', '检测到页面 URL 变化');

                // 等待新页面加载完成
                setTimeout(() => {
                    if (window.requestIdleCallback) {
                        requestIdleCallback(() => {
                            DEBUG.log('执行', '页面变化后开始折叠');
                            foldMeaninglessReplies();
                            isProcessing = false;
                        });
                    } else {
                        setTimeout(() => {
                            DEBUG.log('执行', '页面变化后开始折叠');
                            foldMeaninglessReplies();
                            isProcessing = false;
                        }, 1000);
                    }
                }, 1000);
            }
        });

        observer.observe(document, {
            subtree: true,
            childList: true
        });

        // 监听 popstate 事件（浏览器前进/后退）
        window.addEventListener('popstate', () => {
            if (isProcessing) return;

            isProcessing = true;
            DEBUG.log('路由', '检测到 popstate 事件');
            waitForDiscourse().then(() => {
                if (window.requestIdleCallback) {
                    requestIdleCallback(() => {
                        DEBUG.log('执行', 'popstate 后开始折叠');
                        foldMeaninglessReplies();
                        isProcessing = false;
                    });
                } else {
                    setTimeout(() => {
                        DEBUG.log('执行', 'popstate 后开始折叠');
                        foldMeaninglessReplies();
                        isProcessing = false;
                    }, 1000);
                }
            });
        });
    }

    // 设置定时器
    function setupAutoFold() {
        DEBUG.log('定时', '启动自动折叠定时器');

        // 创建定时器
        const timer = setInterval(() => {
            const postStream = document.querySelector('#post-stream');
            if (!postStream) return;

            const loadingContainer = document.querySelector('#post-stream .loading-container');
            if (loadingContainer) return;

            DEBUG.log('定时', '执行定时折叠检查');
            foldMeaninglessReplies();
        }, 5000);

        // 在页面卸载时清除定时器
        window.addEventListener('unload', () => {
            clearInterval(timer);
        });

        return timer;
    }

    // 初始化函数
    async function initialize() {
        try {
            DEBUG.log('初始化', '脚本开始运行');

            // 等待 Discourse 应用加载
            // await waitForDiscourse();

            // 设置路由观察器
            setupRouteObserver();

            // 设置自动折叠定时器
            const timer = setupAutoFold();

            // 使用 requestIdleCallback 在浏览器空闲时执行折叠操作
            if (window.requestIdleCallback) {
                requestIdleCallback(() => {
                    DEBUG.log('执行', '开始初始折叠');
                    foldMeaninglessReplies();

                    // 设置 MutationObserver
                    setupObserver();
                });
            } else {
                // 如果不支持 requestIdleCallback，则延迟执行
                setTimeout(() => {
                    DEBUG.log('执行', '开始初始折叠');
                    foldMeaninglessReplies();

                    // 设置 MutationObserver
                    setupObserver();
                }, 1000);
            }

        } catch (error) {
            DEBUG.log('错误', '初始化失败', error);
            console.error('折叠脚本初始化失败:', error);
            setTimeout(initialize, 5000);
        }
    }

    // 设置 MutationObserver
    function setupObserver() {
        const postStream = document.querySelector('#post-stream');
        if (!postStream) return;

        DEBUG.log('监听', '开始监听帖子流变化');

        const observer = new MutationObserver(debounce((mutations) => {
            const hasNewPosts = mutations.some(mutation => {
                return Array.from(mutation.addedNodes).some(node =>
                    node.nodeType === 1 && (
                        node.classList?.contains('topic-post') ||
                        node.querySelector?.('.topic-post')
                    )
                );
            });

            const loadingContainer = document.querySelector('#post-stream .loading-container');
            if (hasNewPosts && !loadingContainer) {
                // 等待一小段时间确保新帖子完全加载
                setTimeout(() => {
                    if (!document.querySelector('#post-stream .loading-container')) {
                        DEBUG.log('观察器', '发现新帖子，开始处理');
                        foldMeaninglessReplies();
                    }
                }, 500);
            }
        }, 200));

        observer.observe(postStream, {
            childList: true,
            subtree: true
        });

        // 监听滚动事件
        window.addEventListener('scroll', debounce(() => {
            const loadingContainer = document.querySelector('#post-stream .loading-container');
            if (loadingContainer) return;

            const posts = postStream.querySelectorAll('article.topic-post:not(.placeholder)');
            const lastPost = posts[posts.length - 1];
            if (!lastPost) return;

            const rect = lastPost.getBoundingClientRect();
            if (rect.bottom <= window.innerHeight * 2) {
                // 等待一小段时间确保新帖子加载完成
                setTimeout(() => {
                    if (!document.querySelector('#post-stream .loading-container')) {
                        DEBUG.log('滚动', '接近底部，检查新帖子');
                        foldMeaninglessReplies();
                    }
                }, 500);
            }
        }, 200), { passive: true });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(initialize, 1000));
    } else {
        setTimeout(initialize, 1000);
    }
})();