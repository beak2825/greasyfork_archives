// ==UserScript==
// @name         AH Clan Extension test #1
// @namespace    Double Split, Triple Split, 16 Split Hotkeys, Quicker Feeding and musch more !
// @version      1.1
// @description  D - Double Split -|- S - Triple Split -|- A - 16 Split -|- Q - Feed
// @author       Virgo Gaming YT
// @match        http://agar.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25454/AH%20Clan%20Extension%20test%201.user.js
// @updateURL https://update.greasyfork.org/scripts/25454/AH%20Clan%20Extension%20test%201.meta.js
// ==/UserScript==

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'> Press <b>Q</b> for Macro Feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> Press <b>D</b> to Double Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>S</b> to Triple Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_h'> Press <b>A</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_C'> Creator: <b>Dabbles - Agario</b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_UPDT'> <b>UPDATE</b> soon !</span></span></center>";
load();
function load() {
    $("h2").replaceWith('<h2>AH Extension</h2>');//replace all h2 elements with AH Extension
    $("b").replaceWith('<b>Virgo Gaming YT</b>');//replace all b elements with AH Extension   
    $("spam").replaceWith('<spam>Virgo Gaming YT</spam>');//replace all spam elements with AH Extension
}
(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 68) { // Change 68[D] To Whichever Keycode You Want To Change The Double Split HotKey
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
    var amount = 8;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 65) {  // Change 65[A] To Whichever Keycode You Want To Change The 16 Split HotKey
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

if (event.keyCode == 81 ) // Q
{
    Feed = true;
    setTimeout(mass, Speed);
}
