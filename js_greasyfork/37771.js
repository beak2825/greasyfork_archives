// ==UserScript==
// @name         UP CoinBrawl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Yann Samson
// @match        https://www.coinbrawl.com/character
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37771/UP%20CoinBrawl.user.js
// @updateURL https://update.greasyfork.org/scripts/37771/UP%20CoinBrawl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(function() {
        function up(choix){
            if (choix=='def')
            {
                $.get("https://www.coinbrawl.com/upgrades/defense");
            }
            else if(choix == 'att'){
                $.get("https://www.coinbrawl.com/upgrades/attack");
            }
            else
            {
                $.get("https://www.coinbrawl.com/upgrades/maximum_tokens");
            }

        }
        $(".stats-table").prepend("&nbsp;&nbsp;<button class='btn btn-success' id='up-def'>boost défense</button><br/><br/>");
        $(".stats-table").prepend("&nbsp;&nbsp;<button class='btn btn-success' id='up-ata'>boost attaque</button><br/><br/>");
        $(".stats-table").prepend("&nbsp;&nbsp;<button class='btn btn-success' id='up-tok'>boost token</button><br/><br/>");
        $("#up-def").click(function(){
            setInterval(up,1500,"def");
        });
        $("#up-ata").click(function(){
            setInterval(up,1500,"att");
        });
        $("#up-tok").click(function(){
            setInterval(up,1500,"tok");
        });
    });

})();
