// ==UserScript==
// @name         Change x.com to twitter.com
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Automatically change x.com to twitter.com in links and their appearance, except for domains ending with x.com
// @author       AndreTelevise
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495346/Change%20xcom%20to%20twittercom.user.js
// @updateURL https://update.greasyfork.org/scripts/495346/Change%20xcom%20to%20twittercom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to change links and their appearance
    function changeLinks() {
        let links = document.querySelectorAll('a[href*="x.com"]');
        links.forEach(link => {
            if (!/[^.]+\.[^.]*x\.com/.test(link.href)) { // Exclude domains ending with x.com
                link.href = link.href.replace('x.com', 'twitter.com');
                link.textContent = link.textContent.replace('x.com', 'twitter.com');
            }
        });
    }

    // Run the function initially
    changeLinks();

    // Observe changes in the document
    const observer = new MutationObserver(changeLinks);
    observer.observe(document.body, { childList: true, subtree: true });
})();