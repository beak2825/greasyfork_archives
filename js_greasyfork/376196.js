// ==UserScript==
// @name                  Moomoo.io ★ Hat-Hotkeys
// @version               3.2
// @description           Hat Macros! (Keys in desc)
// @author                ~Kismet ([LX] blue moon~#1292)
// @match                 *://moomoo.io/*
// @match                 *://sandbox.moomoo.io*
// @grant                 none
// @namespace             https://greasyfork.org/en/users/179542-kismet
// @icon                  https://proxy.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.gala-global.org%2Fsites%2Fdefault%2Ffiles%2Fcompany_logo%2FTilde_DirectoryLogo.gif&f=1
// @downloadURL https://update.greasyfork.org/scripts/376196/Moomooio%20%E2%98%85%20Hat-Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/376196/Moomooio%20%E2%98%85%20Hat-Hotkeys.meta.js
// ==/UserScript==

// Change the background, web title & cursor (For more cursors: http://www.rw-designer.com/gallery)
$("#gameCanvas").css('cursor', 'url(http://cur.cursors-4u.net/user/use-1/use153.cur), default');
document.title="MooMoo.io"
// Edit the hat keys (keycode.info):
(function() {
    'use strict';

    var ID_TankGear = 40;
    var ID_SoldierHelmet = 6;
    var ID_BullsHelmet = 7;
    var ID_BoosterHat = 12;
    var ID_EmpHelmet = 58;
    var ID_FlipperHat = 31;
    var ID_WinterHat = 15;

    document.addEventListener('keydown', function(e) {
        switch (e.keyCode) {

            case 82: storeEquip(ID_BullsHelmet); break; // R
            case 78: storeEquip(ID_TankGear); break; // N
            case 66: storeEquip(ID_SoldierHelmet); break; // B
            case 77: storeEquip(ID_BoosterHat); break; // M
            case 75: storeEquip(ID_FlipperHat); break; // K
            case 76: storeEquip(ID_WinterHat); break; // L
            case 74: storeEquip(ID_EmpHelmet); break; // J

        }
    });

})();