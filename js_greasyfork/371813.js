// ==UserScript==
// @name            DugoutTool
// @namespace       Dugtool
// @version         1.4
// @description     This is a useful tool for Dugout-Online game.
// @include         http*://*dugout-online.com/players/details*playerID/*
// @include         http*://*dugout-online.com/players/none/view*clubid*
// @include         http*://*dugout-online.com/players/none/clubid*
// @include         https://*dugout-online.com/players_nt/none/clubid/*
// @include         http*://*dugout-online.com/finances/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.2/Chart.min.js
// @downloadURL https://update.greasyfork.org/scripts/371813/DugoutTool.user.js
// @updateURL https://update.greasyfork.org/scripts/371813/DugoutTool.meta.js
// ==/UserScript==yyyy

var APPNAME = "DugoutTool v1.4";
var FORUMLINK = "/forum/viewtopic/t/450035";

switch (checkPage(document.URL))
{
    case 0: doPlayerStuff(); break;
    case 1: doSquadStuff(); break;
    case 2: doFinancesStuff(); break;
}

function checkPage (string1)
{
    'use strict';
    if(!document.getElementById("login_form_id")){
        if(isExist(string1, "players/details")){
            return 0;
        }
        else if (isExist(string1, "players/none/clubid") || isExist(string1, "players/none/view") || isExist(string1, "/players/spreadsheet/clubid") || isExist(string1, "/players_nt/none/clubid")){
            return 1;
        }
        else if (isExist(string1, "finances")){
            return 2;
        }
        else if(isExist(string1, "game/none/gameid")){
            return 3;
        }
    }
    return -1;
}

function isExist(mainString, substring) {
    'use strict';
    if (mainString.indexOf(substring) != -1) {
        return true;
    }
    else {
        return false;
    }
}

function doPlayerStuff() {
    'use strict';
    createPlayerHTML(getPlayerCalculations());
    if(document.getElementById("tra2")){
        createTrainingAnalyzerHtml(getPlayerTrainingAnalyzerAtributes());

        if(document.getElementById("tra2").className == "tab_on_content"){
            document.getElementsByClassName("dogtoolWrapper")[0].classList.add("hide");
        } else {
            document.getElementsByClassName("dogtoolWrapper")[1].classList.add("hide");
        }
    }

    var actions = document.getElementsByClassName("tabs_content")[0].querySelectorAll("div");
    if (actions) {
        actions.forEach(function(elem) {
            elem.addEventListener("click", function() {
                var dogtoolWrapperElements = document.getElementsByClassName("dogtoolWrapper");

                if(elem.id.indexOf("tra") > -1){
                    dogtoolWrapperElements[0].classList.add("hide");
                    dogtoolWrapperElements[1].classList.remove("hide");
                } else {
                    dogtoolWrapperElements[0].classList.remove("hide");
                    dogtoolWrapperElements[1].classList.add("hide");
                }
            });
        });
    }
}

function createTrainingAnalyzerHtml(playerTrainingAnalyzerAtributes){
    var html =
        '<table class="dugToolTable">'+
           '<thead>' +
              '<tr>' +
                 '<th>Attributes</th>' +
                 '<th>Training points</th>' +
              '</tr>' +
           '</thead>' +
           '<tbody>';

    for(var pos in playerTrainingAnalyzerAtributes){
        var playerTrainin = playerTrainingAnalyzerAtributes[pos];
        html +=
            '<tr>' +
               '<td>' + playerTrainin.name + '</td>'+
                 '<td>' + playerTrainin.value + '</td>' +
            '</tr>';
    }

    html +=
           '</tbody>' +
        '</table>';

    createDugtoolHtml(html);
}

function createPlayerHTML(player){
    'use strict';
    var selectedplayingPosition = null;
    for(var playingPosition in player.atributes.playingPosition) {
        if(selectedplayingPosition == null || player.calculations[playingPosition].rating > player.calculations[selectedplayingPosition].rating){
           selectedplayingPosition = playingPosition;
        }
    }

    var html =
            '<div class="tooltip graphLegend">&#9432' +
               '<span class="tooltiptext"><b><u>Def</u></b> - Defending<br>' +
                  '<b><u>Phy</u></b> - Physical<br>' +
                  '<b><u>Tact</u></b> - Tactical<br>' +
                  '<b><u>Att</u></b> - Attacking<br>' +
                  '<b><u>Tech</u></b> - Technical<br>' +
                  '<b><u>Men</u></b> - Mental<br>' +
                  '<b><u>OPS</u></b> - Original Position Skills<br>' +
               ' </span>' +
            '</div>' +
            '<canvas id="myChart" width="400" height="400" class="graph"></canvas>' +
            '<table class="dugToolTable">' +
               '<thead>' +
                  '<tr>' +
                     '<th>Pos</th>' +
                     '<th>Rating</th>' +
                     '<th>OPS</th>' +
                     '<th></th>' +
                  '</tr>' +
               '</thead>' +
               '<tbody>';

    for(var pos in player.calculations) {
        if(pos != "captain" && pos != "playmaker"){
            var trClass = "";

            for(var calPos in player.calculations) {
                if(player.calculations[calPos].type == player.calculations[pos].type && player.atributes.playingPosition[calPos] > 0){
                    trClass = "active dugToolPositionHighlight";
                    for(var calPos1 in player.calculations) {
                        if(player.calculations[calPos1].type == player.calculations[pos].type && player.calculations[calPos1].rating > player.calculations[pos].rating){
                            trClass = "";
                            break;
                        }
                    }
                    break;
                }
            }

            html +=
                  '<tr class="' + trClass + '">' +
                     '<td>' + pos + '</td>' +
                     '<td>' + ((player.calculations[pos].rating) * (player.atributes.condition / 100)).toFixed(1) + ' (' + player.calculations[pos].rating.toFixed(1) + ')</td>' +
                     '<td>' + player.calculations[pos].OPS + '</td>';

            if(pos == selectedplayingPosition)
            {
                html += '<td class="addInChart active" data-pos="' + pos + '">&#10004</td>';
            } else {
                html += '<td class="addInChart" data-pos="' + pos + '">&#10004</td>';
            }

            html +=
                  '</tr>';
        }
    }

    html+= '</tbody></table>' +
        '<table class="dugToolTable">' +
           '<tbody>' +
               '<tr class="dugToolPositionHighlight">' +
                 '<td>Captain:</td>' +
                 '<td>' + (player.calculations.captain.rating).toFixed(1) + '</td>' +
               '</tr>' +
               '<tr class="dugToolPositionHighlight">' +
                 '<td>Playmaker:</td>' +
                 '<td>' + (player.calculations.playmaker.rating).toFixed(1) + '</td>' +
               '</tr>' +
               '<tr class="dugToolPositionHighlight">' +
                 '<td>Experience:</td>' +
                 '<td>' + player.atributes.exp + '</td>' +
              '</tr>' +
           '</tbody>' +
        '</table>';

    var css = '.dogtoolContent .graph {margin-bottom: 15px} ' +
        '.dugToolTable td, .dugToolTable th {font-size: 10px} ' +
        '.dugToolTable {margin-bottom: 10px; background-color: transparent; border-spacing: 0; border-collapse: collapse; width: 100%; max-width: 100%;} ' +
        '.dugToolTable>thead>tr>th {vertical-align: bottom; border-bottom: 2px solid rgba(0,0,0,.06); padding: 4px; line-height: 1.42857143;} ' +
        '.dugToolTable th, .dugToolTable td {text-align: left;} ' +
        '.dugToolTable>tbody>tr:nth-of-type(odd) {background-color: #f9f9f9;}' +
        '.dugToolTable>tbody>tr>td {padding: 4px; line-height: 1.42857143; vertical-align: top; border-top: 1px solid rgba(0,0,0,.06);}' +
        '.dugToolTable>tbody>tr:hover {background-color: #f5f5f5;}' +
        '.dugToolTable>tbody>tr.active td{background-color: #f5f5f5;}' +
        '.dugToolTable>tbody>tr.active:hover>td {background-color: #e8e8e8;}' +
        '.dugToolTable>tbody>tr.dugToolPositionHighlight {font-weight: bold;}' +
        '.dugToolTable .addInChart {cursor: pointer;}' +
        '.dugToolTable .addInChart:not(.active) {color: rgba(56, 56, 56, 0.1);}' +
        '.tooltip {position: absolute; display: inline-block;}' +
        '.tooltip .tooltiptext {visibility: hidden; width: 120px; background-color: #555; color: #fff; text-align: left; padding: 5px; font-size: 9px; border-radius: 6px; position: absolute; z-index: 1; bottom: 125%; right: -4px; margin-left: -65px; opacity: 0; transition: opacity 0.3s; line-height: 11px;}' +
        '.tooltip .tooltiptext::after {content: ""; position: absolute; top: 100%; right: 6px; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #555 transparent transparent transparent;}' +
        '.tooltip:active .tooltiptext {visibility: visible; opacity: 1;}' +
        '.tooltip.graphLegend {left: 88%; cursor: pointer;}';

    createDugtoolHtml(html, css);

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Def', 'Phy', 'Tact','Att', 'Tech', 'Men'],
            datasets: [{
                borderColor: '#000000',
                data: [(player.octagon[selectedplayingPosition].defending).toFixed(1), (player.octagon[selectedplayingPosition].physical).toFixed(1), (player.octagon[selectedplayingPosition].tactical).toFixed(1), (player.octagon[selectedplayingPosition].attacking).toFixed(1), (player.octagon[selectedplayingPosition].technical).toFixed(1), (player.octagon[selectedplayingPosition].mental).toFixed(1)],
                pointRadius: 0,
                borderWidth: 1,
                fill: false
            }, {
				backgroundColor: 'rgba(222, 133, 102, 0.5)',
				borderColor: 'rgba(222, 133, 102, 0.5)',
				data: [21, 21, 21, 21, 21, 21],
                pointRadius: 0,
                borderWidth: 1,
			}, {
				backgroundColor: 'rgba(237, 200, 110, 0.5)',
				borderColor: 'rgba(237, 200, 110, 0.5)',
				data: [35, 35, 35, 35, 35, 35],
                fill: 1,
                pointRadius: 0,
                borderWidth: 1,
			}, {
				backgroundColor: 'rgba(163, 198, 132, 0.5)',
				borderColor: 'rgba(163, 198, 132, 0.5)',
				data: [50, 50, 50, 50, 50, 50],
                fill: 1,
                pointRadius: 0,
                borderWidth: 1,
			}]
        },
        options: {
            legend: {
                display: false
            },
            tooltips: {
                enabled: false
            },
            scale: {
                ticks: {
                    display: false,
                    min: 0,
                    max: 50
                }
            }
        }
    });

    var actions = document.querySelectorAll(".addInChart");
    if (actions) {
        actions.forEach(function(elem) {
            elem.addEventListener("click", function() {
                updatePlayerChart(myChart, player, elem.dataset.pos);
                document.querySelector(".addInChart.active").classList.remove("active");
                elem.classList.add("active");
            });
        });
    }
}

