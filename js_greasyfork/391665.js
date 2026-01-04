// ==UserScript==
// @name         Karen
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @description  OGame Automated Inactives Farmer
// @author       tanavast
// @match        https://*.ogame.gameforge.com/game/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391665/Karen.user.js
// @updateURL https://update.greasyfork.org/scripts/391665/Karen.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let version = "2.2.2";
    let timeWaiting = getTimeToWaitBasedOnKarenAction();

    if ($("#tanavastUIHolder").length == 0)
        $("body").append(`<div id="tanavastUIHolder" align="right" style="position: fixed; top:3%; right:3%; z-index: 9999;"></div>`);

    showLastActions();
    showUI();
    setTimeout(triggerKaren, timeWaiting + Math.random() * 1000);
    //$("#myPlanets .smallplanet").each( function(index, value){ console.log($(this).attr("id"), $(this).find(".planet-koords").text()) });
    function triggerKaren() {
        var karenActions = {
            probeCurrentSystem: probeCurrentSystem,
            waitForProbesToFinish: waitForProbesToFinish,
            farmProbedPlanets: farmProbedPlanets,
            fleetDispatch: fleetDispatch,
            goToMessagesAfterDispatch: goToMessagesAfterDispatch,
            waitForFreeSlots: waitForFreeSlots
        };
        if (!sessionStorage.KarenState && location.search.search(/^\?page=ingame&component=galaxy/) != -1) {
            var controlCenterSystem = parseInt($("#system_input").val(), 10);
            var controlCenterCoords = "";
            var controlCenterLink = "";

            if ($(".planet-koords.moon_active").text() != "") {
                controlCenterCoords = `${$(".planet-koords.moon_active").text()}M`;
                controlCenterLink = $(".moonlink.active").attr("href");
            } else {
                controlCenterCoords = `${$(".planetlink.active .planet-koords").text()}P`;
                controlCenterLink = $(".planetlink.active").attr("href");
            }

            var karenState = {
                controlCenterCoords: controlCenterCoords,
                controlCenterLink: controlCenterLink,
                currentSystemRight: controlCenterSystem,
                currentSystemLeft: controlCenterSystem == 1 ? 499 : controlCenterSystem - 1,
                numberOfSystemsExploredSoFar: 0,
                numberOfSystemsExploredInThisDirection: 0,
                currentDirection: "right",
                switchDirectionEvery: 10,
                totalSystemsToExplore: 499,
                minimumLootToFarm: 200000,
                probeCount: 15,
                allowedProbesToSend: 0,
                startedProbing: false,
                slotsToLeaveFree: 1,
                expectedLootUntilNow: 0,
                planetsAttackedSoFar: 0,
                karenAction: "probeCurrentSystem",
                karenIsRunning: false,
                coordinatesToFarm: [],
                coordinatesProbed: [],
                showStats: true,
                showLogs: false
            };
            sessionStorage.KarenState = JSON.stringify(karenState);
            showUI();
            logAction({
                karenAction: "probeCurrentSystem",
                actionTime: new Date(),
                description: "Karen will now begin running for the first time."
            });
        }
        if (sessionStorage.KarenState) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            if (karenState.karenIsRunning) {
                if (karenState.controlCenterCoords != `${$(".planet-koords.moon_active").text()}M` &&
                    karenState.controlCenterCoords != `${$(".planetlink.active .planet-koords").text()}P`)
                    location.href = karenState.controlCenterLink;
                else
                    karenActions[karenState.karenAction]();
            }
            else
                console.log("Karen is stopped.")
        }
    }

    function toggleKaren() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        let minLoot = parseInt($("#minimumLoot").val());
        let slotsFree = parseInt($("#slotsfree").val());
        if (!(isNaN(minLoot) || isNaN(slotsFree)) && !karenState.karenIsRunning) {
            karenState.karenIsRunning = true;
            karenState.minimumLootToFarm = minLoot;
            karenState.slotsToLeaveFree = slotsFree;
            console.log("Karen is now running")
        } else
            karenState.karenIsRunning = false;
        sessionStorage.KarenState = JSON.stringify(karenState);
        location.href = location.href;
    }

    function toggleKarenStats() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        karenState.showStats = !karenState.showStats;
        sessionStorage.KarenState = JSON.stringify(karenState);
        showUI();
    }

    function toggleKarenLogs() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        karenState.showLogs = !karenState.showLogs;
        sessionStorage.KarenState = JSON.stringify(karenState);
        showLastActions();
        showUI();
    }

    function resetKaren() {
        if ($("#resetKaren").attr("confirm")) {
            $("#resetKaren").html("<b>GOODBYE CRUEL WORLD</b>");
            sessionStorage.removeItem("KarenState");
            sessionStorage.removeItem("KarenLogs");
            location.href = `/game/index.php?page=ingame&component=overview`;
        } else {
            $("#resetKaren").html("<b>Sure about that?</b>");
            $("#resetKaren").attr("confirm", "1");
        }
    }

    function showLastActions() {
        if ($("#karenLogsTable").length > 0) $("#karenLogsTable").remove();
        if (sessionStorage.KarenState && sessionStorage.KarenLogs && JSON.parse(sessionStorage.KarenState).showLogs) {
            var karenLogs = JSON.parse(sessionStorage.KarenLogs);

            let logs = `
                <table style="border: 3px solid #5C3063;
                border-radius: 8px;background-color: rgba(0, 0, 0,.5);" id="karenLogsTable">
                    <caption><b>Latest Actions</b></caption>
                    <tbody> `;
            let logCount = karenLogs.length >= 5 ? 5 : karenLogs.length
            for (var i = 0; i < logCount; i++) {
                logs += `
                        <tr>
                            <td style="padding: 2px;"><b>${karenLogs[i].actionTime}</b></td>
                            <td style="padding: 2px;"><b>${karenLogs[i].description}</b></td>
                        </tr>
                `;
            }
            logs += `
                    </tbody>
                </table>
            `;
            $("#tanavastUIHolder").append(logs);

        }
    }

    function showUI() {
        if (sessionStorage.KarenState) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            if ($("#karenUITable").length > 0) $("#karenUITable").remove();
            let ui = `
                    <table style="border: 3px solid #5C3063;
                    border-radius: 8px;background-color: rgba(0, 0, 0,.8);" id="karenUITable">
                        <caption style="color:${karenState.karenIsRunning ? "#00c714" : "#ff3b0a"}"><b>Karen V${version}</b></caption>
                        <tbody> `;
            if (karenState.showStats)
                ui += `
                            <tr>
                                <td style="padding: 5px;"><b>Control Center</b></td>
                                <td style="padding: 5px;"><b>${karenState.controlCenterCoords}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Action</b></td>
                                <td style="padding: 5px;"><b>${karenState.karenAction}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Direction Farming</b></td>
                                <td style="padding: 5px;"><b>${karenState.currentDirection}</b></td>
                            </tr>
                            <tr>    
                                <td style="padding: 5px;"><b>Current System Left</b></td>
                                <td style="padding: 5px;"><b>${karenState.currentSystemLeft}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Current System Right</b></td>
                                <td style="padding: 5px;"><b>${karenState.currentSystemRight}</b></td>
                            </tr>
                            <tr class="progressInfo">
                                <td style="padding: 5px;"><b>Systems Explored</b></td>
                                <td style="padding: 5px;"><b>${karenState.numberOfSystemsExploredSoFar}</b></td>
                            </tr>
                            <tr class="progressInfo"> 
                                <td style="padding: 5px;"><b>Planets Attacked</b></td>
                                <td style="padding: 5px;"><b>${karenState.planetsAttackedSoFar}</b></td>
                            </tr>
                            <tr class="progressInfo">
                                <td style="padding: 5px;"><b>Expected Loot</b></td>
                                <td style="padding: 5px;"><b>${karenState.expectedLootUntilNow}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Minimum Loot</b></td>
                                ${!karenState.karenIsRunning
                        ? `<td style="padding: 5px;"><input style="height: 16px" id="minimumLoot" type="text" value="${karenState.minimumLootToFarm}" /></td>` :
                        `<td style="padding: 5px;"><b>${karenState.minimumLootToFarm}</b></td>`}
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Slots left free</b></td>
                                ${!karenState.karenIsRunning
                        ? `<td style="padding: 5px;"><input style="height: 16px" id="slotsfree" type="text" value="${karenState.slotsToLeaveFree}" /></td>` :
                        `<td style="padding: 5px;"><b>${karenState.slotsToLeaveFree}</b></td>`}
                            </tr>
                            `;
            ui += `
                            <tr>
                                <td style="padding: 5px;color:#d195db;cursor: pointer;" align="center" id="toggleKaren"><b>${karenState.karenIsRunning ? "STOP" : "START"} KAREN</b></td>
                                <td style="padding: 5px;color:#ff001e;cursor: pointer;" align="center" id="resetKaren"><b>RESET</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;color:#d195db;cursor: pointer;" align="center" class="toggleKarenStats" ><b>${karenState.showStats ? "HIDE" : "SHOW"} STATS</b></td>
                                <td style="padding: 5px;color:#d195db;cursor: pointer;" align="center" class="toggleKarenLogs"><b>${karenState.showLogs ? "HIDE" : "SHOW"} LOGS</b></td>
                            </tr>
                        </tbody>
                    </table>`;
            $("#tanavastUIHolder").append(ui);
            $("#toggleKaren").on("click", toggleKaren);
            $("#resetKaren").on("click", resetKaren);
            $(".toggleKarenStats").on("click", toggleKarenStats);
            $(".toggleKarenLogs").on("click", toggleKarenLogs);
        }
    }

    function probeCurrentSystem() {
        if (location.search.search(/^\?page=ingame&component=galaxy/) == -1) {
            location.href = `/game/index.php?page=ingame&component=galaxy`;
            return;
        }
        showLastActions();
        showUI();
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (karenState.numberOfSystemsExploredSoFar <= karenState.totalSystemsToExplore) {

            if (karenState.numberOfSystemsExploredInThisDirection >= karenState.switchDirectionEvery) {
                karenState.currentDirection = karenState.currentDirection == "right" ? "left" : "right";
                karenState.numberOfSystemsExploredInThisDirection = 0;
            }

            var systemToGoTo = 0;
            switch (karenState.currentDirection) {
                case "right":
                    $("#system_input").val(karenState.currentSystemRight);
                    submitForm();
                    systemToGoTo = karenState.currentSystemRight;
                    break;
                case "left":
                    $("#system_input").val(karenState.currentSystemLeft);
                    submitForm();
                    systemToGoTo = karenState.currentSystemLeft;
                    break;
            }

            if (karenState.coordinatesToFarm.length == 0) {
                karenState.numberOfSystemsExploredInThisDirection++;
                karenState.numberOfSystemsExploredSoFar++;
            }

            sessionStorage.KarenState = JSON.stringify(karenState);

            logAction({
                karenAction: "probeCurrentSystem",
                actionTime: new Date(),
                description: `Navigating to System ${systemToGoTo}`
            });

            let galaxyloadingInterval = setInterval(() => {
                $("#galaxyLoading").each(function () {
                    $.each(this.attributes, function (i, a) {
                        if (a.name == "style" && a.value == "display: none;") {
                            clearInterval(galaxyloadingInterval);
                            setTimeout(function () {
                                searchForInactives();
                                sendProbesAtInactives();
                            }, 200);
                        }
                    })
                })
            }, (200));

        } else {
            if (karenState.startedProbing) {
                karenState.startedProbing = false;
                karenState.allowedProbesToSend = 0;
                karenState.karenAction = "waitForProbesToFinish";
                sessionStorage.KarenState = JSON.stringify(karenState);
                logAction({
                    karenAction: "probeCurrentSystem",
                    actionTime: new Date(),
                    description: `Navigating to Fleet Movement to wait for probes to finish.`
                });
                location.href = `/game/index.php?page=ingame&component=movement`;
            }
            else {
                var galaxy = parseInt($("#galaxy_input").val(), 10);
                console.log(`Karen finished farming Galaxy ${galaxy} searching a total of ${karenState.totalSystemsToExplore} systems.`);
                console.log(`${karenState.planetsAttackedSoFar} planets were attacked`);
                console.log(`Total loot from esponiage reports: ${karenState.expectedLootUntilNow}`);
                logAction({
                    karenAction: "probeCurrentSystem",
                    actionTime: new Date(),
                    description: `Karen has finished running.`
                });
                setInterval(function () {
                    $(".progressInfo").fadeIn(1000).fadeOut(1000)
                }, 1000)
            }
        }
    }

    function searchForInactives() {

        var galaxy = parseInt($("#galaxy_input").val(), 10);
        var system = parseInt($("#system_input").val(), 10);
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (karenState.coordinatesToFarm.length == 0) {
            var coordinatesToFarm = Array();
            $("tr.row.inactive_filter").each(function () {
                if ($(this)[0].classList[2] != "vacation_filter")
                    coordinatesToFarm.push([galaxy, system, $(this)[0].sectionRowIndex + 1]);
            })
            karenState.coordinatesToFarm = coordinatesToFarm;
        }
        karenState.planetsProbedInSystem = 0;
        karenState.currentFreeSlotCount = $("#slotValue").text().trim().split('/');
        logAction({
            karenAction: "probeCurrentSystem",
            actionTime: new Date(),
            description: `Karen found ${karenState.coordinatesToFarm.length} planets to probe in System ${system}.`
        });
        sessionStorage.KarenState = JSON.stringify(karenState);
    }

    function sendProbesAtInactives() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        var coordinatesToFarm = karenState.coordinatesToFarm;
        var probeCount = karenState.probeCount;
        var busySlots = parseInt(karenState.currentFreeSlotCount[0], 10);
        var slotCount = parseInt(karenState.currentFreeSlotCount[1], 10);

        if ((slotCount - karenState.slotsToLeaveFree - busySlots <= 0)
            || (karenState.startedProbing && karenState.allowedProbesToSend == 0)) {
            if (coordinatesToFarm.length == 0)
                karenState = goToNextSystem();
            karenState.karenAction = karenState.startedProbing ? "waitForProbesToFinish" : "waitForFreeSlots";
            karenState.startedProbing = false;
            karenState.allowedProbesToSend = 0;
            var logMessage = karenState.karenAction == "waitForProbesToFinish" ? "Navigating to Fleet Movement to wait for probes to finish." :
                "Navigating to Fleet Movement to wait for slots to be free.";
            logAction({
                karenAction: karenState.karenAction,
                actionTime: new Date(),
                description: logMessage
            });
            sessionStorage.KarenState = JSON.stringify(karenState);
            location.href = `/game/index.php?page=ingame&component=movement`;
        } else if (coordinatesToFarm.length > 0) {
            var galaxy = coordinatesToFarm[0][0];
            var system = coordinatesToFarm[0][1];
            var slot = coordinatesToFarm[0][2];
            if (karenState.startedProbing == false) {
                karenState.startedProbing = true;
                karenState.allowedProbesToSend = slotCount - busySlots - karenState.slotsToLeaveFree;
                karenState.allowedProbesToSend = karenState.allowedProbesToSend <= 10 ? karenState.allowedProbesToSend : 10;
            }
            karenState.allowedProbesToSend = karenState.allowedProbesToSend - 1;
            sendShips(6, galaxy, system, slot, 1, probeCount);
            karenState.coordinatesProbed.push(`${galaxy}:${system}:${slot}`);
            logAction({
                karenAction: "probeCurrentSystem",
                actionTime: new Date(),
                description: `Karen sent probes to Planet [${galaxy}:${system}:${slot}].`
            });
            coordinatesToFarm.shift();
            karenState.coordinatesToFarm = coordinatesToFarm;
            karenState.planetsProbedInSystem++;
            sessionStorage.KarenState = JSON.stringify(karenState);
            setTimeout(sendProbesAtInactives, 1000);
        } else {
            sessionStorage.KarenState = JSON.stringify(karenState);
            goToNextSystem();
            triggerKaren();
        }
    }

    function goToNextSystem() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        switch (karenState.currentDirection) {
            case "right":
                karenState.currentSystemRight = karenState.currentSystemRight + 1;
                if (karenState.currentSystemRight >= 500)
                    karenState.currentSystemRight = 1;
                break;
            case "left":
                karenState.currentSystemLeft = karenState.currentSystemLeft - 1;
                if (karenState.currentSystemLeft <= 0)
                    karenState.currentSystemLeft = 499;
                break;
        }
        sessionStorage.KarenState = JSON.stringify(karenState);
        return karenState;
    }

    function waitForProbesToFinish() {
        if (location.search.search(/^\?page=ingame&component=movement/) == -1 && location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1) {
            location.href = `/game/index.php?page=ingame&component=movement`;
            return;
        }
        setTimerToRefreshFleetMovementPage();
        if ($("div[data-mission-type=6]").length == 0) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            karenState.karenAction = "farmProbedPlanets";
            sessionStorage.KarenState = JSON.stringify(karenState);
            logAction({
                karenAction: "waitForProbesToFinish",
                actionTime: new Date(),
                description: `Esponiage missions done. Navigating to Reports.`
            });
            location.href = "/game/index.php?page=messages";
        } else {
            logAction({
                karenAction: "waitForProbesToFinish",
                actionTime: new Date(),
                description: `Esponiage missions still active.`
            });
        }
    }

    function farmProbedPlanets() {
        if (location.search.search(/^\?page=messages/) == -1) {
            location.href = `/game/index.php?page=messages`;
            return;
        }
        let checkThatTableLoadedInterval = setInterval(() => {
            if ($("#fleetsgenericpage").length > 0) {
                clearInterval(checkThatTableLoadedInterval);
                var didntFindAnythingToAttack = true;
                if ($("#spyTable tbody tr").length > 0) {
                    var karenState = JSON.parse(sessionStorage.KarenState);
                    for (var i = 0; i < $("#spyTable tbody tr").length; i++) {
                        var rowInSpyTable = $("#spyTable tbody tr")[i]
                        var tableDataInRow = $(rowInSpyTable).find("td");

                        if (parseInt($(tableDataInRow[3]).text().replace(".", "").replace(".", "").replace(".", ""), 10) >= karenState.minimumLootToFarm
                            && karenState.coordinatesProbed.includes($(tableDataInRow[0]).text())
                            && $(tableDataInRow[4]).text() == "0"
                            && $(tableDataInRow[5]).text() == "0"
                            && $(tableDataInRow[6]).find(".icon_attack.attacking").length == 0) {

                            karenState.expectedLootUntilNow = karenState.expectedLootUntilNow + parseInt($(tableDataInRow[3]).text().replace(".", "").replace(".", "").replace(".", ""), 10);
                            karenState.planetsAttackedSoFar = karenState.planetsAttackedSoFar + 1;
                            karenState.karenAction = "fleetDispatch";
                            sessionStorage.KarenState = JSON.stringify(karenState);
                            didntFindAnythingToAttack = false;
                            logAction({
                                karenAction: "farmProbedPlanets",
                                actionTime: new Date(),
                                description: `Karen will now send ships to [${$(tableDataInRow[0]).text()}].`
                            });
                            location.href = $(tableDataInRow[6]).find(".icon_attack").attr("href");
                            break;
                        }
                    }
                }
                if (didntFindAnythingToAttack) {
                    var karenState = JSON.parse(sessionStorage.KarenState);
                    karenState.coordinatesProbed = [];
                    sessionStorage.KarenState = JSON.stringify(karenState);
                    //$('input[name ="delShown"]').trigger("click");
                    logAction({
                        karenAction: "farmProbedPlanets",
                        actionTime: new Date(),
                        description: `No report meets attack condition. Navigating to Galaxy View.`
                    });
                    goToGalaxyViewAfterDispatch();
                }
            }
        }, 500);
    }

    function fleetDispatch() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1) {
            karenState.karenAction = "farmProbedPlanets";
            sessionStorage.KarenState = JSON.stringify(karenState);
            location.href = `/game/index.php?page=messages`;
            return;
        }
        $("#continueToFleet2").trigger("click");
        $("#continueToFleet3").trigger("click");
        clearInterval(sessionStorage.overrideSpriteTimerID);
        sessionStorage.overrideSpriteTimerID = setInterval(() => {
            if ($(".ajax_loading").css("display") == "none") {
                clearInterval(sessionStorage.overrideSpriteTimerID);
                karenState.karenAction = "goToMessagesAfterDispatch";
                sessionStorage.KarenState = JSON.stringify(karenState);
                $("#sendFleet").trigger("click");
            }
        }, 100);
    }

    function goToMessagesAfterDispatch() {
        if (location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1) {
            location.href = `/game/index.php?page=ingame&component=fleetdispatch`;
            return;
        }
        var karenState = JSON.parse(sessionStorage.KarenState);
        karenState.karenAction = "farmProbedPlanets";
        sessionStorage.KarenState = JSON.stringify(karenState);
        logAction({
            karenAction: "goToMessagesAfterDispatch",
            actionTime: new Date(),
            description: `Fleet dispatched. Navigating to Reports.`
        });
        location.href = "/game/index.php?page=messages";
    }

    function goToGalaxyViewAfterDispatch() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        karenState.karenAction = "probeCurrentSystem";
        sessionStorage.KarenState = JSON.stringify(karenState);
        location.href = "/game/index.php?page=ingame&component=galaxy";
    }

    function waitForFreeSlots() {
        if (location.search.search(/^\?page=ingame&component=movement/) == -1 && location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1) {
            location.href = `/game/index.php?page=ingame&component=movement`;
            return;
        }
        setTimerToRefreshFleetMovementPage();
        var karenState = JSON.parse(sessionStorage.KarenState);
        var slotCount = parseInt(karenState.currentFreeSlotCount[1], 10);
        var busySlots = $(".fleetDetails").length;
        if (slotCount - karenState.slotsToLeaveFree - busySlots > 0) {
            karenState.karenAction = "probeCurrentSystem";
            sessionStorage.KarenState = JSON.stringify(karenState);
            logAction({
                karenAction: "waitForFreeSlots",
                actionTime: new Date(),
                description: `Slots are now available for Karen to continue. Navigating to Galaxy View.`
            });
            location.href = "/game/index.php?page=ingame&component=galaxy";
        } else {
            logAction({
                karenAction: "waitForFreeSlots",
                actionTime: new Date(),
                description: `Slots are not available for Karen to continue. Will wait for next update.`
            });
        }
    }

    function logAction(logData) {
        logData.actionTime = logData.actionTime.getFullYear() + "-" + (logData.actionTime.getMonth() + 1) + "-" + logData.actionTime.getDate() + " " + logData.actionTime.getHours() + ":" + logData.actionTime.getMinutes() + ":" + logData.actionTime.getSeconds();
        if (!sessionStorage.KarenLogs) {
            var log = Array();
            log.push(logData);
            sessionStorage.KarenLogs = JSON.stringify(log);
        } else {
            var log = JSON.parse(sessionStorage.KarenLogs).slice(0, 5);
            log.unshift(logData);
            sessionStorage.KarenLogs = JSON.stringify(log);
        }
    }

    function getTimeToWaitBasedOnKarenAction() {
        if (!sessionStorage.KarenState)
            return 4000;
        else {
            var karenState = JSON.parse(sessionStorage.KarenState);
            switch (karenState.karenAction) {
                case "probeCurrentSystem": return 4000; break;
                case "waitForProbesToFinish": return 2000; break;
                case "farmProbedPlanets": return 4000; break;
                case "fleetDispatch": return 100; break;
                case "goToMessagesAfterDispatch": return 1000; break;
                case "waitForFreeSlots": return 2000; break;
                default: return 4000; break;
            }
        }
    }

    function setTimerToRefreshFleetMovementPage() {
        if ($(".fleetDetails .timer").length > 0) {
            let nextArrival = $(".fleetDetails .timer").first().text().split(" ");
            let timeToWait = 0;
            nextArrival.map(t => {
                switch (t[t.length - 1]) {
                    case 'h':
                        let hoursInSeconds = parseInt(t.replace("h", ""), 10) * 3600;
                        timeToWait += hoursInSeconds;
                        break;
                    case 'm':
                        let minutesInSeconds = parseInt(t.replace("m", ""), 10) * 60;
                        timeToWait += minutesInSeconds;
                        break;
                    case 's':
                        let seconds = parseInt(t.replace("m", ""), 10);
                        timeToWait += seconds;
                        break;
                }
            });
            setTimeout(() => {
                location.href = `/game/index.php?page=movement`;
            }, timeToWait * 1000 + 5000);
        }
    }

})();