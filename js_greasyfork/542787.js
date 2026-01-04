// ==UserScript==
// @name         联合早报即时新闻一行一条
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  每条新闻独占一行，标题和日期同一行，超长省略，日期在行末，保留滚动加载，修复死循环和单列问题
// @match        https://www.zaobao.com/realtime/*
// @match        https://www.zaobao.com.sg/realtime/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542787/%E8%81%94%E5%90%88%E6%97%A9%E6%8A%A5%E5%8D%B3%E6%97%B6%E6%96%B0%E9%97%BB%E4%B8%80%E8%A1%8C%E4%B8%80%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/542787/%E8%81%94%E5%90%88%E6%97%A9%E6%8A%A5%E5%8D%B3%E6%97%B6%E6%96%B0%E9%97%BB%E4%B8%80%E8%A1%8C%E4%B8%80%E6%9D%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 强制主新闻列表单列
    function injectSingleColumnStyle() {
        if (document.getElementById('zb-news-single-col-style')) return;
        const style = document.createElement('style');
        style.id = 'zb-news-single-col-style';
        style.innerHTML = `
            main [data-testid="article-list"] .grid {
                display: grid !important;
                grid-template-columns: 1fr !important;
                max-width: 1200px !important;
                width: 100% !important;
                margin: 0 auto !important;
            }
            main [data-testid="article-list"] .grid > article {
                width: 100% !important;
                box-sizing: border-box;
            }
            main [data-testid="article-list"] .grid > article .zb-news-row {
                display: flex;
                align-items: center;
                width: 100%;
                font-size: 1.1em;
                padding: 0.5em 0.8em;
                border-bottom: 1px solid #eee;
                background: #fff;
                min-height: 2.5em;
            }
            main [data-testid="article-list"] .grid > article .zb-news-title {
                flex: 1 1 0%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-weight: 500;
                font-size: 1em;
            }
            main [data-testid="article-list"] .grid > article .zb-news-date {
                flex: none;
                margin-left: 1em;
                color: #888;
                font-size: 0.95em;
                white-space: nowrap;
                text-align: right;
                min-width: 6em;
            }
        `;
        document.head.appendChild(style);
    }

    // 隐藏延伸阅读和相关热词区块
    function hideExtraBlocks() {
        document.querySelectorAll('section.further-reading').forEach(el => {
            el.style.display = 'none';
        });
        document.querySelectorAll('.article-relative-word').forEach(el => {
            el.style.display = 'none';
        });
    }

    function simplifyNewsList() {
        injectSingleColumnStyle();
        document.querySelectorAll('main [data-testid="article-list"] .grid > article').forEach(article => {
            if (article.hasAttribute('data-zb-simplified')) return; // 避免重复处理
            // 查找标题和日期
            const link = article.querySelector('a');
            const dateDiv = article.querySelector('div.text-xs');
            if (link && dateDiv) {
                // 清空内容，只保留标题和日期
                article.innerHTML = '';
                // 创建一行容器
                const row = document.createElement('div');
                row.style.display = 'flex';
                row.style.alignItems = 'center';
                row.style.width = '100%';
                row.style.maxWidth = '1100px';
                row.style.margin = '0 auto';
                row.style.padding = '0 24px';
                row.style.boxSizing = 'border-box';
                row.style.minHeight = '48px';
                row.style.borderBottom = '1px solid #eee';
                row.style.background = '#fff';
                row.style.fontSize = '18px';
                row.style.lineHeight = '1.8';
                row.style.whiteSpace = 'nowrap';
                row.style.overflow = 'hidden';

                // 标题样式
                link.style.flex = '1 1 auto';
                link.style.whiteSpace = 'nowrap';
                link.style.overflow = 'hidden';
                link.style.textOverflow = 'ellipsis';
                link.style.marginRight = '16px';
                link.style.display = 'block';
                link.style.color = '#222';
                link.style.textDecoration = 'none';

                // 日期样式
                dateDiv.style.flex = 'none';
                dateDiv.style.marginLeft = 'auto';
                dateDiv.style.color = '#888';
                dateDiv.style.whiteSpace = 'nowrap';
                dateDiv.style.fontSize = '0.95em';
                dateDiv.style.minWidth = '70px';
                dateDiv.style.textAlign = 'right';

                row.appendChild(link);
                row.appendChild(dateDiv);
                article.appendChild(row);
                article.setAttribute('data-zb-simplified', '1');
            }
        });
        // 隐藏无关区块
        hideExtraBlocks();
    }

    // 初始执行
    injectSingleColumnStyle();
    simplifyNewsList();
    hideExtraBlocks();

    // 监听滚动加载/异步加载
    const observer = new MutationObserver(() => {
        simplifyNewsList();
        hideExtraBlocks();
    });
    observer.observe(document.body, { childList: true, subtree: true });
})(); 