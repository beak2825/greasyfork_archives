// ==UserScript==
// @name         在浏览器地址栏直接向 ChatGLM 提问
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  ChatGLM automatically generates questions based on URL search.
// @author       Your Name
// @match        https://chatglm.cn/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521261/%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E5%9C%B0%E5%9D%80%E6%A0%8F%E7%9B%B4%E6%8E%A5%E5%90%91%20ChatGLM%20%E6%8F%90%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/521261/%E5%9C%A8%E6%B5%8F%E8%A7%88%E5%99%A8%E5%9C%B0%E5%9D%80%E6%A0%8F%E7%9B%B4%E6%8E%A5%E5%90%91%20ChatGLM%20%E6%8F%90%E9%97%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (document.location.origin === 'https://chatglm.cn' && document.location.pathname === '/main/alltoolsdetail') {
        const url = new URL(document.location.href)
        const keywords = url.searchParams.get("wd")

        if (keywords) {
            const timer = setInterval(() => {
                const textarea = document.getElementsByTagName("textarea")[0]
                if (!textarea) {
                    return
                }
                {
                    clearInterval(timer)

                    // 调用函数移除名为"wd"的查询参数
                    removeSearchParam('wd');
                }
                textarea.value = keywords
                const event = new Event('input', {
                    bubbles: true,
                    cancelable: true,
                });
                textarea.dispatchEvent(event);
                // 创建一个回车键的事件
                const enterKeyEvent = new KeyboardEvent('keydown', {
                    'keyCode': 13, // 13是回车键的键码
                    'key': 'Enter',
                    'bubbles': true,
                    'cancelable': true
                });

                // 派发事件到textarea元素
                textarea.dispatchEvent(enterKeyEvent);

                // 通常，你还需要触发'keypress'和'keyup'事件，但'keydown'通常是触发实际行为所必需的
                const enterKeyPressEvent = new KeyboardEvent('keypress', {
                    'keyCode': 13,
                    'key': 'Enter',
                    'bubbles': true,
                    'cancelable': true
                });
                textarea.dispatchEvent(enterKeyPressEvent);

                const enterKeyUpEvent = new KeyboardEvent('keyup', {
                    'keyCode': 13,
                    'key': 'Enter',
                    'bubbles': true,
                    'cancelable': true
                });
                textarea.dispatchEvent(enterKeyUpEvent);
            })
        }

    }

    // 函数用于移除URL中的特定查询参数
    function removeSearchParam(paramName) {
        // 获取当前URL的查询字符串部分
        const searchParams = new URLSearchParams(window.location.search);

        // 移除名为paramName的查询参数
        searchParams.delete(paramName);

        // 构造新的URL
        const newUrl = window.location.pathname + (searchParams.toString() ? '?' + searchParams.toString() : '');

        // 使用history.pushState()更新URL，不会重新加载页面
        window.history.pushState({ path: newUrl }, '', newUrl);
    }



})();
