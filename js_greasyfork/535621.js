// ==UserScript==
// @name         Linux.do 全员喵化
// @namespace    https://100713.xyz
// @version      0.2
// @description  将 Linux.do 网站上所有用户发言的所有文字内容替换为“喵”。
// @author       User & AI
// @match        https://linux.do/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535621/Linuxdo%20%E5%85%A8%E5%91%98%E5%96%B5%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535621/Linuxdo%20%E5%85%A8%E5%91%98%E5%96%B5%E5%8C%96.meta.js
// ==/UserScript==

(function () {
    'use_strict';

    // 用于标记已处理元素的自定义HTML属性名
    const PROCESSED_ATTRIBUTE = 'data-all-text-meowed-script';

    /**
     * 递归遍历节点，将文本节点中的非空白字符替换为“喵”。
     * @param {Node} node - 当前遍历到的节点。
     */
    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 只处理包含非空白字符的文本节点
            if (node.nodeValue && /\S/.test(node.nodeValue)) {
                node.nodeValue = node.nodeValue.replace(/\S/g, '喵');
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 不处理 <script> 和 <style> 标签内部的内容
            // 其他如 <a>, <code>, <pre> 内的文本也会被递归处理
            if (node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
                // 遍历子节点时使用 Array.from 创建副本，以防万一childNodes列表在遍历过程中被修改
                Array.from(node.childNodes).forEach(replaceTextInNode);
            }
        }
    }

    /**
     * 扫描页面内容并替换文本。
     * 它会查找所有帖子的 .cooked 部分中尚未被此脚本处理过的内容。
     */
    function scanAndReplace() {
        // 选择所有文章中尚未处理的 .cooked 元素
        const unprocessedCookedElements = document.querySelectorAll(
            `article[data-user-id] .cooked:not([${PROCESSED_ATTRIBUTE}])`
        );

        unprocessedCookedElements.forEach(cookedElement => {
            replaceTextInNode(cookedElement); // 对该元素及其子孙节点执行文本替换
            cookedElement.setAttribute(PROCESSED_ATTRIBUTE, 'true'); // 标记为已处理
        });
    }

    // 页面加载完成后执行初次扫描
    // 如果脚本在 document-idle 之后运行，DOM通常已经准备好
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scanAndReplace);
    } else {
        scanAndReplace();
    }

    // 使用 MutationObserver 监听动态加载的内容 (例如：无限滚动加载的帖子)
    const observer = new MutationObserver((mutationsList) => {
        let needsRescan = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (const addedNode of mutation.addedNodes) {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        // 情况1: 添加的节点本身是一篇文章 (article)
                        if (addedNode.matches && addedNode.matches('article[data-user-id]')) {
                            if (addedNode.querySelector(`.cooked:not([${PROCESSED_ATTRIBUTE}])`)) {
                                needsRescan = true;
                                break;
                            }
                        }
                        // 情况2: 添加的节点不是文章，但可能包含需要处理的文章
                        // (例如，一个包装了多个文章的div被添加到页面)
                        else if (addedNode.querySelector && addedNode.querySelector(`article[data-user-id] .cooked:not([${PROCESSED_ATTRIBUTE}])`)) {
                            needsRescan = true;
                            break;
                        }
                    }
                }
            }
            if (needsRescan) {
                break; // 如果已确定需要重新扫描，则无需检查其余的 mutations
            }
        }

        if (needsRescan) {
            // console.log("全员喵化脚本: 检测到新内容，重新扫描。");
            scanAndReplace();
        }
    });

    // 开始监听 document.body 的子节点变化 (包括整个子树)
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();
