// ==UserScript==
// @name         小红书聚光高亮-自用
// @namespace    aa
// @version      2025-01-24
// @description  自用
// @author       You
// @match        https://partner.xiaohongshu.com/partner/subAccount-list
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaohongshu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524743/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%81%9A%E5%85%89%E9%AB%98%E4%BA%AE-%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/524743/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E8%81%9A%E5%85%89%E9%AB%98%E4%BA%AE-%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==

(function() {

        // 创建样式标签并添加到文档头部
    const style = document.createElement('style');
    style.textContent = `
       .added-text {
            color: #ff0000; /* 文字颜色为红色 */
            background-color: #f0f0f0; /* 背景颜色为浅灰色 */
            padding: 2px 5px; /* 内边距 */
            margin-left: 5px; /* 左边距 */
            border-radius: 3px; /* 圆角 */
        }
    `;
    document.head.appendChild(style);
        // 定义数值到文本的映射
        const mapping = {
            68: '信息流快消',
            77: '信息流运动户外',
            69: '搜索快消',
            78: '搜索运动户外'
        };

        // 处理单个元素的函数
        function processElement(element) {
            if (element.textContent.includes('仟传-星联联')) {
                // 检查是否已经插入过内容
                const nextSibling = element.nextSibling;
                if (nextSibling && nextSibling.tagName === 'SPAN' && nextSibling.textContent.startsWith(' = ')) {
                    return;
                }

                // 提取文本中的数值
                const match = element.textContent.match(/\d+/);
                if (match) {
                    const number = parseInt(match[0], 10);
                    if (mapping[number]) {
                        // 创建新元素
                        const newElement = document.createElement('span');
                        newElement.className = 'added-text'
                        newElement.textContent = `${mapping[number]}`;
                        // 将新元素插入到目标元素后面
                        element.parentNode.insertBefore(newElement, element.nextSibling);
                    }
                }
            }
        }

        // 处理所有符合条件的元素
        function processAllElements() {
            const targetElements = document.querySelectorAll('.cell.delight-tooltip');
            targetElements.forEach(processElement);
        }

        // 初始处理页面元素
        processAllElements();

        // 创建一个 MutationObserver 实例
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 当有新元素添加时，处理新添加的元素
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList.contains('cell') && node.classList.contains('delight-tooltip')) {
                                processElement(node);
                            } else {
                                // 递归处理子元素
                                const subElements = node.querySelectorAll('.cell.delight-tooltip');
                                subElements.forEach(processElement);
                            }
                        }
                    });
                }
            }
        });

        // 配置观察选项
        const config = { childList: true, subtree: true };

        // 开始观察文档的变化
        observer.observe(document.body, config);
    // Your code here...
})();