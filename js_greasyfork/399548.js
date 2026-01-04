// ==UserScript==
// @name         MotherScript
// @namespace    http://tampermonkey.net/
// @version      2.85
// @description  For home country.
// @author       tanavast
// @match        https://*.ogame.gameforge.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399548/MotherScript.user.js
// @updateURL https://update.greasyfork.org/scripts/399548/MotherScript.meta.js
// ==/UserScript==

(function () {
    ConfirmLogin();
    initialize("2.85");
    applyStyling();
    loadLeftMenuComponent();
    $("#motherScriptButton").click(loadMainComponent);
    $(document).on("change", "#runscript", loadScriptConfig);
    $(document).on("click", "#mssavestate", saveScriptConfig);
    $(document).on("click", "#msstopstate", stopScript);
    $(document).on("click", ".deleteTransport", deleteTransport);
    runMotherScript();
})();

function ConfirmLogin() {
    setTimeout(() => {
        let lastPlayed = document.querySelector("#joinGame > .button")
        if (lastPlayed)
            lastPlayed.click();
    }, 5000);
}

function initialize(version) {
    let config = localStorage.MotherScript ? JSON.parse(localStorage.MotherScript) : false;
    if (!config || config.version != version) {
        config = {
            version: version,
            scriptconfig: {
                minebuild: {
                    leveldifference: [0, 0, 0],
                    levelmax: [0, 0, 0]
                },
                storagebuild: {
                    leveldifference: [0, 0, 0],
                    levelmax: [0, 0, 0]
                },
                facilitybuild: {
                    leveldifference: [0, 0, 0],
                    levelmax: [0, 0, 0]
                },
                transporter: [],
                transporterEnabled: true
            }
        }
        localStorage.MotherScript = JSON.stringify(config);
    }

    let session = sessionStorage.MotherScript ? JSON.parse(sessionStorage.MotherScript) : false;
    if (!session || session.version != version) {
        session = {
            version: version,
            isrunning: false,
            currentrunning: "",
            runningcoords: "",
            transporter: [],
            scheduler: []
        }
        sessionStorage.MotherScript = JSON.stringify(session);
    }

    if (config.scriptconfig.transporterEnabled)
        initializeTransporter();
    else
        checkAGRFix();
}

function applyStyling() {
    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText =
        ".motherscript{box-sizing:border-box}.motherscript.header{width:100%;height:28px;background:url(https://gf1.geo.gfsrv.net/cdn63/10e31cd5234445e4084558ea3506ea.gif) no-repeat 0 0 #0d1014;padding:5px;text-align:center;font-size:15px}.motherscript.section{display:flex;flex-flow:row wrap;background-color:rgb(0,0,0,.6)}.motherscript.subsection{display:flex;flex-flow:row nowrap;justify-content:center;align-items:center;width:50%;height:25px}.motherscript.active{font-weight:700;color:#0f0}.motherscript.inactive{font-weight:700;color:red}.motherscript.select{width:50%;padding:3px;background-color:#250045;color:#fff;font-weight:700}.motherscript.msbutton{background-color:#1f1f1f;font-size:15px;font-weight:700;cursor:pointer}.motherscript.smallinput{width:15px;height:15px;text-align:center}.motherscript.largeinput{width:150px;height:15px;text-align:center}";
    document.head.appendChild(styleSheet);
}

function addConfigBodySeperator() {
    $("#configbody").append(`
        <div class="motherscript subsection">---------</div>
        <div class="motherscript subsection">---------</div> 
    `);
}

function loadLeftMenuComponent() {
    $("#menuTable").append(`
        <li>
            <span class="menu_icon">
            </span>
            <a id="motherScriptButton" class="menubutton" href="javascript:void(0)" accesskey="" target="_self">
                <span class="textlabel">MotherScript</span>
            </a>
        </li>
    `);
}

function runMotherScript() {
    let session = getSession();
    if (session.isrunning) {
        if (session.schedulerscript) {
            let task = session.scheduler.find(item => item.executed == false);
            if (task && task.time <= Date.now())
                session.currentrunning = "Scheduler";
        }

        let stop = false;
        if ($(".planetlink.active > .planet-koords").text() != session.runningcoords && session.coordstype == "planet") {
            $(".planetlink").each(function () {
                if ($(this).find(".planet-koords").text() == session.runningcoords)
                    location.href = $(this).attr("href");
                stop = true;
            });
        }
        if ($(".planet-koords.moon_active").text() != session.runningcoords && session.coordstype == "moon") {
            $(".planetlink").each(function () {
                if ($(this).find(".planet-koords").text() == session.runningcoords)
                    location.href = $(this).parent().find(".moonlink").attr("href");
                stop = true;
            });
        }
        if (stop) return;
        switch (session.currentrunning) {
            case "Mine Build":
                runMineBuild();
                break;
            case "Storage Build":
                runStorageBuild();
                break;
            case "Transporter":
                runTransporter();
                break;
            case "Facility Build":
                runFacilityBuild();
                break;
            case "Cargo Deploy":
                runCargoDeploy();
                break;
            case "Fleet Collect":
                runFleetCollect();
                break;
            case "Scheduler":
                runScheduler();
                break;
        }
    }
}

function loadMainComponent() {
    $(".mothercontainer").remove();
    let config = getConfig();
    $("#middle").prepend(`
        <div class="mothercontainer">
            <div class="motherscript header">MotherScript v${config.version}</div>

            <div class="motherscript section">
                <div class="motherscript subsection">Status</div>
                <div id="motherscriptstatus" class="motherscript subsection"></div>
            </div>

            <div class="motherscript section">
                <div class="motherscript subsection">Running Script</div>
                <div id="msrunningscript" class="motherscript subsection active"></div>
            </div>

            <div class="motherscript section">
                <div class="motherscript subsection">Scripts</div>
                <div class="motherscript subsection">
                    <select id="runscript" class="motherscript select">
                        <option value="">---</option>
                    </select>
                </div>
            </div>

            <input id="currentconfigloaded" style="display:none" value="" />
            <div id="configbody" class="motherscript section">
            </div>

            <div class="motherscript section" id="scheduler-input">
                <div class="motherscript subsection">Schedule</div>
                <div id="msrunningscript" class="motherscript subsection active">
                    <input type="datetime-local" id="schedule-time" name="schedule-time">
                </div>
            </div>

            <div class="motherscript section">
                <div class="motherscript subsection msbutton" id="mssavestate">Save</div>
                <div class="motherscript subsection msbutton" id="msstopstate">Stop</div>
            </div>
        </div>
    `);
    loadMainComponentData();
    loadScriptConfig();
}

function loadMainComponentData() {
    let session = getSession();
    $("#currentconfigloaded").val(session.currentrunning);
    $("#msrunningscript").html(session.currentrunning);
    if (session.isrunning) {
        $("#motherscriptstatus").html("Active").removeClass("inactive").addClass("active");
    } else {
        $("#motherscriptstatus").html("Inactive").removeClass("active").addClass("inactive");
    }

    let scripts = ["Scheduler", "Transporter", "Cargo Deploy", "Fleet Collect", "Mine Build", "Storage Build", "Facility Build"]
    scripts.forEach(element => {
        let selected = session.currentrunning == element ? "selected" : "";
        $("#runscript").append(`<option value="${element}" ${selected}>${element}</option>`)
    });
}

