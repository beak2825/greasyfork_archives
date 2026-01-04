// ==UserScript==
// @name         remove difficult
// @name:zh-CN   移除困难的
// @namespace    mailto: 1405056768@qq.com
// @version      0.0.11
// @license      MIT
// @description  remove difficult Problems
// @description:zh-CN 移除困难的 Leetcode 题目
// @author       1405056768
// @match        https://leetcode.cn/problemset/*
// @match        https://leetcode.cn/tag/*
// @match        https://leetcode.cn/problem-list/*
// @match        https://leetcode.com/problemset/*
// @match        https://leetcode.com/problem-list/*
// @match        https://leetcode.cn/search/?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526648/remove%20difficult.user.js
// @updateURL https://update.greasyfork.org/scripts/526648/remove%20difficult.meta.js
// ==/UserScript==

(function() {
    'use strict';
    main();
})();

function main() {
    setInterval(remove, 3000);
}

function remove() {
    // 查找所有包含特定 span 的元素
const spans = document.querySelectorAll('span.text-red-s');

// 遍历每个找到的 span
spans.forEach(span => {
    // 获取 span 的父节点
    const parentNode = span.parentNode;
    // 获取父节点的父节点
    const grandParentNode = parentNode.parentNode;
    // 隐藏父节点的父节点
    grandParentNode.style.display = 'none';
});
}