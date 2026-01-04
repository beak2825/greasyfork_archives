// ==UserScript==
// @name         Macros :V
// @namespace    Double Split, Triple Split, 16 Split,Feed
// @version      0.1
// @description  Double Split (S) Triple Split (F) 16 Split (D) Feed (W) 
// @author       Alx
// @match        http://www.pentagario.tk/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/377668/Macros%20%3AV.user.js
// @updateURL https://update.greasyfork.org/scripts/377668/Macros%20%3AV.meta.js
// ==/UserScript==

document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_z'> Press <b>Q</b> for Macro Feed</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_u'> Press <b>D</b> to Double Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_3'> Press <b>S</b> to Triple Split</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_h'> Press <b>A</b> to Tricksplit</span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_C'> Creator: <b>Dabbles - Agario</b></span></span></center>";
document.getElementById("instructions").innerHTML += "<center><span class='text-muted'><span data-itr='instructions_UPDT'> <b>UPDATE</b> soon !</span></span></center>";
load();
function load() {
}
(function() {
    var amount = 4;
    var duration = 50;

    var overwriting = function(evt) {
        if (evt.keyCode === 83) { // [S] Double Split 
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
        if (evt.keyCode === 70) { // [F] Triple Split 
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
        if (evt.keyCode === 68) {  // [D] 16 Split
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

if (event.keyCode == 87 ) // [W] Feed
{
Feed = true;
setTimeout(mass, Speed);
}
