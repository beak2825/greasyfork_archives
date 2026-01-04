// ==UserScript==
// @name         MooMoo.io Chromebook HatScript, working after update v0.897
// @version      0.1
// @description  Working after patch, use "9,0 and -" to switch hats, for all you Chromebook users out there who don't have a numeric keypad here you go use this as a hat-script
// @author       TheOneTrueHero
// @match        http://moomoo.io/*
// @match        http://dev.moomoo.io/*
// @grant        none
// @namespace    -
// @downloadURL https://update.greasyfork.org/scripts/38819/MooMooio%20Chromebook%20HatScript%2C%20working%20after%20update%20v0897.user.js
// @updateURL https://update.greasyfork.org/scripts/38819/MooMooio%20Chromebook%20HatScript%2C%20working%20after%20update%20v0897.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ID_WinterCap = 15;
    var ID_FlipperHat = 31;
    var ID_MarksmanCap = 1;
    var ID_BushGear = 10;
    var ID_SoldierHelmet = 6;
    var ID_AntiVenomGear = 23;
    var ID_MusketeerHat = 32;
    var ID_MedicGear = 13;
    var ID_BullHelmet = 7;
    var ID_EmpHelmet = 22;
    var ID_BoosterHat = 12;
    var ID_BarbarianArmor = 26;
    var ID_BullMask = 46;
    var ID_WindmillHat = 14;
    var ID_SpikeGear = 11;
    var ID_BushidoArmor = 16;
    var ID_SamuraiArmor = 20;
    var ID_ScavengerGear = 27;
    var ID_TankGear = 40;


    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 90 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(0);
        }
        else if (e.keyCode === 48 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TankGear);
        }
        else if (e.keyCode === 57 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_SoldierHelmet);
        }
        else if (e.keyCode === 189 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_BullHelmet);
        }

    });

})();