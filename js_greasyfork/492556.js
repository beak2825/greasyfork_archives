// ==UserScript==
// @name               跳银河点击任务
// @namespace          crisanglemass
// @version            0.1.1
// @description        跳银河
// @author             crisanglemass
// @include            https://app.galxe.com/*
// @grant              GM_xmlhttpRequest
// @run-at             document-start
// @license            MIT License
// @compatible         chrome 测试通过
// @compatible         firefox 测试通过
// @downloadURL https://update.greasyfork.org/scripts/492556/%E8%B7%B3%E9%93%B6%E6%B2%B3%E7%82%B9%E5%87%BB%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/492556/%E8%B7%B3%E9%93%B6%E6%B2%B3%E7%82%B9%E5%87%BB%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查是否已登录的函数
    const isLoggedIn = () => {
        // 使用 XPath 选择特定元素
        const xpathExpression = '//*[@id="ga-data-campaign-model-2"]/div[2]/div[2]/div/div[1]/div[2]/div/div/div';
        const element = document.evaluate(xpathExpression, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        // 如果找到了特定元素，则检查其文本内容
        if (element) {
            const textContent = element.textContent.trim();
            // 如果文本内容为 "Log in"，则返回 true，表示用户未登录
            return textContent === "Log in";
        } else {
            // 如果未找到特定元素，则返回 false，表示用户已登录
            return true;
        }
    };

    // 定义轮询间隔（毫秒）
    const interval = 1000; // 1秒

    // 开始轮询
    const timer = setInterval(() => {
        // 如果用户已登录，则执行相应操作
        if (!isLoggedIn()) {
            clearInterval(timer); // 停止轮询

            // 找到需要点击的按钮元素
            const elementsToClick = document.querySelectorAll('.d-flex.height-100.width-100.click-area');

            const clickElement = (element) => {
                const event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: element.ownerDocument.defaultView // 使用元素的所属文档的默认视图
                });
                element.dispatchEvent(event);
            };

            elementsToClick.forEach(clickElement);
        }
    }, interval);
})();

