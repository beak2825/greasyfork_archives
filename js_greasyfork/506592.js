// ==UserScript==
// @name         Racing Custom Presets 2024
// @namespace    https://greasyfork.org/en/users/1361962-zstorm
// @version      0.2.2.1
// @description  Make it easier and faster to make custom races - Extended from Cryosis7's
// @author       Cryosis7 [926640], zstorm [2268511]
// @match        *www.torn.com/loader.php?sid=racing*
// @grant        none
// @icon         https://imgur.com/yIOClXv.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506592/Racing%20Custom%20Presets%202024.user.js
// @updateURL https://update.greasyfork.org/scripts/506592/Racing%20Custom%20Presets%202024.meta.js
// ==/UserScript==


/**
 * Modify the presets as you see fit, you can add and remove presets,
 * or remove individual fields within the preset to only use the fields you care about.
 * 
 * TEMPLATE
 * {
        name: "Appears as the button name and the public name of the race",
        maxDrivers: 6,
        trackName: "Industrial",
        numberOfLaps: 1,
        upgradesAllowed: true,
        betAmount: 0,
        waitTime: 0,  //0 for ASAP or 1 for Today 1st, 2 for Today 2nd, and so on
        password: "",
    },
 * 
 */
var presets = [
    {
        name: "Need 4 Speed Temp",
        maxDrivers: 100,
        trackName: "Stone Park",
        numberOfLaps: 25,
        upgradesAllowed: true,
        betAmount: 0,
        waitTime: 0,
        password: "",
    },
    {
        name: "Need 4 Speedway",
        maxDrivers: 100,
        trackName: "Speedway",
        numberOfLaps: 100,
        upgradesAllowed: true,
        betAmount: 0,
        waitTime: 1,
        password: "",
    },
                 {
        name: "Need 4 Speed -StonePark",
        maxDrivers: 100,
        trackName: "Stone Park",
        numberOfLaps: 100,
        waitTime: 1,
        password: "",
    },
    {
        name: "Need 4 Speed - Docks",
        maxDrivers: 100,
        trackName: "Docks",
        numberOfLaps: 100,
        waitTime: 5,
        password: "",
    },
];

(function() {
    'use strict';
    scrubPresets();
    $('body').ajaxComplete(function(e, xhr, settings) {
        var createCustomRaceSection = "section=createCustomRace";
        var url = settings.url;
        if (url.indexOf(createCustomRaceSection) >= 0) {
            scrubPresets();
            drawPresetBar();
        }
    });
})();

function fillPreset(index) {
    let race = presets[index];
    if ("name" in race) $('.race-wrap div.input-wrap input').attr('value', race.name);
    if ("maxDrivers" in race) $('.drivers-max-wrap div.input-wrap input').attr('value', race.maxDrivers);
    if ("numberOfLaps" in race) $('.laps-wrap > .input-wrap > input').attr('value', race.numberOfLaps);
    if ("betAmount" in race) $('.bet-wrap > .input-wrap > input').attr('value', race.betAmount);

    // Modified waitTime handling



    if ("waitTime" in race) {
        let waitTime = race.waitTime;
        let selectElement = document.querySelector("#wait-time");

        if (selectElement) {
            let options = selectElement.options;
            if (waitTime >= 0 && waitTime < options.length) {
                selectElement.selectedIndex = waitTime;
                selectElement.dispatchEvent(new Event("change", { bubbles: true }));
                $('#wait-time').selectmenu();
                $('#wait-time-menu > li:contains(' + options[waitTime].text + ')').mouseup();
                console.log("%cStartTime option: " + options[waitTime].text, "color: red;");
            } else {
                console.error("%cInvalid waitTime value: " + waitTime, "color: red;");
            }
        } else {
            console.error("%c#wait-time select element not found", "color: red;");
        }
    }

    //Old waitTime
    //if ("waitTime" in race) $('.time-wrap > .input-wrap > input').attr('value', race.waitTime);
    if ("password" in race) $('.password-wrap > .input-wrap > input').attr('value', race.password);

    if ("trackName" in race) {
        $('#select-racing-track').selectmenu();
        $('#select-racing-track-menu > li:contains(' + race.trackName + ')').mouseup();
    }
    if ("upgradesAllowed" in race) {
        $('#select-allow-upgrades').selectmenu();
        $('#select-allow-upgrades-menu > li:contains(' + race.upgradesAllowedString + ')').mouseup();
    }
}

function scrubPresets() {
    presets.forEach(x => {
        if ("name" in x && x.name.length > 25) x.name = x.name.substring(0, 26);
        if ("maxDrivers" in x) x.maxDrivers = (x.maxDrivers > 100) ? 100 : (x.maxDrivers < 2) ? 2 : x.maxDrivers;
        if ("trackName" in x) x.trackName.toLowerCase().split(' ').map(x => x.charAt(0).toUpperCase() + x.substring(1)).join(' ');
        if ("numberOfLaps" in x) x.numberOfLaps = (x.numberOfLaps > 100) ? 100 : (x.numberOfLaps < 1) ? 1 : x.numberOfLaps;
        if ("upgradesAllowed" in x) x.upgradesAllowedString = x.upgradesAllowed ? "Allow upgrades" : "Stock cars only";
        if ("betAmount" in x) x.betAmount = (x.betAmount > 10000000) ? 10000000 : (x.betAmount < 0) ? 0 : x.betAmount;
        
        if ("password" in x && x.password.length > 25) x.password = x.password.substring(0, 26);
    })
}

function drawPresetBar() {
    let filterBar = $(`
  <div class="filter-container m-top10">
    <div class="title-gray top-round">Race Presets</div>

    <div class="cont-gray p10 bottom-round">
        ${presets.map((element, index) => `<button class="torn-btn preset-btn" style="margin:0 10px 10px 0">${("name" in element) ? element.name : "Preset " + (+index + 1)}</button>`)}
    </div>
  </div>`);

$('#racingAdditionalContainer > .form-custom-wrap').before(filterBar);
$('.preset-btn').each((index, element) => element.onclick = function() {fillPreset(index)});
}