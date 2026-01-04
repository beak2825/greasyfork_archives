// ==UserScript==
// @name         尚香书院 屏蔽无用回复
// @namespace    http://tampermonkey.net/
// @version      0.92
// @description  根据自定义的黑名单关键词、关键词与该条回复字数占比等条件屏蔽无用回复；有白名单功能；可点击页面右下方“回复过滤窗口”或使用快捷键显示当前已屏蔽或保护的回复内容。注意：滚动浏览到当前页面底部时会自动加载下一页回复。
// @author       南竹
// @match        https://sxsy19.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530624/%E5%B0%9A%E9%A6%99%E4%B9%A6%E9%99%A2%20%E5%B1%8F%E8%94%BD%E6%97%A0%E7%94%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/530624/%E5%B0%9A%E9%A6%99%E4%B9%A6%E9%99%A2%20%E5%B1%8F%E8%94%BD%E6%97%A0%E7%94%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置屏蔽关键词（数组形式，支持多个）
    const BLOCK_KEYWORDS = [
        "感谢楼主分享",
        "谢谢大佬分享",
        "谢谢",
        "感谢",
        "感谢分享",
        "好人一生平安",
        "谢谢分享",
        "666",
        "牛逼",
        "楼主牛逼",
        "感谢大佬",
        "感谢大大",
        "楼主辛苦了",
        "非常感谢楼主",
        "大佬好人一生平安",
        "感谢楼主的分享",
        "谢谢楼主分享",
        "好人一生",
        "感谢楼主分享，好人",
        "辛苦了",
        "大佬牛",
        "楼主牛",
        "谢楼主分享",
        "楼主分享",
        "感谢楼主",
        "楼主威武",
        "支持",
        "支持支持",
        "支持支持支持",
        "支持支持支持支持",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "楼主辛苦了"
    ];

    // 配置白名单关键词（含有以下任一关键词的回复不会被屏蔽）
    const WHITELIST_KEYWORDS = [
        "有绿",
        "有雷",
        "避雷",
        "别下",
        "大雷",
        "建议",
        "绿文",
        "无绿",
        "评价",
        "评论",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "解答"
    ];

    const RATIO_THRESHOLD = 0.5; // 50% 阈值

    // 存储屏蔽和白名单保护的回复内容（使用 Set 去重）
    let blockedReplies = new Set();
    let whitelistedReplies = new Set();

    // 主函数：屏蔽回复
    function filterReplies() {
        const replyElements = document.querySelectorAll('#postlist .t_f');
        const mainPostId = document.querySelector('#postlist > div[id^="post_"]').id; // 获取主楼 ID

        replyElements.forEach(reply => {
            try {
                // 检查是否为主楼
                const parentPost = reply.closest('div[id^="post_"]');
                if (!parentPost || parentPost.id === mainPostId) {
                    return; // 跳过主楼
                }

                // 获取完整文本
                let fullText = reply.textContent.trim();
                const supplementIndex = fullText.indexOf('补充内容');
                if (supplementIndex !== -1) {
                    fullText = fullText.substring(0, supplementIndex).trim();
                }

                // 分离引用部分和正文部分
                const quoteElement = reply.querySelector('.quote');
                let mainText = fullText;
                if (quoteElement) {
                    const quoteText = quoteElement.textContent.trim();
                    mainText = fullText.replace(quoteText, '').trim(); // 移除引用部分
                }

                const mainLength = mainText.length;
                if (mainLength === 0) return; // 正文为空则跳过

                // 检查白名单（仅对回复生效）
                let isWhitelisted = false;
                for (let whitelistKeyword of WHITELIST_KEYWORDS) {
                    if (mainText.includes(whitelistKeyword)) {
                        isWhitelisted = true;
                        whitelistedReplies.add(mainText); // 记录白名单保护的回复
                        break;
                    }
                }

                // 如果在白名单中，跳过屏蔽
                if (isWhitelisted) {
                    return;
                }

                // 检查屏蔽关键词
                let shouldBlock = false;
                for (let keyword of BLOCK_KEYWORDS) {
                    const keywordLength = keyword.length;
                    const keywordCount = (mainText.match(new RegExp(keyword, 'g')) || []).length;
                    const keywordRatio = (keywordCount * keywordLength) / mainLength;

                    if (keywordRatio >= RATIO_THRESHOLD) {
                        shouldBlock = true;
                        blockedReplies.add(mainText); // 记录屏蔽的回复
                        break;
                    }
                }

                if (shouldBlock) {
                    // 保留引用部分（如果有），屏蔽正文
                    if (quoteElement) {
                        reply.innerHTML = quoteElement.outerHTML + '<br><span style="color: #999;"> </span>';
                    } else {
                        reply.innerHTML = '<span style="color: #999;"> </span>';
                    }
                }
            } catch (e) {
                console.log('处理回复时出错:', e);
            }
        });
    }

    // 加载下一页内容
    function loadNextPage() {
        const nextLink = document.querySelector('a.nxt[href*="page="]');
        if (!nextLink) {
            console.log('未找到下一页链接');
            return;
        }

        const url = nextLink.href;
        console.log('加载下一页:', url);
        fetch(url)
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newPosts = doc.querySelectorAll('#postlist > div[id^="post_"]');

                const container = document.querySelector('#postlist');
                if (!container) {
                    console.log('未找到 #postlist 容器');
                    return;
                }

                newPosts.forEach(post => {
                    const clonedPost = post.cloneNode(true);
                    container.appendChild(clonedPost);
                });

                const newNextLink = doc.querySelector('a.nxt[href*="page="]');
                if (newNextLink) {
                    nextLink.href = newNextLink.href;
                } else {
                    nextLink.remove();
                }

                filterReplies();
            })
            .catch(err => console.log('加载下一页失败:', err));
    }

    // 创建浮动窗口
    function createFloatingWindow() {
        var win = document.createElement('div');
        win.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 10cm;
            height: 10cm;
            background: white;
            border: 1px solid #ccc;
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            z-index: 9999;
            padding: 10px;
            resize: both;
            overflow: auto;
            display: none;
        `;

        var header = document.createElement('div');
        header.style.cssText = 'display: flex; justify-content: space-between; margin-bottom: 10px;';

        var shortcutInput = document.createElement('input');
        shortcutInput.type = 'text';
        shortcutInput.placeholder = 'Ctrl+Shift+R (默认)';
        shortcutInput.style.width = '100px';
        shortcutInput.disabled = true;

        var closeBtn = document.createElement('button');
        closeBtn.textContent = '关闭';
        closeBtn.onclick = function() {
            win.style.display = 'none';
            console.log('Floating window closed');
        };

        header.appendChild(shortcutInput);
        header.appendChild(closeBtn);

        var content = document.createElement('div');
        content.style.cssText = 'max-height: calc(100% - 40px); overflow-y: auto;';

        function updateContent() {
            content.innerHTML = `
                <strong>当前被屏蔽的回复：</strong><br>
                ${Array.from(blockedReplies).map(t => `“${t}”`).join('<br>') || '无'}<br><br>
                <strong>当前被白名单保护的回复：</strong><br>
                ${Array.from(whitelistedReplies).map(t => `“${t}”`).join('<br>') || '无'}
            `;
        }

        win.appendChild(header);
        win.appendChild(content);
        document.body.appendChild(win);
        updateContent();

        return { window: win, update: updateContent, toggle: function() {
            win.style.display = win.style.display === 'none' ? 'block' : 'none';
        }};
    }

    // 初始化窗口并绑定触发
    var floatingWindow = null;
    function initWindow() {
        if (!floatingWindow) {
            floatingWindow = createFloatingWindow();
            console.log('Floating window initialized');
        }
    }

    // 快捷键 Ctrl+Shift+R
    window.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'r') {
            e.preventDefault();
            console.log('Ctrl+Shift+R pressed');
            initWindow();
            floatingWindow.toggle();
            floatingWindow.update();
        }
    }, true);

    // 添加固定触发按钮
    function addTriggerButton() {
        var btnContainer = document.createElement('div');
        btnContainer.style.cssText = `
            position: fixed;
            bottom: 60px;
            right: 10px;
            z-index: 9999;
            display: flex;
            align-items: center;
        `;

        var btn = document.createElement('button');
        btn.textContent = '回复过滤窗口';
        btn.style.cssText = `
            padding: 2px 6px;
            background: rgba(0, 120, 215, 0.5);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        `;
        btn.onclick = function() {
            console.log('Button clicked to toggle window');
            initWindow();
            floatingWindow.toggle();
            floatingWindow.update();
        };

        var closeBtn = document.createElement('button');
        closeBtn.textContent = 'X';
        closeBtn.style.cssText = `
            margin-left: 5px;
            padding: 2px 6px;
            background: rgba(255, 0, 0, 0.5);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            font-size: 10px;
        `;
        closeBtn.onclick = function() {
            btnContainer.style.display = 'none';
            console.log('Trigger button closed');
        };

        btnContainer.appendChild(btn);
        btnContainer.appendChild(closeBtn);
        document.body.appendChild(btnContainer);
    }

    // 页面加载完成后执行一次
    window.addEventListener('load', () => {
        console.log('Page loaded, script initialized');
        filterReplies();
        addTriggerButton();
    });

    // 滚动检查与加载逻辑
    let lastCheck = 0;
    let isLoading = false;
    document.addEventListener('scroll', () => {
        const now = Date.now();
        const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100;

        if (now - lastCheck > 3000) {
            filterReplies();
            lastCheck = now;
        }

        if (scrollBottom && !isLoading) {
            isLoading = true;
            loadNextPage();
            setTimeout(() => { isLoading = false; }, 2000);
        }
    });
})();