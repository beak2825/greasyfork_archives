// ==UserScript==
// @name         Survivio Hack Map cho Nguyễn Quang Nhật
// @namespace    https://greasyfork.org/scripts/434290-survivio-mods-by-vnbpm/code/Survivio%20Mods%20by%20VNBPM.user.js
// @version      1.0.0
// @icon         https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/icons/icon-v1.png
// @description  hack map
// @author       VNBPM on YT
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
// @downloadURL https://update.greasyfork.org/scripts/435311/Survivio%20Hack%20Map%20cho%20Nguy%E1%BB%85n%20Quang%20Nh%E1%BA%ADt.user.js
// @updateURL https://update.greasyfork.org/scripts/435311/Survivio%20Hack%20Map%20cho%20Nguy%E1%BB%85n%20Quang%20Nh%E1%BA%ADt.meta.js
// ==/UserScript==
// -------------------------------------------------------------------------- Obastacles
(function() {
    'use strict';
 
var obstacles2 = ""
var func = {
    webpack_inject53: (w, e, get) => {
        obstacles2 = get("03f4982a")
    },
};
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject53"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject53"],
        func,
        [["webpack_inject53"]]
    ]);
}
Object.keys(obstacles2).forEach(function(key53) {
    if(key53.match(/tree_03sv/g)) {
        obstacles2[key53].map.color = 0xffffff;
        obstacles2[key53].map.borderColor = 0x000000;
        obstacles2[key53].map.scale = 4;
    } else if(key53.match(/tree_03/g)) {
        obstacles2[key53].map.color = 0xffffff;
        obstacles2[key53].map.borderColor = 0x000000;
        obstacles2[key53].map.scale = 5;
    } else if(key53.match(/container_06/g)) {
        obstacles2[key53].map.color = 0xe3e309;
    } else if(key53.match(/stone_02/g)) {
        obstacles2[key53].map.color = 0x193f82;
        obstacles2[key53].map.scale = 5;
    } else if(key53.match(/stone_04/g)) {
        obstacles2[key53].map.color = 0xeb175a;
        obstacles2[key53].map.scale = 2;
    } else if(key53.match(/stone_05/g)) {
        obstacles2[key53].map.color = 0xeb175a;
        obstacles2[key53].map.scale = 2;
    } else if(key53.match(/bunker_storm_01/g)) {
        obstacles2[key53].map.color = 0xe3e309;
    }
})
})();