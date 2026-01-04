// ==UserScript==
// @name         Surviv.io | Change the color of the map
// @namespace    http://tampermonkey.net/
// @version      2.2.1
// @description  This code helps us when playing without eye strain by SK
// @author       Mink
// @match        *://surviv.io/*
// @match        *://surviv2.io/*
// @match        *://2dbattleroyale.com/*
// @match        *://2dbattleroyale.org/*
// @match        *://piearesquared.info/*
// @match        *://thecircleisclosing.com/*
// @match        *://archimedesofsyracuse.info/*
// @match        *://secantsecant.com/*
// @match        *://parmainitiative.com/*
// @match        *://nevelskoygroup.com/*
// @match        *://kugahi.com/*
// @match        *://chandlertallowmd.com/*
// @match        *://ot38.club/*
// @match        *://kugaheavyindustry.com/*
// @match        *://drchandlertallow.com/*
// @match        *://rarepotato.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450694/Survivio%20%7C%20Change%20the%20color%20of%20the%20map.user.js
// @updateURL https://update.greasyfork.org/scripts/450694/Survivio%20%7C%20Change%20the%20color%20of%20the%20map.meta.js
// ==/UserScript==

(function() {
    'use strict';
 var normalEvent = ""
 var potatoEvent = ""
 var savannahEvent = ""
 var snowEvent = ""
 var woodEvent = ""
 var func = {
   webpack_inject: (w, e, get) => {
     normalEvent = get("d5ec3c16")
     potatoEvent = get("fc096113")
     savannahEvent = get("6a4e7802")
     snowEvent = get("4e269062")
     woodEvent = get("45f86a38")
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
 Object.keys(normalEvent).forEach(function(key) {
    if(key.match(/biome/g)) {
        normalEvent[key].colors.grass = 0x95c15b;
    }
 })
 Object.keys(potatoEvent).forEach(function(key) {
    if(key.match(/biome/g)) {
        potatoEvent[key].colors.grass = 0x4d853e;
     }
 })
 Object.keys(savannahEvent).forEach(function(key) {
    if(key.match(/biome/g)) {
        savannahEvent[key].colors.grass = 0xb9b428;
    }
 })
 Object.keys(snowEvent).forEach(function(key) {
    if(key.match(/biome/g)) {
        snowEvent[key].colors.grass = 0xababa4;
    }
 })
 Object.keys(woodEvent).forEach(function(key) {
    if(key.match(/biome/g)) {
        woodEvent[key].colors.grass = 0x9a8b3b;
    }
 })
})();