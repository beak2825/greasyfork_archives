// ==UserScript==
// @name         NoteQuota infinite script
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Inf NQ
// @author       CTR
// @match        *://*.multiplayerpiano.net/*
// @match        *://*.multiplayerpiano.org/*
// @match        *://*.multiplayerpiano.dev/*
// @match        *://*.singleplayerpiano.com/*
// @match        *://mpp.hri7566.info/*
// @match        *://mppclone.hri7566.info/*
// @match        *://mpp.autoplayer.xyz/*
// @match        *://mpp.lapishusky.dev/*
// @match        *://mpp.yourfriend.lv/*
// @match        *://mpp.l3m0ncao.wtf/*
// @match        *://mpp.terrium.net/*
// @match        *://mpp.hyye.tk/*
// @match        *://mpp.totalh.net/*
// @match        *://mpp.meowbin.com/*
// @match        *://mppfork.netlify.app/*
// @match        *://better.mppclone.me/*
// @match        *://*.openmpp.tk/*
// @match        *://*.mppkinda.com/*
// @match        *://*.augustberchelmann.com/piano/*
// @match        *://piano.ourworldofpixels.com/*
// @match        *://beta-mpp.csys64.com/*
// @match        *://fleetway-mpp.glitch.me/*
// @match        *://*.multiplayerpiano.com/*
// @match        *://*.mppclone.com/*
// @match        ://mpp.8448.space/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=multiplayerpiano.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522080/NoteQuota%20infinite%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/522080/NoteQuota%20infinite%20script.meta.js
// ==/UserScript==

setInterval(() => {
    MPP.noteQuota.points = 9e69;
    MPP.noteQuota.max = 9e69;
    MPP.noteQuota.allowance = 9e69;
}, 1000);
