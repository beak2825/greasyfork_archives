// ==UserScript==
// @name            jianshangTicket20
// @namespace       http://tampermonkey.net/
// @version         1.1.00
// @license         MIT
// @description     try to book court on jianshang
// @author          David NewKamille
// @match           https://*.ydmap.cn/*
// @match           http://*.ydmap.cn/*
// @match           https://cdnstatic.ydmap.cn/*
// @match           http://cdnstatic.ydmap.cn/*

// @match           http://*.baidu.com/*
// @match           https://*.baidu.com /*

// @match           http://p8000.f2layer.link:8000/*
// @match           http://127.0.0.1:8000/*

// @run-at document-start

// @downloadURL https://update.greasyfork.org/scripts/466172/jianshangTicket20.user.js
// @updateURL https://update.greasyfork.org/scripts/466172/jianshangTicket20.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (window.top != window.self) {
        return;
    }

    'use strict'

    // lib start ---------------------------------------

    var glMainAppDiv = null
    var glAddressText = "-init-glAddressText-"

    function glAddressTextUpdater() {
        glAddressText = window.location.origin + window.location.pathname + window.location.search + window.location.hash;
        // console.dir(window.location)
    }

    glAddressTextUpdater()

    var date = new Date().getTime();
    console.log("app.js: ", glAddressText);

    // save system alert function
    var oldAlert = alert;

    function alert(params) {
        console.log("hook alert:", params);
    }

    ////////////// LEGACY /////////

    var glNoPageMatched = 0;

    function monitorCtl(op, keepStage) {
        if (keepStage == undefined) {
            keepStage = false
        }
        if (op == "start") {
            // if (glMachineRunning == false) {
            //     dLog("engine is sleeping, unable to start monitor");
            //     return;
            // }

            if (glPage.name == "loginPage" || glPage.name == "initPage") {
                dLog("unable to start monitor on loginPage/initPage");
                return;
            }

            if (glAutoBook == false) {
                glRefreshCount = 0
                glUpdaterSwitch = true
                glPreBoxText = ""
                glAutoBook = true;
                glBookingCount = 0;
                glStages[stStage].count = 0
                excludedSegments.clear();
                mStates = {};
                dLog("page monitor started");
                clockBarDiv.style.backgroundColor = "#FBF0D0";
                setEngineInterval(10); // high speed
                stAutoSelect = "yes";
                if (keepStage == false) {
                    setStage(stStage, true);
                }
            } else {
                // dLog("page monitor already running");
            }
            if (glPage.name != "cellTablePage") {
                dLog("redirect from", glPage.name, "to cellTablePage for auto booking ...");
                dLog("current stCellType:", stCellType)
                dLog("current glAutoBook:", glAutoBook)
                resetAndRedirect(true, glAutoBook);
                return;
            }
        } else {
            if (glAutoBook) {
                dLog("page monitor stopped");
            } else {
                // dLog("page monitor already stopped");
            }
            clockBarDiv.style.backgroundColor = "#eeeeed";
            glAutoBook = false;
            stAutoSelect = "no";
            stAutoBookByTrigger = false
            // if (keepStage == false) {
            //     stStage = "selecting"
            // }
            setStage(stStage, true);
            saveStorage();
        }
    }

    //
    var glRedirectTo = ""
    function resetAndRedirect(keepExcludes, autoFlag) {
        if (keepExcludes == undefined) {
            keepExcludes = false;
        }
        if (autoFlag == undefined) {
            autoFlag = false;
        }

        setStage("reselect", true);
        stBookingCells = [];
        mStates = {};;

        if (keepExcludes == false) {
            excludedSegments.clear();
        }

        dLog("monitor reset and redirect to", glSelectingUrl);
        glRedirectTo = glSelectingUrl
        dLog("glAutoBook:", autoFlag);
        dLog("stCellType:", stCellType);
        if (autoFlag) {
            stAutoSelect = "yes"
        }
        saveStorage();
        glBookingCount = 0;
        if (glAddressText == glSelectingUrl) {
            location.reload()
        } else {
            redirectTo(glSelectingUrl);
        }
        return;
    }

    var cfgDiv = document.createElement("div");
    cfgDiv.setAttribute("style", `
        display: flex;
        flex-direction: column;
        width: 380px;
        height: 262px;
        top: 200px;
        left: 10px;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: #eeeeed;
        color:#1ABC9C;
        font-size:16px;
        position:absolute;
        text-align: center;`
    );
    cfgDiv.setAttribute("id", "configDiv");
    cfgDiv.innerHTML = `
            <div style="display: block; width: 340px;">
                <div style="display: flex;margin-top: 8px;">
                    <div id="cancelBtn" style="cursor:grab;color:red;flex-grow: 1;">&#10060;</div>
                    <div id="confResetText" style="flex-grow: 20;">插件配置</div>
                    <div id="saveBtn" style="cursor:grab;color:green;flex-grow: 1;">&#128190;</div>
                </div>
            </div>
            
            <div style="display: block; width: 340px;"><hr></div>
        
            <table>
            <tbody>
                <tr>
                    <td style="font-size: 16px;width: 86px;">
                    开始时间：
                    </td>
                    <td>
                    <input style="font-size: 16px;width: 282px;" type="text" id="autoStartTime" required placeholder="19:59:30">
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 16px;">
                    优先场地：
                    </td>
                    <td>
                    <input style="font-size: 16px;width: 282px;" type="text" id="stPriorityColumnString" placeholder="2,13,3,12,1,14,4,5">
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 16px;">
                    优先时段：
                    </td>
                    <td>
                    <input style="font-size: 16px;width: 282px;" type="text" id="stPrioritySegmentString" placeholder="13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00">
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 16px;">
                        时段选择：
                    </td>
                    <td style="font-size: 16px;">
                        <div style="font-size: 16px;display: flex;flex-direction: row;width: max-content;justify-content: flex-start;align-items: center;">
                            <div>免费:</div>
                            <div id="Txt0810">08-10</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="0810" class="segMark">
                            </div>
                            <div id="Txt1012">10-12</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="1012" class="segMark">
                            </div>
                            <div id="Txt1213">12-13</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="1213" class="segMark">
                            </div>
                            <div id="Txt1315">13-15</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="1315" class="segMark">
                            </div>
                        </div>
    
                        <div style="font-size: 16px;display: flex;flex-direction: row;width: max-content;justify-content: flex-start;align-items: center;">
                            <div>付费:</div>
                            <div id="Txt0830">08-09</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="0830" class="segMark">
                            </div>
                            <div id="Txt1030">10-11</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="1030" class="segMark">
                            </div>
                            <div id="Txt1430">14-16</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="1430" class="segMark">
                            </div>
                            <div id="Txt1630">16-18</div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;"
                                    type="checkbox" id="1630" class="segMark">
                            </div>
                        </div>
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 16px;">
                    排除时段：
                    </td>
                    <td>
                    <input style="font-size: 16px;width: 282px;" type="text" id="stExcludeSegmentString" placeholder="22:30-23:00,23:00-23:30">
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 16px;">
                    随机场地：
                    </td>
                    <td>
                    <div style="font-size: 16px;display: flex;flex-direction: row;width: max-content;justify-content: flex-start;align-items: center;">
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;" type="checkbox" checked id="stShufflePriorityColumns">
                            </div>
                            <div>
                                &nbsp&nbsp仅优先场地：
                            </div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;" type="checkbox" id="stPriorityColumnsOnly">
                            </div>
                            <div>
                                &nbsp&nbsp仅优先时段：
                            </div>
                            <div>
                                <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;" type="checkbox" id="stPrioritySegmentOnly">
                            </div>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td style="font-size: 16px;">
                    连续优先：
                    </td>
                    <td>
                    <div style="font-size: 16px;display: flex;flex-direction: row;width: max-content;justify-content: flex-start;align-items: center;">
                            <div>
                            <input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;" type="checkbox" checked id="stContinueWanted">
                            </div>
                            <div>
                                &nbsp&nbsp订场总数量：
                            </div>
                            <div>
                                壹<input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;" type="checkbox" id="stBookOneCell">
                            </div>
                            <div>
                                贰<input style="cursor:grab;width:20px;color: red;-webkit-appearance:auto;" type="checkbox" checked id="stBookTwoCell">
                            </div>
                    </div>
                    </td>
                </tr>
                <tr>
                    <td colspan="2" id="hintMessage" style="height:20px;color: red;background-color: aliceblue;font-size: 16px;width: 340px;">
                    就绪 ...
                    </td>
                </tr>
            </tbody>
            </table>
        `;

    function setHintMessage(text) {
        var el = document.getElementById("hintMessage");
        if (el == undefined) {
            return;
        }
        el.innerText = text;
    }

    function fillConfigDiv() {
        var el = document.getElementById("autoStartTime");
        // dLog('autoStartTime');
        // console.dir(el.placeholder);
        el.value = stAutoStartTime;

        el = document.getElementById("stPriorityColumnString");
        // dLog('stPriorityColumnString');
        // console.dir(el.placeholder);
        el.value = stPriorityColumnString;

        el = document.getElementById("stPrioritySegmentString");
        // dLog('stPrioritySegmentString');
        // console.dir(el.placeholder);
        el.value = stPrioritySegmentString;

        el = document.getElementById("stExcludeSegmentString");
        // dLog('stExcludeSegmentString');
        // console.dir(el.placeholder);
        el.value = stExcludeSegmentString;

        el = document.getElementById("stPrioritySegmentOnly");
        // dLog('stPrioritySegmentOnly');
        // console.dir(stPrioritySegmentOnly);
        if (stPrioritySegmentOnly) {
            el.checked = true;
        } else {
            el.checked = false;
        }
        el = document.getElementById("stPriorityColumnsOnly");
        // dLog('stPriorityColumnsOnly');
        // console.dir(stPriorityColumnsOnly);
        if (stPriorityColumnsOnly) {
            el.checked = true;
        } else {
            el.checked = false;
        }
        el = document.getElementById("stContinueWanted");
        // dLog('stContinueWanted');
        // console.dir(stContinueWanted);
        if (stContinueWanted) {
            el.checked = true;
        } else {
            el.checked = false;
        }

        if (stMaxBatchCells == 1) {
            document.getElementById("stBookOneCell").checked = true;
            document.getElementById("stBookTwoCell").checked = false;
        } else if (stMaxBatchCells == 2) {
            document.getElementById("stBookOneCell").checked = false;
            document.getElementById("stBookTwoCell").checked = true;
        } else {
            document.getElementById("stBookOneCell").checked = false;
            document.getElementById("stBookTwoCell").checked = false;
            dLog("warning: unhandled stMaxBatchCells:", stMaxBatchCells)
        }

        el = document.getElementById("stShufflePriorityColumns");
        // dLog('stShufflePriorityColumns');
        // console.dir(stShufflePriorityColumns);
        if (stShufflePriorityColumns) {
            el.checked = true;
        } else {
            el.checked = false;
        }
    }

    function fillPrioritySegment(segMark, isTxt) {
        var el = document.getElementById("stPrioritySegmentString");
        var array = document.getElementsByClassName("segMark");
        var element = document.getElementById(segMark);

        if (isTxt === true) {
            if (element.checked !== true) {
                // change to checked
                element.checked = true;
                fillPrioritySegment(segMark)
            } else {
                // change to unchecked
                element.checked = false;
                fillPrioritySegment(segMark)
            }
            return
        }
        var doInit = true
        for (let index = 0; index < array.length; index++) {
            if (array[index].checked) {
                doInit = false
            }
            if (segMark == "clear") {
                array[index].checked = false
                document.getElementById("Txt" + array[index].id).style.backgroundColor = "";
            }
        }
        if (segMark == "clear") {
            return
        }

        if (element.checked !== true && doInit == false) {
            // uncheck one box
            el.value = defaultPrioritySegmentString;
            // background-color: aqua
            // clockBarDiv.style.backgroundColor = "#FBF0D0";
            document.getElementById("Txt" + segMark).style.backgroundColor = "";
            return
        }
        for (let index = 0; index < array.length; index++) {
            // reset all
            array[index].checked = false
            array[index].style.backgroundColor = "";
            document.getElementById("Txt" + array[index].id).style.backgroundColor = "";
        }
        element.checked = true
        document.getElementById("Txt" + segMark).style.backgroundColor = "aqua";
        if (segMark == "0810") {
            el.value = "08:00-09:00,09:00-10:00,10:00-11:00,11:00-12:00,13:00-14:00,14:00-15:00";
        } else if (segMark == "1012") {
            el.value = "10:00-11:00,11:00-12:00,13:00-14:00,14:00-15:00,08:00-09:00,09:00-10:00";
        } else if (segMark == "1213") { // Txt1213
            el.value = "12:00-13:00,13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00";
        } else if (segMark == "1315") {
            el.value = "13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00";
        } else if (segMark == "0830") {
            el.value = "08:00-08:30,09:00-09:30,10:00-10:30,11:00-11:30,14:00-14:30,15:00-15:30,16:00-16:30,17:00-17:30";
        } else if (segMark == "1030") {
            el.value = "10:00-10:30,11:00-11:30,14:00-14:30,15:00-15:30,16:00-16:30,17:00-17:30,08:00-08:30,09:00-09:30";
        } else if (segMark == "1430") {
            el.value = "14:00-14:30,15:00-15:30,16:00-16:30,17:00-17:30,08:00-08:30,09:00-09:30,10:00-10:30,11:00-11:30";
        } else if (segMark == "1630") {
            el.value = "16:00-16:30,17:00-17:30,08:00-08:30,09:00-09:30,10:00-10:30,11:00-11:30,14:00-14:30,15:00-15:30";
        }
        dLog("segMark:", segMark, el.value)
    }

    function getConfigDiv(params) {
        var curCfgDiv = document.getElementById("configDiv");

        if (curCfgDiv != undefined) {
            fillConfigDiv(curCfgDiv);
            return curCfgDiv;
        }

        // create div, run once
        document.body.appendChild(cfgDiv)

        curCfgDiv = document.getElementById("configDiv");

        document.getElementById("0810").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("1012").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("1213").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            // force to one cell
            document.getElementById("stBookTwoCell").checked = false;
            document.getElementById("stBookOneCell").checked = true;
        };

        document.getElementById("1315").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt0810").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt1012").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt1213").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            // force to one cell
            document.getElementById("stBookTwoCell").checked = false;
            document.getElementById("stBookOneCell").checked = true;
        };

        document.getElementById("Txt1315").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("0830").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("1030").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("1430").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("1630").onclick = function (ev) {
            fillPrioritySegment(ev.target.id);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt0830").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt1030").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt1430").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        document.getElementById("Txt1630").onclick = function (ev) {
            fillPrioritySegment(replaceAll(this.id, "Txt", ""), true);
            document.getElementById("stBookTwoCell").checked = true;
            document.getElementById("stBookOneCell").checked = false;
        };

        // onclick events
        document.getElementById("cancelBtn").onclick = function () {
            configDivCtl(true);
        };

        // onclick events
        document.getElementById("stBookTwoCell").onclick = function () {
            var el2 = document.getElementById("stBookTwoCell");
            var el = document.getElementById("stBookOneCell");
            if (el2.checked) {
                el.checked = false
            } else {
                el.checked = true
            }
        };

        // onclick events
        document.getElementById("stBookOneCell").onclick = function () {
            var el2 = document.getElementById("stBookTwoCell");
            var el = document.getElementById("stBookOneCell");
            if (el.checked) {
                el2.checked = false
            } else {
                el2.checked = true
            }
        };

        document.getElementById("confResetText").onclick = function () {
            dLog("--reset--");
            resetConfig();
        };

        document.getElementById("saveBtn").onclick = function () {
            // check setting values

            var el = document.getElementById("autoStartTime");
            // dLog('autoStartTime');
            // console.dir(el.value);
            if (el.value == "") {
                el.value = stAutoStartTime;
            }
            var err = autoStartTimer(el.value);
            if (err != "") {
                dLog(err);
                setHintMessage(err);
                return;
            } else {
                stAutoStartTime = el.value;
            }
            el = document.getElementById("stPriorityColumnString");
            // dLog('stPriorityColumnString');
            // console.dir(el.value);
            if (el.value == "") {
                el.value = stPriorityColumnString;
            }
            el.value = replaceAll(el.value, "，", ",")
            stPriorityColumnString = el.value;
            priorityColumnsReset();

            el = document.getElementById("stPrioritySegmentString");
            // dLog('stPrioritySegmentString');
            // console.dir(el.value);
            if (el.value == "") {
                el.value = stPrioritySegmentString;
            }
            el.value = replaceAll(el.value, "，", ",")
            stPrioritySegmentString = el.value;
            prioritySegmentsReset();

            el = document.getElementById("stExcludeSegmentString");
            // dLog('stExcludeSegmentString');
            // console.dir(el.value);
            if (el.value == "") {
                el.value = stExcludeSegmentString;
            }
            el.value = replaceAll(el.value, "，", ",")
            stExcludeSegmentString = el.value;
            excludeSegmentsReset();

            el = document.getElementById("stPrioritySegmentOnly");
            // dLog('stPrioritySegmentOnly');
            // console.dir(el.checked);
            if (el.checked) {
                stPrioritySegmentOnly = true;
            } else {
                stPrioritySegmentOnly = false;
            }
            el = document.getElementById("stPriorityColumnsOnly");
            // dLog('stPriorityColumnsOnly');
            // console.dir(el.checked);
            if (el.checked) {
                stPriorityColumnsOnly = true;
            } else {
                stPriorityColumnsOnly = false;
            }
            el = document.getElementById("stContinueWanted");
            // dLog('stContinueWanted');
            // console.dir(el.checked);
            if (el.checked) {
                stContinueWanted = true;
            } else {
                stContinueWanted = false;
            }

            var el2 = document.getElementById("stBookTwoCell");
            var el = document.getElementById("stBookOneCell");
            if (el2.checked) {
                stMaxBatchCells = 2;
                el.checked = false
            } else if (el.checked) {
                stMaxBatchCells = 1;
            }
            dLog("save stMaxBatchCells:", stMaxBatchCells)

            el = document.getElementById("stShufflePriorityColumns");
            // dLog('stShufflePriorityColumns');
            // console.dir(el.checked);
            if (el.checked) {
                stShufflePriorityColumns = true;
            } else {
                stShufflePriorityColumns = false;
            }

            // hide div
            configDivCtl(true);
            saveStorage();
        };

        //
        fillConfigDiv(curCfgDiv);
        saveStorage();
        return curCfgDiv;
    }

    function setClockBarColor(params) {
        var sw = document.getElementById("machineSwitch")
        if (sw == undefined) {
            return
        }
        if (glMachineRunning) {
            sw.innerHTML = glToStopSym;
        } else {
            sw.innerHTML = glToStartSym;
        }

        if (glAutoBook) {
            if (availableCells.size == 0) {
                clockBarDiv.style.backgroundColor = "#FBF0D0";
            } else {
                clockBarDiv.style.backgroundColor = "#F26A3E";
            }
        } else {
            if (availableCells.size == 0) {
                clockBarDiv.style.backgroundColor = "#eeeeed";
            } else {
                clockBarDiv.style.backgroundColor = "lightGreen";
            }
        }

    }
    var glMachineRunning = true
    function machineSwitchCtl(op) {
        if (op == undefined) {
            if (glMachineRunning) {
                op = "stop"
            } else {
                op = "start"
            }
        }
        if (op == "stop") {
            // turn to stop
            glMachineRunning = false
            monitorCtl("stop")
            stAutoSelect = "no"
            if (glIntervalId != -1) {
                clearTimeout(glIntervalId);
                glIntervalId = -1;
            }
            dLog("machine stopped ...")
        } else {
            glRefreshCount = 0
            glMachineRunning = true
            dLog("machine running ...")
            setEngineInterval(glEngineInterval, true);
        }
        setClockBarColor()
    }

    var configDivCtlShowed = false;
    function configDivCtl(hide) {
        if (hide == undefined) {
            hide = false;
        }
        var curCfgDiv = getConfigDiv();

        if (configDivCtlShowed || hide) {
            configDivCtlShowed = false;
            curCfgDiv.style.display = "none";
            curCfgDiv.style.zIndex = -1;
        } else {
            configDivCtlShowed = true;
            curCfgDiv.style.display = "flex";
            curCfgDiv.style.zIndex = getMaxZIndex() + 1;

            var segMark = "clear"
            // default: "13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00"
            if (stPrioritySegmentString == "08:00-09:00,09:00-10:00,10:00-11:00,11:00-12:00,13:00-14:00,14:00-15:00") {
                segMark = "0810"
            } else if (stPrioritySegmentString == "10:00-11:00,11:00-12:00,13:00-14:00,14:00-15:00,08:00-09:00,09:00-10:00") {
                segMark = "1012"
            } else if (stPrioritySegmentString == "12:00-13:00,13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00") {
                segMark = "1213"
            } else if (stPrioritySegmentString == "13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00") {
                segMark = "1315"
            } else if (stPrioritySegmentString == "08:00-08:30,09:00-09:30,10:00-10:30,11:00-11:30,14:00-14:30,15:00-15:30,16:00-16:30,17:00-17:30") {
                segMark = "0830"
            } else if (stPrioritySegmentString == "10:00-10:30,11:00-11:30,14:00-14:30,15:00-15:30,16:00-16:30,17:00-17:30,08:00-08:30,09:00-09:30") {
                segMark = "1030"
            } else if (stPrioritySegmentString == "14:00-14:30,15:00-15:30,16:00-16:30,17:00-17:30,08:00-08:30,09:00-09:30,10:00-10:30,11:00-11:30") {
                segMark = "1430"
            } else if (stPrioritySegmentString == "16:00-16:30,17:00-17:30,08:00-08:30,09:00-09:30,10:00-10:30,11:00-11:30,14:00-14:30,15:00-15:30") {
                segMark = "1630"
            }

            fillPrioritySegment(segMark)

            setHintMessage("就绪 ...");
        }
    }

    var defaultPrioritySegmentString = "13:00-14:00,14:00-15:00,10:00-11:00,11:00-12:00,08:00-09:00,09:00-10:00";
    var defaultPriorityColumnString = "2,13,12,1,14,4,5";
    var defaultAutoStartTime = "19:59:30";
    var defaultExcludeSegmentString = "22:30-23:00,23:00-23:30";

    var stAutoStartTime = defaultAutoStartTime; // local time
    var stPriorityColumnString = defaultPriorityColumnString;;
    var stPrioritySegmentString = defaultPrioritySegmentString;;
    var stExcludeSegmentString = defaultExcludeSegmentString;
    function resetConfig(params) {
        stBookingCells = [];
        stDualLogLines = [];
        stExcludes = [];
        setStage("selecting", true);
        stAutoSelect = "no";
        stAutoStartTime = defaultAutoStartTime;;
        stPriorityColumnString = defaultPriorityColumnString;;
        stPrioritySegmentString = defaultPrioritySegmentString;;
        stExcludeSegmentString = defaultExcludeSegmentString;
        stPrioritySegmentOnly = false;
        stPriorityColumnsOnly = false;
        stContinueWanted = true;
        stAutoBookByTrigger = false
        stShufflePriorityColumns = true;
        stMaxBatchCells = 2;
        saveStorage();
        resetAndRedirect(false, false);
    }

    var appAccessToken = ""
    function getAccessToken(params) {
        // 
        appAccessToken = bookStorage.getItem("Access-Token");
        if (appAccessToken == undefined || appAccessToken == null) {
            dLog("localStorage: appAccessToken not found")
            appAccessToken = ""
        }
        // dLog("localStorage, appAccessToken:\n");
        // console.dir(appAccessToken);
        return appAccessToken;
    }


    var glLastFreshTs = 0
    var glBookTriggerTs = -1
    function cellsRefresh(params) {
        var tsGap = glBookTriggerTs - glCurTs
        if (glBookTriggerTs > 0 && (tsGap > 0 && tsGap < 15000)) {
            dLog("not cells refresh for glAutoBookTs:", tsGap)
            return
        }
        tsGap = (glCurTs - glLastFreshTs)
        if (tsGap < 1500 && (glAutoBook && tsGap < 800)) {
            dLog("not cells refresh for frequency:", tsGap)
            return
        }
        glLastFreshTs = glCurTs
        // re-click on slider-item text-center selected
        var refreshDiv = document.getElementsByClassName("slider-item text-center selected")[1];
        // console.dir(refreshDiv);
        if (refreshDiv != undefined) {
            refreshDiv.click();
            glRefreshCount++
            // dLog("clicked to refresh ...");
        } else {
            if (glPage.name != "initPage") {
                dLog("unable to refresh, slider-item text-center selected not found");
            }
        }
    }


    var allColumns = new Map(); // key: cellColumn, value: null
    var allSegments = new Map(); // key: cellSegment, value: null

    var excludedSegments = new Map();
    function getAvailableCell(silent) {

        availableCells.clear();
        allColumns.clear();
        allSegments.clear();

        var selectedDay = "1970-07-01"
        var dayDiv = document.getElementsByClassName("slider-item text-center selected")[1];
        // console.dir(dayDiv);
        if (dayDiv != undefined) {
            selectedDay = dayDiv.childNodes[0].innerText;
            // console.dir(selectedDay);
            if (selectedDay == undefined) {
                selectedDay = dayDiv.childNodes[1].innerText;
                // console.dir(selectedDay);
            }
            if (selectedDay == undefined) {
                selectedDay = "1970-07-01"
            }
        }

        var classPrefix = "schedule-table_column_";
        for (let cellColumn = 0; cellColumn < 30; cellColumn++) {
            var columnClass = classPrefix + cellColumn;
            var cells = document.getElementsByClassName(columnClass)

            // dLog("getAvailableCell: ", columnClass, "\n", cells);

            for (let index = 0; index < cells.length; index++) {
                var element = cells[index];
                // dLog("getAvailableCell: ", columnClass, "\n", index, element.className, element);
                // if (cellColumn == 4 && index == 2) {
                //     debugger;
                // }
                var cellClass = replaceAll(element.className.trim(" "), "  ", " ")

                // if ((cellClass == columnClass || (element.classList.contains("noOpen") && element.classList.contains(columnClass))) && index > 0) {
                var childNode = element.childNodes[1]
                if (childNode == undefined) {
                    childNode = element.childNodes[0]
                }
                // dLog("getAvailableCell: ", columnClass, "\n", index, element.className, element, childNode);
                if (childNode == undefined) {
                    dLog("场地: ", cellColumn, "号场", index, "信息缺失", childNode);
                    continue;
                }
                if (index == 0) {
                    // skip title
                    continue;
                }

                childNode.cellText = replaceAll(childNode.innerText, "\n", " ").trim(" ");
                childNode.cellSegment = childNode.cellText.split(" ")[0]

                // filter 16:30-17:00
                // dLog("skip check, available:", childNode.cellSegment.indexOf(":30"), childNode.cellSegment, childNode.cellText)
                // 21:21:02.975 m:selecting skip check, available: 2 15:30-16:00 15:30-16:00 40 元
                if (childNode.cellSegment.indexOf(":30") == 2) {
                    // dLog("skipped, half hour available:", childNode.cellSegment, childNode.cellText)
                    continue;
                }

                var cellNo = (cellColumn)
                if (cellColumn < 10) {
                    cellNo = "0" + cellNo
                }
                childNode.cellText = childNode.cellText + " " + cellNo + " 号场";
                childNode.cellColumn = cellColumn

                var sKey = childNode.cellColumn + "-" + childNode.cellSegment;

                childNode.cellKey = childNode.cellColumn + "-" + childNode.cellSegment;

                if (cellClass.indexOf("selected") > 0 && index > 0) {
                    // reset
                    dLog("get available: reset clicked cell", childNode.cellText);
                    // console.dir(element)
                    element.click();
                    element.className = columnClass;
                    cellClass = columnClass
                    // console.dir(element)
                }

                var advSeconds = 60 * 60 * 6; // six hours
                // glDate.Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
                var subSeconds = segmentSub(glDate.Format("hh:mm"), childNode.cellSegment.split("-")[0]);
                var curDay = glDate.Format("yyyy-MM-dd");
                var curYear = glDate.Format("yyyy");
                childNode.cellText = childNode.cellText + " " + Math.round(subSeconds / 60);
                var sDay = replaceAll(selectedDay, "-", "");
                var sDay = replaceAll(sDay, curYear, "");
                var cDay = replaceAll(curDay, "-", "");
                var cDay = replaceAll(cDay, curYear, "");

                if (excludedSegments.has(sKey)) {
                    var ts = new Date().getTime();
                    var expTs = excludedSegments.get(sKey)
                    if (expTs < ts) {
                        dLog("remove exclude segment99:", sKey);
                        excludedSegments.delete(sKey);
                    } else {
                        // dLog("skip exclude segment99:", sKey);
                        continue;
                    }
                    // TODO: add sKey to excludedSegments when next to pay failed
                    // childNode.cellKey
                }
                if (cellClass == columnClass) {
                    if (excludeSegments.has(childNode.cellSegment)) {
                        if (excludedSegments.has(sKey) == false) {
                            var ts = new Date().getTime();
                            dLog(childNode.cellSegment, "has been excluded, add segment:", sKey);
                            excludedSegments.set(sKey, ts + excludeExpire);
                        }
                        continue;
                    }
                    // dLog("sDay", sDay, "cDay", cDay, "subSeconds", subSeconds, "advSeconds", advSeconds, childNode.cellText)
                    // 11:51:46.330 m:selecting sDay 20221104 cDay 20221104 subSeconds 14349 advSeconds 21600 15:00-15:30 40 元 04 号场 239
                    if ((isLocalhost() == false) && (sDay < cDay || (sDay == cDay && subSeconds < advSeconds))) {
                        if (excludedSegments.has(sKey) == false) {
                            // dLog("sDay", sDay, "cDay", cDay, "subSeconds", subSeconds, "advSeconds", advSeconds, childNode.cellText);
                            // sDay 0428 cDay 20230426 subSeconds -21608 advSeconds 21600 15:00-15:30 40元 01 号场 -360
                            // dLog("segment is too late to book99", childNode.cellText, Math.round(advSeconds / 60), selectedDay, curDay);
                        }
                        var ts = new Date().getTime();
                        // dLog(childNode.cellSegment, ", add segment for too late:", sKey);
                        excludedSegments.set(sKey, ts + (excludeExpire * 100));
                        continue;
                    }
                    // dLog("+可用场地: ", childNode.cellText);
                    // 可用场地(2):  6 号场 2 09:30-10:00 40 元
                    availableCells.set(sKey, childNode)
                    allColumns.set(childNode.cellColumn, null);
                    allSegments.set(childNode.cellSegment, null);
                } else {
                    // dLog("cell class miss-match:", cellClass, ", want: ", columnClass);
                }
            }
        }
        glAvailableSum = "none"
        if (availableCells.size > 0) {

            var tsString = new Date().toLocaleString();

            var position = 0

            if (silent != true) {
                dLog("信息(" + tsString + ")： 可用场地(" + availableCells.size + ")\n")
            }

            for (const childNode of availableCells.values()) {
                // var cellColumn = childNode.cellColumn
                // var cellSegment = childNode.cellSegment
                position++;
                if (silent != true) {
                    dLog("可用场地(" + position + "): ", childNode.cellText);
                }
                glAvailableSum = childNode.cellText + "," + glAvailableSum
            }
            if (silent != true) {
                dLog(tsString);
            }
        }
        // if (availableCells.length == 0 && glRefreshCount == 0) {
        //     dLog("force refresh for first load ...")
        //     cellsRefresh()
        // }
    }

    //
    function hideMessageBox(params) {
        var messageBox = document.getElementsByClassName(glMessageBoxClass)[0]
        var mb = document.getElementsByClassName(glMessageBoxClass)

        // van-dialog
        if (messageBox == undefined) {
            // mobile
            messageBox = document.getElementsByClassName("van-dialog")[0];
            mb = document.getElementsByClassName("van-dialog");
        }

        if (messageBox != undefined) {
            // dLog("messageBox found:")
            // console.dir(mb)
            // console.dir(messageBox)
            // console.dir(messageBox.style.zIndex)
            // dLog("messageBox.style.zIndex", messageBox.style.zIndex, messageBox.style.display)
            if (messageBox.style.zIndex > 0) {
                messageBox.style.display = "none";
                messageBox.style.zIndex = -1;
                dLog("messageBox hided")
            }
        }
    }

    function showMessageBox(params) {
        var messageBox = document.getElementsByClassName(glMessageBoxClass)[0]
        var mb = document.getElementsByClassName(glMessageBoxClass)

        // van-dialog
        if (messageBox == undefined) {
            // mobile
            messageBox = document.getElementsByClassName("van-dialog")[0];
            mb = document.getElementsByClassName("van-dialog");
        }

        if (messageBox != undefined) {
            // dLog("messageBox found:")
            // console.dir(mb)
            // console.dir(messageBox)
            // console.dir(messageBox.style.zIndex)
            dLog("messageBox.style.zIndex", messageBox.style.zIndex, messageBox.style.display)
            messageBox.style.display = "block";
            messageBox.style.zIndex = getMaxZIndex() + 1;
            dLog("messageBox showed")
        } else {
            dLog("messageBox not found for showing")
        }
    }

    var excludeExpire = 20 * 1000; // seconds
    function searchWithin(tryColumns, trySegments, continueFirst) {
        if (continueFirst == undefined) {
            continueFirst = false
        }
        if (stMaxBatchCells == 1) {
            continueFirst = false
        }
        if (stBookingCells.length >= stMaxBatchCells) {
            return
        }
        if (stBookingCells.length >= 1) {
            if (continueFirst == false) {
                dLog("force to continued segments for one cell in queue")
            }
            continueFirst = true;
        }
        // limit =2 try to book two continue segments
        // limit =1 try to book one segment

        var reTry = false;
        do {
            reTry = false;

            var tryCells = new Map(); // key: column, value: childNode
            for (let index = 0; index < stBookingCells.length; index++) {
                const childNode = stBookingCells[index];
                dLog("in queue node:", childNode.cellKey, childNode.cellColumn)
                var colArr = tryCells.get(childNode.cellColumn)
                if (colArr == undefined) {
                    colArr = []
                }
                colArr.push(childNode)
                tryCells.set(childNode.cellColumn, colArr)
            }
            for (const cellSegment of trySegments.keys()) {
                for (const cellColumn of tryColumns.keys()) {
                    var key = cellColumn + "-" + cellSegment
                    if (availableCells.has(key) == false) {
                        continue;
                    }
                    // if (cellSegment == "17:30-18:00") {
                    //     dLog(excludeSegments)
                    //     dLog(excludedSegments)
                    // }
                    if (excludeSegments.has(cellSegment)) {
                        if (excludedSegments.has(key) == false) {
                            var ts = new Date().getTime();
                            dLog("search, new exclude segment:", key);
                            excludedSegments.set(key, ts + excludeExpire);
                        }
                        continue;
                    }
                    var childNode = availableCells.get(key);
                    var colArr = tryCells.get(cellColumn)
                    if (colArr == undefined) {
                        colArr = []
                    }
                    if (continueFirst == false) {
                        // tryCells/colArr should be empty for stBookingCells is empty
                        colArr.push(childNode)
                        tryCells.set(cellColumn, colArr)

                        stBookingCells.push(childNode)
                        if (stBookingCells.length >= stMaxBatchCells) {
                            dLog("stMaxBatchCells in queue:", stBookingCells.length, childNode.cellText, stBookingCells.length)
                            return
                        }
                        dLog("check for continued segments for one cell insert into queue:", childNode.cellText, stBookingCells.length)
                        continueFirst = true;
                        reTry = true;
                    } else {
                        for (let index = 0; index < colArr.length; index++) {
                            const element = colArr[index];
                            if (element.cellText == childNode.cellText) {
                                continue;
                            }
                            if (isContinueSegment(element.cellSegment, cellSegment)) {
                                if (stBookingCells.indexOf(element) < 0) {
                                    // element may already exist
                                    stBookingCells.push(element)
                                } else {
                                    dLog(element.cellText, "already in queue")
                                }
                                if (stBookingCells.indexOf(childNode) < 0) {
                                    // element may already exist
                                    stBookingCells.push(childNode)
                                } else {
                                    dLog(childNode.cellText, "already in queue")
                                }
                                dLog("continue segment in", cellColumn, element.cellSegment, cellSegment, element.cellText, childNode.cellText)
                                if (stBookingCells.length >= stMaxBatchCells) {
                                    return
                                }
                            } else {
                                // dLog("NOT continue segment in", cellColumn, element.cellSegment, cellSegment, element.cellText, childNode.cellText)
                            }
                        }
                    }
                    if (stBookingCells.length == 0) {
                        // only match continue segment with existed cell
                        // only update tryCells when no existed cell in queue
                        colArr.push(childNode)
                        tryCells.set(cellColumn, colArr)
                    }
                }
            }
            if (reTry) {
                dLog("re-try searching ...");
            }
        } while (reTry);
        return;
    }

    // search for best cells
    function searchAll(continueFirst) {
        if (continueFirst == undefined) {
            continueFirst = false
        }
        if (stBookingCells.length >= stMaxBatchCells) {
            return stBookingCells.length;
        }
        priorityColumnsReset();

        if (availableCells.size == 0) {
            return 0;
        }

        // priorityColumns + prioritySegments
        searchWithin(priorityColumns, prioritySegments, continueFirst)
        // dLog("priorityColumns, prioritySegments:", stBookingCells.length);
        if (stBookingCells.length > 0) {
            dLog("priorityColumns, prioritySegments:", stBookingCells.length);
            console.dir(stBookingCells);
            if (stBookingCells.length >= stMaxBatchCells) {
                return stBookingCells.length;
            }
        }
        if (continueFirst && stPrioritySegmentOnly == false) {
            dLog("priorityColumns, allSegments after continueFirst:", stBookingCells.length);
            searchWithin(priorityColumns, allSegments, false)
            // dLog("priorityColumns, allSegments after continueFirst:", stBookingCells.length);
            if (stBookingCells.length > 0) {
                dLog("priorityColumns, allSegments single cell:", stBookingCells.length);
                console.dir(stBookingCells);
                if (stBookingCells.length >= stMaxBatchCells) {
                    return stBookingCells.length;
                }
            }
        }
        if (stPriorityColumnsOnly) {
            // dLog("stPriorityColumnsOnly:", stPriorityColumnsOnly)
            if (availableCells.size > 0 && stBookingCells.length == 0) {
                dLog("not priority column to book");
                machineMessageBox("警告：仅订优先场地，但无可用场地");
            }
            return stBookingCells.length;
        }

        // allColumns + prioritySegments
        searchWithin(allColumns, prioritySegments, continueFirst)
        // dLog("allColumns, prioritySegments:", stBookingCells.length);
        if (stBookingCells.length > 0) {
            dLog("allColumns, prioritySegments:", stBookingCells.length);
            console.dir(stBookingCells);
            if (stBookingCells.length >= stMaxBatchCells) {
                return stBookingCells.length;
            }
        }

        if (stPrioritySegmentOnly) {
            // dLog("stPrioritySegmentOnly:", stPrioritySegmentOnly)
            if (availableCells.size > 0 && stBookingCells.length == 0) {
                dLog("not priority segment to book");
                machineMessageBox("警告：仅订优先时段，但无可用场地");
            }
            return stBookingCells.length;
        }

        // priorityColumns + allSegments
        searchWithin(priorityColumns, allSegments, continueFirst)
        // dLog("priorityColumns, allSegments:", stBookingCells.length);
        if (stBookingCells.length > 0) {
            dLog("priorityColumns, allSegments:", stBookingCells.length);
            console.dir(stBookingCells);
            if (stBookingCells.length >= stMaxBatchCells) {
                return stBookingCells.length;
            }
        }

        // availableCells + allSegments
        searchWithin(allColumns, allSegments, continueFirst)
        // dLog("allColumns, allSegments:", stBookingCells.length);
        if (stBookingCells.length > 0) {
            dLog("allColumns, allSegments:", stBookingCells.length);
            console.dir(stBookingCells);
            if (stBookingCells.length >= stMaxBatchCells) {
                return stBookingCells.length;
            }
        }
    }

    //
    function clickCells(nextStage) {

        if (mStates["clickCells"] == undefined) {
            mStates["clickCells"] = { state: "click-init", index: 0, stepCount: 0 };
            // click-init
            // selected-count
        }

        if (stBookingCells.length == 0) {
            dLog("stBookingCells empty, goto selecting");
            setStage("selecting", true);
            mStates["clickCells"].state = "click-init";
            mStates["clickCells"].stepCount = 0;
            mStates["clickCells"].index = 0;
            return;
        }

        var selectCount = 0;
        for (let index = 0; index < stBookingCells.length; index++) {
            const stInfo = stBookingCells[index];
            var key = stInfo.cellColumn + "-" + stInfo.cellSegment;
            var childNode = availableCells.get(key);
            if (childNode == undefined) {
                dLog("clickCells, cell info not found:", key);
                setStage("error");
                mStates["clickCells"].state = "click-init";
                mStates["clickCells"].stepCount = 0;
                mStates["clickCells"].index = 0;
                return;
            }

            if (childNode.cellClicked == undefined) {
                childNode.cellClicked = false;
            }
            if (childNode.checkCount == undefined) {
                childNode.checkCount = 0;
            }

            var pNode = childNode.parentNode
            if (pNode.classList.contains("selected")) {
                selectCount++;
                dLog("selected(" + selectCount + "/" + stBookingCells.length + ") ", childNode.cellText, "\n")
            } else {
                // if (childNode.cellClicked) {
                //     dLog("cell clicked but not active(" + (index + 1) + ") ", childNode.cellText, "\n")
                // }
            }
        }
        if (selectCount >= stBookingCells.length || mStates["clickCells"].state == "forceDone") {
            if (selectCount >= stBookingCells.length) {
                dLog("all booking cells were selected:", selectCount);
            } else {
                dLog("force done, selected cells:", selectCount);
            }
            //
            setStage(nextStage);
            mStates["clickCells"].state = "click-init";
            mStates["clickCells"].stepCount = 0;
            mStates["clickCells"].index = 0;
            return true;
        }

        dLog("mState:", mStates["clickCells"].state);
        if (mStates["clickCells"].state == "click-init") {
            mStates["clickCells"].state = "try-click";
            mStates["clickCells"].stepCount = 0;
            mStates["clickCells"].index = stBookingCells.length - 1;
        }
        if (mStates["clickCells"].state == "try-click") {
            mStates["clickCells"].stepCount++;

            var selectedCount = 0
            var clickCount = 0;
            for (let index = stBookingCells.length - 1; index >= 0; index--) {
                const stInfo = stBookingCells[index];
                var key = stInfo.cellColumn + "-" + stInfo.cellSegment;
                var childNode = availableCells.get(key);

                var pNode = childNode.parentNode

                // if (pNode.classList.contains("selected") == false && pNode.parentNode.classList.contains("selected")) {
                //     dLog("twins selected")
                //     pNode = pNode.parentNode;
                //     mStates["clickCells"].index--;
                // }
                if (pNode.classList.contains("selected")) {
                    // move to next

                    dLog("no click for already selected(#" + (mStates["clickCells"].index) + ") ", childNode.cellText, "\n")

                    selectedCount++

                    if (selectedCount >= stBookingCells.length) {
                        // all cells clicked
                        mStates["clickCells"].state = "selected-count";
                        mStates["clickCells"].stepCount = 0;
                        mStates["clickCells"].index = 0;
                    }
                    return true;
                }
                if (childNode.cellClicked) {
                    // waiting for cell turn to selected
                    childNode.checkCount++;
                    if (childNode.checkCount < 10) {
                        dLog("cell clicked, waiting(" + (childNode.checkCount) + ") ", childNode.cellText, "\n");
                    }

                    if (isLocalhost()) {
                        pNode.classList.add("selected")
                        dLog("add selected(" + (index + 1) + ") ", childNode.cellText, "\n")
                    }

                    if (childNode.checkCount > 80) {
                        dLog(childNode.cellText, "cell failed to select, force to done(" + (childNode.checkCount) + ") ", "\n");
                        pNode.classList.add("selected")
                    }
                } else {
                    // if (key.indexOf(":30") >= 10) {
                    //     // 2-17:00-17:30
                    //     dLog("try-click key:", key, key.indexOf(":30"));
                    //     console.dir(childNode);
                    //     childNode = childNode.childNodes[1];
                    //     console.dir(childNode);
                    // }

                    // click on cell only once
                    childNode.cellClicked = true;
                    dLog("clicked(#" + (index + 1) + ") ", childNode.cellText, "\n")
                    // var subDiv = childNode.childNodes[1];
                    // if (isMobile() && subDiv != undefined && mStates["clickCells"].stepCount != 3) {
                    //     dLog("mobile click", subDiv);
                    //     subDiv.click();
                    // } else {
                    //     childNode.click();
                    // }
                    childNode.click();
                    clickCount++;
                }
            }
            if (clickCount == 0) {
                // waiting for click take effect
                return false
            }
            return true;
        } else if (mStates["clickCells"].state == "selected-count") {
            // selected count

            if (mStates["clickCells"].stepCount > 20) {
                dLog("not all cells selected after 20 try, force to done:", selectCount, stBookingCells.length)
                mStates["clickCells"].state = "forceDone";
                return;
            } else {
                dLog("not all cells selected, waiting", selectCount, stBookingCells.length)
            }
            mStates["clickCells"].stepCount++;
            return;
        }
        //
        dLog("unknown machine state:", mStates["clickCells"].state, mStates["clickCells"]);
        setStage("error");
        return;
    }

    var machineMsgDiv = document.createElement("div");
    machineMsgDiv.setAttribute("style", `
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: #eeeeed;
        color:#1ABC9C;
        font-size:16px;
        position:relative;
        text-align: left;
        vertical-align: top;
        `
    );
    machineMsgDiv.setAttribute("id", "machineMsgDiv");
    machineMsgDiv.innerHTML = `
        <div style="display: block; width: 100%;">
            <div style="display: flex;">
                <div id="machineMessageText" style="background-color: #01f46833;color: red;flex-grow: 20;text-align: center;">----</div>
            </div>
        </div>
        `;

    var glPreBoxText = ""
    function machineMessageBox(msgText) {
        var oldDiv = document.getElementById("machineMsgDiv");
        if (oldDiv != null && msgText == glPreBoxText) {
            return;
        }
        if (msgText == "") {
            machineMsgDiv.style.display = "none"
            glPreBoxText = ""
            return;
        }
        if (oldDiv == null) {
            document.body.appendChild(machineMsgDiv);
        }
        machineMsgDiv.style.zIndex = getMaxZIndex();
        // dLog("machineMsgDiv: zIndex:", machineMsgDiv.style.zIndex);
        machineMsgDiv.style.display = "flex"
        document.getElementById("machineMessageText").innerText = msgText
        dLog("machineMessageBox:", msgText);
        glPreBoxText = msgText
    }

    //
    var mStates = {}; // key: state name, value: any

    function clickNext(nextStage, checkMessageBox, checkToast) {

        if (checkMessageBox == undefined) {
            checkMessageBox = false;
        }
        if (checkToast == undefined) {
            checkToast = false;
        }

        if (mStates["clickNext"] == undefined) {
            mStates["clickNext"] = { state: "disabled-btn", stepCount: 0 };
        }

        dLog("mState:", mStates["clickNext"].state);
        var nextBtn = document.getElementsByClassName("el-button full-width primary-button el-button--text")[0]
        // console.dir(document.getElementsByClassName("el-button full-width primary-button el-button--text"));
        // console.dir(nextBtn);
        if (mStates["clickNext"].state == "disabled-btn") {
            mStates["clickNext"].stepCount++;

            if (nextBtn == undefined) {
                dLog("next button not found");
            } else if (nextBtn.classList.contains("is-disabled")) {
                var nextBtn = document.getElementsByClassName("el-button full-width primary-button el-button--text is-disabled")[0]
                if (nextBtn != undefined) {
                    dLog("disabled next step button found", mStates["clickNext"].stepCount)
                    if (mStates["clickNext"].stepCount > 10 && isLocalhost()) {
                        dLog("force active next step button")
                        nextBtn.classList.remove("is-disabled");
                        nextBtn.removeAttribute('disabled');
                    }
                }
            } else {
                dLog("next button found and active, try to click");
                mStates["clickNext"].state = "click-btn";
                mStates["clickNext"].stepCount = 0;
                return true;

                // if (nextBtn.hasAttribute("clicked")) {
                //     dLog("next button found and active, but already clicked");
                //     return;
                // } else {
                //     dLog("next button found and active, try to click");
                //     mStates["clickNext"].state = "click-btn";
                //     mStates["clickNext"].stepCount = 0;
                //     return true;
                // }
            }
            if (mStates["clickNext"].stepCount > 2000) {
                setStage("error");
                mStates["clickNext"].state = "disabled-btn";
                mStates["clickNext"].stepCount = 0;
                dLog("waiting for next button timeout");
                return;
            }
        } else if (mStates["clickNext"].state == "click-btn") {
            mStates["clickNext"].stepCount++;
            if (nextBtn == undefined) {
                dLog("next button has gone after click on next");
                mStates["clickNext"].state = "messageBox"
                mStates["clickNext"].stepCount = 0;
                return;
            }
            nextBtn.click();
            if (nextBtn.hasAttribute("clicked") == false) {
                nextBtn.setAttribute("clicked", "true");
                dLog("next step button clicked", mStates["clickNext"].stepCount)
            } else {
                dLog("next step button already clicked", mStates["clickNext"].stepCount)
            }
            if (checkMessageBox && isLocalhost()) {
                dLog("show message box for localhost");
                showMessageBox();
            }
            // click only once
            mStates["clickNext"].state = "messageBox"
            mStates["clickNext"].stepCount = 0;
            return true;
        } else if (mStates["clickNext"].state == "messageBox") {
            mStates["clickNext"].stepCount++;

            // exclude clicked/selected cells
            for (let index = 0; index < stBookingCells.length; index++) {
                const childNode = stBookingCells[index];

                if (excludedSegments.has(childNode.cellKey) == false) {
                    var ts = new Date().getTime();
                    dLog("book in-progress, exclude clicked/selected segment:", childNode.cellKey);
                    excludedSegments.set(childNode.cellKey, ts + excludeExpire);
                }
            }

            if (checkToast) {

                // too late message/warning
                var toastMsg = document.getElementsByClassName("van-toast--text")[0]

                if (toastMsg != undefined && toastMsg.innerText != "") {

                    toastHandle()

                    saveStorage();

                } else {
                    // too late message/warning not found
                    dLog("next step button clicked, toast message not found");
                }
            } else {
                dLog("next step button clicked, toast message not checked");
            }

            if (checkMessageBox == false) {
                dLog("next step button clicked, message box not checked, move to next stage", nextStage);
                //
                setStage(nextStage);
                mStates["clickNext"].state = "disabled-btn";
                mStates["clickNext"].stepCount = 0;
                return true;
            }

            var messageBox = document.getElementsByClassName(glMessageBoxClass)[0]
            // var mb = document.getElementsByClassName(glMessageBoxClass)

            // ///////
            // dLog("glMessageBoxClass:", glMessageBoxClass)
            // console.dir(mb)
            ////

            if (messageBox != undefined) {
                // dLog("messageBox.style.zIndex", messageBox.style.zIndex)
                // dLog("messageBox.style.display", messageBox.style.display)
                // console.dir(messageBox)
                if (mStates["clickNext"].stepCount > 55 && messageBox.style.display != "block") {
                    dLog("messageBox.style.display force to block: ", messageBox.style.display)
                    messageBox.style.display = "block"
                }
                if (messageBox.style.zIndex > 0 && messageBox.style.display != "none") {

                    if (messageBox.innerText.indexOf("离开始使用时间已不足") > 0) {
                        // innerText: "提示\n您选择的场次时段，离开始使用时间已不足6小时，若下单成功后，不可退、换，请谨慎下单！确认继续？\n取消\n确认"
                        dLog("invalid segments, they are too late")
                        machineMessageBox("时段选择错误，请向开发者报告此问题")
                        setStage("idle");
                        mStates["clickNext"].state = "disabled-btn";
                        mStates["clickNext"].stepCount = 0;
                        return;
                    }
                    dLog("next step button clicked, message box showed, goto", nextStage);
                    //
                    setStage(nextStage);
                    mStates["clickNext"].state = "disabled-btn";
                    mStates["clickNext"].stepCount = 0;
                    return true;
                } else {
                    dLog("next step button clicked, message box still hidden");
                }
            } else {
                dLog("next step button clicked, message box not found, re-try for", nextStage);
            }
            if (mStates["clickNext"].stepCount > 2000) {
                dLog("next step button clicked, message box not found, give up");

                setStage("error");

                mStates["clickNext"].state = "disabled-btn";
                mStates["clickNext"].stepCount = 0;

            }
            return;
        }

        return;
    }

    var glAgreeBtnClass = "el-button full-width"

    function clickAgree(nextStage) {

        if (mStates["clickAgree"] == undefined) {
            mStates["clickAgree"] = { state: "messageBox", stepCount: 0, clickCount: 0 };
        }

        if (mStates["clickAgree"].stepCount > 30) {
            dLog("mState:", mStates["clickAgree"].state);
        }

        var messageBox = document.getElementsByClassName(glAgreeBtnClass)[0]
        var mb = document.getElementsByClassName(glAgreeBtnClass)

        // if (messageBox == undefined) {
        //     // mobile
        //     // van-dialog__message van-dialog__message--has-title
        //     messageBox = document.getElementsByClassName("van-dialog__message van-dialog__message--has-title")[0];
        //     mb = document.getElementsByClassName("van-dialog__message van-dialog__message--has-title")
        // }
        // dLog("agree messageBox:")
        // console.dir(mb)
        // console.dir(messageBox)

        // if (messageBox != undefined) {
        //     console.dir(messageBox.style.display)
        //     console.dir(messageBox.style.zIndex)
        // }

        var agreeBtn = document.getElementsByClassName(glAgreeBtnClass)[0]
        // console.dir(document.getElementsByClassName(glAgreeBtnClass));

        // dLog("agreeBtn:")
        // console.dir(agreeBtn)

        mStates["clickAgree"].stepCount++;

        if (mStates["clickAgree"].stepCount > 1000 && mStates["clickAgree"].clickCount == 0 && (messageBox == undefined || agreeBtn == undefined)) {
            setStage("error");
            mStates["clickAgree"] = { state: "messageBox", stepCount: 0, clickCount: 0 };
            dLog("failed to accept agreement");
            return;
        }

        if (messageBox == undefined) {
            dLog("message box for agree not found, re-try", mStates["clickAgree"].stepCount);
            return
        }
        if (agreeBtn == undefined) {
            dLog("agree button not found, re-try", mStates["clickAgree"].stepCount);
            return;
        }

        if (mStates["clickAgree"].state == "messageBox") {
            // wait for messageBox shows up
            if (messageBox == undefined) {
                dLog("waiting for agree box shows up:", mStates["clickAgree"].stepCount)
                return;
            } if (messageBox.style.display == "none" || messageBox.style.display == "" || messageBox.style.zIndex == "") {
                // console.dir(messageBox.style.display)
                // console.dir(messageBox.style.zIndex)
                messageBox.style.display = "block"
                messageBox.style.zIndex = getMaxZIndex();
                messageBox.scrollTop = messageBox.scrollHeight
                // console.dir(messageBox.style.display)
                // console.dir(messageBox.style.zIndex)
                // console.dir(messageBox)
                dLog("waiting for agree box(force up):", mStates["clickAgree"].stepCount, "scrollTop", messageBox.scrollTop, "scrollHeight", messageBox.scrollHeight)
                // return;
            }
            mStates["clickAgree"].state = "clickAgree"
            dLog("scrolling agree box:", mStates["clickAgree"].stepCount, "scrollTop", messageBox.scrollTop, "scrollHeight", messageBox.scrollHeight)
            messageBox.scrollTop = messageBox.scrollHeight
            // continue
        }

        if (mStates["clickAgree"].clickCount > 5 && (messageBox == undefined || messageBox.style.display == "none" || messageBox.style.display == "" || messageBox.style.zIndex == "")) {
            console.dir(mStates["clickAgree"].stepCount)
            console.dir(messageBox.style.display)
            console.dir(messageBox.style.zIndex)
            console.dir(messageBox)
            // after click

            dLog("agree button clicked and messageBox gone, move to", nextStage)
            // console.dir(mb)
            // console.dir(messageBox)
            // if (messageBox != undefined) {
            //     console.dir(messageBox.style.display)
            //     console.dir(messageBox.style.zIndex)
            // }

            setStage(nextStage);

            mStates["clickAgree"] = { state: "messageBox", stepCount: 0, clickCount: 0 };
            return true;
        }

        var doClick = false;
        if (messageBox.scrollHeight == 0 && mStates["clickAgree"].stepCount > 5) {
            dLog("agree button clicked, waiting for pricePage", mStates["clickAgree"].clickCount, mStates["clickAgree"].stepCount)
            if (mStates["clickAgree"].stepCount > 10000) {
                dLog("error: wait for price page timeout")
                setStage("error")
            }
        } else {
            if (messageBox.scrollTop != messageBox.scrollHeight) {
                if (mStates["clickAgree"].stepCount > 15) {
                    dLog("try to scroll agree", mStates["clickAgree"].stepCount, "scrollTop", messageBox.scrollTop, "scrollHeight", messageBox.scrollHeight)
                }
                // console.dir(messageBox);
                messageBox.scrollTop = messageBox.scrollHeight;
                // if (preTop == 0 && mStates["clickAgree"].stepCount < 20 && preTop != messageBox.scrollHeight) {
                //     dLog("scrolling agree", mStates["clickAgree"].stepCount, "scrollTop", preTop, messageBox.scrollTop, "scrollHeight", messageBox.scrollHeight)
                //     return;
                // } else {
                //     dLog("failed to scrolling agree", mStates["clickAgree"].stepCount, "scrollTop", preTop, messageBox.scrollTop, "scrollHeight", messageBox.scrollHeight)
                // }
            } else {
                dLog("scroll agree ok, wait for accept", mStates["clickAgree"].stepCount, "scrollTop", messageBox.scrollTop, "scrollHeight", messageBox.scrollHeight)
                // 18:49:28.496 m:agree scroll agree ok, wait for accept 1 scrollTop 0 scrollHeight 34
                doClick = true
            }

            if (agreeBtn.classList.contains("read-time-disabled")) {
                agreeBtn.classList.remove("read-time-disabled");
                agreeBtn.removeAttribute('disabled');

                dLog("agree button force to active", mStates["clickAgree"].stepCount);

                // if (mStates["clickAgree"].stepCount > 3 && isLocalhost()) {
                //     dLog("force active agree button for localhost");
                //     agreeBtn.classList.remove("read-time-disabled");
                //     agreeBtn.removeAttribute('disabled');
                // } else if (mStates["clickAgree"].stepCount > 10) {
                //     dLog("force active agree button for scroll failed");
                //     agreeBtn.classList.remove("read-time-disabled");
                //     agreeBtn.removeAttribute('disabled');
                // } else {
                //     dLog("waiting for agree button active", mStates["clickAgree"].stepCount);
                // }
                return;
            }
            // if (mStates["clickAgree"].stepCount > 5 && mStates["clickAgree"].stepCount < 50) {
            //     dLog("agree button active, try to click", mStates["clickAgree"].stepCount);
            // }
            var forceDo = false;
            if (doClick == false) {
                if (mStates["clickAgree"].stepCount > 45 || mStates["clickAgree"].stepCount % 5 == 0) {
                    forceDo = true;
                    dLog("force agree for repeat count", mStates["clickAgree"].stepCount)
                } else if (mStates["clickAgree"].stepCount >= 15 && messageBox.scrollHeight < 100) {
                    dLog("force agree for scrollTop", messageBox.scrollTop, "scrollHeight < 100", messageBox.scrollHeight, mStates["clickAgree"].stepCount)
                    forceDo = true;
                } else if (mStates["clickAgree"].stepCount >= 5 && messageBox.scrollTop > 100 && messageBox.scrollHeight > 100) {
                    dLog("force agree for scrollTop", messageBox.scrollTop, "scrollHeight > 100", messageBox.scrollHeight, mStates["clickAgree"].stepCount)
                    forceDo = true;
                }
            }
            if (forceDo && (mStates["clickAgree"].stepCount % 5 == 0 || agreeBtn.clicked == undefined)) {
                doClick = true
            }
            if (doClick) {
                dLog("agree button active, try to click", mStates["clickAgree"].stepCount);
                if (agreeBtn.click == undefined) {
                    dLog("agree button click() undefined")
                    console.dir(agreeBtn)
                } else {
                    if (typeof agreeBtn.click === "function") {
                        agreeBtn.click();
                        agreeBtn.clicked = true;
                        mStates["clickAgree"].clickCount++;
                        if (mStates["clickAgree"].clickCount < 50) {
                            dLog("agree button clicked", mStates["clickAgree"].clickCount)
                            // may click more then one times
                        }
                        // console.dir(agreeBtn)
                    } else {
                        dLog("agreeBtn.click not existed")
                        // console.dir(agreeBtn)
                    }
                }
            } else {
                // dLog("waiting for scrolling ...", mStates["clickAgree"].stepCount)
            }
        }
        return;
    }

    var glSelectingUrl = "https://lhqkl.ydmap.cn/booking/schedule/103909?salesItemId=102914";
    var glOrder2Url = "https://lhqkl.ydmap.cn/order2"
    var glProfileUrl = "https://lhqkl.ydmap.cn/user/my"

    if (isLocalhost()) {
        glSelectingUrl = "/selecting.html";
        glOrder2Url = "/order2.html";
        glProfileUrl = "/profile.html";
    }

    var availableDiv = document.createElement("div");
    availableDiv.setAttribute("style", `
        display: flex;
        flex-direction: column;
        width: 100%;
        margin-top: 4px;
        margin-bottom: 4px;
        background-color: #eeeeed;
        color:#1ABC9C;
        font-size:16px;
        position:relative;
        text-align: left;
        vertical-align: top;
        `
    );
    availableDiv.setAttribute("id", "availableDiv");
    var cellsInfoText = new String("场地信息");
    availableDiv.innerHTML = `
            <div style="display: block; width: 100%;"><hr></div>
        <div style="display: block; width: 100%;">
            <div style="display: flex;">
                <div id="glUpdaterSwitch" style="background-color: #eeeeed;flex-grow: 20;text-align: center;">场地信息</div>
            </div>
        </div>
        
        <div style="display: block; width: 100%;"><hr></div>
        `;

    function SetAvailableTableTitle(params) {
        var sw = document.getElementById("glUpdaterSwitch");
        if (sw == undefined) {
            return;
        }
        if (glUpdaterSwitch) {
            sw.innerHTML = cellsInfoText + "(" + availableCells.size + ")";
        } else {
            sw.innerHTML = cellsInfoText.strike() + "(" + availableCells.size + ")";
        }
    }

    var availableTable = document.createElement("table");
    availableTable.setAttribute("id", "availableTable");
    availableTable.setAttribute("style", "font-size:13px;text-align: left;vertical-align: top;");

    function NextDate(autoStartTime) {
        var err = isValidTime(autoStartTime);
        if (err != "") {
            err = "error: autoStartTime: " + err;
            dLog(err);
            return err;
        }

        var date = new Date(); // current time
        var ts = date.getTime();

        var dArr = date.toUTCString().split(" ");

        var nDate = new Date(dArr[0] + " " + dArr[1] + " " + dArr[2] + " " + dArr[3] + " " + autoStartTime + " " + dArr[5]);
        if (nDate == undefined || nDate == "Invalid Date") {
            err = "error: NextDate: " + autoStartTime;
            dLog(err);
            return err;
        }
        return nDate;
    }
    //
    var glAutoBookTs = -1;
    function autoStartTimer(autoStartTime) {
        glAutoBookTs = -1;
        var err = isValidTime(autoStartTime);
        if (err != "") {
            err = "error: autoStartTime: " + err;
            dLog(err);
            return err;
        }

        var hours8 = 8 * 60 * 60 * 1000; // China, GMT + 8

        var nDate = NextDate(autoStartTime)
        if (typeof nDate.getTime !== 'function') {
            err = "error: autoStartTime : " + nDate;
            dLog(err);
            return err;
        }
        var nTs = nDate.getTime()

        var date = new Date(); // current time
        var ts = date.getTime();

        nTs = nTs - hours8;
        var timeout = nTs - ts;
        while (timeout <= 0) {
            nTs = nTs + 86400000; // 1 day
            nDate = new Date(nTs + hours8)
            timeout = timeout + 86400000;
        }
        dLog("info: auto book will trigger at", replaceAll(nDate.toUTCString(), " GMT", ""), Math.round(timeout / 1000), "seconds later");
        glAutoBookTs = (new Date()).getTime() + timeout

        // return empty string for all ok
        return ""
    }
    //

    function selectContact(nextStage) {

        if (mStates["selectContact"] == undefined) {
            mStates["selectContact"] = { state: "clickOnContact", stepCount: 0 };
        }

        dLog("mState:", mStates["selectContact"].state);

        var contactItems = document.getElementsByClassName("contact-item");
        // console.dir(contactItems);
        if (contactItems == undefined || contactItems.length == 0) {
            mStates["selectContact"].stepCount++;
            dLog("waiting for contact items show up ...", mStates["selectContact"].stepCount)
            if (mStates["selectContact"].stepCount > 200) {
                setStage("error");
                mStates["selectContact"].state = "clickOnContact";
                mStates["selectContact"].stepCount = 0;
                dLog("give up when waiting for contact items show up");
            }
            return;
        }

        var isContactOk = document.getElementsByClassName("el-checkbox checkbox_radius is-checked")
        console.dir(isContactOk);
        if (isContactOk !== undefined && isContactOk.length > 0) {
            dLog("contact selected, shit to next stage", nextStage);
            //
            setStage(nextStage);
            mStates["selectContact"].state = "clickOnContact";
            mStates["selectContact"].stepCount = 0;
            return;
        }

        if (mStates["selectContact"].state == "checked") {
            mStates["selectContact"].stepCount++;

            if (mStates["selectContact"].stepCount > 1000) {
                setStage("error");
                mStates["selectContact"].state = "clickOnContact";
                mStates["selectContact"].stepCount = 0;
                dLog("give up on waiting for click take effect");
            }
            return;
        } else if (mStates["selectContact"].state == "clickOnContact") {
            mStates["selectContact"].stepCount++;

            var contactList = document.getElementsByClassName("el-checkbox checkbox_radius")
            // console.dir(contactList);
            if (contactList.length == 0) {
                mStates["selectContact"].stepCount++;
                dLog("contact-item not found", mStates["selectContact"].stepCount);
                if (mStates["selectContact"].stepCount > 2000) {
                    dLog("contact-item not found, give up");
                    setStage("error");
                    mStates["selectContact"].stepCount = 0;
                }
                return;
            }
            // last one
            var nextBtn = contactList[contactList.length - 1]

            nextBtn.click();
            dLog("last contact-item clicked")

            mStates["selectContact"].state = "checked";
            mStates["selectContact"].stepCount = 0;
            return;
        }
        dLog("unknown machine state:", mStates["selectContact"].state, mStates["selectContact"]);
        setStage("error");
        return;
    }

    //////// LEGACY ///////////


    // author: meizz
    // glDate.Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // glDate.Format("yyyy-M-d h:m:s.S")   ==> 2006-7-2 8:9:4.18
    // var date = new Date().Format("yyyy-MM-dd-hh-mm-ss"); // format needs lib.js
    Date.prototype.Format = function (fmt) {
        var ms = this.getMilliseconds();
        if (ms < 10) {
            ms = "00" + ms
        } else if (ms < 100) {
            ms = "0" + ms
        }
        var o = {
            "M+": this.getMonth() + 1, //⽉份
            "d+": this.getDate(), //⽇
            "h+": this.getHours(), //⼩时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": ms //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    var dLogDiv = document.createElement("div");
    dLogDiv.setAttribute("style", "margin-top: 4px;margin-bottom: 4px;background-color: #eeeeed;color:#1ABC9C;font-size:16px;position:relative;text-align: center;");
    dLogDiv.setAttribute("id", "dLogDiv");

    var dLogTable = document.createElement("table");
    dLogTable.setAttribute("id", "dLogTable");
    dLogTable.setAttribute("style", "background-color: #eeeeed;color:#1ABC9C;font-size:12px;text-align: left;vertical-align: top;");

    dLogDiv.appendChild(dLogTable);

    var DualLogLimit = 5;
    var stDualLogLines = [];
    var glLogShowLines = 2;
    var initLogShowLines = glLogShowLines;

    var stStage = "init"

    dLogDiv.onclick = function () {
        if (glLogShowLines == initLogShowLines) {
            glLogShowLines = glLogShowLines + 2
        } else {
            glLogShowLines = initLogShowLines
        }
        // refresh
        dLog();
        // dLog("glLogShowLines", glLogShowLines)
    };

    function dLogClearDiv() {
        // clear
        dLogTable.innerHTML = `
            <tbody>
            </tbody>
            `;
    }

    var preText = ""
    function dLog(...args) {
        // glDate.Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
        var ts = glDate.Format("hh:mm:ss.S") // ==> 2006-07-02 08:09:04.423

        // debugger;
        if (arguments.length > 0) {
            var text = ""
            for (let index = 0; index < arguments.length; index++) {
                const element = arguments[index];
                if (text == "") {
                    text = element
                } else {
                    text = text + " " + element;
                }
                // dLog(ts, "dLog-in:", stDualLogLines.length, element);
            }
            if (preText == (text + "/" + text)) {
                // duplicated
                return;
            }
            if (preText == text) {
                preText = (text + "/" + text)
            } else {
                preText = text
            }
            text = ts + " " + "m:" + glEngineInterval + ": " + glPage.name + "/" + stStage + " " + text
            stDualLogLines.unshift(text);
            console.log(text);

            if (stDualLogLines.length > DualLogLimit) {
                for (let index = stDualLogLines.length; index > DualLogLimit; index--) {
                    stDualLogLines.pop();
                }
            }
        }

        dLogClearDiv();

        var ptr = glLogShowLines - 1
        if (ptr > (stDualLogLines.length - 1)) {
            ptr = stDualLogLines.length - 1
        }
        for (let index = ptr; index >= 0; index--) {
            dLogTable.insertRow(-1).insertCell(-1).innerHTML = stDualLogLines[index];
        }

    }

    function getMaxZIndex() {
        return Math.max(
            ...Array.from(document.querySelectorAll('body *'), el =>
                parseFloat(window.getComputedStyle(el).zIndex),
            ).filter(zIndex => !Number.isNaN(zIndex)),
            0,
        );
    }

    //
    function shuffleArray(array) {
        let curId = array.length;
        // There remain elements to shuffle
        while (0 != curId) {
            // Pick a remaining element
            let randId = Math.floor(Math.random() * curId);
            curId -= 1;
            // Swap it with the current element.
            let tmp = array[curId];
            array[curId] = array[randId];
            array[randId] = tmp;
        }
        return array;
    }

    // return all matched node
    function textMatch(childNodes, exactMatch, text) {
        var matchArr = [];
        matchArr.TextIn = text;
        for (let index = 0; index < childNodes.length; index++) {
            const childNode = childNodes[index];
            if (childNode.innerText == undefined) {
                continue;
            }
            if (exactMatch) {
                if (childNode.innerText.trim(" ") === text) {
                    matchArr.push(childNode);
                }
            } else if (childNode.innerText.indexOf(text) >= 0) {
                matchArr.push(childNode);
            }
            var childArr = textMatch(childNode.childNodes, exactMatch, text);
            for (let index = 0; index < childArr.length; index++) {
                const childNode = childArr[index];
                matchArr.push(childNode);
            }
        }
        return matchArr;
    }

    // return all matched node
    function classNameMatch(childNodes, exactMatch, className) {
        var matchArr = [];
        matchArr.ClassIn = className;
        for (let index = 0; index < childNodes.length; index++) {
            const childNode = childNodes[index];
            if (childNode.className == undefined) {
                continue;
            }
            if (exactMatch) {
                if (childNode.className.trim(" ") === className) {
                    matchArr.push(childNode);
                }
            } else if (childNode.className.indexOf(className) >= 0) {
                matchArr.push(childNode);
            }
            var childArr = classNameMatch(childNode.childNodes, exactMatch, className);
            for (let index = 0; index < childArr.length; index++) {
                const childNode = childArr[index];
                matchArr.push(childNode);
            }
        }
        return matchArr;
    }

    //
    // exactMatch will effect text compare
    function getElementsByClassesAndContent(classArray, exactMatch, matchAll, text) {
        if (text == "") {
            return classesMatch(classArray, exactMatch, matchAll)
        }
        return textMatch(classesMatch(classArray, exactMatch, matchAll), exactMatch, text);
    }

    // match classes and return elements
    function classesMatch(classArray, exactMatch, matchAll) {
        var matchElement = [];
        matchElement.byClass = new Map();
        matchElement.allMatched = false;

        if (classArray[0] == undefined) {
            return matchElement;
        }
        if (exactMatch != true) {
            exactMatch = false;
        }
        if (matchAll != true) {
            matchAll = false;
        }

        for (let index = 0; index < classArray.length; index++) {
            const oneClass = classArray[index];
            if (matchElement.byClass.has(oneClass) == false) {
                matchElement.byClass.set(oneClass, []);
            }
            // if ("text-center counter-warning" == oneClass) {
            //     debugger
            // }
            var elements = document.getElementsByClassName(oneClass);
            // if ("text-center counter-warning" == oneClass) {
            //     dLog("getElementsByClassName for", oneClass, elements);
            //     console.dir(elements)
            // }
            if (elements[0] == undefined) {
                // if ("text-center counter-warning" == oneClass) {
                //     dLog("elements not found for", oneClass);
                // }
                continue;
            }
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                if (exactMatch) {
                    if (element.className === oneClass) {
                        matchElement.push(element);
                        matchElement.byClass.get(oneClass).push(element);
                        // if ("text-center counter-warning" == oneClass) {
                        //     dLog("elements exactly match for", oneClass, element);
                        //     console.dir(matchElement);
                        // }
                        if (matchAll == false) {
                            return matchElement;
                        }
                    } else {
                        // if ("text-center counter-warning" == oneClass) {
                        //     dLog("elements not exactly match for", oneClass, element);
                        // }
                    }
                } else {
                    matchElement.push(element);
                    matchElement.byClass.get(oneClass).push(element);
                    // if ("text-center counter-warning" == oneClass) {
                    //     dLog("elements match for", oneClass, element);
                    //     console.dir(matchElement);
                    // }
                    if (matchAll == false) {
                        return matchElement;
                    }
                }
            }
        }
        matchElement.allMatched = true;
        for (let index = 0; index < classArray.length; index++) {
            const oneClass = classArray[index];
            if (matchElement.byClass.get(oneClass).length == 0) {
                matchElement.allMatched = false;
                // dLog("element not found for", oneClass);
            }
        }
        return matchElement;
    }

    function isLocalhost() {
        if (window.location.hostname == "127.0.0.1") {
            return true;
        } else if (window.location.hostname == "localhost") {
            return true;
        } else if (window.location.hostname == "p8000.f2layer.link") {
            return true;
        } else if (window.location.hostname == "p8001.f2layer.link") {
            return true;
        } else if (window.location.hostname == "p8002.f2layer.link") {
            return true;
        } else if (window.location.hostname == "p8003.f2layer.link") {
            return true;
        } else if (window.location.hostname == "p8004.f2layer.link") {
            return true;
        } else if (window.location.hostname == "p8005.f2layer.link") {
            return true;
        }
        return false;
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function replaceAll2(string, search, replace) {
        return string.split(search).join(replace);
    }

    function replaceAll(string, search, replace) {
        var old = string
        do {
            old = string
            string = string.replace(search, replace)
        } while (old != string);
        return string
    }

    // 08:00 10:00
    function segmentSub(t1, t2) {
        if (t1 == "" || t2 == "" || t1.indexOf(":") < 0 || t2.indexOf(":") < 0) {
            // invalid segment
            return 0;
        }
        var a1 = t1.split(":");
        var a2 = t2.split(":");
        if (a1.length < 2 || a2.length < 2 || isNaN(a1[0]) || isNaN(a1[1]) || isNaN(a2[0]) || isNaN(a2[1])) {
            // invalid segment
            return 0;
        }
        var s1 = (a2[0] - a1[0]) * 60 * 60;
        var s2 = a2[1] - a1[1];
        var sub = s2 + s1;
        // dLog("segmentSub:", t1, t2, sub)
        return sub;
    }

    // "09:00-10:00", "08:00-09:00"
    // "10:00-10:30", "09:00-09:30"
    // 16:00-16:30 17:00-17:30
    function isContinueSegment(t1, t2) {
        if (t1 == undefined || t2 == undefined) {
            return false;
        }
        if (t1 == t2) {
            return false
        }
        var a1 = t1.split("-");
        var a2 = t2.split("-");
        // "09:00-10:00", "08:00-09:00"
        if (a1[0] == a2[1] || a1[1] == a2[0]) {
            return true;
        }
        if (t1.indexOf(":") == -1 && t2.indexOf(":") == -1) {
            // "10-10", "09-09"
            // if (a1[0] == 16) {
            //     console.dir(a1)
            //     console.dir(a2)
            //     console.dir(((+a1[0] || 0) + 1))
            //     console.dir(((+a1[0] || 0) - 1))
            // }
            // 一元（+）运算符，在任何字符串将显式类型强制从String类型强制转换为Number类型之前，如果字符串的第一个字符不是有效数字，则返回NaN，否则返回有效数字
            if (((+a1[0] || 0) + 1) == a2[0] || ((+a1[0] || 0) - 1) == a2[0]) {
                return true
            }
            return false
        }
        // NOT continue segment in  16:00-16:30 17:00-17:30 16:00-16:30 40 元 03 号场 -501 17:00-17:30 40 元 03 号场 -401
        // continue segment in  16:00-16:30 15:00-15:30 16:00-16:30 40 元 14 号场 -501 15:00-15:30 40 元 14 号场 -601
        if (t1.indexOf(":30") != 8 || t2.indexOf(":30") != 8) {
            return false
        }
        // "10:00-10:30", "09:00-09:30"
        t1 = replaceAll(t1, ":30", ":00")
        t2 = replaceAll(t2, ":30", ":00")
        // "10:00-10:00", "09:00-09:00"
        t1 = replaceAll(t1, ":00", "")
        t2 = replaceAll(t2, ":00", "")
        // "10-10", "09-09"
        return isContinueSegment(t1, t2);
    }

    function isMobile(params) {
        /* Storing user's device details in a variable*/
        let details = navigator.userAgent;

        /* Creating a regular expression
        containing some mobile devices keywords
        to search it in details string*/
        let regexp = /android|iphone|kindle|ipad/i;

        /* Using test() method to search regexp in details
        it returns boolean value*/
        let isMobileDevice = regexp.test(details);

        if (isMobileDevice) {
            dLog("<h3>Its a Mobile Device !</h3>");
            return true;
        } else {
            dLog("<h3>Its a Desktop !</h3>");
            return false;
        }
    }

    function isValidTime(text) {
        if (text == "") {
            return "empty";
        }
        var tArr = text.split(":");
        if (tArr.length < 3) {
            return "format error: " + text;
        }
        if (isNaN(tArr[0]) || isNaN(tArr[1]) || isNaN(tArr[2])) {
            return "not a number: " + text;
        }
        if (tArr[0] > 24 || tArr[1] > 59 || tArr[2] > 59) {
            return "number overflow: " + text;
        }
        return "";
    }
    // lib end -------------------------------------------------------

    var clockBarDiv = document.createElement("div");
    clockBarDiv.setAttribute("style", "margin-top: 4px;margin-bottom: 4px;background-color: #eeeeed;color:#1ABC9C;font-size:16px;position:relative;text-align: center;");
    clockBarDiv.setAttribute("id", "clockBarDiv");
    clockBarDiv.innerHTML = `
        <span id='leftUrlSwitch' style='cursor:grab;background-color:#7bd198;color:red;font-size:16px;'>&nbsp; 简 &nbsp;</span>
        <span id='leftConf' style='cursor:grab;background-color:#77dce4;font-size:16px;'>&nbsp; &#x1CC1; &nbsp;</span>
        <span id='leftOrder' style='cursor:grab;background-color:#77dce4;font-size:16px;'>&nbsp; O &nbsp;</span>
        <span id='leftProfile' style='cursor:grab;background-color:#77dce4;font-size:16px;'>&nbsp; P &nbsp;</span>
        <span style='background-color: #eeeeed;'></span>
        <span id='clockText'>00/00/0000, 00:00:00</span>
        <span style='background-color: #eeeeed;'></span>
        <span id='rightReset' style='cursor:grab;background-color:#7bd198;'>&nbsp; R &nbsp;</span>
        <span id='rightConf' style='cursor:grab;background-color:#7bd198;'>&nbsp; &#x2699; &nbsp;</span>
        <span id='rightStartStop' style='cursor:grab;background-color:#7bd198;'>&nbsp; <span id='machineSwitch' style='cursor:grab;color:red;'>&#9607;</span> &nbsp;</span>
        `;

    var glToStartSym = "&#9654;"
    var glToStopSym = "&#9607;"

    // vars

    var glAutoBook = false;
    var glBookingCount = 0;
    var glResetCellsCount = 0;
    //
    var siteIdentInfo = [
        {
            selectingUrl: "https://lhqkl.ydmap.cn/booking/schedule/103909?salesItemId=102976",
            order2Url: "https://lhqkl.ydmap.cn/order2",
            profileUrl: "https://lhqkl.ydmap.cn/user/my",
            name: "简上体育",
            Items: "---",
            classes: ["time-left"],
            texts: ["开场前6小时可退"],
            index: 0,
            hint: "&nbsp; 简 &nbsp;",
        },
        {
            selectingUrl: "https://lhqkl.ydmap.cn/booking/schedule/104367?salesItemId=103764",
            order2Url: "https://lhqkl.ydmap.cn/order2",
            profileUrl: "https://lhqkl.ydmap.cn/user/my",
            name: "文体中心",
            Items: "---",
            classes: ["time-left"],
            texts: ["开场前30分可退"],
            index: 1,
            hint: "&nbsp; 文 &nbsp;",
        },
        {
            selectingUrl: "https://ftty.ydmap.cn/booking/schedule/101331?salesItemId=100339",
            order2Url: "https://ftty.ydmap.cn/order2",
            profileUrl: "https://ftty.ydmap.cn/user/my",
            name: "福田体育",
            Items: "---",
            classes: ["time-left"],
            texts: ["开场前24小时可退"],
            index: 2,
            hint: "&nbsp; 福 &nbsp;",
        },
    ];

    // order is important
    var pageList = [{
        name: "localhost-baidu.com-Page",
        classes: [
            "s_form_wrapper soutu-env-nomac soutu-env-newindex",
            "s_form_wrapper localhost-baidu"
        ],
    }, {
        name: "baidu.com-Page",
        classes: [
            "s_form_wrapper soutu-env-nomac soutu-env-newindex"
        ],
    }, {
        name: "busyPage",
        classes: [
            "wrapper",
        ],
        texts: ["当前用户人数过多"],
    }, {
        name: "profilePage",
        classes: [
            // "el-card profile-panel-card is-never-shadow profile-panel-protruding",
            "profile-name",
        ],
        texts: ["账户", "卡券"],
    }, {
        name: "homePage",
        classes: [
            "footer",
        ],
        texts: ["一键预约"],
    }, {
        name: "order2Page",
        classes: [
            "container", "flex",
        ],
        texts: ["全部订单"],
    }, {
        name: "cellTablePage-20240904",
        classes: [
            "slider-item text-center",
            "slider-item text-center selected",
            "schedule-table__header-wrapper",
            "slider-box slider-box-datetime",
        ],
        texts: ["羽毛球"],
    }, {
        name: "cellTablePage",
        classes: [
            "slider-item text-center",
            "money text-left",
            "dt datetime",
            "dt week",
            "item-menu",
            "agreement-box",
        ],
        texts: ["羽毛球", "订场须知"],
    }, {
        name: "pricePage",
        classes: [
            "item-content",
            "el-card__body",
            "money text-left"
        ],
        texts: ["场地", "已选", "共计"],
    }, {
        name: "waitForPayPage",
        classes: [
            "el-card__header",
        ],
        texts: ["支付方式"],
    }, {
        name: "freeDonePage",
        classes: [
            "el-card card-status text-center is-never-shadow",
            "el-button full-width shadow-button el-button--primary",
            "item-ctt-title flex jc-between"
        ],
        texts: ["已完成", "邀请同伴"],
    }, {
        name: "loginPage",
        classes: [
            "flex jc-between agreement-links",
            "el-button full-width el-button--primary el-button--large is-round",
        ],
        texts: ["马上登录"],
    }, {
        name: "contactListPage",
        classes: [
            "el-checkbox__inner",
            "el-button full-width primary-button el-button--text",
            "descr-style-basic contact-content", // key class
        ],
        texts: ["手机号", "下一步"],
    }, {
        name: "contactManagePage",
        classes: [
            "text-center bottom-text",
            "descr-style-basic contact-content", // key class
        ],
        texts: ["手机号", "没有更多数据了"],
    }];

    var glPage = {
        name: "initPage",
        classes: ["contact-body"],
        stage: "init",
    };

    var glSite = siteIdentInfo[0]; // jianshang

    // app.js
    //
    var bookStorage = window.localStorage;
    var stBookingCells = []; // cells array with order
    var stMaxBatchCells = 2;

    var stAutoSelect = "no";

    var stPrioritySegmentOnly = false;
    var stPriorityColumnsOnly = false
    var stContinueWanted = true;
    var stAutoBookByTrigger = false
    var stShufflePriorityColumns = true;

    var priorityColumns = new Map(); // 2,3,6,7,10,11,14
    function priorityColumnsReset(show) {
        // [4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 17, 19]
        priorityColumns.clear();
        // random order // 2 3 6 7 10 11
        var pArray = replaceAll(stPriorityColumnString, " ", "").split(",");
        // dLog("priorityColumns:", pArray)
        if (pArray == undefined) {
            pArray = [];
        }
        var hint = "shuffle, priorityColumns:"
        if (stShufflePriorityColumns) {
            shuffleArray(pArray).forEach(cellColumn => {
                priorityColumns.set(cellColumn, null);
            });
        } else {
            hint = "orig, priorityColumns:"
            pArray.forEach(cellColumn => {
                priorityColumns.set(cellColumn, null);
            });
        }
        priorityColumns.forEach((values, cellColumn) => {
            hint = hint + " " + cellColumn
        });
        if (show === true) {
            dLog(hint)
        }
    }

    var prioritySegments = new Map();

    function prioritySegmentsReset(params) {
        // var prioritySegments = ["09:00-10:00", "08:00-09:00", "14:00-15:00", "13:00-14:00", "10:00-11:00", "11:00-12:00", "12:00-13:00"]
        // var prioritySegments = ["09:00-10:00", "08:00-09:00", "14:00-15:00", "13:00-14:00", "10:00-11:00", "11:00-12:00", "09:00-09:30", "16:00-16:30"]

        prioritySegments.clear();
        var pArray = replaceAll(stPrioritySegmentString, " ", "").split(",");
        // dLog("prioritySegments:", pArray)
        // "12:00-13:00", excluded
        if (pArray == undefined) {
            pArray = [];
        }
        pArray.forEach(cellSegment => {
            prioritySegments.set(cellSegment, null);
        });
    }

    var excludeSegments = new Map();
    function excludeSegmentsReset(params) {
        excludeSegments.clear();
        var pArray = replaceAll(stExcludeSegmentString, " ", "").split(",");
        // dLog("excludeSegments:", pArray)
        // "12:00-13:00", excluded
        if (pArray == undefined) {
            pArray = [];
        }
        pArray.forEach(cellSegment => {
            excludeSegments.set(cellSegment, null);
        });
    }

    var availableCells = new Map(); // key: cellColumn-cellSegment, value: childNode
    var stExcludes = [];

    var glLoadStorageErr = null;
    function loadStorage(params) {
        glLoadStorageErr = null;
        // load saved data
        try {

            // load logger data first
            var text = bookStorage.getItem("stDualLogLines");
            stDualLogLines = JSON.parse(text);
            if (stDualLogLines == undefined || stDualLogLines == null) {
                stDualLogLines = [];
                dLog("localStorage: stDualLogLines not found")
            }
            // dLog("localStorage, stDualLogLines:\n");
            // console.dir(text);
            // console.dir(stDualLogLines);

            // dLog("bookStorage.length", bookStorage.length);
            // let keys = Object.keys(bookStorage);
            // for (let key of keys) {
            //     dLog(`${key}: ${localStorage.getItem(key)}`);
            // }

            var text = bookStorage.getItem("stBookingCells");
            if (text == "" || text == null) {
                stBookingCells = [];
            } else {
                stBookingCells = JSON.parse(text);
                if (stBookingCells == undefined || stBookingCells == null) {
                    dLog("localStorage: stBookingCells not found")
                    stBookingCells = [];
                }
            }

            // dLog("localStorage, stBookingCells:\n");
            // console.dir(text);
            // console.dir(stBookingCells);

            var text = bookStorage.getItem("stExcludes");
            if (text == "" || text == null) {
                stExcludes = []
            } else {
                stExcludes = JSON.parse(text);
                for (let index = 0; index < stExcludes.length; index++) {
                    const element = stExcludes[index];
                    var kvArr = element.split("@")
                    if (kvArr.length < 2) {
                        dLog("invalid exclude text:", element)
                        console.dir(kvArr)
                        continue
                    }
                    excludedSegments.set(kvArr[0], kvArr[1]);
                }
                // dLog("localStorage, stExcludes:\n");
                // console.dir(text);
                // console.dir(stExcludes);
                // console.dir(excludedSegments);

            }

            stStage = bookStorage.getItem("stStage");
            if (stStage == undefined || stStage == null) {
                dLog("localStorage: stStage not found")
                setStage("selecting")
                glLoadStorageErr = "new"
            }
            if (stStage == "error" || stStage == "idle") {
                setStage("selecting")
            }
            setStage(stStage);
            // dLog("localStorage, stStage:\n");
            // console.dir(stStage);

            stAutoSelect = bookStorage.getItem("stAutoSelect");
            if (stAutoSelect == undefined || stAutoSelect == null) {
                dLog("localStorage: stAutoSelect not found")
                stAutoSelect = "no"
            }
            // dLog("localStorage, stAutoSelect:\n");
            // console.dir(stAutoSelect);
            if (stAutoSelect == "yes") {
                stAutoSelect = "no"
                glAutoBook = true;
            }

            stAutoStartTime = bookStorage.getItem("stAutoStartTime");
            if (stAutoStartTime == undefined || stAutoStartTime == null) {
                dLog("localStorage: stAutoStartTime not found")
                stAutoStartTime = defaultAutoStartTime; // local time
            }
            // dLog("localStorage, stAutoStartTime:\n");
            // console.dir(stAutoStartTime);

            stPriorityColumnString = bookStorage.getItem("stPriorityColumnString");
            if (stPriorityColumnString == undefined || stPriorityColumnString == null) {
                dLog("localStorage: stPriorityColumnString not found")
                stPriorityColumnString = defaultPriorityColumnString;;
            }
            // dLog("localStorage, stPriorityColumnString:\n");
            // console.dir(stPriorityColumnString);

            stPrioritySegmentString = bookStorage.getItem("stPrioritySegmentString");
            if (stPrioritySegmentString == undefined || stPrioritySegmentString == null || stPrioritySegmentString == "null") {
                dLog("localStorage: stPrioritySegmentString not found")
                stPrioritySegmentString = defaultPrioritySegmentString;;
            }
            // dLog("localStorage, stPrioritySegmentString:\n");
            // console.dir(stPrioritySegmentString);

            // stCellType
            stCellType = bookStorage.getItem("stCellType");
            // dLog("localStorage, stCellType:", stCellType);
            if (stCellType == undefined || stCellType == null || stCellType == "null") {
                dLog("localStorage: stCellType not found")
                stCellType = "";
            }

            // stAutoBookStartTs
            stAutoBookStartTs = bookStorage.getItem("stAutoBookStartTs");
            if (stAutoBookStartTs == undefined || stAutoBookStartTs == null || stAutoBookStartTs == "null") {
                dLog("localStorage: stAutoBookStartTs not found")
                stAutoBookStartTs = 0;
            }

            // stAutoBookStopTs
            stAutoBookStopTs = bookStorage.getItem("stAutoBookStopTs");
            if (stAutoBookStopTs == undefined || stAutoBookStopTs == null || stAutoBookStopTs == "null") {
                dLog("localStorage: stAutoBookStopTs not found")
                stAutoBookStopTs = 0;
            }

            // stWaitForPayEsp
            stWaitForPayEsp = bookStorage.getItem("stWaitForPayEsp");
            if (stWaitForPayEsp == undefined || stWaitForPayEsp == null || stWaitForPayEsp == "null") {
                dLog("localStorage: stWaitForPayEsp not found")
                stWaitForPayEsp = 0;
            }

            stExcludeSegmentString = bookStorage.getItem("stExcludeSegmentString");
            if (stExcludeSegmentString == undefined || stExcludeSegmentString == null) {
                dLog("localStorage: stExcludeSegmentString not found")
                stExcludeSegmentString = defaultExcludeSegmentString;
            }
            // dLog("localStorage, stExcludeSegmentString:\n");
            // console.dir(stExcludeSegmentString);

            // stSiteIndex
            stSiteIndex = bookStorage.getItem("stSiteIndex");
            if (stSiteIndex == undefined || stSiteIndex == null) {
                dLog("localStorage: stSiteIndex not found")
                stSiteIndex = 0;
                glLoadStorageErr = "new"
            }
            dLog("localStorage, stSiteIndex:", stSiteIndex);
            glSite = siteIdentInfo[stSiteIndex]
            glSelectingUrl = glSite.selectingUrl
            glOrder2Url = glSite.order2Url
            glProfileUrl = glSite.profileUrl

            dLog("localStorage, glSelectingUrl:", glSelectingUrl);



            stContinueWanted = bookStorage.getItem("stContinueWanted");
            if (stContinueWanted == undefined || stContinueWanted == null || stContinueWanted == "true") {
                stContinueWanted = true;
            } else {
                stContinueWanted = false;
            }
            // dLog("localStorage, stContinueWanted:\n");
            // console.dir(stContinueWanted);

            stAutoBookByTrigger = bookStorage.getItem("stAutoBookByTrigger");
            if (stAutoBookByTrigger == undefined || stAutoBookByTrigger == null || stAutoBookByTrigger == "false") {
                stAutoBookByTrigger = false;
            } else {
                stAutoBookByTrigger = true;
            }
            // dLog("localStorage, stAutoBookByTrigger:\n");
            // console.dir(stAutoBookByTrigger);


            stMaxBatchCells = bookStorage.getItem("stMaxBatchCells");
            if (stMaxBatchCells == undefined || stMaxBatchCells == null) {
                stMaxBatchCells = 2;
            }

            stShufflePriorityColumns = bookStorage.getItem("stShufflePriorityColumns");
            if (stShufflePriorityColumns == undefined || stShufflePriorityColumns == null || stShufflePriorityColumns == "true") {
                stShufflePriorityColumns = true;
            } else {
                stShufflePriorityColumns = false;
            }
            // dLog("localStorage, stShufflePriorityColumns:\n");
            // console.dir(stShufflePriorityColumns);

            stPrioritySegmentOnly = bookStorage.getItem("stPrioritySegmentOnly");
            if (stPrioritySegmentOnly == undefined || stPrioritySegmentOnly == null || stPrioritySegmentOnly == "false") {
                stPrioritySegmentOnly = false;
            } else {
                stPrioritySegmentOnly = true;
            }
            // dLog("localStorage, stPrioritySegmentOnly:\n");
            // console.dir(stPrioritySegmentOnly);

            stPriorityColumnsOnly = bookStorage.getItem("stPriorityColumnsOnly");
            if (stPriorityColumnsOnly == undefined || stPriorityColumnsOnly == null || stPriorityColumnsOnly == "false") {
                stPriorityColumnsOnly = false;
            } else {
                stPriorityColumnsOnly = true;
            }
            // dLog("localStorage, stPriorityColumnsOnly:\n");
            // console.dir(stPriorityColumnsOnly);

            priorityColumnsReset();

            prioritySegmentsReset();

            excludeSegmentsReset();

        } catch (err) {
            glLoadStorageErr = err;
        }
    }

    function saveStorage(params) {
        // dLog("saveStorage, stBookingCells:\n");
        bookStorage.removeItem("stBookingCells");
        var text = JSON.stringify(stBookingCells);
        bookStorage.setItem("stBookingCells", text);
        // console.dir(text);

        stExcludes = []; // always reset
        excludedSegments.forEach(function (value, key) {
            var txt = key + "@" + value
            // dLog("saving excludedSegments:", txt)
            stExcludes.push(txt);
        })

        // if (excludedSegments.size > 0) {
        //     // dLog("save exclude segments to storage");
        //     for (const cellKey of excludedSegments.keys()) {
        //         // dLog("exclude segment saved:", cellKey);
        //         stExcludes.push(cellKey);
        //     }
        // }

        // dLog("saveStorage, stDualLogLines:\n");
        bookStorage.removeItem("stDualLogLines");
        text = JSON.stringify(stDualLogLines);
        bookStorage.setItem("stDualLogLines", text);
        // console.dir(text);

        // dLog("saveStorage, stExcludes:\n");
        bookStorage.removeItem("stExcludes");
        text = JSON.stringify(stExcludes);
        bookStorage.setItem("stExcludes", text);
        // console.dir(text);

        // dLog("saveStorage, stStage:\n");
        bookStorage.removeItem("stStage");
        bookStorage.setItem("stStage", stStage);
        // console.dir(stStage);

        // dLog("saveStorage, stAutoSelect:\n");
        // console.dir(stAutoSelect);
        bookStorage.removeItem("stAutoSelect");
        bookStorage.setItem("stAutoSelect", stAutoSelect);

        // dLog("saveStorage, stAutoStartTime:\n");
        // console.dir(stAutoStartTime);
        bookStorage.removeItem("stAutoStartTime");
        bookStorage.setItem("stAutoStartTime", stAutoStartTime);

        // dLog("saveStorage, stPriorityColumnString:\n");
        // console.dir(stPriorityColumnString);
        bookStorage.removeItem("stPriorityColumnString");
        bookStorage.setItem("stPriorityColumnString", stPriorityColumnString);

        // dLog("saveStorage, stPrioritySegmentString:\n");
        // console.dir(stPrioritySegmentString);
        bookStorage.removeItem("stPrioritySegmentString");
        bookStorage.setItem("stPrioritySegmentString", stPrioritySegmentString);

        // dLog("saveStorage, stExcludeSegmentString:\n");
        // console.dir(stExcludeSegmentString);
        bookStorage.removeItem("stExcludeSegmentString");
        bookStorage.setItem("stExcludeSegmentString", stExcludeSegmentString);

        // dLog("saveStorage, stPrioritySegmentOnly:\n");
        // console.dir(stPrioritySegmentOnly);
        bookStorage.removeItem("stPrioritySegmentOnly");
        bookStorage.setItem("stPrioritySegmentOnly", stPrioritySegmentOnly);

        // dLog("saveStorage, stPriorityColumnsOnly:\n");
        // console.dir(stPriorityColumnsOnly);
        bookStorage.removeItem("stPriorityColumnsOnly");
        bookStorage.setItem("stPriorityColumnsOnly", stPriorityColumnsOnly);

        // dLog("saveStorage, stContinueWanted:\n");
        // console.dir(stContinueWanted);
        bookStorage.removeItem("stContinueWanted");
        bookStorage.setItem("stContinueWanted", stContinueWanted);

        // dLog("saveStorage, stAutoBookByTrigger:\n");
        // console.dir(stAutoBookByTrigger);
        bookStorage.removeItem("stAutoBookByTrigger");
        bookStorage.setItem("stAutoBookByTrigger", stAutoBookByTrigger);

        // dLog("saveStorage, stMaxBatchCells:\n");
        // console.dir(stMaxBatchCells);
        bookStorage.removeItem("stMaxBatchCells");
        bookStorage.setItem("stMaxBatchCells", stMaxBatchCells);

        // dLog("saveStorage, stShufflePriorityColumns:\n");
        // console.dir(stShufflePriorityColumns);
        bookStorage.removeItem("stShufflePriorityColumns");
        bookStorage.setItem("stShufflePriorityColumns", stShufflePriorityColumns);

        bookStorage.removeItem("stAutoBookStartTs");
        bookStorage.setItem("stAutoBookStartTs", stAutoBookStartTs);

        // stAutoBookStartTs

        bookStorage.removeItem("stCellType");
        bookStorage.setItem("stCellType", stCellType);
        // dLog("saveStorage, stCellType:", stCellType)

        bookStorage.removeItem("stAutoBookStopTs");
        bookStorage.setItem("stAutoBookStopTs", stAutoBookStopTs);

        // stAutoBookStopTs

        bookStorage.removeItem("stWaitForPayEsp");
        bookStorage.setItem("stWaitForPayEsp", stWaitForPayEsp);

        bookStorage.removeItem("stSiteIndex");
        bookStorage.setItem("stSiteIndex", stSiteIndex);

        // 

    }

    function availableDivSetup(params) {

        var tl = document.getElementById("availableDiv");
        // debugger;
        if (tl == undefined || tl == null) {
            // dLog("availableDiv: not present");
        } else {
            // dLog("availableDiv: removed", tl);
            tl.remove();
        }

        var scheduleHeadDiv = document.getElementsByClassName("schedule-table__header-wrapper")[0];
        if (scheduleHeadDiv == undefined) {
            // dLog("failed to setup availableDiv, schedule-table__header-wrapper not found");
            return false;
        }

        scheduleHeadDiv.parentNode.insertBefore(availableDiv, scheduleHeadDiv);
        availableDiv.style.width = availableDiv.parentNode.clientWidth;

        var sw = document.getElementById("glUpdaterSwitch");
        sw.onclick = function () {
            if (glUpdaterSwitch) {
                glUpdaterSwitch = false;
                dLog("refresh paused");
            } else {
                glUpdaterSwitch = true;
                dLog("refreshing ...");
                cellsRefresh();
            }
            SetAvailableTableTitle();
        };
        glUpdaterSwitch = true;
        SetAvailableTableTitle();

        tl = document.getElementById("availableTable");
        // debugger;
        if (tl == undefined || tl == null) {
            // dLog("availableTable: not present");
            availableDiv.appendChild(availableTable);
        }

        availableDiv.style.display = "block";

    }


    //
    function redirectTo(url) {
        glAddressTextUpdater()
        if (glAddressText == url) {
            return
        }

        // stop machine
        machineSwitchCtl("stop")

        // go
        window.location.href = url;
    }

    var glUIReady = false
    function allDivSetup() {
        glUIReady = false
        var tl = document.getElementById("clockBarDiv");
        // debugger;
        if (tl == undefined || tl == null) {
            // dLog("clockBarDiv: not present");
        } else {
            // dLog("clockBarDiv: removed", tl);
            tl.remove();
        }
        var tl = document.getElementById("dLogDiv");
        // debugger;
        if (tl == undefined || tl == null) {
            // dLog("dLogDiv: not present");
        } else {
            // dLog("dLogDiv: removed", tl);
            tl.remove();
        }

        var tl = document.getElementById("machineMsgDiv");
        // debugger;
        if (tl == undefined || tl == null) {
            // dLog("machineMsgDiv: not present");
        } else {
            // dLog("machineMsgDiv: removed", tl);
            tl.remove();
        }

        if (glPage.name == "profilePage") {
            // "profile"

            // el-card is-never-shadow el-card-mini
            var array = classesMatch(["nav-menu el-row", "el-card is-never-shadow el-card-mini"], true, true)
            for (let index = 0; index < array.length; index++) {
                const element = array[index];
                var txt = element.innerText + ""
                if (txt == "") {
                    txt = "el-card-mini"
                }
                if (txt.indexOf("我的订单") >= 0 || txt.indexOf("我的奖品") >= 0 || txt.indexOf("设置") >= 0) {
                    // dLog("profile: item skipped,", txt)
                    continue
                }
                dLog("profile: item removed,", txt)
                element.remove();
            }
        }

        var bodyDivArr = ["__nuxt", "__layout", "app"];
        glMainAppDiv = null
        for (let index = 0; index < bodyDivArr.length; index++) {
            const divClass = bodyDivArr[index];
            glMainAppDiv = document.getElementById(divClass);
            if (glMainAppDiv == undefined || glMainAppDiv == null) {
                // dLog("clock setup, glMainAppDiv not found:", divClass)
            } else {
                // dLog("clock setup, glMainAppDiv found:", divClass)
                break
            }
        }
        if (glMainAppDiv == undefined || glMainAppDiv == null) {
            // dLog("unable to initial clock, glMainAppDiv by id __nuxt/__layout/app not found, try class index.\n")
            glMainAppDiv = document.getElementsByClassName("index")[0];
            if (glMainAppDiv == undefined || glMainAppDiv == null) {
                dLog("unable to initial clock, glMainAppDiv/index not found.\n")
                return false;
            }
        }
        glUIReady = true

        glMainAppDiv.style.Width = glMainAppDiv.parentNode.clientWidth; // width:128px;
        glMainAppDiv.parentNode.insertBefore(dLogDiv, glMainAppDiv);
        glMainAppDiv.parentNode.insertBefore(clockBarDiv, dLogDiv);
        glMainAppDiv.parentNode.insertBefore(machineMsgDiv, clockBarDiv);

        document.getElementById("leftUrlSwitch").onclick = function () {

            if (glSite.index == (siteIdentInfo.length - 1)) {
                glSite = siteIdentInfo[0]
            } else {
                glSite = siteIdentInfo[glSite.index + 1]
            }

            saveStorage();
            // reload
            redirectTo(glSite.selectingUrl)
        };

        document.getElementById("clockText").onclick = function () {
            if (glAutoBook) {
                monitorCtl("stop");
            } else {
                if (stStage == "error") {
                    dLog("stStage error cleared");
                    fatalErr = 0;
                    setStage("selecting")
                }
                monitorCtl("start");
            }
        };

        document.getElementById("leftOrder").onclick = function () {
            dLog("--orders--");
            stStage = "order2"
            saveStorage();
            if (glAddressText == glOrder2Url) {
                location.reload()
            } else {
                redirectTo(glOrder2Url);
            }
            return;
        };

        document.getElementById("leftProfile").onclick = function () {
            dLog("--profile--");
            stStage = "profile"
            saveStorage();
            if (glAddressText == glProfileUrl) {
                location.reload()
            } else {
                redirectTo(glProfileUrl);
            }
            return;
        };

        document.getElementById("rightReset").onclick = function () {
            dLog("--reload, keep excludes--");
            // stAutoSelect = "no"
            resetAndRedirect(true);
        };

        //
        document.getElementById("leftConf").onclick = function () {
            dLog("--reload, clear excludes--");
            // stAutoSelect = "no"
            resetAndRedirect(false);
        };

        document.getElementById("rightConf").onclick = function () {
            configDivCtl();
        };

        document.getElementById("rightStartStop").onclick = function () {
            machineSwitchCtl();
        };

        //
        if (glStages[stStage].count < 10 && document.body.scrollTop > 0) {
            dLog("scroll page to top:", document.body.scrollTop, glStages[stStage].count)
            document.body.scrollTop = 0;
        }

        var tl = document.getElementById("leftUrlSwitch");
        glSelectingUrl = glSite.selectingUrl
        tl.innerHTML = glSite.hint
        glOrder2Url = glSite.order2Url
        glProfileUrl = glSite.profileUrl

        if (glPage.name != "cellTablePage") {
            return true;
        }

        //
        availableDivSetup();

        return true;
    }

    var glAvailableSum = ""
    var preAvailableSum = "init"

    function availableDivUpdater() {

        if (glAvailableSum == preAvailableSum) {
            return
        }
        // dLog("glAvailableSum:", preAvailableSum, "=>", glAvailableSum);
        preAvailableSum = glAvailableSum

        // clear
        availableTable.innerHTML = `
                <tbody>
                </tbody>
                `;

        SetAvailableTableTitle();

        for (let index = 0; index < availableTable.rows.length; index++) {
            availableTable.deleteRow(index);
        }

        var position = 1
        for (const childNode of availableCells.values()) {
            // var cellColumn = childNode.cellColumn
            // var cellSegment = childNode.cellSegment
            availableTable.insertRow(-1).insertCell(-1).innerHTML = "#" + position + ": " + childNode.cellText;
            position++;
            if (position > 3) {
                availableTable.insertRow(-1).insertCell(-1).innerHTML = " ...";
                break
            }
        }
        availableTable.insertRow(-1).insertCell(-1).innerHTML = "<p>";
        // availableTable.insertRow(-1).insertCell(-1).innerHTML = "<p>";
        // availableTable.insertRow(-1).insertCell(-1).innerHTML = "<p>";
        // availableTable.insertRow(-1).insertCell(-1).innerHTML = "<p>";
        // availableTable.insertRow(-1).insertCell(-1).innerHTML = "<p>";
        // availableTable.insertRow(-1).insertCell(-1).innerHTML = "<p>";
    }

    function glAutoBookTrigger(params) {
        if (glAutoBookTs <= 0 || glCurTs < glAutoBookTs || glAutoBook) {
            return
        }
        if (glMachineRunning) {
            setEngineInterval(10); // high speed
        } else {
            setEngineInterval(10, true);
        }
        glBookTriggerTs = glCurTs + 30000 // offset 30 seconds
        glAutoBookTs = -1
        stAutoBookByTrigger = true
        if (stStage == "selecting") {
            dLog("auto booking triggered ...");
        } else {
            dLog("auto booking triggered, redirect from stage", stStage);
        }
        monitorCtl("start")
    }

    function timeTick() {
        if (glUIReady == false) {
            return
        }

        glDate = (new Date());
        glClockText = glDate.Format("MM-dd-hh:mm:ss");

        if (glMachineRunning == false) {
            glCurTs = glDate.getTime()
            glAutoBookTrigger()
        }

        if (glPreBoxText == "") {
            machineMsgDiv.style.display = "none"
        }

        clockBarDiv.style.Width = clockBarDiv.parentNode.clientWidth;

        // if (glPage.name == "cellTablePage") {
        //     dLogDiv.style.display = "flex"
        //     dLogDiv.style.Width = dLogDiv.parentNode.clientWidth;
        // } else {
        //     dLogDiv.style.display = "none"
        // }
        dLogDiv.style.display = "none"

        // already make sure it is exist
        document.getElementById("clockText").innerText = glClockText.toLocaleString();

        setClockBarColor()

        if (glMainAppDiv == null || glMainAppDiv == undefined || machineMsgDiv == null || machineMsgDiv == undefined) {
            return
        }

        glMainAppDiv.style.Width = glMainAppDiv.parentNode.clientWidth; // width:128px;
        machineMsgDiv.style.Width = machineMsgDiv.parentNode.clientWidth; // width:128px;

    }
    // return: set glSite
    function siteMatch() {
        // return first matched
        for (let index = 0; index < siteIdentInfo.length; index++) {
            const oneItem = siteIdentInfo[index];
            oneItem.index = index;
            // if (oneItem.name == "cellTablePage") {
            //     debugger;
            // }
            var childNodes = classesMatch(oneItem.classes, true, true);
            // if (oneItem.name == "简上体育") {
            //     dLog("classesMatch 简上体育:", index, stStage)
            //     console.dir(oneItem)
            //     console.dir(childNodes)
            // }
            // dLog("siteMatch 简上体育:", index, stStage)
            // console.dir(oneItem)
            // console.dir(childNodes)

            if (childNodes.allMatched) {
                var textMatched = true;
                if (oneItem.texts != undefined) {
                    for (let index = 0; index < oneItem.texts.length; index++) {
                        const text = oneItem.texts[index];
                        var textArr = textMatch(childNodes, false, text);
                        // if (oneItem.name == "简上体育") {
                        //     dLog("childNodes textMatch 简上体育:", index, text)
                        //     console.dir(textArr)
                        // }
                        // dLog("childNodes textMatch 简上体育:", index, text)
                        // console.dir(textArr)
                        if (textArr.length == 0) {
                            textMatched = false;
                            break;
                        }
                    }
                }
                if (textMatched) {
                    // if (stStage != "selecting" && stStage != "login") {
                    //     dLog("current page stage matched", stStage, oneItem.name, glAddressText);
                    // }
                    // dLog("current page stage matched", stStage, oneItem.name, glAddressText);
                    oneItem.index = index
                    glSite = oneItem
                    return true;
                } else {
                    // dLog("siteMatching, current page classes matched, but text mismatch", stStage, oneItem.name, oneItem.classes, oneItem.texts);
                    // console.dir(childNodes)
                }
            } else {
                // dLog("siteMatching, current page not matched", stStage, oneItem.name);
            }
        }
        // if (stStage != "selecting" && stStage != "init") {
        //     dLog("current page stage matched nothing, current stage", stStage, "current name", glSite.name, glAddressText);
        // }
        // dLog("siteMatching, all sites mismatched", stStage, glAddressText);
        return false;
    }

    // return: set glPage
    function pageMatch() {
        // return first matched
        for (let index = 0; index < pageList.length; index++) {
            const oneItem = pageList[index];
            // if (oneItem.name == "cellTablePage") {
            //     debugger;
            // }
            var childNodes = classesMatch(oneItem.classes, false, true);
            // ///////
            // if (oneItem.name == "cellTablePage") {
            //     dLog("pageMatch, classesMatch cellTablePage:", stStage)
            //     console.dir(oneItem)
            //     console.dir(childNodes)
            // }
            // ////////
            if (childNodes.allMatched) {
                var textMatched = true;
                if (oneItem.texts != undefined) {
                    for (let index = 0; index < oneItem.texts.length; index++) {
                        const text = oneItem.texts[index];
                        var textArr = textMatch(childNodes, false, text);
                        // ////////
                        // if (oneItem.name == "cellTablePage") {
                        //     dLog("pageMatch, childNodes textMatch:", text)
                        //     console.dir(textArr)
                        // }
                        // ///////
                        if (textArr.length == 0) {
                            textMatched = false;
                            break;
                        }
                    }
                }
                if (textMatched) {
                    // if (stStage != "selecting" && stStage != "login") {
                    //     dLog("current page stage matched", stStage, oneItem.name, glAddressText);
                    // }
                    // dLog("current page stage matched", stStage, oneItem.name, glAddressText);
                    glPage = oneItem
                    return true;
                } else {
                    // dLog("search next, current page classes matched, but text mismatch", stStage, oneItem.name, oneItem.classes, oneItem.texts);
                    // console.dir(childNodes)
                }
            } else {
                // dLog("current page stage not matched", stStage, oneItem.name);
            }
        }
        // if (stStage != "selecting" && stStage != "init") {
        //     dLog("current page stage matched nothing, current stage", stStage, "current page", glPage.name, glAddressText);
        // }
        return false;
    }

    //
    var glDate = (new Date());
    var glClockText = glDate.Format("MM-dd-hh:mm:ss.S");
    var glCurTs = glDate.getTime()

    var glMachineTick = -1;

    var glUpdaterSwitch = true; // set to true for initial

    var fatalErr = 0;
    var storageInitialed = false
    var glNoPageMatched = 1; // 1 to show first page name
    var prePage = glPage
    var glStages = {}

    function setStage(stage, reset) {
        if (glStages[stage] == undefined) {
            glStages[stage] = {}
            glStages[stage].count = 0;
        }
        // reset others
        var keys = Object.keys(glStages);
        for (let index = 0; index < keys.length; index++) {
            const element = keys[index];
            if (stage == element) {
                continue;
            }
            glStages[element].count = 0;
        }
        stStage = stage
        if (reset) {
            glStages[stage].count = 0;
        } else {
            glStages[stage].count++
        }
    }

    // return true for retry
    function toastHandle(params) {
        var toastMsg = document.getElementsByClassName("van-toast--text")[0]

        // dLog("toastMsg:", toastMsg);
        // console.dir(toastMsg);
        if (toastMsg != undefined && toastMsg.innerText != "") {
            dLog("toastHandle:", toastMsg.innerText);
            console.dir(toastMsg);
            console.dir(toastMsg.style.display);
            console.dir(toastMsg.innerText);
            // 您选择的场次/时间已被预订，订单生成失败！您可以请重新选择其他场次/时间
            //
            var innerText = toastMsg.innerText;
            toastMsg.innerText = "";
            if (innerText.indexOf("被预订") >= 0 || innerText.indexOf("被预定") >= 0) {
                // 场地已经被预定
                // redirect to selecting page, keep exclude segments
                // refresh
                glAutoBook = true;
                resetAndRedirect(true, glAutoBook);
                return false;
            } else if (innerText.indexOf("请先阅读完整协议") >= 0) {
                // retry
                dLog("Agree Box:", innerText);
                return true;
            } else if (innerText.indexOf("位入场人员") >= 0) {
                // retry
                // 请选择 1 - 6 位入场人员
                setStage("selectContact");
                machineMessageBox(innerText);
                return true;
            } else if (innerText.indexOf("次数超限") >= 0) {
                //您购买的次数超限，该场地每人每1天限购2次
                // retry
                // 请选择 1 - 6 位入场人员
                setStage("idle");
                machineMessageBox(innerText);
                return false;
            } else if (innerText.indexOf("操作异常") >= 0) {
                // retry
                waitTicks = glMachineTick + 100;
                machineMessageBox(innerText);
                return true;
            } else {
                // // stop
                // setStage("idle");
                // retry
                waitTicks = glMachineTick + 100;
                dLog("unhandled toast message:", innerText);
                machineMessageBox("UNKNOWN MESSAGE:" + innerText);
                return true;
            }
        }
    }

    var waitTicks = 0
    var stAutoBookStartTs = 0
    var stAutoBookStopTs = 0;
    var stWaitForPayEsp = 0;
    var bookEsp = 0;
    var preStage = "init";
    var stCellType = "";//"羽毛球公益" // 羽毛球
    var glCellTypeClass = "slider-item text-center"

    var glMessageBoxClass = "van-popup"

    function pageMachine(params) {
        // make sure calling realPageMachine in single thread
        realPageMachine(params)
        glIntervalId = setTimeout(pageMachine, glEngineInterval);
    }

    function setEngineInterval(interval, firstRun) {
        if (interval < 5) {
            dLog("engine loop interval should not less then 5,", interval)
            interval = 5
        }
        if (interval > 1000) {
            dLog("engine loop interval should not large then 1000,", interval)
            interval = 1000
        }
        if (glEngineInterval !== interval) {
            dLog("setEngineInterval:", glEngineInterval, "=>", interval)
        }
        glEngineInterval = interval;
        if (glIntervalId == -1 || glMachineRunning == false || firstRun) {
            if (glIntervalId != -1) {
                clearTimeout(glIntervalId);
            }
            // force to run
            glMachineRunning = true
            if (firstRun === true) {
                dLog("engineLoop first run ...")
                pageMachine();
            }
            glIntervalId = setTimeout(pageMachine, glEngineInterval);
        }
        return glIntervalId
    }

    var glCellTypeWatched = false
    var glNoDelayState = false
    var glRefreshCount = 0

    function saveCellType(ref) {
        stCellType = ""
        var array = classesMatch([glCellTypeClass + " selected"], false, true)
        // dLog("saveCellType, classesMatch", glCellTypeClass)
        // console.dir(array)
        for (let index = 0; index < array.length; index++) {
            const text = array[index].innerText.trim(" ");
            // dLog("saveCellType, classesMatch innerText", text)
            // console.dir(array)
            if (text.indexOf("20") >= 0) {
                continue
            }
            stCellType = text
            dLog(ref, "save stCellType:", stCellType)
            saveStorage();
            return true;

        }
        return false
    }

    function isWeekends(txt) {
        if (txt.indexOf("星期六") >= 0 || txt.indexOf("星期日") >= 0) {
            return true
        }
        return false
    }

    function isWeeks(txt) {
        if (txt.indexOf("星期") >= 0) {
            return true
        }
        return false
    }

    function CellTypeSwitcher(params) {
        if (stCellType == "") {
            if (saveCellType("watcher")) {
                return
            } else {
                dLog("unable to save cell type")
            }
        }

        if (glCellTypeWatched == false) {
            // dLog("setup stCellType watcher ...")
            var array = classesMatch(["slider-box slider-box-item"], true, true)
            // console.dir(array)
            for (let index = 0; index < array.length; index++) {
                const element = array[index]
                // console.dir(element)
                element.onclick = function (ev) {
                    // console.dir(ev)
                    if (stStage != "typeSwitch") {
                        saveCellType("onclick")
                    }
                };
            }
            glCellTypeWatched = true;
        }
        //


        var array = classesMatch([glCellTypeClass], false, true)

        if (stAutoBookByTrigger && glAutoBook) {
            stAutoBookByTrigger = false

            var lastDay = ""
            var lastElement = ""
            for (let index = 0; index < array.length; index++) {
                var text = array[index].innerText.trim(" ");
                // dLog("lastDayTry:", stCellType, text)
                if (isWeeks(text)) {
                    text = replaceAll2(text, "\n", " ")
                    text = replaceAll2(text, "\r", " ")
                    var arr = text.split(" ")
                    lastDay = arr[arr.length - 1]
                    lastElement = array[index]
                    // dLog("lastDaySet:", lastDay)
                    // console.dir(arr)
                }
            }
            if (lastDay != "") {
                dLog("lastDay:", stCellType, lastDay)
                // if (isWeekends(lastDay)) {
                //     if (stCellType !== "羽毛球") {
                //         dLog("switch from", stCellType, "to 羽毛球 for weekends")
                //         stCellType = "羽毛球"
                //         stAutoBookByTrigger = true
                //     }
                // } else {
                //     if (stCellType !== "羽毛球公益") {
                //         dLog("switch from", stCellType, "to 羽毛球公益 for weekdays")
                //         stCellType = "羽毛球公益"
                //         stAutoBookByTrigger = true
                //     }
                // }
                if (lastElement.className.indexOf(" selected") < 0) {
                    dLog(lastDay, "last day not activated, try to click:", lastElement.className)
                    lastElement.click()
                    stAutoBookByTrigger = true
                }
            } else {
                dLog("Error: lastDay not found")
            }
            saveStorage();
            availableCells.clear();
        }
        if (stAutoBookByTrigger && glAutoBook) {
            dLog("waiting for stAutoBookByTrigger ready ...")
            setStage("typeSwitch");
            return false
        }

        // var array = classesMatch([glCellTypeClass + " selected"], true, true)
        var matched = false;
        for (let index = 0; index < array.length; index++) {
            const text = array[index].innerText.trim(" ");
            // dLog("CellTypeSwitcher:", stCellType, text)
            if (array[index].className.indexOf(" selected") < 0) {
                continue
            }
            if (text === stCellType) {
                matched = true
                // dLog("matched stCellType:", stCellType)
                break;
            }
        }
        if (matched == false) {
            if (stCellType == "") {
                // unable to switch
            } else {
                setStage("typeSwitch");
                glNoDelayState = true;
            }
        }

        return true
    }

    var stSiteIndex = glSite.index
    function realPageMachine(params) {
        // dLog("state:", stStage);
        glMachineTick++;

        if (documentNotReady) {
            // dLog("documentNotReady: ", documentNotReady);
            return;
        }

        if (fatalErr >= 100) {
            if (fatalErr == 100) {
                dLog("too many fatal error !!!")
            }
            setStage("error")
        }

        glDate = (new Date());
        glCurTs = glDate.getTime()

        //load once
        if (storageInitialed == false) {
            dLog("init ...");
            loadStorage();
            if (glLoadStorageErr == "new") {
                saveStorage();
            } else if (glLoadStorageErr !== null) {
                dLog("fatal error: failed to load local storage, reload page to re-try.");
                dLog(glLoadStorageErr);
                // console.dir(glLoadStorageErr);
                if (glIntervalId != -1) {
                    clearTimeout(glIntervalId);
                    glIntervalId = -1;
                }
                return;
            }
            if (stStage == "selecting") {
                setStage("init")
            }
            dLog("init ...");
            dLog("bookStorage loaded");
            dLog("current stCellType:", stCellType)
            dLog("current glAutoBook:", glAutoBook)
            storageInitialed = true;
            var err = autoStartTimer(stAutoStartTime);
            if (err != "") {
                dLog(err);
            }

            if (stStage == "init") {
                setStage("selecting")
                glNoPageMatched = 1;
            } else {
                dLog("page initialed, continue in stage", stStage)
            }
        }

        glAddressTextUpdater()

        if (glMachineTick < waitTicks && waitTicks > 0) {
            // dLog("waiting for ticks:", waitTicks)
            return;
        }

        waitTicks = 0;

        glAutoBookTrigger()

        glNoDelayState = false
        do {
            // runMachine
            glNoDelayState = false;

            if (glMachineRunning == false) {
                if (glAutoBook == false) {
                    return;
                }
                glMachineRunning = true
            }

            if (pageMatch() == false) {
                if (glNoPageMatched % 10 == 0) {
                    dLog("unknown page, stage", stStage, "old pageName", glPage.name, glAddressText);
                }
                glNoPageMatched++;
                return
            }
            if (glNoPageMatched > 0) {
                dLog("current page, stage", stStage, "pageName", glPage.name, glAddressText);
            }
            glNoPageMatched = 0;

            if (prePage.name != glPage.name) {
                dLog("page:", prePage.name, "=>", glPage.name)
                // prePage.name = glPage.name
                prePage = glPage
                //
                if (glPage.name != "initPage") {
                    allDivSetup();
                }
            }

            if (stStage == "init" || stStage == "") {
                setStage("selecting");
                setEngineInterval(110);
            }

            if (preStage != stStage) {
                dLog(glPage.name, "enter new stage:", preStage, "=>", stStage)
                preStage = stStage
                // saveStorage();
            }

            switch (stStage) {
                case "reselect":
                    if (glPage.name == "cellTablePage") {
                        dLog("try to enter selecting, enter cellTablePage ...")
                        setStage("selecting", true)
                        glRedirectTo = ""
                        glNoDelayState = true;
                    } else {
                        if (glAddressText == glSelectingUrl) {
                            dLog("try to enter selecting, waiting for cellTablePage ...")
                        } else if (glRedirectTo != "") {
                            dLog("try to enter selecting, waiting for redirect take effect:", glAddressText, glRedirectTo)
                        } else {
                            // new page
                            dLog("skipped, reselect ...")
                            setStage("selecting", true)
                            glNoDelayState = true;
                        }
                    }
                    break;
                case "idle":
                    if (glAutoBook) {
                        monitorCtl("stop", true)
                    }
                    break;
                case "error":
                    if (glAutoBook) {
                        monitorCtl("stop", true)
                    }
                    break;
                default:

                    switch (glPage.name) {
                        case "cellTablePage":
                            switch (stStage) {
                                case "typeSwitch":
                                    // make sure we are in selected cell type: "羽毛球公益" // 羽毛球
                                    // dLog("lookup stCellType:", stCellType)
                                    // not exactMatch
                                    var array = classesMatch([glCellTypeClass], false, true)
                                    var wantedType = "";
                                    var found = false
                                    for (let index = 0; index < array.length; index++) {
                                        const element = array[index];
                                        const text = array[index].innerText.trim(" ");
                                        // if (element.className.indexOf(" selected") >= 0) {
                                        //     dLog("selected:", text)
                                        // }
                                        if (text !== stCellType) { // exact match
                                            continue
                                        }
                                        if (element.className.indexOf(" selected") >= 0) {
                                            // console.dir(element)
                                            found = true
                                            break;
                                        } else {
                                            wantedType = element
                                        }
                                    }
                                    if (found == false) {
                                        if (wantedType !== "") {
                                            dLog("Cell type mismatch, try to switch to", stCellType)
                                            wantedType.click();
                                            // console.dir(wantedType)
                                        } else {
                                            dLog("Cell type mismatch, stCellType not found", stCellType)
                                            saveCellType()
                                        }
                                        waitTicks = glMachineTick + 120;
                                    } else {
                                        dLog("stCellType matched and selected:", stCellType)
                                        glBookingCount = 0
                                        if (glAutoBook) {
                                            setStage("pickupCells");
                                            dLog("jump to pickupCells")
                                        } else {
                                            setStage("selecting");
                                            dLog("jump to selecting")
                                        }
                                        glNoDelayState = true;
                                    }
                                    break;
                                case "selecting":

                                    if (CellTypeSwitcher() == false) {
                                        return
                                    }

                                    if (stPrioritySegmentOnly && stPriorityColumnsOnly) {
                                        machineMessageBox("警告：当前系统配置为仅订优先场地+时段");
                                    } else if (stPrioritySegmentOnly) {
                                        machineMessageBox("警告：当前系统配置为仅订优先时段");
                                    } else if (stPriorityColumnsOnly) {
                                        machineMessageBox("警告：当前系统配置为仅订优先场地");
                                    }

                                    getAvailableCell(true);

                                    var array = document.getElementsByClassName("selected")
                                    var selectedCells = []
                                    for (let index = 0; index < array.length; index++) {
                                        const element = array[index];
                                        if (element.className.indexOf("schedule-table_column_") >= 0) {
                                            // dLog("selected cell:", element.className)
                                            selectedCells.push(element);
                                        } else {
                                            // dLog("unknown element:", element.className)
                                        }
                                    }

                                    if (selectedCells.length > 0) {
                                        glResetCellsCount++
                                        dLog("waiting for cells reset ...", selectedCells.length, glResetCellsCount)
                                        if (glResetCellsCount > 30) {
                                            dLog("error, fail to reset pre-selected cells")
                                            setStage("error")
                                        }
                                        return
                                    } else {
                                        if (glResetCellsCount > 0) {
                                            dLog("all pre-selected cells reset", glResetCellsCount)
                                        }
                                        glResetCellsCount = 0
                                    }

                                    if (glAutoBook) {
                                        setStage("pickupCells");
                                        glNoDelayState = true;
                                        glBookingCount = 0;

                                        setEngineInterval(10); // speed up
                                        break; // do not use return here
                                    }
                                    // var freshDelay = getRandomInt(100, 500);
                                    // if ((glMachineTick % freshDelay) == 0 && glUpdaterSwitch) {
                                    //     // dLog("available: refresh ...");
                                    //     cellsRefresh();
                                    //     break;
                                    // }

                                    // var pageList = [{
                                    //     page: "localhost-baidu.com-Page",
                                    //     classes: [
                                    //         "s_form_wrapper soutu-env-nomac soutu-env-newindex",
                                    //         "s_form_wrapper localhost-baidu"
                                    //     ],
                                    // }, {

                                    //  identify site name and save

                                    if (siteMatch()) {
                                        var tl = document.getElementById("leftUrlSwitch");
                                        if (tl != null) {
                                            tl.innerHTML = glSite.hint
                                        }
                                        glSelectingUrl = glSite.selectingUrl
                                        glOrder2Url = glSite.order2Url
                                        glProfileUrl = glSite.profileUrl
                                        if (stSiteIndex != glSite.index) {
                                            stSiteIndex = glSite.index
                                            saveStorage()
                                        }
                                    }

                                    // 500ms tick
                                    availableDivUpdater();

                                    break;
                                case "pickupCells":

                                    if (CellTypeSwitcher() == false) {
                                        return
                                    }

                                    // try to select cells
                                    glBookingCount++

                                    getAvailableCell(true);

                                    // reset
                                    stBookingCells = [];
                                    if (stContinueWanted) {
                                        searchAll(true);
                                    }
                                    searchAll();
                                    if (stBookingCells.length > 0) {
                                        // setup mark
                                        dLog("try to click on", stBookingCells.length, "cells");
                                        glNoDelayState = true;
                                        stAutoBookStartTs = glCurTs
                                        stAutoBookStopTs = 0
                                        setStage("clickCells");
                                        stWaitForPayEsp = 0;
                                        saveStorage()
                                        setEngineInterval(12);
                                    } else {
                                        if (glBookingCount < 5000 && glBookingCount > 2000) {
                                            dLog("autoBook: searching available cells ...")
                                            setEngineInterval(170);
                                        }
                                        // // refresh
                                        // var freshDelay = getRandomInt(200, 500);
                                        // if (glMachineTick % 150 == 0 && glUpdaterSwitch) {
                                        //     // dLog("try to fresh for auto book1: " + glBookingCount)
                                        //     cellsRefresh();
                                        //     break;
                                        // } else if (glMachineTick % freshDelay == 0 && glUpdaterSwitch == false) {
                                        //     // dLog("try to fresh for auto book2: " + freshDelay)
                                        //     cellsRefresh();
                                        //     break;
                                        // }
                                        availableDivUpdater();
                                    }
                                    break;
                                case "clickCells":
                                    if (clickCells("cellsNext") == true) {
                                        glNoDelayState = true
                                    }
                                    break;
                                case "cellsNext":
                                    if (clickNext("agree", true) == true) {
                                        glNoDelayState = true
                                    }
                                    break;
                                case "agree":
                                    clickAgree("price")
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)
                                    setStage("selecting")
                                    break;
                            }
                            break;
                        case "pricePage":
                            switch (stStage) {
                                case "agree":
                                    dLog("this is pricePage, stage move from agree to price")
                                    setStage("price")
                                    glNoDelayState = true
                                case "price":
                                    if (clickNext("selectContact", false, true) == true) {
                                        glNoDelayState = true
                                    }
                                    break;
                                case "selectContact":
                                    dLog("this is pricePage, waiting for contactListPage")
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)
                                    setStage("price")
                                    break;
                            }
                            break;
                        case "contactListPage":
                            switch (stStage) {
                                case "selectContact":
                                    selectContact("contactNext");
                                    break;
                                case "contactNext":
                                    if (clickNext("waitForPay", false, true) == true) {
                                        glNoDelayState = true
                                    }
                                    break;
                                case "waitForPay":
                                    dLog("this is contactListPage, waiting for waitForPayPage, esp", glCurTs - stAutoBookStartTs)
                                    if (stWaitForPayEsp == 0) {
                                        stWaitForPayEsp = glCurTs - stAutoBookStartTs
                                    }
                                    // checkToast
                                    toastHandle();
                                    break;
                                case "price":
                                    dLog("this is contactListPage, move to selectContact")
                                    glNoDelayState = true
                                    setStage("selectContact")
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)
                                    setStage("selectContact")
                                    break;
                            }
                            break;
                        case "waitForPayPage":
                            switch (stStage) {
                                case "waitForPay":
                                    if (bookEsp == 0) {
                                        if (stAutoBookStopTs == 0) {
                                            stAutoBookStopTs = glCurTs;
                                        }
                                        bookEsp = (stAutoBookStopTs - stAutoBookStartTs)
                                        dLog("booking done, please pay the bill manual, ESP", bookEsp);
                                        machineMessageBox("请在限定时间内支付, 耗时" + stWaitForPayEsp + "/" + bookEsp + "毫秒");
                                        saveStorage();
                                    }
                                    if (glAutoBook) {
                                        monitorCtl("stop", true)
                                    }
                                    break;
                                case "contactNext":
                                    dLog("this is waitForPayPage, esp", glCurTs - stAutoBookStartTs)
                                    setStage("waitForPay")
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)
                                    setStage("waitForPay")
                                    break;
                            }
                            break;
                        case "freeDonePage":
                            switch (stStage) {
                                case "freeDone":
                                    if (bookEsp == 0) {
                                        if (stAutoBookStopTs == 0) {
                                            stAutoBookStopTs = glCurTs;
                                        }
                                        bookEsp = (stAutoBookStopTs - stAutoBookStartTs)
                                        dLog("free cells done, ESP", bookEsp);
                                        machineMessageBox("免费场地无需支付, 耗时" + stWaitForPayEsp + "/" + bookEsp + "毫秒");
                                        saveStorage();
                                    }
                                    if (glAutoBook) {
                                        monitorCtl("stop", true)
                                    }
                                    break;
                                case "contactNext":
                                    dLog("this is freeDonePage, esp", glCurTs - stAutoBookStartTs)
                                    setStage("freeDone")
                                    break;
                                case "waitForPay":
                                    dLog("this is freeDonePage, esp", glCurTs - stAutoBookStartTs)
                                    setStage("freeDone")
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)
                                    setStage("freeDone")
                                    break;
                            }
                            break;
                        case "order2Page":
                            switch (stStage) {
                                case "order2":
                                    dLog("my orders listed ...");
                                    if (glAutoBook) {
                                        monitorCtl("stop", true)
                                    }
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)
                                    setStage("order2")
                                    break;
                            }
                            break;
                        case "profilePage":
                            switch (stStage) {
                                case "profile":
                                    dLog("my profile ...");
                                    if (glAutoBook) {
                                        monitorCtl("stop", true)
                                    }
                                    break;
                                default:
                                    dLog("state machine, unknown page stage:", stStage)

                                    setStage("profile")
                                    break;
                            }
                            break;
                        default:
                            dLog("state machine, unknown page name:", glPage.name)
                    }
            }
            setStage(stStage);
        } while (glNoDelayState);
    }

    var documentNotReady = true
    var firstLoad = true;

    var glIntervalId = -1;
    var glEngineInterval = 15;

    function readyGo(txt) {
        documentNotReady = false;
        if (firstLoad) {
            firstLoad = false;
            dLog("readyGo:", txt);
        } else {
            // dLog("readyGo, ignored:", txt);
            return;
        }

        // event loop started
        setEngineInterval(glEngineInterval, true);

        // loadStorage();

        // timeTick();

        setInterval(() => {
            timeTick();
        }, 500);

        return;
    }

    //////// page start ///////

    //
    var loadingCount = 0;
    var domMonitor = new MutationObserver(mutations => {
        // dLog("MutationObserver: ", mutations);
        // debugger;

        var letsGo = false;

        for (let mutation of mutations) {
            // dLog("Inserting opNodes: ", mutation.addedNodes);

            for (let opNode of mutation.addedNodes) {
                if (opNode.className != undefined) {
                    if (opNode.id == "timeLabelP" || opNode.id == "clockText" || opNode.id == "glUpdaterSwitch" || opNode.id == "availableTable") {
                        continue;
                    }

                    if (opNode.className == undefined || opNode.className == null) {
                        dLog("added Node, className empty:", opNode.className);
                        console.dir(opNode.className);
                        console.dir(opNode);
                        continue
                    }
                    if (typeof opNode.className.indexOf !== "function") {
                        // dLog("added Node, indexOf not a function:", opNode.className.indexOf);
                        // console.dir(opNode.className.indexOf);
                        // console.dir(opNode.className);
                        // console.dir(opNode);
                        continue
                    }
                    if (opNode.className.indexOf("el-loading-mask is-fullscreen") >= 0 || opNode.className.indexOf("van-toast van-toast--middle van-toast--loading") >= 0) {
                        if (loadingCount == 0) {
                            dLog("fullscreen mask added, document loading ...");
                        }
                        loadingCount++;
                        // console.dir(opNode);
                        documentNotReady = true;
                    }
                }
            }

            for (let opNode of mutation.removedNodes) {
                if (opNode.className != undefined) {
                    if (opNode.id == "timeLabelP" || opNode.id == "clockText" || opNode.id == "glUpdaterSwitch" || opNode.id == "availableTable") {
                        continue;
                    }
                    // dLog("removed Node:", opNode.className);
                    // console.dir(opNode);
                    if (opNode.className == undefined) {
                        continue
                    }
                    if (opNode.className.indexOf("el-loading-mask is-fullscreen") >= 0 || opNode.className.indexOf("van-toast van-toast--middle van-toast--loading") >= 0) {
                        // dLog("fullscreen mask removed, document ready.\n");
                        // console.dir(opNode);
                        letsGo = true;
                    }
                }
            }
        }
        if (letsGo) {
            readyGo("domMonitor");
        }
    });

    function hasSuffix(str, suffix) {
        return str.indexOf(suffix, str.length - suffix.length) !== -1;
    }

    function hasPrefix(str, suffix) {
        return str.indexOf(suffix) == 0;
    }

    //
    function startMachine(deep) {
        glAddressTextUpdater()

        if (hasSuffix(glAddressText, "/v2/commonNews/queryDetailById.shtml")) {
            console.log("jianshangTicket: skipped news", glAddressText);
            return;
        } else if (hasSuffix(glAddressText, ".js")) {
            console.log("jianshangTicket: skipped js", glAddressText);
            return;
        } else if (hasSuffix(glAddressText, ".css")) {
            console.log("jianshangTicket: skipped css", glAddressText);
            return;
        } else if (hasSuffix(glAddressText, ".jpg")) {
            console.log("jianshangTicket: skipped jpg", glAddressText);
            return;
        } else if (hasSuffix(glAddressText, ".png")) {
            console.log("jianshangTicket: skipped png", glAddressText);
            return;
        }

        if (deep == undefined) {
            deep = 0;
        }

        if (deep == 0) {
            console.log("start machine ...")
            loadStorage()
            if (glLoadStorageErr == "new") {
                saveStorage();
            }
        }

        deep++
        if (document == null || document.head == null || document.body == null) {
            setTimeout(() => {
                console.log("wait for document.head", deep);
                startMachine(deep);
            }, 500);
            return;
        }

        // https://wenku.baidu.com/view/1f5337cb132de2bd960590c69ec3d5bbfd0adadc.html
        window.addEventListener('load', function (event) {
            // 根据上面制定的结构来解析iframe内部发回来的数据
            // console.log("event, windows loaded: ");
            // console.dir(event);
            readyGo("event");
        });

        domMonitor.observe(document, { childList: true, subtree: true });

        readyGo("startMachine");
    }

    startMachine(0);

    //// page end //////

})();