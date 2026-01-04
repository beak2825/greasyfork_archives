// ==UserScript==
// @name        Dual Articles
// @namespace   Violentmonkey Scripts
// @match       https://omni.se/*
// @grant       none
// @version     1.0
// @author      divergent001911
// @description 1/27/2025, 5:42:58 PM
// @license     MIT 
// @downloadURL https://update.greasyfork.org/scripts/525078/Dual%20Articles.user.js
// @updateURL https://update.greasyfork.org/scripts/525078/Dual%20Articles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyStyles(feed) {
        feed.style.maxWidth = '1200px';
        feed.style.display = 'flex';
        feed.style.flexWrap = 'wrap';
        feed.style.gap = '12px';
        feed.style.padding = '10px 0';
        feed.style.flexDirection = 'row';
        feed.style.justifyContent = 'center';

        const children = feed.querySelectorAll(':scope > div');
        children.forEach(child => {
            child.style.minWidth = '320px';
            child.style.maxWidth = '600px';
            child.style.flex = '1 1 480px';
            child.style.boxSizing = 'border-box';
            child.style.width = 'min(600px, calc(100vw - 40px))';
        });
    }

    function observeFeeds() {
        const feeds = document.querySelectorAll('[class^="Feed_feed__"]');
        feeds.forEach(feed => {
            applyStyles(feed);
            const observer = new MutationObserver(() => applyStyles(feed));
            observer.observe(feed, { childList: true, subtree: false });
        });
    }

    window.addEventListener('load', observeFeeds);
})();


