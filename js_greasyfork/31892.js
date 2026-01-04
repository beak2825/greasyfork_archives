// ==UserScript==
// @name         Agario Macros + Trick's
// @version      0.5
// @description  Thx For Using
// @author       EarthAgar
// @match        *.alis.io/*
// @namespace https://greasyfork.org/users/109283
// @downloadURL https://update.greasyfork.org/scripts/31892/Agario%20Macros%20%2B%20Trick%27s.user.js
// @updateURL https://update.greasyfork.org/scripts/31892/Agario%20Macros%20%2B%20Trick%27s.meta.js
// ==/UserScript==

window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
document.getElementById("nick").maxLength = "9e9";

// List instructions
var i = document.getElementById("instructions");
i.innerHTML += "<center class='text-muted'>Hold <b>W</b> for macro feed</center>";
i.innerHTML += "<center class='text-muted'>Press <b>E</b> or <b>2</b> to split 2x</center>";
i.innerHTML += "<center class='text-muted'>Press <b>R</b> for solo-tricksplit</center>";
i.innerHTML += "<center class='text-muted'>Press <b>D</b> or <b>4</b> to Tricksplit</center>";

// Load macros
var canFeed = false;
function keydown(event) {
    if (event.keyCode == 87) {
        // Feeding Macro (w)
        canFeed = true;
        feed();
    }
    if (event.keyCode == 82) {
        // Solo-tricksplit (r)
        for (var a = 0; a < 4; a++) {
            setTimeout(function() {
                split();
                $("body").trigger($.Event("keydown", { keyCode: 87}));
                $("body").trigger($.Event("keyup", { keyCode: 87}));
            }, a * 50);
        }
    }
    if (event.keyCode == 68 || event.keyCode == 52) {
        // Tricksplit Macro (d or 4)
        for (var b = 0; b < 4; b++) setTimeout(split, b * 50);
    }
    if (event.keyCode == 69 || event.keyCode == 50) {
        // Doublesplit Macro (e or 2)
        split();
        setTimeout(split, 50);
    }
}

// When a player lets go of W stop feeding
function keyup(event) {
    if (event.keyCode == 87) canFeed = false;
}

// Alias for W key
function feed() {
    if (!canFeed) return;
    window.onkeydown({keyCode: 87});
    window.onkeyup({keyCode: 87});
    setTimeout(feed, 0);
}

// Alias for space
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
