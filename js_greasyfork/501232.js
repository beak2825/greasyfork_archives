// ==UserScript==
// @name         改变a标签打开方式
// @namespace    http://tampermonkey.net/
// @version      2024-03-25
// @description  改变亚马逊在线商店部分链接的打开方式
// @author       吴奎
// @license      MIT license
// @match        https://advertising.amazon.com/*
// @match        https://www.amazon.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=amazon.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501232/%E6%94%B9%E5%8F%98a%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/501232/%E6%94%B9%E5%8F%98a%E6%A0%87%E7%AD%BE%E6%89%93%E5%BC%80%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.addEventListener('click', function(e) {
        let targetElement = e.target; // 被点击的元素

        // 定义需要在新窗口打开的条件
        const complexConditions = [
            ["/cm/portfolios/"],
            ["/cm/ref=xx_cmpmgr_favb_xx"],//卖家中心-广告活动管理
            ["/cm/sp/campaigns/", "entityId="],//广告组
            ["cm/local/"],
            ["cm/internal"],
            ["/dp","/B0"],

            // 可以添加更多复杂条件...例如: ["aaa", "bbb"], // aaa和bbb必须同时存在
        ];

        // 定义需要在当前窗口打开的条件
        const currentWindowConditions = [
            ["33aaa", "c22cc"],
            ["b22bb", "654aa"],
        ];
        // 根据需要添加更多条件组
        // 例：同时包含这些字符串
        // 存放需要检查的子元素的选择器
        const specialChildSelectors = ['.cell-renderer-content-text'];

        do {
            if (targetElement.tagName === 'A') {
                const href = targetElement.getAttribute('href');

                // 检查是否满足当前窗口打开的多条件组合,如果满足则在当前标签打开链接
                const isCurrentWindowConditionMet = currentWindowConditions.some(group =>
                                                                                 group.every(str => href.includes(str))
                                                                                );
                if (isCurrentWindowConditionMet) {
                    e.preventDefault(); // 阻止<a>标签的默认行为
                    window.location.href = href; // 在当前窗口打开链接
                    return;
                }

                // 检查是否满足复杂的字符串条件,如果满足则在新标签打开链接
                const meetsComplexCriteria = complexConditions.some(group =>
                                                                    group.every(str => href.includes(str))
                                                                   );
                if (meetsComplexCriteria) {
                    e.preventDefault();
                    window.open(href, '_blank'); // 在新标签页打开链接
                    return;
                }

                // 检查是否有特定子元素
                const hasSpecialChild = specialChildSelectors.some(selector => targetElement.querySelector(selector));
                if (hasSpecialChild) {
                    e.preventDefault();
                    window.open(href, '_blank'); // 这里默认操作是在新标签页打开，可以根据需要调整
                    return;
                }
            }
            // 如果不符合条件，尝试处理父元素
            targetElement = targetElement.parentNode;
        } while (targetElement);
    });


})();