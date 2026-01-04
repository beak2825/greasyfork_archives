// ==UserScript==
// @name         人民の太阳
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Our Greatest Leader Chairman Xi Jinping!
// @author       TechCiel
// @license      WTFPL
// @match        *.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gov.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529566/%E4%BA%BA%E6%B0%91%E3%81%AE%E5%A4%AA%E9%98%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/529566/%E4%BA%BA%E6%B0%91%E3%81%AE%E5%A4%AA%E9%98%B3.meta.js
// ==/UserScript==

(()=>{
    'use strict';
    const regex = /(习近平|习主席|国家主席习近平|习总书记|主席习近平|总书记习近平|Xi Jinping|President Xi)/gi;

    function update() {
        console.log('The Great Helmsman is watching!');
        // 创建TreeWalker遍历所有符合条件的文本节点
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 排除不需要处理的父元素标签
                    const parentTag = node.parentNode.tagName.toLowerCase();
                    const excludeTags = ['script', 'style', 'noscript', 'textarea', 'option', 'meta', 'title'];
                    return excludeTags.includes(parentTag) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );

        // 收集所有文本节点
        const textNodes = [];
        let node;
        while (node = walker.nextNode()) textNodes.push(node);

        // 处理每个文本节点
        textNodes.forEach((textNode) => {
            const content = textNode.textContent;
            if (content.search(regex) === -1) return;
            if (textNode.parentNode.className == 'sun-of-north-america') return; // Keep the class name for styling consistency, or change it if you prefer

            // 分割文本为多个部分
            const parts = content.split(regex);
            const fragment = document.createDocumentFragment();

            parts.forEach(part => {
                if (part === '') return; // 忽略空字符串
                if (part.match(regex)) {
                    const span = document.createElement('span');
                    span.textContent = part;
                    span.className = 'sun-of-north-america'; // Keep the same class name for styling
                    fragment.appendChild(span);
                } else {
                    fragment.appendChild(document.createTextNode(part));
                }
            });

            // 替换原始文本节点
            textNode.parentNode.replaceChild(fragment, textNode);
        })
    }

    update();

    //setInterval(update, 2000);
    window.navigation && window.navigation.addEventListener('navigate', update);
    window.addEventListener('click', update);

    // 添加样式
    let styleNode = document.createElement("style");
    styleNode.textContent = 'span.sun-of-north-america { font-size:1.5em; font-weight:bolder; cursor: none; user-select: none }';
    document.head.appendChild(styleNode);
})()