function loadScriptConfig() {
    let selectedScript = $("#runscript").val();
    switch (selectedScript) {
        case "Mine Build":
            loadMineBuildConfig();
            break;
        case "Storage Build":
            loadStorageBuildConfig();
            break;
        case "Transporter":
            loadTransporterConfig();
            break;
        case "Facility Build":
            loadFacilityBuildConfig();
            break;
        case "Cargo Deploy":
            loadCargoDeployConfig();
            break;
        case "Fleet Collect":
            loadFleetCollectConfig();
            break;
        case "Scheduler":
            loadSchedulerConfig();
            break;
    }
}

function saveScriptConfig() {
    let currentconfig = $("#currentconfigloaded").val();
    switch (currentconfig) {
        case "Mine Build":
            saveMineBuildConfig();
            break;
        case "Storage Build":
            saveStorageBuildConfig();
            break;
        case "Transporter":
            saveTransporterConfig();
            break;
        case "Facility Build":
            saveFacilityBuildConfig();
            break;
        case "Cargo Deploy":
            saveCargoDeployConfig();
            break;
        case "Fleet Collect":
            saveFleetCollectConfig();
            break;
        case "Scheduler":
            saveSchedulerConfig();
            break;
    }
    let session = getSession();
    if ($(".planetlink.active > .planet-koords").length > 0) {
        session.runningcoords = `${$(".planetlink.active > .planet-koords").text()}`;
        session.coordstype = "planet"
    }
    else {
        session.runningcoords = `${$(".planet-koords.moon_active").text()}`;
        session.coordstype = "moon"
    }

    let schedule = $("#schedule-time").val();
    if (schedule && schedule != "" && currentconfig != "") {
        session.isrunning = false;
        session.currentrunning = "";
        let scheduledDate = new Date($("#schedule-time").val())
        session.scheduler.push({
            time: scheduledDate.getTime(),
            script: currentconfig,
            executed: false,
            runningcoords: session.runningcoords,
            coordstype: session.coordstype,
            cargodeploy: session.cargodeploy ? session.cargodeploy : {},
            fleetcollect: session.fleetcollect ? session.fleetcollect : {}
        })
        session.scheduler.sort((a, b) => a.time - b.time);
    }

    saveSession(session);
    loadMainComponent();
    runMotherScript();
}

function stopScript() {
    let session = getSession();
    session.isrunning = false;
    session.currentrunning = "";
    session.schedulerscript = false;
    saveSession(session);
    loadMainComponent();
}

function getConfig() {
    return JSON.parse(localStorage.MotherScript);
}

function saveConfig(config) {
    localStorage.MotherScript = JSON.stringify(config);
}

function getSession() {
    return JSON.parse(sessionStorage.MotherScript);
}

function saveSession(session) {
    sessionStorage.MotherScript = JSON.stringify(session);
}

//Scheduler Functions
function loadSchedulerConfig() {
    $("#currentconfigloaded").val("Scheduler");
    $("#scheduler-input").remove();
    let session = getSession();
    $("#configbody").html(`
        <div class="motherscript subsection">Scheduled Task</div>
        <div class="motherscript subsection">Status</div>
    `);

    session.scheduler.forEach(task => {
        let taskTime = new Date(task.time);
        $("#configbody").append(`
            <div class="motherscript subsection" style="text-align: left">${task.script} ${task.runningcoords}${task.coordstype == "planet" ? "P" : "M"} ${taskTime.toLocaleString()} </div>
            <div class="motherscript subsection ${task.executed ? "active" : "inactive"}">${task.executed ? "EXECUTED" : "PENDING"}</div>
        `);
    })
}

function saveSchedulerConfig() {
    let session = getSession();
    session.isrunning = true;
    session.currentrunning = "Scheduler";
    session.schedulerscript = true;
    saveSession(session);
}

function runScheduler() {
    loadMainComponent();
    let session = getSession();
    let task = session.scheduler.find(item => item.executed == false);
    let ogameTime = $(".OGameClock").text().split(" ");
    ogameTime[0] = ogameTime[0].split(".");
    let temp = ogameTime[0][0];
    ogameTime[0][0] = ogameTime[0][1];
    ogameTime[0][1] = temp;
    ogameTime[0] = ogameTime[0].join(".");
    ogameTime = ogameTime.join(" ");
    let serverTime = new Date(ogameTime);
    if (task)
        setTimeout(() => {
            session.currentrunning = task.script;
            session.runningcoords = task.runningcoords;
            session.coordstype = task.coordstype;
            session.fleetcollect = task.fleetcollect;
            session.cargodeploy = task.cargodeploy;
            task.executed = true;
            saveSession(session);
            runMotherScript();
        }, task.time - serverTime.getTime());
}

//Mine Build Functions
function loadMineBuildConfig() {
    $("#currentconfigloaded").val("Mine Build");
    let state = getConfig();
    let config = state.scriptconfig.minebuild;
    $("#configbody").html(`
        <div class="motherscript subsection">Mine Level Difference</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript smallinput" id="metalleveldiff" value="${config.leveldifference[0]}"/></input>:
            <input type="text" class="motherscript smallinput" id="crystalleveldiff" value="${config.leveldifference[1]}"/></input>:
            <input type="text" class="motherscript smallinput" id="deutleveldiff" value="${config.leveldifference[2]}"/></input>
        </div>
        <div class="motherscript subsection">Max Mine Level</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript smallinput" id="metallevelmax" value="${config.levelmax[0]}"/></input>:
            <input type="text" class="motherscript smallinput" id="crystallevelmax" value="${config.levelmax[1]}"/></input>:
            <input type="text" class="motherscript smallinput" id="deutlevelmax" value="${config.levelmax[2]}"/></input>
        </div>
    `);
}

function saveMineBuildConfig() {
    let config = getConfig();
    config.scriptconfig.minebuild.leveldifference = [
        parseInt($("#metalleveldiff").val(), 10),
        parseInt($("#crystalleveldiff").val(), 10),
        parseInt($("#deutleveldiff").val(), 10),
    ];
    config.scriptconfig.minebuild.levelmax = [
        parseInt($("#metallevelmax").val(), 10),
        parseInt($("#crystallevelmax").val(), 10),
        parseInt($("#deutlevelmax").val(), 10),
    ];
    saveConfig(config);

    let session = getSession();
    session.isrunning = true;
    session.currentrunning = "Mine Build";
    saveSession(session);
}

