// ==UserScript==
// @name         Races Presets
// @namespace    apo
// @version      0.2
// @license MIT
// @description  Make it easier and faster to make custom races - Extended from Xiphias's
// @match        *www.torn.com/loader.php?sid=racing*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472584/Races%20Presets.user.js
// @updateURL https://update.greasyfork.org/scripts/472584/Races%20Presets.meta.js
// ==/UserScript==

var presets = [{
        name: "AA xp 70",
        maxDrivers: 2,
        trackName: "Docks",
        numberOfLaps: 70,
        upgradesAllowed: true,
        numberOfLaps: 70,
        betAmount: 0,
        waitTime: 1,
        password: "1",
    },
    {
        name: "AA xp 80",
        maxDrivers: 2,
        trackName: "Docks",
        numberOfLaps: 80,
        upgradesAllowed: true,
        numberOfLaps: 80,
        betAmount: 0,
        waitTime: 1,
        password: "1",
    },
    {
        name: "AA xp 90",
        maxDrivers: 2,
        trackName: "Docks",
        numberOfLaps: 90,
        upgradesAllowed: true,
        numberOfLaps: 90,
        betAmount: 0,
        waitTime: 1,
        password: "1",
    },
    {
        name: "AA xp 100",
        maxDrivers: 2,
        trackName: "Docks",
        numberOfLaps: 100,
        upgradesAllowed: true,
        numberOfLaps: 100,
        betAmount: 0,
        waitTime: 1,
        password: "1",
    },
    {
        name: "PTP Night Race",
        maxDrivers: 100,
        trackName: "Docks",
        numberOfLaps: 100,
        upgradesAllowed: false,
        numberOfLaps: 100,
        betAmount: 0,
        waitTime: 1,
        password: "PTP4LIFE",
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
    if ("waitTime" in race) $('.time-wrap > .input-wrap > input').attr('value', race.waitTime);
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
        if ("waitTime" in x) x.waitTime = (x.waitTime > 2880) ? 2880 : (x.waitTime < 1) ? 1 : x.waitTime;
        if ("password" in x && x.password.length > 25) x.password = x.password.substring(0, 26);
    })
}

function drawPresetBar() {
    let filterBar = $(`
  <div class="filter-container m-top10">
    <div class="title-gray top-round">Presets</div>

    <div class="cont-gray p10 bottom-round">
        ${presets.map((element, index) => `<button class="torn-btn preset-btn" style="margin:0 10px 10px 0">${("name" in element) ? element.name : "Preset " + (+index + 1)}</button>`)}
    </div>
  </div>`);

$('#racingAdditionalContainer > .form-custom-wrap').before(filterBar);
$('.preset-btn').each((index, element) => element.onclick = function() {fillPreset(index)});
}