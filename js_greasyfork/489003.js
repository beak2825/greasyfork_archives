// ==UserScript==
// @name         GC Quick Scratchcards
// @namespace    http://devipotato.net/
// @version      2
// @description  Auto-selects a scratchcard at kiosks at grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/halloween/kiosk/
// @match        https://www.grundos.cafe/halloween/purchase-scratchcard/
// @match        https://www.grundos.cafe/desert/kiosk/
// @match        https://www.grundos.cafe/desert/purchase-scratchcard/
// @match        https://www.grundos.cafe/winter/kiosk/
// @match        https://www.grundos.cafe/winter/purchase-scratchcard/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/489003/GC%20Quick%20Scratchcards.user.js
// @updateURL https://update.greasyfork.org/scripts/489003/GC%20Quick%20Scratchcards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let dropdown = document.querySelector('select[name="card"]');
    if(dropdown) {
        dropdown.selectedIndex = 1;
    }
})();