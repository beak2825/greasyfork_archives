// ==UserScript==
// @name         Sun of North America
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  The Only, the Holy, President Donald J. Trump, the Sun of North America!
// @author       TechCiel
// @license      WTFPL
// @match        https://www.whitehouse.gov/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=whitehouse.gov
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529461/Sun%20of%20North%20America.user.js
// @updateURL https://update.greasyfork.org/scripts/529461/Sun%20of%20North%20America.meta.js
// ==/UserScript==

(()=>{
    'use strict';
    const regex = /((?:President )?(?:Donald )?(?:J. )?(?<!Melania )(?<!Ivanka )(?<!Ivana )(?<!Barron )(?<!Tiffany )(?<!Eric )(?<!Mrs\. )Trump)/gi;

    function update() {
        console.log('Be careful, the sun\'s rising!');
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
            if (textNode.parentNode.className == 'sun-of-north-america') return;

            // 分割文本为多个部分
            const parts = content.split(regex);
            const fragment = document.createDocumentFragment();

            parts.forEach(part => {
                if (part === '') return; // 忽略空字符串
                if (part.match(regex)) {
                    const span = document.createElement('span');
                    span.textContent = part;
                    span.className = 'sun-of-north-america';
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