function runMineBuild() {
    if (location.search.search(/^\?page=ingame&component=supplies/) == -1 || $(".motherscript").length > 0) {
        location.href = `/game/index.php?page=ingame&component=supplies`;
        return;
    }

    loadMainComponent();
    let state = getConfig();
    let config = state.scriptconfig.minebuild;
    setInterval(function () {
        location.href = location.href;
    }, 30000 + Math.random() * 30000);

    if ($("#productionboxbuildingcomponent .idle").text() != "") {
        var resourceEnergy = parseInt($("#resources_energy").text().trim(), 10);
        if (resourceEnergy < 0)
            setTimeout(buildSolarPlant, Math.random() * 2000);
        else
            setTimeout(buildMines, Math.random() * 2000);
    }

    function buildSolarPlant() {
        $(".solarPlant button").trigger("click");
    }

    function buildMines() {
        var metalLevel =
            parseInt($(".metalMine > .level").text(), 10);
        var crystalLevel =
            parseInt($(".crystalMine > .level").text(), 10);
        var deuteriumLevel =
            parseInt($(".deuteriumSynthesizer > .level").text(), 10);

        var levelsArraySorted = {
            metal: metalLevel < config.levelmax[0] ? metalLevel - config.leveldifference[0] : -1,
            crystal: crystalLevel < config.levelmax[1] ? crystalLevel - config.leveldifference[1] : -1,
            deuterium: deuteriumLevel < config.levelmax[2] ? deuteriumLevel - config.leveldifference[2] : -1
        }

        var lowestLevel = "metal";
        if ((levelsArraySorted["metal"] == -1 || levelsArraySorted[lowestLevel] > levelsArraySorted["crystal"]) && levelsArraySorted["crystal"] != -1)
            lowestLevel = "crystal";
        if ((levelsArraySorted["crystal"] == -1 || levelsArraySorted[lowestLevel] > levelsArraySorted["deuterium"]) && levelsArraySorted["deuterium"] != -1)
            lowestLevel = "deuterium";
        if (lowestLevel == "metal" && levelsArraySorted["metal"] == -1)
            lowestLevel = "";

        switch (lowestLevel) {
            case "metal": $(".metalMine button").trigger("click"); break;
            case "crystal": $(".crystalMine button").trigger("click"); break;
            case "deuterium": $(".deuteriumSynthesizer button").trigger("click"); break;
        }
    }
}

//Storage Build Function
function loadStorageBuildConfig() {
    $("#currentconfigloaded").val("Storage Build");
    let state = getConfig();
    let config = state.scriptconfig.storagebuild;
    $("#configbody").html(`
        <div class="motherscript subsection">Storage Level Difference</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript smallinput" id="metalstoragediff" value="${config.leveldifference[0]}"/></input>:
            <input type="text" class="motherscript smallinput" id="crystalstoragediff" value="${config.leveldifference[1]}"/></input>:
            <input type="text" class="motherscript smallinput" id="deutstoragediff" value="${config.leveldifference[2]}"/></input>
        </div>
        <div class="motherscript subsection">Max Storage Level</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript smallinput" id="metalstoragemax" value="${config.levelmax[0]}"/></input>:
            <input type="text" class="motherscript smallinput" id="crystalstoragemax" value="${config.levelmax[1]}"/></input>:
            <input type="text" class="motherscript smallinput" id="deutstoragemax" value="${config.levelmax[2]}"/></input>
        </div>
    `);
}

function saveStorageBuildConfig() {
    let config = getConfig();
    config.scriptconfig.storagebuild.leveldifference = [
        parseInt($("#metalstoragediff").val(), 10),
        parseInt($("#crystalstoragediff").val(), 10),
        parseInt($("#deutstoragediff").val(), 10),
    ];
    config.scriptconfig.storagebuild.levelmax = [
        parseInt($("#metalstoragemax").val(), 10),
        parseInt($("#crystalstoragemax").val(), 10),
        parseInt($("#deutstoragemax").val(), 10),
    ];
    saveConfig(config);

    let session = getSession();
    session.isrunning = true;
    session.currentrunning = "Storage Build";
    saveSession(session);
}

function runStorageBuild() {
    if (location.search.search(/^\?page=ingame&component=supplies/) == -1 || $(".motherscript").length > 0) {
        location.href = `/game/index.php?page=ingame&component=supplies`;
        return;
    }

    loadMainComponent();
    let state = getConfig();
    let config = state.scriptconfig.storagebuild;
    setInterval(function () {
        location.href = location.href;
    }, 30000 + Math.random() * 30000);

    if ($("#productionboxbuildingcomponent .idle").text() != "") {
        setTimeout(buildStorage, Math.random() * 2000);
    }

    function buildStorage() {
        var metalLevel =
            parseInt($(".metalStorage > .level").text(), 10);
        var crystalLevel =
            parseInt($(".crystalStorage > .level").text(), 10);
        var deuteriumLevel =
            parseInt($(".deuteriumStorage > .level").text(), 10);

        var levelsArraySorted = {
            metal: metalLevel < config.levelmax[0] ? metalLevel - config.leveldifference[0] : -1,
            crystal: crystalLevel < config.levelmax[1] ? crystalLevel - config.leveldifference[1] : -1,
            deuterium: deuteriumLevel < config.levelmax[2] ? deuteriumLevel - config.leveldifference[2] : -1
        }

        var lowestLevel = "metal";
        if ((levelsArraySorted["metal"] == -1 || levelsArraySorted[lowestLevel] > levelsArraySorted["crystal"]) && levelsArraySorted["crystal"] != -1)
            lowestLevel = "crystal";
        if ((levelsArraySorted["crystal"] == -1 || levelsArraySorted[lowestLevel] > levelsArraySorted["deuterium"]) && levelsArraySorted["deuterium"] != -1)
            lowestLevel = "deuterium";
        if (lowestLevel == "metal" && levelsArraySorted["metal"] == -1)
            lowestLevel = "";

        switch (lowestLevel) {
            case "metal": $(".metalStorage button").trigger("click"); break;
            case "crystal": $(".crystalStorage button").trigger("click"); break;
            case "deuterium": $(".deuteriumStorage button").trigger("click"); break;
        }
    }
}

//Facility Build Functions 
function loadFacilityBuildConfig() {
    $("#currentconfigloaded").val("Facility Build");
    let state = getConfig();
    let config = state.scriptconfig.facilitybuild;
    $("#configbody").html(`
        <div class="motherscript subsection">Facility Build</div>
        <div class="motherscript subsection">Robotics:Shipyard:Research</div>
        <div class="motherscript subsection">Facility Level Difference</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript smallinput" id="roboticsdiff" value="${config.leveldifference[0]}"/></input>:
            <input type="text" class="motherscript smallinput" id="shipyarddiff" value="${config.leveldifference[1]}"/></input>:
            <input type="text" class="motherscript smallinput" id="researchdiff" value="${config.leveldifference[2]}"/></input>
        </div>
        <div class="motherscript subsection">Max Facility Level</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript smallinput" id="roboticsmax" value="${config.levelmax[0]}"/></input>:
            <input type="text" class="motherscript smallinput" id="shipyardmax" value="${config.levelmax[1]}"/></input>:
            <input type="text" class="motherscript smallinput" id="researchmax" value="${config.levelmax[2]}"/></input>
        </div>
    `);
}

function saveFacilityBuildConfig() {
    let config = getConfig();
    config.scriptconfig.facilitybuild.leveldifference = [
        parseInt($("#roboticsdiff").val(), 10),
        parseInt($("#shipyarddiff").val(), 10),
        parseInt($("#researchdiff").val(), 10),
    ];
    config.scriptconfig.facilitybuild.levelmax = [
        parseInt($("#roboticsmax").val(), 10),
        parseInt($("#shipyardmax").val(), 10),
        parseInt($("#researchmax").val(), 10),
    ];
    saveConfig(config);

    let session = getSession();
    session.isrunning = true;
    session.currentrunning = "Facility Build";
    saveSession(session);
}

