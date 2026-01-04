// ==UserScript==
// @name         useful hats
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  flipper hat, spike gear, samurai armour
// @author       alcachoo
// @match        http://moomoo.io/*
// @match        http://sandbox.moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397452/useful%20hats.user.js
// @updateURL https://update.greasyfork.org/scripts/397452/useful%20hats.meta.js
// ==/UserScript==

(function() {
    'use strict';

       var ID_FlipperHat = 31; // (f) to use
    var ID_SpikeGear = 11; // (caps lock) to use, i don't know if the 2 key works for it aswell.
    var ID_SamuraiArmour = 20; // (\) to use
    var ID_WinterHat = 15; // (v) to use

    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(0);
        }
        else if (e.keyCode === 70 && document.activeElement.id.toLowerCase() !== 'chatbox') // 70 is the keycode for (f)
        {
        storeEquip(ID_FlipperHat); // the hat in the game is named 31 in the storeEquip also called the hat shop. i made it so that ID_FlipperHat and 31 can be used though writing var ID_FlipperHat == 31. var just stands for Variable
        }
        else if (e.keyCode === 20 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_SpikeGear);
        }
        else if (e.keyCode === 220 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_SamuraiArmour);
        }
        else if (e.keycode === 86 && document.activeElement.id.toLowerCase() !== "chatbox")
        {
        storeEquip(ID_WinterHat);
        }
    });

})();