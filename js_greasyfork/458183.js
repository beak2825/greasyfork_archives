// ==UserScript==
// @name         PurePC Hide Partner Ads
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Removes all sponsored news (basically ads) from home page.
// @author       grzegorzjudas
// @match        https://www.purepc.pl/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=purepc.pl
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458183/PurePC%20Hide%20Partner%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/458183/PurePC%20Hide%20Partner%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.querySelectorAll('.latest_items > section')).forEach((item) => {
        const isAd = item.querySelector('.hcat').innerText === 'Akcja partnerska';

        if (isAd) {
            item.remove();
        }
    });
})();