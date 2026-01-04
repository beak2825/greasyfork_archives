// ==UserScript==
// @name         修改维吾尔文字体脚本
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  根据Unicode编码位置，设置独立自定义字体显示
// @author       HiYALiM
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505895/%E4%BF%AE%E6%94%B9%E7%BB%B4%E5%90%BE%E5%B0%94%E6%96%87%E5%AD%97%E4%BD%93%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/505895/%E4%BF%AE%E6%94%B9%E7%BB%B4%E5%90%BE%E5%B0%94%E6%96%87%E5%AD%97%E4%BD%93%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义需要应用特定字体的Unicode范围
    const fontRanges = [
        {
            start: 0x0626, // Unicode起始点
            end: 0x06d5, // Unicode结束点
            fontFamily: 'UKIJ Tor' // 应用的维吾尔文字体名称
        }
        // 可以在这里添加更多的Unicode范围和对应字体...
    ];

    // 定义连接字符集合，这些字符可能出现在需要特殊字体的文本中间
    const connectingChars = new Set([' ', '،', '.', '؟', '»', '«', ']', '[', ':', '؛', '>', '<','-']);

    // 检查给定的Unicode字符编码是否在定义的范围内
    function isInRange(charCode) {
        for (let range of fontRanges) {
            if (charCode >= range.start && charCode <= range.end) {
                return range.fontFamily; // 返回匹配的字体名称
            }
        }
        return null; // 如果不在任何定义的范围内，返回null
    }

    // 检查字符是否为连接字符
    function isConnectingChar(char) {
        return connectingChars.has(char);
    }

    // 处理单个文本节点
    function processTextNode(node) {
        let text = node.nodeValue;
        let segments = []; // 用于存储分割后的文本段落
        let currentSegment = { text: '', requiresCustomFont: false, fontFamily: null };

        // 遍历文本中的每个字符
        for (let i = 0; i < text.length; i++) {
            let charCode = text.charCodeAt(i);
            let charFontFamily = isInRange(charCode);

            // 如果字符需要特殊字体或是连接字符（且前一个字符需要特殊字体）
            if (charFontFamily || (isConnectingChar(text[i]) && currentSegment.requiresCustomFont)) {
                if (!currentSegment.requiresCustomFont || (charFontFamily && currentSegment.fontFamily !== charFontFamily)) {
                    // 开始新的文本段落
                    if (currentSegment.text) segments.push(currentSegment);
                    currentSegment = {
                        text: text[i],
                        requiresCustomFont: true,
                        fontFamily: charFontFamily || currentSegment.fontFamily
                    };
                } else {
                    // 继续当前文本段落
                    currentSegment.text += text[i];
                }
            } else {
                // 字符不需要特殊字体
                if (currentSegment.requiresCustomFont) {
                    // 结束当前需要特殊字体的段落，开始新的普通文本段落
                    segments.push(currentSegment);
                    currentSegment = { text: text[i], requiresCustomFont: false, fontFamily: null };
                } else {
                    // 继续当前普通文本段落
                    currentSegment.text += text[i];
                }
            }
        }

        // 添加最后一个文本段落
        if (currentSegment.text) segments.push(currentSegment);

        // 处理分割后的文本段落
        if (segments.length === 1 && segments[0].requiresCustomFont) {
            // 如果只有一个段落且需要特殊字体
            let parent = node.parentNode;
            if (parent.childNodes.length === 1 && parent.nodeName !== 'BODY') {
                // 如果父节点只有这一个子节点，直接设置父节点的字体
                parent.style.fontFamily = segments[0].fontFamily;
            } else {
                // 创建新的span元素包裹文本
                let span = document.createElement('span');
                span.textContent = text;
                span.style.fontFamily = segments[0].fontFamily;
                parent.replaceChild(span, node);
            }
        } else if (segments.length > 1) {
            // 如果有多个文本段落
            let fragment = document.createDocumentFragment();
            for (let segment of segments) {
                if (segment.requiresCustomFont) {
                    // 需要特殊字体的段落创建span元素
                    let span = document.createElement('span');
                    span.textContent = segment.text;
                    span.style.fontFamily = segment.fontFamily;
                    fragment.appendChild(span);
                } else {
                    // 不需要特殊字体的段落直接添加文本节点
                    fragment.appendChild(document.createTextNode(segment.text));
                }
            }
            // 用新创建的片段替换原始节点
            node.parentNode.replaceChild(fragment, node);
        }
    }

    // 递归处理DOM节点及其子节点
    function processNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            processTextNode(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            let childNodes = Array.from(node.childNodes);
            for (let childNode of childNodes) {
                processNode(childNode);
            }
        }
    }

    // 观察动态添加的DOM节点
    function observeDynamicNodes() {
        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    processNode(node);
                }
            }
        });

        // 观察body元素的子树变化
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 页面加载完成后执行主函数
    window.addEventListener('load', function() {
        processNode(document.body); // 处理初始DOM
        observeDynamicNodes(); // 开始观察动态变化
    });

})();