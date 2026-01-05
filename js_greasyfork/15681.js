// ==UserScript==
// @name         Macro for Agarios
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       ♥◠‿◠ Cäsual
// @match        http://www.epeffects.de/
// @match        http://agario.mobi/
// @match        http://agar.io/*
// @grant        none
// @description Agario mods
// @downloadURL https://update.greasyfork.org/scripts/15681/Macro%20for%20Agarios.user.js
// @updateURL https://update.greasyfork.org/scripts/15681/Macro%20for%20Agarios.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//define variables for future use
var intr;
var bool = [false,false];
//when a key is pressed down this function is called
$(document).on('keydown',function(key) {
    //this narrows a key pushed down t the Q key with key-code 81
    if(key.keyCode == 81) {
        //bool[0] is the operator that turns on and off the macro
        bool[0] = true;
        if(bool[1]) {
            return;
        }
        //bool[1] is the operator that puts the macro in effect
        bool[1] = true;
        //if bool[0] is true, start the macro, else skip it
        if(bool[0]) {
            //the interval is basically repeating the code inside...
            intr = setInterval(function() {
                //fakes pushing down and up on W with key-code 87
                $("body").trigger($.Event("keydown", {keyCode: 87}));
                $("body").trigger($.Event("keyup", {keyCode: 87}));
            }, 0.5/*...at a rate of 0.5 ticks*/);
        }
    }
})
//when a key is released (Q), turnoff the macro and stop returning the result
$(document).on('keyup',function(key) {
    if(key.keyCode == 81) {
        bool[0] = false;
        bool[1] = false;
        //learing the interval stops the cycle
        clearInterval(intr);
        //the return just makes it actuall do what is said above
        return;
    }
})