// ==UserScript==
// @name         ChatGPT全屏净化
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  尝试在每次页面加载时移除所有元素的最大宽度限制，并删除特定的页面元素
// @author       BruceWang
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/484725/ChatGPT%E5%85%A8%E5%B1%8F%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/484725/ChatGPT%E5%85%A8%E5%B1%8F%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 移除最大宽度限制
     function removeMaxWidth() {
        var allElements = document.querySelectorAll('*');
        allElements.forEach(item => {
            item.style.maxWidth = 'none';
        });
    }

    // 移除底部文本
    function removeSpecificElement() {
        var elements = document.querySelectorAll('.text-token-text-secondary');
        elements.forEach(function(element) {
            if (element.textContent.includes("ChatGPT可能会犯错误。请考虑核实重要信息。")) {
                element.parentNode.removeChild(element);
            }
        });
    }

    // 使用MutationObserver来监视DOM变更
    var observer = new MutationObserver(function(mutations) {
        if (mutations.length > 0) {
            removeMaxWidth();
            removeSpecificElement();
        }
    });

    // 配置并启动观察者
    observer.observe(document.body, { childList: true, subtree: true });

    // 立即执行函数以覆盖初始加载的元素
    removeMaxWidth();
    removeSpecificElement();

})();
