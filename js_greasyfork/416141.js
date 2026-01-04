// ==UserScript==
// @name         gods thought
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  try to take over the world!
// @author       botclimber
// @match        https://www.betclic.pt/asminhasapostas
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416141/gods%20thought.user.js
// @updateURL https://update.greasyfork.org/scripts/416141/gods%20thought.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){ run(); }, 5000);

    function run(){
        var data = document.getElementsByClassName("cardBet_scoreboardMarket is-ended"), ctr_draw = 0, ctr_noDraw = 0, draw = 0, noDraw = 0,
            oddDraws = [], oddNoDraws = [];

        for(var i = 0; i < data.length; i++){
            var hTeam = (data[i].getElementsByClassName("event_competitionTeam")[0].getElementsByTagName("span")[0].textContent), hTeamDraw, aTeamDraw, ha,
                aTeam = data[i].getElementsByClassName("event_competitionTeam")[1].getElementsByTagName("span")[0].textContent,
                type = data[i].getElementsByClassName("marketBets_label")[0].textContent,// resultado duplo
                result = data[i].getElementsByClassName("marketBets_value is-won"), rContent, // se > 0 ganhou
                odd = parseFloat(data[i].getElementsByClassName("marketBets_odd")[0].textContent.split(" ")[20].replace(",",".")).toFixed(2); // odd

            if(result.length > 0 && !(type.localeCompare("Resultado duplo")) ){
                rContent = (result[0].getElementsByClassName("ellipsis")[0].textContent).replace(" ","");

                hTeamDraw = "\n               "+hTeam+" ou empate\n            ";
                aTeamDraw = "\n               "+aTeam+" ou empate\n            ";
                ha = "\n               "+hTeam+" ou "+aTeam+"\n            ";

                if( !(hTeamDraw.localeCompare(rContent)) || !(aTeamDraw.localeCompare(rContent)) ){
                    console.log("draw: "+rContent+" | ODD: "+odd)
                    ctr_draw++;
                    draw = parseFloat((draw * 1) + (odd * 1)).toFixed(2);
                    oddDraws[i] = odd;

                }else if( !(ha.localeCompare(rContent)) ){
                    console.log("no Draw: "+rContent+" | ODD: "+odd)
                    ctr_noDraw++;
                    noDraw = parseFloat((noDraw * 1) + (odd * 1)).toFixed(2);
                    oddNoDraws[i] = odd;
                }
            }
        }
        var dAverage = (draw/ctr_draw).toFixed(2), ndAverage = (noDraw/ctr_noDraw).toFixed(2), dDeviation = 0, ndDeviation = 0,
            avDrawRange0, avDrawRange1, avNoDrawRange0, avNoDrawRange1, erro = 0;

        for(var x = 0; x < oddDraws.length; x++){
            dDeviation = (dDeviation + (oddDraws[x] - dAverage)^2);
        }
        dDeviation = Math.sqrt((dDeviation/ctr_draw));

        for(var y = 0; y < oddNoDraws.length; y++){
            ndDeviation = (ndDeviation + (oddNoDraws[y] - ndAverage)^2);
        }
        ndDeviation = Math.sqrt((ndDeviation/ctr_noDraw));

        erro = (dDeviation/(Math.sqrt(ctr_draw))).toFixed(2);
        console.log("Average Range 1/x: ["+((dAverage*1)-(1.96*erro))+","+((dAverage*1)+(1.96*erro))+"] | erro: "+erro);
        erro = (ndDeviation/(Math.sqrt(ctr_noDraw))).toFixed(2);
        console.log("Average Range 1/2: ["+((ndAverage*1)-(1.96*erro))+","+((ndAverage*1)+(1.96*erro))+"] | erro: "+erro);

        console.log("Results: "+ctr_draw+" -> 1/x | Results: "+ctr_noDraw+" -> 1/2");
        console.log("Average: "+dAverage+" -> 1/x | Average: "+ndAverage+" -> 1/2");
        console.log("Deviation: "+dDeviation+" -> 1/x | Deviation: "+ndDeviation+" -> 1/2");


    }
})();