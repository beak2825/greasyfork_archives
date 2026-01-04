// ==UserScript==
// @name         隐藏知乎问题标题
// @namespace    https://example.com/
// @version      0.1
// @description  隐藏知乎页面中的问题标题
// @author       lyx
// @match        https://www.zhihu.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526761/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/526761/%E9%9A%90%E8%97%8F%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(async () => {
    // 目标 DOM 路径
    const targetXPath = '/html/body/div[1]/div/div[2]/header/div[2]/div/div/div[1]/h1';

    // 使用 XPath 查找目标元素
    const hideElementByXPath = (xpath) => {
        const targetElement = document.evaluate(
            xpath,
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;

        if (targetElement) {
            targetElement.style.display = 'none';
        }
    };

    // 初始化时隐藏元素
    hideElementByXPath(targetXPath);

    // 监听 DOM 变化，实时隐藏新生成的标题
    const observer = new MutationObserver((mutationsList) => {
        mutationsList.forEach((mutation) => {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                hideElementByXPath(targetXPath);
            }
        });
    });

    // 配置 observer，监听整个文档的 DOM 变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();