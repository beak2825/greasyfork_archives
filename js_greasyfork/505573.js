// ==UserScript==
// @name         嗚嗚嗚
// @namespace    xuan2wu1_wuwuwu
// @version      v0.0.2
// @description  替换页面上的大部分内容为“嗚”
// @author       cmd1152
// @match        *://*/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/505573/%E5%97%9A%E5%97%9A%E5%97%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/505573/%E5%97%9A%E5%97%9A%E5%97%9A.meta.js
// ==/UserScript==

(function() {
    function replaceText() {
        const regex = /\p{L}{1}|[0-9]/gu;

        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let currentNode;

        while (currentNode = walker.nextNode()) {
            if (regex.test(currentNode.nodeValue)) {
                currentNode.nodeValue = currentNode.nodeValue.replace(regex, '嗚');
            }
        }
    }

    replaceText();

    const observer = new MutationObserver(replaceText);
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();