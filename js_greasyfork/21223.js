// ==UserScript==
// @name         Freeze HS Particles
// @namespace    rio
// @version      1.0
// @description  Disable background particle animation on the Horizon Servers website to save CPU
// @author       rio
// @match        https://*.horizonservers.net/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21223/Freeze%20HS%20Particles.user.js
// @updateURL https://update.greasyfork.org/scripts/21223/Freeze%20HS%20Particles.meta.js
// ==/UserScript==

(function() {
    'use strict';
    pJSDom[0].pJS.particles.move.enable = false;   
})();