// ==UserScript==
// @name         Deeeep.io Immortality Script
// @version      1.0
// @description  Makes you immortal in Deeeep.io
// @match        https://deeeep.io/*
// @run-at       document-start
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/1058472
// @downloadURL https://update.greasyfork.org/scripts/506784/Deeeepio%20Immortality%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/506784/Deeeepio%20Immortality%20Script.meta.js
// ==/UserScript==

// Disable damage and death
window.setInterval(function(){
    window.death = false;
    window.inkTime = 0;
    window.swimVelocity = 4.4;
    window.hurt = function(){};
}, 100);