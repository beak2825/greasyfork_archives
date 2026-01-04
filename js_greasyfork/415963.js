// ==UserScript==
// @name         anesova money counter
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  cal diff between profit|loss
// @author       botclimber
// @match        https://www.betclic.pt/asminhasapostas
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/415963/anesova%20money%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/415963/anesova%20money%20counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){ run(); }, 5000);

    function run(){
        var pg = document.getElementsByClassName("header_logo prebootFreeze")[0];
        pg.innerHTML = "";

        var aData = document.getElementsByClassName("cardBet is-combined"), profit = 0, loss = 0;

        for(var i = 0; i < aData.length; i++){
            var green = aData[i].getElementsByClassName("badge_label"), spent = parseFloat(aData[i].getElementsByClassName("summaryBets_listItemValue")[0].textContent.replace(",","."));

            if(green.length > 0){
                profit = ( ((1 * profit) + (1 * (parseFloat(aData[i].getElementsByClassName("odd")[0].textContent.replace(",","."))*spent).toFixed(2))) - spent).toFixed(2);

            }else{
                loss = ((1 * loss)+(1 * spent)).toFixed(2);

            }
        }

        pg.innerHTML += "<span style='color:white;font-size:12pt;'>Profit: <b style='color:#5fc626;'>"+profit+"</b> | </span>";
        pg.innerHTML += "<span style='color:white;font-size:12pt;'>Loss: <b style='color:orange;'>"+loss+"</b></span>";
    }
})();