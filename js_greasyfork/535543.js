// ==UserScript==
// @name         替换 Linux.do 文本内容
// @namespace    http://tampermonkey.net/
// @version      0.4 // 版本号更新
// @description  将 https://linux.do/ 上的所有文本替换为“牛逼”。链接将保持不变。
// @author       你
// @match        https://linux.do/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535543/%E6%9B%BF%E6%8D%A2%20Linuxdo%20%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/535543/%E6%9B%BF%E6%8D%A2%20Linuxdo%20%E6%96%87%E6%9C%AC%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // const newLinkUrl = 'https://linux.do/t/topic/511371'; // 链接替换已移除
    const newTextContent = '牛逼';

    // 替换节点内的文本内容
    function replaceTextInNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            // 只替换包含可见字符的文本节点
            // 避免替换掉 <script> 或 <style> 标签内部的纯文本
            if (node.parentNode && node.parentNode.tagName &&
                node.parentNode.tagName.toLowerCase() !== 'script' &&
                node.parentNode.tagName.toLowerCase() !== 'style' &&
                node.textContent.trim().length > 0) {
                node.textContent = newTextContent;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // 不处理脚本和样式标签，以及它们的子节点
            if (node.tagName.toLowerCase() === 'script' || node.tagName.toLowerCase() === 'style') {
                return;
            }
            // 遍历所有子节点
            for (let i = 0; i < node.childNodes.length; i++) {
                replaceTextInNode(node.childNodes[i]);
            }
        }
    }

    // 替换链接的函数已移除
    // function replaceNavigationalLinks() { ... }

    // 执行初始替换
    function performReplacements() {
        replaceTextInNode(document.body);
        // replaceNavigationalLinks(); // 调用已移除
    }

    // 初次执行
    performReplacements();

    // 使用 MutationObserver 来处理动态加载的内容
    const observer = new MutationObserver(function(mutationsList, observer) {
        let needsReProcessing = false;
        for (const mutation of mutationsList) {
            // 如果有新的子节点被添加到DOM中，可能包含新的文本，标记需要重新处理
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                needsReProcessing = true;
                break;
            }
            // 由于不再修改链接，不再需要针对 href 属性变化的特定检查
        }

        if (needsReProcessing) {
            // console.log('Dynamic content change detected, re-applying text modifications.');
            performReplacements(); // 现在只执行文本替换
        }
    });

    // 配置观察选项:
    // - childList: 监控目标节点（及其子树中节点）的直接子节点的添加或删除。
    // - subtree:   监控目标节点及其所有后代节点的变动。
    // 这对于检测动态加载的、可能包含新文本内容的元素是重要的。
    const observerConfig = {
        childList: true,
        subtree: true
        // attributes: false, // 不再特别关注属性变化，除非文本通过属性动态设置且不创建新文本节点
    };

    // 传入目标节点 (document.body) 和观察选项
    observer.observe(document.body, observerConfig);

    // (可选) 你可以在脚本卸载时停止观察
    // window.addEventListener('unload', function() {
    //     observer.disconnect();
    // });

})();
