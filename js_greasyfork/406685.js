// ==UserScript==
// @name         Facebook ad blocker
// @namespace    https://wiki.gslin.org/wiki/FacebookAdBlocker
// @version      0.20211227.0
// @description  Remove all ad from Facebook
// @author       Gea-Suan Lin <gslin@gslin.org>
// @match        https://www.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/406685/Facebook%20ad%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/406685/Facebook%20ad%20blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = new MutationObserver(() => {
        document.querySelectorAll('div[data-pagelet^="FeedUnit_"], div[id^="hyperfeed_story_id_"], div[role="article"]').forEach(div => {
            // aria-label="Sponsored"
            div.querySelectorAll('div[aria-label="Sponsored"]').forEach(span => {
                console.info('Remove a Facebook ad element by aria-label="Sponsored".');
                div.innerHTML = '<p>Post hidden.  Rule: aria-label="Sponsored"</p>';
                return;
            });

            // <span>Sponsored
            div.querySelectorAll('span').forEach(span => {
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element by starting with "Sponsored".');
                    div.innerHTML = '<p>Post hidden.  Rule: span[innerText^="Sponsored"]</p>';
                    return;
                }
            });

            div.querySelectorAll('b[style="display: none;"]').forEach(b => {
                let span = b.closest('span');
                if (span.innerText.startsWith('Sponsored')) {
                    console.info('Remove a Facebook ad element by detecting obfuscation elements.');
                    div.innerHTML = '<p>Post hidden.  Rule: b span[innerText^="Sponsored"]</p>';
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
