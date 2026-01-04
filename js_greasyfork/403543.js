// ==UserScript==
// @name         Melvor Auto Leave Combat
// @version      1.0
// @description  Automatically leaves combat if no food is equipped.
// @author       Zek (credit to Aldous Watts: https://addons.mozilla.org/en-US/firefox/addon/scripting-engine-melvor-idle/)
// @match        https://*.melvoridle.com/*
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/403543/Melvor%20Auto%20Leave%20Combat.user.js
// @updateURL https://update.greasyfork.org/scripts/403543/Melvor%20Auto%20Leave%20Combat.meta.js
// ==/UserScript==

this.autoLeaveCombat = setInterval(() => {
    if (window.isInCombat && window.equippedFood[window.currentCombatFood].qty < 1) {
        window.stopCombat(false, true, true);
    }
}, 500);
