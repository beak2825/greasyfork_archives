// ==UserScript==
// @name         Agar.io Split Macro
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Lemons
// @match        *://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383255/Agario%20Split%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/383255/Agario%20Split%20Macro.meta.js
// ==/UserScript==

window.addEventListener('keydown', event => {
    var split = window.core.split;
    switch (event.keyCode) {
        case 84:
            for (var i = 0; i < 4; i++) split();
            break;

        case 89:
            for (var f = 0; f < 2; f++) split();
            break;
    }
});