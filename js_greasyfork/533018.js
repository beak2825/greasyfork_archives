// ==UserScript==
// @name         搜书吧 屏蔽无用回复
// @namespace    http://tampermonkey.net/
// @version      0.9.3
// @description  根据自定义的黑名单关键词、关键词与该条回复字数占比等条件屏蔽无用回复；有白名单功能；可点击页面右下方“回复过滤窗口”或使用快捷键显示当前已屏蔽或保护的回复内容。新增：屏蔽纯数字回复及纯字母无分隔符回复。注意：滚动浏览到当前页面底部时会自动加载下一页回复。
// @author       南竹
// @match        https://33ty.hk.sdvs4df4e5f4.com/*
// @match        https://nhg.69.tj55tg4y5asd.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533018/%E6%90%9C%E4%B9%A6%E5%90%A7%20%E5%B1%8F%E8%94%BD%E6%97%A0%E7%94%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/533018/%E6%90%9C%E4%B9%A6%E5%90%A7%20%E5%B1%8F%E8%94%BD%E6%97%A0%E7%94%A8%E5%9B%9E%E5%A4%8D.meta.js
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
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "谢楼主分享",
        "楼主分享",
        "啥也不说了，楼主就是给力",
        "谢谢楼主分享，祝搜书吧越办越好",
        "看了LZ的帖子，我只想说一句很好很强大",
        "支持一下",
        "支持",
        "点赞",
        "每天看贴无数,基本上不回贴，后来发现这样很傻，很多比我注册晚的人分数都比我多。于是我就把这段文字保存在记事本里，每看一贴就复制粘贴一次。帮忙把贴子顶上去，还顺便挣点分",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
        "待替换关键词",
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
        const replyElements = document.querySelectorAll('.t_f');
        replyElements.forEach(reply => {
            try {
                if (!reply || !reply.textContent) {
                    console.log('跳过无效回复元素:', reply);
                    return;
                }

                let fullText = reply.textContent.trim();
                const supplementIndex = fullText.indexOf('补充内容');
                if (supplementIndex !== -1) {
                    fullText = fullText.substring(0, supplementIndex).trim();
                }

                const quoteElement = reply.querySelector('.quote');
                let mainText = fullText;
                if (quoteElement) {
                    const quoteText = quoteElement.textContent.trim();
                    mainText = fullText.replace(quoteText, '').trim();
                }

                const mainLength = mainText.length;
                if (mainLength === 0) return;

                let isWhitelisted = false;
                for (let whitelistKeyword of WHITELIST_KEYWORDS) {
                    if (mainText.includes(whitelistKeyword)) {
                        isWhitelisted = true;
                        whitelistedReplies.add(mainText);
                        break;
                    }
                }

                if (isWhitelisted) return;

                let shouldBlock = false;

                // 新增规则1：屏蔽完全由纯数字组成的回复
                if (/^\d+$/.test(mainText)) {
                    shouldBlock = true;
                    blockedReplies.add(mainText);
                }

                // 新增规则2：屏蔽完全由英文字母组成且无逗号、空格等分隔符的回复
                if (/^[a-zA-Z]+$/.test(mainText) && !/[ ,.!?]/.test(mainText)) {
                    shouldBlock = true;
                    blockedReplies.add(mainText);
                }

                // 原有关键词屏蔽逻辑
                if (!shouldBlock) {
                    for (let keyword of BLOCK_KEYWORDS) {
                        const keywordLength = keyword.length;
                        const keywordCount = (mainText.match(new RegExp(keyword, 'g')) || []).length;
                        const keywordRatio = (keywordCount * keywordLength) / mainLength;

                        if (keywordRatio >= RATIO_THRESHOLD) {
                            shouldBlock = true;
                            blockedReplies.add(mainText);
                            break;
                        }
                    }
                }

                if (shouldBlock) {
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

        // 显示加载提示
        const loadingIndicator = document.createElement('div');
        loadingIndicator.textContent = '正在加载下一页...';
        loadingIndicator.style.cssText = 'position: fixed; bottom: 10px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.7); color: white; padding: 5px 10px; border-radius: 3px; z-index: 9999;';
        document.body.appendChild(loadingIndicator);

        fetch(url, {
            headers: {
                'Accept': 'text/html; charset=utf-8'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP 错误: ${response.status}`);
                }
                return response.arrayBuffer();
            })
            .then(buffer => {
                const decoder = new TextDecoder('gbk');
                const html = decoder.decode(buffer);
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const newPosts = doc.querySelectorAll('#postlist > div[id^="post_"]');

                if (newPosts.length === 0) {
                    console.log('未找到新帖子，可能页面结构变化或数据为空');
                    return;
                }

                const container = document.querySelector('#postlist');
                if (!container) {
                    console.log('未找到 #postlist 容器');
                    return;
                }

                // 记录追加前的高度，用于滚动调整
                const previousHeight = document.body.scrollHeight;

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

                // 强制更新页面高度
                document.body.style.height = document.body.scrollHeight + 'px';
                // 滚动到新内容的起始位置
                window.scrollTo(0, previousHeight - window.innerHeight + 50);
            })
            .catch(err => console.log('加载下一页失败:', err))
            .finally(() => {
                document.body.removeChild(loadingIndicator);
            });
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
    let lastScrollTime = 0;
    const throttleDelay = 1000; // 节流间隔 1 秒

    document.addEventListener('scroll', () => {
        const now = Date.now();
        const scrollBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;

        if (now - lastCheck > 3000) {
            filterReplies();
            lastCheck = now;
        }

        if (scrollBottom && !isLoading && (now - lastScrollTime > throttleDelay)) {
            isLoading = true;
            lastScrollTime = now;
            loadNextPage();
            setTimeout(() => { isLoading = false; }, 1000);
        }
    });
})();