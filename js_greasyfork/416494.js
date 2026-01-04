// ==UserScript==
// @name         MasterPiece nr 4
// @namespace    http://tampermonkey.net/
// @version      0.09
// @description  betting script
// @author       Sorte
// @match        https://www.betclic.pt/futebol-s1/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416494/MasterPiece%20nr%204.user.js
// @updateURL https://update.greasyfork.org/scripts/416494/MasterPiece%20nr%204.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){ judge(); }, 1500);

    function judge(){
        var more = document.getElementsByClassName("seeMoreButton prebootFreeze ng-star-inserted");
        if(more.length > 0) more[0].click();

        setTimeout(function(){

            const queryString = window.location.search, params = new URLSearchParams(queryString), paramId = params.get('id'),
                  paramIndex = params.get('index');

            var content = document.getElementsByClassName("oddButtonWrapper prebootFreeze ng-trigger ng-trigger-oddsStateAnimation"),
                aux = -1, size = (content.length > 24)? 24 : 0, obj = parseFloat(localStorage.getItem("obj"));

            for(var j = 3; j < size; j++){

                var odd = parseFloat(content[j].getElementsByClassName("oddValue")[0].textContent.replace(',','.'));

                if( !((content[j].title).localeCompare("Abaixo de 3.5")) ){
                    obj = (isNaN(obj) || obj == 0)? 1 : parseFloat((2.05 / obj).toFixed(2));

                    if(obj == 1){
                       if( odd >= 1.45 ){ aux = j; break; }
                    }else{
                        if( odd >= obj && odd <= (obj+0.20) ){
                            aux = j; break;
                        }
                    }
                }
            }

            // click
            if(aux > -1){
                content[aux].click();
                localStorage.setItem(paramId, "set");

                var dot = parseFloat(localStorage.getItem("obj")), dir = 0;
                dot = (isNaN(dot) || dot == 0)? 1 * parseFloat(content[aux].textContent.replace(',','.')) : dot * parseFloat(content[aux].textContent.replace(',','.'));

                //alert(dot+" | "+obj+" | "+parseFloat(content[aux].textContent.replace(',','.'))+ " | "+typeof dot + " | "+typeof obj );
                if(dot >= 2){ localStorage.setItem("ctr_cl", 0); localStorage.setItem("obj", 0); dir = 1; }
                else{ localStorage.setItem("obj", dot); dir = 1; }

            }else{
                var ctr = parseInt(localStorage.getItem("ctr_cl"));
                if(ctr == 0){ localStorage.setItem("obj", 0); dir = 1; alert("MATH NOT FOUND. DELETE SELECTION AND TRY AGAIN! :("); }
            }

            if(dir) window.location.href = "https://www.betclic.pt/futebol-s1?mainPage=1";
            else window.location.href = "https://www.betclic.pt/futebol-s1?id="+paramId+"&index="+paramIndex+"&mainPage=1";

        }, 1000);
    }



})();