// ==UserScript==
// @name        教学评价_非常满意
// @namespace   Violentmonkey Scripts
// @match       http://jwglxt.webvpn.zufedfc.edu.cn/jwglxt/xspjgl/kcgcpj_cxKcgcpjxxIndex.html
// @grant       none
// @version     1.0
// @author      kalicyh
// @license     MIT
// @description 2023/11/14 10:30:41
// @downloadURL https://update.greasyfork.org/scripts/479797/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7_%E9%9D%9E%E5%B8%B8%E6%BB%A1%E6%84%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/479797/%E6%95%99%E5%AD%A6%E8%AF%84%E4%BB%B7_%E9%9D%9E%E5%B8%B8%E6%BB%A1%E6%84%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮元素
    const button = document.createElement('button');
    button.textContent = '点击所有 "非常满意"';
    button.style.position = 'fixed';
    button.style.top = '95px';
    button.style.right = '60px';
    document.body.appendChild(button);

    // 添加点击事件处理程序
    button.addEventListener('click', function() {
        // 查找包含"非常满意"文本的元素并点击它们
        const elementsWithText = document.querySelectorAll('.block p');
        for (const element of elementsWithText) {
            if (element.textContent === '非常满意') {
                element.click();
            }
        }
    });
})();
