// ==UserScript==
// @name         bot pick
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  pick odds in plus & less goals with odd between 2.00 - 3.00. Bet all goals less one.
// @author       You
// @match        https://www.betclic.pt/futebol-s1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416358/bot%20pick.user.js
// @updateURL https://update.greasyfork.org/scripts/416358/bot%20pick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){ judge(); }, 1500);

    function judge(){
        var more = document.getElementsByClassName("seeMoreButton prebootFreeze ng-star-inserted");
        if(more.length > 0) more[0].click();

        setTimeout(function(){
            var content = document.getElementsByClassName("oddButtonWrapper prebootFreeze ng-trigger ng-trigger-oddsStateAnimation"), size = (content.length > 24)? 24 : 0,
                aux = -1, i = 0;

            for(var j = 3; j < size; j++){

                var odd = parseFloat(content[j].getElementsByClassName("oddValue")[0].textContent.replace(',','.')), odd1 = parseFloat(content[j+1].getElementsByClassName("oddValue")[0].textContent.replace(',','.'));

                if( !((content[j].title).localeCompare("Abaixo de "+i+".5")) ){

                    //console.log(content[j].title+" | "+odd+"| "+content[j+1].title+" | "+odd1);
                    if( (odd > 2.00 && odd < 3.00) && ( odd1 > 2.00 && odd1 < 3.00) ){ aux = j; break;}
                    i++;
                }

            }

            // click
            if(aux > -1){
                content[aux].click();
                content[aux+1].click();
            }

            window.location.href = "https://www.betclic.pt/futebol-s1";
        }, 1000);
    }
    // Your code here...
})();