function runFacilityBuild() {
    if (location.search.search(/^\?page=ingame&component=facilities/) == -1 || $(".motherscript").length > 0) {
        location.href = `/game/index.php?page=ingame&component=facilities`;
        return;
    }

    loadMainComponent();
    let state = getConfig();
    let config = state.scriptconfig.facilitybuild;
    setInterval(function () {
        location.href = location.href;
    }, 30000 + Math.random() * 30000);

    if ($("#productionboxbuildingcomponent .idle").text() != "") {
        setTimeout(buildFacility, Math.random() * 2000);
    }

    function buildFacility() {
        var roboticsLevel =
            parseInt($(".roboticsFactory > .level").text(), 10);
        var shipyardLevel =
            parseInt($(".shipyard > .level").text(), 10);
        var researchLevel =
            parseInt($(".researchLaboratory > .level").text(), 10);

        var levelsArraySorted = {
            roboticsFactory: roboticsLevel < config.levelmax[0] ? roboticsLevel - config.leveldifference[0] : -1,
            shipyard: shipyardLevel < config.levelmax[1] ? shipyardLevel - config.leveldifference[1] : -1,
            researchLaboratory: researchLevel < config.levelmax[2] ? researchLevel - config.leveldifference[2] : -1
        }

        var lowestLevel = "roboticsFactory";
        if ((levelsArraySorted["roboticsFactory"] == -1 || levelsArraySorted[lowestLevel] > levelsArraySorted["shipyard"]) && levelsArraySorted["shipyard"] != -1)
            lowestLevel = "shipyard";
        if ((levelsArraySorted["shipyard"] == -1 || levelsArraySorted[lowestLevel] > levelsArraySorted["researchLaboratory"]) && levelsArraySorted["researchLaboratory"] != -1)
            lowestLevel = "researchLaboratory";
        if (lowestLevel == "roboticsFactory" && levelsArraySorted["roboticsFactory"] == -1)
            lowestLevel = "";

        switch (lowestLevel) {
            case "roboticsFactory": $(".roboticsFactory button").trigger("click"); break;
            case "shipyard": $(".shipyard button").trigger("click"); break;
            case "researchLaboratory": $(".researchLaboratory button").trigger("click"); break;
        }
    }
}

