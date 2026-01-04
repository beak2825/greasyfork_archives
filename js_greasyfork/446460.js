// ==UserScript==
// @name         Lunchhub Pickup Selector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Sets the default location for lunchhub when you visit the order page.
// @author       michael.stoltz@derivco.co.za
// @match        https://meals.derivco.com/lunchhub/Order/MultiOrder*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=derivco.com
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/446460/Lunchhub%20Pickup%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/446460/Lunchhub%20Pickup%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set this text to your pickup location from the drop down so it selects it when you visit the page.
    const DESIRED_LOCATION_TEXT = "Bingo/Poker -> Forrest Park";

    function fetchSelector(callback) {
        const select = document.querySelector("select[data-bind^='options: deliveryLocations']");
        if (select) {
            callback(select);
        } else {
            setTimeout(fetchSelector.bind(undefined, callback), 100);
        }
    }

    fetchSelector((select) => {
        const index = Array.from(select.options).findIndex(x => x.innerText === DESIRED_LOCATION_TEXT);
        if (index > -1) {
            select.selectedIndex = index;
            select.dispatchEvent(new Event("change", { bubbles: true }));
        }
    });
})();