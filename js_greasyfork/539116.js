// ==UserScript==
// @name         Discuz! 引用内容快速查看
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  在Discuz!论坛点击引用链接时显示被引用内容的悬浮框(修复图片懒加载问题)
// @author       mmm
// @match        *://*/forum.php?mod=viewthread&tid=*
// @match        *://*/thread-*
// @match        *://*/*/forum.php?mod=viewthread&tid=*
// @match        *://*/*/thread-*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/539116/Discuz%21%20%E5%BC%95%E7%94%A8%E5%86%85%E5%AE%B9%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/539116/Discuz%21%20%E5%BC%95%E7%94%A8%E5%86%85%E5%AE%B9%E5%BF%AB%E9%80%9F%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取引用块基准样式
    function getBaseStyles() {
        const quote = document.querySelector('.quote') || document.createElement('div');
        const styles = getComputedStyle(quote);
        return {
            bg: styles.backgroundColor || 'rgb(245, 245, 245)',
            border: styles.borderColor || 'rgb(221, 221, 221)',
            text: styles.color || 'rgb(51, 51, 51)'
        };
    }

    // 创建现代CSS样式（使用color-mix）
    GM_addStyle(`
        .quote-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: color-mix(in srgb, ${getBaseStyles().bg} 85%, white);
            border: 1px solid color-mix(in srgb, ${getBaseStyles().border} 80%, white);
            color: ${getBaseStyles().text};
            padding: 12px;
            max-width: min(80%, 800px);
            max-height: 80vh;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            border-radius: 8px;
            overflow: auto;
            display: none;
            font-size: 1.2em;
        }
        .quote-popup-content {
            max-height: calc(80vh - 60px);
            overflow-y: auto;
            padding-right: 8px;
        }
        .quote-popup-header {
            font-weight: bold;
            margin-bottom: 12px;
            padding-bottom: 6px;
            border-bottom: 1px solid color-mix(in srgb, ${getBaseStyles().border} 70%, white);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .quote-popup-close, .quote-popup-back {
            cursor: pointer;
            font-size: 18px;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;
        }
        .quote-popup-close:hover, .quote-popup-back:hover {
            background: color-mix(in srgb, ${getBaseStyles().bg} 70%, white);
        }
        .quote-popup-back {
            margin-right: auto;
        }
        .quote-loading {
            padding: 20px;
            text-align: center;
            opacity: 0.7;
        }
        @media (max-width: 600px) {
            .quote-popup {
                width: 95%;
                max-width: none;
            }
        }
    `);

    // 创建悬浮框元素
    const popup = document.createElement('div');
    popup.className = 'quote-popup';
    popup.innerHTML = `
        <div class="quote-popup-header">
            <div class="quote-popup-back" style="display:none">↩︎</div>
            <span>引用内容</span>
            <div class="quote-popup-close">×</div>
        </div>
        <div class="quote-popup-content"></div>
    `;
    document.body.appendChild(popup);

    const backBtn = document.querySelector('.quote-popup-back');
    const closeBtn = document.querySelector('.quote-popup-close');
    const content = document.querySelector('.quote-popup-content');

    // 页面缓存
    const pageCache = new Map();
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5分钟缓存

    // 历史记录栈
    const historyStack = [];

    // 显示/隐藏悬浮框
    function showPopup() {
        popup.style.display = 'block';
    }

    function hidePopup() {
        popup.style.display = 'none';
        historyStack.length = 0;
        backBtn.style.display = 'none';
    }

    // 修复懒加载图片
    function fixLazyLoadImages(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        tempDiv.querySelectorAll('img[file]').forEach(img => {
            const fileValue = img.getAttribute('file');
            if (fileValue) {
                img.setAttribute('src', fileValue);
                img.removeAttribute('file');
                img.removeAttribute('onmouseover');
                img.removeAttribute('onload');
            }
        });

        return tempDiv.innerHTML;
    }

    // 从URL中提取帖子ID和页码
    function extractIdsFromUrl(url) {
        const pidMatch = url.match(/pid=(\d+)/);
        const ptidMatch = url.match(/ptid=(\d+)/);
        return {
            pid: pidMatch ? pidMatch[1] : null,
            ptid: ptidMatch ? ptidMatch[1] : null
        };
    }

    // 检查当前页面是否包含目标元素
    function checkCurrentPageForElement(pid) {
        const element = document.querySelector(`#pid${pid} .t_f`);
        return element ? fixLazyLoadImages(element.innerHTML) : null;
    }

    // 获取帖子内容
    function fetchPostContent(url, callback, isBackAction = false) {
        content.innerHTML = '<div class="quote-loading">加载中...</div>';
        showPopup();

        const ids = extractIdsFromUrl(url);

        // 优先检查当前页面
        const currentPageContent = checkCurrentPageForElement(ids.pid);
        if (currentPageContent) {
            if (!isBackAction) {
                historyStack.push({ url, html: currentPageContent });
            }
            callback(currentPageContent);
            backBtn.style.display = historyStack.length > 1 ? 'block' : 'none';
            return;
        }

        // 检查缓存
        const cachedData = pageCache.get(url);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_EXPIRY)) {
            const fixedHtml = fixLazyLoadImages(cachedData.html);
            if (!isBackAction) {
                historyStack.push({ url, html: fixedHtml });
            }
            callback(fixedHtml);
            backBtn.style.display = historyStack.length > 1 ? 'block' : 'none';
            return;
        }

        // 从网络获取
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const quoteContent = doc.querySelector(`#pid${ids.pid} .t_f`);

                if (quoteContent) {
                    const fixedHtml = fixLazyLoadImages(quoteContent.innerHTML);

                    pageCache.set(url, {
                        html: quoteContent.innerHTML,
                        timestamp: Date.now()
                    });

                    if (!isBackAction) {
                        historyStack.push({ url, html: fixedHtml });
                    }

                    callback(fixedHtml);
                    backBtn.style.display = historyStack.length > 1 ? 'block' : 'none';
                } else {
                    callback("无法找到引用内容");
                }
            },
            onerror: function() {
                callback("加载引用内容失败");
            }
        });
    }

    // 处理返回按钮点击
    function handleBackClick() {
        if (historyStack.length > 1) {
            historyStack.pop();
            const previousItem = historyStack[historyStack.length - 1];
            content.innerHTML = previousItem.html;

            content.querySelectorAll('.quote a font').forEach(newLink => {
                newLink.parentNode.addEventListener('click', handleQuoteClick);
            });

            backBtn.style.display = historyStack.length > 1 ? 'block' : 'none';
        }
    }

    // 处理引用链接点击
    function handleQuoteClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const link = e.currentTarget;
        const href = link.href;

        fetchPostContent(href, function(htmlContent) {
            content.innerHTML = htmlContent;

            content.querySelectorAll('.quote a font').forEach(newLink => {
                newLink.parentNode.addEventListener('click', handleQuoteClick);
            });
        });
    }

    // 事件绑定
    closeBtn.addEventListener('click', hidePopup);
    backBtn.addEventListener('click', handleBackClick);

    document.addEventListener('click', function(e) {
        if (!popup.contains(e.target) && !e.target.closest('.quote a font')) {
            hidePopup();
        }
    });

    // 初始化引用链接
    function initQuoteLinks() {
        document.querySelectorAll('.quote a font').forEach(link => {
            link.parentNode.addEventListener('click', handleQuoteClick);
        });
    }

    // 启动
    initQuoteLinks();
})();