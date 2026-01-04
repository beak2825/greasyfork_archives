// ==UserScript==
// @name         Atlador Cup Rank Calculator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  calculate your rank in the AC - updated for AC XVI (2020)
// @author       funnybell
// @match        https://www.neopets.com/altador/colosseum/20*
// @match        http://www.neopets.com/altador/colosseum/20*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428067/Atlador%20Cup%20Rank%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/428067/Atlador%20Cup%20Rank%20Calculator.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Add points per game to the table
    const gameTitle = document.getElementsByClassName("gameName");
    gameTitle[0].innerHTML += " (Win: 12 pts, Draw: 4 pts)";
    gameTitle[1].innerHTML += " (6 pts)";
    gameTitle[2].innerHTML += " (1 pt)";
    gameTitle[3].innerHTML += " (1 pt)";
    // Calculate total points
    const myNodelist = document.querySelectorAll("td");
    var yybPts = parseFloat(myNodelist[13].innerHTML.replace(/,/g, '')*12)+parseFloat(myNodelist[15].innerHTML.replace(/,/g, '')*4);
    var slslPts = parseFloat(myNodelist[19].innerHTML.replace(/,/g, '')*6);
    var msnPts = parseFloat(myNodelist[23].innerHTML.replace(/,/g, ''));
    var sosdPts = parseFloat(myNodelist[27].innerHTML.replace(/,/g, ''));
    var totalPts = yybPts + slslPts + msnPts + sosdPts;
    // Calculate goals per game average (GPG)
    var yybGoals = parseFloat(myNodelist[1].innerHTML.replace(/,/g, ''));
    var yybWins = parseFloat(myNodelist[13].innerHTML.replace(/,/g, ''));
    var yybDraws = parseFloat(myNodelist[15].innerHTML.replace(/,/g, ''));
    var gpgPts = yybGoals/(yybWins+yybDraws);
    // Calculate current rank, points till next rank
    var currentRank;
    var rank = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];
    var rankScore = [0, 220, 440, 660, 880, 1210, 1540, 1870, 2200, 2640, 3080, 3520, 3960, 4510, 5060, 5610, 6160, 6820, 7480, 8140, 8800, 9570, 10340, 11110, 11880, 12760, 13640, 14520, 15400, 16390, 17380, 18370, 19360, 20460, 21560, 22660, 23760, 24970, 26180, 27390, 28600, 29920, 31240, 32560, 33880, 35310, 36740, 38170, 39600, 41140, 42680];
    var i;
    var nextRank;
    var nextRankPts;
    for (i = 0; i < rank.length; i++) {
        if (totalPts >= rankScore[i] && totalPts < rankScore[i+1]) {
            currentRank = i;
            nextRank = parseFloat(currentRank+1);
            nextRankPts = rankScore[i+1]-totalPts;
        }
    }
    //Calculate All-star
    var currentAS
    var asRank = ["", " (All-Star)", " (Double All-Star)", " (Triple All-Star)", " (Quad All-Star)"];
    var asScore = [0, 8800, 17600, 26400, 35200];
    var j;
    var nextAS;
    var nextASPts;
    for (j = 0; j < asRank.length; j++) {
        if (totalPts >= asScore[j] && totalPts < asScore[j+1]){
            currentAS = asRank[j];
            nextAS = asRank[j+1];
            nextASPts = asScore[j+1]-totalPts;
        }
    }
    // Add extra stats to HTML
    var calcHTML = document.createElement ('div');
    calcHTML.innerHTML = "<div class='rankOuter'><div class='rankScoresOuter' style='width: 500px;'><br><b>Total Points:</b> " + totalPts + "<br><b>GPG:</b> " + gpgPts + "<br><b>Current Rank:</b> Rank " + currentRank + currentAS + "<br><b>Next Rank (" + nextRank + "):</b> +" + nextRankPts + " pts<br><b>Next All-Star" + nextAS + ":</b> +" + nextASPts + " pts</div></div>";
    document.body.appendChild (calcHTML);
})();