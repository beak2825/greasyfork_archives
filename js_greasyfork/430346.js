/*jshint esversion: 8, multistr: true */
/* globals OLCore */

// ==UserScript==
// @name           DispoGuessr
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.2.5
// @license        LGPLv3
// @description    guess the dispo
// @author         KnutEdelbert
// @match          https://www.onlineliga.de
// @match          https://www.onlineliga.at
// @match          https://www.onlineliga.ch
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @grant          GM_addStyle
// @grant          GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/430346/DispoGuessr.user.js
// @updateURL https://update.greasyfork.org/scripts/430346/DispoGuessr.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 12.05.2021 Release
 * 0.1.1 13.05.2021 add simple extrapolation
 * 0.2.0 04.08.2021 Export Data for Google Sheets
 * 0.2.2 05.08.2021 Bugfix
 * 0.2.3 06.08.2021 Support for at/ch
 * 0.2.4 10.08.2021 Bugfix Sponsorvalue
 * 0.2.5 12.08.2021 Bugfix Sponsorvalue
 *********************************************/
(function() {
    'use strict';
    const $ = unsafeWindow.jQuery;
    let dispoActive = false;
    let dispoWeek = 43;

    let knutsTipp = 0;

    async function copyDispoData(){

        const waitDialog = $('<div id="dispoExportWait" class="dispoExportPopup">Lade Daten<div width="100%"><div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div></div></div>')
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
            dispoWeek > OLCore.Base.week ? "-" : dispoWeek
        ];

        $("div.income").children("div.row.finance-row").each(function(i, el){
            const label = $(el).children("div").eq(0).text().trim().replace(/\u{00ad}/ug,"");
            let value = OLCore.getNum($(el).children("div").eq(2).text().trim());
            switch(label){
                case "Transfererlöse":
                    transfer = value;
                    break;
                case "Hauptsponsor":
                    sponsor = value;
                    break;
                case "Stadionvermarktung":
                    stadion = value;
                    break;
                case "Stadion - Einnahmen aus Ticketverkäufen":
                    ticket = value;
                    break;
                case "Veräußerung Trainingsgelände":
                    trainingArea = value;
                    break;
                case "Veräußerung Leistungszentrum":
                    NLZ = value;
                    break;
                case "Sonstiges":
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
                case "Spielergehälter":
                    expenses.salary = value;
                    break;
                case "Abfindung/ Vertragsauflösung":
                    expenses.payoff = value;
                    break;
                case "Trainer / Assistenten / Trainingsplätze":
                    expenses.stuff = value;
                    break;
                case "Nachwuchszentrum":
                    expenses.NLZ = value;
                    break;
                case "Transferausgaben":
                    expenses.transfer = value;
                    break;
                case "Stadion Beleihung":
                    expenses.stadiumMortgaging = value;
                    break;
                case "Sponsor Vorfälligkeitsentschädigungen":
                    expenses.prePaymentPenalty = value;
                    break;
                case "Sonstiges":
                    expenses.misc = value;
                    break;
                case "Stadion Leihkosten temporäre Tribünen":
                    expenses.tribuneLoan = value;
                    break;
            }
            if (label.startsWith("Stadion") && label.includes("(Baukosten, Betriebskosten)")){
                expenses.stadiumOperatingCosts = value;
            }
        });

        if (OLCore.Base.week < dispoWeek){
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
                    if (week > dispoWeek-1 || week === dispoWeek){
                        const amount = OLCore.getNum($(el).children("div").eq(3).text());
                        if (amount > 0){
                            const note = $(el).children("div").eq(2).text().trim();
                            if (note.startsWith("Stadioneinnahmen: Auswärtsspiel (Friendly)")){
                                preSeason.friendlyAway = preSeason.friendlyAway || 0;
                                preSeason.friendlyAway += amount;
                            } else if (note.startsWith("Stadioneinnahmen: Heimspiel (Friendly)")){
                                preSeason.friendlyHome = preSeason.friendlyHome || 0;
                                preSeason.friendlyHome += amount;
                            } else if (note.startsWith("Ablösesumme Spielertransfer:")){
                                preSeason.transfer = preSeason.transfer || 0;
                                preSeason.transfer += amount;
                            } else if (week === dispoWeek) {
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
                if (week === dispoWeek){
                    const amount = OLCore.getNum($(el).children("div").eq(3).text());
                    if (amount > 0){
                        const note = $(el).children("div").eq(2).text().trim();
                        if (note.startsWith("Stadioneinnahmen: Auswärtsspiel (Friendly)")){
                            dispoWeekData.friendlyAway = dispoWeekData.friendlyAway || 0;
                            dispoWeekData.friendlyAway += amount;
                        } else if (note.startsWith("Stadioneinnahmen: Heimspiel (Friendly)")){
                            dispoWeekData.friendlyHome = dispoWeekData.friendlyHome || 0;
                            dispoWeekData.friendlyHome += amount;
                        } else if (note.startsWith("Ablösesumme Spielertransfer:")){
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

        output.push(knutsTipp);
        output.push(act_dispo);

        GM_setClipboard(output.map(o => o?o.toString().replace(".",","):"0").join("\t"));

        if (waitDialog){
            waitDialog.remove();
        }


        const confirmDialog = $('<div id="dispoExportPopup" class="dispoExportPopup">Daten in die Zwischenablage kopiert</div>').appendTo("body");

        window.setTimeout(function(){
            confirmDialog.remove();
        }, 1000);

    }

    async function showEstimatedDispo(check){
        if (!check){
            return;
        }

        GM_addStyle(".dispoExportPopup {position:absolute; left:50%; margin-left: -150px; top: 600px; z-index: 1000 !important ;width:300px; height: auto; opacity: 0.9; font-weight: bold; font-size: 20pt; color: white; background-color:grey; border: 1px solid grey; border-radius: 20px; vertical-align: middle; text-align:center; padding:20px;}");
        GM_addStyle(" \ .lds-spinner { \   color: official; \   display: inline-block; \   position: relative; \   width: 80px; \   height: 80px; \   vertical-align: middle; \   text-align:center;  \ } \ .lds-spinner div { \   transform-origin: 40px 40px; \   animation: lds-spinner 1.2s linear infinite; \ } \ .lds-spinner div:after { \   content: \" \"; \   display: block; \   position: absolute; \   top: 3px; \   left: 37px; \   width: 6px; \   height: 18px; \   border-radius: 20%; \   background: #fff; \ } \ .lds-spinner div:nth-child(1) { \   transform: rotate(0deg); \   animation-delay: -1.1s; \ } \ .lds-spinner div:nth-child(2) { \   transform: rotate(30deg); \   animation-delay: -1s; \ } \ .lds-spinner div:nth-child(3) { \   transform: rotate(60deg); \   animation-delay: -0.9s; \ } \ .lds-spinner div:nth-child(4) { \   transform: rotate(90deg); \   animation-delay: -0.8s; \ } \ .lds-spinner div:nth-child(5) { \   transform: rotate(120deg); \   animation-delay: -0.7s; \ } \ .lds-spinner div:nth-child(6) { \   transform: rotate(150deg); \   animation-delay: -0.6s; \ } \ .lds-spinner div:nth-child(7) { \   transform: rotate(180deg); \   animation-delay: -0.5s; \ } \ .lds-spinner div:nth-child(8) { \   transform: rotate(210deg); \   animation-delay: -0.4s; \ } \ .lds-spinner div:nth-child(9) { \   transform: rotate(240deg); \   animation-delay: -0.3s; \ } \ .lds-spinner div:nth-child(10) { \   transform: rotate(270deg); \   animation-delay: -0.2s; \ } \ .lds-spinner div:nth-child(11) { \   transform: rotate(300deg); \   animation-delay: -0.1s; \ } \ .lds-spinner div:nth-child(12) { \   transform: rotate(330deg); \   animation-delay: 0s; \ } \ @keyframes lds-spinner { \   0% { \     opacity: 1; \   } \   100% { \     opacity: 0; \   } \ }");

        const noteData = await OLCore.get("/office/financeNotification");

        if (noteData){
            $(noteData).filter("div.finance-bank-notification-row").each(function(i,el){
               if ($(el).find("div.finance-bank-notification-font:contains('Kreditrahmen')").length){
                   const wk = OLCore.getNum($(el).find(".ol-timestamp-string").text(), -1);
                   if (wk && OLCore.Base.season === wk[0] && OLCore.Base.week >= wk[1]){
                       dispoWeek = wk[1]+1;
                       dispoActive = true;
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
        if (!dispoActive){
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
                if (label === "Transfererlöse"){
                    dispo += value/4;
                } else if (label === "Stadion - Einnahmen aus Ticketverkäufen") {
                    leagueEntranceFee = leagueEntranceFee === 0 ? value : leagueEntranceFee;
                    dispo += (value - leagueEntranceFee) / 4;
                    dispo += leagueEntranceFee/2;
                } else if (label !== "Einnahmen Gesamt" && label !== "Hauptsponsor") {
                    dispo += value/2;
                } else if (label === "Hauptsponsor" && !sponsorValue){
                    sponsorValue = value;
                }
            }
        });
        dispo = (dispo/OLCore.Base.week) * 44;
        dispo += (sponsorValue/2);
        dispo = Math.round(dispo);
        knutsTipp = dispo;
        $("div.income").children("div.row").eq(1).children("div").eq(1).children("div").eq(0).append(`
        <span style="font-size:10pt;">Knuts Dispo-Tipp am <u>Ende</u> der Saison:<br /><span id="KnutsTipp" data-value="${dispo}">${OLCore.num2Cur(dispo)}</span> (Ohne Gewähr) -&gt; <span id="copyDispoData" style="cursor:pointer" class="fa fa-clipboard"></span></span>
        `);
        $("span#copyDispoData").on("click", copyDispoData);
    }

    OLCore.waitForKeyElements (
        "div#financeContent div.income",
        function() { showEstimatedDispo(true); }
    );

})();