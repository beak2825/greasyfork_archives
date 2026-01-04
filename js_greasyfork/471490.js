// ==UserScript==
// @name         More Than One Paperclip Client
// @version      1.4.1
// @license      MIT
// @description  Multiplayer leaderboard for Universal Paperclips
// @author       Nathan Hoel
// @match        https://www.decisionproblem.com/paperclips/index2.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=universalpaperclips.fandom.com
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @run-at       document-start
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/471490/More%20Than%20One%20Paperclip%20Client.user.js
// @updateURL https://update.greasyfork.org/scripts/471490/More%20Than%20One%20Paperclip%20Client.meta.js
// ==/UserScript==
(async function() {
    var speedDelay = await GM.getValue( "actualSpeedDelay", 10) || 10;
    unsafeWindow.originalSetInterval= unsafeWindow.setInterval;
    unsafeWindow.setInterval = function(func, delay) {
        if (speedDelay === 4) {
            delay = delay/2.5;
        }
        return unsafeWindow.originalSetInterval(func, delay);
    };
})();

var main = async function() {
    'use strict';
    var player = await GM.getValue( "player", "") || "";
    var server = await GM.getValue( "server", "") || "";

    var changeSettings = async function() {
        var savedPlayer = await GM.getValue( "player", "") || "";
        var savedServer = await GM.getValue( "server", "") || "";

        player = prompt("Enter player name", savedPlayer) || savedPlayer;
        server = prompt("Enter server", savedServer) || savedServer;

        GM.setValue( "player", player );
        GM.setValue( "server", server );
    }

    if (!player || !server) {
        await changeSettings();
    }

    var newDiv = document.createElement('div');
    newDiv.style = "float: left;";
    newDiv.innerHTML = `
    <div style="margin-left: 20px;">
        <div style="float: left;"><h2 style="margin:0px;">Leaderboard</h2></div>
        <div style="float: left; margin-left: 20px;"><button type="button" id="reset_multiplayer">Ready For New Game</button></div>
        <div style="float: left; margin-left: 20px;"><button type="button" id="change_settings">Change Settings</button></div>
        <div style="float: left; margin-left: 20px;"><button type="button" id="normal_speed">Normal Speed</button></div>
        <div style="float: left; margin-left: 20px;"><button type="button" id="fast_speed">Fast Speed</button></div>
        <div style="float: left; margin-left: 20px;" id="speed"></div>
    </div>
    <div id="leaderboard" style="width: 1000px; text-align: center;">
        <iframe src="${server}?noTitle=1" style="width: 1000px; height: 2000px; border: none;"></iframe>
    </div>
    `;

    var page = document.getElementById('page');
    var firstScript = page.getElementsByTagName('script')[0];

    firstScript.parentNode.insertBefore(newDiv, firstScript);

    var leaderboard = document.getElementById('leaderboard');
    var changeSettingsButton = document.getElementById('change_settings');
    changeSettingsButton.addEventListener('click', changeSettings, false);

    var requestReset = function() {
        var x = new XMLHttpRequest();
        x.open("GET", `${server}/ready?player=${player}`);
        x.send(null);
    };
    var requestResetButton = document.getElementById('reset_multiplayer');
    requestResetButton.addEventListener('click', requestReset, false);

    var resetTime = 0;
    var reseting = false;
    var resetTimerText = async function() {
        var timeToGo = (resetTime - Date.now()) / 1000;
        if (timeToGo <= 0) {
            leaderboard.innerHTML = `<br/><h3>NEW GAME STARTING</h3><h1 style="font-size: 5em;">0.00s</h1>`;
            var savedSpeedDelay = await GM.getValue("savedSpeedDelay", 10) || 10;
            GM.setValue("actualSpeedDelay", savedSpeedDelay);
            resetPrestige();
            reset();
        } else {
            leaderboard.innerHTML = `<br/><h3>NEW GAME STARTING</h3><h1 style="font-size: 5em;">${timeToGo.toFixed(2)}s</h1>`;
            setTimeout(resetTimerText, 10);
        }
    }

    var fastSpeed = function() {
        var x = new XMLHttpRequest();
        x.open("GET", `${server}/fastspeed`);
        x.send(null);
    };
    var fastSpeedButton = document.getElementById('fast_speed');
    fastSpeedButton.addEventListener('click', fastSpeed, false);

    var normalSpeed = function() {
        var x = new XMLHttpRequest();
        x.open("GET", `${server}/normalspeed`);
        x.send(null);
    };
    var normalSpeedButton = document.getElementById('normal_speed');
    normalSpeedButton.addEventListener('click', normalSpeed, false);

    var speedText = document.getElementById('speed');
    var updateSpeedText = function(speedDelay, actualSpeedDelay) {
        var savedSpeed = "Fast";
        var actualSpeed = "Fast";
        if (speedDelay === 10) {
            savedSpeed = "Normal";
        }

        if (actualSpeedDelay === 10) {
            actualSpeed = "Normal";
        }
        speedText.innerHTML = `Next Speed: ${savedSpeed} | Current Speed: ${actualSpeed}`;
    }

    var sendData = async function () {
        GM.xmlHttpRequest({
            method: "POST",
            url: server + "/data",
            headers: { "Content-type" : "application/json" },
            responseType: "json",
            data: JSON.stringify({
                player,
                clips,
                clipsElement: clipsElement.innerHTML,
                clipRate,
                unusedClips,
                unsoldClips,
                funds,
                trust,
                processors,
                memory,
                demand: demand * 10,
                avgRev,
                yomi,
                harvesterLevel,
                wireDroneLevel,
                swarmGifts,
                probeCount,
                drifterCount,
                probeTrust,
                foundMatter,
                wireDroneFlag,
                harvesterFlag,
                project35Flag: project35.flag,
                spaceFlag
            }),
            onload: async function(e) {
                resetTime = e.response.resetTime;
                GM.setValue("savedSpeedDelay", e.response.speedDelay);
                var actualSpeedDelay = await GM.getValue("actualSpeedDelay", 10) || 10;
                updateSpeedText(e.response.speedDelay, actualSpeedDelay);
            }
        });

        if (resetTime > Date.now() && !reseting) {
            reseting = true;
            await resetTimerText();
        }


    };

    var i = setInterval(sendData, 5000);
};

document.addEventListener ("DOMContentLoaded", main);