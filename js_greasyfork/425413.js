/* jshint esversion: 10, multistr: true */
/* globals OLCore,OLSettings, unsafeWindow */

// ==UserScript==
// @name           OnlineligaTrainingHelper
// @namespace      https://greasyfork.org/de/users/577453
// @version        0.4.1
// @license        LGPLv3
// @description    Helfer für das Training bei www.onlineliga.de (OFA)
// @author         Boonlight / KnutEdelbert
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/424896-olcore/code/OLCore.user.js
// @downloadURL https://update.greasyfork.org/scripts/425413/OnlineligaTrainingHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/425413/OnlineligaTrainingHelper.meta.js
// ==/UserScript==

/*********************************************
 * 0.1.0 22.04.2021 Release
 * 0.1.1 25.10.2021 + extend filter for training groups
 * 0.1.2 09.12.2021 + show number of participants on training groups
 * 0.1.3 09.01.2022 bugfix participants
 * 0.2.0 24.01.2022 + Boonlight trainingshelfer
                    i18n Support
 * 0.3.0 25.06.2022 + optional: sort players by surname in training groups
 * 0.3.1 02.11.2022 new intense calculation (hiT by Rot)
                    fix: mobile view for intense numbers
 * 0.3.2 03.11.2022 Hotfix intense view
 * 0.4.0 20.11.2024 OL 2.0
 * 0.4.1 28.12.2024 OL 2.0 Fix: Sort Player by surname 
 *********************************************/
