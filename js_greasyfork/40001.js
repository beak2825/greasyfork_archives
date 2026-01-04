// ==UserScript==
// @name         MH Golden Egg Identifier
// @namespace    https://greasyfork.org/en/scripts/40001-mh-golden-egg-identifier
// @version      0.2
// @description  MH Golden Egg 2018 Spring Egg Hunt identifier
// @author       Rani
// @include      http*://www.mousehuntgame.com/inventory.php?tab=special
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40001/MH%20Golden%20Egg%20Identifier.user.js
// @updateURL https://update.greasyfork.org/scripts/40001/MH%20Golden%20Egg%20Identifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('[data-item-type="2018_spring_hunt_egg_10"]')[0].style.backgroundColor = "yellow";
})();