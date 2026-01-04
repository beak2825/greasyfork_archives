// ==UserScript==
// @name         OL: showLineupLastGames
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Zeigt die letzten Spiele der Teams in der Aufstellungsvorschau an
// @author       König von Weiden
// @match        https://www.onlineliga.de/
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442864/OL%3A%20showLineupLastGames.user.js
// @updateURL https://update.greasyfork.org/scripts/442864/OL%3A%20showLineupLastGames.meta.js
// ==/UserScript==

/*********************************************
     * 0.1.0 29.03.2022 Release
     * 0.2.0 29.03.2022 Add matchtyp home or away and tooltip

*********************************************/

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 2000;
        const currentSeason = parseInt($(".ol-header-current-season:first").text());
        const lastSeason = currentSeason - 1;
        const gamesToDisplay = 10;
        let i,j;
        let interval = setInterval(waitForKeyElement, timeInterval);
        let secondInterval;

        async function waitForKeyElement(){
            if($(".ol-container-game-history").length!=2 && $("#ol-container-load-game-histories").length==1){
                $("#ol-load-game-histories-answer-checkbox").prop("checked", false);
                $("#ol-load-game-histories-answer-checkbox").attr("disabled", false);
                $("#ol-container-load-game-histories").show();
            }
            if($("#matchContent").length==1 && $(".matchreport-lineup-headline").length==2 && $("#ol-container-load-game-histories").length==0){
                let date = new Date();
                let matchDayDay = parseInt($(".matchreport-date").text().substring(0,2));
                let matchDayMonth = parseInt($(".matchreport-date").text().substring(3,5));
                let matchDayYear = parseInt($(".matchreport-date").text().substring(6,10));
                let systemDay = parseInt((date.getDate()<10 ? "0" : "") + date.getDate());
                let systemMonth = parseInt((date.getMonth()<9 ? "0" : "") + (date.getMonth()+1));
                let systemYear = parseInt(date.getFullYear());
                if(((systemDay+1)==matchDayDay && systemMonth==matchDayMonth && systemYear==matchDayYear) || matchDayDay==1 && (systemMonth+1)==matchDayMonth || matchDayDay==1 && matchDayMonth==1 && (systemYear+1)==matchDayYear){
                    $("#matchContent").attr("style", "padding-top: 0px;");
                    $("#matchContent").before(
                        "<div id=\"ol-container-load-game-histories\">"+
                        "<span>"+
                        "<span>Möchtest du dir die letzten Ergebnisse der Teams anzeigen lassen?</span>"+
                        "<span>"+
                        "<label style=\"margin: 0px 5px 0px 10px; font-weight: normal;\">ja</label>"+
                        "<input type=\"checkbox\" id=\"ol-load-game-histories-answer-checkbox\">"+
                        "</span>"+
                        "</span>"+
                        "</div>"
                    );
                    $("#ol-load-game-histories-answer-checkbox").change(function() {
                        if(this.checked) {
                            $("#ol-load-game-histories-answer-checkbox").attr("disabled", true);
                            $(".team-system-headline").after(
                                "<div class=\"ol-container-game-history\" style=\"text-align:center;margin: 5px -5px 0px 0px;\"></div>"
                            );
                            let teamIDHome = parseInt($("#matchdayresult a[onclick]").eq(0).attr("onclick").match(/[0-9]+/g)[0]);
                            checkGameHistory(teamIDHome, 0);
                            let teamIDAway = parseInt($("#matchdayresult a[onclick]").eq(3).attr("onclick").match(/[0-9]+/g)[0]);
                            checkGameHistory(teamIDAway, 1);
                            $("#ol-container-load-game-histories").hide();
                        }
                    });
                }
            }
        }

        function getGameHistory(teamID, teamData, gameNumber, teamorder){
            let match = $("<div>" + teamData + "</div>").find(".team-overview-history-table-row").eq(gameNumber).html();
            let matchTyp = $("<div>" + teamData + "</div>").find(".team-overview-history-matchday.hidden-lg.hidden-md").eq(gameNumber).text().charAt(0);
            let matchTypLong;
            let matchLink = $("<div>" + teamData + "</div>").find(".team-overview-history-result-mobile a").eq(gameNumber).attr("href");
            if(matchTyp=="F"){
                matchTyp="F";
                matchTypLong="Friendly";
            }
            else{
                matchTyp="L";
                matchTypLong="Liga";
            }
            let teamIDHome = $("<div>" + match + "</div>").find(".ol-team-name").eq(0).attr("onclick").match(/[0-9]+/g)[0];
            let result = $("<div>" + teamData + "</div>").find(".mobile-matchdaytable-result").eq(gameNumber).text().split(" ");
            let backgroundResult;
            let newResult;
            let gameLocation;
            let gameLocationLong;
            if(teamID==teamIDHome){
                if(result[0]>result[2]){
                    backgroundResult = "#A9D08E";
                }
                else if(result[0]==result[2]){
                    backgroundResult = "#FFD966";
                }
                else{
                    backgroundResult = "#F4B084";
                }
                newResult = result[0]+result[1]+result[2];
                gameLocation = "H";
                gameLocationLong = "Heimspiel";
            }
            else{
                if(result[2]>result[0]){
                    backgroundResult = "#A9D08E";
                }
                else if(result[0]==result[2]){
                    backgroundResult = "#FFD966";
                }
                else{
                    backgroundResult = "#F4B084";
                }
                newResult = result[2]+result[1]+result[0];
                gameLocation = "A";
                gameLocationLong = "Auswärtsspiel";
            }
            $(".ol-container-game-history").eq(teamorder).append(
                "<div style=\"display:inline-block;\">"+
                "<span class=\"ol-preview-games-short\" style=\"color:#404040;display:block;font-weight:bold;\"><dfn title="+matchTypLong+" style=\"font-style:normal;\">"+matchTyp+"</dfn></span>"+
                "<span style=\"background-color:"+backgroundResult+";color:#404040;display:block;font-weight:bold;padding:2px 4px 2px 4px;margin:0px 4px 0px 4px;\"><a href=\""+matchLink+"\" target=\"_blank\">"+newResult+"</a></span>"+
                "<span class=\"ol-preview-games-short\" style=\"color:#404040;display:block;font-style:normal;font-weight:bold;\"><dfn title="+gameLocationLong+" style=\"font-style:normal;\">"+gameLocation+"</dfn></span>"+
                "</div>"
            );
        }

        function checkGameHistory(teamID, teamorder){
            let linkCurrentSeason = "team/overview/history/season?userId="+teamID+"&season="+currentSeason;
            let teamDataCurrentSeason = $.ajax({type: "GET", url: linkCurrentSeason, async: false}).responseText;
            let numberOfGamesThisSeason = $("<div>" + teamDataCurrentSeason + "</div>").find(".team-overview-history-table-row").length;
            if(numberOfGamesThisSeason<gamesToDisplay){
                let linkLastSeason = "team/overview/history/season?userId="+teamID+"&season="+lastSeason;
                let teamDataLastSeason = $.ajax({type: "GET", url: linkLastSeason, async: false}).responseText;
                let numberOfGamesLastSeason = $("<div>" + teamDataLastSeason + "</div>").find(".team-overview-history-table-row").length;
                for(i=numberOfGamesLastSeason-(gamesToDisplay-numberOfGamesThisSeason);i<numberOfGamesLastSeason;i++){
                    getGameHistory(teamID, teamDataLastSeason, i, teamorder);
                }
                for(i=0;i<numberOfGamesThisSeason;i++){
                    getGameHistory(teamID, teamDataCurrentSeason, i, teamorder);
                }
            }
            else{
                for(i=(numberOfGamesThisSeason-gamesToDisplay);i<numberOfGamesThisSeason;i++){
                    getGameHistory(teamID, teamDataCurrentSeason, i, teamorder);
                }
            }
        }
    });
})();

