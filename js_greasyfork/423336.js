// ==UserScript==
// @name         Surviv.io Custom Map
// @namespace    https://tampermonkey.net
// @version      2.0.1
// @icon         https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/icons/icon-v1.png
// @description  Make this from Seasons request. You need to edit it
// @author       vnbpm YT
// @license MIT
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
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423336/Survivio%20Custom%20Map.user.js
// @updateURL https://update.greasyfork.org/scripts/423336/Survivio%20Custom%20Map.meta.js
// ==/UserScript==
(function() {
    'use strict';
var cobaltEvent = ""
var factionEvent = ""
var normalEvent = ""
var springEvent = ""
var summerEvent = ""
var desertEvent = ""
var halloweenEvent = ""
var potatoEvent = ""
var springPotatoEvent = ""
var iceEvent = ""
var snowEvent = ""
var woodEvent = ""
var snowWoodEvent = ""
var springWoodEvent = ""
var summerWoodEvent = ""
var savannahEvent = ""
var turkeyEvent = ""
var func = {
    webpack_inject: (w, e, get) => {
//=========EVENT_NAME=========\\
        cobaltEvent = get("6df31f9c")
        factionEvent = get("903f46c9")
        normalEvent = get("d5ec3c16")
        springEvent = get("6afea591")
        summerEvent = get("0444401b")
        desertEvent = get("d5ec3c16")
        halloweenEvent = get("9d3c0d8b")
        potatoEvent = get("fc096113")
        springPotatoEvent = get("fea0a94e")
        iceEvent = get("4e269062")
        snowEvent = get("4e269062")
        woodEvent = get("45f86a38")
        snowWoodEvent = get("0354ead9")
        springWoodEvent = get("b895abfa")
        summerWoodEvent = get("d0dd0bd7")
        savannahEvent = get("6a4e7802")
        turkeyEvent = get("c1e88d07")
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
//========HOW TO?========\\
/*
   Object.keys(EVENT_NAME).forEach(function(key1) {
       if(key~key999.match(/biome/g)) {
           EVENT_NAME[key~key999].colors.grass = 0xCOLOR_CODE;         (grass color)
           EVENT_NAME[key~key999].colors.water = 0xCOLOR_CODE;         (water color)
           EVENT_NAME[key~key999].colors.beach = 0xCOLOR_CODE;         (beach color/sand color/border color)
           EVENT_NAME[key~key999].colors.riverbank = 0xCOLOR_CODE;     (river bank color)
       }
   })
*/




//===========NOTE===========\\
/*
first map is 'key', next is 'key1', ...., 'key999', ....
*/





//===========EXAMPLE==========\\
Object.keys(cobaltEvent).forEach(function(key) {
    if(key.match(/biome/g)) {
        cobaltEvent[key].colors.grass = 0x8E9BA4;
        cobaltEvent[key].colors.water = 0x8E9BA4;
        cobaltEvent[key].colors.beach = 0x8E9BA4;
        cobaltEvent[key].colors.riverbank = 0x8E9BA4;
    }
})
Object.keys(factionEvent).forEach(function(key1) {
    if(key1.match(/biome/g)) {
        factionEvent[key1].colors.grass = 0x609623;
        factionEvent[key1].colors.water = 0x609623;
        factionEvent[key1].colors.beach = 0x609623;
        factionEvent[key1].colors.riverbank = 0x609623;
    }
})
})();