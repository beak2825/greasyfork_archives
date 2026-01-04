// ==UserScript==
// @name         UJS-Ported Luck Graphs
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @description  Script will recreate the luck graphs found in the Flash version, into the UJS version
// @author       JustinR17
// @match        https://www.warzone.com/MultiPlayer?GameID=*
// @match        https://www.warzone.com/SinglePlayer?*
// @downloadURL https://update.greasyfork.org/scripts/390496/UJS-Ported%20Luck%20Graphs.user.js
// @updateURL https://update.greasyfork.org/scripts/390496/UJS-Ported%20Luck%20Graphs.meta.js
// ==/UserScript==
var hasInitiatedGraphUI = false;
var captureChanceGraph;
var armiesKilledGraph;

function checkValidInput() {
    var defendingArmies = Number(document.getElementById("defendingArmies").value);
    var luckModifier = Number(document.getElementById("luckModifier").value) / 100.0;
    var attackKillRate = Number(document.getElementById("attackKillRate").value) / 100.0;
    var defenseKillRate = Number(document.getElementById("defenseKillRate").value) / 100.0;

    if (defendingArmies < 0 || luckModifier < 0 || luckModifier > 1 || attackKillRate <= 0 || attackKillRate > 1 || defenseKillRate <= 0 || defenseKillRate > 1) {
        return false;
    } else {
        return true;
    }
}

function doCalculate() {
    if (!hasInitiatedGraphUI) {
        hasInitiatedGraphUI = true;
        initiateGraphUI();
    }
    if (checkValidInput()) {
        makeGraph();
    } else {
        alert("UJS-Ported Flash Graphs -- ENTER CORRECT INPUT!");
    }
}

function getButton() {
    return '<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ujs_WRAnalyzeAttackDialog" id="ujs_WRAnalyzeAttackBtn">Flash Analyze Attack</button>';
}

function initiateButtonUI() {
    var wrButton = document.createElement("div");
    wrButton.innerHTML = getButton();
    var navBox = document.getElementsByClassName("navbar-nav")[0];
    navBox.prepend(wrButton);

    var el = document.getElementById("ujs_WRAnalyzeAttackBtn");
    if (el.addEventListener) {
        el.addEventListener("click", doCalculate, false);
    } else if (el.attachEvent) {
        el.attachEvent('onclick', doCalculate);
    }
}

function initiateGraphUI() {
    var wrAnalyzeWindow = document.createElement("div");
    var mainWindow = document.getElementById("ujs_Live");
    mainWindow.appendChild(wrAnalyzeWindow);
    wrAnalyzeWindow.outerHTML = getAnalyzeWindow();
    wrAnalyzeWindow.style.margin = "2%";
    wrAnalyzeWindow.style.display = "none";

    var items = document.querySelectorAll(".ujs_wrItem");
    for (var i = 0; i < items.length; i++) {
        items[i].style.color = "white";
        items[i].style.backgroundColor = "black";
    }

    var graphs = document.querySelectorAll(".ujs_wrGraph");
    for (var j = 0; j < graphs.length; j++) {
        graphs[j].style.color = "black";
        graphs[j].style.backgroundColor = "white";
    }

    var el = document.getElementById("ujs_wrCalculateBtn");
    if (el.addEventListener) {
        el.addEventListener("click", doCalculate, false);
    } else if (el.attachEvent) {
        el.attachEvent('onclick', doCalculate);
    }

    window.onkeypress = function(event) {
        if (event.keyCode == 13) {
            doCalculate();
        }
    };
}

(function() {
    'use strict';
    console.log("Running UJS Graph Script by JustinR17");
    initiateButtonUI();

    document.addEventListener("mousewheel", function(event){
        if(document.activeElement.type === "number"){
            document.activeElement.blur();
        }
    });
})();

function getXDataValues(xyDataValues) {
    var values = [];
    for (var i = 0; i < xyDataValues.length; i++) {
        values.push(xyDataValues[i].x);
    }
    return values;
}

function getYDataValues(xyDataValues) {
    var values = [];
    for (var i = 0; i < xyDataValues.length; i++) {
        values.push(xyDataValues[i].y);
    }
    return values;
}

