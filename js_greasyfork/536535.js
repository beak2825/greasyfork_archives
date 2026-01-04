// ==UserScript==
// @name         Geni Hide Upsell
// @namespace    4525639+rautava@users.noreply.github.com
// @version      1.0
// @description  Hides the Geni.com upsell for Pro membership
// @author       Tommi Rautava
// @license      CC0-1.0
// @match        https://www.geni.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=geni.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536535/Geni%20Hide%20Upsell.user.js
// @updateURL https://update.greasyfork.org/scripts/536535/Geni%20Hide%20Upsell.meta.js
// ==/UserScript==

let elementIds = [
  "expiring_pro_upsell",
];

(function() {
    'use strict';

    elementIds.forEach(function (element) {
        let input = document.querySelector('div[id="' + element + '"]');

        if (input) {
            input.style.display = 'none';
        }
    })
})();
