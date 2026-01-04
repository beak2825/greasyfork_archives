// ==UserScript==
// @name         动态检查访问人数提示（支持动态数值）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  动态获取网页中的 JavaScript 代码，提取 if 条件中的数值，并检查条件是否成立
// @author       scottluo
// @match        http://zp.cpta.com.cn/tyzpwb*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529356/%E5%8A%A8%E6%80%81%E6%A3%80%E6%9F%A5%E8%AE%BF%E9%97%AE%E4%BA%BA%E6%95%B0%E6%8F%90%E7%A4%BA%EF%BC%88%E6%94%AF%E6%8C%81%E5%8A%A8%E6%80%81%E6%95%B0%E5%80%BC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529356/%E5%8A%A8%E6%80%81%E6%A3%80%E6%9F%A5%E8%AE%BF%E9%97%AE%E4%BA%BA%E6%95%B0%E6%8F%90%E7%A4%BA%EF%BC%88%E6%94%AF%E6%8C%81%E5%8A%A8%E6%80%81%E6%95%B0%E5%80%BC%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成
    window.addEventListener('load', function() {
        // 获取页面中的所有 script 标签
        const scripts = document.querySelectorAll('script');

        // 遍历所有 script 标签
        scripts.forEach(script => {
            // 获取 script 标签的内容
            const scriptContent = script.textContent || script.innerText;

            // 使用正则表达式匹配目标 if 条件
            const ifConditionRegex = /if\s*\(\s*(\d+)\s*>=\s*(\d+)\s*\)\s*\{[^}]*\}/g;
            const match = scriptContent.match(ifConditionRegex);

            if (match) {
                // 找到目标代码
                console.log('找到目标 if 条件:', match[0]);

                // 提取条件中的两个数值
                const conditionMatch = match[0].match(/if\s*\(\s*(\d+)\s*>=\s*(\d+)\s*\)/);
                if (conditionMatch && conditionMatch.length === 3) {
                    const leftValue = parseInt(conditionMatch[1], 10); // 提取左侧数值
                    const rightValue = parseInt(conditionMatch[2], 10); // 提取右侧数值

                    console.log('提取的数值:', leftValue, rightValue);

                    // 检查条件是否成立
                    if (leftValue >= rightValue) {
                        alert('当前访问人数过多，请稍后再试！');
                    } else {
                        console.log('条件不成立，无需提示。');
                    }
                } else {
                    console.error('无法提取条件中的数值。');
                }
            }
        });
    });
})();