// ==UserScript==
// @name         BWF官网中文
// @namespace    https://greasyfork.org/users/1384897
// @version      0.2
// @description  将BWF官网翻译成中文
// @author       ✌
// @match        https://bwf.tournamentsoftware.com/*
// @match        https://www.tournamentsoftware.com/*
// @require https://update.greasyfork.org/scripts/514165/1472911/%E4%BA%BA%E5%90%8D%E7%BB%B4%E6%8A%A4.js
// @grant        MIT
// @downloadURL https://update.greasyfork.org/scripts/514166/BWF%E5%AE%98%E7%BD%91%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/514166/BWF%E5%AE%98%E7%BD%91%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const customDictionaryRegex = new RegExp(
        Array.from(customDictionary.keys()).map(key => key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'),
        'g'
    );

    const customNameDictionaryRegex = new RegExp(
        Array.from(customNameDictionary.keys()).map(key => `\\b${key}\\b`).join('|'),
        'gi'
    );

    // 月份映射表，将英文缩写映射到对应的月份数字
    const monthMapping = {
        "Jan": "1",
        "Feb": "2",
        "Mar": "3",
        "Apr": "4",
        "May": "5",
        "Jun": "6",
        "Jul": "7",
        "Aug": "8",
        "Sep": "9",
        "Oct": "10",
        "Nov": "11",
        "Dec": "12"
    };

    window.addEventListener('load', function() {
        replaceTextWithDictionaryAndFormatDates();
        formatDateInTimeTags(); // 格式化 <time> 标签中的日期
        formatComplexDatesInText();
        replaceSpecificText(); // 对特定文本进行替换

        // 使用 MutationObserver 监测 DOM 变化，确保动态加载内容也能被替换
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    replaceTextWithDictionaryAndFormatDates();
                    formatDateInTimeTags(); // 对新增的 <time> 标签内容进行格式化
                    formatComplexDatesInText();
                }
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    });

    function replaceTextWithDictionaryAndFormatDates() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        // 遍历文本节点并替换自定义词汇和日期格式
        while (node = walker.nextNode()) {
            let newText = replaceWithCustomNameDictionary(node.nodeValue);
            // 跳过 #PlayersView 内部的节点
            if (node.nodeValue.trim() && !isInsidePlayersView(node)) {
                newText = replaceWithCustomDictionary(newText);
            }
            newText = formatDateToChinese(newText); // 格式化日期
            node.nodeValue = newText;
        }
    }

    // 检查节点是否在 #PlayersView 内部
    function isInsidePlayersView(node) {
        let parent = node.parentNode;
        while (parent) {
            if (parent.id === 'PlayersView') {
                return true; // 节点在 #PlayersView 内部
            }
            parent = parent.parentNode;
        }
        return false;
    }

    // 批量替换函数
    function replaceWithCustomDictionary(text) {
        return text.replace(customDictionaryRegex, match => customDictionary.get(match) || match);
    }

    // 使用 Map 人名词汇表替换文本内容（大小写不敏感）
    function replaceWithCustomNameDictionary(text) {
        return text.replace(customNameDictionaryRegex, match => {
            const originalKey = Array.from(customNameDictionary.keys()).find(key =>
                key.toLowerCase() === match.toLowerCase()
            );
            return originalKey ? customNameDictionary.get(originalKey) : match;
        });
    }

    // 格式化普通文本中的日期，将 MM/DD/YYYY、MMM DD YYYY、MMM DD 至 MMM DD、MM月 DD 至 MM月 DD 格式转换为中文日期格式
    function formatDateToChinese(text) {
        // 处理 MM/DD/YYYY 格式
        text = text.replace(/\b(\d{1,2})\/(\d{1,2})\/(\d{4})\b/g, (match, month, day, year) => {
            return `${year}年${parseInt(month)}月${parseInt(day)}日`;
        });

        // 处理 MMM DD YYYY 格式
        text = text.replace(/\b([A-Za-z]{3}) (\d{1,2}) (\d{4})\b/g, (match, monthAbbr, day, year) => {
            const month = monthMapping[monthAbbr];
            return month ? `${year}年${month}月${parseInt(day)}日` : match;
        });

        // 处理 MMM DD 至 MMM DD 格式
        text = text.replace(/\b([A-Za-z]{3}) (\d{1,2}) 至 ([A-Za-z]{3}) (\d{1,2})\b/g, (match, startMonthAbbr, startDay, endMonthAbbr, endDay) => {
            const startMonth = monthMapping[startMonthAbbr];
            const endMonth = monthMapping[endMonthAbbr];
            if (startMonth && endMonth) {
                return `${startMonth}月${parseInt(startDay)}日 至 ${endMonth}月${parseInt(endDay)}日`;
            }
            return match;
        });

        // 处理 MM月 DD 至 MM月 DD 格式
        text = text.replace(/\b(\d{1,2})月 (\d{1,2}) 至 (\d{1,2})月 (\d{1,2})\b/g, (match, startMonth, startDay, endMonth, endDay) => {
            return `${startMonth}月${parseInt(startDay)}日 至 ${endMonth}月${parseInt(endDay)}日`;
        });

        return text;
    }

    // 格式化 <time> 标签中的日期，将 MM/DD/YYYY 和 MMM DD YYYY 格式转换为 YYYY年MM月DD日 格式
    function formatDateInTimeTags() {
        const timeTags = document.querySelectorAll('time');

        timeTags.forEach(timeTag => {
            const textContent = timeTag.textContent;

            // 检查 MM/DD/YYYY 格式的日期
            const mdYFormat = textContent.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
            if (mdYFormat) {
                const [ , month, day, year ] = mdYFormat;
                const formattedDate = `${year}年${parseInt(month)}月${parseInt(day)}日`;
                timeTag.textContent = formattedDate;
                timeTag.setAttribute('datetime', `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                return;
            }

            // 检查 MMM DD YYYY 格式的日期
            const mmmDFormat = textContent.match(/^([A-Za-z]{3}) (\d{1,2}) (\d{4})$/);
            if (mmmDFormat) {
                const [ , monthAbbr, day, year ] = mmmDFormat;
                const month = monthMapping[monthAbbr];
                if (month) {
                    const formattedDate = `${year}年${month}月${parseInt(day)}日`;
                    timeTag.textContent = formattedDate;
                    timeTag.setAttribute('datetime', `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`);
                }
                return;
            }

            // 检查 MMM DD 至 MMM DD 格式的日期范围
            const mmmRangeFormat = textContent.match(/^([A-Za-z]{3}) (\d{1,2}) 至 ([A-Za-z]{3}) (\d{1,2})$/);
            if (mmmRangeFormat) {
                const [ , startMonthAbbr, startDay, endMonthAbbr, endDay ] = mmmRangeFormat;
                const startMonth = monthMapping[startMonthAbbr];
                const endMonth = monthMapping[endMonthAbbr];
                if (startMonth && endMonth) {
                    const formattedDate = `${startMonth}月${parseInt(startDay)}日 至 ${endMonth}月${parseInt(endDay)}日`;
                    timeTag.textContent = formattedDate;
                }
                return;
            }

            // 检查 MM月 DD 至 MM月 DD 格式的日期范围
            const chineseRangeFormat = textContent.match(/^(\d{1,2})月 (\d{1,2}) 至 (\d{1,2})月 (\d{1,2})$/);
            if (chineseRangeFormat) {
                const [ , startMonth, startDay, endMonth, endDay ] = chineseRangeFormat;
                const formattedDate = `${startMonth}月${parseInt(startDay)}日 至 ${endMonth}月${parseInt(endDay)}日`;
                timeTag.textContent = formattedDate;
            }
        });
    }

    // 处理复杂日期格式，替换 "Jul 17" 和 "October 25, 2024" 等格式
    function formatComplexDatesInText() {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;

        while (node = walker.nextNode()) {
            if (node.nodeValue.trim()) {
                node.nodeValue = formatDateToChinese1(node.nodeValue);
            }
        }
    }

    // 格式化日期，将 "Jul 17" 或 "October 25, 2024" 格式替换为中文日期格式
    function formatDateToChinese1(text) {
        // 处理 "Jul 17" 格式，匹配类似 "Jul 17" 的短日期并替换为 "7月17日"
        text = text.replace(/\b([A-Za-z]{3}) (\d{1,2})\b/g, (match, monthAbbr, day) => {
            const month = monthMapping[monthAbbr];
            return month ? `${month}月${parseInt(day)}日` : match;
        });

        // 处理 "October 25, 2024" 格式，匹配类似 "October 25, 2024" 的完整日期并替换为 "2024年10月25日"
        text = text.replace(/\b([A-Za-z]{3,}) (\d{1,2}), (\d{4})\b/g, (match, monthName, day, year) => {
            const month = monthMapping[monthName.slice(0, 3)];
            return month ? `${year}年${month}月${parseInt(day)}日` : match;
        });

        return text;
    }

    // 处理特定元素中的文本
    function replaceSpecificText() {
        // 查找包含特定文本的 <p> 元素
        document.querySelectorAll('p.no-info').forEach(element => {
            if (element.innerHTML.includes('next to it.')) {
                // 替换文本内容
                element.innerHTML = element.innerHTML.replace('next to it.', '');
            }
        });
    }
})();