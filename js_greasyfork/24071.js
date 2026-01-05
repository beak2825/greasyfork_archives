// ==UserScript==
// @name         Macro By SinisterYT // R=Tricksplit // 1=Doublesplit // 2=Triplesplit // Thanks For installing <3 
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  // R=Tricksplit // 1=Doublesplit // 2=Triplesplit // Thanks For installing <3
// @author       SinisterYT
// @match        http://gota.io/*
// @match        https://gota.io/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/24071/Macro%20By%20SinisterYT%20%20R%3DTricksplit%20%201%3DDoublesplit%20%202%3DTriplesplit%20%20Thanks%20For%20installing%20%3C3.user.js
// @updateURL https://update.greasyfork.org/scripts/24071/Macro%20By%20SinisterYT%20%20R%3DTricksplit%20%201%3DDoublesplit%20%202%3DTriplesplit%20%20Thanks%20For%20installing%20%3C3.meta.js
// ==/UserScript==
window.addEventListener('keydown', keydown);
window.addEventListener('keyup', keyup);
var Feed = false;
var Speed = 25;

//Funtions
function split() {
    $("body").trigger($.Event("keydown", { keyCode: 32}));
    $("body").trigger($.Event("keyup", { keyCode: 32}));
}
function mass() {
    if (Feed) {
        window.onkeydown({keyCode: 87});
        window.onkeyup({keyCode: 87});
        setTimeout(mass, Speed);
    }
}

function keydown(event) {
    // Feed Macro
    if (event.keyCode == 69 )                                        // E
    {
        Feed = true;
        setTimeout(mass, Speed);
    }
    // Tricksplit
    if (event.keyCode == 82 || event.keyCode == 82) {                // R=Tricksplit 
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
    } // Triplesplit
    if (event.keyCode == 50 || event.keyCode == 50) {         // 2=TripleSplit
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    } // Doublesplit
    if (event.keyCode == 49 || event.keyCode == 49) {         // 1=DoubleSplit
        split();
        setTimeout(split, Speed);
    }

} // When Player Lets Go Of E, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 69) {
        Feed = false;
    }
}
