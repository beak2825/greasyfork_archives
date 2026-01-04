// ==UserScript==
// @name         Sniffies Block House Ads & Chat Ads v4
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Removes “Upgrade to Plus” panels and ad chat rows on sniffies.com and subdomains
// @match        *://sniffies.com/*
// @match        *://*.sniffies.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/534588/Sniffies%20Block%20House%20Ads%20%20Chat%20Ads%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/534588/Sniffies%20Block%20House%20Ads%20%20Chat%20Ads%20v4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeAds(root = document) {
        // 1) remove the custom house-ads component
        root.querySelectorAll('app-house-ads').forEach(el => el.remove());

        // 2) remove any overset DIV with a dynamic ng-tns-c* class
        root.querySelectorAll('div.overset').forEach(div => {
            for (let cls of div.classList) {
                if (/^ng-tns-c/.test(cls)) {
                    div.remove();
                    break;
                }
            }
        });

        // 3) remove the 3-level-up ancestor of any element with Upgrade CTA
        root.querySelectorAll('[aria-label="Upgrade to Sniffies Plus"]').forEach(el => {
            let anc = el;
            for (let i = 0; i < 3 && anc; i++) anc = anc.parentElement;
            if (anc) anc.remove();
        });

        // 4) remove any chat-row marked as an ad
        //    a) by testid sniffiesChatRow
        root.querySelectorAll('tr[data-testid="sniffiesChatRow"]').forEach(el => el.remove());
        //    b) or by aria-label="View Advertisement"
        root.querySelectorAll('[aria-label="View Advertisement"]').forEach(el => {
            const row = el.closest('tr');
            if (row) row.remove();
        });
    }

    // initial cleanup
    removeAds();

    // watch for dynamically injected content
    new MutationObserver(mutations => {
        for (let m of mutations) {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1) removeAds(node);
            });
        }
    }).observe(document.body, { childList: true, subtree: true });

    // periodic safeguard
    setInterval(removeAds, 1000);
})();
