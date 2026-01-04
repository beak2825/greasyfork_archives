// ==UserScript==
// @name         Remove Stupid Google Lens Drop Zone
// @name:zh-CN      去除傻×的 Google Lens 拖放区
// @namespace    fuck-you-google-lens
// @version      0.2
// @description  This script removes the stupid Google Lens drop zone that appears in the search bar when dragging links (or anything else) on Google search results pages. This feature is an intrusive and unnecessary addition to Google's search experience, and this script aims to remove it.
// @description:zh-CN 这个脚本用于去除在 Google 搜索结果页面拖动链接（或其他内容）时出现在搜索栏中的那个傻×的 Google Lens 拖放区。
// @author       Unintendedz
// @icon         https://lh3.googleusercontent.com/AjRsGVa7hjknlPuBARCXO_tKGNVm8C-R6gsebEWCSwgcKfp2WPkdMVovsfK_tNbNwlbBfOqJCpHS2_ejJy4iEkeJtjHKE-Xfh9crQ9hGmNNMAOT0Ua8
// @grant        none
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @run-at document-end
// @license WTFPL
// @downloadURL https://update.greasyfork.org/scripts/461619/Remove%20Stupid%20Google%20Lens%20Drop%20Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/461619/Remove%20Stupid%20Google%20Lens%20Drop%20Zone.meta.js
// ==/UserScript==

/*Script Details:
This script uses the MutationObserver API to listen for changes in the DOM of the Google search results page. When a new child node is added to the page, the script checks if it matches the selector div > c-wiz > div.focusSentinel, which is the container for the Google Lens drop zone. If a match is found, the script removes the parent element's parent element, effectively removing the Google Lens drop zone from the page.

We believe that Google's decision to add this feature to its search results page is foolish and invasive, and we hope that this script helps to improve the search experience for users who share our frustration.*/

(function() {
    'use strict';
    // 获取目标节点
    const targetNode = document.body;

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver((mutationsList) => {
        // 遍历每个发生变化的 mutation
        for(const mutation of mutationsList) {
            // 如果节点添加了新的子节点
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // 查找匹配选择器的元素
                const divElement = document.querySelector('div > c-wiz > div.focusSentinel');
                if (divElement) {
                    // 删除父元素的父元素
                    const parentElement = divElement.parentElement.parentElement;
                    parentElement.parentNode.removeChild(parentElement);
                }
            }
        }
    });

    // 配置观察器选项
    const config = { childList: true, subtree: true };

    // 传入目标节点和观察器选项
    observer.observe(targetNode, config);

})();