function makeGraph() {
    var xyDataValues = getCaptureChanceData();
    var xDataValues = getXDataValues(xyDataValues);

    var captureChance = document.getElementById('ujs_CaptureChanceGraph');
    if (captureChanceGraph) {
        captureChanceGraph.destroy();
    }
    captureChanceGraph = new Chart(captureChance, {
        type: 'line',
        data: {
            labels: xDataValues,
            datasets: [
                {
                    data: xyDataValues,
                    label: "Capture Chance",
                    borderColor: "#3e95cd"
                }
            ]
        },
        xAxisId: "Number of Attacking Armies",
        yAxisId: "Percent chance of taking",
        options: {
            legend: false,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: 100
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Percent Chance of Taking Territory"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Number of Attacking Armies"
                    }
                }]
            }
        }
    });

    var xyOffenseDataValues = getAttackerArmiesKilledData();
    var xyDefenseDataValues = getDefenderArmiesKilledData();
    var xArmiesDataValues = getXDataValues(xyDefenseDataValues);

    var armiesKilled = document.getElementById('ujs_ArmiesKilledGraph');
    if (armiesKilledGraph) {
        armiesKilledGraph.destroy();
    }
    armiesKilledGraph = new Chart(armiesKilled, {
        type: 'line',
        data: {
            labels: xArmiesDataValues,
            datasets: [
                {
                    data: xyOffenseDataValues,
                    label: "Attackers Lost",
                    borderColor: "#3e95cd"
                },{
                    data: xyDefenseDataValues,
                    label: "Defenders Lost",
                    borderColor: "#8e5ea2"
                }
            ]
        },
        xAxisId: "Number of Attacking Armies",
        yAxisId: "Armies Lost",
        showLine: true,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true,
                        min: 0,
                        max: Number(document.getElementById("defendingArmies").value)
                    },
                    scaleLabel: {
                        display: true,
                        labelString: "Armies Lost"
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: "Number of Attacking Armies"
                    }
                }]
            }
        }
    });
}

function round(value, decimals) {
    return Number(Math.round(value +'e'+ decimals) +'e-'+ decimals).toFixed(decimals);
}

function attackSimulation(attackingArmies, attackKillRate, luckModifier, isWeightedRandom, defendingArmies) {
    var analysis = [];
    var total = 0;
    var squaredTotal = 0;
    var simulations = 1000.0;
    for (var i = 0; i < 1000; i++) {
        var tossSuccesses = 0;
        for (var j = 0; j < attackingArmies; j++) {
            var rng = Math.random();
            if (rng < attackKillRate) {
                tossSuccesses++;
            }
        }

        var expectedKills = attackingArmies * attackKillRate;
        var armiesKilled = tossSuccesses * luckModifier + expectedKills * (1.00 - luckModifier);

        if (isWeightedRandom) {
            armiesKilled = round(armiesKilled, 2);
        } else {
            armiesKilled = round(armiesKilled, 0);
        }
        var percentCapture;
        if (armiesKilled - defendingArmies < -1) {
            percentCapture = 0.0;
        } else if (armiesKilled > defendingArmies || armiesKilled == defendingArmies) {
            percentCapture = 100.0;
        } else {
            percentCapture = (armiesKilled % 1.0) * 100.0;
        }
        total += Number(round(percentCapture, 2));
        squaredTotal += Math.pow(tossSuccesses - expectedKills, 2);
    }
    analysis.push(total / simulations);
    analysis.push(Math.sqrt(squaredTotal / simulations));

    return analysis;
}

function getCaptureChanceData() {
    var data = [];
    var defendingArmies = Number(document.getElementById("defendingArmies").value);
    var attackKillRate = Number(document.getElementById("attackKillRate").value) / 100.0;
    var isWeightedRandom = document.getElementById("ujs_wrWRRadio").checked;
    var luckModifier = Number(document.getElementById("luckModifier").value) / 100.0;

    var pivot;
    var pivotAnalysis;
    if (luckModifier == 0) {
        pivot = Number(round(defendingArmies / attackKillRate, 0));
    } else {
        pivot = Number(round((defendingArmies - defendingArmies * (1.00 - luckModifier)) / (luckModifier * attackKillRate), 0));
    }
    pivotAnalysis = attackSimulation(pivot, attackKillRate, luckModifier, isWeightedRandom, defendingArmies);
    var spread = Number(round(pivotAnalysis[1], 0)) < 3 ? 3 : Number(round(pivotAnalysis[1], 0));

    for (var i = pivot - spread; i < pivot + spread + 1; i++) {
        var percentCapture = attackSimulation(i, attackKillRate, luckModifier, isWeightedRandom, defendingArmies);
        var temp = {x: i, y: percentCapture[0]};
        data.push(temp);
    }
    return data;
}

function getMaxTurns(defenders, attackKillRate) {
    var maxTurns = defenders / attackKillRate + 5;
    return maxTurns;
}

function getAttackerArmiesKilledData() {
    var data = [];

    var attackKillRate = Number(document.getElementById("attackKillRate").value) / 100.0;
    var defenseKillRate = Number(document.getElementById("defenseKillRate").value) / 100.0;
    var isWeightedRandom = document.getElementById("ujs_wrWRRadio").checked;

    var defenders = Number(document.getElementById("defendingArmies").value);
    var maxTurns = getMaxTurns(defenders, attackKillRate);
    var maxAttackersKilled = defenders * defenseKillRate;

    for (var i = 0; i < maxTurns; i++) {
        var armiesKilled = maxAttackersKilled;
        if (isWeightedRandom) {
            armiesKilled = round(armiesKilled, 2);
        } else {
            armiesKilled = round(armiesKilled, 0);
        }

        if (i < maxAttackersKilled) {
            armiesKilled = i;
        }
        var temp = {x: i, y: armiesKilled};
        data.push(temp);
    }

    return data;
}

