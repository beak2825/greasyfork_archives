/*jshint esversion: 8, multistr: true */
/* globals waitForKeyElements */

// ==UserScript==
// @name           OnlineligaFriendlyInfo
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.1.0
// @license        LGPLv3
// @description    Zusatzinfos für Friendlies für www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant          unsafeWindow 
// ==/UserScript==
(function() {
    'use strict';

    var $ = $ || window.jQuery;

    async function showTeamInfo(){
        let userId;
        const parentDiv = this.parentNode;
        const offerRow = parentDiv.parentNode.parentNode;
        const spanClick = $(parentDiv).find('span.ol-team-name').attr("onclick");
        const userIdMatch = spanClick.match(/{\s*'?userId'?\s*:\s*(\d+)\s*}/);
        let lineup11Value = 0;
        let lineupAllValue = 0;

        function euroValue(val){
            return `${new Intl.NumberFormat('de-DE').format(val)} €`;
        }

        function getData(url){ return $.get(url); }

        if (userIdMatch){
            userId = userIdMatch[1];
            const teamData = await getData(`/team/overview/squad?userId=${userId}`);
            const teamValue = $(teamData).find('span.bandarole-team-value > span.pull-right').text();
            const teamRows = $(teamData).filter('div.team-overview-squad-row');
            const teamSize = teamRows.length;
            const playerValues = [];
            teamRows.each(function(){
                const row = $(this);
                const playerValue = parseInt(row.find('div.col-md-3.col-lg-3.col-sm-6.col-xs-6.text-right').text().trim().replace(/\./g,''),10) || 0;
                playerValues.push(playerValue);
                const lineupState = row.find('span.ol-player-squad-display.pull-right');
                if (lineupState.length > 0){
                    if (!$($(lineupState)[0]).hasClass('player-substitute-display')){
                        lineup11Value += playerValue;
                    }
                    lineupAllValue += playerValue;
                }
            });
            const friendly11Value = euroValue(lineup11Value);
            const friendlyAllValue = euroValue(lineupAllValue);
            const teamValueInt = parseInt(teamValue.replace(/\./g,''),10);
            const top11Value = playerValues.sort((a,b) => b - a).slice(0,11).reduce((a, b) => a + b, 0);
            const friendlyPercent = Math.round((lineup11Value/teamValueInt) * 100);

            const average11Value = Math.round(lineup11Value/11);
            const averageTeam = Math.round(teamValueInt/teamSize);

            $(`<div style="font-size:12px;margin-left:20px;"> \
                <span style="white-space:nowrap;" title="Durchschnitt MW Aufstellung">${euroValue(average11Value)}/</span> \
                <span style="white-space:nowrap;" title="% v. Top 11 (MW)">${Math.round(lineup11Value/top11Value*100)}%</span> \
                <br/><span style="white-space:nowrap;" title="Durchschnitt MW Team">${euroValue(averageTeam)}/</span> \
                <span style="white-space:nowrap;" title="% v. MW Team">${Math.round(lineup11Value/teamValueInt*100)}%</span> \
                </div>`).appendTo($(offerRow).children().eq(1));

        }
    }

    function run(){
        $("div#olFriendlyRequestsContent").on('click','span.user-badge',showTeamInfo);
    }

    function init(){
        waitForKeyElements (
            "div#olFriendlyRequestsContent",
            run 
        );
    }
    
    init();

})();