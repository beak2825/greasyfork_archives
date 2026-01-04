// ==UserScript==
// @name         autoscroll
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  take over world with auto scroll
// @author
// @match        *://dev.moomoo.io/*
// @match        *://moomoo.io/*
// @match        *://sandbox.moomoo.io/*
// @downloadURL https://update.greasyfork.org/scripts/431141/autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/431141/autoscroll.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var SoreHolder = document.getElementById('storeHolder');
        SoreHolder.scrollTop = 0;
document.addEventListener('keydown', function(e) {
    if( e.keyCode === 67 ){// j = winter
        SoreHolder.scrollTop = 800;
    };
    if( e.keyCode === 82 ){
        SoreHolder.scrollTop = 1000;// r = fish
    };
    if( e.keyCode === 70 ){
        SoreHolder.scrollTop = 1050;// g = soldier
    };
    if( e.keyCode === 90){// z = tank
        SoreHolder.scrollTop = 2100;
    };
    if( e.keyCode === 71){
        SoreHolder.scrollTop = 1900;// y = samurai
    };
    if( e.keyCode === 86){
        SoreHolder.scrollTop = 1850;// n = turret
    };
    if( e.keyCode === 67){
        SoreHolder.scrollTop = 1450;// b = bull
    };
    if( e.keyCode === 72){// h = boost
        SoreHolder.scrollTop = 1560;
    };
})
})();// autoscroll