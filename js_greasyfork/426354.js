/*jshint esversion: 10, multistr: true */
/* globals OLCore, OLSettings, unsafeWindow, OLi18n, GM_setClipboard, GM_addStyle, GM_setValue, GM_getValue */

// ==UserScript==
// @name           OnlineligaOfficeHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.3.0
// @license        LGPLv3
// @description    Helper for office of onlineliga.*
// @author         TobSob / KnutEdelbert
// @match          https://www.onlineliga.de
// @match          https://www.onlineliga.at
// @match          https://www.onlineliga.ch
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_listValues
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_addStyle
// @description Helper function for office of www.onlineliga.de
// @downloadURL https://update.greasyfork.org/scripts/426354/OnlineligaOfficeHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/426354/OnlineligaOfficeHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 12.08.2021 Release
 * 0.1.1 15.10.2021 + Dispo Guessr
 * 0.1.2 27.10.2021 tweak sponsor calculation
 * 0.2.0 24.01.2022 i18n support
 * 0.2.1 25.06.2022 Export Contract Data
 * 0.3.0 23.11.2024 OL 2.0
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    const Sponsor = {};
    const Dispo = {};
    const Contract = {};


    Sponsor.sponsors = {};
    Sponsor.seasonValueMin = Number.MAX_VALUE;
    Sponsor.seasonValueMax = 0;
    Sponsor.seasonValuePromotedMin = Number.MAX_VALUE;
    Sponsor.seasonValuePromotedMax = 0;

    Sponsor.defaultVict = 10;
    Sponsor.defaultPlacem = 10;
    if (!GM_getValue("CalcSponsor_victories")){
        GM_setValue("CalcSponsor_victories",Sponsor.defaultVict);
    }
    if (!GM_getValue("CalcSponsor_placement")){
        GM_setValue("CalcSponsor_placement",Sponsor.defaultPlacem);
    }
    Sponsor.valueVict = GM_getValue("CalcSponsor_victories");
    Sponsor.valuePlacem = GM_getValue("CalcSponsor_placement");


    /* @author: TobSob */
    Sponsor.calculateSponsorsBonuses = function(){

        function getColor(value){
            const hue=((value)*120).toString(10);
            return ["hsla(",hue,",100%,50%,0.4)"].join("");
        }

        Sponsor.seasonValueMin = Number.MAX_VALUE;
        Sponsor.seasonValueMax = 0;
        $('.sponsor-seasonvalue').remove();
        $('div.sponsor-info-details-wrapper').each(function(i, el) {
            const valueDict = {};
            $(el).find('div.sponsor-bonus-value').each(function(i2, sbv) {
                valueDict[$(sbv).next("div.sponsor-bonus-category").html()] = $(sbv).html();
            });
            let seasonValue = 0;
            let seasonValuePromoted = 0;
            for(const key in valueDict){
                let valueString = valueDict[key];
                //valueString = valueString.replace(/ |,|\.|€|CHF/g,"");
                const value = OLCore.getNum(valueString);
                const victories = parseInt(Sponsor.valueVict);
                const placement = parseInt(Sponsor.valuePlacem);
                if(key === t("Antrittsprämie")) {
                    seasonValue += value*34;
                }
                else if(key.includes(t("Siegprämie"))){
                    seasonValue += value*victories;
                }
                else if(key.includes(t("Meisterprämie"))){
                    seasonValue += value*(placement > 1 ? 0 : 1);
                }
                else if(key.includes(t("Platzierungsprämie"))){
                    seasonValue += value*(18-placement);
                }
                else if(key.includes(t("Nicht-Abstiegsprämie"))){
                    seasonValue += value*(placement > 14 ? 0 : 1);
                }
                else if(key.includes(t("Aufstiegsprämie"))){
                    seasonValuePromoted = value;
                }
            }
            seasonValuePromoted += seasonValue;
            let paragraphString = OLCore.num2Cur(seasonValue);
            if(seasonValuePromoted !== seasonValue && !isNaN(seasonValuePromoted)){
                paragraphString += `</span> / <span id="sponsor-seasonvaluepromoted-${i}" style="width: fit-content">${OLCore.num2Cur(seasonValuePromoted)}*`;
            }
            $(el).after(`<div class="sponsor-seasonvalue" style="bottom: 25px; position: relative; left: 5px; width: fit-content">${tt("Prämie-Saison")}: <span id="sponsor-seasonvalue-${i}" style="width: fit-content">${paragraphString}</span>`);
            Sponsor.sponsors[i] = [seasonValue, seasonValuePromoted];
            Sponsor.seasonValueMax = Math.max(Sponsor.seasonValueMax, seasonValue);
            Sponsor.seasonValueMin = Math.min(Sponsor.seasonValueMin, seasonValue);
            Sponsor.seasonValuePromotedMax = Math.max(Sponsor.seasonValuePromotedMax, seasonValuePromoted);
            Sponsor.seasonValuePromotedMin = Math.min(Sponsor.seasonValuePromotedMin, seasonValuePromoted);
            for(const key in Sponsor.sponsors) {
                let value = (Sponsor.sponsors[key][0] - Sponsor.seasonValueMin) / Sponsor.seasonValueMax;
                $("#sponsor-seasonvalue-"+key).css('background-color',getColor(value));
                value = (Sponsor.sponsors[key][1] - Sponsor.seasonValuePromotedMin) / Sponsor.seasonValuePromotedMax;
                $("#sponsor-seasonvaluepromoted-"+key).css('background-color',getColor(value));
            }
        });
    };

    /* @author: TobSob */
    Sponsor.generateSponsorCalcDiv = function() {

        //$("li#filter-base a,li#filter-promotion a,li#filter-champion a,li#filter-remain a,li#filter-placement a,li#filter-win a").bind( "click", function() { OLCore.waitForKeyElements ( "div.sponsor-pool-row", Sponsor.calculateSponsorsBonuses,);});
        const cl = OLCore.Base.teamColorNumber;
        $('#ol-root').append(`
        <div style="background-color: transparent;" class="sponsor-calc-div">
        <i id="calc-icon" class="fa fa-calculator fa-3x ol-state-primary-text-color-${cl}" style="margin: 5px;cursor: pointer;"></i>
        </div>`);

        function setValueAndCalc(evt){
            const inp = evt.currentTarget;
            const val = inp.value;
            if (inp.id === "calcsponsor_victories"){
                GM_setValue('CalcSponsor_victories',val);
                Sponsor.valueVict = val;
            } else if (inp.id === "calcsponsor_placement"){
                GM_setValue('CalcSponsor_placement',val);
                Sponsor.valuePlacem = val;
            }
            Sponsor.calculateSponsorsBonuses();
        }

        $('#calc-icon').click(function() {
            if ($("#calc-div").length){
                return;
            }
            OLCore.UI.popup(`<div id="calc-div">
        <span class="sponsor-calc-input ol-state-primary-text-color-${cl}">${tt("Siege")}</span> \n<input class="sponsor-calc-input ol-state-primary-text-color-${cl}" placeholder="${tt("Siege")}" type="number" max="34" min="0" id="calcsponsor_victories" value="`+Sponsor.valueVict+`"/></br>
        <span class="sponsor-calc-input ol-state-primary-text-color-${cl}9">${tt("Platzierung")}</span> \n<input class="sponsor-calc-input ol-state-primary-text-color-${cl}" placeholder="${tt("Platzierung")}" type="number" max="18" min="1" id="calcsponsor_placement" value="`+Sponsor.valuePlacem+`"/></br>
        <input class="sponsor-calc-input bid-button ol-state-primary-color-${cl}" id="calcSponsorBtn" type="button"  value="${tt("Prämien Kalkulieren")}"/></br>
        <span class="sponsor-calc-input ol-state-primary-text-color-${cl}">* ${tt("mit Aufstiegsprämie")}</span> </div>`, {title: tt("Sponsoren-Rechner"), align:'right'});
            $("div#calc-div input[type=number]").on("input", setValueAndCalc);
            $("div#calc-div input#calcSponsorBtn").on("click", Sponsor.calculateSponsorsBonuses);
            Sponsor.calculateSponsorsBonuses();
        });
        function liveCalc(){
            if ($("div#calc-div").length){
                Sponsor.calculateSponsorsBonuses()
            }
        }
        OLCore.waitForKeyElements (
            "div.sponsor-pool-row",
            liveCalc
        );
    }

    Dispo.dispoActive = false;
    Dispo.dispoWeek = 43;
    Dispo.knutsTipp = 0;

    Dispo.copyDispoData = async function(){

        const waitDialog = $(`<div id="dispoExportWait" class="dispoExportPopup">${tt("Lade Daten")}<div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>`)
        .appendTo("body");

        const teamName = "Anonym"; //OLCore.Base.teamName;

        let transfer;
        let sponsor;
        let stadion;
        let league;
        let ticket;
        let trainingArea;
        let NLZ;
        let misc;

        const preSeason = {};
        const dispoWeekData = {};
        let stadionLeague = 0;
        let stadionFriendly = 0;
        let friendlyShare = 0;
        let squadValue = 0;
        let stadionValue = 0;
        let NLZValue = 0;
        let balance = 0;
        const tipp = parseInt($("span#KnutsTipp").attr("data-value"), 10);

        const output = [
            teamName,
            OLCore.Base.leagueLevel,
            OLCore.Base.week,
            Dispo.dispoWeek > OLCore.Base.week ? "-" : Dispo.dispoWeek
        ];

        $("div.income").children("div.row.finance-row").each(function(i, el){
            const label = $(el).children("div").eq(0).text().trim().replace(/\u{00ad}/ug,"");
            let value = OLCore.getNum($(el).children("div").eq(2).text().trim());
            switch(label){
                case t("Transfererlöse"):
                    transfer = value;
                    break;
                case t("Hauptsponsor"):
                    sponsor = value;
                    break;
                case t("Stadionvermarktung"):
                    stadion = value;
                    break;
                case t("Stadion - Einnahmen aus Ticketverkäufen"):
                    ticket = value;
                    break;
                case t("Veräußerung Trainingsgelände"):
                    trainingArea = value;
                    break;
                case t("Veräußerung Leistungszentrum"):
                    NLZ = value;
                    break;
                case t("Sonstiges"):
                    misc = value;
                    break;
            }
            if (label.startsWith("Ligavermarktung")){
                league = value;
            }
        });

        const expenses = {};

        $("div.expenses").children("div.row.finance-row").each(function(i, el){
            const label = $(el).children("div").eq(0).text().trim().replace(/\u{00ad}/ug,"");
            let value = OLCore.getNum($(el).children("div").eq(2).text().trim());
            switch(label){
                case t("Spielergehälter"):
                    expenses.salary = value;
                    break;
                case t("Abfindung/ Vertragsauflösung"):
                    expenses.payoff = value;
                    break;
                case t("Trainer / Assistenten / Trainingsplätze"):
                    expenses.stuff = value;
                    break;
                case t("Nachwuchszentrum"):
                    expenses.NLZ = value;
                    break;
                case t("Transferausgaben"):
                    expenses.transfer = value;
                    break;
                case t("Stadion Beleihung"):
                    expenses.stadiumMortgaging = value;
                    break;
                case t("Sponsor Vorfälligkeitsentschädigungen"):
                    expenses.prePaymentPenalty = value;
                    break;
                case t("Sonstiges"):
                    expenses.misc = value;
                    break;
                case t("Stadion Leihkosten temporäre Tribünen"):
                    expenses.tribuneLoan = value;
                    break;
            }
            if (label.startsWith(t("Stadion")) && label.includes(t("(Baukosten, Betriebskosten)"))){
                expenses.stadiumOperatingCosts = value;
            }
        });

        if (OLCore.Base.week < Dispo.dispoWeek){
            const sponsorData = await OLCore.get("/sponsor/select");
            let estimatedSponsor = 0;
            if (sponsorData){
                const values = $(sponsorData).find("div.mainsponsor-info-row div.sponsor-bonus-value");
                const multis = $(sponsorData).find("div.mainsponsor-info-row div.sponsor-bonus-block-info");
                estimatedSponsor += (OLCore.getNum(multis.eq(0).text()) * OLCore.getNum(values.eq(0).text()));
                estimatedSponsor += (OLCore.getNum(multis.eq(1).text()) * OLCore.getNum(values.eq(1).text()));
                if (multis.eq(2).find("i.icon-check_mark_green").length){
                    estimatedSponsor += OLCore.getNum(values.eq(2).text());
                }
                estimatedSponsor += OLCore.getNum(values.eq(3).text());
                if (multis.eq(4).find("i.icon-check_mark_green").length){
                    estimatedSponsor += OLCore.getNum(values.eq(4).text());
                }
                if (multis.eq(5).find("i.icon-check_mark_green").length){
                    estimatedSponsor += OLCore.getNum(values.eq(5).text());
                }
            }
            sponsor = sponsor < estimatedSponsor ? estimatedSponsor : sponsor;
        }

        output.push(transfer);
        output.push(sponsor);
        output.push(stadion);
        output.push(league);
        output.push(ticket);
        output.push(trainingArea);
        output.push(NLZ);
        output.push(misc);

        if (OLCore.Base.season > 1){
            const lastAccountData = await OLCore.get(`/office/statusAccount?season=${OLCore.Base.season-1}`);
            if (lastAccountData){
                $(lastAccountData).find("div.row.finance-row:not(.negative-value)").each(function(i,el){
                    const week = OLCore.getNum($(el).find("span.ol-account-overview-week-desc").text());
                    if (week > Dispo.dispoWeek-1 || week === Dispo.dispoWeek){
                        const amount = OLCore.getNum($(el).children("div").eq(3).text());
                        if (amount > 0){
                            const note = $(el).children("div").eq(2).text().trim();
                            if (note.startsWith(t("Stadioneinnahmen: Auswärtsspiel (Friendly)"))){
                                preSeason.friendlyAway = preSeason.friendlyAway || 0;
                                preSeason.friendlyAway += amount;
                            } else if (note.startsWith(t("Stadioneinnahmen: Heimspiel (Friendly)"))){
                                preSeason.friendlyHome = preSeason.friendlyHome || 0;
                                preSeason.friendlyHome += amount;
                            } else if (note.startsWith(t("Ablösesumme Spielertransfer:"))){
                                preSeason.transfer = preSeason.transfer || 0;
                                preSeason.transfer += amount;
                            } else if (week === Dispo.dispoWeek) {
                                preSeason.misc = preSeason.misc || 0;
                                preSeason.misc += amount;
                            }
                        }
                    }
                });
            }
        }
        output.push(preSeason.transfer || 0);
        output.push(preSeason.friendlyHome || 0);
        output.push(preSeason.friendlyAway || 0);
        output.push(preSeason.misc || 0);

        const accountData = await OLCore.get(`/office/statusAccount?season=${OLCore.Base.season}`);
        if (accountData){
            $(accountData).find("div.row.finance-row:not(.negative-value)").each(function(i,el){
                const week = OLCore.getNum($(el).find("span.ol-account-overview-week-desc").text());
                if (week === Dispo.dispoWeek){
                    const amount = OLCore.getNum($(el).children("div").eq(3).text());
                    if (amount > 0){
                        const note = $(el).children("div").eq(2).text().trim();
                        if (note.startsWith(t("Stadioneinnahmen: Auswärtsspiel (Friendly)"))){
                            dispoWeekData.friendlyAway = dispoWeekData.friendlyAway || 0;
                            dispoWeekData.friendlyAway += amount;
                        } else if (note.startsWith(t("Stadioneinnahmen: Heimspiel (Friendly)"))){
                            dispoWeekData.friendlyHome = dispoWeekData.friendlyHome || 0;
                            dispoWeekData.friendlyHome += amount;
                        } else if (note.startsWith(t("Ablösesumme Spielertransfer:"))){
                            dispoWeekData.transfer = dispoWeekData.transfer || 0;
                            dispoWeekData.transfer += amount;
                        }
                    }
                }
            });
        }
        output.push(dispoWeekData.transfer || 0);
        output.push(dispoWeekData.friendlyHome || 0);
        output.push(dispoWeekData.friendlyAway || 0);

        const utilisationHistoryData = await OLCore.get("/utilisationHistory");
        if (utilisationHistoryData){
            const utilisationHistory = $(JSON.parse(utilisationHistoryData).html);
            const leagueEntranceFeeSpan = utilisationHistory.find("td:nth-child(5) > span.ol-league-only").eq(0);
            if (leagueEntranceFeeSpan){
                stadionLeague = OLCore.getNum(leagueEntranceFeeSpan.text());
            }
            const friendlyRevenue = utilisationHistory.find('tr > td:nth-child(2):contains("FRIENDLY")').parent().children("td").eq(4).text();
            if (friendlyRevenue){
                stadionFriendly = OLCore.getNum(friendlyRevenue);
            }
            utilisationHistory.find("tr.ol-friendly").each(function(i,el){
                const share = OLCore.getNum($(el).children("td").eq(4).text(),1);
                if (share > 0) {
                    friendlyShare += share;
                }
            });
        }
        output.push(stadionLeague);
        output.push(stadionFriendly);
        output.push(friendlyShare);

        const squadData = await OLCore.Api.getSquad();
        if (squadData){
            squadValue = squadData.teamVal;
        }

        const NLZData = await OLCore.Api.NLZ.getAcademy();
        if (NLZData){
            NLZValue = NLZData.acadamy.overallValue;
        }

        const stadiumData = await OLCore.get("/mystadium");
        if (stadiumData){
            stadionValue = OLCore.getNum($(stadiumData).find('.ol-stadium-bandarole-text:contains("Baukosten")').prev().text());
        }

        balance = OLCore.getNum($('.finance-overview-font:contains("Kontostand")').prev().text());
        const act_dispo = OLCore.getNum($('.finance-overview-font:contains("Dispo-Rahmen")').next().text());


        output.push(squadValue);
        output.push(stadionValue);
        output.push(NLZValue);
        output.push(balance);
        output.push(expenses.salary);
        output.push(expenses.payoff);
        output.push(expenses.stuff);
        output.push(expenses.NLZ);
        output.push(expenses.stadiumOperatingCosts);
        output.push(expenses.transfer);
        output.push(expenses.stadiumMortgaging);
        output.push(expenses.prePaymentPenalty);
        output.push(expenses.misc);
        output.push(expenses.tribuneLoan);

        output.push(Dispo.knutsTipp);
        output.push(act_dispo);

        GM_setClipboard(output.map(o => o?o.toString().replace(".",","):"0").join("\t"));

        if (waitDialog){
            waitDialog.remove();
        }

        const confirmDialog = $(`<div id="dispoExportPopup" class="dispoExportPopup">${tt("Daten in die Zwischenablage kopiert")}</div>`).appendTo("body");

        window.setTimeout(function(){
            confirmDialog.remove();
        }, 1000);

    }

    Dispo.showEstimatedDispo = async function(check){
        if (!check){
            return;
        }

        GM_addStyle(".dispoExportPopup {position:absolute; left:50%; margin-left: -150px; top: 600px; z-index: 1000 !important ;width:300px; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");
        GM_addStyle(" \ .lds-spinner { \   color: official; \   display: inline-block; \   position: relative; \   width: 80px; \   height: 80px; \   vertical-align: middle; \   text-align:center;  \ } \ .lds-spinner div { \   transform-origin: 40px 40px; \   animation: lds-spinner 1.2s linear infinite; \ } \ .lds-spinner div:after { \   content: \" \"; \   display: block; \   position: absolute; \   top: 3px; \   left: 37px; \   width: 6px; \   height: 18px; \   border-radius: 20%; \   background: #fff; \ } \ .lds-spinner div:nth-child(1) { \   transform: rotate(0deg); \   animation-delay: -1.1s; \ } \ .lds-spinner div:nth-child(2) { \   transform: rotate(30deg); \   animation-delay: -1s; \ } \ .lds-spinner div:nth-child(3) { \   transform: rotate(60deg); \   animation-delay: -0.9s; \ } \ .lds-spinner div:nth-child(4) { \   transform: rotate(90deg); \   animation-delay: -0.8s; \ } \ .lds-spinner div:nth-child(5) { \   transform: rotate(120deg); \   animation-delay: -0.7s; \ } \ .lds-spinner div:nth-child(6) { \   transform: rotate(150deg); \   animation-delay: -0.6s; \ } \ .lds-spinner div:nth-child(7) { \   transform: rotate(180deg); \   animation-delay: -0.5s; \ } \ .lds-spinner div:nth-child(8) { \   transform: rotate(210deg); \   animation-delay: -0.4s; \ } \ .lds-spinner div:nth-child(9) { \   transform: rotate(240deg); \   animation-delay: -0.3s; \ } \ .lds-spinner div:nth-child(10) { \   transform: rotate(270deg); \   animation-delay: -0.2s; \ } \ .lds-spinner div:nth-child(11) { \   transform: rotate(300deg); \   animation-delay: -0.1s; \ } \ .lds-spinner div:nth-child(12) { \   transform: rotate(330deg); \   animation-delay: 0s; \ } \ @keyframes lds-spinner { \   0% { \     opacity: 1; \   } \   100% { \     opacity: 0; \   } \ }");

        const pi = OLCore.UI.progressIndicator($("div.income").children("div.row").eq(1).children("div").eq(1).children("div").eq(0),{clear:true});

        const noteData = await OLCore.get("/office/financeNotification");

        if (noteData){
            $(noteData).filter("div.finance-bank-notification-row").each(function(i,el){
                if ($(el).find(`div.finance-bank-notification-font:contains('${t("Überziehungslimit")}')`).length){
                    const wk = OLCore.getNum($(el).find(".ol-timestamp-string").text(), -1);
                    if (wk && OLCore.Base.season === wk[0] && OLCore.Base.week >= wk[1]){
                        Dispo.dispoWeek = wk[1]+1;
                        Dispo.dispoActive = true;
                    }
                }
            });
        }

        let leagueEntranceFee = 0;
        let friendlyEntranceFee = 0;
        const uh = await OLCore.get("/utilisationHistory");
        if (uh){
            const uhh = $(JSON.parse(uh).html);
            const leagueEntranceFeeSpan = uhh.find("td:nth-child(5) > span.ol-league-only").eq(0);
            if (leagueEntranceFeeSpan){
                leagueEntranceFee = OLCore.getNum(leagueEntranceFeeSpan.text());
            }
            const friendlyRevenue = uhh.find(`tr > td:nth-child(2):contains("FRIENDLY")`).parent().children("td").eq(4).text();
            if (friendlyRevenue){
                friendlyEntranceFee = OLCore.getNum(friendlyRevenue);
            }
        }
        let sponsorValue = 0;
        if (!Dispo.dispoActive){
            const sponsorData = await OLCore.get("/sponsor/select");
            if (sponsorData){
                const values = $(sponsorData).find("div.mainsponsor-info-row div.sponsor-bonus-value");
                const multis = $(sponsorData).find("div.mainsponsor-info-row div.sponsor-bonus-block-info");
                if (values.length > 0 && multis.length > 0){
                    sponsorValue += (OLCore.getNum(multis.eq(0).text()) * OLCore.getNum(values.eq(0).text()));
                    sponsorValue += (OLCore.getNum(multis.eq(1).text()) * OLCore.getNum(values.eq(1).text()));
                    if (multis.eq(2).find("i.icon-check_mark_green").length){
                        sponsorValue += OLCore.getNum(values.eq(2).text());
                    }
                    sponsorValue += OLCore.getNum(values.eq(3).text());
                    if (multis.eq(4).find("i.icon-check_mark_green").length){
                        sponsorValue += OLCore.getNum(values.eq(4).text());
                    }
                    if (multis.eq(5).find("i.icon-check_mark_green").length){
                        sponsorValue += OLCore.getNum(values.eq(5).text());
                    }
                }
            }
        }
        sponsorValue = sponsorValue || 0;
        let dispo = 0.0;
        $("div.income").children("div.row.finance-row").each(function(i, el){
            const label = $(el).children("div").eq(0).text().trim();
            const value = OLCore.getNum($(el).children("div").eq(2).text());
            if (value){
                if (label === t("Transfererlöse")){
                    dispo += value/4;
                } else if (label === t("Stadion - Einnahmen aus Ticketverkäufen")) {
                    leagueEntranceFee = leagueEntranceFee === 0 ? value : leagueEntranceFee;
                    dispo += (value - leagueEntranceFee) / 4;
                    dispo += leagueEntranceFee/2;
                } else if (label !== t("Einnahmen Gesamt") && label !== t("Hauptsponsor")) {
                    dispo += value/2;
                } else if (label === t("Hauptsponsor") && !sponsorValue){
                    sponsorValue = value;
                }
            }
        });
        dispo = (dispo/OLCore.Base.week) * 44;
        dispo += (sponsorValue/2);
        dispo = Math.round(dispo);
        Dispo.knutsTipp = dispo;
        pi.end();
        $("div.income").children("div.row").eq(1).children("div").eq(1).children("div").eq(0).append(`
        <span style="font-size:10pt;">${tt("Knuts Dispo-Tipp am <u>Ende</u> der Saison")}:<br /><span id="KnutsTipp" data-value="${dispo}">${OLCore.num2Cur(dispo)}</span> (${tt("Ohne Gewähr")}) -&gt; <span title="${tt("Dispo-Daten in die Zwischenablage kopieren")}" id="copyDispoData" style="cursor:pointer" class="fa fa-clipboard"></span></span>
        `);
        $("span#copyDispoData").on("click", Dispo.copyDispoData);
    };

    Contract.copyDataButton = function(){
        const copyBtn = OLCore.UI.button({
            copy: true,
            title: tt('Vertragsdaten kopieren&#010;Shift halten für Überschriften'),
            style: "position:absolute;right:0;bottom:0;"
        });
        copyBtn.appendTo("div.ol-page-content");
        copyBtn.on("click", function(evt){const withHeadLines = evt.shiftKey;
            const output = [];
            $("div#contractSquad > div.ol-squad-category > section.squad-player-category-section > div.squad-player-wrapper.player-contracts-row.row").each(function(i,row){
                const dataDivs = $(row).find("div.squad-player-stat-data-matchdata > div:not(.visible-xs)");

                if (i === 0 && withHeadLines){
                const headLines = [];
                    headLines.push("Name");
                headLines.push(tt("Spieler-ID"));
                    headLines.push(dataDivs.eq(1).children("div").eq(0).text());
                    headLines.push(dataDivs.eq(0).children("div").eq(0).text());
                    headLines.push(dataDivs.eq(2).children("div").eq(0).text());
                    headLines.push(dataDivs.eq(3).children("div").eq(0).text());
                    //headLines.push(headLineRow.find(".contract-contract.hidden-xs").text());
                    headLines.push(dataDivs.eq(4).children("div").eq(0).text());
                    headLines.push(dataDivs.eq(5).children("div").eq(0).text());
                output.push(headLines.join("\t"));
    }
                const nameSpan = $(row).find("div.squad-player-stat-data > div:first-child > span:first-child");
                const name = nameSpan.children("span").eq(0).text();
                const id = OLCore.getNum(nameSpan.attr("onclick"));
                const age = dataDivs.eq(1).children("div").eq(1).text();
                const pos = dataDivs.eq(0).children("div").eq(1).text();
                const marketvalue = dataDivs.eq(2).children("div").eq(1).text();
                const salary = dataDivs.eq(3).children("div").eq(1).text();
                //const contract = $(row).find(".contract-contract").contents().eq(0).text() + $(row).find(".contract-contract").contents().eq(1).text();
                const start = dataDivs.eq(4).children("div").eq(1).text();
                const end = dataDivs.eq(5).children("div").eq(1).text();
                const line = [name, id, age, pos, marketvalue, salary, /*contract,*/ start, end];
                output.push(line.join("\t"));
            });
            GM_setClipboard(output.join("\r\n"));
            OLCore.info(tt("Spielerdaten in die Zwischenablage kopiert"));
        });
    };

    function init(){
        function wfke_generateSponsorCalcDiv(){
            Sponsor.generateSponsorCalcDiv();
        }
        OLCore.waitForKeyElements (
            "div#sponsorContainer",
            wfke_generateSponsorCalcDiv
        );
        function wfke_showEstimatedDispo(){
            Dispo.showEstimatedDispo(true);
        }
        if (OLSettings.get("DispoTipp")){
            OLCore.waitForKeyElements (
                "div#financeContent div.income",
                wfke_showEstimatedDispo
            );
        }
        function wfke_contractCopyData(){
            Contract.copyDataButton();
        }
        OLCore.waitForKeyElements (
            "div#contractSquad",
            wfke_contractCopyData
        );
        GM_addStyle('* .sponsor-calc-div { position: fixed; bottom:50%;right: 20px; text-decoration: none; color: #000000;background-color: rgba(235, 235, 235, 0.80);font-size: 12px;padding: 1em;} .sponsor-calc-input { width:100%; margin: 5px }');
        GM_addStyle(`div#calc-div input[type=number] {
        -moz-appearance: auto;
         width: 45px;
         height: 24px;
         vertical-align: middle;
         border-radius: 5px;
         border: solid 1px black;
         text-align: center;
         font-family: Roboto Condensed,sans-serif;
         font-size: 11pt;
         font-weight: bold;
        }
        div#calc-div {
          padding: 10px 20px 10px 10px;
        }
        `);
    }

    init();

})();