(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;
    const api = OLCore.Api;
    const t = OLi18n.text;
    const tt = OLi18n.tbtext;

    const fitnessThreshold = parseInt(OLSettings.get("TrainingGroupFitnessFilter") || "95", 10);

    function groupInfo(){

        let numActiveGroupPlayers = -1;

        const trainingData = $("div#training-timetable-week_plan");

        const matchColumn = trainingData.find('div.ol-training-day[data-day = "saturday0"]').find('div.ol-training-day-column[data-day = "saturday0"]:first-child > div.ol-training-weektable-matchblock[data-matchid]');

        const playerApps = {};

        const matchUsages = matchColumn.find('div.ol-training-weektable-matchblock-usages-row.ol-training-weektable-matchblock-usages-row-other');
        matchUsages.each(function(i,el){
            const spanClick = $(el).find('span.player-quick-overview-launcher').attr("onclick");
            const matchPlayerIdMatch = spanClick.match(/{'?playerId'?:\s*(\d+)\s*}/);
            const minutes = parseInt($(el).children(".ol-training-weektable-matchblock-usages-cell-minutes").text(),10) || 0;
            if (matchPlayerIdMatch){
                const playerId = parseInt(matchPlayerIdMatch[1],10);
                if (!playerApps[playerId]){
                    playerApps[playerId] = [0,0,0];
                }
                playerApps[playerId][0] += minutes;
            }
        });

        const friendlyColumn = trainingData.find('div.ol-training-day[data-day = "friendly"]').find('div.ol-training-day-column[data-day = "friendly"]:first-child > div.ol-training-weektable-matchblock[data-matchState]');
        const friendlyUsages = friendlyColumn.find('div.ol-training-weektable-matchblock-usages-row.ol-training-weektable-matchblock-usages-row-other');
        friendlyUsages.each(function(i,el){
            const spanClick = $(el).find('span.player-quick-overview-launcher').attr("onclick");
            const friendlyPlayerIdMatch = spanClick.match(/{'?playerId'?:\s*(\d+)\s*}/);
            const minutes = parseInt($(el).children(".ol-training-weektable-matchblock-usages-cell-minutes").text(),10) || 0 ;
            if (friendlyPlayerIdMatch){
                const playerId = parseInt(friendlyPlayerIdMatch[1],10);
                if (!playerApps[playerId]){
                    playerApps[playerId] = [0,0,0];
                }
                playerApps[playerId][1] += minutes;
            }
        });

        $("div#allGroupRows").find("div.row.group-row").each(function(i,row){
            const data = {attributes: {}};
            let attr;
            const playerId = $(row).attr("data-playerid");
            const tw = (parseInt($(row).attr("data-position")) & 256) === 256;
            const fitnessIdentifier = "section#fitness"+playerId;
            attr = $.parseJSON($(row).find(fitnessIdentifier).attr("data-player-attributes"));
            $.each(attr,function(key,value){
                data.attributes[parseInt(key,10)] = value.value;
            });

            const fitness = data.attributes[28];
            if (!tw){
                $(row).attr("data-position", parseInt($(row).attr("data-position"),10) + 1024);
            }
            if (!tw && fitness >= fitnessThreshold){
                $(row).attr("data-position", parseInt($(row).attr("data-position"),10) + 8192);
            }
            if (!tw && fitness < fitnessThreshold){
                $(row).attr("data-position", parseInt($(row).attr("data-position"),10) + 16384);
            }
            if (!tw && !playerApps[playerId]){
                $(row).attr("data-position", parseInt($(row).attr("data-position"),10) + 4096);
            }
            if (playerApps[playerId]){
                const pa = playerApps[playerId];
                if (!tw && (pa[0] >= 15 || pa[1] >= 15)){
                    $(row).attr("data-position", parseInt($(row).attr("data-position"),10) + 2048);
                }
                if (!tw && (pa[0] < 15 && pa[1] < 15)){
                    $(row).attr("data-position", parseInt($(row).attr("data-position"),10) + 4096);
                }
                $(row).find("div.squad-player-stat-data-matchdata").append(`<div class="col-xs-6"><div>Zeit</div><div>${pa[0]||0}'+${pa[1]||0}'</div></div>`);
            }
        });

        $(".ol-training-edit-button-container").prepend('<span />');

        function countActive(){
            let numActive = 0;
            if ($("#trainingGroupPlayerCb0").length) {
                numActive = $('div#activeGroupRows label.ol-lineup-editor-checkbox > input[type="checkbox"]:checked').length;
            } else {
                numActive = $("div#activeGroupRows > div.row.group-row").length;
            }
            if (numActive !== numActiveGroupPlayers){
                $(".ol-training-edit-button-container > span").text(`${numActive} ${tt("Spieler")}`);
                numActiveGroupPlayers = numActive;
                sortGroupRows();
            }
        }

        const checkMO = new MutationObserver(countActive);
        window.setTimeout(function(){
            checkMO.observe($("div#activeGroupRows")[0], { childList: true, attributes: false, subtree: false });
            if (numActiveGroupPlayers === -1){
                countActive();
            }
        }, 1);
    }

    function extendFilter(event){

        if (!OLSettings.get("TrainingGroupFilter")){
            return;
        }

        function checkCB0(mutations){
            if (mutations.find(m => m.attributeName === "data-value")){
                $("#trainingGroupPlayerCb0").prop('checked', $("div#allGroupRows label.ol-lineup-editor-checkbox > input[type=checkbox]:checked:visible").length > 0);
            }
        }

        $("div#trainingGroupPositionFilter").children("ul").eq(0).children("li").eq(0).clone().attr("data-value","16384").children().eq(0).text(`FSF<${fitnessThreshold}`).parent().attr("title",`${tt("Feldspieler Fitness")} < ${fitnessThreshold}%`).insertAfter("div#trainingGroupPositionFilter > ul > li:first-child");
        $("div#trainingGroupPositionFilter").children("ul").eq(0).children("li").eq(0).clone().attr("data-value","8192").children().eq(0).text(`FSF${fitnessThreshold}+`).parent().attr("title",`${tt("Feldspieler Fitness")} >= ${fitnessThreshold}%`).insertAfter("div#trainingGroupPositionFilter > ul > li:first-child");
        $("div#trainingGroupPositionFilter").children("ul").eq(0).children("li").eq(0).clone().attr("data-value","4096").children().eq(0).text("FSn").parent().attr("title",tt("Feldspieler ohne Einsatz (< 15')")).insertAfter("div#trainingGroupPositionFilter > ul > li:first-child");
        $("div#trainingGroupPositionFilter").children("ul").eq(0).children("li").eq(0).clone().attr("data-value","2048").children().eq(0).text("FS15").parent().attr("title",tt("Eingesetzte Feldspieler (15'+)")).insertAfter("div#trainingGroupPositionFilter > ul > li:first-child");
        $("div#trainingGroupPositionFilter").children("ul").eq(0).children("li").eq(0).clone().attr("data-value","1024").children().eq(0).text("FS").parent().attr("title",tt("Feldspieler")).insertAfter("div#trainingGroupPositionFilter > ul > li:first-child");
        $("#trainingGroupPlayerCb0").prop('checked', $("div#allGroupRows label.ol-lineup-editor-checkbox > input[type=checkbox]:checked").length > 0);
        const mo = new MutationObserver(checkCB0);
        mo.observe($("div#trainingGroupPositionFilter")[0], { attributes: true });
    }

    function showTrainingInfo(){
        const trainingRows = $("div.ol-training-playerdetails-table div.ol-player-details-training-plan > div.squad-player-value-data");
        let dauer;
        let dauerInt;
        let trainingTyp;
        trainingRows.each(function(){
            const row = $(this);
            let ith = 0;
            let intens = 0;
            let proz = 0;
            let verl = 0;
            let gesIth = 0;
            let gesIntens = 0;
            let gesProz = 0;
            let gesVerl = 0;
            let maxMin = 0;
            const trainingBlocksComments = row.find("div.details-block-wrapper-comments > div.details-block-wrapper.ol-training-playerdetails-block")
            const trainingBlocks1 = row.find("div.ol-training-player-training-plan-bar > div.details-block-wrapper.ol-training-playerdetails-block");
            
            //TODO: is trainingBlocks2 still needed?
            const trainingBlocks2 = $(row[0].parentNode).children("div.col-lg-3").find("div.ol-training-player-training-plan-bar > div.details-block-wrapper.ol-training-playerdetails-block");
            trainingBlocksComments.each(function(i,e){
                const block = $(this);
                let dataText = block.attr("data-text");
                dauer = dataText.split(" ")[0]
                trainingTyp = dataText.split(".")[1].trim()
                dauerInt = parseInt(dauer) / 15;
                switch (trainingTyp){
                    case t('Regeneration'):
                        ith = 0;
                        intens = 1;
                        proz = 0;
                        verl = 0;
                        maxMin = 240;
                        break;
                    case t('Koordinationsübungen'):
                        ith = 9;
                        intens = 2;
                        proz = 25;
                        verl = 0;
                        maxMin = 180;
                        break;
                    case t('Standardsituationen'):
                        ith = 9;
                        intens = 2;
                        proz = 25;
                        verl = 2;
                        maxMin = 120;
                        break;
                    case t('Taktik'):
                        ith = 0;
                        intens = 1;
                        proz = 0;
                        verl = 0;
                        maxMin = 90;
                        break;
                    case t('Trainingsspiel'):
                        ith = 14;
                        intens = 3;
                        proz = 50;
                        verl = 8;
                        maxMin = 150;
                        break;
                    case t('Technik'):
                        ith = 9;
                        intens = 2;
                        proz = 25;
                        verl = 0;
                        maxMin = 240;
                        break;
                    case t('Schusstraining'):
                        ith = 9;
                        intens = 2;
                        proz = 25;
                        verl = 3;
                        maxMin = 240;
                        break;
                    case t('Stabilisationstraining'):
                        ith = 14;
                        intens = 3;
                        proz = 50;
                        verl = 2;
                        maxMin = 180;
                        break;
                    case t('Spielformen bis 4-4'):
                        ith = 26;
                        intens = 4;
                        proz = 75;
                        verl = 3;
                        maxMin = 150;
                        break;
                    case t('Spielformen 5-5 bis 10-10'):
                        ith = 14;
                        intens = 3;
                        proz = 50;
                        verl = 3;
                        maxMin = 150;
                        break;
                    case t('Schnellkraft'):
                        ith = 31;
                        intens = 5;
                        proz = 100;
                        verl = 4;
                        maxMin = 180;
                        break;
                    case t('Kondition'):
                        ith = 31;
                        intens = 5;
                        proz = 100;
                        verl = 0;
                        maxMin = 240;
                        break;
                    case t('Torwarttraining'):
                        ith = 26;
                        intens = 4;
                        proz = 75;
                        verl = 2;
                        maxMin = 240;
                        break;
                    default:
                        ith = 0;
                        intens = 0;
                        proz = 0;
                        verl = 0;
                        maxMin = 0;

                }
                gesIntens += intens * dauerInt;
                gesProz += proz * dauerInt;
                gesVerl += verl * dauerInt;
                gesIth += ith * dauerInt;
                const dauerMinute = parseInt(dauer,10);
                const colorBlock1 = $(trainingBlocks1[i]);
                const colorBlock2 = $(trainingBlocks2[i]);
                colorBlock1.css("text-align","center");
                colorBlock2.css("text-align","center");
                if(i == 0){
                    colorBlock1.css("border-radius", "0.6rem 0 0 0.6rem");
                    colorBlock2.css("border-radius", "0.6rem 0 0 0.6rem");
                }

                const numSpan1 = $(`<span style="position:relative; top:-22px; font-size:8pt;">${dauerMinute}</span>`).appendTo(colorBlock1);
                const numSpan2 = $(`<span style="position:relative; top:-22px; font-size:8pt;">${dauerMinute}</span>`).appendTo(colorBlock2);
                if (dauerMinute > maxMin){
                    numSpan1.css("background-color", "red");
                    numSpan1.css("color", "white");
                    numSpan2.css("background-color", "red");
                    numSpan2.css("color", "white");
                } else if (dauerMinute === maxMin){
                    numSpan1.css("color", "green");
                    numSpan2.css("color", "green");
                }

            });
            
            row.parent().find("div.ol-training-player-training-plan-bar").each(function(i,el){         
              $(el).css("overflow", "visible");
              $(el).find(".ol-training-playerdetails-nullblock").css("border-radius", "0 0.6rem 0.6rem 0");
              $(el).append(`<div style="font-size:9pt;z-index:4;position:absolute;bottom:-15px;" title="${tt("Intensität")}">Int (hiT): <span style="font-weight:bold">${(gesIth/80).toFixed(4)}</span> <span style="font-size:smaller">(${tt("Obs.")}: ${gesIntens} / ${gesProz}%)</span> / ${tt("Verl")}:${gesVerl} <span title="${tt("Trainingsintensität nach iT-System von Rot / Verletzungsgefahr")}" class="fa fa-question-circle" style="cursor:help"></span></div>`);
            });

        });
    }

    function sortGroupRows(){

        if (!OLSettings.get("sortPlayerSurname")){
            return;
        }

        function doSortGroupRows(list){
            const players = list.children("div.row.group-row");
            const sortPlayers = Array.prototype.sort.bind(players);
            const sortedPlayers = sortPlayers(function(a,b){
                const aPlayer = $(a).attr("data-name").trim().replace(/\s+/g,'|').split('|');
                const bPlayer = $(b).attr("data-name").trim().replace(/\s+/g,'|').split('|');
                return aPlayer[1] + aPlayer[0] < bPlayer[1] + bPlayer[0] ? -1 : 1;
            });
            list.append(players);
        }

        doSortGroupRows($("div#activeGroupRows"));
        doSortGroupRows($("div#passiveGroupRows"));

    }

    function init(){
        OLCore.waitForKeyElements (
            //"div.trainingEditGroup.ol-overlay-window-content",
            "div#allGroupRows",
            groupInfo
        );

        OLCore.waitForKeyElements (
            "div.ol-training-playerdetails.ol-training-playerdetails-schedule",
            showTrainingInfo
        );

        OLCore.waitForKeyElements(
            "div#trainingGroupPositionFilter",
            extendFilter
        );
    }

    init();

})();

