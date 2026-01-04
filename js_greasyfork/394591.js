// ==UserScript==
// @name         MooMoo.io Hat Hack Hotkey Special Instakill By LuminexT
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Try to be the God or Goddess in MooMoo.io!
// @author       LuminexT
// @match        http://moomoo.io/*
// @match        http://sandbox.moomoo.io*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394591/MooMooio%20Hat%20Hack%20Hotkey%20Special%20Instakill%20By%20LuminexT.user.js
// @updateURL https://update.greasyfork.org/scripts/394591/MooMooio%20Hat%20Hack%20Hotkey%20Special%20Instakill%20By%20LuminexT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ID_BullHelmet = 7;
    var ID_TurretGear = 53;
    var ID_FlipperHat = 31;
    var ID_SoldierHelmet = 6;
    var ID_TankGear = 40;
    var ID_EmpHelmet = 22;


    document.addEventListener('keydown', function(e) {
        if(e.keyCode === 16 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(0);
        }
        else if (e.keyCode === 84 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TankGear);
        }
        else if (e.keyCode === 71 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_SoldierHelmet);
        }
        else if (e.keyCode === 32 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_BullHelmet);
        }
        else if (e.keyCode === 89 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_BoosterHat);
        }
        else if (e.keyCode === 72 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_EmpHelmet);
        }
        else if (e.keyCode === 50 && document.activeElement.id.toLowerCase() !== 'chatbox')
        {
        storeEquip(ID_TurretGear);
        }

    });

})();

