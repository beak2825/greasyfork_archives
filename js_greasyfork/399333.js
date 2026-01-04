// ==UserScript==
// @name         Space AutoFire
// @namespace    https://greasyfork.org/en/users/467236-diepiodiscord
// @version      1
// @description  Turn spacebar into AutoFire toggle (E)
// @author       diep.io#7444
// @match        https://diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399333/Space%20AutoFire.user.js
// @updateURL https://update.greasyfork.org/scripts/399333/Space%20AutoFire.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var keyDown = document.createEvent("Events"); keyDown.initEvent("keydown", true, true); keyDown.keyCode = 69; // 69 is the keyCode for E
    var keyUp = document.createEvent("Events"); keyUp.initEvent("keyup", true, true); keyUp.keyCode = 69;

    document.addEventListener('keydown', function(event)
    {
        if (event.keyCode === 32) // spacebar
        {
            event.cancelBubble = true; // Prevent spacebar from firing when held down, we are changing it to a toggle
            if (event.repeat) return; // Disable holding down key to spam
            window.dispatchEvent(keyDown);
            window.dispatchEvent(keyUp);
        }
    });
})();