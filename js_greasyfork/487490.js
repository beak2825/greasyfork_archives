// ==UserScript==
// @name         Remove Faction PDF on Advanced Search
// @namespace    microbes.torn.removepdf
// @version      0.1
// @description  Remove faction PDF on search feature.
// @author       You
// @match        https://www.torn.com/page.php?sid=UserList*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487490/Remove%20Faction%20PDF%20on%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/487490/Remove%20Faction%20PDF%20on%20Advanced%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    waitForElementToExist('img[src^="https://factiontags.torn.com"]').then(() => {
        $('img[src^="https://factiontags.torn.com"]').remove();
    });
})();

function waitForElementToExist(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(() => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
        });
    });
}