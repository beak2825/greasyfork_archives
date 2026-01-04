// ==UserScript==
// @name         Surviv.io ceilings remover
// @namespace    https://github.com/Michal2SAB
// @version      1.0
// @description  Removes ceilings, allowing you to look through buildings, bunkers, containers etc.
// @author       Виктор Лясковец
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
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471450/Survivio%20ceilings%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/471450/Survivio%20ceilings%20remover.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
var ceilings = ""
 
// Some important shit for this whole thing to work
 
var func = {
    webpack_inject: (w, e, get) => {
        ceilings = get("03f4982a")
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
 
// do the magic
 
Object.keys(ceilings).forEach(function(key) {
    if(ceilings[key].type === "building") {
        for(var ceilImg in ceilings[key].ceiling.imgs) {
            ceilings[key].ceiling.imgs[ceilImg].sprite = ""
        }
    }
})
})();