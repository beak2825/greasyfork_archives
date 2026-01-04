/*jshint esversion: 8, multistr: true */
/* globals waitForKeyElements, OLCore */

// ==UserScript==
// @name           OnlineligaTeamStatistics
// @namespace      https://greasyfork.org/en/users/771355
// @version        0.1.0
// @license        LGPLv3
// @description    Statistikanzeige bei Teamübersicht für www.onlineliga.de (OFA)
// @author         arthurbecs
// @match          https://www.onlineliga.de/*
// @require        https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_addStyle
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/437987/OnlineligaTeamStatistics.user.js
// @updateURL https://update.greasyfork.org/scripts/437987/OnlineligaTeamStatistics.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 01.05.2021 Release
 *********************************************/

 (function() {
    'use strict';
    var $ = unsafeWindow.jQuery;

    async function buildButtonForUserInput() {
        $('<button id="waitForUserInputStatistics" type="button" class="ol-button-toggle">Statistik</button>')
        .appendTo("div.menu-button-wrapper");
        $("div.ol-page-content-width.ol-paragraph").on('click','#waitForUserInputStatistics',buildStatisticsButton);
    }

    /**
     * creates statistics-button + loading animation
     * inserts html-code into TeamOverviewContent subpage
     */
    async function buildStatisticsButton(){
        $('button#waitForUserInputStatistics').hide();
        $('<button data-sub-url="null" id="removeWhenFinished" type="button" class="ol-button-toggle" onclick="null" style="color: #939393 !important;" disabled>creating statistics</button>')
        .appendTo("div.menu-button-wrapper");

        $('<script id="buttonLoadingsScript">originalText = $(\'button#removeWhenFinished\').text(),' +
        'i  = 0;' +
        'setInterval(function() {' +

            '$(\'button#removeWhenFinished\').append(\".\");' +
            'i++;' +
            'if(i == 4)' +
            '{' +
                '$(\'button#removeWhenFinished\').html(originalText);' +
                'i = 0;' +
            '}' +

        '}, 500);</script>')
        .appendTo("div.menu-button-wrapper");

        $('<button data-sub-url="team/overview/statistics" id="toggleButtonStatistics" type="button" class="ol-button-toggle" onclick="replaceTeamOverviewContent()">Statistik</button><script>' +
        'function replaceTeamOverviewContent() {' +
          '$(\'div#olTeamOverviewContent\').html("' + await buildTeamStatistics() + '");' +
        '}' +
        '</script>')
        .appendTo("div.menu-button-wrapper");
        $('button#removeWhenFinished').hide();
    }

    /**
     * builds html-code to insert into TeamOverviewContent subpage
     * @return finished html-code
     */
    async function buildTeamStatistics() {
        // notations for rows
        const arrayNotation = ['Marktwert', '&Oslash Marktwert', 'Kadergröße', 'Top11 MW', '&Oslash Top11 MW', '&Oslash Squad MW', '&Oslash Stärke', '&Oslash Alter', '&Oslash Talent', '&Oslash Größe', '&Oslash GrößeIV', '&Oslash GrößeST', 'Gehalt', '&Oslash Gehalt', '&Oslash Vertrag', '&Oslash Top11',
                            '&Oslash Top10', 'V. Ende','&Oslash Top2 TW', '&Oslash Top3 IV', '&Oslash Top3 AV', '&Oslash Top3 DM', '&Oslash Top3 OM', '&Oslash Top3 ST', 'Längste Zeit im Verein', 'Rekordspieler', 'Rekordschütze', 'Rekordvorbereiter'];
        // titles for rows
        const arrayTitle = ['Gesamter Marktwert des Teams', 'Durchschnittlicher Marktwert des Teams', 'Kadergröße des Teams', 'Marktwert der 11 teuersten Spieler', 'Durchschnittlicher Marktwert der 11 teuersten Spieler', 'Durchschnittlicher Marktwert der aktuell aufgestellten Spieler (ohne Bank)',
                            'Durchschnittliche Stärke der Spieler', 'Durchschnittliches Alter der Spieler', 'Durchschnittliches Talent der Spieler', 'Durchschnittliches Größe der Spieler', 'Durchschnittliches Größe der Top2 Innenverteidiger', 'Durchschnittliches Größe der Top2 Stürmer', 'Gesamtes Gehalt der Spieler', 'Durchschnittliches Gehalt pro Spieler', 'Durchschnittliche verbleibende Vertragsdauer der Spieler',
                            'Durchschnittliche Stärke der 11 besten Spieler', 'Durchschnittliche Stärke der 10 besten Spieler (Top11 ohne Torwart)', 'Anzahl der endenden Verträge (aktuelle Saison)', 'Durchschnittliche Stärke der 2 stärksten Torhüter',
                            'Durchschnittliche Stärke der 3 stärksten Innenverteidiger', 'Durchschnittliche Stärke der 3 stärksten Außenverteidiger', 'Durchschnittliche Stärke der 3 stärksten DMs', 'Durchschnittliche Stärke der 3 stärksten OMs',
                            'Durchschnittliche Stärke der 3 stärksten Stürmer', 'Der/Die Spieler sind am längsten im Verein', 'Der/Die Spieler mit den meisten Einsätzen (nicht nur aktuelles Team)', 'Der/Die Spieler mit den meinsten Toren (nicht nur aktuelles Team)', 'Der/Die Spieler mit den meisten Vorlagen (nicht nur aktuelles Team)'];
        // values for rows
        const arrayValue = await getStatisticsData();

        let teamStatistics = "<div id=\\\"ol-statistics-container\\\" class=\\\"team-overview-info\\\">";
        teamStatistics += "<div class=\\\"ol-state-striped-15\\\"></div>";

        // iterate through array and create rows
        var i = 0;
        for(i; i < 24; i = i + 3) {
            let striped = false;
            if (i % 6 == 0) {striped = true;}
            teamStatistics += buildMultiRow(arrayNotation[i], arrayValue[i], arrayTitle[i], arrayNotation[i + 1], arrayValue[i + 1], arrayTitle[i + 1], arrayNotation[i + 2], arrayValue[i + 2], arrayTitle[i + 2], striped);
        }

        for(i; i < arrayNotation.length; i++) {
            let striped = false;
            if (i % 2 == 0) {striped = true;}
            teamStatistics += buildSingleRow(arrayNotation[i], arrayValue[i], arrayTitle[i], striped);
        }

        teamStatistics += "</div>";                                                     //  "<div class=\\\"team-overview-info\\\">"

        return teamStatistics;
    }

    /**
     * gets player and team values via OLCore
     * @return array with values for table-row creation
     */
    async function getStatisticsData(){
        const tempUserId = $('.data-page-url').context.URL.match(/\d+/g).map(Number);
        const userId = tempUserId[0];

        let statisticsArray = [];

        const seasonWeek = $('span.ol-navigation-season-display-font')[0].innerText.replace('SAISON ','S').replace(' - WOCHE ', 'W');

        const swMatch = seasonWeek.match(/^S(\d+)W(\d+)$/);
        const season = parseInt(swMatch[1], 10);
        const week = parseInt(swMatch[2], 10);
        const rawSeasonWeek = (season * 44) + week - 44;

        let lineup11Value = 0;
        let lineupAllValue = 0;

        const teamData = await OLCore.get(`/team/overview/squad?userId=${userId}`);
        const teamValue = $(teamData).find('span.bandarole-team-value > span.pull-right').text();
        const teamRows = $(teamData).filter('div.team-overview-squad-row');
        let teamSize = teamRows.length;
        const playerValues = [];
        teamRows.each(function(){
            const row = $(this);
            const playerValue = parseInt(row.find('div.col-md-3.col-lg-3.col-sm-6.col-xs-6.text-right').text().trim().replace(/\./g,''),10) || 0;
            playerValues.push(playerValue);
            const lineupState = row.find('span.ol-player-squad-display.pull-left');
            if (lineupState.length > 0){
                if (!$($(lineupState)[0]).hasClass('player-substitute-display')){
                    lineup11Value += playerValue;
                }
                lineupAllValue += playerValue;
            }
        });
        const avgLineupValue = OLCore.euroValue(Math.round(lineup11Value / 11));
        const friendly11Value = OLCore.euroValue(lineup11Value);
        const friendlyAllValue = OLCore.euroValue(lineupAllValue);
        const teamValueInt = parseInt(teamValue.replace(/\./g,''),10);
        const top11Value = OLCore.euroValue(playerValues.sort((a,b) => b - a).slice(0,11).reduce((a, b) => a + b, 0));
        const friendlyPercent = Math.round((lineup11Value/teamValueInt) * 100);

        const average11Value = OLCore.euroValue(Math.round(playerValues.sort((a,b) => b - a).slice(0,11).reduce((a, b) => a + b, 0)/11));
        const averageTeam = OLCore.euroValue(Math.round(teamValueInt/teamSize));

        const playerArray = [];
        let loyalPlayers = "";
        let mostGamesPlayed = "";
        let mostAssists = "";
        let mostGoals = "";
        let completeSalary = 0;
        let completeAge = 0;
        let completeContractLeft = 0;
        let completeStrength = 0;
        let completeHeight = 0;
        let completeTalent = 0;
        let talentZeroCount = 0;
        let endingContracts = 0;
        let top2TW = 0;
        let top3IV = 0;
        let top3AV = 0;
        let top3DM = 0;
        let top3OM = 0;
        let top3ST = 0;
        let topTWTop11 = 0;
        let topIVTop11 = 0;
        let topAVTop11 = 0;
        let topDMTop11 = 0;
        let topOMTop11 = 0;
        let topSTTop11 = 0;
        let topIVHeight = 0;
        let topSTHeight = 0;

        //teamSize = teamSize - 1; //WENN ES KEINE STÜRMER GIBT

        for (var i = 0; i < teamSize; i++) {
            const playerID = $(teamRows[i]).find('span.ol-player-name').attr("onclick").replace(/\D/g,'');

            const playerData = await OLCore.get(`/player/details?playerId=${playerID}`);
            const playerRaw = $(playerData).filter('div.container.playeroverviewtablestriped')[0];
            const playerRows = $(playerRaw).find('div.col-md-8.col-lg-8.col-sm-12.col-xs-7');
            const playerRowsAttr = $(playerRaw).find('span.ol-value-bar-small-label-value');
            const playerRowsAttrCondition = $(playerRaw).find('div.col-md-3.col-lg-3.col-xs-4.player-info-abilitys-headline');
            const playerRowsGoalsAssists = $(playerRaw).find('div.col-xs-4.text-center');

            let talent = 0;
            if (playerRowsAttrCondition[13] == null) {
                talent = parseInt(playerRowsAttr[8].innerHTML);
            } else {
                talent = parseInt(playerRowsAttr[11].innerHTML);
            }
            if (talent == 0 || talent == null || isNaN(talent)) {
                talent = 0;
                talentZeroCount++;
            }

            const tempGoalsAssists = playerRowsGoalsAssists[1].innerHTML.match(/\d+/g).map(Number);
            const games = parseInt(tempGoalsAssists[0]);
            const goals = parseInt(tempGoalsAssists[1]);
            const assists = parseInt(tempGoalsAssists[2]);

            const position = $(teamRows[i]).find('div.col-md-2.col-lg-2.col-sm-2.col-xs-2.team-squad-overview-position.text-left').text();
            const strength = parseInt(playerRowsAttr[0].innerHTML);
            const name = playerRows[0].innerHTML.trim();
            const age = parseInt(playerRows[3].innerHTML.replace(/\D/g,''));
            const weight = parseInt(playerRows[5].innerHTML.replace(/\D/g,''));
            const height = parseInt(playerRows[6].innerHTML.replace(/\D/g,''));
            const birthday = parseInt(playerRows[7].innerHTML.replace(/\D/g,''));
            const value = parseInt(playerRows[8].innerHTML.replace(/\D/g,''));
            const salary = parseInt(playerRows[10].innerHTML.replace(/\D/g,''));
            const remaining = playerRows[11].innerHTML.match(/\d+/g).map(Number);
            const term = playerRows[12].innerHTML.match(/\d+/g).map(Number);
            const contractLeft = parseInt(remaining[0] * 44 - rawSeasonWeek);
            const contractTerm = parseInt(term[0]);
            if (contractLeft  == (44 - week)) {
                endingContracts++;
            }

            completeSalary += salary;
            completeAge += age;
            completeContractLeft += contractLeft;
            completeStrength += strength;
            completeHeight += height;
            completeTalent += talent;

            playerArray.push(new Player(name, strength, talent, age, position, weight, height, birthday, value, salary, remaining, contractLeft, contractTerm, games, goals, assists));
        }

        const avgSalary = OLCore.euroValue((completeSalary / teamSize).toFixed(1));
        completeSalary = OLCore.euroValue(completeSalary);
        const avgAge = (completeAge / teamSize).toFixed(1) + " Jahre";
        const tempAvgContractLeft = completeContractLeft / teamSize;
        const avgTalent = (completeTalent / (teamSize - talentZeroCount)).toFixed(1);
        let avgContractLeft = 0;
        if (tempAvgContractLeft > 44) {
            avgContractLeft = Math.floor(tempAvgContractLeft / 44) + " Season " + Math.round(tempAvgContractLeft - (Math.floor(tempAvgContractLeft / 44) * 44)) + " Wochen";
        } else {
            avgContractLeft = Math.round(tempAvgContractLeft) + " Wochen";
        }
        const avgStrength = (completeStrength / teamSize).toFixed(1);
        const avgHeight = (completeHeight / teamSize).toFixed(1) + " cm";

        playerArray.sort(function(a, b) {return b.strength - a.strength});                    // TODO Stärke statt MW

        let countTW = 0;
        let countIV = 0;
        let countAV = 0;
        let countDM = 0;
        let countOM = 0;
        let countST = 0;
        let countTWTop11 = 0;
        let countIVTop11 = 0;
        let countAVTop11 = 0;
        let countDMTop11 = 0;
        let countOMTop11 = 0;
        let countSTTop11 = 0;
        let loyalityCount = 999;
        let mostGamesCount = 0;
        let mostAssistsCount = 0;
        let mostGoalsCount = 0;

        for (var i = 0; i < teamSize; i++) {
            let isUsed = 0;
            if (playerArray[i].position.includes("OM")) {
                if (countOM < 3) {
                    top3OM += playerArray[i].strength;
                    countOM++;
                }
                if (countOMTop11 < 3 && isUsed == 0) {
                    topOMTop11 += playerArray[i].strength;
                    countOMTop11++;
                    isUsed++;
                }
            }
            if (playerArray[i].position.includes("ST")) {
                if (countST < 3) {
                    top3ST += playerArray[i].strength;
                    topSTHeight += playerArray[i].height;
                    countST++;
                }
                if (countSTTop11 < 2 && isUsed == 0) {
                    topSTTop11 += playerArray[i].strength;
                    countSTTop11++;
                    isUsed++;
                }
            }
            if (playerArray[i].position.includes("DM")) {
                if (countDM < 3) {
                    top3DM += playerArray[i].strength;
                    countDM++;
                }
                if (countDMTop11 < 1 && isUsed == 0) {
                    topDMTop11 += playerArray[i].strength;
                    countDMTop11++;
                    isUsed++;
                }
            }
            if (playerArray[i].position.includes("AV")) {
                if (countAV < 3) {
                    top3AV += playerArray[i].strength;
                    countAV++;
                }
                if (countAVTop11 < 2 && isUsed == 0) {
                    topAVTop11 += playerArray[i].strength;
                    countAVTop11++;
                    isUsed++;
                }
            }
            if (playerArray[i].position.includes("IV")) {
                if (countIV < 3) {
                    top3IV += playerArray[i].strength;
                    topIVHeight += playerArray[i].height;
                    countIV++;
                }
                if (countIVTop11 < 2 && isUsed == 0) {
                    topIVTop11 += playerArray[i].strength;
                    countIVTop11++;
                    isUsed++;
                }
            }
            if (playerArray[i].position.includes("TW")) {
                if (countTW < 2) {
                    top2TW += playerArray[i].strength;
                    countTW++;
                }
                if (countTWTop11 < 1 && isUsed == 0) {
                    topTWTop11 += playerArray[i].strength;
                    countTWTop11++;
                    isUsed++;
                }
            }
            if (playerArray[i].contractTerm == loyalityCount) {
                loyalPlayers = loyalPlayers + ", " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
            } else if (playerArray[i].contractTerm < loyalityCount) {
                loyalPlayers = "Seit Saison " + playerArray[i].contractTerm + ": " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
                loyalityCount = playerArray[i].contractTerm;
            }
            if (playerArray[i].games == mostGamesCount) {
                mostGamesPlayed = mostGamesPlayed + ", " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
            } else if (playerArray[i].games > mostGamesCount) {
                mostGamesPlayed = playerArray[i].games + " Einsätze: " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
                mostGamesCount = playerArray[i].games;
            }
            if (playerArray[i].goals == mostGoalsCount) {
                mostGoals = mostGoals + ", " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
            } else if (playerArray[i].goals > mostGoalsCount) {
                mostGoals = playerArray[i].goals + " Tore: " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
                mostGoalsCount = playerArray[i].goals;
            }
            if (playerArray[i].assists == mostAssistsCount) {
                mostAssists = mostAssists + ", " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
            } else if (playerArray[i].assists > mostAssistsCount) {
                mostAssists = playerArray[i].assists + " Assists: " + playerArray[i].name + " (&Oslash " + playerArray[i].strength + ", " + playerArray[i].age + "J, " + playerArray[i].position + ")";
                mostAssistsCount = playerArray[i].assists;
            }
        }

        top2TW = (top2TW / countTW).toFixed(1);
        top3IV = (top3IV / countIV).toFixed(1);
        top3AV = (top3AV / countAV).toFixed(1);
        top3DM = (top3DM / countDM).toFixed(1);
        top3OM = (top3OM / countOM).toFixed(1);
        top3ST = (top3ST / countST).toFixed(1);
        topIVHeight = (topIVHeight / countIV).toFixed(1) + " cm";
        topSTHeight = (topSTHeight / countST).toFixed(1) + " cm";

        const top11Strength = ((topTWTop11 + topIVTop11 + topAVTop11 + topDMTop11 + topOMTop11 + topSTTop11) / 11).toFixed(1);
        const top10Strength = ((topIVTop11 + topAVTop11 + topDMTop11 + topOMTop11 + topSTTop11) / 10).toFixed(1);

        console.log(playerArray);

        statisticsArray.push(teamValue);
        statisticsArray.push(averageTeam);
        statisticsArray.push(teamSize);

        statisticsArray.push(top11Value);
        statisticsArray.push(average11Value);
        statisticsArray.push(avgLineupValue);

        statisticsArray.push(avgStrength);
        statisticsArray.push(avgAge);
        statisticsArray.push(avgTalent);

        statisticsArray.push(avgHeight);
        statisticsArray.push(topIVHeight);
        statisticsArray.push(topSTHeight);

        statisticsArray.push(completeSalary);
        statisticsArray.push(avgSalary);
        statisticsArray.push(avgContractLeft);

        statisticsArray.push(top11Strength);
        statisticsArray.push(top10Strength);
        statisticsArray.push(endingContracts);

        statisticsArray.push(top2TW);
        statisticsArray.push(top3IV);
        statisticsArray.push(top3AV);

        statisticsArray.push(top3DM);
        statisticsArray.push(top3OM);
        statisticsArray.push(top3ST);

        statisticsArray.push(loyalPlayers);
        statisticsArray.push(mostGamesPlayed);
        statisticsArray.push(mostGoals);
        statisticsArray.push(mostAssists);

        return statisticsArray;
    }

    /**
     * @param notation notation of the element
     * @param value value of the element
     * @param striped this row should be striped or not
     * @return complete multi table-row
     */
    function buildMultiRow(notation1, value1, title1, notation2, value2, title2, notation3, value3, title3, striped) {
        let row = "";

        if(notation2 == null) {
            notation2 = "";
            value2 = "";
            title2 = "";
            notation3 = "";
            value3 = "";
            title3 = "";
        }
        if(notation3 == null) {
            notation3 = "";
            value3 = "";
            title3 = "";
        }

        if(striped == true) {
            row += "<div class=\\\"row ol-state-striped-15\\\">";

            row += "<div style=\\\"margin-top: 15px; margin-bottom: 15px;\\\" class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-12 ol-state-striped-15\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-5 nowrap\\\" title=\\\"" + title1 + "\\\" style=\\\"font-weight: 550\\\">" + notation1 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-6 col-md-6 col-sm-6 col-xs-7\\\">" + value1 + "</div>";
            row += "</div></div>";

            row += "<div style=\\\"margin-top: 15px; margin-bottom: 15px;\\\" class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-12 ol-state-striped-15\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-5 nowrap\\\" title=\\\"" + title2 + "\\\" style=\\\"font-weight: 550\\\">" + notation2 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-6 col-md-6 col-sm-6 col-xs-7\\\">" + value2 + "</div>";
            row += "</div></div>";

            row += "<div style=\\\"margin-top: 15px; margin-bottom: 15px;\\\" class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-12 ol-state-striped-15\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-5 nowrap\\\" title=\\\"" + title3 + "\\\" style=\\\"font-weight: 550\\\">" + notation3 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-8 col-md-8 col-sm-8 col-xs-7\\\">" + value3 + "</div>";
            row += "</div></div>";

            row += "</div>";                                                     //  "<div class=\\\"row ol-state-striped-15\\\">"
        } else {
            row += "<div class=\\\"row\\\">";

            row += "<div style=\\\"margin-top: 15px; margin-bottom: 15px;\\\" class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-12\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-5 nowrap\\\" title=\\\"" + title1 + "\\\" style=\\\"font-weight: 550\\\">" + notation1 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-6 col-md-6 col-sm-6 col-xs-7\\\">" + value1 + "</div>";
            row += "</div></div>";

            row += "<div style=\\\"margin-top: 15px; margin-bottom: 15px;\\\" class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-12\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-5 nowrap\\\" title=\\\"" + title2 + "\\\" style=\\\"font-weight: 550\\\">" + notation2 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-6 col-md-8 col-sm-6 col-xs-7\\\">" + value2 + "</div>";
            row += "</div></div>";

            row += "<div style=\\\"margin-top: 15px; margin-bottom: 15px;\\\" class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-12\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-4 col-md-4 col-sm-4 col-xs-5 nowrap\\\" title=\\\"" + title3 + "\\\" style=\\\"font-weight: 550\\\">" + notation3 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-8 col-md-8 col-sm-8 col-xs-7\\\">" + value3 + "</div>";
            row += "</div></div>";

            row += "</div>";                                                     //  "<div class=\\\"row ol-state-striped-15\\\">"
        }

        return row;
    }

    /**
     * @param notation notation of the element
     * @param value value of the element
     * @param striped this row should be striped or not
     * @return complete single table-row
     */
     function buildSingleRow(notation1, value1, title1, striped) {
        let row = "";

        if(striped == true) {
            row += "<div class=\\\"row ol-state-striped-15\\\">";

            row += "<div class=\\\"col-lg-12 col-md-12 col-sm-12 col-xs-12 ol-state-striped-15\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-3 col-md-3 col-sm-3 col-xs-5 nowrap\\\" title=\\\"" + title1 + "\\\" style=\\\"font-weight: 550; text-align: right;\\\">" + notation1 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-9 col-md-9 col-sm-9 col-xs-7\\\">" + value1 + "</div>";
            row += "</div></div>";

            row += "</div>";                                                     //  "<div class=\\\"row ol-state-striped-15\\\">"
        } else {
            row += "<div class=\\\"row\\\">";

            row += "<div class=\\\"col-lg-12 col-md-12 col-sm-12 col-xs-12\\\">";
            row += "<div class=\\\"row\\\">";
            row += "<div class=\\\"col-lg-3 col-md-3 col-sm-3 col-xs-5 nowrap\\\" title=\\\"" + title1 + "\\\" style=\\\"font-weight: 550; text-align: right;\\\">" + notation1 + "</div>";
            row += "<div id=\\\"ol-statistics-content\\\" class=\\\"col-lg-9 col-md-9 col-sm-9 col-xs-7\\\">" + value1 + "</div>";
            row += "</div></div>";

            row += "</div>";                                                     //  "<div class=\\\"row ol-state-striped-15\\\">"
        }

        return row;
    }

    function run() {
        buildButtonForUserInput();
    }

    function init(){
        waitForKeyElements (
            "div.pull-left.ol-scroll-overlay-parent.menu-scroll-wrapper.ol-team-overview",
            run
        );
    }

    if (!window.OLToolboxActivated) {
       init();
    } else {
        window.OnlineligaFriendlyInfo = {
            init : init
        };
    }

    class Player {
        constructor(name, strength, talent, age, position, weight, height, birthday, value, salary, remaining, contractLeft, contractTerm, games, goals, assists) {
          this.name = name;
          this.strength = strength;
          this.talent = talent;
          this.age = age;
          this.position = position;
          this.weight = weight;
          this.height = height;
          this.birthday = birthday;
          this.value = value;
          this.salary = salary;
          this.remaining = remaining;
          this.contractLeft = contractLeft;
          this.contractTerm = contractTerm;
          this.games = games;
          this.goals = goals;
          this.assists = assists;
        }
    }
})();