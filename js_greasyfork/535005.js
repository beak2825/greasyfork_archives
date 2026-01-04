// ==UserScript==
// @name         FF14微博十二神屏蔽男找帖子
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  精准屏蔽原贴和转发内容中的关键词
// @author       DeepSeek R1
// @match        *://weibo.com/*
// @match        *://*.weibo.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535005/FF14%E5%BE%AE%E5%8D%9A%E5%8D%81%E4%BA%8C%E7%A5%9E%E5%B1%8F%E8%94%BD%E7%94%B7%E6%89%BE%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/535005/FF14%E5%BE%AE%E5%8D%9A%E5%8D%81%E4%BA%8C%E7%A5%9E%E5%B1%8F%E8%94%BD%E7%94%B7%E6%89%BE%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const KEYWORD = '男找';
    const BLOCK_TEXT = '🚫 违规内容已屏蔽';
    const RETWEET_CLASS = '.retweet'; // 转发内容容器
    const TEXT_SELECTOR = 'div[class*="detail_wbtext"]'; // 文本内容选择器

    function processContent(element) {
        if(element.dataset.processed) return;
        element.dataset.processed = 'true';

        const rawText = element.innerText
            .replace(/&ZeroWidthSpace;/gi, '')
            .replace(/\s+/g, ' ');

        if(rawText.includes(KEYWORD)) {
            const container = element.closest(RETWEET_CLASS) || element.closest('.wbpro-feed-content');
            if(container) {
                container.innerHTML = `
                    <div style="
                        padding: 12px;
                        background: #fff8f8;
                        border: 1px solid #ffe0e0;
                        color: #ff4444;
                        border-radius: 4px;
                        margin: 8px 0;
                        font-size: 14px;
                    ">
                        ${BLOCK_TEXT}
                        <div style="
                            margin-top: 6px;
                            font-size: 12px;
                            color: #ff9999;
                        ">
                            原内容包含违规关键词
                        </div>
                    </div>
                `;

                // 同时降低整个帖子透明度
                const post = container.closest('article');
                if(post) post.style.opacity = '0.3';
            }
        }
    }

    function checkPosts() {
        // 同时检测原贴和转发内容
        document.querySelectorAll(`${TEXT_SELECTOR}, ${RETWEET_CLASS} ${TEXT_SELECTOR}`).forEach(processContent);
    }

    // 增强型MutationObserver
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                setTimeout(checkPosts, 500); // 增加延迟确保动态加载完成
            }
        });
    });

    // 初始化
    window.addEventListener('load', () => {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        checkPosts();
    });

    // 滚动监听优化
    let lastCheck = 0;
    window.addEventListener('scroll', () => {
        if(Date.now() - lastCheck > 1000) {
            checkPosts();
            lastCheck = Date.now();
        }
    });
})();