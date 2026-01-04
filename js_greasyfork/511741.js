// ==UserScript==
// @name         Facebook 文本樣式調整（可自定義）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自定義 Facebook 的字體大小、行間距和段落間距
// @match        https://*.facebook.com/*
// @grant        n
// @license MITone
// @downloadURL https://update.greasyfork.org/scripts/511741/Facebook%20%E6%96%87%E6%9C%AC%E6%A8%A3%E5%BC%8F%E8%AA%BF%E6%95%B4%EF%BC%88%E5%8F%AF%E8%87%AA%E5%AE%9A%E7%BE%A9%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/511741/Facebook%20%E6%96%87%E6%9C%AC%E6%A8%A3%E5%BC%8F%E8%AA%BF%E6%95%B4%EF%BC%88%E5%8F%AF%E8%87%AA%E5%AE%9A%E7%BE%A9%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 可調整的參數
    const fontSize = 18; // 字體大小（px）
    const lineHeight = 1.25; // 行間距（倍數）
    const paragraphSpacing = 1.5; // 段落間距（em）

    // 創建樣式
    const style = document.createElement('style');
    style.textContent = `
        /* 全局字體大小設置 */
        body, div, span, p, a {
            font-size: ${fontSize}px !important;
        }

        /* 文本容器樣式 */
        div[data-ad-preview="message"], div[data-ad-comet-preview="message"],
        div[data-testid="post_message"], div[data-testid="comment"],
        .userContent, ._5pbx, ._3576, .UFICommentBody, ._2vja {
            font-size: ${fontSize}px !important;
            line-height: ${lineHeight} !important;
            word-wrap: break-word !important;
            white-space: pre-wrap !important;
        }

        /* 確保內聯元素不會破壞行高 */
        div[data-ad-preview="message"] *, div[data-ad-comet-preview="message"] *,
        div[data-testid="post_message"] *, div[data-testid="comment"] *,
        .userContent *, ._5pbx *, ._3576 *, .UFICommentBody *, ._2vja * {
            line-height: inherit !important;
        }

        /* 段落間距 */
        div[data-ad-preview="message"] > div, div[data-ad-comet-preview="message"] > div,
        div[data-testid="post_message"] > div, div[data-testid="comment"] > div,
        .userContent > div, ._5pbx > div, ._3576 > div, .UFICommentBody > div, ._2vja > div {
            margin-bottom: ${paragraphSpacing}em !important;
        }
    `;

    // 將樣式添加到文檔頭部
    document.head.appendChild(style);

    // 處理新添加的元素
    function processNewElement(element) {
        if (element.nodeType === Node.ELEMENT_NODE) {
            // 檢查元素是否包含文本內容
            if (element.textContent.trim().length > 0) {
                element.style.fontSize = `${fontSize}px`;
                element.style.lineHeight = lineHeight.toString();
                element.style.wordWrap = 'break-word';
                element.style.whiteSpace = 'pre-wrap';
            }
            
            // 遞歸處理子元素
            Array.from(element.children).forEach(processNewElement);
        }
    }

    // 監聽 DOM 變化，以應對動態加載的內容
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(processNewElement);
            }
        });
    });

    // 配置觀察選項
    const config = { childList: true, subtree: true };

    // 開始觀察文檔主體的變化
    observer.observe(document.body, config);

    // 立即處理當前頁面上的元素
    processNewElement(document.body);
})();