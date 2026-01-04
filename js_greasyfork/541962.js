// ==UserScript==
// @name         gcc问卷星
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动刷新页面，如果页面中的时间与本地时间相差小于5秒
// @author       You
// @match        *://*.wjx.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541962/gcc%E9%97%AE%E5%8D%B7%E6%98%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/541962/gcc%E9%97%AE%E5%8D%B7%E6%98%9F.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检测间隔时间（毫秒）
    const intervalTime = 100;

    // 时间差距阈值（毫秒）
    const timeDifferenceThreshold = 5000;

    // 正则表达式匹配时间格式，如：2025-05-25 13:39 或 2025-05-25 13:38:55
    const timeRegex = /\b\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?\b/g;

    // 查找页面中所有文本节点
    function findTextNodes(node) {
        let textNodes = [];
        if (node.nodeType === Node.TEXT_NODE) {
            textNodes.push(node);
        } else {
            node.childNodes.forEach(child => {
                textNodes = textNodes.concat(findTextNodes(child));
            });
        }
        return textNodes;
    }

    // 解析时间字符串为Date对象
    function parseTime(timeStr) {
        return new Date(timeStr);
    }

    // 检查页面中的时间是否与本地时间相差小于5秒
    function checkTimeAndRefresh() {
        const textNodes = findTextNodes(document.body);
        let foundTime = false;

        for (const node of textNodes) {
            const matches = node.nodeValue.match(timeRegex);
            if (matches) {
                for (const match of matches) {
                    const pageTime = parseTime(match);
                    if (!isNaN(pageTime.getTime())) {
                        const now = new Date();
                        const diff = Math.abs(now - pageTime);
                        if (diff < timeDifferenceThreshold) {
                            foundTime = true;
                            location.reload(); // 刷新页面
                            return;
                        }
                    }
                }
            }
        }

        if (!foundTime) {
            console.log("未找到匹配的时间字符串，停止刷新");
        }
    }

    // 启动定时检测
    const intervalId = setInterval(checkTimeAndRefresh, intervalTime);
})();