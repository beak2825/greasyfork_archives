// ==UserScript==
// @name        Rtings Open Shopping Links in New Tab Only
// @namespace   https://greasyfork.org/en/users/594496-divided-by
// @author      dividedby
// @description Opens shopping links in new tabs on rtings.com without affecting the current tab
// @version     1.1
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=dividedbyerror@gmail.com&item_name=Rtings+Tab+Donation
// @contributionAmount  $1
// @match       https://www.rtings.com/*
// run-at       document-idle

// @downloadURL https://update.greasyfork.org/scripts/508341/Rtings%20Open%20Shopping%20Links%20in%20New%20Tab%20Only.user.js
// @updateURL https://update.greasyfork.org/scripts/508341/Rtings%20Open%20Shopping%20Links%20in%20New%20Tab%20Only.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array of domain patterns to match
    const domainPatterns = [
        'amazon.com',
        'ebay.com',
        'walmart.com',
        'target.com',
        'bestbuy.com',
        'bhphotovideo.com',
        'shop-links.co'
    ];

    function handleClick(event) {
        const link = event.currentTarget;
        if (domainPatterns.some(pattern => link.href.includes(pattern))) {
            event.preventDefault();
            event.stopPropagation();
            window.open(link.href, '_blank', 'noopener,noreferrer');
        }
    }

    function enhanceLinks() {
        const selector = domainPatterns.map(pattern => `a[href*="${pattern}"]`).join(',');
        const links = document.querySelectorAll(`${selector}:not([data-enhanced])`);
        links.forEach(link => {
            link.setAttribute('data-enhanced', 'true');
            link.addEventListener('click', handleClick, true);
        });
    }

    enhanceLinks();

    const observer = new MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.addedNodes.length > 0)) {
            enhanceLinks();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();

