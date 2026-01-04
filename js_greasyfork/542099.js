// ==UserScript==
// @name         Remove Watermark
// @match        *://zh.jianye.com.cn/*
// @run-at       document-end
// @version 0.0.1.20250709080804
// @namespace http://tampermonkey.net/
// @description Remove the watermark div
// @downloadURL https://update.greasyfork.org/scripts/542099/Remove%20Watermark.user.js
// @updateURL https://update.greasyfork.org/scripts/542099/Remove%20Watermark.meta.js
// ==/UserScript==

(function() {
    const watermark = document.getElementById('mask_div00');
    if(watermark) watermark.remove();
    
    // 阻止重新创建
    new MutationObserver(() => {
        document.querySelectorAll('.mask_div').forEach(el => el.remove());
    }).observe(document.body, {childList: true, subtree: true});
})();