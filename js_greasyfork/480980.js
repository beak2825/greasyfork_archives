// ==UserScript==
// @name         同时复制指定xpath页面内容和当前页面URL
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to copy specified XPath text and current URL to clipboard
// @author       You
// @match        *://*/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480980/%E5%90%8C%E6%97%B6%E5%A4%8D%E5%88%B6%E6%8C%87%E5%AE%9Axpath%E9%A1%B5%E9%9D%A2%E5%86%85%E5%AE%B9%E5%92%8C%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2URL.user.js
// @updateURL https://update.greasyfork.org/scripts/480980/%E5%90%8C%E6%97%B6%E5%A4%8D%E5%88%B6%E6%8C%87%E5%AE%9Axpath%E9%A1%B5%E9%9D%A2%E5%86%85%E5%AE%B9%E5%92%8C%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在这里替换成你要复制的XPath表达式
    const xpathExpression = '//*[@id="summary-val"]'; // 例如，这里是一个示例XPath表达式

    // 创建按钮和提示元素
    const addButtonAndMessage = () => {
        const button = document.createElement('button');
        button.innerHTML = '复制bug标题和URL';
        button.style.position = 'fixed';
        button.style.top = '20px';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        button.addEventListener('click', copyTextAndURL);
        button.style.padding = '15px'; // 设置按钮内边距
        button.style.borderRadius = '5px'; // 设置按钮圆角

        document.body.appendChild(button);

        const message = document.createElement('div');
        message.style.position = 'fixed';
        message.style.top = '80px';
        message.style.right = '10px';
        message.style.padding = '10px';
        message.style.backgroundColor = '#4CAF50'; // 绿色背景，可以根据需要调整颜色
        message.style.color = 'white';
        message.style.zIndex = '9998';
        message.style.display = 'none';
        document.body.appendChild(message);

        return message;
    };

    // 复制文本和URL到剪切板
    const copyTextAndURL = () => {
        const xpathResult = document.evaluate(xpathExpression, document, null, XPathResult.ANY_TYPE, null);
        const textNode = xpathResult.iterateNext();
        const textContent = textNode ? textNode.textContent : 'XPath text not found';
        const currentURL = window.location.href;

        // 复制到剪切板
        const copyText = `${currentURL}\n${textContent}`;
        GM_setClipboard(copyText, 'text');

        // 显示成功消息
        showMessage('bug标题和URL已复制成功');
    };

    // 显示消息
    const showMessage = (text) => {
        const message = addButtonAndMessage();
        message.textContent = text;
        message.style.display = 'block';

        // 3秒后隐藏消息
        setTimeout(() => {
            message.style.display = 'none';
        }, 3000);
    };

    // 等待页面加载完成后添加按钮和提示元素
    window.addEventListener('load', addButtonAndMessage);
})();