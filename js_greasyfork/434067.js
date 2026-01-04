// ==UserScript==
// @name         Surviv.io trees and bushes remover
// @namespace    https://github.com/iBLiSSIN
// @version      1.3
// @description  Make trees and makes the bushes really transparent, exposing any players who hide under them or is near them. Transparent building will coming soon 
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
// @downloadURL https://update.greasyfork.org/scripts/434067/Survivio%20trees%20and%20bushes%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/434067/Survivio%20trees%20and%20bushes%20remover.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
var obj = ""
 
// Some important things 
 
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
    
// do the magic
 
Object.keys(shits).forEach(function(key2) {
    if(key2.match(/tree|bush/g)) {
        shits[key2].img.sprite.alpha = 0.5
    } else if(key2.match(/brush/g)) {
        shits[key2].img.sprite.alpha = 0.5
    } else if(key2.match(/table/g)) {
        shits[key2].img.sprite.alpha = 0.5
    } else if(key2.match(/stairs/g)) {
        shits[key2].img.sprite.alpha = 0.5
    }
})
})();