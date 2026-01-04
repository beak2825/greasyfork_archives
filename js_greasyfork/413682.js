// ==UserScript==
// @name         AutoGigaStations
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  A script to automatically buy warpstations and gigastations using the x+n notation.
// @author       Feconiz
// @match        *://trimps.github.io/*
// @grant        GM_registerMenuCommand
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @downloadURL https://update.greasyfork.org/scripts/413682/AutoGigaStations.user.js
// @updateURL https://update.greasyfork.org/scripts/413682/AutoGigaStations.meta.js
// ==/UserScript==
let started = false;
let reset = false;
let settings = new GM_configStruct({
    'id': 'MyConfig',
    'title': 'AutoGigaStations settings',
    'fields': {
        'start': {
            'label': 'Starting warpstations',
            'type': 'int',
            'min': 1,
            'default': 10
        },
        'increase': {
            'label': 'Additional warpstations per GigaStation',
            'type': 'int',
            'min': 0,
            'default': 3
        },
        'checkIntervalAfterPurchase': {
            'label': 'The amount of seconds to wait between checking if a warp/giga station can be bought imediattly after a purchase',
            'type': 'float',
            'min': 0.1,
            'max': 3600,
            'default': 1
        },
        'checkIntervalAfterSkip': {

            'label': 'The amount of seconds to wait between checking if a warp/giga station can be bought after being unable to purchase',
            'type': 'float',
            'min': 0.1,
            'max': 3600,
            'default': 10

        },
        'enabled': {
            'label': 'Enabled',
            'type': 'checkbox',
            'default': true
        }
    },
    'events': {
        'save': () => {
            fetchSettings();
            settings.close();
        },
        'reset': () => {
            settings.set('firstUse', '');
            reset = true;
            settings.save();
        }
    }
});

GM_registerMenuCommand("Open configuration dialog", () => settings.open());

let buyBuilding = unsafeWindow.buyBuilding;
let canAffordBuilding = unsafeWindow.canAffordBuilding;
let buyUpgrade = unsafeWindow.buyUpgrade;
let canAffordTwoLevel = unsafeWindow.canAffordTwoLevel;

let start;
let increase;
let checkIntervalAfterPurchase;
let checkIntervalAfterSkip;
let enabled;
fetchSettings();

function fetchSettings() {
    start = settings.get('start');
    increase = settings.get('increase');
    checkIntervalAfterPurchase = settings.get('checkIntervalAfterPurchase');
    checkIntervalAfterSkip = settings.get('checkIntervalAfterSkip');
    enabled = settings.get('enabled');

    if (!started) {
        started = true;
        run();
    }
}

function run() {
    let lastRunTime = new Date();
    let bought = false;
    if (enabled) {
        let game = unsafeWindow.game;
        let warpstation = game.buildings.Warpstation;
        let gigastation = game.upgrades.Gigastation;

        unsafeWindow.ws = warpstation;
        unsafeWindow.gs = gigastation;
        unsafeWindow.start = start;
        unsafeWindow.increase = increase;
        if (warpstation.owned < start + (increase * gigastation.done) && canAffordBuilding("Warpstation")) {
            buyBuilding("Warpstation", true, true);
            bought = true;
        } else if (warpstation.owned >= start + (increase * gigastation.done) && canAffordTwoLevel(gigastation, false)) {
            buyUpgrade("Gigastation", true, true, true)
            bought = true;
        }
    }

    let nextRunTime = new Date(lastRunTime);
    if (bought) {
        nextRunTime.setSeconds(nextRunTime.getSeconds() + checkIntervalAfterPurchase);
    } else {
        nextRunTime.setSeconds(nextRunTime.getSeconds() + checkIntervalAfterSkip);
    }
    let diff = nextRunTime.getTime() - lastRunTime.getTime();
    window.setTimeout(() => run(), diff);
}