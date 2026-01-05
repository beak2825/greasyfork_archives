// ==UserScript==
// @name         Globy.tk-Mass-Ejector
// @namespace    Unknown
// @version      0.02
// @description  A Simple, Better way to eject mass in Globy.tk
// @author       Copyright
// @match        http://globy.tk/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25705/Globytk-Mass-Ejector.user.js
// @updateURL https://update.greasyfork.org/scripts/25705/Globytk-Mass-Ejector.meta.js
// ==/UserScript==

(function() {
    var amount = 1; // Change the number (1) to hoever much mass you want to be ejected on 1 press, For example "var amount = 1;" will let out 1 mass if you press the key "e" once
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_E (This could be changed at anytime, Just use a "Javascript Event Keycode" and replace the "69" with whatever Keycode you want)
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // KEY_W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
