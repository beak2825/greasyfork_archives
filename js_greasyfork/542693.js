// ==UserScript==
// @name         洛谷历史记录搜索优化 - 查看自己的代码
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  在洛谷特定页面添加按钮，点击后自动填充输入框并重定向到新的URL。
// @author       OneMan
// @match        *://www.luogu.com.cn/record/list*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542693/%E6%B4%9B%E8%B0%B7%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96%20-%20%E6%9F%A5%E7%9C%8B%E8%87%AA%E5%B7%B1%E7%9A%84%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/542693/%E6%B4%9B%E8%B0%B7%E5%8E%86%E5%8F%B2%E8%AE%B0%E5%BD%95%E6%90%9C%E7%B4%A2%E4%BC%98%E5%8C%96%20-%20%E6%9F%A5%E7%9C%8B%E8%87%AA%E5%B7%B1%E7%9A%84%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮并设置样式
    const button = document.createElement('button');
    button.textContent = '查看我的提交';
    button.setAttribute('data-v-7ade990c', '');
    button.setAttribute('data-v-0aa18cf0', '');
    button.setAttribute('type', 'button');
    button.className = 'lfe-form-sz-small';
    button.setAttribute('data-v-d58eab22', '');
    button.style.borderColor = 'rgb(52, 152, 219)';
    button.style.backgroundColor = 'rgb(52, 152, 219)';
    button.setAttribute('data-darkreader-inline-border-top', '#1a6394');
    button.setAttribute('data-darkreader-inline-border-right', '#1a6394');
    button.setAttribute('data-darkreader-inline-border-bottom', '#1a6394');
    button.setAttribute('data-darkreader-inline-border-left', '#1a6394');
    button.setAttribute('data-darkreader-inline-bgcolor', '#1d6fa5');

    // 获取指定元素
    const targetElement = document.querySelector("#app > div.main-container > main > div > section > div > section:nth-child(1) > div > div");
    if (targetElement) {
        // 将按钮添加到指定元素后面
        targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    } else {
        console.error('Target element not found');
    }

    // 为按钮添加点击事件
    button.addEventListener('click', function() {
        // 获取当前页面的URL
        const currentUrl = window.location.href;

        // 使用document.querySelector来获取元素
        var imgElement = document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.narrow > div.header > div.user-nav > nav > span > span > a > img");

        // 检查元素是否存在
        if (imgElement) {
            // 使用getAttribute方法获取alt属性的值
            var altText = imgElement.getAttribute('alt');
            console.log(altText); // 打印出alt属性的值
        } else {
            console.log('Element not found');
        }

        // 添加参数到URL
        const newUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + "user=" + altText;

        // 在当前页面访问新的URL
        window.location.href = newUrl;
    });
})();