// ==UserScript==
// @name         channel watcher
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make money
// @author       bboytech
// @match        https://www.channel-watcher.com/syndicationcontrol
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392864/channel%20watcher.user.js
// @updateURL https://update.greasyfork.org/scripts/392864/channel%20watcher.meta.js
// ==/UserScript==

(function() {
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 25000) + 27000);
    //var claimbTimer = setInterval (function() {claimb(); }, Math.floor(Math.random() * 5000) + 6000);
    //var refreshTimer = setInterval (function() {refresh(); }, Math.floor(Math.random() * 6000) + 7000);
    function claim(){
        var x = Math.floor((Math.random() * 3) + 1);
            if (x == 1)
            {
                document.getElementsByClassName("far fa-frown red_outline ")[0].click();
            }
            else if (x == 2)
            {
                document.getElementsByClassName("far fa-meh yellow_outline")[0].click();
            }
            else if (x == 3)
            {
                document.getElementsByClassName("far fa-smile green_outline")[0].click();
            }
    }
})();