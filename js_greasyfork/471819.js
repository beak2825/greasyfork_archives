// @license MIT
// ==UserScript==
// @name         清空回收站
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  适用于GEE批量下载大于存储空间的影像资料，配合GoogleDriver和本地的文件转移代码使用。
// @author       You
// @match        https://drive.google.com/drive/trash
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471819/%E6%B8%85%E7%A9%BA%E5%9B%9E%E6%94%B6%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/471819/%E6%B8%85%E7%A9%BA%E5%9B%9E%E6%94%B6%E7%AB%99.meta.js
// ==/UserScript==

(async function () {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // 递归遍历节点，查找包含指定关键词的标签
    function findTagsWithKeyword(node, keyword) {
        const foundTags = [];

        // 如果当前节点是一个元素节点，并且包含关键词，则将其添加到结果数组中
        if (node.nodeType === Node.ELEMENT_NODE && node.textContent.includes(keyword)) {
            foundTags.push(node);
        }

        // 递归遍历当前节点的所有子节点
        const childNodes = node.childNodes;
        for (let i = 0; i < childNodes.length; i++) {
            foundTags.push(...findTagsWithKeyword(childNodes[i], keyword));
        }

        return foundTags;
    }
    while (true) {
        await sleep(300000)//600000
        console.log("执行清理")
        try {
            const tagsWithKeyword = findTagsWithKeyword(document.body, "清空回收站");
            tagsWithKeyword[16].click()
            await sleep(2000)
            const ok_list = findTagsWithKeyword(document.body, "永久删除");
            ok_list[38].click()
        } catch (e) { }
    }

    // Your code here...
})();