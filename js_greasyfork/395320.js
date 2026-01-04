// ==UserScript==
// @name         Roogar.de Macros + Mouse feed,Mouse split, Mouse split 16
// @namespace    http://tampermonkey.net/
// @version      1.13
// @description s to pause, q to split 16, left mouse click is to feed. 
// @author       All credits belong to Ali Ahfad Mehdi, I only edited a few lines and modified it to pause whenever a user is typing in chat.- GoogleFutanari.
// @match        http://roogar.de/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/395320/Roogarde%20Macros%20%2B%20Mouse%20feed%2CMouse%20split%2C%20Mouse%20split%2016.user.js
// @updateURL https://update.greasyfork.org/scripts/395320/Roogarde%20Macros%20%2B%20Mouse%20feed%2CMouse%20split%2C%20Mouse%20split%2016.meta.js
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
    var dummyEl = document.getElementById('chat_textbox');
    //only execute the following code if the chatbox is not active.
    console.log(dummyEl == document.activeElement);
    if(!(dummyEl == document.activeElement)){
    if (event.keyCode == 69 )                                        // E
    {
        Feed = true;
        setTimeout(mass, Speed);
    }// Center(this pauses your blob)
    if (event.keyCode == 83) {                                       // S
       var  X = window.innerWidth/2;
       var  Y = window.innerHeight/2;
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));

    }
    // Tricksplit
    if (event.keyCode == 81) {                // q
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
        setTimeout(split, Speed*3);
        setTimeout(split, Speed*4);

    } // Triplesplit
    if (event.keyCode == 82) {         // R
        split();
        setTimeout(split, Speed);
        setTimeout(split, Speed*2);
    } // Doublesplit
    if (event.keyCode == 68) {         // d for double split
        split();
        setTimeout(split, Speed);
    }// Split
    if (event.keyCode == 'yourkey' || event.keyCode == 'yourkey2') { // Put in Your Key
        split();
    }
    }

} // When Player Lets Go Of E, It Stops Feeding
function keyup(event) {
    if (event.keyCode == 69 || event.keyCode == 83) {
        Feed = false;
    }
}

//Mouse Clicks
(function() {
    document.getElementById("canvas").addEventListener("mousedown", function(event) {
        if (event.which == 1) {
            split();
          
        }
        else if (event.which == 2) {
            split();
            setTimeout(split, Speed);
            setTimeout(split, Speed*2);
            setTimeout(split, Speed*3);
        }
        else if(event.which == 3){
            Feed = true;
            setTimeout(mass, Speed);
        }
   
    });

    document.getElementById("canvas").addEventListener("mouseup", function(event) {
        if (event.which == 3) {
            Feed = false;
        }
    });
    $('#canvas').bind('contextmenu', function(e) {
        e.preventDefault();
    });
}());
//Go Ahead, Mess Around. ( ͡ᵔ ͜ʖ ͡ᵔ )
//CREDITS TO: JACK BURCH AND TOM BURRIS
//Thanks Guys You Inspired Me.