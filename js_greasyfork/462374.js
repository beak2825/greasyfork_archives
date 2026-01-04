// ==UserScript==
// @name         Replace EN tooltip on eorzeacollection with JP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace EN tooltip on eorzeacollection with JP by replace na.finalfantasyxiv.com with jp.finalfantasyxiv.com in the anchor
// @author       GPT-4
// @match        https://ffxiv.eorzeacollection.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462374/Replace%20EN%20tooltip%20on%20eorzeacollection%20with%20JP.user.js
// @updateURL https://update.greasyfork.org/scripts/462374/Replace%20EN%20tooltip%20on%20eorzeacollection%20with%20JP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceURLs() {
        const links = document.querySelectorAll('a[href*="https://na.finalfantasyxiv.com"]');

        for (let link of links) {
            link.href = link.href.replace('https://na.finalfantasyxiv.com', 'https://jp.finalfantasyxiv.com');
        }
    }

    replaceURLs();
    new MutationObserver(replaceURLs).observe(document, {childList: true, subtree: true});
})();
