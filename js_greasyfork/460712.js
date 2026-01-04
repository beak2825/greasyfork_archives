// ==UserScript==
// @name         颜色替换
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  直观展示颜色代码
// @author       yihouzenmeban
// @match        *://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460712/%E9%A2%9C%E8%89%B2%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460712/%E9%A2%9C%E8%89%B2%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function changeNode() {
        document.querySelectorAll('.markdown.prose.w-full p').forEach(nodeContent => {
            if (!nodeContent.classList.contains('haveReplace')) {
                nodeContent.classList.add('haveReplace');
                const str = nodeContent.innerHTML;
                const newStr = str.replace(/(#([a-f0-9]{3}){1,2}\b)/gi, '<span style="background-color: $1;display:inline-block;width:12px;height:12px;margin-right: 2px;border-radius:2px;"></span>$1');
                nodeContent.innerHTML = newStr;
            }
        });
    }

    function debounce(fn, delay) {
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                fn.apply(this, arguments);
            }, delay);
        };
    }

    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(debounce(() => {
        changeNode();
    }, 500));

    observer.observe(document.querySelector('body'), { childList: true, subtree: true });
})();
