// ==UserScript==
// @name         Hotkeys on teoria.pl
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds keyboard navigation on teoria.pl
// @author       Radost Waszkiewicz
// @match        http*://*.teoria.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387836/Hotkeys%20on%20teoriapl.user.js
// @updateURL https://update.greasyfork.org/scripts/387836/Hotkeys%20on%20teoriapl.meta.js
// ==/UserScript==

// N or S for 'NIE'
// T or A for 'TAK'
// W for 'Sprawdz'
// Q for 'Nastepne'

(function(){
    document.addEventListener('keydown', function(e) {
        // pressed alt+g
        if (e.keyCode == 78 || e.keyCode == 83) {
            // N key was pressed
            // or S key was pressed
            // send 'NIE' answer
            document.querySelector('span[id="no-button"]').click();
        }
        if (e.keyCode == 84 || e.keyCode == 65) {
            // T key was pressed
            // or A key was pressed
            // send 'TAK' answer
            document.querySelector('span[id="yes-button"]').click();
        }
        if (e.keyCode == 87) {
            // W key was pressed
            // send 'sprawdzam' klick
            document.querySelector('button[id="check-question-button-xs"]').click();
        }
        if (e.keyCode == 81) {
            // Q key was pressed
            // send 'sprawdzam' klick
            document.querySelector('div[id="learning-next-question"]').click();
        }

        if (e.keyCode == 90) {
            // Z key was pressed
            // send 'A' klick
            document.querySelector('span[id="a-button"]').click();
        }
        if (e.keyCode == 88) {
            // X key was pressed
            // send 'B' klick
            document.querySelector('span[id="b-button"]').click();
        }
        if (e.keyCode == 67) {
            // C key was pressed
            // send 'C' klick
            document.querySelector('span[id="c-button"]').click();
        }

    }, false);
})();