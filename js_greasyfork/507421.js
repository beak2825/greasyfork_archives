// ==UserScript==
// @name         隐藏V2EX含"爽"字的帖子和回复
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏V2EX网站上包含"爽"字的帖子和回复
// @match        https://v2ex.com/*
// @match        https://*.v2ex.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507421/%E9%9A%90%E8%97%8FV2EX%E5%90%AB%22%E7%88%BD%22%E5%AD%97%E7%9A%84%E5%B8%96%E5%AD%90%E5%92%8C%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/507421/%E9%9A%90%E8%97%8FV2EX%E5%90%AB%22%E7%88%BD%22%E5%AD%97%E7%9A%84%E5%B8%96%E5%AD%90%E5%92%8C%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function hideElement(element) {
        while (element && !element.classList.contains('cell')) {
            element = element.parentElement;
        }
        if (element) {
            element.style.display = 'none';
        }
    }

    function processElements() {
        const elements = document.querySelectorAll('div.reply_content, a.topic-link');
        elements.forEach(element => {
            if (element.textContent.includes('爽')) {
                hideElement(element);
            }
        });
    }

    // 初始执行
    processElements();

    // 监听DOM变化，以处理动态加载的内容
    const observer = new MutationObserver(processElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
