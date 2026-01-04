// ==UserScript==
// @name         Surviv.io Objects Transparent
// @namespace    https://github.com/
// @version      2.2.3
// @description  Testing 
// @author       eee
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
// @downloadURL https://update.greasyfork.org/scripts/436706/Survivio%20Objects%20Transparent.user.js
// @updateURL https://update.greasyfork.org/scripts/436706/Survivio%20Objects%20Transparent.meta.js
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
    if(key2.includes(/tree|bush|brush|stairs|table/g)) {
        obj[key2].img.alpha = alpha
    }
})
})();