function updatePlayerChart(chart, player, pos){
    'use strict';
    chart.data.datasets[0].data = [(player.octagon[pos].defending).toFixed(1), (player.octagon[pos].physical).toFixed(1), (player.octagon[pos].tactical).toFixed(1), (player.octagon[pos].attacking).toFixed(1), (player.octagon[pos].technical).toFixed(1), (player.octagon[pos].mental).toFixed(1)];
    chart.update();
}

function getPlayerCalculations() {
    'use strict';
    var player = {};
    player.atributes = getPlayerAtributes();
    player.calculations = {};

    var calucatedAtributes = {};
    calucatedAtributes.GK = [];
    calucatedAtributes.GK.push({name: "reflexes", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.GK.push({name: "oneonones", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.GK.push({name: "handling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.GK.push({name: "positioning", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.GK.push({name: "communication", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.GK.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: false});
    calucatedAtributes.GK.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.GK.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.GK.push({name: "strength", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.DC = [];
    calucatedAtributes.DC.push({name: "tackling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DC.push({name: "marking", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DC.push({name: "heading", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DC.push({name: "positioning", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DC.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DC.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: false});
    calucatedAtributes.DC.push({name: "communication", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.DC.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.DC.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DC.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.DC.push({name: "speed", importante: 1, opsCalc: false, add: true});

    calucatedAtributes.SW = [];
    calucatedAtributes.SW.push({name: "tackling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.SW.push({name: "marking", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.SW.push({name: "heading", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.SW.push({name: "positioning", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.SW.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SW.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: false});
    calucatedAtributes.SW.push({name: "communication", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.SW.push({name: "teamwork", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SW.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SW.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.SW.push({name: "speed", importante: 1.5, opsCalc: false, add: true});

    calucatedAtributes.DL = [];
    calucatedAtributes.DL.push({name: "tackling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DL.push({name: "marking", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DL.push({name: "crossing", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DL.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DL.push({name: "heading", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DL.push({name: "positioning", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DL.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: false});
    calucatedAtributes.DL.push({name: "communication", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.DL.push({name: "speed", importante: 2, opsCalc: false, add: true});
    calucatedAtributes.DL.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.DL.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DL.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.DR = [];
    calucatedAtributes.DR.push({name: "tackling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DR.push({name: "marking", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DR.push({name: "crossing", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DR.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DR.push({name: "heading", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DR.push({name: "positioning", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DR.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: false});
    calucatedAtributes.DR.push({name: "communication", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.DR.push({name: "speed", importante: 2, opsCalc: false, add: true});
    calucatedAtributes.DR.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.DR.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DR.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.DMC = [];
    calucatedAtributes.DMC.push({name: "passing", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.DMC.push({name: "creativity", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.DMC.push({name: "tackling", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DMC.push({name: "marking", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DMC.push({name: "positioning", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.DMC.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.DMC.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DMC.push({name: "speed", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.DMC.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: false});
    calucatedAtributes.DMC.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.MC = [];
    calucatedAtributes.MC.push({name: "passing", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.MC.push({name: "creativity", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.MC.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.MC.push({name: "firsttouch", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.MC.push({name: "longshots", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.MC.push({name: "speed", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.MC.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.MC.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.MC.push({name: "marking", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.MC.push({name: "strength", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.MC.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.AMC = [];
    calucatedAtributes.AMC.push({name: "passing", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.AMC.push({name: "creativity", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.AMC.push({name: "dribbling", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.AMC.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.AMC.push({name: "firsttouch", importante: 3, opsCalc: false, add: true});
    calucatedAtributes.AMC.push({name: "longshots", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.AMC.push({name: "speed", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.AMC.push({name: "shooting", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.AMC.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.AMC.push({name: "positioning", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.AMC.push({name: "strength", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.AMC.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.ML = [];
    calucatedAtributes.ML.push({name: "passing", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.ML.push({name: "creativity", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.ML.push({name: "crossing", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.ML.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.ML.push({name: "speed", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.ML.push({name: "firsttouch", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.ML.push({name: "longshots", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.ML.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.ML.push({name: "marking", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.ML.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.ML.push({name: "strength", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.ML.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.MR = [];
    calucatedAtributes.MR.push({name: "passing", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.MR.push({name: "creativity", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.MR.push({name: "crossing", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.MR.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.MR.push({name: "speed", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.MR.push({name: "firsttouch", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.MR.push({name: "longshots", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.MR.push({name: "eccentricity", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.MR.push({name: "marking", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.MR.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.MR.push({name: "strength", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.MR.push({name: "aggression", importante: 0.5, opsCalc: false, add: true});

    calucatedAtributes.FC = [];
    calucatedAtributes.FC.push({name: "shooting", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.FC.push({name: "dribbling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.FC.push({name: "longshots", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.FC.push({name: "speed", importante: 1.5, opsCalc: false, add: true});
    calucatedAtributes.FC.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.FC.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.FC.push({name: "heading", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.FC.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.FC.push({name: "firsttouch", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.FC.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.FC.push({name: "eccentricity", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.FC.push({name: "aggression", importante: 1, opsCalc: false, add: true});

    calucatedAtributes.SC = [];
    calucatedAtributes.SC.push({name: "shooting", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.SC.push({name: "dribbling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.SC.push({name: "heading", importante: 4, opsCalc: true, add: true});
    calucatedAtributes.SC.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.SC.push({name: "strength", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SC.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.SC.push({name: "speed", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SC.push({name: "firsttouch", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.SC.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SC.push({name: "eccentricity", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.SC.push({name: "aggression", importante: 1, opsCalc: false, add: true});

    calucatedAtributes.LW = [];
    calucatedAtributes.LW.push({name: "shooting", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.LW.push({name: "crossing", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.LW.push({name: "dribbling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.LW.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.LW.push({name: "speed", importante: 2, opsCalc: false, add: true});
    calucatedAtributes.LW.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.LW.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.LW.push({name: "longshots", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.LW.push({name: "firsttouch", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.LW.push({name: "eccentricity", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.LW.push({name: "strength", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.LW.push({name: "aggression", importante: 1, opsCalc: false, add: true});

    calucatedAtributes.RW = [];
    calucatedAtributes.RW.push({name: "shooting", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.RW.push({name: "crossing", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.RW.push({name: "dribbling", importante: 5, opsCalc: true, add: true});
    calucatedAtributes.RW.push({name: "passing", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.RW.push({name: "speed", importante: 2, opsCalc: false, add: true});
    calucatedAtributes.RW.push({name: "teamwork", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.RW.push({name: "positioning", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.RW.push({name: "longshots", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.RW.push({name: "firsttouch", importante: 3, opsCalc: true, add: true});
    calucatedAtributes.RW.push({name: "eccentricity", importante: 1, opsCalc: false, add: true});
    calucatedAtributes.RW.push({name: "strength", importante: 0.5, opsCalc: false, add: true});
    calucatedAtributes.RW.push({name: "aggression", importante: 1, opsCalc: false, add: true});

    var calculationOctagon = {};
    calculationOctagon.defending = [];
    calculationOctagon.defending.push({name: "tackling", require: false});
    calculationOctagon.defending.push({name: "marking", require: true});
    calculationOctagon.defending.push({name: "reflexes", require: false});
    calculationOctagon.defending.push({name: "handling", require: false});
    calculationOctagon.physical = [];
    calculationOctagon.physical.push({name: "speed", require: false});
    calculationOctagon.physical.push({name: "strength", require: true});
    calculationOctagon.tactical = [];
    calculationOctagon.tactical.push({name: "positioning", require: true});
    calculationOctagon.tactical.push({name: "communication", require: false});
    calculationOctagon.tactical.push({name: "creativity", require: false});
    calculationOctagon.attacking = [];
    calculationOctagon.attacking.push({name: "shooting", require: false});
    calculationOctagon.attacking.push({name: "dribbling", require: false});
    calculationOctagon.attacking.push({name: "longshots", require: true});
    calculationOctagon.technical = [];
    calculationOctagon.technical.push({name: "crossing", require: false});
    calculationOctagon.technical.push({name: "passing", require: false});
    calculationOctagon.technical.push({name: "heading", require: false});
    calculationOctagon.technical.push({name: "firsttouch", require: false});
    calculationOctagon.technical.push({name: "oneonones", require: false});
    calculationOctagon.mental = [];
    calculationOctagon.mental.push({name: "aggression", require: false});
    calculationOctagon.mental.push({name: "teamwork", require: false});
    calculationOctagon.mental.push({name: "influence", require: false});
    calculationOctagon.mental.push({name: "eccentricity", require: false});

    player.calculations.GK = {};
    player.calculations.GK.type = "GK";
    player.calculations.DC = {};
    player.calculations.DC.type = "DEF";
    player.calculations.SW = {};
    player.calculations.SW.type = "DEF";
    player.calculations.DL = {};
    player.calculations.DL.type = "DEF";
    player.calculations.DR = {};
    player.calculations.DR.type = "DEF";
    player.calculations.DMC = {};
    player.calculations.DMC.type = "MID";
    player.calculations.MC = {};
    player.calculations.MC.type = "MID";
    player.calculations.AMC = {};
    player.calculations.AMC.type = "MID";
    player.calculations.ML = {};
    player.calculations.ML.type = "MID";
    player.calculations.MR = {};
    player.calculations.MR.type = "MID";
    player.calculations.FC = {};
    player.calculations.FC.type = "FWD";
    player.calculations.SC = {};
    player.calculations.SC.type = "FWD";
    player.calculations.LW = {};
    player.calculations.LW.type = "FWD";
    player.calculations.RW = {};
    player.calculations.RW.type = "FWD";
    player.octagon = {};

    player.octagon.GK = {};
    player.octagon.GK.defending = 0;
    player.octagon.GK.physical = 0;
    player.octagon.GK.tactical = 0;
    player.octagon.GK.attacking = 0;
    player.octagon.GK.technical = 0;
    player.octagon.GK.mental = 0;

    player.octagon.DC = {};
    player.octagon.DC.defending = 0;
    player.octagon.DC.physical = 0;
    player.octagon.DC.tactical = 0;
    player.octagon.DC.attacking = 0;
    player.octagon.DC.technical = 0;
    player.octagon.DC.mental = 0;

    player.octagon.SW = {};
    player.octagon.SW.defending = 0;
    player.octagon.SW.physical = 0;
    player.octagon.SW.tactical = 0;
    player.octagon.SW.attacking = 0;
    player.octagon.SW.technical = 0;
    player.octagon.SW.mental = 0;

    player.octagon.DL = {};
    player.octagon.DL.defending = 0;
    player.octagon.DL.physical = 0;
    player.octagon.DL.tactical = 0;
    player.octagon.DL.attacking = 0;
    player.octagon.DL.technical = 0;
    player.octagon.DL.mental = 0;

    player.octagon.DR = {};
    player.octagon.DR.defending = 0;
    player.octagon.DR.physical = 0;
    player.octagon.DR.tactical = 0;
    player.octagon.DR.attacking = 0;
    player.octagon.DR.technical = 0;
    player.octagon.DR.mental = 0;

    player.octagon.DMC = {};
    player.octagon.DMC.defending = 0;
    player.octagon.DMC.physical = 0;
    player.octagon.DMC.tactical = 0;
    player.octagon.DMC.attacking = 0;
    player.octagon.DMC.technical = 0;
    player.octagon.DMC.mental = 0;

    player.octagon.MC = {};
    player.octagon.MC.defending = 0;
    player.octagon.MC.physical = 0;
    player.octagon.MC.tactical = 0;
    player.octagon.MC.attacking = 0;
    player.octagon.MC.technical = 0;
    player.octagon.MC.mental = 0;

    player.octagon.AMC = {};
    player.octagon.AMC.defending = 0;
    player.octagon.AMC.physical = 0;
    player.octagon.AMC.tactical = 0;
    player.octagon.AMC.attacking = 0;
    player.octagon.AMC.technical = 0;
    player.octagon.AMC.mental = 0;

    player.octagon.ML = {};
    player.octagon.ML.defending = 0;
    player.octagon.ML.physical = 0;
    player.octagon.ML.tactical = 0;
    player.octagon.ML.attacking = 0;
    player.octagon.ML.technical = 0;
    player.octagon.ML.mental = 0;

    player.octagon.MR = {};
    player.octagon.MR.defending = 0;
    player.octagon.MR.physical = 0;
    player.octagon.MR.tactical = 0;
    player.octagon.MR.attacking = 0;
    player.octagon.MR.technical = 0;
    player.octagon.MR.mental = 0;

    player.octagon.FC = {};
    player.octagon.FC.defending = 0;
    player.octagon.FC.physical = 0;
    player.octagon.FC.tactical = 0;
    player.octagon.FC.attacking = 0;
    player.octagon.FC.technical = 0;
    player.octagon.FC.mental = 0;

    player.octagon.SC = {};
    player.octagon.SC.defending = 0;
    player.octagon.SC.physical = 0;
    player.octagon.SC.tactical = 0;
    player.octagon.SC.attacking = 0;
    player.octagon.SC.technical = 0;
    player.octagon.SC.mental = 0;

    player.octagon.LW = {};
    player.octagon.LW.defending = 0;
    player.octagon.LW.physical = 0;
    player.octagon.LW.tactical = 0;
    player.octagon.LW.attacking = 0;
    player.octagon.LW.technical = 0;
    player.octagon.LW.mental = 0;

    player.octagon.RW = {};
    player.octagon.RW.defending = 0;
    player.octagon.RW.physical = 0;
    player.octagon.RW.tactical = 0;
    player.octagon.RW.attacking = 0;
    player.octagon.RW.technical = 0;
    player.octagon.RW.mental = 0;

    for(var type in player.calculations) {
        player.calculations[type].OPS = 0;
        player.calculations[type].rating = 0;
        var sumImportante = 0;
        for(var i in calucatedAtributes[type]) {
            var atributes = calucatedAtributes[type][i];

            var value = player.atributes[atributes.name];
            if(atributes.name == "positioning"){
                value = player.atributes.positioning[type];
            }

            if(atributes.add){
                player.calculations[type].rating += (value * atributes.importante);
                sumImportante += atributes.importante;
            } else {
                if(atributes.name == "eccentricity")
                {
                    value -= 15;
                }
                player.calculations[type].rating -= (value * atributes.importante);
            }

            if(atributes.opsCalc){
                if(atributes.name == "positioning"){
                    player.calculations[type].OPS += player.atributes[atributes.name].value;
                } else {
                    player.calculations[type].OPS += player.atributes[atributes.name];
                }
            }
        }
        player.calculations[type].rating = player.calculations[type].rating/sumImportante
    }

    for(var pos in player.calculations) {
        if(pos == "GK") {
            calculationOctagon.defending[0].require = false; //tackling
            calculationOctagon.defending[1].require = false; //marking
        } else {
            calculationOctagon.defending[0].require = true; //tackling
            calculationOctagon.defending[1].require = true; //marking
        }

        if(pos == "SC") {
            calculationOctagon.attacking[2].require = false; //longshots
        } else {
            calculationOctagon.attacking[2].require = true; //longshots
        }

        for(var octagonType in calculationOctagon){
            var octagonSumImportante = 0;
            for(var octagonAtributes in calculationOctagon[octagonType]){
                var octagonAtribute = calculationOctagon[octagonType][octagonAtributes];
                var selectedAtribute = null;
                for(var playerAtributes in calucatedAtributes[pos]){
                    var playerAtribute = calucatedAtributes[pos][playerAtributes];
                    if(playerAtribute.name == octagonAtribute.name){
                        selectedAtribute = playerAtribute;
                    }
                }

                if(octagonAtribute.require && selectedAtribute == null){
                    selectedAtribute = {name: octagonAtribute.name, importante: 1, opsCalc: false, add: true};
                }

                if(selectedAtribute != null){
                    var value = player.atributes[selectedAtribute.name];
                    if(selectedAtribute.name == "positioning"){
                        value = player.atributes.positioning[pos];
                    }

                    if(selectedAtribute.add){
                        player.octagon[pos][octagonType] += (value * selectedAtribute.importante);
                        octagonSumImportante += selectedAtribute.importante;
                    } else {
                        if(atributes.name == "eccentricity")
                        {
                            value -= 15;
                        }
                        player.octagon[pos][octagonType] -= (value * selectedAtribute.importante);
                    }
                }
            }

            player.octagon[pos][octagonType] = player.octagon[pos][octagonType]/octagonSumImportante;

            if(player.octagon[pos][octagonType] < 0){
                player.octagon[pos][octagonType] = 0;
            }
        }
    }

    player.calculations.captain = {};
    player.calculations.captain.rating = (player.atributes.influence * 5 + player.atributes.communication + player.atributes.exp / 20) / 7;

    player.calculations.playmaker = {};
    player.calculations.playmaker.rating = (player.atributes.creativity * 5 + player.atributes.communication + player.atributes.positioning.MC * 5) / 11;

    return player;
}

function getPlayerAtributes() {
    'use strict';

    var tableA = 3;

    if (document.getElementsByClassName("info").length > 0) { //Transfer info
        tableA++;
    }

    if(document.getElementsByClassName("talent_info").length > 0) //Talent info
    {
        tableA += document.getElementById("talentPanel").getElementsByTagName("table").length;
    }

    var table = document.getElementsByTagName("table")[tableA].getElementsByTagName("td");

    var playerAtributes = {};
    playerAtributes.reflexes = parseInt(table[2].innerHTML);
    playerAtributes.tackling = parseInt(table[5].innerHTML);
    playerAtributes.creativity = parseInt(table[8].innerHTML);
    playerAtributes.shooting = parseInt(table[11].innerHTML);
    playerAtributes.teamwork = parseInt(table[14].innerHTML);
    playerAtributes.oneonones = parseInt(table[17].innerHTML);
    playerAtributes.marking = parseInt(table[20].innerHTML);
    playerAtributes.passing = parseInt(table[23].innerHTML);
    playerAtributes.dribbling = parseInt(table[26].innerHTML);
    playerAtributes.speed = parseInt(table[29].innerHTML);
    playerAtributes.handling = parseInt(table[32].innerHTML);
    playerAtributes.heading = parseInt(table[35].innerHTML);
    playerAtributes.longshots = parseInt(table[38].innerHTML);
    playerAtributes.positioning = {};
    playerAtributes.positioning.value = parseInt(table[41].innerHTML);
    playerAtributes.strength = parseInt(table[44].innerHTML);
    playerAtributes.communication = parseInt(table[47].innerHTML);
    playerAtributes.crossing = parseInt(table[50].innerHTML);
    playerAtributes.firsttouch = parseInt(table[53].innerHTML);
    playerAtributes.aggression = parseInt(table[56].innerHTML);
    playerAtributes.influence = parseInt(table[59].innerHTML);
    playerAtributes.eccentricity = parseInt(table[62].innerHTML);
    playerAtributes.exp = getExp((new XMLSerializer()).serializeToString(document));
    playerAtributes.playingPosition = getPlayerPlayingPositions();
    playerAtributes.condition = getCondition();

    for (var i in playerAtributes.playingPosition) {
        switch (playerAtributes.playingPosition[i])
        {
            case ("0"): playerAtributes.positioning[i] = playerAtributes.positioning.value * 0.25; break;
            case ("1"): playerAtributes.positioning[i] = playerAtributes.positioning.value; break;
            case ("2"): playerAtributes.positioning[i] = playerAtributes.positioning.value * 0.8; break;
            case ("3"): playerAtributes.positioning[i] = playerAtributes.positioning.value * 0.5; break;
        }
    }

    return playerAtributes;
}

function getPlayerTrainingAnalyzerAtributes() {
    'use strict';
    var table = document.getElementById("progress").getElementsByTagName("table")[1].getElementsByTagName("td");

    var playerTrainingAnalyzerAtributes = {};
    playerTrainingAnalyzerAtributes.ratinggoalkeeper = {};
    playerTrainingAnalyzerAtributes.ratinggoalkeeper.name = "Goalkeeper";
    playerTrainingAnalyzerAtributes.ratinggoalkeeper.value = getTrainingPoint(table[2]);

    playerTrainingAnalyzerAtributes.ratingdefender = {};
    playerTrainingAnalyzerAtributes.ratingdefender.name = "Defender";
    playerTrainingAnalyzerAtributes.ratingdefender.value = getTrainingPoint(table[7]);

    playerTrainingAnalyzerAtributes.ratingmidfielder = {};
    playerTrainingAnalyzerAtributes.ratingmidfielder.name = "Midfielder";
    playerTrainingAnalyzerAtributes.ratingmidfielder.value = getTrainingPoint(table[12]);

    playerTrainingAnalyzerAtributes.ratingforward = {};
    playerTrainingAnalyzerAtributes.ratingforward.name = "Forward";
    playerTrainingAnalyzerAtributes.ratingforward.value = getTrainingPoint(table[17]);

    playerTrainingAnalyzerAtributes.reflexes = {};
    playerTrainingAnalyzerAtributes.reflexes.name = "Reflexes";
    playerTrainingAnalyzerAtributes.reflexes.value = getTrainingPoint(table[22]);

    playerTrainingAnalyzerAtributes.oneonones = {};
    playerTrainingAnalyzerAtributes.oneonones.name = "One on ones";
    playerTrainingAnalyzerAtributes.oneonones.value = getTrainingPoint(table[27]);

    playerTrainingAnalyzerAtributes.handling = {};
    playerTrainingAnalyzerAtributes.handling.name = "Handling";
    playerTrainingAnalyzerAtributes.handling.value = getTrainingPoint(table[32]);

    playerTrainingAnalyzerAtributes.communication = {};
    playerTrainingAnalyzerAtributes.communication.name = "Communication";
    playerTrainingAnalyzerAtributes.communication.value = getTrainingPoint(table[37]);

    playerTrainingAnalyzerAtributes.positioning = {};
    playerTrainingAnalyzerAtributes.positioning.name = "Positioning";
    playerTrainingAnalyzerAtributes.positioning.value = getTrainingPoint(table[42]);

    playerTrainingAnalyzerAtributes.tackling = {};
    playerTrainingAnalyzerAtributes.tackling.name = "Tackling";
    playerTrainingAnalyzerAtributes.tackling.value = getTrainingPoint(table[47]);

    playerTrainingAnalyzerAtributes.marking = {};
    playerTrainingAnalyzerAtributes.marking.name = "Marking";
    playerTrainingAnalyzerAtributes.marking.value = getTrainingPoint(table[52]);

    playerTrainingAnalyzerAtributes.heading = {};
    playerTrainingAnalyzerAtributes.heading.name= "Heading";
    playerTrainingAnalyzerAtributes.heading.value = getTrainingPoint(table[57]);

    playerTrainingAnalyzerAtributes.passing = {};
    playerTrainingAnalyzerAtributes.passing.name = "Passing";
    playerTrainingAnalyzerAtributes.passing.value = getTrainingPoint(table[62]);

    playerTrainingAnalyzerAtributes.creativity = {};
    playerTrainingAnalyzerAtributes.creativity.name = "Creativity";
    playerTrainingAnalyzerAtributes.creativity.value = getTrainingPoint(table[67]);

    playerTrainingAnalyzerAtributes.crossing = {};
    playerTrainingAnalyzerAtributes.crossing.name = "Crossing";
    playerTrainingAnalyzerAtributes.crossing.value = getTrainingPoint(table[72]);

    playerTrainingAnalyzerAtributes.longshots = {}
    playerTrainingAnalyzerAtributes.longshots.name = "Long shots";
    playerTrainingAnalyzerAtributes.longshots.value = getTrainingPoint(table[77]);

    playerTrainingAnalyzerAtributes.dribbling = {};
    playerTrainingAnalyzerAtributes.dribbling.name = "Dribbling";
    playerTrainingAnalyzerAtributes.dribbling.value = getTrainingPoint(table[82]);

    playerTrainingAnalyzerAtributes.firsttouch = {};
    playerTrainingAnalyzerAtributes.firsttouch.name = "First touch";
    playerTrainingAnalyzerAtributes.firsttouch.value = getTrainingPoint(table[87]);

    playerTrainingAnalyzerAtributes.shooting = {};
    playerTrainingAnalyzerAtributes.shooting.name = "Shooting";
    playerTrainingAnalyzerAtributes.shooting.value = getTrainingPoint(table[92]);

    playerTrainingAnalyzerAtributes.speed ={};
    playerTrainingAnalyzerAtributes.speed.name = "Speed";
    playerTrainingAnalyzerAtributes.speed.value = getTrainingPoint(table[97]);

    playerTrainingAnalyzerAtributes.strength = {};
    playerTrainingAnalyzerAtributes.strength.name = "Strength";
    playerTrainingAnalyzerAtributes.strength.value = getTrainingPoint(table[102]);

    return playerTrainingAnalyzerAtributes;
}

function getTrainingPoint(element) {
    return Math.round(parseInt(element.width) * 1.6);
}

// function for getting the numerical value from the experience bar.
function getExp (string1)
{
    'use strict';
    var retval = string1.substring(0, string1.indexOf(" XP\""));
    retval = retval.substring(retval.lastIndexOf("\"")+"\"".length);
    return parseInt(retval);
}

function getCondition() {
    'use strict';
    var tabbed_pane = document.getElementsByClassName("tabbed_pane")[0];
    var row = tabbed_pane.getElementsByClassName("row1")[0];
    var b = row.getElementsByTagName("b")[0];
    return parseInt(b.innerHTML.replace(/%/g, ""));
}

//function to get the player positions
function getPlayerPlayingPositions()
{
    'use strict';
    var positions = {};

    // Prepopulate with zero values, because threre are no div elements with /positions-0.png:
    positions.GK = "0"; // GK  (always 0 or 1 and never 2 or 3)
    positions.DL = "0";
    positions.DC = "0";
    positions.SW = "0";
    positions.DR = "0";
    positions.ML = "0";
    positions.MC = "0";
    positions.AMC = "0";
    positions.DMC = "0";
    positions.MR = "0";
    positions.LW = "0";
    positions.FC = "0";
    positions.SC = "0";
    positions.RW = "0";

    // Find the correct main div element with all the positions:
    var imgs = document.getElementsByTagName("img");
    var posDivs;
    for (var i in imgs) {
        var img = imgs[i];
        if (img !== undefined && img.src.indexOf("positions-field") > 0) {
            posDivs = img.parentNode.getElementsByTagName("div");
            break;
        }
    }
    // Go thru all div elements (positions):
    for (var i in posDivs) {
        var posDiv = posDivs[i];
        if (posDiv.style !== undefined) {
            // Get position number:
            var num = posDiv.style.background.substring(posDiv.style.background.indexOf("positions-")+"positions-".length, posDiv.style.background.indexOf(".png"));
            var t = posDiv.style.top;
            var l = posDiv.style.left;

            // Fill posArray with position numbers:
            if (t == "69px" && l == "10px") positions.GK = num;
            if (t == "69px" && l == "40px") positions.DC = positions.SW = num;
            if (t == "20px" && l == "40px") positions.DL = num;
            if (t == "117px" && l == "40px") positions.DR = num;
            if (t == "69px" && l == "108px") positions.MC = positions.DMC = positions.AMC = num;
            if (t == "20px" && l == "108px") positions.ML = num;
            if (t == "117px" && l == "108px") positions.MR = num;
            if (t == "69px" && l == "185px") positions.FC = positions.SC = num;
            if (t == "20px" && l == "185px") positions.LW = num;
            if (t == "117px" && l == "185px") positions.RW = num;
        }
    }

    return positions;
}

//SQUAD PAGE
function doSquadStuff()
{
    'use strict';
    var squadStat = getSquadStats();
    createSquadHTML(squadStat);
}

function getSquadStats(){
    'use strict';
    var squadStat = {};
    //GK
    squadStat.GK = {};
    squadStat.GK.firstTeam = {};
    squadStat.GK.youthTeam = {};
    squadStat.GK.firstTeam.count = 0;
    squadStat.GK.youthTeam.count = 0;
    squadStat.GK.firstTeam.Inj = 0;
    squadStat.GK.youthTeam.Inj = 0;
    //DC
    squadStat.DC = {};
    squadStat.DC.firstTeam = {};
    squadStat.DC.youthTeam = {};
    squadStat.DC.firstTeam.count = 0;
    squadStat.DC.youthTeam.count = 0;
    squadStat.DC.firstTeam.Inj = 0;
    squadStat.DC.youthTeam.Inj = 0;
    //DL
    squadStat.DL = {};
    squadStat.DL.firstTeam = {};
    squadStat.DL.youthTeam = {};
    squadStat.DL.firstTeam.count = 0;
    squadStat.DL.youthTeam.count = 0;
    squadStat.DL.firstTeam.Inj = 0;
    squadStat.DL.youthTeam.Inj = 0;
    //DR
    squadStat.DR = {};
    squadStat.DR.firstTeam = {};
    squadStat.DR.youthTeam = {};
    squadStat.DR.firstTeam.count = 0;
    squadStat.DR.youthTeam.count = 0;
    squadStat.DR.firstTeam.Inj = 0;
    squadStat.DR.youthTeam.Inj = 0;
    //DEF
    squadStat.DEF = {};
    squadStat.DEF.firstTeam = {};
    squadStat.DEF.youthTeam = {};
    squadStat.DEF.firstTeam.count = 0;
    squadStat.DEF.youthTeam.count = 0;
    squadStat.DEF.firstTeam.Inj = 0;
    squadStat.DEF.youthTeam.Inj = 0;
    //MC
    squadStat.MC = {};
    squadStat.MC.firstTeam = {};
    squadStat.MC.youthTeam = {};
    squadStat.MC.firstTeam.count = 0;
    squadStat.MC.youthTeam.count = 0;
    squadStat.MC.firstTeam.Inj = 0;
    squadStat.MC.youthTeam.Inj = 0;
    //ML
    squadStat.ML = {};
    squadStat.ML.firstTeam = {};
    squadStat.ML.youthTeam = {};
    squadStat.ML.firstTeam.count = 0;
    squadStat.ML.youthTeam.count = 0;
    squadStat.ML.firstTeam.Inj = 0;
    squadStat.ML.youthTeam.Inj = 0;
    //MR
    squadStat.MR = {};
    squadStat.MR.firstTeam = {};
    squadStat.MR.youthTeam = {};
    squadStat.MR.firstTeam.count = 0;
    squadStat.MR.youthTeam.count = 0;
    squadStat.MR.firstTeam.Inj = 0;
    squadStat.MR.youthTeam.Inj = 0;
    //MID
    squadStat.MID = {};
    squadStat.MID.firstTeam = {};
    squadStat.MID.youthTeam = {};
    squadStat.MID.firstTeam.count = 0;
    squadStat.MID.youthTeam.count = 0;
    squadStat.MID.firstTeam.Inj = 0;
    squadStat.MID.youthTeam.Inj = 0;
    //FC
    squadStat.FC = {};
    squadStat.FC.firstTeam = {};
    squadStat.FC.youthTeam = {};
    squadStat.FC.firstTeam.count = 0;
    squadStat.FC.youthTeam.count = 0;
    squadStat.FC.firstTeam.Inj = 0;
    squadStat.FC.youthTeam.Inj = 0;
    //FL
    squadStat.FL = {};
    squadStat.FL.firstTeam = {};
    squadStat.FL.youthTeam = {};
    squadStat.FL.firstTeam.count = 0;
    squadStat.FL.youthTeam.count = 0;
    squadStat.FL.firstTeam.Inj = 0;
    squadStat.FL.youthTeam.Inj = 0;
    //FR
    squadStat.FR = {};
    squadStat.FR.firstTeam = {};
    squadStat.FR.youthTeam = {};
    squadStat.FR.firstTeam.count = 0;
    squadStat.FR.youthTeam.count = 0;
    squadStat.FR.firstTeam.Inj = 0;
    squadStat.FR.youthTeam.Inj = 0;
    //FWD
    squadStat.FWD = {};
    squadStat.FWD.firstTeam = {};
    squadStat.FWD.youthTeam = {};
    squadStat.FWD.firstTeam.count = 0;
    squadStat.FWD.youthTeam.count = 0;
    squadStat.FWD.firstTeam.Inj = 0;
    squadStat.FWD.youthTeam.Inj = 0;
    //TOTAL
    squadStat.TOTAL = {};
    squadStat.TOTAL.firstTeam = {};
    squadStat.TOTAL.youthTeam = {};
    squadStat.TOTAL.firstTeam.count = 0;
    squadStat.TOTAL.youthTeam.count = 0;
    squadStat.TOTAL.firstTeam.Inj = 0;
    squadStat.TOTAL.youthTeam.Inj = 0;

    var trs = document.querySelectorAll(".matches_row1, .matches_row2");
    for (var j in trs) {
        var tr = trs[j];
        if(tr.innerHTML !== undefined) {
            var position = tr.querySelectorAll(".def_icon, .nat_icon, .u21_icon, .u19_icon, .u17_icon")[0].innerHTML;
            var age = parseInt(tr.getElementsByClassName("tableText")[0].innerHTML); // First one [0] is age, second one [1] is rating!
            var obj;
            switch (position)
            {
                case "GK":
                    obj = squadStat.GK;
                    break;
                case "DC":
                    obj = squadStat.DC;
                    break;
                case "DL":
                    obj = squadStat.DL;
                    break;
                case "DR":
                    obj = squadStat.DR;
                    break;
                case "MC":
                    obj = squadStat.MC;
                    break;
                case "ML":
                    obj = squadStat.ML;
                    break;
                case "MR":
                    obj = squadStat.MR;
                    break;
                case "FC":
                    obj = squadStat.FC;
                    break;
                case "FL":
                    obj = squadStat.FL;
                    break;
                case "FR":
                    obj = squadStat.FR;
                    break;
            }

            if(age <= 18) {
                obj = obj.youthTeam;
            }
            else {
                obj = obj.firstTeam;
            }

            obj.count++;
            if(tr.getElementsByClassName("pl_injured").length) {
                obj.Inj++;
            }

            if(tr.getElementsByTagName("a")[0].style.color == "rgb(0, 0, 197)"){
                obj.LoanIn++;
            }else if(tr.getElementsByClassName("pl_tra").length) {
                if(tr.getElementsByClassName("pl_tra")[0].innerHTML == "T") {
                    obj.OnTR++;
                } else {
                    obj.onLoanTR++;
                }
            } else if(tr.getElementsByTagName("a")[0].style.color == "rgb(170, 170, 170)") {
                obj.LoanOut++;
                obj.count--;
            }
        }
    }

    squadStat.DEF.firstTeam.count = squadStat.DC.firstTeam.count + squadStat.DL.firstTeam.count + squadStat.DR.firstTeam.count;
    squadStat.DEF.youthTeam.count = squadStat.DC.youthTeam.count + squadStat.DL.youthTeam.count + squadStat.DR.youthTeam.count;
    squadStat.DEF.firstTeam.Inj = squadStat.DC.firstTeam.Inj + squadStat.DL.firstTeam.Inj + squadStat.DR.firstTeam.Inj;
    squadStat.DEF.youthTeam.Inj = squadStat.DC.youthTeam.Inj + squadStat.DL.youthTeam.Inj + squadStat.DR.youthTeam.Inj;
    squadStat.MID.firstTeam.count = squadStat.MC.firstTeam.count + squadStat.ML.firstTeam.count + squadStat.MR.firstTeam.count;
    squadStat.MID.youthTeam.count = squadStat.MC.youthTeam.count + squadStat.ML.youthTeam.count + squadStat.MR.youthTeam.count;
    squadStat.MID.firstTeam.Inj = squadStat.MC.firstTeam.Inj + squadStat.ML.firstTeam.Inj + squadStat.MR.firstTeam.Inj;
    squadStat.MID.youthTeam.Inj = squadStat.MC.youthTeam.Inj + squadStat.ML.youthTeam.Inj + squadStat.MR.youthTeam.Inj;
    squadStat.FWD.firstTeam.count = squadStat.FC.firstTeam.count + squadStat.FL.firstTeam.count + squadStat.FR.firstTeam.count;
    squadStat.FWD.youthTeam.count = squadStat.FC.youthTeam.count + squadStat.FL.youthTeam.count + squadStat.FR.youthTeam.count;
    squadStat.FWD.firstTeam.Inj = squadStat.FC.firstTeam.Inj + squadStat.FL.firstTeam.Inj + squadStat.FR.firstTeam.Inj;
    squadStat.FWD.youthTeam.Inj = squadStat.FC.youthTeam.Inj + squadStat.FL.youthTeam.Inj + squadStat.FR.youthTeam.Inj;
    squadStat.TOTAL.firstTeam.count = squadStat.GK.firstTeam.count + squadStat.DEF.firstTeam.count + squadStat.MID.firstTeam.count + squadStat.FWD.firstTeam.count;
    squadStat.TOTAL.youthTeam.count = squadStat.GK.youthTeam.count + squadStat.DEF.youthTeam.count + squadStat.MID.youthTeam.count + squadStat.FWD.youthTeam.count;
    squadStat.TOTAL.firstTeam.Inj = squadStat.GK.firstTeam.Inj + squadStat.DEF.firstTeam.Inj + squadStat.MID.firstTeam.Inj + squadStat.FWD.firstTeam.Inj;
    squadStat.TOTAL.youthTeam.Inj = squadStat.GK.youthTeam.Inj + squadStat.DEF.youthTeam.Inj + squadStat.MID.youthTeam.Inj + squadStat.FWD.youthTeam.Inj;

    return squadStat;
}

function createSquadHTML(squadStat){
    'use strict';
    if(squadStat.TOTAL.firstTeam.count + squadStat.TOTAL.youthTeam.count > 0) {
        var html =
            '<table class="dugToolTable">' +
               '<thead>' +
                  '<tr>' +
                     '<th>Pos</th>';

        if(squadStat.TOTAL.firstTeam.count > 0) {
            html +=  '<th>*</th>';
        }

        if(squadStat.TOTAL.youthTeam.count > 0) {
            html +=  '<th>U18</th>';
        }

        html +=      '<th>&Sigma;</th>' +
                  '</tr>' +
               '</thead>' +
               '<tbody>';

        for (var j in squadStat){
            var trClass = "";
            var posText = j;
            if(j == "TOTAL"){
                trClass = "dugToolTotalInfo active";
                posText = "&Sigma;";
            } else if(j == "DEF" || j == "MID" || j == "FWD"){
                trClass = "dugToolBetweenSum active";
                posText = j + " &Sigma;";
            } else if(j == "GK") {
                trClass = "dugToolBetweenSum active";
            }

            html += '<tr class="' + trClass + '">' +
                '<td>' + posText + '</td>';

            if(squadStat.TOTAL.firstTeam.count > 0) {
                html += '<td>' + squadStat[j].firstTeam.count + '</td>';
            }

            if(squadStat.TOTAL.youthTeam.count > 0) {
                html += '<td>' + squadStat[j].youthTeam.count + '</td>';
            }

                html += '<td>' + (squadStat[j].firstTeam.count + squadStat[j].youthTeam.count) + '</td>' +
                    '</tr>';
        }

        html+= '</tbody></table>';

        var css = '.dugToolTable td, .dugToolTable th {font-size: 10px} ' +
            '.dugToolTable {margin-bottom: 10px; background-color: transparent; border-spacing: 0; border-collapse: collapse; width: 100%; max-width: 100%;} ' +
            '.dugToolTable>thead>tr>th {vertical-align: bottom; border-bottom: 2px solid rgba(0,0,0,.06); padding: 4px; line-height: 1.42857143;} ' +
            '.dugToolTable th, .dugToolTable td {text-align: left;} ' +
            '.dugToolTable>tbody>tr:nth-of-type(odd) {background-color: #f9f9f9;} ' +
            '.dugToolTable>tbody>tr>td {padding: 4px; line-height: 1.42857143; vertical-align: top; border-top: 1px solid rgba(0,0,0,.06);} ' +
            '.dugToolTable>tbody>tr:hover {background-color: #f5f5f5;} ' +
            '.dugToolTable>tbody>tr.active td{background-color: #f5f5f5;} ' +
            '.dugToolTable>tbody>tr.active:hover>td {background-color: #e8e8e8;} ' +
            '.dugToolTable>tbody>tr.dugToolBetweenSum, .dugToolTable>tbody>tr.dugToolTotalInfo {font-weight: bold;}';

        // Paint red if it's monday and there are more than 38 players in your main squad:
        if (new Date().getDay() == 1 && (squadStat[j].firstTeam.count + squadStat[j].youthTeam.count - squadStat.TOTAL.firstTeam.Inj - squadStat.TOTAL.youthTeam.Inj) > 38 && location.href.indexOf("youth") < 0) {
            css += '.dugToolTable>tbody>tr.dugToolTotalInfo td {background-color: #f2dede;}';
        }

        createDugtoolHtml(html, css);
    }
}

function doFinancesStuff() {
    'use strict';
    var financesCalculations = getFinancesCalculations();
    createFinanceHTML(financesCalculations);
}

function createFinanceHTML(financesCalculations) {
    var html =
        '<div class="tooltip financeLegend">&#9432' +
           '<span class="tooltiptext"><b><u>Maint./Misc.</u></b> - difference between maintenance and miscellaneous per week<br>' +
              '<b><u>Expenses</u></b> - all expenses and revenue per week (if the value is negative you are doing a loss)<br>' +
              '<b><u>Final balance</u></b> - expected balance at the end of the season<br>' +
           ' </span>' +
        '</div>' +
        '<p class="weekInfo"> Week: ' + financesCalculations.currentWeek + '</p>' +
        '<table class="dugToolTable">' +
           '<tbody>' +
               '<tr>' +
                 '<td>Gate Income:</td>' +
                 '<td>' + Math.round(financesCalculations.gateIncomeWeek).toLocaleString() + ' ' + financesCalculations.currency + '</td>' +
               '</tr>' +
               '<tr>' +
                 '<td style="vertical-align: middle;">Sponsorship:</td>' +
                 '<td>' + Math.round(financesCalculations.sponsorshipWeek/7).toLocaleString() + ' ' + financesCalculations.currency + '<br>' + Math.round(financesCalculations.sponsorshipWeek).toLocaleString() + ' ' + financesCalculations.currency + '</td>' +
               '</tr>' +
               '<tr class="dugToolmaintenanceOtherLoss">' +
                 '<td>Maint./Misc.:</td>' +
                 '<td>' + Math.round(financesCalculations.maintenanceOtherWeek).toLocaleString() + ' ' + financesCalculations.currency + '</td>' +
               '</tr>' +
               '<tr class="dugToolExpensesLoss">' +
                 '<td>Expenses:</td>' +
                 '<td>' + Math.round(financesCalculations.expensesWeek).toLocaleString() + ' ' + financesCalculations.currency + '</td>' +
               '</tr>' +
               '<tr class="dugToolPositionHighlight dugToolTotalLoss">' +
                 '<td>Final balance:</td>' +
                 '<td>' + Math.round(financesCalculations.finalMoney).toLocaleString() + ' ' + financesCalculations.currency + '</td>' +
              '</tr>' +
           '</tbody>' +
        '</table>';

    var css = '.dugToolTable td, .dugToolTable th {font-size: 10px} ' +
        '.dugToolTable {margin-bottom: 10px; background-color: transparent; border-spacing: 0; border-collapse: collapse; width: 100%; max-width: 100%;} ' +
        '.dugToolTable>thead>tr>th {vertical-align: bottom; border-bottom: 2px solid rgba(0,0,0,.06); padding: 4px; line-height: 1.42857143;} ' +
        '.dugToolTable th, .dugToolTable td {text-align: right;} ' +
        '.dugToolTable>tbody>tr:nth-of-type(odd) {background-color: #f9f9f9;}' +
        '.dugToolTable>tbody>tr>td {padding: 4px; line-height: 1.42857143; vertical-align: top; border-top: 1px solid rgba(0,0,0,.06);}' +
        '.dugToolTable>tbody>tr:hover {background-color: #f5f5f5;}' +
        '.dugToolTable>tbody>tr.active td{background-color: #f5f5f5;}' +
        '.dugToolTable>tbody>tr.active:hover>td {background-color: #e8e8e8;}' +
        '.dugToolTable>tbody>tr.dugToolPositionHighlight {font-weight: bold;}'+
        '.weekInfo {font-size: 12px;}' +
        '.tooltip {position: absolute; display: inline-block;}' +
        '.tooltip .tooltiptext {visibility: hidden; width: 150px; background-color: #555; color: #fff; text-align: left; padding: 5px; font-size: 9px; border-radius: 6px; position: absolute; z-index: 1; bottom: 125%; right: -4px; margin-left: -65px; opacity: 0; transition: opacity 0.3s; line-height: 11px;}' +
        '.tooltip .tooltiptext::after {content: ""; position: absolute; top: 100%; right: 6px; margin-left: -5px; border-width: 5px; border-style: solid; border-color: #555 transparent transparent transparent;}' +
        '.tooltip:active .tooltiptext {visibility: visible; opacity: 1;}' +
        '.tooltip.financeLegend {left: 84%; cursor: pointer;}';

    if(financesCalculations.maintenanceOtherWeek < 0){
        css += '.dugToolTable>tbody>tr.dugToolmaintenanceOtherLoss td {background-color: #f2dede;}';
    }

    if(financesCalculations.expensesWeek < 0){
        css += '.dugToolTable>tbody>tr.dugToolExpensesLoss td {background-color: #f2dede;}';
    }

    if(financesCalculations.finalMoney < 0){
        css += '.dugToolTable>tbody>tr.dugToolTotalLoss td {background-color: #f2dede;}';
    }
    createDugtoolHtml(html, css);
}

function getFinancesCalculations(){
    'use strict';
    var financesValues = getFinancesValues();
    var seasonLength = 20;
    var weeklySponsorshipCons = [1.053150934, 1.050468487, 1.04804379, 1.045841395, 1.043832072, 1.041991498, 1.040299271, 1.038738152, 1.037293471, 1.035952672, 1.034704936, 1.033540902, 1.032452418,
                                 1.031432362, 1.030474477, 1.029573248, 1.028723792, 1.027921773, 1.027163325, 1.026444991, 1.025763671, 1.025116576, 1.02450119, 1.023915238, 1.023356658, 1.022823575,
                                 1.022314284, 1.021827225, 1.021360974, 1.020914226, 1.020485781]; // 31 weeks
    var weekday = [5, 6, 0, 1, 2, 3, 4]; //Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday

    var financesCalculations = {};
    financesCalculations.currency = parseFinancesCurrency(document.getElementsByTagName("table")[4].getElementsByTagName("td")[1]);
    financesCalculations.gateIncomeWeek = 0;
    financesCalculations.maintenanceOtherWeek = 0;
    financesCalculations.expensesWeek = -financesValues.expenses.playersWages - financesValues.expenses.staffWages; // total wages/week
    financesCalculations.currentWeek = Math.round((financesValues.budget.playersWages + financesValues.budget.staffWages) / financesCalculations.expensesWeek); // estimated week

    if(financesCalculations.currentWeek > seasonLength){
        seasonLength = financesCalculations.currentWeek + 1;
    }

    if(financesCalculations.currentWeek > 0){
        financesCalculations.gateIncomeWeek = financesValues.expenses.gateincome / financesCalculations.currentWeek;
        financesCalculations.maintenanceOtherWeek = (financesValues.expenses.miscellaneous + financesValues.expenses.maintenance) / financesCalculations.currentWeek;
    }

    financesCalculations.sponsorshipWeek = (financesValues.expenses.sponsorship * (weeklySponsorshipCons[financesCalculations.currentWeek] + (((weeklySponsorshipCons[financesCalculations.currentWeek + 1] - weeklySponsorshipCons[financesCalculations.currentWeek]) / 7) * weekday[new Date().getDay()]))) - financesValues.expenses.sponsorship;
    financesCalculations.expensesWeek += financesCalculations.gateIncomeWeek + financesCalculations.sponsorshipWeek + financesCalculations.maintenanceOtherWeek;

    financesCalculations.finalMoney = financesValues.currentBalance + (financesCalculations.expensesWeek * (seasonLength - financesCalculations.currentWeek));

    return financesCalculations;
}

function getFinancesValues(){
    'use strict';
    var financesValues = {};
    financesValues.budget = {};
    financesValues.expenses = {};

    var table = document.getElementsByTagName("table");
    var tdPlayersWages= table[1].getElementsByTagName("td");
    financesValues.budget.playersWages = parseFinancesValue(tdPlayersWages[1]);
    financesValues.expenses.playersWages = parseFinancesValue(tdPlayersWages[2]);

    var tdStaffWages= table[2].getElementsByTagName("td");
    financesValues.budget.staffWages = parseFinancesValue(tdStaffWages[1]);
    financesValues.expenses.staffWages = parseFinancesValue(tdStaffWages[2]);

    financesValues.expenses.gateincome = parseFinancesValue(table[4].getElementsByTagName("td")[1]);
    financesValues.expenses.sponsorship = parseFinancesValue(table[6].getElementsByTagName("td")[1]);
    financesValues.expenses.maintenance = parseFinancesValue(table[8].getElementsByTagName("td")[1]);
    financesValues.expenses.miscellaneous = parseFinancesValue(table[9].getElementsByTagName("td")[1]);
    financesValues.currentBalance = parseFinancesValue(table[10].getElementsByTagName("td")[1]);

    return financesValues;
}

function parseFinancesValue(value){
    'use strict';
    return parseInt(value.innerHTML.replace("color: #aa0000", "").replace(/[,.]/g, "").match(/-?\d+/)[0]);
}

function parseFinancesCurrency(value){
    'use strict';
    return value.innerHTML.replace("color: #aa0000", "").replace(/[,.]|\s|-?\d+/g, "");
}

function createDugtoolHtml(content, css){
    'use strict';
    var dogtoolContent = document.createElement("div");
    dogtoolContent.className="dogtoolWrapper";
    document.body.appendChild(dogtoolContent);
    document.getElementById("content_container").appendChild(dogtoolContent);

    // begin display box
    dogtoolContent.innerHTML =
        '<div class="dogtoolContent">' +
           '<p class="dugtooltitle">' +
              '<a target="_blank" href="' + FORUMLINK + '">' + APPNAME + '</a>' +
           '</p>' +
           content +
           '<p class="dugtoolfooter">' +
              '<a target="_blank" href="/clubinfo/none/clubid/65315">Developed by FlyBoy</a>'+
           '</p>'+
           //'<p>'+
              '<form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">' +
                 '<input type="hidden" name="cmd" value="_s-xclick">' +
                 '<input type="hidden" name="hosted_button_id" value="85CT44ERNNPC2">' +
                 '<input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!" style="height: 16px;">' +
                 '<img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">' +
               '</form>' +
           //'</p>'+
        '</div>';

    if(css === undefined){
        css = "";
    }

    addGlobalStyle('.dogtoolWrapper {position: absolute; top: -50px; right: -167px; width: 170px; z-index: 1; text-align: center;} ' +
                   '.dogtoolContent {background-color: #EEEEEE; box-shadow: 0px 0px 20px -5px grey; border-radius: 0px 10px 10px 0px; padding: 5px; width: 170px; position: fixed;} ' +
                   '.dugtooltitle {text-align: center; padding: 4px; font-weight: bold; font-size: 12px; border-radius: 0px 10px 0px 0px;} ' +
                   '.dugtoolfooter {text-align: center; padding: 3px; font-weight: bold; font-size: 8px; border-radius: 0px 0px 10px 0px; margin: 0px;} ' +
                   '.dugtoolfooter a {font-size: 8px;}' +
                   '.hide {display: none;}' + css);
}

function addGlobalStyle(css)
{
    'use strict';
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}