// ==UserScript==
// @name Canine's Golden Cookie Auto-Clicker for Cookie Clicker
// @namespace Cookie
// @include https://orteil.dashnet.org/cookieclicker/
// @include http://orteil.dashnet.org/cookieclicker/
// @version 1.1
// @grant none
// @description Auto Clicks Golden Cookies for you in Cookie Clicker
// @downloadURL https://update.greasyfork.org/scripts/391570/Canine%27s%20Golden%20Cookie%20Auto-Clicker%20for%20Cookie%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/391570/Canine%27s%20Golden%20Cookie%20Auto-Clicker%20for%20Cookie%20Clicker.meta.js
// ==/UserScript==

(function() {
    function ClickGoldenCookie() {
        for( var i in Game.shimmers ) {
            var s = Game.shimmers[i];
            if (s.type == "golden") {
                s.pop();
            }
        }
    }
    setInterval(function() {
        for( var i in Game.shimmers ) {
            var s = Game.shimmers[i];
            if( s.type == "golden" )
                s.pop();
        }
    }, 100);
})();