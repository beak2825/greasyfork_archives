// ==UserScript==
// @name         Surviv.io Hacks
// @namespace    https://github.com/iBLiSSIN
// @version      1.0.6
// @description  Testing. Aimbot is in progress  
// @author       vnbpm
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
// @downloadURL https://update.greasyfork.org/scripts/436402/Survivio%20Hacks.user.js
// @updateURL https://update.greasyfork.org/scripts/436402/Survivio%20Hacks.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
var obj = ""
var throwables = ""
var func = {
    webpack_inject: (w, e, get) => {
        obj = get("03f4982a")
        throwables = get("035f2ecb")
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
Object.keys(obj).forEach(function(key) {
    if(obj[key].match(/container_05/g)) return
    if(obj[key].type === "building") {
        for(var ceilImg in obj[key].ceiling.imgs) {
            obj[key].ceiling.imgs[ceilImg].alpha = 0.5
        }
    }
})
Object.keys(obj).forEach(function(key1) {
    if(key1.match(map-tree|map-bush|map-table|map-stairs|map-brush)) {
        obj[key1].img.alpha = 0.4
    }
})
Object.keys(throwables).forEach(function(key2) {
    throwables[key2].worldImg.tint = 16711680
    throwables[key2].worldImg.scale = .25
})
})();