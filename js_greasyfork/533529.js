// ==UserScript==
// @name        Custom Mods for Kirka
// @namespace   Violentmonkey Scripts
// @match       https://kirka.io/*
// @grant       none
// @version     1.0
// @author      Dami
// @description 3/3/2025, 8:54:35 PM
// @downloadURL https://update.greasyfork.org/scripts/533529/Custom%20Mods%20for%20Kirka.user.js
// @updateURL https://update.greasyfork.org/scripts/533529/Custom%20Mods%20for%20Kirka.meta.js
// ==/UserScript==
// ==UserScript==
// @name         Mods for Kirka
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Click X/x to toggle fire rate, B/b to toggle AutoDodge, K/k to toggle AutoWalk, G/g to toggle AutoJump, N/n to toggle KillAura/AutoShoot, L/l to toggle AutoCrouch, M/m to toggle AutoSwitch
// @author       Cqmbo__
// @match        https://kirka.io/
// @match        https://kirka.io/games
// @icon         https://yt3.ggpht.com/ofXbHpiwGc4bYnwwljjZJo53E7JRODr-SG32NPV1W6QiUnGUtVAYDwTP2NMz2pUPGnt99Juh5w=s88-c-k-c0x00ffffff-no-rj
// @license MIT
// @grant        none
// ==/UserScript==

let fireRateEnabled = false;
let autoDodgeEnabled = false;
let autoDodgeInterval;
let isAutoWalking = false;
let isAutoDashing = false;
let isKillauaActive = false;
let autoJumpEnabled = false;
let autoJumpInterval;
let isAutoCrouching = false;
let autoCrouchInterval;
let autoSwitchEnabled = false;
let autoSwitchInterval;
let fireRateValue = 2123;
let autoJumpIntervalValue = 100;
let autoDashInterval;
let autoSwitchIntervalValue = 50;

// Store original Date.now and performance.now functions
const originalDateNow = Date.now;
const originalPerformanceNow = performance.now;
// Automatically enable the speed hack
performance.now = () => originalPerformanceNow.call(performance) * 1.10;
console.log("Speed increase enabled");

function toggleFireRate() {
    fireRateEnabled = !fireRateEnabled;
    if (fireRateEnabled) {
        // Increase the Date.now function rate
        Date.now = () => originalDateNow() * (fireRateValue);
        console.log("Gun fire rate increase enabled");
    } else {
        // Restore original Date.now function
        Date.now = originalDateNow;
        console.log("Gun fire rate increase disabled");
    }
    updateInfoDisplay();
}
// ==UserScript==
// @name         Kirka Wallhack 2025
// @author       Kirka Central
// @match        *://kirka.io/*
// @version      1.0.3
// @description  Free Working Kirka Wallhack 2025
// @run-at       document-start
// @namespace    KirkaCentral
// ==/UserScript==

Array.isArray = new Proxy(Array.isArray, {
    apply(obj, context, args) {
        const material = args[0];
        if (material?.map?.image && material.map.image.width === 64 && material.map.image.height === 64) {
            for (let materialKey in material) {
                if (material[materialKey] === 3) {
                    material[materialKey] = 1;
                    break;
                }
            }
        }
        return Reflect.apply(obj, context, args);
    }
})