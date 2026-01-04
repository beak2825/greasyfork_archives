// ==UserScript==
// @name         MOOMOO.IO rainbowhat!!!
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  ------------------Looks SUPER COOL!!!!!--------------------
// @author       Cody Webb
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io/*
// @match                 *://dev.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404886/MOOMOOIO%20rainbowhat%21%21%21.user.js
// @updateURL https://update.greasyfork.org/scripts/404886/MOOMOOIO%20rainbowhat%21%21%21.meta.js
// ==/UserScript==

(function(){
    document.title = "Rainbow MooMod";
    document.getElementById("gameName").innerHTML = "Rainbow </br> MooMod";
    var hatList = {
        'Unequip': 0,
        'Moo Cap': 51,
        'Apple Cap': 50,
        'Moo Head': 28,
        'Pig Head': 29,
        'Fluff Head': 30,
        'Pandou Head': 36,
        'Bear Head': 37,
        'Monkey Head': 38,
        'Polar Head': 44,
        'Fez Hat': 35,
        'Enigma Hat': 42,
        'Blitz Hat': 43,
        'Bob XIII Hat': 49 //14 total
    };

    document.addEventListener('keydown', function(e) {
        if (document.activeElement.id.toLowerCase() !== 'chatbox') {
                if (e.keycode === 220) {randomHat()}
    }});

    function randomHat() {
        var randomNum = Math.floor(Math.random() * 14);
        var keys = Object.keys(hatList);
        storeEquip(hatList[keys[randomNum]]);
    }

})();