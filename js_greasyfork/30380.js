// ==UserScript==
// @name         Bye Calculator
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Projected bye score for DT Draft
// @author       Sahil Choujar
// @match        https://www.ultimatefooty.com.au/*/matchup*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30380/Bye%20Calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/30380/Bye%20Calculator.meta.js
// ==/UserScript==

var team1 = [];
var team2 = [];
var one, score1, count, pro1, two, pro2, team1score, team2score, score2, curr1, curr2;

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());


(function() {
    'use strict';
    

    // Your code here...
    $(document).ready(function(){
        
        one = $(".points.scoring.team1-player .player-actual span");
        score1 = $(".text-left .team-actual");
        count = 0;
        
        one.each(function(index, value){
            team1.push({key: count, score: $(value).text()});
            count++;
        });
        
        pro1 = $(".points.yet-to-play.team1-player .player-proj");
        
        
        pro1.each(function(index, value){
            team1.push({key: count, score: $(value).html().trim()});
            count++;
        });
        
        curr1 = $(".points.in-progress.team1-player .player-actual span");
        
        curr1.each(function(index, value){
            team1.push({key: count, score: $(value).text()});
            count++;
        });
        
        $.merge(one, pro1);
        $.merge(one, curr1);
        
        team1.sort(function (a, b) {
            return a.score.localeCompare( b.score, undefined, {numeric: true});
        });
        
        team1.reverse();
        team1.length = params.count || 12;
        
        team1score = 0;
        team1.forEach(function(player){
            //console.log(player.score);
            console.log(player.key, ": ", player.score);
            team1score = team1score + parseInt(player.score);
            $(one[player.key]).closest("td").css("background-color", "orange");
        });
        console.log(team1score);
        console.info(team1.toString());
        
        score1.html(team1score + " <s>" + score1.html() + "</s>");
        
        score2 = $(".text-right .team-actual");
        
        two = $(".points.scoring.team2-player .player-actual span");
        pro2 = $(".points.yet-to-play.team2-player .player-proj");
        count = 0;
        
        two.each(function(index, value){
            team2.push({key: count, score: $(value).text()});
            count++;
        });
        
        pro2.each(function(index, value){
            team2.push({key: count, score: $(value).html().trim()});
            count++;
        });
        
        curr2 = $(".points.in-progress.team2-player .player-actual span");
        
        curr2.each(function(index, value){
            team2.push({key: count, score: $(value).text()});
            count++;
        });
        
        
        $.merge(two, pro2);
        $.merge(two, curr2);
        
        team2.sort(function (a, b) {
            return a.score.localeCompare( b.score, undefined, {numeric: true});
        });
        
        team2.reverse();
        team2.length = params.count || 12;
        
        team2score = 0;
        team2.forEach(function(player){
            console.log(player.key, ": ", player.score);
            team2score = team2score + parseInt(player.score);
            $(two[player.key]).closest("td").css("background-color", "orange");
        });
        
        console.log(team2score);
        //console.info(team2.toString());
   
        
        score2.html(team2score + " <s>" + score2.html() + "</s>");
        
    });
})();