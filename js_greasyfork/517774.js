// ==UserScript==
// @name         《日·键圈时刻表》目录生成（兼容新版/旧版）
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  支持新版 opus 页面和旧版 read 页面，自动生成目录，支持评论区跳转，滚动隐藏头部，多区块高亮
// @match        https://www.bilibili.com/opus/*
// @match        https://www.bilibili.com/read/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517774/%E3%80%8A%E6%97%A5%C2%B7%E9%94%AE%E5%9C%88%E6%97%B6%E5%88%BB%E8%A1%A8%E3%80%8B%E7%9B%AE%E5%BD%95%E7%94%9F%E6%88%90%EF%BC%88%E5%85%BC%E5%AE%B9%E6%96%B0%E7%89%88%E6%97%A7%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/517774/%E3%80%8A%E6%97%A5%C2%B7%E9%94%AE%E5%9C%88%E6%97%B6%E5%88%BB%E8%A1%A8%E3%80%8B%E7%9B%AE%E5%BD%95%E7%94%9F%E6%88%90%EF%BC%88%E5%85%BC%E5%AE%B9%E6%96%B0%E7%89%88%E6%97%A7%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isOpusPage = location.pathname.startsWith('/opus/');
    const isReadPage = location.pathname.startsWith('/read/');

    let lastScrollTop = 0;
    const headersToHide = [];

    // 隐藏头部（新版/旧版）
    function hideHeaders() {
        if (isOpusPage) {
            // 新版 opus 页头
            const opusHeader1 = document.querySelector('.bili-header__bar') || document.querySelector('.bili-header__bar.mini-header');
            const opusHeader2 = document.querySelector('.fixed-author-header') || document.querySelector('.opus-header-fixed');
            if (opusHeader1) headersToHide.push(opusHeader1);
            if (opusHeader2) headersToHide.push(opusHeader2);
        } else if (isReadPage) {
            // 旧版 read 页头
            const readHeader1 = document.querySelector('#bili-header-container');
            const readHeader2 = document.querySelector('.fixed-top-header');
            if (readHeader1) headersToHide.push(readHeader1);
            if (readHeader2) headersToHide.push(readHeader2);
        }

        if (headersToHide.length > 0) {
            window.addEventListener('scroll', () => {
                const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
                headersToHide.forEach(header => {
                    header.style.transition = 'top 0.3s';
                    if (currentScrollTop > lastScrollTop) {
                        header.style.top = '-100px';
                    } else {
                        header.style.top = '0';
                    }
                });
                lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
            });
        }
    }

    setTimeout(hideHeaders, 1000);

    // 创建目录容器
    const tocContainer = document.createElement('div');
    Object.assign(tocContainer.style, {
        position: 'fixed',
        left: '10px',
        top: '10px',
        width: '388px',
        maxHeight: '96vh',
        overflowY: 'auto',
        padding: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '8px',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        zIndex: '1000'
    });

    const tocTitle = document.createElement('h3');
    tocTitle.innerText = '目录';
    Object.assign(tocTitle.style, {
        textAlign: 'center',
        marginBottom: '15px',
        fontFamily: 'Arial, sans-serif',
        color: '#333',
        fontSize: '18px'
    });
    tocContainer.appendChild(tocTitle);

    const highlightKeywords = ["置顶区", "消息区", "日常区", "常驻区"];

    // 生成目录
    function generateTOC() {
        if (isOpusPage) {
            // 新版 opus 页面标题结构：可能是 h2 / strong / span
            const contentRoot = document.querySelector('.opus-detail') || document.body;
            const titleNodes = contentRoot.querySelectorAll('h1, h2, h3, p strong');

            titleNodes.forEach((node, index) => {
                const text = node.innerText.trim();
                if (!text) return;

                // 过滤掉非主要标题
                const fontSize = parseFloat(window.getComputedStyle(node).fontSize);
                if (fontSize < 18) return;

                const id = 'toc-header-' + index;
                node.id = id;

                const tocItem = document.createElement('a');
                tocItem.href = '#' + id;
                tocItem.innerText = text;
                Object.assign(tocItem.style, {
                    display: 'block',
                    color: '#007bff',
                    textDecoration: 'none',
                    fontSize: '13px',
                    marginBottom: '5px'
                });

                if (highlightKeywords.some(k => text.includes(k))) {
                    tocItem.style.fontWeight = 'bold';
                    tocItem.style.color = '#ff4500';
                    tocItem.style.fontSize = '16px';
                }

                tocItem.onmouseover = () => tocItem.style.textDecoration = 'underline';
                tocItem.onmouseout = () => tocItem.style.textDecoration = 'none';

                tocContainer.appendChild(tocItem);
            });

        } else if (isReadPage) {
            const h1Tags = document.querySelectorAll('h1');
            h1Tags.forEach((h1Tag, index) => {
                const text = h1Tag.textContent.trim();
                if (!text) return;

                const id = 'toc-header-' + index;
                h1Tag.id = id;

                const tocItem = document.createElement('a');
                tocItem.href = '#' + id;
                tocItem.innerText = text;
                Object.assign(tocItem.style, {
                    display: 'block',
                    color: '#007bff',
                    textDecoration: 'none',
                    fontSize: '13px',
                    marginBottom: '5px'
                });

                if (highlightKeywords.some(k => text.includes(k))) {
                    tocItem.style.fontWeight = 'bold';
                    tocItem.style.color = '#ff4500';
                    tocItem.style.fontSize = '16px';
                }

                tocItem.onmouseover = () => tocItem.style.textDecoration = 'underline';
                tocItem.onmouseout = () => tocItem.style.textDecoration = 'none';

                tocContainer.appendChild(tocItem);
            });
        }
    }

    // 评论区入口
    function addCommentLink() {
        const commentItem = document.createElement('a');
        Object.assign(commentItem.style, {
            display: 'block',
            color: '#dc3545',
            textDecoration: 'none',
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '10px'
        });

        if (isReadPage) {
            const commentWrapper = document.querySelector('#comment-wrapper.comment-wrapper');
            if (commentWrapper) {
                commentItem.href = '#comment-wrapper';
                commentItem.innerText = '评论区';
            }
        } else if (isOpusPage) {
            const commentSection = document.querySelector('#commentapp') || document.querySelector('.opus-comment') || document.querySelector('.bili-tabs.opus-tabs');
            if (commentSection) {
                commentSection.id = 'opus-comment-section';
                commentItem.href = '#opus-comment-section';
                commentItem.innerText = '评论区';
            }
        }

        commentItem.onmouseover = () => commentItem.style.textDecoration = 'underline';
        commentItem.onmouseout = () => commentItem.style.textDecoration = 'none';

        tocContainer.appendChild(commentItem);
    }

    setTimeout(() => {
        generateTOC();
        addCommentLink();
        if (tocContainer.childElementCount > 1) {
            document.body.appendChild(tocContainer);
        }
    }, 1500);

})();
