// ==UserScript==
// @name         Hide comments on creator center in Bilibili 隐藏B站创作中心评论
// @namespace    http://tampermonkey.net/
// @version      2024-10-04
// @description  登录B站创作中心后，评论的组件会被隐藏
// @author       You
// @match        https://member.bilibili.com/platform/home
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MI
// @downloadURL https://update.greasyfork.org/scripts/511521/Hide%20comments%20on%20creator%20center%20in%20Bilibili%20%E9%9A%90%E8%97%8FB%E7%AB%99%E5%88%9B%E4%BD%9C%E4%B8%AD%E5%BF%83%E8%AF%84%E8%AE%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/511521/Hide%20comments%20on%20creator%20center%20in%20Bilibili%20%E9%9A%90%E8%97%8FB%E7%AB%99%E5%88%9B%E4%BD%9C%E4%B8%AD%E5%BF%83%E8%AF%84%E8%AE%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to hide the specific div
    function hideDiv() {
        var element = document.querySelector('div.interact-wrap.bcc-col.bcc-col-24.nomargin');
        if (element) {
            element.style.display = 'none';
            return true;
        }
        return false;
    }

    // Check initially if the div is already present
    if (!hideDiv()) {
        // Set up a MutationObserver to detect changes in the DOM
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    hideDiv(); // Try to hide the div whenever new nodes are added
                }
            });
        });

        // Observe changes in the entire document body
        observer.observe(document.body, {
            childList: true, // Monitor direct children
            subtree: true    // Monitor all descendants (in case the div is deep in the DOM)
        });
    }
})();