//Transporter functions
function initializeTransporter() {
    initializeSelfTransporter();
    $(".technology").on("click", overrideSprite);
    $(document).on("click", "#incrementLevel", incrementLevel);
    $(document).on("click", "#decrementLevel", decerementLevel);
    $(document).on("click", "#increment10Levels", incrementTenLevels);
    $(document).on("click", "#decrement10Levels", decerementTenLevels);
    $(document).on("click", "#saveTransporterEntry", saveTransporterEntry);

    function overrideSprite(item) {
        clearInterval(sessionStorage.overrideSpriteTimerID);
        sessionStorage.overrideSpriteTimerID = setInterval(() => {
            if ($(".og-loading").css("display") == "none") {
                clearInterval(sessionStorage.overrideSpriteTimerID);
                configSprite();
            }
        }, 100);
    }

    function configSprite() {
        let currentLocation = $(".planetlink.active > .planet-koords").text();
        let locationType = "planet";
        if (currentLocation === "") {
            currentLocation = $(".planet-koords.moon_active").text();
            locationType = "moon";
        }
        let currentItem = $("#technologydetails > .content > h3").text();
        let config = getConfig();

        let configExists = false;
        config.scriptconfig.transporter.forEach(item => {
            if (item.location == currentLocation && item.locationType == locationType && item.item == currentItem)
                configExists = true;
        })

        if (!configExists) {
            let buildDuration = $(".build_duration > .value").attr("datetime");
            let dateArray = buildDuration.replace("P", "").replace("T", "").replace("D", ":").replace("H", ":").replace("M", ":").replace("S", "");
            switch (location.search.split("=")[2].split("&")[0]) {
                case "research":
                case "facilities":
                case "supplies":
                    config.scriptconfig.transporter.push({
                        type: location.search.split("=")[2].split("&")[0],
                        location: currentLocation,
                        locationType: locationType,
                        item: currentItem,
                        fromLevel: parseInt($(".information .level").attr("data-value")),
                        toLevel: parseInt($(".information .level").attr("data-value")),
                        missingMetal: parseInt($(".resource.metal").attr("data-value")),
                        missingCrystal: parseInt($(".resource.crystal").attr("data-value")),
                        missingDeuterium: parseInt($(".resource.deuterium").attr("data-value")),
                        currentMetal: parseInt($("#resources_metal").attr("data-raw")),
                        currentCrystal: parseInt($("#resources_crystal").attr("data-raw")),
                        currentDeuterium: parseInt($("#resources_deuterium").attr("data-raw")),
                        duration: dateArray,
                        saved: false
                    });
                    break;
                case "shipyard":
                case "defenses":
                    config.scriptconfig.transporter.push({
                        type: location.search.split("=")[2].split("&")[0],
                        location: currentLocation,
                        item: currentItem,
                        count: 1,
                        missingMetal: parseInt($(".resource.metal").attr("data-value")),
                        missingCrystal: parseInt($(".resource.crystal").attr("data-value")),
                        missingDeuterium: parseInt($(".resource.deuterium").attr("data-value")),
                        currentMetal: parseInt($("#resources_metal").attr("data-raw")),
                        currentCrystal: parseInt($("#resources_crystal").attr("data-raw")),
                        currentDeuterium: parseInt($("#resources_deuterium").attr("data-raw")),
                        duration: dateArray,
                        saved: false
                    });
                    break;
            }
        }
        saveConfig(config);
        showSprite();
        let onkeyupevent = $("#build_amount").attr("onkeyup");
        $("#build_amount").attr("onkeyup", onkeyupevent + `window.saveCountFromBuildAmount()`);
    }

    window.saveCountFromBuildAmount = () => {
        let amount = $("#build_amount").val();
        let config = getConfig();
        let index = getConfigIndex();
        config.scriptconfig.transporter[index].count = amount;
        saveConfig(config);
        calculateMissing();
        showSprite();
    }

    function incrementTenLevels(event) {
        incrementLevel(event, 10);
    }

    function decerementTenLevels(event) {
        decerementLevel(event, 10);
    }

    function incrementLevel(event, incVal = 1) {
        let config = getConfig();
        let index = getConfigIndex();

        switch (config.scriptconfig.transporter[index].type) {
            case "research":
            case "facilities":
            case "supplies":
                config.scriptconfig.transporter[index].toLevel = config.scriptconfig.transporter[index].toLevel + incVal;
                break;
            case "shipyard":
            case "defenses":
                config.scriptconfig.transporter[index].count = config.scriptconfig.transporter[index].count + incVal;
                break;
        }

        saveConfig(config);
        calculateMissing();
        showSprite();
    }

    function decerementLevel(event, incVal = 1) {
        let config = getConfig();
        let index = getConfigIndex();

        switch (config.scriptconfig.transporter[index].type) {
            case "research":
            case "facilities":
            case "supplies":
                let toLevel = config.scriptconfig.transporter[index].toLevel;
                let fromLevel = config.scriptconfig.transporter[index].fromLevel;
                config.scriptconfig.transporter[index].toLevel = toLevel - incVal < fromLevel ? fromLevel : toLevel - incVal;
                break;
            case "shipyard":
            case "defenses":
                let count = config.scriptconfig.transporter[index].count;
                config.scriptconfig.transporter[index].count = count - incVal < 1 ? 1 : count - incVal;
                break;
        }

        saveConfig(config);
        calculateMissing();
        showSprite();
    }

    function saveTransporterEntry() {
        let config = getConfig();
        let index = getConfigIndex();

        if (config.scriptconfig.transporter[index].saved)
            config.scriptconfig.transporter.splice(index, 1);
        else
            config.scriptconfig.transporter[index].saved = true;

        saveConfig(config);
        configSprite();
    }

    function calculateMissing() {
        let config = getConfig();
        let i = getConfigIndex();
        let multiplyFactor = 1;

        let diff = 0;

        switch (config.scriptconfig.transporter[i].type) {
            case "research":
            case "facilities":
                multiplyFactor = 2;
                diff = config.scriptconfig.transporter[i].toLevel - config.scriptconfig.transporter[i].fromLevel;
                break;
            case "supplies":
                multiplyFactor = 1.5;
                diff = config.scriptconfig.transporter[i].toLevel - config.scriptconfig.transporter[i].fromLevel;
                break;
            case "shipyard":
            case "defenses":
                diff = config.scriptconfig.transporter[i].count;
                multiplyFactor = 1;

        }

        switch (config.scriptconfig.transporter[i].type) {
            case "research":
            case "facilities":
            case "supplies":
                config.scriptconfig.transporter[i].missingMetal = parseInt($(".resource.metal").attr("data-value"));
                for (l = 1; l <= diff; l++)
                    config.scriptconfig.transporter[i].missingMetal += Math.ceil(parseInt($(".resource.metal").attr("data-value")) * Math.pow(multiplyFactor, l));

                config.scriptconfig.transporter[i].missingCrystal = parseInt($(".resource.crystal").attr("data-value"));
                for (l = 1; l <= diff; l++)
                    config.scriptconfig.transporter[i].missingCrystal += Math.ceil(parseInt($(".resource.crystal").attr("data-value")) * Math.pow(multiplyFactor, l));

                config.scriptconfig.transporter[i].missingDeuterium = parseInt($(".resource.deuterium").attr("data-value"));
                for (l = 1; l <= diff; l++)
                    config.scriptconfig.transporter[i].missingDeuterium += Math.ceil(parseInt($(".resource.deuterium").attr("data-value")) * Math.pow(multiplyFactor, l));
                break;
            case "shipyard":
            case "defenses":
                config.scriptconfig.transporter[i].missingMetal = parseInt($(".resource.metal").attr("data-value")) * diff;
                config.scriptconfig.transporter[i].missingCrystal = parseInt($(".resource.crystal").attr("data-value")) * diff;
                config.scriptconfig.transporter[i].missingDeuterium = parseInt($(".resource.deuterium").attr("data-value")) * diff;
                break;
        }

        saveConfig(config);
    }


    function showSprite() {
        let currentConfig = loadOpenedTechConfig();

        let titleText = "";
        switch (currentConfig.type) {
            case "research":
            case "facilities":
            case "supplies":
                titleText = `Level ${currentConfig.fromLevel} -> ${currentConfig.toLevel}`;
                break;
            case "shipyard":
            case "defenses":
                titleText = `Count: ${currentConfig.count}`;
                break;
        }

        currentConfig.missingMetal -= currentConfig.currentMetal;
        currentConfig.missingCrystal -= currentConfig.currentCrystal;
        currentConfig.missingDeuterium -= currentConfig.currentDeuterium;

        currentConfig.missingMetal = isNaN(currentConfig.missingMetal) || currentConfig.missingMetal < 0 ? 0 : currentConfig.missingMetal;
        currentConfig.missingCrystal = isNaN(currentConfig.missingCrystal) || currentConfig.missingCrystal < 0 ? 0 : currentConfig.missingCrystal;
        currentConfig.missingDeuterium = isNaN(currentConfig.missingDeuterium) || currentConfig.missingDeuterium < 0 ? 0 : currentConfig.missingDeuterium;



        currentConfig.missingMetal = dotseperator(currentConfig.missingMetal);
        currentConfig.missingCrystal = dotseperator(currentConfig.missingCrystal);
        currentConfig.missingDeuterium = dotseperator(currentConfig.missingDeuterium);

        $(".sprite_large").html(`
            <div style="box-sizing: border-box; width: 100%; height: 100%; background-color: rgb(81, 0, 128, 0.8); color: white; font-size: 14px; padding: 10px; text-align: center;">
                <div>${titleText}</div>
                <div style="margin-top:20px">Missing:</div>
                <div style="margin-top:5px;font-size:20px">${currentConfig.missingMetal} M</div>
                <div style="margin-top:5px;font-size:20px">${currentConfig.missingCrystal} C</div>
                <div style="margin-top:5px;font-size:20px">${currentConfig.missingDeuterium} D</div>
                <div style="margin-top:10px;font-size:15px"></div>
                <div style="margin-top:5px;">
                    <button id="decrement10Levels" style="padding: 5px;color:white;font-size:20px"><<</button>
                    <button id="decrementLevel" style="padding: 5px;color:white;font-size:20px"><</button>
                    <button id="incrementLevel" style="padding: 5px;color:white;font-size:20px">></button>
                    <button id="increment10Levels" style="padding: 5px;color:white;font-size:20px">>></button>
                </div>
                <div style="margin-top:0px;">
                    <button id="saveTransporterEntry" style="font-size:20px; color: white">${currentConfig.saved ? "Remove" : "Save"}</button>
                </div>
            </div>
        `);
    }

    function loadOpenedTechConfig() {
        let config = getConfig();

        let currentLocation = $(".planetlink.active > .planet-koords").text();
        let locationType = "planet";
        if (currentLocation === "") {
            currentLocation = $(".planet-koords.moon_active").text();
            locationType = "moon";
        }

        let currentItem = $("#technologydetails > .content > h3").text();
        let currentConfig = [];
        config.scriptconfig.transporter.forEach(item => {
            if (item.location == currentLocation && item.locationType == locationType && item.item == currentItem)
                currentConfig = item;
        })
        return currentConfig;
    }

    function getConfigIndex() {
        let config = getConfig();

        let currentLocation = $(".planetlink.active > .planet-koords").text();
        let locationType = "planet";
        if (currentLocation === "") {
            currentLocation = $(".planet-koords.moon_active").text();
            locationType = "moon";
        }

        let currentItem = $("#technologydetails > .content > h3").text();
        let index = 0;
        config.scriptconfig.transporter.forEach((item, i) => {
            if (item.location == currentLocation && item.locationType == locationType && item.item == currentItem)
                index = i;
        })
        return index;
    }

    function initializeSelfTransporter() {
        let config = getConfig();
        let filteredConfig = [];
        config.scriptconfig.transporter.forEach(item => {
            if (item.saved)
                filteredConfig.push(item);
        })
        config.scriptconfig.transporter = filteredConfig;
        saveConfig(config);
    }
}

