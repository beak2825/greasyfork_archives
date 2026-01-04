// ==UserScript==
// @name         Surviv.io Guns Reskin
// @version      1.0.2
// @description  Reskin guns in the game!
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
// @downloadURL https://update.greasyfork.org/scripts/435245/Survivio%20Guns%20Reskin.user.js
// @updateURL https://update.greasyfork.org/scripts/435245/Survivio%20Guns%20Reskin.meta.js
// ==/UserScript==
(function() {
    'use strict';

var tracerColors = ""
var func = {
    webpack_inject3: (w, e, get) => {
        tracerColors = get("ad1c4e70")
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
Object.keys(tracerColors).forEach(function(key52) {
    if(key52.match(/mac10/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/Skins/mac10.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/glock|glock_dual/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/glock.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/mp5/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/mp5.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/ak/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/ak.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/scar/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/scar.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/sv98/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/sv98.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/bar/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/bar.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/m39/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/m39.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/spas12/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/spas12.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/m1014/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/m1014.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/l86/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/L86.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/scout_elite/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/scout.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/mk12/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/mk12.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/hk416/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/hk416.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    } else if(key52.match(/flare_gun/g)) {
        tracerColors[key52].worldImg.sprite = "https://raw.githubusercontent.com/iBLiSSIN/Surviv.io-Gun-Reskin/main/guns-skin/flare.png";
        tracerColors[key52].worldImg.tint = 0xFFFFFF
    }
})
})();