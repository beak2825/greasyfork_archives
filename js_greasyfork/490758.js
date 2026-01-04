// ==UserScript==
// @name         Torn Combat Content Remover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Remove unwanted images and div elements in Torn combat page
// @author       ErrorNullTag
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @grant        none
// @license      GPU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/490758/Torn%20Combat%20Content%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/490758/Torn%20Combat%20Content%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeUnwantedContent() {
        const unwantedElements = document.querySelectorAll('img[src^="/images/"], div[class*="model"]');

        for (let elem of unwantedElements) {
            elem.parentNode.removeChild(elem);
        }
    }

    new MutationObserver(removeUnwantedContent).observe(document.body, {
        childList: true,
        subtree: true
    });
})();