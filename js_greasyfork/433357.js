// ==UserScript==
// @name         Surviv.io trees
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
// @downloadURL https://update.greasyfork.org/scripts/433357/Survivio%20trees.user.js
// @updateURL https://update.greasyfork.org/scripts/433357/Survivio%20trees.meta.js
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
shits.tree_01.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_01cb.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/tree-cobalt.png"
shits.tree_01sv.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_06.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_07.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_07s.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_07sr.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_15.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_08sb.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_08sc.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_08sr.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img/tree.png"
shits.tree_08.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08b.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08c.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08f.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08b.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08s.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08sb.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08sc.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08sr.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_08su.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/big-tree.png"
shits.tree_10.img.sprite = "hhttps://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/tree-savan.png"
shits.tree_12.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/tree-savan.png"
shits.tree_13.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/tree-savan.png"
shits.tree_05.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/tree-desert-05.png"
shits.tree_05c.img.sprite = "https://raw.githubusercontent.com/iBLiSSIN/SurvivMods/main/img%20for%20change/tree-desert-05c.png"
    }
})
})();