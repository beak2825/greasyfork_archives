// ==UserScript==
// @name            Planets.nu UI Changes
// @description     Adjusts the default UI
// @author          Jezzarimu / Sibuna (Usernames at Planets.Nu)
// @include         http://planets.nu/*
// @include         http://*.planets.nu/*
// @include         https://planets.nu/*
// @include         https://*.planets.nu/*
// @license         MIT
// @version         1.5
// @namespace https://greasyfork.org/users/859074
// @downloadURL https://update.greasyfork.org/scripts/438819/Planetsnu%20UI%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/438819/Planetsnu%20UI%20Changes.meta.js
// ==/UserScript==

/*
This script allows adjustment settings to be set by the user. These settings are set by changing the
user adjustable booleans in the script.

User Adjustable Booleans:
    taskBarAlwaysUp - When set to true causes the Alerts to always be up on the map, Default is false.
    taskBarToggles - When set to true and taskBarAlwaysUp is set to false causes the Alerts to change state only when the TaskTitle is clicked, Default is true.
    taskBarShiftedRight - When set to true shifts the alerts to be flush with the right side of the screen, Default is false.
    showTurnIndicator - When set to true shows a turn indicator at the top of the map on all turns, Default is true.
    shipScanRangeAutoOn - automatically turns on the ship scan range fog of war.
    HorwaspCorrectionsPodScreenAutoOpen - automatically opens the HC Pod Screen.
    showDebrisDiskTemps - shows temperature of debris disk worlds.

Works with Horwasp Corrections addon.

Please send any comments or bug reports to Jezzarimu.

Version History:
1.5 - bug fix when exiting
1.4 - Added compatibility with HorwaspCorrections Script for the pod screen
1.3 - Changed default setting of the taskBarShiftedRight boolean.
1.2 - Bug fixes
1.1 - Added TaskBarToggles to be able to show and hide the alerts
1.0 - Initial release
*/

function wrapper () {


    var UICorrections = {
        //user adjustable booleans
        taskBarAlwaysUp: false,
        taskBarToggles: true,
        taskBarShiftedRight: false,
        showTurnIndicator: true,
        shipScanRangeAutoOn: true,
        HorwaspCorrectionsPodScreenAutoOpen: true,
        showDebrisDiskTemps: true,

        //script booleans
        adjustedProcessLoadFunction: false,
        adjustedContinueExitingFunction: false,
        adjustedtasksDownFunction: false,
        adjustedindicateOffFunction: false,

        processload: function () {
            if (vgap.version>=4) {
                let head = document.getElementsByTagName('head')[0];
                if (UICPlugin.taskBarShiftedRight && head != null && !document.getElementById("UICCss")) {
                    var CssStyle = document.createElement('style');
                    CssStyle.setAttribute("id", "UICCss");
                    CssStyle.innerHTML="\
                        @media screen and (orientation:landscape) {\
                            #Alerts {\
                                left: auto;\
                                right: 0px;\
                            }\
                                #Alerts.inmessaging {\
                                    right: 340px;\
                                }\
                                #Alerts.inhcpodscreen {\
                                    right: 340px;\
                                }\
                        }";
                    head.appendChild(CssStyle);
                } else if (!UICPlugin.taskBarShiftedRight && head != null && document.getElementById("UICCss")) {
                    let element = document.getElementById("UICCss");
                    element.parentNode.removeChild(element);
                }
                if (UICPlugin.showTurnIndicator && !UICPlugin.adjustedindicateOffFunction) {
                    vgaPlanets.prototype.UICindicateOffOld = vgaPlanets.prototype.indicateOff;
                    vgaPlanets.prototype.indicateOff = function () {};
                }
                if (UICPlugin.showTurnIndicator && vgap.nowTurn == vgap.settings.turn) {
                    document.getElementsByClassName("WorkingIndicator")[0].textContent = "Current " + vgap.nowTurn;
                }
                if ((UICPlugin.taskBarAlwaysUp || UICPlugin.taskBarToggles) && !UICPlugin.adjustedtasksDownFunction) {
                    vgaPlanets.prototype.UICtasksDownOld = vgaPlanets.prototype.tasksDown;
                    vgaPlanets.prototype.UICloadTasksOld = vgaPlanets.prototype.loadTasks;
                    if (UICPlugin.taskBarAlwaysUp) {
                        vgaPlanets.prototype.tasksDown = function () {};
                    } else {
                        vgaPlanets.prototype.tasksDown = function () {};
                        vgaPlanets.prototype.loadTasks = function () {
                            vgap.UICloadTasksOld();
                            $("#TaskTitle").tclick(function () {UICPlugin.taskBarToggleFunction()});
                        }
                    }
                    UICPlugin.adjustedtasksDownFunction = true;
                }
                if (!UICPlugin.adjustedContinueExitingFunction)
                vgaPlanets.prototype.UICcontinueExitingOld = vgaPlanets.prototype.continueExiting;
                vgaPlanets.prototype.continueExiting = function () {
                    if (!UICPlugin.taskBarShiftedRight && head != null && document.getElementById("UICCss")) {
                        let element = document.getElementById("UICCss");
                        element.parentNode.removeChild(element);
                    }
                    if (UICPlugin.adjustedtasksDownFunction) {
                        vgaPlanets.prototype.tasksDown = vgaPlanets.prototype.UICtasksDownOld;
                        vgaPlanets.prototype.loadTasks = vgaPlanets.prototype.UICloadTasksOld;
                        UICPlugin.adjustedtasksDownFunction = false;
                    }
                    if (UICPlugin.adjustedindicateOffFunction) {
                        vgaPlanets.prototype.indicateOff = vgaPlanets.prototype.UICindicateOffOld;
                        UICPlugin.adjustedindicateOffFunction = false;
                    }
                    vgaPlanets.prototype.continueExiting = vgaPlanets.prototype.UICcontinueExitingOld;
                    UICPlugin.adjustedContinueExitingFunction = false;
                    vgap.UICcontinueExitingOld();
                }
                UICPlugin.adjustedContinueExitingFunction = true;
            }
        },

        loadmap: function () {
            if (UICPlugin.taskBarAlwaysUp) {
                vgap.tasksUp();
            }
            if (UICPlugin.shipScanRangeAutoOn) {
                vgap.map.shipscanrange = true
                vgap.map.updateTools();
            }
            if (HCPlugin && UICPlugin.HorwaspCorrectionsPodScreenAutoOpen && vgap.player.raceid == 12) {
                HCPlugin.toggleScreen("HCPodScreen", "Messaging");
            }
            if (UICPlugin.showDebrisDiskTemps) {
                vgap.showdebrisdisktemps = true;
            }
        },

        taskBarToggleFunction: function () {
            vgap.tasklist.toggleClass("TasksUp");
            vgap.tasklist.toggleClass("TasksDown");
            vgap.tasklistShowing = !vgap.tasklistShowing;
        },

        showmap: function () {
            vgap.tasklist.show();
        },
    }
    vgap.registerPlugin(UICorrections, "UICorrections");
    this.UICPlugin = vgap.plugins.UICorrections;
}

var script = document.createElement("script");
script.type = "application/javascript";
script.textContent = "(" + wrapper + ")();";

document.body.appendChild(script);
