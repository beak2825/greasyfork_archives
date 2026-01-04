// ==UserScript==
// @name         anesova gods finger
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  algorithm to bet for you with hight win ratio!
// @author       botclimber
// @match        https://www.betclic.pt/futebol-s1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416007/anesova%20gods%20finger.user.js
// @updateURL https://update.greasyfork.org/scripts/416007/anesova%20gods%20finger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){ judge(); }, 1500);

    function judge(){
        var more = document.getElementsByClassName("seeMoreButton prebootFreeze ng-star-inserted");
        if(more.length > 0) more[0].click();

        setTimeout(function(){
            var content = document.getElementsByClassName("oddButtonWrapper prebootFreeze ng-trigger ng-trigger-oddsStateAnimation"),
                hTeam = content[0].title,aTeam = content[2].title,aux = -1, size = (content.length > 24)? 24 : 0, drawFound0 = 0, drawFound1 = 0, noDrawFound = 0;

            for(var j = 3; j < size; j++){

                var odd = parseFloat(content[j].getElementsByClassName("oddValue")[0].textContent.replace(',','.'));

                if( (!((content[j].title).localeCompare(hTeam+" ou "+aTeam))) && noDrawFound == 0 ){
                    console.log(content[j].title+" | "+odd);
                    noDrawFound = 1;

                    if(odd == 1.18){ aux = j; break; }
                }
                else if( !((content[j].title).localeCompare(hTeam+" ou empate")) && drawFound0 == 0 ){
                    console.log(content[j].title+" | "+odd);
                    drawFound0 = 1;

                    if(odd >= 1.16 && odd <= 1.19){ aux = j; break; }
                }
                else if( !((content[j].title).localeCompare(aTeam+" ou empate")) && drawFound1 == 0 ){
                    console.log(content[j].title+" | "+odd);
                    drawFound1 = 1;

                    if(odd >= 1.16 && odd <= 1.19){ aux = j; break; }
                }
                else if(odd > 1.04 && odd < 1.11 /*&& (content[j].title).localeCompare(hTeam+" ou empate") && (content[j].title).localeCompare(aTeam+" ou empate") && (content[j].title).localeCompare(hTeam+" ou "+aTeam)*/){
                    aux = (aux == -1)? j :(odd < parseFloat(content[aux].textContent.replace(',','.')))? j : aux;
                }
            }

            // click
            if(aux > -1){
                content[aux].click();
                var dot = localStorage.getItem("dot");
                dot = (!dot)? 1 : dot;

                dot = (dot * parseFloat(content[aux].textContent.replace(',','.')).toFixed(2) ).toFixed(2);

                if(dot >= 1.20){ localStorage.setItem("ctr_cl", 0); localStorage.setItem("dot", 1); }
                else localStorage.setItem("dot", dot);

            }else{
                var ctr = parseInt(localStorage.getItem("ctr_cl"));
                ctr = (ctr * 1) + 1;
                localStorage.setItem("ctr_cl", ctr);
            }

            window.location.href = "https://www.betclic.pt/futebol-s1";
        }, 1000);
    }

    // Your code here...
})();