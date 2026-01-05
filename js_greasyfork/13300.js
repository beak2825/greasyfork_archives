// ==UserScript==
// @name         Agari.us Mod
// @namespace    http://www.abex.cf/dev
// @version      0.1
// @description  Primeiro mod para agari.us
// @author       João Paulo Santos
// @match        http://agari.us/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13300/Agarius%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/13300/Agarius%20Mod.meta.js
// ==/UserScript==

// Padrão
setDarkTheme(true);
setShowMass(true);

// Ejetor de massa rápido com a tecla E
(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // KEY_E
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