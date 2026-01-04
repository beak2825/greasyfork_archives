// ==UserScript==
// @name         YouTube - automatically expand subscription list
// @description  Automatically click the "Show More" subscriptions button in the side bar
// @namespace    https://greasyfork.org/en/scripts/367774-youtube-automatically-expand-subscription-list
// @version      0.1.7
// @author       Valacar
// @match        https://www.youtube.com/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/367774/YouTube%20-%20automatically%20expand%20subscription%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/367774/YouTube%20-%20automatically%20expand%20subscription%20list.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUGGING = 0;
    const debugLog = DEBUGGING ? console.log : function(){};
    const debugAssert = DEBUGGING ? console.assert : function(){};

    window.addEventListener("loadstart", expandSubscriptions, true);

    function expandSubscriptions() {
        const expanderItems = document.querySelectorAll("#expander-item");
        debugLog("----------");
        debugLog("::: Found %d expander-items", expanderItems.length);
        for (let expander of expanderItems) {
            debugAssert(expander.parentNode);
            debugAssert(expander.parentNode.previousSibling);
            const lastSubscription = expander.parentNode.previousSibling;
            const feedItem = lastSubscription.querySelectorAll(
                'a[href^="/feed/subscriptions/"],a[href^="/channel/"],a[href^="/user/"],a[href^="/c/"],a[href^="/@"]'
            );
            if (feedItem.length) {
                debugLog("::: Found a feed subscription link in section",
                         expander.parentNode.closest("ytd-guide-section-renderer")
                        );
                const displayProperty = window.getComputedStyle(expander).getPropertyValue("display");
                if (displayProperty === "block") {
                    debugLog("::: Expander display property = ", displayProperty);
                    debugLog("::: %cClicking expander",
                             "background: green; color: white; font-weight: bold;"
                            );
                    expander.click();
                    window.removeEventListener("loadstart", expandSubscriptions, true);
                    return;
                } else {
                    debugLog("::: Expander display property = ", displayProperty);
                    debugLog("::: %cNot clicking since it appears to be expanded.",
                             "background: yellow; color: #000; font-weight: bold;"
                            );
                }
            } else {
                debugLog("::: No subscription feed link in section",
                         expander.parentNode.closest("ytd-guide-section-renderer")
                        );
            }
        }
    }

    const observer = new MutationObserver(mutations => {
        if (document.querySelector('ytd-guide-section-renderer')) {
            expandSubscriptions();
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();