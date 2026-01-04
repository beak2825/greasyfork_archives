// ==UserScript==
// @name         Crossword Sound Mod
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace the crummy new nound with a more triumphant one
// @author       Alex Potts
// @match        *://embed.universaluclick.com/c/usat/l/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/36039/Crossword%20Sound%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/36039/Crossword%20Sound%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        window.puzzle_solve.setAttribute('src', 'http://apotts.me/mp3/tada.mp3');
    }, 5000);

})();