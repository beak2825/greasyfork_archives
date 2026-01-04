// ==UserScript==
// @name         OL: calculateStandards
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zeigt die Spielerstärkewerte für Standardsituationen gemäß Aussage von OFA-Mitarbeiter im Forum an
// @author       König von Weiden
// @match        https://www.onlineliga.de/team/tactic
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442860/OL%3A%20calculateStandards.user.js
// @updateURL https://update.greasyfork.org/scripts/442860/OL%3A%20calculateStandards.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 2000;
        let teamID = $(".ol-nav-team-logo").attr("onclick").match(/[0-9]+/g);
        let numberOfPlayers;
        let playerData;
        let i,j;
        let interval = setInterval(waitForKeyElement, timeInterval);
        let secondInterval;

        async function waitForKeyElement(){
            if($(".row.setplay-header").length==1 && $("#ol-container-load-standard-values").length==0){
                $(".row.setplay-header").before(
                    "<div id=\"ol-container-load-standard-values\">"+
                        "<span class=\"ol-section-load-standard-values\">"+
                        "<span class=\"ol-standard-values-question-text\">Spielerwerte für Standards laden?</span>"+
                        "<span class=\"ol-standard-values-answer\">"+
                            "<label class=\"ol-standard-values-answer-text\" style=\"margin: 0px 5px 0px 10px; font-weight: normal;\">ja</label>"+
                            "<input type=\"checkbox\" id=\"ol-standard-values-answer-checkbox\">"+
                        "</span>"+
                        "</span>"+
                    "</div>"
                );
                $("#ol-standard-values-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-standard-values-answer-checkbox").attr("disabled", true);
                        $("#ol-standard-values-answer-checkbox").after(
                            "<span class=\"ol-standard-values-loading\" style=\"margin: 0px 5px 0px 10px;\">Spielerdaten werden geladen...</span>"
                        );
                        if(typeof playerData=="undefined"){
                            getPlayerIDs(teamID);
                        }
                        $(".ol-standard-values-loading").remove();
                        $("#ol-standard-values-answer-checkbox").after(
                            "<span class=\"ol-standard-values-loaded\" style=\"margin: 0px 5px 0px 10px;\">Spielerdaten sind fertig geladen!</span>"
                        );
                    }
                    secondInterval = setInterval(waitForPlayer, timeInterval);
                });
            }
        }

        async function waitForPlayer(){
            let playerStandard;
            if(($("#setplay-entry-players1").length!=0) && ($("#setplayEntry1 .setplay-entry-players-head-standard1").length==0)){
                $("#setplayEntry1 .col-md-4.col-sm-4.col-xs-6.setplay-entry-players-head-shoot").attr("class", "col-md-3 col-sm-3 col-xs-6 setplay-entry-players-head-shoot");
                $("#setplayEntry1 .col-md-3.col-sm-3.col-xs-6.setplay-entry-players-head-shoot").attr("style", "width:180px;");
                $("#setplayEntry1 .col-md-2.col-sm-2.col-xs-1.setplay-entry-players-head-name").after("<div class=\"col-md-1 col-sm-1 col-xs-1 setplay-entry-players-head-standard1\">Standards</div>");
                let playerCornerLeft = $("#setplay-entry-players1 .setplay-entry-players-row").length;
                for(i=0;i<playerCornerLeft;i++){
                    let playerID = $("#setplay-entry-players1 .playerLink").eq(i).attr("data-playerid");
                    for(j=0;j<numberOfPlayers;j++){
                        if(playerID==parseInt(playerData[j][0])){
                            playerStandard = playerData[j][1];
                            j = numberOfPlayers;
                        }
                    }
                    $("#setplay-entry-players1 .col-md-4.col-sm-4.col-xs-12.setplay-entry-players-cell-shoot").attr("class", "col-md-3 col-sm-3 col-xs-12 setplay-entry-players-cell-shoot");
                    $("#setplay-entry-players1 .col-md-2.col-sm-2.col-xs-6.setplay-entry-players-cell-name").eq(i).after(
                        "<div class=\"col-md-1 col-sm-1 col-xs-6 setplay-entry-players-cell-standard1\" style=\"white-space: nowrap;\">"+
                            "<span>"+playerStandard+"</span>"+
                        "</div>");
                }
            }
            if(($("#setplay-entry-players2").length!=0) && ($("#setplayEntry2 .setplay-entry-players-head-standard2").length==0)){
                $("#setplayEntry2 .col-md-4.col-sm-4.col-xs-6.setplay-entry-players-head-shoot").attr("class", "col-md-3 col-sm-3 col-xs-6 setplay-entry-players-head-shoot");
                $("#setplayEntry2 .col-md-3.col-sm-3.col-xs-6.setplay-entry-players-head-shoot").attr("style", "width:180px;");
                $("#setplayEntry2 .col-md-2.col-sm-2.col-xs-1.setplay-entry-players-head-name").after("<div class=\"col-md-1 col-sm-1 col-xs-1 setplay-entry-players-head-standard2\">Standards</div>");
                let playerCornerRight = $("#setplay-entry-players2 .setplay-entry-players-row").length;
                for(i=0;i<playerCornerRight;i++){
                    let playerID = $("#setplay-entry-players2 .playerLink").eq(i).attr("data-playerid");
                    for(j=0;j<numberOfPlayers;j++){
                        if(playerID==parseInt(playerData[j][0])){
                            playerStandard = playerData[j][1];
                            j = numberOfPlayers;
                        }
                    }
                    $("#setplay-entry-players2 .col-md-4.col-sm-4.col-xs-12.setplay-entry-players-cell-shoot").attr("class", "col-md-3 col-sm-3 col-xs-12 setplay-entry-players-cell-shoot");
                    $("#setplay-entry-players2 .col-md-2.col-sm-2.col-xs-6.setplay-entry-players-cell-name").eq(i).after(
                        "<div class=\"col-md-1 col-sm-1 col-xs-6 setplay-entry-players-cell-standard2\" style=\"white-space: nowrap;\">"+
                            "<span>"+playerStandard+"</span>"+
                        "</div>");
                }
            }
            if(($("#setplay-entry-players3").length!=0) && ($("#setplayEntry3 .setplay-entry-players-head-standard3").length==0)){
                $("#setplayEntry3 .col-md-4.col-sm-4.col-xs-6.setplay-entry-players-head-shoot").attr("class", "col-md-3 col-sm-3 col-xs-6 setplay-entry-players-head-shoot");
                $("#setplayEntry3 .col-md-3.col-sm-3.col-xs-6.setplay-entry-players-head-shoot").attr("style", "width:180px;");
                $("#setplayEntry3 .col-md-2.col-sm-2.col-xs-1.setplay-entry-players-head-name").after("<div class=\"col-md-1 col-sm-1 col-xs-1 setplay-entry-players-head-standard3\">Standards</div>");
                let playerPenalty = $("#setplay-entry-players3 .setplay-entry-players-row").length;
                for(i=0;i<playerPenalty;i++){
                    let playerID = $("#setplay-entry-players3 .playerLink").eq(i).attr("data-playerid");
                    for(j=0;j<numberOfPlayers;j++){
                        if(playerID==parseInt(playerData[j][0])){
                            playerStandard = playerData[j][1];
                            j = numberOfPlayers;
                        }
                    }
                    $("#setplay-entry-players3 .col-md-4.col-sm-4.col-xs-12.setplay-entry-players-cell-shoot").attr("class", "col-md-3 col-sm-3 col-xs-12 setplay-entry-players-cell-shoot");
                    $("#setplay-entry-players3 .col-md-2.col-sm-2.col-xs-6.setplay-entry-players-cell-name").eq(i).after(
                        "<div class=\"col-md-1 col-sm-1 col-xs-6 setplay-entry-players-cell-standard3\" style=\"white-space: nowrap;\">"+
                            "<span>"+playerStandard+"</span>"+
                        "</div>");
                }
            }
            if(($("#setplay-entry-players4").length!=0) && ($("#setplayEntry4 .setplay-entry-players-head-standard4").length==0)){
                $("#setplayEntry4 .col-md-4.col-sm-4.col-xs-6.setplay-entry-players-head-shoot").attr("class", "col-md-3 col-sm-3 col-xs-6 setplay-entry-players-head-shoot");
                $("#setplayEntry4 .col-md-3.col-sm-3.col-xs-6.setplay-entry-players-head-shoot").attr("style", "width:180px;");
                $("#setplayEntry4 .col-md-2.col-sm-2.col-xs-1.setplay-entry-players-head-name").after("<div class=\"col-md-1 col-sm-1 col-xs-1 setplay-entry-players-head-standard4\">Standards</div>");
                let playerFreekickOver = $("#setplay-entry-players4 .setplay-entry-players-row").length;
                for(i=0;i<playerFreekickOver;i++){
                    let playerID = $("#setplay-entry-players4 .playerLink").eq(i).attr("data-playerid");
                    for(j=0;j<numberOfPlayers;j++){
                        if(playerID==parseInt(playerData[j][0])){
                            playerStandard = playerData[j][1];
                            j = numberOfPlayers;
                        }
                    }
                    $("#setplay-entry-players4 .col-md-4.col-sm-4.col-xs-12.setplay-entry-players-cell-shoot").attr("class", "col-md-3 col-sm-3 col-xs-12 setplay-entry-players-cell-shoot");
                    $("#setplay-entry-players4 .col-md-2.col-sm-2.col-xs-6.setplay-entry-players-cell-name").eq(i).after(
                        "<div class=\"col-md-1 col-sm-1 col-xs-6 setplay-entry-players-cell-standard4\" style=\"white-space: nowrap;\">"+
                            "<span>"+playerStandard+"</span>"+
                        "</div>");
                }
            }
            if(($("#setplay-entry-players5").length!=0) && ($("#setplayEntry5 .setplay-entry-players-head-standard5").length==0)){
                $("#setplayEntry5 .col-md-4.col-sm-4.col-xs-6.setplay-entry-players-head-shoot").attr("class", "col-md-3 col-sm-3 col-xs-6 setplay-entry-players-head-shoot");
                $("#setplayEntry5 .col-md-3.col-sm-3.col-xs-6.setplay-entry-players-head-shoot").attr("style", "width:180px;");
                $("#setplayEntry5 .col-md-2.col-sm-2.col-xs-1.setplay-entry-players-head-name").after("<div class=\"col-md-1 col-sm-1 col-xs-1 setplay-entry-players-head-standard5\">Standards</div>");
                let playerFreekickUnder = $("#setplay-entry-players5 .setplay-entry-players-row").length;
                for(i=0;i<playerFreekickUnder;i++){
                    let playerID = $("#setplay-entry-players5 .playerLink").eq(i).attr("data-playerid");
                    for(j=0;j<numberOfPlayers;j++){
                        if(playerID==parseInt(playerData[j][0])){
                            playerStandard = playerData[j][1];
                            j = numberOfPlayers;
                        }
                    }
                    $("#setplay-entry-players5 .col-md-4.col-sm-4.col-xs-12.setplay-entry-players-cell-shoot").attr("class", "col-md-3 col-sm-3 col-xs-12 setplay-entry-players-cell-shoot");
                    $("#setplay-entry-players5 .col-md-2.col-sm-2.col-xs-6.setplay-entry-players-cell-name").eq(i).after(
                        "<div class=\"col-md-1 col-sm-1 col-xs-6 setplay-entry-players-cell-standard5\" style=\"white-space: nowrap;\">"+
                            "<span>"+playerStandard+"</span>"+
                        "</div>");
                }
            }
        }

        function getPlayerIDs(teamID){
            let link = "/team/overview/squad?userId="+teamID;
            let clubData = $.ajax({type: "GET", url: link, async: false}).responseText;
            numberOfPlayers = $("<div>" + clubData + "</div>").find(".ol-player-name").length;
            playerData = new Array(numberOfPlayers);
            for (i=0;i<numberOfPlayers;i++){
                playerData[i] = new Array(2);
                let help = $("<div>" + clubData + "</div>").find(".ol-player-name").eq(i).attr("onclick").match(/[0-9]+/g);
                playerData[i][0] = help[0];
                playerData[i][1] = getPlayerData(playerData[i][0]);
            }
        }

        function getPlayerData(playerID){
            let link = "/player/overview?playerId="+playerID;
            let playerData = $.ajax({type: "GET", url: link, async: false}).responseText;
            let playerPositions = $("<div>" + playerData + "</div>").find(".ol-player-overview-player-position-age").text().trim();
            playerPositions = playerPositions.substring(10,12);
            if(playerPositions=="TW"){
                return 0;
            }
            else{
                let shootingTechnique = $("<div>" + playerData + "</div>").find(".ol-value-bar-small-label-value").eq(5).text();
                let leftFoot = $("<div>" + playerData + "</div>").find(".ol-value-bar-small-label-value").eq(12).text();
                let rightFoot = $("<div>" + playerData + "</div>").find(".ol-value-bar-small-label-value").eq(13).text();
                return parseInt(shootingTechnique)+Math.max(leftFoot, rightFoot);
            }
        }
    });
})();