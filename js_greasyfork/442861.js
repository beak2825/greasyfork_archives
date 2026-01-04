// ==UserScript==
// @name         OL: getStadiumOverview
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Zeigt die aktuellen Stadiongrößen der Vereine an
// @author       König von Weiden
// @match        https://www.onlineliga.de/
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/442861/OL%3A%20getStadiumOverview.user.js
// @updateURL https://update.greasyfork.org/scripts/442861/OL%3A%20getStadiumOverview.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function(){
        const timeInterval = 2000;
        const currentSeason = $(".ol-header-current-season:first").text();
        let leagueLevelOfInterest = 4;
        let isLeagueLevelInteresting = true;
        let leagueNumber = 1;
        let resultArray = new Array();
        let numberOfTeams = 0;
        let i,j;
        let interval = setInterval(waitForKeyElement, timeInterval);

        async function waitForKeyElement(){
            if($(".stadion-wrapper #stadion-tabs").length==1 && $("#stadiumPreviewLoading").length==1 && $("#ol-container-load-stadium-infos").length==0){
                $("#stadion-tabs").before(
                    "<div id=\"ol-container-load-stadium-infos\">"+
                        "<div class=\"ol-section-load-stadium-infos\">"+
                        "<span class=\"ol-stadium-infos-question-text\">Stadioninfos der aktiven Vereine bis einschließlich der "+leagueLevelOfInterest+". Liga laden?</span>"+
                        "<span class=\"ol-stadium-infos-answer\">"+
                            "<label class=\"ol-stadium-infos-answer-text\" style=\"margin: 0px 5px 0px 10px; font-weight: normal;\">ja</label>"+
                            "<input type=\"checkbox\" id=\"ol-stadium-infos-answer-checkbox\">"+
                        "</span>"+
                        "</div>"+
                    "</div>"
                );
                $("#ol-stadium-infos-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-stadium-infos-answer-checkbox").attr("disabled", true);
                        $("#ol-stadium-infos-answer-checkbox").after(
                            "<span class=\"ol-club-infos-loading\" style=\"margin: 0px 5px 0px 10px;\">"+leagueNumber+" Liga gefunden</span>"
                        );
                        while(isLeagueLevelInteresting){
                            getTeamIDs(leagueNumber);
                            if(isLeagueLevelInteresting && leagueNumber!=1){
                                $(".ol-club-infos-loading").remove();
                                $("#ol-stadium-infos-answer-checkbox").after(
                                    "<span class=\"ol-club-infos-loading\" style=\"margin: 0px 5px 0px 10px;\">"+leagueNumber+" Ligen gefunden</span>"
                                );
                            }
                            leagueNumber++;
                        }
                        for(i=0;i<resultArray.length;i++){
                            $(".ol-stadium-infos-loading").remove();
                            $(".ol-club-infos-loading").after(
                                "<span class=\"ol-stadium-infos-loading\" style=\"margin: 0px 5px 0px 10px;\">"+(i+1)+" Stadien gefunden</span>"
                            );
                            getStadiumInfos(resultArray[i][1]);
                        }
                        resultArray.sort(function(a,b){
                            return b[1] - a[1];
                        });
                        resultArray.sort(function(a,b){
                            return b[3] - a[3];
                        });
                        console.log(resultArray);
                        let resultString = "Nr.,Ligastufe,Verein,Stadionkapazität,Erweiterung\n";
                        for(i=0;i<resultArray.length;i++){
                            resultString += (i+1)+".,"+resultArray[i][0]+","+resultArray[i][2]+","+resultArray[i][3]+","+resultArray[i][4]+"\n";
                        }
                        console.log(resultString);
                    }
                });
            }
        }

        function getTeamIDs(leagueNumber){
            let link = "/matchdaytable/matchdaytable?season="+currentSeason+"&matchday=1&leagueId="+leagueNumber;
            let leagueData = $.ajax({type: "GET", url: link, async: false}).responseText;
            let dataValue = parseInt($("<div>" + leagueData + "</div>").find("#dropdown-matchday-table-league-level-matchdayTable").attr("data-value"));
            if(dataValue>leagueLevelOfInterest){
                isLeagueLevelInteresting = false;
            }
            else{
                let numberOfTeamsInLeague = $("<div>" + leagueData + "</div>").find("#ol-td span.ol-team-name").length;
                for(i=0;i<numberOfTeamsInLeague;i++){
                    resultArray[numberOfTeams] = new Array(5);
                    resultArray[numberOfTeams][0] = dataValue+". Liga";
                    resultArray[numberOfTeams][1] = $("<div>" + leagueData + "</div>").find("#ol-td span.ol-team-name").eq(i).attr("onclick").match(/[0-9]+/g)[0];
                    resultArray[numberOfTeams][2] = $("<div>" + leagueData + "</div>").find("#ol-td span.ol-team-name").eq(i).text().trim();
                    numberOfTeams++;
                }
            }
        }

        function getStadiumInfos(teamID){
            let link = "/team/overview/stadium?userId="+teamID;
            let stadiumData = $.ajax({type: "GET", url: link, async: false}).responseText;
            let stadiumSize = $("<div>" + stadiumData + "</div>").find("#stadion-tabs .ol-font-standard.regular:first").text().trim().match(/[0-9]+/g);
            if(stadiumSize.length==2){
                stadiumSize = stadiumSize.toString().replace(",", "");
            }
            else if(stadiumSize.length==3){
                let help = parseInt(stadiumSize[1].toString()+stadiumSize[2].toString());
                stadiumSize = parseInt(stadiumSize[0])+parseInt(help);
            }
            let isUnderConstruction = $("<div>" + stadiumData + "</div>").find(".stadium-construction-icon").length;
            resultArray[i][3] = stadiumSize;
            if(isUnderConstruction==1){
                resultArray[i][4] = "im Bau";
            }
            else{
                resultArray[i][4] = "";
            }
        }
    });
})();