// ==UserScript==
// @name         OGame -- Green Text for Overmarked Pop/Food Resources
// @namespace    https://openuserjs.org/users/AstralCodex
// @version      0.1.1
// @description  Change text color to green for specific elements with 'overmark' class
// @author       AstralCodex
// @match        https://*.ogame.gameforge.com/game/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/486657/OGame%20--%20Green%20Text%20for%20Overmarked%20PopFood%20Resources.user.js
// @updateURL https://update.greasyfork.org/scripts/486657/OGame%20--%20Green%20Text%20for%20Overmarked%20PopFood%20Resources.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add CSS rule
    function addCustomStyle() {
        GM_addStyle(`
            #resourcesbarcomponent #resources_population.overmark,
            #resourcesbarcomponent #resources_food.overmark {
                color: green !important;
            }
        `);
    }

    // Add style initially
    addCustomStyle();
})();