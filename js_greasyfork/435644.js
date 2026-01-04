// ==UserScript==
// @name         Surviv.io+
// @namespace    https://github.com/iBLiSSIN
// @version      2.2.2
// @description  Testing 
// @author       vnbpm
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
// @downloadURL https://update.greasyfork.org/scripts/435644/Survivio%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/435644/Survivio%2B.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
var alpha = 0.4
var obj = ""
var func = {
    webpack_inject2: (w, e, get) => {
        obj = get("03f4982a")
    },
};
 
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject2"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject2"],
        func,
        [["webpack_inject2"]]
    ]);
}
Object.keys(obj).forEach(function(key2) {
    if(key2.img.includes("map-tree-04")) {
        alpha = 1.0
    } else if(key2.img.includes("map-tree")) {
        alpha = 0.4
    } else if(key2.img.includes("map-bush")) {
        alpha = 0.4
    } else if(key2.img.includes("map-table")) {
        alpha = 0.4
    }
     obj[key2].sprite.alpha = alpha
})
})();