function loadTransporterConfig() {

    let state = getConfig();
    $("#configbody").html(``);
    $("#configbody").append(`
        <div id="toggleTransporter" class="motherscript subsection ${state.scriptconfig.transporterEnabled ? "active" : "inactive"}" style="justify-content:center; padding-left:20px; width:100%; cursor: pointer">
           ${state.scriptconfig.transporterEnabled ? "ُENABLED" : "DISABLED"}
        </div>
    `);

    $("#toggleTransporter").on("click", function () {
        let st = getConfig();
        st.scriptconfig.transporterEnabled = !st.scriptconfig.transporterEnabled;
        saveConfig(st);
        loadTransporterConfig();
    })

    let session = getSession();
    if (!session.isrunning && state.scriptconfig.transporterEnabled) {
        $("#currentconfigloaded").val("Transporter");
        let config = state.scriptconfig.transporter;
        let totals = [];
        addConfigBodySeperator();

        config.forEach((item, index) => {
            if (!totals[item.location])
                totals[item.location] = {
                    missingMetal: 0,
                    missingCrystal: 0,
                    missingDeuterium: 0,
                    currentMetal: 0,
                    currentCrystal: 0,
                    currentDeuterium: 0
                };
            let tempMetal = item.missingMetal ? item.missingMetal : 0;
            let tempCrystal = item.missingCrystal ? item.missingCrystal : 0;
            let tempDeut = item.missingDeuterium ? item.missingDeuterium : 0;
            totals[item.location].missingMetal += tempMetal;
            totals[item.location].missingCrystal += tempCrystal;
            totals[item.location].missingDeuterium += tempDeut;
            totals[item.location].currentMetal = item.currentMetal;
            totals[item.location].currentCrystal = item.currentCrystal;
            totals[item.location].currentDeuterium = item.currentDeuterium;

            let transportEntryText = "";
            switch (item.type) {
                case "research":
                case "facilities":
                case "supplies":
                    transportEntryText = `L${item.fromLevel}->${item.toLevel}`;
                    break;
                case "shipyard":
                case "defenses":
                    transportEntryText = `x${item.count}`;
                    break;
            }

            $("#configbody").append(`
                <div class="motherscript subsection" style="justify-content:start; padding-left:20px">
                    <span index="${index}" class="motherscript inactive deleteTransport" style="cursor:pointer;">[X]</span> 
                    ${item.location} ${item.locationType == "planet" ? "[P]" : "[M]"}  ${item.item} ${transportEntryText}
                    </div>
                <div class="motherscript subsection">${dotseperator(tempMetal)}M ${dotseperator(tempCrystal)}C ${dotseperator(tempDeut)}D</div> 
            `);
        })

        addConfigBodySeperator();
        let netTotals = [];
        let totalMetal = 0;
        let totalCrystal = 0;
        let totalDeuterium = 0;

        Object.keys(totals).forEach((item, index) => {
            let net = {
                location: item,
                locationType: config.find(cnfg => cnfg.location === item).locationType,
                metal: totals[item].missingMetal - totals[item].currentMetal,
                crystal: totals[item].missingCrystal - totals[item].currentCrystal,
                deuterium: totals[item].missingDeuterium - totals[item].currentDeuterium,
                dispatchType: "transport"
            };

            net.metal = net.metal < 0 ? 0 : net.metal;
            net.crystal = net.crystal < 0 ? 0 : net.crystal;
            net.deuterium = net.deuterium < 0 ? 0 : net.deuterium;

            totalMetal += net.metal;
            totalCrystal += net.crystal;
            totalDeuterium += net.deuterium;

            netTotals.push(net);

            $("#configbody").append(`
                <div class="motherscript subsection" style="justify-content:start; padding-left:20px">${net.location} ${dotseperator(net.metal)}M ${dotseperator(net.crystal)}C ${dotseperator(net.deuterium)}D</div>
                <div class="motherscript subsection">
                    <input type="radio" name="dispatchType${index}" value="transport" ${net.dispatchType == "transport" ? `checked="checked"` : ""}/>Transport
                    <input type="radio" name="dispatchType${index}" value="deploy" ${net.dispatchType == "deploy" ? `checked="checked"` : ""}/>Deploy
                </div> 
            `);
        });

        addConfigBodySeperator();
        $("#configbody").append(`
            <div class="motherscript subsection">Preferred Cargo</div>
            <div class="motherscript subsection">
                <input type="radio" name="cargotype" value="sc" checked="checked"/>SC
                <input type="radio" name="cargotype" value="lc" />LC
            </div> 
        `);

        let metalLeft = parseInt($("#resources_metal").attr("data-raw")) - totalMetal;
        let crystalLeft = parseInt($("#resources_crystal").attr("data-raw")) - totalCrystal;
        let deuteriumLeft = parseInt($("#resources_deuterium").attr("data-raw")) - totalDeuterium;

        addConfigBodySeperator();
        $("#configbody").append(`
            <div class="motherscript subsection">Metal Left</div>
            <div class="motherscript subsection ${metalLeft > 0 ? "active" : "inactive"}">${dotseperator(metalLeft)}</div>
            <div class="motherscript subsection">Crystal Left</div>
            <div class="motherscript subsection ${crystalLeft > 0 ? "active" : "inactive"}">${dotseperator(crystalLeft)}</div>
            <div class="motherscript subsection">Deauterium Left</div>
            <div class="motherscript subsection ${deuteriumLeft > 0 ? "active" : "inactive"}">${dotseperator(deuteriumLeft)}</div>
        `);
        session.transporter = netTotals;
        session.scriptAction = "ReadHyperspaceTechnology";
        saveSession(session);
    }
}

function saveTransporterConfig() {
    let session = getSession();
    session.isrunning = true;
    session.currentrunning = "Transporter";
    session.transporter.forEach((item, index) => {
        session.transporter[index].dispatchType = $(`input[name=dispatchType${index}]:checked`)[0].value;
    });
    session.cargotype = $(`input[name=cargotype]:checked`)[0].value;
    saveSession(session);
}

function deleteTransport() {
    let index = parseInt($(this).attr("index"));
    let state = getConfig();
    state.scriptconfig.transporter.splice(index, 1);
    saveConfig(state);
    loadTransporterConfig();
}

