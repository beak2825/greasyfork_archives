// ==UserScript==
// @name         Reddit: Low Upvote Filter
// @description  Hide font page posts with fewer than 10 upvotes (edit minimum in the code)
// @match        https://www.reddit.com/*
// @version      0.1
// @author       mica
// @namespace    greasyfork.org/users/12559
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487220/Reddit%3A%20Low%20Upvote%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/487220/Reddit%3A%20Low%20Upvote%20Filter.meta.js
// ==/UserScript==

const minUpvote = 10;
const observer = new MutationObserver(() => {
    if (location.pathname == '/') {
        document.querySelectorAll('button[aria-label="upvote"]:not(.checked)').forEach(element => {
            if (element.nextSibling.innerText < minUpvote) {
                element.closest('div.scrollerItem').remove();
            } else {
                element.classList.add('checked');
            }
        });
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true
});
