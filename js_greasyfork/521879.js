// ==UserScript==
// @name         Christmas Town Quick Beer Buy
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Adds the ability to quickly buy beers in Torn Christmas Town by repeatedly hitting enter on your keyboard, rather than by using mouse clicks.
// @author       SmegNight [2523174]
// @match        https://www.torn.com/christmas_town.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521879/Christmas%20Town%20Quick%20Beer%20Buy.user.js
// @updateURL https://update.greasyfork.org/scripts/521879/Christmas%20Town%20Quick%20Beer%20Buy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("keydown", (event) => {
        // Check if the Enter key was pressed
        if (event.key === "Enter") {
            let buyButton = document.querySelector('#shopItem816')?.nextElementSibling?.querySelector('button[class*="buy__"]');
            let yesButton = document.querySelector('div[class*="confirmActions__"]')?.querySelector('a[class*="yes__"]');
            let okayButton = document.querySelector('div[class*="confirmActions__"]')?.querySelector('a[class*="okay__"]');

            if (buyButton) {
                event.preventDefault();
                buyButton.click();
            } else if (yesButton) {
                event.preventDefault();
                yesButton.click();
            } else if (okayButton) {
                event.preventDefault();
                okayButton.click();
            }
        }
    });
})();