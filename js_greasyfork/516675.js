// ==UserScript==
// @name         Automatisch "Mehr" sehen
// @namespace    http://tampermonkey.net/
// @version      2024-11-10
// @description  Klickt automatisch alle "Mehr" links im Feed.
// @author       You
// @match        https://nebenan.de/feed*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nebenan.de
// @grant        none
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/516675/Automatisch%20%22Mehr%22%20sehen.user.js
// @updateURL https://update.greasyfork.org/scripts/516675/Automatisch%20%22Mehr%22%20sehen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var observer = new MutationObserver((mutations, observer) => {
        mutations.forEach(m => {
            if(m.addedNodes) {
                m.addedNodes.forEach(n => {
                    if(n.querySelectorAll) {
                        n.querySelectorAll("span[data-testid=c-expandable_rich_content_more]").forEach(s => s.click())
                    }
                })
            }
        });
    });

    observer.observe(document, {
        subtree: true,
        childList: true
    });
})();