// ==UserScript==
// @name         DeathFadeout Slayer
// @version      69
// @author       [GG]GAMER
// @description  Remove DeathFadeout from cowgaem (no intervals :>)
// @match        *://*.moomoo.io/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/693079
// @downloadURL https://update.greasyfork.org/scripts/451384/DeathFadeout%20Slayer.user.js
// @updateURL https://update.greasyfork.org/scripts/451384/DeathFadeout%20Slayer.meta.js
// ==/UserScript==

Object.defineProperty(window.config, 'deathFadeout', {
    get() {
        return 0;
    }
});