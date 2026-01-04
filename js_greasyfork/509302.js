// ==UserScript==
// @name         Remove scrollbar-color for Notion
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Remove scrollbar-color from Notion pages,ths Chatgpt.
// @author       Jw
// @icon          none
// @include      *://*.notion.*/*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/509302/Remove%20scrollbar-color%20for%20Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/509302/Remove%20scrollbar-color%20for%20Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("等待DOM加载");

    let style = document.createElement('style');
    style.innerHTML = "*::-webkit-scrollbar{display:none} /* Chrome and Safari */" +
        "  scrollbar-width: none; /* firefox */\n" +
        "  -ms-overflow-style: none; /* IE 10+ */\n" +
        "  overflow-x: hidden;\n" +
        "  overflow-y: auto;";
    document.head.appendChild(style);
    console.log("运行111111111111111111111111111111");

    function removeScrollbarColor() {
        for (let i = 0; i < document.styleSheets.length; i++) {
            const styleSheet = document.styleSheets[i];

            try {
                const rules = styleSheet.cssRules || styleSheet.rules;
                if (!rules) continue;

                for (let j = 0; j < rules.length; j++) {
                    const rule = rules[j];
                    if (rule.style && rule.style.scrollbarColor) {
                        rule.style.scrollbarColor = "";
                        // 移除 scrollbar-color
                    }
                }
            } catch (e) {
                console.log('Error accessing stylesheet:', e);
            }
        }
    }

    // 使用 MutationObserver 来观察 DOM 变化
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.type === 'childList') {
                removeScrollbarColor();
            }
        });
    });

    // 配置 MutationObserver 观察整个文档
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 初始运行，确保在脚本加载时已经加载的样式也被处理
    removeScrollbarColor();

})();

