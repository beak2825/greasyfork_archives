// ==UserScript==
// @name         FPS Increaser
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  fps booster fix
// @author       HarryplaysOMG4
// @match        *://florr.io/*
// @match        *://arras.io/*
// @match        *://diep.io/*
// @match        *://woomy.arras.cx/*
// @match        *://voxiom.io/*
// @match        *://scenexe.io/*
// @match        *://scenexe2.io/*
// @match        *://https://rescnx.xyz/*
// @match        *://dakarr.cc/*
// @match        *://skribbl.io/*
// @match        *://youtube.com/*
// @match        *://scratch.mit.edu/*
// @match        *://glitchyfishys.github.io/*
// @match        *://mrredshark77.github.io/*
// @match        *://galaxy.click/*
// @match        *://youtube.com/*
// @match        *://rescnx.xyz/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469013/FPS%20Increaser.user.js
// @updateURL https://update.greasyfork.org/scripts/469013/FPS%20Increaser.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var crntWeb = window.location.href;

    requestAnimationFrame => setTimeout(1/256);
    if(crntWeb == "*://voxiom.io/*"){
        delete window.THREE;
    }
})();