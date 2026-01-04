// ==UserScript==
// @name         恢复知乎文章UI旧页面
// @namespace    http://tampermonkey.net/
// @version      2025-06-28
// @description  恢复知乎文章的UI旧页面
// @author       breezeblow
// @match        https://zhuanlan.zhihu.com/p/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533097/%E6%81%A2%E5%A4%8D%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0UI%E6%97%A7%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/533097/%E6%81%A2%E5%A4%8D%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0UI%E6%97%A7%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var userPanelDiv = document.querySelector('.Post-Row-Content-right');
    if (userPanelDiv) {
        userPanelDiv.remove();
    };


    // 修改 .Post-Row-Content 的内联样式，将 justify-content 改为 center
    function updatePostRowContentStyle(node) {
        // 如果传入特定节点，则只操作该节点下的 .Post-Row-Content，否则操作整个文档
        const elements = node
        ? node.querySelectorAll('.Post-Row-Content')
        : document.querySelectorAll('.Post-Row-Content');
        elements.forEach(el => {
            // 直接修改内联样式，设置 !important
            el.style.setProperty('justify-content', 'center', 'important');
        });
    }

    // 修改页面背景颜色为 #ffffff
    function updateBodyBackground() {
        document.body.style.setProperty('background-color', '#ffffff');
        document.documentElement.style.setProperty('background-color', '#ffffff');
    }

    // 取消 .Post-Row-Content-left 的最大宽度限制
    function updatePostRowContentLeftStyle(node) {
        const elements = node
        ? node.querySelectorAll('.Post-Row-Content-left')
        : document.querySelectorAll('.Post-Row-Content-left');
        elements.forEach(el => {
            el.style.setProperty('width', 'auto', 'important'); // 或者使用 100% 根据需要
            el.style.setProperty('max-width', '100%', 'important'); // 保证不再被限制
        });
    }


    updatePostRowContentStyle();
    updateBodyBackground();
    updatePostRowContentLeftStyle();


})();