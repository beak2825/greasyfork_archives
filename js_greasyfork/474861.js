// ==UserScript==
// @name         kf369卡片直达
// @namespace    kf369.cn
// @version      0.1.1
// @description  kf369点击卡片直达网站
// @author       lei
// @license      MIT
// @match        https://kf369.cn/
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/474861/kf369%E5%8D%A1%E7%89%87%E7%9B%B4%E8%BE%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474861/kf369%E5%8D%A1%E7%89%87%E7%9B%B4%E8%BE%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取所有带有class="card"的超链接
    const cardLinks = document.querySelectorAll('a.card[data-url]');

    // 遍历所有匹配的超链接
    cardLinks.forEach(link => {
        // 获取data-url的值
        const dataUrl = link.getAttribute('data-url');

        // 设置href属性为data-url的值
        link.setAttribute('href', dataUrl);
    });
    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutationsList => {
        // 遍历每个发生变化的节点
        mutationsList.forEach(mutation => {
            // 检查是否是class="mt-4"的<div>元素内容发生了变化
            if (mutation.target.classList.contains('mt-4')) {
                // 获取所有class="card"且带有data-url属性的超链接
                const cardLinks = mutation.target.querySelectorAll('a.card[data-url]');

                // 遍历并替换超链接的href属性为data-url的值
                cardLinks.forEach(link => {
                    const dataUrl = link.getAttribute('data-url');
                    link.setAttribute('href', dataUrl);
                });
            }
        });
    });

    // 监听根节点的子节点变化，可根据需要修改根节点选择器
    const root = document.body;

    // 配置观察选项（子节点变化和子节点属性变化）
    const config = { childList: true, subtree: true };

    // 开始观察
    observer.observe(root, config);

})();
