// ==UserScript==
// @name         Surviv.io trees and bushes remover
// @namespace    https://github.com/Michal2SAB
// @version      2.1
// @description  Cuts trees and makes the bushes really small, exposing any players who hide under them or is near them.
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
// @downloadURL https://update.greasyfork.org/scripts/408085/Survivio%20trees%20and%20bushes%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/408085/Survivio%20trees%20and%20bushes%20remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

var shits = ""

// Some important shit for this whole thing to work

var func = {
    webpack_inject2: (w, e, get) => {
        shits = get("03f4982a")
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
    
// do the magic

Object.keys(shits).forEach(function(key2) {
    if(key2.match(/tree/g)) {
        shits[key2].img.sprite = "https://surviv.io/img/map/map-tree-res-02.svg"
    } else if(key2.match(/bush/g)) {
        shits[key2].img.scale = 0.16
    } else if(key2.match(/table/g)) {
        shits[key2].img.sprite = ""
    }
})
})();