// ==UserScript==
// @name         Reddit Mobile - Remove Promoted & Recommended
// @namespace    https://greasyfork.org/en/users/000000
// @version      1.0
// @description  Removes promoted posts, recommendations, and sidebar suggestions from mobile Reddit
// @author       Jake’s ChatGPT
// @license      MIT
// @match        https://www.reddit.com/*
// @match        https://m.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545045/Reddit%20Mobile%20-%20Remove%20Promoted%20%20Recommended.user.js
// @updateURL https://update.greasyfork.org/scripts/545045/Reddit%20Mobile%20-%20Remove%20Promoted%20%20Recommended.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function removeCrap() {
        document.querySelectorAll([
            '[data-testid="post-container"]:has([data-testid="promoted-tag"])',
            '.promotedlink',
            '.Listing__promoted',
            '.related-posts',
            '.recsRichTreatment',
            '.PostFooter__recommendations-bar',
            '.ListingLayout-aside'
        ].join(',')).forEach(el => el.remove());
    }

    // Run on load
    removeCrap();

    // Run whenever new elements are added
    const observer = new MutationObserver(removeCrap);
    observer.observe(document.body, { childList: true, subtree: true });
})();