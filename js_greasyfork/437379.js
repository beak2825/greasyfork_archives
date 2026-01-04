// ==UserScript==
// @name         SURVIV.IO ESP HACK
// @namespace    https://github.com/iBLiSSIN
// @version      1.0.3
// @license MIT
// @description  Testing
// @author       vnbpm YT
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
// @downloadURL https://update.greasyfork.org/scripts/437379/SURVIVIO%20ESP%20HACK.user.js
// @updateURL https://update.greasyfork.org/scripts/437379/SURVIVIO%20ESP%20HACK.meta.js
// ==/UserScript==
(function() {
    'use strict';
var skins = ""
var func = {
    webpack_inject: (w, e, get) => {
        skins = get("63d67e9d")
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
var pixi = this.values.pixi;
        if(!pixi) {
pixi = new window.PIXI.Graphics();
this.values.pixi = pixi;
activePlayer.container.addChild(pixi);
activePlayer.container.setChildIndex(pixi, 0);
}
if(!pixi.graphicsData) {
            return;
        }
pixi.clear();
Object.keys(skins).forEach(function(key) {
    if(key.match(/outfit/g)) {
// esp code 
            pixi.lineStyle(4, 16756224);
            pixi.moveTo(0, 0);
            pixi.lineTo(skins[key].x, skins[key].y);
    }
})
})();