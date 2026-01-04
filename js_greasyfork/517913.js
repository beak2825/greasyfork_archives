// ==UserScript==
// @name         日期格式转换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将多种英文日期格式转换为“年月日”格式
// @author       Akirami
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/517913/%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/517913/%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 正则表达式匹配常见日期格式
    const dateRegexList = [
        /\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, // 18/11/2024
        /\b(\d{1,2})\s(\w+)\s(\d{4})\b/g, // 18 November 2024
        /\b(\w+)\s(\d{1,2}),\s(\d{4})\b/g // November 18, 2024
    ];

    // 英文月份与数字映射
    const monthMap = {
        January: 1, Jan: 1,
        February: 2, Feb: 2,
        March: 3, Mar: 3,
        April: 4, Apr: 4,
        May: 5,
        June: 6, Jun: 6,
        July: 7, Jul: 7,
        August: 8, Aug: 8,
        September: 9, Sep: 9,
        October: 10, Oct: 10,
        November: 11, Nov: 11,
        December: 12, Dec: 12
    };

    // 替换函数，根据正则匹配的日期格式处理
    function replaceDate(match, p1, p2, p3, regexIndex) {
        switch (regexIndex) {
            case 0: // 18/11/2024
                return `${p3}年${parseInt(p1)}月${parseInt(p2)}日`;
            case 1: // 18 November 2024
                return `${p3}年${monthMap[p2]}月${parseInt(p1)}日`;
            case 2: // November 18, 2024
                return `${p3}年${monthMap[p1]}月${parseInt(p2)}日`;
        }
    }

    // 使用 TreeWalker 遍历文本节点
    function processTextNodes(root) {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            let textContent = node.textContent;
            let modified = false;

            dateRegexList.forEach((regex, index) => {
                if (regex.test(textContent)) {
                    textContent = textContent.replace(regex, (match, p1, p2, p3) =>
                        replaceDate(match, p1, p2, p3, index)
                    );
                    modified = true;
                }
            });

            // 只有在内容变化时更新节点，减少不必要的 DOM 修改
            if (modified) {
                node.textContent = textContent;
            }
        }
    }

    // 对页面的所有文本节点进行处理
    function processPage() {
        processTextNodes(document.body);
    }

    // 监听动态内容变化，仅处理新增或更改的部分
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processTextNodes(node);
                } else if (node.nodeType === Node.TEXT_NODE) {
                    let textContent = node.textContent;
                    let modified = false;

                    dateRegexList.forEach((regex, index) => {
                        if (regex.test(textContent)) {
                            textContent = textContent.replace(regex, (match, p1, p2, p3) =>
                                replaceDate(match, p1, p2, p3, index)
                            );
                            modified = true;
                        }
                    });

                    if (modified) {
                        node.textContent = textContent;
                    }
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始处理
    processPage();
})();