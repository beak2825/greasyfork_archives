// ==UserScript==
// @name         Spells of Genesis window maximizer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Re-enables the game window maximization for v1.2.8
// @author       ptaczek
// @match        https://play.spellsofgenesis.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35663/Spells%20of%20Genesis%20window%20maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/35663/Spells%20of%20Genesis%20window%20maximizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // replace the original global resizeChild with this new one
    resizeChild = function()
    {
        var ratio = 488 / 704;
        var width = window.innerHeight * ratio;

        // resize also the gameContainer, not only the canvas
        // set also the height, not only the width
        document.querySelectorAll("#canvas, #gameContainer")
        .forEach(function(el) {
            el.style.width = width+'px';
            el.style.height = window.innerHeight+'px';
        });
    };

    // rename the buggy canvas id
    var c = document.querySelector('canvas#\\#canvas');
    if (c) {
        c.setAttribute('id', 'canvas');
    }

    // and resize the game to fit the display height
    resizeChild();
})();
