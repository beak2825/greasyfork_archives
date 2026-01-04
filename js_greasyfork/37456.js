// ==UserScript==
// @name         MouseHunt Auto Horn, Super Sweet and Simple Solution
// @namespace    ??
// @version      2.2
// @description  SSSS horner
// @author       MH Devs Rulez
// @include      https://www.mousehuntgame.com/
// @include      http://www.mousehuntgame.com/
// @include      https://www.mousehuntgame.com/index.php
// @include      http://www.mousehuntgame.com/index.php
// @include      https://www.mousehuntgame.com/camp.php
// @include      http://www.mousehuntgame.com/camp.php
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37456/MouseHunt%20Auto%20Horn%2C%20Super%20Sweet%20and%20Simple%20Solution.user.js
// @updateURL https://update.greasyfork.org/scripts/37456/MouseHunt%20Auto%20Horn%2C%20Super%20Sweet%20and%20Simple%20Solution.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.setInterval(function() {check_horn();}, 41 * 1000);

    function check_horn() {
        var at_camp = document.URL == "https://www.mousehuntgame.com/" ||
                      document.URL == "http://www.mousehuntgame.com/" ||
                      document.URL == "https://www.mousehuntgame.com" ||
                      document.URL == "http://www.mousehuntgame.com" ||
                      document.URL == "https://www.mousehuntgame.com/index.php" ||
                      document.URL == "http://www.mousehuntgame.com/index.php" ||
                      document.URL == "https://www.mousehuntgame.com/camp.php" ||
                      document.URL == "http://www.mousehuntgame.com/camp.php" ;
        var king_absent = document.getElementsByClassName("mousehuntPage-puzzle-formContainer").length < 1;

        var horn_ready = document.getElementsByClassName("hornReady").length > 0;



        if (at_camp && king_absent && horn_ready)
        {
            var d = new Date();
            console.log("hunting at " + d);
            var h = document.getElementsByClassName("mousehuntHud-huntersHorn");
            if (h[0] != undefined)
                h[0].click();
        }
    }

})();