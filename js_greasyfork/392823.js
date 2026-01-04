// ==UserScript==
// @name         KarenMobile
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  OGame Automated Inactives Farmer
// @author       tanavast
// @match        https://*.ogame.gameforge.com/game/index.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392823/KarenMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/392823/KarenMobile.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let version = "1.3";
    let timeWaiting = getTimeToWaitBasedOnKarenAction();
    showStats();
    setTimeout(triggerKaren, timeWaiting + Math.random() * 1000);

    function triggerKaren() {
        var karenActions = {
            probeCurrentSystem: probeCurrentSystem,
            waitForProbesToFinish: waitForProbesToFinish,
            farmProbedPlanets: farmProbedPlanets,
            fleetDispatchOne: fleetDispatchOne,
            fleetDispatchTwo: fleetDispatchTwo,
            fleetDispatchThree: fleetDispatchThree,
            goToMessagesAfterDispatch: goToMessagesAfterDispatch,
            waitForFreeSlots: waitForFreeSlots
        };
        if (!sessionStorage.KarenState && location.search.search(/^\?page=galaxy/) != -1) {
            var controlCenterSystem = parseInt($("#system_input").val(), 10);
            var karenState = {
                currentSystemRight: controlCenterSystem,
                currentSystemLeft: controlCenterSystem == 1 ? 499 : controlCenterSystem - 1,
                numberOfSystemsExploredSoFar: 0,
                numberOfSystemsExploredInThisDirection: 0,
                currentDirection: "right",
                switchDirectionEvery: 10,
                totalSystemsToExplore: 499,
                minimumLootToFarm: 400000,
                probeCount: 11,
                allowedProbesToSend: 0,
                startedProbing: false,
                slotsToLeaveFree: 1,
                expectedLootUntilNow: 0,
                planetsAttackedSoFar: 0,
                karenAction: "probeCurrentSystem",
                karenIsRunning: true,
                coordinatesToFarm: []
            };
            sessionStorage.KarenState = JSON.stringify(karenState);
            logAction({
                karenAction: "probeCurrentSystem",
                actionTime: new Date(),
                description: "Karen will now begin running for the first time."
            });
        }
        if (sessionStorage.KarenState) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            if (karenState.karenIsRunning) {
                karenActions[karenState.karenAction]();
            }
            else
                console.log("Karen is stopped.")
        }
    }

    function showStats() {
        if (sessionStorage.KarenState) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            if ($("#karenStatsTable").length > 0) $("#karenStatsTable").remove();
            if (karenState.karenIsRunning) {
                let stats = `
                    <table style="position: fixed; top:3%; right:3%; z-index: 9999" id="karenStatsTable">
                        <caption><b>Karen V${version}</b></caption>
                        <tbody>
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
                            <tr>
                                <td style="padding: 5px;"><b>Systems Explored</b></td>
                                <td style="padding: 5px;"><b>${karenState.numberOfSystemsExploredSoFar}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Planets Attacked</b></td>
                                <td style="padding: 5px;"><b>${karenState.planetsAttackedSoFar}</b></td>
                            </tr>
                            <tr>
                                <td style="padding: 5px;"><b>Expected Loot</b></td>
                                <td style="padding: 5px;"><b>${karenState.expectedLootUntilNow}</b></td>
                            </tr>
                        </tbody>
                    </table>`;
                $("body").append(stats);
            }
        }
    }

    window.startKaren = function () {
        if (sessionStorage.KarenState) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            karenState.karenIsRunning = true;
            sessionStorage.KarenState = JSON.stringify(karenState);
            console.log("Karen is now running")
            triggerKaren();
        }
        else {
            console.log("Navigate to galaxy view first before starting Karen for the first time");
        }
    }

    window.stopKaren = function () {
        if (sessionStorage.KarenState) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            karenState.karenIsRunning = false;
            sessionStorage.KarenState = JSON.stringify(karenState);
            console.log("Karen will finish its current action and will stop afterwards");
        } else {
            console.log("Karen is not initialized for it to be stopped");
        }
    }

    function probeCurrentSystem() {
        if (location.search.search(/^\?page=galaxy/) == -1) {
            location.href = `/game/index.php?page=galaxy`;
            return;
        }
        showStats();
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (karenState.numberOfSystemsExploredSoFar < karenState.totalSystemsToExplore) {

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
                location.href = `/game/index.php?page=movement`;
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

        if ((slotCount - karenState.slotsToLeaveFree - busySlots == 0)
            || (karenState.startedProbing && karenState.allowedProbesToSend == 0)) {
            if (karenState.startedProbing && karenState.allowedProbesToSend == 0 && coordinatesToFarm.length == 0)
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
            location.href = `/game/index.php?page=movement`;
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
        if (location.search.search(/^\?page=movement/) == -1 && location.search.search(/^\?page=fleet1/) == -1) {
            location.href = `/game/index.php?page=movement`;
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
        var didntFindAnythingToAttack = true;
        if ($("#spyTable tbody tr").length > 0) {
            var karenState = JSON.parse(sessionStorage.KarenState);
            for (var i = 0; i < $("#spyTable tbody tr").length; i++) {
                var rowInSpyTable = $("#spyTable tbody tr")[i]
                var tableDataInRow = $(rowInSpyTable).find("td");

                if (parseInt($(tableDataInRow[3]).text().replace(".", "").replace(".", "").replace(".", ""), 10) >= karenState.minimumLootToFarm
                    && $(tableDataInRow[4]).text() == "0"
                    && $(tableDataInRow[5]).text() == "0"
                    && $(tableDataInRow[6]).find(".icon_attack.attacking").length == 0) {

                    karenState.expectedLootUntilNow = karenState.expectedLootUntilNow + parseInt($(tableDataInRow[3]).text().replace(".", "").replace(".", "").replace(".", ""), 10);
                    karenState.planetsAttackedSoFar = karenState.planetsAttackedSoFar + 1;
                    karenState.karenAction = "fleetDispatchOne";
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
            $('input[name ="delShown"]').trigger("click");
            logAction({
                karenAction: "farmProbedPlanets",
                actionTime: new Date(),
                description: `No report meets attack condition. Navigating to Galaxy View.`
            });
            goToGalaxyViewAfterDispatch();
        }
    }

    function fleetDispatchOne() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (location.search.search(/^\?page=fleet1/) == -1) {
            karenState.karenAction = "farmProbedPlanets";
            sessionStorage.KarenState = JSON.stringify(karenState);
            location.href = `/game/index.php?page=messages`;
            return;
        }
        karenState.karenAction = "fleetDispatchTwo";
        sessionStorage.KarenState = JSON.stringify(karenState);
        trySubmit();
    }

    function fleetDispatchTwo() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (location.search.search(/^\?page=fleet2/) == -1) {
            karenState.karenAction = "farmProbedPlanets";
            sessionStorage.KarenState = JSON.stringify(karenState);
            location.href = `/game/index.php?page=messages`;
            return;
        }
        karenState.karenAction = "fleetDispatchThree";
        sessionStorage.KarenState = JSON.stringify(karenState);
        trySubmit();
    }

    function fleetDispatchThree() {
        var karenState = JSON.parse(sessionStorage.KarenState);
        if (location.search.search(/^\?page=fleet3/) == -1) {
            karenState.karenAction = "farmProbedPlanets";
            sessionStorage.KarenState = JSON.stringify(karenState);
            location.href = `/game/index.php?page=messages`;
            return;
        }
        var karenState = JSON.parse(sessionStorage.KarenState);
        karenState.karenAction = "goToMessagesAfterDispatch";
        sessionStorage.KarenState = JSON.stringify(karenState);
        trySubmit();
    }

    function goToMessagesAfterDispatch() {
        if (location.search.search(/^\?page=fleet1/) == -1) {
            location.href = `/game/index.php?page=fleet1`;
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
        location.href = "/game/index.php?page=galaxy";
    }

    function waitForFreeSlots() {
        if (location.search.search(/^\?page=movement/) == -1 && location.search.search(/^\?page=fleet1/) == -1) {
            location.href = `/game/index.php?page=movement`;
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
            location.href = "/game/index.php?page=galaxy";
        } else {
            logAction({
                karenAction: "waitForFreeSlots",
                actionTime: new Date(),
                description: `Slots are not available for Karen to continue. Will wait for next update.`
            });
        }
    }

    function logAction(logData) {
        if (!sessionStorage.KarenLogs) {
            var log = Array();
            log.push(logData);
            sessionStorage.KarenLogs = JSON.stringify(log);
        } else {
            var log = JSON.parse(sessionStorage.KarenLogs);
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
                case "fleetDispatchOne": return 100; break;
                case "fleetDispatchTwo": return 100; break;
                case "fleetDispatchThree": return 100; break;
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