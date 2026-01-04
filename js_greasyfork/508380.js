// ==UserScript==
// @name         Google translation details
// @name:zh-CN   谷歌翻译查字典
// @namespace    http://tampermonkey.net/
// @description  show translation details automatically.
// @description:zh-cn 自动打开谷歌翻译里的查字典
// @author       Ryan
// @version      0.4
// @match        https://translate.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/508380/Google%20translation%20details.user.js
// @updateURL https://update.greasyfork.org/scripts/508380/Google%20translation%20details.meta.js
// ==/UserScript==

function checkVisible(node) {
    const stylesMap = node.computedStyleMap();
    return stylesMap.get('display').value !== 'none' && stylesMap.get('visibility').value !== 'hidden';
}

(function() {
    'use strict';

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'A') {
                        if (node.attributes.href.value === './details') {
                            node.click();
                            break;
                        }
                    }
                }
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
})();