/*jshint esversion: 8, multistr: true */
/* globals waitForKeyElements, OLCore, GM_setClipboard, OLi18n, unsafeWindow, GM_setValue, GM_listValues, GM_deleteValue, GM_getValue, GM_addStyle */

// ==UserScript==
// @name           OnlineligaFriendlyHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.4.1
// @license        LGPLv3
// @description    Zusatzinfos für Friendlies für www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_setClipboard
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/425292/OnlineligaFriendlyHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/425292/OnlineligaFriendlyHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 20.04.2021 Release
 * 0.1.1 21.04.2021 Friendly Blocker
 * 0.1.2 01.05.2021 Bugfix: Error on incomplete lineups
 * 0.1.3 18.05.2021 Add L-Zahl (MW Aufstellung/MW Liga)
 * 0.1.4 24.05.2021 L-Zahl for actual League Lineup
 * 0.1.5 03.06.2021 Bugfix: correct L-Zahl if player is not in squad
 * 0.1.6 08.07.2021 + freeText for Friendly Overview
                    + show free weeks
 * 0.1.7 12.07.2021 - show free weeks
                    + copy free weeks to clipboard
 * 0.1.8 13.07.2021 Bugfix: Handle L-Number, if team has no last league match (new user)
 * 0.1.9 14.07.2021 Bugfix: L-Number display
 * 0.2.0 24.08.2021 Use correct L-Value
 * 0.2.1 07.09.2021 Bugfix L-Value
 * 0.2.2 08.09.2021 Bugfix L-Value
 * 0.2.3 19.09.2021 Bugfix Friendly-Blocker
 * 0.2.4 27.10.2021 minor tweaks
 * 0.2.5 03.11.2021 optimize css for L-Value (mobile view)
 * 0.2.6 06.01.2022 save L Value for stadium utilization export
 * 0.3.0 24.01.2022 i18n support
 * 0.3.1 17.06.2022 bugfix friendly blocker
 * 0.3.2 03.07.2022 fix mobile view LValue
 * 0.3.3 05.07.2022 Bugfix L Value on match preview
 * 0.3.4 29.10.2022 Add Dates to Offer/Accept/List
 * 0.4.0 20.11.2024 OL 2.0
 * 0.4.1 26.11.2024 Ol 2.0 Friendly notes
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const api = OLCore.Api;
    const uid = OLCore.Base.userId;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    async function showInfo(){

        if ($("div.ol-team-settings-pitch-wrapper").length === 0){
            return;
        }

        const pitches = $("div#matchContent div.ol-team-settings-pitch-position-wrapper");
        const pitch0 = pitches[0];
        const pitch1 = pitches[1];
        $(pitch0).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_left" style="top: 0%" title="${tt("MW Aufstellung zu MW Top 11 (nach MW)")}"/>`);
        $(pitch0).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_left" style="top: 5%" title="${tt("MW Aufstellung zu MW Kader")}"/>`);
        $(pitch0).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_right" style="top: 0%;" title="&Oslash; ${tt("MW Aufstellung")}"/>`);
        $(pitch0).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_right" style="top: 5%;" title="${tt("MW Aufstellung")}"/>`);

        $(pitch1).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_left" style="top: 0%" title="${tt("MW Aufstellung zu MW Top 11 (nach MW)")}"/>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_left" style="top: 5%" title="${tt("MW Aufstellung zu MW Kader")}"/>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_right" style="top: 0%;" title="&Oslash; ${tt("MW Aufstellung")}"/>`);
        $(pitch1).append(`<div class="lineupinfo_percentLineup lineupinfo_percentLineup_right" style="top: 5%;" title="${tt("MW Aufstellung")}"/>`);

        const pi0 = OLCore.UI.progressIndicator(".lineupinfo_percentLineup", {clear:true});

        const userIdCont = $("div#matchdayresult  span.pointer[onclick*='/team/overview']");
        const userId0 = parseInt($(userIdCont[0]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1], 10);
        const userId1 = parseInt($(userIdCont[1]).attr("onclick").match(/\s*'?userId'?\s*:\s*(\d+)\s*}/)[1], 10);

        const squadData0 = await api.getSquad(userId0);
        const squadData1 = await api.getSquad(userId1);

        const teamData0 = {
            "teamAvg" : Math.round(squadData0.teamVal / squadData0.playerArr.length),
            "top11" : squadData0.playerArr
            .sort((a,b) => b.value - a.value)
            .slice(0,11)
            .map(a => a.value)
            .reduce((pv, cv) => pv + cv, 0),
            "lineupVal": 0
        };
        const teamData1 = {
            "teamAvg" : Math.round(squadData1.teamVal / squadData1.playerArr.length),
            "top11" : squadData1.playerArr
            .sort((a,b) => b.value - a.value)
            .slice(0,11)
            .map(a => a.value)
            .reduce((pv, cv) => pv + cv, 0),
            "lineupVal": 0
        };

        const players0 = [];
        const players1 = [];

        $(pitch0).find("div.ol-pitch-position").each(function(i,e){
            const playerId = parseInt(
                e.parentNode.localName === "a" ?
                (e.parentNode.hasAttribute("onclick") ? $(e.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] : 0) :
                $(e).find("div[data-player-id]").attr("data-player-id"),10);
            if (playerId > 0 && squadData0.playerObj[playerId]){
                players0.push(playerId);
                teamData0.lineupVal += squadData0.playerObj[playerId].value || 0;
            }
        });
        $(pitch1).find("div.ol-pitch-position").each(function(i,e){
            const playerId = parseInt(
                e.parentNode.localName === "a" ?
                (e.parentNode.hasAttribute("onclick") ? $(e.parentNode).attr("onclick").match(/\s*'?playerId'?\s*:\s*(\d+)\s*}/)[1] : 0) :
                $(e).find("div[data-player-id]").attr("data-player-id"),10);
            if (playerId > 0 && squadData1.playerObj[playerId]){
                players1.push(playerId);
                teamData1.lineupVal += squadData1.playerObj[playerId].value || 0;
            }
        });

        pi0.end();

        teamData0.lineupAvg = Math.round(teamData0.lineupVal/11,0);
        teamData0.top11Avg = Math.round(teamData0.top11/11,0);
        teamData0.lineupPercent11 = Math.round(teamData0.lineupVal*100/teamData0.top11,0);
        teamData0.lineupPercentAll = Math.round(teamData0.lineupVal*100/squadData0.teamVal,0);
        teamData0.lineupPercentAvg11 = Math.round(teamData0.lineupAvg*100/teamData0.top11Avg,0);
        teamData0.lineupPercentT = Math.round(teamData0.lineupAvg*100/teamData0.teamAvg,0);

        teamData1.lineupAvg = Math.round(teamData1.lineupVal/11,0);
        teamData1.top11Avg = Math.round(teamData1.top11/11,0);
        teamData1.lineupPercent11 = Math.round(teamData1.lineupVal*100/teamData1.top11,0);
        teamData1.lineupPercentAll = Math.round(teamData1.lineupVal*100/squadData1.teamVal,0);
        teamData1.lineupPercentAvg11 = Math.round(teamData1.lineupAvg*100/teamData1.top11Avg,0);
        teamData1.lineupPercentT = Math.round(teamData1.lineupAvg*100/teamData1.teamAvg,0);

        const pitch0Divs = $(pitch0).children("div.lineupinfo_percentLineup");
        const pitch1Divs = $(pitch1).children("div.lineupinfo_percentLineup");

        pitch0Divs.eq(0).text(teamData0.lineupPercent11 + '%');
        pitch0Divs.eq(1).text(teamData0.lineupPercentAll + '%');
        pitch0Divs.eq(2).text(OLCore.euroValue(teamData0.lineupAvg));
        pitch0Divs.eq(3).text(OLCore.euroValue(teamData0.lineupVal));

        pitch1Divs.eq(0).text(teamData1.lineupPercent11 + '%');
        pitch1Divs.eq(1).text(teamData1.lineupPercentAll + '%');
        pitch1Divs.eq(2).text(OLCore.euroValue(teamData1.lineupAvg));
        pitch1Divs.eq(3).text(OLCore.euroValue(teamData1.lineupVal));

    }

    function showBlocker(){

        const keyUpHandle = {};
        const freeDays = [];

        function evt_copyFreeWeeks(){
            freeDays.sort();
            $("#FriendlyHelperFreeDays").remove();
            let fDays = [];
            let check = 0;
            let f = [];
            let i = 0;
            for (const fd of freeDays){
                const season = Math.floor(fd/100);
                const week = fd % 100;
                if (season !== check){
                    if (fDays.length) {
                        fDays[i] += f.join(", ");
                        i++;
                        f = [];
                    }
                    fDays.push(`S${season}: `);
                    check = season;
                }
                f.push(week);
            }
            if (fDays.length){
                fDays[i] += f.join(", ");
            }
            GM_setClipboard(fDays.join(" - "));
            OLCore.info(tt("Daten in die Zwischenablage kopiert"));
        }

        function showFreeDays(){
            freeDays.sort();
            $("#FriendlyHelperFreeDays").remove();
            let fDays = [];
            let check = 0;
            let f = [];
            let i = 0;
            for (const fd of freeDays){
                const season = Math.floor(fd/100);
                const week = fd % 100;
                if (season !== check){
                    if (fDays.length) {
                        fDays[i] += f.join(", ");
                        i++;
                        f = [];
                    }
                    fDays.push(`S${season}: `);
                    check = season;
                }
                f.push(week);
            }
            if (fDays.length){
                fDays[i] += f.join(", ");
            }
            $("div#olFriendlyOffersContent").find("div.ol-2-table-headline").append(`<span style="margin-left:10px;font-size:smaller;float:right;" id="FriendlyHelperFreeDays">Freie Wochen ${fDays.join(" - ")}</span>`);
        }

        function evt_saveBlocker(evt){

            const inp = evt.currentTarget;

            function writeBlocker(){
                const dayId = parseInt(inp.id.replace("friendlyBlocker",""),10);
                if (inp.value){
                    if (freeDays.includes(dayId)) {
                        freeDays.splice(freeDays.indexOf(dayId),1);
                    }
                } else {
                    if (!freeDays.includes(dayId)){
                        freeDays.push(dayId);
                    }
                }
                GM_setValue(inp.id, inp.value);
                //showFreeDays();
            }

            if (keyUpHandle[inp.id]){
                window.clearTimeout(keyUpHandle[inp.id]);
            }
            keyUpHandle[inp.id] = window.setTimeout(writeBlocker, 1000);
        }

        function evt_saveFreeText(){

            const inp = $("#FriendlyHelperFreeText")[0];

            function writeFreeText(){
                GM_setValue(inp.id, inp.value);
            }

            if (keyUpHandle.freeText){
                window.clearTimeout(keyUpHandle.freeText);
            }
            keyUpHandle.freeText = window.setTimeout(writeFreeText, 1000);

        }

        if ($("div.ol-friendly-offers-table-row:first-child .text-matchresult").length){
            const isPlayed = $("div.ol-friendly-offers-table-row:first-child .text-matchresult").text().toUpperCase === "SPIELBERICHT";
            OLCore.setMatchdayValue("isFriendlyPlayed", isPlayed);
        }
				
        let season = OLCore.Base.season;
        let newSeason = 0;
        let freeText = "";

        const listValues = GM_listValues();
        const firstId = (season * 100) + OLCore.getNum($("div.row.ol-friendly-row > div > div > div > span").eq(0).text());
        for (const val of listValues.filter(v => /^friendlyBlocker\d+$/.test(v))){
            const dayId = parseInt(val.replace("friendlyBlocker",""), 10);
            if (dayId < firstId){
                GM_deleteValue(val);
            }
        }

        $("div.ol-2-table-rows").children().each(function(i,e){
            const row = $(e);
            if (row.hasClass("ol-season-seperator")){
                season = OLCore.getNum(row.find("span.ol-title").text());
            } else {
                const week = OLCore.getNum(row.children("div").eq(0).children("div").eq(0).children("div").eq(0).children("span").eq(0).text());
                if (row.find("div > div.ol-friendly-flex-row").length === 0) {
                    const dayId = (season * 100) + week;
                    const blockerValue = GM_getValue(`friendlyBlocker${dayId}`) || '';
                    const targetDiv = row.children("div").eq(1).children("div").eq(0).children("div").eq(0);
                    targetDiv.html('');
                    $(`<input type="text" style="margin-left:10px;color:black;width:100%" class="friendlyBlockerInput" id="friendlyBlocker${dayId}" value="${blockerValue}" />`).insertBefore(targetDiv);
                    if (blockerValue === ""){
                        freeDays.push(dayId);
                    }
                }
                const dateSpan = row.children("div").eq(0).children("div").eq(0).children("div").eq(0).contents().last();
                if (dateSpan.length){
                    let mdShort = 'ST';
                    if (OLi18n.shortLang === 'en'){
                        mdShort = 'MD';
                    }
                    const dateTxt = dateSpan.text();
                    const tmpNum = OLCore.getNum(dateTxt);
                    const dt = new OLCore.OLDate(season, week);
                    let dateString = '';
                    if (tmpNum > 0){
                        dateString = `(${mdShort}${tmpNum} ${dt.toWdShortString()})`;
                    } else if (dateTxt.includes(t("Winterpause"))){
                        dateString = `(${t("WP")} ${dt.toWdShortString()})`;
                    } else if (dateTxt.includes(t("Sommerpause"))){
                        dateString = `(${t("SP")} ${dt.toWdShortString()})`;
                    }
                    dateSpan.replaceWith(` <span style="font-size:smaller">${dateString}</span>`);
                }
            }
        });
        //showFreeDays();
        $("div.ol-2-table-rows").on('keydown','input.friendlyBlockerInput',evt_saveBlocker);
        freeText = GM_getValue("FriendlyHelperFreeText") || "";
        $("div.ol-2-table-rows").after(`<div><textarea rows="10" style="width:100%; font-size:11pt;" id="FriendlyHelperFreeText">${freeText}</textarea></div>`);
        $("#FriendlyHelperFreeText").on('keydown',evt_saveFreeText);
        $("div#olFriendlyOffersContent").find("div.ol-2-table-headline").append(`<button style="display:inline; float:right;" class="ol-button ol-button-copy" id="btnCopyFreeWeeks" title="${tt("Freie Wochen in Zwischenablage kopieren")}"><span class="fa fa-clipboard" /></button>`);
        $("#btnCopyFreeWeeks").on('click',evt_copyFreeWeeks);
    }

    function addDateToFriendlyOffer(){
        const season = OLCore.Base.season;

        function displayDate(tgt, dt){
            let mdShort = 'ST';
            if (OLi18n.shortLang === 'en'){
                mdShort = 'MD';
            }
            const dateTgt = tgt.next();
            const tmpTxt = dateTgt.text();
            const tmpNum = OLCore.getNum(tmpTxt);
            let dateString = '';
            if (tmpNum > 0){
                dateString = `(${mdShort}${tmpNum} ${dt.toWdShortString()})`;
            } else if (tmpTxt.includes(t("Winterpause"))){
                dateString = `(${t("WP")} ${dt.toWdShortString()})`;
            } else if (tmpTxt.includes(t("Sommerpause"))){
                dateString = `(${t("SP")} ${dt.toWdShortString()})`;
            }
            dateTgt.text(dateString);
        }

        function showCurrDate(records){
            const an = records.find(r => r.addedNodes.length);
            if (!an) {
                return;
            }
            const dt = new OLCore.OLDate(season, Number(an.addedNodes[0].textContent));
            displayDate($(an.target),dt);
        }

        function showNextDate(records){
            const an = records.find(r => r.addedNodes.length);
            if (!an) {
                return;
            }
            const dt = new OLCore.OLDate(season+1, Number(an.addedNodes[0].textContent));
            displayDate($(an.target),dt);
        }

        const currMin = OLCore.getNum($('#label-friendlyCreateWeekCurr').find('.label-value-min').text());
        const currMinDate = new OLCore.OLDate(season, currMin);
        displayDate($('#label-friendlyCreateWeekCurr').find('span.label-value-min'),currMinDate);
        $('#label-friendlyCreateWeekCurr').find('span.label-value-min').attr('title',currMinDate.toWdString());

        const nextMin = OLCore.getNum($('#label-friendlyCreateWeekNext').find('.label-value-min').text());
        const nextMinDate = new OLCore.OLDate(season, nextMin);
        displayDate($('#label-friendlyCreateWeekNext').find('span.label-value-min'),nextMinDate);

        const cMinMO = new MutationObserver(showCurrDate);
        const cMaxMO = new MutationObserver(showCurrDate);
        cMinMO.observe($('#label-friendlyCreateWeekCurr').find('.label-value-min')[0],{childList: true});
        cMaxMO.observe($('#label-friendlyCreateWeekCurr').find('.label-value-max')[0],{childList: true});

        const nMinMO = new MutationObserver(showNextDate);
        const nMaxMO = new MutationObserver(showNextDate);
        nMinMO.observe($('#label-friendlyCreateWeekNext').find('.label-value-min')[0],{childList: true});
        nMaxMO.observe($('#label-friendlyCreateWeekNext').find('.label-value-max')[0],{childList: true});
        /*
        const currMin = OLCore.getNum($('#label-friendlyCreateWeekCurr').find('.label-value-min').text());
        const currMax = OLCore.getNum($('#label-friendlyCreateWeekCurr').find('.label-value-max').text());
        const nextMin = OLCore.getNum($('#label-friendlyCreateWeekNext').find('.label-value-min').text());
        const nextMax = OLCore.getNum($('#label-friendlyCreateWeekNext').find('.label-value-max').text());
        const currMinDate = new OLCore.OLDate(season, currMin);
        const currMaxDate = new OLCore.OLDate(season, currMax);
        const nextMinDate = new OLCore.OLDate(season+1, nextMin);
        const nextMaxDate = new OLCore.OLDate(season+1, nextMax);
        $('#label-friendlyCreateWeekCurr').find('span.label-value-min').attr('title',currMinDate.toWdString());
        $('#label-friendlyCreateWeekCurr').find('span.label-value-max').attr('title',currMaxDate.toWdString());
        */
    }

    function addDateToFriendlyAccept(hd){
        if ($('#friendlyOfferWizard').length){
            return;
        }
        const wkTextNode = $(hd).next().find('div.ol-2-table-row > div.row').eq(0).children('div').eq(1);
        const wkText = wkTextNode.text();
        const wk = OLCore.getNum(wkText);
        const addTextMatch = wkText.match(/\((.*)\)/);
        let addText = '';
        let tmpNum = 0;
        if (addTextMatch && addTextMatch.length){
            addText = addTextMatch[1];
            tmpNum = OLCore.getNum(addText);
        }
        if (addText.length){
            const dt = new OLCore.OLDate(wk < OLCore.Base.week? OLCore.Base.season + 1 : OLCore.Base.season, wk);
            let dateString = '';
            let mdShort = 'ST';
            if (OLi18n.shortLang === 'en'){
                mdShort = 'MD';
            }
            if (tmpNum > 0){
                dateString = `(${mdShort} ${tmpNum} - ${dt.toWdShortString()})`;
            } else if (addText.includes(t("Winterpause"))){
                dateString = `(${t("Winterpause")} - ${dt.toWdShortString()})`;
            } else if (addText.includes(t("Sommerpause"))){
                dateString = `(${t("Sommerpause")} - ${dt.toWdShortString()})`;
            }
            wkTextNode.text(`${wk} ${dateString}`);
        }
    }

    function run(){

        GM_addStyle(`div.lineupinfo_percentLineup {position:absolute;}
                    .ol-xs .lineupinfo_percentLineup_left{left: 10%;}
        .ol-xs .lineupinfo_percentLineup_right{right: 10%;}
        .ol-xs .lineupinfo_percentLineup.LVal{left: 10%;top: 10%}
        .ol-xs .newLHint {left: 10%}
        .lineupinfo_percentLineup_left{left: 0%;}
        .lineupinfo_percentLineup_right{right: 0%;}
        .lineupinfo_percentLineup.LVal{top: 10%;}
        .lineupinfo_percentLineup.LValNew{top: 15%;}`);
        showInfo();
    }

    function init(){

        // FriendlyBlocker
        OLCore.waitForKeyElements (
            "div#olFriendlyOffersContent",
            showBlocker
        );

        //Info on lineup
        OLCore.waitForKeyElements(
            "div.row > div.statistics-lineup-wrapper:first-child",
            run
        );

        //Date of Friendly-Weeks on Offer
        OLCore.waitForKeyElements (
            "div#friendlyOfferWizard",
            addDateToFriendlyOffer
        );

        //Date of Friendly-Weeks on Accept
        OLCore.waitForKeyElements (
            "div#overlayWindow div.ol-create-friendly-overlay-head",
            addDateToFriendlyAccept
        );



    }

    init();

})();