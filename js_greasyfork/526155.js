// ==UserScript==
// @name         Text Link Converter
// @namespace    your-namespace
// @version      1.0
// @description  将文本格式的URL转换为可点击的链接
// @author       DeepSeek & SodaCode
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526155/Text%20Link%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/526155/Text%20Link%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置参数
    const config = {
        linkAttributes: {
            target: "_blank",          // 在新标签页打开
            rel: "noopener noreferrer" // 安全属性
        },
        ignoredTags: ["SCRIPT", "STYLE", "TEXTAREA", "PRE", "CODE", "A"], // 要忽略的标签
        urlRegExp: /\b(https?|ftp):\/\/[^\s/$.?#].[^\s]*\b/gi              // URL匹配正则
    };

    // 创建可见性检查函数
    const isVisible = (element) => {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' &&
               style.visibility !== 'hidden' &&
               element.offsetParent !== null;
    };

    // 链接转换函数
    const convertTextToLinks = (textNode) => {
        const parent = textNode.parentNode;
        if (!parent || config.ignoredTags.includes(parent.nodeName) || !isVisible(parent)) {
            return;
        }

        const tempDiv = document.createElement('div');
        const text = textNode.nodeValue;
        let lastIndex = 0;
        let match;

        while ((match = config.urlRegExp.exec(text)) !== null) {
            // 处理匹配前的文本
            if (match.index > lastIndex) {
                tempDiv.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            // 创建链接
            const link = document.createElement('a');
            link.href = match[0];
            link.textContent = match[0];

            // 添加额外属性
            Object.entries(config.linkAttributes).forEach(([attr, value]) => {
                link.setAttribute(attr, value);
            });

            tempDiv.appendChild(link);
            lastIndex = config.urlRegExp.lastIndex;
        }

        // 处理剩余文本
        if (lastIndex < text.length) {
            tempDiv.appendChild(document.createTextNode(text.slice(lastIndex)));
        }

        // 替换原始文本节点
        parent.replaceChild(tempDiv, textNode);
    };

    // 递归遍历DOM节点
    const walkNodes = (node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            if (config.urlRegExp.test(node.nodeValue)) {
                config.urlRegExp.lastIndex = 0; // 重置正则状态
                convertTextToLinks(node);
            }
        } else if (!config.ignoredTags.includes(node.nodeName) && node.hasChildNodes()) {
            Array.from(node.childNodes).forEach(walkNodes);
        }
    };

    // 开始处理文档主体
    walkNodes(document.body);

    // 观察DOM变化处理动态内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    walkNodes(node);
                }
            });
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();