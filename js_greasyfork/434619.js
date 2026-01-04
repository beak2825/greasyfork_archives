/* jshint esversion: 10, multistr: true */
/* globals OLCore, OLSettings, OLi18n, unsafeWindow, GM_setValue, GM_getValue, GM_setClipboard, GM_addStyle */

// ==UserScript==
// @name           OnlineligaStadiumHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.4.4
// @license        LGPLv3
// @description    Helfer für Stadion bei www.onlineliga.de (OFA)
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @require        https://greasyfork.org/scripts/434618-olsettings/code/OLSettings.user.js
// @grant          GM_addStyle
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @downloadURL https://update.greasyfork.org/scripts/434619/OnlineligaStadiumHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/434619/OnlineligaStadiumHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 27.10.2021 Release
 * 0.1.1 28.10.2021 + total share of friendlys
 * 0.1.2 03.11.2021 Bugfix friendly utilization
 * 0.1.3 03.12.2021 + avg utilization/income per season
 * 0.1.4 09.12.2021 + copy utilization to clipboard
 * 0.1.5 06.01.2022 + extend utilization export
                    + additional info for next matches
 * 0.2.0 24.01.2022 i18n support
 * 0.2.1 13.07.2022 Bugfix boxes capacity
 * 0.3.0 13.01.2023 save bar for prices
 * 0.3.1 27.01.2023 hotfix Export
 * 0.3.2 12.02.2023 show block utilization
 * 0.4.0 20.11.2024 OL 2.0
 * 0.4.1 23.11.2024 adjust output format
 * 0.4.2 19.12.2024 Fix: Export for sports field
 *                  Fix: Friendly income for new friendly prices
 * 0.4.3 30.10.2025 Fix: price export
 * 0.4.4 03.11.2025 Fix: match preview
 *********************************************/
