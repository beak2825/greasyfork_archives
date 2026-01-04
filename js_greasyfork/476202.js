// ==UserScript==
// @name         CB2.0移除水印
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动移除网页上的水印
// @author       DG_xinchuang
// @match        https://gd.cbss.10010.cn/cbss/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476202/CB20%E7%A7%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/476202/CB20%E7%A7%BB%E9%99%A4%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监视DOM
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                removeWatermark();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    function removeWatermark() {
        // 查找水印
        const watermarkDivs = document.querySelectorAll('div[style*="position: absolute;"][style*="width: 100%;"][style*="background-image:"]');
        watermarkDivs.forEach(div => {
            div.remove(); 
        });
    }

    removeWatermark();

})();