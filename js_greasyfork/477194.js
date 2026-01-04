// ==UserScript==
// @name         删除元素
// @namespace    http://your-namespace
// @version      1.1
// @description  删除右上角无用元素
// @author       刚学会做蛋饼
// @license      MIT
// @match        https://ilabel.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477194/%E5%88%A0%E9%99%A4%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/477194/%E5%88%A0%E9%99%A4%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义要删除的XPath路径
    const xPathsToDelete = [
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[6]/DIV[1]', // 第一个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[2]', // 第二个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[6]/DIV[2]', // 第三个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[7]/DIV[1]', // 第四个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[7]/DIV[2]', // 第五个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[9]/DIV[1]', // 第六个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[9]/DIV[2]', // 第七个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[10]/DIV[1]', // 第八个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[10]/DIV[2]', // 第九个
	   'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[2]/DIV[1]/DIV[7]/DIV[1]', // 第十个
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[1]/DIV[1]/DIV[1]',//命中策略
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ARTICLE[1]/SECTION[1]/DIV[1]/DIV[2]',//暂无
        'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ASIDE[1]/DIV[1]', // 基本信息
         'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[1]/DIV[1]/ASIDE[1]', // 基本信息的下拉剪头
         //'id("app")/DIV[1]/DIV[2]/SECTION[1]/DIV[1]/DIV[1]/DIV[1]/DIV[1]/DIV[2]/ARTICLE[2]/SECTION[2]/DIV[1]/DIV[5]/DIV[1]', // 违规图片上传
    ];

    // 创建MutationObserver以监视内容变化
    const observer = new MutationObserver(() => {
        // 在变化时遍历要删除的XPath路径
        xPathsToDelete.forEach(xpath => {
            // 使用XPath查询选定元素
            const elementToDelete = document.evaluate(
                xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
            ).singleNodeValue;

            // 如果找到要删除的元素，删除它
            if (elementToDelete) {
                elementToDelete.remove();
            }
        });
    });

    // 配置MutationObserver以监视子节点变化
    const config = { childList: true, subtree: true };

    // 启动MutationObserver
    observer.observe(document.body, config);
})();
