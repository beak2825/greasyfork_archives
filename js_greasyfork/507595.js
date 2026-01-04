// ==UserScript==
// @name         Hide Custom Affix Divs on mianshiya.com
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Hide all div elements with class 'custom-affix' on mianshiya.com
// @author       YourName
// @match        https://www.mianshiya.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507595/Hide%20Custom%20Affix%20Divs%20on%20mianshiyacom.user.js
// @updateURL https://update.greasyfork.org/scripts/507595/Hide%20Custom%20Affix%20Divs%20on%20mianshiyacom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：隐藏元素及其父元素直到找到类名为 'cell' 的元素
    function hideElement(element) {
        while (element && !element.classList.contains('cell')) {
            element = element.parentElement;
        }
        if (element) {
            element.style.display = 'none';
        }
    }

    // 函数：处理所有符合条件的元素
    function processElements() {
        const elements = document.querySelectorAll('div.custom-affix');
        elements.forEach(element => {
            hideElement(element);
        });
    }

    // 初始执行
    processElements();

    // 监听DOM变化，以处理动态加载的内容
    const observer = new MutationObserver(processElements);
    observer.observe(document.body, { childList: true, subtree: true });
})();
