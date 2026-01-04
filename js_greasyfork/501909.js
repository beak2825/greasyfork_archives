// ==UserScript==
// @name         梦乡去广(测试版)
// @license      MIT
// @version      0.1
// @description  Kill AD
// @author       Memory
// @match        *://*.yume.ly/*
// @grant        none
// @namespace https://greasyfork.org/users/1230414
// @downloadURL https://update.greasyfork.org/scripts/501909/%E6%A2%A6%E4%B9%A1%E5%8E%BB%E5%B9%BF%28%E6%B5%8B%E8%AF%95%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/501909/%E6%A2%A6%E4%B9%A1%E5%8E%BB%E5%B9%BF%28%E6%B5%8B%E8%AF%95%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的 URL
    let urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get('page')) || 1;

    // 检测所有的 a.name 元素
    let nameLinks = document.querySelectorAll('a.name');
    nameLinks.forEach(link => {
        if (link.textContent.trim() === '李财运') {
            // 删除该元素的父父节点
            let grandParent = link.parentNode.parentNode;
            grandParent.parentNode.removeChild(grandParent);
        }
    });

    // 检测 id 为 columnHomeA 的元素的子元素个数
    let columnHomeA = document.getElementById('columnHomeA');
    if (columnHomeA && columnHomeA.children.length === 1) {
        // 跳转到下一页
        let nextPageUrl = window.location.href.split('?')[0] + '?page=' + (currentPage + 1);
        window.location.href = nextPageUrl;
    }
})();