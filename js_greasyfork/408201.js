// ==UserScript==
// @name         Throwables Mod
// @namespace    https://github.com/Michal2SAB
// @version      2.2
// @description  Increases the size of throwables, making it easier to avoid them. Makes it very easy to notice mines.
// @author       Michal2SAB
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
// @downloadURL https://update.greasyfork.org/scripts/408201/Throwables%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/408201/Throwables%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

var throwables = ""

// Some important shit for this whole thing to work

var func = {
    webpack_inject1: (w, e, get) => {
        throwables = get("035f2ecb")
    },
};

if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject1"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject1"],
        func,
        [["webpack_inject1"]]
    ]);
}

// do the magic

Object.keys(throwables).forEach(function(key1) {
    throwables[key1].worldImg.scale = .25
})
})();