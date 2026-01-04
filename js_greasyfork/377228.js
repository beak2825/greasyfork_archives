// ==UserScript==
// @name         Change stinger in air battles
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Do not allow fighting with stingers - when the battle is loaded, the stinger is switched to fight without stingers
// @author       You
// @match        https://www.erepublik.com/en/military/battlefield/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377228/Change%20stinger%20in%20air%20battles.user.js
// @updateURL https://update.greasyfork.org/scripts/377228/Change%20stinger%20in%20air%20battles.meta.js
// ==/UserScript==

var $ = jQuery;

(function() {
    var weaponLink = $("li.q10 img").attr("src");
    if (weaponLink != "/images/icons/industry/2/q10.png")
    {
        $(".weapon_link")[0].click();
    }
})();