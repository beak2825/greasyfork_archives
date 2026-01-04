// ==UserScript==
// @name         自动打开perplexity.ai的Pro按钮
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  自动检查并激活Pro按钮
// @author       Wiliiam 
// @match        https://www.perplexity.ai/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492303/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80perplexityai%E7%9A%84Pro%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/492303/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80perplexityai%E7%9A%84Pro%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义激活按钮的函数
    function activateProButton() {
        const proButton = document.querySelector('button[data-testid="copilot-toggle"]');
        if (proButton && proButton.getAttribute('data-state') === 'closed') {
            proButton.click();
            console.log('Pro button activated.');
        }
    }

    // 监听页面加载完成事件
    window.addEventListener('load', activateProButton);
})();
