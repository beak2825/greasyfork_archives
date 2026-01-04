// ==UserScript==
// @name         在后台标签页打开推文
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add a button to open tweets in a background tab
// @match        https://twitter.com/*
// @match        https://x.com/*
// @match        https://mobile.x.com/*
// @match        https://twitter.com/*
// @license      MIT
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/501930/%E5%9C%A8%E5%90%8E%E5%8F%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%8E%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/501930/%E5%9C%A8%E5%90%8E%E5%8F%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E6%8E%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addOpenInTabButton = (article) => {
        if (article.dataset.openInTabButtonAdded) return;
        article.dataset.openInTabButtonAdded = 'true';

        const btnGroup = article.querySelector('div[role="group"]:last-of-type');
        if (!btnGroup) return;

        const shareBtn = Array.from(btnGroup.querySelectorAll(':scope>div>div')).pop();
        if (!shareBtn) return;

        const openInTabBtn = shareBtn.cloneNode(true);
        openInTabBtn.querySelector('svg').innerHTML = '<g><path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/></g>';
        openInTabBtn.setAttribute('aria-label', 'Open tweet in background tab');
        openInTabBtn.title = 'Open in background tab';

        openInTabBtn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const tweetLink = article.querySelector('a[href*="/status/"]').href;
            GM_openInTab(tweetLink, { active: false, insert: true, setParent: true });
        };

        // Insert the button to the right side of the block
        btnGroup.appendChild(openInTabBtn);
        openInTabBtn.style.marginLeft = '10px';
    };

    const observeTimeline = () => {
        const observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const articles = node.tagName === 'ARTICLE' ? [node] : node.querySelectorAll('article');
                        articles.forEach(addOpenInTabButton);
                    }
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    };

    // Initial run for existing tweets
    document.querySelectorAll('article').forEach(addOpenInTabButton);

    // Observe for new tweets being added
    observeTimeline();

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        [aria-label="Open tweet in background tab"]:hover {
            color: rgb(29, 155, 240);
        }
    `;
    document.head.appendChild(style);
})();
