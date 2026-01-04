// ==UserScript==
// @name         Util Mod-(Part 3)
// @namespace    none
// @version      1
// @description  simple Hat Macro
// @icon https://moomoo.io/img/favicon.png?v=1
// @author       Axo
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/457825/Util%20Mod-%28Part%203%29.user.js
// @updateURL https://update.greasyfork.org/scripts/457825/Util%20Mod-%28Part%203%29.meta.js
// ==/UserScript==

setInterval(() => window.follmoo && follmoo(), 10);

function Hat(id){
    storeBuy(id);
    storeEquip(id);
}

document.addEventListener('keydown', function(e) {
    if (e.keyCode == 66 && document.activeElement.id.toLowerCase() !== 'chatbox') { // B for Solider
        Hat(6);
    }
    if (e.keyCode == 27 && document.activeElement.id.toLowerCase() !== 'chatbox') { // ESC for uneuip hat
        Hat(0);
    }
    if (e.keyCode == 71 && document.activeElement.id.toLowerCase() !== 'chatbox') { // G for Turret gear
        Hat(53);
    }
    if (e.keyCode == 16 && document.activeElement.id.toLowerCase() !== 'chatbox') { // SHIFT for booster hat
        Hat(12);
    }
    if (e.keyCode == 188 && document.activeElement.id.toLowerCase() !== 'chatbox') { // "," for snow hat
        Hat(15);
    }
    if (e.keyCode == 60 && document.activeElement.id.toLowerCase() !== 'chatbox') { // < for flipper hat
        Hat(31);;
    }
    if (e.keyCode == 90 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Z for tank gear
        Hat(40);
    }
    if (e.keyCode == 74 && document.activeElement.id.toLowerCase() !== 'chatbox') { // J for emp helmet
        Hat(22);
    }
    if (e.keyCode == 84 && document.activeElement.id.toLowerCase() !== 'chatbox') { // T for bull helmet
        Hat(7);
    }
    if (e.keyCode == 89 && document.activeElement.id.toLowerCase() !== 'chatbox') { // Y for samurai
        Hat(20);
    }
});