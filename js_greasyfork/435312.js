// ==UserScript==
// @name         Surviv.io Basic Hands Reskin
// @version      1.0.0
// @description  Reskin hands in the game! (cho Nguyễn Quang Nhật =)))
// @author       VNBPM on YT, Nguyễn Vân and font script by sk
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
// @namespace https://greasyfork.org/users/703117
// @downloadURL https://update.greasyfork.org/scripts/435312/Survivio%20Basic%20Hands%20Reskin.user.js
// @updateURL https://update.greasyfork.org/scripts/435312/Survivio%20Basic%20Hands%20Reskin.meta.js
// ==/UserScript==
(function() {
    'use strict';

var skinOutfit = ""
var func = {
    webpack_inject3: (w, e, get) => {
        skinOutfit = get("63d67e9d")
    },
};
if(typeof window.webpackJsonp === 'function') {
    window.webpackJsonp([0], func, ["webpack_inject3"]);
} else {
    window.webpackJsonp.push([
        ["webpack_inject3"],
        func,
        [["webpack_inject3"]]
    ]);
}
Object.keys(skinOutfit).forEach(function(key52) {
    if(key52.match(/outfitBase/g)) {
        skinOutfit[key52].skinImg.handSprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/EC9ECB3D-E9B9-4222-AA00-16BC414812E5.png";
    }
})
})();