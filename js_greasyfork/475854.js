// ==UserScript==
// @name         Easy文档中存在中英文混用的情况
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  替换easy-es官网文档中的中英文混用的标点
// @author       alona789
// @match        https://www.easy-es.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=easy-es.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475854/Easy%E6%96%87%E6%A1%A3%E4%B8%AD%E5%AD%98%E5%9C%A8%E4%B8%AD%E8%8B%B1%E6%96%87%E6%B7%B7%E7%94%A8%E7%9A%84%E6%83%85%E5%86%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/475854/Easy%E6%96%87%E6%A1%A3%E4%B8%AD%E5%AD%98%E5%9C%A8%E4%B8%AD%E8%8B%B1%E6%96%87%E6%B7%B7%E7%94%A8%E7%9A%84%E6%83%85%E5%86%B5.meta.js
// ==/UserScript==

(function() {
    // 获取包含已渲染 HTML 的元素
    const container = document.getElementsByTagName('body')[0];

    // 遍历所有文本节点，并替换其中的逗号
    function replaceCommas(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.textContent = node.textContent.replace(/,/g, '，').replace(/(?<=\p{Script=Han})\.(?=\p{Script=Han})/g, '。');
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceCommas(node.childNodes[i]);
            }
        }
    }

    // 替换逗号
    replaceCommas(container);
})();