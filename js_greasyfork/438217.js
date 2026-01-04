// ==UserScript==
// @name         Surviv.io | AWM Guns
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://static.wikia.nocookie.net/survivio/images/8/86/Awm.png/revision/latest?cb=20180728101224
// @description  Turn every gun into awms.
// @author       sk
// @match        https://surviv.io
// @match        https://surviv.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438217/Survivio%20%7C%20AWM%20Guns.user.js
// @updateURL https://update.greasyfork.org/scripts/438217/Survivio%20%7C%20AWM%20Guns.meta.js
// ==/UserScript==

(function() {
    'use strict';
var gun = ""
var ammo = ""
var func = {
    webpack_inject: (w, e, get) => {
        gun = get("ad1c4e70")
        ammo = get("764654e6")
    },
};
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject"],
        func,
        [["webpack_inject"]]
    ]);
}
Object.keys(gun).forEach(function(key) {
    if(gun[key].type === "gun") {
        gun[key].dualWieldType = "AWM-S";
        gun[key].lootImg.sprite = "loot-weapon-awc.img";
        }
})
Object.keys(ammo).forEach(function(key) {
    if(ammo[key].type === "ammo") {
        ammo[key].lootImg.tint = 3225600;
        ammo[key].lootImg.tintDark = 2435840;
        }
})
})();