// ==UserScript==
// @name         Tencent Video Watermark Remover
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Removes watermark from video player on Tencent Video
// @license MIT
// @author       liraymond04
// @match        https://v.qq.com/x/cover/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=v.qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545249/Tencent%20Video%20Watermark%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/545249/Tencent%20Video%20Watermark%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function remove_watermark() {
        const watermark = document.querySelector('txpdiv[data-role="txp-ui-watermark-mod"].txp-watermark');
        if (watermark) watermark.remove();
    }

    remove_watermark();

    const observer = new MutationObserver(() => {
        remove_watermark();
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();