// ==UserScript==
// @name         Chinese Number Formatter
// @namespace    http://tampermonkey.net/
// @version     0.2
// @description  将网页中的大数字转换为中文亿、万格式
// @author       lanyi1998
// @match       *://www.rootdata.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524007/Chinese%20Number%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/524007/Chinese%20Number%20Formatter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function formatNumberToChinese(number) {
        // 移除所有逗号和多余空格
        number = number.replace(/,|\s/g, '');
        // 转换为数字
        const num = parseFloat(number);

        if (isNaN(num)) return number;

        if (num >= 100000000) { // 亿
            return (num / 100000000).toFixed(2) + '亿';
        } else if (num >= 10000) { // 万
            return (num / 10000).toFixed(2) + '万';
        }
        return number;
    }

    function replaceNumbers() {
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            const text = node.nodeValue;

            // 匹配两种格式：
            // 1. $后面跟着数字（可能包含逗号和小数点）
            // 2. 纯数字格式（可能包含逗号和小数点，前后可能有空格）
            const regex = /(?:\$\s*[\d,]+(?:\.\d+)?)|(?:(?:^|\s)[\d,]+(?:\.\d+)?(?:\s|$))/g;

            if (regex.test(text)) {
                node.nodeValue = text.replace(regex, (match) => {
                    // 如果是美元金额，保留$符号
                    if (match.includes('$')) {
                        const number = match.slice(match.indexOf('$') + 1);
                        return '$' + formatNumberToChinese(number);
                    }
                    // 普通数字
                    return formatNumberToChinese(match);
                });
            }
        }
    }

    // 初始执行
    setTimeout(replaceNumbers, 1000); // 延迟1秒执行，确保页面加载完成

    // 监听动态内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                replaceNumbers();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();