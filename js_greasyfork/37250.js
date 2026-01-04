// ==UserScript==
// @name         Vertix Better Mouse
// @namespace    http://vertix.io/
// @version      1.0.0
// @description  Changes the cursor to a high-resolution accurate cursor, and allows right-click secondary
// @author       dannytech
// @match        http://vertix.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37250/Vertix%20Better%20Mouse.user.js
// @updateURL https://update.greasyfork.org/scripts/37250/Vertix%20Better%20Mouse.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Right click secondary
    $("#cvs").mousedown(function(ev){
        if(ev.which == 3) {
            playerSwapWeapon(player, 1);
            setTimeout(shootBullet(player), 1);
            playerSwapWeapon(player, 1);
        }
    });
    $("canvas").css("cursor","url(https://s15.postimg.org/ka093ucbf/Hunter_Vertix_Cursor.png) 17 17, default"); // Accurate cursor
})();