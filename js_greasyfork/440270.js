// ==UserScript==
// @name         fixvalveshit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  I want to feed someone to a xenomorph
// @author       MrKleiner
// @match        https://developer.valvesoftware.com/wiki/*
// @icon         https://www.google.com/s2/favicons?domain=valvesoftware.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440270/fixvalveshit.user.js
// @updateURL https://update.greasyfork.org/scripts/440270/fixvalveshit.meta.js
// ==/UserScript==


document.querySelectorAll('#mw-content-text div[style]').forEach(function(userItem) {
    // if(userItem.style.overflow == 'auto')
    // {
        userItem.style.overflow = null;
    // }
    userItem.style.maxHeight = null;
});