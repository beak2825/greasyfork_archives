// ==UserScript==
// @name         搜索拓展跳转脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Handle clicks on elements with dynamic CSS selectors
// @author       You
// @license 大萨达
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512691/%E6%90%9C%E7%B4%A2%E6%8B%93%E5%B1%95%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512691/%E6%90%9C%E7%B4%A2%E6%8B%93%E5%B1%95%E8%B7%B3%E8%BD%AC%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来处理点击事件
    function handleClick(e) {
        // 检查点击的元素是否匹配特定的CSS选择器模式
        if (e.target.matches('.arco-breadcrumb-item .text')) {
            let breadcrumbItem = e.target.closest('.arco-breadcrumb-item');
            let listItemContent = breadcrumbItem && breadcrumbItem.closest('.arco-list-item-content');
            let listItem = listItemContent && listItemContent.closest('.arco-list-item');

            // 检查listItem和breadcrumbItem是否符合:nth-child(n)选择器
            if (listItem && listItem.matches('.arco-list-item:nth-child(n)')) {
                if (breadcrumbItem && breadcrumbItem.matches('.arco-breadcrumb-item:nth-child(n)')) {
                    // 提取 href 属性
                    const href = e.target.closest('a') ? e.target.closest('a').getAttribute('href') : null;
                    if (href && href.startsWith("siyuan://blocks/")) {
                        // 提取 ID
                        const id = href.split('/').pop();
                        // 组合新的 URL
                        const newUrl = `http://127.0.0.1:6806/?id=${id}`;
                        // 在新标签页打开
                        window.open(newUrl, '_blank');
                        // 阻止默认行为
                        e.preventDefault();
                    }
                }
            }
        }
    }

    // 为整个文档添加点击事件监听器
    document.addEventListener('click', handleClick);
})();