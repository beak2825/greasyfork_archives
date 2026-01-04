// ==UserScript==
// @name         Remove YouTube Video Branding Avatar
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Continuously remove the custom annotation branding element on YouTube.
// @author       YourName (或者原始作者，例如 BBFN)
// @match        *://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540466/Remove%20YouTube%20Video%20Branding%20Avatar.user.js
// @updateURL https://update.greasyfork.org/scripts/540466/Remove%20YouTube%20Video%20Branding%20Avatar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 持续监听DOM变化并移除元素（如果需要更强的兼容性）
    // 但通常通过 GM_addStyle 注入CSS更高效
    GM_addStyle(`
        .ytp-watermark {
            display: none !important;
        }
        .ytp-impression-link {
            display: none !important;
        }
        /* 针对旧版或特定情况，可能还需要以下规则 */
        div.annotation.annotation-type-custom.iv-branding {
            display: none !important;
        }
    `);

    // 如果仅仅是GM_addStyle不够，可以考虑更“激进”的方式，但通常不推荐，因为它会消耗更多资源
    // let observer = new MutationObserver(function(mutations) {
    //     mutations.forEach(function(mutation) {
    //         if (mutation.addedNodes) {
    //             mutation.addedNodes.forEach(function(node) {
    //                 if (node.nodeType === 1) { // Element node
    //                     let watermark = node.querySelector('.ytp-watermark') || node.querySelector('.ytp-impression-link') || node.querySelector('div.annotation.annotation-type-custom.iv-branding');
    //                     if (watermark) {
    //                         watermark.style.display = 'none';
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // });

    // observer.observe(document.body, { childList: true, subtree: true });

})();