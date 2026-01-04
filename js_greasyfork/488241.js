// ==UserScript==
// @name         GC Quick Vending Machines
// @namespace    http://devipotato.net/
// @version      2
// @description  Auto-fills selections randomly at the Nerkmid Machine, Neocola Machine, and Ice Cream Cart at grundos.cafe.
// @author       DeviPotato (Devi on GC, devi on Discord)
// @license      MIT
// @match        https://www.grundos.cafe/vending/select/
// @match        https://www.grundos.cafe/winter/icecream/
// @match        https://www.grundos.cafe/moon/neocola/select/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488241/GC%20Quick%20Vending%20Machines.user.js
// @updateURL https://update.greasyfork.org/scripts/488241/GC%20Quick%20Vending%20Machines.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }
    let dropdowns = document.querySelectorAll("#page_content .select-wrapper select");

    if(dropdowns.length>0) {
        dropdowns.forEach(dropdown => {
            dropdown.selectedIndex = getRandomInt(dropdown.length-1)+1;
        })
        dropdowns[0].selectedIndex = 1;
    }
})();