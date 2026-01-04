// ==UserScript==
// @name         Grundo's Cafe - Wheel Sneaky Peek
// @namespace    https://www.grundos.cafe/
// @version      0.1
// @description  Displays wheel results one click earlier
// @author       yon
// @match        *://*.grundos.cafe/*/wheel/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/488699/Grundo%27s%20Cafe%20-%20Wheel%20Sneaky%20Peek.user.js
// @updateURL https://update.greasyfork.org/scripts/488699/Grundo%27s%20Cafe%20-%20Wheel%20Sneaky%20Peek.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let prize = $('div[id="prize-container"]')[0]?.textContent;
    if (prize) {
        let wheelContainer = $('div[id="wheel-container"]')[0];
        if (wheelContainer) {
            wheelContainer.insertAdjacentHTML('afterend', `<div><p>${prize}</p></div>`);
        }
    }
})();