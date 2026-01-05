// ==UserScript==
// @name         Mint.com "Everything Else" budgets links fix-up
// @namespace    com.roastedporksteambuns.mint
// @version      0.1
// @description  Make categories under "Everything Else" in Budgets page open correct URL when middle-clicked.
// @author       RoastedPorkSteamBuns
// @match        https://mint.intuit.com/planning.event
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24049/Mintcom%20%22Everything%20Else%22%20budgets%20links%20fix-up.user.js
// @updateURL https://update.greasyfork.org/scripts/24049/Mintcom%20%22Everything%20Else%22%20budgets%20links%20fix-up.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function fixHyperlink(hyperlink) {
        hyperlink.href = hyperlink.href.replace("category=:", "category:");
    }

    function attachEEListMutationObserver(target) {
        var observerConfig = {
            attributes: true,
            attributeFilter: ["href"],
            subtree: true
        };
        var observer = new MutationObserver(function(mutations) {
            var hyperlinks = [];
            mutations.forEach(function(mutation) {
                hyperlinks.push(mutation.target);
            });
            if (hyperlinks.length > 0) {
                // Temporarily disconnect the observer to avoid recursive notification.
                observer.disconnect();
                hyperlinks.forEach(function(hyperlink) {
                    fixHyperlink(hyperlink);
                });
                observer.observe(target, observerConfig);
            }
        });
        observer.observe(target, observerConfig);
    }

    (function waitForEEList() {
        // Wait for Everything Else list to appear.
        var target = document.querySelector('#spendingEE-list-body');
        if (target === null) {
            setTimeout(waitForEEList, 1000);
            return;
        }
        // Fix-up any already added children.
        jQuery(target).find('a').each(function(_, hyperlink) {
            fixHyperlink(hyperlink);
        });
        // Observe for and fix-up any children added in future.
        attachEEListMutationObserver(target);
    })();
})();