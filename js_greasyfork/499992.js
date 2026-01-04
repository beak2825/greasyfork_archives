// ==UserScript==
// @name         github-search-helper
// @namespace    github.com/leychan
// @version      0.3
// @description  在新标签页打开github搜索,explore和trending结果
// @author       leychan
// @match        https://github.com/trending
// @match        https://github.com/explore
// @match        https://github.com/search*
// @icon         https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png
// @run-at document-end
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/499992/github-search-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/499992/github-search-helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 修改所有 <a> 标签的 target 属性
    function setTargetBlank() {
        const allATags = document.getElementsByTagName('a');
        for (let i = 0; i < allATags.length; i++) {
            allATags[i].setAttribute('target', '_blank');
        }
    }

    // 初始化 MutationObserver
    const observer = new MutationObserver((mutationsList, observer) => {
        // 检查是否有新的节点被添加到 DOM 中
        mutationsList.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 如果新增的节点中包含 <a> 标签，则修改其 target 属性
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.tagName === 'A') { // 检查是否是元素节点且是 <a> 标签
                        node.setAttribute('target', '_blank');
                    } else if (node.nodeType === 1 && node.querySelectorAll) { // 检查是否是元素节点且包含子节点
                        const aTags = node.querySelectorAll('a');
                        aTags.forEach(aTag => aTag.setAttribute('target', '_blank'));
                    }
                });
            }
        });
    });

    // 启动 MutationObserver
    observer.observe(document.body, { childList: true, subtree: true });

    // 初始修改页面中所有的 <a> 标签
    setTargetBlank();
})();