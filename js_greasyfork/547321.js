// ==UserScript==
// @name         动态移除复制限制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动监听新加载的DOM元素，并移除user-select属性
// @author       ChatGPT
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/547321/%E5%8A%A8%E6%80%81%E7%A7%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/547321/%E5%8A%A8%E6%80%81%E7%A7%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 移除元素及其子元素上的 user-select 属性
     * @param {HTMLElement} element
     */
    function removeUserSelect(element) {
        if (!element) return;

        // 移除当前元素的属性
        element.style.removeProperty('user-select');
        element.style.removeProperty('-webkit-user-select');
        element.style.removeProperty('-moz-user-select');

        // 遍历所有子元素，递归移除属性
        const allChildren = element.querySelectorAll('*');
        allChildren.forEach(child => {
            child.style.removeProperty('user-select');
            child.style.removeProperty('-webkit-user-select');
            child.style.removeProperty('-moz-user-select');
        });
    }

    // 创建一个 MutationObserver 实例
    const observer = new MutationObserver(mutationsList => {
        for(const mutation of mutationsList) {
            // 检查是否有新节点被添加
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 确保是元素节点
                        removeUserSelect(node);
                    }
                });
            }
        }
    });

    // 开始观察 body 元素及其所有子元素的变动
    observer.observe(document.body, {
        childList: true, // 观察子节点的添加或移除
        subtree: true    // 观察所有后代节点
    });

    // 为了防止一些在 Observer 启动前就渲染好的元素，
    // 可以在页面加载后手动执行一次
    window.addEventListener('load', () => removeUserSelect(document.body));

})();