// ==UserScript==
// @name         监听输入框
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  定时执行脚本以确保代码一直运行
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        GM_setClipboard
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/476112/%E7%9B%91%E5%90%AC%E8%BE%93%E5%85%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/476112/%E7%9B%91%E5%90%AC%E8%BE%93%E5%85%A5%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主要功能函数，用于监测输入框内容，复制到剪切板，和记录操作
    function main() {
        // 获取 "驳回话术" 元素
        const rejectTextElement = document.evaluate(
            'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[3]/DIV[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        // 获取输入框元素
        const inputBoxElement = document.evaluate(
            'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[3]/DIV[2]/DIV[1]/DIV[1]/TEXTAREA[1]',
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (rejectTextElement && inputBoxElement) {
            // 添加点击事件监听器
            rejectTextElement.addEventListener('click', function() {
                // 监测输入框内容
                const inputText = inputBoxElement.value;

                // 复制到剪切板
                GM_setClipboard(inputText);

                // 记录操作到浏览器调试日志
                GM_log(`复制内容到剪切板: ${inputText}`);
            });
        }
    }

    // 每隔一定时间执行 main() 函数
    setInterval(function() {
        // 记录执行的时间，用于调试
        const executionTime = new Date();
        GM_log(`执行 main() 函数 - 时间: ${executionTime}`);
        main();
    }, 6000); // 每隔3秒执行一次 main() 函数

    // 首次执行脚本
    main();
})();
