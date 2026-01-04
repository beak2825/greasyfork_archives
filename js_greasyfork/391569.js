// ==UserScript==
// @name Canine's Auto-Clicker for Cookie Clicker
// @namespace Cookie
// @include https://orteil.dashnet.org/cookieclicker/
// @include http://orteil.dashnet.org/cookieclicker/
// @version 1.3
// @grant none
// @description Auto Clicks for you in Cookie Clicker
// @downloadURL https://update.greasyfork.org/scripts/391569/Canine%27s%20Auto-Clicker%20for%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/391569/Canine%27s%20Auto-Clicker%20for%20Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    setInterval(function() {Game.ClickCookie(); }, 0.00000001);
})();