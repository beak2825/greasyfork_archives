// ==UserScript==
// @name         AI Chat WideScreen
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  Make the ChatGPT & DeepSeek conversation window wider.使ChatGPT和DeepSeek的聊天对话框更宽
// @author       Xiong Yu
// @match        https://chat.openai.com/*
// @match        https://chatgpt.com/*
// @match        https://chat.deepseek.com/*
// @grant        none
// @homepageURL  https://greasyfork.org/zh-CN/scripts/473238
// @downloadURL https://update.greasyfork.org/scripts/473238/AI%20Chat%20WideScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/473238/AI%20Chat%20WideScreen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updateStyle(element) {
        element.style.maxWidth = '95%';
    }

    const nodes = [
        'body > div > div > main > div > div > div > div > div > div > article > div > div',
        'body > div > div > div > div > main > div > div > div > div > div > div > article > div > div',
        'body > div > div > div > div > main > div > div > div > div > article > div > div',
        'body > div > div > div > div > main > div > div > div > div > div > article > div > div',
        '#thread > div > div > div > article > div > div',
        '#root > div > div > div > div > div > div > div > div'
    ];

    const observer = new MutationObserver(mutationsList => {
        mutationsList.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        if (nodes.some(selector => addedNode.matches(selector))) {
                            updateStyle(addedNode);
                        } else {
                            nodes.forEach(selector => {
                                addedNode.querySelectorAll(selector).forEach(updateStyle);
                            });
                        }
                    }
                });
            }
        });
    });

    observer.observe(document, { childList: true, subtree: true });
})();