function getDefenderArmiesKilledData() {
    var data = [];

    var attackKillRate = Number(document.getElementById("attackKillRate").value) / 100.0;
    var luckModifier = Number(document.getElementById("luckModifier").value) / 100.0;
    var isWeightedRandom = document.getElementById("ujs_wrWRRadio").checked;

    var defenders = Number(document.getElementById("defendingArmies").value);
    var maxTurns = getMaxTurns(defenders, attackKillRate);

    for (var i = 0; i < maxTurns; i++) {
        var defenderArmiesKilled = round(i * attackKillRate, 0) * luckModifier + i * attackKillRate * (1.00 - luckModifier);
        if (isWeightedRandom) {
            defenderArmiesKilled = round(defenderArmiesKilled, 2);
        } else {
            defenderArmiesKilled = round(defenderArmiesKilled, 0);
        }

        if (defenderArmiesKilled > defenders) {
            defenderArmiesKilled = defenders;
        }

        var temp = {x: i, y: defenderArmiesKilled};
        data.push(temp);
    }

    return data;
}

function getAnalyzeWindow() {
    return `
    <div class="modal fade" id="ujs_WRAnalyzeAttackDialog">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content ujs_wrItem" id="ujs_WRAnalyzeAttackDialog">
                <div class="modal-header modal-title ujs_wrItem" id="ujs_wrAnalyzeTitle">
                    Flash-Style Analyze Attack by JustinR17
                </div>
                <div class="modal-body ujs_wrItem" id="ujs_wrSettingsPanel">
                    <div class="ujs_wrItem" id="ujs_wrDefendingArmies">
                        Defending Armies:&nbsp;<input class="ujs_wrInput" type="number" min="1" step="1" id="defendingArmies" value="10">
                    </div>
                    <div class="ujs_wrItem" id="ujs_wrKillRates">
                        Attacking Kill Rate (%):&nbsp;<input class="ujs_wrInput" type="number" min="1" max ="100" step="1" id="attackKillRate" value="60"><br>
                        Defending Kill Rate (%):&nbsp;<input class="ujs_wrInput" type="number" min="1" max ="100" step="1" id="defenseKillRate" value="70"><br>
                    </div>
                    <div class="ujs_wrItem" id="ujs_wrLuckSettings">
                        Luck Modifier (%):&nbsp;<input class="ujs_wrInput" type="number" min="0" max ="100" step="1" id="luckModifier" value="16">
                    </div>
                    <div class="ujs_wrItem" id="ujs_wrRoundMode">
                        <div class="form-check-inline ujs_wrItem">
                            Rounding Mode:
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input" id="ujs_wrWRRadio" name="optradio" checked>Weighted Random
                            </label>
                        </div>
                        <div class="form-check-inline ujs_wrItem">
                            <label class="form-check-label">
                                <input type="radio" class="form-check-input" id="ujs_wrSRRadio" name="optradio">Straight Round
                            </label>
                        </div>
                    </div><br>
                    <div class="ujs_wrItem" id="ujs_wrGraphContainer">
                        <div class="ujs_wrGraph" id="ujs_wrCaptureChanceContainer"
                            style="left: 10px; bottom: 10px; transform-origin: 247px -105px;  background-color: white;">
                            <br><h4 class="ujs_wrGraph"  style="text-align:center; color: black">Capture Percent Chance Graph</h4><br>
                            <canvas class="ujs_wrGraph" id="ujs_CaptureChanceGraph" width="600" height="300"></canvas>
                        </div>
                        <br>
                        <div class="ujs_wrGraph" id="ujs_wrArmiesKilledContainer"
                            style="left: 10px; bottom: 10px; transform-origin: 247px -105px; background-color: white;">
                            <br><h4 class="ujs_wrGraph" style="text-align:center; color: black">Armies Lost Graph</h4>
                            <canvas class="ujs_wrGraph" id="ujs_ArmiesKilledGraph" width="600" height="300"></canvas>
                        </div>
                    </div>
                    <div class="ujs_wrItem" id="ujs_wrCalculate" style="text-align: center; margin: 2%; display: block">
                        <button class="btn btn-primary" id="ujs_wrCalculateBtn">Recalculate</button>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" data-dismiss="modal" id="ujs_wrCloseButton" style="background-color: blue">Close</button>
                </div>
            </div>
        </div>
    </div>
    `;
}