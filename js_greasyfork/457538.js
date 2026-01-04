// ==UserScript==
// @name         MPP Audio Killer
// @namespace    http://mppclone.com/
// @version      Release v1.2 MPPnet
// @description  mppak
// @author       Daniel9046, Nitsua
// @license      MPPC
// @match        *://mpp.hri7566.info/*
// @match        *://mpp.autoplayer.xyz/*
// @match        *://mppclone.com/*
// @match        *://multiplayerpiano.dev/*
// @match        *://multiplayerpiano.net/*
// @match        *://multiplayerpiano.org/*
// @match        *://multiplayerpiano.com/*
// @match        *://ompp.daniel9046.tk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mppclone.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457538/MPP%20Audio%20Killer.user.js
// @updateURL https://update.greasyfork.org/scripts/457538/MPP%20Audio%20Killer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.MPP.piano.audio.play = () => {};
    window.MPP.piano.audio.stop = () => {};
    document.getElementById("volume").innerHTML = "MPPAK"
    document.getElementById("volume-label").innerHTML = "disabled, use OMNIMIDI instead."
    console.log("MPP AUDIO KILLER ENABLED, NOW YOU MUST USE OMNIMIDI TO PLAY AUDIO")
})();