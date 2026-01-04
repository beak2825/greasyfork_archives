// ==UserScript==
// @name         Quick Split
// @version      5
// @description  Press 2, 3, 4 key to split twice, thrice and quad times respectively all really fast
// @namespace    http://tampermonkey.net/
// @author       P_M_9_8_6
// @match       *http://paper-io.com/agar/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @compatible   chrome
// @compatible   firefox
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432793/Quick%20Split.user.js
// @updateURL https://update.greasyfork.org/scripts/432793/Quick%20Split.meta.js
// ==/UserScript==


$("document").ready(console.log("Script is ready"));

/* Key : Codes 
    1  :  50
    2  :  51
    3  :  52
*/
$("body").keydown(function(key){
    if(key.keyCode == 50){ // Double Split 
        doubleSplit();
    }
    if(key.keyCode == 51){ // Triple Split
        tripleSplit();
    }
    if(key.keyCode == 52){ // Quad Split
        quadSplit();
    }
            return;
        });
var global_i = 0;
function doubleSplit() {
        if (global_i < 2) {
                global_i++;
                sp(17);
                console.log("Double Split");
                setTimeout(doubleSplit, 170); // Increase this number to make its double split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}

function tripleSplit() {
        if (global_i < 3) {
                global_i++;
                sp(17);
                console.log("Triple Split");
                setTimeout(tripleSplit, 170);// Increase this number to make its triple split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}
function quadSplit() {
        if (global_i < 4) {
                global_i++;
                sp(17);
                console.log("Quad Split");
                setTimeout(quadSplit, 170);// Increase this number to make its quad split slower dont decrease it the server might not accept the split below this number
        }
        else
            global_i = 0;
}