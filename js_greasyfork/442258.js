// ==UserScript==
// @name         OL: Werkzeugkiste - (König von Weiden)
// @namespace    http://tampermonkey.net/
// @version      0.7.3
// @description  Sammlung von Erweiterungen für www.onlineliga.de
// @author       König von Weiden
// @match        https://www.onlineliga.de/*
// @icon         https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png
// @downloadURL https://update.greasyfork.org/scripts/448291/OL%3A%20Werkzeugkiste%20-%20%28K%C3%B6nig%20von%20Weiden%29.user.js
// @updateURL https://update.greasyfork.org/scripts/448291/OL%3A%20Werkzeugkiste%20-%20%28K%C3%B6nig%20von%20Weiden%29.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 22.07.2022 Release
                    + Feature: Übersicht der Teamstärken der Ligateams in der "Spieltag/Tabellen"-Ansicht
                    + Feature: Übersicht der aktiv gezogenen und noch im Verein verbliebenen Jugis der Ligateams in der "Spieltag/Tabellen"-Ansicht
                    + Feature: Anzeige des Alters in der Aufstellung in der "Mannschaft>Aufstellung"-Ansicht
 * 0.2.0 29.07.2022 + Überarbeitung: Erweiterung der Übersicht der Teamstärken der Ligateams
                    + Feature: Übersicht der getätigten Transfers der Ligateams in der "Spieltag/Tabellen"-Ansicht
 * 0.2.1 05.08.2022 + Überarbeitung: Erweiterung der Übersicht der Teamstärken der Ligateams (Ø Top2 TW & Ligadurchschnitt)
 * 0.3.0 06.08.2022 + Feature: Ergebnisse der Chatpartner im Messenger können auf Bedarf geladen werden
 * 0.3.1 16.08.2022 + Überarbeitung: Überflüssigen Zähler für Ergebnisse der Chatpartner entfernt
 * 0.4.0 10.11.2022 + Feature-Test: Übersicht der Verletzungen in der Kaderansicht
 * 0.5.0 01.04.2023 + Feature: Stadionauslastung wird direkt in der Einstellungsübersicht der Stadionpreise angezeigt
 * 0.6.0 08.04.2023 + Feature: Entwicklungsprognose der Spieler anhand des Trainingsplans verfügbar
 * 0.6.1 10.04.2023 + Überarbeitung: Anzeige der Entwicklungsprognose verbessert
 * 0.7.0 22.07.2023 + Feature: Auswertung der Elf der Saison ist möglich
                    + Überarbeitung: Teamstärken der Ligateams
 * 0.7.1 24.07.2023 + Überarbeitung: Ladeintervall angepasst
 * 0.7.2 24.07.2023 + Überarbeitung: Steckbrief-Vorschau für die Spieler der Elf der Saison korrigiert
 * 0.7.3 27.07.2023 + Überarbeitung: Fehlerhaft Code-Schnipsel zur Löschung von Verträgen entfernt
 *********************************************/

