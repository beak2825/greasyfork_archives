// ==UserScript==
// @name     (2023)Quora: remove sponsored posts
// @name:zh (2023)Quora:移除列表带sponsored标识的广告
// @namespace    acemarx
// @version      1.0.2
// @description  Remove sponsored posts that are shown as relevant answers even if they're not.
// @description:zh 自动移除列表里面的广告帖子（带sponsored标识的）
// @author       acemarx
// @grant    none
// @exclude https://*.quora.com/robots.txt?upapi=true
// @exclude http://*.quora.com/robots.txt?upapi=true
// @match        https://*.quora.com/*
// @match        http://*.quora.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/467717/%282023%29Quora%3A%20remove%20sponsored%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/467717/%282023%29Quora%3A%20remove%20sponsored%20posts.meta.js
// ==/UserScript==
const removeSponsor = () => {
    try {
        const ads = document.querySelectorAll(".dom_annotate_multifeed_bundle_AdBundle");
        ads.forEach((ad) => {
            ad?.parentNode?.removeChild(ad);
        });
    } catch (error) {
        console.error("An error occurred while removing sponsor:", error);
    }
};

if (typeof MutationObserver === 'undefined') {
    console.log('Browser does not support MutationObserver.');
} else {
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                removeSponsor();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}
