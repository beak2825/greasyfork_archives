// ==UserScript==
// @name         X (Twitter) Feed to Markdown with Auto-Scroll
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Extracts content from the X (Twitter) feed and converts it to a clean Markdown format, with an added direct auto-scroll feature.
// @match        https://x.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500409/X%20%28Twitter%29%20Feed%20to%20Markdown%20with%20Auto-Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/500409/X%20%28Twitter%29%20Feed%20to%20Markdown%20with%20Auto-Scroll.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 状态变量 ---
    let isMonitoring = false;
    let collectedTweets = new Map(); // 用于存储收集到的推文数据
    let observer;
    let isAutoScrolling = false;
    let scrollIntervalId = null;

    // --- 创建UI按钮 ---
    const markdownButton = document.createElement('button');
    markdownButton.textContent = '开始转换Markdown';
    Object.assign(markdownButton.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '9999',
        padding: '8px 16px',
        backgroundColor: '#1DA1F2',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    });
    document.body.appendChild(markdownButton);
    markdownButton.addEventListener('click', toggleMonitoring);

    const scrollButton = document.createElement('button');
    scrollButton.textContent = '开始自动滚动';
    Object.assign(scrollButton.style, {
        position: 'fixed',
        top: '55px',
        right: '10px',
        zIndex: '9999',
        padding: '8px 16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    });
    document.body.appendChild(scrollButton);
    scrollButton.addEventListener('click', toggleAutoScroll);

    // --- 自动滚动功能 ---
    function performScroll() {
        window.scrollBy(0, 400);
        console.log('Auto-scroll: Scrolled down by 400px.');
    }

    function toggleAutoScroll() {
        if (isAutoScrolling) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
            isAutoScrolling = false;
            scrollButton.textContent = '开始自动滚动';
            scrollButton.style.backgroundColor = '#28a745';
            console.log('自动滚动已停止。');
        } else {
            isAutoScrolling = true;
            scrollIntervalId = setInterval(performScroll, 500);
            scrollButton.textContent = '停止自动滚动';
            scrollButton.style.backgroundColor = '#dc3545';
            console.log('自动滚动已开始...');
        }
    }

    // --- Markdown转换核心功能 ---
    function toggleMonitoring() {
        if (isMonitoring) {
            stopMonitoring();
            displayCollectedTweets();
        } else {
            startMonitoring();
        }
    }

    function startMonitoring() {
        isMonitoring = true;
        markdownButton.textContent = '停止并导出Markdown';
        markdownButton.style.backgroundColor = '#FF4136';
        collectedTweets.clear();
        console.log("开始监控推文...");

        document.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);

        const config = { childList: true, subtree: true };
        observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.matches('article[data-testid="tweet"]')) {
                                processTweet(node);
                            }
                            node.querySelectorAll('article[data-testid="tweet"]').forEach(processTweet);
                        }
                    });
                }
            }
        });
        observer.observe(document.body, config);
    }

    function stopMonitoring() {
        isMonitoring = false;
        markdownButton.textContent = '开始转换Markdown';
        markdownButton.style.backgroundColor = '#1DA1F2';
        if (observer) {
            observer.disconnect();
        }
        console.log("停止监控。");
    }

    /**
     * 【已修改】处理单个推文元素，提取数据并存入 collectedTweets
     */
    function processTweet(tweet) {
        // 忽略广告或推广推文
        if (tweet.querySelector('[data-testid="promotedTweet"]')) return;
        const timeElement = tweet.querySelector('time[datetime]');
        if (timeElement && timeElement.closest('div[data-testid="User-Name"]')?.nextElementSibling?.textContent?.includes('Ad')) {
            return;
        }

        const tweetData = formatTweet(tweet);
        // tweetData 现在是一个包含 markdown, url, 和 postTime 的对象
        if (tweetData && tweetData.url && !collectedTweets.has(tweetData.url)) {
            collectedTweets.set(tweetData.url, tweetData);
        }
    }

    /**
     * 【已修改】显示收集到的推文，排序逻辑已更新
     */
    function displayCollectedTweets() {
        if (collectedTweets.size === 0) {
            alert('没有收集到任何推文。');
            return;
        }

        // 1. 直接使用对象中的 postTime 属性进行排序，不再依赖于Markdown文本格式
        const sortedTweetsData = Array.from(collectedTweets.values()).sort((a, b) => {
            const timeA = new Date(a.postTime);
            const timeB = new Date(b.postTime);
            return timeB - timeA; // 按时间降序排列（最新的在前面）
        });

        // 2. 从排序后的对象数组中提取 markdown 文本
        const markdownArray = sortedTweetsData.map(tweetData => tweetData.markdown);

        // 3. 用分隔符连接所有推文的Markdown
        const markdownOutput = markdownArray.join('\n\n---\n\n');
        const newWindow = window.open('', '_blank');
        newWindow.document.write('<pre style="white-space: pre-wrap; word-wrap: break-word; padding: 10px;">' + markdownOutput.replace(/</g, "&lt;").replace(/>/g, "&gt;") + '</pre>');
        newWindow.document.title = 'Twitter Feed as Markdown';
    }

    function extractTextContent(element) {
        if (!element) return '';
        let text = '';
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName === 'IMG') { // 处理表情符号图片
                    text += node.alt;
                } else if (node.tagName === 'A') { // 处理链接
                    const url = node.href;
                    if (!url.includes('/photo/') && !url.includes('/video/')) {
                        text += `[${node.textContent}](${url})`;
                    }
                } else {
                    text += node.textContent;
                }
            } else {
                text += node.textContent;
            }
        });
        return text.trim();
    }

    /**
     * 【已修改】格式化单个推文，按新格式生成Markdown，并返回一个包含完整数据的对象
     */
    function formatTweet(tweet) {
        const timeElement = tweet.querySelector('time');
        if (!timeElement) return null;

        const linkElement = timeElement.closest('a');
        if (!linkElement) return null;

        const tweetUrl = 'https://x.com' + linkElement.getAttribute('href');
        const authorHandle = `@${tweetUrl.split('/')[3]}`;
        const postTime = timeElement.getAttribute('datetime');

        const mainContentElement = tweet.querySelector('div[data-testid="tweetText"]');
        const mainContent = mainContentElement ? extractTextContent(mainContentElement) : '';

        // --- 提取推文的各个组成部分 ---

        // 引用推文
        let quoteContent = '';
        const quoteHeader = Array.from(tweet.querySelectorAll('span')).find(s => s.textContent === 'Quote');
        if (quoteHeader) {
            const quoteContainer = quoteHeader.parentElement.nextElementSibling;
            if (quoteContainer && quoteContainer.getAttribute('role') === 'link') {
                const quoteAuthorEl = quoteContainer.querySelector('[data-testid="User-Name"]');
                const quoteAuthor = quoteAuthorEl ? quoteAuthorEl.textContent.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim() : '未知作者';
                const quoteTextEl = quoteContainer.querySelector('div[lang]');
                const quoteText = quoteTextEl ? extractTextContent(quoteTextEl) : '';
                if(quoteText) {
                    const quoteLines = `**${quoteAuthor}**: ${quoteText}`.split('\n');
                    quoteContent = `\n\n${quoteLines.map(line => `> ${line}`).join('\n> ')}`;
                }
            }
        }

        // 分享的链接卡片
        let sharedLink = '';
        const cardWrapper = tweet.querySelector('[data-testid="card.wrapper"]');
        if (cardWrapper) {
            const cardLinkEl = cardWrapper.querySelector('a');
            if (cardLinkEl) {
                const cardUrl = cardLinkEl.href;
                const detailContainer = cardWrapper.querySelector('[data-testid$="detail"]');
                let cardTitle = '';
                if (detailContainer) {
                    const spans = detailContainer.querySelectorAll('span');
                    cardTitle = spans.length > 1 ? spans[1].textContent : '链接';
                } else {
                    const largeMediaTitleEl = cardWrapper.querySelector('div[class*="r-fdjqy7"] span');
                    cardTitle = largeMediaTitleEl ? largeMediaTitleEl.textContent : '链接';
                }
                // 修改了分享链接的格式，不再是列表项
                sharedLink = `\n\n**分享链接**: [${cardTitle.trim()}](${cardUrl})`;
            }
        }

        // 转推信息
        let repostedBy = '';
        const socialContext = tweet.querySelector('[data-testid="socialContext"]');
        if (socialContext && socialContext.textContent.toLowerCase().includes('reposted')) {
            repostedBy = `> *由 ${socialContext.textContent.replace(/reposted/i, '').trim()} 转推*\n\n`;
        }

        // 主题帖（串推）提示
        let threadIndicator = '';
        const hasThreadLink = Array.from(tweet.querySelectorAll('a[role="link"] span')).some(span => span.textContent === 'Show this thread' || span.textContent === '显示此主题帖');
        if (hasThreadLink) {
            // 修改了主题帖提示的格式，不再是列表项
            threadIndicator = `*这是一个主题帖*\n\n`;
        }

        // --- 按照新的要求组合 Markdown ---

        // 1. 将所有内容部分（转推、主题帖、正文、引用、链接）组合成一个单独的块
        const contentBlock = `${repostedBy}${threadIndicator}${mainContent}${quoteContent}${sharedLink}`;

        // 2. 构建最终的 Markdown 字符串，采用新的无标签格式
        let markdown = `- ${tweetUrl}\n`;
        markdown += `- ${authorHandle}\n`;
        markdown += `- ${postTime}\n`;
        // 只有当内容块不为空时，才添加内容
        if (contentBlock.trim()) {
            markdown += `\n${contentBlock.trim()}`;
        }

        // 3. 返回一个包含所有需要的数据的对象，特别是 postTime 用于排序
        return {
            url: tweetUrl,
            markdown: markdown,
            postTime: postTime
        };
    }
})();