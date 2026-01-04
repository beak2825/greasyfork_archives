// ==UserScript==
// @name         Ouo.io Link Replacer
// @namespace    https://github.com/kinkuroai/ouoio-link-replacer/
// @version      1.1
// @description  Replaces ouo.io links with ouo.press
// @author       Kinkuro
// @match        *://*/*
// @grant        GM_addValueChangeListener
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531825/Ouoio%20Link%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/531825/Ouoio%20Link%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addValueChangeListener("dummy", () => {});

    function replaceOuoLinks() {
        const links = document.querySelectorAll('a[href*="ouo.io"]');

        links.forEach(link => {
            link.href = link.href.replace('ouo.io', 'ouo.press');
        });
    }

    replaceOuoLinks();

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                replaceOuoLinks();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log("Ouo.io to Ouo.press link replacer script is running.");
})();