// ==UserScript==
// @name         Cookie Clicker Auto-Clicker
// @namespace    https://github.com/SuperPommeDeTerre
// @version      1.0
// @description  Cookie Clicker Auto click
// @author       aoh72931
// @match        http://cafe-capy.net/cookieclicker/
// @match        http://orteil.dashnet.org/cookieclicker/
// @grant        aoh72931
// @downloadURL https://update.greasyfork.org/scripts/27929/Cookie%20Clicker%20Auto-Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/27929/Cookie%20Clicker%20Auto-Clicker.meta.js
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
    setInterval(function() {Game.ClickCookie(); }, 0.1);
    setInterval(function() {
        for( var i in Game.shimmers ) {
            var s = Game.shimmers[i];
            if( s.type == "golden" )
                s.pop();
        }
    }, 100);
})();