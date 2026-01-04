// ==UserScript==
// @name         above 0.5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       botclimber
// @match        https://www.betclic.pt/futebol-s1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416357/above%2005.user.js
// @updateURL https://update.greasyfork.org/scripts/416357/above%2005.meta.js
// ==/UserScript==

(function() {
    'use strict';

        setTimeout(function(){ judge(); }, 1500);

    function judge(){
        var more = document.getElementsByClassName("seeMoreButton prebootFreeze ng-star-inserted");
        if(more.length > 0) more[0].click();

        setTimeout(function(){
            var content = document.getElementsByClassName("oddButtonWrapper prebootFreeze ng-trigger ng-trigger-oddsStateAnimation"),aux = -1, size = (content.length > 24)? 24 : 0;

            for(var j = 3; j < size; j++){

                var odd = parseFloat(content[j].getElementsByClassName("oddValue")[0].textContent.replace(',','.'));

                if( !((content[j].title).localeCompare("Acima de 0.5")) ){

                    //console.log(content[j].title+" | "+odd+"| "+content[j+1].title+" | "+odd1);
                    if( (odd > 1.04 && odd < 1.11)){ aux = j; break;}

                }
            }

            // click
            if(aux > -1){
                content[aux].click();
                var dot = localStorage.getItem("dot");
                dot = (!dot)? 1 : dot;

                dot = (dot * parseFloat(content[aux].textContent.replace(',','.')).toFixed(2) ).toFixed(2);

                if(dot >= 2.00){ localStorage.setItem("ctr_cl", 0); localStorage.setItem("dot", 1); }
                else localStorage.setItem("dot", dot);

            }else{
                var ctr = parseInt(localStorage.getItem("ctr_cl"));
                ctr = (ctr * 1) + 1;
                localStorage.setItem("ctr_cl", ctr);
            }

            window.location.href = "https://www.betclic.pt/futebol-s1";
        }, 1000);
    }

})();