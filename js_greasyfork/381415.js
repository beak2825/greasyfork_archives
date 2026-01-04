// ==UserScript==
// @name         Cookie Clicker Minihack
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Adding some basic hack features to Orteil's Cookie Clicker games
// @author       You
// @match        *orteil.dashnet.org/cookieclicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381415/Cookie%20Clicker%20Minihack.user.js
// @updateURL https://update.greasyfork.org/scripts/381415/Cookie%20Clicker%20Minihack.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    // variables
    const config = {
        goldenCookies: true, // autoclick all golden cookies
        hideNotes: true, // notes/notifications
        autoClickSpeed: 20, // false to disable - number to choose clicks per secound
        autoshop: 800, // number of each item you want to have before it stops buying automatically
        disableBadEffects: true, // disable all negative effects (that I know about)
        addTimeToBuffs: 60, // number of secs more time to buffs ("boosts" like "Frenzy")
        extremeBoost: true // activates the "sugar frenzy" buff with extreme boost
    };
    // disable autoshop for this hack; it will add items from the shop for free all the time anyway
    config.ultimateHack = false;

    // elements to use again, and again, and still again
    const shimmers = document.getElementById('shimmers'),
          notes = document.getElementById('notes'),
          bigCookie = document.getElementById('bigCookie'),
          upgrades = document.getElementById('upgrades'),
          shop = document.getElementById('products');

    // autoclick any golden cookies
    if (config.goldenCookies) {
        setInterval(function() {
            let goldenCookies = shimmers.childNodes;
            if (goldenCookies.length === 0) return;
            for (let i = 0; i < goldenCookies.length; i++) {
                goldenCookies[i].click();
            }
        }, 500);
    }

    // hide annoying notes/notifications located in bottom center
    if (config.hideNotes) {
        notes.style.display = 'none';
    }

    // autoclick the cookie - limit to x times every secound for preventing overload
    if (typeof config.autoClickSpeed === 'number' && config.autoClickSpeed >= 0) {
        setInterval(() => {
            bigCookie.click();
        }, 1000 / config.autoClickSpeed);
    }

    // auto upgrade
    setInterval(() => {
        const enabledEls = upgrades.childNodes;
        for (let i = 0; i < enabledEls.length; i++) {
            enabledEls[i].click();
        }
    }, 100);

    // autoshop
    if (typeof config.autoshop === 'number' && config.autoshop >= 0) {
        setInterval(function() {
            // will toggle on the "buy" if "sell" is choosen
            Game.storeBulkButton(0); // eslint-disable-line
            // choose to buy only 1 when clicking items - because this code is based on clicking the elements
            Game.storeBulkButton(2); // eslint-disable-line
            const items = shop.childNodes;
            for (let i = 1; i < items.length; i++) {
                const item = items[i];
                let amountNode = item.getElementsByClassName('content')[0].childNodes[4];
                if (amountNode.innerText*1 < config.autoshop) {
                    item.click(); // click item if you can afford it, and you don't have the amount you want
                }
            }
        }, 200);
    }

    // disable bad effects
    if (config.disableBadEffects) {
        Game.SpawnWrinkler=function(){}; // eslint-disable-line
        window.Game.UpdateGrandmapocalypse=function(){};
        const badBuffs = ['clot', 'building debuff'];
        const origGainBuff = Game.gainBuff; // eslint-disable-line
        Game.gainBuff = function (type, time, ...args) { // eslint-disable-line
            if (typeof type !== 'string' || badBuffs.includes(type)) return console.log(`The "${type}"-buff got prevented from taking over your CpS`);
            else origGainBuff(type, time += parseInt(config.addTimeToBuffs), ...args);
        }
    }

    //  finish the game with hack, but without the cheat achievement?
    if (config.ultimateHack && (typeof config.autoshop !== 'number' || config.autoshop === 0)) {
        setInterval(() => {
            //
        }, 500) // every 0,5 sec
    }

    if (config.extremeBoost) {
        setInterval(function() {
            Game.gainBuff('sugar frenzy', 10, 1e9); // eslint-disable-line
        }, 10*1e3 + 10);
    }

}, 3e3); // wait 3 sec before actually running this script