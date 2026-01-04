// ==UserScript==
// @name         VolKno 2nd part
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  auto click emjo 
// @author       Bboy tech
// @match        https://volkno.com/media*
// @inclide      https://volkno.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381221/VolKno%202nd%20part.user.js
// @updateURL https://update.greasyfork.org/scripts/381221/VolKno%202nd%20part.meta.js
// ==/UserScript==

(function() {
    var claimTimer = setInterval (function() {claim(); }, Math.floor(Math.random() * 2000) + 5000);

    function claim(){
       var x = Math.floor((Math.random() * 3) + 1);
            if (x == 1)
            {
                document.getElementsByClassName("sprite sprite-omg")[0].click();
            }
            else if (x == 2)
            {
                document.getElementsByClassName("sprite sprite-excited")[0].click();
            }
            else if (x == 3)
            {
                document.getElementsByClassName("sprite sprite-joy")[0].click();
            }
    }
})();