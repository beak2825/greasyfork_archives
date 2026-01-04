// ==UserScript==
// @name         Subeta Shop Traveller
// @description  Right-click on page to travel to different shops.
// @version      1
// @author       Unknown
// @match        *://subeta.net/shop.php?shop*
// @grant        none
// @icon         https://subeta.net/favicon.ico
// @icon64       https://img.subeta.net/items/bottle_apothecary_07.gif
// @namespace https://greasyfork.org/users/133026
// @downloadURL https://update.greasyfork.org/scripts/30645/Subeta%20Shop%20Traveller.user.js
// @updateURL https://update.greasyfork.org/scripts/30645/Subeta%20Shop%20Traveller.meta.js
// ==/UserScript==

window.oncontextmenu = function ()
{
    var items = [32,41,36,17,20,6,26,9,5,19,47,11,31,2,22,14,46,23,25,21,12,44,29,49,40,27,34,28,37,24,45,39,42,4,16,30];
        var item = items[Math.floor(Math.random()*items.length)];
        var shoplink = "https://subeta.net/shop.php?shopid=" + item;
    window.location.href = shoplink
    return false;     // cancel default menu
}