(function() {
    'use strict';

    $(document).ready(function(){
        const timeOfInterval = 100;
        const currentSeason = parseInt($(".ol-header-current-season:first").text());
        const lastSeason = currentSeason-1;
        const currentWeek = parseInt($(".ol-header-current-week:first").text());
        const currentMatchday = parseInt($(".ol-banner-time-regular:first").text());
        const teamIDOfManager = parseInt($(".ol-nav-team-logo").attr("onclick").match(/[0-9]+/g));
        const euro = new Intl.NumberFormat("de-DE", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 0
        });
        let i, j, k;
        let counterNumber = 0;
        let first = 0, second = 0;
        let interval = setInterval(waitForKeyElement, timeOfInterval);

        async function waitForKeyElement(){
            let currentUrl = window.location.href;
            if($("#lineUpPlayerList").length==1 && $(".ol-team-lineup-age").length==0){
                showAgeInLineup();
            }
            if(currentUrl.slice(0,53)=="https://www.onlineliga.de/matchdaytable/matchdaytable" && $("#ol-table-content").length==1 && $("#ol-league-team-overview").length!=1){
                $("#leagueFound .comment-widget-wrapper").prepend(
                    createDivForLeagueView("ol-league-team-overview", "6px")+
                    createDivForLeagueView("ol-league-jugi-overview", "6px")+
                    createDivForLeagueView("ol-league-transfer-overview", "12px")
                );
                createSpanWidthQuestion("ol-league-team-overview", "Möchtest du dir die Teamstärken der Liga anzeigen lassen?");
                createSpanWidthQuestion("ol-league-jugi-overview", "Möchtest du dir die zuletzt gezogenen Jugis der Liga anzeigen lassen, die derzeit noch im Verein aktiv sind?");
                createSpanWidthQuestion("ol-league-transfer-overview", "Möchtest du dir die letzten Transfers der Liga anzeigen lassen?");
                $("#ol-league-team-overview-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-league-team-overview-answer-checkbox").attr("disabled", true);
                        createTeamOverview("ol-league-team-overview");
                    }
                });
                $("#ol-league-jugi-overview-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-league-jugi-overview-answer-checkbox").attr("disabled", true);
                        createJugiOverview("ol-league-jugi-overview");
                    }
                });
                $("#ol-league-transfer-overview-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-league-transfer-overview-answer-checkbox").attr("disabled", true);
                        createTransferOverview("ol-league-transfer-overview");
                    }
                });
            }
            if(currentUrl=="https://www.onlineliga.de/team/squad" && $("#teamSquad").length==1 && $("#ol-team-injuries").length!=1){
                $("#teamSquad").prepend(
                    createDivForLeagueView("ol-team-injuries")
                );
                createSpanWidthQuestion("ol-team-injuries", "Möchtest du dir die Verletzungsdaten deines Teams anzeigen lassen?");
                $("#ol-team-injuries-answer-checkbox").change(function() {
                    $("#ol-team-injuries-answer-checkbox").attr("disabled", true);
                    createInjuryResults();
                });
            }
            if($("#messagesystem-search").length==1 && $("#messagesystem-results").length==0){
                createDivForMessengerResults();
                $("#messagesystem-results-select").change(function() {
                    $("#messagesystem-results-select").attr("disabled", true);
                    createMessengerResults();
                });
            }
            if(currentUrl=="https://www.onlineliga.de/stadium/settings" && $(".stadium-league-block-occupancy").length==0 && $("table.ol-table-striped-15.hidden-xs.hidden-sm tbody tr").length!=0){
                let stadiumIdValue = $('#stadiumId').val();
                let numberOfStadiumBlocks = $("table.ol-table-striped-15.hidden-xs.hidden-sm tbody tr").length;
                let priceTyp;
                let toggleBtnLeft = $(".title-headLine01.settings-heading.ol-state-primary-color-15 .toggle-btn-01 .toggle-btn-left-text.color001").length;
                let stadiumLeagueOccupancy = 0;
                let stadiumFriendlyOccupancy = 0;
                for(i=0;i<numberOfStadiumBlocks;i++){
                    let modificationIdValue = $("table.ol-table-striped-15.hidden-xs.hidden-sm tbody tr").eq(i).data("modificationid");
                    let link = "/settingsdetails/"+stadiumIdValue+"/"+modificationIdValue+"/0";
                    let stadiumBlockOccupancyOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
                    let numberOfLeagueOccupancies = $(stadiumBlockOccupancyOverview).find("tbody .ol-font-standard.bold.lstChildAlign.leagueTicketPrice").length/2;
                    for(j=0;j<numberOfLeagueOccupancies;j++){
                        let leagueOccupancy = $(stadiumBlockOccupancyOverview).find("tbody .ol-font-standard.bold.lstChildAlign.leagueTicketPrice").eq(j*2).text();
                        let friendlyOccupancy = $(stadiumBlockOccupancyOverview).find("tbody .ol-font-standard.bold.lstChildAlign.friendlyTicketPrice").eq(j*2).text();
                        stadiumLeagueOccupancy += parseInt(leagueOccupancy.replace(".", ""));
                        stadiumFriendlyOccupancy += parseInt(friendlyOccupancy.replace(".", ""));
                        $("table.ol-table-striped-15.hidden-xs.hidden-sm tbody tr").eq(i).find("div.leagueTicketPrice").eq(j*2).after("<div class=\"stadium-league-block-occupancy\">"+leagueOccupancy+"<span style=\"margin-left:6px;\"></span></div>");
                        $(".stadium-league-block-occupancy").attr("style","text-align:center;");
                        $("table.ol-table-striped-15.hidden-xs.hidden-sm tbody tr").eq(i).find("div.friendlyTicketPrice").eq(j*2).after("<div class=\"stadium-friendly-block-occupancy d-none\">"+friendlyOccupancy+"<span style=\"margin-left:6px;\"></span></div>");
                        $(".stadium-friendly-block-occupancy").attr("style","text-align:center;");
                        $(".settingsLeftSection").css("line-height", "8px");
                    }
                }
                $(".PlatzeDiv.ol-font-standard.regular").append(", L "+stadiumLeagueOccupancy.toLocaleString('de-DE')+", F "+stadiumFriendlyOccupancy.toLocaleString('de-DE'));
            }
            if($(".title-headLine01.settings-heading.ol-state-primary-color-15 .toggle-btn-01 .toggle-btn-left-text.color001").length==1 && $(".stadium-league-block-occupancy.d-none").length!=0){
                $(".stadium-friendly-block-occupancy").addClass("d-none");
                $(".stadium-league-block-occupancy").removeClass("d-none");
            }
            if($(".title-headLine01.settings-heading.ol-state-primary-color-15 .toggle-btn-01 .toggle-btn-right-text.color001").length==1 && $(".stadium-friendly-block-occupancy.d-none").length!=0){
                $(".stadium-league-block-occupancy").addClass("d-none");
                $(".stadium-friendly-block-occupancy").removeClass("d-none");
            }
            if(currentUrl=="https://www.onlineliga.de/team/training" && $(".ol-training-playerdetails.ol-training-playerdetails-schedule").length==1 && $(".ol-training-playerdetails-question").length==0){
                createDivWidthQuestion(".ol-training-playerdetails-header-sticky .ol-training-playerdetails-header", "ol-training-playerdetails", "<span>Möchtest du dir anhand deines Trainingsplans </span><span class=\"development-forecast-tooltip\" title=\"Prognosedaten werden anhand des aktuell aufgedeckten Talents in Verbindung mit der Annahme von 100% Fitness der Spieler errechnet.\" style=\"font-style:italic;font-weight:bold;\">Prognosedaten</span><span> für die Entwicklung deiner Spieler bis 30 Jahren anzeigen lassen?</span>");
                $(".development-forecast-tooltip").hover(function(){
                    $(this).css("cursor", "pointer");
                }, function(){
                    $(this).css("cursor", "default");
                });
                $("#ol-training-playerdetails-answer-checkbox").change(function() {
                    if(this.checked) {
                        $("#ol-training-playerdetails-answer-checkbox").attr("disabled", true);
                        let numberOfPlayers = $(".row.ol-training-playerdetails-table-row.trainingsplan-player-overviewX").length;
                        createPlayerDevelopmentForecast("ol-training-playerdetails-question", numberOfPlayers);
                    }
                });
            }
            if(currentUrl=="https://www.onlineliga.de/matchdaytable/elevenoftheday" && $(".ol-eleven-of-the-day-pitch").length!=0 && $(".ol-eleven-of-the-year-question-text").length==0){
                if(parseInt($("button#tooltipSeasonSelection span.ol-dropdown-text:first").text().match(/\d+/)[0])<currentSeason || (parseInt($("button#tooltipSeasonSelection span.ol-dropdown-text:first").text().match(/\d+/)[0])==currentSeason && currentMatchday>2)){
                    createDivWidthQuestion(".ol-headline-standard.ol-matchday-table-header2", "ol-eleven-of-the-year", "<span>Möchtest du dir die Elf des Jahres anzeigen lassen?</span>");
                    $(".ol-eleven-of-the-year-question").after("<div class=\"ol-eleven-of-the-year-answer-checkbox-info\">(Die Auswertung kann einen Moment dauern.)</div>");
                    $("#ol-eleven-of-the-year-answer-checkbox").change(function() {
                        if(this.checked) {
                            $("#ol-eleven-of-the-year-answer-checkbox").attr("disabled", true);
                            $(".ol-eleven-of-the-year-answer-checkbox-info").ready(function() {
                                getElevenOfTheYearData();
                            });
                        }
                    });
                }
            }
            if($("#playerView .player-injury-wrapper").length==1 && $(".ol-additional-injury-information").length==0){
                let playerID = parseInt($("span.player-steckbrief").eq(0).attr("onclick").match(/[0-9]+/g));
                getPlayerInjuryDataForTM(playerID);
            }
            if(currentUrl=="https://www.onlineliga.de/team/training"){
                let classOfTrainingButton = $("#trainingProcessStartBtn").attr("class").split(" ");
                let onclickAttributeValue = $("#trainingProcessStartBtn").attr("onclick");
                let args = onclickAttributeValue.replace(/.*\(|\)/gi, '');
                let argsArray = args.split(',');
                argsArray = argsArray.filter(arg => arg.trim() !== '');
                if(classOfTrainingButton[4] != "deactivated" && argsArray.length==3){
                    $("#trainingProcessStartBtn").attr("onclick", "olTraining.onClickWeektableAction(event, false);");
                }
            }
            if(currentUrl="https://www.onlineliga.de/transferlist/gettransferlistview" && gettransferlistview){
                let gettransferlistviewString = "#transferListItem"+tmPlId+" .ol-value-bar-small-label-value";
                if($(gettransferlistviewString).length==1){
                    let strengthOfPlayer = getPlayerStrength(plId);
                    let strengthOfPlayerOnTm = parseInt($(gettransferlistviewString).text());
                    if(strengthOfPlayer==strengthOfPlayerOnTm){
                        $(gettransferlistviewString).text(strengthOfPlayer+3);
                        gettransferlistview = false;
                    }
                }
            }
            if(currentUrl="https://www.onlineliga.de/transferlist/gettransferlistview?offerId="+tmPlId && gettransferlistviewOfferId){
                if($("#transferListWrappertransferList").length==1){
                    if($(".attributes-characteristic.ol-font-standard .row.player-attributes-bar").length==14){
                        for(i=0;i<14;i++){
                            if(i!=3)
                                $(".attributes-characteristic.ol-font-standard .row.player-attributes-bar .ol-value-bar-small-label-value").eq(i).text(parseInt($(".attributes-characteristic.ol-font-standard .row.player-attributes-bar .ol-value-bar-small-label-value").eq(i).text())+3);
                        }
                    }
                }
            }
        }

        function createPlayerDevelopmentForecast(divName, numberOfPlayers){
            let playerData = [];
            for(i=0;i<numberOfPlayers;i++){
                playerData[i] = new Player();
                playerData[i].age = parseInt($(".ol-training-playerdetails-age").eq(i).text());
                playerData[i].ID = parseInt($(".row.ol-training-playerdetails-table-row.trainingsplan-player-overviewX").eq(i).find("[data-playerid]").attr("data-playerid"));
                if(playerData[i].age<30){
                    let link = "/player/overview?playerId="+playerData[i].ID;
                    let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
                    link = "/team/training/details/results/player?playerId="+playerData[i].ID;
                    let playerSkillValues = $.ajax({type: "GET", url: link, async: false}).responseText;
                    playerData[i].positions = $("<div>" + playerOverview + "</div>").find(".ol-player-overview-player-position-age").text().trim().slice(10, 22).trim();
                    playerData[i].strength = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(0).html());
                    playerData[i].birthday = parseInt($("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(7).text().trim().substring(6,8).trim());
                    if(playerData[i].positions=="TW"){
                        playerData[i].talent = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(1).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(1).css("width"));
                        playerData[i].gameopening = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(2).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(2).css("width"));
                        playerData[i].line = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(3).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(3).css("width"));
                        playerData[i].runout = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(4).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(4).css("width"));
                        playerData[i].libero = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(5).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(5).css("width"));
                        playerData[i].penaltyarea = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(6).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(6).css("width"));
                        playerData[i].foot = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(7).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(7).css("width"));
                    }
                    else{
                        playerData[i].talent = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(1).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(1).css("width"));
                        playerData[i].rightfoot = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(2).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(2).css("width"));
                        playerData[i].leftfoot = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(3).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(3).css("width"));
                        playerData[i].condition = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(4).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(4).css("width"));
                        playerData[i].speed = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(5).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(5).css("width"));
                        playerData[i].technique = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(6).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(6).css("width"));
                        playerData[i].shootingtechnique = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(7).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(7).css("width"));
                        playerData[i].shootingpower = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(8).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(8).css("width"));
                        playerData[i].header = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(9).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(9).css("width"));
                        playerData[i].duel = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(10).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(10).css("width"));
                        playerData[i].tactics = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(11).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(11).css("width"));
                        playerData[i].athletics = parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(12).css("left"))+parseFloat($("<div>" + playerSkillValues + "</div>").find(".ol-value-bar-small-bar.ol-value-bar-layer-2").eq(12).css("width"));
                    }
                    if($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-special-type").text().trim()=="(wird noch ermittelt)"){
                        playerData[i].isTalentDetermind = true;
                    }
                    else{
                        playerData[i].isTalentDetermind = false;
                    }
                    let numberOfTrainingsBlocks = ($(".row.ol-training-playerdetails-table-row.trainingsplan-player-overviewX").eq(i).find(".details-block-wrapper.ol-training-playerdetails-block.ol-popover-dismiss.ol-popover-frame-shadow.ol-popover-text-bigline.popover-icon.ol-popover-launcher").length)/2;
                    for(j=0;j<numberOfTrainingsBlocks;j++){
                        let trainingsBlock = $(".row.ol-training-playerdetails-table-row.trainingsplan-player-overviewX").eq(i).find(".details-block-wrapper.ol-training-playerdetails-block.ol-popover-dismiss.ol-popover-frame-shadow.ol-popover-text-bigline.popover-icon.ol-popover-launcher").eq(j).attr("data-text");
                        let trainingsBlockTime = parseInt(trainingsBlock.split(" ").slice(0).join(" "));
                        let trainingsBlockName = trainingsBlock.split(" ").slice(2).join(" ");
                        let numberOfSeasonsForDevelopmentCalculation = 30-playerData[i].age;
                        for(k=0;k<numberOfSeasonsForDevelopmentCalculation;k++){
                            let ageFactor;
                            if(playerData[i].age+k==17){
                                ageFactor = 1.3;
                            }
                            else if(playerData[i].age+k==18){
                                ageFactor = 1.2;
                            }
                            else if(playerData[i].age+k==19){
                                ageFactor = 1.1;
                            }
                            else if(playerData[i].age+k>19 && playerData[i].age+k<26){
                                ageFactor = 1;
                            }
                            else if(playerData[i].age+k>25 && playerData[i].age+k<28){
                                ageFactor = 0.9;
                            }
                            else if(playerData[i].age+k==28){
                                ageFactor = 0.8;
                            }
                            else if(playerData[i].age+k==29){
                                ageFactor = 0.7;
                            }
                            let numberOfWeeks;
                            if(k==0){
                                if(playerData[i].birthday>currentWeek){
                                    numberOfWeeks = playerData[i].birthday-currentWeek;
                                }
                                else{
                                    numberOfWeeks = 44-currentWeek+playerData[i].birthday;
                                }
                            }
                            else{
                                numberOfWeeks = 44;
                            }
                            if(playerData[i].positions=="TW"){
                                if(trainingsBlockName=="Taktik"){
                                    playerData[i].libero += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Technik"){
                                    playerData[i].libero += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(6*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Schusstraining"){
                                    playerData[i].libero += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(4*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Standardsituationen"){
                                    playerData[i].line += (1/300)*(6*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].line)/100)*numberOfWeeks;
                                    playerData[i].libero += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].runout += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].runout)/100)*numberOfWeeks;
                                    playerData[i].penaltyarea += (1/300)*(8*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].penaltyarea)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Spielformen 5-5 bis 10-10"){
                                    playerData[i].libero += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(4*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Trainingsspiel"){
                                    playerData[i].line += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].line)/100)*numberOfWeeks;
                                    playerData[i].libero += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                    playerData[i].runout += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].runout)/100)*numberOfWeeks;
                                    playerData[i].penaltyarea += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].penaltyarea)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Torwarttraining"){
                                    playerData[i].line += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].line)/100)*numberOfWeeks;
                                    playerData[i].libero += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                    playerData[i].runout += (1/300)*(8*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].runout)/100)*numberOfWeeks;
                                    playerData[i].penaltyarea += (1/300)*(8*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].penaltyarea)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Spielformen bis 4-4"){
                                    playerData[i].libero += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].libero)/100)*numberOfWeeks;
                                    playerData[i].foot += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].foot)/100)*numberOfWeeks;
                                    playerData[i].gameopening += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].gameopening)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Schnellkraft"){
                                    playerData[i].line += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].line)/100)*numberOfWeeks;
                                }
                            }
                            else{
                                if(trainingsBlockName=="Taktik"){
                                    playerData[i].tactics += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].tactics)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Koordination"){
                                    playerData[i].condition += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                    playerData[i].speed += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].speed)/100)*numberOfWeeks;
                                    playerData[i].duel += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                    playerData[i].athletics += (1/300)*(4*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].athletics)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Technik"){
                                    playerData[i].technique += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].technique)/100)*numberOfWeeks;
                                    playerData[i].shootingtechnique += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].shootingtechnique)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Schusstraining"){
                                    playerData[i].shootingtechnique += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].shootingtechnique)/100)*numberOfWeeks;
                                    playerData[i].shootingpower += (1/300)*(4*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].shootingpower)/100)*numberOfWeeks;
                                    playerData[i].leftfoot += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].speed)/100)*numberOfWeeks;
                                    playerData[i].rightfoot += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Standardsituationen"){
                                    playerData[i].shootingtechnique += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].shootingtechnique)/100)*numberOfWeeks;
                                    playerData[i].header += (1/300)*(4*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].header)/100)*numberOfWeeks;
                                    playerData[i].duel += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                    playerData[i].leftfoot += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].speed)/100)*numberOfWeeks;
                                    playerData[i].rightfoot += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Stabilisationstraining"){
                                    playerData[i].condition += (1/300)*(1*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                    playerData[i].athletics += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].athletics)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Spielformen 5-5 bis 10-10"){
                                    playerData[i].condition += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                    playerData[i].technique += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].technique)/100)*numberOfWeeks;
                                    playerData[i].duel += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                    playerData[i].tactics += (1/300)*(7*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].tactics)/100)*numberOfWeeks;
                                    playerData[i].athletics += (1/300)*(2*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].athletics)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Trainingsspiel"){
                                    playerData[i].condition += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                    playerData[i].technique += (1/300)*(3*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].technique)/100)*numberOfWeeks;
                                    playerData[i].header += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].header)/100)*numberOfWeeks;
                                    playerData[i].duel += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                    playerData[i].tactics += (1/300)*(5*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].tactics)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Spielformen bis 4-4"){
                                    playerData[i].condition += (1/300)*(6*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                    playerData[i].duel += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].duel)/100)*numberOfWeeks;
                                    playerData[i].athletics += (1/300)*(4*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].athletics)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Kondition"){
                                    playerData[i].condition += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                }
                                else if(trainingsBlockName=="Schnellkraft"){
                                    playerData[i].condition += (1/300)*(6*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].condition)/100)*numberOfWeeks;
                                    playerData[i].speed += (1/300)*(10*(trainingsBlockTime/15))*(playerData[i].talent/100)*ageFactor*((100-playerData[i].speed)/100)*numberOfWeeks;
                                }
                            }
                        }
                        if(playerData[i].positions=="TW"){
                            playerData[i].strength = (playerData[i].line+playerData[i].libero+playerData[i].foot+playerData[i].gameopening+playerData[i].runout+playerData[i].penaltyarea)/6;
                        }
                        else{
                            playerData[i].strength = (playerData[i].condition+playerData[i].speed+playerData[i].technique+playerData[i].shootingtechnique+playerData[i].shootingpower+playerData[i].header+playerData[i].duel+playerData[i].tactics+playerData[i].leftfoot+playerData[i].rightfoot+playerData[i].athletics)/11;
                        }
                    }
                    $("#playerTrainingRow"+playerData[i].ID).after(
                        "<div class=\"trainingsplan-player-overviewX trainingsplan-player-development-forecast-"+playerData[i].ID+"\" style=\"position:relative;clear:both;font-size:15px;margin-top:5px;margin-bottom:3px;padding-left:5px;\">"+
                            "<span>Prognosewerte: </span>"+
                            "<span class=\"forecast-value\"> &Oslash; "+playerData[i].strength.toFixed(1)+" | </span>"+
                        "</div>"
                    );
                    if(playerData[i].positions=="TW"){
                        $(".trainingsplan-player-development-forecast-"+playerData[i].ID).append(
                            "<span>Spieleröffnung:</span><span class=\"forecast-value\"> "+playerData[i].gameopening.toFixed(1)+" | </span>"+
                            "<span>Linie:</span><span class=\"forecast-value\"> "+playerData[i].line.toFixed(1)+" | </span>"+
                            "<span>Rauslaufen:</span><span class=\"forecast-value\"> "+playerData[i].runout.toFixed(1)+" | </span>"+
                            "<span>Libero:</span><span class=\"forecast-value\"> "+playerData[i].libero.toFixed(1)+" | </span>"+
                            "<span>Strafraum:</span><span class=\"forecast-value\"> "+playerData[i].penaltyarea.toFixed(1)+" | </span>"+
                            "<span>Fuß:</span><span class=\"forecast-value\"> "+playerData[i].foot.toFixed(1)+"</span>"
                        );
                    }
                    else{
                        $(".trainingsplan-player-development-forecast-"+playerData[i].ID).append(
                            "<span>Rechter Fuß:</span><span class=\"forecast-value\"> "+playerData[i].rightfoot.toFixed(1)+" | </span>"+
                            "<span>Linker Fuß:</span><span class=\"forecast-value\"> "+playerData[i].leftfoot.toFixed(1)+" | </span>"+
                            "<span>Kondition:</span><span class=\"forecast-value\"> "+playerData[i].condition.toFixed(1)+" | </span>"+
                            "<span>Schnelligkeit:</span><span class=\"forecast-value\"> "+playerData[i].speed.toFixed(1)+" | </span>"+
                            "<span>Technik:</span><span class=\"forecast-value\"> "+playerData[i].technique.toFixed(1)+" | </span>"+
                            "<span>Schusstechnik:</span><span class=\"forecast-value\"> "+playerData[i].shootingtechnique.toFixed(1)+" | </span>"+
                            "<span>Schusskraft:</span><span class=\"forecast-value\"> "+playerData[i].shootingpower.toFixed(1)+" | </span>"+
                            "<span>Kopfball:</span><span class=\"forecast-value\"> "+playerData[i].header.toFixed(1)+" | </span>"+
                            "<span>Zweikampf:</span><span class=\"forecast-value\"> "+playerData[i].duel.toFixed(1)+" | </span>"+
                            "<span>Taktik:</span><span class=\"forecast-value\"> "+playerData[i].tactics.toFixed(1)+" | </span>"+
                            "<span>Athletik:</span><span class=\"forecast-value\"> "+playerData[i].athletics.toFixed(1)+"</span>"
                        );
                    }
                }
                else{
                    $("#playerTrainingRow"+playerData[i].ID).after(
                        "<div class=\"trainingsplan-player-overviewX trainingsplan-player-development-forecast-"+playerData[i].ID+"\" style=\"position:relative;clear:both;font-size:15px;margin-top:5px;margin-bottom:3px;padding-left:5px;\">"+
                            "<span class=\"forecast-value\">Spieler bereits 30 Jahre oder älter!</span>"+
                        "</div>"
                    );
                }
                $(".trainingsplan-player-development-forecast-"+playerData[i].ID).css("background", "#d9d9d9");
            }
            $(".forecast-value").css("font-weight", "bold");
        }

        function calculatePlayerDevelopmentForecast(playerData, trainingsBlockTime, trainingsBlockName){
            let numberOfSeasonsForDevelopmentCalculation = 30-playerData.age;
            for(i=0;i<numberOfSeasonsForDevelopmentCalculation;i++){
                let ageFactor;
                if(playerData.age+i==17){
                    ageFactor = 1.3;
                }
                else if(playerData.age+i==18){
                    ageFactor = 1.2;
                }
                else if(playerData.age+i==19){
                    ageFactor = 1.1;
                }
                else if(playerData.age+i>19 && playerData.age+i<26){
                    ageFactor = 1;
                }
                else if(playerData.age+i>25 && playerData.age+i<28){
                    ageFactor = 0.9;
                }
                else if(playerData.age+i==28){
                    ageFactor = 0.8;
                }
                else if(playerData.age+i==29){
                    ageFactor = 0.7;
                }
                let numberOfWeeks;
                if(i==0){
                    if(playerData.birthday>currentWeek){
                        numberOfWeeks = playerData.birthday-currentWeek;
                    }
                    else{
                        numberOfWeeks = 44-currentWeek+playerData.birthday;
                    }
                }
                else{
                    numberOfWeeks = 44;
                }
                calculateSkillsDevelopmentForecast(playerData, trainingsBlockTime, trainingsBlockName, ageFactor, numberOfWeeks)
            }
        }

        function calculateSkillsDevelopmentForecast(playerData, trainingsBlockTime, trainingsBlockName, ageFactor, numberOfWeeks){
            if(playerData.position=="TW"){
                switch(trainingsBlockName) {
                    case "Taktik":
                        playerData.libero += (1/300)*(2*(trainingsBlockTime/15))*playerData.talent*ageFactor*((100-playerData.libero)/100)*numberOfWeeks;
                        playerData.gameopening += (1/300)*(3*(trainingsBlockTime/15))*playerData.talent*ageFactor*((100-playerData.gameopening)/100)*numberOfWeeks;
                        break;
                }
            }
            else{
                switch(trainingsBlockName) {
                    case "Taktik":
                        playerData.taktik += (1/300)*(10*(trainingsBlockTime/15))*playerData.talent*ageFactor*((100-playerData.taktik)/100)*numberOfWeeks;
                        break;
                }
            }
        }

        async function createTeamOverview(divName){
            let teamDataOfCurrentLeague = getTeamDataOfCurrentLeague();
            let playerDataofCurrentLeague = getPlayerSquadInformationOfCurrentLeagueTeams(divName, teamDataOfCurrentLeague);
            getPlayerData(divName, playerDataofCurrentLeague);
            sortPlayerData(playerDataofCurrentLeague);
            calculateTeamOverview(teamDataOfCurrentLeague, playerDataofCurrentLeague);
            sortTeamData(teamDataOfCurrentLeague);
            createTeamOverviewResultDiv(divName, teamDataOfCurrentLeague);
        }

        async function createJugiOverview(divName){
            let teamDataOfCurrentLeague = getTeamDataOfCurrentLeague();
            let playerDataofCurrentLeague = getPlayerSquadInformationOfCurrentLeagueTeams(divName, teamDataOfCurrentLeague);
            let season;
            if(currentWeek < 38){
                season = lastSeason;
            }
            else{
                season = currentSeason;
            }
            let numberOfPotentialJugis = 0;
            for(i=0;i<playerDataofCurrentLeague.length;i++){
                if(playerDataofCurrentLeague[i].age < 25){
                    numberOfPotentialJugis++;
                }
            }
            createCounterDiv(divName, "Anzahl überprüfter potenzieller Jugikandidaten: ", numberOfPotentialJugis);
            let counterOfPotentialJugis = 0;
            for(i=0;i<playerDataofCurrentLeague.length;i++){
                if(playerDataofCurrentLeague[i].age < 25){
                    findLatestJugisFromCurrentTeam(divName, season, playerDataofCurrentLeague[i], numberOfPotentialJugis, counterOfPotentialJugis);
                    counterOfPotentialJugis++;
                }
                else{
                    playerDataofCurrentLeague[i].isCurrentJugiFromCurrentTeam = false;
                }
            }
            let numberOfJugis = 0;
            for(i=0;i<playerDataofCurrentLeague.length;i++){
                if(playerDataofCurrentLeague[i].isCurrentJugiFromCurrentTeam){
                    numberOfJugis++;
                }
            }
            createCounterDiv(divName, "Anzahl durchsuchter Jugis nach Eigenschaften: ", numberOfJugis);
            let counterOfJugis = 0;
            for(i=0;i<playerDataofCurrentLeague.length;i++){
                if(playerDataofCurrentLeague[i].isCurrentJugiFromCurrentTeam){
                    getJugiData(divName, playerDataofCurrentLeague[i], numberOfJugis, counterOfJugis);
                    counterOfJugis++;
                }
            }
            sortJugiData(playerDataofCurrentLeague);
            createJugiOverviewResultDiv(divName, playerDataofCurrentLeague);
        }

        async function createTransferOverview(divName){
            let teamDataOfCurrentLeague = getTeamDataOfCurrentLeague();
            let transferDataOfCurrentLeague;
            if(currentWeek<21){
                let transferDataofCurrentLeagueLastSeason = getTransferInformationOfCurrentLeagueTeams(divName, teamDataOfCurrentLeague, lastSeason);
                let counterForTransfersLastSeason = 1;
                transferDataOfCurrentLeague = getTransferInformationOfCurrentLeagueTeams(divName, teamDataOfCurrentLeague, currentSeason);
                for(i=0;i<transferDataofCurrentLeagueLastSeason.length;i++){
                    if(transferDataofCurrentLeagueLastSeason[i].transferWeek>0){
                        transferDataOfCurrentLeague[transferDataOfCurrentLeague.length+counterForTransfersLastSeason] = transferDataofCurrentLeagueLastSeason[i];
                        counterForTransfersLastSeason++;
                    }
                }
            }
            else{
                transferDataOfCurrentLeague = getTransferInformationOfCurrentLeagueTeams(divName, teamDataOfCurrentLeague, currentSeason);
            }
            transferDataOfCurrentLeague = transferDataOfCurrentLeague.filter(function(removeNullElements){
                return removeNullElements != null;
            });
            getPlayerDataForTransferInformation(divName, transferDataOfCurrentLeague);
            sortTransferData(transferDataOfCurrentLeague);
            createTransferOverviewResultDiv(divName, transferDataOfCurrentLeague);
        }

        function createTeamOverviewResultDiv(fatherDiv, teamData){
            $("#"+fatherDiv).append(
                "<div class=\""+fatherDiv+"-result\"></div>"
            );
            $("."+fatherDiv+"-result").append(
                "<table id=\""+fatherDiv+"-result-table\">"+
                    "<tr class=\""+fatherDiv+"-result-table-row tablehead\">"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Nr.</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Logo</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Verein</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Spieleranzahl</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Top10 FS</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Top13 FS</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Top15 FS</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Top20 FS</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Top TW</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Top2 TW</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Team</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Talent</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Alter</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Teammarktwert</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Spielermarktwert</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Teamgehälter</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">&Oslash; Spielergehälter</th>"+
                    "</tr>"+
                "</table>"
            );
            let numberOfAverageLeaguePlayers = 0;
            let leagueAverageTopTenStrengthOfCurrentFieldPlayers = 0;
            let leagueAverageTopThirteenStrengthOfCurrentFieldPlayers = 0;
            let leagueAverageTopFifteenStrengthOfCurrentFieldPlayers = 0;
            let leagueAverageTopTwentyStrengthOfCurrentFieldPlayers = 0;
            let leagueAverageTopStrengthOfCurrentKeepers = 0;
            let leagueAverageTopTwoStrengthOfCurrentKeepers = 0;
            let leagueAverageStrengthOfCurrentPlayers = 0;
            let leagueAverageTalentOfCurrentPlayers = 0;
            let leagueAverageAgeOfCurrentPlayers = 0;
            let leagueAverageMarketValueOfCurrentPlayers = 0;
            let leagueAverageAverageMarketValueOfCurrentPlayers = 0;
            let leagueAverageSalaryOfCurrentPlayers = 0;
            let leagueAverageAverageSalaryOfCurrentPlayers = 0;
            for(i=0;i<teamData.length;i++){
                $("#"+fatherDiv+"-result-table").append(
                    "<tr class=\""+fatherDiv+"-result-table-row\">"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+(i+1)+".</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+teamData[i].ID+"\" target=\"_blank\"><img src=\""+teamData[i].logo+"\" height=\"13px\"></a></td>"+
                        "<td class=\""+fatherDiv+"-result-table-td\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+teamData[i].ID+"\" target=\"_blank\">"+teamData[i].name+"</a></td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].numberOfCurrentPlayers+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageTopTenStrengthOfCurrentFieldPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageTopThirteenStrengthOfCurrentFieldPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageTopFifteenStrengthOfCurrentFieldPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageTopTwentyStrengthOfCurrentFieldPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].topStrengthOfCurrentKeepers+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageTopTwoStrengthOfCurrentKeepers+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageStrengthOfCurrentPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageTalentOfCurrentPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+teamData[i].averageAgeOfCurrentPlayers.toString().replace(".",",")+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(teamData[i].marketValueOfCurrentPlayers)+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(teamData[i].averageMarketValueOfCurrentPlayers)+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(teamData[i].salaryOfCurrentPlayers)+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(teamData[i].averageSalaryOfCurrentPlayers)+"</td>"+
                    "</tr>"
                );
                numberOfAverageLeaguePlayers += teamData[i].numberOfCurrentPlayers;
                leagueAverageTopTenStrengthOfCurrentFieldPlayers += teamData[i].averageTopTenStrengthOfCurrentFieldPlayers;
                leagueAverageTopThirteenStrengthOfCurrentFieldPlayers += teamData[i].averageTopThirteenStrengthOfCurrentFieldPlayers;
                leagueAverageTopFifteenStrengthOfCurrentFieldPlayers += teamData[i].averageTopFifteenStrengthOfCurrentFieldPlayers;
                leagueAverageTopTwentyStrengthOfCurrentFieldPlayers += teamData[i].averageTopTwentyStrengthOfCurrentFieldPlayers;
                leagueAverageTopStrengthOfCurrentKeepers += teamData[i].topStrengthOfCurrentKeepers;
                leagueAverageTopTwoStrengthOfCurrentKeepers += teamData[i].averageTopTwoStrengthOfCurrentKeepers;
                leagueAverageStrengthOfCurrentPlayers += teamData[i].averageStrengthOfCurrentPlayers;
                leagueAverageTalentOfCurrentPlayers += teamData[i].averageTalentOfCurrentPlayers;
                leagueAverageAgeOfCurrentPlayers += teamData[i].averageAgeOfCurrentPlayers;
                leagueAverageMarketValueOfCurrentPlayers += teamData[i].marketValueOfCurrentPlayers;
                leagueAverageAverageMarketValueOfCurrentPlayers += teamData[i].averageMarketValueOfCurrentPlayers;
                leagueAverageSalaryOfCurrentPlayers += teamData[i].salaryOfCurrentPlayers;
                leagueAverageAverageSalaryOfCurrentPlayers += teamData[i].averageSalaryOfCurrentPlayers;
            }
            $("."+fatherDiv+"-result-table-row:last-child").after(
                "<tr class=\""+fatherDiv+"-result-table-row\">"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\"></td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\"></td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average right\">Ligaschnitt:</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+Math.round((numberOfAverageLeaguePlayers/teamData.length)*10)/10+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTopTenStrengthOfCurrentFieldPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTopThirteenStrengthOfCurrentFieldPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTopFifteenStrengthOfCurrentFieldPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTopTwentyStrengthOfCurrentFieldPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTopStrengthOfCurrentKeepers/teamData.length)*10)/10)+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTopTwoStrengthOfCurrentKeepers/teamData.length)*10)/10)+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageStrengthOfCurrentPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageTalentOfCurrentPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average center\">"+(Math.round((leagueAverageAgeOfCurrentPlayers/teamData.length)*10)/10).toString().replace(".",",")+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average right\">"+euro.format(Math.round(leagueAverageMarketValueOfCurrentPlayers/teamData.length))+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average right\">"+euro.format(Math.round(leagueAverageAverageMarketValueOfCurrentPlayers/teamData.length))+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average right\">"+euro.format(Math.round(leagueAverageSalaryOfCurrentPlayers/teamData.length))+"</td>"+
                    "<td class=\""+fatherDiv+"-result-table-td league-average right\">"+euro.format(Math.round(leagueAverageAverageSalaryOfCurrentPlayers/teamData.length))+"</td>"+
                "</tr>"
            );
            $("th").attr("style","padding: 0px 4px 0px 4px;");
            $("."+fatherDiv+"-result-table-td.center").attr("style","text-align: center;");
            $("."+fatherDiv+"-result-table-td.right").attr("style","text-align: right;");
            $("."+fatherDiv+"-result-table-td.league-average").css("border-top","1px solid");
            $("."+fatherDiv+"-result-table-td.league-average").css("font-weight","550");
        }

        function createJugiOverviewResultDiv(fatherDiv, playerData){
            let counterOfJugis = 0;
            $("#"+fatherDiv).append(
                "<div class=\""+fatherDiv+"-result\"></div>"
            );
            $("."+fatherDiv+"-result").append(
                "<table id=\""+fatherDiv+"-result-table\">"+
                    "<tr class=\""+fatherDiv+"-result-table-row\">"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Nr.</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Logo</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Verein</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Spieler</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Alter</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Stärke</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Talent</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Positionen</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Gehalt</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Marktwert</th>"+
                    "</tr>"+
                "</table>"
            );
            for(i=0;i<playerData.length;i++){
                if(playerData[i].isCurrentJugiFromCurrentTeam){
                    let talent;
                    if(playerData[i].isTalentDetermined){
                        talent = playerData[i].talent + "+";
                    }
                    else{
                        talent = playerData[i].talent;
                    }
                    $("#"+fatherDiv+"-result-table").append(
                        "<tr class=\""+fatherDiv+"-result-table-row tablehead\">"+
                            "<td class=\""+fatherDiv+"-result-table-td center\">"+(counterOfJugis+1)+".</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td center\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+playerData[i].currentTeamID+"\" target=\"_blank\"><img src=\""+playerData[i].currentTeamLogo+"\" height=\"13px\"></a></td>"+
                            "<td class=\""+fatherDiv+"-result-table-td\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+playerData[i].currentTeamID+"\" target=\"_blank\">"+playerData[i].currentTeamName+"</a>&nbsp;&nbsp;</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td\"><a href=\"https://www.onlineliga.de/#url=player/overview?playerId="+playerData[i].ID+"\" target=\"_blank\">"+playerData[i].name+"</a></td>"+
                            "<td class=\""+fatherDiv+"-result-table-td center\">"+playerData[i].age+"</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td center\">"+playerData[i].strength+"</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td center\">"+talent+"</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td center\">"+playerData[i].positions+"&nbsp;&nbsp;</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(playerData[i].salary)+"&nbsp;&nbsp;</td>"+
                            "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(playerData[i].marketValue)+"</td>"+
                        "</tr>"
                    );
                    counterOfJugis++;
                }
            }
            $("th").attr("style","padding: 0px 4px 0px 4px;");
            $("."+fatherDiv+"-result-table-td.center").attr("style","text-align: center;");
            $("."+fatherDiv+"-result-table-td.right").attr("style","text-align: right;");
        }

        function createTransferOverviewResultDiv(fatherDiv, transferData){
            $("#"+fatherDiv).append(
                "<div class=\""+fatherDiv+"-result\"></div>"
            );
            $("."+fatherDiv+"-result").append(
                "<table id=\""+fatherDiv+"-result-table\">"+
                    "<tr class=\""+fatherDiv+"-result-table-row\">"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Nr.</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferSeason\">Saison&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferWeek\">Woche&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferTeamLogo\">Logo&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferTeamName\">Verein&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\"></th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\"></th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Spieler</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferPlayerAge\">Alter&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferPlayerStrength\">Stärke&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferPlayerTalent\">Talent&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferPlayerPositions\">Positionen&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferPlayerSalary\">Gehalt&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferPlayerMarketValue\">Marktwert&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th transferTransferMoney\">Ablösesumme&blacktriangledown;</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Logo</th>"+
                        "<th class=\""+fatherDiv+"-result-table-th\">Partnerverein</th>"+
                    "</tr>"+
                "</table>"
            );
            for(i=0;i<transferData.length;i++){
                let talent;
                if(transferData[i].playerTalentIsDetermind){
                    talent = transferData[i].playerTalent + "+";
                }
                else{
                    talent = transferData[i].playerTalent;
                }
                let colorTransferMoney;
                let colorTransferArrow;
                if(transferData[i].transferMoney>0){
                    colorTransferMoney = "green";
                    colorTransferArrow = "redArrow";
                }
                else{
                    colorTransferMoney = "red";
                    colorTransferArrow = "greenArrow";
                }
                let transferPartnerTeam;
                if(transferData[i].transferPartnerStatus=="inactive"){
                    transferPartnerTeam = "italic";
                }
                else if(transferData[i].transferPartnerStatus=="none"){
                    transferPartnerTeam = "clubless";
                }
                else{
                    transferPartnerTeam = "";
                }
                $("#"+fatherDiv+"-result-table").append(
                    "<tr class=\""+fatherDiv+"-result-table-row\">"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+(i+1)+".</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+transferData[i].transferSeason+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+transferData[i].transferWeek+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+transferData[i].currentTeamID+"\" target=\"_blank\"><img src=\""+transferData[i].currentTeamLogo+"\" height=\"13px\"></a></td>"+
                        "<td class=\""+fatherDiv+"-result-table-td\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+transferData[i].currentTeamID+"\" target=\"_blank\">"+transferData[i].currentTeamName+"</a>&nbsp;&nbsp;</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center "+colorTransferArrow+"\">&#9650;</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center "+colorTransferArrow+"\">&nbsp;</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td\"><a href=\"https://www.onlineliga.de/#url=player/overview?playerId="+transferData[i].playerID+"\" target=\"_blank\">"+transferData[i].playerName+"</a></td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+transferData[i].playerAge+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+transferData[i].playerStrength+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+talent+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\">"+transferData[i].playerPositions+"&nbsp;&nbsp;</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(transferData[i].playerSalary)+"&nbsp;&nbsp;</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right\">"+euro.format(transferData[i].playerMarketValue)+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td right "+colorTransferMoney+"\">"+euro.format(transferData[i].transferMoney)+"</td>"+
                        "<td class=\""+fatherDiv+"-result-table-td center\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+transferData[i].transferPartnerID+"\" target=\"_blank\"><img src=\""+transferData[i].transferPartnerLogo+"\" height=\"13px\"></a></td>"+
                        "<td class=\""+fatherDiv+"-result-table-td "+transferPartnerTeam+"\"><a href=\"https://www.onlineliga.de/#url=team/overview?userId="+transferData[i].transferPartnerID+"\" target=\"_blank\">"+transferData[i].transferPartnerName+"</a>&nbsp;&nbsp;</td>"+
                    "</tr>"
                );
            }
            $("th").css("padding","0px 4px");
            $("."+fatherDiv+"-result-table-td.center").css("text-align","center");
            $("."+fatherDiv+"-result-table-td.center.greenArrow").attr("style","color: #357c35; transform: rotate(-90deg);");
            $("."+fatherDiv+"-result-table-td.center.redArrow").attr("style","color: #e5332a; transform: rotate(90deg);");
            $("."+fatherDiv+"-result-table-td.right").attr("style","text-align: right;");
            $("."+fatherDiv+"-result-table-td.right.green").attr("style","text-align: right; color: #357c35;");
            $("."+fatherDiv+"-result-table-td.right.red").attr("style","text-align: right; color: #e5332a;");
            $("."+fatherDiv+"-result-table-td.italic a").attr("style", "color: #646464 !important; font-style: italic;");
            $("."+fatherDiv+"-result-table-td.clubless a").attr("style","color: #e5332a !important;");
            $("."+fatherDiv+"-result-table-th.transferSeason" || "."+fatherDiv+"-result-table-th.transferWeek").hover(function(){
                $(this).css("color", "#00B050");
            },function(){
                $(this).css("color", "#333");
            });
            $(".transferTeamLogo" || ".transferTeamName").click(function() {
                sortTransferDataNew(transferData, 1);
                $("."+fatherDiv+"-result").remove();
                createTransferOverviewResultDiv(fatherDiv, transferData);
            });
        }

        function sortTeamData(teamData){
            teamData.sort(function(a, b){
                return b.averageTopTenStrengthOfCurrentFieldPlayers - a.averageTopTenStrengthOfCurrentFieldPlayers;
            });
        }

        function sortPlayerData(playerData){
            playerData.sort(function(a, b){
                return b.strength - a.strength;
            });
            playerData.sort(function(a, b){
                return b.currentTeamID - a.currentTeamID;
            });
        }

        function sortJugiData(playerData){
            playerData.sort(function(a, b){
                return b.marketValue - a.marketValue;
            });
        }

        function sortTransferData(transferData){
            transferData.sort(function(a, b){
                return b.currentTeamID - a.currentTeamID;
            });
            transferData.sort(function(a, b){
                return b.transferWeek - a.transferWeek;
            });
            transferData.sort(function(a, b){
                return b.transferSeason - a.transferSeason;
            });
        }

        function sortTransferDataNew(transferData, column){
            transferData.sort(function(a, b){
                switch(column){
                    case 1:
                        return b.currentTeamID - a.currentTeamID;
                }
            });
        }

        function calculateTeamOverview(teamData, playerData){
            for(i=0;i<teamData.length;i++){
                let numberOfPlayersWithoutTalent = 0
                let counterFieldPlayer = 0;
                let counterKeeper = 0;
                let teamStrength = 0;
                let teamTopTenStrength = 0;
                let teamTopThirteenStrength = 0;
                let teamTopFifteenStrength = 0;
                let teamTopTwentyStrength = 0;
                let teamTopKeeper = 0;
                let teamTopTwoKeeper = 0;
                let teamAge = 0;
                let teamTalent = 0;
                let teamMarketValue = 0;
                let teamSalary = 0;
                for(j=0;j<playerData.length;j++){
                    if(teamData[i].ID == playerData[j].currentTeamID){
                        teamStrength = teamStrength + playerData[j].strength;
                        if(playerData[j].positions!="TW" && counterFieldPlayer<10){
                            teamTopTenStrength = teamTopTenStrength + playerData[j].strength;
                        }
                        if(playerData[j].positions!="TW" && counterFieldPlayer<13){
                            teamTopThirteenStrength = teamTopThirteenStrength + playerData[j].strength;
                        }
                        if(playerData[j].positions!="TW" && counterFieldPlayer<15){
                            teamTopFifteenStrength = teamTopFifteenStrength + playerData[j].strength;
                        }
                        if(playerData[j].positions!="TW" && counterFieldPlayer<20){
                            teamTopTwentyStrength = teamTopTwentyStrength + playerData[j].strength;
                            counterFieldPlayer++;
                        }
                        if(playerData[j].positions=="TW" && teamTopKeeper==0){
                            teamTopKeeper = playerData[j].strength;
                        }
                        if(playerData[j].positions=="TW" && counterKeeper<2){
                            teamTopTwoKeeper = teamTopTwoKeeper + playerData[j].strength;
                            counterKeeper++;
                        }
                        teamAge = teamAge + playerData[j].age;
                        if(!isNaN(playerData[j].talent)){
                            teamTalent = teamTalent + playerData[j].talent;
                        }
                        else{
                            numberOfPlayersWithoutTalent++;
                        }
                        teamMarketValue = teamMarketValue + playerData[j].marketValue;
                        teamSalary = teamSalary + playerData[j].salary;
                    }
                }
                teamData[i].strengthOfCurrentPlayers = teamStrength;
                teamData[i].topFifteenStrengthOfCurrentFieldPlayers = teamTopFifteenStrength;
                teamData[i].ageOfCurrentPlayers = teamAge;
                teamData[i].talentOfCurrentPlayers = teamTalent;
                teamData[i].marketValueOfCurrentPlayers = teamMarketValue;
                teamData[i].salaryOfCurrentPlayers = teamSalary;
                teamData[i].averageStrengthOfCurrentPlayers = Math.round((teamStrength/teamData[i].numberOfCurrentPlayers)*10)/10;
                teamData[i].averageTopTenStrengthOfCurrentFieldPlayers = Math.round((teamTopTenStrength/Math.min(10,counterFieldPlayer))*10)/10;
                teamData[i].averageTopThirteenStrengthOfCurrentFieldPlayers = Math.round((teamTopThirteenStrength/Math.min(13,counterFieldPlayer))*10)/10;
                teamData[i].averageTopFifteenStrengthOfCurrentFieldPlayers = Math.round((teamTopFifteenStrength/Math.min(15,counterFieldPlayer))*10)/10;
                teamData[i].averageTopTwentyStrengthOfCurrentFieldPlayers = Math.round((teamTopTwentyStrength/Math.min(20,counterFieldPlayer))*10)/10;
                teamData[i].topStrengthOfCurrentKeepers = teamTopKeeper;
                teamData[i].averageTopTwoStrengthOfCurrentKeepers = Math.round((teamTopTwoKeeper/Math.min(2,counterKeeper))*10)/10;
                teamData[i].averageAgeOfCurrentPlayers = Math.round((teamAge/teamData[i].numberOfCurrentPlayers)*10)/10;
                if(teamData[i].numberOfCurrentPlayers==numberOfPlayersWithoutTalent){
                    parseFloat("0.0");
                }
                else{
                    teamData[i].averageTalentOfCurrentPlayers = Math.round((teamTalent/(teamData[i].numberOfCurrentPlayers-numberOfPlayersWithoutTalent))*10)/10;
                }
                teamData[i].averageMarketValueOfCurrentPlayers = Math.round(teamMarketValue/teamData[i].numberOfCurrentPlayers);
                teamData[i].averageSalaryOfCurrentPlayers = Math.round(teamSalary/teamData[i].numberOfCurrentPlayers);
            }
        }

        function findLatestJugisFromCurrentTeam(divName, season, playerData, numberOfPotentialJugis, counterOfPotentialJugis){
            let link = "/player/transferhistory?playerId="+playerData.ID;
            let playerTransferhistory = $.ajax({type: "GET", url: link, async: false}).responseText;
            let numberOfRows = $("<div>" + playerTransferhistory + "</div>").find(".col-lg-3.col-md-3.col-sm-3.hidden-xs.text-center").length;
            let seasonOfEntrance = $("<div>" + playerTransferhistory + "</div>").find(".col-lg-3.col-md-3.col-sm-3.hidden-xs.text-center").eq(numberOfRows-2).text();
            let nameOfCurrentTeam = $("<div>" + playerTransferhistory + "</div>").find(".ol-team-name").last().text().trim();
            let nameOfHomeTeam = $("<div>" + playerTransferhistory + "</div>").find(".transferhistory-former-team span").last().text();
            if(seasonOfEntrance==season && nameOfHomeTeam=="Heimatverein  (Jugend)" && nameOfCurrentTeam==playerData.currentTeamName){
                playerData.isCurrentJugiFromCurrentTeam = true;
            }
            else{
                playerData.isCurrentJugiFromCurrentTeam = false;
            }
            $("."+divName+"-counter-number-"+counterNumber).remove();
            $("."+divName+"-counter-"+counterNumber).append(
                "<span class=\""+divName+"-counter-number-"+counterNumber+"\">"+(counterOfPotentialJugis+1)+" von "+numberOfPotentialJugis+"</span>"
            );
        }

        function getTeamDataOfCurrentLeague(){
            let numberOfTeams = $("#ol-td .ol-team-name").length;
            let teamData = new Array(numberOfTeams);
            for(i=0;i<numberOfTeams;i++) {
                teamData[i] = new Team();
                teamData[i].ID = parseInt($("#ol-td .ol-team-name").eq(i).attr("onclick").match(/[0-9]+/g));
                teamData[i].name = $("#ol-td .ol-team-name").eq(i).text().trim();
                if(typeof($("<div>" + $(".ol-table-number").eq(i)[0].offsetParent.innerHTML + "</div>").find("img").attr("src")) === "undefined"){
                    teamData[i].logo = "https://www.onlineliga.de/imgs/ol_logo_ball.svg";
                }
                else{
                    teamData[i].logo = $("<div>" + $(".ol-table-number").eq(i)[0].offsetParent.innerHTML + "</div>").find("img").attr("src");
                }
            }
            return(teamData);
        }

        function getPlayerSquadInformationOfCurrentLeagueTeams(divName, teamData){
            let counter = 0;
            let player = [];
            createCounterDiv(divName, "Anzahl durchsuchter Ligateams nach Spieler-IDs: ", teamData.length);
            for(i=0;i<teamData.length;i++) {
                let link = "/team/overview/squad?userId="+teamData[i].ID;
                let teamSquad = $.ajax({type: "GET", url: link, async: false}).responseText;
                teamData[i].numberOfCurrentPlayers = $("<div>" + teamSquad + "</div>").find(".ol-player-name").length;
                for(j=0;j<teamData[i].numberOfCurrentPlayers;j++) {
                    player[counter] = new Player();
                    player[counter].currentTeamID = teamData[i].ID;
                    player[counter].currentTeamName = teamData[i].name;
                    player[counter].currentTeamLogo = teamData[i].logo;
                    player[counter].ID = parseInt($("<div>" + teamSquad + "</div>").find(".ol-player-name").eq(j).attr("onclick").match(/[0-9]+/g)), parseInt($("<div>" + teamSquad + "</div>").find(".ol-player-name").eq(j).text());
                    player[counter].name = $("<div>" + teamSquad + "</div>").find(".ol-player-name").eq(j).text();
                    player[counter].age = parseInt($("<div>" + teamSquad + "</div>").find(".team-overview-squad-row #sqaudAge").eq(j).text());
                    player[counter].positions = $("<div>" + teamSquad + "</div>").find(".team-overview-squad-row .team-squad-overview-position").eq(j).text();
                    player[counter].leagueGamesThisSeason = parseInt($("<div>" + teamSquad + "</div>").find(".team-overview-squad-row").eq(j).find(".col-md-6.col-lg-6.col-sm-12.col-xs-12").eq(1).children(0).children(0)[0].innerText);
                    player[counter].leagueGoalsThisSeason = parseInt($("<div>" + teamSquad + "</div>").find(".team-overview-squad-row").eq(j).find(".col-md-6.col-lg-6.col-sm-12.col-xs-12").eq(1).children(0).children(0)[1].innerText);
                    player[counter].leagueAssistsThisSeason = parseInt($("<div>" + teamSquad + "</div>").find(".team-overview-squad-row").eq(j).find(".col-md-6.col-lg-6.col-sm-12.col-xs-12").eq(1).children(0).children(0)[2].innerText);
                    player[counter].marketValue = parseInt($("<div>" + teamSquad + "</div>").find(".col-md-3.col-lg-3.col-sm-6.col-xs-6.text-right").eq(j).text().trim().replace(/\./g, "").match(/[0-9]+/g));
                    counter++;
                }
                $("."+divName+"-counter-number-"+counterNumber).remove();
                $("."+divName+"-counter-"+counterNumber).append(
                    "<span class=\""+divName+"-counter-number-"+counterNumber+"\">"+(i+1)+" von "+teamData.length+"</span>"
                );
            }
            return player;
        }

        function getTransferInformationOfCurrentLeagueTeams(divName, teamData, season){
            let counter = 0;
            let transfer = [];
            createCounterDiv(divName, "Anzahl durchsuchter Ligateams nach Transfers in Saison "+season+": ", teamData.length);
            for(i=0;i<teamData.length;i++) {
                let link = "/team/overview/transferhistory/season?userId="+teamData[i].ID+"&season="+season;
                let teamTransfers = $.ajax({type: "GET", url: link, async: false}).responseText;
                teamData[i].numberOfTeamTransfers = $("<div>" + teamTransfers + "</div>").find(".ol-state-striped-0 .pointer").length;
                for(j=0;j<teamData[i].numberOfTeamTransfers;j++) {
                    transfer[counter] = new Transfer();
                    transfer[counter].currentTeamID = teamData[i].ID;
                    transfer[counter].currentTeamName = teamData[i].name;
                    transfer[counter].currentTeamLogo = teamData[i].logo;
                    transfer[counter].playerID = parseInt($("<div>" + teamTransfers + "</div>").find(".player-quick-overview-launcher").eq(j).attr("onclick").match(/[0-9]+/g));
                    transfer[counter].playerName = $("<div>" + teamTransfers + "</div>").find(".player-name .pointer").eq(j).text().trim();
                    if($("<div>" + teamTransfers + "</div>").find(".col-lg-2.col-md-3.col-sm-3.col-xs-4.text-right.nowrap.bold").eq(j).text().trim().slice(0,1)=="-"){
                        transfer[counter].transferMoney = parseInt("-"+$("<div>" + teamTransfers + "</div>").find(".col-lg-2.col-md-3.col-sm-3.col-xs-4.text-right.nowrap.bold").eq(j).text().trim().replace(/\./g, "").match(/[0-9]+/g));
                    }
                    else{
                        transfer[counter].transferMoney = parseInt($("<div>" + teamTransfers + "</div>").find(".col-lg-2.col-md-3.col-sm-3.col-xs-4.text-right.nowrap.bold").eq(j).text().trim().replace(/\./g, "").match(/[0-9]+/g));
                    }
                    transfer[counter].transferSeason = season;
                    transfer[counter].transferWeek = parseInt($("<div>" + teamTransfers + "</div>").find(".ol-timestamp-string").eq(j).text().match(/[0-9]+/g));
                    if($("<div>" + teamTransfers + "</div>").find(".col-lg-6.col-md-6.col-sm-6.col-xs-6.text-overflow.transfer-to-col").eq(j).children().last().text().trim()=="Vereinslos"){
                        transfer[counter].transferPartnerID = "";
                        transfer[counter].transferPartnerStatus = "none";
                        transfer[counter].transferPartnerName = "Vereinslos";
                        transfer[counter].transferPartnerLogo = "https://www.onlineliga.de/imgs/ol_logo_ball.svg";
                    }
                    else{
                        transfer[counter].transferPartnerID = parseInt($("<div>" + teamTransfers + "</div>").find(".col-lg-6.col-md-6.col-sm-6.col-xs-6.text-overflow.transfer-to-col").eq(j).children().last().children().attr("onclick").match(/[0-9]+/g));
                        if($("<div>" + teamTransfers + "</div>").find(".col-lg-6.col-md-6.col-sm-6.col-xs-6.text-overflow.transfer-to-col").eq(j).children().last().children()[0].className==" ol-team-name-inactive"){
                            transfer[counter].transferPartnerStatus = "inactive";
                        }
                        else{
                            transfer[counter].transferPartnerStatus = "active";
                        }
                        transfer[counter].transferPartnerName = $("<div>" + teamTransfers + "</div>").find(".col-lg-6.col-md-6.col-sm-6.col-xs-6.text-overflow.transfer-to-col").eq(j).children().last().children().text().trim();
                        if(typeof($("<div>" + teamTransfers + "</div>").find(".col-lg-6.col-md-6.col-sm-6.col-xs-6.text-overflow.transfer-to-col").eq(j)[0].children[1].children[0].children[0])=="undefined"){
                            transfer[counter].transferPartnerLogo = "https://www.onlineliga.de/imgs/ol_logo_ball.svg";
                        }
                        else{
                            transfer[counter].transferPartnerLogo = $("<div>" + teamTransfers + "</div>").find(".col-lg-6.col-md-6.col-sm-6.col-xs-6.text-overflow.transfer-to-col").eq(j)[0].children[1].children[0].children[0].children[0].attributes[1].value;
                        }
                    }
                    counter++;
                }
                $("."+divName+"-counter-number-"+counterNumber).remove();
                $("."+divName+"-counter-"+counterNumber).append(
                    "<span class=\""+divName+"-counter-number-"+counterNumber+"\">"+(i+1)+" von "+teamData.length+"</span>"
                );
            }
            return transfer;
        }

        function getPlayerDataForTransferInformation(divName, transferData){
            createCounterDiv(divName, "Anzahl durchsuchter Spieler nach Eigenschaften: ", transferData.length);
            for(i=0;i<transferData.length;i++) {
                let link = "/player/overview?playerId="+transferData[i].playerID;
                let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
                transferData[i].playerStrength = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(0).html());
                transferData[i].playerAge = parseInt($("<div>" + playerOverview + "</div>").find(".ol-player-overview-player-position-age").text().trim().match(/[0-9]+/g));
                transferData[i].playerPositions = $("<div>" + playerOverview + "</div>").find(".ol-player-overview-player-position-age").text().trim().slice(10, 22).trim();
                transferData[i].playerMarketValue = parseInt($("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(8).text().trim().replace(/\./g, "").match(/[0-9]+/g));
                transferData[i].playerSalary = parseInt($("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(10).text().trim().replace(/\./g, "").match(/[0-9]+/g));
                if(transferData[i].playerPositions=="TW"){
                    transferData[i].playerTalent = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(8).text());
                }
                else{
                    transferData[i].playerTalent = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(11).text());
                }
                if($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-special-type").text().trim()=="(wird noch ermittelt)"){
                    transferData[i].playerTalentIsDetermind = true;
                }
                else{
                    transferData[i].playerTalentIsDetermind = false;
                }
                $("."+divName+"-counter-number-"+counterNumber).remove();
                $("."+divName+"-counter-"+counterNumber).append(
                    "<span class=\""+divName+"-counter-number-"+counterNumber+"\">"+(i+1)+" von "+transferData.length+"</span>"
                );
            }
        }

        function getPlayerData(divName, playerData){
            createCounterDiv(divName, "Anzahl durchsuchter Spieler: ", playerData.length);
            for(i=0;i<playerData.length;i++) {
                let link = "/player/overview?playerId="+playerData[i].ID;
                let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
                playerData[i].strength = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(0).html());
                playerData[i].salary = parseInt($("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(10).text().trim().replace(/\./g, "").match(/[0-9]+/g));
                if(playerData[i].positions=="TW"){
                    playerData[i].talent = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(8).text());
                }
                else{
                    playerData[i].talent = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(11).text());
                }
                if($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-special-type").text().trim()=="(wird noch ermittelt)"){
                    playerData[i].isTalentDetermind = true;
                }
                else{
                    playerData[i].isTalentDetermind = false;
                }
                $("."+divName+"-counter-number-"+counterNumber).remove();
                $("."+divName+"-counter-"+counterNumber).append(
                    "<span class=\""+divName+"-counter-number-"+counterNumber+"\">"+(i+1)+" von "+playerData.length+"</span>"
                );
            }
        }

        function getPlayerStrength(playerId){
            let link = "/player/overview?playerId="+playerId;
            let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
            return parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(0).html());
        }

        function getPlayerInjuryData(player){
            let link = "/player/injuries?playerId="+player.ID;
            let playerData = $.ajax({type: "GET", url: link, async: false}).responseText;
            player.numberOfInjuries = $("<div>" + playerData + "</div>").find("span.pull-left span.player-info-bandarole-big-font").eq(0).text().trim();
            player.lengthOfAllInjuries = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(0).text().trim();
            player.averageLengthOfAllInjuries = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(1).text().trim();
        }

        function getJugiData(divName, playerData, numberOfJugis, counterOfJugis){
            let link = "/player/overview?playerId="+playerData.ID;
            let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
            playerData.strength = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(0).html());
            playerData.salary = parseInt($("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(10).text().trim().replace(/\./g, "").match(/[0-9]+/g));
            if(playerData.positions=="TW"){
                playerData.talent = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(8).text());
            }
            else{
                playerData.talent = parseInt($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-value").eq(11).text());
            }
            if($("<div>" + playerOverview + "</div>").find(".ol-value-bar-small-label-special-type").text().trim()=="(wird noch ermittelt)"){
                playerData.isTalentDetermind = true;
            }
            else{
                playerData.isTalentDetermind = false;
            }
            $("."+divName+"-counter-number-"+counterNumber).remove();
            $("."+divName+"-counter-"+counterNumber).append(
                "<span class=\""+divName+"-counter-number-"+counterNumber+"\">"+(counterOfJugis+1)+" von "+numberOfJugis+"</span>"
            );
        }

        function getLastGameResult(teamData){
            let link = "/team/overview?userId="+teamData.ID;
            let teamOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
            let firstTeamNumber = $("<div>" + teamOverview + "</div>").find(".ol-team-name").eq(2).attr("onclick").match(/[0-9]+/g)[0];
            let resultArray = $("<div>" + teamOverview + "</div>").find(".team-overview-current-match").eq(0).text().trim().substring(0,7).split(":");
            let homeGoals = parseInt(resultArray[0].trim());
            let awayGoals = parseInt(resultArray[1].trim());
            let backgroundColor;
            if(teamData.ID == firstTeamNumber){
                if(homeGoals>awayGoals){
                    backgroundColor = "#A9D08E";
                }
                else if(homeGoals==awayGoals){
                    backgroundColor = "#FFD966";
                }
                else{
                    backgroundColor = "#F4B084";
                }
                teamData.lastGameResultHomeGoals = homeGoals;
                teamData.lastGameResultAwayGoals = awayGoals;
                teamData.lastGameResultBackgroundColor = backgroundColor;
            }
            else{
                if(homeGoals>awayGoals){
                    backgroundColor = "#F4B084";
                }
                else if(homeGoals==awayGoals){
                    backgroundColor = "#FFD966";
                }
                else{
                    backgroundColor = "#A9D08E";
                }
                teamData.lastGameResultHomeGoals = awayGoals;
                teamData.lastGameResultAwayGoals = homeGoals;
                teamData.lastGameResultBackgroundColor = backgroundColor;
            }
        }

        function getElevenOfTheYearData(){
            let leagueLevel = parseInt($("button#tooltipLeagueSelection span.ol-dropdown-text:first").text().match(/\d+/)[0]);
            let leagueId;
            if(leagueLevel==1){
                leagueId = parseInt($("#dropdown-matchday-table-league-level-matchdayTable").data("value"));
            }
            else if(leagueLevel==2 || leagueLevel==3 || leagueLevel==4){
                leagueId = parseInt($("#dropdown-matchday-table-1-matchdayTable").data("value"));
            }
            else if(leagueLevel==5){
                leagueId = parseInt($("#dropdown-matchday-table-2-matchdayTable").data("value"));
            }
            else if(leagueLevel==6){
                leagueId = parseInt($("#dropdown-matchday-table-3-matchdayTable").data("value"));
            }
            let season = parseInt($("button#tooltipSeasonSelection span.ol-dropdown-text:first").text().match(/\d+/)[0]);
            let numberOfMatchdays;
            if(season==currentSeason){
                numberOfMatchdays = parseInt($(".ol-navigation-matchday-display-font .ol-banner-description-long.ol-header-time-description .ol-banner-time-regular").text().match(/\d+/)[0]);
            }
            else{
                numberOfMatchdays = 35;
            }
            let keeperIds = [];
            let defenderIds = [];
            let midfielderIds = [];
            let strikerIds = [];
            for(i=1;i<numberOfMatchdays;i++){
                let link = "/matchdaytable/elevenofthedaypitch?season="+season+"&matchday="+i+"&leagueLevel="+leagueLevel+"&leagueId="+leagueId+"&stateId=&leagueMatchday=0&type=1&nav=true&navId=matchdayTable";
                let elevenOfTheDay = $.ajax({type: "GET", url: link, async: false}).responseText;
                keeperIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-keeper .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                defenderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-defender1 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                defenderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-defender2 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                defenderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-defender3 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                defenderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-defender4 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                midfielderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-midfield1 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                midfielderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-midfield2 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                midfielderIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-midfield3 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                strikerIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-striker1 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                strikerIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-striker2 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
                strikerIds.push(parseInt($("<div>" + elevenOfTheDay + "</div>").find(".ol-table-pitch-box-striker3 .ol-table-pitch-player-name .ol-player-name").eq(0).attr("onclick").match(/[0-9]+/g)[0]));
            }

            let keeperList = countNominations(keeperIds);
            keeperList = sortNominationsFirst(keeperList);
            keeperList = cutNominationListFirst(keeperList, 1);
            keeperList = getAverageGradesForElevenOfTheYear(keeperList, 1, season);
            keeperList = sortNominationsSecond(keeperList);
            keeperList = cutNominationListSecond(keeperList, 1);
            keeperList = getNameForElevenOfTheYear(keeperList);

            // Keeper
            $(".ol-table-pitch-box-keeper .ol-player-name").text(keeperList[0].name+" ("+keeperList[0].count+")");
            $(".ol-table-pitch-box-keeper .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+keeperList[0].playerId+" });");
            $(".ol-table-pitch-box-keeper .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+keeperList[0].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-keeper .player-quick-overview-launcher").next().remove();
            if(keeperList[0].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").addClass(keeperList[0].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-keeper .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+keeperList[0].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-keeper .ol-team-name").length>=1){
                $(".ol-table-pitch-box-keeper .ol-team-name").text(keeperList[0].clubName);
            }
            else if($(".ol-table-pitch-box-keeper .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-keeper .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-keeper .ol-team-name").text(keeperList[0].clubName);
            }
            $(".ol-table-pitch-box-keeper .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+keeperList[0].clubId+" });");
            $(".ol-table-pitch-box-keeper .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+keeperList[0].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            let defenderList = countNominations(defenderIds);
            defenderList = sortNominationsFirst(defenderList);
            defenderList = cutNominationListFirst(defenderList, 4);
            defenderList = getAverageGradesForElevenOfTheYear(defenderList, 4, season);
            defenderList = sortNominationsSecond(defenderList);
            defenderList = cutNominationListSecond(defenderList, 4);
            defenderList = getNameForElevenOfTheYear(defenderList);

            // Verteidiger 1
            $(".ol-table-pitch-box-defender1 .ol-player-name").text(defenderList[2].name+" ("+defenderList[2].count+")");
            $(".ol-table-pitch-box-defender1 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+defenderList[2].playerId+" });");
            $(".ol-table-pitch-box-defender1 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+defenderList[2].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-defender1 .player-quick-overview-launcher").next().remove();
            if(defenderList[2].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").addClass(defenderList[2].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-defender1 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+defenderList[2].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-defender1 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-defender1 .ol-team-name").text(defenderList[2].clubName);
            }
            else if($(".ol-table-pitch-box-defender1 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-defender1 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-defender1 .ol-team-name").text(defenderList[2].clubName);
            }
            $(".ol-table-pitch-box-defender1 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+defenderList[2].clubId+" });");
            $(".ol-table-pitch-box-defender1 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+defenderList[2].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Verteidiger 2
            $(".ol-table-pitch-box-defender2 .ol-player-name").text(defenderList[0].name+" ("+defenderList[0].count+")");
            $(".ol-table-pitch-box-defender2 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+defenderList[0].playerId+" });");
            $(".ol-table-pitch-box-defender2 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+defenderList[0].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-defender2 .player-quick-overview-launcher").next().remove();
            if(defenderList[0].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").addClass(defenderList[0].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-defender2 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+defenderList[0].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-defender2 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-defender2 .ol-team-name").text(defenderList[0].clubName);
            }
            else if($(".ol-table-pitch-box-defender2 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-defender2 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-defender2 .ol-team-name").text(defenderList[0].clubName);
            }
            $(".ol-table-pitch-box-defender2 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+defenderList[0].clubId+" });");
            $(".ol-table-pitch-box-defender2 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+defenderList[0].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Verteidiger 3
            $(".ol-table-pitch-box-defender3 .ol-player-name").text(defenderList[1].name+" ("+defenderList[1].count+")");
            $(".ol-table-pitch-box-defender3 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+defenderList[1].playerId+" });");
            $(".ol-table-pitch-box-defender3 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+defenderList[1].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-defender3 .player-quick-overview-launcher").next().remove();
            if(defenderList[1].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").addClass(defenderList[1].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-defender3 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+defenderList[1].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-defender3 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-defender3 .ol-team-name").text(defenderList[1].clubName);
            }
            else if($(".ol-table-pitch-box-defender3 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-defender3 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-defender3 .ol-team-name").text(defenderList[1].clubName);
            }
            $(".ol-table-pitch-box-defender3 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+defenderList[1].clubId+" });");
            $(".ol-table-pitch-box-defender3 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+defenderList[1].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Verteidiger 4
            $(".ol-table-pitch-box-defender4 .ol-player-name").text(defenderList[3].name+" ("+defenderList[3].count+")");
            $(".ol-table-pitch-box-defender4 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+defenderList[3].playerId+" });");
            $(".ol-table-pitch-box-defender4 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+defenderList[3].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-defender4 .player-quick-overview-launcher").next().remove();
            if(defenderList[3].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").addClass(defenderList[3].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-defender4 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+defenderList[3].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-defender4 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-defender4 .ol-team-name").text(defenderList[3].clubName);
            }
            else if($(".ol-table-pitch-box-defender4 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-defender4 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-defender4 .ol-team-name").text(defenderList[3].clubName);
            }
            $(".ol-table-pitch-box-defender4 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+defenderList[3].clubId+" });");
            $(".ol-table-pitch-box-defender4 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+defenderList[3].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            let midfielderList = countNominations(midfielderIds);
            midfielderList = sortNominationsFirst(midfielderList);
            midfielderList = cutNominationListFirst(midfielderList, 3);
            midfielderList = getAverageGradesForElevenOfTheYear(midfielderList, 3, season);
            midfielderList = sortNominationsSecond(midfielderList);
            midfielderList = cutNominationListSecond(midfielderList, 3);
            midfielderList = getNameForElevenOfTheYear(midfielderList);

            // Mittelfeld 1
            $(".ol-table-pitch-box-midfield1 .ol-player-name").text(midfielderList[1].name+" ("+midfielderList[1].count+")");
            $(".ol-table-pitch-box-midfield1 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+midfielderList[1].playerId+" });");
            $(".ol-table-pitch-box-midfield1 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+midfielderList[1].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-midfield1 .player-quick-overview-launcher").next().remove();
            if(midfielderList[1].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").addClass(midfielderList[1].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-midfield1 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+midfielderList[1].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-midfield1 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-midfield1 .ol-team-name").text(midfielderList[1].clubName);
            }
            else if($(".ol-table-pitch-box-midfield1 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-midfield1 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-midfield1 .ol-team-name").text(midfielderList[1].clubName);
            }
            $(".ol-table-pitch-box-midfield1 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+midfielderList[1].clubId+" });");
            $(".ol-table-pitch-box-midfield1 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+midfielderList[1].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Mittelfeld 2
            $(".ol-table-pitch-box-midfield2 .ol-player-name").text(midfielderList[0].name+" ("+midfielderList[0].count+")");
            $(".ol-table-pitch-box-midfield2 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+midfielderList[0].playerId+" });");
            $(".ol-table-pitch-box-midfield2 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+midfielderList[0].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-midfield2 .player-quick-overview-launcher").next().remove();
            if(midfielderList[0].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").addClass(midfielderList[0].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-midfield2 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+midfielderList[0].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-midfield2 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-midfield2 .ol-team-name").text(midfielderList[0].clubName);
            }
            else if($(".ol-table-pitch-box-midfield2 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-midfield2 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-midfield2 .ol-team-name").text(midfielderList[0].clubName);
            }
            $(".ol-table-pitch-box-midfield2 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+midfielderList[0].clubId+" });");
            $(".ol-table-pitch-box-midfield2 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+midfielderList[0].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Mittelfeld 3
            $(".ol-table-pitch-box-midfield3 .ol-player-name").text(midfielderList[2].name+" ("+midfielderList[2].count+")");
            $(".ol-table-pitch-box-midfield3 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+midfielderList[2].playerId+" });");
            $(".ol-table-pitch-box-midfield3 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+midfielderList[2].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-midfield3 .player-quick-overview-launcher").next().remove();
            if(midfielderList[2].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").addClass(midfielderList[2].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-midfield3 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+midfielderList[2].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-midfield3 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-midfield3 .ol-team-name").text(midfielderList[2].clubName);
            }
            else if($(".ol-table-pitch-box-midfield3 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-midfield3 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-midfield3 .ol-team-name").text(midfielderList[2].clubName);
            }
            $(".ol-table-pitch-box-midfield3 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+midfielderList[2].clubId+" });");
            $(".ol-table-pitch-box-midfield3 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+midfielderList[2].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            let strikerList = countNominations(strikerIds);
            strikerList = sortNominationsFirst(strikerList);
            strikerList = cutNominationListFirst(strikerList, 3);
            strikerList = getAverageGradesForElevenOfTheYear(strikerList, 3, season);
            strikerList = sortNominationsSecond(strikerList);
            strikerList = cutNominationListSecond(strikerList, 3);
            strikerList = getNameForElevenOfTheYear(strikerList);

            // Angriff 1
            $(".ol-table-pitch-box-striker1 .ol-player-name").text(strikerList[1].name+" ("+strikerList[1].count+")");
            $(".ol-table-pitch-box-striker1 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+strikerList[1].playerId+" });");
            $(".ol-table-pitch-box-striker1 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+strikerList[1].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-striker1 .player-quick-overview-launcher").next().remove();
            if(strikerList[1].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").addClass(strikerList[1].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-striker1 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+strikerList[1].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-striker1 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-striker1 .ol-team-name").text(strikerList[1].clubName);
            }
            else if($(".ol-table-pitch-box-striker1 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-striker1 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-striker1 .ol-team-name").text(strikerList[1].clubName);
            }
            $(".ol-table-pitch-box-striker1 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+strikerList[1].clubId+" });");
            $(".ol-table-pitch-box-striker1 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+strikerList[1].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Angriff 2
            $(".ol-table-pitch-box-striker2 .ol-player-name").text(strikerList[0].name+" ("+strikerList[0].count+")");
            $(".ol-table-pitch-box-striker2 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+strikerList[0].playerId+" });");
            $(".ol-table-pitch-box-striker2 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+strikerList[0].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-striker2 .player-quick-overview-launcher").next().remove();
            if(strikerList[0].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").addClass(strikerList[0].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-striker2 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+strikerList[0].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-striker2 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-striker2 .ol-team-name").text(strikerList[0].clubName);
            }
            else if($(".ol-table-pitch-box-striker2 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-striker2 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-striker2 .ol-team-name").text(strikerList[0].clubName);
            }
            $(".ol-table-pitch-box-striker2 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+strikerList[0].clubId+" });");
            $(".ol-table-pitch-box-striker2 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+strikerList[0].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            // Angriff 3
            $(".ol-table-pitch-box-striker3 .ol-player-name").text(strikerList[2].name+" ("+strikerList[2].count+")");
            $(".ol-table-pitch-box-striker3 .ol-player-name").attr("onclick","olAnchorNavigation.load('player/overview', { playerId: "+strikerList[2].playerId+" });");
            $(".ol-table-pitch-box-striker3 .player-quick-overview-launcher").attr("onclick","olOverlayWindow.load('/player/quickoverview', { 'playerId': "+strikerList[2].playerId+" }); event.stopPropagation();");
            $(".ol-table-pitch-box-striker3 .player-quick-overview-launcher").next().remove();
            if(strikerList[2].clubLogo.substring(0, 4)=="icon"){
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").addClass(strikerList[2].clubLogo);
            }
            else{
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").empty();
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").empty();
                let spanClass = $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").attr("class");
                spanClass = spanClass.split(" ");
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").removeClass(spanClass[1]);
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").addClass("icon-badge-custom-min");
                $(".ol-table-pitch-box-striker3 .ol-table-pitch-logo .user-badge").append("<span style=\"margin-left: -0px; margin-top: -0px;\"><img style=\"transform: scale(1);\" src=\""+strikerList[2].clubLogo+"\" width=\"30px\" height=\"30px\"></span>");
            }
            if($(".ol-table-pitch-box-striker3 .ol-team-name").length>=1){
                $(".ol-table-pitch-box-striker3 .ol-team-name").text(strikerList[2].clubName);
            }
            else if($(".ol-table-pitch-box-striker3 .ol-team-name-inactive").length>=1){
                $(".ol-table-pitch-box-striker3 .ol-team-name-inactive").removeClass("ol-team-name-inactive").addClass("ol-team-name");
                $(".ol-table-pitch-box-striker3 .ol-team-name").text(strikerList[2].clubName);
            }
            $(".ol-table-pitch-box-striker3 .ol-team-name").attr("onclick","olAnchorNavigation.load('https://www.onlineliga.de/team/overview', { userId : "+strikerList[2].clubId+" });");
            $(".ol-table-pitch-box-striker3 .ol-table-pitch-player-name").after("<div class=\"ol-table-pitch-average-grade\">&Oslash; "+strikerList[2].averageGrade.toFixed(2).toString().replace('.', ',')+"</div>");

            $(".ol-table-pitch-average-grade").css("margin", "-7px 0px");
            $(".ol-table-pitch-font").css("font-size", "12pt");
            $(".ol-eleven-of-the-day-pitch-wrapper").css("font-size", "12pt");
        }

        function countNominations(playerIds){
            let nominationOfPlayers = {};
            $.each(playerIds, function(index, playerId){
                if (nominationOfPlayers[playerId]){
                    nominationOfPlayers[playerId]++;
                }
                else{
                    nominationOfPlayers[playerId] = 1;
                }
            })
            return nominationOfPlayers;
        }

        function sortNominationsFirst(playerList){
            let sortPlayers = [];
            $.each(playerList, function(playerId, count) {
                sortPlayers.push({ playerId: playerId, count: count });
            });
            sortPlayers.sort(function(a, b){
                return b.count - a.count;
            });
            return sortPlayers;
        }

        function sortNominationsSecond(playerList){
            playerList.sort((a, b) => {
                if (a.count === b.count) {
                    return a.averageGrade - b.averageGrade;
                } else {
                    return b.count - a.count;
                }
            });
            return playerList;
        }

        function cutNominationListFirst(playerList, numberOfNominations){
            let numberOfCandidates = 0;
            for(i=0;i<playerList.length;i++){
                if(playerList[i].count>=playerList[numberOfNominations-1].count){
                   numberOfCandidates++;
                }
            }
            playerList = playerList.slice(0, numberOfCandidates);
            return playerList;
        }

        function cutNominationListSecond(playerList, numberOfNominations){
            playerList = playerList.slice(0, numberOfNominations);
            return playerList;
        }

        function getAverageGradesForElevenOfTheYear(playerList, numberOfNominations, season){
            for(i=0;i<playerList.length;i++){
                let link = "/player/performancedata?playerId="+playerList[i].playerId;
                let playerHistoryData = $.ajax({type: "GET", url: link, async: false}).responseText;
                let numberOfStations = parseInt($("<div>" + playerHistoryData + "</div>").find(".col-lg-3.col-md-3.col-sm-3.col-xs-2.text-center span.hidden-sm.hidden-md.hidden-lg").length);
                let countVariable = 0;
                for(j=0;j<numberOfStations;j++){
                    if(parseInt($("<div>" + playerHistoryData + "</div>").find(".col-lg-3.col-md-3.col-sm-3.col-xs-2.text-center span.hidden-sm.hidden-md.hidden-lg").eq(j).text())==season){
                        countVariable = j;
                    }
                }
                let clubId;
                clubId = parseInt($("<div>" + playerHistoryData + "</div>").find(".player-overview-teamname-wrapper.text-overflow .ol-team-name-color-light").eq(countVariable).attr("onclick").match(/\d+/)[0]);
                playerList[i].clubId = clubId;
                let clubName = $("<div>" + playerHistoryData + "</div>").find(".player-overview-teamname-wrapper.text-overflow .ol-team-name-color-light").eq(countVariable).text().trim();
                playerList[i].clubName = clubName;
                let clubLogo = $("<div>" + playerHistoryData + "</div>").find(".player-overview-teamname-wrapper.text-overflow").eq(countVariable).prev().find(".user-badge img").attr("src");
                if(typeof clubLogo === "undefined"){
                    let spanClass = $("<div>" + playerHistoryData + "</div>").find(".player-overview-teamname-wrapper.text-overflow").eq(countVariable).prev().find("span.user-badge").attr("class");
                    spanClass = spanClass.split(" ");
                    clubLogo = spanClass[1];
                }
                playerList[i].clubLogo = clubLogo;
                link = "/player/performancedata/season?playerId="+playerList[i].playerId+"&season="+season+"&userId="+clubId;
                let playerSeasonData = $.ajax({type: "GET", url: link, async: false}).responseText;
                let numberOfLeagueData = parseInt($("<div>" + playerSeasonData + "</div>").find(".row.player-overview-performance-table.player-overview-performance-table-grid-row.collapse-row.ol-league").length);
                let averageGrade = 0;
                let gamesWithoutGrade = 0;
                for(j=0;j<numberOfLeagueData;j++){
                    let helpVariable = $("<div>" + playerSeasonData + "</div>").find(".player-overview-performance-table.ol-league .player-performance-rating").eq(j)[0];
                    if ($(helpVariable).text().trim()=="-"){
                        gamesWithoutGrade += 1;
                    }
                    else{
                        averageGrade += parseFloat($(helpVariable).text().trim());
                    }
                }
                averageGrade = averageGrade/(numberOfLeagueData-gamesWithoutGrade);
                playerList[i].averageGrade = averageGrade;
            }
            return playerList;
        }

        function getNameForElevenOfTheYear(playerList){
            for(i=0;i<playerList.length;i++) {
                let link = "/player/overview?playerId="+playerList[i].playerId;
                let playerOverview = $.ajax({type: "GET", url: link, async: false}).responseText;
                playerList[i].name = $("<div>" + playerOverview + "</div>").find(".col-md-8.col-lg-8.col-sm-12.col-xs-7").eq(0).text().trim();
            }
            return playerList;
        }

        function createDivForLeagueView(nameOfDiv, marginBottom){
            return "<div id=\""+nameOfDiv+"\" style=\"margin-bottom:"+marginBottom+";\"></div>";
        }

        function createDivForMessengerResults(){
            $("#messagesystem-search").after(
                "<div id=\"messagesystem-results\">"+
                    "<span>Ergebnisse der Chatpartner anzeigen? </span>"+
                    "<select id=\"messagesystem-results-select\">"+
                    "<option value=\"0\">0</option>"+
                    "<option value=\"5\">5</option>"+
                    "<option value=\"10\">10</option>"+
                    "<option value=\"15\">15</option>"+
                    "<option value=\"20\">20</option>"+
                    "</select>"+
                "</div>"
            );
            $("#messagesystem-results").attr("style", "padding:4px 0px 4px 0px;text-align:center;");
            $("#messagesystem-results-select").attr("style", "width:38px;");
        }

        function createDivForPlayerProgress(){
            $(".ol-training-playerdetails-header-sticky .ol-training-playerdetails-header").after(
                "<div class=\"ol-training-playerdetails-progress-question\">"+
                    "<span>Fortschritt bis Alter 30 anzeigen? </span>"+
                    "<select class=\"ol-training-playerdetails-progress-question-select\">"+
                    "<option value=\"0\">0</option>"+
                    "<option value=\"5\">5</option>"+
                    "<option value=\"10\">10</option>"+
                    "<option value=\"15\">15</option>"+
                    "<option value=\"20\">20</option>"+
                    "</select>"+
                "</div>"
            );
            $("#messagesystem-results").attr("style", "padding:4px 0px 4px 0px;text-align:center;");
            $("#messagesystem-results-select").attr("style", "width:38px;");
        }

        function createInjuryResults(){
            let numberOfPlayers = $(".ol-player-name").length;
            let player = [];
            for(i=0;i<numberOfPlayers;i++){
                player[i] = new Player();
                player[i].ID = parseInt($(".ol-player-name").eq(i).attr("onclick").match(/[0-9]+/g));
                getPlayerInjuryData(player[i]);
                $(".lblLineUpEditorCheckbox.ol-lineup-editor-checkbox").eq(i).after(
                    "<span class=\"ol-player-injury\" style=\"display:inline-block;font-size:15px;padding-right:5px;vertical-align:top;width:65px;\">"+
                    "<span class=\"ol-player-injury-number\" style=\"display:inline-block;padding-right:5px;text-align:right;\">"+player[i].numberOfInjuries+"</span>"+
                    "<span class=\"ol-player-injury-duration\" style=\"display:inline-block;padding-right:5px;text-align:right;\">"+player[i].lengthOfAllInjuries+"</span>"+
                    "<span class=\"ol-player-injury-average\" style=\"display:inline-block;padding-right:5px;text-align:right;\">"+player[i].averageLengthOfAllInjuries+"</span>"+
                    "</span>"
                );
                if(parseFloat((player[i].averageLengthOfAllInjuries).replace(/,/g, '.')) == 0){
                    $(".ol-player-name").eq(i).css("color", "#A9D08E");
                }
                else if(parseFloat((player[i].averageLengthOfAllInjuries).replace(/,/g, '.')) > 0.0 && parseFloat((player[i].averageLengthOfAllInjuries).replace(/,/g, '.')) <= 1.0){
                    $(".ol-player-name").eq(i).css("color", "#FFD966");
                }
                else if(parseFloat((player[i].averageLengthOfAllInjuries).replace(/,/g, '.')) > 1.0 && parseFloat((player[i].averageLengthOfAllInjuries).replace(/,/g, '.')) <= 2.0){
                    $(".ol-player-name").eq(i).css("color", "#FF5733");
                }
                else{
                    $(".ol-player-name").eq(i).css("color", "#C70039");
                }
            }
        }

        function createMessengerResults(){
            let numberOfChatTeams = parseInt($("#messagesystem-results-select").val());
            let teamInformations = new Array(numberOfChatTeams);
            for(i=0;i<numberOfChatTeams;i++){
                teamInformations[i] = new Team;
                teamInformations[i].ID = parseInt(($(".messagesystem-userlist-button").eq(i+1).attr("onclick").match(/[0-9]+/g))[0]);
                getLastGameResult(teamInformations[i]);
                $(".ol-user-name.messagesystem-userlist-item").eq(i+1).after(
                    "<span class=\"ol-user-name-result\" style=\"background:"+teamInformations[i].lastGameResultBackgroundColor+";color:#404040;font-weight:bold;margin-left:4px;padding-left:4px;padding-right:4px;position:relative;top:22%;\">"+teamInformations[i].lastGameResultHomeGoals+":"+teamInformations[i].lastGameResultAwayGoals+"</span>"
                );
            }
            $("#messagesystem-results-loading").remove();
        }

        function createSpanWidthQuestion(fatherDiv, question){
            $("#"+fatherDiv).append(
                "<span class=\""+fatherDiv+"-logo\"><a href=\"/team/overview?userId=32830\" target=\"_blank\"><img src=\"https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png\" width=\"12\" height=\"12\" style=\"margin-right:2px;vertical-align:unset;\"></a></span>"+
                "<span class=\""+fatherDiv+"-question-text\">"+question+"</span>"+
                "<span class=\""+fatherDiv+"-answer\">"+
                    "<label class=\""+fatherDiv+"-answer-text\" style=\"margin: 0px 5px 0px 10px; font-weight: normal;\">ja</label>"+
                    "<input type=\"checkbox\" id=\""+fatherDiv+"-answer-checkbox\">"+
                "</span>"
            );
        }

        function createDivWidthQuestion(fatherDiv, divName, question){
            $(fatherDiv).after(
                "<div class=\""+divName+"-question\">"+
                    "<span class=\""+divName+"-logo\"><a href=\"/team/overview?userId=32830\" target=\"_blank\"><img src=\"https://onlineliga.s3.eu-central-1.amazonaws.com/userimages/32830-5f7ec70c87047.png\" width=\"12\" height=\"12\" style=\"margin-right:2px;vertical-align:unset;\"></a></span>"+
                    "<span class=\""+divName+"-question-text\">"+question+"</span>"+
                    "<span class=\""+divName+"-answer\">"+
                        "<label class=\""+divName+"-answer-text\" style=\"margin: 0px 5px 0px 10px; font-weight: normal;\">ja</label>"+
                        "<input type=\"checkbox\" id=\""+divName+"-answer-checkbox\">"+
                    "</span>"+
                "</div>"
            );
        }

        function createCounterDiv(fatherDiv, messageText, counterEnd){
            counterNumber++;
            $("#"+fatherDiv).append(
                "<div class=\""+fatherDiv+"-counter-"+counterNumber+"\">"+
                    "<span class=\""+fatherDiv+"-counter-text\">"+messageText+"</span>"+
                    "<span class=\""+fatherDiv+"-counter-number-"+counterNumber+"\">"+0+" von "+counterEnd+"</span>"+
                "</div>"
            );
        }

        function createCounterSpan(fatherDiv, messageText, counterEnd){
            $("."+fatherDiv).append(
                "<span class=\""+fatherDiv+"-counter\">"+
                    "<span class=\""+fatherDiv+"-counter-text\">"+messageText+"</span>"+
                    "<span class=\""+fatherDiv+"-counter-number\">"+0+"</span>"+
                    "<span class=\""+fatherDiv+"-counter-end\"> von "+counterEnd+"</span>"+
                "</span>"
            );
        }

        async function showAgeInLineup(){
            let numberOfPlayers = $(".ol-team-settings-player-lineup-name").length;
            let playerIDs = new Array(numberOfPlayers);
            for(i=0;i<numberOfPlayers;i++){
                let playerData = document.querySelectorAll(".ol-team-settings-line-up-row.visible .ol-value-bar-small.ol-gui-lineup-attr")[i].dataset.playerAttributes.split("\"value\":");
                let age = parseInt(playerData[2].match(/\d+/g)[0]);
                $(".ol-team-position-complete-name").eq(i).attr("style","font-size:15px;");
                $(".ol-team-settings-player-lineup-name span.ol-team-position-complete-name").eq(i).attr("style","font-size:15px;");
                $(".ol-team-settings-player-lineup-name span.ol-team-position-complete-name").eq(i).before(
                    "<span class=\"ol-team-lineup-age\" style=\"font-size:15px;\" title=\""+age+" Jahre\">"+age+"  </span>"
                );
            }
        }

        function getPlayerInjuryDataForTM(playerID){
            let link = "/player/injuries?playerId="+playerID;
            let playerData = $.ajax({type: "GET", url: link, async: false}).responseText;
            let totalDuration = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(0).text().trim();
            let averagePerSeason = $("<div>" + playerData + "</div>").find("span.bandarole-second-row span.player-info-bandarole-big-font").eq(1).text().trim();
            $(".transfer-player-ready.text-center").append(
                "<div class=\"ol-additional-injury-information\">"+
                    "<div class=\"ol-additional-injury-information-total-duration\">Gesamtdauer (Wochen): "+totalDuration+"</div>"+
                    "<div class=\"ol-additional-injury-information-average-per-season\">Ø pro Saison (Wochen): "+averagePerSeason+"</div>"+
                "</div>"
            );
            $(".ol-additional-injury-information-total-duration").attr("style","font-size:10pt;text-align:center;");
            $(".ol-additional-injury-information-average-per-season").attr("style","font-size:10pt;padding-bottom:18px;text-align:center;");
            $(".ol-youth-player-spacer.transfer-player-overview-spacer").remove();
        }

        class Team{
            constructor(){
                this.ID;
                this.name;
                this.logo;
                this.numberOfCurrentPlayers;
                this.strengthOfCurrentPlayers;
                this.topTenStrengthOfCurrentFieldPlayers;
                this.topThirteenStrengthOfCurrentFieldPlayers;
                this.topFifteenStrengthOfCurrentFieldPlayers;
                this.topTwentyStrengthOfCurrentFieldPlayers;
                this.topStrengthOfCurrentKeepers;
                this.averageTopTwoStrengthOfCurrentKeepers;
                this.ageOfCurrentPlayers;
                this.talentOfCurrentPlayers;
                this.marketValueOfCurrentPlayers;
                this.salaryOfCurrentPlayers;
                this.averageStrengthOfCurrentPlayers;
                this.averageTopTenStrengthOfCurrentFieldPlayers;
                this.averageTopThirteenStrengthOfCurrentFieldPlayers;
                this.averageTopFifteenStrengthOfCurrentFieldPlayers;
                this.averageTopTwentyStrengthOfCurrentFieldPlayers;
                this.averageAgeOfCurrentPlayers;
                this.averageTalentOfCurrentPlayers;
                this.averageMarketValueOfCurrentPlayers;
                this.averageSalaryOfCurrentPlayers;
                this.numberOfTeamTransfers;
                this.lastGameResultHomeGoals;
                this.lastGameResultAwayGoals;
                this.lastGameResultBackgroundColor;
            }
        }

        class Player{
            constructor(){
                this.currentTeamID;
                this.currentTeamName;
                this.currentTeamLogo;
                this.ID;
                this.name;
                this.age;
                this.birthday;
                this.positions;
                this.strength;
                this.leagueGamesThisSeason;
                this.leagueGoalsThisSeason;
                this.leagueAssistsThisSeason;
                this.marketValue;
                this.salary;
                this.talent;
                this.isTalentDetermined;
                this.isCurrentJugiFromCurrentTeam;
                this.numberOfInjuries;
                this.lengthOfAllInjuries;
                this.averageLengthOfAllInjuries;
                this.line;
                this.libero;
                this.foot;
                this.gameopening;
                this.runout;
                this.penaltyarea;
                this.condition;
                this.speed;
                this.technique;
                this.shootingtechnique;
                this.shootingpower;
                this.header;
                this.duel;
                this.tactics;
                this.leftfoot;
                this.rightfoot;
                this.athletics;
            }
        }
    })
})();