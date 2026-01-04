// ==UserScript==
// @name         阻止加载带关键词的图片
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  更大范围的阻止图片加载
// @author       tdh
// @match        *
// @grant        none
// @sandbox      raw
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475101/%E9%98%BB%E6%AD%A2%E5%8A%A0%E8%BD%BD%E5%B8%A6%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/475101/%E9%98%BB%E6%AD%A2%E5%8A%A0%E8%BD%BD%E5%B8%A6%E5%85%B3%E9%94%AE%E8%AF%8D%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const blockedKeywords = ['download.php', 'php'];
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    const img = node;
                    for (const keyword of blockedKeywords) {
                        if (img.src.includes(keyword)) {
                            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                            img.alt = 'Blocked Image';
                            break;
                        }
                    }
                }
            });
        });
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();