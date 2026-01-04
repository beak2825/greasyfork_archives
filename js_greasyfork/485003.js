// ==UserScript==
// @name         Modify Subscription Section
// @namespace    http://your-namespace.org/
// @version      0.1
// @description  Modify text in subscription settings
// @author       You
// @match        https://poe.com/settings*  // Substitua pela URL real do site
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/485003/Modify%20Subscription%20Section.user.js
// @updateURL https://update.greasyfork.org/scripts/485003/Modify%20Subscription%20Section.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Find the element with the specified class name
    var subscriptionSection = document.querySelector('.SettingsSubscriptionSection_sectionBubble__WGioU');

    if (subscriptionSection) {
        // Find the element containing the text "Todas as outras mensagens"
        var titleElement = subscriptionSection.querySelector('.SettingsSubscriptionSection_title__CVhE_');

        if (titleElement) {
            // Replace the text with "200 Todas as outras mensagens"
            titleElement.textContent = "200 Todas as outras mensagens";
        }
    }
})();

