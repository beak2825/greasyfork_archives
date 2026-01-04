// ==UserScript==
// @name         agarpowers text sizing and hide mana
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  main paneldeki yazıları büyütür.
// @icon         https://cdn.discordapp.com/emojis/853002908924510240.gif?v=1
// @author       RoyMan
// @match        http://62.68.75.115:90/
// @grant        RoyMan
// @downloadURL https://update.greasyfork.org/scripts/450516/agarpowers%20text%20sizing%20and%20hide%20mana.user.js
// @updateURL https://update.greasyfork.org/scripts/450516/agarpowers%20text%20sizing%20and%20hide%20mana.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();
/*
---------------------------------------------------
- Envanterdeki Mana Sayısını Gizler.

- Main Paneldeki Yazıları ve Fps, Ping, Cells, Players, Frozen Yazısını Büyütür.
---------------------------------------------------
*/
document.getElementById("ingame-stats-container").style.fontSize = "larger";




document.querySelector("#main-panel").style.fontSize = "larger";




$('#mana-count').hide($('#mana-count').hide());



          $(this).hide();      $(this).hide();

/*
----------------------------------------------------------------------------------------------------
ÖRNEK : https://cdn.discordapp.com/attachments/723840612373102603/1013818340298457118/unknown.png

ÖRNEK 2 : https://cdn.discordapp.com/attachments/1011304560339452004/1013816214197383268/unknown.png
-----------------------------------------------------------------------------------------------------
*/