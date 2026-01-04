// ==UserScript==
// @name         ReviewClub - Add campaign URL
// @namespace    https://greasyfork.org/en/users/2755-robotoilinc
// @author       RobotOilInc
// @version      0.1.0
// @license      MIT
// @description  Changes the URL for upcoming releases to the actual campaign URL.
// @match        https://reviewclub.com/*/campaigns/upcoming
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reviewclub.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475211/ReviewClub%20-%20Add%20campaign%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/475211/ReviewClub%20-%20Add%20campaign%20URL.meta.js
// ==/UserScript==

(function() {
    'use strict';

    new MutationObserver(function(mutationList, observer) {
        document.querySelectorAll('.campaigns-list-wrapper a.product-name-item').forEach(function(element) {
            const parent = element.closest('div.campaign-list-item');
            if(parent.dataset.docId) {
                element.setAttribute("href", `https://reviewclub.com/campaigns/details/${parent.dataset.docId}`);
            }
        });
    }).observe(document.body, { childList: true, subtree: true });
})();