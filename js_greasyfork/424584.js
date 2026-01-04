/* jshint esversion: 6, multistr: true */
/* globals waitForKeyElements, OLCore */

// ==UserScript==
// @name           OnlineligaLineupInfo
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.1.0
// @license        LGPLv3
// @description    Zusatzinfos zur Aufstellung bei www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @require        https://greasyfork.org/scripts/424598-olcore/code/OLCore.js?version=919044
// ==/UserScript==

/*********************************************
 * 0.1.0 10.04.2021 Release
 *********************************************/
(function() {
    'use strict';

    var $ = unsafeWindow.jQuery;

    async function showInfo(){

        if ($("div.ol-team-settings-pitch-wrapper").length === 0){
            return;
        }

        function getData(url){ return $.get(url); }

        function euroValue(val){
            return `${new Intl.NumberFormat('de-DE').format(val)} €`;
        }

        function parseTeamData(teamData){
            const teamValue = $(teamData).find('span.bandarole-team-value > span.pull-right').text();
            const teamRows = $(teamData).filter('div.team-overview-squad-row');
            const teamSize = teamRows.length;
            const playerData = {};
            const playerArray = [];
            teamRows.each(function(){
                const row = $(this);
                const playerSpan = row.find("span.ol-player-name");
                if (playerSpan.length > 0){
                    const playerId = parseInt(playerSpan.attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1], 10);
                    const playerValue = parseInt(row.find('div.col-md-3.col-lg-3.col-sm-6.col-xs-6.text-right').text().trim().replace(/\./g,''),10) || 0;
                    if (playerId > 0){
                        playerData[playerId] = playerValue;
                        playerArray.push({"id":playerId, "value": playerValue});
                    }
                }
            });
            const top11value = playerArray
            .sort((a,b) => b.value - a.value)
            .slice(0,11)
            .map(a => a.value)
            .reduce((pv, cv) => pv + cv, 0);
            const teamValueInt = parseInt(teamValue.replace(/\./g,''),10);
            const averageTeam = Math.round(teamValueInt/teamSize);
            return {
                "teamVal" : teamValueInt,
                "teamAvg" : averageTeam,
                "top11" : top11value,
                "playerObj": playerData,
                "playerArr": playerArray,
                "lineupVal": 0
            }
        }

        const userIdCont = $("div#matchdayresult > div.ol-page-content > div.row.ol-paragraph-2 > div > a[onclick]");
        const userId0 = $(userIdCont[0]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1];
        const userId1 = $(userIdCont[1]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1];

        const teamData0 = parseTeamData(await getData(`/team/overview/squad?userId=${userId0}`));
        const teamData1 = parseTeamData(await getData(`/team/overview/squad?userId=${userId1}`));

        const pitches = $("div#matchContent div.ol-team-settings-pitch-position-wrapper");
        const pitch0 = pitches[0];
        const pitch1 = pitches[1];

        $(pitch0).find("div.ol-pitch-position").each(function(i,e){
            const playerId = parseInt(e.parentNode.localName === "a" && e.parentNode.hasAttribute("onclick") ? $(e.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] : $(e).find("div[data-player-id]").attr("data-player-id"),10);
            if (playerId > 0){
                teamData0.lineupVal += teamData0.playerObj[playerId] || 0;
            }
        });
        $(pitch1).find("div.ol-pitch-position").each(function(i,e){
            const playerId = parseInt(e.parentNode.localName === "a" && e.parentNode.hasAttribute("onclick") ? $(e.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] : $(e).find("div[data-player-id]").attr("data-player-id"),10);
            if (playerId > 0){
                teamData1.lineupVal += teamData1.playerObj[playerId] || 0;
            }
        });

        teamData0.lineupPercent11 = Math.round(teamData0.lineupVal*100/teamData0.top11,0);
        teamData0.lineupPercentAll = Math.round(teamData0.lineupVal*100/teamData0.teamVal,0);
        teamData1.lineupPercent11 = Math.round(teamData1.lineupVal*100/teamData1.top11,0);
        teamData1.lineupPercentAll = Math.round(teamData1.lineupVal*100/teamData1.teamVal,0);

        $(pitch0).append(`<div class="lineupinfo_percentLineup" style="top: 0%" title="% v. Top 11 (MW)">${teamData0.lineupPercent11}%</div>`);
        $(pitch0).append(`<div class="lineupinfo_percentLineup" style="top: 5%" title="% v. gesamt Team">${teamData0.lineupPercentAll}%</div>`);
        $(pitch0).append(`<div class="lineupinfo_percentLineup" style="top: 0%; right:0%;" title="MW Aufstellung">${euroValue(teamData0.lineupVal)}</div>`);
        $(pitch0).append(`<div class="lineupinfo_percentLineup" style="top: 5%; right:0%;" title="MW Team">${euroValue(teamData0.teamVal)}</div>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup" style="top: 0%" title="% v. Top 11 (MW)">${teamData1.lineupPercent11}%</div>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup" style="top: 5%" title="% v. gesamtes Team">${teamData1.lineupPercentAll}%</div>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup" style="top: 0%; right:0%;" title="MW Aufstellung">${euroValue(teamData1.lineupVal)}</div>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup" style="top: 5%; right:0%;" title="MW Team">${euroValue(teamData1.teamVal)}</div>`);

        console.log('team0', teamData0);
        console.log('team1', teamData1);

    };

    function init(){
        OLCore.addStyle("div.lineupinfo_percentLineup {position:absolute;}","OLI_LineupDiv");
        showInfo();
    };

    waitForKeyElements(
        "div.row > div.statistics-lineup-wrapper:first-child",
        init
    );

})();

