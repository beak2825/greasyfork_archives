// ==UserScript==
// @name         Missavチェンジャー
// @namespace    http://てんさいにぱちゃん/
// @version      1.1
// @description  missav.wsのリンクをmissav.wsに置き換える
// @author       s925s twitter : s925nipa
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523608/Missav%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8%E3%83%A3%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/523608/Missav%E3%83%81%E3%82%A7%E3%83%B3%E3%82%B8%E3%83%A3%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceMissav() {
        const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let node;
        while (node = textNodes.nextNode()) {
            if (node.nodeValue.includes('missav.ws')) {
                node.nodeValue = node.nodeValue.replace(/missav\.com/g, 'missav.ws');
            }
        }

        const links = document.querySelectorAll('a[href*="missav.ws"]');
        links.forEach(link => {
            link.href = link.href.replace(/missav\.com/g, 'missav.ws');
        });
    }

    replaceMissav();

    const observer = new MutationObserver(() => {
        replaceMissav();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();