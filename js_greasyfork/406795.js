// ==UserScript==
// @name         Facebook Ad Blocker (johanb)
// @version      0.20200710.1
// @description  Remove all Ads from Facebook
// @author       johanb
// @match        https://*.facebook.com/*
// @match        https://*.fbcdn.net/*
// @grant        none
// @namespace https://greasyfork.org/users/126569
// @downloadURL https://update.greasyfork.org/scripts/406795/Facebook%20Ad%20Blocker%20%28johanb%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406795/Facebook%20Ad%20Blocker%20%28johanb%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(() => {
        document.querySelectorAll('div[data-pagelet^="FeedUnit_"]').forEach(div => {
            div.querySelectorAll('span').forEach(span => {
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element by starting with "Sponsored".');
                    div.remove();
                    return;
                }
            });

            div.querySelectorAll('b[style="display: none;"]').forEach(b => {
                let span = b.closest('span');
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element by detecting obfuscation element.');
                    div.remove();
                    return;
                }
            });
        });
    });

    observer.observe(document.documentElement, {
        attributes: false,
        childList: true,
        subtree: true,
    });
})();