function runTransporter() {
    let session = getSession();
    switch (session.scriptAction) {
        case "ReadHyperspaceTechnology":
            ReadHyperspaceTechnology();
            break;
        case "TransportResources":
            TransportResources();
            break;
    }

    function ReadHyperspaceTechnology() {
        if (location.search.search(/^\?page=ingame&component=research/) == -1 || $(".motherscript").length > 0) {
            location.href = `/game/index.php?page=ingame&component=research`;
            return;
        }
        session.hyperspaceTech = parseInt($(".hyperspaceTechnology .level").text());
        session.scriptAction = "TransportResources";
        saveSession(session);
        runTransporter();
    }

    function TransportResources() {
        if (location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1 || $(".motherscript").length > 0) {
            location.href = `/game/index.php?page=ingame&component=fleetdispatch`;
            return;
        }

        if (session.transporter.length > 0) {
            let dispatch = session.transporter.pop();
            saveSession(session);

            let total = dispatch.metal + dispatch.crystal + dispatch.deuterium;
            let countSC = parseInt($(".transporterSmall .amount").attr("data-value"));
            let countLC = parseInt($(".transporterLarge .amount").attr("data-value"));
            let capacitySC = (5000 * (1 + 0.05 * session.hyperspaceTech));
            let capacityLC = (25000 * (1 + 0.05 * session.hyperspaceTech));
            capacitySC = $(".characterclass.miner").length > 1 ? capacitySC + 1250 : capacitySC;
            capacityLC = $(".characterclass.miner").length > 1 ? capacityLC + 6250 : capacityLC;
            let sendSC = 0;
            let sendLC = 0;

            switch (session.cargotype) {
                case "sc":
                    sendSC = Math.ceil(total / capacitySC);
                    sendSC = sendSC <= countSC ? sendSC : countSC;
                    total -= sendSC * capacitySC;
                    if (total > 0)
                        sendLC = Math.ceil(total / capacityLC);
                    break;
                case "lc":
                    sendLC = Math.ceil(total / capacityLC);
                    sendLC = sendLC <= countLC ? sendLC : countLC;
                    total -= sendLC * capacityLC;
                    if (total > 0)
                        sendLC = Math.ceil(total / capacitySC);
                    break;
            }

            $("input[name=transporterSmall]").val(sendSC);
            $("input[name=transporterSmall]").trigger("keyup");
            $("input[name=transporterLarge]").val(sendLC);
            $("input[name=transporterLarge]").trigger("keyup");
            let coords = dispatch.location.replace("[", "").replace("]", "").split(":");

            $("#continueToFleet2").trigger("click");

            $("#galaxy").val(coords[0]);
            $("#galaxy").trigger("keyup");
            $("#system").val(coords[1]);
            $("#system").trigger("keyup");
            $("#position").val(coords[2]);
            $("#position").trigger("keyup");
            if (dispatch.locationType == "planet")
                $("#pbutton").trigger("click");
            else
                $("#mbutton").click()
            $("#continueToFleet3").trigger("click");

            clearInterval(sessionStorage.overrideSpriteTimerID);
            sessionStorage.overrideSpriteTimerID = setInterval(() => {
                if ($(".ajax_loading").css("display") == "none") {
                    clearInterval(sessionStorage.overrideSpriteTimerID);
                    sendTransportFleet();
                }
            }, 100);

            function sendTransportFleet() {
                switch (dispatch.dispatchType) {
                    case "deploy":
                        $("#missionButton4").trigger("click"); break;
                    case "transport":
                        $("#missionButton3").trigger("click"); break;
                }
                $("#metal").val(dispatch.metal);
                $("#metal").trigger("keyup");
                $("#crystal").val(dispatch.crystal);
                $("#crystal").trigger("keyup");
                $("#deuterium").val(dispatch.deuterium);
                $("#deuterium").trigger("keyup");
                $("#sendFleet").trigger("click");
            }
        } else {
            let state = getConfig();
            state.scriptconfig.transporter = [];
            saveConfig(state);
            let session = getSession();
            session.isrunning = false;
            session.currentrunning = "";
            if (session.schedulerscript) {
                session.isrunning = true;
                session.currentrunning = "Scheduler";
            }
            saveSession(session);
            location.href = `/game/index.php?page=ingame&component=movement`;
            return;
        }
    }
}

const dotseperator = number => {
    let string = [];
    let count = 1;
    let numberString = number.toString().split("");
    for (ds = numberString.length - 1; ds >= 0; ds--) {
        string.unshift(numberString[ds]);
        if (count % 3 == 0 && ds != 0)
            string.unshift(".");
        count++;
    }
    return string.join("");
}

function checkAGRFix() {
    $("#continueToFleet3").on("click", function () {
        clearInterval(sessionStorage.overrideSpriteTimerID);
        sessionStorage.overrideSpriteTimerID = setInterval(() => {
            if ($(".ajax_loading").css("display") == "none") {
                clearInterval(sessionStorage.overrideSpriteTimerID);
                sendTransportFleet();
            }
        }, 100);

        function sendTransportFleet() {
            let metal = 0, crystal = 0, deuterium = 0;
            location.search.replace("?", "").split("&").map(srch => srch.split("=")).forEach(prm => {
                switch (prm[0]) {
                    case "metal": metal = prm[1]; break;
                    case "crystal": crystal = prm[1]; break;
                    case "deuterium": deuterium = prm[1]; break;
                    default: break;
                }
            });
            if (metal != 0) {
                $("#metal").val(metal);
                $("#metal").trigger("keyup");
            } if (crystal != 0) {
                $("#crystal").val(crystal);
                $("#crystal").trigger("keyup");
            } if (deuterium != 0) {
                $("#deuterium").val(deuterium);
                $("#deuterium").trigger("keyup");
            }
        }
    });
}

//Cargo Deploy functions
function loadCargoDeployConfig() {
    $("#currentconfigloaded").val("Cargo Deploy");
    let planets = [];
    $(".planetlink").each(function () {
        planets.push({
            "coords": $(this).find(".planet-koords").text()
        });
    });
    $("#configbody").html(`
        <div class="motherscript subsection">Preferred Cargo</div>
        <div class="motherscript subsection">
            <input type="radio" name="cargotype" value="sc" checked="checked"/>SC
            <input type="radio" name="cargotype" value="lc" />LC
        </div>
        <div class="motherscript subsection">Extra Cargo Space</div>
        <div class="motherscript subsection">
            <input type="text" class="motherscript largeinput" id="extracargodeploy" value="0"/></input>
        </div>
    `);

    planets.forEach(item => {
        if ($(".planetlink.active > .planet-koords").text() != item.coords)
            $("#configbody").append(`
                <div class="motherscript subsection">${item.coords}</div>
                <div class="motherscript subsection">
                    <input type="checkbox" name="cargodeploy" value="${item.coords}" checked="checked"/>Deploy
                </div>
            `);
    });
}

function saveCargoDeployConfig() {
    let planets = [];
    $.each($("input[name=cargodeploy]:checked"), function () {
        planets.push({
            coords: $(this).val(),
            processed: false,
            dispatched: false,
            resources: 0
        });
    });

    let session = getSession();
    session.cargodeploy = {
        planets: planets,
        source: {}
    }

    if ($(".planetlink.active > .planet-koords").length > 0) {
        session.cargodeploy.source.coords = `${$(".planetlink.active > .planet-koords").text()}`;
        session.cargodeploy.source.coordstype = "planet"
    }
    else {
        session.cargodeploy.source.coords = `${$(".planet-koords.moon_active").text()}`;
        session.cargodeploy.source.coordstype = "moon"
    }

    session.cargodeploy.cargotype = $(`input[name=cargotype]:checked`)[0].value;
    session.cargodeploy.extracargo = parseInt($("#extracargodeploy").val());
    session.isrunning = true;
    session.cargodeploy.processedall = false;
    session.cargodeploy.hyperspaceTech = -1;
    session.currentrunning = "Cargo Deploy";
    saveSession(session);
}

