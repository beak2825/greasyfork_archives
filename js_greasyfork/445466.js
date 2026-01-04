// ==UserScript==
// @name         OL: showSquadPlayerViewInjuries
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zeigt die durchschnittliche Verletzungsdauer in Wochen pro Saison pro Spieler in der Kaderübersicht an
// @author       König von Weiden
// @match        https://www.onlineliga.de/
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/445466/OL%3A%20showSquadPlayerViewInjuries.user.js
// @updateURL https://update.greasyfork.org/scripts/445466/OL%3A%20showSquadPlayerViewInjuries.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 2000;
        //let teamID = $(".ol-nav-team-logo").attr("onclick").match(/[0-9]+/g);
        let numberOfPlayers;
        let playerIDs;
        let playerInjuryData;
        let i, j;
        let interval = setInterval(waitForKeyElement, timeInterval);
        let secondInterval;

        async function waitForKeyElement(){
            if($("#teamSquad").length==1 && $("#ol-container-load-injury-values").length==0){
                $("#teamSquad").before(
                    "<div id=\"ol-container-load-injury-values\">"+
                        "<span class=\"ol-section-load-injury-values\">"+
                        "<span class=\"ol-injury-values-question-text\">Verletzungsdaten laden?</span>"+
                        "<span class=\"ol-injury-values-answer\">"+
                            "<label class=\"ol-injury-values-answer-text\" style=\"margin: 0px 5px 0px 10px; font-weight: normal;\">ja</label>"+
                            "<input type=\"checkbox\" id=\"ol-injury-values-answer-checkbox\">"+
                        "</span>"+
                        "</span>"+
                    "</div>"
                );
                $("#ol-injury-values-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-injury-values-answer-checkbox").attr("disabled", true);
                        $("#ol-injury-values-answer-checkbox").after(
                            "<span class=\"ol-injury-values-loading\" style=\"margin: 0px 5px 0px 10px;\">Spielerdaten werden geladen...</span>"
                        );
                        numberOfPlayers = $(".ol-player-name").length;
                        playerIDs = new Array(numberOfPlayers);
                        playerInjuryData = new Array(numberOfPlayers);
                        console.log(playerIDs);
                        for(i=0;i<numberOfPlayers;i++){
                            playerInjuryData[i] = new Array(4);
                            playerIDs[i] = parseInt($(".ol-player-name").eq(i).attr("onclick").match(/[0-9]+/g));
                            playerInjuryData[i][0] = playerIDs[i];
                            getPlayerInjuryData(playerIDs[i], i)
                        }
                        console.log(playerInjuryData);
                        if(typeof playerInjuryData=="undefined"){
                            //getPlayerIDs(teamID);
                        }
                        $(".ol-injury-values-loading").remove();
                        $("#ol-injury-values-answer-checkbox").after(
                            "<span class=\"ol-injury-values-loaded\" style=\"margin: 0px 5px 0px 10px;\">Spielerdaten sind fertig geladen!</span>"
                        );
                        clearInterval(interval);
                        secondInterval = setInterval(addInjuryInformation, timeInterval);
                    }
                });
            }
        }

        async function addInjuryInformation(){
            if($(".ol-player-injury").length==0){
                for(i=0;i<numberOfPlayers;i++){
                    $(".lblLineUpEditorCheckbox.ol-lineup-editor-checkbox").eq(i).after(
                        "<span class=\"ol-player-injury\" style=\"display:inline-block;font-size:15px;padding-right:5px;vertical-align:top;width:65px;\">"+
                            "<span class=\"ol-player-injury-number\" style=\"display:inline-block;padding-right:5px;text-align:right;\">"+playerInjuryData[i][1]+"</span>"+
                            "<span class=\"ol-player-injury-duration\" style=\"display:inline-block;padding-right:5px;text-align:right;\">"+playerInjuryData[i][2]+"</span>"+
                            "<span class=\"ol-player-injury-average\" style=\"display:inline-block;padding-right:5px;text-align:right;\">"+playerInjuryData[i][3]+"</span>"+
                        "</span>"
                    );
                }
            }
        }

        function getPlayerInjuryData(playerID, counter){
            let link = "/player/injuries?playerId="+playerID;
            let playerData = $.ajax({type: "GET", url: link, async: false}).responseText;
            playerInjuryData[i][1] = $("<div>" + playerData + "</div>").find("span.pull-left span.player-info-bandarole-big-font").eq(0).text().trim();
            playerInjuryData[i][2] = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(0).text().trim();
            playerInjuryData[i][3] = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(1).text().trim();
        }
    });
})();