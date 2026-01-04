// ==UserScript==
// @name         reset LeetCode editor on load
// @namespace    https://zacklight.com/
// @version      0.3
// @description  Reset LeetCode on load so you wouldn't accidentally see a previously submitted solution!
// @author       Zack Light
// @match        https://leetcode.com/problems/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495330/reset%20LeetCode%20editor%20on%20load.user.js
// @updateURL https://update.greasyfork.org/scripts/495330/reset%20LeetCode%20editor%20on%20load.meta.js
// ==/UserScript==
function confirm() {
    let confirm_button = document.querySelector('#editor > div.flex.h-8.items-center.justify-between.border-b.p-1.border-border-quaternary.dark\\:border-border-quaternary > div.flex.items-center.gap-1 > div > div > div > div.my-8.inline-block.min-w-full.transform.overflow-hidden.rounded-\\[13px\\].text-left.transition-all.bg-overlay-3.md\\:min-w-\\[420px\\].shadow-level4.dark\\:shadow-dark-level4.dark\\:bg-dark-layer-2.p-0.w-\\[480px\\].opacity-100.scale-100 > div > div.mt-8.flex.justify-end > div > div > div:nth-child(2) > button');
    confirm_button.click();
}

function reset() {
    let reset_button = document.querySelector('#editor > div.flex.h-8.items-center.justify-between.border-b.p-1.border-border-quaternary.dark\\:border-border-quaternary > div.flex.items-center.gap-1 > button:nth-child(4)');
    reset_button.click();

    setTimeout(confirm, 50);
}

(function() {
    'use strict';
    setTimeout(reset, 1000);
})();