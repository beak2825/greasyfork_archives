// ==UserScript==
// @name         将军的恩情
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在所有网站中加粗加大关键字体
// @author       yang666
// @match *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544278/%E5%B0%86%E5%86%9B%E7%9A%84%E6%81%A9%E6%83%85.user.js
// @updateURL https://update.greasyfork.org/scripts/544278/%E5%B0%86%E5%86%9B%E7%9A%84%E6%81%A9%E6%83%85.meta.js
// ==/UserScript==

(function () {
    // ======= 配置部分 =======
    // 要加粗加大的关键词
    const vip_names = ["金正恩", "金日成","金正日"];

    const walkDOM = (node) => {
        // 跳过 script、style、textarea、input 等不应修改的标签
        if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(node.tagName)) return;

        // 处理文本节点
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== '') {
            const parent = node.parentNode;
            let text = node.nodeValue;
            let replaced = false;

            // 检查所有关键词
            for (const vip_name of vip_names) {
                const regex = new RegExp(vip_name, 'gi');
                if (regex.test(text)) {
                    text = text.replace(regex, (match) =>
                        `<b><span style="font-size: 1.3em; color: black;">${match}</span></b>`
                    );
                    replaced = true;
                }
            }

            if (replaced) {
                const span = document.createElement('span');
                span.innerHTML = text;
                parent.replaceChild(span, node);
            }
        }
        // 处理元素节点，递归遍历子节点
        else if (node.nodeType === Node.ELEMENT_NODE) {
            // 先复制子节点列表，因为替换操作会修改DOM
            const childNodes = Array.from(node.childNodes);
            for (const child of childNodes) {
                walkDOM(child);
            }
        }
    };

    walkDOM(document.body);
})();
