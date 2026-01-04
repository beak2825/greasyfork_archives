// ==UserScript==
// @name         Doge Miner Auto click
// @namespace    https://github.com/SuperPommeDeTerre
// @version      1.0
// @description  Doge Miner
// @author       aoh72931
// @match        hhttps://dogeminer2.com/
// @match        https://dogeminer2.com/
// @grant        aoh72931
// @downloadURL https://update.greasyfork.org/scripts/426417/Doge%20Miner%20Auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/426417/Doge%20Miner%20Auto%20click.meta.js
// ==/UserScript==
 
(function() {
    function ClickRock() {
        for( var i in Game.shimmers ) {
            var s = Game.shimmers[i];
            if (s.type == "rock") {
                s.pop();
            }
        }
    }
    setInterval(function() {Game.DogeMiner(); }, 0.1);
    setInterval(function() {
        for( var i in Game.shimmers ) {
            var s = Game.shimmers[i];
            if( s.type == "golden" )
                s.pop();
        }
    }, 100);
})();