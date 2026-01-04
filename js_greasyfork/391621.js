// ==UserScript==
// @name Canine's Wrinkler Auto-Clicker for Cookie Clicker
// @namespace Cookie
// @include https://orteil.dashnet.org/cookieclicker/
// @include http://orteil.dashnet.org/cookieclicker/
// @version 1.2
// @grant none
// @description Auto Clicks Wrinklers for you in Cookie Clicker
// @downloadURL https://update.greasyfork.org/scripts/391621/Canine%27s%20Wrinkler%20Auto-Clicker%20for%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/391621/Canine%27s%20Wrinkler%20Auto-Clicker%20for%20Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    setInterval(function() { Game.CollectWrinklers(); }, 600000);
})();