// ==UserScript==
// @name         配置网页具体中文转换为英文
// @namespace    https://github.com/Whiskey-Liu
// @version      0.2
// @description  Replace Chinese text with English text on any website
// @author       Your Name
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/497818/%E9%85%8D%E7%BD%AE%E7%BD%91%E9%A1%B5%E5%85%B7%E4%BD%93%E4%B8%AD%E6%96%87%E8%BD%AC%E6%8D%A2%E4%B8%BA%E8%8B%B1%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/497818/%E9%85%8D%E7%BD%AE%E7%BD%91%E9%A1%B5%E5%85%B7%E4%BD%93%E4%B8%AD%E6%96%87%E8%BD%AC%E6%8D%A2%E4%B8%BA%E8%8B%B1%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换文本映射
    const translationMap = {
        '你好': 'Hello',
        '世界': 'World',
        '料号': 'model',
        // 添加更多的替换项
    };

    // 替换函数
    function replaceText(node) {
        let text = node.nodeValue;
        for (let [chinese, english] of Object.entries(translationMap)) {
            let regex = new RegExp(chinese, 'g');
            text = text.replace(regex, english);
        }
        node.nodeValue = text;
    }

    // 遍历所有文本节点
    function walk(node) {
        let child, next;

        switch (node.nodeType) {
            case 1:  // Element
            case 9:  // Document
            case 11: // Document fragment
                child = node.firstChild;
                while (child) {
                    next = child.nextSibling;
                    walk(child);
                    child = next;
                }
                break;

            case 3: // Text node
                replaceText(node);
                break;
        }
    }

    // 初始替换
    walk(document.body);

    // 观察 DOM 变化以处理动态内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            for (let node of mutation.addedNodes) {
                walk(node);
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();
