/*jshint esversion: 8, multistr: true */
/* globals waitForKeyElements */

// ==UserScript==
// @name           Onlineliga - Trainingshelfer
// @namespace      http://tampermonkey.net/
// @version        0.2.2
// @description    Zusatzinformationen für das Onlineliga Training
// @author         Boonlight
// @match          https://www.onlineliga.de
// @require        https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @downloadURL https://update.greasyfork.org/scripts/424399/Onlineliga%20-%20Trainingshelfer.user.js
// @updateURL https://update.greasyfork.org/scripts/424399/Onlineliga%20-%20Trainingshelfer.meta.js
// ==/UserScript==

/******************************
 * v0.2.1 08.04.2021 (KnutEdelbert)
                     Trainingsplan: Anzeige der Intense-Werte unter "Trainingseinheiten"
                                    Anzeige der Minuten der einzelnen Trainingseinheiten über dem Block
                     Leistungsstand: exakte Skill-Werte
 * v0.2.2 12.04.2021 Bugfix Leistungsstand Wert Torwart
*******************************/

(function() {
    'use strict';

    const $ = unsafeWindow.jQuery;

    function showTrainingInfo(){
        const trainingRows = $("div.row.ol-training-playerdetails-table-row.trainingsplan-player-overviewX > div.col-lg-5");
        let dauer;
        let dauerInt;
        let trainingTyp;
        trainingRows.each(function(){
            const row = $(this);
            let intens = 0;
            let proz = 0;
            let verl = 0;
            let gesIntens = 0;
            let gesProz = 0;
            let gesVerl = 0;
            let maxMin = 0;
            const trainingBlocksComments = row.find("div.details-block-wrapper-comments > div.details-block-wrapper.ol-training-playerdetails-block")
            const trainingBlocks1 = row.find("div.ol-training-playerdetails-times > div.details-block-wrapper.ol-training-playerdetails-block");
            const trainingBlocks2 = $(row[0].parentNode).children("div.col-lg-3").find("div.ol-training-playerdetails-times > div.details-block-wrapper.ol-training-playerdetails-block");
            trainingBlocksComments.each(function(i,e)
            {
                const block = $(this);
                let dataText = block.attr("data-text");
                dauer = dataText.split(" ")[0]
                trainingTyp = dataText.split(".")[1].trim()
                dauerInt = parseInt(dauer) / 15;
                switch (trainingTyp){
                    case 'Regeneration':
                        intens = 1;
                        proz = 0;
                        verl = 0;
                        maxMin = 240;
                        break;
                    case 'Koordinationsübungen':
                        intens = 2;
                        proz = 25;
                        verl = 0;
                        maxMin = 180;
                        break;
                    case 'Standardsituationen':
                        intens = 2;
                        proz = 25;
                        verl = 2;
                        maxMin = 120;
                        break;
                    case 'Taktik':
                        intens = 1;
                        proz = 0;
                        verl = 0;
                        maxMin = 90;
                        break;
                    case 'Trainingsspiel':
                        intens =3;
                        proz = 50;
                        verl = 8;
                        maxMin = 150;
                        break;
                    case 'Technik':
                        intens =2;
                        proz = 25;
                        verl = 0;
                        maxMin = 240;
                        break;
                    case 'Schusstraining':
                        intens = 2;
                        proz = 25;
                        verl = 3;
                        maxMin = 240;
                        break;
                    case 'Stabilisationstraining':
                        intens = 3;
                        proz = 50;
                        verl = 2;
                        maxMin = 180;
                        break;
                    case 'Spielformen bis 4-4':
                        intens = 4;
                        proz = 75;
                        verl = 3;
                        maxMin = 150;
                        break;
                    case 'Spielformen 5-5 bis 10-10':
                        intens = 3;
                        proz = 50;
                        verl = 3;
                        maxMin = 150;
                        break;
                    case 'Schnellkraft':
                        intens = 5;
                        proz = 100;
                        verl = 4;
                        maxMin = 180;
                        break;
                    case 'Kondition':
                        intens = 5;
                        proz = 100;
                        verl = 0;
                        maxMin = 240;
                        break;
                    case 'Torwarttraining':
                        intens = 4;
                        proz = 75;
                        verl = 2;
                        maxMin = 240;
                        break;
                    default:
                        intens = 0;
                        proz = 0;
                        verl = 0;
                        maxMin = 0;

                }
                gesIntens += intens * dauerInt;
                gesProz += proz * dauerInt;
                gesVerl += verl * dauerInt;
                const dauerMinute = parseInt(dauer,10);
                const colorBlock1 = $(trainingBlocks1[i]);
                const colorBlock2 = $(trainingBlocks2[i]);
                colorBlock1.css("text-align","center");
                colorBlock2.css("text-align","center");
                const numSpan1 = $(`<span style="position:relative; top:-22px; font-size:8pt;">${dauerMinute}</span>`).appendTo(colorBlock1);
                const numSpan2 = $(`<span style="position:relative; top:-22px; font-size:8pt;">${dauerMinute}</span>`).appendTo(colorBlock2);
                if (dauerMinute > maxMin){
                    numSpan1.css("color", "red");
                    numSpan2.css("color", "red");
                } else if (dauerMinute === maxMin){
                    numSpan1.css("color", "green");
                    numSpan2.css("color", "green");
                }

            })
            //const rowIntens = row.find("div.col-md-3.col-sm-3.hidden-xs.ol-training-playerdetails-intensity");
            const rowIntens = row.find("div.ol-training-playerdetails-times");
            rowIntens.append(`<div style="font-size:9pt;">Int:${gesIntens} / ${gesProz}% / Verl:${gesVerl} </div>`);

        });
    }

    function resultDetails(elem){
        const dispSpan = elem.find("span.ol-value-bar-small-label");
        dispSpan.css("left","-10px");
        dispSpan.css("width","70px");
        const valSpan = elem.find("span.ol-value-bar-small-bar.ol-value-bar-layer-2")[0];
        let fixed = 0;
        const width = valSpan.style.width;
        const widthMatch = width.match(/\d+\.(\d+)%/);
        if (widthMatch){
            fixed = widthMatch[1].length;
        }
        const detailValue = (parseFloat(valSpan.style.left) + parseFloat(valSpan.style.width)).toFixed(fixed);
        dispSpan.find("span.ol-value-bar-small-label-value").text(detailValue);
    }

    function init(){
        //wait for the Trainingsplan Tab
        waitForKeyElements (
            "div.ol-training-playerdetails.ol-training-playerdetails-schedule",
            showTrainingInfo
        );

        //wait for the Trainingsplan Tab
        waitForKeyElements (
            "div.training-playerdetails-result-item:not(.training-playerdetails-result-nullitem)",
            resultDetails
        );
    }

    if (!window.OLToolboxActivated) {
       init();
    } else {
        window.OnlineligaTrainingsIntense = {
            init : init
        };
    }

})();