(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const api = OLCore.Api;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    let stadiumId;
    const seatTypes = {};

    let saveBar;

    async function initValues(){
        stadiumId = parseInt($("input#stadiumId").val(),10);
        $("div#standardLoadingDiv.stadium-right-table-main01").find("table > thead > tr > td").not(":first").each(function(i, td){
            const typeName = $(td).contents().eq(0).text().trim();
            seatTypes[typeName] = i+1;
        });
    }

    function fetchPrices(){
        const prices = {};
        let data_id, data_type;
            $(".ticketPriceInput.leagueTicketPrice[data-type][data-id]:visible").each(function(i,el){
                data_id = $(el).attr("data-id");
                data_type = $(el).attr("data-type");
                prices[data_id] = prices[data_id] || {};
                prices[data_id][data_type] = $(el).val();
            });
        return JSON.stringify(prices);
    }

    async function setPrices(priceData){
        const progressIndicator = OLCore.UI.progressIndicator("div.stadium-right-pnl",{overlay:true});
        let prices;
        try {
            prices = JSON.parse(priceData);
        } catch {
            if (progressIndicator) progressIndicator.end();
            return;
        }
        Object.keys(prices).forEach(function(data_id){
            Object.keys(prices[data_id]).forEach(function(data_type){
                const inp = $(`.ticketPriceInput.leagueTicketPrice[data-type="${data_type}"][data-id="${data_id}"]`);
                const val = prices[data_id][data_type];
                if (inp.length && val){
                    inp.val(val);
                    inp.attr("value",val);
                    inp.trigger("change");
                }
            });
        });
        await OLCore.sleep(250);
        if (progressIndicator) progressIndicator.end();
    }

    function showPriceControls(){
        saveBar.show();
    }

    function createPriceControls(){
        saveBar = OLCore.UI.saveBar({
            id: 'StadiumPricesLeague',
            fetchData: fetchPrices,
            on: {
                change: setPrices
            }
        });
        saveBar.insertBefore("div#standardLoadingDiv");
        showPriceControls();
        $("input#ticketPriceType").change(showPriceControls);
    }

    async function showUtilization(){

        const utilizationData = [];

        function addCopyButton(){

            const copyBtn = OLCore.UI.button({
                copy:true,
                title: tt("Daten in die Zwischenablage kopieren") + "\n" + tt("Shift halten für Kopfzeile, Strg für Zusatzdaten")
            });

            $(".settings-heading").eq(0).append(copyBtn);

            async function copyDataToClipboard(event){
                const uniform = OLSettings.get("StadiumExportUniform");
                const withHeadlines = event.shiftKey;
                const withExtData = OLSettings.get("StadiumExportExtended");

                let progressIndicator;
                if (withExtData){
                    progressIndicator = OLCore.UI.progressIndicator('div.stadium-right-pnl-inner');
                }

                const capaLeague = OLCore.getNum($("span.settings-acc-capacity > span.ol-league-only").eq(0).text());
                const lastLeagueRow = $(`table.stadium-accordion-tbody > tbody > tr.ol-match`).eq(0);
                const mdwL = lastLeagueRow.children().eq(0).contents().filter(function(){ return this.nodeType === 3;}).last().text().trim().replace(/\s+/g,'').split('/');
                const revenuesL = lastLeagueRow.children().eq(4).text().trim().replace(/\s+/g,'').split('/');
                const specL = OLCore.getNum(lastLeagueRow.children().eq(2).text().trim());
                const utilL = OLCore.getNum(lastLeagueRow.children().eq(3).text().trim());
                const utilLx = (specL/capaLeague)*100;
                const matchIdL = OLCore.getNum(lastLeagueRow.children("td").last().children("div").first().attr("onclick"),1);

                const lastLeagueData = {
                    matchDay: parseInt(mdwL[0]),
                    week: parseInt(mdwL[1]),
                    opponent: lastLeagueRow.find("span.ol-team-name").text().trim(),
                    opponentUserId: OLCore.getNum(lastLeagueRow.find("span.ol-team-name").attr("onclick")),
                    spectators: specL,
                    utilization: OLi18n.tbNum(OLCore.round((Math.abs(utilLx - utilL) < 1 ? utilLx : utilL), 2)),
                    revenue: OLCore.getNum(revenuesL[0]),
                    matchId: matchIdL
                };

                const matchData = lastLeagueData;
                async function getExtData(){
                    let lHome, lAway;
                    let extCacheId = "L";
                    const cacheData = OLCore.getMatchdayValueId("StadiumDataExt",extCacheId);
                    if (cacheData){
                        return JSON.parse(cacheData);
                    }
                    const opponentUserId = matchData.opponentUserId;
                    const opponentTeamData = await OLCore.Api.getTeamInfo(opponentUserId);
                    const ownTeamData = await OLCore.Api.getTeamInfo();
                    const matchDay = OLCore.week2matchDay(matchData.week, true);
                    let opponentRank = 1, ownRank = 1;

                    async function getRanks(){
                        const cacheRanks = OLCore.getSeasonValueId("LEAGUERANK",`S${OLCore.Base.season}W${matchData.week}`);
                        if (cacheRanks){
                            return JSON.parse(cacheRanks);
                        }
                        const leagueRanks = await OLCore.XApi.getRanks(OLCore.Base.season, ownTeamData.leagueId, matchDay-1, [OLCore.Base.userId,opponentUserId]);
                        const ranks = [leagueRanks[OLCore.Base.userId],leagueRanks[opponentUserId]];
                        OLCore.setSeasonValueId("LEAGUERANK",`S${OLCore.Base.season}W${matchData.week}`,JSON.stringify(ranks));
                        return ranks;
                    }

                    if (matchDay > 1){
                        const ranks = await getRanks();
                        ownRank = ranks[0];
                        opponentRank = ranks[1];
                    }
                    const extData = {
                        matchDay: matchDay,
                        week: matchData.week,
                        opponent: matchData.opponent,
                        leagueHome: ownTeamData.leagueLevel,
                        leagueAway: opponentTeamData.leagueLevel,
                        rankHome: ownRank,
                        rankAway: opponentRank,
                        popularityHome: OLi18n.tbNum(ownTeamData.popularity),
                        popularityAway: OLi18n.tbNum(opponentTeamData.popularity),
                        lValueHome: lHome > 0 ? OLi18n.tbNum(lHome) : "",
                        lValueAway: lAway > 0 ? OLi18n.tbNum(lAway) : "",
                        lValueAll: lHome > 0 ? OLi18n.tbNum(Math.min(lHome,100)+Math.min(lAway, 100)) : ""
                    };
                    OLCore.setMatchdayValueId("StadiumDataExt",extCacheId,JSON.stringify(extData));
                    return extData;
                }

                const head1 = [];
                const data = [];

                if (withExtData){
                    const extData = await getExtData();
                    if (uniform){
                        head1.push("Typ");
                        data.push("L");
                    }
                    let gameDayWeekHead = "", gameDayWeekData = "";
                    if (uniform) {
                        gameDayWeekHead = tt("Spieltag") + "/" + tt("Woche");
                        gameDayWeekData = `${extData.matchDay}/${extData.week}` ;
                    } else {
                        gameDayWeekHead = tt("Spieltag");
                        gameDayWeekData = `${extData.matchDay}`;
                    }
                    const leagueHead = !uniform? tt("Liga") : `${tt("Liga")} (H)\t${tt("Liga")} (A)`;
                    const leagueData = !uniform? extData.leagueHome : extData.leagueHome + "\t" + extData.leagueAway
                    head1.push(`Saison\t${gameDayWeekHead}\tGegner\t${leagueHead}\t${tt("Platz")} (H)\t${tt("Platz")} (A)\t${tt("Pop")} (H)\t${tt("Pop")} (A)`);
                    data.push(`${OLCore.Base.season}\t${gameDayWeekData}\t${extData.opponent}\t${leagueData}\t${extData.rankHome}\t${extData.rankAway}\t${extData.popularityHome}\t${extData.popularityAway}`);
                    if (uniform){
                        head1.push(`${tt("L-Wert")} (H)\t${tt("L-Wert")} (A)\t${tt("L-Wert")} ${tt("Ges")}`);
                        data.push(`${extData.lValueHome}\t${extData.lValueAway}\t${extData.lValueAll}`);
                    }
                }

                for (const ud of utilizationData){
                    const u = ud.L;
                    //head1.push(`${ud.Meta.block} ${ud.Meta.typeClear} €\t${ud.Meta.block} ${ud.Meta.typeClear} Anz.\t${ud.Meta.block} ${ud.Meta.typeClear} \u03A3\t${ud.Meta.block} ${ud.Meta.typeClear} %`);
                    //data.push(`${u.p}\t${u.v}\t${Math.round(u.p * u.v)}\t${OLi18n.tbNum(u.r)}%`);
                    head1.push(`${ud.Meta.block} ${ud.Meta.typeClear} €\t${ud.Meta.block} ${ud.Meta.typeClear} Anz.\t${ud.Meta.block} ${ud.Meta.typeClear} %`);
                    data.push(`${u.p}\t${u.v}\t${OLi18n.tbNum(u.r)}%`);
                }
                if (withExtData){
                    head1.push(`${tt("Gesamt")}\t${tt("Ges %")}\t${tt("Einnahmen")}`);
                    data.push(`${matchData.spectators}\t${matchData.utilization}%\t${matchData.revenue}`);
                }
                if (uniform && withExtData){
                    head1.push(tt("Anteil"));
                    data.push(matchData.revenueShare);
                }
                let out = "";
                if (withHeadlines){
                    out += `${head1.join("\t")}\r\n`;
                }
                out += data.join("\t");
                GM_setClipboard(out);
                if (progressIndicator){
                    progressIndicator.end();
                }
                OLCore.info(tt("Daten in die Zwischenablage kopiert"));
            }

            copyBtn.on("click", copyDataToClipboard);

        }

        await initValues();

        async function getUtilData(modificationid){
            const cacheModId = modificationid + '#N';
            const cacheData = OLCore.getMatchdayValueId("StadiumInfo",cacheModId);
            if (cacheData && cacheData.includes("lastLeaguePrice")){
                return JSON.parse(cacheData);
            }
            const stadiumData = [];
            const data = await OLCore.get(`/settingsdetails/${stadiumId}/${modificationid}/0`);
            if (data){
                const allName = $("h2.h2-head.h2-headDtl").text();
                const allCapacity = OLCore.getNum($("div.PlatzeDiv").text());
                $(data).find("div#standardLoadingDiv > table").each(function(i, table){
                    const type = $(table).find("thead > tr > td > div:first-child").contents().eq(0).text().trim();
                    const capaString = $(table).find("thead > tr > td > div:nth-child(2)").contents().eq(0).text().trim();
                    const capacity = type === t("Logen") ? OLCore.getNum(capaString, 1) : OLCore.getNum(capaString);
                    const lastLeaguePrice = OLCore.getNum($(table).find("thead div.leagueTicketPrice input.rangeValueShow").attr("value"));
                    const lastLeague = OLCore.getNum($(table).find("tbody > tr > td > div.leagueTicketPrice").eq(0).text());
                    const lastLeaguePercent = OLCore.getNum($(table).find("tbody > tr > td:nth-child(2) > div.leagueTicketPrice").eq(0).text());
                    stadiumData.push({
                        allName: allName,
                        allCapacity: allCapacity,
                        type: type,
                        capacity: capacity,
                        lastLeague: lastLeague,
                        lastLeaguePrice: lastLeaguePrice,
                        lastLeaguePercent: lastLeaguePercent
                    });
                });
                OLCore.setMatchdayValueId("StadiumInfo",cacheModId,JSON.stringify(stadiumData));
                return stadiumData;
            }
        }

        for (const tr of $("tr.ticket-price-grid.ticket-price-settings")){
            //$("tr.ticket-price-grid").each(async function(i, tr){

            const row_id = $(tr).attr("id");
            const mobileRow = $(`div#${CSS.escape(row_id)}`);
            const mobileDivs = mobileRow.children("div.ol-mobile-stadium-settings-type");
            const id = $(tr).attr("data-id");
            let block = $(tr).attr("data-value");
            if (block === "stadium.stadiumshort_name.field.1"){
                block = tt("ZB");
            }
            const modificationid = $(tr).attr("data-modificationid");
            if (modificationid === "0") continue;
            const utilData = await getUtilData(modificationid);
            if (utilData){
                for (const ud of utilData){
                    const idx = seatTypes[ud.type];
                    if (idx){
                        const td = $(tr).children().eq(idx);
                        let utilClassL;
                        if (td.length && !td.hasClass("disabled-price")){

                            utilClassL = [...td.find("div.settingsLeftSection > span > div.leagueTicketPrice")[0].classList].find(f => f.startsWith("util"));

                            td.find("div.settingsLeftSection").css("line-height","unset");
                            $(`<div style="text-align:center;" class="${utilClassL} leagueTicketPrice">${OLCore.numVal(ud.lastLeague)}</div>`)
                                .insertAfter(td.find("div.settingsLeftSection > span > div.leagueTicketPrice").last());

                            utilizationData.push({
                                Meta: {block: block, allName: ud.allName, allCapacity: ud.allCapacity, type: ud.type, typeClear: ud.type.replace("-Seats","").replace("plätze",""), capacity: ud.capacity},
                                L:{v:ud.lastLeague,p:ud.lastLeaguePrice,r:OLCore.round((ud.lastLeague*100.0)/ud.capacity, 2)}
                            });
                        }

                        const mobileDiv = mobileDivs.eq(idx);
                        utilClassL = [...mobileDiv.find("div.settingsLeftSection > span > div.leagueTicketPrice")[0].classList].find(f => f.startsWith("util"));
                        mobileDiv.find("div.settingsLeftSection").css("line-height","unset");
                        $(`<div style="text-align:center;" class="${utilClassL} leagueTicketPrice">${OLCore.numVal(ud.lastLeague)}</div>`)
                            .insertAfter(mobileDiv.find("div.settingsLeftSection > span > div.leagueTicketPrice").last());

                    }
                }
                GM_addStyle(".stadium-right-pnl-inner .util-gray {line-height: 16px; font-size: 14px}");
                GM_addStyle(".stadium-right-pnl-inner .util-yellow {line-height: 16px; font-size: 14px}");
                GM_addStyle(".stadium-right-pnl-inner .util-red {line-height: 16px; font-size: 14px}");
                GM_addStyle(".stadium-right-pnl-inner .width45 {gap: 2px}");
            }
        }
        addCopyButton();
    }

    function showAdditionalInfo(div){
        // total friendly share
        let totalShare = 0;
        const friendlyHead = $(div).find("table > thead > tr > td").eq(4).text();
        const newFriendly = !friendlyHead.includes("/");
        $(div).find("table > tbody > tr.ol-friendly").each(function(j, tr){
            const share = OLCore.getNum($(tr).children("td").eq(4).text(), 1);
            if (share > 0){
                totalShare += share;
            }
        });
        const totalDiv = $(div).find('table > tfoot > tr > td:contains("FRIENDLY")').parent().children("td").eq(4);
        /*if (totalDiv.length){
            const fTotal = totalDiv.text().trim();
            if (newFriendly){
                totalDiv.text(fTotal);
            } else {
            totalDiv.text(`${fTotal} / ${OLCore.num2Cur(totalShare)}`);
        }
        }*/
        //avg utilization
        //avg income
        const totalUtilLeagueTD = $(div).find('table > tfoot > tr:first-child').children("td");
        const totalUtilFriendlyTD = $(div).find('table > tfoot > tr:nth-child(2)').children("td");
        const totalUtilTotalTD = $(div).find('table > tfoot > tr:nth-child(3)').children("td");
        const totalUtilLeagueTDMob = $(div).find('div.stadium-accordion-tbody-mobile > div.stadium-accordion-overall > div.row:first-child').children("div");
        const totalUtilFriendlyTDMob = $(div).find('div.stadium-accordion-tbody-mobile > div.stadium-accordion-overall > div.row:nth-child(2)').children("div");
        const totalUtilTotalTDMob = $(div).find('div.stadium-accordion-tbody-mobile > div.stadium-accordion-overall > div.row:nth-child(3)').children("div");
        // temporärer Fix, weil Bug im Originalspiel:
        const realTotalLeagueNum = $(div).find("table > tbody > tr.ol-match").length;
        totalUtilLeagueTD.eq(0).text(realTotalLeagueNum);

        if (totalUtilLeagueTD.length){
            totalUtilLeagueTD.css("white-space","nowrap");
            const totalUtilLeague = OLCore.getNum(totalUtilLeagueTD.eq(2).text());
            const tmpIncomeLeague = totalUtilLeagueTD.eq(4).text();
            const totalIncomeLeague = OLCore.getNum(tmpIncomeLeague);
            const totalUtilLeagueNum = OLCore.getNum(totalUtilLeagueTD.eq(0).text());
            const totalUtilLeagueAvg = Math.round(totalUtilLeague/totalUtilLeagueNum);
            const totalIncomeLeagueAvg = Math.round(totalIncomeLeague/totalUtilLeagueNum);
            totalUtilLeagueTD.eq(2).html(`${OLi18n.numberFormat.format(totalUtilLeague)}<span class="TB_stadium_avg">(&Oslash; ${OLi18n.numberFormat.format(totalUtilLeagueAvg)})</span>`);
            totalUtilLeagueTD.eq(4).html(`${tmpIncomeLeague}<span class="TB_stadium_avg">(&Oslash; ${OLCore.num2Cur(totalIncomeLeagueAvg)})</span>`);
            totalUtilLeagueTDMob.eq(2).html(`${OLi18n.numberFormat.format(totalUtilLeague)}<div class="TB_stadium_avg">(&Oslash; ${OLi18n.numberFormat.format(totalUtilLeagueAvg)})</div>`);
            totalUtilLeagueTDMob.eq(4).html(`${tmpIncomeLeague}<div class="TB_stadium_avg">(&Oslash; ${OLCore.num2Cur(totalIncomeLeagueAvg)})</div>`);
        }
        if (totalUtilFriendlyTD.length){
            totalUtilFriendlyTD.css("white-space","nowrap");
            const totalUtilFriendly = OLCore.getNum(totalUtilFriendlyTD.eq(2).text());
            const tmpIncomeFriendly = totalUtilFriendlyTD.eq(4).text();
            const totalIncomeFriendly = OLCore.getNum(tmpIncomeFriendly);
            const totalShareFriendly = OLCore.getNum(tmpIncomeFriendly,1);
            const totalUtilFriendlyNum = OLCore.getNum(totalUtilFriendlyTD.eq(0).text());
            const totalUtilFriendlyAvg = Math.round(totalUtilFriendly/totalUtilFriendlyNum) || 0;
            const totalIncomeFriendlyAvg = Math.round(totalIncomeFriendly/totalUtilFriendlyNum) || 0;
            const totalShareFriendlyAvg = Math.round(totalShareFriendly/totalUtilFriendlyNum) || 0;
            let incomeFriendlyAvg;
            if (newFriendly){
                incomeFriendlyAvg = OLCore.num2Cur(totalIncomeFriendlyAvg);
            } else {
                incomeFriendlyAvg = `${OLCore.num2Cur(totalIncomeFriendlyAvg)}/${OLCore.num2Cur(totalShareFriendlyAvg)}`;
            }
            if (!newFriendly) totalUtilFriendlyTD.eq(2).html(`${OLi18n.numberFormat.format(totalUtilFriendly)}<span class="TB_stadium_avg">(&Oslash; ${OLi18n.numberFormat.format(totalUtilFriendlyAvg)})</span>`);
            totalUtilFriendlyTD.eq(4).html(`${tmpIncomeFriendly}<span class="TB_stadium_avg">(&Oslash; ${incomeFriendlyAvg})</span>`);
            if (!newFriendly) totalUtilFriendlyTDMob.eq(2).html(`${OLi18n.numberFormat.format(totalUtilFriendly)}<div class="TB_stadium_avg">(&Oslash; ${OLi18n.numberFormat.format(totalUtilFriendlyAvg)})</div>`);
            totalUtilFriendlyTDMob.eq(4).html(`${tmpIncomeFriendly}<div class="TB_stadium_avg">(&Oslash; ${incomeFriendlyAvg})</div>`);
        }
        if (totalUtilTotalTD.length){
            totalUtilTotalTD.css("white-space","nowrap");
            const totalUtilTotal = OLCore.getNum(totalUtilTotalTD.eq(2).text());
            const tmpIncomeTotal = totalUtilTotalTD.eq(4).text();
            const totalIncomeTotal = OLCore.getNum(tmpIncomeTotal);
            const totalUtilTotalNum = OLCore.getNum(totalUtilTotalTD.eq(0).text());
            const totalUtilTotalAvg = Math.round(totalUtilTotal/totalUtilTotalNum);
            const totalIncomeTotalAvg = Math.round(totalIncomeTotal/totalUtilTotalNum);
            totalUtilTotalTD.eq(2).html(`${OLi18n.numberFormat.format(totalUtilTotal)}<span class="TB_stadium_avg">(&Oslash; ${OLi18n.numberFormat.format(totalUtilTotalAvg)})</span>`);
            totalUtilTotalTD.eq(4).html(`${tmpIncomeTotal}<span class="TB_stadium_avg">(&Oslash; ${OLCore.num2Cur(totalIncomeTotalAvg)})</span>`);
            totalUtilTotalTDMob.eq(2).html(`${OLi18n.numberFormat.format(totalUtilTotal)}<div class="TB_stadium_avg">(&Oslash; ${OLi18n.numberFormat.format(totalUtilTotalAvg)})</div>`);
            totalUtilTotalTDMob.eq(4).html(`${tmpIncomeTotal}<div class="TB_stadium_avg">(&Oslash; ${OLCore.num2Cur(totalIncomeTotalAvg)})</div>`);
        }
    }
    async function showNextLeagueMatchInfo(){
        $(`<div style="display:inline-block; margin-left:0px" id="nextLeagueMatchInfo" title="${tt("Woche")} - ${tt("Platzierung")}/${tt("Popularität")}" />`).insertBefore("div#nextLeagueMatch div.stadium-next-opponent-pop");
        const piL = OLCore.UI.progressIndicator("#nextLeagueMatchInfo",{clear:true});
        const nextLeagueUser = OLCore.getNum($("div#nextLeagueMatch span.ol-team-name").attr("onclick"));
        const leagueSchedule = await OLCore.XApi.getLeagueSchedule();
        if (OLCore.Base.leagueLevel > 2 && OLCore.Base.week < 40 && OLCore.Base.week > 37) {
            piL.end();
            $("#nextLeagueMatchInfo").text(tt("Sommerpause"));
            return;
        };
        const scheduleMatch = leagueSchedule.find(l => l.opponent.id === nextLeagueUser && l.location === "H");
        const matchWeek = scheduleMatch ? OLCore.matchDay2week(scheduleMatch.matchDay) : "?";

        async function getNextMatchInfo(){
            const cacheNextMatch = OLCore.getMatchdayValue("NextLeagueMatchInfo");
            if (cacheNextMatch){
                return JSON.parse(cacheNextMatch);
            }
            const leagueUserInfo = await OLCore.Api.getTeamInfo(nextLeagueUser);
            const ownUserInfo = await OLCore.Api.getTeamInfo();
            const nmi = {
                A: {rank: OLCore.Base.week > 37 ? 1 : leagueUserInfo.rank, pop: leagueUserInfo.popularity},
                H: {rank: OLCore.Base.week > 37 ? 1 : ownUserInfo.rank, pop: ownUserInfo.popularity}
            };
            OLCore.setMatchdayValue("NextLeagueMatchInfo", JSON.stringify(nmi));
            return nmi;
        }
        const nextMatchInfo = await getNextMatchInfo();
        piL.end();
        $("#nextLeagueMatchInfo").text(`(W${matchWeek} - ${nextMatchInfo.H.rank}./${nextMatchInfo.H.pop.toFixed(1)} vs. ${nextMatchInfo.A.rank}./${nextMatchInfo.A.pop.toFixed(1)})`);
    }

    function initStyle(){
        GM_addStyle(`.TB_stadium_avg{
        padding-left: 5px;
        font-weight: normal;
        display: none;
      }`);
        GM_addStyle(`
      .ol-sm .stadium-accordion h3, .ol-xs .stadium-accordion h3 {
          margin:revert;
      }
      `)
    }

    function addAvgToggle(){

        const avgToggle = OLCore.UI.toggle({
            id: "TB_stadiumAVGToggle",
            name: "&Oslash;",
            initValue: false,
            callback: function(isChecked){
                if (isChecked){
                    $(".TB_stadium_avg").show();
                } else {
                    $(".TB_stadium_avg").hide();
                }
            }
        });

        avgToggle.prependTo(".statistik-accordion-area > div.row > div:nth-child(2)");
        avgToggle.css("display","inline-block");
        avgToggle.css("margin-top","20px");
    }

    function init(){

        function initPriceFunctions(){
            createPriceControls();
            if (OLSettings.get("StadiumUtilization")){
                showNextLeagueMatchInfo();
                try {
                showUtilization();
                } catch (error) {
                    console.error(error);
                }
                
            }
        }

        OLCore.waitForKeyElements(
            "div#standardLoadingDiv.stadium-right-table-main01",
            initPriceFunctions
        );

        OLCore.waitForKeyElements(
            "div.stadium-accordion-main div#stadium-accordion",
            addAvgToggle
        );

        OLCore.waitForKeyElements(
            "div.accordionCnt",
            showAdditionalInfo
        );

        initStyle();

    }

    init();

})();