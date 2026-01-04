// ==UserScript==
// @name         日期格式转换
// @namespace    http://frank6.com/
// @version      1.4
// @description  将英文版的日期格式转换为2024年9月10日这种格式
// @author       Frank6
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/507925/%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/507925/%E6%97%A5%E6%9C%9F%E6%A0%BC%E5%BC%8F%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 匹配常见的英文日期格式：09/10/2024, September 10, 2024, Sep 10, 2024, 17 August 2024
    const dateRegex = /((?:(?:\d{1,2}\/\d{1,2}\/)|(?:\w+\b[\s-.]\s?\w+\b,?\s))(?:\d{4}|\d{2}))/g;


    // 获取页面中的所有文本节点
    function walk(node) {
        let child, next;
        switch (node.nodeType) {
            case 1: // Element
            case 9: // Document
            case 11: // Document fragment
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;
            case 3: // Text node
                handleText(node);
                break;
        }
    }

    // 处理文本节点
    function handleText(textNode) {
        let text = textNode.nodeValue;
        textNode.nodeValue = text.replace(dateRegex, function (match) {
            return convertDate(match);
        });
    }

    // 将英文日期格式转换为中文日期格式
    function convertDate(dateStr) {

        const months = {
            January: 1, February: 2, March: 3, April: 4, May: 5, June: 6,
            July: 7, August: 8, September: 9, October: 10, November: 11, December: 12,
            Jan: 1, Feb: 2, Mar: 3, Apr: 4, Jun: 6,
            Jul: 7, Aug: 8, Sep: 9, Oct: 10, Nov: 11, Dec: 12,
            Janu:1, Febr:2, Marc:3, Apri:4, June:6,
            Juli:7, Agus:8, Sept:9, Octo:10, Nov:11, Dece:12,
        };


        let firstDateMatch = /(\w+)[\s-.]?\s?(\d{1,2}),?\s(\d{4}|\d{2})/.exec(dateStr);
        if (firstDateMatch && months[firstDateMatch[1]]) {
            let month = months[firstDateMatch[1]];
            let day = firstDateMatch[2];
            let year = firstDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        // 处理 "09/10/2024" 格式
        let slashDateMatch = /(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(dateStr);
        if (slashDateMatch) {
            let month = slashDateMatch[1];
            let day = slashDateMatch[2];
            let year = slashDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        // 处理 "17 August 2024"、"01-Sep, 2024"、"01 Sep, 24" 格式
        let reverseDateMatch = /(\d{1,2})[\s-](\w+),?[\s-](\d{4}|\d{2})/.exec(dateStr);
        if (reverseDateMatch && months[reverseDateMatch[2]]) {
            let day = reverseDateMatch[1];
            let month = months[reverseDateMatch[2]];
            let year = reverseDateMatch[3];
            return `${year}年${month}月${day}日`;
        }

        return dateStr; // 如果无法匹配，则返回原始文本
    }

    // 执行
    walk(document.body);
})();