function runCargoDeploy() {
    let session = getSession();
    let planets = session.cargodeploy.planets;
    if (!session.cargodeploy.processedall) {
        for (i = 0; i < planets.length; i++) {
            if (!planets[i].processed && $(".planetlink.active > .planet-koords").text() != planets[i].coords) {
                session.runningcoords = planets[i].coords;
                session.coordstype = "planet";
                saveSession(session);
                runMotherScript();
            } else
                if (!planets[i].processed && $(".planetlink.active > .planet-koords").text() == planets[i].coords) {
                    let total =
                        parseInt($("#resources_metal").attr("data-raw"))
                        + parseInt($("#resources_crystal").attr("data-raw"))
                        + parseInt($("#resources_deuterium").attr("data-raw"));
                    session.cargodeploy.planets[i].resources = total;
                    session.cargodeploy.planets[i].processed = true;
                    saveSession(session);
                    runMotherScript();
                    break;
                } else {
                    session.runningcoords = session.cargodeploy.source.coords;
                    session.coordstype = session.cargodeploy.source.coordstype;
                    session.cargodeploy.processedall = true;
                    saveSession(session);
                    runMotherScript();
                }
        }
    }
    else {
        if (session.cargodeploy.hyperspaceTech == -1) {
            if (location.search.search(/^\?page=ingame&component=research/) == -1 || $(".motherscript").length > 0) {
                location.href = `/game/index.php?page=ingame&component=research`;
                return;
            }
            session.cargodeploy.hyperspaceTech = parseInt($(".hyperspaceTechnology .level").text());
            saveSession(session)
        }

        if (location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1 || $(".motherscript").length > 0) {
            location.href = `/game/index.php?page=ingame&component=fleetdispatch`;
            return;
        }

        if (session.cargodeploy.planets.length > 0) {
            let dispatch = session.cargodeploy.planets.pop();
            saveSession(session);

            let total = dispatch.resources + session.cargodeploy.extracargo;
            let countSC = parseInt($(".transporterSmall .amount").attr("data-value"));
            let countLC = parseInt($(".transporterLarge .amount").attr("data-value"));
            let capacitySC = (5000 * (1 + 0.05 * session.cargodeploy.hyperspaceTech));
            let capacityLC = (25000 * (1 + 0.05 * session.cargodeploy.hyperspaceTech));
            capacitySC = $(".characterclass.miner").length > 1 ? capacitySC + 1250 : capacitySC;
            capacityLC = $(".characterclass.miner").length > 1 ? capacityLC + 6250 : capacityLC;
            let sendSC = 0;
            let sendLC = 0;

            switch (session.cargodeploy.cargotype) {
                case "sc":
                    sendSC = Math.ceil(total / capacitySC);
                    sendSC = sendSC <= countSC ? sendSC : countSC;
                    total -= sendSC * capacitySC;
                    if (total > 0)
                        sendLC = Math.ceil(total / capacityLC);
                    break;
                case "lc":
                    sendLC = Math.ceil(total / capacityLC);
                    sendLC = sendLC <= countLC ? sendLC : countLC;
                    total -= sendLC * capacityLC;
                    if (total > 0)
                        sendLC = Math.ceil(total / capacitySC);
                    break;
            }

            $("input[name=transporterSmall]").val(sendSC);
            $("input[name=transporterSmall]").trigger("keyup");
            $("input[name=transporterLarge]").val(sendLC);
            $("input[name=transporterLarge]").trigger("keyup");
            let coords = dispatch.coords.replace("[", "").replace("]", "").split(":");

            $("#continueToFleet2").trigger("click");

            $("#galaxy").val(coords[0]);
            $("#galaxy").trigger("keyup");
            $("#system").val(coords[1]);
            $("#system").trigger("keyup");
            $("#position").val(coords[2]);
            $("#position").trigger("keyup");
            $("#pbutton").trigger("click");
            $("#continueToFleet3").trigger("click");

            clearInterval(sessionStorage.overrideSpriteTimerID);
            sessionStorage.overrideSpriteTimerID = setInterval(() => {
                if ($(".ajax_loading").css("display") == "none") {
                    clearInterval(sessionStorage.overrideSpriteTimerID);
                    sendDeployFleet();
                }
            }, 100);

            function sendDeployFleet() {
                $("#missionButton4").trigger("click");
                $("#sendFleet").trigger("click");
            }
        } else {
            let session = getSession();
            session.isrunning = false;
            session.currentrunning = "";
            if (session.schedulerscript) {
                session.isrunning = true;
                session.currentrunning = "Scheduler";
            }
            saveSession(session);
            location.href = `/game/index.php?page=ingame&component=movement`;
            return;
        }
    }
}

//Fleet Collect functions 
function loadFleetCollectConfig() {
    $("#currentconfigloaded").val("Fleet Collect");
    let planets = [];
    $(".planetlink").each(function () {
        planets.push({
            "coords": $(this).find(".planet-koords").text()
        });
    });
    $("#configbody").html(`
        <div class="motherscript subsection">Collect Resources?</div>
        <div class="motherscript subsection">
            <input type="checkbox" name="collectresources" value="true" checked="checked"/>Yes
        </div>
    `);

    planets.forEach(item => {
        if ($(".planetlink.active > .planet-koords").text() != item.coords)
            $("#configbody").append(`
                <div class="motherscript subsection">${item.coords}</div>
                <div class="motherscript subsection">
                    <input type="checkbox" name="fleetcollectfromplanet" value="${item.coords}" checked="checked"/>Collect
                </div>
            `);
    });
}

function saveFleetCollectConfig() {
    let planets = [];
    $.each($("input[name=fleetcollectfromplanet]:checked"), function () {
        planets.push({
            coords: $(this).val()
        });
    });

    let session = getSession();
    session.fleetcollect = {
        planets: planets,
        destination: {}
    }

    if ($(".planetlink.active > .planet-koords").length > 0) {
        session.fleetcollect.destination.coords = `${$(".planetlink.active > .planet-koords").text()}`;
        session.fleetcollect.destination.coordstype = "planet"
    }
    else {
        session.fleetcollect.destination.coords = `${$(".planet-koords.moon_active").text()}`;
        session.fleetcollect.destination.coordstype = "moon"
    }

    session.fleetcollect.collectresources = $("input[name=collectresources]:checked").length > 0 ? true : false;
    session.fleetcollect.processedall = false;
    session.currentrunning = "Fleet Collect";
    session.isrunning = true;
    saveSession(session);
}

function runFleetCollect() {
    let session = getSession();
    if (session.fleetcollect.planets.length > 0) {
        let dispatch = session.fleetcollect.planets[session.fleetcollect.planets.length - 1];
        if ($(".planetlink.active > .planet-koords").text() != dispatch.coords) {
            session.runningcoords = dispatch.coords;
            session.coordstype = "planet";
            saveSession(session);
            runMotherScript();
        } else {
            if (location.search.search(/^\?page=ingame&component=fleetdispatch/) == -1 || $(".motherscript").length > 0) {
                location.href = `/game/index.php?page=ingame&component=fleetdispatch`;
                return;
            }
            dispatch = session.fleetcollect.planets.pop();
            saveSession(session);
            if ($("#sendall").length == 0) {
                runMotherScript();
                return;
            }
            $("#sendall").click();
            $("#continueToFleet2").trigger("click");

            let coords = session.fleetcollect.destination.coords.replace("[", "").replace("]", "").split(":");
            $("#galaxy").val(coords[0]);
            $("#galaxy").trigger("keyup");
            $("#system").val(coords[1]);
            $("#system").trigger("keyup");
            $("#position").val(coords[2]);
            $("#position").trigger("keyup");
            $("#pbutton").trigger("click");
            if (session.fleetcollect.destination.coordstype == "moon")
                $("#mbutton").click();
            $("#continueToFleet3").trigger("click");

            clearInterval(sessionStorage.overrideSpriteTimerID);
            sessionStorage.overrideSpriteTimerID = setInterval(() => {
                if ($(".ajax_loading").css("display") == "none") {
                    clearInterval(sessionStorage.overrideSpriteTimerID);
                    sendDeployFleet();
                }
            }, 100);

            function sendDeployFleet() {
                $("#missionButton4").trigger("click");
                if (session.fleetcollect.collectresources)
                    $("#allresources").click()
                $("#sendFleet").trigger("click");
            }
        }
    } else {
        let session = getSession();
        session.isrunning = false;
        session.currentrunning = "";
        if (session.schedulerscript) {
            session.isrunning = true;
            session.currentrunning = "Scheduler";
        }
        saveSession(session);
        location.href = `/game/index.php?page=ingame&component=movement`;
        return;
    }
}