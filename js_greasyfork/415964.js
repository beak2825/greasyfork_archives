// ==UserScript==
// @name         anesova dads god
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  script for live bets
// @author       botclimber
// @match        https://www.betclic.pt/live
// @require      https://cdnjs.cloudflare.com/ajax/libs/keypress/2.1.5/keypress.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415964/anesova%20dads%20god.user.js
// @updateURL https://update.greasyfork.org/scripts/415964/anesova%20dads%20god.meta.js
// ==/UserScript==

(function() {
    'use strict';

    localStorage.setItem("ctr_cl", 0);
    setInterval(function(){ core(); }, 5000);

    function core(){
        var odds, ids, lGames = document.getElementsByClassName("betBox_wrapperOdds"), aux, ctr = localStorage.getItem("ctr");

        for(var i = 0; i < lGames.length && ctr > 0; i++){

            aux = -1;
            odds = lGames[i].getElementsByClassName('oddValue ng-star-inserted');
            ids = lGames[i].getElementsByClassName('oddButtonWrapper prebootFreeze ng-trigger ng-trigger-oddsStateAnimation');

            for(var j = 0; j < odds.length; j++){

                var odd = parseFloat(odds[j].textContent.replace(',','.'));

                if(odd < 1.20){
                    aux = (aux == -1)? j :(odd > parseFloat(odds[aux].textContent.replace(',','.')))? j : aux;
                }
            }

            // click
            if(aux > -1){

                var bet = localStorage.getItem(ids[aux].id);

                if(bet == undefined){
                    localStorage.setItem(ids[aux].id, "Game nr: "+i);
                    document.getElementById(ids[aux].id).click();
                    ctr--;
                }
            }
        }
        localStorage.setItem("ctr", ctr);

        document.getElementsByClassName("bettingslip_footerContentRowWinnings")[0].innerHTML = "<button type'button' onclick=' localStorage.setItem(\"ctr\", 5); '>5</button>";
        document.getElementsByClassName("bettingslip_footerContentRowWinnings")[0].innerHTML += "<button type'button' onclick=' localStorage.setItem(\"ctr\", 10); '>10</button>";
        document.getElementsByClassName("bettingslip_footerContentRowWinnings")[0].innerHTML += "<button type'button' onclick=' localStorage.setItem(\"ctr\", 20); '>20</button>";
        document.getElementsByClassName("bettingslip_footerContentRowWinnings")[0].innerHTML += "<button type'button' onclick=' localStorage.setItem(\"ctr\", parseInt(localStorage.getItem(\"ctr\")+1)); '>+</button>";
    }


})();