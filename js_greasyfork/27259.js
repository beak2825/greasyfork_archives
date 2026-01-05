// ==UserScript==
// @name         HACK Alis
// @namespace    http://tampermonkey.net/ProGameYT
// @version      0.1
// @description  Instant in crazy
// @author       ProGameYT
// @match        http://alis.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27259/HACK%20Alis.user.js
// @updateURL https://update.greasyfork.org/scripts/27259/HACK%20Alis.meta.js
// ==/UserScript==

// define levels of hackery
var playerSettings = {
    "normal": {
        "speed": 100,
        "maxCells": 32,
        "maxSize": 10000,
        "isToxic": 1,
        "ignoreBorders": 0,
        "decayRate": 0.002,
        "staticDecay": 0,
    },
    "3setplayer": {
        "speed": 100,
        "recombineTime": 0,
        "maxCells": 1,
        "maxSize": 1700,
        "decayRate": -0.0001,
        "staticDecay": 1,
        "isToxic": 1,
        "ignoreBorders": 1,
        "viewBaseX": 10000,
        "viewBaseY": 10000,
        "startMass": 40000,
    },
    "fast": {
        "speed": 100,
        "recombineTime": 0,
        "maxCells": 1,
        "maxSize": 7000,
        "decayRate": -0.02,
        "staticDecay": 1,
        "isToxic": 1,
        "ignoreBorders": 1,
        "viewBaseX": 10000,
        "viewBaseY": 10000,
        "startMass": 40000,
    }
};