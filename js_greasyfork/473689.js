// ==UserScript==
// @name         Qidian P to Span
// @namespace    https://dvel.me/qidian-p-to-span
// @version      1.0.0
// @description  Convert <p> tags to <span> tags followed by a <br> under specific <main> tag on Qidian chapter pages
// @author       ChatGPT
// @match        https://www.qidian.com/chapter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473689/Qidian%20P%20to%20Span.user.js
// @updateURL https://update.greasyfork.org/scripts/473689/Qidian%20P%20to%20Span.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replacePTagsWithSpanAndBR() {
        let xpathResult = document.evaluate('/html/body/div[1]/div/div[2]/div[2]/div/div[2]/div/main/p', document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        for (let i = 0; i < xpathResult.snapshotLength; i++) {
            let p = xpathResult.snapshotItem(i);
            let span = document.createElement('span');
            span.innerHTML = p.innerHTML;
            p.parentNode.replaceChild(span, p);

            // 添加<br>标签
            let br = document.createElement('br');
            span.parentNode.insertBefore(br, span.nextSibling);
        }
    }

    let observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                replacePTagsWithSpanAndBR();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})();
