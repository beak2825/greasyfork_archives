// ==UserScript==
// @name         REKT MAACRO FEED & SPLIT
// @namespace    Double Split, Triple Split, 16 Split Hotkeys And Macro feed
// @version      1.1
// @description  Q - Double Split -|- S - Triple Split -|- T - 16 Split -|- E - Feed
// @author       Dabbles - Agario
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25234/REKT%20MAACRO%20FEED%20%20SPLIT.user.js
// @updateURL https://update.greasyfork.org/scripts/25234/REKT%20MAACRO%20FEED%20%20SPLIT.meta.js
// ==/UserScript==

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'> Press <b>E</b> for Macro Feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> Press <b>Q</b> to Double Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>S</b> to Triple Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_h'> Press <b>T</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_C'> EXTENSION BY : <b>REKT</b></span></span></center>";
load();
function load() {
}
(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 81) { // Change 81[Q] To Whichever Keycode You Want To Change The Double Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 6;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 83) { // Change 83[S] To Whichever Keycode You Want To Change The Triple Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

(function() {
    var amount = 25;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 69) { // Change 69[E] To Whichever Keycode You Want To Change The MACRO FEED
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 87}); // 87 - W
                    window.onkeyup({keyCode: 87});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();
    
(function() {
    var amount = 8;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 84) {  // Change 84[T] To Whichever Keycode You Want To Change The 16 Split HotKey
            for (var i = 0; i < amount; ++i) {
                setTimeout(function() {
                    window.onkeydown({keyCode: 32}); // 32 - Space Bar
                    window.onkeyup({keyCode: 32});
                }, i * duration);
            }
        }
    };

    window.addEventListener('keydown', overwriting);
})();

if (event.keyCode == 69 ) // e
{
Feed = true;
setTimeout(mass, Speed);
}