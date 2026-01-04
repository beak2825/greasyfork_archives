// ==UserScript==
// @name         双击复制知乎/wiki中的数学公式tex
// @homepageURL  https://github.com/Lysanleo/little-piece-crisps
// @namespace    http://tampermonkey.net/
// @version      0.2
// @license      GPLv3
// @description  双击latex公式将其复制到剪切板
// @author       Lysanleo, Epool
// @match        *://*.wikipedia.org/*
// @match        *://*.wikipedia.org/*
// @match        *://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488755/%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E7%9F%A5%E4%B9%8Ewiki%E4%B8%AD%E7%9A%84%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8Ftex.user.js
// @updateURL https://update.greasyfork.org/scripts/488755/%E5%8F%8C%E5%87%BB%E5%A4%8D%E5%88%B6%E7%9F%A5%E4%B9%8Ewiki%E4%B8%AD%E7%9A%84%E6%95%B0%E5%AD%A6%E5%85%AC%E5%BC%8Ftex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getAttributeName(url) {
        if (url.includes('wikipedia.org')) {
            return 'alt';
        } else if (url.includes('zhihu.com')) {
            return 'data-tex';
        }
        // Add more conditions for other websites here
    }

    // to latex
    function formatToLaTeX(input) {
        // 检查字符串末尾是否有空格或反斜杠
        while (input.endsWith(' ') || input.endsWith('\\')) {
            // 去除最后一个字符
            input = input.slice(0, -1);
        }
        // 为处理过的字符串添加美元符号
        return '$' + input + '$';
    }

    function addDoubleClickHandler() {
        let attribute = getAttributeName(window.location.href);

        if (!attribute) return;

        document.querySelectorAll(`[${attribute}]`).forEach(element => {
            element.ondblclick = function() {
                // 确保在用户手势中调用
                try {
                    // 获取属性值
                    const attributeValue = element.getAttribute(attribute);
                    // 检查属性值是否为空
                    if (attributeValue !== null) {
                        // 尝试写入剪贴板
                        console.log(formatToLaTeX(attributeValue))
                        navigator.clipboard.writeText(attributeValue).then(() => {
                            console.log('Text copied to clipboard.');
                        }).catch(err => {
                            console.error('Failed to copy text: ', err);
                        });
                    } else {
                        console.error(`The attribute "${attribute}" is null or not present on the element.`);
                    }
                } catch (error) {
                    console.error('An error occurred while trying to copy text: ', error);
                }
            };
        });
        // document.querySelectorAll(`[${attribute}]`).forEach(e => e.ondblclick = () => navigator.clipboard.writeText(e.getAttribute(attribute)));
    }

    // Add event listener for when the page is loaded or changed
    document.addEventListener('DOMContentLoaded', addDoubleClickHandler);
    new MutationObserver(addDoubleClickHandler).observe(document.documentElement, {childList: true, subtree: true});
})();