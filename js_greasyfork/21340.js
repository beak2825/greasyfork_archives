// ==UserScript==
// @name         Agar Tricksplit with D
// @namespace    http://vbprogramer88.esy.es/
// @version      1.1.3
// @description  Press D to split in 16 ! It's perfect for tricksplit !
// @author       Anthony Brunet-Bessette & Agar File YT
// @match        http://agar.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21340/Agar%20Tricksplit%20with%20D.user.js
// @updateURL https://update.greasyfork.org/scripts/21340/Agar%20Tricksplit%20with%20D.meta.js
// ==/UserScript==
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_e'> Press <b>D</b> to split in 16x !</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_q'> Created by<b> <strong>Anthony Brunet-Bessette</strong> and <strong>Agar File</strong></b>!</span></span></center>";
(function() {
    var amount = 6;
    var duration = 50; //ms

    var overwriting = function(evt) {
        if (evt.keyCode === 68) { // KEY_D
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // KEY_SPACE
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();