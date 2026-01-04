// ==UserScript==
// @name         贞德去广告特供版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  贞德去广告特供版.
// @author       空白
// @match        *://*.hvhbbs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496568/%E8%B4%9E%E5%BE%B7%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%89%B9%E4%BE%9B%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496568/%E8%B4%9E%E5%BE%B7%E5%8E%BB%E5%B9%BF%E5%91%8A%E7%89%B9%E4%BE%9B%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to remove specific elements
    const removeElements = () => {
        // Remove style elements
        document.querySelectorAll('div.p-body-inner.margin-add style').forEach(styleElement => styleElement.remove());

        // Remove swiper-wrapper div elements
        document.querySelectorAll('div.swiper-wrapper').forEach(swiperElement => swiperElement.remove());
    };

    // Initial removal in case elements are already present
    removeElements();

    // Create a MutationObserver to observe the document for any changes
    const observer = new MutationObserver(removeElements);

    // Start observing the document for changes in the entire tree and subtree
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
