// ==UserScript==
// @name         修改flomo宽度
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  change special element width
// @author       hhlass
// @match        https://v.flomoapp.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500711/%E4%BF%AE%E6%94%B9flomo%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/500711/%E4%BF%AE%E6%94%B9flomo%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 选择器，用于选择你想要修改的元素
    const selectorLeft = '.el-aside.left';
    const selectorRight = '.el-main';

    // 设置元素宽度的函数
    function setElementWidth() {
        const elementL = document.querySelector(selectorLeft);
        if (elementL) {
            elementL.style.setProperty('width', '450px', 'important');
        }
        const elementR = document.querySelector(selectorRight)
        if (elementR) {
            elementR.style.setProperty('width', '900px', 'important');
        }
    }

    // 使用MutationObserver来监听DOM变化
    const observer = new MutationObserver((mutationsList, observer) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                setElementWidth();
            }
        }
    });

    // 配置MutationObserver
    const config = { childList: true, subtree: true };

    // 开始观察整个文档的变化
    observer.observe(document.body, config);

    // 检查初始页面加载时是否已经存在该元素
    window.addEventListener('load', setElementWidth);

})();
