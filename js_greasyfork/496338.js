// ==UserScript==
// @name     (2024)reddit: remove Promoted posts
// @name:zh (2024)reddit:移除列表带Promoted标识的广告
// @namespace    acemarx
// @version      1.0.2
// @description  Remove Promoted posts that are shown as relevant answers even if they're not.
// @description:zh 自动移除列表里面的广告帖子（带Promoted标识的）
// @author       acemarx
// @grant    none
// @exclude https://*.reddit.com/robots.txt?upapi=true
// @exclude http://*.reddit.com/robots.txt?upapi=true
// @match        https://*.reddit.com/*
// @match        http://*.reddit.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496338/%282024%29reddit%3A%20remove%20Promoted%20posts.user.js
// @updateURL https://update.greasyfork.org/scripts/496338/%282024%29reddit%3A%20remove%20Promoted%20posts.meta.js
// ==/UserScript==
const removeSponsor = () => {
    try {
        const ads = document.querySelectorAll(".promotedlink");
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
