// ==UserScript==
// @name         修改选框高度
// @namespace    http://tampermonkey.net/
// @version      2024-01-20
// @description  修改随手记记一笔中的下拉选框高度
// @author       Jayxuz
// @match        https://www.sui.com/tally/new.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sui.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485318/%E4%BF%AE%E6%94%B9%E9%80%89%E6%A1%86%E9%AB%98%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/485318/%E4%BF%AE%E6%94%B9%E9%80%89%E6%A1%86%E9%AB%98%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建观察者对象
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // 检查新增的节点
                mutation.addedNodes.forEach(node => {
                    // 检查子节点是否包含下拉选框
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const matchingElements = node.querySelectorAll('ul[id^="ul_list-"]');
                        matchingElements.forEach(el => updateElementHeight(el));
                    }
                });
            }
        });
    });

    // 更新元素高度为500px, 可按需修改
    function updateElementHeight(element) {
            element.style.height = '500px';
    }
    // 配置观察选项:
    const config = { childList: true, subtree: true };

    // 开始观察文档
    observer.observe(document, config);
})();