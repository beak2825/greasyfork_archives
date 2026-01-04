// ==UserScript==
// @name         ahk.Royal
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        ://moomoo.io/*
// @match        ://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397865/ahkRoyal.user.js
// @updateURL https://update.greasyfork.org/scripts/397865/ahkRoyal.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var SoreHolder = document.getElementById('storeHolder');
        SoreHolder.scrollTop = 0;
document.addEventListener('keydown', function(e) {
    if( e.keyCode === 90 ){ // r
        SoreHolder.scrollTop = 1200;
        console.log("r is pressed and solieder is on");
    };
    if( e.keyCode === 67){// y
        SoreHolder.scrollTop = 2100;
        console.log("y is pressed and tank is on");
    };
    if( e.keyCode === 85){// 2
        SoreHolder.scrollTop = 1900;
        console.log("2 is pressed and samurai is on");
    };
    if( e.keyCode === 78){// v
        SoreHolder.scrollTop = 1850;
        console.log("v is pressed and turret is on");
    };
    if( e.keyCode === 66){// space
        SoreHolder.scrollTop = 1450;
        console.log("space is pressed and bull is on");
    };
        if( e.keyCode === 75){// space
        SoreHolder.scrollTop = 1000;
        console.log("r is pressed and flipper is on");
    };
        if( e.keyCode === 74){// space
        SoreHolder.scrollTop = 800;
        console.log("r is pressed and winter cap is on");
    };
            if( e.keyCode === 77){// space
        SoreHolder.scrollTop = 1650;
        console.log("m is pressed and plague is on");
    };
        if(e.keyCode === 76){ // L
        SoreHolder.scrollTop = 650;
        console.log("L is pressed and Pumpkin is on");
    };
        if(e.keyCode === 73){ // i
        SoreHolder.scrollTop = 0;
        console.log("i is pressed and Moo Cap is on");
    };
})
})();